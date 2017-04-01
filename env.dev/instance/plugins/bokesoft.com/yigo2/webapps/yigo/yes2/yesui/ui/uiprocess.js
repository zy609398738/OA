(function () {
    YIUI.UIProcess = function (form) {
        this.form = form;
        this.enableProcess = new YIUI.UIEnableProcess(form);
        this.visibleProcess = new YIUI.UIVisibleProcess(form);
        this.calcProcess = new YIUI.UICalcProcess(form);
        this.checkRuleProcess = new YIUI.UICheckRuleProcess(form);

        this.resetUIStatus = function (mask) {
            var calcEnable = (mask & YIUI.FormUIStatusMask.ENABLE) != 0;
            var calcVisible = (mask & YIUI.FormUIStatusMask.VISIBLE) != 0;
            var addOperation = (mask & YIUI.FormUIStatusMask.OPERATION) != 0;
            if (calcEnable) {
                this.enableProcess.calcAll();
            }
            if (calcVisible) {
                this.visibleProcess.calcAll();
            }
            if (addOperation) {
                this.calcToolBar();
            }
        };
        this.calcToolBar = function () {
        	var tbrKey = form.defTbr;
            if(!tbrKey) return;
            var tbr = form.getComponent(tbrKey);
            var metaTbl = tbr.getMetaObj();
            var metaItems = metaTbl.metaItems;
            var optMap = form.getOptMap();
            var items_copy = [];
            if (tbr && !tbr.isDestroyed) {
                var map = {};
                var f = form;
                for (var i = 0, len = tbr.items.length; i < len; i++) {
                    var item = tbr.items[i];
                    var metaItem = metaItems[item.key];
                    var visibleCont = metaItem.visible;
                    var enableCont = metaItem.enable;
                    var visible, enable;
                    if (item.formID) {
                        f = YIUI.FormStack.getForm(item.formID);
                    }
                    var cxt = {form: f};
                    if(!f) return;
                    visible = visibleCont ? f.eval(visibleCont, cxt, null) : tbr.visible;
                    enable = enableCont ? f.eval(enableCont, cxt, null) : tbr.enable;
                    item.visible = visible;
                    item.enable = enable;
                    items_copy.push(item);
                    if (item.items) {
                        for (var m = 0, len2 = item.items.length; m < len2; m++) {
                            metaItem = metaItems[item.items[m].key];
                            visibleCont = metaItem.visible;
                            enableCont = metaItem.enable;
                            visible = visibleCont ? f.eval(visibleCont, cxt, null) : tbr.visible;
                            item.items[m].visible = visible;
                            enable = enableCont ? f.eval(enableCont, cxt, null) : tbr.enable;
                            item.items[m].enable = enable;
                        }
                    } else {
                    	var tag = item.tag;
    					if (tag != null && !tag.isEmpty()) {
    						item.hidden = true;
    						var instance = new YIUI.InplaceToolBar({tag: tag});
    						var opts = instance.replace(form, item);
    						if (opts != null) {
    							var index = i;
    							for (var n = 0, len3 = opts.length; n < len3; n++) {
									var opt = opts[n];
									var _metaItem = {
										visible: opt.visible,
										enable: opt.enable
									};
									var _item = {
										key: opt.key,
										caption: opt.caption,
										action: opt.action,
										preAction: opt.preAction
									};
									visible = opt.visible ? f.eval(opt.visible, cxt, null) : tbr.visible;
				                    enable = opt.enable ? f.eval(opt.enable, cxt, null) : tbr.enable;
				                    _item.visible = visible;
				                    _item.enable = enable;
									items_copy.splice(index, 0, _item);
//									metaItems[opt.key] = _metaItem;
//				                    map[opt.key] = _item;
				                    index++;
								}
    						}
    					}
                    }
                    map[item.key] = item;
                }
//                tbr.items = items_copy;
                tbr.items_copy = items_copy;
                if(tbr.rendered) {
                	tbr.repaint();
                }
            }
        };
        this.doPostShowData = function (commitValue) {
            this.calcProcess.calcAll(commitValue);
            this.enableProcess.calcAll();
            this.visibleProcess.calcAll();
            this.checkRuleProcess.calcAll();
            YIUI.UIParaProcess.calcAll(this.form);
        };

        this.doPreCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            YIUI.UIDependencyProcess.cellValueChanged(form, grid, rowIndex, colIndex, cellKey);
        };
        this.doCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.calcProcess.cellValueChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.doPostCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.enableProcess.cellValueChanged(grid, rowIndex, colIndex, cellKey);
            this.visibleProcess.cellValueChanged(grid, rowIndex, colIndex, cellKey);
            this.checkRuleProcess.cellValueChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.calcSubDetail = function (gridKey) {
            this.calcProcess.calcSubDetail(gridKey);
            this.enableProcess.calcSubDetail(gridKey);
            this.visibleProcess.calcSubDetail(gridKey);
            this.checkRuleProcess.calcSubDetail(gridKey);
        };
        this.doPostInsertRow = function (grid, rowIndex, emptyRow) {
            this.calcProcess.doAfterInsertRow(grid, rowIndex, emptyRow);
            this.enableProcess.doAfterInsertRow(grid, rowIndex);
            this.visibleProcess.doAfterInsertRow(grid,rowIndex);
            this.checkRuleProcess.doAfterInsertRow(grid, rowIndex);
            if( emptyRow ) {
                YIUI.UIDependencyProcess.doAfterInsertRow(grid,rowIndex);
            }
        };
        this.doPostDeleteRow = function (grid) {
            this.calcProcess.doAfterDeleteRow(grid);
            this.enableProcess.doAfterDeleteRow(grid);
            this.checkRuleProcess.doAfterDeleteRow(grid);
        };
        this.resetComponentStatus = function (component) {
            this.calcProcess.reCalcComponent(component);
            this.enableProcess.reCalcComponent(component);
            this.visibleProcess.reCalcComponent(component);
            this.checkRuleProcess.reCalcComponent(component);
        }
        this.doPostClearAllRow = function (grid) {
            this.enableProcess.doAfterDeleteRow(grid, -1);
        };
        this.preFireValueChanged = function (component) {
            YIUI.UIDependencyProcess.valueChanged(this.form,component);
        };
        this.fireValueChanged = function (component) {
            this.calcProcess.valueChanged(component);
            if (component.valueChanged) {
                this.form.eval(component.valueChanged, {form: this.form});
            }
        };
        this.postFireValueChanged = function (component) {
            this.enableProcess.valueChanged(component);
            this.visibleProcess.valueChanged(component);
            this.checkRuleProcess.valueChanged(component);
            YIUI.UIParaProcess.valueChanged(this.form,component);
        };
    };

})();