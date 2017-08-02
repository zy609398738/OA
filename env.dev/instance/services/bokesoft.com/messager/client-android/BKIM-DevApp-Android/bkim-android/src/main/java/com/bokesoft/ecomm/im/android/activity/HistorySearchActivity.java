package com.bokesoft.ecomm.im.android.activity;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.IMServiceFacade;
import com.bokesoft.ecomm.im.android.ui.adapter.HistorySearchResultAdapter;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.services.messager.server.model.HistoryMessagesData;

/**
 * Created by brook on 2016/12/21.
 * 搜索消息记录的Activity
 */

public class HistorySearchActivity extends AppCompatActivity implements View.OnClickListener, SwipeRefreshLayout.OnRefreshListener {
    private ImageView mBack;
    private LinearLayout mFl_back;
    private HistorySearchResultAdapter mChatRecorAdapter;//聊天记录的适配器
    private RecyclerView mRecyclerView;
    private SwipeRefreshLayout refreshLayout;
    private long prevtime;
    private String keywords;
    private int limits;

    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    updataData(prevtime);
                    break;
            }
        }

        /**
         * 跟新数据的方法
         *
         * @param prevtime
         */
        private void updataData(long prevtime) {
            if (prevtime != 0) {
                IMServiceFacade.queryHistory(HistorySearchActivity.this, null, prevtime, null, new IMServiceFacade.QueryHistoryCallback() {
                    @Override
                    public void perform(HistoryMessagesData data) {
                        mChatRecorAdapter.mData = data.getMessages();
                        mRecyclerView.setAdapter(mChatRecorAdapter);
                        mChatRecorAdapter.notifyDataSetChanged();
                        limits = data.getLimits();
                        refreshLayout.setRefreshing(false);
                        if (limits == data.getLimits()) {
                            Toast.makeText(HistorySearchActivity.this, "已经是最新了", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        }


    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏Title
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_search_friend_activity_layout);
        initView();//初始化
    }

    private void initView() {
        keywords = getIntent().getStringExtra(BKIMConstants.EXTRA_HISTORY_SEARCH_KEYWORDS);
        mBack = (ImageView) findViewById(R.id.iv_back);//返回
        mBack.setOnClickListener(this);
        mFl_back = (LinearLayout) findViewById(R.id.fl_back);
        mFl_back.setOnClickListener(this);
        refreshLayout = (SwipeRefreshLayout) findViewById(R.id.history_chat_srl_pullrefresh);
        searchHistory();//获取数据
        mRecyclerView = (RecyclerView) findViewById(R.id.rv_chat_record);
        mChatRecorAdapter = new HistorySearchResultAdapter(this, null, R.layout.bkim_history_record_item);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        //改变加载显示的颜色
        refreshLayout.setColorSchemeColors(Color.RED, Color.RED);
        //设置初始值的大小
        refreshLayout.setSize(SwipeRefreshLayout.LARGE);
        //设置监听
        refreshLayout.setOnRefreshListener(this);
        //设置向下拉多少出现刷新
        refreshLayout.setDistanceToTriggerSync(80);
        //设置刷新出现的位置
        refreshLayout.setProgressViewEndTarget(false, 200);

    }

    /**
     * 请求有关键字的所有聊天内容
     */
    private void searchHistory() {
        if (keywords != null) {
            IMServiceFacade.queryHistory(HistorySearchActivity.this, keywords, null, null, new IMServiceFacade.QueryHistoryCallback() {
                @Override
                public void perform(HistoryMessagesData data) {
                    mChatRecorAdapter.mData = data.getMessages();
                    prevtime = data.getPrevPageTimestamp();
                    mRecyclerView.setAdapter(mChatRecorAdapter);
                    mChatRecorAdapter.notifyDataSetChanged();
                }
            });
        }
    }


    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.fl_back || view.getId() == R.id.iv_back) {
            this.finish();
        }
    }

    @Override
    public void onRefresh() {
        new Thread() {
            @Override
            public void run() {
                try {
                    sleep(1500);
                    Message masg = new Message();
                    masg.what = 1;
                    handler.sendMessage(masg);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }.start();

    }


}
