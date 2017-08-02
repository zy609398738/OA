package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 业务来源
 * 
 * @author zhoukaihe
 *
 */
public class BusinessSource extends DicBase {
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
	 * 业务来源明细表集合
	 */
	private BusinessSourceDtlMap businessSourceDtlMap;

	/**
	 * 业务来源明细表集合
	 * 
	 * @return 业务来源明细表集合
	 * @throws Throwable
	 */
	public BusinessSourceDtlMap getBusinessSourceDtlMap() throws Throwable {
		if (businessSourceDtlMap == null) {
			businessSourceDtlMap = new BusinessSourceDtlMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_BusinessSource_D where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				businessSourceDtlMap.loadData(dtlDt);
			}
		}
		return businessSourceDtlMap;
	}

	/**
	 * 业务来源明细表集合
	 * 
	 * @param businessSourceDtlMap
	 *            业务来源明细表集合
	 */
	public void setBusinessSourceDtlMap(BusinessSourceDtlMap businessSourceDtlMap) {
		this.businessSourceDtlMap = businessSourceDtlMap;
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
		getBusinessSourceDtlMap().loadData(dtlDt);
	}

	/**
	 * 构造业务来源对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public BusinessSource(OAContext context) {
		super(context);
	}

}
