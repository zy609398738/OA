package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg;

import java.util.Map;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.HtmlTmpl;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf.NormalPkg;

public class HtmlTmplPkg extends NormalPkg {
	private HtmlTmpl htmltmpl;
	private Map<String, String> codemap;

	public Map<String, String> getCodemap() {
		return codemap;
	}

	public void setCodemap(Map<String, String> codemap) {
		this.codemap = codemap;
	}

	public HtmlTmpl getHtmltmpl() {
		return htmltmpl;
	}

	public void setHtmltmpl(HtmlTmpl htmltmpl) {
		this.htmltmpl = htmltmpl;
	}

}
