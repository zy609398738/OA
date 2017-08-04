package com.bokesoft.oa.modules.todo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.bokesoft.cms2.basetools.data.PagingSearchResult;
import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
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

import cms2.spel.DataExp;

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
	 *            上下文对象
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
	 *            上下文对象
	 * @param operaId
	 *            操作员ID
	 * @return 人员ID，操作员没有对应的人员则返回-1
	 * @throws Throwable
	 */
	public static Long queryEmpIDByID(DefaultContext context, Long operaId) throws Throwable {
		Long empID = TypeConvertor.toLong(-1);
		DataTable rs;
		String sql = "select EmpID from sys_operator o join oa_employee_h e on o.EmpID=e.OID where  o.OID=" + operaId;
		rs = context.getDBManager().execPrepareQuery(sql);
		rs.beforeFirst();
		while (rs.next()) {
			empID = rs.getLong("EmpID");
		}
		return empID;
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
	 *            上下文对象
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
		String sql = "Select * from OA_Navigation_H where oid>0 and enable=1 order by OrderNum,Code";
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		dt.beforeFirst();
		while (dt.next()) {
			String entry = dt.getString("Entry");
			if (entryRights.hasEntryRights(entry)) {
				LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
				list.add(map);
				map.put("CODE", dt.getString("Code"));
				map.put("NAME", dt.getString("Name"));
				map.put("ICON", dt.getString("Icon"));
				map.put("SELICON", dt.getString("SelIcon"));
				map.put("ENTRY", entry);
				map.put("DEFOPENENTRY", dt.getString("DefOpenEntry"));
			}
		}
		return list;
	}

	/**
	 * 提交评论
	 * 
	 * @param context
	 *            上下文对象
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

	public static Boolean commitSendMessage(DefaultContext context, String operatorID, String oid, String content)
			throws Throwable {
		if (StringUtil.isBlankOrNull(operatorID)) {
			return false;
		}
		if (StringUtil.isBlankOrNull(content)) {
			return false;
		}
		Long optID = TypeConvertor.toLong(operatorID);
		Long oID = TypeConvertor.toLong(oid);
		String sql = "select Topic,Creator,BillKey,NO from OA_NewsDraft_H where OID=?";
		DataTable dtQuery1 = context.getDBManager().execPrepareQuery(sql, oid);
		String topic = dtQuery1.getString("Topic");
		String creator = TypeConvertor.toString(dtQuery1.getLong("Creator"));
		String billKey = dtQuery1.getString("BillKey");
		String no = dtQuery1.getString("NO");
		return SendMessage.sendMessage(context, false, "OA", new Date(), optID, "发表评论：" + topic, content, creator, 0L,
				billKey, no, oID);
	}

	/**
	 * 添加流程
	 * 
	 * @param context
	 *            上下文对象
	 * @param SrcDtlOID
	 *            源明细表OID
	 * @return 添加成功返回true,否则false
	 * @throws Throwable
	 */
	public static Boolean addWorkflow(DefaultContext context, String SrcDtlOID) throws Throwable {
		Long oid = context.applyNewOID();
		Long userID = context.getVE().getEnv().getUserID();
		String sql1 = "select * from OA_MyWorkflow where SrcDtlOID=? and Operator=?";
		DataTable checkDt = context.getDBManager().execPrepareQuery(sql1, SrcDtlOID, userID);
		if (checkDt.size() > 0) {
			return false;
		} else {
			String sql = "insert into OA_MyWorkflow(OID,SOID,SrcDtlOID,Operator) " + "values(?,?,?,?)";
			context.getDBManager().execPrepareUpdate(sql, oid, oid, TypeConvertor.toLong(SrcDtlOID), userID);
			return true;

		}
	}

	/**
	 * 删除流程
	 * 
	 * @param context
	 *            上下文对象
	 * @param SrcDtlOID
	 *            源明细表OID
	 * @return 删除成功返回true,否则false
	 * @throws Throwable
	 */
	public static Boolean deleteWorkflow(DefaultContext context, String SrcDtlOID) throws Throwable {
		Long userID = context.getVE().getEnv().getUserID();
		String sql1 = "select * from OA_MyWorkflow where SrcDtlOID=? and Operator=?";
		DataTable checkDt = context.getDBManager().execPrepareQuery(sql1, SrcDtlOID, userID);
		if (checkDt.size() < 0) {
			return false;
		} else {
			String sql = "delete from OA_MyWorkflow where SrcDtlOID=? and Operator=?";
			context.getDBManager().execPrepareUpdate(sql, TypeConvertor.toLong(SrcDtlOID), userID);
			return true;

		}
	}

	/**
	 * 获得工作流的新建流程入口数据集，
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            查询数据集的SQL语句，例如：select b.oid,b.soid,b.BillKey,b.billname from
	 *            OA_WorkflowType_D b order by OrderNum_D,Sequence
	 * @param entry
	 *            菜单入口路径，例如：OABusiness/OA/ExtendBus
	 * @return 判断了入口权限的新建流程入口数据集
	 * @throws Throwable
	 */
	public static List<Map<String, Object>> getWorkflowEntry(DefaultContext context, String sql, String entry)
			throws Throwable {
		IRightsProviderFactory iRghProFac = RightsProviderFactory.getInstance();
		MidVE midVe = context.getVE();
		IRightsProvider iRghProvider = iRghProFac.newRightsProvider(midVe);
		EntryRights entryRights = iRghProvider.getEntryRights();
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		dt.beforeFirst();
		while (dt.next()) {
			String billKey = dt.getString("BillKey");
			entry = entry + "/" + billKey;
			if (entryRights.hasEntryRights(entry)) {
				LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
				list.add(map);
				map.put("OID", dt.getLong("OID"));
				map.put("SOID", dt.getLong("SOID"));
				map.put("BILLNAME", dt.getString("BillName"));
				map.put("BILLKEY", dt.getString("BillKey"));
			}
		}
		return list;
	}

	public static List<Map<String, Object>> queryListByTop(DefaultContext context, String sql, Object pageSize)
			throws Throwable {
		PagingSearchResult<List<Map<String, Object>>> psr = DataExp.PagingQuery(sql, pageSize, 0);
		return psr.getData();
	}

	public static int getDBType(DefaultContext context) throws Throwable {
		int dbType = context.getDBManager().getDBType();
		return dbType;
	}

	/**
	 * 获得任务状态列表
	 * 
	 * @param context
	 *            上下文对象
	 * @param operatorID
	 *            操作员ID
	 * @return 以json的形式返回带树状结构的任务状态列表
	 * @throws Throwable
	 */
	public static String getTaskStatus(DefaultContext context, Long operatorID) throws Throwable {
		JSONObject rows = new JSONObject();
		String sql = "select h.* from OA_Taskdistribution_H h join sys_operator o on o.empid=h.empid where h.status>1000 and h.SourceOID<=0 and o.oid=?";
		DataTable taskDt = context.getDBManager().execPrepareQuery(sql, operatorID);
		Integer level = 0;
		Integer left = 0;
		taskDt.beforeFirst();
		while (taskDt.next()) {
			left = left + 1;
			JSONObject json = new JSONObject();
			rows.append("rows", json);
			Long oid = taskDt.getLong("OID");
			json.append("category_id", oid);
			json.append("name", taskDt.getString("Topic"));
			json.append("lft", left);
			json.append("level", level);
			json.append("persent", "0%");
			Integer childrenSize = getChildrenTaskStatus(context, rows, json, level, left, oid);
			json.append("childrenSize", childrenSize);
			Integer right = left + childrenSize * 2 + 1;
			json.append("rgt", right);
			json.append("tast_num", 0);
			json.append("publishDate", "");
			json.append("rgt", 2);
			json.append("uiicon", "");
		}
		String rowsStr = rows.toString();
		return rowsStr;
	}

	public static Integer getChildrenTaskStatus(DefaultContext context, JSONObject rows, JSONObject parentJson,
			Integer parentLevel, Integer parentLeft, Long parentOid) throws Throwable {
		Integer level = parentLevel + 1;
		Integer left = parentLeft;

		String sql = "select h.* from OA_Taskdistribution_H h where h.SourceOID=?";
		DataTable taskDt = context.getDBManager().execPrepareQuery(sql, parentOid);
		Integer size = taskDt.size();
		if (size <= 0) {
			return size;
		}
		Integer approved = 0;
		taskDt.beforeFirst();
		while (taskDt.next()) {
			left = left + 1;
			JSONObject json = new JSONObject();
			rows.append("rows", json);
			Long oid = taskDt.getLong("OID");
			json.append("category_id", oid);
			json.append("name", taskDt.getString("Topic"));
			json.append("lft", left);
			json.append("level", level);
			json.append("persent", "0%");
			Integer childrenSize = getChildrenTaskStatus(context, rows, json, level, left, oid);
			json.append("childrenSize", childrenSize);
			Integer right = left + childrenSize * 2 + 1;
			Integer status = taskDt.getInt("Status");
			if (status == 1200) {
				approved = approved + 1;
			}
			json.append("rgt", right);
			json.append("tast_num", 0);
			json.append("publishDate", "");
			json.append("uiicon", "");
		}
		if (approved > 0) {
			BigDecimal persent = new BigDecimal(approved).divide(new BigDecimal(size), 2, RoundingMode.HALF_UP)
					.multiply(new BigDecimal(100));
			parentJson.put("persent", persent.intValue() + "%");
		}

		return size;
	}
}
