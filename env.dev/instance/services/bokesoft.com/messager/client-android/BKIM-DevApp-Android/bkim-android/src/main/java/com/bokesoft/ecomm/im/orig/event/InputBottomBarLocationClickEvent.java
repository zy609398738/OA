package com.bokesoft.ecomm.im.orig.event;

import com.bokesoft.ecomm.im.android.event.InputBottomBarEvent;

/**
 * inputbottombar 里边的点击地理位置，触发此事件
 * 其实这些 item 都可以放到一个 event 处理，因为兼容以前的逻辑，暂时分开
 */
public class InputBottomBarLocationClickEvent extends InputBottomBarEvent {
  public InputBottomBarLocationClickEvent(int action, Object tag) {
    super(action, tag);
  }
}