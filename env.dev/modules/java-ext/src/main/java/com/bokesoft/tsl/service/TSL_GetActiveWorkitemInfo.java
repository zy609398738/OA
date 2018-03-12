package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetActiveWorkitemInfo implements IExtService2 {
	String sql = "select wi.workitemid,wi.workitemname,wi.nodeid,p.operatorid from wf_workitem wi join bpm_workiteminfo wii on wi.workitemid=wii.workitemid join wf_participator p on p.workitemid=wi.workitemid where wii.instanceid=? and wi.workitemstate=1";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		long instanceID = TypeConvertor.toLong(args.get("instanceID"));
		IDBManager dbManager = context.getDBManager();
		
		DataTable dt = new DataTable();
		dt.addColumn(new ColumnInfo("Value", DataType.STRING));
		dt.addColumn(new ColumnInfo("Key", DataType.STRING));
		if (instanceID > 0) {
			DataTable workitemInfoDt =  dbManager.execPrepareQuery(sql, instanceID);
			workitemInfoDt.beforeFirst();
			while(workitemInfoDt.next()) {
				long workItemID = workitemInfoDt.getLong("workitemid");
				long operatorID = workitemInfoDt.getLong("operatorid");
				int nodeID = workitemInfoDt.getInt("nodeid");
				String workItemName = TypeConvertor.toString(workitemInfoDt.getObject("workitemname"));
				
				String name = DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "Name").toString();
				long empID = TypeConvertor.toLong(DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "EmpID"));
				String adAccount = DictCacheUtil.getDictValue(context.getVE(), "Dict_Employee", empID, "ADAccount").toString();
				String operatorName = name + "(" + adAccount + ")";
				
				dt.append();
				dt.setObject("Value", workItemID + "-" + operatorID);
				dt.setObject("Key", workItemName + "(" + operatorName + ")");
			}
		}
		
		return dt;
	}
}
