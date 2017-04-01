package com.bokesoft.ecomm.im.android.backend;

import android.content.Context;
import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.ecomm.im.android.utils.HttpHelper;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.loopj.android.http.RequestParams;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Wrapper for host services
 */
public class HostServiceFacade {
    private static Map<String, UserInfo> userCodeCache = new HashMap<String, UserInfo>();
    public static UserInfo getCachedUser(String userCode){
        return userCodeCache.get(userCode);
    }
    public static void updateUserInfoCache(UserInfo u){
        userCodeCache.put(u.getUserCode(), u);
    }

    public static void requestBuddies(final Context context, final BuddiesCallback callback){
        ClientInstance ci = ClientInstance.getInstance();
        final String url = ci.getServiceBuddiesUrl();

        RequestParams p = new RequestParams();
        p.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());

        HttpHelper.post(context, url, p, new HttpHelper.HttpCallback(){
            @Override
            public Object perform(String data) {
                LogUtils.e("==="+data);
                try{
                    List<GroupInfo> groups = JSON.parseArray(data, GroupInfo.class);

                    //从 buddies 服务获得的用户信息会更新到用户信息缓存中去
                    for(GroupInfo g: groups){
                        List<GroupInfo.User> uList = g.getUsers();
                        for(GroupInfo.User u: uList){
                            UserInfo ui = new UserInfo(u.getCode(), u.getName(), u.getIcon());
                            updateUserInfoCache(ui);
                        }
                    }

                    //回调业务处理
                    callback.perform(groups);
                }catch(Exception ex){
                    HttpHelper.processException(context, url, ex);
                }

                return null;
            }
        });
    }
    public static interface BuddiesCallback{
        public void perform(List<GroupInfo> groups);
    }

    public static void prepareUserInfo(final Context context, String[] userCodes, final PrepareUserInfoCallback callback){
        List<String> codesToQuery = new ArrayList<>();
        for (int i=0; i<userCodes.length; i++){
            String userCode = userCodes[i];
            if (! userCodeCache.containsKey(userCode)){
                codesToQuery.add(userCode);
            }
        }

        final UserInfoCache userInfoCache = new UserInfoCache();

        if (codesToQuery.size()<=0){
            callback.perform(userInfoCache);
            return;
        }

        ClientInstance ci = ClientInstance.getInstance();
        final String url = ci.getServiceUserInfoUrl();

        RequestParams p = new RequestParams();
        p.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());
        p.put("users", JSON.toJSONString(codesToQuery));
        HttpHelper.post(context, url, p, new HttpHelper.HttpCallback(){
            @Override
            public Object perform(String data) {
                try{
                    JSONObject userInfoMap = JSON.parseObject(data);
                    for (Map.Entry<String, Object> en:userInfoMap.entrySet()){
                        String userCode = en.getKey();
                        JSONObject userInfo = (JSONObject) en.getValue();
                        String userName = userInfo.getString("name");
                        String icon = userInfo.getString("icon");
                        userCodeCache.put(userCode, new UserInfo(userCode,userName,icon));
                    }

                    callback.perform(userInfoCache);
                }catch(Exception ex){
                    HttpHelper.processException(context, url, ex);
                }
                return null;
            }
        });
    }
    public static class UserInfoCache {
        public UserInfo getUserInfo(String userCode){
            UserInfo tmp = HostServiceFacade.getCachedUser(userCode);
            if (null==tmp){
                tmp = new UserInfo(userCode, userCode,null);
                //FIXME: 后台查找不到的用户应该与正常用户有所区分
                HostServiceFacade.updateUserInfoCache(tmp);
            }
            return tmp;
        }
    }
    public static interface PrepareUserInfoCallback {
        public void perform(UserInfoCache userInfoCache);
    }
}
