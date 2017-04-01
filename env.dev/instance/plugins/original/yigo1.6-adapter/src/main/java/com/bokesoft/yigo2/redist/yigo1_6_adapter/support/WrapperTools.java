package com.bokesoft.yigo2.redist.yigo1_6_adapter.support;

import java.sql.SQLException;

import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * Yigo 1.6 和 2.0 之间转换的一些工具
 */
public class WrapperTools {

	/**
	 * 将 Yigo 1.6 的 {@link BKRowSet} 数据填充到 Yigo 2.0 的 {@link DataTable} 对象中
	 * @param rs
	 * @param table
	 * @param colNames
	 * @throws SQLException
	 */
	public static void fillDataTable(BKRowSet rs, DataTable table, String[] colNames) throws SQLException{
		//清除需要复制到的 DataTable 数据对象
		table.clear();
		//逐行逐列复制
		rs.bkBeforeFirst();
		while(rs.bkNext()){
			table.append();
			for (int i = 0; i < colNames.length; i++) {
				String col = colNames[i];
				table.setObject(col, rs.bkGetObject(col));
			}
		}
	}
}
