package com.bokesoft.ecomm.im.android.ui.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.View;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.SpecifiedSearchActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.CommonAdapter4RecyclerView;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.CommonHolder4RecyclerView;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.ListenerWithPosition;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.services.messager.server.model.Message;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


/**
 * 查看历史记录的适配器
 */
public class HistorySearchResultAdapter extends CommonAdapter4RecyclerView<Message> implements ListenerWithPosition.OnClickWithPositionListener {
    public HistorySearchResultAdapter(Context context, List<Message> data, int layoutId) {
        super(context, data, layoutId);
    }

    @Override
    public void convert(CommonHolder4RecyclerView holder, Message msg) {
        holder.setOnClickListener(this, R.id.ll_item);
        String selfCode = ClientInstance.getInstance().getClientId();
        String senderName = (null == msg.getSenderName() ? msg.getSender() : msg.getSenderName());
        String receiverName = (null == msg.getReceiverName() ? msg.getReceiver() : msg.getReceiverName());

        String msgText = "";
        if (Message.MSG_TYPE_TEXT.equals(msg.getType())) {
            msgText = msg.getData().toString();
        } else if (Message.MSG_TYPE_FILE.equals(msg.getType())) {
            msgText = "[文件]";
        } else if (Message.MSG_TYPE_IMAGE.equals(msg.getType())) {
            msgText = "[图片]";
        }

        final String peerId;
        if (selfCode.equals(msg.getSender())) {
            peerId = msg.getReceiver();
            holder.setTextViewText(R.id.tv_speaker_name, "对:  " + receiverName + " 说:");
        } else {
            peerId = msg.getSender();
            holder.setTextViewText(R.id.tv_speaker_name, senderName + " 说:");
        }
        SimpleDateFormat sdr = new SimpleDateFormat("yyyy:MM:dd HH:mm");
        String timestamp = sdr.format(new Date(msg.getTimestamp()));
        holder.setTextViewText(R.id.tv_message_time, timestamp);
        holder.setTextViewText(R.id.tv_message, msgText);
    }

    /**
     * 聊天记录的条目点击事件
     *
     * @param v
     * @param position
     * @param holder
     */
    @Override
    public void onClick(View v, int position, Object holder) {
        String self = ClientInstance.getInstance().getClientId();
        Intent intent = new Intent();
        Message message = mData.get(position);
        String time = message.getTimestamp() + "";
        String receiverName = message.getReceiverName();
        String senderName = message.getSenderName();
        if (!self.equals(message.getReceiver())) {
            intent.putExtra(BKIMConstants.PEER_ID, message.getReceiver());
            intent.putExtra("receiver_ID", message.getReceiver());
            intent.putExtra("startTime", time);
            if (receiverName != null) intent.putExtra("ReceiverName", receiverName);

        } else if (!self.equals(message.getSender())) {
            intent.putExtra(BKIMConstants.PEER_ID, message.getSender());
            intent.putExtra("sender_ID", message.getSender());
            intent.putExtra("startTime", time);
            if (senderName != null) intent.putExtra("SenderName", senderName);
        }

        intent.setClass(mContext, SpecifiedSearchActivity.class);
        mContext.startActivity(intent);
    }
}

