/**
 * User: 陈志盛
 * Date: 13-12-4
 * Time: 下午2:13
 * 定义公共函数，主要有：extend(继承方法）
 */
// 唯一全局变量 YIUI
var YIUI = YIUI || {};

var UI = UI || {};

var Svr = Svr || {};

(function() {
// 自动生成id
var totalId = 0;
YIUI.allotId = function(){
    totalId++;
    return 'c-'+totalId;
};

var initializing = false;
YIUI.extend = function (baseClass, prop) {
    // 只接受一个参数的情况 - extend(prop)
    if (typeof (baseClass) === "object") {
        prop = baseClass;
        baseClass = null;
    }
    // 本次调用所创建的类（构造函数）
    function F() {
        // 如果当前处于实例化类的阶段，则调用init原型函数
        if (!initializing) {
            // 如果父类存在，则实例对象的baseprototype指向父类的原型
            // 这就提供了在实例对象中调用父类方法的途径
            if (baseClass) {
                this.baseprototype = baseClass.prototype;
            }
            this.init.apply(this, arguments);
        }
    } // 如果此类需要从其它类扩展
    if (baseClass) {
        initializing = true;
        F.prototype = new baseClass();
        F.prototype.constructor = F;
        initializing = false;
    }
    // 覆盖父类的同名函数
    for (var name in prop) {
        if (prop.hasOwnProperty(name)) {
            // 如果此类继承自父类baseClass并且父类原型中存在同名函数name
            if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function") {
                // 重定义函数name -
                // 首先在函数上下文设置this.base指向父类原型中的同名函数
                // 然后调用函数prop[name]，返回函数结果
                // 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数，
                // 此函数中可以应用此上下文中的变量，这就是闭包（Closure）。
                // 这是JavaScript框架开发中常用的技巧。
                F.prototype[name] = (function (name, fn) {
                    return function () {
                        this.base = baseClass.prototype[name];
                        return fn.apply(this, arguments);
                    };
                })(name, prop[name]);
            } else {
                F.prototype[name] = prop[name];
            }
        }
    }
    return F;
};
})();
/**
 * 此文件中仅包含对jQuery的扩展
 */
(function ($, undefined) {
    var userAgent = navigator.userAgent.toLowerCase();
    $.extend($, {

        browser: {
            isIE: /msie/.test(navigator.userAgent.toLowerCase()) || /rv:([\d.]+)\) like gecko/.test(navigator.userAgent.toLowerCase()),
            isSafari: /webkit/.test(userAgent), opera: /opera/.test(userAgent),
            isMozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
            version: (navigator.userAgent.toLowerCase().match(/.+(?:msie|firefox|opera|chrome|netscape)[/: ]([\d.]+)/) || [])[1]
        },

        isDefined: function (v) {
            return typeof v != 'undefined';
        },

        isObject: function (v) {
            return v && typeof v == 'object';
        },

        isString: function (v) {
            return v && typeof v == 'string';
        },

        /**
         * v是否是百分比：0% ~ 100%
         */
        isPercentage: function (v) {
            return v && /^(\d{1,2}%)$|^(100%)$/.test(v);
        },

        /**
         * 获取真实高度、宽度等值。
         * @param value 可能形如：10、'10px'、'10%'、其他。
         * @param parentValue Number类型。父节点的高度、宽度等值。
         * @return 如果算出真实值，返回Number类型值；否则，返回'auto'。
         */
        getReal: function (value, parentValue) {
            if (!$.isDefined(value) || value == null || value <= 0)
                return 'auto';
            var real;
            if ($.isNumeric(value) && value > 1) {
                real = value;
            } else if ($.isNumeric(value) && value <= 1) {
                var percent = parseFloat(value, 10);
                real = parentValue * percent;
            } else if ($.isPercentage(value)) {
                var percent = parseFloat(value, 10) / 100;
                real = parentValue * percent;
            } else {
                real = parseInt(value, 10);
            }

            // IE中浮点数会有问题
            return Math.floor(real);
        },

        /**
         * 返回body的jQuery封装
         */
        getBody: function () {
            return $(document.body || document.documentElement);
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRe: function (s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        /**
         * 清理对象，删除对象obj与其所有属性之间的关联。
         */
        destroy: function (obj) {
            for (var i in obj) {
                delete obj[i];
            }
        },

        /**
         * 去除字符串开头和结尾的空格。
         */
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },

        /**
         * 字符串首字母大写。
         */
        capitalizeFirst: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        /**
         * 字符串首字母小写。
         */
        lowerFirst: function (str) {
        	return str.charAt(0).toLowerCase() + str.slice(1);
        },

        getZindex: function (elem) {
            var position, value;
            while (elem.length && elem[ 0 ] !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css("position");
                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(elem.css("zIndex"), 10);
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parent();
            }

            return 0;
        },

        checkFile: function (file, maxSize, types) {
            if (!maxSize || maxSize == -1) return true;
            var fileTp;
            var size = 0;
            if ($.browser.isIE) {
                // IE下获取上传文件大小
                var filePath = file[0].value;
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                var f = fileSystem.GetFile(filePath);
                size = f.Size / 1024;
                var fileName = f.Name;
                fileTp = fileName.substring(fileName.lastIndexOf(".")+1);
            } else {
                size = file[0].files[0].size / 1024;
                var path = file.val().toLowerCase();
                fileTp = path.substring(path.lastIndexOf(".") + 1);
            }

            if (size > maxSize) {
                $.error("超出指定大小！! (" + maxSize + "KB)");
                return false;
            }
            if (types && $.inArray(fileTp, types) == -1) {
                $.error("非指定文件类型！！ (" + types + ")");
                return false;
            }
            return true;
        },

        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        
        InputMask: {
        	//动作：获取光标所在的位置，包括起始位置和结束位置
        	getCursor : function(textBox) {
        		var obj = new Object();
        		var start = 0,end = 0;
        		if ($.browser.isIE) {
        			var range=textBox.createTextRange(); 
        			var text = range.text;
        			var selrange = document.selection.createRange();
        			var seltext = selrange.text;
        			
        			selrange.moveStart("character",-textBox.value.length); 
        			start = textBox.value.length;
        			end = seltext.length;
        		} else {
        			start = textBox.selectionStart;
        			end = textBox.selectionEnd;
        		}
        		obj.start = start;
        		obj.end = end;
        		return obj;
        	}
        }
    });

    $.extend($.fn, {
        /**
         * 取CSS样式，并仅返回其数字部分，免去后续转为数字过程。
         * @param prop 需要取的CSS样式名
         * @param defaultVal 如果CSS样式值不是数字形式时的返回值
         * @returns {Number}
         */
        cssNum: function (prop, defaultVal) {
            var v = parseFloat(this.css(prop));
            return $.isNumeric(v) ? v : (defaultVal || 0);
        },

        /**
         * 删除DOM上注册的listeners，然后删除DOM。
         */
        destroy: function () {
            this.unbind();
            this.remove();
        },

        nextUntilFn: function (selector, fn) {
            var nextAll = this.nextAll(selector);
            if (fn) {
                for (var i = 0, len = nextAll.length; i < len; i++) {
                    if (fn.call(nextAll[i]) === false) {
                        nextAll.length = i;
                        break;
                    }
                }
            }
            return nextAll;
        },

        /**
         * 对input、textarea的输入进行过滤。
         */
        filterInput: function (invalidChars, textCase, maxLen) {
            if (!invalidChars) return this;
            $.each(this, function () {
                var mask = new RegExp('[^' + $.escapeRe(invalidChars) + ']');
                var replacePattern = new RegExp('[' + $.escapeRe(invalidChars) + ']', 'g');
                var value, timer;
                $(this).keypress(function (event) {
                    // 检查是否非法字符
                    var c = String.fromCharCode((event.which || event.keyCode));
                    c = textCase == YIUI.TEXTEDITOR_CASE.UPPER ? c.toUpperCase() : (textCase == YIUI.TEXTEDITOR_CASE.LOWER ? c.toLowerCase() : c);
                    if (!mask.test(c)) {
                        event.preventDefault();
                    }
                    var selTxt = "";
                    if($.browser.isIE) {
                    	if(document.selection && document.selection.createRange) {
                        	selTxt = document.selection.createRange().text;
                        }
                    } else {
                    	selTxt = window.getSelection().toString();
                    }
                    
                    if (!event.ctrlKey && $(this).val().length >= maxLen && selTxt.length == 0) {
                        event.preventDefault();
                    }
                }).keyup(function (event) {
                        var nKeyCode = event.keyCode || event.which;
                        if (nKeyCode >= 37 && nKeyCode <= 40) return;
                        $(this).val($(this).val().replace(replacePattern, ''));
                    }).focus(function (event) {
                        // 处理打开输入法时的情况
                        var input = $(this);
                        value = input.val();
                        timer = setInterval(function () {
                            if (input.val() != value) {
                                input.val(input.val().replace(replacePattern, ''));
                                value = input.val();
                            }
                        }, 100);
                    }).blur(function (event) {
                        timer && clearInterval(timer);
                    });
            });
            return this;
        }
    });

}(jQuery));
(function ($) {
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj) {
			for (var i = 0; i < this.length; i++) {
				if(this[i] == obj) return i;
			}
			return -1;
		}
	}
	if(!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, "");
		}
	}
    if(!window.console) {
    	console = {};
    	console.log = function() {
    		return;
    	}
    }

	Date.prototype.Format = function(format) {
		var o = {         
		    "M+" : this.getMonth()+1, //月份         
		    "d+" : this.getDate(), //日         
		    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
		    "H+" : this.getHours(), //小时         
		    "m+" : this.getMinutes(), //分         
		    "s+" : this.getSeconds(), //秒         
		    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
		    "S" : this.getMilliseconds() //毫秒         
	    };             
	    if(/(y+)/.test(format)){         
	        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
	    }         
	    for(var k in o){         
	        if(new RegExp("("+ k +")").test(format)){         
	            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }  
	    return format;      
	};
})(jQuery);/**
 * 控件管理类
 * 控件类型管理类
 * @type {YIUI.ComponentMgr}
 */
YIUI.ComponentMgr = function(){
	// 所有控件
    var all = {};

	// 所有控件类型
    var types = {};

    var Return= {
        /** 注册控件，以控件id为key */
        register : function(c){
            all[c.id] = c;
        },

        /** 取消注册控件，通常在destroy */
        unregister : function(c){
            all[c.id] = null;
        },

        /**
         * 根据控件id，获取已经注册的控件
         */
        get : function(id){
            return all[id];
        },

        all : all,

        /**
		 * 检查某控件类型是否已经注册过
         */
        isRegistered : function(type){
            return types[type] !== undefined;
        },

        /**
         * 注册控件类型，控件type为key，控件class为value
         */
        registerType : function(type, cls){
            types[type] = cls;
            cls.type = type;
        },
        
        /**
         * 遍历所有已注册的所有类型。
         * @param fn 对每个遍历到的类型进行的操作，形如：function(typeName,type)
         */
        eachType : function(fn) {
        	if($.isFunction(fn)) {
        		for(var typeName in types) {
        			fn(typeName, types[typeName]);
        		}
        	}
        },

		/**
		 * 根据传入的json动态创建控件
		 * @param config 传入的json
		 * @param defaultType 如果json中未定义type，默认创建的控件
		 * @returns {*}
		 */
        create : function(config, defaultType){
        	if(!types[config.tagName]) {
                YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT, config.tagName);
        	}
            return config.render ? config : new types[config.tagName || defaultType](config);
        }
    };
    return Return;
}();

/**
 * YIUI.ComponentMgr#registerType的简写
 */
YIUI.reg = YIUI.ComponentMgr.registerType;
/**
 * YIUI.ComponentMgr#create的简写
 */
YIUI.create = YIUI.ComponentMgr.create;
/**
 * YIUI.ComponentMgr#get的简写
 */
YIUI.get = YIUI.ComponentMgr.get;/**
 * 所有组件的基础类。
 */
YIUI.Component = YIUI.extend({

    /**
     * String。
     * 组件id，系统中每个组件都有的一个唯一id，可通过此id找到组件：YIUI.get(id)。
     * 如果id未指定，会自动生成一个。
     */
    /** id : null, */

    /**
     * String。
     * 组件key，对应于配置中的key。
     * 对组件做任何操作时，都会用到key。
     */
    /** key : null, */

    /**
     * String。
     * 组件所属的Form的id。
     */
    /** formId : null, */

    /**
     * jQuery包装类型。
     * 控件的dom。
     */
    /** el : null, */

    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',

    /**
     * Boolean。
     * 是否可编辑。
     */
    editable: true,

    /**
     * 是否可用
     */
    enable: true,

    /**
     * Boolean。
     * 是否可见
     */
    visible: true,

    /**
     * Number。
     * 组件在面板中的位置。
     */
    /** top : -1, */
    /** left : -1, */

    /**
     * Number、百分比、auto。
     * 组件的宽度、高度。
     * Number: 像素值，固定大小；
     * 百分比: 相对于父组件的宽度、高度；
     * auto: 自适应大小。
     */
    width: -1,
    height: -1,

    /**
     * String。
     * 鼠标悬停时，显示的提示信息。
     */
    /** tip : null, */

    /**
     * Boolean。
     * 该组件是否必填。
     */
    required: false,

    /**
     * Object。
     * 组件上的CSS样式。
     * 例： format : {
	 * 		foreColor : 'red',
	 * 		backColor : 'blue',
	 * 		fontName : 'Arial',
	 * 		fontSize : '12px',
	 * 		bold : true,
	 * 		italic : false,
	 * 		border : '1px',
	 * 		borderStyle : 'solid',
	 * 		borderColor : '#000000',
	 * 		align : 'center'
	 * }
     */
    format: null,

    /**
     * String。
     * 组件的位置，仅在BorderLayout中有效。
     * 取值：top、bottom、left、right、center。
     */
    /** region : null, */

    /**
     * Number。
     * 仅在GridLayout中有效，组件在网格中的第几列、第几行、占几列、占几行。
     */
    /** x : -1, */
    /** y : -1, */
    /** colspan : -1, */
    /** rowspan : -1, */

    /**
     * Object。
     * 组件触发事件时的回调方法。
     *  new YIUI.TextEditor({
	 * 		listeners : {
	 * 			change : function(event) {
	 * 				// 这里的this是当前的TextEditor
	 * 			},
	 * 			keydown : {
	 * 				fn : function(event) {
	 * 					// 这里的this是由scope指定的
	 * 				},
	 * 				scope : scope
	 * 			}
	 * 		}
	 *  });
     */
    listeners: null,

    error: null,
    errorInfo: {},
    /** 触发事件
     *  在组件作为TabPanel面板的子项时，如果子项被选中，触发该事件。
     *  */
    active: null,

    /** 伙伴组件的标识 */
    buddyKey: null,

    /** 配置信息 */
    metaObj: {},

	/** 是否是伙伴组件*/
    buddy: false,

    /**
     * 初始化方法，此方法由组件构造函数默认调用。
     * @param options 传入属性设置，格式为json : {key : key, caption : caption,...}
     */
    init: function (options) {
        $.extend(this, options);

        // 如果id未定义，动态生成个id
        this.getId();

        // 注册控件，以id为唯一标识
        //YIUI.ComponentMgr.register(this);

        // 所有注册的事件监听。
        this.events = this.events || {};

        // 把listens注册到events中
        if (this.listeners) {
            this.addListener(this.listeners);
            delete this.listeners;
        }

        // 用于保存前次设置的width,height,top,left
        this.lastSize = {
            width: -1,
            height: -1
        };
        this.lastPosition = {
            top: -1,
            left: -1
        };
        this.lastFontSize = {
            fontSize: -1
        };

    },

    /**
     * 设置组件宽度。
     * @param width：Number类型。
     */
    setWidth: function (width) {
        if (!width || !$.isNumeric(width) || width <= 0)
            return;

        if (!this.rendered) {
            this.width = width;
            return;
        }

        var lastSize = this.lastSize;
        if (lastSize.width !== width) {
            lastSize.width = width;
            this.onSetWidth(width);
        }
    },

    // private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
    onSetWidth: function (width) {
        this.el.css("width", width);
    },

    /**
     * 获取组件宽度。
     * @return Number。
     */
    getWidth: function () {
        if (this.rendered) {
            return this.getOuterEl().outerWidth();
        }
        return this.width;
    },

    /**
     * 设置组件高度。
     * @param height：Number。
     */
    setHeight: function (height) {
        if (!height || !$.isNumeric(height) || height <= 0)
            return;

        if (!this.rendered) {
            this.height = height;
            return;
        }

        var lastSize = this.lastSize;
        if (lastSize.height !== height) {
            lastSize.height = height;
            this.onSetHeight(height);
        }
    },

    // private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
    onSetHeight: function (height) {
        this.el.css("height", height);
    },

    /**
     * 获取组件高度。
     * @return Number。
     */
    getHeight: function () {
        if (this.rendered) {
            return this.getOuterEl().outerHeight();
        }
        return this.height;
    },

    // private 获取除去padding和border的宽度
    getInnerWidth: function () {
        return this.el.width();
    },

    // private 获取除去padding和border的高度
    getInnerHeight: function () {
        return this.el.height();
    },

    /**
     * 设置水平方向位置。
     * @param left：Number。
     */
    setLeft: function (left) {
        if (!left || !$.isNumeric(left) || left <= 0)
            return;

        var lastPosition = this.lastPosition;
        if (lastPosition.left !== left) {
            lastPosition.left = left;
            if (this.rendered) {
                this.el.css('position', 'absolute');
                this.onSetLeft(left);
            } else {
                this.left = left;
            }
        }
    },

    // private 默认的设置组件位置方法，如果组件有自定义设置位置方法，可在子组件重写此方法。
    onSetLeft: function (left) {
        this.el.css("left", left);
    },

    /**
     * 设置竖直方向位置。
     * @param top：Number。
     */
    setTop: function (top) {
        if ((!top && top != 0) || top == 'auto')
            return;

        var lastPosition = this.lastPosition;
        if (lastPosition.top !== top) {
            lastPosition.top = top;
            if (this.rendered) {
                this.el.css('position', 'absolute');
                this.onSetTop(top);
            } else {
                this.top = top;
            }
        }
    },

    // private 默认的设置组件位置方法，如果组件有自定义设置位置方法，可在子组件重写此方法。
    onSetTop: function (top) {
        this.el.css("top", top);
    },

    setPadding: function (padding) {
        this.el.css("padding", padding);
    },

    setLeftPadding: function (leftPadding) {
        this.el.css("padding-left", leftPadding);
    },

    setRightPadding: function (rightPadding) {
        this.el.css("padding-right", rightPadding);
    },

    setTopPadding: function (topPadding) {
        this.el.css("padding-top", topPadding);
    },

    setBottomPadding: function (bottomPadding) {
        this.el.css("padding-bottom", bottomPadding);
    },

    setMargin: function (margin) {
        this.el.css("margin", margin);
    },

    setLeftMargin: function (leftMargin) {
        this.el.css("margin-left", leftMargin);
    },

    setRightMargin: function (rightMargin) {
        this.el.css("margin-right", rightMargin);
    },

    setTopMargin: function (topMargin) {
        this.el.css("margin-top", topMargin);
    },

    setBottomMargin: function (bottomMargin) {
        this.el.css("margin-bottom", bottomMargin);
    },

    setBorderColor: function (borderColor) {
        this.el.css("border-color", borderColor);
    },

    setBorderRadius: function (borderRadius) {
        this.el.css("border-radius", borderRadius);
    },

    setVAlign: function (vAlign) {
        this.vAlign = vAlign;
        switch (this.vAlign) {
            case YIUI.HAlignment.TOP:
                this.el.css("vertical-align", "top");
                break;
            case YIUI.VAlignment.CENTER:
                this.el.css("vertical-align", "middle");
                break;
            case YIUI.VAlignment.BOTTOM:
                this.el.css("vertical-align", "bottom");
                break;
        }
    },
    setHAlign: function (hAlign) {
        this.hAlign = hAlign;
//    	switch(this.hAlign) {
//	    	case YIUI.HAlignment.LEFT:
//		    	this.el.css("float", "left");
//				break;
//	    	case YIUI.VAlignment.CENTER:
//		    	this.el.css("margin", "auto auto");
//		    	break;
//	    	case YIUI.VAlignment.RIGHT:
//		    	this.el.css("float", "right");
//		    	break;
//		}
    },

    /**
     * 返回控件id，如果id未定义，则给组件自动生成一个唯一id。
     * @return String。
     */
    getId: function () {
        if (this.ofFormID) {
            return this.id || (this.id = this.ofFormID + "_" + this.key);
        } else {
            return this.id || YIUI.allotId();
        }
    },

    setColumnKey: function (columnKey) {
        this.columnKey = columnKey;
    },

    setTableKey: function (tableKey) {
        this.tableKey = tableKey;
    },

    setDefaultFormulaValue: function (defaultFormulaValue) {
        this.defaultFormulaValue = defaultFormulaValue;
    },

    getColumnKey: function () {
        return this.columnKey;
    },

    getTableKey: function () {
        return this.tableKey;
    },

    getDefaultFormulaValue: function () {
        return this.defaultFormulaValue;
    },

    dependedValueChange: $.noop,

    /**
     * 设置控件是否可编辑。
     * @param editable：Boolean。
     */
    setEditable: function (editable) {
        this.editable = editable;
    },

    /**
     * 设置控件是否可用。
     */
    setEnable: function (enable) {
        this.enable = enable;

        var el = this.getEl(),
            outerEl = this.getOuterEl();
        if (this.enable) {
            el.removeAttr('readonly');
            outerEl.removeClass("ui-readonly");
        } else {
            el.attr('readonly', 'readonly');
            outerEl.addClass("ui-readonly");
        }
    },
    setFocusManager: function (focusManager) {
        this.focusManager = focusManager;
    },
    setTabIndex: function (tabIndex) {
        this.tabIndex = tabIndex;
    },
    getTabIndex: function () {
        return this.tabIndex;
    },

    /**
     * 控件是否可编辑。
     * @return Boolean。
     */
    isEditable: function () {
        return this.editable;
    },

    /**
     * 控件是否可用。
     * @return Boolean。
     */
    isEnable: function () {
        return this.enable;
    },

    /**
     * 设置控件是否可见。
     * @param visible：Boolean。
     */
    setVisible: function (visible) {
        this.visible = visible;
        var outerEl = this.getOuterEl();
        if (this.getMetaObj().buddyKey) {
            var form = YIUI.FormStack.getForm(this.ofFormID);
            var buddyComp = form.getComponent(this.getMetaObj().buddyKey);
            if(buddyComp) {
            	if(buddyComp.rendered) {
            		buddyComp.setVisible(visible);
            	} else {
            		buddyComp.getMetaObj().visible = visible;
            	}
            } 
        }
        if (this.visible) {
            outerEl.removeClass('ui-hidden');
        } else {
            outerEl.addClass('ui-hidden');
        }
        var ownerCt = this.ownerCt;
        if (ownerCt) {
            ownerCt.reduceVisible(visible, this);
        }
    },

    isPanel: function () {
        return this.isPanel;
    },

    /**
     * 控件是否可见。
     * @return Boolean。
     */
    isVisible: function () {
        return this.visible;
    },

    /**
     * 设置鼠标悬停时显示的提示信息。
     * @param tip String，显示的文本。
     */
    setTip: function (tip) {
    	if(this.getMetaObj().tip) {
    		tip = this.getMetaObj().tip;
    	}
        this.el.attr("title", tip);
    },

    /**
     * 返回使用的jQueryUI对象的dom。
     * @return jQuery。
     */
    getEl: function () {
        return this.el;
    },

    /**
     * 返回控件最外层dom，有些控件的最外层dom和getEl()不同，比如grid。
     * @return jQuery。
     */
    getOuterEl: function () {
        return this.getEl();
    },

    /**
     * 用于控制在刷新界面时,是否需要清空值
     * @return
     */
    needClean: function () {
        return true;
    },

    /**
     * 把控件渲染到container中
     * @param container：jQuery，当前控件的父节点。
     */
    render: function (container) {
        this.doRender(container);
        if (this.hasLayout) {
            var panelWidth, panelHeight,
                parentWidth = this.container.width(),
                parentHeight = this.container.height();
            if (this.width == -1) {
                panelWidth = $.getReal("100%", parentWidth);
            } else {
                panelWidth = $.getReal(this.width, parentWidth);
            }
            if (this.height == -1) {
                panelHeight = $.getReal("100%", parentHeight);
            } else {
                panelHeight = $.getReal(this.height, parentHeight);
            }
            this.doLayout(panelWidth, panelHeight);
        }
    },

    doRender: function (container) {
        if (!this.rendered && this.beforeRender() !== false) {
            this.rendered = true;
            this.container = container ? $(container)
                : (this.container ? $(this.container) : $.getBody());
            this.onRender(this.container);
            this.onRenderChildren();
            this.afterRender();
            this.install();
        }
    },

    /**
     * 控件渲染前所做准备。
     */
    beforeRender: $.noop,

    setError: function (error, msg) {
        this.errorInfo = {error: error, msg: msg};
        var el = this.getEl(),
            outerEl = this.el;
        if (this.errorInfo.error) {
            outerEl.addClass('ui-error');
            $('<span class="error-icon" />').attr("title", msg).appendTo(outerEl);
        } else {
            outerEl.removeClass('ui-error');
            $(".error-icon", outerEl).remove();
        }
    },

    /**
     * 控件渲染到界面，不包含items的渲染。
     */
    onRender: function (ct) {
        var el = this.el;

        // 如果未定义ct，且组件el已定义，取ct为el的parentNode
        if (el && (!ct || ct.length == 0)) {
            this.container = ct = $(el).parent();
        }
        if (!el && this.autoEl) {
            if ($.isString(this.autoEl)) {
                el = $(this.autoEl);
            }
        }
        if (el) {
            if (!el.attr('id')) {
                el.attr('id', this.getId());
            }
            this.el = $(el);
            // 如果发现el已经在DOM树中，不再进行插入
            if (this.el.parents('body')[0] != $.getBody()[0]) {
                ct.append(this.el);
            }
        }
        if (this.errorInfo) {
            this.setError(this.errorInfo.error, this.errorInfo.msg);
        }
        this.setColumnKey(this.getMetaObj().columnKey);
        this.setTableKey(this.getMetaObj().tableKey);
        if (this.getMetaObj().defaultFormulaValue) {
            this.setDefaultFormulaValue(this.getMetaObj().defaultFormulaValue);
        }
        this.setKey(this.getMetaObj().key);
        this.getMetaObj().buddy && this.setBuddy(this.getMetaObj().buddy);
    },
    
    setBuddy: function(buddy) {
    	this.buddy = buddy;
    },
    
    isBuddy: function() {
    	return this.buddy;
    },

    onRenderChildren: $.noop,
    /**
     * 重新布局组件
     */
    doLayout: $.noop,

    setKey: function (key) {
        this.key = key;
    },
    /**
     * 设置背景色
     */
    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.getEl().css({
            'background-image': 'none',
            'background-color': backColor
        });
    },

    /**
     * 设置前景色
     */
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this.getEl().css('color', foreColor);
    },

    /**
     * 设置组件显示样式。
     * @param style Object，参考style属性说明。
     */
    setStyle: function (style) {
        var cssStyle = {};
        if(style.vAlign > -1) {
        	cssStyle['vertical-align'] = YIUI.VAlignment.parse(style.vAlign);
        	cssStyle['line-height'] = "normal";
        }
        (style.hAlign > -1) && (cssStyle['text-align'] = YIUI.HAlignment.parse(style.hAlign));
        var font = style.font;
        if (font) {
        	font.name && (cssStyle['font-family'] = font.name);
        	font.size && (cssStyle['font-size'] = font.size);
        	font.bold && (cssStyle['font-weight'] = 'bold');
        	font.italic && (cssStyle['font-style'] = 'italic');
        }
        this.setFormatStyle(cssStyle);
    },
    
    setFormatStyle: function (cssStyle) {
        this.getEl().css(cssStyle);
    },

    /**
     * 设置为必填。
     */
    setRequired: function (required) {
    	this.required = required;
        if (required) {
            this.getOuterEl().addClass('ui-required');
        } else {
            this.getOuterEl().removeClass('ui-required');
        }
    },

    isRequired: function () {
    	return this.required;
    },

    setCssClass: function (cssClass) {
        this.el.addClass(cssClass);
    },

    getMetaObj: function () {
        return this.metaObj;
    },

    setMetaObj: function (metaObj) {
        this.metaObj = metaObj;
    },

    /**
     * 控件渲染后所做操作，默认为设置el大小位置，并注册监听事件；对于Panel，还需进行layout。
     */
    afterRender: function () {
        var metaObj = this.getMetaObj();

//    	if(metaObj.required) {
//    		var form = YIUI.FormStack.getForm(this.ofFormID);
//    		if(form.getOperationState() == YIUI.Form_OperationState.Default) {
//    			this.setRequired(false);
//        	} else {
//        		this.setRequired(this.isNull());
//        	}
//    	}

        (metaObj.enable != undefined) && this.setEnable(metaObj.enable);
        (metaObj.editable != undefined) && this.setEditable(metaObj.editable);
        (metaObj.visible != undefined) && this.setVisible(metaObj.visible);

        metaObj.backColor && this.setBackColor(metaObj.backColor);
        metaObj.foreColor && this.setForeColor(metaObj.foreColor);
        this.format && this.setStyle(this.format);
        this.setTip(metaObj.tip);

        metaObj.cssClass && this.setCssClass(metaObj.cssClass);
        metaObj.padding && this.setPadding(metaObj.padding);
        metaObj.leftPadding && this.setLeftPadding(metaObj.leftPadding);
        metaObj.rightPadding && this.setRightPadding(metaObj.rightPadding);
        metaObj.topPadding && this.setTopPadding(metaObj.topPadding);
        metaObj.bottomPadding && this.setBottomPadding(metaObj.bottomPadding);

        this.setLeft(metaObj.left);
        this.setTop(metaObj.top);

        metaObj.borderColor && this.setBorderColor(metaObj.borderColor);
        metaObj.borderRadius && this.setBorderRadius(metaObj.borderRadius);

        metaObj.vAlign && this.setVAlign(metaObj.vAlign);
        metaObj.hAlign && this.setHAlign(metaObj.hAlign);
    },

    setBox: function () {
        var ownerCt = this.ownerCt, parentWidth, parentHeight;

        if (ownerCt) {
            if ((ownerCt.type == YIUI.CONTROLTYPE.TABPANEL && ownerCt.items.length >= 1) ||
                (ownerCt.tagName == "tabcontainer" && ownerCt.items.length >= 1) || ownerCt.items.length == 1) {
                if (this.width == -1) {
                    this.width = '100%';
                }
                if (this.height == -1) {
                    this.height = '100%';
                }
            }
        }

        if (ownerCt) {
            // 这里需要用减去layout占位符的宽度高度
            parentWidth = ownerCt.getValidWidth();
            parentHeight = ownerCt.getValidHeight();
            this.setWidth($.getReal(this.width, parentWidth));
            this.setHeight($.getReal(this.height, parentHeight));
        } else {
            var parent = this.el.parent();
            parentWidth = parent.width();
            parentHeight = parent.height();
            this.setWidth(this.width);
            this.setHeight(this.height);
        }

    },

    focus: function () {
        this.el.focus();
    },
    
    needTip: function() {
    	return true;
    },
    
    getShowText: function() {
    	return this.caption;
    }, 

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
    },

    /**
     * 给组件添加事件监听。
     * @param ename String或Object。
     *              String：事件名称，这里不是DOM上的事件名称，而是组件自定义的；
     *              Object：形如：{change : {fn:fn, scope:scope}}。
     * @param fn Function，事件触发时的回调函数。
     * @param scope Object，可选的，调用fn时的作用域。
     */
    addListener: function (ename, fn, scope) {
        if ($.isObject(ename)) {
            var listeners = ename, listener;
            for (var e in listeners) {
                listener = listeners[e];
                this.addListener(e, listener.fn || listener, listener.scope);
            }
        } else {
            var event = this.events[ename] = this.events[ename]
                || new YIUI.Event(ename, this);
            event.addListener(fn, scope);
        }
    },

    /**
     * 触发组件上注册的所有ename指定的事件监听方法。
     * @param ename String，事件名称，这里不是DOM上的事件名称，而是组件自定义的。
     */
    fireEvent: function (ename) {
        var event = this.events[ename];
        if (event) {
            var args = $.makeArray(arguments);
            args.shift();
            event.fire.apply(event, args);
        }
    },

    /**
     * 给DOM添加事件监听。
     * @param selector String，把事件监听添加到el中的
     * 哪个子DOM上。
     * @param ename String，事件名称，这里是DOM上的事件名称。
     * @param fn Function 事件监听方法。
     * @param scope 调用回调方法的作用域。
     */
    bind: function (selector, ename, fn, scope) {
        scope = scope || this;
        var dom = selector ? $(selector, this.el) : this.el;
        dom.bind(ename, function (event) {
            fn ? fn.call(scope, event) : scope.fireEvent(ename, event);
        });
    },

    /**
     * 销毁控件，防止内存泄露。
     */
    destroy: function () {
        if (this.isDestroyed)
            return;

        if (this.beforeDestroy() !== false) {
            // 如果已经渲染过，先删除已经注册的listeners，然后删除DOM
            if (this.rendered) {
                this.el.destroy();
                delete this.el;
                delete this.listeners;
            }

            // 取消注册控件
            //YIUI.ComponentMgr.unregister(this);

            this.afterDestroy();

            this.isDestroyed = true;
        }
    },

    beforeDestroy: $.noop,
    
    getNoTabOrderComps: $.noop,

    /**
     * 解除自身所有属性的引用
     */
    afterDestroy: function () {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                delete this[prop];
            }
        }
    },

    /**
     * 差异处理
     */
    diff: function (diffJson, callback) {
    	this.doDiff = true;
        this.callAttrMethod(diffJson, callback);
    	this.doDiff = false;
    },

    callAttrMethod: function (options, callback) {
        var rets = [];
        var _this = this;

        $.each(options, function (name, value) {
            var method = _this['set' + $.capitalizeFirst(name)];
            if (method) {
                method.call(_this, value);
            } else {
                if (callback) {
                    callback.call(_this, name, value);
                } else {
//						console.log('menthod : set' + $.capitalizeFirst(name) +' not find');
                }
            }
        });
    },

    initDefaultValue: function (options) {
        this.el = options.el;
        this.key = options.key;
        this.type = options.el.attr("xtype");
        this.container = options.container;
        this.ofFormID = options.formID;
        this.el.attr("id", this.id);
    }

});
YIUI.reg('component', YIUI.Component);

// 封装添加到组件上的事件监听
YIUI.Event = function (name, owner) {
    this.name = name;
    this.owner = owner;

    this.listeners = [];
};
YIUI.Event.prototype = {
    addListener: function (fn, /*optional*/scope) {
        var obj = {
            fn: fn,
            scope: scope || this.owner
        };
        this.listeners.push(obj);
    },

    removeListener: function (fn, /*optional*/scope) {
        var index = this.indexOfListener(fn, scope);
        if (index != -1) {
            this.listeners.splice(index, 1);
            return true;
        }

        return false;
    },

    indexOfListener: function (fn, /*optional*/scope) {
        var owner = this.owner, index = -1;
        $.each(this.listeners, function (i) {
            if (this.fn == fn && (this.scope == scope || this.scope == owner)) {
                index = i;
                return false;
            }
        });
        return index;
    },

    fire: function () {
        var args = $.makeArray(arguments), owner = this.owner;
        $.each(this.listeners, function (i) {
            if (this.fn.apply(this.scope || window, args) === false) {
                return false;
            }
        });
    }


};/**
 * 功能性控件基础类，其他功能性控件都从它派生。
 */
YIUI.Control = YIUI.extend(YIUI.Component, {
    /**
     * Object。
     * 组件存储到数据库的值，区别于text。
     */
    value: '',
    
    /** 值确认事件中需要的备份值 */
    backupValue: '',

    /**
     * String。
     * 组件显示在界面上的文本，区别于value。
     */
    text: '',

    /**
     * String。
     * 组件值的需要满足的条件。
     */
    checkRule: null,

    /**
     * String。
     * 组件值变化时，需要执行的操作。
     */
    trigger: null,

    /**
     * 组件的事件处理对象
     */
    handler: YIUI.Handler,
    
    behavior: YIUI.BaseBehavior,

    /**
     * 组件触发事件时的回调方法。
     */
    listeners: {
        // TODO 是否把这些与平台后台相关的代码移动到一个独立的文件中？
        /**
         * 鼠标点击组件时的回调方法。
         */
        click: function () {
            this.handler && this.handler.doOnClick(this);
        },

        /**
         * 组件值变化时的回调方法。
         */
        change: function () {
            var newValue = this.getValue();
            this.handler && this.handler.doValueChanged(this, newValue, true, true);
        }
    },
    
    /** 判断组件的值是否为空值 */
    isNull: function() {
    	return (this.value == null || this.value == undefined || this.value === "") ? true : false;
    },

	commitValue: function() {
		if ( this.changing ) {
			if ( this.handler ) {
				this.handler.doValueChanged(this, this.getValue(), true, true);
			}
		}
		this.changing = false;
	},
	
    rollbackValue: function() {
		this.changing = false;
		this.setValue(this.backupValue, false, false, true, false);
    },
    
    /** 设置控件真实值，对应于数据库中存储的值 */
    setValue: function (value, commit, fireEvent, ignoreChanged, editing) {
    	if(!this.behavior) return false;
		this.backupValue = this.value;
    	var _this = this;
    	var options = {
			oldVal: this.value,
			newVal: value
    	};
    	options = this.getCheckOpts(options);
    	var callback = function(value) {
    		_this.checkEnd(value);
    	};
    	var changed = this.behavior.checkAndSet(options, callback);
		if( changed ) {
			this.doChanged(commit, fireEvent, ignoreChanged, editing);
		}
		return changed;
    },
    
    getCheckOpts: function(opts) {
    	opts = $.extend((opts || {}), this.getMetaObj());
    	return opts;
    },
    
    checkEnd: function(value) {
    	this.value = value;
		this.caption = value;
    },
    
    doChanged: function(commit, fireEvent, ignoreChanged, editing) {
		if ( !ignoreChanged && this.handler ) {
			if ( editing ) {
				// 如果验证通过，则处理changed事件
				if ( this.handler.validated(this, this.getValue()) ) {
					this.handler.doValueChanged(this, this.getValue(), commit, fireEvent);
				} else {
					// 验证未通过，如果定义了changing事件，则处理changing事件
					if ( this.handler.hasChanging(this) ) {
						this.changing = true;
						this.handler.changing(this, this.getValue());
					} else {
						// 如果未定义changing事件，则回滚数据
						this.rollbackValue();
					}
				}
			} else {
				this.handler.doValueChanged(this, this.getValue(), commit, fireEvent);
			}
		}
		this.setTip(null);
	},
    
    /** 获取控件真实值 */
    getValue: function () {
        return this.value;
    },

    /** 设置控件显示值，对应于界面显示。默认与getValue()相同，对于真实值与显示值不同的控件，可覆盖此方法。 */
    setText: function (text) {
        this.setValue(text);
    },

    /** 获取控件显示值，同setText */
    getText: function () {
        return this.getValue();
    },

    /**
     * 设置为必填。
     */
    setRequired: function (required) {
        this.base(required);
        if (required) {
            this.getEl().placeholder('-必须填写-');
            var _this = this;
            this.bind(null, 'keyup', function () {
            	if (_this.isNull()) {
                    this.getOuterEl().addClass('ui-required');
                } else {
                    this.getOuterEl().removeClass('ui-required');
                }
            });
            this.bind(null, 'blur', function () {
                if (_this.isNull()) {
                    this.getOuterEl().addClass('ui-required');
                } else {
                    this.getOuterEl().removeClass('ui-required');
                }
            });
        }
    }
});
YIUI.reg("control", YIUI.Control);YIUI.EventHandler = (function () {
    var Return = {

        /**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
            var path = control.path;
        	var target = control.target;
        	var node = $("[path='"+path+"']");
            var enable = node.attr("enable");
            if( enable !== undefined && !YIUI.TypeConvertor.toBoolean(enable) )
                return;
        	if (node.length > 0) {
        		var single = YIUI.TypeConvertor.toBoolean(node.attr("single"));
        		if(single) {
                    var formKey = node.attr("formKey");
                    var paras = node.attr("paras");
                	var li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
                	if(li.length > 0) {
                		li.click();
                		return;
                	}
        		}
        	}

            var data = {};
            data.path = path;
            data.async = true;
            var success = function(jsonObj) {
            	var pFormID;
            	var form = YIUI.FormBuilder.build(jsonObj, target);
                form.entryPath = path;
                form.entryParas = paras;
                if(form.target != YIUI.FormTarget.MODAL) {
                	container.build(form);
                	pFormID = form.formID;
                }
                if(form.getOperationState() == YIUI.Form_OperationState.New) {
                	form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                    form.getUIProcess().checkAll();
                    form.initFirstFocus();
                }
                if(form.postShow) {
                	form.eval(form.postShow, {form: form});
                }
            };
            Svr.SvrMgr.doPureTreeEvent(data, success);
            
        },

        doCloseForm: function (control) {
            var formID = control.ofFormID;
            var form = YIUI.FormStack.getForm(formID);
            form.fireClose();
        }

    };
    return Return;
})();
YIUI.Handler = (function () {
    var Return = {
        formatDate: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "H+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return format;
            }
        },

        convertValue: function (value, type) {
            var ret;
            switch (type) {
                case DataType.STRING:
                    if (value == null || value == undefined) {
                        ret = '';
                    } else {
                        ret = '' + value;
                    }
                    break;
                case DataType.INT:
                case DataType.LONG:
                case DataType.DOUBLE:
                case DataType.FLOAT:
                case DataType.NUMERIC:
                    if (value == undefined || value == null || value == '') {
                        ret = 0;
                    } else {
                        if (value.toString().toLowerCase() == "true") value = 1;
                        if (value.toString().toLowerCase() == "false") value = 0;
                        ret = new Decimal(value, 10);
                    }
                    break;
                case DataType.BOOLEAN:
                    ret = value ? true : false;
                default:
                    ret = value;
            }
            return ret;
        },
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                clickContent = control.clickContent;
            var cxt = {form: form};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        setValueToDocument: function (control, dataTable, columnKey, bookmark, newValue) {
            if (dataTable.indexByKey(columnKey) == -1) return;
            var type = control.type;
            var dataType = dataTable.cols[dataTable.indexByKey(columnKey)].type;
            bookmark == -1 ? dataTable.first() : dataTable.setByBkmk(bookmark);
            if (newValue == undefined || newValue == null) {
                newValue = Return.convertValue(newValue, dataType);
                dataTable.setByKey(columnKey, newValue);
            } else {
                switch (type) {
                    case YIUI.CONTROLTYPE.DICT:
                    case YIUI.CONTROLTYPE.DYNAMICDICT:
                    case YIUI.CONTROLTYPE.COMPDICT:
                        if (control.multiSelect) {
                            if (newValue.length > 0) {
                                var str = '';
                                for (var i = 0; i < newValue.length; i++) {
                                    str += ',' + newValue[i].oid;
                                }
                                str = str.substring(1);
                                dataTable.setByKey(columnKey, str);

                                if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                    dataTable.setByKey(columnKey + 'ItemKey', newValue[0].itemKey);
                                }
                            }
                        } else {
                            dataTable.setByKey(columnKey, newValue.oid);
                            if (type == YIUI.CONTROLTYPE.DYNAMICDICT || type == YIUI.CONTROLTYPE.COMPDICT) {
                                dataTable.setByKey(columnKey + 'ItemKey', newValue.itemKey);
                            }
                        }
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                        if (newValue instanceof Date) {
                            newValue = newValue.getTime();
                        } else {
                            newValue = new Date(newValue).getTime();
                        }
                        dataTable.setByKey(columnKey, newValue);
                        break;
                    default:
                        newValue = Return.convertValue(newValue, dataType);
                        dataTable.setByKey(columnKey, newValue);
                }
            }
        },
        /**
         * 各控件的值变化事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * newValue: 新的存储值
         */
        doValueChanged: function (control, newValue, commitValue, fireEvent) {
            var formID = control.ofFormID,
                metaObj = control.getMetaObj(),
                form = YIUI.FormStack.getForm(formID),
                columnKey = metaObj.columnKey,
                tableKey = metaObj.tableKey, dataTable,
                document = form.getDocument();
            if (tableKey) {
                dataTable = document.getByKey(tableKey);
            }
            if (commitValue) {
                if (control.getMetaObj().isSubDetail) {
                    var cellKey = control.getMetaObj().bindingCellKey;
                    var isToDo = (cellKey !== undefined && cellKey.length > 0);
                    var grid = form.getComponent(control.getMetaObj().parentGridKey), row, colInfoes, colInfo,
                        rowIndex = (grid == null ? -1 : grid.getFocusRowIndex());
                    if (grid && rowIndex >= 0 && rowIndex < grid.dataModel.data.length) {
                        if (isToDo) {
                            colInfoes = grid.getColInfoByKey(cellKey);
                            if (colInfoes !== null) {
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    colInfo = colInfoes[ci];
                                    grid.setValueAt(rowIndex, colInfo.colIndex, newValue, true, fireEvent, true);
                                }
                            }
                        } else {
                            row = grid.dataModel.data[rowIndex];
                            if (row && row.isDetail && row.bookmark !== undefined) {
                                if (dataTable) {
                                    if(dataTable.tableMode == YIUI.TableMode.HEAD){
                                        this.setValueToDocument(control, dataTable, columnKey, -1, newValue);
                                    }else{
                                        this.setValueToDocument(control, dataTable, columnKey, row.bookmark, newValue);
                                    }
                                }
                            }
                        }
                    } else if (grid && rowIndex == -1 && isToDo) {
                        var lastRowIndex = grid.getLastDetailRowIndex();
                        if (lastRowIndex != -1) {
                            colInfoes = grid.getColInfoByKey(cellKey);
                            if (colInfoes !== null) {
                                grid.setFocusRowIndex(lastRowIndex);
                                grid.setCellFocus(lastRowIndex, grid.getCellIndexByKey(cellKey));
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    colInfo = colInfoes[ci];
                                    grid.setValueAt(lastRowIndex, colInfo.colIndex, newValue, true, fireEvent, true);
                                }
                            }
                        }
                    }
                } else {
                    if (dataTable) {
                        this.setValueToDocument(control, dataTable, columnKey, -1, newValue);
                    }
                }

                // 触发事件之前需要做的事
        		form.getUIProcess().preFireValueChanged(metaObj.key);       
                if (fireEvent) {
                    form.getUIProcess().doValueChanged(metaObj.key);
                }
                //可用性
                form.getUIProcess().postFireValueChanged(metaObj.key);
                
                //依赖处理
//                var targetKey = form.getRelations()[metaObj.key];
//                if (targetKey) {
//                    for (var i = 0, len = targetKey.length; i < len; i++) {
//                        var targetCmp = form.getComponent(targetKey[i]);
//                        targetCmp && targetCmp.dependedValueChange(metaObj.key);
//                    }
//                }
            }
        },
        

    	validated: function(control) {
    		var passed = true;
    		var validation = control.validation;
			if ( validation ) {
				var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID);
				passed = form.eval(validation, {form: form});
			}
    		return passed;
    	},
    	
        hasChanging: function(control) {
    		var hasChanging = false;
			var changing = control.valueChanging;
			if (changing) {
				hasChanging = true;
			}
    		return hasChanging;
    	},

        changing: function(control) {
			var changing = control.valueChanging;
			if (changing) {
				var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID);
				form.eval(changing, {form: form});
			}
    	}

    };
    return Return;
})();
YIUI.AttachmentHandler = (function () {
    var Return = {
        /**
         * 删除指定的附件
         */
        doDeleteAttachement: function (control, fileID, formKey) {
            var paras = {fileID: fileID, formKey: formKey};
            Svr.SvrMgr.deleteAttachment(paras);
        },
        
        preview: function(path, name, control) {
        	
        }

    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.ButtonHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.ComboBoxHandler = (function () {
    var Return = {
        //获取下拉框的值
        getComboboxItems: function (combobox, cxt) {

            if (!combobox.needRebuild && typeof(combobox.needRebuild) != "undefined") {
                return;
            }
            var items = [];
            var sourceType = combobox.sourceType,
                formID = combobox.ofFormID;
            switch (sourceType) {
                case YIUI.COMBOBOX_SOURCETYPE.ITEMS:
                case YIUI.COMBOBOX_SOURCETYPE.STATUS:
                case YIUI.COMBOBOX_SOURCETYPE.PARAGROUP:
                    combobox.needRebuild = false;
                    break;
                case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
                    var form = YIUI.FormStack.getForm(formID);
                    if (cxt == undefined) {
                        cxt = {form: form};
                    }
                    if (combobox.formula) {
                        var rs = form.eval($.trim(combobox.formula), cxt, null);
                        if ($.isString(rs)) {
                            var item_Arr = rs.split(";");
                            for (var i = 0, len = item_Arr.length; i < len; i++) {
                                var item_obj = item_Arr[i].split(",");
                                var i1 = item_obj[0];
                                var i2 = "";
                                if (item_obj.length > 1) {
                                    i2 = item_obj[1];
                                } else {
                                    i2 = i1;
                                }
                                var item = {
                                    value: i1,
                                    caption: i2
                                };
                                items.push(item);
                            }
                        } else if (rs instanceof DataDef.DataTable) {
                            rs.beforeFirst();
                            if (rs.cols.length == 1) {// 如果查询的是一列,那么认为是查询了value,caption从全局中匹配
                                var globalItems = combobox.globalItems;
                                var pItems = form.eval($.trim(globalItems), cxt, null);
                                while (rs.next()) {
                                    var value = YIUI.TypeConvertor.toString(rs.get(0));
                                    var caption = "";
                                    if (pItems && pItems.length > 0) {
                                        for (var i = 0, len = pItems.length; i < len; i++) {
                                            var pItem = pItems[i];
                                            if (pItem.value == value) {
                                                caption = pItem.caption;
                                                break;
                                            }
                                        }
                                    }
                                    caption = caption == "" ? value : caption;
                                    var item = {
                                        value: value,
                                        caption: caption
                                    };
                                    items.push(item);
                                }
                            } else if (rs.cols.length > 1) {
                                while (rs.next()) {
                                    var value = YIUI.TypeConvertor.toString(rs.get(0));
                                    var caption = YIUI.TypeConvertor.toString(rs.get(1));
                                    var item = {
                                        value: value,
                                        caption: caption
                                    };
                                    items.push(item);
                                }
                            }
                        } else if (rs != null) {
                            items = items.concat(rs);
                        }
                    }
                    combobox.setItems(items);
                    break;
                case YIUI.COMBOBOX_SOURCETYPE.QUERY:
                    var form = YIUI.FormStack.getForm(formID);
                    var data = {}, type;
                    var queryParas = combobox.queryParas;

                    data.formID = formID;
                    data.key = combobox.key;
                    data.formKey = form.getFormKey();
                    data.fieldKey = combobox.key;
                    data.typeDefKey = combobox.typeDefKey;
                    data.service = "PureUIService";
                    data.cmd = "getQueryItems";

                    var sourceType, value, paras = [];
                    for (var i = 0, len = queryParas.length; i < len; i++) {
                        sourceType = queryParas[i].sourceType;
                        value = queryParas[i].value;
                        switch (sourceType) {
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.CONST:
                                //paras += content;
                                paras.push(value);
                                break;
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.FORMULA:
                            case YIUI.COMBOBOX_PARAMETERSOURCETYPE.FIELD:
                                if (cxt == undefined) {
                                    cxt = {form: form};
                                }
                                paras.push(form.eval(value, cxt, null));
                                break;
                        }
                    }
                    data.paras = $.toJSON(paras);

                    var success = function (result) {
                        if (result) {
                            var items = [];
                            items = items.concat(result);
                            combobox.setItems(items);
                            combobox.checkItem(combobox.getValue());
                            combobox.needRebuild = false;
                        }
                    }

                    Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);

                    break;
            }
        },
        doSuggest: function (combobox, value) {
            if ($.isEmptyObject(value)) {
                combobox.yesCombobox.$suggestView.empty().hide();
                return;
            }
            var sourceType = combobox.sourceType,
                formID = combobox.ofFormID,
                items, viewItems = [];
            var form = YIUI.FormStack.getForm(formID);
            switch (sourceType) {
                case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
                    var cxt = {form: form};
                    if (combobox.formula) {
                        items = form.eval($.trim(combobox.formula), cxt, null);
                    }
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].caption.indexOf(value) > 0) viewItems.push(items[i]);
                        if (viewItems.length == 5) break;
                    }
                    break;
                default:
                    items = combobox.items;
                    for (var i = 0, len = items.length; i < len; i++) {
                    	if (items[i].caption != null) {
                    		if (items[i].caption.indexOf(value) >= 0) viewItems.push(items[i]);
                    	}
                        
                        if (viewItems.length == 5) break;
                    }
                    break;
            }
            if (viewItems.length == 0) {
                combobox.yesCombobox.$suggestView.empty().hide();
                return;
            }
            var list = $('<ul/>'), _li;
            var view = combobox.yesCombobox.$suggestView.html(list);
            for (var i = 0, len = viewItems.length; i < len; i++) {
                _li = $('<li itemValue="' + viewItems[i].value + '">' + viewItems[i].caption + '</li>');
                list.append(_li);
            }
            var cityObj = $("input", combobox.el);
            var cityOffset = cityObj.offset();
            view.css({
                width: cityObj.outerWidth(),
                top: cityOffset.top + cityObj.outerHeight(),
                left: cityOffset.left
            })
            view.show();
            combobox.hasText = true;
        }
    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.CheckBoxHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.DictHandler = (function () {
    var Return = {
        setContext: function (cxt) {
            this.cxt = cxt;
        },
        doLostFocus: function (control, extParas) {

        },
        getFilter: function(form, fieldKey, itemFilters, itemKey) {
            var filter = null;
            if (itemFilters) {
                var itemFilter = itemFilters[itemKey];
                if (itemFilter != null && itemFilter != undefined && itemFilter.length > 0) {
                    for (var i = 0, len = itemFilter.length; i < len; i++) {
                        var cond = itemFilter[i].cond;
                        if (cond && cond.length > 0) {
                           /* var cxt = this.cxt;
                            if(!cxt) {
                                
                            }*/
                        	cxt = {form: form};
                            var ret = form.eval(cond, cxt, null);
                            if (ret == true) {
                                filter = itemFilter[i];
                                break;
                            }
                        } else {
                            filter = itemFilter[i];
                            break;
                        }
                    }
                }
            }
            return filter;
        },
        getDictFilter: function (form, fieldKey, itemFilters, itemKey) {
            var filter = Return.getFilter(form, fieldKey, itemFilters, itemKey);
            //取 filter的值
            if (filter) {
                var filterVal, paras = [];
                if (filter.filterVals !== null && filter.filterVals !== undefined && filter.filterVals.length > 0) {
                    for (var j in filter.filterVals) {
                        filterVal = filter.filterVals[j];
                        switch (filterVal.type) {
                            case YIUI.FILTERVALUETYPE.CONST:
                                //paras += content;
                                paras.push(filterVal.refVal);
                                break;
                            case YIUI.FILTERVALUETYPE.FORMULA:
                            case YIUI.FILTERVALUETYPE.FIELD:
//	                            var cxt = {form: form};
                                //paras += form.eval(content, cxt, null);
                            	var cxt = this.cxt;
                            	if(!cxt) {
                            		cxt = {form: form};
                            	}
                                paras.push(form.eval(filterVal.refVal, cxt, null));
                                break;
                        }
                    }
                }

                var dictFilter = {};
                dictFilter.itemKey = itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.fieldKey = fieldKey;
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
                return dictFilter;
            } else {
                return null;
            }
        },
        checkDict: function ($this) {

            if (!$this.needRebuild && typeof($this.needRebuild) != "undefined") {
                return;
            }
            var oldItemKey = $this.getDictTree().itemKey;
            var formID = $this.ofFormID;

            var form = YIUI.FormStack.getForm(formID);
        	var cxt = this.cxt;
        	if(!cxt) {
        		cxt = {form: form};
        	}
            if ($this.isDynamic) {
                $this.itemKey = form.eval($this.refKey, cxt, null);
            }

            var rootItem = {};

            if ($this.root && $this.root.length >= 0) {
                rootItem = form.getComponentValue($this.root, cxt);
                if (rootItem == null) {
                    rootItem = {};
                    rootItem.oid = 0;
                    rootItem.itemKey = $this.itemKey;
                }
            } else {
                rootItem.oid = 0;
                rootItem.itemKey = $this.itemKey;
            }

            if ($this.rootItemKey) {
                rootItem.itemKey = $this.rootItemKey;
            }


            // filter

            $this.getDictTree().dictFilter = Return.getDictFilter(form, $this.key, $this.itemFilters, $this.itemKey);

            var data = {};
            data.itemKey = $this.itemKey;
            data.itemData = $.toJSON(rootItem);
            data.service = "PureUIService";
            data.cmd = "CheckDict";


            var success = function (result) {

                if (result) {
                    var rootCaption = result.rootCaption;

                    if ($this.getDictTree().rootNode != null) {
                        $this.getDictTree().rootNode.remove();
                    }
                    if (oldItemKey != $this.itemKey) {
                    	$this.getDictTree().fuzzyValue = null;
                    	$this.getDictTree().startRow = 0;
                    	$this.getDictTree()._searchdiv.find(".findinput").val("");
                    	$this.getDictTree()._footdiv.find(".next").removeClass('disable');
                    	
                    }
                    $this.getDictTree().createRootNode(rootItem, rootCaption, rootItem.itemKey + '_' + rootItem.oid, result.secondaryType);
                    $this.getDictTree().itemKey = $this.itemKey;
                    $this.setSecondaryType(result.secondaryType);
                    $this.needRebuild = false;
                    var resultType = result.secondaryType;
                    $this.secondaryType = result.secondaryType;
                    if (resultType == 5) {
                    	//$this.secondaryType = result.secondaryType;
                        //$this.itemKey = result.itemKey;
                        $this.needRebuild = true;
                    }
                    
                    
                }
            };

            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);


        },

        autoComplete: function ($this, text) {

            //同步当前字典状态
            this.checkDict($this);
            //精确匹配
            var rootValue = null;
            if ($this.getDictTree().rootNode != null) {
                rootValue = $this.getDictTree().getNodeValue($this.getDictTree().rootNode);
            }

            var ret = null
            if (!$.isEmptyObject(text)) {
                ret = YIUI.DictService.locate($this.itemKey, 'Code', text, $this.getDictTree().dictFilter, rootValue, $this.stateMask);
            }
            //弹出模糊查询框
            if (ret) {
                //精确匹配成功
//                $this.setText(ret.caption);
                var value = {
                    oid: ret.oid,
                    itemKey: ret.itemKey,
                    caption: ret.caption
                };
                var mul_sel = $this.multiSelect;
                var change = false;
                if (mul_sel) {
                    var val = [];
                    val.push(value);
                    change = $this.setValue(val, true, true);
                } else {
                    change = $this.setValue(value, true, true);
                }
                //值未改变时 还原Text
                if(!change){
                      $this.setText($this.text); 
                }
             
            } else {
                if (mul_sel) {
                    $this.setValue(null, true, true);
//                    $this.setText("");
                    return;
                }
                var options = {
                    fuzzyValue: text,
                    itemKey: $this.itemKey,
                    caption: $this.caption,
                    rootValue: rootValue,
                    stateMask: $this.stateMask,
                    dictFilter: $this.getDictTree().dictFilter,
                    displayCols: $this.displayCols,
                    startRow: 0,
                    maxRows: 5,
                    pageIndicatorCount: 3,
                    columns: $this.displayColumns,
                    textInput: $('input', $this.el),
                    callback: function (itemData) {
                        if (itemData) {
                            $this.setValue(itemData, true, true);
                            $this.setText(itemData.caption);
                        } else {
        					$this.setText($this.text);
                        }
                        $this.isShowQuery = false;
                    }
                };
                var dictquery = new YIUI.DictQuery(options);
                $this.isShowQuery = true;
            }
        },

        doSuggest: function ($this, text) {
            if ($this.multiSelect) {
                return;
            }
            if ($.isEmptyObject(text)) {
                $this.yesDict.$suggestView.empty().hide();
                return;
            }
            //同步当前字典状态
            this.checkDict($this);
            //精确匹配
            var rootValue = null;
            if ($this.getDictTree().rootNode != null) {
                rootValue = $this.getDictTree().getNodeValue($this.getDictTree().rootNode);
            }
            var viewItems = YIUI.DictService.getSuggestData($this.itemKey, text, $this.stateMask, $this.getDictTree().dictFilter, rootValue);

            if (viewItems.length == 0) {
                $this.yesDict.$suggestView.empty().hide();
                $this.hasSuggest = false;
                return;
            }
            $this.hasSuggest = true;
            var list = $('<ul/>'), _li;
            var view = $this.yesDict.$suggestView.html(list), item, _a;
            for (var i = 0, len = viewItems.length; i < len; i++) {
                item = viewItems[i];
                _li = $('<li oid=' + item.oid + ' itemkey = ' + item.itemKey + '></li>');
				$("<div class='dt-wholerow'/>").appendTo(_li);
                _a = $("<a class='dt-anchor'></a>").appendTo(_li);
                _spanIcon = $("<span class='branch'></span>").appendTo(_a);
                if (item.NodeType == 0) {
                    _spanIcon.addClass("p_node");
                }
                _spanText = $("<span class='b-txt'></span>").text(item.caption).appendTo(_a);
                list.append(_li);
            }
            var cityObj = $("input", $this.el);
            var cityOffset = cityObj.offset();
            view.css({
                width: cityObj.outerWidth(),
                top: cityOffset.top + cityObj.outerHeight(),
                left: cityOffset.left
            })
            view.show();
            $this.hasText = true;
        }

    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.DatePickerHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.DropdownButtonHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control, btnKey) {
        	var formID = control.ofFormID,
		        form = YIUI.FormStack.getForm(formID),
		        clickContent;
        	var items = control.dropdownItems;
		    for (var i = 0, len = items.length; i < len; i++) {
				if(items[i].key == btnKey) {
					clickContent = items[i].formula;
					break;
				}
			}
		    var cxt = {form: form};
		    if (clickContent) {
		        form.eval(clickContent, cxt, null);
		    }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.GridHandler = (function () {
    var Return = {
        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (control, rowID, colIndex, value) {
            var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                row = control.getRowDataByID(rowID), rowIndex = control.getRowIndexByID(rowID), cellKey = row.cellKeys[colIndex],
                editOpt = control.getColInfoByKey(cellKey)[0].cell;
            switch (editOpt.edittype) {
                case "button":
                case "hyperLink":
                case "image":
                case "textButton":
                    if (editOpt.editOptions.onclick) {
                        form.eval($.trim(editOpt.editOptions.onclick), {form: form, rowIndex: rowIndex}, null);
                    }
                    break;
                case "checkBox":
                    var oldV = control.getValueAt(rowIndex, colIndex);
                    if (oldV !== value) {
                        control.setValueAt(rowIndex, colIndex, value, true, true);
                    }
                    break;
            }
        },
        /**
         * 表格行点击
         */
        doOnRowClick: function (control, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                clickContent = control.rowClick === undefined ? "" : $.trim(control.rowClick);
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (control, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                clickContent = control.rowDblClick === undefined ? "" : $.trim(control.rowDblClick);
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        /**
         * 表格行焦点变化
         */
        doOnFocusRowChange: function (control, oldRowID, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                oldRowIndex = control.getRowIndexByID(oldRowID),
                clickContent = control.focusRowChanged === undefined ? "" : $.trim(control.focusRowChanged);
            var cxt = {form: form, newRowIndex: rowIndex, oldRowIndex: oldRowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
            YIUI.SubDetailUtil.showSubDetailData(control, rowIndex);
        },
        /**
         * 表格排序事件
         */
        doOnSortClick: function (control, colIndex, sortType) {
            if (control.hasGroupRow) {
                alert("表格排序不支持行分组！");
                return;
            }
            var data = control.dataModel.data;
            data.sort(function (row1, row2) {
                if (row1.rowType == "Fix" || row1.rowType == "Total" || row2.rowType == "Fix" || row2.rowType == "Total") {
                    return row1.metaRowIndex - row2.metaRowIndex;
                }
                var value1 = row1.data[colIndex][0], value2 = row2.data[colIndex][0];
                if (row2.bookmark === undefined) return -1;
                if (row1.bookmark === undefined) return 1;
                if (value1 == undefined && value2 == undefined) return 0;
                if (value1 !== undefined && value2 == undefined) return sortType === "asc" ? -1 : 1;
                if (value1 == undefined && value2 !== undefined) return sortType === "asc" ? 1 : -1;
                var editOpt = control.dataModel.colModel.cells[row1.cellKeys[colIndex]];
                switch (editOpt.edittype) {
                    case "datePicker":
                    case "numberEditor":
                        return sortType === "asc" ? value2 - value1 : value1 - value2;
                    case "textEditor":
                        return sortType === "asc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                    case "comboBox":
                    case "dict":
                        value1 = row1.data[colIndex][1];
                        value2 = row2.data[colIndex][1];
                        return sortType === "asc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                }
                return 1;
            });
            control.dataModel.data = data;
            control.refreshGrid();
        },
        /**
         * 单元格选中事件
         */
        doGridCellSelect: function (control, rowID, colIndex) {

        },
        doShiftRow: function (control, rowIndex, isUp) {
            var rowData = control.getRowDataAt(rowIndex);
            if (!rowData.isDetail || (rowData.isDetail && rowData.bookmark == null)) return;
            var preRowIndex = rowIndex - 1, nextRowIndex = rowIndex + 1;
            if ((isUp && preRowIndex < 0) || (!isUp && nextRowIndex >= control.getRowCount())) return;
            var preRowData = control.getRowDataAt(preRowIndex), nextRowData = control.getRowDataAt(nextRowIndex);
            if (isUp && (!preRowData.isDetail || (preRowData.isDetail && preRowData.bookmark == null))) return;
            if (!isUp && (!nextRowData.isDetail || (nextRowData.isDetail && nextRowData.bookmark == null))) return;
            this.doExchangeRow(control, rowIndex, isUp ? rowIndex - 1 : rowIndex + 1);
        },
        doExchangeRow: function (control, rowIndex, excRowIndex) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                row = control.getRowDataAt(rowIndex),
                excRow = control.getRowDataAt(excRowIndex);
            control.dataModel.data.splice(rowIndex, 1, excRow);
            control.dataModel.data.splice(excRowIndex, 1, row);
            control.el[0].deleteGridRow(rowIndex);
            control.el[0].insertGridRow(rowIndex, excRow);
            control.el[0].deleteGridRow(excRowIndex);
            control.el[0].insertGridRow(excRowIndex, row);
            $(control.el.getGridCellAt(excRowIndex + 1, control.el[0].p.selectCell)).click();
            this.dealWithSequence(form, control);
        },
        /**
         * 单元格值改变事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * newValue: 新的存储值
         * extParas: 其他参数
         */
        doCellValueChanged: function (control, rowID, colIndex, newValue) {
            var rowIndex = control.getRowIndexByID(rowID);
            control.setValueAt(rowIndex, colIndex, newValue, true, true, true);
        },
        /**
         * 表格粘贴事件
         */
        doCellPast: function (control, bgRowID, bgColIndex, copyText) {
            var rowInd = control.getRowIndexByID(bgRowID), rowV = copyText.split("\n");
            for (var i = 0, len = rowV.length; i < len; i++) {
                if (rowV[i] === "") continue;
                var rowIndex = rowInd + i;
                var cellV = rowV[i].split("\t"), cellVObj;
                for (var j = 0, clen = cellV.length; j < clen; j++) {
                    var iCol = bgColIndex + j, value = cellV[j];
                    if (iCol >= control.dataModel.colModel.columns.length) continue;
                    control.setValueAt(rowIndex, iCol, value, true, true, false);
                }
            }
        },
        doAllChecked: function (control, colIndex, newValue) {
            var len = control.dataModel.data.length;
            for (var i = 0; i < len; i++) {
                var rd = control.dataModel.data[i];
                if (rd.isDetail && rd.bookmark != undefined && rd.bookmark != null) {
                    control.setValueAt(i, colIndex, newValue, true, true, false);
                }
            }
        },

        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageInfo) {
            pageInfo = JSON.parse(pageInfo);
            var curPageIndex = control.pageInfo.currentPage, rowIndex = -1;
            if (pageInfo.optType == "firstPage") {
                control.pageInfo.currentPage = 1;
            } else if (pageInfo.optType == "prevPage") {
                control.pageInfo.currentPage = curPageIndex - 1;
            } else if (pageInfo.optType == "nextPage") {
                control.pageInfo.currentPage = curPageIndex + 1;
            } else if (pageInfo.optType == "lastPage") {
                control.pageInfo.currentPage = control.pageInfo.totalPage;
            } else if (pageInfo.optType == "turnToPage") {
                control.pageInfo.currentPage = pageInfo.pageIndex;
            }
            if (control.pageInfo.pageLoadType == "UI") {
                control.reload();
            } else {
                var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                    filterMap = form.getFilterMap(),
                    startRi = (control.pageInfo.currentPage - 1) * control.pageInfo.pageRowCount;
                filterMap.setOID(form.getDocument().oid == undefined ? -1 : form.getDocument().oid);
                filterMap.getTblFilter(control.tableKey).startRow = startRi;
                filterMap.getTblFilter(control.tableKey).maxRows = control.pageInfo.pageRowCount;
                var paras = {
                    formKey: form.formKey,
                    cmd: "gridgotopage",
                    filterMap: $.toJSON(filterMap),
                    gridKey: control.key,
                    condition: $.toJSON(form.getCondParas()),
                    formOptState: form.getOperationState()
                };
//              if (control.pageInfo.pageLoadType == "UI") {
//                 paras.document = $.toJSON(YIUI.DataUtil.toJSONDoc(form.getDocument()));
//              }
                var result = JSON.parse(Svr.SvrMgr.doGoToPage(paras)), dataTable;
                if (result.dataTable) {
                    dataTable = YIUI.DataUtil.fromJSONDataTable(result.dataTable);
                    form.getDocument().setByKey(control.tableKey, dataTable);
                } else {
                    dataTable = form.getDocument().getByKey(control.tableKey);
                }
                // 后台分页不考虑编辑,只处理选择字段的值
                var shadowTableKey = YIUI.DataUtil.getShadowTableKey(control.tableKey);
                var shadowTable = form.getDocument().getByKey(shadowTableKey);
                if( shadowTable && control.pageInfo.pageLoadType == "DB" ) {
                    var data = result.data,row;
                    for( var i = 0,len = result.data.length;i < len;i++ ){
                       row = data[i];
                       if( row.bookmark === undefined || row.bookmark == null )
                        continue;
                       dataTable.setByBkmk(row.bookmark);
                       var OID = dataTable.getByKey(YIUI.SystemField.OID_SYS_KEY),primaryKeys;
                       if( OID != null && OID != undefined ){
                           primaryKeys = [YIUI.SystemField.OID_SYS_KEY];
                       } else {
                           primaryKeys = control.primaryKeys;
                       }
                       var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                       if( pos != -1 ) {
                           var v = shadowTable.getByKey(YIUI.DataUtil.System_SelectField_Key);
                           row.data[control.selectFieldIndex][0] = v;  // value caption enable
                       }
                   }
                }
                control.dataModel.data = result.data;
                control.errorInfoes = result.errorInfoes;
                control.pageInfo.totalPage = result.totalPage;
//              control.pageInfo.currentPage = result.currentPage;
                control.rowIDMask = 0;
            }
            control.initRowDatas();
            control.refreshGrid({needCalc: control.pageInfo.pageLoadType == "DB"});
            if (control.pageInfo.pageLoadType == "DB") {
                //如果是DB分页的情况，根据shadowTable中的行修改当前页的对应的行的值及显示数据。
//                YIUI.DataUtil.modifyDisplayValueByShadow(form.getDocument(), dataTable, control, result.data);
            }
        },
        /**
         * 跳转到首页
         */
        doGoToFirstPage: function (control, pageInfo) {
        },
        /**
         * 跳转到末页
         */
        doGoToLastPage: function (control, pageInfo) {
        },
        /**
         * 跳转到上一页
         */
        doGoToPrevPage: function (control, pageInfo) {
        },
        /**
         * 跳转到下一页
         */
        doGoToNextPage: function (control, pageInfo) {
        },
        /**
         * 表格中新增行事件
         */
        doInsertGridRow: function (control, rowID) {
            var ri = control.getRowIndexByID(rowID),
                rd = control.getRowDataByID(rowID),
                bookmark = parseInt(rd.bookmark, 10);
            if (!rd.isDetail || (isNaN(bookmark) && ri == (control.dataModel.data.length - 1))) return;
            var form = YIUI.FormStack.getForm(control.ofFormID);
            YIUI.SubDetailUtil.clearSubDetailData(form, control);
            control.addGridRow(null, ri);
            var rowInsertContent = control.rowInsert === undefined ? "" : $.trim(control.rowInsert);
            var cxt = {form: form, rowIndex: ri};
            if (rowInsertContent) {
                form.eval(rowInsertContent, cxt, null);
            }
        },

        /**
         * 表格中删除行事件
         */
        doDeleteGridRow: function (control, rowID) {
            var ri = control.getRowIndexByID(rowID);
            var form = YIUI.FormStack.getForm(control.ofFormID);
            var callback = function () {
                control.clearAllSubDetailData(ri);
                var isDeleted = control.deleteGridRow(ri);
                if (isDeleted) {
                    form.getUIProcess().doPostDeleteRow(control, ri);
                    var rowDeleteContent = control.rowDelete === undefined ? "" : $.trim(control.rowDelete);
                    var cxt = {form: form, rowIndex: ri};
                    if (rowDeleteContent) {
                        form.eval(rowDeleteContent, cxt, null);
                    }
                }
            };
            if (control.hasSubDetailData(ri)) {
                var dialog = new YIUI.Yes_Dialog({msg: "清空子明细数据？", YesEvent: callback});
                dialog.show();
                var btns = $(".dlg-btn", dialog.el), btn;
                for (var i = 0; i < btns.length; i++) {
                    btn = $(btns[i]);
                    if (btn.attr("key") == YIUI.Dialog_Btn.STR_YES) {
                        btn.click(function () {
                            callback();
                        });
                    }
                    btn.click(function () {
                        dialog.close();
                    });
                }
            } else {
                callback();
            }
        },
        setCellValueToDocument: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex];
            switch (row.rowType) {
                case "Fix":
                    this.setFixValueToDoc(form, grid, rowIndex, colIndex, newValue);
                    break;
                case "Detail":
                    this.setDtlValueToDoc(form, grid, rowIndex, colIndex, newValue);
                    break;
            }
        },
        setNewValue: function (colKey, cEditOpt, dataTable, newValue) {
            if (dataTable == undefined || colKey == "") return;
            var editOpts = cEditOpt.editOptions, dataType;
            switch (cEditOpt.edittype) {
                case "dict":
                    if (newValue == null || newValue == undefined) {
                        if (editOpts.multiSelect) {
                            dataTable.setByKey(colKey, null);
                        } else {
                            dataTable.setByKey(colKey, 0);
                        }
                        break;
                    }
                    if (editOpts.multiSelect) {
                        var oids = [], itemKey = "";
                        if (editOpts.isCompDict) {
                            $.error($.ygrid.formatString($.ygrid.compDictNotDataBinding, cEditOpt.key))
                        }
                        for (var i = 0, len = newValue.length; i < len; i++) {
                            oids.push(newValue[i].oid);
                            oids.push(",");
                        }
                        if (oids && oids.length > 0) {
                            oids.pop();
                            itemKey = newValue[0].itemKey;
                        }
                        dataTable.setByKey(colKey, oids.join(""));
                        if (editOpts.isDynamic) {
                            dataTable.setByKey(colKey + "ItemKey", itemKey);
                        }
                    } else {
                        dataTable.setByKey(colKey, newValue.oid);
                        if (editOpts.isCompDict || editOpts.isDynamic) {
                            dataTable.setByKey(colKey + "ItemKey", newValue.itemKey);
                        }
                    }
                    break;
                default:
                    dataType = dataTable.cols[dataTable.indexByKey(colKey)].type;
                    dataTable.setByKey(colKey, YIUI.Handler.convertValue(newValue, dataType));
                    break;
            }
        },
        // 获取拓展的维度数据对应的key
        crossValKey:function(metaCell){
            var key = [];
            key.push(metaCell.columnArea);
            var crossValue = metaCell.crossValue;
            if( crossValue ) {
                for( var i = 0;i < crossValue.values.length;i++ ) {
                    var node = crossValue.values[i];
                    key.push(node.columnKey,node.dataType,node.value);
                }
            }
            return key.join("_");
        },
        newRow: function (form, grid, row, dataTable) {
            var cm, editOpt, cellV, dataType;
            dataTable.addRow(true);
            for (var i = 0, len = grid.dataModel.colModel.columns.length; i < len; i++) {
                cm = grid.dataModel.colModel.columns[i];
                editOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];
                if (editOpt == undefined || editOpt.columnKey === undefined || editOpt.columnKey === "") continue;
                cellV = row.data[i][0];
                if (editOpt.edittype === "dict" && cellV !== null) {
                    if (editOpt.editOptions.multiSelect) {
                        var realV = [];
                        for (var n = 0, clen = cellV.length; n < clen; n++) {
                            realV.push(cellV[n].oid);
                            realV.push(",");
                        }
                        realV.pop();
                        cellV = realV.join("");
                    } else {
                        cellV = cellV.oid;
                    }
                }
                dataType = dataTable.cols[dataTable.indexByKey(editOpt.columnKey)].type;
                dataTable.setByKey(editOpt.columnKey, YIUI.Handler.convertValue(cellV, dataType));
            }
            return dataTable.getBkmk();
        },
        setFixValueToDoc: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex], cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[colIndex]],
                doc = form.getDocument(), dataTable, dataType, tableKey = cEditOpt.tableKey, colKey = cEditOpt.columnKey;
            if (doc == undefined || doc == null) return;
            if (tableKey == undefined || colKey == undefined) return;
            dataTable = doc.getByKey(tableKey);
            if (dataTable == undefined || dataTable == null) return;
            if (!dataTable.first()) {
                dataTable.addRow();
            }
            this.setNewValue(colKey, cEditOpt, dataTable, newValue);
        },
        selectRow: function (form, grid, rowIndex, colIndex, newValue) {
            var rd = grid.getRowDataAt(rowIndex), tableKey = grid.tableKey,
                doc = form.getDocument(), dataTable = doc.getByKey(tableKey),
                dataType = dataTable.cols[dataTable.indexByKey("SelectField")].type;
            if (rd.isDetail && rd.bookmark == undefined || doc == undefined || dataTable == undefined) return;
            if (grid.hasColExpand) {
                for (var i = 0, len = rd.bookmark.length; i < len; i++) {
                    var detailBkmk = rd.bookmark[i];
                    dataTable.setByBkmk(detailBkmk);
                    dataTable.setByKey(YIUI.DataUtil.System_SelectField_Key, YIUI.Handler.convertValue(newValue, dataType));
                }
            } else {
                if (grid.pageInfo.pageLoadType == "DB") {
                    var shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
                    var shadowTable = doc.getByKey(shadowTableKey);
                    if (shadowTable == null || shadowTable == undefined) {
                        shadowTable = YIUI.DataUtil.newShadowDataTable(dataTable);
                        doc.add(shadowTableKey, shadowTable);
                    }
                    dataTable.setByBkmk(rd.bookmark);
                    if (dataTable.allRows[dataTable.pos].state == DataDef.R_New)
                        return;
                    var curOID = dataTable.getByKey(YIUI.DataUtil.System_OID_Key), primaryKeys;
                    if (curOID != null && curOID != undefined) {
                        primaryKeys = [YIUI.DataUtil.System_OID_Key];
                    } else {
                        primaryKeys = grid.primaryKeys;
                    }
                    var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                    if (YIUI.TypeConvertor.toBoolean(newValue)) {
                        if (pos != -1) {
                            shadowTable.setPos(pos);
                        } else {
                            shadowTable.addRow();
                            for (var j = 0, clen = shadowTable.cols.length; j < clen; j++) {
                                shadowTable.set(j, dataTable.get(j));
                            }
                        }
                        shadowTable.setByKey(YIUI.DataUtil.System_SelectField_Key, 1);
                        shadowTable.allRows[shadowTable.pos].state = dataTable.allRows[dataTable.pos].state;
                    } else {
                        if (pos != -1) {
                            if (shadowTable.rows[pos].state == DataDef.R_Normal) {
                                shadowTable.rows[pos].state = DataDef.R_New;
                                shadowTable.delRow(pos);
                            } else {
                                shadowTable.setByKey(YIUI.DataUtil.System_SelectField_Key, 0);
                            }
                        }
                    }
                } else {
                    dataTable.setByBkmk(rd.bookmark);
                    dataTable.setByKey(YIUI.DataUtil.System_SelectField_Key, YIUI.Handler.convertValue(newValue, dataType));
                }
            }
        },
        setDtlValueToDoc: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex], cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[colIndex]],
                doc = form.getDocument(), dataTable, tableKey = cEditOpt.tableKey, colKey = cEditOpt.columnKey,
                dtlRowIndex = grid.metaRowInfo.dtlRowIndex, metaRow = grid.metaRowInfo.rows[dtlRowIndex], metaCell = metaRow.cells[colIndex];
            if (grid.selectFieldIndex != -1 && grid.selectFieldIndex == colIndex) {
                this.selectRow(form, grid, rowIndex, colIndex, newValue);
            }
            if (doc == undefined || doc == null) return;
            if (tableKey == undefined || colKey == undefined) return;
            dataTable = doc.getByKey(tableKey);
            if (dataTable == undefined || dataTable == null) return;
            var oldTableSize = dataTable.getRowCount();
            if (row.isDetail && row.bookmark == undefined) {
                this.flushRow(form, grid, rowIndex);
            } else {
//                var shadowTable = null;
                if (grid.hasColExpand) {
                    if (metaCell.isColExpand) {
                        dataTable.setByBkmk(row.cellBkmks[colIndex]);
//                        shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                        this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                        this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                    } else {
                        for (var i = 0, len = row.bookmark.length; i < len; i++) {
                            dataTable.setByBkmk(row.bookmark[i]);
//                            shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                            this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                            this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                        }
                    }
                } else {
                    dataTable.setByBkmk(row.bookmark);
//                    shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                    this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                    this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                }
            }
            if (oldTableSize !== dataTable.getRowCount()) {
                this.dealWithSequence(form, grid);
            }
        },
        flushRow: function (form, grid, rowIndex) {
            var row = grid.dataModel.data[rowIndex], tableKey = grid.tableKey,
                dtlRowIndex = grid.metaRowInfo.dtlRowIndex, metaRow = grid.metaRowInfo.rows[dtlRowIndex],
                doc = form.getDocument(), dataTable = doc.getByKey(tableKey), rowBkmk;
            if (doc == undefined || doc == null) return;
            if (dataTable == undefined || dataTable == null) return;

            if (grid.hasColExpand) {
                rowBkmk = [];
                var cell, metaCell, newBkmk, cEditOpt, colExpandMap = {};
                for (var i = 0, len = row.data.length; i < len; i++) {
                    cell = row.data[i];
                    metaCell = metaRow.cells[i];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];
                    if (metaCell.isColExpand) {
                        var key = this.crossValKey(metaCell);
                        newBkmk = colExpandMap[key];
                        if (newBkmk == undefined || newBkmk == null) {
                            newBkmk = this.newRow(form, grid, row, dataTable);
                            rowBkmk.push(newBkmk);
                            row.cellBkmks[i] = newBkmk;
                            colExpandMap[key] = newBkmk;
                            this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, cell[0]);
                            var expInfo = grid.expandModel[metaCell.columnArea];
                            for (var k = 0, cLen = metaCell.crossValue.values.length; k < cLen; k++) {
                                var node = metaCell.crossValue.values[k];
                                var expKey = expInfo[k];
                                if (expKey !== undefined && expKey !== null && expKey.length > 0) {
                                    dataTable.setByKey(expKey, node.value);
                                }
                            }
                        } else {
                            row.cellBkmks[i] = newBkmk;
                        }
                    }
                }
                for (var m = 0, eLen = rowBkmk.length; m < eLen; m++) {
                    dataTable.setByBkmk(rowBkmk[m]);
                    for (var n = 0, nLen = row.data.length; n < nLen; n++) {
                        metaCell = metaRow.cells[n];
                        cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[n]];
                        if (!metaCell.isColExpand && metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                            this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[n][0]);
                        }
                    }
                }
            } else {
                rowBkmk = this.newRow(form, grid, row, dataTable);
                dataTable.setByBkmk(rowBkmk);
                for (var j = 0, jLen = row.data.length; j < jLen; j++) {
                    metaCell = metaRow.cells[j];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[j]];
                    if (metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                        this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[j][0]);
                    }
                }
                if (grid.parentGrid && grid.parentGrid.length > 0) {
                    var parentGrid = form.getComponent(grid.parentGrid),
                        pRowIndex = parentGrid.getFocusRowIndex(),
                        pRow = parentGrid.dataModel.data[pRowIndex];
                    dataTable.rows[dataTable.pos].parentBkmk = pRow.bookmark;
                }
            }
            row.bookmark = rowBkmk;
            YIUI.SubDetailUtil.showSubDetailData(grid, rowIndex);
            return row;
        },
        showDetailRowData: function (form, grid, rowIndex, calcRow) {
            var document = form.getDocument();
            if (document == null) return;
            var dataTable = document.getByKey(grid.tableKey);
            if (dataTable == null) return;
            var gridData = grid.getRowDataAt(rowIndex), rowbkmk = gridData.bkmkRow, firstRow = rowbkmk, expandRowBkmk;
            if (rowbkmk instanceof YIUI.ExpandRowBkmk) {
                expandRowBkmk = rowbkmk;
                firstRow = rowbkmk.getAt(0);
            }
            for (var i = 0, len = gridData.data.length; i < len; i++) {
                var metaCell = grid.getMetaObj().rows[gridData.metaRowIndex].cells[i], value;
                if (metaCell.hasDB) {
                    if (metaCell.isColExpand) {
                        var detailRowBkmk = expandRowBkmk.getAtArea(metaCell.columnArea, metaCell.crossValue);
                        if (detailRowBkmk != null) {
                            gridData.cellBkmks[i] = detailRowBkmk.getBookmark();
                            dataTable.setByBkmk(detailRowBkmk.getBookmark());
                            value = YIUI.UIUtil.getCompValue(metaCell, dataTable);
                            gridData.data[i] = grid.getCellNeedValue(rowIndex, i, value, true);
                        }
                    } else {
                        dataTable.setByBkmk(firstRow.getBookmark());
                        value = YIUI.UIUtil.getCompValue(metaCell, dataTable);
                        gridData.data[i] = grid.getCellNeedValue(rowIndex, i, value, true);
                    }
                } else if (metaCell.isSelect) {
                    //选择字段的一些处理
                } else if (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK) {
                    gridData.data[i] = grid.getCellNeedValue(rowIndex, i, metaCell.caption, true);
                }
            }
            if (calcRow) {
                form.getUIProcess().doPostInsertRow(grid, rowIndex);
            }
        },

        copyRow: function (form, grid, rowIndex, splitKeys, splitValues, layer) {
            var dataTable = form.getDocument().getByKey(grid.tableKey),
                newRowIndex = rowIndex + 1;
            if (dataTable == undefined) return -1;
            var row = grid.getRowDataAt(rowIndex);
            if (row.isDetail && row.bookmark == undefined) return -1;
            var rd = grid.addGridRow(null, newRowIndex, false);
            if (rd.bookmark == undefined) {
                rd = this.flushRow(form, grid, newRowIndex);
            }
            if (row.bookmark !== undefined) {
                var values = {}, OID = -1, tCol, value;
                dataTable.setByBkmk(row.bookmark);
                for (var i = 0, len = dataTable.cols.length; i < len; i++) {
                    tCol = dataTable.cols[i];
                    value = dataTable.get(i);
                    if (tCol.key.toLowerCase() == "oid" && value !== null) {
                        OID = value;
                    }
                    values[tCol.key] = value;
                }
                dataTable.setByBkmk(rd.bookmark);
                for (var ci = 0, clen = dataTable.cols.length; ci < clen; ci++) {
                    tCol = dataTable.cols[ci];
                    if (splitKeys.indexOf(tCol.key) >= 0) {
                        var dataType = dataTable.cols[dataTable.indexByKey(tCol.key)].type;
                        dataTable.set(ci, YIUI.Handler.convertValue(splitValues[splitKeys.indexOf(tCol.key)], dataType));
                    } else {
                        dataTable.set(ci, values[tCol.key]);
                    }
                    if (tCol.key.toLowerCase() == "oid") {
                        dataTable.set(ci, null);
                    }
                    if (tCol.key.toLowerCase() == "poid") {
                        dataTable.set(ci, OID);
                    }
                    if (tCol.key.toLowerCase() == "sequence") {
                        dataTable.set(ci, null);
                    }
                }
            }
            if (layer != -1) {
                dataTable.setByKey("Layer", layer);
            }
            dataTable.beforeFirst();
            grid.showDetailRow(newRowIndex, false);
            this.dealWithSequence(form, grid);
            return  newRowIndex;
        },
        /**
         *处理表格值变化时需要发生的相关事件
         */
        fireCellChangeEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex],
                editOpt = grid.dataModel.colModel.cells[cellKey];
 //           meatRow = grid.metaRowInfo.rows[row.metaRowIndex];
//            var cellCEvent = meatRow.cells[colIndex].valueChanged;
//            if (cellCEvent !== undefined && cellCEvent.length > 0) {
//                form.eval($.trim(cellCEvent), {form: form, rowIndex: rowIndex}, null);
//            }
//            form.uiProcess.doCellValueChanged(grid, rowIndex, colIndex, cellKey);
            form.getViewDataMonitor().fireCellValueChanged(grid, rowIndex, colIndex,cellKey);
             // 先在这里算,后面改之   TODO
            YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);
            if (editOpt == undefined || editOpt.columnKey === undefined || editOpt.columnKey.length == 0 || !grid.isEnable()) return;
            var nextRow = grid.dataModel.data[rowIndex + 1];
            if (!row.isDetail) return;
            var sr = grid.el[0].p.selectRow, sc = grid.el[0].p.selectCell;
            if ((nextRow === undefined || !nextRow.isDetail) && grid.newEmptyRow && !grid.hasRowExpand && (grid.treeColIndex == null || grid.treeColIndex == -1)) {
                if (grid.hasGroupRow) {
                    if (row.inAutoGroup) {
                        var pRow, nRow;
                        for (var i = rowIndex - 1; i >= 0; i--) {
                            pRow = grid.dataModel.data[i];
                            if (!pRow.inAutoGroup) break;
                            pRow.inAutoGroup = false;
                        }
                        row.inAutoGroup = false;
                        for (var ind = rowIndex + 1, len = grid.dataModel.data.length; ind < len; ind++) {
                            nRow = grid.dataModel.data[ind];
                            if (!nRow.inAutoGroup) break;
                            nRow.inAutoGroup = false;
                        }
                        grid.appendAutoRowAndGroup();
                    } else {
                        grid.addGridRow(null, rowIndex + 1);
                    }
                } else {
                    grid.addGridRow();
                }
            }
            if (sr !== undefined && sc !== undefined) {
                grid.el.setGridParam({selectRow: sr, selectCell: sc});
            }
        },
        /**
         *处理表格值变化后需要发生的相关事件
         */
        doPostCellChangeEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex];
            form.uiProcess.doPostCellValueChanged(grid, rowIndex, colIndex, cellKey);
        },
        dealWithSequence: function (form, grid) {
            var SYS_SEQUENCE = "Sequence";
            if (grid.seqColumn == undefined) return;
            var row, bkmk, seq, curSeq = 0, dataTable = form.getDocument().getByKey(grid.tableKey);
            for (var i = 0, len = grid.dataModel.data.length; i < len; i++) {
                row = grid.dataModel.data[i];
                bkmk = row.bookmark;
                if (!row.isDetail || row.bookmark == undefined) continue;
                if (grid.hasColExpand) {
                    dataTable.setByBkmk(bkmk[0]);
                    seq = dataTable.getByKey(SYS_SEQUENCE);
                    if (seq == undefined || seq == null || seq <= curSeq) {
                        seq = curSeq + 1;
                        for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                            dataTable.setByBkmk(bkmk[j]);
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        }
                        curSeq = parseInt(seq);
                    }
                } else {
                    dataTable.setByBkmk(bkmk);
                    seq = dataTable.getByKey(SYS_SEQUENCE);
                    if (seq == undefined || seq == null || seq <= curSeq) {
                        seq = curSeq + 1;
                        dataTable.setByKey(SYS_SEQUENCE, seq);
                    }
                    curSeq = parseInt(seq);
                }
            }
        },
        dependedValueChange: function (grid, targetField, dependencyField, value) {
            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cellLocation = form.getCellLocation(targetField);
            if (grid.treeColIndex == cellLocation.column || grid.rowExpandIndex == cellLocation.column) { //树形表格重新加载数据
                this.reloadGridByFilter(grid, form, dependencyField, value);
            } else {
                if (cellLocation.row == null || cellLocation.row == -1) {
                    for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                        var row = grid.getRowDataAt(i);
                        if (row.isDetail && row.bookmark != null) {
                            Return.dependedValueChangeAt(grid, i, dependencyField, targetField, value);
                        }
                    }
                } else {
                    Return.dependedValueChangeAt(grid, cellLocation.row, dependencyField, targetField, value);
                }
            }
        },
        reloadGridByFilter: function (grid, form, dependencyField, value) {
            if (value == null) {
                value = form.getComponent(dependencyField).getValue();
                if (value instanceof YIUI.ItemData) {
                    value = value.oid;
                }
            }
            var jsonDoc = YIUI.DataUtil.toJSONDoc(form.getDocument());
            var params = {
                service: "PureGridOpt",
                cmd: "ReloadGridByFilter",
                document: $.toJSON(jsonDoc),
                formKey: form.getFormKey(),
                dependencyField: dependencyField,
                dependencyFieldValue: value
            };
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
            this.diffFromFormJson(grid, result.form);
        },
        diffFromFormJson: function (grid, formJson) {
            var block = formJson.body.items[formJson.body.index_of_block];
            var getDiffJSON = function (items, gridKey) {
                var item, result;
                for (var i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if (item.metaObj != null && item.metaObj.key == gridKey) {
                        result = item;
                        break;
                    } else {
                        if (item.items != null && item.items.length > 0) {
                            result = getDiffJSON(item.items, gridKey);
                        }
                        if (result != null)
                            break;
                    }
                }
                return result;
            };
            var gridDiffJson = getDiffJSON(block.rootPanel.items, grid.key);
            grid.diff(gridDiffJson);
        },
        doPostCellValueChanged: function (grid, rowIndex, dependencyField, targetField, value) {
            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                comp = form.getComponent(targetField);
            if (comp != null) {
                comp.dependedValueChange(dependencyField)
            } else {
                Return.dependedValueChangeAt(grid, rowIndex, dependencyField, targetField, value);
            }
        },
        dependedValueChangeAt: function (grid, rowIndex, dependencyField, targetField, value) {
            var row = grid.getRowDataAt(rowIndex), metaRow = grid.metaRowInfo.rows[row.metaRowIndex];
            var updateDynamicCell = function (cell, cellTypeDef, editOpt, rowData, rowIndex, cellIndex) {
                if (cellTypeDef.options.isAlwaysShow) {
                    var iRow = rowIndex + 1, iCol = grid.showRowHead ? cellIndex + 1 : cellIndex, cm = grid.dataModel.colModel[iCol],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: rowIndex, key: cm.name, id: iRow + "_" + cm.name, name: cm.name}),
                        gRow = grid.el.getGridRowAt(iRow);
                    grid.alwaysShowCellEditor(cell, iRow, iCol, cm, [null, "", cell.enable], opt, gRow.offsetHeight);
                }
            };
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i], editOpt = grid.dataModel.colModel.cells[metaCell.key];
                if (metaCell.key == targetField) {
                    if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                        var cell = grid.el.getGridCellAt(rowIndex + 1, grid.showRowHead ? i + 1 : i),
                            cellTypeDef = cell.cellTypeDef;
                        if (cellTypeDef != null) {
                            var newOpt = $.extend(true, {}, editOpt), newOptions = $.extend(true, cellTypeDef.options, editOpt.editOptions);
                            newOpt.editOptions = newOptions;
                            Return.dependencyValueChangedByType(grid, cellTypeDef.type, newOpt, rowIndex, i, dependencyField, value);
                            updateDynamicCell(cell, cellTypeDef, rowIndex, i);
                        }
                    } else {
                        Return.dependencyValueChangedByType(grid, metaCell.cellType, editOpt, rowIndex, i, dependencyField, value);
                    }
                }
            }
        },
        dependencyValueChangedByType: function (grid, cellType, editOpt, rowIndex, colIndex, dependencyField, value) {
            var formID = grid.ofFormID, form = YIUI.FormStack.getForm(formID);
            if (cellType == YIUI.CONTROLTYPE.DICT || cellType == YIUI.CONTROLTYPE.COMPDICT || cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                if (editOpt.editOptions.isDynamic) {
                    var refKey = editOpt.editOptions.refKey;
                    if (refKey == dependencyField) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                        return;
                    }
                }
                var root = editOpt.editOptions.root;
                if (root == dependencyField) {
                    grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    return;
                }
                var dictFilter = editOpt.dictFilter;
                if (dictFilter != null) {
                    var filterDependency = dictFilter.dependency;
                    if (filterDependency != null && filterDependency.indexOf(dependencyField) >= 0) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                        editOpt.needRefreshFilter = true;
                    }
                } else {
                    var curFilter = YIUI.DictHandler.getFilter(form, editOpt.key, editOpt.editOptions.itemFilters, editOpt.editOptions.itemKey);
                    if (curFilter != null) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    }
                }
            } else if (cellType == YIUI.CONTROLTYPE.COMBOBOX || cellType == YIUI.CONTROLTYPE.CHECKLISTBOX) {
                var dependedFields = editOpt.editOptions.dependedFields;
                if (dependedFields.indexOf(dependencyField) >= 0) {
                    grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    editOpt.needRebuild = true;
                }
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.HyperLinkHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.ImageHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.ListViewHandler = (function () {
    var Return = {
        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var formID = control.ofFormID,
            	metaObj = control.getMetaObj(),
	            controlKey = metaObj.key,
	            tableKey = metaObj.tableKey,
	            startRow = pageIndex * metaObj.pageRowCount,
	            form = YIUI.FormStack.getForm(formID);
	
	
	        var filterMap = form.getFilterMap();
//	    	filterMap.setStartRow(tableKey, startRow);
	        filterMap.setOID(form.getDocument().oid);
	        var formParas = form != null ? form.getParas() : null;
	        var paras = {
	            cmd: "pagination",
	            compKey: controlKey,
	            pageIndex: pageIndex,
	            parameters: formParas.toJSON(),
	            formKey: form.getFormKey(),
	            form: form.toJSON()
//	            filterMap: $.toJSON(filterMap),
//	            condParas: form.getCondParas()
	//            oid: form.getDocument().oid,
	//            tableKey: tableKey,
	//            rowIndex: extParas * control.pageRowCount,
	//            maxRows: control.pageRowCount
	        };
	
	//    	var params = {formKey: form.getFormKey(), filterMap: $.toJSON(filterMap), condition: form.getCondParas()};
	//    	var document = Svr.SvrMgr.loadFormData(params);
	//		if (document) {
	//            var doc = YIUI.DataUtil.fromJSONDoc(document);
	//            form.setDocument(doc);
	//        }
	//		form.showDocument();
	
	
	        var result = Svr.SvrMgr.doGoToPage(paras);
	//            listview = result.listview;
	
	        var newForm = YIUI.FormBuilder.build(result);
//	        newForm.getComponent(controlKey).pageNumber = pageIndex + 1;
	//    	var expKey = control.tableKey+"_rowcount";
	//    	var rowCount = newForm.getDocument().expData[expKey];
	        
//	        var el = form.getRoot().el;
//	        newForm.getRoot().el = el;
//	        el.empty();
//	        newForm.getRoot().render();
//	        YIUI.FormStack.removeForm(form.formID);
	        var listView = newForm.getComponent(controlKey);
        	if(listView.totalRowCount < metaObj.pageRowCount) {
        		control._pagination.hidePagination();
    		} else if(listView.totalRowCount) {
    			control.totalRowCount = listView.totalRowCount;
    			control._pagination.setTotalRowCount(control.totalRowCount, false);
    		}
	        control.data = listView.data;
	        control.clearDataRow();
	        control.addDataRow(control.data);
	
	    },
        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (control, rowIndex) {
            var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            rowDblClick = control.rowDblClick;

	        var cxt = {form: form, rowIndex: rowIndex};
	        if (rowDblClick) {
	            form.eval(rowDblClick, cxt, null);
	        }
	    },
	    /**
         * ListView行单击
         */
        doOnRowClick: function (control, rowID) {
            var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            rowClick = control.rowClick;

	        var cxt = {form: form, rowIndex: rowID};
	        if (rowClick) {
	            form.eval(rowClick, cxt, null);
	        }
        },
        /**
         * ListView行变化事件
         */
        doOnFocusRowChange: function (control, oldRowID, newRowID) {
        	var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            focusRowChanged = control.focusRowChanged;

	        var cxt = {form: form, rowIndex: newRowID};
	        if (focusRowChanged) {
	            form.eval(focusRowChanged, cxt, null);
	        }
        },
        /**
         * 单元格值改变事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * rowID: 行号
         * colIndex: 列号
         * newValue: 新的存储值
         */
        doCellValueChanged: function (control, rowIndex, colIndex, newValue) {
        	var column = control.columnInfo[colIndex];
        	var dbKey = column.key;
        	control.data[rowIndex][dbKey].value = newValue;
        	var valueChanged = column.valueChanged;
        	if(valueChanged) {
        		var form = YIUI.FormStack.getForm(control.ofFormID);
        		form.eval(valueChanged, {form: form});
        	}
        },

        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (control, rowID, colKey) {
            var formID = control.ofFormID,
	            form = YIUI.FormStack.getForm(formID),
	            columns = control.columnInfo, 
	            column;
            for (var i = 0, len = columns.length; i < len; i++) {
				column = columns[i];
				if(column.key == colKey) break;
			}
            
            var clickCont = column.clickContent;
            if (clickCont) {
                form.eval(clickCont, {form: form, rowIndex: rowID}, null);
            }
	    }
        
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.NumberEditorHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.PasswordEditorHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.RadioButtonHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.SplitButtonHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control, btnKey) {
            var formID = control.ofFormID,
		        form = YIUI.FormStack.getForm(formID),
		        clickContent = control.clickContent;
		    var items = control.dropdownItems;
		    if(btnKey) {
		    	for (var i = 0, len = items.length; i < len; i++) {
		    		if(items[i].key == btnKey) {
		    			clickContent = items[i].formula;
		    			break;
		    		}
		    	}
		    }
		    var cxt = {form: form};
		    if (clickContent) {
		        form.eval(clickContent, cxt, null);
		    }
}
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.SearchBoxHandler = (function () {
    var Return = {

    	needRefresh: true,
    	
    	providerKey: null,
    	
    	getProviderKey: function(control) {
    		var metaObj = control.getMetaObj();
    		var providerKey = this.providerKey;
			if(providerKey){
				return providerKey;
			}
			
			var formulaKey = metaObj.formulaKey;
			if(formulaKey){
				var o = form.eval(formulaKey, this.cxt, null);
				if(o){
					return o.toString();
				}
			}
    	},
    	
    	setNeedRefresh: function(needRefresh) {
    		this.needRefresh = needRefresh;
    	},
    	
    	popSearchDialog: function(control, text) {
    		var callParas = {
				SearchContent: text
			};
    		var params = {
				formKey: control.popConfigKey, 
				cmd: "PureShowForm", 
				callParas: JSON.stringify(callParas)
    		};
            var success = function (jsonObj) {
            	var newForm = YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, control.ofFormID);
//            	newForm.setPara("SearchContent", text);
            	newForm.regEvent(YIUI.FormEvent.Close, {
        			doTask: function(form, paras) {
        				var o = form.getResult();
        				if(!o){
        					control.setValue(control.getValue(), true, false);
        				}else{
        					control.setValue(o, true, true);
        				}
        			}
            	});
            };
            Svr.SvrMgr.dealWithPureForm(params, success);
    	},
    	
    	doOnClick: function(control) {
    		var providerKey = this.providerKey;
    		if(!providerKey || bNeedRefresh){
				providerKey = this.getProviderKey(control);
				this.needRefresh = false;
			}
			this.popSearchDialog(control, "");
    	},
    		
        autoComplete: function (control, value) {
        	var providerKey = this.providerKey;
        	if(!providerKey || this.needRefresh){
				providerKey = this.getProviderKey(control);
				this.needRefresh = false;
			}
			var form = YIUI.FormStack.getForm(control.ofFormID);
        	var data = {
    			cmd: "Locate",
    			service: "SearchBoxProviderService",
    			formKey: form.getFormKey(),
    			value: value,
    			providerKey: providerKey
        	};
        	var ret = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
			if(ret){
				control.setValue(ret, true, true);
				return;
			}
			this.popSearchDialog(control, value);
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.TextAreaHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.TextEditorHandler = (function () {
    var TextCase = {
        CASETYPE_NONE: 0,
        CASETYPE_LOWER: 1,
        CASETYPE_UPPER: 2
    };
    var Return = {
        doEnterPress: function (control) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                keyEnter = control.keyEnter;
            var cxt = {form: form};
            if (keyEnter) {
                form.eval(keyEnter, cxt, null);
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();YIUI.ToolBarHandler = (function () {
    var Return = {
        /**
         * 控件的点击事件(单击)
         */
        doOnClick: function (control) {
            var formID = control.ofFormID;
            var item = control.item;
            if(item.formID) {
            	formID = item.formID;
            }
            var form = YIUI.FormStack.getForm(formID);
            var cxt = {form: form, optKey: item.key};
            var excpAction = item.excpAction;
            try {
            	var action = item.action;
                var preAction = item.preAction;
    			if (preAction) {
    				form.eval(preAction, cxt, null);
    			}

                if (action) {
                    form.eval(action, cxt, null);
                }
                var _form = YIUI.FormStack.getForm(control.ofFormID);
                if (_form != null && _form.getUIProcess())
                	_form.getUIProcess().resetUIStatus(YIUI.FormUIStatusMask.OPERATION);
                
			} catch (e) {
				if(excpAction) {
					try {
						form.eval(excpAction, cxt);
					} catch (t) {
					}
				}
				$.error(e.message);
			}
            
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.TreeHandler = (function () {
    var Return = {
		/**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
        	var nodeKey = control.nodeKey;
        	var parameters = control.parameters;
        	var formKey = control.formKey;
            var paras = {};
            paras.nodeKey = nodeKey;
            paras.eventType = Svr.SvrMgr.EventType.Click;
            paras.formKey = control.formKey;
            paras.entryParas = parameters;
            var jsonObj = Svr.SvrMgr.doPureTreeEvent(paras);
            if (!jsonObj) {
            	var li = $("#tab_" + formKey + "_" + nodeKey);
                li.click();
                return;
            }
            var form = YIUI.FormBuilder.build(jsonObj);
            form.entryKey = nodeKey;
            container.add(form);
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.DialogHandler = (function () {
    var Return = {
		doOnClick: function (control, opt) {
	        var callback = control.getEvent(opt);
	        var excp = control.excp;

	        control.dialog.close();
	        if(callback){
	        	try {	
		        	callback(opt);
				} catch (e) {
					if(excp) {
						try {
							var form = control.getOwner();
							form.eval(excp, {form: form});
						} catch (t) {
						}
					}
					$.error(e.message);
				}
	        }
	    }

    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.DictViewHandler = (function () {
    var Return = {
        /**
         * 表格行点击
         */
        doOnRowClick: function (control, rowIndex, extParas) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowClick = control.rowClick;

            var cxt = {form: form};
            if (rowClick) {
                form.eval(rowClick, cxt, null);
            }
        },

        /**
         * 表格行焦点变化
         */
        doOnFocusRowChange: function (dictView, node) {
        	var formID = dictView.ofFormID;
        	var form = YIUI.FormStack.getForm(formID);
        	var content = dictView.focusRowChanged;
        	var itemData = dictView.getNodeValue(node);
        	var item = YIUI.DictService.getItem(itemData.itemKey , itemData.oid);
        	dictView._selectItem = item;
        	
        	var cxt = {form: form};
        	if (content) {
                form.eval(content, cxt, null);
            }
        },

        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (control, rowIndex, extParas) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                clickContent = control.clickContent;
            if (control.type === YIUI.CONTROLTYPE.GRID) {
                rowIndex = control.getRowIndexByID(rowIndex);
                clickContent = control.rowDblClick === undefined ? "" : $.trim(control.rowDblClick);
            }
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },

        /**
         * 树的汇总节点展开
         */
        doExpand: function (dictView, pNode) {
		   	var success = function(nodes) {
				if (nodes) {
					var len = nodes.length;
					if(len > 0){
						var pId = pNode.attr('id') || 0;
						
						nodes[len -1].islast = true;
						
						var prevId = null;
						for(var i=0,len=nodes.length;i<len;i++) {
						    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
						    nodes[i].pid = pId;
						    if(dictView.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
								var path = pNode.attr("path");
								if(!path) {
									path = pId + "_" + nodes[i].OID;
								} else {
									path += "_" + nodes[i].OID;
								}
								nodes[i].path = path;
								nodes[i].id = path;
						    }
							if(prevId != null){
								nodes[i].previd = prevId;
							}
						    prevId = nodes[i].id;
						}
					
						dictView.addNodes(nodes);
					}
				}
			}
	    	
	    	YIUI.DictService.getDictChildren(dictView.itemKey, dictView.getNodeValue(pNode), dictView.dictFilter, null, success);
        },

        /**
         * 树的汇总节点收缩
         */
        doCollapse: function (control, extParas) {

        },

        /**
         * 按会车键所触发的事件
         */
        doEnterPress: function (control, extParas) {

        },

       	doGoToPage: function(dictView, index, isResetPageNum){
        	var itemKey = dictView.itemKey;
        	var maxRows = dictView.pageRowCount;
        	var pageIndicatorCount = dictView.pageIndicatorCount;
        	var value = dictView.getQueryValue();
        	
        	var startRow = index <= 0 ? 0 : dictView.pageRowCount * index; 
        		
        	var success = function(result) {
				if (result) {
					//清空数据
					dictView.isResetPageNum = isResetPageNum;
					$('tr:gt(1)',dictView._$table).remove()
					var nodes = result.data;
					var len = nodes.length;
					if(len > 0){
						var pId = dictView.root.id;
						
						nodes[len -1].islast = true;
						
						var prevId = null;
						for(var i=0,len=nodes.length;i<len;i++) {
							if(prevId != null){
								nodes[i].previd = prevId;
							}
						    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
						    prevId = nodes[i].id;
						    nodes[i].pid = pId;
						}
					
						dictView.addNodes(nodes);
						dictView.setTotalRowCount(startRow + result.totalRowCount);
						dictView.focusNode(nodes[0].id);
					} else {
						dictView.setTotalRowCount(len);
					}

				}
			}
			
        	YIUI.DictService.getQueryData(itemKey, startRow, maxRows, pageIndicatorCount, value, null, dictView.dictFilter, null, success);
		},
		
        doDictViewSearch: function (dictView) {
  
			this.doGoToPage(dictView, 0, true);
			/*
        	var itemKey = dictView.itemKey;
        	var maxRows = dictView.pageRowCount;
        	var pageIndicatorCount = dictView.pageIndicatorCount;
        	var value = dictView.getQueryValue();
        	
        	var success = function(result) {
				if (result) {
					dictView.isResetPageNum = true;
					//清空数据
					$('tr:gt(1)',dictView._$table).remove()
					var nodes = result.data;
					var len = nodes.length;
					if(len > 0){
						var pId = dictView.root.id;
						
						nodes[len -1].islast = true;
						
						var prevId = null;
						for(var i=0,len=nodes.length;i<len;i++) {
							if(prevId != null){
								nodes[i].previd = prevId;
							}
						    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
						    prevId = nodes[i].id;
						    nodes[i].pid = pId;
						}
					
						dictView.addNodes(nodes);
					}
					dictView.setTotalRowCount(result.totalRowCount);
				}
			}
			
        	YIUI.DictService.getQueryData(itemKey, 0, maxRows, pageIndicatorCount, value, null, null, null, success);
        	*/
        	
        },
        
        getDictFilter: function(dictview){
        	       // filter
            var filter = null;
            var dictFilter = null;
            
            var formID = dictview.ofFormID;

            var form = YIUI.FormStack.getForm(formID);
            var cxt = {form: form};
            
            if (dictview.itemFilters) {
                var itemFilter = dictview.itemFilters[dictview.itemKey];

                for (var i in itemFilter) {

                    var cond = itemFilter[i].cond;
                    if (cond && cond.length > 0) {
                        var ret = form.eval(cond, cxt, null);
                        if (ret == true) {
                            filter = itemFilter[i];
                            break;
                        }
                    } else {
                        filter = itemFilter[i];
                        break;
                    }
                }
            }
            //取 filter的值
            if (filter) {
                var filterVal
                var paras = [];
                for (var j in filter.filterVals) {
                    filterVal = filter.filterVals[j];


                    switch (filterVal.type) {
                        case YIUI.FILTERVALUETYPE.CONST:
                            //paras += content;
                            paras.push(filterVal.refVal);
                            break;
                        case YIUI.FILTERVALUETYPE.FORMULA:
                        case YIUI.FILTERVALUETYPE.FIELD:
                            var cxt = {form: form};
                            //paras += form.eval(content, cxt, null);

                            paras.push(form.eval(filterVal.refVal, cxt, null));
                            break;
                    }
                }

                var dictFilter = {};
                dictFilter.itemKey = dictview.itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.fieldKey = dictview.key;
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
               	//dictview.dictFilter = dictFilter;

            }
            
            return dictFilter;
        },
        
       	refreshNode : function(dictview , id) {
       		var index = id.lastIndexOf('_');
       		
			var itemKey = id.substring(0,index);
			var oid = id.substring(index+1);
			
			var item = YIUI.DictService.getItem(itemKey, oid);
			var $tr = $('#' + id, dictview._$table);

			if (item.nodeType == 1) {
				$tr.attr('haschild', true);
			}

			if (item.enable != undefined) {
				$tr.attr('enable', item.enable);
				$tr.removeClass('invalid').removeClass('disabled');
				switch (item.enable) {
					case -1 :
						$tr.addClass("invalid");
						break;
					case 0 :
						$tr.addClass("disabled");
						break;
					case 1 :
						// tr.addClass("invalid");
						break;
				}
			}

			var value;
			for (var j = 0, len = dictview.colModel.length; j < len; j++) {
				value = item.getValue(dictview.colModel[j].key);
				if (!value) {
					value = '';
				}
				var $td = $tr.children('td').eq(j);
				if($td.children().length > 0) {
					var child = $td.children();
					$td.empty();
					$td.append(child).append(value);
				} else {
					$td.html(value);
				}
			}
		}
    };
    Return = $.extend({},YIUI.Handler, Return);
    return Return;
})();
YIUI.FileChooserHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.MapDrawHandler = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();
YIUI.BaseBehavior = (function () {
    var Return = {
        checkAndSet: function (options, callback) {
        	var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	if(newVal instanceof Decimal) {
        		newVal = newVal.toString();
        	}
            if (oldVal == newVal) {
                return false;
            }
            if($.isFunction(callback)) {
            	callback(newVal);
            }
            return true;
        }
    };
    return Return;
})();
YIUI.ButtonBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.CheckBoxBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal == newVal) {
                return false;
            }
            var v = YIUI.TypeConvertor.toBoolean(newVal);
            if($.isFunction(callback)) {
            	callback(v);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.ComboBoxBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.DatePickerBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if(oldVal instanceof Date && $.isNumeric(newVal)){
                oldVal = oldVal.getTime();
            }
            if (oldVal == newVal) {
                return false;
            }
            
            var date;
            if (!(newVal == undefined || newVal == null || newVal.length == 0)) {
                if(newVal instanceof Date) {
                	date = newVal;
                } else {
                	if($.isNumeric(newVal)) {
                		newVal = parseFloat(newVal);
                	} else {
                		newVal = newVal.replace(/-/g, "/");
                	}
                	date = new Date(newVal);
                }
            }
            if($.isFunction(callback)) {
            	callback(date);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.DictBehavior = (function () {
    var Return = {
    	isEqual: function(v1, v2) {
    		var equal = true;
    		if($.isArray(v1) && $.isArray(v2)) {
    			if(v1.length != v2.length) {
    				equal = false;
    			} else {
    				for (var i = 0, len1 = v1.length; i < len1; i++) {
    					for (var j = 0, len2 = v2.length; j < len2; j++) {
    						if(v1[i].oid != v2[i].oid) {
    							equal = false;
    							break;
    						}
    					}
    				}
    			}
    		} else if(v1 && v2) {
    			equal = v1.oid == v2.oid;
    		} else {
    			equal = v1 == v2;
    		}
    		return equal;
    	},
		checkAndSet: function(options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	if(newVal instanceof Decimal) {
        		newVal = newVal.toString();
        	}
        	var equal = this.isEqual(oldVal, newVal);
            if (equal) {
                return false;
            }

            if (newVal == null || newVal == '') {
            	if($.isFunction(callback)) {
                	callback(null);
                }
				return true;
			}
			var text = "", opts;
            if(options.dictCaption == null){
                options.dictCaption = {};
            }
            if (options.multiSelect) {
            	//多选字典的处理
				var oids = [];
				if($.isString(newVal)) {
					oids = newVal.split(',');
                    var  longs = [], vals = [];
                    for(var j=0;j<oids.length;j++){
                    	var oid = parseFloat(oids[j]);
                        longs.push(oid);
                        if (oid != 0) {
                            var caption = options.dictCaption[options.itemKey + "_" + oid];
                            if (caption == null) {
                                caption = YIUI.DictService.getCaption(options.itemKey, oid);
                                options.dictCaption[options.itemKey + "_" + oid] = caption;
                            }
                        }
                        opts = {
    						oid : oid,
    						itemKey : options.itemKey,
    						caption : caption
    					};
                        var val = new YIUI.ItemData(opts);
                        vals.push(val);
                    }
                    newVal = vals;
				} else if($.isArray(newVal)) {
					for (var i = 0, len = newVal.length; i < len; i++) {
						var v = newVal[i];
						var oid = v.oid;
						if (oid != 0 && !v.caption) {
                            var caption = options.dictCaption[options.itemKey + "_" + oid];
                            if (caption == null) {
                                caption = YIUI.DictService.getCaption(options.itemKey, oid);
                                options.dictCaption[options.itemKey + "_" + oid] = caption;
                            }
                            v.caption = caption;
                        } else {
                        	break;
                        }
					}
				}
			} else {
				if (oldVal && newVal) {
					if ((oldVal.itemKey + '_' + oldVal.oid) == (newVal.itemKey
							+ '_' + newVal.oid)) {
						return false;
					}
				}
				if ($.isNumeric(newVal)) {
                    if (parseFloat(newVal) != 0) {
                        text = options.dictCaption[options.itemKey + "_" + parseFloat(newVal)];
                        if (text == null) {
                            text = YIUI.DictService.getCaption(options.itemKey, parseFloat(newVal));
                            options.dictCaption[options.itemKey + "_" + oid] = text;
                        }
                    }
					opts = {
						oid : newVal,
						itemKey : options.itemKey,
						caption : text
					};
					newVal = new YIUI.ItemData(opts);
				} else if (newVal) {
					if(newVal.oid == "0") {
//						newVal = null;
					}else if(newVal.caption == null || newVal.caption == ""){
                        text = options.dictCaption[options.itemKey + "_" + parseFloat(newVal.oid)];
                        if (text == null) {
                            text = YIUI.DictService.getCaption(options.itemKey, parseFloat(newVal.oid));
                            options.dictCaption[options.itemKey + "_" +  parseFloat(newVal.oid)] = text;
                        }
                        newVal.caption = text;
                    }
				}
			}

            if($.isFunction(callback)) {
            	callback(newVal);
            }
            return true;
		}
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.GridBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.HyperLinkBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.ImageBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.ListViewBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.NumberEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	var decScale = options.decScale;
        	var roundingMode = options.roundingMode || YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP;
            
            var d = null, v = 0, caption='';
    		if (newVal != null) {
    			d = YIUI.TypeConvertor.toDecimal(newVal);
    			v = d.toFormat(decScale, roundingMode);

                var settings = {
                    aSep: options.useSep ? options.sep : '',
                    //四舍五入方式
                    mRound: roundingMode,
                    //组大小
                    dGroup: options.groupingSize,
                    //小数点符号
                    aDec: options.decSep,
                    //小数位数
                    mDec: decScale
                };

                caption = YIUI.DecimalFormat.format(v, settings);
                newVal = new Decimal(v);
    		}else{
                newVal = new Decimal(0);
            }

            oldVal = YIUI.TypeConvertor.toDecimal(oldVal);

            var isChange = !oldVal.eq(newVal);

            if(isChange && $.isFunction(callback)) {
            	callback(newVal,caption);
            }
            
            return isChange;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.RadioButtonBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.SplitButtonBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.SearchBoxBehavior = (function () {
    var Return = {};
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.TextAreaBehavior = (function () {
    var Return = {};
    
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal == newVal) {
                return false;
            }
            var maxLength = options.maxLength;
            var settings = {maxLength: options.maxLength};
            var strV = YIUI.TextFormat.format(newVal, settings);
            var isChange = (oldVal !== strV);
            if($.isFunction(callback)) {
            	callback(strV);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.TextEditorBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal === newVal) {
                return false;
            }
            var trim = options.trim;
            var textCase = options.textCase;
            var maxLength = options.maxLength;
            var invalidChars = options.invalidChars;
            
            var settings = {
                trim: options.trim,
                textCase: options.textCase,
                maxLength: options.maxLength,
                invalidChars: options.invalidChars
            };
            var strV = YIUI.TextFormat.format(newVal, settings);
            
            var isChange = (oldVal !== strV);
            
            if($.isFunction(callback)) {
            	callback(strV);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.UTCDatePickerBehavior = (function () {
    var Return = {
		checkAndSet: function (options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
            if (oldVal == newVal) {
                return false;
            }
            var text = YIUI.UTCDateFormat.format(newVal);
            if($.isFunction(callback)) {
            	callback(text);
            }
            return true;
        }
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
YIUI.DateFormat = (function () {
    var Return = {
    	//日期 formatStr、onlyDate
    	format: function(date, settings) {
			var def = {
			    formatStr: "yyyy-MM-dd HH:mm:ss",
			    isOnlyDate : false
			};
			settings = $.extend(def, settings);
    		var formatStr = settings.formatStr;
    		var onlyDate = settings.isOnlyDate;
    		if(onlyDate) {
    			formatStr = formatStr.split(" ")[0];
    		}
    		var text = "";
    		if(date) {
    			text = date.Format(formatStr);
    		}
    		return text;
    	}
    };
    return Return;
})();YIUI.DecimalFormat = (function() {
	var Return = {
		checkEmpty: function(iv, settings, signOnEmpty) {
	        if (iv === '' || iv === settings.aNeg) {
	            // if(settings.vEmpty==='zero'){
	            // return iv +'0';
	            // }
	            // if(settings.vEmpty === 'sign' || signOnEmpty){
	            // return iv + settings.aSign;
	            //      }
	            return iv;
	        }
	        return null;
	
	    },

	    /*var settings = {
	     //组分割符
	     aSep : ',',
	     //组大小
	     dGroup : '3',
	     //小数点符号
	     aDec : '.',
	     //前缀或后缀符号
	     aSign : '',
	     //p是前缀 s是后缀
	     pSign : '',
	     //小数位数
	     mDec : '2'
	     };*/
		format: function(iv, settings){
			var def = {
				//组分割符
			    aSep : ',',
			    //组大小
			    dGroup : '3',
			    //小数点符号
			    aDec : '.',
			    //前缀或后缀符号
			    aSign : '',
			    //p是前缀 s是后缀
			    pSign : '',
			    //小数位数
			    mDec : '2'
			};
			settings = $.extend(def, settings);
			iv = YIUI.TypeConvertor.toString(iv);
	        var empty = this.checkEmpty(iv, settings, true);
	
	        if (empty !== null) {
	            return empty;
	        }
	
	        var digitalGroup = '';
	        if (settings.dGroup === 2) {
	            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
	        } else if (settings.dGroup === 4) {
	            digitalGroup = /(\d)((\d{4}?)+)$/;
	        } else {
	            digitalGroup = /(\d)((\d{3}?)+)$/;
	        }
	
	        var ivSplit = iv.split(settings.aDec);
	
	        var s = ivSplit[0];
	
	        if (settings.aSep) {
	            while (digitalGroup.test(s)) {
	                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
	            }
	        }
	
	        if (settings.mDec !== 0) {
	        	//若iv为整数，需要显示为小数格式
	        	if(ivSplit.length == 1) {
	        		ivSplit[1] = "000000000";
	        	}
	            if (ivSplit[1].length > settings.mDec) {
	                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
	            }
	
	            iv = s + settings.aDec + ivSplit[1];
	        } else {
	            iv = s;
	        }
	
	        if (settings.aSign) {
	            iv = settings.pSign === 'p' ? settings.aSign + iv : iv
	                + settings.aSign;
	        }
	
	        return iv;
	    }
    };
    return Return;
})();
YIUI.UTCDateFormat = (function () {
    var Return = {
		//返回值为long，如"20160701"
    	format: function(value, settings) {
    		var def = {
			    formatStr: "yyyy-MM-dd HH:mm:ss",
			    isOnlyDate : true
			};
			settings = $.extend(def, settings);
    		var text;
            if (!(value == undefined || value == null || value.length == 0)) {
                if(value instanceof Date) {
                    text = value.Format(settings.formatStr) || "";
            		text = text.replace(/(\W+)/g, "");
                } else {
                	if($.isNumeric(value)) {
                		text = parseFloat(value);
                	} else {
                		text = value.replace(/(\W+)/g, "");
                	}
                }
            }
            return text;
    	},

    	//将"20160701"格式转为"2016-07-01"格式
	    formatCaption: function(d, onlyDate, check) {
	    	if(onlyDate) {
				var yyyy = parseInt(d / 10000);
				var i = d % 10000;
				var MM = parseInt(i / 100);
				i = i % 100;
				var dd = i;
				if(check && !this.check(yyyy, MM, dd, 00, 00, 00)){
					throw new RuntimeException("错误的时间："+d);
				}
				if(MM < 10) {
					MM = "0" + MM;
				} 
				if(dd < 10) {
					dd = "0" + dd;
				}
				text = yyyy + "-" + MM + "-" + dd;
			} else {
				//yyyyMMddHHmmss
				var yyyy = parseInt(d / 10000000000);
				var i = d % 10000000000;
				var MM = parseInt(i / 100000000);
				i = i % 100000000;
				var dd = parseInt(i / 1000000);
				i = i % 1000000;
				var HH = parseInt(i / 10000);
				i = i % 10000;
				var mm = parseInt(i / 100);
				i = i % 100;
				var ss = i;
				if(check && !this.check(yyyy, MM, dd, HH, mm, ss)){
					throw new RuntimeException("错误的时间："+d);
				}
				if(MM < 10) {
					MM = "0" + MM;
				} 
				if(dd < 10) {
					dd = "0" + dd;
				}
				if(HH < 10) {
					HH = "0" + HH;
				} 
				if(mm < 10) {
					mm = "0" + mm;
				}
				if(ss < 10) {
					ss = "0" + ss;
				}
				text = yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
			}
	    	return text;
	    },
	    
	    check: function(yyyy, MM, dd, HH, mm, ss) {
	    	if(yyyy > 9999){
				return false;
			}
			if(MM > 12){
				return false;
			}
			var days = 30;
			switch(MM){
				case 2:
					if((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0){
						days = 29;
					}else{
						days = 28;
					}
					break;
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					days = 31;
					break;
			}
			if(dd > days){
				return false;
			}
			if(HH > 23){
				return false;
			}
			if(mm > 59 || ss > 59){
				return false;
			}
			return true;
	    }
    };
    return Return;
})();YIUI.TextFormat = (function () {
	var TextCase = {
        CASETYPE_NONE: 0,
        CASETYPE_LOWER: 1,
        CASETYPE_UPPER: 2
    };
    var Return = {
		//字符串   最大长度maxLength、不允许输入值InvalidChars、大小写Case、去除首尾空格Trim
		format: function(value, settings) {
			var def = {
			    /**
			     * Number。
			     * 允许输入的最大长度。
			     */
			    maxLength: Number.MAX_VALUE,

			    /**
			     * Number。
			     * 输入字符大小写。
			     */
			    textCase: YIUI.TEXTEDITOR_CASE.DEFAULT,

			    /**
			     * String。
			     * 不允许输入的字符集合。
			     */
			    invalidChars: null,

			    /**
			     * Boolean。
			     * 是否去除首尾多余空格。
			     */
			    trim: true

			};
			settings = $.extend(def, settings);
    		var trim = settings.trim;
            var textCase = settings.textCase;
            var maxLength = settings.maxLength;
            var invalidChars = settings.invalidChars;
            var strV = "";
            if (value !== undefined && value !== null) {
                strV = value.toString();
                switch (textCase) {
	                case TextCase.CASETYPE_LOWER:
	                    strV = strV.toLowerCase();
	                    break;
	                case TextCase.CASETYPE_UPPER:
	                    strV = strV.toUpperCase();
	                    break;
	            }
                if (invalidChars !== undefined && invalidChars !== null && invalidChars !== "") {
                    var tStr = "";
                    for (var i = 0; i < strV.length; i++) {
                        if (invalidChars.indexOf(strV.charAt(i)) >= 0) continue;
                        tStr += strV.charAt(i);
                    }
                    strV = tStr;
                }
                if (maxLength >= 0 && maxLength < strV.length) {
                    strV = strV.substring(0, maxLength);
                }
                if (trim) {
                    strV = $.trim(strV);
                }
            }
            return strV;
    	}
    };
    return Return;
})();YIUI.EventHandler = (function () {
    var Return = {

        /**
         * 菜单树的点击事件
         */
        doTreeClick: function (control, container) {
            var path = control.path;
        	var target = control.target;
        	var node = $("[path='"+path+"']");
            var enable = node.attr("enable");
            if( enable !== undefined && !YIUI.TypeConvertor.toBoolean(enable) )
                return;
        	if (node.length > 0) {
        		var single = YIUI.TypeConvertor.toBoolean(node.attr("single"));
        		if(single) {
                    var formKey = node.attr("formKey");
                    var paras = node.attr("paras");
                	var li = $("[formKey='"+formKey+"'][paras='"+paras+"']", container.el);
                	if(li.length > 0) {
                		li.click();
                		return;
                	}
        		}
        	}

            var data = {};
            data.path = path;
            data.async = true;
            var success = function(jsonObj) {
            	var pFormID;
            	var form = YIUI.FormBuilder.build(jsonObj, target);
                form.entryPath = path;
                form.entryParas = paras;
                if(form.target != YIUI.FormTarget.MODAL) {
                	container.build(form);
                	pFormID = form.formID;
                }
                if(form.getOperationState() == YIUI.Form_OperationState.New) {
                	form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                    form.getUIProcess().checkAll();
                    form.initFirstFocus();
                }
                if(form.postShow) {
                	form.eval(form.postShow, {form: form});
                }
            };
            Svr.SvrMgr.doPureTreeEvent(data, success);
            
        },

        doCloseForm: function (control) {
            var formID = control.ofFormID;
            var form = YIUI.FormStack.getForm(formID);
            form.fireClose();
        }

    };
    return Return;
})();
var FilterMap = FilterMap || {};

(function () {

    FilterMap = function (jsonObj) {
        var Return = {
            type: jsonObj["type"] || YIUI.DocumentType.DATAOBJECT,
            OID: jsonObj["OID"] || -1,
            needDocInfo: jsonObj["needDocInfo"] || true,
            filterMap: jsonObj["filterMap"] || new Array(),
            setOID: function (OID) {
                this.OID = OID;
            },
            getOID: function () {
                return this.OID;
            },
            setType: function (type) {
                this.type = type;
            },
            getType: function () {
                return this.type;
            },
            setNeedDocInfo: function (needDocInfo) {
                this.needDocInfo = needDocInfo;
            },
            isNeedDocInfo: function () {
                return this.needDocInfo;
            },
            setFilterMap: function (filterMap) {
                this.filterMap = filterMap;
            },
            getFilterMap: function () {
                return this.filterMap;
            },
            addTblDetail: function (tblDetail) {
                this.filterMap.push(tblDetail);
            },
            setStartRow: function (tableKey, row) {
//				this.getTblFilter(tableKey).setStartRow(row);
                this.getTblFilter(tableKey).startRow = row;
            },
            setMaxRows: function (tableKey, max) {
//				this.getTblFilter(tableKey).setMaxRows(max);
                this.getTblFilter(tableKey).maxRows = max;
            },
            getTblFilter: function (tableKey) {
                var tbl = this.get(tableKey);
                if (tbl == null) {
                    tbl = new TableFilterDetail();
                    tbl.setTableKey(tableKey);
                    this.addTblDetail(tbl);
                }
                return tbl;
            },
            get: function (tableKey) {
                var maps = this.filterMap, map;
                for (var i = 0, len = maps.length; i < len; i++) {
                    map = maps[i];
                    if (map.tableKey == tableKey) {
                        return map;
                    }
                }
                return null;
            }
        };
        return Return;
    };

    TableFilterDetail = function () {
        var Return = {
            tableKey: "",
            filter: "",
            startRow: 0,
            maxRows: 0,
            OID: -1,
            fieldValues: null,
            paraValues: null,
            SourceKey: "",
            setTableKey: function (tableKey) {
                this.tableKey = tableKey;
            },
            setFilter: function (filter) {
                this.filter = filter;
            },
            setStarRow: function (startRow) {
                this.startRow = startRow;
            },
            setMaxRows: function (maxRows) {
                this.maxRows = maxRows;
            },
            setFieldValues: function (fieldValues) {
                this.fieldValues = fieldValues;
            },
            setParaValues: function (paraValues) {
                this.paraValues = paraValues;
            },
            setSourceKey: function (sourceKey) {
                this.SourceKey = sourceKey;
            }
        };
        return Return;
    };


})();
(function () {
    YIUI.UICheckOpt = function (form) {
        var Return = {
    		showError: function (errorMsg, type) {
            	if(type == YIUI.Dialog_Type.WARN) {
					errorMsg = errorMsg.replace("Uncaught Error: ", "");
					var dialog = $("<div></div>").attr("id", "warn_dialog");
		            dialog.modalDialog(errorMsg, {title: "警告", showClose: true, type: YIUI.Dialog_Type.WARN, height: 200, width: 400});
				} else {
	            	$.error(errorMsg);
				}
            },
            doOpt: function () {
                var self = this, result = true;
                if (form.errorInfo.error) {
                    this.showError("表单(" + form.formKey + " " + form.formCaption + "):" + form.errorInfo.errorMsg);
                    return false;
                }
                for (var i in form.getComponentList()) {
                    var er, ec, isBreak = false, comp = form.getComponentList()[i], rd;
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        for (var m = 0; m < comp.errorInfoes.rows.length; m++) {
                            er = comp.errorInfoes.rows[m];
                            rd = comp.dataModel.data[er.rowIndex];
                            if (rd == null || (rd.bookmark === undefined && rd.isDetail)) continue;
                            self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (er.rowIndex + 1) + "行:" + er.errorMsg);
                            result = false;
                            isBreak = true;
                            break;
                        }
                        if (isBreak) break;
                        for (var n = 0; n < comp.errorInfoes.cells.length; n++) {
                            ec = comp.errorInfoes.cells[n];
                            rd = comp.dataModel.data[ec.rowIndex];
                            if (rd == null || (rd.bookmark === undefined && rd.isDetail)) continue;
                            self.showError("表格(" + comp.key + " " + comp.caption + ")第" + (ec.rowIndex + 1)
                                + "行,第" + (ec.colIndex + (comp.showRowHead ? 1 : 0)) + "列:" + ec.errorMsg);
                            result = false;
                            isBreak = true;
                            break;
                        }
                        if (isBreak) break;
                        for (var ri = 0, rlen = comp.getRowCount(); ri < rlen; ri++) {
                            var rowData = comp.getRowDataAt(ri);
                            if (rowData == null || (rowData.isDetail && rowData.bookmark == null)) continue;
                            for (var ci = 0, clen = comp.getColumnCount(); ci < clen; ci++) {
                                var cellData = comp.getCellDataAt(ri, ci), cm = comp.dataModel.colModel.columns[ci];
                                if (cellData[3]) {
                                    self.showError("表格(" + comp.key + " " + comp.caption + ")\n第" + (ri + 1)
                                        + "行,第" + (ci + (comp.showRowHead ? 1 : 0)) + "列:" + cm.label + "为必填项");
                                    result = false;
                                    isBreak = true;
                                    break;
                                }
                            }
                        }
                        if (isBreak) break;
                    } else {
                        if (!((comp.errorInfo && comp.errorInfo.error) || comp.isRequired())) continue;
                        var parentGridKey = comp.getMetaObj().parentGridKey;
                        if (comp.getMetaObj().isSubDetail && parentGridKey != null && parentGridKey != "") {
                            var grid = form.getComponent(parentGridKey);
                            if (grid == null || grid.getFocusRowIndex() == -1) continue;
                            var pRowData = grid.getRowDataAt(grid.getFocusRowIndex());
                            if (pRowData.isDetail && pRowData.bookmark == null)   continue;
                        }
                        if (comp.errorInfo && comp.errorInfo.error) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + "):" + comp.errorInfo.msg);
                            result = false;
                            break;
                        } else if (comp.isRequired()) {
                            self.showError("表单控件(" + comp.key + " " + comp.caption + ")是必填项，当前未填值。");
                            result = false;
                            break;
                        }
                    }
                }
                return result;
            }
        };
        return Return;
    };
    YIUI.EditOpt = function (form) {
        var Return = {
            doOpt: function () {
                //设置初始操作状态，主要用于判断数据对象是如何生成的
                form.setInitOperationState(YIUI.Form_OperationState.Edit);
                //设置操作状态
                form.setOperationState(YIUI.Form_OperationState.Edit);
                //重置界面状态
                form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE
                    | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                //获取计算表达式处理类
//                form.getUIProcess().checkAll(); //TODO 目前屏蔽状态转换后的检查，之后再进行处理
                //在表单进入编辑状态的时候为orderIndex为1的首个组件设定焦点
                form.initFirstFocus();
            }
        };
        return Return;
    };

    YIUI.SaveOpt = function (form) {
        var Return = {
            doOpt: function () {
                // 将表单置为默认操作状态
                form.setOperationState(YIUI.Form_OperationState.Default);

                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetOptScript";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.SAVE;
                var formula = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                form.eval(formula, {form: form}, null);
            }
        };
        return Return;
    };


    YIUI.LoadOpt = function (form) {
        var Return = {
            doOpt: function () {
                form.setOperationState(YIUI.Form_OperationState.Default);
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetOptScript";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var formula = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                form.eval(formula, {form: form}, null);
            }
        };
        return Return;
    };

    YIUI.NewOpt = function (form, refreshUI) {
        var Return = {
            doOpt: function () {
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetNewDocument";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var document = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

                form.setDocument(document);
                
                form.setInitOperationState(YIUI.Form_OperationState.New);
                form.setOperationState(YIUI.Form_OperationState.New);

                if (refreshUI) {
                    form.showDocument();
                    form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
                }
            }
        };
        return Return;
    };

    YIUI.CopyNewOpt = function (form) {
        var Return = {
            doOpt: function () {
                var paras = {};
                paras.service = "PureOpt";
                paras.cmd = "GetNewCopyDocument";
                paras.formKey = form.formKey;
                paras.type = YIUI.OptScript.LOAD;
                var docStr = YIUI.DataUtil.toJSONDoc(form.getDocument());
                paras.document = $.toJSON(docStr);
                var document = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
                if (document) {
                    form.setDocument(document);
                }
                form.setInitOperationState(YIUI.Form_OperationState.New);
                form.setOperationState(YIUI.Form_OperationState.New);
                form.showDocument();
                form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
            }
        };
        return Return;
    };
})();
(function () {
    YIUI.ShowData = function (form) {
        var Return = {
            resetDocument: function () {
                var document = form.getDocument();
                if (document == null) {
                    return;
                }
                var table = null;
                for (var i = 0, len = document.tbls.length; i < len; i++) {
                    table = document.tbls[i];
                    table.first();
                }
            },
            loadHeader: function (cmp) {
                var document = form.getDocument();
                var tableKey = cmp.getMetaObj().tableKey;
                var table = tableKey && document.getByKey(tableKey);
                if (!table) {
                    return;
                }
                var columnKey = cmp.getMetaObj().columnKey, value = "";
                if (table.getRowCount() > 0) {
                    value = table.getByKey(columnKey);
                    if (cmp.type == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        var itemKey = table.getByKey(columnKey + "ItemKey");
                        cmp.itemKey = itemKey;
                    }
                }
                cmp.setValue(value);
            },
            loadListView: function (listView) {
                var showLV = new YIUI.ShowListView(form, listView);
                showLV.load();
            },
            loadGrid: function (grid) {
                var showGrid = new YIUI.ShowGridData(form, grid);
                showGrid.load();
            },
            show: function () {
                this.resetDocument();
                var cmpList = form.getComponentList(), cmp;
                for (var i in cmpList) {
                    cmp = cmpList[i];
                    if (cmp.getMetaObj().isSubDetail) continue;
                    switch (cmp.type) {
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.loadListView(cmp);
                            break;
                        case YIUI.CONTROLTYPE.GRID:
                            cmp.rootGroupBkmk = null;
                            this.loadGrid(cmp);
                            break;
                        case YIUI.CONTROLTYPE.CHART:
                            break;
                        default:
                            if (cmp instanceof YIUI.Control) {
                                if (cmp.needClean() && !cmp.condition) {
                                    cmp.setValue(null, false, false);
                                }
                                this.loadHeader(cmp);
                            }
                            break;
                    }
                }
                this.postShowData();
            },
            postShowData: function () {
                form.getUIProcess().doPostShowData(false);
                form.getUIProcess().calcToolBar();
                form.initFirstFocus();
            }
        };
        return Return;
    };
    YIUI.ShowListView = function (form, listView) {
        var Return = {
            load: function () {
                listView.clearAllRows();
                var document = form.getDocument();
                var tableKey = listView.getMetaObj().tableKey;
                if (!tableKey) return;
                var table = document.getByKey(tableKey);
                if (!table) return;
                listView.totalRowCount = table.allRows.length;
                var rows = [], row, col , colKey;
                for (var j = 0, length = table.getRowCount(); j < length; j++) {
                    row = {};
                    table.setPos(j);
                    for (var m = 0, length3 = listView.columnInfo.length; m < length3; m++) {
                        var column = listView.columnInfo[m];
                        var key = column.key;
                        row[key] = {};

                        var colKey = listView.columnInfo[m].columnKey;
                        //row[colKey].caption;
                        if (colKey) {
                            var caption = "", value = table.getByKey(colKey);
                            switch (column.columnType) {
                                case YIUI.CONTROLTYPE.DATEPICKER:
                                    if (value) {
                                        var date = new Date(parseInt(value));
                                        var format = "yyyy-MM-dd";
                                        if (!column.onlyDate) {
                                            format = "yyyy-MM-dd HH:mm:ss";
                                        }
                                        caption = date.Format(format);
                                        value = date.toString();
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.DICT:
                                    var itemKey = column.itemKey;
                                    var oid = YIUI.TypeConvertor.toInt(value);
                                    caption = YIUI.DictService.getCaption(itemKey, oid);
                                    break;
                                case YIUI.CONTROLTYPE.COMBOBOX:
                                    var items = column.items;
                                    for (var i = 0, len = items.length, item; i < len; i++) {
                                        var item = items[i];
                                        if (item.value == value) {
                                            caption = item.caption;
                                            break;
                                        }
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                                    var decScale = column.decScale;
                                    var roundingMode = column.roundingMode;
                                    var d = null;
                                    if (value) {
                                        d = YIUI.TypeConvertor.toDecimal(value);
                                        caption = d.toFormat(decScale, roundingMode);
                                    }
                                    break;
                                default:
                                    caption = table.getByKey(colKey);
                                    break;
                            }
                            row[key].caption = caption;
                            row[key].value = value;
                        } else {
                            row[key].caption = column.caption;
                            row[key].value = column.caption;
                        }
                    }
                    rows.push(row);
                }
                if (!listView.getMetaObj().pageRowCount || listView.totalRowCount < listView.getMetaObj().pageRowCount) {
                    listView._pagination.hidePagination();
                } else if (listView.totalRowCount) {
                    listView._pagination.setTotalRowCount(listView.totalRowCount, true);
                }
                listView.data = rows;
                listView.addDataRow(rows);
                listView.addEmptyRow();
            }
        };
        return Return;
    };
//    YIUI.ShowGridData = function (form, grid) {
//        var Return = {
//            dealGridGroupRow: function () {
//
//            },
//            load: function () {
//                grid.clearGridData();
//                var document = form.getDocument();
//                var tableKey = grid.tableKey;
//                var addFixRow = function (metaFixRow, metaRowIndex) {
//                    var rowData = {};
//                    rowData.isDetail = false;
//                    rowData.isEditable = true;
//                    rowData.rowHeight = metaFixRow.rowHeight;
//                    rowData.rowID = grid.randID();
//                    rowData.metaRowIndex = metaRowIndex;
//                    rowData.rowType = metaFixRow.rowType;
//                    rowData.cellKeys = metaFixRow.cellKeys;
//                    rowData.data = [];
//                    rowData.cellBkmks = [];
//                    for (var ci = 0, clen = metaFixRow.cells.length; ci < clen; ci++) {
//                        var cellObj = metaFixRow.cells[ci];
//                        rowData.data[ci] = ["", cellObj.caption, false];
//                    }
//                    grid.dataModel.data.push(rowData);
//                    return rowData;
//                };
//                if (tableKey) {
//                    var table = document.getByKey(tableKey), beginIndex = 0, endIndex = table.getRowCount(), newRd,
//                        rootGroupBkmkArray = grid.rootGroupBkmk;
//                    if (rootGroupBkmkArray == null || rootGroupBkmkArray.length == 0) {
//                        rootGroupBkmkArray = [];
//                        table.beforeFirst();
//                        while (table.next()) {
//                            if (table.rows[table.pos].state != DataDef.R_Deleted) {
//                                rootGroupBkmkArray.push(table.getBkmk());
//                            }
//                        }
//                    }
//                    if (table) {
//                        if (grid.getPageInfo().pageLoadType == "UI") {
//                            beginIndex = (grid.getPageInfo().currentPage - 1) * grid.getPageInfo().pageRowCount;
//                            endIndex = grid.getPageInfo().currentPage * grid.getPageInfo().pageRowCount;
//                            if (endIndex > rootGroupBkmkArray.length) {
//                                endIndex = rootGroupBkmkArray.length;
//                            }
//                            grid.getPageInfo().totalRowCount = table.rows.length;
//                            grid.getPageInfo().totalPage = Math.ceil(table.rows.length/grid.getPageInfo().pageRowCount);
//                        }
//                        for (var index = 0, len = grid.metaRowInfo.rows.length; index < len; index++) {
//                            var metaRow = grid.metaRowInfo.rows[index];
//                            if (metaRow.rowType == "Fix" || metaRow.rowType == "Total") {
//                                var fixRow = addFixRow(metaRow, index);
//                                grid.el[0].insertGridRow(grid.getRowCount() - 1, fixRow);
//                            } else if (metaRow.rowType == "Group") {
//                                var fixRow = addFixRow(metaRow, index);
//                                grid.el[0].insertGridRow(grid.getRowCount() - 1, fixRow);
//                            } else if (metaRow.rowType == "Detail") {
//                                for (var i = beginIndex; i < endIndex; i++) {
//                                    newRd = grid.addGridRow(null, -1, false);
//                                    newRd.bookmark = rootGroupBkmkArray[i];
//                                    var rowIndex = grid.getRowIndexByID(newRd.rowID);
//                                    grid.showDetailRow(rowIndex, false);
//                                }
//                            }
//                        }
//                        grid.gridHandler.dealWithSequence(form, grid);
//                        grid.setGridEnable(grid.isEnable());
//                    }
//                }
//            }
//        };
//        return Return;
//    };
})();(function () {
    YIUI.DefaultStatusProxy = YIUI.extend({
        form: null,
        init: function (form) {
            this.form = form;
        },
        validateEnable: function (key, content, context, formEnable) {
            var result = false;
            if (content != null && content.length > 0) {
                result = YIUI.TypeConvertor.toBoolean(this.form.eval(content, context, null));
            } else {
                result = formEnable;
            }
            return this.checkAccessControl(context, key) ? result : false;
        },
        validateEnableByTree: function (key, syntaxTree, context, formEnable) {
            var result = false;
            if (syntaxTree != null) {
                result = YIUI.TypeConvertor.toBoolean(this.form.evalByTree(syntaxTree, context, null));
            } else {
                result = formEnable;
            }
            return this.checkAccessControl(context, key) ? result : false;
        },
        validateVisible: function (key, content, context) {
            if (content != null && content.length > 0) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(content, context, null));
            }
            return true;
        },
        validateVisibleByTree: function (key, syntaxTree, context) {
            if (syntaxTree != null) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(syntaxTree, context, null));
            }
            return true;
        },
        checkAccessControl: function (context, key) {
            var cellLocation = this.form.getCellLocation(key),
                metaComp = this.form.getComponent(key),
                result = true, dataTable, value;
            if (cellLocation != null && context != null) {
                var grid = this.form.getComponent(cellLocation.key),
                    metaCell = grid.getMetaCellByKey(key);
                if (metaCell != null && this.accessControl(this.form, metaCell)) {
                    if (cellLocation.row != null && cellLocation.row != -1) {
                        dataTable = this.form.getDocument().getByKey(metaCell.tableKey);
                        value = 0;
                        if (dataTable.first()) {
                            value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaCell.columnKey + "_CF"));
                        }
                        if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                            result = false;
                        }
                    } else if (context.rowIndex != null && context.rowIndex != -1) {
                        dataTable = this.form.getDocument().getByKey(grid.tableKey);
                        var rowData = grid.getRowDataAt(context.rowIndex);
                        if (rowData.isDetail && rowData.bookmark != null) {
                            if (grid.hasColExpand) {
                                var rowBkmk = rowData.bookmark[0];
                                dataTable.setByBkmk(rowBkmk);
                            } else {
                                dataTable.setByBkmk(rowData.bookmark);
                            }
                            value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaCell.columnKey + "_CF"));
                            if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                                result = false;
                            }
                        }
                    }
                }
            } else if (metaComp != null) {
                if (this.accessControlByComp(this.form, metaComp)) {
                    dataTable = this.form.getDocument().getByKey(metaComp.tableKey);
                    value = 0;
                    if (dataTable.first()) {
                        value = YIUI.TypeConvertor.toInt(dataTable.getByKey(metaComp.columnKey + "_CF"));
                    }
                    if ((value & YIUI.FormUIStatusMask.ENABLE) != 0) {
                        result = false;
                    }
                }
            }
            return result;
        },
        accessControl: function (form, metaCell) {
            if(metaCell && metaCell.tableKey && metaCell.columnKey){
                var doc = form.getDocument();
                if(doc){
                    var dataTable = doc.getByKey(metaCell.tableKey);
                    if (dataTable == null)
                        return false;
                    var cellKey = metaCell.columnKey;
                    if (cellKey == null || cellKey.length == 0)
                        return false;
                    return dataTable.getColByKey(cellKey).getAccessControl();
                }
            }
            return false;
        },
        accessControlByComp: function (form, comp) {
            if(comp && comp.tableKey && comp.columnKey){
                var doc = form.getDocument();
                if(doc){
                    var dataTable = doc.getByKey(comp.tableKey);
                    if (dataTable == null)
                        return false;
                    var cellKey = comp.columnKey;
                    if (cellKey == null || cellKey.length == 0)
                        return false;
                    return dataTable.getColByKey(cellKey).getAccessControl();
                }
            }
            return false;
        }
    });
    YIUI.HostStatusProxy = YIUI.extend({
        info: null,
        init: function (info) {
            this.info = info;
        },
        containsEnableKey: function (key) {
            var enableList = this.info["enableList"];
            return enableList ? $.inArray(key, enableList) != -1 : false;
        },
        containsUnVisibleKey: function (key) {
            var unVisibleList = this.info["visibleList"];
            return unVisibleList ? $.inArray(key, unVisibleList) != -1 : false;
        },
        containsOperationKey: function (key) {
            var optList = this.info["optList"];
            return optList ? $.inArray(key, optList) != -1 : false;
        }
    });
})();(function () {
    YIUI.UIProcess = function (form) {
        this.form = form;
        this.enableProcess = new YIUI.UIEnableProcess(form);
        this.visibleProcess = new YIUI.UIVisibleProcess(form);
        this.calcProcess = new YIUI.UICalcProcess(form);
        this.checkRuleProcess = new YIUI.UICheckRuleProcess(form);
        this.dependencyProcess = new YIUI.UIDependencyProcess(form);
        this.checkAll = function () {
            this.checkRuleProcess.checkAll();
        };
        this.resetUIStatus = function (mask) {
            var calcEnable = (mask & YIUI.FormUIStatusMask.ENABLE) != 0;
            var calcVisible = (mask & YIUI.FormUIStatusMask.VISIBLE) != 0;
            var addOperation = (mask & YIUI.FormUIStatusMask.OPERATION) != 0;
            if (calcEnable) {
                this.enableProcess.calcAll();
            }
            if (calcVisible) {
                this.visibleProcess.calcAll();
            }
            if (addOperation) {
                this.calcToolBar();
            }
        };
        this.calcToolBar = function () {
            var tblKey = form.defTbr,
                tbl = form.getComponent(tblKey);
            if (tbl && !tbl.isDestroyed) {
                var map = {};
                for (var i = 0, len = tbl.items.length; i < len; i++) {
                    var item = tbl.items[i];
                    var visible, enable;
                    var f = form;
                    if (item.formID) {
                        f = YIUI.FormStack.getForm(item.formID);
                    }
                    var cxt = {form: f};
                    if (f) {
                        visible = item.visibleCont ? f.eval(item.visibleCont, cxt, null) : tbl.visible;
                        enable = item.enableCont ? f.eval(item.enableCont, cxt, null) : tbl.enable;
                    } else {
                        visible = false;
                        enable = false;
                        item.needDelete = true;
                    }
                    item.visible = visible;
                    item.enable = enable;
                    if (item.items) {
                        for (var m = 0, len2 = item.items.length; m < len2; m++) {
                            visible = item.items[m].visibleCont ? f.eval(item.items[m].visibleCont, cxt, null) : tbl.visible;
                            item.items[m].visible = visible;
                            enable = item.items[m].enableCont ? f.eval(item.items[m].enableCont, cxt, null) : tbl.enable;
                            item.items[m].enable = enable;
                        }
                    }
                    map[item.key] = item;
                }
                var optMap = form.getOptMap();
                for (var key in map) {
                    if (map[key].needDelete) {
                        delete optMap[key];
                        continue;
                    }
                    var opt = optMap[key];
                    if (opt) {
                        opt.opt = map[key];
                    }
                }
                tbl.repaint();
            }
        };
        this.doPostShowData = function (commitValue) {
            this.calcProcess.calcAll(commitValue);
            this.enableProcess.calcAll();
            this.visibleProcess.calcAll();
            this.checkRuleProcess.checkAll();
            this.dependencyProcess.calcAll();
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            this.calcProcess.calcEmptyRow(grid, rowIndex);
            this.enableProcess.calcEmptyRow(grid, rowIndex);
            this.checkRuleProcess.calcEmptyRow(grid, rowIndex);
            this.dependencyProcess.calcEmptyRow(grid, rowIndex);
        };
        this.doValueChanged = function (key) {
            this.calcProcess.valueChanged(key);
            var control = this.form.getComponent(key);
            if (control.valueChanged) {
                this.form.eval(control.valueChanged, {form: this.form});
            }
        };
        this.doPostValueChanged = function (key) {
            this.enableProcess.valueChanged(key);
            this.visibleProcess.valueChanged(key);
            this.checkRuleProcess.valueChanged(key);
            this.dependencyProcess.valueChanged(key);
        };
        this.doPreCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.dependencyProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.doCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.calcProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.doPostCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.enableProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
            this.visibleProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
            this.checkRuleProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
//            this.dependencyProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.calcSubDetail = function (gridKey) {
            this.calcProcess.calcSubDetail(gridKey);
            this.enableProcess.calcSubDetail(gridKey);
            this.visibleProcess.calcSubDetail(gridKey);
            this.checkRuleProcess.checkSubDetail(gridKey);
        };
        this.doPostInsertRow = function (grid, rowIndex) {
            this.calcProcess.calcEmptyRow(grid, rowIndex);
            this.enableProcess.doAfterInsertRow(grid, rowIndex);
            this.checkRuleProcess.calcEmptyRow(grid, rowIndex);
            this.dependencyProcess.calcEmptyRow(grid, rowIndex);
        };
        this.doPostDeleteRow = function (grid, rowIndex) {
            this.calcProcess.doAfterDeleteRow(grid, rowIndex);
            this.enableProcess.doAfterDeleteRow(grid, rowIndex);
            this.checkRuleProcess.doAfterDeleteRow(grid, rowIndex);
        };
        this.doPostClearAllRow = function (grid) {
            this.enableProcess.doAfterDeleteRow(grid, -1);
        };
        this.preFireValueChanged = function (key) {
            this.dependencyProcess.valueChanged(key);
        };
        this.postFireValueChanged = function (key) {
            this.enableProcess.valueChanged(key);
            this.visibleProcess.valueChanged(key);
            this.checkRuleProcess.valueChanged(key);
        };

    };

    YIUI.UIEnableProcess = YIUI.extend(YIUI.AbstractUIProcess, {
        EnabltItemType: {Head: 0, List: 1, Column: 2, Operation: 3},
        init: function (form) {
            this.base(form);
        },
        doAfterDeleteRow: function (grid, rowIndex) {
            this.calcRowCountChange(grid, rowIndex);
        },
        doAfterInsertRow: function (grid, rowIndex) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if(expItem.type == YIUI.ExprItem_Type.Set && expItem.source == grid.key){
                    this.calcExpItem(expItem);
                }
            }
            this.calcRowCountChange(grid, rowIndex);
        },
        calcRowCountChange: function (grid, rowIndex) {
            var calcKey1 = grid.key + ":RowCount", calcKey2 = grid.key + ":RowIndex";
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key == calcKey1 || item.key == calcKey2) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        var isFinish = false;
                        if (expItem.items != null && expItem.items.length > 0) {
                            var subExpItem, sTrees = [];
                            for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
                                subExpItem = expItem.items[ti];
                                sTrees[ti] = this.form.getSyntaxTree(subExpItem.right);
                                var cellLocation = this.form.getCellLocation(subExpItem.left);
                                if (cellLocation != null) {
                                    if (cellLocation.key == grid.key) {
                                        this.calcDetailRow(grid, subExpItem, sTrees, ti, rowIndex, this.getFormEnable());
                                        isFinish = true;
                                    } else if (grid.parentGrid != null && grid.parentGrid == cellLocation.key) {
                                        var targetGrid = this.form.getComponent(cellLocation.key);
                                        this.calcDetailRow(targetGrid, subExpItem, sTrees, ti, targetGrid.getFocusRowIndex(), this.getFormEnable());
                                        isFinish = true;
                                    }
                                }
                            }
                        }
                        if (!isFinish) {
                            this.calcExpItem(expItem, true);
                        }
                    }
                }
            }
        },
        calcAll: function () {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem);
            }
        },
        valueChanged: function (key) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key == key) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.type == YIUI.EnableItem.Operation) {
                            if (YIUI.TypeConvertor.toBoolean(this.form.eval(expItem.right, {form: this.form}, null))) {
                                this.form.setOperationEnable(expItem.left, true);
                            } else {
                                this.form.setOperationEnable(expItem.left, false);
                            }
                        } else {
                            this.calcExpItem(expItem, true);
                        }
                    }
                }
            }
        },
        calcOptItem: function (expItem) {
            var optInfo = this.form.getOptMap()[expItem.left];
            if (optInfo) {
                var toolbar = this.form.getComponent(optInfo.barKey);
                var enable = this.form.eval(expItem.right, {form: this.form}, null);
                if (enable == null) {
                    enable = this.getFormEnable();
                }
                toolbar.setItemEnable(expItem.left, enable);
            }
        },
        dealSubDetailComps: function (form, comp, cellKey, enable) {
            var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
            if (subDetailComps != null) {
                for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
                    var subDtlComp = subDetailComps[si];
                    subDtlComp.setEnable(enable);
                }
            }
        },
        calcDetailRow: function (comp, subExpItem, sTrees, treeIndex, rowIndex, formEnable) {
            var evalV = null, evalEnable;
            if (!comp.getRowDataAt(rowIndex).isDetail)
                return false;
            evalV = this.calcEnableByTree(this.form, subExpItem.left, sTrees[treeIndex], formEnable, rowIndex, comp.getCellIndexByKey(subExpItem.left));
            evalEnable = (evalV === null ? formEnable : evalV);
            if (subExpItem.left == "") return false;
            comp.setCellEnable(rowIndex, subExpItem.left, evalEnable);
            this.dealSubDetailComps(this.form, comp, subExpItem.left, evalEnable);
            return true;
        },
        calcEnable: function (form, expItem, formEnable, rowIndex, colIndex) {
            // var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     enable = hostProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // } else {
            //     enable = defaultProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // }
            if (!this.hasEnableRights(expItem.left))
                return false;
            return form.defaultUIStatusProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            ;
        },
        // 这个改动是暂时的,后面要重写
        calcEnableByTree: function (form, key, syntaxTree, formEnable, rowIndex, colIndex) {
            // var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     enable = hostProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // } else {
            //     enable = defaultProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // }
            if (!this.hasEnableRights(key))
                return false;

            return form.defaultUIStatusProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
        },
        calcExpItem: function (expItem, needCalc, isCalcSubDetailComp) {
            var comp = this.form.getComponent(expItem.source);
            if (comp == undefined) {
                comp = this.form.getPanel(expItem.source);
            }
            if (comp === undefined) {
                this.calcOptItem(expItem);
                return;
            }
            var enable = null;
            if (enable == null && isCalcSubDetailComp && comp.getMetaObj().bindingCellKey != null) {
                var parentGrid = YIUI.SubDetailUtil.getBindingGrid(this.form, comp),
                    cellData = parentGrid.getCellDataByKey(parentGrid.getFocusRowIndex(), comp.getMetaObj().bindingCellKey);
                if (cellData != null) {
                    enable = cellData[2];
                }
            }
            if (enable == null) {
                enable = this.getFormEnable();
            }
            if (expItem.type !== this.EnabltItemType.List) {
                enable = this.calcEnable(this.form, expItem, enable);
                // enable = this.calcEnable(form, expItem, enable);
            }

            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        comp.setGridEnable(enable);
                    } else {
                        comp.setEnable(enable);
                    }
                    var cell_key = comp.getMetaObj().bindingCellKey;
                    if (needCalc && cell_key != null && cell_key != "") {
                        var grid = YIUI.SubDetailUtil.getBindingGrid(this.form, comp);
                        if (grid != null) {
                            grid.setCellEnable(grid.getFocusRowIndex(), cell_key, enable);
                        }
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        $.each(comp.columnInfo, function (i, column) {
                            if (column.key == expItem.left) {
                                column.enable = enable;
                                column.el && comp.setColumnEnable(column.enable, column.el);
                            }
                        })
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        if (expItem.items == undefined) {
                            if (expItem.source == expItem.left) {  //表格自身的enable
                                comp.setGridEnable(enable);
                            } else {      //固定行的单元格的enable
                                if (expItem.left !== "") {
                                    var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left);
                                    if (fixRowInfoes !== null) {
                                        for (var n = 0, nlen = fixRowInfoes.length; n < nlen; n++) {
                                            evalV = this.calcEnable(this.form, expItem, enable, fixRowInfoes[n].rowIndex, fixRowInfoes[n].colIndex);
                                            evalEnable = (evalV === null ? enable : evalV);
                                            comp.setCellEnable(fixRowInfoes[n].rowIndex, expItem.left, evalEnable);
                                            this.dealSubDetailComps(this.form, comp, expItem.left, evalEnable);
                                        }
                                    }
                                }
                            }
                        } else {
                            var subExpItem, evalV = null, evalEnable, sTrees = [];
                            for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
                                subExpItem = expItem.items[ti];
                                sTrees[ti] = this.form.getSyntaxTree(subExpItem.right);
                            }
                            for (var ind = 0, ilen = expItem.items.length; ind < ilen; ind++) {
                                subExpItem = expItem.items[ind];
                                if (subExpItem.type == this.EnabltItemType.Column) {  //表格列的enable
                                    if (subExpItem.left == "")
                                        continue;
                                    evalV = this.calcEnableByTree(this.form, subExpItem.left, sTrees[ind], enable);
                                    evalEnable = (evalV === null ? enable : evalV);
                                    var colInfoes = comp.getFixRowInfoByCellKey(subExpItem.left);
                                    if (colInfoes == null) {
                                        colInfoes = comp.getColInfoByKey(subExpItem.left);
                                    }
                                    if (colInfoes !== null)
                                        for (var ci = 0, len = colInfoes.length; ci < len; ci++) {
                                            comp.setColumnEnable(ci, evalEnable);
                                        }
                                } else {     //表格明细单元格的enable
                                    for (var i = 0, clen = comp.getRowCount(); i < clen; i++) {
                                        this.calcDetailRow(comp, subExpItem, sTrees, ind, i, enable);
                                    }
                                }
                            }
                        }
                        comp.reShowCheckColumn();
                    }
                    break;
            }
        },
        cellValChanged: function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, enable, expItem, subItem, colInfoes;
            // var dealSubDetailComps = function (form, comp, cellKey, enable) {
            //     var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
            //     if (subDetailComps != null) {
            //         for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
            //             var subDtlComp = subDetailComps[si];
            //             subDtlComp.setEnable(enable);
            //         }
            //     }
            // };
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.items) {
                            for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                                subItem = expItem.items[ind];
                                if (subItem.left == "") continue;
                                colInfoes = grid.getColInfoByKey(subItem.left);
                                if (colInfoes == null) continue;
                                for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                    enable = this.form.eval(subItem.right, {form: this.form, rowIndex: rowIndex, colIndex: colInfoes[m].colIndex}, null);
                                    if (enable === null) {
                                        enable = this.getFormEnable();
                                    }
                                    grid.setCellEnable(rowIndex, subItem.left, enable);
                                    this.dealSubDetailComps(this.form, grid, subItem.left, enable);
                                }
                            }
                        } else {
                            if (expItem.left == "") continue;
                            colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) continue;
                            for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                enable = this.form.eval(expItem.right, {form: this.form, rowIndex: colInfoes[n].rowIndex, colIndex: colInfoes[n].colIndex}, null);
                                if (enable === null) {
                                    enable = this.getFormEnable();
                                }
                                grid.setCellEnable(colInfoes[n].rowIndex, expItem.left, enable);
                                this.dealSubDetailComps(this.form, grid, expItem.left, enable);
                            }
                        }
                    }
                }
            }
        },
        calcEmptyRow: function (grid, rowIndex) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, subItem, enable, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.EnabltItemType.List) {
                    if (!expItem.items) continue;
                    for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                        subItem = expItem.items[ind];
                        if (subItem.type == this.EnabltItemType.Column) continue;
                        enable = this.form.eval(subItem.right, {form: this.form, rowIndex: rowIndex}, null);
                        if (enable === null) {
                            enable = this.getFormEnable();
                        }
                        if (subItem.left == "") continue;
                        grid.setCellEnable(rowIndex, subItem.left, enable);
                    }
                }
            }
            this.calcRowCountChange(grid, rowIndex);
        },
        getFormEnable: function () {
            var operationState = this.form.getOperationState();
            return (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
        },
        calcSubDetail: function (gridKey) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len, comp;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = this.form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem, false, true);
                }
            }
        }
    });


    // YIUI.UIEnableProcess = function (form) {
    //     this.EnabltItemType = {Head: 0, List: 1, Column: 2, Operation: 3};
    //     this.form = form;
    // this.doAfterDeleteRow = function (grid, rowIndex) {
    //     this.calcRowCountChange(grid, rowIndex);
    // };
    // this.calcRowCountChange = function (grid, rowIndex) {
    //     var calcKey = grid.key + ":RowCount";
    //     var affectItems = form.dependency.enableTree.affectItems;
    //     var item, expItems, expItem;
    //     for (var i = 0, len = affectItems.length; i < len; i++) {
    //         item = affectItems[i];
    //         if (item.key == calcKey) {
    //             expItems = item.expItems;
    //             for (var j = 0, length = expItems.length; j < length; j++) {
    //                 expItem = expItems[j];
    //                 var isFinish = false;
    //                 if (expItem.items != null && expItem.items.length > 0) {
    //                     var subExpItem, sTrees = [];
    //                     for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
    //                         subExpItem = expItem.items[ti];
    //                         sTrees[ti] = form.getSyntaxTree(subExpItem.right);
    //                         var cellLocation = form.getCellLocation(subExpItem.left);
    //                         if (cellLocation != null) {
    //                             if (cellLocation.key == grid.key) {
    //                                 this.calcDetailRow(grid, subExpItem, sTrees, j, rowIndex, this.getFormEnable());
    //                                 isFinish = true;
    //                             } else if (grid.parentGrid != null && grid.parentGrid == cellLocation.key) {
    //                                 var targetGrid = form.getComponent(cellLocation.key);
    //                                 this.calcDetailRow(targetGrid, subExpItem, sTrees, ti, targetGrid.getFocusRowIndex(), this.getFormEnable());
    //                                 isFinish = true;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 if (!isFinish) {
    //                     this.calcExpItem(expItem, true);
    //                 }
    //             }
    //         }
    //     }
    // };
    // this.calcAll = function () {
    //     var items = form.dependency.enableTree.items;
    //     var i, expItem, len;
    //     for (i = 0, len = items.length; i < len; i++) {
    //         expItem = items[i];
    //         this.calcExpItem(expItem);
    //     }
    // };
    // this.valueChanged = function (key) {
    //     var affectItems = form.dependency.enableTree.affectItems;
    //     var item, expItems, expItem;
    //     for (var i = 0, len = affectItems.length; i < len; i++) {
    //         item = affectItems[i];
    //         if (item.key == key) {
    //             expItems = item.expItems;
    //             for (var j = 0, length = expItems.length; j < length; j++) {
    //                 expItem = expItems[j];
    //                 if (expItem.type == YIUI.EnableItem.Operation) {
    //                     if (YIUI.TypeConvertor.toBoolean(form.eval(expItem.right, {form: form}, null))) {
    //                         form.setOperationEnable(expItem.left, true);
    //                     } else {
    //                         form.setOperationEnable(expItem.left, false);
    //                     }
    //                 } else {
    //                     this.calcExpItem(expItem, true);
    //                 }
    //             }
    //         }
    //     }
    // };
    // this.calcOptItem = function (expItem) {
    //     var optInfo = form.getOptMap()[expItem.left];
    //     if (optInfo) {
    //         var toolbar = form.getComponent(optInfo.barKey);
    //         var enable = form.eval(expItem.right, {form: form}, null);
    //         if (enable == null) {
    //             enable = this.getFormEnable();
    //         }
    //         toolbar.setItemEnable(expItem.left, enable);
    //     }
    // };
    // this.dealSubDetailComps = function (form, comp, cellKey, enable) {
    //     var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
    //     if (subDetailComps != null) {
    //         for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
    //             var subDtlComp = subDetailComps[si];
    //             subDtlComp.setEnable(enable);
    //         }
    //     }
    // };
    // this.calcDetailRow = function (comp, subExpItem, sTrees, treeIndex, rowIndex, formEnable) {
    //     var evalV = null, evalEnable;
    //     if (!comp.getRowDataAt(rowIndex).isDetail)
    //         return false;
    //     evalV = this.calcEnableByTree(form, subExpItem.left, sTrees[treeIndex], formEnable, rowIndex, comp.getCellIndexByKey(subExpItem.left));
    //     evalEnable = (evalV === null ? formEnable : evalV);
    //     if (subExpItem.left == "") return false;
    //     comp.setCellEnable(rowIndex, subExpItem.left, evalEnable);
    //     this.dealSubDetailComps(form, comp, subExpItem.left, evalEnable);
    //     return true;
    // };
//         this.calcEnable = function (form, expItem, formEnable, rowIndex, colIndex) {
//             var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
//             if (hostProxy != null) {
//                 enable = hostProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             } else {
//                 enable = defaultProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             }
//             return enable;
//         };
//         this.calcEnableByTree = function (form, key, syntaxTree, formEnable, rowIndex, colIndex) {
//             var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
//             if (hostProxy != null) {
//                 enable = hostProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             } else {
//                 enable = defaultProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             }
//             return enable;
//         };
//         this.calcExpItem = function (expItem, needCalc, isCalcSubDetailComp) {
//             var comp = form.getComponent(expItem.source);
//             if (comp == undefined) {
//                 comp = form.getPanel(expItem.source);
//             }
//             if (comp === undefined) {
//                 this.calcOptItem(expItem);
//                 return;
//             }
//             var enable = null;
//             if (enable == null && isCalcSubDetailComp && comp.getMetaObj().bindingCellKey != null) {
//                 var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form, comp),
//                     cellData = parentGrid.getCellDataByKey(parentGrid.getFocusRowIndex(), comp.getMetaObj().bindingCellKey);
//                 if (cellData != null) {
//                     enable = cellData[2];
//                 }
//             }
//             if (enable == null) {
//                 enable = this.getFormEnable();
//             }
//             if (expItem.type !== this.EnabltItemType.List) {
//                 enable = this.calcEnable(form, expItem, enable);
//             }
//
//             switch (expItem.type) {
//                 case YIUI.ExprItem_Type.Item:
//                     if (comp.type == YIUI.CONTROLTYPE.GRID) {
//                         comp.setGridEnable(enable);
//                     } else {
//                         comp.setEnable(enable);
//                     }
//                     var cell_key = comp.getMetaObj().bindingCellKey;
//                     if (needCalc && cell_key != null && cell_key != "") {
//                         var grid = YIUI.SubDetailUtil.getBindingGrid(form, comp);
//                         if (grid != null) {
//                             grid.setCellEnable(grid.getFocusRowIndex(), cell_key, enable);
//                         }
//                     }
//                     break;
//                 case YIUI.ExprItem_Type.Set:
//                     if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
//                         $.each(comp.columnInfo, function (i, column) {
//                             if (column.key == expItem.left) {
//                                 column.enable = enable;
//                                 column.el && comp.setColumnEnable(column.enable, column.el);
//                             }
//                         })
//                     } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
//                         if (expItem.items == undefined) {
//                             if (expItem.source == expItem.left) {  //表格自身的enable
//                                 comp.setGridEnable(enable);
//                             } else {      //固定行的单元格的enable
//                                 if (expItem.left !== "") {
//                                     var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left);
//                                     if (fixRowInfoes !== null) {
//                                         for (var n = 0, nlen = fixRowInfoes.length; n < nlen; n++) {
// //	                                        evalV = form.eval(expItem.right, {form: form, rowIndex: fixRowInfoes[n].rowIndex, colIndex: fixRowInfoes[n].colIndex}, null);
//                                             evalV = this.calcEnable(form, expItem, enable, fixRowInfoes[n].rowIndex, fixRowInfoes[n].colIndex);
//                                             evalEnable = (evalV === null ? enable : evalV);
//                                             comp.setCellEnable(fixRowInfoes[n].rowIndex, expItem.left, evalEnable);
//                                             this.dealSubDetailComps(form, comp, expItem.left, evalEnable);
//                                         }
//                                     }
//                                 }
//                             }
//                         } else {
//                             var subExpItem, evalV = null, evalEnable, sTrees = [];
//                             for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
//                                 subExpItem = expItem.items[ti];
//                                 sTrees[ti] = form.getSyntaxTree(subExpItem.right);
//                             }
//                             for (var ind = 0, ilen = expItem.items.length; ind < ilen; ind++) {
//                                 subExpItem = expItem.items[ind];
//                                 if (subExpItem.type == this.EnabltItemType.Column) {  //表格列的enable
//                                     if (subExpItem.left == "") continue;
//                                     evalV = null;
// //	                                if (subExpItem.right.length !== 0) {
// //	                                    if (subExpItem.right.toLowerCase() == "true" || subExpItem.right.toLowerCase() == "false") {
// //	                                        evalV = ( subExpItem.right.toLowerCase() == "true" );
// //	                                    } else {
// //	                                        evalV = form.evalByTree(sTrees[ind], {form: form}, null);
// //	                                    }
// //	                                }
//                                     evalV = this.calcEnableByTree(form, subExpItem.left, sTrees[ind], enable);
//                                     evalEnable = (evalV === null ? enable : evalV);
//                                     var colInfoes = comp.getFixRowInfoByCellKey(subExpItem.left);
//                                     if (colInfoes == null) {
//                                         colInfoes = comp.getColInfoByKey(subExpItem.left);
//                                     }
//                                     if (colInfoes !== null)
//                                         for (var ci = 0, len = colInfoes.length; ci < len; ci++) {
//                                             comp.setColumnEnable(ci, evalEnable);
//                                         }
//                                 } else {     //表格明细单元格的enable
//                                     for (var i = 0, clen = comp.getRowCount(); i < clen; i++) {
//                                         this.calcDetailRow(comp, subExpItem, sTrees, ind, i, enable);
//                                     }
//                                 }
//                             }
//                         }
//                         comp.reShowCheckColumn();
//                     }
//                     break;
//             }
//
//         };
//         this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
//             var affectItems = form.dependency.enableTree.affectItems;
//             var item, expItems, enable, expItem, subItem, colInfoes;
//             var dealSubDetailComps = function (form, comp, cellKey, enable) {
//                 var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
//                 if (subDetailComps != null) {
//                     for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
//                         var subDtlComp = subDetailComps[si];
//                         subDtlComp.setEnable(enable);
//                     }
//                 }
//             };
//             for (var i = 0, len = affectItems.length; i < len; i++) {
//                 item = affectItems[i];
//                 if (item.key.toLowerCase() == cellKey.toLowerCase()) {
//                     expItems = item.expItems;
//                     for (var j = 0, length = expItems.length; j < length; j++) {
//                         expItem = expItems[j];
//                         if (expItem.items) {
//                             for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
//                                 subItem = expItem.items[ind];
//                                 if (subItem.left == "") continue;
//                                 colInfoes = grid.getColInfoByKey(subItem.left);
//                                 if (colInfoes == null) continue;
//                                 for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
//                                     enable = form.eval(subItem.right, {form: form, rowIndex: rowIndex, colIndex: colInfoes[m].colIndex}, null);
//                                     if (enable === null) {
//                                         enable = this.getFormEnable();
//                                     }
//                                     grid.setCellEnable(rowIndex, subItem.left, enable);
//                                     dealSubDetailComps(form, grid, subItem.left, enable);
//                                 }
//                             }
//                         } else {
//                             if (expItem.left == "") continue;
//                             colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
//                             if (colInfoes == null) continue;
//                             for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
//                                 enable = form.eval(expItem.right, {form: form, rowIndex: colInfoes[n].rowIndex, colIndex: colInfoes[n].colIndex}, null);
//                                 if (enable === null) {
//                                     enable = this.getFormEnable();
//                                 }
//                                 grid.setCellEnable(colInfoes[n].rowIndex, expItem.left, enable);
//                                 dealSubDetailComps(form, grid, expItem.left, enable);
//                             }
//                         }
//                     }
//                 }
//             }
//         };
//         this.calcEmptyRow = function (grid, rowIndex) {
//             var items = form.dependency.enableTree.items;
//             var i, expItem, subItem, enable, len;
//             for (i = 0, len = items.length; i < len; i++) {
//                 expItem = items[i];
//                 if (expItem.source === grid.key && expItem.type === this.EnabltItemType.List) {
//                     if (!expItem.items) continue;
//                     for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
//                         subItem = expItem.items[ind];
//                         if (subItem.type == this.EnabltItemType.Column) continue;
//                         enable = form.eval(subItem.right, {form: form, rowIndex: rowIndex}, null);
//                         if (enable === null) {
//                             enable = this.getFormEnable();
//                         }
//                         if (subItem.left == "") continue;
//                         grid.setCellEnable(rowIndex, subItem.left, enable);
//                     }
//                 }
//             }
//             this.calcRowCountChange(grid, rowIndex);
//         };
//         this.getFormEnable = function () {
//             var operationState = form.getOperationState();
//             return (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
//         };
//         this.calcSubDetail = function (gridKey) {
//             var items = form.dependency.enableTree.items;
//             var i, expItem, len, comp;
//             for (i = 0, len = items.length; i < len; i++) {
//                 expItem = items[i];
//                 comp = form.getComponent(expItem.source);
//                 if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
//                     this.calcExpItem(expItem, false, true);
//                 }
//             }
//         }
//     };


    YIUI.UIVisibleProcess = YIUI.extend(YIUI.AbstractUIProcess, {
        VisibleItemType: {Head: 0, Column: 1, Operation: 2},
        init: function (form) {
            this.base(form);
        },
        calcAll: function () {
            var items = this.form.dependency.visibleTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem);
            }
        },
        valueChanged: function (key) {
            var affectItems = this.form.dependency.visibleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem);
                    }
                }
            }
        },
        cellValChanged: function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = this.form.dependency.visibleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem);
                    }
                }
            }
        },
        calcOptItem: function (expItem) {
            var optInfo = this.form.getOptMap()[expItem.left];
            if (optInfo) {
                var toolbar = this.form.getComponent(optInfo.barKey);
                var visible = this.form.eval(expItem.right, {form: this.form}, null);
                visible = (visible === null ? true : visible);
                toolbar.setItemVisible(expItem.left, visible);
            }
        },
        calcVisible: function (form, expItem) {
            // var visible = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     visible = hostProxy.validateVisible(expItem.left, expItem.right, {form: form});
            // } else {
            //     visible = defaultProxy.validateVisible(expItem.left, expItem.right, {form: form});
            // }
            if (!this.hasVisibleRights(expItem.left))
                return false;

            return form.defaultUIStatusProxy.validateVisible(expItem.left, expItem.right, {form: form});
        },
        calcExpItem: function (expItem) {
            var comp = this.form.getComponent(expItem.source);
            if (comp == undefined) {
                comp = this.form.getPanel(expItem.source);
                this.calcOptItem(expItem);
                return;
            }
            var visible = this.calcVisible(this.form, expItem);
            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    if (comp.isBuddy())
                        return;
                    comp.setVisible(visible);
                    //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
                    if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
                        if (!this.form.errorInfo.error) {
                            if (comp.isRequired()) {
                                this.form.setError(true, comp.key + "必填", comp.key);
                            } else {
                                this.form.setError(true, comp.errorInfo.msg, comp.key);
                            }
                        }
                    } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
                        if (this.form.errorInfo.error &&
                            this.form.errorInfo.errorSource != null && this.form.errorInfo.errorSource == comp.key) {
                            this.form.setError(false, null);
                        }
                    }
                    var ownerCt = comp.ownerCt;
                    if (ownerCt && ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
                        if (comp.visible == visible) return;
                        ownerCt.reLayout();
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        var i, column, len;
                        for (i = 0, len = comp.columnInfo.length; i < len; i++) {
                            column = comp.columnInfo[i];
                            if (column.key === expItem.left) {
                                column.visible = visible;
                                comp.setColumnVisible(column.key, visible);
                                break;
                            }
                        }
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        if (expItem.type !== this.VisibleItemType.Column) return;
                        comp.setColumnVisible(expItem.left, visible);
                    }
                    break;
            }
        },
        calcSubDetail: function (gridKey) {
            var items = this.form.dependency.visibleTree.items;
            var i, expItem, comp, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = this.form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem);
                }
            }
        }
    });


    //
    // YIUI.UIVisibleProcess = function (form) {
    //     this.VisibleItemType = {Head: 0, Column: 1, Operation: 2};
    //     this.form = form;
    //     this.calcAll = function () {
    //         var items = form.dependency.visibleTree.items;
    //         var i, expItem, len;
    //         for (i = 0, len = items.length; i < len; i++) {
    //             expItem = items[i];
    //             this.calcExpItem(expItem);
    //         }
    //     };
    //     this.valueChanged = function (key) {
    //         var affectItems = form.dependency.visibleTree.affectItems;
    //         var item, expItems, expItem;
    //         for (var i = 0, len = affectItems.length; i < len; i++) {
    //             item = affectItems[i];
    //             if (item.key.toLowerCase() == key.toLowerCase()) {
    //                 expItems = item.expItems;
    //                 for (var j = 0, length = expItems.length; j < length; j++) {
    //                     expItem = expItems[j];
    //                     this.calcExpItem(expItem);
    //                 }
    //             }
    //         }
    //     };
    //     this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
    //         var affectItems = form.dependency.visibleTree.affectItems;
    //         var item, expItems, expItem;
    //         for (var i = 0, len = affectItems.length; i < len; i++) {
    //             item = affectItems[i];
    //             if (item.key.toLowerCase() == cellKey.toLowerCase()) {
    //                 expItems = item.expItems;
    //                 for (var j = 0, length = expItems.length; j < length; j++) {
    //                     expItem = expItems[j];
    //                     this.calcExpItem(expItem);
    //                 }
    //             }
    //         }
    //     };
    //     this.calcOptItem = function (expItem) {
    //         var optInfo = form.getOptMap()[expItem.left];
    //         if (optInfo) {
    //             var toolbar = form.getComponent(optInfo.barKey);
    //             var visible = form.eval(expItem.right, {form: form}, null);
    //             visible = (visible === null ? true : visible);
    //             toolbar.setItemVisible(expItem.left, visible);
    //         }
    //     };
    //     this.calcVisible = function (form, expItem) {
    //         var visible = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
    //         if (hostProxy != null) {
    //             visible = hostProxy.validateVisible(expItem.left, expItem.right, {form: form});
    //         } else {
    //             visible = defaultProxy.validateVisible(expItem.left, expItem.right, {form: form});
    //         }
    //         return visible;
    //     };
    //     this.calcExpItem = function (expItem) {
    //         var comp = form.getComponent(expItem.source);
    //         if (comp == undefined) {
    //             comp = form.getPanel(expItem.source);
    //             this.calcOptItem(expItem);
    //             return;
    //         }
    //         var visible = this.calcVisible(form, expItem);
    //         switch (expItem.type) {
    //             case YIUI.ExprItem_Type.Item:
    //                 if (comp.isBuddy())
    //                     return;
    //                 comp.setVisible(visible);
    //                 //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
    //                 if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
    //                     if (!form.errorInfo.error) {
    //                         if (comp.isRequired()) {
    //                             form.setError(true, comp.key + "必填", comp.key);
    //                         } else {
    //                             form.setError(true, comp.errorInfo.msg, comp.key);
    //                         }
    //                     }
    //                 } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
    //                     if (form.errorInfo.error &&
    //                         form.errorInfo.errorSource != null && form.errorInfo.errorSource == comp.key) {
    //                         form.setError(false, null);
    //                     }
    //                 }
    //                 var ownerCt = comp.ownerCt;
    //                 if (ownerCt && ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
    //                     if (comp.visible == visible) return;
    //                     ownerCt.reLayout();
    //                 }
    //                 break;
    //             case YIUI.ExprItem_Type.Set:
    //                 if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
    //                     var i, column, len;
    //                     for (i = 0, len = comp.columnInfo.length; i < len; i++) {
    //                         column = comp.columnInfo[i];
    //                         if (column.key === expItem.left) {
    //                             column.visible = visible;
    //                             comp.setColumnVisible(column.key, visible);
    //                             break;
    //                         }
    //                     }
    //                 } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
    //                     if (expItem.type !== this.VisibleItemType.Column) return;
    //                     comp.setColumnVisible(expItem.left, visible);
    //                 }
    //                 break;
    //         }
    //     };
    //     this.calcSubDetail = function (gridKey) {
    //         var items = form.dependency.visibleTree.items;
    //         var i, expItem, comp, len;
    //         for (i = 0, len = items.length; i < len; i++) {
    //             expItem = items[i];
    //             comp = form.getComponent(expItem.source);
    //             if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
    //                 this.calcExpItem(expItem);
    //             }
    //         }
    //     }
    // };
    YIUI.UICalcProcess = function (form) {
        this.CalcItemType = {Head: 0, List: 1};
        this.form = form;
        this.doAfterDeleteRow = function (grid, rowIndex) {
            var metaDtlRow = grid.metaRowInfo.rows[grid.metaRowInfo.dtlRowIndex];
            var affectItems = form.dependency.calcTree.affectItems;
            var item, expItems, expItem, needCalcItems = [];
            for (var i = 0, len = metaDtlRow.cells.length; i < len; i++) {
                var metaCell = metaDtlRow.cells[i];
                for (var ind = 0, ilen = affectItems.length; ind < ilen; ind++) {
                    item = affectItems[ind];
                    if (item.key.toLowerCase() == metaCell.key.toLowerCase()) {
                        if (item.expItems == null || item.expItems.length == 0) {
                            needCalcItems.push(item);
                        } else {
                            for (var m = 0, mlen = item.expItems.length; m < mlen; m++) {
                                expItem = item.expItems[m];
                                var g = form.getComponent(expItem.source);
                                if (YIUI.SubDetailUtil.isSubDetail(form, grid, g.key)) {
                                    this.calcEmptyRow(g, g.getFocusRowIndex());
                                }
                            }
                        }
                    }
                }
            }
            needCalcItems.sort(function (item1, item2) {
                return parseFloat(item1.order) - parseFloat(item2.order);
            });
            for (var k = 0, kLen = needCalcItems.length; k < kLen; k++) {
                this.calcExpItem(needCalcItems[k], true);
            }
        };
        this.calcAll = function (commitValue) {
            switch (form.getOperationState()) {
                case YIUI.Form_OperationState.New:
                    //新增表单,全部计算
                    this.calcAllItems(true, commitValue);
                    break;
                case YIUI.Form_OperationState.Default:
                case YIUI.Form_OperationState.Edit:
                    //打开表单,计算没有数据绑定的
                    this.calcAllItems(false, commitValue);
                    break;
                default:
                    break;
            }
        };
        this.calcAllItems = function (calcAll, commitValue) {
            var items = form.dependency.calcTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem, calcAll, commitValue);
            }
        };
        this.valueChanged = function (key) {
            var affectItems = form.dependency.calcTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem, true);
                    }
                }
            }
        };
        this.hasDefaultValue = function (expItem) {
            return (expItem.formulaValue !== null && expItem.formulaValue.length > 0)
                || (expItem.defaultValue !== null && expItem.defaultValue.length > 0);
        };
        this.isNeedCalcDefaultValue = function (curGridKey, metaRow, rowIndex, cellIndex) {
            var valueDependency = metaRow.cells[cellIndex].valueDependency, isNeedCalc = true;
            if (valueDependency != null) {
                var dependencyArray = valueDependency.split(",");
                for (var di = 0, dlen = dependencyArray.length; di < dlen; di++) {
                    var dependency = dependencyArray[di],
                        dpComp = form.getCellLocation(dependency);
                    if (dpComp == null) {
                        dpComp = form.getComponent(dependency);
                    } else {
                        dpComp = form.getComponent(dpComp.key);
                    }
                    if (dpComp != null && dpComp.parentGrid != null && dpComp.parentGrid == curGridKey) {
                        var pGrid = form.getComponent(dpComp.parentGrid);
                        if (pGrid != null && pGrid.getFocusRowIndex() != rowIndex) {
                            isNeedCalc = false;
                        }
                    }
                }
            }
            return isNeedCalc;
        };
        this.getCalcValue = function (expItem, rowIndex, colIndex, gridKey, metaRow) {
            var value, cxt = {form: form};
            if (expItem.formulaValue !== null && expItem.formulaValue.length > 0) {
                if ((metaRow != null && this.isNeedCalcDefaultValue(gridKey, metaRow, rowIndex, colIndex)) || metaRow == null)
                    value = form.eval(expItem.formulaValue, {form: form, target: expItem.left, rowIndex: rowIndex, colIndex: colIndex}, null);
            } else if (expItem.defaultValue !== null && expItem.defaultValue.length > 0) {
                value = expItem.defaultValue;
            }
            return value;
        };
        this.cellValChanged = function (grid, rowIndex, cellIndex, cellkey) {
            var affectItems = form.dependency.calcTree.affectItems, self = this,
                item, expItems, expItem, value, colInfoes, comp, calcV, metaRow;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellkey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        comp = form.getComponent(expItem.source);
                        if (comp.type == YIUI.CONTROLTYPE.GRID) {
                            colInfoes = comp.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) {
                                colInfoes = comp.getColInfoByKey(expItem.left);
                                if (colInfoes !== null) {
                                    for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                        metaRow = comp.metaRowInfo.rows[comp.metaRowInfo.dtlRowIndex];
                                        calcV = self.getCalcValue(expItem, rowIndex, colInfoes[m].colIndex, grid.key, metaRow);
                                        if (calcV === undefined) continue;
//                                        if (comp.getFocusRowIndex() != -1 && comp.getFocusRowIndex() != rowIndex) {
//                                            rowIndex = comp.getFocusRowIndex();
//                                        }
                                        comp.setValueAt(rowIndex, colInfoes[m].colIndex, calcV, true, false, true);
                                    }
                                }
                            } else {
                                for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                    metaRow = comp.metaRowInfo.rows[colInfoes[n].metaRowIndex];
                                    calcV = self.getCalcValue(expItem, colInfoes[n].rowIndex, colInfoes[n].colIndex, grid.key, metaRow);
                                    if (calcV === undefined) continue;
                                    comp.setValueAt(colInfoes[n].rowIndex, colInfoes[n].colIndex, calcV, true, false, true);
                                }
                            }
                            YIUI.GridSumUtil.evalSum(form, comp);
                        } else {
                            value = this.getCalcValue(expItem);
                            comp.setValue(value, true, false);
                        }
                    }
                }
            }
        };
        this.calcExpItem = function (expItem, calcAll, commitValue) {
            var comp = form.getComponent(expItem.source), needCalc, calcV;
            if (comp === undefined) return;

            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    var hasData = (comp.tableKey !== undefined && comp.tableKey.length !== 0
                        && comp.columnKey !== undefined && comp.columnKey.length !== 0);
                    if (calcAll) {
                        needCalc = true;
                    } else {
                        needCalc = !hasData && (comp.getMetaObj().bindingCellkey == undefined || comp.getMetaObj().bindingCellkey.length == 0);
                    }
                    if (needCalc) {
                        calcV = this.getCalcValue(expItem);
                        if (calcV !== undefined) comp.setValue(calcV, true, false);
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        var getColInfo = function (colKey) {
                            var colInfo;
                            for (var ind = 0, clen = comp.columnInfo.length; ind < clen; ind++) {
                                colInfo = comp.columnInfo[ind];
                                if (colInfo.key === colKey) {
                                    return {index: ind, col: colInfo};
                                }
                            }
                            return null;
                        };
                        var colInfo = getColInfo(expItem.left);
                        if (calcAll) {
                            needCalc = true;
                        } else {
                            needCalc = colInfo.col.columnKey === undefined || (colInfo.col.columnKey.length == 0);
                        }
                        if (needCalc) {
                            for (var i = 0, len = comp.data.length; i < len; i++) {
                                calcV = this.getCalcValue(expItem, i, colInfo.index);
                                if (calcV !== undefined) {
                                    comp.setValByIndex(i, colInfo.index, calcV);
                                }
                            }
                        }
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        var rowData, self = this, cEditOpt , cInfoes = comp.getFixRowInfoByCellKey(expItem.left), cInfo, isNotDetail = true;
                        var calcValue = function (colInfo, rowIndex, colIndex) {
                            cEditOpt = cInfo.cell;
                            if (calcAll) {
                                needCalc = true;
                            } else {
                                needCalc = (cEditOpt.columnKey == undefined || cEditOpt.columnKey.length == 0);
                            }
                            if (needCalc && self.hasDefaultValue(expItem)) {
                                rowData = comp.getRowDataAt(rowIndex);
                                var commit = !(rowData.isDetail && rowData.bookmark == undefined) && commitValue;
                                calcV = self.getCalcValue(expItem, rowIndex, colIndex, comp.key, colInfo.metaRow);
                                if (calcV !== undefined) {
                                    comp.setValueAt(rowIndex, colIndex, calcV, commit, false, true);
                                }
                            }
                        };
                        if (cInfoes == null) {
                            cInfoes = comp.getColInfoByKey(expItem.left);
                            isNotDetail = false;
                        }
                        if (cInfoes == null) return;
                        if (isNotDetail) {
                            for (var m = 0, mlen = cInfoes.length; m < mlen; m++) {
                                cInfo = cInfoes[m];
                                calcValue(cInfo, cInfo.rowIndex, cInfo.colIndex);
                            }
                        } else {
                            for (var ind = 0, dlen = comp.getRowCount(); ind < dlen; ind++) {
                                rowData = comp.getRowDataAt(ind);
                                if (rowData.isDetail) {
                                    for (var n = 0, nlen = cInfoes.length; n < nlen; n++) {
                                        cInfo = cInfoes[n];
                                        calcValue(cInfo, ind, cInfo.colIndex);
                                    }
                                }
                            }
                        }
                        YIUI.GridSumUtil.evalSum(form, comp);
                    }
                    break;
            }

        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var items = form.dependency.calcTree.items, rd = grid.getRowDataAt(rowIndex);
            if (!rd.isDetail) return;
            var i, len, expItem, colInfoes, value, needCalc, calcV, rnct, colIndex;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.CalcItemType.List) {
                    colInfoes = grid.getColInfoByKey(expItem.left);
                    if (colInfoes == null) continue;
                    for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                        colIndex = colInfoes[j].colIndex;
                        rnct = grid.showRowHead ? 1 : 0;
                        calcV = this.getCalcValue(expItem, rowIndex, colIndex, grid.key, colInfoes[j].metaRow);
                        if (calcV == undefined) continue;
                        grid.setValueAt(rowIndex, colIndex, calcV, false, true, true, true);
                        value = null;
                    }
                }
            }
        };
        this.calcSubDetail = function (gridKey) {
            var items = form.dependency.calcTree.items;
            var i, expItem, len, comp;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem);
                }
            }
        }
    };
    YIUI.UICheckRuleProcess = function (form) {
        this.CheckRuleItemType = {Head: 0, List: 1};
        this.form = form;
        this.checkAll = function () {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;

            // 计算全局检查规则
            this.checkGlobal();
            // 计算组件中的检查规则
            this.checkAllComponent(enableOnly);
            // 计算所有表格中行的检查规则
            this.checkAllRowCheckRule();
        };
        this.checkGlobal = function () {
            if (!form.checkRules) return;
            var i, len, checkRule, result = true;
            for (i = 0, len = form.checkRules.length; i < len; i++) {
                checkRule = form.checkRules[i];
                if (checkRule.content && checkRule.content.length > 0) {
                    result = form.eval($.trim(checkRule.content), {form: form}, null);
                    form.setError(!result, checkRule.errorMsg);
                    if (!result) break;
                }
            }
        };
        this.checkAllRowCheckRule = function () {
            var i, j, gridInfo, grid, len, dlen;
            for (i = 0, len = form.getGridInfoMap().length; i < len; i++) {
                gridInfo = form.getGridInfoMap()[i];
                grid = form.getComponent(gridInfo.key);
                grid.errorInfoes.rows = [];
                for (j = 0, dlen = grid.getRowCount(); j < dlen; j++) {
                    if (grid.getRowDataAt(j).isDetail) {
                        this.checkRow(grid, j);
                    }
                }
                grid.setGridErrorRows(grid.errorInfoes.rows);
            }
        };
        this.checkRow = function (grid, rowIndex) {
            if (rowIndex == -1 || grid.rowCheckRules == null)return;
            var k , len, rowCheckRule, result = true,
                metaRowIndex = grid.getRowDataAt(rowIndex).metaRowIndex,
                rowCheckRules;
            if (grid.rowCheckRules){
            	rowCheckRules = grid.rowCheckRules[metaRowIndex];
            }
            if (!rowCheckRules) return;
            for (k = 0, len = rowCheckRules.length; k < len; k++) {
                rowCheckRule = rowCheckRules[k];
                result = form.eval($.trim(rowCheckRule.content), {form: form, rowIndex: rowIndex}, null);
                if (!result) {
                    var length = grid.errorInfoes.rows.length, errorRow, match = false;
                    for (var m = 0; m < length; m++) {
                        errorRow = grid.errorInfoes.rows[m];
                        if (errorRow.rowIndex == rowIndex) {
                            match = true;
                            break;
                        }
                    }
                    if (!match)  grid.errorInfoes.rows.push({rowIndex: rowIndex, errorMsg: rowCheckRule.errorMsg});
                } else {
                    var rlen = grid.errorInfoes.rows.length, errRow;
                    for (var i = rlen - 1; i >= 0; i--) {
                        errRow = grid.errorInfoes.rows[i];
                        if (errRow.rowIndex == rowIndex) {
                            grid.errorInfoes.rows.splice(i, 1);
                        }
                    }
                }
            }
        };

        var impl_rowCountChanged = function (grid) {
            // 计算行数改变的影响,影响的对象为头控件和父表格
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem,colIndex,result;
            var key = grid.key + ":RowCount";
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() !== key.toLowerCase())
                    continue;
                expItems = item.expItems;
                for (var j = 0, length = expItems.length; j < length; j++) {
                    expItem = expItems[j];
                    var comp = form.getComponent(expItem.source);
                    if( expItem.items && comp.type == YIUI.CONTROLTYPE.GRID ) { // 影响父表格
                        for( var k = 0,size = expItem.items.length;k < size;k++ ) {
                            var exp = expItem.items[i];
                            var colInfoes = comp.getColInfoByKey(exp.left);
                            if( !colInfoes )
                                continue;
                            for (var k = 0, len = colInfoes.length; k < len; k++) {
                                colIndex = colInfoes[j].colIndex;
                                result = form.eval(exp.content, {form: form, rowIndex: comp.getFocusRowIndex(), colIndex: colIndex}, null);
                                comp.modifyCellErrors(comp.getFocusRowIndex(), colIndex, result, exp.errorMsg);
                            }
                        }
                    } else {
                        this.checkComponent(expItem, false, true);
                    }
                }

            }
        }

        this.doAfterDeleteRow = function (grid, rowIndex) {
            this.checkGlobal();

            impl_rowCountChanged.call(this,grid);
        }

        this.checkAllComponent = function (enableOnly) {
            var items = form.dependency.checkRuleTree.items;
            var i, expItem, gridMap = form.getGridInfoMap(), len = gridMap.length, ilen = items.length;
            for (var j = 0; j < len; j++) {
                var grid = form.getComponent(gridMap[j].key);
                grid.errorInfoes.cells = [];
            }
            for (i = 0; i < ilen; i++) {
                expItem = items[i];
                this.checkComponent(expItem, enableOnly, false);
            }
        };
        this.checkComponent = function (expItem, enableOnly, needCheck) {
            var comp = form.getComponent(expItem.source), result = true;
            // 在只计算可用组件的情况下,如果组件不可用,不计算
            if (comp === undefined || (enableOnly && !comp.isEnable())) return;
            if (comp.type == YIUI.CONTROLTYPE.GRID) {
                if (expItem.items == undefined) {
                    if (expItem.content && expItem.content.length > 0) {
                        var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left), fixRowInfo;
                        if (fixRowInfoes == null) return;
                        for (var fi = 0, flen = fixRowInfoes.length; fi < flen; fi++) {
                            fixRowInfo = fixRowInfoes[fi];
                            result = form.eval($.trim(expItem.content), {form: form, rowIndex: fixRowInfo.rowIndex, colIndex: fixRowInfo.colIndex}, null);
                            comp.modifyCellErrors(fixRowInfo.rowIndex, fixRowInfo.colIndex, result, expItem.errorMsg);
                        }
                    } else {
                        return;
                    }
                } else {
                    var subExpItem, colInfoes, rowData;
                    for (var ind = 0, len = expItem.items.length; ind < len; ind++) {
                        subExpItem = expItem.items[ind];
                        if (!subExpItem.content || subExpItem.content.length == 0) continue;
                        for (var i = 0, dlen = comp.getRowCount(); i < dlen; i++) {
                            rowData = comp.getRowDataAt(i);
                            if (!rowData.isDetail) continue;
                            colInfoes = comp.getColInfoByKey(subExpItem.left);
                            if (colInfoes == null) continue;
                            for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                result = form.eval(subExpItem.content, {form: form, rowIndex: i, colIndex: colInfoes[ci].colIndex}, null);
                                comp.modifyCellErrors(i, colInfoes[ci].colIndex, result, subExpItem.errorMsg);
                            }
                        }
                    }
                }
                comp.setGridErrorCells(comp.errorInfoes.cells);
            } else if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                //TODO ListView的单元格检查
            } else {
                var selfDefined = false, selfRequiredDefined = false, cellErrorInfo, cellData;
                if (comp.getMetaObj().required) {
                    comp.setRequired(comp.isNull());
                    selfRequiredDefined = true;
                }
                if (expItem.content && expItem.content.length > 0) {
                    result = form.eval($.trim(expItem.content), {form: form}, null);
                    if (result) {
                        comp.setError(false, null);
                    } else {
                        comp.setError(true, expItem.errorMsg);
                    }
                    selfDefined = true;
                }
                cellErrorInfo = YIUI.SubDetailUtil.getBindingCellError(form, comp);
                cellData = YIUI.SubDetailUtil.getBindingCellData(form, comp);
                if (!selfDefined && cellErrorInfo != null) {
                    comp.setError(true, cellErrorInfo.errorMsg);
                }
                if (!selfRequiredDefined && cellData != null) {
                    comp.setRequired(cellData[3]);
                }
                //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
                if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
                    if (!form.errorInfo.error) {
                        if (comp.isRequired()) {
                            form.setError(true, comp.key + "必填", comp.key);
                        } else {
                            form.setError(true, comp.errorInfo.msg, comp.key);
                        }
                    }
                } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
                    if (form.errorInfo.error &&
                        form.errorInfo.errorSource != null && form.errorInfo.errorSource == comp.key) {
                        form.setError(false, null);
                    }
                }
                if (needCheck && comp.getMetaObj().bindingCellKey != null) {
                    var grid = YIUI.SubDetailUtil.getBindingGrid(form, comp);
                    var rowIndex = grid.getFocusRowIndex(), cellIndex = grid.getCellIndexByKey(comp.getMetaObj().bindingCellKey);
                    if (rowIndex > -1 && cellIndex > -1) {
                        grid.modifyCellErrors(rowIndex, cellIndex, !comp.errorInfo.error, comp.errorInfo.msg);
                        grid.setGridErrorCells(grid.errorInfoes.cells);
                        grid.setCellRequired(rowIndex, cellIndex, comp.isRequired());
                    }
                }
            }
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var items = form.dependency.checkRuleTree.items;
            var i, expItem, subExpItem, colInfoes, colIndex, result, len = items.length;
            for (i = 0; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.CheckRuleItemType.List) {
                    if (!expItem.items) continue;
                    for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                        subExpItem = expItem.items[ind];
                        if (!subExpItem.content || subExpItem.content.length == 0) continue;
                        colInfoes = grid.getColInfoByKey(subExpItem.left);
                        if (colInfoes !== null) {
                            for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                                colIndex = colInfoes[j].colIndex;
                                result = form.eval(subExpItem.content, {form: form, rowIndex: rowIndex, colIndex: colIndex}, null);
                                grid.modifyCellErrors(rowIndex, colIndex, result, subExpItem.errorMsg);
                            }
                        }
                    }
                }
            }

            impl_rowCountChanged.call(this,grid);

            grid.setGridErrorCells(grid.errorInfoes.cells);
            this.checkRow(grid, rowIndex);
            grid.setGridErrorRows(grid.errorInfoes.rows);
        };
        this.valueChanged = function (key) {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;
            //必填检查
            var comp = form.getComponent(key);
            if (comp.getMetaObj().required) {
                comp.setRequired(comp.isNull());
            }
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.checkComponent(expItem, enableOnly, false);
                    }
                }
            }

            if (comp.getMetaObj().isSubDetail && !enableOnly) {
                var parentGrid = form.getComponent(comp.getMetaObj().parentGridKey);
                if (parentGrid) {
                    this.calcEmptyRow(parentGrid, parentGrid.getFocusRowIndex());
                }
            }
            this.checkGlobal();
        };
        this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem, subExpItem, result = false, colInfoes, colInfo;
            var dealSubDetailCompError = function (error, msg, isRequired) {
                if (grid.getFocusRowIndex() == rowIndex) {
                    var cellSubDtlComps = form.getCellSubDtlComps(grid.key, cellKey);
                    if (cellSubDtlComps != null && cellSubDtlComps.length > 0) {
                        for (var csi = 0, csLen = cellSubDtlComps.length; csi < csLen; csi++) {
                            var comp = cellSubDtlComps[csi];
                            comp.setError(!error, msg);
                            comp.setRequired(isRequired);
                        }
                    }
                }
            };
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.items == undefined) {
                            if (!expItem.content || expItem.content.length == 0) continue;
                            colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) continue;
                            for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                colInfo = colInfoes[m];
                                result = form.eval($.trim(expItem.content), {form: form, rowIndex: colInfo.rowIndex, colIndex: colInfo.colIndex}, null);
                                grid.modifyCellErrors(colInfo.rowIndex, colInfo.colIndex, result, expItem.errorMsg);
                                dealSubDetailCompError(result, expItem.errorMsg, colInfo.isRequired);
                            }
                        } else {
                            for (var k = 0, elen = expItem.items.length; k < elen; k++) {
                                subExpItem = expItem.items[k];
                                if (!subExpItem.content || subExpItem.content.length == 0) continue;
                                colInfoes = grid.getColInfoByKey(subExpItem.left);
                                if (colInfoes == null) continue;
                                for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                    colInfo = colInfoes[n];
                                    result = form.eval($.trim(subExpItem.content), {form: form, rowIndex: rowIndex, colIndex: colInfo.colIndex}, null);
                                    grid.modifyCellErrors(rowIndex, colInfo.colIndex, result, subExpItem.errorMsg);
                                    dealSubDetailCompError(result, expItem.errorMsg, colInfo.isRequired);
                                }
                            }
                        }
                    }
                }
            }
            grid.setGridErrorCells(grid.errorInfoes.cells);
            this.checkRow(grid, rowIndex);
            grid.setGridErrorRows(grid.errorInfoes.rows);
            this.checkGlobal();
        };
        this.checkSubDetail = function (gridKey) {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;

            var items = form.dependency.checkRuleTree.items;
            var i, expItem, comp, len = items.length;
            for (i = 0; i < len; i++) {
                expItem = items[i];
                comp = form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.checkComponent(expItem, enableOnly, true);
                }
            }
        }
    };
    YIUI.UIDependencyProcess = function (form) {
        this.form = form;

        this.calcAll = function () {
            // if (this.form.getOperationState() == YIUI.Form_OperationState.Default) {
            //     var relations = form.getRelations(), targetFields, targetField, targetComp, value;
            //     if (relations != null) {
            //         for (var dependencyField in relations) {
            //             value = this.form.getComponentValue(dependencyField);
            //             if (!YIUI.TypeConvertor.toBoolean(value))return;
            //             targetFields = relations[dependencyField];
            //             for (var i = 0, len = targetFields.length; i < len; i++) {
            //                 targetField = targetFields[i];
            //                 targetComp = this.form.getComponent(targetField);
            //                 if (targetComp != null) {
            //                     if (!targetComp.hasDataBinding) {
            //                         targetComp.dependedValueChange(dependencyField);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        };
        this.valueChanged = function (key) {
            var relations = form.getRelations(), targetFields, targetField, targetComp, cellLocation, grid;
            if (relations == null) return;
            for (var dependencyField in relations) {
                if (dependencyField != key) continue;
                targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    targetComp = this.form.getComponent(targetField);
                    cellLocation = this.form.getCellLocation(targetField);
                    if (targetComp != null) {
                        targetComp.dependedValueChange(dependencyField);
                    } else if (cellLocation != null) {
                        grid = this.form.getComponent(cellLocation.key);
                        grid.dependedValueChange(targetField, dependencyField, null);
                    }
                }
            }
        };
        this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
            var relations = form.getRelations(), targetFields, targetField;
            if (relations == null) return;
            for (var dependencyField in relations) {
                if (dependencyField != cellKey) continue;
                targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    grid.doPostCellValueChanged(rowIndex, dependencyField, targetField, null);
                }
            }
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var gridRow = grid.getRowDataAt(rowIndex), metaRow = grid.metaRowInfo.rows[gridRow.metaRowIndex];
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i];
                if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                    //TODO 刷新动态单元格
                }
            }
        };
    };
})();/**
 * Created with IntelliJ IDEA.
 * User: 陈瑞
 * Date: 16-12-26
 * Time: 下午5:19
 */
(function(){
   YIUI.ViewDataMonitor = function(form){
       this.form = form;

       this.preFireCellValueChanged = function(grid,rowIndex,colIndex,cellKey){
           this.form.getUIProcess().doPreCellValueChanged(grid,rowIndex,colIndex,cellKey);
       }

       this.fireCellValueChanged = function(grid,rowIndex,colIndex,cellKey) {
           var row = grid.dataModel.data[rowIndex],
               metaRow = grid.metaRowInfo.rows[row.metaRowIndex];
           this.form.getUIProcess().doCellValueChanged(grid,rowIndex,colIndex,cellKey);

           var valueChanged = metaRow.cells[colIndex].valueChanged;
           if (valueChanged !== undefined && valueChanged.length > 0) {
               form.eval($.trim(valueChanged), {form: form, rowIndex: rowIndex}, null);
           }
       }

       this.postFireCellValueChanged = function(grid,rowIndex,colIndex,cellKey) {
           this.form.getUIProcess().doPostCellValueChanged(grid,rowIndex,colIndex,cellKey);
       }

   }
})();
(function () {
    YIUI.Paras = function (json) {
    	var Return = {
	    	map: {},
	    	mapType: {},
			put: function(key, value) {
				this.map[key] = value;
			},
			get: function(key) {
				return this.map[key];
			},
			getMap: function() {
				return this.map;
			},
			init: function() {
				if($.isEmptyObject(json)) return;
				var items = json.items;
				for (var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					this.put(item.key, item.value);
					this.mapType[item.key] = item.type;
				}
			},
			toJSON: function() {
				var json = {};
				if (!$.isEmptyObject(this.map)) {
					var items = [];
					for(var m in this.map) {
						var v = this.map[m];
						var type = this.mapType[m];
						if(!type || type == -1) {
							if($.isNumeric(v)) {
								//TODO 判断类型是int还是long
								//int
//								type = YIUI.JavaDataType.USER_INT;
								//long
								type = YIUI.JavaDataType.USER_LONG;
							} else if(v instanceof Decimal) {
								type = YIUI.JavaDataType.USER_NUMERIC;
								v = v.toString();
							} else if(typeof v == "boolean") {
								type = YIUI.JavaDataType.USER_BOOLEAN;
							} else if(v instanceof Date) {
								type = YIUI.JavaDataType.USER_DATETIME;
								v = v.getTime();
							} else if(typeof v == "string") {
								type = YIUI.JavaDataType.USER_STRING;
							}
						}
						var item = {
							key: m,
							value: v || null,
							type: type
						}
						items.push(item);
					}
					json.items = items;
				}
				return $.toJSON(json);
			}
    	};
    	Return.init();
        return Return;
    }
})();(function () {
	YIUI.PPObject = function(obj) {
		var Return = {
			LONG: 1,
			ARRAY: 2,
			DATATABLE: 3,
			type: -1,
			operatorID: -1,
			operatorList: [],
			complexOperatorTable: null,
			init: function() {
				if ($.isNumeric(obj)) {
					this.type = this.LONG;
					this.operatorID = parseInt(obj);
				} else if (obj instanceof Array) {
					this.type = this.ARRAY;
					this.operatorList = obj;
				} else if (obj instanceof DataDef.DataTable) {
					this.type = this.DATATABLE;
					this.complexOperatorTable = obj;
				}
			},
			toJSON: function() {
				var jsonObj = {};
				jsonObj.Type = this.type;
				if (this.type == this.LONG) {
					jsonObj.OperatorID = this.operatorID;
				} else if (this.type == this.ARRAY) {
					var ja = [];
					for (var i = 0, len = this.operatorList.length; i < len; i++) {
						ja.push(this.operatorList[i]);
					}
					jsonObj.OperatorList = ja;
				} else if (this.type == this.DATATABLE) {
					var tblJson = YIUI.DataUtil.toJSONDataTable(this.complexOperatorTable);
					jsonObj.ComplexOperatorTable = tblJson;
				}
				return jsonObj;
			}

		};
		Return.init();
		return Return;
	};
})();(function () {
	YIUI.PrintURLs = {};
	YIUI.Print = {
		print: function(url, formKey) {
			var iframe = $("iframe[id='print_" + formKey + "']", document.body);
			if(iframe.length == 0) {
				iframe = $("<iframe src='"+url+"' style='display:none;'></iframe>").attr("id", "print_" + formKey);
	   			iframe.appendTo($(document.body));
			}
   			var win = iframe[0].contentWindow;
   			if(!YIUI.PrintURLs[formKey]) {
   				YIUI.PrintURLs[formKey] = [];
   			}
   			YIUI.PrintURLs[formKey].push(url);
   			win.print();
		},
		del: function(formKey) {
			var urls = YIUI.PrintURLs[formKey];
			if(urls && urls.length > 0) {
				var paras = {};
				paras.service = "PrintService";
				paras.cmd = "DeletePDF";
				paras.names = $.toJSON(urls);
				Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
				urls = [];
			}
		},
		delAll: function() {
			for(var key in YIUI.PrintURLs) {
		        YIUI.Print.del(key);
			}
		}
	};
    YIUI.PrintPreview = function (opts) {
    	var el = $("<div/>");
    	var url = opts.url;
    	var target = opts.target;
    	var formKey = opts.formKey;
    	var Return = {
			init: function() {
	   			if(!YIUI.PrintURLs[formKey]) {
	   				YIUI.PrintURLs[formKey] = [];
	   			}
	   			YIUI.PrintURLs[formKey].push(url);
	   			
				if(target == "self") {
					el.modalDialog(null, {title: "预览", showClose: false, width: "80%", height: "80%"});
					el.dialogContent().attr("id", "print-ct");
					//PDF预览
					var pdf = new PDFObject({url: url}).embed("print-ct");
					
				} else {
					window.open(url);
				}
			},
			setHeight: function(height) {
				el.css("height", height);
			}
    	};
    	Return.init();
    }
})();/**
 * User: chenzs
 * Date: 14-2-14
 * Time: 下午2:58
 * 整个界面对象，包含所有信息
 */
YIUI.Form = YIUI.extend({
    init: function (jsonObj) {
        this.operationState = jsonObj["operationState"] ? jsonObj["operationState"] : YIUI.Form_OperationState.Default;
        this.initOperationState = jsonObj["initOperationState"] || YIUI.Form_OperationState.Default;
        this.type = jsonObj["type"];
        this.mergeOpt = jsonObj["mergeOpt"];
        this.options = jsonObj["options"];
        this.defTbr = jsonObj["defTbr"];
        this.OID = jsonObj["OID"] || -1;
        this.formID = jsonObj["formID"] || YIUI.Form_allocFormID();
        this.formKey = jsonObj["key"];
        this.formCaption = jsonObj["caption"];
        this.abbrCaption = jsonObj["abbrCaption"];
        this.target = jsonObj["target"];
        this.pFormID = jsonObj["parentID"];
        this.mainTableKey = jsonObj["mainTableKey"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];

        var rootPanelObj = block["rootPanel"];
        rootPanelObj.topMargin = jsonObj["topMargin"];
        rootPanelObj.bottomMargin = jsonObj["bottomMargin"];
        rootPanelObj.leftMargin = jsonObj["leftMargin"];
        rootPanelObj.rightMargin = jsonObj["rightMargin"];
        rootPanelObj.abbrCaption = jsonObj["abbrCaption"];
        rootPanelObj.hAlign = jsonObj["hAlign"];
        rootPanelObj.height = "100%";
        var options = {
            formID: this.formID,
            rootPanelObj: rootPanelObj,
            defCtKey: jsonObj["defCtKey"]
        };
        this.formAdapt = new YIUI.FormAdapt(options);
        this.standalone = jsonObj["standalone"] || false;
        this.relations = jsonObj["relations"];
        this.macroMap = jsonObj["macroMap"];
        this.statusItems = jsonObj["statusItems"];
        this.paraGroups = jsonObj["paraGroups"];
        this.sysExpVals = jsonObj["sysExpVals"];
        this.filterMap = jsonObj["filterMap"] === undefined ? null : new FilterMap(jsonObj["filterMap"]);
        this.dependency = jsonObj["dependency"];
        this.paras = new YIUI.Paras(jsonObj["parameters"]);
        this.callParas = new YIUI.Paras(jsonObj["callParameters"]);
        this.paraCollection = jsonObj["paraCollection"];
        this.checkRules = jsonObj["checkRules"];
        this.subDetailInfo = jsonObj["subDetailInfo"];
        this.mapGrids = jsonObj["mapGrids"];
        this.errorInfo = {error: jsonObj["isError"], errorMsg: jsonObj["errorMsg"], errorSource: jsonObj["errorSource"]};
        this.dataObjectKey = jsonObj["dataObjectKey"] || null;
        this.refObjectKey = jsonObj["refObjectKey"] || null;
        this.refTableKey = jsonObj["refTableKey"] || null;
        this.postShow = jsonObj["postShow"] || null;
        this.parser = new View.Parser(this);
        this.uiProcess = new YIUI.UIProcess(this);
        this.viewDataMonitor = new YIUI.ViewDataMonitor(this);
        this.result = null;
        this.eventList = {};
        this.timerTask = jsonObj["timerTask"];
        this.defaultUIStatusProxy = new YIUI.DefaultStatusProxy(this);
        var workitemInfo = this.sysExpVals ? this.sysExpVals[YIUI.BPMConstants.WORKITEM_INFO] : null;
        if (jsonObj["hostUIStatusProxy"] && workitemInfo != null) {
            this.hostUIStatusProxy = new YIUI.HostStatusProxy(workitemInfo);
        }
        YIUI.FormStack.addForm(this);
    },
    
    getOID: function() {
        var document = this.getDocument();
        if(document) {
        	return document.oid;
        } else {
        	return this.OID;
        }
    },
    
    setSysExpVals: function(key, value) {
    	if (!this.sysExpVals) {
			this.sysExpVals = {};
		}
		this.sysExpVals[key] = value;
    },
    
    getSysExpVals: function(key) {
    	if (this.sysExpVals) {
			return this.sysExpVals[key];
		}
		return null;
    },

    isStandalone: function () {
        return this.standalone;
    },
    setResult: function (result) {
        this.result = result;
    },
    getResult: function () {
        return this.result;
    },

    setAbbrCaption: function (abbrCaption) {
        this.abbrCaption = abbrCaption;
    },
    getAbbrCaption: function () {
        return this.abbrCaption;
    },

    getFormAdapt: function () {
        return this.formAdapt;
    },
    
    addOpt: function(tbr, expOpts, optMap) {
    	var items = expOpts.items;
    	for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			item.formID = expOpts.formID;
			tbr.items.push(item);
			optMap[item.key] = {
				barKey: this.defTbr, 
				opt: item
			};
		}
		this.cFormID = expOpts.formID;
		this.hasMerge = true;
    },
    
    delOpt: function(tbr, expOpts, optMap) {
    	var items = expOpts.items;
		var len = items.length;
		var len2 = tbr.items.length;
		tbr.items.splice(len2 - len, len);
		this.hasMerge = false;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			delete optMap[item.key];
		}
    },

    getOptMap: function () {
    	var optMap = this.formAdapt.getOptMap();
    	var expOpts = this.expOpts;
        if(this.mergeOpt) {
        	var defTbr = this.defTbr;
        	var tbr = this.getComponent(defTbr);
        	if(this.cFormID) {
        		var cFormID = expOpts.formID;
    			var cForm = YIUI.FormStack.getForm(cFormID);
    			this.delOpt(tbr, expOpts, optMap);
        		if(!cForm) {
    				this.cFormID = null;
        		} else {
    				expOpts.formID = cForm.formID;
    				this.addOpt(tbr, expOpts, optMap);
        		}
        	} else if(!this.hasMerge) {
    			this.addOpt(tbr, expOpts, optMap);
        	}
        }
      return optMap;
    },
    setError: function (error, errorMsg, errorSource) {
        this.errorInfo = {error: error, errorMsg: errorMsg, errorSource: errorSource};
        if (error) {
            this.showErrMsg(errorMsg);
        } else {
            this.hideErrMsg();
        }
    },
    getCellSubDtlComps: function (gridKey, cellKey) {
        var map = this.formAdapt.getCellSubDtlCompMap();
        if (map == null) return null;
        var gridMap = map[gridKey];
        if (gridMap == null) return null;
        return gridMap[cellKey];
    },
    getGridInfoMap: function () {
        return this.formAdapt.getGridMap();
    },
    getGridInfoByTableKey: function (tableKey) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.tableKey == tableKey) {
                return grid;
            }
        }
    },
    getGridInfoByKey: function (key) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.key == key) {
                return grid;
            }
        }
    },
    getListView: function (arg) {
        return this.formAdapt.getListView(arg);
    },

    diff: function (jsonObj) {
        this.operationState = jsonObj["operationState"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];
        var rootPanelObj = block["rootPanel"];
        this.sysExpVals = jsonObj.sysExpVals;
        this.getRoot().diff(rootPanelObj);
        this.setError(jsonObj["isError"], jsonObj["errorMsg"], jsonObj["errorSource"]);
    },

    getComponentList: function () {
        return this.formAdapt.getCompList();
    },
    getComponent: function (comKey) {
        return this.formAdapt.getComp(comKey);
    },
    getPanel: function (key) {
        return this.formAdapt.getPanel(key);
    },
    setFormKey: function (formKey) {
        this.formKey = formKey;
    },
    getFormKey: function () {
        return this.formKey;
    },
    setFormCaption: function (formCaption) {
        this.formCaption = formCaption;
    },
    getFormCaption: function () {
        return this.formCaption;
    },
    getDataObjectKey: function () {
        return this.dataObjectKey;
    },
    getRoot: function () {
        return this.formAdapt.getRoot();
    },
    setDocument: function (document) {
        this.document = document;
    },
    getDocument: function () {
        return this.document;
    },
    showDocument: function () {
        var showData = new YIUI.ShowData(this);
        return showData.show();
    },
    setComponentValue: function (key, value, fireEvent) {
        this.formAdapt.setCompValue(key, value, fireEvent);
    },
    setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
        this.formAdapt.setCellValByIndex(key, rowIndex, colIndex, value, fireEvent);
    },
    getCellValByIndex: function (key, rowIndex, colIndex) {
        return this.formAdapt.getCellValByIndex(key, rowIndex, colIndex);
    },
    setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
        this.formAdapt.setCellValByKey(key, rowIndex, colKey, value, fireEvent);
    },
    getCellValByKey: function (key, rowIndex, colKey) {
        return this.formAdapt.getCellValByKey(key, rowIndex, colKey);
    },
    getComponentValue: function (key, cxt) {
    	var cellLocation = this.formAdapt.getCellLocation(key);
        var comp, value;
        if (cellLocation) {
            if (cxt == null) return null;
            comp = this.formAdapt.getComp(cellLocation.key);
            if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                return comp.getValue(cxt.rowIndex, cellLocation.column);
            } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                return comp.getValueAt(cxt.rowIndex, cellLocation.column);
            }
            var dataTable = this.getDocument().getByKey(cellLocation.tableKey);
            var rowIndex = cxt.rowIndex;
            dataTable.setPos(rowIndex);
            return dataTable.getByKey(cellLocation.columnKey);
        } else {
            comp = this.formAdapt.getComp(key);
            if (comp == undefined) {
                YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT_KEY, key);
            }
            value = comp.getValue();
            return value;
        }
    },
    getCellLocation: function (key) {
        return this.formAdapt.getCellLocation(key);
    },
    setFilterMap: function (filterMap) {
        this.filterMap = filterMap;
    },
    getFilterMap: function () {
        return this.filterMap;
    },
    getMainTableKey: function () {
        return this.mainTableKey;
    },
    setCondParas: function (conParas) {
        this.conParas = conParas;
    },
    getCondParas: function () {
        return this.conParas == null ? {} : this.conParas;
    },
    setInitOperationState: function (initOperationState) {
        this.initOperationState = initOperationState;
    },
    getInitOperationState: function () {
        return this.initOperationState;
    },
    setOperationState: function (operationState) {
        this.operationState = operationState;
    },
    getOperationState: function () {
        return this.operationState;
    },
    setOperationEnable: function (key, enable) {
        var toolbar = this.getComponent(this.defTbr);
        if( !toolbar )
            return;
        toolbar.setItemEnable(key, enable);
    },
    resetUIStatus: function (mask) {
        this.uiProcess.resetUIStatus(mask);
    },
    getUIProcess: function () {
        return this.uiProcess;
    },
    getViewDataMonitor: function() {
      return this.viewDataMonitor;
    },
    setDefContainer: function (defContainer) {
        this.formAdapt.setDefContainer(defContainer);
    },
    getDefContainer: function () {
        return this.formAdapt.getDefContainer()
    },
    setContainer: function (container) {
        var self = this;
        this.formAdapt.setContainer(container);
        self.initFirstFocus();
    },
    getContainer: function () {
        return this.formAdapt.getContainer();
    },
    newCxt: function () {
        return {form: this};
    },
    getRelations: function () {
        return this.relations;
    },
    setPara: function (key, value) {
        this.paras.put(key, value);
    },
    getPara: function (key) {
        return this.paras.get(key);
    },
    setCallPara: function (key, value) {
        this.callParas.put(key, value);
    },
    getCallPara: function (key) {
        return this.callParas.get(key);
    },
    getParaCollection: function () {
        return this.paraCollection;
    },
    getParas: function () {
        if (this.paras == undefined) {
            this.paras = {};
        }
        return this.paras;
    },
    getCallParas: function () {
        if (this.callParas == undefined) {
            this.callParas = {};
        }
        return this.callParas;
    },
//    setWorkitemInfo: function (workitemInfo) {
//        this.workitemInfo = workitemInfo;
//    },
//    getWorkitemInfo: function () {
//        return this.workitemInfo;
//    },
    setErrDiv: function (errDiv) {
        this.errDiv = errDiv;
        var self = this;
        window.setTimeout(function () {
            if (!self.isDestroyed) {
                self.setError(self.errorInfo.error, self.errorInfo.errorMsg, self.errorInfo.errorSource);
            }
        }, 0);
    },
    showErrMsg: function (msg) {
        if (!this.errDiv || this.errDiv.css("display") == "block") return;
        $("label", this.errDiv).text(msg);
        this.errDiv.show();
        var newH = this.getRoot().getHeight() - this.errDiv.height();
        var newW = this.getRoot().getWidth();
        this.getRoot().doLayout(newW, newH);
    },
    hideErrMsg: function () {
        if (!this.errDiv || this.errDiv.css("display") == "none") return;
        this.errDiv.hide();
        var newH = this.getRoot().getHeight();
        var newW = this.getRoot().getWidth();
        this.getRoot().doLayout(newW, newH);
    },
    reloadTable: function (key) {
        var document = this.getDocument();
        var filterMap = this.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DETAIL);
        var condParas = this.getCondParas();
        var paras = {};
        paras.service = "PureOpt";
        paras.cmd = "ReloadTable";
        paras.tableKey = key;
        paras.formKey = this.formKey;
        paras.filterMap = $.toJSON(filterMap);
        paras.condParas = $.toJSON(condParas);
        var table = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (table) {
            document.remove(key);
            document.add(key, table);
        }
    },
    initFirstFocus: function () {
        var self = this;
        var container = this.getContainer();
        var $el;
        if (container) {
            if (container[0] && container[0].tagName) {
                $el = container;
            } else {
                $el = container.container.el || container.container;
            }
        } else {
            $el = this.getRoot().container.el;
        }
        var tabList = this.getTabCompList(), comp = null;
        for (var i = 0, len = tabList.length; i < len; i++) {
            comp = tabList[i];
            if (comp == undefined || comp == null) continue;
            var tabPanel = $(comp.el).parents(".ui-tabs-panel");
            var isActive = (tabPanel.length > 0 && tabPanel[0].style.display !== "none") || (tabPanel.length == 0);
            if (comp.enable && comp.visible && isActive) {
                switch (comp.type) {
                    case YIUI.CONTROLTYPE.GRID:
                        comp.initFirstFocus();
                        break;
                    default:
                        comp.focus();
                        break;
                }
                break;
            }
        }
    },
    getParentForm: function () {
        return YIUI.FormStack.getForm(this.pFormID);
    },
    fireClose: function () {
        if (this.type != YIUI.Form_Type.Entity) {
            this.close();
            return true;
        }

        if (this.operationState == YIUI.Form_OperationState.Default || this.operationState == YIUI.Form_OperationState.Delete) {
            this.close();
            return true;
        }
        var options = {
            msg: "是否确定要关闭界面？",
            msgType: YIUI.Dialog_MsgType.YES_NO
        };
        var dialog = new YIUI.Control.Dialog(options);
        dialog.render();
        var $form = this;
        dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
            $form.close();
        });
        dialog.regEvent(YIUI.Dialog_Btn.STR_NO, function () {
        });
    },
    close: function () {
        var callback = this.getEvent(YIUI.FormEvent.Close);
        if (callback) {
            callback.doTask(this, null);
        }
        if (this.target == 2) {
            $("#" + this.formID).close();
            YIUI.FormStack.removeForm(this.formID);
        } else {
            this.getContainer().removeForm(this);
        }
    },
    eval: function (formula, context, callback) {
        if (formula) {
            return this.parser.eval(formula, context, callback);
        }
        return null;
    },
    eval2: function(formula, syntaxTree, evalContext, scope) {
    	if ( formula ) {
    		return this.parser.eval2(formula, syntaxTree, evalContext, scope);
    	}
    	return null;
    },
    evalByTree: function (tree, context, callback) {
        if (tree !== null && tree !== undefined) {
            return this.parser.evalByTree(tree, context, callback);
        }
        return null;
    },
    getSyntaxTree: function (script) {
        if (script.length == 0) {
            return null;
        } else {
            return this.parser.getSyntaxTree(script);
        }
    },
    toJSON: function () {
        var json = {};
        var jsonArr = this.formAdapt.toJSON();
        json.key = this.formKey;
        json.items = jsonArr;
        json.filterMap = this.getFilterMap();
        json.condParas = this.getCondParas();
        json.operationState = this.operationState;
        return $.toJSON(json);
    },
    destroy: function () {
        this.uiProcess = null;
        this.parser = null;
        this.document = null;
        this.dependency = null;
        this.isDestroyed = true;
        
//        YIUI.Print.del(this.formKey);
    },

    regEvent: function (key, callback) {
        if (!this.eventList) {
            this.eventList = {};
        }
        this.eventList[key] = callback;
    },

    getEvent: function (key) {
        var event = null;
        if (this.eventList) {
            event = this.eventList[key]
        }
        return event;
    },

    removeEvent: function (key) {
        if (this.eventList) {
            delete this.eventList[key];
        }
    },

    getTabCompList: function () {
        return this.tabCompList
    },
    getFocusManager: function () {
        if (!this.focusManager) {
            this.focusManager = new FocusPolicy(this);
        }
        return this.focusManager;
    },
    dealTabOrder: function () {
        this.tabCompList = [];
        var comp;
        for (var key in this.getComponentList()) {
            comp = this.getComponentList()[key];
            comp.setFocusManager(this.getFocusManager());
            if (comp.getMetaObj().crFocus && $.isNumeric(comp.getMetaObj().tabOrder) && comp.getMetaObj().tabOrder != -1) {
                this.tabCompList.push(comp);
            }
        }
        this.tabCompList.sort(function (comp1, comp2) {
            return comp1.getMetaObj().tabOrder - comp2.getMetaObj().tabOrder;
        });
        var unOrderCompList = [];
        this.getRoot().getNoTabOrderComps(unOrderCompList);
        this.tabCompList = this.tabCompList.concat(unOrderCompList);
        for (var i = 0, len = this.tabCompList.length; i < len; i++) {
            comp = this.tabCompList[i];
            if (comp == undefined) continue;
            comp.setTabIndex(i);
        }
    }
});

//自动生成formID
var formID = 1;
YIUI.Form_allocFormID = function () {
    return formID++;
};

YIUI.MetaForm = function(options) {
//	var meta = function(options) {
//		enable: null,
//		visible: null,
//		checkRule: null
//	};
//	return meta;
};var FocusPolicy = FocusPolicy || {};
(function () {
    FocusPolicy = function (form) {
        var Return = {
            form: form,
            requestNextFocus: function (comp) {
                if (comp == undefined || comp == null) {
                    Return.focusNextNode(0, Return.form.getTabCompList().length);
                } else {
                    Return.doFocusNext(comp.getTabIndex());
                }
            },
            doFocusNext: function (tabIndex) {
                var nextIndex = tabIndex + 1, len = Return.form.getTabCompList().length;
                if (nextIndex < len) {
                    Return.focusNextNode(nextIndex, len);
                } else {
                    Return.focusNextNode(0, len);
                }
            },
            focusNextNode: function (begin, len) {
                var match = false, index = begin;
                var matchNextNode = function (index) {
                    var comp = Return.form.getTabCompList()[index];
                    var tabPanel = $(comp.el).parents(".ui-tabs-panel");
                    var isActive = (tabPanel.length > 0 && tabPanel[0].style.display !== "none") || (tabPanel.length == 0);
                    if (comp.enable && comp.visible && isActive) {
                        if (comp.type == YIUI.CONTROLTYPE.GRID) {
                            comp.initFirstFocus();
                            return true;
                        } else {
                        	var el = comp.el[0]
                        	if(el.getBoundingClientRect().top < document.documentElement.clientHeight && el.getBoundingClientRect().left < document.documentElement.clientWidth) {
                        		comp.focus();
                        		return true;
                        	}
                        }
                    }
                    return false;
                };
                while (index < len && !match) {
                    match = matchNextNode(index);
                    index++;
                }
                if (!match) {
                    index = 0;
                    while (index < begin && !match) {
                        match = matchNextNode(index);
                        index++;
                    }
                }
            }
        };
        return Return;
    };
})();(function () {
    YIUI.FormAdapt = function (options) {
        var Return = {
            formID: -1,
            compList: {},
            cellMap: {},
            gridMap: [],
            cellSubDtlCompMap: {},
            LVMap: [],
            panelMap: [],
            optMap: {},
            rootPanel: null,
            defCtKey: null,
            init: function (rootPanelObj) {
                if (!rootPanelObj) return;
                this.rootPanel = YIUI.create(rootPanelObj);
                this.loadComp(this.compList, this.rootPanel);
            },

            loadComp: function (array, parentCom) {
                parentCom.ofFormID = this.formID;
                parentCom.id = parentCom.ofFormID + "_" + parentCom.getMetaObj().key;
                if (parentCom.type == YIUI.CONTROLTYPE.LISTVIEW || parentCom.type == YIUI.CONTROLTYPE.GRID) {
                    this.loadCellMap(this.cellMap, parentCom);
                }
                if (parentCom.items && (parentCom instanceof YIUI.Panel)) {
                    this.panelMap[parentCom.getMetaObj().key] = parentCom;
                    for (var i = 0; i < parentCom.items.length; i++) {
                        this.loadComp(array, parentCom.items[i]);
                    }
                } else {
                    if (parentCom.type == YIUI.CONTROLTYPE.TOOLBAR) {
                        this.loadOptMap(this.optMap, parentCom);
                    }
                }
                array[parentCom.getMetaObj().key] = parentCom;
                var cellKey = parentCom.getMetaObj().bindingCellKey;
                var p_gridKey = parentCom.getMetaObj().parentGridKey;
                if (cellKey != null && p_gridKey != null) {
                    var gridMap = this.cellSubDtlCompMap[p_gridKey];
                    if (gridMap == null) {
                        gridMap = {};
                        this.cellSubDtlCompMap[p_gridKey] = gridMap;
                    }
                    if (gridMap[cellKey] == null) {
                        gridMap[cellKey] = [];
                    }
                    gridMap[cellKey].push(parentCom);
                }
            },
            loadOptMap: function (array, parentCom) {
                for (var i = 0, item, len = parentCom.items.length; i < len; i++) {
                    item = parentCom.items[i];
                    array[item.key] = {barKey: parentCom.getMetaObj().key, opt: item};
                    if (item.items) {
                        for (var j = 0, subItem, jlen = item.items.length; j < jlen; j++) {
                            subItem = item.items[j];
                            array[subItem.key] = {barKey: parentCom.getMetaObj().key, opt: subItem};
                        }
                    }
                }
            },
            loadCellMap: function (array, parentCom) {
                var i, len, celllist, cellLocation;
                if (parentCom.type == YIUI.CONTROLTYPE.LISTVIEW) {
                    for (i = 0, len = parentCom.columnInfo.length; i < len; i++) {
                        var columnInfo = parentCom.columnInfo[i];
                        columnInfo.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation = {};
                        cellLocation.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation.key = parentCom.getMetaObj().key;
                        cellLocation.column = i;
                        cellLocation.columnKey = columnInfo.columnKey;
                        cellLocation.row = -1;
                        this.addCellLocation(columnInfo.key, cellLocation);
                    }
                    this.LVMap.push(parentCom);
                } else if (parentCom.type == YIUI.CONTROLTYPE.GRID) {
                    var cellKeys = parentCom.dataModel.colModel.cells;
                    var gridTmp = {
                        key: parentCom.getMetaObj().key,
                        tableKey: parentCom.getMetaObj().tableKey
                    };
                    this.gridMap.push(gridTmp);
                    for (var key in cellKeys) {
                        var cellKeyObj = cellKeys[key];
                        if (cellKeyObj == undefined || cellKeyObj == null || cellKeyObj.length == 0) continue;
                        cellLocation = this.getCellLocation(cellKeyObj.key);
                        if (!cellLocation) {
                            cellLocation = {};
                            this.addCellLocation(cellKeyObj.key, cellLocation);
                        }
                        cellLocation.key = parentCom.getMetaObj().key;
                        cellLocation.column = cellKeyObj.colIndex;
                        cellLocation.row = -1;
                        cellLocation.tableKey = parentCom.getMetaObj().tableKey;
                        cellLocation.columnKey = cellKeyObj.columnKey;
                        for (var m = 0, mlen = parentCom.metaRowInfo.rows.length; m < mlen; m++) {
                            var metaRow = parentCom.metaRowInfo.rows[m];
                            if (metaRow.cellKeys.indexOf(cellKeyObj.key) != -1 && metaRow.rowType != "Detail") {
                                cellLocation.row = m;
                                break;
                            }
                        }
                    }
                }
            },

            addCellLocation: function (key, cellLocation) {
                this.cellMap[key] = cellLocation;
                //if(this.cellMap[key]) {
                //	this.cellMap[key].push(cellLocation);
                //} else {
                //	this.cellMap[key] = new Array(cellLocation);
                //}
            },
            getOptMap: function () {
                return this.optMap;
            },
            getListView: function (arg) {
                if ($.isNumeric(arg)) {
                    var index = YIUI.TypeConvertor.toInt(arg);
                    return this.LVMap[index];
                } else {
                    for (var i = 0, len = this.LVMap.length; i < len; i++) {
                        var lv = this.LVMap[i];
                        if (lv.getMetaObj().tableKey == arg) {
                            return lv;
                        }
                    }
                }
            },

            getPanel: function (key) {
                return this.panelMap[key];
            },
            getCellSubDtlCompMap: function () {
                return this.cellSubDtlCompMap;
            },
            getGridMap: function () {
                return this.gridMap;
            },
            getCompList: function () {
                return this.compList;
            },
            getComp: function (comKey) {
                return this.compList[comKey];
            },
            getRoot: function () {
                return this.rootPanel;
            },
            setRootPanel: function (rootPanel) {
                this.rootPanel = rootPanel;
            },

            setCompValue: function (key, value, fireEvent) {
                if (this.getComp(key) == undefined) {
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT_KEY, key);
                }
                this.getComp(key).setValue(value, true, fireEvent);
            },
            setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        comp.setValByIndex(rowIndex, colIndex, value, true, fireEvent);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        if (comp.getRowDataAt(rowIndex).isDetail) {
                            comp.setValueAt(rowIndex, colIndex, value, true, fireEvent, true);
                        }
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByIndex: function (key, rowIndex, colIndex) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        value = comp.getValue(rowIndex, colIndex);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        value = comp.getValueAt(rowIndex, colIndex);
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        comp.setValByKey(rowIndex, colKey, value, true, fireEvent);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        if (rowIndex != -1 && comp.getRowDataAt(rowIndex).isDetail) {
                            comp.setValueByKey(rowIndex, colKey, value, true, fireEvent);
                        }
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.NO_CELL_CANNOT_SET_VALUE);
                }
            },
            getCellValByKey: function (key, rowIndex, colKey) {
                var comp = this.getComp(key);
                var type = comp == undefined ? -1 : comp.type, value;
                switch (type) {
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        value = comp.getValByKey(rowIndex, colKey);
                        break;
                    case YIUI.CONTROLTYPE.GRID:
                        value = comp.getValueByKey(rowIndex, colKey);
                        break;
                    default:
                        YIUI.ViewException.throwException(YIUI.ViewException.CANNNOT_GET_NO_CELL_VALUE);
                }
                return value;
            },
            getCellLocation: function (key) {
                return this.cellMap[key];
            },
            setDefContainer: function (defContainer) {
                this.defContainer = defContainer;
            },
            getDefContainer: function () {
                if (this.defCtKey) {
                    return this.getComp(this.defCtKey);
                }
                return null;
            },
            setContainer: function (container) {
                this.container = container;
            },
            getContainer: function () {
                return this.container;
            },
            toJSON: function () {
                var jsonArr = [],
                    rootPanel = this.rootPanel;
                this.compToJson(rootPanel, jsonArr);
                return jsonArr;
            },
            compToJson: function (panel, comps) {
                var items = panel.items, item, comp;
                for (var i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if (item instanceof YIUI.Panel) {
                        this.compToJson(item, comps);
                    } else if (!(item.type == YIUI.CONTROLTYPE.LISTVIEW || item.type == YIUI.CONTROLTYPE.GRID)) {
                        comp = {};
                        comp.key = item.getMetaObj().key;
                        if (item.type == YIUI.CONTROLTYPE.DATEPICKER) {
                            if (item.getValue()) {
                                comp.value = item.getValue().getTime();
                            } else {
                                comp.value = null;
                            }
                        } else {
                            comp.value = item.getValue();
                        }
                        comp.caption = item.caption;
                        comps.push(comp);
                    }
                }
            }
        };
        Return = $.extend(Return, options);
        Return.init(Return.rootPanelObj);
        return Return;
    };
})();
YIUI.FormBuilder = (function () {
    var Return = {
		
		build: function(jsonObj, target, pFormID, opt, filterMap) {
			var formJson = jsonObj.form,
            form = new YIUI.Form(formJson),
            document = jsonObj.document, doc,
            dictCaption = jsonObj.dictCaption;

            form.dealTabOrder();
	        if (document) {
	            doc = YIUI.DataUtil.fromJSONDoc(document);
                form.setDocument(doc);
	        }

            if(dictCaption){
                form.dictCaption = dictCaption;
            }

	        form.target = target || form.target;
            form.pFormID = pFormID || form.parentID;
            if(target == YIUI.FormTarget.MODAL || form.target == YIUI.FormTarget.MODAL) {
        		var popHeight = formJson.popHeight || "60%";
                var popWidth = formJson.popWidth || "40%";
                var dialogID = form.formID;
                var dialogDiv = $("<div id=" + dialogID + "></div>");
                
                var settings = {
            		title: form.formCaption, 
            		showClose: false, 
            		width: popWidth, 
            		height: popHeight
            	};
                var root = form.getRoot();
                settings.resizeCallback = function() {
					var dialogContent = dialogDiv.dialogContent();
					if(root.hasLayout) {
						root.doLayout(dialogContent.width(), dialogContent.height());
					} else {
						root.setWidth(dialogContent.width());
						root.setHeight(dialogContent.height());
					}
		        }
                dialogDiv.modalDialog(null, settings);
                form.getRoot().render(dialogDiv.dialogContent());
        	}
            return form;
		},
		
		diff: function(form, jsonObj) {
			var formJson = jsonObj.form,
            document = jsonObj.document, doc;
	        if (document) {
	            doc = YIUI.DataUtil.fromJSONDoc(document);
                form.setDocument(doc);
	        }
	        form.diff(formJson);
//	        var rootpanel = form.getRoot();
//	        rootpanel.doLayout(rootpanel.el[0].clientWidth, rootpanel.el[0].clientHeight);
            return form;
		}
    };

    return Return;
})();/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-5-6
 * Time: 下午3:08
 */
YIUI.FormStack = (function () {
    var Return = {
        addForm: function (form) {
            if (typeof this.formList == "undefined") {
                this.formList = new Array();
            }
            this.formList.push(form);
        },
        getForm: function (formID) {
        	for (var i = 0; i < this.formList.length; i++) {
				if(formID == this.formList[i].formID) {
					return this.formList[i];
				}
			}
            return null;
        },
        removeForm: function(formID) {
        	for (var i = 0; i < this.formList.length; i++) {
				if(formID == this.formList[i].formID) {
                    this.formList[i].destroy();
					this.formList.splice(i, 1);
				}
			}
        	
        },
        removeAll: function() {
        	if(!this.formList) return;
        	for (var i = 0; i < this.formList.length; i++) {
                this.formList[i].destroy();
			}
        	this.formList = [];
        }
    };
    return Return;
})();(function () {
	YIUI.FileChooser = function(serviceName, cmdName) {
		var Return = {
				init: function() {
					this.$input = $("<input type='file' name='file' data-url='upload' class='opt upbtn' />").appendTo($(document.body)).hide();
				},
				upload: function(options, callback) {
					this.options = options || {};
					this.callback = callback;
					this.$input.click();
				},
				install: function() {
					var self = this;
					this.$input.change(function() {
						var paras = $.extend({
							cmd: cmdName,
							service: serviceName,
							mode: 1
						}, self.options);
						$.ajaxFileUpload({
							url: Svr.SvrMgr.AttachURL,
							secureuri: false,
							fileElement: self.$input,
							data: paras,
							type: "post",
							success: function (data, status, newElement) {
								data = JSON.parse(data);
								if (data.success == false) {
									var error = data.error;
									var showMessage = error.error_info;
									var errorCode = error.error_code;
									if(errorCode != -1){
										errorCode = (parseInt(errorCode,10)>>>0).toString(16).toLocaleUpperCase();
										showMessage = errorCode + "<br/>" + showMessage;
									}
									$.error(showMessage);
								} else {
									if($.isFunction(self.callback)) {
										self.callback(data);
									}
								}
							},
							error: function (data, status, e) {
								alert(e);
							}
						});
					});
				}
		};
		Return.init();
		Return.install();
		return Return;
	};
})();