
var View = View || {};

(function() {
	View.FuncMap = new HashMap();
	Expr.regCluster(View.FuncMap, Expr.InnerFuns);
	Expr.regCluster(View.FuncMap, UI.BaseFuns);

	View.EvalEnv = function(form) {
		this.form = form;
        this.parser = new Expr.Parser(View.FuncMap);
	};

	Lang.impl(View.EvalEnv, {
		get : function(cxt, id, scope, obj){
			var form = cxt.form;
            var result = null;
    		if ( obj ) {
    			var heap = scope.getHeap();
    			if (heap.contains(obj)) {
    				var variable = heap.get(obj);
    				var valueImpl = null;
    				var para = scope.getPara(obj);
    				if ( para != null ) {
    					valueImpl = para;
    				} else {
    					if ( variable instanceof DataDef.DataTable ) {
    						valueImpl = new YIUI.TblValImpl();
    						scope.addPara(obj, valueImpl);
    					} else if ( variable instanceof DataDef.Document ) {
    						valueImpl = new YIUI.DocValImpl();
    						scope.addPara(obj, valueImpl);
    					} else if ( $.isObject(variable) ) {
    						valueImpl = new YIUI.JSONObjValImpl();
    						scope.addPara(obj, valueImpl);
    					} else if ( $.isArray(variable) ) {
    						valueImpl = new YIUI.JSONArrValImpl();
    						scope.addPara(obj, valueImpl);
    					}
    				}
    				result = valueImpl.getValue(variable, id);
    			} else {
    				result = YIUI.ExprUtil.getImplValue(form, id, cxt, obj);
    			}
    		} else {
    			result = YIUI.ExprUtil.getImplValue(form, id, cxt);
    		}
    		return result;
		},
		set : function(cxt, id, value, scope, obj){
			var form = cxt.form;
			if ( obj ) {
				var heap = scope.getHeap();
				if ( heap.contains(obj) ) {
					var variable = heap.get(obj);
					var valueImpl = null;
					var para = scope.getPara(obj);
					if ( para ) {
						valueImpl = para;
					} else {
						if ( variable instanceof DataDef.DataTable ) {
							valueImpl = new YIUI.TblValImpl();
							scope.addPara(obj, valueImpl);
						} else if ( variable instanceof DataDef.Document ) {
							valueImpl = new YIUI.DocValImpl();
							scope.addPara(obj, valueImpl);
						} else if ( $.isObject(variable) ) {
    						valueImpl = new YIUI.JSONObjValImpl();
    						scope.addPara(obj, valueImpl);
    					}
					}
					valueImpl.setValue(variable, id, value);
				} else {
					YIUI.ExprUtil.setImplValue(form, id, value, cxt);
				}
			} else {
				YIUI.ExprUtil.setImplValue(form, id, value, cxt);
			}
		},
		checkMacro: function(cxt, name) {
            var macro, form;
            if(cxt){
	            form = cxt.form;
	            if (form !== null && form !== undefined) {
	                macro = (form.macroMap == undefined) ? null : form.macroMap[name];
	                
	                if (macro == null) {
	                    var paras = {
	                        service: "WebMetaService",
	                        cmd: "GetMacro",
	                        formKey: form.getFormKey(),
	                        macroName: name
	                    };
	                    macro = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
	        		}
	        		
	            }
            }
            return macro;
		},
        evalMacro: function (cxt, scope, name, macro, args) {
            var newScope = new Expr.Scope(scope);
            var argsList = macro.args;
            if (argsList !== null && argsList !== undefined && argsList.length > 0) {
                var heap = newScope.getHeap();
                for (var i = 0; i < argsList.length; i++) {
                    heap.put(argsList[i], args[i]);
                }
            }
            var tree = new Expr.Tree();
            var form = cxt.form;
            return form.eval2($.trim(macro.content), tree, cxt, newScope);
            // return this.parser.eval(this, $.trim(macro.content), new Expr.Tree(), cxt, newScope);
        },
		getLoop: function(cxt, name,loop, obj) {
            var objectLoop = null;
            switch (loop) {
                case 0:
                    var key = obj.toString(), sepPos = key.indexOf(':'), para = null, comp;
                    if (sepPos > 0) {
                        para = key.substring(sepPos + 1);
                        key = key.substring(0, sepPos);
                    }
                    comp = cxt.form.getComponent(key);
                    if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                        objectLoop = new OBJLOOP.ListViewLoop(cxt, comp);
                    } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                        var includeEmptyRow = false;
                        if ("empty" == para) {
                            includeEmptyRow = true;
                        }
                        objectLoop = new OBJLOOP.GridLoop(cxt, comp, includeEmptyRow);
                    }
                    break;
            }
            return objectLoop;
		},
		resolveObject: function(self, scope, obj) {
			var newCxt = null;
			var form = self.form;
			if (Expr.S_SELF == obj.toLowerCase()) {
				newCxt = self;
			} else if (Expr.S_PARENT == obj.toLowerCase()) {
				var parent = form.getParentForm();
	            var cxt = new View.Context(parent);
				newCxt = cxt;
			} else {
				var comp = form.getComponent(obj);
				if (comp && comp.tagName ==  "stackcontainer") {
					var activeForm = comp.getActivePane();
					if (activeForm) {
						newCxt = activeForm.newCxt();
					} else {
						var viewCxt = {parent: form};
						newCxt = viewCxt;
					}
				} else {
					var v = scope.getHeap().get(obj);
					if ( v != null ) {
						newCxt = {obj: v};
					}
				}
			}
			return newCxt;
		},
		evalObject: function(cxt, obj, name, args) {
			return null;
		},
		evalFuncImpl: function(cxt, scope, obj, name) {
			var impl = null;
			var v = scope.getHeap().get(obj);
			if ( v ) {
				if ( v instanceof DataDef.DataTable ) {
					impl = View.TblFunImpl.get(name);
				} else if ( v instanceof DataDef.Document ) {
					impl = View.DocFunImpl.get(name);
				} else if ( $.isObject(v) ) {
					impl = View.JSONObjFunImpl.get(name);
				} else if ( $.isArray(v) ) {
					impl = View.JSONArrFunImpl.get(name);
				}
			}
			return impl;
		}
	});

	View.Parser = function(form) {
		this.form = form;
		this.parser = new Expr.Parser(View.FuncMap);
		this.env = new View.EvalEnv(form);
	};

	Lang.impl(View.Parser, {
        eval: function (script, cxt, hack) {
            var tree = new Expr.Tree();
            var scope = new Expr.Scope();
            return this.parser.eval(this.env, script, tree, cxt, scope);
        },
        eval2: function(script, tree, cxt, scope) {
        	return this.parser.eval(this.env, script, tree, cxt, scope);
        },
        evalByTree: function (tree, cxt, hack) {
            var scope = new Expr.Scope();
            return this.parser.evalByTree(this.env, tree, cxt, scope);
        },
        getSyntaxTree: function (script) {
            var tree = new Expr.Tree();
            this.parser.parse(script, tree);
            tree.opti();
            return tree;
        }
    });

	View.Context = function(form) {
		this.form = form;
		this.cxt = new Object();
	};

	Lang.impl(View.Context, {
		setParent: function(parent) {
			this.parent = parent;
		},
		getParent: function() {
			return this.parent;
		},
		setRowIndex: function(rowIndex) {
			this.rowIndex = rowIndex;
		},
		setColIndex: function(colIndex) {
			this.colIndex = colIndex;
		}
		
	});
})();
