var OBJLOOP = OBJLOOP || {};
(function () {
    OBJLOOP.DataTableLoop = function (table) {
        this.table = table;
    };
    Lang.impl(OBJLOOP.DataTableLoop, {
        hasNext: function () {
            return this.table.getRowCount() > 0 && !this.table.isLast();
        },
        next: function () {
            this.table.next();
        },
        clean: function () {

        }
    });
    OBJLOOP.GridLoop = function (cxt, grid, includeEmptyRow) {
        this.index = -1;
        this.context = cxt;
        this.includeEmptyRow = includeEmptyRow;
        this.key = grid.key;
        this.count = 0;
        if (this.includeEmptyRow) {
            this.count = grid.getRowCount();
        } else {
            for (var i = 0, tmpCount = grid.getRowCount(); i < tmpCount; i++) {
                var row = grid.dataModel.data[i];
                if (!(row.isDetail && row.bookmark == undefined)) {
                    this.count++;
                }
            }
        }
    };
    Lang.impl(OBJLOOP.GridLoop, {
        hasNext: function () {
            return this.count > 0 && this.index < this.count - 1;
        },
        next: function () {
            ++this.index;
            this.context.key = this.key;
            this.context.rowIndex = this.index;
        },
        clean: function () {

        }
    });
    OBJLOOP.ListViewLoop = function (cxt, listView) {
        this.index = -1;
        this.context = cxt;
        this.key = listView.key;
        this.count = listView.data.length;
    };
    Lang.impl(OBJLOOP.ListViewLoop, {
        hasNext: function () {
            return this.count > 0 && this.index < this.count - 1;
        },
        next: function () {
            ++this.index;
            this.context.key = this.key;
            this.context.rowIndex = this.index;
        },
        clean: function () {

        }
    });
})();