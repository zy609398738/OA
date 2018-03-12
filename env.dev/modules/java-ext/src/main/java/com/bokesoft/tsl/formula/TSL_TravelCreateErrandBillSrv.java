package com.bokesoft.tsl.formula;

import com.bokesoft.tsl.workflow.TSL_TravelCreateErrandBillHandler;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class TSL_TravelCreateErrandBillSrv extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor iExecutor) throws Throwable {
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		String createtype = TypeConvertor.toString(args[4]);
		TSL_TravelCreateErrandBillHandler handle = new TSL_TravelCreateErrandBillHandler();
		handle.TravelCreateErrandBill(context, billkey, flow, node, oid, createtype);
		return true;

	}
}