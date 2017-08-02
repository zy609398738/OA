package com.bokesoft.oa.mid;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 判断OptIDs是否包含指定人员对应的OptID
 * 
 * @author chenbiao
 * 
 */
public class JudgeScheduleTime implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return judgeScheduleTime(paramDefaultContext);
	}

	private String judgeScheduleTime(DefaultContext context) throws Throwable {
		// 通过上下文获取Document
		Document doc = context.getDocument();
		// 通过Document获取数据源
		DataTable DT = doc.get("OA_MeetingInSide_H");
		String optIDs = DT.getString("Participants");// 获取参与者IDs
		Long moderator = DT.getLong("Moderator");// 获取主持人ID
		Long recorder = DT.getLong("Recorder");// 获取纪要人员ID
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String startTime = formatter.format(DT.getDateTime("StartTime"));
		String endTime = formatter.format(DT.getDateTime("EndTime"));
		String sql1 = "select count(oid) sum from (select oid from OA_MySchedule_H a where a.EmpID=? AND ((a.StartTime>? and a.StartTime<?) or (a.EndTime>? and a.EndTime<?) or(a.StartTime<? and a.EndTime>?)))j";
		String sql2 = "select Name from SYS_Operator where empID=?";
		IDBManager dbManager = context.getDBManager();
		DataTable dtQueryModeratorSum = dbManager.execPrepareQuery(sql1, moderator, startTime, endTime, startTime,
				endTime, startTime, endTime);
		String errMesg = "";
		if (dtQueryModeratorSum.getInt("sum") > 0) {
			errMesg = "会议主持人已有日程安排";
		} else {
			DataTable dtQueryRecorderSum = dbManager.execPrepareQuery(sql1, recorder, startTime, endTime,
					startTime, endTime, startTime, endTime);
			if (dtQueryRecorderSum.getInt("sum") > 0) {
				errMesg = "会议纪要人员已有日程安排";
			} else {
				String[] OptIDs = optIDs.split(",");
				Long[] OptIDsL = new Long[OptIDs.length];
				for (int idx = 0; idx < OptIDs.length; idx++) {
					OptIDsL[idx] = Long.parseLong(OptIDs[idx]);
				}
				int i = 0;
				while (i < OptIDs.length) {
					DataTable dtQueryOPtIDsSum = dbManager.execPrepareQuery(sql1, OptIDs[i], startTime, endTime,
							startTime, endTime, startTime, endTime);
					if (dtQueryOPtIDsSum.getInt("sum") > 0) {
						DataTable dtQuery =dbManager.execPrepareQuery(sql2, OptIDs[i]);
						String name =dtQuery.getString("Name") ;
						errMesg ="参与者："+name  + ", 已有日程安排";
						break;
					}
					i++;
				}
			}
		}

		return errMesg;
	}

}
