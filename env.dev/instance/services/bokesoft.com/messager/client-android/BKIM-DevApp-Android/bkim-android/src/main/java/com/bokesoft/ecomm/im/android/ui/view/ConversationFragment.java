package com.bokesoft.ecomm.im.android.ui.view;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.io.File;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.ReceivedMessage;
import com.bokesoft.ecomm.im.android.backend.WebSocketFacade;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.local.LocalMessageManager;
import com.bokesoft.ecomm.im.android.model.LocalMessage;
import com.bokesoft.ecomm.im.android.services.WebSocketService;
import com.bokesoft.ecomm.im.android.ui.adapter.ChatAdapter;
import com.bokesoft.ecomm.im.android.event.InputBottomBarEvent;
import com.bokesoft.ecomm.im.android.event.InputBottomBarTextEvent;
import com.bokesoft.ecomm.im.android.utils.PathUtils;
import com.bokesoft.ecomm.im.android.model.UserInfo;

import de.greenrobot.event.EventBus;

/**
 * 将聊天相关的封装到此 Fragment 里边，只需要通过 setConversation 传入 Conversation 即可
 */
public class ConversationFragment extends Fragment {

    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final int REQUEST_IMAGE_PICK = 2;

    /**
     * recyclerView 对应的 Adapter
     */
    protected ChatAdapter itemAdapter;

    protected RecyclerView recyclerView;
    protected LinearLayoutManager layoutManager;

    /**
     * 负责下拉刷新的 SwipeRefreshLayout
     */
    protected SwipeRefreshLayout refreshLayout;

    /**
     * 底部的输入栏
     */
    protected ConversationInputBottomBar inputBottomBar;

    // 记录拍照等的文件路径
    protected String localCameraPath;

    private UserInfo imConversation;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.bkim_conversation_fragment, container, false);

        recyclerView = (RecyclerView) view.findViewById(R.id.fragment_chat_rv_chat);
        refreshLayout = (SwipeRefreshLayout) view.findViewById(R.id.fragment_chat_srl_pullrefresh);
        refreshLayout.setEnabled(false);
        inputBottomBar = (ConversationInputBottomBar) view.findViewById(R.id.fragment_chat_inputbottombar);
        layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);

        itemAdapter = getAdpter();
        itemAdapter.resetRecycledViewPoolSize(recyclerView);
        recyclerView.setAdapter(itemAdapter);

        EventBus.getDefault().register(this);
        return view;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                List<LocalMessage> msgs = LocalMessageManager.getInstance().getAllMessages(imConversation.getUserCode());
                if (msgs.size()<=0){
                    refreshLayout.setRefreshing(false);
                } else {
                    refreshLayout.setRefreshing(false);
                    itemAdapter.setMessageList(msgs);
                    itemAdapter.notifyDataSetChanged();
                    layoutManager.scrollToPositionWithOffset(msgs.size() - 1, 0);
                }
            }
        });
    }

    protected ChatAdapter getAdpter() {
        return new ChatAdapter();
    }

    @Override
    public void onDestroyView() {
        WebSocketService.resetWebSocketService(this.getActivity(), null);

        super.onDestroyView();
        EventBus.getDefault().unregister(this);
    }

    public void setConversation(final UserInfo conversation) {
        imConversation = conversation;
        refreshLayout.setEnabled(true);
        inputBottomBar.setTag(imConversation.getUserCode());
        fetchMessages();
        itemAdapter.showUserName(true);

        WebSocketService.resetWebSocketService(this.getActivity(), imConversation.getUserCode());
    }

    /**
     * 拉取消息，必须加入 conversation 后才能拉取消息
     */
    private void fetchMessages() {
        List<LocalMessage> messageList = LocalMessageManager.getInstance().getAllMessages(imConversation.getUserCode());
        itemAdapter.setMessageList(messageList);
        recyclerView.setAdapter(itemAdapter);
        itemAdapter.notifyDataSetChanged();
        scrollToBottom();
    }

    /**
     * 输入事件处理，接收后构造成 AVIMTextMessage 然后发送
     */
    public void onEvent(InputBottomBarTextEvent textEvent) {
        if (null != imConversation && null != textEvent) {
            if (!TextUtils.isEmpty(textEvent.sendContent) &&
                    /*避免无效消息*/imConversation.getUserCode().equals(textEvent.tag)) {
                sendText(textEvent.sendContent);
            }
        }
    }

    /**
     * 处理推送过来的消息
     */
    public void onEventMainThread(WebSocketEvent event) {
        if (WebSocketEvent.TYPE_MESSAGE!=event.getType()){
            return; //只处理 WebSocket 消息, 其他 WebSocket 事件不处理
        }
        String json = event.getMessage();
        Message message = JSON.parseObject(json, Message.class);
        if (Message.MSG_TYPE_BLANK.equals(message.getType())){
            return; //不处理 BLANK 消息
        }
        if (null != imConversation &&
                /*避免无效消息*/imConversation.getUserCode().equals(message.getSender())) {
            itemAdapter.addMessage(LocalMessageManager.getInstance().putReceivedMessage(message));
            itemAdapter.notifyDataSetChanged();
            scrollToBottom();
        }
    }

    /**
     * 处理输入栏发送过来的事件
     *
     * @param event
     */
    public void onEvent(InputBottomBarEvent event) {
        if (null != imConversation && null != event && imConversation.getUserCode().equals(event.tag)) {
            switch (event.eventAction) {
                case InputBottomBarEvent.INPUTBOTTOMBAR_IMAGE_ACTION:
                    dispatchPickPictureIntent();
                    break;
                case InputBottomBarEvent.INPUTBOTTOMBAR_CAMERA_ACTION:
                    dispatchTakePictureIntent();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 发送 Intent 跳转到系统拍照页面
     */
    private void dispatchTakePictureIntent() {
        localCameraPath = PathUtils.getPicturePathByCurrentTime(getContext());
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        Uri imageUri = Uri.fromFile(new File(localCameraPath));
        takePictureIntent.putExtra("return-data", false);
        takePictureIntent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, imageUri);
        if (takePictureIntent.resolveActivity(getActivity().getPackageManager()) != null) {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        }
    }

    /**
     * 发送 Intent 跳转到系统图库页面
     */
    private void dispatchPickPictureIntent() {
        Intent photoPickerIntent = new Intent(Intent.ACTION_PICK, null);
        photoPickerIntent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
        startActivityForResult(photoPickerIntent, REQUEST_IMAGE_PICK);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (Activity.RESULT_OK == resultCode) {
            switch (requestCode) {
                case REQUEST_IMAGE_CAPTURE:
                    sendImage(localCameraPath);
                    break;
                case REQUEST_IMAGE_PICK:
                    sendImage(getRealPathFromURI(getActivity(), data.getData()));
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 滚动 recyclerView 到底部
     */
    private void scrollToBottom() {
        layoutManager.scrollToPositionWithOffset(itemAdapter.getItemCount() - 1, 0);
    }

    /**
     * 根据 Uri 获取文件所在的位置
     *
     * @param context
     * @param contentUri
     * @return
     */
    private String getRealPathFromURI(Context context, Uri contentUri) {
        Cursor cursor = null;
        try {
            String[] proj = {MediaStore.Images.Media.DATA};
            cursor = context.getContentResolver().query(contentUri, proj, null, null, null);
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            return cursor.getString(column_index);
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }

    /**
     * 发送文本消息
     *
     * @param content
     */
    protected void sendText(String content) {
        ReceivedMessage message = new ReceivedMessage();
        message.setType(Message.MSG_TYPE_TEXT);
        message.setData(content);
        doSendMessage(message);
    }

    /**
     * 发送图片消息
     *
     * @param imagePath
     */
    protected void sendImage(String imagePath) {
        //TODO 需要上传后得到具体的 URL
        String uploadedUrl = "file://"+imagePath;
        String fileName = (new File(imagePath)).getName();
        ReceivedMessage.FileData file = new ReceivedMessage.FileData();
        file.setFileName(fileName);
        file.setFileUrl(uploadedUrl);

        ReceivedMessage message = new ReceivedMessage();
        message.setType(Message.MSG_TYPE_IMAGE);
        message.setData(file);

        doSendMessage(message);
    }

    private void doSendMessage(ReceivedMessage message) {
        itemAdapter.addMessage(LocalMessageManager.getInstance().putSentMessage(
                ClientInstance.getInstance().getClientId(), imConversation.getUserCode(), message
        ));
        itemAdapter.notifyDataSetChanged();
        scrollToBottom();
        WebSocketFacade.getInstance().sendMessage(message);
    }
}
