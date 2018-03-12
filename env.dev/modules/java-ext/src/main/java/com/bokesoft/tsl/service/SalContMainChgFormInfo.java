package com.bokesoft.tsl.service;

import java.util.Date;

import com.bokesoft.yes.common.util.DateUtil;

public class SalContMainChgFormInfo implements IFormInfo {
	@Override
	public String getHeadTableKey() {
		return "B_SalContMainChg";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SalContMainChgDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SalContMainChgSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SalContMainChgOts";
	}
	
	public static SalContMainChgFormInfo INSTANCE = new SalContMainChgFormInfo();

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
		return "-" + DateUtil.getDateFormatText(new Date(), "yyyyMMdd") + "-Change";
	}

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
