package com.bokesoft.tsl.formula;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.CondSign;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.condition.ConditionItem;
import com.bokesoft.yigo.struct.condition.ConditionParas;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;
import com.bokesoft.yigo.tools.document.DataTableUtil;

public class TSL_GetBudgetConrolDataTableImpl extends BaseMidFunctionImpl {
	private String ACTION = "ERP_BUDGET_CONTROL_TO_BPM";

	private String SQL = "select oid from Dict_Currency where UPPER(code) =?";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String formKey = args[0].toString();
		String tableKey = args[1].toString();

		String CostCenter = TypeConvertor.toString(context.getPara("CostCenter"));
		long Organization_id = TypeConvertor.toLong(context.getPara("Organization_id"));
		int Budget_Year = TypeConvertor.toInteger(context.getPara("Budget_Year"));
		int BudgetMonth = TypeConvertor.toInteger(context.getPara("Budget_Year"));
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		MetaDataObject metaDataObject = metaForm.getDataSource().getDataObject();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		DataTable dataTable = DataTableUtil.newEmptyDataTable(metaTable);

		// 新开BokeDee工厂类,处理参数集合
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();

		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);

		if (!CostCenter.isEmpty() && !CostCenter.equalsIgnoreCase("null")) {
			jo = factory.createCondition("cost_center", " = ", CostCenter);
			ja.add(jo);
		}

		if (Organization_id > 0) {
			jo = factory.createCondition("org_id", " = ", Organization_id);
			ja.add(jo);
		}

		if (Budget_Year > 0) {
			jo = factory.createCondition("budget_year", " = ", Budget_Year);
			ja.add(jo);
		}

		// 处理条件字段,添加进BokeDee接口参数
		ConditionItem item = null;
		ConditionParas paras = context.getConditionParas();
		if (paras != null && paras.size() > 0) {
			for (int i = 0; i < paras.size(); ++i) {
				item = paras.get(i);
				int sign = item.getCondSign();
				Object value = item.getValue();
				String columnKey = item.getColumnKey();
				String dbColumnName = metaTable.get(columnKey).getBindingDBColumnName();

				switch (sign) {
				case CondSign.LIKE:
					value = "%" + value + "%";
					break;
				default:
					break;
				}

				jo = factory.createCondition(dbColumnName, " " + CondSign.toString(sign) + " ", value);
				ja.add(jo);
			}
		}
		factory.addParameter("json", ja.toString());

		// 执行接口
		String stringJson = factory.executeAction(ACTION);
		// json后续处理
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");

		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			// 获取数据对象的所有列
			DataTableMetaData metaData = dataTable.getMetaData();
			int count = metaData.getColumnCount();
			ColumnInfo columnInfo = null;
			// 循环接口返回值,添加到原有的数据对象中
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);
				dataTable.append();
				for (int index = 0; index < count; index++) {
					columnInfo = metaData.getColumnInfo(index);
					dataTable.setObject(columnInfo.getColumnKey(), TypeConvertor.toDataType(columnInfo.getDataType(), jsonObject.get(columnInfo.getColumnKey().toLowerCase())));
				}

				DataTable dt = context.getDBManager().execPrepareQuery(SQL,
						jsonObject.get("currency_code").toString().toUpperCase());
				long oid = -1L;
				if (dt.first()) {
					oid = dt.getLong("oid");
				}
				dataTable.setObject("currency_oid", oid);

				String budget_desc = jsonObject.get("budget_desc").toString().toUpperCase().trim();
				if (budget_desc.indexOf("WELFARE") > -1 || budget_desc.indexOf("SMT WELFARE") > -1 || budget_desc.indexOf("SALES INCENTIVE") > -1 || budget_desc.indexOf("TEAM AWARD") > -1 || budget_desc.indexOf("TEAM BUILDING") > -1) {
					dataTable.setObject("budgetsubject", "福利费");
				} else if (budget_desc.indexOf("STAFF EDUCATION FEE") > -1  || budget_desc.indexOf("TRAINING") > -1) {
					dataTable.setObject("budgetsubject", "培训费");
				} else {
					dataTable.setObject("budgetsubject", "其他");
				}
				
				switch(BudgetMonth) {
				case 1:
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_1")));
					break;
				case 2:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_1")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_2"))));
					break;
				case 3:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_1")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_2"))).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_3"))));
					break;
				case 4:
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_4")));
					break;
				case 5:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_4")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_5"))));
					break;
				case 6:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_4")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_5"))).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_6"))));
					break;
				case 7:
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_7")));
					break;
				case 8:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_7")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_8"))));
					break;
				case 9:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_7")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_8"))).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_9"))));
					break;
				case 10:
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_10")));
					break;
				case 11:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_10")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_11"))));
					break;
				case 12:	
					dataTable.setObject("quarterlybudget", TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_10")).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_11"))).add(TypeConvertor.toBigDecimal(jsonObject.get("entered_amt_12"))));
					break;
				}

				
			}
		}

		return dataTable;
	}
}
