package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Iterator;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.base.KeyPairCompositeObject;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 
 * 获取操作的数据集
 * 
 * @author minjian
 *
 */
public class GetOperationDataTable implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getOperationDataTable(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 获取操作的数据集
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据的Key
	 * @param sql
	 *            提供操作数据集数据结构的Sql
	 * @return 表的所有字段
	 * @throws Throwable
	 */
	private DataTable getOperationDataTable(DefaultContext context, String formKey, String sql) throws Throwable {
		MetaOperationCollection moc = context.getVE().getMetaFactory().getMetaForm(formKey).getOperationCollection();
		Iterator<KeyPairCompositeObject> i = moc.iterator();
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		while (i.hasNext()) {
			MetaOperation mo = (MetaOperation) i.next();
			dt.append();
			dt.setString("Operation_Key", mo.getKey());
			dt.setString("Operation_Name", mo.getCaption());
		}
		return dt;
	}

}
