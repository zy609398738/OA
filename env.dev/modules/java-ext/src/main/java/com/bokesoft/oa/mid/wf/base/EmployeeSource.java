package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员来源
 * 
 * @author zhoukaihe
 *
 */
public class EmployeeSource extends DicBase {
	/**
	 * 来源语句
	 */
	private String sourcesql;

	/**
	 * 来源语句
	 * 
	 * @return 来源语句
	 */

	public String getSourcesql() {
		return sourcesql;
	}

	/**
	 * 来源语句
	 * 
	 * @param sourcesql
	 *            来源语句
	 */

	public void setSourcesql(String sourcesql) {
		this.sourcesql = sourcesql;
	}

	/**
	 * 来源数据集，根据来源语句或的数据集，默认情况下内容为空，只使用数据集的结构
	 */
	private DataTable sourceDataTable;

	/**
	 * 来源数据集，根据来源语句或的数据集，默认情况下内容为空，只使用数据集的结构
	 * 
	 * @return 来源数据集
	 */
	public DataTable getSourceDataTable() {
		return sourceDataTable;
	}

	/**
	 * 来源数据集，根据来源语句或的数据集，默认情况下内容为空，只使用数据集的结构
	 * 
	 * @param sourceDataTable
	 *            来源数据集
	 */
	public void setSourceDataTable(DataTable sourceDataTable) {
		this.sourceDataTable = sourceDataTable;
	}

	/**
	 * 人员来源明细表集合
	 */
	private EmployeeSourceDtlMap employeeSourceDtlMap;

	/**
	 * 人员来源明细表集合
	 * 
	 * @return 人员来源明细表集合
	 * @throws Throwable
	 */
	public EmployeeSourceDtlMap getEmployeeSourceDtlMap() throws Throwable {
		if (employeeSourceDtlMap == null) {
			employeeSourceDtlMap = new EmployeeSourceDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_EmployeeSource_D where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				employeeSourceDtlMap.loadData(dtlDt);
			}
		}
		return employeeSourceDtlMap;
	}

	/**
	 * 人员来源明细表集合
	 * 
	 * @param employeeSourceDtlMap
	 *            人员来源明细表集合
	 */
	public void setEmployeeSourceDtlMap(EmployeeSourceDtlMap employeeSourceDtlMap) {
		this.employeeSourceDtlMap = employeeSourceDtlMap;
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
		String sql = dt.getString("SourceSql");
		setSourcesql(sql);
		sql = "select * from (" + sql + ") SourceTable where 1=2";
		DataTable sourceDataTable = getContext().getContext().getDBManager().execPrepareQuery(sql);
		setSourceDataTable(sourceDataTable);
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
		getEmployeeSourceDtlMap().loadData(dtlDt);
	}

	/**
	 * 构造人员来源对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public EmployeeSource(OAContext context) {
		super(context);
	}

}
