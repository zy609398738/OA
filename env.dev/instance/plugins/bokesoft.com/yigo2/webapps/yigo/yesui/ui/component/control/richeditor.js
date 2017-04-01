/**
 * 富文本编辑框控件。
 */
YIUI.Control.RichEditor = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<textarea></textarea>',
    editor: null,
    shadow: null,
    _input: null,
    value: null,
    required: false,

    handler: YIUI.RichEditorHandler,

    behavior: YIUI.RichEditorBehavior,

    checkEnd: function(value) {
    	this.value = value;
        if (this.getEl()) {
            this._input.html(value);
        }
    },
    
    getValue: function () {
        var val = this._input.html();
        return val;
    },

    setEnable: function (enable) {
        this.base(enable);
        if (enable) {
            this.shadow.hide();
        } else{
            this.shadow.show();
        }
    },

    setVisible: function(visible)  {
        this.base(visible);
        if (!visible) {
            this.editor.$editorContainer.css("display", "none");
        }  else{
            this.editor.$editorContainer.css("display", "block");
        }
    },

    onSetHeight: function (height) {
        this.getOuterEl().css("height", height);
        var btnHeight = this.editor.$btnContainer.height();
        this.editor.$txtContainer.css("height", height-btnHeight-3);
        this.editor.$txt.css("position", "relative");
        this.editor.$txt.css("min-height", height-btnHeight-3);
        this.shadow.css("height", height);
    },

    onSetWidth: function (width) {
        var btnWidthArr = new Array();
        var btngroups = $(".wangEditor-btn-container-group");
        for (var i=0; i < btngroups.length; i++) {
            btnWidthArr.push(btngroups[i].offsetWidth);
        }
        btnWidthArr.sort(function (a, b) {
            return a-b;
        })
        var maxbtnWidth = btnWidthArr[btnWidthArr.length - 1];
        if (width < maxbtnWidth) {
            var columngap = parseInt(this.getOuterEl().css("margin-left")) || 32;
            var realWidth = maxbtnWidth + columngap;
            this.base(realWidth);
            this.editor.width = realWidth;
            this.shadow.css("width", realWidth);
        } else {
            this.base(width);
            this.editor.width = width;
            this.shadow.css("width", width);
        }
        var btnHeight = this.editor.$btnContainer.height();
        this.editor.$txtContainer.css("height", this.shadow.height()-btnHeight-3);
//        this.shadow.css("top", this.editor.$editorContainer.position().top);
        this.shadow.css("margin-top", this.getOuterEl().css("margin-top"));
        this.shadow.css("margin-left", this.getOuterEl().css("margin-left"));
    },

    onRender: function (ct) {
        this.base(ct);
        this.editor = this.el.wangEditor();
        this.el = this.editor.$editorContainer;
        this.shadow = $("<div class='ui-redt sd'></div>").appendTo(this.container);
        this.shadow.parent().css("position", "relative");
        this._input = this.editor.$txt;
        if (this.value) {
            this._input.html(this.value);
        }
        this.el.addClass("ui-rich")
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },

    setError: $.noop,
    
    install : function() {
        this.base();
        var self = this;
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });

        self._input.bind("blur", function() {
            self.finishInput();
        })
    },

    finishInput: function () {
        var self = this, curValue = this._input.html();
        if (curValue != self.value) {
            self.setValue(curValue, true, true);
            self.valueChange(curValue);
            if (self.getMetaObj().required) {
                var required = (curValue == "");
                self.setRequired(required);
            }
        }
    },

    valueChange: function (newValue) {
        this.setValue(newValue, true, true);
    },

    getOuterEl: function () {
        return this.el;
    }
});
YIUI.reg('richeditor', YIUI.Control.RichEditor);