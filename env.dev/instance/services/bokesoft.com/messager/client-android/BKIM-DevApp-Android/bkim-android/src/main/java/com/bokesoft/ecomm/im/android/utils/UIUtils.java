package com.bokesoft.ecomm.im.android.utils;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

public class UIUtils {
    public static void alert(Context ctx, String title, String msg){
        AlertDialog.Builder bd = new AlertDialog.Builder(ctx);
        bd.setTitle(title);
        bd.setMessage(msg);
        bd.setCancelable(true);
        bd.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                //Do nothing
            }
        });
        bd.create();
        bd.show();
    }
}
