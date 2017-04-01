package com.bokesoft.redist.cms2.imp.cms1.cms1.model;

import org.apache.commons.lang.StringUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 组成页面的区块定义
 * @author zzj
 *
 */
public abstract class Block  implements Serializable{
	private static final long serialVersionUID = 201620130505L;

	/** Block 类型 - 基于 模板+公式 的 Block */
	public static final String BLOCK_TYPE_TMPL = "TMPL";
	/** Block 类型 - 基于 Yigo 单据的 Block */
	public static final String BLOCK_TYPE_YIGO = "YIGO";
	/** Block 类型 - 基于 URL 地址(Web 页面)的 Block */
	public static final String BLOCK_TYPE_URL = "URL";

	/** 区块唯一标识 */
	private Serializable id;
	/** 区块的代码 */
	private String code;
	/** 区块的名称 */
	private String name;
	/** 区块备注 */
	private String notes;
	
	/** 区块的定制 CSS class */
	private String cssClassName;
	/** 区块的定制 inline CSS */
	private String cssStyles;

	/** 区块类型, 具体取值为 {@link #BLOCK_TYPE_TMPL} / {@link #BLOCK_TYPE_YIGO} / {@link #BLOCK_TYPE_URL} */
	public abstract String getType();
	
	private List<Param> parameters = new ArrayList<Param>();
	
	/** 区块参数. <b>注意: 参数在运行时始终是字符串类型, 具体区块在解释时自行转换</b> */
	public static class Param implements Serializable{
		private static final long serialVersionUID = 20130505L;
		
		/** 参数 Key, 区块通过 Key 来分辨各个参数 */
		private String key;
		/** 参数标题 */
		private String caption;
		
		public String getKey() {
			return key;
		}
		public void setKey(String key) {
			this.key = key;
		}
		
		public String getCaption() {
			return caption;
		}
		public void setCaption(String caption) {
			this.caption = caption;
		}
	}

	public Serializable getId() {
		return id;
	}

	public void setId(Serializable id) {
		this.id = id;
	}

	public String getCode() {
		return StringUtils.isEmpty(code) ? "" + id : code;   //code 和 name 可以使用 id 作为默认值
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return StringUtils.isEmpty(name) ? "" + id : name; //code 和 name 可以使用 id 作为默认值
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public List<Param> getParameters() {
		return new ArrayList<Param>(this.parameters);
	}

	public void setParameters(List<Param> parameters) {
		this.parameters = parameters;
	}

	public String getCssClassName() {
		return cssClassName;
	}

	public void setCssClassName(String cssClassName) {
		this.cssClassName = cssClassName;
	}

	public String getCssStyles() {
		return cssStyles;
	}

	public void setCssStyles(String cssStyles) {
		this.cssStyles = cssStyles;
	}
}
