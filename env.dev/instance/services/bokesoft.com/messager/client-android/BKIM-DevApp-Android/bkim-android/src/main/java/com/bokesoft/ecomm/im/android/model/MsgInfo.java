package com.bokesoft.ecomm.im.android.model;

import java.util.List;

/**
 * <pre>
 *     author : yyh
 *     time :  2017/7/26 16:05
 *     version: 1.0
 *     desc   : 描述XXXX
 * </pre>
 */
public class MsgInfo {

    /**
     * groupName : 东北区原物料
     * users : [{"code":"K13761","name":"杨芸芸 (Yang Yunyun)","icon":""},{"code":"K13807","name":"高月平 (Gao Yueping)","icon":""},{"code":"014221","name":"曹燕 (Cao yan)","icon":""},{"code":"116880","name":"颜士伟 (Yan Shiwei)","icon":""},{"code":"006610","name":"林小燕 (Lin xiaoyan)","icon":""}]
     */

    private String groupName;
    private List<UsersBean> users;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public List<UsersBean> getUsers() {
        return users;
    }

    public void setUsers(List<UsersBean> users) {
        this.users = users;
    }

    public static class UsersBean {
        /**
         * code : K13761
         * name : 杨芸芸 (Yang Yunyun)
         * icon :
         */

        private String code;
        private String name;
        private String icon;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }
    }
}
