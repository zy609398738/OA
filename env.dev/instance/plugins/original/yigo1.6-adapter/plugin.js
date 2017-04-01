/**
 * Yigo-redist Toolkit 01, 包括用于 Yigo 1.6 后台开发的常用功能;
 *
 * Options:
 *    - webApp: [需要附加到的 Java Web App(必须包含 Yigo 1.6 的环境)], 必填
 */
(function(plugin, ctx){
    var descr = "Yigo-redist Toolkit 01";
    
    plugin.configFiles = [];
    plugin.dependencies = [];

    //验证参数有效性
	if (!plugin.options.webApp){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未通过 'webApp' 选项指定关联的 Java Web App", -1)
	}

	var webapp = plugin.options.webApp;
    //当前模块依赖的 jar 包
    webapp.registerWebAppClasspath(os.normalizePath("dist/libs/*.jar", plugin.path));
    //附加当前模块提供的 jar 包
    webapp.registerWebAppClasspath(os.normalizePath("dist/jars/*.jar", plugin.path));
    
    plugin.onDeploy = function(env){
        //Do nothing
    }
})(this, pluginCtx);