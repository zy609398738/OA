package com.bokesoft.services.messager.android;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.activity.ConversationActivity;
import com.bokesoft.ecomm.im.android.event.StartConversationEvent;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.ecomm.im.android.activity.MainActivity;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.services.WebSocketService;
import com.bokesoft.ecomm.im.android.utils.UIUtils;

import de.greenrobot.event.EventBus;

/**
 * 用于将 Messager(包括界面) 集成到 Android 系统的 Facada 对象
 */
public class AndroidUIFacada {
    private Activity bindActivity;
    private boolean initialized = false;
    private SessionListener sessionListener;
    private ErrorListener errorListener;

    public AndroidUIFacada(Activity bindActivity){
        this.bindActivity = bindActivity;
    }

    /**
     * 判断当前是否已经完成 IM 初始化
     * @return
     */
    public boolean isReady() {
        return (null!=this.bindActivity && initialized);
    }

    /**
     * 初始化 IM 客户端环境
     * @param imServerBaseUrl IM 服务器的基本地址, 格式类似 "10.0.2.2:7778/boke-messager".
     * @param hostServerBaseUrl 主系统服务器的基本地址, 格式类似 "10.0.2.2:8080/im-service/${service}.action",
     *                             其中 "${service}" 用于代替具体的服务如 userinfo、buddies 等.
     * @param clientId 聊天用户的唯一 ID
     * @param token 聊天会话的 token, 此 token 一方面用于在 WebSocket 请求时供 IM 服务器进行身份识别, 同时也用于调用主服
     *               务器 userinfo、buddies 等服务时的身份识别.
     */
    public void init(String imServerBaseUrl, String hostServerBaseUrl, String clientId, String token){
        if (null==token){
            Toast.makeText(
                    this.bindActivity, "无法初始化 IM: 无效的 token", Toast.LENGTH_LONG).show();
            return;
        }

        ClientInstance.getInstance()
                .config(imServerBaseUrl, hostServerBaseUrl).init(token, clientId);

        WebSocketService.resetWebSocketService(this.bindActivity, null);

        if (! this.initialized){
            EventBus.getDefault().register(this);
            this.initialized = true;
        }
    }

    public void setSessionListener(SessionListener listener){
        this.sessionListener = listener;
    }

    public void setErrorListener(ErrorListener listener){
        this.errorListener = listener;
    }

    public void close(){
        EventBus.getDefault().unregister(this);
        this.initialized = false;
        this.bindActivity = null;
    }

    public void startMainActivity (){
        if (isReady()){
            Intent intent = new Intent(this.bindActivity, MainActivity.class);
            this.bindActivity.startActivity(intent);
        }else{
            UIUtils.alert(this.bindActivity, "BKIM API 错误", "未初始化的情况下无法启动 MainActivity.");
        }
    }

    public void openConversationActivity(String peerId){
        if (isReady()){
            EventBus.getDefault().post(new StartConversationEvent(peerId));
        }else{
            UIUtils.alert(this.bindActivity, "BKIM API 错误",
                    "未初始化的情况下无法启动 ConversationActivity.");
        }
    }

    public static interface SessionListener {
        public void perform(MyActiveConnectData connectedSessionsData, boolean inMainThread);
    }
    public static interface ErrorListener {
        public void onError(String errorMessage, Throwable exception, boolean inMainThread);
    }


    /**
     * 事件处理 - 开始聊天
     */
    public void onEventMainThread(StartConversationEvent event) {
        Intent intent = new Intent(this.bindActivity, ConversationActivity.class);
        intent.putExtra(BKIMConstants.PEER_ID, event.getPeerId());
        this.bindActivity.startActivity(intent);
    }

    /**
     * 事件处理 - WebSocket 事件
     * @param event
     */
    public void onEvent(WebSocketEvent event) {
        handleWebSocketEvent(event, false);
    }
    /**
     * 事件处理 - WebSocket 事件
     * @param event
     */
    public void onEventMainThread(WebSocketEvent event) {
        handleWebSocketEvent(event, true);
    }

    private void handleWebSocketEvent(WebSocketEvent event, boolean inMainThread){
        if (null!=this.errorListener && WebSocketEvent.TYPE_EXCEPTION == event.getType()){
            String msg = "WebSocket Error";
            Throwable ex = event.getException();
            this.errorListener.onError(msg, ex, inMainThread);
        }
        if (null!=this.sessionListener && WebSocketEvent.TYPE_MESSAGE == event.getType()){
            MyActiveConnectData sessionData = event.getMyActiveConnectData();
            if (null!=sessionData){
                this.sessionListener.perform(sessionData, inMainThread);
            }
        }
    }
}
