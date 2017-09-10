package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 复制选中的数据行到另一个数据表
 * 
 * @author minjian
 *
 */
public class CopySelectRow implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return copySelectRow(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)),
				TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)),
				TypeConvertor.toString(paramArrayList.get(5)), TypeConvertor.toString(paramArrayList.get(6)));
	}

	/**
	 * 复制选中的数据行到另一个数据表
	 * 
	 * @param context
	 *            上下文对象
	 * @param srcTableName
	 *            来源数据表名
	 * @param srcSelectName
	 *            来源的选择字段名
	 * @param srcFieldName
	 *            来源的关键字段名
	 * @param srcNames
	 *            来源要复制的字段名字符串，以“:”分隔
	 * @param tgtTableName
	 *            目标数据表名
	 * @param tgtFieldName
	 *            目标关键字段名
	 * @param tgtNames
	 *            目标接受复制数据的字段名字符串，以“:”分隔
	 * @return 复制后的数据表对象
	 * @throws Throwable
	 */
	public DataTable copySelectRow(DefaultContext context, String srcTableName, String srcSelectName,
			String srcFieldName, String srcNames, String tgtTableName, String tgtFieldName, String tgtNames)
			throws Throwable {
		Document doc = context.getDocument();
		DataTable srcDt = doc.get(srcTableName);
		DataTable tgtDt = doc.get(tgtTableName);
		Set<String> tgtSet = new HashSet<String>();
		tgtDt.beforeFirst();
		while (tgtDt.next()) {
			tgtSet.add(TypeConvertor.toString(tgtDt.getObject(tgtFieldName)));
		}
		srcDt.beforeFirst();
		String[] srcArray = srcNames.split(":");
		String[] tgtArray = tgtNames.split(":");
		while (srcDt.next()) {
			Integer selField = srcDt.getInt(srcSelectName);
			if (null != selField && selField == 1) {
				String srcValue = TypeConvertor.toString(srcDt.getObject(srcFieldName));
				if (!tgtSet.contains(srcValue)) {
					tgtDt.append();
					for (int i = 0; i < srcArray.length; i++) {
						tgtDt.setObject(tgtArray[i], srcDt.getObject(srcArray[i]));
					}
				}
			}
		}
		return tgtDt;
	}
}
