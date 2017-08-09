/**
 * Created by 陈瑞 on 2017/3/4 use WebStorm.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.UICheckRuleProcess = YIUI.extend(YIUI.AbstractUIProcess,{
        init:function (form) {
            this.base(form);
        },

        calcAll:function () {
            this.checkGlobal();

            this.calcAllComponents();

            this.checkGridRows();
        },

        checkGlobal:function () {
            if( this.enableOnly() ) {
                if( this.form.isError() ){
                    this.form.setError(false, null);
                }
                return;
            }
            var globalItems = this.checkRuleTree.globalItems;
            if ( !globalItems )
                return;
            var context = this.newContext(this.form,-1,-1),result,formKey = this.form.formKey;
            for( var i = 0,exp;exp = globalItems[i];i++ ) {
                if( !exp.content )
                    continue;
                result = this.form.eval(exp.content,context);
                if( typeof result === 'string' ) {
                    if( result ) {
                        this.form.setError(true,result,formKey);
                        break;
                    } else {
                       if( this.form.isError() && this.form.errorInfo.errorSource === formKey) {
                           this.form.setError(false,null,null);
                       }
                    }
                } else {
                    if( result ) {
                        if( this.form.isError() && this.form.errorInfo.errorSource === formKey ) {
                            this.form.setError(false,null,null);
                        }
                    } else {
                        this.form.setError(true,exp.errorMsg,formKey);
                        break;
                    }
                }
            }
        },

        calcAllComponents:function () {
            var items = this.checkRuleTree.items;
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || com.isSubDetail )
                    continue;

                this.calcExprItemObject(com,exp);
            }
        },

        calcSubDetail:function (gridKey) {
            var items = this.checkRuleTree.items;
            for( var i = 0,exp,com;exp = items[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com || !YIUI.SubDetailUtil.isSubDetail(this.form,com,gridKey) )
                    continue;

                this.calcExprItemObject(com,exp);
            }
        },

        calcExprItemObject: function (com,exp) {
            switch (exp.objectType) {
            case YIUI.ExprItem_Type.Item:
                this.checkHead(com,exp,false);
                break;
            case YIUI.ExprItem_Type.Set:
                this.checkGrid(com,this.initTree(exp),false);
                break;
            default:
                break;
            }
        },
        
        checkHead:function (com,item,checkBindCell) {
            if( com.type == YIUI.CONTROLTYPE.GRID ){
                if( !item.target )
                    return;
                var loc = this.form.getCellLocation(item.target),
                    index = item.pos.index,
                    cellData = com.getCellDataAt(loc.row,index),
                    editOpt = com.getCellEditOpt(item.target);
                if( this.enableOnly() && !cellData[2] ) {
                    if( cellData[3] ) com.setCellRequired(loc.row,index,false);
                    if( cellData[4] ) com.setCellError(loc.row,index,false,"");
                    return;
                }
                if( editOpt.isRequired ) {
                    com.setCellRequired(loc.row, index, com.isNullValue(cellData[0]));
                }
                if( item.content ) {
                    var result = this.calcCheckRule(item,this.newContext(this.form,-1,-1));
                    if( typeof result === 'string' ) {
                        com.setCellError(loc.row,index,result,result);
                    } else {
                        com.setCellError(loc.row,index,!result,result ? null : item.errorMsg);
                    }
                }
            } else {
                if( this.enableOnly() && !com.isEnable() ) {
                    if( com.isRequired() ) com.setRequired(false);
                    if( com.isError() ) com.setError(false,null);
                    return;
                }
                if( com.getMetaObj().required ) {
                    com.setRequired(com.isNull());
                }
                if( item.content ) {
                    var result = this.calcCheckRule(item,this.newContext(this.form,-1,-1));
                    if( typeof result === 'string' ) {
                        com.setError(result,result);
                    } else {
                        com.setError(!result,result ? null : item.errorMsg);
                    }
                }
                if( com.isSubDetail ) {
                    var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,com),
                        cellData = YIUI.SubDetailUtil.getBindingCellData(this.form,com);
                    if( cellData ) {
                        if( !com.getMetaObj().required ) com.setRequired[cellData[3]];
                        if( !item.content && cellData[4] ) com.setError(true,cellData[5]);
                    }
                    if( checkBindCell && cellData && grid.getFocusRowIndex() != -1 ) {
                        var location = this.form.getCellLocation(com.bindingCellKey);
                        grid.setCellError(grid.getFocusRowIndex(),location.column,com.isError(),com.getErrorMsg());
                    }
                }
                if( !com.isVisible() ) {
                    if( !this.form.isError() || this.form.formKey != this.form.errorInfo.errorSource ) {
                        if( com.isError() ) this.form.setError(true,com.getErrorMsg(),com.key);
                        if( com.isRequired() ) this.form.setError(true,com.caption + " is Required",com.key);
                    }
                } else {
                    if( this.form.isError() && this.form.errorInfo.errorSource === com.key ){
                        this.form.setError(false,null,null);
                    }
                }
            }
        },

        checkGrid:function (grid,item,checkSubDetails) {
            var context = this.newContext(this.form,-1,-1);
            for( var i = 0,row,size = grid.getRowCount();i < size;i++ ) {
                row = grid.getRowDataAt(i);
                if( !row.isDetail )
                    continue;
                context.rowIndex = i;
                this.checkGridRowCell(grid,context,i,null,item,checkSubDetails);
            }
        },

        checkGridRowCell:function (grid,context,rowIndex,specialInfo,item,checkSubDetail) {
            if( !item.items )
                return;

            var _this = this;
            
            var checkSingleItem = function (grid,rowIndex,editOpt,idx,cxt,item) {
                var cellData = grid.getCellDataAt(rowIndex,idx);

                if( _this.enableOnly() && !cellData[2] ) {
                    if( cellData[3] ) grid.setCellRequired(rowIndex,idx,false);
                    if( cellData[4] ) grid.setCellError(rowIndex,idx,false,null);
                    return;
                }
                if( editOpt.isRequired ) {
                    grid.setCellRequired(rowIndex, idx, grid.isNullValue(cellData[0]));
                }
                if( item.content ) {
                    var result = _this.calcCheckRule(item,cxt);
                    if( typeof result === 'string' ) {
                        grid.setCellError(rowIndex,idx,result,result);
                    } else {
                        grid.setCellError(rowIndex,idx,!result,result ? null : item.errorMsg);
                    }
                }
            }

            var editOpt,specialLoc = (specialInfo && specialInfo.specialLoc) || -1,
                        specialKey = (specialInfo && specialInfo.specialKey) || null;
            for( var i = 0,exp,pos;(exp = item.items[i]) && (pos = exp.pos);i++ ) {
                editOpt = grid.getCellEditOpt(exp.target);
                if( pos.columnExpand ) {
                    for( var p = 0,length = pos.indexes.length;p < length;p++ ) {
                        if( specialLoc != -1 && exp.target === specialKey && p !== specialLoc )
                            continue;
                        context.colIndex = pos.indexes[p];
                        checkSingleItem(grid,rowIndex,editOpt,pos.indexes[p],context,exp);
                    }
                } else {
                    checkSingleItem(grid,rowIndex,editOpt,pos.index,context,exp);

                    if( checkSubDetail && grid.getFocusRowIndex() == rowIndex ) {
                        var subDetails = this.form.getCellSubDtlComps(grid.key, exp.target);
                        if (subDetails && subDetails.length > 0) {
                            var cellData = grid.getCellDataAt(rowIndex,pos.index);
                            for (var c = 0, count = subDetails.length; c < count; c++) {
                                subDetails[c].setError(cellData[4], cellData[5]);
                            }
                        }
                    }
                }
            }
        },

        doAfterInsertRow:function (com,rowIndex) {
            if( com.type != YIUI.CONTROLTYPE.GRID )
                return;
            var row = com.getRowDataAt(rowIndex);
            if( !row.isDetail )
                return;
            var items = this.checkRuleTree.items,
                context = this.newContext(this.form,rowIndex,-1);
            for( var i = 0,item;item = items[i];i++ ) {
                if( item.objectType !== YIUI.ExprItem_Type.Set || item.source !== com.key )
                    continue;
                this.checkGridRowCell(com,context,rowIndex,null,item,false);
            }

            this.checkGridRowCheckRule(com,context,rowIndex);

            this.impl_valueChanged(com,com.key + ":RowCount");

            this.checkGlobal();
        },

        doAfterDeleteRow: function (grid){
            this.impl_valueChanged(grid,grid.key + ":RowCount");

            this.checkGlobal();
        },

        checkGridRows:function () {
            if( this.enableOnly() )
                return;
            var gridMap = this.form.getGridInfoMap(),grid,
                context = this.newContext(this.form,-1,-1);
            for( var i = 0,gridInfo;gridInfo = gridMap[i];i++ ) {
                grid = this.form.getComponent(gridInfo.key);
                for( var ri = 0,length = grid.getRowCount();ri < length;ri++ ) {
                    context.rowIndex = ri;
                    this.checkGridRowCheckRule(grid,context,ri);
                }
            }
        },

        checkGridRowCheckRule:function (grid,context,rowIndex) {
            var rowCheckRules = grid.getMetaObj().rowCheckRules,
                rowData = grid.getRowDataAt(rowIndex),result;
            if ( !rowCheckRules || rowData.rowType !== 'Detail' )
                return;
            for (var k = 0,item;item = rowCheckRules[k]; k++) {
                result = this.calcCheckRule(item,context);
                if( typeof result === 'string' ) {
                    grid.setRowError(rowIndex,result,result);
                    if( result ) break;
                } else {
                    grid.setRowError(rowIndex,!result,result ? null : item.errorMsg);
                    if( !result ) break;
                }
            }
        },

        reCalcComponent:function (com) {
            var items = this.checkRuleTree.items;
            for( var i = 0,item;item = items[i];i++ ) {
                if( item.source !== com.key )
                    continue;

               this.calcExprItemObject(com,item);
            }
            if( com.type == YIUI.CONTROLTYPE.GRID ) {
                var context = this.newContext(this.form,-1,-1);
                for( var i = 0,size = com.getRowCount();i < size;i++ ){
                    context.rowIndex = i;
                    this.checkGridRowCheckRule(com,context,i);
                }
            }
            this.checkGlobal();
        },

        valueChanged:function (com) {
            if( com.getMetaObj().required ) {
                com.setRequired(com.isNull());
            }

            this.impl_valueChanged(com,com.key);

            if( com.getMetaObj().required && com.bindingCellKey ) {
                var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,com);
                if( grid ) {
                    var context = this.newContext(this.form,grid.getFocusRowIndex(),-1);
                    this.checkGridRowCheckRule(grid,context,grid.getFocusRowIndex());
                }
            }

            this.checkGlobal();
        },

        impl_valueChanged:function (component,key) {
            var affectItems = this.checkRuleTree.affectItems,items;
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === key ){
                    items = affectItems[i];
                    break;
                }
            }
            if( !items )
                return;
            for( var i = 0,exp,com;exp = items.expItems[i];i++ ) {
                com = this.form.getComponent(exp.source);
                if( !com ) continue;
                switch (exp.type) {
                case YIUI.ExprItem_Type.Item:
                    this.checkHead(com,exp,true);
                    break;
                case YIUI.ExprItem_Type.Set:
                    if( YIUI.SubDetailUtil.isSubDetail(this.form,component,com.key) ) {
                        var context = this.newContext(this.form,com.getFocusRowIndex(),-1);
                        this.checkGridRowCell(com,context,com.getFocusRowIndex(),null,this.initTree(exp),true);
                    } else {
                        this.checkGrid(com,this.initTree(exp),true);
                    }
                    break;
                default:
                    break;
                }
            }
        },

        cellValueChanged:function (grid,rowIndex,colIndex) {
            var rowData = grid.getRowDataAt(rowIndex);
            if (rowData.rowType !== "Detail" && rowData.rowType !== "Fix")
                return;
            var rowData = grid.getRowDataAt(rowIndex),
                cellKey = rowData.cellKeys[colIndex],
                editOpt = grid.getCellEditOpt(cellKey),
                cellData = grid.getCellDataAt(rowIndex, colIndex);
            if (editOpt.isRequired) {
                grid.setCellRequired(rowIndex, colIndex, grid.isNullValue(cellData[0]));
            }
            var affectItems = this.checkRuleTree.affectItems,items;
            for (var i = 0, size = affectItems.length; i < size; i++) {
                if (affectItems[i].key === cellKey) {
                    items = affectItems[i];
                    break;
                }
            }
            var context = this.newContext(this.form,rowIndex,-1);
            if ( items ) {
                for (var i = 0,exp,com;exp = items.expItems[i];i++) {
                    com = this.form.getComponent(exp.source);
                    if( !com ) continue;
                    switch (exp.objectType) {
                    case YIUI.ExprItem_Type.Item:
                        this.checkHead(com, exp, true);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        if( rowData.isDetail && com.key == grid.key ) {
                            this.checkGridRowCell(com,context,rowIndex,{specialLoc:colIndex,specialKey:cellKey},exp,true);
                        } else {
                            this.checkGrid(com, this.initTree(exp), true);
                        }
                        break;
                    default:
                        break;
                    }
                }
            }

            this.checkGridRowCheckRule(grid,context,rowIndex);

            this.checkGlobal();
        }

    });
})();
