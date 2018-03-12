package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;
/**
 * 选择规则参数明细集合
 * @author zhoukh
 *
 */
public class SelRuleParameterMap extends DtlBaseMap<String, SelRuleParameter, SelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public SelRuleParameterMap(OAContext context, SelRule selRule) {
		super(context, selRule);
	}

	
	
	public void put(SelRuleParameter para){
		super.put(para.getParaKey(),para);
	}
	
	public SelRuleParameter get(String key){
		return super.get(key);
	}
	
	public Object getValue(String key){
		SelRuleParameter para = get(key);
		if (para != null) {
			return para.getParaValue();
		}
		return null;
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
		while (dt.next()) {
			SelRuleParameter dtl = new SelRuleParameter(getContext(), getHeadBase());
			dtl.loadData(dt);
			put(dt.getString("ParaKey"), dtl);
		}
	}
}
