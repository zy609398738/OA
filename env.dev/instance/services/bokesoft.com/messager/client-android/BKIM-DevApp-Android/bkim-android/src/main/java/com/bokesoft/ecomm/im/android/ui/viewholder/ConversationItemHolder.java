package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.ecomm.im.android.activity.ConversationActivity;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.ecomm.im.android.ui.viewholder.base.CommonViewHolder;
import com.squareup.picasso.Picasso;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

/**
 * 会话 item 对应的 holder
 */
public class ConversationItemHolder extends CommonViewHolder {

    ImageView avatarView;
    TextView unreadView;
    TextView messageView;
    TextView timeView;
    TextView nameView;
    RelativeLayout avatarLayout;
    LinearLayout contentLayout;

    public ConversationItemHolder(ViewGroup root) {
        super(root.getContext(), root, R.layout.bkim_conversation_item);
        initView();
    }

    public void initView() {
        avatarView = (ImageView) itemView.findViewById(R.id.conversation_item_iv_avatar);
        nameView = (TextView) itemView.findViewById(R.id.conversation_item_tv_name);
        timeView = (TextView) itemView.findViewById(R.id.conversation_item_tv_time);
        unreadView = (TextView) itemView.findViewById(R.id.conversation_item_tv_unread);
        messageView = (TextView) itemView.findViewById(R.id.conversation_item_tv_message);
        avatarLayout = (RelativeLayout) itemView.findViewById(R.id.conversation_item_layout_avatar);
        contentLayout = (LinearLayout) itemView.findViewById(R.id.conversation_item_layout_content);
    }

    @Override
    public void bindData(Object o) {
        reset();
        final MyActiveConnectData.SessionStat conversation = (MyActiveConnectData.SessionStat) o;
        if (null != conversation) {
            updateName(conversation);
            updateIcon(conversation);

            updateUnreadCount(conversation);
            updateLastMessageByConversation(conversation);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onConversationItemClick(conversation);
                }
            });
        }
    }

    /**
     * 一开始的时候全部置为空，避免因为异步请求造成的刷新不及时而导致的展示原有的缓存数据
     */
    private void reset() {
        avatarView.setImageResource(0);
        nameView.setText("");
        timeView.setText("");
        messageView.setText("");
        unreadView.setVisibility(View.GONE);
    }

    /**
     * 更新 name，单聊的话展示对方姓名，群聊展示所有用户的用户名
     *
     * @param conversation
     */
    private void updateName(MyActiveConnectData.SessionStat conversation) {
        UserInfo user = HostServiceFacade.getCachedUser(conversation.getCode());
        if (null!=user){
            nameView.setText(user.getUserName());
        }else{
            nameView.setText(conversation.getCode());
        }
    }

    /**
     * 更新 item icon，目前的逻辑为：
     * 单聊：展示对方的头像
     * 群聊：展示一个静态的 icon
     *
     * @param conversation
     */
    private void updateIcon(MyActiveConnectData.SessionStat conversation) {
        UserInfo user = HostServiceFacade.getCachedUser(conversation.getCode());
        if (null!=user){
            String avatarUrl = user.getUserIcon();
            if (!TextUtils.isEmpty(avatarUrl)) {
                if (avatarUrl.startsWith("/")){
                    //拼接为绝对路径
                    avatarUrl = ClientInstance.getInstance().getServiceUrlBase() + avatarUrl;
                //    Log.e("ip===", ClientInstance.getInstance().getServiceUrlBase());
                }
                Picasso.with(getContext()).load(avatarUrl).into(avatarView);
            } else {
                avatarView.setImageResource(R.drawable.bkim_default_avatar_icon);
            }
        }else{
            avatarView.setImageResource(R.drawable.bkim_default_avatar_icon);
        }
    }

    /**
     * 更新未读消息数量
     *
     * @param conversation
     */
    private void updateUnreadCount(MyActiveConnectData.SessionStat conversation) {
        int num = conversation.getCount();
        unreadView.setText(num + "");
        unreadView.setVisibility(num > 0 ? View.VISIBLE : View.GONE);
    }

    /**
     * 更新最后一条消息
     * queryMessages
     *
     * @param conversation
     */
    private void updateLastMessageByConversation(final MyActiveConnectData.SessionStat conversation) {
        // TODO 目前后台没有返回最后的消息
        timeView.setText("*");
        messageView.setText("(无消息)");
    }

    private void onConversationItemClick(MyActiveConnectData.SessionStat conversation) {
        Intent intent = new Intent(getContext(), ConversationActivity.class);
        intent.putExtra(BKIMConstants.PEER_ID, conversation.getCode());
        getContext().startActivity(intent);
    }

    public static ViewHolderCreator HOLDER_CREATOR = new ViewHolderCreator<ConversationItemHolder>() {
        @Override
        public ConversationItemHolder createByViewGroupAndType(ViewGroup parent, int viewType) {
            return new ConversationItemHolder(parent);
        }
    };
}
