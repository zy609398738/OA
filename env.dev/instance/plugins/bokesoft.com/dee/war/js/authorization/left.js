var left_tree_storeURL = 'authorizationRegistrationController.do?actionType=findMenu';
var left_tree_store= Ext.create('Ext.data.TreeStore', {
				id : 'left_tree_store',
				proxy : {
					type : 'ajax',
					url : left_tree_storeURL,
				},
				autoload : true
			});
var left = Ext.create('Ext.tree.Panel', {
				id : 'left',
				title : '主菜单',
				rootVisible : false,
				region : 'west',
				collapsible : true,
				split : true,
				width : 230,
				useArrows : true,
				store : left_tree_store,
				listeners : {
					itemclick : function(view, record) {
						doMenuClick(record);
					}
				}
			});