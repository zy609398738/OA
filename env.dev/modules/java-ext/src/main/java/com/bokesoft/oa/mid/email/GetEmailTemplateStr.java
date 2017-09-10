package com.bokesoft.oa.mid.email;

import java.io.File;
import java.util.ArrayList;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获取邮件模板文件名称的字符串
 * 
 * @author chenbiao
 *
 */
public class GetEmailTemplateStr implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFileNameStr(paramDefaultContext);
	}

	/**
	 * 获取邮件模板文件名称的字符串
	 * 
	 * @return 文件名字符串
	 * @throws Throwable
	 */
	public static String getFileNameStr(DefaultContext context) throws Throwable {
		OAContext oaContext = new OAContext(context);
		String nativeplace = OASettings.getNativeplaceByOperator(context);
		String templatePath = OASettings.getTemplatePath(oaContext, nativeplace);
		// get file list where the path has
		File file = new File(templatePath);
		// get the folder list
		File[] array = file.listFiles();

		String fileStr = "";
		if (array == null || array.length <= 0) {
			return fileStr;
		}
		for (int i = 0; i < array.length; i++) {
			if (array[i].isFile()) {
				fileStr = fileStr + ";" + array[i].getName() + "," + array[i].getName();
			}
		}
		if (fileStr.length() > 0) {
			fileStr = fileStr.substring(1);
		}
		return fileStr;
	}
}
