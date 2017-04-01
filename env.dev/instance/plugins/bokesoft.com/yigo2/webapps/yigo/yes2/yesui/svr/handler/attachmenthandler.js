YIUI.AttachmentHandler = (function () {
    var Return = {
        /**
         * 删除指定的附件
         */
        doDeleteAttachement: function (fileID, formKey) {
            var paras = {fileID: fileID, formKey: formKey};
            Svr.SvrMgr.deleteAttachment(paras);
        },
        
        preview: function(path, name) {
        	
        }

    };
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();