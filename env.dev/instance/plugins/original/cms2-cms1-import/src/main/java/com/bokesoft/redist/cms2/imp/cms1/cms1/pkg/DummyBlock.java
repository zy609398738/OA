package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block;



public class DummyBlock extends Block {
	private static final long serialVersionUID = 20130815L;
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
	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return null;
	}
}
