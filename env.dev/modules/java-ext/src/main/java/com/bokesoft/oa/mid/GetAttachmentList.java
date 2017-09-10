package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据字典获取附件分层次目录
 * 
 * @author chenbiao
 *
 */
public class GetAttachmentList implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getAttachmentList(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toLong(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param itemMainTable
	 *            字典主表
	 * @param itemID
	 *            字典ID
	 * @param sep
	 *            分隔符
	 * @return 返回文件路径
	 * @throws Throwable
	 */
	public static String getAttachmentList(DefaultContext context, String itemMainTable, long itemID, String sep)
			throws Throwable {
		String sql = "select ParentID,Name from " + itemMainTable + " where oid = ?";
		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql, itemID);
		List<String> list = new ArrayList<String>();
		list.add(dtQuery.getString("Name"));
		while (dtQuery.getLong("ParentID") > 0) {
			dtQuery = dbManager.execPrepareQuery(sql, dtQuery.getLong("ParentID"));
			list.add(dtQuery.getString("Name"));
		}
		Collections.reverse(list);
		String path = "";
		for (int i = 0; i < list.size(); i++) {
			path = path + sep + list.get(i);
		}
		if (path.length() > 0) {
			path = path.substring(1);
		}
		return path;
	}
}
