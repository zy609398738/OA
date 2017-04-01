/*
 * bottom 暂时不改动
 */
var bottom = Ext.create('Ext.Panel', {
	region : 'south',
	id : 'main_bottom',
	collapsible : false,
	collapsed : true,
	hidden : true,
	title : 'bottomssss',
	width : 1332,
	height : 60,
	margins : '0 0 0 0'
});

/**
 * 监听面Bottom板合起事件
 * @param {Object} p
 */
getCmp('main_bottom').on(
		'beforecollapse',
		function(p) {
			getCmp(center.items.keys).height = Ext
					.getCmp(center.items.keys).height
					+ p.height - 25;
			//var component = getCmp(center.items.keys).items;
			//getCmp(component.keys).height = '100%';
		});
/**
 * 监听Bottom展开事件
 * @param {Object} p
 */
getCmp('main_bottom').on(
		'beforeexpand',
		function(p) {
			getCmp(center.items.keys).height = Ext
					.getCmp(center.items.keys).height
					- p.height + 25;
			//var component = getCmp(center.items.keys).items;
			//getCmp(component.keys).height = '100%';
		});
