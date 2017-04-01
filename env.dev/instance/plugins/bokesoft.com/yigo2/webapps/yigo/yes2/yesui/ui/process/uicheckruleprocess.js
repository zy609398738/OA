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

            this.calcAllComponents(this.enableOnly());

            this.checkGridRows();
        },

        checkGlobal:function () {
            if( this.enableOnly() ) {
                if( this.form.isError() ){
                    this.form.setError(false, null);
                }
                return;
            }
            var globalItems = this.form.dependency.checkRuleTree.globalItems;
            if ( !globalItems )
                return;
            for( var i = 0,size = globalItems.length;i < size;i++ ) {
                var exp = globalItems[i];
                if( !exp.content )
                    continue;
                var result = this.form.eval(exp.content,this.newContext(this.form,-1,-1));
                if( typeof result === 'string' ) {
                    if( result ) {
                        if( !this.form.isError ) {
                            this.form.setError(true,result,this.form.formKey);
                        }
                    } else {
                       if( this.form.isError() && this.form.errorInfo.errorSource &&
                           this.form.errorInfo.errorSource === this.form.formKey) {
                           this.form.setError(false,null,null);
                       }
                    }
                } else {
                    if( result ) {
                        if( this.form.isError() && this.form.errorInfo.errorSource &&
                            this.form.errorInfo.errorSource === this.form.formKey ) {
                            this.form.setError(false,null,null);
                        }
                    } else {
                        this.form.setError(true,exp.errorMsg,this.form.formKey);
                    }
                }
            }
        },

        calcAllComponents:function (enableOnly) {
            var items = this.form.dependency.checkRuleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var component = this.form.getComponent(items[i].source);
                if( !component || component.getMetaObj().isSubDetail )
                    continue;
                switch (items[i].objectType) {
                    case YIUI.ExprItem_Type.Item:
                        this.checkHead(component,items[i],enableOnly,false);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        this.checkGrid(component,this.initTree(items[i]),enableOnly,false);
                        break;
                }
            }
        },
        
        checkHead:function (component,item,enableOnly,checkBindCell) {
            if( component.type == YIUI.CONTROLTYPE.GRID ){
                if( !item.target )
                    return;
                var cellLocation = this.form.getCellLocation(item.target);
                var pos = item.pos;
                if( pos.columnExpand ) {
                    for(var i = 0,size = pos.indexes.length;i < size;i++ ) {
                        var editOpt = component.getCellEditOpt(item.target);
                        var cellData = component.getCellDataAt(cellLocation.row,i);
                        if( enableOnly && !cellData[2] ) {
                            if( cellData[3] ) {
                                component.setCellRequired(cellLocation.row,i,false);
                            }
                            if( cellData[4] ) {
                                component.setCellError(cellLocation.row,i,false,"");
                            }
                            continue;
                        }
                        // 开始计算
                        if( editOpt.isRequired ) {
                            component.setCellRequired(rowIndex, colIndex, cellData[1] == null || cellData[1] == "");
                        }
                        if( item.content ) {
                            var result = this.calcCheckRule(item.content,this.newContext(this.form,-1,-1));
                            if( typeof result === 'string' ) {
                                component.setCellError(cellLocation.row,i,result, result);
                            } else {
                                component.setCellError(cellLocation.row,i,!result,result ? null : item.errorMsg);
                            }
                        }
                    }
                } else {
                    var cellData = component.getCellDataAt(cellLocation.row,pos.index);
                    var editOpt = component.getCellEditOpt(item.target);
                    if( enableOnly && !cellData[2] ) {
                        if( cellData[3] ) {
                            component.setCellRequired(cellLocation.row,pos.index,false);
                        }
                        if( cellData[4] ) {
                            component.setCellError(cellLocation.row,pos.index,false,"");
                        }
                        return;
                    }
                    // 计算必填
                    if( editOpt.isRequired ) {
                        component.setCellRequired(cellLocation.row, pos.index, cellData[1] == null || cellData[1] == "");
                    }
                    // 计算检查规则
                    if( item.content ) {
                        var result = this.calcCheckRule(item,this.newContext(this.form,-1,-1));
                        if( typeof result === 'string' ) {
                            component.setCellError(cellLocation.row,pos.index,result,result);
                        } else {
                            component.setCellError(cellLocation.row,pos.index,result,!result ? null : item.errorMsg);
                        }
                    }
                }
            } else {
                var requiredSelfDefined,checkSelfDefined;
                if( enableOnly && !component.isEnable() ) {
                    if( component.isRequired() ) {
                        component.setRequired(false);
                    }
                    if( component.isError() ) {
                        component.setError(false,null);
                    }
                    return;
                }
                // 计算必填
                if( component.getMetaObj().required ) {
                    component.setRequired(component.isNull());
                    requiredSelfDefined = true;
                }
                if( item.content ) {
                    var result = this.calcCheckRule(item,this.newContext(this.form,-1,-1));
                    if( typeof result === 'string' ) {
                        component.setError(result,result);
                    } else {
                        component.setError(!result,result ? null : item.errorMsg);
                    }
                    checkSelfDefined = true;
                }
                // 如果是子明细组件
                if( component.getMetaObj().isSubDetail ) {
                    var cellData = YIUI.SubDetailUtil.getBindingCellData(this.form,component);
                    var cellErrorInfo = YIUI.SubDetailUtil.getBindingCellError(this.form, component);
                    if( cellData ) {
                        if( !requiredSelfDefined ) {
                            component.setRequired[cellData[3]];
                        }
                        if( !checkSelfDefined && cellErrorInfo) {
                            component.setError(true,cellErrorInfo.errorMsg);
                        }
                    }
                    // 检查绑定的表格当前行的单元格
                    var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,component);
                    var rowIndex = grid.getFocusRowIndex();
                    if( checkBindCell && cellData != null && rowIndex != -1 ) {
                        var bindingCellKey = component.bindingCellKey;
                        var location = this.form.getCellLocation(bindingCellKey);
                        grid.setCellError(rowIndex,location.column,component.isError(),component.getErrorMsg());
                    }
                }
                // 如果当前控件不可见,那么将错误显示在表头
                if( !component.isVisible() && (component.isError() || component.isRequired()) ) {
                    if( !this.form.isError() ) {
                        if( component.isError() ) {
                            this.form.setError(true,component.getErrorMsg(),component.key);
                        } else {
                            this.form.setError(true,component.caption + "is Required",component.key);
                        }
                    }
                } else {
                    if( this.form.isError() && this.form.errorInfo.errorSource === component.key ){
                        this.form.setError(false,null,null);
                    }
                }
            }
        },

        checkGrid:function (grid,item,enableOnly,checkSubDetails) {
            for( var i = 0,size = grid.getRowCount();i < size;i++ ) {
                var row = grid.getRowDataAt(i);
                if( !row.isDetail )
                    continue;
                this.checkGridRowCell(grid,i,item,enableOnly,checkSubDetails);
            }
        },

        checkGridRowCell:function (grid,rowIndex,item,enableOnly,checkSubDetail) {
            var items = item.items;
            if( !items )
                return;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var pos = exp.pos;
                if( pos.columnExpand ) {
                    var editOpt = grid.getCellEditOpt(exp.target);
                    for( var p = 0,length = pos.indexes.length;p < length;p++ ) {
                        var idx = pos.indexes[p];
                        var cellData = grid.getCellDataAt(rowIndex,idx);
                        if( enableOnly && !cellData[2] ) {
                            if( cellData[3] ) {
                                grid.setCellRequired(rowIndex,idx,false);
                            }
                            if( cellData[4] ) {
                                grid.setCellError(rowIndex,idx,false,null);
                            }
                            continue;
                        }
                        // 计算必填
                        if( editOpt.isRequired ) {
                            grid.setCellRequired(rowIndex, idx, cellData[1] == null || cellData[1] == "");
                        }
                        // 计算检查规则
                        if( exp.content ) {
                            var result = this.calcCheckRule(exp,this.newContext(this.form,rowIndex,-1));
                            if( typeof result === 'string' ) {
                                grid.setCellError(rowIndex,idx,result,result);
                            } else {
                                grid.setCellError(rowIndex,idx,!result,result ? null : exp.errorMsg);
                            }
                        }
                    }
                } else {
                    var editOpt = grid.getCellEditOpt(exp.target);
                    var cellData = grid.getCellDataAt(rowIndex,pos.index);

                    if( enableOnly && !cellData[2] ) {
                        if( cellData[3] ) {
                            grid.setCellRequired(rowIndex,pos.index,false);
                        }
                        if( cellData[4] ) {
                            grid.setCellError(rowIndex,pos.index,false,null);
                        }
                        return;
                    }
                    // 计算必填
                    if( editOpt.isRequired ) {
                        grid.setCellRequired(rowIndex, pos.index, cellData[1] == null || cellData[1] == "");
                    }
                    // 计算检查规则
                    if( exp.content ) {
                        var result = this.calcCheckRule(exp,this.newContext(this.form,rowIndex,-1));
                        if( typeof result === 'string' ) {
                            grid.setCellError(rowIndex,pos.index,result,result);
                        } else {
                            grid.setCellError(rowIndex,pos.index,!result,result ? null : exp.errorMsg);
                        }
                    }

                    if( checkSubDetail && grid.getFocusRowIndex() == rowIndex ) {
                        var subDetails = this.form.getCellSubDtlComps(grid.key, exp.target);
                        if (subDetails != null && subDetails.length > 0) {
                            for (var c = 0, count = subDetails.length; c < count; c++) {
                                // subDetails[c].setError(!error, msg);
                            }
                        }
                    }
                }
            }
        },

        doAfterInsertRow:function (component,rowIndex) {
            if( component.type != YIUI.CONTROLTYPE.GRID )
                return;
            var row = component.getRowDataAt(rowIndex);
            if( !row.isDetail )
                return;
            var items = this.form.dependency.checkRuleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType=YIUI.ExprItem_Type.Set && items[i].source === component.key ) {
                    this.checkGridRowCell(component,rowIndex,items[i],this.enableOnly(),false);
                }
            }
            this.checkGridRowCheckRule(component,rowIndex);

            this.impl_valueChanged(component,component.key + ":RowCount");

            this.checkGlobal();
        },

        doAfterDeleteRow: function (grid){

            this.impl_valueChanged(grid,grid.key + ":RowCount");

            this.checkGlobal();
        },

        checkGridRows:function () {
            var gridMap = this.form.getGridInfoMap();
            for( var i = 0,size = gridMap.length;i < size;i++ ) {
                var gridInfo = gridMap[i];
                var grid = this.form.getComponent(gridInfo.key);
                for( var c = 0,length = grid.getRowCount();c < length;c++ ) {
                    this.checkGridRowCheckRule(grid,c);
                }
            }
        },

        checkGridRowCheckRule:function (grid, rowIndex) {
            var rowCheckRules = grid.getMetaObj().rowCheckRules;
            if ( !rowCheckRules )
                return;
            for (var k = 0, len = rowCheckRules.length; k < len; k++) {
                var rowCheckRule = rowCheckRules[k];
                var result = this.calcCheckRule(rowCheckRule,this.newContext(this.form,rowIndex,-1));
                if( typeof result === 'string' ) {
                    grid.setRowError(rowIndex,result,result);
                } else {
                    grid.setRowError(rowIndex,!result,result ? null : rowCheckRule.errorMsg);
                }
            }
        },

        reCalcComponent:function (component) {
            var items = this.form.dependency.checkRuleTree;
            for( var i = 0,size = items.length;i < size;i++ ) {
                if( items[i].objectType != YIUI.ExprItem_Type.Set )
                    continue;
                if( items[i].source !== component.key )
                    continue;

                // 检查表格
                this.checkGrid(component,this.initTree(items[i]),this.enableOnly(),true);
            }
            if( component.type == YIUI.CONTROLTYPE.GRID ) {
                for( var i = 0,size = component.getRowCount();i < size;i++ ){
                    this.checkGridRowCheckRule(component,i);
                }
            }
            this.checkGlobal();
        },

        valueChanged:function (component) {
            var needCheck = false;
            if( component.getMetaObj().isSubDetail ) {
                var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,component);
                needCheck = component.bindingCellKey && grid.getCellEditOpt(component.bindingCellKey).isRequired;
            }
            if( component.getMetaObj().required || needCheck ) {
                component.setRequired(component.isNull());
            }

            // 计算影响项
            this.impl_valueChanged(component,component.key);

            // 如果是子明细组件,如果绑定了单元格,则联动显示,如果没有绑定单元格,检查一下当前行行的检查规则
            if( component.getMetaObj().required && component.bindingCellKey ) {
                var grid = YIUI.SubDetailUtil.getBindingGrid(this.form,component);
                if( grid && grid.getFocusRowIndex() != -1 ) {
                    this.checkGridRowCheckRule(grid,grid.getFocusRowIndex());
                }
            }

            //算全局的检查规则
            this.checkGlobal();
        },

        impl_valueChanged:function (component,key) {
            var affectItems = this.form.dependency.checkRuleTree.affectItems;
            var items = null;
            for( var i = 0,size = affectItems.length;i < size;i++ ) {
                if( affectItems[i].key === key ){
                    items = affectItems[i];
                    break;
                }
            }
            if( !items )
                return;
            for( var i = 0,size = items.expItems.length;i < size;i++ ) {
                var exp = items.expItems[i];
                var com = this.form.getComponent(exp.source);
                if( !com )
                    continue;
                switch (exp.type) {
                case YIUI.ExprItem_Type.Item:
                    this.checkHead(com,exp,this.enableOnly(),true);
                    break;
                case YIUI.ExprItem_Type.Set:

                    var calcParGrid = YIUI.SubDetailUtil.isSubDetail(this.form,component,com.key);

                    if( calcParGrid ) {
                        this.checkGridRowCell(com,com.getFocusRowIndex(),this.initTree(exp),this.enableOnly(),true);
                    } else {
                        this.checkGrid(com,this.initTree(exp),this.enableOnly(),true);
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
            var rowData = grid.getRowDataAt(rowIndex);
            var cellKey = rowData.cellKeys[colIndex];
            var editOpt = grid.getCellEditOpt(cellKey);

            var cellData = grid.getCellDataAt(rowIndex, colIndex);
            if (editOpt.isRequired) {
                grid.setCellRequired(rowIndex, colIndex, cellData == null || cellData == "");
            }
            var affectItems = this.form.dependency.checkRuleTree.affectItems;
            var items = null;
            for (var i = 0, size = affectItems.length; i < size; i++) {
                if (affectItems[i].key === cellKey) {
                    items = affectItems[i];
                    break;
                }
            }
            if ( items ) {
                for (var i = 0, size = items.expItems.length; i < size; i++) {
                    var exp = items.expItems[i];
                    var component = this.form.getComponent(exp.source);
                    if(!component)
                        continue;
                    switch (exp.objectType) {
                    case YIUI.ExprItem_Type.Item:
                        this.checkHead(component, exp, this.enableOnly(), true);
                        break;
                    case YIUI.ExprItem_Type.Set:
                        if( rowData.isDetail && component.key == grid.key ) {
                            this.checkGridRowCell(component,rowIndex,exp,this.enableOnly(),true);
                        } else {
                            this.checkGrid(component, this.initTree(exp), this.enableOnly(), true);
                        }
                        break;
                    default:
                        break;
                    }
                }
            }

            //重算当前行的检查规则
            this.checkGridRowCheckRule(grid, rowIndex);

            //算全局的检查规则
            this.checkGlobal();
        },

        calcSubDetail:function (grid) {
            var items = this.form.dependency.checkRuleTree.items;
            for( var i = 0,size = items.length;i < size;i++ ) {
                var exp = items[i];
                var component = this.form.getComponent(exp.source);
                if( !component )
                    continue;
                switch (exp.objectType){
                case YIUI.ExprItem_Type.Item:
                    this.checkHead(component,exp,this.enableOnly(),false);
                    break;
                case YIUI.ExprItem_Type.Set:
                    this.checkGrid(component,this.initTree(exp),this.enableOnly(),false);
                    break;
                default:
                    break;
                }
            }
        }

    });
})();
