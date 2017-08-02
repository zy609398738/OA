/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
(function () {
    YIUI.UIVisibleProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        VisibleItemType : { Head: 0,
                           Column: 1,
                           Operation: 2 },
        init:function (form) {
            this.base(form);
        },

        calcAll:function () {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || com.isSubDetail || exp.type == this.VisibleItemType.Operation )
                    continue;

                this.calcExprItemObject(com,context,exp);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey)|| exp.type == this.VisibleItemType.Operation );
                    continue;

                this.calcExprItemObject(com,context,exp);
            }
        },

        calcExprItemObject:function (com,ctx,item) {
            switch (item.objectType){
            case YIUI.ExprItem_Type.Item:
                if( item.type == this.VisibleItemType.Operation ) {
                    this.form.setOperationVisible(item.target,this.form.eval(item.content, ctx, null));
                } else {
                    this.calcHeadItem(com,item);
                }
                break;
            case YIUI.ExprItem_Type.Set:
                switch (com.type){
                case YIUI.CONTROLTYPE.GRID:
                    this.calcGrid(com,this.initTree(item),ctx);
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(com,this.initTree(item),ctx);
                    break;
                }
                break;
            }
        },

        calcHeadItem:function (com,item) {
            if( $.inArray(item.source,this.form.buddyKeys) !== -1 )
                return;

            com.setVisible(this.calcVisible(item,this.newContext(this.form,-1,-1)));

            if( !com.isVisible() ) {
                if ( !this.form.isError() || this.form.formKey != this.form.errorInfo.errorSource ) {
                    if ( com.isError() ) {
                        this.form.setError(true, com.errorInfo.msg, com.key);
                    }
                    if ( com.isRequired() ) {
                        this.form.setError(true, com.caption + "is Required", com.key);
                    }
                }
            } else {
                if (this.form.isError() && this.form.errorInfo.errorSource == com.key) {
                    this.form.setError(false, null);
                }
            }
        },

        calcListView:function (listView,item,context) {
            if( !item.items )
                return;
            for(var i = 0,exp;exp = item.items[i];i++){
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                listView.setColumnVisible(exp.target, this.calcVisible(exp,context));
            }
        },

        calcGrid:function (grid,item,cxt) {
            if( !item.items )
                return;
            var unVisible = this.form.dependency.unVisibleKeys,visible;
            for( var i = 0,exp,pos;(exp = item.items[i]) && (pos = exp.pos);i++ ){
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                if( pos.columnExpand ) {
                    for( var k = 0,length = pos.indexes.length;k < length;k++ ) {
                        cxt.colIndex = pos.indexes[k];
                        if( unVisible && $.inArray(exp.target,unVisible) != -1 ){
                            visible = false;
                        } else {
                            visible = this.calcVisible(exp,cxt);
                        }
                        grid.setColumnVisible(pos.indexes[k], visible);
                    }
                } else {
                    if( unVisible && $.inArray(exp.target,unVisible) != -1 ){
                        visible = false;
                    } else {
                        visible = this.calcVisible(exp,cxt);
                    }
                    grid.setColumnVisible(pos.index, visible);
                }
            }
        },

        valueChanged:function (com) {
            var affectItems = this.visibleTree.affectItems,affectItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                if( affectItems[i].key === com.key ){
                    affectItem = affectItems[i];
                    break;
                }
            }
            if( !affectItem )
                return;
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp,com;exp = affectItem.expItems[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com && exp.type !== this.VisibleItemType.Operation )
                    continue;

                this.calcExprItemObject(com,context,exp);
            }
        },

        reCalcComponent:function (component) {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,exp;exp = items[i];i++ ) {
                if( exp.source !== component.key )
                    continue;

                this.calcExprItemObject(component,context,exp);
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var ctx = this.newContext(this.form,rowIndex,colIndex),
                rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex];

            var affectItems = this.visibleTree.affectItems,affectItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                if( affectItems[i].key === cellKey ) {
                    affectItem = affectItems[i];
                    break;
                }
            }
            if( !affectItem )
                return;
            for( var i = 0,exp,com;exp = affectItem.expItems[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com )
                    continue;

                this.calcExprItemObject(com,ctx,exp);
            }
        },

        doAfterDeleteRow:function (grid) {
            // TODO Auto-generated method stub
        },

        doAfterInsertRow:function (grid,rowIndex) {
            // TODO Auto-generated method stub
        }

    });
})();