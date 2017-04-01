Ext.define('Ext.calendar.util.CustomPaging', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.custompaging',
    //alternateClassName: 'Ext.PagingToolbar',
    requires: ['Ext.toolbar.TextItem', 'Ext.form.field.Number', 'Ext.form.field.ComboBox'],
    mixins: {
        bindable: 'Ext.util.Bindable'    
    },
    displayInfo: false,

    prependButtons: false,
    displayMsg : '共{2}条',
    beforePageText : 'Page',
    
    //每页显示
    _limit: 10,
    //</locale>

    //<locale>
    /**
     * @cfg {String} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     * {0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    afterPageText : '{0}',
    //</locale>

    //<locale>
    /**
     * @cfg {String} firstText
     * The quicktip text displayed for the first page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    firstText : '首页',
    //</locale>

    //<locale>
    /**
     * @cfg {String} prevText
     * The quicktip text displayed for the previous page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    prevText : '上一页',
    //</locale>

    //<locale>
    /**
     * @cfg {String} nextText
     * The quicktip text displayed for the next page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    nextText : '下一页',
    //</locale>

    //<locale>
    /**
     * @cfg {String} lastText
     * The quicktip text displayed for the last page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    lastText : '末页',
    //</locale>

    //<locale>
    /**
     * @cfg {String} refreshText
     * The quicktip text displayed for the Refresh button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    refreshText : 'Refresh',
    //</locale>

    /**
     * @cfg {Number} inputItemWidth
     * The width in pixels of the input field used to display and change the current page number.
     */
    inputItemWidth : 30,

    /**
     * Gets the standard paging items in the toolbar
     * @private
     */
    getPagingItems: function() {
        var me = this;
		
		me.states = Ext.create('Ext.data.Store', {
		    fields: ['id', 'limit'],
		    data : [
		        {"id":"1", "limit":"5"},
		        {"id":"2", "limit":"10"},
		        {"id":"3", "limit":"20"},
		        {"id":"4", "limit":"50"}
		    ]
		});

        return [{
        	xtype: 'tbtext', 
        	itemId: 'displayItem'
        }, {
            itemId: 'first',
            text: me.firstText,
            //tooltip: me.firstText,
            //overflowText: me.firstText,
            //iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        },{
            itemId: 'prev',
            text: me.prevText,
            //tooltip: me.prevText,
            //overflowText: me.prevText,
            //iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
        '-',
        /*{
            xtype: 'numberfield',
            itemId: 'inputItem',
            name: 'inputItem',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            allowDecimals: false,
            minValue: 1,
            hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            selectOnFocus: true,
            submitValue: false,
            // mark it as not a field so the form will not catch it when getting fields
            isFormField: false,
            width: me.inputItemWidth,
            margins: '-1 2 3 2',
            listeners: {
                scope: me,
                keydown: me.onPagingKeyDown,
                blur: me.onPagingBlur
            }
        },*/
        {
        	xtype: 'displayfield',
        	itemId: 'afterTextItem'
        },
        '-',
        {
            itemId: 'next',
            text: me.nextText,
            //tooltip: me.nextText,
            //overflowText: me.nextText,
            //iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        },{
            itemId: 'last',
            text: me.lastText,
            //tooltip: me.lastText,
            //overflowText: me.lastText,
            //iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
            disabled: true,
            handler: me.moveLast,
            scope: me
        }, 
       	'->',
       	'每页',
        {
        	xtype: 'combo',
        	width: 50,
		    store: me.states,
		    value: me._limit,
		    queryMode: 'local',
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
        }, 
        '条'
        ];
    },

    initComponent : function(){
        var me = this,
            pagingItems = me.getPagingItems(),
            userItems   = me.items || me.buttons || [];

        if (me.prependButtons) {
            me.items = userItems.concat(pagingItems);
        } else {
            me.items = pagingItems.concat(userItems);
        }
        delete me.buttons;

        if (me.displayInfo) {
            //me.items.push('->');
            //me.items.push({xtype: 'tbtext', itemId: 'displayItem'});
        }

        me.callParent();

        me.addEvents(
            /**
             * @event change
             * Fires after the active page has been changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Object} pageData An object that has these properties:
             *
             * - `total` : Number
             *
             *   The total number of records in the dataset as returned by the server
             *
             * - `currentPage` : Number
             *
             *   The current page number
             *
             * - `pageCount` : Number
             *
             *   The total number of pages (calculated from the total number of records in the dataset as returned by the
             *   server and the current {@link Ext.data.Store#pageSize pageSize})
             *
             * - `toRecord` : Number
             *
             *   The starting record index for the current page
             *
             * - `fromRecord` : Number
             *
             *   The ending record index for the current page
             */
            'change',

            /**
             * @event beforechange
             * Fires just before the active page is changed. Return false to prevent the active page from being changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Number} page The page number that will be loaded on change
             */
            'beforechange'
        );
        me.on('beforerender', me.onLoad, me, {single: true});

        me.bindStore(me.store || 'ext-empty-store', true);
    },
    // @private
    updateInfo : function(){
        var me = this,
            displayItem = me.child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count, msg;

        if (displayItem) {
            count = store.getCount();
            if (count === 0) {
                msg = me.emptyMsg;
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                );
            }
            displayItem.setText(msg);
        }
    },

    // @private
    onLoad : function(){
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText,
            count,
            isEmpty;

        count = me.store.getCount();
        isEmpty = count === 0;
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;
            afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
        } else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(me.afterPageText, 0);
        }

        Ext.suspendLayouts();
        //me.child('#afterTextItem').setValue(afterText);
        me.child('#afterTextItem').setValue(me.getLink(me.store, currPage, afterText));
        //me.child('#inputItem').setDisabled(isEmpty).setValue(currPage);
        me.child('#first').setDisabled(currPage === 1 || isEmpty);
        me.child('#prev').setDisabled(currPage === 1  || isEmpty);
        me.child('#next').setDisabled(currPage === pageCount  || isEmpty);
        me.child('#last').setDisabled(currPage === pageCount  || isEmpty);
        //me.child('#refresh').enable();
        me.updateInfo();
        Ext.resumeLayouts(true);

        if (me.rendered) {
            me.fireEvent('change', me, pageData);
        }
    },
    
    getLink : function(st, curr, val){
    	var result = "<div>";
    	for(var i = 1; i <= ~~val; i++){
    		if(i == curr){
				result += "<span style='padding: 0 8px;'>" + i + "</span>";
			}else{
				result += "<a href='javascript:void(0)' onclick='goPage(" + i + ")' style='padding: 0 8px;'>" + i + "</a>";
			}
    	}
    	result += "</result>";
    	goPage = function(val){
    		st.loadPage(val);
    	}
    	return result;
    },
    
    goPage : function(val){
    	alert(val);
    },
    
    // @private
    getPageData : function(){
        var store = this.store,
            totalCount = store.getTotalCount();
		
        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount: Math.ceil(totalCount / store.pageSize),
            fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord: Math.min(store.currentPage * store.pageSize, totalCount)

        };
    },

    // @private
    onLoadError : function(){
        if (!this.rendered) {
            return;
        }
        this.child('#refresh').enable();
    },

    // @private
    readPageFromInput : function(pageData){
        var v = this.child('#inputItem').getValue(),
            pageNum = parseInt(v, 10);

        if (!v || isNaN(pageNum)) {
            this.child('#inputItem').setValue(pageData.currentPage);
            return false;
        }
        return pageNum;
    },

    onPagingFocus : function(){
        this.child('#inputItem').select();
    },

    // @private
    onPagingBlur : function(e){
        var curPage = this.getPageData().currentPage;
        this.child('#inputItem').setValue(curPage);
    },

    // @private
    onPagingKeyDown : function(field, e){
        var me = this,
            k = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);
                if(me.fireEvent('beforechange', me, pageNum) !== false){
                    me.store.loadPage(pageNum);
                }
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : pageData.pageCount;
            field.setValue(pageNum);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= pageData.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }
    },

    // @private
    beforeLoad : function(){
        if(this.rendered && this.refresh){
            this.refresh.disable();
        }
    },

    /**
     * Move to the first page, has the same effect as clicking the 'first' button.
     */
    moveFirst : function(){
        if (this.fireEvent('beforechange', this, 1) !== false){
            this.store.loadPage(1);
        }
    },

    /**
     * Move to the previous page, has the same effect as clicking the 'previous' button.
     */
    movePrevious : function(){
        var me = this,
            prev = me.store.currentPage - 1;

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
                me.store.previousPage();
            }
        }
    },

    /**
     * Move to the next page, has the same effect as clicking the 'next' button.
     */
    moveNext : function(){
        var me = this,
            total = me.getPageData().pageCount,
            next = me.store.currentPage + 1;

        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
                me.store.nextPage();
            }
        }
    },

    /**
     * Move to the last page, has the same effect as clicking the 'last' button.
     */
    moveLast : function(){
        var me = this,
            last = me.getPageData().pageCount;

        if (me.fireEvent('beforechange', me, last) !== false) {
            me.store.loadPage(last);
        }
    },

    /**
     * Refresh the current page, has the same effect as clicking the 'refresh' button.
     */
    doRefresh : function(){
        var me = this,
            current = me.store.currentPage;

        if (me.fireEvent('beforechange', me, current) !== false) {
            me.store.loadPage(current);
        }
    },
    
    getStoreListeners: function() {
        return {
            beforeload: this.beforeLoad,
            load: this.onLoad,
            exception: this.onLoadError
        };
    },

    /**
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to unbind
     */
    unbind : function(store){
        this.bindStore(null);
    },

    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to bind
     */
    bind : function(store){
        this.bindStore(store);
    },

    // @private
    onDestroy : function(){
        this.unbind();
        this.callParent();
    }
});