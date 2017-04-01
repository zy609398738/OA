package com.bokesoft.ecomm.im.android.event;

/**
 * InputBottomBar 发送文本事件
 */
public class InputBottomBarTextEvent extends InputBottomBarEvent {

    /**
     * 发送的文本内容
     */
    public String sendContent;

    public InputBottomBarTextEvent(int action, String content, Object tag) {
        super(action, tag);
        sendContent = content;
    }
}
