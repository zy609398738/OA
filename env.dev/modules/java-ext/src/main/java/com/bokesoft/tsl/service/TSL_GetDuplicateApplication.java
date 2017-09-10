package com.bokesoft.tsl.service;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetDuplicateApplication implements IExtService2 {

	private static String ACTION = "AS_Check_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		// 参数解析
		String WorkNO = (String) args.get("ProposerWorkNO");
		String beginDateTime = (String) args.get("beginDateTime");
		String endDateTime = (String) args.get("endDateTime");
		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		// 工号
		paramenter.put("c", WorkNO);
		// 开始日期时间
		paramenter.put("a", beginDateTime);
		// 结束日期时间
		paramenter.put("b", endDateTime);
		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);

		// // 新建数据表
		DataTable dt = new DataTable();
		// // 创建数据表列
		dt.addColumn(new ColumnInfo("ts", DataType.STRING));
		//
		// // 插入新行
		dt.append();
		//
		// // 赋值
		dt.setObject("ts", reJSONObject.get("ts"));

		return dt;
	}
}
