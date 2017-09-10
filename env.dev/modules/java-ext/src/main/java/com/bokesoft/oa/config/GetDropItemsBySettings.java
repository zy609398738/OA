package com.bokesoft.oa.config;

import java.util.ArrayList;
import java.util.Collection;

import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据参数设置获得下拉字符串
 * 
 * @author minjian
 * 
 */
public class GetDropItemsBySettings implements IExtService {

	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> paras) throws Throwable {
		return getDropItemsBySettings(context, TypeConvertor.toString(paras.get(0)),
				TypeConvertor.toString(paras.get(1)));
	}

	/**
	 * 根据参数设置获得下拉字符串
	 * 
	 * @param ui
	 *            单据界面对象
	 * @param moduleKey
	 *            参数设置所在配置文件夹的配置Key
	 * @param paths
	 *            参数设置的元素路径，以“|”分隔
	 * @return 下拉字符串
	 * @throws Throwable
	 */
	public static String getDropItemsBySettings(DefaultContext context, String moduleKey, String paths)
			throws Throwable {
		String dropItems = "";
		Settings mapSettings = OASettings.getConfiguration(context).getSettingsByPaths(paths);
		Collection<Settings> mapValues = mapSettings.getMapValues();
		for (Settings map : mapValues) {
			String name = map.getProperty("Name");
			String value = map.getName();
			dropItems = dropItems + ";" + value + "," + name;
		}
		if (dropItems.length() > 0) {
			dropItems = dropItems.substring(1);
		}
		return dropItems;
	}

}
