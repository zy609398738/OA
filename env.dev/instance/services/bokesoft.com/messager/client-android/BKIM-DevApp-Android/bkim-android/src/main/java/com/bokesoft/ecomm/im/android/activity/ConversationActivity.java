package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.model.UserInfo;
import com.bokesoft.ecomm.im.android.ui.view.ConversationFragment;

/**
 * 会话详情页
 * 包含会话的创建以及拉取，具体的 UI 细节在 ConversationFragment 中
 */
public class ConversationActivity extends AppCompatActivity {

    protected ConversationFragment conversationFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_conversation_activity);
        conversationFragment = (ConversationFragment) getSupportFragmentManager().findFragmentById(R.id.fragment_chat);
        initByIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        initByIntent(intent);
    }

    private void initByIntent(Intent intent) {
        Bundle extras = intent.getExtras();
        if (null != extras) {
            if (extras.containsKey(BKIMConstants.PEER_ID)) {
                final String userCode = extras.getString(BKIMConstants.PEER_ID);
                HostServiceFacade.prepareUserInfo(
                        ConversationActivity.this, new String[]{userCode},
                        new HostServiceFacade.PrepareUserInfoCallback() {
                            @Override
                            public void perform(HostServiceFacade.UserInfoCache userCodeCache) {
                                UserInfo user = userCodeCache.getUserInfo(userCode);
                                updateConversation(user);
                            }
                        });
            } else {
                showToast("需要使用 '" + BKIMConstants.PEER_ID + "' 指定交谈对象的ID");
                finish();
            }
        }
    }

    /**
     * 设置 actionBar title 以及 up 按钮事件
     *
     * @param title
     */
    protected void initActionBar(String title) {
        ActionBar actionBar = getSupportActionBar();
        if (null != actionBar) {
            if (null != title) {
                actionBar.setTitle(title);
            }
            actionBar.setDisplayUseLogoEnabled(false);
            actionBar.setDisplayHomeAsUpEnabled(true);
            finishActivity(RESULT_OK);
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
            initActionBar(conversation.getUserName());
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
}