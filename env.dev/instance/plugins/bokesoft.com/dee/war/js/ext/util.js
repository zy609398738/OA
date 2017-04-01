function $(id) {
	return document.getElementById(id)
}
/**
 * 点击叶子节点时会ChangePanel
 * 
 * @param {Object}
 *            panel 目标Panel
 */
function changeToLogin() {
	Ext.Ajax.request({
					url : 'excelImportToTableController.do?actionType=sessionTimeOut',
					success : function(response) {
						//bodyLoadingMask.hide();
						var result = Ext.decode(response.responseText);
						if(result.sessionTimeOut == true){
							alert("登录超时， 请重新登录");
							window.location = "loginDesign.jsp";
							return;
						}
					}
				});
}	
function changePanel(panel) {
	changeToLogin();
	right.hide();
	center.removeAll();
	center.add(panel);
}

/**
 * 把双击展开树节点改为单击展开树节点
 * 
 * @param {Object}
 *            mTree 当前树
 * @param {Object}
 *            nodeRecord 当前节点
 */
function doTreeClick(mTree, nodeRecord, methodRoot, methodNode) {
	var leaf = nodeRecord.get('leaf');
	if (!leaf) {
		if ('center_publicDeploy' == methodRoot) {
			bodyLoadingMask.show();
			var type = nodeRecord.raw.type;
			if ('Connector.json' == type) {
				changePanel(center_pdConnector());
			} else if ('coreConfig/commonTransformerConfig/commonTransformer.json' == type) {
				changePanel(center_pdTransformer());
			} else if ('SpringBean.json' == type) {
				changePanel(center_pdSpringBean());
			} else if ('DataSource.json' == type) {
				changePanel(center_pdDataSource());
			} else if ('GlobalSource.json' == type) {
				changePanel(center_pdGlobalSource());
			} else if ('WebServiceActionMapping.json' == type) {
				changePanel(center_pdWebServiceActionMapping());
			} else if ('ServletActionMapping.json' == type) {
				changePanel(center_pdWebServletActionMapping());
			} else if ('VmFileImport.json' == type) {
				changePanel(center_pdVmFileImport());
			} else {
				bodyLoadingMask.hide();
			}
		} else if ('center_service' == methodRoot) {
			var expand = nodeRecord.get('expanded');
			if (expand) {
				mTree.collapse(nodeRecord);
			} else {
				mTree.expand(nodeRecord);
			}
		} else if ('center_buildXML' == methodRoot) {
			if ('生成运行文件' == methodNode) {
				bodyLoadingMask.show();
				changePanel(center_buildXML());
			} else if ('接口运行管理' == methodNode) {
				bodyLoadingMask.show();
				changePanel(center_interfaceRunManager());
			} else if ('定时任务' == methodNode) {
				changePanel(timingTask());
			} else if ('同步' == methodNode) {
				changePanel(center_synch());
			} else if ('设置工作目录' == methodNode) {
				windowSetWorkPath();
			}
		} else if ('center_logManager' == methodRoot) {
			if (methodNode == '调试日志') {
				changePanel(center_debugLogManager());
			} else if (methodNode == '运行异常日志') {
				changePanel(center_runtimeLog());
			} else if (methodNode == '启动异常日志') {
				changePanel(center_startLog());
			} else if (methodNode == '配置加载异常日志') {
				changePanel(center_loadConfigLog());
			} else if (methodNode == '同步日志') {
				changePanel(center_synLogManager());
			} else if (methodNode == '计划任务日志') {
				changePanel(center_timingTaskLogManager());
			} else if (methodNode == '运行详细日志') {
				window.open('interfaceStatusDetail.jsp', '_blank')
			} else if (methodNode == '接口服务状态监控') {
				window.open('interfacemonitor.jsp', '_blank')
			} else if (methodNode == '日志索引') {
				window.open('interfaceIndex.jsp', '_blank')
			}

		} else if ('center_systemInfo' == methodRoot) {
			if (methodNode == '系统信息') {
				changePanel(center_systemInfo())
			} else if (methodNode == '资源下载配置') {
				changePanel(center_systemCondition());
			} else if (methodNode == 'Ws和Http测试') {
				changePanel(center_wsAndHttpTest());
			} else if (methodNode == 'Excel导入到数据库') {
				changePanel(center_excelImportToTable());
			}

		} else if ('center_dataTemplate' == methodRoot) {
			if ('标准模版' == methodNode) {
				changePanel(center_standardTemplate());
			} else if ('自定义模版' == methodNode) {
				changePanel(center_customTemplate());
			} else if ('接口预配置' == methodNode) {
				changePanel(center_interfaceSimpleConfig());
			}
		} else if ('center_permission' == methodRoot) {
			if ('操作员管理' == methodNode) {
				changePanel(center_operatorManager());
			} else if ('角色管理' == methodNode) {
				changePanel(center_roleManager());
			}
		} else if ('center_exchange_center' == methodRoot) {
			if ('交换代码' == methodNode) {
				changePanel(center_exchangecode());
			} else if ('交换群组' == methodNode) {
				changePanel(center_exchangegroup());
			} else if ('ActionType' == methodNode) {
				changePanel(center_exchangeaction());
			} else if ('接收事件' == methodNode) {
				changePanel(center_receiveevent());
			} else if ('备份查询' == methodNode) {
				changePanel(center_copyfind());
			}
		}
	} else {
		if ('center_service' == methodNode) {
			bodyLoadingMask.show();
			changePanel(center_service(nodeRecord.parentNode, nodeRecord));
		}
	}
}
/**
 * 为grid增加横向滚动条
 * 
 * @param {Object}
 *            id
 */
function gridXSroll(id) {
	if ($(id).children.length > 0) {
		xScroll($(id).children[0]);
	}
}

/**
 * 为元素增加横向滚动条
 * 
 * @param {Object}
 *            id
 */
function xScroll(obj) {
	if (typeof obj == 'string')
		$(obj).style['overflow-x'] = 'scroll';
	else
		obj.style['overflow-x'] = 'scroll';
}

/**
 * 把Store转成JSON
 * 
 * @param {Object}
 *            store
 * @return {TypeName}
 */
function storeToJSON(store) {
	return Ext.JSON.encode(storeToObj(store));
}

/**
 * 把Store转成JSON
 * 
 * @param {Object}
 *            store
 * @return {TypeName}
 */
function storeToObj(store) {
	var array = new Array();
	for ( var i = 0; i < store.getCount(); i++) {
		var row = store.getAt(i);
		array.push(row.data);
	}
	return array;
}

/**
 * 将store的item上移，此方法只适合center_service使用
 * 
 * @param {Object}
 *            store
 * @param {Object}
 *            index
 */
function storeUpItem(store, index) {
	var r = store.getAt(index);
	var flowMode = r.data.flowMode;
	for ( var i = index - 1; i > -1; i--) {
		if (flowMode == store.getAt(i).data.flowMode) {
			store.removeAt(index);
			store.insert(i, r);
			return i;
		}
	}
	return index;
}

/**
 * 将store的item下移，此方法只适合center_service使用
 * 
 * @param {Object}
 *            store
 * @param {Object}
 *            index
 */
function storeDownItem(store, index) {
	var r = store.getAt(index);
	var flowMode = r.data.flowMode;
	for ( var i = index + 1; i < store.getCount(); i++) {
		if (flowMode == store.getAt(i).data.flowMode) {
			store.removeAt(index);
			store.insert(i, r);
			return i;
		}
	}
	return index;
}

/**
 * 不用写Ext.getCmp
 * 
 * @param {Object}
 *            v
 * @return {TypeName}
 */
function getCmp(v) {
	return Ext.getCmp(v);
}

/**
 * 为字符串加上颜色
 * 
 * @param {Object}
 *            v
 * @return {TypeName}
 */
function changeColorToRed(v) {

	return '<span style="color:#f000000;">' + v + '<\/span>';
}

function MD5(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}
	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4)
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		if (lX4 | lY4) {
			if (lResult & 0x40000000)
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			else
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
		} else
			return (lResult ^ lX8 ^ lY8);
	}
	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}
	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}
	function H(x, y, z) {
		return (x ^ y ^ z);
	}
	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}
	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string
					.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount]
				| (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	}
	function WordToHex(lValue) {
		// var WordToHexValue = ",WordToHexValue_temp=", lByte, lCount;
		var WordToHexValue = '', lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue
					+ WordToHexValue_temp.substr(
							WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	}
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for ( var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}
	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
	var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
	string = Utf8Encode(string);
	x = ConvertToWordArray(string);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;
	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}
	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
	return temp.toLowerCase();
}
/**
 * 存储全局变量
 * 
 * @param {Object}
 *            k
 * @return {TypeName}
 */
function o() {
	var o = {
		o : Object(),
		data : Object(),
		put : function(k, v) {
			o.data[k] = v;
		},
		get : function(k) {
			return o.data[k];
		},
		remove : function(k) {
			o.data[k] = null;
		},
		clear : function() {
			o.data = Object();
		}
	}
	return o;
}
/**
 * 判断启动序号是否重复
 */
function validateStartIndexIsTheSame(id, index) {
	if (index == '') {
		return false;
	}
	var count = Ext.getCmp('center_interface').store.getCount();
	for (var i = 0; i < count; i++) {
		var interfaceid = Ext.getCmp('center_interface').store.getAt(i).data.id;
		var text = Ext.getCmp('center_interface').store.getAt(i).data.text;
		var startIndex = Ext.getCmp('center_interface').store.getAt(i).data.startIndex;
		if (interfaceid != id && startIndex == index) {
			Ext.Msg.alert('提示', '启动序号和接口[' + text + ']重复！');
			return true;
		}
	}
}

/**
 * 判断服务名称是否相同或者为空
 */
function validateServiceNameIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var rName = store.getAt(i).data.text;
		var rDescription = store.getAt(i).data.description;
		if (!isRigthName(rName)) {
			Ext.Msg.alert('提示', '服务名称不能包含空格及中文字符');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (rName.toUpperCase() == store.getAt(j).data.text.toUpperCase()) {
				Ext.Msg.alert('提示', '服务名称不可以相同：[' + rName + ']');
				return true;
			}
		}
		if (rDescription.indexOf(' ') > -1 || rDescription.indexOf('*') > -1) {
			Ext.Msg.alert('提示', '描述可以为空，但不能包含空格和[*]');
			return true;
		}
	}
}
/**
 * 判断JDBCQuery是否相同或者为空
 */
function validateJdbcQueryIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var rK = store.getAt(i).data.key;
		var rV = store.getAt(i).data.value;
		if ('Quer1' == rK) {
			Ext.Msg.alert('提示', '键不可以使用[Quer1]');
			return true;
		} else if ('' == rK) {
			Ext.Msg.alert('提示', '键不可以为空');
			return true;
		}
		if ('这里填写SQL语句' == rV) {
			Ext.Msg.alert('提示', 'Value不可以使用[这里填写SQL语句]');
			return true;
		} else if ('' == rV) {
			Ext.Msg.alert('提示', 'Value不可以为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (rK == store.getAt(j).data.key) {
				Ext.Msg.alert('提示', 'JdbcQuery 键不可以相同：[' + rK + ']');
				return true;
			}
		}
	}
}
/**
 * 判断Map<String,String>是否相同或者为空
 */
function validatemssIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var rK = store.getAt(i).data.key;
		var rV = store.getAt(i).data.value;
		if ('Key' == rK) {
			Ext.Msg.alert('提示', '键不可以使用[Key]');
			return true;
		} else if ('' == rK) {
			Ext.Msg.alert('提示', '键不可以为空');
			return true;
		}
		if ('Value' == rV) {
			Ext.Msg.alert('提示', 'Value不可以使用[Value]');
			return true;
		} else if ('' == rV) {
			Ext.Msg.alert('提示', 'Value不可以为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (rK == store.getAt(j).data.key) {
				Ext.Msg.alert('提示', 'Map<string,string>键不可以相同：[' + rK + ']');
				return true;
			}
		}
	}
}
/**
 * 判断Map<String,List<String>>是否相同或者为空
 */
function validatemslsIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var rK = store.getAt(i).data.key;
		if ('' == rK) {
			Ext.Msg.alert('提示', '键不可以为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (rK == store.getAt(j).data.key) {
				Ext.Msg.alert('提示', 'Map<string,string>键不可以相同：[' + rK + ']');
				return true;
			}
		}
	}
}
/**
 * 判断List<String>是否相同或者为空
 */
function validatelsIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var rV = store.getAt(i).data.value;
		if ('' == rV) {
			Ext.Msg.alert('提示', 'Value不可以为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (rV == store.getAt(j).data.value) {
				Ext.Msg.alert('提示', 'List<String>Value不可以相同：[' + rV + ']');
				return true;
			}
		}
	}
}
/**
 * 判断SoapMethod是否相同或者为空
 */

function validateSoapMethodIsTheSameOrIsNull(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var param = store.getAt(i).data.parameter;
		if ('' == param) {
			Ext.Msg.alert('提示', '键不可以为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (param == store.getAt(j).data.parameter) {
				Ext.Msg.alert('提示', '键不可以相同：[' + param + ']');
				return true;
			}
		}
	}
}

function array2String(array) {
	var val, output = "";
	if (array) {
		output += "[";
		for (var i in array) {
			val = array[i];
			switch (typeof val) {
				case ("object") :
					if (val[0]) {
						output += array2String(val) + ",";
					} else {
						output += object2String(val) + ",";
					}
					break;
				case ("string") :
					output += '"' + encodeURI(val) + '",';
					break;
				default :
					output += val + ",";
			}
		}
		output = output.substring(0, output.length - 1) + "]";
	}
	return output;
}
function object2String(obj) {
	var val = Object(), output = "";
	if (obj) {
		output += "{";
		for (var i in obj) {
			var x;
			for (var j in obj) {
				if (obj[j]) {
					x = j;
					for (var k in obj) {
						if (obj[k] && k < x) {
							x = k;
						}
					}
				}
			}
			if (x) {
				val.v = obj[x];
				obj[x] = undefined;
				switch (typeof val.v) {
					case ("object") :
						if (val.v[0]) {
							output += '"' + x + '":' + array2String(val.v)
									+ ",";
						} else {
							output += '"' + x + '":' + object2String(val.v)
									+ ",";
						}
						break;
					case ("string") :
						output += '"' + x + '":"' + encodeURI(val.v) + '",';
						break;
					default :
						output += x + ":" + val.v + ",";
				}
			}
		}
		output = output.substring(0, output.length - 1) + "}";
	}
	return output;
}

function clone(obj) {
	var val, output = Object();
	if (obj) {
		for (var i in obj) {
			val = obj[i];
			switch (typeof val) {
				case ("object") :
					if (val[0]) {
						for (var j in val) {
							output[j] = clone(val);
						}
					} else {
						output[i] = clone(val);
					}
					break;
				case ("string") :
					output[i] = encodeURI(val);
					break;
				default :
					output[i] = encodeURI(val);
			}
		}
	}
	return output;
}
function validateGlobalSource(store) {
	var count = store.getCount();
	for (var i = 0; i < count; i++) {
		var key = store.getAt(i).data.key;
		var value = store.getAt(i).data.value;
		if ('' == key || key.indexOf(' ') > -1 || key.indexOf('*') > -1) {
			Ext.Msg.alert('提示', '键不可以为空,且不能包含空格和[*]');
			return true;
		}
		if ('' == value || value.indexOf(' ') > -1) {
			Ext.Msg.alert('提示', '值不可以为空,且不能包含空格');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (key == store.getAt(j).data.key) {
				Ext.Msg.alert('提示', '键不可以相同：[' + key + ']');
				return true;
			}
		}
	}
}

function validateWinAxisStore(store) {
	if (store.getCount() == 0) {
		Ext.Msg.alert('提示', '至少要有一个参数');
		return true;
	}
	for (var i = 0; i < store.getCount(); i++) {
		var item = store.getAt(i).data;
		for (var i in item) {
			if (item[i] == '' || item[i].indexOf(' ') > -1) {
				Ext.Msg.alert('提示', 'Parameter里面有空值');
				return true;
			}
		}
	}
}

function interfaceManagerButton(record) {
	if ('fail' != record.data.mode) {
		return '<input style="width:80px;height:22px;" type="button" value="'
				+ convertInterfaceManagerTypeToZH(record.data.mode)
				+ '" onclick="interfaceRun(\'' + record.data.text + '\',\''
				+ record.data.mode + '\');"/>';
	}
	return '该接口未加载成功';
}

function convertInterfaceManagerTypeToZH(value) {
	return 'start' == value ? '启动' : '停止';
}

function interfaceRun(interfaceName, mode) {
	bodyLoadingMask.show();
	Ext.Ajax.request({
		url : 'interfaceRunManagerController.do',
		timeout : 1800000,
		params : {
			actionType : mode,
			interfaceName : interfaceName
		},
		success : function(response) {
			var result = response.responseText;
			if (result == 'fail') {
				bodyLoadingMask.hide();
				Ext.Msg.alert('启动失败!', '请查看loadConfigLog或者startLog日志。');
				return false;
			}
			bodyLoadingMask.hide();
			var j = Ext.decode(result);
			var center_interfaceRunManager = getCmp('center_interfaceRunManager');
			var store = center_interfaceRunManager.store;
			store.removeAll();
			store.add(j);
		},
		failure : function(response) {
			bodyLoadingMask.hide();
			Ext.Msg.alert('启动失败!', '请查看loadConfigLog或者startLog日志。');
		}
	});
}
/**
 * 
 * @param {Object}
 *            str
 * @param {Object}
 *            size 1100px = 10(flex) * 16(size)
 * @return {TypeName}
 */
function renderBr(str, size) {
	var br = '<br/>';
	var newStr = '';
	var lastLen = 0;
	var lastByteLen = 0;
	if (str) {
		var i;
		var len = str.length;
		var byteLen = 0;
		for (i = 0; i < len; i++) {
			if (str.charCodeAt(i) > 255)
				byteLen += 2;
			else
				byteLen++;
			if (byteLen % size < 2 && byteLen - lastByteLen > 2) {
				newStr += str.substring(lastLen, i);
				newStr += br;
				lastLen = i;
				lastByteLen = byteLen;
			}
		}
		if (i > lastLen)
			newStr += str.substring(lastLen, i);
		return newStr;
	}
	return '';
}
var GB2312UnicodeConverter = {
	ToUnicode : function(str) {
		return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
	},
	ToGB2312 : function(str) {
		return unescape(str.replace(/\\u/gi, '%u'));
	}
};
String.prototype.Trim = function() {
	return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
}
function JSCookie() {
	this.GetCookie = function(key) {
		var cookie = document.cookie;
		var cookieArray = cookie.split(';');
		var getvalue = "";
		for (var i = 0; i < cookieArray.length; i++) {

			if (cookieArray[i].Trim().substr(0, key.length) == key) {
				getvalue = cookieArray[i].Trim().substr(key.length + 1);
				break;
			}
		}

		return getvalue;
	};
	this.GetChild = function(cookiekey, childkey) {
		var child = this.GetCookie(cookiekey);
		var childs = child.split('&');
		var getvalue = "";

		for (var i = 0; i < childs.length; i++) {
			if (childs[i].Trim().substr(0, childkey.length) == childkey) {
				getvalue = childs[i].Trim().substr(childkey.length + 1);
				break;
			}
		}
		return getvalue;
	};
	/**
	 * 默认过期时间30天
	 * 
	 * @param {Object}
	 *            key
	 * @param {Object}
	 *            value
	 * @param {Object}
	 *            expire
	 * @param {Object}
	 *            domain
	 * @param {Object}
	 *            path
	 */
	this.SetCookie = function(key, value, expire, domain, path) {
		var cookie = "";
		if (key != null && value != null)
			cookie += key + "=" + value + ";";
		if (expire != null)
			cookie += "expires=" + expire.toGMTString() + ";";
		else {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + 30);
			cookie += "expires=" + exdate.toGMTString() + ";";
		}
		if (domain != null)
			cookie += "domain=" + domain + ";";
		if (path != null)
			cookie += "path=" + path + ";";
		document.cookie = cookie;
	};
	this.Expire = function(key) {
		expire_time = new Date();
		expire_time.setFullYear(expire_time.getFullYear() - 1);
		var cookie = " " + key + "=e;expires=" + expire_time + ";"
		document.cookie = cookie;
	}
}
function ajaxSyncCall(url, params, method) {
	changeToLogin();
	if (!method)
		method = 'POST';
	var obj;
	var value;
	if (window.ActiveXObject) {
		obj = new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		obj = new XMLHttpRequest();
	}
	obj.open(method, url, false);
	obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	obj.send(params);
	return obj.responseText;
}

function validateStringIsNull(string) {
	return string == null || '' == string.Trim();
}

function convertTreeStoreToData(root) {
	var childNodes = root.childNodes;
	var children = [];
	function getData(node) {
		var data = {
			checked : node.data.checked,
			leaf : node.data.leaf,
			text : node.data.text,
			id : node.data.id,
			key : node.raw.key,
			actionType : node.raw.actionType
		}
		var childNodes1 = node.childNodes;
		if (childNodes1.length > 0) {
			data.children = [];
			for (var i in childNodes1) {
				data.children[i] = getData(childNodes1[i]);
			}
		}
		return data;
	}

	for (var i in childNodes) {
		children[i] = getData(childNodes[i]);
	}
	return children;
}

function cancelCheck(node, checked) {
	node.set('checked', checked == true ? false : true);
}

function doTreeCheckChange(node, checked) {
	if (checked == false) {
		uncheckChildrenTreenode(node);
		checkBrother(node);
	} else {
		checkChildrenTreenode(node);
		checkParentTreenode(node);
	}

	function uncheckChildrenTreenode(node) {
		node.set('checked', false);
		var childNodes = node.childNodes;
		for (var i in childNodes) {
			uncheckChildrenTreenode(childNodes[i])
		}
	}
	function checkChildrenTreenode(node) {
		node.set('checked', true);
		var childNodes = node.childNodes;
		for (var i in childNodes) {
			checkChildrenTreenode(childNodes[i])
		}
	}
	function checkParentTreenode(node) {
		var parentNode = node.parentNode;
		if (parentNode != null) {
			node.set('checked', true);
			checkParentTreenode(parentNode);
		}
	}
	function checkBrother(node) {
		var parentNode = node.parentNode;
		if (parentNode != null) {
			var brothers = parentNode.childNodes;
			var isParentShouldUnCheck = true;
			for (var i in brothers) {
				if (brothers[i].data.checked == true) {
					isParentShouldUnCheck = false;
				}
			}
			if (isParentShouldUnCheck == true) {
				node.parentNode.set('checked', false);
				if (parentNode != null) {
					checkBrother(parentNode);
				}
			}
		}
	}
}

function clearTreeNodeChecked(node) {
	if (node) {
		node.set('checked', false);
		var children = node.childNodes;
		for (var i in children) {
			clearTreeNodeChecked(children[i]);
		}
	}
}

function collapseTreeNodeChecked(node) {
	if (node) {
		var children = node.childNodes;
		if (children.length > 0) {
			for (var i in children) {
				collapseTreeNodeChecked(children[i]);
			}
			node.collapse();
		}
	}
}

function doTreeCheckChangeForCombox(node, checked) {
	if (checked == false) {
		return;
	} else {
		checkParentTreenode(node);
	}
	function checkParentTreenode(node) {
		var parentNode = node.parentNode;
		if (parentNode != null) {
			node.set('checked', true);
			checkParentTreenode(parentNode);
		}
	}
}

function isHiddenFromPermission(root1, root2, root3) {
	if (isAdmin == true)
		return false;
	if (permission[root1]) {
		var proot1 = permission[root1];
		for (var i in proot1) {
			if (proot1[i][root2]) {
				var proot2 = proot1[i][root2];
				for (var j in proot2) {
					if (proot2[j] == root3) {
						return false;
					}
				}
			}
		}
	}
	return true;
}

/**
 * 判断simpleSmooks tree grid 是否为空
 */
function validateSimpleSmooksSameOrIsNull(store) {
	var count = store.getCount();
	if (count == 0) {
		Ext.Msg.alert('提示', '没有数据');
		return true;
	}
	for (var i = 0; i < count; i++) {
		var Sclass = store.data.items[i].get('class');
		var ScreateOnElement = store.data.items[i].get('createOnElement');
		var SbeanId = store.data.items[i].get('beanId');
		if ('请选择' == ScreateOnElement) {
			Ext.Msg.alert('提示', '请选择节点');
			return true;
		}
		if ('请选择' == Sclass) {
			Ext.Msg.alert('提示', '请选择类型');
			return true;
		}
		if (SbeanId == '' || SbeanId == null) {
			Ext.Msg.alert('提示', '名称不能为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (SbeanId == store.data.items[j].get('beanId')) {
				Ext.Msg.alert('提示', '名称不能不可以相同：[' + SbeanId + ']');
				return true;
			}
		}
	}
}
/**
 * 判断ExcelConfig 是否为空 iscell cell:true loop :false
 */
function validateExcelConfigSameOrIsNull(store, iscell) {
	var count = store.getCount();
	if (count == 0) {
		Ext.Msg.alert('提示', '没有数据');
		return true;
	}
	for (var i = 0; i < count; i++) {
		var row = store.data.items[i].get('row');
		var col = store.data.items[i].get('col');
		var mapping = store.data.items[i].get('mapping');
		if ((iscell && '' == row) || row == null) {
			Ext.Msg.alert('提示', '行不能为空');
			return true;
		}
		if ('' == col || col == null) {
			Ext.Msg.alert('提示', '列不能为空');
			return true;
		}
		if ('' == mapping || mapping == null) {
			Ext.Msg.alert('提示', 'mapping不能为空');
			return true;
		}
		for (var j = i + 1; j < count; j++) {
			if (mapping == store.data.items[j].get('mapping')) {
				Ext.Msg.alert('提示', 'mapping不能不可以相同：[' + mapping + ']');
				return true;
			}
		}
	}
}
/**
 * 根据后台返回的SpringBean或Connector配置信息 生成对应的items
 * 
 * @param {Object}
 *            data
 * @return {TypeName}
 */
function getItems(data) {
	data = Ext.JSON.decode(data);
	for (var x = 0; x < data.length; x++) {
		// 引用类型的Combobox
		if (data[x].xtype != undefined && data[x].xtype == 'combobox') {
			var refId = data[x].id;
			data[x] = Ext.create('Ext.form.field.ComboBox', {
						fieldLabel : data[x].fieldLabel,
						xtype : 'combobox',
						editable : false,
						id : data[x].name,
						name : data[x].name,
						store : Ext.create('Ext.data.Store', {
									model : 'Combox',
									data : Ext.JSON.decode(data[x].type).root,
									autoLoad : true
								}),
						displayField : 'displayField',
						valueField : 'value',
						queryMode : 'local',
						emptyText : '请选择',
						allowBlank : data[x].allowBlank = null
								? true
								: data[x].allowBlank,// 没有配置可以为空 否则取配置值
						value : data[x].value
					})
		}
	}
	return data
}
/**
 * 选择SpringBean或者Connector的类型时对应生成属性配置界面
 * 
 * @param {Object}
 *            newValue 改变的值
 * @param {Object}
 *            oldValue 原来的值
 * @param {Object}
 *            win_form 操作的form
 * @param {Object}
 *            attrData 是对应类型的配置数据
 * @param {Object}
 *            isSpringbean 是否是SpringBean的请求 false是Connector的请求
 * @return {TypeName}
 */
function createSpringBeanOrConnectorConfig(newValue, oldValue, win_form,
		attrData, isSpringbean) {
	var url = 'interfaceInfoFindController.do?actionType=getSpringOrConnConfigByType';
	// 只是Combobox的值
	attrData = ajaxSyncCall(url, 'type=' + newValue + '&value=' + isSpringbean,
			null);
	// 删除原先的的属性选择框
	win_form.remove(oldValue);
	if (attrData == "") {
		return null;// 没有attr数据直接返回
	} else {
		// 加入 新的的属性选择框
		newValue = Ext.create('Ext.form.FieldContainer', {
					id : newValue,
					defaultType : 'textfield',
					defaults : {
						allowBlank : true,
						width : 765
					},
					labelWidth : 100,
					items : getItems(attrData)
				});
		win_form.add(newValue);
		return attrData;
	}
}
/**
 * 字符串不能包含空格及中文字符 
 * 也不能以数字开始
 * 
 * @param {Object}
 *            s
 * @return {TypeName}
 */
function isRigthName(s) {
	var patrn = /^[a-zA-Z]\w+$/; 
	if (patrn.exec(s)!=	null) {
		return true
	}else{
		return false
	}
}

Ext.bokedee = function(){
    var msgCt;

    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(){
            if(!msgCt){
                msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 2));
            var m = Ext.core.DomHelper.append(msgCt, createBox(arguments[0], s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: arguments[1], remove: true});
        },

        init : function(){
        }
    };
}();


// old school cookie functions
var Cookies = {};
Cookies.set = function(name, value){
     var argv = arguments;
     var argc = arguments.length;
     var expires = (argc > 2) ? argv[2] : null;
     var path = (argc > 3) ? argv[3] : '/';
     var domain = (argc > 4) ? argv[4] : null;
     var secure = (argc > 5) ? argv[5] : false;
     document.cookie = name + "=" + escape (value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure == true) ? "; secure" : "");
};

Cookies.get = function(name){
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	var j = 0;
	while(i < clen){
		j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return Cookies.getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if(i == 0)
			break;
	}
	return null;
};

Cookies.clear = function(name) {
  if(Cookies.get(name)){
    document.cookie = name + "=" +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
};

Cookies.getCookieVal = function(offset){
   var endstr = document.cookie.indexOf(";", offset);
   if(endstr == -1){
       endstr = document.cookie.length;
   }
   return unescape(document.cookie.substring(offset, endstr));
};