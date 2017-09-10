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
            service: "WebMetaService",
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
                if( comp.tableKey ) {
                    var table = form.getDocument().getByKey(comp.tableKey);
                    table.clear();
                }
                comp.repaint();
                break;
            case YIUI.CONTROLTYPE.GRID:
                var grid = comp, got = false;
                var row, len = grid.getRowCount();
                for (var i = len - 1; i >= 0; i--) {
                    row = grid.getRowDataAt(i);
                    if (!row.isDetail)
                        continue;
                    if (retainEmpty && row.bookmark === undefined && !got) {
                        got = true;
                        continue;
                    }
                    grid.deleteRowAt(i);
                }

                var tableKey = grid.tableKey;
                if( tableKey ) {
                    var doc = form.getDocument(),table = doc.getByKey(tableKey);

                    table.delAll();

                    var sdt = doc.getShadow(table.key);
                    if( sdt ) {
                        sdt.clear();
                    }

                    var tbls = doc.getTblsByParentKey(tableKey);

                    $.each(tbls,function (i,tbl) {
                       tbl.delAll();
                       sdt = doc.getShadow(tbl.key);
                       if( sdt ) sdt.clear();
                    });
                }

                // 触发事件
                grid.gridHandler.rowDeleteAll(form,grid);

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

        YIUI.RemoteService.getPublicKey().then(function(publicKey){
            var rsa = new RSAKey();
            rsa.setPublic(publicKey.modulus, publicKey.exponent);
            password = rsa.encrypt_b64(password);
            newPassword = rsa.encrypt_b64(newPassword);
            YIUI.RemoteService.changePWD(operatorID, password, newPassword);
        });
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

        var form = cxt.form;

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = form.eval(tsParas[key], cxt);
                form.setCallPara(key, value);
            }
        }

        if(target != YIUI.FormTarget.SELF) {
            var container = form.getContainer();

            var builder = new YIUI.YIUIBuilder(formKey);
            builder.setContainer(container);
            builder.setTarget(target);
            builder.setParentForm(form);

            builder.newEmpty().then(function(emptyForm){
                YIUI.FormParasUtil.processCallParas(form, emptyForm);
                emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));
                builder.builder(emptyForm);
            });
        }else{
            var opt = new YIUI.NewOpt(form, true);
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

        var container = form.getContainer();
        var builder = new YIUI.YIUIBuilder(formKey);
        builder.setContainer(container);
        builder.setTarget(target);
        builder.setParentForm(form);

        builder.newEmpty().then(function(emptyForm){
            YIUI.FormParasUtil.processCallParas(form, emptyForm);
            builder.builder(emptyForm);
        });
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
        return state == YIUI.Form_OperationState.Edit ;
    };

    funs.Open = function (name, cxt, args) {
        var form = cxt.form;
        var formKey = args[0],
            OID = YIUI.TypeConvertor.toLong(args[1]);

        var container = form.getContainer();
        var target = YIUI.FormTarget.NEWTAB;
        if (args.length > 2) {
            target = YIUI.FormTarget.parse(args[2]);
        }
        var tsParas;
        if (args.length > 3) {
            tsParas = args[3];
        }

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = form.eval(tsParas[key], cxt);
                form.setCallPara(key, value);
            }
        }

        var container = form.getContainer();
        var builder = new YIUI.YIUIBuilder(formKey);
        builder.setContainer(container);
        builder.setTarget(target);
        builder.setParentForm(form);
        builder.setOperationState(YIUI.Form_OperationState.Default);

        builder.newEmpty().then(function(emptyForm){

            var filterMap = emptyForm.getFilterMap();
            filterMap.setOID(OID);

            YIUI.FormParasUtil.processCallParas(form, emptyForm);
            emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));

            builder.builder(emptyForm);
        });

        return true;
    };

    funs.Save = function (name, cxt, args) {
        var saveOpt = YIUI.SaveOpt(cxt.form);
        saveOpt.doOpt();
    };

    funs.SaveData = function (name, cxt, args) {
        var form = cxt.form, uiCheckOpt = new YIUI.UICheckOpt(form);
        if (!uiCheckOpt.doOpt()) return false;
        YIUI.UIUtil.saveDocument(form);
        return true;
    };

    funs.LoadData = function (name, cxt, args) {
        var form = cxt.form;
        form.setWillShow(true);

        YIUI.LoadingUtil.show();

        YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
            .then(function(doc){
                form.setDocument(doc);
                form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO,doc.getExpData(YIUI.BPMKeys.WORKITEM_INFO));
                form.showDocument();
            });
    };

    funs.ShowData = function (name, cxt, args) {

    };

    // 计算查询条件默认值
    funs.CalcCondition = function (name, cxt, args) {
        var form = cxt.form;
        if( !form.getUIProcess() )
            return;
        var items = [],component;
        var exps = form.dependency.calcTree.items;
        for( var i = 0,size = exps.length;i < size;i++ ) {
            if( exps[i].objectType !== YIUI.ExprItem_Type.Item )
                continue;
            component = form.getComponent(exps[i].source);
            if( component && component.condition ) {
                items.push(exps[i]);
            }
        }
        form.getUIProcess().calcItems(items);
    }

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
            if ( cmp.value && !cmp.isNull() && cmp.condition) {
                condition = cmp.condition;
                value = cmp.value;
                if (cmp.type == YIUI.CONTROLTYPE.DATEPICKER) {
                    value = cmp.getValue().getTime();
                    condition.onlyDate = YIUI.TypeConvertor.toBoolean(cmp.isOnlyDate);
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
            YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
                .then(function(doc){
                    form.setOperationState(YIUI.Form_OperationState.Default);
                    form.setDocument(doc);
                    form.showDocument();
                });
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

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = pForm.eval(tsParas[key], cxt);
                pForm.setCallPara(key, value);
            }
        }

        var container = pForm.getDefContainer();
        if (container == null) {
            container = pForm.getContainer();
        }

        var builder = new YIUI.YIUIBuilder(formKey);
        builder.setContainer(container);
        builder.setParentForm(pForm);
        builder.setOperationState(YIUI.Form_OperationState.Default);

        builder.newEmpty().then(function(emptyForm){

            if(OID > 0){
                var filterMap = emptyForm.getFilterMap();
                filterMap.setOID(OID);
                emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));
            }

            YIUI.FormParasUtil.processCallParas(pForm, emptyForm);

            emptyForm.regEvent(YIUI.FormEvent.ShowDocument, function(){
                pForm.resetUIStatus(YIUI.FormUIStatusMask.OPERATION);
            });

            return builder.builder(emptyForm);
        });
    };

    funs.NewDict = function (name, cxt, args) {
        var formKey = args[0];
        var pForm = cxt.form;
        //参数2保留
        var tsParas;
        if (args.length > 2) {
            tsParas = args[2];
        }

        if (tsParas) {
            tsParas = splitPara(tsParas);
            for (var key in tsParas) {
                var value = pForm.eval(tsParas[key], cxt);
                pForm.setCallPara(key, value);
            }
        }

        var container = pForm.getDefContainer();
        if (container == null) {
            container = pForm.getContainer();
        }

        var builder = new YIUI.YIUIBuilder(formKey);
        builder.setContainer(container);
        builder.setParentForm(pForm);

        builder.newEmpty().then(function(emptyForm){

            YIUI.FormParasUtil.processCallParas(pForm, emptyForm);
            emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));

            emptyForm.regEvent(YIUI.FormEvent.ShowDocument, function(){
                pForm.resetUIStatus(YIUI.FormUIStatusMask.OPERATION);
            });

            return builder.builder(emptyForm);
        });
    };

    var doMap = function (name, cxt, args) {
        if (args.length < 2)
            YIUI.ViewException.throwException(YIUI.ViewException.NO_KEY_TARGET_BILL);
        var form = cxt.form,
            mapKey = args[0],
            tgFormKey = args[1],
            srcFormKey = form.formKey,
            formDoc = form.getDocument();

        var newForm = null;
        if (tgFormKey == null){
            newForm = form.getParentForm();
        }

        var container = form.getContainer();
        var builder = new YIUI.YIUIBuilder(tgFormKey);
        builder.setContainer(container);
        builder.setParentForm(form);

        builder.newEmpty().then(function(emptyForm){

            emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));
            return builder.builder(emptyForm);

        }).then(function(tarForm){
            var mapWorkitemInfo = false, postFormula = null;
            if (args.length > 2)
                mapWorkitemInfo = YIUI.TypeConvertor.toBoolean(args[2]);

            if (args.length > 3) {
                postFormula = YIUI.TypeConvertor.toString(args[3]);
            }

            allDoMap(srcFormKey, formDoc, tgFormKey, mapKey, tarForm, mapWorkitemInfo, postFormula)
                .done(function(jsonObj) {
                    var doc = YIUI.DataUtil.fromJSONDoc(jsonObj.document);
                    var ignoreKeys = jsonObj.ignoreKeys;

                    afterDoMap(form, tarForm, ignoreKeys, doc, mapWorkitemInfo, postFormula);
                });
        });

    };

    var viewDoMap = function (form, tgFormKey, mapKey, newForm, mapWorkitemInfo, postFormula) {
        var srcFormKey = form.formKey, formDoc = form.getDocument();

        var doc = YIUI.DataUtil.toJSONDoc(formDoc, true);

        var trgDoc = YIUI.DataUtil.toJSONDoc(newForm.getDocument());

        var params = {
            tgFormKey: tgFormKey,
            srcFormKey: srcFormKey,
            srcDoc: $.toJSON(doc),
            trgDoc: $.toJSON(trgDoc),
            cmd: "Map",
            mapKey: mapKey
        };

        Svr.SvrMgr.doMapEvent(params).done(function(jsonObj) {
            var document = YIUI.DataUtil.fromJSONDoc(jsonObj.document);
            var ignoreKeys = jsonObj.ignoreKeys;

            afterDoMap(form, newForm, ignoreKeys, document, mapWorkitemInfo, postFormula);
        });
    };

    var allDoMap = function (srcFormKey, formDoc, tgFormKey, mapKey, newForm, mapWorkitemInfo, postFormula) {
        var doc = YIUI.DataUtil.toJSONDoc(formDoc, true);

        var trgDoc = YIUI.DataUtil.toJSONDoc(newForm.getDocument());

        var params;
        if (newForm.metaForm.onLoad) {
            params = {
                tgFormKey: tgFormKey,
                srcFormKey: srcFormKey,
                srcDoc: $.toJSON(doc),
                trgDoc: $.toJSON(trgDoc),
                cmd: "Map",
                mapKey: mapKey
            };
        }
        else {
            params = {
                tgFormKey: tgFormKey,
                srcFormKey: srcFormKey,
                srcDoc: $.toJSON(doc),
                cmd: "Map",
                mapKey: mapKey
            };
        }
        return Svr.SvrMgr.doMapEvent(params);
    };

    var afterDoMap = function(srcform, newForm, ignoreKeys, document, mapWorkitemInfo, postFormula) {
        if (ignoreKeys){
            newForm.setSysExpVals("IgnoreKeys", ignoreKeys);
        }
        newForm.setDocument(document);
        newForm.showDocument(true);

        if (mapWorkitemInfo) {
            if(srcform){
                var info = srcform.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                if (info != null){
                    document.putExpData(YIUI.BPMKeys.SaveBPMMap_KEY, info.WorkitemID);
                    document.expDataType[YIUI.BPMKeys.SaveBPMMap_KEY] = YIUI.ExpandDataType.LONG;
                }
            }
        }

        if (postFormula) {
            var cxt = new View.Context(newForm);
            newForm.eval(postFormula, cxt, null);
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
            cmd: "MapEx",
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
            formDoc = form.getDocument();

        var doc = YIUI.DataUtil.toJSONDoc(formDoc, true);

        // 执行数据映射
        var params = {
            service: "MapData",
            cmd: "MidMap",
            mapKey: mapKey,
            srcOrignalDocument: $.toJSON(doc),
            saveTarget: true
        };

        var resultJson = Svr.SvrMgr.doMapEvent(params);
        return true;
    };

    var mapInForm = function (cxt, mapKey, formKey, toNewForm) {
        var tgFormKey = null,
            toNewForm = toNewForm,
            form = cxt.form;

        var pForm = null;
        if (!toNewForm) {
            pForm = YIUI.FormStack.getForm(form.pFormID);
            tgFormKey = pForm.formKey;
        } else {
            tgFormKey = formKey;
        }
        var formDoc = form.getDocument();

        var doc = YIUI.DataUtil.toJSONDoc(formDoc, true);

        var params = {
            tgFormKey: tgFormKey,
            srcFormKey: form.formKey,
            srcDoc: $.toJSON(doc),
            cmd: "Map",
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
            mapKey = args[0],
            srcFormKey = form.formKey;
        newForm = form.getParentForm(),
            tgFormKey = newForm.formKey,
            srcDoc = form.getDocument();


        viewDoMap(form, tgFormKey, mapKey, newForm);

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
            Svr.SvrMgr.batchDeleteData(params);
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
                cmd: "BatchMap",
                oidList: $.toJSON(oids)
            };
            var resultJson = Svr.SvrMgr.doMapEvent(paras);

        };
    }

    funs.ShowModal = function (name, cxt, args) {
        var pForm = cxt.form, formKey = args[0], tsParas = args[1], callbackList = args[2];
        var paras = {formKey: formKey}, callBack = {};
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
        }

        var container = pForm.getContainer();
        var builder = new YIUI.YIUIBuilder(formKey);
        builder.setContainer(container);
        builder.setParentForm(pForm);
        builder.setTarget(YIUI.FormTarget.MODAL);

        builder.newEmpty().then(function(emptyForm){

            YIUI.FormParasUtil.processCallParas(pForm, emptyForm);
            for (var o in callBack) {
                var cxt1 = new View.Context(emptyForm);
                emptyForm.regEvent(o, function (opt) {
                    emptyForm.eval(callBack[opt].trim(), cxt1, null);
                });
            }

            builder.builder(emptyForm);
        });

        return true;
    };

    funs.DoEventCallback = function (name, cxt, args) {
        var form = cxt.form;
        var key = args[0];
        if(key){
            var event = form.getEvent(key);
            if(event){
                event(form, args);
            }
        }
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
            return form.getDataObject().key;
        }
        if (args[0]) {
            formKey = args[0];
        }
        var params = {formKey: formKey, cmd: "GetDataObjectKey", service: "WebMetaService"};
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
        return result;
    };

    funs.GetOID = function (name, cxt, args) {
        var form = cxt.form;
        var oid = -1;
        if (form) {
            oid = form.getOID();
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
        if (args.length > 0) {
            oid = YIUI.TypeConvertor.toLong(args[0]);
        }

        YIUI.DocService.deleteFormData(form.getFormKey(), oid);
//            .then(function(){
        //删除后 应该清空字典缓存，不清空理论上不会有问题。
        form.setInitOperationState(YIUI.Form_OperationState.Delete);
        form.setOperationState(YIUI.Form_OperationState.Delete);
//            });
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

    funs.GetText = function (name, cxt, args) {
    	var text = "";
    	var form = cxt.form;
        var controlKey = args[0];
        var component = form.getComponent(controlKey);
        if (component != null) {
 			text = component.getShowText();
 		}
 		return text;
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
        var gr = grid.getRowDataAt(ri), value;
        if (gr) {
            for (var i = 0, len = gr.cellKeys.length; i < len; i++) {
                if (gr.cellKeys[i] == cellKey) {
                    value = grid.getValueAt(ri, i);
                 //   if (value != null) {
                  //      count = count.plus(value);
                  //  }
                    count = count.plus(YIUI.TypeConvertor.toDecimal(value));
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
                            if (rowData.rowType === 'Detail' && !YIUI.GridUtil.isEmptyRow(rowData)) {
                                value = rowData.data[colIndex][0];
                                count = count.plus(YIUI.TypeConvertor.toDecimal(value));
                            }
                        }
                    } else {
                        sumOutGrid(grid, cellKey);
                    }
                    break;
                case "Group":
                    var nextRD,preRD;
                    if (rowData.isGroupHead) {
                        for (var nextRi = rowIndex + 1; nextRi < len; nextRi++) {
                            nextRD = grid.getRowDataAt(nextRi);
                            if (nextRD.rowGroupLevel == rowData.rowGroupLevel)
                                break;
                            if (rowData.rowType === 'Detail' && !YIUI.GridUtil.isEmptyRow(nextRD)) {
                                value = nextRD.data[colIndex][0];
                                count = count.plus(YIUI.TypeConvertor.toDecimal(value));
                            }
                        }
                    } else if (rowData.isGroupTail) {
                        for (var preRi = rowIndex - 1; preRi >= 0; preRi--) {
                            preRD = grid.getRowDataAt(preRi);
                            if (preRD.rowGroupLevel == rowData.rowGroupLevel)
                                break;
                            if (rowData.rowType === 'Detail' && !YIUI.GridUtil.isEmptyRow(preRD)) {
                                value = preRD.data[colIndex][0];
                                count = count.plus(YIUI.TypeConvertor.toDecimal(value));
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
                if (rowData.rowType === 'Detail' && !YIUI.GridUtil.isEmptyRow(rowData)) {
                    colInfoes = grid.getColInfoByKey(cellKey);
                    if (colInfoes == null)
                        continue;
                    for (var j = 0, jlen = colInfoes.length; j < jlen; j++) {
                        colIndex = colInfoes[j].colIndex;
                        value = rowData.data[colIndex][0];
                        count = count.plus(YIUI.TypeConvertor.toDecimal(value));
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
        updateView(cxt.form);
    };

    var updateView = function (form) {
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

        if (form.getDataObjectKey() != viewForm.getDataObjectKey()) {
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
            var columnInfo = listView.columnInfo;

            $.each(columnInfo, function (i, column) {
                var tbl, val;

                if (column.tableKey) {
                    tbl = doc.getByKey(column.tableKey);
                    if (tbl && tbl.first() && column.columnKey) {
                        val = tbl.getByKey(column.columnKey);
                        data[column.key] = val;
                    }
                }else if (column.defaultValue) {
                    data[column.key] = column.defaultValue;
                }else if (column.defaultFormula) {
                    var cxt = new View.Context(viewForm);
                    cxt.setRowIndex(row);
                    var value = viewForm.eval(column.defaultFormula, cxt, null);
                    data[column.key] = value;
                }
            });

            //未找到行
            if (row == -1) {
                row = listView.addNewRow();
            }

            $.each(columnInfo, function (i, column) {
                var v = data[column.key];
                if (v != undefined) {
                    listView.setValByKey(row, column.key, v, true, true);
                }
            });
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

        var itemData = {
            itemKey: itemKey,
            oid: YIUI.TypeConvertor.toLong(oid)
        };

        if (dictView.type == YIUI.CONTROLTYPE.DICTVIEW) {
            switch (optState) {
                case YIUI.Form_OperationState.New:
                    dictView.addNode(itemData);
                    break;
                case YIUI.Form_OperationState.Delete:
                    // 修改previd属性
                    dictView.removeNode(itemData.itemKey + '_' + itemData.oid);
                    break;
                default:
                    dictView.refreshNode(itemData);
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

    funs.GetFocusRow = function (name, cxt, args) {
        var form = cxt.form;
        var gridKey = YIUI.TypeConvertor.toString(args[0]);
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }
        return grid.getFocusRowIndex();
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

    funs.GetRowIndex = function (name,cxt,args) {
        if( !cxt )
            return -1;

        return cxt.rowIndex;
    }

    funs.SetRowIndex = function (name,ctx,args) {
        ctx.rowIndex = args[1];
    }

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
                    var rowData;
                    for (var i = 0, len = grid.getRowCount(); i < len; i++) {
                        rowData = grid.getRowDataAt(i);
                        if (rowData.rowType === "Detail" && !YIUI.GridUtil.isEmptyRow(rowData)) {
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
        var form = cxt.form,
            com = form.getComponent(args[0]);
        if ( com ) {
            com.focus();
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
                return grid.isNullValue(grid.getValueByKey(row,key));
            }
        }
        return true;
    };
    funs.SetFocusCell = function (name, cxt, args) {
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
        var col = YIUI.TypeConvertor.toString(args[2]);
        if ($.isNumeric(col)) {
            form.setFocusCell(key, rowIndex, parseInt(col));
        } else {
            form.setFocusCell(key, rowIndex, comp.getCellIndexByKey(col));
        }
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
        return YIUI.ExprUtil.convertValue(result,comp.dataModel && comp.dataModel.colModel.cells[col]);
    };

    // 获取拓展单元格的拓展值
    funs.GetExpandValue = function(name,cxt,args) {
        var form = cxt.form;
        var grid = form.getComponent(args[0]);
        var colIndex = parseInt(args[1]),columnKey = args[2];
        colIndex = (colIndex == -1 ? cxt.colIndex : colIndex);
        var detailRow = grid.getDetailMetaRow();
        if( colIndex == -1 || !columnKey || !detailRow )
            return null;
        var crossValueMap = detailRow.cells[colIndex].crossValueMap;
        if( crossValueMap && columnKey in crossValueMap ) {
            return crossValueMap[columnKey].value;
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

//     funs.RunValueChanged = function (name, cxt, args) {
//         var form = cxt.form;
//         var key = YIUI.TypeConvertor.toString(args[0]);
//         var cmp = form.getComponent(key);
//         var cell = form.getCellLocation(key);
//         var valueChange = "";
//         if (cmp) {
//             valueChange = cmp.valueChanged;
//             valueChange && form.eval(valueChange, cxt, null);
//         } else if (cell) {
//             var compKey = cell.key;
//             var grid = form.getComponent(compKey);
//             if (grid.type == YIUI.CONTROLTYPE.GRID) {
//                 var rowIndex = grid.getFocusRowIndex();
//                 if (rowIndex == -1) return;
//                 var row = grid.dataModel.data[rowIndex], cellKey = key,
//                     editOpt = grid.dataModel.colModel.cells[cellKey],
//                     meatRow = grid.getMetaObj().rows[row.metaRowIndex];
//
//                 var colIndex = grid.getColInfoByKey(cellKey)[0].colIndex;
//
// //			    form.uiProcess.doCellValueChanged(grid, rowIndex, colIndex, cellKey);
//                 YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);
//
//                 var cellCEvent = meatRow.cells[colIndex].valueChanged;
//                 if (cellCEvent !== undefined && cellCEvent.length > 0) {
//                     var cxt = new View.Context(form);
//                     cxt.setRowIndex(rowIndex);
//                     form.eval($.trim(cellCEvent), cxt, null);
//                 }
//             }
//         }
//
//         return true;
//     };

    // funs.RunClick = function (name, cxt, args) {
    //     var form = cxt.form;
    //     var key = args[0];
    //     var comp = form.getComponent(key);
    //     switch (comp.type) {
    //         case YIUI.CONTROLTYPE.BUTTON:
    //         case YIUI.CONTROLTYPE.HYPERLINK:
    //             var clickContent = comp.clickContent;
    //             clickContent && form.eval(clickContent, cxt, null);
    //             break;
    //     }
    //     return true;
    // };
    // funs.RunOpt = function (name, cxt, args) {
    //     var form = cxt.form;
    //     var optKey = args[0];
    //     //toolbar
    //     var optInfo = form.getOptMap()[optKey], tbr;
    //     if (optInfo) {
    //         var action = optInfo.opt.action;
    //         action && form.eval(action, cxt, null);
    //     }
    //     return true;
    // };

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
                cmp.setValue(null, true, false);
            }
        }
        return true;
    };

    funs.GetGroupValue = function (name, cxt, args) {
        var form = cxt.form;
        var groupKey = YIUI.TypeConvertor.toString(args[0]);
        var formKey = form.getFormKey();
        return YIUI.MetaService.getParaGroup(groupKey, formKey);
    };

    funs.SysPara = function (name, cxt, args) {
        var form = cxt.form;
        var group = YIUI.TypeConvertor.toString(args[0]);
        var key = YIUI.TypeConvertor.toString(args[1]);

        var paraGroup = YIUI.MetaService.getParaGroup(group, form.getFormKey());
        for(var i = 0, len = paraGroup.length; i < len; i++){
            if(paraGroup[i].key == key){
                return paraGroup[i].value;
            }
        }
        return null;
        // 异步写法， 暂不支持表达式异步
        // return YIUI.MetaService.getParaGroup(group, form.getFormKey())
        //             .then(function(paraGroup){
        //                 for(var i = 0, len = paraGroup.length; i < len; i++){
        //                     if(paraGroup[i].key == key){
        //                         return paraGroup[i].value;
        //                     }
        //                 }
        //                 return null;
        //             });
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
            service: "WebMetaService",
            dataObjKey: dataObjKey,
            formKey: formKey
        };
        var key = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        return key;
    };

    funs.GetFormRelation = function (name, cxt, args) {
        var formKey = YIUI.TypeConvertor.toString(args[0]);
        var paras = {
            cmd: "GetRelationForm",
            service: "WebMetaService",
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
        } else if (typeof column === 'string') {
            var cellKey = column.toString();
            cell = grid.getCellDataByKey(rowIndex, cellKey);
            caption = cell[1];
        }
        return caption;
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

    var sDateDiff = 0;
    funs.ServerDate = function (name, cxt, args) {
        var form = cxt.form;
        var time = (new Date()).getTime();
        if(sDateDiff > 0) {
            time += sDateDiff;
        } else {
            var paras = {};
            paras.service = "DateService";
            paras.cmd = "ServerDate";
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            sDateDiff = result - time;
            time = result;
        }
        return new Date(time);
    };

    var sDBDateDiff = 0;
    funs.ServerDBDate = function (name, cxt, args) {
        var form = cxt.form;
        var time = (new Date()).getTime();
        if(sDBDateDiff > 0) {
            time += sDBDateDiff;
        } else {
            var paras = {};
            paras.service = "DateService";
            paras.cmd = "ServerDBDate";
            var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            sDBDateDiff = result - time;
            time = result;
        }
        return new Date(time);
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
        YIUI.AppDef.refreshStatusInfo(key);
        return true;
    };

    funs.UpdateStatusInfo = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var text = YIUI.TypeConvertor.toString(args[1]);
        YIUI.AppDef.updateStatusInfo(key, text);
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
        var dataObjKey = form.getDataObject().key;
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
        var form = cxt.form, key = args[0], value = args[1];
        form.setCallPara(key, value);
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
            return ptForm.getOID();
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
        paras.endPeriod = endPeriod;
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
            return YIUI.GridUtil.isEmptyRow(gr);
        }
        return false;
    };

    funs.CheckDuplicate = function (name, cxt, args) {
        var form = cxt.form;
        if (args.length > 0) {
            var cellKey = args[0],
                cl = form.getCellLocation(cellKey),
                grid = form.getComponent(cl.key);

            if (!grid) {
                YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS,cl.key);
            }

            var containsValue = function (datas,data) {
                if( datas.length == 0 )
                    return false;

                var equals = function (dataA,dataB) {
                    for( var i = 0,o1,o2,length = dataA.length;i < length;i++ ) {
                        if( !_equal(dataA[i],dataB[i]) )
                            return false;
                    }
                    return true;
                }
                var _equal = function (o1,o2) {
                    if( o1 == null && o2 == null )
                        return true;
                    if( (o1 == null && o2 != null) || (o1 != null && o2 == null) )
                        return false;
                    if( typeof o1 == 'object' ) {
                        if( o1 instanceof YIUI.ItemData ) {
                            return o1.getOID() == o2.getOID();
                        } else if ( o1 instanceof Decimal ) {
                            return parseFloat(o1) == parseFloat(o2);
                        } else if ( o1 instanceof Date ) {
                            return o1.getTime() == o2.getTime();
                        }
                    } else {
                        return o1 == o2;
                    }
                }

                for( var i = 0,length = datas.length;i < length;i++ ) {
                    if( equals(datas[i],data) )
                        return true;
                }
                return false;
            }

            var datas = [], values;
            for (var i = 0,row;row = grid.getRowDataAt(i);i++) {

                values = [];

                if (row.isDetail && !YIUI.GridUtil.isEmptyRow(row)) {
                    for (var j = 0,key;key = args[j];j++) {
                        values.push(grid.getValueByKey(i,key));
                    }

                    if( containsValue(datas,values) )
                        return true;

                    datas.push(values);
                }
            }
        }
        return false;
    };

    funs.InsertRow = function (name, cxt, args) {
        var form = cxt.form, rowIndex = -1;
        var com = form.getComponent(args[0]);
        if ( !com )
            return -1;
        var newRowIndex = -1;
        switch (com.type) {
        case YIUI.CONTROLTYPE.LISTVIEW:
            // TODO
            break;
        case YIUI.CONTROLTYPE.GRID:
            if ( args.length > 1 ) {
                rowIndex = parseInt(args[1].toString() || -1, 10);
            }
            rowIndex = (rowIndex == -1 ? com.getFocusRowIndex() : rowIndex);
            newRowIndex = com.insertRow(rowIndex);
            break;
        }
        return newRowIndex;
    };

    funs.DeleteRow = function (name, cxt, args) {
        var form = cxt.form, rowIndex = -1;
        var com = form.getComponent(args[0]);
        if ( !com )
            return false;
        if ( args.length > 1 ) {
            rowIndex = parseInt(args[1].toString() || 0, 10);
        }
        switch (com.type) {
        case YIUI.CONTROLTYPE.LISTVIEW:
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
        var form = cxt.form, gridKey = args[0],
            rowIndex = parseInt(args[1].toString() || 0, 10),excludeKeys = [];
        var grid = form.getComponent(gridKey);
        if (rowIndex == -1) {
            rowIndex = grid.getFocusRowIndex();
        }
        if (rowIndex == -1)
            return -1;
        if (args.length > 2) {
            excludeKeys = args[2].split(",");
        }
        var excludeValues = [];
        if (args.length > 3) {
            for (var i = 3; i < args.length; i++) {
                excludeValues.push(args[i]);
            }
        }
        if( excludeKeys.length != excludeValues.length )
            return -1;

        var columnKeys = [];

        var detailRow = grid.getDetailMetaRow();
        for( var i = 0,size = detailRow.cells.length; i < size;i++ ) {
            var cell = detailRow.cells[i];
            if( cell.hasDB && excludeKeys.indexOf(cell.key) != -1 ) {
                columnKeys.push(cell.columnKey);
            }
        }
        return grid.gridHandler.copyRow(form, grid, rowIndex, columnKeys, excludeValues);
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
            cmd: "Map",
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
        return form.getCaption();
    };

    funs.GetFormAbbrCaption = function (name, cxt, args) {
        var form = cxt.form;
        return form.getAbbrCaption();
    };

    funs.StatusValue = function (name, cxt, args) {
        //这个地方的缓存 为临时处理， 2.1中将做成异步
        if(!this.statusCache){
            this.statusCache = new LRUCache(5);
        }


        var form = cxt.form;
        var formKey = form.getFormKey();
        var statusKey = args[0];
        if (args.length > 1){
            formKey = YIUI.TypeConvertor.toString(args[1]);
        }
        var paras = {
            service: "WebMetaService",
            cmd: "GetStatusCollection",
            formKey: formKey
        };

        var statusCollection = null;
        if(this.statusCache.contains(formKey)){
            statusCollection = this.statusCache.get(formKey);
        }else{
            statusCollection = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras)
            this.statusCache.set(formKey, statusCollection);
        }

        if(statusCollection){
            for (var i = 0, len = statusCollection.length; i < len; i++) {
                if (statusCollection[i].key == statusKey) {
                    return statusCollection[i].value;
                }
            }
        }
        /*//var status = form.statusItems;
         if (args.length > 1) {
         var formKey = YIUI.TypeConvertor.toString(args[1]);
         var paras = {
         service: "PureStatus",
         cmd: "GetStatusItems",
         formKey: formKey
         };
         status = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
         }
         if(status){
         for (var i = 0, len = status.length; i < len; i++) {
         if (status[i].key == statusKey) {
         return status[i].value;
         }
         }
         }*/
        return null;
    };

    funs.GetStatusItems = function (name, cxt, args) {
        //这个地方的缓存 为临时处理， 2.1中将做成异步
        if(!this.statusCache){
            this.statusCache = new LRUCache(5);
        }

        var form = cxt.form;
        var result = form.statusItems;
        var formKey = "";
        if (args.length > 0) {
            formKey = args[0];
        } else {
            formKey = form.formKey;
        }
        var paras = {
            service: "WebMetaService",
            cmd: "GetStatusCollection",
            formKey: formKey
        };

        if(!this.statusCache){
            this.statusCache = new LRUCache(5);
        }

        var statusItems = null;
        if(this.statusCache.contains(formKey)) {
            statusItems = this.statusCache.get(formKey);
        } else {
            statusItems = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras)
            this.statusCache.set(formKey, statusItems);
        }
        return statusItems;
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
                comp.load(true);
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
            com = form.getComponent(key);
        if (com == undefined) return;
        switch (com.type) {
        case YIUI.CONTROLTYPE.GRID:
            var colInfoes = com.getColInfoByKey(columnKey);
            if( colInfoes.length > 0 ) {
                com.setColumnVisible(colInfoes[0].colIndex, visible);
            }
            break;
        case YIUI.CONTROLTYPE.LISTVIEW:
            com.setColumnVisible(columnKey, visible);
            break;
        }
    };

    funs.ReloadGrid = function (name, cxt, args) {
        var form = cxt.form, doc = form.getDocument(), gridKey = YIUI.TypeConvertor.toString(args[0]), sourceKey = "", state = 0;
        if (doc == null) return;
        if (args.length > 3) {
            if ("new" == YIUI.TypeConvertor.toString(args[3]).toLowerCase()) {
                state = 1;
            }
        }
        var grid = form.getComponent(gridKey);
        if (grid == null) {
            YIUI.ViewException.throwException(YIUI.ViewException.COMPONENT_NOT_EXISTS);
        }

        var tableKey = grid.getMetaObj().tableKey;
        if( !grid.tableKey )
            return;

        // 表的查询条件
        var filterMap = form.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DETAIL);
        var filterDetail = filterMap.getTblFilter(tableKey);

        if (args.length > 2) {
            sourceKey = YIUI.TypeConvertor.toString(args[2]);
            filterDetail.setSourceKey(sourceKey);
        }

        YIUI.DocService.loadFormData(form, form.getFilterMap().OID, form.getFilterMap(), form.getCondParas())
            .then(function(doc){

                var table = doc.getByKey(tableKey);
                form.getDocument().remove(tableKey);
                form.getDocument().add(tableKey, table);

                var totalRowCount = YIUI.TotalRowCountUtil.getRowCount(doc, tableKey);
                YIUI.TotalRowCountUtil.setRowCount(form.getDocument(), tableKey, totalRowCount);

                grid.load(true);
            });
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
    
    funs.SetCellBackColor = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var rowIndex = parseInt(args[1].toString());
        var comp = form.getComponent(key);
        if (rowIndex == undefined || rowIndex == null || rowIndex == -1) {
            rowIndex = cxt.rowIndex;
        }
        if ((rowIndex == undefined || rowIndex == null || rowIndex == -1) && comp) {
            rowIndex = comp.getFocusRowIndex();
        }

        var col = YIUI.TypeConvertor.toString(args[2]);
        if ($.isNumeric(col)) {
        	var color = YIUI.TypeConvertor.toString(args[3]);
            form.setCellBackColor(key, rowIndex, parseInt(col), color);
        } else {
        	var color = YIUI.TypeConvertor.toString(args[3]);
            form.setCellBackColor(key, rowIndex, comp.getCellIndexByKey(col), color);
        }
        
    };
    
    funs.SetCellForeColor = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var rowIndex = parseInt(args[1].toString());
        var comp = form.getComponent(key);
        if (rowIndex == undefined || rowIndex == null || rowIndex == -1) {
            rowIndex = cxt.rowIndex;
        }
        if ((rowIndex == undefined || rowIndex == null || rowIndex == -1) && comp) {
            rowIndex = comp.getFocusRowIndex();
        }

        var col = YIUI.TypeConvertor.toString(args[2]);
        if ($.isNumeric(col)) {
        	var color = YIUI.TypeConvertor.toString(args[3]);
            form.setCellForeColor(key, rowIndex, parseInt(col), color);
        } else {
        	var color = YIUI.TypeConvertor.toString(args[3]);
            form.setCellForeColor(key, rowIndex, form.getCellLocation(col).column, color);
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
    funs.PushPara = function (name, cxt, args) {
        var form = cxt.form;
        var key = YIUI.TypeConvertor.toString(args[0]);
        var value = args[1];
        form.setCallPara(key, value);
        return true;
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

//        var paras = {
//            service: "PureMid",
//            cmd: "pureEvalMidExp",
//            exp: exp,
//            document: $.toJSON(doc),
//            paras: $.toJSON(newArgs),
//            formParas: formParas.toJSON()
//        };
//        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

        var paras = {
            service: "EvalMidExp",
            cmd: "EvalMidExp",
            exp: exp,
            document: $.toJSON(doc),
            paras: $.toJSON(newArgs),
            parameters: formParas.toJSON()
        };
        return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);

    };

    funs.Eval = function (name, cxt, args) {
        var form = cxt.form,
            script = YIUI.TypeConvertor.toString(args[0]);
        return form.eval(script,new View.Context(form));
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
            doc = YIUI.DataUtil.toJSONDoc(doc,true);
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

    funs.InvokeUnsafeService = function (name, cxt, args) {
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
            service: "InvokeUnsafeService",
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
            doc = YIUI.DataUtil.toJSONDoc(doc,true);
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

        YIUI.RemoteService.setSessionParas(map);

        return true;
    };

    funs.SessionPara = funs.GetSessionPara = function (name, cxt, args) {
        var key = YIUI.TypeConvertor.toString(args[0]);
        var paras = $.parseJSON($.cookie("sessionParas"));
        return paras[key];
    };

    funs.ImportExcel = function (name, cxt, args) {
        var needResult = false;
        if (args.length > 0) {
            needResult = YIUI.TypeConvertor.toBoolean(args[0]);
        }

        var success = null;
        if ( needResult ) {
            success = function () {
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

        var options = {
            clearOriginalData: clearOriginalData,
            importServiceName: importServiceName,
            formKey: formKey,
            service: "FileOperate",
            cmd: "ImportExcel",
            mode: 1,
            success:success
        }

        if( window.up_target ) {
            window.up_target.change(function(){
                options.file = $(this);
                YIUI.FileUtil.ajaxFileUpload(options);
            });
        } else {
            YIUI.FileUtil.uploadFile(options);
        }

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

        var form = cxt.form,
            document = form.getDocument(),
            doc = YIUI.DataUtil.toJSONDoc(document);

        var options = {
            clearOriginalData: clearOriginalData,
            importServiceName: importServiceName,
            postImportServiceName: postImportServiceName,
            formKey: form.formKey,
            document: $.toJSON(doc),
            service: "FileOperate",
            cmd: "SingleImportExcel",
            mode: 1,
        };

        if( window.up_target ) {
            window.up_target.change(function(){
                options.file = $(this);
                YIUI.FileUtil.ajaxFileUpload(options);
            });
        } else {
            YIUI.FileUtil.uploadFile(options);
        }
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
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        paras.onlyCurrentPage = exportCurPage;
        paras.postExportServerName = postExportServerName;

        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var options = {
                formKey: form.formKey,
                filePath: result.filePath.replace(/\\/g, "/"),
                fileMD5: result.fileMD5,
                fileName: result.fileName,
                mode:1,
                service: 'DownloadExcel'
            };
            YIUI.FileUtil.downLoadFile(options);
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
            var options = {
                formKey: form.formKey,
                filePath: result.filePath.replace(/\\/g, "/"),
                fileMD5: result.fileMD5,
                fileName: result.fileName,
                mode:1,
                service: 'DownloadExcel'
            };
            YIUI.FileUtil.downLoadFile(options);
        }
        return true;

    };

    funs.ExportDict = function (name, cxt, args) {
        var exportFormKey = YIUI.TypeConvertor.toString(args[0]);

        var templateKey = "";
        if (args.length > 1) {
            templateKey = YIUI.TypeConvertor.toString(args[1]);
        }

        var needDownload = true;
        if (args.length > 2) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[2]);
        }

        var postExportServerName = "";
        if (args.length > 3) {
            postExportServerName = YIUI.TypeConvertor.toString(args[3]);
        }

        var paras = {};
        paras.service = "ExportFile";
        paras.cmd = "ExportDict";
        paras.exportFormKey = exportFormKey;
        paras.templateKey = templateKey;
        paras.postExportServerName = postExportServerName;

        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var options = {
                formKey: form.formKey,
                filePath: result.filePath.replace(/\\/g, "/"),
                fileMD5: result.fileMD5,
                fileName: result.fileName,
                mode:1,
                service:'DownloadExcel'
            };
            YIUI.FileUtil.downLoadFile(options);
        }
        return true;

    };

    funs.ExportExcelWithTemplate = function (name, cxt, args) {
        var form = cxt.form;
        var templateKey = YIUI.TypeConvertor.toString(args[0]);
        var needDownload = true;
        if (args.length > 1) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[1]);
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
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
       if (needDownload) {
            var options = {
                formKey: form.formKey,
                filePath: result.filePath.replace(/\\/g, "/"),
                fileMD5: result.fileMD5,
                fileName: result.fileName,
                mode:1,
                service:'DownloadExcel'
            };
            YIUI.FileUtil.downLoadFile(options);
        }
        return true;
    };

    funs.ExportCSV = function (name, cxt, args) {
        var form = cxt.form;
        var needDownload = true;
        var exportTables = "";
        if (args.length > 0) {
            needDownload = YIUI.TypeConvertor.toBoolean(args[0]);
        }

        if (args.length > 1) {
            exportTables = YIUI.TypeConvertor.toString(args[1]);
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
        paras.filterMap = $.toJSON(filterMap);
        paras.condition = $.toJSON(form.getCondParas());
        var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (needDownload) {
            var options = {
                formKey: form.formKey,
                filePath: result.filePath.replace(/\\/g, "/"),
                fileMD5: result.fileMD5,
                fileName: result.fileName,
                mode:1,
                service:'DownloadExcel'
            };
            YIUI.FileUtil.downLoadFile(options);
        }
        
        return true;
    };

    funs.Print = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "WebPrintService";
        paras.cmd = "PrintPDF";
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

        var doc = form.getDocument();
        var jsonDoc = YIUI.DataUtil.toJSONDoc(doc);
        paras.doc = $.toJSON(jsonDoc);
        paras.parameters = form.getParas().toJSON();

        var url = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        YIUI.Print.print(url, form.formID);
    };

    funs.PrintPreview = function (name, cxt, args) {
        var form = cxt.form;
        var paras = {};
        paras.service = "WebPrintService";
        paras.cmd = "PrintPDF";
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
        var doc = form.getDocument();
        var jsonDoc = YIUI.DataUtil.toJSONDoc(doc);
        paras.doc = $.toJSON(jsonDoc);
        paras.parameters = form.getParas().toJSON();

        var url = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        url = url.replace(/\\/g, "/");
        var opts = {
            formKey: form.formKey,
            url: url
        };
        new YIUI.PrintPreview(opts);
    };

    funs.PrintHtml = function (name, cxt, args) {
        var $el;
        if (args.length > 0) {
            var selector = YIUI.TypeConvertor.toString(args[0]);
            $el = $(selector);
        } else {
            var form = cxt.form;
            $el = form.formAdapt.getRoot().el;
            form.defaultToolBar && form.defaultToolBar.el.addClass('noneedprint');
        }
        // $el.css({'page-break-after': 'always'});
        $el.printArea({extraHead: '<style media="print" type="text/css"> .noneedprint {display: none} </style>'});
    };

    funs.BatchPrint = function (name, cxt, args) {
        var form = cxt.form;

        var formKey = YIUI.TypeConvertor.toString(args[0]);
        var reportKey = YIUI.TypeConvertor.toString(args[1]);

        var _OIDs = args[2];

        var OIDs = [];
        if( typeof _OIDs === 'string' && _OIDs ) {
            var array = _OIDs.split(",");
            for( var i = 0,oid; oid = array[i];i++ ) {
                OIDs.push(parseInt(oid));
            }
        } else if ( $.isArray(_OIDs) ) {
            OIDs = OIDs.concat(_OIDs);
        } else {
            OIDs = YIUI.BatchUtil.getViewSelectOIDs(form,true);
        }

        var paras = {
            service: "WebPrintService",
            cmd: "BatchPrintPDF",
            formKey: formKey,
            reportKey: reportKey,
            parameters: form.getParas().toJSON(),
            OIDs: $.toJSON(OIDs)
        }

        var url = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        YIUI.Print.print(url, form.formID);
    }

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
            var delegateType = args[0],
                srcOperatorID = args[1],
                tgtOperatorID = args[2],
                objectType = args[3],
                objectKey = args[4],
                nodeKey = args[5],
                alwaysValid = args[7];

            var startTime = alwaysValid ? new Date(0) : args[6];
            var endTime = alwaysValid ? new Date(0) : args[8];

            YIUI.BPMService.addDelegateData(delegateType,
                srcOperatorID,
                tgtOperatorID,
                objectType,
                objectKey,
                nodeKey,
                startTime,
                endTime,
                alwaysValid);
        };

        funs.DeleteDelegateData = function (name, cxt, args) {
            YIUI.BPMService.deleteDelegateData(args[0]);
        };

        funs.GetActiveWorkitemID = function (name, cxt, args) {
            var info = getActiveWorkitem(cxt, args);
            var WID = info.WorkitemID;
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
            var oid = null;
            if (args.length > 0) {
                oid = YIUI.TypeConvertor.toLong(args[0]);
                YIUI.BPMService.restartInstanceByOID(oid);
            } else {
                var form = cxt.form;

                YIUI.BPMService.restartInstanceByOID(form.getOID())
                    .then(function(data){
                        form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);

                        var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                        if (b != null) {
                            form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                        }

                        viewReload(cxt.form);
                    });

            }

        };

        funs.IsInstanceStarted = function (name, cxt, args) {
            var oid = null;
            if (args.length > 0) {
                oid = YIUI.TypeConvertor.toInt(args[0]);
            } else {
                var form = cxt.form;
                oid = form.getOID();
            }

            var json = YIUI.BPMService.isInstanceStarted(oid);
            var started = YIUI.TypeConvertor.toBoolean(json.result);
            return started;
        };

        funs.EndInstance = function (name, cxt, args) {
            var instanceID = YIUI.TypeConvertor.toLong(args[0]);
            var userinfo = "";
            if(args.length > 2)
            	userinfo = YIUI.TypeConvertor.toString(args[2]);
            
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

                YIUI.BPMService.endInstance(instanceID, userinfo).then(function(data){
                    form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);
                    var doc = form.getDocument();
                    var b = doc.getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    if (b != null) {
                        form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                    }
                    viewReload(form);
                });
            } else {
                YIUI.BPMService.endInstance(instanceID, userinfo);
            }

            return true;
        };
        
        funs.ReviveInstance = function (name, cxt, args) {
            var instanceID = YIUI.TypeConvertor.toLong(args[0]);
            var userinfo = "";
            if(args.length > 2)
            	userinfo = YIUI.TypeConvertor.toString(args[2]);
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

                YIUI.BPMService.reviveInstance(instanceID, userinfo).then(function(data){
                    form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);
                    var doc = form.getDocument();
                    var b = doc.getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    if (b != null) {
                        form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                    }
                });
            } else {
                YIUI.BPMService.reviveInstance(instanceID, userinfo);
            }

            return true;
        };

        funs.PauseInstance = function (name, cxt, args) {
        	var form = cxt.form;
            var wid = args[0];
            if (wid == -1) {
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                wid = info.WorkitemID;
            }
            YIUI.BPMService.pauseInstance(wid);
            return true;
        };

        funs.Resume = function (name, cxt, args) {
        	var form = cxt.form;
            var wid = args[0];
            if (wid == -1) {
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                wid = info.WorkitemID;
            }
            YIUI.BPMService.resume(wid);
            return true;
        };

        funs.DisableDelegateData = function (name, cxt, args) {
            var form = cxt.form;
            var delegateID = YIUI.TypeConvertor.toInt(args[0]);
            YIUI.BPMService.updateDelegateDataState(delegateID, false);
            return true;
        };

        funs.SetDelegateDataInUse = function (name, cxt, args) {
            var form = cxt.form;
            var delegateID = YIUI.TypeConvertor.toInt(args[0]);
            YIUI.BPMService.updateDelegateDataState(delegateID, true);
            return true;
        };

        funs.OpenWorkitem = function (name, cxt, args) {
            var form = cxt.form;
            var WID = args[0].toString();
            var onlyOpen = false;
            if (args.length > 1) {
                onlyOpen = YIUI.TypeConvertor.toBoolean(args[1]);
            }

            YIUI.BPMService.loadWorkitemInfo(WID).then(function(info){
                var formKey = info.FormKey;
                var OID = info.OID;
                var container = form.getDefContainer();
                if (container == null) {
                    container = form.getContainer();
                }

                var existsAttachment = info.AttachmentType >= 0;
                if (existsAttachment) {
                    OID = info.AttachmentOID;
                    formKey = info.AttachmentPara;
                    if (info.AttachmentOperateType == YIUI.AttachmentOperateType.NEW && OID < 0) {

                        var builder = new YIUI.YIUIBuilder(formKey, info.TemplateKey);
                        builder.setContainer(container);
                        builder.setParentForm(form);
                        builder.setTarget(YIUI.FormTarget.NEWTAB);
                        builder.newEmpty().then(function(emptyForm){

                            if (!onlyOpen) {
//                                emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, info);
                                emptyForm.setTemplateKey(info.TemplateKey)
                            }
                            // 代表新界面由代办页面打开
                            emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW, YIUI.BPMConstants.WORKITEM_VIEW);

                            emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.NewOpt(emptyForm)));
                            return builder.builder(emptyForm);
                        }).then(function(data){
                            var doc = data.getDocument();
                            doc.putExpData(YIUI.BPMKeys.REGISTER_ATTACHMENT, WID);
                        });
                        return true;
                    }
                }


                var builder = new YIUI.YIUIBuilder(formKey, info.TemplateKey);
                builder.setContainer(container);
                builder.setParentForm(form);
                // builder.setTarget(YIUI.FormTarget.NEWTAB);
                builder.setOperationState(YIUI.Form_OperationState.Default);

                builder.newEmpty().then(function(emptyForm){

                    if (!onlyOpen) {
//                        emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, info);
                        emptyForm.TemplateKey = info.TemplateKey;
                    }
                    // 代表新界面由代办页面打开
                    emptyForm.setSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW, YIUI.BPMConstants.WORKITEM_VIEW);

                    var filterMap = emptyForm.getFilterMap();
                    filterMap.setOID(OID);
                    emptyForm.setOptQueue(new YIUI.OptQueue(new YIUI.LoadOpt(emptyForm)));
                    builder.builder(emptyForm);
                });

            });

            return true;
        };

        var CommitWorkitem = function (cxt, args) {
            var form = cxt.form;
            var doc = form.getDocument();
            var WID = args[0].toString();
            var info = null;
            if (WID == -1) {
                info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                WID = info.WorkitemID;
                info.AuditResult = args[1];
                info.UserInfo = args[2];
            } else {
            	
            	var options = {
        			WorkitemID:args[0],
                	AuditResult:args[1],
                	UserInfo:args[2],
            	};
            	
            	info = new YIUI.WorkitemInfo(options);

            }
            //解析动态驳回和单据保存相关参数
            var tsParas;
            if(args.length > 3) {
            	tsParas = args[3];
            }
            if(tsParas) {
            	tsParas = splitPara(tsParas);
            }
            
            var pattern;
            var backSite = -1;
            var saveDoc = false;
            if(tsParas) {
            	if(tsParas["pattern"]){
            		pattern = tsParas["pattern"];
            	}
            	if(tsParas["backSite"]){
            		backSite = YIUI.TypeConvertor.toInt(form.eval(tsParas["backSite"], cxt));
            	}
            	if(tsParas["saveDoc"]){
            		saveDoc = YIUI.TypeConvertor.toBoolean(tsParas["saveDoc"]);
            	}
            }
            
            if(pattern) {
            	if(pattern == "Transit") {
            		if(saveDoc) {
            			YIUI.BPMService.transferToNode(info, doc).then(function(data){
            				form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
            				var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
            				if (b != null) {
            					form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
            				}
            				viewReload(form);
                      });
            		} else {
            			YIUI.BPMService.transferToNode(info).then(function(data){
                            form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);

                            var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                            if (b != null) {
                            	form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
                            }

                            viewReload(form);
                        });
            		}
            	} else if(pattern == "Return") {
            		if(backSite != -1) {
            			info.BackSite = backSite;
            			if(saveDoc) {
                    		YIUI.BPMService.commitWorkitem(info, doc).then(function(data){
                    			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
                    			var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    			if (b != null) {
                    				form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    			}
                    			viewReload(form);
                          });
                    	} else {
                    		YIUI.BPMService.commitWorkitem(info).then(function(data){
                    			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
                    			var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    			if (b != null) {
                    				form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    			}
                    			viewReload(form);
                          });
                    	}
            		} else {
            			$.error("你没有写驳回位置啊亲！(＞﹏＜)~！！！");
            		}
            	}
            } else {
            	if(saveDoc) {
            		YIUI.BPMService.commitWorkitem(info, doc).then(function(data){
            			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
            			var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
            			if (b != null) {
            				form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
            			}
            			viewReload(form);
                  });
            	} else {
            		YIUI.BPMService.commitWorkitem(info).then(function(data){
            			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
            			var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
            			if (b != null) {
            				form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
            			}
            			viewReload(form);
                  });
            	}
            }
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
//                for (var i = 0, len = list.length; i < len; i++) {
//                    OIDList.push(YIUI.TypeConvertor.toLong(list[i]));
//                }
                OIDList.push(36976546);
                OIDList.push(36976547);
                result = YIUI.TypeConvertor.toInt(args[1]);
                userInfo = YIUI.TypeConvertor.toString(args[2]);
            } else {
                var tableKey = YIUI.TypeConvertor.toString(args[0]);
                var OIDFieldKey = YIUI.TypeConvertor.toString(args[1]);
                OIDList = YIUI.BatchUtil.getSelectOIDs(form, tableKey, OIDFieldKey, true);
                result = YIUI.TypeConvertor.toInt(args[2]);
                userInfo = YIUI.TypeConvertor.toString(args[3]);
            }

            YIUI.BPMService.batchCommitWorkitem(OIDList, result, userInfo);
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

            YIUI.BPMService.batchCommitWorkitem(WIDList, result, userInfo);
            return true;
        };

        funs.StartInstance = function (name, cxt, args) {
            var form = cxt.form;
            var doc = form.getDocument();
            var table = doc.getExpData(YIUI.BPMKeys.LoadBPM_KEY);
            if(table != null){
            	table = YIUI.DataUtil.fromJSONDataTable(table);
            }
            var processKey = args[0];
            var tsParas;
            if(args.length > 1) {
            	tsParas = args[1];
            }
            if(tsParas) {
            	tsParas = splitPara(tsParas);
            }
            
            var pattern;
            var saveDoc = false;
            var auditResult = 1;
            if(tsParas) {
            	if(tsParas["pattern"]){
            		pattern = tsParas["pattern"];
            	}
            	if(tsParas["saveDoc"]){
            		saveDoc = YIUI.TypeConvertor.toBoolean(tsParas["saveDoc"]);
            	}
            	if(tsParas["auditResult"]){
            		auditResult = YIUI.TypeConvertor.toInt(tsParas["auditResult"]);
            	}
            }
            
            if(pattern == "Transit") {
            	var instanceID = table.getByKey(YIUI.BPMConstants.BPM_INSTANCE_ID);
            	if(saveDoc) {
            		YIUI.BPMService.dirStratInstance(instanceID, auditResult, doc)
            		.then(function(data){
            			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
            			
        				var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
        				if (b != null) {
        					form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
        				}
        				viewReload(form);
            		});
            	} else {
            		YIUI.BPMService.dirStratInstance(instanceID, auditResult)
            		.then(function(data){
            			form.setSysExpVals(YIUI.BPMKeys.WORKITEM_INFO, null);
            			
        				var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
        				if (b != null) {
        					form.getDocument().rmExpData(YIUI.BPMKeys.WORKITEM_INFO);
        				}
        				viewReload(form);
            		});
            	}
            } else {
            	if(saveDoc) {
            		 YIUI.BPMService.startInstance(form.formKey, form.getOID(), args[0], doc)
                     .then(function(data){
                         viewReload(form);
                     });
            	} else {
            		 YIUI.BPMService.startInstance(form.formKey, form.getOID(), args[0])
                     .then(function(data){
                         viewReload(form);
                     });
            	}
            }
        };

        funs.RestartInstance = function (name, cxt, args) {
            var form = cxt.form;
            var instanceID = YIUI.TypeConvertor.toInt(args[0]);
            if (instanceID == -1) {

                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                instanceID = info.InstanceID;

                YIUI.BPMService.restartInstance(instanceID).then(function(data){
                    form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);

                    var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    if (b != null) {
                        form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                    }

                    viewReload(form);
                });
            }else{
                YIUI.BPMService.restartInstance(instanceID);
            }
        };

        funs.KillInstance = function (name, cxt, args) {
            var instanceID = args[0].toString();
            if (instanceID == -1) {
                var fromParent = false;
                if (args.length > 1) {
                    fromParent = YIUI.TypeConvertor.toBoolean(args[1]);
                }

                var form = cxt.form;
                if (fromParent) {
                    form = form.getParentForm();
                }
                var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);
                instanceID = info.InstanceID;

                YIUI.BPMService.killInstance(instanceID).then(function(data){
                    form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);

                    var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    if (b != null) {
                        form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                    }

                    viewReload(cxt.form);
                });
            } else {
                YIUI.BPMService.killInstance(instanceID);
            }
            return true;
        };

        funs.SkipToNode = function (name, cxt, args) {
            var info = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO);

            YIUI.BPMService.skipToNode(info.WorkitemID, args[0])
                .then(function(data){
                    viewReload(form);
                });
        };
        
        funs.GetValidNodes = function (name, cxt, args) {
        	var nodeID = YIUI.TypeConvertor.toInt(args[0]);
        	var processKey = YIUI.TypeConvertor.toString(args[1]);
        	return YIUI.BPMService.getValidNodes(nodeID, processKey);
        };
        
        funs.GetAliasKey = function(name, cxt, args) {
        	var platform = YIUI.TypeConvertor.toInt(args[0]),
        		formkey = YIUI.TypeConvertor.toString(args[1]);
        	return YIUI.MetaService.getAliasKey(platform, formkey);
        }

        var viewReload = function (form) {
            var container = form.getDefContainer();
            if (container == null) {
                container = form.getContainer();
            }

            var tag = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_VIEW);
            // 如果这个工作项是代办页面打开的，提交工作项之后刷新代办页面
            if (tag == YIUI.BPMConstants.WORKITEM_VIEW) {
                var pFormID = form.pFormID;
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
            var originDoc = form.getDocument();
            if (originDoc) {
                //MainTable
                var mtKey = form.mainTableKey;
                var mt = originDoc.getByKey(mtKey);
                if (mt && mt.getRowCount() > 0) {
                    originVerID = mt.getByKey(YIUI.SystemField.VERID_SYS_KEY);
                    if (originVerID >= 0)
                        originDocContainVerID = true;
                }
            }

            var loadParent = new YIUI.LoadOpt(form);
            loadParent.doOpt();

            // 原始数据无版本信息，那么就不要执行UpdateView
            if (!originDocContainVerID)
                return;

            // 获取载入后数据的版本号，如果发生了变化,那么执行UpdateView
            var activeDoc = form.getDocument();
            if (activeDoc != null) {
                var mtKey = form.mainTableKey;
                var mt = activeDoc.getByKey(mtKey);
                if (mt && mt.getRowCount() > 0) {
                    var newVerID = mt.getByKey(YIUI.SystemField.VERID_SYS_KEY);
                    if (parseInt(newVerID) > parseInt(originVerID)) {
                        updateView(form);
                    }
                }
            }

        };

        funs.RollbackToWorkitem = function (name, cxt, args) {
            var form = cxt.form;
            var wid = YIUI.TypeConvertor.toInt(args[0]);
            var logicCheck = false;
            if (args.length > 1) {
                logicCheck = YIUI.TypeConvertor.toBoolean(args[1]);
            }

            YIUI.BPMService.rollbackToWorkitem(wid, logicCheck)
                .then(function(data){

                    form.setSysExpVals(YIUI.BPMConstants.WORKITEM_INFO, null);

                    var b = form.getDocument().getExpData(YIUI.BPMKeys.WORKITEM_INFO);
                    if (b != null) {
                        form.getDocument().putExpData(YIUI.BPMKeys.WORKITEM_INFO, null);
                    }

                    viewReload(form);
                });
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
            var oids = lv.getFieldArray(form, YIUI.SystemField.OID_SYS_KEY);
            var result = YIUI.TypeConvertor.toInt(args[0]);
            var userInfo = YIUI.TypeConvertor.toString(args[1]);

            YIUI.BPMService.batchStateAction(processKey, actionNodeKey, oids, result, userInfo);
            return true;
        };

        funs.GetProcessPath = function (name, cxt, args) {
            var oid = null;
            if (args.length > 0) {
                oid = YIUI.TypeConvertor.toInt(args[0]);
            } else {
                var form = cxt.form;
                if (form) {
                    oid = form.getOID();
                }
            }

            var rs = YIUI.BPMService.loadProcessPath(oid);
            return rs;
        };

        funs.RegisterAttachment = function (name, cxt, args) {
            var oid = YIUI.TypeConvertor.toLong(args[0]);
            var key = YIUI.TypeConvertor.toString(args[1]);
            var attachmentOID = YIUI.TypeConvertor.toLong(args[2]);

            var attachmentPara = "";
            if (args.length > 3)
                attachmentPara = YIUI.TypeConvertor.toString(args[3]);
            var attachmentInfo = "";
            if (args.length > 4)
                attachmentInfo = YIUI.TypeConvertor.toString(args[4]);

            YIUI.BPMService.registerAttachment(oid, key, attachmentOID, attachmentInfo, attachmentPara);
            return true;
        };
    }

    {
        // 获取ListView或者Grid行数据的公式
        funs.GetValueArray = function (name,cxt,args) {
            var form = cxt.form,
                doc = form.getDocument(),
                tableKey = YIUI.TypeConvertor.toString(args[0]),
                columnKey = YIUI.TypeConvertor.toString(args[1]);
            var table = doc.getShadow(tableKey);
            if( !table ) {
                table = doc.getByKey(tableKey);
            }
            var values = [];
            table.beforeFirst();
            while (table.next()) {
                if( !YIUI.TypeConvertor.toBoolean(table.getByKey(YIUI.SystemField.SELECT_FIELD_KEY)) )
                    continue;
                values.push(table.getByKey(columnKey));
            }
            return values;
        }
        
        funs.GetUIArray = function (name,cxt,args) {
            // TODO
        }
    }


    { //Detail相关
        funs.OpenDetail = function (name, cxt, args) {
            $.error("OpenDetail有误！");
//        	 TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]),
//                DOID = YIUI.TypeConvertor.toString(args[2]),
//                form = cxt.form;
//            if (DOID == undefined || DOID == "" || DOID == null) return;
//            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.OpenDetailInGrid = function (name, cxt, args) {
            $.error("OpenDetailInGrid有误！");
//            TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]),
//                DOID = YIUI.TypeConvertor.toString(args[2]),
//                form = cxt.form, rowIndex = cxt.rowIndex;
//            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, inGrid: true, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                var newForm = YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//                newForm.getDocument().oid = OID;
//                newForm.getDocument().clear();
//                var pTable = form.getDocument().getByKey(newForm.refTableKey);
//                var pGrid = form.getGridInfoByTableKey(newForm.refTableKey);
//                pGrid = form.getComponent(pGrid.key);
//                if (rowIndex == undefined) {
//                    rowIndex = pGrid.getFocusRowIndex();
//                } else {
//                    pGrid.setFocusRowIndex(rowIndex);
//                }
//                var focusRow = pGrid.getRowDataAt(rowIndex);
//                pTable.setByBkmk(focusRow.bookmark);
//                var nTable = new DataDef.DataTable();
//                $.extend(true, nTable.cols, pTable.cols);
//                nTable.key = pTable.key;
//                nTable.addRow();
//                for (var i = 0, len = nTable.cols.length; i < len; i++) {
//                    nTable.set(i, pTable.get(i));
//                }
//                nTable.batchUpdate();
//                newForm.getDocument().add(newForm.refTableKey, nTable);
//                newForm.showDocument();
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.SaveDetail = function (name, cxt, args) {
            $.error("SaveDetail有误！");
// TODO
//             var direct = false, form = cxt.form, doc = form.getDocument(),
//                 refTableKey = form.refTableKey, isStandalone = form.isStandalone();
//             var pForm = YIUI.FormStack.getForm(form.pFormID);
//             if (args.length > 0) {
//                 direct = YIUI.TypeConvertor.toBoolean(args[0]);
//             }
//             var uiCheckOpt = new YIUI.UICheckOpt(form);
//             if (!uiCheckOpt.doOpt()) return false;
//             if (direct) {
//                 doc.docType = DataDef.D_ObjDtl;
//                 doc.setModified();
//                 var document = YIUI.DataUtil.toJSONDoc(doc);
//                 var params = {
//                     cmd: "PureSaveData",
//                     document: $.toJSON(document),
//                     formKey: form.getFormKey()
//                 };
//                 var resultJson = Svr.SvrMgr.dealWithPureData(params);
// //                YIUI.FormBuilder.diff(form, resultJson);
//                 if (!isStandalone) {
//                     pForm.reloadTable(refTableKey);
//                     pForm.showDocument();
//                 }
//             } else {
//                 if (!isStandalone) {
//                     var pGrid = pForm.getGridInfoByTableKey(refTableKey);
//                     pGrid = pForm.getComponent(pGrid.key);
//                     var nTable = form.getDocument().getByKey(refTableKey),
//                         pTable = pForm.getDocument().getByKey(refTableKey), rowData;
//                     if (form.getOperationState() == YIUI.Form_OperationState.New) {
//                         pTable.addRow();
//                         var row , lastRowIndex = -1;
//                         for (var dlen = pGrid.getRowCount(), di = dlen - 1; di >= 0; di--) {
//                             row = pGrid.getRowDataAt(di);
//                             if (row.isDetail && row.bookmark != null) {
//                                 lastRowIndex = di + 1;
//                                 break;
//                             }
//                         }
//                         rowData = pGrid.addGridRow(null, lastRowIndex, false);
//                         rowData.bookmark = pTable.getBkmk();
//                     } else {
//                         rowData = pGrid.getRowDataAt(pGrid.getFocusRowIndex());
//                     }
//                     pTable.setByBkmk(rowData.bookmark);
//                     nTable.first();
//                     for (var i = 0, len = nTable.cols.length; i < len; i++) {
//                         pTable.set(i, nTable.get(i));
//                     }
//                     pGrid.showDetailRow(pGrid.getRowIndexByID(rowData.rowID), true);
//                 }
//             }
        };
        funs.EditDetail = function (name, cxt, args) {
            $.error("EditDetail有误！");
//       	 TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]),
//                DOID = YIUI.TypeConvertor.toString(args[2]),
//                form = cxt.form;
//            if (DOID == undefined || DOID == "" || DOID == null) return;
//            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, doEdit: true, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.EditDetailInGrid = function (name, cxt, args) {
            $.error("EditDetailInGrid有误！");
//       	 TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]),
//                DOID = YIUI.TypeConvertor.toString(args[2]),
//                form = cxt.form, rowIndex = cxt.rowIndex;
//            var paras = {cmd: "PureOpenDetail", OID: OID, DOID: DOID, inGrid: true, doEdit: true, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                var newForm = YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//                newForm.getDocument().oid = OID;
//                newForm.getDocument().clear();
//                var pTable = form.getDocument().getByKey(newForm.refTableKey);
//                var pGrid = form.getGridInfoByTableKey(newForm.refTableKey);
//                pGrid = form.getComponent(pGrid.key);
//                if (rowIndex == undefined) {
//                    rowIndex = pGrid.getFocusRowIndex();
//                } else {
//                    pGrid.setFocusRowIndex(rowIndex);
//                }
//                var focusRow = pGrid.getRowDataAt(rowIndex);
//                pTable.setByBkmk(focusRow.bookmark);
//                var nTable = new DataDef.DataTable();
//                $.extend(true, nTable.cols, pTable.cols);
//                nTable.key = pTable.key;
//                nTable.addRow();
//                for (var i = 0, len = nTable.cols.length; i < len; i++) {
//                    nTable.set(i, pTable.get(i));
//                }
//                nTable.batchUpdate();
//                newForm.getDocument().add(newForm.refTableKey, nTable);
//                newForm.showDocument();
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.NewDetail = function (name, cxt, args) {
            $.error("NewDetail有误！");
//       	 TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]), form = cxt.form, doc = form.getDocument();
//            var paras = {cmd: "PureNewDetail", OID: OID, VERID: doc.verid, DVERID: doc.dverid, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
        funs.NewDetailInGrid = function (name, cxt, args) {
            $.error("NewDetailInGrid有误！");
//       	 TODO
//            var detailFormKey = YIUI.TypeConvertor.toString(args[0]),
//                OID = YIUI.TypeConvertor.toString(args[1]), form = cxt.form, doc = form.getDocument();
//            var paras = {cmd: "PureNewDetail", OID: OID, VERID: doc.verid, DVERID: doc.dverid, inGrid: true, detailFormKey: detailFormKey};
//            var success = function (jsonObj) {
//                YIUI.FormBuilder.build(jsonObj, YIUI.FormTarget.MODAL, form.formID);
//            };
//            Svr.SvrMgr.dealWithPureForm(paras, success);
        };
    }

    { //BPMExtendFunction BPM扩展公式
        funs.TransferTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                operatorID = parseFloat(args[1].toString()),
                createRecord = false, userinfo,
                auditResult = -1;
            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            if (args.length > 2) {
                createRecord = args[2];
            }
            if (args.length > 3) {
            	userinfo = args[3];
            }
            if (args.length > 4) {
            	auditResult = args[4];
            }
            
            YIUI.BPMService.transferTask(WID, operatorID, createRecord, userinfo, auditResult);
        };

        funs.EndorseTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                operatorID = parseFloat(args[1].toString()),
                launchInfo = "",
                hide = false;
            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            if (args.length > 2) {
                launchInfo = args[2].toString();
            }
            if (args.length > 3) {
                hide = YIUI.TypeConvertor.toBoolean(args[3]);
            }

            YIUI.BPMService.endorseTask(WID, operatorID, launchInfo, hide);
        };

        funs.LaunchTask = function (name, cxt, args) {
            var WID = parseFloat(args[0].toString()) ,
                form = cxt.form, wiInfo = form.getSysExpVals(YIUI.BPMConstants.WORKITEM_INFO),
                nodeKey = args[1].toString(),
                operatorID = args[2],
                launchInfo = args[3].toString(),
                hideActiveWorkitem = args[4];

            var pp = new YIUI.PPObject(operatorID);
//            pp.type = 1;

            if (WID == -1) {
                WID = wiInfo.WorkitemID;
            }
            YIUI.BPMService.launchTask(WID, nodeKey, pp, launchInfo, hideActiveWorkitem);
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
                if( index == -1 ) {
                    index = grid.insertRow(-1);
                }
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
                    oldTable.delAll();
                }
                var parentKey = oldTable.parentKey,parentbkmk = -1;
                if( parentKey ) {
                    parentbkmk = doc.getByKey(parentKey).getBkmk();
                }

                YIUI.DataUtil.append(dataTable, oldTable, parentbkmk);

                if( grid.isSubDetail ) {
                    YIUI.SubDetailUtil.showSubDetailGridData(grid);
                } else {
                    grid.load(false);
                }
            }
        }
    }

    {
        funs.GetSvrUsers = function (name,cxt,args) {
            var form = cxt.form;
            var mode = 1;
            if( args.length > 0  ) {
                mode = YIUI.TypeConvertor.toInt(args[1]);
            }

            YIUI.RemoteService.getSvrUser(form.formKey,mode).then(function (doc) {
                form.setDocument(doc);
                var totalCount = YIUI.TotalRowCountUtil.getRowCount(doc,"AMOUNT");
                form.setPara("AMOUNT",totalCount);
                form.showDocument();
            });
        };

        funs.KickOffOperator = function (name, cxt, args) {
            var mode = -1;
            if( args.length > 0  ) {
                mode = YIUI.TypeConvertor.toInt(args[0]);
            }
            var clientID = YIUI.TypeConvertor.toString(args[1]);
            var params = {
                service: "SessionRights",
                cmd: "KickOffOperator",
                loginMode: mode,
                client: clientID
            };
            Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
        };

    }

    {// 附件相关公式
        funs.UploadAttachment = function (name, cxt, args) {

            var fileOID = YIUI.TypeConvertor.toLong(args[0]);
            var tableKey = YIUI.TypeConvertor.toString(args[1]);
            var maxSize = -1;
            if (args.length > 2) {
                maxSize = YIUI.TypeConvertor.toLong(args[2]);
            }
            var allowedTypes;
            if (args.length > 3 && args[3]) {
                allowedTypes = YIUI.TypeConvertor.toString(args[3]).split(";");
            }
            var quickSave = false;
            if (args.length > 4) {
                quickSave = YIUI.TypeConvertor.toBoolean(args[4]);
            }
            var refresh = true;
            if (args.length > 5) {
                refresh = YIUI.TypeConvertor.toBoolean(args[5]);
            }
            var seriesPath = "";
            if (args.length > 6) {
                seriesPath = YIUI.TypeConvertor.toString(args[6]);
            }
            var callback = "";
            if (args.length > 7) {
                callback = YIUI.TypeConvertor.toString(args[7]);
            }
            var provider = "";
            if (args.length > 8) {
                provider = YIUI.TypeConvertor.toString(args[8]);
            }

            var form = cxt.form,doc = form.getDocument();
            var table = doc.getByKey(tableKey);

            var parentTable = doc.getByKey(table.parentKey);
            var poid = parentTable ? parentTable.getByKey(YIUI.SystemField.OID_SYS_KEY) : -1;
            var path = "";

            // 取到当前行数据的附件path,用于删除
            var gridInfo = form.getGridInfoByTableKey(tableKey),grid,row;
            if( gridInfo ) {
                grid = form.getComponent(gridInfo.key);
            }

            if( table.tableMode == YIUI.TableMode.DETAIL ) {
                if( grid && refresh ) {
                    row = grid.getRowDataAt(cxt.rowIndex);
                    if( row && !YIUI.GridUtil.isEmptyRow(row) ){
                        table.setByBkmk(row.bkmkRow.getBookmark());
                        path = table.getByKey(YIUI.Attachment_Data.PATH);
                    }
                }
            } else {
                table.first();
                path = table.getByKey(YIUI.Attachment_Data.PATH);
            }

            var getNeedFillFields = function (grid) {

                var fields = [],
                    metaCell,
                    detailRow = grid.getDetailMetaRow();

                for( var i = 0;metaCell = detailRow.cells[i];i++ ) {
                    if( !metaCell.hasDB || !YIUI.SystemField.isSystemField(metaCell.columnKey) )
                        continue;

                    fields.push(metaCell.columnKey);
                }

                return fields;
            }

            var mergeData = function (src,tgt) {

                var colInfo,
                    value,
                    type;

                var needMerge = function (field) {
                    if( tgt.tableMode == YIUI.TableMode.DETAIL ) {
                        return YIUI.SystemField.isSystemField(field);
                    }
                    return YIUI.Attachment_Data.isAttachmentField(field);
                }

                for(var i = 0,size = table.cols.length;i < size;i++){
                    colInfo = table.getCol(i);

                    if( !colInfo.key || !needMerge(colInfo.key) )
                        continue;

                    value = src.getByKey(colInfo.key);
                    tgt.setByKey(colInfo.key,value == undefined ? null : value);
                }
            }

            var success = function (data) {
                var result = YIUI.DataUtil.fromJSONDataTable(data);
                if ( !result.first() ) return;
                if( table.tableMode == YIUI.TableMode.DETAIL ) {
                    if( grid && refresh && row ) {
                        if( YIUI.GridUtil.isEmptyRow(row) ) {
                            table.addRow(true);
                            var viewRow = new YIUI.DetailRowBkmk();
                            viewRow.setBookmark(table.getBkmk());
                            row.bkmkRow = viewRow;
                        }
                        table.setByBkmk(row.bkmkRow.getBookmark());

                        mergeData(result,table);

                        if( quickSave )
                            table.setState(DataDef.R_Normal);

                        if( parentTable )
                            table.setParentBkmk(parentTable.getBkmk());

                        grid.getHandler().fillRowData(form,grid,table,cxt.rowIndex,getNeedFillFields(grid));

                        if( grid.newEmptyRow ){
                            grid.appendAutoRowAndGroup();
                        }

                    }
                } else {
                    table.first();

                    mergeData(result,table);

                    if( refresh ) {
                        var com = form.getCompByDataBinding(tableKey,name);
                        if( com ) {
                            com.setValue(table.getByKey(name),false,true);
                        }
                    }
                }
                if( callback ) {
                    form.eval(callback,new View.Context(form));
                }
            }

            var options = {
                service: "UploadAttachment",
                formKey: form.formKey,
                operatorID: $.cookie("userID"),
                fileID: fileOID,
                poid: poid == null ? -1 : poid,
                quickSave: quickSave,
                oid: form.getOID(),
                tableKey: tableKey,
                provider:provider,
                path: path == null ? "" : path,
                seriesPath: seriesPath,
                mode: 1,
                maxSize:maxSize,
                types: allowedTypes,
                success: success
            }

            if( window.up_target ) {
                window.up_target.change(function(){
                    options.file = $(this);
                    YIUI.FileUtil.ajaxFileUpload(options);
                });
            } else {
                YIUI.FileUtil.uploadFile(options);
            }
            return true;
        };

        funs.DownloadAttachment = function (name, cxt, args) {
            var form = cxt.form;

            var tableKey = YIUI.TypeConvertor.toString(args[1]);

            var path = "";
            if( args.length > 2 ) {
                path = YIUI.TypeConvertor.toString(args[2]);
            }

            var provider = "";
            if (args.length > 3) {
                provider = YIUI.TypeConvertor.toString(args[3]);
            }

            // 如果给定路径,使用给定路径,否则从数据表中取得
            if( !path ) {
                var doc = form.getDocument(), tbl = doc.getByKey(tableKey);
                if( tbl.tableMode == YIUI.TableMode.DETAIL ) {
                    var gridInfo = form.getGridInfoByTableKey(tableKey);
                    var grid = form.getComponent(gridInfo.key);
                    var row = grid.getRowDataAt(cxt.rowIndex);
                    if (YIUI.GridUtil.isEmptyRow(row))
                        return;
                    tbl.setByBkmk(row.bkmkRow.getBookmark());
                } else {
                    tbl.first();
                }
                path = tbl.getByKey(YIUI.Attachment_Data.PATH);
            }

            if( !path )
                return;

            var options = {
                formKey: form.formKey,
                tableKey: tableKey,
                provider:provider,
                path: path,
                mode:1,
                service:'DownloadAttachment'
            };

            YIUI.FileUtil.downLoadFile(options);

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

            var provider = "";
            if (args.length > 3) {
                provider = YIUI.TypeConvertor.toString(args[3]);
            }

            if( !path ) {
                var doc = form.getDocument(),tbl = doc.getByKey(tableKey);
                var gridInfo  = form.getGridInfoByTableKey(tableKey);
                var grid = form.getComponent(gridInfo.key);
                var row = grid.getRowDataAt(cxt.rowIndex);
                if( YIUI.GridUtil.isEmptyRow(row) )
                    return;
                tbl.setByBkmk(row.bkmkRow.getBookmark());
                path = tbl.getByKey("Path");
            }

            var paras = {
                fileID: fileOID,
                formKey: form.formKey,
                tableKey: tableKey,
                provider: provider,
                path: path,
                service: "DeleteAttachment"
            };

            Svr.SvrMgr.deleteAttachment(paras);

            var grid = form.getGridInfoByTableKey(tableKey);
            grid = form.getComponent(grid.key);

            grid.deleteGridRow(cxt.rowIndex);
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
                    oldTable.delAll();
                }
                YIUI.DataUtil.append(dataTable, oldTable);
                grid.load(true);
            }
        };

        //启动单个定时器
        funs.StartTimerTask = function (name,cxt,args) {
            var form = cxt.form,timerKey = args[0];
            var timercol = form.timerTask;
            if (timerKey != null && timercol[timerKey].enable != true) {
                var endtimercol = {};
                var timers;
                for ( var T in timercol ) {
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
        funs.IsTimerTaskStarted = function (name,cxt,args) {
            var form = cxt.form,timerKey = args[0];
            if (timerKey != null) {
                var timercol = form.timerTask;
                for ( var T in timercol ) {
                    if (timercol[T].key == timerKey) {
                        return timercol[T].enable;
                    }
                }
            }

        };

        //停止单个定时器
        funs.StopTimerTask = function (name,cxt,args) {
            var form = cxt.form,timerKey = args[0];
            if (timerKey != null) {
                var timercol = form.timerTask;
                var timernow = timerArray;
                for ( var T in timernow ) {
                    if (T == form.formID+timerKey) {
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
                    //jsonObj.form.OID = OID;
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
                NoPrefix :NoPrefix
            }
            var newSequence = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
            return newSequence;

        };

        funs.GetUIAgent = function (name, cxt, args) {
            return "webbrowser";
        };
        
        funs.LocaleString = function (name, cxt, args) {
        	var form = cxt.form;
        	var formKey = form.getFormKey();
            var group = args[0];
            var key = args[1];
            var values = [];
            var params = {
                service: "LocaleString",
                formKey: formKey,
                group: group,
                key : key,
                paras: $.toJSON(values)
            }
            var str = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
            if (!str) {
            	YIUI.ViewException.throwException(YIUI.ViewException.NO_LOCALE_STRING_DEFINED);
            }
            return str;
        };
        
        funs.LocaleParaFormat = function (name, cxt, args) {
        	var form = cxt.form;
        	var formKey = form.getFormKey();
            var group = args[0];
            var key = args[1];
            var values = [];
            for (var i = 2, len = args.length; i < len; i++) {
                values.push(args[i]);
            }
            var params = {
                service: "LocaleString",
                formKey: formKey,
                group: group,
                key : key,
                paras: $.toJSON(values)
            }
            var str = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, params);
            if (!str) {
            	YIUI.ViewException.throwException(YIUI.ViewException.NO_LOCALE_STRING_DEFINED);
            }
            return str;
        };
		
        funs.HasParent = function (name, cxt, args) {
            return cxt.form.getParentForm()!=null;
        };
		
        funs.LocaleFormat = funs.LocaleParaFormat;
    }
    return funs;
})();



