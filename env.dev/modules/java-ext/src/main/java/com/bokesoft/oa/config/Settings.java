package com.bokesoft.oa.config;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Text;

import com.bokesoft.yes.mid.base.CoreSetting;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * 参数设置
 * 
 * @author minjian
 * 
 */
public class Settings {
	/**
	 * 默认参数配置文件
	 */
	protected static final String CONFIG_PATH = "config.xml";
	/**
	 * 参数配置列表文件
	 */
	protected static final String CONFIG_LIST_PATH = "config-list.xml";
	/**
	 * 默认值属性的名称
	 */
	public static final String defaultAtrributeName = "default";

	/**
	 * 是否调试状态
	 */
	private Boolean isDebug = false;

	/**
	 * 是否调试状态
	 * 
	 * @return 是否调试状态
	 */
	public Boolean getIsDebug() {
		return isDebug;
	}

	/**
	 * 是否调试状态
	 * 
	 * @param isDebug
	 *            是否调试状态
	 */
	public void setIsDebug(Boolean isDebug) {
		this.isDebug = isDebug;
	}

	/**
	 * 属性集合
	 */
	private LinkedHashMap<String, String> propertyMap;

	/**
	 * 属性集合
	 * 
	 * @return 属性集合
	 */
	public LinkedHashMap<String, String> getPropertyMap() {
		return propertyMap;
	}

	/**
	 * 属性集合
	 * 
	 * @param propertyMap
	 *            属性集合
	 */
	public void setPropertyMap(LinkedHashMap<String, String> propertyMap) {
		this.propertyMap = propertyMap;
	}

	/**
	 * 列表集合
	 */
	private LinkedHashMap<String, List<String>> valueListMap;
	/**
	 * 映射的集合
	 */
	private LinkedHashMap<String, Settings> mapMap;

	/**
	 * 映射的集合
	 * 
	 * @return 映射的集合
	 */
	public LinkedHashMap<String, Settings> getMapMap() {
		return mapMap;
	}

	/**
	 * 映射的集合
	 * 
	 * @param mapMap
	 *            映射的集合
	 */
	public void setMapMap(LinkedHashMap<String, Settings> mapMap) {
		this.mapMap = mapMap;
	}

	/**
	 * 映射列表的集合
	 */
	private LinkedHashMap<String, List<Settings>> mapListMap;
	/**
	 * 元素的属性集合
	 */
	private LinkedHashMap<String, LinkedHashMap<String, String>> elementAttributeMap;
	/**
	 * 参数设置名称
	 */
	private String name;

	/**
	 * 参数设置名称
	 * 
	 * @return 参数设置名称
	 */
	public String getName() {
		return name;
	}

	/**
	 * 参数设置名称
	 * 
	 * @param name
	 *            参数设置名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 构造设置对象
	 * 
	 * @throws Throwable
	 */
	public Settings() throws Throwable {
		propertyMap = new LinkedHashMap<String, String>();
		valueListMap = new LinkedHashMap<String, List<String>>();
		mapMap = new LinkedHashMap<String, Settings>();
		mapListMap = new LinkedHashMap<String, List<Settings>>();
		elementAttributeMap = new LinkedHashMap<String, LinkedHashMap<String, String>>();
		name = "";
	}

	/**
	 * 载入参数配置
	 * 
	 * @throws Throwable
	 */
	public void loadConfig() throws Throwable {
		// 参数配置文件夹路径
		String dirPath = CoreSetting.getInstance().getSolutionPath();
		loadConfiguration(dirPath);
	}

	/**
	 * 载入参数配置
	 * 
	 * @param moduleKey
	 *            功能模块的Key
	 * 
	 * @throws Throwable
	 */
	public void loadConfig(String moduleKey) throws Throwable {
		// 参数配置文件夹路径
		String dirPath = getConfigDirPath(moduleKey);
		loadConfiguration(dirPath);
	}

	/**
	 * 获得设置文件夹路径
	 * 
	 * @param moduleKey
	 *            功能模块的Key
	 * @return 设置文件夹路径
	 */
	private String getConfigDirPath(String moduleKey) {
		String dirPath = CoreSetting.getInstance().getSolutionPath() + File.separator + moduleKey + File.separator
				+ "Configuration";
		return dirPath;
	}

	/**
	 * 载入参数配置
	 * 
	 * @throws Throwable
	 */
	public void loadConfiguration(String dirPath) throws Throwable {
		// 首先载入默认参数配置
		String configPath = dirPath + File.separator + CONFIG_PATH;
		File configFile = new File(configPath);
		if (configFile.exists()) {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document document = builder.parse(configFile);
			NodeList nodeList = document.getElementsByTagName("settings").item(0).getChildNodes();
			loadSettings(nodeList);
		}
		// 如果参数配置列表文件存在，载入参数配置列表文件里指定的参数配置文件
		String listPath = dirPath + File.separator + CONFIG_LIST_PATH;
		File listFile = new File(listPath);
		if (listFile.exists()) {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document document = builder.parse(listFile);
			NodeList isDebugNodeList = document.getElementsByTagName("IsDebug");
			if (isDebugNodeList != null) {
				Node isDebugNode = isDebugNodeList.item(0);
				if (isDebugNode.getNodeType() == Node.ELEMENT_NODE) {
					String nodeValue = getNodeValue(isDebugNode);
					setIsDebug(nodeValue.equalsIgnoreCase("true"));
				}
			}
			NodeList nodeList = document.getElementsByTagName("configlist").item(0).getChildNodes();
			ArrayList<File> arrayFile = new ArrayList<File>();
			for (int i = 0; i < nodeList.getLength(); i++) {
				Node node = nodeList.item(i);
				if (node.getNodeType() != Node.ELEMENT_NODE) {
					continue;
				}
				String nodeName = node.getNodeName();
				if (nodeName.equalsIgnoreCase("value")) {
					String nodeValue = getNodeValue(node);
					String filePath = dirPath + File.separator + nodeValue;
					File file = new File(filePath);
					if (file.exists()) {
						arrayFile.add(file);
					} else {
						// System.out.println("不存在文件:" + file.getName() + "。");
					}
				}
			}
			loadAllConfig(arrayFile.toArray(new File[0]));
		} else {
			// 否则，载入文件夹下的所有参数配置文件
			File dir = new File(dirPath);
			File[] files = dir.listFiles(new ConfigFileFilter());
			loadAllConfig(files);
		}
	}

	/**
	 * 载入所有的参数配置
	 * 
	 * @param files
	 *            参数配置文件数组
	 * @throws Throwable
	 */
	private void loadAllConfig(File[] files) throws Throwable {
		// 载入每一份参数配置文件
		for (File file : files) {
			// 默认的参数配置文件config.xml已经载入过，不重新载入了
			if (file.exists() && !CONFIG_PATH.equalsIgnoreCase(file.getName())) {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document document = builder.parse(file);
				NodeList nodeList = document.getElementsByTagName("settings").item(0).getChildNodes();
				loadSettings(nodeList);
			}
		}
	}

	/**
	 * 构造设置对象
	 * 
	 * @param nodeList
	 *            节点列表对象
	 * @throws Throwable
	 */
	public Settings(NodeList nodeList) throws Throwable {
		propertyMap = new LinkedHashMap<String, String>();
		valueListMap = new LinkedHashMap<String, List<String>>();
		mapMap = new LinkedHashMap<String, Settings>();
		mapListMap = new LinkedHashMap<String, List<Settings>>();
		elementAttributeMap = new LinkedHashMap<String, LinkedHashMap<String, String>>();
		loadSettings(nodeList);
	}

	/**
	 * 载入设置
	 * 
	 * @param nodeList
	 *            节点列表对象
	 * @throws Throwable
	 */
	protected void loadSettings(NodeList nodeList) throws Throwable {
		for (int i = 0; i < nodeList.getLength(); i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() != Node.ELEMENT_NODE) {
				continue;
			}
			Element element = (Element) node;
			String nodeName = element.getNodeName();
			if (nodeName.equalsIgnoreCase("property")) {
				String name = element.getAttribute("name");
				String nodeValue = getNodeValue(element);
				propertyMap.put(name, nodeValue);
				loadAttribute(element);
			} else if (nodeName.equalsIgnoreCase("valueList")) {
				String name = element.getAttribute("name");
				String cleanUp = "false";
				if (element.hasAttribute("cleanup")) {
					cleanUp = element.getAttribute("cleanup");
				}
				List<String> list = null;
				if (TypeConvertor.toBoolean(cleanUp)) {
					if (valueListMap.containsKey(name)) {
						valueListMap.remove(name);
					}
					list = new ArrayList<String>();
				} else {
					if (valueListMap.containsKey(name)) {
						list = valueListMap.get(name);
					} else {
						list = new ArrayList<String>();
					}
				}
				NodeList childNodes = element.getChildNodes();
				for (int j = 0; j < childNodes.getLength(); j++) {
					Node childNode = childNodes.item(j);
					if (childNode.getNodeName().equalsIgnoreCase("value")) {
						String nodeValue = getNodeValue(childNode);
						list.add(nodeValue);
					}
				}
				valueListMap.put(name, list);
				loadAttribute(element);
			} else if (nodeName.equalsIgnoreCase("map")) {
				String name = element.getAttribute("name");
				String cleanUp = "false";
				if (element.hasAttribute("cleanup")) {
					cleanUp = element.getAttribute("cleanup");
				}
				Settings settings = null;
				if (TypeConvertor.toBoolean(cleanUp)) {
					if (mapMap.containsKey(name)) {
						mapMap.remove(name);
					}
					settings = new Settings(element.getChildNodes());
					settings.setIsDebug(getIsDebug());
				} else {
					if (mapMap.containsKey(name)) {
						settings = mapMap.get(name);
						settings.loadSettings(element.getChildNodes());
					} else {
						settings = new Settings(element.getChildNodes());
						settings.setIsDebug(getIsDebug());
					}
				}
				settings.setName(name);
				mapMap.put(name, settings);
				loadAttribute(element);
			} else if (nodeName.equalsIgnoreCase("mapList")) {
				String name = element.getAttribute("name");
				String cleanUp = "false";
				if (element.hasAttribute("cleanup")) {
					cleanUp = element.getAttribute("cleanup");
				}
				List<Settings> list = null;
				if (TypeConvertor.toBoolean(cleanUp)) {
					if (mapListMap.containsKey(name)) {
						mapListMap.remove(name);
					}
					list = new ArrayList<Settings>();
				} else {
					if (mapListMap.containsKey(name)) {
						list = mapListMap.get(name);
					} else {
						list = new ArrayList<Settings>();
					}
				}
				NodeList listNodes = element.getChildNodes();
				for (int j = 0; j < listNodes.getLength(); j++) {
					Node listNode = listNodes.item(j);
					if (listNode.getNodeName().equalsIgnoreCase("map")) {
						Settings settings = new Settings(listNode.getChildNodes());
						settings.setIsDebug(getIsDebug());
						Element elementNode = (Element) listNode;
						if (elementNode.hasAttribute("name")) {
							String elementName = elementNode.getAttribute("name");
							settings.setName(elementName);
						}
						list.add(settings);
					}
				}
				mapListMap.put(name, list);
				loadAttribute(element);
			}
		}
	}

	/**
	 * 获取节点的值
	 * 
	 * @param node
	 *            节点对象
	 * @return 节点的值
	 */
	public String getNodeValue(Node node) {
		String nodeValue = "";
		NodeList nodeList = node.getChildNodes();
		for (int i = 0; i < nodeList.getLength(); i++) {
			Node childNode = nodeList.item(i);
			if (childNode.getNodeType() == Node.TEXT_NODE || childNode.getNodeType() == Node.CDATA_SECTION_NODE) {
				Text textNode = (Text) childNode;
				nodeValue = textNode.getWholeText();
				break;
			}
		}
		return nodeValue;
	}

	/**
	 * 是否存在属性
	 * 
	 * @param name
	 *            属性名称
	 * @return 存在返回true，否则返回false
	 */
	public Boolean containsProperty(String name) {
		return propertyMap.containsKey(name);
	}

	/**
	 * 获取属性
	 * 
	 * @param name
	 *            属性名称
	 * @return 属性值
	 */
	public String getProperty(String name) {
		String value = propertyMap.get(name);
		if (value == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素不存在。");
		}
		return value;
	}

	/**
	 * 获取属性
	 * 
	 * @param name
	 *            属性名称
	 * @param defaultValue
	 *            默认值
	 * @return 如果属性不存在，直接返回默认值，否则返回属性值
	 */
	public String getProperty(String name, String defaultValue) {
		String value = propertyMap.get(name);
		if (value == null) {
			return defaultValue;
		}
		return value;
	}

	/**
	 * 获取属性值或空字符串
	 * 
	 * @param name
	 *            属性名称
	 * @return 如果属性不存在，直接返回空字符串，否则返回属性值
	 */
	public String getPropertyOrEmpty(String name) {
		return getProperty(name,"");
	}

	
	/**
	 * 是否存在映射对象
	 * 
	 * @param name
	 *            映射对象名称
	 * @return 存在返回true，否则返回false
	 */
	public Boolean containsMap(String name) {
		return mapMap.containsKey(name);
	}

	/**
	 * 获取映射对象
	 * 
	 * @param name
	 *            映射对象名称
	 * @return 映射对象
	 */
	public Settings getMap(String name) {
		Settings value = mapMap.get(name);
		if (value == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素不存在。");
		}
		return value;
	}

	/**
	 * 获取映射键集合对象
	 * 
	 * @return 映射键集合对象
	 */
	public Set<String> getMapKeySet() {
		return mapMap.keySet();
	}

	/**
	 * 获取映射条目集合对象
	 * 
	 * @return 映射键条目合对象
	 */
	public Set<Entry<String, Settings>> getMapEntrySet() {
		return mapMap.entrySet();
	}

	/**
	 * 获取映射对象的值集合
	 * 
	 * @return 映射对象的值集合
	 */
	public Collection<Settings> getMapValues() {
		return mapMap.values();
	}

	/**
	 * 是否存在列表对象
	 * 
	 * @param name
	 *            列表对象名称
	 * @return 存在返回true，否则返回false
	 */
	public Boolean containsValueList(String name) {
		return valueListMap.containsKey(name);
	}

	/**
	 * 获取列表对象
	 * 
	 * @param name
	 *            列表对象名称
	 * @return 列表对象
	 */
	public List<String> getValueList(String name) {
		List<String> value = valueListMap.get(name);
		if (value == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素不存在。");
		}
		return value;
	}

	/**
	 * 是否存在映射列表对象
	 * 
	 * @param name
	 *            映射列表对象名称
	 * @return 存在返回true，否则返回false
	 */
	public Boolean containsMapList(String name) {
		return mapListMap.containsKey(name);
	}

	/**
	 * 获取映射列表对象
	 * 
	 * @param name
	 *            映射列表对象名称
	 * @return 映射列表对象
	 */
	public List<Settings> getMapList(String name) {
		List<Settings> value = mapListMap.get(name);
		if (value == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素不存在。");
		}
		return value;
	}

	/**
	 * 载入设置的属性
	 * 
	 * @param element
	 *            当前元素
	 */
	protected void loadAttribute(Element element) {
		NamedNodeMap namedNodeMap = element.getAttributes();
		String name = element.getAttribute("name");
		LinkedHashMap<String, String> attributeMap;
		if (elementAttributeMap.containsKey(name)) {
			attributeMap = elementAttributeMap.get(name);
		} else {
			attributeMap = new LinkedHashMap<String, String>();
			elementAttributeMap.put(name, attributeMap);
		}
		for (int i = 0; i < namedNodeMap.getLength(); i++) {
			Node node = namedNodeMap.item(i);
			String key = node.getNodeName();
			String value = node.getNodeValue();
			attributeMap.put(key, value);
		}
	}

	/**
	 * 是否存在元素的属性
	 * 
	 * @param name
	 *            元素名称
	 * @param attribute
	 *            元素的属性名称
	 * @return 存在返回true，否则返回false
	 */
	public Boolean containsElementAttribute(String name, String attribute) {
		if (!elementAttributeMap.containsKey(name)) {
			return false;
		}
		LinkedHashMap<String, String> attributeMap = elementAttributeMap.get(name);
		return attributeMap.containsKey(attribute);
	}

	/**
	 * 获取元素的属性
	 * 
	 * @param name
	 *            元素名称
	 * @param attribute
	 *            元素的属性名称
	 * @return 属性值
	 */
	public String getElementAttribute(String name, String attribute) {
		LinkedHashMap<String, String> attributeMap = elementAttributeMap.get(name);
		if (attributeMap == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素不存在。");
		}
		String value = attributeMap.get(attribute);
		if (value == null) {
			throw new Error("参数配置：“" + getName() + "元素中的“" + name + "”元素的“" + attribute + "”属性不存在。");
		}
		return value;
	}

	/**
	 * 获得指定元素的默认值属性
	 * 
	 * @param name
	 *            指定元素名称
	 * @return 指定元素的默认值属性
	 */
	public String getElementDefault(String name) {
		return getElementAttribute(name, defaultAtrributeName);
	}

	/**
	 * 获得数据集的值
	 * 
	 * @param dt
	 *            要取值的数据集对象
	 * @param name
	 *            指定列名称
	 * @param elementName
	 *            元素名称
	 * @return 指定列的值
	 * @throws Throwable
	 */
	public Object getRstValue(DataTable dt, String name, String elementName) throws Throwable {
		// 如果数据集里有指定列
		if (dt.getMetaData().constains(name)) {
			// 返回指定列的当前行单元格值
			return dt.getObject(name);
		} else {
			// 返回设置中的默认值
			return getElementDefault(elementName);
		}
	}

	/**
	 * 根据属性获得数据集的值
	 * 
	 * @param dt
	 *            要取值的数据集对象
	 * @param propertyName
	 *            属性名称
	 * @return 指定列的值
	 * @throws Throwable
	 */
	public Object getRstValueByProperty(DataTable dt, String propertyName) throws Throwable {
		String name = getProperty(propertyName);
		return getRstValue(dt, name, propertyName);
	}

	/**
	 * 转为字符串
	 */
	public String toString() {
		if (name.length() <= 0) {
			return super.toString();
		}
		return "[" + name + "]";
	}
}
