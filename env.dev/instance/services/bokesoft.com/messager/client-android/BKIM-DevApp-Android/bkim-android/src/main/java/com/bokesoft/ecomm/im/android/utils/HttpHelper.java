package com.bokesoft.ecomm.im.android.utils;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import java.io.UnsupportedEncodingException;

import cz.msebera.android.httpclient.Header;

/**
 * Wrapper of HttpClient
 */
public class HttpHelper {
    public static void post(final Context context, final String url, final RequestParams params, final HttpCallback callback) {
        AsyncHttpClient client = new AsyncHttpClient();
        LogUtils.i("Requesting: '" + url + "' ...");
        client.post(url, params, new AsyncHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] response) {//这里返回的是200
                try {
                    String data = new String(response, "UTF-8");
                    if (data != null){
                        callback.perform(data);
                    }else {

                    }

                } catch (UnsupportedEncodingException e) {
                    processException(context, url, e);
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] errorResponse, Throwable e) {
                processException(context, url, e);
            }
        });
    }

    public static void processException(Context context, String url, Throwable e) {
        LogUtils.logException(e);
        Toast.makeText(context.getApplicationContext(),
                url + ": " + e.getMessage(), Toast.LENGTH_LONG).show();
        Log.e("josn==", e.getMessage());
    }

    public static interface HttpCallback {
        public Object perform(String data);
    }
}
