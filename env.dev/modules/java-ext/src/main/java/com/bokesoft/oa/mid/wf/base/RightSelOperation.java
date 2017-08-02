package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillDtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作选择明细
 * 
 * @author minjian
 *
 */
public class RightSelOperation extends BillDtlBase<RightSel> {
	/**
	 * 操作标识
	 */
	private String operationKey;

	/**
	 * 操作标识
	 * 
	 * @return 操作标识
	 */
	public String getOperationKey() {
		return operationKey;
	}

	/**
	 * 操作标识
	 * 
	 * @param operationKey
	 *            操作标识
	 */
	public void setOperationKey(String operationKey) {
		this.operationKey = operationKey;
	}

	/**
	 * 操作名称
	 */
	private String operationName;

	/**
	 * 操作名称
	 * 
	 * @return 操作名称
	 */
	public String getOperationName() {
		return operationName;
	}

	/**
	 * 操作名称
	 * 
	 * @param operationName
	 *            操作名称
	 */
	public void setOperationName(String operationName) {
		this.operationName = operationName;
	}

	/**
	 * 可编辑
	 */
	private Integer operationEnable;

	/**
	 * 可编辑
	 * 
	 * @return 可编辑
	 */
	public Integer getOperationEnable() {
		return operationEnable;
	}

	/**
	 * 可编辑
	 * 
	 * @param operationEnable
	 *            可编辑
	 */
	public void setOperationEnable(Integer operationEnable) {
		this.operationEnable = operationEnable;
	}

	/**
	 * 构造操作选择明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param rightSel
	 *            权限选择
	 */
	public RightSelOperation(OAContext context, RightSel rightSel) {
		super(context, rightSel);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setOperationKey(dt.getString("OperationKey"));
		setOperationName(dt.getString("OperationName"));
		setOperationEnable(dt.getInt("OperationEnable"));
	}
}
