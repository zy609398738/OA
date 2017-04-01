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
 * 将字符串上传为指定文件
 * 
 * @author minjian
 *
 */
public class UploadStringToFile implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return uploadStringToFile(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toBoolean(paramArrayList.get(1)));
	}

	/**
	 * 将字符串上传为指定文件
	 * 
	 * @param context
	 *            中间层对象
	 * @param fileContent
	 *            文件内容
	 * @param filePath
	 *            文件路径
	 * @param isRelative
	 *            是否相对路径，true=相对路径，按照相对于Solution文件夹所在的目录来取得文件，false=绝对路径
	 * @return 上传成功返回true
	 * @throws Throwable
	 */
	public Boolean uploadStringToFile(DefaultContext context, String fileContent, String filePath, Boolean isRelative)
			throws Throwable {
		if (StringUtil.isBlank(filePath)) {
			return false;
		}
		if (isRelative) {
			filePath = CoreSetting.getInstance().getSolutionPath() + File.separator + filePath;
		}
		File file = new File(filePath);
		if (file.exists()) {
			file.delete();
		}
		FileUtils.writeStringToFile(file, fileContent);
		return true;
	}
}
