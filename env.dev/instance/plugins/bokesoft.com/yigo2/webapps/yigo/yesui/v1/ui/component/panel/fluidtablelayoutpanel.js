YIUI.Panel.FluidTableLayoutPanel = YIUI.extend(YIUI.Panel, {
    layout: "FluidTableLayout",
    widths: null,
    rowGap: 0,
    columnGap: 0,
    repeatCount: 1,
    repeatGap: 0,
    rowHeight: 30,
    
    init: function(options) {
    	this.base(options);
    },

//    onSetWidth: function(width) {
//    	width += this.widths.length * this.columnGap + this.repeatCount * this.repeatGap;
//		this.el.css("width", width);
//    },
    
//    onSetHeight: function(height) {
//    	var count = 0,
//    		items = this.items,
//    		repeatCount = this.repeatCount;
//    	for (var i = 0; i < items.length; i++) {
//			if(items[i].buddyKey) {
//				count++;
//			}
//		}
//    	var rows = (items.length + count) / 2;
//		if(rows % repeatCount == 0) {
//			rows = rows / repeatCount;
//		} else {
//			rows = parseInt(rows / repeatCount ) + 1;
//		}
//    	height += rows * this.rowGap;
//		this.el.css("height", height);
//    },
    
    setRowGap: function(rowGap) {
    	this.rowGap = rowGap;
    },
    
    setColumnGap: function(columnGap) {
    	this.columnGap = columnGap;
    },
    
    setRepeatCount: function(repeatCount) {
        if(repeatCount > 1) {
            this.repeatCount = repeatCount;
        }
    },

    setRepeatGap: function(repeatGap) {
        this.repeatGap = repeatGap;
    },
    
    setRowHeight: function(rowHeight) {
    	this.rowHeight = rowHeight;
    },
    
    onRender: function(ct) {
    	this.base(ct);
    	
    	var metaObj = this.getMetaObj();
    	metaObj.rowGap && this.setRowGap(metaObj.rowGap);
        metaObj.columnGap && this.setColumnGap(metaObj.columnGap);
        metaObj.repeatGap && this.setRepeatGap(metaObj.repeatGap);
        metaObj.repeatCount && this.setRepeatCount(metaObj.repeatCount);
        metaObj.rowHeight && this.setRowHeight(metaObj.rowHeight);
    	
    	this.el.addClass("ui-ftlp");
    },
    
    reLayout: function() {
    	this.layout.repaint();
    },
    
    initDefaultValue: function(options) {
    	this.base(options);
    	
    	var ct = this,
			repeatCount = ct.repeatCount = options.repeatCount,
			items = ct.items = options.items,
			rowHeight = ct.rowHeight = options.rowHeight,
			rowGap = ct.rowGap = options.rowGap,
			columnGap = ct.columnGap = options.columnGap,
			repeatGap = ct.repeatGap = options.repeatGap,
			widths = ct.widths = options.widths,
			panelWidth = this.el.outerWidth();
		if(!widths) {
			throw 'widths is undefined';
		}
		
		var table = $("table", this.el),
			firstRow = true,
			tr,
			td;
		var rows = $("tr", this.el).length;
		var cols = $("tr", this.el).eq(0).children().length;
		
    }
});
YIUI.reg("fluidtablelayoutpanel", YIUI.Panel.FluidTableLayoutPanel);