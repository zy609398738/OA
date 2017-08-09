package com.bokesoft.ecomm.im.android.activity;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.event.StartConversationEvent;
import com.bokesoft.ecomm.im.android.model.UserInfo;

import org.apache.commons.lang3.StringUtils;

import de.greenrobot.event.EventBus;

/**
 * 查找好友的Activity
 */
public class AddConversionPopupActivity extends Activity {
    private EditText txtAddPeerId;
    private TextView lblErrorMsg;
    private TextView btnOK;
    private TextView btnCancel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.bkim_search_friend_item);

        initView();
    }

    private void initView() {
        txtAddPeerId = (EditText) findViewById(R.id.et_friend_id);
        lblErrorMsg = (TextView) findViewById(R.id.tv_error_msg);

        lblErrorMsg.setVisibility(View.GONE);

        btnOK = (TextView) findViewById(R.id.tv_start_dialogue);
        btnOK.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lblErrorMsg.setVisibility(View.GONE);

                String peerId = txtAddPeerId.getText().toString();
                if (StringUtils.isNotEmpty(peerId)) {
                    startSession(peerId);
                } else {
                    error("请输入好友编号");
                }
            }
        });
        btnCancel = (TextView) findViewById(R.id.tv_cancel);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AddConversionPopupActivity.this.finish();
            }
        });
    }

    private void error(String msg){
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
        lblErrorMsg.setText(msg);
        lblErrorMsg.setVisibility(View.VISIBLE);
    }

    private void startSession(final String peerId) {
        HostServiceFacade.prepareUserInfo(this, new String[]{peerId}, new HostServiceFacade.PrepareUserInfoCallback() {
            @Override
            public void perform(HostServiceFacade.UserInfoProvider provider) {
                UserInfo user = provider.getUserInfo(peerId);
                if (null==user){
                    error("找不到编号为 '"+peerId+"' 的用户");
                }else{
                    EventBus.getDefault().post(new StartConversationEvent(peerId));
                    AddConversionPopupActivity.this.finish();
                }
            }
        });
    }
}
