package com.bk_oa_app;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.bokesoft.yeslibrary.app.AppInterface;

import static com.bokesoft.yeslibrary.app.AppInterface.ACTION_INIT_PUBLISH;
import static com.bokesoft.yeslibrary.app.AppInterface.ACTION_INIT_RECEIVER;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    AppInitProgressReceiver receiver;
    StartAppReceiver startAppReceiver;
    public static final int REQUEST_GUILE = 100;
    EditText et;
    TextView tv;
    Button btn;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();//初始化

    }

    private void initView() {
        tv = (TextView) findViewById(R.id.tv_launch_show);
        et = (EditText) findViewById(R.id.et_server_ip);
        btn = (Button) findViewById(R.id.but_start);
        btn.setOnClickListener(this);
        String url = getPreferences(Context.MODE_PRIVATE).getString("URL", null);
        if (TextUtils.isEmpty(url)) {
            et.setText(BuildConfig.URL);
        } else {
            et.setText(url);
            if (!BuildConfig.DEBUG) {
                et.setVisibility(View.GONE);
                btn.setVisibility(View.GONE);
                if (getPreferences(Context.MODE_PRIVATE).getInt("VERSION_CODE", 0) != BuildConfig.VERSION_CODE) {
                    //显示引导界面
                    //TODO 显示引导界面的同时，可以同时进行服务的初始化
                    if (BuildConfig.guideImages.length > 0)
                        startActivityForResult(new Intent(this, AppGuideActivity.class), REQUEST_GUILE);
                    else
                        startYigo(BuildConfig.URL);
                } else {
                    startYigo(BuildConfig.URL);
                }
            }
//            startYigo(BuildConfig.URL);
            receiver = new AppInitProgressReceiver();
            startAppReceiver = new StartAppReceiver();
        }
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
        broadcastManager.registerReceiver(receiver, inf);
        IntentFilter inf2 = new IntentFilter(ACTION_INIT_RECEIVER);
        broadcastManager.registerReceiver(startAppReceiver, inf2);
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

    @Override
    public void onClick(View v) {
        getPreferences(Context.MODE_PRIVATE).edit().putString("URL", et.getText().toString()).apply();
        startYigo(BuildConfig.URL);
    }

    void startYigo(String url) {
        Intent intent = AppInterface.initServiceIntent(this, url, 600);
        startService(intent);
    }

}
