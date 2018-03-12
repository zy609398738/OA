package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_TravelWriteoffBudget extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_WriteoffBudget_TO_BPM";
	private String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// 流程状态
		String WorkflowState = TypeConvertor.toString(args[4]);
		// rownum
		String rownum = TypeConvertor.toString(args[5]);
		// 预算数量
		String BudgetQty = TypeConvertor.toString(args[6]);
		// 源表名称
		String TableName = TypeConvertor.toString(args[7]);
		// 预算冻结或释放时默认为0
		String TaskId = TypeConvertor.toString(headTable.getObject("InstanceID").toString());
		// 类型预算冻结或释放时默认为APPLY
		String CostType = TypeConvertor.toString(args[8]);
		// 费用承担组织编号
		String BudgetOuCode = TypeConvertor.toString(headTable.getString("OU_CODE"));
		// 预算年
		String BudgetYear = TypeConvertor.toString(headTable.getString("BUD_Y"));
		// 预算月
		String BudgetMonth = TypeConvertor.toString(headTable.getString("BUD_M"));
		// 唯一标识（BudgetGUID）
		UUID uuid = UUID.randomUUID();
		String GUID = uuid.toString();	
		// 源任务ID
		String SourceTaskId = TypeConvertor.toString(headTable.getObject("InstanceID").toString());
		// 差旅费任务行号
		String TRIP_TaskLineId = "1";
		// 差旅费源任务行号
		String TRIP_SourceTaskLineId = "1";
		// 差旅费预算号
		String TRIP_BudgetNo = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_NO"));
		// 差旅费预算币种
		String TRIP_BudgetCurrency = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_CURRENCY"));
		// 差旅费冲销金额
		String TRIP_budgetwriteoffmoney = TypeConvertor.toString(headTable.getNumeric("Sum_T_FIAMO").toString());
		// 差旅费释放预算金额
		BigDecimal TRIP_BudgetOffsetAmount1 = headTable.getNumeric("TRIP_FEE_TOTAL");
		BigDecimal TRIP_BudgetOffsetAmount2 = headTable.getNumeric("TEE_OVER_AMOUNT");
		BigDecimal TRIP_BudgetOffsetAmount = BigDecimal.ZERO;
		TRIP_BudgetOffsetAmount = (TRIP_BudgetOffsetAmount1.add(TRIP_BudgetOffsetAmount2)).negate();		
		// 招待任务行号
		String GUEST_TaskLineId = "2";
		// 招待源任务行号
		String GUEST_SourceTaskLineId = "2";
		// 招待费预算号
		String GUEST_BudgetNo = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_NO"));
		// 招待费预算币种
		String GUEST_BudgetCurrency = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_CURRENCY"));
		// 招待费冲销预算金额
		String GUEST_budgetwriteoffmoney = headTable.getNumeric("SUM_G_FINA").toString();
		// 招待费释放预算金额
		BigDecimal GUEST_BudgetOffsetAmount1 = headTable.getNumeric("SUM_AMOUNT");
		BigDecimal GUEST_BudgetOffsetAmount2 = headTable.getNumeric("TGE_OVER_AMOUNT");
		BigDecimal GUEST_BudgetOffsetAmount = BigDecimal.ZERO;
		GUEST_BudgetOffsetAmount = (GUEST_BudgetOffsetAmount1.add(GUEST_BudgetOffsetAmount2)).negate();
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
		paramenter.put("p_org_id", BudgetOuCode);
		paramenter.put("p_source_task_id", SourceTaskId);
		paramenter.put("p_source_table", TableName);
		paramenter.put("p_task_id", TaskId);
		paramenter.put("p_action", WorkflowState);
		paramenter.put("p_type", CostType);
		paramenter.put("p_budget_year", BudgetYear);
		paramenter.put("p_budget_month", BudgetMonth);
		paramenter.put("p_budget_qty", BudgetQty);
		paramenter.put("p_gu_id", GUID);
		if (!TRIP_BudgetNo.isEmpty() && TRIP_BudgetNo != null) {
			// 执行插入本地日志
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, TRIP_BudgetNo, BudgetYear, BudgetMonth,
					TRIP_BudgetCurrency, TRIP_BudgetOffsetAmount, -1);
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, TRIP_BudgetNo, BudgetYear, BudgetMonth,
					TRIP_BudgetCurrency, TRIP_budgetwriteoffmoney, 1);
			paramenter.put("p_task_line_id", TRIP_TaskLineId);
			paramenter.put("p_source_task_line_id", TRIP_SourceTaskLineId);
			paramenter.put("p_currency_code", TRIP_BudgetCurrency);
			paramenter.put("p_budget_unit_price", TRIP_budgetwriteoffmoney);
			paramenter.put("p_budget_num", TRIP_BudgetNo);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
			if (returnStatus.equalsIgnoreCase("E")) {
				throw new Exception("冲销预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
						+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}
		}
		if (!GUEST_BudgetNo.isEmpty() && GUEST_BudgetNo != null) {
			// 执行插入本地日志
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, GUEST_BudgetNo, BudgetYear, BudgetMonth,
					GUEST_BudgetCurrency, GUEST_BudgetOffsetAmount, -1);
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, GUEST_BudgetNo, BudgetYear, BudgetMonth,
					GUEST_BudgetCurrency, GUEST_budgetwriteoffmoney, 1);
			paramenter.put("p_task_line_id", GUEST_TaskLineId);
			paramenter.put("p_source_task_line_id", GUEST_SourceTaskLineId);
			paramenter.put("p_currency_code", GUEST_BudgetCurrency);
			paramenter.put("p_budget_unit_price", GUEST_budgetwriteoffmoney);
			paramenter.put("p_budget_num", GUEST_BudgetNo);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
			if (returnStatus.equalsIgnoreCase("E")) {
				throw new Exception("冲销预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
						+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}

		}
		return true;

	}
}
