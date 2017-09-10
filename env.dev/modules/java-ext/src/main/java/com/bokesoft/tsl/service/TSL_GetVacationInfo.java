package com.bokesoft.tsl.service;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.ColumnInfo;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetVacationInfo implements IExtService2 {

	private static String ACTION = "AS_Day_TO_BPM";

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		// 参数解析
		String WorkNO = (String) args.get("ProposerWorkNO");
		String leaveType = TypeConvertor.toString(args.get("leaveType"));
		String beginDate = TypeConvertor.toString(args.get("beginDate"));
		String beginTime = TypeConvertor.toString(args.get("beginTime"));
		String endDate = TypeConvertor.toString(args.get("endDate"));
		String endTime = TypeConvertor.toString(args.get("endTime"));

		TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
		HashMap<String, String> paramenter = factory.getParameter();
		// 工号
		paramenter.put("a0190", WorkNO);
		// 请假类型
		paramenter.put("k2005", leaveType);
		// 开始日期
		paramenter.put("k2006", beginDate);
		// 开始时间
		paramenter.put("k2008", beginTime);
		// 结束日期
		paramenter.put("k2007", endDate);
		// 结束时间
		paramenter.put("k2009", endTime);

		// 执行BokeDee接口
		String stringJson = factory.executeAction(ACTION);
		// 获取返回值，并转换为JSONObject
		JSONObject reJSONObject = JSONObject.parseObject(stringJson);

		// // 新建数据表
		DataTable dt = new DataTable();
		// // 创建数据表列
		dt.addColumn(new ColumnInfo("hour", DataType.NUMERIC));
		dt.addColumn(new ColumnInfo("a", DataType.NUMERIC));
		dt.addColumn(new ColumnInfo("b", DataType.NUMERIC));
		dt.addColumn(new ColumnInfo("c", DataType.NUMERIC));
		//
		// // 插入新行
		dt.append();
		//
		// // 赋值
		dt.setObject("hour", reJSONObject.get("hour"));
		dt.setObject("a", reJSONObject.get("a"));
		dt.setObject("b", reJSONObject.get("b"));
		dt.setObject("c", reJSONObject.get("c"));

		return dt;
	}
}
