package com.bokesoft.yigo.redist.originals.myscm;

import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.myerp.dev.mid.IMidContext;

/**
 * 涉及数据库访问的基本工具
 * @see /Yigo-redist/trunk/Yigo-redist/products/configs/tmpl-myscm/config-lib/Module/SCM/Java/Source/com/bokesoft/yigo/redist/mid/DBTools.java,
 *      revision 4872 .
 */
public class DBTools {
    /**
     * 从 SQL 执行结果中获得单独的值(第一行第一列)
     * @param sql
     * @param params
     * @return 如果查不到数据, 返回 null
     * @throws Throwable 
     */
    public static Object getSingleResult(IMidContext midCtx, String sql, Object[] params) throws Throwable{
        BKRowSet rs = midCtx.getPrepareResultSet(sql, params);
        if (rs.bkFirst()){
            return rs.bkGetObject(1);
        }else{
            return null;
        }
    }
    
    /**
     * 执行指定 SQL 并确保只影响一条记录
     * @param midCtx
     * @param sql
     * @param params
     * @return 影响的记录数
     * @throws Throwable 
     */
    public static int executeWithSingleRecord(IMidContext midCtx, String sql, Object[] params) throws Throwable{
        return executeWithRecords(midCtx, sql, params, 1);
    }
    /**
     * 执行指定的 SQL, 并检查受影响的记录数是否等于预期
     * @param midCtx
     * @param sql
     * @param params
     * @param exceptedRows 预期影响的记录数
     * @return 影响的记录数
     * @throws Throwable 
     */
    public static int executeWithRecords(IMidContext midCtx, String sql, Object[] params, int exceptedRows) throws Throwable{
        return executeWithRecords(midCtx, sql, params, exceptedRows, exceptedRows);
    }
    /**
     * 执行指定的 SQL, 并检查受影响的记录数是否在预期范围内
     * @param midCtx
     * @param sql
     * @param params
     * @param minxExceptedRows 预期最少的受影响记录数
     * @param maxExceptedRows 预期最多的受影响记录数
     * @return
     * @throws Throwable 
     */
    public static int executeWithRecords
    	(IMidContext midCtx, String sql, Object[] params, int minxExceptedRows, int maxExceptedRows) throws Throwable{
        int cnt = _executeWithRecords(midCtx, sql, params);
        if ( (cnt>=minxExceptedRows)&&(cnt<=maxExceptedRows) ){
            return cnt;
        }else{
            String exMsg = minxExceptedRows + " - " + maxExceptedRows;
            if (minxExceptedRows==maxExceptedRows){
                exMsg = minxExceptedRows+"";
            }
            throw new RuntimeException(
                "更新失败 - 受影响的记录数不符合预期:\nSQL: "+sql+";\n预期记录数: "+exMsg+";\n实际记录数: "+cnt);
        }
    }
    private static int _executeWithRecords(IMidContext midCtx, String sql, Object[] params) throws Throwable{
        int cnt = midCtx.executePrepareUpdate(sql, params);
        return cnt;
    }

}
