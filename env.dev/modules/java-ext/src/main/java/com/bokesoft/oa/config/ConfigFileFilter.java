package com.bokesoft.oa.config;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * 参数配置文件筛选
 * 
 * @author minjian
 * 
 */
public class ConfigFileFilter implements FileFilter {
	@Override
	public boolean accept(File pathname) {
		Boolean isAccept = false;
		// 是否文件夹
		if (pathname.isDirectory()) {
			return isAccept;
		}
		// 是否XML文件
		String name = pathname.getName();
		int index = name.lastIndexOf(".");
		if (index == -1) {
			return isAccept;
		} else if (index == name.length() - 1) {
			return isAccept;
		} else if (!"XML".equalsIgnoreCase(name.substring(index + 1))) {
			return isAccept;
		}
		// 是否config格式的文件
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = null;
		try {
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			Document document = builder.parse(pathname);
			NodeList nodeList = document.getElementsByTagName("config");
			if (nodeList.getLength() == 1) {
				NodeList childNodes = ((Element) nodeList.item(0))
						.getElementsByTagName("settings");
				if (childNodes.getLength() == 1) {
					isAccept = true;
				}
			}
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isAccept;
	}

}
