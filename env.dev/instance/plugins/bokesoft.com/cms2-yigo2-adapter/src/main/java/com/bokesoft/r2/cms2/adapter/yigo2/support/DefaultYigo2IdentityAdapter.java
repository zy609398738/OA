package com.bokesoft.r2.cms2.adapter.yigo2.support;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.extension.acl.IdentityAdapter;
import com.bokesoft.cms2.web.support.WebUtils;
import com.bokesoft.r2.cms2.adapter.yigo2.Yigo2BackendWorker;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;

import jodd.servlet.ServletUtil;

/**
 * 默认用于 Yigo 2.0 集成的 {@link IdentityAdapter}, 基于以下原则：1.所有 action/page 都要进行适配; 2.依据 Yigo2 来判断用户是否登录.
 */
public class DefaultYigo2IdentityAdapter implements IdentityAdapter {

	@Override
	public boolean needAdapt(HttpServletRequest req, HttpServletResponse resp) {
		try {
			String url = WebUtils.extractModelUrl(req);
			if (url.startsWith("/a/") || url.startsWith("/p/") ||
					url.endsWith(".action") || url.endsWith(".page")){
				//所有 action/page 都要进行适配
				return true;
			}else{
				return false;
			}
		} catch (UnsupportedEncodingException e) {
			Misc.throwRuntime(e);
			return false;  //unreachable code
		}
	}

	@Override
	public void doAdapt(HttpServletRequest req, HttpServletResponse resp) {
		Cookie cookie = ServletUtil.getCookie(req, Yigo2Helper.YIGO2_CLIENT_ID);
		if (null!=cookie){
			String clientId = cookie.getValue();
			req.setAttribute(Yigo2BackendWorker.CLIENT_ID_IN_REQUEST, clientId);
		}else{
			req.removeAttribute(Yigo2BackendWorker.CLIENT_ID_IN_REQUEST);
		}
	}

	@Override
	public boolean isLogin(HttpServletRequest req, HttpServletResponse resp) {
		Cookie cookie = ServletUtil.getCookie(req, Yigo2Helper.YIGO2_CLIENT_ID);
		if (null!=cookie){
			String clientId = cookie.getValue();
			return Yigo2Helper.isYigoLogin(clientId);
		}else{
			return false;
		}
	}

}
