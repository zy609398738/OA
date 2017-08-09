package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作选择
 * 
 * @author minjian
 *
 */
public class OperationSel extends BillBase {

	/**
	 * 消息设置ID
	 */
	private Long messageSetID;

	/**
	 * 消息设置ID
	 */
	public Long getMessageSetID() {
		return messageSetID;
	}

	/**
	 * 消息设置ID
	 * 
	 * @param messageSetID
	 */
	public void setMessageSetID(Long messageSetID) {
		this.messageSetID = messageSetID;
	}

	/**
	 * 消息设置
	 */
	private MessageSet messageSet;

	/**
	 * 消息设置
	 * 
	 * @return 消息设置
	 * @throws Throwable
	 */
	public MessageSet getMessageSet() throws Throwable {
		if (messageSet == null) {
			if (messageSetID > 0) {
				messageSet = getContext().getMessageSetMap().get(messageSetID);
			}
			if (messageSet == null) {
				messageSet = getWorkflowDesigneDtl().getMessageSet();
			}
		}
		return messageSet;
	}

	/**
	 * 消息设置
	 * 
	 * @param messageSet
	 *            消息设置
	 */
	public void setMessageSet(MessageSet messageSet) {
		this.messageSet = messageSet;
		setMessageSetID(messageSet.getOID());
	}

	/**
	 * 邮件模板
	 */
	private String emailTemp;

	/**
	 * 邮件模板
	 * 
	 * @return 邮件模板
	 * @throws Throwable
	 */
	public String getEmailTemp() throws Throwable {
		// 如果为空，取所在节点的邮件模板
		if (emailTemp == null) {
			emailTemp = getWorkflowDesigneDtl().getEmailTemp();
		}
		return emailTemp;
	}

	/**
	 * 邮件模板
	 * 
	 * @param emailTemp
	 *            邮件模板
	 */
	public void setEmailTemp(String emailTemp) {
		this.emailTemp = emailTemp;
	}

	/**
	 * 源表单Key
	 */
	private String sourceKey;

	/**
	 * 源表单Key
	 * 
	 * @return 源表单Key
	 */
	public String getSourceKey() {
		return sourceKey;
	}

	/**
	 * 源表单Key
	 * 
	 * @param sourceKey
	 *            源表单Key
	 */
	public void setSourceKey(String sourceKey) {
		this.sourceKey = sourceKey;
	}

	/**
	 * 源表单ID
	 */
	private long sourceID;

	/**
	 * 源表单ID
	 * 
	 * @return 源表单ID
	 */
	public long getSourceID() {
		return sourceID;
	}

	/**
	 * 源表单ID
	 * 
	 * @param sourceID
	 *            源表单ID
	 */
	public void setSourceID(long sourceID) {
		this.sourceID = sourceID;
	}

	/**
	 * 标签1
	 */
	private String Tag1;

	/**
	 * 标签1
	 * 
	 * @return 标签1
	 */
	public String getTag1() {
		return Tag1;
	}

	/**
	 * 标签1
	 * 
	 * @param tag1
	 *            标签1
	 */
	public void setTag1(String tag1) {
		Tag1 = tag1;
	}

	/**
	 * 标签2
	 */
	private String Tag2;

	/**
	 * 标签2
	 * 
	 * @return 标签2
	 */
	public String getTag2() {
		return Tag2;
	}

	/**
	 * 标签2
	 * 
	 * @param tag2
	 *            标签2
	 */
	public void setTag2(String tag2) {
		Tag2 = tag2;
	}

	private String Tag3;

	/**
	 * 标签3
	 * 
	 * @return 标签3
	 */
	public String getTag3() {
		return Tag3;
	}

	/**
	 * 标签3
	 * 
	 * @param tag3
	 *            标签3
	 */
	public void setTag3(String tag3) {
		Tag3 = tag3;
	}

	private String Tag4;

	/**
	 * 标签4
	 * 
	 * @return 标签4
	 */
	public String getTag4() {
		return Tag4;
	}

	/**
	 * 标签4
	 * 
	 * @param tag4
	 *            标签4
	 */
	public void setTag4(String tag4) {
		Tag4 = tag4;
	}

	/**
	 * 流程设计明细
	 */
	public WorkflowDesigneDtl workflowDesigneDtl;

	/**
	 * 流程设计明细
	 * 
	 * @return 流程设计明细
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl() {
		return workflowDesigneDtl;
	}

	/**
	 * 流程设计明细
	 * 
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 */
	public void setWorkflowDesigneDtl(WorkflowDesigneDtl workflowDesigneDtl) {
		this.workflowDesigneDtl = workflowDesigneDtl;
	}

	/**
	 * 操作选择明细集合
	 */
	private OperationSelDtlMap operationSelDtlMap;

	/**
	 * 操作选择明细集合
	 * 
	 * @return 操作选择明细集合
	 * @throws Throwable
	 */
	public OperationSelDtlMap getOperationSelDtlMap() throws Throwable {
		if (operationSelDtlMap == null) {
			operationSelDtlMap = new OperationSelDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_OperationSel_D where OID>0 and SOID=? order by Sequence";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				operationSelDtlMap.loadData(dtlDt);
			}
		}
		return operationSelDtlMap;
	}

	/**
	 * 操作选择明细集合
	 * 
	 * @param operationSelDtlMap
	 *            操作选择明细集合
	 */
	public void setOperationSelDtlMap(OperationSelDtlMap operationSelDtlMap) {
		this.operationSelDtlMap = operationSelDtlMap;
	}

	/**
	 * 构造操作选择对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public OperationSel(OAContext context) {
		super(context);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            主表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setSourceKey(dt.getString("SourceKey"));
		setSourceID(dt.getInt("SourceID"));
		setTag1(dt.getString("Tag1"));
		setTag2(dt.getString("Tag2"));
		setTag3(dt.getString("Tag3"));
		setTag4(dt.getString("Tag4"));
		setMessageSetID(dt.getLong("MessageSetID_H"));
		setEmailTemp(dt.getString("EmailTemp_H"));
	}
	
	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            表头数据集
	 * @param dtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getOperationSelDtlMap().loadData(dtlDt);
	}

	/**
	 * 获得操作选择的Key
	 * 
	 * @return 操作选择的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getSourceKey(), getSourceID(), getTag1(), getTag2(), getTag3(), getTag4());
	}

	/**
	 * 获得操作选择的Key
	 * 
	 * @param sourceKey
	 *            流程标识
	 * @param sourceID
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 操作选择的Key
	 */
	public static String getSelectKey(String sourceKey, Long sourceID, String tag1, String tag2, String tag3,
			String tag4) {
		StringBuffer sb = new StringBuffer();
		sb.append(sourceKey);
		sb.append(":");
		sb.append(sourceID);
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
	 * 获得操作选择的Sql查询条件
	 * 
	 * @param sourceKey
	 *            流程标识
	 * @param sourceID
	 *            流程版本
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 操作选择的Sql查询条件
	 */
	public static String getSqlWhere(String sourceKey, Long sourceID, String tag1, String tag2, String tag3,
			String tag4) {
		StringBuffer sb = new StringBuffer();
		if (!StringUtil.isBlankOrNull(sourceKey)) {
			sb.append(" and sourceKey='");
			sb.append(sourceKey);
			sb.append("'");
		}
		if (sourceID > 0) {
			sb.append(" and sourceID=");
			sb.append(sourceID);
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
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，源表单Key：" + getSourceKey() + "，源表单ID：" + getSourceID() + "，标签1：" + getTag1()
				+ ",标签2：" + getTag2() + "，标签3" + getTag3() + "，标签4：" + getTag4();
	}
}
