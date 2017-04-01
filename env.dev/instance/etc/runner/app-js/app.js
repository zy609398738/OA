require.config({
    baseUrl: "/"
});
var log = getLogger("app.js");
log.info("开始启动 Yigo App ...");
require (["app/start"], function(yigo) {
    //都在 app/start 中做了
});
log.info("Yigo App 运行结束.");