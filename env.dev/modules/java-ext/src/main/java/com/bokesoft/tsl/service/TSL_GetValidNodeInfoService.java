package com.bokesoft.tsl.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.engine.util.ProcessUtil;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.bpm.process.node.NodeType;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_GetValidNodeInfoService implements IExtService2 {

	private static String NodeType_Query = "Select nodeType from bpm_node where instanceid=? and nodeid=?";

	private static String Operator_Query = "select d.operatorid from bpm_log h join wf_workitem d on h.workitemid = d.workitemid where h.workitemstate = 2 and h.instanceid = ? and h.nodeid = ? and transfertype<>3 and h.auditresult=1 order by h.workitemid desc";

	private static String AssignInfo_Query = "select pworkitemid4transfer, parentworkitemid,transfertype,operatorid from bpm_workiteminfo h join wf_workitem d on h.workitemid=d.workitemid where h.workitemid=?";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		int nodeID = TypeConvertor.toInteger(args.get("nodeID"));
		long instanceID = TypeConvertor.toLong(args.get("instanceID"));
		String processKey = TypeConvertor.toString(args.get("processKey"));
		long workitemID = TypeConvertor.toLong(args.get("workitemID"));
		Document document = context.getDocument();

		IDBManager dbManager = context.getDBManager();

		BPMContext bpmContext = new BPMContext(context);
		bpmContext.setDocument(document);

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaProcess metaProcess = metaFactory.getProcessDefinationByDeployKey(processKey);

		MetaDataObject metaDataObject = document.getMetaDataObject();
		DataTable mainTable = document.get(metaDataObject.getMainTable().getKey());

		DataTable dt = new DataTable();
		dt.addColumn(new ColumnInfo("Value", DataType.STRING));
		dt.addColumn(new ColumnInfo("Key", DataType.STRING));

		// 寻找指派链数据
		MetaNode metaNode = metaProcess.getNodeByID(nodeID);
		ArrayList<Long> AssignInfoList = getAssignInfo(dbManager, nodeID, workitemID);
		for (long operatorID : AssignInfoList) {
			String name = DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "Name").toString();
			long empID = TypeConvertor.toLong(DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "EmpID"));
			String adAccount = DictCacheUtil.getDictValue(context.getVE(), "Dict_Employee", empID, "ADAccount").toString();
			String operatorName = name + "(" + adAccount + ")";

			dt.append();
			dt.setObject("Value", nodeID + "-" + operatorID);
			dt.setObject("Key", metaNode.getCaption() + "(" + operatorName + ")");
		}

		// 寻找能撤回的节点
		List<Integer> list = ProcessUtil.getValidSites2(bpmContext, nodeID, processKey, instanceID, true);
		for (int temNodeID : list) {
			metaNode = metaProcess.getNodeByID(temNodeID);
			String operatorName = "";
			String name = null;
			String adAccount = null;

			if (metaNode.getNodeType() == NodeType.BEGIN) {
				long creator = mainTable.getLong("Creator");
				name = DictCacheUtil.getDictValue(context.getVE(), "Operator", creator, "Name").toString();
				long empID = TypeConvertor.toLong(DictCacheUtil.getDictValue(context.getVE(), "Operator", creator, "EmpID"));
				adAccount = DictCacheUtil.getDictValue(context.getVE(), "Dict_Employee", empID, "ADAccount").toString();
				operatorName = name + "(" + adAccount + ")";

				dt.append();
				dt.setObject("Value", temNodeID + "-" + creator);
				dt.setObject("Key", metaNode.getCaption() + "(" + operatorName + ")");
			} else {
				int nodeType = getNodeType(dbManager, instanceID, temNodeID);
				if (nodeType == 4) {
					// 会签
					HashSet<Long> set = getCountersignNodeOperator(dbManager, instanceID, temNodeID);
					Iterator<Long> it = set.iterator();
					while (it.hasNext()) {
						long operatorID = it.next();
						if (operatorID > 0) {
							name = DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "Name").toString();
							long empID = TypeConvertor.toLong(DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "EmpID"));
							adAccount = DictCacheUtil.getDictValue(context.getVE(), "Dict_Employee", empID, "ADAccount").toString();
							operatorName = name + "(" + adAccount + ")";
	
							dt.append();
							dt.setObject("Value", temNodeID + "-" + operatorID);
							dt.setObject("Key", metaNode.getCaption() + "(" + operatorName + ")");
						}
					}
				} else {
					// 其他审批节点
					HashSet<Long> set = getNodeOperator(dbManager, instanceID, temNodeID);
					Iterator<Long> it = set.iterator();
					while (it.hasNext()) {
						long operatorID = it.next();
						if (operatorID > 0) {
							name = DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "Name").toString();
							long empID = TypeConvertor.toLong(DictCacheUtil.getDictValue(context.getVE(), "Operator", operatorID, "EmpID"));
							adAccount = DictCacheUtil.getDictValue(context.getVE(), "Dict_Employee", empID, "ADAccount").toString();
							operatorName = name + "(" + adAccount + ")";
		
							dt.append();
							dt.setObject("Value", temNodeID + "-" + operatorID);
							dt.setObject("Key", metaNode.getCaption() + "(" + operatorName + ")");
						}
					}
				}
			}
		}
		return dt;
	}

	private int getNodeType(IDBManager dbManager, long instanceID, int nodeID) throws Throwable {
		DataTable dt = dbManager.execPrepareQuery(NodeType_Query, instanceID, nodeID);
		if (dt.first()) {
			return dt.getInt("nodeType");
		}

		return -1;
	}

	private HashSet<Long> getNodeOperator(IDBManager dbManager, long instanceID, int nodeID) throws Throwable {
		HashSet<Long> set = new HashSet<Long>();
		DataTable dt = dbManager.execPrepareQuery(Operator_Query, instanceID, nodeID);
		dt.beforeFirst();
		while (dt.next()) {
			set.add(dt.getLong("operatorid"));
		}
		return set;
	}

	private HashSet<Long> getCountersignNodeOperator(IDBManager dbManager, long instanceID, int nodeID)
			throws Throwable {
		HashSet<Long> set = new HashSet<>();
		DataTable dt = dbManager.execPrepareQuery(Operator_Query, instanceID, nodeID);
		dt.beforeFirst();
		while (dt.next()) {
			set.add(dt.getLong("operatorid"));
		}

		return set;
	}

	private ArrayList<Long> getAssignInfo(IDBManager dbManager, int nodeID, long workitemID) throws Throwable {
		ArrayList<Long> list = new ArrayList<Long>();

		DataTable dt = null;
		long parentWorkitemID = workitemID;
		int transfertype = -1;
		long operatorID = -1l;

		boolean bFirst = true;
		while (true) {
			transfertype = -1;
			dt = dbManager.execPrepareQuery(AssignInfo_Query, parentWorkitemID);
			if (dt.first()) {
				transfertype = dt.getInt("transfertype");
				parentWorkitemID = dt.getLong("pworkitemid4transfer");
				operatorID = dt.getLong("operatorid");

				if (bFirst) {
					bFirst = false;
				} else {
					list.add(operatorID);
				}
			}

			if (transfertype != 2) {
				break;
			}
		}

		return list;
	}
}
