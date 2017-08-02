package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.parser.BaseFunImplCluster;

public class TSLMidFunction extends BaseFunImplCluster {

	@Override
	public Object[][] getImplTable() {
		// 返回一个自动的开发类和公式名的二维数组
		return new Object[][] { { "TSL_EmployeePostSave", new TSL_EmployeePostSaveImpl() },
				{ "TSL_DepartmentPostSave", new TSL_DepartmentPostSaveImpl() },
				{ "TSL_GetCustomerDataTable", new TSL_GetCustomerDataTableImpl() },
				{ "TSL_GetOperatingUnitDataTable", new TSL_GetOperatingUnitDataTableImpl() },
				{ "TSL_GetContractBarcodeDataTable", new TSL_GetContractBarcodeDataTableImpl() },
				{ "TSL_GetProjectNumberDataTable", new TSL_GetProjectNumberDataTableImpl() },
				{ "TSL_GetCostCenterDataTable", new TSL_GetCostCenterDataTableImpl() },
				{ "TSL_GetBudgetConrolDataTable", new TSL_GetBudgetConrolDataTableImpl() },
				{ "TSL_ControlBudgetStatusChange", new TSL_ControlBudget() },
				{ "TSL_WriteoffBudgetStatusChange", new TSL_WriteoffBudget() },
				{ "TSL_InsertInvoiceHeaderStatusChange", new TSL_InsertInvoiceHeader() },
				{ "TSL_InsertInvoiceLineStatusChange", new TSL_InsertInvoiceLine() },
				{ "TSL_ImportAPInvoiceStatusChange", new TSL_ImportAPInvoice() },
				{ "TSL_ImportGeneralLedgerStatusChange", new TSL_ImportGeneralLedger() },
				{ "TSL_GetDeptHead", new TSL_GetDeptHead() }, { "TSL_GetDeptHeadParent", new TSL_GetDeptHeadParent() },
				{ "TSL_UpdateDelivery_main", new TSL_UpdateDelivery_main() },
				{ "TSL_InsertUserRespInf", new TSL_InsertUserRespInf() },
				{ "TSL_ImportUserResp", new TSL_ImportUserResp() },
				{ "TSL_GetUserResp", new TSL_GetUserResp() },				
				{ "TSL_GetPI", new TSL_GetPI() } };
	}
}
