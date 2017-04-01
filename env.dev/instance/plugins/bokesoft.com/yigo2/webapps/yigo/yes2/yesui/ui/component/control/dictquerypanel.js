(function() {
	YIUI.DictQuery = function(options) {
		options = $.extend(true, {
			startRow: 0, 
			maxRows: 5, 
			pageIndicatorCount: 3, 
			fuzzyValue: "",
			columns: [ {
    			key: "Name",
    			caption: "名称",
    			visible: true,
    			enable: true
    		}, {
    			key: "Code",
    			caption: "代码",
    			visible: true,
    			enable: true
    		}]
		}, options);
		var dictQuery = $("<div></div>").attr("id", "dict_dialog").addClass("dtquery");
    	var searchTxt = new YIUI.Control.TextEditor({
    		x: 0,
			y: 0,
			top: "5px",
			metaObj: {
				visible: true,
			},
    		listeners: {
    			change: $.noop
    		},
    		install: $.noop,
    		value: options.fuzzyValue
    	});
    	var searchBtn = new YIUI.Control.Button({
    		x: 1,
			y: 0,
			top: "5px",
			metaObj: {
				visible: true,
			},
    		listeners: {
    			click: $.noop
    		},
    		value : '查询'
    	});
    	var listView = new YIUI.Control.ListView({
    		x: 0,
			y: 1,
			colspan: 2,
			metaObj: {
				pageRowCount: options.maxRows,
				visible: true,
				pageIndicatorCount: options.pageIndicatorCount,
				columnInfo: options.columns
			},
			showPageDetail: false,
			showFirstButton: false,
			showLastButton: false
    	});
    	
    	//默认是显示两列  code、name
    	if(options.displayCols) {
    		listView.columnInfo = options.displayCols;
    	}
    	
    	listView.addDataRow = function(data){
        	var $tbody = $(".tbl-body tbody", listView.$table);
        	var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
        	if(listView.$table && data !== undefined) {
            	var $tbody = $(".lv-tb .lv-body tbody", this.el);
            	$("tr.space", $tbody).remove();
            	if($("tr.data", $tbody).length == 0 || $("label.empty", $tbody).length == 0) {
            		$("label.empty", $tbody).remove();
            	}
            	var $tr , value , $td;
            	$.each(data , function(i , row){
            		$tr = $('<tr></tr>').addClass("data");
            		if(!hasFirst && i == 0) {
            			$tr.addClass("first");
            		}
        			var seq = $tbody.children().length+1;
            		if(seq % 2 == 0) {
            			$tr.addClass("even");
            		}
            		$.each(listView.columnInfo , function(i , column){
            			$td = $('<td></td>');
            			if(i == 0) {
            				var span = $("<span/>").addClass("dict_icon").appendTo($td);
            				if(row.NodeType == 1) {
            					span.addClass("p_node");
            				}
            			}
                		
        				value = row[column.key];
    					$td.append(value);
            			if(column.visible) {
            				$tr.append($td);
            			}
            		});
            		$tr.data("caption", row["caption"]);
            		$tr.data("itemKey", row["itemKey"]);
            		$tr.data("oid", row["oid"]);
            		$tbody.append($tr);
            	});
        	}
        };

        listView.addEmptyRow = function() {
        	var $body = $(".lv-tb .lv-body", this.el);
    		var $tbl = $(".tbl-body", $body);
        	$("tr.space", $tbl).remove();
    		if($("tr.data", $tbl).first().length == 0) {
        		var lbl = $("tbody label.empty", $tbl);
    			if(lbl.length == 0) {
    				lbl = $("<label class='empty'>表中无内容</label>");
    				$("tbody", $tbl).append(lbl);
    			}
    			var width = $("tr.first", $tbl).width();
    			var top = ($body.height() - lbl.height()) / 2;
    			lbl.width(width).css("top", top + "px");
    			return;
    		}
    		
    		var tr_h = $("tr.data", $tbl).first().outerHeight();
    		var body_h = $(".tbl-body", $body).outerHeight();
    		if(!body_h) {
    			var len = $("tr.data", $tbl).length;
    			body_h = 0;
    			for (var i = 0; i < len; i++) {
    				body_h +=  $("tr.data", $tbl).eq(i).outerHeight();
    			}
    		}
    		var total_h = (($body[0].clientHeight || $body.height()) - body_h);
    		var count = Math.ceil( total_h / tr_h);
    		var last_h = total_h - (count - 1) * tr_h;
    		if(count <= 0) return;
    		for (var i = 0; i < count; i++) {
    			var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
    			var index = $tr.index() + 1;
    			if(index % 2 == 0) {
    				$tr.addClass("even");
    			}
        		$.each(this.columnInfo , function(i , column){
        			var $td = $('<td></td>');
        			if(column.visible) {
        				$tr.append($td);
        			} 
        		});
    			if(i == count - 1) {
    				$tr.addClass("last");
    				$("td", $tr).height(last_h);
    				var h = $body.height() - $tbl.height();
    				if(h > 0 && h < tr_h) {
    					$("td", $tr).height(last_h + h);
    				}
    				
    			} else {
    				$tr.outerHeight(tr_h);
    			}
    		}
    		
    	};
        listView.createColumnHead = function(){
        	var $thead = $(".tbl-head thead", this.$table);
        	var $tbody = $(".tbl-body tbody", this.$table);
        	if(this.columnInfo && this.columnInfo.length > 0 ){
    			var $tr = $('<tr></tr>'),$th;
    			var $tr_b = $('<tr class="first"></tr>'),$td;
    			for( var i = 0, len = this.columnInfo.length; i < len; i ++){
    				this.columnInfo[i].width = Math.round((1 / len)*100)+"%";
    				
    			    $th = $('<th><label>' + this.columnInfo[i].caption + '</label></th>').attr("colIndex", i);
//    			    if($.isPercentage(this.columnInfo[i].width)) {
//    			    	this.$percentages.push(this.columnInfo[i]);
//    			    }
    			    $th.css("width", $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width())));
//    			    $th.css("width", this.columnInfo[i].width);
    			    $("label", $th).css("width", $th.width()).css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
    			    

    			    $td = $('<td></td>').attr("colIndex", i);
    			    $td.css("width", $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width())));
    			    $td.css("height", "0px");
    			    
    			    if(this.columnInfo[i].visible != false) {
    			    	$tr.append($th);
    			    	$tr_b.append($td);
    			    }
    			}
        	}
    		$thead.append($tr);
    		$tbody.append($tr_b);
        };
        listView.onSetWidth = function(width) {
    		this.el.css("width", width);
    		this._pagination.content.css("width", width);
    		var $ths = $("th", this.$table), 
    			$tds = $("tr.first td", this.$table),
    			$th, $td, $thWidth, _index;
    		var tblW = 0;
    		for (var i = 0, len = this.columnInfo.length; i < len; i++) {
    			$th = $("[colindex="+i+"]", this.$table);
    			$td = $tds.eq($th.index());
    			if(!this.columnInfo[i].visible) continue;
    		    $thWidth = $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width()));
    			$th.css("width", $thWidth);
    			$td.css("width", $th.width());
    			$td.outerWidth($th.outerWidth());
    		    $("label", $th).css("width", $thWidth);
    		    tblW += $thWidth;
    		}
    		
    		this.syncHandleWidths();
    	};
    	var gridpanel = new YIUI.Panel.GridLayoutPanel({
    		rowGap : 5,
			columnGap : 5,
			leftPadding: 5,
			topPadding: 5,
			bottomPadding: 5,
    		widths : ["99%", 80],
    		minWidths: [-1, -1],
    		heights : [30, "100%"],
    		width: "100%",
    		height: "100%",
    		items : [searchTxt, searchBtn, listView]
    	});

		dictQuery.modalDialog(null, {title: options.caption || " ", showClose: false, isResize: false, width: "500px", height: "345px", className: "dict"});
		gridpanel.render(dictQuery.dialogContent());
		
		
		$(".dialog-close", dictQuery).click(function() {
            options.callback();
            options.textInput.focus();
		});

		searchBtn.el.unbind();
		$("input", searchTxt.el).unbind();
    	searchBtn.el.click(function(event) {
    		getDictData($("input", searchTxt.el).val(), 0, true);
    	});
    	searchTxt.el.keypress(function (event) {
            if (event.keyCode == 13) {
                searchBtn.el.click();
                $("input", searchTxt.el).blur();
            }
        });
    	listView.el.addClass("ui-dictquery");
    	listView._pagination.pageChanges = function(pageNum) {
    		getDictData($("input", searchTxt.el).val(), pageNum*options.maxRows);
        };
        
		var getDictData = function(fuzzyValue, startRow, isResetPageNum) {
			YIUI.DictService.getQueryData(options.itemKey, startRow, options.maxRows, options.pageIndicatorCount, fuzzyValue, options.stateMask, options.dictFilter, options.rootValue)
					.done(function(data) {
						if(startRow == 0 && data.totalRowCount < options.maxRows) {
							listView._pagination.hidePagination();
						} else if(data.totalRowCount) {
							listView._pagination.setTotalRowCount(data.totalRowCount + startRow, isResetPageNum || false);
						}
						listView.data = data.data;
						listView.clearDataRow();
						listView.addDataRow(listView.data);
						listView.addEmptyRow();
					});
		};

		listView.$table.undelegate();
		listView.$table.delegate(".tbl-body tr", "dblclick", this.doubleClick == null ? function(event) {
			if(!listView.enable || $(this).attr("enable") == "false") return;
        	var colIndex = $(event.target).index();
            var rowIndex = $(event.target).parent().index();
            var caption = $(this).data("caption"),
            	itemKey = $(this).data("itemKey"),
            	oid = $(this).data("oid"),
            	paras = {};
            paras.oid = oid || 0;
            paras.itemKey = itemKey;
            paras.caption = caption;
	   		var itemData = new YIUI.ItemData(paras);
	   		
            options.callback(itemData);
            dictQuery.close();

//    		var ipArr = $("input");
//    		var ipCur = options.textInput;
//    		var index = ipArr.index(ipCur) + 1;
//    		ipArr.eq(index).focus();
            options.textInput.focus();
            event.stopPropagation();
            
        } : this.doubleClick);
		searchBtn.el.click();
	}
})();

