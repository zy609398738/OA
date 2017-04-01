package yigo.rt01;

import java.util.Map;

import com.bokesoft.myerp.dev.mid.AbstractCustomContextAction;
import com.bokesoft.yigo.rt01.sqlmorphing.MorphingConfigVO.DataSourceConfig;
import com.bokesoft.yigo.rt01.sqlmorphing.SqlMorphingImpl;

/**
 * 通过 SQL 语句执行 Yigo document 的变换(基于当前的 Document 上下文转换得到一个新的 document 对象)
 */
public class SqlMph extends AbstractCustomContextAction {
	/**
	 * 执行转换动作, 产生一个新的 document 对象
	 * @param confFile 一个定义如何转换的 yaml 文件的路径;
	 *         默认情况下是基于配置目录 /Module/SCM/SqlMorphing 的(参考 {@link SqlMorphingImpl#DEFAULT_SQL_MORPHING_YAML_DIR}),
	 *         可以使用相对目录
	 * @param callback 回调表达式, 注意这个表达式执行时上下文时转换后产生的那个 document 而不是原来的 document
	 * @return 新产生的 document 的 BillID
	 * @throws Throwable 
	 */
	public int Transfer(String confFile) throws Throwable{
		return SqlMorphingImpl.doTransfer(getMidContext(), confFile);
	}
	
	/**
	 * 在明细表执行转换的过程中, 可以在每一行的 {@link DataSourceConfig#getIdFormula()} 中通过此公式获得当前转换来源数据各个字段的值
	 * @param dbColName 数据库查询结果字段名(列名)
	 * @return 明细数据中正在处理的这一行的该列的值
	 * @throws Throwable
	 */
	public Object DtlDBValue(String dbColName) throws Throwable{
		Map<String, Object> currentLine = SqlMorphingImpl.CURRENT_LINE_IN_THREAD.get();
		Object result = currentLine.get(dbColName);
		return result;
	}
}
