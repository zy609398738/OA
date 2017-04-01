package yigo.rt01;

import com.bokesoft.myerp.dev.mid.AbstractCustomContextAction;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContextTool;

/**
 * 杂项功能
 */
public class Misc extends AbstractCustomContextAction {
	/**
	 * 由于 Yigo 默认提供的 SaveObject() 公式不能触发 Pre/Post Trigger(至少在某个单据
	 * 的 SaveObject Trigger 中嵌套保存另外一张单据时不会触发), 所以提供这个方法.
	 * @throws Throwable 
	 */
	public void SaveObject() throws Throwable{
		IMidContext ctx = this.getMidContext();
		MidContextTool.saveObject(ctx, ctx.getDocument());
	}
}
