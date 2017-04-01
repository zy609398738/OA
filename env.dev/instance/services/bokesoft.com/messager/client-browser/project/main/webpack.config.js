/** Webpack configuration for distribution */

var Path=require('path');
/** The resolve path list to find modules and loaders */
var MODULE_DIRS=[process.cwd(), Path.join(process.cwd(),'src'), Path.join(process.cwd(),'node_modules')];

module.exports = {
    devtool: "source-map",      //Force create source map file
    entry: {
        main: './src/index.js'
    },
    output: {
        path: __dirname + "/dist",
        publicPath: "/bokesoft-messager/dist/",
        filename: 'bundle.bokesoft-messager.js'
    },
    resolve: {
        root: MODULE_DIRS,
        alias: {},
        extensions: ['', '.js', '.css', '.html', '.png', '.jpg']
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // inline base64 URLs for <=256bytes images, direct URLs for the rest
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=256' },
            // loader for html templates
            { test: /\.html$/, loader: 'html-loader' },

            // **IMPORTANT** This is needed so that each bootstrap js file has access to the jQuery object
            //               "/bootstrap(\/|\\)js(\/|\\)/" -- "bootstrap/js/" on linux or "bootstrap\js\" in windows
            { test: /bootstrap(\/|\\)js(\/|\\)/, loader: 'imports?jQuery=jquery' },
            // **IMPORTANT** The loaders for bootstrap css and fonts
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'}
        ]
    },
    resolveLoader: {
        modulesDirectories: MODULE_DIRS
    }
}
