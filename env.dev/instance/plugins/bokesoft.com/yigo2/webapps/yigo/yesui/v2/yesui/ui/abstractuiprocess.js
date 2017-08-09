/**
 * Created by 陈瑞 on 2017/3/1.
 */
var YIUI = YIUI || {};
(function () {
    YIUI.AbstractUIProcess = YIUI.extend({
        form : null,
        calcTree: null,
        enableTree: null,
        visibleTree: null,
        checkRuleTree: null,

        init : function(form) {
            this.form = form;
            this.calcTree = this.form.dependency.calcTree;
            this.enableTree = this.form.dependency.enableTree;
            this.visibleTree = this.form.dependency.visibleTree;
            this.checkRuleTree = this.form.dependency.checkRuleTree;
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
            for(var i = 0,exp,cnt;exp = item.items[i];i++ ) {
                cnt = exp.content || exp.formulaValue;
                if( cnt ) {
                    exp.syntaxTree = this.form.getSyntaxTree(cnt);
                }
            }
            return item;
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

        calcEnable:function (item,context,defaultValue,accessControl) {
            if( !this.form.hasEnableRight(item.target) || !accessControl )
                return false;
            if( item.syntaxTree ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(item.syntaxTree,context,null));
            } else if ( item.content ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(item.content, context, null));
            }
            return defaultValue;
        },

        calcVisible:function (item,context) {
            if( !this.form.hasVisibleRight(item.target) )
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