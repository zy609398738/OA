package com.bokesoft.tsl.workflow;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import com.bokesoft.oa.mid.wf.OaWfTemplate;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.engine.instance.BPMInstance;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.bpm.dev.Spoon;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.MetaDictionary;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.Participator;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_WfTemplate extends OaWfTemplate {
	private static String IS_AUDITED_QUERY = "select count(*) as count from bpm_workiteminfo where instanceid=? and nodeid=?";

	private static String OPERATOR_QUERY = "select operatorid from wf_workitem where workitemid in (select workitemid from bpm_workiteminfo where instanceid=? and nodeid = ?) and auditresult=1";

	private static String SEPERATOR = ":";

	public List<Participator> getParticipatorList(DefaultContext context, MetaProcess process, MetaNode node,
			MetaNode parentNode, Spoon spoon) throws Throwable {
		List<Participator> list = super.getParticipatorList(context, process, node, parentNode, spoon);
		String processKey = process.getKey();
		if (processKey.equalsIgnoreCase("ERPAccAuzChgApp_flow")) {
			BPMContext bpmContext = (BPMContext) context;
			BPMInstance bpmInstance = bpmContext.getActiveBPMInstance();
			Workitem workitem = bpmContext.getUpdateWorkitem();
			
			if (workitem == null ||  workitem.getAuditResult() != 6) {
				return list;
			}
			
			if (node.getID() == 7) {
				if (!isAudited(bpmContext, bpmInstance.getInstanceID(), 115)) {
					list.clear();
				}
			} else if (node.getID() == 115) {
				if (!isAudited(bpmContext, bpmInstance.getInstanceID(), 115)) {
					HashSet<Long> auditedOperatorID = new HashSet<Long>();
					// 获取所有点击过通过的人，从列表中去除
					DataTable dataTable = getLastParticipator(bpmContext, bpmInstance.getInstanceID(), 115);
					dataTable.beforeFirst();
					while (dataTable.next()) {
						long operatorID = dataTable.getLong("operatorid");
						auditedOperatorID.add(operatorID);
					}

					Iterator<Participator> it = list.iterator();
					while (it.hasNext()) {
						Participator participator = it.next();
						if (participator instanceof MetaDictionary) {
							MetaDictionary metaDictionary = (MetaDictionary) participator;
							String[] ids = metaDictionary.getItemID().split(SEPERATOR);
							ArrayList<String> idList = toArrayList(ids);
							for (int i = idList.size() - 1; i >= 0; i--) {
								if (auditedOperatorID.contains(TypeConvertor.toLong(idList.get(i)))) {
									idList.remove(i);
								}
							}
							String strIDs = StringUtil.join(SEPERATOR, (String[]) idList.toArray(new String[0]));
							metaDictionary.setItemID(strIDs);
						}
					}
				}
			}
		}
		return list;
	}

	public boolean getAutoIgnoreNoParticipator(DefaultContext context, MetaProcess process, MetaNode node, Spoon spoon)
			throws Throwable {
		boolean ignore = super.getAutoIgnoreNoParticipator(context, process, node, spoon);
		String processKey = process.getKey();
		if (processKey.equalsIgnoreCase("ERPAccAuzChgApp_flow")) {
			BPMContext bpmContext = (BPMContext) context;
			BPMInstance bpmInstance = bpmContext.getActiveBPMInstance();
			Workitem workitem = bpmContext.getUpdateWorkitem();
			if (workitem == null ||  workitem.getAuditResult() != 6) {
				return ignore;
			}
			
			if (node.getID() == 7) {
				if (!isAudited(bpmContext, bpmInstance.getInstanceID(), 115)) {
					return true;
				}
			}
		}
		return ignore;
	}

	private boolean isAudited(DefaultContext context, long instanceID, int nodeID) throws Throwable {
		IDBManager dbManager = context.getDBManager();
		DataTable dataTable = dbManager.execPrepareQuery(IS_AUDITED_QUERY, instanceID, nodeID);
		long count = TypeConvertor.toLong(dataTable.getObject(0, 0));

		return count == 0;
	}

	private DataTable getLastParticipator(DefaultContext context, long instanceID, int nodeID) throws Throwable {
		IDBManager dbManager = context.getDBManager();
		DataTable dataTable = dbManager.execPrepareQuery(OPERATOR_QUERY, instanceID, nodeID);

		return dataTable;
	}

	private ArrayList<String> toArrayList(String[] arr) {
		ArrayList<String> list = new ArrayList<>();
		for (String s : arr) {
			list.add(s);
		}

		return list;
	}
}
