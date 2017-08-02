package com.bokesoft.oa.mid.wf.base;

import java.util.LinkedHashMap;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 人员选择明细集合
 * 
 * @author zhoukaihe
 *
 */
public class OperatorSelDtlMap extends DtlBaseMap<Long, OperatorSelDtl, OperatorSel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 按类型存放的人员选择明细集合
	 */
	private LinkedHashMap<Integer, OperatorSelDtlMap> typeMap;

	/**
	 * 按类型存放的人员选择明细集合
	 * 
	 * @return 按类型存放的人员选择明细集合
	 */
	public LinkedHashMap<Integer, OperatorSelDtlMap> getTypeMap() {
		if (typeMap == null) {
			typeMap = new LinkedHashMap<Integer, OperatorSelDtlMap>();
		}
		return typeMap;
	}

	/**
	 * 按类型存放的人员选择明细集合
	 * 
	 * @param typeMap
	 *            按类型存放的人员选择明细集合
	 */
	public void setTypeMap(LinkedHashMap<Integer, OperatorSelDtlMap> typeMap) {
		this.typeMap = typeMap;
	}

	/**
	 * 构造人员选择明细集合对象
	 * 
	 * @param context
	 *            OA上下文对象
	 * @param operatorSel
	 *            人员选择
	 */
	public OperatorSelDtlMap(OAContext context, OperatorSel operatorSel) {
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
		LinkedHashMap<Integer, OperatorSelDtlMap> typeMap = getTypeMap();
		OAContext context = getContext();
		OperatorSel operatorSel = getHeadBase();
		dt.beforeFirst();
		while (dt.next()) {
			OperatorSelDtl dtl = new OperatorSelDtl(getContext(), operatorSel);
			dtl.loadData(dt);
			put(dtl.getOID(), dtl);
			Integer type = dtl.getOptType();
			OperatorSelDtlMap operatorSelDtlMap = typeMap.get(type);
			if (operatorSelDtlMap == null) {
				operatorSelDtlMap = new OperatorSelDtlMap(context, operatorSel);
				typeMap.put(type, operatorSelDtlMap);
			}
			operatorSelDtlMap.put(dtl.getOID(), dtl);
		}
	}

	/**
	 * 获得数据集字段列的字符串结果
	 * 
	 * @param dt
	 *            数据集
	 * @param colName
	 *            字段列名
	 * @param sSepSign
	 *            字符串中的分隔符
	 * @return 数据集字段列的字符串结果
	 * @throws Throwable
	 */
	public String geParticipatortIDs(Integer type) {
		return geParticipatortIDs(type, ",");
	}

	/**
	 * 获得数据集字段列的字符串结果
	 * 
	 * @param dt
	 *            数据集
	 * @param sSepSign
	 *            字符串中的分隔符
	 * @return 数据集字段列的字符串结果
	 * @throws Throwable
	 */
	public String geParticipatortIDs(Integer type, String sSepSign) {
		OperatorSelDtlMap operatorSelDtlMap = getTypeMap().get(type);
		String ids = "";
		if (operatorSelDtlMap == null || operatorSelDtlMap.size() <= 0) {
			return ids;
		}
		StringBuffer ret = new StringBuffer();
		for (OperatorSelDtl operatorSelDtl : operatorSelDtlMap.values()) {
			ret.append(sSepSign);
			ret.append(operatorSelDtl.getOptID());
		}
		ids = ret.toString();
		if (ids.length() > 0) {
			ids = ids.substring(sSepSign.length());
		}
		return ids;
	}
}
