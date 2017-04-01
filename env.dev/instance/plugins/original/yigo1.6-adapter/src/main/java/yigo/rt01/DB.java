package yigo.rt01;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.myerp.dev.mid.AbstractCustomContextAction;
import com.bokesoft.yigo.rt01.db.MidContextDBOptions;
import com.bokesoft.yigo.rt01.utils.CtxDBUtils;

/**
 * 一些和数据库操作相关的公式, 支持参数化的 SQL(在字符串中通过 ${参数名} 方式指定变量的 SQL 语句), 避免容易出错的 SQL 字符串拼接: <br>
 *  1)参数名支持当前上下文中的 ExtraValue 和 单据字段值(注意是字段的 Key, 不是数据源列名); <br>
 *  2)一般情况下参数是通过 JDBC prepareStatement 设置到 SQL 语句的, 因此可以有效避免 SQL 注入; <br>
 *  3)支持自动的数据类型检测和转换, 字符串不需要使用单引号, 日期/时间也不需要根据不同数据库使用不同的格式; <br>
 *  4)对于不容易确定数据类型的情况, 支持通过 "${类型:" 的方式强制指定数据类型, 例如 ${TIMESTAMP:ConfirmDateTime} <br>
 *  5)使用 "#" 开头的参数会直接拼入 SQL 字符串, 这种情况可以用于参数化的数据库表名/字段名, 或者用于 IN 子句中; <br>
 *  6)使用 "=" 开头的参数会作为公式进行计算, 比如明细表中的值无法直接通过 ${字段Key} 引用, 但是通过使用公式就可以实现; <br>
 *  7)可以组合使用 "#=", 这时公式执行的结果就会作为字符串直接拼接到 SQL 中.
 */
public class DB extends AbstractCustomContextAction{
	/**
	 * 查询第一行数据中的某列, 类似于 Yigo 自带的 DBQuery 公式.
	 * @param sql 参数化的 SQL 语句
	 * @param colName 需要返回数据的数据库查询结果列
	 * @return 第一行数据中的该列的值
	 * @throws Throwable 
	 */
	public Object Query(String sql, String colName) throws Throwable{
		Map<String, Object> line = CtxDBUtils.queryOneLine(
				MidContextDBOptions.create(getMidContext()).setSql(sql));
		if (null==line){
			return "";
		}else{
			return line.get(colName);
		}
	}
	
	/**
	 * 查询后将某列的数据按照行的先后顺序, 使用分隔符连接起来, 作为字符串列表返回; , 类似于 Yigo 自带的 DBQuery 公式.
	 * @param sql 参数化的 SQL 语句
	 * @param colName 需要返回数据的数据库查询结果列
	 * @param separator 多行结果的连接字符串
	 * @return 所有行数据中的该列的值, 通过连接字符串合并为一个字符串
	 * @throws Throwable
	 */
	public String Query(String sql, String colName, String separator)throws Throwable{
		List<Map<String, Object>> data = CtxDBUtils.queryAsList(
				MidContextDBOptions.create(getMidContext()).setSql(sql));
		List<String> result = new ArrayList<String>(); 
		for(Map<String, Object> line: data){
			Object val = line.get(colName);
			if (null==val){
				val = "";
			}
			result.add(val.toString());
		}
		String strList = StringUtils.join(result, separator);
		return strList;
	}
	
	/**
	 * 执行 SQL 语句操作, 类似于 Yigo 自带的 DBSql 公式
	 * @param sql 参数化的 SQL 语句
	 * @return SQL 操作影响的数据行数
	 * @throws Throwable 
	 */
	public int Update(String sql) throws Throwable{
		int rows = CtxDBUtils.execute(
				MidContextDBOptions.create(getMidContext()).setSql(sql));
		return rows;
	}
}
