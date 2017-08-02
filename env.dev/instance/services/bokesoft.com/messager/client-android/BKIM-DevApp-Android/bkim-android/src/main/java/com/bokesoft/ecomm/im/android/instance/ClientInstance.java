package com.bokesoft.ecomm.im.android.instance;

/**
 * The Connection information of BKIM
 */
public class ClientInstance {
    /**
     * IM APP Client 访问 IM 服务 和 HOST 服务时都需要传递额外的 token 参数(不象浏览器客户端可以有 session 信息)
     */
    public static final String PARAM_NAME_TOKEN = "t";

    private static ClientInstance inst = new ClientInstance();

    public static final ClientInstance getInstance() {
        return inst;
    }

    private String webSocketBaseUrl;
    private String fileUploadUrl;
    private String historyServiceUrl;
//    private String stateServiceUrl;

    private String serviceUrlBase;  //通过传入的 Host Server Address 字符串计算出来的 Base Url, 主要是为了处理头像等图片路径

    private String serviceIdentityUrl;
    private String serviceUserInfoUrl;
    private String serviceBuddiesUrl;
    private String clientId;

    private String clientToken;
    private String toClientId;

    public ClientInstance config(String imServerUrl, String hostServerUrl) {
        webSocketBaseUrl = "ws://" + imServerUrl + "/messager";//获取消息接口
        fileUploadUrl = "http://" + imServerUrl + "/upload/";//上传文本接口
//        stateServiceUrl = "http://" + imServerUrl + "/state/";//状态的接口
        historyServiceUrl = "http://" + imServerUrl + "/history/";//获取历史记录的接口

        serviceUrlBase = hostServerUrl.substring(0, hostServerUrl.indexOf("/"));
        serviceUrlBase = "http://" + serviceUrlBase;
        serviceIdentityUrl = ("http://" + hostServerUrl).replace("${service}", "identity");
        serviceUserInfoUrl = ("http://" + hostServerUrl).replace("${service}", "userinfo");//获取联系人列表接口
        serviceBuddiesUrl = ("http://" + hostServerUrl).replace("${service}", "buddies");

        return this;
    }

    public ClientInstance init(String clientToken, String clientId) {
        this.clientToken = clientToken;
        this.clientId = clientId;
        this.toClientId = null;

        return this;
    }

    public ClientInstance switchToClient(String toClientId) {
        this.toClientId = toClientId;

        return this;
    }

    public boolean isReady() {
        return (null != clientToken && null != clientId && null != webSocketBaseUrl);
    }

    public String getWebSocketBaseUrl() {
        return webSocketBaseUrl;
    }

    public String getFileUploadUrl() {
        return fileUploadUrl;
    }
//    public String getStateServiceUrl() {
//        return stateServiceUrl;
//  }
    public String getHistoryServiceUrl() {
        return historyServiceUrl;
    }

    public String getServiceUrlBase() {
        return serviceUrlBase;
    }

    public String getServiceIdentityUrl() {
        return serviceIdentityUrl;
    }

    public String getServiceUserInfoUrl() {
        return serviceUserInfoUrl;
    }

    public String getServiceBuddiesUrl() {
        return serviceBuddiesUrl;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientToken() {
        return clientToken;
    }

    public String getToClientId() {
        return toClientId;
    }

}
