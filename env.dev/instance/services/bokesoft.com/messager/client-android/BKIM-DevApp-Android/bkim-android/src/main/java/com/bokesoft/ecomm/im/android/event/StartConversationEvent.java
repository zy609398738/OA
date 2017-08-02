package com.bokesoft.ecomm.im.android.event;

/**
 * 开始一个会话的事件
 */
public class StartConversationEvent {
    /** 聊天对象的 userCode */
    private String peerId;

    public StartConversationEvent(String peerId){
        this.peerId = peerId;
    }

    public String getPeerId() {
        return peerId;
    }
}
