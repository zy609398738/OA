package com.bokesoft.ecomm.im.orig.event;

import com.bokesoft.ecomm.im.android.model.LocalMessage;

/**
 * TODO (未实现仅供参考) Location 类型的消息
 * 聊天时地理位置 item 点击时触发该事件
 * 其实这些 item 都可以放到一个 event 处理，因为兼容以前的逻辑，暂时分开
 */
public class BKIMLocationItemClickEvent {
  public LocalMessage message;
}