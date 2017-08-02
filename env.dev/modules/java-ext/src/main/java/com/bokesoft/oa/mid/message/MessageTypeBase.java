package com.bokesoft.oa.mid.message;

import java.util.Date;
import java.util.List;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.GetValueStrBySql;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentFactory;

/**
 * 
 * @author chenbiao
 *
 */
public abstract class MessageTypeBase {
	public abstract Object sendMessage(OAContext oaContext, Message message) throws Throwable;

	public Boolean saveSendMessage(OAContext oaContext, Message message) throws Throwable {
		DefaultContext context=oaContext.getContext();
		DefaultContext newContext = new DefaultContext(context);
		DocumentFactory df = new DocumentFactory();
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_SendMessages");
		String receiveIDs = message.getReceiveIDs().getIds();
		String sql = "select Name from sys_operator where OID in (" + receiveIDs + ")";
		GetValueStrBySql getValueStrBySql = new GetValueStrBySql();
		String sendTo = getValueStrBySql.getValueStrBySql(newContext, sql, "Name", ",");
		Document d = df.newEmptyDocument(metaDataObject);
		d.setNew();
		DataTable receiveMainDt = d.get("OA_SendMessages_H");
		receiveMainDt.setLong("SendEmpID", message.getSendOptID());
		receiveMainDt.setDateTime("SendTime", message.getSendDate());
		receiveMainDt.setLong("MessageSet", message.getMessageSet().getOID());
		receiveMainDt.setInt("Status", 100);
		receiveMainDt.setString("Topic", message.getTopic());
		receiveMainDt.setString("Content", message.getContent());
		receiveMainDt.setString("SendTo", sendTo);
		receiveMainDt.setString("SendToIDs", receiveIDs);
		receiveMainDt.setString("BillKey", "OA_SendMessages");
		receiveMainDt.setString("Result", message.getResult());
		receiveMainDt.setLong("ClusterID", (long) -1);
		if (message.getSrcOid() > 0) {
			receiveMainDt.setString("SourceBillkey", message.getSrcBillKey());
			receiveMainDt.setString("SourceBillNO", message.getSrcBillNO());
			receiveMainDt.setLong("SourceOID", message.getSrcOid());
		}
		SaveData saveData = new SaveData(metaDataObject, null, d);
		d = saveData.save(newContext);
		return true;
	}

	public Boolean receiveMessage(DefaultContext context, Message message) throws Throwable {
		DocumentFactory df = new DocumentFactory();
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_ReceiveMessages");
		List<Long> receiveIDList = message.getReceiveIDs().getIdList();
		for (Long receiveID : receiveIDList) {
			Document d = df.newEmptyDocument(metaDataObject);
			d.setNew();
			DataTable receiveMainDt = d.get("OA_ReceiveMessages_H");
			receiveMainDt.setLong("SendEmpID", message.getSendOptID());
			receiveMainDt.setDateTime("SendTime", message.getSendDate());
			receiveMainDt.setLong("MessageSet", message.getMessageSet().getOID());
			receiveMainDt.setString("MessageType", message.getMessageSetDtl().getMessageType().getName());
			receiveMainDt.setDateTime("ReceiveTime", new Date());
			receiveMainDt.setInt("Status", 100);
			receiveMainDt.setString("Topic", message.getTopic());
			receiveMainDt.setString("Content", message.getContent());
			receiveMainDt.setString("SourceBillkey", message.getSrcBillKey());
			receiveMainDt.setString("SourceBillNO", message.getSrcBillNO());
			receiveMainDt.setLong("SourceOID", message.getSrcOid());
			receiveMainDt.setLong("ReceiveEmpID", receiveID);
			receiveMainDt.setString("BillKey", "OA_ReceiveMessages");
			receiveMainDt.setLong("ClusterID", (long) -1);
			SaveData saveData = new SaveData(metaDataObject, null, d);
			DefaultContext newContext = new DefaultContext(context);
			d = saveData.save(newContext);
		}
		return true;
	}
}
