package com.bokesoft.oa.mid.wf.base;

import java.util.Date;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 流程实例
 * 
 * @author minjian
 *
 */
public class BPMInstance extends BillBase {

	/**
	 * 流程的Key
	 */
	private String processkey;

	/**
	 * 流程的Key
	 * 
	 * @return 流程的Key
	 */
	public String getProcesskey() {
		return processkey;
	}

	/**
	 * 流程的Key
	 * 
	 * @param processkey
	 *            流程的Key
	 */
	public void setProcesskey(String processkey) {
		this.processkey = processkey;
	}

	/**
	 * 启动时间
	 */
	private Date startTime;

	/**
	 * 启动时间
	 * 
	 * @return 启动时间
	 */
	public Date getStartTime() {
		return startTime;
	}

	/**
	 * 启动时间
	 * 
	 * @param startTime
	 *            启动时间
	 */
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	/**
	 * 流程启动人ID
	 */
	private long operatorID;

	/**
	 * 流程启动人ID
	 * 
	 * @return 流程启动人ID
	 */
	public long getOperatorID() {
		return operatorID;
	}

	/**
	 * 流程启动人ID
	 * 
	 * @param operatorID
	 *            流程启动人ID
	 */
	public void setOperatorID(long operatorID) {
		this.operatorID = operatorID;
	}

	/**
	 * 流程启动人
	 */
	private Operator operator;

	/**
	 * 流程启动人
	 * 
	 * @return 流程启动人
	 * @throws Throwable
	 */
	public Operator getOperator() throws Throwable {
		if (operator == null) {
			if (operatorID > 0) {
				operator = getContext().getOperatorMap().get(operatorID);
			}
		}
		return operator;
	}

	/**
	 * 流程启动人
	 * 
	 * @param operator
	 *           流程启动人
	 */
	public void setOperator(Operator operator) {
		this.operator = operator;
		setOperatorID(operator.getOID());
	}

	/**
	 * 构造流程实例对象
	 * 
	 * @param context
	 *            OA上下文
	 */
	public BPMInstance(OAContext context) {
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
		setOID(dt.getLong("InstanceID"));
		setProcesskey(dt.getString("Processkey"));
		setStartTime(dt.getDateTime("StartTime"));
		setOperatorID(dt.getLong("OPERATORID_S"));
	}
}
