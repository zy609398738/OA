package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.service.IExtService2;

public class TSL_UpdateImageInfo implements IExtService2 {
	private static String HEAD_SQL = "merge into Seq_Table t1 " + "using  "
			+ "(select 'YIGO-BPM' as YIGO_BPM,? as DOCUMENT_NUMBER ,"
			+ "? as UNIT_CODE,'GENERATE' as STATUS from dual) t2 " + "on (t1.DOCUMENT_NUMBER=t2.DOCUMENT_NUMBER) "
			+ "when matched then " + "update set t1.UNIT_CODE=t2.UNIT_CODE " + "when not matched then "
			+ "insert (t1.YIGO_BPM,t1.DOCUMENT_NUMBER,t1.UNIT_CODE,t1.STATUS) " + "values ('YIGO-BPM',?,?,'GENERATE')";

	private static String DETAIL_SQL = "insert into seq_detail (seqid, barcode, userid, deptid, typeid, clientip, serverdt) "
			+ "values ((select nvl(max(seqid), 0) + 1 from seq_detail where barcode = ?),?,?,?,?,?,?)";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String unit_code = args.get("unit_code").toString();
		String document_number = args.get("document_number").toString();

		String userid = args.get("userid").toString();
		String typeid = args.get("typeid").toString();
		String clientip = args.get("clientip").toString();
		String serverdt = args.get("serverdt").toString();

		IDBManager DBManager = context.getDBManager();
		DBManager.execPrepareUpdate(HEAD_SQL, document_number, unit_code, document_number, unit_code);

		DBManager.execPrepareUpdate(DETAIL_SQL, document_number, document_number, userid, unit_code, typeid, clientip, serverdt);

		return true;
	}
}
