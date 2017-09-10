package com.bokesoft.oa.mid.message.extand;

import com.bokesoft.oa.mid.im.WebSession;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.oa.mid.message.MessageTypeBase;
import com.bokesoft.yigo.mid.base.DefaultContext;

public class IM extends MessageTypeBase {

	@Override
	public Object sendMessage(Message message) throws Throwable {
		DefaultContext context = getContext().getContext();
		Long oid = message.getSrcOid();
		String actionData = "opt," + message.getSrcBillKey() + "," + oid;
		String content = "[[Action:V01:{\"title\":\"" + message.getContent() + "\", \"actionData\":\"" + actionData
				+ "\", \"_id\":\"" + oid + "\"}:" + oid + "]]";
		message.setContent(content);
		WebSession.postIMServerMessagePost(context, "TEXT", message);
		return null;
	}
}
