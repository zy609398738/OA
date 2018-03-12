/**
 * 使用BorderLayout的面板。
 * 使用方式：参考borderlayout.js
 */
"use strict";
YIUI.Panel.BorderLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'BorderLayout',

    getNoTabOrderComps: function (unOrderList) {
        var subComps = [];
        for (var ci = 0, clen = this.items.length, item; ci < clen; ci++) {
            item = this.items[ci];
            switch (item.region) {
                case "top":
                    subComps.splice(0, 0, item);
                    break;
                case "left":
                    subComps.splice(1, 0, item);
                    break;
                case "center":
                    subComps.splice(2, 0, item);
                    break;
                case "right":
                    subComps.splice(3, 0, item);
                    break;
                case "bottom":
                    subComps.splice(4, 0, item);
                    break;
            }
        }
        for (var i = 0, comp; i < subComps.length; i++) {
            comp = subComps[i];
            if (comp == undefined || comp == null) continue;
            var tabOrder = comp.tabOrder;
            if (comp.crFocus && (tabOrder == -1 || tabOrder == undefined || tabOrder == null)) {
                unOrderList.push(comp);
            } else if (comp.isPanel) {
                comp.getNoTabOrderComps(unOrderList);
            }
        }
    },

    install : function() {
		var _this = this;
//			$("#" + this.getId()).resize(function(){
//				_this.layout.layout();
//			});
	}
});
YIUI.reg("borderlayoutpanel",YIUI.Panel.BorderLayoutPanel);