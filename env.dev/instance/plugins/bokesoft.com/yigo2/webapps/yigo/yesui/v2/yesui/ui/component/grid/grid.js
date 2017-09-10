/**
 *
 * cellData结构: 1.value 2.caption 3.enable 4.required 5.error 6.errorMsg
 *
 */
YIUI.Control.Grid = YIUI.extend(YIUI.Control, {
    autoEl: '<table></table>',
    dataModel: {data: [], colModel: {}},
    groupHeaders: [],//多重表头
    pageInfo: null,//分页信息
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
        this.showRowHead = this.metaObj.showRowHead;
        this.primaryKeys = this.metaObj.primaryKeys;

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

    setMetaObj: function (metaObj) {
        if (metaObj != null)
            this.metaObj = metaObj;
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
            var typeFormula = editOpt.editOptions.typeFormula;
            var cxt = new View.Context(form);
            cxt.setRowIndex(rowIndex);
            cxt.setColIndex(colIndex);
            var typeDefKey = form.eval(typeFormula, cxt);
            if(typeDefKey){
                var cellTypeDef = form.metaForm.cellTypeGroup[typeDefKey];
                cellType = cellTypeDef.type;
                editOpt = $.extend({typeDefKey: typeDefKey}, editOpt);
                editOpt.editOptions = cellTypeDef.editOptions;

            }
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

        var cellType = -1, meta, caption = '', def = $.Deferred();

        if($.isDefined(editOpt)){
            meta = editOpt.editOptions;
            cellType = meta.cellType;
        }
        var _this = this;

        switch (cellType) {
            case YIUI.CONTROLTYPE.DICT:
            case YIUI.CONTROLTYPE.DYNAMICDICT:
                return YIUI.DictHandler.getShowCaption(val, meta.allowMultiSelection);

            // .done(function(text){
            //     //_this.setText(text);

            //     _this.dataModel.data[rowIndex].data[colIndex][1] = text;

            //     if(_this.el){
            //         var row = _this.dataModel.data[rowIndex]
            //         _this.el[0].modifyGridCell2(rowIndex, colIndex, row);
            //     }
            // });
            //break;
            case YIUI.CONTROLTYPE.NUMBEREDITOR:
                var settings = YIUI.NumberEditorHandler.getSettings(meta);
                caption = YIUI.DecimalFormat.format(val, settings) ;
                def.resolve(caption);
                break;
            //return caption;
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
                            var caption = YIUI.ComboBoxHandler.getShowCaption(meta.sourceType, items, val, (meta.cellType == YIUI.CONTROLTYPE.CHECKLISTBOX));
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
                caption = val;
                def.resolve(caption);
        }

        // model set cell caption
        //row.data[cm.index][1] = caption;

        //this.p.data[rowIndex].data[cm.index][1] = caption;

        //this.dataModel.data[rowIndex].data[colIndex][0] = val;
        //this.dataModel.data[rowIndex].data[colIndex][1] = caption;
        //return caption;
        return def.promise();
    },

    checkAndSet2: function(editOpt, rowIndex, colIndex, val, callback){
        var row = this.dataModel.data[rowIndex];

        var oldVal = row.data[colIndex][0];

        var cellType = $.isDefined(editOpt) ? editOpt.editOptions.cellType : -1;

        var options = {
            oldVal: oldVal,
            newVal: val
        };
        options = $.isDefined(editOpt) ? $.extend(options, editOpt.editOptions) : options;

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

        var isChanged = cellHandler.checkAndSet(options, callback);
        return isChanged;
    },


    afterEndCellEditor: function (cell, edittype, isChanged, iRow, iCol) {
        var th = this, grid = th.getControlGrid();
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        if (edittype !== undefined && edittype !== YIUI.CONTROLTYPE.LABEL && cell[0].editor != null) {
            var value = cell[0].editor.getValue(), id = th.rows[iRow].id, rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id),
                row = this.p.data[rowIndex], rowID = row.rowID, editOpt = th.getCellEditOpt(row, iCol);
            if (edittype == YIUI.CONTROLTYPE.UTCDATEPICKER) {
                value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
            }
            if (edittype == YIUI.CONTROLTYPE.TEXTEDITOR || edittype == YIUI.CONTROLTYPE.TEXTBUTTON) {
                grid.afterTextEditing = true;
            }
            if (isChanged) {
                grid.gridHandler.doCellValueChanged(grid, rowID, th.p.rowSequences ? iCol - 1 : iCol, value);
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
    alwaysShowCellEditor: function (cell, iRow, iCol, cm, value, opt, rowHeight) {
        var editor, p = this.p, th = this, row = p.data[opt.ri], rowID = row.rowID, grid = this.getControlGrid(),
            enable = value[2],editOpt = th.getCellEditOpt(row, iCol), colIndex = (p.rowSequences ? iCol - 1 : iCol);
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
                // 兼容IE的文件上传
                if( $.browser.isIE && editOpt.key && editOpt.key.toLowerCase().indexOf('upload') != -1 ) {
                    $("<input type='file' class='upload' name='file'/>").appendTo(editor);
                }
                editor.appendTo(cell);
                editor.mousedown(function (e) {
                    e.target.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                    e.target.enable && $(this).removeClass("hover");
                });
                $("button, .upload", editor).click(function (e) {
                    if ( !this.parentNode.enable ) {
                        e.stopPropagation();
                        return false;
                    }
                    if( $(e.target).hasClass('upload') ) {
                        window.up_target = $(e.target);
                    }
                    grid.gridHandler.doOnCellClick(grid, hitTest(editor), colIndex);
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
                    if (!this.enable) {
                        e.stopPropagation();
                        return false;
                    }
                    if (opt.url && opt.targetType == YIUI.Hyperlink_TargetType.New) {
                        window.open(opt.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                    } else if (!opt.url) {
                        grid.gridHandler.doOnCellClick(grid, hitTest(editor), colIndex);
                    }
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
                        var checked = $(this).hasClass('checked') ? false : true;
                        th.getControlGrid().setValueAt(hitTest(editor), colIndex, checked, true, true);
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
                    th.getControlGrid().setValueAt(hitTest(editor.getEl()), colIndex, value, true, true);
                };
                editor.click = function () {
                    grid.gridHandler.doOnCellClick(grid, hitTest(editor.getEl()), colIndex);
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

    initPageOpts: function (needCalc) {
        if( this.getMetaObj().pageLoadType != YIUI.PageLoadType.NONE ) {
            var form = YIUI.FormStack.getForm(this.ofFormID),count;
            if (this.getMetaObj().pageLoadType == YIUI.PageLoadType.DB) {
                count = YIUI.TotalRowCountUtil.getRowCount(form.getDocument(), this.tableKey);
            } else {
                count = form.getDocument().getByKey(this.tableKey).size();
            }
            this.pageInfo.totalRowCount = count;
        } else {
            return this.pageInfo.totalRowCount = this.dataModel.data.length;
        }

        this.pageInfo.calcPage();
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
    // extKeyDownEvent: function (event) {
    //     var ri = this.p.selectRow, ci = this.p.selectCell, keyCode = event.charCode || event.keyCode || 0, row = this.rows[ri];
    //     if (ri === undefined || ri == null || ci === undefined || ci == null || row == undefined) return;
    //     var rowIndex = $.ygrid.stripPref($.ygrid.uidPref, row.id), rowData = this.p.data[rowIndex],
    //         cell = row.cells[ci], editOpt = this.getCellEditOpt(rowData, ci);
    //
    //     var meta = editOpt.editOptions;
    //
    //     if(!$.isDefined(meta)){
    //         return;
    //     }
    //
    //     var cellType = meta.cellType;
    //
    //     if (cellType == YIUI.CONTROLTYPE.TEXTEDITOR
    //         || cellType == YIUI.CONTROLTYPE.NUMBEREDITOR
    //         || cellType == YIUI.CONTROLTYPE.TEXTBUTTON
    //         || cellType == YIUI.CONTROLTYPE.DICT
    //         || cellType == YIUI.CONTROLTYPE.DATEPICKER) {
    //
    //         var value;
    //         if (keyCode >= 48 && keyCode <= 57) {//数字
    //             value = String.fromCharCode(keyCode);
    //         } else if (keyCode >= 96 && keyCode <= 105) {    //小键盘数字
    //             value = String.fromCharCode(keyCode - 48);
    //         } else if (keyCode >= 65 && keyCode <= 90) { //字母
    //             if (cellType == YIUI.CONTROLTYPE.NUMBEREDITOR || cellType == YIUI.CONTROLTYPE.DATEPICKER)
    //                 return;
    //
    //             value = String.fromCharCode(keyCode).toLowerCase();
    //             if (event.shiftKey || document.isCapeLook) {
    //                 value = value.toUpperCase();
    //             }
    //         } else if (keyCode == 107 || keyCode == 109 || keyCode == 187 || keyCode == 189) {
    //             value = String.fromCharCode(0);
    //         }
    //
    //         if (value == undefined)
    //             return;
    //
    //         cell.inKeyEvent = true;
    //         cell.click();
    //
    //         if ($(cell).find("input")[0] !== undefined && $(cell).find("input")[0] !== document.activeElement) {
    //             window.setTimeout(function () {
    //                 $(cell).find("input").focus();
    //                 if (cellType == YIUI.CONTROLTYPE.TEXTEDITOR) {
    //                     var vChar, realValue = "", textEdt = cell.editor.yesCom;
    //                     if (textEdt.invalidChars && textEdt.invalidChars.length > 0 && value && value.length > 0) {
    //                         for (var i = 0, len = value.length; i < len; i++) {
    //                             vChar = value.charAt(i);
    //                             if (textEdt.invalidChars.indexOf(vChar) < 0) {
    //                                 realValue += vChar;
    //                             }
    //                         }
    //                     } else {
    //                         realValue = value;
    //                     }
    //                     if (textEdt.textCase) {
    //                         if (textEdt.textCase == YIUI.TEXTEDITOR_CASE.UPPER) {
    //                             realValue = realValue.toUpperCase()
    //                         } else if (textEdt.textCase = YIUI.TEXTEDITOR_CASE.LOWER) {
    //                             realValue = realValue.toLowerCase();
    //                         }
    //                     }
    //                     value = realValue;
    //                 }
    //                 $(cell).find("input").val(value);
    //             }, 0);
    //         }
    //     }
    // },

    onSortClick: function (iCol, sortType) {
        if (!this.getControlGrid().hasGroupRow) {
            iCol = this.p.rowSequences ? iCol - 1 : iCol;
            this.getControlGrid().gridHandler.doOnSortClick(this.getControlGrid(), iCol, sortType);
        } else {
            alert($.ygrid.error.isSortError);
        }
    },

    // onSelectRow2: function (newRowIndex, oldRowIndex) {
    //     var grid = this.getControlGrid(), oldRow = -1;
    //     if (this.p.selectRow !== undefined) {
    //         var row = grid.el.getGridRowById(this.p.selectRow);
    //         if (row) oldRow = row.rowIndex;
    //         if (!oldRow) oldRow = -1;
    //     }
    //
    //     //行点击事件
    //     grid.gridHandler.doOnRowClick(grid, newRowIndex);
    //
    //     //行切换事件
    //     grid.gridHandler.doOnFocusRowChange(grid, newRowIndex, oldRowIndex);
    //
    // },

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
        this.options = {
            populate: false,
            selectionMode: this.getMetaObj().selectionMode,
            treeIndex: this.treeIndex,
            rowExpandIndex: this.rowExpandIndex,
            rowSequences: this.showRowHead,
            enable: this.getMetaObj().editable,
            colModel: this.dataModel.colModel.columns,
            cellLookup: this.dataModel.colModel.cells,
            data: this.dataModel.data,
            navButtons: {
                add: this.getMetaObj().canInsert, addIcon: "ui-icon-plus", addFunc: this.rowOptFunc,
                del: this.getMetaObj().canDelete, delIcon: "ui-icon-trash", delFunc: this.rowOptFunc,
                upRow: this.getMetaObj().canShift, upRowIcon: "ui-icon-up", upRowFunc: this.rowOptFunc,
                downRow: this.getMetaObj().canShift, downRowIcon: "ui-icon-down", downRowFunc: this.rowOptFunc
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
            getControlGrid: this.getControlGrid,
            pageInfo: this.pageInfo,
            gotoPage: this.gotoPage,
            treeExpand: this.getMetaObj().treeExpand,
            selectFieldIndex: this.selectFieldIndex
        };
        if (this.getMetaObj().pageLoadType != YIUI.PageLoadType.NONE) {
            this.options.showPageSet = true;
            this.options.scrollPage = false;
            this.options.rowNum = this.dataModel.data.length;
        } else {
            this.options.scrollPage = true;
            this.options.rowNum = 50 + (this.hasTotalRow ? 1 : 0);
        }
    },

    setGroupHeaders:function (groupHeaders) {
        this.groupHeaders = groupHeaders;
    },

    buildGroupHeaders: function () {
        this.el && this.el.buildGroupHeaders(this.groupHeaders);
    },

    onRender: function (parent) {
        var self = this;
        this.base(parent);
        this.initOptions();
        this.el[0].getControlGrid = function () {
            return self;
        };
        this.el.yGrid(this.options);
        this.buildGroupHeaders();
        this.refreshSelectAll();
        this.options = null;
        this.refreshGrid();
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
        this.colInfoMap = {};
        this.base(enable);
     //   if (this.el == null) // el没有,往模型中插行
    //        return;
        var el = this.el;
        if(el) {
        	this.el[0].p.enable = enable;
        	el.prop("disabled",false);
        }
        
        if( this.getMetaObj().treeType == -1 && !this.hasRowExpand ) {
            this.removeAutoRowAndGroup();
            if ( enable && this.getDetailMetaRow() && this.newEmptyRow ) {
                if( this.isSubDetail ) {
                    var form = YIUI.FormStack.getForm(this.ofFormID)
                    var par = YIUI.SubDetailUtil.getBindingGrid(form,this);
                    var focusRow = par.getFocusRowIndex();
                    if( par && $.isNumeric(focusRow) && focusRow != -1 ) {
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

    setColumnVisible: function (idx, visible) {
        var column = this.dataModel.colModel.columns[idx];
        var isChange = column.hidden == visible;
        column.hidden = !visible;
        if ( this.el ) {
            var viewColumn = this.el[0].p.colModel[this.showRowHead ? idx + 1 : idx];
            viewColumn.hidden = !visible;
        }
        if ( isChange && this.el ) {
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
        var row = this.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex];
        var editOpt = this.dataModel.colModel.cells[cellKey];

        var _this = this;

        var cellData = this.dataModel.data[rowIndex].data[colIndex];

        var isChanged = this.checkAndSet2(editOpt, rowIndex, colIndex, newValue ,
            function(val) {
                //console.log("row---------checkAndSet2------------"+rowIndex);
                _this.dataModel.data[rowIndex].data[colIndex][0] = val;

                //显示单元格内容， 为异步处理
                _this.endCheck2(editOpt, rowIndex, colIndex, val)
                    .done(function(text){

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

            form.getViewDataMonitor().preFireCellValueChanged(this, rowIndex, colIndex, cellKey);

            if (fireEvent) {
                this.gridHandler.fireEvent(form, this, rowIndex, colIndex);
            }

            form.getViewDataMonitor().postFireCellValueChanged(this, rowIndex, colIndex, cellKey);
        } else {
            this.el && _this.el[0].modifyGridCell2(rowIndex, colIndex, row, false);
        }
    },

    getCellEditOpt:function (cellKey) {
        return this.dataModel.colModel.cells[cellKey];
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

                    // 清空选择模型(需要在insert之前)
                    var ci = this.getFocusColIndex();
                    if( this.el ) {
                        this.el[0].cleanSelection();
                    }

                    var ri = this.addGridRow(rowIndex,detailRow,null,level,true);

                    if( !this.el ) return ri;

                    // 设置焦点
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

                    // 清空选择模型(需要在insert之前)
                    var ci = this.getFocusColIndex();
                    if( this.el ) {
                        this.el[0].cleanSelection();
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
                    if( this.hasTotalRow && this.totalAfterDetail ) {
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
            this.el.setCellFocus(ri,ci);
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
                    var pos = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                    if( pos != -1 ) {
                        shadowTbl.setPos(pos);
                        shadowTbl.setState(DataDef.R_New);// 置为新增状态,直接删除
                        shadowTbl.delRow();
                    }
                }
            } else {
                dataTable.setByBkmk(bookmark);
                var pos = YIUI.ViewUtil.findShadowBkmk(doc,grid.tableKey);
                if( pos != -1 ) {
                    shadowTbl.setPos(pos);
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

        if (!isNeedDelete(form,this,rowIndex)) {
            return false;
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

    colInfoMap: {},

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

        form.getUIProcess().resetComponentStatus(this);

        if( this.el ) {
            this.getOuterEl().remove();
            this.container && this.onRender(this.container);
            this.lastSize.width > 0 && this.el.setGridWidth(this.lastSize.width);
            this.lastSize.height > 0 && this.el.setGridHeight(this.lastSize.height);
        }
    },

    repaint: function () {
        if(!this.el)
            return;
        this.repaintHeaders();
        this.el[0].updateToolBox();
    },

    repaintHeaders: function () {
        if(!this.el)
            return;
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
            if( ci == this.selectFieldIndex )
                continue;
            $(".colCaption", colHeader).html(column.label);
        }
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
     * 判断值是否为空值. null,'',undefined,"0",0都是空值
     */
    isNullValue:function (v) {
        return ( !v || parseFloat(v) == 0 ) ? true : false;
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