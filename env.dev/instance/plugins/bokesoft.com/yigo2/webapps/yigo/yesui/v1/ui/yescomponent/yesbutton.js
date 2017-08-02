(function () {
    YIUI.Yes_Button = function (options) {
        var Return = {
            el: $("<div><button></button></div>"),
            /** 图标 */
            icon: null,
            /** 按钮操作类型 */
            type: YIUI.Button_Type.DEFAULT,
            /**  是否显示按钮的文本，默认为显示 */
            init: function () {
                var self = this;
                $("<span class='txt'></span>").appendTo($("button", this.el));
//                this.el.mousedown(function (e) {
//                    self.enable && $(this).addClass("hover");
//                }).mouseup(function (e) {
//                        self.enable &&  $(this).removeClass("hover");
//                    });
                options.icon && this.setIcon(options.icon);
                options.type && this.setType(options.type);
            },
            getEl: function () {
                return this.el;
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this.el, outerEl = this.el;
                if (this.enable) {
                    el.removeAttr('disabled');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('disabled', 'disabled');
                    outerEl.addClass("ui-readonly");
                }
            },
            setIcon: function (icon) {
                this.icon = icon;
                var textButton = $("span.txt", this.el), _icon = $("span.icon", this.el);
                if (_icon.length > 0) {
                    _icon.css("background-image", "url(Resource/" + icon + ")");
                } else {
                    _icon = $("<span class='icon'></span>").css("background-image", "url(Resource/" + icon + ")");
                    textButton.before(_icon);
                }
            },
            setType: function(type) {
            	this.type = type;
            	$("input.type", this.el).remove();
            	if(type == YIUI.Button_Type.UPLOAD) {
            		$("<input type='file' class='type upload' name='file' data-url='upload'/>").appendTo(this.el);
            	}
            },
            getTextButton: function () {
                return $("span.txt", this.el);
            },
            setWidth: function (width) {
                this.el.css("width", width);
                $("button", this.el).css("width", this.el.width());
                $(".upload", this.el).css("width", this.el.width());
//                $(".txt", this.el).css("width", this.el.width());
                var icon = $("span.icon", this.el),
                    iconW = 0;
                if (icon.length > 0) iconW += icon.width();
            },
            setHeight: function (height) {
                this.el.css("height", height);
                $("button", this.el).css("height", this.el.height());
                $(".upload", this.el).css("height", this.el.height());
            }
        };
        Return = $.extend(Return, options);
        Return.init();
        return Return;
    }
})();