package com.bokesoft.oa.mid.email;

import java.util.HashMap;

/**
 * 
 * @author wangxh2
 *
 */
public class EmailManager {
	/**
	 * 存储operatorId 的Email对象
	 */
	private final static HashMap<Long, EmailDTO> EMAIL_MAP = new HashMap<Long, EmailDTO>();

	/**
	 * 得到用户设置的邮件对象
	 */
	public static EmailDTO getEmailConfigByOperator(Long operatorId) {
		EmailDTO emailDTO = EMAIL_MAP.get(operatorId);
		if (emailDTO == null) {
			throw new Error("不存在用户的邮件配置，请先设置。");
		}
		return emailDTO;
	}

	/**
	 * 设置用户的邮件对象
	 */
	public static void setEmailConfigByOperator(EmailDTO emailDTO, Long operatorId) {
		EMAIL_MAP.put(operatorId, emailDTO);
	}

	/**
	 * 删除该用户设置的邮件对象
	 */
	public static void deleteEmailConfigByOperator(Long operatorId) {
		EMAIL_MAP.remove(operatorId);
	}

	/**
	 * 判断该用户是否设置过邮件对象
	 */
	public static boolean isHasConfigByOperator(Long operatorId) {
		boolean b = EMAIL_MAP.containsKey(operatorId);
		return b;
	}

	/**
	 * 得到用户指定的属性
	 */
	public static Object getEmailByOperator(Long operatorId, String key) {
		EmailDTO emailDTO = EMAIL_MAP.get(operatorId);
		HashMap<String, String> emailConfig = emailDTO.getEmailConfig();
		return emailConfig.get(key);
	}
}
