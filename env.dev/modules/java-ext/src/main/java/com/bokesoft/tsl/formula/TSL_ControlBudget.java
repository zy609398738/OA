package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_ControlBudget extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_ControlBudget_TO_BPM";
	private String SQL = "insert into Trina_BudgetRecordsFreeze_App(TaskID,RowNo,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,Amount,Status) values (?,?,?,?,?,?,?,?)";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		DataTable detailTable = document.get("B_CostApplyDtl");
		// 流程状态
		String WorkflowState = TypeConvertor.toString(args[0]);
		String rownum = TypeConvertor.toString(args[1]);
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			// 预算币种
			String BudgetCurrency = detailTable.getString(index,"CurrencyDetail1");
			// 预算年
			String BudgetYear = detailTable.getString(index,"CAD_BudgetYear");
			// 预算月
			String BudgetMonth = detailTable.getString(index,"CAD_BudgetMonth");
			// 预算数量
			String BudgetQty = "1";
			//预算金额
			String BudgetOffsetMoney = detailTable.getNumeric(index,"Amount").toString();
			//释放预算金额
			BigDecimal BudgetOffsetAmount =  detailTable.getNumeric(index,"Amount");
			BudgetOffsetAmount = BudgetOffsetAmount.negate();
			// 预算号
			String BudgetNo = detailTable.getString(index,"CAD_BudgetNo");
			// 预算承担组织编号
			String BudgetOuCode = headTable.getString("OU_Code");
			// 唯一标识（自动生成）
			String GUID = System.currentTimeMillis()+"";
			// 源任务ID
			String SourceTaskId = headTable.getObject("OID").toString();
			// 源任务明细ID
			String SourceTaskLineId = detailTable.getObject(index,"OID").toString();
			// 源表名称
			String TableName = "EFLOW";
			//预算冻结或释放时默认为0
			String TaskId = "0";
			//预算冻结或释放时默认为0
			String TaskLineId = "0";
			//类型预算冻结或释放时默认为APPLY
			String CostType = "APPLY";
			//执行插入本地日志
			if (WorkflowState.equalsIgnoreCase("S")){
				context.getDBManager().execPrepareUpdate(SQL,SourceTaskId,rownum,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,BudgetOffsetMoney,1);
			} else if(WorkflowState.equalsIgnoreCase("R")){
				context.getDBManager().execPrepareUpdate(SQL,SourceTaskId,rownum,BudgetNo,BudgetYear,BudgetMonth,BudgetCurrency,BudgetOffsetAmount,-1);
			}
			TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
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

		return true;
	}
}
