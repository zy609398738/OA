package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 部门保存后执行事件
 * 
 * @author chenyf
 *
 */
public class TSL_DepartmentPostSaveImpl extends BaseMidFunctionImpl {
	// 根据code获取部门OID的SQL
	private static String SelectSQL = "select oid from OA_Department_H where code=?";
	// 更新上级部门节点的SQL
	private static String UpdateSQL = "Update OA_Department_H set parentid=? where oid=?";
	// 更新部门节点类型的SQL
	private static String UpdateSQL2 = "Update OA_Department_H set nodetype=1 where oid=?";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		// 获取配置对象工厂,工厂内可获取所有配置对象
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		// 获取数据对象
		MetaDataObject metaDataObject = metaFactory.getDataObject("OA_Department");
		// 获取主表
		MetaTable mainTable = metaDataObject.getMainTable();

		IDBManager dbManager = context.getDBManager();
		Document document = context.getDocument();
		DataTable dataTable = document.get(mainTable.getKey());
		// 获取Group_Parent字段值,判断是否有上级部门
		String code = TypeConvertor.toString(dataTable.getObject("Group_Parent"));
		if (code.isEmpty()) {
			return true;
		}
		DataTable dt = dbManager.execPrepareQuery(SelectSQL, code);
		// 如果有上级部门,更新数据
		if (dt.size() > 0) {
			long oid = TypeConvertor.toLong(dt.getObject("oid"));
			if (oid > 0) {
				context.getDBManager().execPrepareUpdate(UpdateSQL, oid, document.getOID());
				context.getDBManager().execPrepareUpdate(UpdateSQL2, oid);
			}
		}

		return true;
	}
}
