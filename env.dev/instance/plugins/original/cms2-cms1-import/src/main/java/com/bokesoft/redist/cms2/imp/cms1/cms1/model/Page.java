package com.bokesoft.redist.cms2.imp.cms1.cms1.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block.Param;
import com.bokesoft.redist.cms2.imp.cms1.cms1.model.HtmlTmpl.Slice;

/**
 * 对应一个具有特定 URL 的页面
 * @author zzj
 *
 */
public class Page implements Serializable {
	private static final long serialVersionUID = 201620130505L;

	/** 页面唯一标识 */
	private Serializable id;
	/** 页面的代码 */
	private String code;
	/** 页面的名称, 默认作为页面标题 */
	private String name;
	/** 页面是否启用 */
	private boolean enabled;
	/** 页面备注 */
	private String notes;
	
	/** 页面的 URL */
	private String url;
	/** 页面标题(支持公式), 如果为空则使用页面名称 {@link #name} 作为标题 */
	private String title;
	
	private String MenuCode;

	/** 页面的模板 */
	private HtmlTmpl tmpl;
	/** 页面各个区域的 Block 投放定义 */
	private List<Delivery> deliveries = new ArrayList<Delivery>();
	
	/** 页面的属性 */
	private Map<String, String> attributes = new LinkedHashMap<String, String>();
	
	/** 页面分组信息 */
	private List<Group> groups =  new ArrayList<Group>();
	
	/**
	 * Block 投放定义
	 * @author zzj
	 *
	 */
	public static class Delivery implements Serializable{
		private static final long serialVersionUID = 120130505L;
		
		/** 在页面上投放的顺序 */
		private String sequence;
		/** 投放内容的名称, 用作区块在页面上显示时的标题 */
		private String name;
		/** 投放的区域, 参见 {@link Slice#code} */
		private String areaCode;
		/** 是否分组投放, 以及分组的名称(为 null 时代表不是分组投放) */
		private String groupName;
		/** 当前投放的区块 */
		private Block block;
		
		/** 当前投放的定制 CSS class */
		private String cssClassName;
		/** 当前投放的定制 inline CSS */
		private String cssStyles;
		/** 区块的标题的 CSS class */
		private String titleCss;
		/** 区块的标题的 inline CSS */
		private String titleStyles;
		
		/** 投放时使用的参数(参数名称 vs 参数取值), 参见 {@link Param} */
		private Map<String, String> parameters = new HashMap<String, String>();
		/** 投放时可以选择的多个选项 */
		private Set<DeliveryOption> options = new HashSet<DeliveryOption>();
		
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getAreaCode() {
			return areaCode;
		}
		public void setAreaCode(String areaCode) {
			this.areaCode = areaCode;
		}
		public String getGroupName() {
			return groupName;
		}
		public void setGroupName(String groupName) {
			this.groupName = groupName;
		}
		public Map<String, String> getParameters() {
			return new HashMap<String, String>(parameters);	//参数是不关注顺序的
		}
		public void setParameters(Map<String, String> parameters) {
			this.parameters = parameters;
		}
		public Block getBlock() {
			return block;
		}
		public void setBlock(Block block) {
			this.block = block;
		}
		public Set<DeliveryOption> getOptions() {
			return new HashSet<DeliveryOption>(options);
		}
		public void setOptions(Set<DeliveryOption> options) {
			this.options = options;
		}
		public String getSequence() {
			return sequence;
		}
		public void setSequence(String sequence) {
			this.sequence = sequence;
		}
		public String getCssClassName() {
			return cssClassName;
		}
		public void setCssClassName(String cssClassName) {
			this.cssClassName = cssClassName;
		}
		public String getCssStyles() {
			return cssStyles;
		}
		public void setCssStyles(String cssStyles) {
			this.cssStyles = cssStyles;
		}
		public String getTitleCss() {
			return titleCss;
		}
		public void setTitleCss(String titleCss) {
			this.titleCss = titleCss;
		}
		public String getTitleStyles() {
			return titleStyles;
		}
		public void setTitleStyles(String titleStyles) {
			this.titleStyles = titleStyles;
		}
	}
	
	/**
	 * Group 分组定义
	 * @author liww
	 *
	 */
	public static class Group implements Serializable{
		private static final long serialVersionUID = -32951170774113029L;
		
		/** 分组名称*/
		private String groupName;
		/** 分组的定制 CSS class */
		private String cssClassName;
		/** 分组的定制 CSS class */
		private String cssStyles;

        public Group() {
        }

        public Group(String groupName) {
            this.groupName = groupName;
        }

        public String getGroupName() {
			return groupName;
		}
		public void setGroupName(String groupName) {
			this.groupName = groupName;
		}
		public String getCssClassName() {
			return cssClassName;
		}
		public void setCssClassName(String cssClassName) {
			this.cssClassName = cssClassName;
		}
		public String getCssStyles() {
			return cssStyles;
		}
		public void setCssStyles(String cssStyles) {
			this.cssStyles = cssStyles;
		}
	}
	
	/**
	 * 投放的一些选项
	 * @author zzj
	 *
	 */
	public static enum DeliveryOption {
		/** 原始状态, 不会对 Block 输出的内容作任何修饰 */
		Raw,
		/** 需要为 Block 输出内容加上标题; 注意: 此选项与 {@link #Raw} 不能同时出现 */
		WithHeader,
		/** 隐藏的投放内容, 仅定义而不实际显示在页面上。一般用于被页面以 Ajax 方式动态获取的情况下 */
		Hidden,
		/**只显示内部 Block 的内容 */
		PureRaw;	
		/** 检查多个 {@link DeliveryOption} 是否存在冲突 */
		public static void checkConflict(Set<DeliveryOption> options){
			_conflict(options, Raw, WithHeader);
			_conflict(options, Raw, PureRaw);
			_conflict(options, WithHeader, PureRaw);		
		}
		
		private static void _conflict(Set<DeliveryOption> options, DeliveryOption d1, DeliveryOption d2){
			if ((options.contains(d1) && options.contains(d2))){
				throw new RuntimeException("不能一起使用的投放选项: " + d1.toString() + " 和 " + d2.toString());
			}
		}
	}

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
		return StringUtils.isEmpty(name) ? "" + id : name;   //code 和 name 可以使用 id 作为默认值
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public List<Delivery> getDeliveries() {
		return new ArrayList<Delivery>(deliveries);
	}

	public void setDeliveries(List<Delivery> deliveries) {
		this.deliveries = deliveries;
	}

	public HtmlTmpl getTmpl() {
		return tmpl;
	}

	public void setTmpl(HtmlTmpl tmpl) {
		this.tmpl = tmpl;
	}
	
	public String getMenuCode() {
		return MenuCode;
	}

	public void setMenuCode(String menuCode) {
		MenuCode = menuCode;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String titleExp) {
		this.title = titleExp;
	}

	public Map<String, String> getAttributes() {
		return new LinkedHashMap<String, String>(attributes);
	}

	public void setAttributes(Map<String, String> attributes) {
		this.attributes = attributes;
	}
	
	public String getAttribute(String key){
		return this.attributes.get(key);
	}
	
	public void setAttribute(String key, String value){
		this.attributes.put(key, value);
	}

	public List<Group> getGroups() {
		if (null == groups) {
			return null;
		}
		return new ArrayList<Group>(groups);
	}

	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}
}
