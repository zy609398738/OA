package com.bokesoft.ecomm.im.android.ui.view;

import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.bokesoft.ecomm.im.android.utils.UIUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.ReceivedMessage;
import com.bokesoft.ecomm.im.android.backend.WebSocketFacade;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.local.LocalMessageManager;
import com.bokesoft.ecomm.im.android.services.WebSocketService;
import com.bokesoft.ecomm.im.android.ui.adapter.ChatAdapter;
import com.bokesoft.ecomm.im.android.event.InputBottomBarEvent;
import com.bokesoft.ecomm.im.android.event.InputBottomBarTextEvent;
import com.bokesoft.ecomm.im.android.utils.PathUtils;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.services.messager.server.model.RecentHistory;
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

    /**
     * 图片上传百分比
     */
    private UploadImageTask mTask;
    private ProgressDialog progressDialog;


    // 记录拍照等的文件路径
    protected String localCameraPath;

    private UserInfo imConversation;

    private Handler uiHandler;

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

        uiHandler = new Handler() {
            @Override
            public void handleMessage(android.os.Message msg) {
                itemAdapter.notifyDataSetChanged();
                scrollToBottom();
            }
        };

        EventBus.getDefault().register(this);
        return view;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                //TODO 此处应该通过历史消息查询 API 向前搜索
                refreshLayout.setRefreshing(false);
//                List<LocalMessage> msgs = LocalMessageManager.getInstance().getAllMessages(imConversation.getUserCode());
//                if (msgs.size() <= 0) {
//                    refreshLayout.setRefreshing(false);
//                } else {
//                    refreshLayout.setRefreshing(false);
//                    itemAdapter.setMessageList(msgs);
//                    itemAdapter.notifyDataSetChanged();
//                    layoutManager.scrollToPositionWithOffset(msgs.size() - 1, 0);
//                }
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
        itemAdapter.showUserName(true);

        WebSocketService.resetWebSocketService(this.getActivity(), imConversation.getUserCode());
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
    public void onEvent(WebSocketEvent event) {
        if (WebSocketEvent.TYPE_MESSAGE != event.getType()) {
            return; //只处理 WebSocket 消息, 其他 WebSocket 事件不处理
        }

        boolean changed = false;

        //处理 RecentHistory
        RecentHistory rh = event.getRecentHistory();
        if (null != rh && null != rh.getMessages()) {
            LocalMessageManager.getInstance().clearMessages(imConversation.getUserCode());
            List<Message> msgs = rh.getMessages();
            for (Message msg : msgs) {
                itemAdapter.addMessage(LocalMessageManager.getInstance().putReceivedMessage(msg));
                changed = true;
            }
        }

        //处理接收到的消息
        String json = event.getMessage();
        Message message = JSON.parseObject(json, Message.class);
        if (!Message.MSG_TYPE_BLANK.equals(message.getType())) {   //不处理 BLANK 消息
            if (null != imConversation &&
                /*避免无效消息*/imConversation.getUserCode().equals(message.getSender())) {
                itemAdapter.addMessage(LocalMessageManager.getInstance().putReceivedMessage(message));
                changed = true;
            }
        }

        //通知界面刷新
        if (changed) {
            uiHandler.sendMessage(new android.os.Message());
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
                    Uri imgUri = data.getData();
                    String imgPath = getRealPathFromURI(getActivity(), imgUri);
                    if (null != imgPath) {
                        sendImage(imgPath);
                    } else {
                        UIUtils.alert(this.getActivity(), "选择图片错误", "找不到图片文件 '" + imgUri + "'");
                    }
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
            if (null == cursor) {
                return null;
            }

            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            if (cursor.moveToFirst()) {
                return cursor.getString(column_index);
            }
            return null;
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
        ClientInstance ci = ClientInstance.getInstance();
        String fileName = imagePath.substring(imagePath.lastIndexOf("/")+1);
        String url = ci.getFileUploadUrl();
        String token = ci.getClientToken();
        progressDialog = (ProgressDialog) buildAlertDialog_progress(fileName);
        progressDialog.show();
        progressDialog.setCanceledOnTouchOutside(false);
        mTask = new UploadImageTask();
        mTask.execute(imagePath,url,token);
    }

    private Dialog buildAlertDialog_progress(String fileName) {
        ProgressDialog progressDialog = new ProgressDialog(getActivity());
        progressDialog.setTitle("上传图片" + fileName);
        //progressDialog.setMessage("loading...");
        /**进度条样式 */
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        /**模糊效果 */
        progressDialog.setIndeterminate(false);
        return progressDialog;
    }

    private void doSendMessage(ReceivedMessage message) {
        itemAdapter.addMessage(LocalMessageManager.getInstance().putSentMessage(
                ClientInstance.getInstance().getClientId(), imConversation.getUserCode(), message
        ));
        itemAdapter.notifyDataSetChanged();
        scrollToBottom();
        WebSocketFacade.getInstance().sendMessage(message);
    }

    private class UploadImageTask extends AsyncTask<String, Integer, String> {

        @Override
        protected void onPostExecute(String result) {
           if(result.equals("error")){
               progressDialog.dismiss();
               Toast.makeText(getActivity(),"上传图片失败",Toast.LENGTH_SHORT).show();
               return;
           }
            JSONObject jsondata = JSON.parseObject(result);
            String name = jsondata.get("fileName").toString();
            String url = jsondata.get("url").toString();
            ReceivedMessage.FileData fileData = new ReceivedMessage.FileData();
            fileData.setFileName(name);
            fileData.setFileUrl(url);
            ReceivedMessage message = new ReceivedMessage();
            message.setType(Message.MSG_TYPE_IMAGE);
            message.setData(JSON.toJSON(fileData));
            progressDialog.dismiss();
            doSendMessage(message);
        }

        @Override
        protected void onPreExecute() {
            //mTvProgress.setText("loading...");
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            progressDialog.setProgress(values[0]);
            //progressDialog.setMessage("loading..." + values[0] + "%");

        }

        @Override
        protected String doInBackground(String... params) {
            String filePath = params[0];
            String uploadUrl = params[1];
            String token = params[2];
            String end = "\r\n";
            String twoHyphens = "--";
            String boundary = "******";
            try {
                URL url = new URL(uploadUrl+"?"+ClientInstance.PARAM_NAME_TOKEN+"="+token);
                HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.setDoInput(true);
                httpURLConnection.setDoOutput(true);
                httpURLConnection.setUseCaches(false);
                httpURLConnection.setRequestMethod("POST");
                httpURLConnection.setConnectTimeout(6 * 1000);

                httpURLConnection.setRequestProperty("Connection", "Keep-Alive");
                httpURLConnection.setRequestProperty("Charset", "UTF-8");
                httpURLConnection.setRequestProperty("Content-Type","multipart/form-data;boundary=" + boundary);

                DataOutputStream dos = new DataOutputStream(httpURLConnection.getOutputStream());
                dos.writeBytes(twoHyphens + boundary + end);
                dos.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\""
                        + filePath.substring(filePath.lastIndexOf("/") + 1)
                        + "\"" + end);
                dos.writeBytes(end);

                FileInputStream fis = new FileInputStream(filePath);
                long total = fis.available();

                byte[] buffer = new byte[8192];
                int count = 0;
                int length = 0;
                while ((count = fis.read(buffer)) != -1) {
                    dos.write(buffer, 0, count);
                    length += count;
                    publishProgress((int) ((length / (float) total) * 100));
                }
                fis.close();
                dos.writeBytes(end);
                dos.writeBytes(twoHyphens + boundary + twoHyphens + end);
                dos.flush();

                InputStream is = httpURLConnection.getInputStream();
                InputStreamReader isr = new InputStreamReader(is, "utf-8");
                BufferedReader br = new BufferedReader(isr);

                String result = br.readLine();
                dos.close();
                is.close();
                return result;
            } catch (Exception e) {
                LogUtils.logException(e);
                return "error";
            }
        }

    }

}
