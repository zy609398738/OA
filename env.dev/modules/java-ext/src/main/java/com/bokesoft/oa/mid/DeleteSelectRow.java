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
		return deleteSelectRow(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 删除选中的数据行
	 * 
	 * @param context
	 *            中间层对象
	 * @param tableName
	 *            数据表名
	 * @param selectName
	 *            选择字段名
	 * @return 返回删除后的数据表
	 * @throws Throwable
	 */
	public DataTable deleteSelectRow(DefaultContext context, String tableName, String selectName) throws Throwable {
		Document doc = context.getDocument();
		DataTable dtOperatorSel = doc.get(tableName);
//		dtOperatorSel.setShowDeleted(true);
		dtOperatorSel.afterLast();
		while (dtOperatorSel.previous()) {
			Integer selField = dtOperatorSel.getInt(selectName);
			if (null != selField && selField == 1) {
				dtOperatorSel.delete();
			}
		}
//		dtOperatorSel.setShowDeleted(false);
		return dtOperatorSel;
	}
}
