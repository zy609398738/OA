package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获得查询参与者ID的字符串
 * 
 * @author minjian
 *
 */
public class GetParticipatorIDs implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		String sourceKey = TypeConvertor.toString(paramArrayList.get(0));
		Long sourceId = TypeConvertor.toLong(paramArrayList.get(1));
		String tag1 = "";
		String tag2 = "";
		String tag3 = "";
		String tag4 = "";
		if (paramArrayList.size() > 2) {
			tag1 = TypeConvertor.toString(paramArrayList.get(2));
		} else if (paramArrayList.size() > 3) {
			tag2 = TypeConvertor.toString(paramArrayList.get(3));
		} else if (paramArrayList.size() > 4) {
			tag3 = TypeConvertor.toString(paramArrayList.get(4));
		} else if (paramArrayList.size() > 5) {
			tag4 = TypeConvertor.toString(paramArrayList.get(5));
		}

		return getParticipatorIDs(paramDefaultContext, sourceKey, sourceId, tag1, tag2, tag3, tag4);
	}

	/**
	 * 获得查询参与者ID的字符串
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @param tag1
	 *            筛选条件1
	 * @param tag2
	 *            筛选条件2
	 * @param tag3
	 *            筛选条件3
	 * @param tag4
	 *            筛选条件4
	 * @return 参与者ID的字符串
	 * @throws Throwable
	 */
	private Object getParticipatorIDs(DefaultContext context, String sourceKey, Long sourceId, String tag1, String tag2,
			String tag3, String tag4) throws Throwable {
		GetParticipatorSql getParticipatorSql = new GetParticipatorSql();
		getParticipatorSql.setContext(context);
		String participatorSql = getParticipatorSql.getParticipatorSql(sourceKey, sourceId, tag1, tag2, tag3, tag4);
		if (participatorSql.length() <= 0) {
			return "";
		}
		DataTable participatorDt = context.getDBManager().execQuery(participatorSql);
		String ids = "";
		participatorDt.beforeFirst();
		while (participatorDt.next()) {
			String optId = TypeConvertor.toString(participatorDt.getObject("OID"));
			ids = ids + "," + optId;
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}

		return ids;
	}
}
