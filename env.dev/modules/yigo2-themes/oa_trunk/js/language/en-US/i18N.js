var other = {
	oa_navigation : {
		navwatchword : "Customer-Centric Open-Mindedness Excellence Dedication",
		language_zh_CN : "中文",
		language_en_US : "English"
	},
	oa_ui_tabs : {
		all_closed : "All closed"
	},
	oa_index : {
		item_todo_title : "Todo",
		item_return_title : "Return",
		item_tips_title : "Tips",
		item_unfinished_title : "Unfinished",
		index_caption : "Home page"
	},
	oa_totolist : {
		item_todo : "Work ToDo",
		item_backed : "Work Backed",
		item_loved : "Work Concerned",
		tdwidth10_workid : "WorkID",
		tdwidth20_workname : "Work Name",
		tdwidth10_operator : "Operator",
		tdwidth20_arrivetime : "Work ArriveTime",
		tdwidth10_currentprocessor : "Current Processor",
		tdwidth20_staytime : "Stay Time",
		tdwidth10_operate : "Operate",
		min_btn_todo : "Deal",
		min_btn_loved : "Concern",
		min_btn_tosea : "Examine",
		min_btn_unloved : "CounterMand",
		time_day : " day ",
		time_hour : " hour"
	},
	oa_workflow : {
		nav_clearfix_nav_nmt : "NavMode",
		nav_clearfix_nav_t : "Commonly",
		nav_clearfix_clearfix_minBtn : "Remove the current process from the common form",
		main_content_addBtn : "Add the current process to the common form",
		search_box_query : "Query",
		search_box_form_key : "Form key",
		workflow_field : "Flow field",
		workflow_area : "Area",
		workflow_all : "All",
		create_form : "Create a new form"
	}
};

var YIUI = YIUI || {};
if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, other);
} else {
	YIUI.I18N = other;
}