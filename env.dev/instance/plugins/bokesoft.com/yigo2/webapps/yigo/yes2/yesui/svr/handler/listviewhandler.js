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
	    	
	    	YIUI.UIUtil.getDocument(form).done(function(doc) {
		        var totalRowCount = startRow + YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
		        YIUI.TotalRowCountUtil.setRowCount(doc, tableKey, totalRowCount);
		        form.setDocument(doc);
		        control.curPageIndex = pageIndex + 1;
	            control.reload();
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
        
        /**
         * 单元格值改变事件
         * formID: 控件所在表单的ID
         * controlKey: 控件自身的key
         * rowID: 行号
         * colIndex: 列号
         * newValue: 新的存储值
         */
        doCellValueChanged: function (control, rowIndex, colIndex, newValue) {
        	var column = control.columnInfo[colIndex];
        	var dbKey = column.key;
        	control.data[rowIndex][dbKey].value = newValue;
        	var valueChanged = column.valueChanged;
        	if(valueChanged) {
        		var form = YIUI.FormStack.getForm(control.ofFormID);
                var cxt = new View.Context(form);
        		form.eval(valueChanged, cxt);
        	}
        },

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
	    }
        
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();