package com.bokesoft.yigo.rt01.utils;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContext;
import com.bokesoft.myerp.mid.BillMidLib.MBillContext;
import com.bokesoft.yigo.redist.originals.cms.yigo.YigoHelper;
import com.bokesoft.yigo.redist.originals.cms2.data.ValueExtractor;
import com.bokesoft.yigo.redist.originals.cms2.jdbc.SQLTools;
import com.bokesoft.yigo.redist.originals.cms2.jdbc.SQLTools.TransSqlResult;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;
import com.bokesoft.yigo.rt01.db.MidContextDBOptions;
import com.bokesoft.yigo.rt01.db.MidContextValueExtractor;

import jodd.typeconverter.TypeConverterManager;

/**
 * 执行 SQL 语句进行查询或者数据操作的相关功能;<br/>
 * SQL 支持使用 "${...}" 和 "${#...}" 两种方式的上下文参数, 参考 {@link SQLTools#transferSql(Connection, String, ValueExtractor)}
 */
public class CtxDBUtils {
	/**
	 * 通过上下文获取 SQL 语句中的参数, 执行 SQL 查询
	 * @param options
	 * @return
	 */
	public static BKRowSet query(MidContextDBOptions options){
		try {
			IMidContext ctx = options.getCtx();
			TransSqlResult tsr = _transSql(ctx, options.getDoc(), options.getAdditionParams(), options.getSql());
			BKRowSet rs = ctx.getPrepareResultSet(tsr.getPreparableSql(), tsr.getParameterValues().toArray());
			
			int rows = rs.bkSize();
			_checkRows(rows, options);
			
			return rs;
		} catch (Throwable e) {
			Misc.throwRuntime(e);
			return null;	//Unreachable code
		}
	}
	
	/**
	 * 通过上下文获取 SQL 语句中的参数, 执行 SQL 操作
	 * @param options
	 * @return
	 */
	public static int execute(MidContextDBOptions options){
		try {
			IMidContext ctx = options.getCtx();
			TransSqlResult tsr = _transSql(ctx, options.getDoc(), options.getAdditionParams(), options.getSql());
			int rows = ctx.executePrepareUpdate(tsr.getPreparableSql(), tsr.getParameterValues().toArray());
			_checkRows(rows, options);
			return rows;
		} catch (Throwable e) {
			Misc.throwRuntime(e);
			return -1;	//Unreachable code
		}
	}
	
	private static TransSqlResult _transSql(IMidContext ctx, IDocument doc, Map<String, Object> additionParams, String sql) throws Throwable{
		MBillContext mctx = ((MidContext)ctx).getBillContext();
		TransSqlResult tsr = SQLTools.transferSql(
				mctx.getDBM().getConnection(), sql, new MidContextValueExtractor(ctx, doc, additionParams));
		return tsr;
	}
	
	private static void _checkRows(int rows, MidContextDBOptions options){
		int min = options.getMinRows();
		int max = options.getMaxRows();
		if ( rows>=min && rows <= max ){
			//符合定义的返回数据行数范围
		}else{
			throw new RuntimeException("SQL 语句的执行结果不符合预计的范围 '"+min+"' ~ '"+max+"'");
		}
	}
	
	/**
	 * 通过上下文获取 SQL 语句中的参数, 执行 SQL 查询, 返回第一行第一列的数据
	 * @param options
	 * @return 如果查找不到任何数据, 返回 null
	 */
	public static Object queryOneValue(MidContextDBOptions options){
		try{
			BKRowSet rs = query(options);
			if (rs.bkFirst()){
				return rs.bkGetObject(1);
			}else{
				return null;
			}
		}catch(Throwable e){
			Misc.throwRuntime(e);
			return -1;	//Unreachable code
		}
	}
	/**
	 * {@link #queryOneValue(MidContextDBOptions)} 的指定返回内心版本
	 * @param options
	 * @param classType
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T queryOneValue(MidContextDBOptions options, Class<T> classType){
		Object obj = queryOneValue(options);
		if (null==obj){
			return null;
		}else if (classType.isInstance(obj)){
			return (T) obj;
		}else{
			return TypeConverterManager.convertType(obj, classType);
		}
	}
	
	/**
	 * 通过上下文获取 SQL 语句中的参数, 执行 SQL 查询, 返回第一行的数据
	 * @param options
	 * @return 如果查找不到任何数据, 返回 null
	 */
	public static Map<String, Object> queryOneLine(MidContextDBOptions options){
		List<Map<String, Object>> lom = queryAsList(options);
		if (lom.size()>=1){
			return lom.get(0);
		}else{
			return null;
		}
	}
	
	/**
	 * 通过上下文获取 SQL 语句中的参数, 执行 SQL 查询, 返回 List
	 * @param options
	 * @return 如果查找不到任何数据, 返回空的 List
	 */
	public static List<Map<String, Object>> queryAsList(MidContextDBOptions options){
		try{
			BKRowSet rs = query(options);
			List<Map<String, Object>> lom = YigoHelper.wrapBKRowSet(rs);
			return lom;
		}catch(Throwable e){
			Misc.throwRuntime(e);
			return null;	//Unreachable code
		}
	}

}
