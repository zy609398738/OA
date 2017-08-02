package com.bokesoft.ecomm.im.android.utils;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.AnimationDrawable;
import android.os.Handler;
import android.view.View;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class NormalPictureLoader {
    private String uri;
    private ImageView imageView;
    private byte[] picByte;

    public void getPicture(String uri, ImageView imageView){
        this.uri = uri;
        this.imageView = imageView;
        new Thread(runnable).start();
    }

    @SuppressLint("HandlerLeak")
    Handler handle = new Handler(){
        @Override
        public void handleMessage(android.os.Message msg){
            super.handleMessage(msg);
            if(msg.what==1){
                if(picByte !=null){
                    Bitmap bitmap = BitmapFactory.decodeByteArray(picByte, 0 ,picByte.length);
                    imageView.setImageBitmap(bitmap);
                    imageView.setBackgroundResource(0);
                }
            }
        }
    };

    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            try {
                URL url = new URL(uri);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setReadTimeout(10000);
                if(conn.getResponseCode() == 200){
                    InputStream fis = conn.getInputStream();
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    byte[] bytes = new byte[1024];
                    int length = -1;
                    while ((length = fis.read(bytes)) !=-1){
                        bos.write(bytes, 0 ,length);
                    }
                    picByte = bos.toByteArray();
                    bos.close();
                    fis.close();
                    android.os.Message message = new android.os.Message();
                    message.what = 1;
                    handle.sendMessage(message);
                }
            } catch (MalformedURLException e) {
                LogUtils.logException(e);
            } catch (IOException e) {
                LogUtils.logException(e);
            }
        }
    };

}
