package com.bokesoft.ecomm.im.android.ui.widget;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.Toast;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.ui.adapter.SpinerAdapter;
import com.bokesoft.ecomm.im.android.ui.adapter.SpinerAdapter.IOnItemSelectListener;
/**
 * Created by brook on 2016/12/14.
 * 弹出的下拉列表
 */

public class SpinerPopWindow extends PopupWindow implements AdapterView.OnItemClickListener {
    private Context mContext;
    private ListView mListView;
    private SpinerAdapter mAdapter;
    private IOnItemSelectListener mItemSelectListener;

    public SpinerPopWindow(Context context) {
        super(context);
        mContext = context;
        init();
    }
    public void setItemListener(IOnItemSelectListener listener){
        mItemSelectListener = listener;
    }

    public void setAdapter(SpinerAdapter adapter){
        mAdapter = adapter;
        mListView.setAdapter(mAdapter);
    }

    private void init() {
        View view = LayoutInflater.from(mContext).inflate(R.layout.bkim_spiner_layout, null);
        setContentView(view);
        setWidth(ViewGroup.LayoutParams.WRAP_CONTENT);
        setHeight(ViewGroup.LayoutParams.WRAP_CONTENT);

        setFocusable(true);
        ColorDrawable dw = new ColorDrawable(0x00);
        setBackgroundDrawable(dw);
        mListView = (ListView) view.findViewById(R.id.spiner_listview);
        mListView.setOnItemClickListener(this);
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
        if (mItemSelectListener != null) {
            mItemSelectListener.onItemClick(i);
        }
        dismiss();//关闭下拉列表
    }
}
