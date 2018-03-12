package com.bokesoft.tsl.importservice;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yes.excel.utils.ImportBillHandler;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class ImportDataObjectList implements IImport {

	private ImportBillHandler handler = null;
	
	private DefaultContext context = null;
	
	public ImportDataObjectList(DefaultContext context, Workbook workbook) throws Throwable {
		this.context = context;
		handler = new ImportBillHandler(context, workbook);
	}
	
	@Override
	public Object importData() throws Throwable {
		MetaDataObject  metaDataObject = handler.getDataObject();
		
		Sheet mainSheet = handler.getMainSheet();
		Document doc = handler.createNewDocumnt();
		doc.setOID(10000);
		
		int rowIndex = 2;
		String primayKey = null;
		String tableKey = mainSheet.getSheetName();
		MetaTable metaTable = metaDataObject.getTable(tableKey);
		DataTable dataTable = doc.get(tableKey);
		while(true) {
			primayKey = ExcelUtil.getCellValue(mainSheet, rowIndex, 1).toString();
			if (primayKey.isEmpty()) {
				break;
			}
			
			
			DocumentUtil.newRow(metaTable, dataTable);
			
			handler.fillImportField(metaTable, dataTable, mainSheet, rowIndex);
			
			++rowIndex;
		}
		
		DefaultContext newContext = new DefaultContext(context);
		newContext.setFormKey(handler.getFormKey());
		SaveData sd = new SaveData(metaDataObject, null, doc);
		sd.save(newContext);
		
		return true;
	}
}
