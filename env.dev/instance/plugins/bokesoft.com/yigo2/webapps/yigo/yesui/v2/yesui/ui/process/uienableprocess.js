/**
 * Created by 陈瑞 on 2017/3/2 use WebStorm.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.UIEnableProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        EnableItemType:{Head: 0,
                        List: 1,
                        Column: 2,
                        Operation: 3},

        init:function (form) {
            this.base(form);
        },

        calcAll:function () {
            var items = this.enableTree.items;
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || exp.type == this.EnableItemType.Operation )
                    continue;

                this.calcExprItemObject(com,exp,false);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.enableTree.items;
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form, com, gridKey) || exp.type == this.EnableItemType.Operation )
                    continue;

                this.calcExprItemObject(com,exp,false);
            }
        },

        calcExprItemObject: function (com,item,fireEvent) {
            switch (item.objectType){
            case YIUI.ExprItem_Type.Item:
                if( item.type == this.EnableItemType.Operation ) {
                    this.form.setOperationEnable(item.target,this.form.eval(item.content,this.newContext(this.form,-1,-1),null));
                } else {
                    this.calcHeadItem(com,item,fireEvent);
                }
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,this.initTree(item),fireEvent);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,this.initTree(item));
                    break;
                }
                break;
            }
        },

        calcHeadItem:function (com,item,calcBindCell) {
            if( com.type == YIUI.CONTROLTYPE.GRID && item.source !== item.target ) {
                var loc = this.form.getCellLocation(item.target);
                if( !loc )
                    return;
                var context = this.newContext(this.form,loc.row,-1),
                    access = YIUI.ViewUtil.checkCellAccessControl(this.form,com,loc.row,item.target);

                com.setCellEnable(loc.row,item.pos.index,this.calcEnable(item,context,this.getFormEnable(),access));
            } else {
                var context = this.newContext(this.form,-1,-1),
                    access = YIUI.ViewUtil.checkComAccessControl(this.form,com);

                var defaultValue = this.getFormEnable();
                if( com.isSubDetail ) {
                    var cell = YIUI.SubDetailUtil.getBindingCellData(this.form,com);
                    if( cell ) {
                        defaultValue = cell[2];
                    }
                }
                com.setEnable(this.calcEnable(item,context,defaultValue,access));

                if( calcBindCell && com.isSubDetail && com.bindingCellKey ) {
                    var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,com);
                    if( grid.getFocusRowIndex() != -1 ) {
                        var colIndex = grid.getCellIndexByKey(com.bindingCellKey);
                        grid.setCellEnable(grid.getFocusRowIndex(),colIndex,com.isEnable());
                    }
                }
            }
        },

        calcGrid: function (grid,item,calcSubDetails) {
            var context = this.newContext(this.form,-1,-1);
            this.calcGridRows(context,grid,item,calcSubDetails);
        },

        calcGridRows:function (context,grid,item,calcSubDetails) {
            if( !item.items )
                return;
            var rowData;
            for( var i = 0,size = grid.getRowCount(); i < size;i++ ) {

                rowData = grid.getRowDataAt(i);

                if( rowData.rowType === 'Fix' )
                    continue;

                context.rowIndex = i;

                if( rowData.rowType === 'Detail' ) {

                    this.impl_calcGridRow(context,grid,i,item,calcSubDetails);

                } else {

                    var metaRow = grid.getMetaObj().rows[rowData.metaRowIndex],
                        metaCell;

                    for( var k = 0,count = metaRow.cells.length;k < count;k++ ) {
                        metaCell = metaRow.cells[k];
                        if( metaCell.cellType !== YIUI.CONTROLTYPE.LABEL ) {
                            grid.setCellEnable(i,k,true);
                        }
                    }
                }
            }
        },

        impl_calcGridRow:function (context,grid,rowIndex,item,calcSubDetails) {
            if( rowIndex == -1 )
                return;
            for( var i = 0,exp,pos;(exp = item.items[i]) && (pos = exp.pos);i++ ){
                if( exp.type != this.EnableItemType.List || !exp.target )
                    continue;
                var access = YIUI.ViewUtil.checkCellAccessControl(this.form,grid,rowIndex,exp.target);
                if( pos.columnExpand ) {
                    for( var c = 0,size = pos.indexes.length;c < size;c++ ) {
                        context.colIndex = pos.indexes[c];
                        enable = this.calcEnable(exp,context,this.getFormEnable(),access);
                        grid.setCellEnable(rowIndex,pos.indexes[c],enable);
                    }
                } else {
                    var enable = this.calcEnable(exp,context,this.getFormEnable(),access);
                    grid.setCellEnable(rowIndex,pos.index,enable);

                    if( calcSubDetails && grid.getFocusRowIndex() != -1 ) {
                        var subDetails = this.form.getCellSubDtlComps(grid.key,exp.target);
                        if( !subDetails )
                            continue;
                        for( var j = 0,length = subDetails.length;j < length;j++ ) {
                            subDetails[j].setEnable(enable);
                        }
                    }
                }
            }
        },

        calcListView:function (listView,item) {
            if( !item.items )
                return;
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp;exp = item.items[i];i++ ) {
                if( exp.type != this.EnableItemType.Column || !exp.target )
                    continue;
                listView.setColumnEnable(exp.target,this.calcEnable(exp,context,this.getFormEnable(),true));
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex],
                context = this.newContext(this.form,rowIndex,colIndex);

            this.impl_ValueChanged(grid,context,rowIndex,cellKey);
        },

        valueChanged:function (comp) {
            var items = this.enableTree.affectItems[comp.key];

            if( !items )
                return;

            var item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com && item.type !== this.EnableItemType.Operation )
                    continue;

                this.calcExprItemObject(com,item,true);
            }
        },

        impl_ValueChanged:function (grid,context,rowIndex,srcKey) {
            var items = this.enableTree.affectItems[srcKey];

            if( !items )
                return;

            var item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com && item.type !== this.EnableItemType.Operation )
                    continue;
                switch ( item.objectType ){
                case YIUI.ExprItem_Type.Item:
                    if( item.type == this.EnableItemType.Operation ) {
                        this.form.setOperationEnable(item.target,this.form.eval(item.content,this.newContext(this.form,-1,-1),null));
                    } else {
                        this.calcHeadItem(com,item,true);
                    }
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( grid.key === com.key && srcKey.indexOf(":RowIndex") == -1 ) {
                        context.rowIndex = rowIndex;
                        this.impl_calcGridRow(context,grid,rowIndex,item,true);
                    } else if ( YIUI.SubDetailUtil.isSubDetail(this.form,grid,com.key) ) {
                        context.rowIndex = com.getFocusRowIndex();
                        this.impl_calcGridRow(context,com,com.getFocusRowIndex(),item,true);
                    } else {
                        this.calcGrid(com,item,true);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var ctx = this.newContext(this.form,-1,-1);

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_RowChanged(grid);
        },

        doAfterInsertRow:function (component,rowIndex) {
            if( component.type != YIUI.CONTROLTYPE.GRID )
                return;
            var context = this.newContext(this.form,rowIndex,-1);
            this.calcGridRow(component,context,rowIndex);
        },

        doAfterRowChanged:function (grid) {
            this.impl_RowChanged(grid);
        },

        impl_RowChanged:function (grid) {
            var detailRow = grid.getDetailMetaRow(),
                item,
                com,
                items;

            if( !detailRow ) {
                return;
            }

            for( var i = 0,length = detailRow.cells.length;i < length;i++ ) {
                items = this.enableTree.affectItems[detailRow.cells[i].key];
                if( items ) {
                    for( var j = 0;item = items[j];j++ ) {
                        com = this.form.getComponent(item.source);
                        if( !com && item.type !== this.EnableItemType.Operation )
                            continue;

                        this.calcExprItemObject(com,item,true);
                    }
                }
            }
        },

        calcGridRow:function (grid,context,rowIndex) {
            var items = this.enableTree.items;
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.objectType !== YIUI.ExprItem_Type.Set || exp.source !== grid.key )
                    continue;

                this.impl_calcGridRow(context,grid,rowIndex,exp,false);
            }

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,context,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_RowChanged(grid);
        },

        reCalcComponent:function (com) {
            var items = this.enableTree.items,
                item;
            for( var i = 0;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

                this.calcExprItemObject(com,item,false);
            }
        }

    });
})();