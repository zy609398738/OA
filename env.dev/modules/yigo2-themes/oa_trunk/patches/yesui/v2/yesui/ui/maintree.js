(function() {
	YIUI.MainTree = function(rootEntry, dom, container){
		$("ul.tm", dom).remove();
    	var el = $("<ul></ul>").addClass("tm").appendTo(dom);
     	var options = {
			el: el,
			_open: false,
			menuType: rootEntry.style,
			_openedItem: null,
			_data: [],
			rootEntry: rootEntry,
			clickEvent: {
                expandNode: function($this, self) {
                   //展开
                    var nodeId = $this.attr("id");
                    var node = self.getTreeNode(nodeId);
                    self.callback.beforeExpand(node);
                    var expandNode = node.id + "-" + self.el.attr("id");
                    if(!node.isLoaded) {
                        node.isLoaded = true;
                    }        

                    $this.next().show();
                    $this.removeClass("close collapse").addClass("open expand cursel");
                    $this.parent().addClass("sel");
                    $this.parent().siblings().find('.open.expand').removeClass("open expand cursel").addClass("close collapse").next().hide();  
                },

			    collapse: function($this, self) {
                   //up
                    if($this.has("open expand")){
                        $this.parent().removeClass("sel");
                        $this.parent().find(".open.expand").removeClass("open expand cursel").addClass("close collapse").next().hide();
                    }   		    	
			    },


			    selectNode: function($this, self) {
			    	var id = $this.attr("id");
			    	var treeId = self.el.attr("id");
			    	if(self.selectedNodeId) {
			    		$("#" + self.selectedNodeId).removeClass("clicked");
			    		$("#" + self.selectedNodeId).parent().removeClass("clicked");
			    	}
			    	self.selectedNodeId = id;
			    	$("#" + id).addClass("clicked");
			    	$("#" + id).parent().addClass("clicked");
			    	self.callback.onSelect($this, $("#" + treeId), self.getTreeNode(id));
			    }
			},
			callback: $.extend({
				beforeExpand: $.noop,
				onSelect: function($this, $tree, node){
					if(node.children) {
						if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
							$("#" + node.id + " span.icon").click();
						} else if(self.menuType == YIUI.TREEMENU_TYPE.TREE) {
							if($("#" + node.id).attr("open")) {
								self.clickEvent.collapse($this, self, null);
								$("#" + node.id).attr("open", false);
								$(this).removeClass("cursel");
								$(this).parent().removeClass("sel");
							} else {
								self.clickEvent.expandNode($this, self, null);
								$("#" + node.id).attr("open", true);
								$(this).addClass("cursel");
								$(this).parent().addClass("sel");
							}
						}
					} else {
						YIUI.EventHandler.doTreeClick(node, container);
					}
				}
			}),
		    getTreeNode: function(nodeId) {
	    		for (var i = 0, len = this._data.length; i < len; i++) {
	   				if(this._data[i].id == nodeId) {
	   					return this._data[i];
	   				}
	   			}
                
    		},
    		initDataSource: function(dataSource) {
            	if(dataSource) {
            		if(!dataSource.length) {
            			dataSource = $(dataSource);
            		}
            		var data;
            		for (var i = 0, len = dataSource.length; i < len; i++) {
        				data = dataSource[i];
        				if(!data.id) {
        					data.id = data.key + i;
        				}
        				if(data.children) {
        					data.isParent = true;
        					this.initDataSource(data.children);
        				}
        			}
            	}
            },
            dataSourceCopy: function(dataSource, parentID){
            	if(dataSource) {
            		if(!dataSource.length) {
            			dataSource = $(dataSource);
            		}
            		for (var i = 0, len = dataSource.length; i < len; i++) {
            			var ds = dataSource[i];
            			var parent = ds.parent;
            			var d = new Object();
            			d.name = ds.name;
            			d.id = ds.id;
            			d.itemKey = ds.itemKey;
            			d.layerItemKey = ds.layerItemKey;
            			if(ds.isLoaded) {
            				d.isLoaded = ds.isLoaded;
            			} else {
            				d.isLoaded = false;
            			}
            			if(ds.children && ds.children.length > 0) {
            				d.open = ds.open;
            				var children = [];
            				for (var j = 0, length = ds.children.length; j < length; j++) {
            					var child = ds.children[j];
            					children.push(child.id);
            					this.dataSourceCopy($(child), ds.id);
            				}
            				d.children = children;
            			} else {
            				d.key = ds.key;
            				d.formKey = ds.formKey;
            				d.paras = ds.parameters;
            				d.single = ds.single;
            				d.target = ds.target;
            			}
            			d.path = ds.path;
            			if(ds.parent) {
            				d.parentId = ds.parent.id;
            			}
            			if(parentID) {
            				d.parentID = parentID;
            			}
            			this._data.push(d);
            		}
            	}
        	},
        	/** 构建树结构 */
    	    buildTreenode: function(el, nodes, parentId) {
    	    	if(!nodes) {
    	    		return;
    	    	}
    	    	if(!nodes.length) {
    	    		if(!parentId) {
    	    			nodes = nodes.children;
    	    		}
    	    	}

    	    	nodes && this.addChilds(nodes, parentId, 0, this);
    	    },

    	    calcBoolean: function(str) {
    	    	if(!this.parser) {
    	    		this.parser = new View.Parser();
    	    	}
				return this.parser.eval(str);
    	    },
            addChilds: function(nodes, parentId, level, options) {
                
                if(nodes.length <= 0) {
                    if(parentId) {
                        $("#" + parentId, options.el).next().remove();
                        $("#" + parentId, options.el).children().first().removeClass("tm-collapse");
                    }
                    return;
                }
                
                var node, nid,
                    isTree = options.menuType != YIUI.TREEMENU_TYPE.GROUPTREE ? true : false;
                if(parentId) {
                    var parentNode = options.getTreeNode(parentId);
                    parentNode.children = [];
                }
                if(isTree) options.el.addClass("tree");
                for (var i = 0, len = nodes.length; i < len; i++) {
                    node = nodes[i];
                    nid = node.id;
                    node.parentId = parentId;

    				var isVisible = !node.visible ? true : this.calcBoolean(node.visible);
    				if(!isVisible)
    					continue;

                    var _li = $("<li class='tm-node' level='"+level+"'></li>").attr("path", node.path);
                    if(node.single) {
                      _li.attr("single", "true").attr("formKey", node.formKey).attr("paras", node.parameters);
                    }
                    if(node.target) {
                    	_li.attr("target", node.target);
                    }
                    if(!node.parentId) {
                        _li.addClass("top-level");
                    }

					var isEnable = !node.enable ? true : this.calcBoolean(node.enable);
                    if( !isEnable ) {
                    	_li.attr("enable",false);
					}

                    if(parentId) {
                        parentNode.children.push(nid);
                        _li.appendTo($("#" + parentId, options.el).next());
                    } else {
                        _li.appendTo(options.el);
                    }
                    
                    var _a = $("<a id='"+ nid +"' class='tm-anchor'></a>").appendTo(_li),
                        _ul;
             
                    if(node.isParent){
                        if(level == 1){
                            _a.css({
                                "backgroundPosition": 30,
                                "padding-left" : 50
                            }); 
                        }
                        if(level >1){
                           var disX = level * 8 + 50;
                            _a.css({
                                "backgroundPosition": disX ,
                                "padding-left" : disX + 15 + 'px'
                            }).addClass('multi-level'); 
                        }
                    }else{
                        if(level == 1 ) _a.css("padding-left" , 50); 
                        if(level >1 ) _a.css("padding-left" , level * 8 + 50).addClass('multi-level'); 
                    }


                    
                    if(node.isParent) {
                        _li.addClass("isparent");
                        _ul = $("<ul class='tm-ul'></ul>");
                        if(node.open && !options._isOpen && !node.parentId) {
                            _li.addClass("sel");
                            _a.addClass("cursel open expand").attr("open", true);
                            options._isOpen = true;
                            options._openedItem = _a;
                        } else {
                            _a.attr("open", false).addClass("close collapse");
                            _ul.css("display", "none");      
                        }               
                         _ul.appendTo(_li);                       
                    }   
            
                    var _span = $("<span class='tm-name'>" + node.name + "</span>").appendTo(_a);
                   
                    if(node.icon){
                       var  _img = $("<img>");
                            _img
                                .one("error",function(){
                                    $(this).attr("src","yesui/ui/res/css/blue/images/not-exist.png");
                                })
                                .attr("src","Resource/"+node.icon)
                                .css({
                                    "vertical-align":"middle",
                                    "display":"inline-block",
                                    "margin-right":5
                                })
                                .prependTo(_span);
                    }
                    
                    if(node.children) {
                         this.addChilds(node.children, node.id, level+1, options);
                    } else {
                        _a.addClass("noExpand");
                    }
                }                             
            },



    	    install: function() {
    	    	var self = this;
    	    	self.el.delegate("a", "click", function(e) {
    	    		if($(this).hasClass("open")) {
    	    			self.clickEvent.collapse($(this), self);
    	    			return;
    	    		}
    	    		if($(this).hasClass("close")) {
    	    			self.clickEvent.expandNode($(this), self);
    	    			return;
    	    		}
    	    	});
    	    	self.el.delegate("a","click", $.debounce(500, function(e) {
    	    		if($(this).hasClass("noExpand")) {
    	    			self.clickEvent.selectNode($(this), self);
    	    			return;
    	    		}
    	    	}));
    	    },
    		init: function() {
    			this.initDataSource(this.rootEntry);
    			this.dataSourceCopy(this.rootEntry.children);
    			this.buildTreenode(this.el, this.rootEntry);
    			this.install();
    	    },
    	    reload: function(entry) {
    	    	this.el.empty();
            	this._data = [];
    			this.initDataSource(entry);
    			this.dataSourceCopy(entry.children);
    	    	this.buildTreenode(this.el, entry);
    	    }

    	}
	    options.init();
	    return options;
	};
})();