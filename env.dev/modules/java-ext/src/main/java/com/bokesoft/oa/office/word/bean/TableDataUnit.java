package com.bokesoft.oa.office.word.bean;

import java.util.List;

public class TableDataUnit{
	private List<RowDataUnit> rowlist;
	private String key;
	public List<RowDataUnit> getRowlist() {
		return rowlist;
	}
	public void setRowlist(List<RowDataUnit> rowlist) {
		this.rowlist = rowlist;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}	
}
