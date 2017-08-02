package com.bokesoft.oa.mid.wf.base;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map.Entry;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.base.SqlWhere;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;

/**
 * 人员选择条件明细集合
 * 
 * @author zhoukaihe
 *
 */
public class EmpSelConditionMap extends DtlBaseMap<Long, EmpSelCondition, SelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造人员选择条件明细集合
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            选择规则
	 */
	public EmpSelConditionMap(OAContext context, SelRule selRule) {
		super(context, selRule);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		dt.beforeFirst();
		while (dt.next()) {
			EmpSelCondition dtl = new EmpSelCondition(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得SQl条件
	 * 
	 * @param businessDt
	 *            当前业务来源数据集
	 * @throws Throwable
	 */
	public SqlWhere getSqlWhere(DataTable businessDt) throws Throwable {
		SqlWhere sqlWhere = new SqlWhere();
		SelRule selRule = getHeadBase();
		StringBuffer sb = sqlWhere.getSqlWhere();
		EmployeeSource employeeSource = selRule.getEmployeeSource();
		EmployeeSourceDtlMap employeeSourceDtlMap = employeeSource.getEmployeeSourceDtlMap();
		LinkedHashMap<String, EmployeeSourceDtl> fieldMap = employeeSourceDtlMap.getEmployeeSourceDtlMap();
		for (Iterator<Entry<Long, EmpSelCondition>> i = entrySet().iterator(); i.hasNext();) {
			Entry<Long, EmpSelCondition> e = i.next();
			EmpSelCondition empSelCondition = e.getValue();
			String fieldKey = empSelCondition.getFieldKey();
			sb.append(empSelCondition.getRBracket());
			if (empSelCondition.getIsVariate() == 1) {
				setVariate(sqlWhere, empSelCondition, businessDt);
			} else {
				EmployeeSourceDtl employeeSourceDtl = fieldMap.get(fieldKey);
				String fieldType = employeeSourceDtl.getFieldType();
				switch (fieldType) {
				case "oid":
					setLong(sqlWhere, empSelCondition);
				case "user":
					setLong(sqlWhere, empSelCondition);
				case "dic":
					setDic(sqlWhere, empSelCondition);
				case "txt":
					setVarchar(sqlWhere, empSelCondition);
				case "long":
					setLong(sqlWhere, empSelCondition);
				case "int":
					setInteger(sqlWhere, empSelCondition);
				case "num":
					setNumeric(sqlWhere, empSelCondition);
				case "date":
					setDate(sqlWhere, empSelCondition);
				case "time":
					setDate(sqlWhere, empSelCondition);
				case "drop":
					setDrop(sqlWhere, empSelCondition);
				case "sel":
					setInteger(sqlWhere, empSelCondition);
				}
			}

			sb.append(empSelCondition.getLBracket());
			// 如果还有下一个，拼上逻辑操作符
			if (i.hasNext()) {
				sb.append(SqlWhere.DefaultBlank);
				String lg = empSelCondition.getLogicOperation();
				if (StringUtil.isBlankOrNull(lg)) {
					lg = " and ";
				}
				sb.append(lg);
				sb.append(SqlWhere.DefaultBlank);
			}
		}
		return sqlWhere;
	}

	/**
	 * 设置长整型条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setLong(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Long value = TypeConvertor.toLong(empSelCondition.getValue());
		list.add(value);
	}

	/**
	 * 设置整型条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setInteger(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Integer value = TypeConvertor.toInteger(empSelCondition.getValue());
		list.add(value);
	}

	/**
	 * 设置数值条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setNumeric(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		BigDecimal value = TypeConvertor.toBigDecimal(empSelCondition.getValue());
		list.add(value);
	}

	/**
	 * 设置数值条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setDate(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Date value = TypeConvertor.toDate(empSelCondition.getValue());
		list.add(value);
	}

	/**
	 * 设置字符串条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setVarchar(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		list.add(empSelCondition.getValue());
	}

	/**
	 * 设置字符串条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 */
	public void setDrop(SqlWhere sqlWhere, EmpSelCondition empSelCondition) {
		DataTableMetaData metaData = getHeadBase().getEmployeeSource().getSourceDataTable().getMetaData();
		Integer dataType = metaData.getColumnInfo(empSelCondition.getFieldKey()).getDataType();
		if (dataType == 1002) {
			setVarchar(sqlWhere, empSelCondition);
		} else {
			setInteger(sqlWhere, empSelCondition);
		}
	}

	/**
	 * 设置变量条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员选择条件明细
	 * @param businessDt
	 *            当前业务来源数据集
	 */
	public void setVariate(SqlWhere sqlWhere, EmpSelCondition empSelCondition, DataTable businessDt) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(empSelCondition.getFieldKey());
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		String fieldKey = empSelCondition.getValue();
		Object value = businessDt.getObject(fieldKey);
		list.add(value);
	}

	/**
	 * 设置字典条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param empSelCondition
	 *            人员匹配条件明细
	 * @throws Throwable
	 */
	public void setDic(SqlWhere sqlWhere, EmpSelCondition empSelCondition) throws Throwable {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		String fieldKey = empSelCondition.getFieldKey();
		String fieldValue = empSelCondition.getValue();
		EmployeeSourceDtl employeeSourceDtl = getHeadBase().getEmployeeSource().getEmployeeSourceDtlMap().get(fieldKey);
		String formKey = employeeSourceDtl.getParaDict();
		// 默认按照字段值是字典代码值查询对应字典OID
		String formula = "GetDictOID('" + formKey + "','Code'," + fieldValue + ")";
		Long value = TypeConvertor.toLong(getContext().getContext().getMidParser().eval(0, formula));
		// 如果没查到对应ID值，则原值为OID
		if (value <= 0) {
			value = TypeConvertor.toLong(fieldValue);
		}
		sb.append(fieldKey);
		sb.append(empSelCondition.getOperation());
		sb.append(SqlWhere.DefaultRep);
		list.add(value);
	}
}
