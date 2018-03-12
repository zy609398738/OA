package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_TravelFindTicketByBillSrv extends BaseMidFunctionImpl {
	private static String ACTION = "TradeCaravan_FindTicketByBillSrv";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		JSONObject FindTicketByBillRequest = new JSONObject();
		JSONObject queryParam = new JSONObject();
		JSONArray queryParamextInfo = new JSONArray();
		JSONObject queryParamextInfojo = new JSONObject();
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		String userName = "XCZTH";
		String userkey = "XCZTH20121221083643";
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String currentTime = sdf.format(date);
		String taskid = headTable.getObject("InstanceID").toString();
		String sourceType = "XCZTH";
		String sourceKey = "XCZTH_" + taskid;
		String password = userName + currentTime + userkey;
		MessageDigest md5 = MessageDigest.getInstance("MD5");
		md5.update((password).getBytes("UTF-8"));
		byte b[] = md5.digest();

		int i;
		StringBuffer buf = new StringBuffer("");

		for (int offset = 0; offset < b.length; offset++) {
			i = b[offset];
			if (i < 0) {
				i += 256;
			}
			if (i < 16) {
				buf.append("0");
			}
			buf.append(Integer.toHexString(i));
		}
		password = buf.toString().toUpperCase();
		String errandBillNum = headTable.getObject("errandBillNum").toString();
		queryParam.put("sourceType", sourceType);
		queryParam.put("sourceKey", sourceKey);
		queryParam.put("errandBillNum", errandBillNum);
		queryParamextInfojo.put("key", "");
		queryParamextInfojo.put("value", "");
		queryParamextInfo.add(queryParamextInfojo);
		queryParam.put("extInfo", queryParamextInfo);
		FindTicketByBillRequest.put("userName", userName);
		FindTicketByBillRequest.put("currentTime", currentTime);
		FindTicketByBillRequest.put("password", password);
		FindTicketByBillRequest.put("queryParam", queryParam);
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		if (!flow.isEmpty() && flow != null) {
			factory.addParameter("flow", flow);
		}
		if (!node.isEmpty() && node != null) {
			factory.addParameter("node", node);
		}
		if (!billkey.isEmpty() && billkey != null) {
			factory.addParameter("billkey", billkey);
		}
		if (!oid.isEmpty() && !oid.equalsIgnoreCase("null")) {
			factory.addParameter("oid", oid);
		}
		factory.addParameter("FindTicketByBillRequest", FindTicketByBillRequest.toString());
		// 执行BokeDee接口
		String returnCode = "";
		String errorMessage = "";
		BigDecimal ticketPrice = BigDecimal.ZERO;
		BigDecimal airportPrice = BigDecimal.ZERO;
		BigDecimal fuelPrice = BigDecimal.ZERO;
		BigDecimal refundAmount = BigDecimal.ZERO;
		BigDecimal endorsementAmount = BigDecimal.ZERO;
		BigDecimal assuranceAmount = BigDecimal.ZERO;
		BigDecimal priceamount = BigDecimal.ZERO;
		BigDecimal sumPriceamount = BigDecimal.ZERO;
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		JSONObject jObject = (JSONObject) reJSONObject.get("data");
		returnCode = jObject.get("returnCode").toString();
		if (!returnCode.equalsIgnoreCase("0000")) {
			errorMessage = jObject.get("errorMessage").toString();
			throw new Exception("获取商旅机票价格失败，任务ID：" + taskid + ".错误信息：" + errorMessage);
		} else {
			Object data = jObject.get("ticketOrderList");
			if (data instanceof JSONArray) {
				JSONArray reJSONArray = (JSONArray) data;
				for (int j = 0; j < reJSONArray.size(); ++j) {
					JSONObject jsonObject = (JSONObject) reJSONArray.get(j);
					ticketPrice = new BigDecimal(jsonObject.get("ticketPrice").toString());
					airportPrice = new BigDecimal(jsonObject.get("airportPrice").toString());
					fuelPrice = new BigDecimal(jsonObject.get("fuelPrice").toString());
					refundAmount = new BigDecimal(jsonObject.get("refundAmount").toString());
					endorsementAmount = new BigDecimal(jsonObject.get("endorsementAmount").toString());
					assuranceAmount = new BigDecimal(jsonObject.get("assuranceAmount").toString());
					priceamount = ticketPrice.add(airportPrice).add(fuelPrice).add(refundAmount).add(endorsementAmount)
							.add(assuranceAmount);
					sumPriceamount = sumPriceamount.add(priceamount);
				}
				headTable.setObject("CREDIT_PAYMENT", sumPriceamount);
			}
			return true;
		}

	}
}
