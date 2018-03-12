package com.bokesoft.tsl.provider;

import java.io.File;

import com.bokesoft.yigo.common.util.FileUtil;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.util.MetaUtil;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.file.provider.DefaultAttachmentProvider;
import com.bokesoft.yigo.mid.file.util.AttachmentUtil;

public class TSL_AttachmentWithVersionProvider extends DefaultAttachmentProvider {

	public String getUploadPath(DefaultContext context, String fileName, String formKey, long SOID, String seriesPath)
			throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		MetaDataObject metaDataObject = MetaUtil.getDataObject(metaFactory, metaForm);

		// 附件的存储路径
		String dirPath = AttachmentUtil.getAttachDataPath(formKey);

		// 去掉根目录一级分类目录多余的'/' 或者 '\'
		dirPath = FileUtil.removeSlant(dirPath);
		seriesPath = FileUtil.removeSlant(seriesPath);

		// 相对路径
		String relativePath = metaDataObject.getKey() + File.separator + SOID;
		if (seriesPath != null && !seriesPath.isEmpty()) {
			relativePath = seriesPath + File.separator + metaDataObject.getKey() + File.separator + SOID;
		}

		// 检查有多少个版本
		String filePath = dirPath + File.separator + relativePath;
		int count = 1;
		File directory = new File(filePath);
		if (directory.exists()) {
			File[] tempList = directory.listFiles();
			for (int i = 0; i < tempList.length; i++) {
				if (!tempList[i].isDirectory()) {
					count++;
				}
			}
		}
		
		// 创建文件目录
		directory.mkdirs();

		int l = fileName.length();
		if(fileName.toLowerCase().endsWith(".doc")) {
			fileName = fileName.substring(0, l - 4) + "_V" + count + ".doc";
		} else if (fileName.toLowerCase().endsWith(".docx")) {
			fileName = fileName.substring(0, l - 5) + "_V" + count + ".docx";
		}
		
		return relativePath + File.separator + fileName;
	}
}
