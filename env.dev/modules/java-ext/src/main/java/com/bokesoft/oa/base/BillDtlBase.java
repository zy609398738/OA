package com.bokesoft.oa.base;

import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 单据明细基础
 * 
 * @author minjian
 *
 */
public class BillDtlBase<H extends BillBase> extends DtlBase<H> {
	/**
	 * 来源单据Key
	 */
	private String srcBillKey = "";

	/**
	 * 来源单据Key
	 * 
	 * @return 来源单据Key
	 */

	public String getSrcBillKey() {
		return srcBillKey;
	}

	/**
	 * 来源单据Key
	 * 
	 * @param srcBillKey
	 *            来源单据Key
	 */
	public void setSrcBillKey(String srcBillKey) {
		this.srcBillKey = srcBillKey;
	}

	/**
	 * 来源单据编号
	 */
	private String srcBillNO = "";

	/**
	 * 来源单据编号
	 * 
	 * @return 来源单据编号
	 */
	public String getSrcBillNO() {
		return srcBillNO;
	}

	/**
	 * 来源单据编号
	 * 
	 * @param srcBillNO
	 *            来源单据编号
	 */
	public void setSrcBillNO(String srcBillNO) {
		this.srcBillNO = srcBillNO;
	}

	/**
	 * 来源单据OID
	 */
	private Long srcOid;

	/**
	 * 来源单据OID
	 * 
	 * @return 来源单据OID
	 */
	public Long getSrcOid() {
		return srcOid;
	}

	/**
	 * 来源单据OID
	 * 
	 * @param srcOid
	 *            来源单据OID
	 */

	public void setSrcOid(Long srcOid) {
		this.srcOid = srcOid;
	}

	/**
	 * 来源单据明细OID
	 */
	private Long srcDtlOid;

	/**
	 * 来源单据明细OID
	 * 
	 * @return 来源单据明细OID
	 */
	public Long getSrcDtlOid() {
		return srcDtlOid;
	}

	/**
	 * 来源单据明细OID
	 * 
	 * @param srcDtlOid
	 *            来源单据明细OID
	 */
	public void setSrcDtlOid(Long srcDtlOid) {
		this.srcDtlOid = srcDtlOid;
	}

	/**
	 * 构造明细基础对象
	 * 
	 * @param context
	 *            上下文对象
	 */
	public BillDtlBase(OAContext context, H billBase) {
		super(context, billBase);
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 * @throws Throwable
	 */
	public void loadData(DataTable dt) throws Throwable {
		setOID(dt.getLong("OID"));
	}

	/**
	 * 重载
	 */
	public String toString() {
		String outStr = "";
		try {
			if (getHeadBase() != null) {
				outStr = "，单据：" + getHeadBase().getOutString();
			}
		} catch (Throwable e) {
			e.printStackTrace();
		}
		if (getSrcBillKey() != null) {
			outStr = "，来源单据Key：" + getSrcBillKey();
		}
		if (getSrcBillNO() != null) {
			outStr = "，来源单据编号：" + getSrcBillNO();
		}
		if (getSrcOid() != null) {
			outStr = "，来源单据编号：" + getSrcOid();
		}
		if (getSrcDtlOid() != null) {
			outStr = "，来源单据明细OID：" + getSrcDtlOid();
		}
		return super.toString() + outStr;
	}
}
