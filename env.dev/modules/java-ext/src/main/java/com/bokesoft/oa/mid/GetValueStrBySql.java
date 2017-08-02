package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据列名获得查询内容的字符串
 * 
 * @author minjian
 *
 */
public class GetValueStrBySql implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getValueStrBySql(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)));
	}

	/**
	 * 根据列名获得查询内容的字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            SQL语句
	 * @param fieldNames
	 *            列名称字符串，已“:”分隔
	 * @param sepRow
	 *            行分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public String getValueStrBySql(DefaultContext context, String sql, String fieldNames, String sepRow)
			throws Throwable {
		return getValueStrBySql(context, sql, fieldNames, sepRow, "");
	}

	/**
	 * 根据列名获得查询内容的字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            SQL语句
	 * @param fieldNames
	 *            列名称字符串，已“:”分隔
	 * @param sepRow
	 *            行分隔符
	 * @param sepCol
	 *            列分隔符，列名称有多个，多个列值之间的分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public String getValueStrBySql(DefaultContext context, String sql, String fieldNames, String sepRow, String sepCol)
			throws Throwable {
		DataTable dt = context.getDBManager().execQuery(sql);
		String[] fieldArray = fieldNames.split(":");
		dt.beforeFirst();
		StringBuffer sb = new StringBuffer();
		while (dt.next()) {
			sb.append(sepRow);
			StringBuffer valueStr = new StringBuffer();
			for (String fieldName : fieldArray) {
				valueStr.append(sepCol);
				valueStr.append(TypeConvertor.toString(dt.getObject(fieldName)));
			}
			if (valueStr.length() > 0) {
				sb.append(valueStr.substring(sepCol.length()));
			}
		}
		String value = "";
		if (sb.length() > 0) {
			value = sb.substring(sepRow.length());
		}
		return value;
	}
}
