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

            var self = this;

            var calcComponent = function () {
                var items = self.visibleTree.items,
                    context = self.newContext(self.form,-1,-1);
                for( var i = 0,exp,com;exp = items[i];i++ ) {
                    com = self.form.getComponent(exp.source);
                    if( !com || exp.type == self.VisibleItemType.Operation )
                        continue;

                    self.calcExprItemObject(com,context,exp);
                }
            }

            var calcGridRows = function () {
                var rowItems = self.visibleTree.rowItems;

                if( !rowItems )
                    return;

                var gm = self.form.getGridInfoMap(),
                    grid,
                    row,
                    item,
                    ctx,
                    items;

                for( var i = 0,size = gm.length;i < size;i++ ) {
                    grid = self.form.getComponent(gm[i].key);
                    items = rowItems[grid.key];
                    if( !items )
                        continue;
                    for( var k = 0,count = grid.getRowCount();k < count;k++ ) {
                        row = grid.getRowDataAt(k);
                        if( row.rowType === 'Detail' )
                            continue;
                        item = items[row.key];
                        if( !item )
                            continue;
                        if( !ctx ) {
                            ctx = self.newContext(self.form,-1,-1);
                        }
                        ctx.rowIndex = k;
                        grid.setRowVisible(k,self.form.eval(item.content, ctx));
                    }
                }
            }

            calcComponent();

            calcGridRows();
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

            if( com.extend ) {
                return com.setVisible(false);
            }

            if( $.inArray(item.source,this.form.buddyKeys) !== -1 )
                return;

            com.setVisible(this.calcVisible(item,this.newContext(this.form,-1,-1)));

            this.moveError(com);
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

            var unVisible = this.form.dependency.unVisibleKeys,
                visible,
                exp,
                pos;

            for( var i = 0;(exp = item.items[i]) && (pos = exp.pos);i++ ){
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                if( pos.columnExpand ) {
                    var visible = [];
                    for( var k = 0,length = pos.indexes.length;k < length;k++ ) {
                        cxt.colIndex = pos.indexes[k];
                        if( unVisible && $.inArray(exp.target,unVisible) != -1 ){
                            visible.push(false);
                        } else {
                            visible.push(this.calcVisible(exp,cxt));
                        }
                    }
                    grid.setColumnVisible(pos.indexes, visible);
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

        valueChanged:function (comp) {
            var items = this.visibleTree.affectItems[comp.key];

            if( !items )
                return;

            var item,
                com;

            var context = this.newContext(this.form,-1,-1);
            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com && item.type !== this.VisibleItemType.Operation )
                    continue;

                this.calcExprItemObject(com,context,item);
            }
        },

        reCalcComponent:function (com) {
            var items = this.visibleTree.items,
                context = this.newContext(this.form,-1,-1),
                item;
            for( var i = 0;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

                this.calcExprItemObject(com,context,item);
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex],
                items = this.visibleTree.affectItems[cellKey];

            if( !items )
                return;

            var ctx = this.newContext(this.form,rowIndex,colIndex),
                item,
                com;

            for( var i = 0;item = items[i];i++ ) {
                com = this.form.getComponent(item.source);
                if( !com && item.type !== this.VisibleItemType.Operation )
                    continue;

                this.calcExprItemObject(com,ctx,item);
            }
        },

        doAfterDeleteRow:function (grid) {
            this.impl_RowChanged(grid);
        },

        doAfterInsertRow:function (com,rowIndex) {
            if( com.type !== YIUI.CONTROLTYPE.GRID )
                return;
            this.impl_RowChanged(com);
        },

        doAfterRowChanged:function (grid) {
            this.impl_RowChanged(grid);
        },

        impl_RowChanged: function (grid) {
            var detailRow = grid.getDetailMetaRow(),
                item,
                com,
                items;

            if( !detailRow ) {
                return;
            }

            var ctx = this.newContext(this.form,-1,-1);

            for( var i = 0,length = detailRow.cells.length;i < length;i++ ) {
                items = this.visibleTree.affectItems[detailRow.cells[i].key];
                if( items ) {
                    for( var j = 0;item = items[j];j++ ) {
                        com = this.form.getComponent(item.source);
                        if( !com && item.type !== this.VisibleItemType.Operation )
                            continue;

                        this.calcExprItemObject(com,ctx,item);
                    }
                }
            }
        }

    });
})();