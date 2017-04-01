package com.bokesoft.services.messager.server.store.jsimpledb;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NavigableSet;

import org.jsimpledb.JSimpleDB;
import org.jsimpledb.JTransaction;
import org.jsimpledb.core.ObjId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;

import com.alibaba.fastjson.JSON;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.store.jsimpledb.utils.BdbTools;
import com.bokesoft.services.messager.server.store.jsimpledb.utils.DBTools;

public class BdbDemoApp {
	private static JSimpleDB inst;
	
	private static final long startTime = System.currentTimeMillis();
	private static final int steps = 10000;
	private static final int stepLen = 11;

	private static final Map<String, Integer> recordsCount = new HashMap<String, Integer>();
	private static final Map<String, Integer> unreadedCount = new HashMap<String, Integer>();

	public static void main(String[] args) throws Exception {
		File data = getDataFolder();
		inst = BdbTools.createBdbInstance(data);
		createTestObject(startTime, steps, stepLen);
		
		testReadAll();
		testQueryNewMessage();
		testQueryHistory();
		
		showAllLogs();
	}

	private static void testQueryHistory(){
		List<Message> msgs;
		long midTime1 = startTime+1999*stepLen;
		long midTime2 = startTime+4997*stepLen;
		
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, null, null, null, null);		//Query All
		log("History - [total] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, null, midTime1, null, null);
		log("History - [total, Time to {}] records: {}", midTime1, msgs.size());		
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, midTime1+1, midTime2, null, null);
		log("History - [total, Time from {} to {}] records: {}", midTime1+1, midTime2, msgs.size());		
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, midTime2+1, null, null, null);
		log("History - [total, Time from {}] records: {}", midTime2+1, msgs.size());	
		
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, null, null, null, "1234");
		log("History - [total, contains {}] records: {}", "1234", msgs.size());
		testUpdate(msgs, "测试中文内容(1234)");
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, null, null, null, "4321");
		log("History - [total, contains {}] records: {}", "4321", msgs.size());
		testUpdate(msgs, "测试中文内容(4321)");
		msgs = JSimpleClassMessage.queryHistory(inst, null, null, null, null, null, "中文");
		log("History - [total, contains {}] records: {}", "中文", msgs.size());

		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", null, null, null, null, null);
		log("History - [Sender=Odd] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", null, null, null, 300, null);
		log("History - [Sender=Odd, limits 300] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", null, null, null, 30000, null);
		log("History - [Sender=Odd, limits 30000] records: {}", msgs.size());

		msgs = JSimpleClassMessage.queryHistory(inst, null, "Three", null, null, null, null);
		log("History - [Receiver=Three] records: {}", msgs.size());

		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", "Three", null, null, null, null);
		log("History - [Sender=Odd, Receiver=Three] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", "Three", null, null, 300, null);
		log("History - [Sender=Odd, Receiver=Three, limits 300] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, "Odd", "Three", null, null, 3000, null);
		log("History - [Sender=Odd, Receiver=Three, limits 3000] records: {}", msgs.size());
		msgs = JSimpleClassMessage.queryHistory(inst, "Even", "Three", null, null, null, null);
		log("History - [Sender=Even, Receiver=Three] records: {}", msgs.size());
		
		msgs = JSimpleClassMessage.queryHistory(inst, null, "Five", null, null, null, null);
		log("History - [Receiver=Five] records: {}", msgs.size());
		
		msgs = JSimpleClassMessage.queryHistory(inst, null, "Five", null, midTime1, null, null);
		log("History - [Receiver=Five, Time to {}] records: {}", midTime1, msgs.size());		
		msgs = JSimpleClassMessage.queryHistory(inst, null, "Five", midTime1+1, midTime2, null, null);
		log("History - [Receiver=Five, Time from {} to {}] records: {}", midTime1+1, midTime2, msgs.size());		
		msgs = JSimpleClassMessage.queryHistory(inst, null, "Five", midTime2+1, null, null, null);
		log("History - [Receiver=Five, Time from {}] records: {}", midTime2+1, msgs.size());		
	}
	
	private static void testUpdate(final List<Message> msgs, final String s){
		DBTools.run(inst, new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
				for (Message m: msgs){
					JSimpleClassMessage msg = jtx.get(new ObjId(m.getStoreId()), JSimpleClassMessage.class);
					msg.setTextContent(s); //注意: 不能直接对 m 进行修改
				}
				return null;
			}
		});
		
	}
	
	private static void testQueryNewMessage(){
		List<Message> msgs;
		//All new messages
		msgs = JSimpleClassMessage.queryNewMessage(inst, null);
		log("New Messages - all new messages: {}", msgs.size());
		//New messages for 'Two'
		msgs = JSimpleClassMessage.queryNewMessage(inst, "Two");
		log("New Messages - {}'s new messages: {}", "Two", msgs.size());
	}
	
	private static void testReadAll(){
		DBTools.run(inst, new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
	        	NavigableSet<JSimpleClassMessage> all = jtx.getAll(JSimpleClassMessage.class);
	        	log("ReadAll: total records: {}", all.size());
	        	return null;
			}
		});
	}
	
	private static File getDataFolder() throws IOException {
		File tmp = File.createTempFile("jsimpledb-demo.", ".bdb");
		tmp.delete();
		tmp.mkdirs();
		_log.info("The data folder for testing: {}", tmp);
		return tmp;
	}
	
	private static void createTestObject(final long startTime, final int steps, final int stepSize){
		DBTools.run(inst, new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
        		int cOne=0, cTwo=0, cThree=0, cFour=0, cFive=0;
        		int uOne=0, uTwo=0, uThree=0, uFour=0, uFive=0;
	        	for(int i=1; i<=steps; i++){
	        		long timestamp = startTime + stepSize*i;
	        		
		        	JSimpleClassMessage obj = jtx.create(JSimpleClassMessage.class);
	        		obj.setType("TEXT");
	        		obj.setSender("Even");
	        		if (timestamp%2==1){
	        			obj.setSender("Odd");
	        		}

	        		obj.setReadTimestamp(System.currentTimeMillis());
	        		if (i%121==0){
		        		obj.setReadTimestamp(-1L);
	        		}

	        		if (i%5==0){
		        		obj.setReceiver("Five");
		        		cFive++;
		        		if (obj.getReadTimestamp()<0) uFive++;
	        		}else if (i%4==0){
		        		obj.setReceiver("Four");
		        		cFour++;
		        		if (obj.getReadTimestamp()<0) uFour++;
	        		}else if (i%3==0){
		        		obj.setReceiver("Three");
		        		cThree++;
		        		if (obj.getReadTimestamp()<0) uThree++;
	        		}else if (i%2==0){
		        		obj.setReceiver("Two");
		        		cTwo++;
		        		if (obj.getReadTimestamp()<0) uTwo++;
	        		}else{
		        		obj.setReceiver("One");
		        		cOne++;
		        		if (obj.getReadTimestamp()<0) uOne++;
	        		}
	        		obj.setTimestamp(timestamp);
	        		obj.setDataJson(JSON.toJSONString(new Date(timestamp)));
	        		obj.setAttachmentsJson("[]");
	        		
	        		obj.setTextContent(
	        				"Message: " + obj.getSender() + " - " + obj.getReceiver()+": "+obj.getTimestamp());
	        		
	        		if (i%1000==0){
	        			_log.info("Total {} records inserted ...", i);
	        		}
	        	}
	        	
    			log("Data creation - One={}, Two={}, Three={}, Four={}, Five={} .",
    					cOne, cTwo, cThree, cFour, cFive);
    			log("Data creation - New Messages: One={}, Two={}, Three={}, Four={}, Five={} .",
    					uOne, uTwo, uThree, uFour, uFive);
    			
    			recordsCount.put("One", cOne);
    			recordsCount.put("Two", cTwo);
    			recordsCount.put("Three", cThree);
    			recordsCount.put("Four", cFour);
    			recordsCount.put("Five", cFive);
    			unreadedCount.put("One", uOne);
    			unreadedCount.put("Two", uTwo);
    			unreadedCount.put("Three", uThree);
    			unreadedCount.put("Four", uFour);
    			unreadedCount.put("Five", uFive);
    			
	        	return null;
			}
		});
	}

	private static final Logger _log = LoggerFactory.getLogger(BdbDemoApp.class);
	private static final List<String> _allLogs = new ArrayList<String>();
	private static void log(String log, Object ... args){
		_log.info(log, args);
		FormattingTuple ft = MessageFormatter.arrayFormat(log, args);
		_allLogs.add(ft.getMessage());
	}
	private static void showAllLogs(){
		System.err.println();
		for (String s: _allLogs){
			System.err.println(">>> "+s);
		}
	}
}
