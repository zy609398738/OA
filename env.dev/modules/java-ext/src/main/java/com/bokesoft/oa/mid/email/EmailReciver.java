package com.bokesoft.oa.mid.email;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.mail.BodyPart;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

/**
 * 有一封邮件就需要建立一个EmailReciver对象
 */
public class EmailReciver {
	private MimeMessage mimeMessage = null;
	private String saveAttachPath = ""; // 附件下载后的存放目录
	private String bodytext = ""; // 存放邮件内容
	private InputStream inputStream;
	private String dateformat = "yy-MM-dd HH:mm"; // 默认的日前显示格式
	private String namePreSign = EmailUtil.namePreSign;
	private String nameEndSign = EmailUtil.nameEndSign;

	public  ArrayList<String> emailRepository = new ArrayList<String>();

	public EmailReciver(MimeMessage mimeMessage) {
		this.mimeMessage = mimeMessage;
	}

	public void setMimeMessage(MimeMessage mimeMessage) {
		this.mimeMessage = mimeMessage;
	}

	/**
	 * 获得发件人的地址和姓名
	 * 
	 */
	public String getFrom() throws Exception {
		InternetAddress address[] = (InternetAddress[]) mimeMessage.getFrom();
		String from = address[0].getAddress();
		if (from == null)
			from = "";
		String personal = address[0].getPersonal();
		if (personal == null)
			//personal = "";
			personal = from;
		String fromaddr = personal + namePreSign + from + nameEndSign;
		return fromaddr;
	}

	/**
	 * 获得邮件的收件人，抄送，和密送的地址和姓名，根据所传递的参数的不同 "to"----收件人 "cc"---抄送人地址 "bcc"---密送人地址
	 */
	public String getMailAddress(String type) throws Exception {
		String mailaddr = "";
		String addtype = type.toUpperCase();
		InternetAddress[] address = null;
		if (addtype.equals("TO") || addtype.equals("CC")
				|| addtype.equals("BCC")) {
			if (addtype.equals("TO")) {
				address = (InternetAddress[]) mimeMessage
						.getRecipients(Message.RecipientType.TO);
			} else if (addtype.equals("CC")) {
				address = (InternetAddress[]) mimeMessage
						.getRecipients(Message.RecipientType.CC);
			} else {
				address = (InternetAddress[]) mimeMessage
						.getRecipients(Message.RecipientType.BCC);
			}
			if (address != null && address.length > 0) {
				for (int i = 0; i < address.length; i++) {
					String email = address[i].getAddress();
					if (email == null)
						email = "";
					else {
						email = MimeUtility.decodeText(email);
					}
					String personal = address[i].getPersonal();
					if (personal == null)
						//personal = "";
						personal = email;
					else {
						personal = MimeUtility.decodeText(personal);
					}
					String compositeto = personal + namePreSign + email + nameEndSign;
					mailaddr += "," + compositeto;
				}
				mailaddr = mailaddr.substring(1);
			}
		} else {
			throw new Exception("Error emailaddr type!");
		}
		return mailaddr;
	}

	/**
	 * 获得邮件主题
	 */
	public String getSubject() throws MessagingException {
		String subject = "";
		try {
			subject = MimeUtility.decodeText(mimeMessage.getSubject());
			if (subject == null)
				subject = "";
		} catch (Exception exce) {
		}
		return subject;
	}

	/**
	 * 获得邮件发送日期
	 */
	public String getSentDate2String() throws Exception {
		Date sentdate = mimeMessage.getSentDate();
		SimpleDateFormat format = new SimpleDateFormat(dateformat);
		return format.format(sentdate);
	}
	
	public Date getSentDate() throws Exception {
		Date sentdate = mimeMessage.getSentDate();
		return sentdate;
	}

	/**
	 * 获得邮件正文内容
	 */
	public String getBodyText() {
		return bodytext;
	}

	public InputStream getBodyStream() {
		return inputStream;
	}

	/**
	 * 解析邮件，把得到的邮件内容保存到一个StringBuffer对象中，解析邮件 主要是根据MimeType类型的不同执行不同的操作，一步一步的解析
	 */
	public void getMailContent(Part part) throws Exception {
		String contenttype = part.getContentType();
		int nameindex = contenttype.indexOf("name");
		boolean conname = false;
		if (nameindex != -1)
			conname = true;
		if (part.isMimeType("text/plain") && !conname) {
			// FIXME charset='IBM-eucCN' 暂时先不显示正文
			if (!part.getContentType().contains("IBM-eucCN")) {
				bodytext = (String) part.getContent();
			}
			inputStream = part.getInputStream();
		} else if (part.isMimeType("text/html") && !conname) {
			bodytext = (String) part.getContent();
			inputStream = part.getInputStream();
		} else if (part.isMimeType("multipart/*")) {
			Multipart multipart = (Multipart) part.getContent();
			int counts = multipart.getCount();
			for (int i = 0; i < counts; i++) {
				getMailContent(multipart.getBodyPart(i));
			}
		} else if (part.isMimeType("message/rfc822")) {
			getMailContent((Part) part.getContent());
		}
	}

	/**
	 * 判断此邮件是否需要回执，如果需要回执返回"true",否则返回"false"
	 */
	public boolean getReplySign() throws MessagingException {
		boolean replysign = false;
		String needreply[] = mimeMessage
				.getHeader("Disposition-Notification-To");
		if (needreply != null) {
			replysign = true;
		}
		return replysign;
	}

	/**
	 * 获得此邮件的Message-ID
	 */
	public String getMessageId() throws MessagingException {
		return mimeMessage.getMessageID();
	}

	/**
	 * 【判断此邮件是否已读，如果未读返回返回 false,反之返回true】
	 */
	public boolean isNew() throws MessagingException {
		boolean isnew = false;
		Flags flags = ((Message) mimeMessage).getFlags();
		Flags.Flag[] flag = flags.getSystemFlags();
		for (int i = 0; i < flag.length; i++) {
			if (flag[i] == Flags.Flag.SEEN) {
				isnew = true;
				break;
			}
		}
		return isnew;
	}

	/**
	 * 将收件箱内的个人邮件都设置成已读
	 */
	public boolean setAllRead() throws MessagingException {
		((Message) mimeMessage).setFlag(Flags.Flag.SEEN, true); // 将指定id设置成已读
		return true;
	}

	/**
	 * 将指定id邮件设置成已读状态
	 */
	public boolean setReadById() throws MessagingException {
		((Message) mimeMessage).setFlag(Flags.Flag.SEEN, true);
		return true;
	}

	/**
	 * 根据messageId得到指定message对象
	 */
	public static Message getMessageById(Folder folder, String messageId)
			throws MessagingException {
		Message[] messageList = folder.getMessages();
		Message message = null;
		for (int i = 0; i < messageList.length; i++) {
			EmailReciver pmm = null;
			pmm = new EmailReciver((MimeMessage) messageList[i]);
			String messageIds = pmm.getMessageId();
			// 防止在其它的邮件客户端中致使messageid为null （如163）
			if (messageIds == null) {
				continue;
			}
			if (messageIds.endsWith(messageId)) {
				message = messageList[i];
			}
		}
		return message;
	}

	/**
	 * 判断此邮件是否包含附件
	 */
	public boolean isContainAttach(Part part) throws Exception {
		boolean attachflag = false;
//		String contentType = part.getContentType();
		if (part.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) part.getContent();
			for (int i = 0; i < mp.getCount(); i++) {
				BodyPart mpart = mp.getBodyPart(i);
				String disposition = mpart.getDisposition();
				if ((disposition != null)
						&& ((disposition.equals(Part.ATTACHMENT)))) // 去除Part.INLINE||
																	// (disposition.equals(Part.INLINE))
					attachflag = true;
				else if (mpart.isMimeType("multipart/*")) {
					attachflag = isContainAttach((Part) mpart);
				} else {
					String contype = mpart.getContentType();
					if (contype.toLowerCase().indexOf("application") != -1)
						attachflag = true;
					if (contype.toLowerCase().indexOf("name") != -1)
						attachflag = true;
				}
			}
		} else if (part.isMimeType("message/rfc822")) {
			attachflag = isContainAttach((Part) part.getContent());
		}
		return attachflag;
	}

	/**
	 * 【保存附件】
	 */
	public void saveAttachMent(Part part) throws Exception {
		String fileName = "";
		if (part.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) part.getContent();
			for (int i = 0; i < mp.getCount(); i++) {
				BodyPart mpart = mp.getBodyPart(i);
				String disposition = mpart.getDisposition();
				if ((disposition != null)
						&& ((disposition.equals(Part.ATTACHMENT)) || (disposition
								.equals(Part.INLINE)))) {
					fileName = mpart.getFileName();
					if (fileName.toLowerCase().indexOf("gb2312") != -1) {
						fileName = MimeUtility.decodeText(fileName);
					}
					saveFile(fileName, mpart.getInputStream());
				} else if (mpart.isMimeType("multipart/*")) {
					saveAttachMent(mpart);
				} else {
					fileName = mpart.getFileName();
					if ((fileName != null)
							&& (fileName.toLowerCase().indexOf("gb2312") != -1)) {
						fileName = MimeUtility.decodeText(fileName);
						saveFile(fileName, mpart.getInputStream());
					}
				}
			}
		} else if (part.isMimeType("message/rfc822")) {
			saveAttachMent((Part) part.getContent());
		}
	}

	/**
	 * 【得到附件流】
	 * 
	 * @author wangxh2
	 * @param part
	 * @throws Exception
	 */
	public List<InputStream> getFileInputStream(Part part) throws Exception {
		int j = 0;
		String fileName = "";
		List<InputStream> inputStreamList = null;
		inputStreamList = new ArrayList<InputStream>();
		InputStream inputStream = null;
		if (part.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) part.getContent();
			for (int i = 0; i < mp.getCount(); i++) {
				BodyPart mpart = mp.getBodyPart(i);
				String disposition = mpart.getDisposition();
				if ((disposition != null)
						&& ((disposition.equals(Part.ATTACHMENT)) || (disposition
								.equals(Part.INLINE)))) {
					inputStream = mpart.getInputStream();
				} else if (mpart.isMimeType("multipart/*")) {
					getFileInputStream(mpart);
				} else {
					fileName = mpart.getFileName();
					if ((fileName != null)
							&& (fileName.toLowerCase().indexOf("gb2312") != -1)) {
						inputStream = mpart.getInputStream();
					}
				}

				if (inputStream != null) {
					inputStreamList.add(j++, inputStream);
				}

			}
		} else if (part.isMimeType("message/rfc822")) {
			getFileInputStream((Part) part.getContent());
		}
		return inputStreamList;
	}

	/**
	 * 【得到文件名】
	 * 
	 * @author wangxh2
	 * @param part
	 * @throws Exception
	 */
	public String getFileName(Part part) throws Exception {
		String fileName = "";
		String fileNames = "";
		if (part.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) part.getContent();
			for (int i = 0; i < mp.getCount(); i++) {
				BodyPart mpart = mp.getBodyPart(i);
				String disposition = mpart.getDisposition();
				if ((disposition != null)
						&& ((disposition.equals(Part.ATTACHMENT)) || (disposition
								.equals(Part.INLINE)))) {
					fileName = mpart.getFileName();
					if (fileName != null) {
						if (fileName.toLowerCase().indexOf("gb2312") != -1 || 
								fileName.toLowerCase().indexOf("gbk") != -1 ||
								fileName.toLowerCase().indexOf("gb18030") != -1){ // gb2312 gbk gb18030
							fileName = MimeUtility.decodeText(fileName);
						}
						fileNames += fileName + ",";
					}
				} else if (mpart.isMimeType("multipart/*")) {
					getFileName(mpart);
				} else {
					fileName = mpart.getFileName();
					if ((fileName != null)
							&& (fileName.toLowerCase().indexOf("gb2312") != -1)) {
						fileName = MimeUtility.decodeText(fileName);
					}
					if (fileName != null) {
						fileNames += fileName + ",";
					}
				}
			}
		} else if (part.isMimeType("message/rfc822")) {
			getFileName((Part) part.getContent());
		}
		return fileNames;
	}

	/**
	 * 【设置附件存放路径】
	 */

	public void setAttachPath(String attachpath) {
		this.saveAttachPath = attachpath;
	}

	/**
	 * 【设置日期显示格式】
	 */
	public void setDateFormat(String format) throws Exception {
		this.dateformat = format;
	}

	/**
	 * 【获得附件存放路径】
	 */
	public String getAttachPath() {
		return saveAttachPath;
	}

	/**
	 * 【真正的保存附件到指定目录里】
	 */
	private void saveFile(String fileName, InputStream in) throws Exception {
		String osName = System.getProperty("os.name");
		String storedir = getAttachPath();
		String separator = "";
		if (osName == null)
			osName = "";
		if (osName.toLowerCase().indexOf("win") != -1) {
			separator = "\\";
			if (storedir == null || storedir.equals(""))
				storedir = "c:\\tmp";
		} else {
			separator = "/";
			storedir = "/tmp";
		}
		File storefile = new File(storedir + separator + fileName);
		BufferedOutputStream bos = null;
		BufferedInputStream bis = null;
		try {
			bos = new BufferedOutputStream(new FileOutputStream(storefile));
			bis = new BufferedInputStream(in);
			int c;
			while ((c = bis.read()) != -1) {
				bos.write(c);
				bos.flush();
			}
		} catch (Exception exception) {
			exception.printStackTrace();
			throw new Exception("文件保存失败!");
		} finally {
			bos.close();
			bis.close();
		}
	}

	/**
	 * 删除指定邮件
	 */
	public boolean deleteMessageById() throws Exception {
		mimeMessage.setFlag(Flags.Flag.DELETED, true);
		return true;
	}
}
