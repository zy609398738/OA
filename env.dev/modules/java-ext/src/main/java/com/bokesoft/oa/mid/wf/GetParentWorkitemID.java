package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class GetParentWorkitemID implements IExtService{

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getParentWorkitemID(paramDefaultContext,TypeConvertor.toLong(paramArrayList.get(0)));
	}

	public static Long getParentWorkitemID(DefaultContext context,Long workitemID) throws Throwable {
		if (workitemID<0) {
			return -1L;
		}
		Long parentWid = -1L;
		String sql= "select transfertype from wf_workitem where workitemid = ?";
		DataTable widDt = context.getDBManager().execPrepareQuery(sql, workitemID);
		if (widDt.size()>0) {
			Integer transfertype = widDt.getInt("transfertype");
			if (transfertype==3) {
				String sql3 = "select parentworkitemid from bpm_workiteminfo where workitemid = (select parentworkitemid from bpm_workiteminfo where workitemid =? )";
				DataTable parentWidDt = context.getDBManager().execPrepareQuery(sql3, workitemID);
				parentWid = parentWidDt.getLong("parentworkitemid");
			}else {
				String sql2 = "select parentworkitemid from bpm_workiteminfo where workitemid = ?"; 
				DataTable parentWidDt = context.getDBManager().execPrepareQuery(sql2, workitemID);
				parentWid = parentWidDt.getLong("parentworkitemid");
			}
		}
		return parentWid;
	}

}
