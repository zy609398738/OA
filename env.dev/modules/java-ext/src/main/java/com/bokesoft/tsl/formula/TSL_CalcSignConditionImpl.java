package com.bokesoft.tsl.formula;

import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.engine.common.Result;
import com.bokesoft.yes.bpm.engine.instance.BPMInstance;
import com.bokesoft.yes.bpm.workitem.WorkitemState;
import com.bokesoft.yes.bpm.workitem.data.RWorkitem;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class TSL_CalcSignConditionImpl extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		BPMContext bpmContext = (BPMContext) context;;
		BPMInstance bpmInstance = bpmContext.getActiveBPMInstance();
		
		int totalCount = 0;// 总人数
		int signCount = 0;// 已会签人数
		int effectiveCount = 0;// 已会签人数（不含弃权）
		int approveCount = 0;// 赞成人数
		for (Long workitemID : bpmInstance.getMainInstance().getInstanceData().getWorkitemInfo().getWorkitemIDByNodeID(bpmContext.getActiveNode().getNodeModel().getID())) {
			totalCount++;
			RWorkitem rw = bpmInstance.getInstanceData().getWorkitemData().getWorkitemData(context, workitemID);
			if (rw.getWorkitemState() != WorkitemState.NEW)
				signCount++;
			if (rw.getWorkitemState() == WorkitemState.FINISH) {
				if (rw.getAuditResult() == Result.APPROVE) {
					approveCount++;
					effectiveCount++;
				} else if (rw.getAuditResult() == Result.OPPOSE)
					effectiveCount++;
			}
		}
		
		if (signCount > approveCount) {
			return true;
		}
		
		if (approveCount == totalCount) {
			return true;
		}
		
		return false;
	}
}
