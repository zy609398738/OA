package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据列名获得查询内容的下拉字符串
 * 
 * @author minjian
 *
 */
public class ElectronicSeal implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return electronicSeal(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param path
	 *            附件路径
	 * @param name
	 *            附件名称
	 * @return 返回文件路径
	 * @throws Throwable
	 */
	public static String electronicSeal(DefaultContext context, String path, String name) throws Throwable {
		int last = name.lastIndexOf('.');
		String fix = name.substring(last + 1, name.length());
		String fileUrl = "";
		if (fix.equalsIgnoreCase("DOC") || fix.equalsIgnoreCase("DOCX")) {
			fileUrl = "../../pageoffice/WordTableSetImg/WordTableYigo.jsp?filePath=" + path + "&fileName=" + name;
		} else if (fix.equalsIgnoreCase("PDf")) {
			fileUrl = "../../pageoffice/WordTableSetImg/InsertImgToPDF.jsp?filePath=" + path;
		} else {
			throw new Error("不支持的文件类型,仅支持Word和PDF。");
		}
		return fileUrl;
	}
}
