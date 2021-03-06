package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获取判断OID是否存在的SQL语句
 * 
 * @author minjian
 * 
 */
public class GetIdExistsSql implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getIdExistsSql(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)), paramArrayList.get(1),
				TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 获取判断OID是否存在的SQL语句
	 * 
	 * @param context
	 *            上下文对象
	 * @param tableName
	 *            字典的主表名称
	 * @param dicIds
	 *            字典的OID对象
	 * @param idName
	 *            用来连接外部SQL语句的带别名的OID名称 ，例如：d.OID
	 * @return
	 * @throws Throwable
	 */
	public static String getIdExistsSql(DefaultContext context, String tableName, Object dicIds, String idName)
			throws Throwable {
		String sqlWhere = "";

		String ids = GetValueStrByMutilSel.getValueStrByMutilSel(context, dicIds);
		if (ids.length() <= 0) {
			return sqlWhere;
		}
		// 如果OID字符串为0，表示全选
		if (ids.equalsIgnoreCase("0")) {
			return "Exists (SELECT OID FROM " + tableName + " IdExists WHERE IdExists.OID=" + idName
					+ " And IdExists.OID>-1 AND IdExists.STATUS >-1)";
		}
		String sql = "SELECT OID,TLEFT,TRIGHT FROM " + tableName + " WHERE OID IN(" + ids + ")";
		DataTable dt = context.getDBManager().execQuery(sql);
		dt.beforeFirst();
		while (dt.next()) {
			sqlWhere = sqlWhere + " OR (TLEFT>=" + dt.getInt("TLEFT") + " AND TRIGHT<=" + dt.getInt("TRIGHT") + ")";
		}
		sqlWhere = sqlWhere.substring(3);
		sqlWhere = "Exists (SELECT OID FROM " + tableName + " IdExists WHERE IdExists.OID=" + idName + " And ("
				+ sqlWhere + " ))";
		return sqlWhere;
	}
}
