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

var editorDefault, editorAndroid;

window.setUpEmojiDefault = function(){
	editorDefault = leditor.build({
		editor: ".editorDefault",
		triggerEmoji: ".btnInsertDefault",
		triggerUpload: ".btnUploadDefault",
		uploadUrl: "/upload",
		uploadCaller: {
			progress: function(event, position, total, percent, files) {
				console.log(percent, files);
			}
		}
	});
}

window.setUpEmojiAndroid = function(){
	editorAndroid = leditor.build({
		emojiType: "android",
		editor: ".editorAndroid",
		triggerEmoji: ".btnInsertAndroid",
		triggerUpload: ".btnUploadAndroid",
		uploadUrl: "/upload",
		uploadCaller: {
			progress: function(event, position, total, percent, files) {
				console.log(percent, files);
			}
		}
	});
}

$(".btnDefaultTestGetText").click(function(){
	var html = $(".editorDefault").html();
	var text = editorDefault.getText();
	alert(html + "\n--------------------------------\n" + text);
});
$(".btnDefaultTestRenderHtml").click(function(){
	var text = editorDefault.getText();
	var html = "<h4>当前表情类型：</h4><hr>" + editorDefault.renderHtml(text);
	html += "<hr/>";
	html += "<h4>目标表情类型：</h4><hr>" + editorDefault.renderHtml(text, editorAndroid.emojiInfo.emoji_realtype);
	html += "<hr/>";
	alert(html);
	$(".editorAndroid").html(html);
});
