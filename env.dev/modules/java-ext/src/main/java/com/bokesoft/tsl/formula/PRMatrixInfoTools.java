package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.util.ArrayList;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class PRMatrixInfoTools {
	public static DataTable GetPRMatrixInfo(DefaultContext context, String categoryOneCode, String categoryTwoCode, String subCategoryOneCode, 
			String subCategoryTwoCode, String subCategoryThreeCode, String subCategoryFourCode, BigDecimal totleRMB) throws Throwable {
		String SQL = "select * from MT_DB_PR_Matrix where CategoryOneCode = ? and categoryTwoVCode = ? ";
		
		ArrayList<Object> paras = new ArrayList<>();
		paras.add(categoryOneCode);
		paras.add(categoryTwoCode);

		if (subCategoryOneCode == null || subCategoryOneCode.isEmpty()) {
			SQL += " and SubCategoryOneCode is null";
		} else {
			SQL += " and SubCategoryOneCode = ?";
			paras.add(subCategoryOneCode);
		}

		if (subCategoryTwoCode == null || subCategoryTwoCode.isEmpty()) {
			SQL += " and SubCategoryTwoCode is null";
		} else {
			SQL += " and SubCategoryTwoCode = ?";
			paras.add(subCategoryTwoCode);
		}

		if (subCategoryThreeCode == null || subCategoryThreeCode.isEmpty()) {
			SQL += " and SubCategoryThreeCode is null";
		} else {
			SQL += " and SubCategoryThreeCode = ?";
			paras.add(subCategoryThreeCode);
		}

		if (subCategoryFourCode == null || subCategoryFourCode.isEmpty()) {
			SQL += " and SubCategoryFourCode is null";
		} else {
			SQL += " and SubCategoryFourCode = ?";
			paras.add(subCategoryFourCode);
		}

		SQL += " and ((? >= MinDescription and ? < MaxDescription) or (? >= MinDescription and MaxDescription=0))";
		paras.add(totleRMB);
		paras.add(totleRMB);
		paras.add(totleRMB);

		DataTable dt = context.getDBManager().execPrepareQuery(SQL, paras);

		return dt;
		
	}
}
