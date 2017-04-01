package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 根据列名获得列内容的字符串
 * 
 * @author minjian
 *
 */
public class GetValueStrByCol implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getValueStrByCol(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 根据列名获得列内容的字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param tableName
	 *            表标识
	 * @param fieldName
	 *            列名称
	 * @param sep
	 *            分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public String getValueStrByCol(DefaultContext context, String tableName, String fieldName, String sep)
			throws Throwable {
		Document doc = context.getDocument();
		DataTable dt = doc.get(tableName);
		String valueStr = "";
		dt.beforeFirst();
		while (dt.next()) {
			valueStr = valueStr + sep + TypeConvertor.toString(dt.getObject(fieldName));
		}
		if (valueStr.length() > 0) {
			valueStr = valueStr.substring(sep.length());
		}
		return valueStr;
	}
}
