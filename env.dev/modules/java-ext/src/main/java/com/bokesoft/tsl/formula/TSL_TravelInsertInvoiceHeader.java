package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_TravelInsertInvoiceHeader extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_INSERT_INVOICEHEADER_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// InvoiceNumber
		String InvoiceNumber = headTable.getObject("InstanceID") + "_P";
		// 会计工号
		String FinUploadEmpNumber = TypeConvertor.toString(args[4]);
		// OperationUnitCode承担业务实体Code
		String OrgId = headTable.getObject("OU_CODE").toString();
		// 默认固定值“STANDARD”
		String InvoiceTypeLookupCode = TypeConvertor.toString(args[5]);
		// ApplicantName申请人姓名
		String EmployeeName = headTable.getObject("ApplicantName").toString();
		// ApplicantHrid申请人工号
		String EmployeeNumber = headTable.getObject("ApplicantCode").toString();
		// PaymentType为空或为个人支付时默认为“OFFICE”； PaymentType为公司支付时默认为“HOME”
		String VendorSiteCode = "OFFICE";
		// ApprovedAmount 财务核准金额
		String InvoiceAmount = headTable.getObject("ACT_PAYMENT_AMT").toString();
		// SettlementCurrency 结算币种
		String InvoiceCurrencyCode = DictCacheUtil.getDictValue(context.getVE(), "Dict_Currency", headTable.getLong("SETTLEMENT_CURRENCY"), "Code").toString();
		// 默认固定值“期初汇率”
		String ExchangeRateType = TypeConvertor.toString(args[8]);
		// ApplicantName+'-'+ApplicantHrid+'-'+ TaskID 申请人姓名+“_”+申请人工号+“_”+任务号
		String Description = EmployeeName + "-" + EmployeeNumber + "-" + headTable.getObject("InstanceID");
		// 默认固定值“FYBX”
		String Source = TypeConvertor.toString(args[6]);
		// 默认固定值“FYBX”
		String Attribute15 = TypeConvertor.toString(args[7]);
		// 默认固定值“NEW”
		String ImportStatus = TypeConvertor.toString(args[9]);
		// BU字段
		String BU = TypeConvertor.toString(headTable.getObject("BU"));
		// 默认固定值“1291”
		String CF = TypeConvertor.toString(args[10]);
		// 接口调用
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
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("invoice_num", InvoiceNumber);
		paramenter.put("org_id", OrgId);
		paramenter.put("invoice_type_lookup_code", InvoiceTypeLookupCode);
		paramenter.put("invoice_currency_code", InvoiceCurrencyCode);
		paramenter.put("invoice_amount", InvoiceAmount);
		paramenter.put("employee_name", EmployeeName);
		paramenter.put("employee_num", EmployeeNumber);
		paramenter.put("vendor_site_code", VendorSiteCode);
		paramenter.put("source", Source);
		paramenter.put("description", Description);
		paramenter.put("attribute15", Attribute15);
		paramenter.put("exchange_rate_type", ExchangeRateType);
		paramenter.put("import_status", ImportStatus);
		paramenter.put("fin_upload_emp_num", FinUploadEmpNumber);
		paramenter.put("bu", BU);
		paramenter.put("cf", CF);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 返回执行结果
		return stringJson;
	}
}
