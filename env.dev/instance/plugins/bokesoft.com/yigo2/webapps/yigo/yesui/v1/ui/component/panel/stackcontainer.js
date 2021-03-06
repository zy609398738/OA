/**
 * StackContainer
 * 以Stack为显示形式的单据容器，单据为Form
 */
YIUI.Panel.StackContainer = YIUI.extend(YIUI.Panel, {
	
	/** 容器中存在的Form，以栈为表现形式 */
	/** forms : [], */
	
	init : function(options) {
		this.base(options);
		this.formID = null;
	},
    
	
	onSetHeight: function(height) {
		this.base(height);
	},
	
	/** 删除原有form，并缓存之 */
	afterAdd : function(comp) {
		if(this.items.length >= 2) {
			this.items.shift();
		}
		if(this.el) {
			// 删除原有界面
			this.el.empty();
			if(!this.isReplace) {
				this.formID && YIUI.FormStack.removeForm(this.formID);
				this.isReplace = false;
			}
		}
		this.formID = comp.ofFormID;
	},
	
	/** 删除当前form，并取出之前缓存的form，并显示 */
	remove : function(comp, autoDestroy) {
		this.base(comp, autoDestroy);

		this.formID && YIUI.FormStack.removeForm(this.formID);
	},
	
	getActivePane: function() {
		return YIUI.FormStack.getForm(this.formID);
	},

	build: function(form) {
		var rootpanel = form.getRoot();
		this.add(rootpanel);
		this.doRenderChildren();
		this.doLayout(this.el[0].clientWidth, this.el[0].clientHeight);
    	form.setContainer(this);
        var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
        errDiv.prependTo(rootpanel.el);
        form.setErrDiv(errDiv);
	},
	
	removeForm: function(form) {
        this.remove(form.getRoot());
		this.formID && YIUI.FormStack.removeForm(this.formID);
	}
	
//	close: function(form) {
//		var compID = form.getRoot().id;
//        this.remove(this.get(compID));
//		this.formID && YIUI.FormStack.removeForm(this.formID);
//	}
});
YIUI.reg('stackcontainer', YIUI.Panel.StackContainer);