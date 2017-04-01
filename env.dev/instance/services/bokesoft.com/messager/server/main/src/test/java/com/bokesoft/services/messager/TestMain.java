package com.bokesoft.services.messager;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.eclipse.jetty.websocket.client.WebSocketClient;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.impl.TestClientSocket;

public class TestMain {
	private static Logger log = Logger.getLogger(TestMain.class);

	public static void main(String[] args) throws Exception {
		Starter.run(new Runnable(){
			@Override
			public void run() {
				log.info("Begin testing ...");
				try {
					doTest();
				} catch (Exception e) {
					log.error(e.getMessage(), e);
				}
				log.info("Test completed, system exit.");
				System.exit(0);
			}
		});
	}
	
	private static void doTest() throws Exception {
		String destUri = "ws://localhost:"+MessagerConfig.getPort()+"/"+MessagerConfig.getContextPath()+"/messager/user/0001";
        
        WebSocketClient client = new WebSocketClient();
        TestClientSocket socket = new TestClientSocket();
        try{
            client.start();

            URI echoUri = new URI(destUri);
            ClientUpgradeRequest request = new ClientUpgradeRequest();
            client.connect(socket, echoUri, request);
            System.out.printf("Connecting to : %s%n",echoUri);
            client.connect(socket, echoUri, request);
            System.out.printf("Connecting to : %s%n",echoUri);

            // wait for closed socket connection.
            socket.awaitClose(5, TimeUnit.SECONDS);
        }catch (Throwable t){
            log.error(t.getMessage(), t);
        }finally{
            try{
                client.stop();
            }catch (Exception e){
                log.error(e.getMessage(), e);
            }
        }
	}
}
