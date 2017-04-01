"use strict";

/**
 * 返回当前用户身份认证信息的服务(相对)地址;
 * 返回数据格式: {
 *   userCode: "XXXX",  //当前用户的编号
 *   userName: "XXXX",  //当前用户的名称(用于显示)
 *   userIcon: "/...",  //当前用户的头像, 相对或者绝对 URL
 *   userToken: "XXXXX" //用户会话令牌，用于供 IM 后台进行身份验证
 * }
 */
var serviceIdentity = "/identity";

/**
 * 返回用户信息的服务(相对)地址: 因为 messager 的 websocket 服务器不保留用户信息, 因此客户端需要通过这个服务获取相关的用户信息;
 * 请求的数据格式: {users: [userCode1, userCode2, ...]}
 * 返回数据格式: {
 *     “XXXX": {    //以用户的 code 为 key
 *         name: "XXXX",             //用户名称(用于显示)
 *         icon: "/.../user01.png",  //用户的头像, 相对或者绝对 URL
 *     }, ...
 * }
 */
var serviceUserInfo = "/userinfo";

/**
 * 返回聊天伙伴信息的服务(相对)地址: 聊天伙伴及其分组信息;
 * 返回数据格式: 
 *     [{
 *         groupName: "XXXX",               //分组名称
 *         groupType: 'blacklist'/'normal', //分组类型，normal-普通分组(此时 groupType 属性可省略), blacklist-黑名单
 *         users: [{                        //分组包含的用户
 *             code: "XXXX",                     //用户 code
 *             name: "XXXX",                     //用户名称(用于显示)
 *             icon: "/.../user01.png",          //用户的头像, 相对或者绝对 URL
 *         }, ...]
 *     }, ...]
 */
var serviceBuddies = "/buddies";

/**
 * 初始化调用后台服务的 service 对象.
 */
var BackendClient = function(options){
    /**
     * options 包含如下内容:
     *  - serviceBaseUrl: serviceIdentity 等服务的 url 基本路径
     *  - servicePostfix: serviceIdentity 等服务的 url 后缀, 比如 ".action"
     */
    this.options = {
        serviceBaseUrl: options.serviceBaseUrl,
        servicePostfix: options.servicePostfix
    };
    
    /**
     * 用于在客户端缓存用户信息;
     * 结构为：{
     *     userXXX: {    //按照 userCode 缓存
     *         name: "XXXX",    //用户名
     *         icon: "/..."        //用户图标
     *     }
     * }
     */
    this.userInfosCache = {};
    
    return this;
};

var _doPost = function(service, options, postData, dataCallback){
    var ajax = require("boke-cms-ajax");
    ajax.post(options.serviceBaseUrl + service + options.servicePostfix, postData, function(data){
        dataCallback(data);
    }, {errorStyle: "notify"});
}
/**
 * 简单的获取后台的当前用户信息并执行回调
 */
BackendClient.prototype.serviceIdentity = function(dataCallback){
    _doPost(serviceIdentity, this.options, {}, dataCallback);
};
/**
 * 获取多个用户的信息(会通过缓存避免过多的数据访问请求)
 */
BackendClient.prototype.userInfo = function(userCodes, userInfoCallback){
    var userInfoTable = {};
	var codesToQuery = [];
    for (var i=0; i<userCodes.length; i++){
    	var ucode = userCodes[i];
        if (this.userInfosCache[ucode]){	//缓存中存在的用户信息不需要到后台再去查找了
        	userInfoTable[ucode] = this.userInfosCache[ucode];
        }else {
        	codesToQuery.push(ucode);
        }
    }
    if (codesToQuery.length <= 0){
    	userInfoCallback(userInfoTable);
    }else{
    	var json = require("JSON2");
    	var self = this;
        _doPost(serviceUserInfo, this.options, {users: json.stringify(codesToQuery)}, function(data){
        	for (var i=0; i<codesToQuery.length; i++){
        		var ucode = codesToQuery[i];
        		if (data[ucode]){
        			userInfoTable[ucode] = data[ucode];
        			self.userInfosCache[ucode] = data[ucode];	//顺便记录到缓存中
        		}
        	}
        	userInfoCallback(userInfoTable);
        });
    }
}
/**
 * 调用用户信息服务并补充到 IM Session 信息中(补充 name 和 icon 属性), 然后执行回调
 */
BackendClient.prototype.fillSessions = function(sessions, sessionsDataCallback){
    var codeArray = [];
    for (var i=0; i<sessions.length; i++){
        if (! this.userInfosCache[sessions[i].code]){    //缓存中存在的用户信息不需要到后台再去查找了
            codeArray.push(sessions[i].code);
        }
    }

    var self = this;
    var _doFill = function(data){
        for (var i=0; i<sessions.length; i++){
            var session = sessions[i];
            
            var userInfo = data[session.code];
            if (userInfo){
                session.name = userInfo.name;
                session.icon = userInfo.icon;
                //用户信息记录在缓存里以免重复读取
                self.userInfosCache[session.code] = {
                        name: userInfo.name,
                        icon: userInfo.icon
                }
            }else{
                //从缓存中读取
                userInfo = self.userInfosCache[session.code];
                if (userInfo){
                    session.name = userInfo.name;
                    session.icon = userInfo.icon;
                }
            }
        }
        
        sessionsDataCallback(sessions);
    };
    
    if (codeArray.length <= 0){
        //没有需要从后端读取的用户信息
        _doFill({});
    }else{
        var json = require("JSON2");
        _doPost(serviceUserInfo, this.options, {users: json.stringify(codeArray)}, function(data){
            _doFill(data);
        });
    }
};
/**
 * 调用用户信息服务并补充到 IM 会话列表中(每条 message 增加 senderName 和 senderIcon 属性), 然后执行回调
 */
BackendClient.prototype.fillMessages = function(messages, messageDataCallback){
    var codeArray = [];
    for (var i=0; i<messages.length; i++){
        if (messages[i].rendered){
            continue;    //已经显示过的消息不需要处理
        }
        if (! this.userInfosCache[messages[i].sender]){    //缓存中存在的用户信息不需要到后台再去查找了
            var _s = messages[i].sender;
            if (codeArray.indexOf(_s)<0){
                codeArray.push(_s);
            }
        }
    }
    
    var self = this;
    var _doFill = function(data){
        for (var i=0; i<messages.length; i++){
            if (messages[i].rendered){
                continue;    //已经显示过的消息不需要处理
            }
            var msg = messages[i];
            
            var userInfo = data[msg.sender];
            if (userInfo){
                msg.senderName = userInfo.name;
                msg.senderIcon = userInfo.icon;
                //用户信息记录在缓存里以免重复读取
                self.userInfosCache[msg.sender] = {
                        name: userInfo.name,
                        icon: userInfo.icon
                }
            }else{
                //从缓存中读取
                userInfo = self.userInfosCache[msg.sender];
                if (userInfo){
                    msg.senderName = userInfo.name;
                    msg.senderIcon = userInfo.icon;
                }
            }
        }
        
        messageDataCallback(messages);
    };
    
    if (codeArray.length <= 0){
        //没有需要从后端读取的用户信息
        _doFill({});
    }else{
        var json = require("JSON2");
        _doPost(serviceUserInfo, this.options, {users: json.stringify(codeArray)}, function(data){
            _doFill(data);
        });
    }
}
/**
 * 调用聊天伙伴信息服务并执行回调, 注意这个过程中系统会把聊天伙伴的信息记入客户端缓存用户信息
 */
BackendClient.prototype.serviceBuddies = function(dataCallback){
    var self = this;
    _doPost(serviceBuddies, this.options, {}, function(data){
        //用户的信息可以缓存起来避免重复读取
        for (var i=0; i<data.length; i++){
            var group = data[i];
            var users = group.users;
            if (users){
                for (var j=0; j<users.length; j++){
                    var user = users[j];
                    self.userInfosCache[user.code] = {
                            name: user.name,
                            icon: user.icon
                    }
                }
            }
        }

        //回调
        dataCallback(data);
    });
};

/** Define the export point for module */
module.exports = {
    create: function(options){
        var backendClient = new BackendClient(options);
        return backendClient;
    }
}
