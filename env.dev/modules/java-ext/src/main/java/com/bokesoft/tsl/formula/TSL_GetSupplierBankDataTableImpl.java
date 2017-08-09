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

public class TSL_GetSupplierBankDataTableImpl extends BaseMidFunctionImpl {
	private String ACTION = "ERP_SupplierBank_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String formKey = args[0].toString();
		String tableKey = args[1].toString();

		String paycategory = TypeConvertor.toString(context.getPara("paycategory"));
		String currency = TypeConvertor.toString(context.getPara("currency"));

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


		if (!paycategory.isEmpty()&&!paycategory.equalsIgnoreCase("null")&&paycategory.equalsIgnoreCase("RegularPaymentApplication")) {

			jo = factory.createCondition("BANK_NAME", " <> ", "浙江网商银行");
			ja.add(jo);
		}else if(!paycategory.isEmpty()&&!paycategory.equalsIgnoreCase("null")&&paycategory.equalsIgnoreCase("1688PaymentApplication")) {
			jo = factory.createCondition("BANK_NAME", " = ", "浙江网商银行");
			ja.add(jo);
		}
		
		if (!currency.isEmpty()&&!currency.equalsIgnoreCase("null")) {

			jo = factory.createCondition("currency_code", " = ", currency);
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
					dataTable.setObject(columnInfo.getColumnKey(),
							jsonObject.get(columnInfo.getColumnKey().toLowerCase()));
				}
			}
		}

		return dataTable;
	}
}
