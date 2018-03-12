"use strict";
(function() {
	RTS = RTS || {};
	RTS.Treetable = function(el, options) {
		var type = options.type;
		var defStatus = false;
		var resetItems = function(rows, pId) {
			var len = rows.length;
			if(len > 0){
				for(var i=0,len=rows.length;i<len;i++) {
					if(pId) {
						rows[i].pid = pId;
					}
					rows[i].previd = rows[i].previd;
					rows[i].id = rows[i].OID || rows[i].oid || rows[i].key;
					var r_id = rows[i].id;
					if(parent.$.isString(r_id)) {
						r_id = r_id.replace(/\//g, "_");
						rows[i].id = r_id;
					}
				    if(rows[i].items && rows[i].items.length > 0) {
				    	rows[i].hasChild = true;
				    	resetItems(rows[i].items, rows[i].id);
				    } else if(rows[i].nodeType == 1) {
				    	rows[i].hasChild = true;
				    }
				    if(!rows[i].caption) {
					    rows[i].caption = rows[i].key;
				    }
				}
			}
		}
		var createRowsHtml = function($table, data, pId) {
			var rows = data.rows, 
				cols = data.cols;
			resetItems(rows, pId);
			return createRows(rows, cols, $table);
		}
		var createRows = function(rows, cols, $table) {
			var html = '';
			var len = rows.length;
			if(len > 0) {
				for(var i=0;i < len;i++) {
					var tr = createRow($table, rows[i], cols);
					html += tr[0].outerHTML;

					var items = rows[i].items;
					var child = "";
					if(items && items.length > 0) {
						html += createRows(items, cols, $table);
					} 
				}
			//} else  {
			//	var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
			//	$table.after(label);
			}
			
			return html;
		}
		var createRow = function($table, rowdata, colModel) {
			var tr = $('<tr id="'+rowdata.id+'"></tr>').attr("oid", rowdata.OID).attr("key", rowdata.key);
			if(rowdata.formKey) {
				tr.attr("formKey", rowdata.formKey);
				tr.attr("formCaption", rowdata.formCaption);
			}
			if(rowdata.rightsRelation) {
				tr.attr("rightsRelation", rowdata.rightsRelation);
				tr.attr("relationCaption", rowdata.relationCaption);
			}
			if(type == RTS.Rights_type.TYPE_DICT) {
				if(rowdata.hasRights && !rowdata.changed) {
					options.dictRts.push(rowdata.id);
					var hasRts = rowdata.hasRights == 0 ? false : true;
					tr.attr('hasRts', hasRts);
				}
			} else if(options.isFFData) {
				if(defStatus || !rowdata.visible) {
					options.visibleRts.push(rowdata.key);
				}
				if(defStatus || !rowdata.enable) {
					options.enableRts.push(rowdata.key);
				}
			} else if(options.isFOData) {
				if(rowdata.hasRights) {
					options.optRts.push(rowdata.key);
				}
			}
			
			if(rowdata.pid != undefined ) {
				tr.attr('pId', rowdata.pid);
			}
			
			if(rowdata.previd != undefined ) {
				tr.attr('previd', rowdata.previd);
			}
				
			if(rowdata.hasChild){
				tr.attr('hasChild', true);
			}
			if(rowdata.secondaryType) {
				tr.attr("secondaryType", rowdata.secondaryType);
			}
			var value, hasRow = false;
			for (var j=0,len=colModel.length;j<len;j++) {
				var col = colModel[j];
				value = rowdata[col.key];
				if(col.type == "checkbox") {
					var cb;
					if(col.isEntry) {
						cb = $("<span class='checkbox state0' chkstate='0'/>");
					} else {
						cb = $("<input type='checkbox' value="+value+" class='checkbox' />");
						if(!RTS.options.modify) {
							cb.attr("disabled", "disabled");
						}

						if(value || (type == RTS.Rights_type.TYPE_DICT && RTS.options.dict.allRights)) {
							cb.attr("checked", true);
						} else if(value == undefined) {
							cb.addClass("ignore");
						}
						
						if(type == RTS.Rights_type.TYPE_FORM) {
							var index = colModel[j].index;
							if((index == 0 && defStatus) || (index == 1 && defStatus)) {
								cb.attr("checked", false);
							}
						}
						
					}
					
					if(col.key == "enable" && rowdata.disable) {
						cb.attr("enable", "false");
					}
					if(col.index) {
						cb.attr("index", col.index);
					}
					$('<td></td>').append(cb).appendTo(tr);
					if(col.showText) {
						cb.after(value);
					}
				} else {
					$('<td><span>' + value + '</span></td>').appendTo(tr);
				}
			}
			return tr;
		}
		var createTable = function(el, option, result) {
			if(result.length == 0 || !el) return null;
			el.empty();
			var colModel = result.cols;
			var $table = $('<table cellpadding="0" cellspacing="0"></table>').appendTo(el);
			$table.attr("enable", true);
			var thead = $("<thead></thead>").appendTo($table);
			$("<tbody></tbody>").appendTo($table);
			var tr = $('<tr ></tr>').appendTo(thead),
				col, i, len, width;
			tr.addClass("title");
			for (i=0,len=colModel.length;i<colModel.length;i++) {
				col = colModel[i];
				if(col.type == "checkbox" && !col.hide) {
					var cb = $("<input type='checkbox' class='checkbox all'/>");
					if(!RTS.options.modify) {
						cb.attr("disabled", "disabled");
					}
					if(colModel[i].index) {
						cb.attr("index", col.index);
					}
					$('<th>'+col.caption+'</th>').prepend(cb).appendTo(tr);
				} else {
					$('<th>' + col.caption + '</th>').appendTo(tr);
				}
			}
			
			defStatus = result.defStatus;
			
			var html = createRowsHtml($table, result);
			$("tbody", $table).append(html);
			
			if($("tbody tr", $table).length > 0) {
				$table.next("label.empty").remove();
			} else  {
				var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
				$table.after(label);
			}
			
			option = $.extend({
				expandable: true,
				indent: 10,
				firstIndent: 20
			}, option);
			$table = $table.treetable(option);
			
			var chks = $("thead tr.title .checkbox", $table), childs;
			var $trs = $("tr:not([class~='title'])", $table);
			for (var i = 0, len = chks.length; i < len; i++) {
				switch(type) {
					case RTS.Rights_type.TYPE_DICT:
						if(result.hasAllRights || RTS.options.dict.allRights) {
							chks.eq(i).prop("checked", true);
						}
						break;
					case RTS.Rights_type.TYPE_ENTRY:
					case RTS.Rights_type.TYPE_FORM:
						if((result.allOptRights) || (i == 0 && result.allVisibleRights) || (i == 1 && result.allEnableRights)) {
							chks.eq(i).prop("checked", true);
						}
						if((i == 0 && result.defStatus) || (i == 1 && result.defStatus)) {
							chks.eq(i).prop("checked", false);
						}
						break;
				}
				
				
			}
			return $table;
		}
        var addEmptyRow = function($table, el) {
            var $body = el;
            var $tbody = $("tbody", $table);
            $("tr.space", $tbody).remove();
            var tr_h = $("tr", $tbody).first().outerHeight();
            var body_h = $tbody.outerHeight();
            if(!body_h) {
                var len = $("tr", $tbody).length;
                body_h = 0;
                for (var i = 0; i < len; i++) {
                    body_h +=  $("tr", $tbody).eq(i).outerHeight();
                }
            }
            var client_h = ($body[0].clientHeight || $body.height());
            var total_h = (client_h - body_h - $("thead", $table).outerHeight());
            var count = Math.ceil( total_h / 30);
            var last_h = total_h - (count - 1) * 30;
            if(count <= 0) return;
            for (var i = 0; i < count; i++) {
                var $tr = $("<tr></tr>").addClass("space").appendTo($tbody);
                var index = $tr.index() + 1;
                if(index % 2 == 0) {
                    $tr.addClass("even");
                }

                var size = $("thead tr th", $table).length;
                for (var m = 0; m < size; m++) {
                	 var $td = $('<td></td>');
                     $tr.append($td);
				}

                if(i == count - 1) {
                    $tr.addClass("last");
                    $("td", $tr).height(last_h);
                    var h = client_h - $tbody.height();
                    if(h > 0 && h < tr_h) {
                        $("td", $tr).height(last_h + h);
                    }
                } else {
                    $tr.outerHeight(30);
                }
            }
        };
		var rt = {
				_table: null,
				create: function(option, result) {
					this._table = createTable(el, option, result);
					return this._table;
				},
				createRowsHtml: function($table, data, pId) {
					return createRowsHtml($table, data, pId);
				},
				addEmptyRow: function() {
					var tbl = this._table;
					addEmptyRow(tbl, tbl.parent());
				},
				removeAll: function() {
					if(this._table) {
						this._table.removeAll();
						if(this._table.next("label.empty").length == 0) {
							var label = $("<label class='empty'>"+RTS.I18N.attachment.noContent+"</label>");
							this._table.after(label);
						}
					}
				}
				
		};
		return rt;
	};
})();