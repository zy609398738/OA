YIUI.SubDetailUtil = (function () {
    var Return = {
        isSubDetail: function (form, comp, gridKey) {
            if (comp.parentGridKey) {
                if (comp.parentGridKey != gridKey) {
                    return Return.isSubDetail(form, Return.getBindingGrid(form, comp), gridKey);
                } else {
                    return true;
                }
            }
            return false;
        },
        getBindingGrid: function (form, subDetailComp) {
            var parentGridKey = subDetailComp.parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            return form.getComponent(grid.key);
        },
        getBindingCellData: function (form, subDetailComp) {
            var bindingCellKey = subDetailComp.bindingCellKey,
                parentGridKey = subDetailComp.parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            grid = form.getComponent(grid.key);
            var rowIndex = grid.getFocusRowIndex();
            if (rowIndex == -1 || bindingCellKey == null || bindingCellKey == "")
                return null;
            return grid.getCellDataByKey(rowIndex, bindingCellKey);
        },
        getBindingCellError: function (form, subDetailComp) {
            var bindingCellKey = subDetailComp.bindingCellKey,
                parentGridKey = subDetailComp.parentGridKey,
                grid = form.getGridInfoByKey(parentGridKey);
            if (grid == null) return null;
            grid = form.getComponent(grid.key);
            var rowIndex = grid.getFocusRowIndex();
            if (rowIndex == -1 || bindingCellKey == null || bindingCellKey == "")
                return null;
            for (var i = 0, len = grid.errorInfoes.cells.length; i < len; i++) {
                var cellInfo = grid.errorInfoes.cells[i];
                if (cellInfo.rowIndex == rowIndex && cellInfo.colIndex == grid.getCellIndexByKey(bindingCellKey)) {
                    return cellInfo;
                }
            }
        },
        showSubDetailData: function (grid, rowIndex) {
            var begin = new Date().getTime(), rowData = grid.getRowDataAt(rowIndex);
            var form = YIUI.FormStack.getForm(grid.ofFormID);

            var compList = form.subDetailInfo[grid.key];
      

            if (!$.isDefined(compList) || compList.length == 0)
                return;

            if(grid.hasColExpand)
                return;

            if(!$.isDefined(grid.tableKey) || grid.tableKey.isEmpty())
                return;


            this.clearSubDetailData(form, grid);
            
            grid.getFocusRowIndex();
            // if(grid.getFocusRowIndex() == -1)
            //     return;

            if (rowData == null || (rowData.isDetail && rowData.bookmark == null)) 
                return;

            console.log("show....subdetail......data................");
            // if(true){
            //     return;
            // }
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            var row = grid.dataModel.data[rowIndex], value, OID = -1, comp, ubookmark, compTable;


            var metaRow = grid.getDetailMetaRow();

            if (row.isDetail && !grid.hasColExpand) {
                if (row.bookmark != null) {
                    dataTable.setByBkmk(row.bookmark);
                    OID = dataTable.getByKey("oid");
                } else {
                    dataTable.beforeFirst();
                }
                //compList = form.subDetailInfo[grid.key];

                var addNewRow = function (isDetail, metaRow, bookmark, parentBkmk, cellKeys, data) {
                    var newRowIndex = data.length, rowTable, tableKey;
                    var newRow = {};
                    newRow.isDetail = isDetail;
                    newRow.isEditable = (metaRow.rowType == "Detail" || metaRow.rowType == "Fix");
                    newRow.rowID = comp.randID();
                    newRow.bookmark = bookmark;
                    newRow.parentBkmk = parentBkmk;
                    newRow.cellKeys = cellKeys;
                    newRow.rowHeight = metaRow.rowHeight;
                    newRow.metaRowIndex = comp.getMetaObj().rows.indexOf(metaRow);
                    newRow.rowType = metaRow.rowType;
                    newRow.data = [];

                    var bkmk = new YIUI.DetailRowBkmk();
                    bkmk.setBookmark(bookmark);

                    newRow.bkmkRow = bkmk;


                    data.push(newRow);
                    
                    for (var j = 0, clen = comp.dataModel.colModel.columns.length; j < clen; j++) {
                        var editOpt = comp.dataModel.colModel.cells[cellKeys[j]];
                        if (editOpt !== undefined) {
                            if (bookmark == undefined) {
                                tableKey = (editOpt.tableKey == undefined ? metaRow.tableKey : editOpt.tableKey );
                                rowTable = form.getDocument().getByKey(tableKey);
                                if (rowTable !== undefined && rowTable !== null) {
                                    rowTable.first();
                                    value = (editOpt.columnKey == undefined ? null : rowTable.getByKey(editOpt.columnKey));
                                }
                            } else {
                                value = (editOpt.columnKey == undefined ? null : compTable.getByKey(editOpt.columnKey));
                            }
                            var defaultFV = metaRow.cells[j].defaultFormulaValue,
                                defaultV = metaRow.cells[j].defaultValue;
                            if (editOpt !== undefined && value == null
                                && (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink")) {
                                value = (metaRow.cells[j].caption == undefined ? "" : metaRow.cells[j].caption);
                            }
                            if (value == null && defaultFV !== undefined && defaultFV !== null && defaultFV.length > 0) {
                                value = form.eval(defaultFV, {form: form, rowIndex: newRowIndex}, null);
                            }
                            if (value == null && defaultV !== undefined && defaultV !== null && defaultV.length > 0) {
                                value = defaultV;
                            }
                        } else {
                            //value = (metaRow.cells[j].caption == undefined ? "" : metaRow.cells[j].caption);
                        }
                        // value = comp.getCellNeedValue(newRowIndex, j, value, true);

                        value = [null,'',true];

                        newRow.data.push(value);
                        value = null;
                    }
                };

                for (var i = 0, len = compList.length; i < len; i++) {
                    comp = form.getComponent(compList[i]);
                    if (comp instanceof  YIUI.Control.Grid) {
                        compTable = form.getDocument().getByKey(comp.tableKey);
                        comp.dataModel.data = [];
                        var info = form.subDetailInfo[grid.key].info, dtrIndex = comp.getMetaObj().detailMetaRowIndex, compMetaRow;

                        for (var j = 0; j < dtrIndex; j++) {
                            compMetaRow = comp.getMetaObj().rows[j];
                            addNewRow(false, compMetaRow, ubookmark, dataTable.getBkmk(), compMetaRow.cellKeys, comp.dataModel.data);
                        }
                        compTable.beforeFirst();


                        while (compTable.next()) {
                            if (compTable.rows[compTable.pos].state == DataDef.R_Deleted) continue;
                            var inGrid = false;
                            if (metaRow.linkType === 1) {
                                if ((row.bookmark != null && compTable.getParentBkmk() === row.bookmark)
                                    || (compTable.getByKey("POID") === OID && OID > 0)) {
                                    inGrid = true;
                                }
                            } else if (metaRow.linkType == 2) {
                                inGrid = true;
                                var sourceFields = metaRow.sourceFields, targetFields = metaRow.targetFields, srcField, tgtField;
                                for (var k = 0, slen = sourceFields.length; k < slen; k++) {
                                    srcField = sourceFields[k];
                                    tgtField = targetFields[k];
                                    var dataType = dataTable.cols[dataTable.indexByKey(srcField)].type;
                                    var dV = YIUI.Handler.convertValue(dataTable.getByKey(srcField), dataType),
                                        compDV = YIUI.Handler.convertValue(compTable.getByKey(tgtField), dataType);
                                    if (dV instanceof Decimal && compDV instanceof Decimal) {
                                        if (!dV.equals(compDV)) {
                                            inGrid = false;
                                            break;
                                        }
                                    } else if (dV !== compDV) {
                                        inGrid = false;
                                        break;
                                    }
                                }
                            }
                            if (inGrid) {
                                compMetaRow = comp.getMetaObj().rows[dtrIndex];
                                addNewRow(true, compMetaRow, compTable.getBkmk(), dataTable.getBkmk(), compMetaRow.cellKeys, comp.dataModel.data);
                                inGrid = false;
                            }
                        }
                        for (var m = dtrIndex + 1, length = comp.getMetaObj().rows.length; m < length; m++) {
                            compMetaRow = comp.getMetaObj().rows[m];
                            addNewRow(false, compMetaRow, ubookmark, dataTable.getBkmk(), compMetaRow.cellKeys, comp.dataModel.data);
                        }

                        for(var r = 0; r < comp.getRowCount(); r++){
                            comp.getHandler().showDetailRowData(form, comp, r, false);
                            //comp.showDetailRow(r, false);
                        }


                        comp.refreshGrid();

                    } else {
                        var meta = comp.getMetaObj();

                        if(meta.bindingCellKey && meta.bindingCellKey.length > 0){
                            var colInfoes = grid.getColInfoByKey(comp.metaObj.bindingCellKey);
                            if (colInfoes !== null) {
                                for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                    value = row.data[colInfoes[ci].colIndex][0];
                                    if (comp.type == YIUI.CONTROLTYPE.DICT && value != null && typeof value == 'string') {
                                        value = JSON.parse(value);
                                    }
                                    comp.setValue(value, false, false);
                                }
                            }
                        }else if(meta.tableKey && meta.tableKey.length > 0){
                                compTable = form.getDocument().getByKey(meta.tableKey);
                                value = compTable.getByKey(meta.columnKey);
                                comp.setValue(value, false, false);
                        }
                    }
                }
                form.getUIProcess().calcSubDetail(grid.key);
            }
            var end = new Date().getTime();
            console.log("showSubDetail Cost: " + (end - begin) + " ms");
        },
        clearSubDetailData: function (form, parentGrid) {
            var compList = form.subDetailInfo[parentGrid.key];
            if (compList == undefined) return;

            var subComp;
            for (var i = 0, len = compList.length; i < len; i++) {
                subComp = form.getComponent(compList[i]);
                if (subComp instanceof  YIUI.Control.Grid) {
                    subComp.dataModel.data = [];
                    if( subComp.el ) {
                        subComp.el.clearGridData();
                    }
                    this.clearSubDetailData(form, subComp);
                } else {
                    if (subComp.needClean()) {
                        subComp.setValue(null, false, false);
                        subComp.setRequired(false);
                        subComp.setError(false, "");
                    }
                }
            }
        }
    };
    return Return;
})();