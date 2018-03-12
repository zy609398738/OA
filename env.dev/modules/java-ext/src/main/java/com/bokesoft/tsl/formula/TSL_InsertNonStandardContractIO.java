package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertNonStandardContractIO extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_INSERT_StandardContractIO_TO_ERP";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_NonSTDContrTMPL");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// 合同任务ID
		String task_id = TypeConvertor.toString(headTable.getObject("InstanceID"));
		// 组织ID
		String orgid = TypeConvertor.toString(headTable.getObject("OrgaID"));

		String[] oj = orgid.split(",");
		for (String org_id : oj) {
			// 接口调用
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
			paramenter.put("task_id", task_id);
			paramenter.put("org_id", org_id);

			// 执行BokeDee接口
			factory.executeAction(ACTION);
			// 返回执行结果
		}

		return true;
	}
}
