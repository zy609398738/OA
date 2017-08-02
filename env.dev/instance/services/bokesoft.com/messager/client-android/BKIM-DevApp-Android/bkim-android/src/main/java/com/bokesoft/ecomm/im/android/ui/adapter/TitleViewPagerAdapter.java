package com.bokesoft.ecomm.im.android.ui.adapter;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import java.util.List;

/**
 * Created by brooker on 2017/1/9.
 * title 的适配器
 */

public class TitleViewPagerAdapter extends FragmentPagerAdapter {
    private List<Fragment> fragments;

    public TitleViewPagerAdapter(FragmentManager fm, List<Fragment> fragments) {
        super(fm);
        this.fragments = fragments;
    }

    @Override
    public int getCount() {
        return fragments.size();
    }

    @Override
    public Fragment getItem(int position) {
        return fragments.get(position);
    }
}
