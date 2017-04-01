package com.bokesoft.services.messager.server;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.bokesoft.services.messager.server.ws.MessagerSocket;

public class MessagerServlet extends WebSocketServlet {
	private static final long serialVersionUID = 20160806L;

	@Override
	public void configure(WebSocketServletFactory factory) {
        factory.getPolicy().setIdleTimeout(120*1000);// set 2 minutes timeout

		factory.register(MessagerSocket.class);
	}

}
