package com.bokesoft.oa.importservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.common.util.DBTypeUtil;
import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yes.mid.cmd.dict.RebuildDictTreeCmd;
import com.bokesoft.yes.mid.connection.dbmanager.BatchPsPara;
import com.bokesoft.yes.mid.connection.dbmanager.PSArgs;
import com.bokesoft.yes.tools.dic.proxy.IDictCacheProxy;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.dict.Item;
import com.bokesoft.yigo.struct.dict.ItemData;
import com.bokesoft.yigo.tools.dict.IItemFilter;

public class ImportDict implements IImport {
	private boolean clearOriginalData;
	private ImportDictHander hander;
	private HashMap<String, Long> codes;
	private HashSet<String> existCodes;
	private DefaultContext context;
	private Workbook workbook;

	public ImportDict(final DefaultContext context, final Workbook workbook, final boolean clearOriginalData)
			throws Throwable {
		this.clearOriginalData = false;
		this.hander = null;
		this.codes = new HashMap<String, Long>();
		this.existCodes = new HashSet<String>();
		this.context = null;
		this.workbook = null;
		this.context = context;
		this.workbook = workbook;
		this.hander = new ImportDictHander(context, workbook);
		this.clearOriginalData = clearOriginalData;
	}

	public Object importData() throws Throwable {
		final String itemKey = this.hander.getItemKey();
		final IMetaFactory metaFactory = this.context.getVE().getMetaFactory();
		final MetaDataObject dataObject = metaFactory.getDataObject(itemKey);
		if (dataObject == null) {
			return true;
		}
		Sheet sheet = null;
		boolean firstSheet = true;
		for (int count = 2, sheetIndex = 0; sheetIndex < count; ++sheetIndex) {
			sheet = this.workbook.getSheetAt(sheetIndex);
			this.processImportData(itemKey, sheet, firstSheet);
			firstSheet = false;
			
		}
		this.context.commit();
		final RebuildDictTreeCmd cmd = new RebuildDictTreeCmd();
		cmd.setItemKey(itemKey);
		cmd.doCmd(this.context);
		this.context.getVE().getDictCache().removeDictCache(itemKey);
		return itemKey;
	}

	private void processImportData(final String itemKey, final Sheet sheet, final boolean firstSheet) throws Throwable {
		final String tableKey = sheet.getSheetName();
			if (firstSheet) {
				this.dealFirstSheet(itemKey, sheet);
			} else {
				final IMetaFactory metaFactory = this.context.getVE().getMetaFactory();
				final MetaDataObject dataObject = metaFactory.getDataObject(itemKey);
				final MetaTable metaTable = dataObject.getTable(tableKey);
				final int tableMode = metaTable.getTableMode();
				switch (tableMode) {
				case 0: {
					this.dealHeadSheet(itemKey, sheet);
					break;
				}
				case 1: {
					this.dealDtlSheet(itemKey, sheet);
					break;
				}
				}
			}
		
	}

	private void dealHeadSheet(final String itemKey, final Sheet sheet) throws Throwable {
		final String tableKey = sheet.getSheetName();
		final IMetaFactory metaFactory = this.context.getVE().getMetaFactory();
		final MetaDataObject dataObject = metaFactory.getDataObject(itemKey);
		final MetaTable metaTable = dataObject.getTable(tableKey);
		final ArrayList<String> fields = (ArrayList<String>) this.hander.getFieldsByTable(tableKey);
		final String insertSql = this.hander.getInsertSQLByTable(tableKey);
		final BatchPsPara insertBPP = new BatchPsPara(insertSql);
		final String updateSql = this.hander.getUpdateSQLByTable(tableKey);
		final BatchPsPara updateBPP = new BatchPsPara(updateSql);
		long SOID = 0L;
		int rowIndex = 2;
		PSArgs args = null;
		while (true) {
			final String code = ExcelUtil.getCellValue(sheet, rowIndex, 0).toString().toUpperCase();
			if (code.isEmpty()) {
				break;
			}
			final boolean bExist = this.existCodes.contains(code);
			SOID = this.codes.get(code);
			args = new PSArgs();
			if (!bExist) {
				final long OID = this.context.applyNewOID();
				insertBPP.putArgs(args);
				this.fillSystemField(metaTable, args, OID, SOID);
			}
			this.fillImportField(metaTable, args, sheet, rowIndex, fields);
			if (bExist) {
				args.addArg(metaTable.getSOIDColumn().getDataType(), (Object) SOID);
				updateBPP.putArgs(args);
			}
			++rowIndex;
		}
		final IDBManager dbm = this.context.getDBManager();
		dbm.executeUpdate(updateBPP);
		dbm.executeUpdate(insertBPP);
	}

	private void dealDtlSheet(final String itemKey, final Sheet sheet) throws Throwable {
		dealOtherTable("OA_WorkflowDesigne_H", this.workbook);
		final String tableKey = sheet.getSheetName();
		final IMetaFactory metaFactory = this.context.getVE().getMetaFactory();
		final MetaDataObject dataObject = metaFactory.getDataObject(itemKey);
		final MetaTable metaTable = dataObject.getTable(tableKey);
		final ArrayList<String> fields = (ArrayList<String>) this.hander.getFieldsByTable(tableKey);
		final String insertSql = this.hander.getInsertSQLByDtlTable(tableKey);
		final BatchPsPara insertBPP = new BatchPsPara(insertSql);
		final String deleteSql = this.hander.getDeleteSQLByTable(tableKey);
		final BatchPsPara deleteBPP = new BatchPsPara(deleteSql);
		long SOID = 0L;
		int rowIndex = 2;
		PSArgs args = null;
		while (true) {
			final String code = ExcelUtil.getCellValue(sheet, rowIndex, 0).toString().toUpperCase();
			if (code.isEmpty()) {
				break;
			}
			SOID = this.codes.get(code);
			if (this.clearOriginalData) {
				args = new PSArgs();
				args.addArg(metaTable.getSOIDColumn().getDataType(), (Object) SOID);
				deleteBPP.putArgs(args);
			}
			final long OID = this.context.applyNewOID();
			args = new PSArgs();
			this.fillSystemField(metaTable, args, OID, SOID);
			this.fillImportField(metaTable, args, sheet, rowIndex, fields);
			insertBPP.putArgs(args);
			String sql3 = "update oa_workflowdesigne_h set tag2 = ? where oid =?";
			context.getDBManager().execPrepareUpdate(sql3, TypeConvertor.toString(OID),args.get(16));
			String sql = "update OA_RightSel_H set sourceid = ?, tag1=? where tag3 in (?,?)";
			context.getDBManager().execPrepareUpdate(sql, TypeConvertor.toString(SOID), TypeConvertor.toString(OID),"SponsorRight","RightSelDepict");
			++rowIndex;
		}
		final IDBManager dbm = this.context.getDBManager();
		dbm.executeUpdate(deleteBPP);
		dbm.executeUpdate(insertBPP);
	}

	private void dealFirstSheet(final String itemKey, final Sheet sheet) throws Throwable {
		final String tableKey = sheet.getSheetName();
		final IMetaFactory metaFactory = this.context.getVE().getMetaFactory();
		final MetaDataObject dataObject = metaFactory.getDataObject(itemKey);
		final MetaTable metaTable = dataObject.getTable(tableKey);
		final ArrayList<String> fields = (ArrayList<String>) this.hander.getFieldsByTable(tableKey);
		final String insertSql = this.hander.getInsertSQLByTable(tableKey);
		final BatchPsPara insertBPP = new BatchPsPara(insertSql);
		final String updateSql = this.hander.getUpdateSQLByTable(tableKey);
		final BatchPsPara updateBPP = new BatchPsPara(updateSql);
		final IDictCacheProxy dictCache = this.context.getVE().getDictCache();
		Item item = null;
		int rowIndex = 2;
		long OID = 0L;
		boolean exist = false;
		while (true) {
			final PSArgs args = new PSArgs();
			final String code = ExcelUtil.getCellValue(sheet, rowIndex, 1).toString().toUpperCase();
			if (code.isEmpty()) {
				break;
			}
			item = dictCache.locate(itemKey, "Code", (Object) code, (IItemFilter) null, (ItemData) null, 7);
			if (item == null) {
				OID = this.context.applyNewOID();
				exist = false;
			} else {
				OID = item.getID();
				this.existCodes.add(code);
				exist = true;
			}
			this.codes.put(code, OID);
			if (!exist) {
				insertBPP.putArgs(args);
				this.fillSystemField(metaTable, args, OID, OID);
			}
			this.fillImportField(metaTable, args, sheet, rowIndex, fields);
			if (exist) {
				updateBPP.putArgs(args);
				args.addArg(metaTable.getSOIDColumn().getDataType(), (Object) OID);
			}
			++rowIndex;
		}
		final IDBManager dbm = this.context.getDBManager();
		dbm.executeUpdate(insertBPP);
		dbm.executeUpdate(updateBPP);
	}

	private void fillSystemField(final MetaTable metaTable, final PSArgs args, final long OID, final long SOID) {
		args.addArg(metaTable.getOIDColumn().getDataType(), (Object) OID);
		args.addArg(metaTable.getPOIDColumn().getDataType(), (Object) null);
		args.addArg(metaTable.getSOIDColumn().getDataType(), (Object) SOID);
		args.addArg(metaTable.getVERIDColumn().getDataType(), (Object) 0);
		args.addArg(metaTable.getDVERIDColumn().getDataType(), (Object) 0);
	}

	private void fillImportField(final MetaTable metaTable, final PSArgs args, final Sheet sheet, final int rowIndex,
			final ArrayList<String> fields) throws Throwable {
		for (int colIndex = 0; colIndex < fields.size(); ++colIndex) {
			final String columnKey = fields.get(colIndex);
			
			Object value = this.getValue(metaTable, sheet, rowIndex, colIndex + 1, columnKey);
			args.addArg(((MetaColumn) metaTable.get(columnKey.split(ImportDictHander.SEPARATOR)[0])).getDataType(),
					value);
		}
	}

	private Object getValue(final MetaTable metaTable, final Sheet sheet, final int rowIndex, final int colIndex,
			final String fieldKey) throws Throwable {
		Object value = ExcelUtil.getCellValue(sheet, rowIndex, colIndex);
		final String[] fields = fieldKey.split(ImportDictHander.SEPARATOR);
		final String columnKey = fields[0];
		 if (value.equals(" ")) {
				value="";
			}
		if (value != null && !value.toString().isEmpty()) {
			String sValue = TypeConvertor.toString(value);
			if (sValue.indexOf(' ')!=-1) {
				sValue = sValue.split("\\s+")[1];
			}
			
			if (fields.length > 1) {
				value = 0;
				String itemKey = fields[1];
			        String tablename = context.getVE().getMetaFactory().getDataObject(itemKey)
							.getMainTable().getBindingDBTableName();
			        String sql = "select code from "+ tablename +" where name =?";
			        IDBManager dbm = context.getDBManager();
					DataTable sqlDT = dbm.execPrepareQuery(sql, sValue);
					if (sqlDT.size()==0) {
						return 0L;
					}
					String code = sqlDT.getString("code");
				if (itemKey.equals(this.hander.getItemKey()) && this.codes.containsKey(value.toString())) {
					value = this.codes.get(value.toString().toUpperCase());
				} else {
					
					final IDictCacheProxy dictCache = this.context.getVE().getDictCache();
					final MetaDataObject dictDataObject = this.context.getVE().getMetaFactory().getDataObject(itemKey);
					final List<MetaColumn> displayColumns = (List<MetaColumn>) dictDataObject.getDisplayColumns();
					for (final MetaColumn metaColumn : displayColumns) {
						final Item item = dictCache.locate(itemKey, metaColumn.getKey(), (Object) code,
								(IItemFilter) null, (ItemData) null, 7);
						if (item != null) {
							value = item.getID();
							break;
						}
					}
				}
			}
		}
		final MetaColumn column = (MetaColumn) metaTable.get(columnKey);
		final int dataType = column.getDataType();
			if (columnKey.equals("WorkflowDesigneID")) {
				String sql = "select oid from oa_workflowdesigne_h where no = ?";
				IDBManager dbm = context.getDBManager();
				DataTable sqlDT = dbm.execPrepareQuery(sql, value);
				if (sqlDT.size()>0) {
					value = sqlDT.getLong("OID");
				}else{
					value = 0L;
				}
				
			}
			if (columnKey.equals("SponsorRightID")||columnKey.equals("RightSelOID")) {
				String sql = "select oid from OA_RightSel_H where no = ?";
				IDBManager dbm = context.getDBManager();
				DataTable sqlDT = dbm.execPrepareQuery(sql, value);
				if (sqlDT.size()>0) {
					value = sqlDT.getLong("OID");
				}else{
					value = 0L;
				}
			}
		
		else{
			value = TypeConvertor.toJavaType(DBTypeUtil.dataType2JavaDataType(dataType), value);
		}
		return value;
	}

	private void dealOtherTable(final String tablekey, Workbook workbook) throws Throwable {
		String itemKey = "";
		switch (tablekey) {
		case "OA_WorkflowDesigne_H":
		case "OA_WorkflowDesigne_D":
			itemKey = "OA_WorkflowDesigne";
			context.setFormKey(itemKey);
			new ImportDesigneExcel(context, workbook,true);
			break;

		default:
			break;
		}

	}
}