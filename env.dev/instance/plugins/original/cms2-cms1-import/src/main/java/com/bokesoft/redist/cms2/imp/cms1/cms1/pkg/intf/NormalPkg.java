package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf;

public abstract class NormalPkg {
	private String parentCode;
	private String nodeType;

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}
}
