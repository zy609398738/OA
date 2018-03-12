package com.bokesoft.tsl.workflow;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_BudgetHandler {
	/**
	 * 
	 * @param context
	 * @param billkey
	 * @param flow
	 * @param node
	 * @param oid
	 * @param WorkflowState
	 * @param rownum
	 * @param BudgetQty
	 * @param TableName
	 * @param TaskId
	 * @param TaskLineId
	 * @param CostType
	 * @throws Throwable
	 */
	public void TravelControlBudget(DefaultContext context, String billkey, String flow, String node, String oid,
			String WorkflowState, String rownum, String BudgetQty, String TableName, String TaskId, String TaskLineId,
			String CostType) throws Throwable {
		String ACTION = "ERP_ControlBudget_TO_BPM";
		String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";

		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		DataTable detailTable = document.get("B_CostApplyDtl");

		int rowCount = detailTable.size();
		UUID uuid = UUID.randomUUID();
		for (int index = 0; index < rowCount; index++) {
			// 预算币种
			String BudgetCurrency = detailTable.getString(index, "CurrencyDetail1");
			// 预算年
			String BudgetYear = detailTable.getString(index, "CAD_BudgetYear");
			// 预算月
			String BudgetMonth = detailTable.getString(index, "CAD_BudgetMonth");
			// 预算金额
			String BudgetOffsetMoney = detailTable.getNumeric(index, "Amount").toString();
			// 释放预算金额
			BigDecimal BudgetOffsetAmount = detailTable.getNumeric(index, "Amount");
			BudgetOffsetAmount = BudgetOffsetAmount.negate();
			// 预算号
			String BudgetNo = detailTable.getString(index, "CAD_BudgetNo");
			// 预算承担组织编号
			String BudgetOuCode = headTable.getString("OU_Code");
			// 唯一标识（自动生成）
			String GUID = uuid.toString();
			// 源任务ID
			String SourceTaskId = headTable.getObject("InstanceID").toString();
			// 源任务明细ID
			int taskLineid = index + 1;
			String SourceTaskLineId = taskLineid + "";

			// 执行插入本地日志
			if (WorkflowState.equalsIgnoreCase("S")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, BudgetNo, BudgetYear, BudgetMonth,
						BudgetCurrency, BudgetOffsetMoney, 1);
			} else if (WorkflowState.equalsIgnoreCase("R")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, BudgetNo, BudgetYear, BudgetMonth,
						BudgetCurrency, BudgetOffsetAmount, -1);
			}
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
			paramenter.put("p_currency_code", BudgetCurrency);
			paramenter.put("p_budget_year", BudgetYear);
			paramenter.put("p_budget_month", BudgetMonth);
			paramenter.put("p_budget_qty", BudgetQty);
			paramenter.put("p_budget_unit_price", BudgetOffsetMoney);
			paramenter.put("p_budget_num", BudgetNo);
			paramenter.put("p_org_id", BudgetOuCode);
			paramenter.put("p_gu_id", GUID);
			paramenter.put("p_source_task_id", SourceTaskId);
			paramenter.put("p_source_task_line_id", SourceTaskLineId);
			paramenter.put("p_source_table", TableName);
			paramenter.put("p_task_id", TaskId);
			paramenter.put("p_task_line_id", TaskLineId);
			paramenter.put("p_action", WorkflowState);
			paramenter.put("p_type", CostType);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
			if (returnStatus.equalsIgnoreCase("n")) {
				throw new Exception(
						"冻结预算失败，预算号：" + BudgetNo + ".错误信息：" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}
		}
	}
	
	/**
	 * 
	 * @param context
	 * @param billkey
	 * @param flow
	 * @param node
	 * @param oid
	 * @param WorkflowState
	 * @param BudgetQty
	 * @param TableName
	 * @param TaskId
	 * @param TaskLineId
	 * @param CostType
	 * @throws Throwable
	 */
	public void TravelControlBudget(DefaultContext context, String billkey, String flow, String node, String oid,
			String WorkflowState, String BudgetQty, String TableName, String TaskId, String TaskLineId, String CostType)
			throws Throwable {
		String ACTION = "ERP_ControlBudget_TO_BPM";
		String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
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
		// 差旅费rownum
		String TRIP_rownum = "1";
		// 差旅费源任务行号
		String TRIP_SourceTaskLineId = "1";
		// 差旅费预算号
		String TRIP_BudgetNo = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_NO"));
		// 差旅费预算币种
		String TRIP_BudgetCurrency = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_CURRENCY"));
		// 差旅费预算金额
		String TRIP_BudgetOffsetMoney = TypeConvertor.toString(headTable.getNumeric("TRIP_FEE_TOTAL").toString());
		// 差旅费释放预算金额
		BigDecimal TRIP_BudgetOffsetAmount = headTable.getNumeric("TRIP_FEE_TOTAL");
		TRIP_BudgetOffsetAmount = TRIP_BudgetOffsetAmount.negate();
		// 招待费rownum
		String GUEST_rownum = "2";
		// 招待源任务行号
		String GUEST_SourceTaskLineId = "2";
		// 招待费预算号
		String GUEST_BudgetNo = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_NO"));
		// 招待费预算币种
		String GUEST_BudgetCurrency = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_CURRENCY"));
		// 招待费预算金额
		String GUEST_BudgetOffsetMoney = TypeConvertor.toString(headTable.getNumeric("GUEST_AMOUNT_AP").toString());
		// 招待费释放预算金额
		BigDecimal GUEST_BudgetOffsetAmount = headTable.getNumeric("GUEST_AMOUNT_AP");

		GUEST_BudgetOffsetAmount = GUEST_BudgetOffsetAmount.negate();
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
		paramenter.put("p_task_line_id", TaskLineId);
		paramenter.put("p_action", WorkflowState);
		paramenter.put("p_type", CostType);
		paramenter.put("p_budget_year", BudgetYear);
		paramenter.put("p_budget_month", BudgetMonth);
		paramenter.put("p_budget_qty", BudgetQty);
		paramenter.put("p_gu_id", GUID);
		if (!TRIP_BudgetNo.isEmpty() && !TRIP_BudgetNo.equalsIgnoreCase("null")) {
			// 执行插入本地日志
			if (WorkflowState.equalsIgnoreCase("S")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, TRIP_rownum, TRIP_BudgetNo, BudgetYear,
						BudgetMonth, TRIP_BudgetCurrency, TRIP_BudgetOffsetMoney, 1);
			} else if (WorkflowState.equalsIgnoreCase("R")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, TRIP_rownum, TRIP_BudgetNo, BudgetYear,
						BudgetMonth, TRIP_BudgetCurrency, TRIP_BudgetOffsetAmount, -1);
			}
			paramenter.put("p_source_task_line_id", TRIP_SourceTaskLineId);
			paramenter.put("p_currency_code", TRIP_BudgetCurrency);
			paramenter.put("p_budget_unit_price", TRIP_BudgetOffsetMoney);
			paramenter.put("p_budget_num", TRIP_BudgetNo);

			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
			if (returnStatus.equalsIgnoreCase("E")) {
				throw new Exception("冻结预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
						+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}
		}
		if (GUEST_BudgetNo != null && !GUEST_BudgetNo.isEmpty()) {
			if (WorkflowState.equalsIgnoreCase("S")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, GUEST_rownum, GUEST_BudgetNo, BudgetYear,
						BudgetMonth, GUEST_BudgetCurrency, GUEST_BudgetOffsetMoney, 1);
			} else if (WorkflowState.equalsIgnoreCase("R")) {
				context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, GUEST_rownum, GUEST_BudgetNo, BudgetYear,
						BudgetMonth, GUEST_BudgetCurrency, GUEST_BudgetOffsetAmount, -1);
			}
			paramenter.put("p_source_task_line_id", GUEST_SourceTaskLineId);
			paramenter.put("p_currency_code", GUEST_BudgetCurrency);
			paramenter.put("p_budget_unit_price", GUEST_BudgetOffsetMoney);
			paramenter.put("p_budget_num", GUEST_BudgetNo);
			// 执行BokeDee接口
			String stringJson = factory.executeAction(ACTION);
			// 获取返回值，并转换为JSONObject
			JSONObject reJSONObject = JSONObject.parseObject(stringJson);
			String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
			if (returnStatus.equalsIgnoreCase("E")) {
				throw new Exception("冻结预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
						+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}

		}
	}
	/**
	 * 
	 * @param context
	 * @param billkey
	 * @param flow
	 * @param node
	 * @param oid
	 * @param WorkflowState
	 * @param BudgetQty
	 * @param TableName
	 * @param TaskId
	 * @param TaskLineId
	 * @param CostType
	 * @throws Throwable
	 */
	public void TravelControlBeyondBudget(DefaultContext context, String billkey, String flow, String node, String oid,
			String WorkflowState, String BudgetQty, String TableName, String TaskId, String TaskLineId, String CostType)
			throws Throwable {
		 String ACTION = "ERP_ControlBudget_TO_BPM";
		 String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";

			Document document = context.getDocument();
			DataTable headTable = document.get("B_TravelExpenseApply");
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
			// 差旅费rownum
			String TRIP_rownum = "3";
			// 差旅费源任务行号
			String TRIP_SourceTaskLineId = "1";
			// 差旅费预算号
			String TRIP_BudgetNo = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_NO"));
			// 差旅费预算币种
			String TRIP_BudgetCurrency = TypeConvertor.toString(headTable.getString("TRIP_BUDGET_CURRENCY"));
			// 差旅费预算金额
			String TRIP_BudgetOffsetMoney = TypeConvertor.toString(headTable.getNumeric("TEE_OVER_AMOUNT").toString());
			// 差旅费释放预算金额
			BigDecimal TRIP_BudgetOffsetAmount = headTable.getNumeric("TEE_OVER_AMOUNT");
			TRIP_BudgetOffsetAmount = TRIP_BudgetOffsetAmount.negate();
			// 招待费rownum
			String GUEST_rownum = "4";
			// 招待源任务行号
			String GUEST_SourceTaskLineId = "2";
			// 招待费预算号
			String GUEST_BudgetNo = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_NO"));
			// 招待费预算币种
			String GUEST_BudgetCurrency = TypeConvertor.toString(headTable.getString("GUEST_BUDGET_CURRENCY"));
			// 招待费预算金额
			String GUEST_BudgetOffsetMoney = TypeConvertor.toString(headTable.getNumeric("TGE_OVER_AMOUNT").toString());
			// 招待费释放预算金额
			BigDecimal GUEST_BudgetOffsetAmount = headTable.getNumeric("TGE_OVER_AMOUNT");

			GUEST_BudgetOffsetAmount = GUEST_BudgetOffsetAmount.negate();
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
			paramenter.put("p_task_line_id", TaskLineId);
			paramenter.put("p_action", WorkflowState);
			paramenter.put("p_type", CostType);
			paramenter.put("p_budget_year", BudgetYear);
			paramenter.put("p_budget_month", BudgetMonth);
			paramenter.put("p_budget_qty", BudgetQty);
			paramenter.put("p_gu_id", GUID);
			if (!TRIP_BudgetNo.isEmpty() && TRIP_BudgetNo !=null ) {	
				// 执行插入本地日志
				if (WorkflowState.equalsIgnoreCase("S")) {
					context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, TRIP_rownum, TRIP_BudgetNo, BudgetYear,
							BudgetMonth, TRIP_BudgetCurrency, TRIP_BudgetOffsetMoney, 1);
				} else if (WorkflowState.equalsIgnoreCase("R")) {
					context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, TRIP_rownum, TRIP_BudgetNo, BudgetYear,
							BudgetMonth, TRIP_BudgetCurrency, TRIP_BudgetOffsetAmount, -1);
				}
				paramenter.put("p_source_task_line_id", TRIP_SourceTaskLineId);
				paramenter.put("p_currency_code", TRIP_BudgetCurrency);
				paramenter.put("p_budget_unit_price", TRIP_BudgetOffsetMoney);
				paramenter.put("p_budget_num", TRIP_BudgetNo);
				// 执行BokeDee接口
				String stringJson = factory.executeAction(ACTION);
				// 获取返回值，并转换为JSONObject
				JSONObject reJSONObject = JSONObject.parseObject(stringJson);
				String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
				if (returnStatus.equalsIgnoreCase("E")) {
					throw new Exception("冻结预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
							+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
				}
			}
			if (!GUEST_BudgetNo.isEmpty() && GUEST_BudgetNo != null) {
				if (WorkflowState.equalsIgnoreCase("S")) {
					context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, GUEST_rownum, GUEST_BudgetNo, BudgetYear,
							BudgetMonth, GUEST_BudgetCurrency, GUEST_BudgetOffsetMoney, 1);
				} else if (WorkflowState.equalsIgnoreCase("R")) {
					context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, GUEST_rownum, GUEST_BudgetNo, BudgetYear,
							BudgetMonth, GUEST_BudgetCurrency, GUEST_BudgetOffsetAmount, -1);
				}
				paramenter.put("p_source_task_line_id", GUEST_SourceTaskLineId);
				paramenter.put("p_currency_code", GUEST_BudgetCurrency);
				paramenter.put("p_budget_unit_price", GUEST_BudgetOffsetMoney);
				paramenter.put("p_budget_num", GUEST_BudgetNo);
				// 执行BokeDee接口
				String stringJson = factory.executeAction(ACTION);
				// 获取返回值，并转换为JSONObject
				JSONObject reJSONObject = JSONObject.parseObject(stringJson);
				String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
				if (returnStatus.equalsIgnoreCase("E")) {
					throw new Exception("冻结预算失败，预算号：" + TRIP_BudgetNo + ".错误信息："
							+ TypeConvertor.toString(reJSONObject.get("x_msg_data")));
				}

			}
	}
}
