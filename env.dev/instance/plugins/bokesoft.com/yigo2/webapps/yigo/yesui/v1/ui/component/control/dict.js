/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-21
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */

YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT = YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT;

YIUI.Control.DICT_CKBOXTYPE_SINGLE_SELECT = YIUI.TREEPANEL_CKBOXTYPE_SINGLE_SELECT;

YIUI.Control.Dict = YIUI.extend(YIUI.Control, {

    //dropView是否显示
   	//_hasShow : false,

    /**
     * 用于固定数据源，一次构建完整的字典树
     */
    //dataSource : null,

    /**
     * 是否多选字典
     * @type Boolean
     */
    //multiSelect :  false,
    
    //rootNode : null,

    //字典控件的下拉按钮
    //_dropBtn : null,

    //_textBtn : null,

    //_dropView : null,
    
    //_error : null,

    /**
     * 多选字典，选择模式
     */
    //checkBoxType :   YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT,

    /** 父子节点是否关联 */
    //independent : true,
    
    /**
     * 字典itemKey
     */
    //itemKey : null,
        
    //otherParam:null,
    
    //dictTree: null,
    
    //newNodes: [],
    
    //clicked: false,
 
    //_needReloadIndeterminatedNodes : false,
    
    //_resetTree : true,
	value : null,
	
    handler: YIUI.DictHandler,
    
    behavior: YIUI.DictBehavior,
    
    //字典状态
    stateMask: YIUI.DictStateMask.Enable,
    
    needRebuild: true,
    
	init : function (options){
		//this.itemKey = options["itemKey"];
		//this.otherParam = {"Service":"dictTreeService","Cmd":"getdictchildren","itemKey":this.itemKey};
		//this.autoParam = ["id=parentid","itemKey=layerItemKey"];
		this.base(options);
	},
	
	setEditable: function(editable) {
		this.editable = editable;
    	this.yesDict.setEditable(this.editable);
    },
    
    setEnable: function(enable){
    	this.enable = enable;
    	this.yesDict.setEnable(enable);
    },

	setBackColor: function(backColor) {
		this.yesDict.setBackColor(backColor)
	},

	setForeColor: function(foreColor) {
		this.yesDict.setForeColor(foreColor);
	},
	
    setFormatStyle: function(cssStyle) {
    	this.yesDict.setFormatStyle(cssStyle);
	},
	
	setMultiSelect: function(multiSelect) {
		this.multiSelect = multiSelect;
		this.yesDict.setMultiSelect(multiSelect);
	},
	

//	
//	getDictRoot : function(){
//		var dict = this;
//		var data = {};
//		data.formID = dict.ofFormID;
//		data.key = dict.key;
//		
//		data.service = "dictTreeService";
//		data.cmd = "getdictroot";
//		
//		var success = function(result) {
//			if (result ){
//				dict.itemKey = result.itemKey;
//				
//				if(dict.dictTree.rootNode != null){
//					if(dict.dictTree.rootNode.attr('itemKey') == result.itemKey){
//						return;
//					}
//					dict.dictTree.rootNode.remove();
//				}
//				
//				dict.dictTree.createRootNode(result.itemKey,result.itemKey+'_'+result.soid,result.caption);
//			}
//			dict.setDictTreeCheckedNodes();
//		}
//		
//		Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
//		
//	},


    beforeDestroy: function() {
        this.yesDict.destroy();
    },

    isNull: function() {
    	var value = this.value;
    	if($.isEmptyObject(value)){
			return true;
		}
		if (value instanceof YIUI.ItemData) {
			return value.oid == 0;
		} else if ($.isArray(value)) {
			for (var i = 0, len = value.length; i < len; i++) {
				if(value[i].oid > 0){
					return false;
				}
			}
			return true;
		}
		return false;
    },
    
    getCheckOpts: function(options) {
    	var opts = this.base(options);
    	var form = YIUI.FormStack.getForm(this.ofFormID);
    	var options = {
            dictCaption: form.dictCaption,
            itemKey: this.itemKey
        };
    	opts = $.extend(opts, options);
    	return opts;
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    checkEnd: function(value) {
		this.value = value;
		this.yesDict.setValue(value);
		var text = "";
		if(value != null) {
			if(this.multiSelect) {
				for (var i = 0, len = value.length; i < len; i++) {
					var val = value[i];
					if(i > 0) {
						text += ",";
					}
					text += val.caption;
				}
			} else {
				text = value.caption;
				if(value.oid == 0) {
					this.value = null;
				}
			}
		}
		this.setText(text);
	},
    
    /** 获取控件真实值 */
    getValue: function () {
    	return this.value;
    },
    
    onSetWidth: function(width) {
    	this.yesDict.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesDict.setHeight(height);
    },
    
    getDictTree: function(){
    	return this.yesDict.dictTree;
    },
    
    /** 判断值是否改变 */
    isChanged: function(value) {
    	this.value;
    	var changed = false;
    	if(!this.value && value) {
    		changed = true;
		} else if(this.value) {
			if(this.multiSelect) {
				//数组
				if(this.value.length != value.length) {
					changed = true;
				} else {
					for (var i = 0, len = value.length; i < len; i++) {
						var index = this.value.indexOf(value[i]);
						if(index < 0) {
							changed = true;
							break;
						}
					}
				}
			} else {
				changed = !(this.value.oid == value.oid);
			}
		}
    	return changed;
    },

    onRender: function (ct) {
        this.base(ct);
    	var $this = this;
        var formID = $this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);
    	this.yesDict = new YIUI.Yes_Dict({
    		id: $this.id,
    		el: $this.el,
    		secondaryType: $this.secondaryType,
    		dataSource: $this.dataSource,
    		independent: $this.getMetaObj().independent,
    		multiSelect: $this.getMetaObj().multiSelect,
    		getItemKey: function() {
    			return $this.itemKey;
    		},
    	    hiding : function (){
    	    	var value = this.getSelValue();
    	    	var changed = $this.isChanged(value);
    	    	if(changed) {
	    			if (value.length == 0){
	    				$this.setValue(null, true, true, false, true);
	    			} else {
	    				$this.setValue(value, true, true, false, true);
	    			}
    	    		
    	    	}
    	    },
    	    getDictChildren: function(node) {
    	    	
    	    	var success = function(nodes) {
					if (nodes) {
						var nodeId = node.attr('id');
						var syncNodes = $this.getDictTree().formatAsyncData(nodes);
						var isHaveNext = nodes.totalRowCount;
						nodes = $this.secondaryType == 5 ? nodes.data :nodes;
						for(var i=0, len=nodes.length; i<len; i++) {
						    
						    if($this.type == YIUI.CONTROLTYPE.COMPDICT || $this.secondaryType == 5) {
								var path = nodeId + "_" + nodes[i].OID;
								nodes[i].id = path;
						    }
						}
						syncNodes = $this.secondaryType == 5 ? nodes :syncNodes;
						$this.getDictTree().buildTreenode(syncNodes , nodeId, parseInt(node.attr("level"))+1, $this.secondaryType, isHaveNext);
						$this.secondaryType == 5 ? node.attr('isLoaded',false) : node.attr('isLoaded',true);
						
					}
				}
    	    	if ($this.secondaryType != 5) {
        	    	YIUI.DictService.getDictChildren($this.itemKey, $this.getDictTree().getNodeValue(node), $this.getDictTree().dictFilter, $this.stateMask ,success);
    	    	} else {
        	    	YIUI.DictService.getQueryData($this.itemKey, $this.yesDict.dictTree.startRow, pageMaxNum, $this.yesDict.dictTree.pageIndicatorCount, $this.yesDict.dictTree.fuzzyValue,  $this.stateMask ,$this.getDictTree().dictFilter, $this.getDictTree().getNodeValue(node), success);
    	    	}
    	    },
    		checkDict: function() {
    	    	$this.checkDict($this);
    	    	this.setSelValue($this.value);
    		},
    		doLostFocus: function(text, show) {
    			if($this.autoSel) {
    				$this.$dictView.hide();
    				$this.isDictView = false;
    				return;
    			}
    			if(!$this.multiSelect && (!$.isEmptyObject(text) || show)){
    				if(($this.hasSuggest && !$this.isSuggest) || $this.hasSuggest == false) {
    					$this.$dictView.hide();
    				}
    				$this.handler.autoComplete($this, text);
    			} else {
					$this.setValue(null, true, true, false, true);
					$this.setText('');
    			}
    		},
    		valueChange: function(text) {
    			$this.handler.doLostFocus($this, text);
			},
    		beforeExpand: function(tree , treeNode) {
				//var data = {};
				//data.itemKey = $this.itemKey;
				//data.itemDatas = $.toJSON($this.getValue());
				//data.service = "dictService";
				//data.cmd = "getallparentid";
				var success = function(result) {
					if (result) {
						$.each(result,function(i){
							var nodeId = this.itemKey+'_'+this.oid;
				 			tree.indeterminatedNodes[nodeId] = this;
				 		});
					}
				};

				//Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
				
				
				YIUI.DictService.getAllParentID($this.itemKey , $this.getValue() , success );
				
    		}
    	});
        this.el.addClass("ui-dict");
        //this.setMultiSelect(this.multiSelect);
//        this.setEnable(this.enable);
//        this.setEditable(this.editable);
        
        if(this.value) {
        	if(this.getMetaObj().multiSelect) {
        		var vals = [];
        		for (var i = 0, len = this.value.length; i < len; i++) {
					var val = this.value[i];
	        		var value = new YIUI.ItemData(val);
	        		vals.push(value);
				}
        		
        		this.value = vals;
        	} else {
        		var opts = this.value;
        		opts.caption = this.text;
        		var value = new YIUI.ItemData(opts);
        		this.value = value;
        	}
        }
        this.setValue(this.value);
        this.setMultiSelect(this.getMetaObj().multiSelect);
        this.setDynamic(this.getMetaObj().isDynamic);
        this.setStateMask(this.getMetaObj().stateMask);
        this.setText(this.text);
        
         
        
        
      //  this.dictTree = this.yesDict.dictTree;
        
      //  if(this.root){
      //  	dictTree.createRootNode(this.root.itemKey,this.root.itemKey+'_'+this.root.soid,this.caption);
      //  }else{
       // 	dictTree.createRootNode(this.itemKey,this.itemKey+'_'+0,this.caption);
      //  }
      
	
    },
    
    setStateMask: function(stateMask) {
    	this.stateMask = stateMask;
    },
    
    setDynamic: function(isDynamic) {
    	this.isDynamic = isDynamic;
    },

    focus: function () {
        $("input", this.el).focus();
    },
    
    install: function() {
    	this.base();
    	var self = this;
    	
//    	$("input", self.el).bind("keyup", $.debounce(100, function(e){
//			if(self.multiselect) return;
//			var keyCode = e.keyCode;
//			if(keyCode == 13) {
//				$(this).blur();
//				return;
//			}
//        	var value = $(this).val();
//        	self.handler.doSuggest(self, value);
//            $(document).on("mousedown", function (e) {
//                var target = $(e.target);
//                if (target.closest(self.yesDict.$suggestView).length == 0) {
//                	self.isSuggest = false;
//    		    	$(document).off("mousedown");
//            		self.yesDict.$suggestView.hide();
//                } else {
//                	self.isSuggest = true;
//                }
//            });
//        
//    	}));
    	
    	var index = -1;
    	var hideDictView = function() {
    		self.$dictView && self.$dictView.hide();
			self.selLi = null;
			$(".selected", self.$dictView).removeClass("selected");
			self.setText(self.text);
	    	index = -1;
    	};
    	
    	$("input", self.el).bind("keyup", function(e){
    		if(self.multiselect) return;
    		var keyCode = e.keyCode;
    		if(keyCode == 13) {
    			if(self.selLi) {
    				$(".b-txt", self.selLi).click();
    			} else {
    				$(this).blur();
    			}
    			return;
    		}
    		var value = $(this).val();
//    		self.handler.doSuggest(self, value);
    		$(document).on("mousedown", function (e) {
    			var target = $(e.target);
    			if (target.closest(self.yesDict.$suggestView).length == 0) {
    				if(self.selLi && self.selLi.length > 0) {
                    	self.selLi.click();
                    }
    				self.isSuggest = false;
    				$(document).off("mousedown");
    				self.yesDict.$suggestView.hide();
    			} else {
    				self.isSuggest = true;
    			}
    			self.selLi = null;
            	index = -1;
    		});
    		
        	if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
        	if(keyCode == 13 && self.selLi) {
		    	index = -1;
        		self.selLi.click();
        		return;
        	}
        	self.yesDict._dropView.hide();
        	self.handler.doSuggest(self, value);
//        	index = -1;
    	});

    	$("input", self.el).bind("keydown", function(e){
    		var keyCode = e.keyCode;
            var $suggestView = self.yesDict.$suggestView, $dictView, isAutoView = false;
            
            if(!$suggestView.is(":hidden") || (self.yesDict._dropView.is(":hidden") && (keyCode != 40))) {
            	$dictView = $suggestView;
            	isAutoView = true;
            } else {
            	$dictView = self.yesDict._dropView;
            }
            self.$dictView = $dictView;
            var maxLen = $("li[level != '-1']", $dictView).length;
            //keyCode == 38 ---> UP Arrow  keyCode == 40 ---> DW Arrow
            if(keyCode == 38) {
            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
            		return;
            	}
            	index--;
            	if(index == -1) index = maxLen - 1;
            } else if(keyCode == 40) {
            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
            		self.isDictView = true;
            		self.yesDict._dropBtn.click();
            		var $li_s = $("li .dt-wholerow.sel", self.yesDict._dropView);
            		$li_s.removeClass("sel");
            		var $li = $li_s.parents("li").eq(0);
            		index = $li.index();
            	}
            	index++;
            	if(index == maxLen) index = 0;
            }else if(keyCode == 9 || keyCode === 13 || keyCode === 108) {
                self.focusManager.requestNextFocus(self);
                if (keyCode == 9 && !self.yesDict._dropView.is(":hidden")) {
                    $(document).mousedown();
                }
                e.preventDefault();
            } else {
                return;
            }
            if (index == -1) return;
            if(self.selLi) {
            	self.selLi.removeClass("selected").removeClass("sel");
            	$(".dt-wholerow", self.selLi).removeClass("sel");
            }
            var li = $dictView.find("li[level != '-1']:eq("+index+")");
            li.addClass("selected");
            self.selLi = li;
            self.autoSel = true;
            $(".dt-wholerow", li).eq(0).addClass("sel");
            var scrollHeight = self.yesDict._dropView.outerHeight() - self.yesDict._dropView[0].clientHeight;
            var scrollTop = li.position().top - self.yesDict._dropView.height() + li.height() + scrollHeight;
            self.yesDict._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
            
            if(!isAutoView) {
            	self.yesDict._textBtn.val($(".b-txt", li).eq(0).text());
            }
        	
    	});
    	
    	$("input", self.el).bind("blur", function(e){
    		index = -1;
    	});
    },
    
//    getCheckedValue: function(){
//    	var values = [];
//		var dictTree = this.dictTree;
//	  	$.each(this.dictTree.selectionNodes,function(i,val){
//	  		var $node = $('#'+val , dictTree.el);
//	  		var itemData = {};
//	    	itemData.soid = $node.attr('soid');
//	   		itemData.itemKey = $node.attr('itemKey'); 
//	  		values.push(itemData);
//	 	});
//		
//		return values;
//    }
//    ,
//    createRootNode: function(caption, itemKey) {
//    	var rootNode = new Object();
//        rootNode.id = "0";
//        rootNode.name = caption;
//        rootNode.isParent = true;
//        rootNode.open = true;
//        rootNode.isLoaded = true;
//        rootNode.itemKey = itemKey;
//        return rootNode;
//    },
    
//    transDictValue : function($treeNode){
//      var itemData = {};
//      itemData.soid = $treeNode.attr("soid") || 0;
//      itemData.itemKey = $treeNode.attr("itemKey") || this.itemKey;  
//      return $.toJSON(itemData);
//    },
   
    setText: function (text) {
    	this.text = text;
        this.yesDict.setText(text);
    } , 
    
    getText: function () {
        return this.yesDict.getText();
    },

    getShowText: function() {
    	return this.getText();
    },

	dependedValueChange: function(dependedField){
		if(this.getMetaObj().isDynamic){
			if(this.refKey && this.refKey == dependedField){
				this.needRebuild = true;
			}
		}
		
		if(!this.needRebuild){
			if(this.root && this.root.length > 0){
				if(this.root == dependedField){
					this.needRebuild = true;
				}	
			}
		}

		if(!this.needRebuild){
			var filter = this.getDictTree().dictFilter;
			if(filter){
				if(filter.dependency && filter.dependency.toLowerCase().indexOf(dependedField.toLowerCase()) >= 0 ){
					this.needRebuild = true;
				}
			}else{
                //这里的filter 是配额对象的filter不是 字典的filter 仅用于判断 当前的filter 是否值变化
                var formID =this.ofFormID;

                var form = YIUI.FormStack.getForm(formID);
                filter = this.handler.getFilter(form, this.key, this.itemFilters, this.itemKey);
                if(filter){
                    this.needRebuild = true;
                }
            }
		}
		
		if(this.needRebuild){
			this.setText("");
			this.setValue(null, true, true, false, true);
		}
	},
    
    setSecondaryType: function (type) {
        this.yesDict.setSecondaryType(type);
    } , 
    
    checkDict: function() {
    	this.handler.setContext(null);
    	this.handler.checkDict(this);
    	/*
 
    	var dict = this;
    	
    	
		var data = {};
		data.formID = dict.ofFormID;
		data.key = dict.key;
		data.service = "dictTreeService";
		data.cmd = "checkdict";

		
		var success = function(result) {

			if (result) {
				var needRebuild = result.needRebuild;
				
				if(needRebuild){
					var newRoot = result.root;
					
					if(dict.dictTree.rootNode != null){
						dict.dictTree.rootNode.remove();
					}
					
					dict.dictTree.createRootNode(newRoot,newRoot.itemKey+'_'+newRoot.oid);
					dict.secondaryType = result.secondaryType;
					dict.itemKey = result.itemKey;
				}
			}
		};

		Svr.Request.getSyncData(Svr.SvrMgr.UIProxyURL, data, success);
  		 */
    }
});
YIUI.reg('dict', YIUI.Control.Dict);
YIUI.reg('compdict', YIUI.Control.Dict);
YIUI.reg('dynamicdict', YIUI.Control.Dict);
//字典分页单页显示数量的全局变量
var pageMaxNum = 10;
