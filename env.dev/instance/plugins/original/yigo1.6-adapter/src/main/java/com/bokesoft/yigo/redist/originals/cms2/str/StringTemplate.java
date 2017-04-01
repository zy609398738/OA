package com.bokesoft.yigo.redist.originals.cms2.str;

import java.util.*;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 用于处理包含特定风格的 “PlaceHolder” 类型的字符串
 * @author zzj
 * @see /ecomm/branches/20160119-trunk-2.0/modules/backend/core/src/main/java/com/bokesoft/cms2/basetools/str/StringTemplate.java,
 *      revision 46956.
 */
public class StringTemplate {
	/**Java 风格的模板变量引用字符串: ${...}*/
	public static final String REGEX_PATTERN_JAVA_STYLE = "\\$\\{([^\\}]*)\\}";
	/**Unix shell 风格的模板变量引用字符串: $...*/
	public static final String REGEX_PATTERN_UNIX_SHELL_STYLE = "\\$([a-zA-Z_]+)";
	
	private Map<String, String> varExpMap = new LinkedHashMap<String, String>();//Map <varName:String, varExpression:String>
	private Map<String, String> varValueMap = new HashMap<String, String>();	//Map <varName:String, varValue:String>
	private List<String> varExpList = new ArrayList<String>();					//List <varName:String>
	
	private String templateString;

	/**
	 * 通过指定变量引用的风格构造一个模板处理类
	 * @param templateString 包含变量的模板字符串
	 * @param templateRegex 模板定义的正则表达式, 要求其中使用 "(...)" 标识出变量名区域,
	 *                      参考 {@link #REGEX_PATTERN_JAVA_STYLE} 和 {@link #REGEX_PATTERN_UNIX_SHELL_STYLE}
	 */
	public StringTemplate(String templateString, String templateRegex){
    	Pattern p = Pattern.compile(templateRegex);
    	Matcher m = p.matcher(templateString);
    	while(m.find()){
    		if (m.groupCount()==1){
    			//group[0]: the all match string, group[1]: the group
    			varExpMap.put(m.group(1), m.group(0));
    			//记录变量出现的位置
    			varExpList.add(m.group(1));
    		}else{
    			throw new RuntimeException(
    					"Pattern '"+templateRegex+"' is not valid, it must contain and only contain one regex group.");
    		}
    	}
    	this.templateString = templateString;
	}
	
	/**
	 * 获取模板字符串中一共有多少个变量
	 * @return
	 */
	public String[] getVariables(){
        Set<String> strings = varExpMap.keySet();
        return strings.toArray(new String[strings.size()]);
	}
	
	/**
	 * 按照出现的先后获取变量. 一个出现过多次的变量可以在多个位置查到.
	 * @return
	 */
	public String[] getVariablesInOrder(){
		return varExpList.toArray(new String[varExpList.size()]);
	}
	
	/**
	 * 按照名称给变量赋值
	 * @param varName
	 * @param varValue
	 */
	public void setVariable(String varName, String varValue){
		varValueMap.put(varName, varValue);
	}
	
	/**
	 * 在 {@link #setVariable(String, String)} 后, 获取以值替换变量后的模板字符串替换结果
	 * @return
	 */
	public String getParseResult(){
		Iterator<Entry<String, String>> itr = varExpMap.entrySet().iterator();
		String tmp = this.templateString;
		while (itr.hasNext()){
			Entry<String, String> en = itr.next();
			String varName = (String)en.getKey();
			String varExp = (String)en.getValue();
			String val = (String)varValueMap.get(varName);
			if (null!=val){
				tmp = tmp.replace(varExp, val);
			}else{
				//在对应变量没有复制的情况下, 字符串保持原样.
			}
		}
		return tmp;
	}
	
	/**
	 * 清除 {@link #setVariable(String, String)} 时为变量赋的值, 以便重新赋值并获得新的模板字符串替换结果
	 */
	public void reset(){
		this.varValueMap.clear();
	}
}
