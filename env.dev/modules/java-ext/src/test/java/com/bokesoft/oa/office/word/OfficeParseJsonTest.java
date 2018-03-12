package com.bokesoft.oa.office.word;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.oa.office.word.utils.WordUtils;

public class OfficeParseJsonTest {
	private static String docxTmpUrl = "src/test/resources/com/bokesoft/oa/office/word/docTemp.docx";
	private static String docxFileUrl = "src/test/resources/com/bokesoft/oa/office/word/docDemo.docx";
	private static String jsonFileUrl = "src/test/resources/com/bokesoft/oa/office/word/demoData.json";
	
	public static void main(String[] args) throws Exception {
		//testTransfWord2Json();
		testWriteWordToData(docxTmpUrl, docxFileUrl,jsonFileUrl);
//		del(docxTmpUrl);
	}

	@SuppressWarnings("unused")
	private static void del(String inputUrl){
		File file = new File(docxTmpUrl);
		String inputFileUrl = file.getAbsolutePath();
		// 获取word文档解析对象
		XWPFDocument doucument;
		try {
			doucument = new XWPFDocument(POIXMLDocument.openPackage(inputFileUrl));
			WordUtils.delContentBetweenBookmarks(doucument);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void testWriteWordToData(String inputUrl,String outputUrl,String jsonUrl) throws Exception{
		Long startTime = System.currentTimeMillis();
		String jsonStr = JsonDataTools.getContentJsonByFileUrl(jsonUrl);
		
        File inputFile = new File(docxTmpUrl);
		String inputFileUrl = inputFile.getAbsolutePath();
		File outFile = new File(docxFileUrl);
		String outputFileUrl = outFile.getAbsolutePath();
		BillDataUnit billDataUnit = JSON.parseObject(jsonStr, BillDataUnit.class);
		OfficePOITools.writeWordToData(inputFileUrl, outputFileUrl, billDataUnit);
		Long endTime = System.currentTimeMillis();
		System.out.println("testWriteWordToData, cost Time:"+(endTime-startTime)+"ms");
	}
	
	public static void testTransfWord2Json() throws Exception{
		File file = new File(docxTmpUrl);
		String inputFileUrl = file.getAbsolutePath();
		Long startTime = System.currentTimeMillis();
		System.out.println(OfficePOITools.readWordToJson(inputFileUrl, new HashMap<String, String>(), new HashMap<String, String>()));
		Long endTime = System.currentTimeMillis();
		System.out.println("testTransfWord2Json, cost Time:"+(endTime-startTime)+"ms");
	}
	
	public static void testJsonStrisTheSame(String[] args) {
		String jsonFileUrl = "src/test/resources/com/bokesoft/oa/office/word/demoData.json";
		String jsonFileUr2 = "src/test/resources/com/bokesoft/oa/office/word/dataJson2.json";
		try {
			JSONObject json1 = JSON.parseObject(JsonDataTools.getContentJsonByFileUrl(jsonFileUrl));
			JSONObject json2 = JSON.parseObject(JsonDataTools.getContentJsonByFileUrl(jsonFileUr2));
			List<String> illegalTextList = new ArrayList<String>();
			illegalTextList.add("@");
			illegalTextList.add("#");
			illegalTextList.add("$");
			boolean isInStr = JsonDataTools.isIncludeIllegalContent(json1, illegalTextList);
			System.out.println(isInStr);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
