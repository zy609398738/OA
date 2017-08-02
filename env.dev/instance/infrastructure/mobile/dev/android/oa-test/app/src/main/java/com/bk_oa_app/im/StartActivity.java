package com.bk_oa_app.im;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.bokesoft.services.messager.android.AndroidUIFacada;

/**
 * <pre>
 *     author : yyh
 *     time :  2017/7/19 16:32
 *     version: 1.0
 *     desc   : 启动IM的类
 * </pre>
 */
public class StartActivity extends AppCompatActivity {
    private static final String DEF_VAL_IM_SERVER = "dev.bokesoft.com:7778/boke-messager";
    private static final String DEF_VAL_HOST_SERVER = "dev.bokesoft.com:20242/yigo/im-service/buddies.action";
    private static String DEF_VAL_CLIENT_ID = null;

    private AndroidUIFacada facada;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initViews();
    }

    private void initViews() {
        //获取当前用户ID
        DEF_VAL_CLIENT_ID = getIntent().getStringExtra("ClientID");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        this.finish();
    }
}
