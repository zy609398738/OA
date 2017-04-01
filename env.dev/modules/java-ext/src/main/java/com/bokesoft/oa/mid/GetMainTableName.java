package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获得主表名称
 * 
 * @author minjian
 *
 */
public class GetMainTableName implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getMainTableName(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 获得主表名称
	 * 
	 * @param context
	 *            中间层对象
	 * @param srcFromKey
	 *            配置标识
	 * @return 主表名称
	 * @throws Throwable
	 */
	public String getMainTableName(DefaultContext context, String srcFromKey)
			throws Throwable {
		String formKey=srcFromKey;
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject(formKey);
		String tableName=metaDataObject.getMainTable().getDBTableName();
		return tableName;
	}
}
