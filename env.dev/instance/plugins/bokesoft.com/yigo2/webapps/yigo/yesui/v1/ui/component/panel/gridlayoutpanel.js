/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-3-20
 * Time: 下午2:15
 */
YIUI.Panel.GridLayoutPanel = YIUI.extend(YIUI.Panel, {
    layout: "GridLayout",
    widths: null,
    minWidths: null,
    heights: null,
    rowGap: 0,
    columnGap: 0,
    oddColumnColor: null,
    forceLayout: true,
    
    setOddColumnColor: function(oddColumnColor) {
    	this.oddColumnColor = oddColumnColor;
		this.el.addClass("oddColumnColor");
    },
    
    setForceLayout: function(forceLayout) {
    	this.forceLayout = forceLayout;
    	this.layout.layout = $.noop;
    	this.layout.render = $.noop;
    },
    
    setRowGap: function(rowGap) {
    	this.rowGap = rowGap;
    },
    
    setColumnGap: function(columnGap) {
    	this.columnGap = columnGap;
    },
    
    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-glp");
    	
    	var metaObj = this.getMetaObj();
    	metaObj.oddColumnColor && this.setOddColumnColor(metaObj.oddColumnColor);
    	metaObj.rowGap && this.setRowGap(metaObj.rowGap);
    	metaObj.columnGap && this.setColumnGap(metaObj.columnGap);
    },
    
    afterRender: function() {
    	this.base();
    	if(this.forceLayout == false) {
    		this.setForceLayout(this.forceLayout);
    	}
    },
    
    initDefaultValue: function(options){
		this.base(options);
		var rowGap = this.rowGap = options.rowgap;
		var columnGap = this.columnGap = options.columngap;
		var heights = this.heights = options.heights;
		var widths = this.widths = options.widths;
		
		var ct = this,
			target = ct.getRenderTarget(),
			el = ct.el,
			panelHeight = el.innerHeight(),
			panelWidth = el.innerWidth();
		if(!widths || !heights) {
			throw 'widths or heights undefined';
		}
		var padding = parseInt(el.css("padding")),
			leftPadding = parseInt(el.css("padding-left")),
			rightPadding = parseInt(el.css("padding-right")),
			topPadding = parseInt(el.css("padding-top")),
			bottomPadding = parseInt(el.css("padding-bottom")),
			margin = parseInt(el.css("margin")),
			leftMargin = parseInt(el.css("margin-left")),
			rightMargin = parseInt(el.css("margin-right")),
			topMargin = parseInt(el.css("margin-top")),
			bottomMargin = parseInt(el.css("margin-bottom"));
		panelHeight -= (padding == 0 ? (topPadding + bottomPadding) : padding * 2) + (margin == 0 ? (topMargin + bottomMargin) : margin * 2);
		panelWidth -= (padding == 0 ? (leftPadding + rightPadding) : padding * 2) + (margin == 0 ? (leftMargin + rightMargin) : margin * 2);
		var realWidths = ct.layout.calcRealValues(panelWidth, widths),
 			realHeights = ct.layout.calcRealValues(panelHeight, heights),
			table = el.find("table"),
			firstRow = true,
			tr,
			td;
	
		for(var i=0;i<realHeights.length;i++) {
			tr = $(table[0].rows[i]).height(realHeights[i]);
			for(var j=0;j<realWidths.length;j++) {
				td = $(tr[0].cells[j]);
				if(firstRow) {
					td.width(realWidths[j]);
				}
				var node = td.children();
				var nodeName;
				if(node.length > 0) {
					nodeName = node[0].nodeName.toLowerCase();
				}

				var col = parseInt(td.attr("col")),
					row = parseInt(td.parent().attr("row")),
					colspan = parseInt(td.attr("colspan")),
					rowspan = parseInt(td.attr("rowspan"));
				var realWidth = realWidths[col],
					realHeight = realHeights[row];
				if(colspan > 1) {
					for (var j = 1; j < colspan; j++) {
						realWidth += realWidths[col + j];
					}
				}
				if(rowspan > 1) {
					for (var j = 1; j < rowspan; j++) {
						realHeight += realHeights[row + j];
					}
				}
				node.height(realHeight);
				if(nodeName == "label") {
					node.css("line-height", realHeight + "px");
				}
				if(columnGap > 0) {
					node.width(realWidth - columnGap);
				} else {
					node.width(realWidth);
				}
				node.css("margin-top", rowGap+"px");
				node.css("margin-left", columnGap+"px");
			}
			firstRow = false;
		}
	}
});
YIUI.reg("gridlayoutpanel", YIUI.Panel.GridLayoutPanel);