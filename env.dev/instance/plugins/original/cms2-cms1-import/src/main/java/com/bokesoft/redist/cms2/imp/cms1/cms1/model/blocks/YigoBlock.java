package com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block;

/**
 * 用于显示 Yigo 单据的 Block
 * @author zzj & wangxh
 *	NOTICE render 位置 、高/宽度,可通过block的基础信息获取
 */
public class YigoBlock extends Block {
	private static final long serialVersionUID = 201620130505L;
	@Override
	public String getType() {
		return Block.BLOCK_TYPE_YIGO;
	}
	
	/** Yigo 单据菜单项名称 (支持公式) */
	private String commandName;
	
	/** Yigo 表单 BILLID (支持公式), 目前暂不使用 */
	@SuppressWarnings("unused")
	private String billId;
	
	/** Yigo 表单入口操作公式 (支持公式) */
	private String entryExp;
	
	/** 确定表单的高度, 单位像素 (支持公式), 允许为空 */
	private String height;
	
	/** 确定表单的宽度, 单位像素 (支持公式), 允许为空 */
	private String width;
	
	/** 模板名称，目前有两种模板, 1.4(WebForm.vm)&1.6(WebForm2.vm)*/
	private String vmName;
	
	/** 默认皮肤风格, 目前1.4中支持三种皮肤风格(blue默认、gray、slate), 1.6???*/
	private String vmSkinStyle;
	
	public String getCommandName() {
		return commandName;
	}

	public void setCommandName(String commandName) {
		this.commandName = commandName;
	}

	public String getEntryExp() {
		return entryExp;
	}

	public void setEntryExp(String entryExp) {
		this.entryExp = entryExp;
	}

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}
    
    public String getVmSkinStyle() {
		return vmSkinStyle;
	}

	public void setVmSkinStyle(String vmSkinStyle) {
		this.vmSkinStyle = vmSkinStyle;
	}
	
	public String getVmName() {
		return vmName;
	}

	public void setVmName(String vmName) {
		this.vmName = vmName;
	}
}
