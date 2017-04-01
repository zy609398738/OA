package com.bokesoft.ecomm.im.android.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.ui.view.ContactFragment;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.utils.LogUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by brook on 2016/12/20.
 * 查找好友的Activity
 */

public class PopupActivity extends Activity implements View.OnClickListener {
    private EditText mFriendSerialnumber;//好友编号
    private TextView mShow;
    private TextView mStartDialogue;//开始对话按钮
    private TextView mScancel;//取消
    List<GroupInfo.User> mListCode = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.search_friend_item);
        //初始化
        initView();
    }

    private void initView() {
        mFriendSerialnumber = (EditText) findViewById(R.id.et_friend_id);
        mShow = (TextView) findViewById(R.id.tv_friend_content);

        mStartDialogue = (TextView) findViewById(R.id.tv_start_dialogue);
        mStartDialogue.setOnClickListener(this);
        mScancel = (TextView) findViewById(R.id.tv_cancel);
        mScancel.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        int i = view.getId();
        if (i == R.id.tv_start_dialogue) {//开始对话的点击事件
            if (!mFriendSerialnumber.getText().toString().isEmpty()) {
                LogUtils.e("内容==", mFriendSerialnumber.getText().toString());
                startdialogue();
            } else {
                Toast.makeText(PopupActivity.this, "请输入好友编号！！", Toast.LENGTH_LONG).show();
            }

        } else if (i == R.id.tv_cancel) {
            this.finish();//取消
        }
    }

    private void startdialogue() {
        String FriendSerialnumberContent = mFriendSerialnumber.getText().toString();
        List<List<GroupInfo.User>> mListChild = ContactFragment.mListChild;
        for (List<GroupInfo.User> userList : mListChild) {
            mListCode.addAll(userList);
        }
        for (GroupInfo.User user : mListCode) {
            if (FriendSerialnumberContent.equals(user.getCode())) {
                Intent intent = new Intent(PopupActivity.this, ConversationActivity.class);
                intent.putExtra(BKIMConstants.PEER_ID, user.getCode());
                startActivity(intent);
                this.finish();
            }else {
                mFriendSerialnumber.getText().clear();
                mShow.setText("用户编号“" + mFriendSerialnumber.getText().toString() + "”无效");
                mShow.setVisibility(View.VISIBLE);
            }
        }


    }
}
