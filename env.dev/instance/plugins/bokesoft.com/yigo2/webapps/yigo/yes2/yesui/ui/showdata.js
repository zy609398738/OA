(function () {
    YIUI.ShowData = function (form) {
        var Return = {
            resetDocument: function () {
                var document = form.getDocument();
                if (document == null) {
                    return;
                }
                var table = null;
                for (var i = 0, len = document.tbls.length; i < len; i++) {
                    table = document.tbls[i];
                    table.first();
                }
            },
            loadHeader: function (cmp) {
                var document = form.getDocument();
                if(!document) return;
                var tableKey = cmp.tableKey;
                var table = tableKey && document.getByKey(tableKey);
                if (!table) {
                    return;
                }
                var columnKey = cmp.columnKey, value = "";
                if (table.getRowCount() > 0) {
                    value = table.getByKey(columnKey);
                    if (cmp.type == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        var itemKey = table.getByKey(columnKey + "ItemKey");
                        cmp.itemKey = itemKey;
                    }
                }
                cmp.setValue(value);
            },
            loadListView: function (listView) {
                var showLV = new YIUI.ShowListView(form, listView);
                showLV.load();
            },
            loadGrid: function (grid) {
                YIUI.SubDetailUtil.clearSubDetailData(form,grid);
                var showGrid = new YIUI.ShowGridData(form, grid);
                showGrid.load();
                grid.refreshGrid();
            },
            loadChart: function(chart) {
    			var document = form.getDocument();
    			var metaChart = chart.getMetaObj();
    			var dataJSON = {};
    			var dataSource = metaChart.dataSource;
    			var sourceType = metaChart.sourceType;
    			var categoryKey = new HashMap();
    			if ( dataSource != null ) {
    				// 来源于数据对象
    				if ( "DataObject".equalsIgnoreCase(sourceType) ) {
    					var table = document.getByKey(metaChart.bindingKey);
    					// 计算项目列表
    					var metaCategory = dataSource.category;
    					table.beforeFirst();
    					var index = 0;
    					var categoryCount = 0;
    					var categories = [];
    					while ( table.next() ) {
    						var o = table.getByKey(metaCategory.dataKey);
    						var value = YIUI.TypeConvertor.toString(o);
    						if ( !categoryKey.containsKey(value) ) {
    							categories.push(value);
    							categoryKey.put(value, index);
    							++index;
    							++categoryCount;
    						}
    					}
    					dataJSON.categories = categories;
    					var metaSeriesArray = dataSource.series;
    					var series = [];
    					var metaSeries = null;
    					$.each(metaSeriesArray, function(i, metaSeries) {
    						var splitDataKey = metaSeries.splitDataKey;
    						var splitSeries = splitDataKey != null && !splitDataKey.isEmpty();
    						if ( splitSeries ) {
    							var seriesMap = new HashMap();
    							table.beforeFirst();
    							var jsonObj = null;
    							while ( table.next() ) {
    								jsonObj = {};
    								var splitData = table.getByKey(splitDataKey);
    								var o = table.getByKey(metaSeries.dataKey);
    								var value = YIUI.TypeConvertor.toInt(o);
    								var seriesData = seriesMap.get(splitData);
    								if ( seriesData == null ) {
    									seriesData = {};
    									var data = [];
    									for ( var i = 0; i< categoryCount; ++i ) {
    										data.push(parseInt(0));
    									}
    									jsonObj.data = data;
    									jsonObj.name = splitData.toString();
    									seriesMap.put(splitData, jsonObj);
    									series.push(jsonObj);
    								}
    								o = table.getByKey(metaCategory.dataKey);
    								var c_value = YIUI.TypeConvertor.toString(o);
    								var c_index = categoryKey.get(c_value);
    								if ( c_index != null ) {
    									var data = jsonObj["data"];
    									data[c_index] = value;
    								}
    							}
    						} else {
    							table.beforeFirst();
    							var jsonObj = {"name": metaSeries.title};
    							var data = [];
    							while ( table.next() ) {
    								var o = table.getByKey(metaSeries.dataKey);
    								var value = YIUI.TypeConvertor.toInt(o);
    								data.push(value);
    							}
    							jsonObj.data = data;
    							series.push(jsonObj);
    						}
    					});
    					dataJSON.series = series;
    				}
    			}
    			chart.setDataModel(dataJSON);
            },
            show: function () {
            	form.setShowing(true);
                this.resetDocument();
                var cmpList = form.getComponentList(), cmp;
                for (var i in cmpList) {
                    cmp = cmpList[i];
                    if (cmp.isSubDetail) continue;
                    switch (cmp.type) {
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.loadListView(cmp);
                            break;
                        case YIUI.CONTROLTYPE.GRID:
                            cmp.rootGroupBkmk = null;
                            this.loadGrid(cmp);
                            break;
                        case YIUI.CONTROLTYPE.CHART:
                        	this.loadChart(cmp);
                            break;
                        default:
                            if (cmp.isDataBinding()) {
                                if( cmp.needClean() ){
                                    cmp.setValue(null);
                                }
                                this.loadHeader(cmp);
                            }
                            break;
                    }
                }
                this.postShowData();
        		form.setShowing(false);
        		return true;
            },
            postShowData: function () {
                form.getUIProcess().doPostShowData(false);
                form.getUIProcess().calcToolBar();
            }
        };
        return Return;
    };
    YIUI.ShowListView = function (form, listView) {
        var Return = {
            load: function () {
                listView.clearAllRows();
                var document = form.getDocument();
                var tableKey = listView.tableKey;
                if (!tableKey) return;
                var table = document.getByKey(tableKey);
                if (!table) return;
                listView.totalRowCount = YIUI.TotalRowCountUtil.getRowCount(document, tableKey);
                var rows = [], row, col , colKey;
                for (var j = 0, length = table.getRowCount(); j < length; j++) {
                    row = {};
                    table.setPos(j);
                    for (var m = 0, length3 = listView.columnInfo.length; m < length3; m++) {
                        var column = listView.columnInfo[m];
                        var key = column.key;
                        row[key] = {};

                        var colKey = listView.columnInfo[m].columnKey;
                        //row[colKey].caption;
                        if (colKey) {
                            var caption = "", value = table.getByKey(colKey);
                            switch (column.columnType) {
                                case YIUI.CONTROLTYPE.DATEPICKER:
                                    if (value) {
                                        var format = "yyyy-MM-dd";
                                        if (!column.onlyDate) {
                                            format = "yyyy-MM-dd HH:mm:ss";
                                        }
                                        caption = value.Format(format);
                                        value = value.toString();
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.DICT:
                                    var itemKey = column.itemKey;
                                    var oid = YIUI.TypeConvertor.toInt(value);
                                    caption = YIUI.DictService.getCaption(itemKey, oid);
                                    break;
                                case YIUI.CONTROLTYPE.COMBOBOX:
                                    var items = column.items;
                                    for (var i = 0, len = items.length, item; i < len; i++) {
                                        var item = items[i];
                                        if (item.value == value) {
                                            caption = item.caption;
                                            break;
                                        }
                                    }
                                    break;
                                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                                    var decScale = column.decScale;
                                    var roundingMode = column.roundingMode;
                                    var d = null;
                                    if (value) {
                                        d = YIUI.TypeConvertor.toDecimal(value);
                                        caption = d.toFormat(decScale, roundingMode);
                                    }
                                    break;
                                default:
                                    caption = table.getByKey(colKey);
                                    break;
                            }
                            row[key].caption = caption;
                            row[key].value = value;
                        } else {
                            row[key].caption = column.caption;
                            row[key].value = null;
                        }
                    }
                    rows.push(row);
                }
                if(listView._pagination) {
                	if (!listView.pageRowCount || listView.totalRowCount < listView.pageRowCount) {
                		listView._pagination.hidePagination();
                	} else if (listView.totalRowCount) {
                		var reset = true;
                		if(listView.curPageIndex > 1) {
                			reset = false;
                		}
                		listView._pagination.setTotalRowCount(listView.totalRowCount, reset);
                		listView.curPageIndex = -1;
                	}
                }
                listView.data = rows;
                listView.addDataRow(rows);
                listView.addEmptyRow();
            }
        };
        return Return;
    };
})();