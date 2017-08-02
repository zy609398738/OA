package com.bokesoft.services.messager.server.model;

import java.util.List;

public class HistoryMessagesData {
		private List<Message> messages;
		private long startTimestamp = 0;
		private long endTimestamp = 0;
		private int limits = 0;
		private boolean hasMore = false;
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
