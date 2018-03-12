package com.bokesoft.oa.mid.wf;

import java.util.Iterator;

import com.bokesoft.yigo.common.def.TableMode;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class OADocumentUtil {
	private static String IgnoreFields = "OID,SOID,POID,VERID,DVERID,No,BillDate,Status,Creator,CreateTime,"
			+ "Modifier,ModifyTime,RightSelDepict,RightSelOID";

	public static Document cloneDocument(MetaDataObject metaDataObject, Document srcDoc, Document trgDoc)
			throws Throwable {
		for (MetaTable metaTable : metaDataObject.getTableCollection()) {
			String tableKey = metaTable.getKey();
			switch (metaTable.getTableMode()) {
			case TableMode.HEAD:
				cloneOneRow(metaTable, srcDoc.get(tableKey), trgDoc.get(tableKey));
				break;
			case TableMode.DETAIL:
				cloneDataTable(metaTable, srcDoc.get(tableKey), trgDoc.get(tableKey));
				break;
			}
		}
		return trgDoc;
	}

	public static DataTable cloneDataTable(MetaTable metaTable, DataTable srcDataTable, DataTable trgDataTable)
			throws Throwable {
		srcDataTable.beforeFirst();
		while (srcDataTable.next()) {
			DocumentUtil.newRow(metaTable, trgDataTable);
			cloneOneRow(metaTable, srcDataTable, trgDataTable);
		}
		return trgDataTable;
	}

	public static DataTable cloneOneRow(MetaTable metaTable, DataTable srcDataTable, DataTable trgDataTable)
			throws Throwable {
		MetaColumn metaColumn = null;
		String columnKey = null;
		Iterator<MetaColumn> it = null;

		it = metaTable.iterator();
		while (it.hasNext()) {
			metaColumn = it.next();
			columnKey = metaColumn.getKey();
			if (!isIgnoreField(columnKey)) {
				trgDataTable.setObject(columnKey, srcDataTable.getObject(columnKey));
			}
		}
		return trgDataTable;
	}

	private static boolean isIgnoreField(String fieldKey) {
		return IgnoreFields.indexOf(fieldKey) >= 0;
	}
}
