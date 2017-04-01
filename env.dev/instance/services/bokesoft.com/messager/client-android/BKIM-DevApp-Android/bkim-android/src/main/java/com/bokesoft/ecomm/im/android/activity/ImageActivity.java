package com.bokesoft.ecomm.im.android.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.ImageView;

import com.bokesoft.ecomm.im.android.ui.viewholder.NormalLoadPictrue;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;

/**
 * 图片详情页，聊天时点击图片则会跳转到此页面
 */
public class ImageActivity extends AppCompatActivity {

    private ImageView imageView;
    private ImageView ivImageBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bkim_chat_image_brower_layout);
        imageView = (ImageView) findViewById(R.id.imageView);
        ivImageBack = (ImageView) findViewById(R.id.iv_image_back);

        ivImageBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        Intent intent = getIntent();
        String uri = intent.getStringExtra(BKIMConstants.IMAGE_URL);
        new NormalLoadPictrue().getPicture(uri, imageView);
    }
}
