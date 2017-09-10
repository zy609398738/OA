package com.bokesoft.oa.mid;

import java.util.ArrayList;
import java.util.Date;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class Notification implements IExtService {

	@Override
	public Object doCmd(DefaultContext defaultContext, ArrayList<Object> arrayList) throws Throwable {
		return notification(defaultContext, TypeConvertor.toString(arrayList.get(0)),
				TypeConvertor.toDate(arrayList.get(1)), TypeConvertor.toLong(arrayList.get(2)),
				TypeConvertor.toString(arrayList.get(3)), TypeConvertor.toString(arrayList.get(4)),
				TypeConvertor.toLong(arrayList.get(5)));
	}

	public Boolean notification(DefaultContext context, String optIds, Date sendTime, Long oid, String opinion,
			String billKey, Long workitemID) throws Throwable {
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_Read");
		Document doc = DocumentUtil.newDocument(metaDataObject);
		DataTable targetTable = doc.get("OA_Read");
		String[] optid = optIds.split(",");
		for (String reader : optid) {
			doc.setNew();
			Long ReadUser = TypeConvertor.toLong(reader);
			targetTable.append();
			targetTable.setLong("ReadUser", ReadUser);
			targetTable.setInt("Status", 10);
			targetTable.setLong("SendUser", context.getEnv().getUserID());
			targetTable.setDateTime("SendTime", sendTime);
			targetTable.setString("Opinion", opinion);
			targetTable.setString("BillKey", billKey);
			targetTable.setLong("BillOID", oid);
			targetTable.setLong("WorkitemID", workitemID);
		}
		DefaultContext newContext = new DefaultContext(context);
		SaveData saveData = new SaveData(metaDataObject, null, doc);
		saveData.save(newContext);
		return true;
	}

}
