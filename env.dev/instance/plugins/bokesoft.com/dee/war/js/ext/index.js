Ext.require( [ '*' ]);
/**
 * Logo
 */
var logo = Ext
		.create(
				'Ext.Component',
				{
					width : '100%',
					region : 'north',
					height : 48,
					//html : "<div style='background-image: url(images/head_bg.jpg)'><img src=images/head_pic_01.jpg><img src=images/head_pic_02.jpg></div>"
					html : "<div style='background:url(images/head_bg.jpg) repeat-x; height:42px;'><a href=\"index.jsp\"><img  "
							+ "style='float:left' src=images/head_pic_01.jpg></a><img style='float:right;' "
							+ "src=images/head_pic_02.jpg><div style='float:right;"
							+ " margin-top:25px; font-size:12px; color:#FFFFFF;'>"
							+ licType
							+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目名称："
							+ projectName
							+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"
							+ username
							+ "，您好 &nbsp;&nbsp;</span><a href='logout.jsp' "
							+ "style='color:#FFFFFF'>退出</a></div></div>"
				});
/**
 * 全局变量
 */
var O = o();
var WORKDIR = 'workDir';

var comboxHttpMethod;
var comboxHttpContentType;
var comboxTranscationType;
var comboxBoolean;
var comboExchangeType;
var bodyLoadingMask;
/**
 * 分辨率全局 高度和宽度
 * 相对十四寸的倍率
 */
var bokedee_width;
var bokedee_height;
var needToFill = '<font style=\"color:red\">'+'*'+'</font>';


// 整个这段为了支持 IE11
if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) { // is IE11
    Ext.apply(Ext, {
        isIE : false, // cosmetic, since it's false by default for IE11
        isIE11: true,
        ieVersion: 11
    });


    Ext.override(Ext.layout.container.Container, {
        getLayoutTargetSize : function() {
            var target = this.getTarget(),
                ret;


            if (target) {
                ret = target.getViewSize();


                // IE in will sometimes return a width of 0 on the 1st pass of getViewSize.
                // Use getStyleSize to verify the 0 width, the adjustment pass will then work properly
                // with getViewSize
                if ((Ext.isIE || Ext.isIE11) && ret.width == 0){ 
                    ret = target.getStyleSize();
                }


                ret.width -= target.getPadding('lr');
                ret.height -= target.getPadding('tb');
            }
            return ret;
        }
    });
}
////
/**
 * OnReady 当页面元素加载完后从这里执行
 */
Ext.onReady(function() {
	
	if(remainingDays<=90){
		Ext.Msg.alert("提示","<font size=4>您的证书即将过期,请尽快更新新的证书，请联系博科相关人员进行咨询!</font>");
	}
	// 所有ajax调用默认 超时时间都为 10分钟
	Ext.Ajax.timeout = 600000;
	
	permission = Ext.decode(permission);
	comboxHttpMethod = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'POST',
			text : 'POST'
		}, {
			id : 'GET',
			text : 'GET'
		} ]
	});
	comboxHttpContentType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'multipart/form-data',
			text : 'multipart/form-data'
		}, {
			id : 'application/x-www-form-urlencoded',
			text : 'application/x-www-form-urlencoded'
		}, {
			id : 'text/plain',
			text : 'text/plain'
		} ]
	});
	comboxTranscationType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'BEGIN_OR_JOIN',
			text : 'BEGIN_OR_JOIN'
		}, {
			id : 'ALWAYS_BEGIN',
			text : 'ALWAYS_BEGIN'
		} ]
	});
	comboxBoolean = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'true',
			text : '是'
		}, {
			id : 'false',
			text : '否'
		} ]
	});
	comboxProLanguage = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'java',
			text : 'Java'
		}, {
			id : '.net',
			text : '.net'
		} ]
	});
	comboxExcelType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : '2003',
			text : '2003'
		}, {
			id : '2007',
			text : '2007'
		} ]
	});
	comboxScopeType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [{
			id : '请选择',
			text : '请选择'
		}, {
			id : 'inbound',
			text : 'INBOUND'
		}, {
			id : 'outbound',
			text : 'OUTBOUND'
		}, {
			id : 'session',
			text : 'SESSION'
		}, {
			id : 'invocation',
			text : 'INVOCATION'
		}]
	});
	comboxStringStreamByteType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'string',
			text : '字符串_String'
		}, {
			id : 'stream',
			text : '输入流_InputStream'
		}, {
			id : 'byte',
			text : '字节数组_Byte'
		}]
	});
	comboExchangeType = Ext.create('Ext.data.Store', {
		model : 'Combox',
		data : [ {
			id : '请选择',
			text : '请选择'
		}, {
			id : 'request-response',
			text : 'request-response'
		}, {
			id : 'one-way',
			text : 'one-way'
		} ]
	});
	bodyLoadingMask = new Ext.LoadMask(Ext.getBody(), {
		msg : "正在操作,请稍后...",
		msgCls : 'z-index:10000;'
	});
	Ext.QuickTips.init();
	bokedee_width=window.screen.width/1280;
	bokedee_height=window.screen.height/800;
	if(bokedee_width>1||bokedee_height>1){
		bokedee_width=1;
		bokedee_height=1;
	}
	
	var index_viewPort = Ext.create('Ext.container.Viewport', {
		layout : 'border',
		renderTo : Ext.getBody(),
		items : [ logo, left, bottom, right, center ]
	});
	changePanel(center_welcome());
	left.add(left_accordion());
	//left.items.items[4].expand();
});