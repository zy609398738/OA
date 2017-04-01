package com.bokesoft.yigo2.redist.yigo1_6_adapter.system;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.bokesoft.yes.mid.servlet.ServiceDispatch;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;

/**
 * 由于 Yigo2 后台上下文中无法直接拿到 {@link HttpServletRequest} 和 {@link HttpServletResponse},
 * 所以使用一个 Filter 记录并通过 {@link ThreadLocal} 的方式供 Yigo 1.6 代码使用。
 * <br/>
 * FIXME: {@link ServiceDispatch} 目前在 Yigo2 的 web.xml 的 servlet name 就是 “servlet”，此名字很有可能被改变
 */
@WebFilter(servletNames = {"servlet"}, filterName="RememberReqRespFilter")
public class RememberReqRespFilter implements Filter {
	private static final Logger log = Logger.getLogger(RememberReqRespFilter.class);
	
	private static ThreadLocal<ServletRequest> localRequest = new ThreadLocal<ServletRequest>();
	private static ThreadLocal<ServletResponse> localResponse = new ThreadLocal<ServletResponse>();

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		localRequest.set(req);
		localResponse.set(resp);
		
		try{
			chain.doFilter(req, resp);
		}finally{
			localRequest.remove();
			localResponse.remove();
		}
	}

	@Override
	public void init(FilterConfig cfg) throws ServletException {
		//Do nothing
	}
	@Override
	public void destroy() {
		//Do nothing
	}

	private static String checkMockUrl() {
		//找不到 request, 通常发生在使用 Yigo 2.0 设计器来访问 1.6 功能的情况下
		String mockUrl = System.getenv("DESIGNER_MOCK_URL");
		Misc.$assert(StringUtils.isBlank(mockUrl),
				"错误的执行环境 - Yigo 2.0 集成 1.6 的运行配置错误，或者 Yigo 2.0 设计器运行环境配置错误");
		
		log.warn("虚拟的 HTTP 请求 URL 为: " + mockUrl);
		
		return mockUrl;
	}
	
	public static HttpServletRequest getMockRequest() {
		try{
			String mockUrl = checkMockUrl();
			
			URL u = new URL(mockUrl);
			MockHttpServletRequest mreq = new MockHttpServletRequest();
			String protocol = u.getProtocol();
			mreq.setScheme(protocol);
			mreq.setServerName(u.getHost());
			mreq.setContextPath(u.getPath());
			int port = u.getPort();
			if (port <=0){
				//默认值
				if ("HTTP".equalsIgnoreCase(protocol)){
					port = 80;
				}else if ("HTTPS".equalsIgnoreCase(protocol)){
					port = 443;
				}else{
					throw new MalformedURLException("无效的 url ['"+u+"'] - 目前只支持 HTTP 和 HTTPS");
				}
			}
			mreq.setServerPort(port);
			return mreq;
		}catch(Exception ex){
			Misc.throwRuntime(ex);
			return null;	//Unreachable code
		}
	}

	public static final HttpServletRequest request(){
		HttpServletRequest req = (HttpServletRequest)localRequest.get();
		if (null==req){
			log.warn("本次调用将使用虚拟的 HttpServletRequest 对象 ...");
			req = getMockRequest();
		}
		return req;
	}

	public static final HttpServletResponse response(){
		HttpServletResponse resp = (HttpServletResponse) localResponse.get();
		if (null==resp){
			checkMockUrl();
			log.warn("本次调用将使用虚拟的 HttpServletResponse 对象 ...");
			resp = new MockHttpServletResponse();
		}
		return resp;
	}
}
