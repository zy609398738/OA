/**
 * 按钮控件。
 */
YIUI.Control.SearchBox = YIUI.extend(YIUI.Control, {

    handler: YIUI.SearchBoxHandler,
    
    behavior: YIUI.SearchBoxBehavior,
    
	providerKey: null,
	providerFormulaKey: null,
	providerDependency: null,
	
    onRender: function (parent) {
        this.base(parent);
        this.el.addClass("ui-srch");
        
        this.txt = $("<input type='text' class='txt'/>").appendTo(this.el);
        this.btn = $("<button class='btn'>...</button>").appendTo(this.el);
        
    },

    onSetHeight: function (height) {
        this.base(height);
    },

    onSetWidth: function (width) {
        this.base(width);
        this.txt.css("width", width - this.btn.outerWidth());
    },

    setEnable: function (enable) {
        this.base(enable);
        
    },
    
    getControlValue: function() {
    	return this.txt.val();
    },

    checkEnd: function(value) {
    	this.value = value;
    	this.txt.val(this.value);
    },
    
    dependedValueChange: function(dependedField){
		var meta = this.getMetaObj();
		if(!meta.providerKey){
			if(meta.providerDependency == dependedField){
				this.setValue(null, false, true);
				this.handler.setNeedRefresh(true);
			}
		}
	},
    
    install: function () {
        this.base();
        var self = this;

        self.btn.click(function(e) {
        	var value = self.getControlValue();
    		self.handler.doOnClick(self);
        });
        self.txt.blur(function(e) {
        	var value = self.getControlValue();
    		self.handler.autoComplete(self, value);
        });
    }

	
});
YIUI.reg('searchbox', YIUI.Control.SearchBox);