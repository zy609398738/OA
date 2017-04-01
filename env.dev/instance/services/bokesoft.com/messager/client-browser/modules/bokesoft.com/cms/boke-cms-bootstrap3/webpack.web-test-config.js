//Webpack configuration JUST FOR TEST
var Path=require('path');
/** The resolve path list to find modules and loaders */
var MODULE_DIRS=[process.cwd(), Path.join(process.cwd(),'src'), Path.join(process.cwd(),'node_modules')];

module.exports = {
    devtool: "source-map",  //Force create source map file
    entry: './web-test/test.js',
    output: {
        path: __dirname,
        filename: 'test-bundle.js'
    },
    resolve: {
    	modules: MODULE_DIRS,
        alias: {},
        extensions: ['.js', '.css', '.html', '.png', '.jpg']
    },
    module: {
        rules: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // inline base64 URLs for <=256bytes images, direct URLs for the rest
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=256' },
            // loader for html templates
            { test: /\.html$/, loader: 'html-loader' },

            // **IMPORTANT** This is needed so that each bootstrap js file has access to the jQuery object
            //               "/bootstrap(\/|\\)js(\/|\\)/" -- "bootstrap/js/" on linux or "bootstrap\js\" in windows
            { test: /bootstrap(\/|\\)js(\/|\\)/, loader: 'imports-loader?jQuery=jquery' },
            // **IMPORTANT** The loaders for bootstrap css and fonts
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'}
        ]
    }
}
