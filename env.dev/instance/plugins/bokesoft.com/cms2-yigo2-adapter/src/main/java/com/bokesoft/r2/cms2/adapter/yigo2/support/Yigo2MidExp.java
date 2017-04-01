package com.bokesoft.r2.cms2.adapter.yigo2.support;

import javax.servlet.http.Cookie;


import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;
import com.bokesoft.yes.mid.session.ISessionInfo;

import jodd.servlet.ServletUtil;

/**
 * 一些有用的 Yigo 2.0 中间层公式
 */
public class Yigo2MidExp {
	
	/**
	 * 在 CMS 环境的下的 Yigo 2.0 登录
	 * @param user
	 * @param password
	 * @return
	 * @throws Throwable
	 */
	public static String Login(String user, String password) throws Throwable{
		String clientId = Yigo2Helper.cmsYigoLogin(CmsRequestContext.getThreadInstance(), user, password);
		return clientId;
	}
	
	/**
	 * 在 CMS 环境的下的 Yigo 2.0 登出
	 * @throws Throwable
	 */
	public static void Logout() throws Throwable{
		Yigo2Helper.cmsYigoLogout(CmsRequestContext.getThreadInstance());
	}
	
	/**
	 * 在 CMS 环境的下的 Yigo 2.0单点 登录
	 * @param user
	 * @param password
	 * @return
	 * @throws Throwable
	 */
	public static String SSOLogin(String user) throws Throwable{
		String clientId = Yigo2Helper.cmsYigoSSOLogin(CmsRequestContext.getThreadInstance(), user);
		return clientId;
	}
	
	/**
	 * 在 CMS 环境的下的 Yigo 2.0单点 登录
	 * @param user
	 * @return
	 * @throws Throwable
	 */
	public static String Login(String user) throws Throwable{
		String clientId = Yigo2Helper.cmsYigoSSOLogin(CmsRequestContext.getThreadInstance(), user);
		return clientId;
	}
	
	/**
	 * 在 CMS 环境下检查 Yigo 2.0 登录用户的 ID
	 * @return
	 */
	public static long GetLoginOperator(){
		CmsRequestContext ctx = CmsRequestContext.getThreadInstance();
		Misc.$assert(null==ctx, "无效的 CMS 上下文环境");
		
		Cookie cookie = ServletUtil.getCookie(ctx.getRequest(), Yigo2Helper.YIGO2_CLIENT_ID);
		if (null!=cookie){
			String clientId = cookie.getValue();
			ISessionInfo ses = Yigo2Helper.getLoginSession(clientId);
			if (null==ses){
				return -1;
			}else{
				return ses.getOperatorID();
			}
		}else{
			return -1;
		}
	}

}
