package com.bokesoft.oa.mid.wf;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.schedule.DefaultScheduleJob;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 设置固有事项提醒任务
 * 
 * @author zhoukh
 *
 */
public class ItemRemind extends DefaultScheduleJob {
	public final static String EVERY_DAY = "Everyday";
	public final static String EVERY_WEEK = "Everyweek";
	public final static String EVERY_MONTH = "Everymonth";
	public final static String EVERY_YEAR = "Everyyear";
	public final static String EVERY_YEAR_Day = "EveryYearDay";

	@Override
	public void doJob(DefaultContext context, Map<String, Object> arg1) throws Throwable {
		Calendar c = Calendar.getInstance();
		int month = c.get(Calendar.MONTH) + 1;
		int date = c.get(Calendar.DATE);
		int hour = c.get(Calendar.HOUR_OF_DAY);
		int week = c.get(Calendar.DAY_OF_WEEK) - 1;
		SimpleDateFormat format = new SimpleDateFormat("dd");
		c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
		int lastday = Integer.parseInt(format.format(c.getTime()));
		String sql = "select * from OA_InherentRemind";
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_ItemRemind");
		Document d = DocumentUtil.newDocument(metaDataObject);
		DataTable targetTable = d.get("OA_ItemRemind");
		dt.beforeFirst();
		Boolean isSet = false;
		while (dt.next()) {
			int setType = dt.getInt("SetType");
			Long oid = dt.getLong("OID");
			d.setNew();
			if (setType == 10) {
				int everyDay = dt.getInt(EVERY_DAY);
				if (everyDay == hour) {
					isSet = setValue(context, dt, targetTable, oid);
					if (isSet) {
						SaveData saveData = new SaveData(metaDataObject, null, d);
						saveData.save(context);
						context.commit();
					}
				}
			} else if (setType == 20) {
				int everyWeek = dt.getInt(EVERY_WEEK);
				if (everyWeek == week) {
					isSet = setValue(context, dt, targetTable, oid);
				}
			} else if (setType == 30) {
				int everyMonth = dt.getInt(EVERY_MONTH);
				if (everyMonth == 32) {
					if (lastday == date) {
						isSet = setValue(context, dt, targetTable, oid);
					}
				} else if (everyMonth == date) {
					isSet = setValue(context, dt, targetTable, oid);
				}
			} else if (setType == 40) {
				int everyYear = dt.getInt(EVERY_YEAR);
				int everyYearDay = dt.getInt(EVERY_YEAR_Day);
				if (everyYear == month && date == everyYearDay) {
					isSet = setValue(context, dt, targetTable, oid);
				}
			}
		}
		if (isSet) {
			DefaultContext newContext = new DefaultContext(context);
			SaveData saveData = new SaveData(metaDataObject, null, d);
			saveData.save(newContext);
			newContext.commit();
		}
	}

	/**
	 * 
	 * @param context
	 *            上下文对象
	 * @param dt
	 *            事项提醒表 OA_InherentRemind
	 * @param targetTable
	 *            事项提醒数据对象表 OA_ItemRemind
	 * @param oid
	 *            事项提醒表oid
	 * @return 成功返回true
	 * @throws Throwable
	 */
	public Boolean setValue(DefaultContext context, DataTable dt, DataTable targetTable, Long oid) throws Throwable {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		String str = format.format(date);
		Date newDate = format.parse(str);
		IDBManager dbManager = context.getDBManager();
		String checkVerid = "select OptIDs,VerID,ModifyTime,IsOne from OA_InherentRemind where oid = ?";
		DataTable checkDt = context.getDBManager().execPrepareQuery(checkVerid, oid);
		int sourceVerID = checkDt.getInt("VERID");
		String optIDs = checkDt.getString("OptIDs");
		Date modifyTime = checkDt.getDateTime("ModifyTime");
		String sql = "select * from OA_ItemRemind where SourceOID = ?";
		DataTable matchDt = context.getDBManager().execPrepareQuery(sql, oid);
		int verID = targetTable.getInt("VERID");
		if (matchDt.size() > 0 && sourceVerID == verID) {
			return false;
		} else if (matchDt.size() > 0 && sourceVerID != verID) {

			String updateSql = "update OA_ItemRemind set OptIDs=?,VERID=?,CreateDate=? where SourceOID = ?";
			dbManager.execPrepareUpdate(updateSql, optIDs, sourceVerID, modifyTime, oid);
			context.commit();
			return false;
		}
		getOptIDs(context, dt, targetTable, newDate, optIDs);
		return true;

	}

	public void getOptIDs(DefaultContext context, DataTable dt, DataTable targetTable, Date newDate,
			String participator) throws Throwable {
		targetTable.setLong("WorkflowType", dt.getLong("WorkflowType"));
		targetTable.setString("FormKey", dt.getString("FormKey"));
		targetTable.setLong("BillOid", 0L);
		targetTable.setString("OptIDs", participator);
		targetTable.setString("BillName", dt.getString("BillName"));
		targetTable.setString("SourceName", dt.getString("Name"));
		long srcOID = context.applyNewOID();
		targetTable.setLong("OID", srcOID);
		targetTable.setLong("SOID", srcOID);
		targetTable.setLong("SourceOID", dt.getLong("OID"));
		targetTable.setLong("SourceCreator", dt.getLong("Creator"));
		targetTable.setInt("VERID", dt.getInt("VERID"));
		targetTable.setInt("Status", 0);
		targetTable.setDateTime("CreateDate", newDate);
	}
}
