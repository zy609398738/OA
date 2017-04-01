package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf.NormalPkg;

public class PagePkg extends NormalPkg{
	private Page page;
	public Page getPage() {
		return page;
	}
	public void setPage(Page page) {
		this.page = page;
	}
}
