package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.JsonDataTools;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_LoadTemplateDataService implements IExtService2 {
	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String parentFormKey = args.get("parentFormKey").toString();
		String formKey = args.get("formKey").toString();
		long oid = TypeConvertor.toLong(args.get("oid"));

		String jsonPath = TSL_TemplateUtils.getJsonPath(parentFormKey, oid);
		Document document = context.getDocument();

		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		String jsonStr = JsonDataTools.getContentJsonByFileUrl(jsonPath);
		Json2MetaForm.setDatabyJson(document, metaForm, jsonStr);
		
		return document;
	}
}
