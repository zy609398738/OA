Ext.ns('yigo.grid');
/**
 * TODO: insertrows, removerows, tree-col, setDiff
 * @type {*}
 */
yigo.grid.GroupingView = Ext.extend(MAP.ui.form.GridView, {
    /**
     * @cfg {String} groupByText Text displayed in the grid header menu for grouping by a column
     * (defaults to 'Group By This Field').
     */
    groupByText : '按这列分组',
    /**
     * @cfg {String} showGroupsText Text displayed in the grid header for enabling/disabling grouping
     * (defaults to 'Show in Groups').
     */
    showGroupsText : '分组显示',

    hideGroupedColumn: true,
    startCollapsed: true,
    firstGroupExpanded: false,
    lastGroupExpanded: false,
    /**
     * @cfg {Boolean} enableGrouping false表示不采用分组， 默认true
     * 如 groupField 为 空或null, 将总是 false
     */
    enableGrouping : true,
    /**
     * @cfg {Boolean} enableGroupingMenu false表示不显示分组列菜单，默认false
     */
    enableGroupingMenu: true,

    /**
     * @cfg {Array} groupableFields 可分组的列key。与colModel中groupable=true的列，综合为最终的可分组列
     * 也就是说，如果A列可分组，可以在此项配置，也可在colModel中定义 {"_key": "A", "groupable": true}
     *
     * TODO: 支持 [{ <_key>: {groupConfig} } ,...] 比如 groupRenderer
     */
    groupableFields: [],

    /**
     * @cfg {String} groupField 字段名， 按其值分组。 若非空，优先级高于 groupFieldIndex
     */
    groupField: null,

    /**
     * @cfg {Number} groupFieldIndex 字段序号，按其值分组。 如果为-1，则强制enableGrouping=false，而采用MAP.ui.form.GridView
     */
    groupFieldIndex: -1,

    /**
     * 只支持 gvalue: string,
     *       text : String
     *       groupId : String
     *       startRow: Number
     *       rs : Array
     *       cls : String
     *       style : String
     * TODO： 支持 group : String (group Renderer)
     */
    groupTextTpl: '{text}',

    // private
    groupState: {},

    // 排序字段 序号
    sortFieldIndex: 1,

    init: function (grid) {
        yigo.grid.GroupingView.superclass.init.call(this, grid);

        if ( this.groupField )
            this.groupFieldIndex = this.columnIndexOf(this.groupField);
        if ( !Ext.isNumber(this.groupFieldIndex) )
            this.groupFieldIndex = -1;

        if ( this.groupFieldIndex >= 0 && this.groupFieldIndex < this.cm.config.length) {
            if ( !this.groupField )
                this.groupField = this.cm.config[this.groupFieldIndex].__key;
            if ( this.hideGroupedColumn )
                this.cm.config[this.groupFieldIndex].hidden = true;
        }
    },

    // private
    initTemplates: function () {
        var sm = this.grid.selModel;
        sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect',
            function(sm, rowIndex){
                if( this.groupFieldIndex < 0 ){
                    return;
                }
                var row = this.getRow(rowIndex);
                if(row && !row.offsetParent){
                    var g = this.findGroup(row);
                    g && this.toggleGroup(g, true);
                }
            }, this);

        yigo.grid.GroupingView.superclass.initTemplates.call(this);

        this.templates = this.templates || {};

        this.templates.group = new Ext.Template(
            '<div id="{groupId}" class="x-grid-group {cls}">',
                '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}">',
                    '<div class="x-grid-group-title">', this.groupTextTpl ,'</div>',
                '</div>',
                '<div id="{groupId}-bd" class="x-grid-group-body">',
                this.templates['body'] instanceof Ext.Template
                    ? this.templates['body'].html
                    : '<table><tbody>{rows}</tbody></table>',
                '</div>',
            '</div>',
            {compiled: true, disableFormats: true});
    },

    // private
    findGroup : function(el){
        return Ext.fly(el).up('.x-grid-group', this.mainBody.dom);
    },

    // private
    getGroups: function () {
        return this.hasRows() ? this.mainBody.dom.childNodes : [];
    },

    // private
    hasRows: function () {
        if ( this.groupFieldIndex < 0 ) {
            return yigo.grid.GroupingView.superclass.hasRows.call(this);
        }

        return this.dataRows && this.dataRows.length > 0;
    },

    // private
    getRows: function() {
        if ( this.groupFieldIndex < 0 ) {
            return yigo.grid.GroupingView.superclass.getRows.call(this);
        }

        return this.dataRows;
    },

    midRowIndexOf: function ( uiRowIndex ) {
        return Ext.isArray(this.midRowIndexAfterSort) && !isNaN(uiRowIndex) ? this.midRowIndexAfterSort[uiRowIndex] : uiRowIndex;
    },

    /*uiRowIndexOf: function ( midRowIndex ) {  setDiff时需要将mid行号转换为ui行号，再渲染行界面才行
        if ( Ext.isArray(this.midRowIndexAfterSort) ) {
            for (var i = 0, len = this.midRowIndexAfterSort.length; i < len; i++) {
                if ( this.midRowIndexAfterSort[i] === midRowIndex ) {
                    return i + (this.grid.fixRowCount || 0);
                }
            }
        }

        return -1;
    },*/

    // private
    columnIndexOf: function ( /*String*/fieldKey ) {
        var fldIndex = -1;
        this.cm.config.each( function (fld, index) {
            if ( fld.__key === fieldKey ) {
                fldIndex = index;
                return false;
            }
        } );
        return fldIndex;
    },

    renderBody: function () {
        if ( this.groupFieldIndex < 0 ) {
            yigo.grid.GroupingView.superclass.renderBody.call(this);
            return;
        }

        this.sortModelByGroupField();

        if ( !this.bodyInternal || this.grid.forceRefresh ) {
            this.bodyInternal = this.renderRows() || '&nbsp;' ;
            this.mainBody.update(this.bodyInternal);

            this.dataRows = Ext.DomQuery.select('.x-grid-group-body .x-grid3-row', this.mainBody.dom);

            /*if ( this.groupFieldIndex >= 0 && this.hideGroupedColumn ) {
                Ext.each(this.dataRows, function ( el ) {
                    var td = el.childNodes[this.groupFieldIndex];
                    td && ( td.style.display = 'none' );
                }, this);
            }*/
        }

        var self = this;
        this.grid.embed && this.grid.embed.each(function(e){
            // this.mainBody // slideIn('t').pause(3)
            var istyle = 'width:100%;height:100%;';
            var s = MAP_C_SERVER_URL+'/rfc.do?&__out=1&__exp=WebShowPicture({'+encodeURI(e.d)+'})&__dc=' +(new UUID().toString());
            var id = 'embed-'+this.grid.id; // 暂时支持一个embed
            //{ // div
            var w = Ext.get(id);
            var content = '<image src="'+s+'" style="'+istyle+'" />';
            if (w) {
                w.dom.innerHTML=content;
            }else {
                w=Ext.DomHelper.append(this.mainBody,
                  {id:id,style:'position:absolute;visibility:visible;z-index:1000;'+// z-index:9999;
                    'left:'+e.r[0]+'px;top:'+e.r[1]+'px;width:'+e.r[2]+'px;height:'+e.r[3]+'px;',cls:'x-tip'},true);
                Ext.DomHelper.overwrite(w,{html:content},true).show();
                (function() {
                    var resizer = new Ext.Resizable(id, {
                        minWidth: 100,
                        minHeight: 100,
                        //heightIncrement: 20,
                        //widthIncrement: 20,
                        pinned: false,
                        //preserveRatio: true,
                        //transparent:true,
                        dynamic:true,
                        handles: 'all'
                    });
                    resizer.on('resize', function(){
                        var box = resizer.getEl().getSize();
                        this.setSize(box); // resize(w,h,o)
                        // commit to save resize-state
                    }, Ext.get($(id).down('img'))); // Ext.getDom(id).down('img') NOTICE:IE9 ERROR

                    new Ext.dd.DD(id, self.grid+'Group');
                }).defer(100);
            }
            return true;
        }, this);
    },

    // private
    renderRows: function(startRow, endRow) {
        var eg = this.groupFieldIndex >= 0;

        // if they turned off grouping and the last grouped field is hidden
        if(this.hideGroupedColumn) {
            if(!eg && this.lastGroupField !== undefined) {
                this.mainBody.update('');
                this.cm.setHidden(this.columnIndexOf(this.lastGroupField), false);
                delete this.lastGroupField;
            }else if (eg && this.lastGroupField === undefined) {
                this.lastGroupField = this.groupField;
                this.cm.setHidden(this.groupFieldIndex, true);
            }else if (eg && this.lastGroupField !== undefined && this.groupField !== this.lastGroupField) {
                this.mainBody.update('');
                var oldIndex = this.columnIndexOf(this.lastGroupField);
                this.cm.setHidden(oldIndex, false);
                this.lastGroupField = this.groupField;
                this.cm.setHidden(this.groupFieldIndex, true);
            }
        }

        return yigo.grid.GroupingView.superclass.renderRows.call(this, startRow, endRow);
    },

    // private
    doRender: function (cs, ds, startRow, endRow, colCount, stripe) {
        var superDoRender = yigo.grid.GroupingView.superclass.doRender;

        if ( this.groupFieldIndex < 0 ) {
            return superDoRender.call(this, cs, ds, startRow, endRow, colCount, stripe);
        }

        var buf = [];

        var groupData = null;
        var groupValueVisited = null;

        for ( var rowIndex = startRow; rowIndex <= endRow; rowIndex++ ) {
            var valueM = this.grid.store[rowIndex];

            var groupValue = valueM[this.groupFieldIndex];
            if ( groupValue !== groupValueVisited/* || rowIndex === endRow*/) {
                if ( groupData ) {
                    groupData.rows = groupData.rows.join('');
                    buf.push(this.templates.group.apply(groupData));
                }
                var groupId = this.getGroupId(groupValue);

                groupData = {
                    groupId: groupId,
                    startRow: rowIndex,
                    gvalue: this.grid.store[rowIndex][this.groupFieldIndex],
                    text: this.grid.displayValueModel[rowIndex][this.groupFieldIndex],
                    cls: !this.startCollapsed  // 配置上 默认为展开
                         || this.groupState[groupId] // state中记录 展开状态
                         || ( !groupData && this.firstGroupExpanded ) // 为第一组 要求展开
                        ? '' : 'x-grid-group-collapsed',
                    ds: [],
                    rows: []
                };

                groupValueVisited = groupValue;
            }

            if ( groupData ) {
                var groupItemCount = groupData.ds.length;
                groupData.ds[groupItemCount] = this.grid.displayValueModel[rowIndex];
                groupData.rows[groupItemCount] =
                    superDoRender.call(this, cs, ds, rowIndex, rowIndex, colCount, stripe);

                if ( rowIndex === endRow ) {
                    if ( !this.startCollapsed || this.groupState[groupId] || this.lastGroupExpanded ) {
                        groupData.cls = '';
                    }
                    groupData.rows = groupData.rows.join('');
                    buf.push(this.templates.group.apply(groupData));
                }
            }
        }

        return buf.join('');
    },

    // private
    getColumnData : function(){
        // build a map for all the columns
        var cs = [], cm = this.cm, colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            cs[i] = {
                name : cm.getColumnAt(i).__key,
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                style : this.getColumnStyle(i)
            };
        }
        return cs;
    },

    // private
    beforeMenuShow : function(){
        var items = this.hmenu.items,
            disabled = this.cm.config[this.hdCtxIndex].groupable !== true
                && this.groupableFields.indexOf(this.cm.getColumnAt(this.hdCtxIndex).__key) < 0;

        var item;
        if((item = items.get('groupBy'))){
            item.setDisabled(disabled);
        }
        if((item = items.get('showGroups'))){
            item.setDisabled(disabled);
            item.setChecked(this.groupFieldIndex >= 0, true);
        }
    },

    renderUI: function () {
        yigo.grid.GroupingView.superclass.renderUI.call(this);
        this.mainBody.on('mousedown', this.interceptMouse, this);

        this.focusEl = null;

        if(this.enableGroupingMenu && this.hmenu){
            this.hmenu.add('-',{
                itemId:'groupBy',
                text: this.groupByText,
                handler: this.onGroupByClick,
                scope: this,
                iconCls:'x-group-by-icon'
            });
            if(this.enableNoGroups){
                this.hmenu.add({
                    itemId:'showGroups',
                    text: this.showGroupsText,
                    checked: true,
                    checkHandler: this.onShowGroupsClick,
                    scope: this
                });
            }
            this.hmenu.on('beforeshow', this.beforeMenuShow, this);
        }
    },

    /**
     * Focuses the specified cell.
     *
     * @param {Number}
     *            row The row index
     * @param {Number}
     *            col The column index
     */
    focusCell : function(row, col, hscroll) {

    },

    // private
    sortModelByGroupField: function () {
        var self = this;
        if ( !Ext.isArray(this.grid.store)
            || !Ext.isArray(this.grid.model.rowModel)
            || !Ext.isArray(this.grid.displayValueModel)
            || !Ext.isArray(this.grid.model.cellModel)
            || (this.grid.store && this.grid.store.sorted)

            ) return;

        var fixRowCount = this.grid.fixRowCount || 0;

        var justData = this.grid.store.slice(fixRowCount);
        // 对 justData排序前先标记上原序号，以便排序后，对rowModel, displayValueModel, cellModel同步排序
        justData.each( function (row, index) {
            row.originalIndex = index;
        } );

        // 对 valueModel (justData) 按分组字段排序
        justData.sort( function (r1, r2) {
            var v1 = r1[self.groupFieldIndex], v2 = r2[self.groupFieldIndex];

            var sortFieldIndex = self.sortFieldIndex || 1;
            return (v1 > v2) || (v1 == v2 && r1[sortFieldIndex] > r2[sortFieldIndex]) ? 1 : -1;
        } );

        // 对rowModel, displayValueModel, cellModel同步排序
        var sortedRowModel = this.grid.model.rowModel.slice(0, fixRowCount),
            justDataRow = this.grid.model.rowModel.slice(fixRowCount);
        var sortedDisplayValueModel = this.grid.displayValueModel.slice(0, fixRowCount),
            justDataDspVM = this.grid.displayValueModel.slice(fixRowCount);
        var sortedCellModel = this.grid.model.cellModel.slice(0,fixRowCount),
            justDataCellModel = this.grid.model.cellModel.slice(fixRowCount);

        this.midRowIndexAfterSort = [];  // midRowIndexAfterSort, 存储的是mid中记录的行号 在 commitMid 时需要。
        for (var i = 0; i < fixRowCount; i++) { this.midRowIndexAfterSort[i] = i };

        justData.each(function ( row, index ) {
            var idx = index + fixRowCount;

            sortedRowModel[idx] = justDataRow[row.originalIndex];
            sortedDisplayValueModel[idx] = justDataDspVM[row.originalIndex];
            sortedCellModel[idx] = justDataCellModel[row.originalIndex];

            self.midRowIndexAfterSort[idx] = row.originalIndex + fixRowCount;
        });

        var sortedStore = this.grid.store.slice(0, fixRowCount).concat(justData);

        delete this.grid.model.rowModel;
        delete this.grid.model.cellModel;
        delete this.grid.store;
        delete this.grid.displayValueModel;

        this.ds = this.grid.ds = this.grid.store = sortedStore;  // gridValueModel
        this.grid.model.rowModel = sortedRowModel;                                 // grid rowModel
        this.grid.rowModel.setConfig(sortedRowModel);
        this.rowModel = this.grid.rowModel;
        this.grid.displayValueModel = sortedDisplayValueModel;                     // gridDisplayValueModel
        this.grid.cellModel = this.grid.model.cellModel = sortedCellModel;         // grid cellModel

        this.grid.store.sorted = true;
    },

    clearGrouping: function () {
        this.groupField = null;
        this.groupFieldIndex = -1;
        this.refresh(true);
    },

    // private
    onGroupByClick : function () {
        this.groupField = this.cm.getColumnAt(this.hdCtxIndex).__key;
        this.groupFieldIndex = this.hdCtxIndex;
        this.grid.forceRefresh = true;
        this.refresh(true);
        this.beforeMenuShow(); // Make sure the checkboxes get properly set when changing groups
    },

    // private
    onShowGroupsClick : function(mi, checked){
        if(checked){
            this.onGroupByClick();
        }else{
            this.clearGrouping();
        }
    },

    /**
     * Toggles the specified group if no value is passed, otherwise sets the expanded state of the group to the value passed.
     * @param {String} groupId The groupId assigned to the group (see getGroupId)
     * @param {Boolean} expanded (optional)
     */
    toggleGroup : function(group, expanded){
        this.grid.stopEditing(true);
        group = Ext.getDom(group);
        var gel = Ext.fly(group);
        expanded = expanded !== undefined ?
                expanded : gel.hasClass('x-grid-group-collapsed');

        this.groupState[gel.dom.id] = expanded;
        gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
    },

    /**
     * Toggles all groups if no value is passed, otherwise sets the expanded state of all groups to the value passed.
     * @param {Boolean} expanded (optional)
     */
    toggleAllGroups : function(expanded){
        var groups = this.getGroups();
        for(var i = 0, len = groups.length; i < len; i++){
            this.toggleGroup(groups[i], expanded);
        }
    },

    /**
     * Expands all grouped rows.
     */
    expandAllGroups : function(){
        this.toggleAllGroups(true);
    },

    /**
     * Collapses all grouped rows.
     */
    collapseAllGroups : function(){
        this.toggleAllGroups(false);
    },

    // private
    /*getGroup : function(v, r, groupRenderer, rowIndex, colIndex, ds){   //TODO: 实现groupRenderer时，获取groupData
        var g = groupRenderer ? groupRenderer(v, {}, r, rowIndex, colIndex, ds) : String(v);
        if(g === '' || g === '&#160;'){
            g = this.cm.config[colIndex].emptyGroupText || this.emptyGroupText;
        }
        return g;
    },*/

    /**
     * Dynamically tries to determine the groupId of a specific value
     * @param {String} value
     * @return {String} The group id
     */
    getGroupId : function(value){
        return this.constructId(value, this.grid.getGridEl().id, this.groupField, this.groupFieldIndex);
    },

    // private
    constructId : function(value, prefix, field, idx){
        return prefix + '-gp-' + field + "-"  + idx + '-' + Ext.util.Format.htmlEncode(value);
    },

    //private
    multiSelect : function(colIndex, endRow) {
        if ( this.groupFieldIndex < 0 ) {
            return yigo.grid.GroupingView.superclass.multiSelect.call(this, colIndex, endRow);
        }

        var store = this.grid.store;
        var lastRowIndex = this.lastSelectCheckboxMsg.row;
        var selectStatus = this.lastSelectCheckboxMsg.selectStatus;
        var cellModel = this.grid.cellModel;
        if(lastRowIndex == -1 || lastRowIndex == endRow)
            return false;
        var asc = (lastRowIndex < endRow);
        var start = (asc ? lastRowIndex + 1 : endRow + 1);
        var end = asc ? endRow : lastRowIndex;
        var result = false;
        for(var i = start; i < end; i++) {
            var v = Boolean(store[i][colIndex]);
            if(v != selectStatus) {
                store[i][colIndex] = selectStatus;
                var td = this.findCheckBoxDom(i, colIndex);
                this.setCheckBoxTdCls(td);
                MAP_BillContext.appendSetDtlValue(this.grid.__gridIndex,
                    this.midRowIndexOf(i), // 和 GridView的区别就是 这里提交mid的行号不是界面行号
                    colIndex, selectStatus, false);
                if(cellModel[i][colIndex].__isCommitSetValue && !result)
                    result = true;
            }
        }
        return result;
    },

    // private mainBody.mousedown
    interceptMouse: function ( e ) {
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
        if(hd){
            e.stopEvent();
            this.toggleGroup(hd.parentNode);
        }
    },

    onClick : function(e, t) {
        if ( this.groupFieldIndex < 0 ) {
            yigo.grid.GroupingView.superclass.onClick.call(this, e, t);
            return;
        }

        var uiRowIndex = this.findRowIndex(t);

        if ( uiRowIndex === false ) {
            e.stopEvent();
            return;
        }

        var midRowIndex = this.midRowIndexOf(uiRowIndex),
            colIndex = this.findCellIndex(t),
            record = this.grid.store[uiRowIndex],
            cell = this.grid.cellModel[uiRowIndex][colIndex];

        var targetEl = Ext.get(t), checkEl = null;
        if (targetEl.hasClass('x-grid3-cc-inner')) {
            checkEl = t;
        } else {
            var rowOfTargetEl = targetEl.parent('.x-grid3-row');
            if (rowOfTargetEl) {
                checkEl = rowOfTargetEl.child(':any(.x-grid3-check-col|.x-grid3-check-col-on)', true);

                if (checkEl) {
                    colIndex = this.findCellIndex(checkEl);
                    cell = this.grid.cellModel[uiRowIndex][colIndex];
                }
            }
        }

        if ( checkEl ) {
            if(!(cell.__isCheckBox && cell.__extraEnable)) return;

            var	v = record[colIndex]/*,
                isCommit = cell.__isCommitSetValue*/;

            this.setCheckBoxTdCls(checkEl);
            v = Ext.isBoolean(v)? !v : (v.toLowerCase() !== 'true');
            record[colIndex] = v;
            var shift = e.shiftKey;
            //多选自动提交,目的是刷新页面
            /*if(shift) {
                isCommit = this.multiSelect(colIndex, uiRowIndex) || isCommit;
            }*/
            MAP_BillContext.appendSetDtlValue(this.grid.__gridIndex, midRowIndex, colIndex, v, false);
            this.lastSelectCheckboxMsg.row = uiRowIndex;   // TODO: refresh  应该重置吗？
            this.lastSelectCheckboxMsg.selectStatus = v;
            //e.stopEvent();
        } else if(t.className && t.className.indexOf('map-grid-bc') != -1) {
            if(!(cell.__isButton && cell.__extraEnable)) return;
            MAP_BillContext.appendActiveRowChange(this.grid.__gridIndex, midRowIndex, colIndex, false);
            MAP_BillContext.appendDtlButtonClicked(this.grid.__gridIndex, midRowIndex, colIndex);
            e.stopEvent();
        } else if(t.className && t.className.indexOf('map-grid-hyperlink') != -1) {
            if(!(cell.__isHyperLink && cell.__extraEnable))
                return;
            MAP_BillContext.appendActiveRowChange(this.grid.__gridIndex, midRowIndex, colIndex, false);
            MAP_BillContext.appendDtlButtonClicked(this.grid.__gridIndex, midRowIndex, colIndex);
            e.stopEvent();
        }
    }
});

// private
yigo.grid.GroupingView.GROUP_ID = 1000;

yigo.grid.CheckGroupingView = Ext.extend(yigo.grid.GroupingView, {
    /**
     * @cfg {String} checkboxField 选择框 所在列的key，若非空，优先级高于 checkboxFieldIndex
     */
    /**
     * @cfg {Number}  选择框所在列的index, 默认为0（第一列）
     */
    checkboxFieldIndex: 0,
    groupTextTpl: '<span class="x-grid3-check-col x-grid-grouping-checkbox">&nbsp;</span><span>{text}</span>',

    init: function ( grid ) {
        yigo.grid.CheckGroupingView.superclass.init.call(this, grid);

        if ( this.checkboxField ) {
            this.checkboxFieldIndex = this.columnIndexOf(this.checkboxField);
        }
    },

    refresh: function (headersToo) {
        this.store && delete this.store.sorted;
        this.store = null;
        yigo.grid.CheckGroupingView.superclass.refresh.call(this, headersToo);

        if ( this.checkboxFieldIndex < 0 ) return;

        var groups = this.getGroups(), self = this;
        groups && Ext.each(groups, function ( group ) {
            var groupCheck = Ext.DomQuery.selectNode('.x-grid-group-hd .x-grid-grouping-checkbox', group);
            if ( !groupCheck || groupCheck._items ) return;

            var groupItems = Ext.DomQuery.select('.x-grid-group-body .x-grid3-row', group);
            var itemChecks = [];
            var groupChecked = true;
            Ext.each(groupItems, function (row) {
                var itemCheck = Ext.DomQuery.selectNode(
                    'td:nth(' + (self.checkboxFieldIndex + 1) + ')' +
                    ' :any(.x-grid3-check-col|.x-grid3-check-col-on)', row);
                if ( !itemCheck ) return;

                itemCheck._group = groupCheck;
                itemCheck._rowIndex = row.__rowIndex;

                itemChecks.push(itemCheck);
                groupChecked = groupChecked && Ext.get(itemCheck).hasClass('x-grid3-check-col-on');
            },this);

            groupCheck._items = itemChecks;
            this.applyCheck(groupCheck, groupChecked);
        },this);
    },

    applyCheck: function ( el, checked ) {
        el && Ext.get(el).removeClass('x-grid3-check-col').removeClass('x-grid3-check-col-on')
                     .addClass(checked ? 'x-grid3-check-col-on' : 'x-grid3-check-col');
    },

    echoGroupCheckByItemCheck: function ( itemCheck ) {
        var groupCheck = itemCheck._group;
        if ( !groupCheck ) return;

        var itemChecks = groupCheck._items;
        if ( !itemChecks ) return;

        var groupChecked = true;
        Ext.each(itemChecks, function (itemChk) {
            if ( !Ext.get(itemChk).hasClass('x-grid3-check-col-on') ) {
                groupChecked = false;
                return false;
            }
        } );

        this.applyCheck(groupCheck, groupChecked);
    },

    // private
    interceptMouse: function ( e ){
        if ( this.checkboxFieldIndex >= 0 && e.getTarget('.x-grid-grouping-checkbox', this.mainBody) ) {
            return;
        }

        yigo.grid.CheckGroupingView.superclass.interceptMouse.call(this, e);
    },

    onClick: function (e, t) {
        yigo.grid.CheckGroupingView.superclass.onClick.call(this, e, t);

        if ( this.groupFieldIndex < 0 || this.checkboxFieldIndex < 0 ) return;

        if ( Ext.get(t).hasClass('x-grid3-cc-inner') ) { // 处理： 组员取消选择， 组头也取消选择
            var uiRowIndex = this.findRowIndex(t);
            if ( uiRowIndex === false ) {
                e.stopEvent();
                return;
            }
            var colIndex = this.findCellIndex(t),
                record = this.grid.store[uiRowIndex],
                cell = this.grid.cellModel[uiRowIndex][colIndex];

            if(!(cell.__isCheckBox && cell.__extraEnable)) return;

            var itemCheck = e.getTarget(':any(.x-grid3-check-col|.x-grid3-check-col-on)', this.mainBody);
            if ( itemCheck ) {
                if ( !record[colIndex] ) {
                    this.applyCheck(itemCheck._group, false);
                } else {
                    this.echoGroupCheckByItemCheck(itemCheck);
                }
            }
        }

        var groupCheck = e.getTarget('.x-grid-grouping-checkbox', this.mainBody);
        if ( groupCheck ) {    // 处理： 选择组，组员就全部选择
            this.setCheckBoxTdCls(groupCheck);
            var chkEl = Ext.get(groupCheck),
                groupChecked = chkEl.hasClass('x-grid3-check-col-on');

            var itemChecks = groupCheck._items;

            itemChecks && Ext.each(itemChecks, function ( itemCheck ) {
                var uiRowIndex = itemCheck._rowIndex;
                var cell = this.grid.cellModel[uiRowIndex][this.checkboxFieldIndex];

                this.applyCheck(itemCheck, groupChecked);

                this.grid.store[uiRowIndex][this.checkboxFieldIndex] = groupChecked;

                //if ( !cell.__isCommitSetValue ) {
                    this.echoGroupCheckByItemCheck(itemCheck);
                //}

                MAP_BillContext.appendSetDtlValue(
                    this.grid.__gridIndex,
                    this.midRowIndexOf(uiRowIndex),
                    this.checkboxFieldIndex,
                    groupChecked,
                    //cell.__isCommitSetValue
                    false
                );
                this.lastSelectCheckboxMsg.row = uiRowIndex;   // TODO: refresh  应该重置吗？
                this.lastSelectCheckboxMsg.selectStatus = groupChecked;

            }, this);
        }
    }
});
// private
yigo.grid.CheckGroupingView.GROUP_ID = 1000;