package com.bokesoft.r2.yigo2.extension.cms2.util;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 杂项小功能
 * @see /ecomm/branches/20160119-trunk-2.0/modules/backend/core/src/main/java/com/bokesoft/cms2/basetools/util/Misc.java,
 *      revision 46956.
 */
public class Misc {
	private Misc(){}

	/**
	 * 用于 catch 各种 Exception 并转换为 RuntimeException 抛出
	 * @param t
	 * @throws RuntimeException
	 */
	public static void throwRuntime(Throwable throwable) throws RuntimeException {
		if (throwable instanceof RuntimeException) {
	        throw (RuntimeException) throwable;
	    }
	    throw new RuntimeException(throwable);
	}

	/**
	 * 逐层寻找异常对象的真正原因, 直到找到指定的类型停止; 如果找不到指定的类型, 返回 null
	 * @param topEx 顶层的错误对象
	 * @param stopLevel
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T findCause(Throwable topEx, Class<T> stopLevel){
		Throwable cause = topEx;
		while(null!=cause){
			if (stopLevel.isInstance(cause)){
				return (T) cause;
			}
			if (cause instanceof InvocationTargetException){
				InvocationTargetException ite = (InvocationTargetException)cause;
				cause = ite.getTargetException();
			}else{
				cause = cause.getCause();
			}
		}
		return null;
	}

	/**
	 * 用于模拟 Java 的 assert 机制, 主要是避免“assert 需要在运行时候显式开启(-ea)”的问题
	 * @param condition
	 * @param message
	 * @throws RuntimeException
	 */
	public static void $assert(boolean condition, String message) throws RuntimeException{
		if (condition){
			throw new RuntimeException(message);
		}
	}

	/**
	 * 任意对象转化为字符串
	 * @param o
	 * @return
	 */
	public static String toStr(Object o){
		if (null==o){
			return null;
		}else if (o instanceof String){
			return (String) o;
		}else{
			return o.toString();
		}
	}

	/**
	 * 任意对象转化为整数
	 * @param o
	 * @return
	 */
	public static Integer toInt(Object o){
		if (null==o){
			return null;
		}else if (o instanceof Number){
			Number n = (Number)o;
			return n.intValue();
		}else{
			return Integer.valueOf(o.toString());
		}
	}

	/**
	 * 通过 Key - Value 方式的多个参数产生一个 attributes(Map<String, Object>) 对象
	 * @param keyAndValue
	 * @return
	 */
	public static Map<String, Object> $attrs(Object... keyAndValue){
		Map<String, Object> result = new HashMap<String, Object>();
		for (int i = 0; i < keyAndValue.length; i++) {
			if (i%2==1){
				result.put((String)keyAndValue[i-1], keyAndValue[i]);
			}
		}
		return result;
	}

	/**
	 * 通过 Key - Value 方式的多个参数产生一个 properties(Map<String, String>) 对象
	 * @param keyAndValue
	 * @return
	 */
	public static Map<String, String> $props(String... keyAndValue){
		Map<String, String> result = new HashMap<String, String>();
		for (int i = 0; i < keyAndValue.length; i++) {
			if (i%2==1){
				result.put(keyAndValue[i-1], keyAndValue[i]);
			}
		}
		return result;
	}

	/**
	 * 通过传入的多个对象产生一个 列表(List) 对象
	 * @param value
	 * @return
	 */
	public static List<Object> $list(Object...value){
		List<Object> lst = new ArrayList<Object>();
		for (int i = 0; i < value.length; i++) {
			lst.add(value[i]);
		}
		return lst;
	}

}
