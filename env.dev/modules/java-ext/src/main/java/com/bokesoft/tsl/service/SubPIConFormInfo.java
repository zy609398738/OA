package com.bokesoft.tsl.service;

public class SubPIConFormInfo implements IFormInfo {
	@Override
	public String getHeadTableKey() {
		return "B_SubPICon";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SubPIConDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SubPIConSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SubPIConOts";
	}
	
	public static SubPIConFormInfo INSTANCE = new SubPIConFormInfo();

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
		return false;
	}
}
