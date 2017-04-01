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
	 *            中间层对象
	 * @param sql
	 *            SQL语句
	 * @param valueName
	 *            值列
	 * @param valueName
	 *            名称列
	 * @return 列内容的下拉字符串
	 * @throws Throwable
	 */
	public static String getDropStrBySql(DefaultContext context, String sql, String valueName, String captionName)
			throws Throwable {
		DataTable dt = context.getDBManager().execQuery(sql);
		String valueStr = "";
		dt.beforeFirst();
		while (dt.next()) {
			valueStr = valueStr + ";" + TypeConvertor.toString(dt.getObject(valueName)) + ","
					+ TypeConvertor.toString(dt.getObject(captionName));
		}
		if (valueStr.length() > 0) {
			valueStr = valueStr.substring(1);
		}
		return valueStr;
	}
}
