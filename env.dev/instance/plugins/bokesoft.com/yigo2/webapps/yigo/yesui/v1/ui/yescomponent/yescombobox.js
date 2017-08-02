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
            

            init: function () {
                this._textBtn.addClass('txt').appendTo(this.el);
                this._dropBtn.addClass('arrow').appendTo(this.el);
                this._dropView.addClass('cmb-vw').appendTo($(document.body));
                this.$suggestView.addClass('cmb-autovw cmb-vw').appendTo($(document.body));
                if(this.multiSelect) {
                	this._textBtn.attr('readonly', 'readonly');
                }
            },


            /**
             * 下拉框数据
             */
            items: null,
            /** 是否多选  */
            multiSelect: false,
            sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,
            /**  是否可编辑 */
            editable: true,
            enable: true,
            getEl: function () {
                return this.el;
            },
            setEditable: function (editable) {
                this.editable = editable;
                /*var el = this._textBtn;
                if (this.editable) {
                    el.removeAttr('readonly');
                    el.removeAttr("unselectable");
                    el.removeClass("unsel");
                } else {
                    el.attr('readonly', 'readonly');
                    el.attr("unselectable", "on");
                    el.addClass("unsel");
                }*/
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this._textBtn,
                    outerEl = this.el;
                if (enable) {
                    el.removeAttr('disabled');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('disabled', 'disabled');
                    outerEl.addClass("ui-readonly");
                }
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

            getItems: function () {
                return this.items;
            },

            hiding: $.noop,

            hideComboList: function () {
                this._dropView.hide();
                this._hasShow = false;
		    	$(document).off("mousedown");
                this.hiding();
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

            /**
             * 勾选节点
             * @param {} value
             */
            checkItem: function (value) {
                if (this.multiSelect && value) {
                    var arr = value.split(",");
                    for (var index in  arr) {
                        var checkedBoxes = this._dropView.find('input[type="checkbox"]')
                        for (var i = 0; i < checkedBoxes.length; i++) {
                            if (arr[index] == $(checkedBoxes[i]).attr("itemValue")) {
                                checkedBoxes[i].checked = true;
                                break;
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
            },
            getText: function () {
                return this._textBtn.val();
            },

            install: function () {
                var self = this;
                this._dropBtn.click(function (e) {
                    if (!self.enable) {
                        return;
                    }
                    self._textBtn.focus();
                    if (self._hasShow) {
                    	self.itemval = 0;
                        self.hideComboList();
                        return;
                    }

                    self._dropView.children("ul").css("width", "auto");
                    self.getItems();
                    self.checkItem(self.getSelValue());
                    self.setDropViewTop();
                    self.setDropViewLeft();
                    self._dropView.show();
                    var val = self.getText();
                    var items = self._dropView.find("li");
                    if (val == "") {
                    	items.removeClass("sel");
                    	self._dropView.scrollTop(0);
                    }

                    var ul = self._dropView.children("ul");

                    ul.css("width", self._dropView[0].scrollWidth);

                    if( ul.children().length == 0 ) {
                        ul.addClass("empty");
                        ul.text("无");
                    } else {
                        ul.removeClass("empty");
                    }
                    
                    if (self._selectedLi && (self._selectedLi.attr("itemValue") == self.getSelValue())) {
                        var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
                        var scrollTop = self._selectedLi.position().top - self._dropView.height() + self._selectedLi.height() + scrollHeight;
                        self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
                    } else {
                    	/*$(".sel", self._dropView).removeClass("sel");*/
                    	var $li = $("[itemValue='"+self.getSelValue()+"']");
                    	if($li.length > 0 && !$li.hasClass("empty")) {
                    		self._selectedLi = $li;
                    		$li.addClass("sel");
                    	}
                    }

                    $(document).on("mousedown", function (e) {
                        var target = $(e.target);
                        if ((target.closest(self._dropView).length == 0)
                            && (target.closest(self._dropBtn).length == 0) 
                            && (target.closest(self._textBtn).length == 0)) {
                            self.itemval = 0;
                            self.hideComboList();
                            
                        }
                    });
                    self._hasShow = true;
                    e.stopPropagation();
                });

                //节点绑定事件
                this._dropView.delegate("li", "mouseup", function (e) {
                	$(this).parent().find("li").removeClass("sel");
                    if (self.multiSelect) {
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
                    self._textBtn.val($(e.target).text());
                    self.hideComboList();
                });
                //节点绑定事件
                this.$suggestView.delegate("li", "mouseup", function (e) {
                	var value = $(e.target).attr("itemValue");
                	self.setSelValue(value);
                	self._textBtn.val($(e.target).text());
                	self.$suggestView.hide();
                	self.hiding();
                	self._selectedLi = $("li[itemvalue="+value+"]", self._dropView).addClass("sel");
    		    	$(document).off("mousedown");
    	            
                });
                
               this._textBtn.on("keyup",function(e) {
            	    var $this = $(this);
            	    var which = e.which;
            	    if (!self._hasShow) {
            		    e.stopPropagation();
            		    return;
            	    }
            	    var val = $this.val();
            	    var items = self._dropView.find("li");
            	    items.removeClass("sel");
            	    if (which != 13) {
            		    self.itemval = 0;
                	    if (self._hasShow ) {
                		    finditem(val,items);
                		    e.stopPropagation();
                		   
                	    }
            	    }
            	    if (which == 13 && val != "") {
            		    enterFindNext(val,items);
            		    e.stopPropagation();
            	    }    
               });
               //查询全部
               function finditem(val,items) {
            	    var itemval = self.itemval;
         		    var len = items.length;
         		    if (len != 0) {
         			    $.each(items,function(index,elem) {
         				    $(elem).parent().find("li").removeClass("sel");
         				    if($(elem).find("span").length == 0 && val != ""  && $(elem).html().indexOf(val) != -1 ) {
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
                			isUse = isExist
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
    				    	isUse = isExist
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

                        self._textBtn.val(caption);
                        
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