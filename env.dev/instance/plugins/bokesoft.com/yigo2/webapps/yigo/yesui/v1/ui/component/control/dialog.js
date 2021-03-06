/**
 * 按钮控件。
 */
YIUI.Control.Dialog = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',

    handler: YIUI.DialogHandler,
    
    msgType: YIUI.Dialog_MsgType.YES_NO_OPTION,
    
    eventList: {},
    
    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	this.dialog = new YIUI.Yes_Dialog({
    		el: this.el,
    		title: this.title,
    		msg: this.msg,
    		msgType: this.msgType
    	});
    	this.el.addClass("ui-dlg");
    	this.dialog.show();
    },
    
    regEvent: function(key, callback) {
    	this.eventList[key] = callback;
    },
    
    getEvent: function(key) {
    	return this.eventList[key];
    },
    
    regExcp: function(excp) {
    	this.excp = excp;
    },
    
    setOwner: function(form) {
    	this.form = form;
    },
    
    getOwner: function() {
    	return this.form;
    },

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
    	var self = this;
        $(".dlg-btn", self.el).click(function (event) {
        	var opt = $(this).attr("key");
//        	var opt = self.dialog.parseOpt(typeStr);
        	self.handler.doOnClick(self, opt);
        });
        $(".dialog-close", self.el).click(function(event) {
        	self.handler.doOnClick(self, YIUI.Dialog_Btn.STR_NO);
        });
    }
});
YIUI.reg('dialog', YIUI.Control.Button);