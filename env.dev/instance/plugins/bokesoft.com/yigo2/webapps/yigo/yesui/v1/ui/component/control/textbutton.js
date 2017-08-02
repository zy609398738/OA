YIUI.Control.TextButton = YIUI.extend(YIUI.Control.TextEditor, {
    onRender: function (parent) {
        this.base(parent);
        this.el.addClass("ui-txtbtn");
        this._btn = $("<button class='btn'>...</button>").css("width", "30px").appendTo(this.el);
        this._btn.css({verticalAlign: "top", padding: "0"});
    },

    onSetHeight: function (height) {
        this.base(height);
        this._btn.css({height: height + "px"});
    },

    onSetWidth: function (width) {
        this.base(width);
        var btnW = this._btn.outerWidth();
        $("input", this.el).css({width: (width - btnW) + "px"});
        var cIcon = $("span.clear", this.el), right = cIcon[0].style.right;
        cIcon.css({right: (right + btnW) + "px"});
    },

    setEnable: function (enable) {
        this.base(enable);
        this.enable = enable;
        this.install();
    },

    setTip: function (tip) {
        var tip = $("input", this.el).val();
        this.base(tip);
    },
    
    install: function () {
        this.base();
        var self = this;
        this._btn.mousedown(function (e) {
            self.enable && $(this).addClass("hover");
        }).mouseup(function (e) {
                self.enable && $(this).removeClass("hover");
            });
        $(this._btn).unbind("click");
        if (this.enable) {
            // 默认调用fireEvent
            this.bind(this._btn, 'click');
        }
    }
});
YIUI.reg('textbutton', YIUI.Control.TextButton);