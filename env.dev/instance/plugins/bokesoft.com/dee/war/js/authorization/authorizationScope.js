Ext.require( [ '*' ]);

Ext.onReady(function() {
		Ext.Ajax.timeout = 600000;
		var p = authorizationuserpanel();
		Ext.QuickTips.init();
		var index_viewPort = Ext.create('Ext.container.Viewport', {
//			layout : 'fit',
			align : 'center',
			renderTo : Ext.getBody(),
			items : [ p ]
		});
		var client_id = Ext.urlDecode(location.search.substring(1)).client_id;
		Ext.Ajax.request({
					url : 'authorizationController.do?actionType=getEndTime',
					params : {
								client_id : client_id,
							 },
					success : function(response) {
						var result = Ext.decode(response.responseText);
						if(result.result == true){
							Ext.getCmp('enddate').setValue(result.data);
						}else{
							Ext.getCmp('enddate').setValue(new Date());
						}
					},
					failure : function(response) {
						Ext.Msg.alert('失败', result.data);
					}
				});
	});
function authorizationuserpanel() {
	var username = Ext.urlDecode(location.search.substring(1)).username;
	var tbar_items =[{
					text : '授权',
					scale : 'small',
					width : 50,
					icon : 'images/add.png',
					handler : function() {
			    			var enddate = Ext.getCmp('enddate').rawValue;
			    			var response_type = Ext.urlDecode(location.search.substring(1)).response_type;
			    			var client_id = Ext.urlDecode(location.search.substring(1)).client_id;
			    			var client_secret = Ext.urlDecode(location.search.substring(1)).client_secret;
			    			var redirect_uri = Ext.urlDecode(location.search.substring(1)).redirect_uri;
			    			var treeRoot = getCmp('authorizationScopePanel').items.items[1].store.tree.root;
							var treeJson = convertTreeStoreToData(treeRoot);
							var scope = {
									ScopeList : treeJson
								};
							Ext.Ajax.request({
								url : 'authorizationController.do?actionType=authorization',
								params : {
											enddate : enddate,
											response_type : response_type,
											client_id : client_id,
											client_secret : client_secret,
											redirect_uri : redirect_uri,
											scope : Ext.encode(scope)
										 },
								success : function(response) {
									var result = Ext.decode(response.responseText);
									if(result.result == true){
										alert('授权成功！');
										if(!redirect_uri.startsWith("http://")&&!redirect_uri.startsWith("https://")){
											redirect_uri = "http://"+redirect_uri;
										}
										window.open(redirect_uri+'?code='+ result.data.code +'' , '_self');
									}else{
										if(result.data == '请先登录！'){
											alert(result.data);
											window.open('AuthorizationAppLogin.jsp', '_self');
										}else{
											Ext.Msg.alert('失败',result.data);
										}
									}
								},
								failure : function(response) {
									Ext.Msg.alert('失败', response.responseText);
								}
							});
						}
					},{
						text : '返回',
						scale : 'small',
						width : 50,
						handler : function() {
							window.open('AuthorizationAppLogin.jsp', '_self');
						}
					}];

	//获取接口服务树
//	var jkpz_tree_storeURL = 'interfaceInfoFindController.do?actionType=findCheckedJkpzTreeStore';
	var client_id = Ext.urlDecode(location.search.substring(1)).client_id;
	var jkpz_tree_storeURL = 'authorizationController.do?actionType=findAuthorizedTreeStore';
	var jkpz_tree_store = Ext.create('Ext.data.TreeStore', {
				id : 'jkpz_tree_store',
//				fields : ['id', 'text', 'name', 'description', 'enable'],
				proxy : {
					type : 'ajax',
					url : jkpz_tree_storeURL,
					extraParams : {
						client_id : client_id,
					}
				},
				autoload : true
			});
	var jkpz_tree = Ext.create('Ext.tree.Panel', {
				id : 'jkpz_tree',
				rootVisible : false,
				useArrows : true,
//				tbar : tbar_items,
//				width : '100%',
				height : '100%',
				flex : 1,
				store : jkpz_tree_store,
				listeners : {
					checkchange : function(node, checked) {
						doTreeCheckChange(node, checked);
					}
				}
			});
	
	f = new Ext.form.FormPanel(
				{
					defaultType : 'textfield',
					labelAlign : 'right',
					labelWidth : 100,
					labelPad : 0,
//					frame : true,
					flex : 1,
					height : '100%',
					tbar : tbar_items,
					defaults : {
						width : 350
					},
					items : [{
								id : 'enddate',
								name : 'enddate',
								fieldLabel : '截至日期',
								xtype : 'datefield',
//								value : new Date(),
								editable : false
							}]
				});
	
	
//外部panel
	var p = Ext.create('Ext.Panel', {
				id : 'authorizationScopePanel',
				title : '授权验证',
				draggable : false,
				resizable : false,
//				tbar : tbar_items,
				border : 0,
				width : '100%',
				height : '100%',
			    layout : {
			          type : 'hbox',
			          align : 'stretch'
			      },
				items : [f,jkpz_tree]
			});
	return p;
}

