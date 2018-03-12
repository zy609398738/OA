package com.bokesoft.oa.exportservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.RightSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigne;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yes.excel.cmd.normal.LoadMultiPageDocument;
import com.bokesoft.yes.excel.datatransfer.DataTransferUtil;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yigo.common.def.ControlType;
import com.bokesoft.yigo.excel.IExportService;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.form.component.MetaComponent;
import com.bokesoft.yigo.meta.form.component.control.MetaDict;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListView;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListViewColumn;
import com.bokesoft.yigo.meta.form.component.control.properties.MetaDictProperties;
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridCell;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridRow;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.struct.condition.ConditionParas;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.struct.document.FilterMap;
import com.bokesoft.yigo.util.ExcelUtils;

public class WorkflowTypeExportExcelService implements IExportService {
	public String exportData(DefaultContext context, Document document, FilterMap filterMap,
			ConditionParas condParameters, String exportTables, String postServiceName, boolean onlyCurrentPage)
			throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(context.getFormKey());

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

		if (tableList.size() == 0) {
			return null;
		}

		MetaTable metaTable = null;
		DataTable dataTable = null;

		needLoadData = ExcelUtils.isNeedLoadData(metaForm, tableList);

		Document exportDocument = document;
		try {
			if ((needLoadData) && (!(onlyCurrentPage))) {
				LoadMultiPageDocument loadMultiPageDocument = new LoadMultiPageDocument(context, filterMap,
						condParameters);
				exportDocument = loadMultiPageDocument.reloadDocument(metaForm);
			}

			Object workbook = new SXSSFWorkbook(10000);

			Iterator<MetaTable> itTables = tableList.iterator();
			while (itTables.hasNext()) {
				
				metaTable = (MetaTable) itTables.next();
				String sheetName = metaTable.getKey();
				dataTable = exportDocument.get(metaTable.getKey());
				Sheet sheet = ExcelUtil.getSheet((Workbook) workbook, sheetName);
				context.setDocument(exportDocument);
				exportTable(context, workbook,sheet, metaForm, metaTable, dataTable);
			}

			String filePath = ExcelUtils.getExportFilePath(metaFactory, metaForm.getKey());

			ExcelUtil.writeExcel((Workbook) workbook, filePath);

			return filePath;
		} finally {
			if (needLoadData)
				exportDocument.close();
		}
	}

	private void exportTable(DefaultContext context, Object workbook,Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable) throws Throwable {
		int tableModel = metaTable.getTableMode();
		switch (tableModel) {
		case 0:
			exportHeadTable(context, sheet, metaForm, metaTable, dataTable);
			break;
		case 1:
			exportDetailTable(context, workbook,sheet, metaForm, metaTable, dataTable);
		}
	}

	private void exportDetailTable(DefaultContext context,Object workbook, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable) throws Throwable {
		String tableKey = metaTable.getKey();
		DataTable exportTable = dataTable;

		MetaComponent metaComponent = metaForm.findComponentByTable(tableKey);
		if (metaComponent == null)
			return;
		switch (metaComponent.getControlType()) {
		case 217:
			exportGridTable(context, workbook,sheet, metaForm, (MetaGrid) metaComponent, metaTable, exportTable);
			break;
		case 216:
			exportListViewTable(context, sheet, metaForm, (MetaListView) metaComponent, metaTable, exportTable);
		}
	}

	private void exportListViewTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaListView metaListView,
			MetaTable metaTable, DataTable dataTable) throws Throwable {
		HashMap<String , MetaListViewColumn> map = new HashMap<String, MetaListViewColumn>();

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

	private void exportGridTable(DefaultContext context,Object workbook, Sheet sheet, MetaForm metaForm, MetaGrid metaGrid, MetaTable metaTable, DataTable dataTable)
    throws Throwable  {
		OAContext oaContext = new OAContext(context);
	    HashMap<String,MetaGridCell> map = new HashMap<String, MetaGridCell>();
	    String code = context.getDocument().get("OA_WorkflowType_H").getString("Code");
	    
	    getOid(context, workbook, dataTable,code);
	    Iterator<MetaGridRow> itRow = metaGrid.getRowCollection().iterator();
	    MetaGridRow metaRow = null;
	    MetaGridCell metaCell = null;
	    while (itRow.hasNext()) {
	    	metaRow = (MetaGridRow)itRow.next();
	    	if (metaRow.getRowType() == 2) {
	    		Iterator<MetaGridCell> itCell = metaRow.iterator();
	    		while (itCell.hasNext()) {
	    			metaCell = (MetaGridCell)itCell.next(); 
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
	    	metaColumn = (MetaColumn)itMetaColumn.next();
	    	columnKey = metaColumn.getKey();
	    	metaGridCell = (MetaGridCell)map.get(columnKey); 
	    	if (metaGridCell != null) {
	    		cell = ExcelUtil.getCell(keyRow, colIndex);
	    		String fieldKey = metaColumn.getKey();
	    		String fieldCaption = metaGridCell.getCaption();
	    		if (metaGridCell.getKey().equalsIgnoreCase("OID")) {
	    			fieldKey = "Code";
	    			fieldCaption = "代码";
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
	    Row dataRow = null;
	    dataTable.beforeFirst();
	    while (dataTable.next()) {
	    	Long wdOID = dataTable.getLong("WorkflowDesigneID");
	    	Long dtloid = dataTable.getLong("OID");
	    	WorkflowTypeDtl wt = oaContext.getWorkflowTypeMap().get(context.getDocument().getOID())
					.getWorkflowTypeDtlMap().get(dtloid);
		    if (wdOID>0) {
		    	 LoadData ld = new LoadData("OA_WorkflowDesigne", wdOID);
		 		Document document = ld.load(new DefaultContext(context), null);
		 	    WorkflowDesigneExportExcelService.exportData(context, workbook,document, "",dtloid);
			}
	    	colIndex = 0;
	    	dataRow = ExcelUtil.getRow(sheet, rowIndex);
	    	itMetaColumn = metaTable.iterator();
	      
	    	while (itMetaColumn.hasNext()) {
	    		metaColumn = (MetaColumn)itMetaColumn.next();
	    		columnKey = metaColumn.getKey();
	    		metaGridCell = (MetaGridCell)map.get(columnKey);
	    		if (metaGridCell != null) {
	    			int type = metaColumn.getDataType();
	    			value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm, metaGridCell.getCellType(), metaGridCell.getProperties(), 
	    					dataTable, columnKey);
	    			if (metaGrid.getMetaCellByColumnKey(columnKey).getCellType()==ControlType.COMBOBOX) {
						if (metaGridCell.getProperties().getClass()==MetaDictProperties.class) {
							value = dataTable.getString(columnKey);
						}
					}
	    			if (columnKey.equalsIgnoreCase("OID")) {
	    				value = code;
	    				type = 1002;
	    				
					}
	    			if (columnKey.equalsIgnoreCase("WorkflowDesigneID")) {
	    				WorkflowDesigne wd = wt.getWorkflowDesigne();
	    				if (wd!=null) {
	    					value = wd.getBillNo();
		    				type = 1002;
						}
	    				
					}
	    			if (columnKey.equalsIgnoreCase("RightSelOID")) {
	    				RightSel rightSel = wt.getRightSel();
	    				if (rightSel!=null) {
	    					value =  rightSel.getBillNo();
		    				type = 1002;
						}
	    				
					}
	    			if (columnKey.equalsIgnoreCase("SponsorRightID")) {
	    				RightSel rightSel = wt.getSponsorRightSel();
	    				if (rightSel!=null) {
	    					value =  rightSel.getBillNo();
		    				type = 1002;
						}
					}
	    			cell = ExcelUtil.getCell(dataRow, colIndex);
	    			ExcelUtil.setCellValue(cell, value, type);
	    			++colIndex;
	    		}
	    	}
	      
	    	++rowIndex;
	    }
    
  }

	private void exportHeadTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable) throws Throwable {
		HashMap<String,MetaComponent> map = new HashMap<String, MetaComponent>();

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
			Row keyRow = ExcelUtil.getRow(sheet, 0);
			Row titleRow = ExcelUtil.getRow(sheet, 1);
			Row dateRow = ExcelUtil.getRow(sheet, 2);

			Cell cell = null;
			int colIndex = 1;
			Iterator<MetaColumn> itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				String columnKey = metaColumn.getKey();
				metaComponent = (MetaComponent) map.get(columnKey);
				cell = ExcelUtil.getCell(keyRow, 0);
				ExcelUtil.setCellValue(cell, "OA_WorkflowType", 1002);
				if (metaComponent != null) {
					String fieldkey = metaColumn.getKey();
					if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.DICT) {
						fieldkey = columnKey +";"+ ((MetaDict)metaForm.componentByKey(columnKey)).getItemKey();
					}
					cell = ExcelUtil.getCell(keyRow, colIndex);
					ExcelUtil.setCellValue(cell, fieldkey, metaColumn.getDataType());
					cell = ExcelUtil.getCell(titleRow, colIndex);
					ExcelUtil.setCellValue(cell, metaColumn.getCaption(), 1002);
					value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
							metaComponent.getControlType(), metaComponent.getProperties(), dataTable, columnKey);
					if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.COMBOBOX) {
						value = dataTable.getObject(columnKey);
					}
					cell = ExcelUtil.getCell(dateRow, colIndex);
					ExcelUtil.setCellValue(cell, value, metaColumn.getDataType());

					++colIndex;
				}
			}
		}
	}
	
	private static void getOid(DefaultContext context, Object workbook, DataTable dt,String no) throws Throwable {
		Long selOID = -1L;
		String[] oids = { "RightSelOID", "SponsorRightID"};
		LoadData ld = null;
		Document document = null;
		String formkey = "";
		for (int s = 0; s < oids.length; s++) {
			String oidtype = oids[s];
			dt.beforeFirst();
			while (dt.next()) {
				selOID = dt.getLong(oidtype);

					formkey = "OA_RightSel";
					ld = new LoadData(formkey, selOID);
					document = ld.load(new DefaultContext(context), null);
					DtlSelExcelExportService.exportData(context, workbook, document, formkey,
							"OA_RightSel_H,OA_RightSel_O,OA_RightSel_F",no);
				}

			}

		}
	
	
}