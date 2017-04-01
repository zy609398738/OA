package com.bokesoft.services.messager.server.context;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.flash.FlashPolicyServer;
import com.bokesoft.services.messager.server.ws.MessageTimerTask;

public class ContextListener implements ServletContextListener {

	private FlashPolicyServer fps;

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		int port = MessagerConfig.getFlashPolicyServerPort();
		if (port >= 0){
			fps = new FlashPolicyServer(port);
		}else{
			fps = new FlashPolicyServer();
		}
		fps.start();
		
		MessageTimerTask.start();
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		if (null!=fps){
			fps.stop();
		}
	}

}
