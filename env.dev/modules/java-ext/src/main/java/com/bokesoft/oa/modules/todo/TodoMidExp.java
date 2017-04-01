package com.bokesoft.oa.modules.todo;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.oa.mid.message.SendMessage;
import com.bokesoft.r2.cms2.adapter.yigo2.support.Yigo2MidExp;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yes.mid.base.MidVE;
import com.bokesoft.yes.struct.rights.EntryRights;
import com.bokesoft.yes.tools.rights.IRightsProvider;
import com.bokesoft.yes.tools.rights.IRightsProviderFactory;
import com.bokesoft.yes.tools.rights.RightsProviderFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TodoMidExp {

	public static Integer ReadCount(DefaultContext context, Long operatorID, String listType, String whereCause) {
		DataTable rs;
		Integer count = 0;
		String sql = "";
		if (listType.equalsIgnoreCase("todolist")) {// 待办事项
			sql = "SELECT count(*) as count FROM ( SELECT BPM_Instance.ProcessKey AS ProcessKey,BPM_Instance.formkey AS formkey,BPM_Instance.oid AS oid,"
					+ "bpm_workiteminfo.ParentWorkitemID,Topic,EmpID,DeptID,BillStatus,BillCreatTime,WF_Workitem.workItemID,WF_Workitem.workItemName FROM WF_Workitem "
					+ "JOIN WF_Participator ON WF_Workitem.WorkitemID = WF_Participator.WorkitemID "
					+ "JOIN BPM_Log ON WF_Workitem.WorkitemID = BPM_Log.WorkitemID "
					+ "JOIN bpm_workiteminfo ON wf_workitem.WorkitemID = bpm_workiteminfo.WorkitemID "
					+ "JOIN BPM_Instance ON BPM_Log.instanceID = BPM_Instance.instanceID "
					+ "JOIN BPM_Migration ON BPM_Instance.OID = BPM_Migration.BillOID"
					+ " WHERE  WF_Participator.OperatorID=" + operatorID + ") h";
		} else if (listType.equalsIgnoreCase("toreadlist")) {// 待阅
			sql = "Select count(r.BillID) as count From wf_read r  Left Join WF_WFList wf "
					+ " on r.BillID = wf.BillID Where r.Status=0 and readuser= " + operatorID;
		} else if (listType.equalsIgnoreCase("rejectlist")) {// 驳回
			sql = "select count(WF_Instance.instanceid) as count from WF_Instance "
					+ " left join (select max(workitemid) as workitemid,InstanceID from WF_WorkItem "
					+ " group by InstanceID) item on (item.InstanceID=WF_Instance.InstanceID)  "
					+ " left join WF_InstanceDoc insdoc on item.InstanceID=insdoc.instanceid "
					+ " left join wf_wflist wf on insdoc.billid=wf.billid "
					+ " where  WF_Instance.Instancestate=-1 and WF_Instance.CreatorID=" + operatorID;

		} else if (listType.equalsIgnoreCase("donelist")) {// 已办
			sql = "select count(ins.instanceid)  as count from wf_instance ins"
					+ " left join WF_InstanceDoc insdoc on ins.InstanceID=insdoc.instanceid "
					+ " left join wf_wflist wf on insdoc.billid=wf.billid " + " where ins.instancestate = 0 and "
					+ " ins.InstanceID In(Select InstanceID From WF_WorkItem Where WorkItemID "
					+ " In(Select WorkItemID From WF_WorkItem Where WorkItemState=2 and UserID= " + operatorID + " ))";

		} else if (listType.equalsIgnoreCase("didlist")) {// 已办含驳回，给南京项目用
			sql = "select count(ins.instanceid)  as count from wf_instance ins"
					+ " left join WF_InstanceDoc insdoc on ins.InstanceID=insdoc.instanceid "
					+ " left join wf_wflist wf on insdoc.billid=wf.billid " + " where ins.instancestate in (-1,0) and "
					+ " ins.InstanceID In(Select InstanceID From WF_WorkItem Where WorkItemID "
					+ " In(Select WorkItemID From WF_WorkItem Where WorkItemState=2 and UserID= " + operatorID + " ))";

		}
		if (!sql.isEmpty() && whereCause != null) {
			sql = sql + whereCause;
		}
		try {

			rs = context.getDBManager().execPrepareQuery(sql);
			rs.beforeFirst();
			while (rs.next()) {
				count = rs.getInt("count");
			}

		} catch (Throwable e) {
			e.printStackTrace();
		}
		return count;
	}

	/**
	 * 查询会议安排列表
	 * 
	 * @throws Throwable
	 */
	public static void queryMeeting(DefaultContext context) throws Throwable {
		CmsActionContext ctx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		Long operatorId = Yigo2MidExp.GetLoginOperator();
		DataTable rs;
		String sql = "select a.Topic, a.OID,a.EmpID,a.DeptID,a.MeetingRoom,a.MeetingType,a.StartTime,a.EndTime,a.Status,a.AllDay "
				+ "from OA_MeetingInSide_h a LEFT JOIN sys_operator sys on sys.EmpID=a.EmpID where sys.OID="
				+ operatorId;
		StringBuffer meetingBuffer = new StringBuffer();
		rs = context.getDBManager().execPrepareQuery(sql);
		meetingBuffer.append("{'evts':[");
		rs.beforeFirst();
		while (rs.next()) {
			int id = rs.getInt("OID");
			int cid = 0;
			String title = rs.getString("Topic");
			boolean ad = rs.getInt("allday") == 1 ? true : false;
			String starttime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(rs.getDateTime("StartTime"));
			String endtime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(rs.getDateTime("EndTime"));
			long end = 0;
			end = rs.getDateTime("EndTime").getTime();
			if (new Date().getTime() > end) {
				cid = 4;
			}
			meetingBuffer.append("{'id' : ").append(id).append(",").append("'cid' : ").append(cid).append(",")
					.append("'title' : '").append(title).append("',").append("'ad' : ").append(ad).append(",")
					.append("'startdt' :").append("makeDate('").append(starttime).append("')").append(",")
					.append("'enddt' :").append("makeDate('").append(endtime).append("')").append("},");
		}
		String result = meetingBuffer.substring(0, meetingBuffer.length() - 1) + "]}";
		ctx.setData(result);
		ctx.setViewer("text");
	}

	public static String queryUserNameByID(DefaultContext context, Long operaId) throws Throwable {
		String username = "";
		DataTable rs;
		String sql = "select name from SYS_Operator where oid=" + operaId;
		rs = context.getDBManager().execPrepareQuery(sql);
		rs.beforeFirst();
		while (rs.next()) {
			username = rs.getString("Name");
		}
		return username;
	}

	/**
	 * 根据操作员ID获得操作员代码
	 * 
	 * @param context
	 *            中间层对象
	 * @param operaId
	 *            操作员ID
	 * @return 操作员代码
	 * @throws Throwable
	 */
	public static String queryUserCodeByID(DefaultContext context, Long operaId) throws Throwable {
		String userCode = "";
		DataTable rs;
		String sql = "select code from SYS_Operator where oid=" + operaId;
		rs = context.getDBManager().execPrepareQuery(sql);
		rs.beforeFirst();
		while (rs.next()) {
			userCode = rs.getString("code");
		}
		return userCode;
	}

	/**
	 * 根据操作员ID获得人员ID
	 * 
	 * @param context
	 *            中间层对象
	 * @param operaId
	 *            操作员ID
	 * @return 人员ID，操作员没有对应的人员则返回-1
	 * @throws Throwable
	 */
	public static Long queryEmpIDByID(DefaultContext context, Long operaId) throws Throwable {
		Long EmpID = TypeConvertor.toLong(-1);
		DataTable rs;
		String sql = "select EmpID from sys_operator o join oa_employee_h e on o.EmpID=e.OID where  o.OID=" + operaId;
		rs = context.getDBManager().execPrepareQuery(sql);
		rs.beforeFirst();
		while (rs.next()) {
			EmpID = rs.getLong("EmpID");
		}
		return EmpID;
	}

	public static void querySchedulePlans(DefaultContext context) {
		CmsActionContext ctx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		String result = "{'evts':[";
		Long operatorId = Yigo2MidExp.GetLoginOperator();
		DataTable rs;
		try {
			String sql = "SELECT * from OA_MySchedule_H where Creator=" + operatorId;
			rs = context.getDBManager().execPrepareQuery(sql);
			rs.beforeFirst();
			while (rs.next()) {
				Long id = rs.getLong("OID");
				String title = rs.getString("Topic");
				Long calendartype = rs.getLong("ScheduleType");
				Long createname = rs.getLong("Creator");
				Long createdept = rs.getLong("DeptID");
				String createdate = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(rs.getDateTime("CreateTime"));
				String startdate = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(rs.getDateTime("StartTime"));
				String enddate = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(rs.getDateTime("EndTime"));
				String content = rs.getString("Document");
				int allday = rs.getInt("IsAllDay");
				result += "{'id': '" + id + "','content': '" + content + "','begin': '" + startdate + "','end': '"
						+ enddate + "','cid':'1','title':'" + title + "','calendartype':'" + calendartype
						+ "','createname':'" + createname + "','createdept':'" + createdept + "',createdate:new Date('"
						+ createdate + "'),'ad':" + allday + ",'remtype':'1,2,3',startdt:new Date('" + startdate
						+ "'),enddt:new Date('" + enddate + "')},";
			}
			result = result.substring(0, result.length() - 1) + "]}";
			ctx.setData(result);
			ctx.setViewer("text");
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	/**
	 * 根据当前用户的入口权限获得导航栏
	 * 
	 * @param Context
	 *            中间层对象
	 * @param moduleKey
	 *            工程模块的标识
	 * @return 有权限返回true,否则false
	 * @throws Throwable
	 */
	public static List<Map<String, Object>> getNavBar(DefaultContext context, String moduleKey) throws Throwable {
		IRightsProviderFactory iRghProFac = RightsProviderFactory.getInstance();
		MidVE midVe = context.getVE();
		IRightsProvider iRghProvider = iRghProFac.newRightsProvider(midVe);
		EntryRights entryRights = iRghProvider.getEntryRights();

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		Settings settings = Configuration.getConfiguration(moduleKey).getMap("Navigation");
		for (Settings nav : settings.getMapValues()) {
			String entry = nav.getProperty("Entry");
			if (entryRights.hasEntryRights(entry)) {
				LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
				list.add(map);
				map.put("CODE", nav.getName());
				map.put("NAME", nav.getProperty("Name"));
				map.put("ICON", nav.getPropertyOrEmpty("Icon"));
				map.put("SELICON", nav.getPropertyOrEmpty("SelIcon"));
				map.put("ENTRY", entry);
				map.put("OPENENTRY", nav.getPropertyOrEmpty("OpenEntry"));
			}

		}
		return list;
	}

	/**
	 * 提交评论
	 * 
	 * @param context
	 *            中间层对象
	 * @param oid
	 *            单据ID
	 * @param operatorID
	 *            操作员ID
	 * @return 提交完成返回true
	 * @throws Throwable
	 */
	public static Boolean commitComment(DefaultContext context, String oid, String operatorID, String content)
			throws Throwable {
		if (StringUtil.isBlankOrNull(operatorID)) {
			return false;
		}
		if (StringUtil.isBlankOrNull(content)) {
			return false;
		}
		String sql = "Insert into OA_CommentContent (OID,SOID,POID,VERID,DVERID,Commentators,SrcBillOID,RemarkContent,CommentTime) values (?,?,null,0,0,?,?,?,?)";
		context.getDBManager().execPrepareUpdate(sql, context.applyNewOID(), oid, operatorID, oid, content, new Date());
		return true;
	}
	
	public static Boolean commitSendMessage(DefaultContext context, String operatorID,String oid,String content)throws Throwable {
		if (StringUtil.isBlankOrNull(operatorID)) {
			return false;
		}
		if (StringUtil.isBlankOrNull(content)) {
			return false;
		}
		Long optID=TypeConvertor.toLong(operatorID);
		Long oID=TypeConvertor.toLong(oid);
		String sql="select Topic,Creator,BillKey,NO from OA_NewsDraft_H where OID=?";
		DataTable dtQuery1 = context.getDBManager().execPrepareQuery(sql, oid);
		String topic=dtQuery1.getString("Topic");
		String creator=TypeConvertor.toString(dtQuery1.getLong("Creator"));
		String billKey=dtQuery1.getString("BillKey");
		String no=dtQuery1.getString("NO");
		return SendMessage.sendMessage(context, false, "OA", new Date(), optID, "发表评论："+topic, content, creator, -1L, billKey, no, oID);
	}
	
}
