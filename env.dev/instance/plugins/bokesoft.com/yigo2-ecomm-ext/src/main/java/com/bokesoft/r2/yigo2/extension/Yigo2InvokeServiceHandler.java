package com.bokesoft.r2.yigo2.extension;

import java.util.ArrayList;

import org.apache.commons.lang3.reflect.MethodUtils;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * Yigo2 Service 二次开发的通用{@link IExtService}实现基类.
 * <hr/>
 * 基本规则如下:
 * <ol>
 *  <li>直接继承当前抽象类 {@link Yigo2InvokeServiceHandler}, 实现{@link #getHandler(DefaultContext)}方法;
 *  <li>{@link #getHandler(DefaultContext)}返回的是Java对象实例, InvokeService 公式调用中第一个参数作为Java 对象的方法执行;
 * </ol>
 * 方法引用举例: InvokeService("[ServiceName]", true, true, "[MethodName]", args...);<br/>
 *  - <code>[ServiceName]</code> 为 {@link Yigo2InvokeServiceHandler} 子类;<br/> 
 *  - <code>[MethodName]</code> 为需要执行方法名;<br/>
 */
public abstract class Yigo2InvokeServiceHandler implements IExtService{	
	/**
	 * 创建一个把 InvokeService 公式调用中第一个参数作为方法执行的 Java 对象;
	 * (注意：{@link #getHandler(DefaultContext)} 方法每次执行都需要重新创建对象)
	 * @param ctx
	 * @return
	 */
	protected abstract Object getHandler(DefaultContext ctx);
	
	@Override
	public Object doCmd(final DefaultContext ctx, final ArrayList<Object> args) throws Throwable {
		if (null==args || args.size()<=0){
			throw new UnsupportedOperationException("参数列表中至少需要存在一项(需要执行的方法名)");
		}
		String cmd = (String)args.get(0);
		args.remove(0);
		Object h = this.getHandler(ctx);
		Object result = MethodUtils.invokeMethod(h, cmd, args.toArray());
		return result;
	}
}
