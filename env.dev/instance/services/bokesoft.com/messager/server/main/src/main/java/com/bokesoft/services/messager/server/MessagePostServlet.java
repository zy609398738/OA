package com.bokesoft.services.messager.server;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.RpcReturnCode;
import com.bokesoft.services.messager.server.store.IMessageStore;

public class MessagePostServlet extends HttpServlet{

	private static final long serialVersionUID = 1457895808501514162L;
	
	/**
	 * 消息推送接口
	 * 请求参数格式：
	 * {type:XXX,timestamp:XXX,sender:XXX,receiver:XXX,senderName:XXX,receiverName:XXX,data:XXX}
	 * 返回数据格式：
	 * {success: 1}, 其他格式均认为错误.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ServletUtils.serverAccessControlCheck(req);
		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		String type = dataJson.get("type").toString();
		Long timestamp = Long.parseLong(dataJson.get("timestamp").toString());
		String sender = dataJson.get("sender").toString();
		String receiver = dataJson.get("receiver").toString();
		String senderName = dataJson.get("senderName").toString();
		String receiverName = dataJson.get("receiverName").toString();
		Object data = dataJson.get("data");
		Message message = new Message(type, sender, receiver, timestamp);
		message.setSenderName(senderName);
		message.setReceiverName(receiverName);
		message.setData(data);
		IMessageStore ms = MessagerConfig.getMessageStoreInstance();
		ms.save(message);
		ServletUtils.returnAsJson(resp, RpcReturnCode.success());
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {	
		throw new UnsupportedOperationException();
	}

}
