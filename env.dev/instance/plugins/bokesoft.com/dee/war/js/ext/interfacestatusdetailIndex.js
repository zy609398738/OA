Ext.Loader.setConfig({
			enabled : true
		});
Ext.require(['Ext.grid.*', 'Ext.data.*', 'Ext.util.*',
		'Ext.grid.PagingScroller']);
Ext.require(['*']);

//整个这段为了支持 IE11
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
 * Logo
 */
var logo = Ext.create('Ext.Component', {
	width : '100%',
	region : 'north',
	height : 48,
	// html : "<div style='background-image: url(images/head_bg.jpg)'><img
	// src=images/head_pic_01.jpg><img src=images/head_pic_02.jpg></div>"
	html : "<div style='background:url(images/head_bg.jpg) repeat-x; height:42px;'><img  "
			+ "style='float:left' src=images/head_pic_01.jpg><img style='float:right;' "
			+ "src=images/head_pic_02.jpg><div style='float:right;"
			+ " margin-top:25px; font-size:12px; color:#FFFFFF;'>项目名称："
			+ projectName
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"
			+ username
			+ "，您好 &nbsp;&nbsp;</span><a href='logout.jsp' "
			+ "style='color:#FFFFFF'>退出</a></div></div>"
});

function ajaxSyncCall(url, params, method) {
	changeToLogin();
	if (!method)
		method = 'POST';
	var obj;
	var value;
	if (window.ActiveXObject) {
		obj = new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		obj = new XMLHttpRequest();
	}
	obj.open(method, url, false);
	obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	obj.send(params);
	return obj.responseText;
}
Ext.onReady(function() {
	// 所有ajax调用默认 超时时间都为 10分钟
	Ext.Ajax.timeout = 600000;
	bodyLoadingMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "正在操作,请稍后...",
				msgCls : 'z-index:10000;'
			});
	var menucenter = Ext.create('Ext.Panel', {
				region : 'center',
				id : 'menucenter',
				collapsible : false,
				border : 1
			});
	var isNosql = true;
	var url = 'interfaceLog2DatasourceController.do?actionType=getLogDatasouceId';
	var result = Ext.decode(ajaxSyncCall(url));
	if (result.result && result.data != '') {// 界面选择的不是nosql数据库
		isNosql = false;
	}
	var left_tree = Ext.create('Ext.tree.Panel', {
				id : 'left_tree',
				rootVisible : false,
				frame : false,
				useArrows : true,
				loadMask : true,
				border : 0,
				height : '100%',
				root : {
					text : 'Root',
					expanded : true,
					children : [{
								text : '日志查询',
								leaf : true
							}, {
								text : '日志删除',
								leaf : true
							}]
				},
				listeners : {
					itemclick : function(view, record) {
						// alert(record.raw.text);
						menucenter.removeAll();
						var p
//						if (isNosql) {
//							if ('日志查询' == record.raw.text) {
//								p = centerfinddatapanel();
//
//							} else if (('日志删除' == record.raw.text)) {
//								p = centerdeletedatapanel();
//							}
//						} else {
							if ('日志查询' == record.raw.text) {
								p = centerdslogmanagerpanel();
							} else if (('日志删除' == record.raw.text)) {
								p = centerdeletedslogmanagerpanel();
							}
//						}
						menucenter.add(p);
					}
				}
			});
	var index_viewPort = Ext.create('Ext.container.Viewport', {
				layout : 'border',
				margins : '5 0 0 5',
				renderTo : Ext.getBody(),
				items : [logo, {
							xtype : 'panel',
							title : '主菜单',
							region : 'west',
							id : 'menu',
							border : 1,
							width : '10%',
							layout : 'fit',
							items : [left_tree]
						}, menucenter]
			})
});