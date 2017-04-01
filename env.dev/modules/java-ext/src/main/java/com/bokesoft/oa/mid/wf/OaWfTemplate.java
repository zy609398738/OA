package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.bpm.meta.transform.WorkitemInfo;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.bpm.dev.Spoon;
import com.bokesoft.yigo.bpm.dev.Template;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.attribute.MetaBPMOperation;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.MetaDictionary;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.Participator;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessMap;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessMapCollection;
import com.bokesoft.yigo.meta.common.MetaBaseScript;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * OA关于工作流的动态绑定接口实现
 *
 */
public class OaWfTemplate implements Template {
	/**
	 * 根据单据的Key获得已部署的流程对象
	 * 
	 * @param context
	 *            中间层对象
	 * @param dataObjectKey
	 *            当前数据对象的key
	 * @param formKey
	 *            当前单据对象的Key
	 * @return 流程的集合
	 */
	@Override
	public MetaProcessMap getMapInfoByMetaKey(DefaultContext context, String dataObjectKey, String formKey)
			throws Throwable {
		// 如果未指定配置的Key,直接返回
		if (formKey == null) {
			return null;
		}
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaBPM metaBPM = metaFactory.getMetaBPM();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);

		MetaProcessMapCollection deployInfoCol = metaBPM.getMetaProcessMapCollection();
		DataTable dt = getWorkflowTypeDtl(context, formKey);
		if (dt.size() <= 0) {
			// 如果未找到流程定义ID，根据配置的别名再去找一下
			formKey = getAliasKey(context, formKey);
			if (!StringUtil.isBlankOrNull(formKey)) {
				dt = getWorkflowTypeDtl(context, formKey);
			}
		}
		if (dt.size() <= 0) {
			return null;
		}
		MetaProcessMap metaProcessMap = null;
		dt.beforeFirst();
		while (dt.next()) {
			String workflowKey = dt.getString("WorkflowKey");
			for (MetaProcessMap processMap : deployInfoCol) {
				String processKey = processMap.getProcessKey();
				if (processKey.equals(workflowKey)) {
					metaProcessMap = processMap;
					break;
				}
			}
		}
		if (metaProcessMap == null) {
			throw new Error("当前单据：" + metaForm.getCaption() + "，没有已部署的工作流，请先部署单据对应的工作流。");
		}
		return metaProcessMap;
	}

	/**
	 * 获得流程类别明细数据集
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            单据的key
	 * @param workflowTypeDtlID
	 *            流程类别明细ID
	 * @return 流程类别明细数据集
	 * @throws Throwable
	 */
	public static DataTable getWorkflowTypeDtl(DefaultContext context, String formKey, Long workflowTypeDtlID)
			throws Throwable {
		DataTable dt = null;
		// 如果流程类别明细ID不为空,根据流程类型明细ID获得流程类型的数据集
		if (workflowTypeDtlID != null && workflowTypeDtlID > 0) {
			dt = getDtByWorkflowTypeDtlID(context, workflowTypeDtlID);
		} else {
			// 否则，根据单据Key获得流程类型的数据集
			dt = getDtFormKey(context, formKey);
		}
		return dt;
	}

	/**
	 * 获得流程类别明细数据集
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            单据的key
	 * @return 流程类别明细数据集
	 * @throws Throwable
	 */
	public static DataTable getWorkflowTypeDtl(DefaultContext context, String formKey) throws Throwable {
		String WorkflowTypeDtlIDName = "WorkflowTypeDtlID";// OID
		// 获得当前单据参数中的流程类别明细ID
		Object paraValue = context.getPara(WorkflowTypeDtlIDName);
		DataTable dt = null;
		// 如果流程类别明细ID不为空,根据流程类型明细ID获得流程类型的数据集
		if (paraValue != null) {
			long workflowTypeDtlID = TypeConvertor.toLong(paraValue);
			dt = getDtByWorkflowTypeDtlID(context, workflowTypeDtlID);
		} else {
			Document doc = context.getDocument();
			// 如果当期单据对象不存在
			if (doc == null) {
				// 根据单据Key获得流程类型的数据集
				dt = getDtFormKey(context, formKey);
			} else {
				String mainTableKey = doc.getMetaDataObject().getMainTableKey();
				DataTable srcDt = doc.get(mainTableKey);
				// 否则，如果主表中存在WorkflowTypeDtlID数据字段，根据WorkflowTypeDtlID数据字段的值获得流程类型的数据集
				if (srcDt != null && srcDt.getMetaData().constains(WorkflowTypeDtlIDName)) {
					long workflowTypeDtlID = TypeConvertor.toLong(srcDt.getObject(WorkflowTypeDtlIDName));
					// 如果主表中存在WorkflowTypeDtlID大于0，根据WorkflowTypeDtlID获得流程类型的数据集
					if (workflowTypeDtlID > 0) {
						dt = getDtByWorkflowTypeDtlID(context, workflowTypeDtlID);
					} else {
						// 否则，根据单据Key获得流程类型的数据集
						dt = getDtFormKey(context, formKey);
					}
				} else {
					// 否则，根据单据Key获得流程类型的数据集
					dt = getDtFormKey(context, formKey);
				}
			}
		}
		return dt;
	}

	/**
	 * 根据单据Key获得流程类型的数据集
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            单据Key
	 * @return 流程类型的数据集
	 * @throws Throwable
	 */
	public static DataTable getDtFormKey(DefaultContext context, String formKey) throws Throwable {
		DataTable dt;
		String sql = "select d.BillKey,w.WorkflowKey,d.WorkflowID from OA_WorkflowType_H h join OA_WorkflowType_D d on h.oid=d.soid join OA_Workflow_H w on d.WorkflowID=w.OID where h.oid>0 and h.status=1 and d.BillKey=?";
		dt = context.getDBManager().execPrepareQuery(sql, formKey);
		if (dt.size() <= 0) {
			// 如果未找到流程定义ID，根据配置的别名再去找一下
			formKey = getAliasKey(context, formKey);
			dt = context.getDBManager().execPrepareQuery(sql, formKey);
		}
		return dt;
	}

	/**
	 * 根据流程类型明细ID获得流程类型的数据集
	 * 
	 * @param context
	 *            中间层对象
	 * @param workflowTypeDtlID
	 *            流程类型明细ID
	 * @return 流程类型的数据集
	 * @throws Throwable
	 */
	public static DataTable getDtByWorkflowTypeDtlID(DefaultContext context, long workflowTypeDtlID) throws Throwable {
		DataTable dt;
		String sql = "select d.BillKey,w.WorkflowKey,d.WorkflowID from OA_WorkflowType_H h join OA_WorkflowType_D d on h.oid=d.soid join OA_Workflow_H w on d.WorkflowID=w.OID where h.oid>0 and h.status=1 and d.OID=?";
		dt = context.getDBManager().execPrepareQuery(sql, workflowTypeDtlID);
		return dt;
	}

	/**
	 * 获得当前流程的的操作列表
	 * 
	 * @param context
	 *            中间层对象
	 * @param pd
	 *            当前流程对象
	 * @param node
	 *            当前流程节点
	 * @param spoon
	 *            决定是否替换原有的操作列表
	 * @return 操作列表
	 */
	@Override
	public List<MetaBPMOperation> getOperationList(DefaultContext context, MetaProcess pd, MetaNode node, Spoon spoon)
			throws Throwable {
		String pdKey = pd.getKey();
		int nodeID = node.getID();

		Long workflowOID = getWorkflowID(context);

		IDBManager dbm = context.getDBManager();
		String sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
		DataTable dt = dbm.execPrepareQuery(sql, pdKey, nodeID, "OA_Workflow", workflowOID);
		DataTable operationDt = null;
		if (dt.size() > 0) {
			String billKey = dt.getString("BillKey");
			long oid = dt.getLong("OID");
			String operationSql = "select o.Code,o.Name,o.SendType,o.Action,o.OptEnable,o.OptVisible,o.OptIcon,o.TemplateKey,o.UserDefined,o.UserAction,o.UserOptEnable,o.UserOptVisible,o.UserOptIcon,o.UserTemplateKey,d.Name OperationName from OA_OperationSel_H h join OA_OperationSel_D d on h.oid=d.soid join OA_OptModule_H o on o.OID=d.OptID where h.oid>0 and h.status=100 and h.SourceKey=? and h.SourceID=? and h.Tag1=? and Tag2=?";
			operationDt = dbm.execPrepareQuery(operationSql, billKey, oid, pdKey, nodeID);
			if (operationDt.size() <= 0) {
				operationDt = getOperationDt(context, pd, node);
			}
		} else {
			operationDt = getOperationDt(context, pd, node);
		}

		List<MetaBPMOperation> list = new ArrayList<MetaBPMOperation>();
		// 如果选择操作为空，直接退出
		if (operationDt == null || operationDt.size() <= 0) {
			return null;
		} else {// 否则设置为true，替换
			spoon.setMarked(true);
		}

		operationDt.beforeFirst();
		while (operationDt.next()) {
			MetaBPMOperation metaBPMOperation = new MetaBPMOperation();
			String code = operationDt.getString("Code");
			metaBPMOperation.setKey(code);
			String operationName = operationDt.getString("OperationName");
			if (StringUtil.isBlankOrNull(operationName)) {
				operationName = operationDt.getString("Name");
			}
			metaBPMOperation.setCaption(operationName);
			MetaBaseScript metaBaseScript = new MetaBaseScript("Action");

			if (operationDt.getInt("UserDefined") == 1) {
				String userAction = operationDt.getString("UserAction");
				userAction = userAction.replace("OptKey:{''}", "OptKey:{'" + code + "'}");
				metaBaseScript.setContent(userAction);
				metaBPMOperation.setAction(metaBaseScript);
				metaBPMOperation.setEnable(TypeConvertor.toString(operationDt.getString("UserOptEnable")));
				metaBPMOperation.setVisible(TypeConvertor.toString(operationDt.getString("UserOptVisible")));
				metaBPMOperation.setCustomKey("");
				metaBPMOperation.setIcon(TypeConvertor.toString(operationDt.getString("UserOptIcon")));
				metaBPMOperation.setTemplateKey(TypeConvertor.toString(operationDt.getString("UserTemplateKey")));
			} else {
				MetaOperationCollection moc = context.getVE().getMetaFactory().getMetaForm("OA_OptTemplate")
						.getOperationCollection();
				MetaOperation mo = (MetaOperation) moc.get(metaBPMOperation.getKey());
				String userAction = mo.getAction().getContent();
				userAction = userAction.replace("OptKey:{''}", "OptKey:{'" + code + "'}");
				metaBaseScript.setContent(userAction);
				metaBPMOperation.setAction(metaBaseScript);
				metaBPMOperation.setEnable(mo.getEnable());
				metaBPMOperation.setVisible(mo.getVisible());
				metaBPMOperation.setCustomKey("");
				metaBPMOperation.setIcon(mo.getIcon());
				metaBPMOperation.setTemplateKey("");
			}
			list.add(metaBPMOperation);
		}
		return list;
	}

	/**
	 * 获得审批操作的数据
	 * 
	 * @param context
	 *            中间层对象
	 * @param pd
	 *            流程对象
	 * @param node
	 *            流程节点对象
	 * @return 审批操作的数据
	 * @throws Throwable
	 */
	private DataTable getOperationDt(DefaultContext context, MetaProcess pd, MetaNode node) throws Throwable {
		String pdKey = pd.getKey();
		int nodeID = node.getID();
		String sql;
		DataTable dt;
		DataTable operationDt;
		String billKey;
		long oid;
		String operationSql;
		sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
		dt = context.getDBManager().execPrepareQuery(sql, pdKey, nodeID, "OA_WorkflowSet");
		checkWorkflowDesigneDt(dt, pd, node);
		billKey = dt.getString("BillKey");
		oid = dt.getLong("OID");
		operationSql = "select o.Code,o.Name,o.SendType,o.Action,o.OptEnable,o.OptVisible,o.OptIcon,o.TemplateKey,o.UserDefined,o.UserAction,o.UserOptEnable,o.UserOptVisible,o.UserOptIcon,o.UserTemplateKey,d.Name OperationName from OA_OperationSel_H h join OA_OperationSel_D d on h.oid=d.soid join OA_OptModule_H o on o.OID=d.OptID where h.oid>0 and h.status=100 and h.SourceKey=? and h.SourceID=? and h.Tag1=? and Tag2=?";
		operationDt = context.getDBManager().execPrepareQuery(operationSql, billKey, oid, pdKey, nodeID);
		return operationDt;
	}

	/**
	 * 获得当前流程的参与者列表
	 * 
	 * @param context
	 *            中间层对象
	 * @param pd
	 *            当前流程对象
	 * @param node
	 *            当前流程节点
	 * @param spoon
	 *            决定是否替换参与者列表
	 * @return 参与者列表
	 */
	@Override
	public List<Participator> getParticipatorList(DefaultContext context, MetaProcess pd, MetaNode node, Spoon spoon)
			throws Throwable {
		// 设置为true，替换，否则不替换
		spoon.setMarked(true);
		String pdKey = pd.getKey();
		int nodeID = node.getID();

		Long workflowOID = getWorkflowID(context);

		String ids = getOperatorIDs(context, pd, node, pdKey, nodeID, workflowOID);

		List<Participator> list = new ArrayList<Participator>();
		MetaDictionary metaDictionary = new MetaDictionary();
		metaDictionary.setDictionaryKey("Operator");
		metaDictionary.setItemID(ids);
		list.add(metaDictionary);
		return list;
	}

	/**
	 * 获得流程定义的ID
	 * 
	 * @param context
	 *            中间层对象
	 * @return 流程定义的ID
	 * @throws Throwable
	 */
	private Long getWorkflowID(DefaultContext context) throws Throwable {
		Long workflowOID = new Long(-1);
		String formKey = context.getFormKey();
		if (formKey != null) {
			DataTable workflowTypeDt = getWorkflowTypeDtl(context, formKey);
			if (workflowTypeDt.size() <= 0) {
				// 如果未找到流程定义ID，根据配置的别名再去找一下
				formKey = getAliasKey(context, formKey);
				if (!StringUtil.isBlankOrNull(formKey)) {
					workflowTypeDt = getWorkflowTypeDtl(context, formKey);
				}
			}
			if (workflowTypeDt.size() > 0) {
				workflowOID = workflowTypeDt.getLong("WorkflowID");
			}
		}
		return workflowOID;
	}

	private String getOperatorIDs(DefaultContext context, MetaProcess pd, MetaNode node, String pdKey, int nodeID,
			Long workflowOID) throws Throwable, Error {
		IDBManager dbm = context.getDBManager();
		Document doc = context.getDocument();
		Long billOID = doc.getOID();
		String formKey = context.getFormKey();

		Integer preNodeID = getPreNodeID(context, pdKey, nodeID, workflowOID);

		DataTable participatorDt = null;
		if (preNodeID > 0) {
			String nextParticipatorSql = "select n.ParticipatorID OID from OA_NextParticipator n where WorkflowBillKey=? and WorkflowOID=? and WorkflowKey=? and NodeId=?";
			participatorDt = dbm.execPrepareQuery(nextParticipatorSql, formKey, billOID, pdKey, preNodeID);
			if (participatorDt.size() <= 0) {
				formKey = getAliasKey(context, formKey);
				nextParticipatorSql = "select n.ParticipatorID OID from OA_NextParticipator n where WorkflowBillKey=? and WorkflowOID=? and WorkflowKey=? and NodeId=?";
				participatorDt = dbm.execPrepareQuery(nextParticipatorSql, formKey, billOID, pdKey, preNodeID);
			}
		}
		if (participatorDt == null || participatorDt.size() <= 0) {
			String sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
			DataTable dt = dbm.execPrepareQuery(sql, pdKey, nodeID, "OA_Workflow", workflowOID);
			String participatorSql = "";
			if (dt.size() > 0) {
				participatorSql = getParticipatorSql(context, pdKey, nodeID, dt);
				if (participatorSql.length() <= 0) {
					participatorSql = getParticipatorSql(context, pd, node);
				}
			} else {
				participatorSql = getParticipatorSql(context, pd, node);
			}
			if (participatorSql.length() <= 0) {
				throw new Error(
						"流程“" + pd.getCaption() + "”的流程节点“" + node.getCaption() + "”，没有设置对应的人员，请先设置流程节点对应的人员选择。");
			}
			participatorDt = dbm.execQuery(participatorSql);
		}

		if (participatorDt == null || participatorDt.size() <= 0) {
			throw new Error("流程“" + pd.getCaption() + "”的流程节点“" + node.getCaption() + "”，人员选择的结果为空，请修正流程节点对应的人员选择。");
		}

		String ids = "";
		participatorDt.beforeFirst();
		while (participatorDt.next()) {
			String optId = TypeConvertor.toString(participatorDt.getObject("OID"));
			ids = ids + ":" + optId;
		}
		if (ids.length() > 0) {
			ids = ids.substring(1);
		}
		return ids;
	}

	/**
	 * 获取表单的别名
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            表单的Key
	 * @return 表单的别名
	 * @throws Throwable
	 */
	public static String getAliasKey(DefaultContext context, String formKey) throws Throwable {
		return context.getVE().getMetaFactory().getMetaForm(formKey).getAliasKey();
	}

	/**
	 * 获得参与者SQL
	 * 
	 * @param context
	 *            中间层对象
	 * @param pd
	 *            流程对象
	 * @param node
	 *            流程节点对象
	 * @return 参与者SQL
	 * @throws Throwable
	 */
	private String getParticipatorSql(DefaultContext context, MetaProcess pd, MetaNode node) throws Throwable {
		String pdKey = pd.getKey();
		int nodeID = node.getID();
		String sql;
		DataTable dt;
		String participatorSql;
		sql = "select h.BillKey,h.OID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
		dt = context.getDBManager().execPrepareQuery(sql, pdKey, nodeID, "OA_WorkflowSet");
		checkWorkflowDesigneDt(dt, pd, node);
		participatorSql = getParticipatorSql(context, pdKey, nodeID, dt);
		return participatorSql;
	}

	/**
	 * 检查流程设计数据
	 * 
	 * @param dt
	 *            流程设计数据
	 * @param pd
	 *            流程对象
	 * @param node
	 *            流程节点对象
	 * @throws Throwable
	 */
	public void checkWorkflowDesigneDt(DataTable dt, MetaProcess pd, MetaNode node) throws Throwable {
		if (dt.size() <= 0) {
			throw new Error("流程“" + pd.getCaption() + "”的流程节点“" + node.getCaption() + "”，没有在流程设置中找到对应的节点设置，请修正。");
		} else if (dt.size() > 1) {
			throw new Error("流程“" + pd.getCaption() + "”的流程节点“" + node.getCaption() + "”，在流程设置中找到多个节点设置，只能一个，请修正。");
		}
	}

	/**
	 * 获得参与者SQL
	 * 
	 * @param context
	 *            中间层对象
	 * @param pdKey
	 *            流程Key
	 * @param nodeID
	 *            流程节点ID
	 * @param dt
	 *            流程设计数据
	 * @return 参与者SQL
	 * @throws Throwable
	 */
	public String getParticipatorSql(DefaultContext context, String pdKey, int nodeID, DataTable dt) throws Throwable {
		String billKey = dt.getString("BillKey");
		long oid = dt.getLong("OID");
		GetParticipatorSql getParticipatorSql = new GetParticipatorSql();
		getParticipatorSql.setContext(context);
		String participatorSql = getParticipatorSql.getParticipatorSql(billKey, oid, pdKey,
				TypeConvertor.toString(nodeID));
		return participatorSql;
	}

	/**
	 * 
	 * 根据当前审批节点获得前一个审批节点
	 * 
	 * @param context
	 *            中间层对象
	 * @param pdKey
	 *            流程的Key
	 * @param nodeID
	 *            当前审批节点
	 * @param workflowOID
	 *            当前流程定义的OID
	 * @return 前一个审批节点
	 * @return
	 * @throws Throwable
	 */
	private Integer getPreNodeID(DefaultContext context, String pdKey, int nodeID, Long workflowOID) throws Throwable {
		IDBManager dbm = context.getDBManager();
		Document doc = context.getDocument();
		Integer preNodeID = -1;
		Object info = doc.getExpandData("WorkitemInfo");
		if (info != null) {
			WorkitemInfo workitemInfo = (WorkitemInfo) info;
			preNodeID = workitemInfo.getNodeID();
		} else {
			String sequenceSql = "select d.Sequence,d.SOID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
			DataTable sequenceDt = dbm.execPrepareQuery(sequenceSql, pdKey, nodeID, "OA_Workflow", workflowOID);
			if (sequenceDt.size() <= 0) {
				sequenceSql = "select d.Sequence,d.SOID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
				sequenceDt = dbm.execPrepareQuery(sequenceSql, pdKey, nodeID, "OA_WorkflowSet");
			}

			if (sequenceDt.size() > 0) {
				Integer sequence = sequenceDt.getInt("Sequence");
				Long designeOID = sequenceDt.getLong("SOID");
				String preSql = "select AuditNode from OA_WorkflowDesigne_D where SOID=? and Sequence=(select max(Sequence) from OA_WorkflowDesigne_D where  SOID=? and Sequence<?)";
				DataTable preDt = dbm.execPrepareQuery(preSql, designeOID, designeOID, sequence);
				if (preDt.size() > 0) {
					preNodeID = preDt.getInt("AuditNode");
				}
			}
		}
		return preNodeID;
	}

	/**
	 * 根据当前审批节点获得下一个审批节点
	 * 
	 * @param context
	 *            中间层对象
	 * @param pkKey
	 *            流程的Key
	 * @param nodeID
	 *            当前审批节点
	 * @param workflowOID
	 *            当前流程定义的OID
	 * @return 下一个审批节点
	 * @throws Throwable
	 */
	public static Integer getNextNodeID(DefaultContext context, String pkKey, int nodeID, Long workflowOID)
			throws Throwable {
		IDBManager dbm = context.getDBManager();
		Integer nexNodeID = -1;
		String sequenceSql = "select d.Sequence,d.SOID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=? and tag2=?";
		DataTable sequenceDt = dbm.execPrepareQuery(sequenceSql, pkKey, nodeID, "OA_Workflow", workflowOID);
		if (sequenceDt.size() <= 0) {
			sequenceSql = "select d.Sequence,d.SOID from OA_WorkflowDesigne_H h join OA_WorkflowDesigne_D d on h.oid=d.soid where h.oid>0 and h.status=100 and WorkflowKey=? and AuditNode=? and tag1=?";
			sequenceDt = dbm.execPrepareQuery(sequenceSql, pkKey, nodeID, "OA_WorkflowSet");
		}

		if (sequenceDt.size() > 0) {
			Integer sequence = sequenceDt.getInt("Sequence");
			Long designeOID = sequenceDt.getLong("SOID");
			String preSql = "select AuditNode from OA_WorkflowDesigne_D where SOID=? and Sequence=(select min(Sequence) from OA_WorkflowDesigne_D where  SOID=? and Sequence>?)";
			DataTable preDt = dbm.execPrepareQuery(preSql, designeOID, designeOID, sequence);
			if (preDt.size() > 0) {
				nexNodeID = preDt.getInt("AuditNode");
			}
		}
		return nexNodeID;
	}
}
