package com.bokesoft.tsl.service;

import java.util.Map;

import org.json.JSONObject;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetEmailInfoService implements IExtService2 {
	private static String SQL = "select h.workitemid,h.instanceid,h.operatorids,h.formkey,h.billoid,h.emailtype,d.instancestate "
			+ "from  OA_InstanceEmailMark h join bpm_instance d on h.instanceid=d.instanceid where h.oid=?";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		long emailID = TypeConvertor.toLong(args.get("emailID"));
		DataTable dt = context.getDBManager().execPrepareQuery(SQL, emailID);
		JSONObject jo = new JSONObject();
		if (dt.first()) {
			int emailType = dt.getInt("emailtype");
			String operatorids = "," + dt.getObject("operatorids").toString() + ",";
			boolean isCheckPass = operatorids.indexOf("," + context.getEnv().getUserID() + ",") >= 0;
			boolean onlyOpen = false;
			boolean isAdmin = false;
			switch (emailType) {
			case 40:
				isAdmin = true;
			case 10:
			case 50:
			case 60:
			case 80:
				onlyOpen = true;
				break;
			case 20:
			case 30:
			case 70:
				onlyOpen = false;
				break;
			}

			jo.put("instancestate", dt.getObject("instancestate"));
			jo.put("workitemid", dt.getObject("workitemid"));
			jo.put("instanceid", dt.getObject("instanceid"));
			jo.put("formkey", dt.getObject("formkey"));
			jo.put("billoid", dt.getObject("billoid"));

			jo.put("isAdmin", isAdmin);
			jo.put("isCheckPass", isCheckPass);
			jo.put("onlyOpen", onlyOpen);
		}

		return jo;
	}
}
