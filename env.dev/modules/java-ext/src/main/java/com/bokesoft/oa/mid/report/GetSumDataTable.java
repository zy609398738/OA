package com.bokesoft.oa.mid.report;

import com.bokesoft.oa.base.Names;
import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.oa.util.SqlParse;
import com.bokesoft.yes.struct.condition.ConditionPairTable;
import com.bokesoft.yes.struct.condition.ConditionTableUtil;
import com.bokesoft.yes.tools.preparesql.PrepareSQL;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.base.IServiceContext;
import com.bokesoft.yigo.mid.extend.IMidProcess;
import com.bokesoft.yigo.struct.condition.ConditionParas;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 根据列名获得查询内容的字符串
 * 
 * @author minjian
 *
 */
public class GetSumDataTable implements IMidProcess<IServiceContext> {
	/**
	 * 模块的Key
	 */
	private String moduleKey = "OA";

	/**
	 * 模块的Key
	 * 
	 * @return 模块的Key
	 */
	public String getModuleKey() {
		return moduleKey;
	}

	/**
	 * 模块的Key
	 * 
	 * @param moduleKey
	 *            模块的Key
	 */
	public void setModuleKey(String moduleKey) {
		this.moduleKey = moduleKey;
	}

	@Override
	public Object process(IServiceContext context) throws Throwable {
		DefaultContext contextD = (DefaultContext) context;
		return getSumDataTable(contextD);
	}

	/**
	 * 根据列名获得查询内容的字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param sql
	 *            SQL语句
	 * @param fieldName
	 *            列名称
	 * @param sep
	 *            分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public DataTable getSumDataTable(DefaultContext context) throws Throwable {
		ConditionParas conditionParas = context.getConditionParas();
		String formKey = context.getFormKey();
		Settings settings = Configuration.getConfiguration(getModuleKey()).getMap("Report").getMap("Sum")
				.getMap(formKey);
		String sql = settings.getProperty("Sql");

		PrepareSQL prepareSQL = new PrepareSQL();
		if (conditionParas != null && conditionParas.size() > 0) {
			String conditionFormKey = conditionParas.getConditionFormKey();
			MetaForm metaForm = context.getVE().getMetaFactory().getMetaForm(conditionFormKey);
			ConditionPairTable conditionPairTable = ConditionTableUtil.createPairTable(metaForm, conditionParas);
			MetaTable metaTable = context.getDataObject().getTable(conditionFormKey);
			SqlParse sqlParse = new SqlParse(sql, metaTable, conditionPairTable, prepareSQL);
			String filter1 = sqlParse.getFilter(context);
			sql = sqlParse.getSql(context);
			if (filter1 != null && filter1.length() > 0) {
				sql = SqlParse.appendFilter(sql, filter1);
				Names names = sqlParse.getColNames();
				sql = getSql(context, settings, sql, metaTable, names);
			}
		} else {
			Names names = new Names();
			MetaTable metaTable = context.getDataObject().getTable(formKey);
			sql = getSql(context, settings, sql, metaTable, names);
		}

		DataTable dt = context.getDBManager().execPrepareQuery(sql, prepareSQL.getPrepareValues());
		return dt;
	}

	public String getSql(DefaultContext context, Settings settings, String sql, MetaTable metaTable, Names names)
			throws Throwable {
		Names sumNames = new Names(settings.getProperty("SumColName"));
		Names groupNames = new Names();
		names = SqlParse.getSumNames(context, settings, metaTable, names, groupNames, sumNames);
		String groupStr = groupNames.getNames();
		if (groupStr.length() > 0) {
			groupStr = " group by " + groupStr;
		}
		sql = "select " + names.getNames() + "," + sumNames.getNames() + " from (" + sql + ") SumDataTable" + groupStr;
		return sql;
	}
}
