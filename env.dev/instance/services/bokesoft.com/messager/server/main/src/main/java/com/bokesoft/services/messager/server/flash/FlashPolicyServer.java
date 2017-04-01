package com.bokesoft.services.messager.server.flash;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;

import org.apache.log4j.Logger;

/**
 * from: http://www.open-open.com/lib/view/open1344582731249.html
 * ref : http://www.adobe.com/devnet/flashplayer/articles/socket_policy_files.html
 */
public class FlashPolicyServer {
    private static Logger logger = Logger.getLogger(FlashPolicyServer.class);

    private ServerSocket serverSocket;

    private static Thread serverThread;

    private int port;

    private static boolean listening = true;

    public FlashPolicyServer() {
        this(843);
    }

    public FlashPolicyServer(int port) {
        this.port = port;
    }

    public void start() {
    	logger.info("FlashPolicyServer: Starting Up at port ["+this.port+"]...");
        try {
            serverThread = new Thread(new Runnable() {
                public void run() {
                    try {
                        logger.info("FlashPolicyServer: Starting...");
                        serverSocket = new ServerSocket(port);

                        while (listening) {
                            final Socket socket = serverSocket.accept();

                            Thread t = new Thread(new Runnable() {
                                public void run() {
                                    try {

                                        if (logger.isDebugEnabled()) {
                                            logger.debug("FlashPolicyServer: Handling Request...");
                                        }

                                        socket.setSoTimeout(10000);
                                        InputStream in = socket.getInputStream();
                                        byte[] buffer = new byte[23];

                                        if (in.read(buffer) != -1 && (new String(buffer, "ISO-8859-1")).startsWith("<policy-file-request/>")) {
                                            if (logger.isDebugEnabled()) {
                                                logger.debug("FlashPolicyServer: Serving Policy File...");
                                            }

                                            OutputStream out = socket.getOutputStream();
                                            byte[] bytes = ("<?xml version=\"1.0\"?>\n" +
                                                    "<!DOCTYPE cross-domain-policy SYSTEM \"/xml/dtds/cross-domain-policy.dtd\">\n" +
                                                    "<cross-domain-policy> \n" +
                                                    "   <site-control permitted-cross-domain-policies=\"master-only\"/>\n" +
                                                    "   <allow-access-from domain=\"*\" to-ports=\"*\" />\n" +
                                                    "</cross-domain-policy>").getBytes("ISO-8859-1");

                                            out.write(bytes);
                                            out.write(0x00);
                                            out.flush();
                                            out.close();
                                        } else {
                                            logger.warn("FlashPolicyServer: Ignoring Invalid Request");
                                            logger.warn("  " + (new String(buffer)));
                                        }

                                    } catch (SocketException e) {
                                        logger.error(e.getMessage(), e);
                                    } catch (IOException e) {
                                        logger.error(e.getMessage(), e);
                                    } finally {
                                        try {
                                            socket.close();
                                        } catch (Exception ex) {
                                        	//Do nothing
                                        }
                                    }
                                }
                            });
                            t.start();
                        }
                    } catch (IOException ex) {
                        logger.error("FlashPolicyServer Error---");
                        logger.error(ex.getMessage(), ex);
                    }
                }

            });
            serverThread.start();
        } catch (Exception ex) {
            logger.error("FlashPolicyServer Error---");
            logger.error(ex.getMessage(), ex);
        }
    }

    public void stop() {
        logger.info("FlashPolicyServer: Shutting Down...");

        if (listening) {
            listening = false;
        }

        if (!serverSocket.isClosed()) {
            try {
                serverSocket.close();
            } catch (Exception ex) {
            	//Do nothing
            }
        }
    }
}