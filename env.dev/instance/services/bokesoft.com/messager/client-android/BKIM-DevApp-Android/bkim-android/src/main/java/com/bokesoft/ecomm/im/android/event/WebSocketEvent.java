package com.bokesoft.ecomm.im.android.event;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.services.messager.server.model.RecentHistory;
import com.bokesoft.services.messager.server.model.base.AttachmentBase;

import java.util.HashMap;
import java.util.Map;

public class WebSocketEvent {
    public static final int TYPE_OPEN = 1;
    public static final int TYPE_CLOSE = 2;
    public static final int TYPE_MESSAGE = 10;
    public static final int TYPE_EXCEPTION = 90;

    private int type;
    public static String message;
    private Exception exception;

    /** 使用 attachment type 为 Key 缓存消息中的 attachment */
    private Map<String, AttachmentBase> attachmentsCache = new HashMap<String, AttachmentBase>();

    public static WebSocketEvent buildOpenEvent() {
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_OPEN;
        return e;
    }

    public static WebSocketEvent buildCloseEvent() {
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_CLOSE;
        return e;
    }

    public static WebSocketEvent buildMessageEvent(String msg) {
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_MESSAGE;
        e.message = msg;
        return e;
    }

    public static WebSocketEvent buildErrorEvent(Exception ex) {
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_EXCEPTION;
        e.exception = ex;
        return e;
    }

    public String getMessage() {
        return message;
    }

    public int getType() {
        return type;
    }

    public Exception getException() {
        return exception;
    }

    public MyActiveConnectData getMyActiveConnectData() {
        return getAttachmentObject("MyActiveConnectData", MyActiveConnectData.class);
    }
    public RecentHistory getRecentHistory() {
        return getAttachmentObject("RecentHistory", RecentHistory.class);
    }
    private <T extends AttachmentBase> T getAttachmentObject(String attachmentDataType, Class<T> clazz) {
        AttachmentBase tmp = attachmentsCache.get(attachmentDataType);
        if (null!=tmp){
            return (T)tmp;
        }

        if (null == message) {
            return null;
        }
        JSONObject msgObj = JSON.parseObject(message);
        if (null != msgObj.get("attachments")) {
            JSONArray attachments = ((JSONArray) msgObj.get("attachments"));
            if (null != attachments) {
                for (int i = 0; i < attachments.size(); i++) {
                    JSONObject json = attachments.getJSONObject(i);
                    if (attachmentDataType.equals(json.get("dataType"))) {
                        T result = JSON.parseObject(json.toJSONString(), clazz);
                        if (null!=result){
                            attachmentsCache.put(attachmentDataType, result);
                        }
                        return result;
                    }
                }
            }
        }
        return null;
    }

}
