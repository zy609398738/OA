package com.bokesoft.r2.yigo2.extension;

import com.bokesoft.r2.yigo2.extension.impl.BaseStaticWrapperMidFuncImplCluster;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.parser.IFunImplCluster;
import com.bokesoft.yigo.parser.IFunctionProvider;

/**
 * 将指定的类中的静态方法包装成 Yigo2 公式的通用的 {@link IFunctionProvider} 实现基类.
 * <hr/>
 * 基本规则如下:
 * <ol>
 *  <li>直接继承当前抽象类 {@link BaseStaticWrapperMidFuncRegistry} 即可定义一组公式, 实现
 *      类中需要提供一组 Class, 这组 Class 中的静态方法都可以被包装成 Yigo2 中间层公式.</li>
 *  <li>每个公式具有一个 "prefix", 公式可以使用 <code>"prefix"."类名"."方法名"</code> 调用,
 *      也可以使用不包含"."的 <code>"prefix""类名""方法名"</code> 调用, 后者称为 "narrow";<br/>
 *      例如: <code>cms.PageExp.Var(...)</code>, <code>cmsPageExpVar(...)</code> 等.</li>
 *  <li>公式的参数支持通过两种方式直接传递到相应的静态方法, 1)直接一一对应到方法的参数；2)如果该方法
 *      的第一个参数是 {@link DefaultContext} 类型, 那么公式的参数将对应该方法的第二个以后的各个
 *      参数, 第一个参数将传入当前系统的上下文({@link DefaultContext}).</li>
 * </ol>
 * <hr/>
 * 补充和注意事项:
 * <ol>
 *  <li>支持方法重载.</li>
 *  <li>注意 <code>"prefix"."类名"."方法名"</code> 中的 "类名" 并不包括 package name, 所以,
 *      公式与实际的 Class 全名并不会完全一致; 比如 <code>cms.Yigo2MidExp.Login(...)</code>
 *      对应的 class 可能是 <code>com.bokesoft.r2.cms2.adapter.yigo2.support.Yigo2MidExp</code>.</li>
 *  <li>
 *   在 Yigo 2.0 中使用时, 本类(的子类实现)需要手工在 solution 的 `Enhance.xml` 中注册，例如:
 *   <pre>
 *   &lt;ExtMidFunction&gt;
 *       &lt;MidFunction Provider="com.bokesoft.r2.cms2.adapter.yigo2.formula.CMS2FuncRegistry" Description="CMS2.0 中间层扩展公式"/&gt;
 *   &lt;/ExtMidFunction&gt;
 *   </pre>
 *  </li>
 *  <li>静态方法实现建议: 为了符合 Yigo2 "公式区分大小写" 的惯例, 以及方便区分出 "类名" 和 "方法名",
 *      建议用于公式的静态类的静态方法的方法名采用 "首字母大写" 的规则.</li>
 * </ol>
 */
public abstract class BaseStaticWrapperMidFuncRegistry implements IFunctionProvider{
	protected abstract String getFormulaPrefix();
	protected abstract Class<?>[] getWrappers();
	
	@Override
	public IFunImplCluster[] getClusters() {
		return new IFunImplCluster[] {
			new BaseStaticWrapperMidFuncImplCluster(this.getFormulaPrefix(), this.getWrappers())
		};
	}
}
