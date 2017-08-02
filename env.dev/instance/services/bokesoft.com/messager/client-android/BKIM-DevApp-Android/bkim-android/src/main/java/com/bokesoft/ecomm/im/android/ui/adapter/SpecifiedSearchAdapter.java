package com.bokesoft.ecomm.im.android.ui.adapter;

import android.content.Context;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.CommonAdapter4RecyclerView;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.CommonHolder4RecyclerView;
import com.bokesoft.services.messager.server.model.Message;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by brooker on 2017/2/7.
 */

public class SpecifiedSearchAdapter extends CommonAdapter4RecyclerView<Message> {


    public SpecifiedSearchAdapter(Context context, List<Message> data, int layoutId) {
        super(context, data, layoutId);
    }

    @Override
    public void convert(CommonHolder4RecyclerView holder, Message msg) {
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
            holder.setTextViewText(R.id.tv_speaker_name, "对： " + receiverName + " 说:");
        } else {
            peerId = msg.getSender();
            holder.setTextViewText(R.id.tv_speaker_name, senderName + " 说:");
        }
        SimpleDateFormat sdr = new SimpleDateFormat("yyyy:MM:dd HH:mm");
        String timestamp = sdr.format(new Date(msg.getTimestamp()));
        holder.setTextViewText(R.id.tv_message_time, timestamp);
        holder.setTextViewText(R.id.tv_message, msgText);
    }
}
