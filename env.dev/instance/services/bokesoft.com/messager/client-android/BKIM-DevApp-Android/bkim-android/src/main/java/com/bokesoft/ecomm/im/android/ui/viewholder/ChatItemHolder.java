package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.LocalMessage;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.ecomm.im.android.ui.viewholder.base.CommonViewHolder;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.squareup.picasso.Picasso;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

/**
 * 聊天 item 的 holder
 */
public class ChatItemHolder extends CommonViewHolder {

    protected boolean isLeft;

    protected LocalMessage message;
    protected ImageView avatarView;
    protected TextView timeView;
    protected TextView nameView;
    protected LinearLayout conventLayout;
    protected FrameLayout statusLayout;
    protected ProgressBar progressBar;
    protected TextView statusView;
    protected ImageView errorView;

    public ChatItemHolder(Context context, ViewGroup root, boolean isLeft) {
        super(context, root, isLeft ? R.layout.bkim_chat_item_left_layout : R.layout.bkim_chat_item_right_layout);
        this.isLeft = isLeft;
        initView();
    }

    public void initView() {
        if (isLeft) {
            avatarView = (ImageView) itemView.findViewById(R.id.chat_left_iv_avatar);
            timeView = (TextView) itemView.findViewById(R.id.chat_left_tv_time);
            nameView = (TextView) itemView.findViewById(R.id.chat_left_tv_name);
            conventLayout = (LinearLayout) itemView.findViewById(R.id.chat_left_layout_content);
            statusLayout = (FrameLayout) itemView.findViewById(R.id.chat_left_layout_status);
            statusView = (TextView) itemView.findViewById(R.id.chat_left_tv_status);
            progressBar = (ProgressBar) itemView.findViewById(R.id.chat_left_progressbar);
            errorView = (ImageView) itemView.findViewById(R.id.chat_left_tv_error);
        } else {
            avatarView = (ImageView) itemView.findViewById(R.id.chat_right_iv_avatar);
            timeView = (TextView) itemView.findViewById(R.id.chat_right_tv_time);
            nameView = (TextView) itemView.findViewById(R.id.chat_right_tv_name);
            conventLayout = (LinearLayout) itemView.findViewById(R.id.chat_right_layout_content);
            statusLayout = (FrameLayout) itemView.findViewById(R.id.chat_right_layout_status);
            progressBar = (ProgressBar) itemView.findViewById(R.id.chat_right_progressbar);
            errorView = (ImageView) itemView.findViewById(R.id.chat_right_tv_error);
            statusView = (TextView) itemView.findViewById(R.id.chat_right_tv_status);
        }

        setAvatarClickEvent();
    }

    @Override
    public void bindData(Object o) {
        message = (LocalMessage) o;
        timeView.setText(millisecsToDateString(message.getTimestamp()));
        nameView.setText("");
        avatarView.setImageResource(R.drawable.bkim_default_avatar_icon);
        HostServiceFacade.prepareUserInfo(this.getContext(), new String[]{message.getSender()},
                new HostServiceFacade.PrepareUserInfoCallback(){
                    @Override
                    public void perform(HostServiceFacade.UserInfoProvider provider) {
                        String sender = message.getSender();
                        UserInfo user = provider.getUserInfo(sender);

                        nameView.setText(user.getUserName());
                        String avatarUrl = user.getUserIcon();
                        if (!TextUtils.isEmpty(avatarUrl)) {
                            if (avatarUrl.startsWith("/")){
                                //拼接为绝对路径
                                avatarUrl = ClientInstance.getInstance().getServiceUrlBase() + avatarUrl;
                            }
                            Picasso.with(getContext()).load(avatarUrl)
                                    .placeholder(R.drawable.bkim_default_avatar_icon).into(avatarView);
                        }
                    }
                }
        );

        /* FIXME 好友状态、上传进度等未实现
        switch (message.getMessageStatus()) {
            case AVIMMessageStatusFailed:
                statusLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
                statusView.setVisibility(View.GONE);
                errorView.setVisibility(View.VISIBLE);
                break;
            case AVIMMessageStatusSent:
                statusLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
                statusView.setVisibility(View.VISIBLE);
                statusView.setVisibility(View.GONE);
                errorView.setVisibility(View.GONE);
                break;
            case AVIMMessageStatusSending:
                statusLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                statusView.setVisibility(View.GONE);
                errorView.setVisibility(View.GONE);
                break;
            case AVIMMessageStatusNone:
            case AVIMMessageStatusReceipt:
                statusLayout.setVisibility(View.GONE);
                break;
        }
        */
    }

    public void showTimeView(boolean isShow) {
        timeView.setVisibility(isShow ? View.VISIBLE : View.GONE);
    }

    public void showUserName(boolean isShow) {
        nameView.setVisibility(isShow ? View.VISIBLE : View.GONE);
    }

    /**
     * 设置头像点击按钮的事件
     */
    private void setAvatarClickEvent() {
        avatarView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    Intent intent = new Intent();
                    intent.setPackage(getContext().getPackageName());
                    intent.setAction(BKIMConstants.AVATAR_CLICK_ACTION);
                    intent.addCategory(Intent.CATEGORY_DEFAULT);
                    getContext().startActivity(intent);
                } catch (ActivityNotFoundException exception) {
                    LogUtils.i(exception.toString());
                }
            }
        });
    }

    private static String millisecsToDateString(long timestamp) {
        //TODO 展示更人性一点
        SimpleDateFormat format = new SimpleDateFormat("MM-dd HH:mm");
        return format.format(new Date(timestamp));
    }
}

