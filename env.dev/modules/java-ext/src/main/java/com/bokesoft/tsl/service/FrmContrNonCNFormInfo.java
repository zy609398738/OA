package com.bokesoft.tsl.service;

public class FrmContrNonCNFormInfo implements IFormInfo {

	@Override
	public String getHeadTableKey() {
		return "B_FrmContrNonCN";
	}

	@Override
	public String getDtlTableKey() {
		return "B_FrmContrNonCNDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_FrmContrNonCNSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_FrmContrNonCNOts";
	}
	
	public static FrmContrNonCNFormInfo INSTANCE = new FrmContrNonCNFormInfo();

	@Override
	public boolean isFrameContract() {
		return true;
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
