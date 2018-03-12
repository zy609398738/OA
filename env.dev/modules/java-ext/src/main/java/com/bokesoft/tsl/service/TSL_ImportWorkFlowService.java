package com.bokesoft.tsl.service;

import java.util.ArrayList;
import java.util.Map;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class TSL_ImportWorkFlowService implements IExtService2 {
	private static String WorkFlowHead_Query = "select oid from OA_WorkflowDesigne_H where WorkflowKey= ? and tag1=?";
	private static String WorkFlowDtl_Query = "select * from OA_WorkflowDesigne_D where soid=? and auditNode=?";

	private static String WF_FORMKEY = "OA_WorkflowDesigne";
	private static String WF_DTLKEY = "OA_WorkflowDesigne_D";

	private static String OPT_FORMKEY = "OA_OperationSel";
	private static String OPT_HEADTABLEKEY = "OA_OperationSel_H";
	private static String OPT_DETAILTABLEKEY = "OA_OperationSel_D";

	private static String RIGHT_FORMKEY = "OA_RightSel";
	private static String RIGHT_HEADTABLEKEY = "OA_RightSel_H";
	private static String RIGHT_DETAILTABLEKEY_O = "OA_RightSel_O";
	private static String RIGHT_DETAILTABLEKEY_F = "OA_RightSel_F";
	
	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String workFlowKey = args.get("workFlowKey").toString();
		String workItemNodeID = args.get("workItemNodeID").toString();
		String type = args.get("type").toString();
		
		boolean copyOpt = TypeConvertor.toBoolean(args.get("copyOpt"));
		boolean copyEndorseOpt = TypeConvertor.toBoolean(args.get("copyEndorseOpt"));
		boolean copyRights = TypeConvertor.toBoolean(args.get("copyRights"));
		
		IDBManager dbManager = context.getDBManager();

		long workFlowHeadOID = -1l;
		DataTable dt = dbManager.execPrepareQuery(WorkFlowHead_Query, workFlowKey, type);
		if (dt.size() == 0) {
			return null;
		}
		workFlowHeadOID = dt.getLong(0, "oid");

		// 加载工作流明细源数据
		DataTable srcWFDetailDt = dbManager.execPrepareQuery(WorkFlowDtl_Query, workFlowHeadOID, workItemNodeID);
		srcWFDetailDt.first();
		long auditOptOID = srcWFDetailDt.getLong("AuditOptOID");
		long RightsOID = srcWFDetailDt.getLong("RightSelOID");
		long EndorseOptOID = srcWFDetailDt.getLong("EndorseOptOID");
		
		DefaultContext newContext = null;
		LoadData ld = null;
		// 加载对应操作数据
		Document srcOptDocument = null;
		if (auditOptOID > 0) {
			newContext = new DefaultContext(context);
			ld = new LoadData(OPT_FORMKEY, auditOptOID);
			srcOptDocument = ld.load(newContext, null);
		}
		
		// 加载对应权限数据
		Document srcRightsDocument = null;
		if (RightsOID > 0) {
			newContext = new DefaultContext(context);
			ld = new LoadData(RIGHT_FORMKEY, RightsOID);
			srcRightsDocument = ld.load(newContext, null);
		}
		
		// 加载对应加签数据
		Document srcEndorseOptDocument = null;
		if (EndorseOptOID > 0) {
			newContext = new DefaultContext(context);
			ld = new LoadData(OPT_FORMKEY, EndorseOptOID);
			srcEndorseOptDocument = ld.load(newContext, null);
		}
		
		DefaultContext workFlowContext = new DefaultContext(context);
		ld = new LoadData(WF_FORMKEY, workFlowHeadOID);
		Document wfDocument = ld.load(workFlowContext, null);

		DataTable wfDtlTable = wfDocument.get(WF_DTLKEY);
		wfDtlTable.beforeFirst();
		while (wfDtlTable.next()) {
			String nodeID = wfDtlTable.getString("AuditNode");
			if (nodeID.equals(workItemNodeID)) {
				continue;
			}
			if (copyOpt) {
				saveOperation(context, wfDtlTable, srcWFDetailDt, srcOptDocument);
			}
			
			if (copyEndorseOpt) {
				saveEndorseOpt(context, wfDtlTable, srcWFDetailDt, srcEndorseOptDocument);
			}
			
			if (type.equals("OA_WorkflowType") && copyRights) {
				saveRights(workFlowContext, wfDtlTable, srcWFDetailDt, srcRightsDocument);
			}
		}

		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject(WF_FORMKEY);
		SaveData sd = new SaveData(metaDataObject, null, wfDocument);
		wfDocument = sd.save(newContext);
		
		return null;
	}

	private void saveEndorseOpt(DefaultContext context, DataTable wfDtlTable, DataTable srcWFDetailDt,
			Document srcEndorseOptDocument) throws Throwable {
		if (srcEndorseOptDocument == null) {
			return;
		}
		DefaultContext newContext = new DefaultContext(context);
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaDataObject metaDataObject = metaFactory.getDataObject(OPT_FORMKEY);
		
		long auditOptOID = wfDtlTable.getLong("EndorseOptOID");
		String nodeID = wfDtlTable.getString("AuditNode");
		Document doc = null;
		
		if (auditOptOID > 0) {
			LoadData ld = new LoadData(OPT_FORMKEY, auditOptOID);
			doc = ld.load(newContext, null);
		} else {
			doc = DocumentUtil.newDocument(OPT_FORMKEY);
			doc.setNew();
		}
		
		// 复制头表
		DataTable srcHeadDt = srcEndorseOptDocument.get(OPT_HEADTABLEKEY);
		DataTable trgHeadDt = doc.get(OPT_HEADTABLEKEY);
		
		ArrayList<String> list = getOperationHeadFields();
		trgHeadDt.first();
		for (String fieldKey : list) {
			System.out.println(fieldKey);
			trgHeadDt.setObject(fieldKey, srcHeadDt.getObject(fieldKey));
		}
		trgHeadDt.setObject("Tag2", nodeID);

		// 复制明细
		DataTable srcDtlDt = srcEndorseOptDocument.get(OPT_DETAILTABLEKEY);
		DataTable trgDtlDt = doc.get(OPT_DETAILTABLEKEY);
		MetaTable metaTable = metaDataObject.getTable(OPT_DETAILTABLEKEY);
		trgDtlDt.deleteAll();
		list = getOperationDtlFields();
		
		srcDtlDt.beforeFirst();
		while(srcDtlDt.next()) {
			DocumentUtil.newRow(metaTable, trgDtlDt);
			for (String fieldKey : list) {
				System.out.println(fieldKey);
				trgDtlDt.setObject(fieldKey, srcDtlDt.getObject(fieldKey));
			}
		}
		SaveData sd = new SaveData(metaDataObject, null, doc);
		doc = sd.save(newContext);
		
		srcWFDetailDt.first();
		wfDtlTable.setObject("EndorseOptOID", doc.getOID());
		wfDtlTable.setObject("EndorseOptDepict", srcWFDetailDt.getObject("EndorseOptDepict"));
	}
	
	private void saveOperation(DefaultContext context, DataTable wfDtlTable, DataTable srcWFDetailDt,
			Document srcOptDocument) throws Throwable {
		if (srcOptDocument == null) {
			return;
		}
		DefaultContext newContext = new DefaultContext(context);
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaDataObject metaDataObject = metaFactory.getDataObject(OPT_FORMKEY);
		
		long auditOptOID = wfDtlTable.getLong("AuditOptOID");
		String nodeID = wfDtlTable.getString("AuditNode");
		Document doc = null;
		
		if (auditOptOID > 0) {
			LoadData ld = new LoadData(OPT_FORMKEY, auditOptOID);
			doc = ld.load(newContext, null);
		} else {
			doc = DocumentUtil.newDocument(OPT_FORMKEY);
			doc.setNew();
		}
		
		// 复制头表
		DataTable srcHeadDt = srcOptDocument.get(OPT_HEADTABLEKEY);
		DataTable trgHeadDt = doc.get(OPT_HEADTABLEKEY);
		
		ArrayList<String> list = getOperationHeadFields();
		trgHeadDt.first();
		for (String fieldKey : list) {
			System.out.println(fieldKey);
			trgHeadDt.setObject(fieldKey, srcHeadDt.getObject(fieldKey));
		}
		trgHeadDt.setObject("Tag2", nodeID);

		// 复制明细
		DataTable srcDtlDt = srcOptDocument.get(OPT_DETAILTABLEKEY);
		DataTable trgDtlDt = doc.get(OPT_DETAILTABLEKEY);
		MetaTable metaTable = metaDataObject.getTable(OPT_DETAILTABLEKEY);
		trgDtlDt.deleteAll();
		list = getOperationDtlFields();
		
		srcDtlDt.beforeFirst();
		while(srcDtlDt.next()) {
			DocumentUtil.newRow(metaTable, trgDtlDt);
			for (String fieldKey : list) {
				System.out.println(fieldKey);
				trgDtlDt.setObject(fieldKey, srcDtlDt.getObject(fieldKey));
			}
		}
		SaveData sd = new SaveData(metaDataObject, null, doc);
		doc = sd.save(newContext);
		
		srcWFDetailDt.first();
		wfDtlTable.setObject("AuditOptOID", doc.getOID());
		wfDtlTable.setObject("AuditOptDepict", srcWFDetailDt.getObject("AuditOptDepict"));
	}
	
	private ArrayList<String> getOperationHeadFields() {
		ArrayList<String> list = new ArrayList<String>();
		list.add("BillKey");
		list.add("ClusterID");
		list.add("SourceKey");
		list.add("SourceID");
		list.add("BillDate");
		list.add("Status");
		list.add("Tag1");
		// list.add("Tag2"); NodeID
		list.add("Tag3");
		list.add("Tag4");
		list.add("OptDesc");
		list.add("StartFormKey");
		list.add("MessageSetID_H");
		list.add("EmailTemp_H");
		list.add("FieldKey");
		list.add("SendFormula");
		return list;
	}
	
	private ArrayList<String> getOperationDtlFields() {
		ArrayList<String> list = new ArrayList<String>();
		list.add("Sequence");
		list.add("Name");
		list.add("OptID");
		list.add("ConfirmPW");
		list.add("Opinion");
		list.add("CCOptSelOID");
		list.add("CCOptSelDepict");
		list.add("MessageSetID");
		list.add("EmailTemp");
		list.add("SendFormula");
		
		return list;
	}
	
	private void saveRights(DefaultContext context, DataTable wfDtlTable, DataTable srcWFDetailDt,
			Document srcRightsDocument) throws Throwable {
		if (srcRightsDocument == null) {
			return;
		}
		DefaultContext newContext = new DefaultContext(context);
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaDataObject metaDataObject = metaFactory.getDataObject(RIGHT_FORMKEY);
		
		long auditRightOID = wfDtlTable.getLong("RightSelOID");
		String nodeID = wfDtlTable.getString("AuditNode");
		Document doc = null;
		
		
		if (auditRightOID > 0) {
			LoadData ld = new LoadData(RIGHT_FORMKEY, auditRightOID);
			doc = ld.load(newContext, null);
		} else {
			doc = DocumentUtil.newDocument(RIGHT_FORMKEY);
			doc.setNew();
		}
		
		// 复制头表
		DataTable srcHeadDt = srcRightsDocument.get(RIGHT_HEADTABLEKEY);
		DataTable trgHeadDt = doc.get(RIGHT_HEADTABLEKEY);
		
		trgHeadDt.first();
		ArrayList<String> list = getRightsHeadFields();
		for (String fieldKey : list) {
			trgHeadDt.setObject(fieldKey, srcHeadDt.getObject(fieldKey));
		}
		trgHeadDt.setObject("Tag1", wfDtlTable.getObject("OID"));
		trgHeadDt.setObject("Tag2", nodeID);

		// 复制明细O
		DataTable srcDtlDtO = srcRightsDocument.get(RIGHT_DETAILTABLEKEY_O);
		DataTable trgDtlDtO = doc.get(RIGHT_DETAILTABLEKEY_O);
		trgDtlDtO.deleteAll();
		
		MetaTable metaDtlO = metaDataObject.getTable(RIGHT_DETAILTABLEKEY_O);
		list = getRightsDtlOFields();
		
		srcDtlDtO.beforeFirst();
		while(srcDtlDtO.next()) {
			DocumentUtil.newRow(metaDtlO, trgDtlDtO);
			for (String fieldKey : list) {
				trgDtlDtO.setObject(fieldKey, srcDtlDtO.getObject(fieldKey));
			}
		}
		
		// 复制明细F
		DataTable srcDtlDtF = srcRightsDocument.get(RIGHT_DETAILTABLEKEY_F);
		DataTable trgDtlDtF = doc.get(RIGHT_DETAILTABLEKEY_F);
		trgDtlDtF.deleteAll();
		
		MetaTable metaDtlF = metaDataObject.getTable(RIGHT_DETAILTABLEKEY_F);
		list = getRightsDtlFFields();
		
		srcDtlDtF.beforeFirst();
		while(srcDtlDtF.next()) {
			DocumentUtil.newRow(metaDtlF, trgDtlDtF);
			for (String fieldKey : list) {
				trgDtlDtF.setObject(fieldKey, srcDtlDtF.getObject(fieldKey));
			}
		}
		
		SaveData sd = new SaveData(metaDataObject, null, doc);
		doc = sd.save(newContext);
		
		srcWFDetailDt.first();
		wfDtlTable.setObject("RightSelOID", doc.getOID());
		wfDtlTable.setObject("RightSelDepict", srcWFDetailDt.getObject("RightSelDepict"));
	}
	
	private ArrayList<String> getRightsHeadFields() {
		ArrayList<String> list = new ArrayList<String>();
		list.add("BillDate");
		list.add("BillDate");
		list.add("BillKey");
		list.add("SourceKey");
		list.add("SourceID");
		list.add("Tag1");
		// list.add("Tag2"); NodeID
		list.add("Tag3");
		list.add("Tag4");
		list.add("OptDesc");
		list.add("StartFormKey");
		list.add("WorkflowFormKey");
		list.add("SelAllVisible");
		
		return list;
	}
	
	private ArrayList<String> getRightsDtlOFields() {
		ArrayList<String> list = new ArrayList<String>();
		list.add("Sequence");
		list.add("SelectField");
		list.add("OperationKey");
		list.add("OperationName");
		list.add("OperationVisible");
		list.add("OperationEnable");
		
		return list;
	}
	
	private ArrayList<String> getRightsDtlFFields() {
		ArrayList<String> list = new ArrayList<String>();
		list.add("Sequence");
		list.add("SelectField");
		list.add("FieldKey");
		list.add("FieldName");
		list.add("FieldVisible");
		list.add("FieldEnable");
		
		return list;
	}
}
