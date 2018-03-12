package com.bokesoft.tsl.service;

public class FormInfoFactory {
	public static IFormInfo getFormInfo(String formKey) {
		if(formKey.equalsIgnoreCase("B_SalContrCN")) {
			return SalContrCNFormInfo.INSTANCE;
		} else if (formKey.equalsIgnoreCase("B_SalContrNonCN")) {
			return SalContrNonCNFormInfo.INSTANCE;
		} else if (formKey.equalsIgnoreCase("B_FrmContrCN")) {
			return FrmContrCNFormInfo.INSTANCE;
		} else if (formKey.equalsIgnoreCase("B_FrmContrNonCN")) {
			return FrmContrNonCNFormInfo.INSTANCE; 
		} else if (formKey.equalsIgnoreCase("B_SaleContractEnd")) {
			return SaleContractEndFormInfo.INSTANCE; 
		} else if (formKey.equalsIgnoreCase("B_SalContMainChg")) {
			return SalContMainChgFormInfo.INSTANCE; 
		} else if (formKey.equalsIgnoreCase("B_SubPICon")) {
			return SubPIConFormInfo.INSTANCE;
		} else if (formKey.equalsIgnoreCase("B_SalContrChgCN")) {
			return SalContrChgFormInfo.INSTANCE;
		}
		
		return null;
	}
}
