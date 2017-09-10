/**
 * 标签控件，主要用于显示文本。
 */
(function () {
    YIUI.Yes_Label = function (options) {
        var Return = {
            /**
             * String。
             * render控件时，自动创建为label。
             */
            el: $("<div></div>"),
            
            icon: null,
            
            init: function() {
            	this.label = $("<label></label>").appendTo(this.el);
            	this.icon && this.setIcon(this.icon);
            	this.caption && this.setCaption(this.caption);
            },

            setWidth: function (width) {
                this.el.css("width", width);
                this.label.css("width", width - $("span", this.el).width());
            },

            setHeight: function (height) {
                this.el.css("height", height);
                this.el.css("position", "relative");
                this.label.css("position", "absolute");
                if (this.format != null) {
                	var vAlign = this.format.vAlign;
                	switch( vAlign ){
                		case 0:
                			this.label.css("top", "0px");
                			break;
                		case 1:
                			this.label.css("line-height", height + "px");
                			break;
                		case 2:
                			this.label.css("bottom","0px");
                			break;
                		default:
                			this.label.css("line-height", height + "px");
                	}
                }
                if(this.icon) {
                	var icon = $(".icon", this.el);
                	icon.css('top', (height - icon.height()) / 2 + 'px');
                }
            },

            setCssStyle: function (cssStyle) {
                this.label.css(cssStyle);
            },

            getEl: function () {
                return this.el;
            },

            setCaption: function (caption) {
            	if(caption) {
            		caption = caption.toString();
            	}
                this.caption = caption || "";
                var text = this.caption.replace(/\\n/g, "<br/>").replace(/\ /g, "&nbsp;");
                this.label.html(text);
            },

            setValue: function (value) {
              	this.setCaption(value == null ? "" : value.toString());
            },
            
            setIcon: function (icon) {
                this.icon = icon;
                var $this = this.getEl();
                if ($("span.icon", $this).length == 0) {
                    $('<span class="icon" />').css('background-image', 'url(Resource/' + icon + ')').prependTo($this);
                } else {
                    $("span.icon", $this).css('background-image', 'url(Resource/' + icon + ')');
                }
            }
        };
        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        return Return;
    }
})();