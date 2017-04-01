package com.bokesoft.oa.mid.message;

import java.util.Date;

import com.bokesoft.oa.base.Ids;

/**
 * 
 * @author chenbiao
 *
 */
public class Message {
	/**
	 * 是否新增发送记录
	 */
	private Boolean isNewSend;

	/**
	 * 是否新增发送记录
	 * 
	 * @return 是否新增发送记录
	 */
	public Boolean getIsNewSend() {
		return isNewSend;
	}

	/**
	 * 是否新增发送记录
	 * 
	 * @param isNewSend
	 *            是否新增发送记录
	 */
	public void setIsNewSend(Boolean isNewSend) {
		this.isNewSend = isNewSend;
	}

	/**
	 * 模块标识
	 */
	private String moduleKey;

	/**
	 * 模块标识
	 * 
	 * @return 模块标识
	 */
	public String getModuleKey() {
		return moduleKey;
	}

	/**
	 * 模块标识
	 * 
	 * @param moduleKey
	 *            模块标识
	 */
	public void setModuleKey(String moduleKey) {
		this.moduleKey = moduleKey;
	}

	/**
	 * 发送时间
	 */
	private Date sendDate;

	/**
	 * 发送时间
	 * 
	 * @return 发送时间
	 */
	public Date getSendDate() {
		return sendDate;
	}

	/**
	 * 发送时间
	 * 
	 * @param sendDate
	 *            发送时间
	 */
	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}

	/**
	 * 发送人员ID
	 */
	private Long sendOptID;

	/**
	 * 发送人员ID
	 * 
	 * @return 发送人员ID
	 */
	public Long getSendOptID() {
		return sendOptID;
	}

	/**
	 * 发送人员ID
	 * 
	 * @param sendOptID
	 *            发送人员ID
	 */
	public void setSendOptID(Long sendOptID) {
		this.sendOptID = sendOptID;
	}

	/**
	 * 消息内容
	 */
	private String content;

	/**
	 * 消息内容
	 * 
	 * @return 消息内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 消息内容
	 * 
	 * @param content
	 *            消息内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

	/**
	 * 接收人员ID字符串
	 */
	private Ids receiveIDs;

	/**
	 * 接收人员ID字符串
	 * 
	 * @return 接收人员ID字符串
	 */
	public Ids getReceiveIDs() {
		return receiveIDs;
	}

	/**
	 * 接收人员ID字符串
	 * 
	 * @param receiveIDs
	 *            接收人员ID字符串
	 */
	public void setReceiveIDs(Ids receiveIDs) {
		this.receiveIDs = receiveIDs;
	}

	/**
	 * 消息设置
	 */
	private MessageSet messageSet;

	/**
	 * 消息设置
	 * 
	 * @return 消息设置
	 */
	public MessageSet getMessageSet() {
		return messageSet;
	}

	/**
	 * 消息设置
	 * 
	 * @param messageSet
	 *            消息设置
	 */
	public void setMessageSet(MessageSet messageSet) {
		this.messageSet = messageSet;
	}

	/**
	 * 来源单据Key
	 */
	private String srcBillKey;

	/**
	 * 来源单据Key
	 * 
	 * @return 来源单据Key
	 */

	public String getSrcBillKey() {
		return srcBillKey;
	}

	/**
	 * 来源单据Key
	 * 
	 * @param srcBillKey
	 *            来源单据Key
	 */
	public void setSrcBillKey(String srcBillKey) {
		this.srcBillKey = srcBillKey;
	}

	/**
	 * 来源单据编号
	 */
	private String srcBillNO;

	/**
	 * 来源单据编号
	 * 
	 * @return 来源单据编号
	 */
	public String getSrcBillNO() {
		return srcBillNO;
	}

	/**
	 * 来源单据编号
	 * 
	 * @param srcBillNO
	 *            来源单据编号
	 */
	public void setSrcBillNO(String srcBillNO) {
		this.srcBillNO = srcBillNO;
	}

	/**
	 * 来源单据OID
	 */
	private long srcOid;

	/**
	 * 来源单据OID
	 * 
	 * @return 来源单据OID
	 */
	public long getSrcOid() {
		return srcOid;
	}

	/**
	 * 来源单据OID
	 * 
	 * @param srcOid
	 *            来源单据OID
	 */

	public void setSrcOid(long srcOid) {
		this.srcOid = srcOid;
	}

	/**
	 * 主题
	 */

	private String topic;

	/**
	 * 主题
	 * 
	 * @return 主题
	 */
	public String getTopic() {
		return topic;
	}

	/**
	 * 主题
	 * 
	 * @param topic
	 *            主题
	 */
	public void setTopic(String topic) {
		this.topic = topic;
	}

	/**
	 * 消息设置明细
	 */
	private MessageSetDtl messageSetDtl;

	/**
	 * 消息设置明细
	 * 
	 * @return 消息设置明细
	 */
	public MessageSetDtl getMessageSetDtl() {
		return messageSetDtl;
	}

	/**
	 * 发送结果
	 */
	public String Result;

	/**
	 * 发送结果
	 * 
	 * @return 发送结果
	 */
	public String getResult() {
		return Result;
	}

	/**
	 * 发送结果
	 * 
	 * @param result
	 *            发送结果
	 */
	public void setResult(String result) {
		Result = result;
	}

	/**
	 * 消息设置明细
	 * 
	 * @param messageSetDtl
	 *            消息设置明细
	 */
	public void setMessageSetDtl(MessageSetDtl messageSetDtl) {
		this.messageSetDtl = messageSetDtl;
	}

}
