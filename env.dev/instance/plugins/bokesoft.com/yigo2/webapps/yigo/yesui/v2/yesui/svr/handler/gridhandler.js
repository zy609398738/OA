YIUI.GridHandler = (function () {
    var Return = {
        /**
         * 单元格单击事件,用于表格的button , hyperlink等
         */
        doOnCellClick: function (grid, rowIndex, colIndex, value) {
            var form = YIUI.FormStack.getForm(grid.ofFormID),
                rowData = grid.getRowDataAt(rowIndex),
                editOpt = grid.getMetaObj().rows[rowData.metaRowIndex].cells[colIndex];

            switch (editOpt.editOptions.cellType) {
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
         * 单元格双击事件
         */
        doOnCellDblClick: function (grid, rowIndex, colIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                metaCell = grid.getMetaObj().rows[rowData.metaRowIndex].cells[colIndex];

            var cellDblClick = metaCell.cellDblClick;

            if( cellDblClick ) {
                var formID = grid.ofFormID,
                    form = YIUI.FormStack.getForm(formID);
                var cxt = new View.Context(form);

                cxt.setRowIndex(rowIndex);
                cxt.setColIndex(colIndex);

                form.eval(cellDblClick, cxt, null);
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

            var form = YIUI.FormStack.getForm(grid.ofFormID);

            form.getUIProcess().doAfterRowChanged(grid);

            var rowChanged = grid.getMetaObj().focusRowChanged;

            if( rowChanged ) {
                var cxt = new View.Context(form);
                cxt.setRowIndex(newRowIndex);
                form.eval(rowChanged, cxt, null);
            }
        },

        /**
         * 表格排序事件
         */
        doOnSortClick: function (grid, colIndex, sortType) {
            grid.dataModel.data.sort(function (row1, row2) {
                if (row1.rowType == "Fix" || row1.rowType == "Total" || row2.rowType == "Fix" || row2.rowType == "Total") {
                    return row1.metaRowIndex - row2.metaRowIndex;
                }
                var value1 = row1.data[colIndex][0], value2 = row2.data[colIndex][0];
                if (row2.bookmark === undefined) return -1;
                if (row1.bookmark === undefined) return 1;
                if (value1 == undefined && value2 == undefined) return 0;
                if (value1 !== undefined && value2 == undefined) return sortType === "asc" ? -1 : 1;
                if (value1 == undefined && value2 !== undefined) return sortType === "asc" ? 1 : -1;

                var editOpt = grid.getCellEditOpt(row1.cellKeys[colIndex]);

                switch (editOpt.editOptions.cellType) {
                case YIUI.CONTROLTYPE.DATEPICKER:
                case YIUI.CONTROLTYPE.UTCDATEPICKER:
                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                    return sortType === "desc" ? value2 - value1 : value1 - value2;
                case YIUI.CONTROLTYPE.TEXTEDITOR:
                    return sortType === "desc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                default:
                    value1 = row1.data[colIndex][1],value2 = row2.data[colIndex][1];
                    return sortType === "desc" ? value2.localeCompare(value1) : value1.localeCompare(value2);
                }
                return 1;
            });
            grid.refreshGrid();
        },

        /**
         * 单元格选中事件
         */
        doGridCellSelect: function (control, rowID, colIndex) {

        },

        doShiftUpRow: function (control, rowIndex) {
            if(rowIndex <= 0){
                return;
            }

            var rowData = control.getRowDataAt(rowIndex);

            if(rowData.bookmark == null ||rowData.rowType != "Detail"){
                return;
            }

            rowData = control.getRowDataAt(rowIndex - 1);

            if (rowData.bookmark == null || rowData.rowType != "Detail"){
                return;
            }
            this.doExchangeRow(control, rowIndex, rowIndex - 1);
        },

        doShiftDownRow: function (control, rowIndex) {
            if(rowIndex == control.getRowCount() - 1){
                return;
            }

            var rowData = control.getRowDataAt(rowIndex);

            if(rowData.bookmark == null ||rowData.rowType != "Detail"){
                return;
            }

            if(rowIndex + 1 == control.getRowCount() - 1){
                rowData = control.getRowDataAt(rowIndex + 1);
                if(rowData.bookmark == null || rowData.rowType != "Detail"){
                    return; 
                }
            }

            this.doExchangeRow(control, rowIndex, rowIndex + 1);
        },

        doExchangeRow: function (grid, rowIndex, excIndex) {
            var row = grid.getRowDataAt(rowIndex),
                excRow = grid.getRowDataAt(excIndex);

            grid.dataModel.data.splice(rowIndex, 1, excRow);
            grid.dataModel.data.splice(excIndex, 1, row);

            this.exchangeRowSequence(grid,rowIndex,excIndex);

            grid.el.exchangeRow(rowIndex,excIndex);
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

        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var def = $.Deferred();

            control.pageInfo.curPageIndex = pageIndex;

            if (control.getMetaObj().pageLoadType == YIUI.PageLoadType.UI) {
                def.resolve(control.load(false));
            } else {
                var formID = control.ofFormID, form = YIUI.FormStack.getForm(formID),
                    filterMap = form.getFilterMap(), pageRowCount = control.pageInfo.pageRowCount,
                    startRi = pageIndex * pageRowCount, tableKey = control.tableKey;
                filterMap.setOID(form.getDocument().oid == undefined ? -1 : form.getDocument().oid);
                filterMap.getTblFilter(tableKey).startRow = startRi;
                filterMap.getTblFilter(tableKey).maxRows = pageRowCount;
                def = YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
                        .then(function(doc){

                            var dataTable = doc.getByKey(tableKey);

                            form.getDocument().setByKey(tableKey, dataTable);

                            var totalRowCount = startRi + YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
                            YIUI.TotalRowCountUtil.setRowCount(form.getDocument(), tableKey, totalRowCount);
                            control.load(false);
                        });
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
        rowInsert: function (grid, rowIndex, fireEvent) {
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            var rowData = grid.getRowDataAt(rowIndex);
            if( rowData.rowType !== 'Detail' || !fireEvent )
                return;

            form.getUIProcess().doPostInsertRow(grid, rowIndex, YIUI.GridUtil.isEmptyRow(rowData));

            var rowInsert = grid.getMetaObj().rowInsert;
            if ( rowInsert ) {
                var cxt = new View.Context(form);
                cxt.setRowIndex(rowIndex);
                form.eval(rowInsert, cxt, null);
            }
        },

        /**
         * 表格中删除行事件
         */
        rowDelete: function (form, grid, rowIndex) {

            grid.refreshSelectAll();

            YIUI.GridLookupUtil.updateFixPos(form,grid);

            form.getUIProcess().doPostDeleteRow(grid);

            var metaObj = grid.getMetaObj();
            if(metaObj.serialSeq) {
                this.dealWithSequence(form, grid, rowIndex);
            }

            if (metaObj.rowDelete) {
                var cxt = new View.Context(form);
                form.eval(metaObj.rowDelete, cxt, null);
            }
        },

        rowDeleteAll:function (form,grid) {

            grid.refreshSelectAll();

            YIUI.GridLookupUtil.updateFixPos(form,grid);

            form.getUIProcess().doPostDeleteRow(grid);
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
        setCellValueToDataTable: function (metaCell, dataTable, newValue) {
            var colKey = metaCell.columnKey;

            if ( !colKey )
                return;

            var cellType = metaCell.cellType,
                editOpt = metaCell.editOptions;

            switch (cellType) {
                case YIUI.CONTROLTYPE.DYNAMICDICT:
                case YIUI.CONTROLTYPE.DICT:
                    if (newValue == null || newValue == undefined) {
                        if (editOpt.allowMultiSelection) {
                            dataTable.setByKey(colKey, null);
                        } else {
                            dataTable.setByKey(colKey, 0);
                        }
                        break;
                    }
                    if (editOpt.allowMultiSelection) {
                        var oids = [], itemKey = "";
                        if (editOpt.isCompDict) {
                            $.error($.ygrid.formatString($.ygrid.compDictNotDataBinding, metaCell.key))
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
                        if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                            dataTable.setByKey(colKey + "ItemKey", itemKey);
                        }
                    } else {
                        dataTable.setByKey(colKey, newValue.oid);
                        if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT || cellType == YIUI.CONTROLTYPE.COMPDICT ) {
                            dataTable.setByKey(colKey + "ItemKey", newValue.itemKey);
                        }
                    }
                    break;
                default:
                    var dataType = dataTable.cols[dataTable.indexByKey(colKey)].type;
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
            var row = grid.dataModel.data[rowIndex],
                metaCell = grid.getMetaObj().rows[row.metaRowIndex].cells[colIndex],
                doc = form.getDocument(),
                table;
            if ( !doc )
                return;
            table = doc.getByKey(metaCell.tableKey);
            if ( !table )
                return;
            if ( !table.first() ) {
                table.addRow(true);
            }
            this.setCellValueToDataTable(metaCell, table, newValue);
        },

        selectRange: function (grid, start, end, ci, value) {
            var cell,
                row;
            for( var i = start;i < end;i++ ) {
                row = grid.getRowDataAt(i);
                cell = row.data[ci];
                if( row.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(row) || !cell[2] )
                    continue;
                grid.setValueAt(i,ci,value,true,true);
            }
        },

        selectSingle: function (grid, rowIndex, colIndex, value) {
            if( value ) {
                var row;
                for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                    row = grid.getRowDataAt(i);
                    if( i == rowIndex || row.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(row) )
                        continue;
                    grid.setValueAt(i,colIndex,false,true,true);
                }
                var form = YIUI.FormStack.getForm(grid.ofFormID);
                var doc = form.getDocument();
                var shadowTable = doc.getShadow(grid.tableKey);
                if ( shadowTable ) {
                    shadowTable.clear();
                }
            }
            grid.setValueAt(rowIndex,colIndex,value,true,true);
        },

        selectRow: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.getRowDataAt(rowIndex),
                tableKey = grid.tableKey,
                doc = form.getDocument(),
                dataTable = doc.getByKey(tableKey);

            var bkmk;
            if( row.bkmkRow ) {
                bkmk = row.bkmkRow.getBookmark();
            }
            if( bkmk == null ) {
                bkmk = row.bookmark;
            }

            if ( bkmk == undefined || !tableKey ) {
                return;
            }

            var selectKey = YIUI.SystemField.SELECT_FIELD_KEY,
                OIDKey = YIUI.SystemField.OID_SYS_KEY,
                dataType = dataTable.cols[dataTable.indexByKey(selectKey)].type;

            newValue = YIUI.TypeConvertor.toDataType(dataType, newValue);

            if (grid.hasColExpand) {
                for (var i = 0, len = row.bookmark.length; i < len; i++) {
                    dataTable.setByBkmk(row.bookmark[i]);
                    dataTable.setByKey(selectKey, newValue);
                }
            } else {
                if (grid.pageInfo.pageLoadType == YIUI.PageLoadType.DB) {
                    var shadowTable = doc.getShadow(tableKey);
                    if ( !shadowTable ) {
                        shadowTable = YIUI.DataUtil.newShadowDataTable(dataTable);
                        doc.addShadow(tableKey, shadowTable);
                    }
                    dataTable.setByBkmk(bkmk);
                    if (dataTable.getState() == DataDef.R_New)
                        return;
                    var curOID = dataTable.getByKey(OIDKey), primaryKeys;
                    if (curOID != null && curOID != undefined) {
                        primaryKeys = [OIDKey];
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
                        shadowTable.setByKey(selectKey, newValue);
                        shadowTable.setState(dataTable.getState());
                    } else {
                        if (pos != -1) {
                            shadowTable.setState(DataDef.R_New);// 置为新增状态,直接删除
                            shadowTable.delRow(pos);
                        }
                    }
                } else {
                    dataTable.setByBkmk(bkmk);
                    dataTable.setByKey(selectKey, newValue);
                }
            }
        },
        setDtlValueToDoc: function (form, grid, rowIndex, colIndex, newValue) {
            var row = grid.getRowDataAt(rowIndex),
                doc = form.getDocument(),
                metaCell = grid.getMetaObj().rows[row.metaRowIndex].cells[colIndex],
                sIndex = grid.selectFieldIndex;

            if (sIndex != -1 && sIndex == colIndex && row.rowType === 'Detail' ) {
                this.selectRow(form, grid, rowIndex, colIndex, newValue);
            }

            if ( !doc || !metaCell.hasDB )
                return;

            var dataTable = doc.getByKey(grid.tableKey);

            var bkmk;
            if( row.bkmkRow ) {
                bkmk = row.bkmkRow.getBookmark();
            }
            if( bkmk == null ) {
                bkmk = row.bookmark;
            }

            if( row.isDetail && bkmk == null ) {
                this.flushRow(form, grid, rowIndex);
                
                YIUI.SubDetailUtil.showSubDetailData(grid, rowIndex);

                this.dealWithSequence(form, grid, rowIndex);
            } else {
                if (grid.hasColExpand) {
                    if (metaCell.isColExpand) {
                        dataTable.setByBkmk(row.cellBkmks[colIndex]);
                        this.setCellValueToDataTable(metaCell, dataTable, newValue);
                    } else {
                        for (var i = 0, len = row.bookmark.length; i < len; i++) {
                            dataTable.setByBkmk(row.bookmark[i]);
                            this.setCellValueToDataTable(metaCell, dataTable, newValue);
                        }
                    }
                } else {
                    dataTable.setByBkmk(bkmk);
                    this.setCellValueToDataTable(metaCell, dataTable, newValue);
                }
            }
            // 设置子明细头控件的值
            var compList = form.subDetailInfo[metaCell.key];
            if( compList ) {
                var com;
                for (var i = 0, len = compList.length; i < len; i++) {
                    com = form.getComponent(compList[i]);
                    com.setValue(newValue,true,true);
                }
            }

            // 设置影子表的值
            this.setValue2ShadowTable(form,grid,metaCell,dataTable);
        },

        setValue2ShadowTable:function (form, grid, editOpt, dataTable) {
            var doc = form.getDocument(),
                shadowTable = doc.getShadow(grid.tableKey),
                columnKey = editOpt.columnKey;
            if( !shadowTable  || !editOpt.columnKey )
                return;

            var bookmark = YIUI.ViewUtil.findShadowBkmk(doc, grid.tableKey);
            if( bookmark == -1 )
                return;

            shadowTable.setByBkmk(bookmark);

            shadowTable.setByKey(columnKey,dataTable.getByKey(columnKey));

            // 是否有ItemKey列
            var itemKeyColumn = columnKey + "ItemKey";
            if( shadowTable.getColByKey(itemKeyColumn) ) {
                shadowTable.setByKey(itemKeyColumn, dataTable.get(itemKeyColumn));
            }

            // 是否有TypeDefKey列
            var typeDefKeyColumn = columnKey + "TypeDefKey";
            if( shadowTable.getColByKey(itemKeyColumn) ) {
                shadowTable.setByKey(typeDefKeyColumn, dataTable.getByKey(typeDefKeyColumn));
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
            var row = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[row.metaRowIndex],
                dataTable = form.getDocument().getByKey(grid.tableKey),
                rowBkmk,
                viewRow;
            if (grid.hasColExpand) {
                rowBkmk = [];
                viewRow = new YIUI.ExpandRowBkmk(grid.getColumnExpandModel().length);
                var cell,
                    metaCell,
                    crossValue,
                    areaIndex;
                for (var i = 0, len = row.data.length; i < len; i++) {
                    cell = row.data[i];
                    metaCell = metaRow.cells[i];
                    if (metaCell.isColExpand) {
                        crossValue = metaCell.crossValue;
                        areaIndex = metaCell.columnArea;

                        var detailViewRow = viewRow.getAtArea(areaIndex,crossValue);

                        if ( !detailViewRow ) {
                            dataTable.addRow(true);
                            rowBkmk.push(dataTable.getBkmk());
                            row.cellBkmks[i] = dataTable.getBkmk();

                            detailViewRow = new YIUI.DetailRowBkmk(dataTable.getBkmk());
                            viewRow.add(areaIndex,crossValue,detailViewRow);

                            //扩展数据赋值
                            var expInfo = grid.expandModel[areaIndex],
                                node,
                                expKey;
                            for (var k = 0, cLen = crossValue.values.length; k < cLen; k++) {
                                node = crossValue.values[k];
                                expKey = expInfo[k];
                                if (expKey !== undefined && expKey !== null && expKey.length > 0) {
                                    dataTable.setByKey(expKey, node.value);
                                }
                            }
                        } else {
                            row.cellBkmks[i] = detailViewRow.getBookmark();
                        }
                        //当前单元格赋值
                        this.setCellValueToDataTable(metaCell, dataTable, cell[0]);
                    }
                }
                for (var m = 0, eLen = viewRow.size(); m < eLen; m++) {
                    dataTable.setByBkmk(viewRow.getAt(m).getBookmark());
                    for (var n = 0, nLen = row.data.length; n < nLen; n++) {
                        metaCell = metaRow.cells[n];
                        if ( !metaCell.isColExpand ) {
                            this.setCellValueToDataTable(metaCell, dataTable, row.data[n][0]);
                        }
                    }
                }
            } else {
                dataTable.addRow(true);
                rowBkmk = dataTable.getBkmk();
                for (var j = 0, jLen = row.data.length; j < jLen; j++) {
                    metaCell = metaRow.cells[j];
                    this.setCellValueToDataTable(metaCell, dataTable, row.data[j][0]);
                }
                viewRow = new YIUI.DetailRowBkmk(rowBkmk);
                if( grid.isSubDetail ) {
                    var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form,grid),
                        parentRow = parentGrid.dataModel.data[parentGrid.getFocusRowIndex()];
                    dataTable.rows[dataTable.pos].parentBkmk = parentRow.bookmark;
                }
            }
            row.bookmark = rowBkmk;
            row.bkmkRow = viewRow;
            return row;
        },

        fillRowData:function (form,grid,table,rowIndex,fields) {

            var value,
                rowData = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex];

            for (var i = 0,metaCell;metaCell = metaRow.cells[i]; i++) {
                if ( !metaCell.hasDB || fields.indexOf(metaCell.columnKey) == -1 )
                    continue;

                value = YIUI.UIUtil.getCompValue(metaCell, table);

                grid.setValueAt(rowIndex, i, value, false, false, true);
            }
        },

        showDetailRowData: function (form, grid, rowIndex) {
            var doc = form.getDocument();
            if (doc == null) return;
            var dataTable = doc.getByKey(grid.tableKey);
            if (dataTable == null) return;
            var rowData = grid.getRowDataAt(rowIndex), rowbkmk = rowData.bkmkRow, firstRow = rowbkmk, expandRowBkmk;
            if (rowbkmk instanceof YIUI.ExpandRowBkmk) {
                expandRowBkmk = rowbkmk;
                firstRow = rowbkmk.getAt(0);
            }

            var value,
                metaCell,
                metaRow = grid.getMetaObj().rows[rowData.metaRowIndex];

            for (var i = 0;metaCell = metaRow.cells[i]; i++) {
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

                    dataTable.setByBkmk(firstRow.getBookmark());

                    if(grid.pageInfo.pageLoadType == YIUI.PageLoadType.DB){
                        if( YIUI.ViewUtil.findShadowBkmk(doc, grid.tableKey) != -1 ) {
                            grid.setValueAt(rowIndex, i, true, false, false, true);
                        }
                    }else{
                        grid.setValueAt(rowIndex, i, dataTable.getByKey(YIUI.SystemField.SELECT_FIELD_KEY), false, false, true);
                    }

                } else if (metaCell.cellType == YIUI.CONTROLTYPE.LABEL
                    || metaCell.cellType == YIUI.CONTROLTYPE.BUTTON
                    || metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK) {

                    grid.setCaptionAt(rowIndex, i, rowData.data[i][1]);
                }
            }
        },

        showFixRowData: function (form,grid,rowIndex) {
            var document = form.getDocument();
            if (document == null)
                return;
            var rowData = grid.getRowDataAt(rowIndex),
                metaCell,
                value;
            for (var i = 0, len = rowData.data.length; i < len; i++) {
                metaCell = grid.getMetaObj().rows[rowData.metaRowIndex].cells[i];
                if( metaCell.hasDB ) {
                    value = YIUI.UIUtil.getCompValue(metaCell, document.getByKey(metaCell.tableKey));
                } else {
                    value = rowData.data[i][1];
                }
                grid.setValueAt(rowIndex, i, value, false, false, true);
            }
        },

        copyRow: function (form, grid, rowIndex, excludeKeys, excludeValues) {
            var dataTable = form.getDocument().getByKey(grid.tableKey),
                newRowIndex = rowIndex + 1;
            if (dataTable == undefined)
                return -1;
            var row = grid.getRowDataAt(rowIndex);
            if (row.isDetail && row.bookmark == undefined)
                return -1;
            grid.insertRow(newRowIndex);

            this.flushRow(form, grid, newRowIndex);

            var values = [], value;
            dataTable.setByBkmk(row.bookmark);
            var parentBkmk = dataTable.getParentBkmk();
            for (var i = 0, len = dataTable.cols.length; i < len; i++) {
                values.push(dataTable.get(i));
            }
            var newRow = grid.getRowDataAt(newRowIndex);
            dataTable.setByBkmk(newRow.bookmark);

            // 如果是子明细
            if( grid.isSubDetail ) {
                dataTable.setParentBkmk(parentBkmk);
            }
            var columnInfo;
            for (var ci = 0, length = dataTable.cols.length; ci < length; ci++) {
                columnInfo = dataTable.cols[ci];
                if( YIUI.SystemField.OID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.VERID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.DVERID_SYS_KEY == columnInfo.key ||
                    YIUI.SystemField.SEQUENCE_FIELD_KEY == columnInfo.key )
                    continue;
                if (excludeKeys.indexOf(columnInfo.key) >= 0) {
                    var dataType = dataTable.cols[dataTable.indexByKey(columnInfo.key)].type;
                    dataTable.set(ci, YIUI.Handler.convertValue(excludeValues[excludeKeys.indexOf(columnInfo.key)], dataType));
                } else {
                    dataTable.set(ci, values[ci]);
                }
            }
            this.showDetailRowData(form, grid,newRowIndex);
            form.getUIProcess().doPostInsertRow(grid,newRowIndex,false);
            this.dealWithSequence(form, grid, newRowIndex);
            return newRowIndex;
        },
        /**
         *处理表格值变化时需要发生的相关事件
         */
        fireEvent: function (form, grid, rowIndex, colIndex) {
            var row = grid.dataModel.data[rowIndex];
                //cellKey = row.cellKeys[colIndex];
               // editOpt = grid.dataModel.colModel.cells[cellKey];

            var editOpt = grid.getMetaObj().rows[row.metaRowIndex].cells[colIndex];

            // 触发事件
            form.getViewDataMonitor().fireCellValueChanged(grid, rowIndex, colIndex, editOpt.key);

            if ( (grid.isEnable() && grid.newEmptyRow && editOpt && editOpt.columnKey) || grid.condition ) {

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
        },

        exchangeRowSequence: function (grid, rowIndex, anotherIndex) {

            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID);

            var SYS_SEQUENCE = YIUI.SystemField.SEQUENCE_FIELD_KEY;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var seqIndex = dataTable.indexByKey(SYS_SEQUENCE);
            if (seqIndex == -1) {
                return;
            }

            var row = grid.dataModel.data[rowIndex];
            var bkmk = row.bookmark;

            if (grid.hasColExpand) {
                dataTable.setByBkmk(bkmk[0]);
                var seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                var anotherRow = grid.dataModel.data[anotherIndex];
                var anotherBkmk = anotherRow.bookmark;
                dataTable.setByBkmk(anotherBkmk[0]);
                var anotherSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                for (var j = 0, jlen = anotherBkmk.length; j < jlen; j++) {
                    dataTable.setByBkmk(anotherBkmk[j]);
                    dataTable.setByKey(SYS_SEQUENCE, seq);
                }
                dataTable.setByBkmk(bkmk[0]);
                for (var j = 0, jlen = anotherBkmk.length; j < jlen; j++) {
                    dataTable.setByBkmk(bkmk[j]);
                    dataTable.setByKey(SYS_SEQUENCE, anotherSeq);
                }

            } else {
                dataTable.setByBkmk(bkmk);
                var seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                var anotherRow = grid.dataModel.data[anotherIndex];
                dataTable.setByBkmk(anotherRow.bookmark);
                var anotherSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));

                dataTable.setByKey(SYS_SEQUENCE, seq);
                dataTable.setByBkmk(bkmk);
                dataTable.setByKey(SYS_SEQUENCE, anotherSeq);
            }
        },

        dealWithSequence: function (form, grid, rowIndex) {
            var SYS_SEQUENCE = YIUI.SystemField.SEQUENCE_FIELD_KEY;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var seqIndex = dataTable.indexByKey(SYS_SEQUENCE);
            if (seqIndex == -1) {
                return;
            }
            var row, bkmk, seq, curSeq = 0;
            for ( var i = rowIndex -1; i >= 0; --i) {
                row = grid.dataModel.data[i];

                if (!row.isDetail || row.bookmark == undefined) continue;

                bkmk = row.bookmark;
                if (grid.hasColExpand) {
                    dataTable.setByBkmk(bkmk[0]);
                } else {
                    dataTable.setByBkmk(bkmk);
                }
                curSeq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                break;
            }
            if (grid.getMetaObj().serialSeq) {
                for ( var i = rowIndex,len = grid.dataModel.data.length; i < len; i++){
                    row = grid.dataModel.data[i];
                    if (!row.isDetail || row.bookmark == undefined) continue;
                    bkmk = row.bookmark;
                    if (grid.hasColExpand) {
                        dataTable.setByBkmk(bkmk[0]);
                        seq = ++curSeq;
                        for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                            dataTable.setByBkmk(bkmk[j]);
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        }
                    } else {
                        dataTable.setByBkmk(bkmk);
                        dataTable.setByKey(SYS_SEQUENCE, ++curSeq);
                    }
                }
            } else {
                for (var i = rowIndex, len = grid.dataModel.data.length; i < len; i++) {
                    row = grid.dataModel.data[i];
                    if (!row.isDetail || row.bookmark == undefined) continue;
                    bkmk = row.bookmark;
                    if (grid.hasColExpand) {
                        dataTable.setByBkmk(bkmk[0]);
                        seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                        if (seq == undefined || seq == null || seq <= curSeq) {
                            seq = curSeq + 1;
                            for (var j = 0, jlen = bkmk.length; j < jlen; j++) {
                                dataTable.setByBkmk(bkmk[j]);
                                dataTable.setByKey(SYS_SEQUENCE, seq);
                            }
                        } else {
                            break;
                        }
                    } else {
                        dataTable.setByBkmk(bkmk);
                        seq = parseInt(dataTable.getByKey(SYS_SEQUENCE));
                        if (seq == undefined || seq == null || seq <= curSeq) {
                            seq = curSeq + 1;
                            dataTable.setByKey(SYS_SEQUENCE, seq);
                        } else {
                            break;
                        }
                    }
                    curSeq = seq;
                }
            }
        },
        dependedValueChange: function (grid, targetField, dependencyField, value) {
            var formID = grid.ofFormID,
                form = YIUI.FormStack.getForm(formID),
                cellLocation = form.getCellLocation(targetField);
            if( cellLocation ) {
                if (grid.treeColIndex == cellLocation.column || grid.rowExpandIndex == cellLocation.column) {
                    grid.load(true);
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
                return;
            } else {
                if( grid.key === targetField ) {
                    grid.load(true);
                }
            }
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
            var row = grid.getRowDataAt(rowIndex),
                metaRow = grid.getMetaObj().rows[row.metaRowIndex],
                metaCell,editOpt;

            var updateDynamicCell = function (cell, cellTypeDef, editOpt, rowData, rowIndex, cellIndex) {
                if (cellTypeDef.options.isAlwaysShow) {
                    var iRow = rowIndex + 1, iCol = grid.getMetaObj().showRowHead ? cellIndex + 1 : cellIndex, cm = grid.dataModel.colModel[iCol],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: rowIndex, key: cm.name, id: iRow + "_" + cm.name, name: cm.name}),
                        gRow = grid.el.getGridRowAt(iRow);
                    grid.alwaysShowCellEditor(cell, iRow, iCol, cm, [null, "", cell.enable], opt, gRow.offsetHeight);
                }
            };

            for (var i = 0;metaCell = metaRow.cells[i]; i++) {
                editOpt = grid.getCellEditOpt(metaCell.key);
                if (metaCell.key == targetField) {
                    if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {

                        var typeDefKey = editOpt.typeDefKey;
                        if( !typeDefKey )
                            return;

                        var form = YIUI.FormStack.getForm(grid.ofFormID),
                            cellTypeDef = form.metaForm.cellTypeGroup[typeDefKey];



                      //  var cell = grid.el.getGridCellAt(rowIndex + 1, grid.getMetaObj().showRowHead ? i + 1 : i),
                       //     cellTypeDef = cell.cellTypeDef;
                       // if (cellTypeDef != null) {
                         //   var newOpt = $.extend(true, {}, editOpt), newOptions = $.extend(true, cellTypeDef.options, editOpt.editOptions);
                        //    newOpt.editOptions = newOptions;
                       //     Return.dependencyValueChangedByType(grid, cellTypeDef.type, newOpt, rowIndex, i, dependencyField, value);
                      //      updateDynamicCell(cell, cellTypeDef, rowIndex, i);
                     //   }

                        grid.setValueAt(rowIndex, i, value, true, true);

                    } else {
                        Return.dependencyValueChangedByType(grid, metaCell.cellType, editOpt, rowIndex, i, dependencyField, value);
                    }
                }
            }
        },
        dependencyValueChangedByType: function (grid, cellType, editOpt, rowIndex, colIndex, dependencyField, value) {
            var formID = grid.ofFormID, form = YIUI.FormStack.getForm(formID);
            var meta = editOpt.editOptions,itemKey = meta.itemKey;

            if (cellType == YIUI.CONTROLTYPE.DICT || cellType == YIUI.CONTROLTYPE.COMPDICT || cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                var needRebuild = false;

                if (cellType == YIUI.CONTROLTYPE.DYNAMICDICT) {
                    var refKey = meta.refKey;
                    if (refKey == dependencyField) {

                        needRebuild = true;
                    } else {
                        itemKey = YIUI.DictHandler.getItemKey(form,refKey);
                    }
                }

                if(!needRebuild){
                    var root = meta.root;
                    if (root == dependencyField) {
                        needRebuild = true;
                    }
                }

                if( !needRebuild ) {
                    //TODO 优化性能， 每次计算当前filter比较慢，特别是条件中含中间层访问的，可能需要模型中缓存字典类型的filter
                    var filter = YIUI.DictHandler.getMetaFilter(form, editOpt.key, meta.itemFilters, itemKey);
                    if( filter ) {
                        if (filter.dependency != null && filter.dependency.indexOf(dependencyField) >= 0) {
                            needRebuild = true;
                        }
                    }
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