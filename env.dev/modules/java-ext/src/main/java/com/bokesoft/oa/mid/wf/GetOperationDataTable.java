package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Iterator;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.base.KeyPairCompositeObject;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.meta.form.MetaForm;
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
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		if (StringUtil.isBlankOrNull(formKey)) {
			return dt;
		}
		MetaForm metaForm = context.getVE().getMetaFactory().getMetaForm(formKey);
		if (metaForm == null) {
			return dt;
		}
		MetaOperationCollection moc = metaForm.getOperationCollection();
		dealOperationCollection(moc, dt);
		return dt;
	}

	private void dealOperationCollection(MetaOperationCollection moc, DataTable dt) {
		Iterator<KeyPairCompositeObject> it = moc.iterator();
		while (it.hasNext()) {
			KeyPairCompositeObject o = it.next();
			if (o instanceof MetaOperationCollection) {
				MetaOperationCollection metaOperationCollection = (MetaOperationCollection)o;
				dt.append();
				dt.setString("Operation_Key", metaOperationCollection.getKey());
				dt.setString("Operation_Name", metaOperationCollection.getCaption());
				dealOperationCollection(metaOperationCollection, dt);
			} else if (o instanceof MetaOperation) {
				MetaOperation metaOperation = (MetaOperation)o;
				dt.append();
				dt.setString("Operation_Key", metaOperation.getKey());
				dt.setString("Operation_Name", metaOperation.getCaption());
			}
		}
	}
}
