package com.bokesoft.tsl.workflow;

import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yigo.bpm.dev.IWorkflowHook;

public class TSL_BudgetWorkfolwHook implements IWorkflowHook {

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
		if (oldStatus <= 0 && newStatus >= 10) {
			// 冻结预算
			TSL_BudgetHandler handle = new TSL_BudgetHandler();
			handle.TravelControlBudget(bpmContext, "B_CostApply", "CostApply_flow", "提交", "" + oid, "S", "5", "1", "EFLOW",
					"0", "0", "APPLY");
		} else if (oldStatus >= 10 && newStatus <= 0) {
			// 释放预算
			TSL_BudgetHandler handle = new TSL_BudgetHandler();
			handle.TravelControlBudget(bpmContext, "B_CostApply", "CostApply_flow", "撤回", "" + oid, "R", "5", "1", "EFLOW",
					"0", "0", "APPLY");
		}
	}
}
