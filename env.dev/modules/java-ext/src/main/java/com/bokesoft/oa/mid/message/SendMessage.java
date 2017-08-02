package com.bokesoft.oa.mid.message;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 由消息发送单据直接发送消息
 */

public class SendMessage implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 8) {
			return sendMessage(paramDefaultContext, TypeConvertor.toBoolean(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toDate(paramArrayList.get(2)),
					TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)),
					TypeConvertor.toString(paramArrayList.get(5)), TypeConvertor.toString(paramArrayList.get(6)),
					TypeConvertor.toLong(paramArrayList.get(7)), "", "", 0L);
		} else {
			return sendMessage(paramDefaultContext, TypeConvertor.toBoolean(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toDate(paramArrayList.get(2)),
					TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)),
					TypeConvertor.toString(paramArrayList.get(5)), TypeConvertor.toString(paramArrayList.get(6)),
					TypeConvertor.toLong(paramArrayList.get(7)), TypeConvertor.toString(paramArrayList.get(8)),
					TypeConvertor.toString(paramArrayList.get(9)), TypeConvertor.toLong(paramArrayList.get(10)));
		}
	}

	/**
	 * 由消息发送单据直接发送消息
	 * 
	 * @param context
	 *            上下文对象
	 * @param saveSendMessage
	 *            是否保存发送消息
	 * @param moduleKey
	 *            模块Key
	 * @param sendDate
	 *            发送时间
	 * @param sendOptID
	 *            发送人员
	 * @param topic
	 *            主题
	 * @param content
	 *            消息内容
	 * @param receiveIDs
	 *            接受人员
	 * @param messageSetID
	 *            发送消息设置
	 * @param srcBillKey
	 *            源表单Key
	 * @param srcBillNO
	 *            源表单编号
	 * @param srcOid
	 *            源表单OID
	 * @return
	 * @throws Throwable
	 */
	public static boolean sendMessage(DefaultContext context, Boolean saveSendMessage, String moduleKey, Date sendDate,
			Long sendOptID, String topic, String content, String receiveIDs, Long messageSetID, String srcBillKey,
			String srcBillNO, Long srcOid) throws Throwable {
		IDBManager dbManager = context.getDBManager();
		if (messageSetID <= 0) {
			String sql = "select oid from OA_MessageSet_H where IsDefault = 1";
			DataTable mdt = dbManager.execQuery(sql);
			if (mdt.size() <= 0) {
				throw new Error("没有找到默认的“消息设置”，无法发送消息");
			}
			messageSetID = mdt.getLong("oid");
		}
		OAContext oaContext = new OAContext(context, moduleKey);
		MessageSet messageSet = oaContext.getMessageSetMap().get(messageSetID);
		Message message = new Message(oaContext, saveSendMessage, saveSendMessage, moduleKey, sendDate, sendOptID,
				topic, content, receiveIDs, messageSet, srcBillKey, srcBillNO, srcOid);
		return sendMessage(oaContext, message);
	}

	/**
	 * 由消息发送单据直接发送消息
	 * 
	 * @param oaContext
	 *            上下文对象
	 * @param message
	 *            消息对象
	 * @return
	 * @throws Throwable
	 */
	public static boolean sendMessage(OAContext oaContext, Message message) throws Throwable {
		Boolean saveSendMessage = message.getSaveSendMessage();
		Long srcOid = message.getSrcOid();
		DefaultContext context = oaContext.getContext();
		IDBManager dbManager = context.getDBManager();
		Collection<MessageSetDtl> col = message.getMessageSet().getMessageSetDtlMap().values();
		Boolean isPreError = false;
		for (MessageSetDtl messageSetDtl : col) {
			Settings messageType = messageSetDtl.getMessageType();
			Boolean isContinue = true;
			if (messageType.containsProperty("Formula")) {
				String formula = messageType.getProperty("Formula");
				if (formula.length() > 0) {
					isContinue = TypeConvertor.toBoolean(context.getMidParser().eval(0, formula));
				}
			}
			if (!isContinue) {
				continue;
			}
			Boolean isSucceed = false;
			if (messageType.containsProperty("IsSucceed")) {
				isSucceed = TypeConvertor.toBoolean(messageType.getProperty("IsSucceed"));
			}
			if (isSucceed && isPreError) {
				continue;
			} else {
				isPreError = false;
			}
			message.setMessageSetDtl(messageSetDtl);
			String messageClasse = messageType.getPropertyOrEmpty("ClassePath");
			if (StringUtil.isBlankOrNull(messageClasse)) {
				throw new Error("消息类型=" + messageType.getPropertyOrEmpty("Name") + "，还未实现，请设置其他消息发送方式。");
			}
			MessageTypeBase messageTypeBase = (MessageTypeBase) Class.forName(messageClasse).newInstance();
			try {
				String result = TypeConvertor.toString("企业已过期，请重新联系供应商");
				message.setResult(result);
				messageTypeBase.sendMessage(oaContext, message);
				Boolean isSaveMessage = false;
				if (messageType.containsProperty("IsSaveMessage")) {
					isSaveMessage = TypeConvertor.toBoolean(messageType.getProperty("IsSaveMessage"));
				}
				if (!isSaveMessage) {
					continue;
				}
				if (saveSendMessage) {
					messageTypeBase.saveSendMessage(oaContext, message);
				} else {
					String sqlresult = "Update OA_SendMessages_H set VERID=VERID+1,Result= ? where OID=?";
					dbManager.execPrepareUpdate(sqlresult, result, srcOid);
				}
				messageTypeBase.receiveMessage(context, message);
			} catch (Throwable t) {
				t.printStackTrace();
				isPreError = true;

			}
		}
		return true;

	}

}
