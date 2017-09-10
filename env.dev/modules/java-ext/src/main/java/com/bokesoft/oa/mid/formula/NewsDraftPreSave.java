package com.bokesoft.oa.mid.formula;

import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class NewsDraftPreSave extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		// 通过上下文获取Document
		Document doc = context.getDocument();
		// 通过Document获取数据对象
		MetaDataObject mdbo = doc.getMetaDataObject();
		// 通过上下文获取数据对象
		MetaDataObject dbo = context.getDataObject();
		// 经测试通过上下文获取数据对象与通过Document获取数据对象是同一个对象
		if (mdbo == dbo) {

		}
		// 通过数据对象可以获取主表表名
		String mainTable = doc.getMetaDataObject().getMainTableKey();
		// 通过Document获取数据源(DataTable,代替了以前的BKRowset)
		DataTable dt = doc.get(0);
		Object result = dt.getObject(1);
		long oid = doc.getOID();

		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execQuery("SELECT * FROM " + mainTable);
		// dbManager.execPrepareUpdate("", new Object[]{});
		result = dtQuery.getObject(1);
		// 创建数据对象
		MetaDataObject dbo2 = MetaFactory.getGlobalInstance().getDataObject("OA_NewsDraft");
		// 通过数据对象,创建Document对象
		Document doc2 = DocumentUtil.newDocument(dbo2);
		doc2.get(0).insert();
		doc2.get(0).setObject("No", "addByTest");
		DocumentUtil.calcSequence(doc2);
		// 保存Document
		// new SaveData(dbo2, null, doc2).save(context);
		// 根据Document对象的key和OID,载入指定的Document对象5
		Document doc3 = new LoadData("OA_NewsDraft", oid).load(context, null);
		doc3.getOID();
		return result;
	}
}
