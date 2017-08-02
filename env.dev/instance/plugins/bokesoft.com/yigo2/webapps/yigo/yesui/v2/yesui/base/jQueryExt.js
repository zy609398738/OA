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

        isUndefined: function (v) {
            return typeof v == 'undefined';
        },

        isBoolean: function (o) {
            return typeof o === 'boolean';
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
            if (!$.isDefined(value) || value == null || value <= 0 || value == 'pref')
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
                    
        htmlEncode : function (value) {
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
