YIUI.ListViewHandler = (function () {
    var Return = {
        /**
         * 向指定页进行跳转
         */
        doGoToPage: function (control, pageIndex) {
            var formID = control.ofFormID,
            	metaObj = control.getMetaObj(),
	            controlKey = metaObj.key,
	            tableKey = metaObj.tableKey,
	            startRow = pageIndex * metaObj.pageRowCount,
	            form = YIUI.FormStack.getForm(formID);
	
	
	        var filterMap = form.getFilterMap();
//	    	filterMap.setStartRow(tableKey, startRow);
	        filterMap.setOID(form.getDocument().oid);
	        var formParas = form != null ? form.getParas() : null;
	        var paras = {
	            cmd: "pagination",
	            compKey: controlKey,
	            pageIndex: pageIndex,
	            parameters: formParas.toJSON(),
	            formKey: form.getFormKey(),
	            form: form.toJSON()
//	            filterMap: $.toJSON(filterMap),
//	            condParas: form.getCondParas()
	//            oid: form.getDocument().oid,
	//            tableKey: tableKey,
	//            rowIndex: extParas * control.pageRowCount,
	//            maxRows: control.pageRowCount
	        };
	
	//    	var params = {formKey: form.getFormKey(), filterMap: $.toJSON(filterMap), condition: form.getCondParas()};
	//    	var document = Svr.SvrMgr.loadFormData(params);
	//		if (document) {
	//            var doc = YIUI.DataUtil.fromJSONDoc(document);
	//            form.setDocument(doc);
	//        }
	//		form.showDocument();
	
	
	        var result = Svr.SvrMgr.doGoToPage(paras);
	//            listview = result.listview;
	
	        var newForm = YIUI.FormBuilder.build(result);
//	        newForm.getComponent(controlKey).pageNumber = pageIndex + 1;
	//    	var expKey = control.tableKey+"_rowcount";
	//    	var rowCount = newForm.getDocument().expData[expKey];
	        
//	        var el = form.getRoot().el;
//	        newForm.getRoot().el = el;
//	        el.empty();
//	        newForm.getRoot().render();
//	        YIUI.FormStack.removeForm(form.formID);
	        var listView = newForm.getComponent(controlKey);
        	if(listView.totalRowCount < metaObj.pageRowCount) {
        		control._pagination.hidePagination();
    		} else if(listView.totalRowCount) {
    			control.totalRowCount = listView.totalRowCount;
    			control._pagination.setTotalRowCount(control.totalRowCount, false);
    		}
	        control.data = listView.data;
	        control.clearDataRow();
	        control.addDataRow(control.data);
	
	    },
        /**
         * 表格行双击事件
         */
        doOnRowDblClick: function (control, rowIndex) {
            var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            rowDblClick = control.rowDblClick;

	        var cxt = {form: form, rowIndex: rowIndex};
	        if (rowDblClick) {
	            form.eval(rowDblClick, cxt, null);
	        }
	    },
	    /**
         * ListView行单击
         */
        doOnRowClick: function (control, rowID) {
            var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            rowClick = control.rowClick;

	        var cxt = {form: form, rowIndex: rowID};
	        if (rowClick) {
	            form.eval(rowClick, cxt, null);
	        }
        },
        /**
         * ListView行变化事件
         */
        doOnFocusRowChange: function (control, oldRowID, newRowID) {
        	var formID = control.ofFormID,
            form = YIUI.FormStack.getForm(formID),
            focusRowChanged = control.focusRowChanged;

	        var cxt = {form: form, rowIndex: newRowID};
	        if (focusRowChanged) {
	            form.eval(focusRowChanged, cxt, null);
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
        		form.eval(valueChanged, {form: form});
        	}
        },

        /**
         * 单元格单击事件， 用于表格的checkbox , button , hyperlink
         */
        doOnCellClick: function (control, rowID, colKey) {
            var formID = control.ofFormID,
	            form = YIUI.FormStack.getForm(formID),
	            columns = control.columnInfo, 
	            column;
            for (var i = 0, len = columns.length; i < len; i++) {
				column = columns[i];
				if(column.key == colKey) break;
			}
            
            var clickCont = column.clickContent;
            if (clickCont) {
                form.eval(clickCont, {form: form, rowIndex: rowID}, null);
            }
	    }
        
    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();