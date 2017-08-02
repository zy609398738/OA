(function () {
    YIUI.GridColumnExpand = YIUI.extend({
        form: null,
        grid: null,
        sourceList: null,
        cellMatrixGroups: null,
        unVisibleKeys: null,
        init: function (form, grid) {
            this.form = form;
            this.grid = grid;
            this.sourceList = new YIUI.ExpandSourceList();
            this.cellMatrixGroups = [];
            this.unVisibleKeys = [];
        },
        extractExpandSources: function (metaGridColumn) {
            var metaColumnExpand = metaGridColumn.columnExpand;
            var columnKey = metaGridColumn.key, tableKey = this.grid.tableKey;
            var dataTable = this.form.getDocument().getByKey(tableKey);
            var expandColKey = metaColumnExpand.columnKey;
            var metaColumn = dataTable.getColByKey(expandColKey), dataType = metaColumn.type, list, value, caption;
            if (metaColumnExpand.expandSourceType == YIUI.ExpandSourceType.DATA) {
                var set = [];
                dataTable.beforeFirst();
                while (dataTable.next()) {
                    value = dataTable.getByKey(expandColKey);
                    set.push(value);
                }
                list = new YIUI.ExpandItemList(columnKey);
                for (var i = 0, len = list.length; i < len; i++) {
                    value = list[i];
                    if (value == null || (dataType == YIUI.DataType.INT && YIUI.TypeConvertor.toInt(value) == 0)) {
                        continue;
                    }
                    list.addItem(value, YIUI.TypeConvertor.toString(value));
                }
                this.sourceList.addExpandSource(columnKey, list);
            } else if (metaColumnExpand.expandSourceType == YIUI.ExpandSourceType.DICT) {
                var itemKey = metaColumnExpand.content;
                //TODO 字典类型的处理
            } else {
                var metaExpandSource = metaColumnExpand.content;
                if (metaExpandSource == null || metaExpandSource.length == 0) {
                    //TODO 抛配置错误，未定义扩展源
                    throw new Error("扩展源未定义");
                }
                var result = this.form.eval(metaExpandSource, {form: this.form});
                if (result == null) {
                    YIUI.ViewException.throwException(YIUI.ViewException.NO_EXPANDSOURCE_RESULT_GET);
                }
                list = new YIUI.ExpandItemList(columnKey);
                if (typeof result == "string") {
                    var resultStr = YIUI.TypeConvertor.toString(result);
                    if (resultStr.length > 0) {
                        var v = resultStr.split(";");
                        for (var j = 0, jlen = v.length; j < jlen; j++) {
                            var item = v[j], index = item.indexOf(",");
                            if (index == -1) {
                                list.addItem(item, item);
                            } else {
                                var vl = item.split(",");
                                value = YIUI.TypeConvertor.toDataType(dataType, vl[0]);
                                caption = vl[1];
                                list.addItem(value, caption);
                            }
                        }
                    }
                } else if (typeof result == "object") {
                    for (var m = 0, mlen = result.length; m < mlen; m++) {
                        var obj = result[m];
                        if (typeof obj == "object") {
                            value = YIUI.TypeConvertor.toDataType(dataType, obj[0]);
                            caption = obj[1];
                            list.addItem(value, caption);
                        }
                    }
                } else if (result instanceof YIUI.DataTable) {
                    result.beforeFirst();
                    while (result.next()) {
                        value = YIUI.TypeConvertor.toDataType(dataType, result.get(0));
                        caption = YIUI.TypeConvertor.toString(result.get(1));
                        list.addItem(value, caption);
                    }
                }
                this.sourceList.addExpandSource(columnKey, list);
            }
        },
        initCellMatrixGroups: function (metaGrid) {
            var columns = metaGrid.columns, metaColumn , columnArea = 0;
            for (var i = 0, len = columns.length; i < len; i++) {
                metaColumn = columns[i];
                var columnExpand = metaColumn.columnExpand;
                if (columnExpand != null) {
                    var rootGroup = new YIUI.CellMatrixColumnGroup();
                    rootGroup.area = columnArea;
                    this.cellMatrixGroups.push(rootGroup);
                    if (columnExpand.expandType == YIUI.ColumnExpandType.DATA) {
                        var group = new YIUI.CellMatrixColumnGroup();
                        group.setColumn(metaColumn);
                        rootGroup.add(group);
                        this.fillMatrixGroup(metaColumn, group);
                    } else {
                        this.fillMatrixGroup(metaColumn, rootGroup);
                    }
                    rootGroup.initGroupCount();
                    var column = rootGroup.getFirst();
                    rootGroup.left = this.grid.getOrgMetaGrid().leafIndexMap[column.key];
                    columnArea++;
                }
            }
        },
        fillMatrixGroup: function (column, rootGroup) {
            var columns = column.columns, metaGrid = this.grid.getOrgMetaGrid(), rowCollection = metaGrid.rows;
            var matrixColumn, columnIndex, metaRow;
            if (columns != null) {
                for (var i = 0, len = columns.length; i < len; i++) {
                    var metaColumn = columns[i];
                    if (metaColumn.columnExpand != null) {
                        var group = new YIUI.CellMatrixColumnGroup();
                        group.setColumn(metaColumn);
                        group.area = rootGroup.area;
                        rootGroup.add(group);
                        this.fillMatrixGroup(metaColumn, group);
                    } else {
                        matrixColumn = new YIUI.CellMatrixColumn(metaColumn);
                        columnIndex = metaGrid.leafIndexMap[metaColumn.key];
                        for (var j = 0, jlen = rowCollection.length; j < jlen; j++) {
                            metaRow = rowCollection[j];
                            matrixColumn.addCell(metaRow.cells[columnIndex]);
                        }
                        rootGroup.add(matrixColumn);
                    }
                }
            } else {
                matrixColumn = new YIUI.CellMatrixColumn(column);
                columnIndex = metaGrid.leafIndexMap[column.key];
                for (var m = 0, mlen = rowCollection.length; m < mlen; m++) {
                    metaRow = rowCollection[m];
                    matrixColumn.addCell(metaRow.cells[columnIndex]);
                }
                rootGroup.add(matrixColumn);
            }
        },
        fireColumnExpand: function (metaGrid) {
            var hasNoTitle = false, columns = metaGrid.columns, expandModel = this.grid.getColumnExpandModel();
            expandModel.length = 0;
            for (var i = 0, len = columns.length; i < len; i++) {
                var column = columns[i];
                if (column.columnExpand != null) {
                    var expand = column.columnExpand;
                    if (expand == null) {
                        YIUI.ViewException.throwException(YIUI.ViewException.EXPAND_SOURCE_UNDEFINED);
                    }
                    if (expand.expandType == YIUI.ColumnExpandType.DATA) {
                        hasNoTitle = true;
                    }
                    var info = [];
                    this.initExpandColumnInfo(column, info);
                    expandModel.push(info);
                }
            }
            if (!hasNoTitle) {
                for (var j = 0, jlen = columns.length; j < jlen; j++) {
                    if (columns[j].columnExpand != null) {
                        columns[j].columns = this.expandColumn(columns[j].columns);
                    }
                }
            } else {
                columns = this.expandColumn(columns);
            }
            this.grid.expandModel = expandModel;
        },
        initExpandColumnInfo: function (column, info) {
            var expand = column.columnExpand;
            if (expand == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.EXPAND_SOURCE_UNDEFINED);
            }
            if (expand.expandType == YIUI.ColumnExpandType.DATA) {
                if (expand.columnKey == null || expand.columnKey.length == 0) {
                    YIUI.ViewException.throwException(YIUI.ViewException.EXPAND_COLUMNKEY_UNDEFIND);
                }
                info.push(expand.columnKey);
            }
            var collection = column.columns, length = collection == null ? 0 : collection.length;
            for (var i = 0; i < length; i++) {
                var child = collection[i];
                if (child.columnExpand != null) {
                    this.initExpandColumnInfo(child, info);
                }
            }
        },
        addUnVisible: function (column) {
            this.unVisibleKeys.push(column.key);
            var count = column.columns == null ? 0 : column.columns.length;
            for (var i = 0; i < count; i++) {
                this.addUnVisible(column.columns[i]);
            }
        },
        expandColumn: function (collection) {
            if (collection == null) return collection;
            var columns = [];
            for (var i = 0, len = collection.length; i < len; i++) {
                var metaColumn = collection[i];
                if (metaColumn.columnExpand != null && this.unVisibleKeys.indexOf(metaColumn.key) < 0) {
                    var expand = metaColumn.columnExpand;
                    if (expand.expandType == YIUI.ColumnExpandType.DATA) {
                        this.extractExpandSources(metaColumn);
                        var expandSource = this.sourceList.getExpandSource(metaColumn.key);
                        if (expandSource == null || expandSource.getItemCount() == 0) {
                            columns.push(metaColumn);
                            this.addUnVisible(metaColumn);
                            break;
                        }
                        for (var j = 0, jlen = expandSource.getItemCount(); j < jlen; j++) {
                            var cloneColumn = $.extend(true, {}, metaColumn);
                            var secondKey = YIUI.TypeConvertor.toString(expandSource.getItemValue(j));
                            cloneColumn.key = cloneColumn.key + secondKey;
                            cloneColumn.caption = expandSource.getItemCaption(j);
                            columns.push(cloneColumn);
                            cloneColumn.refColumn = metaColumn;
                        }
                    } else {
                        columns.push(metaColumn);
                    }
                } else {
                    columns.push(metaColumn);
                }
            }
            collection = [];
            collection = collection.concat(columns);
            for (var k = 0, klen = collection.length; k < klen; k++) {
                var child = collection[k];
                if (child.columnExpand != null) {
                    child.columns = this.expandColumn(child.columns);
                }
            }
            return collection;
        },
        fireGroupExpand: function () {
            for (var i = 0, len = this.cellMatrixGroups.length; i < len; i++) {
                var group = this.cellMatrixGroups[i];
                this.expandGroup(group);
            }
        },
        expandGroup: function (group) {
            var tempList = [];
            for (var i = 0, len = group.size(); i < len; i++) {
                var object = group.getColumnObject(i);
                if (object.getObjectType() == YIUI.CellMatrixColumnObject.Group) {
                    var column = object.column;
                    var expandSource = this.sourceList.getExpandSource(column.key);
                    if (expandSource == null || expandSource.getItemCount() == 0) {
                        return;
                    }
                    var columnExpand = column.columnExpand, columnKey = columnExpand.columnKey;
                    var metaColumn = this.form.getDocument().getByKey(this.grid.tableKey).getColByKey(columnKey);
                    var javaDataType = YIUI.UIUtil.dataType2JavaDataType(metaColumn.type);
                    for (var j = 0, jLen = expandSource.getItemCount(); j < jLen; j++) {
                        var expandValue = expandSource.getItemValue(j);
                        var newColumn = object.clone();
                        newColumn.fillColumnExpand(group.area, column.key, javaDataType, expandValue);
                        tempList.push(newColumn);
                    }
                } else {
                    tempList.push(object);
                }
            }
            group.clear();
            group.addAll(tempList);
            for (var m = 0, mlen = group.size(); m < mlen; m++) {
                var obj = group.getColumnObject(m);
                if (obj.getObjectType() == YIUI.CellMatrixColumnObject.Group) {
                    this.expandGroup(obj);
                }
            }
        },
        expand: function () {
            var metaGrid = this.grid.getOrgMetaGrid(), targetMetaGrid = $.extend(true, {}, metaGrid);
            if (metaGrid.detailMetaRowIndex == null || metaGrid.detailMetaRowIndex < 0) {
                return;
            }
            //初始化分组区域
            this.initCellMatrixGroups(targetMetaGrid);
            //替换列
            this.fireColumnExpand(targetMetaGrid);
            //扩展组
            this.fireGroupExpand();
            // 分区域替换单元格,从后往前替换
            for (var i = this.cellMatrixGroups.length - 1; i >= 0; i--) {
                var group = this.cellMatrixGroups[i];
                var left = group.left, count = group.count;
                for (var j = 0, len = targetMetaGrid.rows.length; j < len; j++) {
                    var metaRow = targetMetaGrid.rows[j];
                    metaRow.cells.splice(left, count);
                    metaRow.cellKeys.splice(left, count);
                    var leafCells = group.getLeafCells(j);
                    for (var m = 0, mLen = leafCells.length; m < mLen; m++) {
                        metaRow.cells.splice(left + m, 0, leafCells[m]);
                        metaRow.cellKeys.splice(left + m, 0, leafCells[m].key);
                    }
                }
            }
            // 刷新计算表达式
            // this.updateItemIndex(targetMetaGrid);
            // 替换配置对象行
            //this.replaceRow(metaGrid, targetMetaGrid);
            this.grid.setMetaObj(targetMetaGrid);
        }
    });
    YIUI.ExpandSourceList = YIUI.extend({
        expandSourceArray: null,
        init: function () {
            this.expandSourceArray = {};
        },
        addExpandSource: function (key, expandSource) {
            this.expandSourceArray[key] = expandSource;
        },
        getExpandSource: function (key) {
            return this.expandSourceArray[key];
        }
    });
    YIUI.ExpandItemList = YIUI.extend({
        key: "",
        valueArray: null,
        captionArray: null,
        init: function (key) {
            this.key = key;
            this.valueArray = [];
            this.captionArray = [];
        },
        getItemCount: function () {
            return this.valueArray.length;
        },
        getItemValue: function (index) {
            return this.valueArray[index];
        },
        getItemCaption: function (index) {
            return this.captionArray[index];
        },
        addItem: function (value, caption) {
            this.valueArray.push(value);
            this.captionArray.push(caption);
        },
        getKey: function () {
            return this.key;
        }
    });
    YIUI.CellMatrixColumn = YIUI.extend({
        column: null,
        cellArray: null,
        init: function (columnOpt) {
            this.column = $.extend(true, this.column, columnOpt);
            this.cellArray = [];
        },
        addCell: function (cellOpt) {
            this.cellArray.push(cellOpt);
        },
        getColumn: function () {
            return this.column;
        },
        getObjectType: function () {
            return YIUI.CellMatrixColumnObject.Column;
        },
        clone: function () {
            var newObj = new YIUI.CellMatrixColumn(this.column);
            for (var i = 0, len = this.cellArray.length; i < len; i++) {
                var cell = this.cellArray[i];
                var cloneCell = $.extend(true, {extendInfo: {}}, cell);
                if (cell.crossValue != null) {
                    cloneCell.crossValue = cell.crossValue.clone();
                }
                cloneCell.extendInfo.detailRefCell = cell;
                newObj.addCell(cloneCell);
            }
            return newObj;
        },
        getCell: function (index) {
            return this.cellArray[index];
        },
        getAll: function (objectType, list) {
        },
        fillColumnExpand: function (columnArea, columnKey, dataType, value) {
            for (var i = 0, len = this.cellArray.length; i < len; i++) {
                var cell = this.cellArray[i];
                cell.extendInfo.columnArea = columnArea;
                cell.extendInfo.columnExpanded = true;
                cell.isColExpand = true;
                cell.columnArea = columnArea;
                if (cell.key != null && cell.key.length > 0) {
                    var crossValue = cell.crossValue;
                    if (crossValue == null) {
                        crossValue = new YIUI.MultiKey();
                        cell.crossValue = crossValue;
                    }
                    var node = new YIUI.MultiKeyNode(dataType, value, columnKey);
                    crossValue.addValue(node);
                }
            }
        },
        getColumnCount: function () {
            return 1;
        }
    });
    YIUI.CellMatrixColumnGroup = YIUI.extend({
        columnArray: null,
        expandCell: null,
        rowIndex: -1,
        column: null,
        left: -1,
        count: -1,
        firstColumn: null,
        area: -1,
        init: function () {
            this.columnArray = [];
            this.count = 0;
        },
        setColumn: function (column) {
            this.column = column;
        },
        getLeafColumnList: function (list) {
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                var obj = this.columnArray[i];
                if (obj.getObjectType() == YIUI.CellMatrixColumnObject.Column) {
                    list.push(obj);
                } else {
                    obj.getLeafColumnList(list);
                }
            }
        },
        getLeafCells: function (rowIndex) {
            var list = [], leafColumnList = [], column;
            this.getLeafColumnList(leafColumnList);
            for (var i = 0, len = leafColumnList.length; i < len; i++) {
                column = leafColumnList[i];
                list.push(column.getCell(rowIndex));
            }
            return list;
        },
        initGroupCount: function () {
            this.count = 0;
            var obj;
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                obj = this.columnArray[i];
                if (obj.getObjectType() == YIUI.CellMatrixColumnObject.Group) {
                    obj.initGroupCount();
                    this.count += obj.count;
                } else {
                    this.count += 1;
                }
            }
        },
        getFirst: function () {
            var obj = this.columnArray[0];
            if (obj.getObjectType() == YIUI.CellMatrixColumnObject.Group) {
                return obj.getFirst();
            } else {
                this.firstColumn = obj.getColumn();
                return this.firstColumn;
            }
        },
        add: function (obj) {
            this.columnArray.push(obj);
        },
        size: function () {
            return this.columnArray.length;
        },
        clear: function () {
            this.columnArray = [];
        },
        addAll: function (list) {
            for (var i = 0, len = list.length; i < len; i++) {
                this.columnArray.push(list[i]);
            }
        },
        replace: function (index, list) {
            this.columnArray.splice(index, 1);
            for (var i = 0, len = list.length; i < len; i++) {
                this.columnArray.splice(index + i, 0, list[i]);
            }
        },
        getColumnObject: function (index) {
            return this.columnArray[index];
        },
        getObjectType: function () {
            return YIUI.CellMatrixColumnObject.Group;
        },
        clone: function () {
            var newObj = new YIUI.CellMatrixColumnGroup();
            newObj.setColumn(this.column);
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                newObj.add(this.columnArray[i].clone());
            }
            newObj.area = this.area;
            return newObj;
        },
        getAll: function (objectType, list) {
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                var column = this.columnArray[i];
                if (column.getObjectType() == objectType) {
                    list.push(column);
                }
                column.getAll(objectType, list);
            }
        },
        fillColumnExpand: function (columnArea, columnKey, dataType, value) {
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                this.columnArray[i].fillColumnExpand(columnArea, columnKey, dataType, value);
            }
        },
        getColumnCount: function () {
            var columnCount = 0;
            for (var i = 0, len = this.columnArray.length; i < len; i++) {
                columnCount += this.columnArray[i].getColumnCount();
            }
            return columnCount;
        }
    });
})();