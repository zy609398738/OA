YIUI.GridHandler = (function () {
    var Return = {
        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (control, rowID, colIndex, value) {
            var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                row = control.getRowDataByID(rowID), rowIndex = control.getRowIndexByID(rowID), cellKey = row.cellKeys[colIndex],
                editOpt = control.getColInfoByKey(cellKey)[0].cell;

            var cellType = editOpt.editOptions.cellType;

            switch (cellType) {
                case YIUI.CONTROLTYPE.BUTTON:
                case YIUI.CONTROLTYPE.HYPERLINK:
                case YIUI.CONTROLTYPE.IMAGE:
                case YIUI.CONTROLTYPE.TEXTBUTTON:
                    if (editOpt.editOptions.onClick) {
                        var cxt = new View.Context(form);
                        cxt.setRowIndex(rowIndex);
                        form.eval($.trim(editOpt.editOptions.onClick), cxt, null);
                    }
                    break;
                case YIUI.CONTROLTYPE.CHECKBOX:
                    var oldV = control.getValueAt(rowIndex, colIndex);
                    if (oldV !== value) {
                        control.setValueAt(rowIndex, colIndex, value, true, true);
                    }
                    break;
            }
        },

        /**
         * 表格行点击
         */
        doOnRowClick: function (grid, rowIndex) {

            var rowClick = grid.getMetaObj().rowClick;

            if ( rowClick ) {
                var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cxt = new View.Context(form);
                
                cxt.setRowIndex(rowIndex);

                form.eval(rowClick, cxt, null);
            }
        },

        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (grid, rowIndex) {

            var rowDblClick = grid.getMetaObj().rowDblClick;

            if( rowDblClick ) {
                var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cxt = new View.Context(form);
                
                cxt.setRowIndex(rowIndex);

                form.eval(rowDblClick, cxt, null);
            }

        },
        /**
         * 表格行焦点变化
         * oldRowIndex 暂未使用
         */
        doOnFocusRowChange: function (grid, newRowIndex, oldRowIndex) {

            if(newRowIndex == oldRowIndex)
                return;

            YIUI.SubDetailUtil.showSubDetailData(grid, newRowIndex);

            var rowChanged = grid.getMetaObj().focusRowChanged;

            if(rowChanged){
                var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cxt = new View.Context(form);

                cxt.setRowIndex(newRowIndex);

                form.eval(rowChanged, cxt, null);
            }
        },

        /**
         * 表格排序事件
         */
        doOnSortClick: function (control, colIndex, sortType) {
            if (control.hasGroupRow) {
                alert("表格排序不支持行分组！");
                return;
            }
            var data = control.dataModel.data;
            data.sort(function (row1, row2) {
                if (row1.rowType == "Fix" || row1.rowType == "Total" || row2.rowType == "Fix" || row2.rowType == "Total") {
                    return row1.metaRowIndex - row2.metaRowIndex;
                }
                var value1 = row1.data[colIndex][0], value2 = row2.data[colIndex][0];
                if (row2.bookmark === undefined) return -1;
                if (row1.bookmark === undefined) return 1;
                if (value1 == undefined && value2 == undefined) return 0;
                if (value1 !== undefined && value2 == undefined) return sortType === "asc" ? -1 : 1;
                if (value1 == undefined && value2 !== undefined) return sortType === "asc" ? 1 : -1;
                var editOpt = control.dataModel.colModel.cells[row1.cellKeys[colIndex]];

                var cellType = editOpt.editOptions.cellType;

                switch (cellType) {
                    case YIUI.CONTROLTYPE.DATEPICKER:
                    case YIUI.CONTROLTYPE.UTCDATEPICKER:
                    case YIUI.CONTROLTYPE.NUMBEREDITOR:
                        return sortType === "asc" ? value2 - value1 : value1 - value2;
                    case YIUI.CONTROLTYPE.TEXTEDITOR:
                        return sortType === "asc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                    default:
                        value1 = row1.data[colIndex][1];
                        value2 = row2.data[colIndex][1];
                        return sortType === "asc" ? value2.localeCompare(value1) : value1.localeCompare(value2);

                }
                return 1;
            });
            control.dataModel.data = data;
            control.refreshGrid();
        },
        /**
         * 单元格选中事件
         */
        doGridCellSelect: function (control, rowID, colIndex) {

        },
        doShiftRow: function (control, rowIndex, isUp) {
            var rowData = control.getRowDataAt(rowIndex);
            if (!rowData.isDetail || (rowData.isDetail && rowData.bookmark == null)) return;
            var preRowIndex = rowIndex - 1, nextRowIndex = rowIndex + 1;
            if ((isUp && preRowIndex < 0) || (!isUp && nextRowIndex >= control.getRowCount())) return;
            var preRowData = control.getRowDataAt(preRowIndex), nextRowData = control.getRowDataAt(nextRowIndex);
            if (isUp && (!preRowData.isDetail || (preRowData.isDetail && preRowData.bookmark == null))) return;
            if (!isUp && (!nextRowData.isDetail || (nextRowData.isDetail && nextRowData.bookmark == null))) return;
            this.doExchangeRow(control, rowIndex, isUp ? rowIndex - 1 : rowIndex + 1);
        },
        doExchangeRow: function (control, rowIndex, excRowIndex) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                row = control.getRowDataAt(rowIndex),
                excRow = control.getRowDataAt(excRowIndex);
            control.dataModel.data.splice(rowIndex, 1, excRow);
            control.dataModel.data.splice(excRowIndex, 1, row);
            control.el[0].deleteGridRow(rowIndex);
            control.el[0].insertGridRow(rowIndex, excRow);
            control.el[0].deleteGridRow(excRowIndex);
            control.el[0].insertGridRow(excRowIndex, row);
            $(control.el.getGridCellAt(excRowIndex + 1, control.el[0].p.selectCell)).click();
            this.dealWithSequence(form, control);
        },
        /**
         * 单元格值改变事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * newValue: 新的存储值
         * extParas: 其他参数
         */
        doCellValueChanged: function (control, rowID, colIndex, newValue) {
            var rowIndex = control.getRowIndexByID(rowID);
            control.setValueAt(rowIndex, colIndex, newValue, true, true);
        },
        /**
         * 表格粘贴事件
         */
        doCellPast: function (control, bgRowID, bgColIndex, copyText) {
            var rowInd = control.getRowIndexByID(bgRowID), rowV = copyText.split("\n");
            for (var i = 0, len = rowV.length; i < len; i++) {
                if (rowV[i] === "") continue;
                var rowIndex = rowInd + i;
                var cellV = rowV[i].split("\t"), cellVObj;
                for (var j = 0, clen = cellV.length; j < clen; j++) {
                    var iCol = bgColIndex + j, value = cellV[j];
                    if (iCol >= control.dataModel.colModel.columns.length) continue;
                    control.setValueAt(rowIndex, iCol, value, true, true);
                }
            }
        },
        doAllChecked: function (control, colIndex, newValue) {
            var len = control.dataModel.data.length;
            for (var i = 0; i < len; i++) {
                var rd = control.dataModel.data[i];
                if (rd.isDetail && rd.bookmark != undefined && rd.bookmark != null) {
                    control.setValueAt(i, colIndex, newValue, true, true);
                }
            }
        },

        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var def = $.Deferred();

            control.pageInfo.curPageIndex = pageIndex;

            if (control.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                def.resolve(control.reload());
            } else {
                var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                    filterMap = form.getFilterMap(), pageRowCount = control.pageInfo.pageRowCount,
                    startRi = pageIndex * pageRowCount, tableKey = control.tableKey;
                filterMap.setOID(form.getDocument().oid == undefined ? -1 : form.getDocument().oid);
                filterMap.getTblFilter(tableKey).startRow = startRi;
                filterMap.getTblFilter(tableKey).maxRows = pageRowCount;
                // var paras = {
                //     formKey: form.formKey,
                //     cmd: "gridgotopage",
                //     filterMap: $.toJSON(filterMap),
                //     gridKey: control.key,
                //     condition: $.toJSON(form.getCondParas()),
                //     formOptState: form.getOperationState()
                // };

                def = YIUI.UIUtil.getDocument(form).then(function(doc) {
                        console.log('goto page load data');
                        // form.setDocument(doc);

                        var dataTable = doc.getByKey(tableKey);

                        form.getDocument().setByKey(tableKey, dataTable);

                        var shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
                        var shadowTable = form.getDocument().getByKey(shadowTableKey);

                        if( shadowTable && control.pageInfo.pageLoadType == YIUI.PageLoadType.DB ) {
                            var data = result.data,row;
                            for( var i = 0, len = result.data.length; i < len; i++ ){
                               row = data[i];

                               if( row.bookmark === undefined || row.bookmark == null )
                                    continue;

                               dataTable.setByBkmk(row.bookmark);

                               var OID = dataTable.getByKey(YIUI.SystemField.OID_SYS_KEY),primaryKeys;
                               if( OID != null && OID != undefined ){
                                   primaryKeys = [YIUI.SystemField.OID_SYS_KEY];
                               } else {
                                   primaryKeys = control.primaryKeys;
                               }

                               var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                               if( pos != -1 ) {
                                   var v = shadowTable.getByKey(YIUI.DataUtil.System_SelectField_Key);
                                   row.data[control.selectFieldIndex][0] = v;  // value caption enable
                               }
                           }
                        }

                        var totalRowCount = startRi + YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
                        YIUI.TotalRowCountUtil.setRowCount(form.getDocument(), tableKey, totalRowCount);
                        // control.curPageIndex = pageIndex + 1;
                        control.reload();
                    });


//              if (control.pageInfo.pageLoadType == "UI") {
//                 paras.document = $.toJSON(YIUI.DataUtil.toJSONDoc(form.getDocument()));
//              }

                // var result = JSON.parse(Svr.SvrMgr.doGoToPage(paras)), dataTable;
                // if (result.dataTable) {
                //     dataTable = YIUI.DataUtil.fromJSONDataTable(result.dataTable);
                //     form.getDocument().setByKey(control.tableKey, dataTable);
                // } else {
                //     dataTable = form.getDocument().getByKey(control.tableKey);
                // }

                // 后台分页不考虑编辑,只处理选择字段的值
//                 var shadowTableKey = YIUI.DataUtil.getShadowTableKey(control.tableKey);
//                 var shadowTable = form.getDocument().getByKey(shadowTableKey);
//                 if( shadowTable && control.pageInfo.pageLoadType == YIUI.PageLoadType.DB ) {
//                     var data = result.data,row;
//                     for( var i = 0,len = result.data.length;i < len;i++ ){
//                        row = data[i];
//                        if( row.bookmark === undefined || row.bookmark == null )
//                         continue;
//                        dataTable.setByBkmk(row.bookmark);
//                        var OID = dataTable.getByKey(YIUI.SystemField.OID_SYS_KEY),primaryKeys;
//                        if( OID != null && OID != undefined ){
//                            primaryKeys = [YIUI.SystemField.OID_SYS_KEY];
//                        } else {
//                            primaryKeys = control.primaryKeys;
//                        }
//                        var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
//                        if( pos != -1 ) {
//                            var v = shadowTable.getByKey(YIUI.DataUtil.System_SelectField_Key);
//                            row.data[control.selectFieldIndex][0] = v;  // value caption enable
//                        }
//                    }
//                 }
//                 control.dataModel.data = result.data;
//                 control.errorInfoes = result.errorInfoes;
//                 control.pageInfo.totalPage = result.totalPage;
// //              control.pageInfo.currentPage = result.currentPage;
//                 control.rowIDMask = 0;
            }
            // control.initRowDatas();
            // control.refreshGrid({needCalc: control.pageInfo.pageLoadType == "DB"});
            if (control.pageInfo.pageLoadType == YIUI.PageLoadType.DB) {
                //如果是DB分页的情况，根据shadowTable中的行修改当前页的对应的行的值及显示数据。
//                YIUI.DataUtil.modifyDisplayValueByShadow(form.getDocument(), dataTable, control, result.data);
            }

            return def.promise();
        },
        /**
         * 跳转到首页
         */
        doGoToFirstPage: function (control, pageInfo) {
        },
        /**
         * 跳转到末页
         */
        doGoToLastPage: function (control, pageInfo) {
        },
        /**
         * 跳转到上一页
         */
        doGoToPrevPage: function (control, pageInfo) {
        },
        /**
         * 跳转到下一页
         */
        doGoToNextPage: function (control, pageInfo) {
        },
        /**
         * 表格中新增行事件
         */
        doInsertGridRow: function (control, rowID) {
            var ri = control.getRowIndexByID(rowID),
                rd = control.getRowDataByID(rowID),
                bookmark = parseInt(rd.bookmark, 10);
            if (!rd.isDetail || (isNaN(bookmark) && ri == (control.dataModel.data.length - 1))) return;
            var form = YIUI.FormStack.getForm(control.ofFormID);
            YIUI.SubDetailUtil.clearSubDetailData(form, control);
            control.addGridRow(ri,control.getDetailMetaRow(),null,0,true);
            var rowInsertContent = control.rowInsert === undefined ? "" : $.trim(control.rowInsert);
            var cxt = new View.Context(form);
            cxt.setRowIndex(ri);
            if (rowInsertContent) {
                form.eval(rowInsertContent, cxt, null);
            }
        },

        /**
         * 表格中删除行事件
         */
        doDeleteGridRow: function (control, rowID) {
            var ri = control.getRowIndexByID(rowID);
            var form = YIUI.FormStack.getForm(control.ofFormID);
            var callback = function () {
                control.clearAllSubDetailData(ri);
                var isDeleted = control.deleteGridRow(ri);
                if (isDeleted) {
                    form.getUIProcess().doPostDeleteRow(control);
                    var rowDeleteContent = control.rowDelete === undefined ? "" : $.trim(control.rowDelete);
                    var cxt = new View.Context(form);
                    cxt.setRowIndex(ri);
                    if (rowDeleteContent) {
                        form.eval(rowDeleteContent, cxt, null);
                    }
                }
            };
            if (control.hasSubDetailData(ri)) {
                var dialog = new YIUI.Yes_Dialog({msg: "清空子明细数据？", YesEvent: callback});
                dialog.show();
                var btns = $(".dlg-btn", dialog.el), btn;
                for (var i = 0; i < btns.length; i++) {
                    btn = $(btns[i]);
                    if (btn.attr("key") == YIUI.Dialog_Btn.STR_YES) {
                        btn.click(function () {
                            callback();
                        });
                    }
                    btn.click(function () {
                        dialog.close();
                    });
                }
            } else {
                callback();
            }
        },
        setCellValueToDocument: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex];
            switch (row.rowType) {
                case "Fix":
                    this.setFixValueToDoc(form, grid, rowIndex, colIndex, newValue);
                    break;
                case "Detail":
                    this.setDtlValueToDoc(form, grid, rowIndex, colIndex, newValue);
                    break;
            }
        },
        setNewValue: function (colKey, cEditOpt, dataTable, newValue) {
            if (dataTable == undefined || colKey == "")
                return;

            var editOpts = cEditOpt.editOptions, dataType;
            var cellType = editOpts.cellType;

            switch (cellType) {
                case YIUI.CONTROLTYPE.DYNAMICDICT:
                case YIUI.CONTROLTYPE.DICT:
                    if (newValue == null || newValue == undefined) {
                        if (editOpts.allowMultiSelection) {
                            dataTable.setByKey(colKey, null);
                        } else {
                            dataTable.setByKey(colKey, 0);
                        }
                        break;
                    }
                    if (editOpts.allowMultiSelection) {
                        var oids = [], itemKey = "";
                        if (editOpts.isCompDict) {
                            $.error($.ygrid.formatString($.ygrid.compDictNotDataBinding, cEditOpt.key))
                        }
                        for (var i = 0, len = newValue.length; i < len; i++) {
                            oids.push(newValue[i].oid);
                            oids.push(",");
                        }
                        if (oids && oids.length > 0) {
                            oids.pop();
                            itemKey = newValue[0].itemKey;
                        }
                        dataTable.setByKey(colKey, oids.join(""));
    
                    } else {
                        dataTable.setByKey(colKey, newValue.oid);
                    }
                
                    //动态字典设置ITEMKEY
                    if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                        dataTable.setByKey(colKey + "ItemKey", itemKey);
                    }

                    break;
                default:
                    dataType = dataTable.cols[dataTable.indexByKey(colKey)].type;
                    dataTable.setByKey(colKey, YIUI.Handler.convertValue(newValue, dataType));
                    break;
            }
        },
        newRow: function (form, grid, row, dataTable) {
            var cm, editOpt, cellV, dataType, cellType;
            dataTable.addRow(true);
            for (var i = 0, len = grid.dataModel.colModel.columns.length; i < len; i++) {
                cm = grid.dataModel.colModel.columns[i];
                editOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];

                if (editOpt == undefined 
                    || editOpt.columnKey === undefined 
                    || editOpt.columnKey === "") 
                    continue;

                cellV = row.data[i][0];
                cellType = editOpt.editOptions.cellType;

                if (cellType === YIUI.CONTROLTYPE.DICT && cellV !== null) {
                    if (editOpt.editOptions.multiSelect) {
                        var realV = [];
                        for (var n = 0, clen = cellV.length; n < clen; n++) {
                            realV.push(cellV[n].oid);
                            realV.push(",");
                        }
                        realV.pop();
                        cellV = realV.join("");
                    } else {
                        cellV = cellV.oid;
                    }
                }
                dataType = dataTable.cols[dataTable.indexByKey(editOpt.columnKey)].type;
                dataTable.setByKey(editOpt.columnKey, YIUI.Handler.convertValue(cellV, dataType));
            }
            return dataTable.getBkmk();
        },
        setFixValueToDoc: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex], cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[colIndex]],
                doc = form.getDocument(), dataTable, dataType, tableKey = cEditOpt.tableKey, colKey = cEditOpt.columnKey;
            if (doc == undefined || doc == null) return;
            if (tableKey == undefined || colKey == undefined) return;
            dataTable = doc.getByKey(tableKey);
            if (dataTable == undefined || dataTable == null) return;
            if (!dataTable.first()) {
                dataTable.addRow();
            }
            this.setNewValue(colKey, cEditOpt, dataTable, newValue);
        },
        selectRow: function (form, grid, rowIndex, colIndex, newValue) {
            var rd = grid.getRowDataAt(rowIndex), tableKey = grid.tableKey,
                doc = form.getDocument(), dataTable = doc.getByKey(tableKey),
                dataType = dataTable.cols[dataTable.indexByKey("SelectField")].type;
            if (rd.isDetail && rd.bookmark == undefined || doc == undefined || dataTable == undefined) return;
            if (grid.hasColExpand) {
                for (var i = 0, len = rd.bookmark.length; i < len; i++) {
                    var detailBkmk = rd.bookmark[i];
                    dataTable.setByBkmk(detailBkmk);
                    dataTable.setByKey(YIUI.DataUtil.System_SelectField_Key, YIUI.Handler.convertValue(newValue, dataType));
                }
            } else {
                if (grid.pageInfo.pageLoadType == YIUI.PageLoadType.DB) {
                    var shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
                    var shadowTable = doc.getByKey(shadowTableKey);
                    if (shadowTable == null || shadowTable == undefined) {
                        shadowTable = YIUI.DataUtil.newShadowDataTable(dataTable);
                        doc.add(shadowTableKey, shadowTable);
                    }
                    dataTable.setByBkmk(rd.bookmark);
                    if (dataTable.allRows[dataTable.pos].state == DataDef.R_New)
                        return;
                    var curOID = dataTable.getByKey(YIUI.DataUtil.System_OID_Key), primaryKeys;
                    if (curOID != null && curOID != undefined) {
                        primaryKeys = [YIUI.DataUtil.System_OID_Key];
                    } else {
                        primaryKeys = grid.primaryKeys;
                    }
                    var pos = YIUI.DataUtil.getPosByPrimaryKeys(dataTable, shadowTable, primaryKeys);
                    if (YIUI.TypeConvertor.toBoolean(newValue)) {
                        if (pos != -1) {
                            shadowTable.setPos(pos);
                        } else {
                            shadowTable.addRow();
                            for (var j = 0, clen = shadowTable.cols.length; j < clen; j++) {
                                shadowTable.set(j, dataTable.get(j));
                            }
                        }
                        shadowTable.setByKey(YIUI.DataUtil.System_SelectField_Key, 1);
                        shadowTable.allRows[shadowTable.pos].state = dataTable.allRows[dataTable.pos].state;
                    } else {
                        if (pos != -1) {
                            if (shadowTable.rows[pos].state == DataDef.R_Normal) {
                                shadowTable.rows[pos].state = DataDef.R_New;
                                shadowTable.delRow(pos);
                            } else {
                                shadowTable.setByKey(YIUI.DataUtil.System_SelectField_Key, 0);
                            }
                        }
                    }
                } else {
                    dataTable.setByBkmk(rd.bookmark);
                    dataTable.setByKey(YIUI.DataUtil.System_SelectField_Key, YIUI.Handler.convertValue(newValue, dataType));
                }
            }
        },
        setDtlValueToDoc: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.dataModel.data[rowIndex], cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[colIndex]],
                doc = form.getDocument(), dataTable, tableKey = cEditOpt.tableKey, colKey = cEditOpt.columnKey,
                metaRow = grid.getMetaObj().rows[row.metaRowIndex], metaCell = metaRow.cells[colIndex];
            if (grid.selectFieldIndex != -1 && grid.selectFieldIndex == colIndex) {
                this.selectRow(form, grid, rowIndex, colIndex, newValue);
            }
            if (doc == undefined || doc == null) return;
            if (tableKey == undefined || colKey == undefined) return;
            dataTable = doc.getByKey(tableKey);
            if (dataTable == undefined || dataTable == null) return;
            var oldTableSize = dataTable.getRowCount();
            if (row.isDetail && row.bookmark == undefined) {
                this.flushRow(form, grid, rowIndex);
            } else {
//                var shadowTable = null;
                if (grid.hasColExpand) {
                    if (metaCell.isColExpand) {
                        dataTable.setByBkmk(row.cellBkmks[colIndex]);
//                        shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                        this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                        this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                    } else {
                        for (var i = 0, len = row.bookmark.length; i < len; i++) {
                            dataTable.setByBkmk(row.bookmark[i]);
//                            shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                            this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                            this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                        }
                    }
                } else {
                    dataTable.setByBkmk(row.bookmark);
//                    shadowTable = YIUI.DataUtil.posWithShadowRow(grid, doc, dataTable);
                    this.setNewValue(colKey, cEditOpt, dataTable, newValue);
//                    this.setNewValue(colKey, cEditOpt, shadowTable, newValue);
                }
            }
            if (oldTableSize !== dataTable.getRowCount()) {
                this.dealWithSequence(form, grid);
            }
        },
        // 获取拓展的维度数据对应的key
        crossValKey:function(metaCell){
            var key = [];
            key.push(metaCell.columnArea);
            var crossValue = metaCell.crossValue;
            if( crossValue ) {
                for( var i = 0;i < crossValue.values.length;i++ ) {
                    var node = crossValue.values[i];
                    key.push(node.columnKey,node.dataType,node.value);
                }
            }
            return key.join("_");
        },
        flushRow: function (form, grid, rowIndex) {
            var row = grid.dataModel.data[rowIndex], tableKey = grid.tableKey,
                metaRow = grid.getMetaObj().rows[row.metaRowIndex],
                doc = form.getDocument(), dataTable = doc.getByKey(tableKey), rowBkmk;
            if (doc == undefined || doc == null) return;
            if (dataTable == undefined || dataTable == null) return;
            var viewRow;
            if (grid.hasColExpand) {
                rowBkmk = [];
                viewRow = new YIUI.ExpandRowBkmk(grid.getColumnExpandModel().length);
                var cell, metaCell, cEditOpt;
                for (var i = 0, len = row.data.length; i < len; i++) {
                    cell = row.data[i];
                    metaCell = metaRow.cells[i];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];
                    if (metaCell.isColExpand) {
                        var crossValue = metaCell.crossValue;
                        var areaIndex = metaCell.columnArea;

                        var detailViewRow = viewRow.getAtArea(areaIndex,crossValue);

                        if ( !detailViewRow ) {
                            dataTable.addRow(true);
                            rowBkmk.push(dataTable.getBkmk());
                            row.cellBkmks[i] = dataTable.getBkmk();

                            detailViewRow = new YIUI.DetailRowBkmk();
                            detailViewRow.setBookmark(dataTable.getBkmk());
                            viewRow.add(metaCell.columnArea,crossValue,detailViewRow);

                            //扩展数据赋值
                            var expInfo = grid.expandModel[metaCell.columnArea];
                            for (var k = 0, cLen = metaCell.crossValue.values.length; k < cLen; k++) {
                                var node = metaCell.crossValue.values[k];
                                var expKey = expInfo[k];
                                if (expKey !== undefined && expKey !== null && expKey.length > 0) {
                                    dataTable.setByKey(expKey, node.value);
                                }
                            }
                        } else {
                            row.cellBkmks[i] = detailViewRow.getBookmark();
                        }
                        //当前单元格赋值
                        this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, cell[0]);
                    }
                }
                for (var m = 0, eLen = viewRow.size(); m < eLen; m++) {
                    dataTable.setByBkmk(viewRow.getAt(m).getBookmark());
                    for (var n = 0, nLen = row.data.length; n < nLen; n++) {
                        metaCell = metaRow.cells[n];
                        cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[n]];
                        if (!metaCell.isColExpand && metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                            this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[n][0]);
                        }
                    }
                }
            } else {
                dataTable.addRow(true);
                rowBkmk = dataTable.getBkmk();
                for (var j = 0, jLen = row.data.length; j < jLen; j++) {
                    metaCell = metaRow.cells[j];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[j]];
                    if (metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                        this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[j][0]);
                    }
                }
                viewRow = new YIUI.DetailRowBkmk();
                viewRow.setBookmark(rowBkmk);
                if( grid.isSubDetail ) {
                    var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form,grid),
                    pRowIndex = parentGrid.getFocusRowIndex(), pRow = parentGrid.dataModel.data[pRowIndex];
                    dataTable.rows[dataTable.pos].parentBkmk = pRow.bookmark;
                }
            }
            row.bookmark = rowBkmk;
            row.bkmkRow = viewRow;
            return row;
        },

        showDetailRowData: function (form, grid, rowIndex) {
            var document = form.getDocument();
            if (document == null) return;
            var dataTable = document.getByKey(grid.tableKey);
            if (dataTable == null) return;
            var rowData = grid.getRowDataAt(rowIndex), rowbkmk = rowData.bkmkRow, firstRow = rowbkmk, expandRowBkmk;
            if (rowbkmk instanceof YIUI.ExpandRowBkmk) {
                expandRowBkmk = rowbkmk;
                firstRow = rowbkmk.getAt(0);
            }
            for (var i = 0, len = rowData.data.length; i < len; i++) {
                var metaCell = grid.getMetaObj().rows[rowData.metaRowIndex].cells[i], value;
                if (metaCell.hasDB) {
                    if (metaCell.isColExpand) {
                        var detailRowBkmk = expandRowBkmk.getAtArea(metaCell.columnArea, metaCell.crossValue);
                        if (detailRowBkmk != null) {
                            rowData.cellBkmks[i] = detailRowBkmk.getBookmark();
                            dataTable.setByBkmk(detailRowBkmk.getBookmark());
                            value = YIUI.UIUtil.getCompValue(metaCell, dataTable);

                            grid.setValueAt(rowIndex, i, value, false, false, true);
                        }
                    } else {
                        dataTable.setByBkmk(firstRow.getBookmark());
                        value = YIUI.UIUtil.getCompValue(metaCell, dataTable);

                        grid.setValueAt(rowIndex, i, value, false, false, true);
                    }
                } else if (metaCell.isSelect) {
                    //选择字段的一些处理
                } else if (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK) {

                    value = rowData.data[i][1];

                    grid.setValueAt(rowIndex, i, value, false, false, true);
                }
            }
        },

        copyRow: function (form, grid, rowIndex, splitKeys, splitValues, layer) {
            var dataTable = form.getDocument().getByKey(grid.tableKey),
                newRowIndex = rowIndex + 1;
            if (dataTable == undefined) return -1;
            var row = grid.getRowDataAt(rowIndex);
            if (row.isDetail && row.bookmark == undefined) return -1;
            var rd = grid.addGridRow(newRowIndex,grid.getDetailMetaRow(),null,0,true);
            if ( !rd.bookmark ) {
                rd = this.flushRow(form, grid, newRowIndex);
            }
            if (row.bookmark !== undefined) {
                var values = {}, OID = -1, tCol, value;
                dataTable.setByBkmk(row.bookmark);
                for (var i = 0, len = dataTable.cols.length; i < len; i++) {
                    tCol = dataTable.cols[i];
                    value = dataTable.get(i);
                    if (tCol.key.toLowerCase() == "oid" && value !== null) {
                        OID = value;
                    }
                    values[tCol.key] = value;
                }
                dataTable.setByBkmk(rd.bookmark);
                for (var ci = 0, clen = dataTable.cols.length; ci < clen; ci++) {
                    tCol = dataTable.cols[ci];
                    if (splitKeys.indexOf(tCol.key) >= 0) {
                        var dataType = dataTable.cols[dataTable.indexByKey(tCol.key)].type;
                        dataTable.set(ci, YIUI.Handler.convertValue(splitValues[splitKeys.indexOf(tCol.key)], dataType));
                    } else {
                        dataTable.set(ci, values[tCol.key]);
                    }
                    if (tCol.key.toLowerCase() == "oid") {
                        dataTable.set(ci, null);
                    }
                    if (tCol.key.toLowerCase() == "poid") {
                        dataTable.set(ci, OID);
                    }
                    if (tCol.key.toLowerCase() == "sequence") {
                        dataTable.set(ci, null);
                    }
                }
            }
            if (layer != -1) {
                dataTable.setByKey("Layer", layer);
            }
            dataTable.beforeFirst();
            grid.showDetailRow(newRowIndex);
            this.dealWithSequence(form, grid);
            return  newRowIndex;
        },
        /**
         *处理表格值变化时需要发生的相关事件
         */
        fireEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex],
                editOpt = grid.dataModel.colModel.cells[cellKey];

            // 触发事件
            form.getViewDataMonitor().fireCellValueChanged(grid, rowIndex, colIndex,cellKey);

            if ( grid.isEnable() && grid.newEmptyRow && editOpt && editOpt.columnKey ) {

                var index = grid.appendEmptyRow(rowIndex);

                if( !grid.getMetaObj().hideGroup4Editing && row.inAutoGroup ) {
                    for (var i = rowIndex - 1; i >= 0; i--) {
                        var pRow = grid.dataModel.data[i];
                        if (!pRow.inAutoGroup) break;
                        pRow.inAutoGroup = false;
                    }
                    row.inAutoGroup = false;
                    for (var ind = rowIndex + 1, len = grid.dataModel.data.length; ind < len; ind++) {
                        var nRow = grid.dataModel.data[ind];
                        if (!nRow.inAutoGroup) break;
                        nRow.inAutoGroup = false;
                    }
                    grid.appendEmptyGroup();
                }
            }
            var sr = grid.el[0].p.selectRow, sc = grid.el[0].p.selectCell;
            if ( sr && sc ) {
                grid.el.setGridParam({selectRow: sr, selectCell: sc});
            }
        },

        dealWithSequence: function (form, grid) {
            var SYS_SEQUENCE = "Sequence";
            if (grid.seqColumn == undefined) return;
            var row, bkmk, seq, curSeq = 0, dataTable = form.getDocument().getByKey(grid.tableKey);
            for (var i = 0, len = grid.dataModel.data.length; i < len; i++) {
                row = grid.dataModel.data[i];
                bkmk = row.bookmark;
                if (!row.isDetail || row.bookmark == undefined) continue;
                if (grid.hasColExpand) {
                    dataTable.setByBkmk(bkmk[0]);
                    seq = dataTable.getByKey(SYS_SEQUENCE);
                    if (seq == undefined || seq == null || seq <= curSeq) {
                        seq = curSeq + 1;
                        for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                            dataTable.setByBkmk(bkmk[j]);
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        }
                        curSeq = parseInt(seq);
                    }
                } else {
                    dataTable.setByBkmk(bkmk);
                    seq = dataTable.getByKey(SYS_SEQUENCE);
                    if (seq == undefined || seq == null || seq <= curSeq) {
                        seq = curSeq + 1;
                        dataTable.setByKey(SYS_SEQUENCE, seq);
                    }
                    curSeq = parseInt(seq);
                }
            }
        },
        dependedValueChange: function (grid, targetField, dependencyField, value) {
            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cellLocation = form.getCellLocation(targetField);
            if (grid.treeColIndex == cellLocation.column || grid.rowExpandIndex == cellLocation.column) { //树形表格重新加载数据
                this.reloadGridByFilter(grid, form, dependencyField, value);
            } else {
                if (cellLocation.row == null || cellLocation.row == -1) {
                    for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                        var row = grid.getRowDataAt(i);
                        if (row.isDetail && row.bookmark != null) {
                            Return.dependedValueChangeAt(grid, i, dependencyField, targetField, value);
                        }
                    }
                } else {
                    Return.dependedValueChangeAt(grid, cellLocation.row, dependencyField, targetField, value);
                }
            }
        },
        reloadGridByFilter: function (grid, form, dependencyField, value) {
            if (value == null) {
                value = form.getComponent(dependencyField).getValue();
                if (value instanceof YIUI.ItemData) {
                    value = value.oid;
                }
            }
            var jsonDoc = YIUI.DataUtil.toJSONDoc(form.getDocument());
            var params = {
                service: "PureGridOpt",
                cmd: "ReloadGridByFilter",
                document: $.toJSON(jsonDoc),
                formKey: form.getFormKey(),
                dependencyField: dependencyField,
                dependencyFieldValue: value
            };
            //TODO 处理数据需要重写
//            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
//            this.diffFromFormJson(grid, result.form);
        },
//        diffFromFormJson: function (grid, formJson) {
//            var block = formJson.body.items[formJson.body.index_of_block];
//            var getDiffJSON = function (items, gridKey) {
//                var item, result;
//                for (var i = 0, len = items.length; i < len; i++) {
//                    item = items[i];
//                    if (item.metaObj != null && item.metaObj.key == gridKey) {
//                        result = item;
//                        break;
//                    } else {
//                        if (item.items != null && item.items.length > 0) {
//                            result = getDiffJSON(item.items, gridKey);
//                        }
//                        if (result != null)
//                            break;
//                    }
//                }
//                return result;
//            };
//            var gridDiffJson = getDiffJSON(block.rootPanel.items, grid.key);
//            grid.diff(gridDiffJson);
//        },
        doPostCellValueChanged: function (grid, rowIndex, dependencyField, targetField, value) {
            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                comp = form.getComponent(targetField);
            if (comp != null) {
                comp.dependedValueChange(dependencyField)
            } else {
                Return.dependedValueChangeAt(grid, rowIndex, dependencyField, targetField, value);
            }
        },
        dependedValueChangeAt: function (grid, rowIndex, dependencyField, targetField, value) {
            var row = grid.getRowDataAt(rowIndex), metaRow = grid.getMetaObj().rows[row.metaRowIndex];
            var updateDynamicCell = function (cell, cellTypeDef, editOpt, rowData, rowIndex, cellIndex) {
                if (cellTypeDef.options.isAlwaysShow) {
                    var iRow = rowIndex + 1, iCol = grid.getMetaObj().showRowHead ? cellIndex + 1 : cellIndex, cm = grid.dataModel.colModel[iCol],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: rowIndex, key: cm.name, id: iRow + "_" + cm.name, name: cm.name}),
                        gRow = grid.el.getGridRowAt(iRow);
                    grid.alwaysShowCellEditor(cell, iRow, iCol, cm, [null, "", cell.enable], opt, gRow.offsetHeight);
                }
            };
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i], editOpt = grid.dataModel.colModel.cells[metaCell.key];
                if (metaCell.key == targetField) {
                    if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                        var cell = grid.el.getGridCellAt(rowIndex + 1, grid.getMetaObj().showRowHead ? i + 1 : i),
                            cellTypeDef = cell.cellTypeDef;
                        if (cellTypeDef != null) {
                            var newOpt = $.extend(true, {}, editOpt), newOptions = $.extend(true, cellTypeDef.options, editOpt.editOptions);
                            newOpt.editOptions = newOptions;
                            Return.dependencyValueChangedByType(grid, cellTypeDef.type, newOpt, rowIndex, i, dependencyField, value);
                            updateDynamicCell(cell, cellTypeDef, rowIndex, i);
                        }
                    } else {
                        Return.dependencyValueChangedByType(grid, metaCell.cellType, editOpt, rowIndex, i, dependencyField, value);
                    }
                }
            }
        },
        dependencyValueChangedByType: function (grid, cellType, editOpt, rowIndex, colIndex, dependencyField, value) {
            var formID = grid.ofFormID, form = YIUI.FormStack.getForm(formID);
            var meta = editOpt.editOptions;

            if (cellType == YIUI.CONTROLTYPE.DICT || cellType == YIUI.CONTROLTYPE.COMPDICT || cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                var needRebuild = false;

                if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                    var refKey = meta.refKey;
                    if (refKey == dependencyField) {

                        needRebuild = true;
                    }
                }

                if(!needRebuild){
                    var root = meta.root;
                    if (root == dependencyField) {
                        needRebuild = true;
                    }
                }

                if(!needRebuild){
                    // var dictFilter = editOpt.dictFilter;
                    // if (dictFilter != null) {
                    //     var filterDependency = dictFilter.dependency;
                    //     if (filterDependency != null && filterDependency.indexOf(dependencyField) >= 0) {
                    //         grid.setValueAt(rowIndex, colIndex, value, true, true);
                    //     }
                    // } else {

                        //TODO 优化性能， 每次计算当前filter比较慢，特别是条件中含中间层访问的，可能需要模型中缓存字典类型的filter
                        var filter = YIUI.DictHandler.getMetaFilter(form, editOpt.key, meta.itemFilters, meta.itemKey);
                        if(filter){
                            needRebuild = true;
                        }
                        // var curFilter = YIUI.DictHandler.getFilter(form, editOpt.key, editOpt.editOptions.itemFilters, editOpt.editOptions.itemKey);
                        // if (curFilter != null) {
                        //     grid.setValueAt(rowIndex, colIndex, value, true, true);
                        // }
                    // }
                }

                if(needRebuild){
                    grid.setValueAt(rowIndex, colIndex, value, true, true);
                }
            } else if (cellType == YIUI.CONTROLTYPE.COMBOBOX || cellType == YIUI.CONTROLTYPE.CHECKLISTBOX) {
                // var dependedFields = editOpt.editOptions.dependedFields;
                // if (dependedFields.indexOf(dependencyField) >= 0) {

                //下拉框来源无条件区分，所以只要记录依赖，直接清值
                grid.setValueAt(rowIndex, colIndex, value, true, true);
                // editOpt.needRebuild = true;
                // }
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();