Ext.useShims = true;
(function(){
if (MAP.ui.form.GridPanel) 
Ext.apply(MAP.ui.form.GridPanel.prototype, {
	reCalcColWidth : function() {
		if (!this.getGridEl())
			return;
		var fixWidth = 0 , config = this.colModel.config , gridWidth;
		// 此处用于处理配种中单元格宽度以比例显示
		// 如：SetFldWidth({BANKACCOUNTID:BANKCARDNO:DeleteDtl},{0.5-15:0.5-15:30})
		var gridID = 'grid_' + this.__gridIndex + MAP_BillContext.billView.viewID;
		gridWidth = Ext.getCmp(gridID).width;
		// 如果得到的getWidth()>=5000
		if (gridWidth == undefined || gridWidth >= 5000 || gridWidth <=0) {
			gridWidth = this.getGridEl().getWidth();
			var p = this.getGridEl().parent();
			while (p != null) {
				if (gridWidth > p.getWidth()) {
					gridWidth = p.getWidth();
					break;
				}
				p = p.parent();
			}
		}
		//gridWidth -= this.view.getScrollOffset()
		//			+ (this.view.cellPaddingLeft + this.view.cellPaddingRight)
		//			* this.view.cm.getColumnCount();
		// NOTICE by wangxh 重新处理表格gridwidth
		gridWidth -= this.view.getScrollOffset() + this.view.cellPaddingRight * this.view.cm.getColumnCount();

		if(Ext.isIE && gridWidth == 0 && this.getGridEl().dom
			&& this.getGridEl().dom.style.width != ""){
			gridWidth = this.getGridEl().dom.style.width.replace("px","");
		}
		if (this.colModel.fixWidth == undefined) {
			for (var i = 0, len = config.size(); i < len; i++) {
				var aFixWidth = config[i].widthCfg.toString().split('-');
				fixWidth += parseFloat(aFixWidth[0] > 1 ? aFixWidth[0] : 0);
			}
			this.colModel.fixWidth = fixWidth;
		} else {
			fixWidth = this.colModel.fixWidth;
		}
		for (var i = 0, len = config.size(); i < len; i++) {
			var sColWidth = config[i].widthCfg.toString();
			var aColWidth = sColWidth.split('-');
			if (aColWidth.size() > 1 || aColWidth[0] <= 1) {
				sColWidth = (gridWidth - fixWidth) * aColWidth[0];
				if (aColWidth.size() > 1 && sColWidth < aColWidth[1])
					sColWidth = aColWidth[1];
			}
			this.colModel.config[i].width = parseFloat(sColWidth);
		}
	}
});
})();