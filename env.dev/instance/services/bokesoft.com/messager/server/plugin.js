/**
 * bokesoft-messager 集成插件, 将 nginx 部署集成到启动过程中;
 * Options:
 *  - dataPath: 存放数据的路径(包括消息历史和图片/附件等), 默认值为 ${PROFILE}/im-data, 支持基于 env.PROFILE 的相对路径
 *  - port: IM服务器的运行端口, 可选
 *  - fpsPort: FlashPolicyServer 的运行端口, 可选
 *  - allowServerIPs: 定义哪些服务器可以访问后台服务, 格式如：['127.0.0.1','192.168.1.101','localhost'], 可选
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
	if(plugin.options && plugin.options.port){
		env.BK_IM_PORT = plugin.options.port;
	}
	if(plugin.options && plugin.options.fpsPort){
		env.BK_IM_FPS_PORT = plugin.options.fpsPort;
	}
	if(plugin.options && plugin.options.allowServerIPs){
		env.BK_IM_ALLOW_SERVER_IP = plugin.options.allowServerIPs;
	}
	
	plugin.onDeploy = function(env){
        require (["std/os", "std/shell", "app/_tools"], function(os, shell, _tools) {
    		var cmd;
			if (os.isWindows){
				cmd = os.normalizePath("start-messager-server.bat", plugin.path);
			}else if(os.isUnix||os.isMac){
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