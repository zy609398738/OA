(function () {
    var id = 0;
    YIUI.Yes_CheckBox = function (options) {
        id++;
        var Return = {
            id: id,
            el: $("<div></div>"),
            /**是否默认选中*/
            checked: false,
            /**显示文本*/
            text: "",

            getEl: function () {
                return this.el;
            },
            init: function () {
                $("<input type='checkbox' class='chk'/>").attr("id", "chk_" + this.id).appendTo(this.el);
                $("<label></label>").attr("for", "chk_" + this.id).appendTo(this.el);
            },
            setChecked: function (checked) {
                this.checked = checked;
                var checkBox = $("input", this.el);
                if (checked === true) {
                    checkBox.attr('isChecked', true);
                    checkBox.addClass('checked');
                    checkBox[0].checked = true;
                } else {
                    checkBox.attr('isChecked', false);
                    checkBox.removeClass("checked");
                    checkBox[0].checked = false;
                }
            },
            setText: function (text) {
                var label = $("label", this.el);
                //var isShow = !(text === undefined || text.length == 0);
                if(text === undefined || text.length == 0){
                    label.css('background-position','center');
                }
                //label.css({display: (isShow ? "inline-block" : "none")})
                label.html(text);
            },
            getCheckBox: function () {
                return $("input", this.el);
            },
            getLabel: function () {
                return $("label", this.el);
            },
            getValue: function () {
                return  $("input", this.el).attr("isChecked") === "true" ? 1 : 0;
            },
            getText: function () {
                return  $("label", this.el).html();
            },
            setHeight: function (height) {
                $("label", this.el).css({height: height + "px", lineHeight: height + "px" });
                var $input = $("input", this.el);
                $input.css("margin-top", (height - $input.height()) / 2);
            },
            setWidth: function (width) {
                $("label", this.el).css("width", width - $("span", this.el).outerWidth());
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this.getCheckBox(), outerEl = this.el;
                if (this.enable) {
                    el.removeAttr('disabled');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('disabled', 'disabled');
                    outerEl.addClass("ui-readonly");
                }
            },
            install: function () {
                var self = this;
                this.getCheckBox().click(function (e) {
                    if (!self.enable) return;
//                    if ($(this).attr('isChecked') == 'true') {
//                        self.setChecked(false);
//                    } else {
//                        self.setChecked(true);
//                    }
                });
            }
        };
        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        Return.install();
        return Return;
    }
})();