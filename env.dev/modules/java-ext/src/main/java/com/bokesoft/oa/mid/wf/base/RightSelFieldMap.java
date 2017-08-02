package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 字段选择明细集合
 * 
 * @author minjian
 *
 */
public class RightSelFieldMap extends DtlBaseMap<Long, RightSelField, RightSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照标识存放的字段选择集合
	 */
	private LinkedHashMap<String, RightSelField> rightSelFieldMap;

	/**
	 * 按照标识存放的字段选择集合
	 * 
	 * @return 按照标识存放的字段选择集合
	 */
	public LinkedHashMap<String, RightSelField> getRightSelFieldMap() {
		if (rightSelFieldMap == null) {
			rightSelFieldMap = new LinkedHashMap<String, RightSelField>();
		}
		return rightSelFieldMap;
	}

	/**
	 * 按照标识存放的字段选择集合
	 * 
	 * @param rightSelFieldMap
	 *            按照标识存放的字段选择集合
	 */
	public void setRightSelFieldMap(LinkedHashMap<String, RightSelField> rightSelFieldMap) {
		this.rightSelFieldMap = rightSelFieldMap;
	}

	/**
	 * 
	 * @param context
	 *            上下文对象 @ rightSel 权限选择
	 */
	public RightSelFieldMap(OAContext context, RightSel rightSel) {
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
		LinkedHashMap<String, RightSelField> rightSelDtlMap = getRightSelFieldMap();
		while (dt.next()) {
			RightSelField dtl = new RightSelField(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
			rightSelDtlMap.put(dtl.getFieldKey(), dtl);
		}
	}

	/**
	 * 获得字段选择明细
	 * 
	 * @param key
	 *            字段选择标识
	 * @return 字段选择明细
	 * @throws Throwable
	 */
	public RightSelField get(String key) throws Throwable {
		if (StringUtil.isBlankOrNull(key)) {
			return null;
		}
		LinkedHashMap<String, RightSelField> rightSelDtlMap = getRightSelFieldMap();
		RightSelField obj = rightSelDtlMap.get(key);
		return obj;
	}
}
