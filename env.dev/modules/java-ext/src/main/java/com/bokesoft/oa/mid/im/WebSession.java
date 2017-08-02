package com.bokesoft.oa.mid.im;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.oa.mid.message.Message;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IServiceProcess;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.env.Env;

import jodd.http.HttpRequest;
import jodd.http.HttpResponse;

/**
 * IM的Web会话<br/>
 * 实现com.bokesoft.yigo.mid.service.IServiceProcess接口，用于登录后的回调函数
 * 
 * @author minjian
 *
 */
public class WebSession implements IServiceProcess<DefaultContext> {
	@Override
	public void process(DefaultContext context) throws Throwable {
		try {
			Env env = context.getEnv();
			String clientID = env.getClientID();
			Long id = env.getUserID();
			String sql = "select code from SYS_Operator where oid=?";
			DataTable dt = context.getDBManager().execPrepareQuery(sql, id);
			String userCode = dt.getString("code");
			postIMServerAddToken(clientID, userCode);
		} catch (Throwable t) {
			// 输出错误信息，暂时不向外抛出错误，防止系统无法登陆。
			t.printStackTrace();
		}
	}

	/**
	 * 向IM推送身份标记
	 * 
	 * @param sessionID
	 *            会话ID
	 * @param userCode
	 *            用户代码
	 */
	public static void postIMServerAddToken(String sessionID, String userCode) {
		try {
			String imServerAddress = System.getenv("IM_SERVER_ADDR");
			JSONObject json = new JSONObject();
			json.put("token", sessionID);
			json.put("userCode", userCode);
			json.put("option", "login");
			HttpResponse resp = HttpRequest.post(imServerAddress + "/session/open").charset("UTF-8").timeout(10 * 1000)
					.form("data", JSON.toJSONString(json)).send();
			resp.charset("UTF-8");
			if (resp.statusCode() != 200 && resp.statusCode() != 304) {
				throw new RuntimeException("IM Server HTTP 请求错误: " + resp.toString());
			}
		} catch (Throwable t) {
			// 输出错误信息，暂时不向外抛出错误，防止系统无法登陆。
			t.printStackTrace();
		}
	}

	/**
	 * 向IM推送身份标记
	 * 
	 * @param sessionID
	 *            会话ID
	 * @param userCode
	 *            用户代码
	 * @throws Throwable
	 */
	public static void postIMServerMessagePost(DefaultContext context, String type, Message message) throws Throwable {
		String sql = "select code from SYS_Operator where oid = ?";
		String sql2 = "select code from SYS_Operator where oid in ("
				+ TypeConvertor.toString(message.getReceiveIDs().getIds()) + ")";
		DataTable dt = context.getDBManager().execPrepareQuery(sql, message.getSendOptID());
		DataTable dt2 = context.getDBManager().execPrepareQuery(sql2);
		String sender = dt.getString("code");
		dt2.beforeFirst();
		while (dt2.next()) {
			String receiver = dt2.getString("code");
			sendIMMessage(type, message, sender, receiver);
		}
	}

	private static void sendIMMessage(String type, Message message, String sender, String receiver) {
		String imServerAddress = System.getenv("IM_SERVER_ADDR");
		JSONObject json = new JSONObject();
		json.put("type", type);
		json.put("sender", sender);
		json.put("receiver", receiver);
		json.put("timestamp", message.getSendDate());
		json.put("senderName", "");
		json.put("receiverName", "");
		json.put("data", message.getTopic() + " " + message.getContent());

		HttpResponse resp = HttpRequest.post(imServerAddress + "/messagePost/open").charset("UTF-8").timeout(10 * 1000)
				.form("data", JSON.toJSONString(json)).send();

		resp.charset("UTF-8");
		if (resp.statusCode() != 200 && resp.statusCode() != 304) {
			throw new RuntimeException("IM Server HTTP 请求错误: " + resp.toString());
		}
	}

	/**
	 * 从IM移除身份标记
	 * 
	 * @param sessionID
	 *            会话ID
	 */
	public static void postIMServerRemoveToken(String sessionID) {
		String imServerAddress = System.getenv("IM_SERVER_ADDR");
		JSONObject json = new JSONObject();
		json.put("token", sessionID);
		json.put("option", "logout");
		HttpRequest.post(imServerAddress + "/session/close").charset("UTF-8").timeout(10 * 1000)
				.form("data", JSON.toJSONString(json)).send();
	}
}
