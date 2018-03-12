package com.bokesoft.tsl.service;

import java.math.BigDecimal;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class TSL_DealBiddingContractLines implements IExtService2 {

	private static String ACTION = "ERP_Sales_Contract_Details_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String billkey = TypeConvertor.toString(args.get("billkey"));
		String flow = TypeConvertor.toString(args.get("flow"));
		String node = TypeConvertor.toString(args.get("node"));
		String oid = TypeConvertor.toString(args.get("oid"));
		String contractID = TypeConvertor.toString(args.get("contractID"));

		Document document = context.getDocument();
		DataTable headTable = document.get("B_BiddingContract");
		DataTable detailTable = document.get("B_BiddingContractDtl");

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForma = metaFactory.getMetaForm(billkey);
		MetaDataObject metaDataObject = metaForma.getDataSource().getDataObject();
		MetaTable detailMetaTable = metaDataObject.getMetaTable("B_BiddingContractDtl");
		
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		JSONArray ja = new JSONArray();
		JSONObject jo = factory.createCondition("header_id", "in", contractID);
		ja.add(jo);

		BigDecimal USDRate = headTable.getNumeric("RateUSD");
		BigDecimal RMBRate = headTable.getNumeric("RateRMB");

		BigDecimal sumQuantityMW = headTable.getNumeric("SumQuantityMW");
		BigDecimal sumAmount = headTable.getNumeric("SumAmountM");
		BigDecimal sumAmountUSD = headTable.getNumeric("SumAmountMUSD");
		BigDecimal sumAmountMRMB = headTable.getNumeric("SumAmountMRMB");
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
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		Object data = reJSONObject.get("data");
		if (data instanceof JSONArray) {
			JSONArray reJSONArray = (JSONArray) data;
			for (int i = 0; i < reJSONArray.size(); ++i) {
				JSONObject jsonObject = (JSONObject) reJSONArray.get(i);

				if (i == 0) {
					headTable.setObject("ContractBarcode", jsonObject.get("line_pi"));
				}

				DocumentUtil.newRow(detailMetaTable, detailTable);
				//detailTable.append();
				// Model
				String model = TypeConvertor.toString(jsonObject.get("ordered_item"));
				detailTable.setObject("Model", model);
				detailTable.setObject("ModelDesc", TypeConvertor.toString(jsonObject.get("power")) + "+-+" + jsonObject.get("description"));
				detailTable.setObject("Remark", jsonObject.get("product_category"));

				detailTable.setObject("PINo", jsonObject.get("line_pi"));
				detailTable.setObject("LineID", jsonObject.get("line_id"));

				BigDecimal power = TypeConvertor.toBigDecimal(jsonObject.get("w_number")).divide(new BigDecimal(1000000));
				sumQuantityMW = sumQuantityMW.add(power);
				detailTable.setObject("Power", power);
				BigDecimal ASP = TypeConvertor.toBigDecimal(jsonObject.get("w_price"));
				BigDecimal ASPUSD = ASP.multiply(USDRate);
				detailTable.setObject("ASP", ASP);
				detailTable.setObject("ASPUSD", ASPUSD);
				detailTable.setObject("ASPRMB", ASP.multiply(RMBRate));

				BigDecimal amount = TypeConvertor.toBigDecimal(jsonObject.get("amount")).divide(new BigDecimal(1000000));
				sumAmount = sumAmount.add(amount);
				detailTable.setObject("Amount", amount);
				BigDecimal amountUSD = amount.multiply(USDRate);
				sumAmountUSD = sumAmountUSD.add(amountUSD);
				detailTable.setObject("AmountUSD", amountUSD);
				BigDecimal amountRMB = amount.multiply(RMBRate);
				sumAmountMRMB = sumAmountMRMB.add(amountRMB);
				detailTable.setObject("AmountRMB", amountRMB);
			}
		}

		return document;
	}
}
