package com.bokesoft.tsl.common;

import java.io.IOException;
import java.util.HashMap;

import org.json.JSONArray;

import com.alibaba.fastjson.JSONObject;
import com.bokesoft.dee.BokeDeeClient;
import com.bokesoft.dee.http.HttpRequest;

/**
 * BokeDee工厂类,提供调用方式
 * @author chenyf
 *
 */
public class TSL_BokeDeeFactory {
	// BokeDee接口地址,文件读取获得
	public String URL = null;
	// 查询条目数,文件读取获得
	public static int QueryCount = 50;
	// 接口调用参数
	private HashMap<String, String> parameter = new HashMap<String, String>();

	public TSL_BokeDeeFactory() throws IOException {
		TSL_PropertiesReader reader = new TSL_PropertiesReader();
		URL = reader.getURL();
		// 流程标志
		parameter.put("flow", "");
		parameter.put("node", "");
		// FormKey
		parameter.put("billkey", "");
		// OID
		parameter.put("oid", "");
		// json
		JSONArray ja = new JSONArray();
		parameter.put("json", ja.toString());
	}

	/**
	 * 添加参数
	 * @param key	参数标志
	 * @param value 参数值
	 */
	public void addParameter(String key, String value) {
		parameter.put(key, value);
	}

	/**
	 * 生成查询条件
	 * @param key	查询条件ColumnKey
	 * @param sign	查询条件符号
	 * @param value 查询条件值
	 * @return
	 */
	public JSONObject createCondition(String key, String sign, Object value) {
		JSONObject jo = new JSONObject();
		jo.put("key", key);
		jo.put("value", value);
		jo.put("condition", sign);

		return jo;
	}

	/**
	 * 查询条目数条件
	 * @return
	 */
	public JSONObject getRowNumberCondition() {
		JSONObject jo = new JSONObject();
		jo.put("key", "rownum");
		jo.put("value", QueryCount);
		jo.put("condition", "<=");

		return jo;
	}

	/**
	 * 获取参数集合
	 * @return
	 */
	public HashMap<String, String> getParameter() {
		return parameter;
	}

	/**
	 * 条用接口
	 * @param action	要执行的接口名
	 * @return
	 */
	public String executeAction(String action) {
		HttpRequest hr = new HttpRequest(URL, action, parameter);
		String stringJson = BokeDeeClient.getInstance().execute(hr);

		return stringJson;
	}
}
