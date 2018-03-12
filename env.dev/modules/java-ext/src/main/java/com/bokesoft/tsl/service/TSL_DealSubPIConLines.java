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
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class TSL_DealSubPIConLines implements IExtService2 {

	private static String ACTION = "ERP_Sales_Contract_Details_TO_BPM";

	private static String COGS_QUERY = "select Price from MT_DB_SalMaterial where Year = ? and Quarter = ? and OD = ? and ProductCategory = ? and IsPerc = ?";

	private static String LOGISTICSEXPENSE_QUERY = "select FactoryStorage,LogisticsInland,LogisticsSea,StorageRegion,LogisticsRegion from MT_DB_LogisticsExpense where year=? and quarter=? and region=? and subregion=? and TradeTerms=?";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String billkey = TypeConvertor.toString(args.get("billkey"));
		String flow = TypeConvertor.toString(args.get("flow"));
		String node = TypeConvertor.toString(args.get("node"));
		String oid = TypeConvertor.toString(args.get("oid"));
		String contractID = TypeConvertor.toString(args.get("contractID"));

		IDBManager dbManager = context.getDBManager();

		Document document = context.getDocument();
		DataTable headTable = document.get("B_SubPICon");
		DataTable detailTable = document.get("B_SubPIConDtl");

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForma = metaFactory.getMetaForm(billkey);
		MetaDataObject metaDataObject = metaForma.getDataSource().getDataObject();
		MetaTable detailMetaTable = metaDataObject.getMetaTable("B_SubPIConDtl");
		
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
		BigDecimal sumCM = headTable.getNumeric("SumCM");
		// 货物到达区域
		long arrivalRegion = headTable.getLong("GoodsArrivalRegion");
		// 货物到达子区域
		long arrivalSubRegion = headTable.getLong("ArrivalSubRegion");
		// 年份
		long contractYear = headTable.getLong("ContractYear");
		// 季度
		String quarter = headTable.getString("Quarter");
		// 是否Perc类型产品
		String isPerc = "N";
		// 贸易条款
		long tradeTerms = headTable.getLong("TradeTerms");
		// OD
		String od = headTable.getString("OD");
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
				String productCategory = TypeConvertor.toString(jsonObject.get("product_category"));
				detailTable.setObject("ProductCategory", productCategory);
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
				detailTable.setObject("IsPerc", isPerc);

				DataTable dt = dbManager.execPrepareQuery(COGS_QUERY, contractYear, quarter, od, productCategory,isPerc);
				BigDecimal COGS = BigDecimal.ZERO;
				if (dt.size() > 0) {
					COGS = dt.getNumeric(0, 0);
					detailTable.setObject("COGS", COGS);
				}

				BigDecimal amount = TypeConvertor.toBigDecimal(jsonObject.get("amount")).divide(new BigDecimal(1000000));
				sumAmount = sumAmount.add(amount);
				detailTable.setObject("Amount", amount);

				BigDecimal amountUSD = amount.multiply(USDRate);
				sumAmountUSD = sumAmountUSD.add(amountUSD);
				detailTable.setObject("AmountUSD", amountUSD);

				BigDecimal amountRMB = amount.multiply(RMBRate);
				sumAmountMRMB = sumAmountMRMB.add(amountRMB);
				detailTable.setObject("AmountRMB", amountRMB);

				dt = dbManager.execPrepareQuery(LOGISTICSEXPENSE_QUERY, contractYear, quarter, arrivalRegion,
						arrivalSubRegion, tradeTerms);

				BigDecimal factoryStorage = BigDecimal.ZERO;
				BigDecimal logisticsInland = BigDecimal.ZERO;
				BigDecimal logisticsSea = BigDecimal.ZERO;
				BigDecimal storageRegion = BigDecimal.ZERO;
				BigDecimal logisticsRegion = BigDecimal.ZERO;
				BigDecimal cmnum = new BigDecimal("0.01");
				if (dt.first()) {
					factoryStorage = dt.getNumeric("FactoryStorage");
					logisticsInland = dt.getNumeric("LogisticsInland");
					logisticsSea = dt.getNumeric("LogisticsSea");
					storageRegion = dt.getNumeric("StorageRegion");
					logisticsRegion = dt.getNumeric("LogisticsRegion");

					detailTable.setObject("FactoryStorage", factoryStorage);
					detailTable.setObject("LogisticsInland", logisticsInland);
					detailTable.setObject("LogisticsSea", logisticsSea);
					detailTable.setObject("StorageRegion", storageRegion);
					detailTable.setObject("LogisticsRegion", logisticsRegion);
				}
				BigDecimal cm = (ASPUSD.subtract(COGS).subtract(factoryStorage).subtract(logisticsInland)
						.subtract(logisticsSea).subtract(storageRegion).subtract(logisticsRegion).subtract(ASPUSD.multiply(cmnum))).multiply(power);
				detailTable.setObject("CM", cm);
				sumCM = sumCM.add(cm);
			}
		}

		headTable.setObject("SumQuantityMW", sumQuantityMW);
		headTable.setObject("SumAmountM", sumAmount);
		headTable.setObject("SumAmountMUSD", sumAmountUSD);
		headTable.setObject("SumAmountMRMB", sumAmountMRMB);
		headTable.setObject("SumCM", sumCM);

		return document;
	}
}
