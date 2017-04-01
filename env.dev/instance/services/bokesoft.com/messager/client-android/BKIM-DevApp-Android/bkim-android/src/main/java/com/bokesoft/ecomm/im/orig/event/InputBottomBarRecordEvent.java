package com.bokesoft.ecomm.im.orig.event;

import com.bokesoft.ecomm.im.android.event.InputBottomBarEvent;

/**
 * InputBottomBar 录音事件，录音完成时触发
 */
public class InputBottomBarRecordEvent extends InputBottomBarEvent {

  /**
   * 录音本地路径
   */
  public String audioPath;

  /**
   * 录音长度
   */
  public int audioDuration;

  public InputBottomBarRecordEvent(int action, String path, int duration, Object tag) {
    super(action, tag);
    audioDuration = duration;
    audioPath = path;
  }
}
