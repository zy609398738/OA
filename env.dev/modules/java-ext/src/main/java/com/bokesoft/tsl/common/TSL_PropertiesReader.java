package com.bokesoft.tsl.common;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.PropertyResourceBundle;

import com.bokesoft.yes.mid.base.SvrInfo;

public class TSL_PropertiesReader {
	
	private String bokedee_url = null;

	public TSL_PropertiesReader() throws IOException {
		String path = SvrInfo.getWorkDir() + "bokedee.properties";
		FileInputStream in = new FileInputStream(path);
		PropertyResourceBundle bundle = new PropertyResourceBundle(in);
		bokedee_url = bundle.getString("URL").trim();
	}

	public String getURL() {
		return bokedee_url;
	}
}
