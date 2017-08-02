/**
 * TreeView。
 * 以table实现的树，可单列，可多列。
 */
(function() {
// 自动生成节点id
var nodeId = 0;
function getId() {
	return 'n-' + (++nodeId);
}

YIUI.Control.DictView = YIUI.extend(YIUI.Control, {
	/** HTML默认创建为label */
	autoEl: '<div></div>',
	
	selectId: null,
	
	/** 
	 * String。
	 * 加载数据的url，优先于data。
	 */
	dataUrl : null,
	
	/** 
	 * Array。
	 * 真实数据，如果指定了dataUrl，忽略data中定义的数据。
	 */
	data : null,
	
	_datas :{},
	
	/** 
	 * Object。
	 * 根节点。
	 */
	root : null,
	
	/**
	 * Array。 
	 * 列信息。
	 */
	colModel : null,
	
	/**
	 * Boolean。
	 * 是否支持列宽拖动。
	 */
	enableColumnResize : true,
	
	/**
	 * 未指定列宽时的默认宽度。
	 */
	defaultWidth : 100,
	
	_$table : null,
	/**
	 * 表格选中模式  0单元格选 1行选
	 */
	selectionModel : 1,
	
	pageSize: this.pageRowCount,
	
	pageIndicatorCount: 3,
	
	handler: YIUI.DictViewHandler,
    
	init: function(options) {
		this.base(options);
		this.dataUrl = '';
		var self = this;
		self.loadedNodes = {};
		var metaObj = self.getMetaObj();
		self.pageSize = metaObj.pageRowCount;
		if(metaObj.rowClick) {
			self.hasClick = true;
			self.rowClick = metaObj.rowClick;
		}
		if(metaObj.rowDblClick) {
			self.hasDblClick = true;
			self.rowDblClick = metaObj.rowDblClick;
		}
		if(metaObj.focusRowChanged) {
			self.hasRowChanged = true;
			self.focusRowChanged = metaObj.focusRowChanged;
		}
		self.formulaItemKey = metaObj.formulaItemKey;
		self.pageRowCount = metaObj.pageRowCount;
		self.itemFilters = metaObj.itemFilters;
		
		this.option = {
			theme : 'default',
			expandLevel : 2,
			expandable: true,
			levelMinus: true,
			beforeExpand : function(node) {
		    	var def = $.Deferred();
				var id = $(node).attr('id');
				if(!self.loadedNodes[id]) {
					YIUI.DictService.getDictChildren(self.itemKey, self.getNodeValue($(node)), self.dictFilter)
						.then(function(nodes) {
							var pId = $(node).attr('id') || 0;
							nodes = self.convertData(nodes, pId);
							self.addNodes(nodes);
							
							self.loadedNodes[$(node).attr('id')] = true;
							if(!$(node).is(":hidden") && !$(node).hasClass("root") && !self.isMultiExpand) {
								$(node).click();
								if(self._selectItem) {
									var id = self._selectItem.itemKey + "_" + self._selectItem.oid;
									if(id == node.attr("id")) {
										self._selectItem.isExpandNode = true;
									}
								}
							}
							def.resolve(true);
					});
				}
				return def.promise();
			},
			onSelect : function($table, node) {
            	if(node){
					$('#' + self.selectId, $table).removeClass("sel-row");
	//				console.log('onSelect: ' + id);
					node.addClass('sel-row');
					var rowIndex =  node.index();
					var id = node.attr('id')
					if(id){
						if(self.hasClick) {
							self.selectId = id;
				            var formID = self.ofFormID,
			               		rowClick = self.rowClick;
							self.handler.doOnRowClick(formID, rowClick);
						} else if (self.hasRowChanged) {
							if(self.selectId != id){
								self.selectId = id;
					        	var itemData = self.getNodeValue(node);
					        	YIUI.DictService.getItem(itemData.itemKey , itemData.oid).done(function(item) {
						        	self._selectItem = item;
									self.handler.doOnRowClick(self.ofFormID, self.focusRowChanged);
					        	});
							}
						}
					}

            	}
			},
			doubleClick: self.hasDblClick ? function($table , node){
							self.handler.doOnDblClick(self, node);
						}:null
		};
		
//		this.data = options.data.addedNodes;
		if(this.data == undefined){
			this.data = {};
		}

	},
	
	setEnable : function(enable) {
		this.base(enable);
		this._$table && this._$table.setEnable(enable);
		var lis = $(".paginationjs-pages li", this.el);
		if(enable) {
			lis.removeClass("disabled");
		} else {
			lis.addClass("disabled");
		}
	},
    
	onSetHeight : function(height) {
    	this.el.css("height", height);
    	
    	var pagesH = $(".paginationjs-pages", this.el).is(":hidden") ? 0 : $(".paginationjs-pages", this.el).height();
    	var realHeight = height - pagesH - this.$fuzzybar.height();
    	this._pagination.content.css("height", realHeight);

//		this._$table.css("width", this._pagination.content[0].clientWidth);
//		this.syncHandleWidths();
    	
		$(".ui-resizer", this.el).css({
			"top": this.$fuzzybar.height(),
			"height": this._$table.height()
		});
	},
	
	onSetWidth: function(width) {
		this.el.css("width", width);
		this._$fuzzyText.css("width", width - this._$fuzzyBtn.outerWidth());
		
		var $ths = $("th", this.el), $th;
		this._pagination.content.css("width", width);
		// var spaceW = this._pagination.content[0].clientWidth;
		// for (var i = 0, len = $ths.length; i < len - 1; i++) {
		// 	$th = $ths[i];
		// 	spaceW -= parseInt($th.style.width) + 1;
		// }
		// var $spaceTh = $ths.last();
		// $spaceTh[0].style.width = spaceW > 0 ? (spaceW + "px") : "0px";
		
		this.el.hide();
		this._$table.css("width", this._pagination.content.width());
		this.el.show();
		
//		this.syncHandleWidths();
	},
	
	convertData: function(nodes, pId) {
		if (nodes && nodes.length > 0) {
			var len = nodes.length;
			if(this.isChainDict()) {
				var pId = this.root.id;
				nodes[len -1].islast = true;
				var prevId = null;
				for(var i=0,len=nodes.length;i<len;i++) {
					if(prevId != null){
						nodes[i].previd = prevId;
					}
				    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
				    prevId = nodes[i].id;
				    nodes[i].pid = pId;
				}
			} else {
				nodes[len -1].islast = true;
				var prevId = null;
				for(var i=0,len=nodes.length;i<len;i++) {
					nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
					nodes[i].pid = pId;
					if(this.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
						var path = $(node).attr("path");
						if(!path) {
							path = pId + "_" + nodes[i].OID;
						} else {
							path += "_" + nodes[i].OID;
						}
						nodes[i].path = path;
						nodes[i].id = path;
					}
					if(prevId != null){
						nodes[i].previd = prevId;
					}
					prevId = nodes[i].id;
				}
			}
            return nodes;
        }

	},
	
	/** 
	 * 完成渲染。
	 */
	onRender: function (ct) {
		this.base(ct);
		
		var form = YIUI.FormStack.getForm(this.ofFormID);
		var info = this.handler.getDVInfo(form, this.getMetaObj());
		$.extend(this, info);
		
		this.el.addClass('ui-dv');
		if($.browser.isIE) {
			this.el.attr("onselectstart", "return false");
		}
		
		var $fuzzybar = this.$fuzzybar = $('<div id="'+this.id+'-fuzzy" class="fuzzy"/>');
        this._$fuzzyText =  $('<input id="'+this.id+'_textbtn" type="text" style="height: 30px;"/>').addClass('txt').appendTo($fuzzybar);
        this._$fuzzyBtn =  $('<button id="'+this.id+'_dropbtn" style="height: 30px; width: 30px;"></button>').appendTo($fuzzybar);
        
        if(this.isChainDict()){
            $fuzzybar.appendTo(this.el);
        }
		//this._$fuzzyField = new  YIUI.Control.TextEditor();
		//this._$fuzzyField.appendTo(this.el);
        var self = this;
        self._pagination = self.el.pagination({
			pageSize: self.pageSize,
			//总记录数
	        totalNumber: self.totalRowCount,
	        showPages: true,
	        showPageDetail: false,
	        showFirstButton: false,
	        showLastButton: false,
	        pageIndicatorCount: self.pageIndicatorCount
		});

		this._$table = $('<table cellpadding="0" cellspacing="0" unselectable="on"></table>').appendTo(self._pagination.content);
		
		var tr = $('<tr ></tr>').appendTo(this._$table),
			colModel = this.colModel,
			col, i, len, width, $th;
		for (i=0,len=colModel.length;i<colModel.length;i++) {
			col = colModel[i];
			// width = col.width || this.defaultWidth;
			width = Math.round(100/len);
//			$('<col></col>').attr('width', width).prependTo(this._$table);
			
			$th = $('<th ><span class="title">' + col.caption + '</span></th>').css("width", width + "%").appendTo(tr);
			if(i < len - 1) {
				$("<span class='dv-handler'></span>").appendTo($("span", $th));
			}
		}
		tr.appendTo(this._$table);
		
		// $('<th width="50px" class="space"></th>').appendTo(tr);
		if(this.root) {
			var root = this.createRow(this.root);
			root.addClass("comp_Level1").attr("comp_Level", 1);
			self.loadedNodes[root.attr('id')] = true;
//			root.attr('islastone', true);
			root.addClass("root");
			this._$table.append(root);	
			root.hide();
		}
		
		this._$table = this._$table.treetable(this.option);
		
		
		//总行数大于data的长度
//		if(this.totalRowCount <= this.pageSize) {
//			this._pagination.hidePagination();
//		}
		
//		if(this._totalRowCount <= this.pageRowCount) {
//			this._pagination.hidePagination();
//		}
		
		
//        var id = this.root.id;
//        this.expandNode(id, true);
		
//		this.handler.doGoToPage(this, 0);

		if(this.isChainDict()) {
	    	var itemKey = this.itemKey;
	    	var maxRows = this.pageSize;
	    	var pageIndicatorCount = this.pageIndicatorCount;
	    	var value = this.getQueryValue();
			YIUI.DictService.getQueryData(itemKey, 0, maxRows, pageIndicatorCount, value, null, this.dictFilter, null).then(function(data) {
				self.totalRowCount = data.totalRowCount;
				self.setTotalRowCount(self.totalRowCount);
				var nodes = self.data = data.data;
//				var len = nodes.length;
//				if(len > 0){
//					var pId = self.root.id;
//					nodes[len -1].islast = true;
//					var prevId = null;
//					for(var i=0,len=nodes.length;i<len;i++) {
//						if(prevId != null){
//							nodes[i].previd = prevId;
//						}
//					    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
//					    prevId = nodes[i].id;
//					    nodes[i].pid = pId;
//					}
//					self.addNodes(nodes);
//				}
				nodes = self.convertData(nodes);
				self.addNodes(nodes);
			});
		} else {
	        var id = this.root.id;
	        this.expandNode(id, true);
		}
		
		
		
//		this.addNodes(this.data);
		//var html = this.createRowsHtml(this.data);
		
		//this._$table.addChilds(html);
	},
	
		
	install: function () {
		this.enableColumnResize && this.addColumnResize();
		
		var self = this;
		self._pagination.pageChanges = function(pageNum) {
			//self._$table.clearAll();
        	self.handler.doGoToPage(self, pageNum);
        }
//		this._$fuzzyText.blur(function(e){
//				var text = $(this).val();
//				if(text.length > 0 || (text.length == 0 && self.getValue() && self.getValue().length > 0)){
//					self.handler.doLostFocus(self.ofFormID, self.key ,  text);
//				}
//		});
		
		this._$fuzzyBtn.click(function(e){
			//self._$table.clearAll();
			var text = self._$fuzzyText.val();
			self.handler.doDictViewSearch(self, text);
			
		});
		
		var _this = this;
		$(".dv-handler", this.el).bind('mousedown', function (e) {
			if(!_this.enable) return false;
			var resizer = $(".ui-resizer", _this.el);
			var resizerLeft = $(this).position().left+$(this).width();
			resizer.css("left", resizerLeft);
			resizer.addClass("clicked");
			var $leftColumn, leftColOldW, tableWidth ;
			e.preventDefault();
			var startPosition = e.clientX;
			$leftColumn = $(this).parents("th");
			leftColOldW = $leftColumn.width();
			// var $spaceColumn = $("th.space", _this._$table);
			// var spaceColW = $spaceColumn.width(), spaceW;
			
			var difference , leftColW, tblWidth;
			$(document).on('mousemove.rc', function (e) {
				difference = e.clientX - startPosition;
    			resizer.css("left", resizerLeft + difference);
			});
			return $(document).one('mouseup', function () {
				$(document).off('mousemove.rc');
				_this.el.hide();
				leftColW = leftColOldW + difference;
				// spaceW = spaceColW - difference;
				$leftColumn.width(leftColW);
				$leftColumn.next().css("width", "100%");
				// $spaceColumn.width(0);
				// if(_this._$table.width() < _this.el.width()) {
				// 	$spaceColumn.width(_this.el.width() - _this._$table.outerWidth());
				// } else {
				// 	$spaceColumn.width(0);
				// }
//				_this._$table.width(tblWidth);
                resizer.removeClass("clicked");
                _this.el.show();
			});
		});
	},
	
	// private
	createRow : function(rowdata) {
		//this._datas[rowdata.id] = rowdata;
		
		delete this.loadedNodes[rowdata.id];
		
		//rowdata.id = rowdata.id || getId();
		var tr = $('<tr id="'+rowdata.id+'"></tr>'),
			colModel = this.colModel;
		
		if(rowdata.OID != undefined ){
			tr.attr('oid', rowdata.OID);
		}
		
		if(rowdata.pid != undefined ){
			tr.attr('pid', rowdata.pid);
		}
		
		if(rowdata.itemKey != undefined ){
			tr.attr('itemKey', rowdata.itemKey);
		}
		
		if(this.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
			var path = rowdata.path;
			if(!path) {
				path = rowdata.id;
			}
			tr.attr("path", path);
			var $pNode = $("[id=" + rowdata.pid+"]", this.el);
			var comp_Level = parseInt($pNode.attr("comp_Level"));
			var pItemKey = $pNode.attr("itemKey");
			var itemKey = rowdata.itemKey;
			if(itemKey != pItemKey) {
				comp_Level += 1;
			} 
			tr.attr("comp_Level", comp_Level);
			var comp_css = "comp_Level" + comp_Level;
			tr.addClass(comp_css);
		}
			
		if(!this.isChainDict()){
			if(rowdata.NodeType == 1){
				tr.attr('haschild', true);
			}
		}
		
		if(rowdata.previd != undefined){
			tr.attr('previd', rowdata.previd);
		}
		
//		if(rowdata.isfirst != undefined && rowdata.isfirst){
//			tr.attr('isfirstone', true);
//		}
		
//		if(rowdata.islast != undefined && rowdata.islast){
//			tr.attr('islastone', true);
//		}
		
		if(rowdata.Enable != undefined){
			tr.attr('enable', rowdata.Enable);
			switch(rowdata.Enable) {
				case -1:
					tr.addClass("invalid");
					break;
				case 0: 
					tr.addClass("disabled");
					break;
				case 1:
//					tr.addClass("invalid");
					break;
			}
		}
		
		var value;
		if(this.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
			value = rowdata["Code"] + " " + rowdata["Name"];
			$('<td>' + value + '</td>').appendTo(tr);
		} else {
			for (var j=0,len=colModel.length;j<len;j++) {
				value = rowdata[colModel[j].key];
				if(!value){
					value = '';
				}
				$('<td>' + value + '</td>').appendTo(tr);
			}
		}
		
//		$('<td></td>').appendTo(tr);
		return tr;
	},
	
	// private
	createRowsHtml : function(rows) {
		var html = '';
		for(var i=0,len=rows.length;i<len;i++) {
			html += this.createRow(rows[i])[0].outerHTML;
		}
		return html;
	},
	
	/**
	 * 根据dataUrl加载所有下层子节点。
	 * @param pid 父节点id。
	 * @return Array。所有子节点的数组。
	 */
	/*
	loadChildren : function(pid) {
		var children;
		$.ajax({
			url : SvrMgr.ServletURL,
			
			//{Service: SvrMgr.Service.DealWithEvent, FormID: formID,
            //    EventType: eventType, ControlKey: controlKey, ExtParas: extParas});
                
			data : {
				Service : SvrMgr.Service.DealWithEvent,
				FormID : this.ofFormID,
				EventType :  SvrMgr.EventType.Expand,
				ControlKey : this.key,
				ExtParas :  pid || 0
			},
			
			method : 'get',
			dataType : 'json',
			async : false,
			success : function(result) {
				children = result.data;
			}
		});
		
		$.each(children, function() {
			this.pid = this.pid || pid;
		});
		return children;
	},*/
	
    setTotalRowCount: function(totalRowCount){
    	this.totalRowCount = totalRowCount == undefined ? this.totalRowCount : totalRowCount;
		this._pagination.setTotalRowCount(this.totalRowCount, this.isResetPageNum);
		this.isResetPageNum = false;
    },
	
	focusNode: function(id){
		var $tr = $('#' + id, this._$table);
		if($tr.length > 0){
			
//			$tr.click();
			
			if(this.selectId){
				$('#' + this.selectId, this._$table).removeClass("sel-row");
			}
	
			$tr.addClass('sel-row');
			if(!$tr.hasClass("selected")) {
				$tr.addClass('selected');
			}
			this.selectId = id;
			
			if(this.hasClick) {
	            var formID = this.ofFormID,
               		rowClick = this.rowClick;
	            this.handler.doOnRowClick(formID, rowClick);
			} else if (this.hasRowChanged) {
	        	var itemData = this.getNodeValue($tr);
	        	var self = this;
//	        	if(self._selectItem && self._selectItem.oid == itemData.oid) {
//	        		self.handler.doOnRowClick(self.ofFormID, self.focusRowChanged);
//	        	} else {
	        		YIUI.DictService.getItem(itemData.itemKey , itemData.oid).done(function(item) {
	        			self._selectItem = item;
	        			self.handler.doOnRowClick(self.ofFormID, self.focusRowChanged);
	        		});
//	        	}
				self.isMultiExpand = false;
			}
		}

	},
	
	// 删除节点
	deleteNodes: function(ids) {
		if(ids == undefined) {
			return;
		}
		this._$table.removeNodes(ids);
	},
	
	// 添加节点
	addNodes: function(nodes) {
		if($.isUndefined(nodes)) {
			return;
		}
		
		var html = this.createRowsHtml(nodes);

		this._$table.addChilds(html);
		
		//this.loadedNodes[id] = true;
	},

    syncHandleWidths: function() {
		var _this = this;
		var $handleContainer = $(".resizer-ctnr", this.el);
        $handleContainer.width(_this._$table.width());
        $handleContainer.find('.resizer').each(function (_, el) {

            return $(el).css({
                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - $handleContainer.offset().left),
                height: _this._$table.height()

            });

        });
	},
	// private 添加列宽拖动支持
	addColumnResize : function() {

		var colModel = this.colModel,
			row = this.el.find('tr:first-child'),
			cells = row.children(),
			left = 0;
			
		var $handleContainer = $('<div class="resizer-ctnr">');
		
//		this._$table.before($handleContainer);
		
		var _this = this;
		var $resizer = $("<div class='ui-resizer' />");
		this._$table.before($resizer);
						
//		if(this._$table.find('tr th:not(.space)').length > 1) {
//			this._$table.find('tr th:not(.space)').each(function (i, el) {
//				var $resizer;
				
//				$resizer = $("<div class='resizer' />");
//				$resizer.data('th', $(el));
//				$resizer.bind('mousedown', function (e) {
//					if(!_this.enable) return false;
//					var $currentGrip , $leftColumn  , leftColOldW , tableWidth ;
//					e.preventDefault();
//					var startPosition = e.clientX;
//					$currentGrip = $(e.currentTarget);
//					$leftColumn = $currentGrip.data('th');
//					leftColOldW = $leftColumn.width();
//					var $spaceColumn = $("th.space", _this._$table);
//					var spaceColW = $spaceColumn.width(), spaceW;
//					
//	                var target = $(e.target);
//	                target.addClass("clicked");
//	                target.data("startPos", target.position().left);
//					var difference , leftColW, tblWidth;
//					$(document).on('mousemove.rc', function (e) {
//						difference = e.clientX - startPosition;
//						leftColW = leftColOldW + difference;
//						spaceW = spaceColW - difference;
//						tblWidth = _this._$table.width() + difference;
//	                    target.css('left', target.data("startPos") + difference);
//					});
//					return $(document).one('mouseup', function () {
//						$(document).off('mousemove.rc');
//						_this.el.hide();
//						leftColW = leftColOldW + difference;
//						spaceW = spaceColW - difference;
//						tblWidth = _this._$table.width() + difference;
//						$leftColumn.width(leftColW);
////						$spaceColumn.width(spaceW);
////						_this._$table.width(tblWidth);
//	                    target.removeClass("clicked");
//	                    _this.el.show();
////						return 	_this.syncHandleWidths();	
//					});
//					
//				});
//				return $resizer.appendTo($handleContainer);
//			});
//		}
        
		/*	
		for(var i=0,len=colModel.length;i<len;i++) {
			var resizer = $('<div class="resizer"></div>').attr('index', i).appendTo(this.el);
			
			left += cells[i].clientWidth;
			resizer.css('left', left + 'px');
		}
		
		var treeview = this,
			startPos, endPos, startWidth, index, cell, startLeft;
			
			
		function mousedownFn(event) {
			var target = $(event.target);
			if(target.hasClass('resizer')) {
				event.preventDefault();
				startPos = event.pageX;
				index = target.attr('index');
				cell = $(cells[index]);
				startWidth = cell.width();
				startLeft = parseInt(target.css('left'));
				$(document).on('mousemove', mouseoverFn).one('mouseup', mouseupFn);
			}
		}
		function mouseoverFn(event) {
			var endPos = event.pageX;
			cell.width(startWidth + endPos - startPos);
		}
		function mouseupFn(event) {
			var target = $(event.target),
				endPos = event.pageX,
				resizers = treeview.el.find('.resizer'),
				resizer;
			for(var i=index,len=resizers.length;i<len;i++) {
				resizer = $(resizers[i]);
				resizer.css('left', (parseInt(resizer.css('left')) + endPos - startPos) + 'px');
			}
			
			$(document).off('mousemove', mouseoverFn);
		}
		
		function syncHandleWidths(){
			var _this = this;

	        this.$handleContainer.width(this.$table.width());
	        this.$handleContainer.find('.rc-handle').each(function (_, el) {
	
	            return $(el).css({
	                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - _this.$handleContainer.offset().left),
	                height: _this.$table.height()
	
	            });
	
	        });
		}
		
		this.el.on('mousedown', mousedownFn);*/
	},
	
	find: function(id){
		var $tr = $('#' + id, this._$table);
		return $tr.length > 0;
	},
	
	getNode: function(id){
		var $tr = $('#' + id, this._$table);
		return $tr;
	},
	
	expandNode: function(id , reload){
		var $tr = $('#' + id, this._$table);
		
		if(reload){
			this._$table.removeChildren(id);
			delete this.loadedNodes[id];
		}
		return this._$table.expand($tr);
	},

	getSelectedValue: function(colKey){
		var value = null;
		if(this._selectItem){
			colKey = colKey.charAt(0).toLowerCase() + colKey.slice(1);
			if(colKey == "nodeType"){
				value = this._selectItem.isExpandNode ? 1 : 0;
			} else if(colKey.toLowerCase() == "oid"){
				value = this._selectItem["oid"];
			} else {
				value = this._selectItem[colKey];
			}
		}
		return value;

	},
	
	getNodeValue: function($node) {
		if($node.length > 0){
			var id = $node.attr('id');
		
       		var index = id.lastIndexOf('_');
       		
//			var itemKey = id.substring(0,index);
//			var oid = id.substring(index+1);
			var itemKey = $node.attr("itemkey");
			var oid = $node.attr("oid");
			
			
		  	var itemData = {};
	    	itemData.oid = oid || 0;
	   		itemData.itemKey = itemKey || this.itemKey; 
			return itemData;
		}
	},
	
	removeNode: function(id){
		this._$table.removeNode(id , true);
		delete this.loadedNodes[id];
		
	},
	
	isChainDict: function(){
		return this.dictType == YIUI.SECONDARYTYPE.CHAINDICT;
	},
	
		// 添加节点
	addNodeByItem: function($pNode, item){
		if(item == undefined){
			return;
		}
		
		var html = this.createRowByItem($pNode, item);

		this._$table.addChilds(html);
		
		//$("#"+this.selectId).addClass("sel-row");
		
		//this.loadedNodes[id] = true;
	},
	
		// private
	createRowByItem : function($pNode, item) {
		//this._datas[rowdata.id] = rowdata;
		
		var id = item.itemKey +'_'+item.oid;
		
		delete this.loadedNodes[id];
		
		//rowdata.id = rowdata.id || getId();
		var tr = $('<tr id="'+id+'"></tr>');
		
		if($pNode){
			tr.attr('pid', $pNode.attr('id'));
		}else{
			tr.attr('pid', this.root.id);
		}
		if(!this.isChainDict()){
			if(item.nodeType == 1){
				tr.attr('haschild', true);
			}
		}

		if(item.oid != undefined ){
			tr.attr('oid', item.oid);
		}
		
		if(item.itemKey != undefined ){
			tr.attr('itemKey', item.itemKey);
		}
//		if(rowdata.previd != undefined){
//			tr.attr('previd', rowdata.previd);
//		}
		
//		if(rowdata.isfirst != undefined && rowdata.isfirst){
//			tr.attr('isfirstone', true);
//		}
		
//		if(rowdata.islast != undefined && rowdata.islast){
//			tr.attr('islastone', true);
//		}
		
		if(item.enable != undefined){
			tr.attr('enable', item.enable);
			switch(item.enable) {
				case -1:
					tr.addClass("invalid");
					break;
				case 0: 
					tr.addClass("disabled");
					break;
				case 1:
//					tr.addClass("invalid");
					break;
			}
		}
		
		var value;
		for (var j=0,len=this.colModel.length;j<len;j++) {
			value = item.getValue(this.colModel[j].key);
			if(!value){
				value = '';
			}
			$('<td>' + value + '</td>').appendTo(tr);
		}
//		$('<td></td>').appendTo(tr);
		
		return tr;
	},
	
	addNode: function(itemData) {
		var self = this;
        var curID = itemData.itemKey + '_' + itemData.oid;
		//目前 不同字典 是通过重新加载 父节点来实现 刷新的。
        if (this.isChainDict()) {
            YIUI.DictService.getItem(itemData.itemKey, itemData.oid).done(function(item) {
            	self.addNodeByItem(null, item);
            	self.focusNode(curID);
            });
        } else {
            //获取当前节点所有父节点
            YIUI.DictService.getParentPath(this.itemKey, itemData).then(function(parents) {
//            	parents = parents[0];
//            	var last = parents[parents.length - 1];
//            	var id = last.itemKey + '_' + last.oid;
//            	//父节点
//            	if (self.find(id)) {
//            		self.expandNode(id, true);
//            	} else {
//            		for (var i = 0; i < parents.length; i++) {
//            			id = parents[i].itemKey + '_' + parents[i].oid;
//            			self.expandNode(id);
//            		}
//            	}
//            	self.focusNode(curID);

            	if(parents.length > 0) {
            		self.isMultiExpand = true;
            		self._expand(parents[0], curID, 1, true);
            	}
            });
        }
	},
	

	_expand: function(parents, curID, index, isAdd){
		var self = this;
//		var parent = parents[0];
    	var last = parents[parents.length - 1];
    	var id = last.itemKey + '_' + last.oid;
    	//父节点
    	if (self.find(id)) {
    		return self.expandNode(id, true).then(function() {
		    	if(!isAdd) {
		    		var node = self.getNode(curID);
		    		if (node.attr('enable') == 1) {
		    			for (var i = 0; i < parents.length; i++) {
		    				id = parents[i].itemKey + '_' + parents[i].oid;
		    				var parent = self.getNode(id);
		    				parent.attr('enable', 1);
		    				parent.removeClass('invalid').removeClass('disabled');
		    			}
		    		}
		    	}
		        self.focusNode(curID);
    		});
    	} else {
    		if(index < parents.length){
				var oid = parents[index].oid;
				id = parents[index].itemKey + '_' + parents[index].oid;
				if (self.find(id)) {
					return self.expandNode(id).then(function() {
						self._expand(parents, curID, index + 1, isAdd);
					});
				}
    		}
    	}

//    	if(!isAdd) {
//    		var node = self.getNode(curID);
//    		if (node.attr('enable') == 1) {
//    			for (var i = 0; i < parents.length; i++) {
//    				id = parents[i].itemKey + '_' + parents[i].oid;
//    				var parent = self.getNode(id);
//    				parent.attr('enable', 1);
//    				parent.removeClass('invalid').removeClass('disabled');
//    			}
//    		}
//    	}
//        self.focusNode(curID);

    },

	//更新节点　图标　及　显示字段
	refreshNode: function(itemData){
		var self = this;
        var curID = itemData.itemKey + '_' + itemData.oid;
        if (this.isChainDict()) {
            var $tr = $('#' + curID, self._$table);
    		self.handler.refreshNode(self, $tr).then(function() {
    			self.focusNode(curID);
    		});
        } else {
            //删除当前节点的所有子节点并将该节点设置为未展开
        	self.removeNode(curID);
        	
            //获取当前节点所有父节点
            YIUI.DictService.getParentPath(this.itemKey, itemData).then(function(parents) {
            	
            	if(parents.length > 0) {
            		self.isMultiExpand = true;

            		var parent = parents[0];
            		var p = parent[parent.length - 1];
                    var $tr = $('#' + curID, self._$table);
                    var pid = p.itemKey + "_" + p.oid;
                    if(pid == $tr.attr("pid")) {
                    	self.handler.refreshNode(self, $tr).then(function() {
                			self.focusNode(curID);
                		});
                    } else {
                		self._expand(parent, curID, 1);
                    }
            	}
            	
//            	parents = parents[0];
//            	var last = parents[parents.length - 1];
//            	var id = last.itemKey + '_' + last.oid;
//            	//父节点
//            	if (self.find(id)) {
//            		self.expandNode(id, true);
//            	} else {
//            		for (var i = 0; i < parents.length; i++) {
//            			id = parents[i].itemKey + '_' + parents[i].oid;
//            			self.expandNode(id);
//            		}
//            	}
//            	var node = self.getNode(curID);
//            	if (node.attr('enable') == 1) {
//            		for (var i = 0; i < parents.length; i++) {
//            			id = parents[i].itemKey + '_' + parents[i].oid;
//            			var parent = self.getNode(id);
//            			
//            			parent.attr('enable', 1);
//            			parent.removeClass('invalid').removeClass('disabled');
//            		}
//            	}
//            self.focusNode(curID);
            });
        }
		
	},
	getQueryValue: function(){
		return this._$fuzzyText.val();
	},
	clearSelection: function(){
		if(this.selectId){
			$('#' + this.selectId, this._$table).removeClass("sel-row");
		}
		this.selectId = null;
		this._selectItem = null;
	},
	dependedValueChange: function(targetField, dependedField){
				//TODO 目前dictview的itemKey非动态

        var formID = this.ofFormID;
        var itemFilters = this.itemFilters;
        var itemKey = this.itemKey;
        var key = this.key;

        var form = YIUI.FormStack.getForm(formID);
        var filter = this.handler.getDictFilter(form, key, itemKey, itemFilters);
		
		
		var isSame = function(filter1 , filter2){
			if(filter2 == null){
				return false;
			}
			
			if(filter1.itemKey != filter2.itemKey){
				return false;
			}
			if(filter1.formKey != filter2.formKey){
				return false;
			}
			if(filter1.fieldKey != filter2.fieldKey){
				return false;
			}
			if(filter1.filterIndex != filter2.filterIndex){
				return false;
			}
			
			if(filter1.values.toString() != filter2.values.toString()){
				return false;
			}
			
			if(filter1.dependency != filter2.dependency){
				return false;
			}
			
			return true;
			
		}
		
		var refresh = false;
		
		if(filter != null && !isSame(filter , this.dictFilter)){
			this.dictFilter = filter;
			refresh = true;
		}else if(filter != null){
			if(this.dictFilter.dependency && this.dictFilter.dependency.toLowerCase().indexOf(dependedField.toLowerCase()) >= 0 ){
				refresh = true;
			}	
		}else if(this.dictFilter != null){
			this.dictFilter = null;
			refresh = true;
		}
		
		if(!refresh){
			return;
		}
		
		if(this.isChainDict()){
			this.handler.doGoToPage(this, 0, true);
		}else{
			this.expandNode(this.root.id , true);
		}
	}
});

YIUI.reg('dictview', YIUI.Control.DictView);
})();