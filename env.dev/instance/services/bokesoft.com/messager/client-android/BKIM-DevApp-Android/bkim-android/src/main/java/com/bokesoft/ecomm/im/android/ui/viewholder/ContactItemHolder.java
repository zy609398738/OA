package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.ConversationActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.squareup.picasso.Picasso;

import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.ui.viewholder.base.CommonViewHolder;

public class ContactItemHolder extends CommonViewHolder<UserInfo> {

    TextView nameView;
    ImageView avatarView;

    public UserInfo userInfo;

    public ContactItemHolder(Context context, ViewGroup root) {
        super(context, root, R.layout.contact_common_user_item);
        initView();
    }

    public void initView() {
        nameView = (TextView) itemView.findViewById(R.id.tv_friend_name);
        avatarView = (ImageView) itemView.findViewById(R.id.img_friend_avatar);

        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            Intent intent = new Intent(getContext(), ConversationActivity.class);
            intent.putExtra(BKIMConstants.PEER_ID, userInfo.getUserCode());
            getContext().startActivity(intent);
            }
        });
    }

    @Override
    public void bindData(UserInfo userInfo) {
        this.userInfo = userInfo;
        String avatarUrl = userInfo.getUserIcon();
        if (!TextUtils.isEmpty(avatarUrl)) {
            if (avatarUrl.startsWith("/")){
                //拼接为绝对路径
                avatarUrl = ClientInstance.getInstance().getServiceUrlBase() + avatarUrl;
            }
            Picasso.with(getContext()).load(avatarUrl).into(avatarView);
        } else {
            avatarView.setImageResource(R.drawable.bkim_default_avatar_icon);
        }
        nameView.setText(userInfo.getUserName());
    }

    public static ViewHolderCreator HOLDER_CREATOR = new ViewHolderCreator<ContactItemHolder>() {
        @Override
        public ContactItemHolder createByViewGroupAndType(ViewGroup parent, int viewType) {
            return new ContactItemHolder(parent.getContext(), parent);
        }
    };
}
