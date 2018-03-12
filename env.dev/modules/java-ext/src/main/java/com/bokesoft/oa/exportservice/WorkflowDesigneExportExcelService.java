package com.bokesoft.oa.exportservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.NodeProperty;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.RightSel;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigne;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.yes.excel.datatransfer.DataTransferUtil;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yigo.common.def.ControlType;
import com.bokesoft.yigo.common.util.TypeConvertor;
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
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridCell;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridRow;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.util.ExcelUtils;

public class WorkflowDesigneExportExcelService {
	public static void exportData(DefaultContext context, Object workbook, Document document, String exportTables,Long dtlOID)
			throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm("OA_WorkflowDesigne");

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

				exportTable(context, workbook, sheet, metaForm, metaTable, dataTable,dtlOID);
			}
			
		} finally {
			if (needLoadData)
				exportDocument.close();
		}
	}

	private static void exportTable(DefaultContext context, Object workbook, Sheet sheet, MetaForm metaForm,
			MetaTable metaTable, DataTable dataTable,long dtlOID) throws Throwable {
		int tableModel = metaTable.getTableMode();
		switch (tableModel) {
		case 0:
			exportHeadTable(context, sheet, metaForm, metaTable, dataTable);
			break;
		case 1:
			exportDetailTable(context, workbook, sheet, metaForm, metaTable, dataTable,dtlOID);
		}
	}

	private static void exportDetailTable(DefaultContext context, Object workbook, Sheet sheet, MetaForm metaForm,
			MetaTable metaTable, DataTable dataTable,Long dtlOID) throws Throwable {
		String tableKey = metaTable.getKey();
		DataTable exportTable = dataTable;

		MetaComponent metaComponent = metaForm.findComponentByTable(tableKey);
		if (metaComponent == null)
			return;
		switch (metaComponent.getControlType()) {
		case 217:
			exportGridTable(context, workbook, sheet, metaForm, (MetaGrid) metaComponent, metaTable, exportTable,dtlOID);
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

	private static void exportGridTable(DefaultContext context, Object workbook, Sheet sheet, MetaForm metaForm,
			MetaGrid metaGrid, MetaTable metaTable, DataTable dataTable,Long dtlOID) throws Throwable {
		String operatorKey = "AuditPerOID,SendOptOID,MonitoringOptOID,CarbonCopyOptOID,OptCarbonCopyOptOID";
		HashMap<String, MetaGridCell> map = new HashMap<String, MetaGridCell>();
		OAContext oac = new OAContext(context);
		WorkflowDesigne workflowDesigne = oac.getWorkflowTypeMap().get(context.getDocument().getOID())
				.getWorkflowTypeDtlMap().get(dtlOID)
				.getWorkflowDesigne();
		String no = workflowDesigne.getBillNo();
		getOid(context, workbook, dataTable,no);
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
				if (metaGridCell.getKey().equalsIgnoreCase("OID")) {
					fieldKey = "NO";
					fieldCaption = "单据编号";
				}
				if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.DICT) {
	    			fieldKey = columnKey +":"+ ((MetaDict)metaForm.componentByKey(columnKey)).getItemKey();
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
			WorkflowDesigneDtl workflowDesigneDtl = workflowDesigne.getWorkflowDesigneDtlMap()
					.get(dataTable.getLong("OID"));
			colIndex = 0;
			dataRow = ExcelUtil.getRow(sheet, rowIndex);
			itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				columnKey = metaColumn.getKey();
				metaGridCell = (MetaGridCell) map.get(columnKey);
				if (metaGridCell != null) {
					int type = metaColumn.getDataType();
					value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm, metaGridCell.getCellType(), metaGridCell.getProperties(), 
	    					dataTable, columnKey);
					if (metaGrid.getMetaCellByColumnKey(columnKey).getCellType()==ControlType.COMBOBOX) {
						if (metaGridCell.getProperties().getClass()==MetaComboBoxProperties.class) {
							value = dataTable.getString(columnKey);
						}
					}
					cell = ExcelUtil.getCell(dataRow, colIndex);
					if (columnKey.equalsIgnoreCase("OID")) {
						value = no;
						type = 1002;
					}
					if (operatorKey.contains(columnKey) && (!columnKey.equalsIgnoreCase("OID"))) {
						OperatorSel op = null;
						if (columnKey.equalsIgnoreCase("AuditPerOID")) {
							op = workflowDesigneDtl.getAuditPerSel();
						}
						if (columnKey.equalsIgnoreCase("OptCarbonCopyOptOID")) {
							op = workflowDesigneDtl.getOptCarbonCopyPerSel();
						}
						if (columnKey.equalsIgnoreCase("SendOptOID")) {
							op = workflowDesigneDtl.getSendPerSel();
						}
						if (columnKey.equalsIgnoreCase("MonitoringOptOID")) {
							op = workflowDesigneDtl.getMonitoringPerSel();
						}
						if (columnKey.equalsIgnoreCase("CarbonCopyOptOID")) {
							op = workflowDesigneDtl.getCarbonCopyPerSel();
						}
						if (op != null) {
							value = op.getBillNo();
							type = 1002;
						}else{
							value = "";
						}
					}
					if (columnKey.equalsIgnoreCase("AuditOptOID")) {
						OperationSel operationSel = workflowDesigneDtl.getAuditOptSel();
						if (operationSel!=null) {
							value = operationSel.getBillNo();
							type = 1002;
						}else{
							value = "";
						}
					}
					if (columnKey.equalsIgnoreCase("EndorseOptOID")) {
						OperationSel operationSel = workflowDesigneDtl.getEndorseOptSel();
						if (operationSel!=null) {
							value = operationSel.getBillNo();
							type = 1002;
						}else{
							value = "";
						}
					}
					if (columnKey.equalsIgnoreCase("NodePropertyOID")) {
						NodeProperty np = workflowDesigneDtl.getNodeProperty();
						if (np!=null) {
							value =np.getNo();
							type = 1002;
						}else{
							value = "";
						}
					}
					if (columnKey.equalsIgnoreCase("RightSelOID")) {
						RightSel rightSel = workflowDesigneDtl.getRightSel();
						if (rightSel!=null) {
							value = rightSel.getBillNo();
							type = 1002;
						}else{
							value = "";
						}
						
					}
					ExcelUtil.setCellValue(cell, value, type);
					++colIndex;
				}
			}

			++rowIndex;
		}

	}

	private static void exportHeadTable(DefaultContext context, Sheet sheet, MetaForm metaForm, MetaTable metaTable,
			DataTable dataTable) throws Throwable {
		OAContext oac = new OAContext(context);
		HashMap<String, MetaComponent> map = new HashMap<String, MetaComponent>();
		Long tag2 = TypeConvertor.toLong(dataTable.getString("Tag2"));
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
				dateRow = ExcelUtil.getRow(sheet, lastNum + 1);
			} else {
				keyRow = ExcelUtil.getRow(sheet, 0);
				titleRow = ExcelUtil.getRow(sheet, 1);
				dateRow = ExcelUtil.getRow(sheet, 2);
			}
			Cell cell = null;
			int colIndex = 1;
			Iterator<MetaColumn> itMetaColumn = metaTable.iterator();
			while (itMetaColumn.hasNext()) {
				metaColumn = (MetaColumn) itMetaColumn.next();
				String columnKey = metaColumn.getKey();
				metaComponent = (MetaComponent) map.get(columnKey);
				if (metaComponent != null) {
					int type = metaColumn.getDataType();
					if (lastNum > 1) {
						value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
								metaComponent.getControlType(), metaComponent.getProperties(), dataTable, columnKey);
						if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.COMBOBOX) {
							value = dataTable.getObject(columnKey);
						}
						cell = ExcelUtil.getCell(dateRow, colIndex);
						if (columnKey.equalsIgnoreCase("Tag2")) {
								value = TypeConvertor.toString(oac.getWorkflowTypeMap().get(context.getDocument().getOID()).getWorkflowTypeDtlMap().get(tag2).getSequence());
								type = 1001;
						}
						ExcelUtil.setCellValue(cell, value, type);
					} else {
						cell = ExcelUtil.getCell(keyRow, 0);
						ExcelUtil.setCellValue(cell, "OA_WorkflowDesigne", 1002);
						String fieldkey = metaColumn.getKey();
						if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.DICT) {
							fieldkey = columnKey +";"+ ((MetaDict)metaForm.componentByKey(columnKey)).getItemKey();
						}
						cell = ExcelUtil.getCell(keyRow, colIndex);
						ExcelUtil.setCellValue(cell, fieldkey, type);
						cell = ExcelUtil.getCell(titleRow, colIndex);
						ExcelUtil.setCellValue(cell, metaColumn.getCaption(), 1002);
						value = DataTransferUtil.convertFieldValue(context.getVE(), metaForm,
								metaComponent.getControlType(), metaComponent.getProperties(), dataTable, columnKey);
						if (metaForm.componentByKey(columnKey)!=null&&metaForm.componentByKey(columnKey).getControlType()==ControlType.COMBOBOX) {
							value = dataTable.getObject(columnKey);
						}
						cell = ExcelUtil.getCell(dateRow, colIndex);
						if (columnKey.equalsIgnoreCase("Tag2")) {
							value = TypeConvertor.toString(oac.getWorkflowTypeMap().get(context.getDocument().getOID()).getWorkflowTypeDtlMap().get(tag2).getSequence());
							type = 1001;
						}
						ExcelUtil.setCellValue(cell, value, type);
					}
					++colIndex;
				}
			}
		}
	}

	private static void getOid(DefaultContext context, Object workbook, DataTable dt,String no) throws Throwable {
		Long selOID = -1L;
		String[] oids = { "AuditPerOID", "AuditOptOID", "SendOptOID", "MonitoringOptOID", "CarbonCopyOptOID",
				"NodePropertyOID", "OptCarbonCopyOptOID", "EndorseOptOID", "RightSelOID" };
		LoadData ld = null;
		Document document = null;
		String formkey = "";
		for (int s = 0; s < oids.length; s++) {
			String oidtype = oids[s];
			dt.beforeFirst();
			while (dt.next()) {
				selOID = dt.getLong(oidtype);
				switch (oidtype) {
				case "AuditPerOID":
				case "SendOptOID":
				case "MonitoringOptOID":
				case "CarbonCopyOptOID":
				case "OptCarbonCopyOptOID":
					formkey = "OA_OperatorSel";
					ld = new LoadData(formkey, selOID);
					document = ld.load(new DefaultContext(context), null);
					DtlSelExcelExportService.exportData(context, workbook, document, formkey,
							"OA_OperatorSel_H,OA_OperatorSel_D",no);
					break;

				case "AuditOptOID":
				case "EndorseOptOID":
					formkey = "OA_OperationSel";
					ld = new LoadData(formkey, selOID);
					document = ld.load(new DefaultContext(context), null);
					DtlSelExcelExportService.exportData(context, workbook, document, formkey,
							"OA_OperationSel_H,OA_OperationSel_D",no);
					break;

				case "NodePropertyOID":
					formkey = "OA_NodeProperty";
					ld = new LoadData(formkey, selOID);
					document = ld.load(new DefaultContext(context), null);
					DtlSelExcelExportService.exportData(context, workbook, document, formkey, "",no);
					break;

				case "RightSelOID":
					formkey = "OA_RightSel";
					ld = new LoadData(formkey, selOID);
					document = ld.load(new DefaultContext(context), null);
					DtlSelExcelExportService.exportData(context, workbook, document, formkey,
							"OA_RightSel_H,OA_RightSel_O,OA_RightSel_F",no);
					break;
				}

			}

		}
	}
}