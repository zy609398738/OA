/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-20
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

YIUI.Tree = YIUI.extend(YIUI.Control, {

	/** HTML默认创建为label */
	autoEl: '<div></div>',
	/** 菜单样式 */
    menuType: YIUI.TREEMENU_TYPE.GROUPTREE,
    
    _data: [],
    
    rootEntry: [],
    /** 根节点 */
    rootNode: null,
    /** 父子节点是否关联 */
    independent: true,
    /** 已选中节点的id */
    selectedNodeId: null,
    /** 是否为动态加载数据 */
    isAsyncNodes: true,
    /** 汇总节点是否展开 */
    _isOpen: false,
    /** 已选中汇总节点 */
    _openedItem: null,
    
    container: null,
    
    handler: YIUI.TreeHandler,
    
    initDataSource : function(dataSource) {
    	if(dataSource) {
    		this.isAsyncNodes = false;
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
    init: function(options) {
    	this.base(options);
    	var self = this;
    	this.menuType = this.rootEntry.style || YIUI.TREEMENU_TYPE.GROUPTREE;
    	self.initDataSource(this.rootEntry);
    	self._data = [];
    	self.callback = $.extend({
			beforeExpand: $.noop,
			onSelect: function($this, $tree, node){
				if(node.children) {
					if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
						$("#" + node.id + " span.treemenu-icon").click();
					} else if(self.menuType == YIUI.TREEMENU_TYPE.TREE) {
						if($("#" + node.id).attr("open")) {
							self.clickEvent.collapse($this, self, null);
							$("#" + node.id).attr("open", false);
							$(this).removeClass("curSelectedNode");
							$(this).parent().removeClass("selected");
						} else {
							self.clickEvent.expandNode($this, self, null);
							$("#" + node.id).attr("open", true);
							$(this).addClass("curSelectedNode");
							$(this).parent().addClass("selected");
						}
					}
				} else {
					self.handler.doTreeClick(node, container);
				}
			}
    	}, options.callback);
    	self.clickEvent = {
			expandNode: function($this, self, $tree) {
	    		var nodeId = $this.attr("id");
	    		var node = self.getTreeNode(nodeId);
	    		self.callback.beforeExpand(node);
	    		var expandNode = node.id + "-" + self.el.attr("id");
	    		if(!node.isLoaded) {
	    			node.isLoaded = true;
	    		}
	    		if($this.parent().hasClass("top-level")) {
	    			if(self._openedItem && $this.attr("id") != self._openedItem.attr("id")) {
	    				self._openedItem.removeClass("open").addClass("close");
		    			self._openedItem.next().hide();
		    			self._openedItem.removeClass("curSelectedNode");
		    			self._openedItem.parent().removeClass("selected");
		    			if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
			    			$(".tree-expand", self._openedItem).removeClass("tree-expand").addClass("tree-collapse");
			    			$(".tree-explore", self._openedItem).removeClass("tree-explore-expand").addClass("tree-explore-collapse");
		    			} else {
		    				$(".tree.expand", self._openedItem).removeClass("expand").addClass("collapse");
		    			}
		    		}
		    		self._openedItem = $this;
	    		}
	    		$this.next().show();
	    		$this.removeClass("close").addClass("open");
				$this.addClass("curSelectedNode");
				$this.parent().addClass("selected");
	    		if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
    				$(".tree-collapse", $this).removeClass("tree-collapse").addClass("tree-expand");
    				$(".tree-explore", $this).removeClass("tree-explore-collapse").addClass("tree-explore-expand");
	    		} else {
	    			$(".tree.collapse", $this).removeClass("collapse").addClass("expand");
	    		}
	    	},
	    	collapse: function($this, self, $tree) {
	    		$this.removeClass("open").addClass("close");
	    		$this.next().hide();
	    		$this.removeClass("curSelectedNode");
	    		$this.parent().removeClass("selected");
	    		if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
    				$(".tree-expand", $this).removeClass("tree-expand").addClass("tree-collapse");
    				$(".tree-explore", $this).removeClass("tree-explore-expand").addClass("tree-explore-collapse");
	    		} else {
	    			$(".tree.expand", $this).removeClass("expand").addClass("collapse");
	    		}
	    	},
	    	
	    	selectNode: function($this, self, $tree) {
	    		var id = $this.attr("id");
	    		var treeId = self.el.attr("id");
	    		if(self.selectedNodeId) {
	    			$("#" + self.selectedNodeId).removeClass("clicked");
	    			$("#" + self.selectedNodeId).prev().removeClass("tree-wholerow-clicked");
	    			$("#" + self.selectedNodeId).parent().removeClass("clicked");
	    		}
	    		self.selectedNodeId = id;
	    		$("#" + id).addClass("clicked");
	    		$("#" + id).prev().addClass("tree-wholerow-clicked");
	    		$("#" + id).parent().addClass("clicked");
	    		self.callback.onSelect($this, $("#" + treeId), self.getTreeNode(id));
	    	}
		};
    },
    
    dataSourceCopy: function(dataSource){
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
    					this.dataSourceCopy($(child));
    				}
    				d.children = children;
    			} else {
    				d.key = ds.key;
    				d.formKey = ds.formKey;
    			}
    			if(ds.parent) {
    				d.parentId = ds.parent.id;
    			}
    			this._data.push(d);
    		}
    	}
    },
    
    changeDataType: function(dataSource) {
    	var cdata = [];
    	var newObject = $.grep(dataSource, function(n, i) {
    		return typeof(n.parentId) == "undefined" ? n : null;
    	});
    	for (var i = 0; i < newObject.length; i++) {
			var data = $.extend(true, {}, newObject[i]);
			cdata.push(data);
			this.changeData(data);
		}
    	this.rootEntry = cdata;
    },
    
    changeData: function(cdata) {
		if(cdata.children) {
			for (var i = 0, len = cdata.children.length; i < len; i++) {
				var childnode = $.extend(true, {}, this.getTreeNode(cdata.children[i]));
				cdata.children.splice(i, 1, childnode);
				if(childnode.children) {
					this.changeData(cdata.children[i]);
				}
			}
		}
    },
    
    /** 构建树结构 */
    buildTreenode: function(nodes, parentId) {
    	if(!nodes) {
    		return;
    	}
    	if(!nodes.length) {
    		if(!parentId) {
    			nodes = nodes.children;
    		}
    	}
    	this.addChilds(nodes, parentId, 0);
    },
    
    addChilds: function(nodes, parentId, level) {
    	if(nodes.length <= 0) {
    		if(parentId) {
    			$("#" + parentId, this.el).next().remove();
    			$("#" + parentId, this.el).children().first().removeClass("tree-collapse");
    		}
    		return;
    	}
		var node, nid;
		if(parentId) {
			var parentNode = this.getTreeNode(parentId);
			parentNode.children = [];
		}
		for (var i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];
			nid = node.id;
			node.parentId = parentId;
			
			var _li = $("<li class='treemenu tree-node' level='"+level+"'></li>");
			if(!node.parentId) {
				_li.addClass("top-level");
			}
			if(parentId) {
				parentNode.children.push(nid);
				_li.appendTo($("#" + parentId, this.el).next());
				var childLength = $("#" + parentId, this.el).next().children().length;
			} else {
				_li.appendTo(this.el);
			}
	        var _a = $("<a id='"+ nid +"' class='tree-anchor'></a>").appendTo(_li),
	        _ul, _span, _spanLeft;
	        
	        if(node.isParent) {
            	_li.addClass("isParent");
	            _spanLeft = $("<span class='tree'></span>");
            	_ul = $("<ul class='tree-ul'></ul>");
            	_span = $("<span class='treemenu-icon'/>");
	            if(node.open && !this._isOpen && !node.parentId) {
	            	_li.addClass("selected");
	            	_a.addClass("curSelectedNode open").attr("open", true);
	            	_span.addClass("tree-expand");
	            	this._isOpen = true;
	            	this._openedItem = _a;
	            	_spanLeft.addClass("expand");
	            } else {
	            	_a.attr("open", false).addClass("close");
	            	_ul.css("display", "none");
	            	_span.addClass("tree-collapse");
	            	_spanLeft.addClass("collapse");
	            }
	            _ul.appendTo(_li);
	            _explore = $("<span class='tree-explore'/>");
	            if(this.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
	            	_span.appendTo(_a);
	            	_explore.appendTo(_a);
	            	if(node.icon) {
	            		_explore.css("background-image",  "url(Resource/"+node.icon+")" );
	            	}
	            } else {
	            	_spanLeft.appendTo(_a);
	            }
	        }
	        $("<span class='treenode-name'>" + node.name + "</span>").appendTo(_a);
	        if(this.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
	        	if(level > 0) {
		        	_a.css("padding-left", (level-1)*20+50);
		        }
	        } else {
	        	_a.css("padding-left", level*20);
	        }
	        if(node.children) {
                 this.addChilds(node.children, node.id, level+1);
	        } else {
	        	_a.addClass("noExpand");
	        }
		}
    },
    
    removeChilds: function(nodeId) {
    	$("#" + nodeId).parent().remove();
    	this.removeNode(nodeId);
    },
    
    removeNode: function(nodeId) {
    	for (var i = 0, len = this._data.length; i < len; i++) {
			var treenode = this._data[i];
			if(treenode.id == nodeId) {
				if(treenode.parentId) {
					var parent = this.getTreeNode(treenode.parentId);
					parent.children = $.map(parent.children, function(n, i) {
						return n != treenode.id ? n : null;
					});
				} else if(treenode.children) {
					this._data.splice(i,1);
					for (var j = 0, length = treenode.children.length; j < length; j++) {
						this.removeNode(treenode.children[j]);
					}
					break;
				} else {
					this._data.splice(i,1);
					break;
				}
			}
		}
    },

    onRender: function (ct) {
    	this.base(ct);
    	this.el.addClass("treemenu treemenu-content");
    	
    	var id = this.el.attr("id");
    	this.dataSourceCopy(this.rootEntry);
        this.buildTreenode(this.rootEntry, null);
    	
    	switch (this.menuType) {
        case  YIUI.TREEMENU_TYPE.TREE:
            break;
        case  YIUI.TREEMENU_TYPE.GROUPTREE:
            this.el.addClass('treemenu-grouptree');
            break;
    	}
    },
    
    install : function() {
    	var self = this;
    	$("a", self.el).bind("click", function(e) {
    		if($(this).hasClass("open")) {
    			self.clickEvent.collapse($(this), self, null);
    			return;
    		}
    		if($(this).hasClass("close")) {
    			self.clickEvent.expandNode($(this), self, null);
    			return;
    		}
    		if($(this).hasClass("noExpand")) {
    			self.clickEvent.selectNode($(this), self, null);
    			return;
    		}
    	});
	},
	
	getTreeNode: function(nodeId) {
		for (var i = 0, len = this._data.length; i < len; i++) {
			if(this._data[i].id == nodeId) {
				return this._data[i];
			}
		}
	},
	
	setRootNode: function(rootNode){
		this.rootNode = rootNode;
	},
	
	getRootNode: function() {
		return this.rootNode;
	}
	
});
YIUI.reg('tree', YIUI.Tree);
