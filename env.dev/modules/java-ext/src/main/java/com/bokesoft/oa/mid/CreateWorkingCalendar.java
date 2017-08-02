package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkingCalendar;
import com.bokesoft.oa.mid.wf.base.WorkingCalendarDtlMap;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 生成工作日历
 * 
 * @author chenbiao
 *
 */
public class CreateWorkingCalendar implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return createWorkingCalendar(paramDefaultContext);
	}

	/**
	 * 生成工作日历
	 * 
	 * @param context
	 *            上下文对象
	 * @param startDate
	 *            开始日期
	 * @param endDate
	 *            结束日期
	 * @return 返回结果为true
	 * @throws Throwable
	 */
	public DataTable createWorkingCalendar(DefaultContext context) throws Throwable {
		// 通过上下文获取Document
		OAContext oaContext = new OAContext(context);
		Document doc = context.getDocument();
		Long billID = doc.getOID();
		WorkingCalendar workingCalendar = new WorkingCalendar(oaContext);
		DataTable headDt = doc.get("OA_WorkingCalendar_H");
		workingCalendar.loadData(headDt);
		Date startDate = workingCalendar.getStartDate();
		Date endDate = workingCalendar.getEndDate();
		WorkingCalendarDtlMap workingCalendarDtlMap = workingCalendar.getWorkingCalendarDtlMap();
		List<Date> clendarDate = getDatesBetweenTwoDate(startDate, endDate);
		// 创建数据对象
		MetaDataObject MDDo = MetaFactory.getGlobalInstance().getDataObject("OA_WorkingCalendar");
		// 通过数据对象,创建Document对象
		Document MDDoc = DocumentUtil.newDocument(MDDo);
		DataTable dt = MDDoc.get("OA_WorkingCalendar_D");
		Calendar cal = Calendar.getInstance();
		List<Integer> weekendList = workingCalendar.getWorkingTime().getWeekendList();
		// 如果为空，插入，否则更新
		if (workingCalendarDtlMap.size() <= 0) {
			MDDoc.setNew();
			for (int i = 0; i < clendarDate.size(); i++) {
				dt.append();
				dt.setDateTime("DateOfYear", clendarDate.get(i));
				cal.setTime(TypeConvertor.toDate(clendarDate.get(i)));
				// 每周固定休息日
				for (Integer weekend : weekendList) {
					if (cal.get(Calendar.DAY_OF_WEEK) == weekend) {
						dt.setInt("OffDay", 1);
					}
				}
			}
		} else {
			MDDoc.setModified();
			LoadData loadData = new LoadData("OA_WorkingCalendar", billID);
			DefaultContext newContext = new DefaultContext(context);
			MDDoc = loadData.load(newContext, MDDoc);
			dt = MDDoc.get("OA_WorkingCalendar_D");

			dt.beforeFirst();
			dt.setShowDeleted(true);
			while (dt.next()) {
				if (clendarDate.get(0).after(dt.getDateTime("DateOfYear")) 
						|| (dt.getDateTime("DateOfYear")).after(clendarDate.get(clendarDate.size() - 1))) {
					dt.delete();
				}
			}
			dt.setShowDeleted(false);
			if (dt.isEmpty()) {
				for (int i = 0; i < clendarDate.size(); i++) {
					dt.append();
					dt.setDateTime("DateOfYear", clendarDate.get(i));
					cal.setTime(TypeConvertor.toDate(clendarDate.get(i)));
					// 每周固定休息日
					for (Integer weekend : weekendList) {
						if (cal.get(Calendar.DAY_OF_WEEK) == weekend) {
							dt.setInt("OffDay", 1);
						}
					}
				}
			} else {
				dt.first();
				Date s = dt.getDateTime("DateOfYear");
				for (int i = 0; i < clendarDate.size(); i++) {

					if (s.after(clendarDate.get(i))) {
						dt.insert();
						dt.setDateTime("DateOfYear", clendarDate.get(i));
						cal.setTime(TypeConvertor.toDate(clendarDate.get(i)));
						// 每周固定休息日
						for (Integer weekend : weekendList) {
							if (cal.get(Calendar.DAY_OF_WEEK) == weekend) {
								dt.setInt("OffDay", 1);
							}
						}
						dt.next();
					}
				}
				dt.last();
				Date ss = dt.getDateTime("DateOfYear");
				for (int i = 0; i < clendarDate.size(); i++) {
					if (ss.before(clendarDate.get(i))) {
						dt.append();
						dt.setDateTime("DateOfYear", clendarDate.get(i));
						cal.setTime(TypeConvertor.toDate(clendarDate.get(i)));
						// 每周固定休息日
						for (Integer weekend : weekendList) {
							if (cal.get(Calendar.DAY_OF_WEEK) == weekend) {
								dt.setInt("OffDay", 1);
							}
						}
					}
				}
			}
		}
		DocumentUtil.calcSequence(MDDoc);
		return dt;
	}

	/**
	 * 根据开始时间和结束时间返回时间段内的时间集合
	 * 
	 * @param startDate
	 *            开始日期
	 * @param endDate
	 *            结束日期
	 * @return 开始时间和结束时间返回时间段内的时间数组
	 */
	public static List<Date> getDatesBetweenTwoDate(Date startDate, Date endDate) {
		List<Date> clendarDateL = new ArrayList<Date>();
		clendarDateL.add(startDate);// 把开始时间加入集合
		Calendar cal = Calendar.getInstance();
		// 使用给定的 Date 设置此 Calendar 的时间
		cal.setTime(startDate);
		boolean bContinue = true;
		while (bContinue) {
			// 根据日历的规则，为给定的日历字段添加或减去指定的时间量
			cal.add(Calendar.DAY_OF_MONTH, 1);
			// 测试此日期是否在指定日期之后
			if (endDate.after(cal.getTime())) {
				clendarDateL.add(cal.getTime());
			} else {
				break;
			}
		}
		clendarDateL.add(endDate);// 把结束时间加入集合
		return clendarDateL;
	}

}
