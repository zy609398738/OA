/**
 *
 * cellData结构: 1.value 2.caption 3.enable 4.required 5.error 6.errorMsg
 *
 */
YIUI.Control.Grid = YIUI.extend(YIUI.Control, {
    autoEl: '<table></table>',
    groupHeaders: [],
    pageInfo: null,
    rowList: [],
    gridHandler: YIUI.GridHandler,
    rowHeight: 32,
    selectFieldIndex: -1,
    columnExpandInfo: [],
    rowExpandInfo: [],
    orgMetaObj:null, // 原始配置对象
    hasColExpand:false,
    showRowHead:true,

    init: function (options) {
        this.base(options);
        this.orgMetaObj = options.metaObj;
        this.metaObj = options.metaObj;
        this.showRowHead = this.metaObj.showRowHead;
        this.primaryKeys = this.metaObj.primaryKeys;
        this.rowList = this.metaObj.rowList || [];

        this.dataModel = {
            data: [],
            colModel: {}
        };

        this.initLeafColumns();
        this.initDataModel();

        this.pageInfo = {
            curPageIndex: 0,
            totalRowCount: 0,
            pageLoadType: this.metaObj.pageLoadType,
            pageRowCount: this.metaObj.pageRowCount,
            pageIndicatorCount: this.metaObj.pageIndicatorCount,
            pageCount: 1,
            reset:function () {
                this.curPageIndex = 0;
                this.totalRowCount = 0;
                this.pageCount = 1;
            },
            calcPage:function () {
                var pageCount = Math.ceil(this.totalRowCount / this.pageRowCount);
                this.pageCount = pageCount == 0 ? 1 : pageCount;
            }
        };
    },

    initLeafColumns:function () {
        var getLeafColumns = function (_columns) {
            for (var i = 0,column; column = _columns[i]; i++) {
                if (column.columns != null && column.columns.length > 0) {
                    getLeafColumns(column.columns, leafColumns);
                } else {
                    leafColumns.push(column);
                }
            }
        }

        var leafColumns = [];

        var columns = this.getMetaObj().columns;

        getLeafColumns(columns);

        this.metaObj.leafColumns = leafColumns;
    },

    initDataModel: function () {
        var columns = [],column;
        var leafColumns = this.getMetaObj().leafColumns;
        for (var i = 0, metaColumn; metaColumn = leafColumns[i]; i++) {
            column = {};
            column.key = metaColumn.key;
            column.label = metaColumn.caption;
            column.formulaCaption = metaColumn.formulaCaption;
            if (metaColumn.refColumn != null) {
                column.isExpandCol = true;
                column.refColumn = metaColumn.refColumn.key;
            }
            column.name = "column" + i;
            column.index = i;
            column.parentKey = metaColumn.parentKey;
            column.width = metaColumn.width;
            column.hidden = false;
            column.sortable = metaColumn.sortable;
            column.visible = metaColumn.visible;
            column.columnType = metaColumn.columnType;
            columns.push(column);
        }

        var cells = {},metaRow,metaCell,cell;
        for (var j = 0;metaRow = this.getMetaObj().rows[j]; j++) {
            for (var m = 0;metaCell = metaRow.cells[m]; m++) {
                cell = $.extend(true, {}, metaCell);
                cell.colIndex = m;
                cells[cell.key] = cell;
            }
        }
        this.dataModel.colModel.columns = columns;
        this.dataModel.colModel.cells = cells;
    },

    setMetaObj: function (metaObj) {
        if (metaObj != null) {
            this.metaObj = metaObj;
        }
    },

    // 获取配置对象:拓展后的
    getMetaObj: function () {
        return this.metaObj;
    },

    // 获取原始配置对象:未拓展的
    getOrgMetaObj: function () {
        return this.orgMetaObj;
    },

    setVAlign: function (vAlign) {

    },
    setHAlign: function (hAlign) {

    },
    getColumnExpandModel: function () {
        return this.columnExpandInfo;
    },
    getRowExpandModel: function () {
        return this.rowExpandInfo;
    },
    setRowExpandModel: function (rowExpandInfo) {
        this.rowExpandInfo = rowExpandInfo;
    },
    // private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
    onSetWidth: function (width) {
        this.el && this.el.setGridWidth(width);
    },

    setHeight: function (height) {
        this.base(height);
    },

    // private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
    onSetHeight: function (height) {
        this.el && this.el.setGridHeight(height);
    },

    //获得表格最外层节点
    getOuterEl: function () {
        return $("#gbox_" + this.id);
    },

    // 刷新动态单元格
    refreshDynamicOpt:function (editOpt,rowIndex,colIndex) {
        var self = this,
            form = YIUI.FormStack.getForm(self.ofFormID),
            cxt = new View.Context(form);
        cxt.setRowIndex(rowIndex);
        cxt.setColIndex(colIndex);
        var typeDefKey = form.eval(editOpt.editOptions.typeFormula, cxt);
        if( typeDefKey ){
            var cellTypeDef = form.metaForm.cellTypeGroup[typeDefKey];

            editOpt.curOptions = cellTypeDef.editOptions;
            editOpt.typeDefKey = typeDefKey;
        } else {
            delete editOpt.curOptions;
            delete editOpt.typeDefKey;
        }
        return editOpt;
    },

    //编辑单元格时如果是自定义编辑组件，则这里进行对应组件的创建
    createCellEditor2: function (cell, rowIndex, colIndex, opt) {
        var self = this, rowData = self.dataModel.data[rowIndex],
            editOpt = opt.editOpt;
        editOpt.id = opt.id;

        var cellType = editOpt.editOptions.cellType;

        var editor, $t = self.el[0], form = YIUI.FormStack.getForm(self.ofFormID),

            cellV = rowData.data[colIndex], oldV = cellV[0], oldCaption = cellV[1];

        cell.html("").attr("tabIndex", "0");

        var setFocusAndSelect = function (editor) {
            if( !opt.normalEdit ) {
                editor.focus();
                return;
            }
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
                    // editor.getDropBtn().mousedown();
                    editor.getDropBtn().click();
                }else{
                    setFocusAndSelect(editor);
                }
            }
        };

        //动态单元格处理
        if (cellType == YIUI.CONTROLTYPE.DYNAMIC) {
            editOpt = self.refreshDynamicOpt(editOpt,rowIndex,colIndex);
            var options = editOpt.curOptions || editOpt.editOptions;
            cellType = options.cellType;
            editOpt = $.extend({}, editOpt);
            editOpt.editOptions = options;
        }

        //TODO celleditor 目前 是 先render 再设值， 可以优化为 先设值后render
        switch (cellType) {
            case YIUI.CONTROLTYPE.TEXTEDITOR:
                editor = new YIUI.CellEditor.CellTextEditor(editOpt);
                editor.render(cell);

                editor.setText(oldCaption);
                editor.getInput().addClass("celled");

                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                editor = new YIUI.CellEditor.CellNumberEditor(editOpt);
                editor.render(cell);

                editor.setText(oldCaption);
                editor.getInput().addClass("celled");

                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                editor = new YIUI.CellEditor.CellDynamicDict(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setText(oldCaption);

                editor.setValue(oldV);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.DICT:
                editor = new YIUI.CellEditor.CellDict(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setText(oldCaption);
                editor.setValue(oldV);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
            case YIUI.CONTROLTYPE.CHECKLISTBOX:

                editor = new YIUI.CellEditor.CellComboBox(editOpt);
                editor.ofFormID = self.ofFormID;

                editor.render(cell);
                editor.setValue(oldV);
                editor.setText(oldCaption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                editor = new YIUI.CellEditor.CellDatePicker(editOpt)
                editor.render(cell);
                editor.setValue(oldV);
                editor.setText(oldCaption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                editor = new YIUI.CellEditor.CellUTCDatePicker(editOpt);
                editor.render(cell);
                editor.setValue(oldV);
                editor.setText(oldCaption);
                clickDropBtn(editor);
                break;
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                editOpt.click = function () {
                    self.gridHandler.doOnCellClick(self, rowIndex, colIndex);
                };
                editor = new YIUI.CellEditor.CellTextButton(editOpt);
                editor.render(cell);
                editor.setText(oldCaption);
                editor.setValue(oldV);
                editor.getInput().addClass("celled");
                setFocusAndSelect(editor);
                break;
        }

        if(!editor){
            return;
        }

        //单元格值提交事件
        editor.saveCell = function (value) {
            editor.beforeDestroy();
            self.getControlGrid().setValueAt(rowIndex, colIndex, value, true, true);
        };

        //焦点离开事件,单元格恢复显示样式
        editor.doFocusOut = function(){
            editor.beforeDestroy();
            $($t).yGrid("restoreCell", opt.ir, opt.ic);
            // kvn获取焦点,使键盘事件可用
            // 表格切头控件 会来回调用focusin focusout
            // window.setTimeout(function () {
            //     $("#" + $t.p.knv).attr("tabindex", "-1").focus();
            // }, 0);
        };

        // 统一注册表格单元格编辑组件的事件
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

    endCheck2: function(editOpt, rowIndex, colIndex, val){

        var caption = '',
            meta = editOpt.curOptions || editOpt.editOptions,
            cellType = meta.cellType;

        var def = $.Deferred();

        var _this = this;

        switch (cellType) {
            case YIUI.CONTROLTYPE.DICT:
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                return YIUI.DictHandler.getShowCaption(val, meta.allowMultiSelection, meta.independent);
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                var settings = YIUI.NumberEditorHandler.getSettings(meta);
                caption = YIUI.DecimalFormat.format(val, settings) ;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.TEXTEDITOR:
                caption = val;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                caption = val;
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                var formID = this.ofFormID;
                var form = YIUI.FormStack.getForm(formID);

                if(meta.sourceType == YIUI.COMBOBOX_SOURCETYPE.QUERY){
                    caption = YIUI.TypeConvertor.toString(val);
                    def.resolve(caption);
                }else{
                    var cxt = new View.Context(form);
                    cxt.setRowIndex(rowIndex);
                    cxt.setColIndex(colIndex);

                    YIUI.ComboBoxHandler.getComboboxItems(form, meta, cxt)
                        .then(function(items){
                            var caption = YIUI.ComboBoxHandler.getShowCaption(meta.sourceType, items, val, (cellType == YIUI.CONTROLTYPE.CHECKLISTBOX));
                            def.resolve(caption);
                        });
                }
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                caption = YIUI.DateFormat.format(val, meta);
                def.resolve(caption);
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                caption = YIUI.UTCDateFormat.formatCaption(val, meta.onlyDate, true);
                def.resolve(caption);
                break;
            default:
                caption = YIUI.TypeConvertor.toString(val);
                def.resolve(caption);
        }
        return def.promise();
    },

    checkAndSet2: function(editOpt, rowIndex, colIndex, val, callback){

        var meta = editOpt.editOptions,
            cellType = meta.cellType,
            row = this.dataModel.data[rowIndex];

        if (cellType == YIUI.CONTROLTYPE.DYNAMIC) {

            var dType = editOpt.curOptions ? editOpt.curOptions.cellType : -1;

            editOpt = this.refreshDynamicOpt(editOpt, rowIndex, colIndex);

            var _dType = editOpt.curOptions ? editOpt.curOptions.cellType : -1;

            if( dType != _dType ) {
                row.data[colIndex][0] = null;
                row.data[colIndex][1] = '';
            }

            meta = editOpt.curOptions || editOpt.editOptions;
            cellType = meta.cellType;
        }

        var oldVal = row.data[colIndex][0];

        var options = {
            oldVal: oldVal,
            newVal: val
        };

        options = $.isDefined(meta) ? $.extend(options, meta) : options;

        var cellHandler = null;
        switch (cellType) {
            case YIUI.CONTROLTYPE.DICT:
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                cellHandler = YIUI.DictBehavior;
                break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                cellHandler = YIUI.NumberEditorBehavior;
                break;
            case YIUI.CONTROLTYPE.TEXTEDITOR:
            case YIUI.CONTROLTYPE.TEXTBUTTON:
                cellHandler = YIUI.TextEditorBehavior;
                break;
            case YIUI.CONTROLTYPE.COMBOBOX:
                cellHandler = YIUI.ComboBoxBehavior;
                break;
            case YIUI.CONTROLTYPE.CHECKLISTBOX:
                cellHandler = YIUI.CheckListBoxBehavior;
                break;
            case YIUI.CONTROLTYPE.DATEPICKER:
                cellHandler = YIUI.DatePickerBehavior;
                break;
            case YIUI.CONTROLTYPE.UTCDATEPICKER:
                cellHandler = YIUI.UTCDatePickerBehavior;
                break;
            case YIUI.CONTROLTYPE.CHECKBOX:
                cellHandler = YIUI.CheckBoxBehavior;
                break;
            default:
                cellHandler = YIUI.BaseBehavior;
        }

        return cellHandler.checkAndSet(options, callback);
    },

    // TODO
    afterEndCellEditor: function (cell, edittype, isChanged, iRow, iCol) {
        var th = this, grid = th.getControlGrid();
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        if (edittype !== undefined && edittype !== YIUI.CONTROLTYPE.LABEL && cell[0].editor != null) {
            var value = cell[0].editor.getValue(), id = th.rows[iRow].id,
                rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id),
                colIndex = th.p.rowSequences ? iCol - 1 : iCol,
                row = this.p.data[rowIndex], rowID = row.rowID, editOpt = th.getCellEditOpt(rowIndex, colIndex);
            if (edittype == YIUI.CONTROLTYPE.UTCDATEPICKER) {
                value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
            }
            // if (edittype == YIUI.CONTROLTYPE.TEXTEDITOR || edittype == YIUI.CONTROLTYPE.TEXTBUTTON) {
            //     grid.afterTextEditing = true;
            // }
            if (isChanged) {
                grid.gridHandler.doCellValueChanged(grid, rowID, colIndex, value);
            }
            if (edittype == YIUI.CONTROLTYPE.NUMBEREDITOR && th.rows[iRow] != null) {
                var curCell = th.rows[iRow].cells[iCol];
                if (value.isNegative()) {
                    $(curCell).css({color: editOpt.editOptions.negtiveForeColor});
                } else {
                    $(curCell).css({color: ""});
                }
            }
        }
    },

    setSingleSelect: function (value) {
        this.singleSelect = value;
        this.el && this.el[0].enableSelectAll(!value);
    },

    doSelect:function (rowIndex,colIndex,value,shiftDown) {
        var self = this,
            rowData = self.getRowDataAt(rowIndex),
            metaCell = self.getMetaObj().rows[rowData.metaRowIndex].cells[colIndex];
        if( rowData.rowType === 'Detail' ) {
            if( shiftDown && !metaCell.singleSelect ) {
                var sm = self.el[0].p.selectModel;
                self.gridHandler.selectRange(self,sm.top,sm.bottom + 1,colIndex,value);
            } else {
                if( metaCell.singleSelect ) {
                    self.gridHandler.selectSingle(self,rowIndex,colIndex,value);
                } else {
                    self.setValueAt(rowIndex, colIndex, value, true, true)
                }
            }
        } else {
            self.setValueAt(rowIndex, colIndex, value, true, true);
        }
    },

    alwaysShowCellEditor: function (cell, ri, ci, value, opt, rowHeight) {
        var editor,
            _this = this,
            row = _this.p.data[ri],
            rowID = row.rowID,
            grid = _this.getControlGrid(),
            enable = value[2],
            editOpt = _this.getCellEditOpt(ri, ci);

        cell.html("");
        opt.rowID = rowID;
        cell[0].style.height = rowHeight + "px";//兼容FireFox,IE

        var hitTest = function (editor) {
            var tr = editor.parents("tr");
            return parseInt($.ygrid.stripPref($.ygrid.uidPref, tr[0].id), 10);
        }

        switch (editOpt.editOptions.cellType) {
            case YIUI.CONTROLTYPE.BUTTON:
                var icon = "";
                if (opt.icon) {
                    icon = "<span class='icon button' style='background-image: url(Resource/" + opt.icon + ")'></span>";
                }
                editor = $("<div class='ui-btn button cellEditor'>" + "<button>" + icon
                    + "<span class='txt button'>" + (value[1] == null ? "" : value[1]) + "</span></button></div>");
                editor[0].enable = enable;
                // 兼容IE
                if( $.browser.isIE && editOpt.key && editOpt.key.toLowerCase().indexOf('upload') != -1 ) {
                    $("<input type='file' class='upload' name='file'/>").appendTo(editor);
                }
                editor.appendTo(cell);
                editor.mousedown(function (e) {
                    e.target.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                    e.target.enable && $(this).removeClass("hover");
                });

                // delegate!!
                editor.delegate("button,input.upload","click",function (e) {
                    var target = e.target;
                    if ( !$(target).closest(".cellEditor")[0].enable ) {
                        e.stopPropagation();
                        return false;
                    }
                    if( $(target).hasClass('upload') ) {
                        window.up_target = target;
                    }
                    grid.gridHandler.doOnCellClick(grid, hitTest(editor), ci);
                    e.stopPropagation();
                });

                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case YIUI.CONTROLTYPE.HYPERLINK:
                var showV = (value[1] == null ? "" : value[1]);
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
                    if ( !this.enable ) {
                        e.stopPropagation();
                        return false;
                    }
                    if (opt.url && opt.targetType == YIUI.Hyperlink_TargetType.New) {
                        window.open(opt.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                    } else if (!opt.url) {
                        grid.gridHandler.doOnCellClick(grid, hitTest(editor), ci);
                    }
                    e.stopPropagation();
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case YIUI.CONTROLTYPE.CHECKBOX:
                var editor = $("<span class='cellEditor chk'/>");
                if( YIUI.TypeConvertor.toBoolean(value[0]) ) {
                    editor.addClass('checked');
                }
                editor.attr('enable',value[2]);
                cell.prepend(editor);
                editor.click(function (e) {
                    if( $(this).attr('enable') === 'true' ) {
                        var grid = _this.getControlGrid(),
                            value = !$(this).hasClass('checked'),
                            rowIndex = hitTest(editor);

                        grid.doSelect(rowIndex,ci,value,e.shiftKey);
                    }
                });
                break;
            case YIUI.CONTROLTYPE.IMAGE:
                opt.ofFormID = grid.ofFormID;
                opt.enable = enable;
                opt.value = value[0];
                opt.gridKey = grid.key;
                editor = new YIUI.CellEditor.CellImage(opt);
                editor.render(cell);
                editor.setEnable(enable);
                editor.saveCell = function (value) {
                    _this.getControlGrid().setValueAt(hitTest(editor.getEl()), ci, value, true, true);
                };
                editor.yesCom.click = function () {
                    if(this.enable) {
                        grid.gridHandler.doOnCellClick(grid, hitTest(editor.getEl()), ci);
                    }
                }
                cell.attr("title", editor.pathV);
                cell[0].editor = editor;
                break;
            case YIUI.CONTROLTYPE.LABEL:
                var showV = (value[1] == null ? "" : value[1]);
                editor = $("<div class='cellEditor' style='width: 100%;height: 100%;line-height: " + rowHeight + "px'>" + showV + "</div>");
                editor[0].enable = enable;
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
        }
    },

    gotoPage: function (page) {
        return this.gridHandler.doGoToPage(this, page - 1 );
    },

    // 滚动分页:rowNum=50,非滚动分页:显示全部,rowNum无用
    initPageOpts: function () {
        if( this.getMetaObj().pageLoadType != YIUI.PageLoadType.NONE ) {
            var form = YIUI.FormStack.getForm(this.ofFormID),count;
            if (this.getMetaObj().pageLoadType == YIUI.PageLoadType.DB) {
                count = YIUI.TotalRowCountUtil.getRowCount(form.getDocument(), this.tableKey);
            } else {
                count = form.getDocument().getByKey(this.tableKey).size();
            }
            this.pageInfo.totalRowCount = count;
            this.pageInfo.calcPage();
        } else {
            this.pageInfo.totalRowCount = this.dataModel.data.length;
        }
    },

    rowOptFunc: function (cmd) {
        var self = this;
        var rowIndex = self.p.selectModel.focusRow;
        if( rowIndex == -1 )
            return;
        var grid = self.getControlGrid();
        switch ( cmd ) {
            case "add":
                grid.insertRow(rowIndex);
                break;
            case "del":
                grid.deleteGridRow(rowIndex);
                break;
            case "upRow":
                grid.gridHandler.doShiftUpRow(grid, rowIndex);
                break;
            case "downRow":
                grid.gridHandler.doShiftDownRow(grid, rowIndex);
                break;
        }
    },

    onSortClick: function (ci, sortType) {
        this.gridHandler.doOnSortClick(this, ci, sortType);
    },

    //行点击事件
    clickRow:function (newRowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnRowClick(grid, newRowIndex);
    },

    //行切换事件
    focusRowChanged:function (newRowIndex, oldRowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnFocusRowChange(grid, newRowIndex, oldRowIndex);
    },

    // 行双击事件
    dblClickRow: function (rowIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnRowDblClick(grid, rowIndex);
    },

    // 单元格双击事件
    dblClickCell: function (rowIndex, colIndex) {
        var grid = this.getControlGrid();
        grid.gridHandler.doOnCellDblClick(grid, rowIndex, colIndex);
    },

    getFocusRowIndex: function () {
        if(this.el){
            return this.el.getFocusRowIndex();
        }
        return -1;
    },
    getFocusColIndex: function () {
        if(this.el){
            return  this.el.getFocusColIndex();
        }

        return -1;
    },

    getControlGrid: function () {
        return this;
    },
    //初始化表格构建相关的属性
    initOptions: function () {

        var metaObj = this.getMetaObj();

        this.options = {
            populate: false,
            selectionMode: metaObj.selectionMode,
            treeIndex: this.treeIndex,
            rowExpandIndex: this.rowExpandIndex,
            rowSequences: this.showRowHead,
            enable: metaObj.editable,
            colModel: this.dataModel.colModel.columns,
            cellLookup: this.dataModel.colModel.cells,
            data: this.dataModel.data,
            navButtons: {
                add: metaObj.canInsert, addIcon: "ui-icon-plus", addFunc: this.rowOptFunc,
                del: metaObj.canDelete, delIcon: "ui-icon-trash", delFunc: this.rowOptFunc,
                upRow: metaObj.canShift, upRowIcon: "ui-icon-up", upRowFunc: this.rowOptFunc,
                downRow: metaObj.canShift, downRowIcon: "ui-icon-down", downRowFunc: this.rowOptFunc,
                bestWidth: true, bestWidthIcon:"ui-icon-bestwidth",
                //frozenRow: true, frozenRowIcon:"ui-icon-frozenRow",
               // frozenColumn: true, frozenColumnIcon:"ui-icon-frozenColumn",
            },
            createCellEditor: this.createCellEditor2,
            endCheck: this.endCheck,
            alwaysShowCellEditor: this.alwaysShowCellEditor,
            afterEndCellEditor: this.afterEndCellEditor,
            extKeyDownEvent: this.extKeyDownEvent,
            onSortClick: this.onSortClick,
            clickRow: this.clickRow,
            focusRowChanged: this.focusRowChanged,
            dblClickRow: this.dblClickRow,
            dblClickCell: this.dblClickCell,
            getControlGrid: this.getControlGrid,
            pageInfo: this.pageInfo,
            gotoPage: this.gotoPage,
            rowNumChange: this.rowNumChange,
            rowList: this.rowList,
            treeExpand: metaObj.treeExpand,
            selectFieldIndex: this.selectFieldIndex,
            scrollPage: metaObj.pageLoadType == YIUI.PageLoadType.NONE && this.treeIndex == -1
        };
    },

    setGroupHeaders:function (groupHeaders) {
        this.groupHeaders = groupHeaders;
    },

    onRender: function (parent) {
        var self = this;
        this.base(parent);
        this.initOptions();
        this.el[0].getControlGrid = function () {
            return self;
        };
        this.el.yGrid(this.options);
        this.el.buildGroupHeaders(this.groupHeaders);
        this.refreshGrid();
        this.options = null;
    },

    beforeDestroy: function () {
        this.dataModel = null;
        this.groupHeaders = null;
        this.errorInfoes = null;
        this.el && this.el.GridDestroy();
    }
});

YIUI.Control.Grid = YIUI.extend(YIUI.Control.Grid, {   //纯web使用的一些方法
    rowIDMask: 0,
    randID: function () {
        return this.rowIDMask++;
    },
    setEnable: function (enable) {

        // this.colInfoMap = {};
        this.base(enable);
        //   if (this.el == null) // el没有,往模型中插行
        //        return;
        var el = this.el;
        if(el) {
            this.el[0].p.enable = enable;
            el.prop("disabled",false);
        }

        if (this.condition && this.getRowCount() > 0) {
            this.repaint();
            return;
        }

        if( this.getMetaObj().treeType == -1 && !this.hasRowExpand ) {
            this.removeAutoRowAndGroup();
            if ( enable && this.getDetailMetaRow() && this.newEmptyRow ) {
                if( this.isSubDetail ) {
                    var form = YIUI.FormStack.getForm(this.ofFormID),
                        par = YIUI.SubDetailUtil.getBindingGrid(form,this),
                        focusRow = par.getFocusRowIndex();
                    if( $.isNumeric(focusRow) && focusRow != -1 ) {
                        this.appendAutoRowAndGroup();
                    }
                } else {
                    this.appendAutoRowAndGroup();
                }
                if ( this.getMetaObj().hideGroup4Editing ) {
                    this.removeGroupRow4Editing();
                    this.ensureEmptyRow();
                }
            }
        }
        this.repaint();
    },

    setColumnVisible: function (index, visible) {

        var _this = this;

        if( !_this.impl_setVisible ) {
            _this.impl_setVisible = function (i,v) {
                var column = _this.dataModel.colModel.columns[i];
                if( !_this.visibleChanged ) {
                    _this.visibleChanged = column.hidden == v;
                }
                column.hidden = !v;
            }
        }

        if( $.isArray(index) ) {
            index.forEach(function (ele,idx) {
                _this.impl_setVisible(ele,visible[idx]);
            });
        } else {
            _this.impl_setVisible(index,visible);
        }

        if ( _this.visibleChanged && this.el ) {
            this.refreshGrid();
        }
    },
    setValueByKey: function (rowIndex, colKey, newValue, commitValue, fireEvent) {
        var colInfoes = this.getColInfoByKey(colKey);
        for (var i = 0, len = colInfoes.length; i < len; i++) {
            this.setValueAt(rowIndex, colInfoes[i].colIndex, newValue, commitValue, fireEvent, false);
        }
    },
    setCellBackColor: function (rowIndex, colIndex, color) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellBackColor(rowIndex, colIndex, color);
    },
    setCellForeColor: function (rowIndex, colIndex, color) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellForeColor(rowIndex, colIndex, color);
    },
    setFocusCell: function (rowIndex, colIndex) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        if( !this.el )
            return;
        this.el.setCellFocus(rowIndex, colIndex);
    },

    setCaptionAt: function (rowIndex, colIndex, caption) {
        var cellData = this.getCellDataAt(rowIndex,colIndex);
        cellData[1] = caption;
    },

    /**
     * 设置表格单元格的存储到数据库的值
     *
     * @param rowIndex  表格值所在行集合的序号
     * @param colIndex  表格值所在列集合的序号
     * @param newValue  新值
     * @param commitValue  是否更新document
     * @param fireEvent  是否执行关联计算表达式及相关事件
     * @param ignoreChanged 忽略单元格变化事件
     */

    setValueAt: function (rowIndex, colIndex, newValue, commitValue, fireEvent, ignoreChanged) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        var row = this.dataModel.data[rowIndex];
        //cellKey = row.cellKeys[colIndex];
        //var editOpt = this.dataModel.colModel.cells[cellKey];

        var _this = this;

        var editOpt = _this.getMetaObj().rows[row.metaRowIndex].cells[colIndex];

        var cellData = _this.dataModel.data[rowIndex].data[colIndex];

        var isChanged = _this.checkAndSet2(editOpt, rowIndex, colIndex, newValue,
            function(val) {

                _this.dataModel.data[rowIndex].data[colIndex][0] = val;

                //显示单元格内容， 为异步处理
                _this.endCheck2(editOpt, rowIndex, colIndex, val)
                    .done(function(text){

                        // 异步设值的情况下可能当前界面已经不存在,saveData();close()
                        if( _this.isDestroyed ) {
                            return;
                        }

                        //计算caption 为异步， 分页情况下 单元格可能不正确，
                        //此时需判断，model中的行列数，并且判断 是否是原来的cellmodel
                        var rows = _this.dataModel.data;
                        if(rowIndex >= rows.length){
                            return;
                        }

                        var cells = rows[rowIndex].data;
                        if(colIndex >= cells.length){
                            return;
                        }


                        if(cellData == cells[colIndex]){
                            _this.dataModel.data[rowIndex].data[colIndex][1] = text;

                            if(!_this.el){
                                return ;
                            }

                            _this.el[0].modifyGridCell2(rowIndex, colIndex, row, true);
                        }
                    });
            });

        if(isChanged && !ignoreChanged){
            var form = YIUI.FormStack.getForm(this.ofFormID);

            if (commitValue) {
                this.gridHandler.setCellValueToDocument(form, this, rowIndex, colIndex, row.data[colIndex][0]);
            }

            form.getViewDataMonitor().preFireCellValueChanged(this, rowIndex, colIndex, editOpt.key);

            if (fireEvent) {
                this.gridHandler.fireEvent(form, this, rowIndex, colIndex);
            }

            form.getViewDataMonitor().postFireCellValueChanged(this, rowIndex, colIndex, editOpt.key);
        } else {
            this.el && _this.el[0].modifyGridCell2(rowIndex, colIndex, row, false, editOpt.editOptions.cellType == YIUI.CONTROLTYPE.DYNAMIC);
        }
    },

    getCellEditOpt:function (cellKey) {
        return this.dataModel.colModel.cells[cellKey];
    },

    getMetaCellByColumnKey: function (columnKey) {
        var detailRow = this.getDetailMetaRow();
        if( !detailRow ) {
            return null;
        }
        var metaCell,
            _columnKey;
        for( var i = 0,size = detailRow.cells.length;i < size;i++ ) {
            metaCell = detailRow.cells[i];
            _columnKey = metaCell.columnKey;
            if( _columnKey && _columnKey == columnKey ) {
                return metaCell;
            }
        }
        return null;
    },

    getValueByKey: function (rowIndex, colKey) {
        var colIndex = this.getColInfoByKey(colKey)[0].colIndex;
        return this.getValueAt(rowIndex, colIndex);
    },

    getValueAt: function (rowIndex, colIndex) {
        if ( rowIndex == undefined || rowIndex == -1 ) {
            return null;
        }
        var rowData = this.dataModel.data[rowIndex];
        if (rowData == undefined || rowData.data == undefined)
            return null;
        return rowData.data[colIndex][0];
    },

    /**
     *  提供给函数等外部使用使用的插行方法,插入空白行以及树形行
     * @param rowIndex 插行的位置
     */
    insertRow:function (rowIndex) {
        if( !this.impl_insertRow ) {
            if( this.treeIndex == -1 ) {
                this.impl_insertRow = function (rowIndex) {
                    var detailRow = this.getDetailMetaRow();
                    if( !detailRow )
                        return -1;
                    var level = 0;
                    if( rowIndex != -1 && rowIndex < this.getRowCount() ) {
                        level = this.getRowDataAt(rowIndex).rowGroupLevel;
                    }

                    // 去掉当前行样式
                    if( this.el ) {
                        this.el[0].unselectGridRow(rowIndex);
                    }

                    var ri = this.addGridRow(rowIndex,detailRow,null,level,true);

                    if( !this.el ) return ri;

                    // 设置焦点
                    var ci = this.getFocusColIndex();
                    this.el.setCellFocus(ri,ci == -1 ? 0 : ci);

                    return ri;
                }
            } else {
                this.impl_insertRow = function (rowIndex) {
                    var detailRow = this.getDetailMetaRow();
                    if( !detailRow )
                        return -1;
                    var row,
                        parent,
                        index,
                        treeLevel;
                    if( rowIndex != -1 && rowIndex < this.getRowCount() ) {
                        row = this.getRowDataAt(rowIndex);
                        treeLevel = row.treeLevel;
                        if( row.childRows ) {
                            parent = row;
                            index = rowIndex + row.childRows.length + 1;
                            treeLevel++;
                        } else if ( !row.parentRow ) {
                            parent = row;
                            index = rowIndex + 1;
                            treeLevel++;
                        } else {
                            parent = row.parentRow;
                            index = rowIndex;
                        }
                    }

                    // 去掉当前行样式
                    if( this.el ) {
                        this.el[0].unselectGridRow(rowIndex);
                    }

                    var ri = this.addGridRow(index,detailRow,null,0,true,function (rowData) {
                        rowData.treeLevel = treeLevel;
                        rowData.isLeaf = true;
                        rowData.parentRow = parent;
                    });

                    var newRow = this.getRowDataAt(ri);
                    if( parent != null ) {
                        if( !parent.childRows ) {
                            parent.childRows = [];
                        }
                        parent.childRows.push(newRow.rowID);
                        parent.isLeaf = false;
                    }

                    if( !this.el ) return ri;

                    // 设置焦点
                    var ci = this.getFocusColIndex();
                    this.el.setCellFocus(ri,ci == -1 ? 0 : ci);

                    return ri;
                }
            }
        }
        return this.impl_insertRow(rowIndex);
    },

    /**
     * 新增表格行,底层插行方法
     * @param rowIndex 插行的位置
     * @param metaRow 行数据对象
     * @param groupLevel 分组的层级
     * @param fireEvent 是否触发事件
     * @param fn 回调,用于给新增的数据行设置相关属性
     */
    addGridRow: function (rowIndex, metaRow, bookmarkRow, groupLevel, fireEvent, fn) {
        rowIndex = parseInt(rowIndex, 10);
        if ( isNaN(rowIndex) || rowIndex < 0 ) {
            rowIndex = -1;
        }

        var index = YIUI.GridUtil.insertRow(this, rowIndex, metaRow, bookmarkRow, groupLevel);

        if( !this.el ) return index;

        var rowData = this.dataModel.data[index];

        $.isFunction(fn) && fn.call(this,rowData);

        this.el[0].insertGridRow(index, rowData);

        this.gridHandler.rowInsert(this,index,!fireEvent ? true : fireEvent);

        return index;
    },

    appendAutoRowAndGroup:function () {
        this.removeAutoRowAndGroup();
        // 添加空白行
        var rowData;
        for( var i = this.getRowCount() - 1; i >= 0; --i) {
            rowData = this.getRowDataAt(i);
            if( rowData.rowType === 'Detail' ) {
                this.appendEmptyRow(i);
            }
        }

        // 添加空白分组
        if( this.hasGroupRow ) {
            this.appendEmptyGroup();
        }

        // 确保有空白编辑行
        this.ensureEmptyRow();
    },

    ensureEmptyRow:function () {
        if( !this.hasAutoRow() && this.newEmptyRow ) {
            var rowIndex = this.getRowCount() - this.bottomFixRowCount;
            if( this.hasTotalRow && this.totalAfterDetail ) {
                rowIndex = rowIndex - 1;
            }
            this.addGridRow(rowIndex, this.getDetailMetaRow(), null, 0, true);
        }
    },

    appendEmptyRow:function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex);
        var nextRowIndex = rowIndex + 1;
        // 最后一行
        if( nextRowIndex >= this.getRowCount() ) {
            if( rowData.rowType === 'Detail') {
                this.addGridRow(nextRowIndex,this.getDetailMetaRow(),null,rowData.rowGroupLevel,true);
            }
        } else {
            var nextRow = this.getRowDataAt(nextRowIndex);
            if( rowData.rowType === 'Detail' && (nextRow.rowType === 'Group' ||
                nextRow.rowType === 'Total' || nextRow.rowType === 'Fix') ) {
                this.addGridRow(nextRowIndex,this.getDetailMetaRow(),null,rowData.rowGroupLevel,true);
            }
        }
    },

    appendEmptyGroup:function () {

        var _this = this;

        // 静态私有方法
        var createNewGroup = function(groupLevel,groupRow){
            var rowObject;
            for( var i = 0,size = groupRow.objectArray.length; i < size;i++ ) {
                rowObject = groupRow.objectArray[i];
                if( rowObject.objectType === YIUI.MetaGridRowObjectType.ROW ) {
                    if( rowObject.rowType === 'Detail' ) {
                        groupLevel++;
                    }
                    var rowIndex = _this.getRowCount() - _this.bottomFixRowCount;
                    if( _this.hasTotalRow && _this.totalAfterDetail ) {
                        rowIndex = rowIndex - 1;
                    }
                    var metaRow = _this.getMetaObj().rows[rowObject.rowIndex];
                    var newRowIndex = _this.addGridRow(rowIndex,metaRow,null,groupLevel,true);
                    var rowData = _this.getRowDataAt(newRowIndex);
                    rowData.inAutoGroup = true;
                    if( rowObject.rowType === 'Detail' ) {
                        groupLevel--;
                    }
                } else {
                    groupLevel++;
                    createNewGroup(groupLevel,rowObject);
                    groupLevel--;
                }
            }
        }

        createNewGroup(0,this.getMetaObj().rootGroup);
    },

    // 去除所有空白行以及空白分组
    removeAutoRowAndGroup: function () {
        var data = this.dataModel.data, row;
        for (var i = data.length - 1; row = data[i]; i--) {
            if ( row.inAutoGroup || YIUI.GridUtil.isEmptyRow(row) ) {
                data.splice(i, 1);
                this.el && this.el[0].deleteGridRow(i);
            }
        }
    },

    // 编辑时隐藏分组行
    removeGroupRow4Editing:function () {
        var data = this.dataModel.data,row;
        for( var i = data.length - 1; row = data[i]; i-- ) {
            if( row.rowType == 'Group' || YIUI.GridUtil.isEmptyRow(row) ) {
                data.splice(i,1);
                this.el && this.el[0].deleteGridRow(i);
            }
        }
    },

    /**
     * 删除行,静默删除,只删除模型中的行以及界面上行
     * 不删除数据
     * @param rowIndex
     */
    deleteRowAt:function (rowIndex) {

        var lastRow = rowIndex == this.dataModel.data.length - 1;

        var rowData = this.dataModel.data[rowIndex],
            parent = rowData.parentRow;

        // 删除模型行
        this.dataModel.data.splice(rowIndex, 1);

        // 从父行中移除
        if( parent ) {
            parent.childRows.splice(parent.childRows.indexOf(rowData.rowID),1);
        }

        if( !this.el ){
            return;
        }

        // 删除界面行
        this.el[0].deleteGridRow(rowIndex);

        // 焦点转移
        var ri = lastRow ? rowIndex - 1 : rowIndex,ci = this.getFocusColIndex();

        // 先清空选择模型
        this.el[0].cleanSelection();

        // 再设置焦点,避免进入编辑状态
        if ( ri >= 0 ) {
            this.el.setCellFocus(ri,ci == -1 ? 0 : ci);
        }
    },

    /**
     * 删除表格行
     * @param rowIndex
     */
    deleteGridRow: function (rowIndex) {
        rowIndex = parseInt(rowIndex, 10);

        var form = YIUI.FormStack.getForm(this.ofFormID);

        // 是否需要删除
        var isNeedDelete = function (form,grid,rowIndex) {

            if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= grid.dataModel.data.length)
                return false;

            var row = grid.dataModel.data[rowIndex];
            if (!row.isDetail) {
                return false;
            }

            if (form.getOperationState() != YIUI.Form_OperationState.Default) {

                if( !grid.newEmptyRow )
                    return true;


                if ( YIUI.GridUtil.isEmptyRow(row) ) {
                    if (rowIndex == grid.getRowCount() - 1) {
                        return false;
                    }
                    if (grid.dataModel.data[rowIndex + 1].rowType != "Detail") {
                        return false;
                    }
                }
            }
            return true;
        };

        if (!isNeedDelete(form,this,rowIndex)) {
            return false;
        }

        // 删除行数据
        var deleteDir = function (form,grid,rowIndex) {

            // 取出数据
            var bkmkRow = grid.dataModel.data[rowIndex].bkmkRow,bookmark;
            if( bkmkRow ) {
                if( bkmkRow.getRowType() === YIUI.IRowBkmk.Detail ) {
                    bookmark = bkmkRow.getBookmark();
                } else {
                    bookmark = bkmkRow.getRowArray();
                }
            }

            // 删除影子表数据
            grid.tableKey && deleteShadowRow(form,grid,bookmark);

            // 删除子明细数据
            !grid.hasColExpand && deleteSubDetailData(form,grid,bookmark);

            // 删除数据行
            grid.tableKey && deleteData(form,grid,bookmark);

            // 删除界面行并转移焦点
            ts.deleteRowAt(rowIndex);

            // 删除行事件
            grid.gridHandler.rowDelete(form,grid,rowIndex);
        };

        var deleteData = function (form,grid,bookmark) {
            if ( bookmark == undefined )
                return true;
            var dataTable = form.getDocument().getByKey(grid.tableKey);
            if ( $.isArray(bookmark) ) {
                for (var i = 0, len = bookmark.length; i < len; i++) {
                    dataTable.setByBkmk(bookmark[i]);
                    dataTable.delRow();
                }
            } else {
                dataTable.setByBkmk(bookmark);
                dataTable.delRow();
            }
        }

        var deleteSubDetailData = function (form,grid,bookmark) {
            if ( bookmark == undefined )
                return;
            var delTblData = function (tbl) {
                var subTables = form.getDocument().getByParentKey(tbl.key),subTable;
                var OID = tbl.getByKey('OID'),POID;
                for( var i = 0,size = subTables.length;i < size;i++ ) {
                    subTable = subTables[i];
                    subTable.afterLast();
                    while ( subTable.previous() ) {
                        POID = subTable.getByKey('POID');
                        if ( (POID > 0 && OID === POID) || subTable.getParentBkmk() == tbl.getBkmk() ) {
                            delTblData(subTable);
                            subTable.delRow();
                        }
                    }
                }
            }
            var table = form.getDocument().getByKey(grid.tableKey);
            table.setByBkmk(bookmark);
            delTblData(table);
        }

        var deleteShadowRow = function (form,grid,bookmark) {
            var doc = form.getDocument(), dataTable = doc.getByKey(grid.tableKey);
            var shadowTbl = doc.getShadow(grid.tableKey);
            if( !shadowTbl )
                return;
            if( $.isArray(bookmark) ) {
                for( var i = 0,size = bookmark.length;i < size;i++ ) {
                    dataTable.setByBkmk(bookmark[i]);
                    var bookmark = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                    if( bookmark != -1 ) {
                        shadowTbl.setByBkmk(bookmark);
                        shadowTbl.setState(DataDef.R_New);// 置为新增状态,直接删除
                        shadowTbl.delRow();
                    }
                }
            } else {
                dataTable.setByBkmk(bookmark);
                var bookmark = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                if( bookmark != -1 ) {
                    shadowTbl.setByBkmk(bookmark);
                    shadowTbl.setState(DataDef.R_New);// 置为新增状态,直接删除
                    shadowTbl.delRow();
                }
            }
        }

        // 递归删除子行及自己
        var deleteTreeRow = function (form,grid,rowData) {
            var childRows = rowData.childRows,_child;
            if( childRows ) {
                for( var i = childRows.length - 1;i >=0;i-- ) {
                    _child = grid.getRowDataByID(childRows[i]);
                    if( !_child.isLeaf && _child.childRows ) {
                        deleteTreeRow(form,grid,_child);
                    } else {
                        deleteDir(form,grid,grid.getRowIndexByID(childRows[i]));
                    }
                }
            }
            deleteDir(form,grid,grid.getRowIndexByID(rowData.rowID));
        }

        var ts = this;
        var rowData = this.dataModel.data[rowIndex];
        if (!YIUI.GridUtil.isEmptyRow(rowData) ) {
            if( YIUI.SubDetailUtil.hasSubDetailData(form,this,rowIndex) ) {
                var options = {
                    msg: YIUI.I18N.grid.whetherEmpty,
                    msgType: YIUI.Dialog_MsgType.YES_NO
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
                dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                    deleteDir(form,ts,rowIndex);
                });
            } else if ( ts.treeIndex != -1 && rowData.childRows ) {
                var options = {
                    msg: YIUI.I18N.grid.whetherEmpty,
                    msgType: YIUI.Dialog_MsgType.YES_NO
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
                dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
                    deleteTreeRow(form,ts,rowData);
                });
            } else {
                deleteDir(form,ts,rowIndex);
            }
        } else {
            deleteDir(form,ts,rowIndex);
        }
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
            detailRow = this.getDetailMetaRow();
        if ( !cell ) return null;
        var colInfoes = [],metaCell;
        if ( this.hasColExpand ) {
            for (var idx = 0, cLen = detailRow.cells.length; idx < cLen; idx++) {
                metaCell = detailRow.cells[idx];
                if( metaCell.key !== key )
                    continue;

                if( metaCell.isColExpand ) {
                    colInfoes.isColExpand = true;
                }

                column = this.dataModel.colModel.columns[idx];
                colInfoes.push({col: column, cell: cell, colIndex: idx, metaRow: detailRow});
            }
            return colInfoes;
        } else {
            column = this.dataModel.colModel.columns[cell.colIndex];
            colInfoes.push({col: column, cell: cell, colIndex: cell.colIndex, metaRow: detailRow});
            return colInfoes;
        }
    },

//    colInfoMap: {},

    // 设置单元格可用
    setCellEnable: function (rowIndex, colIndex, enable) {
        var rowData = this.dataModel.data[rowIndex];

        var editOpt = this.getCellEditOpt(rowData.cellKeys[colIndex]);
        if ( !editOpt || editOpt.edittype == "label" )
            return;
        rowData.data[colIndex][2] = enable;

        if( !this.el )
            return;

        this.el.setCellEnable(rowIndex, colIndex, enable);
    },

    // 设置单元格必填
    setCellRequired: function (rowIndex, cellIndex, isRequired) {
        var cellData = this.getCellDataAt(rowIndex, cellIndex);
        cellData[3] = isRequired;
        if( !this.el )
            return;
        this.el.setCellRequired(rowIndex, cellIndex, isRequired);
    },

    // 设置单元格错误
    setCellError: function (rowIndex, colIndex, error, errorMsg) {
        var cellData = this.getCellDataAt(rowIndex,colIndex);
        cellData[4] = error;
        cellData[5] = errorMsg;
        if( !this.el )
            return;
        this.el.setCellError(rowIndex, colIndex, error, errorMsg);
    },

    // 设置行错误
    setRowError: function (rowIndex,error,errorMsg) {
        var rowData = this.getRowDataAt(rowIndex);
        rowData.error = error;
        rowData.errorMsg = errorMsg;
        if( !this.el )
            return;
        this.el.setRowError(rowIndex,error,errorMsg);
    },

    // 设置行可见
    setRowVisible: function (rowIndex,visible) {
        var rowData = this.getRowDataAt(rowIndex);
        rowData.visible = visible;
        if( !this.el )
            return;
        this.el.setRowVisible(rowIndex,visible);
    },

    refreshGrid: function (opt) {
        if( !this.el )
            return;
        this.el.clearGridData();
        this.initPageOpts();

        this.el[0].p.data = this.dataModel.data;
        this.el.trigger("reloadGrid");
    },

    // show的时候不调用这个方法,会render两次
    load: function (construct) {
        var form = YIUI.FormStack.getForm(this.ofFormID);
        var show = new YIUI.ShowGridData(form, this);
        show.load(construct);

        if( this.el ) {
            this.getOuterEl().remove();
            this.container && this.onRender(this.container);
            this.lastSize.width > 0 && this.el.setGridWidth(this.lastSize.width);
            this.lastSize.height > 0 && this.el.setGridHeight(this.lastSize.height);
        }

        form.getUIProcess().resetComponentStatus(this);

        this.refreshSelectAll();
    },

    repaint: function () {
        if(!this.el)
            return;
        this.repaintHeaders();
        this.el[0].updateToolBox();
    },

    repaintHeaders: function (refreshCaption) {
        if(!this.el)
            return;

        var ts = this.el[0],
            $rowHeader = $("tr.ui-ygrid-headers", ts.grid.hDiv),
            $firstRow = $("tr.ygfirstrow", ts.grid.bDiv);

        $(ts.grid.headers).each(function (i) {
            var column = ts.p.colModel[i],
                _td = $firstRow.find("td").eq(i),
                display = column.hidden ? "none" : "";

            this.visible = !column.hidden;
            $(this.el).css("display", display);
            _td.css("display", display);
        });

        var colHeader,
            idx,
            columns = this.dataModel.colModel.columns;

        if( refreshCaption ) {
            for (var i = 0, clen = columns.length; i < clen; i++) {
                idx = i + (this.showRowHead ? 1 : 0);
                colHeader = $rowHeader[0].childNodes[idx];
                $(colHeader).attr("title", ts.p.colNames[idx]);
                if( i == this.selectFieldIndex )
                    continue;
                $(".colCaption", colHeader).html(ts.p.colNames[idx]);
            }
        }

        // 重建列头
        $(ts).buildGroupHeaders(ts.p.groupHeaders);
    },
    clearGridData: function () {
        this.dataModel.data = [];
        this.el && this.el[0].cleanSelection();
        this.el && this.el.clearGridData();
        this.rowIDMask = 0;
    },

    clearAllRows: function(fireEvent) {
        console.log("todo clearAllRows");
    },

    getPageInfo: function () {
        return this.pageInfo;
    },

    getRowCount: function () {
        return this.dataModel.data.length;
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

    /**
     * 判断值是否为空值. null,'',undefined,0都是空值
     */
    isNullValue:function (editOptions,v) {
        if( v == null || v == '' ){
            return true;
        }
        switch ( editOptions.cellType ){
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                return parseFloat(v.toString()) == 0;
            case YIUI.CONTROLTYPE.DICT:
                if (v instanceof YIUI.ItemData) {
                    return v.oid == 0;
                } else if ($.isArray(v)) {
                    for (var i = 0, len = v.length; i < len; i++) {
                        if(v[i].oid > 0){
                            return false;
                        }
                    }
                    return true;
                }
                break;
            case YIUI.CONTROLTYPE.CHECKBOX:
                return YIUI.TypeConvertor.toBoolean(v) == false;
            case YIUI.CONTROLTYPE.COMBOBOX:
                if( editOptions.integerValue ) {
                    return parseFloat(v) == 0;
                }
                break;
        }
        return v == null || v == '';
    },

    setColumnCaption: function (colKey, caption) {
        if( !this.el )
            return;

        var column,
            columns = this.dataModel.colModel.columns;

        for( var i = 0;column = columns[i];i++ ) {
            if ( column.key === colKey ) {
                this.el[0].p.colNames[i + (this.getMetaObj().showRowHead ? 1 : 0)] = caption;
                break;
            }
        }
        this.repaintHeaders(true);
    },
    getColumnCount: function () {
        return this.dataModel.colModel.columns.length;
    },
    getMetaCellInDetail: function (colIndex) {
        return this.getDetailMetaRow().cells[colIndex];
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

    // 设置表格焦点行(触发事件,如行点击等)
    setFocusRowIndex: function (rowIndex) {
        this.el && this.el.setCellFocus(rowIndex,0);
    },
    // 设置表格焦点(触发事件,如行点击等)
    focus: function () {
        if( !this.el )
            return;
        var row = this.getFocusRowIndex(),col = this.getFocusColIndex();
        if( row == -1 || col == -1 ) {
            this.el.setCellFocus(0,0);
        } else {
            this.el.setCellFocus(row,col);
        }
    },
    // 向焦点策略请求下一个焦点
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

    // 是否需要检查全选状态
    needCheckSelect:true,

    refreshSelectAll: function () {
        if( !this.needCheckSelect || this.selectFieldIndex == -1 )
            return;
        var $check = $(".chk", $('.ui-ygrid-htable',this.getOuterEl()));
        if( $check.length == 0 )
            return;
        var selectAll = true, hasDataRow;
        for (var i = 0, len = this.getRowCount(); i < len; i++) {
            var rowData = this.getRowDataAt(i);
            if (rowData.rowType !== 'Detail' || YIUI.GridUtil.isEmptyRow(rowData))
                continue;
            hasDataRow = true;
            if ( !YIUI.TypeConvertor.toBoolean(rowData.data[this.selectFieldIndex][0]) ) {
                selectAll = false;
                break;
            }
        }
        $check.removeClass('checked');
        if( hasDataRow ? selectAll : false ) {
            $check.addClass('checked');
        }
    },

    checkSelectAll: function () {
        this.el && this.el.checkSelectAll();
    },
    getHandler: function () {
        return this.gridHandler;
    },
    getMetaCellByKey: function (cellKey) {
        var metaRow, metaCell;
        for (var i = 0, len = this.getMetaObj().rows.length; i < len; i++) {
            metaRow = this.getMetaObj().rows[i];
            for (var j = 0, length = metaRow.cells.length; j < length; j++) {
                metaCell = metaRow.cells[j];
                if (metaCell.key == cellKey) {
                    return metaCell;
                }
            }
        }
        return null;
    },

    getDetailMetaRow: function(){
        return this.getMetaObj().rows[this.getMetaObj().detailMetaRowIndex];
    },

    dependedValueChange: function (targetField, dependencyField, value) {
        this.gridHandler.dependedValueChange(this, targetField, dependencyField, value);
    },
    doPostCellValueChanged: function (rowIndex, dependencyField, targetField, value) {
        this.gridHandler.doPostCellValueChanged(this, rowIndex, dependencyField, targetField, value);
    }
});
YIUI.reg('grid', YIUI.Control.Grid);