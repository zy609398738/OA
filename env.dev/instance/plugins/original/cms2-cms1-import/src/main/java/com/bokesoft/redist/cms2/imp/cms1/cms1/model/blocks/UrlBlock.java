package com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block;

/**
 * 用于显示 URL 对应页面的 Block
 * @author zzj
 *
 */
public class UrlBlock extends Block {
	private static final long serialVersionUID = 201620130505L;

	@Override
	public String getType() {
		return Block.BLOCK_TYPE_URL;
	}
	
	/** 需要显示的页面的 URL */
	private String url;
	
	/**用于指定所显示的页面部分内容的 CSS Selector，为空("" 或者 null)代表全部内容 */
	private String domSelector;

	public String getDomSelector() {
		return domSelector;
	}

	public void setDomSelector(String domSelector) {
		this.domSelector = domSelector;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}
