package com.bokesoft.oa.office.word.bean;

import java.util.List;

public class BillDataUnit{
	private List<HeadDataUnit> headers;
	private List<TableDataUnit> tables;
	
	public List<HeadDataUnit> getHeaders() {
		return headers;
	}
	public void setHeaders(List<HeadDataUnit> headers) {
		this.headers = headers;
	}
	public List<TableDataUnit> getTables() {
		return tables;
	}
	public void setTables(List<TableDataUnit> tables) {
		this.tables = tables;
	}
	
}
