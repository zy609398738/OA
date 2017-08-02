package com.bokesoft.oa.mid.wf.base;

import java.util.HashMap;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.meta.bpm.process.ProcessDefinitionProfile;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程设计
 * 
 * @author minjian
 *
 */
public class WorkflowDesigne extends BillBase {
	/**
	 * 流程定义
	 */
	private Workflow workflow;

	/**
	 * 流程定义
	 * 
	 * @return 流程定义
	 */
	public Workflow getWorkflow() {
		return workflow;
	}

	/**
	 * 流程定义
	 * 
	 * @param workflow
	 *            流程定义
	 */
	public void setWorkflow(Workflow workflow) {
		this.workflow = workflow;
	}

	/**
	 * 流程标识
	 */
	private String workflowKey;

	/**
	 * 流程标识
	 * 
	 * @return 流程标识
	 */
	public String getWorkflowKey() {
		return workflowKey;
	}

	/**
	 * 流程标识
	 * 
	 * @param workflowKey
	 *            流程标识
	 */
	public void setWorkflowKey(String workflowKey) {
		this.workflowKey = workflowKey;
	}

	/**
	 * 流程版本
	 */
	private Integer workflowVersion;

	/**
	 * 流程版本
	 * 
	 * @return 流程版本
	 */
	public Integer getWorkflowVersion() {
		return workflowVersion;
	}

	/**
	 * 流程版本
	 * 
	 * @param workflowVersion
	 *            流程版本
	 */
	public void setWorkflowVersion(Integer workflowVersion) {
		this.workflowVersion = workflowVersion;
	}

	/**
	 * 获得流程文件的标识
	 * 
	 * @return 流程文件的标识
	 */
	public String getProfileKey() {
		return getWorkflowKey() + "_V" + getWorkflowVersion();
	}

	/**
	 * 流程配置对象
	 * 
	 * @return 流程配置对象
	 */
	private ProcessDefinitionProfile profile;

	/**
	 * 流程配置对象
	 * 
	 * @param profile
	 *            流程配置对象
	 */
	public void setProfile(ProcessDefinitionProfile profile) {
		this.profile = profile;
	}

	/**
	 * 流程配置对象
	 * 
	 * @return 流程信息对象
	 * @throws Throwable
	 */
	public ProcessDefinitionProfile getProfile() throws Throwable {
		if (profile == null) {
			profile = getProfile(getProfileKey());
		}
		return profile;
	}

	/**
	 * 根据流程文件的标识获得流程配置对象
	 * 
	 * @param workflowKey
	 *            流程文件的标识
	 * @return 流程信息对象
	 * @throws Throwable
	 */
	public ProcessDefinitionProfile getProfile(String profileKey) throws Throwable {
		// 取流程配置对象
		MetaBPM metaBPM = getContext().getContext().getVE().getMetaFactory().getMetaBPM();
		// 获得所有流程的集合
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		return profileMap.get(profileKey);
	}

	/**
	 * 标签1
	 */
	private String tag1;

	/**
	 * 标签1
	 * 
	 * @return 标签1
	 */
	public String getTag1() {
		return tag1;
	}

	/**
	 * 标签1
	 * 
	 * @param tag1
	 *            标签1
	 */
	public void setTag1(String tag1) {
		this.tag1 = tag1;
	}

	/**
	 * 标签2
	 */
	private String tag2;

	/**
	 * 标签2
	 * 
	 * @return 标签2
	 */
	public String getTag2() {
		return tag2;
	}

	/**
	 * 标签2
	 * 
	 * @param tag2
	 *            标签2
	 */
	public void setTag2(String tag2) {
		this.tag2 = tag2;
	}

	/**
	 * 标签3
	 */
	private String tag3;

	/**
	 * 标签3
	 * 
	 * @return 标签3
	 */
	public String getTag3() {
		return tag3;
	}

	/**
	 * 标签3
	 * 
	 * @param tag3
	 *            标签3
	 */
	public void setTag3(String tag3) {
		this.tag3 = tag3;
	}

	/**
	 * 标签4
	 */
	private String tag4;

	/**
	 * 标签4
	 * 
	 * @return 标签4
	 */
	public String getTag4() {
		return tag4;
	}

	/**
	 * 标签4
	 * 
	 * @param tag4
	 *            标签4
	 */
	public void setTag4(String tag4) {
		this.tag4 = tag4;
	}

	/**
	 * 流程设计明细集合
	 */
	private WorkflowDesigneDtlMap workflowDesigneDtlMap;

	/**
	 * 流程设计明细集合
	 * 
	 * @return 流程设计明细集合
	 * @throws Throwable
	 */
	public WorkflowDesigneDtlMap getWorkflowDesigneDtlMap() throws Throwable {
		if (workflowDesigneDtlMap == null) {
			workflowDesigneDtlMap = new WorkflowDesigneDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_WorkflowDesigne_D where OID>0 and SOID=? order by Sequence";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				workflowDesigneDtlMap.loadData(dtlDt);
			}
		}
		return workflowDesigneDtlMap;
	}

	/**
	 * 流程设计明细集合
	 * 
	 * @param workflowDesigneDtlMap
	 *            流程设计明细集合
	 */
	public void setWorkflowDesigneDtlMap(WorkflowDesigneDtlMap workflowDesigneDtlMap) {
		this.workflowDesigneDtlMap = workflowDesigneDtlMap;
	}

	/**
	 * 流程类别明细
	 */
	private WorkflowTypeDtl workflowTypeDtl;

	/**
	 * 流程类别明细
	 * 
	 * @return 流程类别明细
	 */
	public WorkflowTypeDtl getWorkflowTypeDtl() {
		return workflowTypeDtl;
	}

	/**
	 * 流程类别明细
	 * 
	 * @param workflowTypeDtl
	 *            流程类别明细
	 */
	public void setWorkflowTypeDtl(WorkflowTypeDtl workflowTypeDtl) {
		this.workflowTypeDtl = workflowTypeDtl;
	}

	/**
	 * 构造流程设计对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public WorkflowDesigne(OAContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setWorkflowKey(dt.getString("WorkflowKey"));
		setWorkflowVersion(dt.getInt("WorkflowVersion"));
		setTag1(dt.getString("Tag1"));
		setTag2(dt.getString("Tag2"));
		setTag3(dt.getString("Tag3"));
		setTag4(dt.getString("Tag4"));
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            头表数据集
	 * @param DtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getWorkflowDesigneDtlMap().loadData(dtlDt);
	}

	/**
	 * 获得流程设计的Key
	 * 
	 * @return 流程设计的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getWorkflowKey(), getWorkflowVersion(), getTag1(), getTag2(), getTag3(), getTag4());
	}

	/**
	 * 获得流程设计的Key
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowVersion
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 流程设计的Key
	 */
	public static String getSelectKey(String workflowKey, Integer workflowVersion, String tag1, String tag2,
			String tag3, String tag4) {
		StringBuffer sb = new StringBuffer();
		sb.append(workflowKey);
		sb.append(":");
		sb.append(workflowVersion);
		sb.append(":");
		sb.append(tag1);
		sb.append(":");
		sb.append(tag2);
		sb.append(":");
		sb.append(tag3);
		sb.append(":");
		sb.append(tag4);
		String key = sb.toString();
		return key;
	}

	/**
	 * 获得流程设计的Sql查询条件
	 * 
	 * @param workflowKey
	 *            流程标识
	 * @param workflowVersion
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 流程设计的Sql查询条件
	 */
	public static String getSqlWhere(String workflowKey, Integer workflowVersion, String tag1, String tag2, String tag3,
			String tag4) {
		StringBuffer sb = new StringBuffer();
		if (!StringUtil.isBlankOrNull(workflowKey)) {
			sb.append(" and WorkflowKey='");
			sb.append(workflowKey);
			sb.append("'");
		}
		if (workflowVersion > 0) {
			sb.append(" and WorkflowVersion=");
			sb.append(workflowVersion);
		}
		if (!StringUtil.isBlankOrNull(tag1)) {
			sb.append(" and Tag1='");
			sb.append(tag1);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag2)) {
			sb.append(" and Tag2='");
			sb.append(tag2);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag3)) {
			sb.append(" and Tag3='");
			sb.append(tag3);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag4)) {
			sb.append(" and Tag4='");
			sb.append(tag4);
			sb.append("'");
		}
		String key = sb.toString();
		if (!StringUtil.isBlankOrNull(key)) {
			key = key.substring(4);
		}
		return key;
	}

	/**
	 * 获得流程设计的Key
	 * 
	 * @param headDt
	 *            数据集
	 * @return 流程设计的Key
	 */
	public static String getDesigneKey(DataTable headDt) {
		return getSelectKey(headDt.getString("WorkflowKey"), headDt.getInt("WorkflowVersion"), headDt.getString("Tag1"),
				headDt.getString("Tag2"), headDt.getString("Tag3"), headDt.getString("Tag4"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，流程标识：" + getWorkflowKey() + "，流程版本：" + getWorkflowVersion() + "，标签1：" + getTag1()
				+ "，标签2：" + getTag2() + "，标签3" + getTag3() + "，标签4：" + getTag4();
	}
}
