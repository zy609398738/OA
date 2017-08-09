package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.IMServiceFacade;
import com.bokesoft.ecomm.im.android.event.StartConversationEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.ui.adapter.SpinerAdapter;
import com.bokesoft.ecomm.im.android.ui.adapter.TitleViewPagerAdapter;
import com.bokesoft.ecomm.im.android.ui.view.ContactFragment;
import com.bokesoft.ecomm.im.android.ui.view.ConversationListFragment;
import com.bokesoft.ecomm.im.android.ui.widget.SpinerPopWindow;
import com.bokesoft.ecomm.im.android.ui.widget.TabNavitationLayout;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import de.greenrobot.event.EventBus;

//FIXME：自动更新当前用户状态未实现
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private ImageView findSeekAdd;//快速查找聊天
    private ImageView search;//搜索
    private ImageView imgState;//是否在线的状态图标
    private SpinerPopWindow spinerPopWindow;
    private String state = null;
    private FrameLayout flSettingStart;//设置用户在状态
    private TabNavitationLayout tabNavitationLayout;
    private TitleViewPagerAdapter viewPagerAdapter;
    private List<Fragment> titleFragments;
    private ViewPager viewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏tilte
        setContentView(R.layout.bkim_activity_main);
        initView();//初始化方法
        initevent();
        initStateSpiner();//初始化数据
    }


    private void initevent() {
        flSettingStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                spinerPopWindow.setWidth(160);
                spinerPopWindow.showAsDropDown(imgState);
            }
        });
    }

    private void initView() {
        String[] title = new String[]{"会话", "联系人"};
        flSettingStart = (FrameLayout) findViewById(R.id.fl_setting_start);
        imgState = (ImageView) findViewById(R.id.imge_start);
        findSeekAdd = (ImageView) findViewById(R.id.image_add);
        findSeekAdd.setOnClickListener(this);
        search = (ImageView) findViewById(R.id.image_search);
        search.setOnClickListener(this);
        tabNavitationLayout = (TabNavitationLayout) findViewById(R.id.navation_bar);
        viewPager = (ViewPager) findViewById(R.id.pager);
        titleFragments = new ArrayList<>();

        titleFragments.add(new ConversationListFragment());//会话
        titleFragments.add(new ContactFragment());//联系人
        viewPagerAdapter = new TitleViewPagerAdapter(getSupportFragmentManager(), titleFragments);
        viewPager.setAdapter(viewPagerAdapter);
        tabNavitationLayout.setViewPager(this, title, viewPager,
                R.drawable.drawable_left,
                0,
                R.drawable.drawable_right,
                R.color.whites,
                R.color.colorAccent, 16, 0, 1f, true);
    }

    private void initStateSpiner() {
        final List<String> stateNames = Arrays.asList(new String[]{"在线", "离开", "隐身", "忙碌"});
        SpinerAdapter adapter = new SpinerAdapter(this, stateNames);
        //初始化PopWindow的数据
        spinerPopWindow = new SpinerPopWindow(this);
        spinerPopWindow.setAdapter(adapter);
        spinerPopWindow.setItemListener(new SpinerAdapter.IOnItemSelectListener() {
            @Override
            public void onItemClick(int i) {
                if (i >= 0 && i <= stateNames.size()) {
                    switch (i) {
                        case 0://在线
                            imgState.setImageResource(R.drawable.icon_online);
                            state = IMServiceFacade.UserStates.ONLINE;
                            break;
                        case 1://离开
                            imgState.setImageResource(R.drawable.icon_idle);
                            state = IMServiceFacade.UserStates.IDLE;
                            break;
                        case 2://隐身
                            imgState.setImageResource(R.drawable.icon_lurk);
                            state = IMServiceFacade.UserStates.LURK;
                            break;
                        case 3://忙碌
                            imgState.setImageResource(R.drawable.icon_busy);
                            state = IMServiceFacade.UserStates.BUSY;
                        default:
                            break;
                    }
                    if (null != state) {
                        IMServiceFacade.UserStates states = new IMServiceFacade.UserStates();
                        states.setState(ClientInstance.getInstance().getClientId(), state);
                        IMServiceFacade.setUserStates(MainActivity.this, states);
                    }
                }
            }
        });
    }

    @Override
    public void onClick(View view) {

        Intent intent = new Intent();
        if (view.getId() == R.id.image_add) {
            intent.setClass(MainActivity.this, AddConversionPopupActivity.class);
        } else if (view.getId() == R.id.image_search) {
            intent.setClass(MainActivity.this, ContentSearchActivity.class);
        }
        startActivity(intent);
    }
}
