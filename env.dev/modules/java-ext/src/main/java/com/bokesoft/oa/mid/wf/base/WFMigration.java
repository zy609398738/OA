package com.bokesoft.oa.mid.wf.base;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程迁移
 * 
 * @author chenbiao
 *
 */
public class WFMigration extends BillBase {
	/**
	 * 主题
	 */
	private String topic;

	/**
	 * 主题
	 * 
	 * @return 主题
	 */
	public String getTopic() {
		if (StringUtil.isBlankOrNull(topic)) {
			topic = getBillNO();
		}
		return topic;
	}

	/**
	 * 主题
	 * 
	 * @param topic主题
	 */
	public void setTopic(String topic) {
		this.topic = topic;
	}

	/**
	 * 单据编号
	 */
	private String billNO;

	/**
	 * 单据编号
	 * 
	 * @return 单据编号
	 */
	public String getBillNO() {
		return billNO;
	}

	/**
	 * 单据编号
	 * 
	 * @param billNO
	 *            单据编号
	 */
	public void setBillNO(String billNO) {
		this.billNO = billNO;
	}

	/**
	 * 构造流程工作项对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public WFMigration(OAContext context) {
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
		setOID(dt.getLong("billOID"));
		setTopic(dt.getString("topic"));
		setBillNO(dt.getString("billNO"));
	}
}
