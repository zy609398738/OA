package com.bokesoft.yigo2.redist.yigo1_6_adapter.support;

import java.util.ArrayList;

import org.apache.commons.lang.reflect.MethodUtils;
import org.apache.log4j.Logger;

import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo2.redist.yigo1_6_adapter.InvokeWrapper;

/**
 * 承接 Yigo2 {@link IExtService} 实现(用于在 Yigo2 客户端通过 InvokeService 公式调用),
 * 完成 Yigo 1.6 调用环境的准备, 并且把具体 invoke service 调用转到同名方法上的过程
 */
public abstract class Yigo2InvokeServiceHandler implements IExtService{
	private static final Logger log = Logger.getLogger(Yigo2InvokeServiceHandler.class);
	
	/**
	 * 创建一个把 InvokeService 公式调用中第一个参数作为方法执行的 Java 对象;
	 * (注意：{@link #getHandler(IMidContext, DefaultContext)} 方法每次执行都需要重新创建对象)
	 * @param ctx
	 * @param ctx2
	 * @return
	 */
	protected abstract Object getHandler(IMidContext ctx, DefaultContext ctx2);
	
	@Override
	public Object doCmd(final DefaultContext ctx2, final ArrayList<Object> args) throws Throwable {
		String cmd = (String)args.get(0);
		args.remove(0);

		log.info("调用方法 '"+cmd+"', 参数为 ["+args+"]");
		
		final Yigo2InvokeServiceHandler self = this;
		Object result = InvokeWrapper.call(new InvokeWrapper.MidTask<Object>() {
			@Override
			public Object call(IMidContext ctx) throws Throwable {
				Object h = self.getHandler(ctx, ctx2);
				Object result = MethodUtils.invokeMethod(h, cmd, args.toArray());
				return result;
			}
		});
		return result;
	}
}
