package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;

/**
 * 
 * 获取表字段
 * 
 * @author zhoukaihe
 *
 */
public class GetTableFields implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getTableFields(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 获取表字段
	 * 
	 * @param context
	 *            上下文对象
	 * @param FieldKey
	 *            字段Key
	 * @return 表的所有字段
	 * @throws Throwable
	 */
	private Object getTableFields(DefaultContext context, String FieldKey) throws Throwable {
		if (FieldKey == "" || FieldKey.isEmpty()) {
			throw new Error("请先填写正确的数据来源语句");
		}
		String sql = "select * from (" + FieldKey + ") h where 1=2";
		DataTable dt = context.getDBManager().execPrepareQuery(sql);
		DataTableMetaData md = dt.getMetaData();
		String dropItem = "";
		for (int i = 0; i < md.getColumnCount(); i++) {
			ColumnInfo col = md.getColumnInfo(i);
			String billKey = col.getColumnKey();
			dropItem = dropItem + ";" + billKey + "," + billKey;
		}

		return dropItem;
	}

}
