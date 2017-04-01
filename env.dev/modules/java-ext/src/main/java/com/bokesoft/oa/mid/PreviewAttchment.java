package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.oa.mid.file.Ceb2Pdf;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据列名获得查询内容的下拉字符串
 * 
 * @author minjian
 *
 */
public class PreviewAttchment implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return previewAttchment(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            中间层对象
	 * @param path
	 *            附件路径
	 * @param name
	 *            附件名称
	 * @return 返回文件路径
	 * @throws Throwable
	 */
	public static String previewAttchment(DefaultContext context, String path, String name) throws Throwable {
		int last = name.lastIndexOf('.');
		String fix = name.substring(last + 1, name.length());
		String fileUrl = "";
		if (fix.toUpperCase().equals( "DOC") || fix.toUpperCase().equals( "DOCX")) {
			fileUrl = "../../pageoffice/SimpleWord/WordYigo.jsp?filePath=" + path + "&fileName=" + name;
		} else if (fix.toUpperCase().equals("XLS") || fix.toUpperCase().equals("XLSX")) {
			fileUrl = "../../pageoffice/SimpleWord/ExcelYigo.jsp?filePath=" + path + "&fileName=" + name;
		} else if (fix.toUpperCase().equals("PPT") || fix.toUpperCase().equals("PPTX")) {
			fileUrl = "../../pageoffice/SimpleWord/PPTYigo.jsp?filePath=" + path + "&fileName=" + name;
		} else if (fix.toUpperCase().equals("PDF")) {
			fileUrl = "a/cms2-yigo2-adapter/cms/view-yigo-file/" + path;
		} else if (fix.toUpperCase().equals("CEB")) {
			path = Ceb2Pdf.ceb2Pdf(context, path);
			fileUrl = "a/cms2-yigo2-adapter/cms/view-yigo-file/" + path;
		} else {
			fileUrl = "a/cms2-yigo2-adapter/cms/view-yigo-file/" + path;
		}
		return fileUrl;
	}
}
