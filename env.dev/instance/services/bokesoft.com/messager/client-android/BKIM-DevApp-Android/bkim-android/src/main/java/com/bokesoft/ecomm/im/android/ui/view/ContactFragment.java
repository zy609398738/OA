package com.bokesoft.ecomm.im.android.ui.view;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.event.MemberLetterEvent;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.ui.adapter.ConstactAdapter;
import com.bokesoft.ecomm.im.android.utils.LogUtils;

import java.util.ArrayList;
import java.util.List;

import de.greenrobot.event.EventBus;

/**
 * 联系人页面
 *
 */
public class ContactFragment extends Fragment {

    protected SwipeRefreshLayout refreshLayout;
    private IphoneTreeView mEblist;
    View view;
    private ConstactAdapter mExpAdapter;
    private List<GroupInfo> mListGroup = new ArrayList<>();
    public static List<List<GroupInfo.User>> mListChild = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.contact_fragment, container, false);

        //初始化组件
        initView();
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshMembers();
            }
        });

        EventBus.getDefault().register(this);

        return view;
    }


    private void initView() {

        refreshLayout = (SwipeRefreshLayout) view.findViewById(R.id.contact_fragment_srl_list);
        mEblist = (IphoneTreeView) view.findViewById(R.id.contact_fragment_itv_list);
        mEblist.setHeaderView(LayoutInflater.from(getContext()).inflate(R.layout.fragment_constact_head_view, mEblist, false));
        mEblist.setGroupIndicator(null);
        refreshLayout.setRefreshing(true);
        refreshMembers();//加载数据
        mExpAdapter.notifyDataSetChanged();
        refreshLayout.setRefreshing(false);
    }
    @Override
    public void onDestroyView() {
        EventBus.getDefault().unregister(this);
        super.onDestroyView();
        mExpAdapter.notifyDataSetChanged();
    }
    private void refreshMembers() {
        HostServiceFacade.requestBuddies(this.getContext(), new HostServiceFacade.BuddiesCallback() {
            @Override
            public void perform(List<GroupInfo> groups) {
                mListGroup = groups;
                for (GroupInfo g : groups) {
                    mListChild.add(g.getUsers());
                }
                mExpAdapter.notifyDataSetChanged();
                refreshLayout.setRefreshing(false);
            }
        });
        mExpAdapter = new ConstactAdapter(getActivity(), mListGroup, mListChild, mEblist);
        mEblist.setAdapter(mExpAdapter);
        mExpAdapter.notifyDataSetChanged();
        refreshLayout.setRefreshing(false);//结束刷新状态
    }

    /**
     * 处理 LetterView 发送过来的 MemberLetterEvent
     * 会通过 MembersAdapter 获取应该要跳转到的位置，然后跳转
     */
    public void onEvent(MemberLetterEvent event) {
        mExpAdapter.notifyDataSetChanged();
//        Character targetChar = Character.toLowerCase(event.letter);
//        if (mExpAdapter.getIndexMap().containsKey(targetChar)) {
//            int index = itemAdapter.getIndexMap().get(targetChar);
//            if (index > 0 && index < itemAdapter.getItemCount()) {
//                //  layoutManager.scrollToPositionWithOffset(index, 0);
//            }
//        }
    }
}
