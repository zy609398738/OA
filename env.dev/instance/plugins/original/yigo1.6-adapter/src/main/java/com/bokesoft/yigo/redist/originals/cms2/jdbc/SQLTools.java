package com.bokesoft.yigo.redist.originals.cms2.jdbc;

import java.sql.Connection;
import java.sql.ParameterMetaData;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.yigo.redist.originals.cms2.data.ValueExtractor;
import com.bokesoft.yigo.redist.originals.cms2.str.StringTemplate;

/**
 * @see /ecomm/branches/20160119-trunk-2.0/modules/backend/core/src/main/java/com/bokesoft/cms2/basetools/jdbc/SQLTools.java,
 *      revision 46956.
 */
public class SQLTools {
	private static final Logger logger = LoggerFactory.getLogger(SQLTools.class);

	private SQLTools(){}
	
	/**
	 * 将 SQL 语句中 ${VarName} 形式的占位符转化为 JDBC PreparedStatement 支持的 "?",
	 * 同时根据上下文环境中的变量获得 PreparedStatement 执行参数的列表
	 * @param conn
	 * @param sql
	 * @param values
	 * @return
	 * @throws SQLException
	 */
	public static final TransSqlResult transferSql(Connection conn, String sql, ValueExtractor values) throws SQLException{
		PreparedStatement pstmt = null;
		try{
			StringTemplate st = new StringTemplate(sql, StringTemplate.REGEX_PATTERN_JAVA_STYLE);
			String[] vars = st.getVariables();
			String[] varList = st.getVariablesInOrder();
			int nonSqlParamsCount = 0; // 统计哪些参数不是 PrepareStatement 中的变量
			// 替换 SQL 语句中的变量(${...} 或 ${#...})
			for (int i = 0; i < vars.length; i++) {
				String var = vars[i];
				if (var.startsWith("#")) {
					nonSqlParamsCount += 1;
					// 使用 “#” 开头的变量代表直接替换的字符串, 而不是 PrepareStatement 中的变量
					Object obj = values.get(var);
					if (null != obj) {
						st.setVariable(var, obj.toString());
					}
				} else {
					// 将 SQL 中的占位符都替换为 “？”
					st.setVariable(vars[i], "?");
				}
			}
			String pSql = st.getParseResult();
			//PATCH: 在 SQL Server 中 SQL 语句开头存在空格或Tab字符会导致 pstmt.getParameterMetaData() 报错: "无法识别元数据的表"
			pSql = pSql.trim();
			// 准备 PrepareStatement 的执行参数
			pstmt = conn.prepareStatement(pSql);
			ParameterMetaData pMeta = pstmt.getParameterMetaData();
			if (pMeta.getParameterCount() != (varList.length - nonSqlParamsCount)) {
				throw new SQLException("SQL 语句 [" + sql + "] 无法正确解析参数 [" + pSql+ "]");
			}
			List<Object> params = new ArrayList<Object>();
			for (int i = 0; i < varList.length; i++) {
				String varName = varList[i];
				if (varName.startsWith("#")) {
					continue; // “#”开头的变量不是 PrepareStatement 变量
				}
				String varType = null;
				int typeIndex = varName.indexOf(':');
				if (typeIndex > 1) { // 支持类似 ${VARCHAR:userName} 这样的语法强制指定数据类型
					varType = varName.substring(0, typeIndex).toUpperCase();
					varName = varName.substring(typeIndex + 1);
				}
				// 自动获取数据类型
				if (null == varType) {
					try {
						// FIXME: ojdbc14 不支持的 feature - ParameterMetaData.getParameterTypeName(int)
						varType = pMeta.getParameterTypeName(i + 1);
					} catch (SQLException ex) {
						String errMsg =
								"获取变量: '" + varName + "' 数据类型时出错 ["+ ex.getClass().getSimpleName() + "]"
								+ " - "+ ex.getMessage();
						logger.warn(errMsg);
					}
				}
				Object value = values.get(varName);
				if (null == value) {
					throw new SQLException("找不到变量: " + varName + "(" + sql + ")");
				}
				if (null != varType) {
					value = JDBCConverter.jdbcObjectConvert(value, varType);
				} else {
					// 只能保持上下文取到的变量的原始类型
				}
				params.add(value);
			}
			//返回数据
			TransSqlResult result = new TransSqlResult();
			result.parameterValues = params;
			result.preparableSql = pSql;
			return result;
		}finally{
			if (null!=pstmt){
				pstmt.close();
			}
		}
	}
	
	public static class TransSqlResult {
		private String preparableSql;
		private List<Object> parameterValues;
		/**
		 * 获取可以直接用于 jdbc {@link PreparedStatement} 的 sql 语句, 其中使用 "?" 代表参数
		 * @return
		 */
		public String getPreparableSql() {
			return preparableSql;
		}
		/**
		 * 获取 SQL 语句中 "?" 参数对应的数值
		 * @return
		 */
		public List<Object> getParameterValues() {
			return parameterValues;
		}
	}
}
