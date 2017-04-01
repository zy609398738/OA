/**
 * CMS2 的 Yigo 2.0 Adapter, 支持以下参数
 *  - cms2 = [需要使用到的 cms2 插件], 必填
 *  - customConfig = [是否使用自定义的 spring 配置文件] : 默认为 false (此时使用本模块自带的 cms-boot.xml)
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = ["cms2", "yigo2", "yigo2-ecomm-ext"];

    //验证参数有效性
	if (!plugin.options.cms2){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未指定 'cms2' 选项", -1)
	}
	
	var cms2 = plugin.options.cms2;	//cms2 中引用了 webApp, cms2 和 cms2-yigo2-adapter 都是依附于此 Web App 运行的
	
	var distPath = os.normalizePath("dist", plugin.path)
	cms2.options.webApp.registerWebAppClasspath(distPath+"/jars/*.jar");
	cms2.options.webApp.registerWebAppClasspath(distPath+"/libs/*.jar");

	if ( ! plugin.options || ! plugin.options.customConfig){
		cms2.options.webApp.registerWebAppClasspath( os.normalizePath("src/spring-configs", plugin.path) );
	}
	
	plugin.onDeploy = function(env){
		//Do nothing
	};
})(this, pluginCtx);