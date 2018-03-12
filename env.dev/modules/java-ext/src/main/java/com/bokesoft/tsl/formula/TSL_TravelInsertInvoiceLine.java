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

public class TSL_TravelInsertInvoiceLine extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_INSERT_INVOICELINES_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_TravelExpenseApply");
		DataTable detailTable = document.get("B_TravelExpenseApplyTRE");
		DataTable detailTable1 = document.get("B_TravelExpenseApplyGRE");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// 默认固定值“ITEM”
		String linetypelookupcode = "ITEM";
		String invoicenumber = headTable.getObject("InstanceID") + "_P";
		// OperationUnitCode承担业务实体Code
		String orgid = headTable.getObject("OU_CODE").toString();
		// 申请人姓名
		String employeename = headTable.getObject("ApplicantName").toString();
		// 申请人工号
		String employeenumber = headTable.getObject("ApplicantCode").toString();
		// 申请人姓名+“_”+申请人工号+“_”+任务号(ApplicantName+'-'+ApplicantHrid+'-'+ TaskID)
		String description = employeename + "-" + employeenumber + "-" + headTable.getObject("InstanceID");
		// 公司编号
		String companycode = TypeConvertor.toString(headTable.getObject("CompanyID"));
		// 成本中心编号
		String costcentercode = TypeConvertor.toString(headTable.getObject("CostCenterCode"));
		// 项目编号
		String projectcode = TypeConvertor.toString(headTable.getObject("ProjectCode"));
		HashMap<MultiKey, ArrayList<Integer>> t_map = new HashMap<MultiKey, ArrayList<Integer>>();
		int t_rowCount = detailTable.size();
		for (int rowIndex = 0; rowIndex < t_rowCount; rowIndex++) {
			MultiKey key = new MultiKey();
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("T_ExpenseItemcode")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("T_FEE_CATEGORY")));
			ArrayList<Integer> list = t_map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				t_map.put(key, list);
			}
			list.add(rowIndex);
		}
		Iterator<ArrayList<Integer>> t_it = t_map.values().iterator();
		int t_linenumber = 0;
		while (t_it.hasNext()) {
			BigDecimal t_amount = BigDecimal.ZERO;
			String t_distcodeconcatenated = "";
			String t_budgetnumber = "";
			String t_expenseitemcode = "";
			boolean t_bFirst = true;
			ArrayList<Integer> list = t_it.next();
			for (int rowIndex : list) {
				if (t_bFirst) {
					// 明细行号Index 循序标识从1开始
					t_expenseitemcode = detailTable.getString(rowIndex, "T_ExpenseItemcode");
					// financeSpecialCode组合
					if (projectcode.isEmpty()) {
						t_distcodeconcatenated = companycode + "-" + costcentercode + "-" + t_expenseitemcode
								+ "-0-0-0-0-0-0-0";
					} else {
						t_distcodeconcatenated = companycode + "-" + costcentercode + "-" + t_expenseitemcode + "-0-"
								+ projectcode + "-0-0-0-0-0";
					}
					// BudgetNo预算号
					t_budgetnumber = headTable.getString("TRIP_BUDGET_NO");
				}
				// 汇总
				// FinanceAmount财务核准金额（根据T_ExpenseItemcode,T_FEE_CATEGORY分组求和）
				t_amount = t_amount.add(detailTable.getNumeric(rowIndex, "T_FINANCE_AMOUNT"));
				t_bFirst = false;
			}
			t_linenumber++;
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
			paramenter.put("invoice_num", invoicenumber);
			paramenter.put("org_id", orgid);
			paramenter.put("line_number", t_linenumber + "");
			paramenter.put("description", description);
			paramenter.put("line_type_lookup_code", linetypelookupcode);
			paramenter.put("dist_code_concatenated", t_distcodeconcatenated);
			paramenter.put("amount", t_amount.toPlainString());
			paramenter.put("budget_num", t_budgetnumber);
			// 执行BokeDee接口
			factory.executeAction(ACTION);
		}
		HashMap<MultiKey, ArrayList<Integer>> g_map = new HashMap<MultiKey, ArrayList<Integer>>();
		int g_rowCount = detailTable1.size();
		for (int rowIndex = 0; rowIndex < g_rowCount; rowIndex++) {
			MultiKey key = new MultiKey();
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable1.getString("G_ExpenseItemcode")));
			ArrayList<Integer> list = g_map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				g_map.put(key, list);
			}
			list.add(rowIndex);
		}
		Iterator<ArrayList<Integer>> g_it = g_map.values().iterator();		
		while (g_it.hasNext()) {
			BigDecimal g_amount = BigDecimal.ZERO;
			String g_distcodeconcatenated = "";
			String g_budgetnumber = "";
			String g_expenseitemcode = "";
			boolean g_bFirst = true;
			ArrayList<Integer> list = g_it.next();
			for (int rowIndex : list) {
				if (g_bFirst) {
					// 明细行号Index 循序标识从1开始
					g_expenseitemcode = detailTable1.getString(rowIndex, "G_ExpenseItemcode");
					// financeSpecialCode组合
					if (projectcode.isEmpty()) {
						g_distcodeconcatenated = companycode + "-" + costcentercode + "-" + g_expenseitemcode
								+ "-0-0-0-0-0-0-0";
					} else {
						g_distcodeconcatenated = companycode + "-" + costcentercode + "-" + g_expenseitemcode + "-0-"
								+ projectcode + "-0-0-0-0-0";
					}
					// BudgetNo预算号
					g_budgetnumber = headTable.getString("GUEST_BUDGET_NO");
				}
				// 汇总
				// FinanceAmount财务核准金额（根据T_ExpenseItemcode,T_FEE_CATEGORY分组求和）
				g_amount = g_amount.add(detailTable1.getNumeric(rowIndex, "G_FINANCE_AMOUNT"));
				g_bFirst = false;
			}
			t_linenumber++;
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
			paramenter.put("invoice_num", invoicenumber);
			paramenter.put("org_id", orgid);
			paramenter.put("line_number", t_linenumber + "");
			paramenter.put("description", description);
			paramenter.put("line_type_lookup_code", linetypelookupcode);
			paramenter.put("dist_code_concatenated", g_distcodeconcatenated);
			paramenter.put("amount", g_amount.toPlainString());
			paramenter.put("budget_num", g_budgetnumber);
			// 执行BokeDee接口
			factory.executeAction(ACTION);
		}
		return true;
	}
}
