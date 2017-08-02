/**
 * 分割按钮
 * */
YIUI.Control.SplitButton = YIUI.extend(YIUI.Control, {

    autoEl: '<div class="ui-splbtn btn-group"></div>',
    handler: YIUI.SplitButtonHandler,
    behavior: YIUI.SplitButtonBehavior,
    _hasShow : false,
    /**
     * 图标
     */
    icon: '',
    caption: '',
    /** ["xxx","xxx","xxx"...] */
    dropdownItems: [],

    setTip: function (tip) {
        var tip = this.caption;
        this.base(tip);
    },
    
    onRender: function(ct){
    	this.base(ct);
    	var el = this.getEl(),
    		dropdownItems = this.dropdownItems,
    		caption = this.caption,
			buttonLeft = this.buttonLeft = $('<button/>').attr('class', 'btn btn-left').appendTo(el),
			buttonRight = this.buttonRight = $('<button/>').attr('class','btn dp-tgl').attr('data-toggle','dropdown').appendTo(el),
			span = $('<span class="arrow"/>').appendTo(buttonRight);
    	this.getMetaObj().icon && this.setIcon(this.getMetaObj().icon);
		$('<label/>').text(caption).appendTo(buttonLeft);
    	
    	if(dropdownItems.length > 0) {
    		var div = this._dropView = $('<div class="sp-vw"/>').attr('id',this.id+"_dropdown").appendTo($(document.body));
    		var	uls = $('<ul/>').appendTo(div);
    		for(var i=0; i<dropdownItems.length; i++){
    			var li = $('<li></li>').appendTo(uls);
				if(dropdownItems[i].separator) {
					li.attr("role", "separator").addClass("sep");
				} else {
					$('<a>'+dropdownItems[i].text+'</a>').appendTo(li);
					li.attr("key", dropdownItems[i].key);
				}
    		}
    	}
    },
    
    setIcon: function(icon) {
    	this.icon = icon;
    	if ($("span.icon", this.el).length == 0) {
        	$('<span class="icon"/>').css("background-image", "url(Resource/" + icon + ")").appendTo(this.buttonLeft);
        } else {
            $("span.icon", this.el).css("background-image", "url(Resource/" + icon + ")");
        }
    },

    setEnable: function(enable) {
    	this.enable = enable;
    	var el = this.buttonLeft,
		outerEl = this.el;
    	if(this.enable) {
			el.prev().removeAttr('disabled');
			outerEl.removeClass("ui-readonly");
		} else {
			el.prev().attr('disabled', 'disabled');
			outerEl.addClass("ui-readonly");
		}
    },
    
    setFormatStyle: function(cssStyle) {
		$("label", this.buttonLeft).css(cssStyle);
	},
    
    onSetWidth : function(width) {
    	this.el.css("width", width);
    	var width_l = width - this.buttonRight.outerWidth();
    	this.buttonLeft.css("width", width_l);
    	$("label", this.buttonLeft).css("width", width_l - $("span.icon", this.el).outerWidth() - 12);
	},
	
	onSetHeight : function(height) {
    	this.el.css("height", height);
		this.buttonLeft.css("height", height);
		this.buttonRight.css("height", height);
		var icon = $("span.icon", this.el);
		icon.css("top", (height - icon.height() - 2) / 2);
	},
    
    setDisabled : function(disabled) {
    	this.base(disabled);
    	
    	var children = this.getEl().children();
    	$.each(children, function() {
    		if(disabled) {
    			$(this).attr('disabled', 'disabled');
    		} else {
    			$(this).removeAttr('disabled');
    		}
    	});
    },
    
    hideDropdownList: function() {
    	this._dropView && this._dropView.hide();
        this._hasShow = false;
		this.el.removeClass("focus");
    },
    
    setDropViewTop: function() {
    	var cityObj = this.el;
	    var cityOffset = this.el.offset();
	
	    var bottom = $(window).height() - cityOffset.top - cityObj.outerHeight();
        var top = cityOffset.top + cityObj.outerHeight();
        if(bottom < this._dropView.outerHeight()) {
        	this._dropView.addClass("toplst");
        	this.el.addClass("toplst");
        	top = "auto";
        	bottom = $(window).height() - cityOffset.top;
        } else {
        	this._dropView.removeClass("toplst");
        	this.el.removeClass("toplst");
        	bottom = "auto";
        }
        if(top != "auto") {
        	this._dropView.css("top", top + "px");
        	this._dropView.css("bottom", "auto");
        }
        if(bottom != "auto") {
        	this._dropView.css("bottom", bottom + "px");
        	this._dropView.css("top", "auto");
        }
//        this._dropView.css("width", cityObj.outerWidth()+"px");
    },
    
    setDropViewLeft: function() {
    	var cityObj = this.el;
	    var cityOffset = this.el.offset();
	
    	var right = $(window).width() - cityOffset.left;
        var left = $(window).width() - this._dropView.outerWidth();
        if(right < this._dropView.outerWidth()) {
        	left = "auto";
        	right = $(window).width() - cityOffset.left - cityObj.outerWidth();
        } else {
        	left = cityOffset.left;
        	right = "auto";
        }
        if(left != "auto") {
        	this._dropView.css("left", left + "px");
        	this._dropView.css("right", "auto");
        }
        if(right != "auto") {
        	this._dropView.css("right", right + "px");
        	this._dropView.css("left", "auto");
        }
    },
    
    afterRender: function() {
    	this.base();
    	if(this.format) {
    		if(this.format.foreColor) {
    			this.buttonLeft.css("color", this.format.foreColor);
    			this.buttonRight.css("color", this.format.foreColor);
    		}
    		if(this.format.backColor) {
    			this.el.css("background-color", "rgba(0, 0, 0, 0)");
    			this.buttonLeft.css("background-color", this.format.backColor);
    			this.buttonRight.css("background-color", this.format.backColor);
    		}
    	}
    },
    
    initDefaultValue: function(options) {
    	this.base(options);
		this.dropdownItems = options.dropdownitems;
		
		this._dropView = $(".sp-vw", this.el).attr("id", this.el[0].id + "_dropdown");
		$("a", this.el).css("line-height", $("a", this.el).height() + "px");
		this.buttonLeft = $(".btn-left", this.el);
		this.buttonRight = $(".btn-right", this.el);
		this.buttonLeft.css({
			"width": (this.el.outerWidth() - this.buttonRight.outerWidth()),
			"padding": 0,
			"height": this.el.outerHeight()
		});
		this.buttonRight.css("height", this.el.outerHeight());
		$("label", this.buttonLeft).css("width", this.buttonLeft.width());
    },


    beforeDestroy: function() {
        this._dropView && this._dropView.remove();
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },
    /** 
	 * 给DOM添加事件监听。
	 */
	install : function() {
		var self = this;
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
		self.buttonRight.click(function(event) {
			if(!self.enable) {
        		return;
        	}
			self.el.addClass("focus");
			if(self._hasShow){
	            self.hideDropdownList();
	            self._hasShow = false;
	            return;
	        }

    		$(document).on("mousedown",function(e){
	            var target = $(e.target);
	
	            if((target.closest(self._dropView).length == 0)
	                &&(target.closest(self.buttonLeft).length == 0)
	                &&(target.closest(self.buttonRight).length == 0)){
	            	
	                self.hideDropdownList();
	                $(document).off("mousedown");
	            }
	        });

            if (!self._dropView) return;
            
			self.setDropViewTop();
		    self.setDropViewLeft();
		    
		    self._dropView.css( "z-index", $.getZindex( self.el ) + 1 );
		    
	        //下拉内容显示的位置
	        self._dropView.slideDown("fast")
		    self._dropView.width(self.el.width() - 3 );
		    if(self._dropView[0].scrollWidth > self._dropView[0].clientWidth) {
		    	self._dropView.children("ul").width(self._dropView[0].scrollWidth);
		    }
		    
	        self._hasShow = true;
	        event.stopPropagation();
		});
		if(!this.disabled) {
			var self = this;
			this.buttonLeft.bind('click', function(){
				self.handler.doOnClick(self);
				if(!self.enable) {
	        		return;
	        	}
				self.el.addClass("focus");
			});
			this.buttonLeft.bind('blur', function() {
				self.el.removeClass("focus");
			})

			var dropdownMenu = $("#"+this.id+"_dropdown");
			$("li", dropdownMenu).bind('click', function(){
				self.handler.doOnClick(self, $(this).attr("key"));
				self.hideDropdownList();
			});
		} 
	}
});

YIUI.reg('splitbutton',YIUI.Control.SplitButton);