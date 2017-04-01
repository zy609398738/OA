/**
 * 将 cms1 的 json 配置导成 cms2 的 json 配置;
 *
 * Options:
 *  - cms2 = [需要使用到的 cms2 插件], 必填
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = ["cms2"];

    //验证参数有效性
	if (!plugin.options.cms2){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未指定 'cms2' 选项", -1)
	}

	var cms2 = plugin.options.cms2;	//cms2 中引用了 webApp, cms2 和 cms2-cms1-import 都是依附于此 Web App 运行的

	var distPath = os.normalizePath("dist", plugin.path)
	cms2.options.webApp.registerWebAppClasspath(distPath+"/jars/*.jar");
	
	//cms/war/oa 目录部署在配置文件目录中
	cms2.options.webApp.registerWebAppAlias("/cms2-imp-cms1", plugin.path+"/war/static");
	
	plugin.onDeploy = function(env){
		//Do nothing
	};
})(this, pluginCtx);