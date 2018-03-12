package com.bokesoft.oa.office.word;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.dom4j.DocumentException;

import com.alibaba.fastjson.JSON;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.oa.office.word.bean.HeadDataUnit;
import com.bokesoft.oa.office.word.bean.TableDataUnit;
import com.bokesoft.oa.office.word.utils.WordUtils;

public class OfficePOITools {
	/**
	 * 从指定的docx模板文件中获取单据字段的设计格式的json字符串
	 * @param inputUrl 指定的docx模板文件路径
	 * @return
	 * @throws DocumentException
	 * @throws IOException
	 */
	public static String readWordToJson(String inputUrl,Map<String,String> headRelatedMap,Map<String,String> dtlRelatedMap) throws DocumentException, IOException {
		BillDataUnit billDataUnit = new BillDataUnit();
		// 获取word文档解析对象
		XWPFDocument doucument = new XWPFDocument(POIXMLDocument.openPackage(inputUrl));
		ArrayList<HeadDataUnit> headers = WordUtils.transfHeadDatasfromBookmark(doucument,headRelatedMap);
		ArrayList<TableDataUnit> tables = WordUtils.transfDtlDatasfromTable(doucument,dtlRelatedMap);
		billDataUnit.setHeaders(headers);
		billDataUnit.setTables(tables);
		doucument.getPackage().revert();

		return JSON.toJSONString(billDataUnit);
	}
	
	/**
	 * 根据Docx模板文件,将传入的数据,按照模板文件的格式,写入到新的docx附件中
	 * @param inputUrl Docx模板文件路径
	 * @param outputUrl ocx附件路径
	 * @param billDataUnit 将传入的特定数据
	 * @throws Exception
	 */
	public static void writeWordToData(String inputUrl, String outputUrl, BillDataUnit billDataUnit) throws Exception {
		// 获取word文档解析对象
		XWPFDocument doucument = new XWPFDocument(POIXMLDocument.openPackage(inputUrl));
		List<HeadDataUnit> headers = billDataUnit.getHeaders();
		List<TableDataUnit> tables = billDataUnit.getTables();
		WordUtils.writeHead2Word(doucument, headers);
		WordUtils.writeDtlTable2Word(doucument, tables);
		FileOutputStream outStream = new FileOutputStream(outputUrl);
		doucument.write(outStream);
		outStream.close();
		doucument.getPackage().revert();
	}
}
