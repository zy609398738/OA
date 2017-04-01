package com.bokesoft.r2.yigo2.extension.impl;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bokesoft.yigo.parser.BaseFunImplCluster;

public class BaseStaticWrapperMidFuncImplCluster extends BaseFunImplCluster{
	private String formulaPrefix;
	private Class<?>[] wrappers;

	public BaseStaticWrapperMidFuncImplCluster(String formulaPrefix, Class<?>[] wrappers){
		this.formulaPrefix = formulaPrefix;
		this.wrappers = wrappers;
	}
	
	@Override
	public Object[][] getImplTable() {
		Map<String, BaseStaticWrapperMidFuncRunner> formulaMap = new HashMap<String, BaseStaticWrapperMidFuncRunner>();
		//所有公式类中的 public static 方法都作为公式, 公式名前面加上 "<prefix>.类名." 前缀
		for (int i = 0; i < wrappers.length; i++) {
			@SuppressWarnings("rawtypes")
			Class formulaClass = wrappers[i];
			Method[] methods = formulaClass.getMethods();
			for (int j = 0; j < methods.length; j++) {
				Method m = methods[j];
				//组合成一个 <prefix>.XXXExp.XXX 这样的公式名称
				int modifiers = m.getModifiers();
				if (Modifier.isPublic(modifiers) && Modifier.isStatic(modifiers)){
					String methodName = m.getName();
					String fName = BaseStaticWrapperMidFuncRunner.getFormulaName(formulaPrefix, formulaClass, methodName);
					if (! formulaMap.containsKey(fName)){
						formulaMap.put(fName, new BaseStaticWrapperMidFuncRunner(formulaPrefix, formulaClass, methodName));
					}
					//不包含 "." 的 formula name, 比较符合 Yigo2 的习惯
					String nName = BaseStaticWrapperMidFuncRunner.getNarrowFormulaName(formulaPrefix, formulaClass, methodName);
					if (! formulaMap.containsKey(nName)){
						formulaMap.put(nName, new BaseStaticWrapperMidFuncRunner(formulaPrefix, formulaClass, methodName));
					}
				}
			}
		}
		
		List<Object[]> formulaList = new ArrayList<Object[]>();
		for(Map.Entry<String, BaseStaticWrapperMidFuncRunner> en: formulaMap.entrySet()){
			formulaList.add(new Object[]{en.getKey(), en.getValue()});
		}
		
		return formulaList.toArray(new Object[][]{});
	}
}
