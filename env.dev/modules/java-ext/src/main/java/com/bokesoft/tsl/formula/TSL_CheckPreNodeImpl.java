package com.bokesoft.tsl.formula;

import java.util.List;
import java.util.TreeSet;

import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.engine.data.table.TWorkitemInfo;
import com.bokesoft.yes.bpm.engine.instance.BPMInstance;
import com.bokesoft.yes.bpm.engine.node.ExecComplexJoin;
import com.bokesoft.yes.bpm.engine.node.ExecFork;
import com.bokesoft.yes.bpm.engine.node.ExecNode;
import com.bokesoft.yes.bpm.engine.util.ProcessUtil;
import com.bokesoft.yes.bpm.workitem.data.RWorkitem;
import com.bokesoft.yigo.meta.bpm.process.node.MetaComplexJoin;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_CheckPreNodeImpl extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		Document document = context.getDocument();
		BPMContext bpmContext = (BPMContext)context;
		bpmContext.setDocument(document);
		BPMInstance bpmInstance= bpmContext.getActiveBPMInstance();
		
		ExecComplexJoin join = (ExecComplexJoin) bpmContext.getActiveNode();
		ExecNode iNode = bpmInstance.getMainInstanceNodeByID(((MetaComplexJoin)join.getNodeModel()).getFork().getID());
		int count = ((ExecFork)iNode).getTransitionCount();
		if (count > 0) {
			return false;
		}
		
		int activeNodeID = bpmContext.getActiveNodeID();
		String processKey = bpmContext.getActiveBPMInstance().getMainInstance().getDefinationKey();
		List<Integer> list = ProcessUtil.getValidSites2(bpmContext, activeNodeID, processKey, -1, true);

		TWorkitemInfo tWorkitemInfo = bpmContext.getActiveBPMInstance().getInstanceData().getWorkitemInfo();
		TreeSet<Long> set = tWorkitemInfo.getAllIDSet();
		
		for (long workItemID : set) {
			RWorkitem rWorkitem = bpmInstance.getInstanceData().getWorkitemData().getWorkitemData(bpmContext, workItemID);
			if (rWorkitem.getWorkitemState() == 1 && list.contains(rWorkitem.getNodeID())) {
				return false;
			}
		}
		
		return true;
	}
}
