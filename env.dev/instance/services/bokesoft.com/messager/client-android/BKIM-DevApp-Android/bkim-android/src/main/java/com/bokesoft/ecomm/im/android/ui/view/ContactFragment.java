package com.bokesoft.ecomm.im.android.ui.view;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.IMServiceFacade;
import com.bokesoft.ecomm.im.android.instance.ClientInstanceData;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.ui.adapter.ContactAdapter;
import com.bokesoft.ecomm.im.android.ui.widget.IphoneTreeView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 联系人页面
 */
public class ContactFragment extends Fragment implements SwipeRefreshLayout.OnRefreshListener {
    private IphoneTreeView treeView;
    private ContactAdapter contactAdapter;
    private List<GroupInfo> groupList = new ArrayList<>();
    private List<List<GroupInfo.User>> groupUsersList = new ArrayList<>();
    private SwipeRefreshLayout swipeRefreshLayout;

    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    groupList = (List<GroupInfo>) msg.obj;

                    //关联适配器
                    updataData();

                    break;
            }
        }


    };

    private void getUserCode(final List<String> userCodes) {
        final String[] strArr = new String[userCodes.size()];
        for (int i = 0; i < userCodes.size(); i++) {
            strArr[i] = userCodes.get(i);
        }
        IMServiceFacade.getUserStates(getContext(), strArr, new IMServiceFacade.QueryUserStatesCallback() {
            @Override
            public void perform(IMServiceFacade.UserStates userStates) {
                Map<String, String> states = userStates.getStates();
                Set<Map.Entry<String, String>> entries = states.entrySet();
                for (Map.Entry<String, String> entry : entries) {
                    ClientInstanceData.addUserState(entry.getKey(), entry.getValue());
                }
            }
        });


    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.bkim_contact_fragment, container, false);

        //初始化组件
        initView(view);
        return view;
    }

    private void initView(View view) {
        swipeRefreshLayout = (SwipeRefreshLayout) view.findViewById(R.id.contact_fragment_pullrefresh);
        //改变加载显示的颜色
        swipeRefreshLayout.setColorSchemeColors(Color.RED, Color.RED);
        //设置初始值的大小
        swipeRefreshLayout.setSize(SwipeRefreshLayout.LARGE);
        //设置监听
        swipeRefreshLayout.setOnRefreshListener(this);
        //设置向下拉多少出现刷新
        swipeRefreshLayout.setDistanceToTriggerSync(80);
        //设置刷新出现的位置
        swipeRefreshLayout.setProgressViewEndTarget(false, 200);

        treeView = (IphoneTreeView) view.findViewById(R.id.contact_fragment_itv_list);
        treeView.setGroupIndicator(null);
        refreshMembers(false);//加载数据

    }


    private void refreshMembers(final boolean isRefresh) {
        HostServiceFacade.requestBuddies(this.getContext(), new HostServiceFacade.BuddiesCallback() {
            @Override
            public void perform(List<GroupInfo> groups) {

                if (groups != null) {
                    if (isRefresh) {
                        swipeRefreshLayout.setRefreshing(false);
                    }
                    Message msg = Message.obtain();
                    msg.obj = groups;
                    msg.what = 1;
                    handler.sendMessage(msg);
                }
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        updataData();
    }

    private void updataData() {
        contactAdapter = new ContactAdapter(getActivity(), groupList, groupUsersList, treeView);
        treeView.setAdapter(contactAdapter);
        List<String> userCodes = new ArrayList<>();
        for (GroupInfo g : groupList) {
            groupUsersList.add(g.getUsers());
            for (GroupInfo.User user : g.getUsers()) {
                userCodes.add(user.getCode());
            }
        }
        getUserCode(userCodes);
        contactAdapter.notifyDataSetChanged();
    }

    @Override
    public void onRefresh() {
        groupList.clear();
        groupUsersList.clear();
        refreshMembers(true);
    }
}
