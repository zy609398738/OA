package com.bokesoft.services.messager.config;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.Starter;
import com.bokesoft.services.messager.server.BlackListServlet;
import com.bokesoft.services.messager.server.HostSessionServlet;
import com.bokesoft.services.messager.server.store.IMessageStore;
import com.bokesoft.services.messager.server.store.jsimpledb.BdbMessageStore;
import com.bokesoft.services.messager.zz.Misc;

/**
 * Messager 的运行时配置
 */
public class MessagerConfig {
	/** 系统配置中使用的 Java 系统变量的前缀 */
	public static final String SYS_PROP_PREFIX = Starter.class.getPackage().getName() + ".";
	
	/** 配置变量：定义服务器的 URL 上下文路径, 默认值为 "boke-messager" */
	public static final String VAR_CTX_PATH = "BK_IM_CTX_PATH";
	/** 配置变量：定义服务器的运行端口, 默认为 7778 */
	public static final String VAR_PORT = "BK_IM_PORT";
	/** 配置变量: 定义 FlashPolicyServer 的运行端口, 默认为 7843(Flash 默认访问端口为 843) */
	public static final String VAR_FPS_PORT = "BK_IM_FPS_PORT";
	/** 配置变量: 定义 {@link IMessageStore} 的实现类,  */
	public static final String VAR_STORE_CLASS = "BK_IM_STORE_CLASS";
	/** 配置变量: 定义数据的存储位置, 默认为临时目录下的 bokesoft-messager/data 目录 */
	public static final String VAR_DATA_PATH = "BK_IM_DATA_PATH";
	/** 配置变量: 定义系统是否处在 "开发模式", 开发模式 通过降低安全方面的控制以方便系统开发和测试 */
	public static final String VAR_DEV_MODE = "BK_IM_DEV_MODE";
	/** 配置变量: 定义哪些服务器可以访问 {@link BlackListServlet}、{@link HostSessionServlet} 等后台服务;
	 * json 数组格式, 默认值 ["127.0.0.1", "::1", "0:0:0:0:0:0:0:1"] */
	public static final String VAR_ALLOW_SERVER_IP = "BK_IM_ALLOW_SERVER_IP";
	
	public static String getContextPath(){
		String defCtx = "boke-messager";	//默认值
		
		String ctx = getConfigItem(VAR_CTX_PATH, defCtx);
		
		Misc.$assert(StringUtils.isBlank(ctx), "配置变量 '"+VAR_CTX_PATH+"' 不能为空");
		Misc.$assert("/".equals(ctx.trim()), "配置变量 '"+VAR_CTX_PATH+"' 不能为 '/'");
		
		return ctx.trim();
	}
	
	/**
	 * 获取服务器的运行端口
	 * @return
	 */
	public static int getPort(){
		int defPort = 7778;	//默认值
		
		int iPort = -1;
		String port = getConfigItem(VAR_PORT, Integer.toString(defPort));
		if (NumberUtils.isNumber(port)){
			iPort = NumberUtils.toInt(port);
		}
		if (iPort <=0){
			throw new RuntimeException("配置变量 '"+VAR_PORT+"'('"+port+"') 不是一个有效的数字");
		}
		return iPort;
	}
	
	/**
	 * 获取服务器的 FlashPolicyServer 运行端口
	 * @return
	 */
	public static int getFlashPolicyServerPort(){
		int defPort = 7843;	//默认值
		
		int iPort = -1;
		String port = getConfigItem(VAR_FPS_PORT, Integer.toString(defPort));
		if (NumberUtils.isNumber(port)){
			iPort = NumberUtils.toInt(port);
		}
		
		return iPort;
	}
	
	/**
	 * 获取系统使用的 {@link IMessageStore} 实例
	 * @return
	 */
	public static IMessageStore getMessageStoreInstance(){
		String className = getConfigItem(VAR_STORE_CLASS, BdbMessageStore.class.getName());
		try {
			IMessageStore ms = (IMessageStore)Class.forName(className).newInstance();
			return ms;
		} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			Misc.$throw(e);
			return null;	//Unreachable code
		}
	}
	
	/**
	 * 获取系统的数据目录
	 * @return
	 * @throws IOException
	 */
	public static String getDataPath() throws IOException{
		String defaultPath = 
				new File(new File(System.getProperty("java.io.tmpdir"), "bokesoft-messager"), "data").getCanonicalPath();
		String dataPath = getConfigItem(VAR_DATA_PATH, defaultPath);
		return dataPath;
	}
	
	/**
	 * 判断是否在 开发模式 下
	 * @return
	 */
	public static boolean isDevMode(){
		String devMode = getConfigItem(VAR_DEV_MODE, "false");
		devMode = devMode.trim();
		if (devMode.equalsIgnoreCase("true")||
				devMode.equalsIgnoreCase("T")||
					devMode.equalsIgnoreCase("yes")||
						devMode.equalsIgnoreCase("Y")){
			return true;
		}
		return false;
	}
	
	/**
	 * 获得所有允许访问后台 {@link BlackListServlet}、{@link HostSessionServlet} 等服务的 IP 地址列表
	 * @return
	 */
	public static Set<String> getAllowServerIPs(){
		String json = getConfigItem(VAR_ALLOW_SERVER_IP, "['127.0.0.1', '::1', '0:0:0:0:0:0:0:1']");
		List<String> ips = JSON.parseArray(json, String.class);
		return new HashSet<String>(ips);
	}
	
	/**
	 * 从系统中读取配置信息, 优先从 Java system properties 中读取, 其次从 系统环境变量 中读取
	 * @param key
	 * @param defaultValue
	 * @return
	 */
	private static String getConfigItem(String key, String defaultValue){
		String tmp = System.getProperty(SYS_PROP_PREFIX + key);
		if (null==tmp){
			tmp = System.getenv(key);
		}
		if (null==tmp){
			tmp = defaultValue;
		}
		return tmp;
	}
}
