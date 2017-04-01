/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-4-21
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

YIUI.ListViewWithLayout = function(listView)  {
    var columnMap = {};
    $.each(listView.columnInfo , function(i , column) {
        columnMap[column.key] = column;
    });
    var layoutView = listView.layoutView;
    var items = layoutView['items'];
    var _height = 0, _width = 0, _seqWidth = 50;
    return {
        _drawLayoutPanel : function(panel) {
            $("tr[row!='0'] td", panel.el).addClass("lv-cell-sp")
        },

        _getRowLayoutWidth :function() {
           return _width - _seqWidth;
        },

        createFirstDataLayoutView: function() {
            var dataLayout = $.extend(true, {}, layoutView);
            $.each(dataLayout.items, function (i, item) {
                item.type = YIUI.CONTROLTYPE.LABEL;
                item.tagName = "label";
            });
            var $td = $("<td class='lv-layout'></td>");
            $td.css("width", _width);
            $td.css("height", "0px");
            return $td;
        },
        createDataLayoutView: function(rowData) {
            var layoutConfig = $.extend(true, {}, layoutView);
            var $td = $("<td class='lv-layout'></td>");
            $td.css("width", _width);
            $td.css("height", _height);

            $.each(layoutConfig.items, function(i, item) {
                item.ofFormID = listView.ofFormID;
                item.tagName = "label";
                item.type = YIUI.CONTROLTYPE.LABEL;
                var value;
                if (rowData) {
                    var cell = rowData[item.key];
                    value = (cell && cell.value!=="") ? cell.caption: '';
                } else {
                    return;
                }
                item.caption  = value;
                //item.text = value;
                var column = columnMap[item.key];
                switch (column.columnType) {
                    case YIUI.CONTROLTYPE.CHECKBOX:
                        delete item.caption;
                        delete item.text;
                    case YIUI.CONTROLTYPE.BUTTON:
                    case YIUI.CONTROLTYPE.HYPERLINK:
                        item.type = column.columnType;
                        $.extend(item, column);
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                        if(column.isOnlyDate){
                            item.caption = value.split(" ")[0];
                        }
                }

            });
            var panel = new YIUI.Panel(layoutConfig);
            panel.render($td);
            panel.doLayout(this._getRowLayoutWidth(), _height);
            //此处清除checkbox.js中定义的值变化事件
            $(".chk", $td).unbind();
            this._drawLayoutPanel(panel);
            return $td;
        },
        createHeadLayoutView: function() {
           var headLayout = $.extend(true, {}, layoutView);
           $.each(headLayout.items, function (i, item) {
               var column = columnMap[item.key];
               item.type = YIUI.CONTROLTYPE.LABEL;
               item.tagName = "label";
               item.caption = column.caption;
           });
           // headLayout.tagName = headLayout.layout.toLowerCase() + "panel"
           // var panel = YIUI.create(headLayout);
            var panel = new YIUI.Panel(headLayout);
            var $th = $("<th class='lv-layout'></th>");
            $th.css("width", this._getRowLayoutWidth());
            $th.css("height", _height);
            panel.render($th);
            panel.doLayout(this._getRowLayoutWidth(), _height);
            this._drawLayoutPanel(panel);
            return $th;
        },
        createColumnHead: function() {
            _width = listView.el.width();
            var $thead = $(".tbl-head thead", listView.$table);
            var $tbody = $(".tbl-body tbody", listView.$table);
            if(listView.columnInfo && listView.columnInfo.length > 0 ){
                var $tr = $('<tr></tr>'),$th;
                var $tr_b = $('<tr class="first"></tr>'),$td;

                //生成序号列
                $th = $('<th><label>序</label></th>').addClass("seq");
                $("label", $th).css("width", "100%").css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
                $tr.append($th);
                $td = $('<td></td>').addClass("seq");
                $td.css("height", "0px");
                $tr_b.append($td);

                //生成表格列标题布局
                $th = this.createHeadLayoutView();
                $tr.append($th);

                //生成表格数据行布局
                $td = this.createFirstDataLayoutView();
                $tr_b.append($td);

                $("<th class='space'></th>").appendTo($tr);
                $("<td class='space'></td>").css("height", "0px").appendTo($tr_b);
            }
            $thead.append($tr);
            $tbody.append($tr_b);
        },
        onSetWidth: function(width) {
            listView.el.css("width", width);
            listView._pagination.content.css("width", width);
            var $ths = $("th", listView.$table),
                $th, $td, thWidth, _index;
            $("th.space", listView.$table).css("width", "100%");
            var widthItems = layoutView.widths;
            var allWidth = 0;
            $.each(widthItems, function(index, widthItem) {
                thWidth = $.getReal(widthItem, listView.calcRealValues(widthItems, listView.el.width()));
                allWidth += thWidth;
                $(".lv-tb .lv-layout tr td[col='" + index +"']").each( function(_index, el) {
                    $(el).css("width", thWidth);
                    $("div", el).children().eq(0).width(thWidth);
                });
            });

            _width = Math.max(width, allWidth + _seqWidth);
            $(".lv-layout", listView.el).css("width", this._getRowLayoutWidth());
            $("div.ui-pnl", listView.el).css("width", this._getRowLayoutWidth());
            $("table.lv-tb", listView.el).css("width", _width);
            listView.syncHandleWidths();
        },

        addEmptyRow: function() {
            var $body = $(".lv-tb .lv-body", listView.el);
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
            var client_h = ($body[0].clientHeight || $body.height());
            var total_h = (client_h - body_h);
            var count = Math.ceil( total_h / tr_h);
            var last_h = total_h - (count - 1) * tr_h;
            if(count <= 0) return;
            for (var i = 0; i < count; i++) {
                var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
                var index = $tr.index() + 1;
                if(index % 2 == 0) {
                    $tr.addClass("even");
                }
                $('<td></td>').addClass("seq").appendTo($tr);

                var $td = this.createDataLayoutView();
                $tr.append($td);

                $("<td class='space'></td>").appendTo($tr);
                if(i == count - 1) {
                    $tr.addClass("last");
                    $("td", $tr).height(last_h);
                    var h = client_h - $tbl.height();
                    if(h > 0 && h < tr_h) {
                        $("td", $tr).height(last_h + h);
                    }
                } else {
                    $tr.outerHeight(tr_h);
                }
            }
            this.onSetWidth(_width);
        },

        addDataRow: function(data){
            if(data && listView.$table) {
                var $tbody = $(".tbl-body>tbody", listView.$table);
                $("tr.space", $tbody).remove();
                if($("tr.data", $tbody).length == 0) {
                    $("label.empty", $tbody).remove();
                }
                var $tr , value , $td;
                var _this = this;
                var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
                $.each(data , function(i , row){
                    $tr = $('<tr></tr>').addClass("data");
                    $td = $('<td></td>').addClass("seq");
                    if(!hasFirst && i == 0) {
                        $tr.addClass("first");
                    }
                    var seq = $tbody.children().length+1;
                    if(seq % 2 == 0) {
                        $tr.addClass("even");
                    }
                    $tr.append($td.html($tbody.children().length));
                    $td = _this.createDataLayoutView(row);
                    $tr.append($td);

                    $("<td class='space'></td>").appendTo($tr);
                    $tbody.append($tr);
                });
            }
        },

        install: function () {
            var self = this;
            listView.$table.delegate(".chk", "click", function(event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                if($(this).attr('isChecked') && $(this).attr('isChecked') == 'true'){
                    $(this).attr('isChecked', 'false');
                    $(this).removeClass("checked");
                }else{
                    $(this).attr('isChecked','true');
                    $(this).addClass("checked");
                }

                var colKey = $(event.target).parents('div.ui-chk').attr("id");
                colKey = self._getCompKey(colKey);
                var colIndex = $.inArray(columnMap[colKey],  listView.columnInfo);

                //var index = $(event.target).parent('td').index();
                //var colIndex = $("thead th", self.$table).eq(index).attr("colIndex");
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                var isChecked = $(this).attr('isChecked') == "true" ? true : false;
                listView.handler.doCellValueChanged(listView , rowIndex , colIndex , isChecked)
                event.stopPropagation();
            });

            listView.$table.delegate(".ui-btn", 'click', function(event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                var colKey = $(this).attr("id");
                colKey = self._getCompKey(colKey);
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                listView.handler.doOnCellClick(listView , rowIndex , colKey);
                event.stopPropagation();
            });

            listView.$table.delegate(".ui-hlk", 'click',function( event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                var colKey = $(this).attr("id");
                colKey = self._getCompKey(colKey);
                listView.handler.doOnCellClick(listView , rowIndex , colKey);
                event.stopPropagation();
            });
        },

        _getCompKey : function(compID) {
            if (!compID) return compID;
            if (!listView.ofFormID)  return compID;

            var pre = listView.ofFormID + "_";
            if (compID.length > pre.length  && compID.substring(0, pre.length) == pre) {
                return compID.substring(pre.length)
            }
            return compID;
        },

        _createHandles: function () {
            var _this = listView;
            _this.$handleContainer = $("<div class='rc-handle-cntr'/>");
            _this.$table.before(_this.$handleContainer);
            _this.$table.find('th .ui-pnl tr td').each(function (i, el) {
                var $handle;
                $handle = $("<div class='rc-handle' />");
                $handle.data('th', $(el));
                $handle.bind('mousedown', _this, function (e) {
                    var $currentGrip , $leftColumn  , leftColOldW; // _this = e.data;
                    e.preventDefault();
                    $currentGrip = $(e.currentTarget);
                    $leftColumn = $currentGrip.data('th');
                    leftColOldW = $leftColumn.width();
                    var target = $(e.target);
                    target.addClass("clicked");
                    target.data("startPos", target.position().left);
                    var startPosition = e.clientX;
                    var difference , leftColW, tblWidth, layoutWidth;
                    var table = $leftColumn.parents("table.lv-tb").eq(0);
                    var $row = $leftColumn.parents("table.lv-tb .lv-head .lv-layout");

                    var $body = $(".lv-tb .lv-body", _this.el);
                    var client_h1 = ($body[0].clientHeight || $body.height());
                    $(document).on('mousemove.rc', function (e) {
                        difference = e.clientX - startPosition;
                        target.css('left', target.data("startPos") + difference);
                        leftColW = leftColOldW + difference;
                        tblWidth = table.width() + difference;
                        layoutWidth =  $row.width() + difference;
                        if(leftColW < 10) {
                            leftColW = 10;
                            tblWidth += 10 - leftColW;
                        }
                    });
                    return $(document).one('mouseup', function (e) {
                        $(document).off('mousemove.rc');
                        //table.width(tblWidth);
                        var index = $leftColumn.attr("col");
                        $(".lv-layout tr td[col='" + index +"']", table).each( function(_index, el) {
                            $(el).css("width", leftColW);
                            $("div", el).width(leftColW);
                            $("div", el).children().eq(0).width(leftColW);
                            $(el).parents(".lv-layout").css("width", layoutWidth);
                        });
                       /* $(".lv-layout", table).each(function(_index, el) {
                            $(el).css("width", layoutWidth);
                        });*/

                        target.removeClass("clicked");
                        var client_h2 = ($body[0].clientHeight || $body.height());
                        if(client_h1 != client_h2) {
                            _this.addEmptyRow();
                        }
                        return _this.syncHandleWidths();
                    });
                });
                return $handle.appendTo(_this.$handleContainer);
            });
        }
    }
};


YIUI.Control.ListView = YIUI.extend(YIUI.Control, {

    handler: YIUI.ListViewHandler,
    
    behavior: YIUI.ListViewBehavior,
    
    $table: null,
    
    height: "100%",

    $handleContainer: null,

    //doubleClick: null,
    
    //columnInfo : null,
    //columnKeys : null,
    
    getFieldArray: function(form, fieldKey) {
    	var info = this.columnInfo;
    	var colKey = "";
    	for (var i = 0, len = info.length; i < len; i++) {
			var col = info[i];
			if(col.columnKey == fieldKey) {
				colKey = col.key;
				break;
			}
		}
    	
        var doc = form.getDocument(), OIDList = new Array(), dataTable;
        dataTable = doc.getByKey(this.getMetaObj().tableKey);
        var data = this.data, columnIfo = this.columnInfo; 
		for (var i = 0, len = data.length; i < len; i++) {
			if (!this.isActiveRowSelect(i))
				continue;
			OIDList.push(this.getValByKey(i, colKey));
		}
		
        return OIDList;
    },
    isActiveRowSelect: function(i) {
		if (this.hasSelectField) {
			var index = this.selectFieldIndex;
			return this.getValue(i, index);
		}
		return true;
    },
    
    onRender: function (ct) {
        this.base(ct);
       // if (this.data.isTableData) {
            //第1行为表头，其余为明细

        if (this.layoutView) {
            this.layoutViewInvoker = new YIUI.ListViewWithLayout(this);
            this.el.addClass('ui-lv ui-lv-withlayout');
        } else {
            this.el.addClass('ui-lv');
        }

		if($.browser.isIE) {
			this.el.attr("onselectstart", "return false");
		}
		var self = this;
		var rowCount = self.getMetaObj().pageRowCount;
		var type = self.getMetaObj().loadType;
    	self._pagination = self.el.pagination({
//			pageSize: self.getMetaObj().pageRowCount,
			pageSize: rowCount,
			//总记录数
	        totalNumber: self.totalRowCount,
	        showPages: true,
	        showPageDetail: self.showPageDetail || false,
	        showFirstButton: self.showFirstButton,
	        showLastButton: self.showLastButton,
	        pageNumber: self.pageNumber || 1,
	        pageIndicatorCount: self.pageIndicatorCount || 5
		});

        var _tbody = $('<tbody></tbody>');
        var _thead = $('<thead></thead>');
//        this.$table = $('<table class="lv-tb"></table>').append(_thead).append(_tbody).appendTo(self._pagination.content);
        
        var $div = $('<div class="lv-div"></div>').appendTo(self._pagination.content);
        this.$table = $('<table class="lv-tb"></table>').appendTo($div);
        var $tr_h = $('<tr class="head"></tr>').appendTo(this.$table);
        var $td_h = $('<td></td>').attr("colspan", this.columnInfo.length + 1).appendTo($tr_h);
        var $div_h = $('<div class="lv-head"></div>').appendTo($td_h);
        var $head = $('<table class="tbl-head"></table>').append(_thead).appendTo($div_h);

        var $tr_b = $('<tr class="body"></tr>').appendTo(this.$table);
        var $td_b = $('<td></td>').attr("colspan", this.columnInfo.length + 1).appendTo($tr_b);
        var $div_b = $('<div class="lv-body"></div>').appendTo($td_b);
        var $body = $('<table class="tbl-body"></table>').append(_tbody).appendTo($div_b);
        
        this.createColumnHead();
		
		//总行数大于data的长度
		if(this.totalRowCount <= this.getMetaObj().pageRowCount) {
			this._pagination.hidePagination();
			this._pagination.content.css("height", "100%");
		}
        this._createHandles();
        this.syncHandleWidths();
		this.addDataRow(this.data);
    },

    /**
     * 设置单元格显示样式。
     * @param style Object，参考style属性说明。
     */
    setColStyle: function (colEl, style) {
    	var cssStyle = {};
        style.backColor && (cssStyle['background-color'] = style.backColor);
        style.foreColor && (cssStyle['color'] = style.foreColor);
        if(style.vAlign > -1) {
        	cssStyle['vertical-align'] = YIUI.VAlignment.parse(style.vAlign);
        	cssStyle['line-height'] = "normal";
        }
        if(style.hAlign > -1) {
        	var hAlign = YIUI.HAlignment.parse(style.hAlign);
        	cssStyle['text-align'] = hAlign;
        	
        	var index = colEl.index();
        	var $th = $(".lv-head .tbl-head th", this.$table).eq(index);
        	if($th.css("text-align") != hAlign) $th.css("text-align", hAlign);
        }
        var font = style.font;
        if(font) {
        	font.name && (cssStyle['font-family'] = font.name);
        	font.size && (cssStyle['font-size'] = font.size);
        	font.bold && (cssStyle['font-weight'] = 'bold');
        	font.italic && (cssStyle['font-style'] = 'italic');
        }
        colEl.css(cssStyle);
        
    },

	addEmptyRow: function() {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.addEmptyRow();
            return;
        }
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
		var client_h = ($body[0].clientHeight || $body.height());
		var total_h = (client_h - body_h);
		var count = Math.ceil( total_h / tr_h);
		var last_h = total_h - (count - 1) * tr_h;
		if(count <= 0) return;
		for (var i = 0; i < count; i++) {
			var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
			var index = $tr.index() + 1;
			if(index % 2 == 0) {
				$tr.addClass("even");
			}
			$('<td></td>').addClass("seq").appendTo($tr);
			var $this = this;
    		$.each(this.columnInfo , function(i , column){
    			var $td = $('<td></td>');
    			if(column.visible) {
    				$tr.append($td);
    			} 
    			if(column.format) {
    				$this.setColStyle($td, column.format);
    			}
    		});
			$("<td class='space'></td>").appendTo($tr);
			if(i == count - 1) {
				$tr.addClass("last");
				$("td", $tr).height(last_h);
				var h = client_h - $tbl.height();
				if(h > 0 && h < tr_h) {
					$("td", $tr).height(last_h + h);
				}
			} else {
				$tr.outerHeight(tr_h);
			}
		}
		
	},
	
    onSetHeight : function(height) {
    	this.el.css("height", height);
    	var pagesH = $(".paginationjs-pages", this.el).is(":hidden") ? 0 : $(".paginationjs-pages", this.el).outerHeight();
    	var realHeight = height - pagesH;
    	this._pagination.content.css("height", realHeight);
    	var head_h = $(".lv-tb .head", this.el).outerHeight();
    	var body_h = realHeight - head_h;

    	var $head = $(".lv-tb .lv-head", this.el);
    	var $body = $(".lv-tb .lv-body", this.el);
    	$body.outerHeight(body_h - 2);
    	$(".lv-div", this.el).outerHeight(realHeight);
//    	$body.css("line-height", $body.height() + "px");
		$(".space", $head).css("width", "100%");
		
		this.addEmptyRow();

		this.syncHandleWidths();
	},
	
	onSetWidth: function(width) {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.onSetWidth(width);
            return;
        }
		this.el.css("width", width);
		this._pagination.content.css("width", width);
		var $ths = $("th", this.$table), 
			$tds = $("tr.first td", this.$table),
			$th, $td, $thWidth, _index;
		$("th.space", this.$table).css("width", "100%");
		var tblW = 0;
		for (var i = 0, len = this.columnInfo.length; i < len; i++) {
			$th = $("[colindex="+i+"]", this.$table);
			$td = $tds.eq($th.index());
			if(!this.columnInfo[i].visible) continue;
		    $thWidth = $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.el.width()));
			$th.css("width", $thWidth);
			$td.css("width", $th.width());
			$td.outerWidth($th.outerWidth());
		    $("label", $th).css("width", $th.width());
		    tblW += $thWidth;
		}
		
		this.syncHandleWidths();
	},
	
    createColumnHead: function(){
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.createColumnHead();
            return;
        }
    	var $thead = $(".tbl-head thead", this.$table);
    	var $tbody = $(".tbl-body tbody", this.$table);
    	if(this.columnInfo && this.columnInfo.length > 0 ){
			var $tr = $('<tr></tr>'),$th;
			var $tr_b = $('<tr class="first"></tr>'),$td;
			for( var i = 0 ; i < this.columnInfo.length ; i ++){
				var column = this.columnInfo[i];
				if(i == 0){
					$th = $('<th><label>序号</label></th>').addClass("seq");
					$("label", $th).css("width", "100%").css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
					$tr.append($th);

					$td = $('<td></td>').addClass("seq");
//					$td.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
					$td.css("height", "0px");
					$tr_b.append($td);
				}
			    $th = $('<th><label>' + column.caption + '</label></th>').attr("colIndex", i);
			    $th.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
			    $("label", $th).css("width", $th.width()).css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
			    
			    $td = $('<td></td>').attr("colIndex", i);
			    $td.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
			    $td.css("height", "0px");
			    
                switch(column.columnType){
                    case YIUI.CONTROLTYPE.TEXTEDITOR:
                    	$th.addClass("lv-h-txt");
                        break;
                    case YIUI.CONTROLTYPE.CHECKBOX:
                    	$th.addClass("lv-h-chk");
                        break;
                    case YIUI.CONTROLTYPE.BUTTON:
                    	$th.addClass("lv-h-btn");
                        break;
                    case YIUI.CONTROLTYPE.HYPERLINK:
                    	$th.addClass("lv-h-hlk");
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                    	$th.addClass("lv-h-dp");
                        break;
                }
			    
			    if(column.visible) {
			    	$tr.append($th);
			    	$tr_b.append($td);
			    }
				
			}
			$("<th class='space'></th>").appendTo($tr);
			$("<td class='space'></td>").css("height", "0px").appendTo($tr_b);
    	}
		$thead.append($tr);

		$tbody.append($tr_b);
    },
    
    setColumnCaption: function(columnKey, caption) {
    	var colIndex = this.findIndex(columnKey);
    	var $label = $("thead th[colIndex='"+colIndex+"'] label", this.$table);
    	$label.text(caption);
    },

    setColumnEnable: function(columnKey, enable) {
    	var colIndex = this.findIndex(columnKey);
    	var $th = $("thead th[colIndex='"+colIndex+"']", this.$table);
    	var $tdIndex = $th.index();
    	if($tdIndex > -1) {
    		for (var i = 0, len = this.data.length; i < len; i++) {
    			var $tr = $(".tbl-body tr", this.$table).eq(i);
    			var $td = $("td", $tr).eq($tdIndex);
    			var $el = $td.children();
    			this.setEnableByEl($el, enable);
			}
    	}
    },
    
    setEnableByEl: function($el, enable) {
    	if(enable) {
    		$($el, this.el).removeAttr("disabled");
    		$($el, this.el).removeClass("disabled");
    	} else {
    		$($el, this.el).attr("disabled", "disabled");
    		$($el, this.el).addClass("disabled");
    	}
    },
    
    setColumnVisible: function(columnKey, visible) {
    	var colIndex = this.findIndex(columnKey);
    	var $th = $("thead th[colIndex='"+colIndex+"']", this.$table);
    	visible ? $th.show() : $th.hide();
    	var $tdIndex = $th.index();
    	if($tdIndex > -1) {
            $(".tbl-body tr", this.$table).each(function () {
                var $td = $("td", $(this)).eq($tdIndex);
                visible ? $td.show() : $td.hide();
            });
    	}
    },
    
    calcRealValues: function(columnInfo, parentWidth) {
    	var realWidth = 0, columnWidth, width;
    	for (var i = 0, len = columnInfo.length; i < len; i++) {
    		columnWidth = $.isNumeric(columnInfo[i]) ? columnInfo[i] : columnInfo[i].width;
			if($.isNumeric(columnWidth) && columnWidth > 0) {
				realWidth += parseInt(columnWidth);
			}
		}
    	width = parentWidth - realWidth;
    	return width < 0 ? 10 : width;
    },
    
    addDataRow: function(data){
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.addDataRow(data);
            return;
        }
    	if(data && this.$table) {
        	var $tbody = $(".tbl-body tbody", this.$table);
        	$("tr.space", $tbody).remove();
        	if($("tr.data", $tbody).length == 0) {
        		$("label.empty", $tbody).remove();
        	}
        	var $tr , caption , $td;
        	var listView = this;
        	var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
        	$.each(data , function(i , row){
        	
        		$tr = $('<tr></tr>').addClass("data");
        		$td = $('<td></td>').addClass("seq");
        		if(!hasFirst && i == 0) {
        			$tr.addClass("first");
//        			$td.css("width", $.getReal(listView.columnInfo[0].width, listView.calcRealValues(listView.columnInfo, listView.el.width())));
        		}
        		var seq = $tbody.children().length+1;
        		if(seq % 2 == 0) {
        			$tr.addClass("even");
        		}
        		$tr.append($td.html($tbody.children().length));
        		
        		$.each(listView.columnInfo , function(i , column){
        			
        			//$td = $('<td>' + row[column.key] + '</td>');
        			
        			$td = $('<td></td>');
            		$td.css("width", $.getReal(column.width, listView.calcRealValues(listView.columnInfo, listView.el.width())));
        			var cell = row[column.key];
    				if(cell) {
    					if(cell.value == "") {
    						caption = "";
    					} else {
    						caption = cell.caption;
    					}
    				}
    				
                    switch(column.columnType){
                        case YIUI.CONTROLTYPE.TEXTEDITOR:
                        	caption=YIUI.TextFormat.format(caption, this);
                            $td.text(caption).addClass("lv-txt");
                            break;
                        case YIUI.CONTROLTYPE.CHECKBOX:
                            var $chkbox = $('<span class="chk"/>');
                            $chkbox.attr('isChecked', caption == '1' ? 'true' : 'false');
                            $chkbox.addClass(caption == '1' ? 'checked' : '');
                            $chkbox.attr("enable", column.enable);
                            $chkbox.data("key", column.key);
                            $td.append($chkbox).addClass("lv-chk");
                            listView.setEnableByEl($chkbox, column.enable);
                            column.el = $chkbox;
                            break;
                        case YIUI.CONTROLTYPE.BUTTON:
                            var $btn = $('<button></button>');
                            $btn.addClass("btn")
                            var $imginfo=$("<span class='imginfo' style='display: inline-block;height: 16px;width: 16px;vertical-align: middle;'></span>");
                            var $fontinfo=$("<span style='width:165px;font-weight: normal;overflow: hidden;max-width: 100%;text-overflow: ellipsis;vertical-align: middle;'>"+caption+"</span>");
                            $imginfo.css("background","url('Resource/"+this.icon+"')")
                            $btn.attr("enable", column.enable);
                            $btn.data("key", column.key);
                            $btn.append($imginfo);
                            $fontinfo.appendTo($btn);
                            $td.append($btn).addClass("lv-btn");
                            listView.setEnableByEl($btn, column.enable);
                            column.el = $btn;
                            break;
                        case YIUI.CONTROLTYPE.HYPERLINK:
                            var $hyperLink = $('<a>' + caption + '</a>');
                            $hyperLink.addClass("hlk");
                            var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
                            switch(column.targetType) {
                                case YIUI.Hyperlink_TargetType.Current:
                                    showTarget = YIUI.Hyperlink_TargetType.Str_Current;
                                case YIUI.Hyperlink_TargetType.NewTab:
                                    $hyperLink.attr("href", column.url);
                                    $hyperLink.attr("target", YIUI.Hyperlink_target[showTarget]);
                                break;
                                default:
                                    $hyperLink.data("url", column.url);
                                    $hyperLink.data("target", YIUI.Hyperlink_TargetType.New);
                                break;
                            }
                            $hyperLink.attr("enable", column.enable);
                            $hyperLink.data("key", column.key);
                            $td.append($hyperLink).addClass("lv-hlk");
                            listView.setEnableByEl($hyperLink, column.enable);
                            column.el = $hyperLink;
                            break;
                        case YIUI.CONTROLTYPE.DATEPICKER:
                            var onlyDate = column.isOnlyDate;
                            if(onlyDate){
                            	caption = caption.split(" ")[0];
                            }
                            $td.text(caption).addClass("lv-dp");
                            break;
                        default:
                            $td.html(caption);
                            break;
                    }
        			if(column.visible) {
        				$tr.append($td);
        			} 
        			if(column.format) {
        				listView.setColStyle($td, column.format);
        			}
        		});

    			$("<td class='space'></td>").appendTo($tr);
        		$tbody.append($tr);
        	});
    	}
    },
    
    clearDataRow: function() {
    	if(this.$table) {
        	var $tbody = $(".tbl-body tbody", this.$table);
        	$("tr", $tbody).not(".first").remove();
    	}
    },
    
    clearAllRows: function() {
    	this.data = [];
    	this.clearDataRow();
    },

    	// 处理差异
	diff: function(diffJson){
		var listView = this;
		listView.totalRowCount = diffJson.totalRowCount || listView.totalRowCount;
		if(diffJson.totalRowCount == undefined) {
			listView.totalRowCount = listView.totalRowCount;
		} else {
			listView.totalRowCount = diffJson.totalRowCount;
		}

		var h = $(".lv-div", this.el).height();
		h -= $(".lv-tb .head").outerHeight();
		
		var columnInfo = diffJson.columnInfo;
		if(listView.totalRowCount < listView.getMetaObj().pageRowCount) {
			if(!$(".paginationjs-pages", this.el).is(":hidden")) {
				listView._pagination.hidePagination();
			}
	    	
		} else if(listView.totalRowCount) {
			listView._pagination.setTotalRowCount(listView.totalRowCount, true);
			h -= $(".paginationjs-pages", this.el).height();
		}
    	var $body = $(".lv-tb .lv-body", this.el);
		var height_b = $body.outerHeight();
		
		$body.css("height", h + "px");
		
		if(diffJson.data) {
			listView.data = diffJson.data;
			listView.clearDataRow();
			listView.addDataRow(listView.data);
		} else if(columnInfo) {
			$("thead", listView.$table).empty();
			listView.clearDataRow();
			listView.columnInfo = columnInfo;
			listView.createColumnHead();
			listView._createHandles();
			listView.syncHandleWidths();
			listView.addDataRow(listView.data);
		}
    	this.addEmptyRow();
	},
	
	initDefaultValue: function(options) {
		this.$table = $("table", this.el);
		this._createHandles();
		this.syncHandleWidths();
		this.totalRowCount = options.totalrowcount;
		this.pageRowCount = options.pagerowcount;
		if(options.columnkey) {
			this.columnKey = options.columnkey;
		}
		if(options.tablekey) {
			this.tableKey = options.tablekey;
		}
		
		this._pagination = this.el.pagination({
			pageSize: this.pageRowCount,
			//总记录数
	        totalNumber: this.totalRowCount,
	        showPages: true,
	        pageIndicatorCount: 5
		});
		this.$table.appendTo(this._pagination.content);
		this._pagination.content.css("width", this.el.width());
		var $ths = $("th", this.$table), $th, $thWidth, _index, columnInfo = [], column;
		for (var i = 0, len = $ths.length; i < len; i++) {
			$th = $ths.eq(i);
			column = {};
			column.key = $th.attr("key");
		    column.enable = $th.attr("enable");
		    column.visible = $th.attr("visible");
		    column.columnType = $th.attr("columnType");
		    columnInfo.push(column);
		}
		this.columnInfo = columnInfo;
		var realHeight = this.el.height() - $(".paginationjs-pages", this.el).height();
    	this._pagination.content.css("height", realHeight);
	},
	
	reload: function() {
		var form = YIUI.FormStack.getForm(this.ofFormID);
		var showLV = YIUI.ShowListView(form, this);
		showLV.load(this);
	},
	
	repaint: function() {
		this.clearDataRow();
		this.addDataRow(this.data);
    	this.addEmptyRow();
	},
	
	needTip: function() {
		return false;
	},
	
    install: function () {
        var self = this;

        self._pagination.pageChanges = function(pageNum) {
        	self.handler.doGoToPage(self, pageNum);
        	self.addEmptyRow();
        }
        
        if(this.hasDblClick){
	        self.$table.delegate(".tbl-body tr.data", "dblclick", function(event) {
				if(!self.enable || $(this).attr("enable") == "false") return;
	        	//var colIndex = $(event.target).index();
	            //var rowIndex = $(event.target).parent().index();
	            var rowIndex = $(event.target).parents('tr.data').index() - 1;
	            self.handler.doOnRowDblClick(self, rowIndex);
	        });
        }
        
        self.$table.delegate(".tbl-body>tbody>tr", "click", function(event) {
        	if(!$(this).hasClass("data")) {
        		if(self._selectedRow) {
        			self._selectedRow.removeClass("clicked");
        			self._selectedRow = null;
        		}
        		return;
        	}
        	var rowChange = true;
        	var rowIndex = $(event.target).parents('tr.data').index() - 1;
        	var oldIndex;
        	if(self._selectedRow) {
        		oldIndex = self._selectedRow.index() - 1;
       
        		rowChange = (oldIndex != rowIndex);
        		self._selectedRow.removeClass("clicked");
        	}
        	
        	$(this).addClass("clicked");
        	self._selectedRow = $(this);
        	if(self.hasClick){
        		self.handler.doOnRowClick(self, rowIndex);
        	}
        	if(rowChange && self.hasRowChanged){
        		self.handler.doOnFocusRowChange(self,oldIndex, rowIndex);
        	}
        });

        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.install();
        } else {
            self.$table.delegate(".chk", "click", function(event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                if($(this).attr('isChecked') && $(this).attr('isChecked') == 'true'){
                    $(this).attr('isChecked', 'false');
                    $(this).removeClass("checked");
                }else{
                    $(this).attr('isChecked','true');
                    $(this).addClass("checked");
                }
                var index = $(event.target).parent('td').index();
                var colIndex = $("thead th", self.$table).eq(index).attr("colIndex");
                var rowIndex = $(event.target).parents('tr').index() - 1;
                var isChecked = $(this).attr('isChecked') == "true" ? true : false;
                self.handler.doCellValueChanged(self , rowIndex , colIndex , isChecked);
                event.stopPropagation();
            });
        
            self.$table.delegate(".btn", 'click',function(event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                var colKey = $(this).data("key");
                var rowIndex = $(event.target).parents('tr').index() - 1;
                self.handler.doOnCellClick(self , rowIndex , colKey);
                event.stopPropagation();
            });
        		
            self.$table.delegate(".hlk", 'click',function( event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                var _url = $(this).data("url");
                var _target = $(this).data("target");
                if(_url && _target == YIUI.Hyperlink_TargetType.New) {
                    window.open(_url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                } else if(!_url){
                    var rowIndex = $(event.target).parents('tr').index() - 1;
                    var colKey = $(this).data("key");
                    self.handler.doOnCellClick(self , rowIndex , colKey);
                    event.stopPropagation();
                }

            });
        }
        var $body = $(".lv-tb .lv-body", this.el);
        var $head = $(".lv-tb .lv-head", this.el);
        $body.scroll(function() {
			var left = $body.scrollLeft();
			$head.scrollLeft(left);
			if($body[0].clientWidth != $body[0].scrollWidth) {
				var scroll_w = $body.width() - $body[0].clientWidth;
				$(".space", $head).outerWidth(scroll_w);
			} 
			self.syncHandleWidths();
		})
    },
    
    _createHandles: function () {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker._createHandles();
            return;
        }

        var _this = this;
        this.$handleContainer = $("<div class='rc-handle-cntr'/>");
        this.$table.before(this.$handleContainer);
        this.$table.find('tr th').each(function (i, el) {
            var $handle;
            $handle = $("<div class='rc-handle' />");
            $handle.data('th', $(el));
            $handle.bind('mousedown', _this, function (e) {
                var $currentGrip , $leftColumn  , leftColOldW  , _this = e.data;
                e.preventDefault();
                $currentGrip = $(e.currentTarget);
                $leftColumn = $currentGrip.data('th');
                leftColOldW = $leftColumn.width();
                var target = $(e.target);
                target.addClass("clicked");
                target.data("startPos", target.position().left);
                var startPosition = e.clientX;
                var difference , leftColW, tblWidth;
                var table = $leftColumn.parents("table").eq(0);
                
            	var $body = $(".lv-tb .lv-body", _this.el);
        		var client_h1 = ($body[0].clientHeight || $body.height());
                $(document).on('mousemove.rc', function (e) {
                    difference = e.clientX - startPosition;
                    target.css('left', target.data("startPos") + difference);
                    leftColW = leftColOldW + difference;
                    tblWidth = table.width() + difference;
                    if(leftColW < 10) {
                    	leftColW = 10;
                    	tblWidth += 10 - leftColW;
                    }
                });
                return $(document).one('mouseup', function (e) {
                    $(document).off('mousemove.rc');
                    $leftColumn.outerWidth(leftColW);
                    $("label", $leftColumn).width($leftColumn.width());
                    var index = $leftColumn.index();
                    var $td_b = $(".lv-tb .lv-body tr.first td", _this.el).eq(index);
//                    $td_b.outerWidth(leftColW);
                    $td_b.css("width", $leftColumn.outerWidth());
//	                table.width(tblWidth);
                    target.removeClass("clicked");
            		var client_h2 = ($body[0].clientHeight || $body.height());
            		if(client_h1 != client_h2) {
            			_this.addEmptyRow();
            		}
                    return _this.syncHandleWidths();
                });
            });
            return $handle.appendTo(_this.$handleContainer);
        });
    },

    syncHandleWidths: function () {
        var _this = this;
        this.$handleContainer.width(this.$table.width());
        this.$handleContainer.find('.rc-handle').each(function (_, el) {
            return $(el).css({
                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - _this.$handleContainer.offset().left),
                height: _this.$table.height()
            });
        });
    },
    
    getFocusRowIndex: function() {
    	var index = -1;
    	if(this._selectedRow) {
    		index = this._selectedRow.index() - 1;
    	}
    	return index;
    },
    
    findIndex: function(colKey) {
    	var cols = this.columnInfo, index = -1;
    	for (var i = 0, len = cols.length; i < len; i++) {
			if(cols[i].key == colKey){
				index = i;
				break;
			}
		}
    	return index;
    },
    
    setValByKey: function(rowIndex, colKey, value, commit, fireEvent) {
    	var colIndex = this.findIndex(colKey);
    	this.setValByIndex(rowIndex, colIndex, value, commit, fireEvent);
    },
    
    setValByIndex: function(rowIndex, colIndex, value, commit, fireEvent) {
    	var $tdIndex = $(".tbl-head thead th[colIndex='"+colIndex+"']", this.$table).index();
    	if($tdIndex > -1) {
    		var $td = $(".tbl-body tbody tr.data", this.$table).eq(rowIndex).children('td').eq($tdIndex);
        	var column = this.columnInfo[colIndex];
        	switch(column.columnType){
    			case YIUI.CONTROLTYPE.CHECKBOX:
    				var $chk = $td.children();
    				var isChecked = $chk.attr('isChecked') == "true" ? true : false;
    				var chkVal = value == true ? true : false;
    				if(chkVal == isChecked) break;
    				if(value) {
    					$chk.attr('isChecked', 'false');
    					$chk.removeClass("checked");
    				} else {
    					$chk.attr('isChecked','true');
    					$chk.addClass("checked");
    				}
    				break;
    			case YIUI.CONTROLTYPE.BUTTON:
    				$td.children("button").html(value);
    				break;
    			case YIUI.CONTROLTYPE.HYPERLINK:
    				$td.children("a").html(value);
    				break;
    			default:
    				$td.html(value);
        	}
        	if(column.valueChanged) {
        		var form = YIUI.FormStack.getForm(this.ofFormID);
        		form.eval(column.valueChanged, {form: form}, null);
        	}
    	}
    	
    },
    
	getValue: function(rowIndex , colIndex) {
		var dbKey = this.columnInfo[colIndex].key;
		return this.getValByKey(rowIndex, dbKey);
	},
	
    getValByKey: function(rowIndex, colKey) {
    	return this.data[rowIndex][colKey].value;
    },
    
    getRowCount: function(){
    	return this.data.length;
    },
    
    deleteRow: function(rowIndex){
        this.data.splice(rowIndex, 1);
    	var $tbody = $(".tbl-body tbody", this.$table);
    	$("tr.data", $tbody).eq(rowIndex).remove();
    	var len = this.data.length;
    	for (var i = rowIndex; i < len + 1; i++) {
    		var $tr = $("tr.data", $tbody).eq(i);
    		var index = i + 1;
    		var $td = $(".seq", $tr).html(index);
    		if(index % 2 == 0) {
    			$tr.addClass("even");
    		} else {
    			$tr.removeClass("even");
    		}
		}
    	$("tr.space", $tbody).remove();
    	this.addEmptyRow();
    },
    addNewRow: function(row){
    	this.data.push(row);
    	var newRow = [];
    	newRow.push(row);
    	this.addDataRow(newRow);
    	this.addEmptyRow();
    }

});
YIUI.reg('listview', YIUI.Control.ListView);
