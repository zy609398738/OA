"use strict";

/* The implementations */

require('jquery-mousewheel');  //malihu-custom-scrollbar-plugin 需要使用 jquery-mousewheel 来支持鼠标滚轮

require('malihu-custom-scrollbar-plugin');
require('malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css');

//FIXME: jQuery-emoji 直接使用了 jQuery 对象
//如下代码确保使用的是 require('jquery') 得到的 jquery 对象, 同时不影响可能的已经存在于上下文的 jQuery 对象
(function(){
	var old$ = window.jQuery;
	window.jQuery = require("jquery");
	require('./jQuery-emoji-1.2/src/js/jquery.emoji.js');
	window.jQuery = old$;
})();
require('./jQuery-emoji-1.2/dist/css/jquery.emoji.css');

var spacerGif = require("./jQuery-emoji-1.2/dist/img/spacer.gif");

var $ = require("jquery");
var json = require("JSON2");
var FastUpload = require('fast-upload');

var emojiData = require('./unicode-emoji-data/data.js');

/**
 * 初始化 light-editor.
 * @param options: 可使用的选项, 参考 setup 方法中的 settings 变量
 */
var build = function(options){
    var settings = {
    	/** 用于进行编辑的 DOM 元素, 必填(支持 DOM 对象、jQuery 对象、以及 jQuery selector) */
	    editor: null,
	    /** 用于触发插入表情的界面元素, 必填(支持 DOM 对象、jQuery 对象、以及 jQuery selector) */
    	triggerEmoji: null,
	    /** 用于触发上传文件/图片的界面元素, 必填(支持 DOM 对象、jQuery 对象、以及 jQuery selector) */
    	triggerUpload: null,
	    /** 上传文件的提交地址, 必填, 要求返回的数据是 json 字符串, 其中应该包含 url 和 fileName 两个属性 */
	    uploadUrl: null,
	    /** 上传文件的事件响应对象, 必填 */
	    uploadCaller: null,
    	/** 表情的类型(apple=ipone表情, android=android表情, samsung=三星表情), 默认为 ipone表情 */
    	emojiType: "apple",
    	/** 上传文件/图片时对应的 file input 的 name, 默认 "light-editor" */
	    inputName: "light-editor"
    };

    //应用 options
    if (options) {
        $.extend(settings, options);
    }
    //返回的对象
    var editorObject = {
    	settings: settings
    };
    
    //初始化表情
    if (settings.editor && settings.triggerEmoji){
    	var emojiInfo = _initEmoji(settings.editor, settings.triggerEmoji, settings.emojiType);
    	editorObject.emojiInfo = emojiInfo;
    }
    //初始化上传
    if (settings.editor && settings.triggerUpload){
    	_initUpload(
    			settings.editor, settings.triggerUpload,
    			settings.inputName, settings.uploadUrl, settings.uploadCaller);
    }
    //控制 editor 只能复制普通文本
    _forcePasteTextOnly($(settings.editor));
    
    //为返回的对象增加读取和显示文本内容的方法
    /**
     * 获取编辑区域的内容文本：1.HTML换行(br、p等)需要变为"\n"; 2.表情符号需要变为 unicode 字符串
     */
    editorObject.getText = function(){
    	var html = $(this.settings.editor).html();
    	
		var text = html.replace(/^\s+|\s+$/g, '');	//Trim

		//Chrome - 段落使用 <div>...</div>, 空行是 <div><br></div>
		text = text.replace(/(<div><br><\/div>)/g, "<br>");
		text = text.replace(/(<div>)/g, "");
		text = text.replace(/(<\/div>)/g, "\n");

		//IE 11 - 段落使用 <p>...</p>, 空行是 <p><br></p>
		text = text.replace(/(<p><br><\/p>)/g, "<br>");
		text = text.replace(/(<p>)/g, "");
		text = text.replace(/(<\/p>)/g, "\n");

		//IE8 - 段落使用 <P>...</P> 并且行后面有回车, 换行使用 <BR>
		text = text.replace(/(<P>)/g, "");
		text = text.replace(/(<\/P>)/g, "");
		text = text.replace(/(<BR>)/g, "<br>");

		//IE11/Chrome - 换行使用 <br>, Firefox 段落换行也使用 <br>
		text = text.replace(/(<br>)/g, "\n");

        text = text.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
            var entities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        	return entities[t];
        });
    	text = text.replace(/<img [^>]*data-emoji_code=['"]([^'"]+)[^>]*>/gi,function(match,capture){
			return capture;
		});
    	
    	//Trim again
    	text = text.replace(/^\s+|\s+$/g, '');
    	
		return text;
    }
    /**
     * 将文本内容以 HTML 方式显示
     * @参数 text 文本内容
     * @参数 emojiType 表情符号的类型(apple、android、...), 可选, 默认为当前 editor 的表情符号类型
     */
    editorObject.renderHtml = function(text, emojiType){
    	if (! text) text ="";
    	if (! emojiType) emojiType = this.emojiInfo.emoji_realtype;

		text = text.replace(/[<>&"]/g,function(c){
        	return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
        });

		for(var i=0; i < emojiData.length; i++){
			var char = emojiData[i].char;
			var classes = emojiData[i].className+"-"+emojiType;
			var img = "<img data-emoji_code='"+char+"' class='"+classes+"' src='"+spacerGif+"'>";
			text = text.replace(new RegExp(char,"g"),img);
		}
		
		var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/gi;
		text = text.replace(urlRegex, function(url,b,c) {
			var url2 = (c == 'www.') ?  'http://' +url : url;
			return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
		});		

		//FIXME: 不能简单的替换空格, 否则会影响自动查找 url
		//text = text.replace(/[ ]/g, '&nbsp;');
		
		text = text.replace(/\n\r/g, '<br/>');
		text = text.replace(/\r\n/g, '<br/>');
		text = text.replace(/[\n\r]/g, '<br/>');

		return text;
    }
    
    return editorObject;
}
var _forcePasteTextOnly = function($div){
    $($div).on('paste', function(e) {
        e.preventDefault();
        var text = null;
    
        if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain');
        }
        
        if (! text) text="";
        text = text.replace(/^\s+|\s+$/g, "");	//Trim
        if (text){
            text = text.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
			text = text.replace(/\r\n|\r|\n/g, "<br/>");
            _insertHTML($div, text);
        }
    });
}
var _initUpload = function($editor, $button, inputName, uploadUrl, uploadCaller){
	var uploader = new FastUpload({
	    trigger: $button,
	    name: inputName,
	    action: uploadUrl,
	    //accept: 'image/*',
	    //data: {'xsrf': 'hash'},
	    multiple: false,
	    error: function(errData) {
	    	if (uploadCaller && uploadCaller.error){
	    		uploadCaller.error(errData);
	    	}else{
	    		alert("上传错误: \n" + json.stringify(errData));
	    	}
	    },
	    success: function(response) {
	    	if (typeof(response)=="string"){
	    		//在 IE8 下返回的字符串类似 "<PRE>{"fileName":"XXX.png","url":"/XXXXX-XXXX-XXXXX.XXX.png"}</PRE>"
	    		response = response.replace(/^<PRE>/i, "").replace(/<\/PRE>$/i, "");
	    	}
	    	
	        if (uploadCaller && uploadCaller.success){
	    		uploadCaller.success(response);
	    	}else{
	    		//默认行为
		    	var data = json.parse(response);
		        if (data.url && data.fileName){
		        	var reImg=new RegExp("\.jpg$|\.jpeg$|\.png$|\.gif$");
		        	if (reImg.test(data.fileName)){
		        		//如果是图片
		        		_insertHTML($editor, '<img style="max-width:100%" src="'+ data.url +'"/>');
		        	}else{
		        		//附件
		        		_insertHTML($editor, '<div><a herf="'+ data.url +'">'+ data.fileName +'</a><div>');
		        	}
		        }
	    	}
	    },
	    progress: function(event, position, total, percent, files) {
	        if (uploadCaller && uploadCaller.progress){
	    		uploadCaller.progress(event, position, total, percent, files);
	    	}
	    }
	});
}
var _insertHTML = function(div, html) {  
    var sel, range;
    var dthis=$(div)[0]; //要插入内容的某个div
    $(dthis).focus();    //在 IE8 中, 要先让你需要插入 html 的 div 获得焦点(后来发现 Chrome 也需要)
    
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            var el = document.createElement('div');
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            
            range.insertNode(frag);  
            if (lastNode) {  
                range = range.cloneRange();  
                range.setStartAfter(lastNode);  
                range.collapse(true);  
                sel.removeAllRanges();  
                sel.addRange(range);  
            }  
        }  
    }else if (document.selection && document.selection.type !='Control') {
    	$(dthis).focus();
        ierange= document.selection.createRange();//获取光标位置
        ierange.pasteHTML(html);    //在光标位置插入html
        $(dthis).focus();
    }
}

var _loadEmojiCss = function(type){
	var realType = type;
	switch (type) {
		case 'apple':
			require('./unicode-emoji-data/emoji-apple.css');
			break;
		case 'android':
			require('./unicode-emoji-data/emoji-android.css');
			break;
		case 'samsung':
			require('./unicode-emoji-data/emoji-samsung.css');
			break;
		default:
			//默认是 apple 表情
			realType = "apple";
			require('./unicode-emoji-data/emoji-apple.css');
	}
	return realType;
}
var _initEmoji = function($editor, $button, type){
	var realType = _loadEmojiCss(type);

	var emojimaxNum = emojiData.length;
	var emojiChars = {}, emojiNames = {}, emojiClassNames = {};
	for(var i=0; i<emojimaxNum; i++){
		var j = i+1;
		emojiChars[j] = emojiData[i].char;
		emojiNames[j]= emojiData[i].name;
		emojiClassNames[j] = emojiData[i].className + "-" + realType;
	}
	var icons = [{
			name: "表情",
			path: spacerGif,
			maxNum: emojimaxNum,
			alias: emojiChars,
			title: emojiNames,
			className: emojiClassNames
	}];
	$($editor).emoji({
	    button: $button,
	    showTab: false,
	    animation: 'slide',
	    icons: icons
	});
	
	//HACK: 依据全局变量 window.emoji_index 找到 emoji_container 并移到 $button 的父节点上
	var emoji_container_id = "emoji_container_" + window.emoji_index;
	$($button).append($("#"+emoji_container_id));
	
	//返回相关信息
	return {
		emoji_realtype: realType,
		emoji_index: emoji_index,
		emoji_container_id: emoji_container_id
	};
}

/** Define the export point for module */
module.exports = {
	build: build
}
