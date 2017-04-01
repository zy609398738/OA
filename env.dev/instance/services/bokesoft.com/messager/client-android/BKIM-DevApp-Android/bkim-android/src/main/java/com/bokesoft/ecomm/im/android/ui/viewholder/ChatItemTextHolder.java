package com.bokesoft.ecomm.im.android.ui.viewholder;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.FileActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.ecomm.im.android.model.LocalMessage;


/**
 * 聊天页面中的文本 item 对应的 holder
 */
public class ChatItemTextHolder extends ChatItemHolder {

    protected TextView contentView;

    public ChatItemTextHolder(Context context, ViewGroup root, boolean isLeft) {
        super(context, root, isLeft);
    }

    @Override
    public void initView() {
        super.initView();
        if (isLeft) {
            conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_left_text_layout, null));
            contentView = (TextView) itemView.findViewById(R.id.chat_left_text_tv_content);
        } else {
            conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_right_text_layout, null));
            contentView = (TextView) itemView.findViewById(R.id.chat_right_text_tv_content);
        }

       contentView.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View view) {
               try {
                   Intent intent = new Intent(getContext(), FileActivity.class);
                   intent.setPackage(getContext().getPackageName());
                   JSONObject data = (JSONObject) message.getData();
                   String fileName = data.getString("fileName");
                   String fileUrl = ClientInstance.getInstance().getFileUploadUrl() + data.getString("fileUrl");
                   intent.putExtra(BKIMConstants.FILE_NAME, fileName);
                   intent.putExtra(BKIMConstants.FILE_URL, fileUrl);
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
        if (Message.MSG_TYPE_TEXT.equals(((LocalMessage) o).getType())){
            contentView.setText(message.getData().toString());
            contentView.setOnClickListener(null);
        }
        if(Message.MSG_TYPE_FILE.equals(((LocalMessage) o).getType())){
            JSONObject data = (JSONObject) message.getData();
            String fileName = data.getString("fileName");
            contentView.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);
            contentView.setTextColor(getContext().getResources().getColor(R.color.bkim_common_blue));
            contentView.setText(fileName);
        }
    }
}
