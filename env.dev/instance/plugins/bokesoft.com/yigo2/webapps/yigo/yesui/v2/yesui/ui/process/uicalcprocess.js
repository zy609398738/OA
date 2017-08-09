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

            this.calcAllItems(this.calcTree.items,this.form.operationState == YIUI.Form_OperationState.New,commitValue);

            this.calcAlling = false;
            var gm = this.form.getGridInfoMap();
            for( var i = 0,size = gm.length;i < size;i++ ) {
                YIUI.GridSumUtil.evalSum(this.form,this.form.getComponent(gm[i].key));
            }
            this.form.removeSysExpVals("IgnoreKeys");
        },

        calcAllItems:function (items,calcAll,commitValue) {
            var ctx = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,component;exp = items[i];i++ ) {
                component = this.form.getComponent(exp.source);
                if( !component || component.isSubDetail )
                    continue;

                this.calcExprItemObject(component,exp,ctx,calcAll,commitValue);
            }
        },

        calcExprItemObject: function (component,exp,ctx,calcAll,commitValue) {
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
        },

        calcHeadItem:function (com,item,context,calcAll) {
            if( (!item.defaultValue && !item.formulaValue) || !item.target )
                return;
            if( com.type == YIUI.CONTROLTYPE.GRID ){
                var loc = this.form.getCellLocation(item.target),
                    metaCell = com.getMetaCellByKey(item.target);
                if( !this.needCalc_Cell(com,loc.row,item.pos.index,metaCell,calcAll) )
                    return;
                com.setValueAt(loc.row,item.pos.index,this.calcFormulaValue(item,context),true,false);
            } else {
                if( !this.needCalc_Com(com,calcAll) )
                    return;
                if( com.needClean() || !com.isInitValue() ) {
                    com.setValue(this.calcFormulaValue(item,context),true,false);
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
                    for( var c = 0,length = pos.indexes.length;c < length;c++ ) {
                        if( !this.needCalc_Cell(grid,rowIndex,pos.indexes[c],metaCell,calcAll) )
                            continue;
                        context.colIndex = pos.indexes[c];
                        result = this.calcFormulaValue(exp,context);
                        grid.setValueAt(rowIndex,pos.indexes[c],result,commitValue,false);
                    }
                } else {
                    if( !this.needCalc_Cell(grid,rowIndex,pos.index,metaCell,calcAll) )
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

        needCalc_Cell:function(grid,ri,ci,metaCell,calcAll){
            if( grid.getValueAt(ri,ci) )
                return false;
            if( !metaCell.columnKey )
                return true;
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            return ignoreKeys ? $.inArray(metaCell.key,ignoreKeys) == -1 : calcAll;
        },

        needCalc_Com:function (com,calcAll) {
            if( !com.isNull() )
                return false;
            if( !(com.isSubDetail ? (com.isDataBinding() ||!com.bindingCellKey ) : com.isDataBinding()) )
                return true;
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            return ignoreKeys ? $.inArray(com.key,ignoreKeys) == -1 : calcAll;
        },

        needCalc_listView:function (columnInfo,calcAll) {
            if( !columnInfo.columnKey )
                return true;
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            return ignoreKeys ? $.inArray(columnInfo.key,ignoreKeys) == -1 : calcAll;
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

                this.calcExprItemObject(com,exp,context,true,true);
            }
        },

        reCalcComponent:function (component) {
            if( component.type === YIUI.CONTROLTYPE.GRID ) {
                this.calcAllItems(this.getGridItem(component),false,false);
            } else {
                this.calcAllItems(this.getListViewItems(component),false,false);
            }
            if( component.type === YIUI.CONTROLTYPE.GRID ) {
                YIUI.GridSumUtil.evalSum(this.form,component);
            }
        },

        getGridItem:function (grid) {
            var metaRow = grid.getDetailMetaRow(),metaCell,
                items = this.calcTree.affectItems,affectItems = [];
            for( var i = 0;metaCell = metaRow.cells[i];i++ ) {
                for( var j = 0,length = items.length;j < length;j++ ) {
                    if( items[j].key === metaCell.key ) {
                        affectItems = affectItems.concat(items[j].expItems);
                    }
                }
            }
            affectItems.sort(function (item1, item2) {
                return parseInt(item1.order) - parseInt(item2.order);
            });
            return affectItems;
        },

        getListViewItems:function (listView) {
            var items = this.calcTree.items,affectItems = [];
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType != YIUI.ExprItem_Type.Set || exp.source !== listView.key )
                    continue;
                affectItems.push(exp);
            }
            return affectItems;
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
            var items = this.getGridItem(grid);

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

        calcSubDetail:function (gridKey) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;

                this.calcExprItemObject(com,exp,context,this.form.operationState == YIUI.Form_OperationState.New,false);
            }
        }
    });
})();