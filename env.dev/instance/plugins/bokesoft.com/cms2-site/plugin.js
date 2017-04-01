/**
 * 基于 CMS2 内容网站框架, 支持以下参数
 *  - cms2 = [需要使用到的 cms2 插件], 必填
 *  - newsDetailBlockCode = [显示新闻详细的页面, 只有包含这个 block 的 page 才被看作新闻页面] : 默认为 cms2-site.news.news-detail
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = ["cms2"];

    //验证参数有效性
	if (!plugin.options.cms2){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未指定 'cms2' 选项", -1)
	}

	var cms2 = plugin.options.cms2;	//cms2 中引用了 webApp, cms2 和 cms2-site 都是依附于此 Web App 运行的

	//注册必要的 jar 包
	var distPath = os.normalizePath("dist", plugin.path)
	cms2.options.webApp.registerWebAppClasspath(distPath+"/jars/*.jar");

	//注册自带的 cms site 目录
	var sitePath = os.normalizePath("site", plugin.path);
	var siteFolders = cms2.options.DefaultCmsBootConfigurer.siteFolders;
	siteFolders[siteFolders.length] = sitePath;

	plugin.onDeploy = function(env){
		var blockCode = "cms2-site.news.news-detail";
		if (plugin.options && plugin.options.newsDetailBlockCode){
			blockCode = plugin.options.newsDetailBlockCode;
		}
		env.CMS2_SITE_NEWS_DETAIL_BLOCK = blockCode;
	};
})(this, pluginCtx);