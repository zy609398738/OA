package com.bokesoft.oa.mid.email;

import java.security.Security;
import java.util.Properties;

import javax.mail.Folder;
import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.URLName;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.sun.net.ssl.internal.ssl.Provider;

public class EmailConn {

	/**
	 * 
	 * 连接接收邮件服务器
	 * 
	 * @param host
	 *            邮件服务器地址
	 * @param userName
	 *            用户名
	 * @param passwd
	 *            密码
	 * @param port
	 *            端口号
	 * @return
	 * @throws MessagingException
	 */
	public Store getReceiverConn(String host, String userName, String passwd, int port) throws MessagingException {
		Store store = null;
		Properties props = System.getProperties();
		props.setProperty("mail.pop3.port", TypeConvertor.toString(port));
		// TODO:Gmail使用了安全套接字层SSL,需要身份验证开启SSL
		if (host.equals("pop.gmail.com")) {
			Security.addProvider(new Provider());
			final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
			if (!props.containsKey("mail.pop3.socketFactory.class")) {
				props.setProperty("mail.pop3.socketFactory.class", SSL_FACTORY);
			}
			if (!props.containsKey("mail.pop3.socketFactory.fallback")) {
				props.setProperty("mail.pop3.socketFactory.fallback", "false");
			}
			if (!props.containsKey("mail.pop3.socketFactory.port")) {
				props.setProperty("mail.pop3.socketFactory.port", TypeConvertor.toString(port));
			}
		}
		// 需要清楚这个参数（切换其它的邮件服务器）
		else {
			if (props.containsKey("mail.pop3.socketFactory.class")) {
				props.remove("mail.pop3.socketFactory.class");
			}
			if (props.containsKey("mail.pop3.socketFactory.fallback")) {
				props.remove("mail.pop3.socketFactory.fallback");
			}
			if (props.containsKey("mail.pop3.socketFactory.port")) {
				props.remove("mail.pop3.socketFactory.port");
			}
		}
		Session session = Session.getDefaultInstance(props, null);
		URLName urln = new URLName("pop3", host, port, null, userName, passwd);
		try {
			store = session.getStore(urln);
			store.connect();
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		}
		return store;
	}

	/**
	 * 
	 * 连接发送邮件服务器
	 * 
	 * @param host
	 *            邮件服务器地址
	 * @param userName
	 *            用户名
	 * @param passwd
	 *            密码
	 * @param port
	 *            端口号
	 * @return
	 * @throws MessagingException
	 */
	public Transport getSendConn(String host, String userName, String passwd, int port) throws MessagingException {
		Transport transport = null;
		// 会话===========================
		Properties props = System.getProperties();
		props.put("mail.smtp.host", host);
		// TODO:Gmail 使用了安全套接字层SSL,需要身份验证开启SSL
		if (host.equals("smtp.gmail.com")) {
			Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
			final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
			if (!props.containsKey("mail.smtp.socketFactory.class")) {
				props.setProperty("mail.smtp.socketFactory.class", SSL_FACTORY);
			}
			if (!props.containsKey("mail.smtp.socketFactory.fallback")) {
				props.setProperty("mail.smtp.socketFactory.fallback", "false");
			}
			if (!props.containsKey("mail.smtp.socketFactory.port")) {
				props.setProperty("mail.smtp.socketFactory.port", TypeConvertor.toString(port));
			}
			// 需要清楚这个参数（切换其它的邮件服务器）
		} else {
			if (props.containsKey("mail.smtp.socketFactory.class")) {
				props.remove("mail.smtp.socketFactory.class");
			}
			if (props.containsKey("mail.smtp.socketFactory.fallback")) {
				props.remove("mail.smtp.socketFactory.fallback");
			}
			if (props.containsKey("mail.smtp.socketFactory.port")) {
				props.remove("mail.smtp.socketFactory.port");
			}
		}
		//
		props.put("mail.smtp.port", port);
		props.put("mail.smtp.auth", "true");// 需要身份验证
		Session session = Session.getDefaultInstance(props, null);
		try {
			transport = session.getTransport("smtp");
			transport.connect((String) props.get("mail.smtp.host"), userName, passwd);
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		}
		return transport;
	}

	/**
	 * 功能：关闭folder 和store
	 * 
	 * @param folder
	 * @param store
	 * @throws MessagingException
	 */
	public void closeConn(Folder folder, Store store) throws MessagingException {
		folder.close(true);
		store.close();
	}
}
