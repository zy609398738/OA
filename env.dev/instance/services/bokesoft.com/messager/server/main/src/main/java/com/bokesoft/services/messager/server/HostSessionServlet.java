package com.bokesoft.services.messager.server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.server.impl.HostSessionManager;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;
import com.bokesoft.services.messager.server.model.RpcReturnCode;
import com.bokesoft.services.messager.zz.Misc;

public class HostSessionServlet extends HttpServlet {

	private static final long serialVersionUID = 2016091216L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		throw new UnsupportedOperationException();
	}
	
	/**
	 * 登入与登出状态更新
	 * 请求参数格式：
	 *   登入: {token: XXXX, userCode: XXXX, option: login}
	 *   登出: {token: XXXX, option: logout}
	 * 返回数据格式：
	 *   {success: 1}, 其他格式均认为错误.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		ServletUtils.serverAccessControlCheck(req);
		
		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		Misc.$assert(null==dataJson, "请求中没有 JSON 数据");

		String token = dataJson.get("token").toString();
		String option = dataJson.get("option").toString();
		
		if(option.equals("login")){
			String userCode = dataJson.get("userCode").toString();
			HostSessionManager.rememberToken(token, userCode);
		}else if(option.equals("logout")){
			HostSessionManager.removeToken(token);
		}
		
		ServletUtils.returnAsJson(resp, RpcReturnCode.success());
	}
	
}
