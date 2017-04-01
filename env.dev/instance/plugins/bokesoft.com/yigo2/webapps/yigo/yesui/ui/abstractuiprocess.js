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

        calcEnable:function (key, content, syntaxTree, context, formEnable,accessControl) {
            if( !this.hasEnableRights(key) )
                return false;
            if( syntaxTree != null ) {
                return YIUI.TypeConvertor.toBoolean(this.form.evalByTree(syntaxTree,context,null));
            } else if ( content != null && content.length > 0 ) {
                return YIUI.TypeConvertor.toBoolean(this.form.eval(content, context, null));
            }
            return formEnable;
        }

    })
})();
