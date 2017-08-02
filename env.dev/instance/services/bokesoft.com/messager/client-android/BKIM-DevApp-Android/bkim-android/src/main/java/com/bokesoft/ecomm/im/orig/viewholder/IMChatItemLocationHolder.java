package com.bokesoft.ecomm.im.orig.viewholder;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.orig.event.BKIMLocationItemClickEvent;
import com.bokesoft.ecomm.im.android.ui.viewholder.ChatItemHolder;

import de.greenrobot.event.EventBus;

/**
 * TODO (未实现仅供参考) Location 类型的消息
 * 聊天页面中的地理位置 item 对应的 holder
 */
public class IMChatItemLocationHolder extends ChatItemHolder {

    protected TextView contentView;

    public IMChatItemLocationHolder(Context context, ViewGroup root, boolean isLeft) {
        super(context, root, isLeft);
    }

    @Override
    public void initView() {
        super.initView();
        conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_location, null));
        contentView = (TextView) itemView.findViewById(R.id.locationView);
        conventLayout.setBackgroundResource(isLeft ? R.drawable.bkim_chat_item_left_bg : R.drawable.bkim_chat_item_right_bg);
        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                BKIMLocationItemClickEvent event = new BKIMLocationItemClickEvent();
                event.message = message;
                EventBus.getDefault().post(event);
            }
        });
    }

    @Override
    public void bindData(Object o) {
        super.bindData(o);
//        AVIMMessage message = (AVIMMessage) o;
//        if (message instanceof AVIMLocationMessage) {
//            final AVIMLocationMessage locMsg = (AVIMLocationMessage) message;
//            contentView.setText(locMsg.getText());
//        }
    }
}
