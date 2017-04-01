(function () {
    YIUI.MultiKeyNode = YIUI.extend({
        dataType: -1,
        value: null,
        init: function (dataType, value) {
            this.dataType = dataType;
            this.value = value;
        },
        equals: function (obj) {
            if (obj == null)
                return false;
            if (obj.dataType != this.dataType)
                return false;
            if (value == null && obj.value != null)
                return false;
            return value == obj.value;
        }
    });
    YIUI.MultiKey = YIUI.extend({
        values: [],
        init: function (values) {
            if (values != null && values.length > 0) {
                this.values = values;
            }
        },
        addValue: function (value) {
            this.values.push(value);
        },
        addAll: function (valueList) {
            if (valueList == null || valueList.length == 0)
                return;
            for (var value in valueList) {
                this.values.push(value);
            }
        },
        getValueCount: function () {
            return this.values.length;
        },
        getValueAt: function (index) {
            if (index < 0 || index >= this.values.length)
                return null;
            return this.values[index];
        }
    });
    YIUI.BaseRowBkmk = YIUI.extend({
        bookmark: -1,
        setBookmark: function (bkmk) {
            this.bookmark = bkmk;
        },
        getBookmark: function () {
            return this.bookmark;
        }
    });
    YIUI.FixRowBkmk = YIUI.extend(YIUI.BaseRowBkmk, {
        getRowType: function () {
            return YIUI.IRowBkmk.Fix;
        }
    });
    YIUI.DetailRowBkmk = YIUI.extend(YIUI.BaseRowBkmk, {
        getRowType: function () {
            return YIUI.IRowBkmk.Detail;
        },
        toString: function () {
            return "Detail_" + this.bookmark;
        },
        equals: function (obj) {
            if (obj == null) {
                return false;
            }
            if (!(obj instanceof  YIUI.DetailRowBkmk)) {
                return false;
            }
            return this.bookmark == obj.bookmark;
        }
    });
    YIUI.GroupRowBkmk = YIUI.extend(YIUI.BaseRowBkmk, {
        rowArray: [],
        metaGroup: null,
        isLeaf: false,
        getRowType: function () {
            return YIUI.IRowBkmk.Group;
        },
        addRow: function (bkmk) {
            this.rowArray.push(bkmk);
        },
        setLeaf: function (isLeaf) {
            this.isLeaf = isLeaf;
        },
        getRowCount: function () {
            return this.rowArray.length;
        },
        getRowAt: function (rowIndex) {
            if (rowIndex < 0 || rowIndex >= this.rowArray.length)
                return null;
            return this.rowArray[rowIndex];
        },
        setMetaGroup: function (metaGroup) {
            this.metaGroup = metaGroup;
        }
    });
    YIUI.ExpandRowBkmk = YIUI.extend(YIUI.BaseRowBkmk, {
        rowArray: [],
        expandRowMapList: [],
        init: function (count) {
            for (var i = 0; i < count; i++) {

            }
        },
        getRowType: function () {
            return YIUI.IRowBkmk.Expand;
        }
    });

})();