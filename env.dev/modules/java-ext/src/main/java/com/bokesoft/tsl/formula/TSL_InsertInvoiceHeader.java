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

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		String dataObjectKey = TypeConvertor.toString(args[0]);
		CostInfo info = TSLInfoFactory.CreateInfo(context, dataObjectKey);
		//paymenttype
		String paymenttype = info.getPaymentTypeField(TypeConvertor.toLong(args[1]));
		// 会计工号
		String FinUploadEmpNumber = TypeConvertor.toString(args[2]);
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());
		// PaymentType为空则为TaskID 任务号；PaymentType不为空，TaskID+“_”+PaymentType
		String InvoiceNumber = null;
		if (paymenttype == null) {
			InvoiceNumber = headTable.getObject(info.getOIDField()).toString();
		} else if (paymenttype.equalsIgnoreCase("PersonalPayment")) {
			InvoiceNumber = headTable.getObject(info.getOIDField()) + "_P";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			InvoiceNumber = headTable.getObject(info.getOIDField()) + "_C";
		}
		// OperationUnitCode承担业务实体Code
		String OrgId = headTable.getObject(info.getOUCodeField()).toString();
		// 默认固定值“STANDARD”
		String InvoiceTypeLookupCode = TypeConvertor.toString(args[3]);
		// SettlementCurrency 结算币种
		String InvoiceCurrencyCode = DictCacheUtil
				.getDictValue(context.getVE(), "Dict_Currency", headTable.getLong(info.getSettlementCurrencyField()), "Code")
				.toString();
		// ApprovedAmount 财务核准金额
		String InvoiceAmount = headTable.getObject(info.getFOAAmountField()).toString();
		// ApplicantName申请人姓名
		String EmployeeName = headTable.getObject(info.getApplicantNameField()).toString();
		// ApplicantHrid申请人工号
		String EmployeeNumber = headTable.getObject(info.getApplicantCodeField()).toString();
		// PaymentType为空或为个人支付时默认为“OFFICE”； PaymentType为公司支付时默认为“HOME”
		String VendorSiteCode = null;
		if (paymenttype == null || paymenttype.equalsIgnoreCase("PersonalPayment")) {
			VendorSiteCode = "OFFICE";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			VendorSiteCode = "HOME";
		}
		// 默认固定值“FYBX”
		String Source = TypeConvertor.toString(args[4]);
		// ApplicantName+'-'+ApplicantHrid+'-'+ TaskID 申请人姓名+“_”+申请人工号+“_”+任务号
		String Description = EmployeeName + "-" + EmployeeNumber + "-" + headTable.getObject(info.getOIDField());
		// 默认固定值“FYBX”
		String Attribute15 = TypeConvertor.toString(args[5]);
		// 默认固定值“期初汇率”
		String ExchangeRateType = TypeConvertor.toString(args[6]);
		// 默认固定值“NEW”
		String ImportStatus = TypeConvertor.toString(args[7]);
		// BU字段
		String BU = TypeConvertor.toString(headTable.getObject(info.getBUField()));
		// 默认固定值“1291”
		String CF = TypeConvertor.toString(args[8]);
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
