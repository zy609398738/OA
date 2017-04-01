package com.bokesoft.oa.mid.email;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

public class EmailUtil {
	public static String namePreSign = "<";
	public static String nameEndSign = ">";
	/**
	 * 功能：删除指定路径中的文件
	 * 
	 * @param delpath
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public static boolean deletefile(String deletepath)
			throws FileNotFoundException, IOException {
		try {
			File file = new File(deletepath);
			if (!file.isDirectory()) {
				file.delete();
			} else if (file.isDirectory()) {
				String[] filelist = file.list();
				for (int i = 0; i < filelist.length; i++) {
					String separator = File.separator;
					String filePath = new StringBuilder(deletepath)
							.append(separator).append(filelist[i]).toString();
					File delfile = new File(filePath);
					if (!delfile.isDirectory()) {
						delfile.delete();
					} else if (delfile.isDirectory()) {
						deletefile(filePath);
					}
				}
				file.delete();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	/**
	 * 根据名称得到邮箱的用户名 
	 * ex: 王绪豪<x_hwang@163.com>解析后得到 x_hwang@163.com
	 * @param userNames名称
	 * @return 邮箱地址
	 */
	public static String analyName(String mailNames) {
		StringBuffer mailAddressList = new StringBuffer();
		if (mailNames.indexOf(",") != -1) {
			String[] mailNameList = mailNames.split(",");
			for (String mailName : mailNameList) {
				if (mailName.indexOf(namePreSign) != -1 && mailName.indexOf(nameEndSign) != -1) {
					String mailAddress = mailName.substring(
							mailName.indexOf(namePreSign) + 1, mailName.indexOf(nameEndSign));
					mailAddressList.append(mailAddress).append(",");
				} else {
					mailAddressList.append(mailName).append(",");
				}
			}
			return mailAddressList.substring(0, mailAddressList.length() - 1)
					.toString();
		} else {
			if (mailNames.indexOf(namePreSign) != -1 && mailNames.indexOf(nameEndSign) != -1) {
				String mailAddress = mailNames.substring(
						mailNames.indexOf(namePreSign) + 1, mailNames.indexOf(nameEndSign));
				mailAddressList.append(mailAddress);
			} else {
				mailAddressList.append(mailNames);
			}
			return mailAddressList.toString();
		}
	}
	
}
