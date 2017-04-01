var Svr = Svr || {};
Svr.Request = (function () {
	var transData = function(data){
		if(data == null){
			return data;
		}
	
		var json = $.toJSON(data);
		
		//传送数据 长度 大于 20000 开启压缩   20000长度的数据传输在30K 左右
		if(json.length < 20000){
			return data;
		}
	    var postData = {};
        postData.yigoData = YIUI.Base64.encode64(pako.gzip(json));
        return postData;
	};

    var convertResult = function(msg){
        var ret = msg.data;
        if(msg.type === YIUI.JavaDataType.STR_USER_DATATABLE){
            ret = YIUI.DataUtil.fromJSONDataTable(ret);
        }else if(msg.type === YIUI.JavaDataType.STR_USER_DOCUMENT){
            ret = YIUI.DataUtil.fromJSONDoc(ret);
        }
        return ret;
    };

    var Return = {
        getSyncData: function (url, params, sucCallback, errorCallback) {
            params.mode = 1;
            var returnObj = null;
            var locale = window.navigator.language || window.navigator.browserLanguage;
            var tz = jstz.determine();
            var timezone = tz.name();
            params.locale = locale;
            params.timezone = timezone;
            
            //var syncData;
            $.ajax({
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                type: "post",
                url: url,
                data: transData(params),
                async: false,
                dataType: 'json',
                success: function (msg) {
                    returnObj = convertResult(msg);
                    if ($.isFunction(sucCallback)) {
                        returnObj = sucCallback(returnObj);
                    } 
                },
                complete: function (xhr, ts) {
                    xhr = null;
                },
                error: function (xhr, textStatus, exception) {
                	if(xhr.readyState == 0) {
                		$.error("请求状态未初始化，检查服务器连接！");
                		return;
                	}
                    if ($.isFunction(errorCallback)) {
                        //重载错误提示方法
                    } else {
                        var error = xhr.responseJSON.error;
                        var jsonObj = xhr.responseJSON.data;
                        if (jsonObj) {
                            for (var i = 0; i < jsonObj.length; i++) {
                                var changedObj = jsonObj[i];
                                var dealCmd = changedObj["cmd"];
                                var pFormID = changedObj["pFormID"];
                                var resultObj = changedObj["value"];
                                if (dealCmd == "diff") {
                                    YIUI.UIUtil.diffForm(pFormID, resultObj);
                                }
                            }
                        }

//                        var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
                        var showMessage = error.error_info;
                        var errorCode = error.error_code;
                        if(errorCode != -1){
                        	errorCode = (parseInt(errorCode,10)>>>0).toString(16).toLocaleUpperCase();
                        	showMessage = errorCode + "<br/>" + showMessage;
                        }
                        //$.error(errorCode,showMessage);
                        $.error(showMessage);

//		                var dialog = $("<div></div>").attr("id", "error_dialog");
//		                var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
//		                dialog.modalDialog(showMessage, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
                        return;
                    }
                }
            });
            return returnObj;
        },

        getAsyncData: function (url, params, sucCallback, errorCallback) {
            params.mode = 1;
            var returnObj = null;
            var locale = window.navigator.language || window.navigator.browserLanguage;
            var tz = jstz.determine();
            var timezone = tz.name();
            params.locale = locale;
            params.timezone = timezone;
       
            $.ajax({
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                type: "post",
                url: url,
                data: transData(params),
                async: true,
                dataType: 'json',
                beforeSend: function () {
                    $(".loading").show();
                    $(".image").css({
                        top: $(window).height() / 2,
                        left: $(window).width() / 2
                    });
                },
                success: function (msg) {
                    returnObj = convertResult(msg);
                    if ($.isFunction(sucCallback)) {
                        returnObj = sucCallback(returnObj);
                    } 
                },
                complete: function (xhr) {
                    xhr = null;
                    $(".loading").hide();
                },
                error: function (xhr, textStatus, exception) {
                    $(".loading").hide();
                	if(xhr.readyState == 0) {
                		$.error("请求状态未初始化，检查服务器连接！");
                		return;
                	}
                    if ($.isFunction(errorCallback)) {
                        //重载错误提示方法
                    } else {
                        var error = xhr.responseJSON.error;
                        var jsonObj = xhr.responseJSON.data;
                        if (jsonObj) {
                            for (var i = 0; i < jsonObj.length; i++) {
                                var changedObj = jsonObj[i];
                                var dealCmd = changedObj["cmd"];
                                var pFormID = changedObj["pFormID"];
                                var resultObj = changedObj["value"];
                                if (dealCmd == "diff") {
                                    YIUI.UIUtil.diffForm(pFormID, resultObj);
                                }
                            }
                        }

//                        var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
                        var showMessage = error.error_info;
                        var errorCode = error.error_code;
                        if(errorCode != -1){
                        	errorCode = (parseInt(errorCode,10)>>>0).toString(16).toLocaleUpperCase();
                        	showMessage = errorCode + "<br/>" + showMessage;
                        }
                        
                        //$.error(errorCode,showMessage);
                         
                        $.error(showMessage);

//		                var dialog = $("<div></div>").attr("id", "error_dialog");
//		                var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
//		                dialog.modalDialog(showMessage, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
                        return;
                    }
                }
            });
            return returnObj;
        }
    };
    return Return;
})();