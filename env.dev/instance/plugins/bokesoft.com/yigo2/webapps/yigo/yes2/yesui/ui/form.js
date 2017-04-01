/**
 * User: chenzs
 * Date: 14-2-14
 * Time: 下午2:58
 * 整个界面对象，包含所有信息
 */
YIUI.Form = YIUI.extend({
    init: function (metaForm) {
    	this.OID = -1;
    	this.formID = YIUI.Form_allocFormID();
    	this.metaForm = metaForm;
        this.setOperationState(metaForm.initState == YIUI.Form_OperationState.Edit ? metaForm.operationState : metaForm.initState);
        
        this.type = metaForm.type;
        this.operations = metaForm.operations;
        this.metaOpts = metaForm.metaOpts;
        this.defTbr = metaForm.defTbr;
        this.formKey = metaForm.formKey;
        this.caption = metaForm.caption;
        this.abbrCaption = metaForm.abbrCaption;
        this.formulaCaption = metaForm.formulaCaption;
        this.formulaAbbrCaption = metaForm.formulaAbbrCaption;
        this.target = metaForm.target;
        this.mainTableKey = metaForm.mainTableKey;
        this.onLoad = metaForm.onLoad;
        var rootObj = metaForm.root;
        this.standalone = metaForm.standalone;
        this.relations = metaForm.relations;
        this.macroMap = metaForm.macroMap;
        this.statusItems = metaForm.statusItems;
        this.paraGroups = metaForm.paraGroups;
        this.sysExpVals = metaForm.sysExpVals;
//        this.filterMap = metaForm.filterMap;
        this.dependency = metaForm.dependency;
        this.paras = metaForm.paras;
        this.callParas = metaForm.callParas;
        this.paraCollection = metaForm.paraCollection;
        this.checkRules = metaForm.checkRules;
        this.subDetailInfo = metaForm.subDetailInfo;
        this.mapGrids = metaForm.mapGrids;
        this.errorInfo = metaForm.errorInfo;
        this.dataObjectKey = metaForm.dataObjectKey;
        this.refObjectKey = metaForm.refObjectKey;
        this.refTableKey = metaForm.refTableKey;
        this.postShow = metaForm.postShow;
        this.parser = new View.Parser(this);
        this.uiProcess = new YIUI.UIProcess(this);
        this.viewDataMonitor = new YIUI.ViewDataMonitor(this);
        this.defaultUIStatusProxy = new YIUI.DefaultStatusProxy(this);
        this.result = null;
        this.eventList = {};
        this.timerTask = metaForm.timerTask;
        this.metaComps = metaForm.metaComps;
        this.metaCells = metaForm.metaCells;
        this.metaOpts = metaForm.metaOpts;

        this.popWidth = metaForm.popWidth;
        this.popHeight = metaForm.popHeight;
        this.topMargin = metaForm.topMargin;
        this.bottomMargin = metaForm.bottomMargin;
        this.leftMargin = metaForm.leftMargin;
        this.rightMargin = metaForm.rightMargin;

        var options = {
            form: this,
            rootObj: rootObj
        };
        this.formAdapt = new YIUI.FormAdapt(options);

        this.defaultUIStatusProxy = new YIUI.DefaultStatusProxy(this);
        var workitemInfo = this.sysExpVals ? this.sysExpVals[YIUI.BPMConstants.WORKITEM_INFO] : null;
        if (workitemInfo != null) {
            this.hostUIStatusProxy = new YIUI.HostStatusProxy(workitemInfo);
        }

        var fm = new FilterMap();
        fm.setOID(this.getOID());
        var map = this.formAdapt.LVMap.concat(this.formAdapt.gridMap);
        for (var i = 0, len = map.length; i < len; i++) {
        	var key = map[i].key;
            var tableKey = map[i].tableKey;

            if(tableKey){
                var comp = this.getComponent(key);
                var meta = comp.getMetaObj();

                var controlType = meta.type;

                var loadType =  YIUI.PageLoadType.NONE;
                if(controlType == YIUI.CONTROLTYPE.LISTVIEW){
                    loadType = comp.loadType;
                }else if (controlType == YIUI.CONTROLTYPE.GRID){
                    loadType = meta.pageLoadType;
                }

                loadType = meta.pageLoadType
            
                if(loadType == YIUI.PageLoadType.DB) {
                    var tblKey = meta.tableKey;
                    var tblDetail = new TableFilterDetail();
                    tblDetail.setTableKey(tblKey);
                    tblDetail.setStartRow(0);
                    tblDetail.setMaxRows(meta.pageRowCount);
                    tblDetail.setPageIndicatorCount(5);
                    fm.addTblDetail(tblDetail);
                } 
            }

		}
        this.filterMap = fm;
        
        YIUI.FormStack.addForm(this);
    },
    
    getRadios: function(groupKey) {
    	return this.formAdapt.getRadios(groupKey);
    },

    isError:function () {
        return this.errorInfo.error;
    },
    
    getCaption: function() {
    	var caption = "";
		var formula = this.formulaCaption;
		if (formula) {
            var cxt = new View.Context(this);
			caption = this.eval(formula, cxt);
		}
		if (!caption) {
			caption = this.caption;
		}
		return caption;
    },
    
    getAbbrCaption: function() {
    	var abbr = "";
		var formula = this.formulaAbbrCaption;
		if (formula) {
            var cxt = new View.Context(this);
			abbr = this.eval(formula, cxt);
		}
		if (!abbr) {
			abbr = this.abbrCaption;
		}
		if (!abbr) {
			abbr = this.getCaption();
		}
		return abbr;
    },
    
    doOnLoad: function() {
        var onLoad = this.onLoad;
        if(onLoad) {
            var cxt = new View.Context(this);
        	this.eval(onLoad, cxt);
        }

    	this.doOptQueue();
    },
    
    setOptQueue: function(optQueue) {
    	this.optQueue = optQueue;
    },
    
    doOptQueue: function() {
        var optQueue = this.optQueue;
        if(optQueue) {
			optQueue.doOpt();
        }
    },

    setOperationEnable:function (key,enable) {
        var defTbr = this.defTbr;
        var tbr = this.getComponent(defTbr);
        if( !tbr )
            return;
        tbr.setItemEnable(key,enable);
    },

    setOperationVisible:function (key,visible) {
        var defTbr = this.defTbr;
        var tbr = this.getComponent(defTbr);
        if( !tbr )
            return;
        tbr.setItemVisible(key,visible);
    },
    
    getMetaComp: function(key) {
    	return this.metaComps[key];
    },
    
    getMetaOpt: function(key) {
    	return this.metaOpts[key];
    },
    
    getMetaCell: function(key) {
    	return this.metaCells[key];
    },
    
    setOID: function(oid) {
    	this.OID = oid;
        this.filterMap.setOID(oid);
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

    getFormAdapt: function () {
        return this.formAdapt;
    },
    
    addOpt: function(tbr, expOpts, optMap) {
    	if(!expOpts || !expOpts.items) return;
    	var items = expOpts.items;

        var metaTbl = tbr.getMetaObj();
        var metaItems = metaTbl.metaItems;
        $.extend(metaItems, expOpts.metaItems)
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
		
        var metaTbl = tbr.getMetaObj();
        var metaItems = metaTbl.metaItems;
        
		this.hasMerge = false;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			delete optMap[item.key];
	        delete metaItems[item.key];
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
    setCaption: function (caption) {
        this.caption = caption;
    },
    getCaption: function () {
        return this.caption;
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
    newDocument: function() {
        var params = {
    		cmd: "NewDocument",
            formKey: this.getFormKey()
        };
        return Svr.SvrMgr.getDocument(params);
    },
    showDocument: function () {
        var showData = new YIUI.ShowData(this);
        showData.show();
        if(!this.rendered) {
        	this.render();
        }
        if(this.postShow) {
        	var cxt = {form: this};
        	this.eval(this.postShow, cxt);
        }
    	$(".loading").hide();
    },
    setWillShow: function(show) {
    	this.show = show;
    },
    willShow: function() {
    	return this.show;
    },
    setShowing: function(showing) {
    	this.showing = showing;
    },
    showing: function() {
    	return this.showing();
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
    // setOperationEnable: function (key, enable) {
    //     var opts = this.getOptMap();
    //     var opt = opts[key];
    //     var barKey = opt.barKey;
    //     var toolbar = this.getComponent(barKey);
    //     toolbar.setItemEnable(key, enable);
    // },
    resetUIStatus: function (mask) {
        this.uiProcess.resetUIStatus(mask);
    },
    getUIProcess: function () {
        return this.uiProcess;
    },
    getViewDataMonitor:function(){
        return this.viewDataMonitor;
    },
    setDefContainer: function (defContainer) {
        this.formAdapt.setDefContainer(defContainer);
    },
    getDefContainer: function () {
        return this.formAdapt.getDefContainer(this.defCtKey);
    },
    setContainer: function (container) {
        var self = this;
        this.formAdapt.setContainer(container);
//        self.initFirstFocus();
    },
    render: function() {
    	var ct = this.getContainer();
		ct && ct.renderDom();
        if(this.defCtKey) {
        	var ct = this.getComponent(this.defCtKey);
        	ct && this.setDefContainer(ct);
        }
        this.rendered = true;
        var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
        errDiv.prependTo(this.getRoot().el);
        this.setErrDiv(errDiv);
    },
    getContainer: function () {
        return this.formAdapt.getContainer();
    },
    newCxt: function () {
        var cxt = new View.Context(this);
        return cxt;
    },
    getRelations: function () {
        return this.dependency.relations;
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
            if (comp.crFocus && $.isNumeric(comp.tabOrder) && comp.tabOrder != -1) {
                this.tabCompList.push(comp);
            }
        }
        this.tabCompList.sort(function (comp1, comp2) {
            return comp1.tabOrder - comp2.tabOrder;
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

YIUI.MetaForm = YIUI.extend({
	init: function (jsonObj) {
        this.operationState = jsonObj["operationState"] ? jsonObj["operationState"] : YIUI.Form_OperationState.Default;
        this.initState = jsonObj["initState"] || YIUI.Form_OperationState.Default;
        this.type = jsonObj["type"];
        this.operations = jsonObj["operations"];
        this.metaOpts = jsonObj["metaOpts"];
        this.defTbr = jsonObj["defTbr"];
        this.formKey = jsonObj["key"];
        this.caption = jsonObj["caption"];
        this.abbrCaption = jsonObj["abbrCaption"];
        this.formulaCaption = jsonObj["formulaCaption"];
        this.formulaAbbrCaption = jsonObj["formulaAbbrCaption"];
        this.target = jsonObj["target"];
        this.mainTableKey = jsonObj["mainTableKey"];
        this.onLoad = jsonObj["onLoad"];
        var body = jsonObj["body"];
        var indexOfblock = body["index_of_block"];
        var block = body["items"][indexOfblock];

        var root = block["root"];
        root.topMargin = jsonObj["topMargin"];
        root.bottomMargin = jsonObj["bottomMargin"];
        root.leftMargin = jsonObj["leftMargin"];
        root.rightMargin = jsonObj["rightMargin"];
        root.abbrCaption = jsonObj["abbrCaption"];
        root.hAlign = jsonObj["hAlign"];
        root.height = "100%";
        this.root = root;
        this.standalone = jsonObj["standalone"] || false;
        this.relations = jsonObj["relations"];
        this.macroMap = jsonObj["macroMap"];
        this.statusItems = jsonObj["statusItems"];
        this.paraGroups = jsonObj["paraGroups"];
        this.sysExpVals = jsonObj["sysExpVals"];
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
        this.timerTask = jsonObj["timerTask"];
        this.metaComps = jsonObj["metaComps"] || {};
        this.metaCells = jsonObj["metaCells"] || {};
        
        this.popWidth = jsonObj["popWidth"];
        this.popHeight = jsonObj["popHeight"];
        this.topMargin = jsonObj["topMargin"];
        this.bottomMargin = jsonObj["bottomMargin"];
        this.leftMargin = jsonObj["leftMargin"];
        this.rightMargin = jsonObj["rightMargin"];
        
    },
    
    getComponent: function(key) {
    	return this.metaComps[key];
    }
});