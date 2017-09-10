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

public class TSL_UpdateDelivery_main extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_Delivery_Release_TO_ERP";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_DeliveryNotice");
		// proc_state（调用传入参数）
		String proc_state = TypeConvertor.toString(args[0]);
		// 任务号（获取Oid）
		String taskid = headTable.getObject("InstanceID").toString();
		// 开始日期（获取eta）
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date1 = TypeConvertor.toDate(headTable.getObject("eta"));
		String eta = date1 == null ? "" : sdf.format(date1);
		// 结束日期（获取etd）
		Date date2 = TypeConvertor.toDate(headTable.getObject("etd"));
		String etd = date2 == null ? "" : sdf.format(date2);
		// 发货单号（获取delivery_id）
		String delivery_id = headTable.getObject("InvoiceNumber").toString();
		// 接口调用
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		paramenter.put("taskid", taskid);
		paramenter.put("proc_state", proc_state);
		paramenter.put("eta", eta);
		paramenter.put("etd", etd);
		paramenter.put("delivery_id", delivery_id);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 返回执行结果
		return stringJson;
	}

}
