package com.bokesoft.tsl.workflow;

import java.util.ArrayList;
import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yigo.bpm.dev.IWorkflowHook;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_DeletePOTaskidHook implements IWorkflowHook {

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
		String ACTION = "ERP_POEFLOW_To_BPM";
		Document doc = bpmContext.getDocument();
		String billkey = "B_RrpairConfirmation";
		String flow = "RrpairConfirmation_flow";
		String node = "经办人确认";
		long oid = doc.getOID();
		DataTable dtHead = doc.get("B_RrpairConfirmation");
		DataTable dtDtl = doc.get("B_RrpairConfirmationDtl");
		int isAutoGenerate = TypeConvertor.toInteger(dtHead.getObject("isAutoGenerate"));
		String[] line_ids = TypeConvertor.toString(dtHead.getObject("DtlLines")).split(",");
		if (isAutoGenerate == 0) {
			return;
		}
		if (oldStatus <= 10 && newStatus >= 20) {
			ArrayList<String> deletedLine = new ArrayList<String>();
			for (String line_id : line_ids) {
				if (!line_id.isEmpty()) {
					boolean bFind = false;
					dtDtl.beforeFirst();
					while (dtDtl.next()) {
						String line = dtDtl.getString("Line");
						if (line.equals(line_id)) {
							bFind = true;
							break;
						}
					}

					if (!bFind) {
						deletedLine.add(line_id);
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

						factory.addParameter("oid", "" + oid);

						HashMap<String, String> paramenter = factory.getParameter();
						paramenter.put("p_line_id", line_id);
						// 获取返回值，并转换为JSONObject
						String stringJson = factory.executeAction(ACTION);
						JSONObject reJSONObject = JSONObject.parseObject(stringJson);
						String returnStatus = TypeConvertor.toString(reJSONObject.get("x_return_status"));
						if (returnStatus.equalsIgnoreCase("e")) {
							throw new Exception(
									"删除Taskid失败,错误信息:" + TypeConvertor.toString(reJSONObject.get("x_msg_data")));
						}
					}
				}
			}

			String lines = "";
			for (String line : line_ids) {
				if (!deletedLine.contains(line)) {
					lines += line + ",";
				}
			}

			dtHead.setObject("DtlLines", lines);
			SaveData sd = new SaveData(doc.getMetaDataObject(), null, doc);
			sd.save(new DefaultContext(new DefaultContext(bpmContext)));
		}
	}
}
