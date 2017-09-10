package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.common.struct.MultiKey;
import com.bokesoft.yes.common.struct.MultiKeyNode;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertInvoiceLine extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_INSERT_INVOICELINES_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_CostApply");
		DataTable detailTable = document.get("B_CostApplyCE");

		HashMap<MultiKey, ArrayList<Integer>> map = new HashMap<MultiKey, ArrayList<Integer>>();
		int rowCount2 = detailTable.size();
		for (int rowIndex = 0; rowIndex < rowCount2; rowIndex++) {
			MultiKey key = new MultiKey();
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_PaymentType")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_ExpenseItemCode")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_ExpenseDeptCode")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_BudgetNo")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("CEDetail_Capitalization")));
			ArrayList<Integer> list = map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				map.put(key, list);
			}

			list.add(rowIndex);
		}

		Iterator<ArrayList<Integer>> it = map.values().iterator();
		int num = 1;
		while (it.hasNext()) {
			BigDecimal amount = BigDecimal.ZERO;
			String InvoiceNumber = "";
			String OrgId = "";
			String LineNumber = "";
			String Description = "";
			// 默认固定值“ITEM”
			String LineTypeLookupCode = "ITEM";
			String DistCodeConcatenated = "";
			String BudgetNumber = "";

			boolean bFirst = true;

			ArrayList<Integer> list = it.next();
			for (int rowIndex : list) {
				if (bFirst) {
					// PaymentType个人支付时:任务号+“_P”； PaymentType公司支付时:任务号+“_C”
					String paymentType = detailTable.getString(rowIndex, "CEDetail_PaymentType");
					if (paymentType == null) {
						InvoiceNumber = headTable.getObject("InstanceID").toString();
					} else if (paymentType.equalsIgnoreCase("PersonalPayment")) {
						InvoiceNumber = headTable.getObject("InstanceID") + "_P";
					} else if (paymentType.equalsIgnoreCase("CompanyPayment")) {
						InvoiceNumber = headTable.getObject("InstanceID") + "_C";
					}
					// OperationUnitCode承担业务实体Code
					OrgId = headTable.getObject("OU_Code").toString();
					// 明细行号Index 循序标识从1开始
					LineNumber = num + "";
					// 申请人姓名
					String EmployeeName = headTable.getObject("ApplicantName").toString();
					// 申请人工号
					String EmployeeNumber = headTable.getObject("ApplicantCode").toString();
					// ApplicantName+'-'+ApplicantHrid+'-'+ TaskID
					// 申请人姓名+“_”+申请人工号+“_”+任务号
					Description = EmployeeName + "-" + EmployeeNumber + "-" + headTable.getObject("OID");
					// financeSpecialCode组合
					String capitalization = detailTable.getString(rowIndex, "CEDetail_Capitalization");
					String ProjectCode = TypeConvertor.toString(headTable.getObject("ProjectCode"));
					if (capitalization.equalsIgnoreCase("1")) {
						if (ProjectCode.isEmpty()) {
							DistCodeConcatenated = headTable.getObject("CompanyCode") + "-0-"
									+ detailTable.getString(rowIndex, "CEDetail_ExpenseItemCode") + "-0-0-0-0-0-0-0";
						} else {
							DistCodeConcatenated = headTable.getObject("CompanyCode") + "-0-"
									+ detailTable.getString(rowIndex, "CEDetail_ExpenseItemCode") + "-0-" + ProjectCode
									+ "-0-0-0-0-0";
						}
					} else if (capitalization.equalsIgnoreCase("2")) {
						if (ProjectCode.isEmpty()) {
							DistCodeConcatenated = headTable.getObject("CompanyCode") + "-"
									+ headTable.getObject("CostCenterCode") + "-"
									+ detailTable.getString(rowIndex, "CEDetail_ExpenseItemCode") + "-0-0-0-0-0-0-0";
						} else {
							DistCodeConcatenated = headTable.getObject("CompanyCode") + "-"
									+ headTable.getObject("CostCenterCode") + "-"
									+ detailTable.getString(rowIndex, "CEDetail_ExpenseItemCode") + "-0-" + ProjectCode
									+ "-0-0-0-0-0";
						}
					}
					// BudgetNo预算号
					BudgetNumber = detailTable.getString(rowIndex, "CEDetail_BudgetNo");
				}
				// 汇总
				// FinanceAmount财务核准金额（根据PaymentType,ExpenseItemCode等分组求和）
				amount = amount.add(detailTable.getNumeric(rowIndex, "CEDetail_FinanceAmount"));

				bFirst = false;
			}
			num++;
			// 接口调用
			TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
			HashMap<String, String> paramenter = factory.getParameter();
			paramenter.put("invoice_num", InvoiceNumber);
			paramenter.put("org_id", OrgId);
			paramenter.put("line_number", LineNumber);
			paramenter.put("description", Description);
			paramenter.put("line_type_lookup_code", LineTypeLookupCode);
			paramenter.put("dist_code_concatenated", DistCodeConcatenated);
			paramenter.put("amount", amount.toPlainString());
			paramenter.put("budget_num", BudgetNumber);
			// 执行BokeDee接口
			factory.executeAction(ACTION);

		}

		return true;
	}
}
