/**
 * 用户信息
 */
Ext.define('UserInfoModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'username',
		type : 'string'
	}, {
		name : 'userid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'createtime',
		type : 'string'
	}, {
		name : 'updatetime',
		type : 'string'
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'grade',
		type : 'string'
	}, {
		name : 'flag',
		type : 'string'
	}]
});

/**
 * 当前用户注册应用
 */
Ext.define('RegistrationAppModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'appname',
		type : 'string'
	}, {
		name : 'appid',
		type : 'string'
	}, {
		name : 'appkey',
		type : 'string'
	}, {
		name : 'appsecret',
		type : 'string'
	}, {
		name : 'createtime',
		type : 'string'
	}, {
		name : 'updatetime',
		type : 'string'
	}, {
		name : 'provider',
		type : 'string'
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'flag',
		type : 'string'
	}]
});

/**
 * 当前用户授权应用
 */
Ext.define('AuthorizationAppModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'appname',
		type : 'string'
	}, {
		name : 'starttime',
		type : 'string'
	},{
		name : 'updatetime',
		type : 'string'
	},{
		name : 'endtime',
		type : 'string'
	},{
		name : 'appkey',
		type : 'string'
	},{
		name : 'flag',
		type : 'string'
	}]
});


/**
 * 应用对应授权用户
 */
Ext.define('AppAuthorizationUserModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'username',
		type : 'string'
	}, {
		name : 'endtime',
		type : 'string'
	}, {
		name : 'appname',
		type : 'string'
	}, {
		name : 'appkey',
		type : 'string'
	}, {
		name : 'flag',
		type : 'string'
	}]
});

/**
 * 注册分页应用列表
 */
Ext.define('RegistrationAppListModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'username',
		type : 'string'
	}, {
		name : 'appname',
		type : 'string'
	}, {
		name : 'createtime',
		type : 'string'
	}, {
		name : 'appid',
		type : 'string'
	}, {
		name : 'appkey',
		type : 'string'
	}, {
		name : 'appsecret',
		type : 'string'
	},  {
		name : 'updatetime',
		type : 'string'
	}, {
		name : 'provider',
		type : 'string'
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'flag',
		type : 'string'
	}]
});

/**
 * 授权分页应用列表
 */
Ext.define('AuthorizationAppListModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'username',
		type : 'string'
	}, {
		name : 'appname',
		type : 'string'
	}, {
		name : 'starttime',
		type : 'string'
	}, {
		name : 'endtime',
		type : 'string'
	}, {
		name : 'appkey',
		type : 'string'
	}, {
		name : 'flag',
		type : 'string'
	}, {
		name : 'updatetime',
		type : 'string'
	}]
});