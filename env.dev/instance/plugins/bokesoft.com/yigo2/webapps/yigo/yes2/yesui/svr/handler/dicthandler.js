YIUI.DictHandler = (function () {
    // var getFilter = function(form, fieldKey, itemFilters, itemKey, cxt) {
    //                     var filter = null;
    //                     if (itemFilters) {
    //                         var itemFilter = itemFilters[itemKey];
    //                         if (itemFilter != null && itemFilter != undefined && itemFilter.length > 0) {
    //                             for (var i = 0, len = itemFilter.length; i < len; i++) {
    //                                 var cond = itemFilter[i].cond;
    //                                 if (cond && cond.length > 0) {
    //                                     if(!cxt) {
    //                                         cxt = new View.Context(form);
    //                                     }
    //                                     var ret = form.eval(cond, cxt, null);
    //                                     if (ret == true) {
    //                                         filter = itemFilter[i];
    //                                         break;
    //                                     }
    //                                 } else {
    //                                     filter = itemFilter[i];
    //                                     break;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     return filter;
    //                 };


    var Return = {
        doLostFocus: function (extParas) {

        },

        getMetaFilter: function(form, fieldKey, itemFilters, itemKey, cxt) {
            var filter = null;
            if (itemFilters) {
                var itemFilter = itemFilters[itemKey];
                if (itemFilter != null && itemFilter != undefined && itemFilter.length > 0) {
                    for (var i = 0, len = itemFilter.length; i < len; i++) {
                        var cond = itemFilter[i].cond;
                        if (cond && cond.length > 0) {
                            if(!cxt) {
                                cxt = new View.Context(form);
                            }
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

        getDictFilter: function (form, fieldKey, itemFilters, itemKey, cxt) {
            var filter = Return.getMetaFilter(form, fieldKey, itemFilters, itemKey);
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
                                //paras += form.eval(content, cxt, null);
                            	if(!cxt) {
                            		cxt = new View.Context(form);
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
                dictFilter.filterIndex = filter.filterIndex;
                dictFilter.values = paras;
                dictFilter.dependency = filter.dependency;
                dictFilter.typeDefKey = filter.typeDefKey;
                return dictFilter;
            } else {
                return null;
            }
        },

        getItemKey: function(form, refKey){
            
            var cxt = new View.Context(form);
            var itemKey = form.eval(refKey, cxt, null);
            return itemKey;

        },

        getRoot: function(form, itemKey, rootKey, cxt){

            var rootItem = {};

            if (rootKey && rootKey.length >= 0) {
                if(!cxt) {
                    cxt = new View.Context(form);
                }

                rootItem = form.getComponentValue(rootKey, cxt);

                if (rootItem == null) {
                    rootItem = {};
                    rootItem.oid = 0;
                    rootItem.itemKey = itemKey;
                }
            } else {
                rootItem.oid = 0;
                rootItem.itemKey = itemKey;
            }

            return new YIUI.ItemData(rootItem);

        },

        createRoot: function(form, itemKey, rootKey, cxt){
            var rootItem = Return.getRoot(form, itemKey, rootKey, cxt);

            var params = {};
            params.itemKey = itemKey;
            params.itemData = $.toJSON(rootItem);
            params.service = "PureUIService";
            params.cmd = "CheckDict";

            return Svr.Request.getData(params);

            // var success = function (result) {
            //     if (result) {
            //         var rootCaption = result.rootCaption;

            //         if (_this.getDictTree().rootNode != null) {
            //             _this.getDictTree().rootNode.remove();
            //         }
            //         if (oldItemKey != _this.itemKey) {
            //             _this.getDictTree().fuzzyValue = null;
            //             _this.getDictTree().startRow = 0;
            //             _this.getDictTree()._searchdiv.find(".findinput").val("");
            //             _this.getDictTree()._footdiv.find(".next").removeClass('disable');
                        
            //         }

            //         _this.getDictTree().createRootNode(rootItem, rootCaption, rootItem.itemKey + '_' + rootItem.oid, result.secondaryType);
            //         _this.getDictTree().itemKey = _this.itemKey;
            //         _this.setSecondaryType(result.secondaryType);
            //         var resultType = result.secondaryType;
            //         _this.secondaryType = result.secondaryType;
            //         _this.needRebuild = false;

            //         return true;
            //     }
            //     return false
            // };

            // return Svr.Request.getData(data).then(function(data){
            //     return success(data);
            // });
        },

        getShowCaption: function(val, multiSelect){
            var def = $.Deferred();

            var itemKey = null;
            if(val != null) {
                var oids, needCaption = false;
                if(multiSelect) {

                    oids = [];
                    var text = '';

                    for (var i = 0, len = val.length; i < len; i++) {
                        var v = val[i];

                        if(v.oid != 0){
                            oids.push(v.oid);
                            if(v.hasCaption()){
                                text = text + ','+v.getCaption();
                            }else{
                                needCaption = true;
                                itemKey = v.getItemKey();
                            }
                        }
                    }


                    if(!needCaption){
                        if(text.length > 0){
                            text = text.substring(1);
                        }
                        def.resolve(text);
                        //this.setText(text);
                    }

                } else if(val.oid == 0){
                    def.resolve('');
                    //this.setText('');
                } else {
                    //如果值中已含caption 则直接赋值
                    if(val.hasCaption()){
                        def.resolve(val.getCaption());
                        //this.setText(value.getCaption());
                    }else{
                        oids = val.oid;
                        itemKey = val.getItemKey();
                        needCaption = true;
                    }
                }

                if(needCaption){
                       if(multiSelect) {
                            //TODO 之后做优化 不要循环调用多次
                            var args = [];
                            for(var i = 0 ; i < oids.length ; i++){
                                args.push(YIUI.DictCacheProxy.getCaption(itemKey, oids[i]));
                            }
                            def = $.when.apply($.when,args).then(function(){
                                var c = '';
                                for(var i = 0; i< arguments.length; i ++){
                                    c = c + ','+arguments[i];
                                }

                                if(c.length > 0){
                                    c = c.substring(1);
                                }

                                return c;

                            });
                       }else{
                            def = YIUI.DictCacheProxy.getCaption(itemKey, oids);
                       }
                }

            }else{
                def.resolve('');
            }

            return def.promise();
        },

        /**
        checkDict: function ($this, cxt) {


            var oldItemKey = $this.getDictTree().itemKey;

            var formID = $this.ofFormID;

            var form = YIUI.FormStack.getForm(formID);
        	if(!cxt) {
        		cxt = new View.Context(form);
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
                    var resultType = result.secondaryType;
                    $this.secondaryType = result.secondaryType;
                    $this.needRebuild = false;

                    if (resultType == 5) {
                    	//$this.secondaryType = result.secondaryType;
                        //$this.itemKey = result.itemKey;
                        $this.needRebuild = true;
                    }
                    return true;
                }
                return false
            };

            return Svr.Request.getData(data).then(function(data){
                return success(data);
            });


        },
        */

        /* autocomplete 的实现移至 yesdict中 
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
        },*/

        doSuggest: function (form, meta, text, dictFilter, root) {
            if (meta.multiSelect) {
                return;
            }
            var def = $.Deferred();
            
            YIUI.DictService.getSuggestData(meta.itemKey, text, meta.stateMask, dictFilter, root).then(function(viewItems) {
                def.resolve(viewItems);
            });

            return def.promise();
        }

    };

    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();