package com.bokesoft.yigo.rt01.db;

import java.util.HashMap;
import java.util.Map;

import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;

/**
 * 设置执行上下文 SQL 查询的各种选项
 *
 */
public class MidContextDBOptions {
	/**
	 * 创建一个默认的查询选项
	 * @param ctx
	 * @return
	 */
	public static final MidContextDBOptions create(IMidContext ctx){
		return new MidContextDBOptions(ctx);
	}
	/**
	 * 创建一个必须返回一行数据的查询选项
	 * @param ctx
	 * @return
	 */
	public static final MidContextDBOptions forceOne(IMidContext ctx){
		return create(ctx).setMinRows(1).setMaxRows(1);
	}
	/**
	 * 创建一个必须返回一行以上数据的查询选项
	 * @param ctx
	 * @return
	 */
	public static final MidContextDBOptions moreThenOne(IMidContext ctx){
		return create(ctx).setMinRows(1);
	}

	private IMidContext ctx;
	private IDocument doc;
	private String sql;
	private int minRows = Integer.MIN_VALUE;
	private int maxRows = Integer.MAX_VALUE;
	private Map<String, Object> additionParams = new HashMap<String, Object>();
	
	public MidContextDBOptions(IMidContext ctx){
		//设置中间层上下文, 同时默认设置当前的 document 为上下文中的 document
		try{
			this.ctx = ctx;
			if (null==this.doc){
				this.doc = ctx.getDocument();
			}
		}catch(Throwable e){
			Misc.throwRuntime(e);
		}
	}
	/**
	 * 设置当前的 document
	 * @param doc
	 * @return
	 */
	public MidContextDBOptions putDoc(IDocument doc){
		this.doc = doc;
		return this;
	}
	/**
	 * 设置需要执行的 SQL 语句
	 * @param sql
	 * @return
	 */
	public MidContextDBOptions setSql(String sql){
		this.sql = sql;
		return this;
	}
	/**
	 * 设置 SQL 语句需要返回或者修改到的最小数据行数
	 * @param minRows
	 * @return
	 */
	public MidContextDBOptions setMinRows(int minRows){
		this.minRows = minRows;
		return this;
	}
	/**
	 * 设置 SQL 语句需要返回或者修改到的最多数据行数
	 * @param maxRows
	 * @return
	 */
	public MidContextDBOptions setMaxRows(int maxRows){
		this.maxRows = maxRows;
		return this;
	}
	/**
	 * 加入在上下文中找不到的参数
	 * @param name
	 * @param value
	 * @return
	 */
	public MidContextDBOptions addParam(String name, Object value){
		this.additionParams.put(name, value);
		return this;
	}
	
	public IMidContext getCtx() {
		return ctx;
	}
	public IDocument getDoc() {
		return doc;
	}
	public String getSql() {
		return sql;
	}
	public int getMinRows() {
		return minRows;
	}
	public int getMaxRows() {
		return maxRows;
	}
	public Map<String, Object> getAdditionParams() {
		return additionParams;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("MidContextDBOptions [");
		if (ctx != null) {
			builder.append("ctx=");
			builder.append(ctx);
			builder.append(", ");
		}
		if (doc != null) {
			builder.append("doc=");
			builder.append(doc);
			builder.append(", ");
		}
		if (sql != null) {
			builder.append("sql=");
			builder.append(sql);
			builder.append(", ");
		}
		builder.append("minRows=");
		builder.append(minRows);
		builder.append(", maxRows=");
		builder.append(maxRows);
		builder.append(", ");
		if (additionParams != null) {
			builder.append("additionParams=");
			builder.append(additionParams);
		}
		builder.append("]");
		return builder.toString();
	}
}
