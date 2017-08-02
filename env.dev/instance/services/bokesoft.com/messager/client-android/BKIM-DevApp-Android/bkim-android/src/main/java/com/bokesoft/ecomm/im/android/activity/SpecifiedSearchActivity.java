package com.bokesoft.ecomm.im.android.activity;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.IMServiceFacade;
import com.bokesoft.ecomm.im.android.event.StartConversationEvent;
import com.bokesoft.ecomm.im.android.ui.adapter.SpecifiedSearchAdapter;
import com.bokesoft.services.messager.server.model.HistoryMessagesData;

import de.greenrobot.event.EventBus;

/**
 * Created by Administrator on 2017/2/6.
 * 展示指定ID的聊天记录的Activity
 */

public class SpecifiedSearchActivity extends AppCompatActivity implements View.OnClickListener {
    private SpecifiedSearchAdapter mSpecifiedSearchAdapter;//聊天记录的适配器
    private RecyclerView mRecyclerView;
    private TextView searchId;
    private LinearLayout lienar;
    private ImageView back;
    private Button himChat;
    private String peerId = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_specific_search_layout);
        initViews();

    }

    private void initViews() {
        himChat = (Button) findViewById(R.id.tv_chat);
        himChat.setOnClickListener(this);
        mRecyclerView = (RecyclerView) findViewById(R.id.rv_specific);
        searchId = (TextView) findViewById(R.id.id_specific_content);
        lienar = (LinearLayout) findViewById(R.id.id_specific_back);
        lienar.setOnClickListener(this);
        back = (ImageView) findViewById(R.id.iv_specific_back);
        back.setOnClickListener(this);
        String receiver_peerId = getIntent().getStringExtra("receiver_ID");
        String shender_peerId = getIntent().getStringExtra("sender_ID");
        String receiver_Name = getIntent().getStringExtra("ReceiverName");
        String shender_Name = getIntent().getStringExtra("SenderName");

        if (receiver_peerId != null) {
            peerId = receiver_peerId;
            if (receiver_Name != null) {
                searchId.setText("与  " + receiver_Name + "  的聊天记录");
            } else {
                searchId.setText("与  " + peerId + "  的聊天记录");
            }
        } else {
            peerId = shender_peerId;
            if (shender_Name != null) {
                searchId.setText("与  " + shender_Name + "  的聊天记录");
            } else {
                searchId.setText("与  " + peerId + "  的聊天记录");
            }
        }


        searchHistoryData(peerId);//获取数据
        mSpecifiedSearchAdapter = new SpecifiedSearchAdapter(this, null, R.layout.bkim_history_record_item);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
    }

    /**
     * 获取指定用户的聊天记录
     */
    private void searchHistoryData(String peerId) {
        long timestmp = Long.parseLong(getIntent().getStringExtra("startTime"));
        IMServiceFacade.queryHistory(this, null, timestmp, peerId, new IMServiceFacade.QueryHistoryCallback() {
            @Override
            public void perform(HistoryMessagesData data) {
                if (!data.equals("")) {
                    mSpecifiedSearchAdapter.mData = data.getMessages();
                    mRecyclerView.setAdapter(mSpecifiedSearchAdapter);
                    mSpecifiedSearchAdapter.notifyDataSetChanged();
                }
            }
        });

    }

    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.id_specific_back || view.getId() == R.id.iv_specific_back) {
            this.finish();
        }
        if (view.getId() == R.id.tv_chat) {//聊天的点击事件
            if (peerId != null) {
                EventBus.getDefault().post(new StartConversationEvent(peerId));
            }
        }
    }
}
