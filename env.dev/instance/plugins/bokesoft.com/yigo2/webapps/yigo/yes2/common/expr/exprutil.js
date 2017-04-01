YIUI.ExprUtil = (function () {
    var Return = {
        //仅拿来处理Dict值
        getImplValue: function (form, key, cxt, obj) {
            var value = null;
    		if (!obj) {
    			var cellLocation = form.getCellLocation(key);
    			// 如果存在单元位置，那么是一个集合组件
    			if (cellLocation) {
    				var key = cellLocation.key;
    				var column = cellLocation.column;
    				var row = cellLocation.row;
    				var viewRow = cxt.rowIndex;
    				//如果是固定行的单元格,取自己的位置信息
    				value = form.getCellValByIndex(key, row == -1 ? viewRow : row, column);
    			} else {
    				// 头控件
    				var comp = form.getComponent(key);
    				if (!comp) {
    		            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS,key);
    				}
    				value = comp.getValue();
    			}
    			value = this.convertValue(value);
    		} else {
    			var grid = form.getGridInfoByTableKey(obj);
    			var lv = form.getListView(obj);
				var rowIndex = cxt.rowIndex;
				var doc = form.getDocument();
				var table = doc.getByKey(obj);
    			if(lv) {
//    				var rowIndex = rowLocation.getRow();
					table.setPos(rowIndex);
					value = table.getByKey(key);
    			} else if(grid) {
        			grid = form.getComponent(grid.key);
    				var gridRow = grid.getRowDataAt(rowIndex);
					var bkmk = gridRow.bookmark;
					if(bkmk < 0) return null;
					table.setByBkmk(bkmk);
//					table.setPos(rowIndex);
					value = table.getByKey(key);
    			} else {
    				if (table) {
//    					table.setPos(rowIndex);
    					value = table.getByKey(key);
    				}
    			}
    		}
    		return value;
        },
		// 表达式中的赋值需要触发事件
        setImplValue: function(form, key, value, cxt) {
        	var cmp = form.getComponent(key);
    		var cell = form.getCellLocation(key);
        	if(cmp) {
        		form.setComponentValue(key, value, true);
        	} else if(cell) {
        		var rowIndex = cxt.rowIndex;
        		form.setCellValByKey(cell.key, rowIndex, key, value, true);
        	}
        	
        },
        convertValue: function(value,editOpt) {
        	if (value && value instanceof YIUI.ItemData) {
                value = value.getOID();
            } else if ($.isObject(value) && value.oid) {
            	value = value.oid;
            } else if (editOpt && editOpt.edittype === 'dataPicker' && $.isNumeric(value)) {
            	value = new Date(value);
			}
    		return value;
    	}
    };
    return Return;
})();