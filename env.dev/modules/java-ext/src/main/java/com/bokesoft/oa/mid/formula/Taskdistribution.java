package com.bokesoft.oa.mid.formula;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class Taskdistribution extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String arg0, DefaultContext context, Object[] arg2, IExecutor arg3) throws Throwable {
		Document doc = context.getDocument();
		DataTable table1 = doc.get(0);
		String sql = "select * from OA_Taskdistribution_H where OID=?";
		DataTable daTable2 = context.getDBManager().execPrepareQuery(sql, table1.getLong("OID"));
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_Read");
		Document d = null;
		String ReadUsers = daTable2.getString("OptIDs");
		String[] readers = null;
		if (ReadUsers == null) {
			return null;
		} else {
			daTable2.beforeFirst();
			while (daTable2.next()) {
				readers = ReadUsers.split(",");
				for (String reader : readers) {
					Long ReadUser = TypeConvertor.toLong(reader);
					d = DocumentUtil.newDocument(metaDataObject);
					d.setNew();
					DataTable targetTable = d.get("OA_Read");
					targetTable.append();
					targetTable.setObject("ReadUser", ReadUser);
					targetTable.setObject("Status", 10);
					targetTable.setObject("SendUser", daTable2.getLong("Creator"));
					targetTable.setObject("SendTime", daTable2.getDateTime("BillDate"));
					targetTable.setObject("Opinion", daTable2.getString("Topic"));
					targetTable.setObject("BillKey", daTable2.getString("BillKey"));
					targetTable.setObject("BillOID", daTable2.getLong("OID"));
					SaveData saveData = new SaveData(metaDataObject, null, d);
					saveData.save(new DefaultContext(context));
				}
			}
		}
		return null;
	}

}
