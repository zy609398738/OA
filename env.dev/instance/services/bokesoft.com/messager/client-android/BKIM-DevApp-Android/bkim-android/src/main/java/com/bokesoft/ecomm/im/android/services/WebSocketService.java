package com.bokesoft.ecomm.im.android.services;

import android.app.Activity;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.bokesoft.ecomm.im.android.backend.WebSocketFacade;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.utils.LogUtils;

import de.greenrobot.event.EventBus;

public class WebSocketService extends Service {
    public static final void resetWebSocketService(Activity activity, String toClientId){
        ClientInstance.getInstance().switchToClient(toClientId);
        Intent intent = new Intent(activity, WebSocketService.class);
        activity.startService(intent);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onDestroy() {
        EventBus.getDefault().unregister(this);
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        WebSocketFacade.getInstance().startNewConnect();
        return START_REDELIVER_INTENT;
    }

    public void onEvent(WebSocketEvent event){
        if (WebSocketEvent.TYPE_MESSAGE == event.getType()){
            LogUtils.i("Message received: " + event.getMessage());
        }
    }
}
