package com.bokesoft.oa.importservice;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;

public class ImportDictHander {
	private String itemKey;
	private HashMap<String, ArrayList<String>> importFields;
	private Workbook workbook;
	private MetaDataObject metaDataObject;
	public static String SEPARATOR;

	public ImportDictHander(final DefaultContext context, final Workbook workbook) throws Throwable {
		this.itemKey = null;
		this.importFields = null;
		this.workbook = null;
		this.metaDataObject = null;
		this.workbook = workbook;
		this.init(context);
	}

	private void init(final DefaultContext context) throws Throwable {
		Sheet sheet = null;
		sheet = this.workbook.getSheetAt(0);
		this.itemKey = ExcelUtil.getCellValue(sheet, 0, 0).toString();
		this.metaDataObject = context.getVE().getMetaFactory().getDataObject(this.itemKey);
		String tableKey = null;
		ArrayList<String> list = null;
		this.importFields = new HashMap<String, ArrayList<String>>();
		for (int sheetCount = this.workbook.getNumberOfSheets(), i = 0; i < sheetCount; ++i) {
			sheet = this.workbook.getSheetAt(i);
			tableKey = sheet.getSheetName();
			list = new ArrayList<String>();
			this.importFields.put(tableKey, list);
			int colIndex = 1;
			while (true) {
				final String fieldKey = ExcelUtil.getCellValue(sheet, 0, colIndex).toString();
				if (fieldKey.isEmpty()) {
					break;
				}
				list.add(fieldKey);
				++colIndex;
			}
		}
	}

	public String getItemKey() {
		return this.itemKey;
	}

	public HashMap<String, ArrayList<String>> getImportFields() {
		return this.importFields;
	}

	public ArrayList<String> getFieldsByTable(final String tableKey) {
		return this.importFields.get(tableKey);
	}

	public String getInsertSQLByTable(final String tableKey) {
		final MetaTable metaTable = this.metaDataObject.getTable(tableKey);
		final ArrayList<String> list = this.importFields.get(tableKey);
		if (list == null || list.size() == 0) {
			return "";
		}
		String sql = "insert into " + metaTable.getBindingDBTableName();
		String fields = "OID,POID,SOID,VERID,DVERID,STATUS,ENABLE,NODETYPE,PARENTID";
		String values = "?,?,?,?,?,1,1,0,0";
		for (final String field : list) {
			final String columnKey = field.split(ImportDictHander.SEPARATOR)[0];
			final String DBName = this.getDBColumnNameByKey(metaTable, columnKey);
			fields = fields + "," + DBName;
			values += ",?";
		}
		sql = sql + " (" + fields + ") values (" + values + ")";
		return sql;
	}

	public String getInsertSQLByDtlTable(final String tableKey) {
		final MetaTable metaTable = this.metaDataObject.getTable(tableKey);
		final ArrayList<String> list = this.importFields.get(tableKey);
		if (list == null || list.size() == 0) {
			return "";
		}
		String sql = "insert into " + metaTable.getBindingDBTableName();
		String fields = "OID,POID,SOID,VERID,DVERID";
		String values = "?,?,?,?,?";
		for (final String field : list) {
			final String columnKey = field.split(ImportDictHander.SEPARATOR)[0];
			final String DBName = this.getDBColumnNameByKey(metaTable, columnKey);
			fields = fields + "," + DBName;
			values += ",?";
		}
		sql = sql + " (" + fields + ") values (" + values + ")";
		return sql;
	}
	public String getUpdateSQLByTable(final String tableKey) {
		final MetaTable metaTable = this.metaDataObject.getTable(tableKey);
		final ArrayList<String> list = this.importFields.get(tableKey);
		if (list == null || list.size() == 0) {
			return "";
		}
		String sql = "update " + metaTable.getBindingDBTableName() + " set ";
		String fields = "";
		for (final String field : list) {
			final String columnKey = field.split(ImportDictHander.SEPARATOR)[0];
			final String DBName = this.getDBColumnNameByKey(metaTable, columnKey);
			fields = fields + "," + DBName + "=?";
		}
		final String DBName2 = this.getDBColumnNameByKey(metaTable, "SOID");
		sql = sql + fields.substring(1) + " where " + DBName2 + "=?";
		return sql;
	}

	public String getDeleteSQLByTable(final String tableKey) {
		final MetaTable metaTable = this.metaDataObject.getTable(tableKey);
		final String DBName = this.getDBColumnNameByKey(metaTable, "SOID");
		final String sql = "delete from " + metaTable.getBindingDBTableName() + " where " + DBName + "=?";
		return sql;
	}

	private String getDBColumnNameByKey(final MetaTable metaTable, final String key) {
		final MetaColumn column = (MetaColumn) metaTable.get(key);
		return column.getBindingDBColumnName();
	}

	static {
		ImportDictHander.SEPARATOR = ";";
	}


}
