package com.bokesoft.oa.mid.file;

import java.io.File;
import java.util.ArrayList;

import com.bokesoft.yes.mid.base.CoreSetting;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class DeleteFile implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return deleteFile(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	public boolean deleteFile(DefaultContext context, String filePath) {
		String solutionPath = CoreSetting.getInstance().getSolutionPath() + File.separator;
		String dataPath = "Data" + File.separator + filePath;
		String realPath = solutionPath + dataPath;
		File file = new File(realPath);
		if (file.exists() && file.isFile()) {
			if (file.delete()) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
