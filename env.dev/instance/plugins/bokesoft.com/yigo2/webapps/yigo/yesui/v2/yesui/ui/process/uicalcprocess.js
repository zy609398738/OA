/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
 var YIUI = YIUI || {};
(function () {
    YIUI.UICalcProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        init:function (form) {
            this.base(form);
        },

        calcAlling: false,

        calcAll:function (commitValue) {
            this.calcAlling = true;
            var items = this.calcTree.items;
            switch (this.form.operationState){
            case YIUI.Form_OperationState.New:
                this.calcAllItems(true,items,commitValue);
                break;
            case YIUI.Form_OperationState.Edit:
            case YIUI.Form_OperationState.Default:
                this.calcAllItems(false,items,commitValue);
                break;
            default:
                break;
            }
            this.calcAlling = false;
            var gm = this.form.getGridInfoMap(),grid;
            for( var i = 0,size = gm.length;i < size;i++ ) {
                grid = this.form.getComponent(gm[i].key);
                YIUI.GridSumUtil.evalSum(this.form,grid);
            }
            this.form.removeSysExpVals("IgnoreKeys");
        },

        calcAllItems:function (calcAll,items,commitValue) {
            var ctx = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,component;exp = items[i];i++ ) {
                component = this.form.getComponent(exp.source);
                if( !component || component.isSubDetail )
                    continue;
                switch (exp.objectType) {
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,exp,ctx,calcAll);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,ctx,this.initTree(exp),calcAll,commitValue);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(component,ctx,this.initTree(exp),calcAll);
                        break;
                    }
                }
            }
        },

        calcHeadItem:function (component,item,context,calcAll) {
            if( (!item.defaultValue && !item.formulaValue) || !item.target )
                return;
            if( component.type == YIUI.CONTROLTYPE.GRID ){
                var loc = this.form.getCellLocation(item.target),
                    metaCell = component.getMetaCellByKey(item.target);
                if( !this.needCalc_Cell(metaCell,calcAll) )
                    return;
                var result = this.calcFormulaValue(item,context);
                component.setValueAt(loc.row,item.pos.index,result,true,false);
            } else {
                if( !this.needCalc_Com(component,calcAll) )
                    return;
                if(component.needClean() || !component.isInitValue()){
                    var result = this.calcFormulaValue(item,context);
                    if( result != null ) {
                        component.setValue(result,true,false);
                    }
                }
            }
        },

        calcListView:function (listView,context,item,calcAll) {
            for( var i = 0,count = listView.getRowCount();i < count;i++ ) {
                context.rowIndex = i;
                this.impl_calcListViewRow(listView,context,i,item,calcAll);
            }
        },

        impl_calcListViewRow:function (listView,context,rowIndex,item,calcAll) {
            if( !item.items )
                return;
            var columnInfo,result;
            for( var i = 0,exp;exp = item.items[i];i++ ) {
                if( (!exp.defaultValue && !exp.formulaValue) || !exp.target )
                    continue;
                columnInfo = listView.getColumnInfo(exp.target);
                if( !this.needCalc_listView(columnInfo,calcAll) )
                    continue;
                result = this.calcFormulaValue(exp,context);
                if( result != null ) {
                    listView.setValByKey(rowIndex,exp.target,result,true,false);
                }
            }
        },

        calcGrid:function (grid,context,item,calcAll,commitValue) {
            for( var i = 0,rowData,count = grid.getRowCount();i < count;i++ ) {
                rowData = grid.getRowDataAt(i);
                if( !rowData.isDetail )
                    continue;
                context.rowIndex = i;
                this.impl_calcGridRow(grid,context,i,item,calcAll,commitValue);
            }
        },

        impl_calcGridRow:function (grid,context,rowIndex,item,calcAll,commitValue) {
            if( !item.items || rowIndex == -1 )
                return;
            var exp,pos,rowData,metaCell,result;
            for( var i = 0;(exp = item.items[i]) && (pos = exp.pos);i++ ) {
                if( (!exp.defaultValue && !exp.formulaValue) || !exp.target )
                    continue;
                rowData = grid.getRowDataAt(rowIndex);
                metaCell = grid.getMetaCellByKey(exp.target);
                commitValue = (YIUI.GridUtil.isEmptyRow(rowData) ? false : commitValue);
                if( pos.columnExpand ) {
                    if( !this.needCalc_Cell(metaCell,calcAll) )
                        continue;
                    for( var c = 0,length = pos.indexes.length;c < length;c++ ) {
                        context.colIndex = pos.indexes[c];
                        result = this.calcFormulaValue(exp,context);
                        grid.setValueAt(rowIndex,pos.indexes[c],result,commitValue,false);
                    }
                } else {
                    if( !this.needCalc_Cell(metaCell,calcAll) )
                        continue;
                    result = this.calcFormulaValue(exp,context);
                    grid.setValueAt(rowIndex,pos.index,result,commitValue,false);

					if( !commitValue && pos.index == grid.selectFieldIndex) {
                        grid.gridHandler.selectRow(this.form, grid, rowIndex, pos.index, result);
					}
                }
            }
        },

        calcGridRow:function (grid,rowIndex,calcAll,commitValue) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,rowIndex,-1);
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType !== YIUI.ExprItem_Type.Set || exp.source !== grid.key )
                    continue;
                this.impl_calcGridRow(grid,context,rowIndex,exp,calcAll,commitValue);
            }
        },

        needCalc_Cell:function(metaCell,calcAll){
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            if( ignoreKeys ) {
                return !metaCell.columnKey || $.inArray(metaCell.key,ignoreKeys) == -1;
            }
            return calcAll ? true : !metaCell.columnKey;
        },

        needCalc_Com:function (component,calcAll) {
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            var hasDataBinding = component.isSubDetail ? (component.hasDataBinding() ||
                !component.bindingCellKey ) : component.hasDataBinding();
            if( ignoreKeys ) {
                return !hasDataBinding || $.inArray(component.key,ignoreKeys) == -1;
            }
            return calcAll ? true : !hasDataBinding;
        },

        needCalc_listView:function (columnInfo,calcAll) {
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            if( ignoreKeys ) {
                return !columnInfo.columnKey || $.inArray(columnInfo.key,ignoreKeys) == -1;
            }
            return calcAll ? true : !columnInfo.columnKey;
        },

        doAfterInsertRow:function (component,rowIndex,emptyRow) {
            if( component.type === YIUI.CONTROLTYPE.GRID ) {
                this.calcGridRow(component,rowIndex,emptyRow,false);
            } else {
                this.calcListViewRow(component,rowIndex,true);
            }
        },

        calcListViewRow:function (listView,rowIndex,calcAll) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,rowIndex,-1);
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType !== YIUI.ExprItem_Type.Set || exp.source !== listView.key )
                    continue;
                this.impl_calcListViewRow(listView,context,rowIndex,exp,calcAll);
            }
        },

        valueChanged:function (com) {
            var affectItems = this.calcTree.affectItems,items;
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === com.key ) {
                    items = affectItems[i];
                    break;
                }
            }
            if( !items )
                return;
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items.expItems[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com )
                    continue;
                switch (exp.objectType) {
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,exp,context,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (com.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(com,context,this.initTree(exp),true,true);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(com,context,this.initTree(exp),true);
                        break;
                    }
                }
            }
        },

        reCalcComponent:function (component) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType != YIUI.ExprItem_Type.Set || exp.source !== component.key )
                    continue;
                switch (component.type) {
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(component,context,this.initTree(exp),false,false);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(component,context,this.initTree(exp),false);
                    break;
                }
            }
            if( component.type === YIUI.CONTROLTYPE.GRID ) {
                YIUI.GridSumUtil.evalSum(this.form,component);
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var affectItems = this.calcTree.affectItems,items,
                rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex];
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === cellKey ) {
                    items = affectItems[i];
                    break;
                }
            }
            if( !items )
                return;
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items.expItems[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,exp,context,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( com.key === grid.key ) {
                        context.rowIndex = rowIndex;
                        this.impl_calcGridRow(com,context,rowIndex,exp,true,true);
                    } else if ( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.impl_calcGridRow(com,context,com.getFocusRowIndex(),exp,true,true);
                    } else {
                        this.calcGrid(com,context,this.initTree(exp),true,true);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var metaRow = grid.getDetailMetaRow(),
                affectItems = this.calcTree.affectItems,items = [],metaCell;
            for( var i = 0;metaCell = metaRow.cells[i];i++ ) {
                for( var j = 0,length = affectItems.length;j < length;j++ ) {
                    if( affectItems[j].key === metaCell.key ) {
                        items.push(affectItems[j].expItems);
                    }
                }
            }
            if( items.length === 0 )
                return;
            items.sort(function (item1, item2) {
                return parseInt(item1.order) - parseInt(item2.order);
            });
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,exp,context,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.impl_calcGridRow(com,context,com.getFocusRowIndex(),exp,true,true);
                    }
                    break;
                }
            }
        },

        calcSubDetail:function (gridKey,calcAll) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,exp,context,calcAll);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (com.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(com,context,this.initTree(exp),calcAll,false);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(com,context,this.initTree(exp),calcAll);
                        break;
                    }
                    break;
                }
            }
        }
    });
})();