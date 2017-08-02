/**
 * 与 IE8 兼容性相关的代码
 */

/**
 * Browser version check
 */
if (window.attachEvent && !window.addEventListener){
	// "bad" IE (IE8 or less)
	var appVer = navigator.appVersion;
	if (appVer.indexOf("MSIE 8.0") > 0){
		//IE 8 - check flash install and version > 10.0.0
		require("../../web-socket-js/swfobject.js");
		var ver = swfobject.getFlashPlayerVersion();
		if (ver.major < 10) {
			var err = "IM 在 IE8 上运行时需要版本 10 以上的 Flash 支持，请安装最新版本的 Flash Player" +
					  "(参考: 目前的 Flash 版本是 '"+ver.major+"."+ver.minor+"."+ver.release+"').";
			alert(err);
			throw err;
		}
	}else{ //IE 7、IE6、...
		var err = "IM 不支持版本早于 IE8 的浏览器，请升级您的浏览器(参考: 目前 IE 浏览器版本是 '"+appVer+"').";
		alert(err);
		throw err;
	}
}
/**
 * IE8 support;
 * see also:
 *     - https://github.com/webpack/style-loader/issues/42
 *     - https://github.com/coderwin/ES5Shim4Webpack
 *     - https://github.com/es-shims/es5-shim
 */
require('es5-shim');

/**
 * IE8 对 Object.defineProperty 的支持;
 * 参考 :
 *   - https://github.com/inexorabletash/polyfill/blob/master/es5.js
 *   - https://github.com/webpack/webpack/issues/2085
 */
//ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
//Partial support for most common case - getters, setters, and values
(function() {
	if (!Object.defineProperty || !(function() {
		try {
			Object.defineProperty({}, 'x', {});
			return true;
		} catch (e) {
			return false;
		}
	}())) {
		var orig = Object.defineProperty;
		Object.defineProperty = function(o, prop, desc) {
			// In IE8 try built-in implementation for defining properties on DOM
			// prototypes.
			if (orig) {
				try {
					return orig(o, prop, desc);
				} catch (e) {
				}
			}

			if (o !== Object(o)) {
				throw TypeError("Object.defineProperty called on non-object");
			}
			if (Object.prototype.__defineGetter__ && ('get' in desc)) {
				Object.prototype.__defineGetter__.call(o, prop, desc.get);
			}
			if (Object.prototype.__defineSetter__ && ('set' in desc)) {
				Object.prototype.__defineSetter__.call(o, prop, desc.set);
			}
			if ('value' in desc) {
				o[prop] = desc.value;
			}
			return o;
		};
	}
}());

/**
 * IE8 非调试模式下的 console 对象
 */
if (!window.console) {
	window.console = {
		assert : function() {
		},
		clear : function() {
		},
		count : function() {
		},
		debug : function() {
		},
		dir : function() {
		},
		dirxml : function() {
		},
		error : function() {
		},
		group : function() {
		},
		groupCollapsed : function() {
		},
		groupEnd : function() {
		},
		info : function() {
		},
		log : function() {
		},
		markTimeline : function() {
		},
		memory : function() {
		},
		profile : function() {
		},
		profileEnd : function() {
		},
		table : function() {
		},
		time : function() {
		},
		timeEnd : function() {
		},
		timeStamp : function() {
		},
		timeline : function() {
		},
		timelineEnd : function() {
		},
		trace : function() {
		},
		warn : function() {
		}
	}
}
