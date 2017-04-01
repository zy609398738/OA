package com.bokesoft.oa.mid.message;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.config.Configuration;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.yigo.mid.base.DefaultContext;
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
	 * 
	 * @param context
	 */
	public MessageSetDtlMap(DefaultContext context) {
		super(context);
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
		Settings settings = Configuration.getConfiguration().getMap("SystemMessage").getMap("MessageType");
		while (dt.next()) {
			MessageSetDtl messageSetDtl = new MessageSetDtl(getContext());
			messageSetDtl.loadData(dt);
			String type = dt.getString("MessageType");
			Settings messageType = settings.getMap(type);
			messageSetDtl.setMessageType(messageType);
			messageSetDtl.setIsSucceed(dt.getInt("IsSucceed") == 1 ? true : false);
			put(messageSetDtl.getOid(), messageSetDtl);
		}
	}
}
