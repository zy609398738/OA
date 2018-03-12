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
        showSubDetailGridData:function (grid) {
            var form = YIUI.FormStack.getForm(grid.ofFormID);

            var parentGrid = this.getBindingGrid(form,grid);
            var rowIndex = parentGrid.getFocusRowIndex();
            if( rowIndex == -1 || !grid.tableKey )
                return;

            var row = parentGrid.getRowDataAt(rowIndex);

            var dataTable = form.getDocument().getByKey(parentGrid.tableKey),
                bkmk;

            if( row.bkmkRow ) {
                bkmk = row.bkmkRow.getBookmark();
            }
            if( bkmk == null ) {
                bkmk = row.bookmark;
            }

            dataTable.setByBkmk(bkmk);

            var OID = dataTable.getByKey(YIUI.SystemField.OID_SYS_KEY);

            var metaRow = parentGrid.getDetailMetaRow();

            grid.clearGridData();

            var table = form.getDocument().getByKey(grid.tableKey);
            table.beforeFirst();

            while ( table.next() ) {
                if (table.rows[table.pos].state == DataDef.R_Deleted)
                    continue;
                var inGrid = false;
                if (metaRow.linkType === YIUI.SubDetailLinkType.PARENT) {
                    if ((row.bookmark != null && table.getParentBkmk() === row.bookmark)
                        || (OID > 0 && table.getByKey(YIUI.SystemField.POID_SYS_KEY) == OID)) {
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
                            compDV = YIUI.Handler.convertValue(table.getByKey(tgtField), dataType);
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
                    var bkmkRow = new YIUI.DetailRowBkmk(table.getBkmk());
                    YIUI.GridUtil.insertRow(grid, -1, grid.getDetailMetaRow(), bkmkRow, 0);
                }
            }

            for(var idx = 0,length = grid.getRowCount(); idx < length; idx++){
                grid.getHandler().showDetailRowData(form, grid, idx);
            }

            grid.refreshGrid();
        },
        showSubDetailData: function (grid, rowIndex) {

            if(grid.hasColExpand || !grid.tableKey)
                return;

            var form = YIUI.FormStack.getForm(grid.ofFormID);

            var compList = form.subDetailInfo[grid.key];

            if(!compList || compList.length == 0)
                return;

            if(grid.getFocusRowIndex() == -1)
                return;

            var rowData = grid.getRowDataAt(rowIndex);

            this.clearSubDetailData(form, grid);

            if (!rowData.isDetail || YIUI.GridUtil.isEmptyRow(rowData))
                return;
            
            var value, com, table;

            for (var i = 0, len = compList.length; i < len; i++) {
                com = form.getComponent(compList[i]);

                if (com.type == YIUI.CONTROLTYPE.GRID) {

                    this.showSubDetailGridData(com);

                } else {
                    var meta = com.getMetaObj();
                    if(meta.bindingCellKey){
                        var colInfoes = grid.getColInfoByKey(com.metaObj.bindingCellKey);
                        if (colInfoes !== null) {
                            value = grid.getValueAt(rowIndex,colInfoes[0].colIndex);
                            com.setValue(value, false, false);
                        }
                    } else if (meta.tableKey && meta.columnKey){
                        table = form.getDocument().getByKey(meta.tableKey);
                        value = table.getByKey(meta.columnKey);
                        com.setValue(value, false, false);
                    }
                }
            }
            form.getUIProcess().calcSubDetail(grid.key);
        },
        clearSubDetailData: function (form, parentGrid) {
            var compList = form.subDetailInfo[parentGrid.key];
            if ( !compList )
                return;

            var com;
            for (var i = 0, len = compList.length; i < len; i++) {
                com = form.getComponent(compList[i]);
                if (com instanceof YIUI.Control.Grid) {
                    com.clearGridData();
                    this.clearSubDetailData(form, com);
                } else if ( com.needClean() ) {
                    com.setValue(null, false, false);
                    com.setRequired(false);
                    com.setError(false, "");
                }
            }
        }
    };
    return Return;
})();