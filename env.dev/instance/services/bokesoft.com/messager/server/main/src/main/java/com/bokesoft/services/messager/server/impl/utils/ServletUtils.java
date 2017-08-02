package com.bokesoft.services.messager.server.impl.utils;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.HostSessionManager;

public class ServletUtils {
	
	/**
	 * 从 request 中取到 "t" 参数并验证（目前只检查非空性）
	 * @param req
	 * @return
	 */
	public static void checkAccessToken(HttpServletRequest req){
		String token = req.getParameter("t");
		String clientId = HostSessionManager.getUserCodeByToken(token);
		if(StringUtils.isBlank(clientId)){
			throw new RuntimeException("当前 token '"+token+"' 无效或已过期");
		}
	}
	
	/**
	 * 从 request 中取到 "data" 参数并解析为 json
	 * @param req
	 * @return
	 */
	public static JSONObject getParamDataAsJson(HttpServletRequest req){
		String data = req.getParameter("data");
		JSONObject dataJson = JSON.parseObject(data);
		
		return dataJson;
	}

	/**
	 * 将对象以 json 格式返回到 HTTP 客户端
	 * @param resp
	 * @param o
	 * @throws IOException 
	 */
	public static void returnAsJson(HttpServletResponse resp, Object o) throws IOException{
		String json = JSON.toJSONString(o);
		resp.setCharacterEncoding("UTF-8");
		resp.setContentType("text/plain;charset=UTF-8");
		resp.getWriter().println(json);
	}
	
	/**
	 * 用于服务器端调用的服务请求时的访问控制检查
	 * @param req
	 */
	public static void serverAccessControlCheck(HttpServletRequest req){
		if (MessagerConfig.isDevMode()){
			return;		//开发模式不作任何限制
		}
		
		String clientIP = req.getRemoteAddr();	//注意: 此处得到的可能是代理服务器的地址
		Set<String> allowIPs = MessagerConfig.getAllowServerIPs();
		if (allowIPs.contains(clientIP)){
			return;
		}
		
		throw new RuntimeException("Unauthorized Access");
	}
}
