(function ($) {
	YIUI.CUSTOM_ROLERIGHTS = function(options) {
		var defaul = {
			height: "100%",
			width: "100%",
			maxRows: 50,
			pageIndicatorCount: 3
		}
		options = $.extend(defaul, options);
		
		var resetItems = function(rows, pId) {
			var len = rows.length;
			if(len > 0){
				for(var i=0,len=rows.length;i<len;i++) {
					if(pId) {
						rows[i].pid = pId;
					}
					rows[i].previd = rows[i].previd;
					rows[i].id = rows[i].OID || rows[i].oid || rows[i].key.trim();
					var r_id = rows[i].id;
					if($.isString(r_id)) {
						r_id = r_id.replace(/\//g, "_");
						rows[i].id = r_id;
					}
				    if(rows[i].items && rows[i].items.length > 0) {
				    	rows[i].hasChild = true;
				    	resetItems(rows[i].items, rows[i].id);
				    } else if(rows[i].nodeType == 1) {
				    	rows[i].hasChild = true;
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
				$table.next("label.empty").remove();
				for(var i=0;i < len;i++) {
					var tr = createRow($table, rows[i], cols);
					html += tr[0].outerHTML;

					var items = rows[i].items;
					var child = "";
					if(items && items.length > 0) {
						html += createRows(items, cols, $table);
					} 
				}
			} else  {
				var label = $("<label class='empty'>表中无内容</label>");
				$table.after(label);
			}
			
			return html;
		}
		var createRow = function($table, rowdata, colModel) {
			var tr = $('<tr id="'+rowdata.id+'"></tr>').attr("oid", rowdata.OID).attr("key", rowdata.key);
			if(options.type == YIUI.Rights_type.TYPE_DICT) {
				if(rowdata.hasRights && !rowdata.changed) {
					options.dictRts.push(rowdata.id);
					var hasRts = rowdata.hasRights == 0 ? false : true;
					tr.attr('hasRts', hasRts);
				}
			} else if(options.isFFData) {
				if(!rowdata.visible) {
					options.visibleRts.push(rowdata.key);
				}
				if(!rowdata.enable) {
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
				value = rowdata[colModel[j].key];
				if(colModel[j].type == "checkbox") {
					var cb;
					if(colModel[j].isEntry) {
						cb = $("<span class='checkbox state0' chkstate='0'/>");
					} else {
						cb = $("<input type='checkbox' value="+value+" class='checkbox' />").attr("disabled", "disabled");
						if(value) {
							cb.attr("checked", true);
						} else if(value == undefined) {
							cb.addClass("ignore");
						}
					}
					
					if(colModel[j].key == "enable" && rowdata.disable) {
						cb.attr("enable", "false");
					}
					if(colModel[j].index) {
						cb.attr("index", colModel[j].index);
					}
					$('<td></td>').append(cb).appendTo(tr);
					if(colModel[j].showText) {
						cb.after(value);
					}
				} else {
					$('<td><span>' + value + '</span></td>').appendTo(tr);
				}
			}
			return tr;
		}
		var createTable = function(el, option, result) {
			if(result.length == 0) return null;
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
					var cb = $("<input type='checkbox' class='checkbox all' disabled='disabled'/>");
					if(colModel[i].index) {
						cb.attr("index", col.index);
					}
					$('<th>'+col.caption+'</th>').prepend(cb).appendTo(tr);
				} else {
					$('<th>' + col.caption + '</th>').appendTo(tr);
				}
			}

			var html = createRowsHtml($table, result);
			$("tbody", $table).append($(html));
			option = $.extend({
				expandable: true
			}, option);
			$table = $table.treetable(option);
			
			var chks = $("thead tr.title .checkbox", $table), childs;
			var $trs = $("tr:not([class~='title'])", $table);
			for (var i = 0, len = chks.length; i < len; i++) {
				var type = options.type;
				switch(type) {
					case YIUI.Rights_type.TYPE_DICT:
						if(result.hasAllRights) {
							chks.eq(i).prop("checked", true);
						}
						break;
					case YIUI.Rights_type.TYPE_FORM:
						if((result.allOptRights) || (i == 0 && result.allVisibleRights) || (i == 1 && result.allEnableRights)) {
							chks.eq(i).prop("checked", true);
						}
						break;
				}
				
				
			}
			return $table;
		}

		var loadRights = function(paras) {
			var data = {};
			data.service = "SetRightsService";
			data = $.extend(data, paras);
			var result = null;
			var success = function(syncNodes) {
				if (syncNodes) {
					if(syncNodes.length > 0) {
						result = {
							rows: syncNodes,
							cols: [{
								key: "Code",
								caption: "代码"
							}, {
								key: "Name",
								caption: "名称"
							}]
						}
					} else {
						result = syncNodes;
					}
				}
			};
			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		}
		
		var el = options.el || $("<div/>")
		var roleRts = el.addClass("roleRights");
		roleRts.css({
			height: '100%',
			width: '100%'
		})
		var secTxt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var left_view = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var grid = new YIUI.Panel.GridLayoutPanel({
			widths : ["99%", 50],
			minWidths : ["-1", "-1"],
    		heights : [25],
    		height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [secTxt, sec]
		});
		var left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [grid, left_view]
		});
		var right = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%"
		});
		var split = new YIUI.Panel.SplitPanel({
			height: options.height || "100%",
			width: options.width || "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'25%'}, {size:'75%'}],
			items: [left, right]
		});
		split.el = roleRts;
		split.render();
		
		var isClick = function($tr, $table) {
			var flag = false;
			if($tr.hasClass("title")) {
				flag = true;
			}
			var $selTr = $("tr.sel", $table);
			if($selTr.length > 0) {
				if($selTr.attr("id") == $tr.attr("id")) {
					flag = true;
				}
				$selTr.removeClass("sel");
				$tr.addClass("sel");
			} else {
				$tr.addClass("sel");
			}
			return flag;
		};

		var addPtrs = function(key, $ptrs, $table) {
			var tree = $table.treeNode.tree;
			var node = tree[key];
			var pId = node.parentId;
			if(pId) {
				var index = 0;
				for (var i = 0, len = $ptrs.length; i < len; i++) {
					if($ptrs[i] == pId) {
						index = i;
					}
				}
				if(index > 0) {
					$ptrs.splice(index, 0, key);
				} else {
					$ptrs.push(key);
				}
			} else {
				$ptrs.push(key);
			}
		};
		
		var l_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					var flag = isClick($tr, $table);
					if(flag) return;
					modify.setEnable(true);
					tabPanel.setEnable(true);

					options.id = $tr.attr("id");

					$dr_tbl && $dr_tbl.removeAll();
					$ff_tbl && $ff_tbl.removeAll();
					$fo_tbl && $fo_tbl.removeAll();
					
					var paras = {
						cmd: "LoadEntryRightsData",
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					}
					var data = loadRights(paras);

					$(".checkbox").removeClass("state0").removeClass("state1").removeClass("state2").addClass("state0");
					$(".checkbox").attr("chkstate", 0);
					
					$table.allRights = data.allRights;
					if(data.allRights) {
						$(".checkbox", $e_tbl).removeClass("state0").addClass("state1");
						$(".title .checkbox", $e_tbl).prop("checked", true);
						var trs = $("tbody tr", $e_tbl);
						if(!$e_tbl.entryKeys) $e_tbl.entryKeys = [];
						for (var i = 0, len = trs.length; i < len; i++) {
							var key = trs.eq(i).attr("key");
							$e_tbl.entryKeys.push(key);
						}
						
					} else {
						$(".title .checkbox", $e_tbl).prop("checked", false);
						var entryKeys = data.entryKeys, entryKey;
						$e_tbl.entryKeys = entryKeys;
						
						var $ptrs = [];
						for (var i = 0, len = entryKeys.length; i < len; i++) {
							entryKey = entryKeys[i];
							var id = entryKey.replace(/\//g, "_");
							var tr = $("[id='"+id+"']", $e_tbl);
							var $chk = $(".checkbox", tr);
							var state = 1;
							$chk.removeClass("state0");
							if(tr.attr("hasChild") == "true") {
								addPtrs(id, $ptrs, $e_tbl);
							} else {
								$chk.addClass("state1");
								$chk.attr("chkstate", 1);
							}
						}
						
						for (var i = 0, len = $ptrs.length; i < len; i++) {
							var pId = $ptrs[i];
							var $ptr = $("[id='"+$ptrs[i]+"']", $e_tbl);
							var hasState0 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state0");
							var hasState1 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state1");
							var hasState2 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state2");
							if(hasState0 && !hasState1 && !hasState2) {
								continue;
							} else if (hasState1 && !hasState0 && !hasState2) {
								$(".checkbox", $ptr).addClass("state1");
								$(".checkbox", $ptr).attr("chkstate", 1);
							} else {
								$(".checkbox", $ptr).addClass("state2");
								$(".checkbox", $ptr).attr("chkstate", 2);
							}
						}
					}

					if(options.clickTr && (options.clickTr.parents(".ui-pnl:eq(0)").attr("id") != $tr.parents(".ui-pnl:eq(0)").attr("id"))) {
						options.clickTr.removeClass("sel");
						options.clickTr.click();
					} else {
						options.clickTr = $tr;
					}
				}
				
			}
		};

		var $l_tbl;

		var right_ch = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%"
		});
		var modify = new YIUI.Control.Button({
			value: "修改",
			metaObj: {
				x: 0,
				y: 0
			},
			listeners: null
		});
		var save = new YIUI.Control.Button({
			value: "保存",
			metaObj: {
				enable: false,
				x: 1,
				y: 0
			},
			listeners: null
		});
		var cancel = new YIUI.Control.Button({
			value: "取消",
			metaObj: {
				enable: false,
				x: 2,
				y: 0
			},
			listeners: null
		});
		
		var tools = new YIUI.Panel.GridLayoutPanel({
			widths: [50, 50, 50, "100%"],
			minWidths: ["-1", "-1", "-1", "-1"],
			heights: [25, 5],
			metaObj: {
				columnGap: 3
			},
    		height: 30,
			items: [modify, save, cancel]
		}); 
		
		var e_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			},
			height: "100%",
			width: "100%"
		});
		
		var eItem = new YIUI.Panel({
			height: "100%",
			metaObj: {
				title: '入口权限设置'
			},
			items: [e_flow]
		});
		
		var d_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var d_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var d_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25, 5],
			height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [d_txt, d_sec]
		}); 
		var d_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var dr_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var dr_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var dr_grid = new YIUI.Panel.GridLayoutPanel({
			key: "test",
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25, 5],
			height: 30,
			metaObj: {
				columnGap: 3,
				visible: false
			},
			items: [dr_txt, dr_sec]
		}); 
		var dr_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var d_left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [d_grid, d_flow]
		});
		var dr = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [dr_grid, dr_flow]
		});
		var d_spl = new YIUI.Panel.SplitPanel({
			height: "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'30%'}, {size:'70%'}],
			items: [d_left, dr]
		});
		
		var dItem = new YIUI.Panel({
			height: "100%",
			metaObj: {
				title: '字典权限设置'
			},
			items: [d_spl]
		});
		
		var fItem_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var f_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var f_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25],
			metaObj: {
				columnGap: 3
			},
    		height: 30,
			items: [fItem_txt, f_sec]
		}); 
		var f_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var f_left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [f_grid, f_flow]
		});
		
		var fr_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var fr_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var fr_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25],
    		height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [fr_txt, fr_sec]
		}); 
		var fr_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});

		var ff_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		
		var ff = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				visible: false
			},
			items: [ff_flow]
		});
		var fo_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var fo = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				visible: false
			},
			items: [fo_flow]
		});
		
		var f_right = new YIUI.Panel.SplitPanel({
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'40%'}, {size:'60%'}],
			items: [fo, ff]
		});
		
		var f_spl = new YIUI.Panel.SplitPanel({
			height: "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'30%'}, {size:'70%'}],
			items: [f_left, f_right]
		});
		
		var fItem = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				title: '表单权限设置'
			},
			items: [f_spl]
		});
		var tabPanel = new YIUI.Panel.TabPanel({
			height: "100%",
			items: [eItem, dItem, fItem]
		});
		
		right_ch.add(tools);
		right_ch.add(tabPanel);
		
		right.add(right_ch);
		right.doRenderChildren(false, true);
		
		var e_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					options.type = YIUI.Rights_type.TYPE_ENTRY;
					if($tr.hasClass("title")) {
						var allRights = $(".checkbox", $tr).is(":checked");
						$table.allRights = allRights;
						if(allRights) {
							$(".checkbox", $table).removeClass("state2").removeClass("state0").addClass("state1");
							
							var trs = $("tbody tr", $table);
							if(!$table.entryKeys) $table.entryKeys = [];
							for (var i = 0, len = trs.length; i < len; i++) {
								var key = trs.eq(i).attr("key");
								$table.entryKeys.push(key);
							}
						} else {
							$(".checkbox", $table).removeClass("state1").addClass("state0");
							$e_tbl.entryKeys = [];
						}
						return;
					}
					if(!$($table.target).hasClass("checkbox")) {
						return;
					}
					var id = $tr.attr("id");
					var isCheck = $(".checkbox", $tr).is(":checked");
					
					var state = $(".checkbox", $tr).attr('chkstate') == 0 ? 1 : 0;
					$(".checkbox", $tr).attr('chkstate', state);
					if(state > 0) {
						$(".checkbox", $tr).removeClass("state0").removeClass("state2").addClass("state1");
					} else {
						$(".checkbox", $tr).removeClass("state1").removeClass("state2").addClass("state0");
					}
					
					setRts(id, state, $table);
					checkCtr($table, id, state);
					checkPtr($table, id, state);
					
				}
			}
		};
		
		var setEntryRts = function(id, state, $table) {
			var type = options.type, $table;
			$table = $e_tbl;
			
			if((state == 0) && $table.allRights) {
				$table.allRights = false;
			}
			//是否有所有权限
			if(!$table.entryKeys)  $table.entryKeys= [];
			var entryKeys = $table.entryKeys;
			
			if(state > 0) {
				var key = $("#"+id, $table).attr("key");
				entryKeys.push(key);
			} else {
				$(".title .checkbox", $table).prop("checked", false);
				if($("[id='"+id+"'] .checkbox", $table).attr("chkstate") == 2) return;
				for (var i = 0, len = entryKeys.length; i < len; i++) {
					if(entryKeys[i].replace(/\//g, "_") == id) {
						entryKeys.splice(i, 1);
						break;
					}
				}
			}
			
		};

		var setDictRts = function(id, isCheck, $table) {
			var node = $table.treeNode.tree[id];
			var hasRts = node.row.attr('hasRts') == undefined ? false : true;
			if(isCheck != hasRts && !node.changed) {
				node.changed = true;
			}

			var isChain = options.clickTr.attr("secondaryType") == 5;
			if(!isChain) return;
			
			var addRts = options.dict.addRts;
			var delRts = options.dict.delRts;
			var dictRts = $table.dictRts;
			var isAdd = true;
			for (var i = 0, len = dictRts.length; i < len; i++) {
				if(dictRts[i] == id) {
					isAdd = false;
					break;
				}
			}
			if(isCheck) {
				//选中
				if(isAdd) {
					addRts.push(id);
				} else {
					for (var i = 0, len = delRts.length; i < len; i++) {
						if(delRts[i] == id) {
							delRts.splice(i, 1);
							break;
						}
					}
				}
			} else {
				//取消
				if(isAdd) {
					for (var i = 0, len = addRts.length; i < len; i++) {
						if(addRts[i] == id) {
							addRts.splice(i, 1);
							break;
						}
					}
				} else {
					delRts.push(id);
				}

			}
		};
		
		var setFormRts = function(id, isCheck, $table, chkData) {
			if(chkData) {
				var enable = chkData.enable;
				var visible = chkData.visible;
				var enableExist = false;
				var visibleExist = false;
				for (var i = 0, len = $table.enableRts.length; i < len; i++) {
					if($table.enableRts[i] == chkData.id) {
						enableExist = true;
						if(enable) {
							$table.enableRts.splice(i, 1);
						}
						break;
					}
				}
				if(!enableExist && !enable) {
					$table.enableRts.push(chkData.id);
					$table.hasAllEnableRights = false;
				}
				for (var i = 0, len = $table.visibleRts.length; i < len; i++) {
					if($table.visibleRts[i] == chkData.id) {
						visibleExist = true;
						if(visible) {
							$table.visibleRts.splice(i, 1);
						}
						break;
					}
				}
				if(!visibleExist && !visible) {
					$table.visibleRts.push(chkData.id);
					$table.hasAllVisibleRights = false;
				}
			} else {
				var optExist = false;
				for (var i = 0, len = $table.optRts.length; i < len; i++) {
					if($table.optRts[i] == id) {
						optExist = true;
						if(!isCheck) {
							$table.optRts.splice(i, 1);
						}
					}
				}
				if(!optExist && isCheck) {
					$table.optRts.push(id);
					$table.hasAllOptRights = false;
				}
			}
			

		};
		
		var setRts = function(id, isCheck, $table, chkData) {
			var type = options.type, $table;
			switch(type) {
				case YIUI.Rights_type.TYPE_ENTRY:
					setEntryRts(id, isCheck, $table);
					break;
				case YIUI.Rights_type.TYPE_DICT:
					setDictRts(id, isCheck, $table, chkData);
					break;
				case YIUI.Rights_type.TYPE_FORM:
					setFormRts(id, isCheck, $table, chkData);
					break;
			}
		}
		
		var checkCtr = function($table, id, isCheck, index) {
			if(!id) return;
			var node = $table.treeNode.tree[id], pNode, $chk, tr;
			var children = node.children, child;
			if(!children || children.length == 0) return;
			for (var i = 0, len = children.length; i < len; i++) {
				child = children[i];
//				var $ctr = child.row;
				var $ctr = $("[id='"+child.id+"']", $table);
				$chk = $(".checkbox:not([index])", $ctr);
				if(options.isField) {
					if(index > 0) {
						$chk = $(".checkbox[index='"+index+"']", $ctr);
					}
					tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!isCheck) {
							$(".checkbox", tr).eq(1).prop("checked", false);
							chkData.enable = false;
						}
						chkData.visible = isCheck;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(isCheck) {
							$(".checkbox", tr).eq(0).prop("checked", true);
							chkData.visible = true;
						}
						chkData.enable = isCheck;
					}
					if(index == 0) {
						chkData.visible = isCheck;
					} else if(index == 1) {
						chkData.enable = isCheck;
					}
					setRts(tr.attr("id"), isCheck, $table, chkData);
				} else {
					if($chk.attr("chkstate") > -1) {
						if($chk.attr("chkstate") != isCheck) {
							$chk.removeClass("state0").removeClass("state1").removeClass("state2")
							.addClass("state" + isCheck).attr("chkstate", isCheck);
						}
					}
					setRts(child.id, isCheck, $table);
				}
				if(!$chk.attr("chkstate")) {
//					if($chk.attr("chkstate") != isCheck) {
//						$chk.removeClass("state0").removeClass("state1").removeClass("state2")
//						.addClass("state" + isCheck).attr("chkstate", isCheck);
//					}
//				} else {
					$chk.prop("checked", isCheck);
				}
				checkCtr($table, child.id, isCheck);
			}
		};
		var checkPtr = function($table, id, isCheck, index) {
			var node = $table.treeNode.tree[id], $chk;
			if(node) {
				var pId = node.parentId;
				if(!pId) return;
				var pNode = $table.treeNode.tree[pId];
				
//				var $pr = $table.treeNode.tree[pId].row;
				var $pr = $("[id='"+pId+"']", $table);
				$chk = $(".checkbox:not([index])", $pr);
//				if(isCheck && $chk.is(":checked") != isCheck) {
				if(/*isCheck && */$chk.attr("chkstate") != isCheck) {
//					$chk.prop("checked", true);
					//半勾状态
					var $ctrs = $("[pid='"+pId+"']", roleRts);
					if($(".checkbox", $ctrs).hasClass("state0") || $(".checkbox", $ctrs).hasClass("state2")) {
						if(!$(".checkbox", $ctrs).hasClass("state1") && !$(".checkbox", $ctrs).hasClass("state2")) {
							$chk.removeClass("state1").removeClass("state2").addClass("state0").attr("chkstate", 0);
						} else {
							$chk.removeClass("state0").removeClass("state1").addClass("state2").attr("chkstate", 2);
						}
					} else if(!$(".checkbox", $ctrs).hasClass("state2")) {
						$chk.removeClass("state2").addClass("state1").attr("chkstate", 1);
					}
				}
				if(options.isField) {
					if(index > 0) {
						$chk = $(".checkbox[index='"+index+"']", $pr);
					}
					var tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!isCheck) {
//							$(".checkbox", tr).eq(1).prop("checked", false);
						}
//						chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
//						chkData.visible = isCheck;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(isCheck) {
							$(".checkbox", tr).eq(0).prop("checked", true);
							chkData.visible = true;
						}
//						chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
//						chkData.enable = isCheck;
					}
					if(isCheck) {
						$(".checkbox", tr).eq(index).prop("checked", true);
					}
					chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
					setRts(tr.attr("id"), isCheck, $table, chkData);
				} else {
					if($.isNumeric(isCheck) && $chk.attr("chkstate") != isCheck) {
						setRts(pId, isCheck, $table);
					} else if(isCheck && $chk.prop("checked") != isCheck) {
						$chk.prop("checked", true);
						setRts(pId, isCheck, $table);
					}
				}
				checkPtr($table, pId, isCheck)
			}
		}
		var $e_tbl = null;

		var d_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!options.id) return;
					var flag = isClick($tr, $table);
					if(flag) return;
					options.clickTr = $tr;
					
					$dr_tbl && $dr_tbl.removeAll();
					options.type = YIUI.Rights_type.TYPE_DICT;
					options.itemKey = $tr.attr("id");
					
					options.dict = {
						addRts: [],
						delRts: [],
						saveType: 0,
						allRights: false
					};
					
					var id = $tr.attr("id");
					var itemKey = id;
					var paras = {
						cmd: "LoadDictRightsData",
						itemKey: itemKey,
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					};
					var $el = dr_flow.el;
					var isChain = $tr.attr("secondaryType") == 5;
					if(isChain) {
						dr_grid.setVisible(true);
						paras.cmd = "LoadChainDictRightsData";
						paras.startRow = 0;
						paras.maxRows = options.maxRows;
						paras.pageIndicatorCount = options.pageIndicatorCount;
						paras.value = $("input", dr_txt.el).val();
						$el.empty();
					} else {
						dr_grid.setVisible(false);
					}
					var newData = loadRights(paras);
					if(!newData) return;
					if(!dr.visisble) dr.setVisible(true);
					
					if(isChain) {
						var count = newData.totalRowCount;
						var page = dr_flow.el.pagination({
							pageSize: 50,
							//总记录数
					        totalNumber: count,
					        showPages: true,
					        showPageDetail: false,
					        showFirstButton: false,
					        showLastButton: false,
					        pageIndicatorCount: 3
						});
						$el = page.content;

				    	var pagesH = $(".paginationjs-pages", dr_flow.el).is(":hidden") ? 0 : $(".paginationjs-pages", dr_flow.el).outerHeight();
				    	var realHeight = dr_flow.el.height() - pagesH;
				    	page.content.css("height", realHeight);

						page.pageChanges = function(pageNum) {
							var data = getChainDictData(itemKey, pageNum);
							$dr_tbl.removeAll();
							options.dictRts = [];
							$dr_tbl = createTable($el, dr_opt, data);
							$dr_tbl.dictRts = options.dictRts;
							page.setTotalRowCount(pageNum*50 + data.totalRowCount);
							if(!modify.enable) {
								$(".checkbox", $dr_tbl).removeAttr("disabled");
							}
				        };
				        options.setTotalRowCount = function(pageNum, totalRowCount) {
							page.setTotalRowCount(totalRowCount);
				        };
					}
					
					options.dictRts = [];
					var tblData = {
						rows: newData.data,
						cols: [{
								key: "code",
								caption: "编码"
							}, {
								key: "name",
								caption: "名称"
							}, {
								key: "hasRights",
								type: "checkbox",
								caption: "是否有权限"
							}],
						hasAllRights: newData.hasAllRights
					};
					options.dict.allRights = newData.hasAllRights;
					
					$dr_tbl = createTable($el, dr_opt, tblData);
					$dr_tbl.dictRts = options.dictRts;
					$dr_tbl.isChain = isChain;
				}
			}
		};
		var $d_tbl = null;
		
		var getChainDictData = function(itemKey, pageNum) {
			var data = {
				cmd: "LoadChainDictRightsData",
				itemKey: itemKey,
				startRow: pageNum * options.maxRows,
				maxRows: options.maxRows,
				pageIndicatorCount: options.pageIndicatorCount,
				value: $("input", dr_txt.el).val(),
				operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
				roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
			};
			var chainData = loadRights(data);
			var data = {
				rows: chainData.data,
				cols: [{
						key: "code",
						caption: "编码"
					}, {
						key: "name",
						caption: "名称"
					}, {
						key: "hasRights",
						type: "checkbox",
						caption: "是否有权限"
					}],
				hasAllRights: chainData.hasAllRights,
				totalRowCount: chainData.totalRowCount
			}
			return data;
		}
		
		var dr_opt = {
			theme : 'default',
			expandLevel : 1,
			beforeExpand : function(node) {
				var id = node.attr('id');
				var expanded = node.attr('expanded');
				if(expanded) return;
				var data = {
					cmd: "LoadDictRightsData",
					itemKey: options.itemKey,
					parentID: id,
					operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
					roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
				};
				var newData = loadRights(data);
				var dictData = newData.data;
				var item = $dr_tbl.treeNode.tree[id];
				var changed = item.changed;
				var checked = false;
				
				var data = {
					rows: dictData,
					cols: [{
							key: "code",
							caption: "编码"
						}, {
							key: "name",
							caption: "名称"
						}, {
							key: "hasRights",
							type: "checkbox",
							caption: "是否有权限"
						}],
					hasAllRights: newData.hasAllRights
				}
				
				var html = createRowsHtml($dr_tbl, data, id);
				$dr_tbl.addChilds(html);
				node.attr("expanded", "expanded");
				if(!modify.enable) {
					$(".checkbox", $dr_tbl).removeAttr("disabled");
				}
				
				if(changed) {
					checked = $(".checkbox", node).is(":checked");
					if(dictData.length > 0) {
						for (var i = 0, len = dictData.length; i < len; i++) {
							var $id = dictData[i].oid;
//							dictData[i].previd = dictData[i].oid;
							var $item = $dr_tbl.treeNode.tree[$id];
							var hasRts = dictData[i].hasRights == 0 ? false : true;
//							$item.hasRights = hasRts;
							if(hasRts != checked) {
								$item.changed = true;
								if(checked) {
									$(".checkbox", $item.row).prop("checked", true);
									options.dict.addRts.push($id);
								} else {
									$(".checkbox", $item.row).prop("checked", false);
									options.dict.delRts.push($id);
								}
							}
						}
					}
				}
				
			},
			onSelect : function($table, $tr) {
				if(!$table.target.hasClass("checkbox")) return;
				setChecked($table);
				var checked = $(".checkbox", $tr).is(":checked");
				if(!checked && options.dict.allRights) {
					options.dict.allRights = false;
					options.dict.saveType = 1;
				}
			}
		};
		
		var $dr_tbl = null;
		
		var f_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!options.id) return;
					var flag = isClick($tr, $table);
					if(flag) return;
					options.clickTr = $tr;
					if(!ff.visible) ff.setVisible(true);
					if(!fo.visible) fo.setVisible(true);
					$ff_tbl && $ff_tbl.removeAll();
					$fo_tbl && $fo_tbl.removeAll();
					options.type = YIUI.Rights_type.TYPE_FORM;
					options.formKey = $tr.attr("id");
					var id = $tr.attr("id");
					var formkey = id;
					var data = {
						cmd: "LoadFormRightsData",
						formKey: formkey,
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					};
					
					var formRoot = loadRights(data);
					
					//表单的所有可用性、可见性、可操作性
					if(formRoot.fieldData) {
						var field_data = {
								rows: formRoot.fieldData,
								cols: [{
									key: "caption",
									caption: "名称"
								}, {
									key: "key",
									caption: "标识"
								}, {
									key: "visible",
									caption: "是否可见",
									type: "checkbox",
									index: 0
								}, {
									key: "enable",
									caption: "是否可编辑",
									type: "checkbox",
									index: 1
								}],
								allEnableRights: formRoot.hasAllEnableRights,
								allVisibleRights: formRoot.hasAllVisibleRights
						};
						options.isFFData = true;
						options.visibleRts = [];
						options.enableRts = [];
						$ff_tbl = createTable(ff_flow.el, ff_opt, field_data);
						$ff_tbl.hasAllEnableRights = formRoot.hasAllEnableRights;
						$ff_tbl.hasAllVisibleRights = formRoot.hasAllVisibleRights;
						$ff_tbl.enableRts = options.enableRts;
						$ff_tbl.visibleRts = options.visibleRts;
						options.isFFData = false;
					}
					
					if(formRoot.optData) {
						var opt_data = {
								rows: formRoot.optData,
								cols: [{
									key: "caption",
									caption: "名称"
								},{
									key: "key",
									caption: "标识"
								}, {
									key: "hasRights",
									type: "checkbox",
									caption: "是否有权限"
								}],
								allOptRights: formRoot.hasAllOptRights
						};
						options.isFOData = true;
						options.optRts = [];
						$fo_tbl = createTable(fo_flow.el, fo_opt, opt_data);
						$fo_tbl.optRts = options.optRts;
						$fo_tbl.hasAllOptRights = formRoot.hasAllOptRights;
						options.isFOData = false;
					}
				}
			}
		};
		var $f_tbl = null;

		var ff_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					options.isField = true;
					var target = $table.target;
					var index = target.attr("index") || 0;
					setFormChecked($table, index);
					options.isField = false;
				}
			}
		};
		var $ff_tbl = null;
		
		var fo_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					setChecked($table);
				}
			}
		};
		var $fo_tbl = null;
		
		var setChecked = function($table) {
			var target = $table.target;
			var $cks = $("tr.title .checkbox", $table), $chk, tmp;
			var checked = target.is(":checked");
			var $trs = $("tr:not([class~='title'])", $table);
			if(target.parents("tr").hasClass("title")) {
				for (var i = 0, len = $trs.length; i < len; i++) {
					$chk = $(".checkbox", $trs.eq(i));
					if($chk.attr("enable") == "false") continue;
					$chk.prop("checked", checked);
					var tr = $chk.parents("tr").eq(0);
					setRts(tr.attr("id"), checked, $table);
				}
				
				var type = options.type;
				switch(type) {
					case YIUI.Rights_type.TYPE_DICT:
						if(checked) {
							options.dict.allRights = true;
							options.dict.saveType = 1;
						} else {
							options.dict.allRights = false;
							options.dict.saveType = -1;
						}
						break;
					case YIUI.Rights_type.TYPE_FORM:
						if(checked) {
							$table.allOptRights = true;
						} else {
							$table.allOptRights = false;
						}
						break;
				}
			} else {
				var tr = target.parents("tr").eq(0);
				var pid = tr.attr("pid");

				setRts(tr.attr("id"), checked, $table);
				checkCtr($table, tr.attr("id"), checked);
				checkPtr($table, tr.attr("id"), checked);				
				
				var isAllCk = true;
				var cks = $(".checkbox:not([enable='false'])", $trs);
				for (var i = 0, len = cks.length; i < len; i++) {
					var cked = cks.eq(i).is(":checked");
					if(!cked) isAllCk = false;
				}
				if(!isAllCk) {
					$(".checkbox", $("tr[class~='title']", $table)).prop("checked", false);
					if($table.allOptRights) {
						$table.allOptRights = false;
					}
				}
			}
		};
		
		var setFormChecked = function($table, index) {
			var target = $table.target;
			var $cks = $("tr.title .checkbox", $table), $chk, tmp;
			var checked = target.is(":checked");
			if(!index) {
				index = 0;
				$table.hasAllVisibleRights = checked;
				if(!checked) {
					$(".checkbox", target.parents("tr")).eq(1).prop("checked", false);
					$table.hasAllEnableRights = false;
				}
			} else {
				$table.hasAllEnableRights = checked;
				if(checked) {
					$(".checkbox", target.parents("tr")).eq(0).prop("checked", true);
					$table.hasAllEnableRights = true;
				}
			}
			var $trs = $("tr:not([class~='title'])", $table);
			if(target.parents("tr").hasClass("title")) {
				for (var i = 0, len = $trs.length; i < len; i++) {
					var $tr = $trs.eq(i);
					$chk = $(".checkbox:not([class~='ignore'])", $tr).eq(index);
					if($chk.length == 0 || $chk.attr("enable") == "false") continue;
					$chk.prop("checked", checked);
					var tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!checked) {
							$(".checkbox", tr).eq(1).prop("checked", false);
						}
						chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
						chkData.visible = checked;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(checked) {
							$(".checkbox", tr).eq(0).prop("checked", true);
						}
						chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
						chkData.enable = checked;
					}
					setRts(tr.attr("id"), checked, $table, chkData);
				}
			} else {
				var tr = target.parents("tr").eq(0);
				var chkData = {
					id: tr.attr("id")
				}
				if(index == 0) {
					//可见为false时相应的enable为false
					if(!checked) {
						$(".checkbox", tr).eq(1).prop("checked", false);
					}
					chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
					chkData.visible = checked;
				}
				if(index == 1) {
					//enable全部为true时相应的visible也为true
					if(checked) {
						$(".checkbox", tr).eq(0).prop("checked", true);
					}
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
					chkData.enable = checked;
				}
				var pid = tr.attr("pid");
				
				setRts(tr.attr("id"), checked, $table, chkData);
				checkCtr($table, tr.attr("id"), checked, index);
				checkPtr($table, tr.attr("id"), checked, index);				
				
				var chks = $("thead tr.title .checkbox", $table), childs;
				var $trs = $("tr:not([class~='title'])", $table);
				for (var i = 0, len = chks.length; i < len; i++) {
					var isAllCk = true;
					if(i != 0) {
						childs = $(".checkbox[index='"+i+"'].checkbox:not([enable='false']):not([class ~='ignore'])", $trs);
					} else {
						childs = $(".checkbox:not([index]):not([enable='false']):not([class ~='ignore'])", $trs);
					}
					var length = childs.length;
					if(length == 0) {
						chks.eq(i).attr("enable", "false");
						break;
					}
					for (var j = 0; j < length; j++) {
						var cked = childs.eq(j).is(":checked");
						if(!cked) isAllCk = false;
					}
					if(!isAllCk) {
						chks.eq(i).prop("checked", false);
						if(i == 0) {
							$table.hasAllEnableRights = isAllCk;
						} else {
							$table.hasAllVisibleRights = isAllCk;
						}
					}
				}
			}
		};

		var getUserList = function(result) {
			for (var i = 0; i < result.data.length; i++) {
				if(result.data[i].OID == 21 || result.data[i].OID == 11
						|| result.data[i].OID == $.cookie("userID")) {
					result.data.splice(i, 1);
					i--;
				}
			}
			var data = {
				rows: result.data,
				cols: [{
					key: "Code",
					caption: "代码"
				}, {
					key: "Name",
					caption: "名称"
				}],
				totalRowCount: result.totalRowCount
			};
			return data;
		};
		var getULPData = function(pageNum, success) {
			var maxRows = options.maxRows;
			var pageIndicatorCount = options.pageIndicatorCount;
			var fuzzyValue = $("input", secTxt.el).val();
			var onlyEnable = true;
			var itemKey = "Role";
			if(options.tag == YIUI.Custom_tag.OperatorRights) {
				itemKey = "Operator";
			}
			var paras = {
				service: "DictService",
				cmd: "GetQueryData",
				itemKey: itemKey,
				startRow: pageNum*maxRows,
			 	maxRows: maxRows,
				pageIndicatorCount: pageIndicatorCount,
				value: fuzzyValue
			};
			var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras, success);
			if(!success) {
				var data = getUserList(result);
				return data;
			}
		};
		var doUserListPage = function(pageNum, isReset) {
			var data = getULPData(pageNum);
			$l_tbl.removeAll();
			options.dictRts = [];
			$l_tbl = createTable(options.userPage.content, l_opt, data);
			options.userPage.setTotalRowCount(pageNum*options.maxRows + data.totalRowCount, isReset);
			if(!modify.enable) {
				$(".checkbox", $l_tbl).removeAttr("disabled");
			}
		};
		var Return = {
			el: roleRts,
			setHeight: function(height) {
				split.setHeight(height);
				split.doLayout(this.el.width(), height);

		    	var pagesH = $(".paginationjs-pages", dr_flow.el).is(":hidden") ? 0 : $(".paginationjs-pages", dr_flow.el).outerHeight();
		    	var realHeight = dr_flow.el.height() - pagesH;
		    	$(".paginationjs-content", dr_flow.el).css("height", realHeight);
				
		    	var pagesH = $(".paginationjs-pages", left_view.el).is(":hidden") ? 0 : $(".paginationjs-pages", left_view.el).outerHeight();
		    	var realHeight = left_view.el.height() - pagesH;
		    	$(".paginationjs-content", left_view.el).css("height", realHeight);

			},
			setWidth: function(width) {
				split.setWidth(width);
				split.doLayout(width, this.el.height());
			},
			init: function() {
				// 获取被操作对象集合
				var success = function(msg) {
					var totalRowCount = msg.totalRowCount;
					
					var data = getUserList(msg);
					
					var pagination = options.userPage = left_view.el.pagination({
						pageSize: options.maxRows,
						//总记录数
				        totalNumber: totalRowCount,
				        showPages: true,
				        showPageDetail: false,
				        showFirstButton: false,
				        showLastButton: false,
				        pageIndicatorCount: options.pageIndicatorCount
					});
					$l_tbl = createTable(pagination.content, l_opt, data);

					// 分页。。。
					pagination.pageChanges = function(pageNum) {
						doUserListPage(pageNum, false);
			        };
				};
				getULPData(0, success);
				
				// 加载权限项
				var paras = {
					cmd: "LoadSetRightsList",
					operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
					roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
				}
				var rights = loadRights(paras);
				if(!rights) return;
				
				var entryRts = rights.entry;
				var eData = {
					rows: entryRts,
					cols: [{
						key: "caption",
						caption: "全选",
						type: "checkbox",
						showText: true,
						isEntry: true
					}]
				};

				$e_tbl = createTable(e_flow.el, e_opt, eData);
				e_flow.el.addClass("entryRts");
				
				var dictRts = rights.dict;
				var dData = {
					rows: dictRts,
					cols: [{
						key: "caption",
						caption: "名称"
					}, {
						key: "key",
						caption: "代码"
					}]
				};
				$d_tbl = createTable(d_flow.el, d_opt, dData);
				
				var formRts = rights.form;
				var fData = {
					rows: formRts,
					cols: [{
						key: "caption",
						caption: "名称"
					}, {
						key: "key",
						caption: "标志"
					}]
				};
				$f_tbl = createTable(f_flow.el, f_opt, fData);
				$e_tbl.attr("enable", false);

				modify.setEnable(false);
				tabPanel.setEnable(false);
			},
			install: function() {
				var _this = tabPanel;
				_this.el.children("ul").unbind();
				_this.el.children("ul").click(function(event) {
					var target = $(event.target);
		        	if(target.hasClass('ui-anchor-label') || target.hasClass('ui-tans-anchor')) {
		        		if(_this.selectedTab && _this.selectedTab.attr("aria-controls") != target.closest('li').attr("aria-controls")) {
		        			if(!_this.enable) {
		            			return false;
		        			}
		        			target.closest('li').toggleClass("aria-selected");
		        		}
		        		var tabID = target.closest('li').attr('aria-controls');
		        		if(_this.selectedTab.attr("aria-controls") == target.closest('li').attr("aria-controls")) {
		        			event.stopPropagation();
	            			return false;
		        		} else {
		        			
		        			_this.selectedTab.toggleClass("aria-selected");
							$("#" + _this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
		        		}
		        		
		        		$("#"+tabID).toggleClass("aria-show");
		        		_this.setActiveTab(tabID);
		        		
		        		$("#"+tabID).show();
		        		_this.layout.layout(_this.getWidth(), _this.getHeight());
		        		_this.selectedTab = target.closest('li');
		        	}
		        	
		        	$(".tab-body .ui-corner-bottom", _this.el).css("display", "none");
		        	$(".tab-body .ui-corner-bottom.aria-show ", _this.el).css("display", "block");
		        	
		        	event.stopPropagation();
		        	return false;
				});
				
				
//				modify.el.unbind();
//				save.el.unbind();
//				cancel.el.unbind();
				$("input[type='text']", roleRts).unbind();
				$("button", roleRts).unbind();
				modify.el.click(function(e) {
					$e_tbl.attr("enable", true);
					$l_tbl.attr("enable", false);
					$d_tbl.attr("enable", false);
					$f_tbl.attr("enable", false);
					modify.setEnable(false);
					save.setEnable(true);
					cancel.setEnable(true);
					left.setEnable(false);
					right.setEnable(true);
					tabPanel.setEnable(false);
					

//					$(".checkbox", roleRts).removeAttr("disabled");
					$(".checkbox:not([class~='ignore'])", roleRts).removeAttr("disabled");
				});
				
				var isHalfCheck = function(root) {
					var size = $("[pId='"+root.id+"'] .checkbox:checked", $dr_tbl).size();
					var halfCheck = false;
					var childs = root.children;
					if(size == childs.length) {
						//子节点全选
						for (var i = 0, len = childs.length; i < len; i++) {
							var child = childs[i];
							if(child.children && child.children.length > 0) {
								halfCheck = isHalfCheck(child);
							}
						}
					} else {
						halfCheck = true;
					}
					return halfCheck;
				};
				
				var getDictChanged = function(roots, allRts, noAllRts, delRts) {
					if(roots.length > 0) {
						for (var i = 0, len = roots.length; i < len; i++) {
							var root = roots[i];
							var row = root.row;
							var chk = $(".checkbox", row);
							var checked = chk.is(":checked");
							
							if(root.changed) {
								if(root.children && root.children.length > 0) {
									//汇总节点
									var halfCheck = isHalfCheck(root);
									if(!halfCheck) {
										//子节点全选
										allRts.push(root.id);
									} else {
										if(checked) {
											//子节点部分勾选
											noAllRts.push(root.id);
										} else {
											//子节点无勾选
											delRts.push(root.id);
										}
										getDictChanged(root.children, allRts, noAllRts, delRts);
									}
								} else {
									//明细节点
									if(checked) {
										allRts.push(root.id);
									} else {
										delRts.push(root.id);
									}
								}
							} else {
								if(root.children && root.children.length > 0) {
									getDictChanged(root.children, allRts, noAllRts, delRts);
								}
							}
						}
					}
				};
				
				save.el.click(function(e) {
					var paras = {
						key: options.key,
						id: options.id,
						type: options.type,
						
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					}
					
					var type = options.type;
					switch(type) {
						case YIUI.Rights_type.TYPE_ENTRY:
							paras.rights = $.toJSON($e_tbl.entryKeys);
							paras.allRights = $e_tbl.allRights;
							paras.cmd = "SaveEntryRights";
							break;
						case YIUI.Rights_type.TYPE_DICT:

							paras.allRights = options.dict.allRights;
							
							var isChain = options.clickTr.attr("secondaryType") == 5;
							if(!isChain) {
								var allRts = [], 
									noAllRts = [], 
									delRts = [];
								var roots = $dr_tbl.treeNode.roots;
								getDictChanged(roots, allRts, noAllRts, delRts);
								paras.halfCheckRights = $.toJSON(noAllRts);
								paras.delRights = $.toJSON(delRts);
								paras.addRights = $.toJSON(allRts);
							} else {
								paras.addRights = $.toJSON(options.dict.addRts);
								paras.delRights = $.toJSON(options.dict.delRts);
							}
							paras.saveType = options.dict.saveType;
							paras.itemKey = options.itemKey;
							paras.cmd = "SaveDictRights";
							break;
						case YIUI.Rights_type.TYPE_FORM:
							paras.allOptRights = $fo_tbl.allOptRights;
							paras.optRights = $.toJSON($fo_tbl.optRts);
							paras.allEnableRights = $ff_tbl.hasAllEnableRights;
							paras.enableRights = $.toJSON($ff_tbl.enableRts);
							paras.allVisibleRights = $ff_tbl.hasAllVisibleRights;
							paras.visibleRights = $.toJSON($ff_tbl.visibleRts);
							paras.formKey = options.formKey;
							paras.cmd = "SaveFormRights";
							break;
					}
					saveData(paras);
					
					$(".checkbox[type='checkbox']", roleRts).attr("disabled", "disabled");

					$e_tbl.attr("enable", false);
					$l_tbl.attr("enable", true);
					$d_tbl.attr("enable", true);
					$f_tbl.attr("enable", true);
					save.setEnable(false);
					modify.setEnable(true);
					cancel.setEnable(false);
					left.setEnable(true);
					right.setEnable(false);
					tabPanel.setEnable(true);
					if(options.dict) {
						options.dict.saveType = 0;
					}
					
					var trs = $(".checkbox:checked", roleRts).parents("tr");
				});
				cancel.el.click(function(e) {
					$e_tbl.attr("enable", false);
					$l_tbl.attr("enable", true);
					$d_tbl.attr("enable", true);
					$f_tbl.attr("enable", true);
					cancel.setEnable(false);
					save.setEnable(false);
					modify.setEnable(true);
					left.setEnable(true);
					right.setEnable(false);
					tabPanel.setEnable(true);
					if(options.dict) {
						options.dict.saveType = 0;
					}
					$(".checkbox[type='checkbox']", roleRts).attr("disabled", "disabled");
					if(options.clickTr) {
						options.clickTr.removeClass("sel");
						options.clickTr.click();
					}
				});
				sec.el.click(function(e) {
//					var value = $("input", secTxt.el).val().toLowerCase();
//					var $trs = $("tr:gt(0)", $l_tbl), $tr, $tds, $td, txt, exist, isFirst = true;
//					for (var i = 0, len = $trs.length; i < len; i++) {
//						$tr = $trs.eq(i);
//						$tds = $("td", $tr);
//						exist = false;
//						for (var j = 0, length = $tds.length; j < length; j++) {
//							$td = $tds.eq(j);
//							txt = $td.text().toLowerCase();
//							if(txt.indexOf(value) > -1) {
//								exist = true;
//								continue;
//							}
//						}
//						if(exist) {
//							$tr.show();
//							isFirst && $tr.click();
//							isFirst = false;
//						} else {
//							$tr.hide();
//						}
//					}
					
					doUserListPage(0, true);
				});
				var saveData = function(paras) {
					var data = {};
					data.service = "SetRightsService";
					data = $.extend(data, paras);
					var result = null;
					var success = function() {
						
					};
					Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
					return result;
				};
				
				var loopSearch = function(value, $table) {

					if($table.searchValue == value) {
						$table.searches++;
					} else {
						$table.searches = 1;
						$table.searchValue = value;
					}
					
					var $trs = $("tr:gt(0)", $table), $tr, $tds, $td, txt, exist, searchIndex = 0, isFirst = true, $firstTr, hasClick = false;
					var container = $table.parent();
					for (var i = 0, len = $trs.length; i < len; i++) {
						$tr = $trs.eq(i);
						$tds = $("td", $tr);
						exist = false;
						for (var j = 0, length = $tds.length; j < length; j++) {
							$td = $tds.eq(j);
							txt = $td.text().toLowerCase();
							if(txt.indexOf(value) > -1) {
								if(isFirst) {
									$firstTr = $tr;
									isFirst = false;
								}
								exist = true;
								searchIndex++;
								continue;
							}
						}
						if(exist) {
							if($table.searches == searchIndex) {
								container.scrollTop(0);
								container.scrollTop($tr.position().top);
								$tr.click();
								hasClick = true;
								break;
							}
						}
					}
					if(!hasClick && $firstTr) {
						container.scrollTop(0);
						container.scrollTop($firstTr.position().top);
						$firstTr.click();
						$table.searches = 1;
					}
				};
				d_sec.el.click(function(e) {
					var value = $("input", d_txt.el).val().toLowerCase();
					loopSearch(value, $d_tbl);
				});
				f_sec.el.click(function(e) {
					var value = $("input", fItem_txt.el).val().toLowerCase();
					loopSearch(value, $f_tbl);
				});
				dr_sec.el.click(function(e) {
					var value = $("input", dr_txt.el).val().toLowerCase();
					var isChain = options.clickTr.attr("secondaryType") == 5;
					var $el = dr_flow.el;
					if(isChain) {
						$el = $(".paginationjs-content", dr_flow.el);
						var data = getChainDictData(options.itemKey, 0);
						$dr_tbl.removeAll();
						options.dictRts = [];
						$dr_tbl = createTable($el, dr_opt, data);
						$dr_tbl.dictRts = options.dictRts;
						options.setTotalRowCount(0, data.totalRowCount);
					} else {
						loopSearch(value, $dr_tbl);
					}
				});
//				ff_sec.el.click(function(e) {
//					var value = $("input", ff_txt.el).val().toLowerCase();
//					loopSearch(value, $ff_tbl);
//				});
			}
		};
		Return.init();
		Return.install();
		return Return;
	}
	
	
}(jQuery) );