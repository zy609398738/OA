package com.bokesoft.oa.mid.email;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 
 * @author minjian
 *
 */
public class SendEmailByOptSplit implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return sendEmailByOptSplit(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));

	}

	/**
	 * 根据参与人员获取邮箱名
	 * 
	 * @param context
	 *            中间层对象
	 * @param participants
	 *            参与人员
	 * @param sep
	 *            分隔符
	 * @return 列内容的数组
	 * @throws Throwable
	 */
	public static String sendEmailByOptSplit(DefaultContext context, Long operatorId, String sep) throws Throwable {
		Document doc = context.getDocument();
		DataTable dt = doc.get("OA_MeetingInSide_H");
		String participants = dt.getString("Participants");
		Long meetingRoom = dt.getLong("MeetingRoom");
		String toUser = "";
		String sql = "select a.Email from OA_Employee_H a where a.OID in(" + participants + ") ";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			String email = dtQuery.getString("Email");
			if (email != null && email.length() > 0) {
				toUser = toUser + sep + email;
			}
		}
		if (toUser.length() > 0) {
			toUser = toUser.substring(1);
		} else {
			return toUser;
		}
		EMailMidFunction eMailMidFunction = new EMailMidFunction(context);
		eMailMidFunction.emailConfig(false, operatorId);
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
		String date1 = sdf.format(dt.getDateTime("StartTime"));
		String date2 = sdf.format(dt.getDateTime("EndTime"));
		String sql1 = "select Name from OA_MeetingRoom_H where OID=?";
		DataTable dtQuery1 = dbManager.execPrepareQuery(sql1, meetingRoom);
		String MeetingRoom = dtQuery1.getString("Name");
		String notes = "主题：" + dt.getString("Topic") + "。  时间：" + date1 + "~" + date2 + "。 地点：" + MeetingRoom + "。 内容："
				+ dt.getString("Notes");
		return eMailMidFunction.sendEmailToServer(operatorId, emailDTO.getMailAddress(), toUser, "",
				dt.getString("Topic"), notes, "", "");

	}
}
