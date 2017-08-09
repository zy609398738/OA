package com.bokesoft.oa.mid;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 获得主表名称
 * 
 * @author minjian
 *
 */
public class GetEmailTemplate implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		OAContext oaContext = new OAContext(paramDefaultContext);
		return getEmailTemplate(oaContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 获得主表名称
	 * 
	 * @param oaContext
	 *            上下文对象
	 * @param formKey
	 *            单据标识
	 * @param fileName
	 *            配置标识
	 * @return 主表名称
	 * @throws Throwable
	 */
	public static String getEmailTemplate(OAContext oaContext, String formKey, String fileName) throws Throwable {
		if (StringUtil.isBlankOrNull(fileName)) {
			return "";
		}
		DefaultContext context = oaContext.getContext();
		Document doc = context.getDocument();
		if (doc == null) {
			return "";
		}
		// 初始化并取得Velocity引擎
		VelocityEngine ve = new VelocityEngine();
		String templatePath = OASettings.getTemplatePath();
		ve.setProperty(VelocityEngine.FILE_RESOURCE_LOADER_PATH, templatePath);
		ve.setProperty(VelocityEngine.ENCODING_DEFAULT, "UTF-8");
		ve.setProperty(VelocityEngine.INPUT_ENCODING, "UTF-8");
		ve.setProperty(VelocityEngine.OUTPUT_ENCODING, "UTF-8");
		ve.setProperty("runtime.log", "logs/velocity.log");
		ve.init();
		// 取得velocity的模版
		Template t = ve.getTemplate(fileName);
		// 取得velocity的上下文context
		VelocityContext vc = new VelocityContext();
		String webUrl = OASettings.getWebUrl();
		// 这里为了特别向模板提供网络访问路径
		vc.put("OA_Web_URL", webUrl);
		// 这里为了特别向模板提供当前单据名称
		vc.put("OA_Curr_Form_Caption", context.getVE().getMetaFactory().getMetaForm(formKey).getCaption());
		MetaDataObject metaDataObject = doc.getMetaDataObject();
		for (MetaTable metaTable : metaDataObject.getTableCollection()) {
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
			String tableKey = metaTable.getKey();
			DataTable dt = doc.get(tableKey);
			DataTableMetaData metaData = dt.getMetaData();
			Boolean isHead = metaTable.isHead();
			if (isHead) {
				Map<String, Object> map = new LinkedHashMap<String, Object>();
				list.add(map);
				for (int i = 0; i < metaData.getColumnCount(); i++) {
					String columnKey = metaData.getColumnInfo(i).getColumnKey();
					Object value = dt.getObject(i);
					vc.put(columnKey, value);
					map.put(columnKey, value);
				}
			} else {
				dt.beforeFirst();
				while (dt.next()) {
					Map<String, Object> map = new LinkedHashMap<String, Object>();
					list.add(map);
					for (int i = 0; i < metaData.getColumnCount(); i++) {
						String columnKey = metaData.getColumnInfo(i).getColumnKey();
						Object value = dt.getObject(i);
						if (isHead) {
							vc.put(columnKey, value);
						}
						map.put(columnKey, value);
					}
				}
			}

			vc.put(metaTable.getBindingDBTableName(), list);
		}
		// 输出流
		StringWriter writer = new StringWriter();
		// 转换输出
		t.merge(vc, writer);
		return writer.toString();
	}
}
