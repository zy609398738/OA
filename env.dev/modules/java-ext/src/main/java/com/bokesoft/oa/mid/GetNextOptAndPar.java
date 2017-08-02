package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map.Entry;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据SQL获得下一步的参与者和操作名称
 * 
 * @author minjian
 *
 */
public class GetNextOptAndPar implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getNextOptAndPar(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 根据SQL获得下一步的参与者和操作名称
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            SQL语句
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public String getNextOptAndPar(DefaultContext context, String sql) throws Throwable {
		DataTable dt = context.getDBManager().execQuery(sql);
		LinkedHashMap<Integer, LinkedHashMap<String, StringBuffer>> fieldValueMap = new LinkedHashMap<Integer, LinkedHashMap<String, StringBuffer>>();
		dt.beforeFirst();
		StringBuffer sb = new StringBuffer();
		String sepRow = "；";
		String sepCol = "，";
		while (dt.next()) {
			Integer nodeID = dt.getInt("NODEID");
			LinkedHashMap<String, StringBuffer> map = fieldValueMap.get(nodeID);
			if (map == null) {
				map = new LinkedHashMap<String, StringBuffer>();
				fieldValueMap.put(nodeID, map);
			}
			String workitemName = dt.getString("WORKITEMNAME");
			StringBuffer operatorSB = map.get(workitemName);
			if (operatorSB == null) {
				operatorSB = new StringBuffer();
				map.put(workitemName, operatorSB);
			}
			String operatorName = dt.getString("NAME");
			operatorSB.append(sepCol);
			operatorSB.append(operatorName);
		}

		for (LinkedHashMap<String, StringBuffer> map : fieldValueMap.values()) {
//			sb.append(sepRow);
			String value = "";
			for (Iterator<Entry<String, StringBuffer>> i = map.entrySet().iterator(); i.hasNext();) {
				Entry<String, StringBuffer> e = i.next();
				String workitemName = e.getKey();
				StringBuffer operatorSB = e.getValue();
				if (operatorSB.length() > 0) {
					value = operatorSB.substring(sepCol.length());
				}
				value = sepRow + workitemName + "：" + value;
			}
			if (value.length() > 0) {
				value.substring(sepRow.length());
			}
			sb.append(value);
		}
		String value = "";
		if (sb.length() > 0) {
			value = sb.substring(sepRow.length());
		}
		return value;
	}
}
