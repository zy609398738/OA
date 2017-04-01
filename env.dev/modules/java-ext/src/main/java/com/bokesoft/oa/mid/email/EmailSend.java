package com.bokesoft.oa.mid.email;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class EmailSend {
	/**
	 * 功能：发送邮件
	 * 
	 * @param userName
	 *            用户名
	 * @param passwd
	 *            密码
	 * @param fromUserName
	 *            发送人
	 * @param toUserName
	 *            收件人
	 * @param toCopyUserNames
	 *            抄送
	 * @param mailTitle
	 *            主题
	 * @param mailContent
	 *            内容
	 * @param host
	 *            服务器地址
	 * @throws MessagingException
	 */
	public static boolean sendEmail(String userName, String passwd,
			String fromUserName, String toUserName, String toCopyUserNames,
			String mailTitle, String mailContent, String host) {
		// 会话===========================
		Properties props = System.getProperties();
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.auth", "true");// 需要身份验证
		Session session = Session.getDefaultInstance(props, null);
		// msg 设置=======================
		MimeMessage mimeMsg = new MimeMessage(session);
		// 设置内容 ----begin
		Multipart mp = new MimeMultipart();
		// 添加文本
		BodyPart bp1 = new MimeBodyPart();
		try {
			// 设置标题
			mimeMsg.setSubject(mailTitle);
			bp1.setContent(mailContent, "text/html;charset=GB2312");
			mp.addBodyPart(bp1);
			// 添加附件
			BodyPart bp2 = new MimeBodyPart();
			FileDataSource fileds = new FileDataSource("c:\\ftnstat.stat");
			bp2.setDataHandler(new DataHandler(fileds));
			bp2.setFileName(fileds.getName());
			mp.addBodyPart(bp2);
			mimeMsg.setContent(mp);
			// 设置内容 ----end
			mimeMsg.setFrom(new InternetAddress(fromUserName));
			mimeMsg.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(toUserName)); // 收件人
			mimeMsg.setRecipients(Message.RecipientType.CC, toCopyUserNames);// 抄送
			mimeMsg.saveChanges();
			// 传输==================================
			Transport transport = session.getTransport("smtp");
			transport.connect((String) props.get("mail.smtp.host"), userName,
					passwd);
			transport.sendMessage(mimeMsg,
					mimeMsg.getRecipients(Message.RecipientType.TO)); // 将邮件内容发送给收件人
			if (toCopyUserNames != null && !toCopyUserNames.equals("")) { // 如果邮件有抄送人
				transport.sendMessage(mimeMsg,
						mimeMsg.getRecipients(Message.RecipientType.CC)); // 将邮件内容发送给抄送人
			}
			transport.close();
			return true;
			// 发送过后将邮件存入到发件箱内
		} catch (MessagingException e) {
			e.printStackTrace();
			return false;
		}
	}
}
