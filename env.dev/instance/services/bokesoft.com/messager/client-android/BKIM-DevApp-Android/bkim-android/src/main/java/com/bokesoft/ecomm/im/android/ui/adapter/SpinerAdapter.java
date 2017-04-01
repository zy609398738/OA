package com.bokesoft.ecomm.im.android.ui.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;

import java.util.List;

/**
 * Created by brooker on 2016/12/14.
 *
 * 下拉列表适配器
 */

public class SpinerAdapter extends BaseAdapter{
    public static interface IOnItemSelectListener{
        public void onItemClick(int i);
    }

    private List<String> mObjects;
    private LayoutInflater mInflater;

    public SpinerAdapter (Context context,List<String> mObjects){
        this.mObjects = mObjects;
        mInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }
    public void refreshData(List<String> objects,int selIndex){
        mObjects = objects;
        if (selIndex < 0){
            selIndex = 0;
        }
        if (selIndex >= mObjects.size()){
            selIndex = mObjects.size() - 1;
        }
    }
    @Override
    public int getCount() {
        return mObjects.size();
    }

    @Override
    public Object getItem(int i) {
        return mObjects.get(i).toString();
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        ViewHolder viewHolder;
        if (view == null){
            view = mInflater.inflate(R.layout.bkim_spiner_item_layout,null);
            viewHolder = new ViewHolder();
            viewHolder.mTextView = (TextView) view.findViewById(R.id.tv_user_state);
            view.setTag(viewHolder);
        }else {
            viewHolder = (ViewHolder) view.getTag();
        }
        viewHolder.mTextView.setText(mObjects.get(i));
        return view;
    }
    public static class ViewHolder{
        public TextView mTextView;
    }
}
