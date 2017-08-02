/*
 * This calendar application was forked from Ext Calendar Pro
 * and contributed to Ext JS as an advanced example of what can 
 * be built using and customizing Ext components and templates.
 * 
 * If you find this example to be useful you should take a look at
 * the original project, which has more features, more examples and
 * is maintained on a regular basis:
 * 
 *  http://ext.ensible.com/products/calendar
 */
Ext.define('Ext.calendar.App', {
    
    requires: [
        'Ext.Viewport',
        'Ext.layout.container.Border',
        'Ext.picker.Date',
        'Ext.calendar.util.Date',
        'Ext.calendar.CalendarPanel',
        'Ext.calendar.data.MemoryCalendarStore',
        'Ext.calendar.data.MemoryEventStore',
        'Ext.calendar.data.Events',
        'Ext.calendar.data.Calendars',
        'Ext.calendar.form.EventWindow'
    ],

    constructor : function() {
        // Minor workaround for OSX Lion scrollbars
        this.checkScrollOffset();
        
        // This is an example calendar store that enables event color-coding
        this.calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
            data: Ext.calendar.data.Calendars.getData()
        });

        // A sample event store that loads static JSON from a local file. Obviously a real
        // implementation would likely be loading remote data via an HttpProxy, but the
        // underlying store functionality is the same.
        this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
            data: Ext.calendar.data.Events.getData()
        });
        
        // This is the app UI layout code.  All of the calendar views are subcomponents of
        // CalendarPanel, but the app title bar and sidebar/navigation calendar are separate
        // pieces that are composed in app-specific layout code since they could be omitted
        // or placed elsewhere within the application.
        Ext.create('Ext.Viewport', {
            layout: 'border',
            renderTo: 'calendar-ct',
            items: [{
                id: 'app-center',
                //title: '...', // will be updated to the current view's date range
                region: 'center',
                layout: 'border',
                listeners: {
                    'afterrender': function(){
                        //Ext.getCmp('app-center').header.addCls('app-center-header');
                    }
                },
                items: [{
                    xtype: 'calendarpanel',
                    eventStore: this.eventStore,
                    calendarStore: this.calendarStore,
                    border: false,
                    id:'app-calendar',
                    region: 'center',
                    activeItem: 3, // month view
                    
                    monthViewCfg: {
                        showHeader: false,
                        showWeekLinks: true,
                        showWeekNumbers: true
                    },
                    
                    listeners: {
                        'eventclick': {
                            fn: function(vw, rec, el){
								//this.showEditWindow(rec, el);
								//var startDate = rec.data.StartDate.getUTCFullYear() + '-' + rec.data.StartDate.getUTCMonth() + 1 + '-' + rec.data.StartDate.getDate();
								//var endDate = rec.data.EndDate.getUTCFullYear() + '-' + rec.data.EndDate.getUTCMonth() + 1 + '-' + rec.data.EndDate.getDate();
								this.showYigoEditWindow('', '', '', '', rec, el);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventover': function(vw, rec, el){
                            //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventout': function(vw, rec, el){
                            //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventadd': {
                            fn: function(cp, rec){
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventcancel': {
                            fn: function(cp, rec){
                                // edit canceled
                            },
                            scope: this
                        },
                        'viewchange': {
                            fn: function(p, vw, dateInfo){
                                if(this.editWin){
                                    this.editWin.hide();
                                }
                                if(dateInfo){
                                    // will be null when switching to the event edit form so ignore
                                    //Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                    //this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                }
                            },
                            scope: this
                        },
                        'dayclick': {
                            fn: function(vw, dt, ad, el){
                                //this.showEditWindow({
                                //    StartDate: dt,
                                //    IsAllDay: ad
                                //}, el);
								var isAllDay = ad;
								var startDate = dt.getUTCFullYear() + '-' + 
								(parseInt(dt.getUTCMonth() + 1) >= 10 ? parseInt(dt.getUTCMonth() + 1) : '0' + parseInt(dt.getUTCMonth() + 1) )+ '-' +
								(dt.getDate() >= 10 ? dt.getDate() : '0'+dt.getDate());
								var endDate = dt.getUTCFullYear() + '-' + 
								(parseInt(dt.getUTCMonth() + 1) >= 10 ? parseInt(dt.getUTCMonth() + 1) : '0' + parseInt(dt.getUTCMonth() + 1) )+ '-' +
								(dt.getDate() >= 10 ? dt.getDate() : '0'+dt.getDate());
								dt.setHours(new Date().getHours());
								var hours = dt.getHours() >= 10 ? dt.getHours() : '0' + dt.getHours();
								var minutes = dt.getMinutes() >= 10 ? dt.getMinutes() : '0' + dt.getMinutes();
								var startMinute = endMinute = (hours >= 24 ? '24' : (parseInt(parseInt(hours)+1) >= 10 ? parseInt(parseInt(hours)+1) : '0' + parseInt(parseInt(hours)+1)) )+ ':' + minutes;
								this.showYigoEditWindow(startDate, endDate, startMinute, endMinute);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'rangeselect': {
                            fn: function(win, dates, onComplete){
                                //this.showEditWindow(dates);
								var isAllDay = false;
								var startDate = dates.StartDate.getUTCFullYear() + '-' 
									+ (parseInt(dates.StartDate.getUTCMonth() + 1) >= 10 ? parseInt(dates.StartDate.getUTCMonth() + 1) : '0' + parseInt(dates.StartDate.getUTCMonth() + 1)) + '-'
									+ (dates.StartDate.getDate() >= 10 ? dates.StartDate.getDate() : '0' + dates.StartDate.getDate());
								var endDate = dates.EndDate.getUTCFullYear() + '-' 
									+ (parseInt(dates.EndDate.getUTCMonth() + 1) >=10 ? parseInt(dates.EndDate.getUTCMonth() + 1) : '0' + parseInt(dates.EndDate.getUTCMonth() + 1)) + '-'
									+ (dates.EndDate.getDate() >= 10 ? dates.EndDate.getDate() : '0' + dates.EndDate.getDate());
								var startHour = dates.StartDate.getHours() >= 10 ? dates.StartDate.getHours() : '0' + dates.StartDate.getHours();
								var startMin = dates.StartDate.getMinutes() >= 10 ? dates.StartDate.getMinutes() : '0' + dates.StartDate.getMinutes();
								var endHour =  dates.EndDate.getHours() >= 10 ? dates.EndDate.getHours() : '0' + dates.EndDate.getHours();
								var endMin = dates.EndDate.getMinutes() >= 10 ? dates.EndDate.getMinutes() : '0' + dates.EndDate.getMinutes();
								var startMinute = startHour + ':' + startMin;
								var endMinute = endHour + ':' + endMin;
								this.showYigoEditWindow(startDate, endDate, startMinute, endMinute);
                                this.editWin.on('hide', onComplete, this, {single:true});
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventmove': {
                            fn: function(vw, rec){
                                var mappings = Ext.calendar.data.EventMappings,
                                    time = rec.data[mappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                                
                                rec.commit();
                                
                                this.showMsg('Event '+ rec.data[mappings.Title.name] +' was moved to '+
                                    Ext.Date.format(rec.data[mappings.StartDate.name], ('F jS'+time)));
                            },
                            scope: this
                        },
                        'eventresize': {
                            fn: function(vw, rec){
                                rec.commit();
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec){
								var id = this.editWin.formPanel.form._record.data.EventId;
								Ext.Msg.confirm('确认删除', '你确定删除该会议？', function(btn) {
									if (btn == 'yes') {
										Ext.Ajax.request({
											url : '/Yigo/dele.action',
											params : {
												id : id
											},
											success : function() {
												Ext.MessageBox.alert('提示', '删除成功!');
												//his.eventStore.remove(rec);
												//win.hide();
											},
											failure : function() {
												Ext.MessageBox.alert('提示', '删除时发生错误!');
											}
										});
									}
								});
                                //this.showMsg('Event '+ rec.data.Title +' was deleted');
                            },
                            scope: this
                        },
                        'initdrag': {
                            fn: function(vw){
                                if(this.editWin && this.editWin.isVisible()){
                                    this.editWin.hide();
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }]
        });
    },
        
    // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
    // This makes it very easy to swap it out with a different type of window or custom view, or omit
    // it altogether. Because of this, it's up to the application code to tie the pieces together.
    // Note that this function is called from various event handlers in the CalendarPanel above.
	// @Deprecated modify by wangxh
    showEditWindow : function(rec, animateTarget){
		 if(!this.editWin){
            this.editWin = Ext.create('Ext.calendar.form.EventWindow', {
				id: 'editWin',
                calendarStore: this.calendarStore,
                listeners: {
                    'eventadd': {
                        fn: function(win, rec){
                            //rec.data.IsNew = false;
                            //this.eventStore.add(rec);
                            //this.eventStore.sync();
							//this.showMsg('会议添加成功!!');
							win.formPanel.form.submit({
								method: 'POST',
								url: '/Yigo/add.action',
								waitMsg: '请稍等,数据正在保存中...', //form表单蒙版通过waitMsg设置
								success: function (form, action) {
									if(action.result.success == 'true'){
										Ext.MessageBox.alert('提示', '添加成功!');
										win.hide();
									}
								},
								failure: function (form, action) {
									Ext.MessageBox.alert('提示', '添加失败!');
								}
							});
							this.eventStore.load();
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec){
                            win.hide();
                            rec.commit();
                            this.eventStore.sync();
                            this.showMsg('Event '+ rec.data.Title +' was updated');
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec){
                            //this.eventStore.remove(rec);
                            //this.eventStore.sync();
                            //win.hide();
                            //this.showMsg('Event '+ rec.data.Title +' was deleted');
							var id = win.formPanel.form._record.data.EventId;
							Ext.Msg.confirm('确认删除', '你确定删除该会议？', function(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url : '/Yigo/dele.action',
										params : {
											id : id
										},
										success : function() {
											Ext.MessageBox.alert('提示', '删除成功!');
											//this.eventStore.remove(rec);
											win.hide();
										},
										failure : function() {
											Ext.MessageBox.alert('提示', '删除时发生错误!');
										}
									});
								}
							});
							this.eventStore.remove(rec);
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec){
							Ext.Ajax.request({
								method: 'post',
								url: '/Yigo/getUserName.action',
								success: function(response){	
									var data=Ext.decode(response.responseText);
									name = data.username;
									dept = data.userdept;
									win.hide();
									Ext.getCmp('app-calendar').showEditForm(rec);
									Ext.getCmp('createPerson').setValue(name);
									Ext.getCmp('createdept').setValue(dept);
								}
							});
                        }
                    }
                }
            });
        }
        this.editWin.showWin(rec, animateTarget);
    },
	
	// show YigoBill add as wangxh
	showYigoEditWindow : function(startDate, endDate, startMinute, endMinute, rec, animateTarget) {
		var oid=-1,
	        billKey="OA_MeetingInSideView";
		if (rec == undefined) {
			//点击,新增
		} else {
			billKey="OA_MeetingInSide",
			oid=rec.data.EventId;				
		}
		var args = {
			formKey: billKey,
			OID: oid
		};
		parent.openForm(billKey,oid);
	},
        
    // The CalendarPanel itself supports the standard Panel title config, but that title
    // only spans the calendar views.  For a title that spans the entire width of the app
    // we added a title to the layout's outer center region that is app-specific. This code
    // updates that outer title based on the currently-selected view range anytime the view changes.
    updateTitle: function(startDt, endDt){
        var p = Ext.getCmp('app-center'),
            fmt = Ext.Date.format;
        
        if(Ext.Date.clearTime(startDt).getTime() == Ext.Date.clearTime(endDt).getTime()){
            p.setTitle(fmt(startDt, 'Y年m月d日'));
        }
        else if(startDt.getFullYear() == endDt.getFullYear()){
            if(startDt.getMonth() == endDt.getMonth()){
                p.setTitle(fmt(startDt, 'Y年 F d日') + ' - ' + fmt(endDt, 'd日'));
            }
            else{
                p.setTitle(fmt(startDt, 'Y年 F d日') + ' - ' + fmt(endDt, 'F d日'));
            }
        }
        else{
            p.setTitle(fmt(startDt, 'Y年m月d日') + ' - ' + fmt(endDt, 'Y年m月d日'));
        }
    },
    
    // This is an application-specific way to communicate CalendarPanel event messages back to the user.
    // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
    // vary based on application requirements, which is why it's not baked into the CalendarPanel.
    showMsg: function(msg){
        Ext.fly('app-msg').update(msg).removeCls('x-hidden');
    },
    clearMsg: function(){
        Ext.fly('app-msg').update('').addCls('x-hidden');
    },
    
    // OSX Lion introduced dynamic scrollbars that do not take up space in the
    // body. Since certain aspects of the layout are calculated and rely on
    // scrollbar width, we add a special class if needed so that we can apply
    // static style rules rather than recalculate sizes on each resize.
    checkScrollOffset: function() {
        var scrollbarWidth = Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();
        
        // We check for less than 3 because the Ext scrollbar measurement gets
        // slightly padded (not sure the reason), so it's never returned as 0.
        if (scrollbarWidth < 3) {
            Ext.getBody().addCls('x-no-scrollbar');
        }
        if (Ext.isWindows) {
            Ext.getBody().addCls('x-win');
        }
    }
},
function() {
    /*
     * A few Ext overrides needed to work around issues in the calendar
     */
    
    Ext.form.Basic.override({
        reset: function() {
            var me = this;
            // This causes field events to be ignored. This is a problem for the
            // DateTimeField since it relies on handling the all-day checkbox state
            // changes to refresh its layout. In general, this batching is really not
            // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
            //me.batchLayouts(function() {
                me.getFields().each(function(f) {
                    f.reset();
                });
            //});
            return me;
        }
    });
    
    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
    Ext.data.MemoryProxy.override({
        updateOperation: function(operation, callback, scope) {
            operation.setCompleted();
            operation.setSuccessful();
            Ext.callback(callback, scope || this, [operation]);
        },
        create: function() {
            this.updateOperation.apply(this, arguments);
        },
        update: function() {
            this.updateOperation.apply(this, arguments);
        },
        destroy: function() {
            this.updateOperation.apply(this, arguments);
        }
    });
});