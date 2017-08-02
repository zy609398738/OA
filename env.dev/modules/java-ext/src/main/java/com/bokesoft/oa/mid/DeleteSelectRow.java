package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 删除选中的数据行
 * 
 * @author minjian
 *
 */
public class DeleteSelectRow implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		if (paramArrayList.size() <= 2) {
			return deleteSelectRow(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
					TypeConvertor.toString(paramArrayList.get(1)), true);
		}
		return deleteSelectRow(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toBoolean(paramArrayList.get(2)));
	}

	/**
	 * 删除选中的数据行
	 * 
	 * @param context
	 *            上下文对象
	 * @param tableName
	 *            数据表名
	 * @param selectName
	 *            选择字段名
	 * @param isDelete
	 *            是否直接删除数据库数据
	 * @return 返回删除后的数据表
	 * @throws Throwable
	 */
	public DataTable deleteSelectRow(DefaultContext context, String tableName, String selectName, Boolean isDelete)
			throws Throwable {
		Document doc = context.getDocument();
		DataTable dtOperatorSel = doc.get(tableName);
		// dtOperatorSel.setShowDeleted(true);
		dtOperatorSel.afterLast();
		String ids = "";
		while (dtOperatorSel.previous()) {
			Integer selField = dtOperatorSel.getInt(selectName);
			if (null != selField && selField == 1) {
				if (isDelete) {
					ids = ids + "," + dtOperatorSel.getLong("OID");
				}
				dtOperatorSel.delete();
			}
		}
		// dtOperatorSel.setShowDeleted(false);
		if (isDelete && ids.length() > 0) {
			ids = ids.substring(1);
			String sql = "delete from " + tableName + " where oid in(" + ids + ")";
			context.getDBManager().execUpdate(sql);
			dtOperatorSel.batchUpdate();
		}
		return dtOperatorSel;
	}
}
