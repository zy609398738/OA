package com.bk_oa_app.im;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

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
    private AndroidUIFacada facada;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initViews();
    }

    private void initViews() {
        facada = new AndroidUIFacada(this);
//        获取当前用户ID
        String token = getIntent().getStringExtra("token");
        String Code = getIntent().getStringExtra("Code");
        //初始化
        if (token != null && Code!=null) {
            facada.init(ServerImUrl.DEF_VAL_IM_SERVER, ServerImUrl.DEF_VAL_HOST_SERVER, Code, token);
            if (facada.isReady()) {
                facada.startMainActivity();
            } else {
                Toast.makeText(this, "当前用户没有登录", Toast.LENGTH_LONG).show();
            }
        } else {
            Toast.makeText(this, "当前用户Code为空", Toast.LENGTH_LONG).show();
            this.finish();
        }
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        facada.close();
        this.finish();
    }
}
