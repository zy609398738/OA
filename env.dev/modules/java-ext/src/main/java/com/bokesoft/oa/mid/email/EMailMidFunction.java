package com.bokesoft.oa.mid.email;

import java.io.File;
import java.io.InputStream;
import java.security.Security;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.apache.commons.io.FileUtils;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yes.mid.base.CoreSetting;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class EMailMidFunction {
	private DefaultContext context;

	public EMailMidFunction(DefaultContext context) throws Throwable {
		setContext(context);
	}

	public void setContext(DefaultContext context) throws Throwable {
		this.context = context;
	}

	public DefaultContext getContext() throws Throwable {
		return context;
	}

	/**
	 * 检查是否连接上邮件服务器
	 * 
	 * 
	 */
	public boolean checkEmailConnect(Long operatorId) throws Throwable {
		// Long operatorId = context.getEnv().getUserID();
		// 得到用户配置的邮件协议
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String host = emailDTO.getReceiverHost();
		int port = emailDTO.getReceiverPort();
		String mailName = emailDTO.getMailName();
		String passwd = emailDTO.getMailPwd();
		// 邮件链接
		EmailConn emailConn = new EmailConn();
		try {
			emailConn.getConn(host, mailName, passwd, port);
		} catch (MessagingException e) {
			e.printStackTrace();
			return false;
		} finally {
			EmailManager.deleteEmailConfigByOperator(operatorId);
		}
		return true;
	}

	/**
	 * 功能:得到当前单据邮件配置对象（将对象设置到存放入持久化容器中）
	 * 
	 * 
	 */
	public boolean getCurrentEmailConfig(boolean isChangeConfig, Long operatorId) throws Throwable {
		// Long operatorId = context.getEnv().getUserID();
		Document doc = context.getDocument();
		DataTable dt = doc.get("OA_EmailSet_H");
		// 判断该operator是否设置过了
		boolean hasConfig = EmailManager.isHasConfigByOperator(operatorId);
		// paras.length > 0 更改邮件服务器地址
		if (!hasConfig || isChangeConfig) {
			// String sql = "select UserName, Password, ReceiverHost,
			// SenderHost,"
			// + " ReceiverPort, SenderPort, Email from OA_EmailSet_H where"
			// + " IsDefault = '1' and OperatorID = '" + operatorId + "'";
			// DataTable dt = context.getDBManager().execPrepareQuery(sql);
			int j = dt.size();
			if (j != 0) {
				EmailDTO emailDTO = new EmailDTO();
				emailDTO.setMailName(TypeConvertor.toString(dt.getObject("UserName")));
				emailDTO.setMailPwd(TypeConvertor.toString(dt.getObject("Password")));
				emailDTO.setReceiverHost(TypeConvertor.toString(dt.getObject("ReceiverHost")));
				emailDTO.setSenderHost(TypeConvertor.toString(dt.getObject("SenderHost")));
				emailDTO.setReceiverPort(TypeConvertor.toInteger(dt.getObject("ReceiverPort")));
				emailDTO.setSenderPort(TypeConvertor.toInteger(dt.getObject("SenderPort")));
				emailDTO.setMailAddress(TypeConvertor.toString(dt.getObject("Email")));
				HashMap<String, String> emailConfig = new HashMap<String, String>();
				emailConfig.put("mailName", TypeConvertor.toString(dt.getObject("UserName")));
				emailConfig.put("mailAddress", TypeConvertor.toString(dt.getObject("Email")));
				emailDTO.setEmailConfig(emailConfig);
				EmailManager.setEmailConfigByOperator(emailDTO, operatorId);
				return true;
			}
			// 删除（设置默认的配置）的操作
			if (j == 0 && hasConfig) {
				EmailManager.deleteEmailConfigByOperator(operatorId);
				return false;
			}
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 功能:得到邮件配置对象（将对象设置到存放入持久化容器中）
	 * 
	 * 
	 */
	public boolean emailConfig(boolean isChangeConfig, Long operatorId) throws Throwable {
		// Long operatorId = context.getEnv().getUserID();
		// 判断该operator是否设置过了
		boolean hasConfig = EmailManager.isHasConfigByOperator(operatorId);
		// paras.length > 0 更改邮件服务器地址
		if (!hasConfig || isChangeConfig) {
			String sql = "select UserName, Password, ReceiverHost, SenderHost,"
					+ " ReceiverPort, SenderPort, Email from OA_EmailSet_H where"
					+ " IsDefault = '1' and OperatorID = '" + operatorId + "'";
			DataTable dt = context.getDBManager().execPrepareQuery(sql);
			int j = dt.size();
			if (j != 0) {
				EmailDTO emailDTO = new EmailDTO();
				emailDTO.setMailName(TypeConvertor.toString(dt.getObject("UserName")));
				emailDTO.setMailPwd(TypeConvertor.toString(dt.getObject("Password")));
				emailDTO.setReceiverHost(TypeConvertor.toString(dt.getObject("ReceiverHost")));
				emailDTO.setSenderHost(TypeConvertor.toString(dt.getObject("SenderHost")));
				emailDTO.setReceiverPort(TypeConvertor.toInteger(dt.getObject("ReceiverPort")));
				emailDTO.setSenderPort(TypeConvertor.toInteger(dt.getObject("SenderPort")));
				emailDTO.setMailAddress(TypeConvertor.toString(dt.getObject("Email")));
				HashMap<String, String> emailConfig = new HashMap<String, String>();
				emailConfig.put("mailName", TypeConvertor.toString(dt.getObject("UserName")));
				emailConfig.put("mailAddress", TypeConvertor.toString(dt.getObject("Email")));
				emailDTO.setEmailConfig(emailConfig);
				EmailManager.setEmailConfigByOperator(emailDTO, operatorId);
				return true;
			}
			// 删除（设置默认的配置）的操作
			if (j == 0 && hasConfig) {
				EmailManager.deleteEmailConfigByOperator(operatorId);
				return false;
			}
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 得到指定用戶的emailDTO对象中的属性
	 * 
	 * 
	 * @param key
	 * @return
	 * @throws Throwable
	 */
	public Object getEmailConfig(String key) throws Throwable {
		Long operatorId = context.getEnv().getUserID();
		return EmailManager.getEmailByOperator(operatorId, key);
	}

	/**
	 * 发送邮件中给message添加邮件对象
	 * 
	 * @param context
	 * @param file
	 * @param mp
	 * @return
	 * @throws Throwable
	 */
	private final String setAttach(File file, Multipart mp) throws Throwable {
		if (file.isDirectory()) {
			File[] fs = file.listFiles();
			for (File t : fs) {
				setAttach(t, mp);// 这里递归
			}
		} else {// 这里是文件，
			// 添加附件
			BodyPart bp2 = new MimeBodyPart();
			FileDataSource fileds = new FileDataSource(file);
			bp2.setDataHandler(new DataHandler(fileds));
			bp2.setFileName(MimeUtility.encodeText(new String(fileds.getName().getBytes(), "gb2312"), "gb2312", null));
			mp.addBodyPart(bp2);
		}
		return "";
	}

	/**
	 * 功能：将邮件发送到邮件服务器，发送多个人用英文‘,’分割
	 * 
	 * @param fromUser
	 *            发件人
	 * @param toUser
	 *            收件人
	 * @param toCopyUserNames
	 *            抄送人
	 * @param mailTitle
	 *            主题
	 * @param mailContent
	 *            正文
	 * @param attachPath
	 *            附件服务器文件存储路径，如果为多个附件用"::"分隔
	 * @param tableKey
	 *            数据表对象的key,如果附件服务器文件存储路径为空，则取指定的数据表对象
	 * @return 发送状态
	 * @throws Throwable
	 */
	public String sendEmailToServer(Long operatorId, String fromUser, String toUser, String toCopyUserNames,
			String mailTitle, String mailContent, String attachPath, String tableKey) throws Throwable {
		// Long operatorId = context.getEnv().getUserID();
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String host = emailDTO.getSenderHost();
		int port = emailDTO.getSenderPort();
		String mailName = emailDTO.getMailName();
		String passwd = emailDTO.getMailPwd();
		String solutionPath = CoreSetting.getInstance().getSolutionPath() + File.separator;
		String dataPath = solutionPath + "Data" + File.separator;
		// 如果发送成功 youjianzhuangtai = "发送成功" else 发送 失败
		String status = "";
		{
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
			// msg 设置=======================
			MimeMessage mimeMsg = new MimeMessage(session);
			// 设置内容 ----begin
			Multipart mp = new MimeMultipart();
			// 添加文本
			BodyPart bp1 = new MimeBodyPart();
			// 服务器中文件
			File file = null;
			try {
				// 设置标题
				mimeMsg.setSubject(mailTitle);
				bp1.setContent(mailContent, "text/html;charset=GB2312");
				mp.addBodyPart(bp1);
				if (StringUtil.isBlankOrNull(attachPath)) {
					if (!StringUtil.isBlankOrNull(tableKey)) {
						Document doc = context.getDocument();
						DataTable dt = doc.get(tableKey);
						dt.beforeFirst();
						while (dt.next()) {
							String path = dt.getString("Path");
							path = dataPath + path;
							file = new File(path);
							if (file.exists()) {
								setAttach(file, mp);
							}
						}
					}
				} else {
					if (attachPath.contains("::")) {
						String attachFiles[] = attachPath.split("::");
						for (String path : attachFiles) {
							path = dataPath + path;
							file = new File(path);
							if (file.exists()) {
								setAttach(file, mp);
							}
						}
					} else {
						// 得到附件
						String path = dataPath + attachPath;
						file = new File(path);
						if (file.exists()) {
							setAttach(file, mp);
						}
					}
				}
				mimeMsg.setContent(mp);
				// 设置内容 ----end
				mimeMsg.setFrom(new InternetAddress(fromUser));
				mimeMsg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(EmailUtil.analyName(toUser))); // 收件人
				mimeMsg.setRecipients(Message.RecipientType.CC, EmailUtil.analyName(toCopyUserNames));// 抄送
				mimeMsg.saveChanges();

				// 传输==================================
				Transport transport = session.getTransport("smtp");
				transport.connect((String) props.get("mail.smtp.host"), mailName, passwd);
				transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.TO)); // 将邮件内容发送给收件人
				if (toCopyUserNames != null && !toCopyUserNames.equals("")) { // 如果邮件有抄送人
					transport.sendMessage(mimeMsg, mimeMsg.getRecipients(Message.RecipientType.CC)); // 将邮件内容发送给抄送人
				}
				transport.close();
				status = "发送成功";
				// 发送过后将邮件存入到发件箱内
			} catch (MessagingException e) {
				e.printStackTrace();
				status = "发送失败";
				if (e.getMessage().equalsIgnoreCase("Missing domain")
						|| e.getMessage().equalsIgnoreCase("Invalid Addresses")) {
					status = status + ":邮件地址不正确。";
				}
				if (e.getMessage().equalsIgnoreCase("Unknown SMTP host: " + host)) {
					status = status + ":邮件设置中SMTP错误";
				}
				if (e.getMessage().equalsIgnoreCase("535 Error: authentication failed\n")) {
					status = status + ":邮件设置中用户名或密码错误";
				}

			}
		}
		System.out.print("邮件发送结果:" + status);
		return status;
	}

	/**
	 * 功能:接收邮件（数据插入数据库中）方法
	 * 
	 */
	public boolean receiveEmail(Long operatorId) throws Throwable {
		// Long operatorId = context.getEnv().getUserID();
		// 得到用户配置的邮件协议
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String host = emailDTO.getReceiverHost();
		int port = emailDTO.getReceiverPort();
		String mailName = emailDTO.getMailName();
		String passwd = emailDTO.getMailPwd();
		// 邮件链接
		EmailConn emailConn = new EmailConn();
		Store store = null;
		try {
			store = emailConn.getConn(host, mailName, passwd, port);
		} catch (MessagingException e) {
			return false;
		}

		String solutionPath = CoreSetting.getInstance().getSolutionPath() + File.separator;
		Folder folder = store.getFolder("INBOX");
		folder.open(Folder.READ_ONLY);
		Message message[] = folder.getMessages();
		EmailReciver pmm = null;
		for (int i = 0; i < message.length; i++) {
			DefaultContext newContext=new DefaultContext(context);
			pmm = new EmailReciver((MimeMessage) message[i]);
			String messageId = pmm.getMessageId(); // 邮件id
			if (i == 0) {
				pmm.setReadById(); // 指定某个设置成一度
			}
			int ret = 0;
			if (messageId != null && messageId != "") {
				String selectSql = "select count(*) n from OA_EmailInbox_H where EmailID = '" + messageId
						+ "' and MailName = '" + mailName + "'";
				DataTable dt = newContext.getDBManager().execPrepareQuery(selectSql);
				dt.beforeFirst();
				while (dt.next()) {
					ret = dt.getInt("n");
				}
			} else {
				ret = 1;
			}
			if (ret != 0) {
				continue;
			}
			String subject = pmm.getSubject(); // 邮件主题
			pmm.setDateFormat("YYYY-MM-DD HH:mm:SS");
			Date sendDate = pmm.getSentDate();
			String fromUser = pmm.getFrom(); // 邮件发送人
			boolean isContainAttach = pmm.isContainAttach((Part) message[i]); // 是否包含附件
			String toUser = pmm.getMailAddress("to"); // 接收人
			String ccUser = pmm.getMailAddress("cc"); // 抄送人
			pmm.emailRepository.add(pmm.getMessageId());
			// 获得邮件内容===============
			pmm.getMailContent((Part) message[i]);
			String bodyText = pmm.getBodyText(); // 邮件正文内容

			List<InputStream> inputStreamList = null; // 附件流
			String fileNames = ""; // 文件名
			String fileName = "";

			// 创建数据对象
			String billkey = "OA_EmailInbox";
			MetaDataObject mdo = MetaFactory.getGlobalInstance().getDataObject(billkey);
			Document doc = DocumentUtil.newDocument(mdo);
			doc.setNew();
			DataTable receiveMainDt = doc.get("OA_EmailInbox_H");
			DataTable receiveDetailDt = doc.get("OA_Attachment");
			Long BillID = newContext.applyNewOID();
			String filePath = billkey + File.separator + BillID + File.separator;
			String dataPath = "Data" + File.separator + filePath;
			String inboxPath = solutionPath + dataPath;
			String contentPath = dataPath + "Content.htm";
			receiveMainDt.setObject("OID", BillID);
			receiveMainDt.setObject("SOID", BillID);
			receiveMainDt.setObject("EmailID", messageId);
			receiveMainDt.setObject("Sender", fromUser);
			receiveMainDt.setObject("Receiver", toUser);
			receiveMainDt.setObject("CopyTo", ccUser);
			receiveMainDt.setObject("Topic", subject);
			receiveMainDt.setObject("EmailTime", sendDate);
			receiveMainDt.setObject("EmailStatus", 20);
			receiveMainDt.setObject("Status", 100);
			receiveMainDt.setObject("MailName", mailName);
			receiveMainDt.setObject("Isdelete", 20);
			receiveMainDt.setObject("OperatorId", operatorId);
			receiveMainDt.setObject("IsDust", 20);
			receiveMainDt.setObject("ContentPath", contentPath);
			receiveMainDt.setObject("Content", bodyText);
			// 将文件正文存入服务器上的一个附件
			// FileUtils.writeStringToFile(new File(contentPathWrite),
			// bodyText);
			// 如果有附件
			if (isContainAttach) {
				InputStream inputStream = null;
				fileNames = pmm.getFileName((Part) message[i]); // 文件名集合
				String[] fileNameList = StringUtil.split(fileNames, ",");
				inputStreamList = pmm.getFileInputStream((Part) (message[i]));
				for (int j = 0; j < inputStreamList.size() && j < fileNameList.length; j++) {
					Long BillDtlID = newContext.applyNewOID();
					// Long attachID = context.applyNewOID();
					fileName = fileNameList[j];
					String attachPath = inboxPath + fileName;
					receiveDetailDt.append();
					receiveDetailDt.setLong("SOID", BillID);
					receiveDetailDt.setLong("OID", BillDtlID);
					receiveDetailDt.setDateTime("UploadTime", new Date());
					receiveDetailDt.setLong("UploadOperator", operatorId);
					receiveDetailDt.setString("Name", fileName);
					receiveDetailDt.setString("Path", filePath + fileName);
					// 保存附件
					inputStream = inputStreamList.get(j);
					FileUtils.copyInputStreamToFile(inputStream, new File(attachPath));
					inputStream.close();
				}
			}

			// DocumentUtil.calcSequence(mdo, doc);
			// 保存Document
			SaveData saveData = new SaveData(mdo, null, doc);
			doc = saveData.save(newContext);
		}
		// 关闭连接
		emailConn.closeConn(folder, store);
		// if (pmm != null) {
		// context.getDocument().setTableFilter(0,
		// "isdelete<>'true' and isDust<>'true' and mailName = '" + mailName +
		// "'");
		// } else {
		// context.getDocument().setTableFilter(0, "1<>1");
		// }
		return true;
	}

	/**
	 * 删除邮件服务器中的对应messageId的邮件
	 * 
	 * 
	 */
	public boolean deleteServerEmailByIDS(Long operatorId, List<Object> ids) throws Throwable {
		if (ids.size() <= 0) {
			return true;
		}
		// 邮件id
		// String[] dts = null;
		// 删除服务器邮件
		// dts = StringUtil.split(ids, ";");
		// Long operatorId = context.getEnv().getUserID();
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String host = emailDTO.getReceiverHost();
		int port = emailDTO.getReceiverPort();
		String userName = emailDTO.getMailName();
		String passwd = emailDTO.getMailPwd();
		EmailConn emailConn = new EmailConn();
		Store store = emailConn.getConn(host, userName, passwd, port);
		Folder folder = store.getFolder("INBOX");
		folder.open(Folder.READ_WRITE);
		Message message[] = folder.getMessages();
		EmailReciver pmm = null;
		for (int i = 0; i < message.length; i++) {
			pmm = new EmailReciver((MimeMessage) message[i]);
			for (Object id : ids) {
				String dt = TypeConvertor.toString(id);
				if (pmm.getMessageId() != null && pmm.getMessageId() != "") {
					if (pmm.getMessageId().equals(dt)) {
						pmm.deleteMessageById();
					}
				}
			}
		}
		emailConn.closeConn(folder, store);
		return true;
	}

	/**
	 * 删除邮件服务器中的对应messageId的邮件
	 * 
	 * 
	 */
	public boolean deleteServerEmailByIDS(Long operatorId, String ids) throws Throwable {
		if (ids.length() <= 0) {
			return true;
		}
		// 邮件id
		String[] dts = null;
		// 删除服务器邮件
		dts = StringUtil.split(ids, ";");
		// Long operatorId = context.getEnv().getUserID();
		EmailDTO emailDTO = EmailManager.getEmailConfigByOperator(operatorId);
		String host = emailDTO.getReceiverHost();
		int port = emailDTO.getReceiverPort();
		String userName = emailDTO.getMailName();
		String passwd = emailDTO.getMailPwd();
		EmailConn emailConn = new EmailConn();
		Store store = emailConn.getConn(host, userName, passwd, port);
		Folder folder = store.getFolder("INBOX");
		folder.open(Folder.READ_WRITE);
		Message message[] = folder.getMessages();
		EmailReciver pmm = null;
		for (int i = 0; i < message.length; i++) {
			pmm = new EmailReciver((MimeMessage) message[i]);
			for (String dt : dts) {
				if (pmm.getMessageId() != null && pmm.getMessageId() != "") {
					if (pmm.getMessageId().equals(dt)) {
						pmm.deleteMessageById();
					}
				}
			}
		}
		emailConn.closeConn(folder, store);
		return true;
	}

	/**
	 * 邮件正文图片上传 FIXME 需要确认是否还使用此方法
	 * 
	 * 
	 */
	/*
	 * public boolean webEmailPictureLoad() throws Throwable { ((MidContext)
	 * context).getBillContext().setComplete(); // 关闭事务 String fileFormat =
	 * "*.*"; new FileUploadTemplate() { // @SuppressWarnings("deprecation") //
	 * protected String getAbsImagePath(MBillContext context) { // int
	 * operatorId = context.getEnv().getUserID(); // EmailDTO emailDTO = //
	 * EmailManager.getEmailConfigByOperator(operatorId); // String name =
	 * emailDTO.getMailName(); // HttpServletRequest request =
	 * (HttpServletRequest) // context.getRequest(); // String separator =
	 * File.separator; // String path = new
	 * StringBuilder(request.getRealPath("")) //
	 * .append(separator).append("upload") //
	 * .append(separator).append(name).toString(); // return path + separator;
	 * // }
	 * 
	 * protected String getRelativePath(Object... args) { return
	 * args[0].toString(); }
	 * 
	 * @Override protected String getUploadDir(MBillContext context) { // TODO
	 * Auto-generated method stub return null; } }.upload(((MidContext)
	 * context).getBillContext(), fileFormat); return true; }
	 * 
	 *//**
		 * 返回服务器的图片路径 FIXME 需要确认是否还使用此方法
		 * 
		 * 
		 *//*
		 * public String showPicPath() throws Throwable { int operatorId =
		 * context.getEnv().getUserID(); EmailDTO emailDTO =
		 * EmailManager.getEmailConfigByOperator(operatorId); String name =
		 * emailDTO.getMailName(); HttpServletRequest request =
		 * (HttpServletRequest) ((MidContext)
		 * context).getBillContext().getRequest(); String path = new
		 * StringBuilder(request.getRequestURL().substring(0,
		 * request.getRequestURL().indexOf(request.getContextPath()) +
		 * request.getContextPath().length()))
		 * .append("/").append("upload/").append(name).append("/").toString();
		 * return path; }
		 */

}
