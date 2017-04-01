package com.bokesoft.oa.base;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 明细基础
 * 
 * @author chenbiao
 *
 */
public class DtlBase<H extends HeadBase> extends Base {
	/**
	 * 头表
	 */
	private H headBase;

	/**
	 * 头表
	 * 
	 * @return 头表
	 */
	public H getHeadBase() {
		return headBase;
	}

	/**
	 * 头表
	 * 
	 * @param headBase
	 *            头表
	 */
	public void setHeadBase(H headBase) {
		this.headBase = headBase;
	}

	/**
	 * 构造明细基础对象
	 * 
	 * @param context
	 *            中间层对象
	 */
	public DtlBase(DefaultContext context) {
		super(context);
	}

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
	private long srcOid = -1L;

	/**
	 * 来源单据OID
	 * 
	 * @return 来源单据OID
	 */
	public long getSrcOid() {
		return srcOid;
	}

	/**
	 * 来源单据OID
	 * 
	 * @param srcOid
	 *            来源单据OID
	 */

	public void setSrcOid(long srcOid) {
		this.srcOid = srcOid;
	}

	/**
	 * 载入数据
	 * 
	 * @param dt
	 *            明细数据集
	 */
	public void loadData(DataTable dt) {
		setOid(dt.getLong("OID"));
	}
}
