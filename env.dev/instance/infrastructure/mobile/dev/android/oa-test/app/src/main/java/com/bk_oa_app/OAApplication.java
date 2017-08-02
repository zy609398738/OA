package com.bk_oa_app;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.bk_oa_app.im.EntryIM;
import com.bokesoft.yeslibrary.app.DefaultApplication;
import com.bokesoft.yeslibrary.ui.form.builder.UIBuilderMap;
import com.bokesoft.yeslibrary.ui.form.builder.internal.component.MapBuilder;
import com.bokesoft.yeslibrary.ui.form.function.parser.ViewFunctionImplMap;

/**
 * <pre>
 *     author : yyh
 *     time :  2017/7/13 10:38
 *     version: 1.0
 *     desc   : 描述XXXX
 * </pre>
 * DefaultApplication
 */
public class OAApplication extends DefaultApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        UIBuilderMap.mapCls = new MapBuilder().getClass();
        ViewFunctionImplMap.getViewInstance().regFunctionImplCluster(new EntryIM());
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(OAApplication.this);
    }
}
