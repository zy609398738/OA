package com.bokesoft.ecomm.im.android.event;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;

public class WebSocketEvent {
    public static final int TYPE_OPEN = 1;
    public static final int TYPE_CLOSE = 2;
    public static final int TYPE_MESSAGE = 10;
    public static final int TYPE_EXCEPTION = 90;

    private int type;
    private String message;
    private Exception exception;

    public static WebSocketEvent buildOpenEvent(){
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_OPEN;
        return e;
    }
    public static WebSocketEvent buildCloseEvent(){
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_CLOSE;
        return e;
    }
    public static WebSocketEvent buildMessageEvent(String msg){
        WebSocketEvent e = new WebSocketEvent();
        e.type = TYPE_MESSAGE;
        e.message = msg;
        return e;
    }
    public static WebSocketEvent buildErrorEvent(Exception ex){
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

    public MyActiveConnectData getMyActiveConnectData(){
        if (null==message){
            return null;
        }
        JSONObject msgObj = JSON.parseObject(message);
        if ( null!=msgObj.get("attachments") ){
            JSONArray atts = ((JSONArray)msgObj.get("attachments"));
            if (null!=atts){
                for (int i=0; i<atts.size(); i++) {
                    JSONObject att = atts.getJSONObject(i);
                    if ("MyActiveConnectData".equals(att.get("dataType"))){
                        MyActiveConnectData data =
                                JSON.parseObject(att.toJSONString(), MyActiveConnectData.class);
                        return data;
                    }
                }
            }
        }

        return null;
    }
}
