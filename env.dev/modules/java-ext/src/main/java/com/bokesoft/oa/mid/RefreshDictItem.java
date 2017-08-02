package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据列名获得查询内容的字符串
 * 
 * @author minjian
 *
 */
public class RefreshDictItem implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return refreshDictItem(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toLong(paramArrayList.get(1)));
	}

	/**
	 * 根据列名获得查询内容的字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param itemKey
	 *            字典的Key
	 * @param DictOID
	 *            字典OID
	 * @return true
	 * @throws Throwable
	 */
	public Boolean refreshDictItem(DefaultContext context, String itemKey, Long dictOID) throws Throwable {
		context.getVE().getDictCache().refreshItem(itemKey, dictOID);
		return true;
	}
}
