package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.config.Settings;

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
	 * 失败后继续发送<br/>
	 * 当为true时，只有前一种发送时如果发送失败，才会调用此方式重新发送。 当为false时，意味着无论前一种发送成功与否，都执行此法送。
	 */
	private Boolean isSucceed = false;

	/**
	 * 是否继续发送<br/>
	 * 当为true时，只有前一种发送时如果发送失败，才会调用此方式重新发送。 当为false时，意味着无论前一种发送成功与否，都执行此法送。
	 * 
	 * @return 是否继续发送
	 */
	public Boolean getIsSucceed() {
		return isSucceed;
	}

	/**
	 * 是否继续发送<br/>
	 * 当为true时，只有前一种发送时如果发送失败，才会调用此方式重新发送。 当为false时，意味着无论前一种发送成功与否，都执行此法送。
	 * 
	 * @param isSucceed
	 *            是否继续发送
	 */
	public void setIsSucceed(Boolean isSucceed) {
		this.isSucceed = isSucceed;
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
}
