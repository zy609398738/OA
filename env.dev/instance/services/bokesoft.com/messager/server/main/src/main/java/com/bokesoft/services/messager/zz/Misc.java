package com.bokesoft.services.messager.zz;

import com.alibaba.fastjson.JSON;

public class Misc {
	/**
	 * 用于 catch 各种 Exception 并转换为 RuntimeException 抛出
	 * @param t
	 * @throws RuntimeException
	 */
	public static void $throw(Throwable throwable) throws RuntimeException {
		if (throwable instanceof RuntimeException) {
	        throw (RuntimeException) throwable;
	    }
	    throw new RuntimeException(throwable);
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
	 * 将数据对象转换为 JSON 字符串
	 * @param obj
	 * @return
	 */
	public static String $json(Object obj){
		return JSON.toJSONString(obj);
	}
}
