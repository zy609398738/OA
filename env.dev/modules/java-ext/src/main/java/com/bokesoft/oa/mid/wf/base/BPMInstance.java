package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程实例
 * 
 * @author minjian
 *
 */
public class BPMInstance extends BillBase {

	/**
	 * 流程的Key
	 */
	private String processkey;

	/**
	 * 流程的Key
	 * 
	 * @return 流程的Key
	 */
	public String getProcesskey() {
		return processkey;
	}

	/**
	 * 流程的Key
	 * 
	 * @param processkey
	 *            流程的Key
	 */
	public void setProcesskey(String processkey) {
		this.processkey = processkey;
	}

	/**
	 * 构造流程实例对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public BPMInstance(OAContext context) {
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
		setOID(dt.getLong("InstanceID"));
		setProcesskey(dt.getString("Processkey"));
	}
}
