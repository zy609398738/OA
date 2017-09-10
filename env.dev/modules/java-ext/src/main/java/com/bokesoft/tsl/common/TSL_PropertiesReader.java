package com.bokesoft.tsl.common;

import java.io.IOException;
import org.apache.commons.lang3.StringUtils;

public class TSL_PropertiesReader {

	private static final String DEE_SERVICE_URL = "DEE_SERVICE_URL";
	
	private String bokedee_url = null;

	public TSL_PropertiesReader() throws IOException {
		bokedee_url = System.getenv(DEE_SERVICE_URL);
		if (StringUtils.isBlank(bokedee_url)){
			throw new RuntimeException(
					"BokeDee Http 服务地址未指定, 请使用环境变量 " + DEE_SERVICE_URL + "进行设置"
							+ "(例如 set DEE_SERVICE_URL=http://10.40.1.62:8089/dee/httpService)" );
		}
	}

	public String getURL() {
		return bokedee_url;
	}
}
