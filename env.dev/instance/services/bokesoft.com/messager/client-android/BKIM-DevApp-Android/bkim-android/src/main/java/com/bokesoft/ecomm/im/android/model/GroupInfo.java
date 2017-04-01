package com.bokesoft.ecomm.im.android.model;

import java.util.List;

/**
 * The group of users.
 */
public class GroupInfo {
    public static final String GROUP_TYPE_NORMAL = "normal";
    public static final String GROUP_TYPE_BLACKLIST = "blacklist";

    private String groupName;
    private String groupType;
    private List<User> users;

    public static class User {
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

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
