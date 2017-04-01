/**
 * 表格插件
 */
(function ($) {
    "use strict";
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {//表格内部使用方法初始化
        version: "1.0.0",
        guid: 1,
        uidPref: 'ygd',
        minWidth: 60,
        msie: navigator.appName === 'Microsoft Internet Explorer',  //是否是IE
        getTextWidth: function (text, fontSize) {
            var span = document.getElementById("__getWidth");
            if (span == null) {
                span = document.createElement("span");
                span.id = "__getWidth";
                document.body.appendChild(span);
                span.style.visibility = "hidden";
                span.style.whiteSpace = "nowrap";
            }
            span.innerText = text;
            span.style.fontSize = (fontSize == null ? 12 : fontSize) + "px";
            return span.offsetWidth;
        },
        msiever: function () {     //ie版本号
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return rv;
        },
        getCellIndex: function (cell) {  //获取单元格序号
            var c = $(cell);
            if (c.is('tr')) {
                return -1;
            }
            c = (!c.is('td') && !c.is('th') ? c.closest("td,th") : c)[0];
            if ($.ygrid.msie) {
                return $.inArray(c, c.parentNode.cells);
            }
            return c.cellIndex;
        },
        formatString: function (format) { //格式化类似" {0} 共 {1} 页"的字符串，将{}按序号替换成对应的参数
            var args = $.makeArray(arguments).slice(1);
            if (format == null) {
                format = "";
            }
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        },
        stripPref: function (pref, id) {  //去除id的前缀，返回去除后的id
            var obj = $.type(pref);
            if (obj === "string" || obj === "number") {
                pref = String(pref);
                id = pref !== "" ? String(id).replace(String(pref), "") : id;
            }
            return id;
        },
        stripHtml: function (v) {  //去除html标签，返回标签内容
            v = String(v);
            var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            if (v) {
                v = v.replace(regexp, "");
                return (v && v !== '&nbsp;' && v !== '&#160;') ? v.replace(/\"/g, "'") : "";
            }
            return v;
        },
        randId: function (prefix) { //注册ID：添加前缀，进行ID分配
            return (prefix || $.ygrid.uidPref) + ($.ygrid.guid++);
        },
        intNum: function (val, defval) {
            val = parseInt(val, 10);
            if (isNaN(val)) {
                return defval || 0;
            }
            return val;
        },
        extend: function (methods) {  //继续扩展继承，主要用于添加方法
            $.extend($.fn.yGrid, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    });

    $.fn.yGrid = function (options) {
        if (this.grid) {
            return;
        }
        if (typeof options === 'string') {   //如果是字符串类型，则是执行表格的事件
            var fn = $.fn.yGrid[options];//得到表格事件
            if (!fn) {
                throw ("yGrid - No such method: " + options);
            }
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args);  //执行表格事件
        }
        return this.each(function () {
            var p = {
                enable: true,//是否可用
                width: 100, //宽度
                height: 150, //高度
                rowNum: 50, //一页显示的行数
                showPager: true,   //是否显示底部操作工具条
                showPageSet: true, //是否使用分页操作按钮及页码输入
                navButtons: {}, // 工具条上的操作按钮
                scrollPage: false,  //是否使用滚动来代替分页操作，及滚动翻页，如为true，则屏蔽分页操作按钮及页码输入
                colModel: [],  //列集合,其中列的属性为：name:名称,label:显示名称,sortable:排序,editable:可编辑,align:文本位置
                colNames: [],  //子叶列的名称(name)或者显示文本(label),比如[列1,列2]
                data: [],  //行数据，比如为[{col1:[value1-1,caption1-1],col2:[value2-1,caption2-1]},{col1:[value1-2,caption1-2],col2:[value2-2,caption2-2]}
                editCells: [],//已经进行编辑的单元格，需要进行保存单元格
                _indexMap: {},
                viewRecords: true,//是否显示数据信息，比如“1 - 10 共100条”
                rowSequences: true,//是否显示序号列
                rowSeqWidth: 40, //序号列宽度
                scrollTimeout: 40,//滚动延时时间
                lastpage: 1, //最后一页页码
                onSelectRow: null, //选中行事件
                dblClickRow: null,//行双击事件
                onSortClick: null,   //表头列单元排序点击事件
                specialCellClick: null,  //点击事件，通常是特殊单元格（button，hyperlink，checkbox）的点击事件
                createCellEditor: null, //创建自定义单元格编辑组件
                alwaysShowCellEditor: null,//创建一直显示的单元格编辑组件
                checkAndSet: null,
                endCheck: null,
                endCellEditor: null, //结束自定义编辑组件
                afterEndCellEditor: null, //结束自定义编辑组件之后的事件
                extKeyDownEvent: null,//额外的按键事件
                afterCopy: null, //复制后的事件
                afterPaste: null,//粘贴后的事件
                groupHeaders: [] //多行表头信息
            };
            for (var key in options) {
                var value = options[key];
                if ($.isArray(value)) {
                    p[key] = value.slice(0);
                } else {
                    p[key] = value;
                }
            }
            options = null;
            var ts = this, grid = {
                headers: [], //表头的所有子叶列
                cols: [],  //表格第一行的所有单元格
                dragStart: function (i, x, y) {  //修改列大小，拖动开始
                    var gridLeftPos = $(this.bDiv).offset().left;
                    this.resizing = { idx: i, startX: x.clientX, sOL: x.clientX - gridLeftPos };
                    this.hDiv.style.cursor = "col-resize";
                    this.curGbox = $("#rs_m" + p.id, "#gbox_" + p.id);
                    this.curGbox.css({display: "block", left: x.clientX - gridLeftPos, top: y[1], height: y[2]});
                    document.onselectstart = function () {  //不允许选中文本
                        return false;
                    };
                },
                dragMove: function (x) {      //修改列大小，拖动中
                    if (this.resizing) {
                        var diff = x.clientX - this.resizing.startX, h = this.headers[this.resizing.idx],
                            newWidth = h.width + diff;
                        if (newWidth > 33) {
                            this.curGbox.css({left: this.resizing.sOL + diff});
                            this.newWidth = p.tblwidth + diff;
                            h.newWidth = newWidth;
                        }
                    }
                },
                dragEnd: function () {         //修改列大小，拖动结束
                    this.hDiv.style.cursor = "default";
                    if (this.resizing) {
                        var idx = this.resizing.idx, nw = this.headers[idx].newWidth || this.headers[idx].width;
                        nw = parseInt(nw, 10);
                        this.resizing = false;
                        this.curGbox && this.curGbox.css({display: "none"});
                        p.colModel[idx].width = nw;
                        this.headers[idx].width = nw;
                        this.headers[idx].el.style.width = nw + "px";
                        this.cols[idx].style.width = nw + "px";
                        p.tblwidth = this.newWidth || p.tblwidth;
                        $('table:first', this.bDiv).css("width", p.tblwidth + "px");
                        $('table:first', this.hDiv).css("width", p.tblwidth + "px");
                        this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                        $(ts).triggerHandler("yGridResizeStop", [nw, idx]);
                    }
                    this.curGbox = null;
                    document.onselectstart = function () {  //允许选中文本
                        return true;
                    };
                },
                populateVisible: function () {  //计算可见区域
                    if (grid.timer) {
                        clearTimeout(grid.timer);
                    }
                    grid.timer = null;
                    var dh = $(grid.bDiv).height();
                    if (!dh) {
                        return;
                    }
                    var table = $("table:first", grid.bDiv);
                    var rows, rh;
                    if (table[0].rows.length) {
                        try {
                            rows = table[0].rows[1];
                            rh = rows ? $(rows).outerHeight() || grid.prevRowHeight : grid.prevRowHeight;
                        } catch (pv) {
                            rh = grid.prevRowHeight;
                        }
                    }
                    if (!rh) {
                        return;
                    }
                    grid.prevRowHeight = rh;
                    var rn = p.rowNum;
                    var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
                    var ttop = Math.round(table.position().top) - scrollTop;
                    var tbot = ttop + table.height();
                    var div = rh * rn;
                    var page, npage, empty;
                    if (tbot < dh && ttop <= 0 &&
                        (p.lastpage === undefined || parseInt((tbot + scrollTop + div - 1) / div, 10) <= p.lastpage)) {
                        npage = parseInt((dh - tbot + div - 1) / div, 10);
                        if (tbot >= 0 || npage < 2 || p.scroll === true) {
                            page = Math.round((tbot + scrollTop) / div) + 1;
                            ttop = -1;
                        } else {
                            ttop = 1;
                        }
                    }
                    if (ttop > 0) {
                        page = parseInt(scrollTop / div, 10) + 1;
                        npage = parseInt((scrollTop + dh) / div, 10) + 2 - page;
                        empty = true;
                    }
                    if (npage) {
                        if (p.lastpage && (page > p.lastpage || p.lastpage === 1 || (page === p.page && page === p.lastpage))) {
                            return;
                        }
                        p.page = page;
                        if (empty) {
                            grid.emptyRows.call(table[0], false);
                        }
                        grid.populate(npage);
                        // $(ts).setErrorCells();
                        // $(ts).setErrorRows();
                    }
                },
                scrollGrid: function (e) {
                    if (p.scrollPage) {
                        var scrollTop = grid.bDiv.scrollTop;
                        if (grid.scrollTop === undefined) {
                            grid.scrollTop = 0;
                        }
                        if (scrollTop !== grid.scrollTop) {
                            grid.scrollTop = scrollTop;
                            if (grid.timer) {
                                clearTimeout(grid.timer);
                            }
                            grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
                        }
                    }
                    grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
                    if (e) {
                        e.stopPropagation();
                    }
                }
            };
            var setColWidth = function () {    //初始化列宽，以及表格宽度
                var th = this;
                th.p.scrollOffset = 18;
                var initwidth = 0, scw = $.ygrid.intNum(th.p.scrollOffset), cw;
                $.each(th.p.colModel, function (index, col) {
                    if (this.hidden === undefined) {
                        this.hidden = false;
                    }
                    this.widthOrg = cw = $.ygrid.intNum(col.width);
                    if (this.hidden === false) {
                        initwidth += cw;
                    }
                });
                if (isNaN(th.p.width)) {
                    th.p.width = initwidth + (!isNaN(th.p.height) ? scw : 0);
                }
                grid.width = th.p.width;
                th.p.tblwidth = initwidth;
            };
            var getOffset = function (iCol) {     //获取某个列的位置信息
                var th = this, $th = $(th.grid.headers[iCol].el);
                var ret = [$th.position().left + $th.outerWidth()];
                ret[0] -= th.grid.bDiv.scrollLeft;
                ret.push($(th.grid.hDiv).position().top);
                ret.push($(th.grid.bDiv).offset().top - $(th.grid.hDiv).offset().top + $(th.grid.bDiv).height());
                return ret;
            };
            var getColumnHeaderIndex = function (th) { //获取表头列单元的序号
                var $t = this, i, headers = $t.grid.headers , ci, len = headers.length;
                for (i = 0; i < len; i++) {
                    if (th === headers[i].el) {
                        ci = i;
                        break;
                    }
                }
                return ci;
            };
            ts.getCellEditOpt = function (rdata, colPos) {
                if (rdata == undefined) return {};
                var cellKey = rdata.cellKeys[colPos - (ts.p.rowSequences ? 1 : 0)],
                    editOpt = ts.p.cellLookup[cellKey];
                if (editOpt == undefined) {
                    editOpt = {};
                }
                return editOpt;
            };

            ts.getCellEditOpt2 = function(rowIndex, colPos){
                var data = ts.p.data;
                if(!$.isDefined(data))
                    return {};
                var row = data[rowIndex];
                var cellKey = row.cellKeys[colPos - (ts.p.rowSequences ? 1 : 0)],
                    editOpt = ts.p.cellLookup[cellKey];
                if (editOpt == undefined) {
                    editOpt = {};
                }
                return editOpt;
                
            };

            var formatCol = function (pos, rowInd, tv, cellval, rdata) { //格式化单元格，主要是设置单元格属性
                var th = this, cm = th.p.colModel[pos], editOpt = th.getCellEditOpt(rdata, pos),
                    ral = editOpt.align == undefined ? cm.align : editOpt.align, result = ["style='"], nm = cm.name;
                if (ral) {
                    result.push("text-align:");
                    result.push(ral);
                    result.push(";");
                }
                if (editOpt.backColor) {
                    result.push("background-color:");
                    result.push(editOpt.backColor);
                    result.push(";");
                }
                if (editOpt.foreColor) {
                    result.push("color:");
                    result.push(editOpt.foreColor);
                    result.push(";");
                }
                if (nm == "rn") {
                    if (th.p.backColor) {
                        result.push("background-color:");
                        result.push(th.p.backColor);
                        result.push(";");
                    }
                    if (th.p.foreColor) {
                        result.push("color:");
                        result.push(th.p.foreColor);
                        result.push(";");
                    }
                }
                if (cm.hidden === true) {
                    result.push("display:none;");
                }

                var meta = editOpt.editOptions;
                if( meta ) {
                    var cellType = meta.cellType;

                    if (cellType == YIUI.CONTROLTYPE.NUMBEREDITOR && parseFloat(cellval[0]) < 0) {
                        result.push("color:");
                        result.push(editOpt.editOptions.negtiveForeColor);
                    }

                    result.push("' class='");

                    if ( cellval && !cellval[2] ) {
                        result.push("ui-cell-disabled ");
                    }

                    // if ( cellval && cellval[3] ) {
                    //     result.push("ui-cell-required ");
                    // }

                    if (cellType == YIUI.CONTROLTYPE.LABEL) {
                        result.push("ui-cell-disabled ");
                    }

                    var rowExpIndex = th.getControlGrid().rowExpandIndex;
                    if ((th.p.rowSequences == true ? rowExpIndex + 1 : rowExpIndex) == pos) {
                        result.push("ui-cell-disabled ");
                    }

                }else{
                    //未定义类型的cell
                    result.push("' class='");
                    result.push("ui-cell-disabled ");
                }

                result.push("'");
                result.push($.fmatter.isEmpty(tv) ? "" : [" title='" , $.ygrid.stripHtml(tv), "' "].join(""));
                result.push(" aria-describedby='");
                result.push([th.p.id, "_", nm , "'"].join(""));
                result = result.join("");
                return result;
            };
            var addCell = function (rowId, cell, pos, irow, srvr, isTreeCol) {       //添加单元格
                var v = cell[1];
                var prp = formatCol.call(ts, pos, irow, v, cell, srvr);
                var tcIcon = "";
                if (isTreeCol) {
                    var pl = (srvr.treeLevel * 16) + "px", icon = srvr.isExpand ? "cell-expand" : "cell-collapse";
                    if (srvr.isLeaf) {
                        tcIcon = ["<span class='cell-treeIcon ", ts.getControlGrid().treeExpand ? " ui-state-disabled" : "",
                            "' style='margin-left: " , pl, "'></span>"].join("");
                    } else {
                        tcIcon = ["<span class='cell-treeIcon " , icon , ts.getControlGrid().treeExpand ? " ui-state-disabled" : "",
                            "' style='margin-left: " , pl, "'></span>"].join("");
                    }
                }
                //console.log('addCell............'+ts.getControlGrid().key);
                return ["<td role=\"gridcell\" ", prp , ">", tcIcon , v , "</td>"].join("");
            };
            var addRowNum = function (pos, irow, pG, rN) {                   //添加序号列单元格
                var v = irow + 1, prp = formatCol.call(ts, pos, irow, v);
                return ["<td role=\"gridcell\" class=\"ui-state-default ygrid-rownum\" " , prp, ">" , v , "</td>"].join("");
            };
            var addGridRow = function (curRd, iRow, riOfData, isTemp) {
                var rowData = [], th = this, nbIndex = th.p.rowSequences === true ? 1 : 0, asrds = [], rh = "",
                    rowId = $.ygrid.uidPref + (isTemp ? -(riOfData + 1) : riOfData), treeColInd = -1;
                if (curRd.rowHeight) {
                    rh = curRd.rowHeight + "px";
                }
                rowData.push(['<tr style="height:', rh , '" role="row" id="' , rowId , '" tabindex="-1" class="ui-widget-content ygrow ui-row-ltr">'].join(""));
                if (nbIndex) {
                    rowData.push(addRowNum(0, riOfData, th.p.page, th.p.rowNum));
                }
                for (var j = 0, len = th.p.colModel.length; j < len - nbIndex; j++) {
                    var cm = th.p.colModel[j + nbIndex], cellKey = curRd.cellKeys[j], editOptions = th.p.cellLookup[cellKey];
                    (editOptions && editOptions.isAlwaysShow) ? asrds.push(j + nbIndex) : null;
                    var v = curRd.data[cm.index], isTreeCol = (cm.name === th.p.treeColName);
                    var cell = addCell(rowId, v, j + nbIndex, iRow, curRd, isTreeCol);
                    if (isTreeCol) treeColInd = j + nbIndex;
                    rowData.push(cell);
                }
                rowData.push("</tr>");
                $("#" + th.p.id + " tbody:first").append(rowData.join(''));
                var row = th.rows[th.rows.length - 1], treeCell, treeIcon, showFunc = th.p.alwaysShowCellEditor,
                    rowHeight = (curRd.rowHeight === undefined ? row.offsetHeight : curRd.rowHeight);
                for (var ci = 0, adlen = asrds.length; ci < adlen; ci++) {
                    var iCol = asrds[ci], colM = th.p.colModel[iCol], nm = colM.name , editOpt = th.getCellEditOpt(curRd, iCol), val = curRd.data[colM.index],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: riOfData, key: nm, id: iRow + "_" + nm, name: nm});
                    if (editOpt.isAlwaysShow) {
                        if (showFunc && $.isFunction(showFunc)) {
                            showFunc.call(th, $(row.cells[iCol]), iRow, iCol, colM, val, opt, rowHeight);
                        }
                    }
                }
                if (treeColInd !== -1) {
                    treeCell = row.cells[treeColInd];
                    treeIcon = $("span.cell-treeIcon", treeCell);
                    treeIcon.click(function (event) {
                        var grow = event.target.parentNode.parentNode, grind = parseInt($.ygrid.stripPref($.ygrid.uidPref, grow.id), 10);
                        if (th.p.treeIconClick && $.isFunction(th.p.treeIconClick) && !curRd.isLeaf) {
                            th.p.treeIconClick.call(th, th.p.data[grind], (grind + 1));
                        }
                    });
                }
                return $(row);
            };
            var loadGridData = function (data, t, rcnt) {        //添加表格行
                if (data) {
                    if (!ts.p.scrollPage) {
                        grid.emptyRows.call(ts, false);
                        rcnt = 1;
                    } else {
                        rcnt = rcnt > 1 ? rcnt : 1;
                    }
                } else {
                    return;
                }

                var pageInfo = ts.getControlGrid().pageInfo;

                ts.p.records = pageInfo.totalRowCount;
                ts.p.page = $.ygrid.intNum(data[ts.p.localReader.page], ts.p.page);
                ts.p.reccount = data.rows.length;
                ts.p.lastpage = $.ygrid.intNum(data[ts.p.localReader.total], 1);
                // ts.p.page = pageInfo.curPageIndex + 1;

                for (var i = 0, len = data.rows.length; i < len; i++) {
                    var rowData = data.rows[i];
                    var ri = ts.p.data.indexOf(rowData);

                    // 添加行
                    addGridRow.call(ts, rowData, ri + rcnt, ri);

                    // 初始化单元格错误以及必填信息
                    for (var j = 0, size = rowData.data.length; j < size; j++) {
                        var cellData = rowData.data[j];
                        if (cellData[4]) {
                            $(ts).setCellError(i, j, true, cellData[5]);
                        } else if (cellData[3]) {
                            $(ts).setCellRequired(i, j, true);
                        }
                    }

                    // 初始化行错误信息
                    if (rowData.error) {
                        $(ts).setRowError(i, true, rowData.errorMsg);
                    }
                }

                ts.refreshIndex();
                ts.updatePager.call(ts);
            };
            var afterRowOpt = function (ri, isDelete) {
                var i, th = this, seq, rid, len = th.rows.length;
                for (i = ri; i < len; i++) {
                    if (th.p.rowSequences) {
                        seq = parseInt($(th.rows[i].cells[0]).html(), 10);
                        $(th.rows[i].cells[0]).html(seq + (isDelete ? -1 : +1));
                    }
                    rid = parseInt($.ygrid.stripPref($.ygrid.uidPref, th.rows[i].id), 10);
                    rid = rid + (isDelete ? -1 : +1);
                    th.rows[i].id = $.ygrid.uidPref + rid;
                }
                ts.refreshIndex();
            };
            ts.refreshIndex = function () {
                ts.p._indexMap = {};

                // for( var ti = 1,idx = 0,len = ts.rows.length; ti < len;ti++,idx++ ) {
                //     ts.p._indexMap[$.ygrid.stripPref($.ygrid.uidPref, ts.rows[ti].id)] = idx;
                // }
                for (var ti = 0, tlen = ts.rows.length; ti < tlen; ti++) {
                    ts.p._indexMap[$.ygrid.stripPref($.ygrid.uidPref, ts.rows[ti].id)] = ti;
                }
            };
            ts.deleteGridRow = function (ri) {
                var th = this, gridRow = $(th).getGridRowById($.ygrid.uidPref + ri), rind;
                if (gridRow) {
                    rind = gridRow.rowIndex;
                    th.p.data.splice(ri, 1);
                    $(gridRow).remove();
                    afterRowOpt.call(th, rind, true);
                }
            };
            ts.insertGridRow = function (ri, rowData) {
                var th = this, gridRow, lastRid = $.ygrid.stripPref($.ygrid.uidPref, th.rows[th.rows.length - 1].id);
                var lri = isNaN(parseInt(lastRid, 10)) ? 0 : parseInt(lastRid, 10);
                th.p.data.splice(ri, 0, rowData);
                if (ri <= lri + 1) {
                    gridRow = addGridRow.call(th, rowData, ri + 1, ri, true);
                    gridRow.insertBefore($(th).getGridRowById($.ygrid.uidPref + ri));
                    var seq, rid, nRi = gridRow[0].rowIndex + 1, pRi = gridRow[0].rowIndex - 1;
                    if (th.rows[nRi]) {
                        if (th.p.rowSequences) {
                            seq = $(th.rows[nRi].cells[0]).html();
                            $(gridRow[0].cells[0]).html(seq);
                        }
                        rid = th.rows[nRi].id;
                        gridRow[0].id = rid;
                    } else {
                        if (th.rows[pRi] !== $("tr.ygfirstrow", th.grid.bDiv)[0]) {
                            if (th.p.rowSequences) {
                                seq = parseInt($(th.rows[pRi].cells[0]).html(), 10);
                                $(gridRow[0].cells[0]).html(seq + 1);
                            }
                            rid = parseInt($.ygrid.stripPref($.ygrid.uidPref, th.rows[pRi].id), 10);
                            gridRow[0].id = $.ygrid.uidPref + (rid + 1);
                        } else {
                            if (th.p.rowSequences) {
                                $(gridRow[0].cells[0]).html(1);
                            }
                            gridRow[0].id = $.ygrid.uidPref + 0;
                        }
                    }
                    afterRowOpt.call(th, gridRow[0].rowIndex + 1, false);
                }
            };

            ts.getColPos = function(colIndex){
                return colIndex + (ts.p.rowSequences ? 1 : 0)
            };

            ts.modifyGridCell2 = function (rowIndex, colIndex, rowData, isChanged) {

                var row = $(this).getGridRowById($.ygrid.uidPref + rowIndex);
                if(!$.isDefined(row)){
                    return;
                }

                var colPos = this.getColPos(colIndex);

                var cell = row.cells[colPos];

                if(!$.isDefined(cell)){
                    return;
                }

                var rowId = $.ygrid.uidPref + rowIndex;

                //var cm = this.p.colModel[iCol]
     
                //$t.p.editCells.splice(0, 1);
                if(isChanged){
                    //值变化 刷新单元格显示值
                    $(this).yGrid("setCell", rowId, colPos, rowData.data[colIndex], false, false);
                    this.p.editCells.splice(0, 1);    
                }else {
                    //值未变化 还原单元格样式
                    var iRow = row.rowIndex;
                    $(this).yGrid("restoreCell", iRow, colPos);
                }
            };

            var initQueryData = function () {       //初始化表格数据相关信息，主要是分页信息及数据
                if (!$.isArray(ts.p.data)) {
                    return null;
                }

                // var queryResults = ts.p.data,
                // pageInfo = ts.p.getControlGrid().pageInfo,
                // result = {};

                // //数据总行数（不包含汇总行等）
                // var page = pageInfo.curPageIndex + 1, recordsperpage = parseInt(ts.p.rowNum, 10);


                // result[ts.p.localReader.total] = pageInfo.pageCount;
                // result[ts.p.localReader.page] = pageInfo.curPageIndex + 1;
                // result[ts.p.localReader.records] = pageInfo.totalRowCount;

                // queryResults = queryResults.slice((page - 1) * recordsperpage, page * recordsperpage);
                // result[ts.p.localReader.root] = queryResults;


                var queryResults = ts.p.data,
                    recordsperpage = parseInt(ts.p.rowNum, 10),
                    total = queryResults.length,
                    page = parseInt(ts.p.page, 10),
                    totalpages = Math.ceil(total / recordsperpage),
                    result = {};
                queryResults = queryResults.slice((page - 1) * recordsperpage, page * recordsperpage);
                result[ts.p.localReader.total] = totalpages == 0 ? 1 : totalpages;
                result[ts.p.localReader.page] = page;
                result[ts.p.localReader.records] = total;
                result[ts.p.localReader.root] = queryResults;

                queryResults = null;
                return  result;
            };
            grid.emptyRows = function (scroll) {
                var firstrow = ts.rows.length > 0 ? ts.rows[0] : null;
                $(this.firstChild).empty().append(firstrow);
                if (scroll && ts.p.scrollPage) {
                    $(ts.grid.bDiv.firstChild).css({height: "auto"});
                    $(ts.grid.bDiv.firstChild.firstChild).css({height: 0, display: "none"});
                    if (ts.grid.bDiv.scrollTop !== 0) {
                        ts.grid.bDiv.scrollTop = 0;
                    }
                }
            };
            grid.populate = function (npage) {          //表格载入数据计算
                var pvis = ts.p.scrollPage && npage === false, lc;
                if (ts.p.page === undefined || ts.p.page <= 0) {
                    ts.p.page = Math.min(1, ts.p.lastpage);
                }
                npage = npage || 1;
                if (npage > 1) {
                    lc = function () {
                        if (ts.p.page == 1 && ts.grid.scrollTop == 0)
                            return;
                        ts.p.page++;
                        ts.grid.hDiv.loading = false;
                        grid.populate(npage - 1);
                    };
                }
                var rcnt = !ts.p.scrollPage ? 1 : ts.rows.length;
                var req = initQueryData();
                loadGridData(req, ts.grid.bDiv, rcnt);
                if (lc) {
                    lc.call(ts);
                }
                if (pvis) {
                    grid.populateVisible();
                }
            };
            ts.updatePager = function () {  //更新工具条，主要是分页操作按钮的显示和数据信息的显示
                var th = this, from, to, tot, base = parseInt(th.p.page, 10) - 1;

                base = base * parseInt(th.p.rowNum, 10);
                to = base + th.p.reccount;
                // to = to > th.p.data.length ? th.p.data.length : to;
                if (th.p.scrollPage) {    //如果是滚动分页，则修改顶部div，使可见区域呈现在对应位置
                    var rows = $("tbody:first > tr:gt(0)", th.grid.bDiv);
                    base = to - rows.length;
                    th.p.reccount = rows.length;
                    var rh = rows.outerHeight() || th.grid.prevRowHeight;
                    if (rh) {
                        var top = base * rh;
                        var height = parseInt(th.p.records, 10) * rh;
                        $(">div:first", th.grid.bDiv).css({height: height}).children("div:first").css({height: top, display: top ? "" : "none"});
                        if (th.grid.bDiv.scrollTop == 0 && th.p.page > 1) {
                            th.grid.bDiv.scrollTop = th.p.rowNum * (th.p.page - 1) * rh;
                        }
                    }
                    th.grid.bDiv.scrollLeft = th.grid.hDiv.scrollLeft;
                }
                var pgboxes = th.p.pager || "";
                if (pgboxes) {       //如果存在工具条
                    $(["#add_" , th.id , ",#del_" , th.id, ", #upRow_" , th.id, ", #downRow_" , th.id].join("")).each(function () {
                        (th.p.enable && th.p.treeIndex === -1 && th.p.rowExpandIndex === -1) ? $(this).removeClass("ui-state-disabled") : $(this).addClass("ui-state-disabled");
                    });
                    if (th.p.viewRecords) {    //如果显示数据信息，则更新相关信息
                        if (ts.p.reccount === 0) {
                            $(".ui-paging-info", pgboxes).html($.ygrid.defaults.emptyrecords);
                        } else {
                            from = base + 1;
                            tot = th.p.records;
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.totalrecord, tot));
                            
                            //$(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.recordtext, from, to, tot));
                        }
                    }

                    if (th.p.showPageSet) {     
                        //如果有分页操作，则更新操作按钮的显示以及输入框的页码

                        var pageInfo = this.p.pageInfo;

                        if(pageInfo == null){
                            return;
                        }

                        var totalRowCount = pageInfo.totalRowCount;

                        if(totalRowCount == 0){
                            return;
                        }


                        var curPage = pageInfo.curPageIndex + 1;
                        var pageRowCount = pageInfo.pageRowCount;
                        
                        var pageCount = pageInfo.pageCount;

                        var begin = pageRowCount * (curPage - 1) + 1;

                        var end = begin + pageRowCount - 1 ;
                        end = end > totalRowCount ? totalRowCount : end;

                        //$('.ui-pg-input', pgboxes).val(curPage);
                        // var cp = $.ygrid.intNum(th.p.page, 1), last = $.ygrid.intNum(th.p.lastpage, 1);
                        var tspg = "_" + th.p.pager.substr(1);
                        if (curPage === 1) {
                            $("#first" + tspg + ", #prev" + tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
                        } else {
                            $("#first" + tspg + ", #prev" + tspg).removeClass('ui-state-disabled');
                        }
                        if (curPage === pageCount) {
                            $("#next" + tspg + ", #last" + tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
                        } else {
                            $("#next" + tspg + ", #last" + tspg).removeClass('ui-state-disabled');
                        }

                        if(pageInfo.pageLoadType == YIUI.PageLoadType.DB){
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.record, begin, end)); 
                        }else{
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.recordtext, begin, end, totalRowCount)); 
                        }
                    }
                }
            };

            if (ts.tagName.toUpperCase() !== 'TABLE') {
                alert($.ygrid.error.isNotTable);
                return;
            }
            if (document.documentMode !== undefined) { // IE only
                if (document.documentMode < 5) {
                    alert($.ygrid.error.isErrorMode);
                    return;
                }
            }
            $(this).empty().attr("tabindex", "0");
            this.p = p;
            this.grid = grid;
            this.p.useProp = !!$.fn.prop;
            if (this.p.colNames.length === 0) {   //初始化列名称集合
                for (var ci = 0, len = this.p.colModel.length; ci < len; ci++) {
                    var name = this.p.colModel[ci].label || this.p.colModel[ci].name,
                        formulaCaption = this.p.colModel[ci].formulaCaption;
                    if (formulaCaption != null && formulaCaption.length > 0) {
                        var form = YIUI.FormStack.getForm(this.getControlGrid().ofFormID);
                        var cxt = new View.Context(form);
                        name = form.eval(formulaCaption, cxt);
                    }
                    this.p.colNames[ci] = name;
                }
            }
            if (this.p.colNames.length !== this.p.colModel.length) {
                alert($.ygrid.errors.model);
                return;
            }
            if (this.p.rowSequences) {    // 如果需要序号字段
                this.p.colNames.unshift($.ygrid.defaults.seqColText);
                this.p.colModel.unshift({label: $.ygrid.defaults.seqColText, name: 'rn', width: ts.p.rowSeqWidth,
                    sortable: false, resizable: true, align: 'center'});
            }
            var gv = $("<div class='ui-ygrid-view'></div>");//表格主体
            $(gv).insertBefore(this);
            $(this).removeClass("scroll").appendTo(gv);
            var eg = $("<div class='ui-ygrid ui-widget ui-widget-content'></div>");  //表格整体
            $(eg).attr({id: "gbox_" + this.id, dir: "ltr"}).insertBefore(gv);
            $(gv).attr("id", this.id + "_view").appendTo(eg);
            $(this).attr({cellspacing: "0", cellpadding: "0", border: "0", "role": "grid", "aria-labelledby": "gbox_" + this.id});//表格数据主体
            this.p.id = this.id;
            ts.p.localReader = $.extend(true, {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                cell: "cell",
                id: "id"
            }, ts.p.localReader);
            if (ts.p.scrollPage) {   //滚动分页
                ts.p.showPageSet = false;
            }
            //初始化宽度
            setColWidth.call(ts); //初始化宽度
            $(eg).css("width", grid.width + "px");
            $(gv).css("width", grid.width + "px").before("<div class='ui-ygrid-resize-mark' id='rs_m" + ts.p.id + "'>&#160;</div>");
            //开始构建表头----------------------------------------
            var hTable = $(["<table class='ui-ygrid-htable' style='width:" , ts.p.tblwidth ,
                    "px' role='ygrid' aria-labelledby='gbox_" , this.id , "' cellspacing='0' cellpadding='0' border='0'></table>"].join("")),
                hb = $("<div class='ui-ygrid-hbox-ltr'></div>").append(hTable);
            grid.hDiv = document.createElement("div");
            $(grid.hDiv).addClass('ui-state-default ui-ygrid-hdiv').css({ width: grid.width + "px"}).append(hb);
            grid.hDiv.onselectstart = function () {
                return false;
            };
            $(ts).before(grid.hDiv);
            var thead = ["<thead><tr class='ui-ygrid-headers' role='rowheader'>"];
            var tdc = $.ygrid.msie ? "class='ui-th-div-ie'" : "";
            var imgs = ["<span class='s-ico' style='position: absolute;top:0;right:0;display:none;'>",
                "<span class='ui-ygrid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-sort-ltr'/>" ,
                "<span class='ui-ygrid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-sort-ltr'/>" ,
                "</span>"].join("");  //排序图标
            //添加表头单元格
            for (var i = 0, clen = ts.p.colNames.length; i < clen; i++) {
                var tooltip = [" title=\"" , ts.p.colNames[i] , "\""].join(""), cm = ts.p.colModel[i], cname = cm.name;
                thead.push("<th id='");
                thead.push([ts.p.id , "_" , cname].join(""));
                thead.push("' role='columnheader' class='ui-state-default ui-th-column ui-th-ltr'");
                thead.push(tooltip);
                thead.push(">");
                thead.push("<div id='");
                thead.push([$.ygrid.uidPref , "_" , ts.p.id , "_" , cname].join(""));
                thead.push("' ");
                thead.push(tdc);
                thead.push("><span style='overflow: hidden;position: absolute;left: 0;width: 100%;' class='colCaption'>");
                var colIndex = (i + (ts.p.rowSequences ? -1 : 0));
                if (ts.p.selectFieldIndex != -1 && ts.p.selectFieldIndex == colIndex) {
                    var margin = (ts.p.colNames[i] == "" ? "" : "margin-bottom: 3px;margin-right: 3px;");
                    thead.push("<Input type='checkbox' style='");
                    thead.push(margin);
                    thead.push(["vertical-align: middle' ofColIndex=" , i , ">"].join(""));
                }
                thead.push(ts.p.colNames[i]);
                thead.push("</span>");
                if (!cm.width) {
                    cm.width = 80;
                } else {
                    cm.width = parseInt(cm.width, 10);
                }
                thead.push(imgs);
                thead.push("</div></th>");
            }
            thead.push("</tr></thead>");
            imgs = null;
            hTable.append(thead.join(""));
            $("input", hTable).click(function (e) {
                var ci = parseInt($(this).attr("ofColIndex"), 10) - (ts.p.rowSequences ? 1 : 0), newValue = this.checked;
                ts.getControlGrid().gridHandler.doAllChecked(ts.getControlGrid(), ci, newValue);
                e.stopPropagation();
            });
            // $(ts).reShowCheckColumn();
            //开始处理表头单元中的一些特定功能：拖拉大小，排序图标
            thead = $("thead:first", grid.hDiv).get(0);
            var thr = $("tr:first", thead), w, res, sort, cModel;
            var firstRow = ["<tr class='ygfirstrow' role='row' style='height:auto'>"];
            $("th", thr).each(function (j) {
                cModel = ts.p.colModel[j];
                w = cModel.width;
                if (cModel.resizable === undefined) {
                    cModel.resizable = true;
                }
                if (cModel.resizable) {   //如果该列的大小是可以修改的，则添加resize组件
                    res = document.createElement("span");
                    $(res).html("&#160;").addClass('ui-ygrid-resize ui-ygrid-resize-ltr').css("cursor", "col-resize");
                } else {
                    res = "";
                }
                $(this).css("width", w + "px").prepend(res);
                res = null;
                var hdcol = "";
                if (cModel.hidden) {
                    $(this).css("display", "none");
                    hdcol = "display:none;";
                }
                firstRow.push("<td role='gridcell' style='height:0px;width:");
                firstRow.push(w + "px;");
                firstRow.push(hdcol);
                firstRow.push("'></td>");
                grid.headers[j] = { width: w, el: this };
                if (typeof cModel.sortable !== 'boolean') {
                    cModel.sortable = true;
                }
                $(">div", this).addClass('ui-ygrid-sortable');
            }).mousedown(function (e) { //注册拖动大小的鼠标事件
                    if ($(e.target).closest("th>span.ui-ygrid-resize").length == 1) {
                        var ci = getColumnHeaderIndex.call(ts, this);
                        grid.dragStart(ci, e, getOffset.call(ts, ci));
                    }
                }).click(function (e) {  //注册排序所用的点击事件
                    var ci = getColumnHeaderIndex.call(ts, this);
                    var sort = ts.p.colModel[ci].sortable;
                    if (!ts.p.lastsort) {
                        ts.p.sortorder = "asc";
                    } else if (ts.p.lastsort === ci) {
                        ts.p.sortorder = (ts.p.sortorder == "asc" ? "desc" : "asc");
                    } else {
                        var previousSelectedTh = ts.grid.headers[ts.p.lastsort].el;
                        $("div span.s-ico", previousSelectedTh).hide();
                        $("div span.colCaption", previousSelectedTh).css({width: "100%"});
                        $("span.ui-ygrid-ico-sort", previousSelectedTh).addClass('ui-state-disabled');
                        ts.p.sortorder = "asc";
                    }
                    if (sort) {
                        $("div span.s-ico", this).show();
                        var width = this.clientWidth - $("div span.s-ico", this)[0].clientWidth;
                        $("div span.colCaption", this).css({width: width + "px"});
                        $("span.ui-ygrid-ico-sort", this).addClass('ui-state-disabled');
                        $("div span.ui-icon-" + ts.p.sortorder, this).removeClass("ui-state-disabled");
                        if ($.isFunction(ts.p.onSortClick)) {
                            ts.p.onSortClick.call(ts, getColumnHeaderIndex.call(ts, this), ts.p.sortorder == "asc" ? "desc" : "asc");
                        } else {
                            //TODO 自身的排序
                        }
                        ts.p.lastsort = ci;
                    } else {
                        ts.p.lastsort = null;
                    }
                }).dblclick(function (e) {

                    var ci = getColumnHeaderIndex.call(ts, this);

                    resizeColumn2BestWidth(ci);
                });

                /**
                 * 表格列最佳列宽
                 * @param idx
                 */
                var resizeColumn2BestWidth = function (idx) {
                    var el = grid.headers[idx].el;
                    var oldWidth = el.offsetWidth,width= $.ygrid.getTextWidth(el.title);
                    if( $("input",el).length > 0 ) {
                        width += 14;
                    }
                    $(".ygrow",ts.grid.bDiv).each(function () {
                        td = $("td",this)[idx],tdWidth = $.ygrid.getTextWidth(td.title);
                        if( tdWidth > width ) {
                            width = tdWidth;
                        }
                    });
                    if( width < $.ygrid.minWidth ){
                        width = $.ygrid.minWidth;
                    }
                    grid.newWidth = p.tblwidth + (width - oldWidth);
                    grid.resizing = {idx:idx};
                    grid.headers[idx].newWidth = width;
                    grid.dragEnd();
                }

            // 注册最佳列宽事件
            var gid = ts.p.id,name = ts.p.colModel[0].name,td,tdWidth;
            $("#" + gid + "_" + name,thr).dblclick(function () {
                $("th:gt(0)",thr).each(function (index) {
                    resizeColumn2BestWidth(index + 1);
                });
            });

            firstRow.push("</tr>");
            var tbody = document.createElement("tbody");
            this.appendChild(tbody);
            $(this).addClass('ui-ygrid-btable').append(firstRow.join(""));
            firstRow = null;
            //表头构建结束--------------------------------------
            //表格数据主体开始构建------------------------------
            if ($.ygrid.msie) {
                if (String(ts.p.height).toLowerCase() === "auto") {
                    ts.p.height = "100%";
                }
            }
            grid.bDiv = document.createElement("div");
            var height = ts.p.height + (isNaN(ts.p.height) ? "" : "px");
            $(grid.bDiv).addClass('ui-ygrid-bdiv').css({ height: height, width: grid.width + "px"})
                .append($('<div style="position:relative;' + ($.ygrid.msie && $.ygrid.msiever() < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this))
                .scroll(grid.scrollGrid); //滚动到原先的可见范围
            $("table:first", grid.bDiv).css({width: ts.p.tblwidth + "px"});
            if (!$.support.tbody) { //IE
                if ($("tbody", this).length === 2) {
                    $("tbody:gt(0)", this).remove();
                }
            }
            $(grid.hDiv).after(grid.bDiv);
            $(gv).mousemove(function (e) { //注册拖动大小拖动中事件
                if (grid.resizing) {
                    grid.dragMove(e);
                }
            });
            $(".ui-ygrid-labels", grid.hDiv).bind("selectstart", function () {
                return false;
            });
            $(document).bind("mouseup.yGrid" + ts.p.id, function () { //注册拖动大小拖动结束事件
                if (grid.resizing) {
                    grid.dragEnd();
                    return false;
                }
                return true;
            });
            if (ts.p.populate) {
                grid.populate(); //数据载入计算
            }
            this.grid.cols = this.rows[0].cells;
            grid.clearSelectCells = function () {
                if (ts.p.selectCells) {
                    for (var i = 0, len = ts.p.selectCells.length; i < len; i++) {
                        $(ts.p.selectCells[i]).removeClass("ui-state-highlight").removeClass("ui-cell-multiselect");
                    }
                }
                ts.p.selectCells = [];
            };
            $(grid.bDiv).mousemove(function (e) {
                if (ts.selecting && e.target.tagName === "TD") {
                    var fc = ts.p.selectCells[0], lc = e.target;
                    if (fc == null) return;
                    var bri = Math.min(fc.parentElement.rowIndex, lc.parentElement.rowIndex),
                        eri = Math.max(fc.parentElement.rowIndex, lc.parentElement.rowIndex),
                        bci = Math.min(fc.cellIndex, lc.cellIndex), eci = Math.max(fc.cellIndex, lc.cellIndex);
                    grid.clearSelectCells();
                    ts.p.selectCells.push(fc);
                    $(fc).addClass("ui-state-highlight");
                    if (e.target == fc) return;
                    ts.p.selectRow = fc.parentElement.id;
                    ts.p.selectCell = fc.cellIndex;
                    for (var ri = bri; ri <= eri; ri++) {
                        var row = ts.rows[ri];
                        if (!row) continue;
                        for (var ci = bci; ci <= eci; ci++) {
                            var cell = row.cells[ci];
                            if ($.inArray(ts.p.selectCells, cell) === -1 && cell !== fc) {
                                $(cell).addClass("ui-cell-multiselect");
                                ts.p.selectCells.push(cell);
                            }
                        }
                    }
                }
            });
            $(ts).mousedown(function (e) {      //表格点击事件，主要是选中模式，以及进入编辑状态
                if (e.target.tagName === "TD" && ts.p.selectionMode != YIUI.SelectionMode.ROW ) {
                    document.onselectstart = function () {
                        return false;
                    };
                    var td = e.target;
                    var ptr = $(td, ts.rows).closest("tr.ygrow");
                    $("td.ui-state-highlight", ts.grid.bDiv).removeClass("ui-state-highlight");
                    grid.clearSelectCells();
                    ts.p.selectCells.push(e.target);
                    $(e.target).addClass("ui-state-highlight");
                    ts.selecting = true;
                }
            }).mouseup(function (e) {
                    if (e.target.tagName === "TD") {
                        document.onselectstart = function () {
                            return true;
                        };
                    }
                    ts.selecting = false;
                    if (e.target.tagName === "INPUT") return;
                    window.setTimeout(function () {
                        if (ts.grid) {
                            var scrollLeft = ts.grid.bDiv.scrollLeft, scrollTop = ts.grid.bDiv.scrollTop;
                            $("#" + ts.p.knv).attr("tabindex", "-1").focus();
                            ts.grid.bDiv.scrollTop = scrollTop;
                            ts.grid.bDiv.scrollLeft = scrollLeft;
                        }
                    }, 0);
            }).click(function (e) {

                var td = e.target;
                var ptr = $(td, ts.rows).closest("tr.ygrow");
                if ($(ptr).length === 0 || ptr[0].className.indexOf('ui-state-disabled') > -1) {
                    return;
                }
                var ri = ptr[0].id, ci = $.ygrid.getCellIndex(td);
                if (td.tagName !== "TD") return;
                if (ts.p.selectRow != ri || ts.p.selectCell != ci) {
                    if (ts.p.selectRow) {
                        var preSelRow = $(ts).yGrid('getGridRowById', ts.p.selectRow);
                        if (preSelRow != null) {
                            if (ts.p.selectionMode == YIUI.SelectionMode.ROW) {
                                $(preSelRow.cells).each(function () {
                                    $(this).removeClass("ui-state-highlight");
                                });
                            } else {
                                $(preSelRow.cells[ts.p.selectCell]).removeClass("ui-state-highlight");
                            }
                        }
                    }

                    //当前点击单元格 不是编辑单元格，则编辑单元格恢复显示样式
                    if (ts.p.editCells.length > 0) {
                        $(ts).yGrid("restoreCell", ts.p.editCells[0].ir, ts.p.editCells[0].ic);
                    }

                    if ($.isFunction(ts.p.onSelectRow)) {

                        var oldSelectRow = ts.p.selectRow;

                        // 先改变焦点行,再触发相关事件
                        ts.p.selectRow = ri;
                        ts.p.selectCell = ci;

                        if(!td.notOnSelectRow){
                            var newRowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, ptr[0].id));
                            var oldRowIndex = -1;
                            if(ts.p.selectRow){
                                oldRowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, oldSelectRow));
                            }

                            ts.p.onSelectRow.call(ts, newRowIndex, oldRowIndex);
                        }

                        window.setTimeout(function () {
                            if (ts.p == null || ts.grid == null) return;
                            var scrollLeft = ts.grid.bDiv.scrollLeft, scrollTop = ts.grid.bDiv.scrollTop, knv = $("#" + ts.p.knv);
                            knv.css({left: e.clientX + "px", top: e.clientY + "px"});
                            knv.attr("tabindex", "-1").focus();
                            ts.grid.bDiv.scrollTop = scrollTop;
                            ts.grid.bDiv.scrollLeft = scrollLeft;
                        }, 0);
                    }
                    var cr = $(ts).yGrid('getGridRowById', ri);
                    if (cr != null) {
                        if (ts.p.selectionMode == YIUI.SelectionMode.ROW) {
                            grid.clearSelectCells();
                            $(cr.cells).each(function () {
                                $(this).addClass("ui-state-highlight");
                                if(!$(this).hasClass("ygrid-rownum")){
                                    ts.p.selectCells.push(this);
                                }
                            });
                        } else {
                            $(cr.cells[ci]).addClass("ui-state-highlight");
                        }
                    }
                } else {
                    $(ts).yGrid('editCell', ptr[0].rowIndex, ci, true, e);
                }
            }).dblclick(function (e) {    //表格双击事件，主要是行双击事件
                var td = e.target;
                if ($.ygrid.msie) {   //兼容IE
                    $(td).click();
                }
                var ptr = $(td, ts.rows).closest("tr.ygrow");
                if ($(ptr).length === 0) {
                    return;
                }
                var rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, ptr[0].id));
                if ($.isFunction(ts.p.dblClickRow)) {
                    ts.p.dblClickRow.call(ts, rowIndex);
                }
            }).bind('reloadGrid', function (e, opts) {  //重载数据事件
                var $rowHeader = $("tr.ui-ygrid-headers", ts.grid.hDiv);
                var firstRow = $("tr.ygfirstrow", grid.bDiv);
                if (ts.p.colModel.isChange) {
                    ts.p.colModel.isChange = false;
                    $(ts.grid.headers).each(function (iCol) {
                        var th = this.el;
                        if (ts.p.colModel[iCol].hidden) {
                            $(th).css("display", "none");
                            firstRow.find("td").eq(iCol).css("display", "none");
                        } else {
                            $(th).css("display", "");
                            firstRow.find("td").eq(iCol).css("display", "");
                        }
                    });
                    if (ts.p.groupHeaders.length > 0) {
                        for (var i = 0, len = ts.grid.headers.length; i < len; i++) {
                            var header = ts.grid.headers[i].el, cells = $rowHeader[0].cells;
                            $("div", header).attr("style", "");
                            if ($.inArray(cells, header) == -1) {
                                $rowHeader.append(header);
                            } else {
                                header.after(ts.grid.headers[i - 1].el);
                            }
                        }
                        $(ts.grid.hDiv).find("tr.ui-ygrid-columnheader").remove();
                        $(ts).initGroupHeaders(ts.p.groupHeaders);
                    }
                }
                if (opts && opts.page) {
                    var page = opts.page;
                    if (page > ts.p.lastpage) {
                        page = ts.p.lastpage;
                    }
                    if (page < 1) {
                        page = 1;
                    }
                    ts.p.page = page;
                    if (ts.grid.prevRowHeight) {
                        ts.grid.bDiv.scrollTop = (page - 1) * ts.grid.prevRowHeight * ts.p.rowNum;
                    } else {
                        ts.grid.bDiv.scrollTop = 0;
                    }
                }
                if (ts.grid.prevRowHeight && ts.p.scrollPage) {
                    delete ts.p.lastpage;
                    ts.grid.populateVisible();
                } else {
                    ts.grid.populate();
                }

                $(ts).checkSelectAll();

                var pageInfo = ts.getControlGrid().pageInfo;
                var pagerId = ts.p.id + '_pager';
                updatePagination($("#pagination_" + pagerId), pageInfo);
            });




            //刷新页码
            var updatePagination = function(pagination, pageInfo){
                //初始化页码
                var initPagination = function (begin, end, curPage) {
                    $("ul", pagination).html();
                    var btnStr = [], style, sClass;

                    end = end < begin ? begin : end;

                    for (var i = begin; i <= end; i++) {
                        sClass = (i == curPage) ? "ui-state-highlight" : "";
                        btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
                    }
                    $("ul", pagination).html(btnStr.join(""));

                    $("li", pagination).click(gotoPageEvent);

                };

                var curPage = pageInfo.curPageIndex + 1;
                if (pageInfo.pageCount <= 5) {
                    initPagination(1, pageInfo.pageCount, curPage);
                } else {
                    var begin = (curPage - 2) >= 1 ? (curPage - 2) : 1, end = begin + 4;
                    if (end > pageInfo.pageCount) {
                        var gap = end - pageInfo.pageCount;
                        begin -= gap;
                        end -= gap;
                    }
                    initPagination(begin, end, curPage);
                }
            }

            //表格数据主体构建结束------------------------------
            //构建工具条
            if (this.p.showPager) {
                var op = $.extend(this.p.navButtons, $.ygrid.nav);
                var pagerId = this.p.id + '_pager';

                var pager = $("<div id='" + pagerId + "'></div>");
                var onHoverIn = function () {
                        if (!$(this).hasClass('ui-state-disabled')) {
                            $(this).addClass("ui-state-hover");
                        }
                    },
                    onHoverOut = function () {
                        $(this).removeClass("ui-state-hover");
                    };
                ts.p.pager = "#" + pagerId;
                pager.css({width: grid.width + "px"}).addClass('ui-state-default ui-ygrid-pager').attr("dir", "ltr").appendTo(eg);
                pager.append([
                    "<div id='pg_" , pagerId , "' class='ui-pager-control' role='group' style='height:100%'>" ,
                    "<table cellpadding='0' border='0' class='ui-pg-table' style='width:100%;height:100%;' role='row'>" ,
                    "<tbody><tr><td id='" , pagerId , "_left' align='left' style='width:300px'></td>" ,
                    "<td id='" , pagerId , "_center' align='center' style='white-space:pre;'></td>",
                    "<td id='" , pagerId , "_right' align='right' style='width:300px'></td>",
                    "</tr></tbody></table></div>"].join(""));
                //初始化操作按钮
                var tbd,
                    navBTtbl = $("<table cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                    sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>";
                if (op.add) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.addIcon , "'></span>" , op.addtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.addtitle || "", id: "add_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.addFunc)) {
                                    op.addFunc.call(ts, "add");
                                } else {
//                                  //TODO  新增行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.del) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.delIcon , "'></span>" , op.deltext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.deltitle || "", id: "del_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.delFunc)) {
                                    op.delFunc.call(ts, "del");
                                } else {
//                                  //TODO  刪除行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.upRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.upRowIcon , "'></span>" , op.uprowtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.uprowtitle || "", id: "upRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.upRowFunc)) {
                                    op.upRowFunc.call(ts, "upRow");
                                } else {
//                                  //TODO  上移行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.downRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.downRowIcon , "'></span>" , op.downrowtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.downrowtitle || "", id: "downRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.downRowFunc)) {
                                    op.downRowFunc.call(ts, "downRow");
                                } else {
//                                  //TODO  下移行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.add || op.del || op.upRow || op.downRow) {
                    $("tr", navBTtbl).append(sep);
                }
                $(ts.p.pager + "_left", ts.p.pager).append(navBTtbl);
                tbd = null;
                navBTtbl = null;
                //初始化分页操作按钮及分页输入框
                if (ts.p.showPageSet) {
                    var pgcnt = "pg_" + pagerId,
                    pgl = ["<table cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>"],
                    po = ["first_" + pagerId, "prev_" + pagerId, "next_" + pagerId, "last_" + pagerId],
                    pagination = "<td><div id='pagination_" + pagerId + "' class='ui-pagination'><ul></ul></div></td>";
//                    var pginp = "<td>" + $.ygrid.formatString($.ygrid.defaults.pgtext || "",
//                        "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>") + "</td>";
                    pgl.push("<td id='");
                    pgl.push(po[0]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-first'></span></td>");
                    pgl.push("<td id='");
                    pgl.push(po[1]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-prev'></span></td>");
                    pgl.push(pagination);
                    pgl.push("<td id='");
                    pgl.push(po[2]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-next'></span></td>");
                    pgl.push("<td id='");
                    pgl.push(po[3]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-end'></span></td>");
//                    pgl += (pginp !== "" ? sep + pginp + sep : "");
                    pgl.push("</tr></tbody></table>");
                    $(ts.p.pager + "_center", ts.p.pager).append(pgl.join(""));


                    //翻页事件
                    var gotoPageEvent = function () {
                        var $this = $(this);
                        if ($this.hasClass("ui-state-disabled")) {
                            return false;
                        }
                        var p = ts.getControlGrid().pageInfo;

                        var curPage = p.curPageIndex + 1, page = curPage;

                        //判断做的操作
                        var id = this.id;
                        if(id.startsWith('first')){
                            page  = 1;
                        }else if(id.startsWith('prev')){
                            page = page - 1;
                        }else if(id.startsWith('next')){
                            page = page + 1;
                        }else if(id.startsWith('last')){
                            page = p.pageCount;
                        }else if($this.hasClass('pagination_btn')){
                            //点击页码
                            page = parseInt($this.attr("data-num"));
                        }

                        if(curPage == page){
                            return false;
                        }

                        //表格翻页 显示为异步，所以点击按钮后 设置 不可编辑 表格翻页结束后恢复
                        $("#first" + tp + ", #prev" + tp + ", #next" + tp + ", #last" + tp).addClass("ui-state-disabled");
                        
                        //转发grid 翻页事件
                        ts.p.gotoPage.call(ts.getControlGrid(), page).always(function(){
                            console.log('goto page end');
                            //更新页码
                            updatePagination($("#pagination_" + pagerId), p);
                        });

                        return false;
                    };

                    var pageInfo = ts.getControlGrid().pageInfo;
                    updatePagination($("#pagination_" + pagerId), pageInfo);

                    var tp = "_" + ts.p.pager.substr(1);

                    if ((pageInfo.curPageIndex + 1) == 1) {
                        $("#first" + tp+ ", #prev"+tp).addClass("ui-state-disabled");
                    } else {
                        $("#first" + tp+ ", #prev"+tp).removeClass("ui-state-disabled");
                    }

                    if ((pageInfo.curPageIndex + 1) == pageInfo.pageCount) {
                        $("#next" + tp + ", #last" + tp).addClass("ui-state-disabled");
                    } else {
                        $("#next" + tp + ", #last" + tp).removeClass("ui-state-disabled");
                    }

                    $("#first" + tp + ", #prev" + tp + ", #next" + tp + ", #last" + tp).click(gotoPageEvent);

                    // $('input.ui-pg-input', "#" + pgcnt).keypress(function (e) {
                    //     var key = e.charCode || e.keyCode || 0;
                    //     if (key === 13) {
                    //         $(this).val($.ygrid.intNum($(this).val(), 1));
                    //         ts.p.page = ($(this).val() > 0) ? $(this).val() : ts.p.page;
                    //         if (ts.p.page > ts.p.lastpage) {
                    //             ts.p.page = ts.p.lastpage;
                    //         }
                    //         grid.populate();
                    //         return false;
                    //     } else if (key >= 48 && key <= 57) {
                    //         return this;
                    //     }
                    //     return false;
                    // });
                }

                //初始化数据信息显示
                if (ts.p.viewRecords === true) {
                    $(ts.p.pager + "_right", ts.p.pager).append("<div style='text-align:right' class='ui-paging-info'></div>");
                }
                ts.updatePager.call(ts);

                $(ts).bindKeys();
            }
        });
    }
})(jQuery);

//提供给外部使用的事件
(function ($) {
    "use strict";
    $.ygrid.extend({
        getGridParam: function (pName) {  //获取表格属性值
            var $t = this[0];
            if (!$t || !$t.grid) {
                return null;
            }
            if (!pName) {
                return $t.p;
            }
            return $t.p[pName] !== undefined ? $t.p[pName] : null;
        },
        checkSelectAll: function () {
            return this.each(function () {

                // console.info("checkSelectAll==============")

                var $t = this, hTable = $($t.grid.hDiv).find(".ui-ygrid-htable"), rowData, enable, cell;
                for (var i = 0, len = this.p.data.length; i < len; i++) {
                    rowData = this.p.data[i];
                    if( !YIUI.GridUtil.isEmptyRow(rowData) ) {
                        cell = rowData.data[parseInt($("input", hTable).attr("ofColIndex"), 10) - ($t.p.rowSequences ? 1 : 0)]
                        break;
                    }
                }
                $("input",hTable).each(function () {
                    if( cell && cell[2] ) {
                        $(this).removeAttr("disabled");
                    } else {
                        $(this).attr("disabled", "disabled");
                    }
                });
            });
        },
        setGridParam: function (newParams) {     //设置表格属性
            return this.each(function () {
                if (this.grid && typeof newParams === 'object') {
                    for (var key in newParams) {
                        var value = newParams[key];
                        if ($.isArray(value)) {
                            this.p[key] = value.slice(0);
                        } else {
                            this.p[key] = value;
                        }
                    }
                }
            });
        },
        refreshData: function () {
            return this.each(function () {
                var $t = this, top = $t.grid.bDiv.scrollTop, left = $t.grid.bDiv.scrollLeft;
                if (!$t.grid) {
                    return;
                }
                var trf = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(trf);
                $t.updatePager.call($t);
                $t.grid.populate();
                $t.grid.bDiv.scrollTop = top;
                $t.grid.bDiv.scrollLeft = left;
            });
        },
        clearGridData: function () {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var trf = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(trf);
                $t.p.selectRow = null;
                $t.p.selectCell = null;
                $t.p.editCells = [];
                $t.p.data = [];
                      $t.p.records = 0;
                $t.p.page = 1;
                $t.p.lastpage = 1;
                $t.p.reccount = 0;
            });
        },
        bindKeys: function () {
            return this.each(function () {
                var findVisibleCell = function (colModel, iCol, dir) {
                    var i, len = colModel.length;
                    if (dir === "next") {
                        for (i = iCol + 1; i < len; i++) {
                            if (colModel[i].hidden !== true) {
                                return i;
                            }
                        }
                    } else if (dir === "pre") {
                        for (i = iCol - 1; i >= 0; i--) {
                            if (colModel[i].hidden !== true) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };
                this.p.knv = this.p.id + "_kn";
                var knv = $("#" + this.p.knv);
                if (knv.length == 0) {
                    knv = $(["<div tabindex='-1' style='left:-1px;width:1px;height:0px;' id='" ,
                        this.p.knv , "'></div>"].join("")).insertBefore($(this.grid.bDiv).parents(".ui-ygrid-view")[0]);
                }
                knv.focus().keydown(function (event, outEvent) {
                    if (outEvent != null && outEvent.isPropagationStopped()) return;
                    var th = $(".ui-ygrid-btable", event.target.nextSibling)[0], colModel = th.p.colModel;
                    th.keyEvent = true;
                    var keyCode = event.charCode || event.keyCode || 0;
                    if (keyCode == 0 && outEvent !== undefined) {
                        keyCode = outEvent.charCode || outEvent.keyCode || 0;
                    }
                    var ri = th.p.selectRow, ci = th.p.selectCell, gridRow , isOpt;
                    if ($(th).getGridRowById(ri) == undefined) {
                        isOpt = false;
                    } else if (keyCode === 13 || keyCode === 108 || keyCode === 9) {  // Enter,Tab键
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "next");
                        if (ci == -1) {
                            ci = th.p.rowSequences ? 1 : 0;
                            ri = ri + 1;
                        }
                        if (ri == th.rows.length) {
                            var preSelRow = $(th).yGrid('getGridRowById', th.p.selectRow);
                            preSelRow && $(preSelRow.cells[th.p.selectCell]).removeClass("ui-state-highlight");
                            if (th.p.editCells.length > 0) {
                                $(th).yGrid("saveCell", th.p.editCells[0].ir, th.p.editCells[0].ic);
                            }
                            th.getControlGrid().requestNextFocus();
                        }
                        isOpt = true;
                    } else if (keyCode === 38) {  // 上
                        ri = $(th).getGridRowById(ri).rowIndex - 1;
                        if (ri < 0) return;
                        isOpt = true;
                    } else if (keyCode === 40) {  //下
                        ri = $(th).getGridRowById(ri).rowIndex + 1;
                        if (ri >= th.rows.length) return;
                        isOpt = true;
                    } else if (keyCode === 37) {  //左
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "pre");
                        if (ci < (th.p.rowSequences ? 1 : 0))  return;
                        isOpt = true;
                    } else if (keyCode === 39) {   //右
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "next");
                        if (ci === -1 || ci >= colModel.length)  return;
                        isOpt = true;
                    }
                    if (isOpt && th.p.selectRow && th.p.selectCell) {
                        th.grid.clearSelectCells();
                        $($(th).getGridRowById(th.p.selectRow).cells[th.p.selectCell]).find(".celleditor").blur();
                        gridRow = th.rows[ri];
                        if (gridRow) {
                            gridRow.cells[ci].click();
                            $(th).scrollVisibleCell(ri, ci);
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (th.p.extKeyDownEvent && $.isFunction(th.p.extKeyDownEvent) && !event.ctrlKey) { //扩展的按键事件，自定义使用
                        th.p.extKeyDownEvent.call(th, event);
                    }
                    th.keyEvent = false;

                    if (event.ctrlKey) {
                        var textArea = $("#copyText" + th.p.id), top = th.grid.bDiv.scrollTop, left = th.grid.bDiv.scrollLeft;
                        if (!textArea[0]) {
                            textArea = $("<textarea id='copyText" + th.p.id + "'></textarea>").appendTo($(document.body));
                            textArea.css({position: "fixed", top: "-10000px", left: left + "px", width: "1000px", height: "200px"});
                        }
                        var copyText = [], oldRi = -1, length = (th.p.selectCells == undefined ? 0 : th.p.selectCells.length);
                        for (var i = 0; i < length; i++) {
                            var cell = th.p.selectCells[i], cellvalue = $.ygrid.stripHtml($(cell).html());
                            ri = cell.parentElement.rowIndex - 1;
                            var charStr = "";
                            if (parseInt(oldRi, 10) >= 0) {
                                if (ri > oldRi) {
                                    charStr = "\n";
                                    oldRi = ri;
                                }
                            } else {
                                oldRi = ri;
                            }
                            if (charStr.length > 0) {
                                copyText.pop();
                            }
                            copyText.push(charStr);
                            copyText.push(cellvalue);
                            copyText.push("\t");
                        }
                        copyText.pop();
                        textArea.val(copyText.join(""));
                        textArea.focus();
                        textArea.select();
                        textArea.keyup(function (event) {
                            var keyCode = event.charCode || event.keyCode || 0;
                            th.grid.bDiv.scrollTop = top;
                            th.grid.bDiv.scrollLeft = left;
                            if (event.ctrlKey && keyCode == 86) {
                                textArea.blur();
                                if (th.p.afterPaste && $.isFunction(th.p.afterPaste)) {
                                    th.p.afterPaste.call(th, $("#copyText" + th.p.id).val());
                                }
                            } else if (event.ctrlKey && keyCode == 67) {
                                if (th.p.afterCopy && $.isFunction(th.p.afterCopy)) {
                                    th.p.afterCopy.call(th, $("#copyText" + th.p.id).val());
                                }
                            }
                            textArea.remove();
                            window.setTimeout(function () {
                                var scrollTop = th.grid.bDiv.scrollTop;
                                $("#" + th.p.knv).attr("tabindex", "-1").focus();
                                th.grid.bDiv.scrollTop = scrollTop;
                            }, 0);
                        });
                        th.grid.bDiv.scrollTop = top;
                        th.grid.bDiv.scrollLeft = left;
                    }
                })
            });
        },
        setGridWidth: function (newWidth) {
            return this.each(function () {
                if (!this.grid) {
                    return;
                }
                var $t = this;
                if (isNaN(newWidth)) {
                    return;
                }
                newWidth = parseInt(newWidth, 10);
                $t.grid.width = $t.p.width = newWidth;
                $("#gbox_" + $t.p.id).css("width", newWidth + "px");
                $($t.p.id + "_view").css("width", newWidth + "px");
                $($t.grid.bDiv).css("width", (newWidth - 5) + "px");
                $($t.grid.hDiv).css("width", (newWidth - 5) + "px");
                if ($t.p.showPager) {
                    $($t.p.pager).css("width", newWidth + "px");
                }
            });
        },
        setGridHeight: function (newHeight) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var titleH = $($t.grid.hDiv).height();
                if (titleH === 0) {
                    var lastTr = $("tr.ui-ygrid-headers", $t.grid.hDiv);
                    var hrCount = $("tr.ui-ygrid-columnheader", $t.grid.hDiv).length + lastTr.length;
                    var th_H = $("th", lastTr).height();
                    titleH = (th_H + 2) * hrCount;
                }
                newHeight = newHeight - titleH - $($t.p.pager).height() - 2;
                var bDiv = $($t.grid.bDiv);
                bDiv.css({height: (newHeight) + (isNaN(newHeight) ? "" : "px")});
                $t.p.height = newHeight;
                if ($t.p.scroll) {
                    $t.grid.populateVisible();
                }
            });
        },
        initGroupHeaders: function (array) {
            return this.each(function () {
                var th = this, len = array.length;
                th.p.groupHeaders = [];
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var groupHeaderArray = array[i];
                        $(th).setGroupHeaders(groupHeaderArray);
                        th.p.groupHeaders.push(groupHeaderArray);
                    }
                }
                //计算表头合并单元格
                var hrs = $("tr.ui-ygrid-columnheader", th.grid.hDiv);
                for (var ri = hrs.length - 1; ri >= 0; ri--) {
                    var hr = hrs[ri];
                    for (var ci = 0, rhci = 0, clen = hr.cells.length; ci < clen; ci++) {
                        var cell = $(hr.cells[ci]), rhCell = $(th.grid.headers[rhci].el);
                        if (cell[0].colSpan > 1) {
                            rhci += cell[0].colSpan;
                        } else {
                            if (cell[0].style.display !== "none") {
                                rhCell[0].rowSpan += 1;
                                rhCell.insertBefore(cell);
                                $("div", rhCell).css({height: rhCell.height() + "px", lineHeight: rhCell.height() + "px"});
                                cell.remove();
                            }
                            rhci++;
                        }
                    }
                }
            });
        },
        setGroupHeaders: function (o) {     //设置表格多层表头
            return this.each(function () {
                var indexOfColumnHeader = function (text, columnHeaders) {
                    var length = columnHeaders.length;
                    for (var i = 0; i < length; i++) {
                        if (columnHeaders[i].startColumnName === text) {
                            return i;
                        }
                    }
                    return -1;
                };
                var $th = this, groupHeaderArray = o, $rowHeader = $("tr.ui-ygrid-headers", $th.grid.hDiv),
                    $groupHeadRow = $("<tr class='ui-ygrid-columnheader' role='columnheader'></tr>").insertBefore($rowHeader),
                    $firstHeaderRow = $($th.grid.hDiv).find("tr.yg-first-row-header");   //不可见行，用于控制每个列的动态宽度
                if ($firstHeaderRow[0] === undefined) {
                    $firstHeaderRow = $('<tr>', {role: "row", "aria-hidden": "true"}).addClass("yg-first-row-header").css("height", "auto");
                } else {
                    $firstHeaderRow.empty();
                }
                for (var j = 0, len = $th.p.colModel.length; j < len; j++) {
                    var thStyle = {height: 0, width: $th.grid.headers[j].width + 'px', display: ($th.p.colModel[j].hidden ? 'none' : '')};
                    $("<th>", {role: 'gridcell'}).css(thStyle).addClass("ui-first-th-ltr").appendTo($firstHeaderRow);
                }
                var headCol, index, cVisibleColumns, iCol, colHeader;
                for (var i = 0, clen = $th.p.colModel.length; i < clen; i++) {   //构建上级表头
                    index = indexOfColumnHeader($th.p.colModel[i].name, groupHeaderArray);
                    if (index >= 0) {
                        headCol = groupHeaderArray[index];
                        var colWidth = 0, hiddenCount = 0, hLen = headCol.numberOfColumns, cLen = $th.p.colModel.length;
                        for (cVisibleColumns = 0, iCol = 0; iCol < hLen && (i + iCol < cLen); iCol++) {
                            if (!$th.p.colModel[i + iCol].hidden) {
                                cVisibleColumns++;
                                colWidth += $th.grid.headers[i + iCol].width + 1;
                            } else {
                                hiddenCount++;
                            }
                        }
                        colHeader = $('<th class="ui-state-default ui-th-column ui-th-ltr" role="columnheader"></th>')
                            .html(headCol.titleText).appendTo($groupHeadRow);
                        if (cVisibleColumns > 0) {
                            colHeader.attr("colspan", String(cVisibleColumns));
                            colHeader.css({width: colWidth + "px"});
                            colHeader.attr("title", colHeader.text());
                        }
                        if (cVisibleColumns === 0) {
                            colHeader.hide();
                            colHeader.attr("colspan", String(hiddenCount));
                        }
                        i += cVisibleColumns - 1 + hiddenCount;
                    } else {
                        var ch = $('<th class="ui-state-default ui-th-column ui-th-ltr" role="columnheader"></th>').appendTo($groupHeadRow);
                        if ($th.p.colModel[i].hidden) {
                            ch.hide();
                        }
                    }
                }
                $($th.grid.hDiv).find(".ui-ygrid-htable").children("thead").prepend($firstHeaderRow);
                $($th).bind('yGridResizeStop.setGroupHeaders', function (e, nw, idx) {
                    $firstHeaderRow.find('th').eq(idx).width(nw - 1);
                });
            });
        },
        getGridRowById: function (rowid) { //根据行id获取表格行
            var row;
            this.each(function () {
                try {
                    var i = this.rows.length;
                    while (i--) {
                        if (rowid.toString() === this.rows[i].id) {
                            row = this.rows[i];
                            break;
                        }
                    }
                } catch (e) {
                    row = $(this.grid.bDiv).find("#" + rowid);
                }
            });
            return row;
        },
        getGridRowAt: function (rowIndex) {
            var row;
            this.each(function () {
                var th = this;
                row = th.rows[rowIndex];
            });
            return row;
        },
        getGridCellAt: function (rowIndex, colIndex) {
            var cell;
            this.each(function () {
                var th = this;
                var row = th.rows[rowIndex];
                if (row) {
                    cell = row.cells[colIndex];
                }
            });
            return cell;
        },

        setCellRequired: function (rowIndex, colIndex, isRequired) {

            return this.each(function () {
                var th = this;

                var rid = $.ygrid.uidPref + rowIndex;

                var viewRow = $(this).getGridRowById(rid);
                if( !viewRow )
                    return;
                var viewCell = $(viewRow.cells[colIndex + (this.p.rowSequences ? 1 : 0)]);
                if( !viewCell )
                    return;
                var errorReg = $("div.ui-cell-required",viewCell);
                if( isRequired ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-required").appendTo(viewCell);
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.removeAttr("position");
                }
            });


        },

        setCellFocus: function (rowIndex, colIndex) {
            this.each(function () {
                var cell = $(this).getGridCellAt(rowIndex, colIndex);
                cell && $(cell).click();
            });
        },

        setCellEnable:function (rowIndex,colIndex,enable) {
            return this.each(function(){

                var rid = $.ygrid.uidPref + rowIndex;
                var viewRow = $(this).getGridRowById(rid);
                if( !viewRow )
                    return;

                var pos = this.getColPos(colIndex);

                var cell = viewRow.cells[pos];
                if( !cell )
                    return;
                if ( enable ) {
                    $(cell).removeClass("ui-cell-disabled");
                } else {
                    $(cell).addClass("ui-cell-disabled");
                }

                var rowData = this.p.data[rowIndex];

                var editOpt = this.getCellEditOpt(rowData,pos);

                if (editOpt && editOpt.isAlwaysShow) {
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
                    default:
                        break;
                    }
                }
            });
        },

        setCellError: function (rowIndex,colIndex,error,errorMsg) {
            return this.each(function () {

                var rid = $.ygrid.uidPref + rowIndex;

                var viewRow = $(this).getGridRowById(rid);
                if( !viewRow )
                    return;
                var viewCell = $(viewRow.cells[colIndex + (this.p.rowSequences ? 1 : 0)]);
                if( !viewCell )
                    return;
                var errorReg = $("div.ui-cell-error",viewCell);
                if( error ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.attr({title: errorMsg}).css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-error").appendTo(viewCell);
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.attr({title:viewCell.html()}).removeAttr("position");
                }
            });
        },

        setRowError: function (rowIndex,error,errorMsg) {
            return this.each(function () {
                var rid = $.ygrid.uidPref + rowIndex;
                var viewRow = $(this).getGridRowById(rid);
                if( !viewRow )
                    return;
                var viewCell = $(viewRow.cells[0]);
                var errorReg = $("div.ui-cell-error",viewRow.cells[0]);
                if( error ) {
                    if( errorReg.length > 0 )
                        return;
                    viewCell.attr({title: errorMsg}).css({position: "relative"});
                    $("<div></div>").addClass("ui-cell-error").appendTo(viewCell);
                } else {
                    if( errorReg.length < 0 )
                        return;
                    errorReg.remove();
                    viewCell.attr({title:viewCell.html()}).removeAttr("position");
                }
            });
        },

        editCell: function (iRow, iCol, ed, event) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                iCol = parseInt(iCol, 10);
                $t.p.selectRow = $t.rows[iRow].id;
                if ($t.p.editCells.length > 0) {
                    if (ed === true) {
                        if (iRow == $t.p.iRow && iCol == $t.p.iCol) {
                            return;
                        }
                    }
                    $($t).yGrid("saveCell", $t.p.editCells[0].ir, $t.p.editCells[0].ic);
                }
                var cm = $t.p.colModel[iCol], rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id)),
                    row = $t.p.data[rowIndex], editOpt = $t.getCellEditOpt(row, iCol), formatter = editOpt.formatter;
                var nm = cm.name;
                if (nm === 'rn' || formatter == undefined || formatter == "button" || formatter == "hyperlink" || formatter == "checkbox" || formatter == "image") {
                    return;
                };
                var colIndex = iCol - ($t.p.rowSequences ? 1 : 0);
                if( colIndex == $t.p.treeIndex || colIndex === $t.p.rowExpandIndex )
                    return;
                var rowEditable = (row.isEditable === undefined ? true : row.isEditable);
                if( !rowEditable )
                    return;
                var curCell = $("td:eq(" + iCol + ")", $t.rows[iRow]), enable = row.data[cm.index][2];
                if (enable === undefined || enable === null) {
                    enable = cm.editable;
                }
                if (enable === undefined || enable === null) {
                    enable = $t.p.enable;
                }
                if (enable === true && ed === true && !curCell.hasClass("not-editable-cell")) {
                    if (parseInt($t.p.iCol, 10) >= 0 && parseInt($t.p.iRow, 10) >= 0) {
                        $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        $($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover");
                    }
                    $(curCell).addClass("edit-cell ui-state-highlight");
                    $($t.rows[iRow]).addClass("selected-row ui-state-hover");

                    $t.p.editCells.push({ir: iRow, ic: iCol, name: nm, v: row.data[cm.index], cell: curCell});
                    var opt = {event: event, ir: iRow, ic: iCol, id: iRow + "_" + nm, name: nm, editOpt:editOpt};
                    if (editOpt.customedit && $t.p.createCellEditor && $.isFunction($t.p.createCellEditor)) {
                        var colIndex = $t.p.rowSequences ? iCol - 1 : iCol;
                        $t.p.createCellEditor.call($t.getControlGrid(), curCell, rowIndex, colIndex, opt);
                    }
                }
                $t.p.iCol = iCol;
                $t.p.iRow = iRow;
            });
        },
        saveCell: function (iRow, iCol, val) {
            return this.each(function () {
                var $t = this, fr;
                if (!$t.grid) {
                    return;
                }
                if ($t.p.editCells.length >= 1) {
                    fr = 0;
                } else {
                    fr = null;
                }
                if (fr !== null) {
                    var cc = $("td:eq(" + iCol + ")", $t.rows[iRow]), v2, rowIndex = $.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id),
                        editOpt = $t.getCellEditOpt($t.p.data[rowIndex], iCol), isChanged = false;

                    if (editOpt.customedit && $t.p.checkAndSet && $.isFunction($t.p.checkAndSet)) {
                        isChanged = $t.p.checkAndSet.call($t, cc, editOpt.edittype, iRow, iCol, val);
                    }
                    if(isChanged){
                        if (editOpt.customedit && $t.p.endCheck && $.isFunction($t.p.endCheck)) {
                            var caption = $t.p.endCheck.call($t, cc, editOpt.edittype, iRow, iCol, val);
                            console.log(caption);


                            var cm = this.p.colModel[iCol], id = this.rows[iRow].id ,
                            rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id), 
                            row = this.p.data[rowIndex];


                            $($t).yGrid("setCell", $t.rows[iRow].id, iCol, row.data[cm.index], false, false);
                            $t.p.editCells.splice(0, 1);

                        }
                    }


                    if (isChanged) {
                        //$($t).yGrid("setCell", $t.rows[iRow].id, iCol, v2, false, false);
                       // $t.p.editCells.splice(0, 1);
                    } else {
                        $($t).yGrid("restoreCell", iRow, iCol);
                    }
                    if ($t.p.afterEndCellEditor && $.isFunction($t.p.afterEndCellEditor)) {
                        $t.p.afterEndCellEditor.call($t, cc, editOpt.edittype, isChanged, iRow, iCol);
                    }

                }

            });
        },
        restoreCell: function (iRow, iCol) {
            return this.each(function () {
                var $t = this, fr;
                if (!$t.grid) {
                    return;
                }
                if ($t.p.editCells.length >= 1) {
                    fr = 0;
                } else {
                    fr = null;
                }
                if (fr !== null) {
                    var cc = $("td:eq(" + iCol + ")", $t.rows[iRow]);
                    $(cc).empty().attr("tabindex", "-1");
                    $($t).yGrid("setCell", $t.rows[iRow].id, iCol, $t.p.editCells[fr].v, false, false);
                    $t.p.editCells.splice(0, 1);
                }
            });
        },
        setCell: function (rowid, colname, nData, cssp, attrp) {
            return this.each(function () {
                var $t = this, pos = -1, v, title;
                if (!$t.grid) {
                    return;
                }
                if (isNaN(colname)) {
                    $($t.p.colModel).each(function (i) {
                        if (this.name === colname) {
                            pos = i;
                            return false;
                        }
                    });
                } else {
                    pos = parseInt(colname, 10);
                }
                if (pos >= 0) {
                    var ind = $($t).yGrid('getGridRowById', rowid), ri = parseInt($.ygrid.stripPref($.ygrid.uidPref, rowid), 10);
                    if (ind) {

                        var tcell = $("td:eq(" + pos + ")", ind);

                        if (nData !== undefined) {
                            var editOpt = this.getCellEditOpt2(ri, pos);
                            v = nData[1];
                            if (editOpt.isAlwaysShow) {
                                //if (!rowData.isDetail)return;
                                //$(".cellEditor", cell)[0].title = cellV;
                                switch (editOpt.formatter) {
                                    case "button":
                                        $(".cellEditor span.txt", tcell).html(v);
                                        break;
                                    case "hyperlink":
                                        $(".cellEditor", tcell).html(v);
                                        break;
                                    case "checkbox":
                                        $(".cellEditor input", tcell)[0].checked = (v == 1 || v == true || v == "true");
                                        $(".cellEditor", tcell)[0].title = (v == 1 || v == true || v == "true");
                                        break;
                                    case "image":
                                        tcell.editor.setValue(v);
                                        break;
                                }
                            }else{
               
                    
                                    title = {"title": v};
                                    $(tcell).html(v).attr(title);
                                    //var cm = $t.p.colModel[pos], index;
                                    //$t.p.data[ri].data[cm.index] = nData;
                                
                            }

                            // 必填
                            $($t).yGrid("setCellRequired", ri, pos - 1, nData[3]);

                            // 检查规则
                            $($t).yGrid("setCellError", ri, pos - 1, nData[4], nData[5]);
                        }


                        if (typeof cssp === 'string') {
                            $(tcell).addClass(cssp);
                        } else if (cssp) {
                            $(tcell).css(cssp);
                        }
                        if (typeof attrp === 'object') {
                            $(tcell).attr(attrp);
                        }

                    }
                }
            });
        },
        scrollVisibleCell: function (iRow, iCol) {   //滚动表格使得当前单元格处于显示区域
            return this.each(function () {
                var $t = this;
                var ch = $t.grid.bDiv.clientHeight,
                    st = $t.grid.bDiv.scrollTop,
                    crth = $t.rows[iRow].offsetTop + $t.rows[iRow].clientHeight,
                    crt = $t.rows[iRow].offsetTop;
                if (crth >= ch + st) {
                    $t.grid.bDiv.scrollTop = crth - ch + 2;
                } else if (crt < st) {
                    $t.grid.bDiv.scrollTop = $t.rows[iRow].offsetTop;
                }
                var cw = $t.grid.bDiv.clientWidth,
                    sl = $t.grid.bDiv.scrollLeft,
                    crclw = $t.rows[iRow].cells[iCol].offsetLeft + $t.rows[iRow].cells[iCol].clientWidth,
                    crcl = $t.rows[iRow].cells[iCol].offsetLeft;
                if (crclw >= cw + parseInt(sl, 10)) {
                    $t.grid.bDiv.scrollLeft = $t.grid.bDiv.scrollLeft + $t.rows[iRow].cells[iCol].clientWidth;
                } else if (crcl < sl) {
                    var left = crcl - $t.rows[iRow].cells[iCol].clientWidth;
                    $t.grid.bDiv.scrollLeft = left < 0 ? 0 : left;
                }
            });
        },
        clearBeforeUnload: function () {
            return this.each(function () {
                var grid = this.grid;
                if ($.isFunction(grid.emptyRows)) {
                    grid.emptyRows.call(this, true, true);
                }
                $(document).unbind("mouseup.yGrid" + this.p.id);
                $(grid.hDiv).unbind("mousemove");
                $(grid.bDiv).unbind("mousemove");
                $(this).unbind();
                grid.dragEnd = null;
                grid.dragMove = null;
                grid.dragStart = null;
                grid.emptyRows = null;
                grid.populate = null;
                grid.populateVisible = null;
                grid.scrollGrid = null;
                grid.clearSelectCells = null;
                grid.timer = null;
                grid.prevRowHeight = null;
                grid.bDiv = null;
                grid.hDiv = null;
                grid.cols = null;
                var i, l = grid.headers.length;
                for (i = 0; i < l; i++) {
                    grid.headers[i].el = null;
                }
                this.updatepager = null;
                this.refreshIndex = null;
                this.modifyGridCell = null;
                this.formatter = null;
                this.grid = null;
                this.p._indexMap = null;
                this.p.data = null;
                this.p = null;
            });
        },
        GridDestroy: function () {
            return this.each(function () {
                if (this.grid) {
                    if (this.p.pager) {
                        $(this.p.pager).remove();
                    }
                    try {
                        $(this).clearBeforeUnload();
                        $("#gbox_" + this.id).remove();
                    } catch (_) {
                    }
                }
            });
        }
    });
})(jQuery);
//fmatter初始化
(function ($) {
    "use strict";
    $.fmatter = {};
    $.fn.fmatter = function (formatType, cellval, opts, rwd, act) {
        var v = cellval;
        opts = $.extend({}, $.ygrid.formatter, opts);
        try {
            v = $.fn.fmatter[formatType].call(this, cellval, opts, rwd, act);
        } catch (fe) {
        }
        return v;
    };
    $.extend($.fmatter, {
        isBoolean: function (o) {
            return typeof o === 'boolean';
        },
        isObject: function (o) {
            return (o && (typeof o === 'object' || $.isFunction(o))) || false;
        },
        isString: function (o) {
            return typeof o === 'string';
        },
        isNumber: function (o) {
            return typeof o === 'number' && isFinite(o);
        },
        isValue: function (o) {
            return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
        },
        isEmpty: function (o) {
            if (!this.isString(o) && this.isValue(o)) {
                return false;
            }
            if (!this.isValue(o)) {
                return true;
            }
            o = $.trim(o).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            return o === "";
        },
        extend: function (formatType, formatFunc) {
            if ($.isFunction(formatFunc)) {
                $.fn.fmatter[formatType] = formatFunc;
            }
        }
    });
    $.fn.fmatter.defaultFormat = function (cellval, opts) {
        return ($.fmatter.isValue(cellval) && cellval !== "" ) ? cellval : opts.defaultValue || "&#160;";
    };
    $.fn.fmatter.hyperlink = function (cellval, opts) { //超链接单元格格式化
        var op = {baseLinkUrl: opts.baseLinkUrl, showAction: opts.showAction, addParam: opts.addParam || "", target: opts.target, idName: opts.idName},
            target = "", idUrl;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.target) {
            target = 'target=' + op.target;
        }
        if (op.baseLinkUrl) {
            idUrl = op.baseLinkUrl + op.showAction + '?' + op.idName + '=' + opts.rowId + op.addParam;
        } else {
            idUrl = "#";
        }
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {	//add this one even if its blank string
            return ["<a  style='width: 100%' " , target , " href='" , idUrl , "' class='ui-hyperlink'>" , cellval , "</a>"].join("");
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.button = function (cellval, opts) {  //按钮单元格格式化
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {
            cellval = typeof(cellval) == "undefined" ? "" : cellval;
            return "<button style='width: 100%;height: 100%' class='ui-button'>" + cellval + "</button>"
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.checkbox = function (cellval, opts) {  //复选框单元格格式化
        var op = $.extend({}, opts.checkbox), ds;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.disabled === true || (opts.colModel.editable === undefined ? !this.p.enable : !opts.colModel.editable)) {
            ds = "disabled=\"disabled\"";
        } else {
            ds = "";
        }
        if ($.fmatter.isEmpty(cellval) || cellval === undefined) {
            cellval = false;
        }
        cellval = String(cellval);
        cellval = (cellval + "").toLowerCase();
        var bchk = cellval.search(/(false|f|0|no|n|off|undefined)/i) < 0 ? " checked='checked' " : "";
        return "<input type=\"checkbox\" style='text-align: center' " + bchk + " value=\"" + cellval + "\" offval=\"false\" " + ds + "/>";
    };
    $.fn.fmatter.textEditor = function (cellval, opts) {  //输入框格式化
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.numberEditor = function (cellval, opts) {  //数值框格式化
        if (isNaN(parseFloat(cellval))) {
            cellval = "";
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.datePicker = function (cellval, opts) {  //日期格式化
        if (!$.fmatter.isEmpty(cellval)) {
            var option = opts.colModel.editOptions;
            var date = new Date(parseFloat(cellval, 10));
            return date.Format(option.formatStr);
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
})(jQuery);