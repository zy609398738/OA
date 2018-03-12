package com.bokesoft.tsl.service;

import java.io.File;

import com.bokesoft.yigo.mid.file.util.AttachmentUtil;

public class TSL_TemplateUtils {
	public static String getJsonPath(String formKey, long oid) throws Throwable {
		String dataPath = AttachmentUtil.getAttachDataPath(formKey);
		return dataPath + File.separator + formKey + File.separator + "Json" + File.separator + oid;
	}
}
