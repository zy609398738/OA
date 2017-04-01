package com.bokesoft.ecomm.im.android.ui.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.activity.ConversationActivity;
import com.bokesoft.ecomm.im.android.instance.ClientInstance;
import com.bokesoft.ecomm.im.android.model.GroupInfo;
import com.bokesoft.ecomm.im.android.ui.view.IphoneTreeView;
import com.bokesoft.ecomm.im.android.utils.BKIMConstants;
import com.bokesoft.ecomm.im.android.utils.LogUtils;
import com.squareup.picasso.Picasso;


import java.util.HashMap;
import java.util.List;

public class ConstactAdapter extends BaseExpandableListAdapter implements IphoneTreeView.IphoneTreeHeaderAdapter {

    private Context mContext;
    private List<GroupInfo> mListGroup;
    private List<List<GroupInfo.User>> mListChild;
    private IphoneTreeView mIphoneTreeView;
    private HashMap<Integer, Integer> groupStatusMap;

    public ConstactAdapter(Context mContext, List<GroupInfo> mListGroup, List<List<GroupInfo.User>>
            mListChild, IphoneTreeView mIphoneTreeView) {
        this.mContext = mContext;
        this.mListGroup = mListGroup;
        this.mListChild = mListChild;
        this.mIphoneTreeView = mIphoneTreeView;
        groupStatusMap = new HashMap<Integer, Integer>();
    }

    public GroupInfo.User getChild(int groupPosition, int childPosition) {
        return mListChild.get(groupPosition).get(childPosition);
    }

    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    /**
     * 分组中的总人数
     *
     * @param groupPosition
     * @return
     */
    public int getChildrenCount(int groupPosition) {
        return mListChild.get(groupPosition).size();
    }

    /**
     * 分组中的在线人数
     *
     * @param groupPosition
     * @return
     */
    public int getChildrenOnlineCount(int groupPosition) {
//		int count=0;
//		List<Child> childList=mListGroup.get(groupPosition).getChildList();
//		for(int i=0;i<childList.size();i++){
//			Child child=childList.get(i);
//			if(!TextUtils.isEmpty(child.getOnline_status())&&child.getOnline_status().equals("1")){
//				count++;
//			}
//		}
        return 0;
    }

    public Object getGroup(int groupPosition) {
        return mListGroup.get(groupPosition);
    }

    public int getGroupCount() {
        return mListGroup.size();
    }

    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

    public boolean hasStableIds() {
        return true;
    }


    /**
     * Child
     */
    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        ChildHolder holder = null;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.fragment_constact_child, null);
            holder = new ChildHolder();
            holder.nameView = (TextView) convertView.findViewById(R.id.contact_list_item_name);//昵称
            holder.headiconView = (ImageView) convertView.findViewById(R.id.icon);//头像
            holder.mRelativeLayout = (RelativeLayout) convertView.findViewById(R.id.child_item_layout);
            convertView.setTag(holder);
        } else {
            holder = (ChildHolder) convertView.getTag();
        }
        final GroupInfo.User user = mListChild.get(groupPosition).get(childPosition);
        LogUtils.e("=====" + user.toString());

//		if(!TextUtils.isEmpty(User.getOnline_status())&&child.getOnline_status().equals("1")){//在线
//			holder.iconView.setAlpha(255);
//		}else{//不在线
//			holder.iconView.setAlpha(100);
//		}
        holder.nameView.setText(user.getName());//昵称
        if (user.getIcon() != null) {
            String url = ClientInstance.getInstance().getServiceUrlBase() + user.getIcon(); //拼接为绝对路径
            Picasso.with(mContext).load(url).into(holder.headiconView);
        } else {
            holder.headiconView.setImageResource(R.drawable.bkim_default_avatar_icon);
        }
        //设置点击事件
        holder.mRelativeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, ConversationActivity.class);
                intent.putExtra(BKIMConstants.PEER_ID, user.getCode());
                mContext.startActivity(intent);
            }
        });
        return convertView;
    }

    /**
     * Group
     */
    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {
        GroupHolder holder = null;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.fragment_constact_group, null);
            holder = new GroupHolder();
            holder.nameView = (TextView) convertView.findViewById(R.id.group_name);
            holder.onLineView = (TextView) convertView.findViewById(R.id.online_count);
            holder.iconView = (ImageView) convertView.findViewById(R.id.group_indicator);
            convertView.setTag(holder);
        } else {
            holder = (GroupHolder) convertView.getTag();
        }
        holder.nameView.setText(mListGroup.get(groupPosition).getGroupName());
        holder.onLineView.setText(getChildrenOnlineCount(groupPosition) + "/" + getChildrenCount(groupPosition));
        if (isExpanded) {
            holder.iconView.setImageResource(R.drawable.qb_down);
        } else {
            holder.iconView.setImageResource(R.drawable.qb_right);
        }
        return convertView;
    }

    @Override
    public int getTreeHeaderState(int groupPosition, int childPosition) {
//		final int childCount = getChildrenCount(groupPosition);
//		if (childPosition == childCount - 1) {
//			return PINNED_HEADER_PUSHED_UP;
//		} else if (childPosition == -1&& !mIphoneTreeView.isGroupExpanded(groupPosition)) {
//			return PINNED_HEADER_GONE;
//		} else {
//			return PINNED_HEADER_VISIBLE;
//		}
        return groupPosition;
    }

    @Override
    public void configureTreeHeader(View header, int groupPosition, int childPosition, int alpha) {
        ((TextView) header.findViewById(R.id.group_name)).setText(mListGroup.get(groupPosition).getGroupName());//组名
        ((TextView) header.findViewById(R.id.online_count)).setText(getChildrenOnlineCount(groupPosition) + "/" + getChildrenCount(groupPosition));//好友上线比例
    }

    @Override
    public void onHeadViewClick(int groupPosition, int status) {
        groupStatusMap.put(groupPosition, status);
    }

    @Override
    public int getHeadViewClickStatus(int groupPosition) {
        if (groupStatusMap.containsKey(groupPosition)) {
            return groupStatusMap.get(groupPosition);
        } else {
            return 0;
        }
    }

    class GroupHolder {
        TextView nameView;
        TextView onLineView;
        ImageView iconView;
    }

    class ChildHolder {
        TextView nameView;//昵称
        ImageView headiconView;//用户头像
        RelativeLayout mRelativeLayout;
    }


}
