package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.ui.adapter.TitleViewPagerAdapter;
import com.bokesoft.ecomm.im.android.ui.view.ContactFragment;
import com.bokesoft.ecomm.im.android.ui.view.ConversationListFragment;
import com.bokesoft.ecomm.im.android.ui.widget.TabNavitationLayout;

import java.util.ArrayList;
import java.util.List;

//FIXME：自动更新当前用户状态未实现
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private ImageView findSeekAdd;//快速查找聊天
    private ImageView search;//搜索
    private ImageView imgState;//是否在线的状态图标
    private String state = null;
    private TabNavitationLayout tabNavitationLayout;
    private TitleViewPagerAdapter viewPagerAdapter;
    private List<Fragment> titleFragments;
    private ViewPager viewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏tilte
        setContentView(R.layout.bkim_activity_main);
//        StatusBarUtil.setColor(this,getResources().getColor(R.color.blue_0));//设置状态栏的颜色
        initView();//初始化方法
    }

    private void initView() {
        String[] title = new String[]{"会话", "联系人"};
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
                R.color.blue, 16, 0, 1f, true);
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
