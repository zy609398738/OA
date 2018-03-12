package com.bokesoft.oa.office.word;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.oa.office.word.bean.ColumnDataUnit;
import com.bokesoft.oa.office.word.bean.HeadDataUnit;
import com.bokesoft.oa.office.word.bean.RowDataUnit;
import com.bokesoft.oa.office.word.bean.TableDataUnit;

public class JsonDataTools {
	
	/** 比较2个json对象比对,如果所有属性值一致 
	 * @param jsonStr1
	 * @param jsonStr2
	 * @return 一致返回true，不一致返回false
	 */
	public static boolean compareData(String jsonStr1,String jsonStr2){
		BillDataUnit billDataUnit1,billDataUnit2;
		int count = 0 ;
		try{
			billDataUnit1 = JSON.parseObject(jsonStr1, BillDataUnit.class);
			billDataUnit2 = JSON.parseObject(jsonStr2, BillDataUnit.class);
			List<HeadDataUnit> headerList1 = billDataUnit1.getHeaders();
			List<HeadDataUnit> headerList2 = billDataUnit2.getHeaders();
			List<TableDataUnit> tableList1 = billDataUnit1.getTables();
			List<TableDataUnit> tableList2 = billDataUnit2.getTables();
			if(headerList1.size() == headerList2.size()){
				for (int i = 0 ; i< headerList1.size();i++) {
					if(headerList1.get(i).getOptionList() != null && headerList2.get(i).getOptionList() != null){
						if(headerList1.get(i).getOptionList().size() != headerList2.get(i).getOptionList().size()){
							count++;
						}
					}
				}
			}else{
				count++;
			}
			if(tableList1.size() == tableList2.size()){
				for (int i = 0; i < tableList1.size(); i++) {
					List<RowDataUnit> rowlist1 = tableList1.get(i).getRowlist();
					List<RowDataUnit> rowlist2 = tableList1.get(i).getRowlist();
					if(rowlist1.size() == rowlist2.size()){
						for (int j = 0; j < rowlist1.size(); j++) {
							if(rowlist1.get(j).getCollist().size() != rowlist2.get(j).getCollist().size()){
								count++;
							}
						}
					}else{
						count++;
					}
				}
			}else{
				count++;
			}
			if(count == 0){
				return true;
			}else{
				return false;
			}
		}catch(Exception e){
			return false;
		}
	}
	
	/** 
	 * 检索jsonobject中，属性是否含有非法字符
	 * @param json
	 * @param 非法字符集合
	 * @return 含有非法字符返回 true,不含有非法字符返回false
	 */
	public static boolean isIncludeIllegalContent(JSONObject json,List<String> illegalTextList){
		try{
			BillDataUnit billDataUnit = JSON.parseObject(json.toJSONString(), BillDataUnit.class);
			List<HeadDataUnit> headerList = billDataUnit.getHeaders();
			List<TableDataUnit> tableList = billDataUnit.getTables();
			int count = 0;
			//headers 判断record合法性
			for (HeadDataUnit headDataUnit : headerList) {
				boolean headRecordIsInStr = isInString(headDataUnit.getRecord(), illegalTextList);
				if(headRecordIsInStr){
					count++;
				}
			}
			//tables 判断record合法性
			for (TableDataUnit tableDataUnit : tableList) {
				List<RowDataUnit> rowDataUnitList = tableDataUnit.getRowlist();
				if(rowDataUnitList != null){
					for (RowDataUnit rowDataUnit : rowDataUnitList) {
						List<ColumnDataUnit> columnDataUnitList = rowDataUnit.getCollist();
						if(columnDataUnitList != null){
							for (ColumnDataUnit columnDataUnit : columnDataUnitList) {
								boolean columnRecordIsInStr = isInString(columnDataUnit.getRecord(), illegalTextList);
								if(columnRecordIsInStr){
									count++;
								}
							}
						}
					}
				}
			}
			//false 没有非法字符 ，true 存在非法字符
			if(count == 0){
				return false;
			}else{
				return true;
			}
		}catch(Exception e){
			throw new RuntimeException("JSON数据结构有误");
		}
	}
	
	/**
	 * 判断字符串是否包含字符串集合中任意一个元素
	 * @param str
	 * @param illegalTextList
	 * @return
	 */
	public static boolean isInString(String str,List<String> illegalTextList){
		int count = 0;
		for (String illegalText : illegalTextList) {
			if(str.indexOf(illegalText) != -1){
				count++;
			}
		}
		if(count == 0){
			return false;
		}else{
			return true;
		}
	}
	
	/** 
	 * 根据给定的json文件路径,获取文件的json格式的字符串
	 * @param jsonUrl 指定的json文件路径
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 * @throws UnsupportedEncodingException
	 */
	public static String getContentJsonByFileUrl(String jsonUrl)		
			throws FileNotFoundException, IOException, UnsupportedEncodingException {
		StringBuffer jsonStBuff = new StringBuffer();
		File file = new File(jsonUrl);
		FileInputStream fis = new FileInputStream(file);  
		int len = 0;  
        byte[] buf = new byte[1024];  
        while((len=fis.read(buf))!=-1){
        	jsonStBuff.append(new String(buf,0,len,"UTF-8"));
        }
        fis.close();
		return new String(jsonStBuff.toString());
	}
	
	/**
	 * 根据给定的json文件路径,json格式的字符串数据,保留该json文件
	 * @param jsonUrl 指定的json文件保存路径
	 * @param jsonStr json格式的字符串数据
	 * @throws FileNotFoundException
	 * @throws IOException
	 * @throws UnsupportedEncodingException
	 */
	public static void saveContentJsonByFileUrl(String jsonUrl,String jsonStr)		
			throws FileNotFoundException, IOException, UnsupportedEncodingException {
		File file = new File(jsonUrl);
		FileOutputStream fio = new FileOutputStream(file);
		fio.write(jsonStr.getBytes("UTF-8"));
        fio.flush();
        fio.close();
	}
}
