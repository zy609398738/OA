package com.bokesoft.oa.mid.email;

import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.wf.base.BPMInstance;
import com.bokesoft.oa.mid.wf.base.Operator;
import com.bokesoft.oa.mid.wf.base.WFWorkitem;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 获得主表名称
 * 
 * @author minjian
 *
 */
public class GetEmailTemplate {
	/**
	 * 获得主表名称
	 * 
	 * @param oaContext
	 *            上下文对象
	 * @param formKey
	 *            单据标识
	 * @param fileName
	 *            配置标识
	 * @param nativeplace
	 *            国籍，根据国籍文件夹取得对应邮件模板
	 * @return 主表名称
	 * @throws Throwable
	 */
	public static String getEmailTemplate(OAContext oaContext, Message message, String nativeplace) throws Throwable {
		String formKey = message.getSrcBillKey();
		String fileName = message.getEmailTemp();
		if (StringUtil.isBlankOrNull(fileName)) {
			return "";
		}
		DefaultContext context = oaContext.getContext();
		Document doc = message.getDocument();
		if (doc == null) {
			doc = context.getDocument();
		}
		if (doc == null) {
			return "";
		}
		// 初始化并取得Velocity引擎
		VelocityEngine ve = new VelocityEngine();
		String templatePath = OASettings.getTemplatePath(oaContext, nativeplace);
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
		Long operatorID = context.getUserID();
		vc.put("OA_operator_ID", operatorID);// 登录人ID
		String operatorName = oaContext.getOperatorMap().get(operatorID).getName();
		vc.put("OA_operator_Name", operatorName);// 登录姓名
		String webUrl = OASettings.getWebUrl(oaContext);
		// 这里为了特别向模板提供网络访问路径
		vc.put("OA_Web_URL", webUrl);
		// 这里为了特别向模板提供当前单据名称
		vc.put("OA_Curr_Form_Caption", context.getVE().getMetaFactory().getMetaForm(formKey).getCaption());
		WorkitemInf workitemInf = message.getWorkitemInf();
		// 如果有流程工作项信息，特别向模板提供工作项信息
		if (workitemInf != null) {
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			WFWorkitem wfWorkitem = workitemInf.getWFWorkitem();
			vc.put("OA_Workitem_ID", workitemInf.getOID());// 工作项ID
			vc.put("OA_Workitem_Name", wfWorkitem.getWorkitemName());// 工作项名称
			Operator operator = wfWorkitem.getOperator();
			if (operator == null) {
				vc.put("OA_Workitem_OperatorID", "");// 当前工作项提交人ID
				vc.put("OA_Workitem_OperatorName", "");// 当前工作项提交人名称
			} else {
				vc.put("OA_Workitem_OperatorID", operator.getOID());// 当前工作项提交人ID
				vc.put("OA_Workitem_OperatorName", operator.getName());// 当前工作项提交人名称
			}
			WorkitemInf aA_Workitem_ParentInfo = workitemInf.getParentWorkitem();// 父工作项信息
			if (aA_Workitem_ParentInfo == null) {
				vc.put("OA_Workitem_ParentInfo", "");// 父工作项信息
				vc.put("OA_Workitem_ParentID", "");// 父工作项ID
				vc.put("OA_Workitem_ParentName", "新任务 - 系统管理员");// 父工作项名称
				vc.put("OA_Workitem_UserInfo", "");// 审批意见
				vc.put("OA_Workitem_ParentOperatorID", "");// 父工作项提交人ID
				vc.put("OA_Workitem_ParentOperatorName", "");// 父工作项提交人名称
			} else {
				vc.put("OA_Workitem_ParentInfo", aA_Workitem_ParentInfo);// 父工作项信息
				long aA_Workitem_ParentID = aA_Workitem_ParentInfo.getOID();// 父工作项ID
				vc.put("OA_Workitem_ParentID", aA_Workitem_ParentID);// 父工作项ID
				String aA_Workitem_ParentName = aA_Workitem_ParentInfo.getWFWorkitem().getWorkitemName();
				vc.put("OA_Workitem_ParentName", aA_Workitem_ParentName);// 父工作项名称
				Operator parentWorkitemoperator = aA_Workitem_ParentInfo.getWFWorkitem().getOperator();
				vc.put("OA_Workitem_ParentOperatorID", parentWorkitemoperator.getOID());// 父工作项提交人ID
				vc.put("OA_Workitem_ParentOperatorName", parentWorkitemoperator.getName());// 父工作项提交人名称
				String userInfo = aA_Workitem_ParentInfo.getWFWorkitem().getUserInfo();
				if (userInfo == null) {
					vc.put("OA_Workitem_UserInfo", "");// 审批意见
				} else {
					vc.put("OA_Workitem_UserInfo", userInfo);// 审批意见
				}
			}
			String sql = "select * from (select content from OA_Feedback f where FeedbackType=20 and f.workitemid = ? order by billdate desc) h where rownum = 1";
			DataTable dtQuery = context.getDBManager().execPrepareQuery(sql, workitemInf.getOID());
			if (dtQuery.size() <= 0) {
				vc.put("OA_Workitem_UrgeContent", "");
			} else {
				vc.put("OA_Workitem_UrgeContent", dtQuery.getString("Content"));
			}

			BPMInstance bpmInstance = workitemInf.getHeadBase();
			vc.put("OA_Workitem_InstanceID", bpmInstance.getOID());// 流程ID
			Operator instanceOperator = bpmInstance.getOperator();
			vc.put("OA_Workitem_instanceOperatorID", instanceOperator.getOID());// 流程提交人ID
			vc.put("OA_Workitem_instanceOperatorName", instanceOperator.getName());// 流程提交人名称
			vc.put("OA_Workitem_Processkey", workitemInf.getHeadBase().getProcesskey());// 流程Key
			vc.put("OA_Workitem_StartTime", formatter.format(workitemInf.getHeadBase().getStartTime()));// 启动流程时间
			vc.put("OA_Workitem_SendDate", formatter.format(message.getSendDate()));// 到达日期
		}
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
		// 获取模板中设置的主题设置到消息主题
		String html = writer.toString();
		org.jsoup.nodes.Document htmlDoc = Jsoup.parse(html);
		Element content = htmlDoc.getElementById("topic");
		if (content != null) {
			String topic = content.text();
			message.setTopic(topic);
		}
		return html;
	}
}
