/**
 * Yigo 1.6 over 2.0
 *  - webApp = [需要附加到的 Java Web App], 必填
 *  - jdbcUrl     = [主数据库的 JDBC URL]
 *  - dbUser      = [主数据库的用户名]
 *  - dbPass      = [主数据库的用户访问密码]
 *  - configs     = [包含的多个配置目录], 格式为 包含 {name:..., path:...} 元素的数组, 其中第一个为主配置;
 *                  配置目录支持基于 MODULES_REPO 的相对目录
 */
(function(plugin, ctx){
	plugin.configFiles = ["core.properties", "invoke.properties"];
    plugin.dependencies = [];

    //验证参数有效性
	if (!plugin.options.webApp){
		sys.raiseErr("注册插件 ["+plugin.path+"]时未通过 'webApp' 选项指定关联的 Java Web App", -1)
	}

	var webapp = plugin.options.webApp;

	//运行时需要一些存储在 classpath 中的配置文件
	var runtimeClassesPath = os.normalizePath(plugin.name+"/classes", env.PROFILE_RUNTIME);
	webapp.registerWebAppClasspath(runtimeClassesPath);
	
	//注册必要的 jar 包
	var distPath = os.normalizePath("dist", plugin.path)
	webapp.registerWebAppClasspath(distPath+"/jars/*.jar");
	webapp.registerWebAppClasspath(distPath+"/libs/*.jar");
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "std/prop", "std/utils/misc", "app/_tools"], function(os, shell, prop, misc, _tools) {
        	//处理数据库相关的选项
        	var yigoJdbcUrl = plugin.options.jdbcUrl;
        	var yigoJdbcDriver = misc.detectJdbcDriver(plugin.options.jdbcUrl);
        	var yigoDbUserName = plugin.options.dbUser;
        	var yigoDbPassword = plugin.options.dbPass;
        	var yigoDBType = null;	//DB2=0; Oracle=1; SQLServer=2; MySQL=3;
        	if (yigoJdbcDriver.indexOf("mysql")>=0){
        		yigoDBType = "3";
        	}else if (yigoJdbcDriver.indexOf("oracle")>=0){
        		yigoDBType = "1";
        	}else if (yigoJdbcDriver.indexOf("sqlserver")>=0 || yigoJdbcDriver.indexOf("jtds")>=0){
        		yigoDBType = "2";
        	}
        	if (! yigoDBType){
        		_tools.pause("不支持的数据库类型 ["+yigoJdbcUrl+"], 请检查系统配置.", -20);
        	}
        	
        	//处理 configs 列表 - 注意由于这个操作是在 deploy 时进行的, 所以允许其它插件对 configs 列表进行修改
        	//支持相对目录(基于 env.MODULES_REPO)
        	var configs = plugin.options.configs || [];
        	if (configs.length<=0){
        		_tools.pause("配置文件目录定义(onfigs)选项为空, 请检查系统配置.", -20);
        	}
        	var mainCfgPath = configs[0].path;
        	mainCfgPath = os.normalizePath(mainCfgPath, env.MODULES_REPO);
        	var addCfgPaths = [];
        	var addCfgNames = [];
        	for (var i=1; i<configs.length; i++){
        		var cfg = configs[i];
        		var path = misc.trim(cfg.path);
        		path = os.normalizePath(path, env.MODULES_REPO);
                if (! os.fileExists(path)){
                    _tools.pause("找不到配置文件目录 ["+path+"], 请检查系统配置.", -20);
                }
                addCfgPaths.push(path);
                addCfgNames.push(misc.trim(cfg.name));
        	}
        	
        	//清除存储在 classpath 中的配置文件
        	try{
        		shell.rm(runtimeClassesPath);
        	}catch(ex){
        		//Keep silence
        	}
        	shell.mkdir(runtimeClassesPath);

        	//处理 core.properties 文件, 考虑到 Yigo2 也使用同名的文件, 因此需要考虑对 Yigo2 的兼容性
            var coreFile = plugin.configFiles["core.properties"];
            var coreFileTarget = runtimeClassesPath + "/core.properties";
            var coreFileAppend = false;
        	if (webapp.name == "yigo2"){  //FIXME: 针对 Yigo2 的特殊处理
        		coreFileTarget = os.normalizePath("webapps/yigo/WEB-INF/classes/core.properties", webapp.path);
        		coreFileAppend = true;  //Yigo2 应该已经重新写过 core.properties 了, 因此只需要 append 就可以了
        	}
            log.info("core.properties 配置文件来源: [" + coreFile + "] .");
            var coreProps = prop.loadProp(coreFile);
            coreProps.setProperty("server.path", os.normalizePath("server.path", plugin.path));
            coreProps.setProperty("server.config", mainCfgPath);
            coreProps.setProperty("server.additionalConfig.name", addCfgNames.join(","));
            coreProps.setProperty("server.additionalConfig.path", addCfgPaths.join(","));
            coreProps.setProperty("server.dsn.description", env.PROFILE_NAME);
            coreProps.setProperty("server.dsn.dbtype", yigoDBType);
            coreProps.setProperty("server.db.yigo-redist.dbtype", yigoDBType);
            coreProps.setProperty("server.db.yigo-redist.driver", yigoJdbcDriver);
            coreProps.setProperty("server.db.yigo-redist.url", yigoJdbcUrl);
            coreProps.setProperty("server.db.yigo-redist.user", yigoDbUserName);
            coreProps.setProperty("server.db.yigo-redist.pass", yigoDbPassword);
            if(coreFileAppend){
            	prop.appendProp(coreFileTarget, coreProps, "Append from "+coreFile);
            	
            }else{
            	prop.saveProp(coreFileTarget, coreProps, "Create from "+coreFile);
            }
            //处理 invoke.properties 配置文件
            var ivkFile = plugin.configFiles["invoke.properties"];
            log.info("invoke.properties 配置文件来源: [" + ivkFile + "] .");
            var ivkFileTarget = runtimeClassesPath + "/invoke.properties";
            shell.cp(ivkFile, ivkFileTarget);
            
    		//如果需要在 Yigo2 的 设计器 中也能够调试 Yigo 1.6 的内容，
            //那么还需要把 core.properties 和 invoke.properties 放到启动 2.0 设计器的 classpath 中去
            if (webapp.name == "yigo2"){  //FIXME: 针对 Yigo2 的特殊处理
            	var yigo2DnRuntimeClasses = os.normalizePath("designer/classes", webapp.runtime);
            	shell.cp(coreFileTarget, os.normalizePath("core.properties", yigo2DnRuntimeClasses));
            	shell.cp(ivkFileTarget, os.normalizePath("invoke.properties", yigo2DnRuntimeClasses));
            }
        });
	};
})(this, pluginCtx);