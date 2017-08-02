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
 * 根据人员同步所有操作员
 * 
 * @author minjian
 *
 */
public class GenOperatorAll implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {

		return genOperatorAll(paramDefaultContext);
	}

	/**
	 * 根据人员同步所有操作员
	 * 
	 * @return 同步完成返回true
	 * @throws Throwable
	 */
	public Boolean genOperatorAll(DefaultContext context) throws Throwable {
		String sql = "select e.oid empID,e.code,e.name,e.DeptID,coalesce(o.oid,-1) optID from OA_Employee_H e left join SYS_Operator o  on e.oid=o.EmpID";

		// 通过上下文可以获取IDBManager,用于Sql执行
		IDBManager dbManager = context.getDBManager();
		DataTable dtQuery = dbManager.execPrepareQuery(sql);
		String operatorKey = "Operator";
		dtQuery.beforeFirst();
		while (dtQuery.next()) {
			// 创建数据对象
			MetaDataObject operatorDo = MetaFactory.getGlobalInstance().getDataObject(operatorKey);
			// 通过数据对象,创建Document对象
			Document operatorDoc = DocumentUtil.newDocument(operatorDo);
			long optID = dtQuery.getLong("optID");
			long empID = dtQuery.getLong("empID");
			String empDtlSql = "Select RoleID from OA_Employee_Role where soid=?";
			DataTable empRoleDt = dbManager.execPrepareQuery(empDtlSql, empID);
			// 如果为空，插入，否则更新
			if (optID <= 0) {
				operatorDoc.setNew();
				DataTable operatorDt = operatorDoc.get("SYS_Operator");
				// operatorDt.insert();

				// OAContext oac = new OAContext(context);
				// Operator operator = new Operator(oac);
				// operator.loadData(operatorDt);
				operatorDt.setString("Code", dtQuery.getString("Code"));
				operatorDt.setString("Name", dtQuery.getString("Name"));
				operatorDt.setLong("EmpID", empID);
				operatorDt.setLong("DeptID", dtQuery.getLong("DeptID"));

				DataTable roleDt = operatorDoc.get("SYS_OperatorRole");
				empRoleDt.beforeFirst();
				while (empRoleDt.next()) {
					roleDt.append();
					roleDt.setLong("Role", empRoleDt.getLong("RoleID"));
				}
			} else {
				operatorDoc.setModified();
				// long operatorOid = dtQuery.getLong("empID");
				LoadData loadData = new LoadData(operatorKey, optID);
				DefaultContext newContext = new DefaultContext(context);
				operatorDoc = loadData.load(newContext, operatorDoc);
				DataTable operatorDt = operatorDoc.get("SYS_Operator");
				operatorDt.setString("Code", dtQuery.getString("Code"));
				operatorDt.setString("Name", dtQuery.getString("Name"));
				operatorDt.setLong("DeptID", dtQuery.getLong("DeptID"));
				DataTable roleDt = operatorDoc.get("SYS_OperatorRole");

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
						roleDt.setLong("Role", roleID);
					}
				}
			}
			DocumentUtil.calcSequence(operatorDoc);
			// 保存Document
			SaveData saveData = new SaveData(operatorDo, null, operatorDoc);
			DefaultContext newContext = new DefaultContext(context);
			operatorDoc = saveData.save(newContext);
		}

		return true;
	}
}
