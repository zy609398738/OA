package com.bokesoft.services.messager.server;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.server.impl.UserStateManager;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;
import com.bokesoft.services.messager.server.impl.utils.SessionUtils;
import com.bokesoft.services.messager.server.model.RpcReturnCode;

public class StateServlet extends HttpServlet {

	private static final long serialVersionUID = 2016091201L;

	/**
	 * 设置用户状态:<br/>
	 *  - 请求参数格式：<code>{userCode1: state1, userCode2: state2, ...}</code> ;<br/>
	 *  - 返回数据格式：<code>{success: 1}</code>, 其他格式均认为错误; <br/>
	 * 另外也支持按照 {@link #doGet(HttpServletRequest, HttpServletResponse)} 的数据格式查询用户状态。
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		ServletUtils.checkAccessToken(req);

		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		if (null==dataJson){
			//如果传递的不是 json 格式的 "data" 参数，那么当作 "获取用户状态" 处理
			processGetStatus(req, resp);
			return;
		}
		
		for (String userCode : dataJson.keySet()){
			UserStateManager.setState(userCode, dataJson.get(userCode).toString());
			//计算当前用户连接会“影响其他哪些用户的 MyActiveConnectData 状态”
			SessionUtils.markNotifyClientPeerIds(userCode);
		}
		
		ServletUtils.returnAsJson(resp, RpcReturnCode.success());
	}	
	
	/**
	 * 获取用户状态: <br/>
	 *  - 请求参数格式：<code>/state?u=u001&u=u002&u=u003...</code>, 支持 jQuery ajax 使用数组数据的 <code>u[]</code> 参数名;<br/>
	 *  - 返回数据格式：<code>{userCode1: state1, userCode2: state2, ...}</code>
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {	
		ServletUtils.checkAccessToken(req);
		processGetStatus(req, resp);
	}

	private void processGetStatus(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String[] userCodes = req.getParameterValues("u");
		if (null==userCodes){
			userCodes = req.getParameterValues("u[]");	//这里适合通过 jQuery ajax 传递过来的数组数据
		}

		Map<String, Object> result = new HashMap<String, Object>();
		if(userCodes!=null){
			for(int i=0;i<userCodes.length;i++){
				String userCode = userCodes[i];
				if(StringUtils.isNotBlank(userCode)){
					String state = UserStateManager.queryStateByUserCode(userCode);
					result.put(userCode, state);
				}
			}
		}
		ServletUtils.returnAsJson(resp, result);
	}
	
}
