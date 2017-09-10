package com.bokesoft.oa.util;

import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 账套有关工具类
 * 
 * @author minjian
 *
 */
public class Corporation {
	/**
	 * 获得账套字段的筛选条件
	 * 
	 * @param context
	 *            中间层对象
	 * @return 账套字段的筛选条件
	 * @throws Throwable
	 */
	public static String getCorpIDFilter(DefaultContext context) throws Throwable {
		// String _corpIdFilter = " (ClusterID=" +
		// context.getEnv().getClusterid() + " Or ClusterID=-1) ";
		// Yigo2.0里面暂时还没有账套概念，先不做处理
		String _corpIdFilter = "1=1";
		return _corpIdFilter;
	}

	/**
	 * 根据别名前缀获得账套字段的筛选条件
	 * 
	 * @param context
	 *            中间层对象
	 * @param fix
	 *            别名前缀
	 * @return 账套字段的筛选条件
	 * @throws Throwable
	 */
	public static String getCorpIDFilter(DefaultContext context, String fix) throws Throwable {
		String _corpIdFilter = " (" + fix + ".ClusterID=" + context.getEnv().getClusterid() + " Or " + fix
				+ ".ClusterID=-1) ";
		return _corpIdFilter;
	}
}
