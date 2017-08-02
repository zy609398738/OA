package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据列名获得查询内容的下拉字符串
 * 
 * @author minjian
 *
 */
public class GetDropStrBySql implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getDropStrBySql(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            SQL语句
	 * @param valueNames
	 *            值列名字符串，以“:”分隔
	 * @param captionNames
	 *            名称列名字符串，以“:”分隔
	 * @return 列内容的下拉字符串
	 * @throws Throwable
	 */
	public static String getDropStrBySql(DefaultContext context, String sql, String valueNames, String captionNames)
			throws Throwable {
		DataTable dt = context.getDBManager().execQuery(sql);
		String[] valueArray = valueNames.split(":");
		String[] captionArray = captionNames.split(":");
		StringBuffer valueStr = new StringBuffer();
		dt.beforeFirst();
		int len = valueArray.length;
		while (dt.next()) {
			StringBuffer value = new StringBuffer();
			StringBuffer caption = new StringBuffer();
			for (int i = 0; i < len; i++) {
				value.append(TypeConvertor.toString(dt.getObject(valueArray[i])));
				caption.append(TypeConvertor.toString(dt.getObject(captionArray[i])));
			}
			valueStr.append(";");
			valueStr.append(value.toString());
			valueStr.append(",");
			valueStr.append(caption.toString());
		}
		String str = valueStr.toString();
		if (str.length() > 0) {
			str = str.substring(1);
		}
		return str;
	}
}
