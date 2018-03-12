package com.bokesoft.tsl.formula;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertStandardContractHeader extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_INSERT_StandardContractHeader_TO_ERP";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_STDContrTMPL");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		// 合同任务ID
		String task_id = TypeConvertor.toString(headTable.getObject("InstanceID"));
		// 合同号
		String contract_number = TypeConvertor.toString(headTable.getObject("ContractBarcode"));
		// 合同类型
		String contract_type = "Standard";
		// 供应商1
		String vendor_id = TypeConvertor.toString(headTable.getObject("SupperierNumber"));
		// 供应商2
		String vendorid = TypeConvertor.toString(headTable.getObject("NSupplierID"));
		// 制单人
		String employee_id = TypeConvertor.toString(headTable.getObject("CreatorCode"));
		// 付款方式名称1
		String terms_name = TypeConvertor.toString(headTable.getObject("Payment_Term"));
		// 付款方式名称2
		String termsname = TypeConvertor.toString(headTable.getObject("NPayment"));
		// 付款方式ID1
		String terms_id = TypeConvertor.toString(headTable.getObject("Payment_TermID"));
		// 付款方式ID2
		String termsid = TypeConvertor.toString(headTable.getObject("NPaymentID"));

		// 合同创建日期
		Date contract_creationdate = TypeConvertor.toDate(headTable.getObject("BillDate"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String contract_creation_date = sdf.format(contract_creationdate);
		// 开始日期
		Date contract_startdate = TypeConvertor.toDate(headTable.getObject("StartDate"));
		String contract_start_date = sdf.format(contract_startdate);
		// 结束日期
		Date contract_enddate = TypeConvertor.toDate(headTable.getObject("EndDate"));
		String contract_end_date = sdf.format(contract_enddate);
		// 合同金额
		String total_amount = TypeConvertor.toString(headTable.getObject("ContractPriceRMB"));
		// 接口调用
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
		paramenter.put("task_id", task_id);
		paramenter.put("contract_number", contract_number);
		paramenter.put("contract_type", contract_type);
		if (!vendor_id.isEmpty() && vendor_id != null) {
			paramenter.put("vendor_id", vendor_id);
		} else {
			paramenter.put("vendor_id", vendorid);
		}
		paramenter.put("employee_id", employee_id);
		if (!terms_name.isEmpty() && terms_name != null) {
			paramenter.put("terms_name", terms_name);
		} else {
			paramenter.put("terms_name", termsname);
		}
		if (!terms_id.isEmpty() && terms_id != null) {
			paramenter.put("terms_id", terms_id);
		} else {
			paramenter.put("terms_id", termsid);
		}
		paramenter.put("contract_creation_date", contract_creation_date);
		paramenter.put("contract_start_date", contract_start_date);
		paramenter.put("contract_end_date", contract_end_date);
		paramenter.put("total_amount", total_amount);
		// 执行BokeDee接口
		factory.executeAction(ACTION);
		// 返回执行结果
		return true;
	}
}
