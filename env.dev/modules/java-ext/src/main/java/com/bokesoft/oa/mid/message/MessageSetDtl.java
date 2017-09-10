package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.oa.util.OASettings;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 消息设置明细
 * 
 * @author chenbiao
 *
 */
public class MessageSetDtl extends DtlBase<MessageSet> {
	/**
	 * 消息类型
	 */
	private Settings messageType;

	/**
	 * 消息类型
	 * 
	 * @return 消息类型
	 */
	public Settings getMessageType() {
		return messageType;
	}

	/**
	 * 消息类型
	 * 
	 * @param messageType
	 *            消息类型
	 */
	public void setMessageType(Settings messageType) {
		this.messageType = messageType;
	}

	/**
	 * 测试接收邮件地址
	 */
	private String receiverEmail;

	/**
	 * 测试接收邮件地址
	 * 
	 * @return 测试接收邮件地址
	 */
	public String getReceiverEmail() {
		return receiverEmail;
	}

	/**
	 * 测试接收邮件地址
	 * 
	 * @param receiverEmail
	 *            测试接收邮件地址
	 */
	public void setReceiverEmail(String receiverEmail) {
		this.receiverEmail = receiverEmail;
	}

	/**
	 * 测试发送邮件地址
	 */
	private String SendEmail;

	/**
	 * 测试发送邮件地址
	 * 
	 * @return 测试发送邮件地址
	 */
	public String getSendEmail() {
		return SendEmail;
	}

	/**
	 * 测试发送邮件地址
	 * 
	 * @param sendEmail
	 *            测试发送邮件地址
	 */
	public void setSendEmail(String sendEmail) {
		SendEmail = sendEmail;
	}

	/**
	 * 构造消息设置明细对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public MessageSetDtl(OAContext context, MessageSet messageSet) {
		super(context, messageSet);
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
		Settings settings = OASettings.getSystemMessageType(getContext());
		String type = dt.getString("MessageType");
		Settings messageType = settings.getMap(type);
		setMessageType(messageType);
		setReceiverEmail(dt.getString("ReceiverEmail"));
		setSendEmail(dt.getString("SendEmail"));
	}
}
