package com.bokesoft.oa.office.word;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class JsonDataToolsTest {
	private static String jsonFileUrl = "src/test/resources/com/bokesoft/oa/office/word/demoData.json";
	private static String jsonFileUr2 = "src/test/resources/com/bokesoft/oa/office/word/demoData2.json";
	
	public static void main(String[] args) {
		try {
			boolean res = false;
			
//			res = isIncludeIllegalContentTest(jsonFileUrl);
			res = compareJsonTest(jsonFileUrl, jsonFileUr2);
			
			System.out.println(res);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static boolean isIncludeIllegalContentTest(String jsonFileUrl) throws Exception{
		JSONObject json1 = JSON.parseObject(JsonDataTools.getContentJsonByFileUrl(jsonFileUrl));
		List<String> illegalTextList = new ArrayList<String>();
		illegalTextList.add("@");
		illegalTextList.add("#");
		illegalTextList.add("$");
		return JsonDataTools.isIncludeIllegalContent(json1, illegalTextList);
	}
	public static boolean compareJsonTest(String jsonFileUrl1,String jsonFileUrl2) throws Exception{
		return JsonDataTools.compareData(JsonDataTools.getContentJsonByFileUrl(jsonFileUrl1), JsonDataTools.getContentJsonByFileUrl(jsonFileUrl2));
	}
}
