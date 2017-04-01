package com.bokesoft.redist.cms2.imp.cms1.cms1.model;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Action 代表对应一个具体的 HTTP 执行请求，接受客户端请求数据并执行相应操作
 * @author zzj
 *
 */
public class Action implements Serializable {
	private static final long serialVersionUID = 201620130505L;

	/** 操作唯一标识 */
	private Serializable id;
	/** 操作代码 */
	private String code;
	/** 操作名称 */
	private String name;
	/** 备注 */
	private String notes;
	
	/** 操作的 URL */
	private String actionUrl;
	/** 执行具体操作的公式 */
	private String actionExp;

	/** 页面的属性 */
	private Map<String, String> attributes = new LinkedHashMap<String, String>();
	
	public Serializable getId() {
		return id;
	}
	public void setId(Serializable id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
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
	public String getActionUrl() {
		return actionUrl;
	}
	public void setActionUrl(String actionUrl) {
		this.actionUrl = actionUrl;
	}
	public String getActionExp() {
		return actionExp;
	}
	public void setActionExp(String actionExp) {
		this.actionExp = actionExp;
	}

	public Map<String, String> getAttributes() {
		return new LinkedHashMap<String, String>(attributes);
	}

	public void setAttributes(Map<String, String> attributes) {
		this.attributes = attributes;
	}
	
	public String getAttribute(String key){
		return this.attributes.get(key);
	}
	
	public void setAttribute(String key, String value){
		this.attributes.put(key, value);
	}
}
