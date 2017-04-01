/** 检测和准备运行环境, 返回 env 对象, 包括各个环境参数 */
define(function () {
    var log = getLogger("env.js");
    /** 返回一个目录以及其父目录, 直到停止在某个层次的父目录
     * start - 开始的目录
     * stop - 停止的上层父目录
     * relatedDirs - 数组, 用于在找到每一层的目录后, 产生与之相对的几个目录
     */
    var findAllParents = function(start, stop, relatedDirs){
        if (!relatedDirs){
            relatedDirs = ["."];
        }
        if (! Array.isArray(relatedDirs)){   //如果不是数组 ...
            relatedDirs = [relatedDirs+""];
        }
    
        var File = Packages.java.io.File;
        var result = [];
        var dealOneFile = function(f){
            var path = f.getCanonicalPath()+"";
            for(var i=0; i<relatedDirs.length; i++){
                var tmp = path + "/" + relatedDirs[i];
                tmp = new File(tmp);
                if (tmp.exists()){
                    result[result.length]=tmp.getCanonicalPath()+"";
                }
            }
        }
        
        var f = new File(start+"");
        var sf = (null==stop)?f:new File(stop+"");
        while(null!=f && !f.equals(sf)){
            dealOneFile(f);
            f = f.getParentFile();
        }
        //最后加上 stop, 因为 stop 也会包含在结果中
        dealOneFile(sf);

        return result;
    }

    /** env - 包含全部的环境信息的对象 */
    var env;
    require (["std/sys", "std/os", "app/_tools"], function(sys, os, _tools) {
        env = sys.appProperties;
        
        // 注册 os 运行库的外部属性对象, 以便 os.normalizePath() 这样的方法能够使用
        os.regExtAttrs(env);
        
        /** env 除了包含各类环境变量之外, 还包含多种选项, 比如部署时虚拟化的资源目录和ClassLoader支持、插件支持等 */
        env.options = {
            deployment: {
                javaopts: [ /* JAVA_OPT1, JAVA_OPT2, ... */ ]
            },
            webapps: {},
            plugins: []
        };
        /** 注册一个 Java option
         */
        var env$registerJavaOpts = function(opt){
            var o = env.options.deployment.javaopts;
            if (o.indexOf(opt) < 0){
                o[o.length] = opt;
            }
        }
        /** 注册一个 Java WebApp
         * appName:    WebApp 的名称，也是访问时的 context path
         * docBase:    WebApp 的 doc base
         * aliases:    目录别名(可选)，Key-value 对象;
         *             (参考 http://tomcat.apache.org/tomcat-7.0-doc/config/context.html#Virtual_webapp 之 VirtualDirContext)
         * classpaths: 额外加载的 CLASSPATH 数组(可选);
         *             (参考 http://tomcat.apache.org/tomcat-7.0-doc/config/context.html#Virtual_webapp 之 VirtualWebappLoader)
         * plugin:     注册此 WebApp 的 plugin 对象(可选)
         */
        var env$registerWebApp = function(appName, docBase, aliases, classpaths, plugin){
            if (! aliases){
                aliases = {};
            }
            if (! classpaths){
                classpaths = [];
            }
            if (plugin && plugin.path){
                //如果传入 plugin 参数, docBase 默认可以基于 plugin 的所在目录
                docBase = os.normalizePath(docBase, plugin.path);
            }
            if (plugin && plugin.attachments && plugin.attachments._javaWebAppAliasList){
                //如果传入 plugin 参数, 系统可以自动向 aliases 加入额外注册的内容
                var as = plugin.attachments._javaWebAppAliasList;
                for (var i=0; i<as.length; i++){
                    var key = as[i].aliasPath;
                    var val = as[i].filePath;
                    if (aliases[key] && aliases[key]!=val){
                        throw "Java WebApp '"+appName+"' alias '"+key+"' 定义存在重复: '"+aliases[key]+"' - '"+val+"'";
                    }else{
                        aliases[key] = val;
                    }
                }
            }
            if (plugin && plugin.attachments && plugin.attachments._javaWebAppClasspathList){
                //如果传入 plugin 参数, 系统可以自动向 classpaths 加入额外注册的内容
                var cps = plugin.attachments._javaWebAppClasspathList;
                for (var i=0; i<cps.length; i++){
                    classpaths[classpaths.length] = cps[i];
                }
            }
            var w = env.options.webapps;
            w[appName] = {
                    appName: appName,
                    docBase: docBase,
                    aliases: aliases,
                    classpaths: classpaths
            };
        }
        /** 注册(引用)一个 plugin (注意: 同一个 plugin 可以多次注册, 系统将按照先后顺序执行)
         * pluginPath: plugin 的目录路径, 其中一定要包含一个文件 "plugin.js"
         * options: 插件选项
         */
        var env$registerPlugin = function(pluginPath, options){
            if (null==options) options = {};
            var $plugin = {
                /** 插件的来源路径 */
                path: pluginPath,
                /** 插件引用时设置的选项值 */
                options: options,
                /** 默认插件的部署方法, 用于在部署时执行插件需要的操作 */
                onDeploy: function(env){
                    sys.raiseErr("插件 ["+pluginPath+"] 中未定义 [onDeploy]", -9)
                }
            };
            
            //定义 prepareCallback 集合，以保证有些方法可以延迟到 prepare 之后才调用
            $plugin.prepareCallbacks = [];
            var _addPrepareCallback = function(callback){
                $plugin.prepareCallbacks[$plugin.prepareCallbacks.length] = callback;
            }

            /**
             * 注册一个文件系统路径到 CLASSPATH
             *  - path: 文件系统路径, 格式例如 C:/libs/mylib.jar, 文件系统路径可以是 jar 文件的路径, 也可以是目录; 支持基于 MODULES_REPO 的相对路径
             */
            $plugin.registerWebAppClasspath = function(path) {
                var _doIt = function(path){
                    if (! $plugin.attributes.javaWebApp){
                        sys.raiseErr("插件 ["+pluginPath+"] 未定义 [javaWebApp] 属性, 不能调用 registerWebAppClasspath 方法", -9)
                    }
                    
                    path = os.normalizePath(path, env.MODULES_REPO);
                    
                    if (!$plugin.attachments._javaWebAppClasspathList){
                        $plugin.attachments._javaWebAppClasspathList = [];
                    }
                    var p = $plugin.attachments._javaWebAppClasspathList;
                    p[p.length] = path;
                }
                if (this.attributes && this.attachments){
                    _doIt(path);
                }else{
                    _addPrepareCallback(function(){ _doIt(path); });
                }
            }

            /**
             * 注册一个 alias
             *  - aliasPath: Web 访问时的上下文路径, 格式例如 /oa-ext;
             *  - filePath: 对应的文件或目录的路径; 支持基于 MODULES_REPO 的相对路径
             */
            $plugin.registerWebAppAlias = function(aliasPath, path){
                var _doIt = function(aliasPath, path){
                    if (! $plugin.attributes.javaWebApp){
                        sys.raiseErr("插件 ["+pluginPath+"] 未定义 [javaWebApp] 属性, 不能调用 registerWebAppAlias 方法", -9)
                    }
                    path = os.normalizePath(path, env.MODULES_REPO);
                    if (!$plugin.attachments._javaWebAppAliasList){
                        $plugin.attachments._javaWebAppAliasList = [];
                    }
                    var a = $plugin.attachments._javaWebAppAliasList;
                    a[a.length] = {
                        aliasPath: aliasPath,
                        filePath: path
                    };
                }
                if (this.attributes && this.attachments){
                    _doIt(aliasPath, path);
                }else{
                    _addPrepareCallback(function(){ _doIt(aliasPath, path); });
                }
            }

            //加入 plugins 集合
            var p = env.options.plugins;
            p[p.length] = $plugin;

            //返回当前这个 plugin
            return $plugin;
        }
        
        //根据 app.js 的位置重新确认 REDIST_ROOT
        env.REDIST_ROOT = os.normalizePath("../../../..");
        os.chroot(env.REDIST_ROOT);     //系统 root 切换为 REDIST_ROOT, 这样后面很多目录都可以以此目录为基础
        log.info("系统 root 切换为 REDIST_ROOT="+env.REDIST_ROOT);
        
        //PROFILE_REPO, 存放多个 profile 的目录, 默认为 profiles
        env.PROFILE_REPO = os.normalizePath(os.getProp("PROFILE_REPO", "profiles"));
        
        //处理 profile, 主要逻辑: 确定使用哪些 profile.js 来设置 profile 环境
        //按照如下规则确定 PROFILE 位置: 1. PROFILE 环境变量指定, 2. 默认为当前目录(user.dir)
        env.PROFILE = os.normalizePath(os.getProp("PROFILE", os.getProp("user.dir")), env.PROFILE_REPO);
        //创建 PROFILE_RUNTIME 目录: 用于存放运行时临时产生的文件
        env.PROFILE_RUNTIME = os.normalizePath(".runtime", env.PROFILE);
        require(["std/shell"], function( shell ){
            shell.mkdir(env.PROFILE_RUNTIME);
        });
        //当前 PROFILE_NAME 的默认值 - profile 目录名称
        env.PROFILE_NAME = (new Packages.java.io.File(env.PROFILE)).getName();
        //Profile 中设置可以按照优先顺序: PROFILE目录/.conf, PROFILE目录, PROFILE父目录/.conf ,PROFILE父目录 依次产生作用:
        //  - profile.js - 用于设置除了 PROFILE_REPO/PROFILE 之外的其他项目参数
        var profileSearchDirs = findAllParents(env.PROFILE, env.PROFILE_REPO, [".conf", "."]);
        log.info("配置文件搜索路径: "+profileSearchDirs.join("; "));
        // - 查找配置文件 profile.js
        var profileJsPath = null;
        require(["std/utils/misc"], function( misc){
            misc.arrayForEach(profileSearchDirs, function(path){
                if (null==profileJsPath){
                    var pf = new Packages.java.io.File(os.normalizePath([path, "profile.js"]));
                    if (pf.exists()){
                        profileJsPath = pf.getCanonicalPath()+"";
                    }
                }
            });
        });
        env.PROFILE_JS = profileJsPath;
        log.info("使用配置文件 profile.js="+env.PROFILE_JS);
        // - 执行 profile.js, 完善项目配置, 这些定义会放在变量 "profile" 上
        var profile = {
            registerJavaOpts: env$registerJavaOpts,
            registerWebApp: env$registerWebApp,
            registerPlugin: env$registerPlugin
        };
        if (env.PROFILE_JS){
            eval(os.readTextFile(env.PROFILE_JS));
        }else{
            log.warn("找不到 profile.js, 相关变量定制过程被忽略. 搜索目录包括: " + profileSearchDirs.join("; ") + " .");
        }
        if (!profile) profile = {}; //防御代码, 避免 profile.js 中清除此变量
        
        //在处理完 profile 之后, 查找运行需要的各项参数, 注意优先级最高的是环境变量
        //TOMCAT_HOME, 默认使用 instance/infrastructure/tomcat
        env.TOMCAT_HOME = os.normalizePath(os.getProp("TOMCAT_HOME", profile.TOMCAT_HOME||"instance/infrastructure/tomcat"));
        //PLUGINS_REPO, 存放多个 plugin 的目录, 默认为 instance/plugins
        env.PLUGINS_REPO = os.normalizePath(os.getProp("PLUGINS_REPO", profile.PLUGINS_REPO||"instance/plugins"));
        //MODULES_REPO, 存放多个 module 的目录, 默认为 modules
        env.MODULES_REPO = os.normalizePath(os.getProp("MODULES_REPO", profile.MODULES_REPO||"modules"));
        
        //引入 profile 中修改的 PROFILE_NAME
        env.PROFILE_NAME = profile.PROFILE_NAME || env.PROFILE_NAME ;

        //获取和检查指定的参数 - 优先系统环境变量, 如果未在环境变量中找到, 则尝试在 profile 变量中找
        var getRequireVar = function(varName, descr, blankAble){
            var v = os.getProp(varName);
            if (!v){
                v = profile[varName];
            }
            if (!v){
                if (blankAble){
                    v = "";
                }else{
                    _tools.pause("未找到环境变量 ["+varName+"]("+descr+"), 请检查系统配置.", -10);
                }
            }
            return v;
        }
        
        //TOMCAT_PORT_HTTP, Tomcat http 端口, 默认 8080
        env.TOMCAT_PORT_HTTP = os.getProp("TOMCAT_PORT_HTTP", profile.TOMCAT_PORT_HTTP||"8080");
        //TOMCAT_PORT_HTTPS, Tomcat https 端口, 默认 8443
        env.TOMCAT_PORT_HTTPS = os.getProp("TOMCAT_PORT_HTTPS", profile.TOMCAT_PORT_HTTPS||"8443");
        
        //JAVA_OPTS, Java 命令行的附加选项
        env.JAVA_OPTS = os.getProp("JAVA_OPTS", profile.JAVA_OPTS||"-server -Xmx1024m -XX:MaxNewSize=256m -XX:MaxPermSize=256m -Djava.awt.headless=true");
        
        //plugins 处理, 保证 plugins 在定义时可以使用前面定义的 env 属性(例如 ${PROFILE})
        //plugins 优先于 aliases 和 classpath 处理，保证可以在 plugin 中调整 alias 和 classpath
        var env$preparePlugin = function(p){
            p.path = os.normalizePath(p.path, env.PLUGINS_REPO);
            p.name = (new java.io.File(p.path)).getName();
            /** 为每个 plugin 创建自己的 runtime 目录 */
            p.runtime = os.normalizePath(p.name, env.PROFILE_RUNTIME);
            require(["std/shell"], function( shell ){
                shell.mkdir(p.runtime);
            });
            /** 执行 plugin 初始化 */
            var js = os.readTextFile(os.normalizePath("plugin.js", p.path));
            if (!js){
                sys.raiseErr("插件 ["+p.path+"] 未找到", -9)
            }
            var f = function(pluginCtx){
                var log = getLogger("plugin:"+p.name);
                eval(js);
            }
            //在调用 plugin javascript 时, this 就是 plugin 对象, 参数 pluginCtx
            f.apply(p, [{
                profile: profile,
                env: env,
                options: p.options,
                plugin: p
            }]);
            /** 初始化完毕后, 处理插件的 configFiles, 规则与 profile.js 的查找类似 */
            var pluginCfgSearchDirs = findAllParents(env.PROFILE, env.PROFILE_REPO, [".conf/plugins/" + p.name]);
            //最后增加默认的 plugins 插件 config files 目录: 插件目录下的 .plugin 目录
            pluginCfgSearchDirs[pluginCfgSearchDirs.length] = os.normalizePath(".plugin", p.path);
            var tmpCfgFiles = [];
            if (p.configFiles){
                require(["std/utils/misc"], function( misc ){
                    for(var k=0; k<p.configFiles.length; k++){
                        var cfgFile = p.configFiles[k];
                        
                        tmpCfgFiles[k] = null;    //如果找不到, 则对应的 config file 项置为 null
                        misc.arrayForEach(pluginCfgSearchDirs, function(path){
                            if (null==tmpCfgFiles[k]){
                                var pf = new Packages.java.io.File(os.normalizePath([path, cfgFile]));
                                if (pf.exists()){
                                    tmpCfgFiles[k] = pf.getCanonicalPath()+"";
                                    tmpCfgFiles[cfgFile] = tmpCfgFiles[k];
                                }
                            }
                        });
                    }
                });
            }
            p.configFiles = tmpCfgFiles;    //替换为处理后的具体配置文件
            /** 接着处理 plugin 的各个属性(attributes) */
            var attrs = p.attributes;
            if (!attrs){
                attrs = {};
            }
            /** 所有由 attributes 产生的附加信息, 统一放到 "attachments" 对象下 */
            p.attachments = {};
            /** 调用内部组织的 prepareCallback */
            var pcs = p.prepareCallbacks;
            for (var i=0; i<pcs.length; i++){
                var callback = pcs[i];
                callback.call(p);
            }
        };
        (function(){
            var ps = env.options.plugins;
            for (var i=0; i<ps.length; i++){
                var p = ps[i];
                env$preparePlugin(p);
            }
        })();

        //显示运行环境信息
        require(["std/utils/json2-util"], function(util){
            var plugins = env.options.plugins;
            var tmp = [];
            for (var i=0; i<plugins.length; i++){
                var pi = {
                    name: plugins[i].name,
                    path: plugins[i].path
                };
                if (plugins[i].options){pi.options = plugins[i].options;}
                if (plugins[i].configFiles){pi.configFiles = plugins[i].configFiles;}
                if (plugins[i].dependencies){pi.dependencies = plugins[i].dependencies;}
                tmp[tmp.length] = pi;
            }
            env.options.plugins = tmp;
            
            //输出配置信息
            var str = util.format(env);
            
            //还原隐藏的配置信息
            env.options.plugins = plugins;
            
            log.info("运行环境信息: " + str);
        });

    });
    return env;
});