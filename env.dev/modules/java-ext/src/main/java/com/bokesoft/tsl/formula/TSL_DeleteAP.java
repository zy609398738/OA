package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_DeleteAP extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_DeleteINVOICE_TO_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		String dataObjectKey = TypeConvertor.toString(args[0]);
		CostInfo info = TSLInfoFactory.CreateInfo(context, dataObjectKey);
		//paymenttype
		String paymenttype = info.getPaymentTypeField(TypeConvertor.toLong(args[1]));
		Document document = context.getDocument();
		DataTable headTable = document.get(info.getHeadTable());
		// TaskID
		String TaskId = null;
		if (paymenttype == null) {
			TaskId = headTable.getObject(info.getOIDField()).toString();
		} else if (paymenttype.equalsIgnoreCase("PersonalPayment")) {
			TaskId = headTable.getObject(info.getOIDField()) + "_P";
		} else if (paymenttype.equalsIgnoreCase("CompanyPayment")) {
			TaskId = headTable.getObject(info.getOIDField()) + "_C";
		}

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("p_task_id", TaskId);
		// 执行BokeDee接口
		factory.executeAction(ACTION);

		return true;
	}
}
