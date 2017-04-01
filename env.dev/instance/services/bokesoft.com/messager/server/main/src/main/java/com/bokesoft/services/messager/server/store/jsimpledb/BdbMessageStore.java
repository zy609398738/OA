package com.bokesoft.services.messager.server.store.jsimpledb;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.jsimpledb.JSimpleDB;
import org.jsimpledb.JTransaction;
import org.jsimpledb.core.ObjId;

import com.bokesoft.services.messager.config.MessagerConfig;
import com.bokesoft.services.messager.server.model.Message;
import com.bokesoft.services.messager.server.store.IMessageStore;
import com.bokesoft.services.messager.server.store.jsimpledb.utils.BdbTools;
import com.bokesoft.services.messager.server.store.jsimpledb.utils.DBTools;
import com.bokesoft.services.messager.zz.Misc;

public class BdbMessageStore implements IMessageStore {
	private static JSimpleDB dbInst = null;
	
	private static JSimpleDB getDB(){
		if (null!=dbInst){
			return dbInst;
		}
		synchronized (BdbMessageStore.class) {
			try {
				File bdbDir = new File(MessagerConfig.getDataPath(), "bdb");
				bdbDir.mkdirs();
				
				dbInst = BdbTools.createBdbInstance(bdbDir);
				
				return dbInst;
			} catch (IOException e) {
				Misc.$throw(e);
				return null;	//Unreachable code
			}
		}
	}

	@Override
	public void save(final Message message) {
		DBTools.run(getDB(), new DBTools.TransactionRunner(){
			@Override
			public Object run(JTransaction jtx) throws Exception {
				ObjId objId = null;
				String storeId = message.getStoreId();
				if (StringUtils.isNotBlank(storeId)){
					objId = new ObjId(storeId);
					if(!jtx.exists(objId)){
						objId = null;
					}
				}else{
					objId = null;
				}
				
				JSimpleClassMessage jsObj;
				if (null!=objId){
					jsObj = jtx.get(objId, JSimpleClassMessage.class);
				}else{
		        	jsObj = jtx.create(JSimpleClassMessage.class);
				}
	        	JSimpleClassMessage.readMessage(message, jsObj);

	        	return null;
			}
		});
	}

	@Override
	public List<Message> findNewMessage(final String receiver) {
		List<Message> msgs = JSimpleClassMessage.queryNewMessage(getDB(), receiver);
		return msgs;
	}

	@Override
	public List<Message> findHistory(String sender, String receiver, Long fromTime, Long toTime, Integer limits, String keywords) {
		List<Message> msgs = JSimpleClassMessage.queryHistory(
				getDB(), sender, receiver, fromTime, toTime, limits, keywords);
		return msgs;
	}

}
