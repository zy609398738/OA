package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IUnsafeExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class GetRealUserName implements IUnsafeExtService2 {
	private String sql = "select * from oa_employee_H where adaccount=?";
	
	private String prefix = "trinasolar\\";
	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String code = args.get("userName").toString();
		
		String reValue = code;
		
		IDBManager dbManager = context.getDBManager();
		DataTable dt = dbManager.execPrepareQuery(sql, prefix + code);
		if (dt.size() == 0) {
			dt = dbManager.execPrepareQuery(sql, code);
			if (dt.size() > 0) {
				reValue = dt.getObject(0, "Code").toString();
			}
		} else {
			reValue = dt.getObject(0, "Code").toString();
		}
		
		return reValue;
	}
}
