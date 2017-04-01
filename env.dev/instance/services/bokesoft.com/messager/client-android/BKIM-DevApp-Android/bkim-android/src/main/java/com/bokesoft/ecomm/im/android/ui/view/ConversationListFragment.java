package com.bokesoft.ecomm.im.android.ui.view;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.PopupActivity;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.services.messager.server.model.MyActiveConnectData;
import com.bokesoft.ecomm.im.android.backend.HostServiceFacade;
import com.bokesoft.ecomm.im.android.backend.WebSocketFacade;
import com.bokesoft.ecomm.im.android.event.WebSocketEvent;
import com.bokesoft.ecomm.im.android.ui.adapter.CommonListAdapter;
import com.bokesoft.ecomm.im.android.ui.viewholder.ConversationItemHolder;

import java.util.ArrayList;
import java.util.IllegalFormatCodePointException;
import java.util.List;

import de.greenrobot.event.EventBus;

/**
 * 会话列表页
 */
public class ConversationListFragment extends Fragment implements View.OnClickListener {
    protected SwipeRefreshLayout refreshLayout;
    protected RecyclerView recyclerView;
    private TextView mAddFriend;//添加临时聊天的
    private EditText mSearchContent;//搜索内容
    private ImageView mSearchButton;
    private EditText mFindseekFriend;//临时添加的好友编号
    private LinearLayout mLayout;

    protected CommonListAdapter<MyActiveConnectData.SessionStat> itemAdapter;
    protected LinearLayoutManager layoutManager;
    View view;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.bkim_conversation_list_fragment, container, false);
        initView();//初始化方法HideKeyboard
        return view;
    }

    private void initView() {
        mSearchContent = (EditText) view.findViewById(R.id.et_search_content);
        mSearchContent.setOnClickListener(this);
        mAddFriend = (TextView) view.findViewById(R.id.tv_add_temporary_chat);
        mAddFriend.setOnClickListener(this);
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
            }
            HostServiceFacade.prepareUserInfo(
                    this.getContext(), userCodes.toArray(new String[0]),
                    new HostServiceFacade.PrepareUserInfoCallback() {
                        @Override
                        public void perform(HostServiceFacade.UserInfoCache userCodeCache) {
                            itemAdapter.setDataList(sessions);
                            itemAdapter.notifyDataSetChanged();
                        }
                    });
        }
    }

    /**
     * 添加临时会话的点击事件
     *
     * @param view
     */
    @Override
    public void onClick(View view) {
        int v = view.getId();
        if (v == R.id.tv_add_temporary_chat) {
            Intent intent = new Intent(getActivity(), PopupActivity.class);
            startActivity(intent);
        }else if (v==R.id.et_search_content){//获取焦点
            mSearchContent.setFocusable(true);
            mSearchContent.setFocusableInTouchMode(true);
            mSearchContent.requestFocus();
            mSearchContent.findFocus();
        }

    }
}
