/**
 * 表格单元格字典编辑器
 * @type {*}
 */
YIUI.CellEditor.CellDict = YIUI.extend(YIUI.CellEditor, {
    cellDictHandler: YIUI.DictHandler,
    init: function (opt) {
        var self = this;
        var form = YIUI.FormStack.getForm(opt.ofFormID);
        self.cellDictHandler.setContext({form: form, rowIndex: opt.rowIndex, colIndex: opt.colIndex});
        opt = $.extend(true, opt, {
            getDictChildren: function (node) {
                var dict = this;
                var success = function (msg) {
                    if (msg) {
                        var nodeId = node.attr('id');
                        var syncNodes = dict.dictTree.formatAsyncData(msg);
                        var isHaveNext = msg.totalRowCount;
                        msg = dict.secondaryType == 5 ? msg.data :msg;
                        for(var i=0, len= msg.length; i<len; i++) {
						    
						    if(dict.secondaryType == 5) {
								var path = nodeId + "_" +  msg[i].OID;
								 msg[i].id = path;
						    }
						}
                        syncNodes = dict.secondaryType == 5 ? msg :syncNodes;
                        dict.dictTree.buildTreenode(syncNodes, nodeId, parseInt(node.attr("level")) + 1, dict.secondaryType, isHaveNext);
                        dict.secondaryType == 5 ? node.attr('isLoaded',false) : node.attr('isLoaded',true);
                        /*node.attr('isLoaded', true);*/
                    }
                };
                if (dict.secondaryType != 5) {
                	YIUI.DictService.getDictChildren(dict.itemKey, dict.dictTree.getNodeValue(node), dict.dictTree.dictFilter, dict.stateMask, success);
                } else {
                	YIUI.DictService.getQueryData(dict.itemKey,dict.dictTree.startRow, 10,dict.dictTree.pageIndicatorCount, dict.dictTree.fuzzyValue,  dict.stateMask ,dict.getDictTree().dictFilter, dict.getDictTree().getNodeValue(node),success);
                }
                
            },
            getItemKey: function () {
                return this.itemKey;
            },
            setValue: function (value) {
                var changed = false;
                if (this.value) {
                    changed = !this.value.equals(value);
                } else if (value) {
                    changed = true;
                }
                this.value = value;
                if (this._resetTree && this.multiSelect) {
                    this.dictTree.reset();
                    this.setDictTreeCheckedNodes();
                }
                if(self.yesCom.isShowQuery && opt.saveCell != null){
                    opt.saveCell();
                }
                return changed;
            },
            checkDict: function () {
                self.cellDictHandler.checkDict(this);
            },
            doLostFocus: function (text) {
                self.cellDictHandler.autoComplete(this, text);
                if (self.yesCom.isShowQuery) {
                    opt.stopClickCell();
                }
            },
            beforeExpand: function (tree, treeNode) {
                var success = function (msg) {
                    if (msg) {
                        $.each(msg, function (i) {
                            var nodeId = this.itemKey + '_' + this.oid;
                            tree.indeterminatedNodes[nodeId] = this;
                        });
                    }
                };
                YIUI.DictService.getAllParentID(self.yesCom.itemKey, self.yesCom.getSelValue(), success);
            }
        });
        this.yesCom = new YIUI.Yes_Dict(opt);
        this.yesCom.getEl().addClass("ui-dict");
        opt.items && this.yesCom.setItems(opt.items);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },

    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    getValue: function () {
        return this.yesCom.getSelValue();
    },
    setValue: function (value) {
        this.yesCom.setSelValue(value);
    },
    getInput: function () {
        return this.yesCom._textBtn;
    },
    setText: function (caption) {
        this.yesCom.text = caption;
        this.yesCom.setText(caption);
    },
    getText: function () {
        return this.yesCom.getText();
    },
    beforeDestroy: function () {
        this.yesCom._dropView.remove();
    }
});