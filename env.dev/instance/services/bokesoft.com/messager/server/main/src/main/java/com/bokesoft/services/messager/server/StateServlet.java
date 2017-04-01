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
import com.bokesoft.services.messager.server.model.RpcReturnCode;

public class StateServlet extends HttpServlet {

	private static final long serialVersionUID = 2016091201L;

	/**
	 * 设置用户状态
	 * 请求参数格式：
	 * {userCode1: state1, userCode2: state2, ...}
	 * 返回数据格式：
	 * {success: 1}, 其他格式均认为错误.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		for (String userCode : dataJson.keySet()){
			UserStateManager.setState(userCode, dataJson.get(userCode).toString());
		}
		
		ServletUtils.returnAsJson(resp, RpcReturnCode.success());
	}	
	
	/**
	 * 获取用户状态
	 * 请求参数格式：
	 * /state?u=u001&u=u002&u=u003...
	 * 返回数据格式：
	 * {userCode1: state1, userCode2: state2, ...}
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {		
		String[] userCodes = req.getParameterValues("u");	
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
