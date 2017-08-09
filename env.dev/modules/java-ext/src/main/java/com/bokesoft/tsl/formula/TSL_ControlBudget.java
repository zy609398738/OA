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
		String dataObjectKey = TypeConvertor.toString(args[0]);
		CostInfo info = TSLInfoFactory.CreateInfo(context, dataObjectKey);
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());
		DataTable detailTable = document.get(info.getDetailTable());
		// 流程状态
		String WorkflowState = TypeConvertor.toString(args[1]);
		String rownum = TypeConvertor.toString(args[2]);
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			// 预算币种
			String BudgetCurrency = detailTable.getString(index,info.getBudgetCurrencyD1Field());
			// 预算年
			String BudgetYear = detailTable.getString(index,info.getBudgetYearDField());
			// 预算月
			String BudgetMonth = detailTable.getString(index,info.getBudgetMonthDField());
			// 预算数量
			String BudgetQty = TypeConvertor.toString(args[3]);
			//预算金额
			String BudgetOffsetMoney = detailTable.getNumeric(index,info.getBudgetAmountDField()).toString();
			//释放预算金额
			BigDecimal BudgetOffsetAmount =  detailTable.getNumeric(index,info.getBudgetAmountDField());
			BudgetOffsetAmount = BudgetOffsetAmount.negate();
			// 预算号
			String BudgetNo = detailTable.getString(index,info.getBudgetNoDField());
			// 预算承担组织编号
			String BudgetOuCode = headTable.getString(info.getOUCodeField());
			// 唯一标识（自动生成）
			String GUID = System.currentTimeMillis()+"";
			// 源任务ID
			String SourceTaskId = headTable.getObject(info.getOIDField()).toString();
			// 源任务明细ID
			String SourceTaskLineId = detailTable.getObject(index,info.getOIDField()).toString();
			// 源表名称
			String TableName = TypeConvertor.toString(args[4]);
			//预算冻结或释放时默认为0
			String TaskId = TypeConvertor.toString(args[5]);
			//预算冻结或释放时默认为0
			String TaskLineId = TypeConvertor.toString(args[6]);
			//类型预算冻结或释放时默认为APPLY
			String CostType = TypeConvertor.toString(args[7]);
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
