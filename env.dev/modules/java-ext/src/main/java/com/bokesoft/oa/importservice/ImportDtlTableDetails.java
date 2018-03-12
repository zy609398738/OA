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

public class ImportDtlTableDetails implements IImport {
	
	private Workbook workbook;
	private ImportDtlTableHandler handler;
	private DefaultContext context;

	public ImportDtlTableDetails(DefaultContext context, Workbook workbook,Integer sheetIndex) throws Throwable {
		this.workbook = null;
		this.handler = null;
		this.context = null;
		this.context = context;
		this.workbook = workbook;
		this.handler = new ImportDtlTableHandler(context, workbook,sheetIndex);
	}
	@Override
	public Object importData() throws Throwable {
		MetaDataObject metaDataObject = this.handler.getDataObject();
		if (metaDataObject == null) {
			return true;
		}
		Sheet mainSheet = this.handler.getMainSheet();
		Integer si =this.workbook.getSheetIndex(mainSheet);
		String primayKey = null;
		String tableKey = mainSheet.getSheetName();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		if (metaTable == null) {
			return true;
		}
		//判断入库单号在数据库里是否已存在
		int count = 2;
		while (true) {

			primayKey = this.handler.getPrimayKey(mainSheet, count, true);
			String sql="SELECT NO FROM "+metaTable.getBindingDBTableName()+" WHERE NO=?";
			IDBManager dbm = context.getDBManager();
			DataTable sqlDT = dbm.execPrepareQuery(sql, primayKey);
			if(sqlDT.size()>0){
				throw new Error("第"+(count+1)+"行，单号:"+primayKey+"已存在，请修正后重新导入");
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
			int j = 0;
		    if (tableKey.equals("OA_OperatorSel_H")||tableKey.equals("OA_OperationSel_H")) {
				j = si+2;
			}
		    if (tableKey.equals("OA_NodeProperty_H")||tableKey.equals("OA_RightSel_H")) {
		    	j = si+3;
			}
			for (int newContext = si; newContext < j; ++newContext) {
				this.fillTableData(this.workbook.getSheetAt(newContext), metaDataObject, document, sheetRow, primayKey);
			}
			DefaultContext newContext = new DefaultContext(this.context);
			newContext.setFormKey(this.handler.getFormKey());
			SaveData saveData = new SaveData(metaDataObject, (SaveFilterMap) null, document);
			saveData.save(newContext);

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
}
