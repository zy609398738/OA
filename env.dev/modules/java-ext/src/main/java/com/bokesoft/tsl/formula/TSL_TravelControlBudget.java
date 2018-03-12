package com.bokesoft.tsl.formula;

import com.bokesoft.tsl.workflow.TSL_BudgetHandler;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class TSL_TravelControlBudget extends BaseMidFunctionImpl {
	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// 流程状态
		String WorkflowState = TypeConvertor.toString(args[4]);
		// 预算数量
		String BudgetQty = TypeConvertor.toString(args[5]);
		// 源表名称
		String TableName = TypeConvertor.toString(args[6]);
		// 预算冻结或释放时默认为0
		String TaskId = TypeConvertor.toString(args[7]);
		// 预算冻结或释放时默认为0
		String TaskLineId = TypeConvertor.toString(args[8]);
		// 类型预算冻结或释放时默认为APPLY
		String CostType = TypeConvertor.toString(args[9]);

		TSL_BudgetHandler handle = new TSL_BudgetHandler();
		handle.TravelControlBudget(context, billkey, flow, node, oid, WorkflowState, BudgetQty, TableName, TaskId, TaskLineId,
				CostType);

		return true;

	}
}
