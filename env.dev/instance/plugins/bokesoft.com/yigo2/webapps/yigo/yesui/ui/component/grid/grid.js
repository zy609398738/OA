YIUI.Control.Grid = YIUI.extend(YIUI.Control, {
    autoEl: '<table></table>',
    dataModel: {data: [], colModel: []},
    groupHeaders: [],//多重表头
    pageInfo: null,//分页信息
    errorInfoes: {rows: [], cells: []},//带错误标识的单元格
    hasRowClick: false,    //是否有行点击事件
    hasRowChange: false, // 是否有行焦点变化事件
    hasRowDblClick: false, //是否有行双击事件
    gridHandler: YIUI.GridHandler,
    rowHeight: 32,
    selectFieldIndex: -1,
    orgMetaGrid: null,
    columnExpandInfo: [],
    rowExpandInfo: [],
    metaRowInfo: {rows: [], dtlRowIndex: -1},
    init: function (options) {
        this.base(options);
        this.orgMetaGrid = options.metaObj;
        this.metaObj = options.metaObj;
        if (this.dataModel.data.isFirstShow) {
            this.rowIDMap = this.dataModel.data.rowIDMap;
            this.dataModel.data = this.dataModel.data.addRowArray;
            this.initRowDatas();

        }
    },
    setMetaObj: function (metaObj) {
        if (metaObj != null)
            this.metaObj = metaObj;
    },
    getMetaObj: function () {
        return this.metaObj;
    },
    getOrgMetaGrid: function () {
        return this.orgMetaGrid;
    },
    getColumnExpandModel: function () {
        return this.columnExpandInfo;
    },
    getRowExpandModel: function () {
        return this.rowExpandInfo;
    },
    initRowDatas: function () {
        var len = this.dataModel.data.length, row;
        for (var i = 0; i < len; i++) {
            row = this.dataModel.data[i];
            this.initOneRow(row);
        }
    },
    initOneRow: function (row) {
        if (row.rowID == undefined) {
            row.rowID = this.randID();
        }
        if (row.rowType == undefined) {
            row.rowType = "Detail";
            if (row.metaRowIndex == undefined || row.metaRowIndex == -1) {
                row.metaRowIndex = this.metaRowInfo.dtlRowIndex;
            }
        }
        row.isDetail = (row.rowType == "Detail");
        row.isEditable = (row.rowType == "Fix" || row.rowType == "Detail");
        row.cellKeys = this.metaRowInfo.rows[row.metaRowIndex].cellKeys;
        row.rowHeight = this.metaRowInfo.rows[row.metaRowIndex].rowHeight;
        if (this.hasColExpand && row.isDetail && row.cellBkmks == undefined) {
            row.cellBkmks = []
        }
    },
    setID: function () {
        console.log(this)
    },
    setVAlign: function (vAlign) {

    },
    setHAlign: function (hAlign) {

    },
    // private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
    onSetWidth: function (width) {
        this.el.setGridWidth(width);
    },

    setHeight: function (height) {
        this.base(height);
        if (!this.isHeightSet) {
            var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
            var focusRowIndex = this.getFocusRowIndex(), focusColIndex = this.getFocusColIndex();
            this.refreshGrid({populate: true, rowNum: this.dataModel.data.length});
            this.el[0].grid.bDiv.scrollTop = scrollTop;
            this.el[0].grid.bDiv.scrollLeft = scrollLeft;
            var cell = this.el.getGridCellAt(focusRowIndex + 1, focusColIndex + 1);
            if (cell) {
                cell.notOnSelectRow = true;
                $(cell).click();
            }
        }
    },

    // private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
    onSetHeight: function (height) {
        this.el.setGridHeight(height);
        var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
        var focusRowIndex = this.getFocusRowIndex(), focusColIndex = this.getFocusColIndex();
        this.refreshGrid({populate: true, rowNum: parseInt((height / this.rowHeight), 10) + 2});
        this.el[0].grid.bDiv.scrollTop = scrollTop;
        this.el[0].grid.bDiv.scrollLeft = scrollLeft;
        var cell = this.el.getGridCellAt(focusRowIndex + 1, focusColIndex + 1);
        if (cell) {
            cell.notOnSelectRow = true;
            $(cell).click();
        }
        this.isHeightSet = true;
    },
    //获得表格最外层节点
    getOuterEl: function () {
        return $("#gbox_" + this.id);
    },
    //处理服务端返回值中的不相同的地方，更新到界面
    diff: function (diffJSON) {
        var isRedraw = false, isReRender = false;
        if (typeof diffJSON.editable != "undefined" && diffJSON.editable != this.isEnable()) {
            this.setEnable(diffJSON.editable);
            this.el.setGridParam({enable: this.isEnable()});
            this.el[0].updatePager();
        }
        var needCalcPageInfo = false;
        if (diffJSON.pageInfo) {
            if (diffJSON.pageInfo.currentPage) {
                this.pageInfo.currentPage = diffJSON.pageInfo.currentPage;
                needCalcPageInfo = true;
            }
            if (diffJSON.pageInfo.totalRowCount) {
                this.pageInfo.totalRowCount = diffJSON.pageInfo.totalRowCount;
            }
            if (diffJSON.pageInfo.totalPage) {
                this.pageInfo.totalPage = diffJSON.pageInfo.totalPage;
            }
        }
        if (diffJSON.errorInfoes) {
            this.errorInfoes.cells = diffJSON.errorInfoes.cells;
            this.errorInfoes.rows = diffJSON.errorInfoes.rows;
        }
        if (diffJSON.dataModel) {
            if (diffJSON.dataModel.cellEnables) {
                for (var ri = 0, len = diffJSON.dataModel.cellEnables.length; ri < len; ri++) {
                    var diffRow = diffJSON.dataModel.cellEnables[ri], rowID = diffRow.rowID,
                        gridRow = this.getRowDataByID(rowID), rowIndex = this.getRowIndexByID(rowID);
                    if (gridRow == null || diffRow.cells == undefined) continue;
                    for (var cellKey in diffRow.cells) {
                        this.setCellEnable(rowIndex, cellKey, diffRow.cells[cellKey]);
                    }
                }
            }
            if (diffJSON.dataModel.colModel) {
                if (diffJSON.dataModel.colModel.columns) {
                    this.dataModel.colModel.columns = diffJSON.dataModel.colModel.columns;
                }
                if (diffJSON.dataModel.colModel.cells) {
                    this.dataModel.colModel.cells = diffJSON.dataModel.colModel.cells;
                }
                if (this.dataModel.colModel.columns.length != this.el[0].p.colModel.length) {
                    isReRender = true;
                    this.groupHeaders = diffJSON.groupHeaders;
                }
                this.el[0].p.colModel.isChange = false;
                for (var colIndex = 0, colLen = this.dataModel.colModel.columns.length; colIndex < colLen; colIndex++) {
                    var col = this.dataModel.colModel.columns[colIndex];
                    var oldCol = null;
                    for (var oldColIndex = 0, cmLen = this.el[0].p.colModel.length; oldColIndex < cmLen; oldColIndex++) {
                        oldCol = this.el[0].p.colModel[oldColIndex];
                        if (oldCol.name == col.name)
                            break;
                    }
                    oldCol.editable = col.editable;
                    if (oldCol.hidden !== col.hidden) {
                        this.el[0].p.colModel.isChange = true;
                        isRedraw = true;
                    }
                    oldCol.hidden = col.hidden;
                }
            }
            if (diffJSON.dataModel.data) {
                var isFirstShow = diffJSON.dataModel.data.isFirstShow;
                if (isFirstShow) {
                    this.dataModel.data = diffJSON.dataModel.data.addRowArray;
                    if (!this.dataModel.data) {
                        this.dataModel.data = new Array();
                    }
                    this.initRowDatas();
                    if (this.treeType !== -1) {
                        this.rowIDMap = diffJSON.dataModel.data.rowIDMap;
                        this.treeOldData = this.dataModel.data;
                        this.dataModel.data = new Array();
                        var i, rd, len;
                        if (this.treeExpand) {
                            for (i = 0, len = this.treeOldData.length; i < len; i++) {
                                rd = this.treeOldData[i];
                                if (rd.childRows.length > 0) {
                                    rd.isExpand = true;
                                }
                                this.dataModel.data.push(rd);
                            }
                        } else {
                            for (i = 0, len = this.treeOldData.length; i < len; i++) {
                                rd = this.treeOldData[i];
                                if (rd.parentRow === undefined) {
                                    this.dataModel.data.push(rd);
                                }
                            }
                        }
                    } else if (this.rowExpandIndex != -1) {
                        for (var j = 0, jLen = this.dataModel.data.length; j < jLen; j++) {
                            var rowData = this.dataModel.data[j];
                            rowData.data[this.rowExpandIndex][2] = false;
                        }
                    }
                    isRedraw = true;
                } else {
                    var addJSON = diffJSON.dataModel.data.addRowArray;
                    var modifyJSON = diffJSON.dataModel.data.modifyRowArray;
                    var delJSON = diffJSON.dataModel.data.deleteRowArray;
                    this.deleteRows(delJSON);
                    this.addNewRows(addJSON);
                    this.modifyRows(modifyJSON);
                    isRedraw = false;
                }
            }
            if (isReRender) {
                var grid = $("#gbox_" + this.id), parent = $(grid[0].parentElement);
                grid.remove();
                this.el = null;
                this.onRender(parent);
                this.onSetWidth(this.lastSize.width);
                this.onSetHeight(this.lastSize.height);
            } else {
                var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
                var opt = {enable: this.isEnable()};
                this.el.setGridParam(opt);
                if (isRedraw) {
                    this.refreshGrid(opt);
                }
                this.initPageOpts(needCalcPageInfo);
                this.initGridErrors();
                this.el[0].grid.bDiv.scrollTop = scrollTop;
                this.el[0].grid.bDiv.scrollLeft = scrollLeft;
                var isHasEditor = false, etCells = this.el[0].p.editCells;
                for (var i = 0, eclen = etCells.length; i < eclen; i++) {
                    if (etCells[i].cell.editor !== undefined) {
                        isHasEditor = true;
                        break;
                    }
                }
                if (isHasEditor) {
                    this.el[0].p.editCells = etCells;
                }
            }
        }
    },
    //差异化删除行
    deleteRows: function (delJSON) {
        if (delJSON) {
            for (var j = this.dataModel.data.length - 1; j >= 0; j--) {
                var curRow = this.dataModel.data[j];
                for (var i = delJSON.length - 1; i >= 0; i--) {
                    var delRowID = delJSON[i]["rowID"];
                    if (curRow.rowID == delRowID) {
                        this.dataModel.data.splice(j, 1);
                        this.el[0].deleteGridRow(j);
                        delJSON.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    //差异化添加行
    addNewRows: function (addJSON) {
        if (addJSON) {
            while (addJSON.length != 0) {
                for (var i = addJSON.length - 1; i >= 0; i--) {
                    var addRow = addJSON[i];
                    if (addRow.data !== null && addRow.data !== undefined) {
                        this.initOneRow(addRow);
                    }
                    var rowID = addRow["insertRowID"];
                    if (rowID == -1) {
                        this.dataModel.data.splice(0, 0, addRow);
                        this.el[0].insertGridRow(0, addRow);
                        addJSON.splice(i, 1);
                    } else {
                        for (var j = 0, dlen = this.dataModel.data.length; j < dlen; j++) {
                            var row = this.dataModel.data[j];
                            var curRowID = row["rowID"];
                            if (curRowID == rowID) {
                                this.dataModel.data.splice(j + 1, 0, addRow);
                                this.el[0].insertGridRow(j + 1, addRow);
                                addJSON.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    //差异化修改行
    modifyRows: function (modifyJSON) {
        if (modifyJSON) {
            for (var i = 0, len = modifyJSON.length; i < len; i++) {
                var modifyRow = modifyJSON[i];
                var rowID = modifyRow["rowID"], rowInd, oldRd, mdCell, rn = this.showRowHead ? 1 : 0;
                for (var j = 0, dlen = this.dataModel.data.length; j < dlen; j++) {
                    var row = this.dataModel.data[j];
                    var curRowID = row["rowID"];
                    if (curRowID == rowID) {
                        oldRd = this.dataModel.data[j];
                        for (var k = 0, clen = modifyRow.cells.length; k < clen; k++) {
                            mdCell = modifyRow.cells[k];
                            oldRd.data[mdCell.colIndex] = mdCell.value;
                            this.el[0].modifyGridCell(j, mdCell.colIndex + rn, oldRd);
                        }
                        if (this.treeType !== -1) {
                            modifyRow.isExpand = row.isExpand;
                            modifyRow.treeLevel = row.treeLevel;
                            rowInd = this.rowIDMap[rowID];
                            this.treeOldData.splice(rowInd, 1, oldRd);
                        }
                        this.dataModel.data.splice(j, 1, oldRd);
                        break;
                    }
                }
            }
        }
    },
    //编辑单元格时如果是自定义编辑组件，则这里进行对应组件的创建
    createCellEditor: function (cell, edittype, iRow, iCol, opt) {
        if (edittype === "label") return;
        var editor, $t = this, self = $t.getControlGrid(), form = YIUI.FormStack.getForm(self.ofFormID),
            rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id), 10),
            rowData = $t.p.data[rowIndex], rowID = rowData.rowID, colIndex = $t.p.rowSequences ? iCol - 1 : iCol,
            cellV = rowData.data[colIndex], oldV = cellV[0], oldCaption = cellV[1];
        if (oldV === null || oldV === undefined || oldV === '&nbsp;' || oldV === '&#160;'
            || ($.isString(oldV) && oldV.length === 1 && oldV.charCodeAt(0) === 160)) {
            oldV = "";
        }
        cell.html("").attr("tabIndex", "0");
        var scrollTop = $t.grid.bDiv.scrollTop, scrollLeft = $t.grid.bDiv.scrollLeft;
        var setFocusAndSelect = function (editor) {
            var moveStart = function (element) {
                var pos = element.value.length;
                if (element.setSelectionRange) {
                    element.setSelectionRange(pos, pos);
                } else if (element.createTextRange) {
                    var r = element.createTextRange();
                    r.moveStart('character', pos);
                    r.collapse(true);
                    r.select();
                }
            };
            window.setTimeout(function () {
                $(editor.getInput()).focus(function () {
                    if (!$.ygrid.msie) {    //兼容IE
                        moveStart(this);
                    }
                });
                editor.getInput().focus();
                if (!cell[0].inKeyEvent) {
                    editor.getInput().select();
                } else {
                    if ($.ygrid.msie) {      //兼容IE
                        moveStart(editor.getInput()[0]);
                    }
                    cell[0].inKeyEvent = false;
                }
            }, 0);
        };
        var hideDropView = function () {
            var th = self.el, p = th[0].p, value;
            if (p.editCells.length === 0) {
                var dV = p.data[iRow - 1].data[iCol - (p.rowSequences ? 1 : 0)];
                p.editCells.push({ir: iRow, ic: iCol, name: p.colModel[iCol].name, v: dV, cell: cell});
            }
            th.yGrid("saveCell", iRow, iCol);
            th[0].selecting = false;
            var hCell = $("td.ui-state-highlight", th[0].grid.bDiv);
            if (hCell[0] && (hCell[0].parentElement.id !== p.selectRow || hCell[0].cellIndex !== p.selectCell)) {
                hCell.click();
            }
            window.setTimeout(function () {
                $("#" + self.el[0].p.knv).focus();
                self.el[0].grid.bDiv.scrollTop = scrollTop;
                self.el[0].grid.bDiv.scrollLeft = scrollLeft;
            }, 0);
        };
        var clickDropBtn = function (editor) {
            var event = opt.event || window.event;
            if (event.type === "click") {
                var srcE = event.target || event.srcElement ,
                    x = event.offsetX || (event.clientX - srcE.getBoundingClientRect().left),
                    y = event.offsetY || (event.clientY - srcE.getBoundingClientRect().top),
                    btn = editor.getDropBtn()[0],
                    top = btn.offsetTop, left = btn.offsetLeft,
                    height = btn.offsetHeight, width = btn.offsetWidth;
                if (top <= y && y <= (top + height) && left <= x && x <= (cell[0].offsetLeft + cell[0].offsetWidth)) {
                    editor.getDropBtn().click();
                }
            }
        };
        if (edittype == "dynamic") {
            var typeFormula = opt.typeFormula;
            var typeDefKey = form.eval(typeFormula, {form: form, rowIndex: rowIndex, colIndex: colIndex});
            var cellTypeDef = DynamicCell.getCellTypeTable()[form.formKey][typeDefKey];
            if (cellTypeDef != null) {
                if (cellTypeDef.options.isAlwaysShow) return;
                cell[0].cellTypeDef = cellTypeDef;
                edittype = cellTypeDef.options.edittype;
                opt = $.extend(opt, cellTypeDef.options, {typeDefKey: typeDefKey});
            }
        }
        switch (edittype) {
            case "textEditor":
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellTextEditor(opt);
                editor.getInput().addClass("celled");
                editor.render(cell);
                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case "numberEditor":
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellNumberEditor(opt);
                editor.getInput().addClass("celled");
                editor.render(cell);
                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case "dict":
                self.gridHandler.doGridCellSelect(self, rowID, colIndex);
                var stopClickCell = function () {
                    self.el[0].grid.clearSelectCells();
                    self.el[0].selecting = false;
                };
                opt = $.extend(true, opt, {
                    ofFormID: self.ofFormID,
                    hiding: hideDropView,
                    rowIndex: self.getRowIndexByID(rowID),
                    colIndex: colIndex,
                    stopClickCell: stopClickCell
                });
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellDict(opt, cell);
                editor.render(cell);
                if (oldV != null && !opt.multiSelect) {
                    oldV = new YIUI.ItemData(oldV);
                }
                editor.setValue(oldV);
                editor.setText(oldCaption);
                clickDropBtn(editor);
                break;
            case "comboBox":
                self.gridHandler.doGridCellSelect(self, rowID, colIndex);
                opt = $.extend(true, opt, {
                    ofFormID: self.ofFormID,
                    hiding: hideDropView,
                    cxt: {form: form, rowIndex: self.getRowIndexByID(rowID), colIndex: colIndex}
                });
                editor = new YIUI.CellEditor.CellComboBox(opt);
                editor.render(cell);
                editor.setValue(oldV);
                editor.setText(oldCaption);
                editor.yesCom.setItems(editor.yesCom.items);
                editor.getDropBtn().click();
                break;
            case "datePicker":
            case "utcDatePicker":
                editor = new YIUI.CellEditor.CellDatePicker(opt);
                editor.render(cell);
                if (edittype == "utcDatePicker" && oldV != null && oldV != "") {
                    oldV = YIUI.UTCDateFormat.formatCaption(oldV, opt.isOnlyDate, true);
                }
                editor.setValue(oldV);
                editor.getDropView().blur(function () {
                    self.el.yGrid("saveCell", iRow, iCol);
                });
                clickDropBtn(editor);
                break;
            case "textButton":
                opt.rowID = rowID;
                opt.colIndex = colIndex;
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                opt.click = function () {
                    self.gridHandler.doOnCellClick(self, this.rowID, this.colIndex);
                    window.setTimeout(function () {
                        $("#" + $t.p.knv).focus();
                    }, 0);
                };
                editor = new YIUI.CellEditor.CellTextButton(opt);
                editor.getInput().addClass("celled");
                editor.setValue(oldV);
                editor.render(cell);
                setFocusAndSelect(editor);
                break;
        }
        editor.getInput().keydown(function (event) {
            var keyCode = event.charCode || event.keyCode || 0;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {
                editor.getInput().blur();
                if (editor.yesCom.isShowQuery) {
                    event.stopPropagation();
                }
                $("#" + self.el[0].p.knv).trigger("keydown", event);
            }
        });
        cell[0].editor = editor;
    },
    endCellEditor: function (cell, edittype, iRow, iCol) {
        var cm = this.p.colModel[iCol], id = this.rows[iRow].id ,
            rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id), row = this.p.data[rowIndex],
            editOpt = this.getCellEditOpt(row, iCol), enable = row.data[cm.index][2], value, caption = "";
        if (cell[0].editor == null && edittype != "label") return [null, "", enable];
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        switch (edittype) {
            case "dict":
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                if (value !== null) {
                    if (value.length && value.length >= 1) {
                        for (var i = 0, vLen = value.length; i < vLen; i++) {
                            caption += value[i].caption + ",";
                        }
                        caption = caption.substring(0, caption.length - 1);
                    } else {
                        caption = value.caption == undefined ? "" : value.caption;
                    }
                }
                if (editOpt.multiSelect) {
                    value = [value];
                }
                value = [value, caption, enable];
                return value;
            case "numberEditor":
            case "textEditor":
            case "textButton":
                cell[0].editor.finishInput();
            case "comboBox":
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                value = [value, cell[0].editor.getText(), enable];
                return  value;
            case "datePicker":
            case "utcDatePicker":
                cell[0].editor.finishInput();
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                if (value == null) {
                    value = [null, "", enable];
                } else {
                    caption = new Date(value).Format(editOpt.editOptions.formatStr).toLocaleString();
                    if (edittype == "utcDatePicker") {
                        value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
                    }
                    value = [value, caption, enable];
                }
                return value;
            case "label":
                return row.data[cm.index];
        }
        return [null, "", enable];
    },
    afterEndCellEditor: function (cell, edittype, isChanged, iRow, iCol) {
        var th = this, grid = th.getControlGrid();
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        if (edittype !== undefined && edittype !== "label" && cell[0].editor != null) {
            var value = cell[0].editor.getValue(), id = th.rows[iRow].id, rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id),
                row = this.p.data[rowIndex], rowID = row.rowID, editOpt = th.getCellEditOpt(row, iCol);
            if (edittype == "utcDatePicker") {
                value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
            }
            if (edittype == "textEditor" || edittype == "textButton") {
                grid.afterTextEditing = true;
            }
            if (isChanged) {
                grid.gridHandler.doCellValueChanged(grid, rowID, th.p.rowSequences ? iCol - 1 : iCol, value);
            }
            if (edittype == "numberEditor" && th.rows[iRow] != null) {
                var curCell = th.rows[iRow].cells[iCol];
                if (value.isNegative()) {
                    $(curCell).css({color: editOpt.editOptions.negtiveForeColor});
                } else {
                    $(curCell).css({color: ""});
                }
            }
        }
    },
    alwaysShowCellEditor: function (cell, iRow, iCol, cm, value, opt, rowHeight) {
        var editor, p = this.p, th = this, row = p.data[opt.ri], rowID = row.rowID, grid = this.getControlGrid(),
            enable = value[2] || (value[2] == null && grid.isEnable()),
            editOpt = th.getCellEditOpt(row, iCol), colIndex = (p.rowSequences ? iCol - 1 : iCol);
        cell.html("");
        if (row.rowType == "Group" || row.rowType == "Total")  return;
        opt.rowID = rowID;
        opt.colIndex = colIndex;
        opt.click = function () {
            var scrollTop = th.grid.bDiv.scrollTop, scrollLeft = th.grid.bDiv.scrollLeft;
            grid.setFocusRowIndex(grid.getRowIndexByID(rowID));
            if (editOpt.formatter === "checkbox") {
                var isChecked = $("input", editor)[0].checked;
                grid.gridHandler.doOnCellClick(grid, this.rowID, this.colIndex, isChecked);
            } else {
                grid.gridHandler.doOnCellClick(grid, this.rowID, this.colIndex);
            }
            if (th.p.selectFieldIndex == editOpt.colIndex) {
                grid.checkHeadSelect(editOpt.colIndex);
            }
            cell.click();
            window.setTimeout(function () {
                if (th.grid) {
                    $("#" + p.knv).focus();
                    th.grid.bDiv.scrollTop = scrollTop;
                    th.grid.bDiv.scrollLeft = scrollLeft;
                }
            }, 0);
        };
        cell[0].style.height = rowHeight + "px";//兼容FireFox,IE
        switch (editOpt.formatter) {
            case "button":
                var icon = "";
                if (opt.icon) {
                    icon = "<span class='icon button' style='background-image: url(Resource/" + opt.icon + ")'></span>";
                }
                editor = $("<div class='ui-btn button cellEditor'>" + "<button>" + icon
                    + "<span class='txt button'>" + (value[0] == null ? "" : value[0]) + "</span></button></div>");
                if (opt.type == YIUI.Button_Type.UPLOAD) {
                    var btn_up = $("<input type='file' class='type upload' name='file' data-url='upload'/>");
                    btn_up.appendTo(editor);
                    btn_up[0].enable = enable;
                }
                $("button", editor)[0].enable = enable;
                editor.appendTo(cell);
                editor.mousedown(function (e) {
                    e.delegateTarget.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                        e.delegateTarget.enable && $(this).removeClass("hover");
                    });
                $("button", editor).click(function (e) {
                    if (!this.enable) {
                        e.stopPropagation();
                        return false;
                    }
                    opt.click();
                });
                $("input.upload", editor).click(function (e) {
                    window.up_target = null;
                    if (!this.enable) {
                        e.stopPropagation();
                        return false;
                    } else if ($(e.target).hasClass("upload")) {
                        window.up_target = $(e.target);
                    }
                    opt.click();
                });
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case "hyperlink":
                var showV = (value[0] == null ? "" : value[0]);
                editor = $("<a class='ui-hlk cellEditor' style='width: 100%;height: 100%;line-height: " + rowHeight + "px'>" + showV + "</a>");
                editor[0].enable = enable;

                var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
                switch (opt.targetType) {
                    case YIUI.Hyperlink_TargetType.Current:
                        showTarget = YIUI.Hyperlink_TargetType.Str_Current;
                    case YIUI.Hyperlink_TargetType.NewTab:
                        if (opt.url != null && opt.url.length > 0) {
                            editor.attr("href", opt.url);
                        }
                        editor.attr("target", YIUI.Hyperlink_target[showTarget]);
                        break;
                }

                editor.mousedown(function (e) {
                    e.delegateTarget.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                        e.delegateTarget.enable && $(this).removeClass("hover");
                    });
                editor.click(function (e) {
                    //e.target.enable && opt.click();
                    if (!e.target.enable) return;
                    if (opt.url && opt.targetType == YIUI.Hyperlink_TargetType.New) {
                        window.open(opt.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                    } else if (!opt.url) {
                        opt.click();
                    }
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case "checkbox":
                var checked = "", input, top;
                var checkboxID = this.id + '_' + iRow + '_' + iCol;
                if (value[0] === "1" || value[0] === 1 || value[0] === "true" || value[0] === true) {
                    checked = "checked";
                }
                top = (rowHeight - 16) / 2;
                /* editor = $("<div class='ui-chk cellEditor' style='width: 100%;height: 100%'>" +
                 "<input  style='height:16px;top:" + top + "px;position: relative' type='checkbox' class='chk' " + checked + "/></div>");*/
                editor = $("<div class='ui-chk cellEditor' style='width: 100%;height: 100%';>" +
                    "<input id=" + checkboxID + " type='checkbox' class='chk' " + checked + "/>" +
                    "<label for=" + checkboxID + " style='height:16px;width:16px;top:" + top + "px;position: relative' ></label>" +
                    "</div>");
                editor[0].enable = enable;
                input = $("input", editor);
                label = $("label", editor);
                !enable && input.attr('disabled', 'disabled');
                editor.click(function (e) {
                    grid.setCellFocus(iRow - 1, grid.showRowHead ? iCol - 1 : iCol);
                    e.delegateTarget.enable && opt.click();
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                if (input.is(':checked')) input.addClass('checked');
                label.click(function () {
                    if (input.is(':checked')) {
                        input.removeClass('checked')
                    } else {
                        input.addClass('checked')
                    }
                })

                break;
            case "image":
                opt.ofFormID = grid.ofFormID;
                opt.enable = enable;
                opt.value = value[0];
                opt.gridKey = grid.key;
                opt.rowIndex = grid.getRowIndexByID(opt.rowID);
                opt.change = function (path) {
                    p.data[iRow - 1].data[cm.index] = [path, path];
                    p.editCells.push({ir: iRow, ic: iCol, name: cm.name, v: p.data[iRow - 1].data[cm.index], cell: cell});
                    if (p.afterEndCellEditor && $.isFunction(p.afterEndCellEditor)) {
                        p.afterEndCellEditor.call(th, cell, editOpt.edittype, true, iRow, iCol);
                    }
                    p.selectRow = null;
                    p.selectCell = null;
                    p.editCells = [];
                    th.grid.clearSelectCells();
                };
                editor = new YIUI.CellEditor.CellImage(opt);
                editor.render(cell);
                editor.getEl().attr("title", editor.pathV);
                cell.attr("title", editor.pathV);
                cell[0].editor = editor;
                break;
        }
    },
    //处理分页事件
    doPageEvent: function (isDo, page, cmd) {
        page = parseInt(page, 10);
        if (isDo) {
            this.dataModel.data = [];
            var paras = {optType: cmd};
            if (!isNaN(page) && page >= 0) {
                paras["pageIndex"] = page;
            }
            this.gridHandler.doGoToPage(this, JSON.stringify(paras));
        }
    },
    //设置分页按钮及输入框的可用性及事件处理
    initPageOpts: function (needCalc) {
        if (!this.pageInfo.isUsePaging) return;
        if (needCalc) this.pageInfo.totalPage += this.pageInfo.currentPage - 1;
        var $th = this , pagerID = this.id + "_pager",
            firstButton = $("#first_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            prevButton = $("#prev_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            nextButton = $("#next_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            lastButton = $("#last_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            pagination = $("#pagination_" + pagerID),
            pageInput = $("#" + pagerID + "_center .ui-pg-input").val(this.pageInfo.currentPage).unbind("keypress");
        $("#sp_1_" + pagerID).html(this.pageInfo.totalPage);
        var lastRowIndex = this.pageInfo.currentPage * this.pageInfo.pageRowCount;
        var firstRowIndex = (this.pageInfo.currentPage - 1) * this.pageInfo.pageRowCount + 1;
        if (lastRowIndex == 0) {
            firstRowIndex = 0;
        }
        var pageInfoStr = "第" + firstRowIndex + " - " + lastRowIndex + "条";
        $("#" + pagerID + "_right .ui-paging-info").html(pageInfoStr);
        firstButton.bind("click", function () {
            $th.doPageEvent(!firstButton.hasClass("ui-state-disabled"), -1, "firstPage");
        });
        prevButton.bind("click", function () {
            $th.doPageEvent(!prevButton.hasClass("ui-state-disabled"), -1, "prevPage");
        });
        nextButton.bind("click", function () {
            $th.doPageEvent(!nextButton.hasClass("ui-state-disabled"), -1, "nextPage");
        });
        lastButton.bind("click", function () {
            $th.doPageEvent(!lastButton.hasClass("ui-state-disabled"), -1, "lastPage");
        });
        if (this.pageInfo.totalPage == 1) {
            pageInput.attr("readOnly", "readOnly");
        }
        pageInput.keypress(function (e) {
            var key = e.charCode || e.keyCode || 0;
            if (key === 13) {
                if (pageInput.val() > $th.pageInfo.totalPage) {
                    pageInput.val($th.pageInfo.totalPage);
                }
                $th.doPageEvent(!pageInput.hasClass("ui-state-disabled"), pageInput.val(), "turnToPage");
            } else if (key >= 48 && key <= 57) {
                return this;
            }
            return false;
        });
        /*var initPagination = function (begin, end, curPage) {
         $("ul", pagination).html();
         var btnStr = [], style, sClass;
         for (var i = begin; i <= end; i++) {
         //style = (i == end) ? "border-right:1px solid #000" : "";
         var style = null;
         if(i==end) style = 'background:red';
         sClass = (i == curPage) ? "ui-state-highlight" : "";
         btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
         }
         $("ul", pagination).html(btnStr.join(""));
         };*/

        var initPagination = function (begin, end, curPage) {
            $("ul", pagination).html();
            var btnStr = [], style, sClass;
            //var end = 10;
            for (var i = begin; i <= end; i++) {
                var style;
                if (i == end) style = 'border:0';
                sClass = (i == curPage) ? "ui-state-highlight" : "";
                btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
            }
            $("ul", pagination).html(btnStr.join(""));
        };

        if (this.pageInfo.totalPage <= 5) {
            initPagination(1, this.pageInfo.totalPage, this.pageInfo.currentPage);
        } else {
            var curPage = this.pageInfo.currentPage, totalPage = this.pageInfo.totalPage,
                begin = (curPage - 2) >= 1 ? (curPage - 2) : 1, end = begin + 4;
            if (end > totalPage) {
                var gap = end - totalPage;
                begin -= gap;
                end -= gap;
            }
            initPagination(begin, end, this.pageInfo.currentPage);
        }
        $("li", pagination).click(function () {
            var num = $(this).attr("data-num");
            $th.doPageEvent(!$(this).hasClass("ui-state-disabled"), num, "turnToPage");
        });
        if (this.pageInfo.currentPage == 1) {
            firstButton.addClass("ui-state-disabled");
            prevButton.addClass("ui-state-disabled");
        } else {
            firstButton.removeClass("ui-state-disabled");
            prevButton.removeClass("ui-state-disabled");
        }
        if (this.pageInfo.currentPage == this.pageInfo.totalPage) {
            nextButton.addClass("ui-state-disabled");
            lastButton.addClass("ui-state-disabled");
        } else {
            nextButton.removeClass("ui-state-disabled");
            lastButton.removeClass("ui-state-disabled");
        }
    },
    rowOptFunc: function (cmd) {
        if (this.p.selectRow) {
            var index = $.ygrid.stripPref($.ygrid.uidPref, this.p.selectRow),
                rowID = this.p.data[index].rowID, self = this.getControlGrid(),
                rowIndex = this.getControlGrid().getRowIndexByID(rowID);
            if (cmd === "add") {
                var selCell = this.p.selectCell;
                this.getControlGrid().gridHandler.doInsertGridRow(self, rowID);
                $($("#" + $.ygrid.uidPref + index)[0].cells[selCell]).click();
            } else if (cmd === "del") {
                this.getControlGrid().gridHandler.doDeleteGridRow(self, rowID);

            } else if (cmd == "upRow" || cmd == "downRow") {
                this.getControlGrid().gridHandler.doShiftRow(self, rowIndex, cmd == "upRow");
            }
        }
    },
    extKeyDownEvent: function (event) {
        var ri = this.p.selectRow, ci = this.p.selectCell, keyCode = event.charCode || event.keyCode || 0, row = this.rows[ri];
        if (ri === undefined || ri == null || ci === undefined || ci == null || row == undefined) return;
        var rowIndex = $.ygrid.stripPref($.ygrid.uidPref, row.id), rowData = this.p.data[rowIndex],
            cell = row.cells[ci], editOpt = this.getCellEditOpt(rowData, ci);
//        var isCapeLook = function (e) {   //仅能检测到输入框中按下键盘按钮的时候根据输入的keycode检测，不能再输入之前检测。
//            var keyCode = e.keyCode || e.which || e.charCode;
//            var isShift = e.shiftKey || (keyCode == 16) || false;
//            return ((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift);
//        };
        if (editOpt.edittype == "textEditor" || editOpt.edittype == "numberEditor" || editOpt.edittype == "textButton"
            || editOpt.edittype == "dict" || editOpt.edittype == "datePicker") {
            var value;
            if (keyCode >= 48 && keyCode <= 57) {//数字
                value = String.fromCharCode(keyCode);
            } else if (keyCode >= 96 && keyCode <= 105) {    //小键盘数字
                value = String.fromCharCode(keyCode - 48);
            } else if (keyCode >= 65 && keyCode <= 90) { //字母
                if (editOpt.edittype == "numberEditor" || editOpt.edittype == "datePicker") return;
                value = String.fromCharCode(keyCode).toLowerCase();
                if (event.shiftKey || document.isCapeLook) {
                    value = value.toUpperCase();
                }
            } else if (keyCode == 107 || keyCode == 109 || keyCode == 187 || keyCode == 189) {
                value = String.fromCharCode(0);
            }
            if (value == undefined) return;
            cell.inKeyEvent = true;
            cell.click();
            if ($(cell).find("input")[0] !== undefined && $(cell).find("input")[0] !== document.activeElement) {
                window.setTimeout(function () {
                    $(cell).find("input").focus();
                    if (editOpt.edittype == "textEditor") {
                        var vChar, realValue = "", textEdt = cell.editor.yesCom;
                        if (textEdt.invalidChars && textEdt.invalidChars.length > 0 && value && value.length > 0) {
                            for (var i = 0, len = value.length; i < len; i++) {
                                vChar = value.charAt(i);
                                if (textEdt.invalidChars.indexOf(vChar) < 0) {
                                    realValue += vChar;
                                }
                            }
                        } else {
                            realValue = value;
                        }
                        if (textEdt.textCase) {
                            if (textEdt.textCase == YIUI.TEXTEDITOR_CASE.UPPER) {
                                realValue = realValue.toUpperCase()
                            } else if (textEdt.textCase = YIUI.TEXTEDITOR_CASE.LOWER) {
                                realValue = realValue.toLowerCase();
                            }
                        }
                        value = realValue;
                    }
                    $(cell).find("input").val(value);
                }, 0);
            }
        }
    },
    onSortClick: function (iCol, sortType) {
        if (!this.getControlGrid().hasGroupRow) {
            iCol = this.p.rowSequences ? iCol - 1 : iCol;
            this.getControlGrid().gridHandler.doOnSortClick(this.getControlGrid(), iCol, sortType);
        } else {
            alert($.ygrid.error.isSortError);
        }
    },
    onSelectRow: function (iRow, rid) {
        var grid = this.getControlGrid(), oldRow = -1;
        if (this.p.selectRow !== undefined) {
            var row = grid.el.getGridRowById(this.p.selectRow);
            if (row) oldRow = row.rowIndex;
            if (!oldRow) oldRow = -1;
        }
        if (grid.hasRowClick) {
            var rowID = this.p.data[iRow - 1].rowID;
            grid.gridHandler.doOnRowClick(grid, rowID);
        }
        if (grid.hasRowChange && iRow != oldRow && iRow >= 0) {
            grid.el[0].p.selectRow = rid;
            var newRowID = this.p.data[iRow - 1].rowID,
                oldRowID = (oldRow === -1 ? -1 : this.p.data[oldRow - 1].rowID);
            grid.gridHandler.doGridCellSelect(grid, newRowID, this.p.selectCell ? this.p.selectCell : -1);
            grid.gridHandler.doOnFocusRowChange(grid, oldRowID, newRowID);
        }
    },
    getFocusRowIndex: function () {
        if (this.el[0].p.selectRow == undefined || this.el[0].p.selectRow == null) return -1;
        var row = this.el.getGridRowById(this.el[0].p.selectRow);
        return parseInt($.ygrid.stripPref($.ygrid.uidPref, row.id));
    },
    getFocusColIndex: function () {
        var selectCellIndex = this.el[0].p.selectCell;
        if (selectCellIndex) {
            selectCellIndex = this.el[0].p.rowSequences ? selectCellIndex - 1 : selectCellIndex;
        } else {
            selectCellIndex = -1;
        }
        return selectCellIndex;
    },
    ondblClickRow: function (iRow) {
        var grid = this.getControlGrid();
        if (grid.hasRowDblClick) {
            var rowID = this.p.data[iRow - 1].rowID;
            grid.gridHandler.doOnRowDblClick(grid, rowID);
        }
    },
    afterPaste: function (copyText) {
        var ri = this.p.selectRow, ci = this.p.selectCell, grid = this.getControlGrid();
        if (ri == undefined || ri == null) return;
        var rowInd = $.ygrid.stripPref($.ygrid.uidPref, ri), colInd = this.p.rowSequences ? ci - 1 : ci;
        if (this.p.selectionMode == YIUI.SelectionMode.ROW) {
            colInd = 0;
        }
        var enable = this.p.data[rowInd].data[colInd][2];
        enable = (enable == null ? this.p.enable : enable);
        if (enable && ri !== undefined && ci !== undefined && copyText !== undefined && copyText.length > 0) {
            grid.gridHandler.doCellPast(grid, this.p.data[rowInd].rowID, colInd, copyText);
        }
    },
    getControlGrid: function () {
        return this;
    },
    treeIconClick: function (rowdata, iRow) {
        var childIDs = rowdata.childRows, cid, oldRi, oldRd, grid = this.getControlGrid();
        if (grid.treeExpand) return;
        var getChildCount = function (rd, rowIDMap, treeOldData) {
            var i, count = 0, cid, oldRi, oldRd;
            if (rd.isExpand) {
                for (var i = 0, len = rd.childRows.length; i < len; i++) {
                    cid = rd.childRows[i];
                    oldRi = rowIDMap[cid];
                    oldRd = treeOldData[oldRi];
                    count += getChildCount(oldRd, rowIDMap, treeOldData);
                    count++;
                }
                rd.isExpand = false;
            }
            return count;
        };
        if (!rowdata.isExpand) {
            var len = childIDs.length;
            for (i = len - 1; i >= 0; i--) {
                cid = childIDs[i];
                oldRi = grid.rowIDMap[cid];
                oldRd = grid.treeOldData[oldRi];
                oldRd.treeLevel = rowdata.treeLevel + 1;
                if (grid.treeColIndex != null && grid.treeColIndex >= 0) {
                    oldRd.data[grid.treeColIndex][2] = false;
                }
                if (iRow >= grid.dataModel.data.length) {
                    grid.dataModel.data.push(oldRd);
                } else {
                    grid.dataModel.data.splice(iRow, 0, oldRd);
                }
            }
            grid.dataModel.data[iRow - 1].isExpand = true;
        } else {
            var childCount = getChildCount(rowdata, grid.rowIDMap, grid.treeOldData);
            grid.dataModel.data.splice(iRow, childCount);
            grid.dataModel.data[iRow - 1].isExpand = false;
        }
        var scrollTop = this.grid.bDiv.scrollTop, scrollLeft = this.grid.bDiv.scrollLeft;
        grid.refreshGrid();
        this.grid.bDiv.scrollTop = scrollTop;
        this.grid.bDiv.scrollLeft = scrollLeft;
    },
    //初始化表格构建相关的属性
    initOptions: function () {
        this.options = {
            populate: false,
            selectionMode: this.selectionMode,
            treeType: this.treeType,
            hasRowExpand: this.hasRowExpand,
            rowSequences: this.showRowHead,
            enable: this.getMetaObj().editable,
            colModel: this.dataModel.colModel.columns,
            cellLookup: this.dataModel.colModel.cells,
            data: this.dataModel.data,
            navButtons: {
                add: this.canInsert, addIcon: "ui-icon-plus", addFunc: this.rowOptFunc,
                del: this.canDelete, delIcon: "ui-icon-trash", delFunc: this.rowOptFunc,
                upRow: this.canShift, upRowIcon: "ui-icon-up", upRowFunc: this.rowOptFunc,
                downRow: this.canShift, downRowIcon: "ui-icon-down", downRowFunc: this.rowOptFunc
            },
            createCellEditor: this.createCellEditor,
            endCellEditor: this.endCellEditor,
            alwaysShowCellEditor: this.alwaysShowCellEditor,
            afterEndCellEditor: this.afterEndCellEditor,
            extKeyDownEvent: this.extKeyDownEvent,
            onSortClick: this.onSortClick,
            onSelectRow: this.onSelectRow,
            ondblClickRow: this.ondblClickRow,
            afterPaste: this.afterPaste,
            getControlGrid: this.getControlGrid,
            treeIconClick: this.treeIconClick
        };
        var length = this.dataModel.colModel.columns.length, column;
        this.options.selectFieldIndex = this.selectFieldIndex;
        if (this.pageInfo.isUsePaging) {
            this.options.showPageSet = true;
            this.options.scrollPage = false;
            this.options.rowNum = this.dataModel.data.length;
        } else {
            this.options.scrollPage = true;
            this.options.rowNum = 100;
        }
        if (this.treeColIndex !== undefined && this.treeColIndex !== -1) {
            this.options.treeColName = this.dataModel.colModel.columns[this.treeColIndex].name;
        }
        if (this.treeType !== undefined && this.treeType !== -1) {
            this.treeOldData = this.dataModel.data;
            this.dataModel.data = new Array();
            var i, rd, len;
            if (this.treeExpand) {
                for (i = 0, len = this.treeOldData.length; i < len; i++) {
                    rd = this.treeOldData[i];
                    if (rd.childRows.length > 0) {
                        rd.isExpand = true;
                    }
                    this.dataModel.data.push(rd);
                }
            } else {
                for (i = 0, len = this.treeOldData.length; i < len; i++) {
                    rd = this.treeOldData[i];
                    if (rd.parentRow === undefined) {
                        this.dataModel.data.push(rd);
                    }
                }
            }
            this.options.data = this.dataModel.data;
        }
    },
    initGroupHeaders: function () {
        this.el.initGroupHeaders(this.groupHeaders);
    },
    initGridErrors: function () {
        var th = this;
        if (!((th.errorInfoes.cells == undefined || th.errorInfoes.cells.length == 0)
            && (th.errorInfoes.rows == undefined || th.errorInfoes.rows.length == 0))) {
            for (var iRow = 0, len = th.dataModel.data.length; iRow < len; iRow++) {
                var curRowID = th.dataModel.data[iRow].rowID;
                if (th.errorInfoes.cells !== undefined) {
                    for (var i = 0, ecLen = th.errorInfoes.cells.length; i < ecLen; i++) {
                        if (th.errorInfoes.cells[i].rowID == curRowID) {
                            th.errorInfoes.cells[i].rowIndex = iRow;
                        }
                    }
                }
                if (th.errorInfoes.rows !== undefined) {
                    for (var j = 0, erLen = th.errorInfoes.rows.length; j < erLen; j++) {
                        if (th.errorInfoes.rows[j].rowID == curRowID) {
                            th.errorInfoes.rows[j].rowIndex = iRow;
                        }
                    }
                }
            }
        }
        th.setGridErrorCells(th.errorInfoes.cells);
        th.setGridErrorRows(th.errorInfoes.rows);
    },
    setGridErrorCells: function (cells) {
        this.el.setErrorCells(cells);
    },
    setGridErrorRows: function (rows) {
        this.el.setErrorRows(rows);
    },
    onRender: function (parent) {
        var self = this;
        this.base(parent);
        this.initOptions();
        this.el[0].getControlGrid = function () {
            return self;
        };
        this.el.yGrid(this.options);
        this.initPageOpts();
        this.initGroupHeaders();
        this.initGridErrors();
        this.options = null;
        if (this.selectFieldIndex >= 0) {
            this.checkHeadSelect(this.selectFieldIndex);
        }
    },

    beforeDestroy: function () {
        this.dataModel = null;
        this.groupHeaders = null;
        this.errorInfoes = null;
        this.el.GridDestroy();
    }
});

YIUI.Control.Grid = YIUI.extend(YIUI.Control.Grid, {   //纯web使用的一些方法
    rowIDMask: 0,
    randID: function () {
        return this.rowIDMask++;
    },
    setGridEnable: function (enable) {
        this.colInfoMap = {};
        this.setEnable(enable);
        this.el.setGridParam({enable: enable});
        this.el.reShowCheckColumn();
        if (enable && !this.hasAutoRow() && this.treeType === -1 && !this.hasRowExpand && this.metaRowInfo.dtlRowIndex != -1) {
            if (!this.getMetaObj().isSubDetail && this.newEmptyRow) {
                if (this.hasGroupRow) {
                    this.appendAutoRowAndGroup();
                } else {
                    this.addGridRow();
                }
            }
            if (this.hideGroup4Editing && enable) {
                var length = this.dataModel.data.length, row;
                for (var ri = length - 1; ri >= 0; ri--) {
                    row = this.dataModel.data[ri];
                    if (row.rowType == "Group" || (row.isDetail && row.bookmark == undefined)) {
                        this.dataModel.data.splice(ri, 1);
                    }
                }
                if (this.newEmptyRow) {
                    var dtlRowIndex = this.metaRowInfo.dtlRowIndex, insertIndex = -1;
                    for (var k = this.dataModel.data.length - 1; k >= 0; k--) {
                        row = this.dataModel.data[k];
                        if (row.rowType == "Group" || row.rowType == "Detail") {
                            insertIndex = k + 1;
                            break;
                        } else {
                            if (row.metaRowIndex < dtlRowIndex) {
                                insertIndex = k + 1;
                                break;
                            }
                        }
                    }
                    if (insertIndex == -1 && this.dataModel.data.length > 0) {
                        insertIndex = 0;
                    }
                    this.addGridRow(null, insertIndex, false);
                }
                this.refreshGrid();
            }
        } else if (!enable && this.treeType === -1) {
            this.removeAutoRowAndGroup();
        }
        this.el[0].updatePager();
        this.initPageOpts();
        var st = this.el[0].grid.bDiv.scrollTop;
        this.el[0].grid.bDiv.scrollTop = st + 1;
        YIUI.SubDetailUtil.clearSubDetailData(YIUI.FormStack.getForm(this.ofFormID), this);
    },
    setColumnVisible: function (colKey, visible) {
        var ci, clen, colM, gridCM, gridCi, hidden, isChange = false, isMatch = false, columnKey;
        visible = YIUI.TypeConvertor.toBoolean(visible);
        for (ci = 0, clen = this.dataModel.colModel.columns.length; ci < clen; ci++) {
            colM = this.dataModel.colModel.columns[ci];
            columnKey = colM.key;
            if (colM.isExpandCol && colM.refColumn) {
                columnKey = colM.refColumn;
            }
            if (columnKey === colKey) {
                hidden = (visible == null ? false : !visible);
                isChange = (colM.hidden !== hidden);
                colM.hidden = hidden;
                if (this.el) {
                    gridCi = this.showRowHead ? ci + 1 : ci;
                    gridCM = this.el[0].p.colModel[gridCi];
                    gridCM.hidden = colM.hidden;
                }
                isMatch = true;
                if (!this.hasColExpand) {
                    break;
                }
            } else if (this.hasColExpand && isMatch) {
                break;
            }
        }
        if (isChange) {
            var st = this.el[0].grid.bDiv.scrollTop, sl = this.el[0].grid.bDiv.scrollLeft;
            this.el[0].p.colModel.isChange = true;
            this.refreshGrid();
            this.el[0].grid.bDiv.scrollTop = st;
            this.el[0].grid.bDiv.scrollLeft = sl;
        }
    },
    setValueByKey: function (rowIndex, colKey, newValue, commitValue, fireEvent) {
        var colInfoes = this.getColInfoByKey(colKey);
        for (var i = 0, len = colInfoes.length; i < len; i++) {
            this.setValueAt(rowIndex, colInfoes[i].colIndex, newValue, commitValue, fireEvent, true);
        }
    },
    /**
     * 设置表格单元格的存储到数据库的值
     *
     * 这个方法后面要重构 TODO,少了一个参数 ignoreChanged
     *
     * YIUI.GridSumUtil.evalAffectSum先在fireEvent里面计算
     * 后面改掉
     *
     * @param rowIndex  表格值所在行集合的序号
     * @param colIndex  表格值所在列集合的序号
     * @param newValue  新值
     * @param commitValue  是否更新document
     * @param fireEvent  是否执行关联计算表达式及相关事件
     * @param isData  是否为数据
     */
    setValueAt: function (rowIndex, colIndex, newValue, commitValue, fireEvent, isData) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        var row = this.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex], oldEnable;
        oldEnable = row.data[colIndex][2];
        row.data[colIndex] = this.getCellNeedValue(rowIndex, colIndex, newValue, isData);
        this.afterTextEditing = false;
        row.data[colIndex][2] = oldEnable;
        this.el[0].p.data[rowIndex].data[colIndex] = row.data[colIndex];
        this.dataModel.data[rowIndex].data[colIndex] = row.data[colIndex];
        this.el[0].modifyGridCell(rowIndex, this.showRowHead ? colIndex + 1 : colIndex, row);
        if (commitValue) {
            var form = YIUI.FormStack.getForm(this.ofFormID);
            this.gridHandler.setCellValueToDocument(form, this, rowIndex, colIndex, row.data[colIndex][0]);
            form.getViewDataMonitor().preFireCellValueChanged(this, rowIndex, colIndex, cellKey);
            if (fireEvent) {
                this.gridHandler.fireCellChangeEvent(form, this, rowIndex, colIndex);
            }
            form.getViewDataMonitor().postFireCellValueChanged(this, rowIndex, colIndex, cellKey);
            if (!row.isDetail)
                return;
            var subDtlComps = form.subDetailInfo[this.getMetaObj().key].cells[cellKey], subDtlComp;
            if (subDtlComps != null && subDtlComps.length > 0) {
                for (var sdIndex = 0, len = subDtlComps.length; sdIndex < len; sdIndex++) {
                    subDtlComp = subDtlComps[sdIndex];
                    subDtlComp = form.getComponent(subDtlComp);
                    if (subDtlComp && parseInt($.ygrid.stripPref($.ygrid.uidPref, this.el[0].p.selectRow), 10) == rowIndex) {
                        subDtlComp.setValue(row.data[colIndex][0], true, false);
                    }
                }
            }
        }
        this.checkCellRequired(rowIndex, colIndex);
    },
    checkCellRequired: function (rowIndex, colIndex) {
        var rowData = this.getRowDataAt(rowIndex),
            cellKey = rowData.cellKeys[colIndex],
            editOpt = this.dataModel.colModel.cells[cellKey],
            cellData = this.getCellDataAt(rowIndex, colIndex);
        if (!editOpt.isRequired) return;
        if (cellData[1] == null || cellData[1] == "") {
            this.setCellRequired(rowIndex, colIndex, true);
        } else {
            this.setCellRequired(rowIndex, colIndex, false);
        }
    },
    getValueByKey: function (rowIndex, colKey) {
        var colIndex = this.getColInfoByKey(colKey)[0].colIndex;
        return this.getValueAt(rowIndex, colIndex);
    },
    getValueAt: function (rowIndex, colIndex) {
        if (rowIndex == undefined) {
            rowIndex = this.getFocusRowIndex();
        }
        if (this.dataModel.data[rowIndex] == undefined || this.dataModel.data[rowIndex].data == undefined)
            return null;
        return this.dataModel.data[rowIndex].data[colIndex][0];
    },
    /**
     * 新增表格行
     * @param rowData 行数据对象
     * @param rowIndex 行数据对象在表格数据对象中的序号
     * @param isNewGroup 是否为新分组中的明细
     * @param needCalc 是否计算默认值
     */
    addGridRow: function (rowData, rowIndex, isNewGroup, needCalc) {
        var data = this.dataModel.data, dataLength = data.length, value,
            form = YIUI.FormStack.getForm(this.ofFormID), isNewData = false,
            dtrRowIndex = this.metaRowInfo.dtlRowIndex,
            dtlMetaRow = this.metaRowInfo.rows[dtrRowIndex];
        needCalc = (needCalc == null ? true : needCalc);
        if (!rowData) {
            rowData = {};
            rowData.isDetail = true;
            rowData.isEditable = true;
            rowData.rowHeight = dtlMetaRow.rowHeight;
            rowData.rowID = this.randID();
            rowData.metaRowIndex = dtrRowIndex;
            rowData.rowType = "Detail";
            rowData.cellKeys = dtlMetaRow.cellKeys;
            rowData.data = [];
            rowData.cellBkmks = [];
            rowData.rowGroupLevel = dtlMetaRow.rowGroupLevel;
            isNewData = true;
        }
        rowIndex = parseInt(rowIndex, 10);
        if (isNaN(rowIndex) || rowIndex < 0 || (rowIndex >= dataLength && !isNewGroup)) {
            rowIndex = -1;
        }
        if (rowIndex == -1) {
            var rd, lastDetailRow;
            for (var ri = dataLength - 1; ri >= 0; ri--) {
                rd = data[ri];
                if (rd.isDetail) {
                    lastDetailRow = ri;
                    break;
                }
            }
            if (dataLength == 0) {
                rowData.insertRowID = -1;
                rowIndex = 0;
                data.push(rowData);
            } else {
                if (lastDetailRow == undefined) {
                    rowData.insertRowID = (data[dtrRowIndex - 1] == undefined ? -1 : data[dtrRowIndex - 1].rowID);
                    rowIndex = dtrRowIndex;
                } else {
                    rowData.insertRowID = data[lastDetailRow].rowID;
                    rowIndex = lastDetailRow + 1;
                }
                data.splice(rowIndex, 0, rowData);
            }
        } else {
            if (rowIndex == 0) {
                rowData.insertRowID = -1;
            } else {
                rowData.insertRowID = data[rowIndex - 1].rowID;
            }
            data.splice(rowIndex, 0, rowData);
        }
        if (isNewData) {
            for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
                var cm = this.dataModel.colModel.columns[i], cellKey = data[rowIndex].cellKeys[i],
                    editOpt = this.dataModel.colModel.cells[cellKey];
                if (cm.name == "rowID") continue;
                if (editOpt !== undefined && editOpt.tableKey == undefined && editOpt.columnKey == undefined
                    && (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink")) {
                    value = dtlMetaRow.cells[i].caption;
                }
                value = this.getCellNeedValue(rowIndex, i, value, true);
                value.push(true);
                rowData.data[i] = value;
                value = null;
            }
        }
        var ts = this.el[0];
        if (ts.p.selectRow) {
            var preSelRow = $(ts).yGrid('getGridRowById', ts.p.selectRow);
            preSelRow && $(preSelRow.cells[ts.p.selectCell]).removeClass("ui-state-highlight");
            if (this.selectionMode == YIUI.SelectionMode.ROW) {
                $(preSelRow.cells).each(function () {
                    $(this).removeClass("ui-state-highlight");
                });
            }
        }
        ts.insertGridRow(rowIndex, rowData);
        ts.p.selectRow = null;
        ts.p.selectCell = null;
        ts.grid.clearSelectCells();
        this.refreshErrors(rowIndex, false);
        if (needCalc) {
            form.getUIProcess().calcEmptyRow(this, rowIndex);
            form.getUIProcess().doPostInsertRow(this, rowIndex);
        }
        return rowData;
    },
    refreshErrors: function (rowIndex, isDelete) {
        var grid = this, eCell, eRow;
        for (var i = grid.errorInfoes.cells.length - 1; i >= 0; i--) {
            eCell = grid.errorInfoes.cells[i];
            if (eCell.rowIndex >= rowIndex) {
                if (isDelete && eCell.rowIndex == rowIndex) {
                    grid.errorInfoes.cells.splice(i, 1);
                } else {
                    eCell.rowIndex = (isDelete ? eCell.rowIndex - 1 : eCell.rowIndex + 1);
                }
            }
        }
        for (var j = grid.errorInfoes.rows.length - 1; j >= 0; j--) {
            eRow = grid.errorInfoes.rows[j];
            if (eRow.rowIndex >= rowIndex) {
                if (isDelete && eRow.rowIndex == rowIndex) {
                    grid.errorInfoes.rows.splice(j, 1);
                } else {
                    eRow.rowIndex = (isDelete ? eRow.rowIndex - 1 : eRow.rowIndex + 1);
                }
            }
        }
        grid.el.setErrorCells(grid.errorInfoes.cells);
        grid.el.setErrorRows(grid.errorInfoes.rows);
    },
    appendAutoRowAndGroup: function () {
        var th = this.el, self = this, isDetail = false , isAutoRow = false, data = this.dataModel.data;
        for (var i = 0; i < data.length; i++) {
            var rd = data[i], addRD;
            if (isDetail && !isAutoRow && !rd.isDetail) {
                addRD = this.addGridRow(null, i, false);
                i++;
            }
            isDetail = rd.isDetail;
            isAutoRow = (rd.bookmark === undefined);
        }
        if (isDetail && !isAutoRow) {
            this.addGridRow(null, i, false);
        }
        var getInsertRowIndex = function (grid, data) {
            var dtlRowIndex = grid.metaRowInfo.dtlRowIndex;
            for (var i = data.length - 1, row; i >= 0; i--) {
                row = data[i];
                if (row.rowType == "Group" || row.rowType == "Detail") {
                    return i + 1;
                } else {
                    if (row.metaRowIndex < dtlRowIndex) {
                        return i + 1;
                    }
                }
            }
            if (data.length > 0) {
                return 0;
            }
            return -1;
        };
        var addGroup = function (groupObj) {
            for (var j = 0, glen = groupObj.length; j < glen; j++) {
                var rowObj = groupObj[j];
                if (rowObj.length > 0) {
                    addGroup(rowObj);
                } else {
                    var newGR = {}, insertIndex;
                    if (rowObj.rowType === "Group") {
                        newGR.cellKeys = rowObj.cellKeys;
                        newGR.rowType = rowObj.rowType;
                        newGR.isDetail = false;
                        newGR.isEditable = false;
                        newGR.rowHeight = rowObj.rowHeight;
                        newGR.rowID = self.randID();
                        newGR.data = [];
                        newGR.cellBkmks = [];
                        for (var ci = 0, clen = rowObj.cells.length; ci < clen; ci++) {
                            var cellObj = rowObj.cells[ci];
                            newGR.data[ci] = ["", cellObj.caption, false];
                        }
                        var metaRow, index = -1, rowGroupLevel, isGroupHead, isGroupTail;
                        for (var i = 0, rLen = self.metaRowInfo.rows.length; i < rLen; i++) {
                            metaRow = self.metaRowInfo.rows[i];
                            if (metaRow.key == rowObj.key) {
                                index = i;
                                rowGroupLevel = metaRow.rowGroupLevel;
                                isGroupHead = metaRow.isGroupHead;
                                isGroupTail = metaRow.isGroupTail;
                                break;
                            }
                        }
                        newGR.metaRowIndex = index;
                        newGR.rowGroupLevel = rowGroupLevel;
                        newGR.isGroupHead = isGroupHead;
                        newGR.isGroupTail = isGroupTail;
                        insertIndex = getInsertRowIndex(self, data);
                        if (insertIndex == -1) {
                            data.push(newGR);
                            th[0].insertGridRow(data.length - 1, newGR);
                        } else {
                            data.splice(insertIndex, 0, newGR);
                            th[0].insertGridRow(insertIndex, newGR);
                        }
                    } else if (rowObj.rowType === "Detail") {
                        newGR = self.addGridRow(null, getInsertRowIndex(self, data), true);
                    }
                    newGR.inAutoGroup = true;
                }
            }
        };
        for (var ind = 0, len = this.metaRowInfo.rowGroupInfo.length; ind < len; ind++) {
            var groupObj = this.metaRowInfo.rowGroupInfo[ind];
            if (groupObj.length > 0) {
                addGroup(groupObj);
            }
        }
    },
    removeAutoRowAndGroup: function () {
        var th = this.el, data = this.dataModel.data, row;
        for (var i = data.length - 1; i >= 0; i--) {
            row = data[i];
            if (row.inAutoGroup || (row.isDetail && row.bookmark === undefined)) {
                data.splice(i, 1);
                this.el[0].deleteGridRow(i);
            }
        }
    },

    /**
     * 删除表格行
     * @param rowIndex
     */
    deleteGridRow: function (rowIndex) {
        rowIndex = parseInt(rowIndex, 10);
        if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= this.dataModel.data.length)  return false;
        var isNeedDelete = function (grid, rowIndex) {
            var row = grid.dataModel.data[rowIndex];
            if (!row.isDetail) {
                return false;
            }
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            if (form.getOperationState() != YIUI.Form_OperationState.Default) {
                if (!$.isDefined(row.bookmark)) {
                    if (rowIndex == grid.getRowCount() - 1) {
                        return false;
                    }
                    var nextRow = grid.dataModel.data[rowIndex + 1];
                    if (nextRow.rowType != "Detail") {
                        return false;
                    }
                }
            }
            return true;
        };
        if (!isNeedDelete(this, rowIndex)) {
            return false;
        }
        var selCell = this.el[0].p.selectCell;
        var bookmark = this.dataModel.data[rowIndex].bookmark;
        this.dataModel.data.splice(rowIndex, 1);
        this.el[0].deleteGridRow(rowIndex);
        this.el[0].p.selectRow = null;
        this.el[0].p.selectCell = null;
        this.el[0].grid.clearSelectCells();
        this.refreshErrors(rowIndex, true);
        var row = $("#" + $.ygrid.uidPref + rowIndex, this.el);
        if (row.length > 0) {
            $(row[0].cells[selCell]).click();
        }
        var form = YIUI.FormStack.getForm(this.ofFormID), doc = form.getDocument();
        YIUI.GridSumUtil.evalSum(form, this);
        if (bookmark == undefined) return true;
        if (!doc) return true;
        var dataTable = doc.getByKey(this.tableKey);
        if (!dataTable) return true;
        if (bookmark.length == undefined) {
            dataTable.setByBkmk(bookmark);
            dataTable.delRow(dataTable.pos);
        } else {
            for (var i = 0, len = bookmark.length; i < len; i++) {
                dataTable.setByBkmk(bookmark[i]);
                dataTable.delRow(dataTable.pos);
            }
        }
        this.gridHandler.dealWithSequence(form, this);
        return true;
    },
    /**
     * 是否有空白编辑行
     */
    hasAutoRow: function () {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i], isDetail = row.isDetail, bookmark = parseInt(row.bookmark, 10);
            if (isNaN(bookmark) && isDetail) return true;
        }
        return false;
    },
    setFocusRowIndex: function (rowIndex) {
        var gr = this.el.getGridRowAt(rowIndex + 1);
        this.el[0].p.selectRow = gr.id;
    },
    /**
     * 根据rowID获得表格行数据的序号
     * @param rowID   表格行数据的标识
     * @returns {number} 表格数据行序号
     */
    getRowIndexByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  i;
        }
        return -1;
    },
    getRowDataByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  row;
        }
        return null;
    },
    getRowDataAt: function (rowIndex) {
        return this.dataModel.data[rowIndex];
    },
    getCellIndexByKey: function (colKey) {
        return this.getColInfoByKey(colKey)[0].colIndex;
    },
    getCellDataByKey: function (rowIndex, colKey) {
        var colIndex = this.getColInfoByKey(colKey)[0].colIndex;
        return this.getCellDataAt(rowIndex, colIndex);
    },
    getCellDataAt: function (rowIndex, colIndex) {
        if (rowIndex == undefined) {
            rowIndex = this.getFocusRowIndex();
        }
        if (this.dataModel.data[rowIndex] == undefined)
            return null;
        return this.dataModel.data[rowIndex].data[colIndex];
    },
    setColumnEnable: function (colIndex, enable) {
        this.dataModel.colModel.columns[colIndex].editable = enable;
    },
    getFixRowInfoByCellKey: function (key) {
        var getFixInfoes = function (grid, rowData, rowIndex, cellKey) {
            var cKey , cEditOpt, isMatch = false, cellInfoes = [], column;
            for (var j = 0, clen = grid.dataModel.colModel.columns.length; j < clen; j++) {
                cKey = rowData.cellKeys[j];
                if (cKey == cellKey) {
                    column = grid.dataModel.colModel.columns[j];
                    cEditOpt = grid.dataModel.colModel.cells[cellKey];
                    if (grid.hasColExpand) {
                        cellInfoes.push({rowIndex: rowIndex, colIndex: j, col: column, cell: cEditOpt, metaRowIndex: rowData.metaRowIndex});
                        isMatch = true;
                    } else {
                        return [
                            {rowIndex: rowIndex, colIndex: j, col: column, cell: cEditOpt, metaRowIndex: rowData.metaRowIndex}
                        ];
                    }
                } else if (grid.hasColExpand && isMatch) {
                    return cellInfoes;
                }
            }
            return null;
        };
        var rowData, result;
        for (var i = 0, rlen = this.dataModel.data.length; i < rlen; i++) {
            rowData = this.dataModel.data[i];
            if (rowData.rowType == "Fix" || rowData.rowType == "Total") {
                result = getFixInfoes(this, rowData, i, key);
                if (result !== null) {
                    return result;
                }
            } else if (rowData.rowType == "Detail" || rowData.rowType == "Group") {
                break;
            }
        }
        for (var m = this.dataModel.data.length - 1; m >= 0; m--) {
            rowData = this.dataModel.data[m];
            if (rowData.rowType == "Fix" || rowData.rowType == "Total") {
                result = getFixInfoes(this, rowData, m, key);
                if (result !== null) {
                    return result;
                }
            } else if (rowData.rowType == "Detail" || rowData.rowType == "Group") {
                break;
            }
        }
        return null;
    },
    getColumnAt: function (colIndex) {
        return this.dataModel.colModel.columns[colIndex];
    },
    getColInfoByKey: function (key) {
        var cell = this.dataModel.colModel.cells[key], ci, column,
            dtlRi = this.metaRowInfo.dtlRowIndex, dtlMr = this.metaRowInfo.rows[dtlRi];
        if (cell == null || cell == undefined) return null;
        if (this.hasColExpand) {
            var colInfoes = [], metaCell;
            for (var cind = 0, cLen = dtlMr.cells.length; cind < cLen; cind++) {
                metaCell = dtlMr.cells[cind];
                if (metaCell.key == key) {
                    column = this.dataModel.colModel.columns[cind];
                    colInfoes.push({col: column, cell: cell, colIndex: cind, metaRow: dtlMr});
                }
            }
            return colInfoes;
        } else {
            ci = cell.colIndex;
            column = this.dataModel.colModel.columns[ci];
            return [
                {col: column, cell: cell, colIndex: ci, metaRow: dtlMr}
            ];
        }
    },
    colInfoMap: {},
    setCellEnable: function (rowIndex, cellKey, enable) {
        var rd = this.dataModel.data[rowIndex],
            gridRd = this.el[0].p.data[rowIndex], gridRow,
            colInfoes = this.colInfoMap[cellKey];
        if (colInfoes == undefined) {
            colInfoes = this.getColInfoByKey(cellKey);
            if (colInfoes !== null) {
                this.colInfoMap[cellKey] = colInfoes;
            }
        }
        if (colInfoes == null) {
            colInfoes = this.getFixRowInfoByCellKey(cellKey);
            if (colInfoes !== null) {
                this.colInfoMap[cellKey] = colInfoes;
            }
        }
        if (colInfoes == null) return;
        for (var i = 0, len = colInfoes.length; i < len; i++) {
            var colIndex = colInfoes[i].colIndex, grindex,
                cell, rnct = (this.showRowHead ? 1 : 0), editOpt = colInfoes[i].cell;
            if (editOpt == null || editOpt.edittype == "label") continue;
            if (this.rowExpandIndex == colIndex || this.treeColIndex == colIndex) {
                enable = false;
            }
            rd.data[colIndex][2] = enable;
            gridRd.data[colIndex][2] = enable;
            grindex = this.el[0].p._indexMap[rowIndex];
            if (grindex == undefined || grindex == null) return;
            gridRow = this.el[0].rows[this.el[0].p._indexMap[rowIndex]];
            if (gridRow === undefined || gridRow == null) return;
            cell = gridRow.cells[colIndex + rnct];
            var operationState = YIUI.FormStack.getForm(this.ofFormID).getOperationState();
            var formEnable = (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
            if (formEnable !== enable) {
                if (enable) {
                    $(cell).removeClass("ui-cell-disabled");
                } else {
                    $(cell).addClass("ui-cell-disabled");
                }
            } else {
                if (enable) {
                    $(cell).removeClass("ui-cell-disabled");
                }
            }
            if (editOpt && editOpt.isAlwaysShow && (rd.isDetail || rd.rowType == "Fix")) {
                switch (editOpt.formatter) {
                    case "button":
                        $(".cellEditor .upload", cell)[0] && ($(".cellEditor .upload", cell)[0].enable = enable);
                        $(".cellEditor button", cell)[0] && ($(".cellEditor button", cell)[0].enable = enable);
                        break;
                    case "hyperlink":
                    case "image":
                        $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                        break;
                    case "checkbox":
                        $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                        if (enable) {
                            $("input", cell).removeAttr("disabled");
                        } else {
                            $("input", cell).attr('disabled', 'disabled');
                        }
                        break;
                }
            }
        }
    },
    /**
     * 获取data集合中对应的单元格需要的值
     * @param rowIndex  行号
     * @param colIndex  列号
     * @param value  外来值
     * @param isData  是否为数据库存储值
     * @returns {*} json对象，形式为：{value:value,cation:caption}
     */
    getCellNeedValue: function (rowIndex, colIndex, value, isData) {
        var options, edittype, opt = {}, self = this,
            row = this.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex] ,
            editOpt = this.dataModel.colModel.cells[cellKey], caption = value,
            form = YIUI.FormStack.getForm(this.ofFormID);
        if (value instanceof Decimal) {
            caption = value.toString();
        }
        if (editOpt == undefined) return [value, caption];
        options = editOpt.editOptions;
        if (editOpt.edittype == "dynamic") {
            var typeFormula = options.typeFormula;
            var typeDefKey = form.eval(typeFormula, {form: form, rowIndex: rowIndex, colIndex: colIndex});
            var cellTypeDef = DynamicCell.getCellTypeTable()[form.formKey][typeDefKey];
            if (cellTypeDef != null) {
                edittype = cellTypeDef.options.edittype;
                opt = $.extend(opt, cellTypeDef.options, {typeDefKey: typeDefKey});
            }
        } else {
            edittype = editOpt.edittype;
        }
        switch (edittype) {
            case "numberEditor":
                opt = $.extend(true, opt, options);
                if (isData != null && !isData) {
                    value = value.replace(new RegExp(opt.sep, "gm"), "");
                }
                opt.newVal = value;
                opt.oldVal = null;
                var callBack = function (v, c) {
                    value = v;
                    if (value && value.isZero() && editOpt.editOptions.zeroString !== undefined) {
                        caption = editOpt.editOptions.zeroString;
                    } else {
                        caption = c;
                    }
                };
                YIUI.NumberEditorBehavior.checkAndSet(opt, callBack);
                if (value == null) {
                    value = new Decimal(0);
                } else if (!(value instanceof Decimal)) {
                    value = new Decimal(value, 10);
                }
                if (value.isZero() && editOpt.editOptions.zeroString !== undefined) {
                    caption = editOpt.editOptions.zeroString;
                }
                break;
            case "textButton":
            case "textEditor":
                if (!this.afterTextEditing) {
                    opt = $.extend(true, opt, options);
                    value = caption = YIUI.TextFormat.format(value, opt);
                }
                break;
            case "comboBox":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                opt = $.extend(true, opt, options);
                var combobox = {
                    key: editOpt.key,
                    typeDefKey: opt.typeDefKey,
                    sourceType: opt.sourceType,
                    formula: opt.formula,
                    globalItems: opt.globalItems,
                    queryParas: opt.queryParas,
                    needRebuild: (editOpt.needRebuild == null ? true : editOpt.needRebuild),
                    ofFormID: this.ofFormID,
                    setItems: function (items) {
                        opt.items = items;
                    },
                    checkItem: $.noop,
                    getValue: $.noop
                };
                YIUI.ComboBoxHandler.getComboboxItems(combobox, {form: form, rowIndex: rowIndex, colIndex: colIndex});
                var realValue = "" , realCaption = "", length = (opt.items == undefined ? 0 : opt.items.length);
                for (var i = 0; i < length; i++) {
                    var item = opt.items[i];
                    if (item.value == null) continue;
                    if (opt.type === "combobox") {
                        if (isData ? ( item.value.toString() == value.toString()) : (item.caption == value.toString())) {
                            realValue = item.value;
                            realCaption = item.caption;
                            break;
                        }
                    } else {
                        var valueArray = value.split(",");
                        if (isData ? (valueArray.indexOf(item.value.toString()) !== -1) : (valueArray.indexOf(item.caption) !== -1)) {
                            realValue += "," + item.value;
                            realCaption += "," + item.caption;
                        }
                    }
                }
                if (opt.type === "checklistbox") {
                    realValue = realValue.substr(1);
                    realCaption = realCaption.substr(1);
                }
                value = realValue;
                caption = realCaption;
                break;
            case "dict":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                opt = $.extend(true, opt, options);
                if (opt.isDynamic) {
                    opt.itemKey = form.eval(opt.refKey, {form: form});
                }
                if (value instanceof YIUI.ItemData || typeof value == "object") {
                    if (opt.multiSelect) {
                        var tempValue = "";
                        for (var di = 0, dlen = value.length; di < dlen; di++) {
                            tempValue += "," + value[di].oid;
                        }
                        if (tempValue.length > 0) {
                            value = tempValue.substr(1);
                        }
                        caption = "";
                    } else {
                        value = value.oid;
                    }
                }
                var values , ret, rootValue = {oid: 0, itemKey: opt.itemKey}, dictFilter = editOpt.dictFilter;
                if (dictFilter == null || editOpt.needRefreshFilter) {
                    YIUI.DictHandler.setContext({form: form});
                    dictFilter = YIUI.DictHandler.getDictFilter(form, cellKey, opt.itemFilters, opt.itemKey);
                    editOpt.needRefreshFilter = false;
                    editOpt.dictFilter = dictFilter;
                }
                if (form.dictCaption == null) {
                    form.dictCaption = {};
                }
                if (isData) {
                    if (opt.multiSelect) {
                        values = value.split(",");
                        value = [];
                        for (var index = 0, len = values.length; index < len; index++) {
                            var tempCaption = form.dictCaption[opt.itemKey + "_" + values[index]];
                            if (tempCaption == null) {
                                if (parseFloat(values[index]) != 0) {
                                    ret = YIUI.DictService.locate(opt.itemKey, "OID", values[index], dictFilter, rootValue, opt.stateMask);
                                    if (ret != null) {
                                        tempCaption = ret.caption;
                                        form.dictCaption[opt.itemKey + "_" + values[index]] = tempCaption;
                                    }
                                }
                            }
                            if (tempCaption != null)
                                caption += tempCaption + ",";
                            value.push({oid: parseFloat(values[index]), caption: tempCaption, itemKey: opt.itemKey})
                        }
                        if (caption.length > 0)
                            caption = caption.substring(0, caption.length - 1);
                    } else {
                        caption = form.dictCaption[opt.itemKey + "_" + value];
                        if (caption == null && parseFloat(value) != 0) {
                            ret = YIUI.DictService.locate(opt.itemKey, "OID", parseFloat(value), dictFilter, rootValue, opt.stateMask);
                            if (ret != null) {
                                caption = ret.caption;
                                form.dictCaption[opt.itemKey + "_" + value] = caption;
                            }
                        }
                        value = {oid: parseFloat(value), caption: caption, itemKey: opt.itemKey}
                    }
                } else {
                    if (opt.multiSelect) {
                        var str = value.split(",");
                        values = [];
                        for (var si = 0, sLen = str.length; si < sLen; si++) {
                            values.push(str[si].split(" ")[0]);
                        }
                        value = [];
                        caption = [];
                        for (var ci = 0, clen = values.length; ci < clen; ci++) {
                            ret = YIUI.DictService.locate(opt.itemKey, "Code", values[ci], dictFilter, rootValue, opt.stateMask);
                            if (ret) {
                                value.push({oid: ret.value.oid, caption: ret.caption, itemKey: opt.itemKey});
                                caption.push(ret.caption);
                                caption.push(",");
                            }
                        }
                        caption.pop();
                        caption = caption.join("");
                    } else {
                        values = value.split(" ")[0];
                        ret = YIUI.DictService.locate(opt.itemKey, "Code", values, dictFilter, rootValue, opt.stateMask);
                        if (ret) {
                            value = {oid: ret.oid, caption: ret.caption, itemKey: opt.itemKey};
                            caption = ret.caption;
                        } else {
                            value = null;
                            caption = "";
                        }
                    }
                }
                break;
            case "datePicker":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                var date, formatStr, dateStr;
                if (isData) {
                    if ($.isNumeric(value)) {
                        date = new Date(parseFloat(value));
                    } else if ($.isString(value)) {
                        dateStr = value.split(" ");
                        if (dateStr.length == 1) {
                            value = value + " 00:00:00";
                        }
                        date = new Date(Date.parse(value.replace(/-/g, "/")));
                    } else if (value instanceof Date) {
                        date = value;
                    }
                } else {
                    dateStr = value.split(" ");
                    if (dateStr.length == 1) {
                        value = value + " 00:00:00";
                    }
                    date = new Date(Date.parse(value.replace(/-/g, "/")));
                }
                value = date.getTime();
                formatStr = options.formatStr;
                caption = self.gridHandler.formatDate(date, formatStr);
                break;
            case "utcDatePicker":
                if (value == null || value.length == 0 || value === undefined || parseFloat(value) == 0) {
                    return [null, ""];
                }
                if ($.isNumeric(value)) {
                    caption = YIUI.UTCDateFormat.formatCaption(parseFloat(value), options.isOnlyDate, true);
                } else if ($.isString(value)) {
                    caption = value;
                    value = YIUI.UTCDateFormat.format(value, options);
                }
                break;
            case "checkBox":
                if (value == null || value.length == 0 || value === undefined) {
                    return [false, "false"];
                }
                if (value instanceof Decimal) {
                    value = value.toNumber();
                }
                break;
            default:
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
        }
        return [value, caption];
    },

    reload: function () {
        var form = YIUI.FormStack.getForm(this.ofFormID);
        var showLV = new YIUI.ShowGridData(form, this);
        showLV.load(this);
        this.setGridEnable(this.isEnable());
        form.getUIProcess().enableProcess.doAfterInsertRow(this, -1);
    },

    repaint: function () {
        this.repaintHeaders();
        this.el[0].p.colModel.isChange = true;
        this.refreshGrid();
    },

    repaintHeaders: function () {
        var ts = this.el[0], $rowHeader = $("tr.ui-ygrid-headers", ts.grid.hDiv),
            firstRow = $("tr.ygfirstrow", ts.grid.bDiv);
        $(ts.grid.headers).each(function (iCol, th) {
            if (ts.p.colModel[iCol].hidden) {
                $(th.el).css("display", "none");
                firstRow.find("td").eq(iCol).css("display", "none");
            } else {
                $(th.el).css("display", "");
                firstRow.find("td").eq(iCol).css("display", "");
            }
        });
        for (var hi = 0, hlen = ts.grid.headers.length; hi < hlen; hi++) {
            var header = ts.grid.headers[hi].el, cells = $rowHeader[0].cells;
            $("div", header).attr("style", "");
            if ($.inArray(cells, header) == -1) {
                $rowHeader.append(header);
            } else {
                header.after(ts.grid.headers[hi - 1].el);
            }
        }
        $(ts.grid.hDiv).find("tr.ui-ygrid-columnheader").remove();
        var column, colHeader;
        for (var ci = 0, clen = this.dataModel.colModel.columns.length; ci < clen; ci++) {
            column = this.dataModel.colModel.columns[ci];
            colHeader = $rowHeader[0].childNodes[ci + (this.showRowHead ? 1 : 0)];
            $(colHeader).attr("title", column.label);
            $(".colCaption", colHeader).html(column.label);
        }
        $(ts).initGroupHeaders(ts.p.groupHeaders);
    },
    clearGridData: function () {
        this.dataModel.data = [];
        this.el.clearGridData();
    },
    refreshGrid: function (opt) {
        if (opt == undefined || opt == null) {
            opt = {};
        }
        this.el.clearGridData();
        opt.data = this.dataModel.data;
        if (this.pageInfo.isUsePaging || this.el[0].p.rowNum == 0) {
            opt.rowNum = this.dataModel.data.length;
        }
        this.el.setGridParam(opt);
        this.isActivity() && this.el.trigger("reloadGrid");
        this.initPageOpts(opt.needCalc);
        this.initGridErrors();
        YIUI.SubDetailUtil.showSubDetailData(this, -1);
    },
    getPageInfo: function () {
        return this.pageInfo;
    },

    getRowCount: function () {
        return this.dataModel.data.length;
    },
    addGridRows: function (addJSON, addTable, needCalc) {
        var addRow, insertRi, dtBookmark, newBookmark,
            form = YIUI.FormStack.getForm(this.ofFormID),
            dataTable = form.getDocument().getByKey(this.tableKey);
        var getLastDetailRow = function (grid) {
            for (var i = grid.dataModel.data.length - 1, row; i >= 0; i--) {
                row = grid.dataModel.data[i];
                if (row.isDetail && row.bookmark !== undefined) {
                    return i;
                }
            }
            return -1;
        };
        for (var i = 0, len = addJSON.length; i < len; i++) {
            addRow = addJSON[i];
            this.initOneRow(addRow);
            insertRi = getLastDetailRow(this);
            addRow.rowID = this.randID();
            this.addGridRow(addRow, insertRi + 1, false, needCalc);
            dtBookmark = addRow.bookmark;
            addTable.setByBkmk(dtBookmark);
            dataTable.addRow();
            for (var j = 0, dcLen = dataTable.cols.length, col; j < dcLen; j++) {
                col = dataTable.cols[j];
                dataTable.set(j, addTable.get(addTable.indexByKey(col.key)));
            }
            addRow.bookmark = dataTable.getBkmk();
        }
    },
    /**
     * 获取表格某个字段的值的集合
     */
    getFieldArray: function (form, colKey, condition) {
        var doc = form.getDocument(), list = new Array(), dataTable;
        dataTable = doc.getByKey(this.tableKey);
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var rd = this.dataModel.data[i], bookmark = rd.bookmark, cell;
            if (rd.isDetail && bookmark !== undefined) {
                dataTable.setByBkmk(bookmark);
                var isSelect = false;
                if (this.selectFieldIndex != -1) {
                    isSelect = this.getValueAt(i, this.selectFieldIndex);
                }
                if (isSelect) {
                    cell = dataTable.getByKey(colKey);
                    list.push(cell);
                }
            }
        }
        if (this.selectFieldIndex != -1 && $.isEmptyObject(list)) {
            YIUI.ViewException.throwException(YIUI.ViewException.DATA_BINDING_ERROR);
        }
        return list;
    },
    isCellNull: function (rowIndex, colKey) {
        var colInfo = this.getColInfoByKey(colKey)[0], value = this.getValueAt(rowIndex, colInfo.colIndex);
        switch (colInfo.cell.edittype) {
            case "numberEditor":
                return value == 0 || value.isZero();
            case "textEditor":
                return value == null || value.length == 0;
            case "datePicker":
            case "utcDatePicker":
            case "dict":
            case "comboBox":
                return  value == null || value == undefined;
        }
        return false;
    },
    showDetailRow: function (rowIndex, calcRow) {
        var form = YIUI.FormStack.getForm(this.ofFormID),
            table = form.getDocument().getByKey(this.tableKey),
            dtlRowIndex = this.metaRowInfo.dtlRowIndex,
            metaRow = this.metaRowInfo.rows[dtlRowIndex],
            rd = this.dataModel.data[rowIndex];
        if (table == undefined || rd == undefined || rd == null || !rd.isDetail || rd.bookmark == undefined) return;
        var bookmark = rd.bookmark, editOpt, metaCell, cBookmark;
        for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
            metaCell = metaRow.cells[i];
            editOpt = this.dataModel.colModel.cells[rd.cellKeys[i]];
            if (editOpt.hasDB) {
                if (metaCell.isColExpand) {
                    cBookmark = rd.cellBkmks[i];
                    if (cBookmark) {
                        table.setByBkmk(cBookmark);
                        this.setValueAt(rowIndex, i, table.getByKey(editOpt.columnKey), false, false, true);
                    }
                } else {
                    table.setByBkmk(bookmark);
                    this.setValueAt(rowIndex, i, table.getByKey(editOpt.columnKey), false, false, true);
                }
            } else if (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink") {
                this.setValueAt(rowIndex, i, metaCell.caption, false, false, false);
            } else if (metaCell.isSelect) {
                table.setByBkmk(bookmark);
                this.setValueAt(rowIndex, i, table.getByKey(YIUI.DataUtil.System_SelectField_Key), false, false, false);
            }
        }
        if (calcRow) {
            form.getUIProcess().calcEmptyRow(this, rowIndex);
        }
    },
    setColumnCaption: function (colKey, caption) {
        var column;
        for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
            column = this.dataModel.colModel.columns[i];
            if (column.key == colKey) {
                column.label = caption;
                break;
            }
        }
        this.repaintHeaders();
    },
    getColumnCount: function () {
        return this.dataModel.colModel.columns.length;
    },
    getMetaCellInDetail: function (colIndex) {
        var dtlIndex = this.metaRowInfo.dtlRowIndex, dtlRow = this.metaRowInfo.rows[dtlIndex];
        return dtlRow.cells[colIndex];
    },
    setForeColor: function (color) {
        this.el[0].p.foreColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'color': color
        });
    },
    setBackColor: function (color) {
        this.el[0].p.backColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'background-image': 'none',
            'background-color': color
        });
    },
    initFirstFocus: function () {
        this.setCellFocus(0, 0);
    },
    setCellFocus: function (rowIndex, colIndex) {
        this.el.setCellFocus(rowIndex + 1, this.showRowHead ? colIndex + 1 : colIndex);
    },
    requestNextFocus: function () {
        this.focusManager.requestNextFocus(this);
    },
    isActivity: function () {
        var parents = this.el.parents(), parent;
        for (var i = 0, len = parents.length; i < len; i++) {
            parent = parents[i];
            if (parent.style.display == "none") {
                return false;
            }
        }
        return true;
    },
    getLastDetailRowIndex: function () {
        for (var i = this.getRowCount() - 1; i >= 0; i--) {
            var row = this.getRowDataAt(i);
            if (row.isDetail && row.bookmark == null) {
                return  i;
            }
        }
        return -1;
    },
    setCellRequired: function (rowIndex, cellIndex, isRequired) {
        this.el.setCellRequired(rowIndex + 1, this.showRowHead ? cellIndex + 1 : cellIndex, isRequired);
        var cellData = this.getCellDataAt(rowIndex, cellIndex);
        cellData[3] = isRequired;
    },
    hasSubDetailData: function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex);
        if (rowData == null) return false;
        var bookmark = rowData.bookmark, form = YIUI.FormStack.getForm(this.ofFormID),
            doc = form.getDocument(), subTables = doc.getByParentKey(this.tableKey), subTable;
        for (var i = 0, len = subTables.length; i < len; i++) {
            subTable = subTables[i];
            subTable.beforeFirst();
            while (subTable.next()) {
                if (subTable.getParentBkmk() == bookmark) {
                    return true;
                }
            }
        }
        return false;
    },
    clearAllSubDetailData: function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex);
        if (rowData == null) return false;
        var clearData = function (tableKey, parentBkmk) {
            var subTables = doc.getByParentKey(tableKey), subTable;
            for (var i = 0, len = subTables.length; i < len; i++) {
                subTable = subTables[i];
                subTable.afterLast();
                while (subTable.previous()) {
                    if (subTable.getParentBkmk() == parentBkmk) {
                        clearData(subTable.key, subTable.getBkmk());
                        subTable.delRow();
                    }
                }
            }
        };
        var bookmark = rowData.bookmark, form = YIUI.FormStack.getForm(this.ofFormID),
            doc = form.getDocument();
        clearData(this.tableKey, bookmark);
        return true;
    },
    modifyCellErrors: function (rowIndex, colIndex, isError, errorMsg) {
        var errCi, m, errCell, len = this.errorInfoes.cells.length;
        for (m = 0; m < len; m++) {
            errCell = this.errorInfoes.cells[m];
            if (errCell.rowIndex == rowIndex && errCell.colIndex == colIndex) {
                errCi = m;
                break;
            }
        }
        if (isError && errCi !== undefined) {
            this.errorInfoes.cells.splice(errCi, 1);
        } else if (!isError && errCi === undefined) {
            this.errorInfoes.cells.push({rowIndex: rowIndex, colIndex: colIndex, errorMsg: errorMsg});
        }
        this.setGridErrorCells(this.errorInfoes.cells);
    },
    checkHeadSelect: function (colIndex) {
        var hTable = $(this.el[0].grid.hDiv).find(".ui-ygrid-htable"), isAllCheck = true, detailRowCount = 0;
        for (var i = 0, len = this.getRowCount(); i < len; i++) {
            var rowData = this.getRowDataAt(i), cellData = this.getCellDataAt(i, colIndex);
            if (rowData.isDetail && rowData.bookmark != null) {
                detailRowCount++;
                if (cellData[0] == 0 || cellData[0] == null) {
                    isAllCheck = false;
                    break;
                }
            }
        }
        if (detailRowCount == 0) {
            isAllCheck = false;
        }
        $("input", hTable)[0].checked = isAllCheck;
    },
    reShowCheckColumn: function () {
        this.el.reShowCheckColumn();
    },
    getHandler: function () {
        return this.gridHandler;
    },
    getMetaCellByKey: function (cellKey) {
        var metaRow, metaCell;
        for (var i = 0, len = this.metaRowInfo.rows.length; i < len; i++) {
            metaRow = this.metaRowInfo.rows[i];
            for (var j = 0, length = metaRow.cells.length; j < length; j++) {
                metaCell = metaRow.cells[j];
                if (metaCell.key == cellKey) {
                    return metaCell;
                }
            }
        }
        return null;
    },
    dependedValueChange: function (targetField, dependencyField, value) {
        this.gridHandler.dependedValueChange(this, targetField, dependencyField, value);
    },
    doPostCellValueChanged: function (rowIndex, dependencyField, targetField, value) {
        this.gridHandler.doPostCellValueChanged(this, rowIndex, dependencyField, targetField, value);
    }
});
YIUI.reg('grid', YIUI.Control.Grid);