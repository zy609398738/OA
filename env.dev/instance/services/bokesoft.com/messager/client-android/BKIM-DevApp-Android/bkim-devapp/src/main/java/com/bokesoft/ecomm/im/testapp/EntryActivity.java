package com.bokesoft.ecomm.im.testapp;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.bokesoft.services.messager.android.AndroidUIFacada;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;

import java.util.ArrayList;
import java.util.List;

/**
 * 测试入口
 */
public class EntryActivity extends AppCompatActivity {
    private static final String PREF_FILE = EntryActivity.class.getName();
    private static final String PREF_NAME_IM_SERVER = "imServer";
    private static final String PREF_NAME_HOST_SERVER = "hostServer";
    private static final String PREF_NAME_CLIENT_ID = "clientId";
    private static final String DEF_VAL_IM_SERVER = "10.0.2.2:7778/boke-messager";
    private static final String DEF_VAL_HOST_SERVER = "10.0.2.2:8080/im-service/${service}.json";
    private static final String DEF_VAL_CLIENT_ID = "boke-test-001";

    protected EditText imSvrAddrView;
    protected EditText hostSvrAddrView;
    protected EditText clientIdView;
    protected EditText toClientIdView;
    protected Button initButton;
    protected Button loadButton;

    private AndroidUIFacada facada;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_entry);

        imSvrAddrView = (EditText) findViewById(R.id.activity_entry_et_im_server_addr);
        hostSvrAddrView = (EditText) findViewById(R.id.activity_entry_et_host_server_addr);
        clientIdView = (EditText) findViewById(R.id.activity_entry_et_clientid);
        toClientIdView = (EditText) findViewById(R.id.activity_entry_et_to_clientid);
        initButton = (Button) findViewById(R.id.activity_entry_btn_init);
        loadButton = (Button) findViewById(R.id.activity_entry_btn_load);

        clientIdView.setKeyListener(null);  //Force readonly
        toClientIdView.setKeyListener(null);  //Force readonly

        //Load Preferences
        SharedPreferences sp = getSharedPreferences(PREF_FILE, Activity.MODE_PRIVATE);
        loadEditTextFromPref(imSvrAddrView, DEF_VAL_IM_SERVER, sp, PREF_NAME_IM_SERVER);
        loadEditTextFromPref(hostSvrAddrView, DEF_VAL_HOST_SERVER, sp, PREF_NAME_HOST_SERVER);
        loadEditTextFromPref(clientIdView, DEF_VAL_CLIENT_ID, sp, PREF_NAME_CLIENT_ID);

        //Click to select test client ID
        clientIdView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSelectItems(clientIdView, null, false);
            }
        });
        //When client id changed, clean to-client-id field
        clientIdView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                //Do nothing
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                //Do nothing
            }
            @Override
            public void afterTextChanged(Editable s) {
                toClientIdView.setText("");
            }
        });
        //Click to select test to-client ID
        toClientIdView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSelectItems(toClientIdView, clientIdView.getText().toString(), true);
            }
        });

        initButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String imSvrAddr = getEditText(imSvrAddrView);
                if (null == imSvrAddr) return;
                String hostSrvAddr = getEditText(hostSvrAddrView);
                if (null == hostSrvAddr) return;
                String clientId = getEditText(clientIdView);
                if (null == clientId) return;

                //Save Preferences
                SharedPreferences sp = getSharedPreferences(PREF_FILE, Activity.MODE_PRIVATE);
                saveEditTextToPref(imSvrAddrView, DEF_VAL_IM_SERVER, sp, PREF_NAME_IM_SERVER);
                saveEditTextToPref(hostSvrAddrView, DEF_VAL_HOST_SERVER, sp, PREF_NAME_HOST_SERVER);
                saveEditTextToPref(clientIdView, DEF_VAL_CLIENT_ID, sp, PREF_NAME_CLIENT_ID);

                //说明:由于测试环境没有时间登录操作, 因此不使用实际登录时得到的 token, 而是使用 IM 服务器 "开发模式"下允许的 token 算法
                String token = "dev-mode-test-token:" + clientId;
                facada.init(imSvrAddr, hostSrvAddr, clientId, token);
                Toast.makeText(EntryActivity.this,
                        "已为用户 '"+clientIdView.getText()+"' 完成 IM 环境的初始化",
                        Toast.LENGTH_LONG).show();
            }
        });
        loadButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String toClientId = toClientIdView.getText().toString().trim();
                if (! TextUtils.isEmpty(toClientId)){
                    facada.openConversationActivity(toClientId);
                }else{
                    facada.startMainActivity();
                }
            }
        });

        facada = new AndroidUIFacada(this);
        facada.setSessionListener(new AndroidUIFacada.SessionListener() {
            @Override
            public void perform(MyActiveConnectData connectedSessionsData, boolean inMainThread) {
                if (inMainThread){
                    int count = connectedSessionsData.getTotal();
                    EntryActivity.this.setTitle("未读消息: "+count

                    );
                }
            }
        });
        facada.setErrorListener(new AndroidUIFacada.ErrorListener() {
            @Override
            public void onError(String errorMessage, Throwable exception, boolean inMainThread) {
                if (inMainThread){
                    Toast.makeText(
                            EntryActivity.this, errorMessage+ (null==exception?"":": "+exception.getMessage()),
                            Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        facada.close();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_entry, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int menuId = item.getItemId();
        AlertDialog.Builder bd;
        switch (menuId){
            case R.id.activity_entry_menu_reset:
                bd = new AlertDialog.Builder(this);
                bd.setTitle("Confirmation");
                bd.setMessage("Do you want to RESET all following fields?");
                bd.setCancelable(true);
                bd.setIcon(R.mipmap.chat);
                bd.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        imSvrAddrView.setText(DEF_VAL_IM_SERVER);
                        hostSvrAddrView.setText(DEF_VAL_HOST_SERVER);
                        clientIdView.setText(DEF_VAL_CLIENT_ID);
                    }
                });
                bd.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Do nothing
                    }
                });
                bd.create();
                bd.show();
                break;
            case R.id.activity_entry_menu_about:
                bd = new AlertDialog.Builder(this);
                bd.setTitle("About");
                bd.setMessage("The Entry for BKMI development.");
                bd.setCancelable(true);
                bd.setIcon(R.mipmap.chat);
                bd.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                bd.create();
                bd.show();
                break;
            default:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    private String getEditText(EditText editor) {
        String text = editor.getText().toString().trim();
        if (TextUtils.isEmpty(text)) {
            Toast.makeText(this, "'" + editor.getHint() + "' is required", Toast.LENGTH_SHORT).show();
            return null;
        }
        return text;
    }
    private void saveEditTextToPref(EditText editor, String defVal, SharedPreferences sp, String prefName){
        SharedPreferences.Editor ed = sp.edit();

        String text = editor.getText().toString().trim();
        if (TextUtils.isEmpty(text) || defVal.equals(text)){
            ed.remove(prefName);
        }else{
            ed.putString(prefName, text);
        }

        ed.commit();
    }
    private void loadEditTextFromPref(EditText editor, String defVal, SharedPreferences sp, String prefName){
        String prefVal = sp.getString(prefName, "").trim();
        if (! TextUtils.isEmpty(prefVal)){
            editor.setText(prefVal);
        }else{
            editor.setText(defVal);
        }
    }

    private void showSelectItems(final EditText editor, String exclude, boolean withEmpty){
        final List<String> items = new ArrayList<String>();
        final String empty = "(No Client ID)";
        if (withEmpty){
            items.add(empty);
        }
        for(int i=1; i<=9; i++){
            String uid = "boke-test-00"+i;
            if (!uid.equals(exclude)){
                items.add(uid);
            }
        }
        AlertDialog.Builder b = new AlertDialog.Builder(this);
        b.setTitle("Select Client ID");
        b.setCancelable(true);
        b.setIcon(R.mipmap.chat);
        b.setItems(items.toArray(new String[0]), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                String cid = items.get(which);
                if (empty.equals(cid)){
                    cid="";
                }
                editor.setText(cid);
            }
        });
        b.create();
        b.show();
    }
}
