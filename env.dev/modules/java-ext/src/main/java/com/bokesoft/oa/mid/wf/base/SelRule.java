package com.bokesoft.oa.mid.wf.base;

import java.util.List;
import java.util.Set;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.base.SqlWhere;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 用户选择规则
 * 
 * @author zhoukaihe
 *
 */
public class SelRule extends DicBase {
	/**
	 * 当前表单OID
	 */
	private Long billOID;

	/**
	 * 当前表单OID
	 * 
	 * @return 当前表单OID
	 */
	public Long getBillOID() {
		return billOID;
	}

	/**
	 * 当前表单OID
	 * 
	 * @param billOID
	 *            当前表单OID
	 */
	public void setBillOID(Long billOID) {
		this.billOID = billOID;
	}

	/**
	 * 业务来源ID
	 */
	private Long businessSourceID;

	/**
	 * 业务来源ID
	 * 
	 * @return 业务来源ID
	 */
	public Long getBusinessSourceID() {
		return businessSourceID;
	}

	/**
	 * 业务来源ID
	 * 
	 * @param businessSourceID
	 *            业务来源ID
	 */
	public void setBusinessSourceID(Long businessSourceID) {
		this.businessSourceID = businessSourceID;
	}

	/**
	 * 业务来源
	 */
	private BusinessSource businessSource;

	/**
	 * 业务来源
	 * 
	 * @return 业务来源
	 * @throws Throwable
	 */
	public BusinessSource getBusinessSource() throws Throwable {
		if (businessSource == null) {
			if (businessSourceID > 0) {
				businessSource = getContext().getBusinessSourceMap().get(businessSourceID);
			}
		}
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
		setBusinessSourceID(businessSource.getOID());
	}

	/**
	 * 用户来源类型
	 */
	private Integer optSrcType;

	/**
	 * 用户来源类型
	 * 
	 * @return 用户来源类型
	 */
	public Integer getOptSrcType() {
		return optSrcType;
	}

	/**
	 * 用户来源类型
	 * 
	 * @param optSrcType
	 *            用户来源类型
	 */
	public void setOptSrcType(Integer optSrcType) {
		this.optSrcType = optSrcType;
	}

	/**
	 * 业务来源ID
	 */
	private Long employeeSourceID;

	/**
	 * 业务来源ID
	 * 
	 * @return 业务来源ID
	 */
	public Long getEmployeeSourceID() {
		return employeeSourceID;
	}

	/**
	 * 业务来源ID
	 * 
	 * @param employeeSourceID
	 *            业务来源ID
	 */
	public void setEmployeeSourceID(Long employeeSourceID) {
		this.employeeSourceID = employeeSourceID;
	}

	/**
	 * 用户来源
	 */
	private EmployeeSource employeeSource;

	/**
	 * 用户来源
	 * 
	 * @return 用户来源
	 * @throws Throwable
	 */
	public EmployeeSource getEmployeeSource() throws Throwable {
		if (employeeSource == null) {
			if (employeeSourceID > 0) {
				employeeSource = getContext().getEmployeeSourceMap().get(employeeSourceID);
			}
		}
		return employeeSource;
	}

	/**
	 * 用户来源
	 * 
	 * @param employeeSource
	 *            用户来源
	 */
	public void setEmployeeSource(EmployeeSource employeeSource) {
		this.employeeSource = employeeSource;
		setEmployeeSourceID(employeeSource.getOID());
	}

	/**
	 * 自定义扩展
	 */
	private String definitionExtand;

	/**
	 * 自定义扩展
	 * 
	 * @return 自定义扩展
	 */
	public String getDefinitionExtand() {
		return definitionExtand;
	}

	/**
	 * 自定义扩展
	 * 
	 * @param definitionExtand
	 *            自定义扩展
	 */
	public void setDefinitionExtand(String definitionExtand) {
		this.definitionExtand = definitionExtand;
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
	 * 直接用户明细集合
	 */
	private DirectEmployeeMap directEmployeeMap;

	/**
	 * 直接用户明细集合
	 * 
	 * @return 直接用户明细集合
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
	 * 直接用户明细集合
	 * 
	 * @param directEmployeeMap
	 *            直接用户明细集合
	 */
	public void setDirectEmployeeMap(DirectEmployeeMap directEmployeeMap) {
		this.directEmployeeMap = directEmployeeMap;
	}

	/**
	 * 用户选择条件明细集合
	 */
	private EmpSelConditionMap empSelConditionMap;

	/**
	 * 用户选择条件明细集合
	 * 
	 * @return 用户选择条件明细集合
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
	 * 用户选择条件明细集合
	 * 
	 * @param empSelConditionMap
	 *            用户选择条件明细集合
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
		setOptSrcType(dt.getInt("OptSrcType"));
		setBusinessSourceID(dt.getLong("BusSource"));
		setEmployeeSourceID(dt.getLong("UserSource"));
		setDefinitionExtand(dt.getString("DefinitionExtand"));
	}

	/**
	 * 更新数据
	 * 
	 * @throws Throwable
	 */
	public void uploadData() throws Throwable {
		DataTable dt = document.get("OA_SelRule_H");
		uploadData(dt);
		dt = document.get("OA_SelRule_D");
		getSelRuleDtlMap().uploadData(dt);
	}

	/**
	 * 更新数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void uploadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setOptSrcType(dt.getInt("OptSrcType"));
		setBusinessSourceID(dt.getLong("BusSource"));
		setEmployeeSourceID(dt.getLong("UserSource"));
		setDefinitionExtand(dt.getString("DefinitionExtand"));

	}

	/**
	 * 数据对象
	 */
	private Document document;

	/**
	 * 数据对象
	 * 
	 * @return 数据对象
	 * @throws Throwable
	 */
	public Document getDocument() throws Throwable {
		if (document == null) {
			MetaDataObject metaDataObject = MetaFactory.getGlobalInstance().getDataObject("OA_SelRule");
			document = DocumentUtil.newDocument(metaDataObject);
			uploadData();
		}
		setOID(document.getOID());
		return document;
	}

	/**
	 * 数据对象
	 * 
	 * @param document
	 *            数据对象
	 */
	public void setDocument(Document document) {
		this.document = document;
	}

	/**
	 * 构造用户选择规则对象
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
		setBillOID(oid);
		Boolean check = false;
		DataTable dt = getBusinessDt(oid);

		Integer optSrcType = getOptSrcType();
		int size = opteratorSet.size();
		if (optSrcType == 10) {
			if (dt == null || dt.size() <= 0) {
				return check;
			}
			DirectEmployeeMap directEmployeeMap = getDirectEmployeeMap();
			for (DirectEmployee directEmployee : directEmployeeMap.values()) {
				Long id = directEmployee.getOperatorID();
				opteratorSet.add(id);
			}
		} else if (optSrcType == 20) {
			if (dt == null || dt.size() <= 0) {
				return check;
			}
			opteratorSet = getOpteratorSet(opteratorSet, dt);
		} else if (optSrcType == 30) {
			opteratorSet = getOpteratorSetByExtand(opteratorSet, dt);
		}
		if (size != opteratorSet.size()) {
			check = true;
		}
		return check;
	}

	/**
	 * 获得业务来源数据集
	 * 
	 * @param oid
	 *            当前单据ID
	 * @return 业务来源数据集
	 * @throws Throwable
	 */
	public DataTable getBusinessDt(Long oid) throws Throwable {
		BusinessSource businessSource = getBusinessSource();
		if (businessSource == null) {
			return null;
		}
		BusinessSourceDtlMap businessSourceDtlMap = businessSource.getBusinessSourceDtlMap();
		String oidFieldKey = businessSourceDtlMap.getOidFieldKey();
		SelRuleDtlMap selRuleDtlMap = getSelRuleDtlMap();
		if (selRuleDtlMap == null || selRuleDtlMap.size() <= 0) {
			return null;
		}
		SqlWhere sqlWhere = selRuleDtlMap.getSqlWhere();
		String where = sqlWhere.getSqlWhereString();
		if (!StringUtil.isBlankOrNull(where)) {
			where = " And " + where;
		}
		List<Object> valueList = sqlWhere.getValueList();
		String sql = "Select * from (" + businessSource.getSourcesql() + ") SourceTable where SourceTable."
				+ oidFieldKey + "=" + oid + where;
		DataTable dt = getContext().getContext().getDBManager().execPrepareQuery(sql, valueList);
		return dt;
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
		DataTable dt = getEmployeeSourceDataTable(businessDt);
		if (dt == null) {
			return opteratorSet;
		}

		ISelRule selRule = new GetEmployeeSelCondition();
		Set<Long> optSet = selRule.getOpteratorSet(getContext(), this, opteratorSet, businessDt, dt, getBillOID());
		if (optSet != null) {
			opteratorSet.addAll(optSet);
		}
		return opteratorSet;
	}

	/**
	 * 根据自定义扩展获得操作员集合
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param businessDt
	 *            当前业务来源数据集
	 * @return 操作员集合
	 * @throws Throwable
	 */
	public Set<Long> getOpteratorSetByExtand(Set<Long> opteratorSet, DataTable businessDt) throws Throwable {
		DataTable dt = getEmployeeSourceDataTable(businessDt);
		String definitionExtand = getDefinitionExtand();
		ISelRule selRule = (ISelRule) Class.forName(definitionExtand).newInstance();
		Set<Long> optSet = selRule.getOpteratorSet(getContext(), this, opteratorSet, businessDt, dt, getBillOID());
		if (optSet != null) {
			opteratorSet.addAll(optSet);
		}
		return opteratorSet;
	}

	/**
	 * 获得用户选择条件明细数据集
	 * 
	 * @param opteratorSet
	 *            操作员集合
	 * @param businessDt
	 *            当前业务来源数据集
	 * @return 用户选择条件明细数据集
	 * @throws Throwable
	 */
	public DataTable getEmployeeSourceDataTable(DataTable businessDt) throws Throwable {
		if (businessDt == null || businessDt.size() <= 0) {
			return null;
		}
		EmployeeSource employeeSource = getEmployeeSource();
		if (employeeSource == null) {
			return null;
		}
		EmpSelConditionMap empSelConditionMap = getEmpSelConditionMap();
		if (empSelConditionMap == null || empSelConditionMap.size() <= 0) {
			return null;
		}
		SqlWhere sqlWhere = empSelConditionMap.getSqlWhere(businessDt);
		String where = sqlWhere.getSqlWhereString();
		List<Object> valueList = sqlWhere.getValueList();
		String sql = "Select * from (" + employeeSource.getSourcesql() + ") SourceTable where " + where;
		DataTable dt = getContext().getContext().getDBManager().execPrepareQuery(sql, valueList);
		return dt;
	}
}
