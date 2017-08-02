package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 节点完成集合
 * 
 * @author minjian
 *
 */
public class NodePropertyFinishMap extends DtlBaseMap<Long, NodePropertyFinish, NodeProperty> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造节点完成集合对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param nodeProperty
	 *            流程节点属性
	 */
	public NodePropertyFinishMap(OAContext context, NodeProperty nodeProperty) {
		super(context, nodeProperty);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		dt.beforeFirst();
		while (dt.next()) {
			NodePropertyFinish dtl = new NodePropertyFinish(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
		}
	}
}
