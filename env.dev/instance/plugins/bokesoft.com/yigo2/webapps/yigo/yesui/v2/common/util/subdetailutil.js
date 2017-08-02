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
        hasSubDetailData: function (form,grid,rowIndex) {
            var rowData = grid.getRowDataAt(rowIndex);
            if ( YIUI.GridUtil.isEmptyRow(rowData) )
                return false;
            return form.getDocument().getByParentKey(grid.tableKey).length > 0;
        },
        showSubDetailData: function (grid, rowIndex) {
            // var begin = new Date().getTime();
            var rowData = grid.getRowDataAt(rowIndex);
            var form = YIUI.FormStack.getForm(grid.ofFormID);

            var compList = form.subDetailInfo[grid.key];

            if(!$.isDefined(compList) || compList.length == 0)
                return;

            if( grid.hasColExpand )
                return;

            if(!$.isDefined(grid.tableKey) || grid.tableKey.isEmpty())
                return;

            this.clearSubDetailData(form, grid);

            if(grid.getFocusRowIndex() == -1)
                return;

            if (rowData == null || (rowData.isDetail && rowData.bookmark == null)) 
                return;

            // console.log("show....subdetail......data................");

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

                for (var i = 0, len = compList.length; i < len; i++) {
                    comp = form.getComponent(compList[i]);
                    if (comp instanceof  YIUI.Control.Grid) {
                        compTable = form.getDocument().getByKey(comp.tableKey);
                        comp.dataModel.data = [];
                        var info = form.subDetailInfo[grid.key].info;

                        compTable.beforeFirst();

                        while (compTable.next()) {
                            if (compTable.rows[compTable.pos].state == DataDef.R_Deleted)
                                continue;
                            var inGrid = false;
                            if (metaRow.linkType === YIUI.SubDetailLinkType.PARENT) {
                                if ((row.bookmark != null && compTable.getParentBkmk() === row.bookmark)
                                    || (compTable.getByKey("POID") === OID && OID > 0)) {
                                    inGrid = true;
                                }
                            } else if (metaRow.linkType == YIUI.SubDetailLinkType.FOREIGN) {
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
                            if ( inGrid ) {
                                var bkmkRow = new YIUI.DetailRowBkmk();
                                bkmkRow.setBookmark(compTable.getBkmk());
                                var newRowIndex = YIUI.GridUtil.insertRow(comp, -1, comp.getDetailMetaRow(), bkmkRow, 0);
                                inGrid = false;
                            }
                        }

                        for(var idx = 0,length = comp.getRowCount(); idx < length; idx++){
                            comp.getHandler().showDetailRowData(form, comp, idx);
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
      //      var end = new Date().getTime();
     //       console.log("showSubDetail Cost: " + (end - begin) + " ms");
        },
        clearSubDetailData: function (form, parentGrid) {
            var compList = form.subDetailInfo[parentGrid.key];
            if (compList == undefined)
                return;

            var subComp;
            for (var i = 0, len = compList.length; i < len; i++) {
                subComp = form.getComponent(compList[i]);
                if (subComp instanceof YIUI.Control.Grid) {
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