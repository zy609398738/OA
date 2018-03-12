package com.bokesoft.tsl.service;

public class SalContrNonCNFormInfo implements IFormInfo {

	@Override
	public String getHeadTableKey() {
		return "B_SalContrNonCN";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SalContrNonCNDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SalContrNonCNSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SalContrNonCNOts";
	}
	
	public static SalContrNonCNFormInfo INSTANCE = new SalContrNonCNFormInfo();

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
		return false;
	}
	
	@Override
	public boolean isNonChinaContract() {
		return true;
	}
}
