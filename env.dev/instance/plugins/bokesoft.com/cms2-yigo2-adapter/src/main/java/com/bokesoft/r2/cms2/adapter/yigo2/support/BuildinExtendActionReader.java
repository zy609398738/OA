package com.bokesoft.r2.cms2.adapter.yigo2.support;

import java.io.File;
import java.net.FileNameMap;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.cms2.core.reader.ext.ExtendedActionReader;
import com.bokesoft.cms2.model.Action;
import com.bokesoft.yes.mid.base.CoreSetting;

public class BuildinExtendActionReader implements ExtendedActionReader {

	public static final String EXP_VIEW_IMAGES = _buildActionExp("viewYigoFile");
	public static final String EXP_DOWNLOAD_IMAGES = _buildActionExp("downloadYigoFile");

	private static final Map<String, String> urlExpMap = new HashMap<String, String>();

	static {
		urlExpMap.put("/cms2-yigo2-adapter/cms/view-yigo-file.action", EXP_VIEW_IMAGES);
		urlExpMap.put("/cms2-yigo2-adapter/cms/download-yigo-file.action", EXP_DOWNLOAD_IMAGES);
	}

	private static final String _buildActionExp(String methodName) {
		return "#!spring:T(" + BuildinExtendActionReader.class.getName() + ")." + methodName + "()";
	}

	@Override
	public Action getActionByUrl(String url, CmsRequestContext reqContext) {
		String exp = urlExpMap.get(url);
		if (null == exp) {
			return null;
		}

		Action a = new Action();
		a.setActionUrl(url);
		a.setActionExp(exp);
		return a;
	}

	@Override
	public List<String> findAllUrls(CmsRequestContext reqContext) {
		return new ArrayList<String>(urlExpMap.keySet());
	}

	public static void viewYigoFile() throws Throwable {
		CmsActionContext cmsCtx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		String path = cmsCtx.getRestArg("body");
		Misc.$assert(StringUtils.isBlank(path), "文件路径参数不能为空");

		path = path.replaceAll("\\\\", "/");
		String yigoCfgPath = CoreSetting.getInstance().getSolutionPath();
		String picPath = yigoCfgPath + "/Data/" + path;
		File file = new File(picPath);

		Misc.$assert(!file.exists(), "文件'" + file + "'不存在");
		String mimeType = getMimeType(cmsCtx, file.getAbsolutePath());
		byte[] data = FileUtils.readFileToByteArray(file);
		cmsCtx.setData(data);
		cmsCtx.setContentType(mimeType);
		cmsCtx.setViewer("binary");
		cmsCtx.setFileName(file.getName());
	}

	public static void downloadYigoFile() throws Throwable {
		CmsActionContext cmsCtx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		String path = cmsCtx.getRestArg("body");
		Misc.$assert(StringUtils.isBlank(path), "文件路径参数不能为空");

		path = path.replaceAll("\\\\", "/");
		String yigoCfgPath = CoreSetting.getInstance().getSolutionPath();
		String picPath = yigoCfgPath + "/Data/" + path;
		File file = new File(picPath);

		Misc.$assert(!file.exists(), "文件'" + file + "'不存在");
		String mimeType = getMimeType(cmsCtx, file.getAbsolutePath());
		if(null == mimeType){
			mimeType = "application/octet-stream";
		}

		byte[] data = FileUtils.readFileToByteArray(file);
		cmsCtx.setData(data);
		cmsCtx.setContentType(mimeType);
		cmsCtx.setViewer("binary");
		cmsCtx.setFileName(file.getName());
		cmsCtx.setAttribute("Content-Disposition", "attachment");
	}

	public static String getMimeType(CmsActionContext cmsCtx, String fileUrl) throws java.io.IOException {
		// 先从服务器上下文中取MimeType
		String type = cmsCtx.getRequest().getServletContext().getMimeType(fileUrl);
		// 如果没取到，取默认的MimeType
		if (type == null || type.length() <= 0) {
			FileNameMap fileNameMap = URLConnection.getFileNameMap();
			type = fileNameMap.getContentTypeFor(fileUrl);
		}
		return type;
	}
}
