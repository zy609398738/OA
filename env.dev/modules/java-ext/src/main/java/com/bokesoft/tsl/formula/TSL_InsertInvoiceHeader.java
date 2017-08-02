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

public class TSL_InsertInvoiceHeader extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_INSERT_INVOICEHEADER_TO_BPM";
	private String SQL = "select distinct CEDetail_PaymentType from Bill_CostExpenseDetail WHERE SOID = ?";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		// 最后导入会计工号（获取操作员code）
		String FinUploadEmpNumber = TypeConvertor.toString(args[0]);
		DataTable dt = context.getDBManager().execPrepareQuery(SQL, document.getOID());
		String paymenttype = null;
		if (dt.size() > 0) {
			// 获取SQL查询值赋给变量
			paymenttype = dt.getString(0, 0);
		}
		// PaymentType为空则为TaskID 任务号；PaymentType不为空，TaskID+“_”+PaymentType
		String InvoiceNumber = null;
		if (paymenttype == null) {
			InvoiceNumber = headTable.getObject("OID").toString();
		} else if (paymenttype.equalsIgnoreCase("PersonalPayment")) {
			InvoiceNumber = headTable.getObject("OID") + "_P";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			InvoiceNumber = headTable.getObject("OID") + "_C";
		}
		// OperationUnitCode承担业务实体Code
		String OrgId = headTable.getObject("OU_Code").toString();
		// 默认固定值“STANDARD”
		String InvoiceTypeLookupCode = "STANDARD";
		// SettlementCurrency 结算币种
		String InvoiceCurrencyCode = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_Currency", headTable.getLong("SettlementCurrency"), "Code")
				.toString();
		// ApprovedAmount 财务核准金额
		String InvoiceAmount = headTable.getObject("ReimAmount2").toString();
		// ApplicantName申请人姓名
		String EmployeeName = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_Employee", headTable.getLong("ApplicantID"), "Name").toString();
		// ApplicantHrid申请人工号
		String EmployeeNumber = headTable.getObject("ApplicantCode").toString();
		// PaymentType为空或为个人支付时默认为“OFFICE”； PaymentType为公司支付时默认为“HOME”
		String VendorSiteCode = null;
		if (paymenttype == null || paymenttype.equalsIgnoreCase("PersonalPayment")) {
			VendorSiteCode = "OFFICE";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			VendorSiteCode = "HOME";
		}
		// 默认固定值“FYBX”
		String Source = "FYBX";
		// ApplicantName+'-'+ApplicantHrid+'-'+ TaskID 申请人姓名+“_”+申请人工号+“_”+任务号
		String Description = EmployeeName + "-" + EmployeeNumber + "-" + headTable.getObject("OID");
		// 默认固定值“FYBX”
		String Attribute15 = "FYBX";
		// 默认固定值“期初汇率”
		String ExchangeRateType = "期初汇率";
		// 默认固定值“NEW”
		String ImportStatus = "NEW";
		// BU字段
		String BU = TypeConvertor.toString(headTable.getObject("BU"));
		// 默认固定值“1291”
		String CF = "1291";
		// 接口调用
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
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
