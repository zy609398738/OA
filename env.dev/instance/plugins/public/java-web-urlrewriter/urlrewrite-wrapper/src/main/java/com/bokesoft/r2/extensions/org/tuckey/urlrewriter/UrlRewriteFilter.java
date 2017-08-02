package com.bokesoft.r2.extensions.org.tuckey.urlrewriter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;

import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.tuckey.web.filters.urlrewrite.Conf;

/**
 * 为 {@link org.tuckey.web.filters.urlrewrite.UrlRewriteFilter} 增加基于环境变量(以及 Java System Property)的配置方式;<br/>
 * 配置优先级 Java System Property > 环境变量 > web.xml 中的 Filter 定义;<br/>
 * <br/>
 * 配置方式：
 * <ul>
 *   <li>Java System Property：使用当前 class 全路径作为前缀.<br/>
 *       例如 <code>com.bokesoft.r2.extensions.org.tuckey.urlrewriter.UrlRewriteFilter.confPath</code> 用于覆写 web.xml 中的 "confPath" </li>
 *   <li>环境变量：使用 <code>YIGOREDIST_TUCKEY_URLWRITER_</code>前缀.<br/>
 *       例如 <code>YIGOREDIST_TUCKEY_URLWRITER_confPath</code> 用于覆写 web.xml 中的 "confPath" </li>
 * </ul>
 * 
 * @see http://cdn.rawgit.com/paultuckey/urlrewritefilter/master/src/doc/manual/4.0/index.html#filterparams
 */
public class UrlRewriteFilter extends org.tuckey.web.filters.urlrewrite.UrlRewriteFilter {
	private static final String ENV_VAR_PREFIX = "YIGOREDIST_TUCKEY_URLWRITER_";
	private static final String PROP_VAR_PREFIX = UrlRewriteFilter.class.getName()+".";

	@Override
	public void init(final FilterConfig filterConfig) throws ServletException {
		FilterConfig wrapped = new FilterConfig(){
			@Override
			public String getFilterName() {
				return filterConfig.getFilterName();
			}

			@Override
			public String getInitParameter(String name) {
				String tmp = getInitParameterByEnv(name);
				if (null!=tmp){
					return tmp;
				}else{
					return filterConfig.getInitParameter(name);
				}
			}

			@Override
			public Enumeration<String> getInitParameterNames() {
				return filterConfig.getInitParameterNames();
			}

			@Override
			public ServletContext getServletContext() {
				return filterConfig.getServletContext();
			}
		};
		super.init(wrapped);
	}

	private static final String getInitParameterByEnv(String name){
		String tmp = System.getProperty(PROP_VAR_PREFIX+name);
		if (StringUtils.isNotBlank(tmp)){
			return tmp;
		}
		
		tmp = System.getenv(ENV_VAR_PREFIX+name);
		if (StringUtils.isNotBlank(tmp)){
			return tmp;
		}
		
		return null;
	}
	
	/**
	 * 重写 {@link org.tuckey.web.filters.urlrewrite.UrlRewriteFilter#loadUrlRewriter(FilterConfig)}
	 * 以支持通过文件路径加载 rewrite 规则
	 */
	protected void loadUrlRewriter(FilterConfig filterConfig) throws ServletException {
		String confPath = filterConfig.getInitParameter("confPath");
		ServletContext context = filterConfig.getServletContext();
		
		//FIXME: 由于 org.tuckey.web.filters.urlrewrite.UrlRewriteFilter 封装方面支持的问题, 这一段只能复制其初始化代码
		boolean modRewriteStyleConf = false;
        String modRewriteConf = filterConfig.getInitParameter("modRewriteConf");
        if (!StringUtils.isBlank(modRewriteConf)) {
            modRewriteStyleConf = "true".equals(StringUtils.trim(modRewriteConf).toLowerCase());
        }

        try{
            File confFile = new File(confPath);
            InputStream inputStream = new FileInputStream(confFile);
            
            Conf conf = new Conf(context, inputStream, confPath, confFile.toURI().toURL().toString(), modRewriteStyleConf);
            checkConf(conf);
        }catch(IOException ioe){
        	throw new ServletException(ioe);
        }
    }
}
