package com.bokesoft.services.messager;

import java.net.URL;
import java.util.Map;

import org.apache.log4j.Logger;
import org.bizobj.jetty.ContextStarter;
import org.bizobj.jetty.cfg.Configer;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.zz.Misc;

import jodd.http.HttpRequest;

public class Starter {
	private static Logger log = Logger.getLogger(Starter.class);
	
	public static void main(String[] args) throws Exception {
		run();
		
		//注册 JVM Shutdown hook
		Runtime.getRuntime().addShutdownHook(new Thread(){
			@Override
			public void run() {
				log.info(Starter.class.getPackage().getName() + " exist successfully.");
			}
		});
	}

	public static void run() throws Exception{
		URL warUrl = Starter.class.getResource("/war/index.jsp");
		ContextStarter.startServer(warUrl, new Configer() {
			@Override
			public Map<String, String> getJdbcUrls() {
				return null;	//No jndi datasource needed
			}
			@Override
			public int getHttpPort() {
				return MessagerConfig.getPort();
			}
			@Override
			public String getContextPath() {
				return MessagerConfig.getContextPath();
			}
		});
	}
	
	public static void run(Runnable callback) throws InterruptedException{
		Thread t = new Thread(new Runnable(){
			@Override
			public void run() {
				try {
					Starter.run();
				} catch (Exception e) {
					Misc.$throw(e);
				}
			}
		}, Starter.class.getName());

		t.start();
		
		boolean startOk = false;
		String baseUrl = "http://localhost:"+MessagerConfig.getPort()+"/"+MessagerConfig.getContextPath()+"/index.jsp";
		long startTime = System.currentTimeMillis();
		while(System.currentTimeMillis()-startTime < 120*1000/*等待服务器启动, 超时时间 120 秒*/){
			try {
				HttpRequest.get(baseUrl).timeout(1000).send();		//通过访问 index.jsp 来确认服务器是否正常启动
				startOk = true;
				break;
			} catch (Exception e) {
				log.info("Waiting Messager Server started ...");
				Thread.sleep(1000);
			}
		}
		if (startOk){
			callback.run();
		}else{
			log.error("Fail to start Messager Server.");
		}

	}
}
