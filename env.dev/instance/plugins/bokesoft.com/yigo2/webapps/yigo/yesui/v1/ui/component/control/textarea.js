/**
 * 文本域，主要是提供文本字符类型数据输入
 */

YIUI.Control.TextArea = YIUI.extend(YIUI.Control, {
    
    autoEl: '<span/>',

    handler: YIUI.TextAreaHandler,
    
    behavior: YIUI.TextAreaBehavior,
    
    _input: "",

    /**
     * Number。
     * 允许输入的最大长度。
     */
    maxLength: Number.MAX_VALUE,

    checkEnd: function(value) {
    	this.value = value;
    	if (this.el) {
            this._input.val(value);
        }
    },
    
    getShowText: function() {
    	return this.value;
    },

    setTip: function (tip) {
        var tip = this._input.val();
        this.base(tip);
    },
    
    getValue: function() {
    	return this._input.val();
    },
    
    /** 
	 * 设置控件是否可编辑。
	 * @param editable：Boolean。
	 */
	setEnable : function(enable) {
		this.enable = enable;
		var el = this._input,
			outerEl = this.getOuterEl();
		if(this.enable) {
			el.removeAttr('readonly');
			outerEl.removeClass("ui-readonly");
		} else {
			el.attr('readonly', 'readonly');
			outerEl.addClass("ui-readonly");
		}
	},
	
    onSetHeight: function(height) {
    	this.el.css('height',height+'px');
    	this._input.css('height',height+'px');
//    	if($.browser.isIE) {
//    		this._input.css('line-height',(height-2)+'px');
//    	}
    },
    
    onSetWidth: function(width) {
    	this.el.css('width', width+'px');
    	this._input.css('width', width+'px');
    },
    
    /**
     * input外层wrap了一层span。
     */
    getOuterEl : function() {
    	return this.el;
    },

    /**
     * 处理差异
     * @param {} diffJson
     */
    diff: function(diffJson){
    	this.base(diffJson);
	},
	
	/** 设置允许输入的最大长度 */
	setMaxLength : function(maxLength) {
		if($.isNumeric(maxLength) && maxLength > 0) {
			this.maxLength = maxLength;

			// 默认不设置最大长度
			if(maxLength != Number.MAX_VALUE) {
				this._input.attr('maxLength', maxLength);
			}
		}
	},
    
	setFormatStyle: function(cssStyle) {
		this._input.css(cssStyle);
	},
	
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this._input.css('color', foreColor);
    },
	
    /** 
	 * 控件渲染到界面，不包含items的渲染。
	 */
    onRender: function (parent) {
        this.base(parent);
        var el = this.el;
		el.addClass("ui-txta");
		this._input = $("<textarea/>").val(this.value).appendTo(el);
		this.setMaxLength(this.getMetaObj().maxLength);
        this.setValue(this.value);
        
    },

	afterRender : function() {
		this.base();
		if(this.mask) {
			this._input.mask(this.mask);
		}
	},
	
	initDefaultValue: function(options) {
		this.base(options);
		this._input = $("input", options.el);
		
		if(!options.selectonfocus) {
			this.selectOnFocus = options.selectonfocus;
		}
		if(options.error) {
			this.setError(options.error);
		}
		
		var height = this.el.height();
    	if($.browser.isIE) {
    		this._input.css('line-height',(height-2)+'px');
    	}
    	
    },
    focus: function () {
        this._input.focus();
    },
    install: function() {
    	this.base();
    	var self = this;
    	self._input.on('click',function(event) {
    		if(self.needSelectAll) {
    			self.selectOnFocus && this.select();
    			self.needSelectAll = false;
    		}
		}).on('focusin', function(event) {
			if(self.selectOnFocus) {
				self.needSelectAll = true;
			}
		}).on('blur', function(event) {
    		var curValue = event.target.value;
            if (curValue != self.value) {
            	self.setValue(curValue, true, true);
            }
		}).on('keypress', function(event) {
			if($(this).val().length >= self.maxLength) {
				event.preventDefault();
				return true;
			}
		}).keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9) {   //Tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    	if($.browser.isIE) {
    		self._input.on('propertychange', function(event) {
    			if(this.value.length > self.maxLength) {
    				this.value = this.value.substring(0, self.maxLength);
    			}
        	});
    	}
    }

});
YIUI.reg('textarea', YIUI.Control.TextArea);
