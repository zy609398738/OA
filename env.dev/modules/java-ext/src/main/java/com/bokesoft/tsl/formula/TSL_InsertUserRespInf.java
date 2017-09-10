package com.bokesoft.tsl.formula;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.common.struct.MultiKey;
import com.bokesoft.yes.common.struct.MultiKeyNode;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertUserRespInf extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_INSERT_USER_RESP_TO_ERP";

	@SuppressWarnings("unused")
	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] arg2, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_ERPAccAuzChgApp");
		DataTable detailTable = document.get("B_ERPAccAuzChgAppDtl");

		HashMap<MultiKey, ArrayList<Integer>> map = new HashMap<MultiKey, ArrayList<Integer>>();
		int rowCount = detailTable.size();
		for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			MultiKey key = new MultiKey();
			key.addValue(new MultiKeyNode(DataType.LONG, detailTable.getLong("OID")));
			key.addValue(new MultiKeyNode(DataType.LONG, detailTable.getLong("DVERID")));
			ArrayList<Integer> list = map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				map.put(key, list);
			}

			list.add(rowIndex);
		}

		Iterator<ArrayList<Integer>> it = map.values().iterator();
		while (it.hasNext()) {
			String task_id = "";
			String responsibility_id = "";
			String user_name = "";
			String status = "NEW";
			boolean bFirst = true;

			ArrayList<Integer> list = it.next();
			for (int rowIndex : list) {
				if (bFirst) {
					// task_id为TaskID 任务号
					task_id = headTable.getObject("InstanceID").toString();
					// responsibility_id
					responsibility_id = detailTable.getObject("RESPONSIBILITY_ID").toString();
					// user_name
					user_name = DictCacheUtil
							.getDictValue(context.getVE(), "Dict_Employee", headTable.getLong("ApplicantID"), "Email")
							.toString();
				}
				bFirst = false;
			}
			// 接口调用
			TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
			HashMap<String, String> paramenter = factory.getParameter();
			paramenter.put("task_id", task_id);
			paramenter.put("responsibility_id", responsibility_id);
			paramenter.put("user_name", user_name);
			paramenter.put("status", status);
			// 执行BokeDee接口
			factory.executeAction(ACTION);

		}

		return true;
	}
}
