/**
 * User: chenzs
 * Date: 14-2-14
 * Time: 下午2:58
 * 整个界面对象，包含所有信息
 */
YIUI.Form = YIUI.extend({
    init: function (jsonObj) {
        this.operationState = jsonObj["operationState"] ? jsonObj["operationState"] : YIUI.Form_OperationState.Default;
        this.initOperationState = jsonObj["initOperationState"] || YIUI.Form_OperationState.Default;
        this.type = jsonObj["type"];
        this.mergeOpt = jsonObj["mergeOpt"];
        this.options = jsonObj["options"];
        this.defTbr = jsonObj["defTbr"];
        this.OID = jsonObj["OID"] || -1;
        this.formID = jsonObj["formID"] || YIUI.Form_allocFormID();
        this.formKey = jsonObj["key"];
        this.formCaption = jsonObj["caption"];
        this.abbrCaption = jsonObj["abbrCaption"];
        this.target = jsonObj["target"];
        this.pFormID = jsonObj["parentID"];
        this.mainTableKey = jsonObj["mainTableKey"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];

        var rootPanelObj = block["rootPanel"];
        rootPanelObj.topMargin = jsonObj["topMargin"];
        rootPanelObj.bottomMargin = jsonObj["bottomMargin"];
        rootPanelObj.leftMargin = jsonObj["leftMargin"];
        rootPanelObj.rightMargin = jsonObj["rightMargin"];
        rootPanelObj.abbrCaption = jsonObj["abbrCaption"];
        rootPanelObj.hAlign = jsonObj["hAlign"];
        rootPanelObj.height = "100%";
        var options = {
            formID: this.formID,
            rootPanelObj: rootPanelObj,
            defCtKey: jsonObj["defCtKey"]
        };
        this.formAdapt = new YIUI.FormAdapt(options);
        this.standalone = jsonObj["standalone"] || false;
        this.relations = jsonObj["relations"];
        this.macroMap = jsonObj["macroMap"];
        this.statusItems = jsonObj["statusItems"];
        this.paraGroups = jsonObj["paraGroups"];
        this.sysExpVals = jsonObj["sysExpVals"];
        this.filterMap = jsonObj["filterMap"] === undefined ? null : new FilterMap(jsonObj["filterMap"]);
        this.dependency = jsonObj["dependency"];
        this.paras = new YIUI.Paras(jsonObj["parameters"]);
        this.callParas = new YIUI.Paras(jsonObj["callParameters"]);
        this.paraCollection = jsonObj["paraCollection"];
        this.checkRules = jsonObj["checkRules"];
        this.subDetailInfo = jsonObj["subDetailInfo"];
        this.mapGrids = jsonObj["mapGrids"];
        this.errorInfo = {error: jsonObj["isError"], errorMsg: jsonObj["errorMsg"], errorSource: jsonObj["errorSource"]};
        this.dataObjectKey = jsonObj["dataObjectKey"] || null;
        this.refObjectKey = jsonObj["refObjectKey"] || null;
        this.refTableKey = jsonObj["refTableKey"] || null;
        this.postShow = jsonObj["postShow"] || null;
        this.parser = new View.Parser(this);
        this.uiProcess = new YIUI.UIProcess(this);
        this.viewDataMonitor = new YIUI.ViewDataMonitor(this);
        this.result = null;
        this.eventList = {};
        this.timerTask = jsonObj["timerTask"];
        this.defaultUIStatusProxy = new YIUI.DefaultStatusProxy(this);
        var workitemInfo = this.sysExpVals ? this.sysExpVals[YIUI.BPMConstants.WORKITEM_INFO] : null;
        if (jsonObj["hostUIStatusProxy"] && workitemInfo != null) {
            this.hostUIStatusProxy = new YIUI.HostStatusProxy(workitemInfo);
        }
        YIUI.FormStack.addForm(this);
    },
    
    getOID: function() {
        var document = this.getDocument();
        if(document) {
        	return document.oid;
        } else {
        	return this.OID;
        }
    },
    
    setSysExpVals: function(key, value) {
    	if (!this.sysExpVals) {
			this.sysExpVals = {};
		}
		this.sysExpVals[key] = value;
    },
    
    getSysExpVals: function(key) {
    	if (this.sysExpVals) {
			return this.sysExpVals[key];
		}
		return null;
    },

    isStandalone: function () {
        return this.standalone;
    },
    setResult: function (result) {
        this.result = result;
    },
    getResult: function () {
        return this.result;
    },

    setAbbrCaption: function (abbrCaption) {
        this.abbrCaption = abbrCaption;
    },
    getAbbrCaption: function () {
        return this.abbrCaption;
    },

    getFormAdapt: function () {
        return this.formAdapt;
    },
    
    addOpt: function(tbr, expOpts, optMap) {
    	var items = expOpts.items;
    	for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			item.formID = expOpts.formID;
			tbr.items.push(item);
			optMap[item.key] = {
				barKey: this.defTbr, 
				opt: item
			};
		}
		this.cFormID = expOpts.formID;
		this.hasMerge = true;
    },
    
    delOpt: function(tbr, expOpts, optMap) {
    	var items = expOpts.items;
		var len = items.length;
		var len2 = tbr.items.length;
		tbr.items.splice(len2 - len, len);
		this.hasMerge = false;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			delete optMap[item.key];
		}
    },

    getOptMap: function () {
    	var optMap = this.formAdapt.getOptMap();
    	var expOpts = this.expOpts;
        if(this.mergeOpt) {
        	var defTbr = this.defTbr;
        	var tbr = this.getComponent(defTbr);
        	if(this.cFormID) {
        		var cFormID = expOpts.formID;
    			var cForm = YIUI.FormStack.getForm(cFormID);
    			this.delOpt(tbr, expOpts, optMap);
        		if(!cForm) {
    				this.cFormID = null;
        		} else {
    				expOpts.formID = cForm.formID;
    				this.addOpt(tbr, expOpts, optMap);
        		}
        	} else if(!this.hasMerge) {
    			this.addOpt(tbr, expOpts, optMap);
        	}
        }
      return optMap;
    },
    setError: function (error, errorMsg, errorSource) {
        this.errorInfo = {error: error, errorMsg: errorMsg, errorSource: errorSource};
        if (error) {
            this.showErrMsg(errorMsg);
        } else {
            this.hideErrMsg();
        }
    },
    getCellSubDtlComps: function (gridKey, cellKey) {
        var map = this.formAdapt.getCellSubDtlCompMap();
        if (map == null) return null;
        var gridMap = map[gridKey];
        if (gridMap == null) return null;
        return gridMap[cellKey];
    },
    getGridInfoMap: function () {
        return this.formAdapt.getGridMap();
    },
    getGridInfoByTableKey: function (tableKey) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.tableKey == tableKey) {
                return grid;
            }
        }
    },
    getGridInfoByKey: function (key) {
        var gridMap = this.getGridInfoMap(), grid;
        for (var i = 0, len = gridMap.length; i < len; i++) {
            grid = gridMap[i];
            if (grid.key == key) {
                return grid;
            }
        }
    },
    getListView: function (arg) {
        return this.formAdapt.getListView(arg);
    },

    diff: function (jsonObj) {
        this.operationState = jsonObj["operationState"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];
        var rootPanelObj = block["rootPanel"];
        this.sysExpVals = jsonObj.sysExpVals;
        this.getRoot().diff(rootPanelObj);
        this.setError(jsonObj["isError"], jsonObj["errorMsg"], jsonObj["errorSource"]);
    },

    getComponentList: function () {
        return this.formAdapt.getCompList();
    },
    getComponent: function (comKey) {
        return this.formAdapt.getComp(comKey);
    },
    getPanel: function (key) {
        return this.formAdapt.getPanel(key);
    },
    setFormKey: function (formKey) {
        this.formKey = formKey;
    },
    getFormKey: function () {
        return this.formKey;
    },
    setFormCaption: function (formCaption) {
        this.formCaption = formCaption;
    },
    getFormCaption: function () {
        return this.formCaption;
    },
    getDataObjectKey: function () {
        return this.dataObjectKey;
    },
    getRoot: function () {
        return this.formAdapt.getRoot();
    },
    setDocument: function (document) {
        this.document = document;
    },
    getDocument: function () {
        return this.document;
    },
    showDocument: function () {
        var showData = new YIUI.ShowData(this);
        return showData.show();
    },
    setComponentValue: function (key, value, fireEvent) {
        this.formAdapt.setCompValue(key, value, fireEvent);
    },
    setCellValByIndex: function (key, rowIndex, colIndex, value, fireEvent) {
        this.formAdapt.setCellValByIndex(key, rowIndex, colIndex, value, fireEvent);
    },
    getCellValByIndex: function (key, rowIndex, colIndex) {
        return this.formAdapt.getCellValByIndex(key, rowIndex, colIndex);
    },
    setCellValByKey: function (key, rowIndex, colKey, value, fireEvent) {
        this.formAdapt.setCellValByKey(key, rowIndex, colKey, value, fireEvent);
    },
    getCellValByKey: function (key, rowIndex, colKey) {
        return this.formAdapt.getCellValByKey(key, rowIndex, colKey);
    },
    getComponentValue: function (key, cxt) {
    	var cellLocation = this.formAdapt.getCellLocation(key);
        var comp, value;
        if (cellLocation) {
            if (cxt == null) return null;
            comp = this.formAdapt.getComp(cellLocation.key);
            if (comp.type == YIUI.CONTROLTYPE.LISTVIEW) {
                return comp.getValue(cxt.rowIndex, cellLocation.column);
            } else if (comp.type == YIUI.CONTROLTYPE.GRID) {
                return comp.getValueAt(cxt.rowIndex, cellLocation.column);
            }
            var dataTable = this.getDocument().getByKey(cellLocation.tableKey);
            var rowIndex = cxt.rowIndex;
            dataTable.setPos(rowIndex);
            return dataTable.getByKey(cellLocation.columnKey);
        } else {
            comp = this.formAdapt.getComp(key);
            if (comp == undefined) {
                YIUI.ViewException.throwException(YIUI.ViewException.NO_COMPONENT_KEY, key);
            }
            value = comp.getValue();
            return value;
        }
    },
    getCellLocation: function (key) {
        return this.formAdapt.getCellLocation(key);
    },
    setFilterMap: function (filterMap) {
        this.filterMap = filterMap;
    },
    getFilterMap: function () {
        return this.filterMap;
    },
    getMainTableKey: function () {
        return this.mainTableKey;
    },
    setCondParas: function (conParas) {
        this.conParas = conParas;
    },
    getCondParas: function () {
        return this.conParas == null ? {} : this.conParas;
    },
    setInitOperationState: function (initOperationState) {
        this.initOperationState = initOperationState;
    },
    getInitOperationState: function () {
        return this.initOperationState;
    },
    setOperationState: function (operationState) {
        this.operationState = operationState;
    },
    getOperationState: function () {
        return this.operationState;
    },
    setOperationEnable: function (key, enable) {
        var toolbar = this.getComponent(this.defTbr);
        if( !toolbar )
            return;
        toolbar.setItemEnable(key, enable);
    },
    resetUIStatus: function (mask) {
        this.uiProcess.resetUIStatus(mask);
    },
    getUIProcess: function () {
        return this.uiProcess;
    },
    getViewDataMonitor: function() {
      return this.viewDataMonitor;
    },
    setDefContainer: function (defContainer) {
        this.formAdapt.setDefContainer(defContainer);
    },
    getDefContainer: function () {
        return this.formAdapt.getDefContainer()
    },
    setContainer: function (container) {
        var self = this;
        this.formAdapt.setContainer(container);
        self.initFirstFocus();
    },
    getContainer: function () {
        return this.formAdapt.getContainer();
    },
    newCxt: function () {
        return {form: this};
    },
    getRelations: function () {
        return this.relations;
    },
    setPara: function (key, value) {
        this.paras.put(key, value);
    },
    getPara: function (key) {
        return this.paras.get(key);
    },
    setCallPara: function (key, value) {
        this.callParas.put(key, value);
    },
    getCallPara: function (key) {
        return this.callParas.get(key);
    },
    getParaCollection: function () {
        return this.paraCollection;
    },
    getParas: function () {
        if (this.paras == undefined) {
            this.paras = {};
        }
        return this.paras;
    },
    getCallParas: function () {
        if (this.callParas == undefined) {
            this.callParas = {};
        }
        return this.callParas;
    },
//    setWorkitemInfo: function (workitemInfo) {
//        this.workitemInfo = workitemInfo;
//    },
//    getWorkitemInfo: function () {
//        return this.workitemInfo;
//    },
    setErrDiv: function (errDiv) {
        this.errDiv = errDiv;
        var self = this;
        window.setTimeout(function () {
            if (!self.isDestroyed) {
                self.setError(self.errorInfo.error, self.errorInfo.errorMsg, self.errorInfo.errorSource);
            }
        }, 0);
    },
    showErrMsg: function (msg) {
        if (!this.errDiv || this.errDiv.css("display") == "block") return;
        $("label", this.errDiv).text(msg);
        this.errDiv.show();
        var newH = this.getRoot().getHeight() - this.errDiv.height();
        var newW = this.getRoot().getWidth();
        this.getRoot().doLayout(newW, newH);
    },
    hideErrMsg: function () {
        if (!this.errDiv || this.errDiv.css("display") == "none") return;
        this.errDiv.hide();
        var newH = this.getRoot().getHeight();
        var newW = this.getRoot().getWidth();
        this.getRoot().doLayout(newW, newH);
    },
    reloadTable: function (key) {
        var document = this.getDocument();
        var filterMap = this.getFilterMap();
        filterMap.setType(YIUI.DocumentType.DETAIL);
        var condParas = this.getCondParas();
        var paras = {};
        paras.service = "PureOpt";
        paras.cmd = "ReloadTable";
        paras.tableKey = key;
        paras.formKey = this.formKey;
        paras.filterMap = $.toJSON(filterMap);
        paras.condParas = $.toJSON(condParas);
        var table = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras);
        if (table) {
            document.remove(key);
            document.add(key, table);
        }
    },
    initFirstFocus: function () {
        var self = this;
        var container = this.getContainer();
        var $el;
        if (container) {
            if (container[0] && container[0].tagName) {
                $el = container;
            } else {
                $el = container.container.el || container.container;
            }
        } else {
            $el = this.getRoot().container.el;
        }
        var tabList = this.getTabCompList(), comp = null;
        for (var i = 0, len = tabList.length; i < len; i++) {
            comp = tabList[i];
            if (comp == undefined || comp == null) continue;
            var tabPanel = $(comp.el).parents(".ui-tabs-panel");
            var isActive = (tabPanel.length > 0 && tabPanel[0].style.display !== "none") || (tabPanel.length == 0);
            if (comp.enable && comp.visible && isActive) {
                switch (comp.type) {
                    case YIUI.CONTROLTYPE.GRID:
                        comp.initFirstFocus();
                        break;
                    default:
                        comp.focus();
                        break;
                }
                break;
            }
        }
    },
    getParentForm: function () {
        return YIUI.FormStack.getForm(this.pFormID);
    },
    fireClose: function () {
        if (this.type != YIUI.Form_Type.Entity) {
            this.close();
            return true;
        }

        if (this.operationState == YIUI.Form_OperationState.Default || this.operationState == YIUI.Form_OperationState.Delete) {
            this.close();
            return true;
        }
        var options = {
            msg: "是否确定要关闭界面？",
            msgType: YIUI.Dialog_MsgType.YES_NO
        };
        var dialog = new YIUI.Control.Dialog(options);
        dialog.render();
        var $form = this;
        dialog.regEvent(YIUI.Dialog_Btn.STR_YES, function () {
            $form.close();
        });
        dialog.regEvent(YIUI.Dialog_Btn.STR_NO, function () {
        });
    },
    close: function () {
        var callback = this.getEvent(YIUI.FormEvent.Close);
        if (callback) {
            callback.doTask(this, null);
        }
        if (this.target == 2) {
            $("#" + this.formID).close();
            YIUI.FormStack.removeForm(this.formID);
        } else {
            this.getContainer().removeForm(this);
        }
    },
    eval: function (formula, context, callback) {
        if (formula) {
            return this.parser.eval(formula, context, callback);
        }
        return null;
    },
    eval2: function(formula, syntaxTree, evalContext, scope) {
    	if ( formula ) {
    		return this.parser.eval2(formula, syntaxTree, evalContext, scope);
    	}
    	return null;
    },
    evalByTree: function (tree, context, callback) {
        if (tree !== null && tree !== undefined) {
            return this.parser.evalByTree(tree, context, callback);
        }
        return null;
    },
    getSyntaxTree: function (script) {
        if (script.length == 0) {
            return null;
        } else {
            return this.parser.getSyntaxTree(script);
        }
    },
    toJSON: function () {
        var json = {};
        var jsonArr = this.formAdapt.toJSON();
        json.key = this.formKey;
        json.items = jsonArr;
        json.filterMap = this.getFilterMap();
        json.condParas = this.getCondParas();
        json.operationState = this.operationState;
        return $.toJSON(json);
    },
    destroy: function () {
        this.uiProcess = null;
        this.parser = null;
        this.document = null;
        this.dependency = null;
        this.isDestroyed = true;
        
//        YIUI.Print.del(this.formKey);
    },

    regEvent: function (key, callback) {
        if (!this.eventList) {
            this.eventList = {};
        }
        this.eventList[key] = callback;
    },

    getEvent: function (key) {
        var event = null;
        if (this.eventList) {
            event = this.eventList[key]
        }
        return event;
    },

    removeEvent: function (key) {
        if (this.eventList) {
            delete this.eventList[key];
        }
    },

    getTabCompList: function () {
        return this.tabCompList
    },
    getFocusManager: function () {
        if (!this.focusManager) {
            this.focusManager = new FocusPolicy(this);
        }
        return this.focusManager;
    },
    dealTabOrder: function () {
        this.tabCompList = [];
        var comp;
        for (var key in this.getComponentList()) {
            comp = this.getComponentList()[key];
            comp.setFocusManager(this.getFocusManager());
            if (comp.getMetaObj().crFocus && $.isNumeric(comp.getMetaObj().tabOrder) && comp.getMetaObj().tabOrder != -1) {
                this.tabCompList.push(comp);
            }
        }
        this.tabCompList.sort(function (comp1, comp2) {
            return comp1.getMetaObj().tabOrder - comp2.getMetaObj().tabOrder;
        });
        var unOrderCompList = [];
        this.getRoot().getNoTabOrderComps(unOrderCompList);
        this.tabCompList = this.tabCompList.concat(unOrderCompList);
        for (var i = 0, len = this.tabCompList.length; i < len; i++) {
            comp = this.tabCompList[i];
            if (comp == undefined) continue;
            comp.setTabIndex(i);
        }
    }
});

//自动生成formID
var formID = 1;
YIUI.Form_allocFormID = function () {
    return formID++;
};

YIUI.MetaForm = function(options) {
//	var meta = function(options) {
//		enable: null,
//		visible: null,
//		checkRule: null
//	};
//	return meta;
};