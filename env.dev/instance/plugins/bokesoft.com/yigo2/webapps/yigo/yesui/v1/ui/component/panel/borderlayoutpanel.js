/**
 * 使用BorderLayout的面板。
 * 使用方式：参考borderlayout.js
 */
YIUI.Panel.BorderLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'BorderLayout',
	initDefaultValue: function(options) {
		this.base(options);
		var el = this.el;
		var top, bottom, left, right, center;
		if(el.find(".border-north").length > 0) {
			top = this.el.find(".border-north");
		}
		if(el.find(".border-south").length > 0) {
			bottom = this.el.find(".border-south");
		}
		if(el.find(".border-western").length > 0) {
			left = this.el.find(".border-western");
		}
		if(el.find(".border-east").length > 0) {
			right = this.el.find(".border-east");
		}
		if(el.find(".border-center").length > 0) {
			center = this.el.find(".border-center");
		}
		var w = el.width(),
			h = el.height(),
			centerW = w,
			centerH = h,
			real;
		if(top != undefined) {
			real = top.height();
			centerH -= real;
			top.width(w);
		}
		if(bottom != undefined) {
			real = bottom.height();
			centerH -= real;
			bottom.width(w);
		}
		if(left != undefined) {
			real = left.width();
			centerW -= real;
			left.height(centerH);
		}
		if(right != undefined) {
			real = right.width();
			centerW -= real;
			right.height(centerH);
		}
		centerW = $.isNumeric(centerW) ? centerW : '100%';
		centerH = $.isNumeric(centerH) ? centerH : '100%';
		center.width(centerW);
		center.height(centerH);
		//子元素的宽高 100%
	},

    getNoTabOrderComps: function (unOrderList) {
        var subComps = [];
        for (var ci = 0, clen = this.items.length, item; ci < clen; ci++) {
            item = this.items[ci];
            switch (item.getMetaObj().region) {
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
            var tabOrder = comp.getMetaObj().tabOrder;
            if (comp.getMetaObj().crFocus && (tabOrder == -1 || tabOrder == undefined || tabOrder == null)) {
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