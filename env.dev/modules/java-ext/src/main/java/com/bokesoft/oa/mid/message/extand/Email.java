package com.bokesoft.oa.mid.message.extand;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map.Entry;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.email.EMailMidFunction;
import com.bokesoft.oa.mid.email.EmailDTO;
import com.bokesoft.oa.mid.email.EmailManager;
import com.bokesoft.oa.mid.email.GetEmailTemplate;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageTypeBase;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 邮件发送类型
 * 
 * @author minjian
 *
 */
public class Email extends MessageTypeBase {

	@Override
	public Object sendMessage(Message message) throws Throwable {
		OAContext oaContext = getContext();

		String formula = message.getSendFormula();
		Boolean isSend = true;
		if (!StringUtil.isBlankOrNull(formula)) {
			isSend = TypeConvertor.toBoolean(oaContext.getContext().getMidParser().eval(0, formula));
		}
		if (!isSend) {
			return "";
		}
		String receiverEmail = message.getMessageSetDtl().getReceiverEmail();
		String sendEmail = message.getMessageSetDtl().getSendEmail();
		String receiveIDs = message.getReceiveIDs().getIds();
		LinkedHashMap<String, List<String>> receiveEmailMap = getEmailMap(receiveIDs);

		String copyUserIDs = message.getCopyUserIDs().getIds();
		LinkedHashMap<String, List<String>> copyUserEmailMap = getEmailMap(copyUserIDs);

		String status = "发送成功";
		for (Iterator<Entry<String, List<String>>> i = receiveEmailMap.entrySet().iterator(); i.hasNext();) {
			Entry<String, List<String>> e = i.next();
			String nativeplace = e.getKey();
			List<String> receiveEmailList = e.getValue();
			String toUser = "";
			String toCopyUser = "";
			if (StringUtil.isBlankOrNull(receiverEmail)) {
				for (String email : receiveEmailList) {
					toUser = toUser + "," + email;
				}
				if (toUser.length() > 0) {
					toUser = toUser.substring(1);
				}
				List<String> copyUserEmailList = copyUserEmailMap.get(nativeplace);
				if (copyUserEmailList != null) {
					for (String email : copyUserEmailList) {
						toCopyUser = toCopyUser + "," + email;
					}
					if (toUser.length() > 0) {
						toCopyUser = toCopyUser.substring(1);
					}
				}
			} else {
				toUser = receiverEmail;
				if (copyUserEmailMap.size() > 0) {
					toCopyUser = receiverEmail;
				}
			}
			Long operatorId = message.getSendOptID();
			EMailMidFunction eMailMidFunction = new EMailMidFunction(oaContext);
			eMailMidFunction.emailConfig(operatorId);
			if (StringUtil.isBlankOrNull(sendEmail)) {
				EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
				sendEmail = emailDTO.getMailAddress();
			}
			String notes = message.getContent();
			String temp = GetEmailTemplate.getEmailTemplate(oaContext, message, nativeplace);
			if (!StringUtil.isBlankOrNull(temp)) {
				notes = temp;
			}
			String topic = message.getTopic();
			String sendStatus = eMailMidFunction.sendEmailToServer(operatorId, sendEmail, toUser, toCopyUser, topic,
					notes, "", "");
			if (!status.equals(sendStatus)) {
				return sendStatus;
			}

		}
		return status;
	}

	/**
	 * 获取邮件地址集合
	 * 
	 * @param ids
	 *            消息接收对象ID字符串
	 * @return 邮件地址集合
	 * @throws Throwable
	 */
	public LinkedHashMap<String, List<String>> getEmailMap(String ids) throws Throwable {
		LinkedHashMap<String, List<String>> emailMap = new LinkedHashMap<String, List<String>>();
		if (StringUtil.isBlankOrNull(ids)) {
			return emailMap;
		}
		String defNativeplace = OASettings.getSystemMessageType(getContext()).getMap("Email")
				.getProperty("Nativeplace");
		String sql = "select a.Email,Nativeplace from OA_Employee_H a join SYS_Operator b on a.oid = b.EmpID where b.OID in("
				+ ids + ") and a.Email is not null ";
		IDBManager dbManager = getContext().getContext().getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			String email = dtQuery.getString("Email");
			if (!StringUtil.isBlankOrNull(email)) {
				String nativeplace = dtQuery.getString("Nativeplace");
				if (StringUtil.isBlankOrNull(nativeplace)) {
					nativeplace = defNativeplace;
				}
				List<String> emailList = emailMap.get(nativeplace);
				if (emailList == null) {
					emailList = new ArrayList<String>();
					emailMap.put(nativeplace, emailList);
				}
				emailList.add(email);
			}
		}
		return emailMap;
	}
}
