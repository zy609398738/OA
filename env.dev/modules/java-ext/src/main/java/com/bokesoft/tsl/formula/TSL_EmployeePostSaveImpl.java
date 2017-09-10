package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentFactory;

public class TSL_EmployeePostSaveImpl extends BaseMidFunctionImpl {
	private static String UpdateSQL = "update OA_Department_H set DeptHeadID=?, DeptHeadName=? where Group_LdID=? ";

	private static String UpdatePrimTermSQL = "update OA_Department_H set GPMEM_IsPrimTerm=1 where DeptHeadID=? and oid=?";

	private static String QuerySQL = "select OID from SYS_Operator where EmpID=?";

	private static String roleQuerySql = "select oid from SYS_Role where code = ?";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		MetaDataObject employeeDataObject = metaFactory.getDataObject("OA_Employee");
		MetaTable mainTable = employeeDataObject.getMainTable();

		Document document = context.getDocument();

		// 更新部门主管
		String employeeCode = document.get(mainTable.getKey()).getString("Code");
		String employeeName = document.get(mainTable.getKey()).getString("Name");
		long employeeDep = document.get(mainTable.getKey()).getLong("DeptID");
		context.getDBManager().execPrepareUpdate(UpdateSQL, document.getOID(), employeeName, employeeCode);
		context.getDBManager().execPrepareUpdate(UpdatePrimTermSQL, document.getOID(), employeeDep);

		// 更新操作员
		MetaDataObject operatorDataObject = metaFactory.getDataObject("Operator");
		Document operatorDocument = null;
		long employeeID = document.getOID();
		// 判断操作员是否存在
		DefaultContext newContext = new DefaultContext(context);
		DataTable dt = context.getDBManager().execPrepareQuery(QuerySQL, employeeID);
		if (dt.size() > 0) {
			// 同步已存在操作员
			long operatorID = TypeConvertor.toLong(dt.getObject(0, 0));
			// 获取OID加载document
			LoadData ld = new LoadData("Operator", operatorID);
			operatorDocument = ld.load(newContext, null);
		} else {
			// 新增document
			DocumentFactory df = new DocumentFactory();
			operatorDocument = df.newEmptyDocument(operatorDataObject);
			operatorDocument.setNew();
		}

		// 更新Document数据
		DataTable employeeTable = document.get(employeeDataObject.getMainTableKey());
		DataTable operatorTable = operatorDocument.get(operatorDataObject.getMainTableKey());
		operatorTable.setObject("Code", employeeTable.getObject("Code"));
		operatorTable.setObject("Name", employeeTable.getObject("Name"));
		operatorTable.setObject("EmpID", employeeID);
		operatorTable.setObject("DeptID", employeeTable.getObject("DeptID"));

		dt = context.getDBManager().execPrepareQuery(roleQuerySql, "GeneralUser");
		if (dt.first()) {
			DataTable roleTable = operatorDocument.get("SYS_OperatorRole");
			if(roleTable.size()==0){
				roleTable.append();
				roleTable.setObject("Role", dt.getLong("oid"));	
			}
		}

		// 保存document
		SaveData sd = new SaveData(operatorDataObject, null, operatorDocument);
		sd.save(newContext);

		return true;
	}
}
