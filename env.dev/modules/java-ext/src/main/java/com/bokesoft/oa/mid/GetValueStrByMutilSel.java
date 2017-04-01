package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yes.struct.dict.ItemDataUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.dict.ItemData;

/**
 * 根据多选字典选择内容列表对象取得对应OID字符串
 * 
 * @author minjian
 *
 */
public class GetValueStrByMutilSel implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getValueStrByMutilSel(paramDefaultContext, paramArrayList.get(0),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 根据多选字典选择内容列表对象取得对应OID字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param dicIds
	 *            多选字典对象
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	public static String getValueStrByMutilSel(DefaultContext context, Object dicIds) throws Throwable {
		return getValueStrByMutilSel(context, dicIds, ",");
	}

	/**
	 * 根据多选字典选择内容列表对象取得对应OID字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param dicIds
	 *            多选字典对象
	 * @param sep
	 *            分隔符
	 * @return 列内容的字符串
	 * @throws Throwable
	 */
	@SuppressWarnings("unchecked")
	public static String getValueStrByMutilSel(DefaultContext context, Object dicIds, String sep) throws Throwable {
		String valueStr = "";
		if (dicIds == null) {
			return valueStr;
		}
		List<ItemData> list = null;
		// 如果是多选字典的List对象
		if (dicIds instanceof List) {
			list = (List<ItemData>) dicIds;
			valueStr = getValueStrByList(list, sep);
		} else if (dicIds instanceof String) {// 否则，如果是多选字典的json字符串
			String ids = TypeConvertor.toString(dicIds);
			if (StringUtil.isBlankOrNull(ids)) {
				return valueStr;
			}
			Boolean isNumeric = checkIsIDs(ids);
			if (isNumeric) {
				return ids;
			}
			list = ItemDataUtil.getItemDatas(dicIds);
			valueStr = getValueStrByList(list, sep);
		} else {
			valueStr = TypeConvertor.toString(dicIds);
		}

		return valueStr;
	}

	/**
	 * 检查是否"ID,ID,..."形式的ID字符串
	 * 
	 * @param ids
	 *            字符串
	 * @return 是ID字符串返回true,否则返回false
	 */
	public static Boolean checkIsIDs(String ids) {
		String[] idArray = ids.split(",");
		Boolean isNumeric = true;
		for (String id : idArray) {
			isNumeric = StringUtil.isNumeric(id);
			if (!isNumeric) {
				isNumeric = false;
				break;
			}
		}
		return isNumeric;
	}

	/**
	 * 根据列表获得对应OID的字符串
	 * 
	 * @param list
	 *            列表对象
	 * @param sep
	 *            分隔符
	 * @return 对应OID的字符串
	 */
	private static String getValueStrByList(List<ItemData> list, String sep) {
		String valueStr = "";
		for (ItemData itemData : list) {
			valueStr = valueStr + sep + itemData.getOID();
		}
		if (valueStr.length() > 0) {
			valueStr = valueStr.substring(sep.length());
		}
		return valueStr;
	}
}
