package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.AnimationDrawable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.ImageActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.LocalMessage;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.utils.NormalPictureLoader;
import com.bokesoft.services.messager.server.model.Message;

import static com.bokesoft.ecomm.im.android.R.color.whites;


/**
 * 聊天页面中的图片 item 对应的 holder
 */
public class ChatItemImageHolder extends ChatItemHolder {

    private ImageView contentView;
    private String token;
    private AnimationDrawable aniDraw;

    public ChatItemImageHolder(Context context, ViewGroup root, boolean isLeft) {
        super(context, root, isLeft);
    }

    @Override
    public void initView() {
        token = "?"+ClientInstance.PARAM_NAME_TOKEN+"=" + ClientInstance.getInstance().getClientToken();
        super.initView();
        conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_image_layout, null));
        contentView = (ImageView) itemView.findViewById(R.id.chat_item_image_view);

        contentView.setBackgroundResource(R.drawable.bkim_loading_image_file);
        aniDraw = (AnimationDrawable) contentView.getBackground();
        aniDraw.start();
        /*if (isLeft) {
            contentView.setBackgroundResource(R.drawable.bkim_chat_item_left_bg);
        } else {
            contentView.setBackgroundResource(R.drawable.bkim_chat_item_right_bg);
        }*/
        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), ImageActivity.class);
                intent.setPackage(getContext().getPackageName());
                JSONObject data = (JSONObject) message.getData();
                String fileName = data.getString("fileName");
                String fileUrl = ClientInstance.getInstance().getFileUploadUrl() + data.getString("fileUrl") + token;
                intent.putExtra(BKIMConstants.IMAGE_URL, fileUrl);
                intent.putExtra(BKIMConstants.FILE_NAME, fileName);
                getContext().startActivity(intent);
            }
        });
    }

    @Override
    public void bindData(Object o) {
        super.bindData(o);
        LocalMessage message = (LocalMessage) o;
        if (Message.MSG_TYPE_IMAGE.equals(message.getType())) {
            JSONObject data = (JSONObject) message.getData();
            String fileUrl = data.getString("fileUrl");
            fileUrl = ClientInstance.getInstance().getFileUploadUrl() + fileUrl + token + "&resize=icon";
            new NormalPictureLoader().getPicture(fileUrl, contentView);
        }
    }

}
