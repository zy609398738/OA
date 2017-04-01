package com.bokesoft.oa.mid.im;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
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
		// FIXME 此处未判断IM服务器返回值
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
