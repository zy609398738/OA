package com.bokesoft.r2.cms2.adapter.yigo2.formula;

import com.bokesoft.r2.cms2.adapter.yigo2.support.Yigo2MidExp;
import com.bokesoft.r2.cms2.adapter.yigo2.upload.UploadExp;
import com.bokesoft.r2.yigo2.extension.BaseStaticWrapperMidFuncRegistry;

import cms2.spel.ActionExp;
import cms2.spel.DataExp;
import cms2.spel.JavaExp;
import cms2.spel.PageExp;
import cms2.spel.ReqExp;
import cms2.spel.ResExp;

/**
 * CMS2 提供的 Yigo2 扩展公式, 主要供在 CMS 中使用 Yigo2 的语法, 与 Yigo2 中间层公式混合调用.
 * <ol>
 *   <li>将 CMS2 的系列表达式({@link ActionExp}、{@link DataExp}、{@link JavaExp}、
 *       {@link PageExp}、{@link ReqExp}、{@link ResExp}、) 通过 `cms.XxxExp.methodY()`
 *       这样的调用方式引入 Yigo 2, 使之可以作为 Yigo 2 的公式直接使用; </li>
 *   <li>同时补充与 Yigo2 有关的部分公式在 {@link Yigo2MidExp}.</li>
 *   <li>支持 `普通` 和 `narrow` 两种使用方式;
 *       比如 <code>cms.PageExp.Local('orderId')</code> 和 <code>cmsPageExpLocal('orderId')</code></li>
 * </ol>
 * 在 Yigo 2.0 中使用时, 需要手工在 solution 的 `Enhance.xml` 中注册，例如:
 * <pre>
 * &lt;ExtMidFunction&gt;
 *     &lt;MidFunction Provider="com.bokesoft.r2.cms2.adapter.yigo2.formula.CMS2FuncRegistry" Description="CMS2.0 中间层扩展公式"/&gt;
 * &lt;/ExtMidFunction&gt;
 * </pre>
 */
public class CMS2FuncRegistry extends BaseStaticWrapperMidFuncRegistry{
	/** CMS2 提供的各类公式的前缀 */
	private static final String CMS2_EXP_PREFIX = "cms";
	/**
	 * CMS 2.0 中内置公式的实现类集合
	 */
	private static Class<?>[] CMS2_EXP_CLASSES = new Class<?>[]{
			ActionExp.class,
			DataExp.class,
			JavaExp.class,
			PageExp.class,
			ReqExp.class,
			ResExp.class,
			Yigo2MidExp.class,	//补充当前 adapter 扩展的一些 Yigo2 的公式
			UploadExp.class		//上传的2次开发公式    
	};

	@Override
	protected String getFormulaPrefix() {
		return CMS2_EXP_PREFIX;
	}

	@Override
	protected Class<?>[] getWrappers() {
		return CMS2_EXP_CLASSES;
	}
}
