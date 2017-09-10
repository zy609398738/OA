package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.common.struct.MultiKey;
import com.bokesoft.yes.common.struct.MultiKeyNode;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_WriteoffBudget extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_WriteoffBudget_TO_BPM";
	private String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		DataTable detailTable = document.get("B_CostApplyCE");

		String rownum = TypeConvertor.toString(args[0]);
		HashMap<MultiKey, ArrayList<Integer>> map = new HashMap<MultiKey, ArrayList<Integer>>();
		int rowCount = detailTable.size();
		for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			MultiKey key = new MultiKey();
			// key.addValue(new MultiKeyNode(DataType.STRING,
			// detailTable.getString("CEDetail_ID")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_BudgetNo")));
			ArrayList<Integer> list = map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				map.put(key, list);
			}

			list.add(rowIndex);
		}
		Iterator<ArrayList<Integer>> it = map.values().iterator();
		while (it.hasNext()) {
			// 预算金额
			BigDecimal BudgetOffsetMoney = detailTable.getNumeric("CEDetail_BudCurrencyAmt");
			BudgetOffsetMoney = BudgetOffsetMoney.negate();
			// 冲销金额
			BigDecimal budgetwriteoffmoney = BigDecimal.ZERO;
			// 预算币种
			String BudgetCurrency = "";
			// 预算年
			String BudgetYear = "";
			// 预算月
			String BudgetMonth = "";
			// 预算数量
			String BudgetQty = TypeConvertor.toString(args[1]);
			// 预算号
			String BudgetNo = "";
			// 预算承担组织编号
			String BudgetOuCode = "";
			// 唯一标识（自动生成）
			String GUID = "";
			// 源任务ID
			String SourceTaskId = "";
			// 源任务明细ID
			String SourceTaskLineId = "";
			// 源表名称
			String TableName = TypeConvertor.toString(args[2]);
			// 任务ID
			String TaskId = "";
			// 任务明细ID
			String TaskLineId = "";
			// 预算冲销默认S
			String WorkflowState = TypeConvertor.toString(args[3]);
			// 预算冲销默认为EXPENSE
			String CostType = TypeConvertor.toString(args[4]);
			boolean bFirst = true;
			ArrayList<Integer> list = it.next();
			for (int rowIndex : list) {
				if (bFirst) {
					BudgetCurrency = detailTable.getString(rowIndex, "CEDetail_BudCurrency");
					BudgetYear = detailTable.getString(rowIndex, "CEDetail_BudgetYear");
					BudgetMonth = detailTable.getString(rowIndex, "CEDetail_BudgetMonth");
					BudgetNo = detailTable.getString(rowIndex, "CEDetail_BudgetNo");
					BudgetOuCode = headTable.getString("OU_Code");
					GUID = System.currentTimeMillis() + "";
					SourceTaskId = headTable.getObject("InstanceID").toString();
					SourceTaskLineId = detailTable.getObject(rowIndex, "CEDetail_ID").toString();
					TaskId = headTable.getObject("InstanceID").toString();
					TaskLineId = detailTable.getObject(rowIndex, "CEDetail_ID").toString();
				}
				// 汇总
				// CEDetail_BudgetCurrency转换预算币种金额（根据CEDetail_ID，CEDetail_BudgetNo分组求和）
				budgetwriteoffmoney = budgetwriteoffmoney
						.add(detailTable.getNumeric(rowIndex, "CEDetail_RateToBudgetCurrency"));
				bFirst = false;
			}
			//
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, BudgetNo, BudgetYear, BudgetMonth,
					BudgetCurrency, BudgetOffsetMoney, -1);
			context.getDBManager().execPrepareUpdate(SQL, SourceTaskId, rownum, BudgetNo, BudgetYear, BudgetMonth,
					BudgetCurrency, budgetwriteoffmoney, 1);
			// 接口调用
			TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
			HashMap<String, String> paramenter = factory.getParameter();
			paramenter.put("p_currency_code", BudgetCurrency);
			paramenter.put("p_budget_year", BudgetYear);
			paramenter.put("p_budget_month", BudgetMonth);
			paramenter.put("p_budget_qty", BudgetQty);
			paramenter.put("p_budget_unit_price", budgetwriteoffmoney.toPlainString());
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
						"冲销预算失败，预算号：" + BudgetNo + ".错误信息：" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
			}
		}

		return true;
	}
}
