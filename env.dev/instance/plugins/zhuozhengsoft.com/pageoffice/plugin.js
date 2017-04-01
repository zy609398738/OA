 /**
 * PageOffice 集成插件
 *  - 支持的 Options:
 *    - contextPath = [Web上下文路径]; 默认为 pageoffice ;
 *    - configDir = *必填,接口配置存放的路径,支持基于 MODULES_REPO 的相对路径 ;
 */
(function(plugin, ctx){
	plugin.attributes  = {
		javaWebApp: true
	};
	plugin.configFiles = [];
    plugin.dependencies = [];
	/*
	//处理 configDir 选项
	if(plugin.options && plugin.options.configDir){			
		require (["std/os"], function(os){			
			var configPath = os.normalizePath(plugin.options.configDir,env.MODULES_REPO);
			if (!os.fileExists(configPath)){
				sys.raiseErr("参数[configDir]定义的路径["+configPath+"] 未找到", -9);
			}
			pluginCtx.profile.registerJavaOpts(
				"-Dbokedee.workspace.config-root="+configPath
			);
		});
	}else{
		sys.raiseErr("参数[configDir]未定义", -9);
	}	
	*/
	plugin.onDeploy = function(env){
		
		var pageoffice2WarCtxPath = "pageoffice";
		if(plugin.options && plugin.options.contextPath){
			pageoffice2WarCtxPath = plugin.options.contextPath;
		}			

		require (["std/os"], function(os) {
			var pageoffice2WebAppDir = "war";
			profile.registerWebApp(pageoffice2WarCtxPath, os.normalizePath(pageoffice2WebAppDir, plugin.path));
        });
	};
})(this, pluginCtx);