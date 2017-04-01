/**
 * bokesoft-messager 集成插件, 将 nginx 部署集成到启动过程中;
 * Options:
 *  - dataPath: 存放数据的路径(包括消息历史和图片/附件等), 默认值为 ${PROFILE}/im-data, 支持基于 env.PROFILE 的相对路径
 */
(function(plugin, ctx){
	plugin.configFiles = [
	];
	
	var dataPath = os.normalizePath("im-data", env.PROFILE);
	if(plugin.options && plugin.options.dataPath){
    	//默认查询方式
		dataPath = os.normalizePath(plugin.options.dataPath, env.PROFILE);
	}
	env.BK_IM_DATA_PATH = dataPath;
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "app/_tools"], function(os, shell, _tools) {
    		var cmd;
			if (os.isWindows){
				cmd = os.normalizePath("start-messager-server.bat", plugin.path);
			}else if(os.isUnix){
				cmd = os.normalizePath("start-messager-server.sh", plugin.path);
			}else{
				_tools.pause("当前平台("+os.getOSName()+")不支持 bokesoft-messager", -1);
			}
    		
            log.info("启动 bokesoft-messager: [" + cmd + "] ...");
            log.info("================================================================================");
            //此处使用 profile 目录作为进程标签以便在退出和重新运行时清除原进程
            var stamp = "bokesoft-messager@"+env.PROFILE;
            var exitValue = shell.startProcess(cmd, env, stamp, stamp);
            if (exitValue !=0){
            	require (["app/_tools"], function(_tools) {
        	        _tools.pause("bokesoft-messager 启动错误.", exitValue);
            	});
            }
            log.info("================================================================================");
    	});
	}
})(this, pluginCtx);