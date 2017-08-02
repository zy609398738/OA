package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据人员多选字典选择内容列表对象取得对应操作员OID字符串
 * 
 * @author minjian
 *
 */
public class GetOperatorIDsByEmp implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getOperatorIDsByEmp(paramDefaultContext, paramArrayList.get(0),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 根据人员多选字典选择内容列表对象取得对应操作员OID字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param dicIds
	 *            多选字典对象
	 * @param sep
	 *            分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public String getOperatorIDsByEmp(DefaultContext context, Object dicIds, String sep) throws Throwable {
		String ids = GetValueStrByMutilSel.getValueStrByMutilSel(context, dicIds);
		if (ids.length() <= 0) {
			return ids;
		}
		String sql = "select OID from sys_operator where empid in (" + ids + ")";
		DataTable dt = context.getDBManager().execQuery(sql);
		String valueStr = "";
		dt.beforeFirst();
		while (dt.next()) {
			valueStr = valueStr + sep + dt.getLong("OID");
		}
		if (valueStr.length() > 0) {
			valueStr = valueStr.substring(sep.length());
		}
		return valueStr;
	}
}
