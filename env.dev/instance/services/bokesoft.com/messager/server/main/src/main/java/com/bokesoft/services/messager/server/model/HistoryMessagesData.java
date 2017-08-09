package com.bokesoft.services.messager.server.model;

import java.util.List;

/**
 * 历史消息查询结果对象，包含为了方便前端显示需要的多个时间对象和标识:<br>
 * <pre>
 * [Now] ... .............. | .............. | -------------- | .............. ... [long long ago ...]
 *                          ^                ^                ^
 *                          |           startTimestamp     endTimestamp
 *             prevPageTimestamp    
 * </pre>
 */
public class HistoryMessagesData {
	/** 符合查询条件的消息列表，按照时间从大到小排序，即历史消息总是按照时间逆序返回的 */
	private List<Message> messages;
	
	/** 所有查到消息中的开始时间，由于消息是按照时间逆序排列的，因此这个时间实际上是查询结果中"最晚"那条消息的时间 */
	private long startTimestamp = 0;
	/** 所有查到消息中的结束时间，由于消息是按照时间逆序排列的，因此这个时间实际上是查询结果中"最早"那条消息的时间 */
	private long endTimestamp = 0;
	/** 每次查询返回消息的条数限制 */
	private int limits = 0;
	
	/**
	 * 按照本次查询的条件是否还存在更多数据, 为 false 是说明没有下一页消息;
	 * 注意：这个属性仅能用于表示是否存在"更早"的数据,
	 * 对于是否存在"更晚"的数据，请参考 {@link HistoryMessagesData#prevPageTimestamp}
	 */
	private boolean hasMore = false;
	
	/** 上一页消息的开始时间({@link #startTimestamp}), 等于 0 代表没有上一页消息 */
	private long prevPageTimestamp = 0;

	public List<Message> getMessages() {
		return messages;
	}
	public long getStartTimestamp() {
		return startTimestamp;
	}
	public long getEndTimestamp() {
		return endTimestamp;
	}
	public int getLimits() {
		return limits;
	}
	public boolean isHasMore() {
		return hasMore;
	}
	public long getPrevPageTimestamp() {
		return prevPageTimestamp;
	}
	
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	public void setStartTimestamp(long startTimestamp) {
		this.startTimestamp = startTimestamp;
	}
	public void setEndTimestamp(long endTimestamp) {
		this.endTimestamp = endTimestamp;
	}
	public void setLimits(int limits) {
		this.limits = limits;
	}
	public void setHasMore(boolean hasMore) {
		this.hasMore = hasMore;
	}
	public void setPrevPageTimestamp(long prevPageTimestamp) {
		this.prevPageTimestamp = prevPageTimestamp;
	}
}
