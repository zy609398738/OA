package com.bokesoft.oa.office.word.demo;

import java.util.ArrayList;

import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.JsonDataTools;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.document.Document;

public class DemoForm2Import implements IExtService{
	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> args) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		Document document = context.getDocument();
		MetaForm demoWord = metaFactory.getMetaForm("demoWord");
		String solutionPath = metaFactory.getSolutionPath();
		String jsonUrl = solutionPath+"/../java-ext/src/test/resources/com/bokesoft/oa/office/word/demoData.json";
		String jsonStr = JsonDataTools.getContentJsonByFileUrl(jsonUrl);
		Json2MetaForm.setDatabyJson(document,demoWord, jsonStr);		
		return document;
	}
}


