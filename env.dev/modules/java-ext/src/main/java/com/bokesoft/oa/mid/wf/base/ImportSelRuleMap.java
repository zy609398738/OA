package com.bokesoft.oa.mid.wf.base;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

import com.bokesoft.oa.base.BaseMap;
import com.bokesoft.oa.base.OAContext;
import com.bokesoft.yigo.common.util.TypeConvertor;

/**
 * 头表信息
 * 
 * @author zhoukh
 *
 */
public class ImportSelRuleMap extends BaseMap<Long, ImportSelRule> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void loadData(XSSFSheet xssfSheet) {
		OAContext oac = getContext();
		XSSFRow headRow = xssfSheet.getRow(2);
		XSSFCell idCell = headRow.getCell(0);
		String id = idCell.toString();
		String[] a = id.split("\\.");
		String ids = a[0];
		XSSFCell formNameCell = headRow.getCell(1);
		String formName = formNameCell.toString();
		XSSFCell formKeyCell = headRow.getCell(2);
		String formKey = formKeyCell.toString();
		XSSFCell businessCodeCell = headRow.getCell(3);
		String businessCode = businessCodeCell.toString();
		XSSFCell workflowKeyCell = headRow.getCell(4);
		String workflowKey = workflowKeyCell.toString();
		ImportSelRule importSelRule = new ImportSelRule(oac);
		importSelRule.setWorkflowKey(workflowKey);
		importSelRule.setBusinessCode(businessCode);
		importSelRule.setCaption(formName);
		importSelRule.setKey(formKey);
		put(TypeConvertor.toLong(ids), importSelRule);
	}

	public ImportSelRuleMap(OAContext context) {
		super(context);
	}

}
