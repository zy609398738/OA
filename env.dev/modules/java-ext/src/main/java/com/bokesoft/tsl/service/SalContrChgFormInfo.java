package com.bokesoft.tsl.service;

import java.util.Date;

import com.bokesoft.yes.common.util.DateUtil;

public class SalContrChgFormInfo implements IFormInfo {

	@Override
	public String getHeadTableKey() {
		return "B_SalContrChgCN";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SalContrChgCNDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SalContrChgCNSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SalContrChgCNOts";
	}

	@Override
	public boolean isFrameContract() {
		return false;
	}
	
	@Override
	public boolean isChangeContract() {
		return true;
	}

	@Override
	public String getPostfix() {
		return "-" + DateUtil.getDateFormatText(new Date(), "yyyyMMdd") + "-Change";
	}
	
	public static SalContrChgFormInfo INSTANCE = new SalContrChgFormInfo();

	@Override
	public boolean needSetStandardOrNot() {
		return true;
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
