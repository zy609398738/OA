YIUI.DictBehavior = (function () {
    var Return = {
    	isEqual: function(v1, v2) {
    		var equal = true;
    		if($.isArray(v1) && $.isArray(v2)) {
    			if(v1.length != v2.length) {
    				equal = false;
    			} else {
    				for (var i = 0, len1 = v1.length; i < len1; i++) {
    					for (var j = 0, len2 = v2.length; j < len2; j++) {
    						if(v1[i].oid != v2[i].oid) {
    							equal = false;
    							break;
    						}
    					}
    				}
    			}
    		} else if(v1 && v2) {
    			equal = v1.oid == v2.oid;
    		} else {
    			equal = v1 == v2;
    		}
    		return equal;
    	},
		checkAndSet: function(options, callback) {
			var oldVal = options.oldVal;
        	var newVal = options.newVal;
        	if(newVal instanceof Decimal) {
        		newVal = newVal.toString();
        	}
        	var equal = this.isEqual(oldVal, newVal);
            if (equal) {
                return false;
            }

            if (newVal == null || newVal == '') {
            	if($.isFunction(callback)) {
                	callback(null);
                }
				return true;
			}
			var text = "", opts;
            if(options.dictCaption == null){
                options.dictCaption = {};
            }
            if (options.multiSelect) {
            	//多选字典的处理
				var oids = [];
				if($.isString(newVal)) {
					oids = newVal.split(',');
                    var  longs = [], vals = [];
                    for(var j=0;j<oids.length;j++){
                    	var oid = parseFloat(oids[j]);
                        longs.push(oid);
                        if (oid != 0) {
                            var caption = options.dictCaption[options.itemKey + "_" + oid];
                            if (caption == null) {
                                caption = YIUI.DictService.getCaption(options.itemKey, oid);
                                options.dictCaption[options.itemKey + "_" + oid] = caption;
                            }
                        }
                        opts = {
    						oid : oid,
    						itemKey : options.itemKey,
    						caption : caption
    					};
                        var val = new YIUI.ItemData(opts);
                        vals.push(val);
                    }
                    newVal = vals;
				} else if($.isArray(newVal)) {
					for (var i = 0, len = newVal.length; i < len; i++) {
						var v = newVal[i];
						var oid = v.oid;
						if (oid != 0 && !v.caption) {
                            var caption = options.dictCaption[options.itemKey + "_" + oid];
                            if (caption == null) {
                                caption = YIUI.DictService.getCaption(options.itemKey, oid);
                                options.dictCaption[options.itemKey + "_" + oid] = caption;
                            }
                            v.caption = caption;
                        } else {
                        	break;
                        }
					}
				}
			} else {
				if (oldVal && newVal) {
					if ((oldVal.itemKey + '_' + oldVal.oid) == (newVal.itemKey
							+ '_' + newVal.oid)) {
						return false;
					}
				}
				if ($.isNumeric(newVal)) {
                    if (parseFloat(newVal) != 0) {
                        text = options.dictCaption[options.itemKey + "_" + parseFloat(newVal)];
                        if (text == null) {
                            text = YIUI.DictService.getCaption(options.itemKey, parseFloat(newVal));
                            options.dictCaption[options.itemKey + "_" + oid] = text;
                        }
                    }
					opts = {
						oid : newVal,
						itemKey : options.itemKey,
						caption : text
					};
					newVal = new YIUI.ItemData(opts);
				} else if (newVal) {
					if(newVal.oid == "0") {
//						newVal = null;
					}else if(newVal.caption == null || newVal.caption == ""){
                        text = options.dictCaption[options.itemKey + "_" + parseFloat(newVal.oid)];
                        if (text == null) {
                            text = YIUI.DictService.getCaption(options.itemKey, parseFloat(newVal.oid));
                            options.dictCaption[options.itemKey + "_" +  parseFloat(newVal.oid)] = text;
                        }
                        newVal.caption = text;
                    }
				}
			}

            if($.isFunction(callback)) {
            	callback(newVal);
            }
            return true;
		}
    };
    Return = $.extend({}, YIUI.BaseBehavior, Return);
    return Return;
})();
