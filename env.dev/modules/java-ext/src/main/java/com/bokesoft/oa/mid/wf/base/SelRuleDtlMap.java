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
 * 人员选择规则明细集合
 * 
 * @author zhoukaihe
 *
 */
public class SelRuleDtlMap extends DtlBaseMap<Long, SelRuleDtl, SelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造人员选择规则明细集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param selRule
	 *            选择规则
	 */
	public SelRuleDtlMap(OAContext context, SelRule selRule) {
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
			SelRuleDtl dtl = new SelRuleDtl(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得SQl条件
	 * 
	 * @throws Throwable
	 */
	public SqlWhere getSqlWhere() throws Throwable {
		SqlWhere sqlWhere = new SqlWhere();
		SelRule selRule = getHeadBase();
		StringBuffer sb = sqlWhere.getSqlWhere();
		BusinessSource businessSource = selRule.getBusinessSource();
		BusinessSourceDtlMap businessSourceDtlMap = businessSource.getBusinessSourceDtlMap();
		LinkedHashMap<String, BusinessSourceDtl> fieldMap = businessSourceDtlMap.getBusinessSourceDtlMap();
		for (Iterator<Entry<Long, SelRuleDtl>> i = entrySet().iterator(); i.hasNext();) {
			Entry<Long, SelRuleDtl> e = i.next();
			SelRuleDtl selRuleDtl = e.getValue();
			String fieldKey = selRuleDtl.getFieldKey();
			BusinessSourceDtl businessSourceDtl = fieldMap.get(fieldKey);
			sb.append(selRuleDtl.getLBracket());
			String fieldType = businessSourceDtl.getFieldType();
			switch (fieldType) {
			case "oid":
				setLong(sqlWhere, selRuleDtl);
				break;
			case "user":
				setLong(sqlWhere, selRuleDtl);
				break;
			case "dic":
				setDic(sqlWhere, selRuleDtl);
				break;
			case "txt":
				setVarchar(sqlWhere, selRuleDtl);
				break;
			case "long":
				setLong(sqlWhere, selRuleDtl);
				break;
			case "int":
				setInteger(sqlWhere, selRuleDtl);
				break;
			case "num":
				setNumeric(sqlWhere, selRuleDtl);
				break;
			case "date":
				setDate(sqlWhere, selRuleDtl);
				break;
			case "time":
				setDate(sqlWhere, selRuleDtl);
				break;
			case "drop":
				setDrop(sqlWhere, selRuleDtl);
				break;
			case "sel":
				setInteger(sqlWhere, selRuleDtl);
			}
			sb.append(selRuleDtl.getRBracket());
			// 如果还有下一个，拼上逻辑操作符
			if (i.hasNext()) {
				sb.append(SqlWhere.DefaultBlank);
				String lg = selRuleDtl.getLogicOperation();
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
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setLong(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(selRuleDtl.getFieldKey());
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Long value = TypeConvertor.toLong(selRuleDtl.getValue());
		list.add(value);
	}

	/**
	 * 设置整型条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setInteger(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(selRuleDtl.getFieldKey());
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Integer value = TypeConvertor.toInteger(selRuleDtl.getValue());
		list.add(value);
	}

	/**
	 * 设置数值条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setNumeric(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(selRuleDtl.getFieldKey());
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		BigDecimal value = TypeConvertor.toBigDecimal(selRuleDtl.getValue());
		list.add(value);
	}

	/**
	 * 设置数值条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setDate(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(selRuleDtl.getFieldKey());
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		Date value = TypeConvertor.toDate(selRuleDtl.getValue());
		list.add(value);
	}

	/**
	 * 设置字符串条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setVarchar(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		sb.append(selRuleDtl.getFieldKey());
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		list.add(selRuleDtl.getValue());
	}

	/**
	 * 设置字符串条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 */
	public void setDrop(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) {
		DataTableMetaData metaData = getHeadBase().getBusinessSource().getSourceDataTable().getMetaData();
		Integer dataType = metaData.getColumnInfo(selRuleDtl.getFieldKey()).getDataType();
		if (dataType == 1002) {
			setVarchar(sqlWhere, selRuleDtl);
		} else {
			setInteger(sqlWhere, selRuleDtl);
		}
	}

	/**
	 * 设置字典条件
	 * 
	 * @param sqlWhere
	 *            SQl条件对象
	 * @param selRuleDtl
	 *            人员选择规则明细
	 * @throws Throwable
	 */
	public void setDic(SqlWhere sqlWhere, SelRuleDtl selRuleDtl) throws Throwable {
		StringBuffer sb = sqlWhere.getSqlWhere();
		List<Object> list = sqlWhere.getValueList();
		String fieldKey = selRuleDtl.getFieldKey();
		String fieldValue = selRuleDtl.getValue();
		BusinessSourceDtl businessSourceDtl = getHeadBase().getBusinessSource().getBusinessSourceDtlMap().get(fieldKey);
		String formKey = businessSourceDtl.getParaDict();
		// 默认按照字段值是字典代码值查询对应字典OID
		String formula = "GetDictOID('" + formKey + "','Code','" + fieldValue + "')";
		Long value = TypeConvertor.toLong(getContext().getContext().getMidParser().eval(0, formula));
		// 如果没查到对应ID值，则原值为OID
		if (value <= 0) {
			value = TypeConvertor.toLong(fieldValue);
		}
		sb.append(fieldKey);
		sb.append(selRuleDtl.getOperation());
		sb.append(SqlWhere.DefaultRep);
		list.add(value);
	}
}
