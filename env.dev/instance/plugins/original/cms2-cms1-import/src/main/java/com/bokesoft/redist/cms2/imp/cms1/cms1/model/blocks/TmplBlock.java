package com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block;

/**
 * 基于 公式+模板 实现的 Block
 * @author zzj
 *
 */
public class TmplBlock extends Block {
	private static final long serialVersionUID = 201620130505L;

	@Override
	public String getType() {
		return Block.BLOCK_TYPE_TMPL;
	}

	/** 公式文本 */
	private String formulaText;
	/** 模板文本(支持公式方式动态指定模板) */
	private String tmplText;

	public String getFormulaText() {
		return formulaText;
	}
	public void setFormulaText(String formulaText) {
		this.formulaText = formulaText;
	}
	public String getTmplText() {
		return tmplText;
	}
	public void setTmplText(String tmplText) {
		this.tmplText = tmplText;
	}
}
