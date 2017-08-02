package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 获取反馈消息
 * 
 * @author zhoukh
 *
 */
public class GetFeedbackMessage implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFeedbackMessage(paramDefaultContext, TypeConvertor.toLong(paramArrayList.get(0)),
				TypeConvertor.toLong(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)),
				TypeConvertor.toDate(paramArrayList.get(3)), TypeConvertor.toString(paramArrayList.get(4)),
				TypeConvertor.toInteger(paramArrayList.get(5)));
	}

	/**
	 * 
	 * @param context
	 *            上下文对象
	 * @param workItemID
	 *            工作项标识
	 * @param sourceOID
	 *            表单oid
	 * @param billKey
	 *            表单Key
	 * @param billDate
	 *            当前时间
	 * @param content
	 *            反馈内容
	 * @param feedbackType
	 *            反馈类型
	 * @return 成功返回True
	 * @throws Throwable
	 */

	public Boolean getFeedbackMessage(DefaultContext context, Long workItemID, Long sourceOID, String billKey,
			Date billDate, String content, int feedbackType) throws Throwable {
		String sql3 = "select distinct(r.SendUser) from oa_read r  where (r.workItemID is null and 1=1) or ( r.workItemID = ?) and r.billoid=?";
		DataTable dt3 = context.getDBManager().execPrepareQuery(sql3, workItemID, sourceOID);
		String sql2 = "select ProcessKey,FormName from bpm_instance where oid =?";
		DataTable dt2 = context.getDBManager().execPrepareQuery(sql2, sourceOID);
		String sql = "select p.operatorid,bi.ProcessKey,ww.WorkitemName from bpm_workiteminfo bw "
				+ "join wf_workitem ww on bw.WorkitemID=ww.WorkitemID "
				+ "join bpm_instance bi on bw.InstanceID=bi.InstanceID "
				+ "join wf_participator p on p.WorkitemID = bw.WorkitemID where bw.WorkitemID=?";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, workItemID);
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_Feedback");
		Document doc = DocumentUtil.newDocument(metaDataObject);
		doc.setNew();
		DataTable targetTable = doc.get("OA_Feedback");
		if(targetTable.size()>0){
			targetTable.clear();
		}
		if (content.isEmpty()) {
			return false;
		}
		if (feedbackType == 20) {
			dt.beforeFirst();
			while (dt.next()) {
				targetTable.append();
				long srcOID = context.applyNewOID();
				targetTable.setLong("OID", srcOID);
				targetTable.setLong("SOID", srcOID);
				targetTable.setLong("BeFeedback", dt.getLong("OperatorID"));
				targetTable.setLong("Operator", context.getEnv().getUserID());
				targetTable.setString("Content", content);
				targetTable.setString("BillKey", billKey);
				targetTable.setDateTime("BillDate", billDate);
				targetTable.setLong("SourceOID", sourceOID);
				targetTable.setInt("FeedbackType", feedbackType);
				if (workItemID < 0) {
					targetTable.setString("ProcessKey", dt2.getString("ProcessKey"));
					targetTable.setString("WorkItemName", dt2.getString("FormName"));
				} else {
					targetTable.setString("ProcessKey", dt.getString("ProcessKey"));
					targetTable.setString("WorkItemName", dt.getString("WorkitemName"));
				}
			}
		} else {
			targetTable.setLong("BeFeedback", dt3.getLong("SendUser"));
			targetTable.setLong("Operator", context.getEnv().getUserID());
			targetTable.setString("Content", content);
			targetTable.setString("BillKey", billKey);
			targetTable.setDateTime("BillDate", billDate);
			targetTable.setLong("SourceOID", sourceOID);
			targetTable.setInt("FeedbackType", feedbackType);
			if (workItemID < 0) {
				targetTable.setString("ProcessKey", dt2.getString("ProcessKey"));
				targetTable.setString("WorkItemName", dt2.getString("FormName"));
			} else {
				targetTable.setString("ProcessKey", dt.getString("ProcessKey"));
				targetTable.setString("WorkItemName", dt.getString("WorkitemName"));
			}
		}
		SaveData saveData = new SaveData(metaDataObject, null, doc);
		saveData.save(context);
		return true;
	}

}
