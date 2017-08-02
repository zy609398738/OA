package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.ecomm.im.android.ui.view.ConversationFragment;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

/**
 * 会话详情页
 * 包含会话的创建以及拉取，具体的 UI 细节在 ConversationFragment 中
 */
public class ConversationActivity extends AppCompatActivity {
    protected ConversationFragment conversationFragment;
    private TextView title;
    private LinearLayout back;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏Tile
        setContentView(R.layout.bkim_conversation_activity);
        conversationFragment = (ConversationFragment) getSupportFragmentManager().findFragmentById(R.id.fragment_chat);
        initView();
        initTitle(getIntent());
    }

    private void initView() {
        title = (TextView) findViewById(R.id.id_title);
        back = (LinearLayout) findViewById(R.id.ll_back);
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    private void initTitle(Intent intent) {
        Bundle extras = intent.getExtras();
        if (null != extras) {
            if (extras.containsKey(BKIMConstants.PEER_ID)) {
                final String userCode = extras.getString(BKIMConstants.PEER_ID);
                HostServiceFacade.prepareUserInfo(
                        ConversationActivity.this, new String[]{userCode},
                        new HostServiceFacade.PrepareUserInfoCallback() {
                            @Override
                            public void perform(HostServiceFacade.UserInfoProvider provider) {
                                UserInfo user = provider.getUserInfo(userCode);
                                updateConversation(user);
                            }
                        });
            } else {
                showToast("需要使用 '" + BKIMConstants.PEER_ID + "' 指定交谈对象的ID");
                finish();
            }
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (android.R.id.home == item.getItemId()) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    /**
     * 主动刷新 UI
     *
     * @param conversation
     */
    protected void updateConversation(UserInfo conversation) {
        if (null != conversation) {
            conversationFragment.setConversation(conversation);
            if (conversation.getUserName() == null) {
                title.setText(conversation.getUserCode());
            } else {
                title.setText(conversation.getUserName());
            }
        }
    }

    /**
     * 弹出 toast
     *
     * @param content
     */
    private void showToast(String content) {
        Toast.makeText(ConversationActivity.this, content, Toast.LENGTH_SHORT).show();


    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }
}