package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 检查多选字典是否为空
 * 
 * @author minjian
 *
 */
public class CheckEmptyMutilSel implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return checkEmptyMutilSel(paramDefaultContext, paramArrayList.get(0));
	}

	/**
	 * 检查多选字典是否为空
	 * 
	 * @param context
	 *            中间层对象
	 * @param dicIds
	 *            多选字典对象
	 * @return 多选字典内容内容为空返回true,否则返回false
	 * @throws Throwable
	 */
	public Boolean checkEmptyMutilSel(DefaultContext context, Object dicIds) throws Throwable {
		String ids = GetValueStrByMutilSel.getValueStrByMutilSel(context, dicIds);
		if (ids.length() <= 0) {
			return true;
		} else {
			return false;
		}
	}
}
