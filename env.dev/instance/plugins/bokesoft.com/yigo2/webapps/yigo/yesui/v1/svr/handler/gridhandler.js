YIUI.GridHandler = (function () {
    var Return = {
        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (control, rowID, colIndex, value) {
            var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                rowData = control.getRowDataByID(rowID), rowIndex = control.getRowIndexByID(rowID),
                cellKey = rowData.cellKeys[colIndex],
                editOpt = control.getColInfoByKey(cellKey)[0].cell;
            switch (editOpt.edittype) {
            case "button":
            case "hyperLink":
            case "image":
            case "textButton":
                if (editOpt.editOptions.onclick) {
                    form.eval($.trim(editOpt.editOptions.onclick), {form: form, rowIndex: rowIndex}, null);
                }
                break;
            case "checkBox":
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
        doOnRowClick: function (control, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                clickContent = control.rowClick === undefined ? "" : $.trim(control.rowClick);
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        /**
         * 表格行双击事件                      //  TODO rowID
         */
        doOnRowDblClick: function (control, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                clickContent = control.rowDblClick === undefined ? "" : $.trim(control.rowDblClick);
            var cxt = {form: form, rowIndex: rowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
        },
        /**
         * 表格行焦点变化
         */
        doOnFocusRowChange: function (control, oldRowID, rowID) {
            var formID = control.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                rowIndex = control.getRowIndexByID(rowID),
                oldRowIndex = control.getRowIndexByID(oldRowID),
                clickContent = control.focusRowChanged === undefined ? "" : $.trim(control.focusRowChanged);
            var cxt = {form: form, newRowIndex: rowIndex, oldRowIndex: oldRowIndex};
            if (clickContent) {
                form.eval(clickContent, cxt, null);
            }
            YIUI.SubDetailUtil.showSubDetailData(control, rowIndex);
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
                switch (editOpt.edittype) {
                    case "datePicker":
                    case "numberEditor":
                        return sortType === "asc" ? value2 - value1 : value1 - value2;
                    case "textEditor":
                        return sortType === "asc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                    case "comboBox":
                    case "dict":
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
            control.setValueAt(rowIndex, colIndex, newValue, true, true, true);
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
                    control.setValueAt(rowIndex, iCol, value, true, true, false);
                }
            }
        },
        doAllChecked: function (control, colIndex, newValue) {
            var len = control.dataModel.data.length;
            for (var i = 0; i < len; i++) {
                var rd = control.dataModel.data[i];
                if (rd.isDetail && rd.bookmark != undefined && rd.bookmark != null) {
                    control.setValueAt(i, colIndex, newValue, true, true, false);
                }
            }
        },

        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageInfo) {
            pageInfo = JSON.parse(pageInfo);
            var curPageIndex = control.pageInfo.currentPage, rowIndex = -1;
            if (pageInfo.optType == "firstPage") {
                control.pageInfo.currentPage = 1;
            } else if (pageInfo.optType == "prevPage") {
                control.pageInfo.currentPage = curPageIndex - 1;
            } else if (pageInfo.optType == "nextPage") {
                control.pageInfo.currentPage = curPageIndex + 1;
            } else if (pageInfo.optType == "lastPage") {
                control.pageInfo.currentPage = control.pageInfo.totalPage;
            } else if (pageInfo.optType == "turnToPage") {
                control.pageInfo.currentPage = pageInfo.pageIndex;
            }
            if (control.pageInfo.pageLoadType == "UI") {
                control.reload();
            } else {
                var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                    filterMap = form.getFilterMap(),
                    startRi = (control.pageInfo.currentPage - 1) * control.pageInfo.pageRowCount;
                filterMap.setOID(form.getDocument().oid == undefined ? -1 : form.getDocument().oid);
                filterMap.getTblFilter(control.tableKey).startRow = startRi;
                filterMap.getTblFilter(control.tableKey).maxRows = control.pageInfo.pageRowCount;
                
                var parameters = form != null ? form.getParas() : null;
                var paras = {
                    formKey: form.formKey,
                    cmd: "gridgotopage",
                    filterMap: $.toJSON(filterMap),
                    gridKey: control.key,
                    parameters: parameters.toJSON(),
                    condition: $.toJSON(form.getCondParas()),
                    formOptState: form.getOperationState()
                };
//              if (control.pageInfo.pageLoadType == "UI") {
//                 paras.document = $.toJSON(YIUI.DataUtil.toJSONDoc(form.getDocument()));
//              }
                var result = JSON.parse(Svr.SvrMgr.doGoToPage(paras)), dataTable;
                if (result.dataTable) {
                    dataTable = YIUI.DataUtil.fromJSONDataTable(result.dataTable);
                    form.getDocument().setByKey(control.tableKey, dataTable);
                } else {
                    dataTable = form.getDocument().getByKey(control.tableKey);
                }
                // 后台分页不考虑编辑,只处理选择字段的值
                var shadowTableKey = YIUI.DataUtil.getShadowTableKey(control.tableKey);
                var shadowTable = form.getDocument().getByKey(shadowTableKey);
                if( shadowTable && control.pageInfo.pageLoadType == "DB" ) {
                    var data = result.data,row;
                    for( var i = 0,len = result.data.length;i < len;i++ ){
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
                control.dataModel.data = result.data;
                control.errorInfoes = result.errorInfoes;
                control.pageInfo.totalPage = result.totalPage;
//              control.pageInfo.currentPage = result.currentPage;
                control.rowIDMask = 0;
            }
            control.initRowDatas();
            control.refreshGrid({needCalc: control.pageInfo.pageLoadType == "DB"});
            if (control.pageInfo.pageLoadType == "DB") {
                //如果是DB分页的情况，根据shadowTable中的行修改当前页的对应的行的值及显示数据。
//                YIUI.DataUtil.modifyDisplayValueByShadow(form.getDocument(), dataTable, control, result.data);
            }
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
            control.addGridRow(null, ri);
            var rowInsertContent = control.rowInsert === undefined ? "" : $.trim(control.rowInsert);
            var cxt = {form: form, rowIndex: ri};
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
                    form.getUIProcess().doPostDeleteRow(control, ri);
                    var rowDeleteContent = control.rowDelete === undefined ? "" : $.trim(control.rowDelete);
                    var cxt = {form: form, rowIndex: ri};
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
            if (dataTable == undefined || colKey == "") return;
            var editOpts = cEditOpt.editOptions, dataType;
            switch (cEditOpt.edittype) {
                case "dict":
                    if (newValue == null || newValue == undefined) {
                        if (editOpts.multiSelect) {
                            dataTable.setByKey(colKey, null);
                        } else {
                            dataTable.setByKey(colKey, 0);
                        }
                        break;
                    }
                    if (editOpts.multiSelect) {
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
                        if (editOpts.isDynamic) {
                            dataTable.setByKey(colKey + "ItemKey", itemKey);
                        }
                    } else {
                        dataTable.setByKey(colKey, newValue.oid);
                        if (editOpts.isCompDict || editOpts.isDynamic) {
                            dataTable.setByKey(colKey + "ItemKey", newValue.itemKey);
                        }
                    }
                    break;
                default:
                    dataType = dataTable.cols[dataTable.indexByKey(colKey)].type;
                    dataTable.setByKey(colKey, YIUI.Handler.convertValue(newValue, dataType));
                    break;
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
        newRow: function (form, grid, row, dataTable) {
            var cm, editOpt, cellV, dataType;
            dataTable.addRow(true);
            for (var i = 0, len = grid.dataModel.colModel.columns.length; i < len; i++) {
                cm = grid.dataModel.colModel.columns[i];
                editOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];
                if (editOpt == undefined || editOpt.columnKey === undefined || editOpt.columnKey === "") continue;
                cellV = row.data[i][0];
                if (editOpt.edittype === "dict" && cellV !== null) {
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
                if (grid.pageInfo.pageLoadType == "DB") {
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
                dtlRowIndex = grid.metaRowInfo.dtlRowIndex, metaRow = grid.metaRowInfo.rows[dtlRowIndex], metaCell = metaRow.cells[colIndex];
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
        flushRow: function (form, grid, rowIndex) {
            var row = grid.dataModel.data[rowIndex], tableKey = grid.tableKey,
                dtlRowIndex = grid.metaRowInfo.dtlRowIndex, metaRow = grid.metaRowInfo.rows[dtlRowIndex],
                doc = form.getDocument(), dataTable = doc.getByKey(tableKey), rowBkmk;
            if (doc == undefined || doc == null) return;
            if (dataTable == undefined || dataTable == null) return;

            if (grid.hasColExpand) {
                rowBkmk = [];
                var cell, metaCell, newBkmk, cEditOpt, colExpandMap = {};
                for (var i = 0, len = row.data.length; i < len; i++) {
                    cell = row.data[i];
                    metaCell = metaRow.cells[i];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[i]];
                    if (metaCell.isColExpand) {
                        var key = this.crossValKey(metaCell);
                        newBkmk = colExpandMap[key];
                        if (newBkmk == undefined || newBkmk == null) {
                            newBkmk = this.newRow(form, grid, row, dataTable);
                            rowBkmk.push(newBkmk);
                            row.cellBkmks[i] = newBkmk;
                            colExpandMap[key] = newBkmk;
                            this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, cell[0]);
                            var expInfo = grid.expandModel[metaCell.columnArea];
                            for (var k = 0, cLen = metaCell.crossValue.values.length; k < cLen; k++) {
                                var node = metaCell.crossValue.values[k];
                                var expKey = expInfo[k];
                                if (expKey !== undefined && expKey !== null && expKey.length > 0) {
                                    dataTable.setByKey(expKey, node.value);
                                }
                            }
                        } else {
                            row.cellBkmks[i] = newBkmk;
                        }
                    }
                }
                for (var m = 0, eLen = rowBkmk.length; m < eLen; m++) {
                    dataTable.setByBkmk(rowBkmk[m]);
                    for (var n = 0, nLen = row.data.length; n < nLen; n++) {
                        metaCell = metaRow.cells[n];
                        cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[n]];
                        if (!metaCell.isColExpand && metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                            this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[n][0]);
                        }
                    }
                }
            } else {
                rowBkmk = this.newRow(form, grid, row, dataTable);
                dataTable.setByBkmk(rowBkmk);
                for (var j = 0, jLen = row.data.length; j < jLen; j++) {
                    metaCell = metaRow.cells[j];
                    cEditOpt = grid.dataModel.colModel.cells[row.cellKeys[j]];
                    if (metaCell.columnKey != undefined && metaCell.columnKey.length > 0) {
                        this.setNewValue(metaCell.columnKey, cEditOpt, dataTable, row.data[j][0]);
                    }
                }
                if (grid.parentGrid && grid.parentGrid.length > 0) {
                    var parentGrid = form.getComponent(grid.parentGrid),
                        pRowIndex = parentGrid.getFocusRowIndex(),
                        pRow = parentGrid.dataModel.data[pRowIndex];
                    dataTable.rows[dataTable.pos].parentBkmk = pRow.bookmark;
                }
            }
            row.bookmark = rowBkmk;
            YIUI.SubDetailUtil.showSubDetailData(grid, rowIndex);
            return row;
        },
        showDetailRowData: function (form, grid, rowIndex, calcRow) {
            var document = form.getDocument();
            if (document == null) return;
            var dataTable = document.getByKey(grid.tableKey);
            if (dataTable == null) return;
            var gridData = grid.getRowDataAt(rowIndex), rowbkmk = gridData.bkmkRow, firstRow = rowbkmk, expandRowBkmk;
            if (rowbkmk instanceof YIUI.ExpandRowBkmk) {
                expandRowBkmk = rowbkmk;
                firstRow = rowbkmk.getAt(0);
            }
            for (var i = 0, len = gridData.data.length; i < len; i++) {
                var metaCell = grid.getMetaObj().rows[gridData.metaRowIndex].cells[i], value;
                if (metaCell.hasDB) {
                    if (metaCell.isColExpand) {
                        var detailRowBkmk = expandRowBkmk.getAtArea(metaCell.columnArea, metaCell.crossValue);
                        if (detailRowBkmk != null) {
                            gridData.cellBkmks[i] = detailRowBkmk.getBookmark();
                            dataTable.setByBkmk(detailRowBkmk.getBookmark());
                            value = YIUI.UIUtil.getCompValue(metaCell, dataTable);
                            gridData.data[i] = grid.getCellNeedValue(rowIndex, i, value, true);
                        }
                    } else {
                        dataTable.setByBkmk(firstRow.getBookmark());
                        value = YIUI.UIUtil.getCompValue(metaCell, dataTable);
                        gridData.data[i] = grid.getCellNeedValue(rowIndex, i, value, true);
                    }
                } else if (metaCell.isSelect) {
                    //选择字段的一些处理
                } else if (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK) {
                    gridData.data[i] = grid.getCellNeedValue(rowIndex, i, metaCell.caption, true);
                }
            }
            if (calcRow) {
                form.getUIProcess().doPostInsertRow(grid, rowIndex);
            }
        },

        copyRow: function (form, grid, rowIndex, splitKeys, splitValues, layer) {
            var dataTable = form.getDocument().getByKey(grid.tableKey),
                newRowIndex = rowIndex + 1;
            if (dataTable == undefined) return -1;
            var row = grid.getRowDataAt(rowIndex);
            if (row.isDetail && row.bookmark == undefined) return -1;
            var rd = grid.addGridRow(null, newRowIndex, false);
            if (rd.bookmark == undefined) {
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
            grid.showDetailRow(newRowIndex, false);
            this.dealWithSequence(form, grid);
            return  newRowIndex;
        },
        /**
         *处理表格值变化时需要发生的相关事件
         */
        fireCellChangeEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex],
                editOpt = grid.dataModel.colModel.cells[cellKey];
 //           meatRow = grid.metaRowInfo.rows[row.metaRowIndex];
//            var cellCEvent = meatRow.cells[colIndex].valueChanged;
//            if (cellCEvent !== undefined && cellCEvent.length > 0) {
//                form.eval($.trim(cellCEvent), {form: form, rowIndex: rowIndex}, null);
//            }
//            form.uiProcess.doCellValueChanged(grid, rowIndex, colIndex, cellKey);
            form.getViewDataMonitor().fireCellValueChanged(grid, rowIndex, colIndex,cellKey);
             // 先在这里算,后面改之   TODO
            YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);
            if (editOpt == undefined || editOpt.columnKey === undefined || editOpt.columnKey.length == 0 || !grid.isEnable()) return;
            var nextRow = grid.dataModel.data[rowIndex + 1];
            if (!row.isDetail) return;
            var sr = grid.el[0].p.selectRow, sc = grid.el[0].p.selectCell;
            if ((nextRow === undefined || !nextRow.isDetail) && grid.newEmptyRow && !grid.hasRowExpand && (grid.treeColIndex == null || grid.treeColIndex == -1)) {
                if (grid.hasGroupRow) {
                    if (row.inAutoGroup) {
                        var pRow, nRow;
                        for (var i = rowIndex - 1; i >= 0; i--) {
                            pRow = grid.dataModel.data[i];
                            if (!pRow.inAutoGroup) break;
                            pRow.inAutoGroup = false;
                        }
                        row.inAutoGroup = false;
                        for (var ind = rowIndex + 1, len = grid.dataModel.data.length; ind < len; ind++) {
                            nRow = grid.dataModel.data[ind];
                            if (!nRow.inAutoGroup) break;
                            nRow.inAutoGroup = false;
                        }
                        grid.appendAutoRowAndGroup();
                    } else {
                        grid.addGridRow(null, rowIndex + 1);
                    }
                } else {
                    grid.addGridRow();
                }
            }
            if (sr !== undefined && sc !== undefined) {
                grid.el.setGridParam({selectRow: sr, selectCell: sc});
            }
        },
        /**
         *处理表格值变化后需要发生的相关事件
         */
        doPostCellChangeEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex];
            form.uiProcess.doPostCellValueChanged(grid, rowIndex, colIndex, cellKey);
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
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
            this.diffFromFormJson(grid, result.form);
        },
        diffFromFormJson: function (grid, formJson) {
            var block = formJson.body.items[formJson.body.index_of_block];
            var getDiffJSON = function (items, gridKey) {
                var item, result;
                for (var i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if (item.metaObj != null && item.metaObj.key == gridKey) {
                        result = item;
                        break;
                    } else {
                        if (item.items != null && item.items.length > 0) {
                            result = getDiffJSON(item.items, gridKey);
                        }
                        if (result != null)
                            break;
                    }
                }
                return result;
            };
            var gridDiffJson = getDiffJSON(block.rootPanel.items, grid.key);
            grid.diff(gridDiffJson);
        },
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
            var row = grid.getRowDataAt(rowIndex), metaRow = grid.metaRowInfo.rows[row.metaRowIndex];
            var updateDynamicCell = function (cell, cellTypeDef, editOpt, rowData, rowIndex, cellIndex) {
                if (cellTypeDef.options.isAlwaysShow) {
                    var iRow = rowIndex + 1, iCol = grid.showRowHead ? cellIndex + 1 : cellIndex, cm = grid.dataModel.colModel[iCol],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: rowIndex, key: cm.name, id: iRow + "_" + cm.name, name: cm.name}),
                        gRow = grid.el.getGridRowAt(iRow);
                    grid.alwaysShowCellEditor(cell, iRow, iCol, cm, [null, "", cell.enable], opt, gRow.offsetHeight);
                }
            };
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i], editOpt = grid.dataModel.colModel.cells[metaCell.key];
                if (metaCell.key == targetField) {
                    if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                        var cell = grid.el.getGridCellAt(rowIndex + 1, grid.showRowHead ? i + 1 : i),
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
            if (cellType == YIUI.CONTROLTYPE.DICT || cellType == YIUI.CONTROLTYPE.COMPDICT || cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                if (editOpt.editOptions.isDynamic) {
                    var refKey = editOpt.editOptions.refKey;
                    if (refKey == dependencyField) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                        return;
                    }
                }
                var root = editOpt.editOptions.root;
                if (root == dependencyField) {
                    grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    return;
                }
                var dictFilter = editOpt.dictFilter;
                if (dictFilter != null) {
                    var filterDependency = dictFilter.dependency;
                    if (filterDependency != null && filterDependency.indexOf(dependencyField) >= 0) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                        editOpt.needRefreshFilter = true;
                    }
                } else {
                    var curFilter = YIUI.DictHandler.getFilter(form, editOpt.key, editOpt.editOptions.itemFilters, editOpt.editOptions.itemKey);
                    if (curFilter != null) {
                        grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    }
                }
            } else if (cellType == YIUI.CONTROLTYPE.COMBOBOX || cellType == YIUI.CONTROLTYPE.CHECKLISTBOX) {
                var dependedFields = editOpt.editOptions.dependedFields;
                if (dependedFields.indexOf(dependencyField) >= 0) {
                    grid.setValueAt(rowIndex, colIndex, value, true, true, true);
                    editOpt.needRebuild = true;
                }
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();