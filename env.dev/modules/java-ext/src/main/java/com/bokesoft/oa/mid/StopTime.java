package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 进程暂停一段时间
 * 
 * @author minjian
 *
 */
public class StopTime implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return stopTime(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)));
	}

	/**
	 * 进程暂停一段时间
	 * 
	 * @param context
	 *            上下文对象
	 * @param value
	 *            暂停时间，单位毫秒
	 * @return 进程暂停完成返回true
	 * @throws Throwable
	 */
	public Boolean stopTime(DefaultContext context, Long msec) throws Throwable {
		Thread.sleep(msec);
		return true;
	}
}
