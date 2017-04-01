(function () {
    YIUI.UIProcess = function (form) {
        this.form = form;
        this.enableProcess = new YIUI.UIEnableProcess(form);
        this.visibleProcess = new YIUI.UIVisibleProcess(form);
        this.calcProcess = new YIUI.UICalcProcess(form);
        this.checkRuleProcess = new YIUI.UICheckRuleProcess(form);
        this.dependencyProcess = new YIUI.UIDependencyProcess(form);
        this.checkAll = function () {
            this.checkRuleProcess.checkAll();
        };
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
            var tblKey = form.defTbr,
                tbl = form.getComponent(tblKey);
            if (tbl && !tbl.isDestroyed) {
                var map = {};
                for (var i = 0, len = tbl.items.length; i < len; i++) {
                    var item = tbl.items[i];
                    var visible, enable;
                    var f = form;
                    if (item.formID) {
                        f = YIUI.FormStack.getForm(item.formID);
                    }
                    var cxt = {form: f};
                    if (f) {
                        visible = item.visibleCont ? f.eval(item.visibleCont, cxt, null) : tbl.visible;
                        enable = item.enableCont ? f.eval(item.enableCont, cxt, null) : tbl.enable;
                    } else {
                        visible = false;
                        enable = false;
                        item.needDelete = true;
                    }
                    item.visible = visible;
                    item.enable = enable;
                    if (item.items) {
                        for (var m = 0, len2 = item.items.length; m < len2; m++) {
                            visible = item.items[m].visibleCont ? f.eval(item.items[m].visibleCont, cxt, null) : tbl.visible;
                            item.items[m].visible = visible;
                            enable = item.items[m].enableCont ? f.eval(item.items[m].enableCont, cxt, null) : tbl.enable;
                            item.items[m].enable = enable;
                        }
                    }
                    map[item.key] = item;
                }
                var optMap = form.getOptMap();
                for (var key in map) {
                    if (map[key].needDelete) {
                        delete optMap[key];
                        continue;
                    }
                    var opt = optMap[key];
                    if (opt) {
                        opt.opt = map[key];
                    }
                }
                tbl.repaint();
            }
        };
        this.doPostShowData = function (commitValue) {
            this.calcProcess.calcAll(commitValue);
            this.enableProcess.calcAll();
            this.visibleProcess.calcAll();
            this.checkRuleProcess.checkAll();
            this.dependencyProcess.calcAll();
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            this.calcProcess.calcEmptyRow(grid, rowIndex);
            this.enableProcess.calcEmptyRow(grid, rowIndex);
            this.checkRuleProcess.calcEmptyRow(grid, rowIndex);
            this.dependencyProcess.calcEmptyRow(grid, rowIndex);
        };
        this.doValueChanged = function (key) {
            this.calcProcess.valueChanged(key);
            var control = this.form.getComponent(key);
            if (control.valueChanged) {
                this.form.eval(control.valueChanged, {form: this.form});
            }
        };
        this.doPostValueChanged = function (key) {
            this.enableProcess.valueChanged(key);
            this.visibleProcess.valueChanged(key);
            this.checkRuleProcess.valueChanged(key);
            this.dependencyProcess.valueChanged(key);
        };
        this.doPreCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.dependencyProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.doCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.calcProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.doPostCellValueChanged = function (grid, rowIndex, colIndex, cellKey) {
            this.enableProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
            this.visibleProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
            this.checkRuleProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
//            this.dependencyProcess.cellValChanged(grid, rowIndex, colIndex, cellKey);
        };
        this.calcSubDetail = function (gridKey) {
            this.calcProcess.calcSubDetail(gridKey);
            this.enableProcess.calcSubDetail(gridKey);
            this.visibleProcess.calcSubDetail(gridKey);
            this.checkRuleProcess.checkSubDetail(gridKey);
        };
        this.doPostInsertRow = function (grid, rowIndex) {
            this.calcProcess.calcEmptyRow(grid, rowIndex);
            this.enableProcess.doAfterInsertRow(grid, rowIndex);
            this.checkRuleProcess.calcEmptyRow(grid, rowIndex);
            this.dependencyProcess.calcEmptyRow(grid, rowIndex);
        };
        this.doPostDeleteRow = function (grid, rowIndex) {
            this.calcProcess.doAfterDeleteRow(grid, rowIndex);
            this.enableProcess.doAfterDeleteRow(grid, rowIndex);
            this.checkRuleProcess.doAfterDeleteRow(grid, rowIndex);
        };
        this.doPostClearAllRow = function (grid) {
            this.enableProcess.doAfterDeleteRow(grid, -1);
        };
        this.preFireValueChanged = function (key) {
            this.dependencyProcess.valueChanged(key);
        };
        this.postFireValueChanged = function (key) {
            this.enableProcess.valueChanged(key);
            this.visibleProcess.valueChanged(key);
            this.checkRuleProcess.valueChanged(key);
        };

    };

    YIUI.UIEnableProcess = YIUI.extend(YIUI.AbstractUIProcess, {
        EnabltItemType: {Head: 0, List: 1, Column: 2, Operation: 3},
        init: function (form) {
            this.base(form);
        },
        doAfterDeleteRow: function (grid, rowIndex) {
            this.calcRowCountChange(grid, rowIndex);
        },
        doAfterInsertRow: function (grid, rowIndex) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if(expItem.type == YIUI.ExprItem_Type.Set && expItem.source == grid.key){
                    this.calcExpItem(expItem);
                }
            }
            this.calcRowCountChange(grid, rowIndex);
        },
        calcRowCountChange: function (grid, rowIndex) {
            var calcKey1 = grid.key + ":RowCount", calcKey2 = grid.key + ":RowIndex";
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key == calcKey1 || item.key == calcKey2) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        var isFinish = false;
                        if (expItem.items != null && expItem.items.length > 0) {
                            var subExpItem, sTrees = [];
                            for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
                                subExpItem = expItem.items[ti];
                                sTrees[ti] = this.form.getSyntaxTree(subExpItem.right);
                                var cellLocation = this.form.getCellLocation(subExpItem.left);
                                if (cellLocation != null) {
                                    if (cellLocation.key == grid.key) {
                                        this.calcDetailRow(grid, subExpItem, sTrees, ti, rowIndex, this.getFormEnable());
                                        isFinish = true;
                                    } else if (grid.parentGrid != null && grid.parentGrid == cellLocation.key) {
                                        var targetGrid = this.form.getComponent(cellLocation.key);
                                        this.calcDetailRow(targetGrid, subExpItem, sTrees, ti, targetGrid.getFocusRowIndex(), this.getFormEnable());
                                        isFinish = true;
                                    }
                                }
                            }
                        }
                        if (!isFinish) {
                            this.calcExpItem(expItem, true);
                        }
                    }
                }
            }
        },
        calcAll: function () {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem);
            }
        },
        valueChanged: function (key) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key == key) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.type == YIUI.EnableItem.Operation) {
                            if (YIUI.TypeConvertor.toBoolean(this.form.eval(expItem.right, {form: this.form}, null))) {
                                this.form.setOperationEnable(expItem.left, true);
                            } else {
                                this.form.setOperationEnable(expItem.left, false);
                            }
                        } else {
                            this.calcExpItem(expItem, true);
                        }
                    }
                }
            }
        },
        calcOptItem: function (expItem) {
            var optInfo = this.form.getOptMap()[expItem.left];
            if (optInfo) {
                var toolbar = this.form.getComponent(optInfo.barKey);
                var enable = this.form.eval(expItem.right, {form: this.form}, null);
                if (enable == null) {
                    enable = this.getFormEnable();
                }
                toolbar.setItemEnable(expItem.left, enable);
            }
        },
        dealSubDetailComps: function (form, comp, cellKey, enable) {
            var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
            if (subDetailComps != null) {
                for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
                    var subDtlComp = subDetailComps[si];
                    subDtlComp.setEnable(enable);
                }
            }
        },
        calcDetailRow: function (comp, subExpItem, sTrees, treeIndex, rowIndex, formEnable) {
            var evalV = null, evalEnable;
            if (!comp.getRowDataAt(rowIndex).isDetail)
                return false;
            evalV = this.calcEnableByTree(this.form, subExpItem.left, sTrees[treeIndex], formEnable, rowIndex, comp.getCellIndexByKey(subExpItem.left));
            evalEnable = (evalV === null ? formEnable : evalV);
            if (subExpItem.left == "") return false;
            comp.setCellEnable(rowIndex, subExpItem.left, evalEnable);
            this.dealSubDetailComps(this.form, comp, subExpItem.left, evalEnable);
            return true;
        },
        calcEnable: function (form, expItem, formEnable, rowIndex, colIndex) {
            // var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     enable = hostProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // } else {
            //     enable = defaultProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // }
            if (!this.hasEnableRights(expItem.left))
                return false;
            return form.defaultUIStatusProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            ;
        },
        // 这个改动是暂时的,后面要重写
        calcEnableByTree: function (form, key, syntaxTree, formEnable, rowIndex, colIndex) {
            // var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     enable = hostProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // } else {
            //     enable = defaultProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
            // }
            if (!this.hasEnableRights(key))
                return false;

            return form.defaultUIStatusProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
        },
        calcExpItem: function (expItem, needCalc, isCalcSubDetailComp) {
            var comp = this.form.getComponent(expItem.source);
            if (comp == undefined) {
                comp = this.form.getPanel(expItem.source);
            }
            if (comp === undefined) {
                this.calcOptItem(expItem);
                return;
            }
            var enable = null;
            if (enable == null && isCalcSubDetailComp && comp.getMetaObj().bindingCellKey != null) {
                var parentGrid = YIUI.SubDetailUtil.getBindingGrid(this.form, comp),
                    cellData = parentGrid.getCellDataByKey(parentGrid.getFocusRowIndex(), comp.getMetaObj().bindingCellKey);
                if (cellData != null) {
                    enable = cellData[2];
                }
            }
            if (enable == null) {
                enable = this.getFormEnable();
            }
            if (expItem.type !== this.EnabltItemType.List) {
                enable = this.calcEnable(this.form, expItem, enable);
                // enable = this.calcEnable(form, expItem, enable);
            }

            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        comp.setGridEnable(enable);
                    } else {
                        comp.setEnable(enable);
                    }
                    var cell_key = comp.getMetaObj().bindingCellKey;
                    if (needCalc && cell_key != null && cell_key != "") {
                        var grid = YIUI.SubDetailUtil.getBindingGrid(this.form, comp);
                        if (grid != null) {
                            grid.setCellEnable(grid.getFocusRowIndex(), cell_key, enable);
                        }
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        $.each(comp.columnInfo, function (i, column) {
                            if (column.key == expItem.left) {
                                column.enable = enable;
                                column.el && comp.setColumnEnable(column.enable, column.el);
                            }
                        })
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        if (expItem.items == undefined) {
                            if (expItem.source == expItem.left) {  //表格自身的enable
                                comp.setGridEnable(enable);
                            } else {      //固定行的单元格的enable
                                if (expItem.left !== "") {
                                    var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left);
                                    if (fixRowInfoes !== null) {
                                        for (var n = 0, nlen = fixRowInfoes.length; n < nlen; n++) {
                                            evalV = this.calcEnable(this.form, expItem, enable, fixRowInfoes[n].rowIndex, fixRowInfoes[n].colIndex);
                                            evalEnable = (evalV === null ? enable : evalV);
                                            comp.setCellEnable(fixRowInfoes[n].rowIndex, expItem.left, evalEnable);
                                            this.dealSubDetailComps(this.form, comp, expItem.left, evalEnable);
                                        }
                                    }
                                }
                            }
                        } else {
                            var subExpItem, evalV = null, evalEnable, sTrees = [];
                            for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
                                subExpItem = expItem.items[ti];
                                sTrees[ti] = this.form.getSyntaxTree(subExpItem.right);
                            }
                            for (var ind = 0, ilen = expItem.items.length; ind < ilen; ind++) {
                                subExpItem = expItem.items[ind];
                                if (subExpItem.type == this.EnabltItemType.Column) {  //表格列的enable
                                    if (subExpItem.left == "")
                                        continue;
                                    evalV = this.calcEnableByTree(this.form, subExpItem.left, sTrees[ind], enable);
                                    evalEnable = (evalV === null ? enable : evalV);
                                    var colInfoes = comp.getFixRowInfoByCellKey(subExpItem.left);
                                    if (colInfoes == null) {
                                        colInfoes = comp.getColInfoByKey(subExpItem.left);
                                    }
                                    if (colInfoes !== null)
                                        for (var ci = 0, len = colInfoes.length; ci < len; ci++) {
                                            comp.setColumnEnable(ci, evalEnable);
                                        }
                                } else {     //表格明细单元格的enable
                                    for (var i = 0, clen = comp.getRowCount(); i < clen; i++) {
                                        this.calcDetailRow(comp, subExpItem, sTrees, ind, i, enable);
                                    }
                                }
                            }
                        }
                        comp.reShowCheckColumn();
                    }
                    break;
            }
        },
        cellValChanged: function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var item, expItems, enable, expItem, subItem, colInfoes;
            // var dealSubDetailComps = function (form, comp, cellKey, enable) {
            //     var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
            //     if (subDetailComps != null) {
            //         for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
            //             var subDtlComp = subDetailComps[si];
            //             subDtlComp.setEnable(enable);
            //         }
            //     }
            // };
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.items) {
                            for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                                subItem = expItem.items[ind];
                                if (subItem.left == "") continue;
                                colInfoes = grid.getColInfoByKey(subItem.left);
                                if (colInfoes == null) continue;
                                for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                    enable = this.form.eval(subItem.right, {form: this.form, rowIndex: rowIndex, colIndex: colInfoes[m].colIndex}, null);
                                    if (enable === null) {
                                        enable = this.getFormEnable();
                                    }
                                    grid.setCellEnable(rowIndex, subItem.left, enable);
                                    this.dealSubDetailComps(this.form, grid, subItem.left, enable);
                                }
                            }
                        } else {
                            if (expItem.left == "") continue;
                            colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) continue;
                            for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                enable = this.form.eval(expItem.right, {form: this.form, rowIndex: colInfoes[n].rowIndex, colIndex: colInfoes[n].colIndex}, null);
                                if (enable === null) {
                                    enable = this.getFormEnable();
                                }
                                grid.setCellEnable(colInfoes[n].rowIndex, expItem.left, enable);
                                this.dealSubDetailComps(this.form, grid, expItem.left, enable);
                            }
                        }
                    }
                }
            }
        },
        calcEmptyRow: function (grid, rowIndex) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, subItem, enable, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.EnabltItemType.List) {
                    if (!expItem.items) continue;
                    for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                        subItem = expItem.items[ind];
                        if (subItem.type == this.EnabltItemType.Column) continue;
                        enable = this.form.eval(subItem.right, {form: this.form, rowIndex: rowIndex}, null);
                        if (enable === null) {
                            enable = this.getFormEnable();
                        }
                        if (subItem.left == "") continue;
                        grid.setCellEnable(rowIndex, subItem.left, enable);
                    }
                }
            }
            this.calcRowCountChange(grid, rowIndex);
        },
        getFormEnable: function () {
            var operationState = this.form.getOperationState();
            return (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
        },
        calcSubDetail: function (gridKey) {
            var items = this.form.dependency.enableTree.items;
            var i, expItem, len, comp;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = this.form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem, false, true);
                }
            }
        }
    });


    // YIUI.UIEnableProcess = function (form) {
    //     this.EnabltItemType = {Head: 0, List: 1, Column: 2, Operation: 3};
    //     this.form = form;
    // this.doAfterDeleteRow = function (grid, rowIndex) {
    //     this.calcRowCountChange(grid, rowIndex);
    // };
    // this.calcRowCountChange = function (grid, rowIndex) {
    //     var calcKey = grid.key + ":RowCount";
    //     var affectItems = form.dependency.enableTree.affectItems;
    //     var item, expItems, expItem;
    //     for (var i = 0, len = affectItems.length; i < len; i++) {
    //         item = affectItems[i];
    //         if (item.key == calcKey) {
    //             expItems = item.expItems;
    //             for (var j = 0, length = expItems.length; j < length; j++) {
    //                 expItem = expItems[j];
    //                 var isFinish = false;
    //                 if (expItem.items != null && expItem.items.length > 0) {
    //                     var subExpItem, sTrees = [];
    //                     for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
    //                         subExpItem = expItem.items[ti];
    //                         sTrees[ti] = form.getSyntaxTree(subExpItem.right);
    //                         var cellLocation = form.getCellLocation(subExpItem.left);
    //                         if (cellLocation != null) {
    //                             if (cellLocation.key == grid.key) {
    //                                 this.calcDetailRow(grid, subExpItem, sTrees, j, rowIndex, this.getFormEnable());
    //                                 isFinish = true;
    //                             } else if (grid.parentGrid != null && grid.parentGrid == cellLocation.key) {
    //                                 var targetGrid = form.getComponent(cellLocation.key);
    //                                 this.calcDetailRow(targetGrid, subExpItem, sTrees, ti, targetGrid.getFocusRowIndex(), this.getFormEnable());
    //                                 isFinish = true;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 if (!isFinish) {
    //                     this.calcExpItem(expItem, true);
    //                 }
    //             }
    //         }
    //     }
    // };
    // this.calcAll = function () {
    //     var items = form.dependency.enableTree.items;
    //     var i, expItem, len;
    //     for (i = 0, len = items.length; i < len; i++) {
    //         expItem = items[i];
    //         this.calcExpItem(expItem);
    //     }
    // };
    // this.valueChanged = function (key) {
    //     var affectItems = form.dependency.enableTree.affectItems;
    //     var item, expItems, expItem;
    //     for (var i = 0, len = affectItems.length; i < len; i++) {
    //         item = affectItems[i];
    //         if (item.key == key) {
    //             expItems = item.expItems;
    //             for (var j = 0, length = expItems.length; j < length; j++) {
    //                 expItem = expItems[j];
    //                 if (expItem.type == YIUI.EnableItem.Operation) {
    //                     if (YIUI.TypeConvertor.toBoolean(form.eval(expItem.right, {form: form}, null))) {
    //                         form.setOperationEnable(expItem.left, true);
    //                     } else {
    //                         form.setOperationEnable(expItem.left, false);
    //                     }
    //                 } else {
    //                     this.calcExpItem(expItem, true);
    //                 }
    //             }
    //         }
    //     }
    // };
    // this.calcOptItem = function (expItem) {
    //     var optInfo = form.getOptMap()[expItem.left];
    //     if (optInfo) {
    //         var toolbar = form.getComponent(optInfo.barKey);
    //         var enable = form.eval(expItem.right, {form: form}, null);
    //         if (enable == null) {
    //             enable = this.getFormEnable();
    //         }
    //         toolbar.setItemEnable(expItem.left, enable);
    //     }
    // };
    // this.dealSubDetailComps = function (form, comp, cellKey, enable) {
    //     var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
    //     if (subDetailComps != null) {
    //         for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
    //             var subDtlComp = subDetailComps[si];
    //             subDtlComp.setEnable(enable);
    //         }
    //     }
    // };
    // this.calcDetailRow = function (comp, subExpItem, sTrees, treeIndex, rowIndex, formEnable) {
    //     var evalV = null, evalEnable;
    //     if (!comp.getRowDataAt(rowIndex).isDetail)
    //         return false;
    //     evalV = this.calcEnableByTree(form, subExpItem.left, sTrees[treeIndex], formEnable, rowIndex, comp.getCellIndexByKey(subExpItem.left));
    //     evalEnable = (evalV === null ? formEnable : evalV);
    //     if (subExpItem.left == "") return false;
    //     comp.setCellEnable(rowIndex, subExpItem.left, evalEnable);
    //     this.dealSubDetailComps(form, comp, subExpItem.left, evalEnable);
    //     return true;
    // };
//         this.calcEnable = function (form, expItem, formEnable, rowIndex, colIndex) {
//             var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
//             if (hostProxy != null) {
//                 enable = hostProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             } else {
//                 enable = defaultProxy.validateEnable(expItem.left, expItem.right, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             }
//             return enable;
//         };
//         this.calcEnableByTree = function (form, key, syntaxTree, formEnable, rowIndex, colIndex) {
//             var enable = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
//             if (hostProxy != null) {
//                 enable = hostProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             } else {
//                 enable = defaultProxy.validateEnableByTree(key, syntaxTree, {form: form, rowIndex: rowIndex, colIndex: colIndex}, formEnable);
//             }
//             return enable;
//         };
//         this.calcExpItem = function (expItem, needCalc, isCalcSubDetailComp) {
//             var comp = form.getComponent(expItem.source);
//             if (comp == undefined) {
//                 comp = form.getPanel(expItem.source);
//             }
//             if (comp === undefined) {
//                 this.calcOptItem(expItem);
//                 return;
//             }
//             var enable = null;
//             if (enable == null && isCalcSubDetailComp && comp.getMetaObj().bindingCellKey != null) {
//                 var parentGrid = YIUI.SubDetailUtil.getBindingGrid(form, comp),
//                     cellData = parentGrid.getCellDataByKey(parentGrid.getFocusRowIndex(), comp.getMetaObj().bindingCellKey);
//                 if (cellData != null) {
//                     enable = cellData[2];
//                 }
//             }
//             if (enable == null) {
//                 enable = this.getFormEnable();
//             }
//             if (expItem.type !== this.EnabltItemType.List) {
//                 enable = this.calcEnable(form, expItem, enable);
//             }
//
//             switch (expItem.type) {
//                 case YIUI.ExprItem_Type.Item:
//                     if (comp.type == YIUI.CONTROLTYPE.GRID) {
//                         comp.setGridEnable(enable);
//                     } else {
//                         comp.setEnable(enable);
//                     }
//                     var cell_key = comp.getMetaObj().bindingCellKey;
//                     if (needCalc && cell_key != null && cell_key != "") {
//                         var grid = YIUI.SubDetailUtil.getBindingGrid(form, comp);
//                         if (grid != null) {
//                             grid.setCellEnable(grid.getFocusRowIndex(), cell_key, enable);
//                         }
//                     }
//                     break;
//                 case YIUI.ExprItem_Type.Set:
//                     if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
//                         $.each(comp.columnInfo, function (i, column) {
//                             if (column.key == expItem.left) {
//                                 column.enable = enable;
//                                 column.el && comp.setColumnEnable(column.enable, column.el);
//                             }
//                         })
//                     } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
//                         if (expItem.items == undefined) {
//                             if (expItem.source == expItem.left) {  //表格自身的enable
//                                 comp.setGridEnable(enable);
//                             } else {      //固定行的单元格的enable
//                                 if (expItem.left !== "") {
//                                     var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left);
//                                     if (fixRowInfoes !== null) {
//                                         for (var n = 0, nlen = fixRowInfoes.length; n < nlen; n++) {
// //	                                        evalV = form.eval(expItem.right, {form: form, rowIndex: fixRowInfoes[n].rowIndex, colIndex: fixRowInfoes[n].colIndex}, null);
//                                             evalV = this.calcEnable(form, expItem, enable, fixRowInfoes[n].rowIndex, fixRowInfoes[n].colIndex);
//                                             evalEnable = (evalV === null ? enable : evalV);
//                                             comp.setCellEnable(fixRowInfoes[n].rowIndex, expItem.left, evalEnable);
//                                             this.dealSubDetailComps(form, comp, expItem.left, evalEnable);
//                                         }
//                                     }
//                                 }
//                             }
//                         } else {
//                             var subExpItem, evalV = null, evalEnable, sTrees = [];
//                             for (var ti = 0, tlen = expItem.items.length; ti < tlen; ti++) {
//                                 subExpItem = expItem.items[ti];
//                                 sTrees[ti] = form.getSyntaxTree(subExpItem.right);
//                             }
//                             for (var ind = 0, ilen = expItem.items.length; ind < ilen; ind++) {
//                                 subExpItem = expItem.items[ind];
//                                 if (subExpItem.type == this.EnabltItemType.Column) {  //表格列的enable
//                                     if (subExpItem.left == "") continue;
//                                     evalV = null;
// //	                                if (subExpItem.right.length !== 0) {
// //	                                    if (subExpItem.right.toLowerCase() == "true" || subExpItem.right.toLowerCase() == "false") {
// //	                                        evalV = ( subExpItem.right.toLowerCase() == "true" );
// //	                                    } else {
// //	                                        evalV = form.evalByTree(sTrees[ind], {form: form}, null);
// //	                                    }
// //	                                }
//                                     evalV = this.calcEnableByTree(form, subExpItem.left, sTrees[ind], enable);
//                                     evalEnable = (evalV === null ? enable : evalV);
//                                     var colInfoes = comp.getFixRowInfoByCellKey(subExpItem.left);
//                                     if (colInfoes == null) {
//                                         colInfoes = comp.getColInfoByKey(subExpItem.left);
//                                     }
//                                     if (colInfoes !== null)
//                                         for (var ci = 0, len = colInfoes.length; ci < len; ci++) {
//                                             comp.setColumnEnable(ci, evalEnable);
//                                         }
//                                 } else {     //表格明细单元格的enable
//                                     for (var i = 0, clen = comp.getRowCount(); i < clen; i++) {
//                                         this.calcDetailRow(comp, subExpItem, sTrees, ind, i, enable);
//                                     }
//                                 }
//                             }
//                         }
//                         comp.reShowCheckColumn();
//                     }
//                     break;
//             }
//
//         };
//         this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
//             var affectItems = form.dependency.enableTree.affectItems;
//             var item, expItems, enable, expItem, subItem, colInfoes;
//             var dealSubDetailComps = function (form, comp, cellKey, enable) {
//                 var subDetailComps = form.getCellSubDtlComps(comp.key, cellKey);
//                 if (subDetailComps != null) {
//                     for (var si = 0, slen = subDetailComps.length; si < slen; si++) {
//                         var subDtlComp = subDetailComps[si];
//                         subDtlComp.setEnable(enable);
//                     }
//                 }
//             };
//             for (var i = 0, len = affectItems.length; i < len; i++) {
//                 item = affectItems[i];
//                 if (item.key.toLowerCase() == cellKey.toLowerCase()) {
//                     expItems = item.expItems;
//                     for (var j = 0, length = expItems.length; j < length; j++) {
//                         expItem = expItems[j];
//                         if (expItem.items) {
//                             for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
//                                 subItem = expItem.items[ind];
//                                 if (subItem.left == "") continue;
//                                 colInfoes = grid.getColInfoByKey(subItem.left);
//                                 if (colInfoes == null) continue;
//                                 for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
//                                     enable = form.eval(subItem.right, {form: form, rowIndex: rowIndex, colIndex: colInfoes[m].colIndex}, null);
//                                     if (enable === null) {
//                                         enable = this.getFormEnable();
//                                     }
//                                     grid.setCellEnable(rowIndex, subItem.left, enable);
//                                     dealSubDetailComps(form, grid, subItem.left, enable);
//                                 }
//                             }
//                         } else {
//                             if (expItem.left == "") continue;
//                             colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
//                             if (colInfoes == null) continue;
//                             for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
//                                 enable = form.eval(expItem.right, {form: form, rowIndex: colInfoes[n].rowIndex, colIndex: colInfoes[n].colIndex}, null);
//                                 if (enable === null) {
//                                     enable = this.getFormEnable();
//                                 }
//                                 grid.setCellEnable(colInfoes[n].rowIndex, expItem.left, enable);
//                                 dealSubDetailComps(form, grid, expItem.left, enable);
//                             }
//                         }
//                     }
//                 }
//             }
//         };
//         this.calcEmptyRow = function (grid, rowIndex) {
//             var items = form.dependency.enableTree.items;
//             var i, expItem, subItem, enable, len;
//             for (i = 0, len = items.length; i < len; i++) {
//                 expItem = items[i];
//                 if (expItem.source === grid.key && expItem.type === this.EnabltItemType.List) {
//                     if (!expItem.items) continue;
//                     for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
//                         subItem = expItem.items[ind];
//                         if (subItem.type == this.EnabltItemType.Column) continue;
//                         enable = form.eval(subItem.right, {form: form, rowIndex: rowIndex}, null);
//                         if (enable === null) {
//                             enable = this.getFormEnable();
//                         }
//                         if (subItem.left == "") continue;
//                         grid.setCellEnable(rowIndex, subItem.left, enable);
//                     }
//                 }
//             }
//             this.calcRowCountChange(grid, rowIndex);
//         };
//         this.getFormEnable = function () {
//             var operationState = form.getOperationState();
//             return (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
//         };
//         this.calcSubDetail = function (gridKey) {
//             var items = form.dependency.enableTree.items;
//             var i, expItem, len, comp;
//             for (i = 0, len = items.length; i < len; i++) {
//                 expItem = items[i];
//                 comp = form.getComponent(expItem.source);
//                 if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
//                     this.calcExpItem(expItem, false, true);
//                 }
//             }
//         }
//     };


    YIUI.UIVisibleProcess = YIUI.extend(YIUI.AbstractUIProcess, {
        VisibleItemType: {Head: 0, Column: 1, Operation: 2},
        init: function (form) {
            this.base(form);
        },
        calcAll: function () {
            var items = this.form.dependency.visibleTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem);
            }
        },
        valueChanged: function (key) {
            var affectItems = this.form.dependency.visibleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem);
                    }
                }
            }
        },
        cellValChanged: function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = this.form.dependency.visibleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem);
                    }
                }
            }
        },
        calcOptItem: function (expItem) {
            var optInfo = this.form.getOptMap()[expItem.left];
            if (optInfo) {
                var toolbar = this.form.getComponent(optInfo.barKey);
                var visible = this.form.eval(expItem.right, {form: this.form}, null);
                visible = (visible === null ? true : visible);
                toolbar.setItemVisible(expItem.left, visible);
            }
        },
        calcVisible: function (form, expItem) {
            // var visible = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
            // if (hostProxy != null) {
            //     visible = hostProxy.validateVisible(expItem.left, expItem.right, {form: form});
            // } else {
            //     visible = defaultProxy.validateVisible(expItem.left, expItem.right, {form: form});
            // }
            if (!this.hasVisibleRights(expItem.left))
                return false;

            return form.defaultUIStatusProxy.validateVisible(expItem.left, expItem.right, {form: form});
        },
        calcExpItem: function (expItem) {
            var comp = this.form.getComponent(expItem.source);
            if (comp == undefined) {
                comp = this.form.getPanel(expItem.source);
                this.calcOptItem(expItem);
                return;
            }
            var visible = this.calcVisible(this.form, expItem);
            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    if (comp.isBuddy())
                        return;
                    comp.setVisible(visible);
                    //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
                    if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
                        if (!this.form.errorInfo.error) {
                            if (comp.isRequired()) {
                                this.form.setError(true, comp.key + "必填", comp.key);
                            } else {
                                this.form.setError(true, comp.errorInfo.msg, comp.key);
                            }
                        }
                    } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
                        if (this.form.errorInfo.error &&
                            this.form.errorInfo.errorSource != null && this.form.errorInfo.errorSource == comp.key) {
                            this.form.setError(false, null);
                        }
                    }
                    var ownerCt = comp.ownerCt;
                    if (ownerCt && ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
                        if (comp.visible == visible) return;
                        ownerCt.reLayout();
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        var i, column, len;
                        for (i = 0, len = comp.columnInfo.length; i < len; i++) {
                            column = comp.columnInfo[i];
                            if (column.key === expItem.left) {
                                column.visible = visible;
                                comp.setColumnVisible(column.key, visible);
                                break;
                            }
                        }
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        if (expItem.type !== this.VisibleItemType.Column) return;
                        comp.setColumnVisible(expItem.left, visible);
                    }
                    break;
            }
        },
        calcSubDetail: function (gridKey) {
            var items = this.form.dependency.visibleTree.items;
            var i, expItem, comp, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = this.form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem);
                }
            }
        }
    });


    //
    // YIUI.UIVisibleProcess = function (form) {
    //     this.VisibleItemType = {Head: 0, Column: 1, Operation: 2};
    //     this.form = form;
    //     this.calcAll = function () {
    //         var items = form.dependency.visibleTree.items;
    //         var i, expItem, len;
    //         for (i = 0, len = items.length; i < len; i++) {
    //             expItem = items[i];
    //             this.calcExpItem(expItem);
    //         }
    //     };
    //     this.valueChanged = function (key) {
    //         var affectItems = form.dependency.visibleTree.affectItems;
    //         var item, expItems, expItem;
    //         for (var i = 0, len = affectItems.length; i < len; i++) {
    //             item = affectItems[i];
    //             if (item.key.toLowerCase() == key.toLowerCase()) {
    //                 expItems = item.expItems;
    //                 for (var j = 0, length = expItems.length; j < length; j++) {
    //                     expItem = expItems[j];
    //                     this.calcExpItem(expItem);
    //                 }
    //             }
    //         }
    //     };
    //     this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
    //         var affectItems = form.dependency.visibleTree.affectItems;
    //         var item, expItems, expItem;
    //         for (var i = 0, len = affectItems.length; i < len; i++) {
    //             item = affectItems[i];
    //             if (item.key.toLowerCase() == cellKey.toLowerCase()) {
    //                 expItems = item.expItems;
    //                 for (var j = 0, length = expItems.length; j < length; j++) {
    //                     expItem = expItems[j];
    //                     this.calcExpItem(expItem);
    //                 }
    //             }
    //         }
    //     };
    //     this.calcOptItem = function (expItem) {
    //         var optInfo = form.getOptMap()[expItem.left];
    //         if (optInfo) {
    //             var toolbar = form.getComponent(optInfo.barKey);
    //             var visible = form.eval(expItem.right, {form: form}, null);
    //             visible = (visible === null ? true : visible);
    //             toolbar.setItemVisible(expItem.left, visible);
    //         }
    //     };
    //     this.calcVisible = function (form, expItem) {
    //         var visible = false, defaultProxy = form.defaultUIStatusProxy, hostProxy = form.hostUIStatusProxy;
    //         if (hostProxy != null) {
    //             visible = hostProxy.validateVisible(expItem.left, expItem.right, {form: form});
    //         } else {
    //             visible = defaultProxy.validateVisible(expItem.left, expItem.right, {form: form});
    //         }
    //         return visible;
    //     };
    //     this.calcExpItem = function (expItem) {
    //         var comp = form.getComponent(expItem.source);
    //         if (comp == undefined) {
    //             comp = form.getPanel(expItem.source);
    //             this.calcOptItem(expItem);
    //             return;
    //         }
    //         var visible = this.calcVisible(form, expItem);
    //         switch (expItem.type) {
    //             case YIUI.ExprItem_Type.Item:
    //                 if (comp.isBuddy())
    //                     return;
    //                 comp.setVisible(visible);
    //                 //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
    //                 if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
    //                     if (!form.errorInfo.error) {
    //                         if (comp.isRequired()) {
    //                             form.setError(true, comp.key + "必填", comp.key);
    //                         } else {
    //                             form.setError(true, comp.errorInfo.msg, comp.key);
    //                         }
    //                     }
    //                 } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
    //                     if (form.errorInfo.error &&
    //                         form.errorInfo.errorSource != null && form.errorInfo.errorSource == comp.key) {
    //                         form.setError(false, null);
    //                     }
    //                 }
    //                 var ownerCt = comp.ownerCt;
    //                 if (ownerCt && ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
    //                     if (comp.visible == visible) return;
    //                     ownerCt.reLayout();
    //                 }
    //                 break;
    //             case YIUI.ExprItem_Type.Set:
    //                 if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
    //                     var i, column, len;
    //                     for (i = 0, len = comp.columnInfo.length; i < len; i++) {
    //                         column = comp.columnInfo[i];
    //                         if (column.key === expItem.left) {
    //                             column.visible = visible;
    //                             comp.setColumnVisible(column.key, visible);
    //                             break;
    //                         }
    //                     }
    //                 } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
    //                     if (expItem.type !== this.VisibleItemType.Column) return;
    //                     comp.setColumnVisible(expItem.left, visible);
    //                 }
    //                 break;
    //         }
    //     };
    //     this.calcSubDetail = function (gridKey) {
    //         var items = form.dependency.visibleTree.items;
    //         var i, expItem, comp, len;
    //         for (i = 0, len = items.length; i < len; i++) {
    //             expItem = items[i];
    //             comp = form.getComponent(expItem.source);
    //             if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
    //                 this.calcExpItem(expItem);
    //             }
    //         }
    //     }
    // };
    YIUI.UICalcProcess = function (form) {
        this.CalcItemType = {Head: 0, List: 1};
        this.form = form;
        this.doAfterDeleteRow = function (grid, rowIndex) {
            var metaDtlRow = grid.metaRowInfo.rows[grid.metaRowInfo.dtlRowIndex];
            var affectItems = form.dependency.calcTree.affectItems;
            var item, expItems, expItem, needCalcItems = [];
            for (var i = 0, len = metaDtlRow.cells.length; i < len; i++) {
                var metaCell = metaDtlRow.cells[i];
                for (var ind = 0, ilen = affectItems.length; ind < ilen; ind++) {
                    item = affectItems[ind];
                    if (item.key.toLowerCase() == metaCell.key.toLowerCase()) {
                        if (item.expItems == null || item.expItems.length == 0) {
                            needCalcItems.push(item);
                        } else {
                            for (var m = 0, mlen = item.expItems.length; m < mlen; m++) {
                                expItem = item.expItems[m];
                                var g = form.getComponent(expItem.source);
                                if (YIUI.SubDetailUtil.isSubDetail(form, grid, g.key)) {
                                    this.calcEmptyRow(g, g.getFocusRowIndex());
                                }
                            }
                        }
                    }
                }
            }
            needCalcItems.sort(function (item1, item2) {
                return parseFloat(item1.order) - parseFloat(item2.order);
            });
            for (var k = 0, kLen = needCalcItems.length; k < kLen; k++) {
                this.calcExpItem(needCalcItems[k], true);
            }
        };
        this.calcAll = function (commitValue) {
            switch (form.getOperationState()) {
                case YIUI.Form_OperationState.New:
                    //新增表单,全部计算
                    this.calcAllItems(true, commitValue);
                    break;
                case YIUI.Form_OperationState.Default:
                case YIUI.Form_OperationState.Edit:
                    //打开表单,计算没有数据绑定的
                    this.calcAllItems(false, commitValue);
                    break;
                default:
                    break;
            }
        };
        this.calcAllItems = function (calcAll, commitValue) {
            var items = form.dependency.calcTree.items;
            var i, expItem, len;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                this.calcExpItem(expItem, calcAll, commitValue);
            }
        };
        this.valueChanged = function (key) {
            var affectItems = form.dependency.calcTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.calcExpItem(expItem, true);
                    }
                }
            }
        };
        this.hasDefaultValue = function (expItem) {
            return (expItem.formulaValue !== null && expItem.formulaValue.length > 0)
                || (expItem.defaultValue !== null && expItem.defaultValue.length > 0);
        };
        this.isNeedCalcDefaultValue = function (curGridKey, metaRow, rowIndex, cellIndex) {
            var valueDependency = metaRow.cells[cellIndex].valueDependency, isNeedCalc = true;
            if (valueDependency != null) {
                var dependencyArray = valueDependency.split(",");
                for (var di = 0, dlen = dependencyArray.length; di < dlen; di++) {
                    var dependency = dependencyArray[di],
                        dpComp = form.getCellLocation(dependency);
                    if (dpComp == null) {
                        dpComp = form.getComponent(dependency);
                    } else {
                        dpComp = form.getComponent(dpComp.key);
                    }
                    if (dpComp != null && dpComp.parentGrid != null && dpComp.parentGrid == curGridKey) {
                        var pGrid = form.getComponent(dpComp.parentGrid);
                        if (pGrid != null && pGrid.getFocusRowIndex() != rowIndex) {
                            isNeedCalc = false;
                        }
                    }
                }
            }
            return isNeedCalc;
        };
        this.getCalcValue = function (expItem, rowIndex, colIndex, gridKey, metaRow) {
            var value, cxt = {form: form};
            if (expItem.formulaValue !== null && expItem.formulaValue.length > 0) {
                if ((metaRow != null && this.isNeedCalcDefaultValue(gridKey, metaRow, rowIndex, colIndex)) || metaRow == null)
                    value = form.eval(expItem.formulaValue, {form: form, target: expItem.left, rowIndex: rowIndex, colIndex: colIndex}, null);
            } else if (expItem.defaultValue !== null && expItem.defaultValue.length > 0) {
                value = expItem.defaultValue;
            }
            return value;
        };
        this.cellValChanged = function (grid, rowIndex, cellIndex, cellkey) {
            var affectItems = form.dependency.calcTree.affectItems, self = this,
                item, expItems, expItem, value, colInfoes, comp, calcV, metaRow;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellkey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        comp = form.getComponent(expItem.source);
                        if (comp.type == YIUI.CONTROLTYPE.GRID) {
                            colInfoes = comp.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) {
                                colInfoes = comp.getColInfoByKey(expItem.left);
                                if (colInfoes !== null) {
                                    for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                        metaRow = comp.metaRowInfo.rows[comp.metaRowInfo.dtlRowIndex];
                                        calcV = self.getCalcValue(expItem, rowIndex, colInfoes[m].colIndex, grid.key, metaRow);
                                        if (calcV === undefined) continue;
//                                        if (comp.getFocusRowIndex() != -1 && comp.getFocusRowIndex() != rowIndex) {
//                                            rowIndex = comp.getFocusRowIndex();
//                                        }
                                        comp.setValueAt(rowIndex, colInfoes[m].colIndex, calcV, true, false, true);
                                    }
                                }
                            } else {
                                for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                    metaRow = comp.metaRowInfo.rows[colInfoes[n].metaRowIndex];
                                    calcV = self.getCalcValue(expItem, colInfoes[n].rowIndex, colInfoes[n].colIndex, grid.key, metaRow);
                                    if (calcV === undefined) continue;
                                    comp.setValueAt(colInfoes[n].rowIndex, colInfoes[n].colIndex, calcV, true, false, true);
                                }
                            }
                            YIUI.GridSumUtil.evalSum(form, comp);
                        } else {
                            value = this.getCalcValue(expItem);
                            comp.setValue(value, true, false);
                        }
                    }
                }
            }
        };
        this.calcExpItem = function (expItem, calcAll, commitValue) {
            var comp = form.getComponent(expItem.source), needCalc, calcV;
            if (comp === undefined) return;

            switch (expItem.type) {
                case YIUI.ExprItem_Type.Item:
                    var hasData = (comp.tableKey !== undefined && comp.tableKey.length !== 0
                        && comp.columnKey !== undefined && comp.columnKey.length !== 0);
                    if (calcAll) {
                        needCalc = true;
                    } else {
                        needCalc = !hasData && (comp.getMetaObj().bindingCellkey == undefined || comp.getMetaObj().bindingCellkey.length == 0);
                    }
                    if (needCalc) {
                        calcV = this.getCalcValue(expItem);
                        if (calcV !== undefined) comp.setValue(calcV, true, false);
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        var getColInfo = function (colKey) {
                            var colInfo;
                            for (var ind = 0, clen = comp.columnInfo.length; ind < clen; ind++) {
                                colInfo = comp.columnInfo[ind];
                                if (colInfo.key === colKey) {
                                    return {index: ind, col: colInfo};
                                }
                            }
                            return null;
                        };
                        var colInfo = getColInfo(expItem.left);
                        if (calcAll) {
                            needCalc = true;
                        } else {
                            needCalc = colInfo.col.columnKey === undefined || (colInfo.col.columnKey.length == 0);
                        }
                        if (needCalc) {
                            for (var i = 0, len = comp.data.length; i < len; i++) {
                                calcV = this.getCalcValue(expItem, i, colInfo.index);
                                if (calcV !== undefined) {
                                    comp.setValByIndex(i, colInfo.index, calcV);
                                }
                            }
                        }
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        var rowData, self = this, cEditOpt , cInfoes = comp.getFixRowInfoByCellKey(expItem.left), cInfo, isNotDetail = true;
                        var calcValue = function (colInfo, rowIndex, colIndex) {
                            cEditOpt = cInfo.cell;
                            if (calcAll) {
                                needCalc = true;
                            } else {
                                needCalc = (cEditOpt.columnKey == undefined || cEditOpt.columnKey.length == 0);
                            }
                            if (needCalc && self.hasDefaultValue(expItem)) {
                                rowData = comp.getRowDataAt(rowIndex);
                                var commit = !(rowData.isDetail && rowData.bookmark == undefined) && commitValue;
                                calcV = self.getCalcValue(expItem, rowIndex, colIndex, comp.key, colInfo.metaRow);
                                if (calcV !== undefined) {
                                    comp.setValueAt(rowIndex, colIndex, calcV, commit, false, true);
                                }
                            }
                        };
                        if (cInfoes == null) {
                            cInfoes = comp.getColInfoByKey(expItem.left);
                            isNotDetail = false;
                        }
                        if (cInfoes == null) return;
                        if (isNotDetail) {
                            for (var m = 0, mlen = cInfoes.length; m < mlen; m++) {
                                cInfo = cInfoes[m];
                                calcValue(cInfo, cInfo.rowIndex, cInfo.colIndex);
                            }
                        } else {
                            for (var ind = 0, dlen = comp.getRowCount(); ind < dlen; ind++) {
                                rowData = comp.getRowDataAt(ind);
                                if (rowData.isDetail) {
                                    for (var n = 0, nlen = cInfoes.length; n < nlen; n++) {
                                        cInfo = cInfoes[n];
                                        calcValue(cInfo, ind, cInfo.colIndex);
                                    }
                                }
                            }
                        }
                        YIUI.GridSumUtil.evalSum(form, comp);
                    }
                    break;
            }

        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var items = form.dependency.calcTree.items, rd = grid.getRowDataAt(rowIndex);
            if (!rd.isDetail) return;
            var i, len, expItem, colInfoes, value, needCalc, calcV, rnct, colIndex;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.CalcItemType.List) {
                    colInfoes = grid.getColInfoByKey(expItem.left);
                    if (colInfoes == null) continue;
                    for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                        colIndex = colInfoes[j].colIndex;
                        rnct = grid.showRowHead ? 1 : 0;
                        calcV = this.getCalcValue(expItem, rowIndex, colIndex, grid.key, colInfoes[j].metaRow);
                        if (calcV == undefined) continue;
                        grid.setValueAt(rowIndex, colIndex, calcV, false, true, true, true);
                        value = null;
                    }
                }
            }
        };
        this.calcSubDetail = function (gridKey) {
            var items = form.dependency.calcTree.items;
            var i, expItem, len, comp;
            for (i = 0, len = items.length; i < len; i++) {
                expItem = items[i];
                comp = form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.calcExpItem(expItem);
                }
            }
        }
    };
    YIUI.UICheckRuleProcess = function (form) {
        this.CheckRuleItemType = {Head: 0, List: 1};
        this.form = form;
        this.checkAll = function () {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;

            // 计算全局检查规则
            this.checkGlobal();
            // 计算组件中的检查规则
            this.checkAllComponent(enableOnly);
            // 计算所有表格中行的检查规则
            this.checkAllRowCheckRule();
        };
        this.checkGlobal = function () {
            if (!form.checkRules) return;
            var i, len, checkRule, result = true;
            for (i = 0, len = form.checkRules.length; i < len; i++) {
                checkRule = form.checkRules[i];
                if (checkRule.content && checkRule.content.length > 0) {
                    result = form.eval($.trim(checkRule.content), {form: form}, null);
                    form.setError(!result, checkRule.errorMsg);
                    if (!result) break;
                }
            }
        };
        this.checkAllRowCheckRule = function () {
            var i, j, gridInfo, grid, len, dlen;
            for (i = 0, len = form.getGridInfoMap().length; i < len; i++) {
                gridInfo = form.getGridInfoMap()[i];
                grid = form.getComponent(gridInfo.key);
                grid.errorInfoes.rows = [];
                for (j = 0, dlen = grid.getRowCount(); j < dlen; j++) {
                    if (grid.getRowDataAt(j).isDetail) {
                        this.checkRow(grid, j);
                    }
                }
                grid.setGridErrorRows(grid.errorInfoes.rows);
            }
        };
        this.checkRow = function (grid, rowIndex) {
            if (rowIndex == -1 || grid.rowCheckRules == null)return;
            var k , len, rowCheckRule, result = true,
                metaRowIndex = grid.getRowDataAt(rowIndex).metaRowIndex,
                rowCheckRules;
            if (grid.rowCheckRules){
            	rowCheckRules = grid.rowCheckRules[metaRowIndex];
            }
            if (!rowCheckRules) return;
            for (k = 0, len = rowCheckRules.length; k < len; k++) {
                rowCheckRule = rowCheckRules[k];
                result = form.eval($.trim(rowCheckRule.content), {form: form, rowIndex: rowIndex}, null);
                if (!result) {
                    var length = grid.errorInfoes.rows.length, errorRow, match = false;
                    for (var m = 0; m < length; m++) {
                        errorRow = grid.errorInfoes.rows[m];
                        if (errorRow.rowIndex == rowIndex) {
                            match = true;
                            break;
                        }
                    }
                    if (!match)  grid.errorInfoes.rows.push({rowIndex: rowIndex, errorMsg: rowCheckRule.errorMsg});
                } else {
                    var rlen = grid.errorInfoes.rows.length, errRow;
                    for (var i = rlen - 1; i >= 0; i--) {
                        errRow = grid.errorInfoes.rows[i];
                        if (errRow.rowIndex == rowIndex) {
                            grid.errorInfoes.rows.splice(i, 1);
                        }
                    }
                }
            }
        };

        var impl_rowCountChanged = function (grid) {
            // 计算行数改变的影响,影响的对象为头控件和父表格
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem,colIndex,result;
            var key = grid.key + ":RowCount";
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() !== key.toLowerCase())
                    continue;
                expItems = item.expItems;
                for (var j = 0, length = expItems.length; j < length; j++) {
                    expItem = expItems[j];
                    var comp = form.getComponent(expItem.source);
                    if( expItem.items && comp.type == YIUI.CONTROLTYPE.GRID ) { // 影响父表格
                        for( var k = 0,size = expItem.items.length;k < size;k++ ) {
                            var exp = expItem.items[i];
                            var colInfoes = comp.getColInfoByKey(exp.left);
                            if( !colInfoes )
                                continue;
                            for (var k = 0, len = colInfoes.length; k < len; k++) {
                                colIndex = colInfoes[j].colIndex;
                                result = form.eval(exp.content, {form: form, rowIndex: comp.getFocusRowIndex(), colIndex: colIndex}, null);
                                comp.modifyCellErrors(comp.getFocusRowIndex(), colIndex, result, exp.errorMsg);
                            }
                        }
                    } else {
                        this.checkComponent(expItem, false, true);
                    }
                }

            }
        }

        this.doAfterDeleteRow = function (grid, rowIndex) {
            this.checkGlobal();

            impl_rowCountChanged.call(this,grid);
        }

        this.checkAllComponent = function (enableOnly) {
            var items = form.dependency.checkRuleTree.items;
            var i, expItem, gridMap = form.getGridInfoMap(), len = gridMap.length, ilen = items.length;
            for (var j = 0; j < len; j++) {
                var grid = form.getComponent(gridMap[j].key);
                grid.errorInfoes.cells = [];
            }
            for (i = 0; i < ilen; i++) {
                expItem = items[i];
                this.checkComponent(expItem, enableOnly, false);
            }
        };
        this.checkComponent = function (expItem, enableOnly, needCheck) {
            var comp = form.getComponent(expItem.source), result = true;
            // 在只计算可用组件的情况下,如果组件不可用,不计算
            if (comp === undefined || (enableOnly && !comp.isEnable())) return;
            if (comp.type == YIUI.CONTROLTYPE.GRID) {
                if (expItem.items == undefined) {
                    if (expItem.content && expItem.content.length > 0) {
                        var fixRowInfoes = comp.getFixRowInfoByCellKey(expItem.left), fixRowInfo;
                        if (fixRowInfoes == null) return;
                        for (var fi = 0, flen = fixRowInfoes.length; fi < flen; fi++) {
                            fixRowInfo = fixRowInfoes[fi];
                            result = form.eval($.trim(expItem.content), {form: form, rowIndex: fixRowInfo.rowIndex, colIndex: fixRowInfo.colIndex}, null);
                            comp.modifyCellErrors(fixRowInfo.rowIndex, fixRowInfo.colIndex, result, expItem.errorMsg);
                        }
                    } else {
                        return;
                    }
                } else {
                    var subExpItem, colInfoes, rowData;
                    for (var ind = 0, len = expItem.items.length; ind < len; ind++) {
                        subExpItem = expItem.items[ind];
                        if (!subExpItem.content || subExpItem.content.length == 0) continue;
                        for (var i = 0, dlen = comp.getRowCount(); i < dlen; i++) {
                            rowData = comp.getRowDataAt(i);
                            if (!rowData.isDetail) continue;
                            colInfoes = comp.getColInfoByKey(subExpItem.left);
                            if (colInfoes == null) continue;
                            for (var ci = 0, clen = colInfoes.length; ci < clen; ci++) {
                                result = form.eval(subExpItem.content, {form: form, rowIndex: i, colIndex: colInfoes[ci].colIndex}, null);
                                comp.modifyCellErrors(i, colInfoes[ci].colIndex, result, subExpItem.errorMsg);
                            }
                        }
                    }
                }
                comp.setGridErrorCells(comp.errorInfoes.cells);
            } else if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                //TODO ListView的单元格检查
            } else {
                var selfDefined = false, selfRequiredDefined = false, cellErrorInfo, cellData;
                if (comp.getMetaObj().required) {
                    comp.setRequired(comp.isNull());
                    selfRequiredDefined = true;
                }
                if (expItem.content && expItem.content.length > 0) {
                    result = form.eval($.trim(expItem.content), {form: form}, null);
                    if (result) {
                        comp.setError(false, null);
                    } else {
                        comp.setError(true, expItem.errorMsg);
                    }
                    selfDefined = true;
                }
                cellErrorInfo = YIUI.SubDetailUtil.getBindingCellError(form, comp);
                cellData = YIUI.SubDetailUtil.getBindingCellData(form, comp);
                if (!selfDefined && cellErrorInfo != null) {
                    comp.setError(true, cellErrorInfo.errorMsg);
                }
                if (!selfRequiredDefined && cellData != null) {
                    comp.setRequired(cellData[3]);
                }
                //控件检查没通过时，判断是否隐藏，如果隐藏，且form没有错误提示，则提示出控件的错误。
                if (!comp.isVisible() && (comp.errorInfo.error || comp.isRequired())) {
                    if (!form.errorInfo.error) {
                        if (comp.isRequired()) {
                            form.setError(true, comp.key + "必填", comp.key);
                        } else {
                            form.setError(true, comp.errorInfo.msg, comp.key);
                        }
                    }
                } else { //如果控件可见，或者通过检查，则判断当前form的错误是否由该控件引起，如果是，删除错误提示。
                    if (form.errorInfo.error &&
                        form.errorInfo.errorSource != null && form.errorInfo.errorSource == comp.key) {
                        form.setError(false, null);
                    }
                }
                if (needCheck && comp.getMetaObj().bindingCellKey != null) {
                    var grid = YIUI.SubDetailUtil.getBindingGrid(form, comp);
                    var rowIndex = grid.getFocusRowIndex(), cellIndex = grid.getCellIndexByKey(comp.getMetaObj().bindingCellKey);
                    if (rowIndex > -1 && cellIndex > -1) {
                        grid.modifyCellErrors(rowIndex, cellIndex, !comp.errorInfo.error, comp.errorInfo.msg);
                        grid.setGridErrorCells(grid.errorInfoes.cells);
                        grid.setCellRequired(rowIndex, cellIndex, comp.isRequired());
                    }
                }
            }
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var items = form.dependency.checkRuleTree.items;
            var i, expItem, subExpItem, colInfoes, colIndex, result, len = items.length;
            for (i = 0; i < len; i++) {
                expItem = items[i];
                if (expItem.source === grid.key && expItem.type === this.CheckRuleItemType.List) {
                    if (!expItem.items) continue;
                    for (var ind = 0, elen = expItem.items.length; ind < elen; ind++) {
                        subExpItem = expItem.items[ind];
                        if (!subExpItem.content || subExpItem.content.length == 0) continue;
                        colInfoes = grid.getColInfoByKey(subExpItem.left);
                        if (colInfoes !== null) {
                            for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                                colIndex = colInfoes[j].colIndex;
                                result = form.eval(subExpItem.content, {form: form, rowIndex: rowIndex, colIndex: colIndex}, null);
                                grid.modifyCellErrors(rowIndex, colIndex, result, subExpItem.errorMsg);
                            }
                        }
                    }
                }
            }

            impl_rowCountChanged.call(this,grid);

            grid.setGridErrorCells(grid.errorInfoes.cells);
            this.checkRow(grid, rowIndex);
            grid.setGridErrorRows(grid.errorInfoes.rows);
        };
        this.valueChanged = function (key) {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;
            //必填检查
            var comp = form.getComponent(key);
            if (comp.getMetaObj().required) {
                comp.setRequired(comp.isNull());
            }
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == key.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        this.checkComponent(expItem, enableOnly, false);
                    }
                }
            }

            if (comp.getMetaObj().isSubDetail && !enableOnly) {
                var parentGrid = form.getComponent(comp.getMetaObj().parentGridKey);
                if (parentGrid) {
                    this.calcEmptyRow(parentGrid, parentGrid.getFocusRowIndex());
                }
            }
            this.checkGlobal();
        };
        this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
            var affectItems = form.dependency.checkRuleTree.affectItems;
            var item, expItems, expItem, subExpItem, result = false, colInfoes, colInfo;
            var dealSubDetailCompError = function (error, msg, isRequired) {
                if (grid.getFocusRowIndex() == rowIndex) {
                    var cellSubDtlComps = form.getCellSubDtlComps(grid.key, cellKey);
                    if (cellSubDtlComps != null && cellSubDtlComps.length > 0) {
                        for (var csi = 0, csLen = cellSubDtlComps.length; csi < csLen; csi++) {
                            var comp = cellSubDtlComps[csi];
                            comp.setError(!error, msg);
                            comp.setRequired(isRequired);
                        }
                    }
                }
            };
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                if (item.key.toLowerCase() == cellKey.toLowerCase()) {
                    expItems = item.expItems;
                    for (var j = 0, length = expItems.length; j < length; j++) {
                        expItem = expItems[j];
                        if (expItem.items == undefined) {
                            if (!expItem.content || expItem.content.length == 0) continue;
                            colInfoes = grid.getFixRowInfoByCellKey(expItem.left);
                            if (colInfoes == null) continue;
                            for (var m = 0, mlen = colInfoes.length; m < mlen; m++) {
                                colInfo = colInfoes[m];
                                result = form.eval($.trim(expItem.content), {form: form, rowIndex: colInfo.rowIndex, colIndex: colInfo.colIndex}, null);
                                grid.modifyCellErrors(colInfo.rowIndex, colInfo.colIndex, result, expItem.errorMsg);
                                dealSubDetailCompError(result, expItem.errorMsg, colInfo.isRequired);
                            }
                        } else {
                            for (var k = 0, elen = expItem.items.length; k < elen; k++) {
                                subExpItem = expItem.items[k];
                                if (!subExpItem.content || subExpItem.content.length == 0) continue;
                                colInfoes = grid.getColInfoByKey(subExpItem.left);
                                if (colInfoes == null) continue;
                                for (var n = 0, nlen = colInfoes.length; n < nlen; n++) {
                                    colInfo = colInfoes[n];
                                    result = form.eval($.trim(subExpItem.content), {form: form, rowIndex: rowIndex, colIndex: colInfo.colIndex}, null);
                                    grid.modifyCellErrors(rowIndex, colInfo.colIndex, result, subExpItem.errorMsg);
                                    dealSubDetailCompError(result, expItem.errorMsg, colInfo.isRequired);
                                }
                            }
                        }
                    }
                }
            }
            grid.setGridErrorCells(grid.errorInfoes.cells);
            this.checkRow(grid, rowIndex);
            grid.setGridErrorRows(grid.errorInfoes.rows);
            this.checkGlobal();
        };
        this.checkSubDetail = function (gridKey) {
            var formState = form.getOperationState();
            var enableOnly = (formState == YIUI.Form_OperationState.New || formState == YIUI.Form_OperationState.Edit)
                ? false : formState == YIUI.Form_OperationState.Default;

            var items = form.dependency.checkRuleTree.items;
            var i, expItem, comp, len = items.length;
            for (i = 0; i < len; i++) {
                expItem = items[i];
                comp = form.getComponent(expItem.source);
                if (comp && comp.getMetaObj().isSubDetail && comp.getMetaObj().parentGridKey == gridKey) {
                    this.checkComponent(expItem, enableOnly, true);
                }
            }
        }
    };
    YIUI.UIDependencyProcess = function (form) {
        this.form = form;

        this.calcAll = function () {
            // if (this.form.getOperationState() == YIUI.Form_OperationState.Default) {
            //     var relations = form.getRelations(), targetFields, targetField, targetComp, value;
            //     if (relations != null) {
            //         for (var dependencyField in relations) {
            //             value = this.form.getComponentValue(dependencyField);
            //             if (!YIUI.TypeConvertor.toBoolean(value))return;
            //             targetFields = relations[dependencyField];
            //             for (var i = 0, len = targetFields.length; i < len; i++) {
            //                 targetField = targetFields[i];
            //                 targetComp = this.form.getComponent(targetField);
            //                 if (targetComp != null) {
            //                     if (!targetComp.hasDataBinding) {
            //                         targetComp.dependedValueChange(dependencyField);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        };
        this.valueChanged = function (key) {
            var relations = form.getRelations(), targetFields, targetField, targetComp, cellLocation, grid;
            if (relations == null) return;
            for (var dependencyField in relations) {
                if (dependencyField != key) continue;
                targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    targetComp = this.form.getComponent(targetField);
                    cellLocation = this.form.getCellLocation(targetField);
                    if (targetComp != null) {
                        targetComp.dependedValueChange(dependencyField);
                    } else if (cellLocation != null) {
                        grid = this.form.getComponent(cellLocation.key);
                        grid.dependedValueChange(targetField, dependencyField, null);
                    }
                }
            }
        };
        this.cellValChanged = function (grid, rowIndex, colIndex, cellKey) {
            var relations = form.getRelations(), targetFields, targetField;
            if (relations == null) return;
            for (var dependencyField in relations) {
                if (dependencyField != cellKey) continue;
                targetFields = relations[dependencyField];
                for (var i = 0, len = targetFields.length; i < len; i++) {
                    targetField = targetFields[i];
                    grid.doPostCellValueChanged(rowIndex, dependencyField, targetField, null);
                }
            }
        };
        this.calcEmptyRow = function (grid, rowIndex) {
            var gridRow = grid.getRowDataAt(rowIndex), metaRow = grid.metaRowInfo.rows[gridRow.metaRowIndex];
            for (var i = 0, len = metaRow.cells.length; i < len; i++) {
                var metaCell = metaRow.cells[i];
                if (metaCell.cellType == YIUI.CONTROLTYPE.DYNAMIC) {
                    //TODO 刷新动态单元格
                }
            }
        };
    };
})();