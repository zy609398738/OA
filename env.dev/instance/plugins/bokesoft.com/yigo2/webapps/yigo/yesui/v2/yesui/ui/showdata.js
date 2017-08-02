(function () {
	YIUI.ShowData = function (form) {
		var Return = {
			prepare: function () {
				// 重置文档状态，主要是将每个表的游标移到第一行
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
			loadAttachment: function (attachment) {
				attachment.load();
            },
			loadListView: function (listView) {
				var showLV = new YIUI.ShowListView(form, listView);
				showLV.load();
			},
			loadGrid: function (grid) {
				YIUI.SubDetailUtil.clearSubDetailData(form,grid);
			//	var showGrid = new YIUI.ShowGridData(form, grid);
			//	showGrid.load();
			//	grid.refreshGrid();
				grid.load(true,false);
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
						var table = document.getByKey(dataSource.bindingKey);
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
			loadBPMGraph: function(graph) {
				var meta = graph.getMetaObj();
				var processKey = "";
				var processVer = -1;
				var path = null;
				var keyFormula = meta.processKey;
				var verFormula = meta.processVer;
				var pathFormula = meta.processPath;
				var cxt = {form: form};
				if ( keyFormula != null && !keyFormula.isEmpty() ) {
					processKey = form.eval(keyFormula, cxt);
				}
				if ( verFormula != null && !verFormula.isEmpty() ) {
					processVer = form.eval(verFormula, cxt);
				}
				if ( pathFormula != null && !pathFormula.isEmpty() ) {
					path = form.eval(pathFormula, cxt);
				}

				var data = {
					cmd: "DownloadProcessGraph",
					service: "BPMDefService",
					processKey: processKey,
					processVer: processVer
				};
				var transGraph = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
				if ( transGraph != null ) {
					graph.transPath = path;
					graph.swims = transGraph.swims;
					var nodes = transGraph.nodes;
					var transitions = [];
					for (var j = 0, len = nodes.length; j < len; j++) {
						var node = nodes[j];
						var n_transitions = node.transitions;
						if(n_transitions) {
							for ( var i = 0, size = n_transitions.length; i<size; ++i ) {
								var n_transition = n_transitions[i];
								var transition = {
									"lineStyle": n_transition["line-style"],
									"source": node["key"],
									"tagName": n_transition["tag-name"],
									"target": n_transition["target-node-key"]
								};
								transitions.push(transition);
							}
						}
						delete node.transitions;
					}
					graph.nodes = nodes;
					graph.transitions = transitions;
					graph.refreshGraph();
				}
			},
			/**
			 * 默认不提交值,下推后提交值
			 * @param commitValue 是否提交值
			 * @returns {boolean}
			 */
			show: function (commitValue) {
				form.setShowing(true);
				this.prepare();
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
					case YIUI.CONTROLTYPE.BPM_GRAPH:
						this.loadBPMGraph(cmp);
						break;
					case YIUI.CONTROLTYPE.ATTACHMENT:
						this.loadAttachment(cmp);
						break;
					default:
						if (cmp.hasDataBinding()) {
							if( cmp.needClean() ){
								cmp.setValue(null);
							}
							this.loadHeader(cmp);
						}
						break;
					}
				}
				this.postShowData(commitValue);
				form.setShowing(false);
				return true;
			},
			postShowData: function (commitValue) {
				form.getUIProcess().doPostShowData(commitValue);
				form.getUIProcess().addOperation();
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
				if ( !tableKey ) return;
				var table = document.getByKey(tableKey);
				listView.totalRowCount = YIUI.TotalRowCountUtil.getRowCount(document, tableKey);
				var cxt = new View.Context(form),backColor,row;
				for (var j = 0, length = table.getRowCount(); j < length; j++) {
					row = {};
					listView.data.push(row);
					table.setPos(j);
					var bkmkRow = new YIUI.DetailRowBkmk();
					bkmkRow.setBookmark(table.getBkmk());
					row.bkmkRow = bkmkRow;
					for (var m = 0, size = listView.columnInfo.length; m < size; m++) {
						var column = listView.columnInfo[m];
						var columnKey = column.columnKey;
						var value = null;
						if(columnKey) {
							value = table.getByKey(columnKey);
						} else if ( m == listView.getSelectFieldIndex() ) {

							if( listView.pageLoadType == YIUI.PageLoadType.DB ) {
								if( YIUI.ViewUtil.findShadowBkmk(document, listView.tableKey) != -1 ) {
									value = true;
								}
							} else {
								value = table.getByKey(YIUI.SystemField.SELECT_FIELD_KEY);
							}

						} else {
							if(column.columnType == YIUI.CONTROLTYPE.HYPERLINK ||
								column.columnType == YIUI.CONTROLTYPE.BUTTON ||
								column.columnType == YIUI.CONTROLTYPE.LABEL ) {
								value = column.caption;
							} else if (column.columnType == YIUI.CONTROLTYPE.HYPERLINK) {
								value = false;
							}
						}
						listView.setValueAt(j, m, value);
					}
					if( listView.rowBackColor ) {
						cxt.setRowIndex(j);
						backColor = form.eval(listView.rowBackColor, cxt);
						if ( backColor ) {
							row.backColor = backColor;
						}
					}
				}
				if( listView._pagination ) {
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
				listView.repaint();
				listView.refreshSelectEnable();
			}
		};
		return Return;
	};
})();