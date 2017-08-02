/**
 * Created by 陈瑞 on 2017/3/14 use WebStorm.
 */
YIUI.GridLookupUtil = (function () {
    var Return = {

        /**
         * 建立单元格查找
         * @param form
         * @param com
         */
        buildCellLookup:function (form,com) {
            var cellLocation,columnInfo,metaRow,metaCell;
            switch (com.type){
            case YIUI.CONTROLTYPE.GRID:
                var metaRows = com.getMetaObj().rows;
                for( var i = 0,size = metaRows.length;i < size;i++ ) {
                    metaRow = metaRows[i];
                    for (var c = 0, length = metaRow.cells.length; c < length; c++) {
                        metaCell = metaRow.cells[c];
                        if( !metaCell.key ) continue;
                        cellLocation = {
                            key: com.key,
                            column: c,
                            row: metaRow.rowType === 'Fix' ? i : -1,
                            tableKey: com.tableKey,
                            columnKey: metaCell.columnKey,
                            expand:metaCell.isColExpand
                        }
                        form.formAdapt.addCellLocation(metaCell.key, cellLocation);
                    }
                }
                break;
            case YIUI.CONTROLTYPE.LISTVIEW:
                for (var i = 0, len = com.columnInfo.length; i < len; i++) {
                    columnInfo = com.columnInfo[i];
                    columnInfo.tableKey = com.tableKey;
                    cellLocation = {
                        key: com.key,
                        column: i,
                        row: -1,
                        tableKey: com.tableKey,
                        columnKey: columnInfo.columnKey
                    };
                    form.formAdapt.addCellLocation(columnInfo.key, cellLocation);
                }
                break;
            }
        },

        /**
         * 更新固定行位置
         * @param form
         * @param grid
         */
        updateFixPos:function (form,grid) {
            if( !grid.hasFixRow )
                return;
            var cellKey;
            for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                var rowData = grid.getRowDataAt(i);
                if( rowData.rowType !== "Fix" )
                    continue;
                for( var j = 0,length = rowData.cellKeys.length;j < length;j++ ) {
                    cellKey = rowData.cellKeys[j];
                    if( cellKey ) {
                        form.getCellLocation(cellKey).row = i;
                    }
                }
            }
        }
    };
    return Return;
})();

