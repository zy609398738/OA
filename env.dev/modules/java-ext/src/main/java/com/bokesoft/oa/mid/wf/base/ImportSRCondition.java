package com.bokesoft.oa.mid.wf.base;

import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;

public class ImportSRCondition extends DtlBaseMap<String, String, ImportSRConditionMap> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void loadData(List<String> headList, XSSFRow xssfRow, Integer firstColumn, Integer lastColumn) {
		int j = 0;
		for (int i = firstColumn; i <= lastColumn; i++) {
			XSSFCell cell = xssfRow.getCell(i);
			String nodeCaption = cell.toString();
			put(headList.get(j), nodeCaption);
			j = j + 1;
		}

	}

	public ImportSRCondition(OAContext context, ImportSRConditionMap headBase) {
		super(context, headBase);
	}
}
