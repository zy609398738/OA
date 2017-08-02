package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 获得选择行指定列值的字符串
 * 
 * @author minjian
 *
 */
public class GetSelectRowColumn implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getSelectRowColumn(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)));
	}

	/**
	 * 获得选择行指定列值的字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param tableName
	 *            表名
	 * @param selectName
	 *            选择列名
	 * @param colName
	 *            指定列名
	 * @param sep
	 *            分隔符
	 * @return 选择行指定列值的字符串
	 * @throws Throwable
	 */
	public String getSelectRowColumn(DefaultContext context, String tableName, String selectName, String colName,
			String sep) throws Throwable {
		String colValue = "";
		Document doc = context.getDocument();
		DataTable dtSel = doc.get(tableName);
		dtSel.beforeFirst();
		while (dtSel.next()) {
			Integer selField = dtSel.getInt(selectName);
			if (null != selField && selField == 1) {
				colValue = colValue + sep + TypeConvertor.toString(dtSel.getObject(colName));
			}
		}
		if (colValue.length() > 0) {
			colValue = colValue.substring(sep.length());
		}
		return colValue;
	}
}
