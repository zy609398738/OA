package com.bokesoft.services.messager.server.store;

import java.util.List;

import com.bokesoft.services.messager.server.model.Message;

public interface IMessageStore {
	/**
	 * 保存一条消息
	 * @param message
	 */
	public void save(Message message);

	/**
	 * 查找未读消息(<b>注意</b>: 不保证时间先后顺序)
	 * @param receiver 消息接收方, 为空代表不需要按照接收者过滤
	 * @return
	 */
	public List<Message> findNewMessage(String receiver);
	
	/**
	 * 查找历史消息(<b>注意</b>: 不保证时间先后顺序)
	 * @param sender 消息发送方, 为空时不作为过滤条件
	 * @param receiver 消息接收方, 为空时不作为过滤条件
	 * @param fromTime 消息时间范围, 为空时不作为过滤条件
	 * @param toTime 消息时间范围, 为空时不作为过滤条件
	 * @param limits 最多记录条数(如果为负数, 说明是符合条件的时间最晚的记录), 为空时不限制
	 *         (<b>注意</b>: 为了正确实现 limits, 查找历史时需要按照消息先后进行排序)
	 * @param keywords 内容搜索关键字, 为空时不作为过滤条件
	 * @return
	 */
	public List<Message> findHistory(String sender, String receiver, Long fromTime, Long toTime, Integer limits, String keywords);
}
