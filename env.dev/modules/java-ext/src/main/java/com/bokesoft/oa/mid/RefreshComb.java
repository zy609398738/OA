package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;
import com.bokesoft.yigo.struct.document.Document;

public class RefreshComb implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return refreshComb(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	public DataTable refreshComb(DefaultContext context, String sourceSql, String detailDataTable) throws Throwable {
		Document doc = context.getDocument();
		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		String sql = sourceSql + " where 1=2";
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		DataTableMetaData metaData = dtQuery.getMetaData();
		List<String> list = new ArrayList<String>();
		for (int i = 0; i < metaData.getColumnCount(); i++) {
			String columnKey = metaData.getColumnInfo(i).getColumnKey();
			list.add(columnKey);
		}
		DataTable detailDT = doc.get(detailDataTable);
		for (int i = 0; i < list.size(); i++) {
			String fieldKey = list.get(i);
			if (detailDT.findRow("FieldKey", fieldKey) < 0) {
				detailDT.append();
				detailDT.setString("FieldKey", fieldKey);
				detailDT.setString("FieldCaption", fieldKey);
			}
		}
		return detailDT;
	}

}
