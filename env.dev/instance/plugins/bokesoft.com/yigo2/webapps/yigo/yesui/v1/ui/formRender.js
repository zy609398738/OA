(function () {
    YIUI.FormRender = function (options, callback) {
    	
        var Return = {
        	formKey: options.formKey,
        	parameters: options.parameters || {},
        	oid: options.oid || -1,
        	formula: options.formula,
        	formID: null,
    		doLayout: function(width, height) {
        		var form = YIUI.FormStack.getForm(this.formID);
    			form.getRoot().doLayout(width, height);
    		},
        	render: function(ct) {
        		if($.isString(ct)) {
        			ct = $("#" + ct);
        		}
        		var self = this;
        		ct.build = function(form) {
        			this.empty();
        			if(self.formID && self.formID != form.formID) {
        				YIUI.FormStack.removeForm(ct.formID);
        			}
        			form.getRoot().render(this);
        			form.setContainer(this);
        			if(self.formula) {
        				form.eval(self.formula, {form: form}, null);
        			}
        			self.formID = form.formID;
        		};
        		ct.removeForm = function(form) {
        			form.getRoot().el.remove();
        			YIUI.FormStack.removeForm(form.formID);
        			if($.isFunction(ct.close)) {
        				ct.close();
        			}
        		};
            	
        		var success = function(jsonObj) {
            		var pFormID;
            		var form = YIUI.FormBuilder.build(jsonObj);
            		if(form.target != YIUI.FormTarget.MODAL) {
            			ct.build(form);
            		}
            		if($.isFunction(callback)) {
            			callback(form);
            		}
            	};
                if(this.oid > -1) {
                	//打开指定单据
                    var params = {formKey: this.formKey, oid: this.oid, callParas: $.toJSON(this.parameters), cmd: "PureOpenForm"};
                    Svr.SvrMgr.dealWithPureForm(params, success);
                } else {
                    var params = {formKey: this.formKey, oid: this.oid, callParas: $.toJSON(this.parameters), cmd: "PureShowForm"};
                    params.async = true;
                    Svr.SvrMgr.dealWithPureForm(params, success);
                }
        	}
        };
        
        return Return;
    }
})();