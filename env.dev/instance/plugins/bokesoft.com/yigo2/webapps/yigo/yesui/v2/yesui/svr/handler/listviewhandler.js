YIUI.ListViewHandler = (function () {
    var Return = {
        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var formID = control.ofFormID,
                controlKey = control.key,
                tableKey = control.tableKey,
                startRow = pageIndex * control.pageRowCount,
                form = YIUI.FormStack.getForm(formID);

            var filterMap = form.getFilterMap();
            filterMap.setStartRow(tableKey, startRow);

            YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
                .then(function(doc){
                    var totalRowCount = startRow + YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
                    var document = form.getDocument();
                    YIUI.TotalRowCountUtil.setRowCount(document, tableKey, totalRowCount);

                    document.setByKey(tableKey,doc.getByKey(tableKey));

                    control.curPageIndex = pageIndex + 1;
                    control.load(true);
                });
        },

        /**
         * ListView行点击
         */
        doOnRowClick: function (formID, rowID, formula) {
            var form = YIUI.FormStack.getForm(formID);
            var cxt = new View.Context(form);
            cxt.setRowIndex(rowID);
            if (formula) {
                form.eval(formula, cxt, null);
            }
        },
        //
        // /**
        //  * 单元格值改变事件
        //  * @param listview
        //  * @param rowIndex
        //  * @param colIndex
        //  * @param newValue
        //  */
        // doCellValueChanged: function (listview, rowIndex, colIndex, newValue) {
        // 	var column = listview.columnInfo[colIndex];
        // 	var dbKey = column.key;
        // 	var cellData = listview.data[rowIndex][dbKey];
        // 	if (cellData)
        // 		cellData.value = newValue;
        //     var form = YIUI.FormStack.getForm(listview.ofFormID);
        //     // 影子表处理
        //     if( colIndex == listview.selectFieldIndex ) {
        //         this.selectRow(form, listview, rowIndex, colIndex, newValue);
        //     }
        // 	var valueChanged = column.valueChanged;
        // 	if(valueChanged) {
        //         var cxt = new View.Context(form);
        // 		form.eval(valueChanged, cxt);
        // 	}
        // },

        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (formID, columns, rowID, colKey) {
            var form = YIUI.FormStack.getForm(formID), column;
            for (var i = 0, len = columns.length; i < len; i++) {
                column = columns[i];
                if(column.key == colKey) break;
            }
            var clickContent = column.clickContent;
            if (clickContent) {
                var cxt = new View.Context(form);
                cxt.setRowIndex(rowID);
                form.eval(clickContent, cxt, null);
            }
        },

        /**
         * 选中一行
         * @param form
         * @param listview
         * @param rowIndex
         * @param colIndex
         * @param newValue
         */
        selectRow: function (form, listview, rowIndex, colIndex, newValue) {
            var doc = form.getDocument(),row = listview.data[rowIndex],tableKey = listview.tableKey;
            if( !tableKey || !row.bkmkRow )
                return;
            var table = doc.getByKey(listview.tableKey);
            var dataType = table.cols[table.indexByKey(YIUI.SystemField.SELECT_FIELD_KEY)].type;
            newValue = YIUI.Handler.convertValue(newValue, dataType);
            if( listview.pageLoadType == YIUI.PageLoadType.DB ) {
                table.setByBkmk(row.bkmkRow.getBookmark());
                if (table.getState() == DataDef.R_New)
                    return;
                var shadowTable = doc.getShadow(listview.tableKey);
                if ( !shadowTable ) {
                    shadowTable = YIUI.DataUtil.newShadowDataTable(table);
                    doc.addShadow(tableKey, shadowTable);
                }
                var curOID = table.getByKey(YIUI.SystemField.OID_SYS_KEY), primaryKeys;
                if (curOID != null && curOID != undefined) {
                    primaryKeys = [YIUI.SystemField.OID_SYS_KEY];
                } else {
                    primaryKeys = listview.primaryKeys;
                }
                var pos = YIUI.DataUtil.getPosByPrimaryKeys(table, shadowTable, primaryKeys);
                if( YIUI.TypeConvertor.toBoolean(newValue) ) {
                    if (pos != -1) {
                        shadowTable.setPos(pos);
                    } else {
                        shadowTable.addRow();
                        for (var j = 0, clen = shadowTable.cols.length; j < clen; j++) {
                            shadowTable.set(j, table.get(j));
                        }
                    }
                    shadowTable.setByKey(YIUI.SystemField.SELECT_FIELD_KEY, 1);
                    shadowTable.setState(table.getState());
                } else {
                    if( pos != -1 ) {
                        shadowTable.setState(DataDef.R_New);// 置为新增状态,直接删除
                        shadowTable.delRow(pos);
                    }
                }
            } else {
                table.setByBkmk(row.bkmkRow.getBookmark());
                table.setByKey(YIUI.SystemField.SELECT_FIELD_KEY, newValue);
            }
        }
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();