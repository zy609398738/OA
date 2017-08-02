package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 根据人员选择内容返回选择结果
 * 
 * @author fengfeifei
 *
 */
public class GetOperatorSelResult implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return operatorSelResult(paramDefaultContext);
	}

	/**
	 * 将人员选择内容添加到选择结果的列表中
	 * 
	 * @param dtOptSel
	 *            选择内容的列表
	 * @param dtOptResult
	 *            选择结果的列表
	 * @return dtOptResult
	 * @throws Throwable
	 */
	private DataTable operatorSelAdd(DataTable dtOptSel, DataTable dtOptResult) throws Throwable {
		dtOptSel.beforeFirst();
		while (dtOptSel.next()) {
			Integer selField = dtOptSel.getInt("SelField");
			if (null != selField && selField == 1) {
				if (dtOptResult.size() > 0) {
					boolean canAppend = true;
					dtOptResult.beforeFirst();
					while (dtOptResult.next()) {
						long optID = dtOptResult.getLong("OptID");
						long oID = dtOptSel.getLong("OID");
						if (optID == oID) {
							canAppend = false;
							break;
						}
					}
					if (canAppend) {
						dtOptResult.append();
						dtOptResult.setLong("OptID", dtOptSel.getLong("OID"));
						dtOptResult.setInt("OptType", dtOptSel.getInt("OptType"));
						dtOptResult.setString("Name", dtOptSel.getString("Name"));
					}
				} else {
					dtOptResult.append();
					dtOptResult.setLong("OptID", dtOptSel.getLong("OID"));
					dtOptResult.setInt("OptType", dtOptSel.getInt("OptType"));
					dtOptResult.setString("Name", dtOptSel.getString("Name"));
				}
			}
		}
		return dtOptResult;
	}

	/**
	 * 根据人员选择内容返回选择结果的列表
	 * 
	 * @return 填充成功返回true
	 * @throws Throwable
	 */
	public DataTable operatorSelResult(DefaultContext context) throws Throwable {
		Document doc = context.getDocument();
		DataTable dtDepartment = doc.get("OA_Department_H");// 行政组织选择
		DataTable dtOperator = doc.get("SYS_Operator");// 人员选择
		DataTable dtOptRule = doc.get("OA_OptRule_H");// 自定义
		DataTable dtOptPublic = doc.get("OA_OptPublic_H");// 群组
		DataTable dtSelRul = doc.get("OA_SelRule_H");// 人员选择规则
		DataTable dtOperatorSel = doc.get("OA_OperatorSel_D");// 人员选择明细结果
		if (dtDepartment != null) {
			dtOperatorSel = operatorSelAdd(dtDepartment, dtOperatorSel);
		}
		if (dtOperator != null) {
			dtOperatorSel = operatorSelAdd(dtOperator, dtOperatorSel);
		}
		if (dtOptRule != null) {
			dtOperatorSel = operatorSelAdd(dtOptRule, dtOperatorSel);
		}
		if (dtOptPublic != null) {
			dtOperatorSel = operatorSelAdd(dtOptPublic, dtOperatorSel);
		}
		if (dtSelRul != null) {
			dtOperatorSel = operatorSelAdd(dtSelRul, dtOperatorSel);
		}
		return dtOperatorSel;
	}
}
