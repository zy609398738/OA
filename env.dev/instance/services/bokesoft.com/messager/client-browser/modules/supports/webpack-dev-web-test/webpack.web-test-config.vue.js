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
        extensions: ['.js', '.css', '.html', '.png', '.jpg','.vue']
    },
    module: {
    	rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
						sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
					}
				}
			},
			{test: /\.js$/,loader: 'babel-loader',query: {presets: ['es2015']}},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // inline base64 URLs for <=256bytes images, direct URLs for the rest
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=256' },
            // loader for html templates
            { test: /\.html$/, loader: 'html-loader' },
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader'
			}
        ]
    }
}
