package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 消息设置明细集合
 * 
 * @author chenbiao
 *
 */
public class MessageSetDtlMap extends DtlBaseMap<Long, MessageSetDtl, MessageSet> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 构造消息设置明细集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param messageSet
	 *            消息设置
	 */
	public MessageSetDtlMap(OAContext context, MessageSet messageSet) {
		super(context, messageSet);
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
			MessageSetDtl messageSetDtl = new MessageSetDtl(getContext(), getHeadBase());
			messageSetDtl.loadData(dt);
			put(messageSetDtl.getOID(), messageSetDtl);
		}
	}
}
