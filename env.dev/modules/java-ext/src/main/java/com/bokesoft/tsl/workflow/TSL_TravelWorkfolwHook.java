package com.bokesoft.tsl.workflow;

import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yigo.bpm.dev.IWorkflowHook;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_TravelWorkfolwHook implements IWorkflowHook {

	@Override
	public void createWorkitem(BPMContext bpmContext, Workitem workitem) throws Throwable {
	}

	@Override
	public void finishWorkitem(BPMContext bpmContext, Workitem workitem) throws Throwable {
	}

	@Override
	public void preCommitWorkitem(BPMContext bpmContext, Workitem workitem) throws Throwable {
	}

	@Override
	public void startInstanceCheck(BPMContext bpmContext) throws Throwable {
	}

	@Override
	public void workflowStateChanged(BPMContext bpmContext, int oldStatus, int newStatus) throws Throwable {
		long oid = bpmContext.getDocument().getOID();
		DataTable headTable = bpmContext.getDocument().get("B_TravelExpenseApply");
		String errandBillNum = TypeConvertor.toString(headTable.getString("errandBillNum"));
		int airTicket = headTable.getInt("AirTicket");
		int isCBudget = headTable.getInt("IsCBudget");
		if (oldStatus <= 0 && newStatus >= 10) {
			// 冻结预算
			TSL_BudgetHandler handle = new TSL_BudgetHandler();
			handle.TravelControlBudget(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "提交", "" + oid,
					"S", "5", "EFLOW", "0", "0", "APPLY");
		} else if (oldStatus >= 10 && newStatus <= 0) {
			// 释放预算
			TSL_BudgetHandler handle = new TSL_BudgetHandler();
			handle.TravelControlBudget(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "撤回", "" + oid,
					"R", "5", "EFLOW", "0", "0", "APPLY");
		}

		if (airTicket == 1) {
			if (oldStatus <= 20 && newStatus >= 30 && errandBillNum.isEmpty()) {
				// 调用创建中兴商旅出差申请单接口
				TSL_TravelCreateErrandBillHandler handle = new TSL_TravelCreateErrandBillHandler();
				handle.TravelCreateErrandBill(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "部门一级",
						"" + oid, "new");
			} else if (oldStatus <= 20 && newStatus >= 30 && !errandBillNum.isEmpty() && errandBillNum != null) {
				// 重新调用创建中兴商旅出差申请单接口
				TSL_TravelCreateErrandBillHandler handle = new TSL_TravelCreateErrandBillHandler();
				handle.TravelCreateErrandBill(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "部门一级重抛",
						"" + oid, "modify");
			}
		}
		if (isCBudget == 1) {
			if (oldStatus <= 40 && newStatus >= 50) {
				// 冻结预算
				TSL_BudgetHandler handle = new TSL_BudgetHandler();
				handle.TravelControlBeyondBudget(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "申请人确认", "" + oid,
						"S", "1", "EFLOW", "0", "0", "APPLY");
			} else if (oldStatus >= 50 && newStatus <= 40) {
				TSL_BudgetHandler handle = new TSL_BudgetHandler();
				handle.TravelControlBeyondBudget(bpmContext, "B_TravelExpenseApply", "TravelExpenseApply_flow", "撤回申请人确认", "" + oid,
						"R", "1", "EFLOW", "0", "0", "APPLY");
			}
		}
	}
}
