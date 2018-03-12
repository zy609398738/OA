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

public class TSL_GetMaterialNumberDataTableImpl extends BaseMidFunctionImpl {

	private String ACTION = "ERP_MaterialNumber_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String formKey = args[0].toString();
		String tableKey = args[1].toString();
		String billkey = TypeConvertor.toString(context.getPara("billkey"));
		String flow = TypeConvertor.toString(context.getPara("flow"));
		String node = TypeConvertor.toString(context.getPara("node"));
		String oid = TypeConvertor.toString(context.getPara("oid"));
		String segment1 = TypeConvertor.toString(context.getPara("segment1"));
		String organization_id = TypeConvertor.toString(context.getPara("organization_id"));
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		MetaDataObject metaDataObject = metaForm.getDataSource().getDataObject();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		DataTable dataTable = DataTableUtil.newEmptyDataTable(metaTable);

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();

		JSONArray ja = new JSONArray();
		JSONObject jo = factory.getRowNumberCondition();
		ja.add(jo);
		if (!segment1.isEmpty() && segment1 != null) {

			jo = factory.createCondition("category1", " = ", segment1);
			ja.add(jo);
		}
		if (!organization_id.isEmpty() && organization_id != null) {
			jo = factory.createCondition("organization_id", "in", organization_id);
			ja.add(jo);
		}
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
