package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TravelExpenseApplyInvoiceInfo implements CostInfo {

	private DefaultContext context = null;
	// 主表
	private String headTable = "B_CostApply";
	// 预算明细表
	private String detailTable = "B_CostApplyDtl";
	// 费用明细表
	private String detailTable2 = "B_CostApplyCE";
	// 单据唯一标识
	private static String OIDField = "OID";
	// 单据编号
	private static String NOField = "NO";
	// 制单人
	private static String CreatorField = "Creator";
	// 修改人
	private static String ModifierField = "Modifier";
	// 预算承担组织编号
	private static String OUCodeField = "OU_Code";
	// 预算承担组织名称
	private static String OUNAMEField = "OU_NAME";
	// 申请人成本中心代码
	private static String ACCCodeField = "DepartmentCode";
	// 申请人成本中心名称
	private static String ACCNameField = "DepartmentName";
	// 预算承担成本中心代码
	private static String BACCCodeCodeField = "CostCenterCode";
	// 预算承担成本中心名称
	private static String BACCNameField = "CostCenterName";
	// 项目编号
	private static String ProjectCodeField = "ProjectCode";
	// 项目名称
	private static String ProjectNameField = "ProjectName";
	// 公司编码
	private static String CompanyCodeField = "CompanyCode";
	// 结算币种
	private static String SettlementCurrencyField = "SettlementCurrency";
	// OUID
	private static String OUIDField = "OUID";
	// 申请人ID
	private static String ApplicantIDField = "ApplicantID";
	// 申请人工号
	private static String ApplicantCodeField = "ApplicantCode";
	// 申请人名称
	private static String ApplicantNameField = "ApplicantNameField";
	// 申请金额合计（预算币种）
	private static String SAAmountField = "SumAmount1";
	// 结算币种金额
	private static String STAmountField = "ReimAmount1";
	// 财务核准金额
	private static String FOAAmountField = "ReimAmount2";
	// 按财务汇率核准金额
	private static String FRAAmountField = "ReimAmount3";
	// 预算币种金额
	private static String BUGAmountField = "ReimAmount4";
	// BU
	private static String BUField = "BU";
	// 查询支付类型
	private static String SQL = "select distinct CEDetail_PaymentType from B_CostApplyCE WHERE SOID = ?";
	// 预算项目
	private static String BudgetItemDField = "CAD_BudgetItem";
	// 预算号码
	private static String BudgetNoDField = "CAD_BudgetNo";
	// 预算名称
	private static String BudgetNameDField = "CAD_BudgetName";
	// 预算科目
	private static String BudgetSubjectDField = "CAD_BudgetSubject";
	// 预算年份
	private static String BudgetYearDField = "CAD_BudgetYear";
	// 预算月份
	private static String BudgetMonthDField = "CAD_BudgetMonth";
	// 预算币种
	private static String BudgetCurrencyDField = "CurrencyDetail";
	// 可用预算额
	private static String CAvailableQuotaDField = "AvailableQuota";
	// 预算版本
	private static String BudgetVersionDField = "BudgetVersion";
	// 申请币种
	private static String AppCurrencyDField = "AppCurrency";
	// 申请币种金额
	private static String AppCurrencyAmtDField = "AppCurrencyAmt";
	// 预算币种汇率
	private static String BudgetRateDField = "Rate";
	// 预算币种金额
	private static String BudgetAmountDField = "Amount";
	// 预算申请编号
	private static String BudgetAppNoDField = "BudgetAppNo";
	// ID
	private static String IDDField = "ID";
	// 资本化
	private static String CapitalizationDField = "Capitalization";
	// 预算币种1
	private static String BudgetCurrencyD1Field = "CurrencyDetail1";
	// CEDetail_ID
	private static String IDLField = "CEDetail_ID";
	// 预算申请编号
	private static String BudgetAppNoLField = "CEDetail_BudgetAppNo";
	// 预算号
	private static String BudgetNoLField = "CEDetail_BudgetNo";
	// 预算年
	private static String BudgetYearLField = "CEDetail_BudgetYear";
	// 预算月
	private static String BudgetMonthLField = "CEDetail_BudgetMonth";
	// 资本化
	private static String CapitalizationLField = "CEDetail_Capitalization";
	// 费用项目
	private static String ExpenseItemNameLField = "CEDetail_ExpenseItemName";
	// 费用项目编码
	private static String ExpenseItemCodeLField = "CEDetail_ExpenseItemCode";
	// 费用承担部门
	private static String ExpenseDeptCodeLField = "CEDetail_ExpenseDeptCode";
	// 费用承担部门名称
	private static String ExpenseDeptNameLField = "CEDetail_ExpenseDeptName";
	// 报销明细
	private static String BudgetCurrencyAmtLField = "CEDetail_BudgetCurrencyAmt";
	// 支付方式
	private static String PaymentTypeLField = "CEDetail_PaymentType";
	// 事由
	private static String ReasonLField = "CEDetail_Reason";
	// 金额
	private static String AmountLField = "CEDetail_Amount";
	// 币种
	private static String CurrencyLField = "CEDetail_Currency";
	// 转换预算币种汇率
	private static String BudgetCurrencyRateLField = "CEDetail_RateToBudgetCurrency";
	// 转换结算币种汇率
	private static String SettlementCurrencyRateLField = "CEDetail_Rate";
	// 结算币种金额
	private static String SettlementAmountLField = "CEDetail_SettlementAmount";
	// 财务核准金额
	private static String FinanceAmountLField = "CEDetail_FinanceAmount";
	// 按财务汇率核准金额汇总
	private static String ReimAmountLField = "CEDetail_ReimAmount";
	// 预算币种金额
	private static String BudgetCurrencyLField = "CEDetail_BudgetCurrency";
	// 预算币种
	private static String BudCurrencyLField = "CEDetail_BudCurrency";
	// 申请的预算金额
	private static String BudCurrencyAmtLField = "CEDetail_BudCurrencyAmt";

	//
	public TravelExpenseApplyInvoiceInfo(DefaultContext context) {
		this.context = context;
	}

	@Override

	public String getPaymentTypeField(long oid) throws Throwable {
		DataTable dt = context.getDBManager().execPrepareQuery(SQL, oid);
		String paymenttype = null;
		if (dt.size() > 0) {
			// 获取SQL查询值赋给变量
			paymenttype = dt.getString(0, 0);
		}

		return paymenttype;
	}

	public String getHeadTable() {
		return headTable;
	}

	public String getDetailTable() {
		return detailTable;
	}

	public String getDetailTable2() {
		return detailTable2;
	}

	public String getOIDField() {
		return OIDField;
	}

	public String getNOField() {
		return NOField;
	}

	public String getCreatorField() {
		return CreatorField;
	}

	public String getModifierField() {
		return ModifierField;
	}

	public String getOUCodeField() {
		return OUCodeField;
	}

	public String getOUNAMEField() {
		return OUNAMEField;
	}

	public String getACCCodeField() {
		return ACCCodeField;
	}

	public String getACCNameField() {
		return ACCNameField;
	}

	public String getBACCCodeCodeField() {
		return BACCCodeCodeField;
	}

	public String getBACCNameField() {
		return BACCNameField;
	}

	public String getProjectCodeField() {
		return ProjectCodeField;
	}

	public String getProjectNameField() {
		return ProjectNameField;
	}

	public String getCompanyCodeField() {
		return CompanyCodeField;
	}

	public String getSettlementCurrencyField() {
		return SettlementCurrencyField;
	}

	public String getOUIDField() {
		return OUIDField;
	}

	public String getApplicantIDField() {
		return ApplicantIDField;
	}

	public String getApplicantCodeField() {
		return ApplicantCodeField;
	}

	public String getApplicantNameField() {
		return ApplicantNameField;
	}

	public String getSAAmountField() {
		return SAAmountField;
	}

	public String getSTAmountField() {
		return STAmountField;
	}

	public String getFOAAmountField() {
		return FOAAmountField;
	}

	public String getFRAAmountField() {
		return FRAAmountField;
	}

	public String getBUGAmountField() {
		return BUGAmountField;
	}

	public String getBUField() {
		return BUField;
	}

	public String getBudgetItemDField() {
		return BudgetItemDField;
	}

	public String getBudgetNoDField() {
		return BudgetNoDField;
	}

	public String getBudgetNameDField() {
		return BudgetNameDField;
	}

	public String getBudgetSubjectDField() {
		return BudgetSubjectDField;
	}

	public String getBudgetYearDField() {
		return BudgetYearDField;
	}

	public String getBudgetMonthDField() {
		return BudgetMonthDField;
	}

	public String getBudgetCurrencyDField() {
		return BudgetCurrencyDField;
	}

	public String getCAvailableQuotaDField() {
		return CAvailableQuotaDField;
	}

	public String getBudgetVersionDField() {
		return BudgetVersionDField;
	}

	public String getAppCurrencyDField() {
		return AppCurrencyDField;
	}

	public String getAppCurrencyAmtDField() {
		return AppCurrencyAmtDField;
	}

	public String getBudgetRateDField() {
		return BudgetRateDField;
	}

	public String getBudgetAmountDField() {
		return BudgetAmountDField;
	}

	public String getBudgetAppNoDField() {
		return BudgetAppNoDField;
	}

	public String getIDDField() {
		return IDDField;
	}

	public String getCapitalizationDField() {
		return CapitalizationDField;
	}

	public String getBudgetCurrencyD1Field() {
		return BudgetCurrencyD1Field;
	}

	public String getIDLField() {
		return IDLField;
	}

	public String getBudgetAppNoLField() {
		return BudgetAppNoLField;
	}

	public String getBudgetNoLField() {
		return BudgetNoLField;
	}

	public String getBudgetYearLField() {
		return BudgetYearLField;
	}

	public String getBudgetMonthLField() {
		return BudgetMonthLField;
	}

	public String getCapitalizationLField() {
		return CapitalizationLField;
	}

	public String getExpenseItemNameLField() {
		return ExpenseItemNameLField;
	}

	public String getExpenseItemCodeLField() {
		return ExpenseItemCodeLField;
	}

	public String getExpenseDeptCodeLField() {
		return ExpenseDeptCodeLField;
	}

	public String getExpenseDeptNameLField() {
		return ExpenseDeptNameLField;
	}

	public String getBudgetCurrencyAmtLField() {
		return BudgetCurrencyAmtLField;
	}

	public String getPaymentTypeLField() {
		return PaymentTypeLField;
	}

	public String getReasonLField() {
		return ReasonLField;
	}

	public String getAmountLField() {
		return AmountLField;
	}

	public String getCurrencyLField() {
		return CurrencyLField;
	}

	public String getBudgetCurrencyRateLField() {
		return BudgetCurrencyRateLField;
	}

	public String getSettlementCurrencyRateLField() {
		return SettlementCurrencyRateLField;
	}

	public String getSettlementAmountLField() {
		return SettlementAmountLField;
	}

	public String getFinanceAmountLField() {
		return FinanceAmountLField;
	}

	public String getReimAmountLField() {
		return ReimAmountLField;
	}

	public String getBudgetCurrencyLField() {
		return BudgetCurrencyLField;
	}

	public String getBudCurrencyLField() {
		return BudCurrencyLField;
	}

	public String getBudCurrencyAmtLField() {
		return BudCurrencyAmtLField;
	}

}
