package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 审批操作明细集合
 * 
 * @author zhoukaihe
 *
 */
public class OperationSelDtlMap extends DtlBaseMap<Long, OperationSelDtl, OperationSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 按照代码存放的审批操作集合
	 */
	private LinkedHashMap<String, OperationSelDtl> operationSelDtlMap;

	/**
	 * 按照代码存放的审批操作集合
	 * 
	 * @return 按照代码存放的审批操作集合
	 */
	public LinkedHashMap<String, OperationSelDtl> getOperationSelDtlMap() {
		if (operationSelDtlMap == null) {
			operationSelDtlMap = new LinkedHashMap<String, OperationSelDtl>();
		}
		return operationSelDtlMap;
	}

	/**
	 * 按照代码存放的审批操作集合
	 * 
	 * @param operationSelDtlMap
	 *            按照代码存放的审批操作集合
	 */
	public void setOperationSelDtlMap(LinkedHashMap<String, OperationSelDtl> operationSelDtlMap) {
		this.operationSelDtlMap = operationSelDtlMap;
	}

	/**
	 * 
	 * @param context
	 *            上下文对象 @ operationSel 操作选择
	 */
	public OperationSelDtlMap(OAContext context, OperationSel operationSel) {
		super(context, operationSel);
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
		LinkedHashMap<String, OperationSelDtl> operationSelDtlMap = getOperationSelDtlMap();
		while (dt.next()) {
			OperationSelDtl dtl = new OperationSelDtl(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
			operationSelDtlMap.put(dtl.getOperation().getCode(), dtl);
		}
	}

	/**
	 * 获得审批操作明细
	 * 
	 * @param code
	 *            审批操作代码
	 * @return 审批操作明细
	 * @throws Throwable
	 */
	public OperationSelDtl get(String code) throws Throwable {
		if (StringUtil.isBlankOrNull(code)) {
			return null;
		}
		LinkedHashMap<String, OperationSelDtl> operationSelDtlMap = getOperationSelDtlMap();
		OperationSelDtl obj = operationSelDtlMap.get(code);
		return obj;
	}
}
