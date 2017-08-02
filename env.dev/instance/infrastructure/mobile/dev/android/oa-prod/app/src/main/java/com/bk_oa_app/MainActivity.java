package com.bk_oa_app;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import com.bokesoft.yeslibrary.app.AppInterface;

import static com.bokesoft.yeslibrary.app.AppInterface.ACTION_INIT_PUBLISH;
import static com.bokesoft.yeslibrary.app.AppInterface.ACTION_INIT_RECEIVER;
/**
 * <pre>
 *     author : 杨永红
 *     e-mail : 1355857303@qq.com
 *     time   : 2017/7/17/9:55
 *     version: 1.0
 *     desc   : xxxx描述
 * </pre>
 */
public class MainActivity extends AppCompatActivity {
    AppInitProgressReceiver receiver;
    StartAppReceiver startAppReceiver;
    public static final int REQUEST_GUILE = 100;
    TextView tv;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        tv = (TextView) findViewById(R.id.tv_launch_show);
        startYigo(BuildConfig.URL);
        receiver = new AppInitProgressReceiver();
        startAppReceiver = new StartAppReceiver();
    }
    class AppInitProgressReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra(AppInterface.EXTRA_PUBLISH);
            tv.setText(message);
        }
    }

    class StartAppReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            Bundle paras = intent.getExtras();
            if (paras.containsKey(AppInterface.EXTRA_INIT_ERROR)) {
                Exception th = (Exception) paras.getSerializable(AppInterface.EXTRA_INIT_ERROR);
                if (th != null) {
                    th.printStackTrace();
                    tv.setText(th.getMessage());
                }
            } else {
                int formId = intent.getIntExtra(AppInterface.EXTRA_FORM_ID, 0);
                startActivity(AppInterface.startFormIntent(formId));
                finish();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        LocalBroadcastManager broadcastManager = LocalBroadcastManager.getInstance(this);
        IntentFilter inf = new IntentFilter(ACTION_INIT_PUBLISH);
        broadcastManager.registerReceiver(receiver,inf);
        IntentFilter inf2 = new IntentFilter(ACTION_INIT_RECEIVER);
        broadcastManager.registerReceiver(startAppReceiver,inf2);
    }

    @Override
    protected void onPause() {
        super.onPause();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(receiver);
        LocalBroadcastManager.getInstance(this).unregisterReceiver(startAppReceiver);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_GUILE) {
            switch (resultCode) {
                case Activity.RESULT_CANCELED:
                    finish();
                    break;
                case Activity.RESULT_OK:
                    getPreferences(Context.MODE_PRIVATE).edit().putInt("VERSION_CODE", BuildConfig.VERSION_CODE).apply();
                    startYigo(BuildConfig.URL);
                    break;
            }
        }
    }
    void startYigo(String url) {
        Intent intent = AppInterface.initServiceIntent(this, url, 600);
        startService(intent);
    }

}
