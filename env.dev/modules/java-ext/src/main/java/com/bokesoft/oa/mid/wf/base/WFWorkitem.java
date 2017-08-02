package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程工作项
 * 
 * @author minjian
 *
 */
public class WFWorkitem extends DtlBase<WorkitemInf> {
	/**
	 * 工作项名称
	 */
	private String workitemName;

	/**
	 * 工作项名称
	 * 
	 * @return 工作项名称
	 */
	public String getWorkitemName() {
		return workitemName;
	}

	/**
	 * 工作项名称
	 * 
	 * @param workitemName
	 *            工作项名称
	 */
	public void setWorkitemName(String workitemName) {
		this.workitemName = workitemName;
	}

	/**
	 * 构造流程工作项对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param workitemInf
	 *            工作项信息
	 */
	public WFWorkitem(OAContext context, WorkitemInf workitemInf) {
		super(context, workitemInf);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOID(dt.getLong("WorkitemID"));
		setWorkitemName(dt.getString("WorkitemName"));
	}
}
