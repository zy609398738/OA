package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.DeleteData;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentFactory;

/**
 * 根据OID删除单据
 * 
 * @author zkh
 *
 */
public class DeleteBillByOID implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return deleteBillByOID(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)), paramArrayList);
	}

	/**
	 * 根据OID删除单据
	 * 
	 * @param context
	 *            上下文对象
	 * @param dataObjectKey
	 *            数据对象的Key
	 * @param oid
	 *            单据OID
	 * @return 删除成功返回true
	 * @throws Throwable
	 */
	public Boolean deleteBillByOID(DefaultContext context, String dataObjectKey, ArrayList<Object> paramArrayList)
			throws Throwable {
		// 创建数据对象
		MetaDataObject mdo = MetaFactory.getGlobalInstance().getDataObject(dataObjectKey);
		DefaultContext newContext = new DefaultContext(context);
		newContext.setDataObject(mdo);
		// 通过数据对象,创建Document对象
		DocumentFactory df = new DocumentFactory();
		Document doc = df.newEmptyDocument(mdo);
		for (int i = 1; i < paramArrayList.size(); i++) {
			Long oid = TypeConvertor.toLong(paramArrayList.get(i));
			if (oid <= 0) {
				continue;
			}
			Long newOid = TypeConvertor.toLong(oid);
			LoadData loadData = new LoadData(dataObjectKey, newOid);
			doc = loadData.load(newContext, doc);
			newContext.getContextContainer().putContext(newOid, DefaultContext.TYPE, newContext);
			DeleteData deleteData = new DeleteData(mdo, doc);
			deleteData.delete(newContext);
		}

		return true;
	}
}
