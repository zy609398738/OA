package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据附件名获取文件类型
 * 
 * @author chenbiao
 *
 */
public class GetFileType implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFileType(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param name
	 *            附件名称
	 * @return 返回文件路径
	 * @throws Throwable
	 */
	public static String getFileType(DefaultContext context, String name) throws Throwable {
		int last = name.lastIndexOf('.');
		String fix = name.substring(last + 1, name.length());
		fix = fix.toUpperCase();
		return fix;
	}
}
