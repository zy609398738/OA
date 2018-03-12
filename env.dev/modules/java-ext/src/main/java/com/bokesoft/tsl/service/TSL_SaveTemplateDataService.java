package com.bokesoft.tsl.service;

import java.io.File;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.JsonDataTools;
import com.bokesoft.oa.office.word.OfficePOITools;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.yes.mid.web.cmd.attachment.UploadAttachmentCmd;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.file.util.AttachmentUtil;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.ve.VE;

public class TSL_SaveTemplateDataService implements IExtService2 {
	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String parnetFormKey = args.get("parnetFormKey").toString();
		long oid = TypeConvertor.toLong(args.get("OID"));
		
		String filePath = args.get("filePath").toString();
		String formKey = args.get("formKey").toString();
		
		VE ve = context.getVE();
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaForm demoWord = metaFactory.getMetaForm(formKey);
		Document document = context.getDocument();
		
		String dataPath = AttachmentUtil.getAttachDataPath(parnetFormKey);
		// 生成json文件
		String contentJson = Json2MetaForm.document2JsonStr(document,demoWord);
		String jsonPath = TSL_TemplateUtils.getJsonPath(parnetFormKey, oid);
		File f = new File(jsonPath);
		if (!f.exists()) {
			f.mkdirs();
		}
		int count = 1;
		File[] tempList = f.listFiles();
		for (int i = 0; i < tempList.length; i++) {
			if (!tempList[i].isDirectory()) {
				count++;
			}
		}
		String fileName = parnetFormKey + "_V" + count + ".json";
		jsonPath = jsonPath + File.separator + fileName;
		JsonDataTools.saveContentJsonByFileUrl(jsonPath, contentJson);
		
		// 生成docx附件
		String templatePath = dataPath + File.separator + filePath;
		String tempPath = dataPath + File.separator + parnetFormKey + File.separator + "Temp" + File.separator + oid;
		f = new File(tempPath);
		if (!f.exists()) {
			f.mkdirs();
		}
		
		count = 1;
		tempList = f.listFiles();
		for (int i = 0; i < tempList.length; i++) {
			if (!tempList[i].isDirectory()) {
				count++;
			}
		}
		fileName = parnetFormKey + "_V" + count + ".docx";
		
		tempPath = tempPath + File.separator + fileName;
		BillDataUnit billDataUnit = JSON.parseObject(contentJson, BillDataUnit.class);
		OfficePOITools.writeWordToData(templatePath, tempPath, billDataUnit);
		
		f = new File(tempPath);
		UploadAttachmentCmd cmd = new UploadAttachmentCmd(f, fileName, parnetFormKey, "B_STDContrTMPLATT", oid, 0, ve.getEnv().getUserID(), "", "", -1, true, "");
		cmd.doCmd(context);
		
		return true;
	}
}
