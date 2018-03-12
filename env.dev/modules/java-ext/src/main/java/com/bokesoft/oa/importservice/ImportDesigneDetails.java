package com.bokesoft.oa.importservice;

import java.util.HashMap;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.struct.document.SaveFilterMap;

public class ImportDesigneDetails implements IImport {

	private Workbook workbook;
	private ImportDesigneHandler handler;
	private DefaultContext context;

	public ImportDesigneDetails(DefaultContext context, Workbook workbook) throws Throwable {
		this.workbook = null;
		this.handler = null;
		this.context = null;
		this.context = context;
		this.workbook = workbook;
		this.handler = new ImportDesigneHandler(context, workbook);
	}

	@Override
	public Object importData() throws Throwable {
		getSheetName();
		MetaDataObject metaDataObject = this.handler.getDataObject();
		Sheet mainSheet = this.handler.getMainSheet();
		String primayKey = null;
		String tableKey = mainSheet.getSheetName();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		if (metaTable == null) {
			return true;
		}
		// 判断入库单号在数据库里是否已存在
		int count = 2;
		while (true) {

			primayKey = this.handler.getPrimayKey(mainSheet, count, true);
			String sql = "SELECT NO FROM " + metaTable.getBindingDBTableName() + " WHERE NO=?";
			IDBManager dbm = context.getDBManager();
			DataTable sqlDT = dbm.execPrepareQuery(sql, primayKey);
			if (sqlDT.size() > 0) {
				throw new Error("第" + (count + 1) + "行，单号:" + primayKey + "已存在，请修正后重新导入");
			}
			count++;
			if (primayKey.isEmpty()) {
				break;
			}
		}

		int rowIndex = 2;
		HashMap<String, Integer> sheetRow = new HashMap<String, Integer>();
		while (true) {
			primayKey = this.handler.getPrimayKey(mainSheet, rowIndex, true);
			if (primayKey.isEmpty()) {
				return true;
			}

			Document document = this.handler.createNewDocumnt();
			DataTable dataTable = document.get(tableKey);
			if (metaTable.getTableMode() == 1) {
				dataTable.append();
			} else {
				dataTable.first();
			}
			this.handler.fillImportField(metaTable, dataTable, mainSheet, rowIndex);

			this.fillTableData(this.workbook.getSheetAt(6), metaDataObject, document, sheetRow, primayKey);
			DefaultContext newContext = new DefaultContext(this.context);
			newContext.setFormKey(this.handler.getFormKey());
			SaveData saveData = new SaveData(metaDataObject, (SaveFilterMap) null, document);
			saveData.save(newContext);
			DataTable dTable = newContext.getDocument().get("OA_WorkflowDesigne_D");
			DataTable hTable = newContext.getDocument().get("OA_WorkflowDesigne_H");
			dTable.beforeFirst();
			while (dTable.next()) {
				Long id = dTable.getLong("AuditPerOID");
				String sql = "update oa_operatorsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql,hTable.getLong("OID"),id);
				Long id1 = dTable.getLong("SendOptOID");
				String sql1 = "update oa_operatorsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql1,hTable.getLong("OID"),id1);
				Long id2 = dTable.getLong("MonitoringOptOID");
				String sql2 = "update oa_operatorsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql2,hTable.getLong("OID"),id2);
				Long id3 = dTable.getLong("CarbonCopyOptOID");
				String sql3 = "update oa_operatorsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql3,hTable.getLong("OID"),id3);
				Long id4 = dTable.getLong("OptCarbonCopyOptOID");
				String sql4 = "update oa_operatorsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql4,hTable.getLong("OID"),id4);
				Long id5 = dTable.getLong("AuditOptOID");
				String sql5 = "update oa_operationsel_h set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql5,hTable.getLong("OID"),id5);
				Long id6 = dTable.getLong("NodePropertyOID");
				String sql6 = "update OA_NodeProperty_H set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql6,hTable.getLong("OID"),id6);
				Long id7 = dTable.getLong("RightSelOID");
				String sql7 = "update OA_RightSel_H set sourceid = ? where oid =?";
				context.getDBManager().execPrepareUpdate(sql7,hTable.getLong("OID"),id7);
				
			}
				 
				
			++rowIndex;
		}
	}

	private void fillTableData(Sheet sheet, MetaDataObject metaDataObject, Document document,
			HashMap<String, Integer> sheetRow, String primayKey) throws Throwable {
		String tableKey = sheet.getSheetName();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		if (metaTable == null) {
			return;
		}
		int rowIndex = 2;
		if (sheetRow.containsKey(tableKey)) {
			rowIndex = sheetRow.get(tableKey);
		}
		DataTable dataTable = document.get(tableKey);
		dataTable.first();
		while (true) {
			final String curPrimayKey = this.handler.getDtlPrimayKey(sheet, rowIndex, false);
			if (!curPrimayKey.equalsIgnoreCase(primayKey)) {
				break;
			}
			if (metaTable.getTableMode() == 1) {
				dataTable.append();
			}
			this.handler.fillImportField(metaTable, dataTable, sheet, rowIndex);
			++rowIndex;
		}
		sheetRow.put(tableKey, rowIndex);

	}

	private void getSheetName() throws Throwable {
		String itemKey = "";
		DefaultContext newcontext = new DefaultContext(context);
		
		for (int count =5 , sheetIndex = 2; sheetIndex < count; ++sheetIndex) {
			Sheet sheet = this.workbook.getSheetAt(sheetIndex);
			String tableKey = sheet.getSheetName();
			if (tableKey.equals("OA_RightSel_H")) {
				itemKey = "OA_RightSel";
				newcontext.setFormKey(itemKey);
				new ImportDtlTableExcel(newcontext, this.workbook,itemKey, sheetIndex,true);
			}
		}
		for (int count = 14, sheetIndex = 7; sheetIndex < count; ++sheetIndex) {
			Sheet sheet = this.workbook.getSheetAt(sheetIndex);
			String tableKey = sheet.getSheetName();
			if (tableKey.equals("OA_OperatorSel_H")) {
				itemKey = "OA_OperatorSel";
				newcontext.setFormKey(itemKey);
				new ImportDtlTableExcel(newcontext, this.workbook,itemKey, sheetIndex,true);
			}
			if (tableKey.equals("OA_OperationSel_H")) {
				itemKey = "OA_OperationSel";
				newcontext.setFormKey(itemKey);
				new ImportDtlTableExcel(newcontext, this.workbook,itemKey, sheetIndex,true);
			}
			if (tableKey.equals("OA_NodeProperty_H")) {
				itemKey = "OA_NodeProperty";
				newcontext.setFormKey(itemKey);
				new ImportDtlTableExcel(newcontext, this.workbook,itemKey, sheetIndex,true);
			}
		}
	}
}
