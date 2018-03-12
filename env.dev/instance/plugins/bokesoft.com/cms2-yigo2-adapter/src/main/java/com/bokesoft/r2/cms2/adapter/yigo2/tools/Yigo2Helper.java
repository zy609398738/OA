package com.bokesoft.r2.cms2.adapter.yigo2.tools;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;

import org.apache.commons.lang.time.DateFormatUtils;
import org.json.JSONObject;

import com.bokesoft.cms2.adapter.BackendWorker;
import com.bokesoft.cms2.adapter.exception.BackendException;
import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.r2.cms2.adapter.yigo2.Yigo2BackendWorker;
import com.bokesoft.yes.mid.auth.AuthenticatorFactory;
import com.bokesoft.yes.mid.auth.IAuthenticator;
import com.bokesoft.yes.mid.session.DefaultSessionCheck;
import com.bokesoft.yes.mid.session.ISessionInfo;
import com.bokesoft.yes.mid.session.ISessionInfoMap;
import com.bokesoft.yes.mid.session.ISessionInfoProvider;
import com.bokesoft.yes.mid.session.SessionInfoProviderHolder;
import com.bokesoft.yigo.mid.auth.Login;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.base.IServiceContext;
import com.bokesoft.yigo.mid.base.LoginInfo;
import com.bokesoft.yigo.mid.util.ContextBuilder;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;

/**
 * 一些工具方法
 */
public class Yigo2Helper {

	/**
	 * Yigo 2.0 中特定的 cookie 名字, 用于在 客户端 和 中间层 之间传递登录用户对应的 clientID
	 */
	public static final String YIGO2_CLIENT_ID = "clientID";
	public static final String YIGO2_USER_NAME = "userName";
	public static final String YIGO2_LOGIN_TIME = "login_time";
	public static final String YIGO2_OLD_URL = "oldURL";
	
	/**
	 * 从 CMS 上下文中获取 Yigo2 的上下文
	 * @param ctx
	 * @return
	 * @throws BackendException
	 */
	public static final DefaultContext getYigo2Context(CmsRequestContext ctx) throws BackendException{
        BackendWorker worker = ctx.getBackend();
        
    	Misc.$assert(null==worker, "Unsuppored BackendWorker type: null");
    	Misc.$assert(!(worker instanceof Yigo2BackendWorker), "Unsuppored BackendWorker type: "+worker.getClass().getName());

        Yigo2BackendWorker yigo2Backend = (Yigo2BackendWorker)worker;
        DefaultContext yigo2Ctx = yigo2Backend.getYigo2Ctx();

        return yigo2Ctx;
	}

	/**
	 * 将 {@link DataTable} 转换为 List[Map], 每个 Map 对应其中一行, Map 的 Key 调整为大写
	 * @param dt
	 * @return
	 */
	public static final List<Map<String, Object>> wrapDataTable(DataTable dt){
		DataTableMetaData md = dt.getMetaData();
		int colCount = md.getColumnCount();
		List<String> colNames = new ArrayList<String>();
		for(int i=0; i<colCount; i++){
			colNames.add(md.getColumnInfo(i).getColumnKey());
		}

		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		dt.beforeFirst();
		while(dt.next()){
			Map<String, Object> line = new HashMap<String, Object>();
			for(String col: colNames){
				Object val = dt.getObject(col);
				//放到模型里面的字段名都使用大写
				line.put(col.toUpperCase(), val);
			}
			result.add(line);
		}

		return result;
	}
	
	/**
	 * 执行 Yigo2 的用户登录验证, 返回 clientID 的值
	 * @param ctx
	 * @param user
	 * @param password 密码是明文
	 * @return
	 * @throws Throwable 
	 */
	public static final String yigoLogin(DefaultContext ctx, String user, String password) throws Throwable{
		if (null==password){
			password = "";
		}		
		JSONObject jsonObject = doYigoLogin(ctx, user, password);
		String clientId = jsonObject.getString("clientID");
		return clientId;
	}

	private static JSONObject doYigoLogin(DefaultContext ctx, String user, String password) throws Throwable {
		String clientId = UUID.randomUUID().toString();
		ctx.getEnv().setClientID(clientId);
		
		@SuppressWarnings("unchecked")
		IAuthenticator<IServiceContext> authenticator =
				(IAuthenticator<IServiceContext>) AuthenticatorFactory.getInstance().newAuthenticator(ctx);
		//user 用户名; passpwrd 密码(已加密); role = -1 为不指定角色登录; mode 1 是 PC登录, 2 是 手机登录;
		JSONObject jsonObject = authenticator.login(ctx, new LoginInfo(user, password, -1, 1, "", null));
		setDefaultContextEnv(ctx, jsonObject);
		return jsonObject;
	}
	
	/**
	 * 执行 Yigo2 的用户登出功能
	 * @param ctx
	 * @throws Throwable
	 */
	public static final void yigoLogout(DefaultContext ctx, String clientId) throws Throwable{
		ctx.getEnv().setClientID(clientId);
		
		@SuppressWarnings("unchecked")
		IAuthenticator<IServiceContext> authenticator =
				(IAuthenticator<IServiceContext>) AuthenticatorFactory.getInstance().newAuthenticator(ctx);
		authenticator.logout(ctx);
	}
	
	/**
	 * 执行 Yigo2 的用户单点登录验证, 返回 clientID 的值
	 * @param ctx
	 * @param user
	 * @return
	 * @throws Throwable 
	 */
	public static final String yigoSSOLogin(DefaultContext ctx, String user) throws Throwable{
		JSONObject jsonObject = doYigoSSOLogin(ctx, user);
		String clientId = jsonObject.getString("clientID");
		return clientId;
	}

	private static JSONObject doYigoSSOLogin(DefaultContext ctx, String user) throws Throwable {
		String clientId = UUID.randomUUID().toString();
		ctx.getEnv().setClientID(clientId);
		
		LoginInfo loginInfo = new LoginInfo(user, "", -1, 1, "", null);
		SSOLogin ssoLogin = new SSOLogin(loginInfo);
		JSONObject jsonObject = ssoLogin.doLogin(ctx);
		setDefaultContextEnv(ctx, jsonObject);
		return jsonObject;
	}

	private static void setDefaultContextEnv(DefaultContext ctx, JSONObject jsonObject) {
		long userID = jsonObject.getLong("UserID");
		ctx.getEnv().setUserID(userID);
		String userName = jsonObject.getString("Name");
		ctx.getEnv().setUserName(userName);
		long logTime = jsonObject.getLong("Time");
		String timeStr =  DateFormatUtils.format(new Date(logTime), "yyyy/MM/dd HH:mm:ss");
		ctx.getEnv().setTime(timeStr);
	}
	
	
	/**
	 * 在 CMS 的环境下执行 Yigo2 的用户登录验证, 登录成功后设置用户的 clientID 到 客户端 cookie 中
	 * @param cmsCtx
	 * @param user
	 * @param password 密码是明文
	 * @return
	 * @throws Throwable
	 */
	public static final String cmsYigoLogin(CmsRequestContext cmsCtx, String user, String password) throws Throwable{
		DefaultContext ctx = getYigo2Context(cmsCtx);
		JSONObject jsonObject = doYigoLogin(ctx, user,password);
		String clientId = jsonObject.getString("clientID");
		setWebCookie(cmsCtx, jsonObject);
		return clientId;
	}

	private static void setWebCookie(CmsRequestContext cmsCtx, JSONObject jsonObject) throws UnsupportedEncodingException {
		String clientId = jsonObject.getString("clientID");
		String userName = jsonObject.getString("Name");
		long logTime = jsonObject.getLong("Time");
		SimpleDateFormat df=new SimpleDateFormat("yy/MM/dd HH:mm:ss"); 
		String timeStr = df.format(new Date(logTime));
		
		String url = cmsCtx.getRequest().getRequestURL().toString();
		Cookie cClientID = new Cookie(YIGO2_CLIENT_ID, clientId);
		Cookie cUserName = new Cookie(YIGO2_USER_NAME, URLEncoder.encode(userName, "utf-8"));
		Cookie cLoginTime = new Cookie(YIGO2_LOGIN_TIME, timeStr);
		Cookie cOldUrl = new Cookie(YIGO2_OLD_URL, url);
		cClientID.setPath("/");
		cClientID.setMaxAge(Integer.MAX_VALUE);
		cUserName.setPath("/");
		cUserName.setMaxAge(Integer.MAX_VALUE);
		cLoginTime.setPath("/");
		cLoginTime.setMaxAge(Integer.MAX_VALUE);
		cOldUrl.setPath("/");
		cOldUrl.setMaxAge(Integer.MAX_VALUE);
		cmsCtx.getResponse().addCookie(cClientID);
		cmsCtx.getResponse().addCookie(cUserName);
		cmsCtx.getResponse().addCookie(cLoginTime);
		cmsCtx.getResponse().addCookie(cOldUrl);
	}
	
	/**
	 * 在 CMS 的环境下执行 Yigo2 的用户登出
	 * @param cmsCtx
	 * @throws Throwable
	 */
	public static final boolean cmsYigoLogout(CmsRequestContext cmsCtx) throws Throwable{
		Cookie[] cookies = cmsCtx.getRequest().getCookies();
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals(YIGO2_CLIENT_ID)) {
				DefaultContext ctx = getYigo2Context(cmsCtx);
				yigoLogout(ctx, cookies[i].getValue());
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 在 CMS 的环境下执行 Yigo2 的用户登单点录验证, 登录成功后设置用户的 clientID 到 客户端 cookie 中
	 * @param cmsCtx
	 * @param user
	 * @return
	 * @throws Throwable
	 */
	public static final String cmsYigoSSOLogin(CmsRequestContext cmsCtx, String user) throws Throwable{
		DefaultContext ctx = getYigo2Context(cmsCtx);
		JSONObject jsonObject = doYigoSSOLogin(ctx, user);
		String clientId = jsonObject.getString("clientID");
		setWebCookie(cmsCtx, jsonObject);
		
		return clientId;
	}
	
	/**
	 * 检查是否已经在 Yigo 2.0 中登录了
	 * @param ctx
	 * @return
	 */
	public static boolean isYigoLogin(DefaultContext ctx){
		try{
			DefaultSessionCheck chk = new DefaultSessionCheck();
			chk.check(ctx.getVE(), ctx.getEnv());
			return true;
		}catch(Throwable ex){
			return false;
		}
	}
	
	/**
	 * 检查是否已经在 Yigo 2.0 中登录了
	 * @param clientID
	 * @return
	 */
	public static boolean isYigoLogin(String clientID){
		try{
			DefaultContext ctx = ContextBuilder.create();
			ctx.getEnv().setClientID(clientID);
			ctx.getEnv().setMode(Yigo2BackendWorker.LOGIN_MODE_PC);	//1-电脑
			
			DefaultSessionCheck chk = new DefaultSessionCheck();
			chk.check(ctx.getVE(), ctx.getEnv());
			return true;
		}catch(Throwable ex){
			return false;
		}
	}
	
	/**
	 * 通过 clientID 获得登录会话信息
	 * @param clientID
	 * @return
	 */
	public static ISessionInfo getLoginSession(String clientID){
		ISessionInfoProvider p =
				SessionInfoProviderHolder.getProvider(Yigo2BackendWorker.LOGIN_MODE_PC);	//Mode 1=PC 登录
		
		ISessionInfoMap sim = p.getSessionInfoMap();
		ISessionInfo session = sim.get(clientID);
		
		return session;
	}
	
	public static class SSOLogin extends Login{

		public SSOLogin(LoginInfo logInfo) {
			super(logInfo);
		}
		
		protected void passwordCheck(DefaultContext context){
			//DO NOTHING
			//不作密码校验
		}
	}
}
