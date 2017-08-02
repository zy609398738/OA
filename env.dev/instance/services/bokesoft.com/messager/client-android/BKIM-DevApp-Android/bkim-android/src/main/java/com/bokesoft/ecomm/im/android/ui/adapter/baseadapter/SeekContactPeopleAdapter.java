package com.bokesoft.ecomm.im.android.ui.adapter.baseadapter;

import android.content.Context;
import android.view.View;
import android.widget.ImageView;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.event.StartConversationEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.squareup.picasso.Picasso;

import java.util.List;

import de.greenrobot.event.EventBus;


/**
 * 搜索查看联系人的适配器
 */
public class SeekContactPeopleAdapter extends CommonAdapter4RecyclerView<GroupInfo.User> implements ListenerWithPosition.OnClickWithPositionListener {
    public SeekContactPeopleAdapter(Context context, List<GroupInfo.User> data, int layoutId) {
        super(context, data, layoutId);
    }

    @Override
    public void convert(CommonHolder4RecyclerView holder, final GroupInfo.User user) {
        holder.setOnClickListener(this, R.id.contact_people_layout);
        //联系人的头像
        ImageView imageHeand = holder.getView(R.id.image_head_portrait);
        if (user.getIcon() != null) {
            String url = ClientInstance.getInstance().getServiceUrlBase() + user.getIcon(); //拼接为绝对路径
            Picasso.with(mContext).load(url).into(imageHeand);
        } else {
            imageHeand.setImageResource(R.drawable.bkim_icon_user);
        }
        if (user.getName() == null) {
            holder.setTextViewText(R.id.tv_user_code, user.getCode());
        } else {
            holder.setTextViewText(R.id.tv_user_code, user.getName());
        }
    }

    @Override
    public void onClick(View v, int position, Object holder) {
        EventBus.getDefault().post(new StartConversationEvent(mData.get(position).getCode()));
    }
}
