package com.bokesoft.ecomm.im.android.ui.widget;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.bokesoft.ecomm.im.android.R;

/**
 * Created by brook on 2016/12/13.
 * 自定义标题栏
 */

public class TitleLayout extends LinearLayout {
    ImageView mback;

    public TitleLayout(Context context, AttributeSet attrs) {
        super(context, attrs);

        LayoutInflater.from(context).inflate(R.layout.bkim_activity_file_tool_bar, this);//初始化布局

        initView(); //初始化组件
    }
    private void initView() {
        mback = (ImageView) findViewById(R.id.iv_file_back);
        mback.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ((Activity)getContext()).finish();
            }
        });
    }
}
