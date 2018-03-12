package com.bokesoft.oa.importservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.common.util.DBTypeUtil;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yes.excel.utils.ImportDictionaryHander;
import com.bokesoft.yes.tools.dic.proxy.IDictCacheProxy;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.base.MidCoreException;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.dict.Item;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class ImportDesigneHandler
{
  private IMetaFactory metaFactory = null;
  private String dataObjectKey = null;
  private HashMap<String, ArrayList<String>> importFields = null;
  private Workbook workbook = null;
  private Sheet mainSheet = null;
  private MetaDataObject metaDataObject = null;
  private DefaultContext context = null;
  private String formKey = null;
  public static String SEPARATOR = ";";

  public ImportDesigneHandler(DefaultContext context, Workbook workbook)
    throws Throwable
  {
    this.metaFactory = context.getVE().getMetaFactory();
    this.workbook = workbook;
    this.context = context;
    init(context);
  }

  private void init(DefaultContext context) throws Throwable {
    this.formKey = context.getFormKey();
    this.mainSheet = this.workbook.getSheetAt(5);
    this.dataObjectKey = ExcelUtil.getCellValue(this.mainSheet, 0, 0).toString();
    this.metaDataObject = context.getVE().getMetaFactory().getDataObject(this.dataObjectKey);

    Sheet sheet = null;
    String tableKey = null;
    ArrayList<String> list = null;
    this.importFields = new HashMap<String,ArrayList<String>>();
    for (int i = 5; i < 7; ++i) {
      sheet = this.workbook.getSheetAt(i);
      tableKey = sheet.getSheetName();
      list = new ArrayList<String>();
      this.importFields.put(tableKey, list);

      int colIndex = 1;
      while (true) {
        String fieldKey = ExcelUtil.getCellValue(sheet, 0, colIndex).toString();
        if (fieldKey.isEmpty())
          break;

        list.add(fieldKey);
        ++colIndex;
      }
    }
  }

  public String getDataObjectKey() {
    return this.dataObjectKey;
  }

  public MetaDataObject getDataObject() {
    return this.metaDataObject;
  }

  public HashMap<String, ArrayList<String>> getImportFields() {
    return this.importFields;
  }

  public ArrayList<String> getFieldsByTable(String tableKey) {
    return ((ArrayList<String>)this.importFields.get(tableKey));
  }

  public Document createNewDocumnt() throws Throwable {
    Document document = DocumentUtil.newDocument(this.metaDataObject);
    document.setNew();
    return document;
  }

  public Sheet getMainSheet() throws Throwable {
    return this.mainSheet;
  }

  public void fillImportField(MetaTable metaTable, DataTable dataTable, Sheet sheet, int rowIndex) throws Throwable
  {
    ArrayList<String> fields = getFieldsByTable(metaTable.getKey());
    for (int colIndex = 0; colIndex < fields.size(); ++colIndex) {
      String columnKey = (String)fields.get(colIndex);
      String[] columnKeys = columnKey.split(ImportDictHander.SEPARATOR);

      Object value = getValue(metaTable, sheet, rowIndex, colIndex + 1, columnKey);

      dataTable.setObject(columnKeys[0].toUpperCase(), value);
    }
    
  }

  private Object getValue(MetaTable metaTable, Sheet sheet, int rowIndex, int colIndex, String fieldKey) throws Throwable
  {
    Object value = ExcelUtil.getCellValue(sheet, rowIndex, colIndex);
    String columnKey = null;
    String[] fields = fieldKey.split(ImportDictionaryHander.SEPARATOR);
    columnKey = fields[0];
    if ((value != null) && (!(value.toString().isEmpty()))&&columnKey.equals("AuditPerOID")
    		||columnKey.equals("SendOptOID")||columnKey.equals("MonitoringOptOID")||
    		columnKey.equals("CarbonCopyOptOID")||columnKey.equals("OptCarbonCopyOptOID")) {
		String sql = "select oid from OA_OperatorSel_H where no = ?";
		IDBManager dbm = context.getDBManager();
		DataTable sqlDT = dbm.execPrepareQuery(sql, value);
		if (sqlDT.size()>0) {
			value = sqlDT.getLong("OID");
		}else{
			value = 0L;
		}
		
	}
    if ((value != null) && (!(value.toString().isEmpty()))&&columnKey.equals("AuditOptOID")
    		||columnKey.equals("EndorseOptOID")) {
    	String sql = "select oid from OA_OperationSel_H where no = ?";
		IDBManager dbm = context.getDBManager();
		DataTable sqlDT = dbm.execPrepareQuery(sql, value);
		if (sqlDT.size()>0) {
			value = sqlDT.getLong("OID");
		}else{
			value = 0L;
		}
	}
    if ((value != null) && (!(value.toString().isEmpty()))&&columnKey.equals("RightSelOID")) {
    	String sql = "select oid from OA_RightSel_H where no = ?";
		IDBManager dbm = context.getDBManager();
		DataTable sqlDT = dbm.execPrepareQuery(sql, value);
		if (sqlDT.size()>0) {
			value = sqlDT.getLong("OID");
		}else{
			value = 0L;
		}
	}
    if ((value != null) && (!(value.toString().isEmpty()))&&columnKey.equals("NodePropertyOID")) {
    	String sql = "select oid from OA_NodeProperty_H where no = ?";
		IDBManager dbm = context.getDBManager();
		DataTable sqlDT = dbm.execPrepareQuery(sql, value);
		if (sqlDT.size()>0) {
			value = sqlDT.getLong("OID");
		}else{
			value = 0L;
		}
	}
    if ((value != null) && (!(value.toString().isEmpty()))) {
      String sValue = TypeConvertor.toString(value);
      if (fields.length > 1) {
        value = Integer.valueOf(0);
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
        IDictCacheProxy dictCache = (IDictCacheProxy)this.context.getVE().getDictCache();
        MetaDataObject dictDataObject = this.metaFactory.getDataObject(itemKey);
        List<MetaColumn> displayColumns = dictDataObject.getQueryColumns();
        for (Iterator<MetaColumn> localIterator = displayColumns.iterator(); localIterator.hasNext(); ) { MetaColumn metaColumn = (MetaColumn)localIterator.next();
          Item item = dictCache.locate(itemKey, metaColumn.getKey(), code, null, null, 7);
          if (item != null){
			value = Long.valueOf(item.getID());
			break;
		  }
        }
      }

    }

    MetaColumn column = (MetaColumn)metaTable.get(columnKey);
    if (column == null)
      throw new MidCoreException(38, 
        MidCoreException.formatMessage(null, 38, new Object[] { columnKey }));

    return TypeConvertor.toJavaType(DBTypeUtil.dataType2JavaDataType(column.getDataType()), value);
  }

  public String getPrimayKey(Sheet sheet, int rowIndex, boolean isMainTable) {
    return ExcelUtil.getCellValue(sheet, rowIndex, 1).toString();
  }
  public String getDtlPrimayKey(Sheet sheet, int rowIndex, boolean isMainTable) {
	    return ExcelUtil.getCellValue(sheet, rowIndex, 0).toString();
	  }
  public String getFormKey() {
    return this.formKey;
  }
}