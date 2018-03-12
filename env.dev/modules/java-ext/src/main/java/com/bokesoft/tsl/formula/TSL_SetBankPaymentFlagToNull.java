package com.bokesoft.tsl.formula;

import java.util.HashMap;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_SetBankPaymentFlagToNull extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_TO_ERP_BankPayment_FlagUpdate";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_BankPayment");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// TaskID
		String flag = headTable.getObject("InstanceID").toString();
		// Header_ID
		String header_id = headTable.getObject("Header_ID").toString();
		// Invoice_ID
		String invoice_id = headTable.getObject("Invoice_ID").toString();
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		if (!flow.isEmpty() && flow != null) {
			factory.addParameter("flow", flow);
		}
		if (!node.isEmpty() && node != null) {
			factory.addParameter("node", node);
		}
		if (!billkey.isEmpty() && billkey != null) {
			factory.addParameter("billkey", billkey);
		}
		if (!oid.isEmpty() && oid != null) {
			factory.addParameter("oid", oid);
		}
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("Header_ID", header_id);
		paramenter.put("Invoice_ID", invoice_id);
		paramenter.put("InstanceID", flag);
		// 执行BokeDee接口
		factory.executeAction(ACTION);
		return true;
	}
}
