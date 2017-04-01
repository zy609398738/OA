package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Action;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf.NormalPkg;

public class ActionPkg extends NormalPkg {
	private Action action;
	
	public Action getAction() {
		return action;
	}

	public void setAction(Action action) {
		this.action = action;
	}

}
