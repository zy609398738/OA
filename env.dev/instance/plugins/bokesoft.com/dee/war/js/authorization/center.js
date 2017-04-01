function center_welcome() {
	var p = Ext.create('Ext.Panel', {
				id : 'center_welcome',
				border : 1,
				height : '100%',
				width : '100%',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [Ext.create('Ext.Component',{
											height : '100%',
											flex : 1,
											autoEl : {
												html : "<img border='0' src='images/index.jpg' width='100%' height='100%'>"
											}
										})]
			});
	return p;
}

var center = Ext.create('Ext.Panel', {
			region : 'center',
			animate : true,
			id : 'center',
			collapsible : false,
			border : 1
		});