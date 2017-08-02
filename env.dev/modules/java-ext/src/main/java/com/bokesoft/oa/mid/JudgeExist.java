package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 判断OptIDs是否包含指定人员对应的OptID
 * 
 * @author chenbiao
 * 
 */
public class JudgeExist implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return judgeExist(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toLong(paramArrayList.get(1)));
	}

	/**
	 * 判断OptIDs是否包含指定人员对应的OptID
	 * 
	 * @param context
	 *            上下文对象
	 * 
	 * @param optIDs
	 *            操作员ID字符串
	 * @param empID
	 *            人员ID
	 * @return
	 * @throws Throwable
	 */
	private boolean judgeExist(DefaultContext context, String optIDs, long empID) throws Throwable {
		String sql = "select oid from SYS_Operator where EmpID=?";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql, empID);
		long optID = dtQuery.getLong("oid");
		String[] OptIDs = optIDs.split(",");
		Long[] OptIDsL = new Long[OptIDs.length];
		for (int idx = 0; idx < OptIDs.length; idx++) {
			OptIDsL[idx] = Long.parseLong(OptIDs[idx]);
		}
		boolean flag = true;
		int i = 0;
		while (i < OptIDsL.length) {
			if (OptIDsL[i] == optID) {
				flag = false;
				break;
			}
			i++;
		}
		return flag;
	}

}
