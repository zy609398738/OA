package com.bokesoft.oa.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.oa.mid.message.MessageSetMap;
import com.bokesoft.oa.mid.wf.base.BPMInstanceMap;
import com.bokesoft.oa.mid.wf.base.BusinessSourceMap;
import com.bokesoft.oa.mid.wf.base.DepartmentMap;
import com.bokesoft.oa.mid.wf.base.DutyMap;
import com.bokesoft.oa.mid.wf.base.EmployeeMap;
import com.bokesoft.oa.mid.wf.base.EmployeeSourceMap;
import com.bokesoft.oa.mid.wf.base.NextParticipatorMap;
import com.bokesoft.oa.mid.wf.base.NodePropertyMap;
import com.bokesoft.oa.mid.wf.base.OperationMap;
import com.bokesoft.oa.mid.wf.base.OperationSelMap;
import com.bokesoft.oa.mid.wf.base.OperatorMap;
import com.bokesoft.oa.mid.wf.base.OperatorSelMap;
import com.bokesoft.oa.mid.wf.base.RightSelMap;
import com.bokesoft.oa.mid.wf.base.SelRuleMap;
import com.bokesoft.oa.mid.wf.base.WFMigrationMap;
import com.bokesoft.oa.mid.wf.base.WFWorkitemMap;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneMap;
import com.bokesoft.oa.mid.wf.base.WorkflowMap;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeMap;
import com.bokesoft.oa.mid.wf.base.WorkingCalendarMap;
import com.bokesoft.oa.mid.wf.base.WorkingTimeMap;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.oa.mid.wf.base.WorkitemInfMap;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.meta.bpm.process.MetaProcess;
import com.bokesoft.yigo.meta.bpm.process.node.MetaNode;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * OA上下文对象
 * 
 * @author zhoukaihe
 *
 */
public class OAContext {
	/**
	 * Yigo上下文对象
	 */
	private DefaultContext context;

	/**
	 * Yigo上下文对象
	 * 
	 * @return
	 */
	public DefaultContext getContext() {
		return context;
	}

	/**
	 * Yigo上下文对象
	 * 
	 * @param context
	 */
	public void setContext(DefaultContext context) {
		this.context = context;
	}

	/**
	 * 参数配置
	 */
	private Configuration configuration;

	/**
	 * 参数配置
	 * 
	 * @return 参数配置
	 */
	public Configuration getConfiguration() {
		return configuration;
	}

	/**
	 * 参数配置
	 * 
	 * @param configuration
	 *            参数配置
	 */
	public void setConfiguration(Configuration configuration) {
		this.configuration = configuration;
	}

	/**
	 * 参数设置
	 */
	private Settings settings;

	/**
	 * 参数设置
	 * 
	 * @return 参数设置
	 */
	public Settings getSettings() {
		return settings;
	}

	/**
	 * 参数设置
	 * 
	 * @param settings
	 *            参数设置
	 */
	public void setSettings(Settings settings) {
		this.settings = settings;
	}

	/**
	 * 值集合
	 */
	private LinkedHashMap<String, Object> variableMap;

	/**
	 * 值集合
	 * 
	 * @return 值集合
	 */
	public LinkedHashMap<String, Object> getVariableMap() {
		if (variableMap == null) {
			variableMap = new LinkedHashMap<String, Object>();
		}
		return variableMap;
	}

	/**
	 * 值集合
	 * 
	 * @param variableMap
	 *            值集合
	 */
	public void setVariableMap(LinkedHashMap<String, Object> variableMap) {
		this.variableMap = variableMap;
	}

	/**
	 * 当前流程
	 */
	private MetaProcess metaProcess;

	/**
	 * 当前流程
	 * 
	 * @return 当前流程
	 */
	public MetaProcess getMetaProcess() {
		return metaProcess;
	}

	/**
	 * 当前流程
	 * 
	 * @param metaProcess
	 *            当前流程
	 */
	public void setMetaProcess(MetaProcess metaProcess) {
		this.metaProcess = metaProcess;
	}

	/**
	 * 当前流程节点
	 */
	private MetaNode metaNode;

	/**
	 * 当前流程节点
	 * 
	 * @return 当前流程节点
	 */
	public MetaNode getMetaNode() {
		return metaNode;
	}

	/**
	 * 当前流程节点
	 * 
	 * @param metaNode
	 *            当前流程节点
	 */
	public void setMetaNode(MetaNode metaNode) {
		this.metaNode = metaNode;
	}

	/**
	 * 操作员集合
	 */
	private OperatorMap operatorMap;

	/**
	 * 操作员集合
	 * 
	 * @return 操作员集合
	 */
	public OperatorMap getOperatorMap() {
		if (operatorMap == null) {
			operatorMap = new OperatorMap(this);
		}
		return operatorMap;
	}

	/**
	 * 操作员集合
	 * 
	 * @param operatorMap
	 *            操作员集合
	 */
	public void setOperatorMap(OperatorMap operatorMap) {
		this.operatorMap = operatorMap;
	}

	/**
	 * 部门集合
	 */
	private DepartmentMap departmentMap;

	/**
	 * 部门集合
	 * 
	 * @return 部门集合
	 */
	public DepartmentMap getDepartmentMap() {
		if (departmentMap == null) {
			departmentMap = new DepartmentMap(this);
		}
		return departmentMap;
	}

	/**
	 * 部门集合
	 * 
	 * @param departmentMap部门集合
	 */
	public void setDepartmentMap(DepartmentMap departmentMap) {
		this.departmentMap = departmentMap;
	}

	/**
	 * 人员集合
	 */
	private EmployeeMap employeeMap;

	/**
	 * 人员集合
	 * 
	 * @return 人员集合
	 */
	public EmployeeMap getEmployeeMap() {
		if (employeeMap == null) {
			employeeMap = new EmployeeMap(this);
		}
		return employeeMap;
	}

	/**
	 * 人员集合
	 * 
	 * @param employeeMap
	 *            人员集合
	 */
	public void setEmployeeMap(EmployeeMap employeeMap) {
		this.employeeMap = employeeMap;
	}

	/**
	 * 职务集合
	 */
	private DutyMap dutyMap;

	/**
	 * 职务集合
	 * 
	 * @return 职务集合
	 */
	public DutyMap getDutyMap() {
		if (dutyMap == null) {
			dutyMap = new DutyMap(this);
		}
		return dutyMap;
	}

	/**
	 * 职务集合
	 * 
	 * @param DutyMap
	 *            职务集合
	 */
	public void setDutyMap(DutyMap dutyMap) {
		this.dutyMap = dutyMap;
	}

	/**
	 * 流程设计集合
	 */
	private WorkflowDesigneMap workflowDesigneMap;

	/**
	 * 流程设计集合
	 * 
	 * @return 流程设计集合
	 */
	public WorkflowDesigneMap getWorkflowDesigneMap() {
		if (workflowDesigneMap == null) {
			workflowDesigneMap = new WorkflowDesigneMap(this);
		}
		return workflowDesigneMap;
	}

	/**
	 * 流程设计集合
	 * 
	 * @param workflowDesigneMap
	 *            流程设计集合
	 */
	public void setWorkflowDesigneMap(WorkflowDesigneMap workflowDesigneMap) {
		this.workflowDesigneMap = workflowDesigneMap;
	}

	/**
	 * 流程定义集合
	 */
	private WorkflowMap workflowMap;

	/**
	 * 流程定义集合
	 * 
	 * @return 流程定义集合
	 */
	public WorkflowMap getWorkflowMap() {
		if (workflowMap == null) {
			workflowMap = new WorkflowMap(this);
		}
		return workflowMap;
	}

	/**
	 * 流程定义集合
	 * 
	 * @param workflowMap
	 *            流程定义集合
	 */
	public void setWorkflowMap(WorkflowMap workflowMap) {
		this.workflowMap = workflowMap;
	}

	/**
	 * 流程类别集合
	 */
	private WorkflowTypeMap workflowTypeMap;

	/**
	 * 流程类别集合
	 * 
	 * @return 流程类别集合
	 */
	public WorkflowTypeMap getWorkflowTypeMap() {
		if (workflowTypeMap == null) {
			workflowTypeMap = new WorkflowTypeMap(this);
		}
		return workflowTypeMap;
	}

	/**
	 * 流程类别集合
	 * 
	 * @param workflowTypeMap
	 *            流程类别集合
	 */
	public void setWorkflowTypeMap(WorkflowTypeMap workflowTypeMap) {
		this.workflowTypeMap = workflowTypeMap;
	}

	/**
	 * 流程类别明细集合
	 * 
	 * @return 流程类别明细集合
	 */
	private WorkflowTypeDtlMap workflowTypeDtlMap;

	/**
	 * 流程类别明细集合
	 * 
	 * @return 流程类别明细集合
	 */
	public WorkflowTypeDtlMap getWorkflowTypeDtlMap() {
		if (workflowTypeDtlMap == null) {
			workflowTypeDtlMap = new WorkflowTypeDtlMap(this, null);
		}
		return workflowTypeDtlMap;
	}

	/**
	 * 流程类别明细集合
	 * 
	 * @param workflowTypeDtlMap
	 *            流程类别明细集合
	 */
	public void setWorkflowTypeDtlMap(WorkflowTypeDtlMap workflowTypeDtlMap) {
		this.workflowTypeDtlMap = workflowTypeDtlMap;
	}

	/**
	 * 权限选择集合
	 */
	private RightSelMap rightSelMap;

	/**
	 * 权限选择集合
	 * 
	 * @return 权限选择集合
	 */
	public RightSelMap getRightSelMap() {
		if (rightSelMap == null) {
			rightSelMap = new RightSelMap(this);
		}
		return rightSelMap;
	}

	/**
	 * 权限选择集合
	 * 
	 * @param rightSelMap
	 *            权限选择集合
	 */
	public void setRightSelMap(RightSelMap rightSelMap) {
		this.rightSelMap = rightSelMap;
	}

	/**
	 * 操作选择集合
	 */
	private OperationSelMap operationSelMap;

	/**
	 * 操作选择集合
	 * 
	 * @return 操作选择集合
	 */
	public OperationSelMap getOperationSelMap() {
		if (operationSelMap == null) {
			operationSelMap = new OperationSelMap(this);
		}
		return operationSelMap;
	}

	/**
	 * 操作选择集合
	 * 
	 * @param operationSelMap
	 *            操作选择集合
	 */
	public void setOperationSelMap(OperationSelMap operationSelMap) {
		this.operationSelMap = operationSelMap;
	}

	/**
	 * 人员选择集合
	 */
	private OperatorSelMap operatorSelMap;

	/**
	 * 人员选择集合
	 * 
	 * @return 人员选择集合
	 */
	public OperatorSelMap getOperatorSelMap() {
		if (operatorSelMap == null) {
			operatorSelMap = new OperatorSelMap(this);
		}
		return operatorSelMap;
	}

	/**
	 * 人员选择集合
	 * 
	 * @param operatorSelMap
	 *            人员选择集合
	 */
	public void setOperatorSelMap(OperatorSelMap operatorSelMap) {
		this.operatorSelMap = operatorSelMap;
	}

	/**
	 * 审批操作集合
	 */
	private OperationMap operationMap;

	/**
	 * 审批操作集合
	 * 
	 * @return 审批操作集合
	 */
	public OperationMap getOperationMap() {
		if (operationMap == null) {
			operationMap = new OperationMap(this);
		}
		return operationMap;
	}

	/**
	 * 审批操作集合
	 * 
	 * @param operationMap
	 *            审批操作集合
	 */
	public void setOperationMap(OperationMap operationMap) {
		this.operationMap = operationMap;
	}

	/**
	 * 消息设置集合
	 */
	private MessageSetMap messageSetMap;

	/**
	 * 消息设置集合
	 * 
	 * @return 消息设置集合
	 */
	public MessageSetMap getMessageSetMap() {
		if (messageSetMap == null) {
			messageSetMap = new MessageSetMap(this);
		}
		return messageSetMap;
	}

	/**
	 * 消息设置集合
	 * 
	 * @param messageSetMap
	 *            消息设置集合
	 */
	public void setMessageSetMap(MessageSetMap messageSetMap) {
		this.messageSetMap = messageSetMap;
	}

	/**
	 * 业务来源集合
	 */
	private BusinessSourceMap businessSourceMap;

	/**
	 * 业务来源集合
	 * 
	 * @return 业务来源集合
	 */
	public BusinessSourceMap getBusinessSourceMap() {
		if (businessSourceMap == null) {
			businessSourceMap = new BusinessSourceMap(this);
		}
		return businessSourceMap;
	}

	/**
	 * 业务来源集合
	 * 
	 * @param businessSourceMap
	 *            业务来源集合
	 */
	public void setBusinessSourceMap(BusinessSourceMap businessSourceMap) {
		this.businessSourceMap = businessSourceMap;
	}

	/**
	 * 人员来源集合
	 * 
	 * @return 人员来源集合
	 */
	private EmployeeSourceMap employeeSourceMap;

	/**
	 * 人员来源集合
	 * 
	 * @return 人员来源集合
	 */
	public EmployeeSourceMap getEmployeeSourceMap() {
		if (employeeSourceMap == null) {
			employeeSourceMap = new EmployeeSourceMap(this);
		}
		return employeeSourceMap;
	}

	/**
	 * 人员来源集合
	 * 
	 * @param employeeSourceMap
	 *            人员来源集合
	 */
	public void setEmployeeSourceMap(EmployeeSourceMap employeeSourceMap) {
		this.employeeSourceMap = employeeSourceMap;
	}

	/**
	 * 选择规则集合
	 * 
	 * @return 人员来源集合
	 */
	private SelRuleMap selRuleMap;

	/**
	 * 选择规则集合
	 * 
	 * @return 选择规则集合
	 */
	public SelRuleMap getSelRuleMap() {
		if (selRuleMap == null) {
			selRuleMap = new SelRuleMap(this);
		}
		return selRuleMap;
	}

	/**
	 * 选择规则集合
	 * 
	 * @param selRuleMap
	 *            选择规则集合
	 */
	public void setSelRuleMap(SelRuleMap selRuleMap) {
		this.selRuleMap = selRuleMap;
	}

	/**
	 * 下一步参与者集合
	 */
	private NextParticipatorMap nextParticipatorMap;

	/**
	 * 下一步参与者集合
	 * 
	 * @return 下一步参与者集合
	 */
	public NextParticipatorMap getNextParticipatorMap() {
		if (nextParticipatorMap == null) {
			nextParticipatorMap = new NextParticipatorMap(this);
		}
		return nextParticipatorMap;
	}

	/**
	 * 下一步参与者集合
	 * 
	 * @param nextParticipatorMap
	 *            下一步参与者集合
	 */
	public void setNextParticipatorMap(NextParticipatorMap nextParticipatorMap) {
		this.nextParticipatorMap = nextParticipatorMap;
	}

	/**
	 * 流程节点属性集合
	 */
	private NodePropertyMap nodePropertyMap;

	/**
	 * 流程节点属性集合
	 * 
	 * @return 流程节点属性集合
	 */
	public NodePropertyMap getNodePropertyMap() {
		if (nodePropertyMap == null) {
			nodePropertyMap = new NodePropertyMap(this, null);
		}
		return nodePropertyMap;
	}

	/**
	 * 流程节点属性集合
	 * 
	 * @param nodePropertyMap
	 *            流程节点属性集合
	 */
	public void setNodePropertyMap(NodePropertyMap nodePropertyMap) {
		this.nodePropertyMap = nodePropertyMap;
	}

	/**
	 * 流程实例集合
	 */
	private BPMInstanceMap bPMInstanceMap;

	/**
	 * 流程实例集合
	 * 
	 * @return 流程实例集合
	 */
	public BPMInstanceMap getBPMInstanceMap() {
		if (bPMInstanceMap == null) {
			bPMInstanceMap = new BPMInstanceMap(this);
		}
		return bPMInstanceMap;
	}

	/**
	 * 流程实例集合
	 * 
	 * @param bPMInstanceMap
	 *            流程实例集合
	 */
	public void setBPMInstanceMap(BPMInstanceMap bPMInstanceMap) {
		this.bPMInstanceMap = bPMInstanceMap;
	}

	/**
	 * 工作项信息集合
	 */
	private WorkitemInfMap workitemInfMap;

	/**
	 * 工作项信息集合
	 * 
	 * @return 工作项信息集合
	 */
	public WorkitemInfMap getWorkitemInfMap() {
		if (workitemInfMap == null) {
			workitemInfMap = new WorkitemInfMap(this, null);
		}
		return workitemInfMap;
	}

	/**
	 * 工作项信息集合
	 * 
	 * @param workitemInfMap
	 *            工作项信息集合
	 */
	public void setWorkitemInfMap(WorkitemInfMap workitemInfMap) {
		this.workitemInfMap = workitemInfMap;
	}

	/**
	 * 流程工作项集合
	 */
	private WFWorkitemMap wFWorkitemMap;

	/**
	 * 流程工作项集合
	 * 
	 * @return 流程工作项集合
	 */
	public WFWorkitemMap getWFWorkitemMap(WorkitemInf workitemInf) {
		if (wFWorkitemMap == null) {
			wFWorkitemMap = new WFWorkitemMap(this, workitemInf);
		}
		return wFWorkitemMap;
	}

	/**
	 * 流程工作项集合
	 * 
	 * @param wFWorkitemMap
	 *            流程工作项集合
	 */
	public void setWFWorkitemMap(WFWorkitemMap wFWorkitemMap) {
		this.wFWorkitemMap = wFWorkitemMap;
	}

	/**
	 * 流程迁移集合
	 */
	private WFMigrationMap wFMigrationMap;

	/**
	 * 流程迁移集合
	 * 
	 * @return 流程迁移集合
	 */
	public WFMigrationMap getwFMigrationMap() {
		if (wFMigrationMap == null) {
			wFMigrationMap = new WFMigrationMap(this);
		}
		return wFMigrationMap;
	}

	/**
	 * 流程迁移集合
	 * 
	 * @param wFMigrationMap
	 *            流程迁移集合
	 */
	public void setwFMigrationMap(WFMigrationMap wFMigrationMap) {
		this.wFMigrationMap = wFMigrationMap;
	}

	/**
	 * 工时区间集合
	 */
	private WorkingTimeMap workingTimeMap;

	/**
	 * 工时区间集合
	 * 
	 * @return 工时区间集合
	 */
	public WorkingTimeMap getWorkingTimeMap() {
		if (workingTimeMap == null) {
			workingTimeMap = new WorkingTimeMap(this);
		}
		return workingTimeMap;
	}

	/**
	 * 工时区间集合
	 * 
	 * @param workingTimeMap
	 *            工时区间集合
	 */
	public void setWorkingTimeMap(WorkingTimeMap workingTimeMap) {
		this.workingTimeMap = workingTimeMap;
	}

	/**
	 * 工作日历集合
	 */
	private WorkingCalendarMap workingCalendarMap;

	/**
	 * 工作日历集合
	 * 
	 * @return 工作日历集合
	 */
	public WorkingCalendarMap getWorkingCalendarMap() {
		if (workingCalendarMap == null) {
			workingCalendarMap = new WorkingCalendarMap(this);
		}
		return workingCalendarMap;
	}

	/**
	 * 工作日历集合
	 * 
	 * @param workingCalendarMap
	 *            工作日历集合
	 */
	public void setWorkingCalendarMap(WorkingCalendarMap workingCalendarMap) {
		this.workingCalendarMap = workingCalendarMap;
	}

	/**
	 * 构造OA上下文对象
	 * 
	 * @param context
	 * @throws Throwable
	 */
	public OAContext(DefaultContext context) throws Throwable {
		setContext(context);
		Configuration configuration = OASettings.getConfiguration(this);
		settings = configuration.getRootSettings();
	}

	/**
	 * 构造OA上下文对象
	 * 
	 * @param context
	 *            yigo上下文对象
	 * @param moduleKey
	 *            模块Key
	 * @throws Throwable
	 */
	public OAContext(DefaultContext context, String moduleKey) throws Throwable {
		setContext(context);
		Configuration configuration = Configuration.getConfiguration(this);
		settings = configuration.getRootSettings();
	}

	/**
	 * 获取表单的别名
	 * 
	 * @param formKey
	 *            表单的Key
	 * @return 表单的别名
	 * @throws Throwable
	 */
	public String getAliasKey(String formKey) throws Throwable {
		if (StringUtil.isBlankOrNull(formKey)) {
			return formKey;
		}
		DefaultContext context = getContext();
		return context.getVE().getMetaFactory().getMetaForm(formKey).getAliasKey();
	}

	/**
	 * 获得主表名称
	 * 
	 * @param formKey
	 *            配置的Key
	 * @return 主表名称
	 * @throws Throwable
	 */
	public String getMainTableName(String formKey) throws Throwable {
		DefaultContext context = getContext();
		MetaForm metaForm = context.getVE().getMetaFactory().getMetaForm(formKey);
		String tableName = metaForm.getDataSource().getDataObject().getMainTable().getBindingDBTableName();
		return tableName;
	}
}
