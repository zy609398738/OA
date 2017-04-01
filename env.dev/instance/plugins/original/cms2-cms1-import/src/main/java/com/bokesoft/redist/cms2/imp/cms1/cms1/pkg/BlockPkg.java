package com.bokesoft.redist.cms2.imp.cms1.cms1.pkg;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf.NormalPkg;

public class BlockPkg extends NormalPkg{
	private Block block;
	private List<ExtraParameter> extraParameters = new ArrayList<ExtraParameter>();

	public static class ExtraParameter implements Serializable{
		private static final long serialVersionUID = 120130505L;
		private String caption;
		private String param_Key;	
		private int param_Type;
		private String dic_Key;
		private String secValue;
		private String format;
		
		public String getParam_Key() {
			return param_Key;
		}
		public void setParam_Key(String param_Key) {
			this.param_Key = param_Key;
		}
		public String getCaption() {
			return caption;
		}
		public void setCaption(String caption) {
			this.caption = caption;
		}
		public int getParam_Type() {
			return param_Type;
		}
		public void setParam_Type(int param_Type) {
			this.param_Type = param_Type;
		}
		public String getDic_Key() {
			return dic_Key;
		}
		public void setDic_Key(String dic_Key) {
			this.dic_Key = dic_Key;
		}
		public String getSecValue() {
			return secValue;
		}
		public void setSecValue(String secValue) {
			this.secValue = secValue;
		}
		public String getFormat() {
			return format;
		}
		public void setFormat(String format) {
			this.format = format;
		}
	}

	public List<ExtraParameter> getExtraParameters() {
		return new ArrayList<ExtraParameter>(extraParameters);
	}
	
	public void setExtraParameters(List<ExtraParameter> extralParameters) {
		this.extraParameters = extralParameters;
	}
	
	public Block getBlock() {
		return block;
	}
	
	public void setBlock(Block block) {
		this.block = block;
	}

}
