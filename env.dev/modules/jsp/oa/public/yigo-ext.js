(function($) {

	if (typeof(YIGO) == "undefined") 
		return;
	// add runjavascript fun
	YIGO.ui.GlobalMessageBus.unsubscribe(YIGO.ui.Messages.RUNJAVASCRIPT);
	YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.RUNJAVASCRIPT,function(messageData){
		eval(messageData.data.content);
	});

	/**
	 * UEditor 富文本编辑 
	 * @author wangxh2
	 */
	YIGO.apply(YIGO.ui.form.RichEditor.prototype,{
		onResize : function(size){
			if (this.UEditor && size) {
				if (size.height)
					this.UEditor.container.style.height = size.height + 'px';
				if (size.width) 
					this.UEditor.container.style.width = size.width + 'px';
			}
		},
		onRender : function(target){
			YIGO.ui.form.RichEditor.superclass.onRender.call(this, target);
			if (!this.rendered) {
				this.el.innerHTML = '<textarea id="'+this.getId()+'_textarea" ' 
				  +' style="width:'+(this.getWidth()-10)+'px;height:'+(this.getHeight()-10)+'px;resize:none" '
				  +'>'+this.value+'</textarea>';
			} else {
				this.repaint();
			}
			if(!this.rendered){
				(function(){
					var context = YIGO.getContext(this.contextID);
					this.UEditor = UE.getEditor(this.getId()+"_textarea",{
						initialFrameWidth : this.size.width- 8,
						initialFrameHeight: this.size.height - 75,
						zIndex : 99,
						readonly : this.disabled,
						autoFloatEnabled : false,
						autoHeightEnabled:false,
						toolbars:[
								['Source','Undo','Redo','|','customstyle','paragraph','fontfamily','fontsize','Bold','Italic','Underline','searchreplace',
								'Subscript','Superscript','|','RemoveFormat','formatmatch','autotypeset','BlockQuote','pasteplain','|',
								'forecolor','backcolor','insertorderedlist','insertunorderedlist','|'],['rowspacingtop','rowspacingbottom','lineheight',
								'directionalityltr','directionalityrtl','indent','|','justifyleft','justifycenter','justifyright','justifyjustify',
								'fullscreen','|','emotion','scrawl','insertvideo','attachment','map','gmap','pagebreak','template',
								'background','|','insertimage','imagenone','imageleft','imageright','imagecenter','horizontal','spechars','wordimage','|',
								'inserttable','deleterow','deletecol','|','link','preview']
							]
					});
					var __key = this.__key;
					this.UEditor.addListener('blur', function () {
						context.appendSetHeadValue(__key, this.getContent(), false);
					});
				}).defer(1,this);
			}
		},
		getRawValue : function() {
			if (this.UEditor) 
				this.value = this.UEditor.getContent();
			return YIGO.ui.form.RichEditor.superclass.getRawValue.apply(this);
		},
		getValue : function() {
			if (this.UEditor) 
				this.value = this.UEditor.getContent();
			return YIGO.ui.form.RichEditor.superclass.getValue.apply(this);
		},
		setDisabled: function(isReadOnly){
			if (!this.UEditor)
				return;
			if (isReadOnly) {
				this.UEditor.setDisabled();
			} else {
				this.UEditor.setEnabled();
			}
		},
		setValue : function(_val) {
			YIGO.ui.form.RichEditor.superclass.setValue.call(this, _val);
			if (this.UEditor)
				this.UEditor.setContent(_val);
			else
				this.value = _val;
		},
		destroy : function() {
			if (this.UEditor)
				this.UEditor.destroy();
			YIGO.ui.form.RichEditor.superclass.destroy.call(this);
		}
	});

	// override VMinit
	YIGO.VMinit = function(config){
		// 加载前等待图标 (@notice应该提供接口) modify by wangxh
		if (document.getElementById('loading') != null) {
			document.getElementById('loading').style.display = 'block';
			document.getElementById('loading-mask').style.display = 'block';
		} 
		if (YIGO.VMinit.inited==true)
			return;
		YIGO.VMinit.inited=true;
		// NOTICE YIGO.ui.portal.ComponentImpl.js->YIGO.ui.portal.MainTab.initEvents也会调用部分消息注册
		if (config && config.showview==false) {
		} else {
			YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.SHOWVIEW,function(messageData){
				var context = YIGO.getContext(messageData.context);
				if(!context){
					context = new YIGO.ui.BillContext(messageData.context);
					context.setContainer($('body')[0]); // YIGO.getBody() // $('body')[0]
					if (config && config.iswindowalways==true) {
						//OA产品里叙事簿弹出窗口的contextid和父亲不一致
						messageData.data.billform.iswindow = true;
						messageData.data.billform.windowheight = 400;
						messageData.data.billform.windowwidth = 500;
					}
				}
				YIGO.setActiveContext(context);
				var view = YIGO.UICache.findViewById(messageData.viewer);
				YIGO.UIOptCenter.showview(view,messageData.data,context.formConfig);
				context = null;
				view = null;
				// 加载完毕后等待图标关闭 modify by wangxh
				if (document.getElementById('loading') != null) {
					document.getElementById('loading').style.display = 'none';
					document.getElementById('loading-mask').style.display = 'none';
				}
			});
		}
		if (config && config.error==false) {
		} else {
			YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.ERROR,function(messageData){
				if (YIGO.DebugUtil.cmdError) {
					YIGO.DebugUtil.cmdError(messageData.data);
				} else {
					YIGO.DebugUtil.alert(messageData.data.message);
				}
			});
		}
		if (config && config.closealltab==false) {
		} else {
			YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.CLOSEALLINTAB,function(messageData){
				YIGO.UIOptCenter.closeAllInTab(null,messageData);
			});
		}
		if (config && config.closetab==false) {
		} else {
			YIGO.ui.GlobalMessageBus.subscribe(YIGO.ui.Messages.CLOSETAB,function(messageData){
				var context = YIGO.getContext(messageData.context);
				if (!context) return;
				if (context.billView && context.billView.metaKey=='LOGIN'){
					if(YIGO_C_ENV.sessionID > 0){
						YIGO.ui.GlobalMessageBus.publish(YIGO.ui.Messages.LOGINSUCCESS);
					}else{
						YIGO.ui.GlobalMessageBus.publish(YIGO.ui.Messages.LOGINCANCEL);
					}
				}
				YIGO.UICache.removeCtx(context.contextID);
				context = null;
			});
		}
	};
	// IE9 以下Array不支持forEach方法
	if (!Array.prototype.forEach)  {  
		Array.prototype.forEach = function(fun){  
			var len = this.length;  
			if (typeof fun != "function")  
            throw new TypeError();   
			var thisp = arguments[1];  
			for (var i = 0; i < len; i++) {  
				if (i in this)  
					fun.call(thisp, this[i], i, this);  
			}  
		};  
	}  
	
})();
