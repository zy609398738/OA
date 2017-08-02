package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DicBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 职务
 * 
 * @author zhoukaihe
 *
 */
public class Duty extends DicBase {
	/**
	 * 父节点
	 */
	private Duty parentID;

	/**
	 * 父节点
	 * 
	 * @return 父节点
	 */
	public Duty getParentID() {
		return parentID;
	}

	/**
	 * 父节点
	 * 
	 * @param parentID
	 *            父节点
	 */
	public void setParentID(Duty parentID) {
		this.parentID = parentID;
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            头表数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		super.loadData(dt);
		Duty duty = getContext().getDutyMap().get(dt.getLong("ParentID"));
		setParentID(duty);

	}

	/**
	 * 构造职务对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public Duty(OAContext context) {
		super(context);
	}
}
