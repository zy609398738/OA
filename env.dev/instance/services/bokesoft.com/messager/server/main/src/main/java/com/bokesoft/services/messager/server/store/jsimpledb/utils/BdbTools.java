package com.bokesoft.services.messager.server.store.jsimpledb.utils;

import java.io.File;

import org.apache.log4j.Logger;
import org.jsimpledb.JSimpleDB;
import org.jsimpledb.JSimpleDBFactory;
import org.jsimpledb.core.Database;
import org.jsimpledb.kv.bdb.BerkeleyKVDatabase;

import com.bokesoft.services.messager.server.store.jsimpledb.JSimpleClassMessage;

public class BdbTools {

	private static Logger log = Logger.getLogger(BdbTools.class);

	public static JSimpleDB createBdbInstance(File bdbDataDir) {
		final BerkeleyKVDatabase bkv = new BerkeleyKVDatabase();
		bkv.setDirectory(bdbDataDir);
		log.info("Starting Berkeley DB Java Edition ...");
		bkv.start();
		log.info("Berkeley DB Java Edition started, with directory '"+bdbDataDir+"' .");
		Database db = new Database(bkv);
					
		JSimpleDBFactory facInst = new JSimpleDBFactory();
		facInst.setDatabase(db);
		facInst.setSchemaVersion(2);
		facInst.setModelClasses(JSimpleClassMessage.class);
		
		//注册 JVM Shutdown hook
		Runtime.getRuntime().addShutdownHook(new Thread(){
			@Override
			public void run() {
				if (null!=bkv){
					log.info("Stopping Berkeley DB Java Edition ...");
					bkv.stop();
					log.info("Berkeley DB Java Edition stoppped .");
				}
			}
		});
		
		return facInst.newJSimpleDB();
	}

}
