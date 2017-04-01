package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.base.KeyPairCompositeObject;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 根据操作模板设置操作
 * 
 * @author minjian
 * 
 */
public class SetOperationByKey implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return setOperationByKey(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toBoolean(paramArrayList.get(2)));
	}

	/**
	 * 根据操作模板设置操作
	 * 
	 * @param context
	 *            中间层对象
	 * @param formKey
	 *            单据的Key
	 * @param operationKey
	 *            操作的Key
	 * @param codeReplace
	 *            是否替换Code和Name字段,true替换，false不替换
	 * @return 设置完成返回true
	 * @throws Throwable
	 */
	public static DataTable setOperationByKey(DefaultContext context, String formKey, String operationKey,
			Boolean codeReplace) throws Throwable {
		Document doc = context.getDocument();
		DataTable dt = doc.get("OA_OptModule_H");
		if (StringUtil.isBlankOrNull(operationKey)) {
			dt.setString("Code", "");
			dt.setString("Name", "");
			dt.setString("OptIcon", "");
			dt.setString("Action", "");
			dt.setString("OptEnable", "");
			dt.setString("OptVisible", "");
		} else {
			MetaOperationCollection moc = context.getVE().getMetaFactory().getMetaForm(formKey)
					.getOperationCollection();
			KeyPairCompositeObject kpco = moc.get(operationKey);
			if (kpco == null) {
				return dt;
			}
			MetaOperation mo = (MetaOperation) kpco;
			if (codeReplace) {
				dt.setString("Code", operationKey);
				dt.setString("Name", mo.getCaption());
			}
			dt.setString("OptIcon", mo.getIcon());
			dt.setString("Action", mo.getAction().getContent());
			dt.setString("OptEnable", mo.getEnable());
			dt.setString("OptVisible", mo.getVisible());
		}
		return dt;
	}
}
