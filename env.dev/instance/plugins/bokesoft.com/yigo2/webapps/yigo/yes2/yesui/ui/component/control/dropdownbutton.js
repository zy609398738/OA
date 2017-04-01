/**
 * 下拉按钮控件
 * */
YIUI.Control.DropdownButton = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div class="ui-dropbtn btn-group"></div>',

    handler: YIUI.DropdownButtonHandler,

    /**
     * 图标
     */
    icon: '',

    caption: '',
    /** ["xxx","xxx","xxx"...] */
    dropdownItems: [],

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.clickContent = $.isUndefined(meta.onClick) ? "" : meta.onClick.trim();
        this.dropdownItems = meta.dropdownItems;
    },
    
    setTip: function (tip) {
        var tip = this.caption;
        this.base(tip);
    },
    
    onRender: function (ct) {
        this.base(ct);
        var el = this.getEl(),
            dropdownItems = this.dropdownItems,
            caption = this.caption,
            a = this.button = $('<a/>').attr('class', 'btn dp-tgl').attr('data-toggle', 'dropdown').appendTo(el);
        this.icon && this.setIcon(this.icon);
        $('<label>').text(caption).appendTo(a);
        $('<span class="arrow"/>').appendTo(a);
        if (dropdownItems.length > 0) {
            var div = this._dropView = $('<div class="dpbtn-vw"/>').attr('id', this.id + "_dropdown").appendTo($(document.body));
            var uls = $('<ul/>').appendTo(div);
            for (var i = 0; i < dropdownItems.length; i++) {
                var li = $('<li></li>').appendTo(uls);
                if (dropdownItems[i].separator) {
                    li.attr("role", "separator").addClass("sep");
                } else {
                    $('<a>' + dropdownItems[i].text + '</a>').appendTo(li);
                    li.attr("key", dropdownItems[i].key);
                }
            }
        }
    },

    setIcon: function (icon) {
        this.icon = icon;
        if ($("span.icon", this.el).length == 0) {
            $('<span class="icon"/>').css("background-image", "url(Resource/" + icon + ")").appendTo(this.button);
        } else {
            $("span.icon", this.el).css("background-image", "url(Resource/" + icon + ")");
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        var el = $(".dp-tgl", this.el),
            outerEl = this.el;
        if (this.editable) {
            el.removeAttr('disabled');
            outerEl.removeClass("ui-readonly");
        } else {
            el.attr('disabled', 'disabled');
            outerEl.addClass("ui-readonly");
        }
    },

    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.button.css({
            'background-image': 'none',
            'background-color': backColor
        })
    },

    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this.button.css('color', foreColor);
    },

    setFormatStyle: function (cssStyle) {
        $("label", this.button).css(cssStyle);
    },

    onSetWidth: function (width) {
        this.button.css("width", width);
    	$("label", this.button).css("width", width - $("span.icon", this.el).width() - 12);
    },

    onSetHeight: function (height) {
        this.button.css({
            "height": height,
            "line-height": height + "px"
        });
//        $("label", this.el).height(height);
        $("span.arrow", this.el).css("margin-top", (height - 4) / 2 + "px");
		var icon = $("span.icon", this.el);
		icon.css("top", (height - icon.height() - 2) / 2);

    },

    setDisabled: function (disabled) {
        this.base(disabled);

        var children = this.getEl().children();
        $.each(children, function () {
            if (disabled) {
                $(this).attr('disabled', 'disabled');
            } else {
                $(this).removeAttr('disabled');
            }
        });
    },

    hideDropdownList: function () {
    	this._dropView && this._dropView.hide();
        this._hasShow = false;
        this.el.removeClass("focus");
    },

    setDropViewTop: function () {
        var cityObj = this.el;
        var cityOffset = this.el.offset();

        var bottom = $(window).height() - cityOffset.top - cityObj.outerHeight();
        var top = cityOffset.top + cityObj.outerHeight();
        if (bottom < this._dropView.outerHeight()) {
            this._dropView.addClass("toplst");
            this.el.addClass("toplst");
            top = "auto";
            bottom = $(window).height() - cityOffset.top;
        } else {
            this._dropView.removeClass("toplst");
            this.el.removeClass("toplst");
            bottom = "auto";
        }
        if (top != "auto") {
            this._dropView.css("top", top + "px");
            this._dropView.css("bottom", "auto");
        }
        if (bottom != "auto") {
            this._dropView.css("bottom", bottom + "px");
            this._dropView.css("top", "auto");
        }
        this._dropView.css("width", cityObj.outerWidth() + "px");
    },

    setDropViewLeft: function () {
        var cityObj = this.el;
        var cityOffset = this.el.offset();

        var right = $(window).width() - cityOffset.left;
        var left = $(window).width() - this._dropView.outerWidth();
        if (right < this._dropView.outerWidth()) {
            left = "auto";
            right = $(window).width() - cityOffset.left - cityObj.outerWidth();
        } else {
            left = cityOffset.left;
            right = "auto";
        }
        if (left != "auto") {
            this._dropView.css("left", left + "px");
            this._dropView.css("right", "auto");
        }
        if (right != "auto") {
            this._dropView.css("right", right + "px");
            this._dropView.css("left", "auto");
        }
    },

    beforeDestroy: function () {
    	this._dropView && this._dropView.remove();
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },
    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
//        $(window).resize(function () {
//            self.hideDropdownList();
//            $(document).off("mousedown");
//	    });
        self.el.click(function (event) {
            if (!self.enable) {
                return;
            }
            self.el.addClass("focus");
            if (self._hasShow) {
                self.hideDropdownList();
                self._hasShow = false;
                return;
            }
            $(document).on("mousedown", function (e) {
                var target = $(e.target);

                if ((target.closest(self._dropView).length == 0)
                    && (target.closest(self.button).length == 0)) {

                    self.hideDropdownList();
                    $(document).off("mousedown");
                }
            });
            if (!self._dropView) return;

            self.setDropViewTop();
            self.setDropViewLeft();

            //下拉内容显示的位置
            self._dropView.slideDown("fast");

            if (self._dropView[0].scrollWidth > self._dropView[0].clientWidth) {
                self._dropView.children("ul").width(self._dropView[0].scrollWidth);
            }

            self._dropView.css({
                width: self.el.width()
            });

            self._hasShow = true;
            event.stopPropagation();
        });
        $("a", this.el).blur(function() {
        	self.hideDropdownList();
        });
        if (!this.disabled) {
            var dropdownMenu = $("#" + this.id + "_dropdown");
            $("li", dropdownMenu).bind('click', function () {
            	var formula = "";
				var btnKey = $(this).attr("key");
            	var items = self.dropdownItems;
    		    for (var i = 0, len = items.length; i < len; i++) {
    				if(items[i].key == btnKey) {
    					formula = items[i].formula;
    					break;
    				}
    			}
                self.handler.doOnClick(self.ofFormID, formula);
                self.hideDropdownList();
            });
        }
    }

});

YIUI.reg('dropdownbutton', YIUI.Control.DropdownButton);