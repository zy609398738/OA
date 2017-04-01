package com.bokesoft.yigo.redist.originals.cms2.data;

/**
 * 从上下文中获取数据的抽象接口
 * @see /ecomm/branches/20160119-trunk-2.0/modules/backend/core/src/main/java/com/bokesoft/cms2/basetools/data/ValueExtractor.java,
 *       revision 46956
 */
public interface ValueExtractor {
	/**
	 * 通过 key 从上下文中获得对应的数据
	 * @param key
	 * @return
	 */
	public Object get(String key);
}
