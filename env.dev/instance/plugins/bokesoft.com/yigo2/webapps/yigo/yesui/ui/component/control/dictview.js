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
    
	init : function(options) {
		this.base(options);
		this.dataUrl = '';
		var self = this;
		self.pageSize = self.pageRowCount;
		self.loadedNodes = {};
		this.option = {
			theme : 'default',
			expandLevel : 2,
			expandable: true,
			levelMinus: true,
			beforeExpand : function(node) {
				var id = $(node).attr('id');
				if(!self.loadedNodes[id]) {
					
					self.handler.doExpand(self, $(node));
					
					//var rows = treeview.loadChildren(id);
					//var html = treeview.createRowsHtml(rows);
					//$table.addChilds(html);
					self.loadedNodes[id] = true;
					
					if(!$(node).is(":hidden")) {
						$(node).click();
						if(!self._selectItem) return;
						var id = self._selectItem.itemKey + "_" + self._selectItem.oid;
						if(id == node.attr("id")) {
							self._selectItem.isExpandNode = true;
						}
					}
				}
			},
			
			onSelect : function($table, node) {
            	if(node){
					$('#' + self.selectId, $table).removeClass("sel-row");
	//				console.log('onSelect: ' + id);
					node.addClass('sel-row');
					var rowIndex =  node.index();
					var id = node.attr('id')
					if(id){
						if(self.hasClick){
							self.selectId = id;
							self.handler.doOnRowClick(self, node);
						}else if (self.hasRowChanged){
							if(self.selectId != id){
								self.selectId = id;
								self.handler.doOnFocusRowChange(self, node);
							}
						}
					}

            	}
			},
			doubleClick:self.hasDblClick ? function($table , node){
							self.handler.doOnDblClick(self, node);
						}:null
		};
		
		this.data = options.data.addedNodes;
		if(this.data == undefined){
			this.data = {};
		}

	},
	
	setEnable : function(enable) {
		this.base(enable);
		this._$table.setEnable(enable);
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
	
	/** 
	 * 完成渲染。
	 */
	onRender: function (ct) {
		this.base(ct);
		this.el.addClass('ui-dv');
		if($.browser.isIE) {
			this.el.attr("onselectstart", "return false");
		}
		
		var $fuzzybar = this.$fuzzybar = $('<div id="'+this.id+'-fuzzy" class="fuzzy"/>');
        this._$fuzzyText =  $('<input id="'+this.id+'_textbtn" type="text" style="height: 30px;"/>').addClass('txt').appendTo($fuzzybar);
        this._$fuzzyBtn =  $('<button id="'+this.id+'_dropbtn" style="height: 30px; width: 30px;"></button>').appendTo($fuzzybar);
        
        if(!this.isHiddenFuzzyBar){
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
	        pageIndicatorCount: this.pageIndicatorCount
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
		if(this.totalRowCount <= this.pageSize) {
			this._pagination.hidePagination();
		}
		
//		if(this._totalRowCount <= this.pageRowCount) {
//			this._pagination.hidePagination();
//		}
		
		this.addNodes(this.data);
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
	
	initDefaultValue: function(options) {
    	this.base(options);
    	this._$table = $("table", this.el);
    },

    setTotalRowCount: function(totalRowCount){
    	this.totalRowCount = totalRowCount == undefined ? this.totalRowCount : totalRowCount;
		this._pagination.setTotalRowCount(this.totalRowCount, this.isResetPageNum);
		this.isResetPageNum = false;
    },
	
	// 处理差异
	diff: function(diffJson){
		var treeView = this;
//		treeView.calpages(diffJson);

//		if(diffJson.totalRowCount && diffJson.totalRowCount <= treeView.pageRowCount || treeView._totalRowCount <= treeView.pageRowCount) {
//			treeView._pagination.hidePagination();
//		} 
		treeView.setTotalRowCount(diffJson.totalRowCount);
		
//		treeView._pagination.setTotalRowCount(treeView._totalRowCount, treeView.isResetPageNum);
//		treeView.isResetPageNum = false;
		
		
		this.base(diffJson,function(name,value){
			
			if(name == 'data'){
								
				if(value.deletedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.deleteNodes(value.deletedNodes);
					for (var i = 0, len = value.deletedNodes.length; i < len; i++) {
						this.loadedNodes[value.deletedNodes[i]] = false;
					}
				}
			
				
				if(value.addedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.addNodes(value.addedNodes);
				}
				
				if(value.updatedNodes){
					
					for (var i = 0, len = value.updatedNodes.length; i < len; i++) {
						this.refreshNode(value.updatedNodes[i]);
					}
	
				}
				
				
			}
			
		});
					
		if(diffJson.focusedNode){
			var $tr = $('#' + diffJson.focusedNode, this._$table);
			if($tr){		
				if(this.selectId){
					$('#' + this.selectId, this._$table).removeClass("sel-row");
				}
		
				$tr.addClass('sel-row');	
				this.selectId = diffJson.focusedNode;
			}
		}

	},
	focusNode: function(id){
		var $tr = $('#' + id, this._$table);
		if($tr){		
			if(this.selectId){
				$('#' + this.selectId, this._$table).removeClass("sel-row");
			}
	
			$tr.addClass('sel-row');
			if(!$tr.hasClass("selected")) {
				$tr.addClass('selected');
			}
			this.selectId = id;
			
//			if(isNew) return;
			if(this.hasClick){
				this.handler.doOnRowClick(this, $tr);
			}else if (this.hasRowChanged){
				this.handler.doOnFocusRowChange(this, $tr);
			}
		}
		
	},
	
	// 删除节点
	deleteNodes: function(ids){
		if(ids == undefined){
			return;
		}
		this._$table.removeNodes(ids);
	},
	
	// 添加节点
	addNodes: function(nodes){
		if(nodes == undefined){
			return;
		}
		
		var html = this.createRowsHtml(nodes);

		this._$table.addChilds(html);
		
		//this.loadedNodes[id] = true;
	},

    syncHandleWidths: function(){
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
		this._$table.expand($tr);
	},
	
	expandTo : function( dictView, itemData) {
    	var parents = YIUI.DictService.getParentPath(dictView.itemKey, itemData);
    	if ( parents == undefined || parents.length == 0) {
        	return false;
        }
		parents = parents[0];
		for (var i = 0; i < parents.length; i++) {
			id = parents[i].itemKey + '_' + parents[i].oid;
			var $node = $("#" + id);
			var IsExpand = dictView.loadedNodes[id];
            if (IsExpand) {
            	 dictView.expandNode(id, false);
            	 continue;
            }
			$("#" + id).addClass("expanded");
			this.option.beforeExpand( $node );
		}
		var itemKey = parents[0].itemKey;
		var curID = itemKey + '_' + itemData.oid;
		var $item = $("#" + curID);
		if ($("#"+curID).offset().top > $(window).height()) {
			$(".paginationjs-content", this.el).scrollTop($(window).height());
		}
    	dictView.focusNode(curID);
		
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
		return !this.isHiddenFuzzyBar;
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
	//更新节点　图标　及　显示字段
	refreshNode:function(id){
		this.handler.refreshNode(this,id);
		/*var array = id.split('_');
		var item = YIUI.DictService.getItem(array[0], array[1]);
		var $tr = $('#' + id, this._$table);
		
		if(item.nodeType == 1){
			$tr.attr('haschild', true);
		}
		
		if(item.enable != undefined){
			$tr.attr('enable', item.enable);
			$tr.removeClass('invalid').removeClass('disabled');
			switch(item.enable) {
				case -1:
					$tr.addClass("invalid");
					break;
				case 0: 
					$tr.addClass("disabled");
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
			$($tr.children('td')[j]).html(value);
			//$('<td>' + value + '</td>').appendTo(tr);
		}
		this._$table.formatNode($tr);*/
		
	},
	getQueryValue: function(){
		return this._$fuzzyText.val();
	},
	clearSelection: function(){
		if(this.selectId){
			$('#' + this.selectId, this._$table).removeClass("sel-row");
			this.selectId = null;
		}
	},
	dependedValueChange: function(dependedField){
				//TODO 目前dictview的itemKey非动态
		
		var filter = this.handler.getDictFilter(this);
		
		
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