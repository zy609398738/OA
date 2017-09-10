package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillDtlBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择明细
 * 
 * @author zhoukaihe
 *
 */
public class OperatorSelDtl extends BillDtlBase<OperatorSel> {
	/**
	 * 操作员标识
	 */
	private Long optID;

	/**
	 * 操作员标识
	 * 
	 * @return 操作员标识
	 */
	public Long getOptID() {
		return optID;
	}

	/**
	 * 操作员标识
	 * 
	 * @param optID
	 *            操作员标识
	 */
	public void setOptID(Long optID) {
		this.optID = optID;
	}

	/**
	 * 类型
	 */
	private Integer optType;

	/**
	 * 类型
	 * 
	 * @return 类型
	 */
	public Integer getOptType() {
		return optType;
	}

	/**
	 * 类型
	 * 
	 * @param optType
	 *            类型
	 */
	public void setOptType(Integer optType) {
		this.optType = optType;
	}

	/**
	 * 名称
	 */
	private String name;

	/**
	 * 名称
	 * 
	 * @return 名称
	 */
	public String getName() {
		return name;
	}

	/**
	 * 名称
	 * 
	 * @param name
	 *            名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 权限选择ID
	 */
	private Long rightSelID;

	/**
	 * 限选择ID
	 * 
	 * @return 限选择ID
	 */
	public Long getRightSelID() {
		return rightSelID;
	}

	/**
	 * 限选择ID
	 * 
	 * @param rightSelID
	 *            限选择ID
	 */
	public void setRightSelID(Long rightSelID) {
		this.rightSelID = rightSelID;
	}

	/**
	 * 权限选择
	 */
	private RightSel rightSel;

	/**
	 * 权限选择
	 * 
	 * @return 权限选择
	 * @throws Throwable
	 */
	public RightSel getRightSel() throws Throwable {
		if (rightSel == null) {
			if (rightSelID > 0) {
				rightSel = getContext().getRightSelMap().get(rightSelID);
				if (rightSel != null) {
					rightSel.setOperatorSelDtl(this);
				}
			}
			if (rightSel == null
					|| (rightSel.getRightSelFieldMap().size() <= 0 && rightSel.getRightSelOperationMap().size() <= 0)) {
				WorkflowDesigneDtl workflowDesigneDtl = getHeadBase().getWorkflowDesigneDtl();
				if (workflowDesigneDtl != null) {
					rightSel = workflowDesigneDtl.getRightSel();
				}
			}
		}
		return rightSel;
	}

	/**
	 * 权限选择
	 * 
	 * @param rightSel
	 *            权限选择
	 */
	public void setRightSel(RightSel rightSel) {
		this.rightSel = rightSel;
		setRightSelID(rightSel.getOID());
	}

	/**
	 * 构造操作选择明细对象
	 * 
	 * @param context
	 *            OA上下文
	 * @param operatorSel
	 *            操作选择
	 */
	public OperatorSelDtl(OAContext context, OperatorSel operatorSel) {
		super(context, operatorSel);
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
		setOptType(dt.getInt("OptType"));
		setOptID(dt.getLong("OptID"));
		setName(dt.getString("name"));
		setRightSelID(dt.getLong("RightSelOID"));
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void uploadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		setOptType(dt.getInt("OptType"));
		setOptID(dt.getLong("OptID"));
		setName(dt.getString("name"));
		setRightSelID(dt.getLong("RightSelOID"));
	}
}
