package com.bokesoft.oa.office.word.demo;

import java.io.File;
import java.util.ArrayList;

import com.alibaba.fastjson.JSON;
import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.JsonDataTools;
import com.bokesoft.oa.office.word.OfficePOITools;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.document.Document;

public class DemoForm2Save implements IExtService{
	@Override
	public Object doCmd(DefaultContext context, ArrayList<Object> args) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm demoWord = metaFactory.getMetaForm("demoWord");
		Document document = context.getDocument();
		String contentJson = Json2MetaForm.document2JsonStr(document,demoWord);
		//内容的检查
		/*
		String elderJson = JsonDataTools.getContentJsonByFileUrl("");
		JsonDataTools.compareJson(JSON.parseObject(contentJson), JSON.parseObject(elderJson));
		List<String> illegalContents = new ArrayList<String>();
		illegalContents.add("合并"); //这里应该是一个方法找到非法字符集合
		JsonDataTools.isIncludeIllegalContent(contentJson,illegalContents);
		*/
		String solutionPath = metaFactory.getSolutionPath();
	    // 相对路径 instance/plugins/bokesoft.com/yigo2/webapps/yigo/WEB-INF/classes/
		long oid = context.applyNewOID();
		String docTmpForlderUrl = solutionPath+"/../java-ext/src/test/resources/com/bokesoft/oa/office/word/"+oid;
		File docTmpForlder = new File(docTmpForlderUrl);
		docTmpForlder.mkdirs();
	    String docTmpFileUrl = solutionPath+"/../java-ext/src/test/resources/com/bokesoft/oa/office/word/docTemp.docx";
	    String docOutFileUrl = solutionPath+"/../java-ext/src/test/resources/com/bokesoft/oa/office/word/"+oid+"/attachment.docx";
	    String jsonUrl = solutionPath+"/../java-ext/src/test/resources/com/bokesoft/oa/office/word/"+oid+"/attachment.json";
	    BillDataUnit billDataUnit = JSON.parseObject(contentJson, BillDataUnit.class);
		OfficePOITools.writeWordToData(docTmpFileUrl, docOutFileUrl, billDataUnit);
		JsonDataTools.saveContentJsonByFileUrl(jsonUrl, contentJson);
		return null;
	}
}


