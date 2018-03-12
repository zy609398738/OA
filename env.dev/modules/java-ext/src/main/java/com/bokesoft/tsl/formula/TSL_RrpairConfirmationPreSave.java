package com.bokesoft.tsl.formula;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_RrpairConfirmationPreSave extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		Document doc = context.getDocument();
		DataTable dtHead = doc.get("B_RrpairConfirmation");
		DataTable dtDtl = doc.get("B_RrpairConfirmationDtl");

		int isAutoGenerate = TypeConvertor.toInteger(dtHead.getObject("isAutoGenerate"));
		String lines = dtHead.getString("DtlLines");
		if (isAutoGenerate == 0 || (lines != null && lines.length() > 0)) {
			return true;
		}

		lines = "";
		dtDtl.beforeFirst();
		while (dtDtl.next()) {
			lines += dtDtl.getString("Line") + ",";
		}
		dtHead.setObject("DtlLines", lines);

		return true;
	}
}
