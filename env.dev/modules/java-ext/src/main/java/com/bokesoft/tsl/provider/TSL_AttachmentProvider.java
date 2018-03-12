package com.bokesoft.tsl.provider;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.file.provider.DefaultAttachmentProvider;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_AttachmentProvider extends DefaultAttachmentProvider {

	protected String checkBeforeUpload(DefaultContext context, String fileName, String formKey, long SOID,
			String seriesPath, byte[] bytes) {
		if (!checkKeywords(context, bytes)) {
			return "关键字";
		}

		return null;
	}

	private boolean checkKeywords(DefaultContext context, byte[] bytes) {
		String text = readDataDocx(bytes).toLowerCase();

		String sql = "select LngCategory,Keyword from KeywordCheck order by LngCategory";
		DataTable dt;
		try {
			dt = context.getDBManager().execPrepareQuery(sql);

			dt.beforeFirst();

			boolean includeKeyword = false;
			String lastLang = "";
			String curLang = "";
			while (dt.next()) {
				curLang = dt.getString("LngCategory");
				if (lastLang.equalsIgnoreCase(curLang) && !includeKeyword) {
					continue;
				}

				if (!lastLang.equalsIgnoreCase(curLang) && includeKeyword) {
					return true;
				}

				lastLang = curLang;
				String keyword = dt.getString("Keyword").toLowerCase();
				if (text.indexOf(keyword) > 0) {
					includeKeyword = true;
				} else {
					includeKeyword = false;
				}
			}

			if (includeKeyword) {
				return true;
			}
		} catch (Throwable e) {
			e.printStackTrace();
		}

		return false;
	}

	// 读取数据 docx
	private static String readDataDocx(byte[] bytes) {
		StringBuffer content =new StringBuffer();
		InputStream istream = null;
		XWPFDocument document = null;
		try {
			istream = new ByteArrayInputStream(bytes);
			document = new XWPFDocument(istream);
			List<XWPFParagraph> paras = document.getParagraphs();
			for (XWPFParagraph para : paras) {
				// 当前段落的属性
				// CTPPr pr = para.getCTP().getPPr();
				content.append(para.getText());
				content.append("\n");
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (istream != null) {
				try {
					istream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if (document != null) {
				try {
					document.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return content.toString();
	}
}
