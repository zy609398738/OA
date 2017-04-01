package com.bokesoft.yigo.redist.originals.myscm;

import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;

import com.bokesoft.myerp.billmeta.EBillTableType;
import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.myerp.dev.common.Document;
import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContextTool;

/**
 * 与 Yigo 单据的 Document 操作相关的工具类
 * @see /Yigo-redist/trunk/Yigo-redist/products/configs/tmpl-myscm/config-lib/Module/SCM/Java/Source/com/bokesoft/yigo/redist/mid/DocTools.java,
 *      revision 5717 .
 */
public class DocTools {
	/**
	 * Reset document, 通常用于在生成 document 之后调整其初始值
	 * @param ctx
	 * @param doc
	 * @throws Throwable
	 */
	public static void resetDoc (IMidContext ctx, IDocument doc) throws Throwable{
		@SuppressWarnings("deprecation")
		int corpID = ctx.getEnv().getCorpID();
		int operID = ctx.getEnv().getOperatorID();
		resetDoc(ctx,doc, operID, corpID);
	}
	
	/**
	 * Reset document, 通常用于在生成 document 之后调整其初始值
	 * @param doc
	 * @param operatorId
	 * @param corpId
	 * @throws Throwable
	 */
	
	public static void resetDoc (IMidContext ctx,IDocument doc,int operatorId,int corpId) throws Throwable{
		int dbType = ctx.getEnv().getDBType();
		doc.reset();
		BKRowSet mainRst=doc.getRst(1);		
		mainRst.bkInsertRow();		
		EBillTableType metaTableType = doc.getMetaTable().TableType;
		String metaTableTypeStr = doc.getMetaTable().TableType.toString();
		try{
			mainRst.bkUpdateObject("CorpID", corpId);
		}catch(Exception ex){
			//部分单据没有 CorpID
		}
		String nowAsString = DateFormatUtils.format(new Date(),"yyyy-MM-dd HH:mm:ss");
		if(EBillTableType.ebttBill == metaTableType){
			//如果为单据,根据单据模板设置系统默认值
			mainRst.bkUpdateObject("Status", 10);
			if(dbType == 3){
				mainRst.bkUpdateObject("BillDate", nowAsString);
				mainRst.bkUpdateObject("MakeDate", nowAsString);				
				mainRst.bkUpdateObject("CheckDateTime", nowAsString);
				mainRst.bkUpdateObject("EditDate", nowAsString);		
			}else{
				mainRst.bkUpdateObject("BillDate", new Date());
				mainRst.bkUpdateObject("MakeDate", new Date());				
				mainRst.bkUpdateObject("CheckDateTime", new Date());
				mainRst.bkUpdateObject("EditDate", new Date());
			}
			mainRst.bkUpdateObject("Maker", operatorId);
			mainRst.bkUpdateObject("Mender", operatorId);
			mainRst.bkUpdateObject("Checker", operatorId);
		}else if(EBillTableType.ebttDictionary == metaTableType){
			//如果为字典,根据字典模板设置系统默认值
			if(dbType == 3){
				mainRst.bkUpdateObject("CreateTime", nowAsString);
				mainRst.bkUpdateObject("UpdateTime", nowAsString);	
			}else{				
				mainRst.bkUpdateObject("CreateTime", new Date());
				mainRst.bkUpdateObject("UpdateTime", new Date());
			}
			mainRst.bkUpdateObject("CreateByID", operatorId);
			mainRst.bkUpdateObject("UpdateByID", operatorId);
			mainRst.bkUpdateObject("Status", 0);
		}else{
			throw new RuntimeException("单据类型["+metaTableTypeStr+"],不支持");
		}
	}
	
	/**
	 * 保存 document 而不触发 SaveObject 的 Pre/Post Trigger
	 * @param ctx
	 * @param doc
	 * @throws Throwable
	 */
	public static void saveDocWithoutEvents(IMidContext ctx, IDocument doc) throws Throwable{
		int docBillID = doc.getID();
		String mainTableName = doc.getMetaTable().getTableName(1);
		if(docBillID == 0){
			docBillID = (Integer) MidContextTool.evaluate(ctx, doc, "GetAutoID("+mainTableName+",1)", "");
		}
		BKRowSet headRs =doc.getRst(1);
		EBillTableType metaTableType = doc.getMetaTable().TableType;
		String metaTableTypeStr = doc.getMetaTable().TableType.toString();

		int billID = -1;
			
		if(EBillTableType.ebttBill == metaTableType){
			//如果为单据,BillID是主键
			billID = headRs.bkGetInt("BILLID");
			if(billID == 0){
				billID = docBillID;				
				headRs.bkUpdateInt("BILLID", billID);
			}
			MidContextTool.saveBKRowSetData(ctx, headRs, mainTableName, "BillID");
		}else if(EBillTableType.ebttDictionary == metaTableType){
			//如果为字典,ID是主键
			billID = headRs.bkGetInt("ID");
			if(billID == 0){
				billID = docBillID;
				headRs.bkUpdateInt("ID", billID);
			}	
			MidContextTool.saveBKRowSetData(ctx, headRs, mainTableName, "ID");
		}else{
			throw new RuntimeException("单据类型["+metaTableTypeStr+"],不支持");
		}
		
		//需要判别字典或者单据?
		int talbes=doc.getMetaTable().GetTableCount();
		for(int i=2;i<=talbes;i++){
			String tableName = doc.getMetaTable().getTableName(i);
			BKRowSet rs =doc.getRst(i);
			rs.bkBeforeFirst();
			while(rs.bkNext()){
				if(EBillTableType.ebttBill == metaTableType){
					//如果为单据,BillID是主键
					billID = rs.bkGetInt("BILLID");
					if(billID == 0){
						billID = docBillID;				
						rs.bkUpdateInt("BILLID", billID);
					}
				}else if(EBillTableType.ebttDictionary == metaTableType){
					//如果为字典,ID是主键
					billID = rs.bkGetInt("ID");
					if(billID == 0){
						billID = docBillID;
						rs.bkUpdateInt("ID", billID);
					}	
				}else{
					throw new RuntimeException("单据类型["+metaTableTypeStr+"],不支持");
				}
				
				int dtl_billDtlID = rs.bkGetInt("BillDtlID");
				if(dtl_billDtlID==0){
					dtl_billDtlID = (Integer) MidContextTool.evaluate(ctx, doc, "GetAutoID("+tableName+",1)", "");
					rs.bkUpdateInt("BillDtlID", dtl_billDtlID);
				}	
			}
			MidContextTool.saveBKRowSetData(ctx, rs, tableName, "BillDtlID");
			rs.bkUpdateBatch();
		}
		//消除 BKRowSet 的状态
		BKRowSet[] rsts = ((Document)doc).getBillDocument().getVRst();
		for(int i=0; i<rsts.length; i++){
		    BKRowSet rs = rsts[i];
		    if (null!=rs){
		        rs.bkUpdateBatch();
		    }
		}
		
		//lockNum+1,单据的版本号+1
		String lockSql = "UPDATE SCM_LOCKNUM SET lockNum = lockNum+1 WHERE BillID=?";
		int updateCol = ctx.executePrepareUpdate(lockSql, new Object[]{docBillID});
		if(updateCol !=1){
			lockSql = "INSERT INTO SCM_LOCKNUM VALUES (?,1,0)";
			ctx.executePrepareUpdate(lockSql, new Object[]{docBillID});
		}
	}

}
