package com.bokesoft.yigo.redist.originals.myscm;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.myerp.billmeta.BillDocument;
import com.bokesoft.myerp.billmeta.BillMetaUIOpt;
import com.bokesoft.myerp.common.DataConstant;
import com.bokesoft.myerp.dev.common.Document;
import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContext;
import com.bokesoft.myerp.dev.mid.MidContextTool;
import com.bokesoft.myerp.mid.BillMidLib.MBillContext;
import com.bokesoft.myerp.workflow.engine.nodes.abstractExecNode;
import com.bokesoft.myerp.workflow.mid.base.MWorkflowExecContext;

/**
 * 与客户端操作相关的服务器端工具类
 * @see /Yigo-redist/trunk/Yigo-redist/products/configs/tmpl-myscm/config-lib/Module/SCM/Java/Source/com/bokesoft/yigo/redist/mid/OptTools.java,
 *      revision 4723 .
 */
public class OptTools {
	private static ThreadLocal<String> uiOptInThread = new ThreadLocal<String>();
    private static final Logger log = Logger.getLogger(OptTools.class);
	
	/**
	 * 获取上下文中存放的客户端操作 Key, 如果不在一个操作的环境中, 返回 null;
	 * 注意: 在不同运行环境下, 实际返回的 Key 不保证其大小写形式
	 * @param midCtx
	 * @return
	 * @throws Throwable
	 */
	public static String getOptKey (IMidContext midCtx) throws Throwable {
		return getOptKey(((MidContext)midCtx).getBillContext());
	}
	
	/**
	 * 获取上下文中存放的客户端操作 Key, 如果不在一个操作的环境中, 返回 null;
	 * 注意: 在不同运行环境下, 实际返回的 Key 不保证其大小写形式
	 * @param billCtx
	 * @return
	 */
	public static String getOptKey (MBillContext billCtx) {
		Object key = billCtx.getAttribute(DataConstant.UIOPT_KEY);	//"UIOPT_KEY"
		
		//兼容在工作流中为状态节点设置 "子操作" 的情况
		if (null==key){
			MWorkflowExecContext wfc = (MWorkflowExecContext)billCtx.getExtendContext();
			if (null!=wfc){
				abstractExecNode node = wfc.getCurExecNode();
				if (null!=node){
					String custData = node.getNode().getCustomData();
					if (null!=custData){
						try{
							JSONObject obj = JSON.parseObject(custData);
							key = obj.get("UIOpt");
						}catch(Exception ex){
							log.error("解析节点客户数据 ["+custData+"] 错误:", ex);
						}
					}
				}
			}
		}
		
		//兼容 midEvalAsUiOpt 方法
		if (null==key){
			key = uiOptInThread.get();
		}
		
		if (null==key){
			return null;
		}
		
		String opKey = key.toString();
		//如果操作来自一个附加配置, 字符串是一个 OptKey|ConfigName 的形式, 所以需要预先去掉最后一个 "|"
		int spIdx = opKey.lastIndexOf('|');
		if (spIdx > 0){
			opKey = opKey.substring(0, spIdx);
		}
		return opKey;
	}
	
	/**
	 * 比较当前是否在指定的操作中
	 * @param midCtx
	 * @param optKey
	 * @return
	 * @throws Throwable
	 */
	public static boolean matchOptKey(IMidContext midCtx, String optKey) throws Throwable{
		return matchOptKey(((MidContext)midCtx).getBillContext(), optKey);
	}
	
	/**
	 * 比较当前是否在指定的操作中
	 * @param billCtx
	 * @param optKey
	 * @return
	 */
	public static boolean matchOptKey(MBillContext billCtx, String optKey){
		String key = getOptKey(billCtx);
		if (null==key){
			return false;
		}
		return key.equalsIgnoreCase(optKey);
	}
	
	/**
	 * 获得当前执行的客户端操作的名称
	 * @param midCtx
	 * @return
	 * @throws Throwable
	 */
	public static String getOptName (IMidContext midCtx) throws Throwable {
		return getOptName(((MidContext)midCtx).getBillContext());
	}
	
	/**
	 * 获得当前执行的客户端操作的名称
	 * @param billCtx
	 * @return
	 */
	public static String getOptName (MBillContext billCtx) {
		String optKey = getOptKey(billCtx);
		if (null==optKey) return null;
		BillDocument doc = billCtx.getBillDoc();
		return getOptName(doc, optKey);
	}

	/**
	 * 获得客户端操作的名称
	 * @param doc
	 * @param optKey
	 * @return
	 */
	public static String getOptName(IDocument doc, String optKey) {
		BillDocument bd = ((Document)doc).getBillDocument();
		return getOptName(bd, optKey);
	}
	/**
	 * 获得客户端操作的名称
	 * @param doc
	 * @param optKey
	 * @return
	 */
	public static String getOptName(BillDocument doc, String optKey) {
		optKey = optKey.toUpperCase();
		
		boolean isReserve = false;
		String reservePostfix = "-R";	//反向操作以 "-R" 结尾
		if (optKey.endsWith(reservePostfix)){
			isReserve = true;
			optKey = optKey.substring(0, optKey.length()-reservePostfix.length());
		}
		BillMetaUIOpt opt = doc.getMetaTable().getUIOpt(optKey);
		if (null==opt) return null;
		if (isReserve){
			return opt.ReserveCaption;
		}else{
			return opt.Caption;
		}
	}
	
	/**
	 * 模拟执行某个客户端操作的情况下调用中间层公式
	 * @param ctx
	 * @param doc
	 * @param formula
	 * @param uiOptKey
	 * @return
	 * @throws Throwable 
	 */
	public static Object midEvalAsUiOpt(IMidContext ctx, IDocument doc, String formula, String uiOptKey) throws Throwable{
		try{
			uiOptInThread.set(uiOptKey);
			return MidContextTool.evaluate(ctx, doc, formula, "模拟 UI 操作 ["+uiOptKey+"] 执行: " + formula);
		}finally{
			uiOptInThread.remove();
		}
	}
}
