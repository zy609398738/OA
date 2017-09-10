package com.bokesoft.oa.mid.wf.base;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.bokesoft.oa.base.BillBase;
import com.bokesoft.oa.base.OAContext;

/**
 * 导入选择规则
 * 
 * @author zhoukh
 *
 */
public class ImportSelRule extends BillBase {
	/**
	 * 业务来源代码
	 */
	private String businessCode;

	/**
	 * 业务来源代码
	 * 
	 * @return 业务来源代码
	 */
	public String getBusinessCode() {
		return businessCode;
	}

	/**
	 * 业务来源代码
	 * 
	 * @param businessCode
	 *            业务来源代码
	 */
	public void setBusinessCode(String businessCode) {
		this.businessCode = businessCode;
	}

	/**
	 * 流程标识
	 */
	private String workflowKey;

	/**
	 * 流程标识
	 * 
	 * @return 流程标识
	 */
	public String getWorkflowKey() {
		return workflowKey;
	}

	/**
	 * 流程标识
	 * 
	 * @param workflowKey
	 *            流程标识
	 */
	public void setWorkflowKey(String workflowKey) {
		this.workflowKey = workflowKey;
	}

	private ImportSelRuleMap importSelRuleMap;

	public ImportSelRuleMap getImportSelRuleMap() {
		if (importSelRuleMap == null) {
			importSelRuleMap = new ImportSelRuleMap(getContext());
		}
		return importSelRuleMap;
	}

	public void setImportSelRuleMap(ImportSelRuleMap importSelRuleMap) {
		this.importSelRuleMap = importSelRuleMap;
	}

	/**
	 * 组合条件集合
	 */
	private ImportSRConditionMap importSRConditionMap;

	/**
	 * 组合条件集合
	 * 
	 * @return 组合条件集合
	 */
	public ImportSRConditionMap getImportSRConditionMap() {
		if (importSRConditionMap == null) {
			importSRConditionMap = new ImportSRConditionMap(getContext(), this);
		}
		return importSRConditionMap;
	}

	/**
	 * 组合条件集合
	 * 
	 * @param importSRConditionMap
	 *            组合条件集合
	 */
	public void setImportSRConditionMap(ImportSRConditionMap importSRConditionMap) {
		this.importSRConditionMap = importSRConditionMap;
	}

	/**
	 * 节点集合
	 */
	private ImportSRNodeMap importSRNodeMap;

	/**
	 * 节点集合
	 * 
	 * @return 节点集合
	 */
	public ImportSRNodeMap getImportSRNodeMap() {
		if (importSRNodeMap == null) {
			importSRNodeMap = new ImportSRNodeMap(getContext(), this);
		}
		return importSRNodeMap;
	}

	/**
	 * 节点集合
	 * 
	 * @param importSRNodeMap
	 *            节点集合
	 */
	public void setImportSRNodeMap(ImportSRNodeMap importSRNodeMap) {
		this.importSRNodeMap = importSRNodeMap;
	}

	/**
	 * 
	 * @param xssfWorkbook
	 */
	public void loadData(XSSFWorkbook xssfWorkbook) {
		XSSFSheet xssfSheet = xssfWorkbook.getSheet("销售合同2");
		ImportSRConditionMap importSRConditionMap = getImportSRConditionMap();
		importSRConditionMap.loadData(xssfSheet);
		ImportSRNodeMap importSRNodeMap = getImportSRNodeMap();
		importSRNodeMap.loadData(xssfSheet);
		ImportSelRuleMap importSelRuleMap = getImportSelRuleMap();
		importSelRuleMap.loadData(xssfSheet);
		XSSFRow headRow = xssfSheet.getRow(2);
		XSSFCell formNameCell = headRow.getCell(1);
		String formName = formNameCell.toString();
		setCaption(formName);
		XSSFCell formKeyCell = headRow.getCell(2);
		String formKey = formKeyCell.toString();
		setKey(formKey);
		XSSFCell businessCodeCell = headRow.getCell(3);
		String businessCode = businessCodeCell.toString();
		setBusinessCode(businessCode);
		XSSFCell workflowKeyCell = headRow.getCell(4);
		String workflowKey = workflowKeyCell.toString();
		setWorkflowKey(workflowKey);
	}

	/**
	 * 构造
	 * 
	 * @param context
	 *            上下文对象
	 */
	public ImportSelRule(OAContext context) {
		super(context);
	}

}
