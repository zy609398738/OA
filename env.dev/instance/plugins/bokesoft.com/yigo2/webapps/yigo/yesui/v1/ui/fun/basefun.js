UI.BaseFuns = (function () {
    var funs = {};
    var splitPara = function (para) {
        if (!para) {
            return null;
        }
        para = YIUI.TypeConvertor.toString(para);
        var mapCallback = {}, len = para.length,
            key = "", deep = 0, start = 0;
        for (var i = 0; i < len; i++) {
            var c = para.charAt(i);
            if (c == ':' && deep === 0) {
                key = para.substring(start, i).trim();
            } else if (c == ',' && deep === 0) {
                start = ++i;
            } else if (c == '{') {
                if (deep === 0) {
                    start = ++i;
                }
                deep++;
            } else if (c == '}') {
                deep--;
                if (deep == 0) {
                    mapCallback[key] = para.substring(start, i);
                }
            }
        }

        return mapCallback;
    };
    var processPara = function (cxt) {
        var form = cxt.form;
        if (form != null) {
            var paraCollection = form.getParaCollection();
            if (paraCollection != null) {
                for (var i = 0, len = paraCollection.length; i < len; i++) {
                    var para = paraCollection[i], value;
                    switch (para.type) {
                        case YIUI.ParameterSourceType.CONST:
                            value = para.value;
                            break;
                        case YIUI.ParameterSourceType.FORMULA:
                            value = form.eval(para.formula, cxt);
                            break;
                    }
                    form.setPara(para.key, value);
                }
            }
        }
    };

    funs.Confirm = function (name, cxt, args) {

        //提示框显示样式
        var type = YIUI.Dialog_MsgType.DEFAULT;
        if (args.length > 1) {
            if (args[1] == "YES_NO") {
                type = YIUI.Dialog_MsgType.YES_NO;
            } else if (args[1] == "YES_NO_CANCEL") {
                type = YIUI.Dialog_MsgType.YES_NO_CANCEL;
            }
        }

        var options = {
            msg: YIUI.TypeConvertor.toString(args[0]),
            msgType: type
        };
        var dialog = new YIUI.Control.Dialog(options);
        dialog.render();

        var optKey = cxt.optKey;
        if (optKey) {
            var option = cxt.form.getOptMap()[optKey];
            if (option) {
                var excpAction = option.opt.excpAction;
                dialog.regExcp(excpAction);
            }
        }

        var mapCallback = {};
        if (args.length > 2) {
            if (args[2]) {
                mapCallback = splitPara(args[2]);
            }
        }
        var form = cxt.form;
        dialog.setOwner(form);
        for (var o in mapCallback) {
            dialog.regEvent(o, function (opt) {
                form.eval(mapCallback[opt].trim(), cxt, null);
            });
        }
    };

    funs.GetFormByType = function (name, cxt, args) {
        var paras = {
            cmd: "GetFormByType",
            service: "PureMeta",
            filter: args[0]
        };
        var list = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return list.items;
    };

    funs.GetDictValue = function (name, cxt, args) {
        var itemKey = args[0];
        var oid = args[1];
        var fieldKey = args[2];
        return YIUI.DictService.getDictValue(itemKey, oid, fieldKey);

    };

    funs.GetDictOID = function (name, cxt, args) {
        var itemKey = args[0];
        var fieldKey = args[1];
        var value = args[2];

        var oid = 0;
        var item = YIUI.DictService.locate(itemKey, fieldKey, value);
        if (item) {
            oid = item.oid;
        }

        return oid;
    };

    funs.ClearSelection = function (name, cxt, args) {
        var controlKey = args[0];
        var form = cxt.form;
        var cmp = form.getComponent(controlKey);
        if (cmp && cmp.type == YIUI.CONTROLTYPE.DICTVIEW) {
            cmp.clearSelection();
        }
    };

    funs.CopyNew = function (name, cxt, args) {
        var form = cxt.form;
        var opt = new YIUI.CopyNewOpt(form);
        opt.doOpt();
        return true;
    };

    funs.ClearAllRows = function (name, cxt, args) {
        var form = cxt.form, key = args[0], comp = form.getComponent(key);
        var retainEmpty = true;
        if (args.length > 1) {
            retainEmpty = args[1];
        }
        if (comp) {
            switch (comp.type) {
                case YIUI.CONTROLTYPE.LISTVIEW:
                    comp.clearAllRows();
                    comp.repaint();
                    break;
                case YIUI.CONTROLTYPE.GRID:
                    var grid = comp, got = false;
                    var row, len = grid.getRowCount();
                    for (var i = len - 1; i >= 0; i--) {
                        row = grid.getRowDataAt(i);
                        if (!row.isDetail)
                            continue;
                        // 如果需要保留空白行
                        if (retainEmpty && row.bookmark === undefined && !got) {
                            got = true;
                            continue;
                        }
                        grid.deleteGridRow(i);
                        if (row.bookmark !== undefined) {
                            grid.clearAllSubDetailData(i);
                        }
                    }
                    grid.refreshGrid();
                    break;
                default:
                    break;
            }
        }
    };

    funs.ToLongArray = function (name, cxt, args) {
        //参数
        var arrs = [];
        var obj = args[0];
        if ($.isString(obj)) {
            var str = obj.split(",");
            for (var i = 0, len = str.length; i < len; i++) {
                var arr = YIUI.TypeConvertor.toLong(str[i]);
                arrs.push(arr);
            }
        } else if ($.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                var arr;
                var o = obj[i];
                if (o instanceof YIUI.ItemData) {
                    arr = o.getOID();
                }
                arrs.push(arr);
            }
        }
        return arrs;
    };

    funs.ToJSONArray = function (name, cxt, args) {
        var arrs = [];
        var obj = args[0];
        if ($.isString(obj)) {
            var str = obj.split(",");
            for (var i = 0, len = str.length; i < len; i++) {
                var arr = $.toJSON(str[i]);
                arrs.push(arr);
            }
        } else if ($.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                var arr;
                var o = obj[i];
                if (o instanceof YIUI.ItemData) {
                    arr = o.toJSON();
                }
                arrs.push(arr);
            }
        }
        return arrs;
    };

    funs.UICheck = function (name, cxt, args) {
        var form = cxt.form, uiCheckOpt = new YIUI.UICheckOpt(form);
        uiCheckOpt.doOpt();
    };

    funs.ChangePWD = function (name, cxt, args) {
        var operatorID = args[0];
        var password = args[1];
        var newPassword = args[2];

        var rsa = new RSAKey();
        var publicKey = Svr.SvrMgr.getPublicKey({async: false});
        rsa.setPublic(publicKey.modulus, publicKey.exponent);
        password = rsa.encrypt(password);
        password = BASE64.encoder(password);

        newPassword = rsa.encrypt(newPassword);
        newPassword = BASE64.encoder(newPassword);

        var paras = {
            service: "SessionRights",
            cmd: "ChangePWD",
            operatorID: operatorID.toString(),
            password: password,
            newPassword: newPassword
        };
        Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
    };
    funs.New = function (name, cxt, args) {
        var formKey = args[0];
        var target = YIUI.FormTarget.NEWTAB;
        if (args.length > 1) {
            target = YIUI.FormTarget.parse(args[1]);
        }
        var tsParas;
        if (args.length > 2) {
            tsParas = args[2];
        }
        if (target != YIUI.FormTarget.SELF) {
            var params = {formKey: formKey, cmd: "PureNewForm"};
            if (tsParas) {
                tsParas = splitPara(tsParas);
                for (var key in tsParas) {
                    var value = cxt.form.eval(tsParas[key], cxt);
                    cxt.form.setCallPara(key, value);
                }
                var callParas = cxt.form.getCallParas();
                params.callParas = JSON.stringify(callParas.getMap());
            }
            var success = function (jsonObj) {
                cxt.target = target;
                YIUI.UIUtil.show(jsonObj, cxt, false);
            };
            Svr.SvrMgr.dealWithPureForm(params, success);

        } else {
            var opt = new YIUI.NewOpt(cxt.form, true);
            opt.doOpt();
        }

    };

    funs.Show = function (name, cxt, args) {
        var form = cxt.form;
        var formKey = args[0];
        var container = form.getContainer();
        var target = YIUI.FormTarget.NEWTAB;
        if (args.length > 1) {
            target = YIUI.FormTarget.parse(args[1]);
        }
        var params = {formKey: formKey, cmd: "PureShowForm"};
        var success = function (jsonObj) {
            cxt.target = target;
            YIUI.UIUtil.show(jsonObj, cxt, false);
        };
        Svr.SvrMgr.dealWithPureForm(params, success);
        return true;
    };

    funs.Load = function (name, cxt, args) {
        var form = cxt.form;
        var loadOpt = new YIUI.LoadOpt(form);
        loadOpt.doOpt();
    };

    funs.Edit = function (name, cxt, args) {
        var form = cxt.form;
        var editOpt = new YIUI.EditOpt(form);
        editOpt.doOpt();
    };

    funs.IsEdit = function (name, cxt, args) {
        var form = cxt.form;
        var state = -1;
        if (form != null) {
            state = form.getOperationState();
        }
        return state == YIUI.Form_OperationState.Edit;
    };

    funs.Open = function (name, cxt, args) {
        var form = cxt.form;
        var formKey = args[0], OID = args[1];
        var container = form.getContainer();
        var target = YIUI.FormTarget.NEWTAB;
        if (args.length > 2) {
            target = YIUI.FormTarget.parse(args[2]);
        }
        var tsParas;
        if (args.length > 3) {
            tsParas = args[3];
        }
        var params = {
            formKey: formKey,
            oid: OID.toString(),
            cmd: "PureOpenForm",
            operationState: form.getOperationState()
        };
        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = form.eval(tsParas[key], cxt);
                cxt.form.setCallPara(key, value);
            }
            var callParas = form.getCallParas();
            params.callParas = JSON.stringify(callParas.getMap());
        }
        var success = function (jsonObj) {
            if (target == YIUI.FormTarget.SELF) {
                YIUI.UIUtil.show(jsonObj, cxt, true);
                return;
            }
            cxt.target = target;
            YIUI.UIUtil.show(jsonObj, cxt, false);
        };
        Svr.SvrMgr.dealWithPureForm(params, success);
        return true;
    };

    funs.Save = function (name, cxt, args) {
        var saveOpt = YIUI.SaveOpt(cxt.form);
        saveOpt.doOpt();
    };

    funs.SaveData = function (name, cxt, args) {
        var form = cxt.form, uiCheckOpt = new YIUI.UICheckOpt(form);
        if (!uiCheckOpt.doOpt()) return false;
        var formDocument = form.getDocument(),
            copyDoc = $.extend(true, {}, formDocument);
        var gridMap = form.getGridInfoMap(), tableKey, shadowTableKey, shadowTable;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            tableKey = gridMap[i].tableKey;
            shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
            shadowTable = copyDoc.getByKey(shadowTableKey);
            if (shadowTable != undefined || shadowTable != null) {
                copyDoc.remove(tableKey);
                shadowTable.key = tableKey;
            }
        }
        var document = YIUI.DataUtil.toJSONDoc(copyDoc);
        processPara(cxt);
        var paras = form != null ? form.getParas() : null;
        var params = {
            cmd: "PureSaveData",
            parameters: paras.toJSON(),
            document: $.toJSON(document),
            formKey: form.getFormKey()/*,
             noForm: false*/
        };
        var resultJson = Svr.SvrMgr.dealWithPureData(params);
        YIUI.UIUtil.show(resultJson, cxt, true);
        form.setOperationState(YIUI.Form_OperationState.Default);
        return true;
    };

    funs.LoadData = function (name, cxt, args) {
        var form = cxt.form;
        processPara(cxt);

        // 修改数据加载类型
        var filterMap = form.getFilterMap();
        var documentType = form.type == YIUI.Form_Type.Detail ? YIUI.DocumentType.DETAIL : YIUI.DocumentType.DATAOBJECT;
        filterMap.setType(documentType);

        var paras = form != null ? form.getParas() : null;
        var params = {
            cmd: "PureLoadData",
            oid: form.getDocument().oid,
            form: form.toJSON(),
            formKey: form.getFormKey(),
            parameters: paras.toJSON(),
            filterMap: $.toJSON(form.getFilterMap()),
            condition: $.toJSON(form.getCondParas()),
            operationState: form.getOperationState(),
            noForm: false
        };
        var result = Svr.SvrMgr.loadFormData(params);

        YIUI.FormBuilder.diff(form, result);
    };

    funs.ShowData = function (name, cxt, args) {
        var form = cxt.form;
//		form.showDocument();

    };

    funs.DealCondition = function (name, cxt, args) {

        var isParent = false;
        if (args.length > 0) {
            isParent = args[0];
        }
        var form = cxt.form;
        var target = (isParent && form.getParentForm() != null) ? form.getParentForm() : form;
        var condFomKey = null;
        condFomKey = form.getFormKey();
        var paras = target.getCondParas();
        if ($.isEmptyObject(paras)) {
            paras = new ConditionParas();
            target.setCondParas(paras);
        } else {
            paras.clear();
        }
        paras.setCondFormKey(condFomKey);
        var comp = null;
        var condition = null;
        var condItem = null;
        var value = null;
        var compList = form.getComponentList();
        for (var i in compList) {
            var cmp = compList[i];
            if (cmp.value && cmp.condition) {
                condition = cmp.condition;
                value = cmp.value;
                if (cmp.type == YIUI.CONTROLTYPE.DATEPICKER) {
                    value = cmp.getValue().getTime();
                    condition.onlyDate = YIUI.TypeConvertor.toBoolean(cmp.getMetaObj().isOnlyDate);
                } else if (cmp.type == YIUI.CONTROLTYPE.NUMBEREDITOR) {
                    if (value == 0) continue;
                } else if (cmp.type == YIUI.CONTROLTYPE.COMPDICT
                    || cmp.type == YIUI.CONTROLTYPE.DICT
                    || cmp.type == YIUI.CONTROLTYPE.DYNAMICDICT) {

                    if (cmp.multiSelect) {
                        if (value.length == 1 && value[0].oid == 0) {
                            continue;
                        }
                        //多选的情况 添加界面过滤条件。 汇总节点选中， 并非所有子节点 都显示。
                        cmp.checkDict();
                        var filter = cmp.getDictTree().dictFilter;
                        if (filter != null) {
                            condition.filter = filter;
                        }
                    }
                    condition.itemKey = cmp.itemKey;
                    condition.stateMask = cmp.stateMask;
                }
                condition.value = value;
                paras.add(condition);
            } else if (cmp.condition && cmp.condition.limitToSource) {
                condition = cmp.condition;
                if (cmp.type == YIUI.CONTROLTYPE.COMPDICT
                    || cmp.type == YIUI.CONTROLTYPE.DICT
                    || cmp.type == YIUI.CONTROLTYPE.DYNAMICDICT) {

                    //多选的情况 添加界面过滤条件。 汇总节点选中， 并非所有子节点 都显示。
                    cmp.checkDict();
                    var filter = cmp.getDictTree().dictFilter;
                    if (filter == null) {
                        continue;
                    }

                    condition.filter = filter;
                    condition.itemKey = cmp.itemKey;
                    condition.stateMask = cmp.stateMask;
                    paras.add(condition);
                }

            }
        }
        var filterMap = form.getFilterMap().filterMap;
        for (var i = 0, len = filterMap.length; i < len; i++) {
            filterMap[i].startRow = 0;
        }
    };

    funs.ReadOnly = function (name, cxt, args) {
        var form = cxt.form;
        var operationState = -1;
        if (form != null) {
            operationState = form.getOperationState();
        }
        return operationState == YIUI.Form_OperationState.Default;
    };

    funs.Cancel = function (name, cxt, args) {
        var form = cxt.form;
        if (form.getOperationState() == YIUI.Form_OperationState.New) {
            form.close();
        } else if (form.getOperationState() == YIUI.Form_OperationState.Edit) {
            var formKey = form.formKey,
                OID = form.OID;
            var params = {formKey: formKey, oid: OID, cmd: "PureOpenForm", async: false};
            var success = function (jsonObj) {
                YIUI.UIUtil.show(jsonObj, cxt, true);
            };
            Svr.SvrMgr.dealWithPureForm(params, success);
        }
    };

    funs.ContainsKey = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var comp = form.getComponent(key);
        if (comp) return true;

        var location = form.getCellLocation(key);
        if (location)
            return true;

        return false;
    };

    funs.SetEnable = function (name, cxt, args) {
        var form = cxt.form,
            controlKey = args[0],
            enable = args[1],
            cmp = form.getComponent(controlKey);
        if (cmp != null) {
            cmp.setEnable(enable);
        }
    };

    funs.GetClusterID = function (name, cxt, args) {
        var id = $.cookie("clusterid") || -1;
        return parseInt(id);
    };

    funs.OpenDict = function (name, cxt, args) {
        var pForm = cxt.form;
        var formKey = args[0],
            OID = YIUI.TypeConvertor.toString(args[1]);
        //参数3保留

        var tsParas;
        if (args.length > 3) {
            tsParas = args[3];
        }

        var params = {
            async: false,
            formKey: formKey,
            oid: OID,
            cmd: "PureOpenForm"
        };

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = pForm.eval(tsParas[key], cxt);
                pForm.setCallPara(key, value);
            }
            var callParas = pForm.getCallParas();
            params.callParas = JSON.stringify(callParas.getMap());
        }

        var success = function (jsonObj) {
            YIUI.UIUtil.show(jsonObj, cxt, false, YIUI.ShowType.Dict);
        };
        Svr.SvrMgr.dealWithPureForm(params, success);

    };

    funs.NewDict = function (name, cxt, args) {
        var formKey = args[0];
        var pForm = cxt.form;
        //参数2保留
        var tsParas;
        if (args.length > 2) {
            tsParas = args[2];
        }

        var params = {
            async: false,
            formKey: formKey,
            cmd: "PureNewForm"
        };

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = pForm.eval(tsParas[key], cxt);
                pForm.setCallPara(key, value);
            }
            var callParas = pForm.getCallParas();
            params.callParas = JSON.stringify(callParas.getMap());
        }

        var success = function (jsonObj) {
            YIUI.UIUtil.show(jsonObj, cxt, false, YIUI.ShowType.Dict);
        };
        var resultJson = Svr.SvrMgr.dealWithPureForm(params, success);
    };

    var doMap = function (name, cxt, args) {
        if (args.length < 2)
            YIUI.ViewException.throwException(YIUI.ViewException.NO_KEY_TARGET_BILL);
        var form = cxt.form,
            mapKey = args[0],
            toNewForm = true,
            tgFormKey = args[1],
            formDoc = form.getDocument() ,
            copyDoc = formDoc.clone();
        var gridMap = form.getGridInfoMap(), tableKey, shadowTableKey, shadowTable;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            tableKey = gridMap[i].tableKey;
            shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
            shadowTable = copyDoc.getByKey(shadowTableKey);
            if (shadowTable != undefined || shadowTable != null) {
                copyDoc.remove(tableKey);
                shadowTable.key = tableKey;
            }
        }
        var doc = YIUI.DataUtil.toJSONDoc(copyDoc);
        var params = {
            tgFormKey: tgFormKey,
            srcFormKey: form.formKey,
            srcDoc: $.toJSON(doc),
            cmd: "PureMap",
            toNewForm: toNewForm,
            mapKey: mapKey
        };
        var resultJson = Svr.SvrMgr.doMapEvent(params);

        var newForm = YIUI.UIUtil.show(resultJson, cxt, false, YIUI.ShowType.Map);

        var mapWorkitemInfo = false;
        if (args.length > 2)
            mapWorkitemInfo = YIUI.TypeConvertor.toBoolean(args[2]);

        if (mapWorkitemInfo) {
            var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
            var newDoc = newForm.getDocument();
            newDoc.putExpandData(YIUI.BPMKeys.SaveBPMMap_KEY, info.WorkitemID);
            newDoc.expDataType[YIUI.BPMKeys.SaveBPMMap_KEY] = YIUI.ExpandDataType.LONG;
        }
        if (args.length > 3) {
            var postFormula = YIUI.TypeConvertor.toString(args[3]);
            newForm.eval(postFormula, {form: newForm}, null);
        }
    };

    funs.Map = function (name, cxt, args) {
        doMap(name, cxt, args);
    };

    funs.MidMap = function (name, cxt, args) {
        doMap(name, cxt, args);
    };

    funs.MapEx = function (name, cxt, args) {
        var form = cxt.form;
        var mapKey = YIUI.TypeConvertor.toString(args[0]);
        if (args.length < 2) {
            YIUI.ViewException.throwException(YIUI.ViewException.MAP_MISS_FORMKEY);
        }
        var formKey = YIUI.TypeConvertor.toString(args[1]);
        var srcOID = YIUI.TypeConvertor.toLong(args[2]);
        var params = {
            formKey: formKey,
            srcOID: srcOID,
            cmd: "PureMapEx",
            mapKey: mapKey
        };
        var resultJson = Svr.SvrMgr.doMapEvent(params);

        YIUI.UIUtil.show(resultJson, cxt, false, YIUI.ShowType.Map);

        return true;
    };

    funs.AutoMap = function (name, cxt, args) {
        var mapKey = YIUI.TypeConvertor.toString(args[0]);
        var form = cxt.form,
            formKey = form.formKey,
            formDoc = form.getDocument(),
            copyDoc = formDoc.clone();
        var gridMap = form.getGridInfoMap(), tableKey, shadowTableKey, shadowTable;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            tableKey = gridMap[i].tableKey;
            shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
            shadowTable = copyDoc.getByKey(shadowTableKey);
            if (shadowTable != undefined || shadowTable != null) {
                copyDoc.remove(tableKey);
                shadowTable.key = tableKey;
            }
        }
        var doc = YIUI.DataUtil.toJSONDoc(copyDoc);

        // 执行数据映射
        var params = {
            formKey: formKey,
            cmd: "PureAutoMap",
            srcDoc: $.toJSON(doc),
            mapKey: mapKey
        };
        var resultJson = Svr.SvrMgr.doMapEvent(params);
        return true;
    };

    var mapInForm = function (cxt, mapKey, formKey, toNewForm) {
        var tgFormKey = null,
            toNewForm = toNewForm,
            form = cxt.form;
        var formDoc = null;
        var pForm = null;
        if (!toNewForm) {
            pForm = YIUI.FormStack.getForm(form.pFormID);
            tgFormKey = pForm.formKey;
        } else {
            tgFormKey = formKey;
        }
        formDoc = form.getDocument();
        var copyDoc = formDoc.clone();
        var gridMap = form.getGridInfoMap(), tableKey, shadowTableKey, shadowTable;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            tableKey = gridMap[i].tableKey;
            shadowTableKey = YIUI.DataUtil.getShadowTableKey(tableKey);
            shadowTable = copyDoc.getByKey(shadowTableKey);
            if (shadowTable != undefined || shadowTable != null) {
                copyDoc.remove(tableKey);
                shadowTable.key = tableKey;
            }
        }
        var doc = YIUI.DataUtil.toJSONDoc(copyDoc);

        var params = {
            tgFormKey: tgFormKey,
            srcFormKey: form.formKey,
            srcDoc: $.toJSON(doc),
            cmd: "PureMap",
            toNewForm: toNewForm,
            mapKey: mapKey
        };
        if (toNewForm) {
            var resultJson = Svr.SvrMgr.doMapEvent(params);
            YIUI.UIUtil.show(resultJson, cxt, false, YIUI.ShowType.Map);
        } else {
            var result = Svr.SvrMgr.doMapEvent(params);
            var gridKey = result.key;
            var pGrid = pForm.getComponent(gridKey), dataTable;
            if (result.dataTable) {
                dataTable = YIUI.DataUtil.fromJSONDataTable(result.dataTable);
                //            pForm.getDocument().setByKey(pGrid.tableKey, dataTable);
            }
            pGrid.addGridRows(result.data, dataTable, false);

            var calcProcess = new YIUI.UICalcProcess(pForm);
            var affectItems = pForm.dependency.calcTree.affectItems,
                item, expItems, expItem, value, comp;
            for (var i = 0, len = affectItems.length; i < len; i++) {
                item = affectItems[i];
                var col = pGrid.dataModel.colModel.cells[item.key];
                if (!col) continue;
                expItems = item.expItems;
                for (var j = 0, length = expItems.length; j < length; j++) {
                    expItem = expItems[j];
                    comp = pForm.getComponent(expItem.source);
                    if (comp && comp.type != YIUI.CONTROLTYPE.GRID) {
                        value = calcProcess.getCalcValue(expItem);
                        comp.setValue(value, true, false);
                    }
                }
            }
        }
    };

    funs.ViewMap = function (name, cxt, args) {
        if (args.length > 1) {
            var toNewForm = YIUI.TypeConvertor.toBoolean(args[1]);
            if (toNewForm) {
                YIUI.ViewException.throwException(YIUI.ViewException.DATA_BINDING_ERROR);
            }
        }
        return UI.BaseFuns.MapToForm(name, cxt, args);
    };

    funs.MapToForm = function (name, cxt, args) {
        var form = cxt.form,
            mapKey = args[0];
        mapInForm(cxt, mapKey, null, false);
        return true;
    };

    funs.HasDataMaped = function (name, cxt, args) {
        var form = cxt.form;
        var doc = form.getDocument();
        if (doc.isNew())
            return false;
        var tbls = doc.tbls;
        for (var i = 0, len = tbls.length; i < len; i++) {
            var tbl = tbls[i];
            if (!tbl) continue;
            tbl.beforeFirst();
            while (tbl.next()) {
                var count = tbl.getByKey(YIUI.SystemField.MAPCOUNT_SYS_KEY);
                if (count && count > 0)
                    return true;
            }
        }
        return false;
    };

    {
        //ViewBatchProcessFunction
        funs.BatchDeleteData = function (name, cxt, args) {
            var form = cxt.form;
            var objectKey = YIUI.TypeConvertor.toString(args[0]);
            var tableKey = YIUI.TypeConvertor.toString(args[1]);
            var OIDFieldKey = YIUI.SystemField.OID_SYS_KEY;
            if (args.length > 2)
                OIDFieldKey = YIUI.TypeConvertor.toString(args[2]);
            var OIDList = YIUI.BatchUtil.getSelectOIDs(form, tableKey, OIDFieldKey, false);
            var params = {
                cmd: "BatchDeleteData",
                ObjectKey: objectKey,
                OIDListStr: $.toJSON(OIDList)
            };
            Svr.SvrMgr.delPureData(params);
            return true;
        };
        funs.BatchMap = function (name, cxt, args) {
            var mapKey = args[0];
            var tblKey = args[1];
            var fieldKey = args[2];
            var form = cxt.form;

            var comp;
            var lv = form.getListView(tblKey);
            var grid = form.getGridInfoByTableKey(tblKey);
            var oids = [];
            if (lv) {
                oids = lv.getFieldArray(form, fieldKey);
            } else if (grid) {
                oids = grid.getFieldArray(form, fieldKey);
            }

            var paras = {
                mapKey: mapKey,
                cmd: "PureBatchMap",
                oidList: $.toJSON(oids)
            };
            var resultJson = Svr.SvrMgr.doMapEvent(paras);

        };
    }

    funs.ShowModal = function (name, cxt, args) {
        var pForm = cxt.form, formKey = args[0], tsParas = args[1], callbackList = args[2];
        var paras = {formKey: formKey, cmd: "PureShowForm"}, callBack = {};
        if (callbackList) {
            paras.callbackList = callbackList;
            callBack = splitPara(callbackList);
        }
        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = pForm.eval(tsParas[key], cxt);
                pForm.setCallPara(key, value);
            }
            var callParas = pForm.getCallParas();
            paras.callParas = JSON.stringify(callParas.getMap());
        }
        var success = function (jsonObj) {

            cxt.target = YIUI.FormTarget.MODAL;
            var newForm = YIUI.UIUtil.show(jsonObj, cxt, false);

            for (var o in callBack) {
                newForm.regEvent(o, function (opt) {
                    pForm.eval(callBack[opt].trim(), cxt, null);
                });
            }
        };
        Svr.SvrMgr.dealWithPureForm(paras, success);

    };

    funs.doEventCallback = function (name, cxt, args) {
        var form = cxt.form;
        var event = form.getEventCallback(args[0]);
        event.doTask();
    };

    funs.CloseTo = function (name, cxt, args) {
        var form = cxt.form;
        var targetKey = args[0];
        var container = form.getContainer();
        container.closeTo(targetKey);
    };

    funs.Close = function (name, cxt, args) {
        var form = cxt.form;
        form.fireClose();
    };

    funs.GetDataObjectKey = function (name, cxt, args) {
        var form = cxt.form;
        var formKey = form.formKey;
        if (args.length > 0) {
        } else {
            return form.getDataObjectKey();
        }
        if (args[0]) {
            formKey = args[0];
        }
        var params = {formKey: formKey, cmd: "GetDBKey"};
        var dbKey = Svr.SvrMgr.doDictViewEvent(params);
        return dbKey;
    };

    funs.GetOID = function (name, cxt, args) {
        var form = cxt.form;
        var oid = -1;
        if (form) {
            var doc = form.getDocument();
            if (doc) {
                oid = doc.oid;
            }
        }
        return oid;
    };

    funs.GetInitOperationState = function (name, cxt, args) {
        var form = cxt.form;
        var state = -1;
        if (form) {
            state = form.getInitOperationState();
        }

        return state;
    };

    funs.DeleteData = function (name, cxt, args) {
        var form = cxt.form;
        var formDoc = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(formDoc);
        var oid = doc.oid;
        processPara(cxt);
        var paras = form != null ? form.getParas() : null;
        var params = {
            oid: oid,
            cmd: "DeleteFormData",
            parameters: paras.toJSON(),
            formKey: form.getFormKey()
        };
        Svr.SvrMgr.delPureData(params);

        form.setInitOperationState(YIUI.Form_OperationState.Delete);
        form.setOperationState(YIUI.Form_OperationState.Delete);


        return true;
    };

    funs.ShowDictView = function (name, cxt, args) {
        var form = cxt.form;

    };


    funs.EnabledDict = function (name, cxt, args) {
        var form = cxt.form;
        var itemKey = args[0];
        var oid = args[1];
        var enable = 1;
        var allChildren = true;

        if (args.length > 2) {
            enable = args[2];
        }

        if (args.length > 3) {
            allChildren = args[3];
        }

        YIUI.DictService.enableDict(itemKey, oid, enable, allChildren);
        form.setInitOperationState(YIUI.Form_OperationState.Edit);
        return true;

    };

    funs.IsNew = function (name, cxt, args) {
        var form = cxt.form;
        var state = -1;
        if (form) {
            state = form.getOperationState();
        }
        return state == YIUI.Form_OperationState.New;
    };

    funs.IsNewOrEdit = function (name, cxt, args) {
        var form = cxt.form;
        var state = -1;
        if (form) {
            state = form.getOperationState();
        }
        return state == YIUI.Form_OperationState.Edit || state == YIUI.Form_OperationState.New;

    };

    funs.SetValue = function (name, cxt, args) {
        var form = cxt.form;
        var controlKey = args[0], value = args[1];

        var fireEvent = false;
        if (args.length > 2) {
            if (args[2] === true || args[2] === "true") fireEvent = true;
        }
        form.setComponentValue(controlKey, value, fireEvent);
    };

    funs.GetValue = function (name, cxt, args) {
        var form = cxt.form;
        var controlKey = args[0];
        return YIUI.ExprUtil.getImplValue(form, controlKey, cxt);
    };
    
    funs.GetJSONValue = function (name, cxt, args) {
        var form = cxt.form;
        var controlKey = args[0];
        return YIUI.ExprUtil.getJSONValue(form, controlKey, cxt);
    };

    funs.CommitValue = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var comp = form.getComponent(key);
        comp.commitValue();
        return true;
    };

    funs.RollbackValue = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var comp = form.getComponent(key);
        comp.rollbackValue();
        return true;
    };

    funs.SumExpand = function (name, cxt, args) {
        var count = new Decimal(0), form = cxt.form, cellKey = args[0], ri = cxt.rowIndex,
            cLoc = form.getCellLocation(cellKey), grid = form.getComponent(cLoc.key);
        if (grid == undefined) return count;
        var gr = grid.getRowDataAt(ri), cellV;
        if (gr) {
            for (var i = 0, len = gr.cellKeys.length; i < len; i++) {
                if (gr.cellKeys[i] == cellKey) {
                    cellV = grid.getValueAt(ri, i);
                    if (cellV != null) {
                        count = count.plus(cellV);
                    }
                }
            }
        }
        return count;
    };

    funs.Sum = function (name, cxt, args) {
        var form = cxt.form, cellKey = args[0].toString(),
            cellLoc = form.getCellLocation(cellKey),
            grid = form.getComponent(cellLoc.key);
        if (grid == undefined) return 0;
        var sumInGrid = function (grid, rowIndex, colIndex) {
            var count = new Decimal(0), len = grid.getRowCount(), rowData = grid.getRowDataAt(rowIndex), value;
            switch (rowData.rowType) {
                case "Fix":
                case "Total":
                    var colInfoes = grid.getColInfoByKey(cellKey), isMatch = false;
                    if (colInfoes != null) {
                        for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                            if (colIndex == colInfoes[j].colIndex) {
                                isMatch = true;
                                break;
                            }
                        }
                    }
                    if (isMatch) {
                        for (var i = 0, rlen = grid.getRowCount(); i < rlen; i++) {
                            rowData = grid.getRowDataAt(i);
                            if (rowData.isDetail && rowData.bookmark != null) {
                                value = rowData.data[colIndex][0];
                                if (value !== null) {
                                    count = count.plus(value);
                                }
                            }
                        }
                    } else {
                        sumOutGrid(grid, cellKey);
                    }
                    break;
                case "Group":
                    if (rowData.isGroupHead) {
                        for (var nextRi = rowIndex + 1; nextRi < len; nextRi++) {
                            var nextRD = grid.getRowDataAt(nextRi);
                            if (nextRD.rowGroupLevel == rowData.rowGroupLevel) {
                                break;
                            }
                            if (nextRD.isDetail && nextRD.bookmark != null) {
                                value = nextRD.data[colIndex][0];
                                if (value !== null) {
                                    count = count.plus(value);
                                }
                            }
                        }
                    } else if (rowData.isGroupTail) {
                        for (var preRi = rowIndex - 1; preRi >= 0; preRi--) {
                            var preRD = grid.getRowDataAt(preRi);
                            if (preRD.rowGroupLevel == rowData.rowGroupLevel) {
                                break;
                            }
                            if (preRD.isDetail && preRD.bookmark != null) {
                                value = preRD.data[colIndex][0];
                                if (value !== null) {
                                    count = count.plus(value);
                                }
                            }
                        }
                    }
                    break;
            }
            return count;
        };
        var sumOutGrid = function (grid, cellKey) {
            var rowData, colInfoes, colIndex, count = new Decimal(0), value;
            for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                rowData = grid.getRowDataAt(i);
                if (rowData.isDetail && rowData.bookmark != null) {
                    colInfoes = grid.getColInfoByKey(cellKey);
                    if (colInfoes == null) continue;
                    for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                        colIndex = colInfoes[j].colIndex;
                        value = rowData.data[colIndex][0];
                        if (value !== null) {
                            count = count.plus(value);
                        }
                    }
                }
            }
            return count;
        };
        var targetCellLocation = form.getCellLocation(cxt.target);
        if (targetCellLocation == null || targetCellLocation.key != grid.key) {
            return sumOutGrid(grid, cellKey);
        } else if (cxt.rowIndex !== undefined && cxt.colIndex != undefined && cellLoc !== undefined) {
            return sumInGrid(grid, cxt.rowIndex, cxt.colIndex);
        } else {
            return sumOutGrid(grid, cellKey);
        }
    };

    funs.UpdateView = function (name, cxt, args) {
        updateView(cxt);
    };

    var updateView = function (cxt) {
        var form = cxt.form;
        var tag = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW);
        if (tag == YIUI.BPMConstants.WORKITEM_VIEW) {
            return;
        }
        var pFormID = form.pFormID;
        if (!pFormID) {
            return true;
        }
        var viewForm = YIUI.FormStack.getForm(pFormID);
        if (!viewForm || viewForm.type != YIUI.Form_Type.View) {
            return;
        }

        var doc = form.getDocument();
        var viewDoc = viewForm.getDocument();
        var OID = doc.oid;
        var viewFound = false;
        var mTblKey = viewForm.mainTableKey;
        var listView = null;
        if (mTblKey) {
            listView = viewForm.getListView(mTblKey);
        } else {
            listView = viewForm.getListView(0);
        }
        if (!listView) return;
        var rowCount = listView.getRowCount();
        var row = -1, colKey;
        for (var cInfo, ci = 0, len = listView.columnInfo.length; ci < len; ci++) {
            cInfo = listView.columnInfo[ci];
            if (cInfo.columnKey == YIUI.SystemField.OID_SYS_KEY) {
                colKey = cInfo.key;
                break;
            }
        }
        if (!colKey) return;
        for (var i = 0; i < rowCount; i++) {
            if (listView.getValByKey(i, colKey) == OID) {
                row = i;
                break;
            }
        }
        if (form.getOperationState() == YIUI.Form_OperationState.Delete) {
            listView.deleteRow(row);
        } else {
            var data = {};
            var compList = form.getComponentList();
            var columnInfo = listView.columnInfo;

            $.each(columnInfo, function (i, column) {
                var tbl, val;
                //下拉框 多选下拉框 字典 数值框 日期控件， 因为值和显示值不一致， 先从控件取  ， 之后再填到界面上
                if (column.columnType == YIUI.CONTROLTYPE.COMBOBOX
                    || column.columnType == YIUI.CONTROLTYPE.CHECKLISTBOX
                    || column.columnType == YIUI.CONTROLTYPE.DICT
                    || column.columnType == YIUI.CONTROLTYPE.NUMBEREDITOR
                    || column.columnType == YIUI.CONTROLTYPE.DATEPICKER
                    || column.columnType == YIUI.CONTROLTYPE.TEXTEDITOR) {
                    var exists = false, text, value;
                    $.each(compList, function (i, comp) {
                        if (column.columnKey && comp.getMetaObj().columnKey == column.columnKey) {
                            text = comp.getText();
                            value = comp.getValue();
                            exists = true;
                            return;
                        }
                    });
                    if (!exists) {
                        tbl = doc.getByKey(column.tableKey);
                        if (tbl && tbl.first() && column.columnKey) {
                            val = tbl.getByKey(column.columnKey);
                            text = val;
                            value = val;
                        }
                    }
                    if (column.columnType == YIUI.CONTROLTYPE.NUMBEREDITOR) {
                        var settings = {
                            //组大小
                            dGroup: column.groupingSize,
                            //小数位数
                            mDec: column.decScale,
                            //四舍五入方式
                            mRound: column.roundingMode
                        };
                        text = YIUI.DecimalFormat.format(value, settings);
                    } else if (column.columnType == YIUI.CONTROLTYPE.TEXTEDITOR) {
                        text = YIUI.TextFormat.format(value, column);
                    } else if (column.columnType == YIUI.CONTROLTYPE.DATEPICKER) {
                        if ($.isNumeric(value)) {
                            value = new Date(parseInt(value));
                        }
                        text = YIUI.DateFormat.format(value, column);
                    }
                    data[column.key] = {
                        'value': value,
                        'caption': text
                    };

                } else {
                    data[column.key] = {
                        'value': column.value || "",
                        'caption': column.value || column.caption || ""
                    };
                    if (column.defaultValue) {
                        data[column.key] = {
                            'value': column.defaultValue,
                            'caption': column.defaultValue
                        };
                    }
                    if (column.defaultFormula) {
                        var value = viewForm.eval(column.defaultFormula, {form: viewForm, rowIndex: row}, null);
                        data[column.key] = {
                            'value': YIUI.TypeConvertor.toString(value),
                            'caption': YIUI.TypeConvertor.toString(value)
                        };
                    }
                    if (column.tableKey) {
                        tbl = doc.getByKey(column.tableKey);
                        if (tbl && tbl.first() && column.columnKey) {
                            val = tbl.getByKey(column.columnKey);
                            data[column.key] = {
                                'value': val || "",
                                'caption': val || ""
                            };
                        }
                    }

                }
            });

            //未找到行
            if (row == -1) {
                listView.addNewRow(data);
            } else {
                $.each(columnInfo, function (i, column) {
                    var cv = data[column.key];
                    if (cv) {
                        var caption = cv.caption;
                        listView.setValByKey(row, column.key, caption, true, true);
                    }
                });
            }

        }

    };

    funs.GetSelectedValue = function (name, cxt, args) {
        var form = cxt.form;
        var controlKey = args[0];
        var colKey = null;
        if (args.length > 1) {
            colKey = args[1];
        }
        var comp = form.getComponent(controlKey);
        if (comp.type == YIUI.CONTROLTYPE.DICTVIEW) {
            var value = comp.getSelectedValue(colKey);
            return value;
        }
        return null;
    };
    
    funs.RefreshDictView = function (name, cxt, args) {
        var form = cxt.form;
        var controlKey = args[0];
        var itemKey = args[1];
        var oid = args[2];
        var optState = args[3] || YIUI.Form_OperationState.Default;
        var dictView = form.getComponent(controlKey);

        var itemData = {};
        itemData.itemKey = itemKey;
        itemData.oid = oid.toString();

        var curID = itemData.itemKey + '_' + itemData.oid;
        if (dictView.type == YIUI.CONTROLTYPE.DICTVIEW) {
            switch (optState) {
                case YIUI.Form_OperationState.New:
                    //目前 不同字典 是通过重新加载 父节点来实现 刷新的。
                    if (dictView.isChainDict()) {
                        var item = YIUI.DictService.getItem(itemData.itemKey, itemData.oid);
                        dictView.addNodeByItem(null, item);
                    } else {
                        //获取当前节点所有父节点
                        var parents = YIUI.DictService.getParentPath(dictView.itemKey, itemData);
                        parents = parents[0];
                        var last = parents[parents.length - 1];
                        var id = last.itemKey + '_' + last.oid;
                        //父节点
                        if (dictView.find(id)) {
                            dictView.expandNode(id, true);
                        } else {
                            for (var i = 0; i < parents.length; i++) {
                                id = parents[i].itemKey + '_' + parents[i].oid;
                                dictView.expandNode(id);
                            }
                        }
                    }
                    //选中当前节点
                    dictView.focusNode(curID);
                    break;
                case YIUI.Form_OperationState.Delete:
                    // 修改previd属性
                    dictView.removeNode(itemData.itemKey + '_' + itemData.oid);
                    break;
                default:
                    if (dictView.isChainDict()) {
                        var item = YIUI.DictService.getItem(itemData.itemKey, itemData.oid);
                        //dictView.removeNode( itemData.itemKey+'_'+itemData.oid);
                        //dictView.addNodeByItem(null,item);
                        dictView.refreshNode(itemData.itemKey + '_' + itemData.oid);
                    } else {
                        //删除原来的节点
                        dictView.removeNode(itemData.itemKey + '_' + itemData.oid);

                        //获取当前节点所有父节点
                        var parents = YIUI.DictService.getParentPath(dictView.itemKey, itemData);
                        parents = parents[0];
                        var last = parents[parents.length - 1];
                        var id = last.itemKey + '_' + last.oid;
                        //父节点
                        if (dictView.find(id)) {
                            dictView.expandNode(id, true);
                        } else {
                            for (var i = 0; i < parents.length; i++) {
                                id = parents[i].itemKey + '_' + parents[i].oid;
                                dictView.expandNode(id);
                            }
                        }

                        var node = dictView.getNode(curID);
                        if (node.attr('enable') == 1) {
                            for (var i = 0; i < parents.length; i++) {
                                id = parents[i].itemKey + '_' + parents[i].oid;
                                var parent = dictView.getNode(id);

                                parent.attr('enable', 1);
                                parent.removeClass('invalid').removeClass('disabled');
                            }
                        }

                    }
                    dictView.focusNode(curID);
            }
        }
    };

    funs.IsEnable = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var comp = form.getComponent(key);
        var enable = false;
        if (comp != null) {
            enable = comp.enable;
        }
        return enable;
    };

    funs.GetRowCount = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var comp = form.getComponent(key);
        var includeEmpty = true;
        if (args.length > 1) {
            includeEmpty = YIUI.TypeConvertor.toBoolean(args[1]);
        }
        var count = 0;
        switch (comp.type) {
            case YIUI.CONTROLTYPE.GRID:
                var grid = comp;
                if (includeEmpty) {
                    count = grid.getRowCount();
                } else {
                    for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                        var data = grid.getRowDataAt(i);
                        if (data.isDetail && data.bookmark !== undefined) {
                            count++;
                        }
                    }
                }
                break;
            case YIUI.CONTROLTYPE.LISTVIEW:
                count = comp.totalRowCount;
                break;
        }
        return count;
    };

    funs.SetVisible = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var visible = YIUI.TypeConvertor.toBoolean(args[1]);
        var comp = form.getComponent(key);
        if (comp) {
            comp.setVisible(visible);
            var ownerCt = comp.ownerCt;
            if (ownerCt.type == YIUI.CONTROLTYPE.FLUIDTABLELAYOUTPANEL) {
                ownerCt.reLayout();
            }
        }
        return true;
    };
    funs.IsVisible = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var comp = form.getComponent(key);
        var visible = false;
        if (comp != null) {
            visible = comp.visible;
        }
        return visible;
    };
    funs.SetFocus = function (name, cxt, args) {
        var key = args[0];
        var focus = args[1];
        var form = cxt.form;
        var comp = form.getComponent(key);
        if (comp != null && focus) {
            $("input", comp.el).focus();
        }
        return true;
    };
    funs.IsControlNull = function (name, cxt, args) {
        var key = args[0];
        var form = cxt.form;
        var comp = form.getComponent(key);
        if (comp != null) {
            return comp.isNull();
        }
        var location = form.getCellLocation(key);
        if (location != null) {
            var gridKey = location.key;
            var grid = form.getComponent(gridKey), row = cxt.rowIndex;
            if (row == null || row < 0) {
                row = grid.getFocusRowIndex();
            }
            if (row != -1) {
                return grid.isCellNull(row, key);
            }
        }
        return false;
    };
    funs.SetCellValue = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var rowIndex = parseInt(args[1].toString());
        var comp = form.getComponent(key);
        if (rowIndex == undefined || rowIndex == null || rowIndex == -1) {
            rowIndex = cxt.rowIndex;
        }
        if ((rowIndex == undefined || rowIndex == null || rowIndex == -1) && comp) {
            rowIndex = comp.getFocusRowIndex();
        }
        var fireEvent = true;
        var col = YIUI.TypeConvertor.toString(args[2]);
        if ($.isNumeric(col)) {
            var value = args[3];
            if (args.length > 4) {
                fireEvent = YIUI.TypeConvertor.toBoolean(args[4]);
            }
            form.setCellValByIndex(key, rowIndex, parseInt(col), value, fireEvent);
        } else {
            var value = args[3];
            if (args.length > 4) {
                fireEvent = YIUI.TypeConvertor.toBoolean(args[4]);
            }
            form.setCellValByKey(key, rowIndex, col, value, fireEvent);
        }
        return true;
    };
    funs.GetCellValue = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var rowIndex = YIUI.TypeConvertor.toString(args[1]);
        var comp = form.getComponent(key);
        if (rowIndex == -1 && comp) {
            rowIndex = cxt.rowIndex;
        }
        // 没有取焦点行
        if ((rowIndex == undefined || rowIndex == null || rowIndex == -1) && comp) {
            rowIndex = comp.getFocusRowIndex();
        }
        var result = null;
        var col = YIUI.TypeConvertor.toString(args[2]);
        if ($.isNumeric(col)) {
            result = form.getCellValByIndex(key, rowIndex, col);
        } else {
            result = form.getCellValByKey(key, rowIndex, col);
        }
        return YIUI.ExprUtil.convertValue(result, comp.dataModel && comp.dataModel.colModel.cells[col]);
    };

    funs.Search = function (name, cxt, args) {
    	var retRowIndex = -1;
        var form = cxt.form;
        var count = args.length;
        
        if (count == 0 || count % 2 > 0) {
        	YIUI.ViewException.throwException(YIUI.ViewException.UNEQUAL_PARAM_NUM);
		}
        
        var fields = [];
		var values = [];
		for (var i = 0; i < count / 2; ++i) {
			fields[i] = args[i * 2];
			values[i] = args[i * 2 + 1];
		}
		
		var location = form.getCellLocation(fields[0]);
		var gridKey = location.key;
		var grid = form.getComponent(gridKey);
		
		var rowCount = grid.getRowCount();
		var focusRow = grid.getFocusRowIndex();
		
		var compareRow = function(form, grid, gridKey, rowIndex, fields, values){
			var found = true;
			for (var i = 0; i < fields.length; i++) {
				var value = form.getCellValByKey(gridKey, rowIndex, fields[i]);
				var data1 = YIUI.ExprUtil.convertValue(value, grid.dataModel && grid.dataModel.colModel.cells[fields[i]]);
				var data2 = YIUI.ExprUtil.convertValue(values[i]);
				
				if (data1 == null && data2 == null) {
				} else if (data1 == null || data2 == null) {
					found = false;
				} else {
					var cpType = YIUI.UIUtil.getCompareType(data1, data2);
                    switch (cpType) {
                        case DataType.STRING:
                            if (YIUI.TypeConvertor.toString(data1) != YIUI.TypeConvertor.toString(data2)) {
                            	found = false;
                            }
                            break;
                        case DataType.NUMERIC:
                            if (!YIUI.TypeConvertor.toDecimal(data1).equals(YIUI.TypeConvertor.toDecimal(data2))) {
                            	found = false;
                            }
                            break;
                        case DataType.BOOLEAN:
                        	if(YIUI.TypeConvertor.toBoolean(data1) != YIUI.TypeConvertor.toBoolean(data2)) {
                        		found = false;
                        	}
                            break;
                    }
				}
				
				if (!found) {
					break;
				}
			}
			return found;
		};
		
		// 第一遍查找，从当前行往下找
		var found = false;
		for (var startRowIndex = focusRow + 1; startRowIndex < rowCount; startRowIndex++) {
			var row = grid.getRowDataAt(startRowIndex);
			
			if (!row.isDetail || (row.bookmark == undefined)) {
				continue;
			}
			
			found = compareRow(form, grid, gridKey, startRowIndex, fields, values);
			if (found) {
				retRowIndex = startRowIndex;
				break;
			}
		}
		
		// 第二遍查找，从第零行往下找，直至当前行
		if (!found) {
			for (var startRowIndex = 0; startRowIndex <= focusRow; startRowIndex++) {
				var row = grid.getRowDataAt(startRowIndex);
				if (!row.isDetail || (row.bookmark == undefined)) {
					continue;
				}
				
				found = compareRow(form, grid, gridKey, startRowIndex, fields, values);
				if (found) {
					retRowIndex = startRowIndex;
					break;
				}
			}
		}
		return retRowIndex;
    };
    
    
    // 获取拓展单元格的拓展值
    funs.GetExpandValue = function (name, cxt, args) {
        var form = cxt.form;
        var grid = form.getComponent(args[0]);
        var rowIndex = parseInt(args[1]), colIndex = parseInt(args[2]);
        rowIndex = (rowIndex == -1 ? cxt.rowIndex : rowIndex);
        colIndex = (colIndex == -1 ? cxt.colIndex : colIndex);
        if (rowIndex == -1 || colIndex == -1)
            return null;
        var expandColumnKey = args[3];
        var metaRowIndex = grid.dataModel.data[rowIndex].metaRowIndex; // 配置对象行序号
        var metaCellInfo = grid.metaRowInfo.rows[metaRowIndex].cells[colIndex];
        var crossValues = metaCellInfo.crossValue.values;
        for (var i = 0; i < crossValues.length; i++) {
            if (crossValues[i].columnKey == expandColumnKey) {
                return crossValues[i].value;
            }
        }
        return null;
    }

    funs.GetOperationState = function (name, cxt, args) {
        var form = cxt.form;
        var state = -1;
        if (form) {
            state = form.getOperationState();
        }
        return state;
    };

    funs.ApplyNewOID = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "ApplyNewOID";
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        var oid = result.OID;
        return oid;
    };

    funs.RunValueChanged = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var cmp = form.getComponent(key);
        var cell = form.getCellLocation(key);
        var valueChange = "";
        if (cmp) {
            valueChange = cmp.valueChanged;
            valueChange && form.eval(valueChange, cxt, null);
        } else if (cell) {
            var compKey = cell.key;
            var grid = form.getComponent(compKey);
            if (grid.type == YIUI.CONTROLTYPE.GRID) {
                var rowIndex = grid.getFocusRowIndex();
                if (rowIndex == -1) return;
                var row = grid.dataModel.data[rowIndex], cellKey = key,
                    editOpt = grid.dataModel.colModel.cells[cellKey],
                    meatRow = grid.metaRowInfo.rows[row.metaRowIndex];

                var colIndex = grid.getColInfoByKey(cellKey)[0].colIndex;

//			    form.uiProcess.doCellValueChanged(grid, rowIndex, colIndex, cellKey);
                YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);

                var cellCEvent = meatRow.cells[colIndex].valueChanged;
                if (cellCEvent !== undefined && cellCEvent.length > 0) {
                    form.eval($.trim(cellCEvent), {form: form, rowIndex: rowIndex}, null);
                }
            }
        }

        return true;
    };

    funs.RunClick = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var comp = form.getComponent(key);
        switch (comp.type) {
            case YIUI.CONTROLTYPE.BUTTON:
            case YIUI.CONTROLTYPE.HYPERLINK:
                var clickContent = comp.clickContent;
                clickContent && form.eval(clickContent, cxt, null);
                break;
        }
        return true;
    };
    funs.RunOpt = function (name, cxt, args) {
        var form = cxt.form;
        var optKey = args[0];
        //toolbar
        var optInfo = form.getOptMap()[optKey], tbr;
        if (optInfo) {
            var action = optInfo.opt.action;
            action && form.eval(action, cxt, null);
        }
        return true;
    };

    funs.SetOID = function (name, cxt, args) {
        var form = cxt.form;
        var filterMap = form.getFilterMap();
        var OID = YIUI.TypeConvertor.toInt(args[0]);
        filterMap.setOID(OID);
        return true;
    };
    funs.ResetCondition = function (name, cxt, args) {
        var form = cxt.form;
        var compList = form.getComponentList();
        var cmp = null;
        for (var i in compList) {
            cmp = compList[i];
            if (cmp.condition) {
                cmp.setValue("", true, false);
            }
        }
        return true;
    };

    funs.GetGroupValue = function (name, cxt, args) {
        var form = cxt.form;
        var groupKey = YIUI.TypeConvertor.toString(args[0]);
        var paraGroups = form.paraGroups;
        var items = null;
        if (paraGroups) {
            items = paraGroups[groupKey];
        }
        return items;
    };

    funs.SetClose = function (name, cxt, args) {
        var form = cxt.form;
        form.showFlag = YIUI.FormShowFlag.Close;
        return true;
    };

    funs.GetFormKey = function (name, cxt, args) {
        var form = cxt.form;
        return form.getFormKey();
    };

    funs.GetRelationFormKey = function (name, cxt, args) {
        var formKey = YIUI.TypeConvertor.toString(args[0]);
        var dataObjKey = YIUI.TypeConvertor.toString(args[1]);
        var paras = {
            cmd: "GetRelationFormKey",
            service: "PureMeta",
            dataObjKey: dataObjKey,
            formKey: formKey
        };
        var key = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return key;
    };

    funs.GetFormRelation = function (name, cxt, args) {
        var formKey = YIUI.TypeConvertor.toString(args[0]);
        var paras = {
            cmd: "GetFormRelation",
            service: "PureMeta",
            formKey: formKey
        };
        var sRet = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return sRet;
    };

    funs.GetTag = function (name, cxt, args) {
        return cxt.tag;
    };

    funs.GetCellCaption = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var rowIndex = YIUI.TypeConvertor.toInt(args[1]);
        var grid = form.getComponent(key);
        // 从环境中取出表格的当前行
        if (rowIndex == -1) {
            rowIndex = grid.getFocusRowIndex();
        }
        if (rowIndex == -1) {
            return "";
        }
        var cell = null;
        var caption = "";
        var column = args[2];
        if ($.isNumeric(column)) {
            var colIndex = YIUI.TypeConvertor.toInt(column);
            cell = grid.getCellDataAt(rowIndex, colIndex);
            caption = cell[1];
        } else if (column instanceof String) {
            var cellKey = column.toString();
            cell = grid.getCellDataByKey(rowIndex, cellKey);
            caption = cell[1];
        }
        return caption;
    };

    funs.SetFocusRow = function (name, cxt, args) {
        var form = cxt.form,
            key = args[0],
            rowIndex = parseInt(args[1].toString() || 0),
            com = form.getComponent(key);
        if (com && com.type == YIUI.CONTROLTYPE.GRID) {
            com.setFocusRowIndex(rowIndex);
        }
    };

    funs.GetFocusRow = function (name, cxt, args) {
        var form = cxt.form;
        var gridKey = YIUI.TypeConvertor.toString(args[0]);
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }
        return grid.getFocusRowIndex();
    };

    funs.GetRowIndex = function (name,cxt,args) {
        if( !cxt )
            return -1;
        
        return cxt.rowIndex;
    };

    funs.SetRowIndex = function (name,ctx,args) {
        ctx.rowIndex = args[1];
    };

    funs.GetFocusColumn = function (name, cxt, args) {
        var form = cxt.form;
        var gridKey = YIUI.TypeConvertor.toString(args[0]);
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }
        return grid.getFocusColIndex();
    };

    funs.ServerDate = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "DateService";
        paras.cmd = "ServerDate";
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return new Date(result);
    };

    funs.ServerDBDate = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "DateService";
        paras.cmd = "ServerDBDate";
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return new Date(result);
    };

    funs.LocalDate = function (name, cxt, args) {
        return new Date().getTime();
    };

    funs.GetStatus = function (name, cxt, args) {
        var form = cxt.form, doc = form.getDocument(), mtKey = form.mainTableKey, mtTable = doc.getByKey(mtKey);
        var status = null;
        if (mtTable && mtTable.getRowCount() > 0) {
            mtTable.first();
            status = mtTable.getByKey("Status");
        }
        return status;
    };

    funs.RefreshStatusInfo = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        window.refreshStatusInfo(key);
        return true;
    };

    funs.UpdateStatusInfo = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var text = YIUI.TypeConvertor.toString(args[1]);
        window.updateStatusInfo(key, text);
        return true;
    };

    funs.ConvertStatus = function (name, cxt, args) {
        var form = cxt.form;
        var status = args[0];
        var refresh = true;
        if (args.length > 1) {
            refresh = YIUI.TypeConvertor.toBoolean(args[1]);
        }

        var isKey = !$.isNumeric(status);
        var dataObjKey = form.dataObjectKey;
        var document = form.getDocument();
        var docJson = YIUI.DataUtil.toJSONDoc(document);
        var params = {
            service: "ConvertStatus",
            objectKey: dataObjKey,
            document: $.toJSON(docJson),
            isKey: isKey,
            status: status
        };
        var newDoc = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params)
        form.setDocument(newDoc);
        if (refresh) {
            form.showDocument();
        }
        return newDoc;
    };

    funs.SetPara = function (name, cxt, args) {
        var form = cxt.form, key = args[0], value = args[1];
        form.setPara(key, value);
    };

    funs.PushPara = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var value = args[1];
        form.setCallPara(key, value);
        return true;
    };

    funs.GetPara = function (name, cxt, args) {
        var form = cxt.form, key = args[0];
        return form.getPara(key);
    };

    funs.Para = function (name, cxt, args) {
        var form = cxt.form, key = args[0];
        return form.getPara(key);
    };

    funs.GetParentOID = function (name, cxt, args) {
        var form = cxt.form, ptForm = YIUI.FormStack.getForm(form.pFormID);
        if (ptForm) {
            return ptForm.OID;
        }
        return -1;
    };

    funs.RollData = function (name, cxt, args) {
        var form = cxt.form, key = args[0], endPeriod = "";
        if (args.length > 1) {
            endPeriod = args[1];
        }
        var paras = {};
        paras.service = "Migration";
        paras.cmd = "RollData";
        paras.dataObjectKey = key;
        paras.endPeriod = null;

        var sEndPeriod = null;
        if (endPeriod == null) {
        } else if (typeof endPeriod == 'string') {
            paras.endPeriod = endPeriod;
        } else if (endPeriod instanceof Date) {
            paras.endPeriod = YIUI.DateFormat.format(endPeriod)
        }

        Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
    };

    funs.IsEmptyRow = function (name, cxt, args) {
        var form = cxt.form,
            key = args[0],
            rowIndex = parseInt(args[1].toString() || 0),
            com = form.getComponent(key);
        if (com && com.type == YIUI.CONTROLTYPE.GRID) {
            if (rowIndex == -1) {
                rowIndex = com.getFocusRowIndex();
            }
            var gr = com.getRowDataAt(rowIndex);
            return gr.isDetail && (gr.bookmark == undefined);
        }
        return false;
    };

    funs.CheckDuplicate = function (name, cxt, args) {
        var form = cxt.form;
        if (args.length > 0) {
            var cellKey = args[0],
                cl = form.getCellLocation(cellKey),
                grid = form.getComponent(cl.key);
            if (grid) {
                var datas = [], length = grid.getRowCount(), row, cv, values;
                for (var i = 0; i < length; i++) {
                    row = grid.getRowDataAt(i);
                    values = [];
                    if (row.isDetail && row.bookmark !== undefined) {
                        for (var j = 0; j < args.length; j++) {
                            cellKey = args[j];
                            cl = form.getCellLocation(cellKey);
                            cv = grid.getValueAt(i, cl.column);
                            values.push(cv);
                        }
                        datas.push(values);
                    }
                }
                var data_A, data_B, data1, data2;
                for (var m = 0; m < datas.length; m++) {
                    data_A = datas[m];
                    for (var n = m + 1; n < datas.length; n++) {
                        data_B = datas[n];
                        for (var k = 0; k < data_A.length; k++) {
                            data1 = data_A[k];
                            data2 = data_B[k];
                            var cpType = YIUI.UIUtil.getCompareType(data1, data2), isBreak = false;
                            switch (cpType) {
                                case DataType.STRING:
                                    isBreak = YIUI.TypeConvertor.toString(data1) != YIUI.TypeConvertor.toString(data2);
                                    break;
                                case DataType.NUMERIC:
                                    isBreak = !YIUI.TypeConvertor.toDecimal(data1).equals(YIUI.TypeConvertor.toDecimal(data2))
                                    break;
                                case DataType.BOOLEAN:
                                    isBreak = YIUI.TypeConvertor.toBoolean(data1) != YIUI.TypeConvertor.toBoolean(data2);
                                    break;
                                default:
                                    if ((data1 == null && data2 != null) || (data1 != null && data2 == null)) {
                                        isBreak = true;
                                    } else {
                                        if (typeof data1 == "object" && typeof data2 == "object") {
                                            isBreak = data1.oid != data2.oid;
                                        }
                                    }
                                    break;
                            }
                            if (isBreak) break;
                            if (k == data_A.length - 1) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    };

    funs.InsertRow = function (name, cxt, args) {
        var form = cxt.form, key = args[0], rowIndex = -1;
        var comp = form.getComponent(key);
        if (args.length > 1) {
            rowIndex = parseInt(args[1].toString() || -1, 10);
        }
        var newRi = -1, afterCur = true;
        if (comp == undefined) return newRi;
        switch (comp.type) {
            case  YIUI.CONTROLTYPE.LISTVIEW:
                break;
            case YIUI.CONTROLTYPE.GRID:
                if (rowIndex == -1 && afterCur && args.length == 1) {
                    rowIndex = comp.getFocusRowIndex();
                }
                newRi = comp.addGridRow(null, rowIndex);
                newRi = comp.getRowIndexByID(newRi.rowID);
                comp.setFocusRowIndex(newRi);
                break;
        }
        return newRi;
    };

    funs.DeleteRow = function (name, cxt, args) {
        var form = cxt.form, key = args[0], rowIndex = -1;
        if (args.length > 1) {
            rowIndex = parseInt(args[1].toString() || 0, 10);
        }
        var com = form.getComponent(key);
        if (com == undefined) return;
        switch (com.type) {
            case  YIUI.CONTROLTYPE.LISTVIEW:
                break;
            case YIUI.CONTROLTYPE.GRID:
                if (rowIndex == -1) {
                    rowIndex = com.getFocusRowIndex();
                }
                com.deleteGridRow(rowIndex);
                break;
        }
        return true;
    };

    funs.CopyGridRow = function (name, cxt, args) {
        var form = cxt.form, gridKey = args[0], rowIndex = parseInt(args[1].toString() || 0, 10), splitKeys = [] , splitValues;
        var grid = form.getComponent(gridKey);
        if (grid) {
            if (grid.hasColExpand) return -1;
            if (rowIndex == -1) {
                rowIndex = (cxt.rowIndex == undefined ? -1 : cxt.rowIndex);
            }
            if (rowIndex == -1) {
                rowIndex = grid.getFocusRowIndex();
            }
            if (rowIndex == -1) return -1;
            if (args.length > 2) {
                var splitKeyString = args[2], size = splitKeyString.split(",").length, count = 0;
                for (var j = 0, len = grid.getColumnCount(); j < len; j++) {
                    var metaCell = grid.getMetaCellInDetail(j);
                    if (splitKeyString.indexOf(metaCell.key) >= 0) {
                        splitKeys.push(metaCell.columnKey);
                        count++;
                    }
                    if (count == size)
                        break;
                }
            }
            if (args.length > 3) {
                splitValues = [];
                for (var i = 3; i < args.length; i++) {
                    splitValues.push(args[i]);
                }
            }
            var layer = -1, dtlRi = grid.metaRowInfo.dtlRowIndex, metaDtlRow = grid.metaRowInfo.rows[dtlRi];
            if (metaDtlRow.defaultLayer !== -1) {
                var bookmark = grid.getRowDataAt(rowIndex).bookmark;
                var table = form.getDocument().getByKey(grid.tableKey);
                table.setByBkmk(bookmark);
                layer = parseInt(table.get(table.indexByKey("Layer")), 10);
            }
            return grid.gridHandler.copyRow(form, grid, rowIndex, splitKeys, splitValues, layer);
        }
        return -1;
    };

    funs.SetNewEmptyRow = function (name, cxt, args) {
        var form = cxt.form;
        var gridKey = YIUI.TypeConvertor.toString(args[0]);
        var flag = YIUI.TypeConvertor.toBoolean(args[1]);
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }
        grid.newEmptyRow = flag;
        grid.removeAutoRowAndGroup();
        grid.setGridEnable(grid.isEnable());
        return true;
    };

    funs.IsInBounds = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var point = args[1];
        var map = form.getComponent(key);
        map.IsInBounds(point);
    };

    funs.ClearMap = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        map.clear();
    };

    funs.SetDriveRoute = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var start = args[1];
        var end = args[2];
        var waypoints = args[3];
        var path = args[4];
        map.setDriveRoute(start, end, waypoints, path);
    };

    funs.DrawMarker = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var marker = YIUI.TypeConvertor.toString(args[1]);
        map.drawMarker(marker);
    };

    funs.DrawPolyline = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var polyline = YIUI.TypeConvertor.toString(args[1]);
        map.drawPolyline(polyline);
    };

    funs.DrawPolygon = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var polygon = YIUI.TypeConvertor.toString(args[1]);
        map.drawPolygon(polygon);
    };


    funs.GetMapInfo = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var mapInfo = map.getMapInfo();
        return mapInfo;
    };

    funs.ShowMapInfo = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var map = form.getComponent(key);
        var mapInfo = YIUI.TypeConvertor.toString(args[1]);
        map.showMapInfo(mapInfo);
    };

    funs.BPMMap = function (name, cxt, args) {
        if (args.length < 2)
            YIUI.ViewException.throwException(YIUI.ViewException.NO_KEY_TARGET_BILL);
        var form = cxt.form,
            mapKey = args[0],
            toNewForm = true,
            tgFormKey = args[1];
        var formDoc = null;
        var pForm = null;
        formDoc = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(formDoc);
        var tableKey = form.mapGrids[mapKey];
        var gridMap = form.getGridInfoMap(), grid, gMap, oids = [];
        for (var i = 0, len = gridMap.length; i < len; i++) {
            gMap = gridMap[i];
            grid = form.getComponent(gMap.key);
            if (gMap.tableKey == tableKey) {
                oids = grid.getFieldArray(form, YIUI.SystemField.OID_SYS_KEY);
                break;
            }
        }
        var params = {
            tgFormKey: tgFormKey,
            srcFormKey: form.formKey,
            srcDoc: $.toJSON(doc),
            oidList: $.toJSON(oids),
            cmd: "PureMap",
            toNewForm: toNewForm,
            mapKey: mapKey
        };
        var resultJson = Svr.SvrMgr.doMapEvent(params);
        var newForm = YIUI.UIUtil.show(resultJson, cxt, false, YIUI.ShowType.Map);

        var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
        var WID = info.WorkitemID;
        var newDoc = newForm.getDocument();
        var expKey = "SaveBPMMap";
        newDoc.expData[expKey] = WID;
        newDoc.expDataType[expKey] = YIUI.ExpandDataType.LONG;
        return true;
    };

    funs.GetFormCaption = function (name, cxt, args) {
        var form = cxt.form;
        return form.getFormCaption();
    };

    funs.GetFormAbbrCaption = function (name, cxt, args) {
        var form = cxt.form;
        return form.getAbbrCaption();
    };

    funs.StatusValue = function (name, cxt, args) {
        var form = cxt.form;
        var statusKey = args[0];

        var status = form.statusItems;
        if (args.length > 1) {
            var formKey = YIUI.TypeConvertor.toString(args[1]);
            var paras = {
                service: "PureStatus",
                cmd: "GetStatusItems",
                formKey: formKey
            };
            status = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        }

        for (var i = 0, len = status.length; i < len; i++) {
            if (status[i].key == statusKey) {
                return status[i].value;
            }
        }
        return null;
    };

    funs.GetStatusItems = function (name, cxt, args) {
        var form = cxt.form;
        var result = form.statusItems;
        if (args.length > 0) {
            var formKey = args[0];
            var paras = {
                service: "PureStatus",
                cmd: "GetStatusItems",
                formKey: formKey
            };
            result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        }
        return result;
    };

    funs.SetResult = function (name, cxt, args) {
        var form = cxt.form;
        var result = args[0];
        form.setResult(result);
        return true;
    };

    funs.GetResult = function (name, cxt, args) {
        var form = cxt.form;
        var result = form.getResult();
        return result;
    };

    funs.GetCaption = function (name, cxt, args) {
        var caption = "";
        var key = args[0];
        var form = cxt.form;
        var comp = form.getComponent(key);
        if (comp != null) {
            caption = comp.getShowText();
        }
        return caption;
    };

    funs.ReplaceTable = function (name, cxt, args) {
        var form = cxt.form;
        var document = form.getDocument();
        var key = args[0];
        var table = args[1];
        if (!(table instanceof DataDef.DataTable)) {
            table = YIUI.DataUtil.fromJSONDataTable(table);
        }
        document.remove(key);
        document.remove(YIUI.DataUtil.getShadowTableKey(key));
        table.key = key;
        document.add(key, table);
        return true;
    };

    funs.ReloadTable = function (name, cxt, args) {
        var tableKey = args[0];
        var form = cxt.form;
        form.reloadTable(tableKey);
    };

    funs.RefreshControl = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        var comp = form.getComponent(key);
        var type = comp.type;
        switch (type) {
            case YIUI.CONTROLTYPE.GRID:
                comp.rootGroupBkmk = [];
                comp.reload();
                break;
            case YIUI.CONTROLTYPE.LISTVIEW:
                comp.repaint();
                break;
            default:
                var tableKey = comp.tableKey;
                var table = form.getDocument().getByKey(tableKey);
                if (table != null) {
                    var value = YIUI.UIUtil.getCompValue(comp, table);
                    comp.setValue(value, false, false);
                }
                break;
        }
        return true;
    };

    funs.GetOperator = function (name, cxt, args) {
        return $.cookie("userID");
    };

    funs.DBUpdate = function (name, cxt, args) {
        var form = cxt.form;
        var SQL = args[0];
        var values = [];
        for (var i = 1, len = args.length; i < len; i++) {
            values.push(args[i]);
        }

        var paras = YIUI.YesJSONUtil.toJSONArray(values);

        var params = {
            service: "DBUpdate",
            cmd: "DBUpdate",
            sql: SQL,
            paras: $.toJSON(paras)
        };
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
        return result;
    };

    funs.DBNamedUpdate = function (name, cxt, args) {
        var form = cxt.form;
        var SQLName = YIUI.TypeConvertor.toString(args[0]);
        var values = [];
        for (var i = 1, len = args.length; i < len; i++) {
            values.push(args[i]);
        }

        var paras = YIUI.YesJSONUtil.toJSONArray(values);

        var params = {
            service: "DBUpdate",
            cmd: "DBNamedUpdate",
            formKey: form.getFormKey(),
            sql: SQLName,
            paras: $.toJSON(paras)
        };
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
        return result;
    };

    funs.DBQuery = function (name, cxt, args) {
        var form = cxt.form;
        var SQL = args[0];
        var values = [];
        for (var i = 1; i < args.length; i++) {
            values.push(args[i]);
        }
        var paras = YIUI.YesJSONUtil.toJSONArray(values);

        var params = {
            service: "DBQuery",
            cmd: "DBQuery",
            sql: SQL,
            paras: $.toJSON(paras)
        };
        var dataTable = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);

        if (dataTable) {
            dataTable.first();
        }
        return dataTable;

    };

    funs.DBNamedQuery = function (name, cxt, args) {
        var form = cxt.form;
        var sqlName = args[0];
        var values = [];
        for (var i = 1, len = args.length; i < len; i++) {
            values.push(args[i]);
        }

        var paras = YIUI.YesJSONUtil.toJSONArray(values);

        var params = {
            service: "DBQuery",
            cmd: "DBNamedQuery",
            sql: sqlName,
            formKey: form.getFormKey(),
            paras: $.toJSON(paras)
        };
        var dataTable = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);

        if (dataTable) {
            dataTable.first();
        }
        return dataTable;
    };

    funs.DBQueryValue = function (name, cxt, args) {

        var table = funs.DBQuery(name, cxt, args);
        var obj = null;
        if (table.first()) {
            obj = table.get(0);
        }
        return obj;

        /*(var form = cxt.form;
         var SQL = YIUI.TypeConvertor.toString(args[0]);
         //值
         var list = [];
         for (var i = 1, len = args.length; i < len; i++) {
         list.push(args[i] == null ? "" : args[i]);
         }

         var paras = YIUI.YesJSONUtil.toJSONArray(list);

         var params = {
         service: "PureWebDB",
         cmd: "PureDBQuery",
         SQL: SQL,
         values: $.toJSON(paras)
         };
         var tableJson = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
         if (!tableJson) return null;
         var table = YIUI.DataUtil.fromJSONDataTable(tableJson);
         var obj = null;
         if (table.first()) {
         table.setPos(0);
         obj = table.get(0);
         }
         return obj;*/
    };

    funs.DBNamedQueryValue = function (name, cxt, args) {
        var table = funs.DBNamedQuery(name, cxt, args);
        var obj = null;
        if (table.first()) {
            obj = table.get(0);
        }
        return obj;


        /*var form = cxt.form;
         var sqlName = args[0];
         var values = [];
         for (var i = 1, len = args.length; i < len; i++) {
         values.push(args[i]);
         }

         var paras = YIUI.YesJSONUtil.toJSONArray(values);

         var params = {
         service: "PureWebDB",
         cmd: "PureDBNamedQuery",
         SQLName: sqlName,
         formKey: form.formKey,
         values: $.toJSON(paras)
         };
         var tableJson = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
         if (!tableJson) return null;
         var table = YIUI.DataUtil.fromJSONDataTable(tableJson);
         var obj = null;
         if (table.first()) {
         table.setPos(0);
         obj = table.get(0);
         }
         return obj;*/
    };

    funs.SetColumnCaption = function (name, cxt, args) {
        var form = cxt.form, key = args[0],
            columnKey = args[1], caption = args[2],
            comp = form.getComponent(key);
        if (comp == undefined) return;
        if (comp.type == YIUI.CONTROLTYPE.GRID || comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
            comp.setColumnCaption(columnKey, caption);
        }
    };

    funs.SetColumnVisible = function (name, cxt, args) {
        var form = cxt.form, key = args[0],
            columnKey = args[1], visible = args[2],
            comp = form.getComponent(key);
        if (comp == undefined) return;
        if (comp.type == YIUI.CONTROLTYPE.GRID || comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
            comp.setColumnVisible(columnKey, visible);
        }
    };

    funs.RepaintGrid = function (name, cxt, args) {
        var form = cxt.form, gridKey = args[0],
            grid = form.getComponent(gridKey);
        grid && grid.repaint();
    };
//    funs.ReloadGrid = function (name, cxt, args) {
//        var form = cxt.form, doc = form.getDocument(), gridKey = YIUI.TypeConvertor.toString(args[0]), sourceKey = "", state = 0;
//        if (doc == null) return;
//        if (args.length > 2) {
//            sourceKey = YIUI.TypeConvertor.toString(args[2]);
//        }
//        if (args.length > 3) {
//            if ("new" == YIUI.TypeConvertor.toString(args[3]).toLowerCase()) {
//                state = 1;
//            }
//        }
//        var grid = form.getComponent(gridKey);
//        if (grid == null) {
//            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
//        }
//        var tableKey = grid.tableKey, filterMap = form.filterMap;
//        filterMap.setType(YIUI.DocumentType.DETAIL);
//
//        var dataTable = doc.getByKey(tableKey);
//        if (dataTable == null) return;
//        var tableFilter = filterMap.getTblFilter(tableKey);
//        tableFilter.SourceKey = sourceKey;
//        var params = {
//            cmd: "PureLoadData",
//            oid: form.getDocument().oid,
//            form: form.toJSON(),
//            formKey: form.getFormKey(),
//            parameters: form.getParas().toJSON(),
//            filterMap: $.toJSON(filterMap),
//            condition: $.toJSON(form.getCondParas()),
//            doPostShow: false
//        };
//        var result = Svr.SvrMgr.loadFormData(params);
//        if ($.isEmptyObject(result.form) || $.isEmptyObject(result.document)) return;
//        var newDoc = YIUI.DataUtil.fromJSONDoc(result.document),
//            newTable = newDoc.getByKey(tableKey);
//        if (state == 1) {
//            newTable.setNew();
//        }
//        doc.remove(tableKey);
//        doc.add(tableKey, newTable);
//        grid.getHandler().diffFromFormJson(grid, result.form);
//    };

       funs.ReloadGrid = function (name, cxt, args) {
        var form = cxt.form, doc = form.getDocument(), gridKey = YIUI.TypeConvertor.toString(args[0]), sourceKey = "", state = 0;
        if (doc == null) return;
        if (args.length > 2) {
            sourceKey = YIUI.TypeConvertor.toString(args[2]);
        }
        if (args.length > 3) {
            if ("new" == YIUI.TypeConvertor.toString(args[3]).toLowerCase()) {
                state = 1;
            }
        }
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }
        form.reloadTable(grid.tableKey);
        grid.reload(true);
    };

    funs.SetForeColor = function (name, cxt, args) {
        var key = YIUI.TypeConvertor.toString(args[0]);
        var color = "";
        if (args.length > 1) {
            color = YIUI.TypeConvertor.toString(args[1]);
        }
        var form = cxt.form;
        var comp = form.getComponent(key);
        if (comp != null) {
            comp.setForeColor(color);
        }
    };

    funs.SetBackColor = function (name, cxt, args) {
        var key = YIUI.TypeConvertor.toString(args[0]);
        var color = "";
        if (args.length > 1) {
            color = YIUI.TypeConvertor.toString(args[1]);
        }
        var form = cxt.form;
        var comp = form.getComponent(key);
        if (comp != null) {
            comp.setBackColor(color);
        }
    };
    funs.RefreshUIStatus = function (name, cxt, args) {
        cxt.form.resetUIStatus(YIUI.FormUIStatusMask.ENABLE | YIUI.FormUIStatusMask.VISIBLE | YIUI.FormUIStatusMask.OPERATION);
        return true;
    };
    funs.RefreshOperation = function (name, cxt, args) {
        cxt.form.resetUIStatus(YIUI.FormUIStatusMask.OPERATION);
        return true;
    };
    funs.GetDocument = function (name, cxt, args) {
        var form = cxt.form;
        return form.getDocument();
    };
    funs.SetDocument = function (name, cxt, args) {
        var form = cxt.form;
        if (args[0] instanceof DataDef.Document) {
            var doc = args[0];
            form.setDocument(doc);
            return true;
        } else {
            return false;
        }
    };

    funs.EvalMidExp = function (name, cxt, args) {
        var form = cxt.form;
        var withDoc = false;
        withDoc = YIUI.TypeConvertor.toBoolean(args[0]);
        var exp = "";
        exp = YIUI.TypeConvertor.toString(args[1]);
        var doc = null;
        if (withDoc) {
            doc = form.getDocument();
        }
        var count = args.length - 2;
        if (count < 0) {
            count = 0;
        }

        var newArgs = [];
        for (var i = 2, size = args.length; i < size; ++i) {
            newArgs.push(args[i]);
        }
        doc = YIUI.DataUtil.toJSONDoc(doc);
        var formParas = form != null ? form.getParas() : null;
        var paras = {
            service: "PureMid",
            cmd: "pureEvalMidExp",
            exp: exp,
            document: $.toJSON(doc),
            paras: $.toJSON(newArgs),
            formParas: formParas.toJSON()
        };
        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
    };

    funs.InvokeService = function (name, cxt, args) {
        var form = cxt.form;
        var serviceName = YIUI.TypeConvertor.toString(args[0]);
        var withDoc = false;
        if (args.length > 1) {
            withDoc = YIUI.TypeConvertor.toBoolean(args[1]);
        }
        var refresh = false;
        if (args.length > 2) {
            refresh = YIUI.TypeConvertor.toBoolean(args[2]);
        }

        var paras = null;
        var mapParas = null;
        if (args.length == 4) {
            if (args[3]) {
                var map = {};
                mapParas = splitPara(args[3]);
            }
        }

        var data = {
            service: "InvokeService",
            extSvrName: serviceName,
            paras: $.toJSON(paras)
        };

        if ($.isEmptyObject(mapParas)) {
            if (args.length > 3) {
                paras = [];
                for (var i = 3; i < args.length; i++) {
                    var para = args[i];
                    paras.push(para);
                }
                paras = YIUI.YesJSONUtil.toJSONArray(paras);
            }

        } else {
            for (var key in mapParas) {
                var value = form.eval(mapParas[key], cxt);
                map[key] = value;
            }
            paras = YIUI.YesJSONUtil.toJSONObject(map);
            data.cmd = "InvokeExtService2";
        }

        data.paras = $.toJSON(paras);

        var doc = null;
        if (withDoc) {
            doc = form.getDocument();
            doc = YIUI.DataUtil.toJSONDoc(doc);
            data.document = $.toJSON(doc);
        }
        //返回值为document

        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data);
        if (refresh && result instanceof DataDef.Document) {
            form.setDocument(result);
            form.showDocument();
        }
        return result;
    };

    funs.NewJSONObject = function (name, cxt, args) {
        var content = "";
        if (args.length > 0) {
            content = YIUI.TypeConvertor.toString(args[0]);
        }
        var obj = null;
        if (content) {
            obj = $.parseJSON(content);
        } else {
            obj = {};
        }
        return obj;
    };

    funs.NewJSONArray = function (name, cxt, args) {
        var content = "";
        if (args.length > 0) {
            content = YIUI.TypeConvertor.toString(args[0]);
        }
        var obj = null;
        if (content) {
            obj = $.parseJSON(content);
        } else {
            obj = [];
        }
        return obj;
    };

    funs.SetSessionPara = function (name, cxt, args) {
        var key = YIUI.TypeConvertor.toString(args[0]);
        var value = args[1];
        var paras = $.parseJSON($.cookie("sessionParas"));
        paras[key] = value;
        $.cookie("sessionParas", $.toJSON(paras));

        var map = {};
        map[key] = value;

        var params = {
            cmd: "SetSessionParas",
            service: "HttpAuthenticate",
            paras: $.toJSON(YIUI.YesJSONUtil.toJSONObject(map))
        };
        Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);

        return true;
    };

    funs.GetSessionPara = function (name, cxt, args) {
        var key = YIUI.TypeConvertor.toString(args[0]);
        var paras = $.parseJSON($.cookie("sessionParas"));
        return paras[key];
    };

    funs.ImportExcel = function (name, cxt, args) {
        var needResult = false;
        if (args.length > 0) {
            needResult = YIUI.TypeConvertor.toBoolean(args[0]);
        }

        var callback = null;
        if (needResult) {
            callback = function () {
                var options = {
                    msg: "导入成功！",
                    msgType: YIUI.Dialog_MsgType.DEFAULT
                };
                var dialog = new YIUI.Control.Dialog(options);
                dialog.render();
            };
        }
        var clearOriginalData = true;
        if (args.length > 1) {
            clearOriginalData = YIUI.TypeConvertor.toBoolean(args[1]);
        }

        var importServiceName = "";
        if (args.length > 2) {
            importServiceName = YIUI.TypeConvertor.toString(args[2])
        }

        var formKey = cxt.form.formKey;
        if (cxt.form.paras.get("FormKey")) {
            formKey = cxt.form.paras.get("FormKey");
        }
        
        var fileChooser = new YIUI.FileChooser("PureFileOperate", "PureImportExcel");
        var options = {
            clearOriginalData: clearOriginalData,
            importServiceName: importServiceName,
            formKey: formKey
        };
        fileChooser.upload(options, callback);
    };
    
    funs.SingleImportExcel = function (name, cxt, args) {
        var clearOriginalData = false;
        var postImportServiceName = "";
        var importServiceName = "";
        var postFormula = "";
        var async = false;
        
        if (args.length > 0) {
        	clearOriginalData = YIUI.TypeConvertor.toBoolean(args[0]);
		}
        
        if (args.length > 1) {
        	postImportServiceName = YIUI.TypeConvertor.toString(args[1]);
        }
        
        if (args.length > 2) {
        	importServiceName = YIUI.TypeConvertor.toString(args[2]);
        }

        if (args.length > 3) {
        	postFormula = YIUI.TypeConvertor.toString(args[3]);
        }

        if (args.length > 4) {
        	async = YIUI.TypeConvertor.toBoolean(args[4]);
        }
        
        var callback = function (jsonObj) {
        	var data = jsonObj.data;
        	var document = data.document, doc;
        	var form = cxt.form;
        	if (document) {
        		doc = YIUI.DataUtil.fromJSONDoc(document);
        		form.setDocument(doc);
        		form.showDocument();
        	}
        };
        
        var form = cxt.form;
        var document = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(document);
        var fileChooser = new YIUI.FileChooser("PureFileOperate", "PureSingleImportExcel");
        var options = {
        		clearOriginalData: clearOriginalData,
                importServiceName: importServiceName,
                postImportServiceName: postImportServiceName,
                formKey: form.formKey,
                document: $.toJSON(doc)
        };
        
        fileChooser.upload(options, callback);
    };

    funs.ExportExcel = function (name, cxt, args) {
        var form = cxt.form;
        var needDownload = true;
        var exportTables = "";
        var exportCurPage = false;
        var postExportServerName = "";
        if (args.length > 0) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[0]);
        }
        if (args.length > 1) {
            exportTables = YIUI.TypeConvertor.toString(args[1]);
        }

        if (args.length > 2) {
            exportCurPage = YIUI.TypeConvertor.toBoolean(args[2]);
        }

        if (args.length > 3) {
            postExportServerName = YIUI.TypeConvertor.toString(args[3]);
        }

        var document = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(document);
        var parameters = form != null ? form.getParas() : null;
        var filterMap = form.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DATAOBJECT);
        var paras = {};
        paras.service = "ExportFile";
        paras.cmd = "ExportExcel";
        paras.formKey = form.formKey;
        paras.document = $.toJSON(doc);
        paras.parameters = parameters.toJSON();
        paras.exportTables = exportTables;
        paras.onlyCurrentPage = exportCurPage;
        paras.postExportServerName = postExportServerName;
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var filePath = result.filePath.replace(/\\/g, "/");
            var fileMD5 = result.fileMD5;
            var fileName = result.fileName;
            location.href = Svr.SvrMgr.AttachURL + "?"+ encodeURI("formKey=" + form.formKey + "&filePath=" + filePath + "&fileMD5=" + fileMD5 + "&mode=1&service=DownloadExcel&fileName=" + fileName);
        }
        return true;

    };

    funs.BatchExportExcel = function (name, cxt, args) {
        var form = cxt.form;
        
        var exportFormKey = YIUI.TypeConvertor.toString(args[0]);
        var tableKey = YIUI.TypeConvertor.toString(args[1]);
        var OIDFieldKey = YIUI.TypeConvertor.toString(args[2]);
        
        var templateKey = "";
		if (args.length > 3) {
			templateKey = YIUI.TypeConvertor.toString(args[3]);
		}
		
		var needDownload = true;
		if (args.length > 4) {
			needDownload = YIUI.TypeConvertor.toBoolean(args[4]);
		}
		
		var postExportServerName = "";
		if (args.length > 5) {
			postExportServerName = YIUI.TypeConvertor.toString(args[5]);
		}

        var document = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(document);
        var parameters = form != null ? form.getParas() : null;
        var filterMap = form.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DATAOBJECT);
        var paras = {};
        paras.service = "ExportFile";
        paras.cmd = "BatchExportExcel";
        paras.parameters = parameters.toJSON();
        paras.formKey = form.formKey;
        paras.exportFormKey = exportFormKey;
        paras.tableKey = tableKey;
        paras.OIDFieldKey = OIDFieldKey;
        paras.templateKey = templateKey;
        paras.postExportServerName = postExportServerName;
        paras.document = $.toJSON(doc);
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var filePath = result.filePath.replace(/\\/g, "/");
            var fileMD5 = result.fileMD5;
            var fileName = result.fileName;
            location.href = Svr.SvrMgr.AttachURL + "?"+ encodeURI("formKey=" + form.formKey + "&filePath=" + filePath + "&fileMD5=" + fileMD5 + "&mode=1&service=DownloadExcel&fileName=" + fileName);
        }
        return true;

    };
    
    funs.ExportExcelWithTemplate = function (name, cxt, args) {
        var form = cxt.form;
        var templateKey = YIUI.TypeConvertor.toString(args[0]);
        var needDownload = true;
        var postExportServerName = "";
        if (args.length > 1) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[1]);
        }

        if (args.length > 2) {
            postExportServerName = YIUI.TypeConvertor.toString(args[2]);
        }

        var document = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(document);
        var parameters = form != null ? form.getParas() : null;
        var filterMap = form.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DATAOBJECT);
        var paras = {};
        paras.service = "ExportFile";
        paras.cmd = "ExportExcelWithTemplate";
        paras.formKey = form.formKey;
        paras.document = $.toJSON(doc);
        paras.parameters = parameters.toJSON();
        paras.templateKey = templateKey;
        paras.postExportServerName = postExportServerName;
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var filePath = result.filePath.replace(/\\/g, "/");
            var fileMD5 = result.fileMD5;
            var fileName = result.fileName;
            location.href = Svr.SvrMgr.AttachURL + "?"+ encodeURI("formKey=" + form.formKey + "&filePath=" + filePath + "&fileMD5=" + fileMD5 + "&mode=1&service=DownloadExcel&fileName=" + fileName);
        }
        return true;
    };

    funs.ExportCSV = function (name, cxt, args) {
        var form = cxt.form;
        var needDownload = true;
        var exportTables = "";
        var exportCurPage = false;
        var postExportServerName = "";
        if (args.length > 0) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[0]);
        }

        if (args.length > 1) {
            exportTables = YIUI.TypeConvertor.toString(args[1]);
        }

        if (args.length > 2) {
            exportCurPage = YIUI.TypeConvertor.toBoolean(args[2]);
        }

        if (args.length > 3) {
            postExportServerName = YIUI.TypeConvertor.toString(args[3]);
        }

        var document = form.getDocument();
        var doc = YIUI.DataUtil.toJSONDoc(document);
        var parameters = form != null ? form.getParas() : null;
        var filterMap = form.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DATAOBJECT);
        var paras = {};
        paras.service = "ExportFile";
        paras.cmd = "ExportCSV";
        paras.formKey = form.formKey;
        paras.document = $.toJSON(doc);
        paras.parameters = parameters.toJSON();
        paras.exportTables = exportTables;
        paras.onlyCurrentPage = exportCurPage;
        paras.postExportServerName = postExportServerName;
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var filePath = result.filePath.replace(/\\/g, "/");
            var fileMD5 = result.fileMD5;
            var fileName = result.fileName;
            location.href = Svr.SvrMgr.AttachURL + "?"+ encodeURI("formKey=" + form.formKey + "&filePath=" + filePath + "&fileMD5=" + fileMD5 + "&mode=1&service=DownloadExcel&fileName=" + fileName);
        }
        return true;
    };

    funs.Print = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "PrintService";
        paras.cmd = "Print";
        paras.OID = form.OID;
        paras.formKey = form.formKey;

        var reportKey = "";
        if (args.length > 0) {
            reportKey = YIUI.TypeConvertor.toString(args[0]);
        }
        paras.reportKey = reportKey;
        var fillEmptyPrint = false;
        if (args.length > 1) {
            fillEmptyPrint = YIUI.TypeConvertor.toBoolean(args[1]);
        }
        paras.fillEmptyPrint = fillEmptyPrint;

        var url = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        YIUI.Print.print(url, form.formKey);
    };

    funs.PrintPreview = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "PrintService";
        paras.cmd = "Print";
        paras.OID = form.OID;
        paras.formKey = form.formKey;

        var reportKey = "";
        if (args.length > 0) {
            reportKey = YIUI.TypeConvertor.toString(args[0]);
        }
        paras.reportKey = reportKey;
        var fillEmptyPrint = false;
        if (args.length > 1) {
            fillEmptyPrint = YIUI.TypeConvertor.toBoolean(args[1]);
        }
        paras.fillEmptyPrint = fillEmptyPrint;

        var url = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        url = url.replace(/\\/g, "/");
        var opts = {
            formKey: form.formKey,
            url: url
        };
        var pv = new YIUI.PrintPreview(opts);

    };

    {  //BPM函数
        funs.GetProcessKey = function (name, cxt, args) {
            var form = cxt.form, processKey = "",
                doc = form.getDocument(),
                expData = doc.getExpDataInfo("BPM").data,
                table = YIUI.DataUtil.fromJSONDataTable(expData);
            if (table && table.getRowCount() > 0) {
                table.first();
                processKey = table.getByKey("ProcessKey");
            }
            return processKey;
        };

        funs.GetProcessVer = function (name, cxt, args) {
            var form = cxt.form, processVer = -1, tempVer = -1,
                doc = form.getDocument(),
                expData = doc.getExpDataInfo("BPM").data,
                table = YIUI.DataUtil.fromJSONDataTable(expData);
            if (table && table.getRowCount() > 0) {
                table.first();
                tempVer = table.getByKey("Version");
                if (tempVer) {
                    processVer = parseInt(tempVer);
                }
            }
            return processVer;
        };

        funs.AddDelegateData = function (name, cxt, args) {
            var index = 0;
            var delegateType = args[index++].toString();
            var srcOperatorID = args[index++].toString();
            var tgtOperatorID = args[index++].toString();
            var objectType = args[index++].toString();
            var objectKey = args[index++];
            var nodeKey = args[index++];
            var StartTime = args[index++];
            var alwaysValid = args[index++];
            var EndTime = alwaysValid ? new Date(0) : args[index++];
            var paras = {
                delegateType: delegateType,
                srcOperatorID: srcOperatorID,
                tgtOperatorID: tgtOperatorID,
                objectType: objectType,
                objectKey: objectKey,
                nodeKey: nodeKey,
                StartTime: StartTime ? StartTime.getTime() : null,
                alwaysValid: alwaysValid,
                EndTime: EndTime ? EndTime.getTime() : null,
                cmd: "PureAddDelegateData",
                service: "PureWebBPM"
            };
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

        };

        funs.DeleteDelegateData = function (name, cxt, args) {
            var paras = {
                delegateID: args[0].toString(),
                cmd: "PureDeleteDelegateData",
                service: "PureWebBPM"
            };
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        };

        funs.GetActiveWorkitemID = function (name, cxt, args) {
            var info = getActiveWorkitem(cxt, args);
            var WID = info.WorkitemID;
            return WID;
        };

        funs.GetActiveNodeID = function (name, cxt, args) {
            var WID = -1;
            var info = getActiveWorkitem(cxt, args);
            if (info) {
                 WID= info.NodeID;
            }
            return WID;
        };


        funs.GetActiveInstanceID = function (name, cxt, args) {
            var info = getActiveWorkitem(cxt, args);
            var instanceID = info.InstanceID;
            return instanceID;
        };

        var getActiveWorkitem = function (cxt, args) {
            var fromParent = false;
            if (args.length > 0) {
                fromParent = YIUI.TypeConvertor.toBoolean(args[0]);
            }
            var form = cxt.form;
            if (fromParent) {
                var pFormID = form.pFormID;
                form = YIUI.FormStack.getForm(pFormID);
            }
            var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
            if (!info) {
                YIUI.BPMException.throwException(YIUI.BPMException.NO_ACTIVE_WORKITEM);
            }
            return info;
        };

        funs.GetActiveWorkitemFormKey = function (name, cxt, args) {
            var info = getActiveWorkitem(cxt, args);
            var formKey = info.FormKey;
            return formKey;
        };

        funs.RestartInstanceByOID = function (name, cxt, args) {
            var instanceOID = null;
            if (args.length > 0) {
                instanceOID = YIUI.TypeConvertor.toInt(args[0]);
            } else {
                var form = cxt.form;
                if (form) {
                    var doc = form.getDocument();
                    if (doc) {
                        instanceOID = doc.oid;
                    }
                }
            }
            var paras = {};
            paras.service = "PureWebBPM";
            paras.cmd = "PureRestartInstanceByOID";
            paras.formKey = form.formKey;
            paras.oid = form.OID;
            paras.instanceOID = instanceOID;
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            YIUI.UIUtil.show(result, cxt, true);

        };

        funs.IsInstanceStarted = function (name, cxt, args) {
            var OID = null;
            if (args.length > 0) {
                OID = YIUI.TypeConvertor.toInt(args[0]);
            } else {
                var form = cxt.form;
                if (form) {
                    var doc = form.getDocument();
                    if (doc) {
                        OID = doc.oid;
                    }
                }
            }
            var paras = {};
            paras.service = "BPM";
            paras.cmd = "IsInstanceStarted";
            paras.OID = OID;
            var json = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            var started = YIUI.TypeConvertor.toBoolean(json.result);
            return started;
        };

        funs.EndInstance = function (name, cxt, args) {
            var instanceID = YIUI.TypeConvertor.toLong(args[0]);
            if (instanceID == -1) {
                var fromParent = false;
                if (args.length > 1) {
                    fromParent = YIUI.TypeConvertor.toBoolean(args[1]);
                }

                var form = cxt.form;
                if (fromParent) {
                    var pFormID = form.pFormID;
                    form = YIUI.FormStack.getForm(pFormID);
                }

                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                instanceID = info.InstanceID;

                var paras = {};
                paras.service = "PureWebBPM";
                paras.cmd = "PureEndInstance";
                paras.instanceID = instanceID;
                paras.hasForm = false;
                var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

                form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);
                form.hostUIStatusProxy = null;
                var doc = form.getDocument();
                var b = doc.expData[YIUI.BPMKeys.WORKITEM_INFO];
                if (b != null) {
                    form.getDocument().putExpandData(YIUI.BPMKeys.WORKITEM_INFO, null);
                }
                viewReload(result, cxt);
            } else {
                var paras = {};
                paras.service = "PureWebBPM";
                paras.cmd = "PureEndInstance";
                paras.instanceID = instanceID;
                paras.hasForm = false;
                var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            }

            return true;
        };

        funs.DisableDelegateData = function (name, cxt, args) {
            var form = cxt.form;
            var delegateID = YIUI.TypeConvertor.toInt(args[0]);
            var paras = {};
            paras.service = "BPM";
            paras.cmd = "UpdateDelegateDataState";
            paras.delegateID = delegateID;
            paras.onUse = false;
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return true;
        };

        funs.SetDelegateDataInUse = function (name, cxt, args) {
            var form = cxt.form;
            var delegateID = YIUI.TypeConvertor.toInt(args[0]);
            var paras = {};
            paras.service = "BPM";
            paras.cmd = "UpdateDelegateDataState";
            paras.delegateID = delegateID;
            paras.onUse = true;
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return true;
        };

        funs.OpenWorkitem = function (name, cxt, args) {
            var form = cxt.form;
            var onlyOpen = false;
            if (args.length > 1) {
                onlyOpen = YIUI.TypeConvertor.toBoolean(args[1]);
            }

            var paras = {
                WID: args[0].toString(),
                onlyOpen: onlyOpen,
                cmd: "PureOpenWorkitem",
                service: "PureWebBPM"
            };
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            YIUI.UIUtil.show(result, cxt, false, YIUI.ShowType.WorkItem);
        };

        var CommitWorkitem = function (cxt, args) {
            var form = cxt.form;
            var WID = args[0].toString();
            var info = null;
            var paras = {
                WID: WID,
                cmd: "PureCommitWorkitem",
                service: "PureWebBPM"
            };
            if (WID == -1) {
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                WID = info.WorkitemID;
                info.AuditResult = args[1];
                info.UserInfo = args[2];
                paras.workitemInfo = $.toJSON(info);
            } else {
                paras.AuditResult = args[1];
                paras.UserInfo = args[2];
            }

            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            viewReload(result, cxt);

        };

        funs.AuditWorkitem = function (name, cxt, args) {
            CommitWorkitem(cxt, args);
        };

        funs.CommitWorkitem = function (name, cxt, args) {
            CommitWorkitem(cxt, args);
        };

        funs.BatchCommitWorkitem = function (name, cxt, args) {
            var form = cxt.form;
            var OIDList = null;
            var result = 1;
            var userInfo = "";
            if (args.length == 3) {
                OIDList = [];
                var list = args[0];
                for (var i = 0, len = list.length; i < len; i++) {
                    OIDList.push(YIUI.TypeConvertor.toLong(list[i]));
                }
                result = YIUI.TypeConvertor.toInt(args[1]);
                userInfo = YIUI.TypeConvertor.toString(args[2]);
            } else {
                var tableKey = YIUI.TypeConvertor.toString(args[0]);
                var OIDFieldKey = YIUI.TypeConvertor.toString(args[1]);
                OIDList = YIUI.BatchUtil.getSelectOIDs(form, tableKey, OIDFieldKey, true);
                result = YIUI.TypeConvertor.toInt(args[2]);
                userInfo = YIUI.TypeConvertor.toString(args[3]);
            }

            var paras = {
                userInfo: userInfo,
                result: result,
                OIDList: $.toJSON(OIDList),
                cmd: "PureBatchCommitWorkitem",
                service: "PureWebBPM"
            };
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return true;
        };
        
        funs.BatchCommitWorkitemByWID = function (name, cxt, args) {
            var form = cxt.form;
            var WIDList = null;
            var result = 1;
            var userInfo = "";
            if (args.length == 3) {
                WIDList = [];
                var list = args[0];
                for (var i = 0, len = list.length; i < len; i++) {
                    WIDList.push(YIUI.TypeConvertor.toLong(list[i]));
                }
                result = YIUI.TypeConvertor.toInt(args[1]);
                userInfo = YIUI.TypeConvertor.toString(args[2]);
            } else {
                var tableKey = YIUI.TypeConvertor.toString(args[0]);
                var WIDFieldKey = YIUI.TypeConvertor.toString(args[1]);
                WIDList = YIUI.BatchUtil.getSelectOIDs(form, tableKey, WIDFieldKey, true);
                result = YIUI.TypeConvertor.toInt(args[2]);
                userInfo = YIUI.TypeConvertor.toString(args[3]);
            }

            var paras = {
                userInfo: userInfo,
                result: result,
                WIDList: $.toJSON(WIDList),
                cmd: "PureBatchCommitWorkitemByWID",
                service: "PureWebBPM"
            };
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return true;
        };

        funs.StartInstance = function (name, cxt, args) {
            var form = cxt.form;
            var paras = {};
            paras.service = "PureWebBPM";
            paras.cmd = "PureStartInstance";
            paras.formKey = form.formKey;
            paras.processKey = args[0];
            paras.oid = form.OID;
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            viewReload(result, cxt);
        };

        funs.RestartInstance = function (name, cxt, args) {
            var form = cxt.form;
            var instanceID = YIUI.TypeConvertor.toInt(args[0]);
            if (instanceID == -1) {
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                instanceID = info.InstanceID;
            }
            var paras = {};
            paras.service = "PureWebBPM";
            paras.cmd = "PureRestartInstance";
            paras.formKey = form.formKey;
            paras.oid = form.OID;
            paras.instanceID = instanceID;
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            viewReload(result, cxt);
            return true;
        };

        funs.KillInstance = function (name, cxt, args) {
            var instanceID = args[0].toString();
            if (instanceID == -1) {
                var form = cxt.form;
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                instanceID = info.InstanceID;
            }
            var paras = {
                instanceID: instanceID,
                cmd: "PureKillInstance",
                service: "PureWebBPM"
            };
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            viewReload(result, cxt);
        };

        var viewReload = function (newFormJson, cxt) {
            var form = cxt.form;
            var container = form.getDefContainer();
            if (container == null) {
                container = form.getContainer();
            }
            var newForm = YIUI.UIUtil.show(newFormJson, cxt, true);

            var tag = newForm.getSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW);
            // 如果这个工作项是代办页面打开的，提交工作项之后刷新代办页面
            if (tag == YIUI.BPMConstants.WORKITEM_VIEW) {
                var pFormID = newForm.pFormID;
                var viewForm = YIUI.FormStack.getForm(pFormID);
                if (!viewForm || viewForm.type != YIUI.Form_Type.View) {
                    return;
                }
                var old = viewForm.getOperationState();

                var loadParent = new YIUI.LoadOpt(viewForm);
                loadParent.doOpt();
                viewForm = YIUI.FormStack.getForm(pFormID);
                viewForm.setOperationState(old);
                viewForm.showDocument();
            }
            // 获取载入前数据的版本号
            var originDocContainVerID = false;
            var originVerID = -1;
            var originDoc = newForm.getDocument();
            if (originDoc) {
                //MainTable
                var mtKey = newForm.mainTableKey;
                var mt = originDoc.getByKey(mtKey);
                if (mt && mt.getRowCount() > 0) {
                    originVerID = mt.getByKey(YIUI.SystemField.VERID_SYS_KEY);
                    if (originVerID >= 0)
                        originDocContainVerID = true;
                }
            }

            var loadParent = new YIUI.LoadOpt(newForm);
            loadParent.doOpt();

            // 原始数据无版本信息，那么就不要执行UpdateView
            if (!originDocContainVerID)
                return;

            // 获取载入后数据的版本号，如果发生了变化,那么执行UpdateView
            var activeDoc = newForm.getDocument();
            if (activeDoc != null) {
                var mtKey = newForm.mainTableKey;
                var mt = activeDoc.getByKey(mtKey);
                if (mt && mt.getRowCount() > 0) {
                    var newVerID = mt.getByKey(YIUI.SystemField.VERID_SYS_KEY);
                    if (parseInt(newVerID) > parseInt(originVerID)) {
                        updateView(cxt);
                    }
                }
            }

        };

        funs.RollbackToWorkitem = function (name, cxt, args) {
            var form = cxt.form;
            var WID = YIUI.TypeConvertor.toInt(args[0]);
            var logicCheck = false;
            if (args.length > 1) {
                logicCheck = YIUI.TypeConvertor.toBoolean(args[1]);
            }
            var paras = {
                WID: WID,
                logicCheck: logicCheck,
                formKey: form.formKey,
                OID: form.OID,
                cmd: "PureRollbackToWorkitem",
                service: "PureWebBPM"
            };
            var ps = form.paras;
            paras.paras = JSON.stringify(ps.getMap());

            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            viewReload(result, cxt);
            return true;
        };

        funs.AssignNextNodeParticipator = function (name, cxt, args) {
            var info = getActiveWorkitem(cxt, args);
            var role = false;
            if (args.length > 2) {
                role = YIUI.TypeConvertor.toBoolean(args[2]);
            }
            var table = new DataDef.DataTable();
            var user_type = YIUI.DataUtil.dataType2JavaDataType(YIUI.DataType.STRING);
            table.addCol(YIUI.PPObject_Type.ColumnType, YIUI.DataType.STRING, user_type);
            table.addCol(YIUI.PPObject_Type.ColumnInfo, YIUI.DataType.STRING, user_type);

            var pp = new YIUI.PPObject(table);

            var opStr = YIUI.TypeConvertor.toString(args[1]);
            table.addRow();

            table.setByKey(YIUI.PPObject_Type.ColumnType, role ? YIUI.PPObject_Type.DicRole : YIUI.PPObject_Type.DicOperator);
            table.setByKey(YIUI.PPObject_Type.ColumnInfo, opStr);

            info.NextOpStr = $.toJSON(pp.toJSON());
            return true;
        };

        funs.SetCustomKey = function (name, cxt, args) {
            var customKey = YIUI.TypeConvertor.toString(args[0]);
            var form = cxt.form;
            var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
            info.OperationKey = customKey;
            return true;
        };

        funs.BatchStateAction = function (name, cxt, args) {
            var form = cxt.form;
            var processKey = YIUI.TypeConvertor.toString(form.getPara(YIUI.BatchBPM.BPM_PROCESS_KEY));
            var actionNodeKey = YIUI.TypeConvertor.toString(form.getPara(YIUI.BatchBPM.BPM_ACTION_NODE_KEY));
            var lv = null;
            var mTblKey = form.mainTableKey;
            if (mTblKey) {
                lv = form.getListView(mTblKey);
            } else {
                lv = form.getListView(0);
            }
            var OIDList = lv.getFieldArray(form, YIUI.SystemField.OID_SYS_KEY);
            var result = YIUI.TypeConvertor.toInt(args[0]);
            var userInfo = YIUI.TypeConvertor.toString(args[1]);
            var paras = {
                processKey: processKey,
                actionNodeKey: actionNodeKey,
                result: result,
                userInfo: userInfo,
                OIDList: $.toJSON(OIDList),
                cmd: "PureBatchStateAction",
                service: "PureViewMap"
            };
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return true;
        };

        funs.GetProcessPath = function (name, cxt, args) {
            var OID = null;
            if (args.length > 0) {
                OID = YIUI.TypeConvertor.toInt(args[0]);
            } else {
                var form = cxt.form;
                if (form) {
                    var doc = form.getDocument();
                    if (doc) {
                        OID = doc.getOID();
                    }
                }
            }
            var paras = {
                OID: OID,
                cmd: "PureLoadProcessPath",
                service: "PureViewMap"
            };
            var rs = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return rs;
        };

        funs.RegisterAttachment = function (name, cxt, args) {
            var OID = YIUI.TypeConvertor.toLong(args[0]);
            var key = YIUI.TypeConvertor.toString(args[1]);
            var attachmentOID = YIUI.TypeConvertor.toLong(args[2]);

            var attachmentPara = "";
            if (args.length > 3)
                attachmentPara = YIUI.TypeConvertor.toString(args[3]);
            var attachmentInfo = "";
            if (args.length > 4)
                attachmentInfo = YIUI.TypeConvertor.toString(args[4]);

            var paras = {
                OID: OID,
                Key: key,
                AttachmentOID: attachmentOID,
                AttachmentInfo: attachmentInfo,
                AttachmentPara: attachmentPara,
                cmd: "RegisterAttachment",
                service: "BPM"
            };
            var rs = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

            return true;
        };
    }

    { //Detail相关
        funs.OpenDetail = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]),
                DOID = YIUI.TypeConvertor.toString(args[2]),
                form = cxt.form;
            if (DOID == undefined || DOID == "" || DOID == null) return;
            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.OpenDetailInGrid = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]),
                DOID = YIUI.TypeConvertor.toString(args[2]),
                form = cxt.form, rowIndex = cxt.rowIndex;
            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, inGrid: true, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                var newForm = YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
                newForm.getDocument().oid = OID;
                newForm.getDocument().clear();
                var pTable = form.getDocument().getByKey(newForm.refTableKey);
                var pGrid = form.getGridInfoByTableKey(newForm.refTableKey);
                pGrid = form.getComponent(pGrid.key);
                if (rowIndex == undefined) {
                    rowIndex = pGrid.getFocusRowIndex();
                } else {
                    pGrid.setFocusRowIndex(rowIndex);
                }
                var focusRow = pGrid.getRowDataAt(rowIndex);
                pTable.setByBkmk(focusRow.bookmark);
                var nTable = new DataDef.DataTable();
                $.extend(true, nTable.cols, pTable.cols);
                nTable.key = pTable.key;
                nTable.addRow();
                for (var i = 0, len = nTable.cols.length; i < len; i++) {
                    nTable.set(i, pTable.get(i));
                }
                nTable.batchUpdate();
                newForm.getDocument().add(newForm.refTableKey, nTable);
                newForm.showDocument();
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.SaveDetail = function (name, cxt, args) {
            var direct = false, form = cxt.form, doc = form.getDocument(),
                refTableKey = form.refTableKey, isStandalone = form.isStandalone();
            var pForm = YIUI.FormStack.getForm(form.pFormID);
            if (args.length > 0) {
                direct = YIUI.TypeConvertor.toBoolean(args[0]);
            }
            var uiCheckOpt = new YIUI.UICheckOpt(form);
            if (!uiCheckOpt.doOpt()) return false;
            if (direct) {
                doc.docType = DataDef.D_ObjDtl;
                doc.setModified();
                var document = YIUI.DataUtil.toJSONDoc(doc);
                var params = {
                    cmd: "PureSaveData",
                    document: $.toJSON(document),
                    formKey: form.getFormKey()
                };
                var resultJson = Svr.SvrMgr.dealWithPureData(params);
                YIUI.FormBuilder.diff(form, resultJson);
                if (!isStandalone) {
                    pForm.reloadTable(refTableKey);
                    pForm.showDocument();
                }
            } else {
                if (!isStandalone) {
                    var pGrid = pForm.getGridInfoByTableKey(refTableKey);
                    pGrid = pForm.getComponent(pGrid.key);
                    var nTable = form.getDocument().getByKey(refTableKey),
                        pTable = pForm.getDocument().getByKey(refTableKey), rowData;
                    if (form.getOperationState() == YIUI.Form_OperationState.New) {
                        pTable.addRow();
                        var row , lastRowIndex = -1;
                        for (var dlen = pGrid.getRowCount(), di = dlen - 1; di >= 0; di--) {
                            row = pGrid.getRowDataAt(di);
                            if (row.isDetail && row.bookmark != null) {
                                lastRowIndex = di + 1;
                                break;
                            }
                        }
                        rowData = pGrid.addGridRow(null, lastRowIndex, false);
                        rowData.bookmark = pTable.getBkmk();
                    } else {
                        rowData = pGrid.getRowDataAt(pGrid.getFocusRowIndex());
                    }
                    pTable.setByBkmk(rowData.bookmark);
                    nTable.first();
                    for (var i = 0, len = nTable.cols.length; i < len; i++) {
                        pTable.set(i, nTable.get(i));
                    }
                    pGrid.showDetailRow(pGrid.getRowIndexByID(rowData.rowID), true);
                }
            }
        };
        funs.EditDetail = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]),
                DOID = YIUI.TypeConvertor.toString(args[2]),
                form = cxt.form;
            if (DOID == undefined || DOID == "" || DOID == null) return;
            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, doEdit: true, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.EditDetailInGrid = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]),
                DOID = YIUI.TypeConvertor.toString(args[2]),
                form = cxt.form, rowIndex = cxt.rowIndex;
            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, inGrid: true, doEdit: true, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                var newForm = YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
                newForm.getDocument().oid = OID;
                newForm.getDocument().clear();
                var pTable = form.getDocument().getByKey(newForm.refTableKey);
                var pGrid = form.getGridInfoByTableKey(newForm.refTableKey);
                pGrid = form.getComponent(pGrid.key);
                if (rowIndex == undefined) {
                    rowIndex = pGrid.getFocusRowIndex();
                } else {
                    pGrid.setFocusRowIndex(rowIndex);
                }
                var focusRow = pGrid.getRowDataAt(rowIndex);
                pTable.setByBkmk(focusRow.bookmark);
                var nTable = new DataDef.DataTable();
                $.extend(true, nTable.cols, pTable.cols);
                nTable.key = pTable.key;
                nTable.addRow();
                for (var i = 0, len = nTable.cols.length; i < len; i++) {
                    nTable.set(i, pTable.get(i));
                }
                nTable.batchUpdate();
                newForm.getDocument().add(newForm.refTableKey, nTable);
                newForm.showDocument();
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.NewDetail = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]), form = cxt.form, doc = form.getDocument();
            var paras = {cmd: "PureNewDetail", OID: OID, VERID: doc.verid, DVERID: doc.dverid, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.NewDetailInGrid = function (name, cxt, args) {
            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
                OID = YIUI.TypeConvertor.toString(args[1]), form = cxt.form, doc = form.getDocument();
            var paras = {cmd: "PureNewDetail", OID: OID, VERID: doc.verid, DVERID: doc.dverid, inGrid: true, detailFormKey: detailFormKey};
            var success = function (jsonObj) {
                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
            };
            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
    }

    { //BPMExtendFunction BPM扩展公式
        funs.TransferTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                operatorID = parseFloat(args[1].toString()),
                createRecord = false;
            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            if (args.length > 2) {
                createRecord = args[2];
            }
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {
                service: "BPMExtend",
                cmd: "TransferTask",
                WorkitemID: WID,
                OperatorID: operatorID,
                CreateRecord: createRecord
            });
        };
        funs.EndorseTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                operatorID = parseFloat(args[1].toString()),
                launchInfo = "";
            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            if (args.length > 2) {
                launchInfo = args[2].toString();
            }
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {
                service: "BPMExtend",
                cmd: "EndorseTask",
                WorkitemID: WID,
                OperatorID: operatorID,
                LaunchInfo: launchInfo
            });
        };
        funs.LaunchTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                nodeKey = args[1].toString(),
                operatorID = parseFloat(args[2].toString()),
                launchInfo = args[3].toString(),
                hideActiveWorkitem = args[4];
            var ppObject = {Type: 1, OperatorID: operatorID};
            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, {
                service: "BPMExtend",
                cmd: "LaunchTask",
                WorkitemID: WID,
                NodeKey: nodeKey,
                LaunchInfo: launchInfo,
                HideActiveWorkitem: hideActiveWorkitem,
                PPObject: JSON.stringify(ppObject)
            });
        };
        funs.FillGrid = function (name, cxt, args) {
            var form = cxt.form, gridKey = args[0].toString(), fields = [], dataTable = args[1], grid = form.getComponent(gridKey);
            for (var i = 2, len = args.length; i < len; i++) {
                fields.push(args[i].toString());
            }
            var convertData = function (cell, value) {
                var cellType = cell.edittype, result = value;
                if (cellType == "dict") {
                    var itemKey = cell.itemKey;
                    result = YIUI.UIUtil.convertDictValue(itemKey, cell, value);
                }
                return result;
            };
            dataTable.beforeFirst();
            while (dataTable.next()) {
                var index = grid.getLastDetailRowIndex();
                for (var j = 0, jLen = fields.length; j < jLen; j++) {
                    var cellKey = fields[j],
                        value = dataTable.get(j);
                    var cell = grid.dataModel.colModel.cells[cellKey];
                    value = convertData(cell, value);
                    grid.setValueByKey(index, cellKey, value, true, true);
                }
            }
        };
        funs.FillGridData = function (name, cxt, args) {
            var form = cxt.form, dataTable = args[1], doc = form.getDocument(),
                clearOldData = false, gridKey = args[0].toString(), grid = form.getComponent(gridKey);
            if (args.length > 2) {
                clearOldData = YIUI.TypeConvertor.toBoolean(args[2]);
            }
            if (grid == null) {
                YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
            }
            var tableKey = grid.tableKey, oldTable = doc.getByKey(tableKey);
            if (oldTable != null) {
                if (clearOldData) {
                    YIUI.DataUtil.deleteAllRow(oldTable);
                }
                YIUI.DataUtil.append(dataTable, oldTable);
                oldTable.beforeFirst();
                grid.rootGroupBkmk = [];
                grid.getPageInfo().currentPage = 1;
                grid.reload();
            }
        }
    }
    {

        var submit = function (btn, fileID, tableKey, path, cxt, quickSave, seriesPath) {
            var self = this;
            var form = cxt.form;
            var oldTable = form.getDocument().getByKey(tableKey);
            var parentTable = form.getDocument().getByKey(oldTable.parentKey);
            var poid;
            if (parentTable != null) {
                poid = parentTable.getByKey(YIUI.SystemField.OID_SYS_KEY);
            }
            if (poid == undefined || poid == null) {
                poid = -1;
            }
            var enable = btn[0].enable;
            $.ajaxFileUpload({
                url: Svr.SvrMgr.AttachURL,
                secureuri: false,
                fileElement: btn,
                data: {service: "UploadAttachment", formKey: form.formKey, operatorID: $.cookie("userID"), fileID: fileID, poid: poid, quickSave: quickSave,seriesPath:seriesPath, oid: form.OID, tableKey: tableKey, path: path, mode: 1},
                type: "post",
                success: function (data, status, newElement) {
                    newElement[0].enable = enable;
                    data = JSON.parse(data);
                    var table = YIUI.DataUtil.fromJSONDataTable(data);
                    if (table.first()) { // 如果成功上传,那么刷新附件控件
                        var grid = form.getGridInfoByTableKey(tableKey);
                        grid = form.getComponent(grid.key);
                        var rowIndex = cxt.rowIndex;
                        var row = grid.dataModel.data[rowIndex];
                        var bkmk = row.bookmark;
                        if (bkmk == null) {
                            row = grid.gridHandler.flushRow(form, grid, rowIndex);
                            bkmk = row.bookmark;
                            grid.addGridRow();
                        }
                        // 插数据
                        oldTable.setByBkmk(bkmk);
                        for (var i = 0, size = table.cols.length; i < size; i++) {
                            var colInfo = table.getCol(i);
                            var value = table.getByKey(colInfo.key);
                            oldTable.setByKey(colInfo.key, value == undefined ? null : value);
                        }
                        // 子明细父子关联
                        if (parent != null) {
                            oldTable.setParentBkmk(bkmk);
                        }
                        // 设置当前行状态
                        if (quickSave) {
                            oldTable.setState(DataDef.R_Normal);
                        }
                        grid.showDetailRow(rowIndex, false);
                    }
                },
                error: function (data, status, e) {
                    alert(e);
                }
            });
        };
        //ViewAttachmentFunction
        funs.UploadAttachment = function (name, cxt, args) {

            var target = window.up_target;

            var fileOID = YIUI.TypeConvertor.toLong(args[0]);
            var tableKey = YIUI.TypeConvertor.toString(args[1]);
            var maxSize = -1;
            if (args.length > 2) {
                maxSize = YIUI.TypeConvertor.toLong(args[2]);
            }
            var allowedTypes;
            if (args.length > 3) {
                allowedTypes = YIUI.TypeConvertor.toString(args[3]).split(";");
            }
            var quickSave = false;
            if (args.length > 4) {
                quickSave = YIUI.TypeConvertor.toBoolean(args[4]);
            }

            var seriesPath = "";
            if (args.length > 5) {
                seriesPath = YIUI.TypeConvertor.toString(args[5]);
            }

            var form = cxt.form;
            var doc = form.getDocument();
            var tbl = doc.getByKey(tableKey);
            var rowIndex = cxt.rowIndex;
            var path = "";
            if (tbl.size() > rowIndex) {
                tbl.setPos(rowIndex);
                path = tbl.getByKey("Path");
            }

            target.change(function (e) {
                $.checkFile(target, maxSize, allowedTypes);
                cxt.form.setSysExpVals("CUSTOM", true);
                submit(target, fileOID, tableKey, path, cxt, quickSave, seriesPath);
            });

            return true;
        };

        funs.DownloadAttachment = function (name, cxt, args) {
            var form = cxt.form;
            var fileOID = YIUI.TypeConvertor.toLong(args[0]);
            if (fileOID <= 0)
                return false;
            var tableKey = YIUI.TypeConvertor.toString(args[1]);
            var savePath = "";

            // 如果给定路径,使用给定路径,否则从数据表中取得
            var path = "";
            if( args.length > 2 ) {
                path = YIUI.TypeConvertor.toString(args[2]);
            }
            if( !path ) {
                var tableKey = YIUI.TypeConvertor.toString(args[1]);
                var doc = form.getDocument(), tbl = doc.getByKey(tableKey);
                var gridInfo = form.getGridInfoByTableKey(tableKey);
                var grid = form.getComponent(gridInfo.key);
                var row = grid.getRowDataAt(cxt.rowIndex);
                if (YIUI.GridUtil.isEmptyRow(row))
                    return;
                tbl.setByBkmk(row.bookmark);
                path = tbl.getByKey("Path");
            }

            location.href = Svr.SvrMgr.AttachURL + "?fileID=" + fileOID + "&formKey=" + form.formKey + "&tableKey=" + tableKey
                + "&path=" + path + "&mode=1&service=DownloadAttachment";
            return true;
        };

        funs.DeleteAttachment = function (name, cxt, args) {
            var form = cxt.form;

            var fileOID = YIUI.TypeConvertor.toLong(args[0]);
            if (fileOID <= 0)
                return false;

            var tableKey = YIUI.TypeConvertor.toString(args[1]);

            // 如果给定路径,使用给定路径,否则从数据表中取得
            var path = "";
            if( args.length > 2 ) {
                path = YIUI.TypeConvertor.toString(args[2]);
            }
            if( !path ) {
                var doc = form.getDocument(),tbl = doc.getByKey(tableKey);
                var gridInfo  = form.getGridInfoByTableKey(tableKey);
                var grid = form.getComponent(gridInfo.key);
                var row = grid.getRowDataAt(cxt.rowIndex);
                if( YIUI.GridUtil.isEmptyRow(row) )
                    return;
                tbl.setByBkmk(row.bookmark);
                path = tbl.getByKey("Path");
            }

            var paras = {fileID: fileOID, formKey: form.formKey, tableKey: tableKey, path: path};
            Svr.SvrMgr.deleteAttachment(paras);

            var grid = form.getGridInfoByTableKey(tableKey);
            grid = form.getComponent(grid.key);

            var rowIndex = cxt.rowIndex;
            grid.deleteGridRow(rowIndex);
            return true;
        };

        //表头控件的批量填值
        funs.SetFromJson = function (nane, cxt, args) {
            var form = cxt.form;
            if (args.length != 0) {
                var jsonlist = args[0];
                for (var j in jsonlist) {

                    form.getComponent(j).setValue(jsonlist[j], true, true);
                }
            }
        };

        //表格的批量填值
        funs.FillGridFromJson = function (name, cxt, args) {
            var form = cxt.form, dataTable = args[1], doc = form.getDocument(),
                clearOldData = false, gridKey = YIUI.TypeConvertor.toString(args[0]), grid = form.getComponent(gridKey);
            dataTable = YIUI.DataUtil.fromJSONDataTable(dataTable);
            if (args.length >= 2) {
                clearOldData = args[2];
            }
            var tableKey = grid.tableKey, oldTable = doc.getByKey(tableKey);
            if (oldTable != null && dataTable != null) {
                if (clearOldData) {
                    YIUI.DataUtil.deleteAllRow(oldTable);
                }
                YIUI.DataUtil.append(dataTable, oldTable);
                oldTable.beforeFirst();
                grid.rootGroupBkmk = [];
                grid.getPageInfo().currentPage = 1;
                grid.reload();
            }
        };

        //启动单个定时器
        funs.StartTimerTask = function (name, cxt, args) {
            var form = cxt.form, timerKey = args[0];
            var timercol = form.timerTask;
            if (timerKey != null && timercol[timerKey].enable != true) {
                var endtimercol = {};
                var timers;
                for (var T in timercol) {
                    if (timercol[T].key == timerKey) {
                        timers = timercol[T];
                        timerContent[form.formID + timerKey] = true;
                    }
                    endtimercol[T] = form.timerTask[T];
                    delete form.timerTask[T];
                }
                timers.enable = true;
                form.timerTask[timers.key] = timers;
                YIUI.TabContainer().initTimer(form);
                form.timerTask = endtimercol;
            }
        };

        //获取定时器的状态
        funs.IsTimerTaskStarted = function (name, cxt, args) {
            var form = cxt.form, timerKey = args[0];
            if (timerKey != null) {
                var timercol = form.timerTask;
                for (var T in timercol) {
                    if (timercol[T].key == timerKey) {
                        return timercol[T].enable;
                    }
                }
            }

        };

        //停止单个定时器
        funs.StopTimerTask = function (name, cxt, args) {
            var form = cxt.form, timerKey = args[0];
            if (timerKey != null) {
                var timercol = form.timerTask;
                var timernow = timerArray;
                for (var T in timernow) {
                    if (T == form.formID + timerKey) {
                        window.clearInterval(timernow[T]);
                        form.timerTask[timerKey].enable = false;
                        timerContent[T] = false;

                    }
                }
            }
        };

        funs.OpenGantt = function (name, cxt, args) {
            var form = cxt.form;
            var formKey = args[0],
                OID = YIUI.TypeConvertor.toString(args[1]);
            var params = {
                formKey: formKey
            };
            var target = YIUI.FormTarget.NEWTAB;
            var success = function (jsonObj) {
                if (jsonObj && jsonObj.form) {
                    jsonObj.form.OID = OID;
                    cxt.target = target;
                    YIUI.UIUtil.show(jsonObj, cxt, false, YIUI.ShowType.Gantt);
                }
            };
            Svr.SvrMgr.loadForm(params, success);
            return true;
        };

        funs.ApplyNewSequence = function (name, cxt, args) {
            var form = cxt.form;
            var dataObjectKey = args[0];
            var NoPrefix = args[1];
            var paras = {
                service: "ApplyNewSequence",
                DataObjectKey: dataObjectKey,
                NoPrefix: NoPrefix
            }
            var newSequence = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return newSequence;

        };

        funs.locate = function (name, cxt, args) {
            var form = cxt.form;
            var oid = args[1];
            //控件的key
            var controlKey = args[0];
            if (oid == "" || controlKey == "") {
                return false;
            }
            var itemData = {};
            itemData.oid = oid.toString();
            var dictView = form.getComponent(controlKey);
            dictView.expandTo(dictView, itemData);

        };

        // json数据填入表格，用于 甘特图
        funs.FillGridWithJson = function (name, cxt, args) {
            var form = cxt.form, jsonValue = args[1],
                gridKey = YIUI.TypeConvertor.toString(args[0]), grid = form.getComponent(gridKey);
            if (!jsonValue || jsonValue == null || jsonValue == "") {
                //grid.clearGridData();
            } else {
                if ($.isString(jsonValue)) {
                    jsonValue = JSON.parse(jsonValue);
                }
                for (var i=0; i<jsonValue.length; i++) {
                    grid.addGridRow(null, i, false);
                    var jsonRow = jsonValue[i];
                    for(var key in jsonRow) {
                        grid.setValueByKey(i, key, jsonRow[key], true, true);
                    }
                }
            }
            grid.refreshGrid();
            return true;
        };

        // 表格数据转为json字符串，用于甘特图
        funs.GridData2JsonStr = function (name, cxt, args) {
            var form = cxt.form;
            var gridKey = YIUI.TypeConvertor.toString(args[0]), grid = form.getComponent(gridKey);
            var rowCount = grid.getRowCount();
            var colCount = grid.getColumnCount();
            var rowArr = [];
            for (var rowIndex = 0; rowIndex<rowCount; rowIndex ++) {
                var row = {};
                var gridRow = grid.getRowDataAt(rowIndex);
                if ( gridRow.bookmark == null) continue;
                for (var colIndex = 0; colIndex<colCount; colIndex ++ ) {
                    var col = grid.getColumnAt(colIndex);
                    row[col.key] = grid.getValueAt(rowIndex, colIndex);
                }
                rowArr.push(row);
            }
            return JSON.stringify(rowArr);
        };

        // 根据单位做时间转换，用于甘特图
        funs.ComputeDuration4Unit = function(name, cxt, args) {
            var form = cxt.form;
            var start = args[0], end = args[1];
            var ganttKey = YIUI.TypeConvertor.toString(args[2]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.distanceInWorkingDays4Unit(start, end);
        };

        // 根据起始日期和结束日期计算时间间隔，返回单位为ms的时间间隔，不包括节假日，用于甘特图， unit 参数可以为 : 'd', 'hh', 'mm'
        funs.ComputeDuration = function(name, cxt, args) {
            var form = cxt.form;
            var start = args[0], end = args[1];
            var ganttKey = YIUI.TypeConvertor.toString(args[2]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.distanceInWorkingTimes(start, end, false);
        };

        // 根据起始时间和时间间隔计算结束时间，用于甘特图
        funs.ComputeEndByDuration = function(name, cxt, args) {
            var form = cxt.form;
            var start = args[0], durTimes = args[1];
            var ganttKey = YIUI.TypeConvertor.toString(args[2]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.computeEndByDuration(start, durTimes);
        };

        // 根据结束时间和时间间隔计算结束时间，用于甘特图
        funs.ComputeStartByDuration = function(name, cxt, args) {
            var form = cxt.form;
            var end = args[0], durTimes = args[1];
            var ganttKey = YIUI.TypeConvertor.toString(args[2]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.computeStartByDuration(end, durTimes)
        };

        // 将gantt默认时间间隔转换成ms，用于甘特图
        funs.ComputeDurationToMS = function(name, cxt, args) {
            var form = cxt.form;
            var durs = args[0];
            var ganttKey = YIUI.TypeConvertor.toString(args[1]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.dur2ms(durs)
        };

        //ms 转成甘特图默认的时间间隔，用于甘特图
        funs.ComputeMSToDur = function(name, cxt, args) {
            var form = cxt.form;
            var times = args[0];
            var ganttKey = YIUI.TypeConvertor.toString(args[1]), gantt = form.getComponent(ganttKey);
            var dateSrv  = gantt.getDateSrv();
            return dateSrv.ms2dur(times)
        };

        //刷新gantt控件，用于甘特图
        funs.RefreshGantt = function(name, cxt, args) {
            var form = cxt.form;
            var ganttKey = YIUI.TypeConvertor.toString(args[0]), gantt = form.getComponent(ganttKey);
            var canWrite = !UI.BaseFuns.ReadOnly(name, cxt, args);
            gantt.refresh(canWrite);
        };
        
        
        funs.GetUIAgent = function (name, cxt, args) {
            return "webbrowser";
        };
    }
    return funs;
})();



