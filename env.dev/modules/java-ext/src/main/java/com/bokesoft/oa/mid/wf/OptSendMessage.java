package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/*
 * 审批操作通过之后发送消息
 * 
 */
public class OptSendMessage implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return optSendMessage(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toLong(paramArrayList.get(2)),
				TypeConvertor.toLong(paramArrayList.get(3)), TypeConvertor.toDate(paramArrayList.get(4)),
				TypeConvertor.toLong(paramArrayList.get(5)));
	}

	/**
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            表单的key
	 * @param optKey
	 *            审批操作字典的代码标识
	 * @param workItemID
	 *            当前工作项标识的id
	 * @param workflowTypeDtlID
	 *            明细表id
	 * @return 不发送返回false,发送成功返回true
	 * @throws Throwable
	 * @throws Error
	 */
	private Object optSendMessage(DefaultContext context, String formKey, String optKey, Long workItemID, Long oid,
			Date time, Long workflowTypeDtlID) throws Throwable, Error {
		boolean sendMessage = false;
		if (optKey != null) {
			IDBManager dbm = context.getDBManager();
			if (oid != null && oid > 0) {
				String migrationSql = "select * from bpm_migration where BillOID=?";
				DataTable migrationDt = dbm.execPrepareQuery(migrationSql, oid);
				String optModuleSql = "select * from OA_OptModule_H where code = ?";
				DataTable dt = dbm.execPrepareQuery(optModuleSql, optKey);
				String operationName = dt.getString("Name");
				String content = "执行审批：" + operationName + "";
				Long sendType = dt.getLong("SendType");
				if (sendType > 0) {
					String ids = GetParticipatorList.getParticipatorList(context, workItemID, formKey,
							workflowTypeDtlID,",");
					sendMessage = SendMessage.sendMessage(context, false, "OA", time,
							context.getVE().getEnv().getUserID(), migrationDt.getString("Topic"), content, ids,
							sendType, formKey, migrationDt.getString("BillNo"), oid);
				}
			}
		}
		return sendMessage;
	}
}
