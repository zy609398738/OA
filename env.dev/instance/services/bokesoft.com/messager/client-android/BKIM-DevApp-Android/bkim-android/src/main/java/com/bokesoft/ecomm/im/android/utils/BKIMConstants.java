package com.bokesoft.ecomm.im.android.utils;

/**
 * 所有常量值均放到此类里边
 */
public class BKIMConstants {
  private static final String LEANMESSAGE_CONSTANTS_PREFIX = "com.bokesoft.ecomm.im.android.";

  private static String getPrefixConstant(String str) {
    return LEANMESSAGE_CONSTANTS_PREFIX + str;
  }

  /**
   * 参数传递的 key 值，表示对方的 id，跳转到 ConversationActivity 时可以设置
   */
  public static final String PEER_ID = getPrefixConstant("peer_id");

  /**
   * ConversationActivity 中头像点击事件发送的 action
   */
  public static final String AVATAR_CLICK_ACTION = getPrefixConstant("avatar_click_action");

  // ImageActivity
  public static final String IMAGE_LOCAL_PATH = getPrefixConstant("image_local_path");
  public static final String IMAGE_URL = getPrefixConstant("image_url");

  //FileActivity
  public static final String FILE_NAME = getPrefixConstant("file_name");
  public static final String FILE_URL = getPrefixConstant("file_url");
}
