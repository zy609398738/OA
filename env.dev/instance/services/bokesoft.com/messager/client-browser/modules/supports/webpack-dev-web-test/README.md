# About

This is a wrapper for webpack-dev-server, for browser-based npm modules development and testing;

## Dependencies
```shell
# Required libraries
npm install webpack -S
npm install webpack-dev-server -S
npm install proxy-middleware -S
npm install url -S
npm install express -S

# Default loaders, see also: `webpack.web-test-config.js`
npm install style-loader -S
npm install file-loader -S
npm install url-loader -S
npm install css-loader -S
npm install html-loader -S
```

## Usage
### Reference in `package.json`
```js
{
  "name": "XXX",
  ... ...
  "dependencies": {
    ... ...
  },
  "devDependencies": {
    ... ...
    /** depend with relative path */
    "webpack-dev-web-test": "../../../supports/webpack-dev-web-test"
  }
}
```
### Create js file to start test server
(For example, run js with command: `node test-server.js`)
```js
/** require webpack-dev-web-test support */
var app = require("webpack-dev-web-test");

app.start({
    /** Start test web server with webpack-dev-server "auto-refresh" support.
     * The configuration parameters and their default value:
     *     httpPort: HTTP Port, default: environment variable "WEB_TEST_SERVER_PORT",
     *               or else auto detect available port from 8080
     *     wdsPort: webpack-dev-server HTTP Port, default: auto detect available port from httpPort+1,
     *     wdsPubPath: The publish path for test code, default = "web-test",
     *     webpackCfg: The webpack configurations, default = require("./webpack.web-test-config.js")
    */
}, function(app){
    /** The response for ajax post testing */
    app.post('/test-data.json', function(req, resp) {
        resp.send('Hello, World!');
    });
});
```

## NOTE
 1. The testing source(`js` and `html` and so on) will default be placed at `web-test` folder;

## END
