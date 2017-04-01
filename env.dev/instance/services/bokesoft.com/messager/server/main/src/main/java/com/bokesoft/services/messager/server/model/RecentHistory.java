package com.bokesoft.services.messager.server.model;

import java.util.List;

import com.bokesoft.services.messager.server.model.base.AttachmentBase;

public class RecentHistory extends AttachmentBase{

	private List<Message> messages;

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> recentMsgs) {
		this.messages = recentMsgs;
	}
		
}
