package com.bokesoft.oa.base;

import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.datatable.DataTableMetaData;

/**
 * 单据基础
 * 
 * @author minjian
 *
 */
public abstract class BillBase extends HeadBase {
	/**
	 * 单据编号
	 */
	private String billNo;

	/**
	 * 单据编号
	 * 
	 * @return 单据编号
	 */
	public String getBillNo() {
		return billNo;
	}

	/**
	 * 单据编号
	 * 
	 * @param billNo
	 *            单据编号
	 */
	public void setBillNo(String billNo) {
		this.billNo = billNo;
	}

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
		return topic;
	}

	/**
	 * 主题
	 * 
	 * @param topic
	 *            主题
	 */
	public void setTopic(String topic) {
		this.topic = topic;
	}

	/**
	 * 
	 * @param context
	 */
	public BillBase(OAContext context) {
		super(context);
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
		DataTableMetaData dataTableMetaData = dt.getMetaData();
		if (dataTableMetaData.constains("NO")) {
			setBillNo(dt.getString("NO"));
		}
		if (dataTableMetaData.constains("Topic")) {
			setTopic(dt.getString("Topic"));
		}
	}

	/**
	 * 获得单据编号等输出内容
	 * 
	 * @return 单据编号等输出内容
	 */
	public String getOutString() {
		String outStr = "";
		if (getBillNo() != null) {
			outStr = "，单据编号：" + getBillNo();
		}
		if (getTopic() != null) {
			outStr = "，主题：" + getTopic();
		}
		return outStr;
	}

	/**
	 * 重载
	 */
	public String toString() {
		String outStr = getOutString();
		return super.toString() + outStr;
	}

}
