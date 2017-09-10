package com.bokesoft.oa.util;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 通用工具类
 * 
 * @author minjian
 *
 */
public class OAUtility {
	/**
	 * 载入表单对象
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            表单的Key
	 * @param oid
	 *            表单的ID
	 * @return 表单对象
	 * @throws Throwable
	 */
	public static Document loadDocument(DefaultContext context, String formKey, Long oid) throws Throwable {
		Document document = DocumentUtil.newDocument(formKey);
		String dataObjectKey = document.getMetaDataObject().getKey();
		LoadData loadData = new LoadData(dataObjectKey, oid);
		DefaultContext newContext = new DefaultContext(context);
		document = loadData.load(newContext, document);
		return document;
	}
}
