package com.bokesoft.oa.mid.wf.base;

import java.util.List;
import java.util.Set;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.base.SqlWhere;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择规则
 * 
 * @author zhoukaihe
 *
 */
public class SelRule extends DicBase {
	/**
	 * 业务来源
	 */
	private BusinessSource businessSource;

	/**
	 * 业务来源
	 * 
	 * @return 业务来源
	 */
	public BusinessSource getBusinessSource() {
		return businessSource;
	}

	/**
	 * 业务来源
	 * 
	 * @param businessSource
	 *            业务来源
	 */
	public void setBusinessSource(BusinessSource businessSource) {
		this.businessSource = businessSource;
	}

	/**
	 * 人员来源类型
	 */
	private Integer optSrcType;

	/**
	 * 人员来源类型
	 * 
	 * @return 人员来源类型
	 */
	public Integer getOptSrcType() {
		return optSrcType;
	}

	/**
	 * 人员来源类型
	 * 
	 * @param optSrcType
	 *            人员来源类型
	 */
	public void setOptSrcType(Integer optSrcType) {
		this.optSrcType = optSrcType;
	}

	/**
	 * 人员来源
	 */
	private EmployeeSource employeeSource;

	/**
	 * 人员来源
	 * 
	 * @return 人员来源
	 */
	public EmployeeSource getEmployeeSource() {
		return employeeSource;
	}

	/**
	 * 人员来源
	 * 
	 * @param employeeSource
	 *            人员来源
	 */
	public void setEmployeeSource(EmployeeSource employeeSource) {
		this.employeeSource = employeeSource;
	}

	/**
	 * 选择规则明细集合
	 */
	private SelRuleDtlMap selRuleDtlMap;

	/**
	 * 选择规则明细集合
	 * 
	 * @return 选择规则明细集合
	 * @throws Throwable
	 */
	public SelRuleDtlMap getSelRuleDtlMap() throws Throwable {
		if (selRuleDtlMap == null) {
			selRuleDtlMap = new SelRuleDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_SelRule_D where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				selRuleDtlMap.loadData(dtlDt);
			}
		}
		return selRuleDtlMap;
	}

	/**
	 * 选择规则明细集合
	 * 
	 * @param selRuleDtlMap
	 *            选择规则明细集合
	 */
	public void setSelRuleDtlMap(SelRuleDtlMap selRuleDtlMap) {
		this.selRuleDtlMap = selRuleDtlMap;
	}

	/**
	 * 直接人员明细集合
	 */
	private DirectEmployeeMap directEmployeeMap;

	/**
	 * 直接人员明细集合
	 * 
	 * @return 直接人员明细集合
	 * @throws Throwable
	 */
	public DirectEmployeeMap getDirectEmployeeMap() throws Throwable {
		if (directEmployeeMap == null) {
			directEmployeeMap = new DirectEmployeeMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_SelRule_Direct where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				directEmployeeMap.loadData(dtlDt);
			}
		}
		return directEmployeeMap;
	}

	/**
	 * 直接人员明细集合
	 * 
	 * @param directEmployeeMap
	 *            直接人员明细集合
	 */
	public void setDirectEmployeeMap(DirectEmployeeMap directEmployeeMap) {
		this.directEmployeeMap = directEmployeeMap;
	}

	/**
	 * 人员选择条件明细集合
	 */
	private EmpSelConditionMap empSelConditionMap;

	/**
	 * 人员选择条件明细集合
	 * 
	 * @return 人员选择条件明细集合
	 * @throws Throwable
	 */
	public EmpSelConditionMap getEmpSelConditionMap() throws Throwable {
		if (empSelConditionMap == null) {
			empSelConditionMap = new EmpSelConditionMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_SelRule_Sel where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				empSelConditionMap.loadData(dtlDt);
			}
		}
		return empSelConditionMap;
	}

	/**
	 * 人员选择条件明细集合
	 * 
	 * @param empSelConditionMap
	 *            人员选择条件明细集合
	 */
	public void setEmpSelConditionMap(EmpSelConditionMap empSelConditionMap) {
		this.empSelConditionMap = empSelConditionMap;
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
		OAContext context = getContext();
		setOptSrcType(dt.getInt("OptSrcType"));
		BusinessSource bus = context.getBusinessSourceMap().get(dt.getLong("BusSource"));
		setBusinessSource(bus);
		EmployeeSource emp = context.getEmployeeSourceMap().get(dt.getLong("UserSource"));
		setEmployeeSource(emp);

	}

	/**
	 * 构造人员选择规则对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public SelRule(OAContext context) {
		super(context);
	}

	/**
	 * 获得操作员集合
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param oid
	 *            当前单据ID
	 * @return 当前业务单据满足条件返回True，否则返回false
	 * @throws Throwable
	 */
	public Boolean getOpteratorSet(Set<Long> opteratorSet, Long oid) throws Throwable {
		Boolean check = false;
		BusinessSource businessSource = getBusinessSource();
		BusinessSourceDtlMap businessSourceDtlMap = businessSource.getBusinessSourceDtlMap();
		String oidFieldKey = businessSourceDtlMap.getOidFieldKey();
		SelRuleDtlMap selRuleDtlMap = getSelRuleDtlMap();
		SqlWhere sqlWhere = selRuleDtlMap.getSqlWhere();
		String where = sqlWhere.getSqlWhereString();
		List<Object> valueList = sqlWhere.getValueList();
		String sql = "Select * from (" + businessSource.getSourcesql() + ") SourceTable where SourceTable."
				+ oidFieldKey + "=" + oid + " And " + where;
		DataTable dt = getContext().getContext().getDBManager().execPrepareQuery(sql, valueList);
		if (dt.size() <= 0) {
			return check;
		}

		if (getOptSrcType() == 10) {
			DirectEmployeeMap directEmployeeMap = getDirectEmployeeMap();
			for (DirectEmployee directEmployee : directEmployeeMap.values()) {
				Long id = directEmployee.getOperator();
				opteratorSet.add(id);
			}
		} else {
			opteratorSet = getOpteratorSet(opteratorSet, dt);
		}
		check = true;
		return check;
	}

	/**
	 * 获得操作员集合
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param businessDt
	 *            当前业务来源数据集
	 * @return 操作员集合
	 * @throws Throwable
	 */
	public Set<Long> getOpteratorSet(Set<Long> opteratorSet, DataTable businessDt) throws Throwable {
		EmployeeSource employeeSource = getEmployeeSource();
		EmployeeSourceDtlMap employeeSourceDtlMap = employeeSource.getEmployeeSourceDtlMap();
		String userFieldKey = employeeSourceDtlMap.getUserFieldKey();
		EmpSelConditionMap empSelConditionMap = getEmpSelConditionMap();
		SqlWhere sqlWhere = empSelConditionMap.getSqlWhere(businessDt);
		String where = sqlWhere.getSqlWhereString();
		List<Object> valueList = sqlWhere.getValueList();
		String sql = "Select * from (" + employeeSource.getSourcesql() + ") SourceTable where " + where;
		DataTable dt = getContext().getContext().getDBManager().execPrepareQuery(sql, valueList);
		dt.beforeFirst();
		while (dt.next()) {
			Long id = dt.getLong(userFieldKey);
			opteratorSet.add(id);
		}
		return opteratorSet;
	}
}
