package com.bokesoft.tsl.service;

public interface IFormInfo {
	public String getHeadTableKey();
	public String getDtlTableKey();
	public String getSPTableKey();
	public String getOTSTableKey();
	public boolean isFrameContract();
	public String getPostfix();
	public boolean isChangeContract();
	public boolean needSetStandardOrNot();
	public boolean isNonChinaContract();
	public boolean isChinaContract();
}
