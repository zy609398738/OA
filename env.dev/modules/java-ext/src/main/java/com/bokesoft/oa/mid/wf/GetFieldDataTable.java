package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.List;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.def.ControlType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.form.component.MetaComponent;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListView;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListViewColumn;
import com.bokesoft.yigo.meta.form.component.control.listview.MetaListViewColumnCollection;
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumn;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumnCollection;
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
	public static DataTable getFieldDataTable(DefaultContext context, String formKey, String sql) throws Throwable {
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		if (StringUtil.isBlankOrNull(formKey)) {
			return dt;
		}
		MetaForm metaForm = context.getVE().getMetaFactory().getMetaForm(formKey);
		if (metaForm == null) {
			return dt;
		}
		List<MetaComponent> mcList = context.getVE().getMetaFactory().getMetaForm(formKey).getAllComponents();
		String fieldKeyTag = "Field_Key";
		String fieldNameTag = "Field_Name";
		for (MetaComponent mc : mcList) {
			String key = mc.getKey();
			if (StringUtil.isBlankOrNull(key)) {
				continue;
			}
			dt.append();
			dt.setString(fieldKeyTag, key);
			dt.setString(fieldNameTag, mc.getCaption());

			if (mc.getControlType() == ControlType.GRID) {
				MetaGrid metaGrid = (MetaGrid) mc;
				MetaGridColumnCollection col = metaGrid.getColumnCollection();
				setFieldData(dt, fieldKeyTag, fieldNameTag, col);
			} else if (mc.getControlType() == ControlType.LISTVIEW) {
				MetaListView metaListView = (MetaListView) mc;
				MetaListViewColumnCollection col = metaListView.getColumnCollection();
				for (MetaListViewColumn metaListViewColumn : col) {
					String columnKey = metaListViewColumn.getKey();
					if (StringUtil.isBlankOrNull(columnKey)) {
						continue;
					}
					dt.append();
					dt.setString(fieldKeyTag, columnKey);
					dt.setString(fieldNameTag, metaListViewColumn.getCaption());
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
	 * @param metaGridColumnCollection
	 *            表格列集合
	 */
	public static void setFieldData(DataTable dt, String fieldKeyTag, String fieldNameTag,
			MetaGridColumnCollection metaGridColumnCollection) {
		for (MetaGridColumn metaGridColumn : metaGridColumnCollection) {
			String columnKey = metaGridColumn.getKey();
			if (StringUtil.isBlankOrNull(columnKey)) {
				continue;
			}
			dt.append();
			dt.setString(fieldKeyTag, columnKey);
			dt.setString(fieldNameTag, metaGridColumn.getCaption());
			MetaGridColumnCollection col = metaGridColumn.getColumnCollection();
			if (col != null && col.size() > 0) {
				setFieldData(dt, fieldKeyTag, fieldNameTag, col);
			}
		}
	}
}
