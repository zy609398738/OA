<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.URLDecoder"%>
<%@page import="com.bokesoft.myerp.dev.mid.IMidContext"%>
<%@page import="com.bokesoft.myerp.dev.mid.MidContextFactory"%>
<%@page import="com.bokesoft.myerp.common.midproxy.Env"%>
<%@page import="com.bokesoft.myerp.common.rowset.BKRowSet"%>
<%@page import="com.bokesoft.myerp.exception.BKError"%>
<%
String _COMMAND = "subsys_SCM_OA_MessageBoard";
String _ENTRY_EXP = "EExtraValueSet(EntryFlag,2)+RunUIOpt(New)";
String CTX_ROOT = request.getContextPath();
String YIGO_PAGE_ID = ("_CMS_" + java.util.UUID.randomUUID()).replace('-', '_');
String BILL_DOM_ID = "HX_DefaultWebView";
%>
<head>
<title>新增留言</title>   
<!-- ######################################################################## -->
<!-- Yigo 基本 js/css 资源，参考 web2/portal.jsp -->
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
<!-- FIXME: web2/script/lib/main.js 专为 portal.jsp 设计, 因此不能使用
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
	//FIXME: 这是原 web2/script/lib/main.js 有用的内容
	if(!$.browser.msie || ($.browser.version=="6.0" || $.browser.version=="7.0" ||$.browser.version=="8.0")){
		require(['css!controls/checkbox/bootstrap/bootstrapcheckbox.css','css!controls/radiobox/bootstrap/bootstrapradiobox.css']);
	}
</script>
<!-- Yigo 基本 js/css 资源，参考 web2/portal.jsp | END -->
<!-- ######################################################################## -->

<!-- ######################################################################## -->
<!-- CMS Yigo 封装 -->
<script>
var CMSYigo = (function() {
    // 判断是否为空对象
    var isEmpty = function(obj) {
        for (var n in obj) {
            return false;
        }
        return true;
    };
    // YIGO.SingleContainerApplication对象
    var CMS_YIGOBLOCK_APP = null;
    // 渲染位置标识
    var CMS_CONTAINER_MSG = {};
    // contextID与container的关联
    var CMS_CTX_CONTAINER = {};
    // 重写Yigo.ui.Messages.RUNJAVASCRIPT
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
    //复制来自 portal.js 对一些特殊事件的处理
    YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.ERROR,function(messageData){
        if (YIGO.DebugUtil.cmdError) {
            YIGO.DebugUtil.cmdError(messageData.data);
        } else {
            YIGO.DebugUtil.alert(messageData.data);
        }
        if(messageData.data.errorCode==10000003){ //登录超时
            YIGO.Util.forward('about:blank'); //FIXME: 跳转到 about:blank 很难跟踪问题
        }
        if(messageData.data.errorCode==10000004){ //单据超时
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

    // 重写Yigo.SingleContainerApplication对象中的部分方法
    YIGO.apply(YIGO.ui.Application.prototype,{
        // 添加一个渲染元素位置的方法
        dealAppDispath : function(containerSign){
            // SHOWVIEW 之前可以设置一个标识,告诉view要渲染的位置
            if (containerSign.indexOf(":") != -1) {
                var containerKey = containerSign.split(':')[0];
                var containerVal = containerSign.split(':')[1];
                CMS_CONTAINER_MSG.key = containerKey;
                CMS_CONTAINER_MSG.val = new YIGO.ui.SingleContextContainer({container:$Yg(containerVal)});
            } else {
                alert('格式不正确');
            }
        },
        // 添加setBillContainer
        setBillContainer:function(metaKey, container){
            if (container) 
                this.billContainer[metaKey] = new YIGO.ui.SingleContextContainer({container:container});
        },
        // 重写addSingletonBill
        addSingletonBill:function(entryName,contextID){
            var newContextID = contextID;
            if(!newContextID)
                newContextID = YIGO.Util.getClientId() + "_" + entryName;
            this.singletonBill[entryName] = newContextID;
            if (this.singletonContext.indexOf(newContextID) == -1) 
                this.singletonContext.push(newContextID);
        },
        // 重写onMessageShowView
        onMessageShowView:function(messageData){
            if(!messageData.context || !messageData.viewer){// 如果消息中的Context属性为空,则消息是非法的
                return;
            }
            var container = null;
            // 指定了渲染位置
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

// 封装自己的对象
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
        // 入口操作 setEntry
        setEntry : function(entryExp) {
            YIGO_C_ENTRYEXP = entryExp;
        }, 
        // 创建APP
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
        doRender : function(sign, containerID, command) { // 标识、dom元素ID、command(menu entry等)
            var contextID = sign + this.CID;
            CMS_YIGOBLOCK_APP.setBillContainer(sign, $Yg(containerID));
            CMS_YIGOBLOCK_APP.addSingletonBill(sign, contextID); 
            CMS_CTX_CONTAINER[contextID] = new YIGO.ui.SingleContextContainer({container:$Yg(containerID)});
            //CMS_YIGOBLOCK_APP.doEntry(command, contextID);
            CMS_YIGOBLOCK_APP.doCommand(command, null, contextID);
        },
        // layout
        setLayout : function(sign, layoutContainer) {
            var contextID = sign + this.CID;
            if (CMS_CTX_CONTAINER[contextID] && layoutContainer) {
                CMS_YIGOBLOCK_APP.addBillLayout(contextID, layoutContainer);
            }
        },
        // 自定义控件
        registerXtype : function(sign, YigoID, xTypeObj) {
            var contextID = sign + this.CID;
            if (CMS_CTX_CONTAINER[contextID] && !isEmpty(xTypeObj) && CMS_YIGOBLOCK_APP.getBillLayout(contextID)) {
                CMS_YIGOBLOCK_APP.addXtypeMapping(contextID, YigoID, xTypeObj);
            }
        },
        // 执行uiopt操作 
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
<!-- CMS Yigo 封装 | END -->
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
    var MAIN_BILL_DIV_ID = "main_container<%=YIGO_PAGE_ID%>_CID";   //第一个被加载的 YigoBill 的 DIV 的 ID 总是与 <%=YIGO_PAGE_ID%> 相关的
    var currentBillDivID = null;
    setInterval(function(){
        var $billForm = $(".map-billform");
        if ($billForm && $billForm.length>=1){
            var tmpDivId = $($billForm[$billForm.length-1]).attr("id"); //在出现弹出窗口的情况下, .map-billform 会多于 1 个, 此时跟踪最上面那个
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
        height = 600;   //避免页面太小
    }
    $(divSelector).css("height", height+"px");

    //显示 Yigo 单据区域
    var cmsYigo = new CMSYigo({
        sign: "<%=YIGO_PAGE_ID%>",
        containerID: "<%=BILL_DOM_ID%>",
        command: "<%=_COMMAND%>",
        entryExp: "<%=_ENTRY_EXP%>"
    });        
    cmsYigo.showBill();
    
    //跟踪显示层叠窗口的标题
    $(window).on("billFormSwitch", function(event, billFormDivId, isFirstBillForm){
        var titleDiv = $("#titlebar");
        var titlebarSubArea = titleDiv.children()[1];   //尝试查找 titlebar 区域的第二个子元素
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