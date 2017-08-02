YIUI.Control.ComboBox = YIUI.extend(YIUI.Control, {

    needRebuild: true,
    
    /**
     * 下拉框数据
     */
    items :null,

    /**
     * 是否多选
     * @type Boolean
     */
    multiSelect : false,
    
    hasText: false,
    
    sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,

    /**
     * 是否可编辑
     * @type Boolean
     */
    editable : true ,
    
    handler: YIUI.ComboBoxHandler,
    
    behavior: YIUI.ComboBoxBehavior,
    
    init : function(options){
    	this.base(options);
    	this.multiSelect = (options.type == YIUI.CONTROLTYPE.CHECKLISTBOX);
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setEditable: function(editable) {
    	if(this.multiSelect) {
    		this.editable = false;
    	} else {
    		this.editable = editable;
    	}
    	this.yesCombobox.setEditable(this.editable);
    },
	
    setEnable: function(enable){
    	this.enable = enable;
    	this.yesCombobox.setEnable(enable);
    },
    
    getCheckedValue : function (){

    },
    
	dependedValueChange: function(dependedField){
		this.needRebuild = true;
		this.setText("");
        this.setValue(null, true, true, false, true);
	},
    
    checkEnd: function(value) {
		var text = "";
        if (value) {
        	switch (this.getMetaObj().sourceType) {
        	case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
        		this.handler.getComboboxItems(this);
        		text = this.getCaption(value);
        		break;
        	case YIUI.COMBOBOX_SOURCETYPE.QUERY:
        		text = value;
        		break;
        	default:
        		text = this.getCaption(value);
        	break;
        	}
        	if(!text && this.getMetaObj().editable) {
            	text = value;
            }
        }
        this.setText(text);
        this.value = value;
        this.yesCombobox.setSelValue(value);
        this.checkItem(value);
	},
    
    /**
     * 获取下拉选项
     */
    getItems : function(){
    	this.handler.getComboboxItems(this);
    },
    
	setFormatStyle: function(cssStyle) {
		this.cssStyle = cssStyle;
		this.yesCombobox.setFormatStyle(cssStyle);
	},
	
    setBackColor: function (backColor) {
        this.backColor = backColor;
        $("input",this.getEl()).css({
            'background-image': 'none',
            'background-color': backColor
        });
    },

    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        $("input",this.getEl()).css('color', foreColor);
    },

    onSetWidth: function(width) {
    	this.yesCombobox.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesCombobox.setHeight(height);
    },
    
    /**
     * 设置下拉框显示值
     * @param {} text
     */
    setText: function (text) {
    	this.text = text;
        this.yesCombobox.setText(text);
    },
    
    getText: function() {
    	return this.text;
    },
    
    getShowText: function() {
    	return this.getText();
    },
    
    /**
     * 设置下拉内容
     * @param {} items
     */
    setItems: function(items) {
    	if(this.doDiff) return;
    	this.items = items;
    	this.yesCombobox.setItems(items);
    },
    	
    /**
     * 勾选节点
     * @param {} value
     */
    checkItem: function(value){
    	this.yesCombobox.checkItem(value);
    },
    
    beforeDestroy: function() {
    	this.yesCombobox.destroy();
    },
    
    getValue: function() {
    	var val = this.value;
    	if (this.getMetaObj().integerValue) {
    		val = YIUI.TypeConvertor.toInt(val);
    	}
    	return val;
    },
    
    getCaption: function(value) {
    	var caption = "";
    	if(this.multiSelect) {
    		var values = value.split(",");
    		for (var i = 0, len = values.length; i < len; i++) {
    			if(i > 0) {
    				caption += ",";
    			}
    			caption += this.getItemCaption(values[i]);
			}
    	} else {
    		caption = this.getItemCaption(value);
    	}
    	return caption;
    },
    
    getItemCaption: function(value) {
    	var caption = ""; 
    	for (var i = 0, len = this.items.length, item; i < len; i++) {
			item = this.items[i];
			if(item.value == value) {
    			caption = item.caption;
    			break;
    		}
		}
    	return caption;
    },

    focus: function () {
        $("input", this.el).focus();
    },
    
    install: function() {
    	this.base();
    	var self = this;
    	var index = -1;
    	var keyFocus = false;
    	var hideCombView = function() {
    		self.$combView && self.$combView.hide();
			self.selLi = null;
			$(".selected", self.$combView).removeClass("selected");
			var val = self.yesCombobox._textBtn.val();
			var items = self.items;
			var isHas = false;
			for (var i = 0; i < items.length; i++) {
				if (items[i].caption == val) {
					val = items[i].value;
					isHas = true;
				}
			}
			val = val == "" ? null : val;
			var integerVal = self.getMetaObj().integerValue;
      	    var editable = self.metaObj.editable;
      	    if (integerVal || editable == false) {
      	    	if (isHas == false) {
      	    		val = null;
      	    	}
      	    }
			self.setValue(val, true, true);
	    	index = -1;
    	};
    	$("input", self.el).bind("keyup", $.debounce(200, function(e){
    		if (self.yesCombobox._hasShow) {
    			 e.stopPropagation();
    			 return;
    		}
			if(self.multiSelect) return;
        	var value = $(this).val();
    		var keyCode = e.keyCode;
    		if(keyCode == 27) {
    			hideCombView();
    			return;
    		}
    		
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if(self.selLi && self.selLi.length > 0) {
                	self.selLi.mouseup();
                } else if (target.closest(self.yesCombobox.$suggestView).length == 0 
                		&& target.closest(self.yesCombobox._textBtn).length == 0) {
			    	hideCombView();
			    	var integerVal = self.getMetaObj().integerValue;
		      	    var editable = self.metaObj.editable;
                	var val = self.yesCombobox._textBtn.val();
			    	if (editable == true && integerVal == false) {
			    		self.setText(val);
			    	}
			    	$(document).off("mousedown");
                }
    			self.selLi = null;
            });
            
        	if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
        	if(keyCode == 13) {
        		if(self.selLi) {
        			index = -1;
        			self.selLi.mouseup();
        		}
        		return;
        	}
        	self.handler.doSuggest(self, value);

        }));
    	
    	$("input", self.el).bind("keydown", function(e){
    		if (self.yesCombobox._hasShow) {
				e.stopPropagation();
				return;
    		}
    		if(!keyFocus && self.sourceType == YIUI.COMBOBOX_SOURCETYPE.QUERY) {
    			keyFocus = true;
    			self.handler.getComboboxItems(self);
    		}
    		var keyCode = e.keyCode;
            var $suggestView = self.yesCombobox.$suggestView, $combView, isAutoView = false;;
            
            if(!$suggestView.is(":hidden") || (self.yesCombobox._dropView.is(":hidden") && (keyCode != 40))) {
            	$combView = $suggestView;
            	isAutoView = true;
            } else {
            	$combView = self.yesCombobox._dropView;
            }
            self.$combView = $combView;
            var maxLen = $("li", $combView).length;
            if(keyCode == 38) {
            	if(!isAutoView && self.yesCombobox._dropView.is(":hidden")) {
            		return;
            	}
            	index--;
            	if(index == -1) index = maxLen - 1;
            } else if(keyCode == 40) {
            	if(!isAutoView && self.yesCombobox._dropView.is(":hidden")) {
            		self.yesCombobox._dropBtn.click();
            		var $li = $("li.sel", self.yesCombobox._dropView).removeClass("sel");
            		index = $li.index();
            	}
            	index++;
            	if(index == maxLen) index = 0;
            } else if (keyCode == 9 || keyCode === 13 || keyCode === 108) {
                self.focusManager.requestNextFocus(self);
                if (keyCode == 9 && !self.yesCombobox._dropView.is(":hidden")) {
                    $(document).mousedown();
                }
                e.preventDefault();
            } else {
                return;
            }
            if (index == -1) return;
            self.selLi && self.selLi.removeClass("selected").removeClass("sel");
            var li = $combView.find("li:eq("+index+")");
            li.addClass("selected");
            self.selLi = li;

            var scrollHeight = self.yesCombobox._dropView.outerHeight() - self.yesCombobox._dropView[0].clientHeight;
            var scrollTop = li.position().top - self.yesCombobox._dropView.height() + li.height() + scrollHeight;
            self.yesCombobox._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
            
            if(!isAutoView) {
            	self.yesCombobox._textBtn.val(li.text());
            }
        	
    	});

    	$("input", self.el).blur(function() {
    		keyFocus = false;
	  	    var _this = $(this);
      	    var integerVal = self.getMetaObj().integerValue;
      	    var editable = self.metaObj.editable;
      	    var isHave = false;
      	    var val = self.yesCombobox._textBtn.val();
      	    var items = self.items;
  	    	if(self.multiSelect) {
  	    		var vs = val.split(",");
  	    		var allin = false;
  	    		for (var i = 0, len = vs.length; i < len; i++) {
					var v = vs[i];
					var isin = false;
					for (var j = 0; j < items.length; j++) {
      	    			var caption = items[j].caption;
      	    			if (caption == v) {
      	    				isin = true;
      	    				continue;
      	    			}
      	    		}
					if(isin) {
						allin = true;
						isin = false;
					} else {
						allin = false;
						break;
					}
				}
  	    		isHave = allin;
  	    	} else {
  	    		for (var i = 0; i < items.length; i++) {
  	    			var itemCaption = self.items[i].caption;
  	    			if (itemCaption != "" && itemCaption == val) {
  	    				isHave = true;
  	    				break;
  	    			}
  	    		}
  	    	}
	  	    if (integerVal || editable == false) {
	      	    if (isHave == false) {
	      	    	self.yesCombobox._textBtn.val("");
	      	    	self.setValue(null, true, true);
	      	    }
	  	    } else if(editable) {
	  	    	self.setValue(self.yesCombobox._textBtn.val(), true, true);
	  	    }
      	    
    	});
    },

	initDefaultValue: function(options) {
		this.base(options);
		if(options.multiSelect) {
			this.multiSelect = options.multiSelect;
		}
    	if(options.columnKey) {
			this.columnKey = options.columnKey;
		}
		if(options.tableKey) {
			this.tableKey = options.tableKey;
		}
		if(options.sourceType) {
			this.sourceType = options.sourceType;
		}
		if(options.evalItems) {
			this.evalItems = options.evalItems;
		}
		var self = this;
    	this.yesCombobox = new YIUI.Yes_Combobox({
    		el: self.el,
        	isPortal: true,
    		multiSelect: self.multiSelect,
    		items: self.items,
    		value: self.value,
        	isPortal: true,
    		getItems : function(){
    			self.handler.getComboboxItems(self);
    	    },
    	    hiding : function (){
    	    	var value = this.getSelValue();
    			self.setValue(value, true, true);
    	    }
    	});
    	
		this._dropView = $(".cmb_vw", this.el).appendTo($(document.body));
		$(".cmb_vw", this.el).remove();
		this._textBtn = $("input", this.el);
		this._dropBtn = $(".arrow", this.el);
		self._firstClick = false;
		this._textBtn.css({
			'width': this.el.outerWidth(),
			'height': this.el.outerHeight()});
        this._dropBtn.css({
            left: this._textBtn.outerWidth() - 26,
			top: (this._textBtn.outerHeight() -16) /2,
            height: "16px",
            width: "16px"});
    	if($.browser.isIE) {
    		this._textBtn.css('line-height',(this.el.outerHeight()-3));
    	}

        this.install();
    },
    setSourceType: function(sourceType) {
    	this.sourceType = sourceType;
    },
    /** 完成button的渲染 */
    onRender: function (ct) {
        this.base(ct);
    	var self = this;
    	this.yesCombobox = new YIUI.Yes_Combobox({
    		el: self.el,
    		multiSelect: self.multiSelect,
    		required: self.required,
    		items: self.items,
    		value: self.value,
    		intergerValue: this.getMetaObj().integerValue,
    		getItems : function(){
    			self.handler.getComboboxItems(self);
    	    },
    	    hiding : function (){
    	    	var value = this.getSelValue();
    			self.setValue(value, true, true, false, true);
    	    }
    	});
        this.el.addClass("ui-cmb");
        this.setValue(this.value);
        this.setText(this.text);

		if(this.getMetaObj().sourceType) {
	        this.setSourceType(this.getMetaObj().sourceType);
		}
		this.setItems(this.items);
        //this._dropView.html(comboboxListHtml);
//        this.hideComboList();
        var value = this.getValue();
        this.checkItem(value);
		//this._textBtn.val(this.getItemCaption(value));
        
    	
    	
		//if(this.multiSelect && value){
		//	var arr = this.getValue().split(",");
		//  	for(var index in  arr){
		//  		var checkedBoxes = this._dropView.find('input[type="checkbox"]')
		//		for(var i = 0 ; i <  checkedBoxes.length ; i++){
		//			if(arr[index] == checkedBoxes[i].value){
		//				checkedBoxes[i].checked = true;
		//				break;
		//			}
		//		}
		//  	}
		//}

    }
});
YIUI.reg('combobox', YIUI.Control.ComboBox);
YIUI.reg('checklistbox', YIUI.Control.ComboBox);