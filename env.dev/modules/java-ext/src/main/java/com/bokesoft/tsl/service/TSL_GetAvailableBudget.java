package com.bokesoft.tsl.service;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetAvailableBudget implements IExtService2 {

	private static String ACTION = "ERP_GetAvailableBudget_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		// 参数解析
		String BudgetCurrency = (String) args.get("CurrencyDetail");
		String BudgetYear = TypeConvertor.toString(args.get("CAD_BudgetYear"));
		String BudgetMonth = TypeConvertor.toString(args.get("CAD_BudgetMonth"));
		String BudgetNo = TypeConvertor.toString(args.get("CAD_BudgetNo"));
		String BudgetOuCode = TypeConvertor.toString(args.get("CostCenterCode"));

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		// 预算币种
		paramenter.put("p_currency_code", BudgetCurrency);
		// 预算年
		paramenter.put("p_budget_year", BudgetYear);
		// 预算月
		paramenter.put("p_budget_month", BudgetMonth);
		// 预算号
		paramenter.put("p_budget_num", BudgetNo);
		// 预算承担组织编号
		paramenter.put("p_org_id", BudgetOuCode);

		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);

		// // 新建数据表
		DataTable dt = new DataTable();
		// // 创建数据表列
		dt.addColumn(new ColumnInfo("p_amount", DataType.NUMERIC));
		dt.addColumn(new ColumnInfo("p_e_amount", DataType.NUMERIC));
		//
		// // 插入新行
		dt.append();
		//
		// // 赋值
		dt.setObject("p_amount", reJSONObject.get("p_amount"));
		dt.setObject("p_e_amount", reJSONObject.get("p_e_amount"));

		return dt;
	}
}
