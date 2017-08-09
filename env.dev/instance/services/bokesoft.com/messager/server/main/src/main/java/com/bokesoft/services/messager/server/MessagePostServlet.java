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
import com.bokesoft.services.messager.zz.Misc;

public class MessagePostServlet extends HttpServlet{

	private static final long serialVersionUID = 1457895808501514162L;
	
	/**
	 * 消息推送接口
	 * 请求参数格式：
	 *   {type:XXXX, timestamp:XXXX, sender:XXXX, receiver:XXXX, senderName:XXXX, receiverName:XXXX, data:XXXX}
	 * 返回数据格式：
	 *   {success: 1}, 其他格式均认为错误.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ServletUtils.serverAccessControlCheck(req);
		
		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		Misc.$assert(null==dataJson, "请求中没有 JSON 数据");

		String type = dataJson.getString("type");
		Long timestamp = dataJson.getLong("timestamp");
		String sender = dataJson.getString("sender");
		String receiver = dataJson.getString("receiver");
		String senderName = dataJson.getString("senderName");
		String receiverName = dataJson.getString("receiverName");
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
