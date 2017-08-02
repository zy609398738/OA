YIUI.Control.ComboBox = YIUI.extend(YIUI.Control, {

    needRebuild: true,
    
    /**
     * 下拉框数据
     */
    //items: null,

    /**
     * 是否多选
     * @type Boolean
     */
    multiSelect: false,
    
    hasText: false,
    
    sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,

    /**
     * 是否可编辑
     * @type Boolean
     */
    editable : false,
    
    handler: YIUI.ComboBoxHandler,
    
    behavior: YIUI.ComboBoxBehavior,

    integerValue: false,

    init : function(options){
    	this.base(options);
    	this.multiSelect = (this.type == YIUI.CONTROLTYPE.CHECKLISTBOX);

        var meta = this.getMetaObj();
        this.multiSelect = meta.multiSelect || this.multiSelect;
        this.editable = meta.editable || this.editable;
        this.groupKey = meta.groupKey;
        this.globalItems = meta.globalItems;
        this.promptText = meta.promptText;
        this.integerValue = meta.integerValue || this.integerValue;
        this.sourceType = meta.sourceType || this.sourceType;
        this.items = meta.items;
        this.globalItems = meta.globalItems;
        this.queryParas = meta.queryParas;
        this.formula = meta.formula;
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    /** 设置输入提示 */
    setPromptText: function (promptText) {
    	this.yesCombobox.setPromptText(promptText);
    },
    setEditable: function(editable) {
    	if(this.multiSelect) {
    		this.editable = false;
    	} else {
    		this.editable = editable;
    	}
    	this.yesCombobox.setEditable(this.editable);
    },

    getFormatEl: function() {
    		return this.yesCombobox.getInput();
    },
	
    getCheckedValue : function (){

    },
    
	dependedValueChange: function(targetField, dependedField){
		this.needRebuild = true;
//		this.setText("");
        this.setValue(null, true, true, false, true);
	},
    
    checkEnd: function(value) {
    	this.value = value;
    	this.yesCombobox.setSelValue(value);
		// var text = this.getCaption(value);
  //       if (value) {
  //       	switch (this.sourceType) {
  //       	case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
  //       		this.handler.getComboboxItems(this);
  //       		text = this.getCaption(value);
  //       		break;
  //       	case YIUI.COMBOBOX_SOURCETYPE.QUERY:
  //       		text = value;
  //       		break;
  //       	default:
  //       		text = this.getCaption(value);
  //       	break;
  //       	}
  //       	if(!text && this.editable) {
  //           	text = value;
  //           }
  //       }
  //       this.setText(text);

        var _this = this;

        if(this.needRebuild){
            var formID = this.ofFormID;
            var form = YIUI.FormStack.getForm(formID);

            this.handler.getComboboxItems(form, this.getMetaObj())
                        .done(function(items){
                            if(items){
                                _this.setItems(items);
                                var caption = _this.handler.getShowCaption(_this.sourceType, items, value, _this.multiSelect, _this.editable);
                                _this.setText(caption);
                            }else{
                                console.log('field key :'+_this.getMetaObj().key+' combobox items is null.');
                            }
                            _this.needRebuild = false;
                        });
        }else{
            var caption = _this.handler.getShowCaption(_this.sourceType, this.yesCombobox.getItems(), value, _this.multiSelect, _this.editable);
            _this.setText(caption);
        }
        
        if (this.getValue() == "0"){
        	var caption = this.yesCombobox.getItemCaption(this.getValue());
        	if(caption){
        		this.text = caption;
            	this.setText(this.text);
        	}
        }
        
	},
    
    /**
     * 获取下拉选项
     */
    
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
    	this.yesCombobox && this.yesCombobox.destroy();
    },
    
    getValue: function() {
    	return this.integerValue ? YIUI.TypeConvertor.toInt(this.value) : this.value;
    },
    
  //   getCaption: function(value) {
  //   	var caption = "";
  //       if (value) {
  //           switch (this.sourceType) {
  //           case YIUI.COMBOBOX_SOURCETYPE.QUERY:
  //           	caption = value;
  //               break;
  //           case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
  //           	this.handler.getComboboxItems(this);
  //           default:
	 //        	if(this.multiSelect) {
	 //        		var values = value.split(",");
	 //        		for (var i = 0, len = values.length; i < len; i++) {
	 //        			if(i > 0) {
	 //        				caption += ",";
	 //        			}
	 //        			caption += this.getItemCaption(values[i]);
	 //    			}
	 //        	} else {
	 //        		caption = this.getItemCaption(value);
	 //        	}
  //               break;
  //           }
  //       }
  //   	return caption;
  //   },
    
  //   getItemCaption: function(value) {
  //   	var caption = "";
  //   	for (var i = 0, len = this.items.length, item; i < len; i++) {
		// 	item = this.items[i];
		// 	if(item.value == value) {
  //   			caption = item.caption;
  //   			break;
  //   		}
		// }
  //   	return caption;
  //   },

    focus: function () {
        $("input", this.el).focus();
    },
    
    setSourceType: function(sourceType) {
    	this.sourceType = sourceType;
    },
    
    install: function() {
    	var self = this;
    	$("input", this.el).bind("keydown", function(e){
        	if(!self.enable) {
        		return false;
        	}
            var keyCode = e.keyCode || e.charCode;
            if (keyCode == 9 || keyCode === 13 || keyCode === 108) {
                self.focusManager.requestNextFocus(self);
                e.preventDefault();
            }
        	
    	});
    },
    
    /** 完成button的渲染 */
    onRender: function (ct) {
        this.base(ct);
    	var self = this;
        var formID = this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);
    	this.yesCombobox = new YIUI.Yes_Combobox({
    		el: self.el,
    		multiSelect: self.multiSelect,
    		required: self.required,
    		items: self.items,
    		value: self.value,
    		integerValue: this.getMetaObj().integerValue,

            checkItems : function(){
                var def = $.Deferred();
                if(self.needRebuild){
                    self.handler.getComboboxItems(form, self.getMetaObj())
                                .done(function(items){
                                    self.setItems(items);
                                    self.needRebuild = false;
                                    def.resolve();
                                });
                }else{
                    def.resolve()
                }
                return def.promise();
            },

            isEnable: function() {
            	return self.enable;
            },
    	    doSuggest: function(value) {
                var def = $.Deferred();
            	this.checkItems().done(function() {
            		var items = self.items, viewItems = [], exp = ".*";
                    for (var i = 0, len = value.length; i < len; i++) {
                    	exp += value.charAt(i);
                    	exp += ".*";
                    }
                    var reg = new RegExp(exp,"i");
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].caption != null) {
                            if (items[i].caption.match(reg)) viewItems.push(items[i]);
                        }
                          if (viewItems.length == 5) break;
                      }
                    def.resolve(viewItems);
            	});
                return def.promise();
    	    },
    	    commitValue : function (value){
    			self.setValue(value, true, true, false, true);
    			if(value == null) {
    				self.setText("");
    			}
    	    }
    	});
        this.el.addClass("ui-cmb");
        if(this.value != null) {
            this.checkEnd(this.value);
        }
        this.promptText && this.setPromptText(this.promptText);
		this.sourceType && this.setSourceType(this.sourceType);
		//this.setItems(this.items);
       


        //this._dropView.html(comboboxListHtml);
//        this.hideComboList();
//        var value = this.getValue();
//        this.checkItem(value);
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