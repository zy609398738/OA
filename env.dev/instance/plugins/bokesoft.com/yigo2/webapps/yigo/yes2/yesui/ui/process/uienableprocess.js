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

        // defaultValue  TODO
        calcHeadItem:function (component,item,defaultValue,calcBindCell) {

            var tgtComponent = this.form.getComponent(item.source);

            // 固定行单元格
            if( component.type == YIUI.CONTROLTYPE.GRID && !tgtComponent ) {
                var fixRowInfo = component.getFixRowInfoByCellKey(item.target);

                var cellLocation = this.form.getCellLocation(item.target);
                var context = this.newContext(this.form,cellLocation.row,-1);

                var accessControl = YIUI.UIUtils.checkAccessControl(this.form,context,item.target);

                var enable = this.calcEnable(item,context,this.getFormEnable(),accessControl);

                component.setCellEnable(cellLocation.row,item.target,enable);

            } else {
                var context = this.newContext(this.form,-1,-1);

                var accessControl = YIUI.UIUtils.checkAccessControl(this.form,context,item.target);

                var enable = this.calcEnable(item,context,this.getFormEnable(),accessControl);

                component.setEnable(enable);
            }

        },

        calcGrid: function (grid,item,formEnable,calcSubDetails) {

            this.calcGridColumns(this.newContext(this.form,-1,-1),grid,item,this.getFormEnable());

            this.calcGridRows(this.newContext(this.form,-1,-1),grid,item,this.getFormEnable(),calcSubDetails);

            // 计算全选按钮,如果是新增,el没有,在reloadGrid中计算
            grid.checkSelectAll();
        },

        calcGridColumns:function (context,grid,item,formEnable) {
            var items = item.items;
            if( !items )
                return;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].type == this.EnableItemType.Column ) {
                    var enable = this.calcEnable(items[i],this.newContext(this.form,-1,-1),this.getFormEnable(),true);
                    var pos = items[i].pos;
                    if( pos.columnExpand ) {
                        for( var i = 0,size = pos.indexes.length;i < size;i++ ) {
                            grid.setColumnEnable(pos.indexes[i],enable);
                        }
                    } else {
                        grid.setColumnEnable(pos.index,enable);
                    }
                }
            }
        },

        calcGridRows:function (context,grid,item,formEnable,calcSubDetails) {
            var items = item.items;
            if( !items )
                return;
            for( var i = 0,size = grid.getRowCount(); i < size;i++ ) {
                if (!grid.getRowDataAt(i).isDetail)
                    continue;
                context.rowIndex = i;
                this.impl_calcGridRow(context,grid,i,item,formEnable,calcSubDetails);
            }
        },

        impl_calcGridRow:function (context,grid,rowIndex,item,formEnable,calcSubDetails) {
            if( rowIndex == -1 )
                return;
            for( var i = 0,size = item.items.length;i < size;i++ ){

                var exp = item.items[i];

                if( exp.type != this.EnableItemType.List )
                    continue;

                var accessControl = YIUI.UIUtils.checkAccessControl(this.form,context,exp.target);

                var enable = this.calcEnable(exp,context,formEnable,accessControl);

                if( exp.pos.columnExpand ) {
                    for( var c = 0,length = exp.pos.indexes.length;c < length;c++ ) {
                        grid.setCellEnable(rowIndex,exp.pos.indexes[c],enable);
                    }
                } else {
                    grid.setCellEnable(rowIndex,exp.pos.index,enable);
                }

                // 反向计算子明细组件
                if( calcSubDetails && grid.getFocusRowIndex() != -1 ) {
                    var subDetails = this.form.getCellSubDtlComps(grid.key,exp.target);
                    if( subDetails ) {
                        for( var i = 0,size = subDetails.length;i < size;i++ ) {
                            subDetails[i].setEnable(enable);
                        }
                    }
                }

            }
        },

        calcListViewColumns:function (listView,item,formEnable) {
            var items = item.items;
            if( !items )
                return;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].type != this.EnableItemType.Column )
                    continue;
                var enable = this.calcEnable(items[i],this.newContext(this.form,-1,-1),formEnable,true);
                listView.setColumnEnable(items[i].target,enable);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.form.dependency.enableTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var component = this.form.getComponent(items[i].source);
                if( !component || !YIUI.SubDetailUtil.isSubDetail(this.form, component, gridKey))
                    continue;
                switch (items[i].objectType){
                case YIUI.ExprItem_Type.Item:
                    var cell = YIUI.SubDetailUtil.getBindingCellData(this.form,component);
                    this.calcHeadItem(component,items[i],cell ? cell[2] : this.getFormEnable(),false);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,this.initTree(items[i]),this.getFormEnable(),false);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListViewColumns(component,this.initTree(items[i]),this.getFormEnable());
                        break;
                    default:
                        break;
                    }
                }
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex);
            var cellKey = rowData.cellKeys[colIndex];
            var context = this.newContext(this.form,rowIndex,colIndex);

            this.impl_ValueChanged(grid,context,rowIndex,cellKey);
        },

        valueChanged:function (com) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var affectItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                if( affectItems[i].key === com.key ){
                    affectItem = affectItems[i];
                    break;
                }
            }
            if( affectItem ) {
                for( var i = 0,size = affectItem.expItems.length;i < size;i++ ) {
                    var exp = affectItem.expItems[i];
                    var com = this.form.getComponent(exp.source);
                    switch (exp.objectType){
                    case YIUI.ExprItem_Type.Item:
                        if( exp.type == this.EnableItemType.Operation ) {
                            this.form.setOperationEnable(exp.target,this.form.eval(exp.content, this.newContext(this.form,-1,-1), null));
                        } else {
                            this.calcHeadItem(com,exp,this.getFormEnable(),true);
                        }
                        break;
                    case YIUI.ExprItem_Type.Set:
                        switch (com.type) {
                        case YIUI.CONTROLTYPE.GRID:
                            this.calcGrid(com,this.initTree(exp),this.getFormEnable(),true);
                            break;
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.calcListViewColumns(com,this.initTree(exp),this.getFormEnable());
                            break;
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        },

        impl_ValueChanged:function (grid,context,rowIndex,cellKey) {
            var affectItems = this.form.dependency.enableTree.affectItems;
            var affectItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                if( affectItems[i].key === cellKey ){
                    affectItem = affectItems[i];
                    break;
                }
            }
            if( affectItem ) {
                for( var i = 0,size = affectItem.expItems.length;i < size;i++ ) {
                    var exp = affectItem.expItems[i];

                    var component = this.form.getComponent(exp.source);
                    if( !component )
                        continue;

                    switch ( exp.objectType ){
                    case YIUI.ExprItem_Type.Item:
                        this.calcHeadItem(component,exp,this.getFormEnable(),true);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        // 当前表格内计算
                        var calcInGrid = grid.key === component.key && cellKey.indexOf(":RowIndex") == -1;
                        // 计算父表格
                        var calcParGrid = YIUI.SubDetailUtil.isSubDetail(this.form,grid,component.key);

                        if( calcInGrid ) {
                            this.impl_calcGridRow(context,grid,rowIndex,exp,this.getFormEnable(),true);
                        } else if ( calcParGrid ) {
                            this.impl_calcGridRow(this.newContext(this.form,-1,-1),component,component.getFocusRowIndex(),exp,this.getFormEnable(),true);
                        } else {
                            this.calcGrid(component,exp,this.getFormEnable(),true);
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        },

        doAfterDeleteRow:function (grid) {
            var ctx = this.newContext(this.form,-1,-1);

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowIndex");
        },

        doAfterInsertRow:function (component,rowIndex) {
            if( component.type != YIUI.CONTROLTYPE.GRID )
                return;
            this.calcGridRow(component,rowIndex);
        },

        calcGridRow:function (grid,rowIndex) {
            var ctx = this.newContext(this.form,rowIndex,-1);
            var items = this.form.dependency.enableTree.items;

            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType != YIUI.ExprItem_Type.Set || items[i].source != grid.key )
                    continue;
                this.impl_calcGridRow(ctx,grid,rowIndex,items[i],this.getFormEnable(),false);
            }

            // 计算行数改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowCount");

            // 计算行号改变的影响
            this.impl_ValueChanged(grid,ctx,-1,grid.key + ":RowIndex");
        },

        reCalcComponent:function (component) {
            var items = this.form.dependency.enableTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType != YIUI.ExprItem_Type.Set )
                    continue;
                if( items[i].source !== component.key )
                    continue;
               switch (component.type){
               case YIUI.CONTROLTYPE.GRID:
                   this.calcGrid(component,items[i],this.getFormEnable(),false);
                   break;
               case YIUI.CONTROLTYPE.LISTVIEW:
                   this.calcListViewColumns(component,items[i],this.getFormEnable());
                   break;
               }
            }
        },
        
        calcAll:function () {
            var items = this.form.dependency.enableTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.source);
                if( !component || component.getMetaObj().isSubDetail )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,exp,this.getFormEnable(),false);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,exp,this.getFormEnable(),false);
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListViewColumns(component,exp,this.getFormEnable());
                        break;
                    }
                    break;
                }
            }
        }
    });
})();