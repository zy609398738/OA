package com.bokesoft.ecomm.im.android.ui.view;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.instance.ClientInstanceData;
import com.bokesoft.ecomm.im.android.ui.widget.RecyclerViewDividerItemDecoration;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.backend.WebSocketFacade;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.ui.adapter.CommonListAdapter;
import com.bokesoft.ecomm.im.android.ui.viewholder.ConversationItemHolder;

import java.util.ArrayList;
import java.util.List;

import de.greenrobot.event.EventBus;

/**
 * 会话列表页
 * TODO 联系人状态显示未实现
 */
public class ConversationListFragment extends Fragment {
    protected SwipeRefreshLayout refreshLayout;
    protected RecyclerView recyclerView;
    private CommonListAdapter<MyActiveConnectData.SessionStat> itemAdapter;
    private LinearLayoutManager layoutManager;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.bkim_conversation_list_fragment, container, false);
        initView(view);
        return view;
    }

    private void initView(View view) {
        refreshLayout = (SwipeRefreshLayout) view.findViewById(R.id.fragment_conversation_srl_pullrefresh);
        recyclerView = (RecyclerView) view.findViewById(R.id.fragment_conversation_srl_view);
        refreshLayout.setEnabled(false);
        layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.addItemDecoration(new RecyclerViewDividerItemDecoration(getActivity()));
        itemAdapter = new CommonListAdapter<MyActiveConnectData.SessionStat>(ConversationItemHolder.class);
        recyclerView.setAdapter(itemAdapter);

        EventBus.getDefault().register(this);
        WebSocketFacade.getInstance().performPing();    //Make a ping to refresh Conversation List
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
    }

    @Override
    public void onResume() {
        super.onResume();
        WebSocketFacade.getInstance().performPing();    //Make a ping to refresh Conversation List
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        EventBus.getDefault().unregister(this);
    }

    public void onEventMainThread(WebSocketEvent event) {
        MyActiveConnectData data = event.getMyActiveConnectData();
        if (null != data) {
            final List<MyActiveConnectData.SessionStat> sessions = data.getSessions();
            List<String> userCodes = new ArrayList<>();
            for (MyActiveConnectData.SessionStat s : sessions) {
                userCodes.add(s.getCode());
                ClientInstanceData.addUserState(s.getCode(), s.getState());
            }
            HostServiceFacade.prepareUserInfo(
                    this.getContext(), userCodes.toArray(new String[0]),
                    new HostServiceFacade.PrepareUserInfoCallback() {
                        @Override
                        public void perform(HostServiceFacade.UserInfoProvider provider) {
                            itemAdapter.setDataList(sessions);
                            itemAdapter.notifyDataSetChanged();
                        }
                    });
        }
    }
}
