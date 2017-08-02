/**
 * Yigo2.0 集成插件
 *  - 支持的 Options:
 *    - contextPath 	 = [Web上下文路径] : 默认为 yigo.
 *    - webappPath  	 = [Yigo2 服务器端的路径], 默认为当前插件目录下的 webapps/yigo 目录; 支持基于 MODULES_REPO 的相对路径.
 *    - dsn         	 = [默认的 DSN 名称] : 默认为 Yigo-redist; 更多的 DSN 可以通过插件 yigo2-configer 独立定义.
 *    - jdbcUrl     	 = [主数据库的 JDBC URL]
 *    - dbUser       	 = [主数据库的用户名]
 *    - dbPass      	 = [主数据库的用户访问密码]
 *    - projects     	 = [包含的多个配置目录], 格式为 包含 {key:..., caption:..., path:...} 元素的数组,
 *		                    其中第一个为 StartProject, 其父目录即是 Solution 目录.
 *                    		可选，为空时会跳过产生 Solution.xml 的步骤(此时需要手动编写 Solution.xml 并保存在 solution 目录下).
 *    - solutionPath	 = [Solution 目录], 支持基于 MODULES_REPO 的相对路径;
 *                   		如果不设置 projects 数组, 那么必须设置 solutionPath;
 *                    		反之 solutionPath 可选, 如果不设置 solutionPath, 系统会自动把 projects[0].path 的父目录作为 solutionPath;
 *    - debug			 = 是否是debug模式,debug模式下,显示中间层查询的sql等log
 *    - mockUrl          = [仅影响设计器, 模拟定义一个 HTTP 访问的 URL], 默认为 http://localhost:8080/yigo;
 *                    		用于保证某些需要 request/response 的代码的正常运行
 *    - readyCheckSQL    = [检查数据库是否准备好的sql语句] sql语句第一列的返回值,必须为整型,返回值大于表示数据库初始化完成,否则就是未完成
 *                          例如:select count(*) as result From gp_operator
 *						    可选,如果不填则不检查数据库是否准备好
 */
(function(plugin, ctx){
	plugin.attributes  = {
		javaWebApp: true
	};
	plugin.configFiles = [
	    "core.properties", "DSN.properties", "Solution.xml",
	    "designer.sh", "designer.bat", "History.properties",
	    "launcher.sh", "launcher.bat", "launcher.properties",
	    "license", "designer.log4j.properties", "launcher.log4j.properties",
	    "log4j.properties", "dbcp.properties", "quartz_jobs.xml"
	];
    plugin.dependencies = [];
    
    //确定是否需要自动生成 Solution.xml
	var dynamicProjectsSupport = false;
	if (plugin.options && plugin.options.projects && plugin.options.projects.length > 0){
		dynamicProjectsSupport = true;
	}else{
		dynamicProjectsSupport = false;
		plugin.options.projects = [];
		//如果未设置 projects, 则必须设置 solutionPath
		if (plugin.options && plugin.options.solutionPath){
			//OK
		}else{
			require (["app/_tools"], function(_tools) {
				_tools.pause("如果不设置 projects 选项, 那么必须指定 solutionPath .", -20);
			});
		}
	}
	
	if (plugin.options && plugin.options.readyCheckSQL){
		require (["std/utils/misc"], function(misc) {
			misc.checkForDBReady(
				plugin.options.jdbcUrl,
				plugin.options.dbUser,
				plugin.options.dbPass,
				plugin.options.readyCheckSQL
			);
		});
	}
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "std/utils/misc", "app/_tools"], function(os, shell, misc, _tools) {
        	//处理 contextPath 选项
        	var yigo2AppCtxPath = "yigo";
        	if(plugin.options && plugin.options.contextPath){
        		yigo2AppCtxPath = plugin.options.contextPath;
        	}
        	//处理 webappPath 选项
        	var yigo2WebApp = "webapps/yigo";
        	if(plugin.options && plugin.options.webappPath){
        		yigo2WebApp = plugin.options.webappPath;
        		yigo2WebApp = os.normalizePath(yigo2WebApp, env.MODULES_REPO);
        	}
        	//处理 dsn 选项
        	var yigo2DSN = "Yigo-redist";
        	if(plugin.options && plugin.options.dsn){
        		yigo2DSN = dsn;
        	}
        	//处理 debug 选项
			var debug = "false";
			if(plugin.options && plugin.options.debug){
        		debug = plugin.options.debug;
        	}
			//处理 mockUrl 选项
			var mockUrl="http://localhost:8080/yigo";
			if(plugin.options && plugin.options.mockUrl){
				mockUrl = plugin.options.mockUrl;
        	}
        	//处理数据库相关的选项
        	var yigo2JdbcUrl = plugin.options.jdbcUrl;
        	var yigo2JdbcDriver = misc.detectJdbcDriver(plugin.options.jdbcUrl);
        	var yigo2DBUserName = plugin.options.dbUser;
        	var yigo2DBPassword = plugin.options.dbPass;
        	var yigo2DBType = null;
        	if (yigo2JdbcDriver.indexOf("mysql")>=0){
        		yigo2DBType = "MySql";
        	}else if (yigo2JdbcDriver.indexOf("oracle")>=0){
        		yigo2DBType = "Oracle";
        	}else if (yigo2JdbcDriver.indexOf("sqlserver")>=0 || yigo2JdbcDriver.indexOf("jtds")>=0){
        		yigo2DBType = "SqlServer";
        	}
        	if (! yigo2DBType){
        		_tools.pause("不支持的数据库类型 ["+yigo2JdbcUrl+"], 请检查系统配置.", -20);
        	}
        	
        	//处理 projects 列表 - 注意由于这个操作是在 deploy 时进行的, 所以允许其它插件对 projects 列表进行修改
        	//支持相对目录(基于 env.MODULES_REPO)
        	var projects = plugin.options.projects || [];
        	if ( (!dynamicProjectsSupport) && projects.length>0 ){
        		_tools.pause("projects 选项(='"+projects+"')错误: "
        				+"在手工维护 Solution.xml 的情况下, 不能设置 yigo2 插件的 projects 选项.", -20);
        	}
        	
        	var solutionPath;
        	if (dynamicProjectsSupport){
            	if (plugin.options.solutionPath){
            		solutionPath = os.normalizePath(plugin.options.solutionPath, env.MODULES_REPO);
            	}else{
                	var startPrjPath = misc.trim(projects[0].path);
                	solutionPath = os.normalizePath("..", os.normalizePath(startPrjPath, env.MODULES_REPO));
            	}
            	var startPrj = projects[0].key;
            	var prjList = [];
            	for (var i=0; i<projects.length; i++){
            		var prj = projects[i];
            		var path = misc.trim(prj.path);
            		path = os.normalizePath(path, env.MODULES_REPO);
                    if (! os.fileExists(path)){
                        _tools.pause("找不到配置文件目录 ["+path+"], 请检查系统配置.", -20);
                    }
                    
            		prjList[prjList.length] =
            			'<Project Caption="'+prj.caption+'" Key="'+prj.key+'" Path="'+path+'"/>';
            	}
            	var prjListXml = prjList.join("\n");

            	var slnFile = plugin.configFiles["Solution.xml"];
                log.info("Solution 配置文件: [" + slnFile + "] .");
                //FIXME: 目前 Yigo 的 Solution 可以有自己的定义(CommonDef.xml等)和资源(Resource), 所以 Solution 必须有一个自己的目录
                var slnTarget = os.normalizePath("Solution.xml", solutionPath);
            	var vars = {
                		NOW: new java.sql.Timestamp((new Date()).getTime()),
                		PROFILE_NAME:     env.PROFILE_NAME,
                		START_PROJECT:    startPrj,
                		PROJECT_LIST_XML: prjListXml
                	};
            	shell.copyTemplateFile(slnFile, slnTarget, vars);
        	}else{
        		solutionPath = os.normalizePath(plugin.options.solutionPath, env.MODULES_REPO);
        	}

            var coreFile = plugin.configFiles["core.properties"];
            log.info("core.properties 配置文件: [" + coreFile + "] .");
            var dsnFile = plugin.configFiles["DSN.properties"];
            log.info(yigo2DSN+".properties 配置文件: [" + dsnFile + "] .");

            var dbcpFile = plugin.configFiles["dbcp.properties"];
            log.info("dbcp.properties 配置文件: [" + dbcpFile + "] .");
			
	    var log4jFile = plugin.configFiles["log4j.properties"];
            log.info("log4j.properties 配置文件: [" + log4jFile + "] .");
			
            var quartzJobsFile = plugin.configFiles["quartz_jobs.xml"];
            log.info("quartz_jobs.xml 配置文件: [" + dbcpFile + "] .");
            //处理配置文件
        	var n2a = misc.prepare4Property;    //native2ascii
            //FIXME: 由于相关文件需要放到 yigo2WebApp 目录下，所以目前只能支持同时运行一个 Yigo 实例，除非可以使用 classpath 等技术指定不同的配置文件位置
            var coreTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/core.properties", plugin.path);
            var dsnTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/"+yigo2DSN+".properties", plugin.path);
            var dnDsnTarget = os.normalizePath(yigo2DSN+".properties", os.normalizePath("Designer", plugin.path));  //设计器使用的 DSN
            var dbcpTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/dbcp.properties", plugin.path); 
            var dnDbcpTarget = os.normalizePath("dbcp.properties", os.normalizePath("Designer", plugin.path));
            var log4jTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/log4j.properties", plugin.path);
            var quartzJobsTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/quartz_jobs.xml", plugin.path); 
            var dnQuartzJobsTarget = os.normalizePath("quartz_jobs.xml", os.normalizePath("Designer", plugin.path));
        	var vars = {
        		NOW: new java.sql.Timestamp((new Date()).getTime()),
        		PROFILE_NAME:     env.PROFILE_NAME,
        		SOLUTION_PATH:    n2a(solutionPath),
        		DSN:              yigo2DSN,
        		DB_TYPE:          yigo2DBType,
        		JDBC_DRIVER:      yigo2JdbcDriver,
        		JDBC_URL:         n2a(yigo2JdbcUrl),
        		DB_USERNAME:      yigo2DBUserName,
        		DB_PASSWORD:      n2a(yigo2DBPassword),
				DEBUG:			  debug
        	};
        	shell.copyTemplateFile(coreFile, coreTarget, vars);
        	shell.copyTemplateFile(dsnFile, dsnTarget, vars);
        	shell.copyTemplateFile(dsnFile, dnDsnTarget, vars);
        	shell.copyTemplateFile(dbcpFile, dbcpTarget, vars);
        	shell.copyTemplateFile(dbcpFile, dnDbcpTarget, vars);
        	shell.copyTemplateFile(log4jFile, log4jTarget, vars);
        	shell.copyTemplateFile(quartzJobsFile, quartzJobsTarget, vars);
        	shell.copyTemplateFile(quartzJobsFile, dnQuartzJobsTarget, vars);
        	
        	//处理 license
        	var license = plugin.configFiles["license"];
        	var licTarget = os.normalizePath(yigo2WebApp+"/WEB-INF/classes/license", plugin.path);
        	shell.cp(license, licTarget);
        	licTarget = os.normalizePath("Designer/license", plugin.path);
        	shell.cp(license, licTarget);
        	
        	//发布为 Web App
        	profile.registerWebApp(yigo2AppCtxPath, yigo2WebApp, null, null, plugin);
        	
        	//处理 Designer 和 Launcher 的 runtime 目录
        	var classesDn = os.normalizePath("designer/classes", plugin.runtime);
        	var classesApp = os.normalizePath("launcher/classes", plugin.runtime);
        	shell.rm(plugin.runtime);
        	shell.mkdir(classesDn);
        	shell.mkdir(classesApp);
        	
        	//处理 Designer 的 log4j 配置
        	var designerLog4j = plugin.configFiles["designer.log4j.properties"];
        	shell.cp(designerLog4j, os.normalizePath("Designer/log4j.properties", plugin.path));
        	
        	//处理 App 的 log4j 配置
        	var appLog4j = plugin.configFiles["launcher.log4j.properties"];
        	shell.cp(appLog4j, os.normalizePath("log4j.properties", classesApp));
        	
        	//集成设计器及客户端启动脚本
        	var classpath = plugin.attachments._javaWebAppClasspathList || [];	//FIXME: 未公开的属性访问 - _javaWebAppClasspathList
            if (classpath.length <= 0) classpath[0] = "BLANK";
            classpath = _tools.normalizeClasspaths(classpath, true);
            vars = {
            		NOW: new java.sql.Timestamp((new Date()).getTime()),
            		DSN: yigo2DSN,
            		JAVA_HOME: os.getProp("JAVA_HOME"),
            		PLUGIN_PATH: plugin.path,
            		LAUNCHER_PATH: os.normalizePath("app", plugin.path),
            		DESIGNER_PATH: os.normalizePath("Designer", plugin.path),
            		SOLUTION_PATH: solutionPath,
            		SOLUTION_PATH_PROP: n2a(solutionPath),
            		TOMCAT_PORT_HTTP: env.TOMCAT_PORT_HTTP,
            		YIGO2_CTX_PATH: yigo2AppCtxPath,
            		YIGO2_HTTP_URL_PROP: n2a("http://localhost:"+env.TOMCAT_PORT_HTTP+"/"+yigo2AppCtxPath),
            		LAUNCHER_RUNTIME_CLASSES: classesApp,
            		DESIGNER_RUNTIME_CLASSES: classesDn,
            		DESIGNER_MOCK_URL: mockUrl
            }
            var _buildCmd = function(typeFile){
                var fTarget;
            	if ("launcher.properties"==typeFile){
                    fTarget = os.normalizePath("launcher.properties", os.normalizePath("app", plugin.path));
            	}else if ("History.properties"==typeFile){
            		fTarget = os.normalizePath("History.properties", os.normalizePath("Designer", plugin.path));
            	}else{
            		var dbId = misc.getJdbcUrlIdentity(yigo2JdbcUrl);
					dbId = dbId.replace(":","$");
                    fTarget = os.normalizePath(yigo2DBUserName+"@"+dbId+"."+typeFile, env.PROFILE);
            	}
				log.info("Command for [" + typeFile + "]: ["+fTarget+"] .");
				shell.copyTemplateFile(plugin.configFiles[typeFile], fTarget, vars);
				if (misc.endsWith(fTarget, ".sh")){
	                shell.makeExecutable(fTarget);
				}
            }
			if (os.isWindows){
                vars.ADDITIONAL_CP = '"'+classpath.join('";"')+'"';
                _buildCmd("designer.bat");
                _buildCmd("launcher.bat");
			}else{
                vars.ADDITIONAL_CP = classpath.join(":");
                _buildCmd("designer.sh");
                _buildCmd("launcher.sh");
			}
            _buildCmd("History.properties");
            _buildCmd("launcher.properties");
        });
	};
})(this, pluginCtx);