Ext.define("Ext.calendar.view.Paging", {
    extend: "Ext.toolbar.Paging",
	requires: ['Ext.calendar.data.PageStore'],
    id: 'pagingTool',
    dock: 'bottom',
    displayInfo: true,
    displayMsg: '第 {0} - {1} 条 共 {2} 条',
    emptyMsg: "请输入条件进行查询",
    beforePageText: '第',
    afterPageText: '页  共 {0} 页',
    firstText: '第一页',
    lastText: '最后一页',
    prevText: '上一页',
    nextText: '下一页',
    refreshText: '刷新',

    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'combo',
            store: new Ext.calendar.data.PageStore(),
            fieldLabel: '每页显示',
            fieldCls: 'readOnly',
            labelWidth: 60,
            width: 130,
            value: me._limit,
            displayField: 'limit',
            valueField: 'limit',
            listeners: {
                "change": function (t, p) {
                    limit = this.value;
                    this.up('grid').getStore().pageSize = limit; //设定store每页显示的数量
                    this.up('grid').getStore().currentPage = 1; //设定当前为第一页
                    this.up('grid').getStore().load({
                        params: {
                            start: 0,
                            limit: limit
                        }
                    }); //刷新数据
                }
            }
        }, {
            xtype: 'label',
            text: '条'
        }]

        me.callParent(arguments);
    }
});