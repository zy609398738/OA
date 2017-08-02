package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 操作选择明细集合
 * 
 * @author minjian
 *
 */
public class RightSelOperationMap extends DtlBaseMap<Long, RightSelOperation, RightSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照标识存放的操作选择集合
	 */
	private LinkedHashMap<String, RightSelOperation> rightSelOperationMap;

	/**
	 * 按照标识存放的操作选择集合
	 * 
	 * @return 按照标识存放的操作选择集合
	 */
	public LinkedHashMap<String, RightSelOperation> getRightSelOperationMap() {
		if (rightSelOperationMap == null) {
			rightSelOperationMap = new LinkedHashMap<String, RightSelOperation>();
		}
		return rightSelOperationMap;
	}

	/**
	 * 按照标识存放的操作选择集合
	 * 
	 * @param rightSelOperationMap
	 *            按照标识存放的操作选择集合
	 */
	public void setRightSelOperationMap(LinkedHashMap<String, RightSelOperation> rightSelOperationMap) {
		this.rightSelOperationMap = rightSelOperationMap;
	}

	/**
	 * 
	 * @param context
	 *            上下文对象 @ rightSel 权限选择
	 */
	public RightSelOperationMap(OAContext context, RightSel rightSel) {
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
		dt.beforeFirst();
		LinkedHashMap<String, RightSelOperation> rightSelDtlMap = getRightSelOperationMap();
		while (dt.next()) {
			RightSelOperation dtl = new RightSelOperation(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
			rightSelDtlMap.put(dtl.getOperationKey(), dtl);
		}
	}

	/**
	 * 获得操作选择明细
	 * 
	 * @param key
	 *            操作选择标识
	 * @return 操作选择明细
	 * @throws Throwable
	 */
	public RightSelOperation get(String key) throws Throwable {
		if (StringUtil.isBlankOrNull(key)) {
			return null;
		}
		LinkedHashMap<String, RightSelOperation> rightSelDtlMap = getRightSelOperationMap();
		RightSelOperation obj = rightSelDtlMap.get(key);
		return obj;
	}
}
