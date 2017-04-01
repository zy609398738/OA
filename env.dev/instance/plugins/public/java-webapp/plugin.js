/**
 * 基本的 Java WebApp 定义;
 * 注意：这个插件把默认 index.jsp 放到 _default 目录下, 方便使用中通过 registerWebAppAlias 实现自定义的 index.jsp
 *  - 支持的 Options:
 *    - contextPath = [Web上下文路径]; 默认为 / ;
 *    - webappPath  = [服务器端 war 应用的路径], 默认为 plugin 目录下的 war 目录; 支持基于 env.MODULES_REPO 的相对路径 ;
 */
(function(plugin, ctx){
	plugin.attributes  = {
		javaWebApp: true
	};
	plugin.configFiles = [];
    plugin.dependencies = [];
	
	plugin.onDeploy = function(env){
        require (["std/os"], function(os) {
        	//处理 contextPath 选项
        	var warCtxPath = "/";
        	if(plugin.options && plugin.options.contextPath){
        		warCtxPath = plugin.options.contextPath;
        	}
        	//处理 webappPath 选项
        	var webAppDir = "war";
        	if(plugin.options && plugin.options.webappPath){
        		webAppDir = plugin.options.webappPath;
        		webAppDir = os.normalizePath(webAppDir, env.MODULES_REPO);
        	}
        	profile.registerWebApp(warCtxPath, webAppDir, null, null, plugin);
        });
	};
})(this, pluginCtx);