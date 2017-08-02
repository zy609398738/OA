package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.form.component.MetaComponent;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 
 * 获取字段的数据集
 * 
 * @author minjian
 *
 */
public class GetFieldDataTable implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFieldDataTable(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 获取字段的数据集
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据的Key
	 * @param sql
	 *            提供字段数据集数据结构的Sql
	 * @return 表的所有字段
	 * @throws Throwable
	 */
	private DataTable getFieldDataTable(DefaultContext context, String formKey, String sql) throws Throwable {
		List<MetaComponent> mcList = context.getVE().getMetaFactory().getMetaForm(formKey).getAllComponents();
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		for (MetaComponent mc : mcList) {
			String key = mc.getKey();
			if (StringUtil.isBlankOrNull(key)) {
				continue;
			}
			dt.append();
			dt.setString("Field_Key", mc.getKey());
			dt.setString("Field_Name", mc.getCaption());
		}
		return dt;
	}

}
