package com.bokesoft.ecomm.im.android.backend;

import android.content.Context;

import com.alibaba.fastjson.JSON;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.utils.HttpHelper;
import com.bokesoft.services.messager.server.model.HistoryMessagesData;
import com.loopj.android.http.RequestParams;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Wrapper for IM Server's HTTP Service
 */
public class IMServiceFacade {
    private static String encodeUrlPart(String part) {
        try {
            return URLEncoder.encode(part, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 访问 IM 服务器, 查询历史消息;
     * 详见 com.bokesoft.services.messager.server.HistoryServlet
     * 请求参数, json字符串, 包含如下参数:
     * <br/>- self(当前用户,不能为空)
     * <br/>- from(开始时间/时间戳,可以为空; 注意, 此“开始时间”是向前搜索的开始时间)
     * <br/>- keywords(搜索条件,可以为空)
     * <br/>- other(聊天用户,可以为空)
     * 例如: {self: 'tester', from: 1481585978795, keywords: '测试', other: 'peter'}
     * 返回数据格式 - 详见 com.bokesoft.services.messager.server.model.HistoryMessagesData
     *
     * @param context
     * @param keywords
     * @param fromTimestamp
     * @param peerId
     * @param callback
     */
    public static void queryHistory(final Context context,
                                    String keywords, Long fromTimestamp, String peerId,
                                    final QueryHistoryCallback callback) {
        ClientInstance ci = ClientInstance.getInstance();

        Map<String, Object> map = new HashMap<>();
        map.put("keywords", keywords);
        map.put("self", ci.getClientId());
        map.put("from", fromTimestamp);
        map.put("other", peerId);

        String url = ci.getHistoryServiceUrl();
        RequestParams p = new RequestParams();
        p.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());
        p.put("data", JSON.toJSONString(map));
        HttpHelper.post(context, url, p, new HttpHelper.HttpCallback() {
            @Override
            public Object perform(String data) {
                HistoryMessagesData result = JSON.parseObject(data, HistoryMessagesData.class);
                callback.perform(result);
                return null;
            }
        });
    }

    public static interface QueryHistoryCallback {
        public void perform(HistoryMessagesData data);
    }

    /**
     * 设置用户状态
     * 请求参数格式：
     * {userCode1: state1, userCode2: state2, ...}
     * 返回数据格式：
     * {success: 1}, 其他格式均认为错误.
     *
     * @param context
     * @param states
     */
//    public static void setUserStates(final Context context, UserStates states) {
//        ClientInstance ci = ClientInstance.getInstance();
//        String url = ci.getStateServiceUrl();
//        RequestParams p = new RequestParams();
//        p.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());
//        p.put("data", JSON.toJSONString(states.getStates()));
//        HttpHelper.post(context, url, p, new HttpHelper.HttpCallback() {
//            @Override
//            public Object perform(String data) {
//                return null;
//            }
//        });
//    }

    /**
     * 获取用户状态
     * 请求参数格式：
     * /state?u=u001&u=u002&u=u003...
     * 返回数据格式：
     * {userCode1: state1, userCode2: state2, ...}
     */
//    public static void getUserStates(final Context context, String[] userCodes, final QueryUserStatesCallback callback) {
//        ClientInstance ci = ClientInstance.getInstance();
//        String url = ci.getStateServiceUrl();
//        List<String> params = new ArrayList<>();
//        for (int i = 0; i < userCodes.length; i++) {
//            String userCode = userCodes[i];
//            userCode = encodeUrlPart(userCode);
//            params.add("u=" + userCode);
//        }
//        url = url
//                + "?" + ClientInstance.PARAM_NAME_TOKEN + "=" + ClientInstance.getInstance().getClientToken()
//                + "&" + StringUtils.join(params, "&");
//        HttpHelper.get(context, url, new RequestParams(), new HttpHelper.HttpCallback() {
//            @Override
//            public Object perform(String data) {
//                UserStates result = new UserStates();
//                JSONObject userStates = JSON.parseObject(data);
//                for (String userCode : userStates.keySet()) {
//                    String state = userStates.getString(userCode);
//                    result.setState(userCode, state);
//                }
//                callback.perform(result);
//                return null;
//            }
//        });
//    }

    public static class UserStates {
        /**
         * 在线
         */
        public static final String ONLINE = "online";
        /**
         * 离线
         */
        public static final String OFFLINE = "offline";
        /**
         * 忙碌
         */
        public static final String BUSY = "busy";
        /**
         * 隐身
         */
        public static final String LURK = "lurk";
        /**
         * 离开
         */
        public static final String IDLE = "idle";

        private Map<String, String> states = new HashMap<>();

        public Map<String, String> getStates() {
            return this.states;
        }

        public String getState(String userCode) {
            return this.states.get(userCode);
        }

        public void setState(String userCode, String state) {
            this.states.put(userCode, state);
        }

        public static String getStateText(String userStates) {
            String stateText = null;
            switch (userStates) {
                case ONLINE:
                    stateText = "在线";
                    break;
                case OFFLINE:
                    stateText = "离线";
                    break;
                case BUSY:
                    stateText = "忙碌";
                    break;
                case LURK:
                    stateText = "隐身";
                    break;
                case IDLE:
                    stateText = "离开";
                    break;
            }
            return stateText;
        }
    }

    public static interface QueryUserStatesCallback {
        public void perform(UserStates userStates);
    }

    /**
     * 上传图片消息
     *
     * @param context
     * @param pictureUrl
     * @param requestParams
     * @param callback
     */
    public static void pictureUpload(final Context context, String pictureUrl, RequestParams requestParams, final uploadCllback callback) {
        ClientInstance ci = ClientInstance.getInstance();
        requestParams.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());
        try {
            requestParams.put("light-editor", new File(pictureUrl), "multipart/form-data");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String fileurl = ci.getFileUploadUrl();
        HttpHelper.post(context, fileurl, requestParams, new HttpHelper.HttpCallback() {
            @Override
            public Object perform(String data) {
                callback.perform(data);
                return null;
            }
        });
    }

    public static interface uploadCllback {
        void perform(String data);
    }
}
