YIUI.DictHandler = (function () {
    var Return = {
        setContext: function (cxt) {
            this.cxt = cxt;
        },
        doLostFocus: function (control, extParas) {

        },
        getFilter: function(form, fieldKey, itemFilters, itemKey) {
            var filter = null;
            if (itemFilters) {
                var itemFilter = itemFilters[itemKey];
                if (itemFilter != null && itemFilter != undefined && itemFilter.length > 0) {
                    for (var i = 0, len = itemFilter.length; i < len; i++) {
                        var cond = itemFilter[i].cond;
                        if (cond && cond.length > 0) {
                           /* var cxt = this.cxt;
                            if(!cxt) {
                                
                            }*/
                        	cxt = {form: form};
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
            }
            return filter;
        },
        getDictFilter: function (form, fieldKey, itemFilters, itemKey) {
            var filter = Return.getFilter(form, fieldKey, itemFilters, itemKey);
            //取 filter的值
            if (filter) {
                var filterVal, paras = [];
                if (filter.filterVals !== null && filter.filterVals !== undefined && filter.filterVals.length > 0) {
                    for (var j in filter.filterVals) {
                        filterVal = filter.filterVals[j];
                        switch (filterVal.type) {
                            case YIUI.FILTERVALUETYPE.CONST:
                                //paras += content;
                                paras.push(filterVal.refVal);
                                break;
                            case YIUI.FILTERVALUETYPE.FORMULA:
                            case YIUI.FILTERVALUETYPE.FIELD:
//	                            var cxt = {form: form};
                                //paras += form.eval(content, cxt, null);
                            	var cxt = this.cxt;
                            	if(!cxt) {
                            		cxt = {form: form};
                            	}
                                paras.push(form.eval(filterVal.refVal, cxt, null));
                                break;
                        }
                    }
                }

                var dictFilter = {};
                dictFilter.itemKey = itemKey;
                dictFilter.formKey = form.formKey;
                dictFilter.fieldKey = fieldKey;
                dictFilter.sourceKey = fieldKey;
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
                return dictFilter;
            } else {
                return null;
            }
        },
        checkDict: function ($this) {

            if (!$this.needRebuild && typeof($this.needRebuild) != "undefined") {
                return;
            }
            var oldItemKey = $this.getDictTree().itemKey;
            var formID = $this.ofFormID;

            var form = YIUI.FormStack.getForm(formID);
        	var cxt = this.cxt;
        	if(!cxt) {
        		cxt = {form: form};
        	}
            if ($this.isDynamic) {
                $this.itemKey = form.eval($this.refKey, cxt, null);
            }

            var rootItem = {};

            if ($this.root && $this.root.length >= 0) {
                rootItem = form.getComponentValue($this.root, cxt);
                if (rootItem == null) {
                    rootItem = {};
                    rootItem.oid = 0;
                    rootItem.itemKey = $this.itemKey;
                }
            } else {
                rootItem.oid = 0;
                rootItem.itemKey = $this.itemKey;
            }

            if ($this.rootItemKey) {
                rootItem.itemKey = $this.rootItemKey;
            }


            // filter

            $this.getDictTree().dictFilter = Return.getDictFilter(form, $this.key, $this.itemFilters, $this.itemKey);

            var data = {};
            data.itemKey = $this.itemKey;
            data.itemData = $.toJSON(rootItem);
            data.service = "PureUIService";
            data.cmd = "CheckDict";


            var success = function (result) {

                if (result) {
                    var rootCaption = result.rootCaption;

                    if ($this.getDictTree().rootNode != null) {
                        $this.getDictTree().rootNode.remove();
                    }
                    if (oldItemKey != $this.itemKey) {
                    	$this.getDictTree().fuzzyValue = null;
                    	$this.getDictTree().startRow = 0;
                    	$this.getDictTree()._searchdiv.find(".findinput").val("");
                    	$this.getDictTree()._footdiv.find(".next").removeClass('disable');
                    	
                    }
                    $this.getDictTree().createRootNode(rootItem, rootCaption, rootItem.itemKey + '_' + rootItem.oid, result.secondaryType);
                    $this.getDictTree().itemKey = $this.itemKey;
                    $this.setSecondaryType(result.secondaryType);
                    $this.needRebuild = false;
                    var resultType = result.secondaryType;
                    $this.secondaryType = result.secondaryType;
                    if (resultType == 5) {
                    	//$this.secondaryType = result.secondaryType;
                        //$this.itemKey = result.itemKey;
                        $this.needRebuild = true;
                    }
                    
                    
                }
            };

            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);


        },

        autoComplete: function ($this, text) {

            //同步当前字典状态
            this.checkDict($this);
            //精确匹配
            var rootValue = null;
            if ($this.getDictTree().rootNode != null) {
                rootValue = $this.getDictTree().getNodeValue($this.getDictTree().rootNode);
            }

            var ret = null
            if (!$.isEmptyObject(text)) {
                ret = YIUI.DictService.locate($this.itemKey, 'Code', text, $this.getDictTree().dictFilter, rootValue, $this.stateMask);
            }
            //弹出模糊查询框
            if (ret) {
                //精确匹配成功
//                $this.setText(ret.caption);
                var value = {
                    oid: ret.oid,
                    itemKey: ret.itemKey,
                    caption: ret.caption
                };
                var mul_sel = $this.multiSelect;
                var change = false;
                if (mul_sel) {
                    var val = [];
                    val.push(value);
                    change = $this.setValue(val, true, true);
                } else {
                    change = $this.setValue(value, true, true);
                }
                //值未改变时 还原Text
                if(!change){
                      $this.setText($this.text); 
                }
             
            } else {
                if (mul_sel) {
                    $this.setValue(null, true, true);
//                    $this.setText("");
                    return;
                }
                var options = {
                    fuzzyValue: text,
                    itemKey: $this.itemKey,
                    caption: $this.caption,
                    rootValue: rootValue,
                    stateMask: $this.stateMask,
                    dictFilter: $this.getDictTree().dictFilter,
                    displayCols: $this.displayCols,
                    startRow: 0,
                    maxRows: 5,
                    pageIndicatorCount: 3,
                    columns: $this.displayColumns,
                    textInput: $('input', $this.el),
                    callback: function (itemData) {
                        if (itemData) {
                            $this.setValue(itemData, true, true);
                            $this.setText(itemData.caption);
                        } else {
        					$this.setText($this.text);
                        }
                        $this.isShowQuery = false;
                    }
                };
                var dictquery = new YIUI.DictQuery(options);
                $this.isShowQuery = true;
            }
        },

        doSuggest: function ($this, text) {
            if ($this.multiSelect) {
                return;
            }
            if ($.isEmptyObject(text)) {
                $this.yesDict.$suggestView.empty().hide();
                return;
            }
            //同步当前字典状态
            this.checkDict($this);
            //精确匹配
            var rootValue = null;
            if ($this.getDictTree().rootNode != null) {
                rootValue = $this.getDictTree().getNodeValue($this.getDictTree().rootNode);
            }
            var viewItems = YIUI.DictService.getSuggestData($this.itemKey, text, $this.stateMask, $this.getDictTree().dictFilter, rootValue);

            if (viewItems.length == 0) {
                $this.yesDict.$suggestView.empty().hide();
                $this.hasSuggest = false;
                return;
            }
            $this.hasSuggest = true;
            var list = $('<ul/>'), _li;
            var view = $this.yesDict.$suggestView.html(list), item, _a;
            for (var i = 0, len = viewItems.length; i < len; i++) {
                item = viewItems[i];
                _li = $('<li oid=' + item.oid + ' itemkey = ' + item.itemKey + '></li>');
				$("<div class='dt-wholerow'/>").appendTo(_li);
                _a = $("<a class='dt-anchor'></a>").appendTo(_li);
                _spanIcon = $("<span class='branch'></span>").appendTo(_a);
                if (item.NodeType == 0) {
                    _spanIcon.addClass("p_node");
                }
                _spanText = $("<span class='b-txt'></span>").text(item.caption).appendTo(_a);
                list.append(_li);
            }
            var cityObj = $("input", $this.el);
            var cityOffset = cityObj.offset();
            view.css({
                width: cityObj.outerWidth(),
                top: cityOffset.top + cityObj.outerHeight(),
                left: cityOffset.left
            })
            view.show();
            $this.hasText = true;
        }

    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();