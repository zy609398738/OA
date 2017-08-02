package com.bokesoft.ecomm.im.android.ui.view;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.backend.IMServiceFacade;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.ui.adapter.HistorySearchResultAdapter;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.services.messager.server.model.HistoryMessagesData;

/**
 * 显示聊天记录的 Fragment
 */
public class HistorySearchResultFragment extends Fragment {
    private HistorySearchResultAdapter mChatRecorAdapter;//聊天记录的适配器
    private RecyclerView mRecyclerView;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.bkim_current_dialogue_activity, container, false);
        initView(view);
        return view;
    }

    private void initView(View view) {
        searchHistory();//获取数据
        mRecyclerView = (RecyclerView) view.findViewById(R.id.rc_msg);
        mChatRecorAdapter = new HistorySearchResultAdapter(getActivity(), null, R.layout.bkim_history_record_item);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    private void searchHistory() {
        ClientInstance ci = ClientInstance.getInstance();
        Bundle args = this.getArguments();
        String keywords = args.getString(BKIMConstants.ARG_HISTORY_SEARCH_KEYWORDS);
        String peerId = args.getString(BKIMConstants.ARG_HISTORY_SEARCH_PEER_ID);   //可能是 null

        IMServiceFacade.queryHistory(getActivity(), keywords, null, peerId, new IMServiceFacade.QueryHistoryCallback() {
            @Override
            public void perform(HistoryMessagesData data) {
                mChatRecorAdapter.mData = data.getMessages();
                mRecyclerView.setAdapter(mChatRecorAdapter);
                mChatRecorAdapter.notifyDataSetChanged();

            }
        });
    }
}


