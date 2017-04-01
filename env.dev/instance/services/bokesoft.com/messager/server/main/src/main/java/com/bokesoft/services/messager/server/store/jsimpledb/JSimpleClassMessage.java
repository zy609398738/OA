package com.bokesoft.services.messager.server.store.jsimpledb;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.NavigableMap;
import java.util.NavigableSet;

import org.jsimpledb.JObject;
import org.jsimpledb.JSimpleDB;
import org.jsimpledb.JTransaction;
import org.jsimpledb.annotation.JCompositeIndex;
import org.jsimpledb.annotation.JSimpleClass;
import org.jsimpledb.index.Index;
import org.jsimpledb.index.Index2;
import org.jsimpledb.index.Index3;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.bokesoft.services.messager.server.impl.utils.MsgUtils;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.model.base.AttachmentBase;
import com.bokesoft.services.messager.server.store.jsimpledb.utils.DBTools;

@JSimpleClass(compositeIndexes={
	@JCompositeIndex(name="findNewMessage", fields={"readTimestamp", "receiver"}),
	@JCompositeIndex(name="findHistory", fields={"timestamp", "sender", "receiver"})
})
public abstract class JSimpleClassMessage implements JObject {
	public abstract String getType();
	public abstract void setType(String type);

	public abstract long getTimestamp();
	public abstract void setTimestamp(long timestamp);

	public abstract String getSender();
	public abstract void setSender(String sender);

	public abstract String getSenderName();
	public abstract void setSenderName(String senderName);

	public abstract String getReceiver();
	public abstract void setReceiver(String receiver);
	
	public abstract String getReceiverName();
	public abstract void setReceiverName(String receiverName);
	
	public abstract String getDataJson();
	public abstract void setDataJson(String dataJson);

	public abstract String getAttachmentsJson();
	public abstract void setAttachmentsJson(String attachmentsJson);
	
	public abstract long getReadTimestamp();
	public abstract void setReadTimestamp(long readTimestamp);
	
	public abstract String getTextContent();
	public abstract void setTextContent(String textContent);
	
	public abstract boolean isBlocked();
	public abstract void setBlocked(boolean blocked);

	/**
	 * 将基于 jSimpleDB 存储的消息转化为普通的消息对象
	 * @param jsObj
	 * @return
	 */
	public static Message toMessage(JSimpleClassMessage jsObj){
		Message msg = new Message(jsObj.getType(), jsObj.getSender(), jsObj.getReceiver(), jsObj.getTimestamp());
		
		String dataJson = jsObj.getDataJson();
		Object data = JSON.parse(dataJson);
		msg.setData(data);
		
		String attsJson = jsObj.getAttachmentsJson();
		List<AttachmentBase> atts = JSON.parseArray(attsJson, AttachmentBase.class);
		msg.getAttachments().addAll(atts);
		
		msg.setReadTimestamp(jsObj.getReadTimestamp());
		
		msg.setBlocked(jsObj.isBlocked());
		
		msg.setReceiverName(jsObj.getReceiverName());
		msg.setSenderName(jsObj.getSenderName());

		//用于判断是否已经存在的 id 字段
		msg.setStoreId(jsObj.getObjId().toString());
		
		return msg;
	}
	/**
	 * 通过普通的消息对象初始化基于 jSimpleDB 存储的消息
	 * @param msg
	 * @param jsObj
	 */
	public static void readMessage(Message msg, JSimpleClassMessage jsObj){
		jsObj.setType(msg.getType());
		jsObj.setSender(msg.getSender());
		jsObj.setReceiver(msg.getReceiver());
		jsObj.setTimestamp(msg.getTimestamp());
		
		String dataJson = JSON.toJSONString(msg.getData(), SerializerFeature.WriteClassName);
		jsObj.setDataJson(dataJson);
		
		String attsJson = JSON.toJSONString(msg.getAttachments(), SerializerFeature.WriteClassName);
		jsObj.setAttachmentsJson(attsJson);
		
		jsObj.setReadTimestamp(msg.getReadTimestamp());
		
		jsObj.setBlocked(msg.isBlocked());
		
		jsObj.setSenderName(msg.getSenderName());
		jsObj.setReceiverName(msg.getReceiverName());
		
		//用于搜索的文本内容
		jsObj.setTextContent(MsgUtils.getTextContent(msg));
	}
	/**
	 * 查询新消息
	 * @param instance
	 * @param receiver
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Message> queryNewMessage(JSimpleDB instance, final String receiver){
		return (List<Message>) DBTools.run(instance, new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
	        	List<Message> msgs = new ArrayList<Message>();
	
	        	Index2<Long, String, JSimpleClassMessage> idx2 = jtx.queryCompositeIndex(
	        			JSimpleClassMessage.class, "findNewMessage", Long.class, String.class);
	
	        	NavigableMap<Long, Index<String, JSimpleClassMessage>>
	        			newMsgIdx = idx2.asMapOfIndex().headMap(0L, true);	//readTimestamp 默认为 -1, 所以以 "<=0" 作为新消息的查询条件
	        	for(Index<String, JSimpleClassMessage> rIdx: newMsgIdx.values()){
		        	if (null!=receiver){
		        		NavigableSet<JSimpleClassMessage> tmp = rIdx.asMap().get(receiver);
		        		if (null!=tmp){
		        			for (JSimpleClassMessage jm: tmp){
		        				if(!jm.isBlocked()){
		        					msgs.add(toMessage(jm));
		        				}
		        			}
		        		}
		        	}else{
		        		for(NavigableSet<JSimpleClassMessage> set: rIdx.asMap().values()){
		        			for (JSimpleClassMessage jm: set){
		        				if(!jm.isBlocked()){
		        					msgs.add(toMessage(jm));
		        				}
		        			}
		        		}
		        	}
	        	}
	        	
	        	return msgs;
			}
		});
	}
	/**
	 * 查询历史消息
	 * @param instance
	 * @param sender
	 * @param receiver
	 * @param from
	 * @param to
	 * @param limits
	 * @param keywords
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Message> queryHistory(JSimpleDB instance,
			final String sender, final String receiver, final Long from, final Long to, final Integer limits, final String keywords){
		return (List<Message>)DBTools.run(instance, new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
	        	List<Message> messages = new ArrayList<Message>();
	
	        	Index3<Long, String, String, JSimpleClassMessage> idx3 = jtx.queryCompositeIndex(
	        			JSimpleClassMessage.class, "findHistory", Long.class, String.class, String.class);
	        	 
	        	long _from = (null==from)?Long.MIN_VALUE:from;
	        	long _to = (null==to)?Long.MAX_VALUE:to;
	        	NavigableMap<Long, Index2<String, String, JSimpleClassMessage>>
	        	    mapIdxByTimestamp = idx3.asMapOfIndex2().subMap(_from, true, _to, true);
	        	
	        	Collection<Long> timestamps = mapIdxByTimestamp.keySet();
	        	
	        	if (null!=limits){	//查询结果需要排序(如果 limits 小于 0, 需要倒序)
	        		final int sortFactor = limits / Math.abs(limits);
	        		
	        		List<Long> tsList = new ArrayList<Long>(timestamps);	//FIXME: 可能存在性能问题
	        		Collections.sort(tsList, new Comparator<Long>() {
						@Override
						public int compare(Long o1, Long o2) {
							if (null==o1) o1=Long.MIN_VALUE;
							if (null==o2) o2=Long.MIN_VALUE;
							if (o1>o2){
								return 1*sortFactor;
							}else if (o1<o2){
								return -1*sortFactor;
							}else{
								return 0;
							}
						}
					});
	        		timestamps = tsList;
	        	}
	        	
	        	int realLimits = Integer.MAX_VALUE;
	        	if (null!=limits){
	        		realLimits = Math.abs(limits);
	        	}
	        	
	        	List<Index<String, JSimpleClassMessage>> receiverIndexList = new ArrayList<Index<String, JSimpleClassMessage>>();
	        	for (Long timestamp: timestamps){
	        		Index2<String, String, JSimpleClassMessage> idxBySender = mapIdxByTimestamp.get(timestamp);

	        		if (null!=sender){
	        			Index<String, JSimpleClassMessage> tmp = idxBySender.asMapOfIndex().get(sender);
	        			if (null!=tmp){
	        				receiverIndexList.add(tmp);
	        			}
	        		}else{
	        			receiverIndexList.addAll(idxBySender.asMapOfIndex().values());
	        		}
	        	}
	        	for (Index<String, JSimpleClassMessage> idxByReceiver: receiverIndexList){
	        		if (null!=receiver){
	        			NavigableSet<JSimpleClassMessage> records = idxByReceiver.asMap().get(receiver);
	        			if (null!=records){
		        			for (JSimpleClassMessage m: records){
		        				Message message = toMessage(m);
		        				if (MsgUtils.matchKeywords(message, keywords) && !m.isBlocked()){
		        					messages.add(message);
		        					if (null!=limits && messages.size()>=realLimits){
		        						return messages;
		        					}
		        				}
		        			}
	        			}
	        		}else{
	        			Collection<NavigableSet<JSimpleClassMessage>> recordsGroups = idxByReceiver.asMap().values();
	        			for (NavigableSet<JSimpleClassMessage> records: recordsGroups){
	        				for (JSimpleClassMessage m: records){
	        					Message message = toMessage(m);
		        				if (MsgUtils.matchKeywords(message, keywords) && !m.isBlocked()){
									messages.add(message);
		        					if (null!=limits && messages.size()>=realLimits){
		        						return messages;
		        					}
		        				}
		        			}
	        			}
	        		}
	        	}
	        	
	        	return messages;
			}
		});		
	}
}
