define(function () {
    return {
    	/** 暂停并显示错误信息 */
        pause: function(msg, errCode){
            print(msg);
            java.lang.System.out.print("按 Enter 退出 ...");
            java.lang.System.console().readLine();
            if ( null!=errCode && 0!=errCode){
                java.lang.System.exit(errCode);
            }
        },
        /** 规范化处理 classpath 列表, 包括将 *.jar 扩展为真实的文件列表 */
        normalizeClasspaths: function(paths, narrow){	/*narrow: 尽可能缩减 classpath 的长度, 主要用于 java -classpath 等支持 /.../* 的场合*/
			if (!paths || !paths.length){
				return [];
			}
			var c = [];
			for (var i=0; i<paths.length; i++){
				var filePath = paths[i];
				var pathList = [filePath];
				require(["std/os", "std/shell", "std/utils/misc"], function(os, shell, misc){
				    //支持以 *.jar 一次性设置多个 jar 包
					var re = new RegExp(".*[\\/\\\\].*\\*.*\\.jar$", "gi"); // - /.../XX*XX.jar
					if (re.test(filePath)){
						var lastFileSp = filePath.lastIndexOf("/");
						if (lastFileSp<0){
							lastFileSp = filePath.lastIndexOf("\\");
						}
						var wildcard = filePath.substr(lastFileSp+1);
					    if (misc.endsWith(filePath, "/"+wildcard) || misc.endsWith(filePath, "\\"+wildcard)){
					        var _path = filePath.substr(0, filePath.length-("/"+wildcard).length);
					        _path = os.normalizePath(_path);
					        if (wildcard=="*.jar" && narrow){
					        	//如果 classpath 是 .../*.jar, 那么在 java -classpath 中可以使用 .../* 代替而不用扩展为具体的 jar 包
					        	if (os.isWindows){
					        		pathList = [_path+"\\*"];
					        	}else{
					        		pathList = [_path+"/*"];
					        	}
					        }else{
						        pathList = [];
						        shell.listFiles(_path, wildcard, function(file){
						            pathList[pathList.length] = file;
						        });
					        }
					    }
					}
				});
				for (var j=0; j<pathList.length; j++){
				    var p = pathList[j];
				    if (c.indexOf(p) < 0){
				        c[c.length] = p;
				    }
				}
			}
			return c;
		}
    };
});