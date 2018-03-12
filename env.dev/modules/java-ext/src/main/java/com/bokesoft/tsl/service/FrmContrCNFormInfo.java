package com.bokesoft.tsl.service;

public class FrmContrCNFormInfo implements IFormInfo {
	@Override
	public String getHeadTableKey() {
		return "B_FrmContrCN";
	}

	@Override
	public String getDtlTableKey() {
		return "B_FrmContrCNDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_FrmContrCNSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_FrmContrCNOts";
	}
	
	public static FrmContrCNFormInfo INSTANCE = new FrmContrCNFormInfo();

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
		return true;
	}
	
	@Override
	public boolean isNonChinaContract() {
		return false;
	}
}
