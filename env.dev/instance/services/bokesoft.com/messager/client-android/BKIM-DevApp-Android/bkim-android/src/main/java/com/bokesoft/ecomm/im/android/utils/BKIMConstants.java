package com.bokesoft.ecomm.im.android.utils;

/**
 * 所有常量值均放到此类里边
 */
public class BKIMConstants {
    private static final String BKIM_CONSTANTS_PREFIX = "com.bokesoft.ecomm.im.android.";

    private static String getPrefixConstant(String str) {
        return BKIM_CONSTANTS_PREFIX + str;
    }

    /**
     * 参数名，表示对方的 id，跳转到 ConversationActivity 时可以设置
     */
    public static final String PEER_ID = getPrefixConstant("peer_id");

    /**
     * ConversationActivity 中头像点击事件发送的 action
     */
    public static final String AVATAR_CLICK_ACTION = getPrefixConstant("avatar_click_action");

    /**
     * 参数名, 用于传递 Image 的 URL 地址
     */
    public static final String IMAGE_URL = getPrefixConstant("image_url");

    /**
     * 参数名, 用于传递文件的名称
     */
    public static final String FILE_NAME = getPrefixConstant("file_name");
    /**
     * 参数名, 用于传递文件的 URL 地址
     */
    public static final String FILE_URL = getPrefixConstant("file_url");

    /**
     * 参数名, 用于传递历史消息搜索的内容
     */
    public static final String EXTRA_HISTORY_SEARCH_KEYWORDS = getPrefixConstant("history_search_keywords");

    public static final String ARG_HISTORY_SEARCH_KEYWORDS = "HISTORY_SEARCH_KEYWORDS";
    public static final String ARG_HISTORY_SEARCH_PEER_ID = "HISTORY_SEARCH_PEER_ID";
}
