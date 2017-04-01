/**
 * 功能性控件基础类，其他功能性控件都从它派生。
 */
YIUI.Control = YIUI.extend(YIUI.Component, {
    /**
     * Object。
     * 组件存储到数据库的值，区别于text。
     */
    value: '',
    
    /** 值确认事件中需要的备份值 */
    backupValue: '',

    /**
     * String。
     * 组件显示在界面上的文本，区别于value。
     */
    text: '',

    /**
     * String。
     * 组件值的需要满足的条件。
     */
    checkRule: null,

    /**
     * String。
     * 组件值变化时，需要执行的操作。
     */
    trigger: null,

    /**
     * 组件的事件处理对象
     */
    handler: YIUI.Handler,
    
    behavior: YIUI.BaseBehavior,

    /**
     * 组件触发事件时的回调方法。
     */
    listeners: {
        // TODO 是否把这些与平台后台相关的代码移动到一个独立的文件中？
        /**
         * 鼠标点击组件时的回调方法。
         */
        click: function () {
            this.handler && this.handler.doOnClick(this.ofFormID, this.clickContent);
        },

        /**
         * 组件值变化时的回调方法。
         */
        change: function () {
            var newValue = this.getValue();
            this.handler && this.handler.doValueChanged(this, newValue, true, true);
        }
    },
    
    /** 判断组件的值是否为空值 */
    isNull: function() {
    	return (this.value == null || this.value == undefined || this.value === "") ? true : false;
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
    
    /** 设置控件真实值，对应于数据库中存储的值 */
    setValue: function (value, commit, fireEvent, ignoreChanged, editing) {
		this.backupValue = this.value;
    	var _this = this;
    	var options = {
			oldVal: this.value,
			newVal: value
    	};
    	options = $.extend((options || {}), this.getMetaObj());

    	if(!this.behavior || !this.el) {
            //控件显示的时候 计算默认值，不需要触发change事件
    		this.behavior.checkAndSet(options, function(value) {
//    			_this.value = value;
    			_this.setControlValue(value);
                _this.doChanged(commit, fireEvent, ignoreChanged, editing);
    		});
    		return false;
    	}
    	var changed = this.behavior.checkAndSet(options, function(value) {
    		_this.checkEnd(value);
    	});
		if( changed ) {
			this.doChanged(commit, fireEvent, ignoreChanged, editing);
		}
		return changed;
    },
    
    setControlValue: function(value) {
    	this.value = value;
    },
    
    checkEnd: function(value) {
    	this.value = value;
    },
    
    doChanged: function(commit, fireEvent, ignoreChanged, editing) {
		if ( !ignoreChanged && this.handler ) {
			if ( editing ) {
				// 如果验证通过，则处理changed事件
				var formID = this.ofFormID;
	    		var validation = this.getMetaObj().validation;
				if ( this.handler.validated(formID, validation) ) {
					this.handler.doValueChanged(this, this.getValue(), commit, fireEvent);
				} else {
					// 验证未通过，如果定义了changing事件，则处理changing事件
					var changing = this.getMetaObj().valueChanging;
					if ( this.handler.hasChanging(changing) ) {
						this.changing = true;
						this.handler.changing(formID, changing);
					} else {
						// 如果未定义changing事件，则回滚数据
						this.rollbackValue();
					}
				}
			} else {
				this.handler.doValueChanged(this, this.getValue(), commit, fireEvent);
			}
			this.setTip(this.tip);
		}
	},
    
    /** 获取控件真实值 */
    getValue: function () {
        return this.value;
    },

    /** 设置控件显示值，对应于界面显示。默认与getValue()相同，对于真实值与显示值不同的控件，可覆盖此方法。 */
    setText: function (text) {
        this.setValue(text);
    },

    /** 获取控件显示值，同setText */
    getText: function () {
        return this.getValue();
    },

    /**
     * 设置为必填。
     */
    setRequired: function (required) {
        this.base(required);
        if (this.getEl() && required) {
            this.getEl().placeholder('-必须填写-');
            var _this = this;
            this.bind(null, 'keyup', function () {
            	if (_this.isNull()) {
                    this.getOuterEl().addClass('ui-required');
                } else {
                    this.getOuterEl().removeClass('ui-required');
                }
            });
            this.bind(null, 'blur', function () {
                if (_this.isNull()) {
                    this.getOuterEl().addClass('ui-required');
                } else {
                    this.getOuterEl().removeClass('ui-required');
                }
            });
        }
    }
});
YIUI.reg("control", YIUI.Control);