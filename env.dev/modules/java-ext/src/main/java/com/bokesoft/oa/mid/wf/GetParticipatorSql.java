package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.oa.mid.GetIdExistsSql;
import com.bokesoft.oa.util.Corporation;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 获得查询参与者ID的Sql
 * 
 * @author minjian
 *
 */
public class GetParticipatorSql implements IExtService {
	/**
	 * 中间层对象
	 */
	private DefaultContext context;
	private IDBManager dbm;

	/**
	 * 获得中间层对象
	 * 
	 * @return
	 */
	public DefaultContext getContext() {
		return context;
	}

	/**
	 * 设置中间层对象
	 * 
	 * @param context
	 * @throws Throwable
	 */
	public void setContext(DefaultContext context) throws Throwable {
		dbm = context.getDBManager();
		this.context = context;
	}

	/**
	 * 获得查询操作员ID的Sql
	 */
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		setContext(context);
		String sql = "";
		String sourceKey = TypeConvertor.toString(paramArrayList.get(0));
		Long sourceId = TypeConvertor.toLong(paramArrayList.get(1));
		if (paramArrayList.size() > 2) {
			sql = getParticipatorSql(sourceKey, sourceId, TypeConvertor.toString(paramArrayList.get(2)));
		} else if (paramArrayList.size() > 3) {
			sql = getParticipatorSql(sourceKey, sourceId, TypeConvertor.toString(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)));
		} else if (paramArrayList.size() > 4) {
			sql = getParticipatorSql(sourceKey, sourceId, TypeConvertor.toString(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)));
		} else if (paramArrayList.size() > 5) {
			sql = getParticipatorSql(sourceKey, sourceId, TypeConvertor.toString(paramArrayList.get(2)),
					TypeConvertor.toString(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)),
					TypeConvertor.toString(paramArrayList.get(5)));
		}

		return sql;
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @param tag1
	 *            筛选条件1
	 * @param tag2
	 *            筛选条件2
	 * @param tag3
	 *            筛选条件3
	 * @param tag4
	 *            筛选条件4
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql(String sourceKey, Long sourceId, String tag1, String tag2, String tag3,
			String tag4) throws Throwable {
		String filter = "";
		if (!StringUtil.isBlankOrNull(sourceKey)) {
			filter = filter + " And h.SourceKey='" + sourceKey + "' ";
		}
		if (sourceId != null && sourceId > 0) {
			filter = filter + " And h.SourceId=" + sourceId;
		}
		if (!StringUtil.isBlankOrNull(tag1)) {
			filter = filter + " And h.Tag1='" + tag1 + "' ";
		}
		if (!StringUtil.isBlankOrNull(tag2)) {
			filter = filter + " And h.Tag2='" + tag2 + "' ";
		}
		if (!StringUtil.isBlankOrNull(tag3)) {
			filter = filter + " And h.Tag3='" + tag3 + "' ";
		}
		if (!StringUtil.isBlankOrNull(tag4)) {
			filter = filter + " And h.Tag4='" + tag4 + "' ";
		}
		String sqlFilter = getParticipatorSql(filter);
		String sql = "";
		if (!StringUtil.isBlankOrNull(sqlFilter)) {
			sqlFilter = sqlFilter.substring(7);
			sql = "Select OID From SYS_Operator Where " + Corporation.getCorpIDFilter(context) + " And OID In("
					+ sqlFilter + ")";
		}
		return sql;
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @param tag1
	 *            筛选条件1
	 * @param tag2
	 *            筛选条件2
	 * @param tag3
	 *            筛选条件3
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql(String sourceKey, Long sourceId, String tag1, String tag2, String tag3)
			throws Throwable {
		return getParticipatorSql(sourceKey, sourceId, tag1, tag2, tag3, "");
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @param tag1
	 *            筛选条件1
	 * @param tag2
	 *            筛选条件2
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql(String sourceKey, Long sourceId, String tag1, String tag2) throws Throwable {
		return getParticipatorSql(sourceKey, sourceId, tag1, tag2, "");
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @param tag1
	 *            筛选条件1
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */

	public String getParticipatorSql(String sourceKey, Long sourceId, String tag1) throws Throwable {
		return getParticipatorSql(sourceKey, sourceId, tag1, "");
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param sourceKey
	 *            来源的Key
	 * @param sourceId
	 *            来源的ID
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql(String sourceKey, Long sourceId) throws Throwable {
		return getParticipatorSql(sourceKey, sourceId, "");
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
	public String getdtString(DataTable dt, String colName, String sSepSign) throws Throwable {
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
	 * 获得行政组织的查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 行政组织的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String GetOptFilterForOrg(String filter) throws Throwable {
		filter = "d.OptType In(1,2)" + filter;
		String sqlFilter = "Select d.OptID As OID From OA_OperatorSel_H h LEFT JOIN OA_OperatorSel_D d ON h.oid = d.soid Where "
				+ filter;
		DataTable dt = dbm.execQuery(sqlFilter);
		String value = getdtString(dt, "OID", ",");
		String sql = "";
		if (!StringUtil.isBlankOrNull(value)) {
			// sql = "Select OID From SYS_Operator Where " +
			// Corporation.getCorpIDFilter(context)
			// + " And DeptID In (Select m.OID From OA_Department_H m Join
			// (Select OID,TLeft,Tright From OA_Department_H Where OID In("
			// + value + "))n On m.TLeft>=n.TLeft And m.TLeft <=n.TRight)";
			String departmentWhere = GetIdExistsSql.getIdExistsSql(context, "OA_Department_H", value, "dopt.DeptID");
			sql = "Select OID From SYS_Operator dopt Where " + Corporation.getCorpIDFilter(context) + " And "
					+ departmentWhere;
		}
		return sql;
	}

	/**
	 * 获得职员的查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 职员的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String GetOptFilterForEmp(String filter) throws Throwable {
		filter = "d.OptType=3" + filter;
		String sqlFilter = "Select d.OptID As OID From OA_OperatorSel_H h LEFT JOIN OA_OperatorSel_D d ON h.oid = d.soid Where "
				+ filter;
		DataTable dt = dbm.execQuery(sqlFilter);
		String value = getdtString(dt, "OID", ",");
		String sql = "";
		if (!StringUtil.isBlankOrNull(value)) {
			sql = "Select OID From SYS_Operator Where " + Corporation.getCorpIDFilter(context) + " And OID In(" + value
					+ ")";
		}
		return sql;
	}

	/**
	 * 获得人员规则的查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 人员规则的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String GetOptFilterForRule(String filter) throws Throwable {
		filter = "d.OptType=4" + filter;
		String sqlFilter = "Select Formula as OID From OA_OptRule_H Where Formula Is Not Null And OID In(Select d.OptID As OID From OA_OperatorSel_H h LEFT JOIN OA_OperatorSel_D d ON h.oid = d.soid Where "
				+ filter + ")";
		DataTable dt = dbm.execQuery(sqlFilter);
		// String value = "\"" + getdtString(dt, "OID", " Union ") + "\"";
		String value = getdtString(dt, "OID", " &\" Union \"&");
		String sql = TypeConvertor.toString(context.getMidParser().eval(0, value));
		if (StringUtil.isBlankOrNull(sql)) {
			sql = "";
		}
		return sql;
	}

	/**
	 * 获得人员集合的查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 人员集合的查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String GetOptFilterForPublic(String filter) throws Throwable {
		filter = "d.OptType=5" + filter;
		String sqlFilter = "Select o.OID From Sys_Operator o join OA_OptPublic_D p  on o.EmpID=p. OperatorID Where p.SOID In(Select d.OptID As ID From OA_OperatorSel_H h LEFT JOIN OA_OperatorSel_D d ON h.oid = d.soid Where "
				+ filter + ")";
		DataTable dt = dbm.execQuery(sqlFilter);
		String value = getdtString(dt, "OID", ",");
		String sql = "";
		if (!StringUtil.isBlankOrNull(value)) {
			sql = "Select OID From SYS_Operator Where " + Corporation.getCorpIDFilter(context) + " And OID In(" + value
					+ ")";
		}
		return sql;
	}

	/**
	 * 获得查询操作员ID的Sql
	 * 
	 * @param filter
	 *            筛选条件
	 * @return 查询操作员ID的Sql
	 * @throws Throwable
	 */
	public String getParticipatorSql(String filter) throws Throwable {
		String value = GetOptFilterForOrg(filter);
		String sql = "";
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = GetOptFilterForEmp(filter);
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = GetOptFilterForRule(filter);
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		value = GetOptFilterForPublic(filter);
		if (!StringUtil.isBlankOrNull(value)) {
			sql = sql + " Union " + value;
		}
		return sql;
	}
}
