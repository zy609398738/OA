(function ($) {

    YIUI.Control.StepEditor = YIUI.extend(YIUI.Control, {

        handler: YIUI.StepEditorHandler,
        
        behavior: YIUI.StepEditorBehavior,

        init: function (options) {
            this.base(options);
            if (this.value == "") {
            	this.value = this.minvalue;
            	
            }
            this.settings = {
               
                //最大值
                vMax: this.maxvalue,
                //最小值
                vMin: this.minvalue,
                //样式
                style: this.style,
                //值类型
                scale: this.scale,
                //加减限度
                step: this.step
            };
         
           
        },


        /**
         * 返回值的时候
         */
        getValue: function () {
            return this.yesStepEd.getValue();
        },

        getFormatEl: function() {
        	return this.yesStepEd.getInput();
        },
        
        setBackColor: function (backColor) {
            this.yesStepEd.setBackColor(backColor);
        },

        onSetHeight: function (height) {
            this.yesStepEd.setHeight(height);
        },

        onSetWidth: function (width) {
            this.yesStepEd.setWidth(width);
        },
        
        checkEnd: function(value) {
        	this.value = value;
        	this.yesStepEd.setValue(value);
    		$("input", this.yesStepEd.el).val(value);
        },
        
    	isNull: function() {
        	return $.isEmptyObject(this.value) ? true : false;
        },

    	commitValue: function() {
    		if ( this.changing ) {
    			if ( this.handler ) {
    				this.handler.doValueChanged(this, this.getValue(), true, true);
    			}
    		}
    		this.changing = false;
    	},
    	
        rollbackValue: function() {
    		this.changing = false;
    		this.setValue(this.backupValue, false, false, true, false);
        },

        //控件处理本身的渲染形成一个完整的控件Dom对象，添加到传入的父亲Dom对象，返回该控件Dom对象的ID
        onRender: function (parent) {
            this.base(parent);
            this.el.addClass("ui-steped");
            var spanup = $("<span class='spanup'/>")
            var spandown = $("<span class='spandown'/>")
            if (this.style == 0) {
            	spanup.appendTo(this.el);
            	spandown.appendTo(this.el);
            }
            if (this.style == 1) {
            	spanup.addClass("span1");
            	spandown.addClass("span1");
                var spanwarp = $("<div class ='spanwarp' />");
                spanup.appendTo(spanwarp);
            	spandown.appendTo(spanwarp);
                
                spanwarp.appendTo(this.el);
            }
            var scale = this.settings.scale;
            var $this = this;
            this.yesStepEd = new YIUI.Yes_StepEditor({
                el: $this.el,
                value: $this.value,
                settings: $this.settings,
                selectOnFocus: $this.selectOnFocus,
                commitValue: function (newValue) {
                    $this.setValue(newValue, true, true);
                }
            });
            if (this.value == "") {
            	this.setValue((this.settings.vMin).toFixed(scale),false,false);
            	this.value = (this.settings.vMin).toFixed(scale);
            } else {
            	 this.setValue(this.value, false, false);
            }
           
            
        },


        focus: function () {
            this.yesStepEd && this.yesStepEd.getInput().focus();
        },
        
        install:function(){
            var self = this;
            this.yesStepEd.getInput().keydown(function (event) {
                var keyCode = event.keyCode || event.charCode;
                if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                    self.focusManager.requestNextFocus(self);
                    event.preventDefault();
                }
            });
        }
    	
    });
    YIUI.reg('stepeditor', YIUI.Control.StepEditor);
}(jQuery));