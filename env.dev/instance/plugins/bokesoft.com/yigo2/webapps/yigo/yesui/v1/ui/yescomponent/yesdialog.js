(function() {
	YIUI.Yes_Dialog = function(options) {
		var defaul = {
			el: $("<div></div>"),
			msg: "是否关闭",
			msgType: YIUI.Dialog_MsgType.YES_NO,
			items: []
		};
		options = $.extend(defaul, options);
		var msgType = options.msgType, items;
		var OK_Btn = {
			key: "OK",
			caption: "确定"
		};
		var YES_Btn = {
			key: "YES",
			caption: "是"
		};
		var NO_Btn = {
			key: "NO",
			caption: "否"
		};
		var Cancel_Btn = {
			key: "Cancel",
			caption: "取消"
		};
		switch(msgType) {
			case YIUI.Dialog_MsgType.DEFAULT:
				items = [OK_Btn];
				break;
			case YIUI.Dialog_MsgType.YES_NO:
				items = [YES_Btn, NO_Btn];
				break;
			case YIUI.Dialog_MsgType.YES_NO_CANCEL:
				items = [YES_Btn, NO_Btn, Cancel_Btn];
				break;
		}
		options.items = items;
		var dialogDiv = options.el.attr("id", "close_dialog");
		var btns = {};
		var createHtml = function(hasOK, hasYes, hasNO, hasCancel) {
	    	var label = new YIUI.Control.Label({
				metaObj: {
		    		x: 1,
		    		y: 1,
		    		colspan: 2,
		    		topMargin: 0,
					visible: true
				},
	    		caption: options.msg
	    	});
	    	
	    	var item, btn;
	    	var gridpanel = new YIUI.Panel.GridLayoutPanel({
				metaObj: {
					rowGap : 5,
					columnGap : 2
				},
	    		widths : [5, "50%", "50%"],
	    		minWidths : [ "-1", "-1", "-1"],
	    		heights : [5, "pref", "100%", 25, 15]
	    	});
	    	gridpanel.add(label);
	    	
	    	var flowpanel = new YIUI.Panel.FlexFlowLayoutPanel({
				metaObj: {
					x: 1,
					y: 3,
					colspan: 2,
					visible: true,
					cssClass: "dialog_btns"
				}
	    	});
	    	
	    	for (var i = 0, len = items.length; i < len; i++) {
				item = items[i];
				btn = new YIUI.Control.Button({
					metaObj: {
						key: item.key,
						width: 60,
						height: 25,
						left: i*5
					},
					caption: item.caption,
		    		listeners: null,
		    		value : item.caption
    				
		    	});
		    	btns[item.key] = btn;
		    	flowpanel.add(btn);
			}
	    	gridpanel.add(flowpanel);
	    	return gridpanel;
	    }

		var content = createHtml();
		
		var Return = {
			el: dialogDiv,
			show: function() {
				var settings = {title: options.title, showClose: false, width: "auto", height: "100px"};
				settings.resizeCallback = function() {
					var dialogContent = dialogDiv.dialogContent();
					if(content.hasLayout) {
						content.doLayout(dialogContent.width(), dialogContent.height());
					} else {
						content.setWidth(dialogContent.width());
						content.setHeight(dialogContent.height());
					}
		        }
		        dialogDiv.modalDialog(null, settings);
		        content.render(dialogDiv.dialogContent());
		        var btn;
		        for (var key in btns) {
		        	btn = btns[key];
		        	btn.el.attr("key", key);
		        	btn.el.addClass("dlg-btn");
		        	btn.el.unbind();
				}
		        var left = ($(window).width() / 2 - dialogDiv.width() / 2) + "px";
		        var top = ($(window).height() / 2 - dialogDiv.height() / 2) + "px";
		        dialogDiv.css({left: left, top: top});
			},

			parseOpt: function(key) {
				var opt = -1;
				if(key == YIUI.Dialog_Btn.STR_YES){
					opt = YIUI.Dialog_Btn.YES_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_NO){
					opt = YIUI.Dialog_Btn.NO_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_CANCEL){
					opt = YIUI.Dialog_Btn.CANCEL_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_OK){
					opt = YIUI.Dialog_Btn.OK_OPTION;
				}
				return opt;	
			},
			close: function() {
				dialogDiv.close();
			}
		};
		return Return;
		
	}
})();

