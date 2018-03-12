/**
 * 工具栏
 */
YIUI.Control.Toolbar = YIUI.extend(YIUI.Control, {
    handler: YIUI.ToolBarHandler,
    height: 36,
    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();

        this.isDefault = $.isDefined(this.getMetaObj().isDefault)? this.getMetaObj().isDefault : true ;

        this.items = [];
    },

    isDataBinding: function() {
        return false;
	},
    renderMenu: function () {
        var ul = this.ul;
        if (typeof  ul != "undefined") {
            ul.attr('id', this.id + '_toolbar').addClass('tbr-ul');
            var _li = ul.children("li").addClass("tbr-item");
            var _a = _li.children("a").addClass("tbr-btn");
            _a.each(function () {
                if ($(this).attr("icon")) {
                    $("<span class='icon'></span>").css("background-image", "url(Resource/" + $(this).attr("icon") + ")").appendTo($(this));
                }
            });
            var _ul = $("ul", _li).addClass("tbr-vw").attr("tabindex", "0");
            $("li", _ul).addClass("dp-item").attr("tabindex", "-1");
        }


        for (var i = 0, len = this.ul.children().length; i < len; i++) {
            var _li = this.ul.children().eq(i);
            var item = this.items[_li[0].index];
            _li[0].item = item;
            _li.attr("key", item.key);
            if (item.items) {
                for (var j = 0, length = $("ul", _li).children().length; j < length; j++) {
                    var child = $("ul", _li).children().eq(j);
                    child[0].item = item.items[child[0].index];
                    child.attr("key", item.items[child[0].index].key);
                }
            }
        }
    },

    onSetWidth: function (width) {
        this.base(width);
        this.ul.width(width - this._dropBtn.width());
        $("li", this.ul).removeClass("hide");
        var children = this.ul.children().not(":hidden"), child;
        if (children.length > 0 && children.last().position().top > children.first().position().top) {
            this._dropBtn.addClass("show");
            var _div = this.dropView.empty();
            var _ul = $("<ul></ul>").appendTo(_div);
            _ul.addClass("tbr-ul");
            _div.css('top', (this.el.offset().top + this.el.outerHeight()) + "px");
            _div.css("z-index", $.getZindex(this._dropBtn) + 1);
            for (var i = 0, len = children.length; i < len; i++) {
                child = children.eq(i);
                if (child.position().top > children.first().position().top) {
                    var newChild = child.clone();
                    child.addClass("hide");
                    _ul.append(newChild);
                    newChild[0].item = child[0].item;
                    var items = child.find("li.dp-item");
                    if (items.length > 0) {
                        for (var j = 0, length = items.length; j < length; j++) {
                            newChild.find("li.dp-item")[j].item = items[j];
                        }
                    }
                }
            }
        } else {
            this._dropBtn.removeClass("show");
            this.dropView && this.dropView.children().remove();
        }
    },

    onSetHeight: $.noop,

    onRender: function (ct) {
        this.base(ct);
        this.el.addClass("ui-tbr");
        this.ul = this.renderItems(this.el, this.items);
        this._dropBtn = $("<span class='dp-btn'></span>").appendTo(this.el);
        this.dropView = $("<div class='tbr-dpvw'></div>").appendTo($(document.body));
        this.renderMenu();
    },

    repaint: function () {
    	if(!this.ul) return;
        this.ul.remove();
        this.ul = this.renderItems(this.el, this.items);
        this.renderMenu();
    },

    renderItems: function (parent, items) {

        var self = this;

    	var _renderItems = function (parent, items) {

            var ul = parent.children("ul");
            if(ul.length == 0) {
                ul = $('<ul></ul>').appendTo(parent);
            }

            var li,
                a,
                span;

            for (var i = 0,item;item = items[i];i++) {
                li = $('<li></li>').appendTo(ul);
                li.css({display: (item.visible ? "block" : "none")});
                li.key = item.key;
                li[0].index = i;
                a = $('<a></a>').appendTo(li);
                if ( item.icon ) {
                    a.attr('icon', item.icon);
                    a.addClass("pri-icon");
                }
                span = $("<span class='txt'/>").html(item.caption).appendTo(a);
                if( $.browser.isIE && li.key && li.key.toLowerCase().indexOf('upload') != -1 ){
                    $("<input type='file' class='upload' name='file'/>").appendTo(span);
                }
                if ((!item.enable && !item.selfDisable) || !self.enable) {
                    li.addClass("ui-readonly");
                }
                if ($.isArray(item.items)) {
                    if (!item.selfDisable) {
                        li.addClass("sp-btn");
                        a.addClass("btn-left");
                        $("<a><span class='arrow'></span></a>").addClass("btn-right").appendTo(li);
                    } else {
                        li.addClass("dpd-btn");
                        $("<span class='arrow'></span>").appendTo(a);
                    }
                    _renderItems(li, item.items);
                }
            }
        }

        if (items && items.length > 0) {
            this.el.removeClass("empty");
            _renderItems(parent,items);
        } else {
            this.el.addClass("empty");
        }

        return self.el.children("ul");
    },

    setItemVisible: function (key, visible) {
        if( !this.el ) return;
        var items = this.items;
        for (var i = 0, li,item; item = items[i];i++) {
            if (item.key === key) {
            	item.visible = visible;
            	$("[key='" + key + "']", this.el).css({display: (visible ? "block" : "none")});
                break;
            }
        }
    },

    setItemEnable: function (key, enable) {
        if( !this.el ) return;
        var items = this.items,changed;
        for (var i = 0, li,item; item = items[i];i++) {
            if (item.key === key) {
                changed = (item.enable != enable);
            	item.enable = enable;
            	changed && $("[key='" + key + "']", this.el).toggleClass("ui-readonly");
                break;
            }
        }
    },

    beforeDestroy: function () {
    	this.dropView && this.dropView.remove();
    },
	
	needTip: function() {
		return false;
	},

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        self.el.delegate("li", "click", $.debounce(100, function (event) {
            var _this = $(this);
            var _this = $(event.target);

            if(!event.target.tagName.equalsIgnoreCase("li")) {
           	    _this = _this.parents("li").eq(0);
            }
            
            if (_this.hasClass("ui-readonly")) return;
            if (_this.hasClass("dpd-btn")) {
                _this.toggleClass("show");
            } else if (_this.hasClass("sp-btn") && ($(event.target).hasClass("btn-right") || $(event.target).hasClass("arrow"))) {
                _this.toggleClass("show");
            } else {
                self.item = _this[0].item;
                YIUI.HeadInfos.put(YIUI.HeadInfoType.SysOpt, this.item.key);
                self.handler.doOnClick(self.ofFormID, self.item);
                YIUI.HeadInfos.remove(YIUI.HeadInfoType.SysOpt);
            }
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if ((target.closest($("ul", _this)).length == 0)
                    && (target.closest(_this).length == 0)) {
                    _this.removeClass("show");
                }
            });
        }));

        self.el.delegate(".upload","click",function (event) {
            var target = event.target;
            var li = $(target).closest('li');
            if( li.hasClass('ui-readonly') )
                return;
            window.up_target = target;
            YIUI.HeadInfos.put(YIUI.HeadInfoType.SysOpt, this.item.key);
            self.handler.doOnClick(self.ofFormID, li[0].item);
            YIUI.HeadInfos.remove(YIUI.HeadInfoType.SysOpt);
            event.stopPropagation();
        });

        self.dropView.delegate("li", "click", function (event) {
            var _this = $(this);
            if (_this.hasClass("ui-readonly")) return;
            if (_this.hasClass("dpd-btn")) {
                _this.toggleClass("show");
            } else if (_this.hasClass("sp-btn") && ($(event.target).hasClass("btn-right") || $(event.target).hasClass("arrow"))) {
                _this.toggleClass("show");
            } else {
                self.dropView.removeClass("show");
                self.item = this.item;
                YIUI.HeadInfos.put(YIUI.HeadInfoType.SysOpt, this.item.key);
                self.handler.doOnClick(self.ofFormID, self.item);
                YIUI.HeadInfos.remove(YIUI.HeadInfoType.SysOpt);
                event.stopPropagation();
            }
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if ((target.closest($("ul", self.dropView)).length == 0)
                    && (target.closest(self.dropView).length == 0)) {
                    self.dropView && self.dropView.removeClass("show");
                }
            });
        });

        this._dropBtn.click(function () {
            var _this = self.dropView;
            _this.css("right", ($(window).width() - self.el.offset().left - self.el.outerWidth()) + "px");
            _this.css("top", (self.el.offset().top + self.el.outerHeight()) + "px");
//            _this.width($(this).outerWidth() + $(this).prev(".btn-left").outerWidth())
            _this.toggleClass("show");
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if ((target.closest($("ul", _this)).length == 0)
                    && (target.closest(_this).length == 0)
                    && (target.closest(self._dropBtn).length == 0)) {
                    _this && _this.removeClass("show");
                }
            });
        });

        this.el.find("a.tbr-btn").mouseover(function () {
            !$(this.parentElement).hasClass("ui-readonly") && $(this).addClass("hover");
        });
        this.el.find("a.tbr-btn").mouseleave(function () {
            !$(this.parentElement).hasClass("ui-readonly") && $(this).removeClass("hover");
        });
    }

});
YIUI.reg("toolbar", YIUI.Control.Toolbar);