package com.bokesoft.ecomm.im.android.activity;

import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.ui.adapter.SpinerAdapter;
import com.bokesoft.ecomm.im.android.ui.view.ContactFragment;
import com.bokesoft.ecomm.im.android.ui.view.ConversationListFragment;
import com.bokesoft.ecomm.im.android.ui.widget.SpinerPopWindow;
import com.bokesoft.ecomm.im.android.utils.HttpHelper;
import com.loopj.android.http.RequestParams;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements SpinerAdapter.IOnItemSelectListener {
    private boolean onRunning = false;

    private Toolbar toolbar;
    private ViewPager viewPager;
    private TabLayout tabLayout;
    TextView title;
    private ImageView ivBack;//返回
    private ImageView mState;//是否在线的状态图标
    private SpinerAdapter mAdapter;
    private List<String> mListType = new ArrayList<String>();
    private SpinerPopWindow mSpinerPopWindow;
    private RelativeLayout mUser_state;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_activity_main);
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        viewPager = (ViewPager) findViewById(R.id.pager);
        tabLayout = (TabLayout) findViewById(R.id.tablayout);
        ivBack = (ImageView) findViewById(R.id.iv_title_back);
        title = (TextView) findViewById(R.id.tv_title);
        mState = (ImageView) findViewById(R.id.iv_online_state_tag);//状态图片
        mUser_state = (RelativeLayout) findViewById(R.id.user_state);
        mUser_state.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showSpinWindow();
            }
        });
        title.setText(R.string.main_activity_title);
        setSupportActionBar(toolbar);
        initTabLayout();
        ivBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        //初始化数据
        initData();
    }

    private void initData() {
        String[] names = {"在线", "忙碌", "隐身", "离开"};
        for (int i = 0; i < names.length; i++) {
            mListType.add(names[i]);
        }
        mAdapter = new SpinerAdapter(this, mListType);
        mAdapter.refreshData(mListType, 0);
        //初始化PopWindow的数据
        mSpinerPopWindow = new SpinerPopWindow(this);
        mSpinerPopWindow.setAdapter(mAdapter);
        mSpinerPopWindow.setItemListener(this);
    }

    private void showSpinWindow() {
        mSpinerPopWindow.setWidth(160);
        mSpinerPopWindow.showAsDropDown(mState);
    }

    private void initTabLayout() {
        String[] tabList = new String[]{"会话", "联系人"};
        final Fragment[] fragmentList = new Fragment[]{
                new ConversationListFragment(),
                new ContactFragment()
        };

        tabLayout.setTabMode(TabLayout.MODE_FIXED);
        for (int i = 0; i < tabList.length; i++) {
            tabLayout.addTab(tabLayout.newTab().setText(tabList[i]));
        }

        TabFragmentAdapter adapter = new TabFragmentAdapter(getSupportFragmentManager(),
                Arrays.asList(fragmentList), Arrays.asList(tabList));
        viewPager.setAdapter(adapter);
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });
        tabLayout.setupWithViewPager(viewPager);
    }

    @Override
    public void onItemClick(int i) {
        ClientInstance ci = ClientInstance.getInstance();
        final String url = ci.getServiceStateUrl();
        if (i >= 0 && i <= mListType.size()) {

            RequestParams p = new RequestParams();
            Map<String, String> map = new HashMap<>();
            p.put(ClientInstance.PARAM_NAME_TOKEN, ci.getClientToken());

            switch (i) {
                case 0://在线  就是这里我把online传到后台 可是没有用
                    mState.setImageResource(R.drawable.bkim_eog);
                    map.put("userCode1", "online");//online在线的状态
                    break;
                case 1://忙碌
                    mState.setImageResource(R.drawable.bkim_enu);
                    map.put("userCode1", "busy");//busy

                    break;
                case 2://隐身
                    mState.setImageResource(R.drawable.bkim_evf);
                    map.put("userCode1", "lurk");//lurk
                    break;
                case 3://离开
                    mState.setImageResource(R.drawable.bkim_eys);
                    map.put("userCode1", "idle");//idle
                default:
                    break;
            }

            p.put("data", JSON.toJSONString(map));
            HttpHelper.post(MainActivity.this, url, p, new HttpHelper.HttpCallback() {
                @Override
                public Object perform(String data) {
                    Log.e("data=====", data);
                    return data;
                }
            });
        }
    }

    public class TabFragmentAdapter extends FragmentStatePagerAdapter {

        private List<Fragment> mFragments;
        private List<String> mTitles;

        public TabFragmentAdapter(FragmentManager fm, List<Fragment> fragments, List<String> titles) {
            super(fm);
            mFragments = fragments;
            mTitles = titles;
        }

        @Override
        public Fragment getItem(int position) {
            return mFragments.get(position);
        }

        @Override
        public int getCount() {
            return mFragments.size();
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return mTitles.get(position);
        }
    }

    @Override
    protected void onStart() {
        onRunning = true;
        super.onStart();
    }

    @Override
    protected void onStop() {
        onRunning = false;
        super.onStop();
    }
}
