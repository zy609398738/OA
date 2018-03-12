var other = {
	oa_navigation : {
		navwatchword : "成就客户 开放心胸 全力以赴 追求卓越",
		language_zh_CN : "中文",
		language_en_US : "English"
	},
	oa_ui_tabs : {
		all_closed : "全部关闭"
	},
	oa_index : {
		item_todo_title : "待处理",
		item_return_title : "已退回",
		item_tips_title : "已关注",
		item_unfinished_title : "提交未完成",
		index_caption : "首页"
	},
	oa_totolist : {
		item_todo : "待处理任务",
		item_backed : "退回给我的任务",
		item_loved : "已关注",
		tdwidth10_workid : "任务ID",
		tdwidth20_workname : "任务名称",
		tdwidth10_operator : "提交人",
		tdwidth20_arrivetime : "任务到达时间",
		tdwidth10_currentprocessor : "当前处理",
		tdwidth20_staytime : "停留时间",
		tdwidth10_operate : "操作",
		min_btn_todo : "处理",
		min_btn_loved : "关注",
		min_btn_tosea : "查看",
		min_btn_unloved : "取消关注",
		time_day : " 天 ",
		time_hour : " 小时"
	},
	oa_workflow : {
		nav_clearfix_nav_nmt : "导航模式",
		nav_clearfix_nav_t : "常用表单",
		nav_clearfix_clearfix_minBtn : "将当前流程从常用表单中删除",
		main_content_addBtn : "将当前流程添加到常用表单中",
		search_box_query : "查询",
		search_box_form_key : "表单关键字",
		workflow_field : "流程域",
		workflow_area : "区域",
		workflow_all : "所有",
		create_form : "填写表单"
	}
};

var YIUI = YIUI || {};
if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, other);
} else {
	YIUI.I18N = other;
}