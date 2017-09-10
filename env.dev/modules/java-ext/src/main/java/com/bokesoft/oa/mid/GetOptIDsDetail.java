package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 根据操作员IDs生成操作员ID明细表
 * 
 * @author chenbiao
 *
 */
public class GetOptIDsDetail implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getOptIDsDetail(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toInteger(paramArrayList.get(2)));
	}

	/**
	 * 根据操作员IDs生成操作员ID明细表
	 * 
	 * @param context
	 *            上下文对象
	 * @return dataTable 数据源
	 * @return key 字段key
	 * @return type 类型
	 * 
	 * @throws Throwable
	 */
	public boolean getOptIDsDetail(DefaultContext context, String dataTable, String key, int type) throws Throwable {
		// 通过上下文获取Document
		Document doc = context.getDocument();
		// 通过Document获取数据源
		DataTable DT = doc.get(dataTable);
		long oid = doc.getOID();
		String string = DT.getString(key);
		if (string == null || string.length() <= 0) {
			return true;
		} else {
			String[] OptIDs = string.split(",");
			Long[] OptIDsL = new Long[OptIDs.length];
			for (int idx = 0; idx < OptIDs.length; idx++) {
				OptIDsL[idx] = Long.parseLong(OptIDs[idx]);
			}
			String sql = "select oid from OA_ParticipatorIDs_D where SOID = ? and OptType = ?";
			// 通过上下文可以获取IDBManager,用于Sql执行
			IDBManager dbManager = context.getDBManager();
			DataTable dtQuery = dbManager.execPrepareQuery(sql, oid, type);
			// 创建数据对象
			MetaDataObject MDDo = MetaFactory.getGlobalInstance().getDataObject("OA_ParticipatorIDs_D");
			// 通过数据对象,创建Document对象
			Document MDDoc = DocumentUtil.newDocument(MDDo);
			if (dtQuery.isEmpty()) {
				MDDoc.setNew();
				DataTable OptIDsDt = MDDoc.get("OA_ParticipatorIDs_D");
				for (int i = 0; i < OptIDsL.length; i++) {
					OptIDsDt.append();
					OptIDsDt.setObject("SOID", oid);
					OptIDsDt.setObject("OptID", OptIDsL[i]);
					OptIDsDt.setObject("OptType", type);
				}
			} else {
				MDDoc.setModified();
				DataTable OptIDsDt = MDDoc.get("OA_ParticipatorIDs_D");
				String sqlDet = "delete from OA_ParticipatorIDs_D where soid = ? and OptType = ? and OptID not in ("
						+ DT.getString("OptIDs") + ")";
				dbManager.execPrepareUpdate(sqlDet, oid, type);
				String sql1 = "select oid from OA_ParticipatorIDs_D where soid = ? and OptID = ? and OptType = ?";
				for (int i = 0; i < OptIDsL.length; i++) {
					DataTable dtQuery1 = dbManager.execPrepareQuery(sql1, oid, OptIDsL[i], type);
					if (dtQuery1.isEmpty()) {
						OptIDsDt.append();
						OptIDsDt.setObject("SOID", oid);
						OptIDsDt.setObject("OptID", OptIDsL[i]);
						OptIDsDt.setObject("OptType", type);
					}
				}

			}
			DocumentUtil.calcSequence(MDDoc);
			// 保存Document
			SaveData saveData = new SaveData(MDDo, null, MDDoc);
			DefaultContext newContext = new DefaultContext(context);
			MDDoc = saveData.save(newContext);
			return true;
		}
	}
}
