YIUI.UIUtil = (function () {
    var Return = {
        getCompValue: function (control, table) {
            var compValue = null;
            var value = null;

            var columnKey = control.columnKey;

            if (table.isValid()) {
                value = table.getByKey(columnKey);
            }
            if (value == null) {
                return value;
            }
            var type = control.type;
            var itemKey;
            switch (type) {
                case YIUI.CONTROLTYPE.DICT:
                case YIUI.CONTROLTYPE.COMPDICT:
                case YIUI.CONTROLTYPE.DYNAMICDICT:
                    itemKey = control.itemKey;
                    if (control.multiSelect) {
                        if ($.isEmptyObject(value)) {
                            break;
                        }
                        if (type == YIUI.CONTROLTYPE.DYNAMICDICT) {
                            itemKey = table.getByKey(columnKey + "ItemKey");
                        }

                        if (type == YIUI.CONTROLTYPE.COMPDICT) {
                            YIUI.ViewException.throwException(YIUI.ViewException.COMPDICT_CANNOT_SET_MULTIDICT, control.key);
                        }
                    } else {
                        if ((parseInt(value)) <= 0) {
                            break;
                        }
                        if (type == YIUI.CONTROLTYPE.DYNAMICDICT) {
                            itemKey = table.getByKey(columnKey + "ItemKey");

                            if (itemKey == null || itemKey.length() == 0) {
                                YIUI.ViewException.throwException(YIUI.ViewException.DYNAMICDICT_ITEMKEY_NULL, control.key);
                            }
                        } else if (type == YIUI.CONTROLTYPE.COMPDICT) {
                            itemKey = table.getByKey(columnKey + "ItemKey");
                            if (itemKey == null || itemKey.length() == 0) {
                                YIUI.ViewException.throwException(YIUI.ViewException.COMPDICT_ITEMKEY_NULL, control.key);
                            }
                            if (control.multiSelect) {
                                YIUI.ViewException.throwException(YIUI.ViewException.COMPDICT_CANNOT_SET_MULTIDICT, control.key);
                            }

                        }
                    }

                    //是否有预加载的caption字段
                    var captionKey = columnKey + "_caption";
                    var columnIndex = table.indexByKey(captionKey);
                    if(columnIndex > 0){

                    }else{
                        compValue = this.convertDictValue(itemKey, control, value);
                    }

                    break;
                default:
                    compValue = value;
            }
            return compValue;
        },

        convertDictValue: function (itemKey, dict, value) {
            var ret = null;
            if (dict.multiSelect) {
                var ids = value;
                if (ids.length > 0) {
                    var oids = ids.split(",");
                    if (oids.length > 0) {
                        var list = [];
                        var data = null;
                        for (var i = 0, len = oids.length; i < len; i++) {
                            data = {
                                itemKey: itemKey,
                                oid: oids[i]
                            };
                            list.add(data);
                        }
                        ret = list;
                    }
                }
            } else {
                var oid = parseFloat(value);
                var data = {
                    itemKey: itemKey,
                    oid: oid
                };
                ret = data;
            }
            return ret;
        },


        format: function (format, args, startPos) {
            var result = "";
            var length = format.length;
            var Para = function () {
                this.index = -1;
                this.setIndex = function (index) {
                    this.index = index;
                };
                this.getIndex = function () {
                    return this.index;
                }
            };
            var v = [];
            var l_i = 0;
            var i = 0;
            while (i < length) {
                var c = format.charAt(i);
                if (c == '{') {
                    var s_b = i;
                    var s_e = -1;
                    // 潜在的参数
                    ++i;
                    if (i < length) {
                        c = format.charAt(i);
                        if ($.isNumeric(c)) {
                            while ($.isNumeric(c) && i < length) {
                                ++i;
                                c = format.charAt(i);
                            }
                            if (i < length) {
                                if (c == '}') {
                                    s_e = i;
                                }
                                ++i;
                            }
                        } else {
                            ++i;
                        }
                    }
                    if (s_e != -1) {
                        // 生成之前的字符串
                        if (l_i < s_b) {
                            v.push(format.substring(l_i, s_b));
                        }

                        // 找到一个参数
                        var p = new Para();
                        var s = format.substring(s_b + 1, s_e);
                        p.setIndex(parseInt(s));
                        v.push(p);
                        l_i = s_e + 1;
                    }
                } else {
                    ++i;
                }
            }
            if (l_i < i) {
                v.push(format.substring(l_i));
            }

            var obj;
            for (var vi = 0, len = v.length; vi < len; vi++) {
                obj = v[vi];
                if (obj instanceof  Para) {
                    result += args[obj.getIndex() - 1 + startPos];
                } else {
                    result += obj;
                }
            }

            return result;
        },
        
        show: function(jsonObj, cxt, formExist, type) {
            var metaForm = new YIUI.MetaForm(jsonObj);
        	var $form = null;
        	switch(type) {
                case YIUI.ShowType.Gantt:
                    var newForm = YIUI.FormBuilder.build(metaForm);
                    var container = cxt.form.getContainer();
                    container.build(newForm);
                    newForm.pFormID = cxt.form.formID;
                    $form = newForm;
                    break;
        		case YIUI.ShowType.Map:
        			var newForm = YIUI.FormBuilder.build(metaForm);
        	        var container = cxt.form.getContainer();
        	        container.build(newForm);
        	        newForm.pFormID = cxt.form.formID;
        	        $form = newForm;
        		break;
        		case YIUI.ShowType.WorkItem:
        			var form = cxt.form;
        			var newForm = YIUI.FormBuilder.build(metaForm);
                    var container = form.getDefContainer();
                    if (container == null) {
                        container = form.getContainer();
                    }
                    newForm.setContainer(container);
                    newForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW, YIUI.BPMConstants.WORKITEM_VIEW);
                    newForm.pFormID = form.formID;
                    container.build(newForm);
        	        $form = newForm;
    			break;
        		case YIUI.ShowType.Dict:
        		case YIUI.ShowType.Tree:
        			$form = this.showByForm(metaForm, cxt);
        			break;
        		default:
        			if(formExist && !metaForm.hasForm) {
        				$form = this.showByDoc(metaForm.document, cxt);
                	} else if(formExist) {
                		$form = this.replaceForm(metaForm, cxt);
                	} else {
                		$form = this.showByForm(metaForm, cxt);
                	}
        		break;
        	}
        	return $form;
        },
        
        showByForm: function(metaForm, cxt) {
        	var pForm = cxt.form;
        	var formID = -1;
        	var container = cxt.container;
        	var form = YIUI.FormBuilder.build(metaForm, cxt.target);
        	if(cxt.OID > -1) {
        		form.setOID(cxt.OID);
        	}
        	if(pForm) {
            	container = pForm.getDefContainer();
                if (!container) {
                    container = pForm.getContainer();
                }
                if (pForm.mergeOpt) {
                    var expOpts = {
                        formID: form.formID,
                        items: form.operations,
                        metaItems: form.metaOpts
                    };
                    pForm.expOpts = expOpts;
                }
                form.pFormID = pForm.formID;
        	}
            if(cxt.entryPath) {
            	form.entryPath = cxt.entryPath;
            }
            if(cxt.entryParas) {
            	form.entryParas = cxt.entryParas;
            }
        	form.newDocument().then(function(doc) {
    			form.setDocument(doc);
                var optQueue = null;
                if(cxt.optType) {
                	switch(cxt.optType) {
                	case YIUI.OptType.NEW:
                		optQueue = new YIUI.OptQueue(new YIUI.NewOpt(form));
                		break;
                	case YIUI.OptType.LOAD:
                		optQueue = new YIUI.OptQueue(new YIUI.LoadOpt(form));
                		break;
                	}
                }
                optQueue && form.setOptQueue(optQueue);

        		if (form.target == YIUI.FormTarget.MODAL) {
                    YIUI.FormParasUtil.processCallParas(pForm, form);
        			form.doOnLoad();
        			form.showDocument();
        		} else {
        			form.doOnLoad();
        			if(!form.willShow()){
        				form.showDocument();
        			}
        		}
        	});
            
            if (form.target != YIUI.FormTarget.MODAL) {
                if (form.target == YIUI.FormTarget.STACK) {
                	form.isStack = true;
                }
                container.build(form);
            }
            return form;
        },
        
        showByDoc: function(doc, cxt) {
        	var form = cxt.form;
        	form.setDocument(doc);
        	form.showDocument();
        	return form;
        },

        /**
         * form: 被替换的form对象
         * formJson: 需要替换成的form的json序列化
         * cxt: 上下文环境
         */
        replaceForm: function (formJson, cxt) {
        	var form = cxt.form;
            if (form.formKey != formJson.form.key) return form;
            var container = form.getContainer();
            var newForm = null;
            formJson.form.formID = form.formID;
            if (container) {
                var el = form.getRoot().el;
                var selLi = $("li[aria-controls=" + el.attr("id") + "]", container.el);;
                var ul = selLi.parent();
                var prevLi = selLi.prev();
                var nextLi = selLi.next();

                container.removeForm(form);

                newForm = YIUI.FormBuilder.build(formJson);
                newForm.entryKey = form.entryKey;
                container.isReplace = true;
                container.build(newForm);
                var newEl = newForm.getRoot().el;
                var newLi = $("li[aria-controls=" + newEl.attr("id") + "]", ul);
                if (prevLi.length > 0) {
                    prevLi.after(newLi);
                } else {
                    nextLi.before(newLi);
                }
            } else {
                var parent = form.getRoot().el.parent();
                parent.empty();
                YIUI.FormStack.removeForm(form.formID);
                newForm = YIUI.FormBuilder.build(formJson);
                newForm.getRoot().render(parent);
            }
            newForm.pFormID = form.pFormID;
            newForm.initOperationState = form.initOperationState;
            newForm.target = form.target;
            newForm.OID = form.OID;
            if (newForm.target == 2) {
                $("#" + form.formID).attr("id", newForm.formID);
            }
            newForm.dictCaption = form.dictCaption;
            var sysExpVals = $.extend(form.sysExpVals, newForm.sysExpVals);
            newForm.sysExpVals = sysExpVals;
            cxt.form = newForm;
            return newForm;
        },
        
        saveDocument: function(form) {
        	var paras = form != null ? form.getParas() : null;
        	var document = form.getDocument();
            document = YIUI.DataUtil.toJSONDoc(document);
        	var params = {
            	cmd: "SaveDocument",
            	parameters: paras.toJSON(),
            	document: $.toJSON(document),
            	formKey: form.getFormKey()
            };
        	var success = function(doc) {
            	form.setOperationState(YIUI.Form_OperationState.Default);
            	form.setDocument(doc);
				form.showDocument();
            };
            Svr.SvrMgr.saveDocument(params, success);
        },
        
        getDocument: function(form) {
        	var parameters = form != null ? form.getParas() : null;
    		var filterMap = form.getFilterMap();
    		if(filterMap) {
                if(filterMap.OID == null || filterMap.OID == -1){
                    filterMap.OID = form.getOID();
                }
    			filterMap = $.toJSON(filterMap);
    		} else {
    			filterMap = "";
    		}
            var params = {
        		cmd: "GetDocument",
        		OID: form.getOID(),
                formKey: form.getFormKey(),
                operationState: form.operationState,
                parameters: parameters.toJSON(),
                filterMap: filterMap,
                condition: $.toJSON(form.getCondParas()),
                doPostShow: false
            };
            var doc = Svr.SvrMgr.getDocument(params);
            return doc;
        },
        
        showDocument: function(form) {
    		var doc = this.getDocument(form);
    		doc.done(function(doc) {
                form.setDocument(doc);
                form.showDocument();
    		});
        },
        
        isNull: function (v) {
            return (v == undefined || v == null);
        },
        getCompareType: function (v1, v2) {
            var type = -1;
            if (this.isNull(v1)) {
                var temp = v2;
                v2 = v1;
                v1 = temp;
            }
            if (this.isNull(v1)) {
                type = DataType.NUMERIC;
            } else if (typeof v1 == "string") {
                if ($.isNumeric(v1)) {
                    type = DataType.NUMERIC;
                } else {
                    type = DataType.STRING;
                }
            } else if (typeof v1 == "number") {
                if (this.isNull(v2)) {
                    type = DataType.NUMERIC;
                } else if (typeof v2 == "string") {
                    type = DataType.STRING;
                } else {
                    type = DataType.NUMERIC;
                }
            } else if (typeof  v1 == "boolean") {
                if (this.isNull(v2)) {
                    type = DataType.NUMERIC;
                } else if (typeof v2 == "number" || v2 instanceof Decimal) {
                    type = DataType.NUMERIC;
                } else if (typeof v2 == "string") {
                    type = DataType.STRING;
                } else if (typeof v2 == "boolean") {
                    type = DataType.BOOLEAN;
                }
            } else if (v1 instanceof Decimal) {
                if (this.isNull(v2)) {
                    type = DataType.NUMERIC;
                } else if (typeof v2 == "number" || v2 instanceof Decimal) {
                    type = DataType.NUMERIC;
                } else if (typeof v2 == "string") {
                    type = DataType.STRING;
                } else if (typeof v2 == "boolean") {
                    type = DataType.BOOLEAN;
                }
            }
            return type;
        },
        dataType2JavaDataType: function (dataType) {
            switch (dataType) {
                case YIUI.DataType.LONG:
                    return YIUI.JavaDataType.USER_LONG;
                case YIUI.DataType.BINARY:
                    return YIUI.JavaDataType.USER_BINARY;
                case YIUI.DataType.BOOLEAN:
                    return YIUI.JavaDataType.USER_BOOLEAN;
                case YIUI.DataType.DATE:
                case YIUI.DataType.DATETIME:
                    return YIUI.JavaDataType.USER_DATETIME;
                case YIUI.DataType.DOUBLE:
                case YIUI.DataType.FLOAT:
                case YIUI.DataType.NUMERIC:
                    return YIUI.JavaDataType.USER_NUMERIC;
                case YIUI.DataType.INT:
                    return YIUI.JavaDataType.USER_INT;
                case YIUI.DataType.STRING:
                case YIUI.DataType.TEXT:
                case YIUI.DataType.FIXED_STRING:
                    return YIUI.JavaDataType.USER_STRING;
            }
            return -1;
        }
    };

    return Return;
})();