package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_DeleteBudget extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_DeleteBudget_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		// TaskID
		String TaskId = headTable.getObject("InstanceID").toString();

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_task_id", TaskId);
		// 执行BokeDee接口
		factory.executeAction(ACTION);

		return true;
	}
}
