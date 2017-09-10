package com.bokesoft.oa.config;

import java.util.ArrayList;

import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据参数设置获得属性值
 * 
 * @author minjian
 * 
 */
public class GetPropertyBySettings implements IExtService {

	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> paras) throws Throwable {
		return getPropertyBySettings(context, TypeConvertor.toString(paras.get(0)),
				TypeConvertor.toString(paras.get(1)), TypeConvertor.toString(paras.get(2)));
	}

	/**
	 * 根据参数设置属性值
	 * 
	 * @param context
	 *            上下文对象
	 * @param billKey
	 *            参数设置所在配置文件夹的配置Key
	 * @param paths
	 *            参数设置的元素集合路径，以“|”分隔
	 * @param propertyName
	 *            要取值的元素属性名称
	 * @return 下拉字符串
	 * @throws Throwable
	 */
	public static String getPropertyBySettings(DefaultContext context, String billKey, String paths,
			String propertyName) throws Throwable {
		String value = "";
		Settings mapSettings = OASettings.getConfiguration(context).getSettingsByPaths(paths);
		value = mapSettings.getProperty(propertyName);
		return value;
	}
}
