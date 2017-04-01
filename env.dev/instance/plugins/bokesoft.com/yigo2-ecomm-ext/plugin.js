/**
 * 电商部门的 Yigo2 扩展模块, 支持以下参数
 *  - webApp: 支持部署为 Java WebApp 的 plugin 对象, 必填
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = ["yigo2"];

    //验证参数有效性
	if (!plugin.options.webApp){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未指定 'webApp' 选项", -1)
	}
	
	var webApp = plugin.options.webApp;	//引用 webApp
	
	var distPath = os.normalizePath("dist", plugin.path)
	webApp.registerWebAppClasspath(distPath+"/jars/*.jar");
	webApp.registerWebAppClasspath(distPath+"/libs/*.jar");

	plugin.onDeploy = function(env){
		//Do nothing
	};
})(this, pluginCtx);