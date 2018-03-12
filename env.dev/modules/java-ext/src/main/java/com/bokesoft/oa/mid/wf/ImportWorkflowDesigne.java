package com.bokesoft.oa.mid.wf;

import java.util.Map;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigne;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class ImportWorkflowDesigne implements IExtService2 {
	private static String WorkFlowDesigneObjectKey = "OA_WorkflowDesigne";
	private static String WorkFlowDesigneHeadTableKey = "OA_WorkflowDesigne_H";
	private static String WorkFlowDesigneDtlTableKey = "OA_WorkflowDesigne_D";

	private static String OperatorSelObjectKey = "OA_OperatorSel";
	private static String OperationSelObjectKey = "OA_OperationSel";
	private static String NodePropertyObjectKey = "OA_NodeProperty";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String workflowKey = TypeConvertor.toString(args.get("workflowKey"));
		String workflowVersion = TypeConvertor.toString(args.get("workflowVersion"));
		long workflowID = TypeConvertor.toLong(args.get("workflowID"));
		long workflowTypeDtlID = TypeConvertor.toLong(args.get("workflowTypeDtlID"));
		long workflowDesigneID = TypeConvertor.toLong(args.get("workflowDesigneID"));
		String formkey = TypeConvertor.toString(args.get("formkey"));

		return importWorkflowDesigne(context, workflowKey, workflowVersion, workflowID, workflowTypeDtlID,
				workflowDesigneID, formkey);
	}

	private long newWorkFlowDocumentAndSave(DefaultContext context, long oid, String objectKey, long sourceID) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		LoadData ld = new LoadData(objectKey, oid);
		Document srcDocument = ld.load(new DefaultContext(context), null);

		MetaDataObject metaDataObject = metaFactory.getDataObject(objectKey);
		Document trgDocument = DocumentUtil.newDocument(metaDataObject);
		trgDocument.setNew();

		trgDocument = OADocumentUtil.cloneDocument(metaDataObject, srcDocument, trgDocument);
		DataTable dataTable = trgDocument.get(metaDataObject.getMainTableKey());
		dataTable.first();
		dataTable.setObject("SourceID", sourceID);
		
		SaveData sd = new SaveData(objectKey, null, trgDocument);
		sd.save(new DefaultContext(context));

		return trgDocument.getOID();
	}

	public boolean importWorkflowDesigne(DefaultContext context, String workflowKey, String workflowVersion,
			long workflowID, long workflowTypeDtlID, long workflowDesigneID, String formkey) throws Throwable {
		OAContext oac = new OAContext(context);
		IMetaFactory metaFactory = context.getVE().getMetaFactory();

		MetaDataObject metaDataObject = metaFactory.getDataObject(WorkFlowDesigneObjectKey);
		MetaTable dtlMetaTable = metaDataObject.getTable(WorkFlowDesigneDtlTableKey);

		WorkflowDesigne workflowSet = oac.getWorkflowMap().get(workflowID).getWorkflowDesigne();
		LoadData ld = new LoadData(WorkFlowDesigneObjectKey, workflowSet.getOID());
		Document srcWorkFlowDocument = ld.load(new DefaultContext(context), null);
		
		Document trgWorkFlowDocument = null;
		if (workflowDesigneID <= 0) {
			trgWorkFlowDocument = createNewWorkFlowDocument(new DefaultContext(context), metaDataObject, srcWorkFlowDocument,
					trgWorkFlowDocument, workflowTypeDtlID, workflowVersion,formkey);
		} else {
			// 在原来的基础上修改,只修改明细数据
			ld = new LoadData(WorkFlowDesigneObjectKey, workflowDesigneID);
			trgWorkFlowDocument = ld.load(new DefaultContext(context), null);
			
			// 判断版本号
			DataTable trgWorkFlowHeadTable = trgWorkFlowDocument.get(WorkFlowDesigneHeadTableKey);
			String trgVersion = TypeConvertor.toString(trgWorkFlowHeadTable.getObject("WorkflowVersion"));
			if (!trgVersion.equalsIgnoreCase(workflowVersion)) {
				createNewWorkFlowDocument(new DefaultContext(context), metaDataObject, srcWorkFlowDocument, trgWorkFlowDocument,
						workflowTypeDtlID, workflowVersion,formkey);
			} else {
				modifyWorkFlowDocument(new DefaultContext(context), dtlMetaTable, srcWorkFlowDocument, trgWorkFlowDocument);
			}
		}

		SaveData sd = new SaveData(WorkFlowDesigneObjectKey, null, trgWorkFlowDocument);
		sd.save(new DefaultContext(context));

		return true;
	}

	private void modifyWorkFlowDocument(DefaultContext context, MetaTable dtlMetaTable, Document srcWorkFlowDocument,
			Document trgWorkFlowDocument) throws Throwable {
		DataTable srcWorkFlowDtlTable = srcWorkFlowDocument.get(WorkFlowDesigneDtlTableKey);
		DataTable trgWorkFlowDtlTable = trgWorkFlowDocument.get(WorkFlowDesigneDtlTableKey);
		srcWorkFlowDtlTable.beforeFirst();
		// 循环明细数据，发现目标表中有nodeid的就做修改，没有就新增
		while (srcWorkFlowDtlTable.next()) {
			Object nodeID = srcWorkFlowDtlTable.getObject("AuditNode");
			int rowIndex = trgWorkFlowDtlTable.findRow("AuditNode", nodeID);
			if (rowIndex < 0) {
				rowIndex = DocumentUtil.newRow(dtlMetaTable, trgWorkFlowDtlTable);
				OADocumentUtil.cloneOneRow(dtlMetaTable, srcWorkFlowDtlTable, trgWorkFlowDtlTable);
			}
			trgWorkFlowDtlTable.setPos(rowIndex);

			long sourceID = trgWorkFlowDocument.getOID();
			// 审批人、AuditPerOID
			long trgAuditPerOID = trgWorkFlowDtlTable.getLong("AuditPerOID");
			long srcAuditPerOID = srcWorkFlowDtlTable.getLong("AuditPerOID");
			if (trgAuditPerOID <= 0 && srcAuditPerOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcAuditPerOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("AuditPerOID", oid);
				trgWorkFlowDtlTable.setObject("AuditPerDepict", srcWorkFlowDtlTable.getObject("AuditPerDepict"));
			}

			// 审批操作、AuditOptOID
			long trgAuditOptOID = trgWorkFlowDtlTable.getLong("AuditOptOID");
			long srcAuditOptOID = srcWorkFlowDtlTable.getLong("AuditOptOID");
			if (trgAuditOptOID <= 0 && srcAuditOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcAuditOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("AuditOptOID", oid);
				trgWorkFlowDtlTable.setObject("AuditOptDepict", srcWorkFlowDtlTable.getObject("AuditOptDepict"));
			}

			// 加签、EndorseOptOID
			long trgEndorseOptOID = trgWorkFlowDtlTable.getLong("EndorseOptOID");
			long srcEndorseOptOID = srcWorkFlowDtlTable.getLong("EndorseOptOID");
			if (trgEndorseOptOID <= 0 && srcEndorseOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcEndorseOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("EndorseOptOID", oid);
				trgWorkFlowDtlTable.setObject("EndorseOptDepict", srcWorkFlowDtlTable.getObject("EndorseOptDepict"));
			}

			// 传阅、SendOptOID
			long trgSendOptOID = trgWorkFlowDtlTable.getLong("SendOptOID");
			long srcSendOptOID = srcWorkFlowDtlTable.getLong("SendOptOID");
			if (trgSendOptOID <= 0 && srcSendOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcSendOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("SendOptOID", oid);
				trgWorkFlowDtlTable.setObject("SendOptDepict", srcWorkFlowDtlTable.getObject("SendOptDepict"));
			}

			// 监控人员、MonitoringOptOID
			long trgMonitoringOptOID = trgWorkFlowDtlTable.getLong("MonitoringOptOID");
			long srcMonitoringOptOID = srcWorkFlowDtlTable.getLong("MonitoringOptOID");
			if (trgMonitoringOptOID <= 0 && srcMonitoringOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcMonitoringOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("MonitoringOptOID", oid);
				trgWorkFlowDtlTable.setObject("MonitoringOptDepict",
						srcWorkFlowDtlTable.getObject("MonitoringOptDepict"));
			}

			// 当前抄送人、CarbonCopyOptOID
			long trgCarbonCopyOptOID = trgWorkFlowDtlTable.getLong("CarbonCopyOptOID");
			long srcCarbonCopyOptOID = srcWorkFlowDtlTable.getLong("CarbonCopyOptOID");
			if (trgCarbonCopyOptOID <= 0 && srcCarbonCopyOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcCarbonCopyOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("CarbonCopyOptOID", oid);
				trgWorkFlowDtlTable.setObject("CarbonCopyOptDepict",
						srcWorkFlowDtlTable.getObject("CarbonCopyOptDepict"));
			}

			// 审批操作抄送人、OptCarbonCopyOptOID
			long trgOptCarbonCopyOptOID = trgWorkFlowDtlTable.getLong("OptCarbonCopyOptOID");
			long srcOptCarbonCopyOptOID = srcWorkFlowDtlTable.getLong("OptCarbonCopyOptOID");
			if (trgOptCarbonCopyOptOID <= 0 && srcOptCarbonCopyOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcOptCarbonCopyOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("OptCarbonCopyOptOID", oid);
				trgWorkFlowDtlTable.setObject("OptCarbonCopyOptDepict",
						srcWorkFlowDtlTable.getObject("OptCarbonCopyOptDepict"));
			}

			// 节点属性ID、NodePropertyOID
			long trgNodePropertyOID = trgWorkFlowDtlTable.getLong("NodePropertyOID");
			long srcNodePropertyOID = srcWorkFlowDtlTable.getLong("NodePropertyOID");
			if (trgNodePropertyOID <= 0 && srcNodePropertyOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, srcNodePropertyOID, NodePropertyObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("NodePropertyOID", oid);
			}
		}
	}

	private Document createNewWorkFlowDocument(DefaultContext context, MetaDataObject metaDataObject,
			Document srcWorkFlowDocument, Document trgWorkFlowDocument, long workflowTypeDtlID, String workflowVersion,String formkey)
			throws Throwable {
		// 全新开一个
		trgWorkFlowDocument = DocumentUtil.newDocument(metaDataObject);
		trgWorkFlowDocument.setNew();

		// 复制整个document
		trgWorkFlowDocument = OADocumentUtil.cloneDocument(metaDataObject, srcWorkFlowDocument, trgWorkFlowDocument);
		long sourceID = context.applyNewOID();
		trgWorkFlowDocument.setOID(sourceID);
		
		// 修改表头数据
		DataTable trgWorkFlowHeadTable = trgWorkFlowDocument.get(WorkFlowDesigneHeadTableKey);
		trgWorkFlowHeadTable.setString("Tag1", "OA_WorkflowType");
		trgWorkFlowHeadTable.setString("Tag2", TypeConvertor.toString(workflowTypeDtlID));
		trgWorkFlowHeadTable.setString("WorkflowVersion", workflowVersion);
		trgWorkFlowHeadTable.setString("WorkflowFormKey", formkey);
		// 修改明细数据
		DataTable trgWorkFlowDtlTable = trgWorkFlowDocument.get(WorkFlowDesigneDtlTableKey);
		trgWorkFlowDtlTable.beforeFirst();
		while (trgWorkFlowDtlTable.next()) {
			// 审批人、AuditPerOID
			long auditPerOID = trgWorkFlowDtlTable.getLong("AuditPerOID");
			if (auditPerOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, auditPerOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("AuditPerOID", oid);
			}

			// 审批操作、AuditOptOID
			long auditOptOID = trgWorkFlowDtlTable.getLong("AuditOptOID");
			if (auditOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, auditOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("AuditOptOID", oid);
			}

			// 加签、EndorseOptOID
			long endorseOptOID = trgWorkFlowDtlTable.getLong("EndorseOptOID");
			if (endorseOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, endorseOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("EndorseOptOID", oid);
			}

			// 传阅、SendOptOID
			long sendOptOID = trgWorkFlowDtlTable.getLong("SendOptOID");
			if (sendOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, sendOptOID, OperationSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("SendOptOID", oid);
			}

			// 监控人员、MonitoringOptOID
			long monitoringOptOID = trgWorkFlowDtlTable.getLong("MonitoringOptOID");
			if (monitoringOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, monitoringOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("MonitoringOptOID", oid);
			}

			// 当前抄送人、CarbonCopyOptOID
			long carbonCopyOptOID = trgWorkFlowDtlTable.getLong("CarbonCopyOptOID");
			if (carbonCopyOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, carbonCopyOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("CarbonCopyOptOID", oid);
			}

			// 审批操作抄送人、OptCarbonCopyOptOID
			long optCarbonCopyOptOID = trgWorkFlowDtlTable.getLong("OptCarbonCopyOptOID");
			if (optCarbonCopyOptOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, carbonCopyOptOID, OperatorSelObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("OptCarbonCopyOptOID", oid);
			}

			// 节点属性ID、NodePropertyOID
			long nodePropertyOID = trgWorkFlowDtlTable.getLong("NodePropertyOID");
			if (nodePropertyOID > 0) {
				long oid = newWorkFlowDocumentAndSave(context, nodePropertyOID, NodePropertyObjectKey, sourceID);
				trgWorkFlowDtlTable.setObject("NodePropertyOID", oid);
			}
		}
		return trgWorkFlowDocument;
	}
}
