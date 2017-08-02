package com.bokesoft.ecomm.im.android.local;

import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.ReceivedMessage;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.LocalMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LocalMessageManager {
    private static LocalMessageManager instance = new LocalMessageManager();

    public static final LocalMessageManager getInstance(){
        return instance;
    }

    /**
     * 记录与每个对话方 发送/接收 的历史消息, 目前历史消息不会持久化保存在本地, 仅仅缓存在每次 APP 运行实例期间的消息;
     * 数据存储方式: {
     *     (IM 当前登录 ClientId): {
     *         (IM 对话方 toClientId) : [(消息列表)],
     *         ... ...
     *     },
     *     ... ...
     * }
     */
    private Map<String, Map<String, List<LocalMessage>>> messageStore = new HashMap<>();

    private List<LocalMessage> getCurrentLocalMessages(String conversationUserCode) {
        String clientId = ClientInstance.getInstance().getClientId();
        Map<String, List<LocalMessage>> currentClientMessages = messageStore.get(clientId);
        if (null==currentClientMessages){
            currentClientMessages = new HashMap<>();
            messageStore.put(clientId, currentClientMessages);
        }
        List<LocalMessage> msgs = currentClientMessages.get(conversationUserCode);
        if (null==msgs){
            msgs = new ArrayList<>();
            currentClientMessages.put(conversationUserCode, msgs);
        }

        return msgs;
    }

    /**
     * 获取所有的本地消息
     * @param conversationUserCode
     * @return
     */
    public List<LocalMessage> getAllMessages(String conversationUserCode){
        List<LocalMessage> msgs = getCurrentLocalMessages(conversationUserCode);
        return new ArrayList<>(msgs);
    }

    /**
     * 清除本地消息
     * @param conversationUserCode
     */
    public void clearMessages(String conversationUserCode){
        List<LocalMessage> msgs = getCurrentLocalMessages(conversationUserCode);
        msgs.clear();
    }

    private void putMessage(String conversationUserCode, LocalMessage message){
        List<LocalMessage> msgs = getCurrentLocalMessages(conversationUserCode);
        msgs.add(message);
    }

    /**
     * 将 接收到 的消息存入本地消息队列
     * @param message
     */
    public LocalMessage putReceivedMessage(Message message){
        String msgType = message.getType();
        if (Message.MSG_TYPE_BLANK.equals(msgType)){
            return null; //BLANK 消息不需要缓存
        }
        LocalMessage lm = new LocalMessage();
        lm.setType(msgType);
        lm.setSender(message.getSender());
        lm.setTimestamp(message.getTimestamp());
        lm.setData(message.getData());

        String conversationUserCode = message.getSender();
        putMessage(conversationUserCode, lm);

        return lm;
    }

    /**
     * 将 已发送 的消息记录到本地消息队列
     * @param sender
     * @param receiver
     * @param sentMsg 此处的消息类型 {@link ReceivedMessage} 是针对服务器而言的, 所以在客户端看来就是发送出去的消息
     */
    public LocalMessage putSentMessage(String sender, String receiver, ReceivedMessage sentMsg){
        String msgType = sentMsg.getType();
        if (Message.MSG_TYPE_BLANK.equals(msgType)){
            return null; //BLANK 消息不需要缓存
        }
        LocalMessage lm = new LocalMessage();
        lm.setType(msgType);
        lm.setSender(sender);
        lm.setTimestamp(System.currentTimeMillis());
        lm.setData(sentMsg.getData());

        String conversationUserCode = receiver;
        putMessage(conversationUserCode, lm);

        return lm;
    }
}
