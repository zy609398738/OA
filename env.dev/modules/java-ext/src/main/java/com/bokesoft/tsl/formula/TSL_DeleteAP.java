package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_DeleteAP extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_DeleteINVOICE_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		String SQL = "select distinct CEDetail_PaymentType from B_CostApplyCE WHERE SOID = ?";
		DataTable dt = context.getDBManager().execPrepareQuery(SQL, document.getOID());
		// paymenttype
		String paymenttype = null;
		if (dt.size() > 0) {
			// 获取SQL查询值赋给变量
			paymenttype = dt.getString(0, 0);
		}
		// TaskID
		String TaskId = null;
		if (paymenttype == null) {
			TaskId = headTable.getObject("InstanceID").toString();
		} else if (paymenttype.equalsIgnoreCase("PersonalPayment")) {
			TaskId = headTable.getObject("InstanceID") + "_P";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			TaskId = headTable.getObject("InstanceID") + "_C";
		}
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_task_id", TaskId);
		// 执行BokeDee接口
		factory.executeAction(ACTION);

		return true;
	}
}
