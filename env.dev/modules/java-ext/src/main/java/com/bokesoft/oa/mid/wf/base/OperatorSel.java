package com.bokesoft.oa.mid.wf.base;

import java.util.HashSet;
import java.util.Set;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.GetIdExistsSql;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.oa.util.Corporation;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择
 * 
 * @author minjian
 *
 */
public class OperatorSel extends BillBase {
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
	 * 标签1
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
	 * 选择结果描述
	 */
	private String optDesc;

	/**
	 *  选择结果描述
	 * 
	 * @return  选择结果描述
	 */
	public String getOptDesc() {
		return optDesc;
	}

	/**
	 *  选择结果描述
	 * 
	 * @param optDesc
	 *             选择结果描述
	 */
	public void setOptDesc(String optDesc) {
		this.optDesc = optDesc;
	}
	
	/**
	 * 操作员ids
	 */
	private String optIDs;

	/**
	 * 操作员ids
	 * 
	 * @return 操作员ids
	 */
	public String getOptIDs() {
		return optIDs;
	}

	/**
	 * 操作员ids
	 * 
	 * @param optIDs
	 *            操作员ids
	 */
	public void setOptIDs(String optIDs) {
		this.optIDs = optIDs;
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
	 * 人员选择明细集合
	 */
	private OperatorSelDtlMap operatorSelDtlMap;

	/**
	 * 人员选择明细集合
	 * 
	 * @return 人员选择明细集合
	 * @throws Throwable
	 */
	public OperatorSelDtlMap getOperatorSelDtlMap() throws Throwable {
		if (operatorSelDtlMap == null) {
			operatorSelDtlMap = new OperatorSelDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_OperatorSel_D where OID>0 and SOID=? order by Sequence";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				operatorSelDtlMap.loadData(dtlDt);
			}
		}
		return operatorSelDtlMap;
	}

	/**
	 * 人员选择明细集合
	 * 
	 * @param operatorSelDtlMap
	 *            人员选择明细集合
	 */
	public void setOperatorSelDtlMap(OperatorSelDtlMap operatorSelDtlMap) {
		if (operatorSelDtlMap == null) {
			operatorSelDtlMap = new OperatorSelDtlMap(getContext(), this);
		}
		this.operatorSelDtlMap = operatorSelDtlMap;
	}

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
	 * 构造人员选择对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public OperatorSel(OAContext context) {
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
		setOptDesc(dt.getString("OptDesc"));
		setMessageSetID(dt.getLong("MessageSetID_H"));
		setEmailTemp(dt.getString("EmailTemp_H"));
	}

	/**
	 * 载入数据
	 * 
	 * @param headDt
	 *            主表数据集
	 * @param DtlDt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable headDt, DataTable dtlDt) throws Throwable {
		loadData(headDt);
		getOperatorSelDtlMap().loadData(dtlDt);
	}

	/**
	 * 获得人员选择的Key
	 * 
	 * @return 人员选择的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getSourceKey(), getSourceID(), getTag1(), getTag2(), getTag3(), getTag4());
	}

	/**
	 * 获得选择的Key
	 * 
	 * @param sourceKey
	 *            源表单Key
	 * @param sourceID
	 *            源表单ID
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 人员选择的Key
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
	 * 获得人员选择的Sql查询条件
	 * 
	 * @param sourceKey
	 *            源表单Key
	 * @param sourceID
	 *            源表单ID
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 人员选择的Sql查询条件
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
	 * 获得查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql() throws Throwable {
		String value = getOptFilterForOrg();
		String sql = "";
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = getOptFilterForEmp();
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = getOptFilterForRule();
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = getOptFilterForPublic();
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = getOptFilterForPublic();
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		if (sql.length() > 0) {
			sql = sql.substring(7);
		}
		return sql;
	}

	/**
	 * 获得查询操作员ID的集合
	 * 
	 * @param filter
	 *            筛选条件
	 * @param oid
	 *            当前单据的标识
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public Set<Long> getParticipatorSet(Long oid) throws Throwable {
		Set<Long> opteratorSet = new HashSet<Long>();
		opteratorSet = getOptIDForOrg(opteratorSet);
		opteratorSet = getOptIDForEmp(opteratorSet);
		opteratorSet = getOptIDForRule(opteratorSet);
		opteratorSet = getOptIDForPublic(opteratorSet);
		opteratorSet = getOptIDForSelRule(opteratorSet, oid);
		return opteratorSet;
	}

	/**
	 * 获得数据集字段列的字符串结果
	 * 
	 * @param dt
	 *            数据集
	 * @param colName
	 *            字段列名
	 * @param sSepSign
	 *            字符串中的分隔符
	 * @return 数据集字段列的字符串结果
	 * @throws Throwable
	 */
	public String getDataTableString(DataTable dt, String colName, String sSepSign) throws Throwable {
		String ret = "";
		dt.beforeFirst();
		while (dt.next()) {
			ret = ret + sSepSign + TypeConvertor.toString(dt.getObject(colName));
		}
		if (ret.length() > 0) {
			ret = ret.toString().substring(sSepSign.length());
		}
		return ret;
	}

	/**
	 * 获得数据集字段列的集合结果
	 * 
	 * @param opteratorSet
	 *            操作员ID集合
	 * @param dt
	 *            数据集
	 * @param colName
	 *            字段列名
	 * @return 数据集字段列的集合结果
	 * @throws Throwable
	 */
	public Set<Long> getDataTableSet(Set<Long> opteratorSet, DataTable dt, String colName) throws Throwable {
		dt.beforeFirst();
		while (dt.next()) {
			opteratorSet.add(dt.getLong(colName));
		}
		return opteratorSet;
	}

	/**
	 * 获得行政组织的查询操作员ID的Sql
	 * 
	 * @return 行政组织的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getOptFilterForOrg() throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String sql = "";
		// 如果部门层级=0，即集团，不做处理，取集团中的所有人进行审批，没有意义
		String value = operatorSelDtlMap.geParticipatortIDs(1);
		String ids = operatorSelDtlMap.geParticipatortIDs(2);
		if (value.length() <= 0 && ids.length() > 0) {
			value = ids;
		} else if (value.length() > 0 && ids.length() > 0) {
			value = value + "," + ids;
		}
		if (value.length() <= 0) {
			return sql;
		}

		return getOrgSql(value);
	}

	/**
	 * 获得行政组织的查询操作员ID的Sql
	 * 
	 * @param ids
	 *            行政组织ID字符串
	 * @return 行政组织的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getOrgSql(String ids) throws Throwable {
		String sql = "";
		if (!StringUtil.isBlankOrNull(ids)) {
			DefaultContext context = getContext().getContext();
			String departmentWhere = GetIdExistsSql.getIdExistsSql(context, "OA_Department_H", ids, "dopt.DeptID");
			sql = "Select OID From SYS_Operator dopt Where " + Corporation.getCorpIDFilter(context) + " And "
					+ departmentWhere;
		}
		return sql;
	}

	/**
	 * 根据SQL获得操作员集合
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param sql
	 *            查询操作员的Sql语句
	 * @return 操作员集合
	 * @throws Throwable
	 */
	public Set<Long> getOperatorSet(Set<Long> opteratorSet, String sql) throws Throwable {
		if (StringUtil.isBlankOrNull(sql)) {
			return opteratorSet;
		}
		DefaultContext context = getContext().getContext();
		DataTable dt = context.getDBManager().execQuery(sql);
		opteratorSet = getDataTableSet(opteratorSet, dt, "OID");
		return opteratorSet;
	}

	/**
	 * 获得行政组织的查询操作员ID的集合
	 * 
	 * @return 行政组织的查询操作员ID的集合
	 * @throws Throwable
	 */
	public Set<Long> getOptIDForOrg(Set<Long> opteratorSet) throws Throwable {
		return getOperatorSet(opteratorSet, getOptFilterForOrg());
	}

	/**
	 * 获得职员的查询操作员ID的Sql
	 * 
	 * @return 职员的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getOptFilterForEmp() throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String sql = "";
		String value = operatorSelDtlMap.geParticipatortIDs(3);
		if (value.length() <= 0) {
			return sql;
		}
		DefaultContext context = getContext().getContext();
		if (!StringUtil.isBlankOrNull(value)) {
			sql = "Select OID From SYS_Operator Where " + Corporation.getCorpIDFilter(context) + " And OID In(" + value
					+ ")";
		}
		return sql;
	}

	/**
	 * 获得职员的查询操作员ID的集合
	 * 
	 * @return 行政组织的查询操作员ID的集合
	 * @throws Throwable
	 */
	public Set<Long> getOptIDForEmp(Set<Long> opteratorSet) throws Throwable {
		OperatorSelDtlMap map = getOperatorSelDtlMap().getTypeMap().get(3);
		if (map == null) {
			return opteratorSet;
		}
		for (OperatorSelDtl operatorSelDtl : map.values()) {
			opteratorSet.add(operatorSelDtl.getOptID());
		}
		return opteratorSet;
	}

	/**
	 * 获得自定义规则的查询操作员ID的Sql
	 * 
	 * @return 自定义规则的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getOptFilterForRule() throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String sql = "";
		String value = operatorSelDtlMap.geParticipatortIDs(4);
		if (value.length() <= 0) {
			return sql;
		}
		DefaultContext context = getContext().getContext();
		String sqlFilter = "Select Formula as OID From OA_OptRule_H Where Formula Is Not Null And OID In(" + value
				+ ")";
		DataTable dt = context.getDBManager().execQuery(sqlFilter);
		value = getDataTableString(dt, "OID", " &\" Union \"&");
		sql = TypeConvertor.toString(context.getMidParser().eval(0, value));
		if (StringUtil.isBlankOrNull(sql)) {
			sql = "";
		}
		return sql;
	}

	/**
	 * 获得自定义规则的查询操作员ID的集合
	 * 
	 * @return 自定义规则的查询操作员ID的集合
	 * @throws Throwable
	 */
	public Set<Long> getOptIDForRule(Set<Long> opteratorSet) throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String value = operatorSelDtlMap.geParticipatortIDs(4);
		if (value.length() <= 0) {
			return opteratorSet;
		}
		DefaultContext context = getContext().getContext();
		IDBManager dbm = context.getDBManager();
		String sqlFilter = "Select Formula From OA_OptRule_H Where Formula Is Not Null And OID In(" + value + ")";
		DataTable dt = dbm.execQuery(sqlFilter);
		dt.beforeFirst();
		while (dt.next()) {
			String formula = dt.getString("Formula");
			String sql = TypeConvertor.toString(context.getMidParser().eval(0, formula));
			opteratorSet = getOperatorSet(opteratorSet, sql);
		}
		return opteratorSet;
	}

	/**
	 * 获得人员集合的查询操作员ID的Sql
	 * 
	 * @return 人员集合的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getOptFilterForPublic() throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String sql = "";
		String value = operatorSelDtlMap.geParticipatortIDs(5);
		if (value.length() <= 0) {
			return sql;
		}
		DefaultContext context = getContext().getContext();
		String sqlFilter = "Select p.OperatorID OID From  OA_OptPublic_D p Where p.SOID In(" + value + ")";
		DataTable dt = context.getDBManager().execQuery(sqlFilter);
		value = getDataTableString(dt, "OID", ",");
		if (!StringUtil.isBlankOrNull(value)) {
			sql = "Select OID From SYS_Operator Where " + Corporation.getCorpIDFilter(context) + " And OID In(" + value
					+ ")";
		}
		return sql;
	}

	/**
	 * 获得人员集合的查询操作员ID的集合
	 * 
	 * @return 人员集合的查询操作员ID的集合
	 * @throws Throwable
	 */
	public Set<Long> getOptIDForPublic(Set<Long> opteratorSet) throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap();
		String value = operatorSelDtlMap.geParticipatortIDs(5);
		if (value.length() <= 0) {
			return opteratorSet;
		}
		String sql = "Select p.OperatorID OID From  OA_OptPublic_D p Where p.SOID In(" + value + ")";
		opteratorSet = getOperatorSet(opteratorSet, sql);
		return opteratorSet;
	}

	/**
	 * 获得人员选择规则的查询操作员ID的集合
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param oid
	 *            当前单据的标识
	 * 
	 * @return 人员选择规则的查询操作员ID的集合
	 * @throws Throwable
	 */
	public Set<Long> getOptIDForSelRule(Set<Long> opteratorSet, Long oid) throws Throwable {
		if (oid == null || oid <= 0) {
			return opteratorSet;
		}
		OperatorSelDtlMap map = getOperatorSelDtlMap().getTypeMap().get(6);
		if (map == null || map.size() <= 0) {
			return opteratorSet;
		}
		SelRuleMap selRuleMap = getContext().getSelRuleMap();
		for (OperatorSelDtl operatorSelDtl : map.values()) {
			Long id = operatorSelDtl.getOptID();
			SelRule selRule = selRuleMap.get(id);
			Boolean check = selRule.getOpteratorSet(opteratorSet, oid);
			if (check) {
				break;
			}
		}
		return opteratorSet;
	}

	/**
	 * 获得参与者ID字符串
	 * 
	 * @param oid
	 *            当前单据的标识
	 * @return
	 * @throws Throwable
	 */
	public String getParticipatorIDs(Long oid) throws Throwable {
		return getParticipatorIDs(oid, ":");
	}

	/**
	 * 获得参与者ID字符串
	 * 
	 * @param oid
	 *            当前单据的标识
	 * @param sep
	 *            分隔符
	 * @return
	 * @throws Throwable
	 */
	public String getParticipatorIDs(Long oid, String sep) throws Throwable {
		String ids = "";
		Set<Long> opteratorSet = getParticipatorSet(oid);
		StringBuffer sb = new StringBuffer();
		for (Long id : opteratorSet) {
			sb.append(sep);
			sb.append(id);
		}
		ids = sb.toString();
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}
		return ids;
	}

	/**
	 * 获得指定操作员所涉及的权限选择集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param oid
	 *            当前单据ID
	 * @return 人员选择明细集合
	 * @throws Throwable
	 */
	public Set<RightSel> getRightSelSet(Long operatorID, Long oid) throws Throwable {
		Set<RightSel> set = new HashSet<RightSel>();
		Set<OperatorSelDtl> operatorSelDtlSet = getOperatorSelDtlSet(operatorID, oid);
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlSet) {
			RightSel rightSel = operatorSelDtl.getRightSel();
			if (rightSel != null) {
				set.add(operatorSelDtl.getRightSel());
			}
		}
		return set;
	}

	/**
	 * 获得指定操作员所涉及的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param oid
	 *            当前单据ID
	 * @return 人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSet(Long operatorID, Long oid) throws Throwable {
		Set<OperatorSelDtl> set = new HashSet<OperatorSelDtl>();
		set = getOperatorSelDtlSetOrg(operatorID, set);
		set = getOperatorSelDtlSetEmp(operatorID, set);
		set = getOperatorSelDtlSetRule(operatorID, set);
		set = getOperatorSelDtlSetPublic(operatorID, set);
		set = getOperatorSelDtlSetSelRule(operatorID, set, oid);
		return set;
	}

	/**
	 * 获得行政组织的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param set
	 *            人员选择明细集合
	 * @return 行政组织的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetOrg(Long operatorID, Set<OperatorSelDtl> set) throws Throwable {

		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(1);
		set = getOperatorSelDtlSetOrg(operatorID, operatorSelDtlMap, set);
		operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(2);
		set = getOperatorSelDtlSetOrg(operatorID, operatorSelDtlMap, set);
		return set;
	}

	/**
	 * 获得行政组织的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param operatorSelDtlMap
	 *            人员选择明细集合
	 * @param set
	 *            人员选择明细集合
	 * @return 行政组织的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetOrg(Long operatorID, OperatorSelDtlMap operatorSelDtlMap,
			Set<OperatorSelDtl> set) throws Throwable {
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return set;
		}
		IDBManager dbm = getContext().getContext().getDBManager();
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			Long optID = operatorSelDtl.getOptID();
			String sql = getOrgSql(optID.toString());
			sql = "Select oid from (" + sql + ") operatorSel where operatorSel.oid=" + operatorID;
			DataTable optDt = dbm.execQuery(sql);
			if (optDt.size() > 0) {
				set.add(operatorSelDtl);
			}
		}
		return set;
	}

	/**
	 * 获得人员的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param set
	 *            人员选择明细集合
	 * @return 人员的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetEmp(Long operatorID, Set<OperatorSelDtl> set) throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(3);
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return set;
		}
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			Long optID = operatorSelDtl.getOptID();
			if (optID.equals(operatorID)) {
				set.add(operatorSelDtl);
			}
		}
		return set;
	}

	/**
	 * 获得自定义的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param set
	 *            人员选择明细集合
	 * @return 自定义的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetRule(Long operatorID, Set<OperatorSelDtl> set) throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(4);
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return set;
		}
		DefaultContext context = getContext().getContext();
		IDBManager dbm = context.getDBManager();
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			Long optID = operatorSelDtl.getOptID();
			String sqlFilter = "Select Formula From OA_OptRule_H Where Formula Is Not Null And OID In(" + optID + ")";
			DataTable dt = dbm.execQuery(sqlFilter);
			dt.beforeFirst();
			while (dt.next()) {
				String formula = dt.getString("Formula");
				String sql = TypeConvertor.toString(context.getMidParser().eval(0, formula));
				sql = "Select oid from (" + sql + ") operatorSel where operatorSel.oid=" + operatorID;
				DataTable optDt = dbm.execQuery(sql);
				if (optDt.size() > 0) {
					set.add(operatorSelDtl);
				}
			}
		}
		return set;
	}

	/**
	 * 获得群组的人员选择明细集合
	 * 
	 * @param operatorID
	 *            操作员ID
	 * @param set
	 *            人员选择明细集合
	 * @return 群组的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetPublic(Long operatorID, Set<OperatorSelDtl> set) throws Throwable {
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(5);
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return set;
		}

		IDBManager dbm = getContext().getContext().getDBManager();
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			Long optID = operatorSelDtl.getOptID();
			String sql = "Select p.OperatorID OID From  OA_OptPublic_D p Where p.SOID=" + optID + " and p.OperatorID="
					+ operatorID;
			DataTable optDt = dbm.execQuery(sql);
			if (optDt.size() > 0) {
				set.add(operatorSelDtl);
			}
		}
		return set;
	}

	/**
	 * 获得群组的人员选择明细集合
	 * 
	 * @param operatorID
	 * @param set
	 *            人员选择明细集合
	 * @param oid
	 *            当前单据的标识
	 * @return 群组的人员选择明细集合
	 * @throws Throwable
	 */
	public Set<OperatorSelDtl> getOperatorSelDtlSetSelRule(Long operatorID, Set<OperatorSelDtl> set, Long oid)
			throws Throwable {
		if (oid == null || oid <= 0) {
			return set;
		}
		OperatorSelDtlMap operatorSelDtlMap = getOperatorSelDtlMap().getTypeMap().get(6);
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return set;
		}
		SelRuleMap selRuleMap = getContext().getSelRuleMap();
		Set<Long> opteratorSet = new HashSet<Long>();
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			Long optID = operatorSelDtl.getOptID();
			SelRule selRule = selRuleMap.get(optID);
			Boolean check = selRule.getOpteratorSet(opteratorSet, oid);
			if (check) {
				if (opteratorSet.contains(operatorID)) {
					set.add(operatorSelDtl);
				}
				break;
			}
		}
		return set;
	}

	/**
	 * 重载
	 */
	public String toString() {
		return super.toString() + "，源表单Key：" + getSourceKey() + "，源表单ID：" + getSourceID() + "，标签1：" + getTag1()
				+ ",标签2：" + getTag2() + "，标签3：" + getTag3() + "，标签4：" + getTag4();
	}
}
