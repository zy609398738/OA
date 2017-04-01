/**
 * Created by 陈瑞 on 2017/3/1.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.AbstractUIProcess = YIUI.extend({
        form : null,
        init : function(form) {
            this.form = form;
        },
        getFormEnable : function(){
            return this.form.operationState == YIUI.Form_OperationState.New ||
                this.form.operationState == YIUI.Form_OperationState.Edit;
        },

        enableOnly:function () {
            return (this.form.operationState == YIUI.Form_OperationState.New ||
            this.form.operationState == YIUI.Form_OperationState.edit) ? false :
            this.form.operationState == YIUI.Form_OperationState.Default;
        },

        newContext:function (form,rowIndex,colIndex) {
            var cxt = {};
            cxt.form = form;
            cxt.rowIndex = rowIndex;
            cxt.colIndex = colIndex;
            return cxt;
        },

        initTree:function (item) {
            if( !item.items )
                return;
            for(var i = 0,size = item.items.size;i < size;i++ ) {
                var exp = item.items[i];
                exp.syntaxTree = this.form.getSyntaxTree(exp.content);
            }
            return item;
        },

        hasEnableRights:function(key) {
            var host = this.form.hostUIStatusProxy;
            if( host && host.containsEnableKey(key) ) {
                return true;
            }
            return true;// 这里是默认的权限检查,WEB暂没加,默认有
        },

        hasVisibleRights:function(key) {
            var host = this.form.hostUIStatusProxy;
            if( host && !host.containsUnVisibleKey(key) ) {
                return true;
            }
            return true;// 这里是默认的权限检查,WEB暂没加,默认有
        },

        calcFormulaValue:function (item,context) {
            var result = null;
            if( item.syntaxTree ) {
                result = this.form.evalByTree(item.syntaxTree,context,null);
            } else if ( item.formulaValue ) {
                result = this.form.eval(item.formulaValue,context,null);
            } else if ( item.defaultValue  ) {
                result = item.defaultValue;
            }
            return result;
        },

        calcEnable:function (item, context, formEnable,accessControl) {
            if( !this.hasEnableRights(item.key) )
                return false;
            if( item.syntaxTree ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(item.syntaxTree,context,null));
            } else if ( item.content ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(item.content, context, null));
            }
            return formEnable;
        },

        calcVisible:function (item,context) {
            if( !this.hasVisibleRights(item.key) )
                return false;
            if( item.syntaxTree ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(item.syntaxTree,context,null));
            } else if ( item.content ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(item.content,context,null));
            }
            return true;
        },

        calcCheckRule:function (item,context) {
            var result = null;
            if( item.syntaxTree ) {
                result = this.form.evalByTree(item.syntaxTree,context,null);
            } else if ( item.content ) {
                result = this.form.eval(item.content,context,null);
            }
            return result;
        }

    })
})();