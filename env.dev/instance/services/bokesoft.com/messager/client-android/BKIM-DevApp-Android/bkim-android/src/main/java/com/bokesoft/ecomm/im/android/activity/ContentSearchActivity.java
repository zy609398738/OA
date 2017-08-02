package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.ui.adapter.baseadapter.SeekContactPeopleAdapter;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/1/6.
 * 搜索聊天内容
 */

public class ContentSearchActivity extends AppCompatActivity implements View.OnClickListener {
    private ImageView mBack;
    private LinearLayout mFl_back;
    private EditText chatContent;//搜索内容
    private RelativeLayout emptyContent;//清空搜索框内容
    private LinearLayout layout;
    private List<GroupInfo> groupList = new ArrayList<>();
    private List<GroupInfo.User> groupUsersList = new ArrayList<>();
    private RecyclerView recycerView;
    private SeekContactPeopleAdapter contactPeopleAdapter;
    private TextView content;//显示的搜索内容

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏tilte
        setContentView(R.layout.bkim_content_search_layout);
        initViews();
        initEvent();
    }

    private void initEvent() {
        chatContent.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                String keywords = chatContent.getText().toString();
                if (keywords.equals("")) {
                    layout.setVisibility(View.GONE);
                    Toast.makeText(ContentSearchActivity.this, "请输入搜索内容", Toast.LENGTH_LONG).show();
                } else {
                    //显示要搜索的内容
                    layout.setVisibility(View.VISIBLE);
                    content.setText("搜索历史:  " + keywords);
                    //获取联系人
                    httpdata(keywords);
                    contactPeopleAdapter.notifyDataSetChanged();
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

    private void initViews() {
        recycerView = (RecyclerView) findViewById(R.id.rc_contact_people);
        contactPeopleAdapter = new SeekContactPeopleAdapter(this, null, R.layout.bkim_seek_contact_people_layout);
        recycerView.setLayoutManager(new LinearLayoutManager(this));
        chatContent = (EditText) findViewById(R.id.search_content);
        emptyContent = (RelativeLayout) findViewById(R.id.close_content);
        emptyContent.setOnClickListener(this);
        layout = (LinearLayout) findViewById(R.id.content_layout);
        layout.setOnClickListener(this);
        mBack = (ImageView) findViewById(R.id.iv_back);//返回
        mBack.setOnClickListener(this);
        mFl_back = (LinearLayout) findViewById(R.id.fl_back);
        mFl_back.setOnClickListener(this);

        content = (TextView) findViewById(R.id.tv_according_content);
        content.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.fl_back || view.getId() == R.id.iv_back) {
            this.finish();
        } else if (view.getId() == R.id.close_content) {
            //清空搜索框的内容
            chatContent.getText().clear();
            layout.setVisibility(View.GONE);//影藏布局
        } else if (view.getId() == R.id.content_layout || view.getId() == R.id.tv_according_content) {
            Intent intent = new Intent();
            intent.setClass(ContentSearchActivity.this, HistorySearchActivity.class);
            intent.putExtra(BKIMConstants.EXTRA_HISTORY_SEARCH_KEYWORDS, chatContent.getText().toString());
            startActivity(intent);
            this.finish();
        }
    }


    /**
     * 根据搜索关键字获取联系人
     *
     * @param keywords
     */
    private void httpdata(final String keywords) {
        HostServiceFacade.requestBuddies(this, new HostServiceFacade.BuddiesCallback() {
            @Override
            public void perform(List<GroupInfo> groups) {
                groupList = groups;
                for (GroupInfo g : groups) {
                    for (GroupInfo.User user : g.getUsers()) {
                        if (user.getName().indexOf(keywords) != -1 || user.getCode().indexOf(keywords) != -1)
                            groupUsersList.add(user);

                    }

                }
                /**
                 *  遍历 groupUsersList知道与搜索内容有共同的数据然后给适配器
                 */
                contactPeopleAdapter.mData = groupUsersList;
                recycerView.setAdapter(contactPeopleAdapter);
                contactPeopleAdapter.notifyDataSetChanged();
            }
        });
        contactPeopleAdapter.mData.clear();
    }
}
