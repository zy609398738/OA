package com.bokesoft.oa.mid.email;

import java.util.HashMap;

/**
 * 
 * @author wangxh2
 *
 */
public class EmailDTO {
	/**
	 * 用户名
	 */
	private String mailName;
	/**
	 * 密码
	 */
	private String mailPwd;
	/**
	 * 接收host
	 */
	private String receiverHost;
	/**
	 * 发送host
	 */
	private String senderHost;
	/**
	 * 接收端口
	 */
	private int receiverPort;
	/**
	 * 发送端口
	 */
	private int senderPort;
	/**
	 * 邮件地址
	 */
	private String mailAddress;
	
	/**
	 * 邮件的信息存入hashMap中
	 */
	private HashMap<String, String> emailConfig;
	
	public HashMap<String, String> getEmailConfig() {
		return emailConfig;
	}

	public void setEmailConfig(HashMap<String, String> emailConfig) {
		this.emailConfig = emailConfig;
	}

	public String getMailName() {
		return mailName;
	}

	public void setMailName(String mailName) {
		this.mailName = mailName;
	}

	public String getMailPwd() {
		return mailPwd;
	}

	public void setMailPwd(String mailPwd) {
		this.mailPwd = mailPwd;
	}

	public String getReceiverHost() {
		return receiverHost;
	}

	public void setReceiverHost(String receiverHost) {
		this.receiverHost = receiverHost;
	}

	public String getSenderHost() {
		return senderHost;
	}

	public void setSenderHost(String senderHost) {
		this.senderHost = senderHost;
	}

	public int getReceiverPort() {
		return receiverPort;
	}

	public void setReceiverPort(int receiverPort) {
		this.receiverPort = receiverPort;
	}

	public int getSenderPort() {
		return senderPort;
	}

	public void setSenderPort(int senderPort) {
		this.senderPort = senderPort;
	}

	public String getMailAddress() {
		return mailAddress;
	}

	public void setMailAddress(String mailAddress) {
		this.mailAddress = mailAddress;
	}
}
