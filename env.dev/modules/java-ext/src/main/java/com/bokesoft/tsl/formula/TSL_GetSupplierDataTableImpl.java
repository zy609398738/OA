package com.bokesoft.tsl.formula;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.CondSign;
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

public class TSL_GetSupplierDataTableImpl extends BaseMidFunctionImpl {

	private String ACTION = "ERP_Supplier_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String formKey = args[0].toString();
		String tableKey = args[1].toString();

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		MetaDataObject metaDataObject = metaForm.getDataSource().getDataObject();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		DataTable dataTable = DataTableUtil.newEmptyDataTable(metaTable);

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();

		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);

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

		String stringJson = factory.executeAction(ACTION);
		// json后续处理
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);

		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			DataTableMetaData metaData = dataTable.getMetaData();
			int count = metaData.getColumnCount();
			ColumnInfo columnInfo = null;
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
