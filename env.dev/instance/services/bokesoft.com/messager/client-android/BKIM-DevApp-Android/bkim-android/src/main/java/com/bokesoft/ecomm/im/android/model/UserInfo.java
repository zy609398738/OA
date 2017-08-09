package com.bokesoft.ecomm.im.android.model;

/**
 * 用户信息
 */
public final class UserInfo {
    private String userCode;
    private String userIcon;  //The url of userIcon
    private String userName;
//    private String userState;//用户是否在线状态


    public UserInfo(String userCode, String userName, String userIcon) {
        this.userCode = userCode;
        this.userIcon = userIcon;
        this.userName = userName;
//        this.userState = userState;

    }

    public String getUserCode() {
        return userCode;
    }

    public String getUserIcon() {
        return userIcon;
    }

    public String getUserName() {
        return userName;
    }

//    public String getUserState() {
//        return userState;
//    }
}
