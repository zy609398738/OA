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
    				// 1. 固定行单元格取自己的行号
					var rowIndex = row;
					// 2. 普通单元格取上下文中的行
					if( rowIndex == null || rowIndex == -1 ) {
						rowIndex = cxt.rowIndex;
					}
					// 上下文中无行取焦点行
					if( rowIndex == null || rowIndex == -1 ) {
						var grid = form.getComponent(cellLocation.key);
						rowIndex = grid.getFocusRowIndex();
					}
					// 如果是列拓展单元格,取上下文中的列
					column = (cellLocation.expand ? cxt.colIndex : column);
    				value = form.getCellValByIndex(key, rowIndex, column);
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
					table.setPos(rowIndex);
					value = table.getByKey(key);
    			} else if(grid) {
        			grid = form.getComponent(grid.key);
    				var gridRow = grid.getRowDataAt(rowIndex);
					var bkmk = gridRow.bookmark;
					if(bkmk < 0) return null;
					table.setByBkmk(bkmk);
					value = table.getByKey(key);
    			} else {
    				if (table) {
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
        	if( cmp ) {
        		form.setComponentValue(key, value, true);
        	} else if (cell) {
        		form.setCellValByKey(cell.key, cxt.rowIndex, key, value, true);
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
    	},
        getJSONValue: function (form, key, cxt) {
    		var reValue;
    		var comp = form.getComponent(key);
			if (!comp) {
	            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
			}
			
			var type = comp.type;
			switch(type) {
				case YIUI.CONTROLTYPE.DICT:
				case YIUI.CONTROLTYPE.DYNAMICDICT:
				case YIUI.CONTROLTYPE.COMPDICT:
					value = comp.getValue();
					if (value instanceof YIUI.ItemData) {
						reValue = value.toJSON();
					} else if ($.isArray(value)) {
						reValue = new Array();
						for(var i = 0 ; i < value.length;i++){
							reValue[i] = value[i].toJSON();
						}
					}
			}
        }
    };
    return Return;
})();