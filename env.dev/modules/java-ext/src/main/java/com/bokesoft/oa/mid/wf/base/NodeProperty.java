package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;

/**
 * 流程节点属性
 * 
 * @author zhoukaihe
 *
 */
public class NodeProperty extends DtlBase<WorkflowDesigneDtl> {
	/**
	 * 节点属性值的集合
	 */
	private LinkedHashMap<String, Object> nodeValueMap;

	/**
	 * 节点属性值的集合
	 * 
	 * @return 节点属性值的集合
	 */
	public LinkedHashMap<String, Object> getNodeValueMap() {
		if (nodeValueMap == null) {
			nodeValueMap = new LinkedHashMap<String, Object>();
		}
		return nodeValueMap;
	}

	/**
	 * 节点属性值的集合
	 * 
	 * @param nodeValueMap
	 *            节点属性值的集合
	 */
	public void setNodeValueMap(LinkedHashMap<String, Object> nodeValueMap) {
		this.nodeValueMap = nodeValueMap;
	}

	/**
	 * 源表单Key
	 */
	private String sourceKey = "";

	/**
	 * 源表单Key
	 * 
	 * @return 源表单Key
	 */
	public String getSourceKey() {
		return sourceKey;
	}

	/**
	 * 源表单Key
	 * 
	 * @param sourceKey
	 *            源表单Key
	 */
	public void setSourceKey(String sourceKey) {
		this.sourceKey = sourceKey;
	}

	/**
	 * 源表单ID
	 */
	private Long sourceID = 0L;

	/**
	 * 源表单ID
	 * 
	 * @return 源表单ID
	 */
	public Long getSourceID() {
		return sourceID;
	}

	/**
	 * 源表单ID
	 * 
	 * @param sourceID
	 *            源表单ID
	 */
	public void setSourceID(Long sourceID) {
		this.sourceID = sourceID;
	}

	/**
	 * 标签1
	 */
	private String Tag1 = "";

	/**
	 * 标签1
	 * 
	 * @return 标签1
	 */
	public String getTag1() {
		return Tag1;
	}

	/**
	 * 标签1
	 * 
	 * @param tag1
	 *            标签1
	 */
	public void setTag1(String tag1) {
		Tag1 = tag1;
	}

	/**
	 * 标签1
	 */
	private String Tag2 = "";

	/**
	 * 标签2
	 * 
	 * @return 标签2
	 */
	public String getTag2() {
		return Tag2;
	}

	/**
	 * 标签2
	 * 
	 * @param tag2
	 *            标签2
	 */
	public void setTag2(String tag2) {
		Tag2 = tag2;
	}

	private String Tag3 = "";

	/**
	 * 标签3
	 * 
	 * @return 标签3
	 */
	public String getTag3() {
		return Tag3;
	}

	/**
	 * 标签3
	 * 
	 * @param tag3
	 *            标签3
	 */
	public void setTag3(String tag3) {
		Tag3 = tag3;
	}

	private String Tag4 = "";

	/**
	 * 标签4
	 * 
	 * @return 标签4
	 */
	public String getTag4() {
		return Tag4;
	}

	/**
	 * 标签4
	 * 
	 * @param tag4
	 *            标签4
	 */
	public void setTag4(String tag4) {
		Tag4 = tag4;
	}

	/**
	 * 设置下一个参与者
	 */
	private Integer setNextPer = 0;

	/**
	 * 设置下一个参与者
	 * 
	 * @return 设置下一个参与者
	 */
	public Integer getSetNextPer() {
		return setNextPer;
	}

	/**
	 * 设置下一个参与者
	 * 
	 * @param setNextPer
	 *            设置下一个参与者
	 */
	public void setSetNextPer(Integer setNextPer) {
		this.setNextPer = setNextPer;
	}

	/**
	 * 审批意见必填
	 */
	private Integer userInfoCheck = 0;

	/**
	 * 审批意见必填
	 * 
	 * @return 审批意见必填
	 */
	public Integer getUserInfoCheck() {
		return userInfoCheck;
	}

	/**
	 * 审批意见必填
	 * 
	 * @param userInfoCheck
	 *            审批意见必填
	 */
	public void setUserInfoCheck(Integer userInfoCheck) {
		this.userInfoCheck = userInfoCheck;
	}

	/**
	 * 电子签名可用
	 */
	private Integer eSignatureEnable = 0;

	/**
	 * 电子签名可用
	 * 
	 * @return 电子签名可用
	 */
	public Integer getESignatureEnable() {
		return eSignatureEnable;
	}

	/**
	 * 电子签名可用
	 * 
	 * @param eSignatureEnable
	 *            电子签名可用
	 */
	public void setESignatureEnable(Integer eSignatureEnable) {
		this.eSignatureEnable = eSignatureEnable;
	}

	/**
	 * 电子签名必填
	 */
	private Integer eSignatureFill = 0;

	/**
	 * 电子签名必填
	 * 
	 * @return 电子签名必填
	 */
	public Integer getESignatureFill() {
		return eSignatureFill;
	}

	/**
	 * 电子签名必填
	 * 
	 * @param eSignatureFill
	 *            电子签名必填
	 */
	public void setESignatureFill(Integer eSignatureFill) {
		this.eSignatureFill = eSignatureFill;
	}

	/**
	 * 一般超时时间
	 */
	private String from_One = "";

	/**
	 * 一般超时时间
	 * 
	 * @return 一般超时时间
	 */
	public String getFrom_One() {
		return from_One;
	}

	/**
	 * 一般超时时间
	 * 
	 * @param from_One
	 *            一般超时时间
	 */
	public void setFrom_One(String from_One) {
		this.from_One = from_One;
	}

	/**
	 * 紧急超时时间
	 */
	private String from_Two = "";

	/**
	 * 紧急超时时间
	 * 
	 * @return 紧急超时时间
	 */
	public String getFrom_Two() {
		return from_Two;
	}

	/**
	 * 紧急超时时间
	 * 
	 * @param from_One
	 *            紧急超时时间
	 */
	public void setFrom_Two(String from_Two) {
		this.from_Two = from_Two;
	}

	/**
	 * 特急超时时间
	 */
	private String from_Three = "";

	/**
	 * 特急超时时间
	 * 
	 * @return 特急超时时间
	 */
	public String getFrom_Three() {
		return from_Three;
	}

	/**
	 * 特急超时时间
	 * 
	 * @param from_One
	 *            特急超时时间
	 */
	public void setFrom_Three(String from_Three) {
		this.from_Three = from_Three;
	}

	/**
	 * 一般超时后每多少小时发送消息
	 */
	private String every_One = "";

	/**
	 * 一般超时后每多少小时发送消息
	 * 
	 * @return 一般超时后每多少小时发送消息
	 */
	public String getEvery_One() {
		return every_One;
	}

	/**
	 * 一般超时后每多少小时发送消息
	 * 
	 * @param every_One
	 *            一般超时后每多少小时发送消息
	 */
	public void setEvery_One(String every_One) {
		this.every_One = every_One;
	}

	/**
	 * 紧急超时后每多少小时发送消息
	 */
	private String every_Two = "";

	/**
	 * 紧急超时后每多少小时发送消息
	 * 
	 * @return 紧急超时后每多少小时发送消息
	 */
	public String getEvery_Two() {
		return every_Two;
	}

	/**
	 * 紧急超时后每多少小时发送消息
	 * 
	 * @param every_Two
	 *            紧急超时后每多少小时发送消息
	 */
	public void setEvery_Two(String every_Two) {
		this.every_Two = every_Two;
	}

	/**
	 * 特急超时后每多少小时发送消息
	 */
	private String every_Three = "";

	/**
	 * 特急超时后每多少小时发送消息
	 * 
	 * @return 特急超时后每多少小时发送消息
	 */
	public String getEvery_Three() {
		return every_Three;
	}

	/**
	 * 特急超时后每多少小时发送消息
	 * 
	 * @param every_Three
	 *            特急超时后每多少小时发送消息
	 */
	public void setEvery_Three(String every_Three) {
		this.every_Three = every_Three;
	}

	/**
	 * 超过截止日期多少小时后
	 */
	private String deadline = "";

	/**
	 * 超过截止日期多少小时后
	 * 
	 * @return 超过截止日期多少小时后
	 */
	public String getDeadline() {
		return deadline;
	}

	/**
	 * 超过截止日期多少小时后
	 * 
	 * @param deadline
	 *            超过截止日期多少小时后
	 */
	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	/**
	 * 自动延续多少小时
	 */
	private String extend = "";

	/**
	 * 自动延续多少小时
	 * 
	 * @return 自动延续多少小时
	 */
	public String getExtend() {
		return extend;
	}

	/**
	 * 自动延续多少小时
	 * 
	 * @param extend
	 *            自动延续多少小时
	 */
	public void setExtend(String extend) {
		this.extend = extend;
	}

	/**
	 * 自动转发该任务给代理人
	 */
	private Integer autoTransmit = 0;

	/**
	 * 自动转发该任务给代理人
	 * 
	 * @return 自动转发该任务给代理人
	 */
	public Integer getAutoTransmit() {
		return autoTransmit;
	}

	/**
	 * 自动转发该任务给代理人
	 * 
	 * @param autoTransmit
	 *            自动转发该任务给代理人
	 */
	public void setAutoTransmit(Integer autoTransmit) {
		this.autoTransmit = autoTransmit;
	}

	/**
	 * 允许处理者转发该任务给他人
	 */
	private Integer transmitTask = 0;

	/**
	 * 允许处理者转发该任务给他人
	 * 
	 * @return 允许处理者转发该任务给他人
	 */
	public Integer getTransmitTask() {
		return transmitTask;
	}

	/**
	 * 允许处理者转发该任务给他人
	 * 
	 * @param transmitTask
	 *            允许处理者转发该任务给他人
	 */
	public void setTransmitTask(Integer transmitTask) {
		this.transmitTask = transmitTask;
	}

	/**
	 * 允许处理者撤回该任务
	 */
	private Integer callbackTask = 0;

	/**
	 * 允许处理者撤回该任务
	 * 
	 * @return 允许处理者撤回该任务
	 */
	public Integer getCallbackTask() {
		return callbackTask;
	}

	/**
	 * 允许处理者撤回该任务
	 * 
	 * @param callbackTask
	 *            允许处理者撤回该任务
	 */
	public void setCallbackTask(Integer callbackTask) {
		this.callbackTask = callbackTask;
	}

	/**
	 * 撤回意见必填
	 */
	private Integer callbackTaskRequired = 0;

	/**
	 * 撤回意见必填
	 * 
	 * @return 撤回意见必填
	 */
	public Integer getCallbackTaskRequired() {
		return callbackTaskRequired;
	}

	/**
	 * 撤回意见必填
	 * 
	 * @param callbackTaskRequired
	 *            撤回意见必填
	 */
	public void setCallbackTaskRequired(Integer callbackTaskRequired) {
		this.callbackTaskRequired = callbackTaskRequired;
	}

	/**
	 * 允许处理者暂停（挂起）该任务
	 */
	private Integer pauseTask = 0;

	/**
	 * 允许处理者暂停（挂起）该任务
	 * 
	 * @return 允许处理者暂停（挂起）该任务
	 */
	public Integer getPauseTask() {
		return pauseTask;
	}

	/**
	 * 允许处理者暂停（挂起）该任务
	 * 
	 * @param pauseTask
	 *            允许处理者暂停（挂起）该任务
	 */
	public void setPauseTask(Integer pauseTask) {
		this.pauseTask = pauseTask;
	}

	/**
	 * 允许处理者停止该任务
	 */
	private Integer stopTask = 0;

	/**
	 * 允许处理者停止该任务
	 * 
	 * @return 允许处理者停止该任务
	 */
	public Integer getStopTask() {
		return stopTask;
	}

	/**
	 * 允许处理者停止该任务
	 * 
	 * @param stopTask
	 *            允许处理者停止该任务
	 */
	public void setStopTask(Integer stopTask) {
		this.stopTask = stopTask;
	}

	/**
	 * 允许处理者跳转
	 */
	private Integer gotoTask = 0;

	/**
	 * 允许处理者跳转
	 * 
	 * @return 允许处理者跳转
	 */
	public Integer getGotoTask() {
		return gotoTask;
	}

	/**
	 * 允许处理者跳转
	 * 
	 * @param gotoTask
	 *            允许处理者跳转
	 */
	public void setGotoTask(Integer gotoTask) {
		this.gotoTask = gotoTask;
	}

	/**
	 * 跳转意见必填
	 */
	private Integer gotoRequired = 0;

	/**
	 * 跳转意见必填
	 * 
	 * @return 跳转意见必填
	 */
	public Integer getGotoRequired() {
		return gotoRequired;
	}

	/**
	 * 跳转意见必填
	 * 
	 * @param gotoRequired
	 *            跳转意见必填
	 */
	public void setGotoRequired(Integer gotoRequired) {
		this.gotoRequired = gotoRequired;
	}

	/**
	 * 允许删除附件
	 */
	private Integer deleteAtt = 0;

	/**
	 * 允许删除附件
	 * 
	 * @return 允许删除附件
	 */
	public Integer getDeleteAtt() {
		return deleteAtt;
	}

	/**
	 * 允许删除附件
	 * 
	 * @param deleteAtt
	 *            允许删除附件
	 */
	public void setDeleteAtt(Integer deleteAtt) {
		this.deleteAtt = deleteAtt;
	}

	/**
	 * 不允许查看附件
	 */
	private Integer noViewAtt = 0;

	/**
	 * 不允许查看附件
	 * 
	 * @return 不允许查看附件
	 */
	public Integer getNoViewAtt() {
		return noViewAtt;
	}

	/**
	 * 不允许查看附件
	 * 
	 * @param noViewAtt
	 *            不允许查看附件
	 */
	public void setNoViewAtt(Integer noViewAtt) {
		this.noViewAtt = noViewAtt;
	}

	/**
	 * 允许批处理任务
	 */
	private Integer batchDeal = 0;

	/**
	 * 允许批处理任务
	 * 
	 * @return 允许批处理任务
	 */
	public Integer getBatchDeal() {
		return batchDeal;
	}

	/**
	 * 允许批处理任务
	 * 
	 * @param batchDeal
	 *            允许批处理任务
	 */
	public void setBatchDeal(Integer batchDeal) {
		this.batchDeal = batchDeal;
	}

	/**
	 * 不允许填写意见
	 */
	private Integer noWriteOpn = 0;

	/**
	 * 不允许填写意见
	 * 
	 * @return 不允许填写意见
	 */
	public Integer getNoWriteOpn() {
		return noWriteOpn;
	}

	/**
	 * 不允许填写意见
	 * 
	 * @param noWriteOpn
	 *            不允许填写意见
	 */
	public void setNoWriteOpn(Integer noWriteOpn) {
		this.noWriteOpn = noWriteOpn;
	}

	/**
	 * 允许处理者重启该任务
	 */
	private Integer restartTask = 0;

	/**
	 * 允许处理者重启该任务
	 * 
	 * @return 允许处理者重启该任务
	 */
	public Integer getRestartTask() {
		return restartTask;
	}

	/**
	 * 允许处理者重启该任务
	 * 
	 * @param restartTask
	 *            允许处理者重启该任务
	 */
	public void setRestartTask(Integer restartTask) {
		this.restartTask = restartTask;
	}

	/**
	 * 重启意见必填
	 */
	private Integer restartRequired = 0;

	/**
	 * 重启意见必填
	 * 
	 * @return 重启意见必填
	 */
	public Integer getRestartRequired() {
		return restartRequired;
	}

	/**
	 * 重启意见必填
	 * 
	 * @param restartRequired
	 *            重启意见必填
	 */
	public void setRestartRequired(Integer restartRequired) {
		this.restartRequired = restartRequired;
	}

	/**
	 * 允许添加附件
	 */
	private Integer addAtt = 0;

	/**
	 * 允许添加附件
	 * 
	 * @return 允许添加附件
	 */
	public Integer getAddAtt() {
		return addAtt;
	}

	/**
	 * 允许添加附件
	 * 
	 * @param addAtt
	 *            允许添加附件
	 */
	public void setAddAtt(Integer addAtt) {
		this.addAtt = addAtt;
	}

	/**
	 * 允许使用常用意见
	 */
	private Integer commonOpinion;

	/**
	 * 允许使用常用意见
	 * 
	 * @return 允许使用常用意见
	 */
	public Integer getCommonOpinion() {
		return commonOpinion;
	}

	/**
	 * 允许使用常用意见
	 * 
	 * @param commonOpinion
	 *            允许使用常用意见
	 */
	public void setCommonOpinion(Integer commonOpinion) {
		this.commonOpinion = commonOpinion;
	}

	/**
	 * 第一个用户
	 */
	private Integer firstOpt = 0;

	/**
	 * 第一个用户
	 * 
	 * @return 第一个用户
	 */
	public Integer getFirstOpt() {
		return firstOpt;
	}

	/**
	 * 第一个用户
	 * 
	 * @param firstOpt
	 *            第一个用户
	 */
	public void setFirstOpt(Integer firstOpt) {
		this.firstOpt = firstOpt;
	}

	/**
	 * 无对应参与者跳过本节点
	 */
	private Integer noPer = 0;

	/**
	 * 无对应参与者跳过本节点
	 * 
	 * @return 无对应参与者跳过本节点
	 */
	public Integer getNoPer() {
		return noPer;
	}

	/**
	 * 无对应参与者跳过本节点
	 * 
	 * @param noPer
	 *            无对应参与者跳过本节点
	 */
	public void setNoPer(Integer noPer) {
		this.noPer = noPer;
	}

	/**
	 * 处理者为提交人则跳过本节点
	 */
	private Integer sender = 0;

	/**
	 * 处理者为提交人则跳过本节点
	 * 
	 * @return 处理者为提交人则跳过本节点
	 */
	public Integer getSender() {
		return sender;
	}

	/**
	 * 处理者为提交人则跳过本节点
	 * 
	 * @param sender
	 *            处理者为提交人则跳过本节点
	 */
	public void setSender(Integer sender) {
		this.sender = sender;
	}

	/**
	 * 处理者与前一步骤处理者相同跳过本节点
	 */
	private Integer nextPer = 0;

	/**
	 * 处理者与前一步骤处理者相同跳过本节点
	 * 
	 * @return 处理者与前一步骤处理者相同跳过本节点
	 */
	public Integer getNextPer() {
		return nextPer;
	}

	/**
	 * 处理者与前一步骤处理者相同跳过本节点
	 * 
	 * @param nextPer
	 *            处理者与前一步骤处理者相同跳过本节点
	 */
	public void setNextPer(Integer nextPer) {
		this.nextPer = nextPer;
	}

	/**
	 * 处理者与前面任一步骤处理者相同跳过本节点
	 */
	private Integer anyPer = 0;

	/**
	 * 处理者与前面任一步骤处理者相同跳过本节点
	 * 
	 * @return 处理者与前面任一步骤处理者相同跳过本节点
	 */
	public Integer getAnyPer() {
		return anyPer;
	}

	/**
	 * 处理者与前面任一步骤处理者相同跳过本节点
	 * 
	 * @param anyPer
	 *            处理者与前面任一步骤处理者相同跳过本节点
	 */
	public void setAnyPer(Integer anyPer) {
		this.anyPer = anyPer;
	}

	/**
	 * 过时通知
	 */
	private Integer outdateNotice = 0;

	/**
	 * 过时通知
	 * 
	 * @return 过时通知
	 */
	public Integer getOutdateNotice() {
		return outdateNotice;
	}

	/**
	 * 过时通知
	 * 
	 * @param outdateNotice
	 *            过时通知
	 */
	public void setOutdateNotice(Integer outdateNotice) {
		this.outdateNotice = outdateNotice;
	}

	/**
	 * 紧急程度:一般
	 */
	private Integer common = 0;

	/**
	 * 紧急程度:一般
	 * 
	 * @return 紧急程度:一般
	 */
	public Integer getCommon() {
		return common;
	}

	/**
	 * 紧急程度:一般
	 * 
	 * @param common
	 *            紧急程度:一般
	 */
	public void setCommon(Integer common) {
		this.common = common;
	}

	/**
	 * 紧急程度:紧急
	 */
	private Integer urgency = 0;

	/**
	 * 紧急程度:紧急
	 * 
	 * @return 紧急程度:紧急
	 */
	public Integer getUrgency() {
		return urgency;
	}

	/**
	 * 紧急程度:紧急
	 * 
	 * @param urgency
	 *            紧急程度:紧急
	 */
	public void setUrgency(Integer urgency) {
		this.urgency = urgency;
	}

	/**
	 * 紧急程度:特急
	 */
	private Integer extraUrgent = 0;

	/**
	 * 紧急程度:特急
	 * 
	 * @return 紧急程度:特急
	 */
	public Integer getExtraUrgent() {
		return extraUrgent;
	}

	/**
	 * 紧急程度:特急
	 * 
	 * @param extraUrgent
	 *            紧急程度:特急
	 */
	public void setExtraUrgent(Integer extraUrgent) {
		this.extraUrgent = extraUrgent;
	}

	/**
	 * 过时处理
	 */
	private Integer outdateDeal = 0;

	/**
	 * 过时处理
	 * 
	 * @return 过时处理
	 */
	public Integer getOutdateDeal() {
		return outdateDeal;
	}

	/**
	 * 过时处理
	 * 
	 * @param outdateDeal
	 *            过时处理
	 */
	public void setOutdateDeal(Integer outdateDeal) {
		this.outdateDeal = outdateDeal;
	}

	/**
	 * 超时处理方式
	 */
	private Integer dealType = 0;

	/**
	 * 超时处理方式
	 * 
	 * @return 超时处理方式
	 */
	public Integer getDealType() {
		return dealType;
	}

	/**
	 * 超时处理方式
	 * 
	 * @param dealType
	 *            超时处理方式
	 */
	public void setDealType(Integer dealType) {
		this.dealType = dealType;
	}

	/**
	 * 自动处理方法
	 */
	private String autoDealFun = "";

	/**
	 * 自动处理方法
	 * 
	 * @return 自动处理方法
	 */
	public String getAutoDealFun() {
		return autoDealFun;
	}

	/**
	 * 自动处理方法
	 * 
	 * @param autoDealFun
	 *            自动处理方法
	 */
	public void setAutoDealFun(String autoDealFun) {
		this.autoDealFun = autoDealFun;
	}

	/**
	 * 是否保留当前步骤
	 */
	private Integer retain = 0;

	/**
	 * 是否保留当前步骤
	 * 
	 * @return 是否保留当前步骤
	 */
	public Integer getRetain() {
		return retain;
	}

	/**
	 * 是否保留当前步骤
	 * 
	 * @param retain
	 *            是否保留当前步骤
	 */
	public void setRetain(Integer retain) {
		this.retain = retain;
	}

	/**
	 * 是否自动延续
	 */
	private Integer delayed = 0;

	/**
	 * 是否自动延续
	 * 
	 * @return 是否自动延续
	 */
	public Integer getDelayed() {
		return delayed;
	}

	/**
	 * 是否自动延续
	 * 
	 * @param delayed
	 *            是否自动延续
	 */
	public void setDelayed(Integer delayed) {
		this.delayed = delayed;
	}

	/**
	 * 启用考核
	 */
	private Integer startUsingCheck = 0;

	/**
	 * 启用考核
	 * 
	 * @return 启用考核
	 */
	public Integer getStartUsingCheck() {
		return startUsingCheck;
	}

	/**
	 * 启用考核
	 * 
	 * @param startUsingCheck
	 *            启用考核
	 */
	public void setStartUsingCheck(Integer startUsingCheck) {
		this.startUsingCheck = startUsingCheck;
	}

	/**
	 * 标准处理时间
	 */
	private String stdProTime = "";

	/**
	 * 标准处理时间
	 * 
	 * @return 标准处理时间
	 */
	public String getStdProTime() {
		return stdProTime;
	}

	/**
	 * 标准处理时间
	 * 
	 * @param stdProTime
	 *            标准处理时间
	 */
	public void setStdProTime(String stdProTime) {
		this.stdProTime = stdProTime;
	}

	/**
	 * 处理时间类型
	 */
	private Integer workType = 0;

	/**
	 * 处理时间类型
	 * 
	 * @return 处理时间类型
	 */
	public Integer getWorkType() {
		return workType;
	}

	/**
	 * 处理时间类型
	 * 
	 * @param workType
	 *            处理时间类型
	 */
	public void setWorkType(Integer workType) {
		this.workType = workType;
	}

	/**
	 * 通知人员
	 */
	private String informPerDepict = "";

	/**
	 * 通知人员
	 * 
	 * @return 通知人员
	 */
	public String getInformPerDepict() {
		return informPerDepict;
	}

	/**
	 * 通知人员
	 * 
	 * @param informPerDepict
	 *            通知人员
	 */
	public void setInformPerDepict(String informPerDepict) {
		this.informPerDepict = informPerDepict;
	}

	/**
	 * 通知人员ID
	 */
	private Long informPerOID = 0L;

	/**
	 * 通知人员ID
	 * 
	 * @return 通知人员ID
	 */
	public Long getInformPerOID() {
		return informPerOID;
	}

	/**
	 * 通知人员ID
	 * 
	 * @param informPerOID
	 *            通知人员ID
	 */
	public void setInformPerOID(Long informPerOID) {
		this.informPerOID = informPerOID;
	}

	/**
	 * 通知人员选择
	 */
	private OperatorSel informPerSel;

	/**
	 * 通知人员选择
	 * 
	 * @return 通知人员选择
	 * @throws Throwable
	 */
	public OperatorSel getInformPerSel() throws Throwable {
		if (informPerOID <= 0) {
			return informPerSel;
		}
		if (informPerSel == null) {
			informPerSel = getContext().getOperatorSelMap().get(informPerOID);
		}
		return informPerSel;
	}

	/**
	 * 通知人员选择
	 * 
	 * @param informPerSel
	 *            通知人员选择
	 */
	public void setInformPerSel(OperatorSel informPerSel) {
		this.informPerSel = informPerSel;
	}

	/**
	 * 发送方式ID
	 */
	private Long sendTypeID = 0L;

	/**
	 * 发送方式ID
	 * 
	 * @return 发送方式ID
	 */
	public Long getSendTypeID() {
		return sendTypeID;
	}

	/**
	 * 发送方式ID
	 * 
	 * @param sendTypeID
	 *            发送方式ID
	 */
	public void setSendTypeID(Long sendTypeID) {
		this.sendTypeID = sendTypeID;
	}

	/**
	 * 发送方式
	 */
	private MessageSet sendType;

	/**
	 * 发送方式
	 * 
	 * @return 发送方式
	 * @throws Throwable
	 */
	public MessageSet getSendType() throws Throwable {
		if (sendTypeID <= 0) {
			return sendType;
		}
		if (sendType == null) {
			sendType = getContext().getMessageSetMap().get(sendTypeID);
		}
		return sendType;
	}

	/**
	 * 发送方式
	 * 
	 * @param sendType
	 *            发送方式
	 */
	public void setSendType(MessageSet sendType) {
		this.sendType = sendType;
	}

	/**
	 * 工作项创建执行内容
	 */
	private String formulaCreate;

	/**
	 * 工作项创建执行内容
	 * 
	 * @return 工作项创建执行内容
	 */
	public String getFormulaCreate() {
		return formulaCreate;
	}

	/**
	 * 工作项创建执行内容
	 * 
	 * @param formulaCreate
	 *            工作项创建执行内容
	 */
	public void setFormulaCreate(String formulaCreate) {
		this.formulaCreate = formulaCreate;
	}

	/**
	 * 工作项完成执行内容
	 */
	private String formulaFinish;

	/**
	 * 工作项完成执行内容
	 * 
	 * @return 工作项完成执行内容
	 */
	public String getFormulaFinish() {
		return formulaFinish;
	}

	/**
	 * 工作项完成执行内容
	 * 
	 * @param formulaFinish
	 *            工作项完成执行内容
	 */
	public void setFormulaFinish(String formulaFinish) {
		this.formulaFinish = formulaFinish;
	}

	/**
	 * 节点创建集合
	 */
	private NodePropertyCreateMap nodePropertyCreateMap;

	/**
	 * 节点创建集合
	 * 
	 * @return 节点创建集合
	 * @throws Throwable
	 */
	public NodePropertyCreateMap getNodePropertyCreateMap() throws Throwable {
		if (nodePropertyCreateMap == null) {
			nodePropertyCreateMap = new NodePropertyCreateMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_NodeProperty_Create where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				nodePropertyCreateMap.loadData(dtlDt);
			}
		}
		return nodePropertyCreateMap;
	}

	/**
	 * 节点创建集合
	 * 
	 * @param nodePropertyCreateMap
	 *            节点创建集合
	 */
	public void setNodePropertyCreateMap(NodePropertyCreateMap nodePropertyCreateMap) {
		this.nodePropertyCreateMap = nodePropertyCreateMap;
	}

	/**
	 * 构造流程节点属性对象
	 * 
	 * @param context
	 *            中间层对象
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 */
	public NodeProperty(OAContext context, WorkflowDesigneDtl workflowDesigneDtl) {
		super(context, workflowDesigneDtl);
	}

	/**
	 * 节点完成集合
	 */
	private NodePropertyFinishMap nodePropertyFinishMap;

	/**
	 * 节点完成集合
	 * 
	 * @return 节点完成集合
	 * @throws Throwable
	 */
	public NodePropertyFinishMap getNodePropertyFinishMap() throws Throwable {
		if (nodePropertyFinishMap == null) {
			nodePropertyFinishMap = new NodePropertyFinishMap(getContext(), this);
			Long oid = getOID();
			if (oid > 0) {
				String dtlSql = "select * from OA_NodeProperty_Finish where OID>0 and SOID=?";
				DataTable dtlDt = getContext().getContext().getDBManager().execPrepareQuery(dtlSql, oid);
				nodePropertyFinishMap.loadData(dtlDt);
			}
		}
		return nodePropertyFinishMap;
	}

	/**
	 * 节点完成集合
	 * 
	 * @param nodePropertyFinishMap
	 *            节点完成集合
	 */
	public void setNodePropertyFinishMap(NodePropertyFinishMap nodePropertyFinishMap) {
		this.nodePropertyFinishMap = nodePropertyFinishMap;
	}

	/**
	 * 流程设计明细
	 */
	private WorkflowDesigneDtl workflowDesigneDtl;

	/**
	 * 流程设计明细
	 * 
	 * @return 流程设计明细
	 */
	public WorkflowDesigneDtl getWorkflowDesigneDtl() {
		return workflowDesigneDtl;
	}

	/**
	 * 流程设计明细
	 * 
	 * @param workflowDesigneDtl
	 *            流程设计明细
	 */
	public void setWorkflowDesigneDtl(WorkflowDesigneDtl workflowDesigneDtl) {
		this.workflowDesigneDtl = workflowDesigneDtl;
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		LinkedHashMap<String, Object> nodeValueMap = getNodeValueMap();
		DataTableMetaData metaData = dt.getMetaData();
		for (Integer i = 0; i < metaData.getColumnCount(); i++) {
			ColumnInfo columnInfo = metaData.getColumnInfo(i);
			nodeValueMap.put(columnInfo.getColumnKey().toUpperCase(), dt.getObject(i));
		}
		setSourceKey(dt.getString("SourceKey"));
		setSourceID(dt.getLong("SourceID"));
		setTag1(dt.getString("Tag1"));
		setTag2(dt.getString("Tag2"));
		setTag3(dt.getString("Tag3"));
		setTag4(dt.getString("Tag4"));
		setFrom_One(dt.getString("From_One"));
		setFrom_Two(dt.getString("From_Two"));
		setFrom_Three(dt.getString("From_Three"));
		setEvery_One(dt.getString("Every_One"));
		setEvery_Two(dt.getString("Every_Two"));
		setEvery_Three(dt.getString("Every_Three"));
		setInformPerDepict(dt.getString("InformPerDepict"));
		setDeadline(dt.getString("Deadline"));
		setCommonOpinion(dt.getInt("CommonOpinion"));
		setExtend(dt.getString("Extend"));
		setStdProTime(dt.getString("StdProTime"));
		setWorkType(dt.getInt("WorkType"));
		setInformPerOID(dt.getLong("InformPerOID"));
		setSendTypeID(dt.getLong("SendTypeID"));
		setSetNextPer(dt.getInt("SetNextPer"));
		setUserInfoCheck(dt.getInt("UserInfoCheck"));
		setESignatureEnable(dt.getInt("ESignatureEnable"));
		setESignatureFill(dt.getInt("ESignatureFill"));
		setFirstOpt(dt.getInt("FirstOpt"));
		setNoPer(dt.getInt("NOPer"));
		setSender(dt.getInt("Sender"));
		setNextPer(dt.getInt("NextPer"));
		setAnyPer(dt.getInt("AnyPer"));
		setOutdateNotice(dt.getInt("OutdateNotice"));
		setCommon(dt.getInt("Common"));
		setUrgency(dt.getInt("Urgency"));
		setExtraUrgent(dt.getInt("ExtraUrgent"));
		setAutoTransmit(dt.getInt("AutoTransmit"));
		setTransmitTask(dt.getInt("TransmitTask"));
		setCallbackTask(dt.getInt("CallbackTask"));
		setCallbackTaskRequired(dt.getInt("CallbackTaskRequired"));
		setPauseTask(dt.getInt("PauseTask"));
		setStopTask(dt.getInt("StopTask"));
		setGotoTask(dt.getInt("GotoTask"));
		setGotoRequired(dt.getInt("GotoRequired"));
		setDeleteAtt(dt.getInt("DeleteAtt"));
		setAddAtt(dt.getInt("AddAtt"));
		setRestartTask(dt.getInt("RestartTask"));
		setRestartRequired(dt.getInt("RestartRequired"));
		setNoWriteOpn(dt.getInt("NOWriteOpn"));
		setBatchDeal(dt.getInt("BatchDeal"));
		setNoViewAtt(dt.getInt("NOViewAtt"));
		setStartUsingCheck(dt.getInt("StartUsingCheck"));
		setOutdateDeal(dt.getInt("OutdateDeal"));
		setDelayed(dt.getInt("Delayed"));
		setDealType(dt.getInt("DealType"));
		setAutoDealFun(dt.getString("AutoDealFun"));
		setRetain(dt.getInt("Retain"));
		setFormulaCreate(dt.getString("FormulaCreate"));
		setFormulaFinish(dt.getString("FormulaFinish"));
	}

	/**
	 * 获得人员选择的Key
	 * 
	 * @return 人员选择的Key
	 */
	public String getSelectKey() {
		return getSelectKey(getSourceKey(), getSourceID(), getTag1(), getTag2(), getTag3(), getTag4());
	}

	/**
	 * 获得选择的Key
	 * 
	 * @param sourceKey
	 *            源表单Key
	 * @param sourceID
	 *            源表单ID
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 人员选择的Key
	 */
	public static String getSelectKey(String sourceKey, Long sourceID, String tag1, String tag2, String tag3,
			String tag4) {
		StringBuffer sb = new StringBuffer();
		sb.append(sourceKey);
		sb.append(":");
		sb.append(sourceID);
		sb.append(":");
		sb.append(tag1);
		sb.append(":");
		sb.append(tag2);
		sb.append(":");
		sb.append(tag3);
		sb.append(":");
		sb.append(tag4);
		String key = sb.toString();
		return key;
	}

	/**
	 * 获得人员选择的Sql查询条件
	 * 
	 * @param sourceKey
	 *            源表单Key
	 * @param sourceID
	 *            源表单ID
	 * @param tag1
	 *            标签1
	 * @param tag2
	 *            标签2
	 * @param tag3
	 *            标签3
	 * @param tag4
	 *            标签4
	 * @return 人员选择的Sql查询条件
	 */
	public static String getSqlWhere(String sourceKey, Long sourceID, String tag1, String tag2, String tag3,
			String tag4) {
		StringBuffer sb = new StringBuffer();
		if (!StringUtil.isBlankOrNull(sourceKey)) {
			sb.append(" and sourceKey='");
			sb.append(sourceKey);
			sb.append("'");
		}
		if (sourceID > 0) {
			sb.append(" and sourceID=");
			sb.append(sourceID);
		}
		if (!StringUtil.isBlankOrNull(tag1)) {
			sb.append(" and Tag1='");
			sb.append(tag1);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag2)) {
			sb.append(" and Tag2='");
			sb.append(tag2);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag3)) {
			sb.append(" and Tag3='");
			sb.append(tag3);
			sb.append("'");
		}

		if (!StringUtil.isBlankOrNull(tag4)) {
			sb.append(" and Tag4='");
			sb.append(tag4);
			sb.append("'");
		}
		String key = sb.toString();
		if (!StringUtil.isBlankOrNull(key)) {
			key = key.substring(4);
		}
		return key;
	}
}
