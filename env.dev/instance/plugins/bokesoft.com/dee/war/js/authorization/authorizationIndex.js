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
					html : "<div style='background:url(images/head_bg.jpg) repeat-x; height:42px;'><a href=\"AuthorizationIndex.jsp\"><img  "
							+ "style='float:left' src=images/head_pic_01.jpg></a><img style='float:right;' "
							+ "src=images/head_pic_02.jpg><div style='float:right;"
							+ " margin-top:25px; font-size:12px; color:#FFFFFF;'>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>"
							+ "<a href='javascript:void(0);' onclick='exit()' style='color:#FFFFFF'>退出</a>"
							+ "</div></div>"
				});
/**
 * 全局变量
 */
/**
 * 分辨率全局 高度和宽度
 * 相对十四寸的倍率
 */
var bokedee_width;
var bokedee_height;

////
/**
 * OnReady 当页面元素加载完后从这里执行
 */
Ext.onReady(function() {

	// 所有ajax调用默认 超时时间都为 10分钟
		Ext.Ajax.timeout = 600000;
		Ext.QuickTips.init();
		bokedee_width = window.screen.width / 1280;
		bokedee_height = window.screen.height / 800;
		if (bokedee_width > 1 || bokedee_height > 1) {
			bokedee_width = 1;
			bokedee_height = 1;
		}

		var index_viewPort = Ext.create('Ext.container.Viewport', {
		layout : 'border',
		renderTo : Ext.getBody(),
		items : [ logo, left, center ]
		});
		changePanel(center_welcome());
	});


function exit(){
	Ext.Ajax.request( {
				url : 'authorizationRegistrationController.do?actionType=exit',
				success : function(response) {
					var result = Ext.decode(response.responseText);
					if (result.result == true) {
						window.open('AuthorizationLogin.jsp', '_self');
					} else {
						Ext.Msg.alert('失败', result.data);
					}
				},
				failure : function(response) {
					Ext.Msg.alert('失败', result.data);
				}
			});
}