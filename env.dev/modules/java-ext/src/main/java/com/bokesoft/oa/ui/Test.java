package com.bokesoft.oa.ui;

import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.view.expr.BaseViewFunctionImpl;
import com.bokesoft.yigo.view.expr.ViewEvalContext;

/**
 * OA公式测试
 * 
 * @author minjian
 *
 */
public class Test extends BaseViewFunctionImpl {

	@Override
	public Object evalImpl(String paramString, ViewEvalContext paramViewEvalContext, Object[] paramArrayOfObject,
			IExecutor paramIExecutor) throws Throwable {
		System.out.println("aaa");
		return true;
	}

}
