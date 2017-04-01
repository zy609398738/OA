YIUI.BatchUtil = (function () {
    var Return = {
    		getViewSelOIDs: function(form, defaultValue) {
    			
    		},
    		getSelectOIDs: function(form, tblKey, oidKey, defaultValue) {
    			var oids = new Array();
    			var doc = form.getDocument();
    			var table = doc.getByKey(tblKey);
    			
    			var s_Key = YIUI.DataUtil.getShadowTableKey(tblKey);
    			var s_Tbl = doc.getByKey(s_Key);
    			
    			// 如果有影子表格,直接取影子表数据
    			if( s_Tbl != null ) {
    				s_Tbl.beforeFirst();
    				while( s_Tbl.next() ) {
    					var OID = s_Tbl.getByKey(oidKey);
    					oids.push(OID);
    				}
    			} else {
    				var lv = form.getListView(tblKey);
    		        var grid = form.getGridInfoByTableKey(tblKey);
    		        if (lv) {
    		            oids = lv.getFieldArray(form, oidKey);
    		        } else if (grid) {
    		            oids = grid.getFieldArray(form, oidKey);
    		        }
    			}
    			return oids;
    		
    		}
    };
    return Return;
})();