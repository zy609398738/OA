/**
 * IE8 support;
 * see also:
 *     - https://github.com/webpack/style-loader/issues/42
 *     - https://github.com/coderwin/ES5Shim4Webpack
 *     - https://github.com/es-shims/es5-shim
 */
require('es5-shim');

var leditor = require("..");

var $ = require("jquery");

window.setUpWithQQ = function(){
	leditor.build({
		editor: ".editorQQ",
		triggerEmoji: ".btnInsertQQ",
		triggerUpload: ".btnUploadQQ",
		uploadUrl: "/upload",
		uploadCaller: {
			progress: function(event, position, total, percent, files) {
				console.log(percent, files);
			}
		}
	});
}

window.setupWithTieba = function(){
	leditor.build({
		editor: ".editorTieba",
		triggerEmoji: ".btnInsertTieba",
		emojiType: "tieba",
		triggerUpload: ".btnUploadTieba",
		uploadUrl: "/upload",
		uploadCaller: {
			progress: function(event, position, total, percent, files) {
				console.log(percent, files);
			}
		}
	});
}
