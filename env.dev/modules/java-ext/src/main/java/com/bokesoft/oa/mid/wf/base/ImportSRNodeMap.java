package com.bokesoft.oa.mid.wf.base;

import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

import com.bokesoft.oa.base.DtlBaseMap;
import com.bokesoft.oa.base.OAContext;

public class ImportSRNodeMap extends DtlBaseMap<String, ImportSRNode, ImportSelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 * @param xssfSheet
	 */
	public void loadData(XSSFSheet xssfSheet) {
		CellRangeAddress ca = xssfSheet.getMergedRegion(1);
		Integer lastRow = ca.getLastRow();
		Integer firstColumn = ca.getFirstColumn();
		Integer lastColumn = ca.getLastColumn();

		XSSFRow headRow = xssfSheet.getRow(lastRow + 1);
		List<String> headList = new ArrayList<String>();
		for (int i = firstColumn; i <= lastColumn; i++) {
			XSSFCell cell = headRow.getCell(i);
			String value = cell.toString();
			headList.add(value);
		}
		OAContext context = getContext();
		for (int r = ca.getLastRow() + 2; r <= xssfSheet.getLastRowNum(); r++) {
			XSSFRow xssfRow = xssfSheet.getRow(r);
			ImportSRNode importSRNode = new ImportSRNode(context, this);
			importSRNode.loadData(headList, xssfRow, firstColumn, lastColumn);
			XSSFCell cell = xssfRow.getCell(0);
			String value = cell.toString();
			put(value, importSRNode);
		}

	}

	public ImportSRNodeMap(OAContext context, ImportSelRule headBase) {
		super(context, headBase);
	}

}
