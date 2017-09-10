package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 下一步参与者集合
 * 
 * @author zhoukaihe
 *
 */
public class NextParticipatorMap extends BaseMap<Long, NextParticipator> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按照关键字符串存放的下一步参与者选择集合
	 */
	private LinkedHashMap<String, NextParticipatorMap> nextParticipatorMapMap;

	/**
	 * 按照关键字符串存放的下一步参与者选择集合
	 * 
	 * @return 按照关键字符串存放的下一步参与者选择集合
	 */
	public LinkedHashMap<String, NextParticipatorMap> getNextParticipatorMapMap() {
		if (nextParticipatorMapMap == null) {
			nextParticipatorMapMap = new LinkedHashMap<String, NextParticipatorMap>();
		}
		return nextParticipatorMapMap;
	}

	/**
	 * 按照关键字符串存放的下一步参与者选择集合
	 * 
	 * @param nextParticipatorMapMap
	 *            按照关键字符串存放的下一步参与者选择集合
	 */
	public void setNextParticipatorMapMap(LinkedHashMap<String, NextParticipatorMap> nextParticipatorMapMap) {
		this.nextParticipatorMapMap = nextParticipatorMapMap;
	}

	/**
	 * 构造下一步参与者集合对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public NextParticipatorMap(OAContext context) {
		super(context);
	}

	/**
	 * 获得下一步参与者
	 * 
	 * @param oid
	 *            下一步参与者标识
	 * @return 下一步参与者
	 * @throws Throwable
	 */
	public NextParticipator get(Long oid) throws Throwable {
		if (oid <= 0) {
			return null;
		}
		NextParticipator obj = super.get(oid);
		if (obj == null) {
			String headSql = "select * from OA_NextParticipator where OID>0 and oid=?";
			IDBManager dbm = getContext().getContext().getDBManager();
			DataTable headDt = dbm.execPrepareQuery(headSql, oid);
			headDt.beforeFirst();
			while (headDt.next()) {
				obj = new NextParticipator(getContext());
				obj.loadData(headDt);
				super.put(oid, obj);
			}
		}
		return obj;
	}

	/**
	 * 获得下一步参与者选择集合对象
	 * 
	 * @param workflowBillKey
	 *            流程单据Key
	 * @param workflowOID
	 *            流程单据ID
	 * @param workflowKey
	 *            流程Key
	 * @param nodeId
	 *            流程节点
	 * @return 下一步参与者选择对象
	 * @throws Throwable
	 */
	public NextParticipatorMap get(String workflowBillKey, Long workflowOID, String workflowKey, Long workitemID) throws Throwable {
		LinkedHashMap<String, NextParticipatorMap> map = getNextParticipatorMapMap();
		String key = NextParticipator.getSelectKey(workflowBillKey, workflowOID, workflowKey,workitemID);
		NextParticipatorMap obj = map.get(key);
		if (obj == null) {
			OAContext context = getContext();
			IDBManager dbm = context.getContext().getDBManager();
			String sqlWhere = NextParticipator.getSqlWhere(workflowBillKey, workflowOID, workflowKey, workitemID);
			String headSql = "select * from OA_NextParticipator where";
			String nextParticipatorSql = headSql + sqlWhere;
			DataTable headDt = dbm.execPrepareQuery(nextParticipatorSql);
			String formKey = "";
			if (headDt.size() <= 0) {
				formKey = context.getAliasKey(workflowBillKey);
				sqlWhere = NextParticipator.getSqlWhere(formKey, workflowOID, workflowKey, workitemID);
				nextParticipatorSql = headSql + sqlWhere;
				headDt = dbm.execPrepareQuery(nextParticipatorSql);
			}
			if (headDt.size() > 0) {
				obj = new NextParticipatorMap(context);
				headDt.beforeFirst();
				while (headDt.next()) {
					Long oid = headDt.getLong("oid");
					NextParticipator nextParticipator = super.get(oid);
					if (nextParticipator == null) {
						nextParticipator = new NextParticipator(context);
						nextParticipator.loadData(headDt);
						super.put(oid, nextParticipator);
					}
					obj.put(oid, nextParticipator);
				}
				map.put(key, obj);
				// 因为下一节点指定参与者是一份临时记录的数据，获取下一节点指定参与者之后，立即清除下一节点指定参与者记录,防止有多余的数据出现
				String deleteSql = "delete from OA_NextParticipator where WorkflowBillKey=? and WorkflowOID=? and WorkflowKey=? and WorkitemID=?";
				dbm.execPrepareUpdate(deleteSql, workflowBillKey, workflowOID, workflowKey, workitemID);
			}
		}
		return obj;
	}

	/**
	 * 
	 * 获得下一步参与者ID字符串
	 * 
	 * @param workflowBillKey
	 *            流程单据Key
	 * @param workflowOID
	 *            流程单据ID
	 * @param workflowKey
	 *            流程Key
	 * @param nodeId
	 *            流程节点
	 * @param sep
	 *            ID之间的分隔符
	 * @return 下一步参与者ID字符串
	 * @throws Throwable
	 */
	public String getIDs(String workflowBillKey, Long workflowOID, String workflowKey, Long workitemID,
			String sep) throws Throwable {
		StringBuffer sb = new StringBuffer();
		NextParticipatorMap map = get(workflowBillKey, workflowOID, workflowKey, workitemID);
		if (map == null || map.size() <= 0) {
			return sb.toString();
		}
		for (NextParticipator nextParticipator : map.values()) {
			Long oid = nextParticipator.getParticipatorID();
			sb.append(sep);
			sb.append(oid);
		}
		String ids = "";
		if (sb.length() > 0) {
			ids = sb.substring(sep.length());
		}
		return ids;
	}
}
