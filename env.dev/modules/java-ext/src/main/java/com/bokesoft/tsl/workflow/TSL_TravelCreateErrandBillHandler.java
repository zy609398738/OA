package com.bokesoft.tsl.workflow;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_TravelCreateErrandBillHandler {
	/**
	 * 
	 * @param context
	 * @param billkey
	 * @param flow
	 * @param node
	 * @param oid
	 * @param createtype
	 * @throws Throwable
	 */
	public void TravelCreateErrandBill(DefaultContext context, String billkey, String flow, String node, String oid,String createtype)
			throws Throwable {
		String ACTION = "TradeCaravan_CreateErrandBillSrv";
		JSONObject CreateErrandBillRequest = new JSONObject();
		JSONObject errandBillInfo = new JSONObject();
		JSONArray errandBillInfoextInfo = new JSONArray();
		JSONObject errandBillInfoextInfojo = new JSONObject();
		JSONObject errandBillInfoextInfojo1 = new JSONObject();
		JSONArray journeyInfos = new JSONArray();
		
		JSONArray companionInfos = new JSONArray();
		JSONObject companionInfosjo = new JSONObject();
		JSONArray companionInfosextInfo = new JSONArray();
		JSONObject companionInfosextInfojo = new JSONObject();
		
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaDataObject metaDataObject = metaFactory.getDataObject("B_TravelExpenseApply");

		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		DataTable detailTable = document.get("B_TravelExpenseApplyDtl");
		String userName = "XCZTH";
		String userkey = "XCZTH20121221083643";
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String currentTime = sdf.format(date);
		String taskid = headTable.getObject("InstanceID").toString();
		String sourceType = "XCZTH";
		String sourceKey = "XCZTH_" + taskid;
		String password = userName + sourceType + sourceKey + currentTime + userkey;
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
		String applyEmpNum = TypeConvertor.toString(headTable.getObject("CreatorCode"));
		String errandEmpNum = TypeConvertor.toString(headTable.getObject("ApplicantCode"));
		String projectCode = TypeConvertor.toString(headTable.getObject("ProjectCode"));
		String journeyType = TypeConvertor.toString(headTable.getObject("Flight"));
		String corporation = TypeConvertor.toString(headTable.getObject("OU_NAME"));
		String costCentre = TypeConvertor.toString(headTable.getObject("CostCenterCode")) + "_"
				+ TypeConvertor.toString(headTable.getObject("CostCenterName"));
		String contactName = "";
		String contactPhone = "";
		String contactEmail = "";
		String trip_budget_no = TypeConvertor.toString(headTable.getObject("TRIP_BUDGET_NO").toString());
		BigDecimal total_amount = new BigDecimal(headTable.getObject("P_TRIP_FEE_Amount").toString());
		BigDecimal transportation = new BigDecimal(headTable.getObject("P_TRIP_FEE_TRANSPORTATION").toString());
		BigDecimal hotelExpenses = new BigDecimal(headTable.getObject("P_TRIP_FEE_ACCOMMODATION").toString());	
		BigDecimal trafficExpenses = new BigDecimal(headTable.getObject("C_TRIP_FEE_AIR").toString());
		BigDecimal otherExpenses = BigDecimal.ZERO;
		otherExpenses = total_amount.subtract(hotelExpenses).subtract(transportation);
		int hotelExpense=hotelExpenses.intValue();
		int trafficExpense=trafficExpenses.intValue();
		int otherExpense=otherExpenses.intValue();
		String Reason = headTable.getString("Reason");
		if (Reason == null || Reason.isEmpty()) {
			Reason = "探亲";
		}
		int rowCount = detailTable.size();
		for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			JSONObject journeyInfosjo = new JSONObject();
			JSONObject journeyInfosextInfojo = new JSONObject();
			JSONArray journeyInfosextInfo = new JSONArray();
			int seqNo = rowIndex + 1;
			String fromCity = DictCacheUtil.getDictValue(context.getVE(), "Dict_From_City_Name",
					detailTable.getLong(rowIndex, "FROM_CITY_NAME"), "Name").toString();
			String toCity = DictCacheUtil.getDictValue(context.getVE(), "Dict_From_City_Name",
					detailTable.getLong(rowIndex, "TO_CITY_NAME"), "Name").toString();
			String journeyType1 = "OW";
			String areaType = "COMMON";
			String trafficTool = "plane";
			Date startdate = detailTable.getDateTime(rowIndex, "startdate");
			Date enddate = detailTable.getDateTime(rowIndex, "Enddate");
			SimpleDateFormat sdt = new SimpleDateFormat("yyyy-MM-dd");
			String startDate = sdt.format(startdate);
			String endDate = sdt.format(enddate);
			journeyInfosjo.put("seqNo", seqNo);
			journeyInfosjo.put("fromCity", fromCity);
			journeyInfosjo.put("toCity", toCity);
			journeyInfosjo.put("journeyType", journeyType1);
			journeyInfosjo.put("areaType", areaType);
			journeyInfosjo.put("trafficTool", trafficTool);
			journeyInfosjo.put("startDate", startDate);
			journeyInfosjo.put("endDate", endDate);
			journeyInfosextInfojo.put("key", "");
			journeyInfosextInfojo.put("value", "");
			journeyInfosextInfo.add(journeyInfosextInfojo);
			journeyInfosjo.put("extInfo", journeyInfosextInfo);
			journeyInfos.add(journeyInfosjo);
		}
		String personnelType = "EMPLOYEE";
		String empNum = headTable.getObject("ApplicantCode").toString();
		String personnelName = headTable.getObject("ApplicantName").toString();
		String passName = "";
		String passType = "";
		String passNum = "";
		String mobilePhone = "";
		String email = "";
		companionInfosjo.put("personnelType", personnelType);
		companionInfosjo.put("empNum", empNum);
		companionInfosjo.put("personnelName", personnelName);
		companionInfosjo.put("passName", passName);
		companionInfosjo.put("passType", passType);
		companionInfosjo.put("passNum", passNum);
		companionInfosjo.put("mobilePhone", mobilePhone);
		companionInfosjo.put("email", email);
		companionInfosextInfojo.put("key", "");
		companionInfosextInfojo.put("value", "");
		companionInfosextInfo.add(companionInfosextInfojo);
		companionInfosjo.put("extInfo", companionInfosextInfo);
		companionInfos.add(companionInfosjo);
		if (createtype.equalsIgnoreCase("new")) {
			errandBillInfoextInfojo.put("key", "attribute1");
			errandBillInfoextInfojo.put("value", trip_budget_no);
			errandBillInfoextInfo.add(errandBillInfoextInfojo);
		} else {
			errandBillInfoextInfojo.put("key", "attribute1");
			errandBillInfoextInfojo.put("value", "modify");
			errandBillInfoextInfo.add(errandBillInfoextInfojo);
			errandBillInfoextInfojo1.put("key", "attribute2");
			errandBillInfoextInfojo1.put("value", trip_budget_no);
			errandBillInfoextInfo.add(errandBillInfoextInfojo1);
		}
		errandBillInfo.put("sourceType", sourceType);
		errandBillInfo.put("sourceKey", sourceKey);
		errandBillInfo.put("applyEmpNum", applyEmpNum);
		errandBillInfo.put("errandEmpNum", errandEmpNum);
		errandBillInfo.put("projectCode", projectCode);
		errandBillInfo.put("journeyType", journeyType);
		errandBillInfo.put("corporation", corporation);
		errandBillInfo.put("costCentre", costCentre);
		errandBillInfo.put("contactName", contactName);
		errandBillInfo.put("contactPhone", contactPhone);
		errandBillInfo.put("contactEmail", contactEmail);
		errandBillInfo.put("trafficExpense", trafficExpense);
		errandBillInfo.put("hotelExpense", hotelExpense);
		errandBillInfo.put("otherExpense", otherExpense);
		errandBillInfo.put("reason", Reason);
		errandBillInfo.put("companionInfos", companionInfos);
		errandBillInfo.put("journeyInfos", journeyInfos);
		errandBillInfo.put("extInfo", errandBillInfoextInfo);
		CreateErrandBillRequest.put("userName", userName);
		CreateErrandBillRequest.put("currentTime", currentTime);
		CreateErrandBillRequest.put("password", password);
		CreateErrandBillRequest.put("errandBillInfo", errandBillInfo);
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
		if (!oid.isEmpty() && oid != null) {
			factory.addParameter("oid", oid);
		}
		factory.addParameter("CreateErrandBillRequest", CreateErrandBillRequest.toString());
		// 执行BokeDee接口
		String returnCode = "";
		String errandBillNum = "";
		String errorMessage = "";
		String stringJson = factory.executeAction(ACTION);
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);
		JSONObject jsonObject = (JSONObject) reJSONObject.get("data");
		returnCode = jsonObject.get("returnCode").toString();
		if (!returnCode.equalsIgnoreCase("0000")) {
			errorMessage = jsonObject.get("errorMessage").toString();
			throw new Exception("创建商旅出差申请单失败，任务ID：" + taskid + ".错误信息：" + errorMessage);
		} else {
			errandBillNum = jsonObject.get("errandBillNum").toString();
			headTable.setObject("errandBillNum", errandBillNum);

		}
		
		SaveData sd = new SaveData(metaDataObject, null, document);
		sd.save(new DefaultContext(context));
	}
}