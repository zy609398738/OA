package com.bokesoft.oa.importservice;

import java.util.HashMap;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.struct.document.SaveFilterMap;

public class ImportDataSubDetails implements IImport {

	private Workbook workbook;
	private ImportBillHandler handler;
	private DefaultContext context;

	public ImportDataSubDetails(DefaultContext context, Workbook workbook) throws Throwable {
		this.workbook = null;
		this.handler = null;
		this.context = null;
		this.context = context;
		this.workbook = workbook;
		this.handler = new ImportBillHandler(context, workbook);
	}
	@Override
	public Object importData() throws Throwable {
		MetaDataObject metaDataObject = this.handler.getDataObject();
		Sheet mainSheet = this.handler.getMainSheet();

		int sheetCount = this.workbook.getNumberOfSheets();
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

			for (int newContext = 1; newContext < sheetCount; ++newContext) {
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
			final String curPrimayKey = this.handler.getPrimayKey(sheet, rowIndex, false);
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

		String parentKey = metaTable.getParentKey();
		if (!StringUtil.isBlankOrNull(parentKey)) {
			DataTable parentDt = document.get(parentKey);
			parentDt.beforeFirst();
			while (parentDt.next()) {
				Long parentMaterialID = parentDt.getLong("MaterialID");
				dataTable.beforeFirst();
				while (dataTable.next()) {
					Long materialID = dataTable.getLong("MaterialID");
					if (parentMaterialID.equals(materialID)) {
						int bookmark = parentDt.getBookmark();
						dataTable.setParentBookmark(bookmark);
					}
				}
			}
			parentDt.first();
			dataTable.first();
		}
	}
}
