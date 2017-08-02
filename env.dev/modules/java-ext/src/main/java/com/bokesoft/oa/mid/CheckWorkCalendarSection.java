package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 检查工作日历工作区间是否重复
 * 
 * @author chenbiao
 *
 */
public class CheckWorkCalendarSection implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return checkWorkCalendarSection(paramDefaultContext);
	}

	/**
	 * 检查工作日历工作区间是否重复
	 * 
	 * @param context
	 *            上下文对象
	 * @throws Throwable
	 */
	public Boolean checkWorkCalendarSection(DefaultContext context) throws Throwable {
		// 通过上下文获取Document
		Document doc = context.getDocument();
		// 通过Document获取数据源(DataTable,代替了以前的BKRowset)
		DataTable workingCalendar = doc.get("OA_WorkingCalendar_H");
		Date startDate = workingCalendar.getDateTime("StartDate");
		Date endDate = workingCalendar.getDateTime("EndDate");
		String sqlForMySQL = "select count(oid) countNum from OA_WorkingCalendar_H a where((a.StartDate between ? and ?) "
				+ "or (a.EndDate between ? and ?) or(a.StartDate<=? and a.EndDate>=?)) and a.oid <> ? ";
		String sqlForOracle = "select count(oid) countNum from OA_WorkingCalendar_H a where((a.StartDate>=?"
				+ " and a.StartDate<=?) or (a.EndDate>=? and a.EndDate<=?)"
				+ " or( a.StartDate<=? and a.EndDate>=?)) and a.oid <> ?";
		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		int dbType = context.getDBManager().getDBType();
		boolean flag = true;
		switch (dbType) {
		case 2:// Oracle数据库
			DataTable dtQueryOracle = dbManager.execPrepareQuery(sqlForOracle, startDate, endDate, startDate, endDate,
					startDate, endDate, workingCalendar.getLong("OID"));
			if (dtQueryOracle.getInt("countNum") > 0) {
				flag = false;
			}
			break;
		case 4:// MySQL数据库
			DataTable dtQueryMySQL = dbManager.execPrepareQuery(sqlForMySQL, startDate, endDate, startDate, endDate,
					startDate, endDate, workingCalendar.getLong("OID"));
			if (dtQueryMySQL.getInt("countNum") > 0) {
				flag = false;
			}
			break;

		default:
			flag = false;
			throw new Exception("不支持的数据库类型");
		}
		return flag;
	}
}
