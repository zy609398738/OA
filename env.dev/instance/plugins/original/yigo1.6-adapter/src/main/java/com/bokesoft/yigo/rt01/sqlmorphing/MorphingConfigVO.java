package com.bokesoft.yigo.rt01.sqlmorphing;

import java.util.Map;

import org.yaml.snakeyaml.Yaml;

/**
 * YAML 格式定义的转换配置
 */
public class MorphingConfigVO {
	/** 目标单据的 BillKey */
	private String targetBillKey;
	/** 针对每个数据源的定义, Key 为数据源的名称 */
	private Map<String, DataSourceConfig> dataSources;
	/** 回调表达式, 注意这个表达式执行时上下文时转换后产生的目标 document 而不是原来的来源 document */
	private String callbackFormula;

	public String getTargetBillKey() {
		return targetBillKey;
	}
	public void setTargetBillKey(String targetBillKey) {
		this.targetBillKey = targetBillKey;
	}
	public Map<String, DataSourceConfig> getDataSources() {
		return dataSources;
	}
	public void setDataSources(Map<String, DataSourceConfig> datasources) {
		this.dataSources = datasources;
	}
	public String getCallbackFormula() {
		return callbackFormula;
	}
	public void setCallbackFormula(String callbackFormula) {
		this.callbackFormula = callbackFormula;
	}

	@Override
	public String toString() {
		Yaml yaml = new Yaml();
		String s = yaml.dump(this);
		return s;
	}

	public static class DataSourceConfig {
		/**
		 * 一个公式, 返回目标单据数据源的 ID, 用于确定应该新增还是应该修改目标数据源记录;
		 * 一般情况下, 对于头表这个 ID 就是 BillID, 对于明细表则是 BillDtlID;
		 * 注意：这个公式是在来源 document 的上下文中执行的
		 */
		private String idFormula;
		
		/** 用于查询对应数据源表的字段值的 SQL 语句 */
		private String dataSql;

		public String getIdFormula() {
			return idFormula;
		}
		public void setIdFormula(String targetIdFormula) {
			this.idFormula = targetIdFormula;
		}
		public String getDataSql() {
			return dataSql;
		}
		public void setDataSql(String buildSql) {
			this.dataSql = buildSql;
		}

		@Override
		public String toString() {
			Yaml yaml = new Yaml();
			String s = yaml.dump(this);
			return s;
		}
	}
}
