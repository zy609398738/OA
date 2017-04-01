package com.bokesoft.services.messager.server.impl.utils;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.services.messager.server.model.Message;

public class MsgUtils {

	/**
	 * 静态方法, 对消息列表按照时间进行顺序处理
	 * @param messages
	 */
	public static void sortAsc(List<Message> messages){
		Collections.sort(messages, new Comparator<Message>(){
			@Override
			public int compare(Message o1, Message o2) {
				Long t1 = o1.getTimestamp();
				Long t2 = o2.getTimestamp();
				return t1.compareTo(t2);
			}
		});
	}

	/**
	 * 静态方法, 对消息列表按照时间进行倒序处理
	 * @param messages
	 */
	public static void sortDesc(List<Message> messages){
		Collections.sort(messages, new Comparator<Message>(){
			@Override
			public int compare(Message o1, Message o2) {
				Long t1 = o1.getTimestamp();
				Long t2 = o2.getTimestamp();
				return t2.compareTo(t1);
			}
		});
	}

	/**
	 * 静态方法, 获得消息的文本内容
	 * @param msg
	 * @return 对于不存在数据的消息, 可能为 null
	 */
	public static String getTextContent(Message msg){
		Object d = msg.getData();
		if (null==d){
			return null;
		}else{
			return d.toString();
		}
	}

	/**
	 * 静态方法, 检查消息是否匹配指定的搜索关键字
	 * @param m
	 * @param keywords
	 * @return
	 */
	public static boolean matchKeywords(Message m, String keywords){
		if (StringUtils.isBlank(keywords)){
			return true;	//没有传入则认为不需要过滤
		}
		String s = MsgUtils.getTextContent(m);
		if (null==s){
			return false;
		}else{
			return s.toUpperCase().indexOf(keywords.toUpperCase()) >= 0;
		}
	}
}
