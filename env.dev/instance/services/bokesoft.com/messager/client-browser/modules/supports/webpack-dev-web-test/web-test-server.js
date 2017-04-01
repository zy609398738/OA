/**
 * REF: http://www.boiajs.com/2015/08/25/webpack-dev-server-and-express-server/
 */
 //The dir of main js file
var MAIN_DIR = require('path').dirname(require.main.filename);

/* NOTE: Because the webpack config file (webpack.web-test-config.js) was not loaded at this
         point, so we must require mudules with absolute path.
 */
var webpack = require(MAIN_DIR+'/node_modules/webpack');
var WebpackDevServer = require(MAIN_DIR+'/node_modules/webpack-dev-server');
var proxy = require(MAIN_DIR+'/node_modules/proxy-middleware');
var url = require(MAIN_DIR+'/node_modules/url');
var express = require(MAIN_DIR+'/node_modules/express');
var bodyParser = require(MAIN_DIR+'/node_modules/body-parser');

var colors = require(MAIN_DIR+'/node_modules/colors');

module.exports = {
    /** Start test web server with webpack-dev-server "auto-refresh" support.
     * The configuration parameters and their default value:
     *     httpPort: HTTP Port, default: environment variable "WEB_TEST_SERVER_PORT",
     *               or else auto detect available port from 8080
     *     wdsPort: webpack-dev-server HTTP Port, default: auto detect available port from httpPort+1,
     *     wdsPubPath: The publish path for test code, default = "web-test",
     *     webpackCfg: The webpack configurations, default = require("./webpack.web-test-config.js")
	 *     terget : The test target(for example 'vue', 'react', 'bootstrap' ...), optional
    */
    start: function(cfg, appCallback) {

        if (! cfg){
            cfg = {};
        }
		var net = require('net');
		/** Start the http and webpack server*/
		var startServer = function (httpPort, wdsPort) {
			var wdsPubPath = cfg.wdsPubPath || "web-test";
			var target = cfg.target;
			
			var app = express();
			
			app.use(bodyParser.urlencoded({ extended: true }));
            
			app.get('/', function (req, resp) {
                resp.send('[webpack-dev-support] It works!')
            });
			app.use('/'+wdsPubPath, proxy(url.parse('http://localhost:'+wdsPort+'/'+wdsPubPath)));
			if (appCallback) {
                appCallback(app);
            }
            app.listen(httpPort);
            console.log('>>> Http WebServer listen: ' + httpPort);
			
            if (wdsPubPath.startsWith("/")){
                wdsPubPath = wdsPubPath.substring(1);
            }
            if (wdsPubPath.endsWith("/")){
                wdsPubPath = wdsPubPath.substring(0, wdsPubPath.length-1);
            }

            var defWebpackCfg;
            var webpackCfg = cfg.webpackCfg;
            if (! webpackCfg){
                try{
					defWebpackCfg = MAIN_DIR+"/webpack.web-test-config."+target+".js";
                    webpackCfg = require(defWebpackCfg);
                    console.log(">>> Webpack config(For testing only): "+defWebpackCfg);
                }catch(e){
					try{
						defWebpackCfg = MAIN_DIR+"/webpack.web-test-config.js";
						webpackCfg = require(defWebpackCfg);
						console.log(">>> Webpack config(For testing only): "+defWebpackCfg);
					}catch(ex){
						defWebpackCfg = target?__dirname+"/webpack.web-test-config."+target+".js":__dirname+"/webpack.web-test-config.js";
						webpackCfg = require(defWebpackCfg);
						console.log(">>> Webpack config(For testing only): "+defWebpackCfg);
					} 
                }
            }

            var wdsCfg = cfg.wdsCfg || {
                    contentBase: MAIN_DIR,
                    hot: true,
                    quiet: false,
                    noInfo: false,
                    publicPath: '/'+wdsPubPath+'/',
                    stats: { colors: true }
                };
            console.log(">>> ContentBase: "+wdsCfg.contentBase);
            var server = new WebpackDevServer(webpack(webpackCfg), wdsCfg)
                .listen(wdsPort, 'localhost', function() {
                    console.log('>>> WebpackDevServer socketio listen: ' + wdsPort)

                    var httpPortStr = (""+httpPort);
                    var spaceCount = 12-httpPortStr.length;
                    var space = "";
                    for (var i=0; i<spaceCount; i++){
                    	space += " ";
                    }
                    console.log("\n  ################################################################".green.bold);
                    console.log("  ###                                                          ###".green.bold);
                    console.log("  ###     ".green.bold,
                    		    "Access test html page from ",
                    		    "HTTP Port ".bold.green + httpPortStr.bold.underline.yellow,
                    		    space, "###".green.bold);
                    console.log("  ###                                                          ###".green.bold);
                    console.log("  ################################################################\n".green.bold);
                });
            
        };

		var allocPort = function(from, to, callback){
			var port = from;
			if(port <= to){
				var server = net.createServer().listen(from);
				server.on('listening', function(){
					server.close();
					console.log(">>> Available port '"+port+"' found.");
					callback(port);
				});
				server.on('error', function(err){
					if(err.code === 'EADDRINUSE'){
						allocPort(port+1, to, callback);
					}
				});
			}else{
				//Max port number reached, can't allocate port ...
				throw new Error("No available port .");
			}
		};
		
		if (!cfg.httpPort){
			//Detect port number from environment variable "WEB_TEST_SERVER_PORT"
			if(process.env.WEB_TEST_SERVER_PORT && Number(process.env.WEB_TEST_SERVER_PORT) <= 65535){
				cfg.httpPort = Number(process.env.WEB_TEST_SERVER_PORT);
			}
		}
		
        if(cfg.httpPort){
        	allocPort(cfg.httpPort+1, 65535, function(wdsPort){
        		startServer(cfg.httpPort, wdsPort);
        	});
        }else {
        	allocPort(8080, 65535, function(httpPort){	/*find available HTTP port from 8080*/
        		allocPort(httpPort+1, 65535, function(wdsPort){
        			startServer(httpPort, wdsPort);
            	});
        	});
        }
    }
};
