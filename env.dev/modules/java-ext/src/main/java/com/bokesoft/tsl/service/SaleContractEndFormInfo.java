package com.bokesoft.tsl.service;

import java.util.Date;

import com.bokesoft.yes.common.util.DateUtil;

public class SaleContractEndFormInfo implements IFormInfo {
	@Override
	public String getHeadTableKey() {
		return "B_SaleContractEnd";
	}

	@Override
	public String getDtlTableKey() {
		return "B_SaleContractEndDtl";
	}

	@Override
	public String getSPTableKey() {
		return "B_SaleContractEndSP";
	}

	@Override
	public String getOTSTableKey() {
		return "B_SaleContractEndOths";
	}
	
	public static SaleContractEndFormInfo INSTANCE = new SaleContractEndFormInfo();

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
		return "-" + DateUtil.getDateFormatText(new Date(), "yyyyMMdd") + "-Cancel";
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
