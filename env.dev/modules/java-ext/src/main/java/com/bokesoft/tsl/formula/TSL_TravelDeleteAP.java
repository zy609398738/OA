package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_TravelDeleteAP extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_DeleteINVOICE_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// TaskID
		String TaskId = headTable.getObject("InstanceID") + "_P";
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		if (!flow.isEmpty() && flow != null) {
			factory.addParameter("flow", flow);
		}
		if (!node.isEmpty() && node != null) {
			factory.addParameter("node", node);
		}
		if (!billkey.isEmpty() && billkey != null) {
			factory.addParameter("billkey", billkey);
		}
		if (!oid.isEmpty() && oid != null) {
			factory.addParameter("oid", oid);
		}
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_task_id", TaskId);
		// 执行BokeDee接口
		factory.executeAction(ACTION);

		return true;
	}
}
