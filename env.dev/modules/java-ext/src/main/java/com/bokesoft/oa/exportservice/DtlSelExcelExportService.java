
package com.bokesoft.oa.exportservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.excel.datatransfer.DataTransferUtil;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yigo.common.def.ControlType;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.form.component.MetaComponent;
import com.bokesoft.yigo.meta.form.component.control.MetaDict;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListView;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListViewColumn;
import com.bokesoft.yigo.meta.form.component.control.properties.MetaComboBoxProperties;
import com.bokesoft.yigo.meta.form.component.control.properties.MetaDictProperties;
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridCell;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridRow;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.util.ExcelUtils;

public class DtlSelExcelExportService {

	public static void exportData(DefaultContext context, Object workbook, Document document, String formkey,
			String exportTables,String no) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formkey);

		MetaDataObject metaDataObject = metaForm.getDataSource().getDataObject();
		boolean exportAll = (exportTables == null) || (exportTables.isEmpty());
		boolean needLoadData = false;

		ArrayList<MetaTable> tableList = new ArrayList<MetaTable>();
		if (exportAll) {
			Iterator<MetaTable> itTables = metaDataObject.getTableCollection().iterator();
			while (itTables.hasNext())
				tableList.add(itTables.next());
		} else {
			String[] tableKeys = exportTables.split(",");
			String[] arrayOfString1 = tableKeys;
			int i = arrayOfString1.length;
			for (int j = 0; j < i; ++j) {
				String tableKey = arrayOfString1[j];
				MetaTable metaTable = metaDataObject.getTable(tableKey);
				if (metaTable != null)
					tableList.add(metaTable);
			}

		}

		MetaTable metaTable = null;
		DataTable dataTable = null;

		needLoadData = ExcelUtils.isNeedLoadData(metaForm, tableList);

		Document exportDocument = document;
		try {

			Iterator<MetaTable> itTables = tableList.iterator();
			while (itTables.hasNext()) {
				metaTable = (MetaTable) itTables.next();
				String sheetName = metaTable.getKey();
				dataTable = exportDocument.get(metaTable.getKey());
				Sheet sheet = ((Workbook) workbook).getSheet(sheetName);
				if (sheet == null) {
					sheet = ExcelUtil.getSheet((Workbook) workbook, sheetName);
				}
				exportTable(context, sheet, metaForm, metaTable, dataTable,no);
			}
			// context.setDocument(exportDocument);
		} finally {
			if (needLoadData)
				exportDocument.close();
		}
	}

	private static void exportTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable,String no) throws Throwable {
		int tableModel = metaTable.getTableMode();
		switch (tableModel) {
		case 0:
			exportHeadTable(context, sheet, metaForm, metaTable, dataTable,no);
			break;
		case 1:
			exportDetailTable(context, sheet, metaForm, metaTable, dataTable);
		}
	}

	private static void exportDetailTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable) throws Throwable {
		String tableKey = metaTable.getKey();
		DataTable exportTable = dataTable;

		MetaComponent metaComponent = metaForm.findComponentByTable(tableKey);
		if (metaComponent == null)
			return;
		switch (metaComponent.getControlType()) {
		case 217:
			exportGridTable(context, sheet, metaForm, (MetaGrid) metaComponent, metaTable, exportTable);
			break;
		case 216:
			exportListViewTable(context, sheet, metaForm, (MetaListView) metaComponent, metaTable, exportTable);
		}
	}

	private static void exportListViewTable(DefaultContext context, Sheet sheet, MetaForm metaForm,
			MetaListView metaListView, MetaTable metaTable, DataTable dataTable) throws Throwable {
		HashMap<String, MetaListViewColumn> map = new HashMap<String, MetaListViewColumn>();
		MetaListViewColumn listViewColumn = null;
		Iterator<MetaListViewColumn> itListViewColumn = metaListView.getColumnCollection().iterator();
		while (itListViewColumn.hasNext()) {
			listViewColumn = (MetaListViewColumn) itListViewColumn.next();
			map.put(listViewColumn.getDataColumnKey(), listViewColumn);
		}

		Cell cell = null;
		String columnKey = null;
		MetaListViewColumn metaListViewColumn = null;
		int colIndex = 0;
		MetaColumn metaColumn = null;
		Iterator<MetaColumn> itMetaColumn = metaTable.iterator();
		Row titileRow = ExcelUtil.getRow(sheet, 0);
		while (itMetaColumn.hasNext()) {
			metaColumn = (MetaColumn) itMetaColumn.next();
			columnKey = metaColumn.getKey();
			metaListViewColumn = (MetaListViewColumn) map.get(columnKey);
			if (metaListViewColumn != null) {
				cell = ExcelUtil.getCell(titileRow, colIndex);
				ExcelUtil.setCellValue(cell, metaListViewColumn.getCaption(), 1002);

				++colIndex;
			}
		}

		int rowIndex = 1;
		String value = null;
		Row dataRow = null;
		dataTable.beforeFirst();
		while (dataTable.next()) {
			colIndex = 0;
			dataRow = ExcelUtil.getRow(sheet, rowIndex);
			itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				columnKey = metaColumn.getKey();
				metaListViewColumn = (MetaListViewColumn) map.get(columnKey);
				if (metaListViewColumn != null) {
					value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
							metaListViewColumn.getColumnType(), metaListViewColumn.getProperties(), dataTable,
							columnKey);
					cell = ExcelUtil.getCell(dataRow, colIndex);
					ExcelUtil.setCellValue(cell, value, metaColumn.getDataType());
					++colIndex;
				}
			}
			++rowIndex;
		}
	}

	private static void exportGridTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaGrid metaGrid,
			MetaTable metaTable, DataTable dataTable) throws Throwable {
		HashMap<String, MetaGridCell> map = new HashMap<String, MetaGridCell>();
		String no = "";
		if (dataTable.size()>0) {
			String maintable = context.getVE().getMetaFactory().getMetaForm(metaForm.getKey()).getDataSource().getDataObject()
					.getMainTable().getBindingDBTableName();
			String sql = "select h.no from "+maintable + " h join "+ dataTable.getKey()+" d on d.soid = h.oid where d.soid = ?";
			no = context.getDBManager().execPrepareQuery(sql,dataTable.getLong("SOID")).getString("NO");
		}
		
		Iterator<MetaGridRow> itRow = metaGrid.getRowCollection().iterator();
		MetaGridRow metaRow = null;
		MetaGridCell metaCell = null;
		while (itRow.hasNext()) {
			metaRow = (MetaGridRow) itRow.next();
			if (metaRow.getRowType() == 2) {
				Iterator<MetaGridCell> itCell = metaRow.iterator();
				while (itCell.hasNext()) {
					metaCell = (MetaGridCell) itCell.next();
					if (metaTable.getKey().equals(metaCell.getTableKey()))
						map.put(metaCell.getColumnKey(), metaCell);
				}
			}
		}

		Cell cell = null;
		String columnKey = null;
		MetaGridCell metaGridCell = null;

		int colIndex = 0;
		MetaColumn metaColumn = null;
		Iterator<MetaColumn> itMetaColumn = metaTable.iterator();
		Row keyRow = ExcelUtil.getRow(sheet, 0);
		Row titileRow = ExcelUtil.getRow(sheet, 1);
		while (itMetaColumn.hasNext()) {
			metaColumn = (MetaColumn) itMetaColumn.next();
			columnKey = metaColumn.getKey();
			metaGridCell = (MetaGridCell) map.get(columnKey);
			if (metaGridCell != null) {
				cell = ExcelUtil.getCell(keyRow, colIndex);
				String fieldKey = metaColumn.getKey();
	    		String fieldCaption = metaGridCell.getCaption();
	    		if (columnKey.equalsIgnoreCase("OID")) {
	    			fieldKey = "NO";
	    			fieldCaption = "单据编号";
				}
	    		if (metaGrid.getMetaCellByColumnKey(columnKey).getCellType()==ControlType.DICT) {
	    			if (metaGridCell.getProperties().getClass()==MetaDictProperties.class) {
	    				fieldKey = columnKey +";"+ ((MetaDictProperties)metaGridCell.getProperties()).getItemKey();
					}
				}
				ExcelUtil.setCellValue(cell, fieldKey, metaColumn.getDataType());
				cell = ExcelUtil.getCell(titileRow, colIndex);
				ExcelUtil.setCellValue(cell, fieldCaption, 1002);
				++colIndex;
			}
		}

		Object value = null;
		int rowIndex = 2;
		if (sheet.getLastRowNum() > 1) {
			rowIndex = sheet.getLastRowNum() + 1;
		}
		Row dataRow = null;
		dataTable.beforeFirst();
		while (dataTable.next()) {
			colIndex = 0;
			dataRow = ExcelUtil.getRow(sheet, rowIndex);
			itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				columnKey = metaColumn.getKey();
				metaGridCell = (MetaGridCell) map.get(columnKey);
				
				if (metaGridCell != null) {
					value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm, metaGridCell.getCellType(), metaGridCell.getProperties(), 
	    					dataTable, columnKey);
					if (metaGrid.getMetaCellByColumnKey(columnKey).getCellType()==ControlType.COMBOBOX) {
		    			if (metaGridCell.getProperties().getClass()==MetaComboBoxProperties.class) {
		    				value = dataTable.getObject(columnKey);
						}
					}
					cell = ExcelUtil.getCell(dataRow, colIndex);
					if (columnKey.equalsIgnoreCase("OID")) {
						value = no;
					}
					ExcelUtil.setCellValue(cell, value, metaColumn.getDataType());
					++colIndex;
				}
			}

			++rowIndex;
		}

	}

	private static void exportHeadTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable,String no) throws Throwable {
		HashMap<String, MetaComponent> map = new HashMap<String, MetaComponent>();
		MetaComponent metaComponent = null;
		Iterator<MetaComponent> itComponent = metaForm.getAllComponents().iterator();
		while (itComponent.hasNext()) {
			metaComponent = (MetaComponent) itComponent.next();
			if (metaTable.getKey().equals(metaComponent.getTableKey()))
				map.put(metaComponent.getColumnKey(), metaComponent);
		}

		Object value = "";
		MetaColumn metaColumn = null;
		if (dataTable.first()) {
			Row keyRow = null;
			Row titleRow = null;
			Row dateRow = null;
			int lastNum = sheet.getLastRowNum();
			if (lastNum > 1) {
				dateRow = ExcelUtil.getRow(sheet, ++lastNum );
			} else {
				keyRow = ExcelUtil.getRow(sheet, 0);
				titleRow = ExcelUtil.getRow(sheet, 1);
				dateRow = ExcelUtil.getRow(sheet, 2);
			}
			Cell cell = null;
			int colIndex = 2;
			Iterator<MetaColumn> itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				String columnKey = metaColumn.getKey();
				metaComponent = (MetaComponent) map.get(columnKey);
				if (metaComponent != null) {
					
					int type = metaColumn.getDataType();
					if (lastNum >= 1) {
						value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
								metaComponent.getControlType(), metaComponent.getProperties(), dataTable, columnKey);
						if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.COMBOBOX) {
							value = dataTable.getObject(columnKey);
						}
						cell = ExcelUtil.getCell(dateRow, colIndex);
						if (columnKey.equalsIgnoreCase("SourceID")) {
							value = no;
							type = 1002;
						}
						if (columnKey.equalsIgnoreCase("NO") || columnKey.equalsIgnoreCase("code")) {
							value = dataTable.getString("NO");
							type = 1002;
							cell = ExcelUtil.getCell(dateRow, 1);
							--colIndex;
						}
						ExcelUtil.setCellValue(cell, value, type);
					} else {
						cell = ExcelUtil.getCell(keyRow, 0);
						ExcelUtil.setCellValue(cell, metaForm.getKey(), type);
						if (columnKey.equalsIgnoreCase("NO") || columnKey.equalsIgnoreCase("code")) {
							cell = ExcelUtil.getCell(keyRow, 1);
							ExcelUtil.setCellValue(cell, metaColumn.getKey(), metaColumn.getDataType());
							cell = ExcelUtil.getCell(titleRow, 1);
							ExcelUtil.setCellValue(cell, metaColumn.getCaption(), 1002);
							value = dataTable.getString("NO");
							type = 1002;
							cell = ExcelUtil.getCell(dateRow, 1);
							ExcelUtil.setCellValue(cell, value, type);
							--colIndex;
						} else {
							String fieldKey = metaColumn.getKey();
							if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.DICT) {
				    			fieldKey = columnKey +";"+ ((MetaDict)metaForm.componentByKey(columnKey)).getItemKey();
							}
							cell = ExcelUtil.getCell(keyRow, colIndex);
							ExcelUtil.setCellValue(cell, fieldKey, metaColumn.getDataType());
							cell = ExcelUtil.getCell(titleRow, colIndex);
							ExcelUtil.setCellValue(cell, metaColumn.getCaption(), 1002);
							value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
									metaComponent.getControlType(), metaComponent.getProperties(), dataTable, columnKey);
							if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.COMBOBOX) {
								value = dataTable.getObject(columnKey);
							}
							cell = ExcelUtil.getCell(dateRow, colIndex);
							if (columnKey.equalsIgnoreCase("SourceID")) {
								value = no;
								type = 1002;
							}
							ExcelUtil.setCellValue(cell, value, type);
						}
					}
					++colIndex;
				}
			}
		}
	}
}