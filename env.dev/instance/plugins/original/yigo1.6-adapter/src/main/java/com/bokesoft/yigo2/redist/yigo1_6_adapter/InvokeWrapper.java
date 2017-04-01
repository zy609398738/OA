package com.bokesoft.yigo2.redist.yigo1_6_adapter;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.bokesoft.myerp.common.midproxy.Env;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContextFactory;
import com.bokesoft.myerp.mid.contextlistener.MapContextListener;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;
import com.bokesoft.yigo2.redist.yigo1_6_adapter.system.RememberReqRespFilter;

/**
 * 包装对 Yigo 1.6 后台功能的调用
 */
public class InvokeWrapper {
	private static final Logger log = Logger.getLogger(InvokeWrapper.class);
	
	private static ThreadLocal<IMidContext> localCtx = new ThreadLocal<IMidContext>();
	
	/**
	 * 执行一个 Yigo 1.6 中间层的任务，返回任务的执行结果
	 * @param task
	 * @return
	 */
	public static final <T> T call(MidTask<T> task){
		checkAndInitYigo1AsContextListener();
		
		IMidContext lCtx = localCtx.get();
		if (null==lCtx){
			return doAsNewContext(task);
		}else{
			try {
				T result = task.call(lCtx);
				return result;
			} catch (Throwable e) {
				Misc.throwRuntime(e);
				return null;	//Unreachable code
			}
		}
	}

	private static <T> T doAsNewContext(MidTask<T> task) {
		IMidContext ctx = null;
		try{
			MidContextFactory fac = new MidContextFactory();
			ctx = fac.createMidContext(
					RememberReqRespFilter.request(), RememberReqRespFilter.response());
			localCtx.set(ctx);
			T result = task.call(ctx);
			ctx.setComplete();
			return result;
		}catch(Throwable ex){
			if (null!=ctx){
				try {
					ctx.setFail();
				} catch (Throwable e) {
					//Do nothing
				}
			}
			Misc.throwRuntime(ex);
			return null;	//Unreachable code
		}finally{
			localCtx.remove();
			if (null!=ctx){
				ctx.close();
			}
		}
	}
	
	/**
	 * 监测 Yigo1.6 是否已经通过 {@link MapContextListener} 进行了初始化，如果没有初始化，那么模拟 {@link MapContextListener} 进行初始化.
	 * 此功能通常是为了保证集成 Yigo 1.6 的功能在设计器模拟运行时可以保证存在一个正常初始化的 Yigo 1.6 环境.
	 */
	private static void checkAndInitYigo1AsContextListener(){
		String gServer = Env.getGServer();	//在目前 Yigo 1.6 的实现中, 如果系统没有初始化, getGServer() 返回 null 值
		if (null==gServer){
			log.warn("Yigo 1.6 运行环境未初始化，将通过虚拟方式进行初始化 ...");
			//这时候一定是在设计器中, 所以可以调用 RememberReqRespFilter.getMockRequest()
			HttpServletRequest req = RememberReqRespFilter.getMockRequest();
			//固定的全局 Server 和 Service 值
			Env.setGServer(req.getServerName()+":"+req.getServerPort());
			Env.setGService(req.getContextPath());
			//模拟 MapContextListener 初始化
			MapContextListener.contextInitialized();
		}
	}

	public static interface MidTask <T> {
		public T call(IMidContext ctx) throws Throwable;
	}
}
