// (function () {
//     YIUI.FormRender = function (options, callback) {
    	
//         var Return = {
//         	formKey: options.formKey,
//         	parameters: options.parameters || {},
//         	oid: options.oid || -1,
//         	formula: options.formula,
//         	formID: null,
//     		doLayout: function(width, height) {
//         		var form = YIUI.FormStack.getForm(this.formID);
//     			form.getRoot().doLayout(width, height);
//     		},
//         	render: function(ct) {
//         		if($.isString(ct)) {
//         			ct = $("#" + ct);
//         		}
//         		var self = this;
//         		ct.build = function(form) {
//         			this.empty();
//         			if(self.formID && self.formID != form.formID) {
//         				YIUI.FormStack.removeForm(ct.formID);
//         			}
//         			form.getRoot().render(this);
//         			form.setContainer(this);
//         			if(self.formula) {
//         		        var cxt = new View.Context(form);
//         				form.eval(self.formula, cxt, null);
//         			}
//         			self.formID = form.formID;
//         		};
//         		ct.removeForm = function(form) {
//         			form.getRoot().el.remove();
//         			YIUI.FormStack.removeForm(form.formID);
//         			if($.isFunction(ct.close)) {
//         				ct.close();
//         			}
//         		};
            	
//         		var success = function(jsonObj) {
//             		var pFormID;
//             		var form = YIUI.FormBuilder.build(jsonObj);
//             		if(form.target != YIUI.FormTarget.MODAL) {
//             			ct.build(form);
//             		}
//             		if($.isFunction(callback)) {
//             			callback(form);
//             		}
//             	};
//                 if(this.oid > -1) {
//                 	//打开指定单据
//                     var params = {formKey: this.formKey, oid: this.oid, callParas: $.toJSON(this.parameters)};
//                     Svr.SvrMgr.getEmptyForm(params).done(function(params) {
//                     	cxt.optType = YIUI.OptType.LOAD;
//                         if (target == YIUI.FormTarget.SELF) {
//                             YIUI.UIUtil.show(data, cxt, true);
//                             return;
//                         }
//                         cxt.target = target;
//                         YIUI.UIUtil.show(data, cxt, false);
//                     });
//                 } else {
//                     var params = {formKey: this.formKey, oid: this.oid, callParas: $.toJSON(this.parameters)};
//                     Svr.SvrMgr.getEmptyForm(params).done(function(params) {
//                         cxt.target = target;
//                         YIUI.UIUtil.show(data, cxt);
//                     });
//                 }
//         	}
//         };
        
//         return Return;
//     }
// })();