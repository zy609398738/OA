package com.bokesoft.services.messager.server;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.server.impl.BlackListManager;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;
import com.bokesoft.services.messager.server.model.RpcReturnCode;
import com.bokesoft.services.messager.zz.Misc;

public class BlackListServlet extends HttpServlet {

	private static final long serialVersionUID = 2016091316L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		throw new UnsupportedOperationException();
	}
	
	/**
	 * 更新黑名单
	 * 请求参数格式：
	 * {
	 * 	overwrite: true/false,//代表是否全部覆盖, 在修改某个会员的黑名单后可以使用 overwrite=false 使 IM 只更新当前会员的黑名单而不是全部清除;
	 * 	blacklist: {
	 * 		userCode1: [blocked-user-code1, blocked-user-code2, blocked-user-code3, ...],
	 * 		userCode2: [....],
	 *		...
	 * 	}
	 * }
	 * 返回数据格式：
	 * {success: 1}, 其他格式均认为错误.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		ServletUtils.serverAccessControlCheck(req);
		
		JSONObject dataJson = ServletUtils.getParamDataAsJson(req);
		Misc.$assert(null==dataJson, "请求中没有 JSON 数据");

		Boolean overwrite = (Boolean) dataJson.get("overwrite");
		
		Map<String, Set<String>> _blacklist = new HashMap<String, Set<String>>();
		JSONObject blacklist = dataJson.getJSONObject("blacklist");
		for (String userCode: blacklist.keySet()){
			Set<String> _blockedUsers = new HashSet<String>();
			_blacklist.put(userCode, _blockedUsers);
			
			JSONArray blockedUsers = blacklist.getJSONArray(userCode);
			for (Object blockedUser: blockedUsers){
				if (null!=blockedUser){
					_blockedUsers.add(blockedUser.toString());
				}
			}
		}
		
		if(overwrite){
			BlackListManager.reset();
		}
		BlackListManager.update(_blacklist);
		
		ServletUtils.returnAsJson(resp, RpcReturnCode.success());
	}
	
}
