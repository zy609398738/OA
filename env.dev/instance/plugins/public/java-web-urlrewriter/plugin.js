/**
 * org.tuckey UrlRewriteFilter 集成插件(参考 http://www.tuckey.org/urlrewrite/)
 *  - 支持的 Options:
 *    - webApp:   部署为 Java WebApp 的 plugin 对象; 必填
 *    - confPath: url rewrite 规则配置文件路径, 支持基于 MODULES_REPO 的相对路径; 可选，默认为当前 plugin 自带的测试规则文件
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = [];
    
	//注册必要的 jar 包
	if (plugin.options && plugin.options.webApp){
    	var distPath = os.normalizePath("urlrewrite-wrapper/dist", plugin.path)
    	var webApp = plugin.options.webApp;
		webApp.registerWebAppClasspath(distPath+"/jars/*.jar");
    	webApp.registerWebAppClasspath(distPath+"/libs/*.jar");
	}else{
		require (["app/_tools"], function(_tools) {
			_tools.pause("注册插件 ["+plugin.path+"]时未通过 webApp 选项引用一个产生 Java Web App 的插件", -1);
		});
	}
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "std/utils/misc", "app/_tools"], function(os, shell, misc, _tools) {
        	//处理 confPath 配置
        	var confPath = os.normalizePath("test-rules/urlrewrite.xml", plugin.path);
        	if (plugin.options && plugin.options.confPath){
        		confPath = os.normalizePath(plugin.options.confPath, env.MODULES_REPO);
        	}
    		env.YIGOREDIST_TUCKEY_URLWRITER_confPath = confPath;
        });
	};
})(this, pluginCtx);