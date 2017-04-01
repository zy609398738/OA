package com.bokesoft.ecomm.im.android.model;

import com.bokesoft.services.messager.server.model.Message;

/**
 * 用于缓存在本地的消息, 在信息 接收/发送 时存入本地缓存
 */
public class LocalMessage {
    /** 消息发送方(userCode), 此处认为消息都是与 "当前会话用户" 相关的, 所以, 通过 sender 是属于自己还是对方可以区分是接收的消息还是发送的消息 */
    private String sender;
    /** 消息类型, 见 {@link Message} */
    private String type;
    /** 消息内容 */
    private Object data;
    /** 消息的时间戳 */
    private long timestamp = System.currentTimeMillis();

    public String getSender() {
        return sender;
    }
    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public Object getData() {
        return data;
    }
    public void setData(Object data) {
        this.data = data;
    }

    public long getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
