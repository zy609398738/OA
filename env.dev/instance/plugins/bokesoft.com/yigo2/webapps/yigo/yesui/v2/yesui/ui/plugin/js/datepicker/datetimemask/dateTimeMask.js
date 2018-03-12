//====================================================================================================
// [插件名称] jQuery DateTimeMask
//----------------------------------------------------------------------------------------------------
// [描    述] jQuery DateTimeMask日期掩码插件，它是基于jQuery类库，实现了js脚本于页面的分离。对一个单行
//			  文本框，你只要需要写：$("input_id").DateTimeMask();就能完美的实现输入控制，目前能实现5种日
//			  期掩码控制。在ie6.0和firefox3.0下调试通过。本插件采用配置信息的思想，你可以轻松扩展里面的
//			  功能，从而符合自己的业务逻辑需要
//----------------------------------------------------------------------------------------------------
// [作者网名] 猫冬	
// [日    期] 2008-02-04	
// [邮    箱] wzmaodong@126.com
// [作者博客] http://wzmaodong.cnblogs.com
//====================================================================================================
$.fn.DateTimeMask = function(settings){
	var options = {
		safemodel: true,					//安全模式下，不能粘贴，不能拖拉
		masktype: 3,						//1:yyyy-MM-dd HH:mm:ss 3:yyyy-MM-dd 
		isnull: false,						//是否可以全部都是0
		lawlessmessage: YIUI.I18N.date.formatError,	//非法格式的提示信息
		onlycontrolkeydown: false,			//只控制输入
		focuscssname: "",					//获得焦点的样式
		oldclassname: "",					//记录当前的样式
		maxLength: 10,
		dateSep: "-",
		timeSep: ":",
		isnow: false,
		ismonthstart: false,
		whenfocus:function(){},				//获得焦点时候的回调函数。无返回值。
		whenblur: function(){return true;}	//失去焦点时候的回调函数。return ture 表示额外校验成功；return false:恢复到上次的值
	};
	settings = settings || {};
	$.extend(options, settings);
	return this.each(function(){
		//初始化
		if(options.isnow) this.value = $.DateTimeMask.getDateTime(options);
		if(options.masktype == 1) {
			options.maxLength = 19;
			options.preText = "2001"+options.dateSep+"01"+options.dateSep+"01 00"+options.timeSep+"00"+options.timeSep+"00";
		} else {
			options.preText = "2001"+options.dateSep+"01"+options.dateSep+"01";
		}
		$(this).attr("autocomplete", "off");
		$(this).attr("maxLength", options.maxLength);
		
		if (options.safemodel) {
			if ($.browser.isIE) {
				this.ondragenter = function(){return false;};
				this.onpaste = function(){return false;};
			}
		}

		$(this).keydown(function(event){
			$.DateTimeMask.KeyDown(this,event,options);
		})
		if (!options.onlycontrolkeydown) {
			$(this).focus(function(){
				$.DateTimeMask.SetFocus(this,options);
				options.whenfocus();
			});
			$(this).blur(function(){
				if(!$.DateTimeMask.LostFocus(this,options))
				{
					if(!options.whenblur(this.value)) this.value = this.oldvalue;
				}
			});
		}
	});
};

$.DateTimeMask = {
	//获得焦点时候的处理函数
	SetFocus : function(obj,options) {
		obj.oldvalue = obj.value;
		if(obj.focuscssname && obj.focuscssname!="") {
			obj.oldClassName = obj.className;
			obj.className = obj.focuscssname;
		}
	},

	//失去焦点时候的处理函数
	LostFocus : function(obj,options) {
		options.newValue = "";
		var ls_date,ls_time;
		var lb_error = false;
		switch(options.masktype) {
			case 1:
				ls_date = obj.value.split(" ")[0];
				ls_time = obj.value.split(" ")[1];
				
				if(obj.value == options.preText) {
					if(!options.isnull) lb_error = true;
				} else if(obj.value != "") {
					if(!($.DateTimeMask.isValidDate(ls_date) && $.DateTimeMask.isValidTime(ls_time))) lb_error = true;
				}
				break;
			case 3:
				ls_date = obj.value;
				if(ls_date == options.preText) {
					if(!options.isnull) lb_error = true;
				} else if(obj.value != "") {
					if(!$.DateTimeMask.isValidDate(ls_date)) lb_error = true;
				}
				break;
		}
		if(lb_error){
			var len = obj.value.length,
				maxLength = options.maxLength,
				value = "",
		    	nCursorPos = $.DateTimeMask.GetCursor(obj).start;
			if(len <= maxLength && nCursorPos <= maxLength) {
				value = obj.value + options.preText.substring(len);
			} 
			obj.value = value;
			ls_date = value.split(" ")[0];
			ls_time = value.split(" ")[1];
			if(!($.DateTimeMask.isValidDate(ls_date) && (ls_time ? $.DateTimeMask.isValidTime(ls_time) : true))) obj.value = "";
		}
		if (obj.focuscssname && obj.focuscssname!="") obj.className = obj.oldClassName;
		return lb_error;
	},

	//按键时候的处理函数
	KeyDown : function(objTextBox,event,options) { 
	    //按键常量
	    var KEY = {
			BACKSPACE: 8,
		    TAB: 9,
		    ENTER: 13,
			END: 35,
			HOME: 36,
		    LEFT: 37,
			RIGTH: 39,
		    DEL: 46
	    };
	    var nKeyCode = event.keyCode; 
	    // 特殊处理的按键 
	    switch(nKeyCode){
	        case KEY.TAB:
			case KEY.HOME:
			case KEY.END:
	        case KEY.LEFT:
	        case KEY.RIGTH:
	            return;
	        case KEY.ENTER:
				event.preventDefault();
			    if(options.EnterMoveToNext) event.keyCode = 9;
	            return;
	    }
	    //只读就不执行任何操作
	    if(objTextBox.ReadOnly) {
		    event.returnValue = false;
		    return;
	    }
	    // 当前文本框中的文本 
//	    var strText = objTextBox.value;
	    var strText = "";
	    // 文本长度 
	    var nTextLen=options.maxLength; 
	    // 当前光标位置 
	    var cursor = $.DateTimeMask.GetCursor(objTextBox);
	    var nCursorPos = cursor.start;
	    var endPos = cursor.end;
		//忽略按键
	    event.returnValue = false; 
		//阻止冒泡
//		event.preventDefault();
	    // 自行处理按钮 
	    switch (nKeyCode) {
	        case KEY.DEL:
	            
	            break; 
	        default :
	            if(!((nKeyCode >=48 && nKeyCode<=57) || (nKeyCode >=96 && nKeyCode<=105)) && nKeyCode != 8 && nKeyCode != 109 && nKeyCode != 189){
	            	event.preventDefault();
	            	return true;
	            }
				var oldV = objTextBox.oldvalue;
	        	
	        	if(/*objTextBox.selectionEnd < nTextLen && */objTextBox.value.length >= nTextLen) {
//	        		event.preventDefault();
//	            	return true;
	        	}
				if (nKeyCode > 95) nKeyCode -= (95-47); 
				
				if(oldV.length > nCursorPos && (nKeyCode >=48 && nKeyCode<=57)) {

					var selrange = endPos - nCursorPos;
		        	if(selrange > 1) {
		        		var code = options.preText.substring(nCursorPos, endPos);
		        		oldV = oldV.substr(0, nCursorPos) + code + oldV.substr(endPos); 
		        	}

					var keycode = String.fromCharCode(nKeyCode);
					var text = oldV.substr(0, nCursorPos) + keycode + oldV.substr(nCursorPos+1,nTextLen); 
					if(!$.DateTimeMask.DealWith(options.masktype, text, nCursorPos)) {
						event.preventDefault();
						return true;
					} else {
						if(selrange == oldV.length) {
							objTextBox.oldvalue = "";
						} else {
							objTextBox.oldvalue = text;
						}
					}
					return;
				}
				
				if(nKeyCode >=48 && nKeyCode<=57) {
					var keycode = String.fromCharCode(nKeyCode);
					var text;
					
					if(nCursorPos == 4) {
						objTextBox.value += options.dateSep;
						if(nKeyCode > 49) {
							objTextBox.value += "0";
							nCursorPos += 2;
						} else {
							nCursorPos += 1;
						}
					} else if ((nCursorPos == 5 && nKeyCode > 49) || (nCursorPos == 8 && nKeyCode > 51) ) {
						objTextBox.value += "0";
						if(keycode != "0") {
							var preText = options.preText.substr(0, nCursorPos+1) + "0" + options.preText.substr(nCursorPos+2, nTextLen);
							text = objTextBox.value + keycode + preText.substr(nCursorPos+2,nTextLen); 
						}
						if(!$.DateTimeMask.DealWith(options.masktype,text,nCursorPos)) {
							event.preventDefault();
							return true;
						}
						nCursorPos++;
					} else if(nCursorPos == 7) {
						objTextBox.value += options.dateSep;
						if(nKeyCode > 51) {
							objTextBox.value += "0";
							nCursorPos += 2;
						} else {
							nCursorPos += 1;
						}
					} else {
						text = objTextBox.value + keycode + options.preText.substr(nCursorPos+1,nTextLen); 
						if(!$.DateTimeMask.DealWith(options.masktype,text,nCursorPos)) {
							event.preventDefault();
							return true;
						}
					}
					if(options.masktype == 1) {
						if(nCursorPos == 10) {
							objTextBox.value += " ";
							if(nKeyCode > 50 && nKeyCode <= 57) {
								objTextBox.value += "0";
							}
						} else if(nCursorPos == 13 || nCursorPos == 16) {
							objTextBox.value += options.timeSep;
							if(nKeyCode > 53) {
								objTextBox.value += "0";
							}
						} else {
							text = objTextBox.value + keycode + options.preText.substr(nCursorPos+1,nTextLen); 
							if(nCursorPos == 8 && nKeyCode >= 51) {
								text = objTextBox.value + keycode + "0" + options.preText.substr(nCursorPos+2, nTextLen); 
							}
							if(!$.DateTimeMask.DealWith(options.masktype,text,nCursorPos)) {
								event.preventDefault();
								return true;
							}
						}
					}
//					if(nCursorPos == 5 || nCursorPos == 8) {
//						if(keycode != "0") {
//							options.preText = options.preText.substr(0, nCursorPos+1) + "0" + options.preText.substr(nCursorPos+2, nTextLen);
//						}
//					}
				}
				
				if(nKeyCode == 61 || nKeyCode == 141) {
					if(!(nCursorPos == 4 || nCursorPos == 7)) {
						event.preventDefault();
						return true;
					}
				}
				
				if(nKeyCode == 138) {
					if(!(nCursorPos == 13 || nCursorPos == 16)) {
						event.preventDefault();
						return true;
					}
				}

	            break; 
	    } 
//	    $.DateTimeMask.Selection(objTextBox,nCursorPos,nCursorPos); 
	},
	
	//根据光标所在的位置，判断输入的字符是否合法
	DealWith : function(masktype,input,nCursorPos) {
	    var ls_date,ls_year,ls_month,ls_day,ls_time,ls_hour,ls_minute,ls_second;
	    if(masktype <= 3) {
	        ls_year = input.substr(0,4);  
	        ls_month = input.substr(5,2);  
	        ls_day = input.substr(8,2);  
	        ls_date = ls_year +"-"+ ls_month +"-"+ ls_day; 
	        ls_time = "00:00:00";
	        if(masktype==1) {				
	        	ls_hour = input.substr(11,2);
	        	ls_minute = input.substr(14,2);
	        	ls_second = input.substr(17,2);
	        	ls_time = ls_hour +":"+ ls_minute +":"+ ls_second;
			}
	        //光标所在的位置进行判断当前字符串是否合法
			return (nCursorPos<=10?$.DateTimeMask.isValidDate(ls_date):$.DateTimeMask.isValidTime(ls_time))
	    }
	    return true; 
	},

	//动作：获取光标所在的位置，包括起始位置和结束位置
	GetCursor : function(textBox) {
		var obj = new Object();
		var start = 0,end = 0;
		if ($.browser.isIE && $.browser.version < 11) {
			var range=textBox.createTextRange(); 
			var text = range.text;
			var selrange = document.selection.createRange();
			var seltext = selrange.text;
			
			selrange.moveStart("character",-textBox.value.length); 
//			selrange.setEndPoint("StartToStart", range);
			
			start = selrange.text.length;
			end = seltext.length;
			
//			while(selrange.compareEndPoints("StartToStart",range)>0){ 
//				selrange.moveStart("character",-1); 
//				start ++;
//			}
//			while(selrange.compareEndPoints("EndToStart",range)>0){ 
//				selrange.moveEnd("character",-1); 
//				end ++;
//			}
		} else {
			start = textBox.selectionStart;
			end = textBox.selectionEnd;
		}
		obj.start = start;
		obj.end = end;
		return obj;
	},
	
	//动作：让field的start到end被选中
	Selection : function(field, start, end) {
		if( field.createTextRange ) {
			var r = field.createTextRange();
			r.moveStart('character',start);
			r.collapse(true);
			r.select(); 
		} else if ( field.setSelectionRange ){
			field.setSelectionRange(start, end);
		} else {
			if( field.selectionStart ) {
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	},
	
	//是否为日期
	isValidDate : function(strDate) {
		var ls_regex = "^((((((0[48])|([13579][26])|([2468][048]))00)|([0-9][0-9]((0[48])|([13579][26])|([2468][048]))))-02-29)|(((000[1-9])|(00[1-9][0-9])|(0[1-9][0-9][0-9])|([1-9][0-9][0-9][0-9]))-((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30))|(((0[1-9])|(1[0-2]))-((0[1-9])|(1[0-9])|(2[0-8]))))))$";
		var exp = new RegExp(ls_regex, "i");
		return exp.test(strDate);
	},
	
	//是否为时间
	isValidTime : function(strTime) {
		if(!strTime) return false;
		var a = strTime.match(/^(\d{2,2})(:)?(\d{2,2})\2(\d{2,2})$/);
        if (!a || a[1]>23 || a[3]>59 || a[4]>59) return false;
        return true;
	},

	getDateTime : function(options) {
		var d;
		if(options.isnow) {
			d = new Date();
		}
		var vYear = d.getFullYear();
		var vMon = d.getMonth() + 1;
		vMon = (vMon<10 ? "0" + vMon : vMon);
		var vDay = d.getDate();
		var ls_date = vYear+"-"+vMon+"-"+(vDay<10 ?  "0"+ vDay : vDay );
		var vHour = d.getHours();
		var vMin = d.getMinutes();
		var vSec = d.getSeconds();
		var ls_time = (vHour<10 ? "0" + vHour : vHour) + ":"+(vMin<10 ? "0" + vMin : vMin)+":"+(vSec<10 ?  "0"+ vSec : vSec );
		switch(options.masktype) {
			case 1:
				return (ls_date + " " + ls_time);
			case 3:
				return ls_date;
		}
		
	}
}