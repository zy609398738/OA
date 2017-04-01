package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.ImageActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.LocalMessage;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.utils.LogUtils;


/**
 * 聊天页面中的图片 item 对应的 holder
 */
public class ChatItemImageHolder extends ChatItemHolder {

    protected ImageView contentView;
    private static final int MAX_DEFAULT_HEIGHT = 200;
    private static final int MAX_DEFAULT_WIDTH = 300;
    private String fileUrl;

    public ChatItemImageHolder(Context context, ViewGroup root, boolean isLeft) {
        super(context, root, isLeft);
    }

    @Override
    public void initView() {
        super.initView();
        conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_image_layout, null));
        contentView = (ImageView) itemView.findViewById(R.id.chat_item_image_view);
        if (isLeft) {
            contentView.setBackgroundResource(R.drawable.bkim_chat_item_left_bg);
        } else {
            contentView.setBackgroundResource(R.drawable.bkim_chat_item_right_bg);
        }

        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               try {
                   Intent intent = new Intent(getContext(),ImageActivity.class);
                   intent.setPackage(getContext().getPackageName());
                   JSONObject data = (JSONObject) message.getData();
                   String fileName = data.getString("fileName");
                   fileUrl = ClientInstance.getInstance().getFileUploadUrl() + data.getString("fileUrl").replace("\\", "/");
                   intent.putExtra(BKIMConstants.IMAGE_LOCAL_PATH, fileName);
                   intent.putExtra(BKIMConstants.IMAGE_URL, fileUrl);
                   getContext().startActivity(intent);
                } catch (ActivityNotFoundException exception) {
                    LogUtils.i(exception.toString());
                }
            }
        });
    }

    @Override
    public void bindData(Object o) {
        super.bindData(o);
        LocalMessage message = (LocalMessage) o;
        if(com.bokesoft.services.messager.server.model.Message.MSG_TYPE_IMAGE.equals(message.getType())){
            JSONObject data = (JSONObject) message.getData();
            String fileIcon = data.getString("fileIcon");
            String fileName = data.getString("fileName");
            fileUrl = data.getString("fileUrl");
            contentView.setMaxWidth(MAX_DEFAULT_WIDTH);
            //contentView.setMaxHeight(MAX_DEFAULT_HEIGHT);
            fileUrl = ClientInstance.getInstance().getFileUploadUrl()+fileUrl.replace("\\", "/");
            new NormalLoadPictrue().getPicture(fileUrl, contentView);
        }
    }
}



