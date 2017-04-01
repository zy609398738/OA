package com.bokesoft.oa.mid.email;

import java.util.Map;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.schedule.DefaultScheduleJob;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class EmailReceiveJob extends DefaultScheduleJob {

	@Override
	public void doJob(DefaultContext context, Map<String, Object> arg1) throws Throwable {
		String sql = "select * from  oa_emailset_h a where a.IsDefault = 1 and a.AutoReceive = 1";
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		if (dt.size() > 0) {
			dt.beforeFirst();
			while (dt.next()) {
				Long operatorId = dt.getLong("OperatorID");
				EMailMidFunction eMailMidFunction = new EMailMidFunction(context);
				eMailMidFunction.emailConfig(false, operatorId);
				eMailMidFunction.receiveEmail(operatorId);
			}
		}
		context.commit();
	}

}
