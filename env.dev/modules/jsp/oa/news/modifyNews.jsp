<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String _COMMAND = "subsys_SCM_OA_NewsDraft";
String WEB_BILLID = request.getParameter("WEB_BILLID");
String _ENTRY_EXP = "ExtraValueSet(WEB_BILLID,"+WEB_BILLID+")+ExtraValueSet(EntryFlag,2)+_FormInitialize()+RunUIOpt(Edit)";
String CTX_ROOT = request.getContextPath();
String YIGO_PAGE_ID = ("_CMS_" + java.util.UUID.randomUUID()).replace('-', '_');
String BILL_DOM_ID = "HX_DefaultWebView";
%>
<head>
<title>�༭����</title>   
<!-- ######################################################################## -->
<!-- Yigo ���� js/css ��Դ���ο� web2/portal.jsp -->
<!-- jquery css -->
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/jquery/jquery-ui-1.10.3.custom/css/flick/jquery-ui-1.10.3.custom.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/css/jquery.fileupload.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/jquery/jquery.hoverscroll/jquery.hoverscroll.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/jquery/vex-master/css/vex.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/jquery/vex-master/css/vex-theme-os.css" />
<link rel="stylesheet" media="screen" href="<%=CTX_ROOT%>/web2/jqGrid/css/ui.jqgrid.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/js/intro.js-0.8.0/introjs.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/YIGO.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/YIGO.icon.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/patchUI.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/portal.css" />
<link rel="stylesheet" href="<%=CTX_ROOT%>/web2/css/search.css" />
<!-- yigo lib -->
<script src="<%=CTX_ROOT%>/web2/YIGO-all-debug.js" ></script>
<script>
	if (!YIGO.Options)
		YIGO.Options={};
	YIGO.Options.ReBuildToolBar=false;
	YIGO.Options.SearchToolBar=false;
</script>
<!-- CKEditor -->
<script src="<%=CTX_ROOT%>/js/ckeditor_4.4.3_pack/ckeditor.js" ></script>
<!-- jquery lib -->
<script src="<%=CTX_ROOT%>/js/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js" ></script>
<!-- jquery-ui lib -->
<script src="<%=CTX_ROOT%>/js/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js" ></script>
<!-- jqGrid lib -->
<script src="<%=CTX_ROOT%>/web2/jqGrid/js/i18n/grid.locale-en.js" ></script>
<script src="<%=CTX_ROOT%>/web2/jqGrid/js/jquery.jqGrid.src.js" ></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/tmpl.min.js"></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.fileupload.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-process.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-ui.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-jquery-ui.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.fileupload-validate.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jQuery-File-Upload-master/js/jquery.iframe-transport.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jquery-ui-1.10.3.custom/js/jquery.ui.datepicker-zh-CN.min.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/timepicker/jquery-ui-timepicker.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/jquery.hoverscroll/jquery.hoverscroll.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/migrate/migrate.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/vex-master/js/vex.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/vex-master/js/vex.dialog.js" ></script>
<script src="<%=CTX_ROOT%>/js/jquery/autosize/jquery.autosize.min.js" ></script>
<!-- adapter -->
<script src="<%=CTX_ROOT%>/web2/adapter/jqueryui/YIGO.ui.ControlUI.js" ></script>
<script src="<%=CTX_ROOT%>/web2/adapter/jqueryui/YIGO.ui.ControlVM.js" ></script>
<script src="<%=CTX_ROOT%>/web2/adapter/jqueryui/YIGO.ui.portal.ComponentImpl.js" ></script>
<!-- FIXME: web2/script/lib/main.js רΪ portal.jsp ���, ��˲���ʹ��
<script data-main='main.js' src="<%=CTX_ROOT%>/web2/script/require.js"></script>
 -->
<script src="<%=CTX_ROOT%>/web2/script/require.js"></script>
<script>
	require.config({
		baseUrl:'<%=CTX_ROOT%>/web2/script/lib',
		paths:{
		},
		shim:[{
		}]
	});
	//FIXME: ����ԭ web2/script/lib/main.js ���õ�����
	if(!$.browser.msie || ($.browser.version=="6.0" || $.browser.version=="7.0" ||$.browser.version=="8.0")){
		require(['css!controls/checkbox/bootstrap/bootstrapcheckbox.css','css!controls/radiobox/bootstrap/bootstrapradiobox.css']);
	}
</script>
<!-- Yigo ���� js/css ��Դ���ο� web2/portal.jsp | END -->
<!-- ######################################################################## -->

<!-- ######################################################################## -->
<!-- CMS Yigo ��װ -->
<script>
var CMSYigo = (function() {
    // �ж��Ƿ�Ϊ�ն���
    var isEmpty = function(obj) {
        for (var n in obj) {
            return false;
        }
        return true;
    };
    // YIGO.SingleContainerApplication����
    var CMS_YIGOBLOCK_APP = null;
    // ��Ⱦλ�ñ�ʶ
    var CMS_CONTAINER_MSG = {};
    // contextID��container�Ĺ���
    var CMS_CTX_CONTAINER = {};
    // ��дYigo.ui.Messages.RUNJAVASCRIPT
    YIGO.ui.GlobalMessageBus.unsubscribe(YIGO.ui.Messages.RUNJAVASCRIPT);
    YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.RUNJAVASCRIPT,function(messageData){
        var context = YIGO.getContext(messageData.context);
        if(context && context == YIGO.getActiveContext()){
            eval(messageData.data.content);
        }else if (context && CMS_YIGOBLOCK_APP){ 
            if (CMS_YIGOBLOCK_APP.hasContext(context.getId())) {
                eval(messageData.data.content);
            }    
        }
    });
    //�������� portal.js ��һЩ�����¼��Ĵ���
    YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.ERROR,function(messageData){
        if (YIGO.DebugUtil.cmdError) {
            YIGO.DebugUtil.cmdError(messageData.data);
        } else {
            YIGO.DebugUtil.alert(messageData.data);
        }
        if(messageData.data.errorCode==10000003){ //��¼��ʱ
            YIGO.Util.forward('about:blank'); //FIXME: ��ת�� about:blank ���Ѹ�������
        }
        if(messageData.data.errorCode==10000004){ //���ݳ�ʱ
            YIGO.ui.GlobalMessageBus.publish(YIGO.ui.Messages.CLOSETAB, {
                context:messageData.context
            });
        }
    });
    YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.LOGOUT,function(){
        YIGO.YIGO_C_ENV.initSession();
        window.onbeforeunload = null;
        //window.top.location.reload();
        YIGO.Util.forward('about:blank');
    });
    YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.TIMEOUT,function(){
        YIGO.YIGO_C_ENV.initSession();
        window.onbeforeunload = null;
        window.top.location.reload();
        //YIGO.Util.forward('about:blank');
    });

    // ��дYigo.SingleContainerApplication�����еĲ��ַ���
    YIGO.apply(YIGO.ui.Application.prototype,{
        // ���һ����ȾԪ��λ�õķ���
        dealAppDispath : function(containerSign){
            // SHOWVIEW ֮ǰ��������һ����ʶ,����viewҪ��Ⱦ��λ��
            if (containerSign.indexOf(":") != -1) {
                var containerKey = containerSign.split(':')[0];
                var containerVal = containerSign.split(':')[1];
                CMS_CONTAINER_MSG.key = containerKey;
                CMS_CONTAINER_MSG.val = new YIGO.ui.SingleContextContainer({container:$Yg(containerVal)});
            } else {
                alert('��ʽ����ȷ');
            }
        },
        // ���setBillContainer
        setBillContainer:function(metaKey, container){
            if (container) 
                this.billContainer[metaKey] = new YIGO.ui.SingleContextContainer({container:container});
        },
        // ��дaddSingletonBill
        addSingletonBill:function(entryName,contextID){
            var newContextID = contextID;
            if(!newContextID)
                newContextID = YIGO.Util.getClientId() + "_" + entryName;
            this.singletonBill[entryName] = newContextID;
            if (this.singletonContext.indexOf(newContextID) == -1) 
                this.singletonContext.push(newContextID);
        },
        // ��дonMessageShowView
        onMessageShowView:function(messageData){
            if(!messageData.context || !messageData.viewer){// �����Ϣ�е�Context����Ϊ��,����Ϣ�ǷǷ���
                return;
            }
            var container = null;
            // ָ������Ⱦλ��
            if (!isEmpty(CMS_CONTAINER_MSG)) {
                CMS_YIGOBLOCK_APP.addSingletonBill(CMS_CONTAINER_MSG.key, messageData.context);
                CMS_YIGOBLOCK_APP.setBillContainer(CMS_CONTAINER_MSG.key, CMS_CONTAINER_MSG.val);
                CMS_CTX_CONTAINER[messageData.context] = CMS_CONTAINER_MSG.val;
                container = CMS_CONTAINER_MSG.val;
                CMS_CONTAINER_MSG = {};
            }
            if(!this.isBillProcessByThisApp(messageData)){
                return;
            }
            
            var context = YIGO.getContext(messageData.context);
            var ct = null;
            if(context){
                ct = context.container;
            }else{
                var container = CMS_CTX_CONTAINER[messageData.context];
                context = new YIGO.ui.BillContext(messageData.context);
                this.contexts.push(context.getId());
                ct = container.addContext(messageData,context);
                context.setContainer(ct);
                this.contextContainerMapping[context.contextID] = container;
                if(this.xtypeMapping[messageData.context]) {
                    context.xtypeMapping = this.xtypeMapping[messageData.context];
                }
            }
            var container = CMS_CTX_CONTAINER[messageData.context];
            container.changeContextTitle(messageData.context,messageData.data.billform.__title);
            var layout = this.getBillLayout(messageData.context);
            var vmLayout = true;
            if(YIGO.isEmpty(layout) || (!YIGO.isEmpty(layout) && messageData.data.billform.iswindow)){
                vmLayout = false;
            }
            context.setContainer(ct);
            this.activeContext = context;
            if (this.setActiveAfterShow && !context.parentContext) {
                YIGO.setActiveContext(context);
            }
            var view = YIGO.UICache.findViewById(context.contextID,messageData.viewer);
            if(vmLayout){
                $(ct).append(this.getBillLayout(messageData.context));
            }
            this._renderView(view,messageData.data,{isVMLayout:vmLayout});
        }
    });
    YIGO.isContextActive=function(ctx){
        if(YIGO.getActiveContext()==ctx)
            return true;
        if(CMS_YIGOBLOCK_APP.hasContext(ctx.getId())){
            return true;
        }
        return false;
    };

// ��װ�Լ��Ķ���
    var CMS = {};
    CMS.apply = function(o, c, defaults){
        if(defaults){
            CMS.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    };
    
    var CMS_YIGO = function(config) {
        CMS.apply(this, config);
    }

    CMS.apply(CMS_YIGO.prototype, {
        sign : new YIGO.UUID().toString(),
        entryExp : '',
        CID: '_CID',
        Appliaction:null,
        // ��ڲ��� setEntry
        setEntry : function(entryExp) {
            YIGO_C_ENTRYEXP = entryExp;
        }, 
        // ����APP
        init : function() {
            if (CMS_YIGOBLOCK_APP)
                return;
            CMS_YIGOBLOCK_APP = new YIGO.ui.Application({
                setActiveAfterShow : true,
                container:new YIGO.ui.SingleContextContainer({container:$Yg('body')}),
                billContainer : {},
                isBillProcessByThisApp:function(data){
                    if(this.singletonContext.include(data.context))    
                        return true;
                    return false;
                }
            });
            this.Appliaction=CMS_YIGOBLOCK_APP;
            return CMS_YIGOBLOCK_APP;
        },
        // render
        doRender : function(sign, containerID, command) { // ��ʶ��domԪ��ID��command(menu entry��)
            var contextID = sign + this.CID;
            CMS_YIGOBLOCK_APP.setBillContainer(sign, $Yg(containerID));
            CMS_YIGOBLOCK_APP.addSingletonBill(sign, contextID); 
            CMS_CTX_CONTAINER[contextID] = new YIGO.ui.SingleContextContainer({container:$Yg(containerID)});
            //CMS_YIGOBLOCK_APP.doEntry(command, contextID);
            CMS_YIGOBLOCK_APP.doCommand(command, contextID);
        },
        // layout
        setLayout : function(sign, layoutContainer) {
            var contextID = sign + this.CID;
            if (CMS_CTX_CONTAINER[contextID] && layoutContainer) {
                CMS_YIGOBLOCK_APP.addBillLayout(contextID, layoutContainer);
            }
        },
        // �Զ���ؼ�
        registerXtype : function(sign, YigoID, xTypeObj) {
            var contextID = sign + this.CID;
            if (CMS_CTX_CONTAINER[contextID] && !isEmpty(xTypeObj) && CMS_YIGOBLOCK_APP.getBillLayout(contextID)) {
                CMS_YIGOBLOCK_APP.addXtypeMapping(contextID, YigoID, xTypeObj);
            }
        },
        // ִ��uiopt���� 
        doUIOpt : function(sign, optKey) {
            var contextID = sign + this.CID;
            if (contextID && optKey && CMS_CTX_CONTAINER[contextID]) {
                YIGO.UIOptCenter.doUIOpt(optKey, contextID);
            }
        },
        showBill : function () {
            YIGO_C_ENTRYEXP = this.entryExp;
            this.init();
            this.doRender(this.sign, this.containerID, this.command);
            this.setLayout(this.sign, this.layoutContainer);
            this.registerXtype(this.sign, this.YigoID, this.xTypeObj);
        }
    })
    return CMS_YIGO;
})();
</script>
<!-- CMS Yigo ��װ | END -->
</head>
<body>
<!-- ######################################################################## -->
<!--
<div class="top_menu">
    <div id="titlebar">
          <span></span>
    </div>
</div>
-->
<script type="text/javascript">
$(function(){
    var MAIN_BILL_DIV_ID = "main_container<%=YIGO_PAGE_ID%>_CID";   //��һ�������ص� YigoBill �� DIV �� ID ������ <%=YIGO_PAGE_ID%> ��ص�
    var currentBillDivID = null;
    setInterval(function(){
        var $billForm = $(".map-billform");
        if ($billForm && $billForm.length>=1){
            var tmpDivId = $($billForm[$billForm.length-1]).attr("id"); //�ڳ��ֵ������ڵ������, .map-billform ����� 1 ��, ��ʱ�����������Ǹ�
            if ( tmpDivId != currentBillDivID){
                currentBillDivID = tmpDivId;
                $(window).trigger("billFormSwitch", [tmpDivId, MAIN_BILL_DIV_ID==tmpDivId]);
            }
        }
    }, 200);
});
</script>
<div class="bill-box">
	<div id="<%=BILL_DOM_ID%>" style="height:100%;width:100%"></div>
</div>
<script type="text/javascript">
$(function(){
    var divSelector = "#<%=BILL_DOM_ID%>";
    
    var height;
    if (! height){
        var pageHeight = (document.compatMode == "CSS1Compat"?document.documentElement.clientHeight:document.body.clientHeight);                     
    }
    if (height < 600){
        height = 600;   //����ҳ��̫С
    }
    $(divSelector).css("height", height+"px");

    //��ʾ Yigo ��������
    var cmsYigo = new CMSYigo({
        sign: "<%=YIGO_PAGE_ID%>",
        containerID: "<%=BILL_DOM_ID%>",
        command: "<%=_COMMAND%>",
        entryExp: "<%=_ENTRY_EXP%>"
    });        
    cmsYigo.showBill();
    
    //������ʾ������ڵı���
    $(window).on("billFormSwitch", function(event, billFormDivId, isFirstBillForm){
        var titleDiv = $("#titlebar");
        var titlebarSubArea = titleDiv.children()[1];   //���Բ��� titlebar ����ĵڶ�����Ԫ��
        if (! isFirstBillForm){
            var context = YIGO.getActiveContext();
            var title = context.getBillViewer().billForm.getTitle();
            if(titlebarSubArea){
                $(titlebarSubArea).text(" / " + title);
            }else{
                titleDiv.append("<span style='font-size:0.8em'> / "+title+"</span>");
            }
        }else{
            if(titlebarSubArea){
                $(titlebarSubArea).text("");
            }
        }
    });
});
</script>
</body>