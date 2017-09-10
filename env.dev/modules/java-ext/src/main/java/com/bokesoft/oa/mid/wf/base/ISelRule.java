package com.bokesoft.oa.mid.wf.base;

import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 选择规则的接口
 * 
 * @author minjian
 *
 */
public interface ISelRule {
	/**
	 * 获得操作员集合
	 * 
	 * @param oaContext
	 *            上下文对象
	 * @param selRule
	 *            选择规则对象
	 * @param opteratorSet
	 *            已有的操作员集合
	 * @param businessDt
	 *            业务来源数据集
	 * @param operatorDt
	 *            用户来源数据集，如果未设置，将会是null
	 * @param oid
	 *            当前单据oid
	 * @return 操作员集合
	 * @throws Throwable
	 */
	public Set<Long> getOpteratorSet(OAContext oaContext, SelRule selRule, Set<Long> opteratorSet, DataTable businessDt,
			DataTable operatorDt, Long oid) throws Throwable;
}
