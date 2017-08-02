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
 * 通过查询条件获取字段的数据集
 * 
 * @author minjian
 *
 */
public class GetFieldDataTableByQuery implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFieldDataTableByQuery(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toString(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 通过查询条件获取字段的数据集
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据的Key
	 * @param fieldKey
	 *            字段key
	 * @param fieldName
	 *            名称
	 * @return 表的所有字段
	 * @throws Throwable
	 */
	private DataTable getFieldDataTableByQuery(DefaultContext context, String formKey, String fieldKey,
			String fieldName) throws Throwable {
		List<MetaComponent> mcList = context.getVE().getMetaFactory().getMetaForm(formKey).getAllComponents();
		String sql = "Select '' Field_Key,'' Field_Name from OA_RightSel_F where 1=2";
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		for (MetaComponent mc : mcList) {
			String key = mc.getKey();
			String name = mc.getCaption();
			if (StringUtil.isBlankOrNull(key)) {
				continue;
			}
			if (!StringUtil.isBlankOrNull(fieldKey) && key.toUpperCase().indexOf(fieldKey.toUpperCase()) < 0) {
				continue;
			}
			if (!StringUtil.isBlankOrNull(fieldName) && name.indexOf(fieldName) < 0) {
				continue;
			}
			dt.append();
			dt.setString("Field_Key", key);
			dt.setString("Field_Name", name);
		}
		return dt;
	}

}
