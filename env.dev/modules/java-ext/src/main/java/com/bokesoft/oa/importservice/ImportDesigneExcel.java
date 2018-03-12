package com.bokesoft.oa.importservice;

import org.apache.poi.ss.usermodel.Workbook;

import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yigo.common.def.DataObjectPrimaryType;
import com.bokesoft.yigo.common.def.DataObjectSecondaryType;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 导入Excel
 *
 */
public class ImportDesigneExcel{

	public ImportDesigneExcel(DefaultContext context, Workbook workbook, boolean clearOriginalData)
			throws Throwable {
		DefaultContext newContext = new DefaultContext(context);
		newContext.setFormKey("OA_WorkflowDesigne");
		MetaDataObject metaDataObject = getDataObject(newContext, workbook);
		int primaryType = metaDataObject.getPrimaryType();
		int secondaryType = metaDataObject.getSecondaryType();

		IImport importData = null;
		if (primaryType == DataObjectPrimaryType.ENTITY) {
			switch (secondaryType) {
			case DataObjectSecondaryType.NORMAL:
				importData = new ImportDesigneDetails(newContext, workbook);
				break;
			default:
				break;
			}
			if (importData != null) {
				importData.importData();
			}
		}

	}

	private MetaDataObject getDataObject(DefaultContext context, Workbook workbook) throws Throwable {
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_WorkflowDesigne");
		return metaDataObject;
	}
}
