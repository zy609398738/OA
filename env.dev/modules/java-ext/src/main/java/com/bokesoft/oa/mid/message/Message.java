package com.bokesoft.oa.mid.message;

import java.util.Date;

import com.bokesoft.oa.base.Base;
import com.bokesoft.oa.base.Ids;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.WorkitemInf;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 消息
 * 
 * @author chenbiao
 *
 */
public class Message extends Base {
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
	 * 抄送人员ID字符串
	 */
	private Ids copyUserIDs;

	/**
	 * 抄送人员ID字符串
	 * 
	 * @return 抄送人员ID字符串
	 */
	public Ids getCopyUserIDs() {
		return copyUserIDs;
	}

	/**
	 * 抄送人员ID字符串
	 * 
	 * @param copyUserIDs
	 *            抄送人员ID字符串
	 */
	public void setCopyUserIDs(Ids copyUserIDs) {
		this.copyUserIDs = copyUserIDs;
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

	/**
	 * 邮件模板
	 */
	private String emailTemp;

	/**
	 * 邮件模板
	 * 
	 * @return 邮件模板
	 */
	public String getEmailTemp() {
		return emailTemp;
	}

	/**
	 * 邮件模板
	 * 
	 * @param emailTemp
	 *            邮件模板
	 */
	public void setEmailTemp(String emailTemp) {
		this.emailTemp = emailTemp;
	}

	/**
	 * 发送条件
	 */
	private String sendFormula;

	/**
	 * 发送条件
	 * 
	 * @return 发送条件
	 */
	public String getSendFormula() {
		return sendFormula;
	}

	/**
	 * 发送条件
	 * 
	 * @param sendFormula
	 *            发送条件
	 */
	public void setSendFormula(String sendFormula) {
		this.sendFormula = sendFormula;
	}

	/**
	 * 是否保存发送消息
	 */
	private Boolean saveSendMessage;

	/**
	 * 是否保存发送消息
	 * 
	 * @return 是否保存发送消息
	 */
	public Boolean getSaveSendMessage() {
		return saveSendMessage;
	}

	/**
	 * 是否保存发送消息
	 * 
	 * @param saveSendMessage
	 *            是否保存发送消息
	 */
	public void setSaveSendMessage(Boolean saveSendMessage) {
		this.saveSendMessage = saveSendMessage;
	}

	/**
	 * 工作项信息
	 */
	private WorkitemInf workitemInf;

	/**
	 * 工作项信息
	 * 
	 * @return 工作项信息
	 */
	public WorkitemInf getWorkitemInf() {
		return workitemInf;
	}

	/**
	 * 工作项信息
	 * 
	 * @param workitemInf
	 *            工作项信息
	 */
	public void setWorkitemInf(WorkitemInf workitemInf) {
		this.workitemInf = workitemInf;
	}

	/**
	 * 表单对象
	 */
	private Document document;

	/**
	 * 表单对象
	 * 
	 * @return 表单对象
	 */
	public Document getDocument() {
		return document;
	}

	/**
	 * 表单对象
	 * 
	 * @param document
	 *            表单对象
	 */
	public void setDocument(Document document) {
		this.document = document;
	}

	/**
	 * 构造消息对象
	 */
	public Message(OAContext context) {
		super(context);
	}

	/**
	 * 构造消息对象
	 * 
	 * @param context
	 *            上下文
	 * @param saveSendMessage
	 *            是否保存发送消息
	 * @param isNewSend
	 *            是否新增发送记录
	 * @param sendDate
	 *            发送时间
	 * @param sendOptID
	 *            发送人员
	 * @param topic
	 *            主题
	 * @param content
	 *            消息内容
	 * @param receiveIDs
	 *            接受人员
	 * @param copyUserIDs
	 *            抄送人员
	 * @param messageSet
	 *            发送消息设置
	 * @param srcBillKey
	 *            源表单Key
	 * @param srcBillNO
	 *            源表单编号
	 * @param srcOid
	 *            源表单OID
	 * @throws Throwable
	 */
	public Message(OAContext oaContext, Boolean saveSendMessage, Boolean isNewSend, Date sendDate, Long sendOptID,
			String topic, String content, String receiveIDs, String copyUserIDs, MessageSet messageSet,
			String srcBillKey, String srcBillNO, Long srcOid) throws Throwable {
		super(oaContext);
		setSaveSendMessage(saveSendMessage);
		setIsNewSend(isNewSend);
		setSendOptID(sendOptID);
		setSendDate(sendDate);
		setTopic(topic);
		setContent(content);
		setReceiveIDs(new Ids(receiveIDs));
		setCopyUserIDs(new Ids(copyUserIDs));
		setMessageSet(messageSet);
		setSrcBillKey(srcBillKey);
		setSrcBillNO(srcBillNO);
		setSrcOid(srcOid);
	}
}
