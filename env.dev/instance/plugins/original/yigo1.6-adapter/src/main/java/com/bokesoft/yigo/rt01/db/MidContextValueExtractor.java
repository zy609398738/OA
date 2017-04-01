package com.bokesoft.yigo.rt01.db;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContextTool;
import com.bokesoft.yigo.redist.originals.cms2.data.ValueExtractor;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;

/**
 * 从 Yigo 中间层上下文中获取 SQL 语句中的变量对应的值;<br/>
 *  - 优先从上下文参数(ExtraValue(X))中查找, 然后再从 Document 的数据中找（Value(X)), 支持使用 "=" 开始的公式执行;
 */
public class MidContextValueExtractor implements ValueExtractor{
	private IMidContext ctx;
	private IDocument doc;
	private Map<String, Object> additionParams;

	public MidContextValueExtractor(IMidContext ctx, IDocument doc, Map<String, Object> additionParams){
		this.ctx = ctx;
		this.doc = doc;
		this.additionParams = additionParams;
		if (null==this.additionParams){
			this.additionParams = new HashMap<String, Object>();
		}
	}

	private Object _get(String key) throws Throwable {
		key=key.trim();
		
		if (key.startsWith("=")){
			String exp = key.substring(1);
			return MidContextTool.evaluate(ctx, doc, exp, "Get Value from Context with Exp: "+exp);
		}
		
		if (this.additionParams.containsKey(key)){
			return this.additionParams.get(key);
		}
		
		if (null==this.doc){
			this.doc = ctx.getDocument();
		}
		if (null!=doc){
			Object val = doc.getParaValue(key);
			if (null==val || StringUtils.isBlank(val.toString())){	//如果没有某个参数, 实际返回的是 ""
				val = doc.getFieldValueByKey(key);
			}
			return val;
		}else{
			return null;
		}
	}

	@Override
	public Object get(String key) {
		try {
			return _get(key);
		} catch (Throwable e) {
			Misc.throwRuntime(e);
			return null;	//unreachable code
		}
	}

}
