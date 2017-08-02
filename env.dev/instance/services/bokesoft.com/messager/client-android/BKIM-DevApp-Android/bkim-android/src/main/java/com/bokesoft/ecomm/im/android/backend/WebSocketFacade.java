package com.bokesoft.ecomm.im.android.backend;

import com.alibaba.fastjson.JSON;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.ReceivedMessage;

import org.java_websocket.WebSocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft_17;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import de.greenrobot.event.EventBus;

/**
 * WebSocket Service to IM Server
 */
public class WebSocketFacade {
    private static WebSocketFacade instance = new WebSocketFacade();
    public static WebSocketFacade getInstance(){
        return instance;
    }

    private WebSocketClient wsClient;
    /** 用于定期执行 "ping" 的 Timer */
    private Timer pingTimer;
    /** 在 {@link #prepareWebSocketClient(boolean)} 期间, 暂时没有发出去的消息 */
    private List<String> pendingMessages = new ArrayList<>();

    private synchronized WebSocketClient prepareWebSocketClient(boolean reuse){
        if ( (reuse) && (null!=wsClient)
                && (wsClient.getReadyState()==WebSocket.READYSTATE.OPEN
                    ||wsClient.getReadyState()==WebSocket.READYSTATE.CONNECTING) ){
            return wsClient;
        }

        if (null!=wsClient){
            try{ wsClient.close(); }catch(Exception ex){ /*Ignore it*/}
            wsClient = null;
        }

        ClientInstance inst = ClientInstance.getInstance();
        String toClientId = inst.getToClientId();
        if (null==toClientId || toClientId.trim().length()<=0){
            toClientId = inst.getClientId();    //Self to self 连接
        }
        String wsUrl = inst.getWebSocketBaseUrl()+"/"+inst.getClientToken()+"/"+inst.getClientId()+"/to/"+toClientId;
        URI wsUri = null;
        try {
            wsUri = new URI(wsUrl);
        } catch (URISyntaxException e) {
            LogUtils.e("URISyntaxException: "+wsUrl);
            LogUtils.logException(e);
        }

        wsClient = new WebSocketClient(wsUri, new Draft_17()){
            @Override
            public synchronized void onOpen(ServerHandshake data) {
                LogUtils.i(data.toString());
                EventBus.getDefault().post(WebSocketEvent.buildOpenEvent());
                //处理 pendingMessages
                for (String s: pendingMessages){
                    this.send(s);
                }
                pendingMessages.clear();
            }
            @Override
            public void onMessage(String message) {
                EventBus.getDefault().post(WebSocketEvent.buildMessageEvent(message));
            }
            @Override
            public void onClose(int code, String reason, boolean remote) {
                LogUtils.i("WebSocket close: code="+code+", reason="+reason+", remote="+remote);
                EventBus.getDefault().post(WebSocketEvent.buildCloseEvent());
            }
            @Override
            public void onError(Exception ex) {
                LogUtils.logException(ex);
                EventBus.getDefault().post(WebSocketEvent.buildErrorEvent(ex));
            }
        };
        wsClient.connect();

        return wsClient;
    }

    public synchronized void sendMessage(ReceivedMessage msg){
        String json = JSON.toJSONString(msg);
        WebSocketClient wsc = prepareWebSocketClient(true);
        if (wsc.getReadyState()== WebSocket.READYSTATE.OPEN){
            wsc.send(json);
        }else{
            if (! Message.MSG_TYPE_BLANK.equals(msg.getType())){
                //BLANK 消息在 WebSocket 连接没有 READY 的状态下可能被丢弃
                pendingMessages.add(json);
            }
        }
    }

    public synchronized void startNewConnect(){
        pendingMessages.clear();
        prepareWebSocketClient(false);

        //Ping timer
        if (null!=pingTimer){
            pingTimer.cancel();
            pingTimer = null;
        }
        pingTimer = new Timer(WebSocketFacade.class.getName(), true);
        pingTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                performPing();
            }
        }, 200L, 5*60*1000L);
    }

    public void performPing() {
        ReceivedMessage ping = new ReceivedMessage();
        ping.setType(Message.MSG_TYPE_BLANK);
        ping.setData("");
        sendMessage(ping);
    }
}
