/**
 * 界面逻辑处理
 * @author 陈瑞
 */
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
                this.addOperation();
            }
        };

        this.addOperation = function (defaultToolbar) {

            var toolbar = defaultToolbar || this.form.defaultToolBar;

            if(!toolbar || toolbar.isDestroyed)
                return;

            var container = this.form.getContainer();
            if( !container.mergeOperation ) {
                toolbar.items.length = 0;
            }

            var _this = this;

            function addOneOperation(toolbar,item) {
                if( !item.managed && !_this.form.hasOptRight(item.key) )
                    return;
                var metaItem = _this.form.getMetaOpt(item.key),cxt = {form: _this.form},
                    visibleCnt = metaItem ? metaItem.visible : item.visibleCnt,
                    enableCnt = metaItem ? metaItem.enable : item.enableCnt;
                item.visible = visibleCnt ? _this.form.eval(visibleCnt, cxt, null) : true;
                item.enable = enableCnt ? _this.form.eval(enableCnt, cxt, null) : true;
                toolbar.items.push(item);
            }

            function addOneMenuOperation(toolbar,item) {
                if( !_this.form.hasOptRight(item.key) )
                    return;
                if (!item.items)
                    return;
                var _item,metaItem = _this.form.getMetaOpt(item.key),cxt = {form: _this.form};
                item.visible = (metaItem && metaItem.visible) ? _this.form.eval(metaItem.visible, cxt, null) : true;
                if( !item.selfDisable ) {
                    item.enable = (metaItem && metaItem.enable) ? _this.form.eval(metaItem.enable, cxt, null) : true;
                }
                for (var m = 0, length = item.items.length; m < length; m++) {
                    _item = item.items[m],metaItem = _this.form.getMetaOpt(_item.key);
                    _item.visible = (metaItem && metaItem.visible) ? _this.form.eval(metaItem.visible, cxt, null) : true;
                    _item.enable = (metaItem && metaItem.enable) ? _this.form.eval(metaItem.enable, cxt, null) : true;
                }
                toolbar.items.push(item);
            }
            
            function replaceInplaceToolBar(item) {
                var instance = new YIUI.InplaceToolBar({tag: item.tag}),
                    opts = instance.replace(form, item),items = [];
                if( !opts )
                    return items;
                for (var n = 0, length = opts.length; n < length; n++) {
                    items.push({
                        type: YIUI.OPERATIONTYPE.OPERATION,
                        key: opts[n].key,
                        caption: opts[n].caption,
                        action: opts[n].action,
                        preAction: opts[n].preAction,
                        managed: true, // 受管理,有权限
                        enableCnt:opts[n].enable,
                        visibleCnt:opts[n].visible
                    });
                }
                return items;
            }

            function addDefaultOperation(form,toolbar) {
                var item,i,len,m,size,items;
                for (i = 0, len = form.operations.length; i < len; i++) {
                    item = form.operations[i];
                    if( item.type == YIUI.OPERATIONTYPE.OPERATION ) {
                        if( item.tag ) {
                            items = replaceInplaceToolBar(item);
                            if( items != null && items.length > 0 ) {
                                for(m = 0,size = items.length;m < size;m++){
                                    addOneOperation(toolbar,items[m]);
                                }
                            }
                        } else {
                            addOneOperation(toolbar,item);
                        }
                    } else {
                        addOneMenuOperation(toolbar,item);
                    }
                }
                // 处理合并
                var mergeOptContainer = form.getMergeOptContainer();
                if( mergeOptContainer ) {
                    var ctn = form.getComponent(mergeOptContainer);
                    var activePane = ctn.getActivePane();
                    if( activePane ) {
                        activePane.getUIProcess().addOperation(toolbar);
                    }
                }
            }

            addDefaultOperation(this.form,toolbar);

            if(toolbar.rendered) {
                toolbar.repaint();
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
            if( this.calcProcess.calcAlling )
                return;
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
        };
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
            if( this.calcProcess.calcAlling )
                return;
            this.enableProcess.valueChanged(component);
            this.visibleProcess.valueChanged(component);
            this.checkRuleProcess.valueChanged(component);
            YIUI.UIParaProcess.valueChanged(this.form,component);
        };
        this.refreshParas = function () {
            YIUI.UIParaProcess.calcAll(this.form);
        };
        this.doAfterRowChanged = function (component) {
            this.enableProcess.doAfterRowChanged(component);
        };
        this.calcItems = function (items) {
            this.calcProcess.calcAllItems(items,true,false);
        };
    };

})();