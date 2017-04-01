/**
 * Created with JetBrains WebStorm.
 * User: 陈志盛
 * Date: 14-1-8
 * Time: 下午2:00
 * 向服务器发送相关请求及参数，获取返回值进行处理
 */
 var Svr = Svr || {};
Svr.SvrMgr = (function () {
    var location_pathname = document.location.pathname;
    while (location_pathname.indexOf('/') == 0) location_pathname = location_pathname.substr(1);
    var baseurl = unescape(location_pathname.substr(0));
    var service = baseurl.substring(0, baseurl.indexOf('/'));
    var Return = {
        Service: {
            Authenticate: "Authenticate",
            LoadTreeMenu: "LoadTreeMenu",
            DealWithPureForm: "DealWithPureForm",
            DeleteAttachment: "DeleteAttachment",
            GetPublicKey: "GetPublicKey",
            PureFormData: "PureFormData",
            DelFormData: "DeleteData",
            GoToPage: "GoToPage",
            PureDictView: "PureDictView",
            PureViewMap: "PureViewMap2",
            PureTreeEvent: "PureTreeEvent",
            GetAppList: "GetAppList",
            GetEmptyForm: "GetEmptyForm",
            DealWithDocument: "DealWithDocument"
        },  //静态公有属性
        EventType: {
        	Click: 0,
            DBLClick: 1,
        	GainFocus: 2,
        	LostFocus: 3,
        	EnterPress: 4,
        	Expand: 5,
        	Collapse: 6,
        	GotoPage: 7,
        	DictViewSearch: 8,
        	CellClick: 9,
        	CellSelect: 10,
        	RowDelete: 11,
        	RowInsert: 12,
        	RowChange: 13,
        	ValueChanged: 14,
        	RowClick: 15,
        	RowDblClick: 16
    	},
    	

        getEmptyForm: function (paras, success) {
    		$(".loading").show();
    		$(".image").css({
    			top: $(window).height() / 2,
    			left: $(window).width() / 2
    		});
            paras = $.extend({
                service: Return.Service.GetEmptyForm
            }, paras);
            return Svr.Request.getData(paras);
        },
        
        getDocument: function (paras, success) {
            paras = $.extend({
                service: Return.Service.DealWithDocument
            }, paras);
            return Svr.Request.getData(paras);
        },
        
        saveDocument: function (paras, success) {
        	paras = $.extend({
        		service: Return.Service.DealWithDocument
        	}, paras);
            return Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras, success);
        },
        
    	getAppList: function(paras){
    		paras = $.extend({
            	async: false,
                url: Return.ServletURL,
                service: Return.Service.GetAppList
            }, paras);
    		return doCmd(paras);
    	},
        
        doPureTreeEvent: function(path) {
    		$(".loading").show();
            $(".image").css({
                top: $(window).height() / 2,
                left: $(window).width() / 2
            });
            var paras = {};
            paras.path = path;
            paras.service = Return.Service.PureTreeEvent;
            return Svr.Request.getData(paras);
        },
        
        loadTreeMenu: function (paras) {
            paras = $.extend({
                service: Return.Service.LoadTreeMenu
            }, paras);
            return Svr.Request.getData(paras);
        },

        dealWithPureForm: function (paras, success) {
            paras = $.extend({
                url: Return.ServletURL,
                service: Return.Service.GetEmptyForm
            }, paras);
            return doCmd(paras, null, success);
        },

        deleteAttachment: function (paras) {
            paras = $.extend({
                url: Return.AttachURL,
                service: Return.Service.DeleteAttachment
            }, paras);
            doCmd(paras);
        },

        doLogin: function (username, password, sessionPara, mode, opts) {

            var rsa = new RSAKey();
            var publicKey = Svr.SvrMgr.getPublicKey({async: false});
            rsa.setPublic(publicKey.modulus, publicKey.exponent);


            var loginInfo = {};
            loginInfo.user = username;
            loginInfo.password = password;
            loginInfo.mode = mode;

            var data = rsa.encrypt($.toJSON(loginInfo));
            data = BASE64.encoder(data);


            opts = $.extend({
                url: Return.ServletURL,
                logininfo: data,
                paras: $.toJSON(sessionPara),
                cmd: "Login",
                service: Return.Service.Authenticate
            }, opts);
            var success = function(result) {
                if (result) {
                    if (opts.cmd == "Login") {
                        $.cookie("userName", result.Name);
                        $.cookie("oldURL",window.location.href);
                        var time = result.Time;
                        var date = new Date(time);
                        var dateStr = date.Format("yyyy/MM/dd HH:mm:ss");
                        $.cookie("login_time", dateStr);
                        if(result.SessionParas) {
                        	$.cookie("sessionParas", result.SessionParas);
                        }
                    }
                    location.reload();
                }
            };
            doCmd(opts, null, success);
        },

        doLogout: function (paras) {
            paras = $.extend({
                cmd: "Logout",
                service: Return.Service.Authenticate
            }, paras);
            return Svr.Request.getData(paras);
        },

        getPublicKey: function (paras) {
            paras = $.extend({
                isWeb: true,
                service: Return.Service.GetPublicKey
            }, paras);
            return Svr.Request.getData(paras);
        },

        dealWithPureData: function (paras) {
            paras = $.extend({
                url: Return.ServletURL,
                service: Return.Service.PureFormData
            }, paras);
            return doCmd(paras);
        },
        
        delPureData: function(paras) {
        	paras = $.extend({
                url: Return.ServletURL,
                service: Return.Service.DelFormData
            }, paras);
            return doCmd(paras);
        },

        loadFormData: function (paras) {
            paras = $.extend({
                url: Return.ServletURL,
                service: Return.Service.PureFormData
            }, paras);
            return doCmd(paras);
        },
        doGoToPage: function(paras) {
        	paras = $.extend({
                service: Return.Service.GoToPage
            }, paras);
//            return doCmd(paras);
            return Svr.Request.getData(paras);
        },
        doDictViewEvent: function(paras) {
        	paras = $.extend({
                url: Return.ServletURL,
                service: Return.Service.PureDictView
            }, paras);
            return doCmd(paras);
        },
        
        doMapEvent: function(paras) {
        	paras = $.extend({
                service: Return.Service.PureViewMap
            }, paras);
            return Svr.Request.getData(paras);
        },
        
        cutImg: function(paras) {
        	paras = $.extend({
                url: Return.ServletURL,
                service: "CutImage"
            }, paras);
            return doCmd(paras);
        },

        loadGanttData: function(paras, success) {
            paras = $.extend({
                url: Return.ServletURL,
                service: "Gantt",
                cmd: "LoadGanttData"
            }, paras);
            return doCmd(paras, null, success);
        },

        saveGanttData: function(paras, success) {
            paras = $.extend({
                url: Return.ServletURL,
                service: "Gantt",
                cmd: "SaveGanttData"
            }, paras);
            return doCmd(paras, null, success);
        },

        loadForm: function(paras, success) {
            paras = $.extend({
                url: Return.ServletURL,
                service: "LoadForm"
            }, paras);
            return doCmd(paras, null, success);
        }
    };
    Return.ServletURL = [window.location.protocol, '//', window.location.host, '/', service, '/', 'servlet'].join('');
    Return.UIProxyURL = [window.location.protocol, '//', window.location.host, '/', service, '/', 'uiproxy'].join('');
    Return.AttachURL = [window.location.protocol, '//', window.location.host, '/', service, '/', 'attach'].join('');
    var doCmd = function (paras, rootDom, success, error) {    //静态私有方法
    	var returnObj;
    	if(paras.async == true) {
    		returnObj = Svr.Request.getAsyncData(paras.url, paras, success, error);
    	} else {
    		returnObj = Svr.Request.getSyncData(paras.url, paras, success, error);
    	}
        return returnObj;
    };
    return Return;
})();