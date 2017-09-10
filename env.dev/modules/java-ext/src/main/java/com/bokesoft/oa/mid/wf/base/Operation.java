package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.message.MessageSet;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 审批操作
 * 
 * @author minjian
 *
 */
public class Operation extends DicBase {
	/**
	 * 用户自定义
	 */
	private Integer userDefined;

	/**
	 * 用户自定义
	 * 
	 * @return 用户自定义
	 */
	public Integer getUserDefined() {
		return userDefined;
	}

	/**
	 * 用户自定义
	 * 
	 * @param userDefined
	 *            用户自定义
	 */
	public void setUserDefined(Integer userDefined) {
		this.userDefined = userDefined;
	}

	/**
	 * 执行公式
	 */
	private String userAction;

	/**
	 * 执行公式
	 * 
	 * @return 执行公式
	 */
	public String getUserAction() {
		return userAction;
	}

	/**
	 * 执行公式
	 * 
	 * @param userAction
	 *            执行公式
	 */
	public void setUserAction(String userAction) {
		this.userAction = userAction;
	}

	/**
	 * 可用性
	 */
	private String userOptEnable;

	/**
	 * 可用性
	 * 
	 * @return 可用性
	 */
	public String getUserOptEnable() {
		return userOptEnable;
	}

	/**
	 * 可用性
	 * 
	 * @param userOptEnable
	 *            可用性
	 */
	public void setUserOptEnable(String userOptEnable) {
		this.userOptEnable = userOptEnable;
	}

	/**
	 * 可见性
	 */
	private String userOptVisible;

	/**
	 * 可见性
	 * 
	 * @return 可见性
	 */
	public String getUserOptVisible() {
		return userOptVisible;
	}

	/**
	 * 可见性
	 * 
	 * @param userOptVisible
	 *            可见性
	 */
	public void setUserOptVisible(String userOptVisible) {
		this.userOptVisible = userOptVisible;
	}

	/**
	 * 图标
	 */
	private String userOptIcon;

	/**
	 * 图标
	 * 
	 * @return 图标
	 */
	public String getUserOptIcon() {
		return userOptIcon;
	}

	/**
	 * 图标
	 * 
	 * @param userOptIcon
	 *            图标
	 */
	public void setUserOptIcon(String userOptIcon) {
		this.userOptIcon = userOptIcon;
	}

	/**
	 * 操作模板
	 */
	private String userTemplateKey;

	/**
	 * 操作模板
	 * 
	 * @return 操作模板
	 */
	public String getUserTemplateKey() {
		return userTemplateKey;
	}

	/**
	 * 操作模板
	 * 
	 * @param userTemplateKey
	 *            操作模板
	 */
	public void setUserTemplateKey(String userTemplateKey) {
		this.userTemplateKey = userTemplateKey;
	}

	/**
	 * 消息设置ID
	 */
	private Long messageSetID;

	/**
	 * 消息设置ID
	 */
	public Long getMessageSetID() {
		return messageSetID;
	}

	/**
	 * 消息设置ID
	 * 
	 * @param messageSetID
	 */
	public void setMessageSetID(Long messageSetID) {
		this.messageSetID = messageSetID;
	}

	/**
	 * 消息设置
	 */
	private MessageSet messageSet;

	/**
	 * 消息设置
	 * 
	 * @return 消息设置
	 * @throws Throwable
	 */
	public MessageSet getMessageSet() throws Throwable {
		if (messageSet == null && messageSetID > 0) {
			messageSet = getContext().getMessageSetMap().get(messageSetID);
		}
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
		setMessageSetID(messageSet.getOID());
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
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setUserDefined(dt.getInt("UserDefined"));
		setUserAction(dt.getString("UserAction"));
		setUserOptEnable(TypeConvertor.toString(dt.getString("UserOptEnable")));
		setUserOptVisible(TypeConvertor.toString(dt.getString("UserOptVisible")));
		setUserOptIcon(TypeConvertor.toString(dt.getString("UserOptIcon")));
		setUserTemplateKey(TypeConvertor.toString(dt.getString("UserTemplateKey")));
		setMessageSetID(dt.getLong("SendType"));
		setEmailTemp(dt.getString("EmailTemp"));
		setSendFormula(dt.getString("SendFormula"));
	}

	/**
	 * 构造审批操作对象
	 * 
	 * @param context
	 *            OA上下文对象
	 */
	public Operation(OAContext context) {
		super(context);
	}
}
