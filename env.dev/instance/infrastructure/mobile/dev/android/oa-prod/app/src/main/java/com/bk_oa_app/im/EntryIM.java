package com.bk_oa_app.im;

import android.content.Intent;

import com.bokesoft.yeslibrary.parser.BaseFunImplCluster;
import com.bokesoft.yeslibrary.parser.base.IExecutor;
import com.bokesoft.yeslibrary.ui.form.expr.BaseViewFunctionImpl;
import com.bokesoft.yeslibrary.ui.form.expr.ViewEvalContext;

/**
 * <pre>
 *     author : yyh
 *     time :  2017/7/14 15:24
 *     version: 1.0
 *     desc   : 启动IM需要的一些配置
 *
 * </pre>
 */
public class EntryIM extends BaseFunImplCluster{
    @Override
    public Object[][] getImplTable() {
            return new Object[][]{
                    {"StartIM", new StartPush()}
            };
    }
    private class StartPush extends BaseViewFunctionImpl {

        @Override
        public Object evalImpl(String name, ViewEvalContext context, Object[] args, final IExecutor executor) throws Exception {
           //启动Activity
            context.getAppContext().startActivity(new Intent(context.getForm().getAndroidProxy().getActivity(), IMStartActivity.class));
            return true;
        }
    }
}
