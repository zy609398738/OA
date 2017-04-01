/** 实际上, 这个 js 文件是执行过程的一部分, 所以可以做很多事情 */
require (["app/_tools"], function(_tools) {
    var javaVer = java.lang.System.getProperty("java.version")+"";
    if (javaVer < "1.8"){
        _tools.pause("当前 Java 版本 ("+javaVer+") 小于 1.8, 无法启动系统.", -80);
    }
});

/** 在实际使用中按照系统部署要求修改 */
// profile.JAVA_OPTS        = ...;      //Java运行参数选项, 默认值 -server -Xmx1024m -XX:MaxNewSize=256m -XX:MaxPermSize=256m -Djava.awt.headless=true
// profile.TOMCAT_PORT_HTTP = 8080;     //Tomcat http 端口, 默认 8080
profile.TOMCAT_PORT_HTTPS= 8445;     //Tomcat https 端口, 默认 8443

/** 目前的 license 只支持 8089 端口 */
profile.TOMCAT_PORT_HTTP = 8089;
//profile.registerPlugin("bokesoft.com/dee", {configDir: "dee"});
profile.registerPlugin("zhuozhengsoft.com/pageoffice", {configDir: "pageoffice"});

//使用 Yigo2.0
var yigoWebApp = profile.registerPlugin("bokesoft.com/yigo2", {
	jdbcUrl: os.getProp("JDBC_URL", "jdbc:mysql://localhost:3306/oa?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull"),
	dbUser:  os.getProp("DB_USERNAME", "root"),
	dbPass:  os.getProp("DB_PASSWORD", "******"),
	solutionPath: "yigo2",
	debug:	"true"
});

//使用 CMS 2.0
var cms2Webapp = profile.registerPlugin("bokesoft.com/cms2", {
	webApp: yigoWebApp,
	DefaultCmsBootConfigurer: {siteFolders: ["cms/site","cms/site-fallback"],developMode:true}
});

yigoWebApp.registerWebAppAlias("/jsp", "${MODULES_REPO}/jsp");



//使用 yigo2-ecomm-ext (cms2-yigo2-adapter 依赖这个扩展)
profile.registerPlugin("bokesoft.com/yigo2-ecomm-ext", {
	webApp: yigoWebApp
});
	
//使用 cms2-yigo2-adapter
profile.registerPlugin("bokesoft.com/cms2-yigo2-adapter", {
	cms2: cms2Webapp
});

//使用 cms2-site
profile.registerPlugin("bokesoft.com/cms2-site", {
	cms2: cms2Webapp
});

//加入 OA 自定义的 jar 包
yigoWebApp.registerWebAppClasspath("${MODULES_REPO}/java-ext/dist/libs/*.jar");
yigoWebApp.registerWebAppClasspath("${MODULES_REPO}/java-ext/dist/jars/*.jar");
yigoWebApp.registerWebAppClasspath("${MODULES_REPO}/java-ext/dlls");

//cms/war/oa 目录部署在配置文件目录中
yigoWebApp.registerWebAppAlias("/oa", "${MODULES_REPO}/cms/war/oa");

require (["std/sys", "std/os"], function(sys, os) {
       var absolute = os.normalizePath("modules/java-ext/dlls");
	   //_tools.pause(absolute);
	   profile.registerJavaOpts("-Djava.library.path="+absolute);
});

/** 部署IM扩展设置 */
//使用简单的 WebApp, 默认访问在 "/"
//先注册
var webapp = profile.registerPlugin("public/java-webapp", {});
webapp.registerWebAppAlias("/bokesoft-messager", "../instance/services/bokesoft.com/messager/client-browser/project/main");

//后引入IM
profile.registerPlugin("${PRODUCT_REPO}/../../services/bokesoft.com/messager/server");
/** 环境变量-IM服务器的地址(用于服务端连接) */
env.IM_SERVER_ADDR=os.getProp("IM_SERVER_ADDR", "http://localhost:7778/boke-messager");

/** 调试设置 */
profile.JAVA_OPTS = "-server -Xmx900m -XX:MaxNewSize=128m -Djava.awt.headless=true";
profile.JAVA_OPTS += " -Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=37777,server=y,suspend=n"
