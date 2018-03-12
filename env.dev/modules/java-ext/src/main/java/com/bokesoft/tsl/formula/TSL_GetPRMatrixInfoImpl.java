package com.bokesoft.tsl.formula;

import java.math.BigDecimal;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;

public class TSL_GetPRMatrixInfoImpl extends BaseMidFunctionImpl {
	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		String categoryOneCode = TypeConvertor.toString(args[0]);
		String categoryTwoCode = TypeConvertor.toString(args[1]);
		String subCategoryOneCode = TypeConvertor.toString(args[2]);
		String subCategoryTwoCode = TypeConvertor.toString(args[3]);
		String subCategoryThreeCode = TypeConvertor.toString(args[4]);
		String subCategoryFourCode = TypeConvertor.toString(args[5]);
		BigDecimal totleRMB = TypeConvertor.toBigDecimal(args[6]);

		DataTable dt = PRMatrixInfoTools.GetPRMatrixInfo(context, categoryOneCode, categoryTwoCode, subCategoryOneCode,
				subCategoryTwoCode, subCategoryThreeCode, subCategoryFourCode, totleRMB);

		dt.first();
		return dt;
	}
}
