package com.bokesoft.oa.importservice;

import java.io.File;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import com.bokesoft.yes.excel.cmd.normal.IImport;
import com.bokesoft.yes.excel.utils.ExcelUtil;
import com.bokesoft.yigo.common.def.DataObjectPrimaryType;
import com.bokesoft.yigo.common.def.DataObjectSecondaryType;
import com.bokesoft.yigo.excel.IImportService;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 导入Excel，支持子明细。
 * 
 * @author minjian
 *
 */
public class ImportExcelSubDetails implements IImportService {

	@Override
	public Object importData(DefaultContext context, File file, boolean clearOriginalData, String postImportServiceName)
			throws Throwable {
		DefaultContext newContext = new DefaultContext(context);
		Workbook workbook = WorkbookFactory.create(file);

		MetaDataObject metaDataObject = getDataObject(newContext, workbook);
		int primaryType = metaDataObject.getPrimaryType();
		int secondaryType = metaDataObject.getSecondaryType();

		IImport importData = null;
		if (primaryType == DataObjectPrimaryType.ENTITY) {
			switch (secondaryType) {
			case DataObjectSecondaryType.NORMAL:
				importData = new ImportDataSubDetails(newContext, workbook);
				break;
			case DataObjectSecondaryType.DICT:
				importData =  new ImportDict(newContext, workbook, clearOriginalData);
				break;
			default:
				break;
			}
			if (importData != null) {
				importData.importData();
			}
		}

		return true;
	}

	private MetaDataObject getDataObject(DefaultContext context, Workbook workbook) throws Throwable {
		Sheet mainSheet = workbook.getSheetAt(0);
		String dataObjectKey = ExcelUtil.getCellValue(mainSheet, 0, 0).toString();
		MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject(dataObjectKey);
		return metaDataObject;
	}
}
