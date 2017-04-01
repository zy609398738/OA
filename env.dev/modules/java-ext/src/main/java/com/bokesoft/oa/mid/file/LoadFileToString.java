package com.bokesoft.oa.mid.file;

import java.io.File;
import java.util.ArrayList;

import org.apache.commons.io.FileUtils;
import org.jsoup.helper.StringUtil;

import com.bokesoft.yes.mid.base.CoreSetting;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 读取文件返回文件内容的字符串
 * 
 * @author minjian
 *
 */
public class LoadFileToString implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return loadFileToString(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toBoolean(paramArrayList.get(1)));
	}

	/**
	 * 读取文件返回文件内容的字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param filePath
	 *            文件路径
	 * @param isRelative
	 *            是否相对路径，true=相对路径，按照相对于Solution文件夹所在的目录来取得文件，false=绝对路径
	 * @return 文件内容的字符串
	 * @throws Throwable
	 */
	public String loadFileToString(DefaultContext context, String filePath, Boolean isRelative) throws Throwable {
		String value = "";
		if (StringUtil.isBlank(filePath)) {
			return value;
		}
		if (isRelative) {
			filePath = CoreSetting.getInstance().getSolutionPath() + File.separator + filePath;
		}
		File file = new File(filePath);
		if (!file.exists()) {
			return value;
		}
		value = FileUtils.readFileToString(file);
		return value;
	}
}
