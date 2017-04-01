package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;

/**
 * 根据人员同步操作员
 * 
 * @author minjian
 *
 */
public class GenOperator implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {

		return genOperator(paramDefaultContext);
	}

	/**
	 * 根据人员同步操作员
	 * 
	 * @return 同步完成返回true
	 * @throws Throwable
	 */
	public Boolean genOperator(DefaultContext context) throws Throwable {
		// 通过上下文获取Document
		Document doc = context.getDocument();
		// 通过Document获取数据源(DataTable,代替了以前的BKRowset)
		DataTable empDt = doc.get("OA_Employee_H");
		long oid = doc.getOID();

		String sql = "select oid from SYS_Operator where EmpID=?";

		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql, oid);
		String operatorKey = "Operator";
		// 创建数据对象
		MetaDataObject operatorDo = MetaFactory.getGlobalInstance().getDataObject(operatorKey);
		// 通过数据对象,创建Document对象
		Document operatorDoc = DocumentUtil.newDocument(operatorDo);
		// 如果为空，插入，否则更新
		if (dtQuery.isEmpty()) {
			operatorDoc.setNew();
			DataTable operatorDt = operatorDoc.get("SYS_Operator");
			// operatorDt.insert();
			operatorDt.setObject("Code", empDt.getObject("Code"));
			operatorDt.setObject("Name", empDt.getObject("Name"));
			operatorDt.setObject("EmpID", oid);
			operatorDt.setObject("DeptID", empDt.getObject("DeptID"));

			DataTable roleDt = operatorDoc.get("SYS_OperatorRole");
			DataTable empRoleDt = doc.get("OA_Employee_Role");
			empRoleDt.beforeFirst();
			while (empRoleDt.next()) {
				roleDt.append();
				roleDt.setObject("Role", empRoleDt.getObject("RoleID"));
			}
		} else {
			operatorDoc.setModified();
			long operatorOid = dtQuery.getLong("oid");
			LoadData loadData = new LoadData(operatorKey, operatorOid);
			DefaultContext newContext=new DefaultContext(context);
			operatorDoc = loadData.load(newContext, operatorDoc);
			DataTable operatorDt = operatorDoc.get("SYS_Operator");
			operatorDt.setObject("Code", empDt.getObject("Code"));
			operatorDt.setObject("Name", empDt.getObject("Name"));
			operatorDt.setObject("DeptID", empDt.getObject("DeptID"));
			DataTable roleDt = operatorDoc.get("SYS_OperatorRole");
			DataTable empRoleDt = doc.get("OA_Employee_Role");
			roleDt.beforeFirst();
			roleDt.setShowDeleted(true);
			while (roleDt.next()) {
				long roleID = roleDt.getLong("Role");
				if (empRoleDt.findRow("RoleID", roleID) < 0) {
					roleDt.delete();
				}
			}
			roleDt.setShowDeleted(false);
			empRoleDt.beforeFirst();
			while (empRoleDt.next()) {
				long roleID = empRoleDt.getLong("RoleID");
				if (roleDt.findRow("Role", roleID) < 0) {
					roleDt.append();
					roleDt.setObject("Role", roleID);
				}
			}
		}
		DocumentUtil.calcSequence(operatorDoc);
		// 保存Document
		SaveData saveData = new SaveData(operatorDo, null, operatorDoc);
		DefaultContext newContext=new DefaultContext(context);
		operatorDoc = saveData.save(newContext);
		return true;
	}
}
