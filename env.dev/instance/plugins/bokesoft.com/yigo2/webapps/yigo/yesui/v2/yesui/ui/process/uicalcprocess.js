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

            var gm = this.form.getGridInfoMap(),grid;
            for( var i = 0,size = gm.length;i < size;i++ ) {
                grid = this.form.getComponent(gm[i].key);

                grid.refreshSelectAll();

                YIUI.GridSumUtil.evalSum(this.form,grid);
            }

            var lvm = this.form.getListViewMap(),listview;
            for( var i = 0,size = lvm.length;i < size;i++ ) {
                listview = this.form.getComponent(lvm[i].key);

                listview.refreshSelectAll();
            }

            this.form.removeSysExpVals("IgnoreKeys");
            this.calcAlling = false;
        },

        calcAllItems:function (items,calcAll,commitValue) {
            var ctx = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || com.isSubDetail )
                    continue;

                this.calcExprItemObject(com,item,ctx,calcAll,commitValue);
            }
        },

        calcExprItemObject: function (com,item,ctx,calcAll,commitValue) {
            switch (item.objectType) {
            case YIUI.ExprItem_Type.Item:
                this.calcHeadItem(com,item,ctx,calcAll);
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,ctx,this.initTree(item),calcAll,commitValue);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,ctx,this.initTree(item),calcAll);
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
                if( this.needCalc_Cell(com,loc.row,item.pos.index,metaCell,calcAll) ) {
                    com.setValueAt(loc.row,item.pos.index,this.calcFormulaValue(item,context),true,false);
                }
            } else {
                if( this.needCalc_Com(com,calcAll) ) {
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
            var columnInfo,
                _item,
                result;
            for( var i = 0;_item = item.items[i];i++ ) {
                if( (!_item.defaultValue && !_item.formulaValue) || !_item.target )
                    continue;
                columnInfo = listView.getColumnInfo(_item.target);
                if( !this.needCalc_listView(columnInfo,calcAll) )
                    continue;
                result = this.calcFormulaValue(_item,context,columnInfo.columnType);
                if( result != null ) {
                    listView.setValByKey(rowIndex,_item.target,result,false);
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
            var _item,
                pos,
                rowData,
                metaCell;
            for( var i = 0;(_item = item.items[i]) && (pos = _item.pos);i++ ) {
                if( (!_item.defaultValue && !_item.formulaValue) || !_item.target )
                    continue;
                rowData = grid.getRowDataAt(rowIndex);
                metaCell = grid.getMetaCellByKey(_item.target);
                commitValue = (YIUI.GridUtil.isEmptyRow(rowData) ? false : commitValue);
                if( pos.columnExpand ) {
                    for( var c = 0,length = pos.indexes.length;c < length;c++ ) {
                        if( !this.needCalc_Cell(grid,rowIndex,pos.indexes[c],metaCell,calcAll) )
                            continue;
                        context.colIndex = pos.indexes[c];
                        grid.setValueAt(rowIndex,pos.indexes[c],this.calcFormulaValue(_item,context),commitValue,false);
                    }
                } else {
                    if( !this.needCalc_Cell(grid,rowIndex,pos.index,metaCell,calcAll) )
                        continue;
                    var result = this.calcFormulaValue(_item,context);
                    grid.setValueAt(rowIndex,pos.index,result,commitValue,false);

					if( !commitValue && pos.index == grid.selectFieldIndex) {
                        grid.gridHandler.selectRow(this.form, grid, rowIndex, pos.index, result);
					}
                }
            }
        },

        calcGridRow:function (grid,rowIndex,calcAll,commitValue) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,rowIndex,-1),
                item;
            for( var i = 0;item = items[i];i++ ) {
                if( item.objectType !== YIUI.ExprItem_Type.Set || item.source !== grid.key )
                    continue;
                this.impl_calcGridRow(grid,context,rowIndex,item,calcAll,commitValue);
            }
        },

        needCalc_Cell:function(grid,ri,ci,metaCell,calcAll){
            if( this.calcAlling && !grid.isNullValue(metaCell.editOptions,grid.getValueAt(ri,ci)) )
                return false;
            if( !metaCell.columnKey )
                return true;
            var ignoreKeys = this.form.getSysExpVals("IgnoreKeys");
            return ignoreKeys ? $.inArray(metaCell.key,ignoreKeys) == -1 : calcAll;
        },

        needCalc_Com:function (com,calcAll) {
            if( this.calcAlling && !com.isNull() )
                return false;
            if( !(com.isSubDetail ? (com.hasDataBinding() || com.bindingCellKey) : com.hasDataBinding()) )
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

        valueChanged:function (comp) {
            var items = this.calcTree.affectItems[comp.key];

            if( !items )
                return;

            var context = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;

                this.calcExprItemObject(com,item,context,true,true);
            }
        },

        reCalcComponent:function (com) {

            this.calcAllItems(this.getGridItems(com),false,false);

            if( com.type === YIUI.CONTROLTYPE.GRID ) {
                YIUI.GridSumUtil.evalSum(this.form,com);
            }

            this.form.removeSysExpVals("IgnoreKeys");
        },

        getGridItems:function (com) {
            var items = this.calcTree.items,
                item,
                _items = [];

            for( var i = 0;item = items[i];i++ ) {
                if( item.source == com.key &&
                    item.objectType == YIUI.ExprItem_Type.Set )
                _items.push(item);
            }

            if( com.type === YIUI.CONTROLTYPE.GRID ) {
                _items = _items.concat(this.getGridAffectItems(com));
            }

            _items.sort(function (o1,o2) {
                return o1.order - o2.order;
            });

            return _items;
        },

        getGridAffectItems:function (grid) {
            var items;
            if( this.calcTree.gridAffectItems ) {
                items = this.calcTree.gridAffectItems[grid.key];
            }

            if( items ) {
                return items;
            }

            items = [];

            if( !this.calcTree.gridAffectItems ) {
                this.calcTree.gridAffectItems = {};
            }

            this.calcTree.gridAffectItems[grid.key] = items;

            var metaRow = grid.getDetailMetaRow();
            if( !metaRow ) {
                return items;
            }

            var cells = metaRow.cells,
                metaCell,
                _items,
                _item,
                affectItems = this.calcTree.affectItems;

            for( var i = 0;metaCell = cells[i];i++ ) {
                _items = affectItems[metaCell.key];
                if( _items ) {
                    for( var k = 0;_item = _items[k];k++ ) {
                        if( _item.source == grid.key &&
                                _item.objectType == YIUI.ExprItem_Type.Set )
                            continue;

                        items.push(_item);
                    }
                }
            }

            items.sort(function (o1,o2) {
                return o1.order - o2.order;
            });

            return items;
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex],
                items = this.calcTree.affectItems[cellKey];

            if( !items )
                return;

            var context = this.newContext(this.form,-1,-1),
                item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;
                switch (item.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,item,context,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( com.key === grid.key ) {
                        context.rowIndex = rowIndex;
                        this.impl_calcGridRow(com,context,rowIndex,item,true,true);
                    } else if ( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.impl_calcGridRow(com,context,com.getFocusRowIndex(),item,true,true);
                    } else {
                        this.calcGrid(com,context,this.initTree(item),true,true);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var items = this.getGridAffectItems(grid);

            var context = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com )
                    continue;
                switch (item.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(com,item,context,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.impl_calcGridRow(com,context,com.getFocusRowIndex(),item,true,true);
                    }
                    break;
                }
            }
            YIUI.GridSumUtil.evalSum(this.form,grid);
        },

        calcSubDetail:function (gridKey) {
            var items = this.calcTree.items,
                context = this.newContext(this.form,-1,-1),
                item,
                com;
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;

                this.calcExprItemObject(com,item,context,this.form.operationState == YIUI.Form_OperationState.New,false);
            }

            var gm = this.form.getGridInfoMap(),
                grid;
            for( var i = 0,size = gm.length;i < size;i++ ) {
                grid = this.form.getComponent(gm[i].key);

                if( !YIUI.SubDetailUtil.isSubDetail(this.form,grid,gridKey))
                    continue;

                YIUI.GridSumUtil.evalSum(this.form,grid);

                grid.refreshSelectAll();
            }
        }
    });
})();