package com.bokesoft.oa.config;

import java.util.ArrayList;
import java.util.Collection;

import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据参数设置获得说明字符串
 * 
 * @author minjian
 * 
 */
public class GetShowStringBySettings implements IExtService {

	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> paras) throws Throwable {
		return getShowStringBySettings(context, TypeConvertor.toString(paras.get(0)),
				TypeConvertor.toString(paras.get(1)));
	}

	/**
	 * 根据参数设置获得说明字符串
	 * 
	 * @param ui
	 *            单据界面对象
	 * @param billKey
	 *            参数设置所在配置文件夹的配置Key
	 * @param paths
	 *            参数设置的元素路径，以“|”分隔
	 * @return 说明字符串
	 * @throws Throwable
	 */
	public static String getShowStringBySettings(DefaultContext context, String billKey, String paths)
			throws Throwable {
		String showString = "";
		Settings mapSettings = OASettings.getConfiguration(context).getSettingsByPaths(paths);
		Collection<Settings> mapValues = mapSettings.getMapValues();
		for (Settings map : mapValues) {
			String name = map.getProperty("Name");
			String value = map.getProperty("Value");
			showString = showString + "\r\n" + value + "." + name;
		}
		if (showString.length() > 0) {
			showString = showString.substring(2);
		}
		return showString;
	}
}
