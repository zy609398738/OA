YIUI.GridUtil = (function () {

    // 闭包方法
    var initRowData = function(grid, metaRow, bookmarkRow, groupLevel){
            var rowData = {};
            rowData.key = metaRow.key;
            rowData.rowType = metaRow.rowType;
            rowData.metaRowIndex = grid.getMetaObj().rows.indexOf(metaRow);
            rowData.cellKeys = metaRow.cellKeys;
            rowData.isDetail = metaRow.rowType == 'Detail';
            rowData.isEditable = metaRow.rowType != 'Total' && metaRow.rowType != 'Group';
            rowData.rowHeight = metaRow.rowHeight || 32;
            rowData.rowID = grid.randID();
            rowData.data = [];
            rowData.cellBkmks = [];
            rowData.backColor = "";

            if( bookmarkRow ) {
                rowData.bkmkRow = bookmarkRow;
                if (bookmarkRow instanceof YIUI.ExpandRowBkmk) {
                    rowData.bookmark = [];
                    for (var h = 0, hLen = bookmarkRow.size(); h < hLen; h++) {
                        rowData.bookmark.push(bookmarkRow.getAt(h).getBookmark());
                    }
                } else {
                    rowData.bookmark = bookmarkRow.getBookmark();
                }
            }

            if( groupLevel !== undefined ) {
                rowData.rowGroupLevel = groupLevel;
            }

            if(metaRow.rowType == 'Group'){
                rowData.isGroupHead = metaRow.isGroupHead;
                rowData.isGroupTail = metaRow.isGroupTail;
            }

            return rowData;
        },

        //添加明细行
        addDetailRow = function (grid, metaRow, bookmarkRow, groupLevel) {
            var rowData = initRowData(grid, metaRow, bookmarkRow, groupLevel),
                metaCell, value, meta;

            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                metaCell = metaRow.cells[i],meta = metaCell.editOptions;

                var value = null,caption = '';

                switch (metaCell.cellType){
                case YIUI.CONTROLTYPE.LABEL:
                case YIUI.CONTROLTYPE.BUTTON:
                case YIUI.CONTROLTYPE.HYPERLINK:
                    if( !metaCell.hasDB ) {
                        caption = metaCell.caption;
                    }
                    break;
                case YIUI.CONTROLTYPE.NUMBEREDITOR:
                    value = new Decimal(0);
                    if ( meta.zeroString ) {
                        caption = meta.zeroString;
                    } else if (meta.showZero) {
                        var opt = {};
                        opt.mDec = $.isDefined(meta.scale) ? meta.scale : 2;
                        caption = YIUI.DecimalFormat.format(0, opt) ;
                    }
                    break;
                case YIUI.CONTROLTYPE.TEXTEDITOR:
                case YIUI.CONTROLTYPE.TEXTBUTTON:
                case YIUI.CONTROLTYPE.CHECKLISTBOX:
                    value = '';
                    break;
                }
                rowData.data.push([value,caption,true]);
                rowData.cellBkmks.push(null);
            }
            return rowData;
        },

        //添加汇总行
        addTotalRow = function (grid, metaRow, groupLevel) {
            var rowData = initRowData(grid, metaRow, null, groupLevel),
                metaCell,
                cellData;

            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                metaCell = metaRow.cells[i];
                if( metaCell.cellType == YIUI.CONTROLTYPE.LABEL ||
                    metaCell.cellType == YIUI.CONTROLTYPE.BUTTON ||
                    metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK ) {
                    cellData = [null, metaCell.caption, true];
                } else {
                    cellData = [];
                }
                rowData.data.push(cellData);
            }
            return rowData;
        },

        //添加固定行
        addFixRow = function (grid, metaRow) {
            var rowData = initRowData(grid, metaRow),
                metaCell,
                caption;

            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                metaCell = metaRow.cells[i];
                if( metaCell.cellType == YIUI.CONTROLTYPE.LABEL ||
                    metaCell.cellType == YIUI.CONTROLTYPE.BUTTON ||
                    metaCell.cellType == YIUI.CONTROLTYPE.HYPERLINK ) {
                    caption = metaCell.caption;
                } else {
                    caption = '';
                }
                rowData.data.push([null,caption,true]);
            }
            return rowData;
        };

    var Return = {

        insertRow: function(grid, rowIndex, metaRow, bookmarkRow, groupLevel){
            var rowData = null;
            switch(metaRow.rowType){
            case "Group":
            case "Total":
                rowData = addTotalRow(grid, metaRow, groupLevel);
                break;
            case "Detail":
                rowData = addDetailRow(grid, metaRow, bookmarkRow, groupLevel);
                break;
            case "Fix":
                rowData = addFixRow(grid, metaRow);
                break;
            default:
                console.log("error row type");
            }

            var data = grid.dataModel.data;
            var newRowIndex = 0;
            if (rowIndex >= 0) {
                newRowIndex = rowIndex;
                data.splice(rowIndex, 0, rowData);
            } else {
                newRowIndex = data.length;
                data.push(rowData);
            }

            // 插行以后,更新固定行位置
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            YIUI.GridLookupUtil.updateFixPos(form,grid);

            return newRowIndex;
        },

        buildGroupHeaders: function (grid) {

            var initLeafColumns = function (columns, leafColumns) {
                for (var i = 0,column; column = columns[i]; i++) {
                    if (column.columns != null && column.columns.length > 0) {
                        initLeafColumns(column.columns, leafColumns);
                    } else {
                        leafColumns.push(column);
                    }
                }
            }

            var initGroupHeaderArray = function (columns,groupHeaders) {
                var ghArray = [],groupHeader, nextColumns = [], _leafColumns;
                for (var i = 0,column;column = columns[i]; i++) {
                    if (column.columns == null || column.columns.length == 0)
                        continue;

                    _leafColumns = [];

                    initLeafColumns(column.columns, _leafColumns);

                    groupHeader = {
                        startColumnName: "column" + leafColumns.indexOf(_leafColumns[0]),
                        numberOfColumns: _leafColumns.length,
                        titleText:column.caption
                    };

                    ghArray.push(groupHeader);
                    nextColumns = nextColumns.concat(column.columns);
                }

                if (ghArray.length > 0) {
                    groupHeaders.push(ghArray);
                }

                if (nextColumns.length > 0) {
                    initGroupHeaderArray(nextColumns,groupHeaders);
                }
            }

            var groupHeaders = [],
                rootColumns = grid.getMetaObj().columns,
                leafColumns = grid.getMetaObj().leafColumns;

            initGroupHeaderArray(rootColumns,groupHeaders);

            grid.setGroupHeaders(groupHeaders);
        },

        // 先判断类型:rowData.rowType === "Detail" && !YIUI.GridUtil.isEmptyRow(rowData)
        isEmptyRow: function(rowData){
            if( rowData ) {
                return rowData.rowType == 'Detail' ? (rowData.bookmark == null && rowData.bkmkRow == null) : false;
            }
            return false;
        }
    };
    return Return;
})();