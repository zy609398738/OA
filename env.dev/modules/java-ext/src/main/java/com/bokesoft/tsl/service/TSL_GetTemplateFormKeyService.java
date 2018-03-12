package com.bokesoft.tsl.service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.OfficePOITools;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.file.util.AttachmentUtil;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetTemplateFormKeyService implements IExtService2 {
	private static String sql = "select  d.oid, h.code, h.name, d.path, d.name as fileName from Dict_ContractChose h join Dict_ContractChose_D d on h.oid = d.soid where d.soid=? order by d.oid desc";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		long oid = TypeConvertor.toLong(args.get("oid"));
		String formKey = args.get("formKey").toString();

		if (oid <= 0) {
			return null;
		}

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		JSONObject jsonObject = new JSONObject();
		// 通过字典OID找最新的模板，找到版本号生成formkey
		DataTable dt = context.getDBManager().execPrepareQuery(sql, oid);
		if (dt.first()) {
			String path = dt.getString("path");
			String code = dt.getString("code");
			String name = dt.getString("name");
			long tempOID = dt.getLong("oid");
			String tempteformKey = code + tempOID;

			if (!metaFactory.getMetaFormList().containsKey(tempteformKey)) {
				String docFileUrl = AttachmentUtil.getAttachDataPath(formKey) + File.separator + path;
				String jsonStr = OfficePOITools.readWordToJson(docFileUrl, getHeadFieldMap(), getDetilFieldMap());

				MetaForm metaTemp = metaFactory.getMetaForm("WordTemp");
				MetaForm metaForm = Json2MetaForm.JsonToMetaForm(metaTemp, name, tempteformKey, jsonStr);
				metaFactory.addExtMetaForm(metaForm);
			}
			jsonObject.put("formKey", tempteformKey);
			jsonObject.put("path", path);
		}

		return jsonObject;
	}

	private HashMap<String, String> getHeadFieldMap() {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("到货地点", "Destination_port");
		map.put("付款条款", "Payment_Term");
		map.put("合同编号", "ContractBarcode");
		map.put("卖方名称", "SupperierName");
		map.put("Contract—No", "ContractBarcode");
		map.put("Delivery—destination", "Destination_port");
		map.put("Payment—term", "Payment_Term");
		map.put("Seller—name", "SupperierName");
		map.put("付款方式", "Payment_Term");
		map.put("产品质量标准", "ContractNoS");
		map.put("产品质量条款备注", "OU_ActDateS");
		map.put("付款条件", "Payment_Term");
		map.put("交货地点", "Destination_port");
		map.put("交货期限", "Delivery_Date");
		map.put("Delivery—place", "Destination_port");
		map.put("Delivery—time", "Delivery_Date");

		return map;
	}

	private HashMap<String, String> getDetilFieldMap() {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("币种", "Currency");
		map.put("单价", "Unit_Price");
		map.put("单位运费", "yunfei");
		map.put("到货地点", "didian");
		map.put("含税否", "InCluding_Tax");
		map.put("金额", "Total_Amount");
		map.put("名称", "Name");
		map.put("数量", "Qty");
		map.put("数量单位", "Unit");
		map.put("序号", "xh");
		map.put("型号及规格", "Description");
		map.put("总金额", "Total_Amount");

		map.put("Amount", "Total_Amount");
		map.put("Currency", "Currency");
		map.put("Destination port", "didian");
		map.put("ProductName", "Name");
		map.put("Quantity", "Qty");
		map.put("QuantityUnit", "Unit");
		map.put("S/N", "xh");
		map.put("Unit Freight", "yunfei");
		map.put("Unit Price", "Unit_Price");
		map.put("Name", "Name");
		map.put("Specification", "Description");
		map.put("TotalAmount", "Total_Amount");
		map.put("VAT", "InCluding_Tax");
		map.put("Price", "Unit_Price");
		map.put("Quantity Unit", "Unit");
		map.put("Total Amount(In number)", "Total_Amount");
		map.put("Total Amount", "Total_Amount");
		map.put("UnitPrice", "Unit_Price");

		return map;
	}
}
