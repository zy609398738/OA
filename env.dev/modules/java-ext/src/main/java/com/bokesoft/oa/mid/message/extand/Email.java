package com.bokesoft.oa.mid.message.extand;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.GetEmailTemplate;
import com.bokesoft.oa.mid.email.EMailMidFunction;
import com.bokesoft.oa.mid.email.EmailDTO;
import com.bokesoft.oa.mid.email.EmailManager;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageTypeBase;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class Email extends MessageTypeBase {

	@Override
	public Object sendMessage(OAContext oaContext, Message message) throws Throwable {
		DefaultContext context = oaContext.getContext();
		String participants = message.getReceiveIDs().getIds();
		String toUser = "";
		String sql = "select a.Email from OA_Employee_H a join SYS_Operator b on a.oid = b.EmpID where b.OID in("
				+ participants + ") and a.Email is not null ";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			String email = dtQuery.getString("Email");
			if (email != null && email.length() > 0) {
				toUser = toUser + "," + email;
			}
		}
		if (toUser.length() > 0) {
			toUser = toUser.substring(1);
		} else {
			return toUser;
		}
		Long operatorId = message.getSendOptID();
		EMailMidFunction eMailMidFunction = new EMailMidFunction(context);
		eMailMidFunction.emailConfig(false, operatorId);
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String notes = message.getContent();
		String temp = GetEmailTemplate.getEmailTemplate(oaContext, message.getSrcBillKey(), message.getEmailTemp());
		if (!StringUtil.isBlankOrNull(temp)) {
			notes = notes + "<br/>" + temp;
		}
		String topic = message.getTopic();
		return eMailMidFunction.sendEmailToServer(operatorId, emailDTO.getMailAddress(), toUser, "", topic, notes, "",
				"");
	}

}
