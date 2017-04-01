package com.bokesoft.oa.mid.message.extand;

import java.util.ArrayList;

import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageTypeBase;
import com.bokesoft.oa.mid.sms.SmsSend;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class Sms extends MessageTypeBase {

	@Override
	public Object sendMessage(DefaultContext context, Message message) throws Throwable {
		String participants = message.getReceiveIDs().getIds();
		String toUser = "";
		String sql = "select a.SMobile from OA_Employee_H a join SYS_Operator b on a.oid = b.EmpID where b.OID in("
				+ participants + ") and a.SMobile is not null ";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			String sMobile = dtQuery.getString("SMobile");
			if (sMobile != null && sMobile.length() > 0) {
				toUser = toUser + ";" + sMobile;
			}
		}
		if (toUser.length() > 0) {
			toUser = toUser.substring(1);
		} else {
			return toUser;
		}

		ArrayList<Object> paras = new ArrayList<Object>();
		paras.add(0, null);
		paras.add(1, null);
		paras.add(2, null);
		paras.add(3, toUser);
		String content = message.getTopic() + "\r\n" + message.getContent();
		paras.add(4, content);
		paras.add(5, null);
		paras.add(6, null);
		paras.add(7, 1);
		return SmsSend.smsSend(paras);
	}

}
