/*!
 * Extensible 1.5.2
 * Copyright(c) 2010-2013 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*
 * Chinese (Simplified)
 * By frank cheung v0.1
 * encoding: utf-8
 */
Ext.onReady(function() {
    var exists = Ext.Function.bind(Ext.ClassManager.get, Ext.ClassManager);
    
    Ext.Date.use24HourTime = false;
    
    if (exists('Ext.calendar.view.AbstractCalendar')) {
        Ext.apply(Ext.calendar.view.AbstractCalendar.prototype, {
            startDay: 0,
            todayText: '今天',
            defaultEventTitleText: '(没标题)',
            ddCreateEventText: '为{0}创建事件',
            ddMoveEventText: '移动事件到{0}',
            ddResizeEventText: '更新事件到{0}'
        });
    }
    
    if (exists('Ext.calendar.view.Month')) {
        Ext.apply(Ext.calendar.view.Month.prototype, {
            moreText: '+{0}更多……',
            getMoreText: function(numEvents){
                return '+{0}更多……';
            },
            detailsTitleDateFormat: 'F j'
        });
    }
    
    if (exists('Ext.calendar.CalendarPanel')) {
        Ext.apply(Ext.calendar.CalendarPanel.prototype, {
            todayText: '今天',
            dayText: '日',
            weekText: '周',
            monthText: '月',
            jumpToText: '跳转',
            goText: 'GO ',
            multiDayText: '{0}天',
            multiWeekText: '{0}周',
            getMultiDayText: function(numDays){
                return '{0}天';
            },
            getMultiWeekText: function(numWeeks){
                return '{0}周';
            }
        });
    }
    
    if (exists('Ext.calendar.form.EventWindow')) {
        Ext.apply(Ext.calendar.form.EventWindow.prototype, {
            width: 600,
            labelWidth: 65,
            titleTextAdd: '添加会议',
            titleTextEdit: '编辑会议',
            savingMessage: '保存更改……',
            deletingMessage: '删除会议……',
            detailsLinkText: '编辑详细……',
            saveButtonText: '保存',
            deleteButtonText: '删除',
            cancelButtonText: '取消',
            titleLabelText: '会议主题',
            typeLabelText: '会议类型',
            datesLabelText: '当在',
            calendarLabelText: '日历'
        });
    }
    
    if (exists('Ext.calendar.form.EventDetails')) {
        Ext.apply(Ext.calendar.form.EventDetails.prototype, {
            labelWidth: 65,
            labelWidthRightCol: 65,
            title: '会议来自',
            titleTextAdd: '添加会议',
            titleTextEdit: '编辑会议',
            saveButtonText: '保存',
            deleteButtonText: '删除',
            cancelButtonText: '取消',
            titleLabelText: '标题',
            datesLabelText: '当在',
            reminderLabelText: '提醒器',
            notesLabelText: '便笺',
            locationLabelText: '位置',
            webLinkLabelText: 'Web链接',
            calendarLabelText: '日历',
            repeatsLabelText: '重复'
        });
    }
    
    if (exists('Ext.form.field.DateRange')) {
        Ext.apply(Ext.form.field.DateRange.prototype, {
            toText: '到',
            allDayText: '全天'
        });
    }
    
    if (exists('Ext.calendar.form.field.CalendarCombo')) {
        Ext.apply(Ext.calendar.form.field.CalendarCombo.prototype, {
            fieldLabel: '日历'
        });
    }
    
    if (exists('Ext.calendar.gadget.CalendarListPanel')) {
        Ext.apply(Ext.calendar.gadget.CalendarListPanel.prototype, {
            title: '日历'
        });
    }
    
    if (exists('Ext.calendar.gadget.CalendarListMenu')) {
        Ext.apply(Ext.calendar.gadget.CalendarListMenu.prototype, {
            displayOnlyThisCalendarText: '只显示该日历'
        });
    }
    
    if (exists('Ext.form.recurrence.Combo')) {
        Ext.apply(Ext.form.recurrence.Combo.prototype, {
            fieldLabel: '重复',
            recurrenceText: {
                none: '不重复',
                daily: '每天',
                weekly: '每星期',
                monthly: '每月',
                yearly: '每年'
            }
        });
    }
    
    if (exists('Ext.calendar.form.field.ReminderCombo')) {
        Ext.apply(Ext.calendar.form.field.ReminderCombo.prototype, {
            fieldLabel: '提醒器',
            noneText: '没有',
            atStartTimeText: '开始时提醒',
            getMinutesText: function(numMinutes){
                return '分钟';
            },
            getHoursText: function(numHours){
                return '小时';
            },
            getDaysText: function(numDays){
                return '天';
            },
            getWeeksText: function(numWeeks){
                return '星期';
            },
            reminderValueFormat: '提前{0} {1}' // e.g. "2 hours before start"
        });
    }
    
    if (exists('Ext.form.field.DateRange')) {
        Ext.apply(Ext.form.field.DateRange.prototype, {
            dateFormat: 'Y/n/j'
        });
    }
    
    if (exists('Ext.calendar.menu.Event')) {
        Ext.apply(Ext.calendar.menu.Event.prototype, {
            editDetailsText: '编辑详细',
            deleteText: '删除',
            moveToText: '移动到……'
        });
    }
    
    if (exists('Ext.calendar.dd.DropZone')) {
        Ext.apply(Ext.calendar.dd.DropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat: 'n/j'
        });
    }
    
    if (exists('Ext.calendar.dd.DayDropZone')) {
        Ext.apply(Ext.calendar.dd.DayDropZone.prototype, {
            dateRangeFormat: '{0}-{1}',
            dateFormat : 'n/j'
        });
    }
    
    if (exists('Ext.calendar.template.BoxLayout')) {
        Ext.apply(Ext.calendar.template.BoxLayout.prototype, {
            firstWeekDateFormat: 'D j',
            otherWeeksDateFormat: 'j',
            singleDayDateFormat: 'Y年m月j日, l',
            multiDayFirstDayFormat: 'Y-m-j',
            multiDayMonthStartFormat: 'M j'
        });
    }
    
    if (exists('Ext.calendar.template.Month')) {
        Ext.apply(Ext.calendar.template.Month.prototype, {
            dayHeaderFormat: 'D',
            dayHeaderTitleFormat: 'Y-m-j l'
        });
    }
});