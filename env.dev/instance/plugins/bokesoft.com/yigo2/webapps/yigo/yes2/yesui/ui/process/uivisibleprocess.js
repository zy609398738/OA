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

        calcExprItemObject:function (component,item) {
            switch (item.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.calcHeadItem(component,item);
                    break;
                case YIUI.ExprItem_Type.Set:
                    switch (component.type){
                    case YIUI.CONTROLTYPE.GRID:
                        this.calcGrid(component,this.initTree(item),this.newContext(this.form,-1,-1));
                        break;
                    case YIUI.CONTROLTYPE.LISTVIEW:
                        this.calcListView(component,this.initTree(item),this.newContext(this.form,-1,-1));
                        break;
                    }
                    break;
            }
        },

        calcAll:function () {
            var items = this.form.dependency.visibleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.source);
                if( !component )
                    continue;
                this.calcExprItemObject(component,exp);
            }
        },

        calcSubDetail:function (grid) {
            var items = this.form.dependency.visibleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.source);
                if( !component || YIUI.SubDetailUtil.isSubDetail(this.form,component,grid.key));
                    continue;
                this.calcExprItemObject(component,exp);
            }
        },

        calcHeadItem:function (component,item) {
            if( component.isBuddy() )
                return;
            var visible = this.calcVisible(item,this.newContext(this.form,-1,-1));

            // 设置可见性
            component.setVisible(visible);

            // 如果组件不可见且带有错误信息,那么显示在表单上
            // 如果此时为错误,计算检查规则后正确,不影响显示
            if( !visible && (component.isError() || component.isRequired()) ) {
                if ( !this.form.isError() ) {
                    if ( component.isError() ) {
                        this.form.setError(true, component.errorInfo.msg, component.key);
                    } else {
                        this.form.setError(true, component.caption + "is Required", component.key);
                    }
                }
            } else { // 否则清除表单的错误信息
                if (this.form.isError() && this.form.errorInfo.errorSource == component.key) {
                    this.form.setError(false, null);
                }
            }

            // TODO
            // var ownerCt = comp.ownerCt;
            // if (ownerCt && ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
            //     if (comp.visible == visible) return;
            //     ownerCt.reLayout();
            // }
        },

        calcListView:function (listView,item,context) {
            var items = item.items;
            if( !items )
                return;
            for(var i = 0,size = item.items.length;i < size;i++){
                var exp = item.items[i];
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                var visible = this.calcVisible(exp,context);
                listView.setColumnVisible(exp.target, visible);
            }
        },

        calcGrid:function (grid,item,context) {
            var items = item.items;
            if( !items )
                return;
            for(var i = 0,size = item.items.length;i < size;i++){
                var exp = item.items[i];
                if( exp.type != this.VisibleItemType.Column )
                    continue;
                // 这里需要处理列拓展一开始不显示的情况
                var visible = this.calcVisible(exp,context);
                grid.setColumnVisible(exp.target, visible);
            }
        },

        valueChanged:function (com) {
            var affectItems = this.form.dependency.visibleTree.affectItems;
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
                    switch ( exp.objectType ) {
                    case YIUI.ExprItem_Type.Item:
                        if( exp.type == this.VisibleItemType.Operation ) {
                            this.form.setOperationVisible(exp.target,this.form.eval(exp.content, this.newContext(this.form,-1,-1), null));
                        } else {
                            this.calcHeadItem(com,exp);
                        }
                        break;
                    case YIUI.ExprItem_Type.Set:
                        switch (com.type) {
                        case YIUI.CONTROLTYPE.GRID:
                            this.calcGrid(com,exp,this.newContext(this.form,-1,-1));
                            break;
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.calcListView(com,exp,this.newContext(this.form,-1,-1));
                            break;
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        },

        reCalcComponent:function (component) {
            var items = this.form.dependency.visibleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType != YIUI.ExprItem_Type.Set )
                    continue;
                if( items[i].source !== component.key )
                    continue;
                switch (component.type) {
                case YIUI.CONTROLTYPE.Grid:
                    this.calcGrid(component,items[i],this.newContext(this.form,-1,-1));
                    break;
                case YIUI.CONTROLTYPE.LISTVIEW:
                    this.calcListView(component,items[i],this.newContext(this.form,-1,-1));
                    break;
                }
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var ctx = this.newContext(this.form,rowIndex,colIndex);
            var rowData = grid.getRowDataAt(rowIndex);
            var cellKey = rowData.cellKeys[colIndex];

            var affectItems = this.form.dependency.visibleTree.affectItems;
            var affectItem;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                if( affectItems[i].key === cellKey ) {
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

                    switch ( exp.objectType ) {
                    case YIUI.ExprItem_Type.Item:
                        this.calcHeadItem(component,exp);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        switch (component.type) {
                        case YIUI.CONTROLTYPE.Grid:
                            this.calcGrid(component,items[i],ctx);
                            break;
                        case YIUI.CONTROLTYPE.LISTVIEW:
                            this.calcListView(component,items[i],ctx);
                            break;
                        }
                    }
                }
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