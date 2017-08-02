package com.bokesoft.ecomm.im.android.instance;

import java.util.HashMap;
import java.util.Map;

/**
 * 统一管理 IM 客户端的各类数据
 */
public class ClientInstanceData {
    private static Map<String, String> userStateTable = new HashMap<>();

    public static void addUserState(String userCode, String state) {
        if (userCode != null) {
            if (userStateTable.containsKey(userCode)) {
                userStateTable.remove(userCode);
                userStateTable.put(userCode, state);
            } else {
                userStateTable.put(userCode, state);
            }
        }
    }

    public static String getUserState(String userCode) {
        //Log.d("userCode==", userCode);
        if (userStateTable.containsKey(userCode)) {
            return userStateTable.get(userCode);
        } else {
            return null;
        }


    }
}
