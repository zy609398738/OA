(function () {
    YIUI.Yes_Combobox = function (options) {
        var Return = {
            //dropView是否显示
            _hasShow: false,

            el: $("<div></div>"),

            _textBtn: $('<input type="text" />'),

            _dropBtn: $('<div/>'),

            _dropView: $('<div/>'),
            
            $suggestView: $('<div/>'),
            
            itemval : 0,
            
            promptText: null,
            /**
             * 是否展开完全
             * */
            isFinishExp: false,

            init: function () {
                this._textBtn.addClass('txt').appendTo(this.el);
                this._dropBtn.addClass('arrow').appendTo(this.el);
                this._dropView.addClass('cmb-vw').attr("id", this.el.attr("id") + "_view").appendTo($(document.body));
                this.$suggestView.addClass('cmb-autovw cmb-vw').appendTo($(document.body));
                if(this.multiSelect) {
                	this._textBtn.attr('readonly', 'readonly');
                }
                this.temp = "";
            },


            /**
             * 下拉框数据
             */
            items: null,
            /** 是否多选  */
            multiSelect: false,
            sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,
            /**  是否可编辑 */
            editable: false,
            getEl: function () {
                return this.el;
            },
            setEditable: function (editable) {
                this.editable = editable;
            },

            setFormatStyle: function (cssStyle) {
                this._textBtn.css(cssStyle);
            },

            setDropViewTop: function () {
                var cityObj = this._textBtn;
                var cityOffset = this._textBtn.offset();

                var bottom = $(window).height() - cityOffset.top - this.el.height();
                var top = cityOffset.top + cityObj.outerHeight();
                if (bottom < this._dropView.outerHeight()) {
                    this._dropView.addClass("toplst");
                    this.el.addClass("toplst");
                    top = "auto";
                    bottom = $(window).height() - $(this._textBtn).offset().top;
                } else {
                    this._dropView.removeClass("toplst");
                    this.el.removeClass("toplst");
                    bottom = "auto";
                }
                if (top != "auto") {
                    this._dropView.css("top", top + "px");
                    this._dropView.css("bottom", "auto");
                }
                if (bottom != "auto") {
                    this._dropView.css("bottom", bottom + "px");
                    this._dropView.css("top", "auto");
                }
            },

            setDropViewLeft: function () {
                var cityObj = this._textBtn;
                var cityOffset = this._textBtn.offset();

                var right = $(window).width() - $(this._textBtn).offset().left;
                var left = $(window).width() - this._dropView.outerWidth();
                if (right < this._dropView.outerWidth()) {
                    left = "auto";
                    right = $(window).width() - cityOffset.left - cityObj.outerWidth();
                } else {
                    left = cityOffset.left;
                    right = "auto";
                }
                if (left != "auto") {
                    this._dropView.css("left", left + "px");
                    this._dropView.css("right", "auto");
                }
                if (right != "auto") {
                    this._dropView.css("right", right + "px");
                    this._dropView.css("left", "auto");
                }
                this._dropView[0].style.width = cityObj.outerWidth() + "px";
                
            },

            getItemCaption: function (value) {
                if (value == null) return "";
                var caption = this._textBtn.val();

                var arr = new Array();
                arr[0] = value;

                if (this.multiSelect) {
                    arr = value.split(",");
                }

                var caption = new Array();

                for (var index in  arr) {
                    for (var obj in this.items) {
                        if (arr[index] == this.items[obj].value) {
                            caption.push(this.items[obj].caption);
                            break;
                        }
                    }
                }

                return caption.join(',');
            },
            
            /** 设置输入提示 */
            setPromptText: function (promptText) {
                this.promptText = promptText;
                this._textBtn.placeholder(this.promptText);
            },

            setWidth: function (width) {
                this.el.css('width', width + 'px');
                this._textBtn.css('width', width + 'px');
                this._dropBtn.css({left: this._textBtn.outerWidth() - 26 + "px"});
            },

            setHeight: function (height) {
                this.el.css('height', height + 'px');
                this._textBtn.css('height', height + 'px');
                if ($.browser.isIE) {
                    this._textBtn.css('line-height', (height - 3) + 'px');
                }
                this._dropBtn.css({top: (this._textBtn.outerHeight() - 16) / 2 + "px"});
            },


            destroy: function () {
                this._dropView.remove();
                this.$suggestView.remove();
            },

            commitValue: $.noop,
            
            doSuggest: $.noop,

            doFocusOut: $.noop,

		    isEnable: function() {
		    	return true;
		    },

            hideComboList: function () {
                this._dropView.hide();
                this._hasShow = false;
                this.isFinishExp = false;
		    	$(document).off("mousedown");
                this.commitValue(this.getSelValue());
            },


            /**
             * 设置下拉内容
             * @param {} items
             */
            setItems: function (items) {
                if (items == null) items = [];
                this.items = items;
                var comboboxListHtml = $('<ul/>'), _li;
                this._dropView.html(comboboxListHtml);
                for (var i = 0, len = items.length; i < len; i++) {
                	var val = items[i].value == undefined ? "" : items[i].value;
                    if (this.multiSelect) {
                    	var cap = items[i].caption == undefined ? "" : items[i].caption;
                        _li = $('<li><input type="checkbox"  itemValue="' + val + '"/><span>' + cap + '</span></li>');
                    } else {
                        _li = $('<li itemValue="' + val + '">' + (items[i].caption || "") + '</li>');
                        if(val == "") _li.addClass("empty");
                        if (this.value && this.value == items[i].value) {
                            _li.addClass("sel");
                            this._selectedLi = _li;
                        }
                    }
                    comboboxListHtml.append(_li);
                }
            },

            getItems: function(){
                return this.items;
            },

            /**
             * 勾选节点
             * @param {} value
             */
            checkItem: function (value) {
                if (this.multiSelect) {
        			var checkedBoxes = this._dropView.find('input[type="checkbox"]');
        			checkedBoxes.prop("checked", false);
                	if(value) {
                		var arr = value.split(",");
                		for (var index in  arr) {
                			for (var i = 0; i < checkedBoxes.length; i++) {
                				if (arr[index] == $(checkedBoxes[i]).attr("itemValue")) {
                					checkedBoxes[i].checked = true;
                					break;
                				}
                			}
                		}
                	}
                }
            },

            setSelValue: function (value) {
                this.value = value;
            },

            getSelValue: function () {
                return this.value;
            },

            setText: function (text) {
                this.text = text;
                this._textBtn.val(this.text);
                this.temp = text;
            },
            getText: function () {
                return this._textBtn.val();
            },
            
            getInput: function() {
            	return this._textBtn;
            },

            install: function () {
                var self = this;
//                $(window).resize(function () {
//                	self.itemval = 0;
//                	self.hideComboList();
//			    });
                this._dropBtn.mousedown(function (e) {
                	e.preventDefault();
                    if (!self.isEnable()) {
                        return;
                    }
                    if (self.isFinishExp){
                    	return;
                    }
                    self.isFinishExp = true;
                    if (self._hasShow == false) {
                    	$(this).addClass("arrowgif");
                        $(this).removeClass("arrow");
                    }
                    
                    self._textBtn.focus();
                    if (self._hasShow) {
                    	self.itemval = 0;
                        self.hideComboList();
                        return;
                    }

                    console.log('combobox mousedown');
                    self._dropView.children("ul").css("width", "auto");

                    self._hasShow = true;

                    self.checkItems().then(function(data){
                        self.checkItem(self.getSelValue());
                        
                        self.setDropViewTop();
                        self.setDropViewLeft();
                        self._dropView.slideDown(300, function(){
		    	    		self._dropBtn.removeClass("arrowgif");
			    			self._dropBtn.addClass("arrow");
			    			self.isFinishExp = false;
			    			var val = self.getText();
		                    var items = self._dropView.find("li");
	                        if (val == "") {
	                            items.removeClass("sel");
	                            self._dropView.scrollTop(0);
	                        }
	    //                    if (val != "") {
	    //                       finditem(val,items);
	    //                    }

	                        self._dropView.children("ul").css("width", self._dropView[0].scrollWidth);

		                    var ul = self._dropView.children("ul");
		                    if(ul.children().length == 0) {
		                    	ul.addClass("empty");
		                    	ul.html("无");
		                    } else {
		                    	ul.removeClass("empty");
		                    }

	                        if (self._selectedLi && (self._selectedLi.attr("itemValue") == self.getSelValue())) {
	                            var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
	                            var scrollTop = self._selectedLi.position().top - self._dropView.height() + self._selectedLi.height() + scrollHeight;
	                            self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
	                        } else {
	                            $(".sel", self._dropView).removeClass("sel");
	                            var $li = $("[itemValue='"+self.getSelValue()+"']");
	                            if($li.length > 0 && !$li.hasClass("empty")) {
	                                self._selectedLi = $li;
	                                $li.addClass("sel");
	                            }
	                        }

	                        $(document).on("mousedown", function (e) {
	                        	if (self.isFinishExp)
	                        		return;
	                            var target = $(e.target);
	                            if ((target.closest(self._dropView).length == 0 || $("ul li", self._dropView).length == 0)
	                                && (target.closest(self._dropBtn).length == 0)
	                                 && (target.closest(self._textBtn).length == 0)){
	                                self.itemval = 0;
	                                self.hideComboList();
	                            }
	                        });
		    	    	});

                    }, function(error){
                        self._hasShow = false;
                    });

//                     self.getItems();
//                     self.checkItem(self.getSelValue());
//                     self.setDropViewTop();
//                     self.setDropViewLeft();
//                     self._dropView.show();
// 					var val = self.getText();
//                     var items = self._dropView.find("li");
//                     if (val == "") {
//                     	items.removeClass("sel");
//                     	self._dropView.scrollTop(0);
//                     }
// //                    if (val != "") {
// //                    	 finditem(val,items);
// //                    }

//                     self._dropView.children("ul").css("width", self._dropView[0].scrollWidth);

//                     if (self._selectedLi && (self._selectedLi.attr("itemValue") == self.getSelValue())) {
//                         var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
//                         var scrollTop = self._selectedLi.position().top - self._dropView.height() + self._selectedLi.height() + scrollHeight;
//                         self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
//                     } else {
//                     	$(".sel", self._dropView).removeClass("sel");
//                     	var $li = $("[itemValue='"+self.getSelValue()+"']");
//                     	if($li.length > 0 && !$li.hasClass("empty")) {
//                     		self._selectedLi = $li;
//                     		$li.addClass("sel");
//                     	}
//                     }

//                     $(document).on("mousedown", function (e) {
//                         var target = $(e.target);

//                         if ((target.closest(self._dropView).length == 0)
//                             && (target.closest(self._dropBtn).length == 0)
//                         	 && (target.closest(self._textBtn).length == 0)) {
//                         	self.itemval = 0;

//                             self.hideComboList();
//                         }
//                     });

//                     self._hasShow = true;
                /*    $(this).removeClass("arrowgif");
                    $(this).addClass("arrow");*/
//                    e.stopPropagation();
                });
                
                var self = this;
            	var index = -1;
            	var keyFocus = false;
            	var hideCombView = function() {
            		self.$combView && self.$combView.hide();
        			self.selLi = null;
        			$(".selected", self.$combView).removeClass("selected");
//        			var val = self._textBtn.val();
//        			var items = self.items;
//        			var isHas = false;
//        			var itemval = null;
//        			for (var i = 0; i < items.length; i++) {
//        				if (items[i].caption == val) {
//        					val = items[i].value;
//                            itemval = self.items[i].value;
//        					isHas = true;
//        				}
//        			}
//        			val = val == "" ? null : val;
//        			var integerVal = self.integerValue;
//              	    var editable = self.editable;
//              	    if (integerVal || editable == false) {
//              	    	if (isHas == false) {
//              	    		val = null;
//              	    	}
//              	    }
//              	    
//
//                    if (integerVal || editable == false) {
//                        if (isHave == false) {
//                            self.setSelValue(null);
//                            self.commitValue(null);
//                        }
//                    } else if(editable) {
//                    	var changed = self.itemValue != itemval;
//                    	if(changed) {
//                    		self.setSelValue(val);
//                    		self.commitValue(val);
//                    		self.itemValue = val;
//                    	}
//                    }
              	    
//              	    self.setSelValue(val);
//        			self.commitValue(val);
        	    	index = -1;
            	};
            	this._textBtn.bind("keyup", $.debounce(200, function(e){
            		if (self._hasShow || !$(this).is(":focus")) {
            		    e.stopPropagation();
            		    return;
            	    }
        			if(self.multiSelect) return;
                	var value = $(this).val();
            		var keyCode = e.keyCode;
            		
            	    var items = self._dropView.find("li");
					items.removeClass("sel");
            	    if (keyCode != 13) {
            		    self.itemval = 0;
                	    if (self._hasShow && val != "") {
                		    finditem(value,items);
                		    e.stopPropagation();
                		   
                	    }
            	    }
            		
            		if(keyCode == 27) {
            			hideCombView();
            			return;
            		}
            		
                    $(document).on("mousedown", function (e) {
                        var target = $(e.target);
                        if(self.selLi && self.selLi.length > 0) {
                        	self.selLi.mouseup();
                        } else if (target.closest(self.$suggestView).length == 0 
                        		&& target.closest(self._textBtn).length == 0) {
        			    	hideCombView();
        			    	var integerVal = self.integerValue;
        		      	    var editable = self.editable;
                        	var val = self._textBtn.val();
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
            		var $view = self.$suggestView;
                	if(value) {
                		self.doSuggest(value).then(function(viewItems) {
    	                    if (viewItems.length == 0) {
    	                    	$view.empty().hide();
    	                        return;
    	                    }
    	                    var list = $('<ul/>'), _li;
    	                    $view = $view.html(list);
    	                    for (var i = 0, len = viewItems.length; i < len; i++) {
    	                        _li = $('<li itemValue="' + viewItems[i].value + '">' + viewItems[i].caption + '</li>');
    	                        list.append(_li);
    	                    }
    	                    var cityObj = $("input", self.el);
    	                    var cityOffset = cityObj.offset();
    	                    $view.css({
    	                        width: cityObj.outerWidth(),
    	                        top: cityOffset.top + cityObj.outerHeight(),
    	                        left: cityOffset.left
    	                    })
    	                    $view.show();
                    	});
                	} else {
                		$view.empty().hide();
                	}


                }));
            	
            	this._textBtn.bind("keydown", function(e){
            		if (self._hasShow) {
        	   			e.stopPropagation();
        	   			return;
            		}
            		if(!keyFocus && self.sourceType == YIUI.COMBOBOX_SOURCETYPE.QUERY) {
            			keyFocus = true;
            			self.handler.getComboboxItems(self);
            		}
            		var keyCode = e.keyCode;
                    var $suggestView = self.$suggestView, $combView, isAutoView = false;;
                    
                    if(!$suggestView.is(":hidden") || (self._dropView.is(":hidden") && (keyCode != 40))) {
                    	$combView = $suggestView;
                    	isAutoView = true;
                    } else {
                    	$combView = self._dropView;
                    }
                    self.$combView = $combView;
                    var maxLen = $("li", $combView).length;
                    if(keyCode == 38) {
                    	if(!isAutoView && self._dropView.is(":hidden")) {
                    		return;
                    	}
                    	index--;
                    	if(index == -1) index = maxLen - 1;
                    } else if(keyCode == 40) {
                    	if(!isAutoView && self._dropView.is(":hidden")) {
                    		self._dropBtn.click();
                    		var $li = $("li.sel", self._dropView).removeClass("sel");
                    		index = $li.index();
                    	}
                    	index++;
                    	if(index == maxLen) index = 0;
                    } else if (keyCode == 9 || keyCode === 13 || keyCode === 108) {
//                        self.focusManager.requestNextFocus(self);
                        if (keyCode == 9 && !self._dropView.is(":hidden")) {
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

                    var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
                    var scrollTop = li.position().top - self._dropView.height() + li.height() + scrollHeight;
                    self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
                    
                    if(!isAutoView) {
                    	//self._textBtn.val(li.text());
                    }
                	
            	});

            	this._textBtn.blur(function(e) {

                    if(self._hasShow){
                        return;
                    }

                    console.log('combobox blur...');
            		keyFocus = false;
            		var _this = $(this);
               	    var integerVal = self.integerValue;
               	    var editable = self.editable;
               	    var isHave = false;
               	    var val = self._textBtn.val();
               	    if(val == self.temp){ 
                        self.doFocusOut();
                        return;
                    }
               	    
                    self.checkItems().then(function(data){
                    	var tempVal;
                        var items = self.items;
                        var valins = [];
                        if(self.multiSelect) {
                            var vs = val.split(",");
                            var allin = true;
                            for (var i = 0, len = vs.length; i < len; i++) {
                                var v = vs[i];
                                var isin = false;
                                for (var j = 0; j < items.length; j++) {
                                    var caption = items[j].caption;
                                    if (caption == v) {
                                        isin = true;
                                        valins.push(items[j].value);
                                        continue;
                                    }
                                }
                                if(!isin) {
                                    allin = false;
                                }
                            }
                            isHave = allin;
                        } else {
                            for (var i = 0; i < items.length; i++) {
                                var itemCaption = self.items[i].caption;
                                if (itemCaption != "" && itemCaption == val) {
                                    isHave = true;
                                    tempVal = self.items[i].value;
                                    break;
                                }
                            }
                            if(!tempVal) {
                            	tempVal = val;
                            }
                        }
                        if (integerVal || editable == false) {
                            if (isHave == false) {
                            	var value = null;
                            	if(self.multiSelect) {
                            		value = valins.length == 0 ? null : valins.join(",");
                                	self.setSelValue(value);
                                	self.commitValue(value);
                            	} else {
                            		if(tempVal) {
                                    	self.setText(self.temp);
                                    } else {
                                    	self.setSelValue(value);
                                    	self.commitValue(value);
                                    }
                            	}
                            } else {
                            	self.setSelValue(tempVal);
                            	self.commitValue(tempVal);
                            }
                        } else if(editable) {
                        	var changed = self.value != tempVal;
                        	if(changed) {
                        		self.setSelValue(val);
                        		self.commitValue(val);
                        	}
                        }

                        self.doFocusOut();
                    });
               	   
            	});

                //节点绑定事件
                this._dropView.delegate("li", "mouseup", function (e) {
                	$(this).parent().find("li").removeClass("sel");
                    if (self.multiSelect) {
                        return;
                    }
                    if (self.isFinishExp) {
                    	return;
                    }
                    if (self._selectedLi) {
                        self._selectedLi.removeClass("sel");
                    }
                    if(!$(this).hasClass("empty")) {
                    	$(this).addClass("sel");
                    	self._selectedLi = $(this);
                    } else {
                    	self._selectedLi = null;
                    }
                    var value = $(e.target).attr("itemValue");
                    self.setSelValue(value);
                    //self._textBtn.val($(e.target).text());
                    self.hideComboList();
                });
                
                //节点绑定事件
                this.$suggestView.delegate("li", "mouseup", function (e) {
                	var value = $(e.target).attr("itemValue");
                	self.setSelValue(value);
                	//self._textBtn.val($(e.target).text());
                	self.$suggestView.hide();
                	self.commitValue(value);
                	self._selectedLi = $("li[itemvalue="+value+"]", self._dropView).addClass("sel");
    		    	$(document).off("mousedown");
    	            
                });
                
                //查询全部
                function finditem(val,items) {
            	    var itemval = self.itemval;
         		    var len = items.length;
         		    if (len != 0) {
         			    $.each(items,function(index,elem) {
         				    $(elem).parent().find("li").removeClass("sel");
         				    if($(elem).find("span").length == 0 && val != "" && $(elem).html().indexOf(val) != -1) {
         					    if (itemval == 0) {
         						    $(this).parent().parent().scrollTop(index*26);
         						    $(elem).addClass('sel');
         						    itemval = index;
         						    self.itemFlag = index;
         						    return false;
         					    }  
         				    } 
         				    if ($(elem).find("span").length != 0 && $(elem).find("span").html().indexOf(val) != -1) {
         					    if (itemval == 0) {
         						    $(this).parent().parent().scrollTop(index*26);
         						    $(elem).addClass('sel');
         						    itemval = index;
         						    self.itemFlag = index;
         						    return false;
         						 
         					    }
         				    }
         			    });
         		    }  
                };
                //回车遍历查找
                function enterFindNext(val,items){
                	var flag = self.itemFlag;
                	for (var i = flag + 1; i < items.length; i++) {
                		var $item = $(items[i]);
                		if ($item.find("span").length == 0) {
                			var isExist = $item.html().indexOf(val) != -1;
                			isUse = isExist;
                			if (isExist) {
                				$item.parent().parent().scrollTop((i)*26);
                    			$item.parent().find("li").removeClass("sel");
                    			$item.addClass('sel');
                    			self.itemFlag = i;
                    			break;
                			}
                		}   
    				    if ($item.find("span").length != 0 ) {
    				    	var isExist = $item.find("span").html().indexOf(val) != -1;
    				    	isUse = isExist;
    				    	if (isExist) {
    				    		$item.parent().parent().scrollTop((i)*26);
    							$item.parent().find("li").removeClass("sel");
    							$item.addClass('sel');
    							self.itemFlag = i;
    							break;
    				    	}
    				    }	
                	}
                }

                //多选下拉 CheckBox绑定事件
                if (this.multiSelect) {
                    this._dropView.delegate("input[type='checkbox']", "click", function (e) {
                        var checkedBoxes = self._dropView.find('input[type="checkbox"]');
                        var caption = checkedBoxes.filter(':checked').map(function () {
                            return $(this).next().html();
                        }).get().join(',');

                        var value = checkedBoxes.filter(':checked').map(function () {
                            return $(this).attr("itemValue");
                        }).get().join(',');

                        //self._textBtn.val(caption);
                        
                        self.setSelValue(value);
                    });
                }
                
            }
        };

        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        Return.install();
        return Return;
    }
})();