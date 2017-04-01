package com.bokesoft.redist.cms2.imp.cms1.reader;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.cms2.core.reader.ext.ExtendedActionReader;
import com.bokesoft.cms2.model.Action;
import com.bokesoft.redist.cms2.imp.cms1.exp.ImportExp;

public class BuildinImportActionReader implements ExtendedActionReader {
	private static final Map<String, String> urlExpMap = new HashMap<String, String>();
	static {
		urlExpMap.put("/cms2-cms1-imp.action", ImportExp.EXP_IMPORT);
	}

	@Override
	public Action getActionByUrl(String url, CmsRequestContext reqContext) {
		String exp = urlExpMap.get(url);
		if (null==exp){
			return null;
		}
		Action a = new Action();
		a.setActionUrl(url);
		a.setActionExp(exp);
		return a;
	}

	@Override
	public List<String> findAllUrls(CmsRequestContext reqContext) {
		return new ArrayList<String>(urlExpMap.keySet());
	}

}
