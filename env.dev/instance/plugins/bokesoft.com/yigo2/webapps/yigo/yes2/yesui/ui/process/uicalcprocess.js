/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
 var YIUI = YIUI || {};
(function () {
    YIUI.UICalcProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        init:function (form) {
            this.base(form);
        },

        /*
            这里要处理下推忽略的集合
         */
        calcAll:function (commitValue) {
            switch (this.form.operationState){
            case YIUI.Form_OperationState.New:
                this.calcAllItems(true,commitValue);
                break;
            case YIUI.Form_OperationState.Edit:
            case YIUI.Form_OperationState.Default:
                this.calcAllItems(false,commitValue);
                break;
            default:
                break;
            }
        },

        calcAllItems:function (calcAll,commitValue) {
            var items = this.form.dependency.calcTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.source);
                if( !component )
                    continue;
                switch (exp.objectType) {
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,exp,this.newContext(this.form,-1,-1),calcAll);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,this.newContext(this.form,-1,-1),this.initTree(exp),calcAll,commitValue);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(component,this.newContext(this.form,-1,-1),this.initTree(exp),calcAll);
                        break;
                    }
                }
            }
            // 计算所有表格的汇总
            var gm = this.form.getGridInfoMap();
            for( var i = 0,size = gm.length;i < size;i++ ) {
                var grid = this.form.getComponent(gm[i].key);
                YIUI.GridSumUtil.evalSum(this.form,grid);
            }
        },

        calcHeadItem:function (component,item,context,calcAll) {
            if( (!item.defaultValue && !item.formulaValue) || !item.target )
                return;
            if( component.type == YIUI.CONTROLTYPE.GRID ){
                var cellLocation = this.form.getCellLocation(item.target);
                var metaCell = component.getMetaCellByKey(item.target);
                if( !this.needCalc_Cell(metaCell,calcAll) )
                    return;
                var result = this.calcFormulaValue(item,context);
                var pos = item.pos;
                if( pos.columnExpand ) {
                    for(var i = 0,length = pos.indexes.length;i < length;i++){
                        component.setValueAt(cellLocation.row,pos.indexes[i],result,true,false,true);
                    }
                } else {
                    component.setValueAt(cellLocation.row,pos.index,result,true,false,true);
                }
            } else {
                if( !this.needCalc_Com(component,calcAll) )
                    return;
                var result = this.calcFormulaValue(item,context);
                if( result != null ) {
                    component.setValue(result,true,false);
                }
            }
        },

        calcListView:function (listView,context,item,calcAll) {
            for( var i = 0,count = listView.getRowCount();i < count;i++ ) {
                this.impl_calcListViewRow(listView,this.newContext(this.form,i,-1),i,item,calcAll);
            }
        },

        impl_calcListViewRow:function (listView,context,rowIndex,item,calcAll) {
            var items = item.items;
            if( !items )
                return;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                if( (!exp.defaultValue && !exp.formulaValue) || !exp.target )
                    continue;
                var columnInfo = listView.getColumnInfo(exp.target);
                if( !this.needCalc_listView(columnInfo,calcAll) )
                    continue;
                var result = this.calcFormulaValue(exp,context);
                if( result ) {

                    // listview的默认值  设置 有问题 无法获取caption

                    listView.setValByKey(rowIndex,exp.target,result,true,false);
                }
            }
        },

        calcGrid:function (grid,context,item,calcAll,commitValue) {
            for( var i = 0,count = grid.getRowCount();i < count;i++ ) {
                var rowData = grid.getRowDataAt(i);
                if( !rowData.isDetail )
                    continue;
                this.impl_calcGridRow(grid,this.newContext(this.form,i,-1),i,item,calcAll,commitValue);
            }
        },

        impl_calcGridRow:function (grid,context,rowIndex,item,calcAll,commitValue) {
            var items = item.items;
            if( !items || rowIndex == -1 )
                return;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                if( (!exp.defaultValue && !exp.formulaValue) || !exp.target )
                    continue;
                var rowData = grid.getRowDataAt(rowIndex);
                var pos = exp.pos;
                if( pos.columnExpand ) {
                    var metaCell = grid.getMetaCellByKey(exp.target);
                    if( !this.needCalc_Cell(metaCell,calcAll) )
                        continue;
                    var result = this.calcFormulaValue(exp,this.newContext(this.form,rowIndex,-1));
                    for( var c = 0,length = pos.indexes.length;c < length;i++ ) {
                        if( rowData.bookmark == null ) {
                            grid.setValueAt(rowIndex,pos.indexes[c],result,false,false,true);
                        } else {
                            grid.setValueAt(rowIndex,pos.indexes[c],result,commitValue,false,true);
                        }
                    }
                } else {
                    var metaCell = grid.getMetaCellByKey(exp.target);
                    if( !this.needCalc_Cell(metaCell,calcAll) )
                        continue;
                    var result = this.calcFormulaValue(exp,this.newContext(this.form,rowIndex,-1));
                    if( rowData.bookmark == null ) {
                        grid.setValueAt(rowIndex,pos.index,result,false,false,true);
                    } else {
                        grid.setValueAt(rowIndex,pos.index,result,commitValue,false,true);
                    }
                    
                    // 处理选择字段的默认值
					if( !commitValue && pos.index == grid.selectFieldIndex) {
                        grid.gridHandler.selectRow(this.form, grid, rowIndex, pos.index, result);
					}
                }
            }
        },

        calcGridRow:function (grid,rowIndex,emptyRow) {
           if( emptyRow ) {
               this.doCalcGridRow(grid,rowIndex,true,false);// 全部计算,不提交值
           } else {
               this.doCalcGridRow(grid,rowIndex,false,false);// 只计算没有数据绑定的,提交值无用
           }
        },

        doCalcGridRow:function (grid,rowIndex,calcAll,commitValue) {
            var items = this.form.dependency.calcTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                if( exp.objectType === YIUI.ExprItem_Type.Set && exp.source === grid.key ){
                    this.impl_calcGridRow(grid,this.newContext(this.form,rowIndex,-1),rowIndex,exp,calcAll,commitValue);
                }
            }
        },

        needCalc_Cell:function(metaCell,calcAll){
            return calcAll ? true : !metaCell.columnKey;
        },

        needCalc_Com:function (component,calcAll) {
            if( !calcAll ){
                return !(component.tableKey && component.columnKey) && !component.bindingCellKey;
            }
            return true;
        },

        needCalc_listView:function (columnInfo,calcAll) {
            return calcAll ? true : !columnInfo.columnKey;
        },

        doAfterInsertRow:function (component,rowIndex,emptyRow) {
            if( component.type === YIUI.CONTROLTYPE.GRID ) {
                this.calcGridRow(component,rowIndex,emptyRow);
            } else {
                this.calcListViewRow(component,rowIndex,true);
            }
        },

        calcListViewRow:function (listView,rowIndex,calcAll) {
            var items = this.form.dependency.calcTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                if( exp.objectType === YIUI.ExprItem_Type.Set && exp.source === listView.key ){
                    this.impl_calcListViewRow(listView,this.newContext(this.form,rowIndex,-1),rowIndex,exp,calcAll);
                }
            }
        },

        valueChanged:function (com) {
            var affectItems = this.form.dependency.calcTree.affectItems;
            var items = null;
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === com.key ) {
                    items = affectItems[i];
                    break;
                }
            }
            if( items ) {
                for( var i = 0,size = items.expItems.length;i < size;i++ ) {
                    var exp = items.expItems[i];
                    var component = this.form.getComponent(exp.source);
                    if( !component )
                        continue;
                    switch (exp.objectType) {
                    case YIUI.ExprItem_Type.Item:
                        this.calcHeadItem(component,exp,this.newContext(this.form,-1,-1),true);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        switch (component.type){
                        case YIUI.CONTROLTYPE.GRID:
                            this.calcGrid(component,this.newContext(this.form,-1,-1),this.initTree(exp),true,true);
                            break;
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.calcListView(component,this.newContext(this.form,-1,-1),this.initTree(exp),true);
                            break;
                        }
                    }
                }
            }
        },

        reCalcComponent:function (component) {
            var items = this.form.dependency.calcTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType != YIUI.ExprItem_Type.Set )
                    continue;
                if( items[i].source !== component.key )
                    continue;
                switch (component.type) {
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(component,this.newContext(this.form,-1,-1),this.initTree(items[i]),false,false)
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(component,this.newContext(this.form,-1,-1),this.initTree(items[i]),false);
                    break;
                }
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var affectItems = this.form.dependency.calcTree.affectItems;
            var rowData = grid.getRowDataAt(rowIndex);
            var cellKey = rowData.cellKeys[colIndex];
            var items = null;
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === cellKey ) {
                    items = affectItems[i];
                    break;
                }
            }
            if( items ) {
                for( var i = 0,size = items.expItems.length;i < size;i++ ) {
                    var exp = items.expItems[i];
                    var component = this.form.getComponent(exp.source);
                    if( !component )
                        continue;
                    switch (exp.objectType){
                    case YIUI.ExprItem_Type.Item:
                        this.calcHeadItem(component,exp,this.newContext(this.form,-1,-1),true);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        var calcInGrid = component.key === grid.key;
                        var calcParGrid = YIUI.SubDetailUtil.isSubDetail(this.form,grid,component.key);
                        if( calcInGrid ) {
                            this.impl_calcGridRow(component,this.newContext(this.form,rowIndex,-1),rowIndex,exp,true,true);
                        } else if ( calcParGrid ) {
                            this.impl_calcGridRow(component,this.newContext(this.form,-1,-1),component.getFocusRowIndex(),exp,true,true);
                        } else {
                            this.calcGrid(component,this.newContext(this.form,-1,-1),this.initTree(exp),true,true);
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var metaRow = grid.getDetailMetaRow();

            var items = [];
            for( var i = 0,size = metaRow.cells.length;i < size;i++ ) {
                var metaCell = metaRow.cells[i];
                var affectItems = this.form.dependency.calcTree.affectItems;
                for( var j = 0,length = affectItems.length;j < length;j++ ) {
                    if( affectItems[j].key === metaCell.key ) {
                        items.push(affectItems[j].expItems);
                    }
                }
            }
            items.sort(function (item1, item2) {
                return parseInt(item1.order) - parseInt(item2.order);
            });
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.target);
                if( !component )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,exp,this.newContext(this.form,-1,-1),true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,grid,component.key) ) {
                        this.impl_calcGridRow(component,this.newContext(this.form,-1,-1),component.getFocusRowIndex(),exp,true,true);
                    }
                    break;
                }
            }
        },

        // 表格汇总没加--一般不会在子明细添加汇总
        calcSubDetail:function (grid,calcAll) {
            var items = this.form.dependency.calcTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.target);
                if( !component || !YIUI.SubDetailUtil.isSubDetail(this.form,component,grid.key) )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,exp,this.newContext(this.form,-1,-1),calcAll);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,this.newContext(this.form,-1,-1),this.initTree(exp),calcAll,false);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(component,this.newContext(this.form,-1,-1),this.initTree(exp),calcAll);
                        break;
                    }
                    break;
                }
            }
        }

    });
})();