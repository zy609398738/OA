package com.bokesoft.redist.cms2.site;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsPageContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.cms2.impl.buildin.modelio.ModelIOConst;
import com.bokesoft.cms2.impl.buildin.modelio.reader.base.DataPathConfigurable;
import com.bokesoft.cms2.impl.buildin.modelio.util.DataFileBean;
import com.bokesoft.cms2.impl.buildin.modelio.util.ModelIOUtil;
import com.bokesoft.cms2.model.Page;
import com.google.common.base.Function;
import com.google.common.collect.Ordering;

/**
 * 根据页面文件的目录结构构造网站及导航菜单结构，每级页面和分类的定义形式如下:
 * <pre>
 *  index.json
 *  site
 *  +- 01-news //有子节点
 *     +- @index.json
 *	   +- a.json
 *	   +- b.json
 *  +- 02-profile //有子节点
 *     +- @index.json
 *	   +- a.json
 *	   +- b.json
 *  +- 03-about //无子节点
 *     +- @index.json
 * </pre>
 * 限制：1)目前只支持两级菜单结构的站点; 2)系统使用"."作为各级的分隔符，具体的页面和分类中均不能含有"."。
 */
public class SiteTree  extends DataPathConfigurable {
	/** namespace 中多个层次的分隔符 */
	private static final String NS_SP = Character.toString(DataFileBean.NAMESPACE_SP);
	/** 所有被 cms2-site 管理的页面都需要处于 “site” namespace 下 */
	private static final String SITE_ROOT_NS = "SITE";
	/** site 的每个子模块的 “索引页面” ———— 定义子模块主链接的页面 ———— 固定使用 code “@index” */
	private static final String MODULE_INDEX_PAGE_CODE = "@index";
	
	/**
	 * 配置pageModel的文件路径(如：design-data)
	 */
	private static List<File> dataPaths;
	@Override
	public void setDataPaths(String[] paths) throws IOException, URISyntaxException {
		super.setDataPaths(paths);
		//FIXME: Spring hack - 通过 Spring 注射来改变静态变量
		SiteTree.dataPaths = this.dataPathList;
	}
	
	/**
	 * 加载所有第一级的 site 节点，通过第一个节点可以取到它们所有的子节点。（可以用于显示网站主导航菜单）
	 * @return
	 * @throws Throwable
	 */
	public static List<SiteTreeBean> loadTopNodes() throws Throwable {
		
		List<SiteTreeBean> allNodes = buildNodesPlainList();
		if(!allNodes.isEmpty()) {	
			List<SiteTreeBean> topNodes = loadTopNavbar_buildTree(allNodes);
			
			//按照 namespace 排序
			Ordering<SiteTreeBean> ordering =
					Ordering.natural().nullsFirst().onResultOf(new Function<SiteTreeBean, String>() {
				@Override
				public String apply(SiteTreeBean topNode) {
					return topNode.getParentCode();
				}
			});
			Collections.sort(topNodes, ordering);

			return topNodes;
		}
		return null;
	}
	private static List<SiteTreeBean> loadTopNavbar_buildTree(List<SiteTreeBean> siteNodes) {
		String modelIndexTail = NS_SP + MODULE_INDEX_PAGE_CODE;
		
		List<SiteTreeBean> topNodes = new ArrayList<SiteTreeBean>();
		
		Map<String, SiteTreeBean> topNodesIndex = new HashMap<String, SiteTreeBean>();
		List<SiteTreeBean> childNodes = new ArrayList<SiteTreeBean>();
		for(SiteTreeBean node : siteNodes) {
			String pageCode = node.getPageCode();
			if (pageCode.endsWith(modelIndexTail)){
				//如果是模块的主链接页面, 那么将作为导航菜单的父节点
				String modelCode = pageCode.substring(0, pageCode.length()-modelIndexTail.length());
				topNodes.add(node);
				topNodesIndex.put(modelCode, node);
			}else{
				childNodes.add(node);
			}
		}
		for(SiteTreeBean child : childNodes) {
			String parentCode = child.getParentCode();
			Misc.$assert(StringUtils.isEmpty(parentCode), "Page node parent invalid: "+child);

			SiteTreeBean topNode = topNodesIndex.get(parentCode);
			Misc.$assert(null==topNode, "Module index page not defined: "+parentCode);
			
			List<SiteTreeBean> children = topNode.getChildren();
			if (null==children){
				children = new ArrayList<SiteTreeBean>();
				topNode.setChildren(children);
			}
			children.add(child);
		}
		return topNodes;
	}

	private static List<SiteTreeBean> buildNodesPlainList() {
		List<DataFileBean> dataFiles =
				ModelIOUtil.readAllDataFiles(ModelIOConst.FOLDER_NAME_Page, SiteTree.dataPaths);
		
		List<SiteTreeBean> nodes = new ArrayList<SiteTreeBean>();
		String sitePageCodeHead = SITE_ROOT_NS + NS_SP;
		for(DataFileBean nodeData : dataFiles) {
			String namespace = nodeData.getNamespace();
			if(namespace.toUpperCase().startsWith(sitePageCodeHead)) {
				SiteTreeBean node = new SiteTreeBean();
				node.setParentCode(namespace);
				node.setPageCode(nodeData.getFullCode());
				
				Page pageModel = (Page)nodeData.getModel();
				node.setPageName(pageModel.getName());
				node.setPageUrl(pageModel.getUrl());

				nodes.add(node);
			}
		}
		return nodes;
	}

	/**
	 * 加载当前模块的一级 site 节点（页面左侧导航栏）
	 * @return
	 * @throws Throwable
	 */
	public static SiteTreeBean loadCurrentTopNode() throws Throwable {
		String pageCode = getCurrentPageCode();
		return 	getTopNodeByPageCode(pageCode);
	}

	private static SiteTreeBean getTopNodeByPageCode(String pageCode) throws Throwable {
		String moduleCode = pageCode;
		//循环截断最终找到当前 pageCode 对应的第一级节点的 CODE
		while(!moduleCode.substring(0, moduleCode.lastIndexOf(NS_SP)).toUpperCase().equals(SITE_ROOT_NS)) {
			moduleCode = moduleCode.substring(0, moduleCode.lastIndexOf(NS_SP));
		}
		//计算出第一级节点“索引页面”的 Page Code
		String moduleIndex = moduleCode+NS_SP+MODULE_INDEX_PAGE_CODE;
		
		List<SiteTreeBean> topNodes = loadTopNodes();
		for(SiteTreeBean topNode : topNodes){		
			if(moduleIndex.equals(topNode.getPageCode())) {
				return topNode;
			}
		}
		return null;
	}
	
	/**
	 * 构造网页面包屑
	 * @return
	 * @throws Throwable
	 */
	public static List<SiteTreeBean> buildCrumbs() throws Throwable {
		String pageCode = getCurrentPageCode();
		List<SiteTreeBean> allNodes = buildNodesPlainList();
		List<SiteTreeBean> path = new ArrayList<SiteTreeBean>();
		while(!pageCode.toUpperCase().equals(SITE_ROOT_NS)) {
			for(SiteTreeBean node : allNodes) {
				if(pageCode.equals(node.getPageCode())) {
					//对存在子节点的节点, 其 URL 为第一个子节点的 pageUrl
					if(path.size() > 0) {
						SiteTreeBean firstChild = getTopNodeByPageCode(pageCode);
						node.setPageUrl(firstChild.getChildren().get(0).getPageUrl());
					}
					path.add(node);
				}
			}
			pageCode = pageCode.substring(0, pageCode.lastIndexOf(NS_SP));
		}
		Collections.reverse(path);
		return path;
	}
	
	private static String getCurrentPageCode() throws Throwable {
		CmsPageContext ctx = CmsRequestContext.getThreadInstance(CmsPageContext.class);
		Page page = ctx.getPage();
		return page.getCode();
	}
	
	public static class SiteTreeBean {
		private String pageCode;
		private String pageName;
		private String pageUrl;
		private List<SiteTreeBean> children;
		private String parentCode;
		
		public String getPageCode() {
			return pageCode;
		}
		public void setPageCode(String pageCode) {
			this.pageCode = pageCode;
		}
		public String getPageName() {
			return pageName;
		}
		public void setPageName(String pageName) {
			this.pageName = pageName;
		}
		public String getPageUrl() {
			return pageUrl;
		}
		public void setPageUrl(String pageUrl) {
			this.pageUrl = pageUrl;
		}
		public List<SiteTreeBean> getChildren() {
			return children;
		}
		public void setChildren(List<SiteTreeBean> children) {
			this.children = children;
		}
		public String getParentCode() {
			return parentCode;
		}
		public void setParentCode(String parentCode) {
			this.parentCode = parentCode;
		}

		@Override
		public String toString() {
			StringBuilder builder = new StringBuilder();
			builder.append("SiteTreeBean [");
			if (pageCode != null) {
				builder.append("pageCode=");
				builder.append(pageCode);
				builder.append(", ");
			}
			if (pageName != null) {
				builder.append("pageName=");
				builder.append(pageName);
				builder.append(", ");
			}
			if (pageUrl != null) {
				builder.append("pageUrl=");
				builder.append(pageUrl);
			}
			builder.append("]");
			return builder.toString();
		}
	}

}
