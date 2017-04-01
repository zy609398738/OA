package com.bokesoft.redist.cms2.imp.cms1.cms1.model;

import org.apache.commons.lang.StringUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * HTML 模板定义
 * @author zzj
 *
 */
public class HtmlTmpl implements Serializable{
	private static final long serialVersionUID = 201620130505L;

	/** HTML 模板中直接自定显示某个 block 内容的区域标识, 此标识后面应该包含 block 的 code, 允许使用 query string 的格式带上参数 */
	public static final String HTML_TMPL_BLOCK_TAG = "yigo-cms:block";
	/** HTML 模板中各个区域的显示标识, 通常使用 &lt;div yigo:cms:area="header" /&gt; 这样的方式来定义 */
	public static final String HTML_TMPL_AREA_TAG = "yigo-cms:area";
	/** HTML 模板中 &lt;title/&gt; 的显示标识, 注意这个标识并不需要写在页面中, 实际处理是程序一句 html 的 title 标签自动查找 */
	public static final String HTML_TMPL_TITLE_TAG = "yigo-cms:title";

	/** HTML 模板唯一标识 */
	private Serializable id;
	/** HTML 模板的代码 */
	private String code;
	/** HTML 模板的名称 */
	private String name;
	/** HTML 模板备注 */
	private String notes;

	/** HTML 模板的内容, 以 HTML 文本的形式表示,
	 *  其中通过 {@link #HTML_TMPL_AREA_TAG} 和 {@link #HTML_TMPL_BLOCK_TAG} 标识出运行时需要替换的内容
	 */
	private String htmlText;
	/** HTML 模板通过  {@link #HTML_TMPL_AREA_TAG} 和 {@link #HTML_TMPL_BLOCK_TAG} 分割的各个片段*/
	private List<Slice> slices = new ArrayList<Slice>();

	public Serializable getId() {
		return id;
	}

	public void setId(Serializable id) {
		this.id = id;
	}

	public String getCode() {
		return StringUtils.isEmpty(code) ? "" + id : code; //code 和 name 可以使用 id 作为默认值
    }

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return StringUtils.isEmpty(name) ? "" + id : name;  //code 和 name 可以使用 id 作为默认值
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getHtmlText() {
		return htmlText;
	}

	public void setHtmlText(String htmlText) {
		this.htmlText = htmlText;
	}

	public List<Slice> getSlices() {
		return new ArrayList<Slice>(this.slices);
	}

	public void setSlices(List<Slice> slices) {
		this.slices = slices;
	}
	
	/**
	 * 代表通过 {@link #HTML_TMPL_AREA_TAG} 和 {@link #HTML_TMPL_BLOCK_TAG} 标识分开的多个模板 HTML 片段
	 * @author zzj
	 *
	 */
	public static class Slice implements Serializable{
		private static final long serialVersionUID = 20130505L;
		
		/** 标识片段的类型, 可取值为 {@link #HTML_TMPL_AREA_TAG} , {@link #HTML_TMPL_BLOCK_TAG} , {@link #HTML_TMPL_TITLE_TAG} */
		private String tag;
		/** 具体的区域编码或者 block 内容, 如果等于 null 代表其中没有动态内容 */
		private String code;
		/** 在动态内容之后的 HTML 文本内容, 通常就是模板里面用于控制 Layout 的固定 HTML 内容 */
		private String followHtml;
		
		public String getTag() {
			return tag;
		}
		public void setTag(String tag) {
			this.tag = tag;
		}
		public String getCode() {
			return code;
		}
		public void setCode(String code) {
			this.code = code;
		}
		public String getFollowHtml() {
			return followHtml;
		}
		public void setFollowHtml(String followHtml) {
			this.followHtml = followHtml;
		}
	}
}
