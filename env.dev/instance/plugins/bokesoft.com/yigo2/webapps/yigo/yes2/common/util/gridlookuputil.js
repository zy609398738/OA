/**
 * Created by 陈瑞 on 2017/3/14 use WebStorm.
 */
YIUI.GridLookupUtil = (function () {
    var Return = {
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

