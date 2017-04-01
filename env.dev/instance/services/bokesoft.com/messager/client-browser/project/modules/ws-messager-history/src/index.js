"use strict";

var $ = require("jquery");
var _ = require("lodash");

var datepicker = require("jquery-datetimepicker");
require("jquery-datetimepicker/jquery.datetimepicker.css");


var tmplString = require("./tmpl/Msg-Manager.html"),
	tmplGroups = require("./tmpl/groups.html"),
	tmplUsers = require("./tmpl/users.html"),
	tmplDtls = require("./tmpl/dtls.html");


var defMyselfIcon = require("./tmpl/icons/pictograms-vol-1/default-myself-icon.png"),
	defUserIcon = require("./tmpl/icons/pictograms-vol-1/default-user-icon.png");


require("./tmpl/css/style.css");



/*测试数据*/
var myselfInfo = {
	userCode: "001",
	userName: "chenqj",
	userIcon: defMyselfIcon
}

var doLoadGroups=function(){
	var $this = $(this),code = $this.data("group-code");
	$this.addClass("active").siblings().removeClass("active");
	loadUsers(code);
}

var doLoadUsers=function(){
	var $this = $(this), code = $this.data("user-code"), name = $this.text();
	$this.parents(".msg-container").find(".cur-buddy-name").html(name);
	$this.addClass("active").siblings().removeClass("active");
	loadMsgDetail(code);
}

/**
 * 返回通讯录中self的所有分组;
 * 返回数据格式:
 *     [{
 *     		groupCode:"group-001",  //组code
 *     		groupName: "普通客户1"  //组名
 *     }]
 *     @param groupsContainer,userContainer分别是组容器和组下面用户容器
 */
var loadGroups = function(){
	var compiled = _.template(tmplGroups);
	var $rootElm = $(".msg-user-group-list");
	var ajax = require("boke-cms-ajax");
	ajax.post("/im-service/groups.json", {}, function(json){

		var html = compiled({
			groups: json
		});
		$rootElm.html(html);

		//初始化信息
		var initGroup=$rootElm.find(".msg-user-group li").eq(0);
		doLoadGroups.call(initGroup);

		$rootElm.find(".msg-user-group-item").click(doLoadGroups);
	});
};

/*日期 格式化*/
var dateFormat= function(a,fmt) {
	//var a = new Date();
	var o = {
		"M+": a.getMonth() + 1, //月份
		"d+": a.getDate(), //日
		"h+": a.getHours(), //小时
		"m+": a.getMinutes(), //分
		"s+": a.getSeconds(), //秒
		"q+": Math.floor((a.getMonth() + 3) / 3), //季度
		"S": a.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (a.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o){
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	}
	return fmt;
};

/**
 * 返回通讯录中指定分组的成员;
 * 返回数据格式:
 *     [{
 *        code: "boke-test-001",       //用户 coke
 *         name: "测试用户1",            //用户名称(用于显示)
 *         icon: "/user-icons/01.png"   //用户名称(用于显示)
 *      }]
 *       @param userContainer组下面用户容器,code为查询参数，这里是组code
 */
var loadUsers = function (code) {
	var code = code;
	var compiled = _.template(tmplUsers);
	var ajax = require("boke-cms-ajax");
	ajax.post("/im-service/users.json", {groupCode:code}, function(json){
		var html = compiled({
			users: json
		});
		var $rootElm = $(".msg-user-list");
		$rootElm.html(html);

		//初始化信息
		var initUser=$rootElm.find(".user-list li").eq(0);
		doLoadUsers.call(initUser);

		$rootElm.find(".user-list-item").click(doLoadUsers);
	});
}


var loadMsgDetail = function (code) {
	var code = code;
	var $rootElm = $(".msg-detail-content");
	var options = {
		pager: ".msg-dtl-pager",
		render: ".msg-dtl-list",
		tmplStr: tmplDtls,
		tmpl: "",
		format: "[<(qq-) ncnnn (-pp)>]",
		data: "/im-service/dtls.json",
		code:code
	};
	var pagination= require("boke-cms-pagination");
	pagination.pagingShow(options);

	$rootElm.find('.msg-detail-content-item').click(function(){
		$(this).addClass("clicked").siblings().removeClass("clicked");
	});
}


var FillMsgHistory = function(){
	var compiled = _.template(tmplString);
	var html = compiled(myselfInfo);
	$("body").html(html);
	var now_d=new Date();
	var now=dateFormat(now_d,'yyyy/MM/dd')
	$('#datepicker').datetimepicker({
				value:now,
				format:'Y/m/d',
				formatDate:'Y/m/d',
		        timepicker:false,
			beforeShowDay: function(date) {
			var datestr=dateFormat(date,'yyyy/MM/dd');
			var dates = ['2016/08/02', '2016/08/16', '2016/08/12'];
			for (var i = 0; i < dates.length; i++) {
				if (dates[i]== datestr) {
					return [true, 'custom-date-style', dates[i]];
				}
			}
			return [false, ''];
		}
});
	loadGroups();
}

/** Define the export point for module */
module.exports = {
	FillMsgHistory: FillMsgHistory
}
