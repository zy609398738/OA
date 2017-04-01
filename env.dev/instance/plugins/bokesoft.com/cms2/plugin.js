/**
 * CMS 2.0 集成插件
 *  - 支持的 Options:
 *    - webApp: 支持部署为 Java WebApp 的 plugin 对象
 *    - DefaultCmsBootConfigurer: CMS2 默认的 BootConfigurer 设置:
 *     * siteFolders = [Site 配置文件目录列表]; 字符串数组, 默认为 [${PROFILE_RUNTIME}/site-data] 目录; 支持基于 MODULES_REPO 的相对路径 ;
 *     * workFolder = [Site 工作目录]; 默认为 ${PROFILE_RUNTIME}/site-work 目录; 支持基于 PROFILE_RUNTIME 的相对路径 ;
 *     * developMode = [是否开发模式]; 默认为 false, 即非开发模式, =true 设置系统为开发模式
 */
(function(plugin, ctx){
	plugin.configFiles = [];
    plugin.dependencies = [];
    
    //验证参数有效性
    if (!plugin.options || !plugin.options.DefaultCmsBootConfigurer || !plugin.options.DefaultCmsBootConfigurer.siteFolders){
    	sys.raiseErr("注册插件 ["+plugin.path+"]时未指定 'DefaultCmsBootConfigurer.siteFolders' 选项", -1);
    }
	
	//注册必要的 jar 包
	if (plugin.options && plugin.options.webApp){
    	var distPath = os.normalizePath("dist", plugin.path)
    	var webApp = plugin.options.webApp;
		webApp.registerWebAppClasspath(distPath+"/jars/*.jar");
    	webApp.registerWebAppClasspath(distPath+"/libs/*.jar");
	}else{
		sys.raiseErr("注册插件 ["+plugin.path+"]时未通过 webApp 选项引用一个产生 Java Web App 的插件", -1)
	}
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "std/utils/misc", "app/_tools"], function(os, shell, misc, _tools) {
        	//处理 DefaultCmsBootConfigurer 配置
        	if (plugin.options && plugin.options.DefaultCmsBootConfigurer){
        		var bc = plugin.options.DefaultCmsBootConfigurer;
        		//指定 CMS 元数据的存放目录列表, 其中可以包含多个路径, 使用分号隔开
        		var CMS_SITE_FOLDERS = os.normalizePath("site-data", env.PROFILE_RUNTIME);
        		if (bc.siteFolders){
        			if (!Array.isArray(bc.siteFolders)){
        				bc.siteFolders = bc.siteFolders.split(";");
        			}
        			for (var i=0; i<bc.siteFolders.length; i++){
        				bc.siteFolders[i] = os.normalizePath(bc.siteFolders[i], env.MODULES_REPO);
        			}
        		}
        		CMS_SITE_FOLDERS = bc.siteFolders.join(";");
        		profile.registerJavaOpts( "-Dcom.bokesoft.cms2.impl.buildin.backend.CMS_SITE_FOLDERS=\""+CMS_SITE_FOLDERS+"\"");
        		//指定 CMS 工作目录
        		var CMS_WORK_FOLDER = os.normalizePath("site-work", env.PROFILE_RUNTIME);
        		if (bc.workFolder){
        			CMS_WORK_FOLDER = os.normalizePath(bc.workFolder, env.PROFILE_RUNTIME);
        		}
        		shell.mkdir(CMS_WORK_FOLDER);
        		profile.registerJavaOpts( "-Dcom.bokesoft.cms2.impl.buildin.backend.CMS_WORK_FOLDER="+CMS_WORK_FOLDER);
        		//确定是否开发模式
        		if (bc.developMode){
        			profile.registerJavaOpts( "-Dcom.bokesoft.cms2.impl.buildin.backend.CMS_DEVELOP_MODE=true");
        		}
        	}
        });
	};
})(this, pluginCtx);