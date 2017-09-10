package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.def.ControlType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.form.component.MetaComponent;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListView;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListViewColumn;
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumn;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumnCollection;
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
		String fieldKeyTag = "Field_Key";
		String fieldNameTag = "Field_Name";
		for (MetaComponent mc : mcList) {
			String mcKey = mc.getKey();
			String mcName = mc.getCaption();
			if (isInclude(mcKey, mcName, fieldKey, fieldName)) {
				dt.append();
				dt.setString(fieldKeyTag, mcKey);
				dt.setString(fieldNameTag, mcName);
			}
			if (mc.getControlType() == ControlType.GRID) {
				MetaGrid metaGrid = (MetaGrid) mc;
				MetaGridColumnCollection col = metaGrid.getColumnCollection();
				setFieldData(dt, fieldKeyTag, fieldNameTag, fieldKey, fieldName, col);
			} else if (mc.getControlType() == ControlType.LISTVIEW) {
				MetaListView metaListView = (MetaListView) mc;
				for (MetaListViewColumn metaListViewColumn : metaListView.getColumnCollection()) {

					String key = metaListViewColumn.getKey();
					String name = metaListViewColumn.getCaption();
					if (!isInclude(key, name, fieldKey, fieldName)) {
						continue;
					}
					dt.append();
					dt.setString(fieldKeyTag, key);
					dt.setString(fieldNameTag, name);
				}
			}
		}
		return dt;
	}

	/**
	 * 设置字段的数据集
	 * 
	 * @param dt
	 *            字段的数据集
	 * @param fieldKeyTag
	 *            数据集中字段Key列名
	 * @param fieldNameTag
	 *            数据集中字段名列名
	 * @param fieldKey
	 *            要查询的字段Key
	 * @param fieldName
	 *            要查询的字段名
	 * @param metaGridColumnCollection
	 *            表格列集合
	 */
	private void setFieldData(DataTable dt, String fieldKeyTag, String fieldNameTag, String fieldKey, String fieldName,
			MetaGridColumnCollection metaGridColumnCollection) {
		for (MetaGridColumn metaGridColumn : metaGridColumnCollection) {
			String key = metaGridColumn.getKey();
			String name = metaGridColumn.getCaption();
			if (!isInclude(key, name, fieldKey, fieldName)) {
				continue;
			}
			dt.append();
			dt.setString(fieldKeyTag, key);
			dt.setString(fieldNameTag, name);
			MetaGridColumnCollection col = metaGridColumn.getColumnCollection();
			if (col != null && col.size() > 0) {
				setFieldData(dt, fieldKeyTag, fieldNameTag, fieldKey, fieldName, col);
			}
		}
	}

	/**
	 * 是否包含标识或名称
	 * 
	 * @param key
	 *            字段标识
	 * @param name
	 *            字段名称
	 * @param fieldKey
	 *            标识
	 * @param fieldName
	 *            名称
	 * @return 包含标识或名称返回true,否则返回false
	 */
	private Boolean isInclude(String key, String name, String fieldKey, String fieldName) {
		if (StringUtil.isBlankOrNull(key)) {
			return false;
		}
		if (!StringUtil.isBlankOrNull(fieldKey) && key.toUpperCase().indexOf(fieldKey.toUpperCase()) < 0) {
			return false;
		}
		if (!StringUtil.isBlankOrNull(fieldName) && name.indexOf(fieldName) < 0) {
			return false;
		}
		return true;
	}
}
