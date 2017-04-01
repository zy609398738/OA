YIUI.DictViewHandler = (function () {
    var Return = {
        /**
         * 表格行点击
         */
        doOnRowClick: function (control, rowIndex, extParas) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowClick = control.rowClick;

            var cxt = {form: form};
            if (rowClick) {
                form.eval(rowClick, cxt, null);
            }
        },

        /**
         * 表格行焦点变化
         */
        doOnFocusRowChange: function (dictView, node) {
        	var formID = dictView.ofFormID;
        	var form = YIUI.FormStack.getForm(formID);
        	var content = dictView.focusRowChanged;
        	var itemData = dictView.getNodeValue(node);
        	var item = YIUI.DictService.getItem(itemData.itemKey , itemData.oid);
        	dictView._selectItem = item;
        	
        	var cxt = {form: form};
        	if (content) {
                form.eval(content, cxt, null);
            }
        },

        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (control, rowIndex, extParas) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                clickContent = control.clickContent;
            if (control.type === YIUI.CONTROLTYPE.GRID) {
                rowIndex = control.getRowIndexByID(rowIndex);
                clickContent = control.rowDblClick === undefined ? "" : $.trim(control.rowDblClick);
            }
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },

        /**
         * 树的汇总节点展开
         */
        doExpand: function (dictView, pNode) {
		   	var success = function(nodes) {
				if (nodes) {
					var len = nodes.length;
					if(len > 0){
						var pId = pNode.attr('id') || 0;
						
						nodes[len -1].islast = true;
						
						var prevId = null;
						for(var i=0,len=nodes.length;i<len;i++) {
						    nodes[i].id = nodes[i].itemKey+'_'+nodes[i].OID;
						    nodes[i].pid = pId;
						    if(dictView.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
								var path = pNode.attr("path");
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
					
						dictView.addNodes(nodes);
					}
				}
			}
	    	
	    	YIUI.DictService.getDictChildren(dictView.itemKey, dictView.getNodeValue(pNode), dictView.dictFilter, null, success);
        },

        /**
         * 树的汇总节点收缩
         */
        doCollapse: function (control, extParas) {

        },

        /**
         * 按会车键所触发的事件
         */
        doEnterPress: function (control, extParas) {

        },

       	doGoToPage: function(dictView, index, isResetPageNum){
        	var itemKey = dictView.itemKey;
        	var maxRows = dictView.pageRowCount;
        	var pageIndicatorCount = dictView.pageIndicatorCount;
        	var value = dictView.getQueryValue();
        	
        	var startRow = index <= 0 ? 0 : dictView.pageRowCount * index; 
        		
        	var success = function(result) {
				if (result) {
					//清空数据
					dictView.isResetPageNum = isResetPageNum;
					$('tr:gt(1)',dictView._$table).remove()
					var nodes = result.data;
					var len = nodes.length;
					if(len > 0){
						var pId = dictView.root.id;
						
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
					
						dictView.addNodes(nodes);
						dictView.setTotalRowCount(startRow + result.totalRowCount);
						dictView.focusNode(nodes[0].id);
					} else {
						dictView.setTotalRowCount(len);
					}

				}
			}
			
        	YIUI.DictService.getQueryData(itemKey, startRow, maxRows, pageIndicatorCount, value, null, dictView.dictFilter, null, success);
		},
		
        doDictViewSearch: function (dictView) {
  
			this.doGoToPage(dictView, 0, true);
			/*
        	var itemKey = dictView.itemKey;
        	var maxRows = dictView.pageRowCount;
        	var pageIndicatorCount = dictView.pageIndicatorCount;
        	var value = dictView.getQueryValue();
        	
        	var success = function(result) {
				if (result) {
					dictView.isResetPageNum = true;
					//清空数据
					$('tr:gt(1)',dictView._$table).remove()
					var nodes = result.data;
					var len = nodes.length;
					if(len > 0){
						var pId = dictView.root.id;
						
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
					
						dictView.addNodes(nodes);
					}
					dictView.setTotalRowCount(result.totalRowCount);
				}
			}
			
        	YIUI.DictService.getQueryData(itemKey, 0, maxRows, pageIndicatorCount, value, null, null, null, success);
        	*/
        	
        },
        
        getDictFilter: function(dictview){
        	       // filter
            var filter = null;
            var dictFilter = null;
            
            var formID = dictview.ofFormID;

            var form = YIUI.FormStack.getForm(formID);
            var cxt = {form: form};
            
            if (dictview.itemFilters) {
                var itemFilter = dictview.itemFilters[dictview.itemKey];

                for (var i in itemFilter) {

                    var cond = itemFilter[i].cond;
                    if (cond && cond.length > 0) {
                        var ret = form.eval(cond, cxt, null);
                        if (ret == true) {
                            filter = itemFilter[i];
                            break;
                        }
                    } else {
                        filter = itemFilter[i];
                        break;
                    }
                }
            }
            //取 filter的值
            if (filter) {
                var filterVal
                var paras = [];
                for (var j in filter.filterVals) {
                    filterVal = filter.filterVals[j];


                    switch (filterVal.type) {
                        case YIUI.FILTERVALUETYPE.CONST:
                            //paras += content;
                            paras.push(filterVal.refVal);
                            break;
                        case YIUI.FILTERVALUETYPE.FORMULA:
                        case YIUI.FILTERVALUETYPE.FIELD:
                            var cxt = {form: form};
                            //paras += form.eval(content, cxt, null);

                            paras.push(form.eval(filterVal.refVal, cxt, null));
                            break;
                    }
                }

                var dictFilter = {};
                dictFilter.itemKey = dictview.itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.fieldKey = dictview.key;
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
               	//dictview.dictFilter = dictFilter;

            }
            
            return dictFilter;
        },
        
       	refreshNode : function(dictview , id) {
       		var index = id.lastIndexOf('_');
       		
			var itemKey = id.substring(0,index);
			var oid = id.substring(index+1);
			
			var item = YIUI.DictService.getItem(itemKey, oid);
			var $tr = $('#' + id, dictview._$table);

			if (item.nodeType == 1) {
				$tr.attr('haschild', true);
			}

			if (item.enable != undefined) {
				$tr.attr('enable', item.enable);
				$tr.removeClass('invalid').removeClass('disabled');
				switch (item.enable) {
					case -1 :
						$tr.addClass("invalid");
						break;
					case 0 :
						$tr.addClass("disabled");
						break;
					case 1 :
						// tr.addClass("invalid");
						break;
				}
			}

			var value;
			for (var j = 0, len = dictview.colModel.length; j < len; j++) {
				value = item.getValue(dictview.colModel[j].key);
				if (!value) {
					value = '';
				}
				var $td = $tr.children('td').eq(j);
				if($td.children().length > 0) {
					var child = $td.children();
					$td.empty();
					$td.append(child).append(value);
				} else {
					$td.html(value);
				}
			}
		}
    };
    Return = $.extend({},YIUI.Handler, Return);
    return Return;
})();
