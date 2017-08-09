package com.bokesoft.services.messager.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.impl.utils.ServletUtils;
import com.bokesoft.services.messager.server.model.HistoryMessagesData;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.store.IMessageStore;
import com.bokesoft.services.messager.zz.Misc;

public class HistoryServlet extends HttpServlet{
	private static final long serialVersionUID = 20161212L;

	/** 历史消息查询时每页的记录数 */
	private static final int HISTORY_PAGE_LIMITS = 50;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		throw new UnsupportedOperationException();
	}
	
	/**
	 * 历史消息查询, 固定为每次返回 {@link #HISTORY_PAGE_LIMITS} 条记录
	 * 请求参数, json字符串, 包含如下参数:
	 *  <br/>- self(当前用户,不能为空)
	 *  <br/>- from(开始时间/时间戳,可以为空;)
	 *  <br/>- focus(被关注消息的时间/时间戳,可以为空; 注意: focus 优先于 from)
	 *  <br/>- keywords(搜索条件,可以为空)
	 *  <br/>- other(聊天用户,可以为空)
	 *   例如: {self: 'tester', from: 1481585978795, keywords: '测试', other: 'peter'}
	 * 返回数据格式：{@link HistoryMessagesData}
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		int limits = HISTORY_PAGE_LIMITS;

		ServletUtils.checkAccessToken(req);
		
		JSONObject data = ServletUtils.getParamDataAsJson(req);
		Misc.$assert(null==data, "请求中没有 JSON 数据");

		String self = data.getString("self");
		if (null==self){
			throw new RuntimeException("历史消息查询条件中必须包含 'self'");
		}
		Long toTS = data.getLong("from");	//注意: 由于历史是“往前查找”, 所以 from 条件其实是 "To"
		Long focusTS = data.getLong("focus");
		String keywords = data.getString("keywords");
		String other = data.getString("other");
				
		IMessageStore store = MessagerConfig.getMessageStoreInstance();
		
		//查找符合条件的消息
		List<Message> msgs = new ArrayList<Message>();
		if (null!=focusTS){
			//往前(更晚的时间)搜索
			int prevLimits = limits/2;
			msgs.addAll(store.findHistory(other, self, focusTS+1, null, prevLimits, keywords));
			msgs.addAll(store.findHistory(self, other, focusTS+1, null, prevLimits, keywords));
			//时间从早到晚排列并只保留 prevLimits 条
			MsgUtils.sortAsc(msgs);
			if (msgs.size()>prevLimits){
				msgs = msgs.subList(0, prevLimits);
			}
			int afterLimits = limits - msgs.size();
			msgs.addAll(store.findHistory(other, self, null, focusTS, -1*(afterLimits+1), keywords));
			msgs.addAll(store.findHistory(self, other, null, focusTS, -1*(afterLimits+1), keywords));
		}else{
			msgs.addAll(store.findHistory(other, self, null, toTS, -1*(limits+1), keywords));
			msgs.addAll(store.findHistory(self, other, null, toTS, -1*(limits+1), keywords));
		}
		MsgUtils.sortDesc(msgs);

		HistoryMessagesData result = new HistoryMessagesData();
		result.setLimits(limits);
		if (msgs.size()>limits){
			msgs = msgs.subList(0, limits);
			result.setHasMore(true);
		}
		result.setMessages(msgs);
		if (msgs.size()>0){
			result.setStartTimestamp(msgs.get(0).getTimestamp());
			result.setEndTimestamp(msgs.get(msgs.size()-1).getTimestamp());
		}
		
		//检查消息前一页的信息
		long prevPageTimestamp = getPrevPageTimestamp(store, self, other, keywords, result.getStartTimestamp());
		result.setPrevPageTimestamp(prevPageTimestamp);
		
		//返回
		ServletUtils.returnAsJson(resp, result);
	}

	private long getPrevPageTimestamp(
			IMessageStore store, String self, String other, String keywords,
			long startTimestamp){
		int limits = HISTORY_PAGE_LIMITS;
		//检查消息前一页的信息
		List<Message> newerMsgs = new ArrayList<Message>();
		newerMsgs.addAll(store.findHistory(other, self, startTimestamp, null, limits, keywords));
		newerMsgs.addAll(store.findHistory(self, other, startTimestamp, null, limits, keywords));
		MsgUtils.sortAsc(newerMsgs);
		int prevPageSize = newerMsgs.size();
		
		long prevPageTimestamp = 0;
		if (prevPageSize>limits){
			prevPageTimestamp = (newerMsgs.get(limits-1).getTimestamp());
		}else if (prevPageSize<=0){
			prevPageTimestamp = (0);	//等于 0 代表没有更多数据了
		}else{
			prevPageTimestamp = (newerMsgs.get(prevPageSize-1).getTimestamp());
		}
		if (prevPageSize==1 && prevPageTimestamp==startTimestamp){
			prevPageTimestamp = (0);	//考虑到查找的时候存在数据重叠, 所以只有一条记录的情况下很有可能也是已经没有数据了
		}

		return prevPageTimestamp;
	}
}
