package com.bokesoft.tsl.service;

public class SalContrCNFormInfo implements IFormInfo {

	@Override
	public String getHeadTableKey() {
		return "B_SalContrCN";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SalContrCNDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SalContrCNSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SalContrCNOts";
	}
	
	public static SalContrCNFormInfo INSTANCE = new SalContrCNFormInfo();

	@Override
	public boolean isFrameContract() {
		return false;
	}

	@Override
	public boolean isChangeContract() {
		return false;
	}
	
	@Override
	public String getPostfix() {
		return "";
	}

	@Override
	public boolean needSetStandardOrNot() {
		return false;
	}
	
	@Override
	public boolean isChinaContract() {
		return true;
	}
	
	@Override
	public boolean isNonChinaContract() {
		return false;
	}
}
