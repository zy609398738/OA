package com.bokesoft.ecomm.im.android.utils;

import android.content.Context;
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

    private static void doHttpRequest(final Context context,
                                      final String url, final RequestParams params,
                                      final HttpCallback callback, boolean post) {
        AsyncHttpClient client = new AsyncHttpClient();
        LogUtils.i("Requesting: '" + url + "' ...");
        AsyncHttpResponseHandler responseHandler = new AsyncHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] response) {//这里返回的是200
                try {
                    String data = new String(response, "UTF-8");
                    callback.perform(data);
                } catch (UnsupportedEncodingException e) {
                    processException(context, url, e);
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] errorResponse, Throwable e) {
                processException(context, url, e);
            }
        };
        if (post) {
            client.post(url, params, responseHandler);
        } else {
            client.get(url, params, responseHandler);
        }
    }

    public static void post(final Context context, final String url, final RequestParams params, final HttpCallback callback) {
        doHttpRequest(context, url, params, callback, true);
    }

    public static void get(final Context context, final String url, final RequestParams params, final HttpCallback callback) {
        doHttpRequest(context, url, params, callback, false);
    }

    public static void processException(Context context, String url, Throwable e) {
        LogUtils.logException(e);
        Toast.makeText(context.getApplicationContext(),
                url + ":" + e.getMessage(), Toast.LENGTH_LONG).show();
    }

    public static interface HttpCallback {
        public Object perform(String data);
    }
}
