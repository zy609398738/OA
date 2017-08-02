package com.bokesoft.oa.mid.formula;

import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.mid.util.ContextBuilder;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

public class NewsDraftPostSave  extends BaseMidFunctionImpl  {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args,
			IExecutor iExecutor) throws Throwable {
		//创建数据对象
		MetaDataObject dbo2 = MetaFactory.getGlobalInstance().getDataObject("OA_Car");
		//通过数据对象,创建Document对象
		Document doc2 = DocumentUtil.newDocument(dbo2);
		doc2.setNew();
		doc2.get(0).setObject("code", "addByTest");
		DocumentUtil.calcSequence(doc2);
		//保存Document
		new SaveData(dbo2, null, doc2).save(context);
		//根据Document对象的key和OID,载入指定的Document对象5
		long oid2 = doc2.getOID();
		DefaultContext context2 =ContextBuilder.create();
		context2.getDBManager();
		return oid2;
	}	
}
