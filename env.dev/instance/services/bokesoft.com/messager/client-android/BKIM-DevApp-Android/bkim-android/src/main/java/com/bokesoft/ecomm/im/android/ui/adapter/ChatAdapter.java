package com.bokesoft.ecomm.im.android.ui.adapter;

import android.support.v7.widget.RecyclerView;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.ecomm.im.orig.viewholder.IMChatItemAudioHolder;
import com.bokesoft.ecomm.im.android.ui.viewholder.ChatItemHolder;
import com.bokesoft.ecomm.im.android.ui.viewholder.ChatItemImageHolder;
import com.bokesoft.ecomm.im.orig.viewholder.IMChatItemLocationHolder;
import com.bokesoft.ecomm.im.android.ui.viewholder.ChatItemTextHolder;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.LocalMessage;
import com.bokesoft.ecomm.im.android.ui.viewholder.base.CommonViewHolder;
import com.bokesoft.ecomm.im.android.utils.LogUtils;

/**
 * 聊天的 Adapter，此处还有可优化的地方，稍后考虑一下提取出公共的 adapter
 */
public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final int ITEM_LEFT = 100;
    private final int ITEM_LEFT_TEXT = 101;
    private final int ITEM_LEFT_IMAGE = 102;
    private final int ITEM_LEFT_AUDIO = 103;
    private final int ITEM_LEFT_LOCATION = 104;

    private final int ITEM_RIGHT = 200;
    private final int ITEM_RIGHT_TEXT = 201;
    private final int ITEM_RIGHT_IMAGE = 202;
    private final int ITEM_RIGHT_AUDIO = 203;
    private final int ITEM_RIGHT_LOCATION = 204;

    private final int ITEM_UNKNOWN = 300;

    // 时间间隔最小为十分钟
    private final static long TIME_INTERVAL = 1000 * 60 * 3;
    private boolean isShowUserName = true;
    protected List<LocalMessage> messageList = new ArrayList<LocalMessage>();

    public ChatAdapter() {
        super();
    }

    public void setMessageList(List<LocalMessage> messages) {
        messageList.clear();
        if (null != messages) {
            messageList.addAll(messages);
        }
    }

    /**
     * 添加消息记录
     *
     * @param message
     */
    public void addMessage(LocalMessage message) {
        if (null!=message){
            messageList.add(message);
        }
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        switch (viewType) {
            case ITEM_LEFT:
            case ITEM_LEFT_TEXT:
                return new ChatItemTextHolder(parent.getContext(), parent, true);
            case ITEM_LEFT_IMAGE:
                return new ChatItemImageHolder(parent.getContext(), parent, true);
            case ITEM_LEFT_AUDIO:
                return new IMChatItemAudioHolder(parent.getContext(), parent, true);
            case ITEM_LEFT_LOCATION:
                return new IMChatItemLocationHolder(parent.getContext(), parent, true);
            case ITEM_RIGHT:
            case ITEM_RIGHT_TEXT:
                return new ChatItemTextHolder(parent.getContext(), parent, false);
            case ITEM_RIGHT_IMAGE:
                return new ChatItemImageHolder(parent.getContext(), parent, false);
            case ITEM_RIGHT_AUDIO:
                return new IMChatItemAudioHolder(parent.getContext(), parent, false);
            case ITEM_RIGHT_LOCATION:
                return new IMChatItemLocationHolder(parent.getContext(), parent, false);
            default:
                return new ChatItemTextHolder(parent.getContext(), parent, true);
        }
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        LocalMessage msg = messageList.get(position);
        if (null==msg){
            LogUtils.e("NULL message found in messageList["+position+"]");
        }
        ((CommonViewHolder) holder).bindData(msg);
        if (holder instanceof ChatItemHolder) {
            ((ChatItemHolder) holder).showTimeView(shouldShowTime(position));
            ((ChatItemHolder) holder).showUserName(isShowUserName);
        }
    }

    @Override
    public int getItemViewType(int position) {
        LocalMessage message = messageList.get(position);
        if (null != message) {
            boolean isMe = fromMe(message);
            if (Message.MSG_TYPE_TEXT.equals(message.getType())) {
                return isMe ? ITEM_RIGHT_TEXT : ITEM_LEFT_TEXT;
//            } else if (typedMessage.getMessageType() == AVIMReservedMessageType.AudioMessageType.getType()) {
//                return isMe ? ITEM_RIGHT_AUDIO : ITEM_LEFT_AUDIO;
            } else if (Message.MSG_TYPE_IMAGE.equals(message.getType())) {
                return isMe ? ITEM_RIGHT_IMAGE : ITEM_LEFT_IMAGE;
//            } else if (typedMessage.getMessageType() == AVIMReservedMessageType.LocationMessageType.getType()) {
//                return isMe ? ITEM_RIGHT_LOCATION : ITEM_LEFT_LOCATION;
            } else {
                return isMe ? ITEM_RIGHT : ITEM_LEFT;
            }
        }
        return ITEM_UNKNOWN;
    }

    @Override
    public int getItemCount() {
        return messageList.size();
    }

    /**
     * item 是否应该展示时间
     *
     * @param position
     * @return
     */
    private boolean shouldShowTime(int position) {
        if (position == 0) {
            return true;
        }
        long lastTime = messageList.get(position - 1).getTimestamp();
        long curTime = messageList.get(position).getTimestamp();
        return curTime - lastTime > TIME_INTERVAL;
    }

    /**
     * item 是否展示用户名
     * 因为
     *
     * @param isShow
     */
    public void showUserName(boolean isShow) {
        isShowUserName = isShow;
    }


    /**
     * 因为 RecyclerView 中的 item 缓存默认最大为 5，造成会重复的 create item 而卡顿
     * 所以这里根据不同的类型设置不同的缓存值，经验值，不同 app 可以根据自己的场景进行更改
     */
    public void resetRecycledViewPoolSize(RecyclerView recyclerView) {
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_LEFT_TEXT, 25);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_LEFT_IMAGE, 10);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_LEFT_AUDIO, 15);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_LEFT_LOCATION, 10);

        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_RIGHT_TEXT, 25);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_RIGHT_IMAGE, 10);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_RIGHT_AUDIO, 15);
        recyclerView.getRecycledViewPool().setMaxRecycledViews(ITEM_RIGHT_LOCATION, 10);
    }

    /**
     * 是不是当前用户发送的数据
     *
     * @param msg
     * @return
     */
    protected boolean fromMe(LocalMessage msg) {
        String selfId = ClientInstance.getInstance().getClientId();
        return msg.getSender() != null && msg.getSender().equals(selfId);
    }
}