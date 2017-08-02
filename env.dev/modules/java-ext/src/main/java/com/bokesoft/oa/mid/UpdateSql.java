package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 更新常用流程中是否常用字段
 * 
 * @author zhoukh
 *
 */

public class UpdateSql implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return updateSql(paramDefaultContext);
	}

	public Boolean updateSql(DefaultContext context) throws Throwable {
		Document d = context.getDocument();
		IDBManager dbManager = context.getDBManager();
		DataTable dt = d.get("OA_CommonWorkflow");
		String sql = "select IsCommon from OA_WorkflowType_D where oid =?";
		dt.beforeFirst();
		while (dt.next()) {
			int isCommon = dt.getInt("IsCommon");
			Long oid = dt.getLong("OID");
			DataTable dt2 = context.getDBManager().execPrepareQuery(sql, oid);
			if (isCommon == dt2.getInt("IsCommon")) {
				continue;
			} else {
				String updateSql = "update OA_WorkflowType_D set iscommon = ? where oid =?";
				dbManager.execPrepareUpdate(updateSql, isCommon, oid);
			}
		}
		return true;
	}

}
