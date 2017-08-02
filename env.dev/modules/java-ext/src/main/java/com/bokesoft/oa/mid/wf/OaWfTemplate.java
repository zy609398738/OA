package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.NodeProperty;
import com.bokesoft.oa.mid.wf.base.NodePropertyCreate;
import com.bokesoft.oa.mid.wf.base.NodePropertyCreateMap;
import com.bokesoft.oa.mid.wf.base.NodePropertyFinish;
import com.bokesoft.oa.mid.wf.base.NodePropertyFinishMap;
import com.bokesoft.oa.mid.wf.base.Operation;
import com.bokesoft.oa.mid.wf.base.OperationSel;
import com.bokesoft.oa.mid.wf.base.OperationSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.RightSel;
import com.bokesoft.oa.mid.wf.base.RightSelField;
import com.bokesoft.oa.mid.wf.base.RightSelFieldMap;
import com.bokesoft.oa.mid.wf.base.RightSelOperation;
import com.bokesoft.oa.mid.wf.base.RightSelOperationMap;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkingCalendar;
import com.bokesoft.oa.mid.wf.base.WorkingCalendarDtl;
import com.bokesoft.oa.mid.wf.base.WorkingCalendarDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkingCalendarMap;
import com.bokesoft.oa.mid.wf.base.WorkingTime;
import com.bokesoft.yes.bpm.engine.common.BPMContext;
import com.bokesoft.yes.bpm.workitem.Workitem;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.bpm.dev.Spoon;
import com.bokesoft.yigo.bpm.dev.Template;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.attribute.MetaBPMOperation;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.MetaDictionary;
import com.bokesoft.yigo.meta.bpm.process.attribute.participator.Participator;
import com.bokesoft.yigo.meta.bpm.process.attribute.timer.MetaTimerAutoDeny;
import com.bokesoft.yigo.meta.bpm.process.attribute.timer.MetaTimerAutoPass;
import com.bokesoft.yigo.meta.bpm.process.attribute.timer.MetaTimerItem;
import com.bokesoft.yigo.meta.bpm.process.attribute.timer.MetaTimerItemCollection;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaEnablePerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaEnablePermItem;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaOptPerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaOptPermItem;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaPerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaVisiblePerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaVisiblePermItem;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfo;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfoCollection;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessMap;
import com.bokesoft.yigo.meta.calendar.MetaDay;
import com.bokesoft.yigo.meta.calendar.MetaVacation;
import com.bokesoft.yigo.meta.calendar.MetaWorkingCalendar;
import com.bokesoft.yigo.meta.calendar.MetaWorkingCalendarCollection;
import com.bokesoft.yigo.meta.common.MetaBaseScript;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
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
	 *            上下文对象
	 * @param dataObjectKey
	 *            当前数据对象的key
	 * @param formKey
	 *            当前单据对象的Key
	 * @return 流程的集合
	 */
	public MetaProcessMap getMapInfoByMetaKey(DefaultContext context, String dataObjectKey, String formKey)
			throws Throwable {
		OAContext oaContext = new OAContext(context);
		// 如果未指定配置的Key,直接返回
		if (formKey == null) {
			return null;
		}
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, "");
		if (workflowTypeDtl == null) {
			return null;
		}
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaBPM metaBPM = metaFactory.getMetaBPM();
		MetaForm metaForm = metaFactory.getMetaForm(formKey);
		MetaProcessDeployInfoCollection deployInfoCol = metaBPM.getMetaBPMDeployInfoCollection();
		String workflowKey = workflowTypeDtl.getWorkflow().getWorkflowKey();
		MetaProcessMap metaProcessMap = null;
		MetaProcessDeployInfo deployInfo = deployInfoCol.get(workflowKey);
		if (deployInfo == null) {
			throw new Error("当前单据：" + metaForm.getCaption() + "，对应的工作流： " + workflowKey + " 未部署，请先部署单据对应的工作流。");
		}
		metaProcessMap = new MetaProcessMap();
		metaProcessMap.setInitDate(deployInfo.getInitDate());
		metaProcessMap.setKey(formKey);
		metaProcessMap.setProcessKey(workflowKey);
		metaProcessMap.setStartCaption(workflowTypeDtl.getStartCaption());
		String startAction = workflowTypeDtl.getStartAction();
		if (StringUtil.isBlankOrNull(startAction)) {
			startAction = "OA_StartInstance('" + formKey + "'," + workflowTypeDtl.getOID() + "," + context.getOID()
					+ ")";
		}
		metaProcessMap.setStartAction(startAction);
		return metaProcessMap;
	}

	/**
	 * 获得当前流程的的操作列表
	 * 
	 * @param context
	 *            上下文对象
	 * @param pd
	 *            当前流程对象
	 * @param node
	 *            当前流程节点
	 * @param spoon
	 *            决定是否替换原有的操作列表
	 * @return 操作列表
	 */
	public List<MetaBPMOperation> getOperationList(DefaultContext context, MetaProcess process, MetaNode node,
			Spoon spoon) throws Throwable {
		if (context.getDocument() == null) {
			return null;
		}
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		Integer nodeID = node.getID();
		String pdKey = process.getKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(context.getFormKey(),
				pdKey);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		OperationSel operationSel = workflowDesigneDtl.getAuditOptSel();
		// 如果选择操作为空，直接退出
		if (operationSel == null) {
			return null;
		}
		Collection<OperationSelDtl> operationSelDtlCol = operationSel.getOperationSelDtlMap().values();
		List<MetaBPMOperation> list = new ArrayList<MetaBPMOperation>();
		// 如果选择操作为空，直接退出
		if (operationSelDtlCol.size() <= 0) {
			return null;
		} else {// 否则设置为true，替换
			spoon.setMarked(true);
		}

		for (OperationSelDtl operationSelDtl : operationSelDtlCol) {
			MetaBPMOperation metaBPMOperation = new MetaBPMOperation();
			Operation operation = operationSelDtl.getOperation();
			String code = operation.getCode();
			metaBPMOperation.setKey(code);
			String operationName = operationSelDtl.getName();
			metaBPMOperation.setCaption(operationName);
			MetaBaseScript metaBaseScript = new MetaBaseScript("Action");

			if (operation.getUserDefined() == 1) {
				String userAction = operation.getUserAction();
				userAction = userAction.replace("OptKey:{''}", "OptKey:{'" + code + "'}");
				metaBaseScript.setContent(userAction);
				metaBPMOperation.setAction(metaBaseScript);
				metaBPMOperation.setEnable(operation.getUserOptEnable());
				metaBPMOperation.setVisible(operation.getUserOptVisible());
				metaBPMOperation.setCustomKey("");
				metaBPMOperation.setIcon(operation.getUserOptIcon());
				metaBPMOperation.setTemplateKey(operation.getUserTemplateKey());
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
	 * 获得当前流程的参与者列表
	 * 
	 * @param context
	 *            上下文对象
	 * @param pd
	 *            当前流程对象
	 * @param node
	 *            当前流程节点
	 * @param spoon
	 *            决定是否替换参与者列表
	 * @return 参与者列表
	 */
	public List<Participator> getParticipatorList(DefaultContext context, MetaProcess process, MetaNode node,
			Spoon spoon) throws Throwable {
		if (context.getDocument() == null) {
			return null;
		}
		// 设置为true，替换，否则不替换
		spoon.setMarked(true);
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		String pdKey = process.getKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(context.getFormKey(),
				pdKey);
		String ids = getOperatorIDs(oaContext, process, node, workflowTypeDtl);
		List<Participator> list = new ArrayList<Participator>();
		MetaDictionary metaDictionary = new MetaDictionary();
		metaDictionary.setDictionaryKey("Operator");
		metaDictionary.setItemID(ids);
		list.add(metaDictionary);
		return list;
	}

	/**
	 * 获取操作员ID字符串，以冒号分隔
	 * 
	 * @param oaContext
	 *            OA上下文
	 * @param pd
	 *            当前流程对象
	 * @param node
	 *            当前流程节点
	 * @param workflowTypeDtl
	 *            流程类别明细
	 * @return 操作员ID字符串
	 * @throws Throwable
	 */
	private String getOperatorIDs(OAContext oaContext, MetaProcess pd, MetaNode node, WorkflowTypeDtl workflowTypeDtl)
			throws Throwable, Error {
		DefaultContext context = oaContext.getContext();
		Document doc = context.getDocument();
		Long billOID = doc.getOID();
		String formKey = context.getFormKey();
		Integer nodeID = node.getID();
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		WorkflowDesigneDtl preNode = getPreNodeID(oaContext, workflowDesigneDtl);
		String workflowKey = preNode.getHeadBase().getWorkflowKey();
		String ids = oaContext.getNextParticipatorMap().getIDs(formKey, billOID, workflowKey, preNode.getAuditNode(),
				":");
		if (!StringUtil.isBlankOrNull(ids)) {
			return ids;
		}
		OperatorSel operaorSel = workflowDesigneDtl.getAuditPerSel();
		if (operaorSel != null) {
			ids = operaorSel.getParticipatorIDs(billOID);
		}
		if (StringUtil.isBlankOrNull(ids)) {
			if (preNode.getNodeProperty().getNoPer() != 1) {
				throw new Error(
						"流程“" + pd.getCaption() + "”的流程节点“" + node.getCaption() + "”，人员选择的结果为空，请修正流程节点对应的人员选择。");
			}
		}
		return ids;
	}

	/**
	 * 
	 * 根据当前审批节点获得前一个审批节点明细
	 * 
	 * @param context
	 *            OA上下文
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 * @return 前一个审批节点
	 * @return
	 * @throws Throwable
	 */
	private WorkflowDesigneDtl getPreNodeID(OAContext context, WorkflowDesigneDtl workflowDesigneDtl) throws Throwable {
		BPMContext bPMContext = (BPMContext) context.getContext();
		Workitem workitem = bPMContext.getUpdateWorkitem();
		// 如果当前工作项为空，取当前节点
		if (workitem == null) {
			return workflowDesigneDtl;
		}
		Long workitemID = workitem.getWorkItemID();
		WorkflowDesigneDtl preNode = workflowDesigneDtl.getHeadBase().getWorkflowDesigneDtlMap().getPreNode(workitemID);
		// 如果前一个为空，取当前节点
		if (preNode == null) {
			return workflowDesigneDtl;
		}
		return preNode;
	}

	/**
	 * 无参与者自动略过
	 */
	public boolean getAutoIgnoreNoParticipator(DefaultContext context, MetaProcess process, MetaNode node, Spoon spoon)
			throws Throwable {
		Boolean ignore = false;
		// 设置为true，替换，否则不替换
		spoon.setMarked(true);
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		String pdKey = process.getKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(context.getFormKey(),
				pdKey);
		Integer nodeID = node.getID();
		// WorkflowDesigneDtl preNode = getPreNodeID(context, pdKey,
		// nodeID.toString(), workflowTypeDtl);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		if (workflowDesigneDtl.getNodeProperty().getNoPer() == 1) {
			ignore = true;
		}
		return ignore;
	}

	/**
	 * 工作项创建事件
	 */
	public String getCreateTrigger(DefaultContext context, MetaProcess process, MetaNode node, Spoon spoon)
			throws Throwable {
		String creatrFormula = "";
		BPMContext bPMContext = (BPMContext) context;
		Long workitemID = bPMContext.getNewWorkitemID();
		String pdKey = process.getKey();
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		Integer nodeID = node.getID();
		String formKey = context.getFormKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, pdKey);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		NodeProperty nodeProperty = workflowDesigneDtl.getNodeProperty();
		NodePropertyCreateMap nodePropertyCreateMap = nodeProperty.getNodePropertyCreateMap();
		for (NodePropertyCreate nodePropertyCreate : nodePropertyCreateMap.values()) {
			String formula = nodePropertyCreate.getFormula();
			IExtService iExtService = (IExtService) Class.forName(formula).newInstance();
			ArrayList<Object> list = new ArrayList<Object>();
			list.add(oaContext);
			list.add(formKey);
			list.add(process);
			list.add(node);
			list.add(spoon);
			list.add(workflowDesigneDtl);
			list.add(workitemID);
			iExtService.doCmd(context, list);
		}
		creatrFormula = nodeProperty.getFormulaCreate();
		if (!StringUtil.isBlankOrNull(creatrFormula)) {
			// 设置为true，替换，否则不替换
			spoon.setMarked(true);
		}
		return creatrFormula;
	}

	/**
	 * 工作项完成事件
	 */
	public String getFinishTrigger(DefaultContext context, MetaProcess process, MetaNode node, Spoon spoon)
			throws Throwable {
		String finishFormula = "";
		BPMContext bPMContext = (BPMContext) context;
		Long workitemID = bPMContext.getNewWorkitemID();
		String pdKey = process.getKey();
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		Integer nodeID = node.getID();
		String formKey = context.getFormKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, pdKey);
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		NodeProperty nodeProperty = workflowDesigneDtl.getNodeProperty();
		NodePropertyFinishMap nodePropertyFinishMap = nodeProperty.getNodePropertyFinishMap();
		for (NodePropertyFinish nodePropertyFinish : nodePropertyFinishMap.values()) {
			String formula = nodePropertyFinish.getFormula();
			IExtService iExtService = (IExtService) Class.forName(formula).newInstance();
			ArrayList<Object> list = new ArrayList<Object>();
			list.add(oaContext);
			list.add(formKey);
			list.add(process);
			list.add(node);
			list.add(spoon);
			list.add(workflowDesigneDtl);
			list.add(workitemID);
			iExtService.doCmd(context, list);
		}
		finishFormula = nodeProperty.getFormulaFinish();
		if (!StringUtil.isBlankOrNull(finishFormula)) {
			// 设置为true，替换，否则不替换
			spoon.setMarked(true);
		}
		return finishFormula;
	}

	/**
	 * 获得当前节点的审批超时
	 */
	public MetaTimerItemCollection getTimeritemList(DefaultContext context, MetaProcess process, MetaNode node,
			Spoon spoon) throws Throwable {
		BPMContext bPMContext = (BPMContext) context;
		Long billOID = context.getDocument().getOID();
		Long workitemID = bPMContext.getNewWorkitemID();
		String pdKey = process.getKey();
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		Integer nodeID = node.getID();
		String formKey = context.getFormKey();
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, pdKey);
		Long workflowTypeDtlID = workflowTypeDtl.getOID();
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		Long workflowDesigneDtlID = workflowDesigneDtl.getOID();
		NodeProperty nodeProperty = workflowDesigneDtl.getNodeProperty();
		Long informPerOID = nodeProperty.getInformPerOID();
		MetaTimerItemCollection metaTimerItemCollection = new MetaTimerItemCollection();
		// 过时通知
		if (nodeProperty.getOutdateNotice() == 1) {
			Integer common = nodeProperty.getCommon();
			// 一般
			if (common == 1) {
				String peroidFrom = nodeProperty.getFrom_One();
				if (!StringUtil.isBlankOrNull(peroidFrom)) {
					String key = nodeProperty.getOID().toString();
					MetaTimerItem metaTimerItem = new MetaTimerItem();
					metaTimerItemCollection.add(metaTimerItem);
					setMetaTimerItem(formKey, billOID, workitemID, pdKey, nodeID, workflowTypeDtlID,
							workflowDesigneDtlID, informPerOID, common, peroidFrom, key, metaTimerItem);
				}
			}
			// 紧急
			Integer urgency = nodeProperty.getUrgency();
			if (urgency == 1) {
				String peroidFrom = nodeProperty.getFrom_Two();
				String key = nodeProperty.getOID().toString();
				MetaTimerItem metaTimerItem = new MetaTimerItem();
				metaTimerItemCollection.add(metaTimerItem);
				setMetaTimerItem(formKey, billOID, workitemID, pdKey, nodeID, workflowTypeDtlID, workflowDesigneDtlID,
						informPerOID, urgency, peroidFrom, key, metaTimerItem);

			}
			// 特急
			Integer extraUrgent = nodeProperty.getExtraUrgent();
			if (extraUrgent == 1) {
				String peroidFrom = nodeProperty.getFrom_Three();
				String key = nodeProperty.getOID().toString();
				MetaTimerItem metaTimerItem = new MetaTimerItem();
				metaTimerItemCollection.add(metaTimerItem);
				setMetaTimerItem(formKey, billOID, workitemID, pdKey, nodeID, workflowTypeDtlID, workflowDesigneDtlID,
						informPerOID, extraUrgent, peroidFrom, key, metaTimerItem);

			}
		}
		// 过时处理
		if (nodeProperty.getOutdateDeal() == 1) {
			String deadline = nodeProperty.getDeadline();
			if (!StringUtil.isBlankOrNull(deadline)) {
				Integer dealType = nodeProperty.getDealType();
				String key = nodeProperty.getOID().toString();
				if (dealType == 10) {
					String autoDealFun = nodeProperty.getAutoDealFun();
					if (autoDealFun.equalsIgnoreCase("pass")) {
						MetaTimerAutoPass metaTimerAuto = new MetaTimerAutoPass();
						metaTimerItemCollection.add(metaTimerAuto);
						metaTimerAuto.setKey(key);
						metaTimerAuto.setPeroid(deadline);
					} else if (autoDealFun.equalsIgnoreCase("deny")) {
						MetaTimerAutoDeny metaTimerAuto = new MetaTimerAutoDeny();
						metaTimerItemCollection.add(metaTimerAuto);
						metaTimerAuto.setKey(key);
						metaTimerAuto.setPeroid(deadline);
					}
				}
			}
		}

		if (metaTimerItemCollection.size() >= 0) {
			// 设置为true，替换，否则不替换
			spoon.setMarked(true);
		}
		return metaTimerItemCollection;
	}

	/**
	 * 设置超时项目
	 * 
	 * @param formKey
	 *            配置标识
	 * @param workitemID
	 *            工作项标识
	 * @param pdKey
	 *            流程标识
	 * @param nodeID
	 *            流程节点标识
	 * @param workflowTypeDtlID
	 *            流程类别标识
	 * @param workflowDesigneDtlID
	 *            流程设计明细标识
	 * @param informPerOID
	 *            通知人员选择标识
	 * @param urgencyDeg
	 *            紧急程度
	 * @param peroid
	 *            超时内容
	 * @param key
	 *            超时项目标识
	 * @param metaTimerItem
	 *            超时项目
	 */
	private void setMetaTimerItem(String formKey, Long billOID, Long workitemID, String pdKey, Integer nodeID,
			Long workflowTypeDtlID, Long workflowDesigneDtlID, Long informPerOID, Integer urgencyDeg, String peroid,
			String key, MetaTimerItem metaTimerItem) {
		metaTimerItem.setKey(key);
		metaTimerItem.setPeroid(peroid);
		metaTimerItem.setRepeat(false);
		metaTimerItem.setTrigger(
				"TimeoutNotice(" + formKey + "," + billOID + "," + workitemID + "," + pdKey + "," + nodeID + ","
						+ workflowTypeDtlID + "," + workflowDesigneDtlID + "," + informPerOID + "," + urgencyDeg + ")");
	}

	/**
	 * 获得工作日历
	 */
	public MetaWorkingCalendarCollection getWorkingCalendar(DefaultContext context, MetaProcess process, MetaNode node,
			Spoon spoon) throws Throwable {
		Calendar cal = Calendar.getInstance();
		MetaWorkingCalendarCollection metaWorkingCalendarCollection = new MetaWorkingCalendarCollection();
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		WorkingCalendarMap workingCalendarMap = oaContext.getWorkingCalendarMap().getAll();
		for (WorkingCalendar workingCalendar : workingCalendarMap.values()) {
			WorkingCalendarDtlMap workingCalendarDtlMap = workingCalendar.getWorkingCalendarDtlMap();
			// 如果工作日历的明细为空，直接跳过
			if (workingCalendarDtlMap == null || workingCalendarDtlMap.size() <= 0) {
				continue;
			}
			MetaWorkingCalendar metaWorkingCalendar = new MetaWorkingCalendar();
			metaWorkingCalendarCollection.add(metaWorkingCalendar);
			WorkingTime workingTimew = workingCalendar.getWorkingTime();
			metaWorkingCalendar.setKey(workingCalendar.getCode());
			String weekend = workingTimew.getWeekend();
			List<Integer> weekendList = workingTimew.getWeekendList();
			metaWorkingCalendar.setWeekend(weekend);
			metaWorkingCalendar.setOfficeHour(workingTimew.getOfficeHour());
			// 休息日集合
			MetaVacation offDayVacation = new MetaVacation();
			metaWorkingCalendar.add(offDayVacation);
			offDayVacation.setCaption(workingTimew.getCaption());
			// 工作日集合
			MetaVacation workDayVacation = new MetaVacation();
			metaWorkingCalendar.add(workDayVacation);
			workDayVacation.setCaption(workingTimew.getCaption());
			for (WorkingCalendarDtl workingCalendarDtl : workingCalendarDtlMap.values()) {
				cal.setTime(workingCalendarDtl.getDateOfYear());
				// 是否休息日
				if (workingCalendarDtl.getOffDay() == 1) {
					// 排除每周固定休息日
					for (Integer i : weekendList) {
						if (cal.get(Calendar.DAY_OF_WEEK) == i) {
							continue;
						}
					}
					// 设置休息日
					MetaDay day = new MetaDay();
					offDayVacation.add(day);
					day.setYear(cal.get(Calendar.YEAR));
					day.setMonth(cal.get(Calendar.MONTH));
					day.setDay(cal.get(Calendar.DAY_OF_MONTH));
					day.setOffDay(true);
				} else {
					// 设置工作日的每周固定休息日
					for (Integer i : weekendList) {
						if (cal.get(Calendar.DAY_OF_WEEK) == i) {
							MetaDay day = new MetaDay();
							workDayVacation.add(day);
							day.setYear(cal.get(Calendar.YEAR));
							day.setMonth(cal.get(Calendar.MONTH));
							day.setDay(cal.get(Calendar.DAY_OF_MONTH));
							day.setOffDay(false);
						}
					}
				}
			}
		}
		if (metaWorkingCalendarCollection.size() >= 0) {
			// 设置为true，替换，否则不替换
			spoon.setMarked(true);
		}

		return metaWorkingCalendarCollection;
	}

	public Long getWorkitemID(DefaultContext arg0, MetaProcess arg1, MetaNode arg2, Spoon arg3) throws Throwable {
		return null;
	}

	/**
	 * 获得权限
	 */
	public MetaPerm getPerm(DefaultContext context, MetaProcess process, MetaNode node, Spoon spoon) throws Throwable {
		Long oid = context.getOID();
		if (oid <= 0) {
			return null;
		}
		OAContext oaContext = new OAContext(context);
		oaContext.setMetaProcess(process);
		oaContext.setMetaNode(node);
		String pdKey = process.getKey();
		String formKey = context.getFormKey();
		WorkflowTypeDtlMap workflowTypeDtlMap = oaContext.getWorkflowTypeDtlMap();
		WorkflowTypeDtl workflowTypeDtl = workflowTypeDtlMap.getWorkflowTypeDtl(formKey, pdKey, oid);
		if (workflowTypeDtl == null) {
			return null;
		}
		Integer nodeID = node.getID();
		WorkflowDesigneDtl workflowDesigneDtl = workflowTypeDtl.getWorkflowDesigneDtl(nodeID.toString());
		OperatorSel operatorSel = workflowDesigneDtl.getAuditPerSel();
		Long operatorID = context.getEnv().getUserID();
		Set<RightSel> rightSelSet = operatorSel.getRightSelSet(operatorID, oid);
		MetaPerm metaPerm = new MetaPerm();
		metaPerm.setProcessKey(pdKey);
		MetaOptPerm optPerm = new MetaOptPerm();
		metaPerm.setOptPerm(optPerm);
		MetaVisiblePerm visiblePerm = new MetaVisiblePerm();
		metaPerm.setVisiblePerm(visiblePerm);
		MetaEnablePerm enablePerm = new MetaEnablePerm();
		metaPerm.setEnablePerm(enablePerm);
		Set<String> optSet = new HashSet<String>();
		Set<String> visibleSet = new HashSet<String>();
		Set<String> enableSet = new HashSet<String>();
		for (RightSel rightSel : rightSelSet) {
			RightSelOperationMap rightSelOperationMap = rightSel.getRightSelOperationMap();
			for (RightSelOperation rightSelOperation : rightSelOperationMap.values()) {
				if (rightSelOperation.getOperationEnable() != 1) {
					continue;
				}
				String key = rightSelOperation.getOperationKey();
				if (optSet.contains(key)) {
					continue;
				} else {
					optSet.add(key);
				}
				MetaOptPermItem metaOptPermItem = new MetaOptPermItem();
				metaOptPermItem.setKey(key);
				optPerm.add(metaOptPermItem);
			}
			RightSelFieldMap rightSelFieldMap = rightSel.getRightSelFieldMap();
			for (RightSelField rightSelField : rightSelFieldMap.values()) {
				if (rightSelField.getFieldVisible() != 1) {
					String key = rightSelField.getFieldKey();
					if (visibleSet.contains(key)) {
						continue;
					} else {
						visibleSet.add(key);
					}
					MetaVisiblePermItem metaVisiblePermItem = new MetaVisiblePermItem();
					metaVisiblePermItem.setKey(key);
					visiblePerm.add(metaVisiblePermItem);
				}
				if (rightSelField.getFieldEnable() == 1) {
					String key = rightSelField.getFieldKey();
					if (enableSet.contains(key)) {
						continue;
					} else {
						enableSet.add(key);
					}
					MetaEnablePermItem metaEnablePermItem = new MetaEnablePermItem();
					metaEnablePermItem.setKey(key);
					enablePerm.add(metaEnablePermItem);
				}
			}
		}

		if (optSet.size() > 0 || visibleSet.size() > 0 || enableSet.size() > 0) {
			// 设置为true，替换，否则不替换
			spoon.setMarked(true);
		}
		return metaPerm;
	}
}
