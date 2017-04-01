package com.bokesoft.r2.yigo2.extension.impl;

import org.apache.commons.lang3.reflect.MethodUtils;

import com.bokesoft.r2.yigo2.extension.cms2.util.Misc;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class BaseStaticWrapperMidFuncRunner extends BaseMidFunctionImpl {
	private String formulaPrefix;
	private Class<?> clazz;
	private String method;

	public BaseStaticWrapperMidFuncRunner(String formulaPrefix, Class<?> clazz, String method){
		this.formulaPrefix = formulaPrefix;
		this.clazz = clazz;
		this.method = method;
	}

	@Override
	public Object evalImpl(String name, DefaultContext ctx, Object[] args, IExecutor executor) throws Throwable {
		Misc.$assert(
			( (! method.equals(name) )
					&& (! getNarrowFormulaName(this.formulaPrefix, clazz, method).equals(name) ) ),
			"公式名 '"+name+"' 与当前实现(class='"+clazz.getSimpleName()+"', method='"+method+"')不匹配"
		);
		if (null==args){
			args = new Object[0];
		}
		
		try{
			//首先测试第一个参数是 ctx 的方法
			Object[] argsWithCtx = new Object[args.length+1];
			argsWithCtx[0] = ctx;
			for (int i = 0; i < args.length; i++) {
				argsWithCtx[i+1] = args[i];
			}
			Object result = MethodUtils.invokeStaticMethod(clazz, method, argsWithCtx);
			return result;
		}catch(NoSuchMethodException ne){
			Object result = MethodUtils.invokeStaticMethod(clazz, method, args);
			return result;
		}
	}
	
	protected static String getNarrowFormulaName(String prefix, Class<?> formulaClass, String methodName) {
		return prefix + formulaClass.getSimpleName() + "" + methodName;
	}

	protected static String getFormulaName(String prefix, Class<?> formulaClass, String methodName) {
		return prefix+ "." + formulaClass.getSimpleName() + "." + methodName;
	}

}