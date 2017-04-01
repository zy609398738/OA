/**
 * nginx 集成插件, 将 nginx 部署集成到启动过程中;
 * 支持的 Options:
 *    - solution: 配置方案目录路径, 注意主配置文件总是 <solution>/conf/nginx.conf, 默认为 nginx 程序所在目录
 *    - port: 端口, 默认是 80, 通过 NGINX_HTTP_PORT 环境变量传递给 nginx 运行程序, 此参数目前无效
 *    - installed: 是否使用系统安装的 nginx(仅对 Windows 平台有效)，默认为 false
 */
(function(plugin, ctx){
	plugin.configFiles = [
	];
	
	plugin.onDeploy = function(env){
        var solution = os.normalizePath("win32", plugin.path);
        if (plugin.options && plugin.options.solution){
        	solution = os.normalizePath(plugin.options.solution, plugin.path);
        }
        log.info("nginx 方案目录: [" + solution + "] .");
        
        var httpPort = 80;
        if (plugin.options && plugin.options.port){
        	httpPort = plugin.options.port;
        }

        require (["std/os", "std/shell"], function(os, shell) {
            var prog = "nginx";
    		if (plugin.options && plugin.options.installed){
    			prog = "nginx";
    		}else{
    			if (os.isWindows){
    				prog = os.normalizePath("win32\\nginx.exe", plugin.path);
    			}
    		}
    		
    		var cmd;
			if (os.isWindows){
				cmd = os.normalizePath("nginx.bat", plugin.path);
			}else if(os.isUnix||os.isMac){
				cmd = os.normalizePath("nginx.sh", plugin.path);
			}else{
				throw "当前平台上不支持 nginx";
			}
    		
    		env.NGINX_PROG_PATH = prog;	//可执行文件的路径(仅针对 Windows 平台)
    		env.NGINX_HTTP_PORT = httpPort;
    		env.NGINX_SOLUTION = solution;
            log.info("启动 nginx: [" + cmd + "] ...");
            log.info("NGINX_PROG_PATH = " + env.NGINX_PROG_PATH);
            log.info("NGINX_HTTP_PORT = " + env.NGINX_HTTP_PORT);
            log.info("NGINX_SOLUTION  = " + env.NGINX_SOLUTION);
            log.info("================================================================================");
            //此处使用 solution 目录作为进程标签以便在退出和重新运行时清除原进程
            var exitValue = shell.startProcess(cmd, env, env.NGINX_SOLUTION, env.NGINX_SOLUTION);
            if (exitValue !=0){
            	require (["app/_tools"], function(_tools) {
        	        _tools.pause("Nginx 启动错误.", exitValue);
            	});
            }
            log.info("================================================================================");
    	});
	}
})(this, pluginCtx);