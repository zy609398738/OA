package com.bokesoft.oa.mid;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Date;
import java.util.Iterator;
import java.util.Map.Entry;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.BusinessSource;
import com.bokesoft.oa.mid.wf.base.BusinessSourceMap;
import com.bokesoft.oa.mid.wf.base.ImportSRCondition;
import com.bokesoft.oa.mid.wf.base.ImportSRConditionMap;
import com.bokesoft.oa.mid.wf.base.ImportSRNode;
import com.bokesoft.oa.mid.wf.base.ImportSRNodeMap;
import com.bokesoft.oa.mid.wf.base.ImportSelRule;
import com.bokesoft.oa.mid.wf.base.Operator;
import com.bokesoft.oa.mid.wf.base.OperatorMap;
import com.bokesoft.oa.mid.wf.base.OperatorSel;
import com.bokesoft.oa.mid.wf.base.OperatorSelDtl;
import com.bokesoft.oa.mid.wf.base.OperatorSelDtlMap;
import com.bokesoft.oa.mid.wf.base.SelRule;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigne;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtl;
import com.bokesoft.oa.mid.wf.base.WorkflowDesigneDtlMap;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yes.excel.service.IImportService;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.factory.MetaFactory;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 导入Excel
 * 
 * @author minjian
 *
 */
public class ImportExcelSelRule implements IImportService {

	@Override
	public Object importData(DefaultContext context, File file, boolean arg2, String arg3) throws Throwable {
		MetaDataObject operatorDo = MetaFactory.getGlobalInstance().getDataObject("OA_SelRule");
		InputStream is = new FileInputStream(file.getPath());
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		OAContext oac = new OAContext(context);
		OperatorMap operatorMap = oac.getOperatorMap();
		ImportSelRule importSelRule = new ImportSelRule(oac);
		importSelRule.loadData(xssfWorkbook);
		String formName = importSelRule.getCaption();
		String formKey = importSelRule.getKey();
		String workflowKey = importSelRule.getWorkflowKey();
		String businessCode = importSelRule.getBusinessCode();
		SelRule selRule = new SelRule(oac);
		Document doc = selRule.getDocument();
		WorkflowTypeDtl workflowTypeDtl = oac.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, workflowKey);
		if (workflowTypeDtl == null) {
			throw new Error("缺少对应的流程类别明细，表单标识=" + formKey + "，流程标识=" + workflowKey);
		}
		WorkflowDesigne workflowDesigne = workflowTypeDtl.getWorkflowDesigne();
		if (workflowDesigne == null) {
			workflowDesigne = new WorkflowDesigne(oac);
		}
		WorkflowDesigneDtlMap workflowDesigneDtlMap = workflowDesigne.getWorkflowDesigneDtlMap();
		ImportSRConditionMap importSRConditionMap = importSelRule.getImportSRConditionMap();
		ImportSRNodeMap importSRNodeMap = importSelRule.getImportSRNodeMap();
		Integer optType = 6;
		DataTable dtDirect = doc.get("OA_SelRule_Direct");
		DataTable dtDtl = doc.get("OA_SelRule_D");
		DataTable dtHead = doc.get("OA_SelRule_H");
		for (Iterator<Entry<String, ImportSRNode>> iNodeRow = importSRNodeMap.entrySet().iterator(); iNodeRow
				.hasNext();) {
			Entry<String, ImportSRNode> eRow = iNodeRow.next();
			String keyRow = eRow.getKey();
			ImportSRNode importNode = eRow.getValue();
			Long id = 0L;
			doc.setNew();
			if (dtHead.size() > 0) {
				dtHead.clear();
			}
			for (Iterator<Entry<String, String>> iNode = importNode.entrySet().iterator(); iNode.hasNext();) {
				Entry<String, String> eNode = iNode.next();
				String keyNode = eNode.getKey();
				String value = eNode.getValue();
				Long selOID = context.applyNewOID();
				WorkflowDesigneDtl workflowDesigneDtl = workflowDesigneDtlMap.get(keyNode);
				if (workflowDesigneDtl == null) {
					workflowDesigneDtl = new WorkflowDesigneDtl(oac, workflowDesigne);
					workflowDesigneDtl.setOID(id);
					workflowDesigneDtlMap.put(id, workflowDesigneDtl);
				}
				OperatorSel operatorSel = workflowDesigneDtl.getAuditPerSel();
				if (operatorSel == null) {
					operatorSel = new OperatorSel(oac);
					operatorSel.setWorkflowDesigneDtl(workflowDesigneDtl);
					workflowDesigneDtl.setAuditPerSel(operatorSel);
				}
				Operator operator = operatorMap.get(value);
				dtDirect.append();
				if (operator == null) {
					dtDirect.setLong("DirectEmpID", null);
				} else {
					dtDirect.setLong("DirectEmpID", operator.getOID());
					dtDirect.setLong("OID", context.applyNewOID());
					dtDirect.setLong("SOID", selOID);
				}
				dtHead.append();
				String[] a = keyRow.split("\\.");
				String keyt = a[0];
				String name = formName + "_" + keyNode + "_" + keyt;
				String code = keyNode + "_" + keyt;
				Long operatorSelOID = context.applyNewOID();
				dtHead.setLong("OID", selOID);
				dtHead.setLong("SOID", selOID);
				dtHead.setInt("Enable", 1);
				dtHead.setString("BillKey", formKey);
				dtHead.setLong("Creator", context.getUserID());
				dtHead.setDateTime("CreateTime", new Date());
				BusinessSourceMap bsm = new BusinessSourceMap(oac);
				BusinessSource bs = bsm.get(businessCode);
				if (bs == null) {
					throw new Error("代码为：" + businessCode + "的业务来源不存在，请修正");
				} else {
					dtHead.setLong("BusSource", bs.getOID());
				}
				dtHead.setString("Name", name);
				dtHead.setString("Code", code);
				dtHead.setString("OptSrcType", "10");

				OperatorSelDtlMap operatorSelDtlMap = operatorSel.getOperatorSelDtlMap().getTypeMap().get(optType);
				if (operatorSelDtlMap == null) {
					operatorSelDtlMap = new OperatorSelDtlMap(oac, operatorSel);
					OperatorSelDtl operatorSelDtl = new OperatorSelDtl(oac, operatorSel);
					operatorSelDtl.setOID(id);
					operatorSelDtl.setOptID(selRule.getOID());
					operatorSelDtl.setOptType(optType);
					operatorSelDtl.setName(selRule.getName());
					operatorSelDtlMap.put(operatorSelOID, operatorSelDtl);
				}

				for (Iterator<Entry<String, ImportSRCondition>> ir = importSRConditionMap.entrySet().iterator(); ir
						.hasNext();) {
					Entry<String, ImportSRCondition> e = ir.next();
					String idRow = e.getKey();
					if (!idRow.equals(keyRow)) {
						continue;
					}
					ImportSRCondition importSRCondition = e.getValue(); // ID值对应的组合条件集合
					for (Iterator<Entry<String, String>> conditionRow = importSRCondition.entrySet()
							.iterator(); conditionRow.hasNext();) {
						Entry<String, String> cRow = conditionRow.next();
						String[] operationList = { ">=", "<=", "<>", "=", "<", ">" };
						String keyCondition = cRow.getKey();
						String valueCondition = cRow.getValue();
						Long dtlOID = context.applyNewOID();
						dtDtl.append();
						for (int i = 0; i < operationList.length; i++) {
							if (valueCondition.indexOf(operationList[i]) != -1) {
								valueCondition = valueCondition.substring(operationList[i].length(),
										valueCondition.length());
								dtDtl.setString("Operation", operationList[i]);
								break;
							}
						}
						dtDtl.setString("SValue", valueCondition);
						dtDtl.setLong("OID", dtlOID);
						dtDtl.setLong("SOID", selOID);
						dtDtl.setString("FieldKey", keyCondition.toUpperCase());
						dtDtl.setString("LogicOperation", "and");

					}
					break;
				}
				continue;
			}
			SaveData saveData = new SaveData(operatorDo, null, doc);
			DefaultContext newContext = new DefaultContext(context);
			doc = saveData.save(newContext);
		}
		return true;
	}

}
