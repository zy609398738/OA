package com.bokesoft.services.messager.server.store.jsimpledb.utils;

import org.jsimpledb.JSimpleDB;
import org.jsimpledb.JTransaction;
import org.jsimpledb.ValidationMode;

import com.bokesoft.services.messager.zz.Misc;

public class DBTools {

	public static interface TransactionRunner {
		public Object run(JTransaction jtx) throws Exception;
	}

	public static Object run(final JSimpleDB jdb, final TransactionRunner runner){
		JTransaction current;
		try {
			current = JTransaction.getCurrent();
		} catch (IllegalStateException e) {
			//FIXME: 目前没有办法不通过 catch IllegalStateException 确定当前线程是否绑定了 JTransaction
			current = null;
		}
		
		if (null==current){
			JTransaction jtx = jdb.createTransaction(true, ValidationMode.AUTOMATIC);
			JTransaction.setCurrent(jtx);
		}
	    try {
	    	Object result = runner.run(JTransaction.getCurrent());
	    	JTransaction.getCurrent().commit();
	        return result;
	    }catch(Exception ex){
	    	JTransaction.getCurrent().rollback();
	    	Misc.$throw(ex);
	    	return null;	//Unreachable code
	    } finally {
	    	if (null==current){
	    		JTransaction.setCurrent(null);
	    	}
	    }
	}

}
