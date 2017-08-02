package com.bokesoft.ecomm.im.android.activity;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.AnimationDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.webkit.MimeTypeMap;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.bokesoft.ecomm.im.android.utils.NormalPictureLoader;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

import java.io.File;
import java.util.Locale;

import static com.bokesoft.ecomm.im.android.utils.BKIMLocalCacheUtils.downloadFileAsync;

/**
 * 图片详情页，聊天时点击图片则会跳转到此页面
 */
public class ImageActivity extends AppCompatActivity {

    private ImageView imageView;
    private Button button;
    private ImageView back;
    private AnimationDrawable aniDraw;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_chat_image_brower_layout);
        imageView = (ImageView) findViewById(R.id.imageView);
        button = (Button) findViewById(R.id.button_image);

        imageView.setBackgroundResource(R.drawable.bkim_loading_image_file);
        aniDraw = (AnimationDrawable) imageView.getBackground();
        aniDraw.start();

        back = (ImageView) findViewById(R.id.iv_image_back);
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        String uri = getIntent().getStringExtra(BKIMConstants.IMAGE_URL) + "&resize=preview";
        new NormalPictureLoader().getPicture(uri, imageView);
        Intent intent = getIntent();
        String fileName = intent.getStringExtra(BKIMConstants.FILE_NAME);
        final String fileUrl = intent.getStringExtra(BKIMConstants.IMAGE_URL);
        final String folderPath = Environment.getExternalStorageDirectory().getPath() + "/Download";
        File file = new File(folderPath);
        if(!file.exists()){
            file.mkdir();
        }
        final String inPath = folderPath + "/" +fileName +".png";
        //此按钮是下载和打开文件一起作用
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                verifyStoragePermissions(ImageActivity.this);
                //下载文件
                downloadFileAsync(fileUrl, inPath);
                //打开文件
                String ext = inPath.substring(inPath.lastIndexOf(".")).toLowerCase(Locale.US);
                try {
                    MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
                    String temp = ext.substring(1);
                    String mime = mimeTypeMap.getMimeTypeFromExtension(temp);
                    Intent intentOpenFile = new Intent();
                    intentOpenFile.addCategory("android.intent.category.DEFAULT");
                    intentOpenFile.addFlags (Intent.FLAG_ACTIVITY_NEW_TASK);
                    intentOpenFile.setAction(Intent.ACTION_VIEW);
                    File file = new File(inPath);
                    intentOpenFile.setDataAndType(Uri.fromFile(file),mime);
                    startActivity(intentOpenFile);
                } catch (Exception e) {
                    LogUtils.logException(e);
                    Toast.makeText(ImageActivity.this, "无法打开后缀名为." + ext + "的文件！", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }

    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.ACCESS_NETWORK_STATE,
            Manifest.permission.INTERNET,
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static void verifyStoragePermissions(Activity activity) {
        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permission != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, PERMISSIONS_STORAGE, REQUEST_EXTERNAL_STORAGE);
        }
    }

}
