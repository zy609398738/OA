package com.bokesoft.oa.mid.formula;

import com.bokesoft.oa.mid.im.IMAction;
import com.bokesoft.oa.modules.todo.TodoMidExp;
import com.bokesoft.r2.yigo2.extension.BaseStaticWrapperMidFuncRegistry;

public class OAFuncRegistery extends BaseStaticWrapperMidFuncRegistry {

	/** OA2.0 提供的各类公式的前缀 */
	private static final String OA_EXP_PREFIX = "oa";
	/**
	 * OA2.0中内置公式的实现类集合
	 */
	private static Class<?>[] OA_EXP_CLASSES = new Class<?>[] { TodoMidExp.class, IMAction.class };

	@Override
	protected String getFormulaPrefix() {
		return OA_EXP_PREFIX;
	}

	@Override
	protected Class<?>[] getWrappers() {
		return OA_EXP_CLASSES;
	}

}
