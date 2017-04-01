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
})();(function () {
    YIUI.Yes_HyperLink = function (options) {
        var Return = {
            el: $("<a class='ui-hlk'></a>"),
            /** 超链接地址，也可以是Javascript代码执行 */
            //href: 'javascript:void(0);',
            /** 参见YIUI.Hyperlink_target*/
            targetType: YIUI.Hyperlink_TargetType.NewTab,
            /** 链接地址 */
            url: "",
            init: function () {
                var self = this;
                self.enable = options.enable;
                this.el.mousedown(function () {
                    self.enable && $(this).addClass("hover");
                }).mouseup(function () {
                        self.enable && $(this).removeClass("hover");
                    });
            },
            getEl: function () {
                return this.el;
            },
            setText: function (text) {
                this.el.html(text);
            },
            getText: function () {
                return this.el.html();
            },
            setEnable: function (enable) {
                this.enable = enable;
            },
            setHeight: function (height) {
                this.el.css({"line-height": height + "px", height: height + "px"});
            },
            setWidth: function (width) {
                this.el.css({ width: width + "px"});
            }
        };
        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        return Return;
    }
})();(function () {
    YIUI.Yes_Image = function (options) {
        var Return = {
            el: $("<div></div>"),
            sourceType: YIUI.IMAGE_SOURCETYPE.DATA,
            image: "",
            stretch: false,
            imageCut: false,
            init: function () {
                this._img = $("<img />").appendTo(this.el);
            },
            getEl: function () {
                return this.el;
            },
            setSourceType: function (sourceType) {
                this.sourceType = sourceType;
            },
            setImagePath: function (path) {
                this.image = "Resource/" + path;
                this._img.attr("src", this.image.replace(/\\/g, "/"));
            },
            setImageCut: function (imageCut) {
                this.imageCut = imageCut;
            },
            setStretch: function (stretch) {
                this.stretch = stretch;
            },
            getImage: function () {
                return this._img;
            },
            setHeight: function (height) {
                var img = this.getImage();
                if (this.stretch) {
                    img.css({height: height});
                } else {
                    if (height < this.el.width()) {
                        img.height("100%");
                        img.width("auto");
                    } else {
                        img.width("100%");
                        img.height("auto");
                    }
                }
            },
            setWidth: function (width) {
                var img = this.getImage();
                if (this.stretch) {
                    img.css("width", this.el.innerWidth());
                } else {
                    if (width > this.el.height()) {
                        img.height("100%");
                        img.width("auto");
                    } else {
                        img.width("100%");
                        img.height("auto");
                    }
                }
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this.el, outerEl = this.el;
                if (this.enable) {
                    outerEl.removeClass("ui-readonly");
                } else {
                    outerEl.addClass("ui-readonly");
                }
            },
            setValue: function (path) {
                this.value = path;
            },
            uploadImg: function () {

            },
            change: function () {

            },

            click: function () {

            },

            install: function () {
                var self = this;
                //self.el.delegate('.upbtn', 'change', function (event) {
                self.el.on('change', '.upbtn', function (event) {
                    var file = event.target.files[0], type = file.type.split("/")[1];
                    //添加插件操作
                    if (self.imageCut) {
                        var options = {
                            type: type,
                            callback: function (paras) {
                                self.uploadImg($(event.target), paras);
                            }
                        };

                        $(".upbtn", self.el).photoCut(options);
                    } else {
                        self.uploadImg($(this), {fileName:file.name,imgType: type});
                    }
                    //$(".opt,.bar", self.yesCom).remove();
                   $(".opt,.bar", self.yesCom).hide();
                });
                this._img.bind("click", function (e) {
                    if (self.enable) {
                        self.click();
                    }
                });
                var doDeleteImage = function (filePath) {
                    if (filePath == undefined || filePath == null) return;
                    var paras = {
                        service: "DeleteImage",
                        filePath: filePath,
                        operatorID: $.cookie("userID"),
                        mode: 1
                    };
                    $.ajax({
                        url: Svr.SvrMgr.AttachURL,
                        data: paras,
                        type: "post",
                        error: function (data, status, e) {
                            alert(e);
                        }
                    });
                };
                this.el.mouseenter(function () {
                    if ($(".opt", self.el).length == 0) {
                        var disPlay = (self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA && self.enable) ? "block" : "none",
                            optBar = $("<div class='bar'></div>").appendTo(self.el),
                            upload = $("<span class='opt upload' title='" + $.ygrid.cell_imgOpt.open + "'/>").appendTo(self.el),
                            show = $("<span class='opt show' title='" + $.ygrid.cell_imgOpt.show + "'/>").appendTo(self.el),
                            clear = $("<span class='opt clear' title='" + $.ygrid.cell_imgOpt.clear + "'/>").appendTo(self.el),
                            uploadBtn = $("<input type='file' name='file' data-url='upload' class='opt upbtn' accept='image/*' title='" + $.ygrid.cell_imgOpt.open + "'/>").appendTo(self.el);
                        optBar.css({top: (self.el.height() - 25) + "px"});
                        upload.css({left: (self.el.width() - 22) + "px", top: (self.el.height() - 22) + "px", display: disPlay});
                        uploadBtn.css({left: (self.el.width() - 22) + "px", top: (self.el.height() - 22) + "px", opacity: 0, display: disPlay});
                        show.css({left: (self.el.width() - ((disPlay == "none") ? 22 : 46)) + "px", top: (self.el.height() - 22) + "px"});
                        clear.css({left: (self.el.width() - 68) + "px", top: (self.el.height() - 22) + "px", display: disPlay});
                        $(".opt", self.el).mouseover(function (e) {
                            var btn = $(e.target);
                            if (btn.hasClass("upbtn")) {
                                upload.addClass("sel");
                            } else {
                                btn.addClass("sel");
                            }
                        }).mouseout(function (e) {
                                var btn = $(e.target);
                                if (btn.hasClass("upbtn")) {
                                    upload.removeClass("sel");
                                } else {
                                    btn.removeClass("sel");
                                }
                            });
                        clear.click(function () {
//                            doDeleteImage(self.value);
                            self.setValue("");
                            self._img.attr("src", YIUI.Image.EmptyImg);
                            self.change();
                        });
                        show.click(function () {
                            var path;
                            if (self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
                                if (self.value == undefined || self.value == null || self.value.length == 0) return;
                                var formKey = self.el.attr("formKey");
                                var p = encodeURIComponent(self.value);
                                path = Svr.SvrMgr.AttachURL + "?path=" + p + "&formKey="+formKey+"&service=DownloadImage&mode=1&r=" + Math.random();
                            } else {
                                path = self.image;
                            }
                            var showDiv = $("<div class='ui-img-showDiv'></div>").appendTo(document.body);
                            var tmpImg = $("<img class='ui-img-showImg' src='" + path + "'>").appendTo(document.body);
                            tmpImg.load(function () {
                                tmpImg.css({left: (showDiv.width() - this.width) / 2 + "px", top: (showDiv.height() - this.height) / 2 + "px", width: this.width, height: this.height});
                            });
                            showDiv.click(function () {
                                showDiv.remove();
                                tmpImg.remove();
                            });
                            tmpImg.click(function () {
                                showDiv.remove();
                                tmpImg.remove();
                            });
                        });
                        if ($.ygrid.msie) {
                            uploadBtn[0].onchange = function () {                  
                                //添加插件操作
                                var btn = this;
                                var file = $(this).val().substring( $(this).val().lastIndexOf("\\") + 1), type = file.split(".")[1];
                                if (self.imageCut) {
                                    var options = {
                                        type: type,
                                        callback: function (paras) {
                                            self.uploadImg($(btn), paras);
                                        }
                                    };
                                    $(btn).photoCut(options);
                                } else {
                                    self.uploadImg($(this), {fileName: file, imgType: type});
                                }
                                $(".opt,.bar", self.yesCom).remove();
                            };
                        }
                    }else{
                        $(".opt,.bar", self.el).show();
                    }
                }).mouseleave(function (e) {
                        //if (!$(e.relatedTarget).hasClass("opt") && !$(e.relatedTarget).hasClass("bar")) {                           
                            //$(".opt,.bar", self.el).remove();
                            $(".opt,.bar", self.el).hide();
                        //}
                    });
            }
        };
        Return = $.extend(Return, options);
        if (!options.isPortal) {
            Return.init();
        }
        Return.install();
        return Return;
    }
})();/**
 * 文本编辑框，主要是提供文本字符类型数据输入
 * 1、可以自定义文本输入最大字符长度（默认为255），一个中文也只算一个字符，例如：12abc好12,这个为8个字符长度
 * 2、可以自定义文本显示为全大写或全小写,默认为无限制，大小写都可输入
 * 3、可以自定义不可输入字符。例如：定义不可输入字符串为：“a2v:,A”,则字符串中的字母数字符号都不可输入，键盘按键按下后都没有反应。
 * 另外，特别需要注意的是一些转义字符，例如单引号（'），双引号（"），这些转义字符定义时需要加斜杠。
 * 例如，定义为：“A?:,\'\"”，则单引号和双引号都不可输入。
 * 注意：不可输入字符区分中英文字符，比如“\"”这是英文的双引号，“\””这时中文的双引号。
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */

(function () {
    YIUI.Yes_TextEditor = function (options) {
        var Return = {
            /**
             * String。
             * HTML默认创建为input。
             * IE8-不支持input标签动态setAttribute。
             */
            el: $("<span></span>"),

            _input: "",

            types: {
                txt: $("<input type='text'/>"),
                pwd: $("<input type='password'/>")
            },

            inputType: null,

            /**
             * Number。
             * 允许输入的最大长度。
             */
            maxLength: Number.MAX_VALUE,

            /**
             * Number。
             * 输入字符大小写。
             */
            textCase: YIUI.TEXTEDITOR_CASE.DEFAULT,

            /**
             * String。
             * 不允许输入的字符集合。
             */
            invalidChars: null,

            /**
             * String。
             * 当输入框为空时，显示的输入提示。
             */
            promptText: null,

            /**
             * Boolean。
             * 是否去除首尾多余空格。
             */
            trim: true,

            /**
             * Boolean。
             * 光标进入默认全选。
             */
            focus: true,

            required: false,

            selectOnFocus: true,

            /**
             * 掩码，为固定长度字符串。
             * 规定：
             *  9 : 任意数字，[0-9]
             *  a : 任意英文字母，[A-Za-z]
             *  * : 任意数字、英文字母，[A-Za-z0-9]
             *  _ : 控件里显示的占位符
             * 当掩码中需要包含9、a、*、\时，使用转义\9、\a、\*、\\。
             */
            mask: null,

            /**
             * String。
             * 右侧图标url。
             */
            icon: null,

            /**
             * String。
             * 左侧内嵌文本。
             */
            embedText: null,

            preIcon: null,

            init: function () {
                if (this.inputType == "password") {
                    this._input = this.types.pwd;
                } else {
                    this._input = this.types.txt;
                }
                this._input.appendTo(this.el);

                if (this.icon) {
                    this.setIcon(this.icon);
                } else {
                    this.setClearable(true);
                }
                this.setValue(this.value)
                this.setTextCase(this.textCase);
                this.setMaxLength(this.maxLength);
                this.preIcon && this.setPreIcon(this.preIcon);
                //设置输入框输入时遇到不可输入字符时，不允许其输入
                this.promptText && this.setPromptText(this.promptText);
                this.embedText && this.setEmbedText(this.embedText);
                this.setMask(this.mask);
            },

            setMask: function (mask) {
                this.mask = mask;
                if (this.mask) {
                    this._input.mask(this.mask);
                }
            },

            getInput: function () {
                return this._input;
            },

            setInput: function (type) {
                this._input.attr("type", type);
            },

            setValue: function (value) {
                this.value = value;

                if (this.getEl()) {
                    this._input.val(value);
                }
            },

            getValue: function () {
                var val = this._input.val();
//                return this.textCase == YIUI.TEXTEDITOR_CASE.UPPER ? val.toUpperCase() : (this.textCase == YIUI.TEXTEDITOR_CASE.LOWER ? val.toLowerCase() : val);
                return val;
            },

            /**
             * 设置控件是否可编辑。
             */
            setEnable: function (enable) {
                this.enable = enable;

                var el = this._input,
                    outerEl = this.getEl();
                if (this.enable) {
                    el.removeAttr('readonly');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('readonly', 'readonly');
                    outerEl.addClass("ui-readonly");
                }
            },

            setRequired: function (required) {
                if (required) {
                    this.getEl().addClass('ui-required');
                } else {
                    this.getEl().removeClass('ui-required');
                }
            },

            setBackColor: function (backColor) {
                this.backColor = backColor;
                this._input.css({
                    'background-image': 'none',
                    'background-color': backColor
                })
            },

            setForeColor: function (foreColor) {
                this.foreColor = foreColor;
                this._input.css('color', foreColor);
            },

            setFormatStyle: function (cssStyle) {
                this._input.css(cssStyle);
            },

            setHeight: function (height) {
                this.getEl().css('height', height + 'px');
                this._input.css('height', height + 'px');
                if ($.browser.isIE) {
                    this._input.css('line-height', (height - 2) + 'px');
                }
                if (this.embedText) {
                    $(".embed", this.getEl()).css('height', height + 'px');
                    $(".embed", this.getEl()).css('line-height', height + 'px');
                }
                if (this.preIcon) {
                    var icon = $(".pre-icon", this.getEl());
                    icon.css('top', (this.getEl().height() - icon.height()) / 2 + 'px');
                }
            },

            setWidth: function (width) {
                var pi, em;
                if (this.preIcon) {
                    pi = $(".pre-icon", this.getEl());
                    pi.css('left', '5px');
                }
                var el = this.getEl(),
                    inputPadding, embedPdding;
                if (this.preIcon) {
                    inputPadding = pi.outerWidth() + 8;
                } else {
                    inputPadding = 8;
                }
                if (this.embedText) {
                    em = $(".embed", this.getEl());
                    em.css('padding-left', inputPadding + 'px');
                    inputPadding = em.outerWidth();
                }
                this._input.css('padding-left', inputPadding + 'px');
                this.getEl().css('width', width + 'px');
                this._input.css('width', width + 'px');
            },

            /**
             * input外层wrap了一层span。
             */
            getEl: function () {
                return this.el;
            },

            /** 设置输入字符大小写 */
            setTextCase: function (textCase) {
                var el = this._input;
                this.textCase = textCase;
                if (textCase === YIUI.TEXTEDITOR_CASE.UPPER) {
                    el.addClass('uppercase');
                } else {
                    el.removeClass('uppercase');
                }
                if (textCase === YIUI.TEXTEDITOR_CASE.LOWER) {
                    el.addClass('lowercase');
                } else {
                    el.removeClass('lowercase');
                }
            },
            /**
             * 设置不允许输入的字符
             * 如果validChars存在，则忽略
             */
            setInvalidChars: function (invalidChars) {
                if ($.isString(invalidChars)) {
                    this.invalidChars = invalidChars;
                }
            },
            /** 设置允许输入的最大长度 */
            setMaxLength: function (maxLength) {
                if ($.isNumeric(maxLength) && maxLength > 0) {
                    this.maxLength = maxLength;

                    // 默认不设置最大长度
//                    if (maxLength != Number.MAX_VALUE) {
//                        this._input.attr('maxLength', maxLength);
//                    }
                }
            },

            /**
             * 设置右侧图标。
             */
            setIcon: function (icon) {
                this.icon = icon;
                $('<span class="icon" />').css('background-image', 'url(Resource/' + icon + ')').appendTo(this.getEl());
            },

            setPreIcon: function (preIcon) {
                this.preIcon = preIcon;
                var $this = this.getEl();
                $('<span class="pre-icon" />').css('background-image', 'url(Resource/' + preIcon + ')').appendTo($this);
            },

            /**
             * 设置左侧内嵌文本。
             */
            setEmbedText: function (embedText) {
                if (embedText != "" && embedText !== null) {
                    $(".embed", this.getEl()).remove();
                    this.embedText = embedText;
                    var width = this._input.outerWidth(),
                        el = this.getEl(),
                        embed = $('<span class="embed" />').html(embedText).prependTo(el),
                        inputPadding, embedPdding;
//                    if (this.preIcon) {
//                        inputPadding = $(".pre-icon", this.getEl()).outerWidth() + embed.outerWidth() + 10;
//                        embedPdding = $(".pre-icon", this.getEl()).outerWidth() + 25;
//                    } else {
//                        inputPadding = embed.outerWidth();
//                        embedPdding = 10;
//                    }
//                    embed.css('padding-left', embedPdding + 'px');
//                    this._input.css('padding-left', inputPadding + 'px');
//                    this._input.css({width: width + 'px'});
                }
            },

            /** 设置输入提示 */
            setPromptText: function (promptText) {
                this.promptText = promptText;
                this._input.placeholder(this.promptText);
            },

            setClearable: function (isClearable) {
                var el = this.getEl(), input = this._input;
                if (isClearable) {
                    $("<span class='clear'/>").appendTo(el);
                } else {
                    $(".clear", el).remove();
                    input.css({paddingRight: "2px"});
                }
            },
            setSelOnFoc: function (selOnFoc) {
                this.selectOnFocus = selOnFoc;
            },

            finishInput: function () {
                var self = this, curValue = this._input.val();
                if (self.trim) {
                    curValue = $.trim(curValue);
                }
                if (curValue != self.value) {
                    self.setValue(curValue);
                    self.valueChange(curValue);
                    if (self.required) {
                        var required = (curValue == "");
                        self.setRequired(required);
                    }
                }
            },

            valueChange: $.noop,

            install: function () {
                var self = this;
                var input = this._input;
                var icon = $("span.clear", this.el);
                icon.mousedown(function () {
                    input.val('').focus();
                    icon.hide();
                }).hide();
                input.on('click',function () {
                    if (self.needSelectAll) {
                        self.focus && this.select();
                        self.needSelectAll = false;
                    }
                }).on('focusin',function () {
                        if (self.selectOnFocus) {
                            self.needSelectAll = self.selectOnFocus;
                        }
                }).keyup(function () {
                    if (!$.isDefined($(this).attr('readonly'))) {
                        if ($(this).val()) {
                            icon.show();
                        } else {
                            icon.hide();
                        }
                    }
                    
                }).keydown(function (event) {
                	var key = event.keyCode || event.which;
                	if(key != 8 && $.InputMask.getCursor(this).start >= self.maxLength) {
                		event.preventDefault();
						return true;
                	}
                    if (event.ctrlKey) {
                        if (key == 86) {
                            window.setTimeout(function () {
                                self.finishInput();
                            }, 0);
                        }
                    }
                }).focus(function () {
                    if (!$.isDefined($(this).attr('readonly')) && $(this).val()) {
                        icon.show();
                    }
                }).blur(function () {
                    self.finishInput();
                    icon.hide();
                }).filterInput(this.invalidChars, this.textCase, this.maxLength);
            }
        };

        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        } else {
        	Return._input = $("input", Return.el);
        	Return.setMaxLength(Return.maxLength);
        	Return.promptText && Return.setPromptText(Return.promptText);
        }
        Return.install();
        return Return;
    }

})();/**
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
                this.label.css("height", height);
                this.label.css("line-height", height + "px");
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
                this.caption = caption || "";
                var reg = new RegExp("\n", "g");
                var text = this.caption.replace(reg, "<br/>").replace(/\ /g, "&nbsp;");
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
})();(function () {
    function autoStrip(s, settings) {
        if (settings.aSign) {
            while (s.indexOf(settings.aSign) > -1) {
                s = s.replace(settings.aSign, '');
            }
        }

        s = s.replace(settings.skipFirstAutoStrip, '$1$2');
        s = s.replace(settings.skipLastAutoStrip, '$1');
        s = s.replace(settings.allowedAutoStrip, '');

        if (settings.altDec) {
            s = s.replace(settings.altDec, settings.aDec);
        }

        var m = s.match(settings.numRegAutoStrip);

        s = m ? [m[1], m[2], m[3]].join('') : '';

        return s;
    }

    function convertKeyToNumber(settings, key) {
        if (typeof(settings[key]) === 'string') {
            settings[key] *= 1;
        }
    }

    function autoCode($this, settings) {
        settings.oEvent = null;

        var vmax = settings.vMax.toString().split('.'), vmin = (!settings.vMin && settings.vMin !== 0)
            ? []
            : settings.vMin.toString().split('.');
        convertKeyToNumber(settings, 'vMax');
        convertKeyToNumber(settings, 'vMin');
        convertKeyToNumber(settings, 'mDec');

        settings.aNeg = settings.vMin < 0 ? '-' : '';
        vmax[0] = vmax[0].replace('-', '');
        vmin[0] = vmin[0].replace('-', '');
        settings.mInt = Math.max(vmax[0].length, vmin[0].length, 1);
        if (settings.mDec === null) {
            var vmaxLength = 0, vminLength = 0;
            if (vmax[1]) {
                vmaxLength = vmax[1].length;
            }
            if (vmin[1]) {
                vminLength = vmin[1].length;
            }
            settings.mDec = Math.max(vmaxLength, vminLength);
        }
        /** set alternative decimal separator key */
        if (settings.altDec === null && settings.mDec > 0) {
            if (settings.aDec === '.' && settings.aSep !== ',') {
                settings.altDec = ',';
            } else if (settings.aDec === ',' && settings.aSep !== '.') {
                settings.altDec = '.';
            }
        }
        /** cache regexps for autoStrip */
        var aNegReg = settings.aNeg ? '([-\\' + settings.aNeg + ']?)' : '(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(aNegReg + '[^-'
            + (settings.aNeg ? '\\' + settings.aNeg : '') + '\\'
            + settings.aDec + '\\d]' + '.*?(\\d|\\' + settings.aDec
            + '\\d)');
        settings.skipLastAutoStrip = new RegExp('(\\d\\' + settings.aDec + '?)[^\\' + settings.aDec + '\\d]\\D*$');

        var allowed = '-' + settings.aNum + '\\' + settings.aDec;
        settings.allowedAutoStrip = new RegExp('[^' + allowed + ']', 'gi');
        settings.numRegAutoStrip = new RegExp(aNegReg + '(?:\\' + settings.aDec
            + '?(\\d+\\' + settings.aDec + '\\d+)|(\\d*(?:\\'
            + settings.aDec + '\\d*)?))');
        return settings;
    }

//		function checkValue(value, settings) {
//			if (value) {
//				var checkSmall = +value;
//				if (checkSmall < 0.000001 && checkSmall > -1) {
//					value = +value;
//
//					if (value < 0.000001 && value > 0) {
//						value = (value + 10).toString();
//						value = value.substring(1);
//					}
//
//					if (value < 0 && value > -1) {
//						value = (value - 10).toString();
//						value = value.substring(2);
//					}
//					value = value.toString();
//
//				} else {
//					var parts = value.split('.');
//					if (parts[1] !== undefined) {
//						if (+parts[1] === 0) {
//							value = parts[0];
//						} else {
//							parts[1] = parts[1].replace(/0*$/, '');
//							value = parts.join('.');
//						}
//					}
//				}
//			}
//
//			return value;
//
//		}

    function presentNumber(s, aDec, aNeg) {
        if (aNeg && aNeg !== '-') {
            s = s.replace('-', aNeg);
        }

        if (aDec && aDec !== '.') {
            s = s.replace('.', aDec);
        }
        return s;
    }

    function autoCheck(s, settings) {
        s = autoStrip(s, settings);
        s = truncateDecimal(s, settings.aDec, settings.mDec);
        s = fixNumber(s, settings.aDec, settings.aNeg);
        var value = +s;

        if (value < settings.vMin || value > settings.vMax) {
        //    window.setTimeout(function () {
         //       YIUI.ViewException.throwException(YIUI.ViewException.Exceed_Value_Max_Accuracy);
        //    }, 0);
        }

        return value >= settings.vMin && value <= settings.vMax;
    }

    function truncateDecimal(s, aDec, mDec) {
        if (aDec && mDec) {
            var parts = s.split(aDec);

            if (parts[1] && parts[1].length > mDec) {
                if (mDec > 0) {
                    parts[1] = parts[1].substring(0, mDec);
                    s = parts.join(aDec);
                } else {
                    s = parts[0];
                }
            }
        }
        return s;

    }

    function fixNumber(s, aDec, aNeg) {
        if (aDec && aDec !== '.') {
            s = s.replace(aDec, '.');
        }

        if (aNeg && aNeg !== '-') {
            s = s.replace(aNeg, '-');
        }

        if (!s.match(/\d/)) {
            s += '0';
        }
        return s;

    }

    function autoRound(iv, settings) {
        /** value to string */
        iv = (iv === '') ? '0' : iv.toString();

        var ivRounded = '', i = 0, nSign = '';
        if (iv.charAt(0) === '-') {
            /** Checks if the iv (input Value)is a negative value */
            nSign = '-';
            iv = iv.replace('-', '');
            /** removes the negative sign will be added back later if required */
        }
        if (!iv.match(/^\d/)) {
            /** append a zero if first character is not a digit (then it is likely to be a dot)*/
            iv = '0' + iv;
        }
        if (nSign === '-' && +iv === 0) {
            /** determines if the value is zero - if zero no negative sign */
            nSign = '';
        }

        var dPos = iv.lastIndexOf('.'), /** virtual decimal position */
            vdPos = (dPos === -1) ? iv.length - 1 : dPos, /** checks decimal places to determine if rounding is required */
            cDec = (iv.length - 1) - vdPos;
        /** check if no rounding is required */

        //小数位数 小于等于 设定的 小数位数
        if (cDec <= settings.mDec) {
            ivRounded = iv;
            if (dPos === -1) {
                ivRounded += '.';
            }

            var zeros = '0';
            while (cDec < settings.mDec) {
                ivRounded += zeros;
                cDec += zeros.length;
            }

            //return (+ivRounded === 0) ? ivRounded : nSign + ivRounded;
        } else {
            //获取需要判断 四舍五入 的数值
            var rLength = dPos + settings.mDec, tRound = +iv
                .charAt(rLength + 1), ivArray = iv
                .substring(0, rLength + 1).split('');
            if ((tRound > 4 && settings.mRound === YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP)
                || (tRound > 0 && settings.mRound === YIUI.NUMBEREDITOR_ROUNDINGMODE.ROUND_UP)) {
                var i = ivArray.length - 1;
                ivArray[i] = +ivArray[i] + 1;
            }
            ivArray = ivArray.slice(0, rLength + 1);
            ivRounded = ivArray.join('');
        }

        return (+ivRounded === 0) ? ivRounded : nSign + ivRounded;
    }

    function autoGroup(iv, settings) {
        iv = autoStrip(iv, settings);
        var testNeg = iv.replace(',', '.');
        var empty = checkEmpty(iv, settings, true);

        if (empty !== null) {
            return empty;
        }

        var digitalGroup = '';
        if (settings.dGroup === 2) {
            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
        } else if (settings.dGroup === 4) {
            digitalGroup = /(\d)((\d{4}?)+)$/;
        } else {
            digitalGroup = /(\d)((\d{3}?)+)$/;
        }

        var ivSplit = iv.split(settings.aDec);

        if (settings.altDec && ivSplit.length === 1) {
            ivSplit = iv.split(settings.altDec)
        }

        var s = ivSplit[0];

        if (settings.aSep) {
            while (digitalGroup.test(s)) {
                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
            }
        }

        if (settings.mDec !== 0 && ivSplit.length > 1) {
            if (ivSplit[1].length > settings.mDec) {
                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
            }

            iv = s + settings.aDec + ivSplit[1];
        } else {
            iv = s;
        }

        if (settings.aSign) {
            var has_aNeg = iv.indexOf(settings.aNeg) !== -1;
            iv = iv.replace(settings.aNeg, '');
            iv = settings.pSign === 'p' ? settings.aSign + iv : iv
                + settings.aSign;
            if (has_aNeg) {
                iv = settings.aNeg + iv;
            }
        }

        return iv;

    }

    function checkEmpty(iv, settings, signOnEmpty) {
        if (iv === '' || iv === settings.aNeg) {
            // if(settings.vEmpty==='zero'){
            // return iv +'0';
            // }
            // if(settings.vEmpty === 'sign' || signOnEmpty){
            // return iv + settings.aSign;
            //		}
            return iv;
        }
        return null;

    }

    function getElementSelection(that) {
        var position = {};
        if (that.selectionStart === undefined) {
            that.focus();
            var select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -that.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = that.selectionStart;
            position.end = that.selectionEnd;
            position.length = position.end - position.start;
        }
        return position;
    }

    function setElementSelection(that, start, end) {
        if (that.selectionStart === undefined) {
            that.focus();
            var r = that.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    function NumberEditorHandler(that, settings) {
        this.settings = settings;
        this.that = that;
        this.$that = $(that);
        this.formatted = false;
        this.settingsClone = autoCode(this.$that, this.settings);
        this.value = that.value;
    }

    NumberEditorHandler.prototype = {
        init: function (e) {
            this.value = this.that.value;
            this.settingsClone = autoCode(this.$that, this.settings);
            this.ctrlKey = e.ctrlKey;
            this.cmdKey = e.metaKey;
            this.shiftKey = e.shiftKey;
            this.selection = getElementSelection(this.that);
            if (e.type === 'keydown' || e.type === 'keyup') {
                this.kdCode = e.keyCode;
            }
            this.which = e.which;
            this.processed = false;
            this.formatted = false;
        },

        setSelection: function (start, end, setReal) {
            start = Math.max(start, 0);
            end = Math.min(end, this.that.value.length);
            this.selection = {
                start: start,
                end: end,
                length: end - start
            };

            if (setReal === undefined || setReal) {
                setElementSelection(this.that, start, end);
            }

        },

        setPosition: function (pos, setReal) {
            this.setSelection(pos, pos, setReal);
        },

        getBeforeAfter: function () {
            var value = this.value, left = value.substring(0,
                this.selection.start), right = value.substring(
                this.selection.end, value.length);
            return [left, right];
        },

        getBeforeAfterStriped: function () {
            var parts = this.getBeforeAfter();
            parts[0] = autoStrip(parts[0], this.settingsClone);
            parts[1] = autoStrip(parts[1], this.settingsClone);
            return parts;
        },

        normalizeParts: function (left, right) {
            var settingsClone = this.settingsClone;
            right = autoStrip(right, settingsClone);

            left = autoStrip(left, settingsClone);

            var new_value = left + right;

            /** insert zero if has leading dot */
            if (settingsClone.aDec) {
                var m = new_value.match(new RegExp('^'
                    + settingsClone.aNegRegAutoStrip + '\\'
                    + settingsClone.aDec));
                if (m) {
                    left = left.replace(m[1], m[1] + '0');
                    new_value = left + right;
                }
            }

            return [left, right];
        },

//			signPosition : function() {
//				var settingsClone = this.settingsClone, aSign = settingsClone.aSign, that = this.that;
//				if (aSign) {
//					var aSignLen = aSign.length;
//					if (settingsClone.pSign === 'p') {
//						var hasNeg = settingsClone.aNeg && that.value
//								&& that.value.charAt(0) === settingsClone.aNeg;
//						return hasNeg ? [1, aSignLen + 1] : [0, aSignLen];
//					}
//					var valueLen = that.value.length;
//					return [valueLen - aSignLen, valueLen];
//				}
//				return [1000, -1];
//			},

//			expandSelectionOnSign : function(setReal) {
//				var sign_position = this.signPosition(), selection = this.selection;
//				if (selection.start < sign_position[1]
//						&& selection.end > sign_position[0]) {
//					/** if selection catches something except sign and catches only space from sign */
//					if ((selection.start < sign_position[0] || selection.end > sign_position[1])
//							&& this.value.substring(
//									Math.max(selection.start, sign_position[0]),
//									Math.min(selection.end, sign_position[1]))
//									.match(/^\s*$/)) {
//						/** then select without empty space */
//						if (selection.start < sign_position[0]) {
//							this.setSelection(selection.start, sign_position[0],
//									setReal);
//						} else {
//							this.setSelection(sign_position[1], selection.end,
//									setReal);
//						}
//					} else {
//						/** else select with whole sign */
//						this.setSelection(Math.min(selection.start,
//										sign_position[0]), Math.max(selection.end,
//										sign_position[1]), setReal);
//					}
//				}
//			},

        processKeypress: function () {
            var settingsClone = this.settingsClone, cCode = String
                .fromCharCode(this.which), parts = this
                .getBeforeAfterStriped(), left = parts[0], right = parts[1];
            /** start rules when the decimal character key is pressed */
            /** always use numeric pad dot to insert decimal separator */
            if (cCode === settingsClone.aDec
                || (settingsClone.altDec && cCode === settingsClone.altDec)
                || ((cCode === '.' || cCode === ',') && this.kdCode === 110)) {
                /** do not allow decimal character if no decimal part allowed */
                if (!settingsClone.mDec || !settingsClone.aDec) {
                    return true;
                }

                /** do not allow decimal character before aNeg character */
                if (settingsClone.aNeg
                    && right.indexOf(settingsClone.aNeg) > -1) {
                    return true;
                }

                /** do not allow decimal character if other decimal character present */
                if (left.indexOf(settingsClone.aDec) > -1) {
                    return true;
                }

                if (right.indexOf(settingsClone.aDec) > 0) {
                    return true;
                }

                if (right.indexOf(settingsClone.aDec) === 0) {
                    right = right.substr(1);
                }
                this.setValueParts(left + settingsClone.aDec, right);
                return true;
            }

            /**
             * start rule on negative sign & prevent minus if not allowed
             */
            if (cCode === '-' || cCode === '+') {
                if (!settingsClone.aNeg) {
                    return true;
                }
                /** caret is always after minus */
                if (left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }
                /** change sign of number, remove part if should */
                if (left.charAt(0) === settingsClone.aNeg) {
                    left = left.substring(1, left.length);
                } else {
                    left = (cCode === '-') ? settingsClone.aNeg + left : left;
                }
                this.setValueParts(left, right);
                return true;
            }

            /** digits */
            if (cCode >= '0' && cCode <= '9') {
                /** if try to insert digit before minus */
                if (settingsClone.aNeg && left === ''
                    && right.indexOf(settingsClone.aNeg) > -1) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }
                if (settingsClone.vMax <= 0
                    && settingsClone.vMin < settingsClone.vMax
                    && this.value.indexOf(settingsClone.aNeg) === -1
                    && cCode !== '0') {
                    left = settingsClone.aNeg + left;
                }
                this.setValueParts(left + cCode, right);
                return true;
            }
            /** prevent any other character */
            return true;
        },

        setValueParts: function (left, right) {
            var settingsClone = this.settingsClone,
                parts = this.normalizeParts(left, right),
                new_value = parts.join(''),
                position = parts[0].length;
            if (autoCheck(new_value, settingsClone)) {
                new_value = truncateDecimal(new_value, settingsClone.aDec,
                    settingsClone.mDec);
                if (position > new_value.length) {
                    position = new_value.length;
                }
                this.value = new_value;
                this.setPosition(position, false);
                return true;
            }
            return false;
        },

        processAllways: function () {
            var parts;
            if (this.kdCode === 8 || this.kdCode === 46) {
                if (!this.selection.length) {
                    parts = this.getBeforeAfterStriped();
                    if (this.kdCode === 8) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    } else {
                        parts[1] = parts[1].substring(1, parts[1].length);
                    }

                    this.setValueParts(parts[0], parts[1]);
                }
                else {
//						this.expandSelectionOnSign(false);
                    parts = this.getBeforeAfterStriped();
                    this.setValueParts(parts[0], parts[1]);
                }
                return true;
            }
            return false;
        },

        checkPaste: function () {
            if (this.valuePartsBeforePaste !== undefined) {
                var parts = this.getBeforeAfter(),
                    oldParts = this.valuePartsBeforePaste;
                delete this.valuePartsBeforePaste;
                /** try to strip pasted value first */
                parts[0] = parts[0].substr(0, oldParts[0].length) + autoStrip(parts[0].substr(oldParts[0].length), this.settingsClone);
                if (!this.setValueParts(parts[0], parts[1])) {
                    this.value = oldParts.join('');
                    this.setPosition(oldParts[0].length, false);
                }
            }
        },

        skipAllways: function (e) {
            var kdCode = this.kdCode, which = this.which, ctrlKey = this.ctrlKey, cmdKey = this.cmdKey, shiftKey = this.shiftKey;

            if (((ctrlKey || cmdKey) && e.type === 'keyup' && this.valuePartsBeforePaste !== undefined) || (shiftKey && kdCode === 45)) {
                this.checkPaste();
                return false;
            }

            if ((kdCode >= 112 && kdCode <= 123)
                || (kdCode >= 91 && kdCode <= 93)
                || (kdCode >= 9 && kdCode <= 31)
                || (kdCode < 8 && (which === 0 || which === kdCode))
                || kdCode === 144 || kdCode === 145 || kdCode === 45) {
                return true;
            }

            if ((ctrlKey || cmdKey) && kdCode === 65) {
                return true;
            }

            if ((ctrlKey || cmdKey)
                && (kdCode === 67 || kdCode === 86 || kdCode === 88)) {
//					if (e.type === 'keydown') {
//						this.expandSelectionOnSign();
//					}

                if (kdCode === 86 || kdCode === 45) {
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (this.valuePartsBeforePaste === undefined) {
                            this.valuePartsBeforePaste = this.getBeforeAfter();
                        }
                    } else {
                        this.checkPaste();
                    }
                }

                return e.type === 'keydown' || e.type === 'keypress'
                    || kdCode === 67;

            }

            if (ctrlKey || cmdKey) {
                return true;
            }

            if (kdCode === 37 || kdCode === 39) {
                var aSep = this.settingsClone.aSep, start = this.selection.start, value = this.that.value;

                if (e.type === 'keydown' && aSep && !this.shiftKey) {
                    if (kdCode === 37 && value.charAt(start - 2) === aSep) {
                        this.setPosition(start - 1);
                    } else if (kdCode === 39
                        && value.charAt(start + 1) === aSep) {
                        this.setPosition(start + 1);
                    }
                }
                return true;
            }

            if (kdCode >= 34 && kdCode <= 40) {
                return true;
            }

            return false;

        },

        formatQuick: function () {
            var settingsClone = this.settingsClone, parts = this
                .getBeforeAfterStriped(), leftLength = this.value;

            if ((settingsClone.aSep === '' || (settingsClone.aSep !== '' && leftLength
                .indexOf(settingsClone.aSep) === -1))
                && (settingsClone.aSign === '' || (settingsClone.aSign !== '' && leftLength
                .indexOf(settingsClone.aSign) === -1))) {
                var subParts = [], nSign = '';
                subParts = leftLength.split(settingsClone.aDec);
                if (subParts[0].indexOf('-') > -1) {
                    nSign = '-';
                    subParts[0] = subParts[0].replace('-', '');
                    parts[0] = parts[0].replace('-', '');
                }

                if (subParts[0].length > settingsClone.mInt
                    && parts[0].charAt(0) === '0') {
                    parts[0] = parts[0].slice(1);
                }
                parts[0] = nSign + parts[0];

            }

            var value = autoGroup(this.value, this.settingsClone),
                position = value.length;

            if (value) {
                var left_ar = parts[0].split(''), i = 0;

                for (i; i < left_ar.length; i += 1) {
                    if (!left_ar[i].match('\\d')) {
                        left_ar[i] = '\\' + left_ar[i];
                    }
                }

                var leftReg = new RegExp('^.*?' + left_ar.join('.*?'));

                var newLeft = value.match(leftReg);
                if (newLeft) {
                    position = newLeft[0].length;
                    if (((position === 0 && value.charAt(0) !== settingsClone.aNeg)
                        || (position === 1 && value.charAt(0) === settingsClone.aNeg))
                        && settingsClone.aSign && settingsClone.pSign === 'p') {
                        position = this.settingsClone.aSign.length
                            + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else if (settingsClone.aSign && settingsClone.pSign === 's') {
                    position -= settingsClone.aSign.length;

                }

            }

            this.that.value = value;
            this.setPosition(position);
            this.formatted = true;
        }
    };

    function getHandler($that, settings, update) {
        var data = $that.data('NumberEditor');
        if (!data) {
            data = {};
            $that.data('NumberEditor', data);
        }

        var handler = data.handler;
        if ((handler === undefined && settings) || update) {
            handler = new NumberEditorHandler($that.get(0), settings);
            data.handler = handler;
        }
        return handler
    };

    YIUI.Yes_NumberEditor = function (options) {
        /*var defaults = {
         aNum : '0123456789',
         //组分割符
         aSep : ',',
         //组大小
         dGroup : '3',
         //小数点符号
         aDec : '.',
         //前缀或后缀符号
         aSign : '',
         //p是前缀 s是后缀
         pSign : '',
         //最大值
         vMax : '99999999999999.99',
         //最小值
         vMin : '-99999999999999.99',
         //小数位数
         mDec : '2',
         //四舍五入方式
         mRound :  YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP,

         altDec : null
         };*/


        var Return = {

            /**
             * HTML默认创建为input
             * IE8-不支持input标签动态setAttribute
             */
            el: $('<span></span>'),

            /**
             * Boolean。
             * 光标进入默认全选。
             */
            selectOnFocus: true,

            required: false,

            promptText: null,

            settings: {
                aNum: '0123456789',
                //组分割符
                aSep: ',',
                //组大小
                dGroup: '3',
                //小数点符号
                aDec: '.',
                //前缀或后缀符号
                aSign: '',
                //p是前缀 s是后缀
                pSign: '',
                //最大值
                vMax: '99999999999999.99',
                //最小值
                vMin: '-99999999999999.99',
                //小数位数
                mDec: '2',
                //精度
                mPre: '16',
                //四舍五入方式
                mRound: YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP,

                altDec: null
            },

            init: function () {
                $("<input type='text' />").appendTo(this.el);
                var handler = getHandler(this.getInput(), this.settings);
                this.setValue(this.value);
            },

            /**
             * 返回值的时候
             */
            getValue: function () {
                var realV = null;
                if (this.value == null) {
                    realV = 0;
                } else {
                    realV = fixNumber(this.value, this.settings.aDec, this.settings.aNeg);
                }
                return new Decimal(realV);
            },

            getInput: function () {
                return $("input", this.el);
            },

            getEl: function () {
                return this.el;
            },

            setValue: function (valueIn) {
                if (valueIn == null) valueIn = "";
                var $this = this.getInput();
                var value = valueIn.toString();
                if(valueIn instanceof Decimal){
                    value = valueIn.toFixed();
                }
                if (!$.isNumeric(+value)) {
                    this.value = null;
                    return '';
                }
                this.value = value;
                if (value !== '') {
                    value = autoRound(value, this.settings);
                }
                value = presentNumber(value, this.settings.aDec, this.settings.aNeg);
                if (!autoCheck(value, this.settings)) {
                    value = autoRound('', this.settings);
                }
                value = autoGroup(value, this.settings);
                if(!(!this.showZero && value == 0)) {
                    $this.val(value);
                }
            },

            /**
             * 设置控件是否可编辑。
             * @param enable：Boolean。
             */
            setEnable: function (enable) {
                this.enable = enable;

                var el = this.getInput(),
                    outerEl = this.getEl();
                if (this.enable) {
                    el.removeAttr('readonly');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('readonly', 'readonly');
                    outerEl.addClass("ui-readonly");
                }
            },

            setBackColor: function (backColor) {
                this.backColor = backColor;
                this.getInput().css({
                    'background-image': 'none',
                    'background-color': backColor
                })
            },

            setForeColor: function (foreColor) {
                this.foreColor = foreColor;
                this.getInput().css('color', foreColor);
            },

            setFormatStyle: function (cssStyle) {
                this.getInput().css(cssStyle);
            },

            setHeight: function (height) {
                this.el.css('height', height + 'px');
                this.getInput().css('height', height + 'px');
                if ($.browser.isIE) {
                    this.getInput().css('line-height', (height - 3) + 'px');
                }
            },

            setWidth: function (width) {
                this.el.css('width', width + 'px');
                this.getInput().css('width', width + 'px');
            },

            /** 设置输入提示 */
            setPromptText: function (promptText) {
                this.promptText = promptText;
                this.getInput().placeholder(this.promptText);
            },

            autoStrip: function (s, settings) {
                return autoStrip(s, settings);
            },

            getHandler: function ($that, settings, update) {
                return getHandler($that, settings, update);
            },

            valueChange: $.noop,

            setRequired: function (required) {
                this.required = required;
                if (required) {
                    this.getEl().addClass('ui-required');
                } else {
                    this.getEl().removeClass('ui-required');
                }
            },

            finishInput: function () {
                var self = this, $this = this.getInput(), handler = self.getHandler($this),
                    settingsClone = handler.settingsClone;
                var curValue = self.autoStrip($this[0].value, settingsClone);
                if (curValue != self.value) {
                    self.setValue(curValue);
                    self.valueChange(curValue);
                    if (self.required) {
                        self.setRequired(curValue == "");
                    }
                }
            },

            install: function () {
                var $this = this.getInput();
                var self = this;
                $this.on('keydown.numbereditor', function (e) {
                    var handler = getHandler($this);
                    if (handler.settings.aDec === handler.settings.aSep) {
                        $.error("error");
                        return this;
                    }

                    if (handler.that.readOnly) {
                        handler.processed = true;
                        return true;
                    }

                    handler.init(e);

                    handler.settings.oEvent = 'keydown';
                    if (handler.skipAllways(e)) {
                        handler.processed = true;
                        return true;
                    }

                    if (handler.processAllways()) {
                        handler.processed = true;
                        handler.formatQuick();
                        e.preventDefault();
                        return false;
                    }

                    handler.formatted = false;
                    return true;

                });

                $this.on('keypress.numbereditor', function (e) {
                    var handler = getHandler($this);
                    var processed = handler.processed;

                    handler.init(e);

                    handler.settings.oEvent = 'keypress';

                    if (handler.skipAllways(e)) {
                        return true;
                    }

                    if (processed) {
                        e.preventDefault();
                        return false;
                    }

                    if (handler.processAllways()
                        || handler.processKeypress()) {
                        handler.formatQuick();
                        e.preventDefault();
                        return false;
                    }

                    handler.formatted = false;
                });

                $this.on('keyup.numbereditor', function (e) {
                    var handler = getHandler($this);
                    handler.init(e);
                    handler.settings.oEvent = 'keyup';
                    var skip = handler.skipAllways(e);
                    handler.kdCode = 0;
                    delete handler.valuePartsBeforePaste;
                    if ($this[0].value === handler.settings.aSign) {
                        /** added to properly place the caret when only the currency is present */
                        if (handler.settings.pSign === 's') {
                            setElementSelection(this, 0, 0);
                        } else {
                            setElementSelection(this,
                                handler.settings.aSign.length,
                                handler.settings.aSign.length);
                        }
                    }
                    if (skip) {
                        return true;
                    }
                    if (this.value === '') {
                        return true;
                    }
                    if (!handler.formatted) {
                        handler.formatQuick();
                    }
                });

                $this.on('focusin.numbereditor', function () {
                    if (self.selectOnFocus) {
                        self.needSelectAll = true;
                    }

                    var handler = getHandler($this);
                    handler.settingsClone.oEvent = 'focusin';

                    handler.inVal = $this.val();
                    var onempty = checkEmpty(handler.inVal,
                        handler.settingsClone, true);
                    if (onempty !== null) {
                        $this.val(onempty);
                        if (handler.settings.pSign === 's') {
                            setElementSelection(this, 0, 0);
                        } else {
                            setElementSelection(this,
                                handler.settings.aSign.length,
                                handler.settings.aSign.length);
                        }
                    }
                });

                $this.on('focusout.numbereditor', function () {
                    var handler = getHandler($this), settingsClone = handler.settingsClone, value = $this
                        .val(), origValue = value;
                    handler.settingsClone.oEvent = 'focusout';

                    if (value !== '') {
                        value = autoStrip(value, settingsClone);
                        if (checkEmpty(value, settingsClone) === null
                            && autoCheck(value, settingsClone, $this[0])) {
                            value = fixNumber(value, settingsClone.aDec,
                                settingsClone.aNeg);
                            value = autoRound(value, settingsClone);
                            value = presentNumber(value, settingsClone.aDec,
                                settingsClone.aNeg);
                        } else {
                            value = '';
                        }
                    }
                    var groupedValue = checkEmpty(value, settingsClone, false);
                    if (groupedValue === null) {
                        groupedValue = autoGroup(value, settingsClone);
                    }
                    if (groupedValue !== origValue) {
                        $this.val(groupedValue);
                    }
                    if (groupedValue !== handler.inVal) {
                        $this.change();
                        delete handler.inVal;
                    }

                });


                $this.on('click', function (event) {
                    if (self.needSelectAll) {
                        self.selectOnFocus && $this.select();
                        self.needSelectAll = false;
                    }
                });


                $this.on('blur', function (event) {
                    self.finishInput();
                });

            }

        };

        Return = $.extend(true, Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        Return.install();
        return Return;

    }
})();(function () {
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
})();/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-20
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */
(function () {
	YIUI.Yes_DictTree = function(options){
		var Return = {

			/** HTML默认创建为label */
			el: $("<div></div>"),
			
		    /** 父子节点是否关联 */
		    independent: true,
		    /** 是否可勾选 */
		    showCheckBox: false,
		    
		    /** 选中的节点 */
		    checkedNodes : {},
		    
		    /** 半选状态的节点*/
		    indeterminatedNodes : null ,
		    
		    /** 记录父子关系的集合*/
		    _pMap : {},
		    
		    /** 根节点 */
		    rootNode : null,
		    
		    _liwrap : $("<div class = 'liwrap'></div>"),
		    
		    _searchdiv : $("<div class = 'chainsearch'></div>"),
		    
		    _footdiv : $("<div class = 'footdiv'></div>"),
		    
		    _footMean : $("<div class = 'footmean'></div>"),
		    /**总页数*/
		    allPageNum : null,
		    
		    startRow : 0,
	        pageIndicatorCount : 3,
	        fuzzyValue : null,
		    
		    /** 构建树结构 */
		    buildTreenode: function(nodes, pNodeKey, level, secondaryType, isNext) {
		    	if(!nodes) {
		    		return;
		    	}
		    	if(!nodes.length) {
		    		nodes = $(nodes);
		    	}
		    	
		    	this.addNodes(nodes, pNodeKey, level, secondaryType, isNext);
		    
		    },
		    
		    /**
		     * 根据父节点 添加子节点
		     * @param {} nodes
		     * @param {} pNodeKey
		     */
		    addNodes: function(nodes, pNodeKey, level, secondaryType, isNext) {
		    	var $pNode = $('#' + pNodeKey, this.el);
		    	allPageNum = Math.ceil(isNext/10);
		    	this._footdiv.find(".pageinfo").attr("maxnum",allPageNum);
		    				
		    	// 无子节点的时候 去掉节点前的+号
		    	if(nodes.length <= 0 && secondaryType != 5) {
		    		$pNode.children('span:first').removeClass('dt-collapse');
		    		return;
		    	}
		    	//如果下一页的item不为0，点击下一页的时候删除当前页的item
		    	if (secondaryType == 5) {
		    		if (isNext != 0) {
			    		this.reset();
			    		
			    	}
			    	var _pageInfo = $("<span class = 'pageinfo'></span>");
			    	if (this.startRow == 0) {
			    		if (this._footdiv.find(".pageinfo").length != 0) {
			    			this._footdiv.find(".pageinfo").children("span").remove();
			    			_pageInfo = this._footdiv.find(".pageinfo");
			    		}
			    		
			    		_pageInfo.attr("maxnum", allPageNum);
			    		var btnNum = allPageNum >= 3 ? 3 : allPageNum;
			    		for ( var i = 0; i < btnNum;i++) {
			    			if (i == 0) {
			    				$("<span class='pagenum nowitem'>"+(i + 1)+"</span>").appendTo(_pageInfo);
			    			} else {
			    				$("<span class='pagenum'>"+(i + 1)+"</span>").appendTo(_pageInfo);
			    			}
				    		
				    	}
				    	this._footMean.find(".prev").after(_pageInfo);
			    		
			    	}
			    	
		    		
		    	}
		    	
				var node, nid ,oid, itemKey;
				
				this._pMap[pNodeKey] || (this._pMap[pNodeKey] = []);
				for (var i = 0, len = nodes.length; i < len; i++) {
					node = nodes[i];
					nid = node.id;
					oid = node.OID;
					itemKey = node.itemKey;
		
					this._pMap[pNodeKey].push(nid);
					
					var _li = $("<li id='"+ nid + "' oid = '"+oid+"'parentid='"+pNodeKey+"' itemKey='"+itemKey+"'></li>");
					if (secondaryType != 5) {
						_li.attr("level", level).css("padding-left", 15);
					}
					if (secondaryType == 5) {
						_li.attr("level", level).css("padding-left", 2);
					}
					var pItemKey = $pNode.attr("itemKey");
					var comp_Level = parseInt($pNode.attr("comp_Level"));
					if(itemKey != pItemKey) {
						comp_Level += 1;
					} 
					_li.attr("comp_Level", comp_Level);
					var comp_css = "comp_Level" + comp_Level;
					_li.addClass(comp_css);
					
					$("<div class='dt-wholerow'/>").appendTo(_li);
					
					var _pul = $pNode.children("ul");
					
					if(_pul.length == 0){
						_pul = $("<ul class='dt-ul'></ul>").appendTo($pNode);
					}
					
					
					_li.appendTo(_pul);
		
					var _a = $("<a class='dt-anchor'></a>");
		
			        var _ul, _span, _chk;
			        
			        if(node.NodeType == 1) {
			        	// 汇总节点
			            if(node.open) {
			            	_span = $("<span class='icon dt-expand'/>").appendTo(_li);           	  
			            	_explore = $("<span class='branch b-expand'/>").appendTo(_a);
			            }
			            else {
			            	_span = $("<span class='icon dt-collapse'/>").appendTo(_li);
			            	_explore = $("<span class='branch b-collapse'/>").appendTo(_a);
			            }
			            
			        } else {
			        	//明细节点
			        	/*if (secondaryType != 5) {
			        		
			        	}*/
			        	_span = $("<span class='icon'/>").appendTo(_li);
			        	_explore = $("<span class='branch'/>").appendTo(_a);
			        }

			        switch(node.Enable) {
				        case YIUI.DictState.Enable: 
				        	_explore.addClass("enable");
				        	break;
				        case YIUI.DictState.Disable: 
				        	_explore.addClass("disable");
				        	break;
				        case YIUI.DictState.Discard: 
				        	_explore.addClass("discard");
				        	break;
			        }
			        //复选框
		        	if(this.showCheckBox){
		           		_chk = $("<span class='dt-chk' />");
				        _span.after(_chk);
		        	}
					_a.appendTo(_li);
			        
			       
			        var _selectNode = $("<span class='b-txt'>" + node.caption + "</span>").appendTo(_a);
			        secondaryType == 5 ? $pNode.attr('isLoaded', false) : $pNode.attr('isLoaded', true);
				}
				
				
				//如果是多选 ，设置复选框的状态
			    if(this.showCheckBox) {
					for (var i = 0, len = nodes.length; i < len; i++) {
						node = nodes[i];
						nid = node.id;
			
			        	var chkstate = 0;
			        	
			        	if(nid in this.checkedNodes){
			        		chkstate = 1;
			        	}
			        	if (this.indeterminatedNodes == null) {
			        		 this.indeterminatedNodes = []
			        	}
			        	
			        	if(!this.independent &&  nid in this.indeterminatedNodes){
			        		chkstate = 2;
//			        		_span.removeClass("dt-collapse").addClass("dt-expand");
//			        		_explore.removeClass("b-collapse").addClass("b-expand");
			        		//TODO 取该节点下的数据
			        		
			        	}
			        	
			        	//子节点打勾的情况下 ，如果父节点没有打勾 且是父子联动 则 父节点半勾
		//	        	if(chkstate > 0 && ! this.independent && $pNode){
		//	        		var pstate = $pNode.children('.dt-chk').attr('chkstate') || 0;
		//	        		if(pstate == 0){
		//	        			$pNode.children('.dt-chk').attr('chkstate', 2).addClass("chkstate"+2);
		//	        		}
		//	        	}
		//	        	
			        	//子节点没打勾的情况下， 如果父节点打勾且是父子联动则子节点打勾
			        	if(chkstate == 0 && !this.independent && $pNode){
			        		var pChkstate =  $pNode.children('.dt-chk').attr('chkstate') || 0 ;
			        		if(pChkstate == 1){
			        			chkstate =1;
			        		}
			        	}
			        	
			        	var $node = $('#'+nid,this.el);
			        	
			        	$node.children('.dt-chk').attr('chkstate', chkstate).addClass("chkstate"+chkstate);
			        }
				}
		    },
		   
		    /**
		     * 当字典树为父子节点联动时， 需要维护节点勾选状态
		     * @param {} $node
		     * @param {} checkstate
		     */
		    checkTreeNode: function($node, checkstate){
		    	var child, _index, _img, Return
				
		    	var tree = this;
		    	
		    	//递归处理子节点
		    	function checkChildNode($pNode, checkstate){
		    		var pChkBox = $pNode.children('.dt-chk');
		    		pChkBox.removeClass("chkstate"+pChkBox.attr('chkstate'));
		    		pChkBox.attr('chkstate', checkstate).addClass("chkstate"+checkstate);
		    		
		    		//处理子节点时， 是有在选中和未选中时需要做处理
		    		if(checkstate != 2){
			    		var pNodeKey = $pNode.attr('id');
			    		
			    		tree._pMap[pNodeKey] || (tree._pMap[pNodeKey] = []);
			    		
			    		for (var i = 0; i < tree._pMap[pNodeKey].length; i++) {
			                var cId = tree._pMap[pNodeKey][i];
							var $child = $('#'+cId, tree.el);
					      	if(checkstate == 0){
				        		delete tree.checkedNodes[cId];
				        	}   
							checkChildNode($child, checkstate);
			            }
		    		}
		    	}
		    	
		    	//递归处理父节点
		    	function checkParentNode($cNode, checkstate){
		    		var pId = $cNode.attr('parentid');
		    		if(!pId) return;
		    		var $pNode = $('#' + pId, tree.el);
		    		var pChkBox = $pNode.children('.dt-chk');   		
		    		
		    		if(checkstate == 2){
		    			pChkBox.removeClass("chkstate"+pChkBox.attr('chkstate'));
		    			pChkBox.attr('chkstate', 2).addClass("chkstate"+2);
			            checkParentNode($pNode, 2);
		    		}else if(checkstate == 1){
		    			//子节点 打勾， 检查父节点对应的子节点是否都打勾了 ， 
		    			tree._pMap[pId] || (tree._pMap[pId] = []);
			    		var diffstate = false;
			    		//TODO 待测试 ， 用filter 可能存在性能问题 
			    		//$("a", tree.el).filter("[parentid = '" + pId + "']").find("span.dt-chk").filter("[chkstate != '"+checkstate+"']").length > 0
			    		for (var i = 0; i < tree._pMap[pId].length; i++) {
			                var cId = tree._pMap[pId][i];
							var $child = $('#'+cId, tree.el);
							var check = $child.children('.dt-chk').attr('chkstate') || 0;
							if(check != checkstate){
								diffstate = true;
								break;
							}
			            }
			            //有一个节点存在和父节点的勾选状态不一致， 父节点就为半勾状态
			            if(diffstate){
			            	checkstate = 2;
			            }
			            pChkBox.removeClass("chkstate"+pChkBox.attr('chkstate'));
			            pChkBox.attr('chkstate', checkstate).addClass("chkstate"+checkstate);
		            	checkParentNode($pNode, checkstate);
		    		}else {
		    			//子节点勾取消， 检查 原本父节点是否打勾 ， 如全勾转为半勾状态， 则其他子节点 需要加入checkedNodes

		    			var pChkState =  pChkBox.attr('chkstate') || 0;
		    			var curId = $cNode.attr('id');
		    			if(pChkState == 1){
		    				var len = tree._pMap[pId].length;
		    				if(len == 1){
		    					checkstate = 0;
		    				}else{
		    					for (var i = 0; i < tree._pMap[pId].length; i++) {
					                var cId = tree._pMap[pId][i];
					                if(cId == curId){
					                	continue;
					                }
					                var $child = $('#'+cId, tree.el);
					                tree.checkedNodes[cId] = tree.getNodeValue($child);
					
					            }
					            checkstate = 2;
		    				}
	    					pChkBox.removeClass("chkstate"+pChkBox.attr('chkstate'));
				            pChkBox.attr('chkstate', checkstate).addClass("chkstate"+checkstate);
		    			} else if(pChkState == 2) {
		    				var diffstate = true;
		    				for (var i = 0; i < tree._pMap[pId].length; i++) {
				                var cId = tree._pMap[pId][i];
								var $child = $('#'+cId, tree.el);
								var check = $child.children('.dt-chk').attr('chkstate') || 0;
		    					if(check != checkstate){
									diffstate = false;
									break;
								}
				            }
	    					if(diffstate){
				            	checkstate = 0;
				            	pChkBox.removeClass("chkstate"+pChkBox.attr('chkstate'));
				            	pChkBox.attr('chkstate', checkstate).addClass("chkstate"+checkstate);
				            }
		    			}
		    			checkParentNode($pNode, checkstate);

		    		}
		    		
		    		//记录在选中节点中
			      	if(checkstate == 1){
		        		tree.checkedNodes[pId] = tree.getNodeValue($pNode);
		        	}else{
		        		delete tree.checkedNodes[pId];
		        	}   
		    	}

	    		var id = $node.attr('id');
	    		//记录在选中节点中
		      	if(checkstate == 1){
		      		this.checkedNodes[id] = this.getNodeValue($node);
	        	}else{
	        		delete this.checkedNodes[id];
	        	}   

		    	if(!this.independent) {
		    		checkChildNode($node, checkstate);
		            checkParentNode($node, checkstate);	
		    	}else{
		    		// 父子节点不联动， 则仅当前节点打勾
		    		var $chk = $node.children('.dt-chk');
		    		$chk.removeClass("chkstate"+$chk.attr('chkstate'));
		    		$chk.attr('chkstate', checkstate).addClass("chkstate"+checkstate);
		    	}
		    }, 
		
		    /** 设置需要选中的节点 */
		    setCheckedNodes : function (nodes){
		    	if(this.showCheckBox){   
		    		var tree = this;
		    		
		    		this.clearCheckedNodes();
			        this.checkedNodes = nodes;
			        this.indeterminatedNodes = null;
			        
			     	if(this.rootNode){
			       		var rootId = this.rootNode.attr('id');
			       		if(rootId in this.checkedNodes){
				       		this.rootNode.children('.dt-chk').attr('chkstate',1).addClass("chkstate"+1);
				       	}else if(!jQuery.isEmptyObject(this.checkedNodes) && !this.independent){
				       		this.rootNode.children('.dt-chk').attr('chkstate',2).addClass("chkstate"+2);
				       	}
			     	}
		
			    }
		    },
		    /**
		     * 创建查找框
		     */
		    creatSearchInput: function(dom) {
		    	$("<input type = 'text' class = 'findinput'/>").appendTo(dom);
                $("<span class = 'findspan'>查询</span>").appendTo(dom);
		    },
		    /**
		     * 创建根菜单
		     */
		    creatFootDiv: function(dom, isNext) {
		    	
                $("<span class = 'prev disable'>上一页</span>").appendTo(dom);
                $("<span class = 'next'>下一页</span>").appendTo(dom);
		    },
		    
		    clearCheckedNodes : function(){
		    	this.checkedNodes = {};
		    	this.indeterminatedNodes = null;
		    	$("[chkstate=1],[chkstate=2]").removeClass("chkstate1").removeClass("chkstate2").attr('chkstate', 0).addClass("chkstate0");
		    },
		    /**
		     * 创建根节点
		     * @param {} itemKey
		     * @param {} nodeKey
		     * @param {} name
		     */
		    createRootNode : function(node, caption, nodeKey, secondaryType, isNext) {
		    	
		    	var _li = $("<li id='"+ nodeKey + "' oid = '"+node.oid+"' itemKey='"+node.itemKey+"'></li>");
		    	_li.attr("level", -1).attr("comp_Level", 1);
		    	_li.appendTo(this.el);
		    	_li.addClass("root");
		    	if(secondaryType != 5) {
					$("<div class='dt-wholerow'/>").appendTo(_li);
					var _a = $("<a class='dt-anchor'></a>");
					
			    	
			    	$("<span class='icon dt-expand'/>").appendTo(_li);
			    	
			    	if(this.showCheckBox){
			    		$("<span class='dt-chk' />").addClass("chkstate0").attr("chkstate", 0).appendTo(_li);
			    	}
			    	
			    	$("<span class='branch b-expand'/>").appendTo(_a);
			        
			    	$("<span class='b-txt'>" +caption+ "</span>").appendTo(_a);
			    	
			    	_a.appendTo(_li);
				}
		    	var footDivLen = this._footdiv.children().length;
		    	var searchDivLen = this._searchdiv.children().length;
		    	if (secondaryType == 5 && footDivLen == 0 && searchDivLen == 0) {
		    		this.el.addClass("chain");
		    		$("<ul class='dt-ul'></ul>").appendTo(_li);
			    	this.el.wrap(this._liwrap);
			    	var $searchWrap = $("<div class = 'dt-searchwrap'></div>");
		    		this.creatSearchInput($searchWrap);
		    		$searchWrap.appendTo(this._searchdiv);
		    		this.el.before(this._searchdiv);
		    		this.creatFootDiv(this._footMean, isNext);
		    		this._footMean.appendTo(this._footdiv);
		    		this.el.after(this._footdiv);
		    	}
		    	
		    	this.rootNode = $('#'+nodeKey,this.el);
		    	
		    	//如果是多选字典 判断根节点打勾状态
				if(this.showCheckBox){    
					if(!jQuery.isEmptyObject(this.checkedNodes) && !this.independent){
			       		this.rootNode.children('.dt-chk').attr('chkstate',2).addClass("chkstate"+2);
			       	}else if(nodeKey in this.checkedNodes){
			       		this.rootNode.children('.dt-chk').attr('chkstate',1).addClass("chkstate"+1);
			       	}
				}
		    		
		    },
		
		    render: function (ct) {
		    	this.el.appendTo($(ct));
		    	this.el.addClass('dt');
		    },
		
		    /**
		     * 收拢节点
		     * @param {} node
		     */
		    collapseNode: function(node) {
				node.children('ul').hide();
				var $arrow = node.children('span:first');
				$arrow.removeClass('dt-expand').addClass('dt-collapse');
				$arrow.next('.dt-anchor').find('.branch').removeClass('b-expand').addClass('b-collapse');
//				$arrow.next('.branch').removeClass('b-expand').addClass('b-collapse');
			},
		    
			/**
			 * 展开节点
			 * @param {} node
			 */
			expandNode: $.noop,/*function(node) {
				if(!node){
					node = this.rootNode;
				}
			
				var Return = this;
				//未加载过的情况下 加载子节点
				if(!node.attr('isLoaded')) {
				
					this.callback.beforeExpand(this , node);
					
					YIUI.Service.getDictChildren(this , node);
				}
			
				node.children('ul').show();
				
				// 维护汇总节点的+号
				var $arrow = node.children('span:first');
				if($arrow.hasClass('dt-collapse')){
					$arrow.removeClass('dt-collapse').addClass('dt-expand');
					$arrow.next('.branch').removeClass('b-collapse').addClass('b-expand');
					
				}
			},*/
			   
			/**
			 * 复选框勾选事件
			 * @param {} $node
			 */
			checkboxClick: function($node) {
				if(this.clearChkNodes) {
					this.checkedNodes = {};
				}
				var state = $node.children('.dt-chk').attr('chkstate') == 0 ? 1 : 0;
				this.checkTreeNode($node, state);
				this.callback.onChecked(this,$node);
				
				var nodeKey = $node.attr('id');
				if(state == 1){
					this.checkedNodes[nodeKey] = this.getNodeValue($node);
				}else{
					delete this.checkedNodes[nodeKey];
				}	
				this.clearChkNodes = false;
			},
			
			selectNode: function(node) {
				if(this.selectedNodeId) {
					$('#' + this.selectedNodeId).removeClass('sel');
				}
				this.selectedNodeId = node.attr('id');
				node.addClass('sel');
				this.callback.onSelected(this, node);
			},
			
			getNodeValue: function($node){
			
			},
			
			/**
			 * 获取选中节点的值
			 * @return {}
			 */
			getCheckedValues: function(){
				if(this.showCheckBox){
					//var nodes = this.el.find("[chkstate = '1']").parent();
					var dictTree = this;
					var values = [];
					var caption = "";
					
					//判断根节点是否打勾	            
		            if(dictTree.rootNode){
			       		var rootId = dictTree.rootNode.attr('id');
			       		if(rootId in dictTree.checkedNodes && !dictTree.independent){
			       			values.push(dictTree.getNodeValue(dictTree.rootNode));
			       			dictTree._showCaption = "";
			       			return values;
			       		}
		            }
		            
		            
					$.each(dictTree.checkedNodes , function(key,val){
						
						var $node = $('#'+key , dictTree.el);
												
						if(!dictTree.independent) {
		
							var pId = $node.attr('parentid');
							var $pNode = $('#'+pId , dictTree.el);
							
							if($pNode){
								var chkstate = $pNode.children('.dt-chk').attr('chkstate') || 0;
								if(chkstate == 1){
									
								}else{
									//caption += ","+$node.children('a').text();
									values.push(val);	
								}
							}else{
								//caption += ","+ $node.children('a').text();
								values.push(val);	
							}
						}else{
							//caption += ","+ $node.children('a').text();
							values.push(val);	
						}
					});
//					if(caption.length > 0){
//						caption = caption.substring(1);
//						dictTree._showCaption = caption;
//					}
					return values;
				
			    }
			},
			
			/**
			 * 转换节点数据
			 * @param {} treeNodes
			 * @return {}
			 */
			formatAsyncData: function(treeNodes){
		    	return treeNodes;
		    },
			
		    /**
		     * 移除根节点外的所有节点 
		     */
		    reset: function (){
		    	if(this.rootNode){
		    		this._pMap = {};
		    		this.collapseNode(this.rootNode);
		    		this.rootNode.children('.dt-ul').children().remove();
		    		this.rootNode.removeAttr('isLoaded');
		    		this.indeterminatedNodes = null;
		    	}
		    }
		
		};
		
		Return.callback = $.extend({
			beforeExpand: $.noop,
			onSelected: $.noop,
			onChecked: $.noop
    	});
    	Return.clickEvent = {

		};
    	Return.el.bind('click', function(e) {
    		var $target = $(e.target);
    		var $node;
    		if($target.prop("tagName").toLowerCase() == "li") {
    			$node = $target;
    		} else {
        		$node = $target.parents('li:first');
    		}
    		if($target.hasClass('dt-collapse')) {
    			
    			Return.expandNode($node);
    			//Return.clickEvent.expandNode(e, Return, null);
    			return;
    		}
    		if($target.hasClass('dt-expand')) {
    			Return.collapseNode($node);
    			//Return.clickEvent.collapse(e, Return, null);
    			return;
    		}
    		if($target.hasClass('dt-chk')) {
    			Return.checkboxClick($node);
    			return;
    		}
    		$(".dt-wholerow.sel", this).removeClass("sel");
    		if($node.hasClass("comp_Level1")) {
    			$(".dt-wholerow:first", $node).addClass("sel");
    		}
    		if(!Return.showCheckBox){
//	    		if($target.hasClass('b-txt')) {
	    			Return.selectNode($node);
	    			return;
//	    		}
    		}
    	});

    	Return.el.delegate("li", "mouseover", function(e) {
    		$(".dt-wholerow.hover", Return.el).removeClass("hover");
    		var li = $(".dt-wholerow:first", this);
    		if(!li.hasClass("sel")) {
    			$(".dt-wholerow:first", this).addClass("hover");
    		}
    		e.stopPropagation();
    	}).delegate("li", "mouseleave", function(e) {
    		$(".dt-wholerow.hover", Return.el).removeClass("hover");
    		e.stopPropagation();
    	});
    	Return = $.extend(Return, options);
		return Return;
	};

	YIUI.Yes_Dict = function(options){
		var Return = {
		    //dropView是否显示
		    _hasShow : false,

		    el: $("<div></div>"),

		    /**
		     * 是否多选字典
		     * @type Boolean
		     */
		    multiSelect :  false,
		    
		    rootNode : null,

		    id: "",
		    
		    //字典控件的下拉按钮
		    _dropBtn : $('<div id="'+options.id+'_dropbtn"/>'),

		    _textBtn : $('<input id="'+options.id+'_textbtn" type="text" />'),

		    _dropView : $('<div id="'+options.id+'_dropview"/>'),
		    
		    $suggestView : $('<div class="dt-autovw dt-vw"/>'),
		    
		    /**
		     * 多选字典，选择模式
		     */
		    checkBoxType :   YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT,

		    /** 父子节点是否关联 */
		    independent : true,
		    
		    /**
		     * 字典itemKey
		     */
		    itemKey : null,
		    
		    dictTree: null,
		    
		    _resetTree : true,

            //字典状态
            stateMask: YIUI.DictStateMask.Enable,

		    needRebuild: true,
		    
		    enable: true,
		    
		    editable: true,

			secondaryType: 0,
			
			init: function() {
				this._textBtn.addClass('txt').appendTo(this.el);
				this._dropBtn.addClass('arrow').appendTo(this.el);
				this._dropView.addClass('dt-vw');
				$(document.body).append(this._dropView);
				$(document.body).append(this.$suggestView);
			},
			
			setEditable: function(editable) {
		    	this.editable = editable;
		    	var el = this._textBtn;
		    	if(this.editable) {
					el.removeAttr('readonly');
				} else {
					el.attr('readonly', 'readonly');
				}
		    },
		    
		    setEnable: function(enable){
		    	this.enable = enable;
		    	var el = this._textBtn,	
		    		outerEl = this.el;
		    	 if(enable) {
		    	 	el.removeAttr('readonly');
					outerEl.removeClass("ui-readonly");
				} else {
					el.attr('readonly', 'readonly');
					outerEl.addClass("ui-readonly");
				}
		    },

		    getEl: function() {
		    	return this.el;
		    },

		    setMultiSelect: function(multiSelect) {
				//TODO 这个地方设置属性是错误的， 因为dicttree已经 创建了 需要改变的是dicttree的多选属性，
				//另 一般情况 字典控件要么多选， 要么单选， 不会动态变化
				this.multiSelect = multiSelect;
			},
			
			setDictTree: function(dictTree) {
				this.dictTree = dictTree;
			},
            getDictTree: function (dictTree) {
                return this.dictTree;
            },
			
			setBackColor: function(backColor) {
				this.backColor = backColor;
				this._textBtn.css({
					'background-image': 'none',
					'background-color': backColor
				})
			},

			setForeColor: function(foreColor) {
				this.foreColor = foreColor;
				this._textBtn.css('color', foreColor);
			},
			
		    setFormatStyle: function(cssStyle) {
				this._textBtn.css(cssStyle);
			},
			
		    setDropViewTop: function() {
		    	var cityObj = this._textBtn;
			    var cityOffset = this._textBtn.offset();
			
			    var bottom = $(window).height() - cityOffset.top - this.el.height();
		        var top = cityOffset.top + cityObj.outerHeight();
		        if(bottom < this._dropView.outerHeight()) {
		        	this._dropView.addClass("toplst");
		        	this.el.addClass("toplst");
		        	top = "auto";
		        	bottom = $(window).height() - cityOffset.top;
		        } else {
		        	this._dropView.removeClass("toplst");
		        	this.el.removeClass("toplst");
		        	bottom = "auto";
		        }
		        if(top != "auto") {
		        	this._dropView.css("top", top + "px");
		        	this._dropView.css("bottom", "auto");
		        }
		        if(bottom != "auto") {
		        	this._dropView.css("bottom", bottom + "px");
		        	this._dropView.css("top", "auto");
		        }
		        this._dropView.css("width", cityObj.outerWidth()+"px");
		        $(".pageinfo").css("border", "0px");
		    },
		    
		    setDropViewLeft: function() {
		    	var cityObj = this._textBtn;
			    var cityOffset = this._textBtn.offset();
			
		    	var right = $(window).width() - cityOffset.left;
		        var left = $(window).width() - this._dropView.outerWidth();
		        if(right < this._dropView.outerWidth()) {
		        	left = "auto";
		        	right = $(window).width() - cityOffset.left - cityObj.outerWidth();
		        } else {
		        	left = cityOffset.left;
		        	right = "auto";
		        }
		        if(left != "auto") {
		        	this._dropView.css("left", left + "px");
		        	this._dropView.css("right", "auto");
		        }
		        if(right != "auto") {
		        	this._dropView.css("right", right + "px");
		        	this._dropView.css("left", "auto");
		        }
		    },
		    
		    /** 设置控件真实值，对应于数据库中存储的值 */
		    setSelValue: function (value) {
		        this.value = value;
		        if( this._resetTree && this.multiSelect){
		        	this.dictTree.reset();
		        	this.setDictTreeCheckedNodes();
		        }

		    },
		    
		    /** 设置需要选中的节点 */
		    setDictTreeCheckedNodes : function (){
		    	if(this.multiSelect){
		    		var checkedNodes = {};
		    		if(this.value){
				 		$.each(this.value,function(i){
				 			var nodeId = this.itemKey+'_'+this.oid;
					 		checkedNodes[nodeId]=this;
					 	});
		    		}
			    	this.dictTree.setCheckedNodes(checkedNodes);
			    }
		    },
		    
		    /** 获取控件真实值 */
		    getSelValue: function () {
		    	// TODO 这处为临时处理
//			    	if(this.value && this.value.length > 0){
		        if(this.value){
		            //this.value.caption = this._textBtn.val();
		            return this.value;
		    	}else{
		    		return null;
		    	}
		    },
		    
		    setWidth: function(width) {
		    	this.el.css('width', width);
		    	this._textBtn.css('width', width);
		        this._dropBtn.css("left", this._textBtn.outerWidth() - 26 + "px");
		    },
		    
		    setHeight: function(height) {
		    	this.el.css('height', height+'px');
		    	this._textBtn.css('height', height+'px');
		    	if($.browser.isIE) {
		    		this._textBtn.css('line-height',(height-3)+'px');
		    	}
		        this._dropBtn.css("top", (this._textBtn.outerHeight() -16) /2 + "px");
		    },
		    
		    setValue: function(value) {
		    	this.value = value;
		    },
		   
		    setText: function (text) {
		        this._textBtn.val(text);
		    }, 
		    
		    getText: function () {
		        return this._textBtn.val();
		    },
		    
		    getInput: function() {
		    	return this._textBtn;
		    },
		    
		    checkDict: $.noop,
		    
		    hiding: $.noop,
		    
		    getItemKey: $.noop,
		    
		    showing: function() {
    	    	if(!this.value) return;
    	    	if(this.multiSelect) {
    	    		var values = this.value;
    	    		for (var i = 0, len = values.length; i < len; i++) {
						var value = values[i];
						this.setSelectionValue(this.getItemKey(), value);
					}
    	    	} else if(this.secondaryType != YIUI.SECONDARYTYPE.CHAINDICT) {
    	    		$(".sel", this._dropView).removeClass("sel");
    	    		this.setSelectionValue(this.getItemKey(), this.value);
    	    		var oid = this.value.oid;
					var $node = $("[oid='"+oid+"']", this.dictTree.el).eq(0);
					if($node.length > 0) {
						var s_top = $node.offset().top - $node.parent().height();
						if(s_top > 0) {
							this.dictTree.el.scrollTop(s_top);
						}
						var $wholerow = $(".dt-wholerow:first", $node);
						if(!$wholerow.hasClass("sel") && $node.hasClass("comp_Level1")) {
							$wholerow.addClass("sel");
						}
					}
    	    	}
    	    },

		    setSelectionValue: function(itemKey, value) {
		    	var paths = YIUI.DictService.getTreePath(itemKey, value);
		    	if(paths.length > 0) {
//		    		for (var i = 0, len = paths.length; i < len; i++) {
		    			//只对第一条路径进行展开
						var parents = paths[0];
						var rootOID = parents[0].oid;
						if(parents) {
							for (var j = 0, len2 = parents.length; j < len2; j++) {
								var parent = parents[j];
								var oid = parent.oid;
								if(j > 0 && oid == rootOID) break;
								var $node = $("[oid='"+oid+"']", this.dictTree.el);
								if($node.length > 0) {
									this.dictTree.expandNode($node);
								}
							}
							var node = $("[oid='"+value.oid+"']", this.dictTree.el);
							if(node.length == 0) {
								this.dictTree.clearChkNodes = true;
							} else {
								this.dictTree.checkTreeNode(node, 1);
							}
						}
//					}
		    	} else {
		    		$(".dt-wholerow.sel", this._dropView).removeClass("sel");
		    	}
		    },
		    
		    setSecondaryType: function (type) {
       			this.secondaryType = type;
    		} , 
    		

    	    destroy: function() {
    	        this._dropView.remove();
    	        this.$suggestView.remove();
    	    },
    	    
    
		    hideDictList : function (){
		        this._dropView.hide();
		        this._hasShow = false;
		        this._resetTree = false;
		        if(this.multiSelect){
		        	//取字典树选中的节点
		        	this.setSelValue(this.dictTree.getCheckedValues());
		        	//this.setText(this.dictTree._showCaption);
		        	
		        } else {
		        	this.setSelValue(this.value);
		        }
		    	this._resetTree = true;
		    	$(document).off("mousedown");
		    	this.hiding();
		    },
		    
		    hideSuggestView : function (){
		    	this.$suggestView.hide();
		    	this.hiding();
		    	$(document).off("mousedown");
		    },
		    
		    getEditor : function(){
		    	return this._textBtn;
		    },
		    
		    install: function() {
		        var self = this;
		        var dictTreeNode = self.dictTree;
		        dictTreeNode.startRow = 0;
		        dictTreeNode.pageIndicatorCount = 3;
		        dictTreeNode.fuzzyValue = null;
		        //下拉按钮绑定下拉事件
		        this._dropBtn.click(function(e){      	
		        	if(!self.enable) {
		        		return;
		        	}
		        	if (dictTreeNode.startRow == 0) {
		        		self.dictTree._footMean.find(".prev").addClass("disable");
		        	}

                    self._textBtn.focus();
				    if(self._hasShow){
				    	self.el.removeClass('focus');
				    	self.hideDictList();
				        return;
				    }

				    self.el.addClass('focus');
				    self.checkDict();
				    
				    if(self.secondaryType == YIUI.SECONDARYTYPE.CHAINDICT){
				    	self.dictTree.reset();
				    	self.dictTree._footdiv.show();
				    	self.dictTree._searchdiv.show();
		        	}
				    if (self.secondaryType != YIUI.SECONDARYTYPE.CHAINDICT) {
				    	self.dictTree._footdiv.hide();
				    	self.dictTree._searchdiv.hide();
				    }
		        	
					self.dictTree.expandNode(self.dictTree.rootNode);
				    self.setDropViewTop();
				    self.setDropViewLeft();
					self.showing();
					self._dropView.slideDown("fast");
				    
				    $(document).on("mousedown",function(e){
				        var target = $(e.target);
				        if((target.closest(self._dropView).length == 0)
				            &&(target.closest(self._dropBtn).length == 0)){
				
				        	self.hideDictList();
				            self.el.removeClass('focus');
				        }
				    });
				
				    self._hasShow = true;
				    e.stopPropagation();
				});
		        
		        //查询按钮绑定事件
		        this.dictTree._searchdiv.delegate(".findspan", "click", function(){
		        	
		        	var value = $(this).prev().val();
		        	if (value != null) {
		        		$(this).parent().parent().parent().find(".next").removeClass("disable");
		        		dictTreeNode.fuzzyValue = value;
		        		dictTreeNode.startRow = 0;
		        		self.dictTree.expandNode(self.dictTree.rootNode);
			        	var len = self.dictTree._footMean.children(".pageinfo").children().length;
			        	if(len == 1 || len == 0) {
			        		self.dictTree._footMean.find(".next").addClass("disable");
			        		self.dictTree._footMean.find(".prev").addClass("disable");
			        		
			        	}
		        	}
		        	
		        	
		        });
		        
		        //查询框回车查找
		        this.dictTree._searchdiv.delegate(".findinput","keydown",function(e){
		        	
		        	var which = e.which;
		        	var val = $(this).val();
		        	if (val != null && which == 13) {
		        		$(this).parent().parent().parent().find(".next").removeClass("disable");
		        		dictTreeNode.fuzzyValue = val;
		        		dictTreeNode.startRow = 0;
		        		self.dictTree.expandNode(self.dictTree.rootNode);
			        	var len = self.dictTree._footMean.children(".pageinfo").children().length;
			        	if(len == 1 || len == 0) {
			        		self.dictTree._footMean.find(".next").addClass("disable");
			        		self.dictTree._footMean.find(".prev").addClass("disable");
			        		
			        	}
			        	
		        	}
		        	
		        });
		        
		        //下一页按钮点击事件
		        this.dictTree._footdiv.delegate(".next", "click", function(){
		        	var oldItem = self.dictTree.el.html();
		        	$(this).parent().find(".prev").removeClass("disable");
		        	dictTreeNode.startRow = dictTreeNode.startRow + 10;
		        	//self.checkDict();
		        	self.dictTree.expandNode(self.dictTree.rootNode);
		        	var newItem = self.dictTree.el.html();
		        	var pNumBtn = $(".nowitem", self.dictTree._footdiv);
		        	var pBtnNumIndex =  self.dictTree._footdiv.find($(".pageinfo span")).index(self.dictTree._footdiv.find($(".nowitem")));
		        	
		        	var maxNum = $(".pageinfo",self.dictTree._footdiv).attr("maxnum"); 
		        	var pageNum = $(self.dictTree._footdiv.find(".pagenum"));
		        	var indexPage = pNumBtn.html();
		        	if (oldItem == newItem) {
		        		dictTreeNode.startRow = dictTreeNode.startRow - 10;
		        	}
		        	if (pBtnNumIndex == 2 && +maxNum >= 1) {
		        		pNumBtn.html(+pNumBtn.html() + 1);
		        		var prevAll = pNumBtn.prevAll();
		        		prevAll.eq(0).html(+prevAll.eq(0).html() + 1);
		        		prevAll.eq(1).html(+prevAll.eq(1).html() + 1);
		        		
		        	}
		        	if (pBtnNumIndex == 2 && +maxNum == 1 ) {
		        		$(this).addClass("disable");
		        	}
		        	
		        	var pBtnLen = pNumBtn.next().length;
		        	if (oldItem != newItem && pBtnLen != 0) {
		        		pNumBtn.removeClass("nowitem");
		        		pNumBtn.next().addClass("nowitem");
		        		pBtnNumIndex = +pBtnNumIndex + 1
		        	}
		        	if (pageNum.length == 2 && pBtnNumIndex == 1) {
		        		$(this).addClass("disable");
		        		
		        	}
		        	
		        });
		        
		        //上一页按钮点击事件
		        this.dictTree._footdiv.delegate(".prev", "click", function(){
		        	dictTreeNode.startRow = dictTreeNode.startRow - 10;
		        	var olditem = self.dictTree.el.html();
		        	$(this).parent().find(".next").removeClass("disable");
		        	self.checkDict();
		        	self.dictTree.expandNode(self.dictTree.rootNode);
		        	var newitem = self.dictTree.el.html();
		        	var pNumBtn = $(".nowitem", self.dictTree._footdiv);
		        	var indexPage = pNumBtn.html();
		        	var pBtnNumIndex =  self.dictTree._footdiv.find($(".pageinfo span")).index($(".nowitem"));
		        	if (indexPage != 1) {
		        		if (pBtnNumIndex == 0) {
		        			pNumBtn.html(+pNumBtn.html() - 1);
		        			var nextAll = pNumBtn.nextAll();
			        		nextAll.eq(0).html(+nextAll.eq(0).html() - 1);
			        		nextAll.eq(1).html(+nextAll.eq(1).html() - 1);
		        			
		        		}
		        		var pBtnLen = pNumBtn.prev().length;
		        		if (pBtnLen != 0) {
		        			pNumBtn.removeClass("nowitem");
			        		pNumBtn.prev().addClass("nowitem");
		        			
		        		}
		        	}
		        	if (olditem == newitem) {
		        		dictTreeNode.startRow = dictTreeNode.startRow + 10;
		        	}
		        	if (+indexPage == 1) {
		        		$(this).addClass("disable");
		        	}
		        	
		        });
		        
		        //页码点击事件 
		        this.dictTree._footdiv.delegate(".pagenum", "click", function(){
		        	var $this = $(this);
		        	var index = $this.html();
		        	var olditem = self.dictTree.el.html();
		        	dictTreeNode.startRow = (index - 1)*10;
		        	self.checkDict();
		        	self.dictTree.expandNode(self.dictTree.rootNode);
		        	var newitem = self.dictTree.el.html();
		        	var pageNum = $(self.dictTree._footdiv.find(".pagenum"));
		        	var clickBtn =  pageNum.index($this);
		        	var maxnum = $this.parent().attr("maxnum");
		        	if(clickBtn == 0 && $this.html() == 1) {
		        		pageNum.removeClass("nowitem");
		        		$this.addClass("nowitem");
		        		$this.parent().parent().children().eq(0).removeClass("disable");
		        		$this.parent().parent().children().eq(1).addClass("disable");
		        	}
		        	if(clickBtn == 1 && pageNum.length == 3) {
		        		pageNum.removeClass("nowitem");
		        		$this.addClass("nowitem");
		        		$this.parent().parent().find(".next").removeClass("disable");
		        		$this.parent().parent().find(".prev").removeClass("disable");
		        	}
		        	if (clickBtn == 1 && pageNum.length == 2) {
		        		pageNum.removeClass("nowitem");
		        		$this.addClass("nowitem");
		        		$this.parent().parent().find(".next").addClass("disable");
		        		$this.parent().parent().find(".prev").removeClass("disable");
		        	}
		        	
		        	if ($this.html() == 1) {
		        		self.dictTree._footMean.children(".prev").addClass("disable");
		        		self.dictTree._footMean.children(".next").removeClass("disable");
		        	}
		        	if(clickBtn == 2) {
		        		pageNum.removeClass("nowitem");
		        		if(maxnum > 1) {
		        			$this.html(+$this.html() + 1);
			        		var prevAll = $this.prevAll();
			        		$(prevAll[0]).html(+$(prevAll[0]).html() + 1);
			        		$(prevAll[1]).html(+$(prevAll[1]).html() + 1);
			        		$(prevAll[0]).addClass("nowitem");
			        		pageNum.find(".next").addClass("nowitem");	
		        		} else {
		        			$this.addClass("nowitem");
		        			$this.parent().parent().find(".next").addClass("disable");
		        			$this.parent().parent().find(".prev").removeClass("disable");
		        		}
	
		        	}
		        	
		        	if(clickBtn == 0 && $this.html() != 1) {
		        		pageNum.removeClass("nowitem");
		        		$this.html(+$this.html() - 1);
		        		var nextAll = $this.nextAll();
		        		$(nextAll).eq(0).html(+$(nextAll[0]).html() - 1);
		        		$(nextAll).eq(1).html(+$(nextAll[1]).html() - 1);
			        	pageNum.eq(1).addClass("nowitem");
			        	$this.parent().parent().children().eq(0).removeClass("disable");
			        	$this.parent().parent().children().eq(1).removeClass("disable");
		        		
		        		
		        	}
		        	
		        });

		        this.$suggestView.delegate("li", "click", function() {
		        	var options = {
	        			oid: $(this).attr("oid"),
	        			itemKey: $(this).attr("itemkey"),
	        			caption: $(this).text()
		        	};
		        	var itemData = new YIUI.ItemData(options);
		        	self.setSelValue(itemData);
		        	self.hideSuggestView();
		        });

				var temp;
				this._textBtn.focus(function(){
					temp = $(this).val();
					//$(this).oldValue = text;
			    }).blur(function(e){
			    	var text = $(this).val();
			    	if(text != temp){
//			    		self.$suggestView.hide();
			    		self.doLostFocus(text);
			    	}
			    });
		    
		    }

		};

    	Return = $.extend(Return, options);
    	Return.init();
		
		var dictTree = new YIUI.Yes_DictTree({
            //dataSource : Return.dataSource ,

            showCheckBox :  Return.multiSelect,

            independent: Return.independent,
            
			formatAsyncData: function(datas){
				$.each(datas,function(i,val){
					var id = val.itemKey+'_'+val.OID;
					val.id = id;
				});
       			return datas;
			},
            getNodeValue: function($node) {
           		if($node.length > 0){
			   		var text = "";
			   		if($node.attr("oid") >= 0) {
                    	text = $node.children('a').text();
                    }
				  	var options = {};
				  	options.oid = $node.attr('oid') || 0;
				  	options.itemKey = $node.attr('itemKey');
				  	options.caption = text;
			   		var itemData = new YIUI.ItemData(options);
					return itemData;
           		}
            },
            expandNode: function(node) {
				if(!node){
					node = this.rootNode;
				}
			
				//未加载过的情况下 加载子节点
				if(node.attr('isLoaded') == "false" || node.attr('isLoaded')== undefined) {
				
					this.callback.beforeExpand(this , node);
					
					/*var nodeId = node.attr('id');
					var success = function(msg) {
						if (msg) {
							var syncNodes = Return.formatAsyncData(msg.data);
							Return.buildTreenode(syncNodes , nodeId, parseInt(node.attr("level"))+1);
							node.attr('isLoaded',true);
						}
					}*/
					
					Return.getDictChildren(node);	
				}
			
				node.children('ul').show();
				
				// 维护汇总节点的+号
				var $arrow = node.children('span:first');
				if($arrow.hasClass('dt-collapse')){
					$arrow.removeClass('dt-collapse').addClass('dt-expand');
					$arrow.next('.dt-anchor').find('.branch').removeClass('b-collapse').addClass('b-expand');
//					$arrow.next('.branch').removeClass('b-collapse').addClass('b-expand');
					
				}
			},	            
            callback : {
            	beforeExpand: function(tree , treeNode){
					if(Return.multiSelect && !Return.independent && tree.indeterminatedNodes == null){
						var value = Return.getSelValue()
						Return.setDictTreeCheckedNodes();							
						tree.indeterminatedNodes = [];

						     	
						if(value && value.length>0){
		            		Return.beforeExpand(tree , treeNode);
						}
					}
					
					/*
            		var param = {};
					param.formID = dict.ofFormID;
					param.key = dict.key;
					param.itemData = $.toJSON(tree.getNodeValue(treeNode));
					param.service = "dictTreeService";
					param.cmd = "getdictchildren";
					
					//if (typeof dict.otherParam == "array") {
					//	for (i = 0, l = dict.otherParam.length; i < l; i += 2) {
					//		tmpParam[dict.otherParam[i]] = dict.otherParam[i + 1];
					//	}
					//} else {
					//	for (var p in dict.otherParam) {
					//		tmpParam[p] = dict.otherParam[p];
					//	}
					//}
					
					tree.url = Svr.SvrMgr.UIProxyURL ;
					tree.params = param;
					*/
		
    			},
    			
    			onSelected : function ($tree, $treeNode) {
                    Return.value = $tree.getNodeValue($treeNode);
//                    var text = "";
//                    if($treeNode.attr("level") > -1) {
//                    	text = $treeNode.children('a').text();
//                    }
//                    Return._textBtn.val(text);
                    if(Return._hasShow){
                    	Return.hideDictList();
                    }
                    
                },
                onChecked: function($tree, $treeNode) {
               }
            }
        });

		Return.setDictTree(dictTree);
        Return._dropView.hide();
        Return._textBtn.val(this.text);
        dictTree.render(Return._dropView);
    	//Return.hideDictList();
    	Return.install();
		return Return;
		
	}
})();(function () {
    YIUI.Yes_DatePicker = function (options) {
        var Return = {
            el: $("<div></div>"),
            dropView: $("<div class='dp-vw'></div>"),
            formatStr: "yyyy-MM-dd HH:mm:ss",
            isNoTimeZone: false,
            isOnlyDate: false,
            regional: "zh-CN",//默认为中文显示
            calendars: 1,
            enable: true,
            editable: true,
            init: function () {
                this._input = $("<input type='text' class='txt'>").appendTo(this.el);
                this._btn = $("<span class='arrow'></span>").appendTo(this.el);
                this.initDatePicker(options.id);
            },
            getEl: function () {
                return this.el;
            },
            getInput: function () {
                return this._input;
            },
            getBtn: function () {
                return this._btn;
            },
            getDropView: function () {
                return  this.dropView;
            },
            getDetailTime: function () {
                return this.detailTime;
            },
            setFormatStr: function () {
                if (this.isOnlyDate) {
                    this.formatStr = "yyyy-MM-dd";
                } else {
                    this.formatStr = "yyyy-MM-dd HH:mm:ss";
                }
            },
            setRegional: function (regional) {
                this.regional = regional;
            },
            setCalendars: function (calendars) {
                this.calendars = calendars;
            },
            setOnlyDate: function (isOnlyDate) {
                this.isOnlyDate = isOnlyDate;
            },
            setIsNoTimeZone: function (isNoTimeZone) {
                this.isNoTimeZone = isNoTimeZone;
            },
            setWidth: function (width) {
                this.el.css('width', width);
                this.getInput().css('width', width);
                this.getBtn().css({ left: this.el.outerWidth() - 26 + "px"});
                this.setDropViewLeft();
            },
            setHeight: function (height) {
                this.el.css('height', height);
                this.getInput().css('height', height);
                var top = (height - 16) / 2;
                this.getBtn().css({top: top});
                if ($.browser.isIE) {
                    this.getInput().css('line-height', (height - 3) + 'px');
                }
            },
            setEditable: function (editable) {
                this.editable = editable;
                var el = this.getInput();
                if (this.editable) {
                    el.removeAttr('readonly');
                } else {
                    el.attr('readonly', 'readonly');
                }
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this.getInput(),
                    outerEl = this.el;
                if (enable) {
                    el.removeAttr('readonly');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('readonly', 'readonly');
                    outerEl.addClass("ui-readonly");
                }
            },
            setValue: function (value) {
                if (!value) return;
                var date;
                if ($.isNumeric(value)) {
                    date = new Date(parseFloat(value));
                } else {
                    var text = value.split(/\W+/);
                    if (this.isOnlyDate) {
                        date = new Date(text[0], text[1] - 1, text[2]);
                    } else {
                        date = new Date(text[0], text[1] - 1, text[2], text[3], text[4], text[5]);
                    }
                }
                this.text = date.Format(this.formatStr);
                this.getInput().val(this.text);
            },

            getText: function () {
                var text = this.getInput().val() || "";
                if (text != "" && this.isOnlyDate) {
                    text += " 00:00:00";
                }
                return text;
            },

            getValue: function () {
                if (this.getText() != "") {
                    var text = this.getText().split(/\W+/);
                    var date = new Date(text[0], text[1] - 1, text[2],
                        text[3] ? text[3] : "00", text[4] ? text[4] : "00", text[5] ? text[5] : "00");
                    if(isNaN(date)){
                        return null;
                    }else{
                        return date.getTime();
                    }
                } else {
                    return null;
                }
            },
            initDatePicker: function (id) {
                var self = this;
                this.getInput().attr("id", "dateInput_" + id);
                this.getInput().DateTimeMask({masktype: (this.isOnlyDate ? 3 : 1)});
                this.getBtn().attr("id", "dateImg_" + id);
                this.setFormatStr();
                this.dropView.attr("id", id + "_datepickerView");
                this.dropView.html("");
                this.dropView.DatePicker({
                    flat: true,
                    format: self.formatStr,
                    date: [new Date()],
                    current: self.getInput().val(),
                    calendars: self.calendars,
                    starts: 7,
                    regional: self.regional,
                    onChange: function (formated) {
                        self.getInput().val(formated);
                        if (!self.isOnlyDate) {
                            self.clearDateTime();
                        } else {
                            self.dropView.hide();
                            self.dropView.blur();
                        }
                    }
                });
                this.detailTime = $("<div class='time'></div>");
                if (!this.isOnlyDate) {
                	$("<button class='btn'>今天</button>")
                	.click(function () {
                		self.getInput().val((new Date()).Format(self.formatStr));
                		if (!self.isOnlyDate) {
                			self.setDetailTime(self.getInput().val());
                		} else {
                			self.dropView.hide();
                			self.dropView.blur();
                		}
                	}).appendTo(this.detailTime);
                	$("<button class='btn'>确认</button>")
                	.click(function () {
                		self.dropView.hide();
                		self.dropView.blur();
                	}).appendTo(this.detailTime);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 23}).data("index", 0);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 59}).data("index", 1);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 59}).data("index", 2);
                	this.detailTime.appendTo(this.dropView);
                }
                this.install();
            },
            setDetailTime: function (date) {
                var dateSplit = date.split(" ");
                if (dateSplit.length < 2)return;
                var dateTime = date.split(" ")[1].split(":");
                for (var i = 0; i < dateTime.length; i++) {
                    $("input", this.detailTime).eq(i).val(dateTime[i]);
                }
            },
            clearDateTime: function () {
                $("input", this.detailTime).each(function () {
                    $(this).val(0);
                });
            },
            setDropViewTop: function () {
                var cityObj = this.getInput();
                var cityOffset = this.getInput().offset();
                var bottom = $(window).height() - cityOffset.top - this.el.height();
                var top = cityOffset.top + cityObj.outerHeight();
                if (bottom < this.dropView.outerHeight()) {
                    this.dropView.addClass("toplst");
                    this.el.addClass("toplst");
                    top = cityOffset.top - this.dropView.outerHeight();
                } else {
                    this.dropView.removeClass("toplst");
                    this.el.removeClass("toplst");
                }
                if (top != "auto") {
                    this.dropView.css("top", top + "px");
                }
            },
            setDropViewLeft: function () {
                var cityObj = this.getInput();
                var cityOffset = this.getInput().offset();
                var right = $(window).width() - $(this.getInput()).offset().left;
                var left = $(window).width() - this.dropView.outerWidth();
                if (right < this.dropView.outerWidth()) {
                    left = "auto";
                    right = $(window).width() - cityOffset.left - cityObj.outerWidth();
                } else {
                    left = cityOffset.left;
                    right = "auto";
                }
                if (left != "auto") {
                    this.dropView.css("left", left + "px");
                    this.dropView.css("right", "auto");
                }
                if (right != "auto") {
                    this.dropView.css("right", right + "px");
                    this.dropView.css("left", "auto");
                }
            },
            install: function () {
                var self = this;
                this.getBtn().click(function (event) {
                    if (!self.enable) return;
                    if ($("#" + self.dropView[0].id).length <= 0) {
                        $(document.body).append(self.dropView);
                    }
                    if (!self.dropView.is(":hidden")) {
                        self.dropView.hide();
                        return;
                    }

                    self.el.addClass('focus');
                    var tables = self.dropView.find('tr:first').find('table');
                    for (var i = 0; i < tables.length; i++) {
                        if (!tables.eq(i).hasClass("datepickerViewDays")) {
                            tables.eq(i).attr("class", "datepickerViewDays");
                        }
                    }
                    if (self.getInput().val()) {
                        self.dropView.DatePickerSetDate(self.getInput().val(), true);
                        if (!self.isOnlyDate) {
                            self.setDetailTime(self.getInput().val());
                        }
                    } else {
                        self.dropView.DatePickerSetDate((new Date()).Format(self.formatStr));
                        self.clearDateTime();
                    }
                    //下拉内容显示的位置
                    var width = self.calendars * 210 + $(".datepickerSpace", self.dropView).children().width() * (self.calendars - 1);
                    if(!self.isOnlyDate) {
                    	width += 160;
                    }
                    self.dropView.css({"min-width": "210px", "min-height": "205px",
                        width:  width
                    });
                    self.dropView.css("z-index", $.getZindex(self.getInput()) + 1);

                    $(".datepicker", self.dropView).css({
                        width: self.calendars * 210,
                        height: self.dropView.height()
                    });
                    self.setDropViewTop();
                    self.setDropViewLeft();
                    self.dropView.slideDown("fast");
                    $(document).on("mousedown.datePicker", function (e) {
                        var target = $(e.target);
                        if ((target.closest(self.dropView).length == 0)
                            && (target.closest(self.getInput()).length == 0)
                            && (target.closest(self.getBtn()).length == 0) && !self.dropView.is(":hidden")) {
                            self.dropView.hide();
                            self.dropView.blur();
                            self.el.removeClass('focus');
                            $(document).off("mousedown.datePicker");
                        }
                    });
                    event.stopPropagation();
                });
                $("input", self.getDetailTime()).bind("blur", function (e) {
                    if (self.getInput().val()) {
                        var inputValue = self.getInput().val();
                        var date = inputValue.substring(0, inputValue.split(" ")[0].length + 1);
                        var timeDetail = inputValue.split(" ")[1].split(":");
                        if (e.target.value.length == 1) {
                            timeDetail[$(this).data("index")] = "0" + e.target.value;
                        } else {
                            timeDetail[$(this).data("index")] = e.target.value;
                        }
                        self.getInput().val(date + timeDetail.join(":"));
                    }
                });
            }
        };
        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        return Return;
    }
})();(function () {
    YIUI.Yes_Combobox = function (options) {
        var Return = {
            //dropView是否显示
            _hasShow: false,

            el: $("<div></div>"),

            _textBtn: $('<input type="text" />'),

            _dropBtn: $('<div/>'),

            _dropView: $('<div/>'),
            
            $suggestView: $('<div/>'),
            
            itemval : 0,
            

            init: function () {
                this._textBtn.addClass('txt').appendTo(this.el);
                this._dropBtn.addClass('arrow').appendTo(this.el);
                this._dropView.addClass('cmb-vw').appendTo($(document.body));
                this.$suggestView.addClass('cmb-autovw cmb-vw').appendTo($(document.body));
                if(this.multiSelect) {
                	this._textBtn.attr('readonly', 'readonly');
                }
            },


            /**
             * 下拉框数据
             */
            items: null,
            /** 是否多选  */
            multiSelect: false,
            sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,
            /**  是否可编辑 */
            editable: true,
            enable: true,
            getEl: function () {
                return this.el;
            },
            setEditable: function (editable) {
                this.editable = editable;
                /*var el = this._textBtn;
                if (this.editable) {
                    el.removeAttr('readonly');
                    el.removeAttr("unselectable");
                    el.removeClass("unsel");
                } else {
                    el.attr('readonly', 'readonly');
                    el.attr("unselectable", "on");
                    el.addClass("unsel");
                }*/
            },
            setEnable: function (enable) {
                this.enable = enable;
                var el = this._textBtn,
                    outerEl = this.el;
                if (enable) {
                    el.removeAttr('disabled');
                    outerEl.removeClass("ui-readonly");
                } else {
                    el.attr('disabled', 'disabled');
                    outerEl.addClass("ui-readonly");
                }
            },

            setFormatStyle: function (cssStyle) {
                this._textBtn.css(cssStyle);
            },

            setDropViewTop: function () {
                var cityObj = this._textBtn;
                var cityOffset = this._textBtn.offset();

                var bottom = $(window).height() - cityOffset.top - this.el.height();
                var top = cityOffset.top + cityObj.outerHeight();
                if (bottom < this._dropView.outerHeight()) {
                    this._dropView.addClass("toplst");
                    this.el.addClass("toplst");
                    top = "auto";
                    bottom = $(window).height() - $(this._textBtn).offset().top;
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
            },

            setDropViewLeft: function () {
                var cityObj = this._textBtn;
                var cityOffset = this._textBtn.offset();

                var right = $(window).width() - $(this._textBtn).offset().left;
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
                this._dropView[0].style.width = cityObj.outerWidth() + "px";
                
            },

            getItemCaption: function (value) {
                if (value == null) return "";
                var caption = this._textBtn.val();

                var arr = new Array();
                arr[0] = value;

                if (this.multiSelect) {
                    arr = value.split(",");
                }

                var caption = new Array();

                for (var index in  arr) {
                    for (var obj in this.items) {
                        if (arr[index] == this.items[obj].value) {
                            caption.push(this.items[obj].caption);
                            break;
                        }
                    }
                }

                return caption.join(',');
            },

            setWidth: function (width) {
                this.el.css('width', width + 'px');
                this._textBtn.css('width', width + 'px');
                this._dropBtn.css({left: this._textBtn.outerWidth() - 26 + "px"});
            },

            setHeight: function (height) {
                this.el.css('height', height + 'px');
                this._textBtn.css('height', height + 'px');
                if ($.browser.isIE) {
                    this._textBtn.css('line-height', (height - 3) + 'px');
                }
                this._dropBtn.css({top: (this._textBtn.outerHeight() - 16) / 2 + "px"});
            },


            destroy: function () {
                this._dropView.remove();
                this.$suggestView.remove();
            },

            getItems: function () {
                return this.items;
            },

            hiding: $.noop,

            hideComboList: function () {
                this._dropView.hide();
                this._hasShow = false;
		    	$(document).off("mousedown");
                this.hiding();
            },


            /**
             * 设置下拉内容
             * @param {} items
             */
            setItems: function (items) {
                if (items == null) items = [];
                this.items = items;
                var comboboxListHtml = $('<ul/>'), _li;
                this._dropView.html(comboboxListHtml);
                for (var i = 0, len = items.length; i < len; i++) {
                	var val = items[i].value == undefined ? "" : items[i].value;
                    if (this.multiSelect) {
                    	var cap = items[i].caption == undefined ? "" : items[i].caption;
                        _li = $('<li><input type="checkbox"  itemValue="' + val + '"/><span>' + cap + '</span></li>');
                    } else {
                        _li = $('<li itemValue="' + val + '">' + (items[i].caption || "") + '</li>');
                        if(val == "") _li.addClass("empty");
                        if (this.value && this.value == items[i].value) {
                            _li.addClass("sel");
                            this._selectedLi = _li;
                        }
                    }
                    comboboxListHtml.append(_li); 
                }
            },

            /**
             * 勾选节点
             * @param {} value
             */
            checkItem: function (value) {
                if (this.multiSelect && value) {
                    var arr = value.split(",");
                    for (var index in  arr) {
                        var checkedBoxes = this._dropView.find('input[type="checkbox"]')
                        for (var i = 0; i < checkedBoxes.length; i++) {
                            if (arr[index] == $(checkedBoxes[i]).attr("itemValue")) {
                                checkedBoxes[i].checked = true;
                                break;
                            }
                        }
                    }
                }
            },

            setSelValue: function (value) {
                this.value = value;
            },

            getSelValue: function () {
                return this.value;
            },

            setText: function (text) {
                this.text = text;
                this._textBtn.val(this.text);
            },
            getText: function () {
                return this._textBtn.val();
            },

            install: function () {
                var self = this;
                this._dropBtn.click(function (e) {
                    if (!self.enable) {
                        return;
                    }
                    self._textBtn.focus();
                    if (self._hasShow) {
                    	self.itemval = 0;
                        self.hideComboList();
                        return;
                    }

                    self._dropView.children("ul").css("width", "auto");
                    self.getItems();
                    self.checkItem(self.getSelValue());
                    self.setDropViewTop();
                    self.setDropViewLeft();
                    self._dropView.show();
                    var val = self.getText();
                    var items = self._dropView.find("li");
                    if (val == "") {
                    	items.removeClass("sel");
                    	self._dropView.scrollTop(0);
                    }
//                    if (val != "") {
//                    	 finditem(val,items);
//                    }

                    self._dropView.children("ul").css("width", self._dropView[0].scrollWidth);
                    
                    if (self._selectedLi && (self._selectedLi.attr("itemValue") == self.getSelValue())) {
                        var scrollHeight = self._dropView.outerHeight() - self._dropView[0].clientHeight;
                        var scrollTop = self._selectedLi.position().top - self._dropView.height() + self._selectedLi.height() + scrollHeight;
                        self._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
                    } else {
                    	/*$(".sel", self._dropView).removeClass("sel");*/
                    	var $li = $("[itemValue='"+self.getSelValue()+"']");
                    	if($li.length > 0 && !$li.hasClass("empty")) {
                    		self._selectedLi = $li;
                    		$li.addClass("sel");
                    	}
                    }

                    $(document).on("mousedown", function (e) {
                        var target = $(e.target);
                        if ((target.closest(self._dropView).length == 0)
                            && (target.closest(self._dropBtn).length == 0) 
                            && (target.closest(self._textBtn).length == 0)) {
                            self.itemval = 0;
                            self.hideComboList();
                            
                        }
                    });
                    self._hasShow = true;
                    e.stopPropagation();
                });

                //节点绑定事件
                this._dropView.delegate("li", "mouseup", function (e) {
                	$(this).parent().find("li").removeClass("sel");
                    if (self.multiSelect) {
                        return;
                    }
                    if (self._selectedLi) {
                        self._selectedLi.removeClass("sel");
                    }
                    if(!$(this).hasClass("empty")) {
                    	$(this).addClass("sel");
                    	self._selectedLi = $(this);
                    } else {
                    	self._selectedLi = null;
                    }
                    var value = $(e.target).attr("itemValue");
                    self.setSelValue(value);
                    self._textBtn.val($(e.target).text());
                    self.hideComboList();
                });
                //节点绑定事件
                this.$suggestView.delegate("li", "mouseup", function (e) {
                	var value = $(e.target).attr("itemValue");
                	self.setSelValue(value);
                	self._textBtn.val($(e.target).text());
                	self.$suggestView.hide();
                	self.hiding();
                	self._selectedLi = $("li[itemvalue="+value+"]", self._dropView).addClass("sel");
    		    	$(document).off("mousedown");
    	            
                });
                
               this._textBtn.on("keyup",function(e) {
            	    var $this = $(this);
            	    var which = e.which;
            	    if (!self._hasShow) {
            		    e.stopPropagation();
            		    return;
            	    }
            	    var val = $this.val();
            	    var items = self._dropView.find("li");
            	    items.removeClass("sel");
            	    if (which != 13) {
            		    self.itemval = 0;
                	    if (self._hasShow ) {
                		    finditem(val,items);
                		    e.stopPropagation();
                		   
                	    }
            	    }
            	    if (which == 13 && val != "") {
            		    enterFindNext(val,items);
            		    e.stopPropagation();
            	    }    
               });
               //查询全部
               function finditem(val,items) {
            	    var itemval = self.itemval;
         		    var len = items.length;
         		    if (len != 0) {
         			    $.each(items,function(index,elem) {
         				    $(elem).parent().find("li").removeClass("sel");
         				    if($(elem).find("span").length == 0 && val != ""  && $(elem).html().indexOf(val) != -1 ) {
         					    if (itemval == 0) {
         						    $(this).parent().parent().scrollTop(index*26);
         						    $(elem).addClass('sel');
         						    itemval = index;
         						    self.itemFlag = index;
         						    return false;
         					    }  
         				    } 
         				    if ($(elem).find("span").length != 0 && $(elem).find("span").html().indexOf(val) != -1) {
         					    if (itemval == 0) {
         						    $(this).parent().parent().scrollTop(index*26);
         						    $(elem).addClass('sel');
         						    itemval = index;
         						    self.itemFlag = index;
         						    return false;
         						 
         					    }
         				    }
         			    });
         		    }  
                };
                //回车遍历查找
                function enterFindNext(val,items){
                	var flag = self.itemFlag;
                	for (var i = flag + 1; i < items.length; i++) {
                		var $item = $(items[i]);
                		if ($item.find("span").length == 0) {
                			var isExist = $item.html().indexOf(val) != -1;
                			isUse = isExist
                			if (isExist) {
                				$item.parent().parent().scrollTop((i)*26);
                    			$item.parent().find("li").removeClass("sel");
                    			$item.addClass('sel');
                    			self.itemFlag = i;
                    			break;
                			}
                		}   
    				    if ($item.find("span").length != 0 ) {
    				    	var isExist = $item.find("span").html().indexOf(val) != -1;
    				    	isUse = isExist
    				    	if (isExist) {
    				    		$item.parent().parent().scrollTop((i)*26);
    							$item.parent().find("li").removeClass("sel");
    							$item.addClass('sel');
    							self.itemFlag = i;
    							break;
    				    	}
    				    }	
                	}
                }

                //多选下拉 CheckBox绑定事件
                if (this.multiSelect) {
                    this._dropView.delegate("input[type='checkbox']", "click", function (e) {
                        var checkedBoxes = self._dropView.find('input[type="checkbox"]');
                        var caption = checkedBoxes.filter(':checked').map(function () {
                            return $(this).next().html();
                        }).get().join(',');

                        var value = checkedBoxes.filter(':checked').map(function () {
                            return $(this).attr("itemValue");
                        }).get().join(',');

                        self._textBtn.val(caption);
                        
                        self.setSelValue(value);
                    });
                }
                
            }
        };

        Return = $.extend(Return, options);
        if(!options.isPortal) {
        	Return.init();
        }
        Return.install();
        return Return;
    }
})();(function() {
	YIUI.Yes_Dialog = function(options) {
		var defaul = {
			el: $("<div></div>"),
			msg: "是否关闭",
			msgType: YIUI.Dialog_MsgType.YES_NO,
			items: []
		};
		options = $.extend(defaul, options);
		var msgType = options.msgType, items;
		var OK_Btn = {
			key: "OK",
			caption: "确定"
		};
		var YES_Btn = {
			key: "YES",
			caption: "是"
		};
		var NO_Btn = {
			key: "NO",
			caption: "否"
		};
		var Cancel_Btn = {
			key: "Cancel",
			caption: "取消"
		};
		switch(msgType) {
			case YIUI.Dialog_MsgType.DEFAULT:
				items = [OK_Btn];
				break;
			case YIUI.Dialog_MsgType.YES_NO:
				items = [YES_Btn, NO_Btn];
				break;
			case YIUI.Dialog_MsgType.YES_NO_CANCEL:
				items = [YES_Btn, NO_Btn, Cancel_Btn];
				break;
		}
		options.items = items;
		var dialogDiv = options.el.attr("id", "close_dialog");
		var btns = {};
		var createHtml = function(hasOK, hasYes, hasNO, hasCancel) {
	    	var label = new YIUI.Control.Label({
				metaObj: {
		    		x: 1,
		    		y: 1,
		    		colspan: 2,
		    		topMargin: 0,
					visible: true
				},
	    		caption: options.msg
	    	});
	    	
	    	var item, btn;
	    	var gridpanel = new YIUI.Panel.GridLayoutPanel({
				metaObj: {
					rowGap : 5,
					columnGap : 2
				},
	    		widths : [5, "50%", "50%"],
	    		minWidths : [ "-1", "-1", "-1"],
	    		heights : [5, "pref", "100%", 25, 15]
	    	});
	    	gridpanel.add(label);
	    	
	    	var flowpanel = new YIUI.Panel.FlexFlowLayoutPanel({
				metaObj: {
					x: 1,
					y: 3,
					colspan: 2,
					visible: true,
					cssClass: "dialog_btns"
				}
	    	});
	    	
	    	for (var i = 0, len = items.length; i < len; i++) {
				item = items[i];
				btn = new YIUI.Control.Button({
					metaObj: {
						key: item.key,
						width: 60,
						height: 25,
						left: i*5
					},
					caption: item.caption,
		    		listeners: null,
		    		value : item.caption
    				
		    	});
		    	btns[item.key] = btn;
		    	flowpanel.add(btn);
			}
	    	gridpanel.add(flowpanel);
	    	return gridpanel;
	    }

		var content = createHtml();
		
		var Return = {
			el: dialogDiv,
			show: function() {
				var settings = {title: options.title, showClose: false, width: "auto", height: "100px"};
				settings.resizeCallback = function() {
					var dialogContent = dialogDiv.dialogContent();
					if(content.hasLayout) {
						content.doLayout(dialogContent.width(), dialogContent.height());
					} else {
						content.setWidth(dialogContent.width());
						content.setHeight(dialogContent.height());
					}
		        }
		        dialogDiv.modalDialog(null, settings);
		        content.render(dialogDiv.dialogContent());
		        var btn;
		        for (var key in btns) {
		        	btn = btns[key];
		        	btn.el.attr("key", key);
		        	btn.el.addClass("dlg-btn");
		        	btn.el.unbind();
				}
		        var left = ($(window).width() / 2 - dialogDiv.width() / 2) + "px";
		        var top = ($(window).height() / 2 - dialogDiv.height() / 2) + "px";
		        dialogDiv.css({left: left, top: top});
			},

			parseOpt: function(key) {
				var opt = -1;
				if(key == YIUI.Dialog_Btn.STR_YES){
					opt = YIUI.Dialog_Btn.YES_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_NO){
					opt = YIUI.Dialog_Btn.NO_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_CANCEL){
					opt = YIUI.Dialog_Btn.CANCEL_OPTION;
				}else if(key == YIUI.Dialog_Btn.STR_OK){
					opt = YIUI.Dialog_Btn.OK_OPTION;
				}
				return opt;	
			},
			close: function() {
				dialogDiv.close();
			}
		};
		return Return;
		
	}
})();


var ConditionParas = ConditionParas || {};

(function() {
	ConditionParas = function() {
		var Return = {
			condParas: [],
			condFormKey : "",
			setCondFormKey: function(condFormKey) {
				this.condFormKey = condFormKey;
			},
			getCondFormKey: function() {
				return this.condFormKey;
			},
			add: function(condItem) {
				this.condParas.push(condItem);
			},
			get: function(i) {
				return this.condParas[i];
			},
			size: function() {
				return this.condParas.length;
			},
			getCondParas: function() {
				return {condParas_items: this.condParas};
			},
			clear: function() {
				this.condParas.length = 0;
			}
		};
		return Return;
	};
	
	ConditionItem = function() {
		var Return = {
			/** 查询字段组建的key */
			key: "",
			/** 查询字段类型 */
			type: -1,
			/** 查询条件 */
			condSign: -1,
			/** 条件组标识 */
			group: "",
			/** 条件组头标志 */
			groupHead: false,
			/** 条件组尾标志 */
			groupTail: false,
			/** 查询的目标表 */
			targetTableKey: "",
			/** 条件关联的数据表标识 */
			tableKey: "",
			/** 条件关联的数据列标识 */
			columnKey: "",
			/** 查询的值 */
			value: "",
			setKey: function(key) {
				this.key = key;
			},
			getKey: function() {
				return this.key;
			},
			setType: function(type) {
				this.type = type;
			},
			getType: function() {
				return this.type;
			},
			setCondSign: function(condSign) {
				this.condSign = condSign;
			},
			getCondSign: function() {
				return this.condSign;
			},
			setGroup: function(group) {
				this.group = group;
			},
			getGroup: function() {
				return this.group;
			},
			setGroupHead: function(groupHead) {
				this.groupHead = groupHead;
			},
			isGroupHead: function() {
				return this.groupHead;
			},
			setGroupTail: function(groupTail) {
				this.groupTail = groupTail;
			},
			isGroupTail: function() {
				return this.groupTail;
			},
			setTargetTableKey: function(targetTableKey) {
				this.targetTableKey = targetTableKey;
			},
			getTargetTableKey: function() {
				return this.targetTableKey;
			},
			setTableKey: function(tableKey) {
				this.tableKey = tableKey;
			},
			getTableKey: function() {
				return this.tableKey;
			},
			setColumnKey: function(columnKey) {
				this.columnKey = columnKey;
			},
			getColumnKey: function() {
				return this.columnKey;
			},
			setValue: function(value) {
				this.value = value;
			},
			getValue: function() {
				return this.value;
			}
		};
		return Return;
	};
})();
/**
 * 工具栏
 */
YIUI.Control.Toolbar = YIUI.extend(YIUI.Control, {
    handler: YIUI.ToolBarHandler,
    height: 36,
    setEnable: function (enable) {
        this.base(true);
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
            if (item.items) {
                for (var j = 0, length = $("ul", _li).children().length; j < length; j++) {
                    var child = $("ul", _li).children().eq(j);
                    child[0].item = item.items[child[0].index];
                }
            }
        }
    },

    onSetWidth: function (width) {
        this.base(width);
        this.ul.width(width - this._dropBtn.width());
        $("li", this.ul).removeClass("hide");
        var children = this.ul.children("[style='display: block;']"), child;
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

    diff: function (json) {
        this.items = json["items"];
        this.repaint();
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.ul = options.el.children("ul");
        var lis = this.el.find("li"), li, item, items = [];
        for (var i = 0, len = lis.length; i < len; i++) {
            li = lis.eq(i);
            item = {
                key: li.attr("key"),
                text: li.children("a").text().trim()
            };
            items.push(item);
        }
        this.items = items;
    },

    onRender: function (ct) {
        this.base(ct);
        this.el.addClass("ui-tbr");
        this.ul = this.renderItems(this.el, this.items);
        this._dropBtn = $("<span class='dp-btn'></span>").appendTo(this.el);
        this.dropView = $("<div class='tbr-dpvw'></div>").appendTo($(document.body));
        this.renderMenu();
    },

    repaint: function () {
        this.ul.remove();
        this.ul = this.renderItems(this.el, this.items);
        this.renderMenu();
    },

    renderItems: function (parent, items) {
    	var ul = parent.children("ul");
    	if(ul.length == 0) {
    		ul = $('<ul></ul>').appendTo(parent);
    	}
        var self = this;
        if (items && items.length > 0) {
            var item, li, an;
            for (var i = 0, len = items.length; i < len; i++) {
                item = items[i];
                li = $('<li></li>').appendTo(ul);
                li.css({display: (item.visible ? "block" : "none")});
                li.key = item.key;
                li[0].index = i;
                an = $('<a></a>').appendTo(li);
                if (item.icon) {
                    an.attr('icon', item.icon);
                    an.addClass("pri-icon");
                }
                $("<span class='txt'/>").html(item.caption).appendTo(an);
                if (!item.enable || !self.enable) {
                    li.addClass("ui-readonly");
                }
                if ($.isArray(item.items)) {
                    if (item.style.toLowerCase() == "splitbutton") {
                        li.addClass("sp-btn");
                        an.addClass("btn-left");
                        $("<a><span class='arrow'></span></a>").addClass("btn-right").appendTo(li);

                    } else if (item.style.toLowerCase() == "dropdownbutton") {
                        li.addClass("dpd-btn");
                        $("<span class='arrow'></span>").appendTo(an);
                    }
                    this.renderItems(li, item.items);
                }
            }
        }
        return ul;
    },

    setItemVisible: function (key, visible) {
        var liItems = $("li", this.el);
        for (var i = 0, li, len = liItems.length; i < len; i++) {
        	li = liItems[i];
            if (li.item.key == key) {
                $(li).css({display: (visible ? "block" : "none")});
                break;
            }
        }
    },

    setItemEnable: function (key, enable) {
        var liItems = $("li", this.el);
        for (var i = 0, li, len = liItems.length; i < len; i++) {
        	li = liItems[i];
            if (li.item.key == key) {
                enable ? $(li).removeClass("ui-readonly") : $(li).addClass("ui-readonly");
                break;
            }
        }
    },

    beforeDestroy: function () {
        this.dropView.remove();
    },
	
	needTip: function() {
		return false;
	},

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        self.el.delegate("li", "click", function (event) {
            var _this = $(this);
            if (_this.hasClass("ui-readonly")) return;
            if (_this.hasClass("dpd-btn")) {
                _this.toggleClass("show");
            } else if (_this.hasClass("sp-btn") && ($(event.target).hasClass("btn-right") || $(event.target).hasClass("arrow"))) {
                _this.toggleClass("show");
            } else {
                self.item = this.item;
                self.handler.doOnClick(self);
                event.stopPropagation();
            }
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if ((target.closest($("ul", _this)).length == 0)
                    && (target.closest(_this).length == 0)) {
                    _this.removeClass("show");
                }
            });
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
                self.handler.doOnClick(self);
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
            _this.width($(this).outerWidth() + $(this).prev(".btn-left").outerWidth())
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
YIUI.reg("toolbar", YIUI.Control.Toolbar);(function($) {
var nodeid = 1;
function getNodeId() {
	return 'treemenubar_node_' + nodeid++;
} 
YIUI.Component.TreeMenuBar = YIUI.extend(YIUI.Component, {
	
	/** 节点数据 */
	nodes : null,
	/**
	 * 颜色主题，默认为Orange。
	 * 可选值：Orange、Blue、Gray、Green、Red
	 */
	theme : 'Orange',
	
	onRender : function(ct) {
		this.base(ct);
		
		this.el.addClass('treemenubar');
		
		if(this.nodes) {
			var nodes = this.nodes,
				node,parentNode, parentEl;
			for(var i=0,len=nodes.length;i<len;i++) {
				node = nodes[i];
				node.id = node.id || getNodeId();
				if(!parentNode) {
					parentNode = node;
				}
				if(node.pId != parentNode.id) {
					parentNode = node;
					var el = $('<ul class="group"><li>'+node.name+'</li><ul></ul></ul>').appendTo(this.el);
					parentEl = $(el.children()[1]);
				} else {
					parentEl.append($('<li>'+node.name+'</li>'));
				}
			}
			this.el.treemenubar({
				header : '> ul > li',
				collapsible : true,
				heightStyle : 'content'
			});
		}
	}
});
YIUI.reg("treemenubar", YIUI.Component.TreeMenuBar);
})(jQuery);
/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-2-14
 * Time: 下午2:31
 * 控件关联数据字段信息存储的对象，存储控件对应的关联的表的key和字段key
 * 通常有关联的控件都会包含一个DataBinding，用以存储关联信息。
 */
YIUI.DataBinding = YIUI.extend({
    tableKey: "",
    columnKey: "",
    init: function (tableKey, columnKey) {
        this.tableKey = tableKey;
        this.columnKey = columnKey;
    },
    setTableKey: function (tableKey) {
        this.tableKey = tableKey;
    },
    getTableKey: function () {
        return this.tableKey;
    },
    setColumnKey: function (columnKey) {
        this.columnKey = columnKey;
    },
    getColumnKey: function () {
        return this.columnKey;
    }
});

/**
 * 按钮控件。
 */
YIUI.Control.Button = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div><button></button></div>',

    handler: YIUI.ButtonHandler,
    
    behavior: YIUI.ButtonBehavior,

    /** 图标 */
    icon: null,
    
    /** 按钮操作类型 */
    type: YIUI.Button_Type.DEFAULT,
    
    setType: function(type) {
    	this.type = type;
    	this.button.setType(type);
    },

    setIcon: function (icon) {
        this.icon = icon;
        this.button.setIcon(icon);
    },

    needClean: function () {
        return false;
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },

    setValue: function (value, commit, fireEvent) {
        var changed = this.base(value, commit, fireEvent);
        this.button.getTextButton().html(value.toString());
        return changed;
    },
    
    getShowText: function() {
    	return this.value;
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.button.setEnable(enable);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.button.getTextButton().css(cssStyle);
    },

    onSetWidth: function (width) {
        this.button.setWidth(width);
    },

    onSetHeight: function (height) {
        this.button.setHeight(height);
    },

    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.button = new YIUI.Yes_Button({
            el: $this.el,
            type: $this.getMetaObj().type
        });
        this.el.addClass("ui-btn");
        this.button.getTextButton().html(this.value);
        this.getMetaObj().icon && this.setIcon(this.getMetaObj().icon);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        if (options.clickContent) {
            this.clickContent = options.clickContent;
        }
        var $this = this;
        this.button = new YIUI.Yes_Button({
            el: $this.el,
            isPortal: true
        });
        this.install();
    },
    
    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        self.el.click(function (e) {
    		window.up_target = null;
        	if(!self.enable) {
        		e.stopPropagation();
        		return false;
        	} else if($(e.target).hasClass("upload")) {
        		window.up_target = $(e.target);
        	}
            self.handler.doOnClick(self);
        });

        self.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9) {   //Tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('button', YIUI.Control.Button);/**
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
YIUI.reg('richeditor', YIUI.Control.RichEditor);YIUI.Control.ButtonGroup = YIUI.extend(YIUI.Control,{
	autoEl : '<div></div>',
	
	/**
	 * [{value:XXX, text:XXX},...]
	 */
    items : [],
	/** 组合按钮的类型（单选radio、复选checkbox） */
	buttonType : 'radio',
	
	onRender : function(ct){
        this.base(ct);
        var el = this.getEl(),
        	buttons = this.items,
        	/** 获取当前控件的id */
        	id = this.getId(),
        	inputId,
        	labelId,
        	button;
		for(var i = 0;i<buttons.length;i++){
			button = buttons[i];
			inputId = id + i;
			var input = $('<input />').attr('type',this.buttonType).attr('name',id).attr('id', inputId).val(button.value).appendTo(el);
			var label = $('<label></label>').attr('for', inputId).html(button.text).appendTo(el);
		}
		el.buttonset({type:this.buttonType});
	},
	
	onSetWidth : function(width) {
		var avgWidth = width / this.items.length - $('label', this.el).cssNum('margin-right');
		this.el.css('width', width + 'px');
		$('label', this.el).css('width', avgWidth + 'px');
	},
	
	onSetHeight : function(height) {
		var span = $('label span', this.el);
		span.css('line-height', (height - span.cssNum('padding-top') - span.cssNum('padding-bottom')) + 'px');
	}
	
});

YIUI.reg('buttongroup',YIUI.Control.ButtonGroup);/**
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
        this.getMetaObj().icon && this.setIcon(this.getMetaObj().icon);
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

    initDefaultValue: function (options) {
        this.base(options);

        this._dropView = $(".dp-vw", this.el).attr("id", this.el[0].id + "_dropdown");
        $("span.arrow", this.el).css({
            "position": "absolute",
            "margin-top": (this.el.outerHeight() - 4) / 2 + "px",
            "float": "right",
            "right": "10px"
        });
        this.button.css({
            "line-height": this.el.outerHeight() + "px",
            "height": this.el.outerHeight() + "px"
        });
        $("label", this.el).css({
            "width": this.el.width() - 22,
            "height": this.el.height(),
            "float": "left"
        });
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
                self.handler.doOnClick(self, $(this).attr("key"));
                self.hideDropdownList();
            });
        }
    }

});

YIUI.reg('dropdownbutton', YIUI.Control.DropdownButton);/**
 * 分割按钮
 * */
YIUI.Control.SplitButton = YIUI.extend(YIUI.Control, {

    autoEl: '<div class="ui-splbtn btn-group"></div>',
    handler: YIUI.SplitButtonHandler,
    behavior: YIUI.SplitButtonBehavior,
    _hasShow : false,
    /**
     * 图标
     */
    icon: '',
    caption: '',
    /** ["xxx","xxx","xxx"...] */
    dropdownItems: [],

    setTip: function (tip) {
        var tip = this.caption;
        this.base(tip);
    },
    
    onRender: function(ct){
    	this.base(ct);
    	var el = this.getEl(),
    		dropdownItems = this.dropdownItems,
    		caption = this.caption,
			buttonLeft = this.buttonLeft = $('<button/>').attr('class', 'btn btn-left').appendTo(el),
			buttonRight = this.buttonRight = $('<button/>').attr('class','btn dp-tgl').attr('data-toggle','dropdown').appendTo(el),
			span = $('<span class="arrow"/>').appendTo(buttonRight);
    	this.getMetaObj().icon && this.setIcon(this.getMetaObj().icon);
		$('<label/>').text(caption).appendTo(buttonLeft);
    	
    	if(dropdownItems.length > 0) {
    		var div = this._dropView = $('<div class="sp-vw"/>').attr('id',this.id+"_dropdown").appendTo($(document.body));
    		var	uls = $('<ul/>').appendTo(div);
    		for(var i=0; i<dropdownItems.length; i++){
    			var li = $('<li></li>').appendTo(uls);
				if(dropdownItems[i].separator) {
					li.attr("role", "separator").addClass("sep");
				} else {
					$('<a>'+dropdownItems[i].text+'</a>').appendTo(li);
					li.attr("key", dropdownItems[i].key);
				}
    		}
    	}
    },
    
    setIcon: function(icon) {
    	this.icon = icon;
    	if ($("span.icon", this.el).length == 0) {
        	$('<span class="icon"/>').css("background-image", "url(Resource/" + icon + ")").appendTo(this.buttonLeft);
        } else {
            $("span.icon", this.el).css("background-image", "url(Resource/" + icon + ")");
        }
    },

    setEnable: function(enable) {
    	this.enable = enable;
    	var el = this.buttonLeft,
		outerEl = this.el;
    	if(this.enable) {
			el.prev().removeAttr('disabled');
			outerEl.removeClass("ui-readonly");
		} else {
			el.prev().attr('disabled', 'disabled');
			outerEl.addClass("ui-readonly");
		}
    },
    
    setFormatStyle: function(cssStyle) {
		$("label", this.buttonLeft).css(cssStyle);
	},
    
    onSetWidth : function(width) {
    	this.el.css("width", width);
    	var width_l = width - this.buttonRight.outerWidth();
    	this.buttonLeft.css("width", width_l);
    	$("label", this.buttonLeft).css("width", width_l - $("span.icon", this.el).outerWidth() - 12);
	},
	
	onSetHeight : function(height) {
    	this.el.css("height", height);
		this.buttonLeft.css("height", height);
		this.buttonRight.css("height", height);
		var icon = $("span.icon", this.el);
		icon.css("top", (height - icon.height() - 2) / 2);
	},
    
    setDisabled : function(disabled) {
    	this.base(disabled);
    	
    	var children = this.getEl().children();
    	$.each(children, function() {
    		if(disabled) {
    			$(this).attr('disabled', 'disabled');
    		} else {
    			$(this).removeAttr('disabled');
    		}
    	});
    },
    
    hideDropdownList: function() {
    	this._dropView && this._dropView.hide();
        this._hasShow = false;
		this.el.removeClass("focus");
    },
    
    setDropViewTop: function() {
    	var cityObj = this.el;
	    var cityOffset = this.el.offset();
	
	    var bottom = $(window).height() - cityOffset.top - cityObj.outerHeight();
        var top = cityOffset.top + cityObj.outerHeight();
        if(bottom < this._dropView.outerHeight()) {
        	this._dropView.addClass("toplst");
        	this.el.addClass("toplst");
        	top = "auto";
        	bottom = $(window).height() - cityOffset.top;
        } else {
        	this._dropView.removeClass("toplst");
        	this.el.removeClass("toplst");
        	bottom = "auto";
        }
        if(top != "auto") {
        	this._dropView.css("top", top + "px");
        	this._dropView.css("bottom", "auto");
        }
        if(bottom != "auto") {
        	this._dropView.css("bottom", bottom + "px");
        	this._dropView.css("top", "auto");
        }
//        this._dropView.css("width", cityObj.outerWidth()+"px");
    },
    
    setDropViewLeft: function() {
    	var cityObj = this.el;
	    var cityOffset = this.el.offset();
	
    	var right = $(window).width() - cityOffset.left;
        var left = $(window).width() - this._dropView.outerWidth();
        if(right < this._dropView.outerWidth()) {
        	left = "auto";
        	right = $(window).width() - cityOffset.left - cityObj.outerWidth();
        } else {
        	left = cityOffset.left;
        	right = "auto";
        }
        if(left != "auto") {
        	this._dropView.css("left", left + "px");
        	this._dropView.css("right", "auto");
        }
        if(right != "auto") {
        	this._dropView.css("right", right + "px");
        	this._dropView.css("left", "auto");
        }
    },
    
    afterRender: function() {
    	this.base();
    	if(this.format) {
    		if(this.format.foreColor) {
    			this.buttonLeft.css("color", this.format.foreColor);
    			this.buttonRight.css("color", this.format.foreColor);
    		}
    		if(this.format.backColor) {
    			this.el.css("background-color", "rgba(0, 0, 0, 0)");
    			this.buttonLeft.css("background-color", this.format.backColor);
    			this.buttonRight.css("background-color", this.format.backColor);
    		}
    	}
    },
    
    initDefaultValue: function(options) {
    	this.base(options);
		this.dropdownItems = options.dropdownitems;
		
		this._dropView = $(".sp-vw", this.el).attr("id", this.el[0].id + "_dropdown");
		$("a", this.el).css("line-height", $("a", this.el).height() + "px");
		this.buttonLeft = $(".btn-left", this.el);
		this.buttonRight = $(".btn-right", this.el);
		this.buttonLeft.css({
			"width": (this.el.outerWidth() - this.buttonRight.outerWidth()),
			"padding": 0,
			"height": this.el.outerHeight()
		});
		this.buttonRight.css("height", this.el.outerHeight());
		$("label", this.buttonLeft).css("width", this.buttonLeft.width());
    },


    beforeDestroy: function() {
        this._dropView && this._dropView.remove();
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },
    /** 
	 * 给DOM添加事件监听。
	 */
	install : function() {
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
		self.buttonRight.click(function(event) {
			if(!self.enable) {
        		return;
        	}
			self.el.addClass("focus");
			if(self._hasShow){
	            self.hideDropdownList();
	            self._hasShow = false;
	            return;
	        }

    		$(document).on("mousedown",function(e){
	            var target = $(e.target);
	
	            if((target.closest(self._dropView).length == 0)
	                &&(target.closest(self.buttonLeft).length == 0)
	                &&(target.closest(self.buttonRight).length == 0)){
	            	
	                self.hideDropdownList();
	                $(document).off("mousedown");
	            }
	        });

            if (!self._dropView) return;
            
			self.setDropViewTop();
		    self.setDropViewLeft();
		    
		    self._dropView.css( "z-index", $.getZindex( self.el ) + 1 );
		    
	        //下拉内容显示的位置
	        self._dropView.slideDown("fast")
		    self._dropView.width(self.el.width() - 3 );
		    if(self._dropView[0].scrollWidth > self._dropView[0].clientWidth) {
		    	self._dropView.children("ul").width(self._dropView[0].scrollWidth);
		    }
		    
	        self._hasShow = true;
	        event.stopPropagation();
		});
		if(!this.disabled) {
			var self = this;
			this.buttonLeft.bind('click', function(){
				self.handler.doOnClick(self);
				if(!self.enable) {
	        		return;
	        	}
				self.el.addClass("focus");
			});
			this.buttonLeft.bind('blur', function() {
				self.el.removeClass("focus");
			})

			var dropdownMenu = $("#"+this.id+"_dropdown");
			$("li", dropdownMenu).bind('click', function(){
				self.handler.doOnClick(self, $(this).attr("key"));
				self.hideDropdownList();
			});
		} 
	}
});

YIUI.reg('splitbutton',YIUI.Control.SplitButton);/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-3-27
 * Time: 上午10:41
 */
YIUI.Control.Calendar = YIUI.extend(YIUI.Control, {
    autoEl: '<div></div>',
    events: new Array(),
    slotMinutes: 30,
    setValue: function (value, commit, fireEvent) {
        var changed = this.base(value, commit, fireEvent);
        this.events = value;
        return changed;
    },
    setHeight: function (height) {
        this.base(height);
        this.el.fullCalendar("option", "height", height);
        this.el.fullCalendar("render");
    },
    onRender: function (ct) {
        this.base(ct);
        var self = this;
        this.el.fullCalendar({
            theme: true,   //是否使用主题
            defaultView: "month",       //默认显示的view：month-月份界面，agendaWeek-周界面，agendaDay-日界面
            header: {        //标题栏
                left: 'prev,next today',   //左边按钮，
                center: 'title',   //中间标题
                right: 'month,agendaWeek,agendaDay' //右边按钮
            },
            titleFormat: { //各个view界面对应的标题显示格式
                month: "yyyy年MM月",
                week: "yyyy年MM月dd-{dd}日",
                day: "yyyy年MM月dd日-dddd"
            },
            //日程事件在各个view上的时间显示格式
            timeFormat: {agendaDay: "HH:mm-{HH:mm}", agendaWeek: "HH:mm-\n{HH:mm}", month: "HH:mm"},
            //月界面，高度定义：fixed-固定显示6周，liquid-高度不变，但是周数随月份变化，variable-高度随月份的周数变化
            weekMode: "liquid",
            weekends: true,//是否显示周六周日
            weekNumbers: false,//是否显示周次（一年中的第几周）
            weekNumberTitle: "周",//周次标题
            buttonText: {   //按钮显示文本
                month: "月",
                agendaWeek: "周",
                agendaDay: "日",
                today: "今天"
            },
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月',
                '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
                '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            editable: true,//日程事件是否可编辑，可编辑是指可以移动，改变大小等
            slotMinutes: this.slotMinutes,// 表示在agenda的view中，两个时间之间的间隔，即一个小时分成多行，每行的时间
            allDayText: "全天",
            axisFormat: "HH" + "点", //周或日界面左边列的显示格式
            minTime: 0,// 设置显示时间从几点开始
            maxTime: 24,// 设置显示时间从几点結束
            slotEventOverlap: false,//設置日程事件是否可以重叠
            events: this.events,
            eventClick: function (calEvent, event, view) {  //点击日程事件时的事件
                var dateFormat = calEvent.allDay ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
                self.modifyEventDialog(calEvent).dialog("open");
            },
            eventMouseover: function (calEvent, event, view) { //鼠标划过日程事件时的事件
            },
            eventMouseout: function (calEvent, event, view) { //鼠标离开日程事件时的事件
            },
            selectable: true, //是否允许用户通过单击或拖动选择日历中的对象，包括天和时间
            selectHelper: true,
            select: function (startDate, endDate, allDay, jsevent, view) {   //选中时间事件
                var dateFormat = allDay ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
                self.editEventDialog(
                    "add",
                    $.fullCalendar.formatDate(startDate, dateFormat),
                    $.fullCalendar.formatDate(endDate, dateFormat),
                    allDay
                ).dialog("open");
            }
        });
    },
    editEventDialog: function (oper, startD, endD, isAllDay, content, eventID) { //弹出的模态窗口
        var self = this;
        startD = (typeof startD == "undefined") ? "" : startD;
        endD = (typeof endD == "undefined") ? "" : endD;
        isAllDay = (typeof isAllDay == "undefined") ? true : isAllDay;
        var formDiv = $("<div id='editEventDialog' style='display: none'></div>");
        $.datepicker.setDefaults($.datepicker.regional['zh-CN'])
        $('<p style="margin: 0;padding:0">日程内容：</p>').appendTo(formDiv)
            .append($('<label id="contentCheck" style="color: red;display: none"></label>'));
        var eventContent = $('<textarea id="event" style="width:100%;height: 50%" placeholder="记录你将要做的一件事...">' +
            '</textarea>').appendTo(formDiv);
        eventContent.focus(function () {
            $("#contentCheck").hide()
        });
        if (typeof  content != "undefined") {
            eventContent.val(content);
        }
        var startDate = $("<input type='text'>").appendTo(formDiv);
        startDate.wrap("<p style='margin: 0;padding: 0'>开始时间：</p>");
        var endDate = $("<input type='text'>").appendTo(formDiv);
        endDate.wrap("<p id='endDate' style='margin: 0;padding: 0;display: none'>结束时间：</p>");
        endDate.datetimepicker({showSecond: false, stepMinute: self.slotMinutes,
            closeText: "选择", currentText: "当前"});
        var allDayCheck = $('<input type="checkbox" value="1" id="isallday"> ').appendTo(formDiv);
        var checkAllDay = function () {
            endDate[0].parentElement.style.display = isAllDay ? "none" : "block";
            if (!isAllDay) {
                allDayCheck.removeAttr("checked");
                startDate.val("");
                endDate.val("");
                startDate.datepicker("destroy");
                startDate.datetimepicker({showSecond: false, stepMinute: self.slotMinutes,
                    closeText: "选择", currentText: "当前"});
            } else {
                allDayCheck.attr("checked", "checked");
                startDate.val("");
                endDate.val("");
                startDate.datetimepicker("destroy");
                startDate.datepicker();
            }
        }
        checkAllDay();
        startDate.val(startD);
        endDate.val(endD);
        allDayCheck.click(function () {
            isAllDay = !isAllDay;
            checkAllDay();
        });
        allDayCheck.wrap("<label></label>").after("全天");
        var checkRule = function () {
            if (eventContent.val() == "") {
                $("#contentCheck").html("内容不允许为空!");
                $("#contentCheck").show();
                return false;
            }
            if (startDate.val() == "") {
                $("#contentCheck").html("开始时间不允许为空!");
                $("#contentCheck").show();
                return false;
            }
            return true;
        };
        formDiv.dialog({   //设置弹出窗口属性
            title: (oper == "add") ? "新建事件" : "编辑事件",
            autoOpen: false,
            height: "auto",
            width: "auto",
            modal: true,
            buttons: {
                "新建": function () {
                    if (!checkRule()) {
                        return;
                    }
                    var newEvent = {
                        title: eventContent.val(),
                        start: startDate.val(),
                        end: isAllDay ? "" : endDate.val(),
                        allDay: isAllDay
                    };
                    self.events.push(newEvent);
                    formDiv.dialog("close");
                },
                "修改": function () {
                    if (!checkRule()) {
                        return;
                    }
                    var modifyEvent = self.getEventByID(eventID);
                    modifyEvent.title = eventContent.val();
                    modifyEvent.start = startDate.val();
                    modifyEvent.end = isAllDay ? "" : endDate.val();
                    modifyEvent.allDay = isAllDay;
                    formDiv.dialog("close");
                },
                "取消": function () {
                    formDiv.dialog("close");
                }
            },
            close: function () {
                formDiv.remove();
                self.el.fullCalendar("refetchEvents");
            }
        });
        var buttonPanel = formDiv[0].nextElementSibling;
        var buttonSet = buttonPanel.firstElementChild;
        if (oper == "add") {       //新建的時候隐藏 修改 按钮
            $(buttonSet.childNodes[1]).hide();
        } else {         //修改的時候隐藏 新增 按钮
            var delButton = $("<button>刪除</button>").button().click(function () {  //添加刪除按鈕，並且实现点击事件
                var delConfirm = $("<div></div>").dialog({
                    title: "确定删除？",
                    height: "auto",
                    width: "auto",
                    modal: true,
                    buttons: {
                        "确定": function () {
                            var delEvent = self.getEventByID(eventID);
                            var index = self.events.indexOf(delEvent);
                            self.events.splice(index, 1);
                            formDiv.dialog("close");
                            delConfirm.dialog("close");
                        },
                        "取消": function () {
                            delConfirm.dialog("close");
                        }
                    },
                    close: function () {
                        delConfirm.remove();
                        self.el.fullCalendar("refetchEvents");
                    }
                });
            });
            var delDiv = $("<div style='float: left;width: auto;height: auto'></div>").append(delButton);
            buttonPanel.insertBefore(delDiv[0], buttonSet);
            $(buttonSet.childNodes[0]).hide();
        }
        return formDiv;
    },
    modifyEventDialog: function (event) {
        var dateFormat = event.allDay ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
        return this.editEventDialog("modify", $.fullCalendar.formatDate(event.start, dateFormat),
            $.fullCalendar.formatDate(event.end, dateFormat), event.allDay, event.title, event._id);
    },
    getEventByID: function (id) {
        for (var i = 0; i < this.events.length; i++) {
            var event = this.events[i];
            if (event._id == id) {
                return event;
            }
        }
        return null;
    }
});
YIUI.reg('calendar', YIUI.Control.Calendar);
/**
 * 复选框控件。
 */
YIUI.Control.CheckBox = YIUI.extend(YIUI.Control, {

    autoEl: "<div></div>",

    handler: YIUI.CheckBoxHandler,

    behavior: YIUI.CheckBoxBehavior,

    /**
     * 是否默认选中
     */
    checked: false,

    text: "",

    setText: function (text) {
        this.text = text;
        this.checkbox.setText(text);
    },

    getText: function () {
        return  this.text;
    },
    
    getShowText: function() {
    	return this.getText();
    },

    onSetHeight: function (height) {
        this.base(height);
        this.checkbox.setHeight(height);
    },

    onSetWidth: function (width) {
        this.base(width);
        this.checkbox.setWidth(width);
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.checkbox.setEnable(enable);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.checkbox.getLabel().css(cssStyle);
        $("input", this.el).css(cssStyle);
    },

    checkEnd: function(value) {
    	this.value = value;
        this.checkbox.setChecked(YIUI.TypeConvertor.toBoolean(this.value));
    },
    
    isNull: function() {
    	return !YIUI.TypeConvertor.toBoolean(this.value);
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        this.checkbox = new YIUI.Yes_CheckBox({
            el: $this.el
        });
        this.el.addClass("ui-chk");
        this.checkbox.setChecked(this.getMetaObj().checked);
        var txt = this.text.replace(/ /g, "&nbsp;");
        this.checkbox.setText(txt);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        if (options.clickContent) {
            this.clickContent = options.clickContent;
        }
        var $this = this;
        this.checkbox = new YIUI.Yes_CheckBox({
            el: $this.el,
            isPortal: true
        });
        this.install();
    },

    focus: function () {
        this.checkbox && this.checkbox.getCheckBox().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.checkbox.getCheckBox().change(function (e) {
            var value = this.checked;
            self.setValue(value, true, true);
        });
        this.checkbox.getCheckBox().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {   //Enter
                self.checkbox.getCheckBox().click();
                event.preventDefault();
            } else if (keyCode === 9) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('checkbox', YIUI.Control.CheckBox);
YIUI.Control.ComboBox = YIUI.extend(YIUI.Control, {

    needRebuild: true,
    
    /**
     * 下拉框数据
     */
    items :null,

    /**
     * 是否多选
     * @type Boolean
     */
    multiSelect : false,
    
    hasText: false,
    
    sourceType: YIUI.COMBOBOX_SOURCETYPE.ITEMS,

    /**
     * 是否可编辑
     * @type Boolean
     */
    editable : true ,
    
    handler: YIUI.ComboBoxHandler,
    
    behavior: YIUI.ComboBoxBehavior,
    
    init : function(options){
    	this.base(options);
    	this.multiSelect = (options.type == YIUI.CONTROLTYPE.CHECKLISTBOX);
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setEditable: function(editable) {
    	if(this.multiSelect) {
    		this.editable = false;
    	} else {
    		this.editable = editable;
    	}
    	this.yesCombobox.setEditable(this.editable);
    },
	
    setEnable: function(enable){
    	this.enable = enable;
    	this.yesCombobox.setEnable(enable);
    },
    
    getCheckedValue : function (){

    },
    
	dependedValueChange: function(dependedField){
		this.needRebuild = true;
		this.setText("");
        this.setValue(null, true, true, false, true);
	},
    
    checkEnd: function(value) {
		var text = "";
        if (value) {
        	switch (this.getMetaObj().sourceType) {
        	case YIUI.COMBOBOX_SOURCETYPE.FORMULA:
        		this.handler.getComboboxItems(this);
        		text = this.getCaption(value);
        		break;
        	case YIUI.COMBOBOX_SOURCETYPE.QUERY:
        		text = value;
        		break;
        	default:
        		text = this.getCaption(value);
        	break;
        	}
        	if(!text && this.getMetaObj().editable) {
            	text = value;
            }
        }
        this.setText(text);
        this.value = value;
        this.yesCombobox.setSelValue(value);
        this.checkItem(value);
	},
    
    /**
     * 获取下拉选项
     */
    getItems : function(){
    	this.handler.getComboboxItems(this);
    },
    
	setFormatStyle: function(cssStyle) {
		this.cssStyle = cssStyle;
		this.yesCombobox.setFormatStyle(cssStyle);
	},
	
    setBackColor: function (backColor) {
        this.backColor = backColor;
        $("input",this.getEl()).css({
            'background-image': 'none',
            'background-color': backColor
        });
    },

    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        $("input",this.getEl()).css('color', foreColor);
    },

    onSetWidth: function(width) {
    	this.yesCombobox.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesCombobox.setHeight(height);
    },
    
    /**
     * 设置下拉框显示值
     * @param {} text
     */
    setText: function (text) {
    	this.text = text;
        this.yesCombobox.setText(text);
    },
    
    getText: function() {
    	return this.text;
    },
    
    getShowText: function() {
    	return this.getText();
    },
    
    /**
     * 设置下拉内容
     * @param {} items
     */
    setItems: function(items) {
    	this.items = items;
    	this.yesCombobox.setItems(items);
    },
    	
    /**
     * 勾选节点
     * @param {} value
     */
    checkItem: function(value){
    	this.yesCombobox.checkItem(value);
    },
    
    beforeDestroy: function() {
    	this.yesCombobox.destroy();
    },
    
    getValue: function() {
    	var val = this.value;
    	if (this.getMetaObj().integerValue) {
    		val = YIUI.TypeConvertor.toInt(val);
    	}
    	return val;
    },
    
    getCaption: function(value) {
    	var caption = "";
    	if(this.multiSelect) {
    		var values = value.split(",");
    		for (var i = 0, len = values.length; i < len; i++) {
    			if(i > 0) {
    				caption += ",";
    			}
    			caption += this.getItemCaption(values[i]);
			}
    	} else {
    		caption = this.getItemCaption(value);
    	}
    	return caption;
    },
    
    getItemCaption: function(value) {
    	var caption = ""; 
    	for (var i = 0, len = this.items.length, item; i < len; i++) {
			item = this.items[i];
			if(item.value == value) {
    			caption = item.caption;
    			break;
    		}
		}
    	return caption;
    },

    focus: function () {
        $("input", this.el).focus();
    },
    
    install: function() {
    	this.base();
    	var self = this;
    	var index = -1;
    	var keyFocus = false;
    	var hideCombView = function() {
    		self.$combView && self.$combView.hide();
			self.selLi = null;
			$(".selected", self.$combView).removeClass("selected");
			var val = self.yesCombobox._textBtn.val();
			var items = self.items;
			var isHas = false;
			for (var i = 0; i < items.length; i++) {
				if (items[i].caption == val) {
					val = items[i].value;
					isHas = true;
				}
			}
			val = val == "" ? null : val;
			var integerVal = self.getMetaObj().integerValue;
      	    var editable = self.metaObj.editable;
      	    if (integerVal || editable == false) {
      	    	if (isHas == false) {
      	    		val = null;
      	    	}
      	    }
			self.setValue(val, true, true);
	    	index = -1;
    	};
    	$("input", self.el).bind("keyup", $.debounce(200, function(e){
    		if (self.yesCombobox._hasShow) {
    			 e.stopPropagation();
    			 return;
    		}
			if(self.multiSelect) return;
        	var value = $(this).val();
    		var keyCode = e.keyCode;
    		if(keyCode == 27) {
    			hideCombView();
    			return;
    		}
    		
            $(document).on("mousedown", function (e) {
                var target = $(e.target);
                if(self.selLi && self.selLi.length > 0) {
                	self.selLi.mouseup();
                } else if (target.closest(self.yesCombobox.$suggestView).length == 0 
                		&& target.closest(self.yesCombobox._textBtn).length == 0) {
			    	hideCombView();
			    	var integerVal = self.getMetaObj().integerValue;
		      	    var editable = self.metaObj.editable;
                	var val = self.yesCombobox._textBtn.val();
			    	if (editable == true && integerVal == false) {
			    		self.setText(val);
			    	}
			    	$(document).off("mousedown");
                }
    			self.selLi = null;
            });
            
        	if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
        	if(keyCode == 13) {
        		if(self.selLi) {
        			index = -1;
        			self.selLi.mouseup();
        		}
        		return;
        	}
        	self.handler.doSuggest(self, value);

        }));
    	
    	$("input", self.el).bind("keydown", function(e){
    		if (self.yesCombobox._hasShow) {
				e.stopPropagation();
				return;
    		}
    		if(!keyFocus && self.sourceType == YIUI.COMBOBOX_SOURCETYPE.QUERY) {
    			keyFocus = true;
    			self.handler.getComboboxItems(self);
    		}
    		var keyCode = e.keyCode;
            var $suggestView = self.yesCombobox.$suggestView, $combView, isAutoView = false;;
            
            if(!$suggestView.is(":hidden") || (self.yesCombobox._dropView.is(":hidden") && (keyCode != 40))) {
            	$combView = $suggestView;
            	isAutoView = true;
            } else {
            	$combView = self.yesCombobox._dropView;
            }
            self.$combView = $combView;
            var maxLen = $("li", $combView).length;
            if(keyCode == 38) {
            	if(!isAutoView && self.yesCombobox._dropView.is(":hidden")) {
            		return;
            	}
            	index--;
            	if(index == -1) index = maxLen - 1;
            } else if(keyCode == 40) {
            	if(!isAutoView && self.yesCombobox._dropView.is(":hidden")) {
            		self.yesCombobox._dropBtn.click();
            		var $li = $("li.sel", self.yesCombobox._dropView).removeClass("sel");
            		index = $li.index();
            	}
            	index++;
            	if(index == maxLen) index = 0;
            } else if (keyCode == 9 || keyCode === 13 || keyCode === 108) {
                self.focusManager.requestNextFocus(self);
                if (keyCode == 9 && !self.yesCombobox._dropView.is(":hidden")) {
                    $(document).mousedown();
                }
                e.preventDefault();
            } else {
                return;
            }
            if (index == -1) return;
            self.selLi && self.selLi.removeClass("selected").removeClass("sel");
            var li = $combView.find("li:eq("+index+")");
            li.addClass("selected");
            self.selLi = li;

            var scrollHeight = self.yesCombobox._dropView.outerHeight() - self.yesCombobox._dropView[0].clientHeight;
            var scrollTop = li.position().top - self.yesCombobox._dropView.height() + li.height() + scrollHeight;
            self.yesCombobox._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
            
            if(!isAutoView) {
            	self.yesCombobox._textBtn.val(li.text());
            }
        	
    	});

    	$("input", self.el).blur(function() {
    		keyFocus = false;
	  	    var _this = $(this);
      	    var integerVal = self.getMetaObj().integerValue;
      	    var editable = self.metaObj.editable;
      	    var isHave = false;
      	    var val = self.yesCombobox._textBtn.val();
      	    var items = self.items;
  	    	if(self.multiSelect) {
  	    		var vs = val.split(",");
  	    		var allin = false;
  	    		for (var i = 0, len = vs.length; i < len; i++) {
					var v = vs[i];
					var isin = false;
					for (var j = 0; j < items.length; j++) {
      	    			var caption = items[j].caption;
      	    			if (caption == v) {
      	    				isin = true;
      	    				continue;
      	    			}
      	    		}
					if(isin) {
						allin = true;
						isin = false;
					} else {
						allin = false;
						break;
					}
				}
  	    		isHave = allin;
  	    	} else {
  	    		for (var i = 0; i < items.length; i++) {
  	    			var itemCaption = self.items[i].caption;
  	    			if (itemCaption != "" && itemCaption == val) {
  	    				isHave = true;
  	    				break;
  	    			}
  	    		}
  	    	}
	  	    if (integerVal || editable == false) {
	      	    if (isHave == false) {
	      	    	self.yesCombobox._textBtn.val("");
	      	    	self.setValue(null, true, true);
	      	    }
	  	    } else if(editable) {
	  	    	self.setValue(self.yesCombobox._textBtn.val(), true, true);
	  	    }
      	    
    	});
    },

	initDefaultValue: function(options) {
		this.base(options);
		if(options.multiSelect) {
			this.multiSelect = options.multiSelect;
		}
    	if(options.columnKey) {
			this.columnKey = options.columnKey;
		}
		if(options.tableKey) {
			this.tableKey = options.tableKey;
		}
		if(options.sourceType) {
			this.sourceType = options.sourceType;
		}
		if(options.evalItems) {
			this.evalItems = options.evalItems;
		}
		var self = this;
    	this.yesCombobox = new YIUI.Yes_Combobox({
    		el: self.el,
        	isPortal: true,
    		multiSelect: self.multiSelect,
    		items: self.items,
    		value: self.value,
        	isPortal: true,
    		getItems : function(){
    			self.handler.getComboboxItems(self);
    	    },
    	    hiding : function (){
    	    	var value = this.getSelValue();
    			self.setValue(value, true, true);
    	    }
    	});
    	
		this._dropView = $(".cmb_vw", this.el).appendTo($(document.body));
		$(".cmb_vw", this.el).remove();
		this._textBtn = $("input", this.el);
		this._dropBtn = $(".arrow", this.el);
		self._firstClick = false;
		this._textBtn.css({
			'width': this.el.outerWidth(),
			'height': this.el.outerHeight()});
        this._dropBtn.css({
            left: this._textBtn.outerWidth() - 26,
			top: (this._textBtn.outerHeight() -16) /2,
            height: "16px",
            width: "16px"});
    	if($.browser.isIE) {
    		this._textBtn.css('line-height',(this.el.outerHeight()-3));
    	}

        this.install();
    },
    setSourceType: function(sourceType) {
    	this.sourceType = sourceType;
    },
    /** 完成button的渲染 */
    onRender: function (ct) {
        this.base(ct);
    	var self = this;
    	this.yesCombobox = new YIUI.Yes_Combobox({
    		el: self.el,
    		multiSelect: self.multiSelect,
    		required: self.required,
    		items: self.items,
    		value: self.value,
    		intergerValue: this.getMetaObj().integerValue,
    		getItems : function(){
    			self.handler.getComboboxItems(self);
    	    },
    	    hiding : function (){
    	    	var value = this.getSelValue();
    			self.setValue(value, true, true, false, true);
    	    }
    	});
        this.el.addClass("ui-cmb");
        this.setValue(this.value);
        this.setText(this.text);

		if(this.getMetaObj().sourceType) {
	        this.setSourceType(this.getMetaObj().sourceType);
		}
		this.setItems(this.items);
        //this._dropView.html(comboboxListHtml);
//        this.hideComboList();
        var value = this.getValue();
        this.checkItem(value);
		//this._textBtn.val(this.getItemCaption(value));
        
    	
    	
		//if(this.multiSelect && value){
		//	var arr = this.getValue().split(",");
		//  	for(var index in  arr){
		//  		var checkedBoxes = this._dropView.find('input[type="checkbox"]')
		//		for(var i = 0 ; i <  checkedBoxes.length ; i++){
		//			if(arr[index] == checkedBoxes[i].value){
		//				checkedBoxes[i].checked = true;
		//				break;
		//			}
		//		}
		//  	}
		//}

    }
});
YIUI.reg('combobox', YIUI.Control.ComboBox);
YIUI.reg('checklistbox', YIUI.Control.ComboBox);/**
 * 日期控件，主要是用于显示日期及时间
 */
YIUI.Control.DatePicker = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 此控件由自动渲染为div。
     */
    autoEl: '<div></div>',

    handler: YIUI.DatePickerHandler,
    
    behavior: YIUI.DatePickerBehavior,

    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    isNoTimeZone: false,

    regional: "zh-CN",//默认为中文显示

    mask: null,

    calendars: 1,

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setFormatStr: function () {
        if (this.getMetaObj().isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        this.datePicker.setEditable(editable);
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.datePicker.setEnable(enable);
    },

    /**
     * 设置背景色
     */
    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.datePicker.getInput().css({
            'background-image': 'none',
            'background-color': backColor
        })
    },

    /**
     * 设置前景色
     */
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this.datePicker.getInput().css('color', foreColor);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.datePicker.getInput().css(cssStyle);
    },

    setText: function (text) {
        if (text && text.length > 0) {
            text = text.replace(/-/g, "/");
            var date = new Date(text);
            this.text = date.Format(this.formatStr);
            this.datePicker.getInput().val(this.text);
        } else {
            this.text = text;
            this.datePicker.getInput().val(this.text);
        }
    },

    getText: function () {
        var text = this.text || "";
        if (text != "" && this.getMetaObj().isOnlyDate) {
            text += " 00:00:00";
        }
        return text;
    },

    getShowText: function() {
    	return this.getText();
    },

    changeToVal: function () {
        var text = this.getText();
        if (this.getText() != "") {
            text = text.replace(/-/g, "/");
//            return (new Date(text)).getTime();
            return new Date(text);
        } else {
            return null;
        }
    },

    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        $this.formatStr && this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            formatStr: $this.formatStr,
            isOnlyDate: $this.getMetaObj().isOnlyDate,
            isNoTimeZone: $this.getMetaObj().isNoTimeZone,
            regional: $this.getMetaObj().regional,
            calendars: $this.calendars
        });
        this.el.addClass("ui-dp");

        if (this.text) {
            this.setText(this.text);
        }
        if (this.value) {
            var value = new Date(parseInt(this.value));
            this.setValue(value, false, false);
        }
    },

    afterRender: function () {
        this.base();
        if (this.mask) {
//			this._dateInput.DateTimeMask({masktype: "1",isnow: true});
        }
    },
    onSetWidth: function (width) {
        this.datePicker.setWidth(width);
    },

    onSetHeight: function (height) {
        this.datePicker.setHeight(height);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.formatStr = options.formatstr;
        this.isOnlyDate = options.isonlydate;
        this.isNoTimeZone = options.isnotimezone;
        this.calendars = 1;
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
        var $this = this;
        this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            isPortal: true,
            formatStr: $this.formatStr,
            isOnlyDate: $this.isOnlyDate,
            isNoTimeZone: $this.isNoTimeZone,
            regional: $this.regional,
            calendars: $this.calendars
        });
        this.datePicker.setIsNoTimeZone(this.isNoTimeZone);
        this.datePicker.setOnlyDate(this.isOnlyDate);
        this.datePicker.setRegional(this.regional);
        this.datePicker.setCalendars(this.calendars);
        this.datePicker.initDatePicker(this.id);
        var _dateInput = this.datePicker.getInput(),
            _dateImg = this.datePicker.getBtn();
        _dateImg.css({
            left: this._dateInput.outerWidth() - 26 + "px",
            top: (this._dateInput.outerHeight() - 16) / 2 + "px",
            height: "16px", width: "16px"});
        if ($.browser.isIE) {
            _dateInput.css('line-height', (this.el.outerHeight() - 3) + 'px');
        }
        if (this.value) {
            if (this.isOnlyDate) {
                this.value = this.value.substring(0, this.value.indexOf(" "));
            }
            this.setValue(this.value);
        }
        if (this.text) {
            this.setText(this.text);
        }
    },

    beforeDestroy: function () {
        this.datePicker.getDropView().remove();
    },

    focus: function () {
        this.datePicker && this.datePicker.getInput().focus();
    },
    
    checkEnd: function(value) {
    	this.value = value;
		this.caption = value;
		var text = "";
        if(this.value) {
        	text = this.value.Format(this.formatStr);
        }
        this.setText(text);
    },
    
    install: function () {
        this.base();
        var self = this;
        this.datePicker.getInput().bind('click',function (event) {
            this.select();
        }).on('blur', function (event) {
                var curText = event.target.value;
                if (curText != self.text) {
                    self.text = curText;
                    self.setValue(self.changeToVal(), true, true);
                }
            });
        this.datePicker.getDropView().blur(function (event) {
            var curText = self.datePicker.getInput().val();
            if (curText != self.text) {
                self.text = curText;
                self.setValue(self.changeToVal(), true, true);
            }
        });
        this.datePicker.getInput().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
})
;
YIUI.reg('datepicker', YIUI.Control.DatePicker);/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-21
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */

YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT = YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT;

YIUI.Control.DICT_CKBOXTYPE_SINGLE_SELECT = YIUI.TREEPANEL_CKBOXTYPE_SINGLE_SELECT;

YIUI.Control.Dict = YIUI.extend(YIUI.Control, {

    //dropView是否显示
   	//_hasShow : false,

    /**
     * 用于固定数据源，一次构建完整的字典树
     */
    //dataSource : null,

    /**
     * 是否多选字典
     * @type Boolean
     */
    //multiSelect :  false,
    
    //rootNode : null,

    //字典控件的下拉按钮
    //_dropBtn : null,

    //_textBtn : null,

    //_dropView : null,
    
    //_error : null,

    /**
     * 多选字典，选择模式
     */
    //checkBoxType :   YIUI.Control.DICT_CKBOXTYPE_NORMAL_SELECT,

    /** 父子节点是否关联 */
    //independent : true,
    
    /**
     * 字典itemKey
     */
    //itemKey : null,
        
    //otherParam:null,
    
    //dictTree: null,
    
    //newNodes: [],
    
    //clicked: false,
 
    //_needReloadIndeterminatedNodes : false,
    
    //_resetTree : true,
	value : null,
	
    handler: YIUI.DictHandler,
    
    behavior: YIUI.DictBehavior,
    
    //字典状态
    stateMask: YIUI.DictStateMask.Enable,
    
    needRebuild: true,
    
	init : function (options){
		//this.itemKey = options["itemKey"];
		//this.otherParam = {"Service":"dictTreeService","Cmd":"getdictchildren","itemKey":this.itemKey};
		//this.autoParam = ["id=parentid","itemKey=layerItemKey"];
		this.base(options);
	},
	
	setEditable: function(editable) {
		this.editable = editable;
    	this.yesDict.setEditable(this.editable);
    },
    
    setEnable: function(enable){
    	this.enable = enable;
    	this.yesDict.setEnable(enable);
    },

	setBackColor: function(backColor) {
		this.yesDict.setBackColor(backColor)
	},

	setForeColor: function(foreColor) {
		this.yesDict.setForeColor(foreColor);
	},
	
    setFormatStyle: function(cssStyle) {
    	this.yesDict.setFormatStyle(cssStyle);
	},
	
	setMultiSelect: function(multiSelect) {
		this.multiSelect = multiSelect;
		this.yesDict.setMultiSelect(multiSelect);
	},
	

//	
//	getDictRoot : function(){
//		var dict = this;
//		var data = {};
//		data.formID = dict.ofFormID;
//		data.key = dict.key;
//		
//		data.service = "dictTreeService";
//		data.cmd = "getdictroot";
//		
//		var success = function(result) {
//			if (result ){
//				dict.itemKey = result.itemKey;
//				
//				if(dict.dictTree.rootNode != null){
//					if(dict.dictTree.rootNode.attr('itemKey') == result.itemKey){
//						return;
//					}
//					dict.dictTree.rootNode.remove();
//				}
//				
//				dict.dictTree.createRootNode(result.itemKey,result.itemKey+'_'+result.soid,result.caption);
//			}
//			dict.setDictTreeCheckedNodes();
//		}
//		
//		Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
//		
//	},


    beforeDestroy: function() {
        this.yesDict.destroy();
    },

    isNull: function() {
    	var value = this.value;
    	if($.isEmptyObject(value)){
			return true;
		}
		if (value instanceof YIUI.ItemData) {
			return value.oid == 0;
		} else if ($.isArray(value)) {
			for (var i = 0, len = value.length; i < len; i++) {
				if(value[i].oid > 0){
					return false;
				}
			}
			return true;
		}
		return false;
    },
    
    getCheckOpts: function(options) {
    	var opts = this.base(options);
    	var form = YIUI.FormStack.getForm(this.ofFormID);
    	var options = {
            dictCaption: form.dictCaption,
            itemKey: this.itemKey
        };
    	opts = $.extend(opts, options);
    	return opts;
    },

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    checkEnd: function(value) {
		this.value = value;
		this.yesDict.setValue(value);
		var text = "";
		if(value != null) {
			if(this.multiSelect) {
				for (var i = 0, len = value.length; i < len; i++) {
					var val = value[i];
					if(i > 0) {
						text += ",";
					}
					text += val.caption;
				}
			} else {
				text = value.caption;
				if(value.oid == 0) {
					this.value = null;
				}
			}
		}
		this.setText(text);
	},
    
    /** 获取控件真实值 */
    getValue: function () {
    	return this.value;
    },
    
    onSetWidth: function(width) {
    	this.yesDict.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesDict.setHeight(height);
    },
    
    getDictTree: function(){
    	return this.yesDict.dictTree;
    },
    
    /** 判断值是否改变 */
    isChanged: function(value) {
    	this.value;
    	var changed = false;
    	if(!this.value && value) {
    		changed = true;
		} else if(this.value) {
			if(this.multiSelect) {
				//数组
				if(this.value.length != value.length) {
					changed = true;
				} else {
					for (var i = 0, len = value.length; i < len; i++) {
						var index = this.value.indexOf(value[i]);
						if(index < 0) {
							changed = true;
							break;
						}
					}
				}
			} else {
				changed = !(this.value.oid == value.oid);
			}
		}
    	return changed;
    },

    onRender: function (ct) {
        this.base(ct);
    	var $this = this;
        var formID = $this.ofFormID;
        var form = YIUI.FormStack.getForm(formID);
    	this.yesDict = new YIUI.Yes_Dict({
    		id: $this.id,
    		el: $this.el,
    		secondaryType: $this.secondaryType,
    		dataSource: $this.dataSource,
    		independent: $this.getMetaObj().independent,
    		multiSelect: $this.getMetaObj().multiSelect,
    		getItemKey: function() {
    			return $this.itemKey;
    		},
    	    hiding : function (){
    	    	var value = this.getSelValue();
    	    	var changed = $this.isChanged(value);
    	    	if(changed) {
    	    		$this.setValue(value, true, true, false, true);
    	    	}
    	    },
    	    getDictChildren: function(node) {
    	    	
    	    	var success = function(nodes) {
					if (nodes) {
						var nodeId = node.attr('id');
						var syncNodes = $this.getDictTree().formatAsyncData(nodes);
						var isHaveNext = nodes.totalRowCount;
						nodes = $this.secondaryType == 5 ? nodes.data :nodes;
						for(var i=0, len=nodes.length; i<len; i++) {
						    
						    if($this.type == YIUI.CONTROLTYPE.COMPDICT || $this.secondaryType == 5) {
								var path = nodeId + "_" + nodes[i].OID;
								nodes[i].id = path;
						    }
						}
						syncNodes = $this.secondaryType == 5 ? nodes :syncNodes;
						$this.getDictTree().buildTreenode(syncNodes , nodeId, parseInt(node.attr("level"))+1, $this.secondaryType, isHaveNext);
						$this.secondaryType == 5 ? node.attr('isLoaded',false) : node.attr('isLoaded',true);
						
					}
				}
    	    	if ($this.secondaryType != 5) {
        	    	YIUI.DictService.getDictChildren($this.itemKey, $this.getDictTree().getNodeValue(node), $this.getDictTree().dictFilter, $this.stateMask ,success);
    	    	} else {
        	    	YIUI.DictService.getQueryData($this.itemKey, $this.yesDict.dictTree.startRow, pageMaxNum, $this.yesDict.dictTree.pageIndicatorCount, $this.yesDict.dictTree.fuzzyValue,  $this.stateMask ,$this.getDictTree().dictFilter, $this.getDictTree().getNodeValue(node), success);
    	    	}
    	    },
    		checkDict: function() {
    	    	$this.checkDict($this);
    	    	this.setSelValue($this.value);
    		},
    		doLostFocus: function(text, show) {
    			if($this.autoSel) {
    				$this.$dictView.hide();
    				$this.isDictView = false;
    				return;
    			}
    			if(!$this.multiSelect && (!$.isEmptyObject(text) || show)){
    				if(($this.hasSuggest && !$this.isSuggest) || $this.hasSuggest == false) {
    					$this.$dictView.hide();
    				}
    				$this.handler.autoComplete($this, text);
    			} else {
					$this.setValue(null, true, true, false, true);
					$this.setText('');
    			}
    		},
    		valueChange: function(text) {
    			$this.handler.doLostFocus($this, text);
			},
    		beforeExpand: function(tree , treeNode) {
				//var data = {};
				//data.itemKey = $this.itemKey;
				//data.itemDatas = $.toJSON($this.getValue());
				//data.service = "dictService";
				//data.cmd = "getallparentid";
				var success = function(result) {
					if (result) {
						$.each(result,function(i){
							var nodeId = this.itemKey+'_'+this.oid;
				 			tree.indeterminatedNodes[nodeId] = this;
				 		});
					}
				};

				//Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
				
				
				YIUI.DictService.getAllParentID($this.itemKey , $this.getValue() , success );
				
    		}
    	});
        this.el.addClass("ui-dict");
        //this.setMultiSelect(this.multiSelect);
//        this.setEnable(this.enable);
//        this.setEditable(this.editable);
        
        if(this.value) {
        	if(this.getMetaObj().multiSelect) {
        		var vals = [];
        		for (var i = 0, len = this.value.length; i < len; i++) {
					var val = this.value[i];
	        		var value = new YIUI.ItemData(val);
	        		vals.push(value);
				}
        		this.value = vals;
        	} else {
        		var opts = this.value;
        		opts.caption = this.text;
        		var value = new YIUI.ItemData(opts);
        		this.value = value;
        	}
        }
        this.setValue(this.value);
        this.setMultiSelect(this.getMetaObj().multiSelect);
        this.setDynamic(this.getMetaObj().isDynamic);
        this.setStateMask(this.getMetaObj().stateMask);
        this.setText(this.text);
        
      //  this.dictTree = this.yesDict.dictTree;
        
      //  if(this.root){
      //  	dictTree.createRootNode(this.root.itemKey,this.root.itemKey+'_'+this.root.soid,this.caption);
      //  }else{
       // 	dictTree.createRootNode(this.itemKey,this.itemKey+'_'+0,this.caption);
      //  }
      
	
    },
    
    setStateMask: function(stateMask) {
    	this.stateMask = stateMask;
    },
    
    setDynamic: function(isDynamic) {
    	this.isDynamic = isDynamic;
    },

    focus: function () {
        $("input", this.el).focus();
    },
    
    install: function() {
    	this.base();
    	var self = this;
    	
//    	$("input", self.el).bind("keyup", $.debounce(100, function(e){
//			if(self.multiselect) return;
//			var keyCode = e.keyCode;
//			if(keyCode == 13) {
//				$(this).blur();
//				return;
//			}
//        	var value = $(this).val();
//        	self.handler.doSuggest(self, value);
//            $(document).on("mousedown", function (e) {
//                var target = $(e.target);
//                if (target.closest(self.yesDict.$suggestView).length == 0) {
//                	self.isSuggest = false;
//    		    	$(document).off("mousedown");
//            		self.yesDict.$suggestView.hide();
//                } else {
//                	self.isSuggest = true;
//                }
//            });
//        
//    	}));
    	
    	var index = -1;
    	var hideDictView = function() {
    		self.$dictView && self.$dictView.hide();
			self.selLi = null;
			$(".selected", self.$dictView).removeClass("selected");
			self.setText(self.text);
	    	index = -1;
    	};
    	
    	$("input", self.el).bind("keyup", function(e){
    		if(self.multiselect) return;
    		var keyCode = e.keyCode;
    		if(keyCode == 13) {
    			if(self.selLi) {
    				$(".b-txt", self.selLi).click();
    			} else {
    				$(this).blur();
    			}
    			return;
    		}
    		var value = $(this).val();
//    		self.handler.doSuggest(self, value);
    		$(document).on("mousedown", function (e) {
    			var target = $(e.target);
    			if (target.closest(self.yesDict.$suggestView).length == 0) {
    				if(self.selLi && self.selLi.length > 0) {
                    	self.selLi.click();
                    }
    				self.isSuggest = false;
    				$(document).off("mousedown");
    				self.yesDict.$suggestView.hide();
    			} else {
    				self.isSuggest = true;
    			}
    			self.selLi = null;
            	index = -1;
    		});
    		
        	if(keyCode == 38 || keyCode == 40 || keyCode == 9) return;
        	if(keyCode == 13 && self.selLi) {
		    	index = -1;
        		self.selLi.click();
        		return;
        	}
        	self.yesDict._dropView.hide();
        	self.handler.doSuggest(self, value);
//        	index = -1;
    	});

    	$("input", self.el).bind("keydown", function(e){
    		var keyCode = e.keyCode;
            var $suggestView = self.yesDict.$suggestView, $dictView, isAutoView = false;
            
            if(!$suggestView.is(":hidden") || (self.yesDict._dropView.is(":hidden") && (keyCode != 40))) {
            	$dictView = $suggestView;
            	isAutoView = true;
            } else {
            	$dictView = self.yesDict._dropView;
            }
            self.$dictView = $dictView;
            var maxLen = $("li[level != '-1']", $dictView).length;
            //keyCode == 38 ---> UP Arrow  keyCode == 40 ---> DW Arrow
            if(keyCode == 38) {
            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
            		return;
            	}
            	index--;
            	if(index == -1) index = maxLen - 1;
            } else if(keyCode == 40) {
            	if(!isAutoView && self.yesDict._dropView.is(":hidden")) {
            		self.isDictView = true;
            		self.yesDict._dropBtn.click();
            		var $li_s = $("li .dt-wholerow.sel", self.yesDict._dropView);
            		$li_s.removeClass("sel");
            		var $li = $li_s.parents("li").eq(0);
            		index = $li.index();
            	}
            	index++;
            	if(index == maxLen) index = 0;
            }else if(keyCode == 9 || keyCode === 13 || keyCode === 108) {
                self.focusManager.requestNextFocus(self);
                if (keyCode == 9 && !self.yesDict._dropView.is(":hidden")) {
                    $(document).mousedown();
                }
                e.preventDefault();
            } else {
                return;
            }
            if (index == -1) return;
            if(self.selLi) {
            	self.selLi.removeClass("selected").removeClass("sel");
            	$(".dt-wholerow", self.selLi).removeClass("sel");
            }
            var li = $dictView.find("li[level != '-1']:eq("+index+")");
            li.addClass("selected");
            self.selLi = li;
            self.autoSel = true;
            $(".dt-wholerow", li).eq(0).addClass("sel");
            var scrollHeight = self.yesDict._dropView.outerHeight() - self.yesDict._dropView[0].clientHeight;
            var scrollTop = li.position().top - self.yesDict._dropView.height() + li.height() + scrollHeight;
            self.yesDict._dropView.scrollTop(scrollTop < 0 ? 0 : scrollTop);
            
            if(!isAutoView) {
            	self.yesDict._textBtn.val($(".b-txt", li).eq(0).text());
            }
        	
    	});
    	
    	$("input", self.el).bind("blur", function(e){
    		index = -1;
    	});
    },
    
//    getCheckedValue: function(){
//    	var values = [];
//		var dictTree = this.dictTree;
//	  	$.each(this.dictTree.selectionNodes,function(i,val){
//	  		var $node = $('#'+val , dictTree.el);
//	  		var itemData = {};
//	    	itemData.soid = $node.attr('soid');
//	   		itemData.itemKey = $node.attr('itemKey'); 
//	  		values.push(itemData);
//	 	});
//		
//		return values;
//    }
//    ,
//    createRootNode: function(caption, itemKey) {
//    	var rootNode = new Object();
//        rootNode.id = "0";
//        rootNode.name = caption;
//        rootNode.isParent = true;
//        rootNode.open = true;
//        rootNode.isLoaded = true;
//        rootNode.itemKey = itemKey;
//        return rootNode;
//    },
    
//    transDictValue : function($treeNode){
//      var itemData = {};
//      itemData.soid = $treeNode.attr("soid") || 0;
//      itemData.itemKey = $treeNode.attr("itemKey") || this.itemKey;  
//      return $.toJSON(itemData);
//    },
   
    setText: function (text) {
    	this.text = text;
        this.yesDict.setText(text);
    } , 
    
    getText: function () {
        return this.yesDict.getText();
    },

    getShowText: function() {
    	return this.getText();
    },

	dependedValueChange: function(dependedField){
		if(this.getMetaObj().isDynamic){
			if(this.refKey && this.refKey == dependedField){
				this.needRebuild = true;
			}
		}
		
		if(!this.needRebuild){
			if(this.root && this.root.length > 0){
				if(this.root == dependedField){
					this.needRebuild = true;
				}	
			}
		}

		if(!this.needRebuild){
			var filter = this.getDictTree().dictFilter;
			if(filter){
				if(filter.dependency && filter.dependency.toLowerCase().indexOf(dependedField.toLowerCase()) >= 0 ){
					this.needRebuild = true;
				}
			}else{
                //这里的filter 是配额对象的filter不是 字典的filter 仅用于判断 当前的filter 是否值变化
                var formID =this.ofFormID;

                var form = YIUI.FormStack.getForm(formID);
                filter = this.handler.getFilter(form, this.key, this.itemFilters, this.itemKey);
                if(filter){
                    this.needRebuild = true;
                }
            }
		}
		
		if(this.needRebuild){
			this.setText("");
			this.setValue(null, true, true, false, true);
		}
	},
    
    setSecondaryType: function (type) {
        this.yesDict.setSecondaryType(type);
    } , 
    
    checkDict: function() {
    	this.handler.setContext(null);
    	this.handler.checkDict(this);
    	/*
 
    	var dict = this;
    	
    	
		var data = {};
		data.formID = dict.ofFormID;
		data.key = dict.key;
		data.service = "dictTreeService";
		data.cmd = "checkdict";

		
		var success = function(result) {

			if (result) {
				var needRebuild = result.needRebuild;
				
				if(needRebuild){
					var newRoot = result.root;
					
					if(dict.dictTree.rootNode != null){
						dict.dictTree.rootNode.remove();
					}
					
					dict.dictTree.createRootNode(newRoot,newRoot.itemKey+'_'+newRoot.oid);
					dict.secondaryType = result.secondaryType;
					dict.itemKey = result.itemKey;
				}
			}
		};

		Svr.Request.getSyncData(Svr.SvrMgr.UIProxyURL, data, success);
  		 */
    }
});
YIUI.reg('dict', YIUI.Control.Dict);
YIUI.reg('compdict', YIUI.Control.Dict);
YIUI.reg('dynamicdict', YIUI.Control.Dict);
//字典分页单页显示数量的全局变量
var pageMaxNum = 10;
(function () {
    YIUI.ItemData = function (options) {
    	this.oid = options.oid || 0;
    	this.itemKey = options.itemKey || "";
    	this.caption = options.caption || "";
    };
    Lang.impl(YIUI.ItemData, {
		getOID: function(){
			return this.oid;
		},
		getItemKey: function(){
			return this.itemKey;
		},
		getCaption: function() {
			return this.caption;
		},
		equals: function(o){
			if(o == null){
				return false;
			}
			return this.toString() == o.toString();
		},
		toString: function(){
			return this.itemKey + "_" + this.oid;
		},
		toJSON: function() {
			var jsonObj = {
				oid: this.oid,
				itemKey: this.itemKey,
				caption: this.caption
			};
			return jsonObj;
		},
		fromJSON: function(jsonObj) {
			if(jsonObj.oid) {
				this.oid = jsonObj.oid;
			}
			if(jsonObj.itemKey) {
				this.itemKey = jsonObj.itemKey;
			}
			if(jsonObj.caption) {
				this.caption = jsonObj.caption;
			}
		}
    });
})();/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-20
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */
YIUI.DictTree = YIUI.extend(YIUI.Control, {

	/** HTML默认创建为label */
	autoEl: '<div></div>',
	
    /** 父子节点是否关联 */
    independent: true,
    /** 是否可勾选 */
    showCheckBox: false,
    
    /** 选中的节点 */
    checkedNodes : {},
    
    /** 半选状态的节点*/
    indeterminatedNodes : null ,
    
    /** 记录父子关系的集合*/
    _pMap : {},
    
    /** 访问后台的url*/
    url : null,
    
    /** 参数*/
    params : {},
    
    /** 根节点 */
    rootNode : null,
    
    init: function(options) {
    	this.base(options);
    	var self = this;

    	self.results = [];

    	self.callback = $.extend({
			beforeExpand: $.noop,
			onSelected: $.noop,
			onChecked: $.noop
    	}, options.callback);
    	self.clickEvent = {

		};
		
		this.rootNode = null;
	 	this.indeterminatedNodes = null;
    },
    
    /** 构建树结构 */
    buildTreenode: function(nodes, pNodeKey, level) {
    	if(!nodes) {
    		return;
    	}
    	if(!nodes.length) {
    		nodes = $(nodes);
    	}
    	
    	this.addNodes(nodes, pNodeKey, level);
    
    },
    
    /**
     * 根据父节点 添加子节点
     * @param {} nodes
     * @param {} pNodeKey
     */
    addNodes: function(nodes, pNodeKey, level) {
    	
    	var $pNode = $('#' + pNodeKey, this.el);
    				
    	// 无子节点的时候 去掉节点前的+号
    	if(nodes.length <= 0) {
    		$pNode.children('span:first').removeClass('tree-collapse');
    		return;
    	}
    	
		var node, nid ,oid, itemKey;
		
		this._pMap[pNodeKey] || (this._pMap[pNodeKey] = []);
	
		for (var i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];
			nid = node.id;
			oid = node.oid;
			itemKey = node.itemKey;

			this._pMap[pNodeKey].push(nid);
			
			var _li = $("<li id='"+ nid + "' class='dictTree tree-node' oid = '"+oid+"'parentid='"+pNodeKey+"' itemKey='"+itemKey+"'></li>");
			_li.attr("level", level).css("padding-left", 15);
			var _pul = $pNode.children("ul");
			
			if(_pul.length == 0){
				_pul = $("<ul class='tree-ul'></ul>").appendTo($pNode);
			}
			
			
			_li.appendTo(_pul);

			var _a = $("<a class='tree-anchor'></a>");

	        var _ul, _span, _chk;
	        
	        if(node.isParent) {
	        	// 汇总节点
	            if(node.open) {
	            	_li.addClass('selected');
	            	_span = $("<span class='dictTree-icon tree-expand'/>").appendTo(_li);           	  
	            	_explore = $("<span class='tree-explore tree-explore-expand'/>").appendTo(_a);
	            }
	            else {
	            	_span = $("<span class='dictTree-icon tree-collapse'/>").appendTo(_li);
	            	_explore = $("<span class='tree-explore tree-explore-collapse'/>").appendTo(_a);
	            }
	            
	        } else {
	        	//明细节点
	        	_span = $("<span class='dictTree-icon'/>").appendTo(_li);
	        	_explore = $("<span class='tree-explore'/>").appendTo(_a);
	        }
	        switch(node.stateMask) {
		        case YIUI.DictStateMask.Enable: 
		        	_span.addClass("enable");
		        	break;
		        case YIUI.DictStateMask.Disable: 
		        	_span.addClass("disable");
		        	break;
		        case YIUI.DictStateMask.Discard: 
		        	_span.addClass("discard");
		        	break;
	        }
	        //复选框
        	if(this.showCheckBox){
           		_chk = $("<span class='tree-checkbox' />");
		        _span.after(_chk);
        	}
			_a.appendTo(_li);
	        
	       
	        var _selectNode = $("<span class='treenode-name'>" + node.name + "</span>").appendTo(_a);
	        
     		$pNode.attr('isLoaded', true);
		}
		
		
		//如果是多选 ，设置复选框的状态
	    if(this.showCheckBox) {
			for (var i = 0, len = nodes.length; i < len; i++) {
				node = nodes[i];
				nid = node.id;
	
	        	var chkstate = 0;
	        	
	        	if(nid in this.checkedNodes){
	        		chkstate = 1;
	        	}else if(!this.independent &&  nid in this.indeterminatedNodes){
	        		chkstate = 2;
	        	}
	        	
	        	//子节点打勾的情况下 ，如果父节点没有打勾 且是父子联动 则 父节点半勾
//	        	if(chkstate > 0 && ! this.independent && $pNode){
//	        		var pstate = $pNode.children('.tree-checkbox').attr('checkstate') || 0;
//	        		if(pstate == 0){
//	        			$pNode.children('.tree-checkbox').attr('checkstate', 2).addClass("checkstate"+2);
//	        		}
//	        	}
//	        	
	        	//子节点没打勾的情况下， 如果父节点打勾且是父子联动则子节点打勾
	        	if(chkstate == 0 && !this.independent && $pNode){
	        		var pChkstate =  $pNode.children('.tree-checkbox').attr('checkstate') || 0 ;
	        		if(pChkstate == 1){
	        			chkstate =1;
	        		}
	        	}
	        	
	        	var $node = $('#'+nid,this.el);
	        	
	        	$node.children('.tree-checkbox').attr('checkstate', chkstate).addClass("checkstate"+chkstate);
	        }
		}
    },
   
    /**
     * 当字典树为父子节点联动时， 需要维护节点勾选状态
     * @param {} $node
     * @param {} checkstate
     */
    checkTreeNode: function($node, checkstate){
    	var child, _index, _img, self
		
    	var tree = this;
    	
    	//递归处理子节点
    	function checkChildNode($pNode, checkstate){
    		var cbNode = $pNode.children('.tree-checkbox');
    		cbNode.removeClass("checkstate"+cbNode.attr('checkstate'));
    		cbNode.attr('checkstate', checkstate).addClass("checkstate"+checkstate);
    		
    		//处理子节点时， 是有在选中和未选中时需要做处理
    		if(checkstate != 2){
	    		var pNodeKey = $pNode.attr('id');
	    		
	    		tree._pMap[pNodeKey] || (tree._pMap[pNodeKey] = []);
	    		
	    		for (var i = 0; i < tree._pMap[pNodeKey].length; i++) {
	                var cId = tree._pMap[pNodeKey][i];
					var $child = $('#'+cId, tree.el);
					checkChildNode($child, checkstate);
	            }
    		}
    	}
    	
    	//递归处理父节点
    	function checkParentNode($cNode, checkstate){
    		var pId = $cNode.attr('parentid');
    		if(!pId) return;
    		var $pNode = $('#' + pId, tree.el);
    		var cbNode = $pNode.children('.tree-checkbox');
    		cbNode.removeClass("checkstate"+cbNode.attr('checkstate'));
    		
    		if(checkstate == 2){
    			cbNode.attr('checkstate', 2).addClass("checkstate"+2);
	            checkParentNode($pNode, 2);
    		}else{
	    		tree._pMap[pId] || (tree._pMap[pId] = []);
	    		var diffstate = false;
	    		//TODO 待测试 ， 用filter 可能存在性能问题 
	    		//$("a", tree.el).filter("[parentid = '" + pId + "']").find("span.tree-checkbox").filter("[checkstate != '"+checkstate+"']").length > 0
	    		for (var i = 0; i < tree._pMap[pId].length; i++) {
	                var cId = tree._pMap[pId][i];
					var $child = $('#'+cId, tree.el);
					var check = $child.children('.tree-checkbox').attr('checkstate') || 0;
					if(check != checkstate){
						diffstate = true;
						break;
					}
	            }
	            //有一个节点存在和父节点的勾选状态不一致， 父节点就为半勾状态
	            if(diffstate){
	            	checkstate = 2;
	            }
	            cbNode.attr('checkstate', checkstate).addClass("checkstate"+checkstate);
            	checkParentNode($pNode, checkstate);
    		}
    		
    		//记录在选中节点中
	      	if(checkstate == 1){
        		tree.checkedNodes[pId] = tree.getNodeValue($pNode);
        	}else{
        		delete tree.checkedNodes[pId];
        	}
	            	
		
    	}
    
    	
    	if(!this.independent) {
    		checkChildNode($node, checkstate);
            checkParentNode($node, checkstate);	
    	}else{
    		// 父子节点不联动， 则仅当前节点打勾
    		$node.children('.tree-checkbox').attr('checkstate', checkstate).addClass("checkstate"+checkstate);
    	}
    }, 

    /** 设置需要选中的节点 */
    setCheckedNodes : function (nodes){
    	if(this.showCheckBox){   
    		var tree = this;
    		
    		this.clearCheckedNodes();
	        this.checkedNodes = nodes;
	        this.indeterminatedNodes = null;
	        
			//for(var nId in nodes){
			//	var node = $('#'+nId, tree.el);
			//	if(node){
			//		tree.checkTreeNode(node,1);
			//	}
			//}
	        
	     	if(this.rootNode){
	       		var rootId = this.rootNode.attr('id');
		       	if(!jQuery.isEmptyObject(this.checkedNodes) && !this.independent){
		       		this.rootNode.children('.tree-checkbox').attr('checkstate',2).addClass("checkstate"+2);
		       	}else if(rootId in this.checkedNodes){
		       		this.rootNode.children('.tree-checkbox').attr('checkstate',1).addClass("checkstate"+1);
		       	}
	     	}

	    }
    },
    
    clearCheckedNodes : function(){
    	this.checkedNodes = {};
    	this.indeterminatedNodes = null;
    	$("[checkstate=1],[checkstate=2]").removeClass("checkstate1").removeClass("checkstate2").attr('checkstate', 0).addClass("checkstate0");
    },
    /**
     * 创建根节点
     * @param {} itemKey
     * @param {} nodeKey
     * @param {} name
     */
    createRootNode : function(node , nodeKey) {
    	
    	var _li = $("<li id='"+ nodeKey + "'class='dictTree tree-node' oid = '"+node.oid+"' itemKey='"+node.itemKey+"'></li>");
    	_li.attr("level", -1);
    	_li.appendTo(this.el);
    	var _a = $("<a class='tree-anchor'></a>");

    	
        _li.addClass('selected');
    	_a.addClass('curSelectedNode');

    	$("<span class='dictTree-icon tree-expand'/>").appendTo(_li);
    	
    	if(this.showCheckBox){
    		$("<span class='tree-checkbox' />").addClass("checkstate0").appendTo(_li);
    	}
    	
    	$("<span class='tree-explore tree-explore-expand'/>").appendTo(_a);
        
    	$("<span class='treenode-name'>" +node.name+ "</span>").appendTo(_a);
    	
    	_a.appendTo(_li);
    	
    	$("<ul class='tree-ul'></ul>").appendTo(_li);
    	
    	this.rootNode = $('#'+nodeKey,this.el);
    	
    	//如果是多选字典 判断根节点打勾状态
		if(this.showCheckBox){    
			if(!jQuery.isEmptyObject(this.checkedNodes) && !this.independent){
	       		this.rootNode.children('.tree-checkbox').attr('checkstate',2).addClass("checkstate"+2);
	       	}else if(nodeKey in this.checkedNodes){
	       		this.rootNode.children('.tree-checkbox').attr('checkstate',1).addClass("checkstate"+1);
	       	}
		}
    		
    },

    onRender: function (ct) {
    	this.base(ct);
    	this.el.addClass('dictTree dictTree-content');
    	var id = this.el.attr('id');
    	
        this.buildTreenode(this.dataSource, null, 0);
    },

    /**
     * 收拢节点
     * @param {} node
     */
    collapseNode: function(node) {
		node.children('ul').hide();
		var $arrow = node.children('span:first');
		$arrow.removeClass('tree-expand').addClass('tree-collapse');
		$arrow.next('.tree-explore').removeClass('tree-explore-expand').addClass('tree-explore-collapse');
		node.children('a').removeClass('curSelectedNode');
		node.removeClass('selected');
	},
    
	/**
	 * 展开节点
	 * @param {} node
	 */
	expandNode: function(node) {
		if(!node){
			node = this.rootNode;
		}
	
		var self = this;
		//未加载过的情况下 加载子节点
		if(!node.attr('isLoaded')) {
		
			this.callback.beforeExpand(this , node);
			
			/*var nodeId = node.attr('id');
			var success = function(msg) {
				if (msg) {
					var syncNodes = self.formatAsyncData(msg);
					self.buildTreenode(syncNodes , nodeId, parseInt(node.attr("level"))+1);
					node.attr('isLoaded',true);
				}
			}*/
			
			YIUI.Service.getDictChildren(this , node);
			//Svr.Request.getSyncData(self.url, self.params, success);

		}
	
		node.children('ul').show();
		
		// 维护汇总节点的+号
		var $arrow = node.children('span:first');
		if($arrow.hasClass('tree-collapse')){
			$arrow.removeClass('tree-collapse').addClass('tree-expand');
			$arrow.next('.tree-explore').removeClass('tree-explore-collapse').addClass('tree-explore-expand');
			node.children('a').addClass('curSelectedNode');
			node.addClass('selected');
			
		}
	},
	   
	/**
	 * 复选框勾选事件
	 * @param {} $node
	 */
	checkboxClick: function($node) {
		var state = $node.children('.tree-checkbox').attr('checkstate') == 0 ? 1 : 0;
		this.checkTreeNode($node, state);
		this.callback.onChecked(this,$node);
		
		var nodeKey = $node.attr('id');
		if(state == 1){
			this.checkedNodes[nodeKey] = this.getNodeValue($node);
		}else{
			delete this.checkedNodes[nodeKey];
		}	
	},
	
	selectNode: function(node) {
		if(this.selectedNodeId) {
			$('#' + this.selectedNodeId).removeClass('clicked');
		}
		this.selectedNodeId = node.attr('id');
		node.addClass('clicked');
		this.callback.onSelected(this, node);
	},
	
	getNodeValue: function($node){
	
	},
	
    install : function() {
    	var self = this;
    	if(!this.showCheckBox){
	    	self.el.bind('click', function(e) {
	    		var $target = $(e.target);
	    		var $node = $target.parents('li:first');
	    		
	    		if($target.hasClass('tree-collapse')) {
	    			
	    			self.expandNode($node);
	    			//self.clickEvent.expandNode(e, self, null);
	    			return;
	    		}
	    		if($target.hasClass('tree-expand')) {
	    			self.collapseNode($node);
	    			//self.clickEvent.collapse(e, self, null);
	    			return;
	    		}
	    		if($target.hasClass('tree-checkbox')) {
	    			self.checkboxClick($node);
	    			return;
	    		}
	    		if($target.hasClass('treenode-name')) {
	    			self.selectNode($node);
	    			return;
	    		}
	    	});
    	}
	},
	
	/**
	 * 获取选中节点的值
	 * @return {}
	 */
	getCheckedValues: function(){
		if(this.showCheckBox){
			//var nodes = this.el.find("[checkstate = '1']").parent();
			var dictTree = this;
			var values = [];
			
			$.each(dictTree.checkedNodes , function(key,val){
				
				var $node = $('#'+key , dictTree.el);
										
				if(!this.independent) {

					var pId = $node.attr('parentid');
					var $pNode = $('#'+pId , dictTree.el);
					
					if($pNode){
						var chkstate = $pNode.children('.tree-checkbox').attr('checkstate') || 0;
						if(chkstate == 1){
							
						}else{
							values.push(val);	
						}
					}else{
						values.push(val);	
					}
				}else{
					values.push(val);	
				}
			});
			
			return values;
		
	    }
	},
	
	/**
	 * 转换节点数据
	 * @param {} treeNodes
	 * @return {}
	 */
	formatAsyncData: function(treeNodes){
    	return treeNodes;
    },
	
    afterRender: function () {
        this.base();
    },
    
    /**
     * 移除根节点外的所有节点 
     */
    reset: function (){
    	if(this.rootNode){
    		this._pMap = {};
    		this.collapseNode(this.rootNode);
    		this.rootNode.children('.tree-ul').children().remove();
    		this.rootNode.removeAttr('isLoaded');
    		this.indeterminatedNodes = null;
    	}
    }
});
YIUI.reg('dicttree', YIUI.DictTree);
/**
 * TreeView。
 * 以table实现的树，可单列，可多列。
 */
(function() {
// 自动生成节点id
var nodeId = 0;
function getId() {
	return 'n-' + (++nodeId);
}

YIUI.Control.DictView = YIUI.extend(YIUI.Control, {
	/** HTML默认创建为label */
	autoEl: '<div></div>',
	
	selectId: null,
	
	/** 
	 * String。
	 * 加载数据的url，优先于data。
	 */
	dataUrl : null,
	
	/** 
	 * Array。
	 * 真实数据，如果指定了dataUrl，忽略data中定义的数据。
	 */
	data : null,
	
	_datas :{},
	
	/** 
	 * Object。
	 * 根节点。
	 */
	root : null,
	
	/**
	 * Array。 
	 * 列信息。
	 */
	colModel : null,
	
	/**
	 * Boolean。
	 * 是否支持列宽拖动。
	 */
	enableColumnResize : true,
	
	/**
	 * 未指定列宽时的默认宽度。
	 */
	defaultWidth : 100,
	
	_$table : null,
	/**
	 * 表格选中模式  0单元格选 1行选
	 */
	selectionModel : 1,
	
	pageSize: this.pageRowCount,
	
	pageIndicatorCount: 3,
	
	handler: YIUI.DictViewHandler,
    
	init : function(options) {
		this.base(options);
		this.dataUrl = '';
		var self = this;
		self.pageSize = self.pageRowCount;
		self.loadedNodes = {};
		this.option = {
			theme : 'default',
			expandLevel : 2,
			expandable: true,
			levelMinus: true,
			beforeExpand : function(node) {
				var id = $(node).attr('id');
				if(!self.loadedNodes[id]) {
					
					self.handler.doExpand(self, $(node));
					
					//var rows = treeview.loadChildren(id);
					//var html = treeview.createRowsHtml(rows);
					//$table.addChilds(html);
					self.loadedNodes[id] = true;
					
					if(!$(node).is(":hidden")) {
						$(node).click();
						if(!self._selectItem) return;
						var id = self._selectItem.itemKey + "_" + self._selectItem.oid;
						if(id == node.attr("id")) {
							self._selectItem.isExpandNode = true;
						}
					}
				}
			},
			onSelect : function($table, node) {
            	if(node){
					$('#' + self.selectId, $table).removeClass("sel-row");
	//				console.log('onSelect: ' + id);
					node.addClass('sel-row');
					var rowIndex =  node.index();
					var id = node.attr('id')
					if(id){
						if(self.hasClick){
							self.selectId = id;
							self.handler.doOnRowClick(self, node);
						}else if (self.hasRowChanged){
							if(self.selectId != id){
								self.selectId = id;
								self.handler.doOnFocusRowChange(self, node);
							}
						}
					}

            	}
			},
			doubleClick:self.hasDblClick ? function($table , node){
							self.handler.doOnDblClick(self, node);
						}:null
		};
		
		this.data = options.data.addedNodes;
		if(this.data == undefined){
			this.data = {};
		}

	},
	
	setEnable : function(enable) {
		this.base(enable);
		this._$table.setEnable(enable);
	},
    
	onSetHeight : function(height) {
    	this.el.css("height", height);
    	
    	var pagesH = $(".paginationjs-pages", this.el).is(":hidden") ? 0 : $(".paginationjs-pages", this.el).height();
    	var realHeight = height - pagesH - this.$fuzzybar.height();
    	this._pagination.content.css("height", realHeight);

//		this._$table.css("width", this._pagination.content[0].clientWidth);
//		this.syncHandleWidths();
    	
		$(".ui-resizer", this.el).css({
			"top": this.$fuzzybar.height(),
			"height": this._$table.height()
		});
	},
	
	onSetWidth: function(width) {
		this.el.css("width", width);
		this._$fuzzyText.css("width", width - this._$fuzzyBtn.outerWidth());
		
		var $ths = $("th", this.el), $th;
		this._pagination.content.css("width", width);
		// var spaceW = this._pagination.content[0].clientWidth;
		// for (var i = 0, len = $ths.length; i < len - 1; i++) {
		// 	$th = $ths[i];
		// 	spaceW -= parseInt($th.style.width) + 1;
		// }
		// var $spaceTh = $ths.last();
		// $spaceTh[0].style.width = spaceW > 0 ? (spaceW + "px") : "0px";
		
		this.el.hide();
		this._$table.css("width", this._pagination.content.width());
		this.el.show();
		
//		this.syncHandleWidths();
	},
	
	/** 
	 * 完成渲染。
	 */
	onRender: function (ct) {
		this.base(ct);
		this.el.addClass('ui-dv');
		if($.browser.isIE) {
			this.el.attr("onselectstart", "return false");
		}
		
		var $fuzzybar = this.$fuzzybar = $('<div id="'+this.id+'-fuzzy" class="fuzzy"/>');
        this._$fuzzyText =  $('<input id="'+this.id+'_textbtn" type="text" style="height: 30px;"/>').addClass('txt').appendTo($fuzzybar);
        this._$fuzzyBtn =  $('<button id="'+this.id+'_dropbtn" style="height: 30px; width: 30px;"></button>').appendTo($fuzzybar);
        
        if(!this.isHiddenFuzzyBar){
            $fuzzybar.appendTo(this.el);
        }
		//this._$fuzzyField = new  YIUI.Control.TextEditor();
		//this._$fuzzyField.appendTo(this.el);
        var self = this;
        self._pagination = self.el.pagination({
			pageSize: self.pageSize,
			//总记录数
	        totalNumber: self.totalRowCount,
	        showPages: true,
	        showPageDetail: false,
	        showFirstButton: false,
	        showLastButton: false,
	        pageIndicatorCount: this.pageIndicatorCount
		});

		this._$table = $('<table cellpadding="0" cellspacing="0" unselectable="on"></table>').appendTo(self._pagination.content);
		
		var tr = $('<tr ></tr>').appendTo(this._$table),
			colModel = this.colModel,
			col, i, len, width, $th;
		for (i=0,len=colModel.length;i<colModel.length;i++) {
			col = colModel[i];
			// width = col.width || this.defaultWidth;
			width = Math.round(100/len);
//			$('<col></col>').attr('width', width).prependTo(this._$table);
			
			$th = $('<th ><span class="title">' + col.caption + '</span></th>').css("width", width + "%").appendTo(tr);
			if(i < len - 1) {
				$("<span class='dv-handler'></span>").appendTo($("span", $th));
			}
		}
		tr.appendTo(this._$table);
		
		// $('<th width="50px" class="space"></th>').appendTo(tr);
		if(this.root) {
			var root = this.createRow(this.root);
			root.addClass("comp_Level1").attr("comp_Level", 1);
			self.loadedNodes[root.attr('id')] = true;
//			root.attr('islastone', true);
			root.addClass("root");
			this._$table.append(root);	
			root.hide();
		}
		
		this._$table = this._$table.treetable(this.option);
		
		
		//总行数大于data的长度
		if(this.totalRowCount <= this.pageSize) {
			this._pagination.hidePagination();
		}
		
//		if(this._totalRowCount <= this.pageRowCount) {
//			this._pagination.hidePagination();
//		}
		
		this.addNodes(this.data);
		//var html = this.createRowsHtml(this.data);
		
		//this._$table.addChilds(html);
	},
	
		
	install: function () {
		this.enableColumnResize && this.addColumnResize();
		
		var self = this;
		self._pagination.pageChanges = function(pageNum) {
			//self._$table.clearAll();
        	self.handler.doGoToPage(self, pageNum);
        }
//		this._$fuzzyText.blur(function(e){
//				var text = $(this).val();
//				if(text.length > 0 || (text.length == 0 && self.getValue() && self.getValue().length > 0)){
//					self.handler.doLostFocus(self.ofFormID, self.key ,  text);
//				}
//		});
		
		this._$fuzzyBtn.click(function(e){
			//self._$table.clearAll();
			var text = self._$fuzzyText.val();
			self.handler.doDictViewSearch(self, text);
			
		});
		
		var _this = this;
		$(".dv-handler", this.el).bind('mousedown', function (e) {
			if(!_this.enable) return false;
			var resizer = $(".ui-resizer", _this.el);
			var resizerLeft = $(this).position().left+$(this).width();
			resizer.css("left", resizerLeft);
			resizer.addClass("clicked");
			var $leftColumn, leftColOldW, tableWidth ;
			e.preventDefault();
			var startPosition = e.clientX;
			$leftColumn = $(this).parents("th");
			leftColOldW = $leftColumn.width();
			// var $spaceColumn = $("th.space", _this._$table);
			// var spaceColW = $spaceColumn.width(), spaceW;
			
			var difference , leftColW, tblWidth;
			$(document).on('mousemove.rc', function (e) {
				difference = e.clientX - startPosition;
    			resizer.css("left", resizerLeft + difference);
			});
			return $(document).one('mouseup', function () {
				$(document).off('mousemove.rc');
				_this.el.hide();
				leftColW = leftColOldW + difference;
				// spaceW = spaceColW - difference;
				$leftColumn.width(leftColW);
				$leftColumn.next().css("width", "100%");
				// $spaceColumn.width(0);
				// if(_this._$table.width() < _this.el.width()) {
				// 	$spaceColumn.width(_this.el.width() - _this._$table.outerWidth());
				// } else {
				// 	$spaceColumn.width(0);
				// }
//				_this._$table.width(tblWidth);
                resizer.removeClass("clicked");
                _this.el.show();
			});
		});
	},
	
	// private
	createRow : function(rowdata) {
		//this._datas[rowdata.id] = rowdata;
		
		delete this.loadedNodes[rowdata.id];
		
		//rowdata.id = rowdata.id || getId();
		var tr = $('<tr id="'+rowdata.id+'"></tr>'),
			colModel = this.colModel;
		
		if(rowdata.OID != undefined ){
			tr.attr('oid', rowdata.OID);
		}
		
		if(rowdata.pid != undefined ){
			tr.attr('pid', rowdata.pid);
		}
		
		if(rowdata.itemKey != undefined ){
			tr.attr('itemKey', rowdata.itemKey);
		}
		
		if(this.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
			var path = rowdata.path;
			if(!path) {
				path = rowdata.id;
			}
			tr.attr("path", path);
			var $pNode = $("[id=" + rowdata.pid+"]", this.el);
			var comp_Level = parseInt($pNode.attr("comp_Level"));
			var pItemKey = $pNode.attr("itemKey");
			var itemKey = rowdata.itemKey;
			if(itemKey != pItemKey) {
				comp_Level += 1;
			} 
			tr.attr("comp_Level", comp_Level);
			var comp_css = "comp_Level" + comp_Level;
			tr.addClass(comp_css);
		}
			
		if(!this.isChainDict()){
			if(rowdata.NodeType == 1){
				tr.attr('haschild', true);
			}
		}
		
		if(rowdata.previd != undefined){
			tr.attr('previd', rowdata.previd);
		}
		
//		if(rowdata.isfirst != undefined && rowdata.isfirst){
//			tr.attr('isfirstone', true);
//		}
		
//		if(rowdata.islast != undefined && rowdata.islast){
//			tr.attr('islastone', true);
//		}
		
		if(rowdata.Enable != undefined){
			tr.attr('enable', rowdata.Enable);
			switch(rowdata.Enable) {
				case -1:
					tr.addClass("invalid");
					break;
				case 0: 
					tr.addClass("disabled");
					break;
				case 1:
//					tr.addClass("invalid");
					break;
			}
		}
		
		var value;
		if(this.dictType == YIUI.SECONDARYTYPE.COMPDICT) {
			value = rowdata["Code"] + " " + rowdata["Name"];
			$('<td>' + value + '</td>').appendTo(tr);
		} else {
			for (var j=0,len=colModel.length;j<len;j++) {
				value = rowdata[colModel[j].key];
				if(!value){
					value = '';
				}
				$('<td>' + value + '</td>').appendTo(tr);
			}
		}
		
//		$('<td></td>').appendTo(tr);
		return tr;
	},
	
	// private
	createRowsHtml : function(rows) {
		var html = '';
		for(var i=0,len=rows.length;i<len;i++) {
			html += this.createRow(rows[i])[0].outerHTML;
		}
		return html;
	},
	
	/**
	 * 根据dataUrl加载所有下层子节点。
	 * @param pid 父节点id。
	 * @return Array。所有子节点的数组。
	 */
	/*
	loadChildren : function(pid) {
		var children;
		$.ajax({
			url : SvrMgr.ServletURL,
			
			//{Service: SvrMgr.Service.DealWithEvent, FormID: formID,
            //    EventType: eventType, ControlKey: controlKey, ExtParas: extParas});
                
			data : {
				Service : SvrMgr.Service.DealWithEvent,
				FormID : this.ofFormID,
				EventType :  SvrMgr.EventType.Expand,
				ControlKey : this.key,
				ExtParas :  pid || 0
			},
			
			method : 'get',
			dataType : 'json',
			async : false,
			success : function(result) {
				children = result.data;
			}
		});
		
		$.each(children, function() {
			this.pid = this.pid || pid;
		});
		return children;
	},*/
	
	initDefaultValue: function(options) {
    	this.base(options);
    	this._$table = $("table", this.el);
    },

    setTotalRowCount: function(totalRowCount){
    	this.totalRowCount = totalRowCount == undefined ? this.totalRowCount : totalRowCount;
		this._pagination.setTotalRowCount(this.totalRowCount, this.isResetPageNum);
		this.isResetPageNum = false;
    },
	
	// 处理差异
	diff: function(diffJson){
		var treeView = this;
//		treeView.calpages(diffJson);

//		if(diffJson.totalRowCount && diffJson.totalRowCount <= treeView.pageRowCount || treeView._totalRowCount <= treeView.pageRowCount) {
//			treeView._pagination.hidePagination();
//		} 
		treeView.setTotalRowCount(diffJson.totalRowCount);
		
//		treeView._pagination.setTotalRowCount(treeView._totalRowCount, treeView.isResetPageNum);
//		treeView.isResetPageNum = false;
		
		
		this.base(diffJson,function(name,value){
			
			if(name == 'data'){
								
				if(value.deletedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.deleteNodes(value.deletedNodes);
					for (var i = 0, len = value.deletedNodes.length; i < len; i++) {
						this.loadedNodes[value.deletedNodes[i]] = false;
					}
				}
			
				
				if(value.addedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.addNodes(value.addedNodes);
				}
				
				if(value.updatedNodes){
					
					for (var i = 0, len = value.updatedNodes.length; i < len; i++) {
						this.refreshNode(value.updatedNodes[i]);
					}
	
				}
				
				
			}
			
		});
					
		if(diffJson.focusedNode){
			var $tr = $('#' + diffJson.focusedNode, this._$table);
			if($tr){		
				if(this.selectId){
					$('#' + this.selectId, this._$table).removeClass("sel-row");
				}
		
				$tr.addClass('sel-row');	
				this.selectId = diffJson.focusedNode;
			}
		}

	},
	focusNode: function(id){
		var $tr = $('#' + id, this._$table);
		if($tr){		
			if(this.selectId){
				$('#' + this.selectId, this._$table).removeClass("sel-row");
			}
	
			$tr.addClass('sel-row');
			if(!$tr.hasClass("selected")) {
				$tr.addClass('selected');
			}
			this.selectId = id;
			
//			if(isNew) return;
			if(this.hasClick){
				this.handler.doOnRowClick(this, $tr);
			}else if (this.hasRowChanged){
				this.handler.doOnFocusRowChange(this, $tr);
			}
		}
		
	},
	
	// 删除节点
	deleteNodes: function(ids){
		if(ids == undefined){
			return;
		}
		this._$table.removeNodes(ids);
	},
	
	// 添加节点
	addNodes: function(nodes){
		if(nodes == undefined){
			return;
		}
		
		var html = this.createRowsHtml(nodes);

		this._$table.addChilds(html);
		
		//this.loadedNodes[id] = true;
	},

    syncHandleWidths: function(){
		var _this = this;
		var $handleContainer = $(".resizer-ctnr", this.el);
        $handleContainer.width(_this._$table.width());
        $handleContainer.find('.resizer').each(function (_, el) {

            return $(el).css({
                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - $handleContainer.offset().left),
                height: _this._$table.height()

            });

        });
	},
	// private 添加列宽拖动支持
	addColumnResize : function() {

		var colModel = this.colModel,
			row = this.el.find('tr:first-child'),
			cells = row.children(),
			left = 0;
			
		var $handleContainer = $('<div class="resizer-ctnr">');
		
//		this._$table.before($handleContainer);
		
		var _this = this;
		var $resizer = $("<div class='ui-resizer' />");
		this._$table.before($resizer);
						
//		if(this._$table.find('tr th:not(.space)').length > 1) {
//			this._$table.find('tr th:not(.space)').each(function (i, el) {
//				var $resizer;
				
//				$resizer = $("<div class='resizer' />");
//				$resizer.data('th', $(el));
//				$resizer.bind('mousedown', function (e) {
//					if(!_this.enable) return false;
//					var $currentGrip , $leftColumn  , leftColOldW , tableWidth ;
//					e.preventDefault();
//					var startPosition = e.clientX;
//					$currentGrip = $(e.currentTarget);
//					$leftColumn = $currentGrip.data('th');
//					leftColOldW = $leftColumn.width();
//					var $spaceColumn = $("th.space", _this._$table);
//					var spaceColW = $spaceColumn.width(), spaceW;
//					
//	                var target = $(e.target);
//	                target.addClass("clicked");
//	                target.data("startPos", target.position().left);
//					var difference , leftColW, tblWidth;
//					$(document).on('mousemove.rc', function (e) {
//						difference = e.clientX - startPosition;
//						leftColW = leftColOldW + difference;
//						spaceW = spaceColW - difference;
//						tblWidth = _this._$table.width() + difference;
//	                    target.css('left', target.data("startPos") + difference);
//					});
//					return $(document).one('mouseup', function () {
//						$(document).off('mousemove.rc');
//						_this.el.hide();
//						leftColW = leftColOldW + difference;
//						spaceW = spaceColW - difference;
//						tblWidth = _this._$table.width() + difference;
//						$leftColumn.width(leftColW);
////						$spaceColumn.width(spaceW);
////						_this._$table.width(tblWidth);
//	                    target.removeClass("clicked");
//	                    _this.el.show();
////						return 	_this.syncHandleWidths();	
//					});
//					
//				});
//				return $resizer.appendTo($handleContainer);
//			});
//		}
        
		/*	
		for(var i=0,len=colModel.length;i<len;i++) {
			var resizer = $('<div class="resizer"></div>').attr('index', i).appendTo(this.el);
			
			left += cells[i].clientWidth;
			resizer.css('left', left + 'px');
		}
		
		var treeview = this,
			startPos, endPos, startWidth, index, cell, startLeft;
			
			
		function mousedownFn(event) {
			var target = $(event.target);
			if(target.hasClass('resizer')) {
				event.preventDefault();
				startPos = event.pageX;
				index = target.attr('index');
				cell = $(cells[index]);
				startWidth = cell.width();
				startLeft = parseInt(target.css('left'));
				$(document).on('mousemove', mouseoverFn).one('mouseup', mouseupFn);
			}
		}
		function mouseoverFn(event) {
			var endPos = event.pageX;
			cell.width(startWidth + endPos - startPos);
		}
		function mouseupFn(event) {
			var target = $(event.target),
				endPos = event.pageX,
				resizers = treeview.el.find('.resizer'),
				resizer;
			for(var i=index,len=resizers.length;i<len;i++) {
				resizer = $(resizers[i]);
				resizer.css('left', (parseInt(resizer.css('left')) + endPos - startPos) + 'px');
			}
			
			$(document).off('mousemove', mouseoverFn);
		}
		
		function syncHandleWidths(){
			var _this = this;

	        this.$handleContainer.width(this.$table.width());
	        this.$handleContainer.find('.rc-handle').each(function (_, el) {
	
	            return $(el).css({
	                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - _this.$handleContainer.offset().left),
	                height: _this.$table.height()
	
	            });
	
	        });
		}
		
		this.el.on('mousedown', mousedownFn);*/
	},
	
	find: function(id){
		var $tr = $('#' + id, this._$table);
		return $tr.length > 0;
	},
	
	getNode: function(id){
		var $tr = $('#' + id, this._$table);
		return $tr;
	},
	
	expandNode: function(id , reload){
		var $tr = $('#' + id, this._$table);
		
		if(reload){
			this._$table.removeChildren(id);
			delete this.loadedNodes[id];
		}
		this._$table.expand($tr);
	},

	getSelectedValue: function(colKey){
		var value = null;
		if(this._selectItem){
			colKey = colKey.charAt(0).toLowerCase() + colKey.slice(1);
			if(colKey == "nodeType"){
				value = this._selectItem.isExpandNode ? 1 : 0;
			} else if(colKey.toLowerCase() == "oid"){
				value = this._selectItem["oid"];
			} else {
				value = this._selectItem[colKey];
			}
		}
		return value;

	},
	
	getNodeValue: function($node) {
		if($node.length > 0){
			var id = $node.attr('id');
		
       		var index = id.lastIndexOf('_');
       		
//			var itemKey = id.substring(0,index);
//			var oid = id.substring(index+1);
			var itemKey = $node.attr("itemkey");
			var oid = $node.attr("oid");
			
			
		  	var itemData = {};
	    	itemData.oid = oid || 0;
	   		itemData.itemKey = itemKey || this.itemKey; 
			return itemData;
		}
	},
	
	removeNode: function(id){
		this._$table.removeNode(id , true);
		delete this.loadedNodes[id];
		
	},
	
	isChainDict: function(){
		return !this.isHiddenFuzzyBar;
	},
	
		// 添加节点
	addNodeByItem: function($pNode, item){
		if(item == undefined){
			return;
		}
		
		var html = this.createRowByItem($pNode, item);

		this._$table.addChilds(html);
		
		//$("#"+this.selectId).addClass("sel-row");
		
		//this.loadedNodes[id] = true;
	},
	
		// private
	createRowByItem : function($pNode, item) {
		//this._datas[rowdata.id] = rowdata;
		
		var id = item.itemKey +'_'+item.oid;
		
		delete this.loadedNodes[id];
		
		//rowdata.id = rowdata.id || getId();
		var tr = $('<tr id="'+id+'"></tr>');
		
		if($pNode){
			tr.attr('pid', $pNode.attr('id'));
		}else{
			tr.attr('pid', this.root.id);
		}
		if(!this.isChainDict()){
			if(item.nodeType == 1){
				tr.attr('haschild', true);
			}
		}

		if(item.oid != undefined ){
			tr.attr('oid', item.oid);
		}
		
		if(item.itemKey != undefined ){
			tr.attr('itemKey', item.itemKey);
		}
//		if(rowdata.previd != undefined){
//			tr.attr('previd', rowdata.previd);
//		}
		
//		if(rowdata.isfirst != undefined && rowdata.isfirst){
//			tr.attr('isfirstone', true);
//		}
		
//		if(rowdata.islast != undefined && rowdata.islast){
//			tr.attr('islastone', true);
//		}
		
		if(item.enable != undefined){
			tr.attr('enable', item.enable);
			switch(item.enable) {
				case -1:
					tr.addClass("invalid");
					break;
				case 0: 
					tr.addClass("disabled");
					break;
				case 1:
//					tr.addClass("invalid");
					break;
			}
		}
		
		var value;
		for (var j=0,len=this.colModel.length;j<len;j++) {
			value = item.getValue(this.colModel[j].key);
			if(!value){
				value = '';
			}
			$('<td>' + value + '</td>').appendTo(tr);
		}
//		$('<td></td>').appendTo(tr);
		
		return tr;
	},
	//更新节点　图标　及　显示字段
	refreshNode:function(id){
		this.handler.refreshNode(this,id);
		/*var array = id.split('_');
		var item = YIUI.DictService.getItem(array[0], array[1]);
		var $tr = $('#' + id, this._$table);
		
		if(item.nodeType == 1){
			$tr.attr('haschild', true);
		}
		
		if(item.enable != undefined){
			$tr.attr('enable', item.enable);
			$tr.removeClass('invalid').removeClass('disabled');
			switch(item.enable) {
				case -1:
					$tr.addClass("invalid");
					break;
				case 0: 
					$tr.addClass("disabled");
					break;
				case 1:
//					tr.addClass("invalid");
					break;
			}
		}
		
		var value;
		for (var j=0,len=this.colModel.length;j<len;j++) {
			value = item.getValue(this.colModel[j].key);
			if(!value){
				value = '';
			}
			$($tr.children('td')[j]).html(value);
			//$('<td>' + value + '</td>').appendTo(tr);
		}
		this._$table.formatNode($tr);*/
		
	},
	getQueryValue: function(){
		return this._$fuzzyText.val();
	},
	clearSelection: function(){
		if(this.selectId){
			$('#' + this.selectId, this._$table).removeClass("sel-row");
			this.selectId = null;
		}
	},
	dependedValueChange: function(dependedField){
				//TODO 目前dictview的itemKey非动态
		
		var filter = this.handler.getDictFilter(this);
		
		
		var isSame = function(filter1 , filter2){
			if(filter2 == null){
				return false;
			}
			
			if(filter1.itemKey != filter2.itemKey){
				return false;
			}
			if(filter1.formKey != filter2.formKey){
				return false;
			}
			if(filter1.fieldKey != filter2.fieldKey){
				return false;
			}
			if(filter1.filterIndex != filter2.filterIndex){
				return false;
			}
			
			if(filter1.values.toString() != filter2.values.toString()){
				return false;
			}
			
			if(filter1.dependency != filter2.dependency){
				return false;
			}
			
			return true;
			
		}
		
		var refresh = false;
		
		if(filter != null && !isSame(filter , this.dictFilter)){
			this.dictFilter = filter;
			refresh = true;
		}else if(filter != null){
			if(this.dictFilter.dependency && this.dictFilter.dependency.toLowerCase().indexOf(dependedField.toLowerCase()) >= 0 ){
				refresh = true;
			}	
		}else if(this.dictFilter != null){
			this.dictFilter = null;
			refresh = true;
		}
		
		if(!refresh){
			return;
		}
		
		if(this.isChainDict()){
			this.handler.doGoToPage(this, 0, true);
		}else{
			this.expandNode(this.root.id , true);
		}
	}
});

YIUI.reg('dictview', YIUI.Control.DictView);
})();(function() {
	YIUI.DictQuery = function(options) {
		options = $.extend(true, {
			startRow: 0, 
			maxRows: 5, 
			pageIndicatorCount: 3, 
			fuzzyValue: "",
			columns: [ {
    			key: "Name",
    			caption: "名称",
    			visible: true,
    			enable: true
    		}, {
    			key: "Code",
    			caption: "代码",
    			visible: true,
    			enable: true
    		}]
		}, options);
		var dictQuery = $("<div></div>").attr("id", "dict_dialog").addClass("dtquery");
		var dictData = YIUI.DictService.getQueryData(options.itemKey, 0, options.maxRows, options.pageIndicatorCount, options.fuzzyValue, options.stateMask, options.dictFilter, options.rootValue);
    	var searchTxt = new YIUI.Control.TextEditor({
    		metaObj: {
    			x: 0,
    			y: 0,
    			top: "5px",
    			visible: true
    		},
    		listeners: {
    			change: $.noop
    		},
    		install: $.noop,
    		value: options.fuzzyValue
    	});
    	var searchBtn = new YIUI.Control.Button({
    		metaObj: {
    			x: 1,
    			y: 0,
    			top: "5px",
    			visible: true
    		},
    		listeners: {
    			click: $.noop
    		},
    		value : '查询'
    	});
    	var listView = new YIUI.Control.ListView({
    		metaObj: {
    			x: 0,
    			y: 1,
    			colspan: 2,
    			pageRowCount: options.maxRows,
    			visible: true
    		},
    		data: dictData.data,
	        showPageDetail: false,
	        showFirstButton: false,
	        showLastButton: false,
    		totalRowCount: dictData.totalRowCount,
    		pageIndicatorCount: options.pageIndicatorCount,
    		columnInfo: options.columns
    	});
    	
    	//默认是显示两列  code、name
    	if(options.displayCols) {
    		listView.columnInfo = options.displayCols;
    	}
    	
    	listView.addDataRow = function(data){
        	var $tbody = $(".tbl-body tbody", listView.$table);
        	var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
        	if(listView.$table && data !== undefined) {
            	var $tbody = $(".lv-tb .lv-body tbody", this.el);
            	$("tr.space", $tbody).remove();
            	if($("tr.data", $tbody).length == 0 || $("label.empty", $tbody).length == 0) {
            		$("label.empty", $tbody).remove();
            	}
            	var $tr , value , $td;
            	$.each(data , function(i , row){
            		$tr = $('<tr></tr>').addClass("data");
            		if(!hasFirst && i == 0) {
            			$tr.addClass("first");
            		}
        			var seq = $tbody.children().length+1;
            		if(seq % 2 == 0) {
            			$tr.addClass("even");
            		}
            		$.each(listView.columnInfo , function(i , column){
            			$td = $('<td></td>');
            			if(i == 0) {
            				var span = $("<span/>").addClass("dict_icon").appendTo($td);
            				if(row.NodeType == 0) {
            					span.addClass("p_node");
            				}
            			}
                		
        				value = row[column.key];
    					$td.append(value);
            			if(column.visible) {
            				$tr.append($td);
            			}
            		});
            		$tr.data("caption", row["caption"]);
            		$tr.data("itemKey", row["itemKey"]);
            		$tr.data("oid", row["oid"]);
            		$tbody.append($tr);
            	});
        	}
        };

        listView.addEmptyRow = function() {
        	var $body = $(".lv-tb .lv-body", this.el);
    		var $tbl = $(".tbl-body", $body);
        	$("tr.space", $tbl).remove();
    		if($("tr.data", $tbl).first().length == 0) {
        		var lbl = $("tbody label.empty", $tbl);
    			if(lbl.length == 0) {
    				lbl = $("<label class='empty'>表中无内容</label>");
    				$("tbody", $tbl).append(lbl);
    			}
    			var width = $("tr.first", $tbl).width();
    			var top = ($body.height() - lbl.height()) / 2;
    			lbl.width(width).css("top", top + "px");
    			return;
    		}
    		
    		var tr_h = $("tr.data", $tbl).first().outerHeight();
    		var body_h = $(".tbl-body", $body).outerHeight();
    		if(!body_h) {
    			var len = $("tr.data", $tbl).length;
    			body_h = 0;
    			for (var i = 0; i < len; i++) {
    				body_h +=  $("tr.data", $tbl).eq(i).outerHeight();
    			}
    		}
    		var total_h = (($body[0].clientHeight || $body.height()) - body_h);
    		var count = Math.ceil( total_h / tr_h);
    		var last_h = total_h - (count - 1) * tr_h;
    		if(count <= 0) return;
    		for (var i = 0; i < count; i++) {
    			var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
    			var index = $tr.index() + 1;
    			if(index % 2 == 0) {
    				$tr.addClass("even");
    			}
        		$.each(this.columnInfo , function(i , column){
        			var $td = $('<td></td>');
        			if(column.visible) {
        				$tr.append($td);
        			} 
        		});
    			if(i == count - 1) {
    				$tr.addClass("last");
    				$("td", $tr).height(last_h);
    				var h = $body.height() - $tbl.height();
    				if(h > 0 && h < tr_h) {
    					$("td", $tr).height(last_h + h);
    				}
    				
    			} else {
    				$tr.outerHeight(tr_h);
    			}
    		}
    		
    	};
        listView.createColumnHead = function(){
        	var $thead = $(".tbl-head thead", this.$table);
        	var $tbody = $(".tbl-body tbody", this.$table);
        	if(this.columnInfo && this.columnInfo.length > 0 ){
    			var $tr = $('<tr></tr>'),$th;
    			var $tr_b = $('<tr class="first"></tr>'),$td;
    			for( var i = 0, len = this.columnInfo.length; i < len; i ++){
    				this.columnInfo[i].width = Math.round((1 / len)*100)+"%";
    				
    			    $th = $('<th><label>' + this.columnInfo[i].caption + '</label></th>').attr("colIndex", i);
//    			    if($.isPercentage(this.columnInfo[i].width)) {
//    			    	this.$percentages.push(this.columnInfo[i]);
//    			    }
    			    $th.css("width", $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width())));
//    			    $th.css("width", this.columnInfo[i].width);
    			    $("label", $th).css("width", $th.width()).css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
    			    

    			    $td = $('<td></td>').attr("colIndex", i);
    			    $td.css("width", $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width())));
    			    $td.css("height", "0px");
    			    
    			    if(this.columnInfo[i].visible != false) {
    			    	$tr.append($th);
    			    	$tr_b.append($td);
    			    }
    			}
        	}
    		$thead.append($tr);
    		$tbody.append($tr_b);
        };
        listView.onSetWidth = function(width) {
    		this.el.css("width", width);
    		this._pagination.content.css("width", width);
    		var $ths = $("th", this.$table), 
    			$tds = $("tr.first td", this.$table),
    			$th, $td, $thWidth, _index;
    		var tblW = 0;
    		for (var i = 0, len = this.columnInfo.length; i < len; i++) {
    			$th = $("[colindex="+i+"]", this.$table);
    			$td = $tds.eq($th.index());
    			if(!this.columnInfo[i].visible) continue;
    		    $thWidth = $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.$table.width()));
    			$th.css("width", $thWidth);
    			$td.css("width", $th.width());
    			$td.outerWidth($th.outerWidth());
    		    $("label", $th).css("width", $thWidth);
    		    tblW += $thWidth;
    		}
    		
    		this.syncHandleWidths();
    	};
    	var gridpanel = new YIUI.Panel.GridLayoutPanel({
    		metaObj: {
    			rowGap : 5,
    			columnGap : 5,
    			leftPadding: 5,
    			topPadding: 5,
    			bottomPadding: 5
    		},
    		widths : ["99%", 80],
    		minWidths: [-1, -1],
    		heights : [30, "100%"],
    		items : [searchTxt, searchBtn, listView]
    	});

		dictQuery.modalDialog(null, {title: options.caption || " ", showClose: false, isResize: false, width: "500px", height: "345px"});
		gridpanel.render(dictQuery.dialogContent());
		
		$(".dialog-close", dictQuery).click(function() {
            options.callback();
            options.textInput.focus();
		});

		searchBtn.el.unbind();
		$("input", searchTxt.el).unbind();
    	searchBtn.el.click(function(event) {
    		getDictData(searchTxt.getValue(), 0, true);
    	});
    	searchTxt.el.keypress(function (event) {
            if (event.keyCode == 13) {
                searchBtn.el.click();
                $("input", searchTxt.el).blur();
            }
        });
    	listView.el.addClass("ui-dictquery");
    	listView._pagination.pageChanges = function(pageNum) {
    		getDictData(searchTxt.getValue(), pageNum*options.maxRows);
        };
        
		var getDictData = function(fuzzyValue, startRow, isResetPageNum) {
			var data = YIUI.DictService.getQueryData(options.itemKey, startRow, options.maxRows, options.pageIndicatorCount, fuzzyValue, options.stateMask, options.dictFilter, options.rootValue);
			if(startRow == 0 && data.totalRowCount < options.maxRows) {
				listView._pagination.hidePagination();
			} else if(data.totalRowCount) {
				listView._pagination.setTotalRowCount(data.totalRowCount + startRow, isResetPageNum || false);
			}
    		listView.data = data.data;
    		listView.clearDataRow();
    		listView.addDataRow(listView.data);
    		listView.addEmptyRow();
		};

		listView.$table.undelegate();
		listView.$table.delegate(".tbl-body tr", "dblclick", this.doubleClick == null ? function(event) {
			if(!listView.enable || $(this).attr("enable") == "false") return;
        	var colIndex = $(event.target).index();
            var rowIndex = $(event.target).parent().index();
            var caption = $(this).data("caption"),
            	itemKey = $(this).data("itemKey"),
            	oid = $(this).data("oid"),
            	paras = {};
            paras.oid = oid || 0;
            paras.itemKey = itemKey;
            paras.caption = caption;
	   		var itemData = new YIUI.ItemData(paras);
	   		
            options.callback(itemData);
            dictQuery.close();

//    		var ipArr = $("input");
//    		var ipCur = options.textInput;
//    		var index = ipArr.index(ipCur) + 1;
//    		ipArr.eq(index).focus();
            options.textInput.focus();
            event.stopPropagation();
            
        } : this.doubleClick);
        
	}
})();

/**
 * 超链接控件。
 */
YIUI.Control.Hyperlink = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 自动创建为超链接a。
     */
    autoEl: '<a class="ui-hlk"></a>',

    handler: YIUI.HyperLinkHandler,
    
    behavior: YIUI.HyperLinkBehavior,

    /**
     * String。
     * 超链接地址，也可以是Javascript代码执行。
     */
    //href : 'javascript:void(0);',
    /**
     * String。
     * 在何处打开页面：_blank,_self,_parent,_top,framename。
     */
    target: '_self',
    /**
     * String,参见 YIUI.Hyperlink_TargetType
     */
    targetType: YIUI.Hyperlink_TargetType.NewTab,

    setText: function (text) {
        this.hyperlink.setText(text);
    },
    
    getShowText: function() {
    	return this.hyperlink.getText();
    },

    needClean: function () {
        return false;
    },

    /** 完成超链接的渲染 */
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        var metaObj = this.getMetaObj();
        this.hyperlink = new YIUI.Yes_HyperLink({
            el: $this.el,
            url: metaObj.url,
            targetType: metaObj.targetType
        });
        this.setValue(this.value);
        this.setTarget(metaObj.targetType);
        this.setURL(metaObj.url);
        if (this.text) {
            this.hyperlink.setText(this.text);
        } else {
            this.hyperlink.setText(this.caption);
        }
    },

    setTip: function (tip) {
        var tip = this.text || this.caption;
        this.base(tip);
    },
    
    setURL: function(url) {
        if(!url) return;
    	this.url = url;
        var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
        switch(this.targetType) {
            case YIUI.Hyperlink_TargetType.Current:
                showTarget = YIUI.Hyperlink_TargetType.Str_Current;
            case YIUI.Hyperlink_TargetType.NewTab:
                this.el.attr("href", this.url);
                this.el.attr("target", YIUI.Hyperlink_target[showTarget]);
            break;
        }
    },
    
    setTarget: function(targetType) {
    	this.targetType = targetType;
    },

    onSetHeight: function (height) {
        this.base(height);
        this.hyperlink.setHeight(height);
    },
    focus: function () {
        this.el.attr("tabIndex",this.getTabIndex());
        this.el.focus();
    },
    install: function () {
        var self = this;
        if (this.hyperlink.getText() != "") {
            this.el.click(function () {
                if (!self.enable) return;
                if(self.url && self.targetType == YIUI.Hyperlink_TargetType.New) {
                    window.open(self.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                } else if(!self.url){
                    self.handler.doOnClick(self);
                }
            })
        }
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    },

    initDefaultValue: function (options) {
        this.base(options);
        var $this = this;
        this.hyperlink = new YIUI.Yes_HyperLink({
            el: $this.el,
        	isPortal: true
        });
        this.install();
    },
    setEnable: function (enable) {
        this.base(enable);
        this.hyperlink.setEnable(enable);
    },
    
    checkEnd: function(value) {
        this.text = value;
        this.hyperlink.setText(this.text);
	}
	
});
YIUI.reg('hyperlink', YIUI.Control.Hyperlink);/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-3-26
 * Time: 下午2:52
 */
YIUI.Control.ImageList = YIUI.extend(YIUI.Control, {
    autoEl: '<img>',
    items: null,
    defaultValue: null,
    setValue: function (value) {
        this.base(value);
        if (this.items) {
            this.el.attr("src", this.items[value]);
        }
    },
    onRender: function (ct) {
        this.base(ct);
        if (this.items) {
            if (this.defaultValue) {
                this.el.attr("src", this.items[this.defaultValue]);
            } else {
                this.el.attr("src", this.items[0]);
            }
        }
    }
});
YIUI.reg('imagelist', YIUI.Control.ImageList);/**
 * 标签控件，主要用于显示文本。
 */
YIUI.Control.Label = YIUI.extend(YIUI.Control, {
    
	autoEl: "<div></div>",
	
    /**
     * String。 
     * 图标
     */
    icon : null,
    
    onSetWidth: function(width) {
    	this.yesLabel.setWidth(width);
    },
    
    onSetHeight: function(height) {
    	this.yesLabel.setHeight(height);
    },
    
    setFormatStyle: function(cssStyle) {
    	this.yesLabel.setCssStyle(cssStyle);
	},
	
	setIcon: function(icon) {
		this.yesLabel.setIcon(icon);
	},

    needClean: function() {
    	return false;
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },
    
    setValue: function (value, commit, fireEvent) {
    	var changed = this.base(value, commit, fireEvent);
        this.yesLabel.setValue(this.value);
    	return changed;
    },
    /** 
     * 完成label的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	var $this = this;
    	$this.value = $this.value || $this.caption;
    	this.yesLabel = new YIUI.Yes_Label({
    		el: $this.el,
    		icon: $this.getMetaObj().icon,
    		caption: $this.value
    	});
    	if(this.buddy) {
    		this.el.addClass("ui-innerlbl");
    	} else {
    		this.el.addClass("ui-lbl");
    	}
    }
});
YIUI.reg('label', YIUI.Control.Label);/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-4-21
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

YIUI.ListViewWithLayout = function(listView)  {
    var columnMap = {};
    $.each(listView.columnInfo , function(i , column) {
        columnMap[column.key] = column;
    });
    var layoutView = listView.layoutView;
    var items = layoutView['items'];
    var _height = 0, _width = 0, _seqWidth = 50;
    return {
        _drawLayoutPanel : function(panel) {
            $("tr[row!='0'] td", panel.el).addClass("lv-cell-sp")
        },

        _getRowLayoutWidth :function() {
           return _width - _seqWidth;
        },

        createFirstDataLayoutView: function() {
            var dataLayout = $.extend(true, {}, layoutView);
            $.each(dataLayout.items, function (i, item) {
                item.type = YIUI.CONTROLTYPE.LABEL;
                item.tagName = "label";
            });
            var $td = $("<td class='lv-layout'></td>");
            $td.css("width", _width);
            $td.css("height", "0px");
            return $td;
        },
        createDataLayoutView: function(rowData) {
            var layoutConfig = $.extend(true, {}, layoutView);
            var $td = $("<td class='lv-layout'></td>");
            $td.css("width", _width);
            $td.css("height", _height);

            $.each(layoutConfig.items, function(i, item) {
                item.ofFormID = listView.ofFormID;
                item.tagName = "label";
                item.type = YIUI.CONTROLTYPE.LABEL;
                var value;
                if (rowData) {
                    var cell = rowData[item.key];
                    value = (cell && cell.value!=="") ? cell.caption: '';
                } else {
                    return;
                }
                item.caption  = value;
                //item.text = value;
                var column = columnMap[item.key];
                switch (column.columnType) {
                    case YIUI.CONTROLTYPE.CHECKBOX:
                        delete item.caption;
                        delete item.text;
                    case YIUI.CONTROLTYPE.BUTTON:
                    case YIUI.CONTROLTYPE.HYPERLINK:
                        item.type = column.columnType;
                        $.extend(item, column);
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                        if(column.isOnlyDate){
                            item.caption = value.split(" ")[0];
                        }
                }

            });
            var panel = new YIUI.Panel(layoutConfig);
            panel.render($td);
            panel.doLayout(this._getRowLayoutWidth(), _height);
            //此处清除checkbox.js中定义的值变化事件
            $(".chk", $td).unbind();
            this._drawLayoutPanel(panel);
            return $td;
        },
        createHeadLayoutView: function() {
           var headLayout = $.extend(true, {}, layoutView);
           $.each(headLayout.items, function (i, item) {
               var column = columnMap[item.key];
               item.type = YIUI.CONTROLTYPE.LABEL;
               item.tagName = "label";
               item.caption = column.caption;
           });
           // headLayout.tagName = headLayout.layout.toLowerCase() + "panel"
           // var panel = YIUI.create(headLayout);
            var panel = new YIUI.Panel(headLayout);
            var $th = $("<th class='lv-layout'></th>");
            $th.css("width", this._getRowLayoutWidth());
            $th.css("height", _height);
            panel.render($th);
            panel.doLayout(this._getRowLayoutWidth(), _height);
            this._drawLayoutPanel(panel);
            return $th;
        },
        createColumnHead: function() {
            _width = listView.el.width();
            var $thead = $(".tbl-head thead", listView.$table);
            var $tbody = $(".tbl-body tbody", listView.$table);
            if(listView.columnInfo && listView.columnInfo.length > 0 ){
                var $tr = $('<tr></tr>'),$th;
                var $tr_b = $('<tr class="first"></tr>'),$td;

                //生成序号列
                $th = $('<th><label>序</label></th>').addClass("seq");
                $("label", $th).css("width", "100%").css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
                $tr.append($th);
                $td = $('<td></td>').addClass("seq");
                $td.css("height", "0px");
                $tr_b.append($td);

                //生成表格列标题布局
                $th = this.createHeadLayoutView();
                $tr.append($th);

                //生成表格数据行布局
                $td = this.createFirstDataLayoutView();
                $tr_b.append($td);

                $("<th class='space'></th>").appendTo($tr);
                $("<td class='space'></td>").css("height", "0px").appendTo($tr_b);
            }
            $thead.append($tr);
            $tbody.append($tr_b);
        },
        onSetWidth: function(width) {
            listView.el.css("width", width);
            listView._pagination.content.css("width", width);
            var $ths = $("th", listView.$table),
                $th, $td, thWidth, _index;
            $("th.space", listView.$table).css("width", "100%");
            var widthItems = layoutView.widths;
            var allWidth = 0;
            $.each(widthItems, function(index, widthItem) {
                thWidth = $.getReal(widthItem, listView.calcRealValues(widthItems, listView.el.width()));
                allWidth += thWidth;
                $(".lv-tb .lv-layout tr td[col='" + index +"']").each( function(_index, el) {
                    $(el).css("width", thWidth);
                    $("div", el).children().eq(0).width(thWidth);
                });
            });

            _width = Math.max(width, allWidth + _seqWidth);
            $(".lv-layout", listView.el).css("width", this._getRowLayoutWidth());
            $("div.ui-pnl", listView.el).css("width", this._getRowLayoutWidth());
            $("table.lv-tb", listView.el).css("width", _width);
            listView.syncHandleWidths();
        },

        addEmptyRow: function() {
            var $body = $(".lv-tb .lv-body", listView.el);
            var $tbl = $(".tbl-body", $body);
            $("tr.space", $tbl).remove();
            if($("tr.data", $tbl).first().length == 0) {
                var lbl = $("tbody label.empty", $tbl);
                if(lbl.length == 0) {
                    lbl = $("<label class='empty'>表中无内容</label>");
                    $("tbody", $tbl).append(lbl);
                }
                var width = $("tr.first", $tbl).width();
                var top = ($body.height() - lbl.height()) / 2;
                lbl.width(width).css("top", top + "px");
                return;
            }
            var tr_h = $("tr.data", $tbl).first().outerHeight();
            var body_h = $(".tbl-body", $body).outerHeight();
            if(!body_h) {
                var len = $("tr.data", $tbl).length;
                body_h = 0;
                for (var i = 0; i < len; i++) {
                    body_h +=  $("tr.data", $tbl).eq(i).outerHeight();
                }
            }
            var client_h = ($body[0].clientHeight || $body.height());
            var total_h = (client_h - body_h);
            var count = Math.ceil( total_h / tr_h);
            var last_h = total_h - (count - 1) * tr_h;
            if(count <= 0) return;
            for (var i = 0; i < count; i++) {
                var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
                var index = $tr.index() + 1;
                if(index % 2 == 0) {
                    $tr.addClass("even");
                }
                $('<td></td>').addClass("seq").appendTo($tr);

                var $td = this.createDataLayoutView();
                $tr.append($td);

                $("<td class='space'></td>").appendTo($tr);
                if(i == count - 1) {
                    $tr.addClass("last");
                    $("td", $tr).height(last_h);
                    var h = client_h - $tbl.height();
                    if(h > 0 && h < tr_h) {
                        $("td", $tr).height(last_h + h);
                    }
                } else {
                    $tr.outerHeight(tr_h);
                }
            }
            this.onSetWidth(_width);
        },

        addDataRow: function(data){
            if(data && listView.$table) {
                var $tbody = $(".tbl-body>tbody", listView.$table);
                $("tr.space", $tbody).remove();
                if($("tr.data", $tbody).length == 0) {
                    $("label.empty", $tbody).remove();
                }
                var $tr , value , $td;
                var _this = this;
                var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
                $.each(data , function(i , row){
                    $tr = $('<tr></tr>').addClass("data");
                    $td = $('<td></td>').addClass("seq");
                    if(!hasFirst && i == 0) {
                        $tr.addClass("first");
                    }
                    var seq = $tbody.children().length+1;
                    if(seq % 2 == 0) {
                        $tr.addClass("even");
                    }
                    $tr.append($td.html($tbody.children().length));
                    $td = _this.createDataLayoutView(row);
                    $tr.append($td);

                    $("<td class='space'></td>").appendTo($tr);
                    $tbody.append($tr);
                });
            }
        },

        install: function () {
            var self = this;
            listView.$table.delegate(".chk", "click", function(event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                if($(this).attr('isChecked') && $(this).attr('isChecked') == 'true'){
                    $(this).attr('isChecked', 'false');
                    $(this).removeClass("checked");
                }else{
                    $(this).attr('isChecked','true');
                    $(this).addClass("checked");
                }

                var colKey = $(event.target).parents('div.ui-chk').attr("id");
                colKey = self._getCompKey(colKey);
                var colIndex = $.inArray(columnMap[colKey],  listView.columnInfo);

                //var index = $(event.target).parent('td').index();
                //var colIndex = $("thead th", self.$table).eq(index).attr("colIndex");
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                var isChecked = $(this).attr('isChecked') == "true" ? true : false;
                listView.handler.doCellValueChanged(listView , rowIndex , colIndex , isChecked)
                event.stopPropagation();
            });

            listView.$table.delegate(".ui-btn", 'click', function(event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                var colKey = $(this).attr("id");
                colKey = self._getCompKey(colKey);
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                listView.handler.doOnCellClick(listView , rowIndex , colKey);
                event.stopPropagation();
            });

            listView.$table.delegate(".ui-hlk", 'click',function( event){
                if(!listView.enable || $(this).attr("enable") == "false") return;
                var rowIndex = $(event.target).parents('tr.data').index() - 1;
                var colKey = $(this).attr("id");
                colKey = self._getCompKey(colKey);
                listView.handler.doOnCellClick(listView , rowIndex , colKey);
                event.stopPropagation();
            });
        },

        _getCompKey : function(compID) {
            if (!compID) return compID;
            if (!listView.ofFormID)  return compID;

            var pre = listView.ofFormID + "_";
            if (compID.length > pre.length  && compID.substring(0, pre.length) == pre) {
                return compID.substring(pre.length)
            }
            return compID;
        },

        _createHandles: function () {
            var _this = listView;
            _this.$handleContainer = $("<div class='rc-handle-cntr'/>");
            _this.$table.before(_this.$handleContainer);
            _this.$table.find('th .ui-pnl tr td').each(function (i, el) {
                var $handle;
                $handle = $("<div class='rc-handle' />");
                $handle.data('th', $(el));
                $handle.bind('mousedown', _this, function (e) {
                    var $currentGrip , $leftColumn  , leftColOldW; // _this = e.data;
                    e.preventDefault();
                    $currentGrip = $(e.currentTarget);
                    $leftColumn = $currentGrip.data('th');
                    leftColOldW = $leftColumn.width();
                    var target = $(e.target);
                    target.addClass("clicked");
                    target.data("startPos", target.position().left);
                    var startPosition = e.clientX;
                    var difference , leftColW, tblWidth, layoutWidth;
                    var table = $leftColumn.parents("table.lv-tb").eq(0);
                    var $row = $leftColumn.parents("table.lv-tb .lv-head .lv-layout");

                    var $body = $(".lv-tb .lv-body", _this.el);
                    var client_h1 = ($body[0].clientHeight || $body.height());
                    $(document).on('mousemove.rc', function (e) {
                        difference = e.clientX - startPosition;
                        target.css('left', target.data("startPos") + difference);
                        leftColW = leftColOldW + difference;
                        tblWidth = table.width() + difference;
                        layoutWidth =  $row.width() + difference;
                        if(leftColW < 10) {
                            leftColW = 10;
                            tblWidth += 10 - leftColW;
                        }
                    });
                    return $(document).one('mouseup', function (e) {
                        $(document).off('mousemove.rc');
                        //table.width(tblWidth);
                        var index = $leftColumn.attr("col");
                        $(".lv-layout tr td[col='" + index +"']", table).each( function(_index, el) {
                            $(el).css("width", leftColW);
                            $("div", el).width(leftColW);
                            $("div", el).children().eq(0).width(leftColW);
                            $(el).parents(".lv-layout").css("width", layoutWidth);
                        });
                       /* $(".lv-layout", table).each(function(_index, el) {
                            $(el).css("width", layoutWidth);
                        });*/

                        target.removeClass("clicked");
                        var client_h2 = ($body[0].clientHeight || $body.height());
                        if(client_h1 != client_h2) {
                            _this.addEmptyRow();
                        }
                        return _this.syncHandleWidths();
                    });
                });
                return $handle.appendTo(_this.$handleContainer);
            });
        }
    }
};


YIUI.Control.ListView = YIUI.extend(YIUI.Control, {

    handler: YIUI.ListViewHandler,
    
    behavior: YIUI.ListViewBehavior,
    
    $table: null,
    
    height: "100%",

    $handleContainer: null,

    //doubleClick: null,
    
    //columnInfo : null,
    //columnKeys : null,
    
    getFieldArray: function(form, fieldKey) {
    	var info = this.columnInfo;
    	var colKey = "";
    	for (var i = 0, len = info.length; i < len; i++) {
			var col = info[i];
			if(col.columnKey == fieldKey) {
				colKey = col.key;
				break;
			}
		}
    	
        var doc = form.getDocument(), OIDList = new Array(), dataTable;
        dataTable = doc.getByKey(this.getMetaObj().tableKey);
        var data = this.data, columnIfo = this.columnInfo; 
		for (var i = 0, len = data.length; i < len; i++) {
			if (!this.isActiveRowSelect(i))
				continue;
			OIDList.push(this.getValByKey(i, colKey));
		}
		
        return OIDList;
    },
    isActiveRowSelect: function(i) {
		if (this.hasSelectField) {
			var index = this.selectFieldIndex;
			return this.getValue(i, index);
		}
		return true;
    },
    
    onRender: function (ct) {
        this.base(ct);
       // if (this.data.isTableData) {
            //第1行为表头，其余为明细

        if (this.layoutView) {
            this.layoutViewInvoker = new YIUI.ListViewWithLayout(this);
            this.el.addClass('ui-lv ui-lv-withlayout');
        } else {
            this.el.addClass('ui-lv');
        }

		if($.browser.isIE) {
			this.el.attr("onselectstart", "return false");
		}
		var self = this;
		var rowCount = self.getMetaObj().pageRowCount;
		var type = self.getMetaObj().loadType;
    	self._pagination = self.el.pagination({
//			pageSize: self.getMetaObj().pageRowCount,
			pageSize: rowCount,
			//总记录数
	        totalNumber: self.totalRowCount,
	        showPages: true,
	        showPageDetail: self.showPageDetail || false,
	        showFirstButton: self.showFirstButton,
	        showLastButton: self.showLastButton,
	        pageNumber: self.pageNumber || 1,
	        pageIndicatorCount: self.pageIndicatorCount || 5
		});

        var _tbody = $('<tbody></tbody>');
        var _thead = $('<thead></thead>');
//        this.$table = $('<table class="lv-tb"></table>').append(_thead).append(_tbody).appendTo(self._pagination.content);
        
        var $div = $('<div class="lv-div"></div>').appendTo(self._pagination.content);
        this.$table = $('<table class="lv-tb"></table>').appendTo($div);
        var $tr_h = $('<tr class="head"></tr>').appendTo(this.$table);
        var $td_h = $('<td></td>').attr("colspan", this.columnInfo.length + 1).appendTo($tr_h);
        var $div_h = $('<div class="lv-head"></div>').appendTo($td_h);
        var $head = $('<table class="tbl-head"></table>').append(_thead).appendTo($div_h);

        var $tr_b = $('<tr class="body"></tr>').appendTo(this.$table);
        var $td_b = $('<td></td>').attr("colspan", this.columnInfo.length + 1).appendTo($tr_b);
        var $div_b = $('<div class="lv-body"></div>').appendTo($td_b);
        var $body = $('<table class="tbl-body"></table>').append(_tbody).appendTo($div_b);
        
        this.createColumnHead();
		
		//总行数大于data的长度
		if(this.totalRowCount <= this.getMetaObj().pageRowCount) {
			this._pagination.hidePagination();
			this._pagination.content.css("height", "100%");
		}
        this._createHandles();
        this.syncHandleWidths();
		this.addDataRow(this.data);
    },

    /**
     * 设置单元格显示样式。
     * @param style Object，参考style属性说明。
     */
    setColStyle: function (colEl, style) {
    	var cssStyle = {};
        style.backColor && (cssStyle['background-color'] = style.backColor);
        style.foreColor && (cssStyle['color'] = style.foreColor);
        if(style.vAlign > -1) {
        	cssStyle['vertical-align'] = YIUI.VAlignment.parse(style.vAlign);
        	cssStyle['line-height'] = "normal";
        }
        if(style.hAlign > -1) {
        	var hAlign = YIUI.HAlignment.parse(style.hAlign);
        	cssStyle['text-align'] = hAlign;
        	
        	var index = colEl.index();
        	var $th = $(".lv-head .tbl-head th", this.$table).eq(index);
        	if($th.css("text-align") != hAlign) $th.css("text-align", hAlign);
        }
        var font = style.font;
        if(font) {
        	font.name && (cssStyle['font-family'] = font.name);
        	font.size && (cssStyle['font-size'] = font.size);
        	font.bold && (cssStyle['font-weight'] = 'bold');
        	font.italic && (cssStyle['font-style'] = 'italic');
        }
        colEl.css(cssStyle);
        
    },

	addEmptyRow: function() {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.addEmptyRow();
            return;
        }
    	var $body = $(".lv-tb .lv-body", this.el);
		var $tbl = $(".tbl-body", $body);
    	$("tr.space", $tbl).remove();
		if($("tr.data", $tbl).first().length == 0) {
			var lbl = $("tbody label.empty", $tbl);
			if(lbl.length == 0) {
				lbl = $("<label class='empty'>表中无内容</label>");
				$("tbody", $tbl).append(lbl);
			}
			var width = $("tr.first", $tbl).width();
			var top = ($body.height() - lbl.height()) / 2;
			lbl.width(width).css("top", top + "px");
			return;
		}
		var tr_h = $("tr.data", $tbl).first().outerHeight();
		var body_h = $(".tbl-body", $body).outerHeight();
		if(!body_h) {
			var len = $("tr.data", $tbl).length;
			body_h = 0;
			for (var i = 0; i < len; i++) {
				body_h +=  $("tr.data", $tbl).eq(i).outerHeight();
			}
		}
		var client_h = ($body[0].clientHeight || $body.height());
		var total_h = (client_h - body_h);
		var count = Math.ceil( total_h / tr_h);
		var last_h = total_h - (count - 1) * tr_h;
		if(count <= 0) return;
		for (var i = 0; i < count; i++) {
			var $tr = $("<tr></tr>").addClass("space").appendTo($tbl);
			var index = $tr.index() + 1;
			if(index % 2 == 0) {
				$tr.addClass("even");
			}
			$('<td></td>').addClass("seq").appendTo($tr);
			var $this = this;
    		$.each(this.columnInfo , function(i , column){
    			var $td = $('<td></td>');
    			if(column.visible) {
    				$tr.append($td);
    			} 
    			if(column.format) {
    				$this.setColStyle($td, column.format);
    			}
    		});
			$("<td class='space'></td>").appendTo($tr);
			if(i == count - 1) {
				$tr.addClass("last");
				$("td", $tr).height(last_h);
				var h = client_h - $tbl.height();
				if(h > 0 && h < tr_h) {
					$("td", $tr).height(last_h + h);
				}
			} else {
				$tr.outerHeight(tr_h);
			}
		}
		
	},
	
    onSetHeight : function(height) {
    	this.el.css("height", height);
    	var pagesH = $(".paginationjs-pages", this.el).is(":hidden") ? 0 : $(".paginationjs-pages", this.el).outerHeight();
    	var realHeight = height - pagesH;
    	this._pagination.content.css("height", realHeight);
    	var head_h = $(".lv-tb .head", this.el).outerHeight();
    	var body_h = realHeight - head_h;

    	var $head = $(".lv-tb .lv-head", this.el);
    	var $body = $(".lv-tb .lv-body", this.el);
    	$body.outerHeight(body_h - 2);
    	$(".lv-div", this.el).outerHeight(realHeight);
//    	$body.css("line-height", $body.height() + "px");
		$(".space", $head).css("width", "100%");
		
		this.addEmptyRow();

		this.syncHandleWidths();
	},
	
	onSetWidth: function(width) {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.onSetWidth(width);
            return;
        }
		this.el.css("width", width);
		this._pagination.content.css("width", width);
		var $ths = $("th", this.$table), 
			$tds = $("tr.first td", this.$table),
			$th, $td, $thWidth, _index;
		$("th.space", this.$table).css("width", "100%");
		var tblW = 0;
		for (var i = 0, len = this.columnInfo.length; i < len; i++) {
			$th = $("[colindex="+i+"]", this.$table);
			$td = $tds.eq($th.index());
			if(!this.columnInfo[i].visible) continue;
		    $thWidth = $.getReal(this.columnInfo[i].width, this.calcRealValues(this.columnInfo, this.el.width()));
			$th.css("width", $thWidth);
			$td.css("width", $th.width());
			$td.outerWidth($th.outerWidth());
		    $("label", $th).css("width", $th.width());
		    tblW += $thWidth;
		}
		
		this.syncHandleWidths();
	},
	
    createColumnHead: function(){
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.createColumnHead();
            return;
        }
    	var $thead = $(".tbl-head thead", this.$table);
    	var $tbody = $(".tbl-body tbody", this.$table);
    	if(this.columnInfo && this.columnInfo.length > 0 ){
			var $tr = $('<tr></tr>'),$th;
			var $tr_b = $('<tr class="first"></tr>'),$td;
			for( var i = 0 ; i < this.columnInfo.length ; i ++){
				var column = this.columnInfo[i];
				if(i == 0){
					$th = $('<th><label>序号</label></th>').addClass("seq");
					$("label", $th).css("width", "100%").css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
					$tr.append($th);

					$td = $('<td></td>').addClass("seq");
//					$td.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
					$td.css("height", "0px");
					$tr_b.append($td);
				}
			    $th = $('<th><label>' + column.caption + '</label></th>').attr("colIndex", i);
			    $th.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
			    $("label", $th).css("width", $th.width()).css("overflow", "hidden").css("text-overflow", "ellipsis").css("display", "block");
			    
			    $td = $('<td></td>').attr("colIndex", i);
			    $td.css("width", $.getReal(column.width, this.calcRealValues(this.columnInfo, this.el.width())));
			    $td.css("height", "0px");
			    
                switch(column.columnType){
                    case YIUI.CONTROLTYPE.TEXTEDITOR:
                    	$th.addClass("lv-h-txt");
                        break;
                    case YIUI.CONTROLTYPE.CHECKBOX:
                    	$th.addClass("lv-h-chk");
                        break;
                    case YIUI.CONTROLTYPE.BUTTON:
                    	$th.addClass("lv-h-btn");
                        break;
                    case YIUI.CONTROLTYPE.HYPERLINK:
                    	$th.addClass("lv-h-hlk");
                        break;
                    case YIUI.CONTROLTYPE.DATEPICKER:
                    	$th.addClass("lv-h-dp");
                        break;
                }
			    
			    if(column.visible) {
			    	$tr.append($th);
			    	$tr_b.append($td);
			    }
				
			}
			$("<th class='space'></th>").appendTo($tr);
			$("<td class='space'></td>").css("height", "0px").appendTo($tr_b);
    	}
		$thead.append($tr);

		$tbody.append($tr_b);
    },
    
    setColumnCaption: function(columnKey, caption) {
    	var colIndex = this.findIndex(columnKey);
    	var $label = $("thead th[colIndex='"+colIndex+"'] label", this.$table);
    	$label.text(caption);
    },

    setColumnEnable: function(columnKey, enable) {
    	var colIndex = this.findIndex(columnKey);
    	var $th = $("thead th[colIndex='"+colIndex+"']", this.$table);
    	var $tdIndex = $th.index();
    	if($tdIndex > -1) {
    		for (var i = 0, len = this.data.length; i < len; i++) {
    			var $tr = $(".tbl-body tr", this.$table).eq(i);
    			var $td = $("td", $tr).eq($tdIndex);
    			var $el = $td.children();
    			this.setEnableByEl($el, enable);
			}
    	}
    },
    
    setEnableByEl: function($el, enable) {
    	if(enable) {
    		$($el, this.el).removeAttr("disabled");
    		$($el, this.el).removeClass("disabled");
    	} else {
    		$($el, this.el).attr("disabled", "disabled");
    		$($el, this.el).addClass("disabled");
    	}
    },
    
    setColumnVisible: function(columnKey, visible) {
    	var colIndex = this.findIndex(columnKey);
    	var $th = $("thead th[colIndex='"+colIndex+"']", this.$table);
    	visible ? $th.show() : $th.hide();
    	var $tdIndex = $th.index();
    	if($tdIndex > -1) {
    		for (var i = 0, len = this.data.length; i < len; i++) {
    			var $tr = $(".tbl-body tr", this.$table).eq(i);
    			var $td = $("td", $tr).eq($tdIndex);
    	    	visible ? $td.show() : $td.hide();
			}
    	}
    },
    
    calcRealValues: function(columnInfo, parentWidth) {
    	var realWidth = 0, columnWidth, width;
    	for (var i = 0, len = columnInfo.length; i < len; i++) {
    		columnWidth = $.isNumeric(columnInfo[i]) ? columnInfo[i] : columnInfo[i].width;
			if($.isNumeric(columnWidth) && columnWidth > 0) {
				realWidth += parseInt(columnWidth);
			}
		}
    	width = parentWidth - realWidth;
    	return width < 0 ? 10 : width;
    },
    
    addDataRow: function(data){
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.addDataRow(data);
            return;
        }
    	if(data && this.$table) {
        	var $tbody = $(".tbl-body tbody", this.$table);
        	$("tr.space", $tbody).remove();
        	if($("tr.data", $tbody).length == 0) {
        		$("label.empty", $tbody).remove();
        	}
        	var $tr , caption , $td;
        	var listView = this;
        	var hasFirst = $("tr.first", $tbody).length == 0 ? false : true;
        	$.each(data , function(i , row){
        	
        		$tr = $('<tr></tr>').addClass("data");
        		$td = $('<td></td>').addClass("seq");
        		if(!hasFirst && i == 0) {
        			$tr.addClass("first");
//        			$td.css("width", $.getReal(listView.columnInfo[0].width, listView.calcRealValues(listView.columnInfo, listView.el.width())));
        		}
        		var seq = $tbody.children().length+1;
        		if(seq % 2 == 0) {
        			$tr.addClass("even");
        		}
        		$tr.append($td.html($tbody.children().length));
        		
        		$.each(listView.columnInfo , function(i , column){
        			
        			//$td = $('<td>' + row[column.key] + '</td>');
        			
        			$td = $('<td></td>');
            		$td.css("width", $.getReal(column.width, listView.calcRealValues(listView.columnInfo, listView.el.width())));
        			var cell = row[column.key];
    				if(cell) {
    					if(cell.value == "") {
    						caption = "";
    					} else {
    						caption = cell.caption;
    					}
    				}
    				
                    switch(column.columnType){
                        case YIUI.CONTROLTYPE.TEXTEDITOR:
                        	caption=YIUI.TextFormat.format(caption, this);
                            $td.text(caption).addClass("lv-txt");
                            break;
                        case YIUI.CONTROLTYPE.CHECKBOX:
                            var $chkbox = $('<span class="chk"/>');
                            $chkbox.attr('isChecked', caption == '1' ? 'true' : 'false');
                            $chkbox.addClass(caption == '1' ? 'checked' : '');
                            $chkbox.attr("enable", column.enable);
                            $chkbox.data("key", column.key);
                            $td.append($chkbox).addClass("lv-chk");
                            listView.setEnableByEl($chkbox, column.enable);
                            column.el = $chkbox;
                            break;
                        case YIUI.CONTROLTYPE.BUTTON:
                            var $btn = $('<button></button>');
                            $btn.addClass("btn")
                            var $imginfo=$("<span class='imginfo' style='display: inline-block;height: 16px;width: 16px;vertical-align: middle;'></span>");
                            var $fontinfo=$("<span style='width:165px;font-weight: normal;overflow: hidden;max-width: 100%;text-overflow: ellipsis;vertical-align: middle;'>"+caption+"</span>");
                            $imginfo.css("background","url('Resource/"+this.icon+"')")
                            $btn.attr("enable", column.enable);
                            $btn.data("key", column.key);
                            $btn.append($imginfo);
                            $fontinfo.appendTo($btn);
                            $td.append($btn).addClass("lv-btn");
                            listView.setEnableByEl($btn, column.enable);
                            column.el = $btn;
                            break;
                        case YIUI.CONTROLTYPE.HYPERLINK:
                            var $hyperLink = $('<a>' + caption + '</a>');
                            $hyperLink.addClass("hlk");
                            var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
                            switch(column.targetType) {
                                case YIUI.Hyperlink_TargetType.Current:
                                    showTarget = YIUI.Hyperlink_TargetType.Str_Current;
                                case YIUI.Hyperlink_TargetType.NewTab:
                                    $hyperLink.attr("href", column.url);
                                    $hyperLink.attr("target", YIUI.Hyperlink_target[showTarget]);
                                break;
                                default:
                                    $hyperLink.data("url", column.url);
                                    $hyperLink.data("target", YIUI.Hyperlink_TargetType.New);
                                break;
                            }
                            $hyperLink.attr("enable", column.enable);
                            $hyperLink.data("key", column.key);
                            $td.append($hyperLink).addClass("lv-hlk");
                            listView.setEnableByEl($hyperLink, column.enable);
                            column.el = $hyperLink;
                            break;
                        case YIUI.CONTROLTYPE.DATEPICKER:
                            var onlyDate = column.isOnlyDate;
                            if(onlyDate){
                            	caption = caption.split(" ")[0];
                            }
                            $td.text(caption).addClass("lv-dp");
                            break;
                        default:
                            $td.html(caption);
                            break;
                    }
        			if(column.visible) {
        				$tr.append($td);
        			} 
        			if(column.format) {
        				listView.setColStyle($td, column.format);
        			}
        		});

    			$("<td class='space'></td>").appendTo($tr);
        		$tbody.append($tr);
        	});
    	}
    },
    
    clearDataRow: function() {
    	if(this.$table) {
        	var $tbody = $(".tbl-body tbody", this.$table);
        	$("tr", $tbody).not(".first").remove();
    	}
    },
    
    clearAllRows: function() {
    	this.data = [];
    	this.clearDataRow();
    },

    	// 处理差异
	diff: function(diffJson){
		var listView = this;
		listView.totalRowCount = diffJson.totalRowCount || listView.totalRowCount;
		if(diffJson.totalRowCount == undefined) {
			listView.totalRowCount = listView.totalRowCount;
		} else {
			listView.totalRowCount = diffJson.totalRowCount;
		}
		
		var columnInfo = diffJson.columnInfo;
		if(listView.totalRowCount < listView.getMetaObj().pageRowCount) {
			if(!$(".paginationjs-pages", this.el).is(":hidden")) {
				listView._pagination.hidePagination();
			}
	    	
		} else if(listView.totalRowCount) {
			listView._pagination.setTotalRowCount(listView.totalRowCount, true);
		}
    	var $body = $(".lv-tb .lv-body", this.el);
		var height_b = $body.outerHeight();
		
		var h = $(".lv-div", this.el).height();
		h -= $(".lv-tb .head").outerHeight();
		$body.css("height", h + "px");
		
		if(diffJson.data) {
			listView.data = diffJson.data;
			listView.clearDataRow();
			listView.addDataRow(listView.data);
		} else if(columnInfo) {
			$("thead", listView.$table).empty();
			listView.clearDataRow();
			listView.columnInfo = columnInfo;
			listView.createColumnHead();
			listView._createHandles();
			listView.syncHandleWidths();
			listView.addDataRow(listView.data);
		}
    	this.addEmptyRow();
	},
	
	initDefaultValue: function(options) {
		this.$table = $("table", this.el);
		this._createHandles();
		this.syncHandleWidths();
		this.totalRowCount = options.totalrowcount;
		this.pageRowCount = options.pagerowcount;
		if(options.columnkey) {
			this.columnKey = options.columnkey;
		}
		if(options.tablekey) {
			this.tableKey = options.tablekey;
		}
		
		this._pagination = this.el.pagination({
			pageSize: this.pageRowCount,
			//总记录数
	        totalNumber: this.totalRowCount,
	        showPages: true,
	        pageIndicatorCount: 5
		});
		this.$table.appendTo(this._pagination.content);
		this._pagination.content.css("width", this.el.width());
		var $ths = $("th", this.$table), $th, $thWidth, _index, columnInfo = [], column;
		for (var i = 0, len = $ths.length; i < len; i++) {
			$th = $ths.eq(i);
			column = {};
			column.key = $th.attr("key");
		    column.enable = $th.attr("enable");
		    column.visible = $th.attr("visible");
		    column.columnType = $th.attr("columnType");
		    columnInfo.push(column);
		}
		this.columnInfo = columnInfo;
		var realHeight = this.el.height() - $(".paginationjs-pages", this.el).height();
    	this._pagination.content.css("height", realHeight);
	},
	
	reload: function() {
		var form = YIUI.FormStack.getForm(this.ofFormID);
		var showLV = YIUI.ShowListView(form, this);
		showLV.load(this);
	},
	
	repaint: function() {
		this.clearDataRow();
		this.addDataRow(this.data);
    	this.addEmptyRow();
	},
	
	needTip: function() {
		return false;
	},
	
    install: function () {
        var self = this;

        self._pagination.pageChanges = function(pageNum) {
        	self.handler.doGoToPage(self, pageNum);
        	self.addEmptyRow();
        }
        
        if(this.hasDblClick){
	        self.$table.delegate(".tbl-body tr.data", "dblclick", function(event) {
				if(!self.enable || $(this).attr("enable") == "false") return;
	        	//var colIndex = $(event.target).index();
	            //var rowIndex = $(event.target).parent().index();
	            var rowIndex = $(event.target).parents('tr.data').index() - 1;
	            self.handler.doOnRowDblClick(self, rowIndex);
	        });
        }
        
        self.$table.delegate(".tbl-body>tbody>tr", "click", function(event) {
        	if(!$(this).hasClass("data")) {
        		if(self._selectedRow) {
        			self._selectedRow.removeClass("clicked");
        			self._selectedRow = null;
        		}
        		return;
        	}
        	var rowChange = true;
        	var rowIndex = $(event.target).parents('tr.data').index() - 1;
        	var oldIndex;
        	if(self._selectedRow) {
        		oldIndex = self._selectedRow.index() - 1;
       
        		rowChange = (oldIndex != rowIndex);
        		self._selectedRow.removeClass("clicked");
        	}
        	
        	$(this).addClass("clicked");
        	self._selectedRow = $(this);
        	if(self.hasClick){
        		self.handler.doOnRowClick(self, rowIndex);
        	}
        	if(rowChange && self.hasRowChanged){
        		self.handler.doOnFocusRowChange(self,oldIndex, rowIndex);
        	}
        });

        if (this.layoutViewInvoker) {
            this.layoutViewInvoker.install();
        } else {
            self.$table.delegate(".chk", "click", function(event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                if($(this).attr('isChecked') && $(this).attr('isChecked') == 'true'){
                    $(this).attr('isChecked', 'false');
                    $(this).removeClass("checked");
                }else{
                    $(this).attr('isChecked','true');
                    $(this).addClass("checked");
                }
                var index = $(event.target).parent('td').index();
                var colIndex = $("thead th", self.$table).eq(index).attr("colIndex");
                var rowIndex = $(event.target).parents('tr').index() - 1;
                var isChecked = $(this).attr('isChecked') == "true" ? true : false;
                self.handler.doCellValueChanged(self , rowIndex , colIndex , isChecked);
                event.stopPropagation();
            });
        
            self.$table.delegate(".btn", 'click',function(event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                var colKey = $(this).data("key");
                var rowIndex = $(event.target).parents('tr').index() - 1;
                self.handler.doOnCellClick(self , rowIndex , colKey);
                event.stopPropagation();
            });
        		
            self.$table.delegate(".hlk", 'click',function( event){
                if(!self.enable || $(this).attr("enable") == "false") return;
                var _url = $(this).data("url");
                var _target = $(this).data("target");
                if(_url && _target == YIUI.Hyperlink_TargetType.New) {
                    window.open(_url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                } else if(!_url){
                    var rowIndex = $(event.target).parents('tr').index() - 1;
                    var colKey = $(this).data("key");
                    self.handler.doOnCellClick(self , rowIndex , colKey);
                    event.stopPropagation();
                }

            });
        }
        var $body = $(".lv-tb .lv-body", this.el);
        var $head = $(".lv-tb .lv-head", this.el);
        $body.scroll(function() {
			var left = $body.scrollLeft();
			$head.scrollLeft(left);
			if($body[0].clientWidth != $body[0].scrollWidth) {
				var scroll_w = $body.width() - $body[0].clientWidth;
				$(".space", $head).outerWidth(scroll_w);
			} 
			self.syncHandleWidths();
		})
    },
    
    _createHandles: function () {
        if (this.layoutViewInvoker) {
            this.layoutViewInvoker._createHandles();
            return;
        }

        var _this = this;
        this.$handleContainer = $("<div class='rc-handle-cntr'/>");
        this.$table.before(this.$handleContainer);
        this.$table.find('tr th').each(function (i, el) {
            var $handle;
            $handle = $("<div class='rc-handle' />");
            $handle.data('th', $(el));
            $handle.bind('mousedown', _this, function (e) {
                var $currentGrip , $leftColumn  , leftColOldW  , _this = e.data;
                e.preventDefault();
                $currentGrip = $(e.currentTarget);
                $leftColumn = $currentGrip.data('th');
                leftColOldW = $leftColumn.width();
                var target = $(e.target);
                target.addClass("clicked");
                target.data("startPos", target.position().left);
                var startPosition = e.clientX;
                var difference , leftColW, tblWidth;
                var table = $leftColumn.parents("table").eq(0);
                
            	var $body = $(".lv-tb .lv-body", _this.el);
        		var client_h1 = ($body[0].clientHeight || $body.height());
                $(document).on('mousemove.rc', function (e) {
                    difference = e.clientX - startPosition;
                    target.css('left', target.data("startPos") + difference);
                    leftColW = leftColOldW + difference;
                    tblWidth = table.width() + difference;
                    if(leftColW < 10) {
                    	leftColW = 10;
                    	tblWidth += 10 - leftColW;
                    }
                });
                return $(document).one('mouseup', function (e) {
                    $(document).off('mousemove.rc');
                    $leftColumn.outerWidth(leftColW);
                    $("label", $leftColumn).width($leftColumn.width());
                    var index = $leftColumn.index();
                    var $td_b = $(".lv-tb .lv-body tr.first td", _this.el).eq(index);
//                    $td_b.outerWidth(leftColW);
                    $td_b.css("width", leftColW);
//	                table.width(tblWidth);
                    target.removeClass("clicked");
            		var client_h2 = ($body[0].clientHeight || $body.height());
            		if(client_h1 != client_h2) {
            			_this.addEmptyRow();
            		}
                    return _this.syncHandleWidths();
                });
            });
            return $handle.appendTo(_this.$handleContainer);
        });
    },

    syncHandleWidths: function () {
        var _this = this;
        this.$handleContainer.width(this.$table.width());
        this.$handleContainer.find('.rc-handle').each(function (_, el) {
            return $(el).css({
                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - _this.$handleContainer.offset().left),
                height: _this.$table.height()
            });
        });
    },
    
    getFocusRowIndex: function() {
    	var index = -1;
    	if(this._selectedRow) {
    		index = this._selectedRow.index() - 1;
    	}
    	return index;
    },
    
    findIndex: function(colKey) {
    	var cols = this.columnInfo, index = -1;
    	for (var i = 0, len = cols.length; i < len; i++) {
			if(cols[i].key == colKey){
				index = i;
				break;
			}
		}
    	return index;
    },
    
    setValByKey: function(rowIndex, colKey, value, commit, fireEvent) {
    	var colIndex = this.findIndex(colKey);
    	this.setValByIndex(rowIndex, colIndex, value, commit, fireEvent);
    },
    
    setValByIndex: function(rowIndex, colIndex, value, commit, fireEvent) {
    	var $tdIndex = $(".tbl-head thead th[colIndex='"+colIndex+"']", this.$table).index();
    	if($tdIndex > -1) {
    		var $td = $(".tbl-body tbody tr.data", this.$table).eq(rowIndex).children('td').eq($tdIndex);
        	var column = this.columnInfo[colIndex];
        	switch(column.columnType){
    			case YIUI.CONTROLTYPE.CHECKBOX:
    				var $chk = $td.children();
    				var isChecked = $chk.attr('isChecked') == "true" ? true : false;
    				var chkVal = value == true ? true : false;
    				if(chkVal == isChecked) break;
    				if(value) {
    					$chk.attr('isChecked', 'false');
    					$chk.removeClass("checked");
    				} else {
    					$chk.attr('isChecked','true');
    					$chk.addClass("checked");
    				}
    				break;
    			case YIUI.CONTROLTYPE.BUTTON:
    				$td.children("button").html(value);
    				break;
    			case YIUI.CONTROLTYPE.HYPERLINK:
    				$td.children("a").html(value);
    				break;
    			default:
    				$td.html(value);
        	}
        	if(column.valueChanged) {
        		var form = YIUI.FormStack.getForm(this.ofFormID);
        		form.eval(column.valueChanged, {form: form}, null);
        	}
    	}
    	
    },
    
	getValue: function(rowIndex , colIndex) {
		var dbKey = this.columnInfo[colIndex].key;
		return this.getValByKey(rowIndex, dbKey);
	},
	
    getValByKey: function(rowIndex, colKey) {
    	return this.data[rowIndex][colKey].value;
    },
    
    getRowCount: function(){
    	return this.data.length;
    },
    
    deleteRow: function(rowIndex){
        this.data.splice(rowIndex, 1);
    	var $tbody = $(".tbl-body tbody", this.$table);
    	$("tr.data", $tbody).eq(rowIndex).remove();
    	var len = this.data.length;
    	for (var i = rowIndex; i < len + 1; i++) {
    		var $tr = $("tr.data", $tbody).eq(i);
    		var index = i + 1;
    		var $td = $(".seq", $tr).html(index);
    		if(index % 2 == 0) {
    			$tr.addClass("even");
    		} else {
    			$tr.removeClass("even");
    		}
		}
    	$("tr.space", $tbody).remove();
    	this.addEmptyRow();
    },
    addNewRow: function(row){
    	this.data.push(row);
    	var newRow = [];
    	newRow.push(row);
    	this.addDataRow(newRow);
    	this.addEmptyRow();
    }

});
YIUI.reg('listview', YIUI.Control.ListView);
/**
 * 数值编辑框，主要用于输入数值类型的数据
 * 1、自定义数值精度和小数位数，例如定义数值精度为5，小数位数为2，则数值框只可以输入符号位（+-），
 * 5位数字，一个小数点，两个小数位。
 * 2、数值分组显示，如果要使用分组分隔符，则通过设置组大小以及分隔符，就可进行分割显示。
 * 例如组大小为3，分隔符为逗号，则是通常用到的千分位分割的方式，如：1,000,000.00。
 * 当然，这个组大小及分隔符可以自定义，例如组大小为4，分隔符为单引号（’），则显示如：1'0000'0000.00
 * 3、自定义小数位分隔符，例如可以定义小数位分隔符为逗号“，”,则通常10.11就会输入为10,11，而且输入框只认指定的符号
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */

(function ($) {

    YIUI.Control.NumberEditor = YIUI.extend(YIUI.Control, {

        handler: YIUI.NumberEditorHandler,
        
        behavior: YIUI.NumberEditorBehavior,
        
        decPrecision: 16,
        
        showZero: false,

        init: function (options) {
            this.base(options);

            var maxNumber = '';

            for (var i = 0; i < this.getMetaObj().decPrecision - this.getMetaObj().decScale; i++) {
                maxNumber += '9';
            }

            if (this.getMetaObj().decScale > 0) {
                maxNumber += '.';
                for (var i = 0; i < this.getMetaObj().decScale; i++) {
                    maxNumber += '9';
                }

            }

            this.settings = {
                aNum: '0123456789',
                //组分割符
                aSep: this.getMetaObj().sep,
                //组大小
                dGroup: this.getMetaObj().groupingSize,
                //小数点符号
                aDec: this.getMetaObj().decSep,
                //前缀或后缀符号
                aSign: '',
                //p是前缀 s是后缀
                pSign: 's',
                //最大值
                vMax: maxNumber,
                //最小值
                vMin: '-' + maxNumber,
                //小数位数
                mDec: this.getMetaObj().decScale,
                //四舍五入方式
                mRound: this.getMetaObj().roundingMode,

                altDec: null
            }

        },

        isNull: function() {
        	var value = this.value.toString();
        	if(value) {
        		value = parseFloat(value);
        		return value == 0 ? true : false;
        	} else {
        		return true;
        	}
        },

        /**
         * 返回值的时候
         */
        getValue: function () {
            return this.yesNumEd.getValue();
        },

        getCheckOpts: function(options) {
        	var opts = this.base(options);
        	var options = {
    			decScale: this.getMetaObj().decScale,
    			roundingMode: this.roundingMode
        	};
        	opts = $.extend(opts, options);
        	return opts;
        },

        checkEnd: function(value) {
    		this.value = value;
    		this.caption = value;
    		this.yesNumEd.setValue(value);
    	},
    	
        /**
         * 设置控件是否可编辑。
         * @param enable：Boolean。
         */
        setEnable: function (enable) {
            this.enable = enable;
            this.yesNumEd.setEnable(enable);
        },

        setBackColor: function (backColor) {
            this.yesNumEd.setBackColor(backColor);
        },

        setForeColor: function (foreColor) {
            this.yesNumEd.setForeColor(foreColor);
        },

        setFormatStyle: function (cssStyle) {
            this.yesNumEd.setFormatStyle(cssStyle);
        },

        onSetHeight: function (height) {
            this.yesNumEd.setHeight(height);
        },

        onSetWidth: function (width) {
            this.yesNumEd.setWidth(width);
        },

        /** 设置输入提示 */
        setPromptText: function (promptText) {
            this.yesNumEd.setPromptText(promptText);
        },
        
        getText: function() {
        	var text = this.base();
        	return text.toString();
        },

        getShowText: function() {
        	return $("input", this.el).val();
        },
        
        setTip: function (tip) {
            var tip = this.text;
            this.base(tip);
        },
        
        //控件处理本身的渲染形成一个完整的控件Dom对象，添加到传入的父亲Dom对象，返回该控件Dom对象的ID
        onRender: function (parent) {
            this.base(parent);
            this.el.addClass("ui-numed");
            var $this = this;
            var metaObj = this.getMetaObj();
            this.yesNumEd = new YIUI.Yes_NumberEditor({
                el: $this.el,
                value: $this.value,
                settings: $this.settings,
                required: $this.required,
                showZero: metaObj.showZero,
                selectOnFocus: metaObj.selectOnFocus,
                valueChange: function (newValue) {
                    $this.setValue(newValue, true, true);
                }
            });
            this.setValue(this.value, false, false);
            metaObj.promptText && this.setPromptText(metaObj.promptText);
            metaObj.showZero && this.setShowZero(metaObj.showZero);
        },
        
        setShowZero: function(showZero) {
        	this.showZero = showZero;
        },
        
        isShowZero: function() {
        	return this.showZero;
        },

        initDefaultValue: function (options) {
            this.base(options);
            this._input = $("input", options.el);
            if (!options.selectOnFocus) {
                this.selectOnFocus = options.selectOnFocus;
            }
            if (options.error) {
                this.setError(options.error);
            }
            if (options.decPrecision != undefined && options.decPrecision != 16) {
                this.decPrecision = options.decPrecision;
            }
            if (options.decScale != undefined && options.decScale != 2) {
                this.decScale = options.decScale;
            }
            if (options.groupingSize != undefined && options.groupingSize != 3) {
                this.groupingSize = options.groupingSize;
            }
            if (!options.useSep) {
                this.useSep = options.useSep;
            }
            if (options.sep) {
                this.sep = options.sep;
            }
            if (options.decSep) {
                this.decSep = options.decSep;
            }
            if (options.roundingMode != undefined && options.roundingMode != 0) {
                this.roundingMode = options.roundingMode;
            }
            if (options.columnKey) {
                this.columnKey = options.columnKey;
            }
            if (options.tableKey) {
                this.tableKey = options.tableKey;
            }

            var maxNumber = '';
            for (var i = 0; i < this.decPrecision - this.decScale; i++) {
                maxNumber += '9';
            }
            if (this.decScale > 0) {
                maxNumber += '.';
                for (var i = 0; i < this.decScale; i++) {
                    maxNumber += '9';
                }
            }
            this.settings = {
                aNum: '0123456789',
                //组分割符
                aSep: this.useSep ? this.sep : '',
                //组大小
                dGroup: this.groupingSize,
                //小数点符号
                aDec: this.decSep,
                //前缀或后缀符号
                aSign: '',
                //p是前缀 s是后缀
                pSign: 's',
                //最大值
                vMax: maxNumber,
                //最小值
                vMin: '-' + maxNumber,
                //小数位数
                mDec: this.decScale,
                //四舍五入方式
                mRound: this.roundingMode
            };

            $.extend(this, options);
            var $this = this;
            this.yesNumEd = new YIUI.Yes_NumberEditor({
                el: $this.el,
                isPortal: true,
                settings: $this.settings,
                required: $this.required,
                selectOnFocus: this.selectOnFocus,
                valueChange: function (newValue) {
                    $this.setValue(newValue, true, true);
                }
            });

            this.install();
        },
        focus: function () {
            this.yesNumEd && this.yesNumEd.getInput().focus();
        },
        install:function(){
            var self = this;
            this.yesNumEd.getInput().keydown(function (event) {
                var keyCode = event.keyCode || event.charCode;
                if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                    self.focusManager.requestNextFocus(self);
                    event.preventDefault();
                }
            });
        }

    });

    YIUI.reg('numbereditor', YIUI.Control.NumberEditor);
}(jQuery));/**
 * 目前显示上传的图片，需要在tomcat\conf\Catalina\localhost底下配置path.xml
 * 该文件，设置了一个虚拟路径，其内容为：
 *          <Context docBase="D:/yes/test/Config/YigoApp/Data" path="/path" reloadable="true">
 *          </Context>
 *  其中docBase为上传的图片所在服务端的路径
 * @type {*}
 */
YIUI.Control.Image = YIUI.extend(YIUI.Control, {

    sourceType: YIUI.IMAGE_SOURCETYPE.DATA,
    image: "",
    maxSize: -1,
    imageCut: false,
    stretch: false,
    handler: YIUI.ImageHandler,
    
    behavior: YIUI.ImageBehavior,

    setValue: function (value, commit, fireEvent) {
    	var sourceType = this.getMetaObj().sourceType;
    	if(!this.isNull() && sourceType == YIUI.IMAGE_SOURCETYPE.RESOURCE) return false;
        this._image.setValue(value);
        this.base(value, commit, fireEvent);
        if(!value) {
        	this._image.getImage().attr("src", YIUI.Image.EmptyImg);
        } else if (this.getMetaObj().sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
            var form = YIUI.FormStack.getForm(this.ofFormID);
            var formKey = form.formKey;
            var path = encodeURIComponent(value);
            var url = Svr.SvrMgr.AttachURL + "?path=" + path + "&formKey="+formKey+"&service=DownloadImage&mode=1&r=" + Math.random();
            this._image.getImage().attr("src", url);
            this.el.attr("formKey", formKey);
        } else if(sourceType == YIUI.IMAGE_SOURCETYPE.RESOURCE) {
        	this.setImage(value);
        }
    },
    getValue: function () {
        return this._image.value;
    },
    setSourceType: function (sourceType) {
        this.sourceType = sourceType;
        this._image.setSourceType(sourceType);
    },
    onSetHeight: function (height) {
        this.base(height);
        this._image.setHeight(height);
    },
    onSetWidth: function (width) {
        this.base(width);
        this._image.setWidth(width);
    },
    setImage: function (image) {
        this._image.setImagePath(image);
    },
    setImageCut: function (imageCut) {
        this._image.setImageCut(imageCut);
    },
    setEnable: function (enable) {
        this.enable = enable;
        this._image.setEnable(enable);
    },

    onRender: function (ct) {
        this.base(ct);
        var _this = this;
        var array = new Array("gif", "jpg", "jpeg", "png", "bmp");
        this._image = new YIUI.Yes_Image({
            el: _this.el,
            sourceType: _this.getMetaObj().sourceType,
            stretch: _this.getMetaObj().stretch,
            maxSize: _this.getMetaObj().maxSize,
            imageCut: _this.getMetaObj().imageCut,
            uploadImg: function ($this, paras) {
                var self = _this;
                var form = YIUI.FormStack.getForm(self.ofFormID);
                var submit = function (btn) {
                    var isAllowd = $.checkFile(btn, _this.getMetaObj().maxSize, array);
                    if (!isAllowd || form.OID == null || form.OID == -1) return;

                    paras = $.extend({
                        service: "UploadImage",
                        controlKey: self.key,
                        formKey: form.formKey,
                        operatorID: $.cookie("userID"),
                        fileID: -1,
                        oid: form.OID,
                        mode: 1
                    }, paras);
                    $.ajaxFileUpload({
                        url: Svr.SvrMgr.AttachURL,
                        secureuri: false,
                        fileElement: btn,
                        data: paras,
                        type: "post",
                        success: function (data, status, newElement) {
                            newElement.attr("accept", "image/*");
                            data = JSON.parse(data);
                            self.setValue(data.data.replace(/\\/g, "/"), true, true);
                        },
                        error: function (data, status, e) {
                            alert(e);
                        }
                    });
                };
                submit($this);
            },
            change: function () {
                _this.setValue("", true, true);
            }
        });
        this.el.addClass("ui-img");
        this._image.getImage().attr("alt", this.caption);
        if (this.value) {
            this.setValue(this.value, true, true);
        }
        if (this.image) {
            this.setImage(this.image);
            this.value = this.image;
        }
        if (!this.value) {
            this._image.getImage().attr("src", YIUI.Image.EmptyImg);
        }
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        this._image.getImage().css("height", this.el.innerHeight());
    },

    downPicture: function () {
        alert(123)
    },
    focus: function () {
        this.el.attr("tabIndex", this.getTabIndex());
        this.el.focus();
    },
    install: function () {
        $(this.el).unbind("click");
        var self = this;
        $("img", self.el).click(function (event) {
            if (self._image.enable) {
                if (self.isNull() && !self.image)
                    return;
                self.handler.doOnClick(self);
            }
        });
        this.el.keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.el.removeAttr("tabIndex");
                self.el.blur();
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
});
YIUI.reg('image', YIUI.Control.Image);/**
 * 单选按鈕，一组单选按钮中，只能有个一个按钮时处于选中状态。
 * name形式: ofFormID + '_' + groupKey。
 */
YIUI.Control.RadioButton = YIUI.extend(YIUI.Control, {
	/**
	 * String。
	 * 此控件由radio和label组成，因此自动创建为div。
	 */
    autoEl: '<div class="ui-rdo">',

    handler: YIUI.RadioButtonHandler,
    
    behavior: YIUI.RadioButtonBehavior,
    
    /** 
     * Boolean。
     * 是否默认选中。
     */
    checked : false,
    
    /** 
     * String。
     * 分组名称 ,名称相同，则在一个分组内。
     */
    groupKey : '',
    
    /**
     * String。
     * 单个RadioButton设置的值。
     * 区别于value。
     */
    metaValue: '',
    
    listeners: {
    	change: function() {
    		//head
    		var comp = this;
    		if(!this.getMetaObj().isGroupHead) {
    			var form = YIUI.FormStack.getForm(this.ofFormID);
    			comp = form.getComponent(this.groupHeadKey);
    		}
    		var newValue = comp.getValue();
            if (typeof newValue == "object" && newValue != null) {
                newValue = $.toJSON(newValue);
            }
            this.handler.doValueChanged(comp, newValue, true, true);
    	}
    },
    
    checkEnd: function(value) {
		this.value = value;
		if($.isDefined(value) && value){
    		var radios = $("[name="+this.ofFormID+ "_" + this.getMetaObj().groupKey+"]");
    		for (var i = 0, len = radios.length; i < len; i++) {
    			var radio = radios.eq(i);
				if(radio.val() == value) {
					radio.prop("checked", true);
			 		$(this._groKey).data(this._groKey, value);
				} 
			}
    	}
	},
	
    getValue: function() {
    	var value = $(this._groKey).data(this._groKey);
    	return value;
    },
    
    setText: function(text) {
    	$("label", this.el).html(text);
    },
    
    getText: function() {
    	return $("label", this.el).html();
    },

    setEnable: function(enable) {
    	this.enable = enable;
    	var el = $("input", this.el),
		outerEl = this.el;
    	if(this.enable) {
			el.removeAttr('disabled');
			outerEl.removeClass("ui-readonly");
		} else {
			el.attr('disabled', 'disabled');
			outerEl.addClass("ui-readonly");
		}
    },
    
    onSetHeight: function (height) {
        this.base(height);
        $("label", this.el).css({height: height + "px", lineHeight: height + "px" });
        var $input = $("input", this.el);
        $input.css("margin-top", (height - $input.height()) / 2);
    },

    onSetWidth: function(width) {
    	this.base(width);
        $("label", this.el).css("width", width - $("input", this.el).outerWidth());
    },

    setFormatStyle: function(cssStyle) {
    	$("label", this.el).css(cssStyle);
    	$("input", this.el).css(cssStyle);
	},
	
    onRender: function (ct) {
    	this.base(ct);
        var radio = $('<input id="radio_' + this.id + '" type="radio" value="' + this.getMetaObj().metaValue +
            '" name="' + this.ofFormID+ '_' + this.getMetaObj().groupKey + '">').appendTo(this.el);
        radio.prop('checked', (this.checked || false));
        this._groKey = "ui_" + this.getMetaObj().groupKey+ '_' + this.ofFormID;

        var txt = this.text.replace(/ /g, "&nbsp;");
        $('<label id=label_"' + this.id + ' for="radio_' + this.id + '">' + txt + '</label>').appendTo(this.el);
        if(this.getMetaObj().isGroupHead) {
        	var group = this._groKey;
        	$("<"+group+"/>").appendTo(this.el);
        }
        $(this._groKey).data(this._groKey, this.value);
    },
    focus: function () {
        $("input", this.el).focus();
        $("label", this.el).addClass('checked');
    },
    install : function() {
    	this.base();
    	var self = this;
        this.el.children('label').click(function(e){
            self.changeStyle();
            var oldVal = $(self._groKey).data(self._groKey);
            $(self._groKey).data(self._groKey, this.value);
            if(oldVal != this.value) {
                self.fireEvent('change', e);
            }
        });
        $("input", this.el).keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {   //Enter
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    },
    changeStyle : function(){
        var _name = this.ofFormID+ '_' + this.getMetaObj().groupKey;
        $("input[name=" + _name + "] + label").removeClass('select');
        $("label", this.el).addClass('select');
    }

});
YIUI.reg('radiobutton', YIUI.Control.RadioButton);/**
 * 文本编辑框，主要是提供文本字符类型数据输入
 * 1、可以自定义文本输入最大字符长度（默认为255），一个中文也只算一个字符，例如：12abc好12,这个为8个字符长度
 * 2、可以自定义文本显示为全大写或全小写,默认为无限制，大小写都可输入
 * 3、可以自定义不可输入字符。例如：定义不可输入字符串为：“a2v:,A”,则字符串中的字母数字符号都不可输入，键盘按键按下后都没有反应。
 * 另外，特别需要注意的是一些转义字符，例如单引号（'），双引号（"），这些转义字符定义时需要加斜杠。
 * 例如，定义为：“A?:,\'\"”，则单引号和双引号都不可输入。
 * 注意：不可输入字符区分中英文字符，比如“\"”这是英文的双引号，“\””这时中文的双引号。
 * 4、文本框失去焦点时会判断文本框是否为空值，是，则灰色显示提示文本。获取焦点时会清空提示文本，并恢复字体颜色。
 */

YIUI.Control.TextEditor = YIUI.extend(YIUI.Control, {

    autoEl: "<span></span>",

    handler: YIUI.TextEditorHandler,
    
    behavior: YIUI.TextEditorBehavior,

    /**
     * Number。
     * 允许输入的最大长度。
     */
    maxLength: Number.MAX_VALUE,

    /**
     * Number。
     * 输入字符大小写。
     */
    textCase: YIUI.TEXTEDITOR_CASE.DEFAULT,

    /**
     * String。
     * 不允许输入的字符集合。
     */
    invalidChars: null,

    /**
     * String。
     * 当输入框为空时，显示的输入提示。
     */
    promptText: null,

    /**
     * Boolean。
     * 是否去除首尾多余空格。
     */
    trim: true,

    /**
     * Boolean。
     * 光标进入默认全选。
     */
    selectOnFocus: true,

    /**
     * 掩码，为固定长度字符串。
     * 规定：
     *  9 : 任意数字，[0-9]
     *  a : 任意英文字母，[A-Za-z]
     *  * : 任意数字、英文字母，[A-Za-z0-9]
     *  _ : 控件里显示的占位符
     * 当掩码中需要包含9、a、*、\时，使用转义\9、\a、\*、\\。
     */
    mask: null,

    /**
     * String。
     * 右侧图标url。
     */
    icon: null,

    /**
     * String。
     * 左侧内嵌文本。
     */
    embedText: null,

    /**
     * 左侧图标
     */
    preIcon: null,

    /**
     * 保持焦点
     */
    holdFocus: false,

    getCheckOpts: function(options) {
    	var opts = this.base(options);
        var options = {
	        trim: this.getMetaObj().trim,
	        textCase: this.getMetaObj().textCase,
	        maxLength: this.getMetaObj().maxLength,
	        invalidChars: this.getMetaObj().invalidChars
    	};
    	opts = $.extend(opts, options);
    	return opts;
    },

    checkEnd: function(value) {
		this.value = value;
        this.yesText.setValue(value);
		this.caption = value;
        $("input", this.yesText.el).val(value);
	},

    getShowText: function() {
    	return this.value;
    },

    getValue: function () {
        return this.yesText.getValue();
    },

    /**
     * 设置控件是否可编辑。
     * @param enable：Boolean。
     */
    setEnable: function (enable) {
        this.enable = enable;
        this.yesText.setEnable(enable);
    },

    setBackColor: function (backColor) {
        this.yesText.setBackColor(backColor);
    },

    setForeColor: function (foreColor) {
        this.yesText.setForeColor(foreColor);
    },

    setFormatStyle: function (cssStyle) {
        this.yesText.setFormatStyle(cssStyle);
    },

    onSetHeight: function (height) {
        this.yesText.setHeight(height);
    },

    onSetWidth: function (width) {
        this.yesText.setWidth(width);
    },

    /**
     * input外层wrap了一层span。
     */
    getOuterEl: function () {
        return this.el;
    },

    /**
     * 处理差异
     * @param {} diffJson
     */
    diff: function (diffJson) {
        this.base(diffJson);
    },

    setTip: function (tip) {
        var tip = this.value;
        this.base(tip);
    },
    
    /**
     * 控件渲染到界面，不包含items的渲染。
     */
    onRender: function (parent) {
        this.base(parent);
        var $this = this;
        var metaObj = this.getMetaObj();
        this.yesText = new YIUI.Yes_TextEditor({
            el: $this.el,
            value: $this.value,
            required: metaObj.required,
            textCase: metaObj.textCase,
            inputType: $this.inputType,
	        trim: metaObj.trim,
            maxLength: metaObj.maxLength,
            promptText: metaObj.promptText,
            selectOnFocus: metaObj.selectOnFocus,
            invalidChars: metaObj.invalidChars,
            embedText: metaObj.embedText,
            icon: metaObj.icon,
            preIcon: metaObj.preIcon,
            valueChange: function (newValue) {
                $this.setValue(newValue, true, true);
            }
        });
        this.el.addClass("ui-txted");
        metaObj.holdFocus && this.setHoldFocus(metaObj.holdFocus);
    },
    
    setHoldFocus: function(holdFocus) {
    	this.holdFocus = holdFocus;
    },

    afterRender: function () {
        this.base();
    },

    initDefaultValue: function (options) {
        this.base(options);
        this._input = $("input", options.el);
        $.extend(this, options);
        this.invalidChars = options.invalidChars.toString();
        var $this = this;
        this.yesText = new YIUI.Yes_TextEditor({
            el: $this.el,
            isPortal: true,
            value: $this.value,
            required: $this.required,
            textCase: $this.textCase,
            inputType: $this.inputType,
            maxLength: $this.maxLength,
            promptText: $this.promptText,
            selectOnFocus: $this.selectOnFocus,
            invalidChars: $this.invalidChars,
            embedText: $this.embedText,
            icon: $this.icon,
            preIcon: $this.preIcon,
            valueChange: function (newValue) {
                $this.setValue(newValue, true, true);
            }
        });
//        if (options.maxLength) {
//            this.yesText.setMaxLength(options.maxLength);
//        }
//        if (options.preIcon) {
//            this.preIcon = options.preIcon;
//            this.yesText.setPreIcon(options.preIcon);
//        }
//        if (options.embedText) {
//            this.yesText.setEmbedText(options.embedText);
//        }
//        //设置输入框输入时遇到不可输入字符时，不允许其输入
//        if (options.invalidChars) {
//            this.yesText.setInvalidChars(options.invalidChars);
//        }
//        if (options.promptText) {
//            this.yesText.setPromptText(options.promptText);
//            this._input.placeholder(this.promptText);
//        }
//        if (!options.trim) {
//            this.trim = options.trim;
//        }
//        if (!options.selectOnFocus) {
//            this.selectOnFocus = options.selectOnFocus;
//        }
//        if (options.error) {
//            this.setError(options.error);
//        }
//        if (options.columnKey) {
//            this.columnKey = options.columnKey;
//        }
//        if (options.tableKey) {
//            this.tableKey = options.tableKey;
//        }
        var height = this.el.height();
        $(".input-embed", this.el).css('height', height + 'px');
        $(".input-embed", this.el).css('line-height', height + 'px');
        if ($.browser.isIE) {
            this._input.css('line-height', (height - 2) + 'px');
        }
        $(".input-preIcon", this.el).css('top', (this.el.height() - 16) / 2 + 'px');
        $(".input-preIcon", this.el).css('left', '10px');

        this._input.attr("value") && this.setValue(eval(this._input.attr("value"))) && this.fireEvent('change', null);
    },

    focus: function () {
        this.yesText && this.yesText.getInput().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.yesText.getInput().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {   //Enter
            	self.handler.doEnterPress && self.handler.doEnterPress(self);
                if (self.holdFocus) {
                    self.yesText.getInput().focus();
                } else {
                    self.focusManager.requestNextFocus(self);
                    event.preventDefault();
                }
            } else if (keyCode === 9) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }

});
YIUI.reg('texteditor', YIUI.Control.TextEditor);

// 掩码控件也以文字输入框实现
YIUI.reg('maskeditor', YIUI.Control.TextEditor);/**
 * 文本域，主要是提供文本字符类型数据输入
 */

YIUI.Control.TextArea = YIUI.extend(YIUI.Control, {
    
    autoEl: '<span/>',

    handler: YIUI.TextAreaHandler,
    
    behavior: YIUI.TextAreaBehavior,
    
    _input: "",

    /**
     * Number。
     * 允许输入的最大长度。
     */
    maxLength: Number.MAX_VALUE,

    checkEnd: function(value) {
    	this.value = value;
    	if (this.el) {
            this._input.val(value);
        }
    },
    
    getShowText: function() {
    	return this.value;
    },

    setTip: function (tip) {
        var tip = this._input.val();
        this.base(tip);
    },
    
    getValue: function() {
    	return this._input.val();
    },
    
    /** 
	 * 设置控件是否可编辑。
	 * @param editable：Boolean。
	 */
	setEnable : function(enable) {
		this.enable = enable;
		var el = this._input,
			outerEl = this.getOuterEl();
		if(this.enable) {
			el.removeAttr('readonly');
			outerEl.removeClass("ui-readonly");
		} else {
			el.attr('readonly', 'readonly');
			outerEl.addClass("ui-readonly");
		}
	},
	
    onSetHeight: function(height) {
    	this.el.css('height',height+'px');
    	this._input.css('height',height+'px');
//    	if($.browser.isIE) {
//    		this._input.css('line-height',(height-2)+'px');
//    	}
    },
    
    onSetWidth: function(width) {
    	this.el.css('width', width+'px');
    	this._input.css('width', width+'px');
    },
    
    /**
     * input外层wrap了一层span。
     */
    getOuterEl : function() {
    	return this.el;
    },

    /**
     * 处理差异
     * @param {} diffJson
     */
    diff: function(diffJson){
    	this.base(diffJson);
	},
	
	/** 设置允许输入的最大长度 */
	setMaxLength : function(maxLength) {
		if($.isNumeric(maxLength) && maxLength > 0) {
			this.maxLength = maxLength;

			// 默认不设置最大长度
			if(maxLength != Number.MAX_VALUE) {
				this._input.attr('maxLength', maxLength);
			}
		}
	},
    
	setFormatStyle: function(cssStyle) {
		this._input.css(cssStyle);
	},
	
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this._input.css('color', foreColor);
    },
	
    /** 
	 * 控件渲染到界面，不包含items的渲染。
	 */
    onRender: function (parent) {
        this.base(parent);
        var el = this.el;
		el.addClass("ui-txta");
		this._input = $("<textarea/>").val(this.value).appendTo(el);
		this.setMaxLength(this.getMetaObj().maxLength);
        this.setValue(this.value);
        
    },

	afterRender : function() {
		this.base();
		if(this.mask) {
			this._input.mask(this.mask);
		}
	},
	
	initDefaultValue: function(options) {
		this.base(options);
		this._input = $("input", options.el);
		
		if(!options.selectonfocus) {
			this.selectOnFocus = options.selectonfocus;
		}
		if(options.error) {
			this.setError(options.error);
		}
		
		var height = this.el.height();
    	if($.browser.isIE) {
    		this._input.css('line-height',(height-2)+'px');
    	}
    	
    },
    focus: function () {
        this._input.focus();
    },
    install: function() {
    	this.base();
    	var self = this;
    	self._input.on('click',function(event) {
    		if(self.needSelectAll) {
    			self.selectOnFocus && this.select();
    			self.needSelectAll = false;
    		}
		}).on('focusin', function(event) {
			if(self.selectOnFocus) {
				self.needSelectAll = true;
			}
		}).on('blur', function(event) {
    		var curValue = event.target.value;
            if (curValue != self.value) {
            	self.setValue(curValue, true, true);
            }
		}).on('keypress', function(event) {
			if($(this).val().length >= self.maxLength) {
				event.preventDefault();
				return true;
			}
		}).keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9) {   //Tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    	if($.browser.isIE) {
    		self._input.on('propertychange', function(event) {
    			if(this.value.length > self.maxLength) {
    				this.value = this.value.substring(0, self.maxLength);
    			}
        	});
    	}
    }

});
YIUI.reg('textarea', YIUI.Control.TextArea);
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
YIUI.reg('textbutton', YIUI.Control.TextButton);/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-4-23
 * Time: 上午10:51
 * 状态栏
 */
YIUI.Control.StatusBar = YIUI.extend(YIUI.Control, {
    /** HTML默认创建为label */
    autoEl: '<div></div>',
    /** 完成StatusBar的渲染 */
    onRender: function (ct) {
        this.base(ct);
    }
});
YIUI.reg('statusbar', YIUI.Control.StatusBar);/**
 * TreeView。
 * 以table实现的树，可单列，可多列。
 */
(function() {
// 自动生成节点id
var nodeId = 0;
function getId() {
	return 'n-' + (++nodeId);
}

YIUI.Control.TreeView = YIUI.extend(YIUI.Control, {
	/** HTML默认创建为label */
	autoEl: '<div></div>',
	
	selectId: null,
	
	/** 
	 * String。
	 * 加载数据的url，优先于data。
	 */
	dataUrl : null,
	
	/** 
	 * Array。
	 * 真实数据，如果指定了dataUrl，忽略data中定义的数据。
	 */
	data : null,
	
	/** 
	 * Object。
	 * 根节点。
	 */
	root : null,
	
	/**
	 * Array。 
	 * 列信息。
	 */
	colModel : null,
	
	/**
	 * Boolean。
	 * 是否支持列宽拖动。
	 */
	enableColumnResize : true,
	
	/**
	 * 未指定列宽时的默认宽度。
	 */
	defaultWidth : 100,
	
	_$table : null,
	/**
	 * 表格选中模式  0单元格选 1行选
	 */
	selectionModel : 1,
	
	init : function(options) {
		this.base(options);
		this.dataUrl = '';
		var treeview = this;
		treeview.loadedNodes = {};
		this.option = {
			theme : 'default',
			expandLevel : 2,
			beforeExpand : function($table, id) {
				if(!treeview.loadedNodes[id]) {
					
					YIUI.EventHandler.doExpand(treeview, id || 0);
					
					//var rows = treeview.loadChildren(id);
					//var html = treeview.createRowsHtml(rows);
					//$table.addChilds(html);
					treeview.loadedNodes[id] = true;
				}
			},
			onSelect : function($table, id) {
				$('#' + treeview.selectId, $table).removeClass("trchekedstyle");
				//console.log('onSelect: ' + id);
				var $tr = $('#' + id, $table);
				$tr.addClass('trchekedstyle');
				var rowIndex =  $tr.index();
				YIUI.EventHandler.doOnClick(treeview, id || 0);
				treeview.selectId = id;
			}
		};
		
		this.data = options.data.addedNodes;
		if(this.data == undefined){
			this.data = {};
		}

	},
	
	/** 
	 * 完成渲染。
	 */
	onRender: function (ct) {
		this.base(ct);
		
		this.el.addClass('treeview');
		
		this._$table = $('<table cellpadding="0" cellspacing="0"></table>').appendTo(this.el);
		
		
		var tr = $('<tr ></tr>').appendTo(this._$table),
			colModel = this.colModel,
			col, i, len, width;
		
		for (i=0,len=colModel.length;i<colModel.length;i++) {
			col = colModel[i];
			width = col.width || this.defaultWidth;
			$('<col></col>').attr('width', width).prependTo(this._$table);
			$('<th>' + col.caption + '</th>').appendTo(tr);
		}
		
		if(this.root) {
			var rootTr = this.createRow(this.root);
			rootTr.attr('isLastOne', true);
			this._$table.append(rootTr);		
		}
		
		this._$table.treeTable(this.option);
		
		var html = this.createRowsHtml(this.data);
		
		this._$table.addChilds(html);

	},
	
	// private
	createRow : function(rowdata) {
		
       
		//rowdata.id = rowdata.id || getId();
		var tr = $('<tr id="'+rowdata.id+'"></tr>'),
			colModel = this.colModel;
		
		if(rowdata.pid != undefined ){
			tr.attr('pId', rowdata.pid);
		}
			
		if(rowdata.expand != undefined && rowdata.expand){
			tr.attr('hasChild', true);
		}
		
		if(rowdata.previd != undefined){
			tr.attr('prevId', rowdata.previd);
		}
		
		if(rowdata.islast != undefined && rowdata.islast){
			tr.attr('isLastOne', true);
		}
		var value;
		for (var j=0,len=colModel.length;j<len;j++) {
			value = rowdata[colModel[j].key];
			if(!value){
				value = '';
			}
			$('<td>' + value + '</td>').appendTo(tr);
		}
		
		return tr;
	},
	
	// private
	createRowsHtml : function(rows) {
		var html = '';
		for(var i=0,len=rows.length;i<len;i++) {
			html += this.createRow(rows[i])[0].outerHTML;
		}
		return html;
	},
	
	/**
	 * 根据dataUrl加载所有下层子节点。
	 * @param pid 父节点id。
	 * @return Array。所有子节点的数组。
	 */
	/*
	loadChildren : function(pid) {
		var children;
		$.ajax({
			url : SvrMgr.ServletURL,
			
			//{Service: SvrMgr.Service.DealWithEvent, FormID: formID,
            //    EventType: eventType, ControlKey: controlKey, ExtParas: extParas});
                
			data : {
				Service : SvrMgr.Service.DealWithEvent,
				FormID : this.ofFormID,
				EventType :  SvrMgr.EventType.Expand,
				ControlKey : this.key,
				ExtParas :  pid || 0
			},
			
			method : 'get',
			dataType : 'json',
			async : false,
			success : function(result) {
				children = result.data;
			}
		});
		
		$.each(children, function() {
			this.pid = this.pid || pid;
		});
		return children;
	},*/
	
	initDefaultValue: function(options) {
    	this.base(options);
    	this._$table = $("table", this.el);
    },
	
	install: function () {
		this.base();
				
		this.enableColumnResize && this.addColumnResize();
		
	},
	
	// 处理差异
	diff: function(diffJson){
		var treeView = this;
		this.base(diffJson,function(name,value){
			if(name == 'data'){
								
				if(value.deletedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.deleteNodes(value.deletedNodes);
				}
				
				if(value.addedNodes){
				//	this.addNodes(diffJson.data['addedNodes']);
					this.addNodes(value.addedNodes);
				}
				
				if(value.focusedNode){
					treeView.focusNode(value.focusedNode);
				}
			}

		});
	

	},
	focusNode: function(id){
		var $tr = $('#' + id, this._$table);
		if($tr){		
			$('#' + this.selectId, this._$table).removeClass("trchekedstyle");
	
			$tr.addClass('trchekedstyle');	
			this.selectId = id;
		}
		
	},
	
	// 删除节点
	deleteNodes: function(nodes){
		if(nodes == undefined){
			return;
		}
		this._$table.deleteChilds(nodes);
	},
	
	// 添加节点
	addNodes: function(nodes){
		if(nodes == undefined){
			return;
		}
		
		var html = this.createRowsHtml(nodes);
		
		this._$table.addChilds(html);
		//this.loadedNodes[id] = true;
	},
	
	// private 添加列宽拖动支持
	addColumnResize : function() {

		var colModel = this.colModel,
			row = this.el.find('tr:first-child'),
			cells = row.children(),
			left = 0;
			
		//this.$handleContainer = $("<div class='rc-handle-container'/>");
		
		var $handleContainer = $('<div class="treeview-resizer-container">');
		
		this._$table.before($handleContainer);
		
		var _this = this;
		
        function syncHandleWidths(a){
			//var _this = this;

	        $handleContainer.width(_this._$table.width());
	        $handleContainer.find('.treeview-resizer').each(function (_, el) {
	
	            return $(el).css({
	                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - $handleContainer.offset().left),
	                height: _this._$table.height()
	
	            });
	
	        });
		};
						
		this._$table.find('tr th').each(function (i, el) {
            var $resizer;

            $resizer = $("<div class='treeview-resizer' />");
            $resizer.data('th', $(el));
            $resizer.bind('mousedown', function (e) {
                var $currentGrip , $leftColumn  , leftColumnStartWidth , tableWidth ;

                e.preventDefault();

                var startPosition = e.pageX;

                $currentGrip = $(e.currentTarget);

                $leftColumn = $currentGrip.data('th');

                leftColumnStartWidth = $leftColumn.width();

                tableWidth = _this._$table.width();
				
                $(document).on('mousemove.rc', function (e) {
                    var difference , newLeftColumnWidth;
                    difference = e.pageX - startPosition;
                    newLeftColumnWidth = leftColumnStartWidth + difference;

                    $leftColumn.width(newLeftColumnWidth);
                    //console.log('mousemove: ' + _this._$table.width() + 'difference:'+difference + ' newLeftColumnWidth:'+newLeftColumnWidth)
                   _this._$table.width(tableWidth+difference);
                    return 	syncHandleWidths(newLeftColumnWidth);	
  


                });

                return $(document).one('mouseup', function () {
                    $(document).off('mousemove.rc');
                });

            });
            
            return $resizer.appendTo($handleContainer);

        });
        
        syncHandleWidths();
		/*	
		for(var i=0,len=colModel.length;i<len;i++) {
			var resizer = $('<div class="treeview-resizer"></div>').attr('index', i).appendTo(this.el);
			
			left += cells[i].clientWidth;
			resizer.css('left', left + 'px');
		}
		
		var treeview = this,
			startPos, endPos, startWidth, index, cell, startLeft;
			
			
		function mousedownFn(event) {
			var target = $(event.target);
			if(target.hasClass('treeview-resizer')) {
				event.preventDefault();
				startPos = event.pageX;
				index = target.attr('index');
				cell = $(cells[index]);
				startWidth = cell.width();
				startLeft = parseInt(target.css('left'));
				$(document).on('mousemove', mouseoverFn).one('mouseup', mouseupFn);
			}
		}
		function mouseoverFn(event) {
			var endPos = event.pageX;
			cell.width(startWidth + endPos - startPos);
		}
		function mouseupFn(event) {
			var target = $(event.target),
				endPos = event.pageX,
				resizers = treeview.el.find('.treeview-resizer'),
				resizer;
			for(var i=index,len=resizers.length;i<len;i++) {
				resizer = $(resizers[i]);
				resizer.css('left', (parseInt(resizer.css('left')) + endPos - startPos) + 'px');
			}
			
			$(document).off('mousemove', mouseoverFn);
		}
		
		function syncHandleWidths(){
			var _this = this;

	        this.$handleContainer.width(this.$table.width());
	        this.$handleContainer.find('.rc-handle').each(function (_, el) {
	
	            return $(el).css({
	                left: $(el).data('th').outerWidth() + ($(el).data('th').offset().left - _this.$handleContainer.offset().left),
	                height: _this.$table.height()
	
	            });
	
	        });
		}
		
		this.el.on('mousedown', mousedownFn);*/
	}
	
});
YIUI.reg('treeview', YIUI.Control.TreeView);
})();/**
 * 密码输入框。
 * 继承自TextEditor。
 */
YIUI.Control.PasswordEditor = YIUI.extend(YIUI.Control.TextEditor, {

	/**
	 * String。
	 * 自动创建为type为password的input。
	 */
    inputType: 'password',

    handler: YIUI.PasswordEditorHandler,
    
    initDefaultValue: function(options) {
		this.el = options.el;
		this._input = $("input", options.el);
		
		if(options.preicon) {
			this.setPreIcon(options.preicon);
		}
		if(options.embedtext) {
			this.setEmbedText(options.embedtext);
		}
		if(!options.selectonfocus) {
			this.selectOnFocus = options.selectonfocus;
		}
		if(options.error) {
			this.setError(options.error);
		}
    }
});
YIUI.reg('passwordeditor', YIUI.Control.PasswordEditor);/**
 * Created with IntelliJ IDEA.
 * User: zhufw
 * Date: 14-3-20
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

YIUI.Tree = YIUI.extend(YIUI.Control, {

	/** HTML默认创建为label */
	autoEl: '<div></div>',
	/** 菜单样式 */
    menuType: YIUI.TREEMENU_TYPE.GROUPTREE,
    
    _data: [],
    
    rootEntry: [],
    /** 根节点 */
    rootNode: null,
    /** 父子节点是否关联 */
    independent: true,
    /** 已选中节点的id */
    selectedNodeId: null,
    /** 是否为动态加载数据 */
    isAsyncNodes: true,
    /** 汇总节点是否展开 */
    _isOpen: false,
    /** 已选中汇总节点 */
    _openedItem: null,
    
    container: null,
    
    handler: YIUI.TreeHandler,
    
    initDataSource : function(dataSource) {
    	if(dataSource) {
    		this.isAsyncNodes = false;
    		if(!dataSource.length) {
    			dataSource = $(dataSource);
    		}
    		var data;
    		for (var i = 0, len = dataSource.length; i < len; i++) {
				data = dataSource[i];
				if(!data.id) {
					data.id = data.key + i;
				}
				if(data.children) {
					data.isParent = true;
					this.initDataSource(data.children);
				}
			}
    	}
    },
    init: function(options) {
    	this.base(options);
    	var self = this;
    	this.menuType = this.rootEntry.style || YIUI.TREEMENU_TYPE.GROUPTREE;
    	self.initDataSource(this.rootEntry);
    	self._data = [];
    	self.callback = $.extend({
			beforeExpand: $.noop,
			onSelect: function($this, $tree, node){
				if(node.children) {
					if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
						$("#" + node.id + " span.treemenu-icon").click();
					} else if(self.menuType == YIUI.TREEMENU_TYPE.TREE) {
						if($("#" + node.id).attr("open")) {
							self.clickEvent.collapse($this, self, null);
							$("#" + node.id).attr("open", false);
							$(this).removeClass("curSelectedNode");
							$(this).parent().removeClass("selected");
						} else {
							self.clickEvent.expandNode($this, self, null);
							$("#" + node.id).attr("open", true);
							$(this).addClass("curSelectedNode");
							$(this).parent().addClass("selected");
						}
					}
				} else {
					self.handler.doTreeClick(node, container);
				}
			}
    	}, options.callback);
    	self.clickEvent = {
			expandNode: function($this, self, $tree) {
	    		var nodeId = $this.attr("id");
	    		var node = self.getTreeNode(nodeId);
	    		self.callback.beforeExpand(node);
	    		var expandNode = node.id + "-" + self.el.attr("id");
	    		if(!node.isLoaded) {
	    			node.isLoaded = true;
	    		}
	    		if($this.parent().hasClass("top-level")) {
	    			if(self._openedItem && $this.attr("id") != self._openedItem.attr("id")) {
	    				self._openedItem.removeClass("open").addClass("close");
		    			self._openedItem.next().hide();
		    			self._openedItem.removeClass("curSelectedNode");
		    			self._openedItem.parent().removeClass("selected");
		    			if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
			    			$(".tree-expand", self._openedItem).removeClass("tree-expand").addClass("tree-collapse");
			    			$(".tree-explore", self._openedItem).removeClass("tree-explore-expand").addClass("tree-explore-collapse");
		    			} else {
		    				$(".tree.expand", self._openedItem).removeClass("expand").addClass("collapse");
		    			}
		    		}
		    		self._openedItem = $this;
	    		}
	    		$this.next().show();
	    		$this.removeClass("close").addClass("open");
				$this.addClass("curSelectedNode");
				$this.parent().addClass("selected");
	    		if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
    				$(".tree-collapse", $this).removeClass("tree-collapse").addClass("tree-expand");
    				$(".tree-explore", $this).removeClass("tree-explore-collapse").addClass("tree-explore-expand");
	    		} else {
	    			$(".tree.collapse", $this).removeClass("collapse").addClass("expand");
	    		}
	    	},
	    	collapse: function($this, self, $tree) {
	    		$this.removeClass("open").addClass("close");
	    		$this.next().hide();
	    		$this.removeClass("curSelectedNode");
	    		$this.parent().removeClass("selected");
	    		if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
    				$(".tree-expand", $this).removeClass("tree-expand").addClass("tree-collapse");
    				$(".tree-explore", $this).removeClass("tree-explore-expand").addClass("tree-explore-collapse");
	    		} else {
	    			$(".tree.expand", $this).removeClass("expand").addClass("collapse");
	    		}
	    	},
	    	
	    	selectNode: function($this, self, $tree) {
	    		var id = $this.attr("id");
	    		var treeId = self.el.attr("id");
	    		if(self.selectedNodeId) {
	    			$("#" + self.selectedNodeId).removeClass("clicked");
	    			$("#" + self.selectedNodeId).prev().removeClass("tree-wholerow-clicked");
	    			$("#" + self.selectedNodeId).parent().removeClass("clicked");
	    		}
	    		self.selectedNodeId = id;
	    		$("#" + id).addClass("clicked");
	    		$("#" + id).prev().addClass("tree-wholerow-clicked");
	    		$("#" + id).parent().addClass("clicked");
	    		self.callback.onSelect($this, $("#" + treeId), self.getTreeNode(id));
	    	}
		};
    },
    
    dataSourceCopy: function(dataSource){
    	if(dataSource) {
    		if(!dataSource.length) {
    			dataSource = $(dataSource);
    		}
    		for (var i = 0, len = dataSource.length; i < len; i++) {
    			var ds = dataSource[i];
    			var parent = ds.parent;
    			var d = new Object();
    			d.name = ds.name;
    			d.id = ds.id;
    			d.itemKey = ds.itemKey;
    			d.layerItemKey = ds.layerItemKey;
    			if(ds.isLoaded) {
    				d.isLoaded = ds.isLoaded;
    			} else {
    				d.isLoaded = false;
    			}
    			if(ds.children && ds.children.length > 0) {
    				d.open = ds.open;
    				var children = [];
    				for (var j = 0, length = ds.children.length; j < length; j++) {
    					var child = ds.children[j];
    					children.push(child.id);
    					this.dataSourceCopy($(child));
    				}
    				d.children = children;
    			} else {
    				d.key = ds.key;
    				d.formKey = ds.formKey;
    			}
    			if(ds.parent) {
    				d.parentId = ds.parent.id;
    			}
    			this._data.push(d);
    		}
    	}
    },
    
    changeDataType: function(dataSource) {
    	var cdata = [];
    	var newObject = $.grep(dataSource, function(n, i) {
    		return typeof(n.parentId) == "undefined" ? n : null;
    	});
    	for (var i = 0; i < newObject.length; i++) {
			var data = $.extend(true, {}, newObject[i]);
			cdata.push(data);
			this.changeData(data);
		}
    	this.rootEntry = cdata;
    },
    
    changeData: function(cdata) {
		if(cdata.children) {
			for (var i = 0, len = cdata.children.length; i < len; i++) {
				var childnode = $.extend(true, {}, this.getTreeNode(cdata.children[i]));
				cdata.children.splice(i, 1, childnode);
				if(childnode.children) {
					this.changeData(cdata.children[i]);
				}
			}
		}
    },
    
    /** 构建树结构 */
    buildTreenode: function(nodes, parentId) {
    	if(!nodes) {
    		return;
    	}
    	if(!nodes.length) {
    		if(!parentId) {
    			nodes = nodes.children;
    		}
    	}
    	this.addChilds(nodes, parentId, 0);
    },
    
    addChilds: function(nodes, parentId, level) {
    	if(nodes.length <= 0) {
    		if(parentId) {
    			$("#" + parentId, this.el).next().remove();
    			$("#" + parentId, this.el).children().first().removeClass("tree-collapse");
    		}
    		return;
    	}
		var node, nid;
		if(parentId) {
			var parentNode = this.getTreeNode(parentId);
			parentNode.children = [];
		}
		for (var i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];
			nid = node.id;
			node.parentId = parentId;
			
			var _li = $("<li class='treemenu tree-node' level='"+level+"'></li>");
			if(!node.parentId) {
				_li.addClass("top-level");
			}
			if(parentId) {
				parentNode.children.push(nid);
				_li.appendTo($("#" + parentId, this.el).next());
				var childLength = $("#" + parentId, this.el).next().children().length;
			} else {
				_li.appendTo(this.el);
			}
	        var _a = $("<a id='"+ nid +"' class='tree-anchor'></a>").appendTo(_li),
	        _ul, _span, _spanLeft;
	        
	        if(node.isParent) {
            	_li.addClass("isParent");
	            _spanLeft = $("<span class='tree'></span>");
            	_ul = $("<ul class='tree-ul'></ul>");
            	_span = $("<span class='treemenu-icon'/>");
	            if(node.open && !this._isOpen && !node.parentId) {
	            	_li.addClass("selected");
	            	_a.addClass("curSelectedNode open").attr("open", true);
	            	_span.addClass("tree-expand");
	            	this._isOpen = true;
	            	this._openedItem = _a;
	            	_spanLeft.addClass("expand");
	            } else {
	            	_a.attr("open", false).addClass("close");
	            	_ul.css("display", "none");
	            	_span.addClass("tree-collapse");
	            	_spanLeft.addClass("collapse");
	            }
	            _ul.appendTo(_li);
	            _explore = $("<span class='tree-explore'/>");
	            if(this.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
	            	_span.appendTo(_a);
	            	_explore.appendTo(_a);
	            	if(node.icon) {
	            		_explore.css("background-image",  "url(Resource/"+node.icon+")" );
	            	}
	            } else {
	            	_spanLeft.appendTo(_a);
	            }
	        }
	        $("<span class='treenode-name'>" + node.name + "</span>").appendTo(_a);
	        if(this.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
	        	if(level > 0) {
		        	_a.css("padding-left", (level-1)*20+50);
		        }
	        } else {
	        	_a.css("padding-left", level*20);
	        }
	        if(node.children) {
                 this.addChilds(node.children, node.id, level+1);
	        } else {
	        	_a.addClass("noExpand");
	        }
		}
    },
    
    removeChilds: function(nodeId) {
    	$("#" + nodeId).parent().remove();
    	this.removeNode(nodeId);
    },
    
    removeNode: function(nodeId) {
    	for (var i = 0, len = this._data.length; i < len; i++) {
			var treenode = this._data[i];
			if(treenode.id == nodeId) {
				if(treenode.parentId) {
					var parent = this.getTreeNode(treenode.parentId);
					parent.children = $.map(parent.children, function(n, i) {
						return n != treenode.id ? n : null;
					});
				} else if(treenode.children) {
					this._data.splice(i,1);
					for (var j = 0, length = treenode.children.length; j < length; j++) {
						this.removeNode(treenode.children[j]);
					}
					break;
				} else {
					this._data.splice(i,1);
					break;
				}
			}
		}
    },

    onRender: function (ct) {
    	this.base(ct);
    	this.el.addClass("treemenu treemenu-content");
    	
    	var id = this.el.attr("id");
    	this.dataSourceCopy(this.rootEntry);
        this.buildTreenode(this.rootEntry, null);
    	
    	switch (this.menuType) {
        case  YIUI.TREEMENU_TYPE.TREE:
            break;
        case  YIUI.TREEMENU_TYPE.GROUPTREE:
            this.el.addClass('treemenu-grouptree');
            break;
    	}
    },
    
    install : function() {
    	var self = this;
    	$("a", self.el).bind("click", function(e) {
    		if($(this).hasClass("open")) {
    			self.clickEvent.collapse($(this), self, null);
    			return;
    		}
    		if($(this).hasClass("close")) {
    			self.clickEvent.expandNode($(this), self, null);
    			return;
    		}
    		if($(this).hasClass("noExpand")) {
    			self.clickEvent.selectNode($(this), self, null);
    			return;
    		}
    	});
	},
	
	getTreeNode: function(nodeId) {
		for (var i = 0, len = this._data.length; i < len; i++) {
			if(this._data[i].id == nodeId) {
				return this._data[i];
			}
		}
	},
	
	setRootNode: function(rootNode){
		this.rootNode = rootNode;
	},
	
	getRootNode: function() {
		return this.rootNode;
	}
	
});
YIUI.reg('tree', YIUI.Tree);
/**
 * 附件管理控件。
 */
YIUI.Control.Attachment = YIUI.extend(YIUI.Control, {
	/**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',

    handler: YIUI.AttachmentHandler,

    //操作者ID
    _operatorID: null,

    //上传附件的最大尺寸
    maxSize: 1024,

    width: 1500,

    onRender: function (ct) {
        this.base(ct);
        this._operatorID = $.cookie("userID");
        this.el.addClass('ui-att');
        var _thead = $('<thead></thead>');
        var _tbody = $('<tbody></tbody>');

        this.$att_tbl = $('<table class="att-tbl"></table>').appendTo(this.el);

        var $tr_h = $('<tr class="tr-head"></tr>').appendTo(this.$att_tbl);
        var $td_h = $('<td class="out"></td>').appendTo($tr_h);
        var $div_h = $('<div class="head"></div>').appendTo($td_h);
        var $head = $('<table class="tbl-head"></table>').append(_thead).appendTo($div_h);
        
        var $tr_b = $('<tr class="tr-body"></tr>').appendTo(this.$att_tbl);
        var $td_b = $('<td class="out"></td>').appendTo($tr_b);
        var _body = $("<div class='body'></div>").appendTo($td_b);
        this.$table = $('<table border="1" class="tbl-body"></table>').append(_tbody).appendTo(_body);
        $("<span class='space'></span>").appendTo(_body);
        

        var $tr_f = $('<tr class="tr-foot"></tr>').appendTo(this.$att_tbl);
        var $td_f = $('<td class="out"></td>').appendTo($tr_f);
        var $div_f = $('<div class="foot"></div>').appendTo($td_f);
        $('<table border="1" class="tbl-foot"></table>').appendTo($div_f);
        
    	this.createColumns();
    	this.loadAttachment();
    },

    onSetHeight: function(height) {
    	this.base(height);
    	var $height = height - $(".tbl-head", this.el).outerHeight() - $(".tbl-foot", this.el).outerHeight();
    	$(".body", this.el).height($height);
    	this.addEmptyRow();
    	
    	$(".ui-resizer", this.el).height($(".tbl-head", this.el).outerHeight() + $(".body", this.el)[0].clientHeight);
    },

    onSetWidth: function(width) {
    	this.base(width);
    	var leftW = width - this.getPlaceholderWidth();
    	var placeW = this.placeW = $.getReal("100%", leftW);
    	if(placeW > 0) {
        	$(".tbl-head td.empty", this.el).outerWidth("100%");
        	$(".body tr.first td.empty", this.el).outerWidth("100%");
    	}
    	this.fileBtn.css("left", width/2);
    },

    getPlaceholderWidth: function() {
    	var tds = $(".tbl-head td", this.el), td, width = 0;
    	for (var i = 0, len = tds.length; i < len - 1; i++) {
			td = tds.eq(i);
			width += td.outerWidth();
		}
    	return width;
    },

    setEnable: function(enable) {
    	this.enable = enable;
		var el = this.getEl(),
			outerEl = this.getOuterEl();
		var btns = $(".btn:not([class~='view']):not([class~='download'])", el);
		if(this.enable) {
			outerEl.removeClass("ui-readonly");
			btns.removeAttr("disabled");
			$(".fup", el).removeAttr("disabled");
		} else {
			outerEl.addClass("ui-readonly");
			btns.attr("disabled", "disabled");
			$(".fup", el).attr("disabled", "disabled");
		}
    },

    createColumns: function(){
		var $resizer = $("<div class='ui-resizer' />").prependTo(this.el);
    	var $thead = $(".tbl-head", this.el).children("thead");
		var $tr = $('<tr></tr>'),$th;
	    $('<td><label>附件名称</label><span class="att-handler"></span></td>').appendTo($tr);
	    $('<td><label>上传时间</label><span class="att-handler"></span></td>').appendTo($tr);
	    $('<td><label>上传人</label><span class="att-handler"></span></td>').appendTo($tr);
	    $('<td><label>附件路径</label><span class="att-handler"></span></td>').appendTo($tr);
	    $('<td><label></label></td>').appendTo($tr);
	    if(this.getMetaObj().preview) {
	    	$tr.addClass("hasView");
	    	$('<td class="opt_left"><label>操</label></td>').appendTo($tr);
	    	$('<td class="opt_right"><label>作</label></td>').appendTo($tr);
	    } else {
	    	$('<td><label>操作</label></td>').appendTo($tr);
	    }
	    $('<td><label></label></td>').appendTo($tr);
	    $('<td class="empty"><span/></td>').appendTo($tr);
		$thead.append($tr);

		var $tfoot = $('.tbl-foot', this.el);
		var btn = $("<input class='btn fileBtn' type='button' value='上传'>");
		var fileBtn = this.fileBtn = $("<input type='file' name='file' data-url='upload' class='fup'>").data("fileID", -1);
		$('<td colspan="7"></td>').append(btn).append(fileBtn).appendTo($('<tr></tr>')).appendTo($tfoot);
		

    	var $tbody = this.$table.children('tbody');
		var $tr_f = $('<tr class="first"></tr>');
		$('<td class="name"></td>').appendTo($tr_f);
		$('<td class="time"></td>').appendTo($tr_f);
		$('<td class="operator"></td>').appendTo($tr_f);
		$('<td class="path"></td>').appendTo($tr_f);
		//下载
		$('<td class="download"></td>').appendTo($tr_f);
		//删除
		$('<td class="delete"></td>').appendTo($tr_f);
		$('<td class="upload"></td>').appendTo($tr_f);
		if(this.getMetaObj().preview) {
			$tr_f.addClass("hasView");
			$('<td class="view"></td>').appendTo($tr_f);
		}
		$('<td class="empty"></td>').appendTo($tr_f);
		$tbody.append($tr_f);
    },

    loadAttachment: function() {
    	this.$table.children('tbody tr').not(".first").remove();
        var form = YIUI.FormStack.getForm(this.ofFormID);
        var tbl;
        var callback = function(msg) {
        	tbl = msg;
        };
    	Svr.Request.getSyncData(Svr.SvrMgr.AttachURL, {service: "LoadAllAttachment", oid: form.OID,formKey:form.formKey}, callback)
    	this.addAttachment(tbl);
    },
    
    addAttachment: function(tbl) {
    	var $tbody = this.$table.children('tbody');
    	var $tr, $td, self = this;
    	if(tbl && tbl.size() > 0) {
    		var $first = $("tr.first", $tbody);
    		for (var i = 0, len = tbl.size(); i < len; i++) {
    			tbl.setPos(i);
    			var time = tbl.getByKey(YIUI.Attachment_Data.UPLOAD_TIME);
    			var date = new Date(parseInt(time));
    			date = YIUI.DateFormat.format(date);
    			var uploadName = tbl.getByKey(YIUI.Attachment_Data.UPLOAD_NAME);
    			var path = tbl.getByKey(YIUI.Attachment_Data.PATH);
    			var name = tbl.getByKey(YIUI.Attachment_Data.NAME);
    			var oid = tbl.getByKey(YIUI.Attachment_Data.OID);
    			
				$tr = $('<tr></tr>');
				$('<td>' + name + '</td>').appendTo($tr);
				$('<td>' + date + '</td>').appendTo($tr);
				$('<td>' + uploadName + '</td>').appendTo($tr);
				$('<td>' + path + '</td>').appendTo($tr);
				//下载
				$('<td></td>').appendTo($tr).append($("<input class='btn download' type='button' value='下载'>").data("fileID", oid).data("path",path));
				//删除
				$('<td></td>').appendTo($tr).append($("<input class='btn del' type='button' value='删除'>").data("fileID", oid));
				$('<td></td>').appendTo($tr).append($("<input class='btn upd' type='button' value='上传'>"))
											.append($("<input type='file' name='file' data-url='upload' class='btn upd fup'>").data("fileID", oid));
				if(this.getMetaObj().preview) {
					$tr.addClass("hasView");
					$('<td></td>').appendTo($tr).append($("<input class='btn view' type='button' value='预览'>").data("fileID", oid));
				}
				$('<td></td>').addClass("empty").appendTo($tr);
				$tbody.append($tr);
			}
    	}
    	
    },
    
    addEmptyRow: function() {
    	var $body = $(".body", this.el);
    	var $head = $(".head", this.el);
    	var $span = $body.children("span");
    	if(!this.items || this.items.length == 0) {
    		var lbl = $("label.empty", $span).remove();
    		if($("tr", $body).not(".first").length == 0) {
				lbl = $("<label class='empty'>表中无内容</label>");
				$span.append(lbl);
        		var width = $(".head tr", this.el).width();
        		var top = ($body.height() - lbl.height()) / 2;
        		lbl.width(width).css({
        			"top": top + "px",
        			"padding-left": $span.width()/2 + "px"
        		});
    		}
    	}
    	var $space = $(".body span.space", this.el);
    	$space.outerHeight($body[0].clientHeight - $body.outerHeight());
    	if($body[0].clientWidth != $body[0].scrollWidth) {
    		var scroll_w = $body.width() - $body[0].clientWidth;
    		if($("td.empty", $head).width() < scroll_w) {
    			$("td.empty", $head).outerWidth(scroll_w);
    			$("tr.first td.empty", $body).outerWidth(0);
    		}
    	} else {
    		$("td.empty", $head).outerWidth("100%");
    		$("tr.first td.empty", $body).outerWidth("100%");
    	}
    },

    uploadFile: function ($this, fileID) {
    	var self = this;
        var form = YIUI.FormStack.getForm(self.ofFormID);
        var submit = function (btn) {

        	var isAllowd = $.checkFile(btn, self.getMetaObj().maxSize);
        	if(!isAllowd) return;
        	var rowIndex = btn.parents("tr").eq(0).index() - 1;
        	$.ajaxFileUpload({
                url: Svr.SvrMgr.AttachURL,
                secureuri: false,
                fileElement: btn,
                data: {service:"UploadAttachment",formKey: form.formKey, operatorID: self._operatorID, fileID: fileID, oid: form.OID, mode: 1},
                type: "post",
                success: function (data, status, newElement) {
                	newElement.data("fileID", fileID);
                	data = JSON.parse(data);
                	var tbl = YIUI.DataUtil.fromJSONDataTable(data);
                    if(fileID != -1) {
                    	var _tds = newElement.parents("tr").eq(0).children();

            			var time = tbl.getByKey(YIUI.Attachment_Data.UPLOAD_TIME);
            			var date = new Date(parseInt(time));
            			date = YIUI.DateFormat.format(date);
            			var uploadName = tbl.getByKey(YIUI.Attachment_Data.UPLOAD_NAME);
            			var path = tbl.getByKey(YIUI.Attachment_Data.PATH);
            			var name = tbl.getByKey(YIUI.Attachment_Data.NAME);
            			
                    	_tds.eq(0).text(name);
                    	_tds.eq(1).text(date);
                    	_tds.eq(2).text(uploadName);
                    	_tds.eq(3).text(path);
                    } else {
                        self.addAttachment(tbl);
                        self.addEmptyRow();
                    }
                },
                error: function (data, status, e) {
                        alert(e);
                }
            });
        };
    	if(form.OID) {
            submit($this);
        } else {
        	alert("新增状态无法进行上传操作！");
        }
    },

    focus: function () {
        $(".btn.fileBtn",this.el).focus();
    },

    install: function () {
        var self = this;
        self.$table.delegate('.download', 'click', function(event){
        	var target = $(event.target);
        	var fileID = target.data("fileID");
            var path = target.data("path");
        	var form = YIUI.FormStack.getForm(self.ofFormID);
        	location.href = Svr.SvrMgr.AttachURL + "?fileID=" + fileID + "&path="+ path +"&formKey=" + form.formKey + "&mode=1&service=DownloadAttachment";
        });
        self.el.delegate('.tbl-body .upd, .tbl-foot .fileBtn', 'click', function(event){
        	var target = $(event.target);
        	target.next().click();
        });
        self.$table.delegate('.del', 'click', function(event){
        	var target = $(event.target);
        	var fileID = target.data("fileID");
        	var form = YIUI.FormStack.getForm(self.ofFormID);
        	self.handler.doDeleteAttachement(self, fileID, form.formKey);
        	var rowIndex = target.parents("tr").eq(0).index() - 1;
        	$(this).parents("tr").eq(0).remove();
        	self.addEmptyRow();
        });

        self.el.delegate('.fup', 'change', function(event) {
        	self.uploadFile($(this),$(this).data("fileID"));
        });

        self.el.delegate('.btn.fileBtn', "keydown", function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 13 || keyCode === 108) {
                $(".fup", self.el).click();
                event.preventDefault();
            } else if (keyCode === 9) {   //Enter
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
        
        self.el.delegate('.view', "click", function (event) {
        	var $tr = $(this).parents("tr:eq(0)");
        	var name = $("td:eq(0)", $tr).text();
        	var path = $("td:eq(3)", $tr).text();
        	self.handler.preview(path, name, self);
        });
        

        var $body = $(".body", this.el);
        var $head = $(".head", this.el);
        $body.scroll(function() {
			var left = $body.scrollLeft();
			$head.scrollLeft(left);
			if($body[0].clientWidth != $body[0].scrollWidth) {
				var scroll_w = $body.width() - $body[0].clientWidth;
				$("td.empty", $head).outerWidth(scroll_w);
			} 
		});
        

		$(".att-handler", this.el).bind('mousedown', function (e) {
			if(!self.enable) return false;
			var resizer = $(".ui-resizer", self.el);
			var resizerLeft = $(this).parent().position().left + $(this).parent().outerWidth();
			resizer.css("left", resizerLeft);
			resizer.addClass("clicked");
			var $leftColumn, leftColOldW, tableWidth ;
			e.preventDefault();
			var startPosition = e.clientX;
			$leftColumn = $(this).parents("td").eq(0);
			leftColOldW = $leftColumn.width();
			
			var difference , leftColW, tblWidth;
			$(document).on('mousemove.rc', function (e) {
				difference = e.clientX - startPosition;
    			resizer.css("left", resizerLeft + difference);
			});
			return $(document).one('mouseup', function () {
				$(document).off('mousemove.rc');
				leftColW = leftColOldW + difference;
				if(leftColW < 10) {
					leftColW = 10;
				}
				$leftColumn.width(leftColW);
				$("label", $leftColumn).width(leftColW);
				var $b_left = $(".tbl-body tr.first td", $body).eq($leftColumn.index());
				$b_left.width(leftColW);
                resizer.removeClass("clicked");
                self.addEmptyRow();
			});
		});
    }
});
YIUI.reg('attachment', YIUI.Control.Attachment);/**
 * 分隔线
 */

YIUI.Control.Separator = YIUI.extend(YIUI.Control, {

    autoEl: '<hr size="1"></hr>',
    
    onSetHeight : function(height) {
//    	if(!this.orientation || this.orientation == YESUI_Separator_OrientationType.Horizontal) {
//    		this.el.css("height", 1);
//    	} else {
//    		this.el.css("height", height);
//    	}
	},
	
//	onSetWidth: function(width) {
//		if(this.orientation == YESUI_Separator_OrientationType.Vertical) {
//    		this.el.css("width", 1);
//    	} else {
//    		this.el.css("width", width);
//    	}
//	},
	
//	setTextAlignment: function(textAlignment) {
//		this.textAlignment = textAlignment;
//		if(textAlignment == YESUI_Separator_HAlignment.Center) {
//			this.el.css("margin-left", "auto").css("margin-right", "auto");
//		} else if(textAlignment == YESUI_Separator_HAlignment.Right) {
//			this.el.css("margin-left", "auto");
//		}
//	},
	
	onRender: function (ct) {
		this.base(ct);
		this.el.addClass("ui-sep");
		this.el.attr("color", "#dadada");
//		this.setTextAlignment(this.textAlignment);
	}
});
YIUI.reg('separator', YIUI.Control.Separator);/**
 * {
 * 		categories : ['2000','2001','2002','2003','2004'],
 *      
 * 		series : [{
 * 			name : '产量',
 * 			data : [1,2,3,4,5]
 * 		},{
 * 			name : '销售额',
 * 			data : [1,2,3,4,5]
 * 		}]
 * 
 *      转化后的数据格式
 * 		[
		    [[2000,1],[2001,2],[2002,3],[2003,4],[2004,5]],
			[[2000,1],[2001,2],[2002,3],[2003,4],[2004,5]]
		]
 * 
 * 		series : ['产量','销售额'],
 * 		data : [
 * 			[1,2,3,4],
 * 			[1,2,3,4]
 * 		]
 * }
 */



YIUI.Control.Chart = YIUI.extend(YIUI.Control, {
	autoEl: '<div></div>',
	
	/** 图表标题 */
	title : null,
	/** 柱状图分组显示 */
	grouped : true,
	/** 柱状图形的宽度，默认为0.5 */
	barWidth : 0.5,
	/** y轴刻度的最小值 */
	yMin : 0,
	/** x轴刻度的最小值 */
	xMin : null,
	/** 点状显示时内部的填充颜色，为null时内部填充颜色会与外部颜色一致 */
	fillColor : '#FFFFFF',
	
	series : null,
	
	categories : null,
	
	height: 500,
	
	width: 500,
	
	fistStraw: true,
	/*Y轴坐标*/
	yScale : [], 
	/*X轴坐标*/
	xScale : [],
	
	setDataModel: function(dataModel) {
		/** 系列数据 */
		var xyData = [];
		if(dataModel) {
			this.series = dataModel.series;
			this.categories = dataModel.categories;
		}
		switch (this.getMetaObj().chartType) {
			case 1 :
				this.horizontal = false;
				this.bars = true;
				this.stacked = true;
				this.grouped = false;
				this.track = false;
				break;
			case 2 :
				this.horizontal = true;
				this.bars = true;
				this.track = true;
				break;
			case 3 :
				this.horizontal = true;
				this.bars = true;
				this.stacked = true;
				this.grouped = false;
				this.track = false;
				break;
			case 4 :
				this.fill = true;
				this.showPoint = true;
				this.showLine = true;
				break;
			case 5 :
				this.fill = false;
				this.showPoint= true;
				this.showLine = true;
				break;
			case 6 :
				this.showPoint= true;
				break;
			case 7 :
				this.pie = true;
				break;
			case 0 : 
			default :
				this.horizontal = false;
				this.bars = true;
				this.track = true;
				break;
		}
		if($.isNumeric(this.categories[0])) {
			for(var i=0, len=this.series.length; i<len; i++) {
				var data = [];
				var maxData = [];
				for(var j=0, len2=this.categories.length; j<len2; j++) {
					if(this.horizontal) {
						data.push([this.series[i].data[j], parseInt(this.categories[j])]);
						maxData.push(this.series[i].data[j]);
					} else {
						data.push([parseInt(this.categories[j]), this.series[i].data[j]]);
						maxData.push(this.series[i].data[j]);
					}
				}
				data.sort(function(a,b){return a[0]-b[0]});
				 //fill: 是否为区域面积显示  showLine: 是否显示线条  showPoint: 是否显示为点状 
				var datas = {data : data , label : this.series[i].name, 
						     lines : {fill : this.fill, show : this.showLine}, 
						     points : {show : this.showPoint, fillColor : this.fillColor}};
				xyData.push(datas);

			}
			if(this.horizontal) {
				for(var i=0,len=xyData[0].data.length;i<len;i++) {
					this.yScale.push(parseInt(xyData[0].data[i][1]))
				}			
				this.xScale = null;
			} else {
				for(var i=0,len=xyData[0].data.length;i<len;i++) {
					this.xScale.push(parseInt(xyData[0].data[i][0]))
				}
				this.yScale = null;
			}
		} else {
			for(var i=0, len=this.series.length; i<len; i++) {
				var data = [];
				for(var j=0, len2=this.series[i].data.length; j<len2; j++) {
					if(this.horizontal) {
						data.push([this.series[i].data[j],j+1]);
					} else {
						data.push([j+1,this.series[i].data[j]]);
					}
				}
				var datas = {data : data , label : this.series[i].name, 
				lines : {fill : this.fill, show : this.showLine}, 
				points : {show : this.showPoint, fillColor : this.fillColor}};
		   		xyData.push(datas);
			}

			if(this.horizontal) {
				for(var i=0;i<this.categories.length;i++) {
					this.yScale.push([i+1,this.categories[i]])
				}			
				this.xScale = null;
			} else {
				for(var i=0;i<this.categories.length;i++) {
					this.xScale.push([i+1,this.categories[i]])
				}
				this.yScale = null;
			}
		}

		this.xyData = xyData;
		this.maxData = maxData;
		//设置Y轴最大值，以便散点图完全显示
	    this.yMax = Math.max.apply(null, this.maxData)+50;
		//饼图数据
	    if(this.pie) {
	    	var pieData = [];
	    	for(var j=0, len2=this.categories.length; j<len2; j++) {
	    		var tmpData = this.series[0].data[j];
	    		var pie = {data: [[0, tmpData]], label: this.categories[j]};
	    		pieData.push(pie);
	    	}
	    	this.pieData = pieData;
	    }
	    if(this.isDraw) {
	    	this.setDraw();
	    } else {
	    	this.isDraw = true;
	    }
	},
	
	onRender: function(ct) {
		this.base(ct);
		this.el.addClass("ui-chart");
		this.dataModel && this.setDataModel(this.dataModel);
	},
	
	onSetWidth : function(width) {
		if(width > 20) {
			this.el.css("width", width-20);
			this.el.css("margin-right", 20);
			this._hasSetWidth = true;
			this.reSetDraw(this._hasSetWidth, this._hasSetHeight);
		}
	},
	
	onSetHeight : function(height) {
		if(height > 30) {
			this.el.css("height", height-30);
			this._hasSetHeight = true;
			this.reSetDraw(this._hasSetWidth, this._hasSetHeight);
		}
	},
	
	reSetDraw: function(hasSetWidth, hasSetHeight) {
		if(hasSetWidth && hasSetHeight) {
			this.setDraw();
		}
	},
	
	/** 画出图表控件 */
	setDraw : function(){
		/** 柱状图为水平方向*/
		if(this.horizontal){
			/** x轴刻度值为null */
			//this.categories = null;
			/** y轴最小刻度 */
			this.yMin = null;
			/** x轴最小刻度值 */
			this.xMin = 0;
		}
		
		if(this.pie) {
		    Flotr.draw(this.el[0], this.pieData, {
		    	HtmlText:false,
				grid : {
					/** 表格外边框的粗细 */
					outlineWidth : 0,
					/** 表格内部是否显示垂直线条 */
					verticalLines : false,
					/** 表格内部是否显示水平线条 */
					horizontalLines : false
				},
				xaxis : {
					title : this.categoryAxisTitle,
					/** 刻度值 */
					//ticks : this.categories,
					/** 是否显示刻度值 */
					showLabels : false
				},
				yaxis : {
					title: this.seriesAxisTitle,
					showLabels : false
				},
				pie : {
					/** 以饼状图显示 */
					show : true,
					/** 透明度 */
					fillOpacity:1,
					/*间距*/
					explode : 5
				},
				mouse : {
					/** 为true时，当鼠标移动到每个折点时，会显示折点的坐标 */
					track : false,
					/** 当为true时，鼠标移动时，即使不在线条上，也会显示相应的数据 */
					relative : false,
					/** 小数点位数 */
					trackDecimals:0
					
				},
				title : this.title
		    });
		} else if(this.bars) {
			Flotr.draw(this.el[0], this.xyData, {
				xaxis : {
					title : this.categoryAxisTitle,
					min : this.xMin,
					/** 刻度值 */
					ticks : this.xScale
				},
				yaxis : {
					title: this.seriesAxisTitle,
					/** 刻度的最小值 */
					min : this.yMin,
					/** 刻度值小数点后几位数 */
					tickDecimals : 0,
					ticks : this.yScale
				},
				legend : {
					/** 图标默认位置为图表的下方 */
					position : 'bottom'
				},
				bars : {
					/** 以柱状图形的方式显示 */
					show : this.bars,
					/** 以累加的形式显示 */
					stacked : this.stacked,
					/** 柱状图以水平方式显示 */
					horizontal : this.horizontal,
					/** 柱状图型的宽度 */
					barWidth : this.barWidth,
					/** 是否以分组形式显示，当设置柱状图堆叠显示时，此值必须设置为false*/
					grouped : this.grouped,
					/** 透明度 */
					fillOpacity:1
				},
				grid:{
					color:'#aaa'
				},
				mouse : {
					/** 为true时，当鼠标移动到每个折点时，会显示折点的坐标 */
					track : false,
					/** 当为true时，鼠标移动时，即使不在线条上，也会显示相应的数据 */
					relative : false,
					/** 小数点位数 */
					trackDecimals:0
				},
				/** 图表的标题 */
				title : this.title
			});
		} else if(this.fill) {
			Flotr.draw(this.el[0], this.xyData, {
				xaxis : {
					title : this.categoryAxisTitle,
					/** 刻度值 */
					ticks : this.xScale
				},
				yaxis : {
					title: this.seriesAxisTitle,
					/** 刻度值小数点后几位数 */
					tickDecimals : 0,
					ticks : this.yScale
				},
				legend : {
					/** 图标默认位置为图表的下方 */
					position : 'bottom'
				},
				grid:{
					color:'#aaa'
				},
				mouse : {
					/** 为true时，当鼠标移动到每个折点时，会显示折点的坐标 */
					track : false,
					/** 当为true时，鼠标移动时，即使不在线条上，也会显示相应的数据 */
					relative : false,
					/** 小数点位数 */
					trackDecimals:0
				},
				/** 图表的标题 */
				title : this.title
			});
		} else if(this.points) {
			Flotr.draw(this.el[0], this.xyData, {
				xaxis : {
					title : this.categoryAxisTitle,
					min : this.xMin,
					max : this.xMax,
					/** 刻度值 */
					ticks : this.xScale
				},
				yaxis : {
					title: this.seriesAxisTitle,
					/** 刻度的最小值 */
					min : this.yMin,
					min : this.yMax,
					/** 刻度值小数点后几位数 */
					tickDecimals : 0,
					ticks : this.yScale
				},
				legend : {
					/** 图标默认位置为图表的下方 */
					position : 'bottom'
				},
				grid:{
					color:'#aaa'
				},
				mouse : {
					/** 为true时，当鼠标移动到每个折点时，会显示折点的坐标 */
					track : false,
					/** 当为true时，鼠标移动时，即使不在线条上，也会显示相应的数据 */
					relative : false,
					/*小数点位数*/
					trackDecimals:0
				},
				/** 图表的标题 */
				title : this.title
			});
		} else if(this.showPoint) {
			Flotr.draw(this.el[0], this.xyData, {
				xaxis : {
					title : this.categoryAxisTitle,
					/** 刻度值 */
					ticks : this.xScale
				},
				yaxis : {
					title: this.seriesAxisTitle,
					/** 刻度值小数点后几位数 */
					tickDecimals : 0,
					ticks : this.yScale
				},
				legend : {
					/** 图标默认位置为图表的下方 */
					position : 'bottom'
				},
				grid:{
					color:'#aaa'
				},
				mouse : {
					/** 为true时，当鼠标移动到每个折点时，会显示折点的坐标 */
					track : false,
					/** 当为true时，鼠标移动时，即使不在线条上，也会显示相应的数据 */
					relative : false,
					/** 小数点位数 */
					trackDecimals:0
				},
				/** 图表的标题 */
				title : this.title
				
			});
		}
		if(this.fistStraw) {
			this.height = -1;
			this.width = -1;
			this.fistStraw = false;
		} 
		this.xScale = [];
		this.yScale = [];
	},
	
	setSeriesAxisTitle: function(sTitle) {
		this.seriesAxisTitle = sTitle;
	},
	
	setCategoryAxisTitle: function(cTitle) {
		this.categoryAxisTitle = cTitle;
	},
	
	setTitle: function(title) {
		this.title = title;
	},
	
	afterRender: function(ct){
        this.base(ct);
        var metaObj = this.getMetaObj();

    	metaObj.seriesAxisTitle && this.setSeriesAxisTitle();
    	metaObj.categoryAxisTitle && this.setCategoryAxisTitle();
    	metaObj.title && this.setTitle();
        
        this.setDraw();
	}


});

YIUI.reg('chart', YIUI.Control.Chart);YIUI.Control.BPMGraph = YIUI.extend(YIUI.Control, {
    /**
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',
    paper: null,
    nodes: null,
    mX: null,
    mY: null,
    transitions: null,
    swims: null, //泳道
    elements: {},
    nodeElements: {},
    circle_R: 20,//圆半径
    isSourceTop: false,
    isSourceLeft: false,
    transPath: null,
    init: function (option) {
        this.base(option);
    },
    isTransPathLine: function (transition) {
        if (this.transPath) {
            var step, srcNode = this.nodeElements[transition.source], tgtNode = this.nodeElements[transition.target];
            for (var i = 0; i < this.transPath["steps"].length; i++) {
                step = this.transPath["steps"][i];
                if (step.source == srcNode.id && step.target == tgtNode.id) {
                    return true;
                }
            }
        }
        return false;
    },
    isLastNodeInPath: function (node) {
        if (this.transPath) {
            var lastStep = this.transPath["steps"][this.transPath["steps"].length - 1];
            if (lastStep && node.id == lastStep.target) {
                return true;
            }
        }
        return false;
    },
    //判断是否为IE浏览器
    isIE: function () {
        return $.browser.isIE;
    },

    textFormat: function (text) {
        text.attr("font-style", "normal");
        text.attr("font-weight", "normal");
        text.attr("font-size", "12px");
    },


    onSetHeight: function (height) {
        this.base(height);
        if (this.hasWidth && this.paper == null) {
            this.createGraph();
        }
        this.hasHeight = true;
    },
    onSetWidth: function (width) {
        this.base(width);
        this.el.css("overflow", "auto");
        if (this.hasHeight && this.paper == null) {
            this.createGraph();
        }
        this.hasWidth = true;
    },

    onRender: function (ct) {
        this.base(ct);
    },

    createGraph: function () {
        if (!this.paper) {
            this.paper = Raphael(this.id);
        }
        if (this.nodes && this.transitions) {
            var firestNode = this.nodes[0];
            var minX = firestNode.x, maxX = firestNode.x, minY = firestNode.y, maxY = firestNode.y;
            for (var index = 1 , len = this.nodes.length; index < len; index++) {
                var node = this.nodes[index];
                if (node.x < minX) {
                    minX = node.x;
                }
                if (node.x + node.width > maxX) {
                    maxX = node.x + node.width;
                }
                if (node.y < minY) {
                    minY = node.y;
                }
                if (node.y + node.height > maxY) {
                    maxY = node.y + node.height;
                }
            }
            this.mX = (maxX - minX) / 2 - this.el.width() / 2 + 50;
            this.mY = minY - 20;
            this.paper.setSize(maxX + Math.abs(this.mX) + 40, maxY + 40);
            for (var index in this.nodes) {
                var node = this.nodes[index];
                var el = this.createNode(node);
                this.elements[node.key] = el;
                this.nodeElements[node.key] = node;
            }

            for (var index in this.transitions) {
                var transition = this.transitions[index];
                var sourceNode = this.nodes[transition.source];
                this.createLine(transition);
            }
        }

        if (this.swims) {
            for (var index in this.swims) {
                var swim = this.swims[index];
                this.createSwim(swim);
            }
        }
        this.hasWidth = false;
        this.hasHeight = false;
    },

    getStrLength: function (str) {
        var cArr = str.match(/[^\x00-\xff]/ig);
        return str.length + (cArr == null ? 0 : cArr.length);
    },

    createSwim: function (swim) {
        var direction = swim.direction;
        if (direction != undefined) {
            if (direction == "Vertical") {
                var swimGraph = this.paper.rect(swim.x, swim.y, swim.width, swim.height, 0);
                swimGraph.toBack();
                swimGraph.attr("stroke", "gray");
                var lt = this.paper.path("M" + swim.x + " " + (swim.y + 2 * this.circle_R) + "L" + (swim.x + swim.width) + " " + (swim.y + 2 * this.circle_R));
                lt.toBack();
                lt.attr("stroke", "gray");
                var text = this.paper.text(swim.x + swim.width / 2, swim.y + this.circle_R, swim.caption);
                if (this.isIE()) {
                    this.textFormat(text);
                }
                text.attr("font-size", "25px");
                if (this.isIE()) {
                    this.textFormat(text);
                }
            } else {
                var swimGraph = this.paper.rect(swim.x, swim.y, swim.height, swim.width, 0);
                swimGraph.toBack()
                swimGraph.attr("stroke", "gray");
                var lt = this.paper.path("M" + (swim.x + 2 * this.circle_R) + " " + swim.y + "L" + (swim.x + 2 * this.circle_R) + " " + (swim.y + swim.width));
                lt.toBack();
                lt.attr("stroke", "gray");
                var text = this.paper.text(swim.x + this.circle_R, (swim.y + swim.width / 2), swim.caption);
                text.attr("font-size", "20px");
                if (this.isIE()) {
                    this.textFormat(text);
                }
            }
        }
    },

    createLine: function (transition) {
        var lineStyle = transition.lineStyle;
        switch (lineStyle) {
            case BPMLineType.STEAIGHT_LINE:
                return this.createSteaightLine(transition);
            case BPMLineType.CHAMFER_CURVE_H_ONE:
                return this.chamferCurveHOne(transition);
            case BPMLineType.CHAMFER_CURVE_V_ONE:
                return this.chamferCurveVOne(transition);
            case BPMLineType.CHAMFER_CURVE_H_TWO:
                return this.chamferCurveHTwo(transition);
            case BPMLineType.CHAMFER_CURVE_V_TWO:
                return this.chamferCurveVTwo(transition);
            case BPMLineType.FILLET_CURVE_H_ONE:
                return this.filletCurveHOne(transition);
            case BPMLineType.FILLET_CURVE_V_ONE:
                return this.filletCurveVOne(transition);
            case BPMLineType.FILLET_CURVE_H_TWO:
                return this.filletCurveHTwo(transition);
            case BPMLineType.FILLET_CURVE_V_TWO:
                return this.filletCurveVTwo(transition);
            case BPMLineType.OBKIQUE_CURVE_H_TWO:
                return this.obkiqueCurveHTwo(transition);
            case BPMLineType.OBKIQUE_CURVE_V_TWO:
                return this.obkiqueCurveVTwo(transition);
            default:
                return null;
        }
    },

    obkiqueCurveVTwoBase: function (sourcePoint, targetPoint, my1, my2, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (sourcePoint.x - this.mX) + " " + (my1 - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (my1 - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (my2 - this.mY));
        lt2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (targetPoint.x - this.mX) + " " + (my2 - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt3.attr({"stroke-width": "2"});
        lt3.attr({"arrow-end": "classic-wide-long"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("Resource/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //垂直方向的三段折线箭头
    obkiqueCurveVTwo: function (transition) {
        var stNode = this.stNode(transition)
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceTop ? this.getBottom(stNode.sourceNode) : this.getTop(stNode.sourceNode);
        var targetPoint = this.isSourceTop ? this.getTop(stNode.targetNode) : this.getBottom(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var my1 = sourcePoint.y + (targetPoint.y - sourcePoint.y) / 3;
            var my2 = sourcePoint.y + (targetPoint.y - sourcePoint.y) / 3 * 2;
            this.obkiqueCurveVTwoBase(sourcePoint, targetPoint, my1, my2, transition);

        }
    },

    obkiqueCurveHTwoBase: function (sourcePoint, targetPoint, mx1, mx2, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (mx1 - this.mX) + " " + (sourcePoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (mx1 - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (mx2 - this.mX) + " " + (targetPoint.y - this.mY));
        lt2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (mx2 - this.mX) + " " + (targetPoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt3.attr({"stroke-width": "2"});
        lt3.attr({"arrow-end": "classic-wide-long"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //水平方向的三段折线箭头
    obkiqueCurveHTwo: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceLeft ? this.getRight(stNode.sourceNode) : this.getLeft(stNode.sourceNode);
        var targetPoint = this.isSourceLeft ? this.getLeft(stNode.targetNode) : this.getRight(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var mx1 = sourcePoint.x + (targetPoint.x - sourcePoint.x) / 3;
            var mx2 = sourcePoint.x + (targetPoint.x - sourcePoint.x) / 3 * 2;
            this.obkiqueCurveHTwoBase(sourcePoint, targetPoint, mx1, mx2, transition)
        }
    },

    filletCurveVTwoBase: function (sourcePoint, targetPoint, my, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (sourcePoint.x - this.mX) + " " + (my - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (my - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (my - this.mY));
        lt2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (targetPoint.x - this.mX) + " " + (my - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt3.attr({"stroke-width": "2"});
        lt3.attr({"arrow-end": "classic-wide-long"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //两个直角折线的箭头， 箭头为垂直方向
    filletCurveVTwo: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceTop ? this.getBottom(stNode.sourceNode) : this.getTop(stNode.sourceNode);
        var targetPoint = this.isSourceTop ? this.getTop(stNode.targetNode) : this.getBottom(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var my = (sourcePoint.y + targetPoint.y) / 2;
            this.filletCurveVTwoBase(sourcePoint, targetPoint, my, transition);
        }
    },

    filletCurveHTwoBase: function (sourcePoint, targetPoint, mx, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (mx - this.mX) + " " + (sourcePoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (mx - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (mx - this.mX) + " " + (targetPoint.y - this.mY));
        lt2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (mx - this.mX) + " " + (targetPoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt3.attr({"stroke-width": "2"});
        lt3.attr({"arrow-end": "classic-wide-long"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //两个直角折线的箭头， 箭头为水平方向
    filletCurveHTwo: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceLeft ? this.getRight(stNode.sourceNode) : this.getLeft(stNode.sourceNode);
        var targetPoint = this.isSourceLeft ? this.getLeft(stNode.targetNode) : this.getRight(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var mx = (sourcePoint.x + targetPoint.x) / 2;
            this.filletCurveHTwoBase(sourcePoint, targetPoint, mx, transition);
        }
    },

    filletCurveVOneBase: function (sourcePoint, targetPoint, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (sourcePoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (targetPoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt2.attr({"arrow-end": "classic-wide-long"});
        lt2.attr({"stroke-width": "2"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //直角折线箭头， 箭头为垂直方向
    filletCurveVOne: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceLeft ? this.getRight(stNode.sourceNode) : this.getLeft(stNode.sourceNode);
        var targetPoint = this.isSourceTop ? this.getTop(stNode.targetNode) : this.getBottom(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            this.filletCurveVOneBase(sourcePoint, targetPoint, transition)
        }
    },

    filletCurveHOneBase: function (sourcePoint, targetPoint, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (sourcePoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (targetPoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt2.attr({"arrow-end": "classic-wide-long"});
        lt2.attr({"stroke-width": "2"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //直角折线箭头， 箭头为水平方向
    filletCurveHOne: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceTop ? this.getBottom(stNode.sourceNode) : this.getTop(stNode.sourceNode);
        var targetPoint = this.isSourceLeft ? this.getLeft(stNode.targetNode) : this.getRight(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            this.filletCurveHOneBase(sourcePoint, targetPoint, transition);
        }
    },

    chamferCurveVTwoBase: function (sourcePoint, targetPoint, dX, dY, rX, rY, my, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (sourcePoint.x - this.mX) + " " + (my + (dY < 0 ? rY : -rY) - this.mY));
        lt.attr({"stroke-width": "2"});
        var sweep = 0;
        if (dY * dX < 0) {
            sweep = 1;
        }
        var arc = lt.paper.path("M" + (sourcePoint.x - this.mX) + " " + (my + (dY < 0 ? rY : -rY) - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep + " " + (sourcePoint.x + (dX < 0 ? -rX : +rX) - this.mX) + " " + (my - this.mY));
        arc.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (sourcePoint.x + (dX < 0 ? -rX : +rX) - this.mX) + " " + (my - this.mY) + "L" + (targetPoint.x + (dX < 0 ? rX : -rX) - this.mX) + " " + (my - this.mY));
        lt2.attr({"stroke-width": "2"});
        var sweep1 = 0;
        if (dY * dX > 0) {
            sweep1 = 1;
        }
        var arc2 = lt.paper.path("M" + (targetPoint.x + (dX < 0 ? rX : -rX) - this.mX) + " " + (my - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep1 + " " + (targetPoint.x - this.mX) + " " + (my + (dY < 0 ? -rY : rY) - this.mY));
        arc2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (targetPoint.x - this.mX) + " " + (my + (dY < 0 ? -rY : rY) - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        lt3.attr({"arrow-end": "classic-wide-long"});
        lt3.attr({"stroke-width": "2"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            arc.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
            arc2.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                arc.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                arc2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //采用圆弧过度的双直角折线箭头， 箭头为垂直方向
    chamferCurveVTwo: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceTop ? this.getBottom(stNode.sourceNode) : this.getTop(stNode.sourceNode);
        var targetPoint = this.isSourceTop ? this.getTop(stNode.targetNode) : this.getBottom(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var dY = targetPoint.y - sourcePoint.y;
            var rY = Math.min(Math.abs(dY), 20);
            var dX = targetPoint.x - sourcePoint.x;
            var rX = Math.min(Math.abs(dX), 20);
            var my = (sourcePoint.y + targetPoint.y) / 2;
            this.chamferCurveVTwoBase(sourcePoint, targetPoint, dX, dY, rX, rY, my, transition);
        }
    },

    chamferCurveHTwoBase: function (sourcePoint, targetPoint, dX, dY, rX, rY, mx, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (mx + (dX < 0 ? rX : -rX) - this.mX) + " " + (sourcePoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var sweep = 0;
        if (dY * dX > 0) {
            sweep = 1;
        }
        var arc = lt.paper.path("M" + (mx + (dX < 0 ? rX : -rX) - this.mX) + " " + (sourcePoint.y - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep + " " + (mx - this.mX) + " " + (sourcePoint.y + (dY < 0 ? -rY : rY) - this.mY));
        arc.attr({"stroke-width": "2"});
        var lt2 = this.paper.path("M" + (mx - this.mX) + " " + (sourcePoint.y + (dY < 0 ? -rY : rY) - this.mY) + "L" + (mx - this.mX) + " " + (targetPoint.y + (dY < 0 ? rY : -rY) - this.mY));
        lt2.attr({"stroke-width": "2"});
        var sweep1 = 0;
        if (dY * dX < 0) {
            sweep1 = 1;
        }
        var arc2 = lt.paper.path("M" + (mx - this.mX) + " " + (targetPoint.y + (dY < 0 ? rY : -rY) - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep1 + " " + (mx + (dX < 0 ? -rX : +rX) - this.mX) + " " + (targetPoint.y - this.mY));
        arc2.attr({"stroke-width": "2"});
        var lt3 = this.paper.path("M" + (mx + (dX < 0 ? -rX : +rX) - this.mX) + " " + (targetPoint.y - this.mY) + "L" + targetPoint.x + " " + (targetPoint.y - this.mY));
        lt3.attr({"arrow-end": "classic-wide-long"});
        lt3.attr({"stroke-width": "2"})
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            arc.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
            arc2.attr({"stroke": "red"});
            lt3.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                arc.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                arc2.attr({"stroke-dasharray": "- "});
                lt3.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //采用圆弧过度的双直角折线箭头， 箭头为水平方向
    chamferCurveHTwo: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceLeft ? this.getRight(stNode.sourceNode) : this.getLeft(stNode.sourceNode);
        var targetPoint = this.isSourceLeft ? this.getLeft(stNode.targetNode) : this.getRight(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var dY = targetPoint.y - sourcePoint.y;
            var rY = Math.min(Math.abs(dY), 20);
            var dX = targetPoint.x - sourcePoint.x;
            var rX = Math.min(Math.abs(dX), 20);
            var mx = (sourcePoint.x + targetPoint.x) / 2;
            this.chamferCurveHTwoBase(sourcePoint, targetPoint, dX, dY, rX, rY, mx, transition)
        }
    },

    chamferCurveVOneBase: function (sourcePoint, targetPoint, dX, dY, rX, rY, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (targetPoint.x - this.mX + (dX < 0 ? rX : -rX)) + " " + (sourcePoint.y - this.mY));
        lt.attr({"stroke-width": "2"});
        var sweep = 0;
        if (dY * dX > 0) {
            sweep = 1;
        }
        var arc = lt.paper.path("M" + (targetPoint.x + (dX < 0 ? rX : -rX) - this.mX) + " " + (sourcePoint.y - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep + " " + (targetPoint.x - this.mX) + " " + (sourcePoint.y + (dY < 0 ? -rY : rY) - this.mY));
        arc.attr({"stroke-width": "2"});
        if (sweep == 0) {
            var lt2 = arc.paper.path("M" + (targetPoint.x - this.mX) + " " + (sourcePoint.y + (dY < 0 ? -rY : rY) - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
            lt2.attr({"arrow-end": "classic-wide-long"});
            lt2.attr({"stroke-width": "2"});
        } else {
            var lt2 = arc.paper.path("M" + (targetPoint.x - this.mX) + " " + (sourcePoint.y + (dY < 0 ? -rY : rY) - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
            lt2.attr({"arrow-end": "classic-wide-long"});
            lt2.attr({"stroke-width": "2"});
        }
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            arc.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                arc.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //采用圆弧过度的直角折线箭头， 箭头为垂直方向
    chamferCurveVOne: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceLeft ? this.getRight(stNode.sourceNode) : this.getLeft(stNode.sourceNode);
        var targetPoint = this.isSourceTop ? this.getTop(stNode.targetNode) : this.getBottom(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var dY = targetPoint.y - sourcePoint.y;
            var rY = Math.min(Math.abs(dY), 20);
            var dX = targetPoint.x - sourcePoint.x;
            var rX = Math.min(Math.abs(dX), 20);
            this.chamferCurveVOneBase(sourcePoint, targetPoint, dX, dY, rX, rY, transition);
        }
    },

    chamferCurveHOneBase: function (sourcePoint, targetPoint, dX, dY, rX, rY, transition) {
        var lt = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (sourcePoint.x - this.mX) + " " + (targetPoint.y + (dY < 0 ? rY : -rY) - this.mY));
        lt.attr({"stroke-width": "2"});
        var sweep = 0;
        if (dY * dX < 0) {
            sweep = 1;
        }
        var arc = lt.paper.path("M" + (sourcePoint.x - this.mX) + " " + (targetPoint.y + (dY < 0 ? rY : -rY) - this.mY) + "A" + rX + " " + rY + " 0 0" + " " + sweep + " " + (sourcePoint.x - this.mX + (dX < 0 ? -rX : rX)) + " " + (targetPoint.y - this.mY));
        arc.attr({"stroke-width": "2"});
        var lt2 = arc.paper.path("M" + (sourcePoint.x + rX - this.mX) + " " + (targetPoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + targetPoint.y - this.mY);
        lt2.attr({"arrow-end": "classic-wide-long"});
        lt2.attr({"stroke-width": "2"});
        if (this.isTransPathLine(transition)) {
            lt.attr({"stroke": "red"});
            arc.attr({"stroke": "red"});
            lt2.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                lt.attr({"stroke-dasharray": "- "});
                arc.attr({"stroke-dasharray": "- "});
                lt2.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = lt.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5 - this.mX), (circle_center.y - 8.5 - this.mY), 17, 17);
                break;
        }
    },

    //采用圆弧过度的直角折线箭头， 箭头为水平方向
    chamferCurveHOne: function (transition) {
        var stNode = this.stNode(transition);
        this.brokenLine(stNode.sourceNode, stNode.targetNode);
        var sourcePoint = this.isSourceTop ? this.getBottom(stNode.sourceNode) : this.getTop(stNode.sourceNode);
        var targetPoint = this.isSourceLeft ? this.getLeft(stNode.targetNode) : this.getRight(stNode.targetNode);
        if (sourcePoint != null && targetPoint != null) {
            var dY = targetPoint.y - sourcePoint.y;
            var rY = Math.min(Math.abs(dY), 20);
            var dX = targetPoint.x - sourcePoint.x;
            var rX = Math.min(Math.abs(dX), 20);
            this.chamferCurveHOneBase(sourcePoint, targetPoint, dX, dY, rX, rY, transition);
        }
    },

    steaightLineBase: function (sourcePoint, targetPoint, transition) {
        var line = this.paper.path("M" + (sourcePoint.x - this.mX) + " " + (sourcePoint.y - this.mY) + "L" + (targetPoint.x - this.mX) + " " + (targetPoint.y - this.mY));
        line.attr({"arrow-end": "classic-wide-long"});
        line.attr({"stroke-width": "2"});
        if (this.isTransPathLine(transition)) {
            line.attr({"stroke": "red"});
        }
        switch (transition.tagName) {
            case "association" :
                line.attr({"stroke-dasharray": "- "});
                break;
            case "exception-flow" :
                var circle_center = line.getPointAtLength(8.5);
                var image = this.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ExceptionFlow-icon.png", (circle_center.x - 8.5), (circle_center.y - 8.5), 17, 17);
                break;
        }
    },

    createSteaightLine: function (transition) {
        var stNode = this.stNode(transition)
        var sourceGraph = this.elements[stNode.sourceNodeKey];
        var targetGraph = this.elements[stNode.targetNodeKey];
        var sourcePoint = this.getSourcePoint(sourceGraph, stNode.targetNode, stNode.sourceNode);
        var targetPoint = this.getTargrtPoint(targetGraph, stNode.targetNode, stNode.sourceNode);
        if (sourcePoint != null && targetPoint != null) {
            this.steaightLineBase(sourcePoint, targetPoint, transition)
        }
    },

    getCenter: function (node) {
        var type = this.elements[node.key].type;
        var center = {};
        if (type == 'circle') {
            center.x = node.x + this.circle_R;
            center.y = node.y + this.circle_R;
        }
        if (type == 'rect') {
            center.x = node.x + node.width / 2;
            center.y = node.y + node.height / 2;
        }
        if (type == 'set') {
            center.x = node.x + 25;
            center.y = node.y + 25;
        }
        return center;
    },

    getTop: function (node) {
        var type = this.elements[node.key].type;
        var top = {};
        if (type == "circle") {
            top.x = node.x + this.circle_R;
            top.y = node.y;
        }
        if (type == "rect") {
            top.x = node.x + node.width / 2;
            top.y = node.y;
        }
        if (type == "set") {
            top.x = node.x + 25;
            top.y = node.y;
        }
        return top;
    },

    getBottom: function (node) {
        var type = this.elements[node.key].type;
        var bottom = {};
        if (type == "circle") {
            bottom.x = node.x + this.circle_R;
            bottom.y = node.y + 2 * this.circle_R;
        }
        if (type == "rect") {
            bottom.x = node.x + node.width / 2;
            bottom.y = node.y + node.height;
        }
        if (type == "set") {
            bottom.x = node.x + 25;
            bottom.y = node.y + 50;
        }
        return bottom;
    },

    getLeft: function (node) {
        var type = this.elements[node.key].type;
        var left = {};
        if (type == "circle") {
            left.x = node.x;
            left.y = node.y + this.circle_R;
        }
        if (type == "rect") {
            left.x = node.x;
            left.y = node.y + node.height / 2;
        }
        if (type == "set") {
            left.x = node.x;
            left.y = node.y + 25;
        }
        return left;
    },

    getRight: function (node) {
        var type = this.elements[node.key].type;
        var right = {};
        if (type == "circle") {
            right.x = node.x + 2 * this.circle_R;
            right.y = node.y + this.circle_R;
        }
        if (type == "rect") {
            right.x = node.x + node.width;
            right.y = node.y + node.height / 2;
        }
        if (type == "set") {
            right.x = node.x + 50;
            right.y = node.y + 25;
        }

        return right;
    },

    getSourcePoint: function (sourceGraph, targetNode, sourceNode) {
        if (sourceGraph.type == "circle") {
            var sourcePoint = this.getCircleLineIntersectPoint(sourceNode, targetNode);
            return sourcePoint;
        }

        if (sourceGraph.type == "rect") {
            var sourcePoint = this.getRectLineIntersectPoint(sourceNode, targetNode);
            return sourcePoint;
        }
        if (sourceGraph.type == "set") {
            var sourcePoint = this.getDiamondLineIntersectPoint(sourceNode, targetNode);
            return sourcePoint;
        }
        return null;
    },

    getTargrtPoint: function (targetGraph, targetNode, sourceNode) {
        if (targetGraph.type == "circle") {
            var targetPoint = this.getCircleLineIntersectPoint(targetNode, sourceNode);
            return targetPoint;
        }

        if (targetGraph.type == "rect") {
            var targetPoint = this.getRectLineIntersectPoint(targetNode, sourceNode);
            return targetPoint;
        }
        if (targetGraph.type == "set") {
            var targetPoint = this.getDiamondLineIntersectPoint(targetNode, sourceNode);
            return targetPoint;
        }
        return null;
    },

    getCircleLineIntersectPoint: function (sourceNode, targetNode) {
        var vx = this.getCenter(targetNode).x - sourceNode.x - this.circle_R;
        var vy = this.getCenter(targetNode).y - sourceNode.y - this.circle_R;

        var calX = (sourceNode.x + this.circle_R) - this.getCenter(targetNode).x;
        var calY = (sourceNode.y + this.circle_R) - this.getCenter(targetNode).y;

        var distance = Math.pow((calX * calX + calY * calY), 0.5);

        if (distance < this.circle_R) {
            return;
        }

        var px = sourceNode.x + this.circle_R + vx * this.circle_R / distance;
        var py = sourceNode.y + this.circle_R + vy * this.circle_R / distance;

        return {
            x: px,
            y: py
        }
    },

    getRectLineIntersectPoint: function (sourceNode, targetNode) {
        var center = {};
        var x = sourceNode.x
        center.x = sourceNode.x + sourceNode.width / 2;
        center.y = sourceNode.y + sourceNode.height / 2;

        //矩形的四个顶点
        var a = {}, b = {}, c = {}, d = {};
        a.x = sourceNode.x;
        a.y = sourceNode.y;
        b.x = sourceNode.x + sourceNode.width;
        b.y = sourceNode.y;
        c.x = sourceNode.x + sourceNode.width;
        c.y = sourceNode.y + sourceNode.height;
        d.x = sourceNode.x;
        d.y = sourceNode.y + sourceNode.height;
        var ip = this.getRectIntersectPoint(center, this.getCenter(targetNode), a, b);
        if (ip == null) {
            ip = this.getRectIntersectPoint(center, this.getCenter(targetNode), b, c);
        }
        if (ip == null) {
            ip = this.getRectIntersectPoint(center, this.getCenter(targetNode), c, d);
        }
        if (ip == null) {
            ip = this.getRectIntersectPoint(center, this.getCenter(targetNode), d, a);
        }
        return ip;
    },

    getDiamondLineIntersectPoint: function (sourceNode, targetNode) {
        var line1a = {};
        line1a.x = sourceNode.x + 25;
        line1a.y = sourceNode.y + 25;

        //菱形的四个顶点
        var a = {}, b = {}, c = {}, d = {};
        a.x = sourceNode.x;
        a.y = sourceNode.y + 25;
        b.x = sourceNode.x + 25;
        b.y = sourceNode.y + 50;
        c.x = sourceNode.x + 50;
        c.y = sourceNode.y + 25;
        d.x = sourceNode.x + 25;
        d.y = sourceNode.y;
        var ip = this.getRectIntersectPoint(line1a, this.getCenter(targetNode), a, b);
        if (ip == null) {
            ip = this.getRectIntersectPoint(line1a, this.getCenter(targetNode), b, c);
        }
        if (ip == null) {
            ip = this.getRectIntersectPoint(line1a, this.getCenter(targetNode), c, d);
        }
        if (ip == null) {
            ip = this.getRectIntersectPoint(line1a, this.getCenter(targetNode), d, a);
        }
        return ip;
    },

    getRectIntersectPoint: function (line1a, line1b, line2a, line2b) {
        var vx1 = line1b.x - line1a.x;
        var vy1 = line1b.y - line1a.y;
        var vx2 = line2b.x - line2a.x;
        var vy2 = line2b.y - line2a.y;

        var check = vx1 * vy2 - vy1 * vx2;
        // 两条线平行，没有交点
        if (check == 0)
            return null;

        var l = ((line2b.x - line1a.x) * vy1 + (line1a.y - line2b.y) * vx1) / check;

        if (l > 0 || l < -1)
            return null;

        var ret = {};
        ret.x = line2b.x + vx2 * l;
        ret.y = line2b.y + vy2 * l;
        if ((ret.x - line1a.x) * (ret.x - line1b.x) > 0)
            return null;
        if ((ret.y - line1a.y) * (ret.y - line1b.y) > 0)
            return null;
        return ret;
    },

    createNode: function (node) {
        var nodeType = node.nodeType;
        switch (nodeType) {
            case BPMNodeType.BEGIN:
            case BPMNodeType.END:
            case BPMNodeType.JOIN:
            case BPMNodeType.DECISION:
            case BPMNodeType.FORK:
            case BPMNodeType.EXCLUSIVE_FORK:
            case BPMNodeType.COMPLEX_JOIN:
            case BPMNodeType.STATE:
                break;
            default:
                var showText = this.getShowCaption(node.width, node.caption);
                if (showText.length > 0) {
                    node.caption = showText;
                }
                break;
        }
        switch (nodeType) {
            case BPMNodeType.BEGIN:
                return this.createBeginNode(node);
            case BPMNodeType.END:
                return this.createEndNode(node);
            case BPMNodeType.BRANCH_END:
                return this.createBranchEndNode(node);
            case BPMNodeType.STATE:
                return this.createStateNode(node);
            case BPMNodeType.USER_TASK:
                return this.createUserTaskNode(node);
            case BPMNodeType.SERVICE_TASK:
                return this.createServiceTaskNode(node);
            case BPMNodeType.MANUAL_TASK:
                return this.createManualTaskNode(node);
            case BPMNodeType.AUDIT:
                return this.createAuditNode(node);
            case BPMNodeType.FORK:
                return this.createForkNode(node);
            case BPMNodeType.JOIN:
                return  this.createJoinNode(node);
            case BPMNodeType.EXCLUSIVE_FORK:
                return this.createExclusiveForkNode(node);
            case BPMNodeType.COMPLEX_JOIN:
                return this.createComplexJoinNode(node);
            case BPMNodeType.DECISION:
                return this.createDecisionNode(node);
            case BPMNodeType.SUB_PROCESS:
                return this.createSubProcessNode(node);
            case BPMNodeType.INLINE:
                return this.createInlineNode(node);
            case BPMNodeType.DATAMAP:
                return this.createDataMapNode(node);
            case BPMNodeType.COUNTERSIGN:
                return this.createCounterSignNode(node);
            case BPMNodeType.STATE_ACTION:
                return this.createStateActionNode(node);
            default:
                return null;
        }
    },
    createBeginNode: function (node) {
        var begin = this.paper.circle((node.x - this.mX) + this.circle_R, node.y + this.circle_R - this.mY, this.circle_R);
        if (this.isLastNodeInPath(node)) {
            begin.attr("stroke", "red");
        }
        begin.attr({"stroke-width": "2",
            "fill": "white"});
        var text = begin.paper.text((node.x - this.mX) + this.circle_R, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + text.node.clientHeight / 2 - this.mY;
        text.attr({"y": "" + text_y});
        begin.hover(function (e) {
            begin.attr({"cursor": "pointer"});
        }, function () {
        });
        return begin;
    },

    createEndNode: function (node) {
        var endOut = this.paper.circle((node.x - this.mX) + this.circle_R, node.y + this.circle_R - this.mY, this.circle_R);
        if (this.isLastNodeInPath(node)) {
            endOut.attr("stroke", "red");
        }
        endOut.attr({"stroke-width": "2"});
        endOut.attr({"fill": "white"});
        var endIn = this.paper.circle(node.x + this.circle_R - this.mX, node.y + this.circle_R - this.mY, this.circle_R - 10);
        endIn.attr({"stroke-width": "0"});
        endIn.attr({"stroke": null});
        endIn.attr({"fill": "black"});
        var text = endOut.paper.text(node.x + this.circle_R - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + text.node.clientHeight / 2 - this.mY;
        text.attr({"y": "" + text_y});
        endOut.hover(function (e) {
            endOut.attr({"cursor": "pointer"});
            endIn.attr({"cursor": "pointer"});
        }, function () {
        });
        return endOut;
    },

    createBranchEndNode: function (node) {
        var branchEnd = this.paper.circle(node.x + this.circle_R - this.mX, node.y + this.circle_R - this.mY, this.circle_R);
        if (this.isLastNodeInPath(node)) {
            branchEnd.attr("stroke", "red");
        }
        branchEnd.attr({"stroke-width": "5"});
        branchEnd.attr({"fill": "white"});
        var text = branchEnd.paper.text(node.x + this.circle_R - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        branchEnd.hover(function (e) {
            branchEnd.attr({"cursor": "pointer"});
        }, function () {
        });
        return branchEnd;
    },

    createStateNode: function (node) {
        var endOut = this.paper.circle(node.x + this.circle_R - this.mX, node.y + this.circle_R - this.mY, this.circle_R);
        if (this.isLastNodeInPath(node)) {
            endOut.attr("stroke", "red");
        }
        endOut.attr({"stroke-width": "1"});
        endOut.attr({"fill": "white"});
        var endIn = this.paper.circle(node.x + this.circle_R - this.mX, node.y + this.circle_R - this.mY, this.circle_R - 5);
        endIn.attr({"stroke-width": "2"});
        endIn.attr({"stroke": "black"});
        endIn.attr({"fill": "white"});
        var text = endOut.paper.text(node.x + this.circle_R - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + text.node.clientHeight / 2 - this.mY;
        text.attr({"y": "" + text_y});
        endOut.hover(function (e) {
            endOut.attr({"cursor": "pointer"});
            endIn.attr({"cursor": "pointer"});
        }, function () {
        });
        return endOut;
    },

    createUserTaskNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"stroke-width": "2"});
        out.attr({"fill": "white"});
        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/UserTask-icon.png", node.x + 2 - this.mX, node.y + 2 - this.mY, 18, 18);
        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        $(out[0]).attr("key", node.key);
        $(image[0]).attr("key", node.key);
        $(text[0]).attr("key", node.key);
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createServiceTaskNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"stroke-width": "2"});
        out.attr({"fill": "white"});
        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ServiceTask-icon.png", node.x + 2 - this.mX, node.y + 2 - this.mY, 18, 18);
        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createManualTaskNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"fill": "white"});
        out.attr({"stroke-width": "2"});
        out.attr({"fill": "white"});
        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/ManualTask-icon.png", node.x + 2 - this.mX, node.y + 2 - this.mY, 18, 18);
        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createAuditNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"stroke-width": "2"});
        out.attr({"fill": "white"});
        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/Audit-icon.png", node.x + 2 - this.mX, node.y + 2 - this.mY, 18, 18);
        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        $(out[0]).attr("key", node.key);
        $(image[0]).attr("key", node.key);
        $(text[0]).attr("key", node.key);
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    //绘制菱形
    createDiamond: function (node) {
        var line1 = this.paper.path("M" + (node.x - this.mX) + " " + (node.y + 25 - this.mY) + "L" + (node.x + 25 - this.mX) + " " + (node.y + 2 * 25 - this.mY));
        var line2 = this.paper.path("M" + (node.x + 25 - this.mX) + " " + (node.y + 2 * 25 - this.mY) + "L" + (node.x + 2 * 25 - this.mX) + " " + (node.y + 25 - this.mY));
        var line3 = this.paper.path("M" + (node.x + 2 * 25 - this.mX) + " " + (node.y + 25 - this.mY) + "L" + (node.x + 25 - this.mX) + " " + (node.y - this.mY));
        var line4 = this.paper.path("M" + (node.x + 25 - this.mX) + " " + (node.y - this.mY) + "L" + (node.x - this.mX) + " " + (node.y + 25 - this.mY));
        var diamond = this.paper.set();
        diamond.push(line1, line2, line3, line4);
        if (this.isLastNodeInPath(node)) {
            line1.attr("stroke", "red");
            line2.attr("stroke", "red");
            line3.attr("stroke", "red");
            line4.attr("stroke", "red");
            diamond.attr("stroke", "red");
        }
        diamond.attr({"stroke-width": "2"});
        diamond.attr({"type": "diamond"});
        diamond.attr({"fill": "white"});
        diamond.data({"diamond": "diamond"});
        return diamond;
    },

    createForkNode: function (node) {
        var fork = this.createDiamond(node);
        var forkShadow = this.paper.rect(node.x + 7.5 - this.mX, node.y + 7.5 - this.mY, 35.4, 35.4, 0).transform("r45");
        forkShadow.attr({"fill": "white"});
        if (this.isLastNodeInPath(node)) {
            forkShadow.attr("stroke", "red");
        }
        fork.paper.path("M" + (node.x + 25 - 15 - this.mX) + " " + (node.y + 25 - this.mY) + "L" + (node.x + 25 + 15 - this.mX) + " " + (node.y + 25 - this.mY))
        fork.paper.path("M" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 + 10 - this.mY) + "L" + (node.x + 25 - 6 - this.mX) + " " + (node.y + 25 - this.mY))
        fork.paper.path("M" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 - 10 - this.mY) + "L" + (node.x + 25 - 6 - this.mX) + " " + (node.y + 25 - this.mY))
        var text = fork.paper.text(node.x + 25 - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + 15 - this.mY;
        text.attr({"y": "" + text_y});
        forkShadow.hover(function () {
            forkShadow.attr({"cursor": "pointer"});
        }, function () {
        });
        return fork;
    },

    createJoinNode: function (node) {
        var join = this.createDiamond(node);
        var joinShadow = this.paper.rect(node.x + 7.5 - this.mX, node.y + 7.5 - this.mY, 35.4, 35.4, 0).transform("r45");
        if (this.isLastNodeInPath(node)) {
            joinShadow.attr("stroke", "red");
        }
        joinShadow.attr({"fill": "white"});
        join.paper.path("M" + (node.x + 25 - 15 - this.mX) + " " + (node.y + 25 - this.mY) + "L" + (node.x + 25 + 15 - this.mX ) + " " + (node.y + 25 - this.mY))
        join.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 + 10 - this.mY) + "L" + (node.x + 25 + 6 - this.mX) + " " + (node.y + 25 - this.mY))
        join.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 - 10 - this.mY) + "L" + (node.x + 25 + 6 - this.mX) + " " + (node.y + 25 - this.mY))

        var text = join.paper.text(node.x + 25 - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + 15 - this.mY;
        text.attr({"y": "" + text_y});
        joinShadow.hover(function () {
            joinShadow.attr({"cursor": "pointer"});
        }, function () {
        });
        return join;
    },

    createExclusiveForkNode: function (node) {
        var exclusive = this.createDiamond(node);
        var exclusiveShadow = this.paper.rect(node.x + 7.5 - this.mX, node.y + 7.5 - this.mY, 35.4, 35.4, 0).transform("r45");
        if (this.isLastNodeInPath(node)) {
            exclusiveShadow.attr("stroke", "red");
        }
        exclusiveShadow.attr({"fill": "white"});
        exclusive.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 - 5 - this.mY) + "L" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 + 5 - this.mY))
        exclusive.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 + 5 - this.mY) + "L" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 - 5 - this.mY))

        var text = exclusive.paper.text(node.x + 25 - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + 15 - this.mY;
        text.attr({"y": "" + text_y});
        ;
        exclusiveShadow.hover(function () {
            exclusiveShadow.attr({"cursor": "pointer"});
        }, function () {
        });
        return exclusive;
    },

    createComplexJoinNode: function (node) {
        var complex = this.createDiamond(node);
        var complexShadow = this.paper.rect(node.x + 7.5 - this.mX, node.y + 7.5 - this.mY, 35.4, 35.4, 0).transform("r45");
        complexShadow.attr({"fill": "white"});
        if (this.isLastNodeInPath(node)) {
            complexShadow.attr("stroke", "red");
        }
        complex.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 - 5 - this.mY ) + "L" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 + 5 - this.mY))
        complex.paper.path("M" + (node.x + 25 - 5 - this.mX) + " " + (node.y + 25 + 5 - this.mY) + "L" + (node.x + 25 + 5 - this.mX) + " " + (node.y + 25 - 5 - this.mY))
        complex.paper.path("M" + (node.x + 25 - 7 - this.mX) + " " + (node.y + 25 - this.mY) + "L" + (node.x + 25 + 7 - this.mX) + " " + (node.y + 25 - this.mY))
        complex.paper.path("M" + (node.x + 25 - this.mX) + " " + (node.y + 25 - 7 - this.mY) + "L" + (node.x + 25 - this.mX) + " " + (node.y + 25 + 7 - this.mY))


        var text = complex.paper.text(node.x + 25 - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + 15 - this.mY;
        text.attr({"y": "" + text_y});
        complexShadow.hover(function () {
            complexShadow.attr({"cursor": "pointer"});
        }, function () {
        });
        return complex;
    },

    createDecisionNode: function (node) {
        var decision = this.createDiamond(node);
        var decisionShadow = this.paper.rect(node.x + 7.5 - this.mX, node.y + 7.5 - this.mY, 35.4, 35.4, 0).transform("r45");
        decisionShadow.attr({"fill": "white"});
        if (this.isLastNodeInPath(node)) {
            decisionShadow.attr("stroke", "red");
        }
        var image = decision.paper.text(node.x + 25 - this.mX, node.y + 25 - this.mY, "?");
        image.attr("font-size", "25px");
        if (this.isIE()) {
            this.textFormat(image);
        }
        var text = decision.paper.text(node.x + 25 - this.mX, node.y + node.height, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        var text_y = text.attr().y + 15 - this.mY;
        text.attr({"y": "" + text_y});
        decisionShadow.hover(function () {
            decisionShadow.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
        }, function () {
        });
        return decision;
    },

    createSubProcessNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"fill": "white"});
        out.attr({"stroke-width": "2"});

        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/SubProcess-icon.png", node.x + node.width / 2 - 10 - this.mX, node.y + node.height - 18 - this.mY, 18, 18);

        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createInlineNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"fill": "white"});
        out.attr({"stroke-width": "2"});

        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/Inline-icon.png", node.x + node.width / 2 - 10 - this.mX, node.y + node.height - 18 - this.mY, 18, 18);

        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createDataMapNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"fill": "white"});
        out.attr({"stroke-width": "2"});

        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/DataMap-icon.png", node.x + node.width / 2 - 10 - this.mX, node.y + node.height - 18 - this.mY, 18, 18)
        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        $(out[0]).attr("key", node.key);
        $(image[0]).attr("key", node.key);
        $(text[0]).attr("key", node.key);
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createCounterSignNode: function (node) {
        var out = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            out.attr("stroke", "red");
        }
        out.attr({"stroke-width": "2"});
        out.attr({"fill": "white"});
        //矩形内部图案
        var image = out.paper.image("yesui/ui/res/css/blue/images/bpmgraph/UserTask-icon.png", node.x + 2 - this.mX, node.y + 2 - this.mY, 18, 18);

        var text = out.paper.text(node.x + node.width / 2 - this.mX, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        out.hover(function (e) {
            out.attr({"cursor": "pointer"});
            image.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return out;
    },

    createStateActionNode: function (node) {
        var stateAction = this.paper.rect(node.x - this.mX, node.y - this.mY, node.width, node.height, 10);
        if (this.isLastNodeInPath(node)) {
            stateAction.attr("stroke", "red");
        }
        stateAction.attr({"stroke-width": "2"});
        stateAction.attr({"fill": "white"});
        var text = stateAction.paper.text(node.x - this.mX + node.width / 2, node.y + node.height / 2 - this.mY, node.caption);
        if (this.isIE()) {
            this.textFormat(text);
        }
        stateAction.hover(function (e) {
            stateAction.attr({"cursor": "pointer"});
            text.attr({"cursor": "pointer"});
        }, function () {
        });
        return stateAction;
    },
    getShowCaption: function (width, caption) {
        var fontSize = 12, textWidth = $.ygrid.getTextWidth(caption, fontSize), s = "", tempS = "";
        if (textWidth > width) {
            for (var i = 0; i < caption.length; i++) {
                tempS = tempS + caption.substr(i, 1);
                var w = $.ygrid.getTextWidth(tempS, fontSize);
                if (w >= width) {
                    tempS = tempS.substring(0, tempS.length - 1);
                    tempS += "\n";
                    s += tempS;
                    tempS = "";
                    i--;
                }
            }
            s += tempS;
        }
        return s;
    },
    brokenLine: function (sourceNode, targetNode) {
        var sourceCenter = this.getCenter(sourceNode);
        var targetCenter = this.getCenter(targetNode);
        this.isSourceLeft = sourceCenter.x <= targetCenter.x;
        this.isSourceTop = sourceCenter.y <= targetCenter.y;
    },

    stNode: function (transition) {
        var Return = {
            sourceNodeKey: transition.source,
            targetNodeKey: transition.target,
            sourceNode: this.nodeElements[transition.source],
            targetNode: this.nodeElements[transition.target]
        };
        return Return;
    }

});

YIUI.reg('bpmgraph', YIUI.Control.BPMGraph);

var BPMNodeType = (function () {
    var Return = {
        BEGIN: 0,
        END: 1,
        USER_TASK: 2,
        AUDIT: 3,
        COUNTERSIGN: 4,
        DECISION: 5,
        SUB_PROCESS: 6,
        FORK: 7,
        JOIN: 8,
        EVENT: 9,
        STATE: 10,
        TIMER: 11,
        INLINE: 12,
        DATAMAP: 13,
        COMPLEX_JOIN: 14,
        MANUAL_TASK: 15,
        EXCLUSIVE_FORK: 16,
        SERVICE_TASK: 17,
        BRANCH_END: 18,
        STATE_ACTION: 19
    };
    return Return;
})();

var BPMLineType = (function () {
    var Return = {
        STEAIGHT_LINE: 0,
        FILLET_CURVE_H_ONE: 1,
        FILLET_CURVE_V_ONE: 2,
        FILLET_CURVE_H_TWO: 3,
        FILLET_CURVE_V_TWO: 4,
        CHAMFER_CURVE_H_ONE: 5,
        CHAMFER_CURVE_V_ONE: 6,
        CHAMFER_CURVE_H_TWO: 7,
        CHAMFER_CURVE_V_TWO: 8,
        OBKIQUE_CURVE_H_TWO: 9,
        OBKIQUE_CURVE_V_TWO: 10
    };
    return Return;
})();/**
 * TabExContainer
 * 以TAB页为显示形式的单据容器，单据为Form
 */
YIUI.Control.Custom = YIUI.extend(YIUI.Control, {
	
	autoEl: "<div/>",
	
	height: "100%",
	
	onSetHeight: function(height) {
		this.el.css("height", height);
		this.custom.setHeight(height);
	},
	
	onSetWidth: function(width) {
		this.el.css("width", width);
		this.custom.setWidth(width);
	},
	
	afterRender: function(ct){
		this.base(ct);
		var custom;
		switch(this.tag) {
		case YIUI.Custom_tag.UserInfoPane:
			custom = YIUI.CUSTOMVIEW.USERINFOPANE;
			break;
		case YIUI.Custom_tag.RoleRights:
		case YIUI.Custom_tag.OperatorRights:
			var options = {
				el: this.el,
				container: this.container,
				tag: this.tag,
				width: this.el.width(),
				height: this.el.height(),
				key: this.key,
				objType: YIUI.Rights_objType[this.tag],
				formKey: YIUI.FormStack.getForm(this.ofFormID).formKey
			}
			custom = YIUI.CUSTOM_ROLERIGHTS(options);
			break;
		default :
			custom = "";
		}
		this.custom = custom;
		this.el.append(custom.el);
	}
});
YIUI.reg('custom', YIUI.Control.Custom);//父容器  #customView_li
YIUI.CUSTOMVIEW = {};
(function ($) {

	var dropdown = function() {
		
	    self._dropdownItems.slideDown("fast");
	    
	    
	    //下拉内容显示的位置
	    self._dropdownItems.slideDown("fast");

	    self._dropdownItems.css({
	    	width : self.el.width()+ "px",
			height : self.el.height() + "px"
	    });
		
		$(document).on("mousedown",function(e){
	        var target = $(e.target);

	        if((target.closest(self._dropdownItems).length == 0)
	            &&(target.closest(self.buttonLeft).length == 0)
	            &&(target.closest(self.buttonRight).length == 0)){
	        	
	            self.hideDropdownList();
	            $(document).off("mousedown");
	        }
	        self.el.removeClass("datepicker_btnClick");
	    });

	    self._hasShow = true;
	    event.stopPropagation();
	};
	var logout = function() {
		$.cookie("JSESSIONID", null);
		$.cookie("usercode", null);
		location.href = "http://localhost:8089/yes";
	};
	var exit = function() {
		$("#form").remove();
		$.cookie("JSESSIONID", null);
		$.cookie("usercode", null);
	};
	var dropdownbutton = "<div class='btn-group'> " +
							"<button data-toggle='dropdown' class='btn btn-default dropdown-toggle' onclick='dropdown()'>系统管理员<span class='caret'></span></button>" +
							"<ul class='dropdown-menu'>" +
								"<li><a class='logout' onclick='logout()'>注销</a></li>" +
								"<li><a class='exit' onclick='exit()'>退出</a></li>" +
							"</ul>" +
						"</div>"
	
	YIUI.CUSTOMVIEW.USERINFOPANE = dropdownbutton;
}(jQuery) );
(function ($) {
	YIUI.CUSTOM_ROLERIGHTS = function(options) {
		var defaul = {
			height: "100%",
			width: "100%",
			maxRows: 50,
			pageIndicatorCount: 3
		}
		options = $.extend(defaul, options);
		
		var resetItems = function(rows, pId) {
			var len = rows.length;
			if(len > 0){
				for(var i=0,len=rows.length;i<len;i++) {
					if(pId) {
						rows[i].pid = pId;
					}
					rows[i].previd = rows[i].previd;
					rows[i].id = rows[i].OID || rows[i].oid || rows[i].key.trim();
					var r_id = rows[i].id;
					if($.isString(r_id)) {
						r_id = r_id.replace(/\//g, "_");
						rows[i].id = r_id;
					}
				    if(rows[i].items && rows[i].items.length > 0) {
				    	rows[i].hasChild = true;
				    	resetItems(rows[i].items, rows[i].id);
				    } else if(rows[i].nodeType == 1) {
				    	rows[i].hasChild = true;
				    }
				}
			}
		}
		var createRowsHtml = function($table, data, pId) {
			var rows = data.rows, 
				cols = data.cols;
			resetItems(rows, pId);
			return createRows(rows, cols, $table);
		}
		var createRows = function(rows, cols, $table) {
			var html = '';
			var len = rows.length;
			if(len > 0) {
				$table.next("label.empty").remove();
				for(var i=0;i < len;i++) {
					var tr = createRow($table, rows[i], cols);
					html += tr[0].outerHTML;

					var items = rows[i].items;
					var child = "";
					if(items && items.length > 0) {
						html += createRows(items, cols, $table);
					} 
				}
			} else  {
				var label = $("<label class='empty'>表中无内容</label>");
				$table.after(label);
			}
			
			return html;
		}
		var createRow = function($table, rowdata, colModel) {
			var tr = $('<tr id="'+rowdata.id+'"></tr>').attr("oid", rowdata.OID).attr("key", rowdata.key);
			if(options.type == YIUI.Rights_type.TYPE_DICT) {
				if(rowdata.hasRights && !rowdata.changed) {
					options.dictRts.push(rowdata.id);
					var hasRts = rowdata.hasRights == 0 ? false : true;
					tr.attr('hasRts', hasRts);
				}
			} else if(options.isFFData) {
				if(!rowdata.visible) {
					options.visibleRts.push(rowdata.key);
				}
				if(!rowdata.enable) {
					options.enableRts.push(rowdata.key);
				}
			} else if(options.isFOData) {
				if(rowdata.hasRights) {
					options.optRts.push(rowdata.key);
				}
			}
			
			if(rowdata.pid != undefined ) {
				tr.attr('pId', rowdata.pid);
			}
			
			if(rowdata.previd != undefined ) {
				tr.attr('previd', rowdata.previd);
			}
				
			if(rowdata.hasChild){
				tr.attr('hasChild', true);
			}
			if(rowdata.secondaryType) {
				tr.attr("secondaryType", rowdata.secondaryType);
			}
			var value, hasRow = false;
			for (var j=0,len=colModel.length;j<len;j++) {
				value = rowdata[colModel[j].key];
				if(colModel[j].type == "checkbox") {
					var cb;
					if(colModel[j].isEntry) {
						cb = $("<span class='checkbox state0' chkstate='0'/>");
					} else {
						cb = $("<input type='checkbox' value="+value+" class='checkbox' />").attr("disabled", "disabled");
						if(value) {
							cb.attr("checked", true);
						} else if(value == undefined) {
							cb.addClass("ignore");
						}
					}
					
					if(colModel[j].key == "enable" && rowdata.disable) {
						cb.attr("enable", "false");
					}
					if(colModel[j].index) {
						cb.attr("index", colModel[j].index);
					}
					$('<td></td>').append(cb).appendTo(tr);
					if(colModel[j].showText) {
						cb.after(value);
					}
				} else {
					$('<td><span>' + value + '</span></td>').appendTo(tr);
				}
			}
			return tr;
		}
		var createTable = function(el, option, result) {
			if(result.length == 0) return null;
			el.empty();
			var colModel = result.cols;
			var $table = $('<table cellpadding="0" cellspacing="0"></table>').appendTo(el);
			$table.attr("enable", true);
			var thead = $("<thead></thead>").appendTo($table);
			$("<tbody></tbody>").appendTo($table);
			var tr = $('<tr ></tr>').appendTo(thead),
				col, i, len, width;
			tr.addClass("title");
			for (i=0,len=colModel.length;i<colModel.length;i++) {
				col = colModel[i];
				if(col.type == "checkbox" && !col.hide) {
					var cb = $("<input type='checkbox' class='checkbox all' disabled='disabled'/>");
					if(colModel[i].index) {
						cb.attr("index", col.index);
					}
					$('<th>'+col.caption+'</th>').prepend(cb).appendTo(tr);
				} else {
					$('<th>' + col.caption + '</th>').appendTo(tr);
				}
			}

			var html = createRowsHtml($table, result);
			$("tbody", $table).append($(html));
			option = $.extend({
				expandable: true
			}, option);
			$table = $table.treetable(option);
			
			var chks = $("thead tr.title .checkbox", $table), childs;
			var $trs = $("tr:not([class~='title'])", $table);
			for (var i = 0, len = chks.length; i < len; i++) {
				var type = options.type;
				switch(type) {
					case YIUI.Rights_type.TYPE_DICT:
						if(result.hasAllRights) {
							chks.eq(i).prop("checked", true);
						}
						break;
					case YIUI.Rights_type.TYPE_FORM:
						if((result.allOptRights) || (i == 0 && result.allVisibleRights) || (i == 1 && result.allEnableRights)) {
							chks.eq(i).prop("checked", true);
						}
						break;
				}
				
				
			}
			return $table;
		}

		var loadRights = function(paras) {
			var data = {};
			data.service = "SetRightsService";
			data = $.extend(data, paras);
			var result = null;
			var success = function(syncNodes) {
				if (syncNodes) {
					if(syncNodes.length > 0) {
						result = {
							rows: syncNodes,
							cols: [{
								key: "Code",
								caption: "代码"
							}, {
								key: "Name",
								caption: "名称"
							}]
						}
					} else {
						result = syncNodes;
					}
				}
			};
			Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
			return result;
		}
		
		var el = options.el || $("<div/>")
		var roleRts = el.addClass("roleRights");
		roleRts.css({
			height: '100%',
			width: '100%'
		})
		var secTxt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var left_view = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var grid = new YIUI.Panel.GridLayoutPanel({
			widths : ["99%", 50],
			minWidths : ["-1", "-1"],
    		heights : [25],
    		height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [secTxt, sec]
		});
		var left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [grid, left_view]
		});
		var right = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%"
		});
		var split = new YIUI.Panel.SplitPanel({
			height: options.height || "100%",
			width: options.width || "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'25%'}, {size:'75%'}],
			items: [left, right]
		});
		split.el = roleRts;
		split.render();
		
		var isClick = function($tr, $table) {
			var flag = false;
			if($tr.hasClass("title")) {
				flag = true;
			}
			var $selTr = $("tr.sel", $table);
			if($selTr.length > 0) {
				if($selTr.attr("id") == $tr.attr("id")) {
					flag = true;
				}
				$selTr.removeClass("sel");
				$tr.addClass("sel");
			} else {
				$tr.addClass("sel");
			}
			return flag;
		};

		var addPtrs = function(key, $ptrs, $table) {
			var tree = $table.treeNode.tree;
			var node = tree[key];
			var pId = node.parentId;
			if(pId) {
				var index = 0;
				for (var i = 0, len = $ptrs.length; i < len; i++) {
					if($ptrs[i] == pId) {
						index = i;
					}
				}
				if(index > 0) {
					$ptrs.splice(index, 0, key);
				} else {
					$ptrs.push(key);
				}
			} else {
				$ptrs.push(key);
			}
		};
		
		var l_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					var flag = isClick($tr, $table);
					if(flag) return;
					modify.setEnable(true);
					tabPanel.setEnable(true);

					options.id = $tr.attr("id");

					$dr_tbl && $dr_tbl.removeAll();
					$ff_tbl && $ff_tbl.removeAll();
					$fo_tbl && $fo_tbl.removeAll();
					
					var paras = {
						cmd: "LoadEntryRightsData",
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					}
					var data = loadRights(paras);

					$(".checkbox").removeClass("state0").removeClass("state1").removeClass("state2").addClass("state0");
					$(".checkbox").attr("chkstate", 0);
					
					$table.allRights = data.allRights;
					if(data.allRights) {
						$(".checkbox", $e_tbl).removeClass("state0").addClass("state1");
						$(".title .checkbox", $e_tbl).prop("checked", true);
						var trs = $("tbody tr", $e_tbl);
						if(!$e_tbl.entryKeys) $e_tbl.entryKeys = [];
						for (var i = 0, len = trs.length; i < len; i++) {
							var key = trs.eq(i).attr("key");
							$e_tbl.entryKeys.push(key);
						}
						
					} else {
						$(".title .checkbox", $e_tbl).prop("checked", false);
						var entryKeys = data.entryKeys, entryKey;
						$e_tbl.entryKeys = entryKeys;
						
						var $ptrs = [];
						for (var i = 0, len = entryKeys.length; i < len; i++) {
							entryKey = entryKeys[i];
							var id = entryKey.replace(/\//g, "_");
							var tr = $("[id='"+id+"']", $e_tbl);
							var $chk = $(".checkbox", tr);
							var state = 1;
							$chk.removeClass("state0");
							if(tr.attr("hasChild") == "true") {
								addPtrs(id, $ptrs, $e_tbl);
							} else {
								$chk.addClass("state1");
								$chk.attr("chkstate", 1);
							}
						}
						
						for (var i = 0, len = $ptrs.length; i < len; i++) {
							var pId = $ptrs[i];
							var $ptr = $("[id='"+$ptrs[i]+"']", $e_tbl);
							var hasState0 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state0");
							var hasState1 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state1");
							var hasState2 = $("[pId='"+pId+"'] .checkbox", $e_tbl).hasClass("state2");
							if(hasState0 && !hasState1 && !hasState2) {
								continue;
							} else if (hasState1 && !hasState0 && !hasState2) {
								$(".checkbox", $ptr).addClass("state1");
								$(".checkbox", $ptr).attr("chkstate", 1);
							} else {
								$(".checkbox", $ptr).addClass("state2");
								$(".checkbox", $ptr).attr("chkstate", 2);
							}
						}
					}

					if(options.clickTr && (options.clickTr.parents(".ui-pnl:eq(0)").attr("id") != $tr.parents(".ui-pnl:eq(0)").attr("id"))) {
						options.clickTr.removeClass("sel");
						options.clickTr.click();
					} else {
						options.clickTr = $tr;
					}
				}
				
			}
		};

		var $l_tbl;

		var right_ch = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%"
		});
		var modify = new YIUI.Control.Button({
			value: "修改",
			metaObj: {
				x: 0,
				y: 0
			},
			listeners: null
		});
		var save = new YIUI.Control.Button({
			value: "保存",
			metaObj: {
				enable: false,
				x: 1,
				y: 0
			},
			listeners: null
		});
		var cancel = new YIUI.Control.Button({
			value: "取消",
			metaObj: {
				enable: false,
				x: 2,
				y: 0
			},
			listeners: null
		});
		
		var tools = new YIUI.Panel.GridLayoutPanel({
			widths: [50, 50, 50, "100%"],
			minWidths: ["-1", "-1", "-1", "-1"],
			heights: [25, 5],
			metaObj: {
				columnGap: 3
			},
    		height: 30,
			items: [modify, save, cancel]
		}); 
		
		var e_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			},
			height: "100%",
			width: "100%"
		});
		
		var eItem = new YIUI.Panel({
			height: "100%",
			metaObj: {
				title: '入口权限设置'
			},
			items: [e_flow]
		});
		
		var d_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var d_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var d_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25, 5],
			height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [d_txt, d_sec]
		}); 
		var d_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var dr_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var dr_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var dr_grid = new YIUI.Panel.GridLayoutPanel({
			key: "test",
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25, 5],
			height: 30,
			metaObj: {
				columnGap: 3,
				visible: false
			},
			items: [dr_txt, dr_sec]
		}); 
		var dr_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var d_left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [d_grid, d_flow]
		});
		var dr = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [dr_grid, dr_flow]
		});
		var d_spl = new YIUI.Panel.SplitPanel({
			height: "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'30%'}, {size:'70%'}],
			items: [d_left, dr]
		});
		
		var dItem = new YIUI.Panel({
			height: "100%",
			metaObj: {
				title: '字典权限设置'
			},
			items: [d_spl]
		});
		
		var fItem_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var f_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var f_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25],
			metaObj: {
				columnGap: 3
			},
    		height: 30,
			items: [fItem_txt, f_sec]
		}); 
		var f_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var f_left = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			items: [f_grid, f_flow]
		});
		
		var fr_txt = new YIUI.Control.TextEditor({
			metaObj: {
				x: 0,
				y: 0
			}
		});
		var fr_sec = new YIUI.Control.Button({
			value: "搜索",
			metaObj: {
				x: 1,
				y: 0
			}
		});
		var fr_grid = new YIUI.Panel.GridLayoutPanel({
			widths: ["100%", 50],
			minWidths: ["-1", "-1"],
			heights: [25],
    		height: 30,
			metaObj: {
				columnGap: 3
			},
			items: [fr_txt, fr_sec]
		}); 
		var fr_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});

		var ff_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		
		var ff = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				visible: false
			},
			items: [ff_flow]
		});
		var fo_flow = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				overflowX: "auto",
				overflowY: "auto"
			}
		});
		var fo = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				visible: false
			},
			items: [fo_flow]
		});
		
		var f_right = new YIUI.Panel.SplitPanel({
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'40%'}, {size:'60%'}],
			items: [fo, ff]
		});
		
		var f_spl = new YIUI.Panel.SplitPanel({
			height: "100%",
			metaObj: {
				orientation: "horizontal"
			},
			splitSizes: [{size:'30%'}, {size:'70%'}],
			items: [f_left, f_right]
		});
		
		var fItem = new YIUI.Panel.FlexFlowLayoutPanel({
			height: "100%",
			metaObj: {
				title: '表单权限设置'
			},
			items: [f_spl]
		});
		var tabPanel = new YIUI.Panel.TabPanel({
			height: "100%",
			items: [eItem, dItem, fItem]
		});
		
		right_ch.add(tools);
		right_ch.add(tabPanel);
		
		right.add(right_ch);
		right.doRenderChildren(false, true);
		
		var e_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					options.type = YIUI.Rights_type.TYPE_ENTRY;
					if($tr.hasClass("title")) {
						var allRights = $(".checkbox", $tr).is(":checked");
						$table.allRights = allRights;
						if(allRights) {
							$(".checkbox", $table).removeClass("state2").removeClass("state0").addClass("state1");
							
							var trs = $("tbody tr", $table);
							if(!$table.entryKeys) $table.entryKeys = [];
							for (var i = 0, len = trs.length; i < len; i++) {
								var key = trs.eq(i).attr("key");
								$table.entryKeys.push(key);
							}
						} else {
							$(".checkbox", $table).removeClass("state1").addClass("state0");
							$e_tbl.entryKeys = [];
						}
						return;
					}
					if(!$($table.target).hasClass("checkbox")) {
						return;
					}
					var id = $tr.attr("id");
					var isCheck = $(".checkbox", $tr).is(":checked");
					
					var state = $(".checkbox", $tr).attr('chkstate') == 0 ? 1 : 0;
					$(".checkbox", $tr).attr('chkstate', state);
					if(state > 0) {
						$(".checkbox", $tr).removeClass("state0").removeClass("state2").addClass("state1");
					} else {
						$(".checkbox", $tr).removeClass("state1").removeClass("state2").addClass("state0");
					}
					
					setRts(id, state, $table);
					checkCtr($table, id, state);
					checkPtr($table, id, state);
					
				}
			}
		};
		
		var setEntryRts = function(id, state, $table) {
			var type = options.type, $table;
			$table = $e_tbl;
			
			if((state == 0) && $table.allRights) {
				$table.allRights = false;
			}
			//是否有所有权限
			if(!$table.entryKeys)  $table.entryKeys= [];
			var entryKeys = $table.entryKeys;
			
			if(state > 0) {
				var key = $("#"+id, $table).attr("key");
				entryKeys.push(key);
			} else {
				$(".title .checkbox", $table).prop("checked", false);
				if($("[id='"+id+"'] .checkbox", $table).attr("chkstate") == 2) return;
				for (var i = 0, len = entryKeys.length; i < len; i++) {
					if(entryKeys[i].replace(/\//g, "_") == id) {
						entryKeys.splice(i, 1);
						break;
					}
				}
			}
			
		};

		var setDictRts = function(id, isCheck, $table) {
			var node = $table.treeNode.tree[id];
			var hasRts = node.row.attr('hasRts') == undefined ? false : true;
			if(isCheck != hasRts && !node.changed) {
				node.changed = true;
			}

			var isChain = options.clickTr.attr("secondaryType") == 5;
			if(!isChain) return;
			
			var addRts = options.dict.addRts;
			var delRts = options.dict.delRts;
			var dictRts = $table.dictRts;
			var isAdd = true;
			for (var i = 0, len = dictRts.length; i < len; i++) {
				if(dictRts[i] == id) {
					isAdd = false;
					break;
				}
			}
			if(isCheck) {
				//选中
				if(isAdd) {
					addRts.push(id);
				} else {
					for (var i = 0, len = delRts.length; i < len; i++) {
						if(delRts[i] == id) {
							delRts.splice(i, 1);
							break;
						}
					}
				}
			} else {
				//取消
				if(isAdd) {
					for (var i = 0, len = addRts.length; i < len; i++) {
						if(addRts[i] == id) {
							addRts.splice(i, 1);
							break;
						}
					}
				} else {
					delRts.push(id);
				}

			}
		};
		
		var setFormRts = function(id, isCheck, $table, chkData) {
			if(chkData) {
				var enable = chkData.enable;
				var visible = chkData.visible;
				var enableExist = false;
				var visibleExist = false;
				for (var i = 0, len = $table.enableRts.length; i < len; i++) {
					if($table.enableRts[i] == chkData.id) {
						enableExist = true;
						if(enable) {
							$table.enableRts.splice(i, 1);
						}
						break;
					}
				}
				if(!enableExist && !enable) {
					$table.enableRts.push(chkData.id);
					$table.hasAllEnableRights = false;
				}
				for (var i = 0, len = $table.visibleRts.length; i < len; i++) {
					if($table.visibleRts[i] == chkData.id) {
						visibleExist = true;
						if(visible) {
							$table.visibleRts.splice(i, 1);
						}
						break;
					}
				}
				if(!visibleExist && !visible) {
					$table.visibleRts.push(chkData.id);
					$table.hasAllVisibleRights = false;
				}
			} else {
				var optExist = false;
				for (var i = 0, len = $table.optRts.length; i < len; i++) {
					if($table.optRts[i] == id) {
						optExist = true;
						if(!isCheck) {
							$table.optRts.splice(i, 1);
						}
					}
				}
				if(!optExist && isCheck) {
					$table.optRts.push(id);
					$table.hasAllOptRights = false;
				}
			}
			

		};
		
		var setRts = function(id, isCheck, $table, chkData) {
			var type = options.type, $table;
			switch(type) {
				case YIUI.Rights_type.TYPE_ENTRY:
					setEntryRts(id, isCheck, $table);
					break;
				case YIUI.Rights_type.TYPE_DICT:
					setDictRts(id, isCheck, $table, chkData);
					break;
				case YIUI.Rights_type.TYPE_FORM:
					setFormRts(id, isCheck, $table, chkData);
					break;
			}
		}
		
		var checkCtr = function($table, id, isCheck, index) {
			if(!id) return;
			var node = $table.treeNode.tree[id], pNode, $chk, tr;
			var children = node.children, child;
			if(!children || children.length == 0) return;
			for (var i = 0, len = children.length; i < len; i++) {
				child = children[i];
//				var $ctr = child.row;
				var $ctr = $("[id='"+child.id+"']", $table);
				$chk = $(".checkbox:not([index])", $ctr);
				if(options.isField) {
					if(index > 0) {
						$chk = $(".checkbox[index='"+index+"']", $ctr);
					}
					tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!isCheck) {
							$(".checkbox", tr).eq(1).prop("checked", false);
							chkData.enable = false;
						}
						chkData.visible = isCheck;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(isCheck) {
							$(".checkbox", tr).eq(0).prop("checked", true);
							chkData.visible = true;
						}
						chkData.enable = isCheck;
					}
					if(index == 0) {
						chkData.visible = isCheck;
					} else if(index == 1) {
						chkData.enable = isCheck;
					}
					setRts(tr.attr("id"), isCheck, $table, chkData);
				} else {
					if($chk.attr("chkstate") > -1) {
						if($chk.attr("chkstate") != isCheck) {
							$chk.removeClass("state0").removeClass("state1").removeClass("state2")
							.addClass("state" + isCheck).attr("chkstate", isCheck);
						}
					}
					setRts(child.id, isCheck, $table);
				}
				if(!$chk.attr("chkstate")) {
//					if($chk.attr("chkstate") != isCheck) {
//						$chk.removeClass("state0").removeClass("state1").removeClass("state2")
//						.addClass("state" + isCheck).attr("chkstate", isCheck);
//					}
//				} else {
					$chk.prop("checked", isCheck);
				}
				checkCtr($table, child.id, isCheck);
			}
		};
		var checkPtr = function($table, id, isCheck, index) {
			var node = $table.treeNode.tree[id], $chk;
			if(node) {
				var pId = node.parentId;
				if(!pId) return;
				var pNode = $table.treeNode.tree[pId];
				
//				var $pr = $table.treeNode.tree[pId].row;
				var $pr = $("[id='"+pId+"']", $table);
				$chk = $(".checkbox:not([index])", $pr);
//				if(isCheck && $chk.is(":checked") != isCheck) {
				if(/*isCheck && */$chk.attr("chkstate") != isCheck) {
//					$chk.prop("checked", true);
					//半勾状态
					var $ctrs = $("[pid='"+pId+"']", roleRts);
					if($(".checkbox", $ctrs).hasClass("state0") || $(".checkbox", $ctrs).hasClass("state2")) {
						if(!$(".checkbox", $ctrs).hasClass("state1") && !$(".checkbox", $ctrs).hasClass("state2")) {
							$chk.removeClass("state1").removeClass("state2").addClass("state0").attr("chkstate", 0);
						} else {
							$chk.removeClass("state0").removeClass("state1").addClass("state2").attr("chkstate", 2);
						}
					} else if(!$(".checkbox", $ctrs).hasClass("state2")) {
						$chk.removeClass("state2").addClass("state1").attr("chkstate", 1);
					}
				}
				if(options.isField) {
					if(index > 0) {
						$chk = $(".checkbox[index='"+index+"']", $pr);
					}
					var tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!isCheck) {
//							$(".checkbox", tr).eq(1).prop("checked", false);
						}
//						chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
//						chkData.visible = isCheck;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(isCheck) {
							$(".checkbox", tr).eq(0).prop("checked", true);
							chkData.visible = true;
						}
//						chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
//						chkData.enable = isCheck;
					}
					if(isCheck) {
						$(".checkbox", tr).eq(index).prop("checked", true);
					}
					chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
					setRts(tr.attr("id"), isCheck, $table, chkData);
				} else {
					if($.isNumeric(isCheck) && $chk.attr("chkstate") != isCheck) {
						setRts(pId, isCheck, $table);
					} else if(isCheck && $chk.prop("checked") != isCheck) {
						$chk.prop("checked", true);
						setRts(pId, isCheck, $table);
					}
				}
				checkPtr($table, pId, isCheck)
			}
		}
		var $e_tbl = null;

		var d_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!options.id) return;
					var flag = isClick($tr, $table);
					if(flag) return;
					options.clickTr = $tr;
					
					$dr_tbl && $dr_tbl.removeAll();
					options.type = YIUI.Rights_type.TYPE_DICT;
					options.itemKey = $tr.attr("id");
					
					options.dict = {
						addRts: [],
						delRts: [],
						saveType: 0,
						allRights: false
					};
					
					var id = $tr.attr("id");
					var itemKey = id;
					var paras = {
						cmd: "LoadDictRightsData",
						itemKey: itemKey,
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					};
					var $el = dr_flow.el;
					var isChain = $tr.attr("secondaryType") == 5;
					if(isChain) {
						dr_grid.setVisible(true);
						paras.cmd = "LoadChainDictRightsData";
						paras.startRow = 0;
						paras.maxRows = options.maxRows;
						paras.pageIndicatorCount = options.pageIndicatorCount;
						paras.value = $("input", dr_txt.el).val();
						$el.empty();
					} else {
						dr_grid.setVisible(false);
					}
					var newData = loadRights(paras);
					if(!newData) return;
					if(!dr.visisble) dr.setVisible(true);
					
					if(isChain) {
						var count = newData.totalRowCount;
						var page = dr_flow.el.pagination({
							pageSize: 50,
							//总记录数
					        totalNumber: count,
					        showPages: true,
					        showPageDetail: false,
					        showFirstButton: false,
					        showLastButton: false,
					        pageIndicatorCount: 3
						});
						$el = page.content;

				    	var pagesH = $(".paginationjs-pages", dr_flow.el).is(":hidden") ? 0 : $(".paginationjs-pages", dr_flow.el).outerHeight();
				    	var realHeight = dr_flow.el.height() - pagesH;
				    	page.content.css("height", realHeight);

						page.pageChanges = function(pageNum) {
							var data = getChainDictData(itemKey, pageNum);
							$dr_tbl.removeAll();
							options.dictRts = [];
							$dr_tbl = createTable($el, dr_opt, data);
							$dr_tbl.dictRts = options.dictRts;
							page.setTotalRowCount(pageNum*50 + data.totalRowCount);
							if(!modify.enable) {
								$(".checkbox", $dr_tbl).removeAttr("disabled");
							}
				        };
				        options.setTotalRowCount = function(pageNum, totalRowCount) {
							page.setTotalRowCount(totalRowCount);
				        };
					}
					
					options.dictRts = [];
					var tblData = {
						rows: newData.data,
						cols: [{
								key: "code",
								caption: "编码"
							}, {
								key: "name",
								caption: "名称"
							}, {
								key: "hasRights",
								type: "checkbox",
								caption: "是否有权限"
							}],
						hasAllRights: newData.hasAllRights
					};
					options.dict.allRights = newData.hasAllRights;
					
					$dr_tbl = createTable($el, dr_opt, tblData);
					$dr_tbl.dictRts = options.dictRts;
					$dr_tbl.isChain = isChain;
				}
			}
		};
		var $d_tbl = null;
		
		var getChainDictData = function(itemKey, pageNum) {
			var data = {
				cmd: "LoadChainDictRightsData",
				itemKey: itemKey,
				startRow: pageNum * options.maxRows,
				maxRows: options.maxRows,
				pageIndicatorCount: options.pageIndicatorCount,
				value: $("input", dr_txt.el).val(),
				operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
				roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
			};
			var chainData = loadRights(data);
			var data = {
				rows: chainData.data,
				cols: [{
						key: "code",
						caption: "编码"
					}, {
						key: "name",
						caption: "名称"
					}, {
						key: "hasRights",
						type: "checkbox",
						caption: "是否有权限"
					}],
				hasAllRights: chainData.hasAllRights,
				totalRowCount: chainData.totalRowCount
			}
			return data;
		}
		
		var dr_opt = {
			theme : 'default',
			expandLevel : 1,
			beforeExpand : function(node) {
				var id = node.attr('id');
				var expanded = node.attr('expanded');
				if(expanded) return;
				var data = {
					cmd: "LoadDictRightsData",
					itemKey: options.itemKey,
					parentID: id,
					operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
					roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
				};
				var newData = loadRights(data);
				var dictData = newData.data;
				var item = $dr_tbl.treeNode.tree[id];
				var changed = item.changed;
				var checked = false;
				
				var data = {
					rows: dictData,
					cols: [{
							key: "code",
							caption: "编码"
						}, {
							key: "name",
							caption: "名称"
						}, {
							key: "hasRights",
							type: "checkbox",
							caption: "是否有权限"
						}],
					hasAllRights: newData.hasAllRights
				}
				
				var html = createRowsHtml($dr_tbl, data, id);
				$dr_tbl.addChilds(html);
				node.attr("expanded", "expanded");
				if(!modify.enable) {
					$(".checkbox", $dr_tbl).removeAttr("disabled");
				}
				
				if(changed) {
					checked = $(".checkbox", node).is(":checked");
					if(dictData.length > 0) {
						for (var i = 0, len = dictData.length; i < len; i++) {
							var $id = dictData[i].oid;
//							dictData[i].previd = dictData[i].oid;
							var $item = $dr_tbl.treeNode.tree[$id];
							var hasRts = dictData[i].hasRights == 0 ? false : true;
//							$item.hasRights = hasRts;
							if(hasRts != checked) {
								$item.changed = true;
								if(checked) {
									$(".checkbox", $item.row).prop("checked", true);
									options.dict.addRts.push($id);
								} else {
									$(".checkbox", $item.row).prop("checked", false);
									options.dict.delRts.push($id);
								}
							}
						}
					}
				}
				
			},
			onSelect : function($table, $tr) {
				if(!$table.target.hasClass("checkbox")) return;
				setChecked($table);
				var checked = $(".checkbox", $tr).is(":checked");
				if(!checked && options.dict.allRights) {
					options.dict.allRights = false;
					options.dict.saveType = 1;
				}
			}
		};
		
		var $dr_tbl = null;
		
		var f_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!options.id) return;
					var flag = isClick($tr, $table);
					if(flag) return;
					options.clickTr = $tr;
					if(!ff.visible) ff.setVisible(true);
					if(!fo.visible) fo.setVisible(true);
					$ff_tbl && $ff_tbl.removeAll();
					$fo_tbl && $fo_tbl.removeAll();
					options.type = YIUI.Rights_type.TYPE_FORM;
					options.formKey = $tr.attr("id");
					var id = $tr.attr("id");
					var formkey = id;
					var data = {
						cmd: "LoadFormRightsData",
						formKey: formkey,
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					};
					
					var formRoot = loadRights(data);
					
					//表单的所有可用性、可见性、可操作性
					if(formRoot.fieldData) {
						var field_data = {
								rows: formRoot.fieldData,
								cols: [{
									key: "caption",
									caption: "名称"
								}, {
									key: "key",
									caption: "标识"
								}, {
									key: "visible",
									caption: "是否可见",
									type: "checkbox",
									index: 0
								}, {
									key: "enable",
									caption: "是否可编辑",
									type: "checkbox",
									index: 1
								}],
								allEnableRights: formRoot.hasAllEnableRights,
								allVisibleRights: formRoot.hasAllVisibleRights
						};
						options.isFFData = true;
						options.visibleRts = [];
						options.enableRts = [];
						$ff_tbl = createTable(ff_flow.el, ff_opt, field_data);
						$ff_tbl.hasAllEnableRights = formRoot.hasAllEnableRights;
						$ff_tbl.hasAllVisibleRights = formRoot.hasAllVisibleRights;
						$ff_tbl.enableRts = options.enableRts;
						$ff_tbl.visibleRts = options.visibleRts;
						options.isFFData = false;
					}
					
					if(formRoot.optData) {
						var opt_data = {
								rows: formRoot.optData,
								cols: [{
									key: "caption",
									caption: "名称"
								},{
									key: "key",
									caption: "标识"
								}, {
									key: "hasRights",
									type: "checkbox",
									caption: "是否有权限"
								}],
								allOptRights: formRoot.hasAllOptRights
						};
						options.isFOData = true;
						options.optRts = [];
						$fo_tbl = createTable(fo_flow.el, fo_opt, opt_data);
						$fo_tbl.optRts = options.optRts;
						$fo_tbl.hasAllOptRights = formRoot.hasAllOptRights;
						options.isFOData = false;
					}
				}
			}
		};
		var $f_tbl = null;

		var ff_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					options.isField = true;
					var target = $table.target;
					var index = target.attr("index") || 0;
					setFormChecked($table, index);
					options.isField = false;
				}
			}
		};
		var $ff_tbl = null;
		
		var fo_opt = {
			theme : 'default',
			expandLevel : 1,
			onSelect : function($table, $tr) {
				if($table.attr("enable") == "true") {
					if(!$table.target.hasClass("checkbox")) return;
					setChecked($table);
				}
			}
		};
		var $fo_tbl = null;
		
		var setChecked = function($table) {
			var target = $table.target;
			var $cks = $("tr.title .checkbox", $table), $chk, tmp;
			var checked = target.is(":checked");
			var $trs = $("tr:not([class~='title'])", $table);
			if(target.parents("tr").hasClass("title")) {
				for (var i = 0, len = $trs.length; i < len; i++) {
					$chk = $(".checkbox", $trs.eq(i));
					if($chk.attr("enable") == "false") continue;
					$chk.prop("checked", checked);
					var tr = $chk.parents("tr").eq(0);
					setRts(tr.attr("id"), checked, $table);
				}
				
				var type = options.type;
				switch(type) {
					case YIUI.Rights_type.TYPE_DICT:
						if(checked) {
							options.dict.allRights = true;
							options.dict.saveType = 1;
						} else {
							options.dict.allRights = false;
							options.dict.saveType = -1;
						}
						break;
					case YIUI.Rights_type.TYPE_FORM:
						if(checked) {
							$table.allOptRights = true;
						} else {
							$table.allOptRights = false;
						}
						break;
				}
			} else {
				var tr = target.parents("tr").eq(0);
				var pid = tr.attr("pid");

				setRts(tr.attr("id"), checked, $table);
				checkCtr($table, tr.attr("id"), checked);
				checkPtr($table, tr.attr("id"), checked);				
				
				var isAllCk = true;
				var cks = $(".checkbox:not([enable='false'])", $trs);
				for (var i = 0, len = cks.length; i < len; i++) {
					var cked = cks.eq(i).is(":checked");
					if(!cked) isAllCk = false;
				}
				if(!isAllCk) {
					$(".checkbox", $("tr[class~='title']", $table)).prop("checked", false);
					if($table.allOptRights) {
						$table.allOptRights = false;
					}
				}
			}
		};
		
		var setFormChecked = function($table, index) {
			var target = $table.target;
			var $cks = $("tr.title .checkbox", $table), $chk, tmp;
			var checked = target.is(":checked");
			if(!index) {
				index = 0;
				$table.hasAllVisibleRights = checked;
				if(!checked) {
					$(".checkbox", target.parents("tr")).eq(1).prop("checked", false);
					$table.hasAllEnableRights = false;
				}
			} else {
				$table.hasAllEnableRights = checked;
				if(checked) {
					$(".checkbox", target.parents("tr")).eq(0).prop("checked", true);
					$table.hasAllEnableRights = true;
				}
			}
			var $trs = $("tr:not([class~='title'])", $table);
			if(target.parents("tr").hasClass("title")) {
				for (var i = 0, len = $trs.length; i < len; i++) {
					var $tr = $trs.eq(i);
					$chk = $(".checkbox:not([class~='ignore'])", $tr).eq(index);
					if($chk.length == 0 || $chk.attr("enable") == "false") continue;
					$chk.prop("checked", checked);
					var tr = $chk.parents("tr").eq(0);
					var chkData = {
						id: tr.attr("id")
					};
					if(index == 0) {
						//可见为false时相应的enable为false
						if(!checked) {
							$(".checkbox", tr).eq(1).prop("checked", false);
						}
						chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
						chkData.visible = checked;
					}
					if(index == 1) {
						//enable全部为true时相应的visible也为true
						if(checked) {
							$(".checkbox", tr).eq(0).prop("checked", true);
						}
						chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
						chkData.enable = checked;
					}
					setRts(tr.attr("id"), checked, $table, chkData);
				}
			} else {
				var tr = target.parents("tr").eq(0);
				var chkData = {
					id: tr.attr("id")
				}
				if(index == 0) {
					//可见为false时相应的enable为false
					if(!checked) {
						$(".checkbox", tr).eq(1).prop("checked", false);
					}
					chkData.enable = $(".checkbox", tr).eq(1).prop("checked");
					chkData.visible = checked;
				}
				if(index == 1) {
					//enable全部为true时相应的visible也为true
					if(checked) {
						$(".checkbox", tr).eq(0).prop("checked", true);
					}
					chkData.visible = $(".checkbox", tr).eq(0).prop("checked");
					chkData.enable = checked;
				}
				var pid = tr.attr("pid");
				
				setRts(tr.attr("id"), checked, $table, chkData);
				checkCtr($table, tr.attr("id"), checked, index);
				checkPtr($table, tr.attr("id"), checked, index);				
				
				var chks = $("thead tr.title .checkbox", $table), childs;
				var $trs = $("tr:not([class~='title'])", $table);
				for (var i = 0, len = chks.length; i < len; i++) {
					var isAllCk = true;
					if(i != 0) {
						childs = $(".checkbox[index='"+i+"'].checkbox:not([enable='false']):not([class ~='ignore'])", $trs);
					} else {
						childs = $(".checkbox:not([index]):not([enable='false']):not([class ~='ignore'])", $trs);
					}
					var length = childs.length;
					if(length == 0) {
						chks.eq(i).attr("enable", "false");
						break;
					}
					for (var j = 0; j < length; j++) {
						var cked = childs.eq(j).is(":checked");
						if(!cked) isAllCk = false;
					}
					if(!isAllCk) {
						chks.eq(i).prop("checked", false);
						if(i == 0) {
							$table.hasAllEnableRights = isAllCk;
						} else {
							$table.hasAllVisibleRights = isAllCk;
						}
					}
				}
			}
		};

		var getUserList = function(result) {
			for (var i = 0; i < result.data.length; i++) {
				if(result.data[i].OID == 21 || result.data[i].OID == 11
						|| result.data[i].OID == $.cookie("userID")) {
					result.data.splice(i, 1);
					i--;
				}
			}
			var data = {
				rows: result.data,
				cols: [{
					key: "Code",
					caption: "代码"
				}, {
					key: "Name",
					caption: "名称"
				}],
				totalRowCount: result.totalRowCount
			};
			return data;
		};
		var getULPData = function(pageNum, success) {
			var maxRows = options.maxRows;
			var pageIndicatorCount = options.pageIndicatorCount;
			var fuzzyValue = $("input", secTxt.el).val();
			var onlyEnable = true;
			var itemKey = "Role";
			if(options.tag == YIUI.Custom_tag.OperatorRights) {
				itemKey = "Operator";
			}
			var paras = {
				service: "DictService",
				cmd: "GetQueryData",
				itemKey: itemKey,
				startRow: pageNum*maxRows,
			 	maxRows: maxRows,
				pageIndicatorCount: pageIndicatorCount,
				value: fuzzyValue
			};
			var result = Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, paras, success);
			if(!success) {
				var data = getUserList(result);
				return data;
			}
		};
		var doUserListPage = function(pageNum, isReset) {
			var data = getULPData(pageNum);
			$l_tbl.removeAll();
			options.dictRts = [];
			$l_tbl = createTable(options.userPage.content, l_opt, data);
			options.userPage.setTotalRowCount(pageNum*options.maxRows + data.totalRowCount, isReset);
			if(!modify.enable) {
				$(".checkbox", $l_tbl).removeAttr("disabled");
			}
		};
		var Return = {
			el: roleRts,
			setHeight: function(height) {
				split.setHeight(height);
				split.doLayout(this.el.width(), height);

		    	var pagesH = $(".paginationjs-pages", dr_flow.el).is(":hidden") ? 0 : $(".paginationjs-pages", dr_flow.el).outerHeight();
		    	var realHeight = dr_flow.el.height() - pagesH;
		    	$(".paginationjs-content", dr_flow.el).css("height", realHeight);
				
		    	var pagesH = $(".paginationjs-pages", left_view.el).is(":hidden") ? 0 : $(".paginationjs-pages", left_view.el).outerHeight();
		    	var realHeight = left_view.el.height() - pagesH;
		    	$(".paginationjs-content", left_view.el).css("height", realHeight);

			},
			setWidth: function(width) {
				split.setWidth(width);
				split.doLayout(width, this.el.height());
			},
			init: function() {
				// 获取被操作对象集合
				var success = function(msg) {
					var totalRowCount = msg.totalRowCount;
					
					var data = getUserList(msg);
					
					var pagination = options.userPage = left_view.el.pagination({
						pageSize: options.maxRows,
						//总记录数
				        totalNumber: totalRowCount,
				        showPages: true,
				        showPageDetail: false,
				        showFirstButton: false,
				        showLastButton: false,
				        pageIndicatorCount: options.pageIndicatorCount
					});
					$l_tbl = createTable(pagination.content, l_opt, data);

					// 分页。。。
					pagination.pageChanges = function(pageNum) {
						doUserListPage(pageNum, false);
			        };
				};
				getULPData(0, success);
				
				// 加载权限项
				var paras = {
					cmd: "LoadSetRightsList",
					operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
					roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
				}
				var rights = loadRights(paras);
				if(!rights) return;
				
				var entryRts = rights.entry;
				var eData = {
					rows: entryRts,
					cols: [{
						key: "caption",
						caption: "全选",
						type: "checkbox",
						showText: true,
						isEntry: true
					}]
				};

				$e_tbl = createTable(e_flow.el, e_opt, eData);
				e_flow.el.addClass("entryRts");
				
				var dictRts = rights.dict;
				var dData = {
					rows: dictRts,
					cols: [{
						key: "caption",
						caption: "名称"
					}, {
						key: "key",
						caption: "代码"
					}]
				};
				$d_tbl = createTable(d_flow.el, d_opt, dData);
				
				var formRts = rights.form;
				var fData = {
					rows: formRts,
					cols: [{
						key: "caption",
						caption: "名称"
					}, {
						key: "key",
						caption: "标志"
					}]
				};
				$f_tbl = createTable(f_flow.el, f_opt, fData);
				$e_tbl.attr("enable", false);

				modify.setEnable(false);
				tabPanel.setEnable(false);
			},
			install: function() {
				var _this = tabPanel;
				_this.el.children("ul").unbind();
				_this.el.children("ul").click(function(event) {
					var target = $(event.target);
		        	if(target.hasClass('ui-anchor-label') || target.hasClass('ui-tans-anchor')) {
		        		if(_this.selectedTab && _this.selectedTab.attr("aria-controls") != target.closest('li').attr("aria-controls")) {
		        			if(!_this.enable) {
		            			return false;
		        			}
		        			target.closest('li').toggleClass("aria-selected");
		        		}
		        		var tabID = target.closest('li').attr('aria-controls');
		        		if(_this.selectedTab.attr("aria-controls") == target.closest('li').attr("aria-controls")) {
		        			event.stopPropagation();
	            			return false;
		        		} else {
		        			
		        			_this.selectedTab.toggleClass("aria-selected");
							$("#" + _this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
		        		}
		        		
		        		$("#"+tabID).toggleClass("aria-show");
		        		_this.setActiveTab(tabID);
		        		
		        		$("#"+tabID).show();
		        		_this.layout.layout(_this.getWidth(), _this.getHeight());
		        		_this.selectedTab = target.closest('li');
		        	}
		        	
		        	$(".tab-body .ui-corner-bottom", _this.el).css("display", "none");
		        	$(".tab-body .ui-corner-bottom.aria-show ", _this.el).css("display", "block");
		        	
		        	event.stopPropagation();
		        	return false;
				});
				
				
//				modify.el.unbind();
//				save.el.unbind();
//				cancel.el.unbind();
				$("input[type='text']", roleRts).unbind();
				$("button", roleRts).unbind();
				modify.el.click(function(e) {
					$e_tbl.attr("enable", true);
					$l_tbl.attr("enable", false);
					$d_tbl.attr("enable", false);
					$f_tbl.attr("enable", false);
					modify.setEnable(false);
					save.setEnable(true);
					cancel.setEnable(true);
					left.setEnable(false);
					right.setEnable(true);
					tabPanel.setEnable(false);
					

//					$(".checkbox", roleRts).removeAttr("disabled");
					$(".checkbox:not([class~='ignore'])", roleRts).removeAttr("disabled");
				});
				
				var isHalfCheck = function(root) {
					var size = $("[pId='"+root.id+"'] .checkbox:checked", $dr_tbl).size();
					var halfCheck = false;
					var childs = root.children;
					if(size == childs.length) {
						//子节点全选
						for (var i = 0, len = childs.length; i < len; i++) {
							var child = childs[i];
							if(child.children && child.children.length > 0) {
								halfCheck = isHalfCheck(child);
							}
						}
					} else {
						halfCheck = true;
					}
					return halfCheck;
				};
				
				var getDictChanged = function(roots, allRts, noAllRts, delRts) {
					if(roots.length > 0) {
						for (var i = 0, len = roots.length; i < len; i++) {
							var root = roots[i];
							var row = root.row;
							var chk = $(".checkbox", row);
							var checked = chk.is(":checked");
							
							if(root.changed) {
								if(root.children && root.children.length > 0) {
									//汇总节点
									var halfCheck = isHalfCheck(root);
									if(!halfCheck) {
										//子节点全选
										allRts.push(root.id);
									} else {
										if(checked) {
											//子节点部分勾选
											noAllRts.push(root.id);
										} else {
											//子节点无勾选
											delRts.push(root.id);
										}
										getDictChanged(root.children, allRts, noAllRts, delRts);
									}
								} else {
									//明细节点
									if(checked) {
										allRts.push(root.id);
									} else {
										delRts.push(root.id);
									}
								}
							} else {
								if(root.children && root.children.length > 0) {
									getDictChanged(root.children, allRts, noAllRts, delRts);
								}
							}
						}
					}
				};
				
				save.el.click(function(e) {
					var paras = {
						key: options.key,
						id: options.id,
						type: options.type,
						
						operatorID: options.tag == YIUI.Custom_tag.OperatorRights ? options.id : -1,
						roleID: options.tag == YIUI.Custom_tag.RoleRights ? options.id : -1
					}
					
					var type = options.type;
					switch(type) {
						case YIUI.Rights_type.TYPE_ENTRY:
							paras.rights = $.toJSON($e_tbl.entryKeys);
							paras.allRights = $e_tbl.allRights;
							paras.cmd = "SaveEntryRights";
							break;
						case YIUI.Rights_type.TYPE_DICT:

							paras.allRights = options.dict.allRights;
							
							var isChain = options.clickTr.attr("secondaryType") == 5;
							if(!isChain) {
								var allRts = [], 
									noAllRts = [], 
									delRts = [];
								var roots = $dr_tbl.treeNode.roots;
								getDictChanged(roots, allRts, noAllRts, delRts);
								paras.halfCheckRights = $.toJSON(noAllRts);
								paras.delRights = $.toJSON(delRts);
								paras.addRights = $.toJSON(allRts);
							} else {
								paras.addRights = $.toJSON(options.dict.addRts);
								paras.delRights = $.toJSON(options.dict.delRts);
							}
							paras.saveType = options.dict.saveType;
							paras.itemKey = options.itemKey;
							paras.cmd = "SaveDictRights";
							break;
						case YIUI.Rights_type.TYPE_FORM:
							paras.allOptRights = $fo_tbl.allOptRights;
							paras.optRights = $.toJSON($fo_tbl.optRts);
							paras.allEnableRights = $ff_tbl.hasAllEnableRights;
							paras.enableRights = $.toJSON($ff_tbl.enableRts);
							paras.allVisibleRights = $ff_tbl.hasAllVisibleRights;
							paras.visibleRights = $.toJSON($ff_tbl.visibleRts);
							paras.formKey = options.formKey;
							paras.cmd = "SaveFormRights";
							break;
					}
					saveData(paras);
					
					$(".checkbox[type='checkbox']", roleRts).attr("disabled", "disabled");

					$e_tbl.attr("enable", false);
					$l_tbl.attr("enable", true);
					$d_tbl.attr("enable", true);
					$f_tbl.attr("enable", true);
					save.setEnable(false);
					modify.setEnable(true);
					cancel.setEnable(false);
					left.setEnable(true);
					right.setEnable(false);
					tabPanel.setEnable(true);
					if(options.dict) {
						options.dict.saveType = 0;
					}
					
					var trs = $(".checkbox:checked", roleRts).parents("tr");
				});
				cancel.el.click(function(e) {
					$e_tbl.attr("enable", false);
					$l_tbl.attr("enable", true);
					$d_tbl.attr("enable", true);
					$f_tbl.attr("enable", true);
					cancel.setEnable(false);
					save.setEnable(false);
					modify.setEnable(true);
					left.setEnable(true);
					right.setEnable(false);
					tabPanel.setEnable(true);
					if(options.dict) {
						options.dict.saveType = 0;
					}
					$(".checkbox[type='checkbox']", roleRts).attr("disabled", "disabled");
					if(options.clickTr) {
						options.clickTr.removeClass("sel");
						options.clickTr.click();
					}
				});
				sec.el.click(function(e) {
//					var value = $("input", secTxt.el).val().toLowerCase();
//					var $trs = $("tr:gt(0)", $l_tbl), $tr, $tds, $td, txt, exist, isFirst = true;
//					for (var i = 0, len = $trs.length; i < len; i++) {
//						$tr = $trs.eq(i);
//						$tds = $("td", $tr);
//						exist = false;
//						for (var j = 0, length = $tds.length; j < length; j++) {
//							$td = $tds.eq(j);
//							txt = $td.text().toLowerCase();
//							if(txt.indexOf(value) > -1) {
//								exist = true;
//								continue;
//							}
//						}
//						if(exist) {
//							$tr.show();
//							isFirst && $tr.click();
//							isFirst = false;
//						} else {
//							$tr.hide();
//						}
//					}
					
					doUserListPage(0, true);
				});
				var saveData = function(paras) {
					var data = {};
					data.service = "SetRightsService";
					data = $.extend(data, paras);
					var result = null;
					var success = function() {
						
					};
					Svr.Request.getSyncData(Svr.SvrMgr.ServletURL, data, success);
					return result;
				};
				
				var loopSearch = function(value, $table) {

					if($table.searchValue == value) {
						$table.searches++;
					} else {
						$table.searches = 1;
						$table.searchValue = value;
					}
					
					var $trs = $("tr:gt(0)", $table), $tr, $tds, $td, txt, exist, searchIndex = 0, isFirst = true, $firstTr, hasClick = false;
					var container = $table.parent();
					for (var i = 0, len = $trs.length; i < len; i++) {
						$tr = $trs.eq(i);
						$tds = $("td", $tr);
						exist = false;
						for (var j = 0, length = $tds.length; j < length; j++) {
							$td = $tds.eq(j);
							txt = $td.text().toLowerCase();
							if(txt.indexOf(value) > -1) {
								if(isFirst) {
									$firstTr = $tr;
									isFirst = false;
								}
								exist = true;
								searchIndex++;
								continue;
							}
						}
						if(exist) {
							if($table.searches == searchIndex) {
								container.scrollTop(0);
								container.scrollTop($tr.position().top);
								$tr.click();
								hasClick = true;
								break;
							}
						}
					}
					if(!hasClick && $firstTr) {
						container.scrollTop(0);
						container.scrollTop($firstTr.position().top);
						$firstTr.click();
						$table.searches = 1;
					}
				};
				d_sec.el.click(function(e) {
					var value = $("input", d_txt.el).val().toLowerCase();
					loopSearch(value, $d_tbl);
				});
				f_sec.el.click(function(e) {
					var value = $("input", fItem_txt.el).val().toLowerCase();
					loopSearch(value, $f_tbl);
				});
				dr_sec.el.click(function(e) {
					var value = $("input", dr_txt.el).val().toLowerCase();
					var isChain = options.clickTr.attr("secondaryType") == 5;
					var $el = dr_flow.el;
					if(isChain) {
						$el = $(".paginationjs-content", dr_flow.el);
						var data = getChainDictData(options.itemKey, 0);
						$dr_tbl.removeAll();
						options.dictRts = [];
						$dr_tbl = createTable($el, dr_opt, data);
						$dr_tbl.dictRts = options.dictRts;
						options.setTotalRowCount(0, data.totalRowCount);
					} else {
						loopSearch(value, $dr_tbl);
					}
				});
//				ff_sec.el.click(function(e) {
//					var value = $("input", ff_txt.el).val().toLowerCase();
//					loopSearch(value, $ff_tbl);
//				});
			}
		};
		Return.init();
		Return.install();
		return Return;
	}
	
	
}(jQuery) );/**
 * 按钮控件。
 */
YIUI.Control.Dialog = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',

    handler: YIUI.DialogHandler,
    
    msgType: YIUI.Dialog_MsgType.YES_NO_OPTION,
    
    eventList: {},
    
    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	this.dialog = new YIUI.Yes_Dialog({
    		el: this.el,
    		title: this.title,
    		msg: this.msg,
    		msgType: this.msgType
    	});
    	this.el.addClass("ui-dlg");
    	this.dialog.show();
    },
    
    regEvent: function(key, callback) {
    	this.eventList[key] = callback;
    },
    
    getEvent: function(key) {
    	return this.eventList[key];
    },
    
    regExcp: function(excp) {
    	this.excp = excp;
    },
    
    setOwner: function(form) {
    	this.form = form;
    },
    
    getOwner: function() {
    	return this.form;
    },

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
    	var self = this;
        $(".dlg-btn", self.el).click(function (event) {
        	var opt = $(this).attr("key");
//        	var opt = self.dialog.parseOpt(typeStr);
        	self.handler.doOnClick(self, opt);
        });
        $(".dialog-close", self.el).click(function(event) {
        	self.handler.doOnClick(self, YIUI.Dialog_Btn.STR_NO);
        });
    }
});
YIUI.reg('dialog', YIUI.Control.Button);/**
 * 按钮控件。
 */
YIUI.Control.FileChooser = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * render控件时，为控件自动创建的DOM标签。
     */
    autoEl: '<div></div>',
    
    /**
     * 为用途，取值为Open(用于打开)、Save(用于保存)，默认值为Open。
     */
    useType: "open",
    
    /**
     * 是否允许多选。默认值为False；
     */
    allowMulti: false,
    
    /**
     * 扩展过滤，为文件的扩展名过滤，当有多个定义时以;分隔。无定义时为所有文件。
     */
    extFilter: null,

    handler: YIUI.FileChooserHandler,
    
    onSetWidth: function(width) {
    	this.base(width);
    	this.$input.width(width - this.$btn.width());
    	this.$fileBtn.css("left", this.$btn.position().left);
    },
    
    onSetHeight: function(height) {
    	this.base(height);
    	this.$input.height(height);
    	this.$btn.height(height);
    },
    
    getValue: function() {
    	 return this.value;
    },

    /**
     * 完成FileChooser的渲染。
     */
    onRender: function (ct) {
    	this.base(ct);
    	this.el.addClass("ui-fc");
    	this.$input = $("<input class='txt' />").appendTo(this.el);
    	this.$btn = $("<button class='btn'>...</button>").appendTo(this.el);
    	this.$fileBtn = $("<input type='file' name='file' data-url='upload' class='fup'>").appendTo(this.el);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
        if (options.clickcontent) {
            this.clickContent = options.clickcontent;
        }
    },

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
    	var self = this;
        this.el.delegate('.fup', 'change', function(event) {
        	self.$input.val(this.value);
        	self.value = this.value;
        });
    }
});
YIUI.reg('filechooser', YIUI.Control.FileChooser);/**
 * 按钮控件。
 */
YIUI.Control.MapDraw = YIUI.extend(YIUI.Control, {

    handler: YIUI.MapDrawHandler,

    /** 地图缩放级别 */
    zoom: 11,
    /** 是否添加覆盖物 */
    marker: false,
    /** 指定地点精度 */
    lng: 0,
    /** 指定地点维度 */
    lat: 0,
    /** 区域绘制完成时是否进入可编辑状态 */
    polyEdit: false,

    height: 500,

    width: 500,
    
    setValue: function (value, commit, fireEvent) {
        var changed = this.base(value, commit, fireEvent);
        return changed;
    },
    
    setZoom: function(zoom) {
    	this.zoom = zoom;
    },
    
    setMarker: function(marker) {
    	this.marker = marker;
    },
    
    setLng: function(lng) {
    	this.lng = lng;
    },
    
    setLat: function(lat) {
    	this.lat = lat;
    },
    
	/** 清除所有覆盖物 */
	clear: function() {
		this.cWin.clearMap();
	},
	/** 行驶路线 */
	setDriveRoute: function(start, end, waypoints, path) {
		this.cWin.setDriveRoute(start, end, waypoints, path);
	},

    drawMarker: function(marker) {
        this.cWin.drawMarker(marker);
    },

    drawPolyline: function(polyline) {
        this.cWin.drawPolyline(polyline);
    },

    /** 根据一组边界坐标集绘制区域 */
    drawPolygon: function(polygon) {
        this.cWin.drawPolygon(polygon);
    },

    getMapInfo: function() {
        return this.cWin.getMapInfo();
    },

    showMapInfo: function(mapInfo) {
        this.cWin.showMapInfo && this.cWin.showMapInfo(mapInfo);
    },

    setEnable: function(enable) {
        this.enable = enable;
        this.cWin.setEnable && this.cWin.setEnable(enable);
    },

    onSetWidth: function(width) {
        this.base(width);
        this.iFrame.css("width", "100%");
    },

    onSetHeight: function(height) {
        this.base(height);
        this.iFrame.css("height", "100%");
        this.setURL("http://localhost:8089/yigo/bdmap.jsp?ak=55Nw4ZvSVHMbPG2LHOwHMhSZ2ZA0FfF9");
    },

    setURL: function(url) {
        this.url = url;

        if(url.indexOf("?") > 0) {
            url += "&formID=" + this.ofFormID;
        } else {
            url += "?formID=" + this.ofFormID;
        }
        url += "&ctlKey=" + this.getMetaObj().key;    

        var paras = this.paras;
        if(paras) {
            for ( var key in paras) {
                url += "&" + key + "=" + paras[key];
            }
        }

        this.iFrame.attr("src", url);
    },

    /**
     * 完成button的渲染。
     */
    onRender: function (ct) {
        this.base(ct);
        this.el.addClass("ui-map");
        this.iFrame = $("<iFrame/>").appendTo(this.el);
        this.cWin = this.iFrame[0].contentWindow;
    	this.marker && this.setMarker(this.marker);
    	this.zoom && this.setZoom(this.zoom);
    	this.lng && this.setLng(this.lng);
    	this.lat && this.setLat(this.lat);
        var metaObj = this.getMetaObj();

        metaObj.url && this.setURL(metaObj.url);

//        var iFrame = this.iFrame;
//        iFrame.onreadystatechange = function(){
//            if (iFrame.readyState == "complete"){ 完成状态判断
//                alert("Local iframe is now loaded.");
//            }
//        };
    },

    beforeDestroy: function () {
    	this.cWin = null;
    },
    
    initDefaultValue: function (options) {
        this.base(options);
        this.el.outerWidth(this.el.width());
    },

    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        
    }
});
YIUI.reg('map', YIUI.Control.MapDraw);/**
 * 日期控件，主要是用于显示日期及时间
 */
YIUI.Control.UTCDatePicker = YIUI.extend(YIUI.Control, {
    /**
     * String。
     * 此控件由自动渲染为div。
     */
    autoEl: '<div></div>',

    handler: YIUI.DatePickerHandler,
    behavior: YIUI.UTCDatePickerBehavior,

    _hasShow: false,

    _firstClick: true,

    isOnlyDate: false,

    formatStr: "yyyy-MM-dd HH:mm:ss",

    isNoTimeZone: false,

    regional: "zh-CN",//默认为中文显示

    mask: null,

    calendars: 1,

    setTip: function (tip) {
        var tip = this.text;
        this.base(tip);
    },
    
    setFormatStr: function () {
        if (this.getMetaObj().isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
    },

    setEditable: function (editable) {
        this.editable = editable;
        this.datePicker.setEditable(editable);
    },

    setEnable: function (enable) {
        this.enable = enable;
        this.datePicker.setEnable(enable);
    },

    /**
     * 设置背景色
     */
    setBackColor: function (backColor) {
        this.backColor = backColor;
        this.datePicker.getInput().css({
            'background-image': 'none',
            'background-color': backColor
        })
    },
    
   test:function(){
	   
	  return this.getValue();
	   
   },

    /**
     * 设置前景色
     */
    setForeColor: function (foreColor) {
        this.foreColor = foreColor;
        this.datePicker.getInput().css('color', foreColor);
    },

    setFormatStyle: function (cssStyle) {
        this.cssStyle = cssStyle;
        this.datePicker.getInput().css(cssStyle);
    },

    setText: function (text) {
        if (text && text.length > 0) {
            text = text.replace(/-/g, "/");
            var date = new Date(text);
            this.text = date.Format(this.formatStr);
            this.datePicker.getInput().val(this.text);
        } else {
            this.text = text;
            this.datePicker.getInput().val(this.text);
        }
    },

    getText: function () {
        var text = this.text || "";
        return text;
    },

    changeToVal: function () {
        var text = this.getText();
        if (this.getText() != "") {
            text = text.replace(/(\W+)/g, "");
          return text;
        } else {
            return null;
        }
    },

    checkEnd: function(value) {
    	this.value = value;
		this.caption = value;
		if(!value) return;
		var text = YIUI.UTCDateFormat.formatCaption(value, this.getMetaObj().isOnlyDate, this.check);
		this.setText(text);
    },
    
    setValue: function (value, commit, fireEvent, ignoreChanged, editing) {
    	var check = false;
    	if($.isNumeric(value)) {
    		check = true;
    	}
    	this.check = check;
    	var changed = this.base(value, commit, fireEvent, ignoreChanged, editing);
        return changed;
    },
    
    onRender: function (ct) {
        this.base(ct);
        var $this = this;
        $this.formatStr && this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            formatStr: $this.formatStr,
            isOnlyDate: $this.getMetaObj().isOnlyDate,
            isNoTimeZone: $this.getMetaObj().isNoTimeZone,
            regional: $this.getMetaObj().regional,
            calendars: $this.calendars
        });
        this.el.addClass("ui-dp ui-utc");

        if (this.value > 0 && this.text) {
        	this.setText(this.text);
        }
    },

    afterRender: function () {
        this.base();
        if (this.mask) {
//			this._dateInput.DateTimeMask({masktype: "1",isnow: true});
        }
    },
    onSetWidth: function (width) {
        this.datePicker.setWidth(width);
    },

    onSetHeight: function (height) {
        this.datePicker.setHeight(height);
    },

    initDefaultValue: function (options) {
        this.base(options);
        this.formatStr = options.formatstr;
        this.isOnlyDate = options.isonlydate;
        this.isNoTimeZone = options.isnotimezone;
        this.calendars = 1;
        if (this.isOnlyDate) {
            this.formatStr = this.formatStr.split(" ")[0];
        }
        var $this = this;
        this.setFormatStr();
        this.datePicker = new YIUI.Yes_DatePicker({
            id: $this.id,
            el: $this.el,
            isPortal: true,
            formatStr: $this.formatStr,
            isOnlyDate: $this.isOnlyDate,
            isNoTimeZone: $this.isNoTimeZone,
            regional: $this.regional,
            calendars: $this.calendars
        });
        this.datePicker.setIsNoTimeZone(this.isNoTimeZone);
        this.datePicker.setOnlyDate(this.isOnlyDate);
        this.datePicker.setRegional(this.regional);
        this.datePicker.setCalendars(this.calendars);
        this.datePicker.initDatePicker(this.id);
        var _dateInput = this.datePicker.getInput(),
            _dateImg = this.datePicker.getBtn();
        _dateImg.css({
            left: this._dateInput.outerWidth() - 26 + "px",
            top: (this._dateInput.outerHeight() - 16) / 2 + "px",
            height: "16px", width: "16px"});
        if ($.browser.isIE) {
            _dateInput.css('line-height', (this.el.outerHeight() - 3) + 'px');
        }
        if (this.value) {
            if (this.isOnlyDate) {
                this.value = this.value.substring(0, this.value.indexOf(" "));
            }
            this.setValue(this.value);
        }
        if (this.text) {
            this.setText(this.text);
        }
    },

    beforeDestroy: function () {
        this.datePicker.getDropView().remove();
    },

    focus: function () {
        this.datePicker && this.datePicker.getInput().focus();
    },

    install: function () {
        this.base();
        var self = this;
        this.datePicker.getInput().bind('click',function (event) {
            this.select();
        }).on('blur', function (event) {
                var curText = event.target.value;
                if (curText != self.text) {
                    self.text = curText;
                    self.setValue(self.changeToVal(), true, true);
                }
            });
        this.datePicker.getDropView().blur(function (event) {
            var curText = self.datePicker.getInput().val();
            if (curText != self.text) {
                self.text = curText;
                self.setValue(self.changeToVal(), true, true);
            }
        });
        this.datePicker.getInput().keydown(function (event) {
            var keyCode = event.keyCode || event.charCode;
            if (keyCode === 9 || keyCode === 13 || keyCode === 108) {  //tab
                self.focusManager.requestNextFocus(self);
                event.preventDefault();
            }
        });
    }
})
;
YIUI.reg('utcdatepicker', YIUI.Control.UTCDatePicker);/**
 * 按钮控件。
 */
YIUI.Control.SearchBox = YIUI.extend(YIUI.Control, {

    handler: YIUI.SearchBoxHandler,
    
    behavior: YIUI.SearchBoxBehavior,
    
	providerKey: null,
	providerFormulaKey: null,
	providerDependency: null,
	
    onRender: function (parent) {
        this.base(parent);
        this.el.addClass("ui-srch");
        
        this.txt = $("<input type='text' class='txt'/>").appendTo(this.el);
        this.btn = $("<button class='btn'>...</button>").appendTo(this.el);
        
    },

    onSetHeight: function (height) {
        this.base(height);
    },

    onSetWidth: function (width) {
        this.base(width);
        this.txt.css("width", width - this.btn.outerWidth());
    },

    setEnable: function (enable) {
        this.base(enable);
        
    },
    
    getControlValue: function() {
    	return this.txt.val();
    },

    checkEnd: function(value) {
    	this.value = value;
    	this.txt.val(this.value);
    },
    
    dependedValueChange: function(dependedField){
		var meta = this.getMetaObj();
		if(!meta.providerKey){
			if(meta.providerDependency == dependedField){
				this.setValue(null, false, true);
				this.handler.setNeedRefresh(true);
			}
		}
	},
    
    install: function () {
        this.base();
        var self = this;

        self.btn.click(function(e) {
        	var value = self.getControlValue();
    		self.handler.doOnClick(self);
        });
        self.txt.blur(function(e) {
        	var value = self.getControlValue();
    		self.handler.autoComplete(self, value);
        });
    }

	
});
YIUI.reg('searchbox', YIUI.Control.SearchBox);YIUI.GridSumUtil = (function () {
    var Return = {
        evalAffectSum: function (form, grid, rowIndex, colIndex) {
            var rd = grid.dataModel.data[rowIndex],
                curGlevel = rd.rowGroupLevel,
                len = grid.dataModel.data.length,
                clen = grid.dataModel.colModel.columns.length,
                preRd, nextRd, column;
            for (var i = rowIndex - 1; i >= 0; i--) {    //向上遍历，计算相关分组头中的汇总
                preRd = grid.dataModel.data[i];
                if (preRd.rowType == "Group" && preRd.rowGroupLevel <= curGlevel) {
                    curGlevel = preRd.rowGroupLevel;
                    this.evalSumFieldValue(form, grid, i, colIndex);
                }
                if (preRd.rowGroupLevel == 0) {
                    break;
                }
            }
            curGlevel = rd.rowGroupLevel;
            for (var j = rowIndex + 1; j < len; j++) {   //向下遍历，计算相关分组尾中的汇总
                nextRd = grid.dataModel.data[j];
                if(nextRd.isDetail && nextRd.bookmark == null) continue;
                if (nextRd.rowType == "Group" && nextRd.rowGroupLevel <= curGlevel) {
                    curGlevel = nextRd.rowGroupLevel;
                    this.evalSumFieldValue(form, grid, j, colIndex);
                }
                if (nextRd.rowGroupLevel == 0) {
                    break;
                }
            }
            for (var k = 0; k < clen; k++) {          //计算行方向上的汇总
                column = grid.dataModel.colModel.columns[k];
                if (column.columnType != null && column.columnType !== "Detail") {
                    this.evalSumFieldValue(form, grid, rowIndex, k);
                }
            }
            for (var m = 0; m < len; m++) {               //计算total行的汇总
                rd = grid.dataModel.data[m];
                if (rd.rowType == "Total") {
                    for (var n = 0; n < clen; n++) {
                        this.evalSumFieldValue(form, grid, m, n);
                    }
                }
            }
        },
        evalSumFieldValue: function (form, grid, rowIndex, colIndex) {
            var rowData = grid.dataModel.data[rowIndex], metaRow = grid.metaRowInfo.rows[rowData.metaRowIndex],
                metaCell = metaRow.cells[colIndex], defaultFormulaValue = metaCell.defaultFormulaValue;
            if (defaultFormulaValue !== undefined && defaultFormulaValue.length > 0 && defaultFormulaValue.indexOf("Sum") == 0) {
                var value = form.eval(defaultFormulaValue, {form: form, target: metaCell.key, rowIndex: rowIndex, colIndex: colIndex}, null);
                grid.setValueAt(rowIndex, colIndex, value, true, false);
            }
        },
        evalSum: function (form, grid) {
            var length = grid.dataModel.data.length, cLength = grid.dataModel.colModel.columns.length, row;
            for (var i = 0; i < length; i++) {
                row = grid.dataModel.data[i];
                if (row.rowType == "Group" || row.rowType == "Total") {
                    for (var j = 0; j < cLength; j++) {
                        this.evalSumFieldValue(form, grid, i, j);
                    }
                }
            }
        }
    };
    return Return;
})();YIUI.Control.Grid = YIUI.extend(YIUI.Control, {
    autoEl: '<table></table>',
    dataModel: {data: [], colModel: []},
    groupHeaders: [],//多重表头
    pageInfo: null,//分页信息
    errorInfoes: {rows: [], cells: []},//带错误标识的单元格
    hasRowClick: false,    //是否有行点击事件
    hasRowChange: false, // 是否有行焦点变化事件
    hasRowDblClick: false, //是否有行双击事件
    gridHandler: YIUI.GridHandler,
    rowHeight: 32,
    selectFieldIndex: -1,
    init: function (options) {
        this.base(options);
        if (this.dataModel.data.isFirstShow) {
            this.rowIDMap = this.dataModel.data.rowIDMap;
            this.dataModel.data = this.dataModel.data.addRowArray;
            this.initRowDatas();

        }
    },
    initRowDatas: function () {
        var len = this.dataModel.data.length, row;
        for (var i = 0; i < len; i++) {
            row = this.dataModel.data[i];
            this.initOneRow(row);
        }
    },
    initOneRow: function (row) {
        if (row.rowID == undefined) {
            row.rowID = this.randID();
        }
        if (row.rowType == undefined) {
            row.rowType = "Detail";
            if (row.metaRowIndex == undefined || row.metaRowIndex == -1) {
                row.metaRowIndex = this.metaRowInfo.dtlRowIndex;
            }
        }
        row.isDetail = (row.rowType == "Detail");
        row.isEditable = (row.rowType == "Fix" || row.rowType == "Detail");
        row.cellKeys = this.metaRowInfo.rows[row.metaRowIndex].cellKeys;
        row.rowHeight = this.metaRowInfo.rows[row.metaRowIndex].rowHeight;
        if (this.hasColExpand && row.isDetail && row.cellBkmks == undefined) {
            row.cellBkmks = []
        }
    },
    setID :function(){
        console.log(this)
    },
    setVAlign: function (vAlign) {

    },
    setHAlign: function (hAlign) {

    },
    // private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
    onSetWidth: function (width) {
        this.el.setGridWidth(width);
    },

    setHeight: function (height) {
        this.base(height);
        if (!this.isHeightSet) {
            var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
            var focusRowIndex = this.getFocusRowIndex(), focusColIndex = this.getFocusColIndex();
            this.refreshGrid({populate: true, rowNum: this.dataModel.data.length});
            this.el[0].grid.bDiv.scrollTop = scrollTop;
            this.el[0].grid.bDiv.scrollLeft = scrollLeft;
            var cell = this.el.getGridCellAt(focusRowIndex + 1, focusColIndex + 1);
            if (cell) {
                cell.notOnSelectRow = true;
                $(cell).click();
            }
        }
    },

    // private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
    onSetHeight: function (height) {
        this.el.setGridHeight(height);
        var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
        var focusRowIndex = this.getFocusRowIndex(), focusColIndex = this.getFocusColIndex();
        this.refreshGrid({populate: true, rowNum: parseInt((this.el[0].grid.bDiv.clientHeight / this.rowHeight), 10) + 2});
        this.el[0].grid.bDiv.scrollTop = scrollTop;
        this.el[0].grid.bDiv.scrollLeft = scrollLeft;
        var cell = this.el.getGridCellAt(focusRowIndex + 1, focusColIndex + 1);
        if (cell) {
            cell.notOnSelectRow = true;
            $(cell).click();
        }
        this.isHeightSet = true;
    },
    //获得表格最外层节点
    getOuterEl: function () {
        return $("#gbox_" + this.id);
    },
    //处理服务端返回值中的不相同的地方，更新到界面
    diff: function (diffJSON) {
        var isRedraw = false, isReRender = false;
        if (typeof diffJSON.editable != "undefined" && diffJSON.editable != this.isEnable()) {
            this.setEnable(diffJSON.editable);
            this.el.setGridParam({enable: this.isEnable()});
            this.el[0].updatePager();
        }
        var needCalcPageInfo = false;
        if (diffJSON.pageInfo) {
            if (diffJSON.pageInfo.currentPage) {
                this.pageInfo.currentPage = diffJSON.pageInfo.currentPage;
                needCalcPageInfo = true;
            }
            if (diffJSON.pageInfo.totalRowCount) {
                this.pageInfo.totalRowCount = diffJSON.pageInfo.totalRowCount;
            }
            if (diffJSON.pageInfo.totalPage) {
                this.pageInfo.totalPage = diffJSON.pageInfo.totalPage;
            }
        }
        if (diffJSON.errorInfoes) {
            this.errorInfoes.cells = diffJSON.errorInfoes.cells;
            this.errorInfoes.rows = diffJSON.errorInfoes.rows;
        }
        if (diffJSON.dataModel) {
            if (diffJSON.dataModel.cellEnables) {
                for (var ri = 0, len = diffJSON.dataModel.cellEnables.length; ri < len; ri++) {
                    var diffRow = diffJSON.dataModel.cellEnables[ri], rowID = diffRow.rowID,
                        gridRow = this.getRowDataByID(rowID), rowIndex = this.getRowIndexByID(rowID);
                    if (gridRow == null || diffRow.cells == undefined) continue;
                    for (var cellKey in diffRow.cells) {
                        this.setCellEnable(rowIndex, cellKey, diffRow.cells[cellKey]);
                    }
                }
            }
            if (diffJSON.dataModel.colModel) {
                if (diffJSON.dataModel.colModel.columns) {
                    this.dataModel.colModel.columns = diffJSON.dataModel.colModel.columns;
                }
                if (diffJSON.dataModel.colModel.cells) {
                    this.dataModel.colModel.cells = diffJSON.dataModel.colModel.cells;
                }
                if (this.dataModel.colModel.columns.length != this.el[0].p.colModel.length) {
                    isReRender = true;
                    this.groupHeaders = diffJSON.groupHeaders;
                }
                this.el[0].p.colModel.isChange = false;
                for (var colIndex = 0, colLen = this.dataModel.colModel.columns.length; colIndex < colLen; colIndex++) {
                    var col = this.dataModel.colModel.columns[colIndex];
                    var oldCol = null;
                    for (var oldColIndex = 0, cmLen = this.el[0].p.colModel.length; oldColIndex < cmLen; oldColIndex++) {
                        oldCol = this.el[0].p.colModel[oldColIndex];
                        if (oldCol.name == col.name)
                            break;
                    }
                    oldCol.editable = col.editable;
                    if (oldCol.hidden !== col.hidden) {
                        this.el[0].p.colModel.isChange = true;
                        isRedraw = true;
                    }
                    oldCol.hidden = col.hidden;
                }
            }
            if (diffJSON.dataModel.data) {
                var isFirstShow = diffJSON.dataModel.data.isFirstShow;
                if (isFirstShow) {
                    this.dataModel.data = diffJSON.dataModel.data.addRowArray;
                    if (!this.dataModel.data) {
                        this.dataModel.data = new Array();
                    }
                    this.initRowDatas();
                    if (this.treeType !== -1) {
                        this.rowIDMap = diffJSON.dataModel.data.rowIDMap;
                        this.treeOldData = this.dataModel.data;
                        this.dataModel.data = new Array();
                        var i, rd, len;
                        if (this.treeExpand) {
                            for (i = 0, len = this.treeOldData.length; i < len; i++) {
                                rd = this.treeOldData[i];
                                if (rd.childRows.length > 0) {
                                    rd.isExpand = true;
                                }
                                this.dataModel.data.push(rd);
                            }
                        } else {
                            for (i = 0, len = this.treeOldData.length; i < len; i++) {
                                rd = this.treeOldData[i];
                                if (rd.parentRow === undefined) {
                                    this.dataModel.data.push(rd);
                                }
                            }
                        }
                    } else if (this.rowExpandIndex != -1) {
                        for (var j = 0, jLen = this.dataModel.data.length; j < jLen; j++) {
                            var rowData = this.dataModel.data[j];
                            rowData.data[this.rowExpandIndex][2] = false;
                        }
                    }
                    isRedraw = true;
                } else {
                    var addJSON = diffJSON.dataModel.data.addRowArray;
                    var modifyJSON = diffJSON.dataModel.data.modifyRowArray;
                    var delJSON = diffJSON.dataModel.data.deleteRowArray;
                    this.deleteRows(delJSON);
                    this.addNewRows(addJSON);
                    this.modifyRows(modifyJSON);
                    isRedraw = false;
                }
            }
            if (isReRender) {
                var grid = $("#gbox_" + this.id), parent = $(grid[0].parentElement),
                    width = grid.width(), height = grid.height();
                grid.remove();
                this.el = null;
                this.onRender(parent);
                this.onSetWidth(width);
                this.setHeight(height);
            } else {
                var scrollTop = this.el[0].grid.bDiv.scrollTop, scrollLeft = this.el[0].grid.bDiv.scrollLeft;
                var opt = {enable: this.isEnable()};
                this.el.setGridParam(opt);
                if (isRedraw) {
                    this.refreshGrid(opt);
                }
                this.initPageOpts(needCalcPageInfo);
                this.initGridErrors();
                this.el[0].grid.bDiv.scrollTop = scrollTop;
                this.el[0].grid.bDiv.scrollLeft = scrollLeft;
                var isHasEditor = false, etCells = this.el[0].p.editCells;
                for (var i = 0, eclen = etCells.length; i < eclen; i++) {
                    if (etCells[i].cell.editor !== undefined) {
                        isHasEditor = true;
                        break;
                    }
                }
                if (isHasEditor) {
                    this.el[0].p.editCells = etCells;
                }
            }
        }
    },
    //差异化删除行
    deleteRows: function (delJSON) {
        if (delJSON) {
            for (var j = this.dataModel.data.length - 1; j >= 0; j--) {
                var curRow = this.dataModel.data[j];
                for (var i = delJSON.length - 1; i >= 0; i--) {
                    var delRowID = delJSON[i]["rowID"];
                    if (curRow.rowID == delRowID) {
                        this.dataModel.data.splice(j, 1);
                        this.el[0].deleteGridRow(j);
                        delJSON.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    //差异化添加行
    addNewRows: function (addJSON) {
        if (addJSON) {
            while (addJSON.length != 0) {
                for (var i = addJSON.length - 1; i >= 0; i--) {
                    var addRow = addJSON[i];
                    if (addRow.data !== null && addRow.data !== undefined) {
                        this.initOneRow(addRow);
                    }
                    var rowID = addRow["insertRowID"];
                    if (rowID == -1) {
                        this.dataModel.data.splice(0, 0, addRow);
                        this.el[0].insertGridRow(0, addRow);
                        addJSON.splice(i, 1);
                    } else {
                        for (var j = 0, dlen = this.dataModel.data.length; j < dlen; j++) {
                            var row = this.dataModel.data[j];
                            var curRowID = row["rowID"];
                            if (curRowID == rowID) {
                                this.dataModel.data.splice(j + 1, 0, addRow);
                                this.el[0].insertGridRow(j + 1, addRow);
                                addJSON.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    //差异化修改行
    modifyRows: function (modifyJSON) {
        if (modifyJSON) {
            for (var i = 0, len = modifyJSON.length; i < len; i++) {
                var modifyRow = modifyJSON[i];
                var rowID = modifyRow["rowID"], rowInd, oldRd, mdCell, rn = this.showRowHead ? 1 : 0;
                for (var j = 0, dlen = this.dataModel.data.length; j < dlen; j++) {
                    var row = this.dataModel.data[j];
                    var curRowID = row["rowID"];
                    if (curRowID == rowID) {
                        oldRd = this.dataModel.data[j];
                        for (var k = 0, clen = modifyRow.cells.length; k < clen; k++) {
                            mdCell = modifyRow.cells[k];
                            oldRd.data[mdCell.colIndex] = mdCell.value;
                            this.el[0].modifyGridCell(j, mdCell.colIndex + rn, oldRd);
                        }
                        if (this.treeType !== -1) {
                            modifyRow.isExpand = row.isExpand;
                            modifyRow.treeLevel = row.treeLevel;
                            rowInd = this.rowIDMap[rowID];
                            this.treeOldData.splice(rowInd, 1, oldRd);
                        }
                        this.dataModel.data.splice(j, 1, oldRd);
                        break;
                    }
                }
            }
        }
    },
    //编辑单元格时如果是自定义编辑组件，则这里进行对应组件的创建
    createCellEditor: function (cell, edittype, iRow, iCol, opt) {
        if (edittype === "label") return;
        var editor, $t = this, self = $t.getControlGrid(), form = YIUI.FormStack.getForm(self.ofFormID),
            rowIndex = parseInt($.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id), 10),
            rowData = $t.p.data[rowIndex], rowID = rowData.rowID, colIndex = $t.p.rowSequences ? iCol - 1 : iCol,
            cellV = rowData.data[colIndex], oldV = cellV[0], oldCaption = cellV[1];
        if (oldV === null || oldV === undefined || oldV === '&nbsp;' || oldV === '&#160;'
            || ($.isString(oldV) && oldV.length === 1 && oldV.charCodeAt(0) === 160)) {
            oldV = "";
        }
        cell.html("").attr("tabIndex", "0");
        var scrollTop = $t.grid.bDiv.scrollTop, scrollLeft = $t.grid.bDiv.scrollLeft;
        var setFocusAndSelect = function (editor) {
            var moveStart = function (element) {
                var pos = element.value.length;
                if (element.setSelectionRange) {
                    element.setSelectionRange(pos, pos);
                } else if (element.createTextRange) {
                    var r = element.createTextRange();
                    r.moveStart('character', pos);
                    r.collapse(true);
                    r.select();
                }
            };
            window.setTimeout(function () {
                $(editor.getInput()).focus(function () {
                    if (!$.ygrid.msie) {    //兼容IE
                        moveStart(this);
                    }
                });
                editor.getInput().focus();
                if (!cell[0].inKeyEvent) {
                    editor.getInput().select();
                } else {
                    if ($.ygrid.msie) {      //兼容IE
                        moveStart(editor.getInput()[0]);
                    }
                    cell[0].inKeyEvent = false;
                }
            }, 0);
        };
        var hideDropView = function () {
            var th = self.el, p = th[0].p, value;
            if (p.editCells.length === 0) {
                var dV = p.data[iRow - 1].data[iCol - (p.rowSequences ? 1 : 0)];
                p.editCells.push({ir: iRow, ic: iCol, name: p.colModel[iCol].name, v: dV, cell: cell});
            }
            th.yGrid("saveCell", iRow, iCol);
            th[0].selecting = false;
            var hCell = $("td.ui-state-highlight", th[0].grid.bDiv);
            if (hCell[0] && (hCell[0].parentElement.id !== p.selectRow || hCell[0].cellIndex !== p.selectCell)) {
                hCell.click();
            }
            window.setTimeout(function () {
                $("#" + self.el[0].p.knv).focus();
                self.el[0].grid.bDiv.scrollTop = scrollTop;
                self.el[0].grid.bDiv.scrollLeft = scrollLeft;
            }, 0);
        };
        var clickDropBtn = function (editor) {
            var event = opt.event || window.event;
            if (event.type === "click") {
                var srcE = event.target || event.srcElement ,
                    x = event.offsetX || (event.clientX - srcE.getBoundingClientRect().left),
                    y = event.offsetY || (event.clientY - srcE.getBoundingClientRect().top),
                    btn = editor.getDropBtn()[0],
                    top = btn.offsetTop, left = btn.offsetLeft,
                    height = btn.offsetHeight, width = btn.offsetWidth;
                if (top <= y && y <= (top + height) && left <= x && x <= (cell[0].offsetLeft + cell[0].offsetWidth)) {
                    editor.getDropBtn().click();
                }
            }
        };
        if (edittype == "dynamic") {
            var typeFormula = opt.typeFormula;
            var typeDefKey = form.eval(typeFormula, {form: form, rowIndex: rowIndex, colIndex: colIndex});
            var cellTypeDef = DynamicCell.getCellTypeTable()[form.formKey][typeDefKey];
            if (cellTypeDef != null) {
                if (cellTypeDef.options.isAlwaysShow) return;
                cell[0].cellTypeDef = cellTypeDef;
                edittype = cellTypeDef.options.edittype;
                opt = $.extend(opt, cellTypeDef.options, {typeDefKey: typeDefKey});
            }
        }
        switch (edittype) {
            case "textEditor":
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellTextEditor(opt);
                editor.getInput().addClass("celled");
                editor.render(cell);
                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case "numberEditor":
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellNumberEditor(opt);
                editor.getInput().addClass("celled");
                editor.render(cell);
                editor.setValue(oldV);
                setFocusAndSelect(editor);
                break;
            case "dict":
                self.gridHandler.doGridCellSelect(self, rowID, colIndex);
                var stopClickCell = function () {
                    self.el[0].grid.clearSelectCells();
                    self.el[0].selecting = false;
                };
                opt = $.extend(true, opt, {
                    ofFormID: self.ofFormID,
                    hiding: hideDropView,
                    rowIndex: self.getRowIndexByID(rowID),
                    colIndex: colIndex,
                    stopClickCell: stopClickCell
                });
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                editor = new YIUI.CellEditor.CellDict(opt, cell);
                editor.render(cell);
                if (oldV != null && !opt.multiSelect) {
                    oldV = new YIUI.ItemData(oldV);
                }
                editor.setValue(oldV);
                editor.setText(oldCaption);
                clickDropBtn(editor);
                break;
            case "comboBox":
                self.gridHandler.doGridCellSelect(self, rowID, colIndex);
                opt = $.extend(true, opt, {
                    ofFormID: self.ofFormID,
                    hiding: hideDropView,
                    cxt: {form: form, rowIndex: self.getRowIndexByID(rowID), colIndex: colIndex}
                });
                editor = new YIUI.CellEditor.CellComboBox(opt);
                editor.render(cell);
                editor.setValue(oldV);
                editor.setText(oldCaption);
                editor.yesCom.setItems(editor.yesCom.items);
                editor.getDropBtn().click();
                break;
            case "datePicker":
            case "utcDatePicker":
                editor = new YIUI.CellEditor.CellDatePicker(opt);
                editor.render(cell);
                if (edittype == "utcDatePicker" && oldV != null && oldV != "") {
                    oldV = YIUI.UTCDateFormat.formatCaption(oldV, opt.isOnlyDate, true);
                }
                editor.setValue(oldV);
                editor.getDropView().blur(function () {
                    self.el.yGrid("saveCell", iRow, iCol);
                });
                clickDropBtn(editor);
                break;
            case "textButton":
                opt.rowID = rowID;
                opt.colIndex = colIndex;
                opt.saveCell = function (value) {
                    self.el.yGrid("saveCell", iRow, iCol);
                    self.el[0].selecting = false;
                };
                opt.click = function () {
                    self.gridHandler.doOnCellClick(self, this.rowID, this.colIndex);
                    window.setTimeout(function () {
                        $("#" + $t.p.knv).focus();
                    }, 0);
                };
                editor = new YIUI.CellEditor.CellTextButton(opt);
                editor.getInput().addClass("celled");
                editor.setValue(oldV);
                editor.render(cell);
                setFocusAndSelect(editor);
                break;
        }
        editor.getInput().keydown(function (event) {
            var keyCode = event.charCode || event.keyCode || 0;
            if (keyCode === 13 || keyCode === 108 || keyCode === 9) {
                editor.getInput().blur();
                if (editor.yesCom.isShowQuery) {
                    event.stopPropagation();
                }
                $("#" + self.el[0].p.knv).trigger("keydown", event);
            }
        });
        cell[0].editor = editor;
    },
    endCellEditor: function (cell, edittype, iRow, iCol) {
        var cm = this.p.colModel[iCol], id = this.rows[iRow].id ,
            rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id), row = this.p.data[rowIndex],
            editOpt = this.getCellEditOpt(row, iCol), enable = row.data[cm.index][2], value, caption = "";
        if (cell[0].editor == null && edittype != "label") return [null, "", enable];
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        switch (edittype) {
            case "dict":
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                if (value !== null) {
                    if (value.length && value.length >= 1) {
                        for (var i = 0, vLen = value.length; i < vLen; i++) {
                            caption += value[i].caption + ",";
                        }
                        caption = caption.substring(0, caption.length - 1);
                    } else {
                        caption = value.caption == undefined ? "" : value.caption;
                    }
                }
                if (editOpt.multiSelect) {
                    value = [value];
                }
                value = [value, caption, enable];
                return value;
            case "numberEditor":
            case "textEditor":
            case "textButton":
                cell[0].editor.finishInput();
            case "comboBox":
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                value = [value, cell[0].editor.getText(), enable];
                return  value;
            case "datePicker":
            case "utcDatePicker":
                cell[0].editor.finishInput();
                cell[0].editor.beforeDestroy();
                value = cell[0].editor.getValue();
                if (value == null) {
                    value = [null, "", enable];
                } else {
                    caption = new Date(value).Format(editOpt.editOptions.formatStr).toLocaleString();
                    if (edittype == "utcDatePicker") {
                        value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
                    }
                    value = [value, caption, enable];
                }
                return value;
            case "label":
                return row.data[cm.index];
        }
        return [null, "", enable];
    },
    afterEndCellEditor: function (cell, edittype, isChanged, iRow, iCol) {
        var th = this, grid = th.getControlGrid();
        if (edittype == "dynamic" && cell[0].cellTypeDef != null) {
            edittype = cell[0].cellTypeDef.options.edittype;
        }
        if (edittype !== undefined && edittype !== "label" && cell[0].editor != null) {
            var value = cell[0].editor.getValue(), id = th.rows[iRow].id, rowIndex = $.ygrid.stripPref($.ygrid.uidPref, id),
                row = this.p.data[rowIndex], rowID = row.rowID, editOpt = th.getCellEditOpt(row, iCol);
            if (edittype == "utcDatePicker") {
                value = YIUI.UTCDateFormat.format(new Date(value), editOpt.editOptions);
            }
            if (edittype == "textEditor" || edittype == "textButton") {
                grid.afterTextEditing = true;
            }
            if (isChanged) {
                grid.gridHandler.doCellValueChanged(grid, rowID, th.p.rowSequences ? iCol - 1 : iCol, value);
            }
            if (edittype == "numberEditor" && th.rows[iRow] != null) {
                var curCell = th.rows[iRow].cells[iCol];
                if (value.isNegative()) {
                    $(curCell).css({color: editOpt.editOptions.negtiveForeColor});
                } else {
                    $(curCell).css({color: ""});
                }
            }
        }
    },
    alwaysShowCellEditor: function (cell, iRow, iCol, cm, value, opt, rowHeight) {
        var editor, p = this.p, th = this, row = p.data[opt.ri], rowID = row.rowID, grid = this.getControlGrid(),
            enable = value[2] || (value[2] == null && grid.isEnable()),
            editOpt = th.getCellEditOpt(row, iCol), colIndex = (p.rowSequences ? iCol - 1 : iCol);
        cell.html("");
        if (row.rowType == "Group" || row.rowType == "Total")  return;
        opt.rowID = rowID;
        opt.colIndex = colIndex;
        opt.click = function () {
            var scrollTop = th.grid.bDiv.scrollTop, scrollLeft = th.grid.bDiv.scrollLeft;
            grid.setFocusRowIndex(grid.getRowIndexByID(rowID));
            if (editOpt.formatter === "checkbox") {
                var isChecked = $("input", editor)[0].checked;
                grid.gridHandler.doOnCellClick(grid, this.rowID, this.colIndex, isChecked);
            } else {
                grid.gridHandler.doOnCellClick(grid, this.rowID, this.colIndex);
            }
            if (th.p.selectFieldIndex == editOpt.colIndex) {
                grid.checkHeadSelect(editOpt.colIndex);
            }
            cell.click();
            window.setTimeout(function () {
                if (th.grid) {
                    $("#" + p.knv).focus();
                    th.grid.bDiv.scrollTop = scrollTop;
                    th.grid.bDiv.scrollLeft = scrollLeft;
                }
            }, 0);
        };
        cell[0].style.height = rowHeight + "px";//兼容FireFox,IE
        switch (editOpt.formatter) {
            case "button":
                var icon = "";
                if (opt.icon) {
                    icon = "<span class='icon button' style='background-image: url(Resource/" + opt.icon + ")'></span>";
                }
                editor = $("<div class='ui-btn button cellEditor'>" + "<button>" + icon
                    + "<span class='txt button'>" + (value[0] == null ? "" : value[0]) + "</span></button></div>");
                if (opt.type == YIUI.Button_Type.UPLOAD) {
                    var btn_up = $("<input type='file' class='type upload' name='file' data-url='upload'/>");
                    btn_up.appendTo(editor);
                    btn_up[0].enable = enable;
                }
                $("button", editor)[0].enable = enable;
                editor.appendTo(cell);
                editor.mousedown(function (e) {
                    e.delegateTarget.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                        e.delegateTarget.enable && $(this).removeClass("hover");
                    });
                editor.click(function (e) {
                    window.up_target = null;
                    if (!e.target.enable) {
                        e.stopPropagation();
                        return false;
                    } else if ($(e.target).hasClass("upload")) {
                        window.up_target = $(e.target);
                    }
                    opt.click();
                });
                $("button", editor).click(function (e) {
                    if (!this.enable) {
                        e.stopPropagation();
                        return false;
                    } else if ($(e.target).hasClass("upload")) {
                        window.up_target = $(e.target);
                    }
                    opt.click();
                });
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case "hyperlink":
                var showV = (value[0] == null ? "" : value[0]);
                editor = $("<a class='ui-hlk cellEditor' style='width: 100%;height: 100%;line-height: " + rowHeight + "px'>" + showV + "</a>");
                editor[0].enable = enable;

                var showTarget = YIUI.Hyperlink_TargetType.Str_NewTab;
                switch (opt.targetType) {
                    case YIUI.Hyperlink_TargetType.Current:
                        showTarget = YIUI.Hyperlink_TargetType.Str_Current;
                    case YIUI.Hyperlink_TargetType.NewTab:
                        if (opt.url != null && opt.url.length > 0) {
                            editor.attr("href", opt.url);
                        }
                        editor.attr("target", YIUI.Hyperlink_target[showTarget]);
                        break;
                }

                editor.mousedown(function (e) {
                    e.delegateTarget.enable && $(this).addClass("hover");
                }).mouseup(function (e) {
                        e.delegateTarget.enable && $(this).removeClass("hover");
                    });
                editor.click(function (e) {
                    //e.target.enable && opt.click();
                    if (!e.target.enable) return;
                    if (opt.url && opt.targetType == YIUI.Hyperlink_TargetType.New) {
                        window.open(opt.url, YIUI.Hyperlink_target.New, "alwaysRaised=yes");
                    } else if (!opt.url) {
                        opt.click();
                    }
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                break;
            case "checkbox":
                var checked = "", input, top;
                var checkboxID = this.id + '_' + iRow +'_'+ iCol;
                if (value[0] === "1" || value[0] === 1 || value[0] === "true" || value[0] === true) {
                    checked = "checked";
                }
                top = (rowHeight - 16) / 2;
               /* editor = $("<div class='ui-chk cellEditor' style='width: 100%;height: 100%'>" +
                    "<input  style='height:16px;top:" + top + "px;position: relative' type='checkbox' class='chk' " + checked + "/></div>");*/
                 editor = $("<div class='ui-chk cellEditor' style='width: 100%;height: 100%';>" +
                    "<input id=" + checkboxID + " type='checkbox' class='chk' " + checked + "/>"+
                     "<label for=" + checkboxID + " style='height:16px;width:16px;top:" + top + "px;position: relative' ></label>"+
                     "</div>");
                 editor[0].enable = enable;
                input = $("input", editor);
                label = $("label", editor);
                !enable && input.attr('disabled', 'disabled');
                editor.click(function (e) {
                    grid.setCellFocus(iRow - 1, grid.showRowHead ? iCol - 1 : iCol);
                    e.delegateTarget.enable && opt.click();
                });
                editor.appendTo(cell);
                editor.attr("title", value[0]);
                cell.attr("title", value[0]);
                if(input.is(':checked')) input.addClass('checked');
                label.click(function(){
                    if(input.is(':checked')){
                        input.removeClass('checked')
                    }else{
                        input.addClass('checked')
                    }
                })

                break;
            case "image":
                opt.ofFormID = grid.ofFormID;
                opt.enable = enable;
                opt.value = value[0];
                opt.gridKey = grid.key;
                opt.rowIndex = grid.getRowIndexByID(opt.rowID);
                opt.change = function (path) {
                    p.data[iRow - 1].data[cm.index] = [path, path];
                    p.editCells.push({ir: iRow, ic: iCol, name: cm.name, v: p.data[iRow - 1].data[cm.index], cell: cell});
                    if (p.afterEndCellEditor && $.isFunction(p.afterEndCellEditor)) {
                        p.afterEndCellEditor.call(th, cell, editOpt.edittype, true, iRow, iCol);
                    }
                    p.selectRow = null;
                    p.selectCell = null;
                    p.editCells = [];
                    th.grid.clearSelectCells();
                };
                editor = new YIUI.CellEditor.CellImage(opt);
                editor.render(cell);
                editor.getEl().attr("title", editor.pathV);
                cell.attr("title", editor.pathV);
                cell[0].editor = editor;
                break;
        }
    },
    //处理分页事件
    doPageEvent: function (isDo, page, cmd) {
        page = parseInt(page, 10);
        if (isDo) {
            this.dataModel.data = [];
            var paras = {optType: cmd};
            if (!isNaN(page) && page >= 0) {
                paras["pageIndex"] = page;
            }
            this.gridHandler.doGoToPage(this, JSON.stringify(paras));
        }
    },
    //设置分页按钮及输入框的可用性及事件处理
    initPageOpts: function (needCalc) {
        if (!this.pageInfo.isUsePaging) return;
        if (needCalc) this.pageInfo.totalPage += this.pageInfo.currentPage - 1;
        var $th = this , pagerID = this.id + "_pager",
            firstButton = $("#first_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            prevButton = $("#prev_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            nextButton = $("#next_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            lastButton = $("#last_" + pagerID).removeClass("ui-state-disabled").unbind("click"),
            pagination = $("#pagination_" + pagerID),
            pageInput = $("#" + pagerID + "_center .ui-pg-input").val(this.pageInfo.currentPage).unbind("keypress");
        $("#sp_1_" + pagerID).html(this.pageInfo.totalPage);
        var lastRowIndex = this.pageInfo.currentPage * this.pageInfo.pageRowCount;
        var firstRowIndex = (this.pageInfo.currentPage - 1) * this.pageInfo.pageRowCount + 1;
        if (lastRowIndex == 0) {
            firstRowIndex = 0;
        }
        var pageInfoStr = "第" + firstRowIndex + " - " + lastRowIndex + "条";
        $("#" + pagerID + "_right .ui-paging-info").html(pageInfoStr);
        firstButton.bind("click", function () {
            $th.doPageEvent(!firstButton.hasClass("ui-state-disabled"), -1, "firstPage");
        });
        prevButton.bind("click", function () {
            $th.doPageEvent(!prevButton.hasClass("ui-state-disabled"), -1, "prevPage");
        });
        nextButton.bind("click", function () {
            $th.doPageEvent(!nextButton.hasClass("ui-state-disabled"), -1, "nextPage");
        });
        lastButton.bind("click", function () {
            $th.doPageEvent(!lastButton.hasClass("ui-state-disabled"), -1, "lastPage");
        });
        if (this.pageInfo.totalPage == 1) {
            pageInput.attr("readOnly", "readOnly");
        }
        pageInput.keypress(function (e) {
            var key = e.charCode || e.keyCode || 0;
            if (key === 13) {
                if (pageInput.val() > $th.pageInfo.totalPage) {
                    pageInput.val($th.pageInfo.totalPage);
                }
                $th.doPageEvent(!pageInput.hasClass("ui-state-disabled"), pageInput.val(), "turnToPage");
            } else if (key >= 48 && key <= 57) {
                return this;
            }
            return false;
        });
        /*var initPagination = function (begin, end, curPage) {
            $("ul", pagination).html();
            var btnStr = [], style, sClass;
            for (var i = begin; i <= end; i++) {
                //style = (i == end) ? "border-right:1px solid #000" : "";
                var style = null;
                if(i==end) style = 'background:red';
                sClass = (i == curPage) ? "ui-state-highlight" : "";
                btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
            }
            $("ul", pagination).html(btnStr.join(""));
        };*/

        var initPagination = function (begin, end, curPage) {
            $("ul", pagination).html();
            var btnStr = [], style, sClass;
            //var end = 10;
            for (var i = begin; i <= end; i++) { 
                var style;
                if(i==end) style = 'border:0';
                sClass = (i == curPage) ? "ui-state-highlight" : "";
                btnStr.push(["<li class='pagination_btn " , sClass , "' style='" , style , "' data-num=" , i , ">" , i , "</li>"].join(""));
            }
            $("ul", pagination).html(btnStr.join(""));
        };

        if (this.pageInfo.totalPage <= 5) {
            initPagination(1, this.pageInfo.totalPage, this.pageInfo.currentPage);
        } else {
            var curPage = this.pageInfo.currentPage, totalPage = this.pageInfo.totalPage,
                begin = (curPage - 2) >= 1 ? (curPage - 2) : 1, end = begin + 4;
            if (end > totalPage) {
                var gap = end - totalPage;
                begin -= gap;
                end -= gap;
            }
            initPagination(begin, end, this.pageInfo.currentPage);
        }
        $("li", pagination).click(function () {
            var num = $(this).attr("data-num");
            $th.doPageEvent(!$(this).hasClass("ui-state-disabled"), num, "turnToPage");
        });
        if (this.pageInfo.currentPage == 1) {
            firstButton.addClass("ui-state-disabled");
            prevButton.addClass("ui-state-disabled");
        } else {
            firstButton.removeClass("ui-state-disabled");
            prevButton.removeClass("ui-state-disabled");
        }
        if (this.pageInfo.currentPage == this.pageInfo.totalPage) {
            nextButton.addClass("ui-state-disabled");
            lastButton.addClass("ui-state-disabled");
        } else {
            nextButton.removeClass("ui-state-disabled");
            lastButton.removeClass("ui-state-disabled");
        }
    },
    rowOptFunc: function (cmd) {
        if (this.p.selectRow) {
            var index = $.ygrid.stripPref($.ygrid.uidPref, this.p.selectRow),
                rowID = this.p.data[index].rowID, self = this.getControlGrid(),
                rowIndex = this.getControlGrid().getRowIndexByID(rowID);
            if (cmd === "add") {
                var selCell = this.p.selectCell;
                this.getControlGrid().gridHandler.doInsertGridRow(self, rowID);
                $($("#" + $.ygrid.uidPref + index)[0].cells[selCell]).click();
            } else if (cmd === "del") {
                this.getControlGrid().gridHandler.doDeleteGridRow(self, rowID);

            } else if (cmd == "upRow" || cmd == "downRow") {
                this.getControlGrid().gridHandler.doShiftRow(self, rowIndex, cmd == "upRow");
            }
        }
    },
    extKeyDownEvent: function (event) {
        var ri = this.p.selectRow, ci = this.p.selectCell, keyCode = event.charCode || event.keyCode || 0, row = this.rows[ri];
        if (ri === undefined || ri == null || ci === undefined || ci == null || row == undefined) return;
        var rowIndex = $.ygrid.stripPref($.ygrid.uidPref, row.id), rowData = this.p.data[rowIndex],
            cell = row.cells[ci], editOpt = this.getCellEditOpt(rowData, ci);
//        var isCapeLook = function (e) {   //仅能检测到输入框中按下键盘按钮的时候根据输入的keycode检测，不能再输入之前检测。
//            var keyCode = e.keyCode || e.which || e.charCode;
//            var isShift = e.shiftKey || (keyCode == 16) || false;
//            return ((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift);
//        };
        if (editOpt.edittype == "textEditor" || editOpt.edittype == "numberEditor" || editOpt.edittype == "textButton"
            || editOpt.edittype == "dict" || editOpt.edittype == "datePicker") {
            var value;
            if (keyCode >= 48 && keyCode <= 57) {//数字
                value = String.fromCharCode(keyCode);
            } else if (keyCode >= 96 && keyCode <= 105) {    //小键盘数字
                value = String.fromCharCode(keyCode - 48);
            } else if (keyCode >= 65 && keyCode <= 90) { //字母
                if (editOpt.edittype == "numberEditor" || editOpt.edittype == "datePicker") return;
                value = String.fromCharCode(keyCode).toLowerCase();
                if (event.shiftKey || document.isCapeLook) {
                    value = value.toUpperCase();
                }
            } else if (keyCode == 107 || keyCode == 109 || keyCode == 187 || keyCode == 189) {
                value = String.fromCharCode(0);
            }
            if (value == undefined) return;
            cell.inKeyEvent = true;
            cell.click();
            if ($(cell).find("input")[0] !== undefined && $(cell).find("input")[0] !== document.activeElement) {
                window.setTimeout(function () {
                    $(cell).find("input").focus();
                    if (editOpt.edittype == "textEditor") {
                        var vChar, realValue = "", textEdt = cell.editor.yesCom;
                        if (textEdt.invalidChars && textEdt.invalidChars.length > 0 && value && value.length > 0) {
                            for (var i = 0, len = value.length; i < len; i++) {
                                vChar = value.charAt(i);
                                if (textEdt.invalidChars.indexOf(vChar) < 0) {
                                    realValue += vChar;
                                }
                            }
                        } else {
                            realValue = value;
                        }
                        if (textEdt.textCase) {
                            if (textEdt.textCase == YIUI.TEXTEDITOR_CASE.UPPER) {
                                realValue = realValue.toUpperCase()
                            } else if (textEdt.textCase = YIUI.TEXTEDITOR_CASE.LOWER) {
                                realValue = realValue.toLowerCase();
                            }
                        }
                        value = realValue;
                    }
                    $(cell).find("input").val(value);
                }, 0);
            }
        }
    },
    onSortClick: function (iCol, sortType) {
        if (!this.getControlGrid().hasGroupRow) {
            iCol = this.p.rowSequences ? iCol - 1 : iCol;
            this.getControlGrid().gridHandler.doOnSortClick(this.getControlGrid(), iCol, sortType);
        } else {
            alert($.ygrid.error.isSortError);
        }
    },
    onSelectRow: function (iRow, rid) {
        var grid = this.getControlGrid(), oldRow = -1;
        if (this.p.selectRow !== undefined) {
            var row = grid.el.getGridRowById(this.p.selectRow);
            if (row) oldRow = row.rowIndex;
            if (!oldRow) oldRow = -1;
        }
        if (grid.hasRowClick) {
            var rowID = this.p.data[iRow - 1].rowID;
            grid.gridHandler.doOnRowClick(grid, rowID);
        }
        if (grid.hasRowChange && iRow != oldRow && iRow >= 0) {
            grid.el[0].p.selectRow = rid;
            var newRowID = this.p.data[iRow - 1].rowID,
                oldRowID = (oldRow === -1 ? -1 : this.p.data[oldRow - 1].rowID);
            grid.gridHandler.doGridCellSelect(grid, newRowID, this.p.selectCell ? this.p.selectCell : -1);
            grid.gridHandler.doOnFocusRowChange(grid, oldRowID, newRowID);
        }
    },
    getFocusRowIndex: function () {
        if (this.el[0].p.selectRow == undefined || this.el[0].p.selectRow == null) return -1;
        var row = this.el.getGridRowById(this.el[0].p.selectRow);
        return parseInt($.ygrid.stripPref($.ygrid.uidPref, row.id));
    },
    getFocusColIndex: function () {
        var selectCellIndex = this.el[0].p.selectCell;
        if (selectCellIndex) {
            selectCellIndex = this.el[0].p.rowSequences ? selectCellIndex - 1 : selectCellIndex;
        } else {
            selectCellIndex = -1;
        }
        return selectCellIndex;
    },
    ondblClickRow: function (iRow) {
        var grid = this.getControlGrid();
        if (grid.hasRowDblClick) {
            var rowID = this.p.data[iRow - 1].rowID;
            grid.gridHandler.doOnRowDblClick(grid, rowID);
        }
    },
    afterPaste: function (copyText) {
        var ri = this.p.selectRow, ci = this.p.selectCell, grid = this.getControlGrid();
        if (ri == undefined || ri == null) return;
        var rowInd = $.ygrid.stripPref($.ygrid.uidPref, ri), colInd = this.p.rowSequences ? ci - 1 : ci;
        if (this.p.selectionMode == YIUI.SelectionMode.ROW) {
            colInd = 0;
        }
        var enable = this.p.data[rowInd].data[colInd][2];
        enable = (enable == null ? this.p.enable : enable);
        if (enable && ri !== undefined && ci !== undefined && copyText !== undefined && copyText.length > 0) {
            grid.gridHandler.doCellPast(grid, this.p.data[rowInd].rowID, colInd, copyText);
        }
    },
    getControlGrid: function () {
        return this;
    },
    treeIconClick: function (rowdata, iRow) {
        var childIDs = rowdata.childRows, cid, oldRi, oldRd, grid = this.getControlGrid();
        if (grid.treeExpand) return;
        var getChildCount = function (rd, rowIDMap, treeOldData) {
            var i, count = 0, cid, oldRi, oldRd;
            if (rd.isExpand) {
                for (var i = 0, len = rd.childRows.length; i < len; i++) {
                    cid = rd.childRows[i];
                    oldRi = rowIDMap[cid];
                    oldRd = treeOldData[oldRi];
                    count += getChildCount(oldRd, rowIDMap, treeOldData);
                    count++;
                }
                rd.isExpand = false;
            }
            return count;
        };
        if (!rowdata.isExpand) {
            var len = childIDs.length;
            for (i = len - 1; i >= 0; i--) {
                cid = childIDs[i];
                oldRi = grid.rowIDMap[cid];
                oldRd = grid.treeOldData[oldRi];
                oldRd.treeLevel = rowdata.treeLevel + 1;
                if (grid.treeColIndex != null && grid.treeColIndex >= 0) {
                    oldRd.data[grid.treeColIndex][2] = false;
                }
                if (iRow >= grid.dataModel.data.length) {
                    grid.dataModel.data.push(oldRd);
                } else {
                    grid.dataModel.data.splice(iRow, 0, oldRd);
                }
            }
            grid.dataModel.data[iRow - 1].isExpand = true;
        } else {
            var childCount = getChildCount(rowdata, grid.rowIDMap, grid.treeOldData);
            grid.dataModel.data.splice(iRow, childCount);
            grid.dataModel.data[iRow - 1].isExpand = false;
        }
        var scrollTop = this.grid.bDiv.scrollTop, scrollLeft = this.grid.bDiv.scrollLeft;
        grid.refreshGrid();
        this.grid.bDiv.scrollTop = scrollTop;
        this.grid.bDiv.scrollLeft = scrollLeft;
    },
    //初始化表格构建相关的属性
    initOptions: function () {
        this.options = {
            populate: false,
            selectionMode: this.selectionMode,
            treeType: this.treeType,
            hasRowExpand: this.hasRowExpand,
            rowSequences: this.showRowHead,
            enable: this.getMetaObj().editable,
            colModel: this.dataModel.colModel.columns,
            cellLookup: this.dataModel.colModel.cells,
            data: this.dataModel.data,
            navButtons: {
                add: this.canInsert, addIcon: "ui-icon-plus", addFunc: this.rowOptFunc,
                del: this.canDelete, delIcon: "ui-icon-trash", delFunc: this.rowOptFunc,
                upRow: this.canShift, upRowIcon: "ui-icon-up", upRowFunc: this.rowOptFunc,
                downRow: this.canShift, downRowIcon: "ui-icon-down", downRowFunc: this.rowOptFunc
            },
            createCellEditor: this.createCellEditor,
            endCellEditor: this.endCellEditor,
            alwaysShowCellEditor: this.alwaysShowCellEditor,
            afterEndCellEditor: this.afterEndCellEditor,
            extKeyDownEvent: this.extKeyDownEvent,
            onSortClick: this.onSortClick,
            onSelectRow: this.onSelectRow,
            ondblClickRow: this.ondblClickRow,
            afterPaste: this.afterPaste,
            getControlGrid: this.getControlGrid,
            treeIconClick: this.treeIconClick
        };
        var length = this.dataModel.colModel.columns.length, column;
        this.options.selectFieldIndex = this.selectFieldIndex;
        if (this.pageInfo.isUsePaging) {
            this.options.showPageSet = true;
            this.options.scrollPage = false;
            this.options.rowNum = this.dataModel.data.length;
        } else {
            this.options.scrollPage = true;
            this.options.rowNum = 100;
        }
        if (this.treeColIndex !== undefined && this.treeColIndex !== -1) {
            this.options.treeColName = this.dataModel.colModel.columns[this.treeColIndex].name;
        }
        if (this.treeType !== undefined && this.treeType !== -1) {
            this.treeOldData = this.dataModel.data;
            this.dataModel.data = new Array();
            var i, rd, len;
            if (this.treeExpand) {
                for (i = 0, len = this.treeOldData.length; i < len; i++) {
                    rd = this.treeOldData[i];
                    if (rd.childRows.length > 0) {
                        rd.isExpand = true;
                    }
                    this.dataModel.data.push(rd);
                }
            } else {
                for (i = 0, len = this.treeOldData.length; i < len; i++) {
                    rd = this.treeOldData[i];
                    if (rd.parentRow === undefined) {
                        this.dataModel.data.push(rd);
                    }
                }
            }
            this.options.data = this.dataModel.data;
        }
    },
    initGroupHeaders: function () {
        this.el.initGroupHeaders(this.groupHeaders);
    },
    initGridErrors: function () {
        var th = this;
        if (!((th.errorInfoes.cells == undefined || th.errorInfoes.cells.length == 0)
            && (th.errorInfoes.rows == undefined || th.errorInfoes.rows.length == 0))) {
            for (var iRow = 0, len = th.dataModel.data.length; iRow < len; iRow++) {
                var curRowID = th.dataModel.data[iRow].rowID;
                if (th.errorInfoes.cells !== undefined) {
                    for (var i = 0, ecLen = th.errorInfoes.cells.length; i < ecLen; i++) {
                        if (th.errorInfoes.cells[i].rowID == curRowID) {
                            th.errorInfoes.cells[i].rowIndex = iRow;
                        }
                    }
                }
                if (th.errorInfoes.rows !== undefined) {
                    for (var j = 0, erLen = th.errorInfoes.rows.length; j < erLen; j++) {
                        if (th.errorInfoes.rows[j].rowID == curRowID) {
                            th.errorInfoes.rows[j].rowIndex = iRow;
                        }
                    }
                }
            }
        }
        th.setGridErrorCells(th.errorInfoes.cells);
        th.setGridErrorRows(th.errorInfoes.rows);
    },
    setGridErrorCells: function (cells) {
        this.el.setErrorCells(cells);
    },
    setGridErrorRows: function (rows) {
        this.el.setErrorRows(rows);
    },
    onRender: function (parent) {
        var self = this;
        this.base(parent);
        this.initOptions();
        this.el[0].getControlGrid = function () {
            return self;
        };
        this.el.yGrid(this.options);
        this.initPageOpts();
        this.initGroupHeaders();
        this.initGridErrors();
        this.options = null;
        if (this.selectFieldIndex >= 0) {
            this.checkHeadSelect(this.selectFieldIndex);
        }
    },

    beforeDestroy: function () {
        this.dataModel = null;
        this.groupHeaders = null;
        this.errorInfoes = null;
        this.el.GridDestroy();
    }
});

YIUI.Control.Grid = YIUI.extend(YIUI.Control.Grid, {   //纯web使用的一些方法
    rowIDMask: 0,
    randID: function () {
        return this.rowIDMask++;
    },
    setGridEnable: function (enable) {
        this.colInfoMap = {};
        this.setEnable(enable);
        this.el.setGridParam({enable: enable});
        this.el.reShowCheckColumn();
        if (enable && !this.hasAutoRow() && this.treeType === -1 && !this.hasRowExpand && this.metaRowInfo.dtlRowIndex != -1) {
            if (!this.getMetaObj().isSubDetail && this.newEmptyRow) {
                if (this.hasGroupRow) {
                    this.appendAutoRowAndGroup();
                } else {
                    this.addGridRow();
                }
            }
            if (this.hideGroup4Editing && enable) {
                var length = this.dataModel.data.length, row;
                for (var ri = length - 1; ri >= 0; ri--) {
                    row = this.dataModel.data[ri];
                    if (row.rowType == "Group" || (row.isDetail && row.bookmark == undefined)) {
                        this.dataModel.data.splice(ri, 1);
                    }
                }
                if (this.newEmptyRow) {
                    var dtlRowIndex = this.metaRowInfo.dtlRowIndex, insertIndex = -1;
                    for (var k = this.dataModel.data.length - 1; k >= 0; k--) {
                        row = this.dataModel.data[k];
                        if (row.rowType == "Group" || row.rowType == "Detail") {
                            insertIndex = k + 1;
                            break;
                        } else {
                            if (row.metaRowIndex < dtlRowIndex) {
                                insertIndex = k + 1;
                                break;
                            }
                        }
                    }
                    if (insertIndex == -1 && this.dataModel.data.length > 0) {
                        insertIndex = 0;
                    }
                    this.addGridRow(null, insertIndex, false);
                }
                this.refreshGrid();
            }
        } else if (!enable && this.treeType === -1) {
            this.removeAutoRowAndGroup();
        }
        this.el[0].updatePager();
        this.initPageOpts();
        var st = this.el[0].grid.bDiv.scrollTop;
        this.el[0].grid.bDiv.scrollTop = st + 1;
        YIUI.SubDetailUtil.clearSubDetailData(YIUI.FormStack.getForm(this.ofFormID), this);
    },
    setColumnVisible: function (colKey, visible) {
        var ci, clen, colM, gridCM, gridCi, hidden, isChange = false, isMatch = false, columnKey;
        visible = YIUI.TypeConvertor.toBoolean(visible);
        for (ci = 0, clen = this.dataModel.colModel.columns.length; ci < clen; ci++) {
            colM = this.dataModel.colModel.columns[ci];
            columnKey = colM.key;
            if (colM.isExpandCol && colM.refColumn) {
                columnKey = colM.refColumn;
            }
            if (columnKey === colKey) {
                hidden = (visible == null ? false : !visible);
                isChange = (colM.hidden !== hidden);
                colM.hidden = hidden;
                if (this.el) {
                    gridCi = this.showRowHead ? ci + 1 : ci;
                    gridCM = this.el[0].p.colModel[gridCi];
                    gridCM.hidden = colM.hidden;
                }
                isMatch = true;
                if (!this.hasColExpand) {
                    break;
                }
            } else if (this.hasColExpand && isMatch) {
                break;
            }
        }
        if (isChange) {
            var st = this.el[0].grid.bDiv.scrollTop, sl = this.el[0].grid.bDiv.scrollLeft;
            this.el[0].p.colModel.isChange = true;
            this.refreshGrid();
            this.el[0].grid.bDiv.scrollTop = st;
            this.el[0].grid.bDiv.scrollLeft = sl;
        }
    },
    setValueByKey: function (rowIndex, colKey, newValue, commitValue, fireEvent) {
        var colInfoes = this.getColInfoByKey(colKey);
        for (var i = 0, len = colInfoes.length; i < len; i++) {
            this.setValueAt(rowIndex, colInfoes[i].colIndex, newValue, commitValue, fireEvent, true);
        }
    },
    /**
     * 设置表格单元格的存储到数据库的值
     *
     * 这个方法后面要重构 TODO,少了一个参数 ignoreChanged
     *
     * YIUI.GridSumUtil.evalAffectSum先在fireEvent里面计算
     * 后面改掉
     *
     * @param rowIndex  表格值所在行集合的序号
     * @param colIndex  表格值所在列集合的序号
     * @param newValue  新值
     * @param commitValue  是否更新document
     * @param fireEvent  是否执行关联计算表达式及相关事件
     * @param isData  是否为数据
     */
    setValueAt: function (rowIndex, colIndex, newValue, commitValue, fireEvent, isData) {
        if (rowIndex == undefined || rowIndex < 0 || rowIndex > this.dataModel.data.length) return;
        var row = this.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex], oldEnable;
        oldEnable = row.data[colIndex][2];
        row.data[colIndex] = this.getCellNeedValue(rowIndex, colIndex, newValue, isData);
        this.afterTextEditing = false;
        row.data[colIndex][2] = oldEnable;
        this.el[0].p.data[rowIndex].data[colIndex] = row.data[colIndex];
        this.dataModel.data[rowIndex].data[colIndex] = row.data[colIndex];
        this.el[0].modifyGridCell(rowIndex, this.showRowHead ? colIndex + 1 : colIndex, row);
        if (commitValue) {
            var form = YIUI.FormStack.getForm(this.ofFormID);
            this.gridHandler.setCellValueToDocument(form, this, rowIndex, colIndex, row.data[colIndex][0]);
            form.getViewDataMonitor().preFireCellValueChanged(this, rowIndex, colIndex, cellKey);
            if (fireEvent) {
                this.gridHandler.fireCellChangeEvent(form, this, rowIndex, colIndex);
            }
            form.getViewDataMonitor().postFireCellValueChanged(this, rowIndex, colIndex, cellKey);
            if (!row.isDetail)
                return;
            var subDtlComps = form.subDetailInfo[this.getMetaObj().key].cells[cellKey], subDtlComp;
            if (subDtlComps != null && subDtlComps.length > 0) {
                for (var sdIndex = 0, len = subDtlComps.length; sdIndex < len; sdIndex++) {
                    subDtlComp = subDtlComps[sdIndex];
                    subDtlComp = form.getComponent(subDtlComp);
                    if (subDtlComp && parseInt($.ygrid.stripPref($.ygrid.uidPref, this.el[0].p.selectRow), 10) == rowIndex) {
                        subDtlComp.setValue(row.data[colIndex][0], true, false);
                    }
                }
            }
        }
        this.checkCellRequired(rowIndex, colIndex);
    },
    checkCellRequired: function (rowIndex, colIndex) {
        var rowData = this.getRowDataAt(rowIndex),
            cellKey = rowData.cellKeys[colIndex],
            editOpt = this.dataModel.colModel.cells[cellKey],
            cellData = this.getCellDataAt(rowIndex, colIndex);
        if (!editOpt.isRequired) return;
        if (cellData[1] == null || cellData[1] == "") {
            this.setCellRequired(rowIndex, colIndex, true);
        } else {
            this.setCellRequired(rowIndex, colIndex, false);
        }
    },
    getValueByKey: function (rowIndex, colKey) {
        var colIndex = this.getColInfoByKey(colKey)[0].colIndex;
        return this.getValueAt(rowIndex, colIndex);
    },
    getValueAt: function (rowIndex, colIndex) {
        if (rowIndex == undefined) {
            rowIndex = this.getFocusRowIndex();
        }
        if (this.dataModel.data[rowIndex] == undefined || this.dataModel.data[rowIndex].data == undefined)
            return null;
        return this.dataModel.data[rowIndex].data[colIndex][0];
    },
    /**
     * 新增表格行
     * @param rowData 行数据对象
     * @param rowIndex 行数据对象在表格数据对象中的序号
     * @param isNewGroup 是否为新分组中的明细
     * @param needCalc 是否计算默认值
     */
    addGridRow: function (rowData, rowIndex, isNewGroup, needCalc) {
        var data = this.dataModel.data, dataLength = data.length, value,
            form = YIUI.FormStack.getForm(this.ofFormID), isNewData = false,
            dtrRowIndex = this.metaRowInfo.dtlRowIndex,
            dtlMetaRow = this.metaRowInfo.rows[dtrRowIndex];
        needCalc = (needCalc == null ? true : needCalc);
        if (!rowData) {
            rowData = {};
            rowData.isDetail = true;
            rowData.isEditable = true;
            rowData.rowHeight = dtlMetaRow.rowHeight;
            rowData.rowID = this.randID();
            rowData.metaRowIndex = dtrRowIndex;
            rowData.rowType = "Detail";
            rowData.cellKeys = dtlMetaRow.cellKeys;
            rowData.data = [];
            rowData.cellBkmks = [];
            rowData.rowGroupLevel = dtlMetaRow.rowGroupLevel;
            isNewData = true;
        }
        rowIndex = parseInt(rowIndex, 10);
        if (isNaN(rowIndex) || rowIndex < 0 || (rowIndex >= dataLength && !isNewGroup)) {
            rowIndex = -1;
        }
        if (rowIndex == -1) {
            var rd, lastDetailRow;
            for (var ri = dataLength - 1; ri >= 0; ri--) {
                rd = data[ri];
                if (rd.isDetail) {
                    lastDetailRow = ri;
                    break;
                }
            }
            if (dataLength == 0) {
                rowData.insertRowID = -1;
                rowIndex = 0;
                data.push(rowData);
            } else {
                if (lastDetailRow == undefined) {
                    rowData.insertRowID = (data[dtrRowIndex - 1] == undefined ? -1 : data[dtrRowIndex - 1].rowID);
                    rowIndex = dtrRowIndex;
                } else {
                    rowData.insertRowID = data[lastDetailRow].rowID;
                    rowIndex = lastDetailRow + 1;
                }
                data.splice(rowIndex, 0, rowData);
            }
        } else {
            if (rowIndex == 0) {
                rowData.insertRowID = -1;
            } else {
                rowData.insertRowID = data[rowIndex - 1].rowID;
            }
            data.splice(rowIndex, 0, rowData);
        }
        if (isNewData) {
            for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
                var cm = this.dataModel.colModel.columns[i], cellKey = data[rowIndex].cellKeys[i],
                    editOpt = this.dataModel.colModel.cells[cellKey];
                if (cm.name == "rowID") continue;
                if (editOpt !== undefined && editOpt.tableKey == undefined && editOpt.columnKey == undefined
                    && (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink")) {
                    value = dtlMetaRow.cells[i].caption;
                }
                value = this.getCellNeedValue(rowIndex, i, value, true);
                value.push(true);
                rowData.data[i] = value;
                value = null;
            }
        }
        var ts = this.el[0];
        if (ts.p.selectRow) {
            var preSelRow = $(ts).yGrid('getGridRowById', ts.p.selectRow);
            preSelRow && $(preSelRow.cells[ts.p.selectCell]).removeClass("ui-state-highlight");
            if (this.selectionMode == YIUI.SelectionMode.ROW) {
                $(preSelRow.cells).each(function () {
                    $(this).removeClass("ui-state-highlight");
                });
            }
        }
        ts.insertGridRow(rowIndex, rowData);
        ts.p.selectRow = null;
        ts.p.selectCell = null;
        ts.grid.clearSelectCells();
        this.refreshErrors(rowIndex, false);
        if (needCalc) {
            form.getUIProcess().calcEmptyRow(this, rowIndex);
            form.getUIProcess().doPostInsertRow(this, rowIndex);
        }
        return rowData;
    },
    refreshErrors: function (rowIndex, isDelete) {
        var grid = this, eCell, eRow;
        for (var i = grid.errorInfoes.cells.length - 1; i >= 0; i--) {
            eCell = grid.errorInfoes.cells[i];
            if (eCell.rowIndex >= rowIndex) {
                if (isDelete && eCell.rowIndex == rowIndex) {
                    grid.errorInfoes.cells.splice(i, 1);
                } else {
                    eCell.rowIndex = (isDelete ? eCell.rowIndex - 1 : eCell.rowIndex + 1);
                }
            }
        }
        for (var j = grid.errorInfoes.rows.length - 1; j >= 0; j--) {
            eRow = grid.errorInfoes.rows[j];
            if (eRow.rowIndex >= rowIndex) {
                if (isDelete && eRow.rowIndex == rowIndex) {
                    grid.errorInfoes.rows.splice(j, 1);
                } else {
                    eRow.rowIndex = (isDelete ? eRow.rowIndex - 1 : eRow.rowIndex + 1);
                }
            }
        }
        grid.el.setErrorCells(grid.errorInfoes.cells);
        grid.el.setErrorRows(grid.errorInfoes.rows);
    },
    appendAutoRowAndGroup: function () {
        var th = this.el, self = this, isDetail = false , isAutoRow = false, data = this.dataModel.data;
        for (var i = 0; i < data.length; i++) {
            var rd = data[i], addRD;
            if (isDetail && !isAutoRow && !rd.isDetail) {
                addRD = this.addGridRow(null, i, false);
                i++;
            }
            isDetail = rd.isDetail;
            isAutoRow = (rd.bookmark === undefined);
        }
        if (isDetail && !isAutoRow) {
            this.addGridRow(null, i, false);
        }
        var getInsertRowIndex = function (grid, data) {
            var dtlRowIndex = grid.metaRowInfo.dtlRowIndex;
            for (var i = data.length - 1, row; i >= 0; i--) {
                row = data[i];
                if (row.rowType == "Group" || row.rowType == "Detail") {
                    return i + 1;
                } else {
                    if (row.metaRowIndex < dtlRowIndex) {
                        return i + 1;
                    }
                }
            }
            if (data.length > 0) {
                return 0;
            }
            return -1;
        };
        var addGroup = function (groupObj) {
            for (var j = 0, glen = groupObj.length; j < glen; j++) {
                var rowObj = groupObj[j];
                if (rowObj.length > 0) {
                    addGroup(rowObj);
                } else {
                    var newGR = {}, insertIndex;
                    if (rowObj.rowType === "Group") {
                        newGR.cellKeys = rowObj.cellKeys;
                        newGR.rowType = rowObj.rowType;
                        newGR.isDetail = false;
                        newGR.isEditable = false;
                        newGR.rowHeight = rowObj.rowHeight;
                        newGR.rowID = self.randID();
                        newGR.data = [];
                        newGR.cellBkmks = [];
                        for (var ci = 0, clen = rowObj.cells.length; ci < clen; ci++) {
                            var cellObj = rowObj.cells[ci];
                            newGR.data[ci] = ["", cellObj.caption, false];
                        }
                        var metaRow, index = -1, rowGroupLevel, isGroupHead, isGroupTail;
                        for (var i = 0, rLen = self.metaRowInfo.rows.length; i < rLen; i++) {
                            metaRow = self.metaRowInfo.rows[i];
                            if (metaRow.key == rowObj.key) {
                                index = i;
                                rowGroupLevel = metaRow.rowGroupLevel;
                                isGroupHead = metaRow.isGroupHead;
                                isGroupTail = metaRow.isGroupTail;
                                break;
                            }
                        }
                        newGR.metaRowIndex = index;
                        newGR.rowGroupLevel = rowGroupLevel;
                        newGR.isGroupHead = isGroupHead;
                        newGR.isGroupTail = isGroupTail;
                        insertIndex = getInsertRowIndex(self, data);
                        if (insertIndex == -1) {
                            data.push(newGR);
                            th[0].insertGridRow(data.length - 1, newGR);
                        } else {
                            data.splice(insertIndex, 0, newGR);
                            th[0].insertGridRow(insertIndex, newGR);
                        }
                    } else if (rowObj.rowType === "Detail") {
                        newGR = self.addGridRow(null, getInsertRowIndex(self, data), true);
                    }
                    newGR.inAutoGroup = true;
                }
            }
        };
        for (var ind = 0, len = this.metaRowInfo.rowGroupInfo.length; ind < len; ind++) {
            var groupObj = this.metaRowInfo.rowGroupInfo[ind];
            if (groupObj.length > 0) {
                addGroup(groupObj);
            }
        }
    },
    removeAutoRowAndGroup: function () {
        var th = this.el, data = this.dataModel.data, row;
        for (var i = data.length - 1; i >= 0; i--) {
            row = data[i];
            if (row.inAutoGroup || (row.isDetail && row.bookmark === undefined)) {
                data.splice(i, 1);
                this.el[0].deleteGridRow(i);
            }
        }
    },

    /**
     * 删除表格行
     * @param rowIndex
     */
    deleteGridRow: function (rowIndex) {
        rowIndex = parseInt(rowIndex, 10);
        if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= this.dataModel.data.length)  return false;
        var isNeedDelete = function (grid, rowIndex) {
            var row = grid.dataModel.data[rowIndex];
            if (!row.isDetail) {
                return false;
            }
            var form = YIUI.FormStack.getForm(grid.ofFormID);
            if (form.getOperationState() != YIUI.Form_OperationState.Default) {
                if (!$.isDefined(row.bookmark)) {
                    if (rowIndex == grid.getRowCount() - 1) {
                        return false;
                    }
                    var nextRow = grid.dataModel.data[rowIndex + 1];
                    if (nextRow.rowType != "Detail") {
                        return false;
                    }
                }
            }
            return true;
        };
        if (!isNeedDelete(this, rowIndex)) {
            return false;
        }
        var selCell = this.el[0].p.selectCell;
        var bookmark = this.dataModel.data[rowIndex].bookmark;
        this.dataModel.data.splice(rowIndex, 1);
        this.el[0].deleteGridRow(rowIndex);
        this.el[0].p.selectRow = null;
        this.el[0].p.selectCell = null;
        this.el[0].grid.clearSelectCells();
        this.refreshErrors(rowIndex, true);
        var row = $("#" + $.ygrid.uidPref + rowIndex, this.el);
        if (row.length > 0) {
            $(row[0].cells[selCell]).click();
        }
        var form = YIUI.FormStack.getForm(this.ofFormID), doc = form.getDocument();
        YIUI.GridSumUtil.evalSum(form, this);
        if (bookmark == undefined) return true;
        if (!doc) return true;
        var dataTable = doc.getByKey(this.tableKey);
        if (!dataTable) return true;
        if (bookmark.length == undefined) {
            dataTable.setByBkmk(bookmark);
            dataTable.delRow(dataTable.pos);
        } else {
            for (var i = 0, len = bookmark.length; i < len; i++) {
                dataTable.setByBkmk(bookmark[i]);
                dataTable.delRow(dataTable.pos);
            }
        }
        this.gridHandler.dealWithSequence(form, this);
        return true;
    },
    /**
     * 是否有空白编辑行
     */
    hasAutoRow: function () {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i], isDetail = row.isDetail, bookmark = parseInt(row.bookmark, 10);
            if (isNaN(bookmark) && isDetail) return true;
        }
        return false;
    },
    setFocusRowIndex: function (rowIndex) {
        var gr = this.el.getGridRowAt(rowIndex + 1);
        this.el[0].p.selectRow = gr.id;
    },
    /**
     * 根据rowID获得表格行数据的序号
     * @param rowID   表格行数据的标识
     * @returns {number} 表格数据行序号
     */
    getRowIndexByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  i;
        }
        return -1;
    },
    getRowDataByID: function (rowID) {
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var row = this.dataModel.data[i];
            if (row.rowID === rowID) return  row;
        }
        return null;
    },
    getRowDataAt: function (rowIndex) {
        return this.dataModel.data[rowIndex];
    },
    getCellIndexByKey: function (colKey) {
        return this.getColInfoByKey(colKey)[0].colIndex;
    },
    getCellDataByKey: function (rowIndex, colKey) {
        var colIndex = this.getColInfoByKey(colKey)[0].colIndex;
        return this.getCellDataAt(rowIndex, colIndex);
    },
    getCellDataAt: function (rowIndex, colIndex) {
        if (rowIndex == undefined) {
            rowIndex = this.getFocusRowIndex();
        }
        if (this.dataModel.data[rowIndex] == undefined)
            return null;
        return this.dataModel.data[rowIndex].data[colIndex];
    },
    setColumnEnable: function (colIndex, enable) {
        this.dataModel.colModel.columns[colIndex].editable = enable;
    },
    getFixRowInfoByCellKey: function (key) {
        var getFixInfoes = function (grid, rowData, rowIndex, cellKey) {
            var cKey , cEditOpt, isMatch = false, cellInfoes = [], column;
            for (var j = 0, clen = grid.dataModel.colModel.columns.length; j < clen; j++) {
                cKey = rowData.cellKeys[j];
                if (cKey == cellKey) {
                    column = grid.dataModel.colModel.columns[j];
                    cEditOpt = grid.dataModel.colModel.cells[cellKey];
                    if (grid.hasColExpand) {
                        cellInfoes.push({rowIndex: rowIndex, colIndex: j, col: column, cell: cEditOpt, metaRowIndex: rowData.metaRowIndex});
                        isMatch = true;
                    } else {
                        return [
                            {rowIndex: rowIndex, colIndex: j, col: column, cell: cEditOpt, metaRowIndex: rowData.metaRowIndex}
                        ];
                    }
                } else if (grid.hasColExpand && isMatch) {
                    return cellInfoes;
                }
            }
            return null;
        };
        var rowData, result;
        for (var i = 0, rlen = this.dataModel.data.length; i < rlen; i++) {
            rowData = this.dataModel.data[i];
            if (rowData.rowType == "Fix" || rowData.rowType == "Total") {
                result = getFixInfoes(this, rowData, i, key);
                if (result !== null) {
                    return result;
                }
            } else if (rowData.rowType == "Detail" || rowData.rowType == "Group") {
                break;
            }
        }
        for (var m = this.dataModel.data.length - 1; m >= 0; m--) {
            rowData = this.dataModel.data[m];
            if (rowData.rowType == "Fix" || rowData.rowType == "Total") {
                result = getFixInfoes(this, rowData, m, key);
                if (result !== null) {
                    return result;
                }
            } else if (rowData.rowType == "Detail" || rowData.rowType == "Group") {
                break;
            }
        }
        return null;
    },
    getColumnAt: function (colIndex) {
        return this.dataModel.colModel.columns[colIndex];
    },
    getColInfoByKey: function (key) {
        var cell = this.dataModel.colModel.cells[key], ci, column,
            dtlRi = this.metaRowInfo.dtlRowIndex, dtlMr = this.metaRowInfo.rows[dtlRi];
        if (cell == null || cell == undefined) return null;
        if (this.hasColExpand) {
            var colInfoes = [], metaCell;
            for (var cind = 0, cLen = dtlMr.cells.length; cind < cLen; cind++) {
                metaCell = dtlMr.cells[cind];
                if (metaCell.key == key) {
                    column = this.dataModel.colModel.columns[cind];
                    colInfoes.push({col: column, cell: cell, colIndex: cind, metaRow: dtlMr});
                }
            }
            return colInfoes;
        } else {
            ci = cell.colIndex;
            column = this.dataModel.colModel.columns[ci];
            return [
                {col: column, cell: cell, colIndex: ci, metaRow: dtlMr}
            ];
        }
    },
    colInfoMap: {},
    setCellEnable: function (rowIndex, cellKey, enable) {
        var rd = this.dataModel.data[rowIndex],
            gridRd = this.el[0].p.data[rowIndex], gridRow,
            colInfoes = this.colInfoMap[cellKey];
        if (colInfoes == undefined) {
            colInfoes = this.getColInfoByKey(cellKey);
            if (colInfoes !== null) {
                this.colInfoMap[cellKey] = colInfoes;
            }
        }
        if (colInfoes == null) {
            colInfoes = this.getFixRowInfoByCellKey(cellKey);
            if (colInfoes !== null) {
                this.colInfoMap[cellKey] = colInfoes;
            }
        }
        if (colInfoes == null) return;
        for (var i = 0, len = colInfoes.length; i < len; i++) {
            var colIndex = colInfoes[i].colIndex, grindex,
                cell, rnct = (this.showRowHead ? 1 : 0), editOpt = colInfoes[i].cell;
            if (editOpt == null || editOpt.edittype == "label") continue;
            if (this.rowExpandIndex == colIndex || this.treeColIndex == colIndex) {
                enable = false;
            }
            rd.data[colIndex][2] = enable;
            gridRd.data[colIndex][2] = enable;
            grindex = this.el[0].p._indexMap[rowIndex];
            if (grindex == undefined || grindex == null) return;
            gridRow = this.el[0].rows[this.el[0].p._indexMap[rowIndex]];
            if (gridRow === undefined || gridRow == null) return;
            cell = gridRow.cells[colIndex + rnct];
            var operationState = YIUI.FormStack.getForm(this.ofFormID).getOperationState();
            var formEnable = (operationState == YIUI.Form_OperationState.New || operationState == YIUI.Form_OperationState.Edit);
            if (formEnable !== enable) {
                if (enable) {
                    $(cell).removeClass("ui-cell-disabled");
                } else {
                    $(cell).addClass("ui-cell-disabled");
                }
            } else {
                if (enable) {
                    $(cell).removeClass("ui-cell-disabled");
                }
            }
            if (editOpt && editOpt.isAlwaysShow && (rd.isDetail || rd.rowType == "Fix")) {
                switch (editOpt.formatter) {
                    case "button":
                        $(".cellEditor .upload", cell)[0] && ($(".cellEditor .upload", cell)[0].enable = enable);
                        $(".cellEditor button", cell)[0] && ($(".cellEditor button", cell)[0].enable = enable);
                        break;
                    case "hyperlink":
                    case "image":
                        $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                        break;
                    case "checkbox":
                        $(".cellEditor", cell)[0] && ($(".cellEditor", cell)[0].enable = enable);
                        if (enable) {
                            $("input", cell).removeAttr("disabled");
                        } else {
                            $("input", cell).attr('disabled', 'disabled');
                        }
                        break;
                }
            }
        }
    },
    /**
     * 获取data集合中对应的单元格需要的值
     * @param rowIndex  行号
     * @param colIndex  列号
     * @param value  外来值
     * @param isData  是否为数据库存储值
     * @returns {*} json对象，形式为：{value:value,cation:caption}
     */
    getCellNeedValue: function (rowIndex, colIndex, value, isData) {
        var options, edittype, opt = {}, self = this,
            row = this.dataModel.data[rowIndex], cellKey = row.cellKeys[colIndex] ,
            editOpt = this.dataModel.colModel.cells[cellKey], caption = value,
            form = YIUI.FormStack.getForm(this.ofFormID);
        if (value instanceof Decimal) {
            caption = value.toString();
        }
        if (editOpt == undefined) return [value, caption];
        options = editOpt.editOptions;
        if (editOpt.edittype == "dynamic") {
            var typeFormula = options.typeFormula;
            var typeDefKey = form.eval(typeFormula, {form: form, rowIndex: rowIndex, colIndex: colIndex});
            var cellTypeDef = DynamicCell.getCellTypeTable()[form.formKey][typeDefKey];
            if (cellTypeDef != null) {
                edittype = cellTypeDef.options.edittype;
                opt = $.extend(opt, cellTypeDef.options, {typeDefKey: typeDefKey});
            }
        } else {
            edittype = editOpt.edittype;
        }
        switch (edittype) {
            case "numberEditor":
                opt = $.extend(true, opt, options);
                if (isData != null && !isData) {
                    value = value.replace(new RegExp(opt.sep, "gm"), "");
                }
                opt.newVal = value;
                opt.oldVal = null;
                var callBack = function (v, c) {
                    value = v;
                    if (value && value.isZero() && editOpt.editOptions.zeroString !== undefined) {
                        caption = editOpt.editOptions.zeroString;
                    } else {
                        caption = c;
                    }
                };
                YIUI.NumberEditorBehavior.checkAndSet(opt, callBack);
                if (value == null) {
                    value = new Decimal(0);
                } else if (!(value instanceof Decimal)) {
                    value = new Decimal(value, 10);
                }
                if (value.isZero() && editOpt.editOptions.zeroString !== undefined) {
                    caption = editOpt.editOptions.zeroString;
                }
                break;
            case "textButton":
            case "textEditor":
                if (!this.afterTextEditing) {
                    opt = $.extend(true, opt, options);
                    value = caption = YIUI.TextFormat.format(value, opt);
                }
                break;
            case "comboBox":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                opt = $.extend(true, opt, options);
                var combobox = {
                    key: editOpt.key,
                    typeDefKey: opt.typeDefKey,
                    sourceType: opt.sourceType,
                    formula: opt.formula,
                    globalItems: opt.globalItems,
                    queryParas: opt.queryParas,
                    needRebuild: (editOpt.needRebuild == null ? true : editOpt.needRebuild),
                    ofFormID: this.ofFormID,
                    setItems: function (items) {
                        opt.items = items;
                    },
                    checkItem: $.noop,
                    getValue: $.noop
                };
                YIUI.ComboBoxHandler.getComboboxItems(combobox, {form: form, rowIndex: rowIndex, colIndex: colIndex});
                var realValue = "" , realCaption = "", length = (opt.items == undefined ? 0 : opt.items.length);
                for (var i = 0; i < length; i++) {
                    var item = opt.items[i];
                    if (item.value == null) continue;
                    if (opt.type === "combobox") {
                        if (isData ? ( item.value.toString() == value.toString()) : (item.caption == value.toString())) {
                            realValue = item.value;
                            realCaption = item.caption;
                            break;
                        }
                    } else {
                        var valueArray = value.split(",");
                        if (isData ? (valueArray.indexOf(item.value.toString()) !== -1) : (valueArray.indexOf(item.caption) !== -1)) {
                            realValue += "," + item.value;
                            realCaption += "," + item.caption;
                        }
                    }
                }
                if (opt.type === "checklistbox") {
                    realValue = realValue.substr(1);
                    realCaption = realCaption.substr(1);
                }
                value = realValue;
                caption = realCaption;
                break;
            case "dict":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                opt = $.extend(true, opt, options);
                if (opt.isDynamic) {
                    opt.itemKey = form.eval(opt.refKey, {form: form});
                }
                if (value instanceof YIUI.ItemData || typeof value == "object") {
                    if (opt.multiSelect) {
                        var tempValue = "";
                        for (var di = 0, dlen = value.length; di < dlen; di++) {
                            tempValue += "," + value[di].oid;
                        }
                        if (tempValue.length > 0) {
                            value = tempValue.substr(1);
                        }
                        caption = "";
                    } else {
                        value = value.oid;
                    }
                }
                var values , ret, rootValue = {oid: 0, itemKey: opt.itemKey}, dictFilter = editOpt.dictFilter;
                if (dictFilter == null || editOpt.needRefreshFilter) {
                    dictFilter = YIUI.DictHandler.getDictFilter(form, cellKey, opt.itemFilters, opt.itemKey);
                    editOpt.needRefreshFilter = false;
                    editOpt.dictFilter = dictFilter;
                }
                if (form.dictCaption == null) {
                    form.dictCaption = {};
                }
                if (isData) {
                    if (opt.multiSelect) {
                        values = value.split(",");
                        value = [];
                        for (var index = 0, len = values.length; index < len; index++) {
                            var tempCaption = form.dictCaption[opt.itemKey + "_" + values[index]];
                            if (tempCaption == null) {
                                if (parseFloat(values[index]) != 0) {
                                    ret = YIUI.DictService.locate(opt.itemKey, "OID", values[index], dictFilter, rootValue, opt.stateMask);
                                    if (ret != null) {
                                        tempCaption = ret.caption;
                                        form.dictCaption[opt.itemKey + "_" + values[index]] = tempCaption;
                                    }
                                }
                            }
                            if (tempCaption != null)
                                caption += tempCaption + ",";
                            value.push({oid: parseFloat(values[index]), caption: tempCaption, itemKey: opt.itemKey})
                        }
                        if (caption.length > 0)
                            caption = caption.substring(0, caption.length - 1);
                    } else {
                        caption = form.dictCaption[opt.itemKey + "_" + value];
                        if (caption == null && parseFloat(value) != 0) {
                            ret = YIUI.DictService.locate(opt.itemKey, "OID", parseFloat(value), dictFilter, rootValue, opt.stateMask);
                            if (ret != null) {
                                caption = ret.caption;
                                form.dictCaption[opt.itemKey + "_" + value] = caption;
                            }
                        }
                        value = {oid: parseFloat(value), caption: caption, itemKey: opt.itemKey}
                    }
                } else {
                    if (opt.multiSelect) {
                        var str = value.split(",");
                        values = [];
                        for (var si = 0, sLen = str.length; si < sLen; si++) {
                            values.push(str[si].split(" ")[0]);
                        }
                        value = [];
                        caption = [];
                        for (var ci = 0, clen = values.length; ci < clen; ci++) {
                            ret = YIUI.DictService.locate(opt.itemKey, "Code", values[ci], dictFilter, rootValue, opt.stateMask);
                            if (ret) {
                                value.push({oid: ret.value.oid, caption: ret.caption, itemKey: opt.itemKey});
                                caption.push(ret.caption);
                                caption.push(",");
                            }
                        }
                        caption.pop();
                        caption = caption.join("");
                    } else {
                        values = value.split(" ")[0];
                        ret = YIUI.DictService.locate(opt.itemKey, "Code", values, dictFilter, rootValue, opt.stateMask);
                        if (ret) {
                            value = {oid: ret.oid, caption: ret.caption, itemKey: opt.itemKey};
                            caption = ret.caption;
                        } else {
                            value = null;
                            caption = "";
                        }
                    }
                }
                break;
            case "datePicker":
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
                var date, formatStr, dateStr;
                if (isData) {
                    if ($.isNumeric(value)) {
                        date = new Date(parseFloat(value));
                    } else if ($.isString(value)) {
                        dateStr = value.split(" ");
                        if (dateStr.length == 1) {
                            value = value + " 00:00:00";
                        }
                        date = new Date(Date.parse(value.replace(/-/g, "/")));
                    } else if (value instanceof Date) {
                        date = value;
                    }
                } else {
                    dateStr = value.split(" ");
                    if (dateStr.length == 1) {
                        value = value + " 00:00:00";
                    }
                    date = new Date(Date.parse(value.replace(/-/g, "/")));
                }
                value = date.getTime();
                formatStr = options.formatStr;
                caption = self.gridHandler.formatDate(date, formatStr);
                break;
            case "utcDatePicker":
                if (value == null || value.length == 0 || value === undefined || parseFloat(value) == 0) {
                    return [null, ""];
                }
                if ($.isNumeric(value)) {
                    caption = YIUI.UTCDateFormat.formatCaption(parseFloat(value), options.isOnlyDate, true);
                } else if ($.isString(value)) {
                    caption = value;
                    value = YIUI.UTCDateFormat.format(value, options);
                }
                break;
            case "checkBox":
                if (value == null || value.length == 0 || value === undefined) {
                    return [false, "false"];
                }
                if (value instanceof Decimal) {
                    value = value.toNumber();
                }
                break;
            default:
                if (value == null || value.length == 0 || value === undefined) {
                    return [null, ""];
                }
        }
        return [value, caption];
    },

    reload: function () {
        var form = YIUI.FormStack.getForm(this.ofFormID);
        var showLV = YIUI.ShowGridData(form, this);
        showLV.load(this);
        form.getUIProcess().doPostShowData(false);
    },

    repaint: function () {
        this.repaintHeaders();
        this.el[0].p.colModel.isChange = true;
        this.refreshGrid();
    },

    repaintHeaders: function () {
        var ts = this.el[0], $rowHeader = $("tr.ui-ygrid-headers", ts.grid.hDiv),
            firstRow = $("tr.ygfirstrow", ts.grid.bDiv);
        $(ts.grid.headers).each(function (iCol, th) {
            if (ts.p.colModel[iCol].hidden) {
                $(th.el).css("display", "none");
                firstRow.find("td").eq(iCol).css("display", "none");
            } else {
                $(th.el).css("display", "");
                firstRow.find("td").eq(iCol).css("display", "");
            }
        });
        for (var hi = 0, hlen = ts.grid.headers.length; hi < hlen; hi++) {
            var header = ts.grid.headers[hi].el, cells = $rowHeader[0].cells;
            $("div", header).attr("style", "");
            if ($.inArray(cells, header) == -1) {
                $rowHeader.append(header);
            } else {
                header.after(ts.grid.headers[hi - 1].el);
            }
        }
        $(ts.grid.hDiv).find("tr.ui-ygrid-columnheader").remove();
        var column, colHeader;
        for (var ci = 0, clen = this.dataModel.colModel.columns.length; ci < clen; ci++) {
            column = this.dataModel.colModel.columns[ci];
            colHeader = $rowHeader[0].childNodes[ci + (this.showRowHead ? 1 : 0)];
            $(colHeader).attr("title", column.label);
            $(".colCaption", colHeader).html(column.label);
        }
        $(ts).initGroupHeaders(ts.p.groupHeaders);
    },
    clearGridData: function () {
        this.dataModel.data = [];
        this.el.clearGridData();
    },
    refreshGrid: function (opt) {
        if (opt == undefined || opt == null) {
            opt = {};
        }
        this.el.clearGridData();
        opt.data = this.dataModel.data;
        if (this.pageInfo.isUsePaging || this.el[0].p.rowNum == 0) {
            opt.rowNum = this.dataModel.data.length;
        }
        this.el.setGridParam(opt);
        this.isActivity() && this.el.trigger("reloadGrid");
        this.initPageOpts(opt.needCalc);
        this.initGridErrors();
        YIUI.SubDetailUtil.showSubDetailData(this, -1);
    },
    getPageInfo: function () {
        return this.pageInfo;
    },

    getRowCount: function () {
        return this.dataModel.data.length;
    },
    addGridRows: function (addJSON, addTable, needCalc) {
        var addRow, insertRi, dtBookmark, newBookmark,
            form = YIUI.FormStack.getForm(this.ofFormID),
            dataTable = form.getDocument().getByKey(this.tableKey);
        var getLastDetailRow = function (grid) {
            for (var i = grid.dataModel.data.length - 1, row; i >= 0; i--) {
                row = grid.dataModel.data[i];
                if (row.isDetail && row.bookmark !== undefined) {
                    return i;
                }
            }
            return -1;
        };
        for (var i = 0, len = addJSON.length; i < len; i++) {
            addRow = addJSON[i];
            this.initOneRow(addRow);
            insertRi = getLastDetailRow(this);
            addRow.rowID = this.randID();
            this.addGridRow(addRow, insertRi + 1, false, needCalc);
            dtBookmark = addRow.bookmark;
            addTable.setByBkmk(dtBookmark);
            dataTable.addRow();
            for (var j = 0, dcLen = dataTable.cols.length, col; j < dcLen; j++) {
                col = dataTable.cols[j];
                dataTable.set(j, addTable.get(addTable.indexByKey(col.key)));
            }
            addRow.bookmark = dataTable.getBkmk();
        }
    },
    /**
     * 获取表格某个字段的值的集合
     */
    getFieldArray: function (form, colKey, condition) {
        var doc = form.getDocument(), list = new Array(), dataTable;
        dataTable = doc.getByKey(this.tableKey);
        for (var i = 0, len = this.dataModel.data.length; i < len; i++) {
            var rd = this.dataModel.data[i], bookmark = rd.bookmark, cell;
            if (rd.isDetail && bookmark !== undefined) {
                dataTable.setByBkmk(bookmark);
                var isSelect = false;
                if (this.selectFieldIndex != -1) {
                    isSelect = this.getValueAt(i, this.selectFieldIndex);
                }
                if (isSelect) {
                    cell = dataTable.getByKey(colKey);
                    list.push(cell);
                }
            }
        }
        if (this.selectFieldIndex != -1 && $.isEmptyObject(list)) {
            YIUI.ViewException.throwException(YIUI.ViewException.DATA_BINDING_ERROR);
        }
        return list;
    },
    isCellNull: function (rowIndex, colKey) {
        var colInfo = this.getColInfoByKey(colKey)[0], value = this.getValueAt(rowIndex, colInfo.colIndex);
        switch (colInfo.cell.edittype) {
            case "numberEditor":
                return value == 0 || value.isZero();
            case "textEditor":
                return value == null || value.length == 0;
            case "datePicker":
            case "utcDatePicker":
            case "dict":
            case "comboBox":
                return  value == null || value == undefined;
        }
        return false;
    },
    showDetailRow: function (rowIndex, calcRow) {
        var form = YIUI.FormStack.getForm(this.ofFormID),
            table = form.getDocument().getByKey(this.tableKey),
            dtlRowIndex = this.metaRowInfo.dtlRowIndex,
            metaRow = this.metaRowInfo.rows[dtlRowIndex],
            rd = this.dataModel.data[rowIndex];
        if (table == undefined || rd == undefined || rd == null || !rd.isDetail || rd.bookmark == undefined) return;
        var bookmark = rd.bookmark, editOpt, metaCell, cBookmark;
        for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
            metaCell = metaRow.cells[i];
            editOpt = this.dataModel.colModel.cells[rd.cellKeys[i]];
            if (editOpt.hasDB) {
                if (metaCell.isColExpand) {
                    cBookmark = rd.cellBkmks[i];
                    if (cBookmark) {
                        table.setByBkmk(cBookmark);
                        this.setValueAt(rowIndex, i, table.getByKey(editOpt.columnKey), false, false, true);
                    }
                } else {
                    table.setByBkmk(bookmark);
                    this.setValueAt(rowIndex, i, table.getByKey(editOpt.columnKey), false, false, true);
                }
            } else if (editOpt.edittype == "label" || editOpt.edittype == "button" || editOpt.edittype == "hyperLink") {
                this.setValueAt(rowIndex, i, metaCell.caption, false, false, false);
            } else if (metaCell.isSelect) {
                table.setByBkmk(bookmark);
                this.setValueAt(rowIndex, i, table.getByKey(YIUI.DataUtil.System_SelectField_Key), false, false, false);
            }
        }
        if (calcRow) {
            form.getUIProcess().calcEmptyRow(this, rowIndex);
        }
    },
    setColumnCaption: function (colKey, caption) {
        var column;
        for (var i = 0, len = this.dataModel.colModel.columns.length; i < len; i++) {
            column = this.dataModel.colModel.columns[i];
            if (column.key == colKey) {
                column.label = caption;
                break;
            }
        }
        this.repaintHeaders();
    },
    getColumnCount: function () {
        return this.dataModel.colModel.columns.length;
    },
    getMetaCellInDetail: function (colIndex) {
        var dtlIndex = this.metaRowInfo.dtlRowIndex, dtlRow = this.metaRowInfo.rows[dtlIndex];
        return dtlRow.cells[colIndex];
    },
    setForeColor: function (color) {
        this.el[0].p.foreColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'color': color
        });
    },
    setBackColor: function (color) {
        this.el[0].p.backColor = color;
        $(".ygrid-rownum,th", $("#gbox_" + this.id)).css({
            'background-image': 'none',
            'background-color': color
        });
    },
    initFirstFocus: function () {
        this.setCellFocus(0, 0);
    },
    setCellFocus: function (rowIndex, colIndex) {
        this.el.setCellFocus(rowIndex + 1, this.showRowHead ? colIndex + 1 : colIndex);
    },
    requestNextFocus: function () {
        this.focusManager.requestNextFocus(this);
    },
    isActivity: function () {
        var parents = this.el.parents(), parent;
        for (var i = 0, len = parents.length; i < len; i++) {
            parent = parents[i];
            if (parent.style.display == "none") {
                return false;
            }
        }
        return true;
    },
    getLastDetailRowIndex: function () {
        for (var i = this.getRowCount() - 1; i >= 0; i--) {
            var row = this.getRowDataAt(i);
            if (row.isDetail && row.bookmark == null) {
                return  i;
            }
        }
        return -1;
    },
    setCellRequired: function (rowIndex, cellIndex, isRequired) {
        this.el.setCellRequired(rowIndex + 1, this.showRowHead ? cellIndex + 1 : cellIndex, isRequired);
        var cellData = this.getCellDataAt(rowIndex, cellIndex);
        cellData[3] = isRequired;
    },
    hasSubDetailData: function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex);
        if (rowData == null) return false;
        var bookmark = rowData.bookmark, form = YIUI.FormStack.getForm(this.ofFormID),
            doc = form.getDocument(), subTables = doc.getByParentKey(this.tableKey), subTable;
        for (var i = 0, len = subTables.length; i < len; i++) {
            subTable = subTables[i];
            subTable.beforeFirst();
            while (subTable.next()) {
                if (subTable.getParentBkmk() == bookmark) {
                    return true;
                }
            }
        }
        return false;
    },
    clearAllSubDetailData: function (rowIndex) {
        var rowData = this.getRowDataAt(rowIndex);
        if (rowData == null) return false;
        var clearData = function (tableKey, parentBkmk) {
            var subTables = doc.getByParentKey(tableKey), subTable;
            for (var i = 0, len = subTables.length; i < len; i++) {
                subTable = subTables[i];
                subTable.afterLast();
                while (subTable.previous()) {
                    if (subTable.getParentBkmk() == parentBkmk) {
                        clearData(subTable.key, subTable.getBkmk());
                        subTable.delRow();
                    }
                }
            }
        };
        var bookmark = rowData.bookmark, form = YIUI.FormStack.getForm(this.ofFormID),
            doc = form.getDocument();
        clearData(this.tableKey, bookmark);
        return true;
    },
    modifyCellErrors: function (rowIndex, colIndex, isError, errorMsg) {
        var errCi, m, errCell, len = this.errorInfoes.cells.length;
        for (m = 0; m < len; m++) {
            errCell = this.errorInfoes.cells[m];
            if (errCell.rowIndex == rowIndex && errCell.colIndex == colIndex) {
                errCi = m;
                break;
            }
        }
        if (isError && errCi !== undefined) {
            this.errorInfoes.cells.splice(errCi, 1);
        } else if (!isError && errCi === undefined) {
            this.errorInfoes.cells.push({rowIndex: rowIndex, colIndex: colIndex, errorMsg: errorMsg});
        }
        this.setGridErrorCells(this.errorInfoes.cells);
    },
    checkHeadSelect: function (colIndex) {
        var hTable = $(this.el[0].grid.hDiv).find(".ui-ygrid-htable"), isAllCheck = true, detailRowCount = 0;
        for (var i = 0, len = this.getRowCount(); i < len; i++) {
            var rowData = this.getRowDataAt(i), cellData = this.getCellDataAt(i, colIndex);
            if (rowData.isDetail && rowData.bookmark != null) {
                detailRowCount++;
                if (cellData[0] == 0 || cellData[0] == null) {
                    isAllCheck = false;
                    break;
                }
            }
        }
        if (detailRowCount == 0) {
            isAllCheck = false;
        }
        $("input", hTable)[0].checked = isAllCheck;
    },
    reShowCheckColumn: function () {
        this.el.reShowCheckColumn();
    },
    getHandler: function () {
        return this.gridHandler;
    },
    getMetaCellByKey: function (cellKey) {
        var metaRow, metaCell;
        for (var i = 0, len = this.metaRowInfo.rows.length; i < len; i++) {
            metaRow = this.metaRowInfo.rows[i];
            for (var j = 0, length = metaRow.cells.length; j < length; j++) {
                metaCell = metaRow.cells[j];
                if (metaCell.key == cellKey) {
                    return metaCell;
                }
            }
        }
        return null;
    },
    dependedValueChange: function (targetField, dependencyField, value) {
        this.gridHandler.dependedValueChange(this, targetField, dependencyField, value);
    },
    doPostCellValueChanged: function (rowIndex, dependencyField, targetField, value) {
        this.gridHandler.doPostCellValueChanged(this, rowIndex, dependencyField, targetField, value);
    }
});
YIUI.reg('grid', YIUI.Control.Grid);//语言包
(function ($) {
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {
        defaults: {
            seqColText: "序号",  //序号字段名称
            emptyrecords: "无数据显示",
            recordtext: "{0} - {1}\u3000共 {2} 条", // 共字前是全角空格
            pgtext: " 跳转至：{0}页"
        },
        del: {
            caption: "删除",
            msg: "删除所选记录？",
            bSubmit: "删除",
            bCancel: "取消"
        },
        nav: {
            addtext: "",  //新增按钮名称
            addtitle: "添加新记录",
            deltext: "", //删除按钮名称
            deltitle: "删除所选记录",
            uprowtext: "",  //上移按钮名称
            uprowtitle: "上移数据行",
            downrowtext: "", //删除按钮名称
            downrowtitle: "下移数据行"
        },
        formatter: {
            integer: {thousandsSeparator: ",", defaultValue: '0'},
            number: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
            currency: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "", suffix: "", defaultValue: '0.00'}
        },
        error: {
            isNotTable: "表格初始化错误，初始化所用HtmlElement不是Table类型",
            isErrorMode: "表格所在页面的渲染模式(documentMode)低于5",
            model: "colNames 和 colModel 长度不等！",
            isSortError: "行分组情况下不允许进行排序",
            compDictNotDataBinding: "多选复合字典{0}不允许有数据绑定字段"
        },
        alert: {
            title: "提示",
            confirm: "确认"
        },
        cell_imgOpt: {
            open:"打开",
            show:"查看",
            clear:"清除"
        }
    });
})(jQuery);/**
 * 表格插件
 */
(function ($) {
    "use strict";
    $.ygrid = $.ygrid || {};
    $.extend($.ygrid, {//表格内部使用方法初始化
        version: "1.0.0",
        guid: 1,
        uidPref: 'ygd',
        msie: navigator.appName === 'Microsoft Internet Explorer',  //是否是IE
        getTextWidth: function (text, fontSize) {
            var span = document.getElementById("__getWidth");
            if (span == null) {
                span = document.createElement("span");
                span.id = "__getWidth";
                document.body.appendChild(span);
                span.style.visibility = "hidden";
                span.style.whiteSpace = "nowrap";
            }
            span.innerText = text;
            span.style.fontSize = (fontSize == null ? 12 : fontSize) + "px";
            return span.offsetWidth;
        },
        msiever: function () {     //ie版本号
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return rv;
        },
        getCellIndex: function (cell) {  //获取单元格序号
            var c = $(cell);
            if (c.is('tr')) {
                return -1;
            }
            c = (!c.is('td') && !c.is('th') ? c.closest("td,th") : c)[0];
            if ($.ygrid.msie) {
                return $.inArray(c, c.parentNode.cells);
            }
            return c.cellIndex;
        },
        formatString: function (format) { //格式化类似" {0} 共 {1} 页"的字符串，将{}按序号替换成对应的参数
            var args = $.makeArray(arguments).slice(1);
            if (format == null) {
                format = "";
            }
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        },
        stripPref: function (pref, id) {  //去除id的前缀，返回去除后的id
            var obj = $.type(pref);
            if (obj === "string" || obj === "number") {
                pref = String(pref);
                id = pref !== "" ? String(id).replace(String(pref), "") : id;
            }
            return id;
        },
        stripHtml: function (v) {  //去除html标签，返回标签内容
            v = String(v);
            var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            if (v) {
                v = v.replace(regexp, "");
                return (v && v !== '&nbsp;' && v !== '&#160;') ? v.replace(/\"/g, "'") : "";
            }
            return v;
        },
        randId: function (prefix) { //注册ID：添加前缀，进行ID分配
            return (prefix || $.ygrid.uidPref) + ($.ygrid.guid++);
        },
        intNum: function (val, defval) {
            val = parseInt(val, 10);
            if (isNaN(val)) {
                return defval || 0;
            }
            return val;
        },
        extend: function (methods) {  //继续扩展继承，主要用于添加方法
            $.extend($.fn.yGrid, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    });

    $.fn.yGrid = function (options) {
        if (this.grid) {
            return;
        }
        if (typeof options === 'string') {   //如果是字符串类型，则是执行表格的事件
            var fn = $.fn.yGrid[options];//得到表格事件
            if (!fn) {
                throw ("yGrid - No such method: " + options);
            }
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args);  //执行表格事件
        }
        return this.each(function () {
            var p = {
                enable: true,//是否可用
                width: 100, //宽度
                height: 150, //高度
                rowNum: 50, //一页显示的行数
                showPager: true,   //是否显示底部操作工具条
                showPageSet: true, //是否使用分页操作按钮及页码输入
                navButtons: {}, // 工具条上的操作按钮
                scrollPage: false,  //是否使用滚动来代替分页操作，及滚动翻页，如为true，则屏蔽分页操作按钮及页码输入
                colModel: [],  //列集合,其中列的属性为：name:名称,label:显示名称,sortable:排序,editable:可编辑,align:文本位置
                colNames: [],  //子叶列的名称(name)或者显示文本(label),比如[列1,列2]
                data: [],  //行数据，比如为[{col1:[value1-1,caption1-1],col2:[value2-1,caption2-1]},{col1:[value1-2,caption1-2],col2:[value2-2,caption2-2]}
                editCells: [],//已经进行编辑的单元格，需要进行保存单元格
                _indexMap: {},
                viewRecords: true,//是否显示数据信息，比如“1 - 10 共100条”
                rowSequences: true,//是否显示序号列
                rowSeqWidth: 40, //序号列宽度
                scrollTimeout: 40,//滚动延时时间
                lastpage: 1, //最后一页页码
                onSelectRow: null, //选中行事件
                ondblClickRow: null,//行双击事件
                onSortClick: null,   //表头列单元排序点击事件
                specialCellClick: null,  //点击事件，通常是特殊单元格（button，hyperlink，checkbox）的点击事件
                createCellEditor: null, //创建自定义单元格编辑组件
                alwaysShowCellEditor: null,//创建一直显示的单元格编辑组件
                endCellEditor: null, //结束自定义编辑组件
                afterEndCellEditor: null, //结束自定义编辑组件之后的事件
                extKeyDownEvent: null,//额外的按键事件
                afterCopy: null, //复制后的事件
                afterPaste: null,//粘贴后的事件
                groupHeaders: [] //多行表头信息
            };
            for (var key in options) {
                var value = options[key];
                if ($.isArray(value)) {
                    p[key] = value.slice(0);
                } else {
                    p[key] = value;
                }
            }
            options = null;
            var ts = this, grid = {
                headers: [], //表头的所有子叶列
                cols: [],  //表格第一行的所有单元格
                dragStart: function (i, x, y) {  //修改列大小，拖动开始
                    var gridLeftPos = $(this.bDiv).offset().left;
                    this.resizing = { idx: i, startX: x.clientX, sOL: x.clientX - gridLeftPos };
                    this.hDiv.style.cursor = "col-resize";
                    this.curGbox = $("#rs_m" + p.id, "#gbox_" + p.id);
                    this.curGbox.css({display: "block", left: x.clientX - gridLeftPos, top: y[1], height: y[2]});
                    document.onselectstart = function () {  //不允许选中文本
                        return false;
                    };
                },
                dragMove: function (x) {      //修改列大小，拖动中
                    if (this.resizing) {
                        var diff = x.clientX - this.resizing.startX, h = this.headers[this.resizing.idx],
                            newWidth = h.width + diff;
                        if (newWidth > 33) {
                            this.curGbox.css({left: this.resizing.sOL + diff});
                            this.newWidth = p.tblwidth + diff;
                            h.newWidth = newWidth;
                        }
                    }
                },
                dragEnd: function () {         //修改列大小，拖动结束
                    this.hDiv.style.cursor = "default";
                    if (this.resizing) {
                        var idx = this.resizing.idx, nw = this.headers[idx].newWidth || this.headers[idx].width;
                        nw = parseInt(nw, 10);
                        this.resizing = false;
                        this.curGbox && this.curGbox.css({display: "none"});
                        p.colModel[idx].width = nw;
                        this.headers[idx].width = nw;
                        this.headers[idx].el.style.width = nw + "px";
                        this.cols[idx].style.width = nw + "px";
                        p.tblwidth = this.newWidth || p.tblwidth;
                        $('table:first', this.bDiv).css("width", p.tblwidth + "px");
                        $('table:first', this.hDiv).css("width", p.tblwidth + "px");
                        this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                        $(ts).triggerHandler("yGridResizeStop", [nw, idx]);
                    }
                    this.curGbox = null;
                    document.onselectstart = function () {  //允许选中文本
                        return true;
                    };
                },
                populateVisible: function () {  //计算可见区域
                    if (grid.timer) {
                        clearTimeout(grid.timer);
                    }
                    grid.timer = null;
                    var dh = $(grid.bDiv).height();
                    if (!dh) {
                        return;
                    }
                    var table = $("table:first", grid.bDiv);
                    var rows, rh;
                    if (table[0].rows.length) {
                        try {
                            rows = table[0].rows[1];
                            rh = rows ? $(rows).outerHeight() || grid.prevRowHeight : grid.prevRowHeight;
                        } catch (pv) {
                            rh = grid.prevRowHeight;
                        }
                    }
                    if (!rh) {
                        return;
                    }
                    grid.prevRowHeight = rh;
                    var rn = p.rowNum;
                    var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
                    var ttop = Math.round(table.position().top) - scrollTop;
                    var tbot = ttop + table.height();
                    var div = rh * rn;
                    var page, npage, empty;
                    if (tbot < dh && ttop <= 0 &&
                        (p.lastpage === undefined || parseInt((tbot + scrollTop + div - 1) / div, 10) <= p.lastpage)) {
                        npage = parseInt((dh - tbot + div - 1) / div, 10);
                        if (tbot >= 0 || npage < 2 || p.scroll === true) {
                            page = Math.round((tbot + scrollTop) / div) + 1;
                            ttop = -1;
                        } else {
                            ttop = 1;
                        }
                    }
                    if (ttop > 0) {
                        page = parseInt(scrollTop / div, 10) + 1;
                        npage = parseInt((scrollTop + dh) / div, 10) + 2 - page;
                        empty = true;
                    }
                    if (npage) {
                        if (p.lastpage && (page > p.lastpage || p.lastpage === 1 || (page === p.page && page === p.lastpage))) {
                            return;
                        }
                        p.page = page;
                        if (empty) {
                            grid.emptyRows.call(table[0], false);
                        }
                        grid.populate(npage);
                        $(ts).setErrorCells();
                        $(ts).setErrorRows();
                    }
                },
                scrollGrid: function (e) {
                    if (p.scrollPage) {
                        var scrollTop = grid.bDiv.scrollTop;
                        if (grid.scrollTop === undefined) {
                            grid.scrollTop = 0;
                        }
                        if (scrollTop !== grid.scrollTop) {
                            grid.scrollTop = scrollTop;
                            if (grid.timer) {
                                clearTimeout(grid.timer);
                            }
                            grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
                        }
                    }
                    grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
                    if (e) {
                        e.stopPropagation();
                    }
                }
            };
            var setColWidth = function () {    //初始化列宽，以及表格宽度
                var th = this;
                th.p.scrollOffset = 18;
                var initwidth = 0, scw = $.ygrid.intNum(th.p.scrollOffset), cw;
                $.each(th.p.colModel, function (index, col) {
                    if (this.hidden === undefined) {
                        this.hidden = false;
                    }
                    this.widthOrg = cw = $.ygrid.intNum(col.width);
                    if (this.hidden === false) {
                        initwidth += cw;
                    }
                });
                if (isNaN(th.p.width)) {
                    th.p.width = initwidth + (!isNaN(th.p.height) ? scw : 0);
                }
                grid.width = th.p.width;
                th.p.tblwidth = initwidth;
            };
            var getOffset = function (iCol) {     //获取某个列的位置信息
                var th = this, $th = $(th.grid.headers[iCol].el);
                var ret = [$th.position().left + $th.outerWidth()];
                ret[0] -= th.grid.bDiv.scrollLeft;
                ret.push($(th.grid.hDiv).position().top);
                ret.push($(th.grid.bDiv).offset().top - $(th.grid.hDiv).offset().top + $(th.grid.bDiv).height());
                return ret;
            };
            var getColumnHeaderIndex = function (th) { //获取表头列单元的序号
                var $t = this, i, headers = $t.grid.headers , ci, len = headers.length;
                for (i = 0; i < len; i++) {
                    if (th === headers[i].el) {
                        ci = i;
                        break;
                    }
                }
                return ci;
            };
            ts.getCellEditOpt = function (rdata, colPos) {
                if (rdata == undefined) return {};
                var cellKey = rdata.cellKeys[colPos - (ts.p.rowSequences ? 1 : 0)],
                    editOpt = ts.p.cellLookup[cellKey];
                if (editOpt == undefined) {
                    editOpt = {};
                }
                return editOpt;
            };
            var formatCol = function (pos, rowInd, tv, cellval, rdata) { //格式化单元格，主要是设置单元格属性
                var th = this, cm = th.p.colModel[pos], editOpt = th.getCellEditOpt(rdata, pos),
                    ral = editOpt.align == undefined ? cm.align : editOpt.align, result = ["style='"], nm = cm.name;
                if (ral) {
                    result.push("text-align:");
                    result.push(ral);
                    result.push(";");
                }
                if (editOpt.backColor) {
                    result.push("background-color:");
                    result.push(editOpt.backColor);
                    result.push(";");
                }
                if (editOpt.foreColor) {
                    result.push("color:");
                    result.push(editOpt.foreColor);
                    result.push(";");
                }
                if (nm == "rn") {
                    if (th.p.backColor) {
                        result.push("background-color:");
                        result.push(th.p.backColor);
                        result.push(";");
                    }
                    if (th.p.foreColor) {
                        result.push("color:");
                        result.push(th.p.foreColor);
                        result.push(";");
                    }
                }
                if (cm.hidden === true) {
                    result.push("display:none;");
                }
                if (editOpt.edittype == "numberEditor" && parseFloat(cellval[0]) < 0) {
                    result.push("color:");
                    result.push(editOpt.editOptions.negtiveForeColor);
                }
                result.push("' class='");
                if (cellval !== undefined && ((cellval[2] == null && !th.getControlGrid().isEnable()) || cellval[2] === false)) {
                    result.push("ui-cell-disabled ");
                }
                if (editOpt.editOptions == null || editOpt.editOptions.edittype == "label") {
                    result.push("ui-cell-disabled ");
                }
                var rowExpIndex = th.getControlGrid().rowExpandIndex;
                if ((th.p.rowSequences == true ? rowExpIndex + 1 : rowExpIndex) == pos) {
                    result.push("ui-cell-disabled ");
                }
                if (editOpt.isRequired && (cellval == null || cellval[1] == null || cellval[1] == "")) {
                    result.push("ui-cell-required ");
                    cellval[3] = true;
                }
                result.push("'");
                result.push($.fmatter.isEmpty(tv) ? "" : [" title='" , $.ygrid.stripHtml(tv), "' "].join(""));
                result.push(" aria-describedby='");
                result.push([th.p.id, "_", nm , "'"].join(""));
                result = result.join("");
                return result;
            };
            var addCell = function (rowId, cell, pos, irow, srvr, isTreeCol) {       //添加单元格
                var v = cell[1];
                var prp = formatCol.call(ts, pos, irow, v, cell, srvr);
                var tcIcon = "";
                if (isTreeCol) {
                    var pl = (srvr.treeLevel * 16) + "px", icon = srvr.isExpand ? "cell-expand" : "cell-collapse";
                    if (srvr.isLeaf) {
                        tcIcon = ["<span class='cell-treeIcon ", ts.getControlGrid().treeExpand ? " ui-state-disabled" : "",
                            "' style='margin-left: " , pl, "'></span>"].join("");
                    } else {
                        tcIcon = ["<span class='cell-treeIcon " , icon , ts.getControlGrid().treeExpand ? " ui-state-disabled" : "",
                            "' style='margin-left: " , pl, "'></span>"].join("");
                    }
                }
                return ["<td role=\"gridcell\" ", prp , ">", tcIcon , v , "</td>"].join("");
            };
            var addRowNum = function (pos, irow, pG, rN) {                   //添加序号列单元格
                var v = irow + 1, prp = formatCol.call(ts, pos, irow, v);
                return ["<td role=\"gridcell\" class=\"ui-state-default ygrid-rownum\" " , prp, ">" , v , "</td>"].join("");
            };
            var addGridRow = function (curRd, iRow, riOfData, isTemp) {
                var rowData = [], th = this, nbIndex = th.p.rowSequences === true ? 1 : 0, asrds = [], rh = "",
                    rowId = $.ygrid.uidPref + (isTemp ? -(riOfData + 1) : riOfData), treeColInd = -1;
                if (curRd.rowHeight) {
                    rh = curRd.rowHeight + "px";
                }
                rowData.push(['<tr style="height:', rh , '" role="row" id="' , rowId , '" tabindex="-1" class="ui-widget-content ygrow ui-row-ltr">'].join(""));
                if (nbIndex) {
                    rowData.push(addRowNum(0, riOfData, th.p.page, th.p.rowNum));
                }
                for (var j = 0, len = th.p.colModel.length; j < len - nbIndex; j++) {
                    var cm = th.p.colModel[j + nbIndex], cellKey = curRd.cellKeys[j], editOptions = th.p.cellLookup[cellKey];
                    (editOptions && editOptions.isAlwaysShow) ? asrds.push(j + nbIndex) : null;
                    var v = curRd.data[cm.index], isTreeCol = (cm.name === th.p.treeColName);
                    var cell = addCell(rowId, v, j + nbIndex, iRow, curRd, isTreeCol);
                    if (isTreeCol) treeColInd = j + nbIndex;
                    rowData.push(cell);
                }
                rowData.push("</tr>");
                $("#" + th.p.id + " tbody:first").append(rowData.join(''));
                var row = th.rows[th.rows.length - 1], treeCell, treeIcon, showFunc = th.p.alwaysShowCellEditor,
                    rowHeight = (curRd.rowHeight === undefined ? row.offsetHeight : curRd.rowHeight);
                for (var ci = 0, adlen = asrds.length; ci < adlen; ci++) {
                    var iCol = asrds[ci], colM = th.p.colModel[iCol], nm = colM.name , editOpt = th.getCellEditOpt(curRd, iCol), val = curRd.data[colM.index],
                        opt = $.extend({}, editOpt.editOptions || {}, {ri: riOfData, key: nm, id: iRow + "_" + nm, name: nm});
                    if (editOpt.isAlwaysShow) {
                        if (showFunc && $.isFunction(showFunc)) {
                            showFunc.call(th, $(row.cells[iCol]), iRow, iCol, colM, val, opt, rowHeight);
                        }
                    }
                }
                if (treeColInd !== -1) {
                    treeCell = row.cells[treeColInd];
                    treeIcon = $("span.cell-treeIcon", treeCell);
                    treeIcon.click(function (event) {
                        var grow = event.target.parentNode.parentNode, grind = parseInt($.ygrid.stripPref($.ygrid.uidPref, grow.id), 10);
                        if (th.p.treeIconClick && $.isFunction(th.p.treeIconClick) && !curRd.isLeaf) {
                            th.p.treeIconClick.call(th, th.p.data[grind], (grind + 1));
                        }
                    });
                }
                return $(row);
            };
            var loadGridData = function (data, t, rcnt) {        //添加表格行
                if (data) {
                    if (!ts.p.scrollPage) {
                        grid.emptyRows.call(ts, false);
                        rcnt = 1;
                    } else {
                        rcnt = rcnt > 1 ? rcnt : 1;
                    }
                } else {
                    return;
                }
                ts.p.page = $.ygrid.intNum(data[ts.p.localReader.page], ts.p.page);
                ts.p.lastpage = $.ygrid.intNum(data[ts.p.localReader.total], 1);
                ts.p.records = $.ygrid.intNum(data[ts.p.localReader.records]);
                ts.p.reccount = data.rows.length;
                for (var i = 0, len = data.rows.length; i < len; i++) {
                    var ri = ts.p.data.indexOf(data.rows[i]);
                    addGridRow.call(ts, data.rows[i], ri + rcnt, ri);
                }
                ts.refreshIndex();
                ts.updatePager.call(ts);
            };
            var afterRowOpt = function (ri, isDelete) {
                var i, th = this, seq, rid, len = th.rows.length;
                for (i = ri; i < len; i++) {
                    if (th.p.rowSequences) {
                        seq = parseInt($(th.rows[i].cells[0]).html(), 10);
                        $(th.rows[i].cells[0]).html(seq + (isDelete ? -1 : +1));
                    }
                    rid = parseInt($.ygrid.stripPref($.ygrid.uidPref, th.rows[i].id), 10);
                    rid = rid + (isDelete ? -1 : +1);
                    th.rows[i].id = $.ygrid.uidPref + rid;
                }
                ts.refreshIndex();
            };
            ts.refreshIndex = function () {
                ts.p._indexMap = {};
                for (var ti = 0, tlen = ts.rows.length; ti < tlen; ti++) {
                    ts.p._indexMap[$.ygrid.stripPref($.ygrid.uidPref, ts.rows[ti].id)] = ti;
                }
            };
            ts.deleteGridRow = function (ri) {
                var th = this, gridRow = $(th).getGridRowById($.ygrid.uidPref + ri), rind;
                if (gridRow) {
                    rind = gridRow.rowIndex;
                    th.p.data.splice(ri, 1);
                    $(gridRow).remove();
                    afterRowOpt.call(th, rind, true);
                }
            };
            ts.insertGridRow = function (ri, rowData) {
                var th = this, gridRow, lastRid = $.ygrid.stripPref($.ygrid.uidPref, th.rows[th.rows.length - 1].id);
                var lri = isNaN(parseInt(lastRid, 10)) ? 0 : parseInt(lastRid, 10);
                th.p.data.splice(ri, 0, rowData);
                if (ri <= lri + 1) {
                    gridRow = addGridRow.call(th, rowData, ri + 1, ri, true);
                    gridRow.insertBefore($(th).getGridRowById($.ygrid.uidPref + ri));
                    var seq, rid, nRi = gridRow[0].rowIndex + 1, pRi = gridRow[0].rowIndex - 1;
                    if (th.rows[nRi]) {
                        if (th.p.rowSequences) {
                            seq = $(th.rows[nRi].cells[0]).html();
                            $(gridRow[0].cells[0]).html(seq);
                        }
                        rid = th.rows[nRi].id;
                        gridRow[0].id = rid;
                    } else {
                        if (th.rows[pRi] !== $("tr.ygfirstrow", th.grid.bDiv)[0]) {
                            if (th.p.rowSequences) {
                                seq = parseInt($(th.rows[pRi].cells[0]).html(), 10);
                                $(gridRow[0].cells[0]).html(seq + 1);
                            }
                            rid = parseInt($.ygrid.stripPref($.ygrid.uidPref, th.rows[pRi].id), 10);
                            gridRow[0].id = $.ygrid.uidPref + (rid + 1);
                        } else {
                            if (th.p.rowSequences) {
                                $(gridRow[0].cells[0]).html(1);
                            }
                            gridRow[0].id = $.ygrid.uidPref + 0;
                        }
                    }
                    afterRowOpt.call(th, gridRow[0].rowIndex + 1, false);
                }
            };
            ts.modifyGridCell = function (ri, iCol, rowData) {
                var th = this, cm = th.p.colModel[iCol], editOpt = th.getCellEditOpt(rowData, iCol),
                    row = $(th).getGridRowById($.ygrid.uidPref + ri), cname = cm.name;
                if (row == undefined) return;
                var cellV, cell = row.cells[iCol], value;
                if (cname == "rn") return;
                cellV = rowData.data[cm.index][1];
                value = rowData.data[cm.index][0];
                if (editOpt.isAlwaysShow) {
                    if (!rowData.isDetail)return;
                    $(".cellEditor", cell)[0].title = cellV;
                    switch (editOpt.formatter) {
                        case "button":
                            $(".cellEditor span.txt", cell).html(value);
                            break;
                        case "hyperlink":
                            $(".cellEditor", cell).html(value);
                            break;
                        case "checkbox":
                            $(".cellEditor input", cell)[0].checked = (value == 1 || value == true || value == "true");
                            $(".cellEditor", cell)[0].title = (value == 1 || value == true || value == "true");
                            break;
                        case "image":
                            cell.editor.setValue(value);
                            break;
                    }
                } else {
                    $(cell).html(cellV);
                    if (editOpt.edittype == "numberEditor") {
                        if (value instanceof Decimal && value.isNegative()) {
                            $(cell).css({color: editOpt.editOptions.negtiveForeColor});
                        } else {
                            $(cell).css({color: ""});
                        }
                    }
                }
            };
            var initQueryData = function () {       //初始化表格数据相关信息，主要是分页信息及数据
                if (!$.isArray(ts.p.data)) {
                    return null;
                }
                var queryResults = ts.p.data,
                    recordsperpage = parseInt(ts.p.rowNum, 10),
                    total = queryResults.length,
                    page = parseInt(ts.p.page, 10),
                    totalpages = Math.ceil(total / recordsperpage),
                    retresult = {};
                queryResults = queryResults.slice((page - 1) * recordsperpage, page * recordsperpage);
                retresult[ts.p.localReader.total] = totalpages == 0 ? 1 : totalpages;
                retresult[ts.p.localReader.page] = page;
                retresult[ts.p.localReader.records] = total;
                retresult[ts.p.localReader.root] = queryResults;
                queryResults = null;
                return  retresult;
            };
            grid.emptyRows = function (scroll) {
                var firstrow = ts.rows.length > 0 ? ts.rows[0] : null;
                $(this.firstChild).empty().append(firstrow);
                if (scroll && ts.p.scrollPage) {
                    $(ts.grid.bDiv.firstChild).css({height: "auto"});
                    $(ts.grid.bDiv.firstChild.firstChild).css({height: 0, display: "none"});
                    if (ts.grid.bDiv.scrollTop !== 0) {
                        ts.grid.bDiv.scrollTop = 0;
                    }
                }
            };
            grid.populate = function (npage) {          //表格载入数据计算
                var pvis = ts.p.scrollPage && npage === false, lc;
                if (ts.p.page === undefined || ts.p.page <= 0) {
                    ts.p.page = Math.min(1, ts.p.lastpage);
                }
                npage = npage || 1;
                if (npage > 1) {
                    lc = function () {
                        if (ts.p.page == 1 && ts.grid.scrollTop == 0)
                            return;
                        ts.p.page++;
                        ts.grid.hDiv.loading = false;
                        grid.populate(npage - 1);
                    };
                }
                var rcnt = !ts.p.scrollPage ? 1 : ts.rows.length;
                var req = initQueryData();
                loadGridData(req, ts.grid.bDiv, rcnt);
                if (lc) {
                    lc.call(ts);
                }
                if (pvis) {
                    grid.populateVisible();
                }
            };
            ts.updatePager = function () {  //更新工具条，主要是分页操作按钮的显示和数据信息的显示
                var th = this, from, to, total, base = parseInt(th.p.page, 10) - 1;
                if (base < 0) {
                    base = 0;
                }
                base = base * parseInt(th.p.rowNum, 10);
                to = base + th.p.reccount;
                to = to > th.p.data.length ? th.p.data.length : to;
                if (th.p.scrollPage) {    //如果是滚动分页，则修改顶部div，使可见区域呈现在对应位置
                    var rows = $("tbody:first > tr:gt(0)", th.grid.bDiv);
                    base = to - rows.length;
                    th.p.reccount = rows.length;
                    var rh = rows.outerHeight() || th.grid.prevRowHeight;
                    if (rh) {
                        var top = base * rh;
                        var height = parseInt(th.p.records, 10) * rh;
                        $(">div:first", th.grid.bDiv).css({height: height}).children("div:first").css({height: top, display: top ? "" : "none"});
                        if (th.grid.bDiv.scrollTop == 0 && th.p.page > 1) {
                            th.grid.bDiv.scrollTop = th.p.rowNum * (th.p.page - 1) * rh;
                        }
                    }
                    th.grid.bDiv.scrollLeft = th.grid.hDiv.scrollLeft;
                }
                var pgboxes = th.p.pager || "";
                if (pgboxes) {       //如果存在工具条
                    $(["#add_" , th.id , ",#del_" , th.id, ", #upRow_" , th.id, ", #downRow_" , th.id].join("")).each(function () {
                        (th.p.enable && th.p.treeType === -1 && !th.p.hasRowExpand) ? $(this).removeClass("ui-state-disabled") : $(this).addClass("ui-state-disabled");
                    });
                    if (th.p.viewRecords) {    //如果显示数据信息，则更新相关信息
                        if (th.p.reccount === 0) {
                            $(".ui-paging-info", pgboxes).html($.ygrid.defaults.emptyrecords);
                        } else {
                            from = base + 1;
                            total = th.p.records;
                            $(".ui-paging-info", pgboxes).html($.ygrid.formatString($.ygrid.defaults.recordtext, from, to, total));
                        }
                    }
                    if (th.p.showPageSet) {     //如果有分页操作，则更新操作按钮的显示以及输入框的页码
                        $('.ui-pg-input', pgboxes).val(th.p.page);
                        var cp = $.ygrid.intNum(th.p.page, 1), last = $.ygrid.intNum(th.p.lastpage, 1);
                        var tspg = "_" + th.p.pager.substr(1);
                        if (cp === 1) {
                            $("#first" + tspg + ", #prev" + tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
                        } else {
                            $("#first" + tspg + ", #prev" + tspg).removeClass('ui-state-disabled');
                        }
                        if (cp === last) {
                            $("#next" + tspg + ", #last" + tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
                        } else {
                            $("#next" + tspg + ", #last" + tspg).removeClass('ui-state-disabled');
                        }
                    }
                }
            };
            if (ts.tagName.toUpperCase() !== 'TABLE') {
                alert($.ygrid.error.isNotTable);
                return;
            }
            if (document.documentMode !== undefined) { // IE only
                if (document.documentMode < 5) {
                    alert($.ygrid.error.isErrorMode);
                    return;
                }
            }
            $(this).empty().attr("tabindex", "0");
            this.p = p;
            this.grid = grid;
            this.p.useProp = !!$.fn.prop;
            if (this.p.colNames.length === 0) {   //初始化列名称集合
                for (var ci = 0, len = this.p.colModel.length; ci < len; ci++) {
                    var name = this.p.colModel[ci].label || this.p.colModel[ci].name,
                        formulaCaption = this.p.colModel[ci].formulaCaption;
                    if (formulaCaption != null && formulaCaption.length > 0) {
                        var form = YIUI.FormStack.getForm(this.getControlGrid().ofFormID);
                        name = form.eval(formulaCaption, {form: form});
                    }
                    this.p.colNames[ci] = name;
                }
            }
            if (this.p.colNames.length !== this.p.colModel.length) {
                alert($.ygrid.errors.model);
                return;
            }
            if (this.p.rowSequences) {    // 如果需要序号字段
                this.p.colNames.unshift($.ygrid.defaults.seqColText);
                this.p.colModel.unshift({label: $.ygrid.defaults.seqColText, name: 'rn', width: ts.p.rowSeqWidth,
                    sortable: false, resizable: true, align: 'center'});
            }
            var gv = $("<div class='ui-ygrid-view'></div>");//表格主体
            $(gv).insertBefore(this);
            $(this).removeClass("scroll").appendTo(gv);
            var eg = $("<div class='ui-ygrid ui-widget ui-widget-content'></div>");  //表格整体
            $(eg).attr({id: "gbox_" + this.id, dir: "ltr"}).insertBefore(gv);
            $(gv).attr("id", this.id + "_view").appendTo(eg);
            $(this).attr({cellspacing: "0", cellpadding: "0", border: "0", "role": "grid", "aria-labelledby": "gbox_" + this.id});//表格数据主体
            this.p.id = this.id;
            ts.p.localReader = $.extend(true, {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                cell: "cell",
                id: "id"
            }, ts.p.localReader);
            if (ts.p.scrollPage) {   //滚动分页
                ts.p.showPageSet = false;
            }
            //初始化宽度
            setColWidth.call(ts); //初始化宽度
            $(eg).css("width", grid.width + "px");
            //$(gv).css("width", grid.width + "px").before("<div class='ui-ygrid-resize-mark' id='rs_m" + ts.p.id + "'>&#160;</div>");
            $(gv).before("<div class='ui-ygrid-resize-mark' id='rs_m" + ts.p.id + "'>&#160;</div>");
            //开始构建表头----------------------------------------
            var hTable = $(["<table class='ui-ygrid-htable' style='width:" , ts.p.tblwidth ,
                    "px' role='ygrid' aria-labelledby='gbox_" , this.id , "' cellspacing='0' cellpadding='0' border='0'></table>"].join("")),
                hb = $("<div class='ui-ygrid-hbox-ltr'></div>").append(hTable);
            grid.hDiv = document.createElement("div");
            $(grid.hDiv).addClass('ui-state-default ui-ygrid-hdiv').css({ width: grid.width + "px"}).append(hb);
            grid.hDiv.onselectstart = function () {
                return false;
            };
            $(ts).before(grid.hDiv);
            var thead = ["<thead><tr class='ui-ygrid-headers' role='rowheader'>"];
            var tdc = $.ygrid.msie ? "class='ui-th-div-ie'" : "";
            var imgs = ["<span class='s-ico' style='position: absolute;top:0;right:0;display:none;'>",
                "<span class='ui-ygrid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-sort-ltr'/>" ,
                "<span class='ui-ygrid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-sort-ltr'/>" ,
                "</span>"].join("");  //排序图标
            //添加表头单元格
            for (var i = 0, clen = ts.p.colNames.length; i < clen; i++) {
                var tooltip = [" title=\"" , ts.p.colNames[i] , "\""].join(""), cm = ts.p.colModel[i], cname = cm.name;
                thead.push("<th id='");
                thead.push([ts.p.id , "_" , cname].join(""));
                thead.push("' role='columnheader' class='ui-state-default ui-th-column ui-th-ltr'");
                thead.push(tooltip);
                thead.push(">");
                thead.push("<div id='");
                thead.push([$.ygrid.uidPref , "_" , ts.p.id , "_" , cname].join(""));
                thead.push("' ");
                thead.push(tdc);
                thead.push("><span style='overflow: hidden;position: absolute;left: 0;width: 100%;' class='colCaption'>");
                var colIndex = (i + (ts.p.rowSequences ? -1 : 0));
                if (ts.p.selectFieldIndex != -1 && ts.p.selectFieldIndex == colIndex) {
                    var margin = (ts.p.colNames[i] == "" ? "" : "margin-bottom: 3px;margin-right: 3px;");
                    thead.push("<Input type='checkbox' style='");
                    thead.push(margin);
                    thead.push(["vertical-align: middle' ofColIndex=" , i , ts.p.enable ? "" : " disabled='disabled'", ">"].join(""));
                    thead.push(ts.p.colNames[i]);
                    thead.push(" </span>");
                } else {
                    thead.push(ts.p.colNames[i]);
                    thead.push("</span>");
                }
                if (!cm.width) {
                    cm.width = 150;
                } else {
                    cm.width = parseInt(cm.width, 10);
                }
                thead.push(imgs);
                thead.push("</div></th>");
            }
            thead.push("</tr></thead>");
            imgs = null;
            hTable.append(thead.join(""));
            $("input", hTable).click(function (e) {
                var ci = parseInt($(this).attr("ofColIndex"), 10) - (ts.p.rowSequences ? 1 : 0), newValue = this.checked;
                ts.getControlGrid().gridHandler.doAllChecked(ts.getControlGrid(), ci, newValue);
                e.stopPropagation();
            });
            $(ts).reShowCheckColumn();
            //开始处理表头单元中的一些特定功能：拖拉大小，排序图标
            thead = $("thead:first", grid.hDiv).get(0);
            var thr = $("tr:first", thead), w, res, sort, cModel;
            var firstRow = ["<tr class='ygfirstrow' role='row' style='height:auto'>"];
            $("th", thr).each(function (j) {
                cModel = ts.p.colModel[j];
                w = cModel.width;
                if (cModel.resizable === undefined) {
                    cModel.resizable = true;
                }
                if (cModel.resizable) {   //如果该列的大小是可以修改的，则添加resize组件
                    res = document.createElement("span");
                    $(res).html("&#160;").addClass('ui-ygrid-resize ui-ygrid-resize-ltr').css("cursor", "col-resize");
                } else {
                    res = "";
                }
                $(this).css("width", w + "px").prepend(res);
                res = null;
                var hdcol = "";
                if (cModel.hidden) {
                    $(this).css("display", "none");
                    hdcol = "display:none;";
                }
                firstRow.push("<td role='gridcell' style='height:0px;width:");
                firstRow.push(w + "px;");
                firstRow.push(hdcol);
                firstRow.push("'></td>");
                grid.headers[j] = { width: w, el: this };
                if (typeof cModel.sortable !== 'boolean') {
                    cModel.sortable = true;
                }
                $(">div", this).addClass('ui-ygrid-sortable');
            }).mousedown(function (e) { //注册拖动大小的鼠标事件
                    if ($(e.target).closest("th>span.ui-ygrid-resize").length == 1) {
                        var ci = getColumnHeaderIndex.call(ts, this);
                        grid.dragStart(ci, e, getOffset.call(ts, ci));
                    }
                }).click(function (e) {  //注册排序所用的点击事件
                    var ci = getColumnHeaderIndex.call(ts, this);
                    var sort = ts.p.colModel[ci].sortable;
                    if (!ts.p.lastsort) {
                        ts.p.sortorder = "asc";
                    } else if (ts.p.lastsort === ci) {
                        ts.p.sortorder = (ts.p.sortorder == "asc" ? "desc" : "asc");
                    } else {
                        var previousSelectedTh = ts.grid.headers[ts.p.lastsort].el;
                        $("div span.s-ico", previousSelectedTh).hide();
                        $("div span.colCaption", previousSelectedTh).css({width: "100%"});
                        $("span.ui-ygrid-ico-sort", previousSelectedTh).addClass('ui-state-disabled');
                        ts.p.sortorder = "asc";
                    }
                    if (sort) {
                        $("div span.s-ico", this).show();
                        var width = this.clientWidth - $("div span.s-ico", this)[0].clientWidth;
                        $("div span.colCaption", this).css({width: width + "px"});
                        $("span.ui-ygrid-ico-sort", this).addClass('ui-state-disabled');
                        $("div span.ui-icon-" + ts.p.sortorder, this).removeClass("ui-state-disabled");
                        if ($.isFunction(ts.p.onSortClick)) {
                            ts.p.onSortClick.call(ts, getColumnHeaderIndex.call(ts, this), ts.p.sortorder == "asc" ? "desc" : "asc");
                        } else {
                            //TODO 自身的排序
                        }
                        ts.p.lastsort = ci;
                    } else {
                        ts.p.lastsort = null;
                    }
                }).dblclick(function (e) {
                    var ci = getColumnHeaderIndex.call(ts, this),
                        headTh = ts.grid.headers[ci].el;
                    var oldWidth = headTh.offsetWidth, width = $.ygrid.getTextWidth(headTh.title);
                    if ($("input", headTh).length > 0) {
                        width += 14;
                    }
                    $(".ygrow", ts.grid.bDiv).each(function () {
                        var td = $("td", this)[ci], tdWidth = $.ygrid.getTextWidth(td.title);
                        if (tdWidth > width) {
                            width = tdWidth;
                        }
                    });
                    width += 5;
                    grid.newWidth = p.tblwidth + (width - oldWidth);
                    grid.resizing = {idx: ci};
                    grid.headers[ci].newWidth = width;
                    grid.dragEnd();
                });
            firstRow.push("</tr>");
            var tbody = document.createElement("tbody");
            this.appendChild(tbody);
            $(this).addClass('ui-ygrid-btable').append(firstRow.join(""));
            firstRow = null;
            //表头构建结束--------------------------------------
            //表格数据主体开始构建------------------------------
            if ($.ygrid.msie) {
                if (String(ts.p.height).toLowerCase() === "auto") {
                    ts.p.height = "100%";
                }
            }
            grid.bDiv = document.createElement("div");
            var height = ts.p.height + (isNaN(ts.p.height) ? "" : "px");
            $(grid.bDiv).addClass('ui-ygrid-bdiv').css({ height: height, width: grid.width + "px"})
                .append($('<div style="position:relative;' + ($.ygrid.msie && $.ygrid.msiever() < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this))
                .scroll(grid.scrollGrid); //滚动到原先的可见范围
            $("table:first", grid.bDiv).css({width: ts.p.tblwidth + "px"});
            if (!$.support.tbody) { //IE
                if ($("tbody", this).length === 2) {
                    $("tbody:gt(0)", this).remove();
                }
            }
            $(grid.hDiv).after(grid.bDiv);
            $(gv).mousemove(function (e) { //注册拖动大小拖动中事件
                if (grid.resizing) {
                    grid.dragMove(e);
                }
            });
            $(".ui-ygrid-labels", grid.hDiv).bind("selectstart", function () {
                return false;
            });
            $(document).bind("mouseup.yGrid" + ts.p.id, function () { //注册拖动大小拖动结束事件
                if (grid.resizing) {
                    grid.dragEnd();
                    return false;
                }
                return true;
            });
            if (ts.p.populate) {
                grid.populate(); //数据载入计算
            }
            this.grid.cols = this.rows[0].cells;
            grid.clearSelectCells = function () {
                if (ts.p.selectCells) {
                    for (var i = 0, len = ts.p.selectCells.length; i < len; i++) {
                        $(ts.p.selectCells[i]).removeClass("ui-state-highlight").removeClass("ui-cell-multiselect");
                    }
                }
                ts.p.selectCells = [];
            };
            $(grid.bDiv).mousemove(function (e) {
                if (ts.selecting && e.target.tagName === "TD") {
                    var fc = ts.p.selectCells[0], lc = e.target;
                    if (fc == null) return;
                    var bri = Math.min(fc.parentElement.rowIndex, lc.parentElement.rowIndex),
                        eri = Math.max(fc.parentElement.rowIndex, lc.parentElement.rowIndex),
                        bci = Math.min(fc.cellIndex, lc.cellIndex), eci = Math.max(fc.cellIndex, lc.cellIndex);
                    grid.clearSelectCells();
                    ts.p.selectCells.push(fc);
                    $(fc).addClass("ui-state-highlight");
                    if (e.target == fc) return;
                    ts.p.selectRow = fc.parentElement.id;
                    ts.p.selectCell = fc.cellIndex;
                    for (var ri = bri; ri <= eri; ri++) {
                        var row = ts.rows[ri];
                        if (!row) continue;
                        for (var ci = bci; ci <= eci; ci++) {
                            var cell = row.cells[ci];
                            if ($.inArray(ts.p.selectCells, cell) === -1 && cell !== fc) {
                                $(cell).addClass("ui-cell-multiselect");
                                ts.p.selectCells.push(cell);
                            }
                        }
                    }
                }
            });
            $(ts).mousedown(function (e) {      //表格点击事件，主要是选中模式，以及进入编辑状态
                if (e.target.tagName === "TD" && ts.p.selectionMode != YIUI.SelectionMode.ROW ) {
                    document.onselectstart = function () {
                        return false;
                    };
                    var td = e.target;
                    var ptr = $(td, ts.rows).closest("tr.ygrow");
                    $("td.ui-state-highlight", ts.grid.bDiv).removeClass("ui-state-highlight");
                    grid.clearSelectCells();
                    ts.p.selectCells.push(e.target);
                    $(e.target).addClass("ui-state-highlight");
                    ts.selecting = true;
                }
            }).mouseup(function (e) {
                    if (e.target.tagName === "TD") {
                        document.onselectstart = function () {
                            return true;
                        };
                    }
                    ts.selecting = false;
                    if (e.target.tagName === "INPUT") return;
                    window.setTimeout(function () {
                        if (ts.grid) {
                            var scrollLeft = ts.grid.bDiv.scrollLeft, scrollTop = ts.grid.bDiv.scrollTop;
                            $("#" + ts.p.knv).attr("tabindex", "-1").focus();
                            ts.grid.bDiv.scrollTop = scrollTop;
                            ts.grid.bDiv.scrollLeft = scrollLeft;
                        }
                    }, 0);
                }).click(function (e) {
                    var td = e.target;
                    var ptr = $(td, ts.rows).closest("tr.ygrow");
                    if ($(ptr).length === 0 || ptr[0].className.indexOf('ui-state-disabled') > -1) {
                        return;
                    }
                    var ri = ptr[0].id, ci = $.ygrid.getCellIndex(td);
                    if (td.tagName !== "TD") return;
                    if (ts.p.selectRow != ri || ts.p.selectCell != ci) {
                        if (ts.p.selectRow) {
                            var preSelRow = $(ts).yGrid('getGridRowById', ts.p.selectRow);
                            if (preSelRow != null) {
                                if (ts.p.selectionMode == YIUI.SelectionMode.ROW) {
                                    $(preSelRow.cells).each(function () {
                                        $(this).removeClass("ui-state-highlight");
                                    });
                                } else {
                                    $(preSelRow.cells[ts.p.selectCell]).removeClass("ui-state-highlight");
                                }
                            }
                        }
                        if (ts.p.editCells.length > 0) {
                            $(ts).yGrid("saveCell", ts.p.editCells[0].ir, ts.p.editCells[0].ic);
                        }
                        if ($.isFunction(ts.p.onSelectRow)) {
                            !td.notOnSelectRow && ts.p.onSelectRow.call(ts, ptr[0].rowIndex, ri);
                            ts.p.selectRow = ri;
                            ts.p.selectCell = ci;
                            window.setTimeout(function () {
                                if (ts.p == null || ts.grid == null) return;
                                var scrollLeft = ts.grid.bDiv.scrollLeft, scrollTop = ts.grid.bDiv.scrollTop, knv = $("#" + ts.p.knv);
                                knv.css({left: e.clientX + "px", top: e.clientY + "px"});
                                knv.attr("tabindex", "-1").focus();
                                ts.grid.bDiv.scrollTop = scrollTop;
                                ts.grid.bDiv.scrollLeft = scrollLeft;
                            }, 0);
                        }
                        var cr = $(ts).yGrid('getGridRowById', ri);
                        if (cr != null) {
                            if (ts.p.selectionMode == YIUI.SelectionMode.ROW) {
                                grid.clearSelectCells();
                                $(cr.cells).each(function () {
                                    $(this).addClass("ui-state-highlight");
                                    if(!$(this).hasClass("ygrid-rownum")){
                                        ts.p.selectCells.push(this);
                                    }
                                });
                            } else {
                                $(cr.cells[ci]).addClass("ui-state-highlight");
                            }
                        }
                    } else {
                        $(ts).yGrid('editCell', ptr[0].rowIndex, ci, true, e);
                    }
                }).dblclick(function (e) {    //表格双击事件，主要是行双击事件
                    var td = e.target;
                    if ($.ygrid.msie) {   //兼容IE
                        $(td).click();
                    }
                    var ptr = $(td, ts.rows).closest("tr.ygrow");
                    if ($(ptr).length === 0) {
                        return;
                    }
                    var ri = ptr[0].rowIndex;
                    if ($.isFunction(ts.p.ondblClickRow)) {
                        ts.p.ondblClickRow.call(ts, ri);
                    }
                }).bind('reloadGrid', function (e, opts) {  //重载数据事件
                    var $rowHeader = $("tr.ui-ygrid-headers", ts.grid.hDiv);
                    var firstRow = $("tr.ygfirstrow", grid.bDiv);
                    if (ts.p.colModel.isChange) {
                        ts.p.colModel.isChange = false;
                        $(ts.grid.headers).each(function (iCol) {
                            var th = this.el;
                            if (ts.p.colModel[iCol].hidden) {
                                $(th).css("display", "none");
                                firstRow.find("td").eq(iCol).css("display", "none");
                            } else {
                                $(th).css("display", "");
                                firstRow.find("td").eq(iCol).css("display", "");
                            }
                        });
                        if (ts.p.groupHeaders.length > 0) {
                            for (var i = 0, len = ts.grid.headers.length; i < len; i++) {
                                var header = ts.grid.headers[i].el, cells = $rowHeader[0].cells;
                                $("div", header).attr("style", "");
                                if ($.inArray(cells, header) == -1) {
                                    $rowHeader.append(header);
                                } else {
                                    header.after(ts.grid.headers[i - 1].el);
                                }
                            }
                            $(ts.grid.hDiv).find("tr.ui-ygrid-columnheader").remove();
                            $(ts).initGroupHeaders(ts.p.groupHeaders);
                        }
                    }
                    if (opts && opts.page) {
                        var page = opts.page;
                        if (page > ts.p.lastpage) {
                            page = ts.p.lastpage;
                        }
                        if (page < 1) {
                            page = 1;
                        }
                        ts.p.page = page;
                        if (ts.grid.prevRowHeight) {
                            ts.grid.bDiv.scrollTop = (page - 1) * ts.grid.prevRowHeight * ts.p.rowNum;
                        } else {
                            ts.grid.bDiv.scrollTop = 0;
                        }
                    }
                    if (ts.grid.prevRowHeight && ts.p.scrollPage) {
                        delete ts.p.lastpage;
                        ts.grid.populateVisible();
                    } else {
                        ts.grid.populate();
                    }
                });
            //表格数据主体构建结束------------------------------
            //构建工具条
            if (this.p.showPager) {
                var op = $.extend(this.p.navButtons, $.ygrid.nav);
                var pager = $("<div id='" + this.p.id + "_pager'></div>");
                var toolbar = $("<div class='ui-ygrid-toolbar'></div>");
                var onHoverIn = function () {
                        if (!$(this).hasClass('ui-state-disabled')) {
                            $(this).addClass("ui-state-hover");
                        }
                    },
                    onHoverOut = function () {
                        $(this).removeClass("ui-state-hover");
                    };
                this.grid.toolbar = toolbar;
                ts.p.pager = "#" + pager[0].id;
                pager.css({width: grid.width + "px"}).addClass('ui-state-default ui-ygrid-pager').attr("dir", "ltr").appendTo(eg);
                toolbar.prependTo(eg);
                toolbar.append([
                    "<table cellpadding='0' border='0' class='ui-toolbar-table' style='width:100%;' role='row'>" ,
                    "<tbody><tr><td id='" , pager[0].id , "_left' align='left' style='width:300px'></td>" ,
                    "</tr></tbody></table>"].join(""));
                //pager.css({width: grid.width + "px"}).addClass('ui-state-default ui-ygrid-pager').attr("dir", "ltr").prependTo(eg);
                /*pager.append([
                    "<div id='pg_" , pager[0].id , "' class='ui-pager-control' role='group' style='height:100%'>" ,
                    "<table cellpadding='0' border='0' class='ui-pg-table' style='width:100%;height:100%;' role='row'>" ,
                    "<tbody><tr><td id='" , pager[0].id , "_left' align='left' style='width:300px'></td>" ,
                    "<td id='" , pager[0].id , "_center' align='center' class='pager-center' style='white-space:pre;'></td>",
                    "<td id='" , pager[0].id , "_right' align='right' style='width:300px'></td>",
                    "</tr></tbody></table></div>"].join(""));*/
                pager.append([
                    "<div id='pg_" , pager[0].id , "' class='ui-pager-control' role='group' style='height:100%'>" ,
                    "<table cellpadding='0' border='0' class='ui-pg-table' style='width:100%;height:100%;' role='row'>" ,
                    "<tbody><tr>" ,
                    "<td id='" , pager[0].id , "_center' align='center' class='pager-center' style='white-space:pre;'></td>",
                    "<td id='" , pager[0].id , "_right' align='right' style='width:300px'></td>",
                    "</tr></tbody></table></div>"].join(""));
                //初始化操作按钮
                var tbd,
                    navBTtbl = $("<table cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                    sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>";
                if (op.add) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.addIcon , "'></span>" , op.addtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.addtitle || "", id: "add_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.addFunc)) {
                                    op.addFunc.call(ts, "add");
                                } else {
//                                  //TODO  新增行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.del) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.delIcon , "'></span>" , op.deltext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.deltitle || "", id: "del_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.delFunc)) {
                                    op.delFunc.call(ts, "del");
                                } else {
//                                  //TODO  刪除行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.upRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.upRowIcon , "'></span>" , op.uprowtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.uprowtitle || "", id: "upRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.upRowFunc)) {
                                    op.upRowFunc.call(ts, "upRow");
                                } else {
//                                  //TODO  上移行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.downRow) {
                    tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
                    $(tbd).append(["<div class='ui-pg-div'><span class='ui-icon " , op.downRowIcon , "'></span>" , op.downrowtext , "</div>"].join(""));
                    $("tr", navBTtbl).append(tbd);
                    $(tbd, navBTtbl)
                        .attr({"title": op.downrowtitle || "", id: "downRow_" + ts.p.id})
                        .click(function () {
                            if (!$(this).hasClass('ui-state-disabled')) {
                                if ($.isFunction(op.downRowFunc)) {
                                    op.downRowFunc.call(ts, "downRow");
                                } else {
//                                  //TODO  下移行
                                }
                            }
                            return false;
                        }).hover(onHoverIn, onHoverOut);
                    tbd = null;
                }
                if (op.add || op.del || op.upRow || op.downRow) {
                    $("tr", navBTtbl).append(sep);
                }
                //$(ts.p.pager + "_left", ts.p.pager).append(navBTtbl);
                $(ts.p.pager + "_left").append(navBTtbl);
                
                tbd = null;
                navBTtbl = null;
                //初始化分页操作按钮及分页输入框
                if (ts.p.showPageSet) {
                    var pgcnt = "pg_" + pager[0].id;
                    var pgl = ["<table cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>"];
                    var po = ["first_" + pager[0].id, "prev_" + pager[0].id, "next_" + pager[0].id, "last_" + pager[0].id];
                    var pagination = "<td><div id='pagination_" + pager[0].id + "' class='ui-pagination'><ul></ul></div></td>";
//                    var pginp = "<td>" + $.ygrid.formatString($.ygrid.defaults.pgtext || "",
//                        "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>") + "</td>";
                    pgl.push("<td id='");
                    pgl.push(po[0]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-first'></span></td>");
                    pgl.push("<td id='");
                    pgl.push(po[1]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-prev'></span></td>");
                    pgl.push(pagination);
                    pgl.push("<td id='");
                    pgl.push(po[2]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-next'></span></td>");
                    pgl.push("<td id='");
                    pgl.push(po[3]);
                    pgl.push("' class='ui-pg-button'><span class='ui-icon ui-icon-seek-end'></span></td>");
//                    pgl += (pginp !== "" ? sep + pginp + sep : "");
                    pgl.push("</tr></tbody></table>");
                    $(ts.p.pager + "_center", ts.p.pager).append(pgl.join(""));
                    var tp = "_" + ts.p.pager.substr(1);
                    $("#first" + tp + ", #prev" + tp + ", #next" + tp + ", #last" + tp).click(function () {
                        if ($(this).hasClass("ui-state-disabled")) {
                            return false;
                        }
                        var cp = $.ygrid.intNum(ts.p.page, 1), last = $.ygrid.intNum(ts.p.lastpage, 1), selclick = false,
                            fp = true, pp = true, np = true, lp = true, el = this;
                        if (last === 1) {
                            fp = false;
                            pp = false;
                            np = false;
                            lp = false;
                        } else if (last > 1 && cp >= 1) {
                            if (cp === 1) {
                                fp = false;
                                pp = false;
                            } else if (cp === last) {
                                np = false;
                                lp = false;
                            }
                        }
                        if (el.id === 'first' + tp && fp) {
                            ts.p.page = 1;
                            selclick = true;
                        }
                        if (el.id === 'prev' + tp && pp) {
                            ts.p.page = (cp - 1);
                            selclick = true;
                        }
                        if (el.id === 'next' + tp && np) {
                            ts.p.page = (cp + 1);
                            selclick = true;
                        }
                        if (el.id === 'last' + tp && lp) {
                            ts.p.page = last;
                            selclick = true;
                        }
                        if (selclick) {
                            grid.populate();
                        }
                        return false;
                    });
                    $('input.ui-pg-input', "#" + pgcnt).keypress(function (e) {
                        var key = e.charCode || e.keyCode || 0;
                        if (key === 13) {
                            $(this).val($.ygrid.intNum($(this).val(), 1));
                            ts.p.page = ($(this).val() > 0) ? $(this).val() : ts.p.page;
                            if (ts.p.page > ts.p.lastpage) {
                                ts.p.page = ts.p.lastpage;
                            }
                            grid.populate();
                            return false;
                        } else if (key >= 48 && key <= 57) {
                            return this;
                        }
                        return false;
                    });
                }
                //初始化数据信息显示
                if (ts.p.viewRecords === true) {
                    $(ts.p.pager + "_right", ts.p.pager).append("<div style='text-align:right' class='ui-paging-info'></div>");
                }
                ts.updatePager.call(ts);
                $(ts).bindKeys();
            }
        });
    }
})(jQuery);

//提供给外部使用的事件
(function ($) {
    "use strict";
    $.ygrid.extend({
        getGridParam: function (pName) {  //获取表格属性值
            var $t = this[0];
            if (!$t || !$t.grid) {
                return null;
            }
            if (!pName) {
                return $t.p;
            }
            return $t.p[pName] !== undefined ? $t.p[pName] : null;
        },
        reShowCheckColumn: function () {
            return this.each(function () {
                var $t = this, hTable = $($t.grid.hDiv).find(".ui-ygrid-htable"), detailRow;
                for (var i = 0, len = this.p.data.length; i < len; i++) {
                    detailRow = this.p.data[i];
                    if (detailRow.isDetail && detailRow.bookmark != undefined) {
                        break;
                    }
                }
                $("input", hTable).each(function () {
                    if (detailRow == undefined) return;
                    var cell = detailRow.data[parseInt($(this).attr("ofColIndex"), 10) - ($t.p.rowSequences ? 1 : 0)];
                    if (cell[2]) {
                        $(this).removeAttr("disabled");
                    } else {
                        if (cell[2] == undefined && $t.p.enable) {
                            $(this).removeAttr("disabled");
                        } else {
                            $(this).attr("disabled", "disabled");
                        }
                    }
                });
            });
        },
        setGridParam: function (newParams) {     //设置表格属性
            return this.each(function () {
                if (this.grid && typeof newParams === 'object') {
//                    $.extend(true, this.p, newParams);
                    for (var key in newParams) {
                        var value = newParams[key];
                        if ($.isArray(value)) {
                            this.p[key] = value.slice(0);
                        } else {
                            this.p[key] = value;
                        }
                    }
                }
            });
        },
        refreshData: function () {
            return this.each(function () {
                var $t = this, top = $t.grid.bDiv.scrollTop, left = $t.grid.bDiv.scrollLeft;
                if (!$t.grid) {
                    return;
                }
                var trf = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(trf);
                $t.updatePager.call($t);
                $t.grid.populate();
                $($t).setErrorCells();
                $($t).setErrorRows();
                $t.grid.bDiv.scrollTop = top;
                $t.grid.bDiv.scrollLeft = left;
            });
        },
        clearGridData: function () {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var trf = $("#" + $t.p.id + " tbody:first tr:first")[0];
                $("#" + $t.p.id + " tbody:first").empty().append(trf);
                $t.p.selectRow = null;
                $t.p.selectCell = null;
                $t.p.editCells = [];
                $t.p.records = 0;
                $t.p.page = 1;
                $t.p.lastpage = 1;
                $t.p.reccount = 0;
                $t.p.data = [];
                $t.updatePager.call($t);
            });
        },
        bindKeys: function () {
            return this.each(function () {
                var findVisibleCell = function (colModel, iCol, dir) {
                    var i, len = colModel.length;
                    if (dir === "next") {
                        for (i = iCol + 1; i < len; i++) {
                            if (colModel[i].hidden !== true) {
                                return i;
                            }
                        }
                    } else if (dir === "pre") {
                        for (i = iCol - 1; i >= 0; i--) {
                            if (colModel[i].hidden !== true) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };
                this.p.knv = this.p.id + "_kn";
                var knv = $("#" + this.p.knv);
                if (knv.length == 0) {
                    knv = $(["<div tabindex='-1' style='left:-1px;width:1px;height:0px;' id='" ,
                        this.p.knv , "'></div>"].join("")).insertBefore($(this.grid.bDiv).parents(".ui-ygrid-view")[0]);
                }
                knv.focus().keydown(function (event, outEvent) {
                    if (outEvent != null && outEvent.isPropagationStopped()) return;
                    var th = $(".ui-ygrid-btable", event.target.nextSibling)[0], colModel = th.p.colModel;
                    th.keyEvent = true;
                    var keyCode = event.charCode || event.keyCode || 0;
                    if (keyCode == 0 && outEvent !== undefined) {
                        keyCode = outEvent.charCode || outEvent.keyCode || 0;
                    }
                    var ri = th.p.selectRow, ci = th.p.selectCell, gridRow , isOpt;
                    if ($(th).getGridRowById(ri) == undefined) {
                        isOpt = false;
                    } else if (keyCode === 13 || keyCode === 108 || keyCode === 9) {  // Enter,Tab键
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "next");
                        if (ci == -1) {
                            ci = th.p.rowSequences ? 1 : 0;
                            ri = ri + 1;
                        }
                        if (ri == th.rows.length) {
                            var preSelRow = $(th).yGrid('getGridRowById', th.p.selectRow);
                            preSelRow && $(preSelRow.cells[th.p.selectCell]).removeClass("ui-state-highlight");
                            if (th.p.editCells.length > 0) {
                                $(th).yGrid("saveCell", th.p.editCells[0].ir, th.p.editCells[0].ic);
                            }
                            th.getControlGrid().requestNextFocus();
                        }
                        isOpt = true;
                    } else if (keyCode === 38) {  // 上
                        ri = $(th).getGridRowById(ri).rowIndex - 1;
                        if (ri < 0) return;
                        isOpt = true;
                    } else if (keyCode === 40) {  //下
                        ri = $(th).getGridRowById(ri).rowIndex + 1;
                        if (ri >= th.rows.length) return;
                        isOpt = true;
                    } else if (keyCode === 37) {  //左
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "pre");
                        if (ci < (th.p.rowSequences ? 1 : 0))  return;
                        isOpt = true;
                    } else if (keyCode === 39) {   //右
                        ri = $(th).getGridRowById(ri).rowIndex;
                        ci = findVisibleCell(colModel, ci, "next");
                        if (ci === -1 || ci >= colModel.length)  return;
                        isOpt = true;
                    }
                    if (isOpt && th.p.selectRow && th.p.selectCell) {
                        th.grid.clearSelectCells();
                        $($(th).getGridRowById(th.p.selectRow).cells[th.p.selectCell]).find(".celleditor").blur();
                        gridRow = th.rows[ri];
                        if (gridRow) {
                            gridRow.cells[ci].click();
                            $(th).scrollVisibleCell(ri, ci);
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (th.p.extKeyDownEvent && $.isFunction(th.p.extKeyDownEvent) && !event.ctrlKey) { //扩展的按键事件，自定义使用
                        th.p.extKeyDownEvent.call(th, event);
                    }
                    th.keyEvent = false;

                    if (event.ctrlKey) {
                        var textArea = $("#copyText" + th.p.id), top = th.grid.bDiv.scrollTop, left = th.grid.bDiv.scrollLeft;
                        if (!textArea[0]) {
                            textArea = $("<textarea id='copyText" + th.p.id + "'></textarea>").appendTo($(document.body));
                            textArea.css({position: "fixed", top: "-10000px", left: left + "px", width: "1000px", height: "200px"});
                        }
                        var copyText = [], oldRi = -1, length = (th.p.selectCells == undefined ? 0 : th.p.selectCells.length);
                        for (var i = 0; i < length; i++) {
                            var cell = th.p.selectCells[i], cellvalue = $.ygrid.stripHtml($(cell).html());
                            ri = cell.parentElement.rowIndex - 1;
                            var charStr = "";
                            if (parseInt(oldRi, 10) >= 0) {
                                if (ri > oldRi) {
                                    charStr = "\n";
                                    oldRi = ri;
                                }
                            } else {
                                oldRi = ri;
                            }
                            if (charStr.length > 0) {
                                copyText.pop();
                            }
                            copyText.push(charStr);
                            copyText.push(cellvalue);
                            copyText.push("\t");
                        }
                        copyText.pop();
                        textArea.val(copyText.join(""));
                        textArea.focus();
                        textArea.select();
                        textArea.keyup(function (event) {
                            var keyCode = event.charCode || event.keyCode || 0;
                            th.grid.bDiv.scrollTop = top;
                            th.grid.bDiv.scrollLeft = left;
                            if (event.ctrlKey && keyCode == 86) {
                                textArea.blur();
                                if (th.p.afterPaste && $.isFunction(th.p.afterPaste)) {
                                    th.p.afterPaste.call(th, $("#copyText" + th.p.id).val());
                                }
                            } else if (event.ctrlKey && keyCode == 67) {
                                if (th.p.afterCopy && $.isFunction(th.p.afterCopy)) {
                                    th.p.afterCopy.call(th, $("#copyText" + th.p.id).val());
                                }
                            }
                            textArea.remove();
                            window.setTimeout(function () {
                                var scrollTop = th.grid.bDiv.scrollTop;
                                $("#" + th.p.knv).attr("tabindex", "-1").focus();
                                th.grid.bDiv.scrollTop = scrollTop;
                            }, 0);
                        });
                        th.grid.bDiv.scrollTop = top;
                        th.grid.bDiv.scrollLeft = left;
                    }
                })
            });
        },
        setGridWidth: function (newWidth) {
            return this.each(function () {
                if (!this.grid) {
                    return;
                }
                var $t = this;
                if (isNaN(newWidth)) {
                    return;
                }
                newWidth = parseInt(newWidth, 10);
                $t.grid.width = $t.p.width = newWidth;
                $("#gbox_" + $t.p.id).css("width", newWidth + "px");
                $($t.p.id + "_view").css("width", newWidth + "px");
                $($t.grid.bDiv).css("width", (newWidth - 5) + "px");
                $($t.grid.hDiv).css("width", (newWidth - 5) + "px");
                if ($t.p.showPager) {
                    $($t.p.pager).css("width", newWidth + "px");
                }
            });
        },
        setGridHeight: function (newHeight) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var titleH = $($t.grid.hDiv).height();
                if (titleH === 0) {
                    var lastTr = $("tr.ui-ygrid-headers", $t.grid.hDiv);
                    var hrCount = $("tr.ui-ygrid-columnheader", $t.grid.hDiv).length + lastTr.length;
                    var th_H = $("th", lastTr).height();
                    titleH = (th_H + 2) * hrCount;
                }
                console.log()
                newHeight = newHeight - titleH - $($t.p.pager).height() - $t.grid.toolbar.outerHeight(true) - 2;
                var bDiv = $($t.grid.bDiv);
                bDiv.css({height: (newHeight) + (isNaN(newHeight) ? "" : "px")});
                $t.p.height = newHeight;
                if ($t.p.scroll) {
                    $t.grid.populateVisible();
                }
            });
        },
        initGroupHeaders: function (array) {
            return this.each(function () {
                var th = this, len = array.length;
                th.p.groupHeaders = [];
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var groupHeaderArray = array[i];
                        $(th).setGroupHeaders(groupHeaderArray);
                        th.p.groupHeaders.push(groupHeaderArray);
                    }
                }
                //计算表头合并单元格
                var hrs = $("tr.ui-ygrid-columnheader", th.grid.hDiv);
                for (var ri = hrs.length - 1; ri >= 0; ri--) {
                    var hr = hrs[ri];
                    for (var ci = 0, rhci = 0, clen = hr.cells.length; ci < clen; ci++) {
                        var cell = $(hr.cells[ci]), rhCell = $(th.grid.headers[rhci].el);
                        if (cell[0].colSpan > 1) {
                            rhci += cell[0].colSpan;
                        } else {
                            if (cell[0].style.display !== "none") {
                                rhCell[0].rowSpan += 1;
                                rhCell.insertBefore(cell);
                                $("div", rhCell).css({height: rhCell.height() + "px", lineHeight: rhCell.height() + "px"});
                                cell.remove();
                            }
                            rhci++;
                        }
                    }
                }
            });
        },
        setGroupHeaders: function (o) {     //设置表格多层表头
            return this.each(function () {
                var indexOfColumnHeader = function (text, columnHeaders) {
                    var length = columnHeaders.length;
                    for (var i = 0; i < length; i++) {
                        if (columnHeaders[i].startColumnName === text) {
                            return i;
                        }
                    }
                    return -1;
                };
                var $th = this, groupHeaderArray = o, $rowHeader = $("tr.ui-ygrid-headers", $th.grid.hDiv),
                    $groupHeadRow = $("<tr class='ui-ygrid-columnheader' role='columnheader'></tr>").insertBefore($rowHeader),
                    $firstHeaderRow = $($th.grid.hDiv).find("tr.yg-first-row-header");   //不可见行，用于控制每个列的动态宽度
                if ($firstHeaderRow[0] === undefined) {
                    $firstHeaderRow = $('<tr>', {role: "row", "aria-hidden": "true"}).addClass("yg-first-row-header").css("height", "auto");
                } else {
                    $firstHeaderRow.empty();
                }
                for (var j = 0, len = $th.p.colModel.length; j < len; j++) {
                    var thStyle = {height: 0, width: $th.grid.headers[j].width + 'px', display: ($th.p.colModel[j].hidden ? 'none' : '')};
                    $("<th>", {role: 'gridcell'}).css(thStyle).addClass("ui-first-th-ltr").appendTo($firstHeaderRow);
                }
                var headCol, index, cVisibleColumns, iCol, colHeader;
                for (var i = 0, clen = $th.p.colModel.length; i < clen; i++) {   //构建上级表头
                    index = indexOfColumnHeader($th.p.colModel[i].name, groupHeaderArray);
                    if (index >= 0) {
                        headCol = groupHeaderArray[index];
                        var colWidth = 0, hiddenCount = 0, hLen = headCol.numberOfColumns, cLen = $th.p.colModel.length;
                        for (cVisibleColumns = 0, iCol = 0; iCol < hLen && (i + iCol < cLen); iCol++) {
                            if (!$th.p.colModel[i + iCol].hidden) {
                                cVisibleColumns++;
                                colWidth += $th.grid.headers[i + iCol].width + 1;
                            } else {
                                hiddenCount++;
                            }
                        }
                        colHeader = $('<th class="ui-state-default ui-th-column ui-th-ltr" role="columnheader"></th>')
                            .html(headCol.titleText).appendTo($groupHeadRow);
                        if (cVisibleColumns > 0) {
                            colHeader.attr("colspan", String(cVisibleColumns));
                            colHeader.css({width: colWidth + "px"});
                            colHeader.attr("title", colHeader.text());
                        }
                        if (cVisibleColumns === 0) {
                            colHeader.hide();
                            colHeader.attr("colspan", String(hiddenCount));
                        }
                        i += cVisibleColumns - 1 + hiddenCount;
                    } else {
                        var ch = $('<th class="ui-state-default ui-th-column ui-th-ltr" role="columnheader"></th>').appendTo($groupHeadRow);
                        if ($th.p.colModel[i].hidden) {
                            ch.hide();
                        }
                    }
                }
                $($th.grid.hDiv).find(".ui-ygrid-htable").children("thead").prepend($firstHeaderRow);
                $($th).bind('yGridResizeStop.setGroupHeaders', function (e, nw, idx) {
                    $firstHeaderRow.find('th').eq(idx).width(nw - 1);
                });
            });
        },
        getGridRowById: function (rowid) { //根据行id获取表格行
            var row;
            this.each(function () {
                try {
                    var i = this.rows.length;
                    while (i--) {
                        if (rowid.toString() === this.rows[i].id) {
                            row = this.rows[i];
                            break;
                        }
                    }
                } catch (e) {
                    row = $(this.grid.bDiv).find("#" + rowid);
                }
            });
            return row;
        },
        getGridRowAt: function (rowIndex) {
            var row;
            this.each(function () {
                var th = this;
                row = th.rows[rowIndex];
            });
            return row;
        },
        getGridCellAt: function (rowIndex, colIndex) {
            var cell;
            this.each(function () {
                var th = this;
                var row = th.rows[rowIndex];
                if (row) {
                    cell = row.cells[colIndex];
                }
            });
            return cell;
        },
        setCellRequired: function (rowIndex, colIndex, isRequired) {
            this.each(function () {
                var row = this.rows[rowIndex], cell;
                if (row) {
                    cell = row.cells[colIndex];
                }
                if (cell == null) return;
                if (isRequired) {
                    $(cell).addClass('ui-cell-required');

                } else {
                    $(cell).removeClass('ui-cell-required');
                }
            });
        },
        setCellFocus: function (rowIndex, colIndex) {
            this.each(function () {
                var cell = $(this).getGridCellAt(rowIndex, colIndex);
                cell && $(cell).click();
            });
        },
        setErrorCells: function (o) {
            return this.each(function () {
                var th = this;
                if (th.p.errorCells) {
                    for (var i = 0, len = th.p.errorCells.length; i < len; i++) {
                        var ec = th.p.errorCells[i].cell;
                        if (ec) {
                            ec.find("div").remove();
                            ec.removeAttr("position");
                            ec.attr({title: ec.html()});
                        }
                    }
                }
                var errorCells = o || th.p.errorCells;
                th.p.errorCells = [];
                if (errorCells == undefined || errorCells.length == 0) return;
                var ecInfo, rid, gridRow, gridCell;
                for (var ind = 0, clen = errorCells.length; ind < clen; ind++) {
                    ecInfo = errorCells[ind];
                    rid = $.ygrid.uidPref + ecInfo.rowIndex;
                    gridRow = $(th).getGridRowById(rid);
                    if (gridRow) {
                        gridCell = $(gridRow.cells[ecInfo.colIndex + (th.p.rowSequences ? 1 : 0)]);
                        gridCell.attr({title: ecInfo.errorMsg}).css({position: "relative"});
                        $("<div></div>").addClass("ui-cell-error").appendTo(gridCell);
                        ecInfo.cell = gridCell;
                    }
                    th.p.errorCells.push(ecInfo);
                }
            });
        },
        setErrorRows: function (o) {
            return this.each(function () {
                var th = this;
                if (th.p.errorRows) {
                    for (var i = 0, len = th.p.errorRows.length; i < len; i++) {
                        var er = th.p.errorRows[i].row;
                        if (er) {
                            $(er.cells[0]).find("div").remove();
                            $(er.cells[0]).removeAttr("position");
                        }
                    }
                }
                var errorRows = o || th.p.errorRows;
                if (errorRows == undefined || errorRows.length == 0) return;
                var erInfo, rid, gridRow;
                th.p.errorRows = [];
                for (var ind = 0, elen = errorRows.length; ind < elen; ind++) {
                    erInfo = errorRows[ind];
                    rid = $.ygrid.uidPref + erInfo.rowIndex;
                    gridRow = $(th).getGridRowById(rid);
                    if (gridRow) {
                        $(gridRow.cells[0]).attr({title: erInfo.errorMsg}).css({position: "relative"});
                        $("<div></div>").addClass("ui-cell-error").appendTo($(gridRow.cells[0]));
                        erInfo.row = gridRow;
                    }
                    th.p.errorRows.push(erInfo);
                }
            });
        },
        editCell: function (iRow, iCol, ed, event) {
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                iCol = parseInt(iCol, 10);
                $t.p.selectRow = $t.rows[iRow].id;
                if ($t.p.editCells.length > 0) {
                    if (ed === true) {
                        if (iRow == $t.p.iRow && iCol == $t.p.iCol) {
                            return;
                        }
                    }
                    $($t).yGrid("saveCell", $t.p.editCells[0].ir, $t.p.editCells[0].ic);
                }
                var cm = $t.p.colModel[iCol], rowIndex = $.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id),
                    row = $t.p.data[rowIndex], editOpt = $t.getCellEditOpt(row, iCol), formatter = editOpt.formatter;
                var nm = cm.name;
                if (nm === 'rn' || formatter == undefined || formatter == "button" || formatter == "hyperlink" || formatter == "checkbox" || formatter == "image") {
                    return;
                }
                var curCell = $("td:eq(" + iCol + ")", $t.rows[iRow]), enable = row.data[cm.index][2];
                if (enable === undefined || enable === null) {
                    enable = cm.editable;
                }
                if (enable === undefined || enable === null) {
                    enable = $t.p.enable;
                }
                var rowEditable = (row.isEditable === undefined ? true : row.isEditable);
                if (enable === true && ed === true && rowEditable && !curCell.hasClass("not-editable-cell")) {
                    if (parseInt($t.p.iCol, 10) >= 0 && parseInt($t.p.iRow, 10) >= 0) {
                        $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        $($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover");
                    }
                    $(curCell).addClass("edit-cell ui-state-highlight");
                    $($t.rows[iRow]).addClass("selected-row ui-state-hover");
                    if (!editOpt.edittype) {
                        editOpt.edittype = "label";
                    }
                    $t.p.editCells.push({ir: iRow, ic: iCol, name: nm, v: row.data[cm.index], cell: curCell});
                    var opt = $.extend({}, editOpt.editOptions || {}, {event: event, key: editOpt.key, id: iRow + "_" + nm, name: nm});
                    if (editOpt.customedit && $t.p.createCellEditor && $.isFunction($t.p.createCellEditor)) {
                        $t.p.createCellEditor.call($t, curCell, editOpt.edittype, iRow, iCol, opt)
                    }
                }
                $t.p.iCol = iCol;
                $t.p.iRow = iRow;
            });
        },
        saveCell: function (iRow, iCol) {
            return this.each(function () {
                var $t = this, fr;
                if (!$t.grid) {
                    return;
                }
                if ($t.p.editCells.length >= 1) {
                    fr = 0;
                } else {
                    fr = null;
                }
                if (fr !== null) {
                    var cc = $("td:eq(" + iCol + ")", $t.rows[iRow]), v2, rowIndex = $.ygrid.stripPref($.ygrid.uidPref, $t.rows[iRow].id),
                        editOpt = $t.getCellEditOpt($t.p.data[rowIndex], iCol), isChanged = false;
                    if (editOpt.customedit && $t.p.endCellEditor && $.isFunction($t.p.endCellEditor)) {
                        v2 = $t.p.endCellEditor.call($t, cc, editOpt.edittype, iRow, iCol);
                    }
                    var v2V = (v2 == undefined ? "" : v2[0]);
                    var ecV = $t.p.editCells[fr].v === undefined ? "" : $t.p.editCells[fr].v[0];
                    var isEmpty = function (value) {
                        var result = false;
                        if (value == undefined || value == null || value.length == 0) {
                            result = true;
                        }
                        return result;
                    };
                    var isEqual = function (v1, v2) {
                        if (v1 == null && v2 !== null) {
                            return false
                        } else if (v1 !== null && v2 == null) {
                            return false;
                        } else if (v1 == null && v2 == null) {
                            return true;
                        } else if (v1 instanceof Decimal && v2 instanceof Decimal) {
                            return v1.equals(v2);
                        }
                        switch (editOpt.edittype) {
                            case "dict":
                                if (editOpt.editOptions.multiSelect) {
                                    if (v1.length != v2.length) {
                                        return false;
                                    } else {
                                        for (var i = 0, len = v1.length; i < len; i++) {
                                            var isMatch = false;
                                            for (var j = 0, vlen = v2.length; j < vlen; j++) {
                                                if (v1[i].oid == v2[j].oid) {
                                                    isMatch = true;
                                                    break;
                                                }
                                            }
                                            if (!isMatch) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    }
                                }
                                return v1.oid == v2.oid;
                        }
                        return v1 == v2;
                    };
                    if ((isEmpty(v2V) && isEmpty(ecV)) || isEqual(v2V, ecV)) {
                        $($t).yGrid("restoreCell", iRow, iCol);
                    } else {
                        isChanged = true;
                        $($t).yGrid("setCell", $t.rows[iRow].id, iCol, v2, false, false);
                        $t.p.editCells.splice(0, 1);
                    }
                    if ($t.p.afterEndCellEditor && $.isFunction($t.p.afterEndCellEditor)) {
                        $t.p.afterEndCellEditor.call($t, cc, editOpt.edittype, isChanged, iRow, iCol);
                    }
                }
                if ($t.p.errorCells) {
                    for (var i = 0, len = $t.p.errorCells.length; i < len; i++) {
                        var ec = $t.p.errorCells[i];
                        if (ec.rowIndex + 1 == iRow && ($t.p.rowSequences ? ec.colIndex + 1 : ec.colIndex) == iCol) {
                            ec.cell.attr({title: ec.errorMsg}).css({position: "relative"});
                            $("<div></div>").addClass("ui-cell-error").appendTo(ec.cell);
                        }
                    }
                }
            });
        },
        restoreCell: function (iRow, iCol) {
            return this.each(function () {
                var $t = this, fr;
                if (!$t.grid) {
                    return;
                }
                if ($t.p.editCells.length >= 1) {
                    fr = 0;
                } else {
                    fr = null;
                }
                if (fr !== null) {
                    var cc = $("td:eq(" + iCol + ")", $t.rows[iRow]);
                    $(cc).empty().attr("tabindex", "-1");
                    $($t).yGrid("setCell", $t.rows[iRow].id, iCol, $t.p.editCells[fr].v, false, false);
                    $t.p.editCells.splice(0, 1);
                }
            });
        },
        setCell: function (rowid, colname, nData, cssp, attrp) {
            return this.each(function () {
                var $t = this, pos = -1, v, title;
                if (!$t.grid) {
                    return;
                }
                if (isNaN(colname)) {
                    $($t.p.colModel).each(function (i) {
                        if (this.name === colname) {
                            pos = i;
                            return false;
                        }
                    });
                } else {
                    pos = parseInt(colname, 10);
                }
                if (pos >= 0) {
                    var ind = $($t).yGrid('getGridRowById', rowid), ri = parseInt($.ygrid.stripPref($.ygrid.uidPref, rowid), 10);
                    if (ind) {
                        var tcell = $("td:eq(" + pos + ")", ind);
                        if (nData !== undefined) {
                            v = nData[1];
                            title = {"title": v};
                            $(tcell).html(v).attr(title);
                            var cm = $t.p.colModel[pos], index;
                            $t.p.data[ri].data[cm.index] = nData;
                        }
                        if (typeof cssp === 'string') {
                            $(tcell).addClass(cssp);
                        } else if (cssp) {
                            $(tcell).css(cssp);
                        }
                        if (typeof attrp === 'object') {
                            $(tcell).attr(attrp);
                        }
                    }
                }
            });
        },
        scrollVisibleCell: function (iRow, iCol) {   //滚动表格使得当前单元格处于显示区域
            return this.each(function () {
                var $t = this;
                var ch = $t.grid.bDiv.clientHeight,
                    st = $t.grid.bDiv.scrollTop,
                    crth = $t.rows[iRow].offsetTop + $t.rows[iRow].clientHeight,
                    crt = $t.rows[iRow].offsetTop;
                if (crth >= ch + st) {
                    $t.grid.bDiv.scrollTop = crth - ch + 2;
                } else if (crt < st) {
                    $t.grid.bDiv.scrollTop = $t.rows[iRow].offsetTop;
                }
                var cw = $t.grid.bDiv.clientWidth,
                    sl = $t.grid.bDiv.scrollLeft,
                    crclw = $t.rows[iRow].cells[iCol].offsetLeft + $t.rows[iRow].cells[iCol].clientWidth,
                    crcl = $t.rows[iRow].cells[iCol].offsetLeft;
                if (crclw >= cw + parseInt(sl, 10)) {
                    $t.grid.bDiv.scrollLeft = $t.grid.bDiv.scrollLeft + $t.rows[iRow].cells[iCol].clientWidth;
                } else if (crcl < sl) {
                    var left = crcl - $t.rows[iRow].cells[iCol].clientWidth;
                    $t.grid.bDiv.scrollLeft = left < 0 ? 0 : left;
                }
            });
        },
        clearBeforeUnload: function () {
            return this.each(function () {
                var grid = this.grid;
                if ($.isFunction(grid.emptyRows)) {
                    grid.emptyRows.call(this, true, true);
                }
                $(document).unbind("mouseup.yGrid" + this.p.id);
                $(grid.hDiv).unbind("mousemove");
                $(grid.bDiv).unbind("mousemove");
                $(this).unbind();
                grid.dragEnd = null;
                grid.dragMove = null;
                grid.dragStart = null;
                grid.emptyRows = null;
                grid.populate = null;
                grid.populateVisible = null;
                grid.scrollGrid = null;
                grid.clearSelectCells = null;
                grid.timer = null;
                grid.prevRowHeight = null;
                grid.bDiv = null;
                grid.hDiv = null;
                grid.cols = null;
                var i, l = grid.headers.length;
                for (i = 0; i < l; i++) {
                    grid.headers[i].el = null;
                }
                this.updatepager = null;
                this.refreshIndex = null;
                this.modifyGridCell = null;
                this.formatter = null;
                this.grid = null;
                this.p._indexMap = null;
                this.p.data = null;
                this.p = null;
            });
        },
        GridDestroy: function () {
            return this.each(function () {
                if (this.grid) {
                    if (this.p.pager) {
                        $(this.p.pager).remove();
                    }
                    try {
                        $(this).clearBeforeUnload();
                        $("#gbox_" + this.id).remove();
                    } catch (_) {
                    }
                }
            });
        }
    });
})(jQuery);
//fmatter初始化
(function ($) {
    "use strict";
    $.fmatter = {};
    $.fn.fmatter = function (formatType, cellval, opts, rwd, act) {
        var v = cellval;
        opts = $.extend({}, $.ygrid.formatter, opts);
        try {
            v = $.fn.fmatter[formatType].call(this, cellval, opts, rwd, act);
        } catch (fe) {
        }
        return v;
    };
    $.extend($.fmatter, {
        isBoolean: function (o) {
            return typeof o === 'boolean';
        },
        isObject: function (o) {
            return (o && (typeof o === 'object' || $.isFunction(o))) || false;
        },
        isString: function (o) {
            return typeof o === 'string';
        },
        isNumber: function (o) {
            return typeof o === 'number' && isFinite(o);
        },
        isValue: function (o) {
            return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
        },
        isEmpty: function (o) {
            if (!this.isString(o) && this.isValue(o)) {
                return false;
            }
            if (!this.isValue(o)) {
                return true;
            }
            o = $.trim(o).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            return o === "";
        },
        extend: function (formatType, formatFunc) {
            if ($.isFunction(formatFunc)) {
                $.fn.fmatter[formatType] = formatFunc;
            }
        }
    });
    $.fn.fmatter.defaultFormat = function (cellval, opts) {
        return ($.fmatter.isValue(cellval) && cellval !== "" ) ? cellval : opts.defaultValue || "&#160;";
    };
    $.fn.fmatter.hyperlink = function (cellval, opts) { //超链接单元格格式化
        var op = {baseLinkUrl: opts.baseLinkUrl, showAction: opts.showAction, addParam: opts.addParam || "", target: opts.target, idName: opts.idName},
            target = "", idUrl;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.target) {
            target = 'target=' + op.target;
        }
        if (op.baseLinkUrl) {
            idUrl = op.baseLinkUrl + op.showAction + '?' + op.idName + '=' + opts.rowId + op.addParam;
        } else {
            idUrl = "#";
        }
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {	//add this one even if its blank string
            return ["<a  style='width: 100%' " , target , " href='" , idUrl , "' class='ui-hyperlink'>" , cellval , "</a>"].join("");
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.button = function (cellval, opts) {  //按钮单元格格式化
        if ($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {
            cellval = typeof(cellval) == "undefined" ? "" : cellval;
            return "<button style='width: 100%;height: 100%' class='ui-button'>" + cellval + "</button>"
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.checkbox = function (cellval, opts) {  //复选框单元格格式化
        var op = $.extend({}, opts.checkbox), ds;
        if (opts.colModel !== undefined && opts.colModel.formatOptions !== undefined) {
            op = $.extend({}, op, opts.colModel.formatOptions);
        }
        if (op.disabled === true || (opts.colModel.editable === undefined ? !this.p.enable : !opts.colModel.editable)) {
            ds = "disabled=\"disabled\"";
        } else {
            ds = "";
        }
        if ($.fmatter.isEmpty(cellval) || cellval === undefined) {
            cellval = false;
        }
        cellval = String(cellval);
        cellval = (cellval + "").toLowerCase();
        var bchk = cellval.search(/(false|f|0|no|n|off|undefined)/i) < 0 ? " checked='checked' " : "";
        return "<input type=\"checkbox\" style='text-align: center' " + bchk + " value=\"" + cellval + "\" offval=\"false\" " + ds + "/>";
    };
    $.fn.fmatter.textEditor = function (cellval, opts) {  //输入框格式化
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.numberEditor = function (cellval, opts) {  //数值框格式化
        if (isNaN(parseFloat(cellval))) {
            cellval = "";
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
    $.fn.fmatter.datePicker = function (cellval, opts) {  //日期格式化
        if (!$.fmatter.isEmpty(cellval)) {
            var option = opts.colModel.editOptions;
            var date = new Date(parseFloat(cellval, 10));
            return date.Format(option.formatStr);
        }
        return $.fn.fmatter.defaultFormat(cellval, opts);
    };
})(jQuery);/**
 * 表格编辑器基础类
 * @type {*}
 */
YIUI.CellEditor = YIUI.extend({
    /** 编辑器内部组件*/
    yesCom: null,
    /** 编辑器的值*/
    value: null,

    setValue: function (value) {
        this.value = value;
    },
    getValue: function () {
        return this.value;
    },
    render: function (parent) {
        parent.append(this.yesCom.getEl());
        this.onRender(parent);
        this.install();
    },
    getText: function () {
        return this.text;
    },
    setText: function (text) {
        this.text = text;
    },
    getEl: function () {
        return this.yesCom.getEl();
    },
    onRender: $.noop,
    beforeDestroy: $.noop,
    install: $.noop
});/**
 * 表格单元格文本框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellTextEditor = YIUI.extend(YIUI.CellEditor, {
    behavior: YIUI.TextEditorBehavior,
    init: function (opt) {
        var self = this;
        opt.valueChange = function (val) {
            self.setValueWithEvent(val, true, true);
        };
        this.yesCom = new YIUI.Yes_TextEditor(opt);
        this.yesCom.el.addClass("ui-txted");
    },

    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setEmbedText(this.yesCom.embedText);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
        this.yesCom.setClearable(false);
    },
    getInput: function () {
        return this.yesCom.getInput();
    },
    setValueWithEvent: function (value, commit, fireEvent) {
        var options = {
            oldVal: this.value,
            newVal: value,
            trim: this.yesCom.trim,
            textCase: this.yesCom.textCase,
            maxLength: this.yesCom.maxLength,
            invalidChars: this.yesCom.invalidChars
        };
        var _this = this.yesCom;
        var callback = function (value) {
            _this.value = value;
            _this.caption = value;
            $("input", _this.el).val(value);
        };
        return this.behavior.checkAndSet(options, callback);
    },
    setValue: function (value) {
        this.setValueWithEvent(value, true, true);
        this.base(this.yesCom.value);
    },
    getValue: function () {
        return this.yesCom.value;
    },
    getText: function () {
        return this.yesCom.value;
    },
    finishInput: function () {
        return this.yesCom.finishInput();
    },
    install: function () {
        this.base();
        var self = this;
        this.getInput().blur(function (e) {
            self.yesCom.saveCell();
        });
    }
});/**
 * 表格单元格数值框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellNumberEditor = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        var maxNumber = '';
        for (var i = 0; i < opt.decPrecision - opt.decScale; i++) {
            maxNumber += '9';
        }
        if (opt.decScale > 0) {
            maxNumber += '.';
            for (var i = 0; i < opt.decScale; i++) {
                maxNumber += '9';
            }
        }
        this.settings = {
            aNum: '0123456789',
            //组分割符
            aSep: opt.useSep ? opt.sep : '',
            //组大小
            dGroup: opt.groupingSize,
            //小数点符号
            aDec: opt.decSep,
            //前缀或后缀符号
            aSign: '',
            //p是前缀 s是后缀
            pSign: 's',
            //最大值
            vMax: maxNumber,
            //最小值
            vMin: '-' + maxNumber,
            //小数位数
            mDec: opt.decScale,
            //精度
            mPre: opt.decPrecision,
            //四舍五入方式
            mRound: opt.roundingMode,
            altDec: null
        };
        opt.settings = this.settings;
        this.yesCom = new YIUI.Yes_NumberEditor(opt);
        this.yesCom.el.addClass("ui-numed");
    },

    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
        this.yesCom.getInput().css({width: "100%", height: "100%", padding: "0 2px 0 2px", margin: 0});
    },
    getInput: function () {
        return this.yesCom.getInput();
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setValue(value);
    },
    getValue: function () {
        return this.yesCom.getValue();
    },
    getText: function () {
        return  this.yesCom.getInput().val();
    },
    finishInput: function () {
        return this.yesCom.finishInput();
    },
    install: function () {
        this.base();
        var self = this;
        this.getInput().blur(function (e) {
            self.yesCom.saveCell();
        });
    }
});/**
 * 表格单元格日期编辑器
 * @type {*}
 */
YIUI.CellEditor.CellDatePicker = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        this.yesCom = new YIUI.Yes_DatePicker(opt);
        this.yesCom.el.addClass("ui-dp");
        opt.formatStr && this.yesCom.setFormatStr(opt.formatStr);
        opt.isNoTimeZone && this.yesCom.setIsNoTimeZone(opt.isNoTimeZone);
        opt.isOnlyDate && this.yesCom.setOnlyDate(opt.isOnlyDate);
        opt.regional && this.yesCom.setRegional(opt.regional);
        opt.calendars && this.yesCom.setCalendars(opt.calendars);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setValue(value);
    },
    getValue: function () {
        return this.yesCom.getValue();
    },
    getDropBtn: function () {
        return this.yesCom.getBtn();
    },
    getDropView: function () {
        return this.yesCom.getDropView();
    },
    getInput: function () {
        return this.yesCom.getInput();
    },
    finishInput: function () {

    },
    beforeDestroy: function () {
        this.yesCom.getDropView().remove();
    },
    getText: function () {
        return this.yesCom.getInput().val();
    },
    install: function () {

    }
});/**
 * 表格单元格下拉框编辑器
 * @type {*}
 */
YIUI.CellEditor.CellComboBox = YIUI.extend(YIUI.CellEditor, {

    init: function (opt) {
        opt = $.extend(true, opt, {
            multiSelect: opt.type !== "combobox",
            getItems: function () {
                YIUI.ComboBoxHandler.getComboboxItems(this, opt.cxt);
            },
            getValue: function () {
                return this.getSelValue();
            }
        });
        this.yesCom = new YIUI.Yes_Combobox(opt);
        this.yesCom.setEditable(opt.editable);
        this.yesCom.getEl().addClass("ui-cmb");
        opt.items && this.yesCom.setItems(opt.items);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },
    setValue: function (value) {
        this.base(value);
        this.yesCom.setSelValue(value);
    },

    getValue: function () {
    	var value = this.yesCom.getSelValue();
    	if (this.integerValue) {
    		value = YIUI.TypeConvertor.toInt(value);
    	}
    	return value;
    },

    getText: function () {
        return this.yesCom.getText();
    },

    setText: function (text) {
        this.yesCom.setText(text);
    },

    getInput: function () {
        return this.yesCom._textBtn;
    },
    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    beforeDestroy: function () {
        this.yesCom._dropView.remove();
    }
});/**
 * 表格单元格字典编辑器
 * @type {*}
 */
YIUI.CellEditor.CellDict = YIUI.extend(YIUI.CellEditor, {
    cellDictHandler: YIUI.DictHandler,
    init: function (opt) {
        var self = this;
        var form = YIUI.FormStack.getForm(opt.ofFormID);
        self.cellDictHandler.setContext({form: form, rowIndex: opt.rowIndex, colIndex: opt.colIndex});
        opt = $.extend(true, opt, {
            getDictChildren: function (node) {
                var dict = this;
                var success = function (msg) {
                    if (msg) {
                        var nodeId = node.attr('id');
                        var syncNodes = dict.dictTree.formatAsyncData(msg);
                        var isHaveNext = msg.totalRowCount;
                        msg = dict.secondaryType == 5 ? msg.data :msg;
                        for(var i=0, len= msg.length; i<len; i++) {
						    
						    if(dict.secondaryType == 5) {
								var path = nodeId + "_" +  msg[i].OID;
								 msg[i].id = path;
						    }
						}
                        syncNodes = dict.secondaryType == 5 ? msg :syncNodes;
                        dict.dictTree.buildTreenode(syncNodes, nodeId, parseInt(node.attr("level")) + 1, dict.secondaryType, isHaveNext);
                        dict.secondaryType == 5 ? node.attr('isLoaded',false) : node.attr('isLoaded',true);
                        /*node.attr('isLoaded', true);*/
                    }
                };
                if (dict.secondaryType != 5) {
                	YIUI.DictService.getDictChildren(dict.itemKey, dict.dictTree.getNodeValue(node), dict.dictTree.dictFilter, dict.stateMask, success);
                } else {
                	YIUI.DictService.getQueryData(dict.itemKey,dict.dictTree.startRow, 10,dict.dictTree.pageIndicatorCount, dict.dictTree.fuzzyValue,  dict.stateMask ,dict.getDictTree().dictFilter, dict.getDictTree().getNodeValue(node),success);
                }
                
            },
            getItemKey: function () {
                return this.itemKey;
            },
            setValue: function (value) {
                var changed = false;
                if (this.value) {
                    changed = !this.value.equals(value);
                } else if (value) {
                    changed = true;
                }
                this.value = value;
                if (this._resetTree && this.multiSelect) {
                    this.dictTree.reset();
                    this.setDictTreeCheckedNodes();
                }
                if(self.yesCom.isShowQuery && opt.saveCell != null){
                    opt.saveCell();
                }
                return changed;
            },
            checkDict: function () {
                self.cellDictHandler.checkDict(this);
            },
            doLostFocus: function (text) {
                self.cellDictHandler.autoComplete(this, text);
                if (self.yesCom.isShowQuery) {
                    opt.stopClickCell();
                }
            },
            beforeExpand: function (tree, treeNode) {
                var success = function (msg) {
                    if (msg) {
                        $.each(msg, function (i) {
                            var nodeId = this.itemKey + '_' + this.oid;
                            tree.indeterminatedNodes[nodeId] = this;
                        });
                    }
                };
                YIUI.DictService.getAllParentID(self.yesCom.itemKey, self.yesCom.getSelValue(), success);
            }
        });
        this.yesCom = new YIUI.Yes_Dict(opt);
        this.yesCom.getEl().addClass("ui-dict");
        opt.items && this.yesCom.setItems(opt.items);
    },
    onRender: function (parent) {
        this.base(parent);
        this.yesCom.setWidth(parent.width());
        this.yesCom.setHeight(parent.height());
    },

    getDropBtn: function () {
        return this.yesCom._dropBtn;
    },
    getValue: function () {
        return this.yesCom.getSelValue();
    },
    setValue: function (value) {
        this.yesCom.setSelValue(value);
    },
    getInput: function () {
        return this.yesCom._textBtn;
    },
    setText: function (caption) {
        this.yesCom.text = caption;
        this.yesCom.setText(caption);
    },
    getText: function () {
        return this.yesCom.getText();
    },
    beforeDestroy: function () {
        this.yesCom._dropView.remove();
    }
});/**
 * 表格单元格图片组件
 * @type {*}
 */
YIUI.CellEditor.CellImage = YIUI.extend(YIUI.CellEditor, {
    init: function (opt) {
        var pathV = "", self = this;
        this.yesCom = $("<div class='ui-img cellEditor' style='width: 100%;height: 100%'></div>");
        this.yesCom.getEl = function () {
            return self.yesCom;
        };
        this.options = opt;
        if (this.options.maxSize == -1) {
            this.options.maxSize = 1024;
        }
        this.yesCom[0].enable = opt.enable;
        if (opt.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
            if (opt.value !== null)  pathV = opt.value;
        } else {
            pathV = opt.image;
        }
        //TODO 图片的异步加载
        this.image = $("<img class='img' style='width: 100%;height: 100%'>").appendTo(this.yesCom);
        this.setValue(pathV);
        this.yesCom[0].enable = opt.enable;
        this.pathV = pathV;
    },
    onRender: function (parent) {
        this.base(parent);
    },
    getEl: function () {
        return this.yesCom;
    },
    setEnable: function (enable) {
        this.yesCom[0].enable = enable;
    },
    setValue: function (value) {
        var self = this;
        this.base(value);
        if (value === undefined || value === null || value.length == 0) {
            this.image.attr("src", YIUI.Image.EmptyImg);
        } else {
            if (this.options.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
            	var form = YIUI.FormStack.getForm(this.options.ofFormID);
                var formKey = form.formKey;
                var path = encodeURIComponent(value);
                var url = Svr.SvrMgr.AttachURL + "?path=" + path + "&formKey="+formKey + "&service=DownloadImage&mode=1&r=" + Math.random();
                this.image.attr("src", url);
                this.image.attr("formKey",formKey);
            } else {
                this.image.attr("src", "Resource/" + value);
            }
        }
        if (value !== undefined && value !== null && value.length !== 0) {
            window.setTimeout(function () {
                if (self.options.stretch !== "true" && self.options.stretch !== true) {
                    var w = self.yesCom.width(), h = self.yesCom.height(), iw = self.image.clientWidth, ih = self.image.clientHeight;
                    if ((iw / w) > (ih / h)) {
                        self.image.css({width: w + "px", height: ""});
                    } else {
                        self.image.css({width: "", height: h + "px"});
                    }
                } else {
                    self.image.css({width: "100%", height: "100%"});
                }
            }, 0);
        }
        this.pathV = value;
    },
    install: function () {
        var self = this;
        this.yesCom.delegate($(self.image), "click", function (e) {
            if (self.pathV.length > 0 && e.delegateTarget.enable) {
                self.options.click();
            }
        });
        var uploadImg = function ($this, paras) {
            var form = YIUI.FormStack.getForm(self.options.ofFormID);
            var array = new Array("gif", "jpg", "jpeg", "png", "bmp");
            var submit = function (btn) {
                var isAllowed = $.checkFile(btn, self.options.maxSize, array);
                if (!isAllowed || form.OID == null || form.OID == -1) return;
                paras = $.extend({
                    service: "UploadImage",
                    controlKey: self.options.gridKey,
                    rowIndex: self.options.rowIndex,
                    colIndex: self.options.colIndex,
                    formKey: form.formKey,
                    operatorID: $.cookie("userID"),
                    fileID: -1,
                    oid: form.OID,
                    mode: 1
                }, paras);
                $.ajaxFileUpload({
                    url: Svr.SvrMgr.AttachURL,
                    secureuri: false,
                    fileElement: btn,
                    data: paras,
                    type: "post",
                    success: function (data, status, newElement) {
                        newElement.attr("accept", "image/*");
                        data = JSON.parse(data);
                        self.setValue(data.data.replace(/\\/g, "/"));
                        self.options.change(self.getValue());
                        self.yesCom.delegate($(self.image), "click", function (e) {
                            e.delegateTarget.enable && self.options.click();
                        });
                    },
                    error: function (data, status, e) {
                        alert(e);
                    }
                });
            };
            submit($this);
        };
        var doDeleteImage = function (filePath) {
            if (filePath == undefined || filePath == null) return;
            var paras = {
                service: "DeleteImage",
                filePath: filePath,
                operatorID: $.cookie("userID"),
                mode: 1
            };
            $.ajax({
                url: Svr.SvrMgr.AttachURL,
                data: paras,
                type: "post",
                error: function (data, status, e) {
                    alert(e);
                }
            });
        };
        this.yesCom.delegate('.upbtn', 'change', function (event) {
            //添加插件操作
            var file = event.target.files[0], type = file.type.split("/")[1];
            if (self.options.imageCut) {
                var options = {
                    type: type,
                    callback: function (paras) {
                        uploadImg($(event.target), paras);
                    }
                };
                $(this).photoCut(options);
            } else {
                uploadImg($(event.target), {fileName:file.name, imgType: type});
            }
            $(".opt,.bar", self.yesCom).remove();
            event.stopPropagation();
        });
        this.yesCom.mouseover(function () {
            if ($(".opt", self.yesCom).length == 0) {
                var disPlay = (self.options.sourceType == YIUI.IMAGE_SOURCETYPE.DATA && self.yesCom[0].enable) ? "block" : "none",
                    optBar = $("<div class='bar'></div>").appendTo(self.yesCom),
                    upload = $("<div class='opt upload' title='" + $.ygrid.cell_imgOpt.open + "'></div>").appendTo(self.yesCom),
                    show = $("<div class='opt show' title='" + $.ygrid.cell_imgOpt.show + "'></div>").appendTo(self.yesCom),
                    clear = $("<div class='opt clear' title='" + $.ygrid.cell_imgOpt.clear + "'></div>").appendTo(self.yesCom),
                    uploadBtn = $("<input type='file' name='file' data-url='upload' class='opt upbtn' accept='image/*' title='"
                        + $.ygrid.cell_imgOpt.open + "'>").appendTo(self.yesCom);
                optBar.css({top: (self.yesCom.height() - 25) + "px"});
                upload.css({left: (self.yesCom.width() - 22) + "px", top: (self.yesCom.height() - 22) + "px", display: disPlay});
                uploadBtn.css({left: (self.yesCom.width() - 22) + "px", top: (self.yesCom.height() - 22) + "px", opacity: 0, display: disPlay});
                show.css({left: (self.yesCom.width() - ((disPlay == "none") ? 22 : 46)) + "px", top: (self.yesCom.height() - 22) + "px"});
                clear.css({left: (self.yesCom.width() - 68) + "px", top: (self.yesCom.height() - 22) + "px", display: disPlay});
                $(".opt", self.yesCom).mouseover(function (e) {
                    var btn = $(e.target);
                    if (btn.hasClass("upbtn")) {
                        upload.addClass("sel");
                    } else {
                        btn.addClass("sel");
                    }
                }).mouseout(function (e) {
                        var btn = $(e.target);
                        if (btn.hasClass("upbtn")) {
                            upload.removeClass("sel");
                        } else {
                            btn.removeClass("sel");
                        }
                    });
                clear.click(function (e) {
//                    doDeleteImage(self.getValue());
                    if (self.getValue() !== "") {
                        self.setValue("");
                        self.options.change("");
                    }
                    self.setValue("");
                    e.stopPropagation();
                });
                uploadBtn.click(function (e) {
                    e.stopPropagation();
                });
                show.click(function (e) {
                    var path;
                    if (self.options.sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
                        if (self.getValue() == undefined || self.getValue() == null || self.getValue().length == 0) return;
                        var formKey = self.image.attr("formKey");
                        var p = encodeURIComponent(self.value);
                        path = Svr.SvrMgr.AttachURL + "?path=" + p + "&formKey="+ formKey + "&service=DownloadImage&mode=1&r=" + Math.random();
                    } else {
                        path = "Resource/" + self.options.image;
                    }
                    var showDiv = $("<div class='ui-img-showDiv'></div>").appendTo(document.body);
                    var tmpImg = $("<img class='ui-img-showImg' src='" + path + "'>").appendTo(document.body);
                    tmpImg.load(function () {
                        tmpImg.css({left: (showDiv.width() - this.width) / 2 + "px", top: (showDiv.height() - this.height) / 2 + "px", width: this.width, height: this.height});
                    });
                    showDiv.click(function () {
                        showDiv.remove();
                        tmpImg.remove();
                    });
                    tmpImg.click(function () {
                        showDiv.remove();
                        tmpImg.remove();
                    });
                    e.stopPropagation();
                });
                if ($.ygrid.msie) {
                    uploadBtn[0].onchange = function (e) {
                        //添加插件操作
                        var btn = this;
                        var file = $(this).val().substring( $(this).val().lastIndexOf("\\") + 1), type = file.split(".")[1];
                        if (self.options.imageCut) {
                            var options = {
                                type: type,
                                callback: function (paras) {
                                    uploadImg($(btn), paras);
                                }
                            };
                            $(btn).photoCut(options);
                        } else {
                            uploadImg($(this), {fileName: file, imgType: type});
                        }
                        $(".opt,.bar", self.yesCom).remove();
//                        e.stopPropagation();
                    };
                }
            }
        }).mouseout(function (e) {
                if (!$(e.relatedTarget).hasClass("opt") && !$(e.relatedTarget).hasClass("bar")) {
                    $(".opt,.bar", self.yesCom).remove();
                }
            });
    }
});/**
 * 表格单元格搜索框组件
 * @type {*}
 */
YIUI.CellEditor.CellTextButton = YIUI.extend(YIUI.CellEditor.CellTextEditor, {
    init: function (opt) {
        this.base(opt);
        this.opt = opt;
    },

    onRender: function (parent) {
        this.base(parent);
        this.yesCom.el.addClass("ui-txtbtn");
        this._btn = $("<button class='btn'>...</button>");
        this._btn.appendTo(this.yesCom.el);
        this._btn.css({height: this.yesCom.getInput().outerHeight() + "px", padding: "0", verticalAlign: "top"});
        this.yesCom.getInput().css({width: (parent.width() - this._btn.outerWidth()) + "px"});
    },

    finishInput: function () {
        return this.yesCom.finishInput();
    },

    install: function () {
        var self = this;
        self.clicking = false;
        this._btn.mousedown(function (e) {
            $(this).addClass("hover");
            self.clicking = true;
        }).mouseup(function (e) {
                $(this).removeClass("hover");
                window.setTimeout(function () {
                    self.getInput().focus();
                }, 50);
            });
        this._btn.bind("click", function () {
            self.opt.click();
        });
        this.getInput().blur(function (e) {
            window.setTimeout(function () {
                if (!self.clicking) {
                    self.yesCom.saveCell();
                } else {
                    self.clicking = false;
                }
            }, 10);
        });
    }
});// layout的命名空间
YIUI.layout = {};
/**
 * 默认布局方式，所有其他布局类的父类。
 * 只是单纯的把每个控件渲染到界面上，不提供位置等信息。
 */
YIUI.layout.AutoLayout = YIUI.extend({

	/**
	 * 是否已经做过beforeDoLayout，避免重复
	 */
	prepared : false,

	init : function(options) {
		$.extend(this, options);
	},
	/** 重新布局子组件的位置 */
	layout: function(panelWidth, panelHeight) {
		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
		var ct = this.container,
			items = ct.items,
			item;
		for(var i=0,len=items.length;i<len;i++) {
			item = items[i];
			var itemWidth = $.getReal("100%",panelWidth), itemHeight;
			if(item.height == -1) {
				itemHeight = item.getHeight();
			} else {
				itemHeight = $.getReal(item.height, panelHeight);
			}
			item.setWidth(itemWidth);
			item.setHeight(itemHeight);
			if(item.hasLayout) {
				item.doLayout(item.getWidth(), item.getHeight());
			}
		}
	},

	/** 此方法为调用接口，完成此layout的所有工作 */
    render : function() {
        var target = this.container.getRenderTarget();
		if(this.prepared || this.beforeRender() !== false) {
			this.prepared = true;
			this.onRender(this.container, target);
			this.afterRender();
		}
    },

    // private
    onRender : function(ct, target){
        this.renderChildren(ct, target);
    },

	/**
	 * 此方法中做一些render前的准备工作，比如为renderChildren提供ItemTarget
	 * 在子类中，如果需要定义各个元素的位置、大小、显示样式，需要新建div，并设置：comp.el = new_div
	 * 例如BorderLayout、TabsLayout
	 */
	beforeRender : function() {
		var ct = this.container,
		target = ct.getRenderTarget();
		var items = ct.items,
		item;
		
		var _div;
		for (var i = 0; i < items.length; i++) {
			item = items[i];
			_div = $("<div></div>").appendTo(target);
			item.doRender(_div);
		}
		
	},

	/**
	 * 此方法中做一些render后的工作，通常是做各区域的宽高设置。
	 */
	afterRender : $.noop,

    /** 检查控件c是否可以渲染到target中 */
    isValidParent : function(c, target){
        return target && c.getOuterEl().parent()[0] == target[0];
    },

    /** 渲染container中的所有控件 */
    renderChildren : function(ct, target){
        var items = ct.items;
        for(var i = 0, len = items.length; i < len; i++) {
            var c = items[i],
				itemTarget = this.getItemTarget(c, i);
            if(c && (!c.rendered/* || !this.isValidParent(c, itemTarget)*/)){
                this.renderItem(c, itemTarget);
            }
        }
    },

	/**
	 * 返回控件comp即将被render到的dom
	 * @param comp
	 * @param index comp在items中的index
	 */
	getItemTarget : function(comp, index) {
		return comp.container || this.container.getRenderTarget();
	},

    /** 把控件c渲染到target中 */
    renderItem : function(c, target){
        if(c && !c.rendered){
            c.doRender(target);
        } else if(c && !this.isValidParent(c, target)){
            target.insertBefore(c.getEl());
            c.container = target;
        }
    },

    /** 设置此layout的container */
    setContainer : function(ct){
        this.container = ct;
    },

	/** 某些layout可能只有一个item是显示的，比如tabs */
	setActiveItem : function(item) {

	},
	
	/** 返回layout需要的所有占位符的宽度 */
	getPlaceholderWidth : function() {
		var ct = this.container;
		var width = 0;
		width = parseInt(ct.getMetaObj().leftPadding || ct.getMetaObj().padding || 0) + parseInt(ct.getMetaObj().rightPadding || ct.getMetaObj().padding || 0);
		return width;
	},
	
	/** 返回layout需要的所有占位符的高度 */
	getPlaceholderHeight : function() {
		var ct = this.container;
		var height = 0;
		height = parseInt(ct.getMetaObj().topPadding || ct.getMetaObj().padding || 0) + parseInt(ct.getMetaObj().bottomPadding || ct.getMetaObj().padding || 0);
		return height;
	}
});
YIUI.layout['auto'] = YIUI.layout.AutoLayout;
YIUI.layout['flow'] = YIUI.layout.AutoLayout;/**
 * 边界布局
 * 把面板分为top、bottom、left、right、center五部分，center必需，其他均可选。
 * center部分的大小根据其他部分大小计算得到。
 * 示例：
 * +-----------------------------------+
 * |                 T                 |
 * +--------+-----------------+--------+
 * |        |                 |        |
 * |   L    |        C        |    R   |
 * |        |                 |        |
 * +--------+-----------------+--------+
 * |                 B                 |
 * +-----------------------------------+
 * var panel = new YIUI.Panel({
 *		layout : 'border',
 *		width : 600,
 *		height : 480,
 *		items : [{
 *			id : 'N',
 *			type : 'panel',
 *			region : 'top',
 *			height : 120
 *		}, {
 *			id : 'W',
 *			type : 'panel',
 *			region : 'left',
 *			width : 120
 *		}, {
 *			id : 'E',
 *			type : 'panel',
 *			region : 'right',
 *			width : 120
 *		}, {
 *			id : 'C',
 *			type : 'panel',
 *			region : 'center',
 *			items : [button, text]
 *		}, {
 *			id : 'S',
 *			type : 'panel',
 *			region : 'bottom',
 *			height : 200
 *		}]
 *	});
 *
 *  panel.render('#ct1');
 */
(function($, undefined) {

var regions = {
	top : true,
	bottom : true,
	left : true,
	right : true,
	center :true
};
YIUI.layout.BorderLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	init : function(options) {
		this.base(options);
	},
	
	layout : function(panelWidth, panelHeight) {
		var ct = this.container,
			top = this.top,
			bottom = this.bottom,
			left = this.left,
			right = this.right,
			center = this.center,
			tmp = [];
		// 这里要用除去padding和border的宽度、高度
		panelWidth -= this.getPlaceholderWidth();
		panelHeight -= this.getPlaceholderHeight();
		var w = panelWidth,
			h = panelHeight,
			centerW = w,
			centerH = h,
			real;
		if(top != undefined) {
			top.setWidth(w);
			if(top.height != -1) {
				real = $.getReal(top.height, h);
				top.setHeight(real);
			} else {
				real = top.getHeight();
			}
			centerH -= real;
			tmp.push(top);
		}
		if(bottom != undefined) {
			bottom.setWidth(w);
			if(bottom.height != -1) {
				real = $.getReal(bottom.height, h);
				bottom.setHeight(real);
			} else {
				real = bottom.getHeight();
			}
			centerH -= real;
			tmp.push(bottom);
		}
		if(left != undefined) {
			if(left.width != -1) {
				real = $.getReal(left.width, w);
				left.setWidth(real);
			} else {
				real = left.getWidth();
			}
			centerW -= real;
			left.setHeight(centerH);
			tmp.push(left);
		}
		if(right != undefined) {
			if(right.width != -1) {
				real = $.getReal(right.width, w);
				right.setWidth(real);
			} else {
				real = right.getWidth();
			}
			centerW -= real;
			right.setHeight(centerH);
			tmp.push(right);
		}
	
		centerW = $.isNumeric(centerW) ? centerW : 'auto';
		centerH = $.isNumeric(centerH) ? centerH : 'auto';
		center.setWidth(centerW);
		center.setHeight(centerH);
		tmp.push(center);
		for (var i = 0, len = tmp.length; i < len; i++) {
			var t = tmp[i];
			if(t.hasLayout) {
				t.doLayout(t.getWidth(), t.getHeight());
			}
		}
	},

	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget();
		var items = ct.items,
			item,
			region;
		for(var i=0,len=items.length; i<len; i++) {
			item = items[i];
			region = item.getMetaObj().region;
			if(regions[region]) {
				this[region] = item;
			}
		}

		var top = this.top,
			bottom = this.bottom,
			left = this.left,
			right = this.right,
			center = this.center;
		if(!center) {
			throw 'No center region defined in borderlayout ' + ct.id;
		}
		ct.el.addClass("ui-blp");
		// borderlayout的最外层设为不显示滚动条，动态适应center的大小
		target.addClass('ui-nooverflow');

		if(top) {
			top.container = this.topEl = $('<div class="item-ct"></div>').attr('id', top.id).appendTo(target);//.height(real);
		}
		var mid = $('<div class="mid"></div>').appendTo(target);
		if(bottom) {
			bottom.container = this.bottomEl = $('<div class="item-ct"></div>').attr('id', bottom.id).appendTo(target);
		}
		if(left) {
			left.container = this.leftEl = $('<div class="item-ct"></div>').attr('id', left.id).appendTo(mid);
		}

		center.container = this.centerEl = $('<div class="item-ct"></div>').attr('id', center.id).appendTo(mid);

		if(right) {
			right.container = this.rightEl = $('<div class="item-ct"></div>').attr('id', right.id).appendTo(mid);
		}

		this.midEl = mid;
	},
	
	/**
	 * beforeLayout中已经设置了各个面板的el
	 */
	isValidParent : function(c, target) {
		return true;
	}
	
});
YIUI.layout['BorderLayout'] = YIUI.layout.BorderLayout;
})(jQuery);/**
 * 列式布局
 * 把面板分为多行，每行平均分为12列，根据每个item的row判断在第几行，col判断从第几列开始，span判断占几列。
 */
YIUI.layout.ColumnLayout = YIUI.extend(YIUI.layout.AutoLayout, {

	/**
	 * 外层div样式
	 * @private
	 */
	ctCls : 'container-fluid',

	/**
	 * 每列div样式前缀
	 * @private
	 */
	colClsPrefix : 'col-xs-',
	
	layout: function(panelWidth, panelHeight) {
		var ct = this.container,
			items = ct.items,
			item,
			rowEl,
			rows,
			row;
		rows = $(".row", ct.el).data("height", 0);
		panelWidth -= this.getPlaceholderWidth();
		panelHeight -= this.getPlaceholderHeight();
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i];
			var height = 0, 
				width = 0,
				span = item.getMetaObj().colspan || 1;
			if(item.height == -1) {
				height = item.getHeight();
			} else {
				height =  $.getReal(item.height, panelHeight);
			}

			width =  $.getReal(item.width, panelWidth);
			if(width == "auto") width = panelWidth;
			var realW = span/12*width;
			item.setWidth(parseInt(realW));
			item.container.width(parseInt(realW));
			rowEl = item.container.parent();
			if(rowEl.data("height") < height) {
				rowEl.data("height", height);
				item.setHeight(height);
				item.container.height(height);
			} else {
				item.setHeight(rowEl.data("height"));
				item.container.height(rowEl.data("height"));
			}
			if(item.hasLayout) {
				item.doLayout(item.getWidth(), item.getHeight());
			}
		}
		for (var i = 0, len = rows.length; i < len; i++) {
			row = rows.eq(i);
			row.height(row.data("height"));
		}
	},

	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			item,
			row,
			col,
			span,
			cells = [],
			tmp = {row: 0, len: 0};
		// 根据items中的row、col、span计算出布局
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i];
			row = item.getMetaObj().y;
			col = item.getMetaObj().x
			span = item.getMetaObj().colspan || 1;
			
			if(tmp.row != row) {
				tmp.row = row;
				tmp.len = 0;
			}
			if(tmp.row == row && tmp.len >= 12 || col > 11 || col + span > 12) {
//				return;
			}
			tmp.len = col+span;
			cells[row] = cells[row] || [];
			cells[row][col] = item;
		}
		
		this.rows = cells;

		var realTarget = $('<div></div>').addClass(this.ctCls)/*.appendTo(target)*/,
			rowEl,
			columns;
		for(var i= 0,len=cells.length;i<len;i++) {
			columns = cells[i];
			if(!columns) continue;
			rowEl = $('<div></div>').addClass('row').appendTo(target);
			for(var j= 0,len2=columns.length;j<len2;j++) {
				item = columns[j];
				if(item) {
					span = item.getMetaObj().colspan || 1;
					// 设置各个item的el，不用重写getItemTarget
					item.container = $('<div></div>').attr('col', j).attr('span',span).addClass(this.colClsPrefix+span).appendTo(rowEl);
				}
			}
		}
		// 解除cells对items的引用
		for(var i= 0,len=cells.length;i<len;i++) {
			columns = cells[i];
			if(!columns) {
				delete cells[i];
				continue;
			}
			for(var j= 0,len2=columns.length;j<len2;j++) {
				delete columns[j];
			}
			delete cells[i];
		}
		delete cells;

		// 插入定位所需空白列
		for(var i= 0,rows=target.children(),len=rows.length;i<len;i++) {
			var row = rows[i];
			for(var j= 0,columns=row.childNodes,len2=columns.length;j<len2;j++) {
				var space;
				if(j==0 && $(columns[0]).attr('col') > 0) {
					space = $(columns[0]).attr('col') - 0;
					$('<div></div>').attr('col', 0).attr('span',space).addClass(this.colClsPrefix+space).insertBefore($(columns[0]));
				} else {
					space = $(columns[j+1]).attr('col') - $(columns[j]).attr('col') - $(columns[j]).attr('span');
					if(space > 0) {
						var col = parseInt($(columns[j]).attr('col')) + parseInt($(columns[j]).attr('span')) + 1;
						$('<div></div>').attr('col', col).attr('span',space).addClass(this.colClsPrefix+space).insertAfter($(columns[j]));
					}
				}
			}
		}
	}

});
YIUI.layout['ColumnLayout'] = YIUI.layout.ColumnLayout;/**
 * 响应式列式布局，仅用于网站页面布局。
 * 把面板分为多行，每行平均分为12列，根据每个item的span来判断占几列。
 */
YIUI.layout.FluidColumnLayout = YIUI.extend(YIUI.layout.AutoLayout, {

	/**
	 * 是否充满整个浏览器
	 */
	fill : false,

	/**
	 * 每列div样式前缀
	 * @private
	 */
	colClsPrefix : 'col-md-',

	init : function(options) {
		this.base(options);

		if(!this.fill) {
			this.ctCls = 'container';
		}
	}
});
YIUI.layout['FluidLayout'] = YIUI.layout.FluidColumnLayout;/**
 * 网格布局
 * 使用<table></table>来实现布局。
 * 根据container的widths、heights来确定列数、行数、列宽、行高。
 * 根据container的rowGap columnGap设置行间距与列间距
 * 根据container.items中的x、y来确定控件的位置(第几列、第几行)，colspan、rowspan来确定控件的大小(占几列、占几行)。
 * 示例：
 * +--------+-----------------+
 * |        |   B             |
 * |   A    |--------+--------|
 * |        |   C    |   D    |
 * +--------+--------+--------+
 * var panel = new YIUI.Panel({
 * 		layout : 'grid',
 * 		widths : [100, 100, 100],
 * 		heights : [30, 30],
 * 		rowGap : 10,
 * 		columnGap : 10,
 * 		items : [{
 * 		 	// A
 * 		 	x : 0,
 * 		 	y : 0,
 *			rowspan : 2
 * 		}, {
 * 		 	// B
 * 		 	x : 1,
 * 		 	y : 0,
 *			colspan : 2
 * 		}, {
 * 		 	// C
 * 		 	x : 1,
 * 		 	y : 1
 * 		}, {
 * 		 	// D
 * 		 	x : 2,
 * 		 	y : 1
 * 		}]
 * });
 * panel.render('#ct1');
 */
YIUI.layout.GridLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	
	layout : function(panelWidth, panelHeight) {
		var ct = this.container,
			metaObj = ct.getMetaObj(),
			target = ct.getRenderTarget(),
			rowGap = metaObj.rowGap || 0,
			columnGap = metaObj.columnGap || 0,
			widths = ct.widths,
			minWidths = ct.minWidths,
			heights = ct.heights,
            table = this.table,
			tr,
			td;
		if(!widths || !heights) {
            YIUI.ViewException.throwException(YIUI.ViewException.NO_WIDTH_OR_HEIGHT);
		}

		panelHeight -= rowGap * (heights.length - 1) + this.getPlaceholderHeight();
		panelWidth -= columnGap * (widths.length - 1) + this.getPlaceholderWidth();
		var realWidths = this.calcRealValues(panelWidth, widths);
		var realW = -1;
		var realHeights = this.calcRealValues(panelHeight, heights);
		
		for(var i=0; i<realHeights.length; i++) {
//			tr = $('tr[row='+i+']', table).height(realHeights[i]);
			tr = $(table[0].rows[i+1]).height(realHeights[i]);
		}
		var tr_f = $('tr.first', table);
		for(var j=0; j<realWidths.length; j++) {
			td = $(tr_f[0].cells[j]);
			var x = td.attr("col");
			realW = this.getRealWidth(minWidths[x], realWidths[x]);
			td.width(realW);
			if(ct.oddColumnColor && j%2 == 0) {
				td.css("background-color", ct.oddColumnColor);
			}
		}
		
		var items = ct.items,
			item,
			row,
			col,
			colspan,
			rowspan;
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i];
//			if(!item.getMetaObj().visible) continue;
			col = item.getMetaObj().x;
			row = item.getMetaObj().y;
			colspan = item.getMetaObj().colspan || 1;
			rowspan = item.getMetaObj().rowspan || 1;
			
			var realWidth = this.getRealWidth(minWidths[col], realWidths[col]),
				realHeight = realHeights[row];
			if(colspan > 1) {
				for (var j = 1; j < colspan; j++) {
					realW = this.getRealWidth(minWidths[col + j], realWidths[col + j]);
					realWidth += realW + columnGap;
				}
			}
			if(rowspan > 1) {
				for (var j = 1; j < rowspan; j++) {
					realHeight += realHeights[row + j] + rowGap;
				}
			}
			if(row > 0) {
				item.topMargin = rowGap;
				item.getOuterEl().css("margin-top", rowGap+"px");
			}
			if(col > 0) {
				item.leftMargin = rowGap;
				item.getOuterEl().css("margin-left", columnGap+"px");
			}
			item.setWidth(realWidth);
            item.setHeight(realHeight);
			if(item.hasLayout){
				item.doLayout(item.getWidth(), item.getHeight());
			}
		}
	},
	
	getRealWidth: function(minWidth, width){
		var realWidth = width;
		if(minWidth != -1 && minWidth > width) {
			realWidth = minWidth;
		}
		return realWidth;
	},
	
	beforeRender : function() {
		var ct = this.container,
			metaObj = ct.getMetaObj(),
			target = ct.getRenderTarget(),
			widths = ct.widths,
			heights = ct.heights;
		if(!widths || !heights) {
            YIUI.ViewException.throwException(YIUI.ViewException.NO_WIDTH_OR_HEIGHT);
		}
		
		var realWidths = this.calcRealValues(ct.getWidth(), widths);
		var realHeights = this.calcRealValues(ct.getHeight(), heights);
		var table = $('<table class="layout"></table>').attr({border : 0,cellpadding : 0, cellspacing : 0}).appendTo(target),
			firstRow = true,
			rowGap = metaObj.rowGap || 0,
			tr,
			td;
		this.table = table;

		var tblH = 0, tr_f;
		for(var i=0;i<realHeights.length;i++) {
			if(i == 0) {
				tr_f = $('<tr></tr>').addClass("first").appendTo(table);
			}
			tr = $('<tr row="'+i+'"></tr>').appendTo(table);
			for(var j=0;j<realWidths.length;j++) {
				if(i == 0) {
					$('<td col="'+j+'"></td>').appendTo(tr_f);
				}
				td = $('<td col="'+j+'"></td>').appendTo(tr);
			}
			tblH += realHeights[i];
		}
		tblH += (realHeights.length - 1) * rowGap;
		table.css("height", tblH);
		var items = ct.items,
			item,
			row,
			col,
			colspan,
			rowspan;
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i];
			col = item.getMetaObj().x;
			row = item.getMetaObj().y;
			colspan = item.getMetaObj().colspan || 1;
			rowspan = item.getMetaObj().rowspan || 1;
//			tr = $('tr[row='+row+']', table);
			tr = $(table[0].rows[row+1]);
			td = this.getCell(row, col);
			if(!item.getMetaObj().visible && td.attr("colspan")) {
				continue;
			}
			td.nextAll('td:lt('+(colspan-1)+')').remove();
			tr.nextAll('tr:lt('+(rowspan-1)+')').each(function() {
				var td = $('td[col='+col+']', $(this));
				td.nextAll('td:lt('+(colspan-1)+')').remove();
				td.remove();
			});
			td.attr('colspan', colspan).attr('rowspan', rowspan);
			item.width = realWidths[col];
			item.height = realHeights[row];
		}
	},
	
	// private 根据比例计算固定宽度高度
	calcRealValues : function(total, valueWithPercentage) {
		var result = [], 
			totalPercentage = 0,
			totalPercentageValue,
			len = valueWithPercentage.length,
			percentages = [],
			realTotalValue = 0,
			i, tmp;
		for (i = 0; i < len; i++) {
			tmp = valueWithPercentage[i];
			if($.isPercentage(tmp)) {
				tmp = parseInt(tmp, 10) / 100;
				totalPercentage += tmp;
				percentages.push(i);
			} else if($.isNumeric(tmp) && tmp < 1) {
				percentages.push(i);
			} else if(tmp == "auto") {
				percentages.push(i);
			} else if(tmp == "pref") {
				percentages.push(i);
			} else {
				realTotalValue += tmp;
			}
			result[i] = tmp;
		}
		if(realTotalValue <= total) {
			totalPercentageValue = total - realTotalValue;
			if (totalPercentage == 0)
				totalPercentage = 1;
			len = percentages.length;
			for (i = 0; i < len; i++) {
				if ((tmp = result[percentages[i]]) > 0) {
					result[percentages[i]] = Math.floor(totalPercentageValue * tmp );
					realTotalValue += result[percentages[i]];
				} else if((tmp = result[percentages[i]]) == "auto") {
					result[percentages[i]] = Math.floor(totalPercentageValue / len);
				} else if ((tmp = result[percentages[i]]) == "pref") {
					var item, rowspan, maxHeight = -1;
					for (var j = 0, length = this.container.items.length; j < length; j++) {
						item = this.container.items[j];
						var height = item.height==-1?item.getHeight():item.height;
						rowspan = item.rowspan || 1;
						if(item.y == percentages[i] && rowspan == 1 && height > maxHeight) {
							maxHeight = height;
						}
					}
					result[percentages[i]] = maxHeight;
				}
			}
		} 
		return result;
	},

	getCell : function(row, col) {
//		var tr = $('tr[row='+row+']', this.table);
		var tr = $(this.table[0].rows[row+1]);
		return $('td[col='+col+']', tr);
	},

	/**
	 * 返回控件comp即将被render到的dom
	 * @param comp
	 * @param index comp在items中的index
	 */
	getItemTarget : function(comp, index) {
		return this.getCell(comp.getMetaObj().y, comp.getMetaObj().x);
	}
});
YIUI.layout['GridLayout'] = YIUI.layout.GridLayout;/**
 * TAB布局
 */
YIUI.layout.TabsLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	layout : function(panelWidth, panelHeight) {
		var ct = this.container;
		var body = $(ct.el.children()[1]),
			overflow = body.css('overflow');

		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
        if(ct.items && ct.items.length != 0) {
			var ul = $(ct.el.children("ul")),
				body = $(ct.el.children(".tab-body"));
			var tabPosition = ct.tabPosition;
			switch (tabPosition) {
				case YIUI.DirectionType.TOP: 
				case YIUI.DirectionType.BOTTOM: 
					ul.width(panelWidth);
					// 设置body高度，使滚动条局限在body里，不影响TAB header
					body.height(panelHeight - ul.outerHeight(true));
					body.width(panelWidth);
					break;
				case YIUI.DirectionType.LEFT: 
				case YIUI.DirectionType.RIGHT: 
					body.height(panelHeight);
					var ul_h = ul.outerHeight(true);
					if($.browser.isIE) {
						ul_h = ul.outerWidth();
					}
					body.width(panelWidth - ul_h);
					ul.width(panelHeight);
					break;
			}
			
			tab = ct.items[ct.activeTab];
			if(tab) {
				tab.setWidth(body.width());
				tab.setHeight(body.height());
				if(tab.hasLayout) {
					tab.doLayout(tab.getWidth(), tab.getHeight());
				}
			}
		}
	},
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			item;

//		var realTarget = $('<div></div>').addClass("ui-tabs").appendTo(target),
		// TAB header
		var ul = $("<ul class='ui-tabs-nav tab-head'/>");
		// 添加body使滚动条不影响header
		var body = $("<div class='tab-body'>");
		var tabPosition = ct.tabPosition;
		switch (tabPosition) {
			case YIUI.DirectionType.TOP: 
				ul.addClass("top");
				ul.appendTo(target);
				body.appendTo(target);
				break;
			case YIUI.DirectionType.BOTTOM: 
				ul.addClass("bottom");
				body.appendTo(target);
				ul.appendTo(target);
				break;
			case YIUI.DirectionType.LEFT: 
				ul.addClass("left");
				body.appendTo(target);
				ul.appendTo(target);
				body.css("float", "right");
				break;
			case YIUI.DirectionType.RIGHT: 
				ul.addClass("right");
				body.appendTo(target);
				ul.appendTo(target);
				body.css("float", "left");
				break;
		}

		for(var i=0,len=items.length; i<len; i++) {
			item = items[i];
			item.id = item.id || YIUI.allotId();
			var tabID = "tab_" + item.id;
			var title = item.getMetaObj().title;
			if(!title) {
				title = item.caption;
			}
			var _li = $(YIUI.Panel.TabPanel.prototype.tabTemplate.replace(/#\{href\}/g, "#" + tabID).replace(/#\{title\}/g, title)).appendTo(ul);
			_li.addClass("ui-state-default ui-corner-top")
				.attr("role", "tab").attr("aria-controls", tabID);
			$("[href=#"+tabID+"]", _li).addClass("ui-tans-anchor").attr("role", "presentation");
			$("[href=#"+tabID+"] label", _li).addClass("ui-anchor-label");
			var _div = $('<div>').attr('id', tabID).appendTo(body);
			item.container = _div;
			_div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom")
					.attr("role", "tabpanel");
			
			if(ct.activeTab < 0 && item.visible) {
				ct.selectedTab = _li;
				ct.activeTab = i;
				_li.toggleClass("aria-selected");
				_div.toggleClass("aria-show");
				_div.show();
			} else {
				_div.hide();
			}

			if(!item.visible) {
				_li.css("display", "none");
			}
		}
	},

	afterRender : function() {
		var container = this.container;
		var body = $(container.el.children()[1]),
			overflow = body.css('overflow');
	},
	
	/**
	 * beforeLayout中已经设置了各个面板的el
	 */
	isValidParent : function(c, target) {
		return true;
	}
});
YIUI.layout['TabLayout'] = YIUI.layout.TabsLayout;/**
 * TAB布局
 */
YIUI.layout.Tab = YIUI.extend(YIUI.layout.AutoLayout, {
	layout : function(panelWidth, panelHeight) {
		var ct = this.container;
		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
        if(ct.items && ct.items.length != 0) {
			var ul = $("ul.ui-tabs-nav", ct.el),
				body = $(ct.el.children(".ui-tabs-body"));
			
//			ct._dropView.css("max-height", document.body.clientHeight - ct._dropView.position().top);
			
	    	body.width(panelWidth);
			// 设置body高度，使滚动条局限在body里，不影响TAB header
			body.height(panelHeight - ul.outerHeight(true));
	    	$(".ui-tabs-header", this.el).width(panelWidth - 30);
			
			var tab = ct.items[ct.activeTab];
			if(tab) {
				tab.setWidth(body.width());
				tab.setHeight(body.height());
				if(tab.hasLayout) {
					tab.doLayout(tab.getWidth(), tab.getHeight());
				}
				
				if(ct.selectedTab) {
					$(".ui-tabs-header", ct.el).scrollLeft(ct.selectedTab.position().left - $(".ui-tabs-header", ct.el).width() + ct.selectedTab.width());
				}
			}
		}
        
        ct.setDropBtnView();
        ct.setTabListColor();
	},
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			item;

//		var realTarget = $('<div></div>').addClass("ui-tabs").appendTo(target),
		// TAB header
		var ul = $('<ul/>');
		var header = $("<div></div>").addClass("ui-tabs-header").appendTo(target).append(ul);
		
		var tabs_list = ct._dropBtn = $("<span></span>").addClass("ui-tabs dropdownBtn").appendTo(target);
		ct._dropView = $('<div><ul/></div>').addClass('ui-tabs tabs-list');
		$(document.body).append(ct._dropView);
		
		ul.addClass("ui-tabs-nav ui-corner-all");
		ul.attr("role", "tablist");
		

		// 添加body使滚动条不影响header
		var body = $('<div>').addClass('ui-tabs-body').appendTo(target);

		for(var i=0,len=items.length; i<len; i++) {
			item = items[i];
			item.id = item.id || YIUI.allotId();
			if(!item.title) {
				item.title = item.caption;
			}
			var _li = $(YIUI.Panel.TabPanel.prototype.tabTemplate.replace(/#\{href\}/g, "#" + item.id).replace(/#\{title\}/g, item.title)).appendTo(ul);
			if(i == 0) {
				ct.selectedTab = _li;
				ct.activeTab = 0;
			} else {
			}
			_li.addClass("ui-state-default ui-corner-top")
				.attr("role", "tab").attr("aria-controls", item.id);
			$("[href=#"+item.id+"]", _li).addClass("ui-tans-anchor").attr("role", "presentation");
			$("[href=#"+item.id+"] label", _li).addClass("ui-anchor-label");
			var _div = $('<div>').attr('id', item.id).appendTo(body);
			item.container = _div;
			_div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom")
					.attr("role", "tabpanel");
			
			if(i == 0) {
				_li.toggleClass("aria-selected");
				_div.toggleClass("aria-show");
			}

		}
	},

	afterRender : function() {
		var container = this.container;
		var body = $(container.el.children()[1]),
			overflow = body.css('overflow');
	},
	
	/**
	 * beforeLayout中已经设置了各个面板的el
	 */
	isValidParent : function(c, target) {
		return true;
	}
});
YIUI.layout['tab'] = YIUI.layout.Tab;
/**
 * 分割布局
 * 把面板分为多行或多列，可支持拖动分隔条
 * +---------------+      +---+- --- -+---+
 * |               |      |   |       |   |
 * +---------------+      |   |       |   |
 *                        |   |       |   |
 * |      ...      |      |   |  ...  |   |
 *                    or  |   |       |   |
 * +---------------+      |   |       |   |
 * |               |      |   |       |   |
 * +---------------+      +---+- --- -+---+
 */
(function($, undefined) {
	
YIUI.layout.SplitLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	
	/**
	 * 分隔条尺寸
	 */
	resizerSize : 4,

	/**
	 * 拖放时每个区域的最小尺寸
	 */
	regionMinSize : 0,
	
	init : function(options) {
		this.base(options);

		// 用于存储拖动分隔条时的信息
		this.resize = {};
	},

	layout: function(panelWidth, panelHeight) {
		var ct = this.container,
		items = ct.items,
		item,
		children = ct.el.children(".spl-item"),
		resizer = ct.el.children(".spl-resizer"),
		vertical = ct.getMetaObj().orientation === 'vertical',
		splits = ct.splitSizes;
		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
		for (var i = 0, len = resizer.length; i < len; i++) {
			if(vertical) {
				resizer.eq(i).width(panelWidth);
			} else {
				resizer.eq(i).height(panelHeight);
			}
		}
		for (var i = 0, len = children.length; i < len; i++) {
			var child = children.eq(i);
			if(vertical) {
				child.height($.getReal(splits[i].size, (panelHeight - this.getPlaceholderSize())));
			} else {
				child.width($.getReal(splits[i].size, (panelWidth - this.getPlaceholderSize())));
			}
		}
		// 如果控件高度或宽度未设置，默认充满该Split区域
		for (var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			if(vertical) {
				item.setWidth(panelWidth);
				item.setHeight(item.container.height());
			} else {
				item.setWidth(item.container.width());
				item.setHeight(panelHeight);
			}
			if(item.hasLayout) {
				item.doLayout(item.getWidth(), item.getHeight());
			}
		}
	},
	
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			splits = ct.splitSizes,
			vertical = ct.getMetaObj().orientation === 'vertical',
			split,
			item,
			_div;
		target.css('overflow', 'hidden');
		for(var i= 0,len=splits.length;i<len;i++) {
			split = splits[i];
			item = items[i];
			_div = $('<div class="spl-item"></div>').appendTo(target);
			if(item) {
				item.container = _div;
			}
			if(i < len - 1) {
				$('<div class="spl-resizer"></div>').addClass(vertical ? 'resizer-h' : 'resizer-v').attr('region', i).appendTo(target);
			}
			if(vertical) {
				_div.addClass('v-item');
			} else {
				_div.addClass('h-item');
			}
		}
		
		
	},
	
	/** 返回分割面板中行或列的固定值大小 */
	getPlaceholderSize : function() {
		var placeholderSize = 0,
			ct = this.container,
			splits = ct.splitSizes;
		for(var i= 0,len=splits.length;i<len;i++) {
			if(!$.isPercentage(splits[i].size) && splits[i].size > 0){
				placeholderSize += splits[i].size;
			}
		}
		return placeholderSize;
	},
	afterRender : function() {
		this.base();
	},
	
	/** 返回layout需要的所有占位符的宽度 */
	getPlaceholderWidth : function() {
		var width = this.base();
		var ct = this.container,
			items = ct.items,
			vertical = ct.getMetaObj().orientation === 'vertical';
		width += (vertical ? 0 : this.resizerSize * (items.length - 1));
		return width;
	},
	
	/** 返回layout需要的所有占位符的高度 */
	getPlaceholderHeight : function() {
		var height = this.base();
		var ct = this.container,
			items = ct.items,
			vertical = ct.getMetaObj().orientation === 'vertical';
		height += (vertical ? this.resizerSize * (items.length - 1) : 0);
		return height;
	}
});
YIUI.layout['SplitLayout'] = YIUI.layout.SplitLayout;

})(jQuery);/**
 * var panel = new YIUI.Panel({
 *		layout : 'flexflow',
 *		height : 480,
 *		items : [{
 *			row : 0,
 *			type : 'panel',
 *			height : 120
 *		}, {
 *			row : 1,
 *			type : 'panel',
 *			height : 40%
 *		}, {
 *			row : 2,
 *			type : 'panel',
 *			height : 60%
 *		}, {
 *			row : 3,
 *			type : 'panel',
 *			height : 220
 *			items : [button, text]
 *		}]
 *	});
 *
 *  panel.render('#ct1');
 */

YIUI.layout.FlexFlowLayout = YIUI.extend(YIUI.layout.AutoLayout,{
	
	layout : function(panelWidth, panelHeight) {
		var ct = this.container,
		items = ct.items,
		item;
		panelWidth -= this.getPlaceholderWidth();
		panelHeight -= this.getPlaceholderHeight();
		for(var i=0,len=items.length;i<len;i++) {
			item = items[i];
			item.setWidth(panelWidth);
			item.setHeight($.getReal(item.height, (panelHeight - this.getPlaceholderSize())));
			if(item.hasLayout) {
				item.doLayout(item.getWidth(), item.getHeight());
			}
		}
	},
	
	/** 返回flexflowlayout面板中所有行高度的固定值 */
	getPlaceholderSize : function() {
		var placeholderSize = 0,
			ct = this.container,
			items = ct.items,
			item;
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i];
			if($.isNumeric(item.height) /*&& item.height > 0*/){
				placeholderSize += (item.height == -1 ? item.getHeight() : item.height);
			} else if(item.height == "pref") {
				placeholderSize += item.getHeight();
			}
		}
		return placeholderSize;
	}

});

YIUI.layout['FlexFlowLayout'] = YIUI.layout.FlexFlowLayout;
/**
 * 流布局面板
 */
YIUI.layout.FlowLayout = YIUI.extend(YIUI.layout.AutoLayout, {

});
YIUI.layout['FlowLayout'] = YIUI.layout.FlowLayout;/**
 * table-cell布局
 * 使用display: table-cell;来实现布局。
 * 根据container的widths、heights来确定列数、行数、列宽、行高，可以是固定值、百分比。
 * 根据container.items中的x、y来确定控件的位置(第几列、第几行)，colspan、rowspan来确定控件的大小(占几列、占几行)。
 * 示例：
 * +--------+-----------------+
 * |        |   B             |
 * |   A    |--------+--------|
 * |        |   C    |   D    |
 * +--------+--------+--------+
 * var panel = new YIUI.Panel({
 * 		layout : 'table',
 * 		widths : [100, '60%', '40%'],
 * 		heights : [30, 30],
 * 		items : [{
 * 		 	// A
 * 		 	x : 0,
 * 		 	y : 0,
 *			rowspan : 2
 * 		}, {
 * 		 	// B
 * 		 	x : 1,
 * 		 	y : 0,
 *			colspan : 2
 * 		}, {
 * 		 	// C
 * 		 	x : 1,
 * 		 	y : 1
 * 		}, {
 * 		 	// D
 * 		 	x : 2,
 * 		 	y : 1
 * 		}]
 * });
 * panel.render('#ct1');
 */
YIUI.layout.TableLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			widths = ct.widths,
			heights = ct.heights;
		if(!widths || !heights) {
			throw 'widths or heights not defined!';
		}

		// 计算百分比
		var realWidths = YIUI.layout.GridLayout.prototype.calcRealValues.call(this, ct.getWidth(), widths);
		var realHeights = YIUI.layout.GridLayout.prototype.calcRealValues.call(this, ct.getHeight(), heights);
		var table = $('<div class="table"></div>').appendTo(target),
			firstRow = true,
			total = 0;
		this.table = table;

		for(var i=0;i<realHeights.length;i++) {
			var row = $('<div class="table-row" row="'+i+'"></div>').appendTo(table);
			for(var j=0;j<realWidths.length;j++) {
				var cell = $('<div col="'+j+'"></td>').addClass('table-cell').css({height:realHeights[i]}).appendTo(row);
				if(firstRow) {
					total += realWidths[j];
					cell.css({width:realWidths[j],'max-width':realWidths[j]});
				}
			}
			firstRow = false;
		}
		// 如果所有列宽总和小于table总宽度，为防止各列自动扩展宽度，最后面再加一列占位
		if(total < ct.getWidth()) {
			$(table.children(null,'.table-row')[0]).append($('<div class="table-cell" style="visibility:hidden;"></div>').css('width', ct.getWidth()-total));
		}

		var items = ct.items,
			rows = table[0].childNodes,
			cols = rows[0].childNodes;
		for(var i= 0,len=items.length;i<len;i++) {
			var item = items[i],
				x = item.x,
				y = item.y,
				colspan = item.colspan || 1,
				rowspan = item.rowspan || 1,
				cell = this.getCell(y, x);
			if(colspan == 1 && rowspan == 1) {
				cell.attr('pos', y+'_'+x);
			} else {
				var width = 0,height= 0,left= 0,top=0;
				for(var j=0;j<colspan;j++) {
					width += realWidths[x+j];
				}
				for(var j=0;j<rowspan;j++) {
					height += realHeights[y+j];
				}
				for(var j=rowspan-1;j>=0;j--) {
					for(var k=colspan-1;k>=0;k--) {
						if(j==0 && k==0) continue;
						this.getCell(y+j, x+k).css('visibility', 'hidden');
					}
				}
				
				cell.css({position:'absolute',width:width,height:height}).attr('pos', y+'_'+x);
			}

			item.width = cell.width();
			item.height = cell.height();
		}
	},
	
	afterRender : function() {
		
	},

	// private 根据行、列获取某个cell DOM
	getCell : function(row, col) {
		return $(this.table[0].childNodes[row].childNodes[col]);
	},

	/**
	 * 返回控件comp即将被render到的dom
	 * @param comp
	 * @param index comp在items中的index
	 */
	getItemTarget : function(comp, index) {
		return $('div[pos='+comp.y+'_'+comp.x+']');
	}
});
YIUI.layout['TableLayout'] = YIUI.layout.TableLayout;YIUI.layout.FluidTableLayout = YIUI.extend(YIUI.layout.AutoLayout, {
	layout : function(panelWidth, panelHeight) {
		var ct = this.container,
		target = ct.getRenderTarget(),
		repeatCount = ct.repeatCount || 1,
		items = ct.items,
		rowHeight = ct.rowHeight,
		rowGap = ct.rowGap || 0,
		columnGap = ct.columnGap || 0,
		repeatGap = ct.repeatGap || 0,
		widths = ct.widths;
		if(!widths) {
			throw 'widths is undefined';
		}
		
		var table = this.table,
			firstRow = true,
			tr,
			td,
			count = 0;
		for (var i = 0; i < items.length; i++) {
			if(items[i].getMetaObj().buddyKey) {
				count++;
			}
		}
		count = items.length - 2*count;
		var rows = (items.length + count) / 2;
		if(rows % repeatCount == 0) {
			rows = rows / repeatCount;
		} else {
			rows = parseInt(rows / repeatCount ) + 1;
		}
		var cols = 2 * repeatCount;

		panelWidth -= widths.length * columnGap * repeatCount + (repeatCount - 1) * repeatGap + this.getPlaceholderWidth();
		panelHeight -= rows * rowHeight + this.getPlaceholderHeight();
		var parentWidth = this.getRealWidth(widths, panelWidth / repeatCount);
		var item;
		for (var i = 0; i < rows; i++) {
			tr = $(table[0].rows[i]).height(rowHeight);
			for (var j = 0; j < cols; j++) {
				td = $(tr[0].cells[j]);
				var $tdW = $.getReal(widths[j % 2 == 0 ? 0 : 1], parentWidth);
				if(firstRow) {
					td.width($tdW);
				}
				if(td.children().length > 0) {
					var idx = td.attr("index");
					item = items[idx];
					item.setWidth($tdW);
					item.setHeight(rowHeight);
					
					item.getOuterEl().css("margin-left", "0");
					item.getOuterEl().css("margin-top", "0");
					
					if(columnGap > 0 && !item.hasBuddyKey) {
						item.getOuterEl().css("margin-left", columnGap + "px");
					}
					if(repeatCount > 1 && j > 1) {
						if(item.hasBuddyKey) {
							item.getOuterEl().css("margin-left", repeatGap + "px");
						}
					} 
					if(i > 0) {
						item.getOuterEl().css("margin-top", rowGap + "px");
					}
					if(item.hasLayout){
						item.doLayout(item.getWidth(), item.getHeight());
					}
				}
			}
			firstRow = false;
		}
		
	},
	
	getRealWidth: function(widths, parentWidth) {
		var realWidth = 0;
		for (var i = 0; i < widths.length; i++) {
			if($.isNumeric(widths[i]) && widths[i] > 0) {
				realWidth += widths[i];
			}
		}
		return parentWidth - realWidth;
	},
	
	repaint: function() {
		this.reset();
		var ct = this.container;
		this.layout(ct.getWidth(), ct.getHeight());
	},
	
	reset: function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			repeatCount = ct.repeatCount || 1,
			items = ct.items,
			rowHeight = ct.rowHeight,
			widths = ct.widths;
		if(!widths) {
			throw 'widths is undefined';
		}
		
		var table = this.table,
			tr,
			td;
		
		var count = 0;
		for (var i = 0; i < items.length; i++) {
			if(items[i].getMetaObj().buddyKey) {
				count++;
			}
		}
		count = items.length - 2*count;
		
		var rows = (items.length + count) / 2;
		if(rows % repeatCount == 0) {
			rows = rows / repeatCount;
		} else {
			rows = parseInt(rows / repeatCount ) + 1;
		}
		
		for (var i = 0; i < items.length; i++) {
			item = items[i];
			if(item.getMetaObj().buddyKey != undefined) {
				for (var j = 0; j < items.length; j++) {
					var _item = items[j];
					if(_item.getMetaObj().key == item.getMetaObj().buddyKey) {
						_item.rgtVisible = item.visible;
						_item.hasBuddyKey = true;
						item.leftVisible = _item.visible;
						continue;
					}
				}
			}
		}
		
		var _index = 0;
		var vItems = [];
		for (var i = 0; i < rows; i++) {
			tr = $("tr[row="+i+"]", table);
			for (var j = 0; j < (2 * repeatCount); j++) {
				var item = items[_index];
				var idx = _index;
				if(item) {
					_index++;
					
					if(item.hasBuddyKey) {
						//左
						if(!item.rgtVisible) {
							j--;
							vItems.push(item);
						}
					} else {
						if(item.visible) {
							//右
							if(!item.getMetaObj().buddyKey) {
								//有伙伴组件
								j++;
							}
						} else {
							//右
							if(item.getMetaObj().buddyKey) {
								if(!item.visible) {
									j--;
									vItems.push(item);
								}
							} else {
								j--;
							}
							continue;
						}
					}
					
					td = $("td[col="+j+"]", tr);
					td.attr("index", idx);
					item.container = td;
					item.el.appendTo(td);
//					if(item.width == -1) {
						item.width = widths[j % 2 == 0 ? 0 : 1];
//					}
					item.height = rowHeight;

				}
			}
		}
		var hRows = vItems.length/repeatCount/2 + rows;
		$("tr[row]", table).slice(rows).remove();
		for (var i = rows; i < hRows; i++) {
			tr = $("<tr row="+i+"/>").appendTo(table);
			for (var j = 0, len = vItems.length; j < len; j++) {
				var item = vItems[j];
				td = $("<td/>").appendTo(tr);
				item.el.appendTo(td);
			}
			tr.hide();
		}
	},
	
	beforeRender: function() {
		var ct = this.container,
		target = ct.getRenderTarget(),
		repeatCount = ct.repeatCount || 1,
		items = ct.items,
		rowHeight = ct.rowHeight,
		widths = ct.widths;
		if(!widths) {
			throw 'widths is undefined';
		}
		
		var table = $('<table class="layout"></table>').attr({border : 0,cellpadding : 0, cellspacing : 0}).appendTo(target),
		tr,
		td;
		this.table = table;
		
		var count = 0;
		for (var i = 0; i < items.length; i++) {
			if(items[i].getMetaObj().buddyKey) {
				count++;
			}
		}
		count = items.length - 2*count;
		
		var rows = (items.length + count) / 2;
		if(rows % repeatCount == 0) {
			rows = rows / repeatCount;
		} else {
			rows = parseInt(rows / repeatCount ) + 1;
		}
		
		for (var i = 0; i < items.length; i++) {
			item = items[i];
			if(item.getMetaObj().buddyKey != undefined) {
				for (var j = 0; j < items.length; j++) {
					var _item = items[j];
					if(_item.getMetaObj().key == item.getMetaObj().buddyKey) {
						_item.hasBuddyKey = true;
						_item.rgtVisible = item.getMetaObj().visible;
						continue;
					}
				}
			}
		}
		
		var _index = 0;
		var vItems = [];
		for (var i = 0; i < rows; i++) {
			tr = $('<tr row="'+i+'"></tr>').appendTo(table);
			for (var j = 0; j < (2 * repeatCount); j++) {
				var item = items[_index];
				var idx = _index;
				if(item) {
					if(!item.getMetaObj().visible) {
						vItems.push(item);
						_index++;
						j--;
						continue;
					}
					if(!item.getMetaObj().buddyKey && !item.hasBuddyKey) {
						$('<td col="'+j+'"></td>').appendTo(tr);
						j++;
					} 
					if(item.getMetaObj().buddyKey) {
						var bkItem = ct.get(item.getMetaObj().buddyKey);
						if(!bkItem.visible) {
							$('<td col="'+j+'"></td>').appendTo(tr);
							j++;
						}
					}
					td = $('<td col="'+j+'"></td>').appendTo(tr);
					td.attr("index", idx);
					item.container = td;
					if(item.width == -1) {
						item.width = widths[j % 2 == 0 ? 0 : 1];
					}
					item.height = rowHeight;
				} else {
					$('<td col="'+j+'"></td>').appendTo(tr);
				}
				_index++;
			}
		}
		var hRows = vItems.length/repeatCount/2 + rows;
		for (var i = rows; i < hRows; i++) {
			tr = $('<tr row="'+i+'"></tr>').appendTo(table);
			tr.hide();
			for (var j = 0, len = vItems.length; j < len; j++) {
				var item = vItems[j];
				td = $('<td col="'+j+'"></td>').appendTo(tr);
				item.container = td;
			}
		}
	}

});
YIUI.layout['FluidTableLayout'] = YIUI.layout.FluidTableLayout;YIUI.layout.Wizardlayout = YIUI.extend(YIUI.layout.AutoLayout, {
	layout : function(panelWidth, panelHeight) {
		var ct = this.container;

        var index = ct.selectItem.index();
        var right = index * panelWidth;
        ct.body.css("right", right + "px");
        
        var top = (panelHeight - $('.wizard-btn', this.el).height()) / 2;
        $('.wizard-btn', this.el).css("margin-top", top + "px");
        
		panelHeight -= this.getPlaceholderHeight();
		panelWidth -= this.getPlaceholderWidth();
		var items = ct.items;
        if(items && items.length != 0) {
			for (var i = 0, len = items.length; i < len; i++) {
				var item = items[i];
				var foot = item.container.next(".wizard-foot");
				var height = panelHeight - foot.outerHeight();
				item.setHeight(height);
				item.setWidth(panelWidth);
				if(item.hasLayout){
					item.doLayout(item.getWidth(), item.getHeight());
				}
			}
		}
        
	},
	beforeRender : function() {
		var ct = this.container,
			target = ct.getRenderTarget(),
			items = ct.items,
			item,
			funcMap = ct.funcMap,
			warp = $(".ui-wizard-warp", ct.el);
		
		for(var i=0, len=items.length; i<len; i++) {
			item = items[i];
			var _div = $("<div class='wizard-item'></div>").attr("key", item.getMetaObj().key).appendTo(ct.body);
	    	var body = $("<div class = 'wizard-body'></div>").appendTo(_div);
			if(item) {
				item.container = body;
				if(i == 0) {
					warp.addClass("first");
					ct.selectItem = _div;
				}
				_div.attr("index", i);
				funcMap[item.getMetaObj().key] = {
					check: item.check,
					leave: item.leave,
					active: item.active
				};
			}
		}
	},

	/**
	 * beforeLayout中已经设置了各个面板的el
	 */
	isValidParent : function(c, target) {
		return true;
	}
});
YIUI.layout['WizardLayout'] = YIUI.layout.Wizardlayout;/**
 * 所有容器组件的基础类
 * json样式：
 * {
 * 		layout : 'border',
 * 		width : 600,
 * 		height : 480,
 * 		items : [{
 *  		type : 'label',
 *  		text : 'Hello world!'
 * 		}, ...]
 * }
 */
YIUI.Panel = YIUI.extend(YIUI.Component, {
	/** 如果items未定义type，默认为component */
	defaultType : 'component',
	/** 容器中子控件布局方式 */
	layout : 'auto',

	overflowX: 'visible',

	overflowY: 'visible',

	backImage: '',

	backImagePosition: '',

	isBackImageRepeatX: false,

	isBackImageRepeatY: false,

    padding: 1,
    
	/** 布局所需参数 */
	/** layoutConfig : null, */
	/** 面板显示的html，如果定义了html，忽略items和layout */
	/** html : null, */
	/** init方法中，递归初始化所有items */
	init : function(options) {
		this.base(options);
		var items = this.items;
		if(items) {
			delete this.items;
			this.add(items);
		}
	},

    needClean:function(){
        return false;
    },

	build: function(form) {
		var rootpanel = form.getRoot();
		this.add(rootpanel);
		this.doRenderChildren();
		this.doLayout(this.el[0].clientWidth, this.el[0].clientHeight);
    	form.setContainer(this);
	},

	removeForm: function(form) {
		var rootpanel = form.getRoot();
		this.remove(rootpanel);
	},

	initDefaultValue: function(options){
		this.el = options.el;
		this.container = options.container;
		this.layout = options.layout;
		this.items = options.items;
	},

	setOverflowX: function(overflowX) {
		if(overflowX.toLowerCase() != "visible") {
			this.overflowX = overflowX;
			this.el.css("overflow-x", overflowX.toLowerCase());
		}
	},

	setOverflowY: function(overflowY) {
		if(overflowY.toLowerCase() != "visible") {
			this.overflowY = overflowY;
			this.el.css("overflow-y", overflowY.toLowerCase());
		}
	},

	setBackImage: function(backImage) {
		this.backImage = backImage;
		this.el.css("background-image", "url('Resource/" + backImage + "')");
	},

	setLeftMargin: function(leftMargin) {
		this.el.css("margin-left", leftMargin);
	},

	setRightMargin: function(rightMargin) {
		this.el.css("margin-right", rightMargin);
	},

	setTopMargin: function(topMargin) {
		this.el.css("margin-top", topMargin);
	},

	setBottomMargin: function(bottomMargin) {
		this.el.css("margin-bottom", bottomMargin);
	},

	setBackImagePosition: function(backImagePosition) {
		this.backImagePosition = backImagePosition;
		switch(backImagePosition) {
			case "top":
				this.el.css("background-position", "top left");
				break;
			case "bottom":
				this.el.css("background-position", "bottom left");
				break;
			case "left":
				this.el.css("background-position", "center left");
				break;
			case "right":
				this.el.css("background-position", "center right");
				break;
			case "center":
				this.el.css("background-position", "center center");
				break;
		}
		this.el.css("background-position", backImagePosition);
	},

	setBackImageRepeatX: function(isBackImageRepeatX) {
		this.isBackImageRepeatX = isBackImageRepeatX;
		if(isBackImageRepeatX) {
			this.el.css("background-repeat", "repeat-x");
		}
	},

	setbackImageRepeatY: function(isBackImageRepeatY) {
		this.isBackImageRepeatY = isBackImageRepeatY;
		if(isBackImageRepeatY) {
			this.el.css("background-repeat", "repeat-y");
		}
	},

	/**
	 * 添加控件
	 * 如果面板渲染完成后，需要添加控件，调用方式：
	 *  panel.add(comp);
	 *  panel.doLayout();
	 * @param comp 可以是单个控件或控件数组
	 */
	add : function(comp) {
		this.initItems();
		if(this.beforeAdd(comp) !== false) {
			if($.isArray(comp)) {
				var _this = this;
				$.each(comp, function(i) {
					_this.add(this);
				});
				return;
			}
			if(this.get(comp.id)) return;

			var c = this.lookupComponent(comp);
			this.items.push(c);
			c.ownerCt = this;
			this.afterAdd(c);
		}
	},
	beforeAdd : $.noop,
	afterAdd : $.noop,
	
	reduceVisible : $.noop,

	/**
	 * 获取某个item
	 * @param comp 可能是控件id， 也可能是控件在items中的index
	 */
	get : function(comp) {
		if($.isNumeric(comp)) {
			return this.items[comp];
		} else if($.isString(comp)) {
			var items = this.items,
				item;
			for(var i= 0,len=items.length;i<len;i++) {
				item = items[i];
				if(item && (item.id === comp || item.getMetaObj().key === comp)) {
					return item;
				}
			}
		}
		return null;
	},

	/**
	 * 控件在items中的位置
	 * @param comp
	 */
	indexOf : function(comp) {
		var items = this.items;
		for(var i= 0,len=items.length;i<len;i++) {
			if(items[i] === comp) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * 从面板中删除控件
	 * @param comp 将要删除的控件
	 * @param autoDestroy 是否要销毁控件，如果此参数不提供，默认为销毁
	 */
	remove : function(comp, autoDestroy) {
		var index = this.indexOf(comp);
		if(index === -1) {
			// 控件不在面板中
			return;
		}

		// 如果不需要销毁，就只是删除DOM
		if(autoDestroy === false) {
			comp.getEl().remove();
		} else {
			comp.destroy();
		}
		this.items.splice(index, 1);
		return comp;
	},

	/**
	 * 根据传入参数，返回对应的控件
	 * @param comp 可能是控件id，或者json对象
	 * @returns YIUI.Component 如果参数是string，则将其作为控件id，返回已有的控件；
	 *                          如果参数是json，则根据此json创建控件。
	 */
	lookupComponent : function(comp) {
		if($.isString(comp)) {
			return YIUI.ComponentMgr.get(comp);
		} else if(!(comp instanceof YIUI.Component)) {
			return YIUI.create(comp, this.defaultType);
		}
		return comp;
	},
	/**
	 * 重新布局子组件位置
	*/
	doLayout: function(panelWidth, panelHeight) {
		if ( this.layout ) {
			if(this.layouted) {
				if(this.height == "pref") {
					return;
				}
			} else {
				this.layouted = true;
			}
			this.layout.layout(panelWidth, panelHeight);
		}
	},
	
	/**
	 * 渲染所有的子组件
	*/
	onRenderChildren: function() {
		if(this.html) {
			this.el.html(this.html);
		} else {
			this.getOuterEl().addClass('ui-pnl');
			if($.isObject(this.layout) && !this.layout.layout){
				this.layoutConfig = this.layout;
				this.layout = this.layoutConfig.type;
			}
			if($.isString(this.layout)){
				// 默认布局时，默认按流式布局换行
				if(this.layout == 'auto' || this.layout == 'flow') {
					this.el.css('white-space', 'normal');
				}
				this.layout = new YIUI.layout[this.layout](this.layoutConfig);
			}
			this.setLayout(this.layout);
			if(this.activeItem !== undefined){
				var item = this.activeItem;
				delete this.activeItem;
				this.layout.setActiveItem(item);
			}

			this.doRenderChildren(false, true);
		}
	},
	setTip: $.noop,
	/**
	 * 容器渲染完成后(只是容器的外观、大小等，不包括容器中子控件的渲染)，根据layout属性完成所有子控件的渲染，如果子控件也是panel，
	 * 则递归进行render和layout
	 */
	afterRender: function(){
		this.base();
//        this.setBox();
		
		var metaObj = this.getMetaObj();
		
		metaObj.overflowX && this.setOverflowX(metaObj.overflowX);
		metaObj.overflowY && this.setOverflowY(metaObj.overflowY);
		
		metaObj.backImage && this.setBackImage(metaObj.backImage);
		metaObj.backImagePosition && this.setBackImagePosition(metaObj.backImagePosition);
		metaObj.isBackImageRepeatX && this.setBackImageRepeatX(metaObj.isBackImageRepeatX);
		metaObj.isBackImageRepeatY && this.setbackImageRepeatY(metaObj.isBackImageRepeatY);
		metaObj.leftMargin && this.setLeftMargin(metaObj.leftMargin);
		metaObj.rightMargin && this.setRightMargin(metaObj.rightMargin);
		metaObj.topMargin && this.setTopMargin(metaObj.topMargin);
		metaObj.bottomMargin && this.setBottomMargin(metaObj.bottomMargin);
	},
	/** 设置本布局方式 */
	setLayout : function(layout){
		if(this.layout && this.layout != layout){
			this.layout.setContainer(null);
		}
		this.layout = layout;
		this.initItems();
		layout.setContainer(this);
	},
	/** 确保包含items */
	initItems : function(){
		if(!this.items){
			this.items = [];
		}
	},
	/** doRenderChildren之前所需，如果需要，在子类中继承 */
	beforeDoRenderChildren : $.noop ,
	/** doRenderChildren之后所需，如果需要，在子类中继承 */
	afterDoRenderChildren : $.noop,
	/**
	 * 容器渲染完成后，所有子控件的render和layout
	 * @param shallow 如果是true，不做子控件的doLayout，只做最外层的
	 * @param force 如果是true，当容器不显示在界面上的时候，也强制执行layout
	 */
	doRenderChildren: function(shallow, force){
		if(!this.html && this.beforeDoRenderChildren() !== false) {
			var rendered = this.rendered;
			var forceLayout = force /*|| this.forceLayout*/;
			if(!this.canLayout() || this.collapsed){
				this.deferLayout = this.deferLayout || !shallow;
				if(!forceLayout){
					return;
				}
				shallow = shallow && !this.deferLayout;
			} else {
				delete this.deferLayout;
			}
			if(rendered && this.layout){
				this.layout.render();
			}
//			if(shallow != true && this.items) {
//				var cs = this.items;
//				for (var i = 0, len = cs.length; i < len; i++) {
//					var c = cs[i];
//					if(c.doRenderChildren){
//						c.doRenderChildren(false, forceLayout);
//					}
//				}
//			}
			if(rendered){
				this.afterDoRenderChildren(shallow, forceLayout);
			}
			// Initial layout completed
			this.hasLayout = true;
//			delete this.forceLayout;
		}
	},

	/** 当前容器是否可以进行layout */
	canLayout: function() {
		var el = this.getEl();
		return el && el.css("display") != "none";
	},
	/** 返回jQuery对象 */
	getRenderTarget : function(){
		return this.getEl();
	},

	/**
	 * 返回容器中可以容纳子组件的宽度，用于计算子组件的比例宽度。
	 */
	getValidWidth : function() {
		return this.el.width()/* - this.layout.getPlaceholderWidth()*/;
	},

	/**
	 * 返回容器中可以容纳子组件的高度，用于计算子组件的比例高度。
	 */
	getValidHeight : function() {
		if(this.ownerCt && this.ownerCt.type == YIUI.CONTROLTYPE.TABPANEL) {
			return this.ownerCt.el.height() - $('.ui-tabs-nav', this.ownerCt.getEl()).outerHeight(true) - this.getToolBarHeight() - this.layout.getPlaceholderHeight();
		}
		if(this.type == YIUI.CONTROLTYPE.TABPANEL) {
			return $('.ui-tabs-body', this.getEl()).height() - this.getToolBarHeight() - this.layout.getPlaceholderHeight();
		}

		// 如果没设置过高度，那取现在的高度再去计算子元素的高度也没有意义
		if(!this.height || this.height <= 0) return 0;

		return this.el.height() - this.getToolBarHeight()/* - this.layout.getPlaceholderHeight()*/;
	},

	getToolBarHeight : function() {
		var height = 0;
		$.each(this.items, function(i, item) {
			if(item.type == YIUI.CONTROLTYPE.TOOLBAR) {
				height = item.getHeight();
				return false;
			}
		});
		return height;
	},

	/**
	 * 先destroy所有items
	 */
	beforeDestroy : function() {
		var items = this.items;
		if(items) {
			for(var i=items.length-1;i>=0;i--) {
				items[i].destroy();
				delete items[i];
			}
		}
		delete this.items;

		this.base();
	},

    /**
     * 获取面板宽度。
     * @return Number。
     */
    getWidth: function () {
        if (this.rendered) {
//            return this.getOuterEl()[0].clientWidth;
            return this.getOuterEl()[0].clientWidth || this.getOuterEl().width();
        }
        return this.width;
    },
    /**
     * 获取面板高度。
     * @return Number。
     */
    getHeight: function () {
        if (this.rendered) {
            return this.getOuterEl()[0].clientHeight;
        }
        return this.height;
    },
	
	needTip: function() {
		return false;
	},

    reLayout: $.noop,

    getNoTabOrderComps: function (unOrderList) {
        for (var i = 0, comp, len = this.items.length; i < len; i++) {
            comp = this.items[i];
            if (comp == undefined || comp == null) continue;
            var tabOrder = comp.getMetaObj().tabOrder;
            if (comp.getMetaObj().crFocus && (tabOrder == -1 || tabOrder == undefined || tabOrder == null)) {
                unOrderList.push(comp);
            } else if (comp.isPanel) {
                comp.getNoTabOrderComps(unOrderList);
            }
        }
    },
    diff : function(diffJson){
		if(diffJson.items){
			var components = this.items;
			$.each(diffJson.items , function(i,diff){
				var key = diff.metaObj.key;
				$.each(components,function(j,comp){
			   		if(comp.metaObj.key == key){
			   			comp.diff(diff);
			   			return false;
			    	}
				});
			});
		}
	}
});
YIUI.reg('panel', YIUI.Panel);
YIUI.reg('body', YIUI.Panel);/**
 * 使用BorderLayout的面板。
 * 使用方式：参考borderlayout.js
 */
YIUI.Panel.BorderLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'BorderLayout',
	initDefaultValue: function(options) {
		this.base(options);
		var el = this.el;
		var top, bottom, left, right, center;
		if(el.find(".border-north").length > 0) {
			top = this.el.find(".border-north");
		}
		if(el.find(".border-south").length > 0) {
			bottom = this.el.find(".border-south");
		}
		if(el.find(".border-western").length > 0) {
			left = this.el.find(".border-western");
		}
		if(el.find(".border-east").length > 0) {
			right = this.el.find(".border-east");
		}
		if(el.find(".border-center").length > 0) {
			center = this.el.find(".border-center");
		}
		var w = el.width(),
			h = el.height(),
			centerW = w,
			centerH = h,
			real;
		if(top != undefined) {
			real = top.height();
			centerH -= real;
			top.width(w);
		}
		if(bottom != undefined) {
			real = bottom.height();
			centerH -= real;
			bottom.width(w);
		}
		if(left != undefined) {
			real = left.width();
			centerW -= real;
			left.height(centerH);
		}
		if(right != undefined) {
			real = right.width();
			centerW -= real;
			right.height(centerH);
		}
		centerW = $.isNumeric(centerW) ? centerW : '100%';
		centerH = $.isNumeric(centerH) ? centerH : '100%';
		center.width(centerW);
		center.height(centerH);
		//子元素的宽高 100%
	},

    getNoTabOrderComps: function (unOrderList) {
        var subComps = [];
        for (var ci = 0, clen = this.items.length, item; ci < clen; ci++) {
            item = this.items[ci];
            switch (item.getMetaObj().region) {
                case "top":
                    subComps.splice(0, 0, item);
                    break;
                case "left":
                    subComps.splice(1, 0, item);
                    break;
                case "center":
                    subComps.splice(2, 0, item);
                    break;
                case "right":
                    subComps.splice(3, 0, item);
                    break;
                case "bottom":
                    subComps.splice(4, 0, item);
                    break;
            }
        }
        for (var i = 0, comp; i < subComps.length; i++) {
            comp = subComps[i];
            if (comp == undefined || comp == null) continue;
            var tabOrder = comp.getMetaObj().tabOrder;
            if (comp.getMetaObj().crFocus && (tabOrder == -1 || tabOrder == undefined || tabOrder == null)) {
                unOrderList.push(comp);
            } else if (comp.isPanel) {
                comp.getNoTabOrderComps(unOrderList);
            }
        }
    },

    install : function() {
		var _this = this;
//			$("#" + this.getId()).resize(function(){
//				_this.layout.layout();
//			});
	}
});
YIUI.reg("borderlayoutpanel",YIUI.Panel.BorderLayoutPanel);/**
 * 使用ColumnLayout的面板。
 * 使用方式：
 * var panel = new YIUI.Panel.ColumnLayoutPanel({
 *     items : [{
 *			type: 'panel',
 *			row : 2,
 *			col : 0,
 *			span : 12,
 *			items : [grid]
 *		}, {
 *			type: 'panel',
 *			row : 3,
 *			col : 0,
 *			span : 4,
 *			items : [tree]
 *		}, {
 *			type: 'panel',
 *			row : 3,
 *			col : 0,
 *			span : 8,
 *			items : [list]
 *		}]
 * });
 */
YIUI.Panel.ColumnLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'ColumnLayout',

    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-clp");
    	
    }
    
});
YIUI.reg("columnlayoutpanel",YIUI.Panel.ColumnLayoutPanel);/**
 * 与应用程序版本对应的默认布局Panel，不需要改变任何实现。
 */
YIUI.Panel.FlowLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout: "FlowLayout"
});
YIUI.reg("flowlayoutpanel",YIUI.Panel.FlowLayoutPanel);YIUI.Panel.FlexFlowLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'FlexFlowLayout',
	
	initDefaultValue: function(options) {
    	this.base(options);
    	
    	var items = this.items,
    		item,
    		panelHeight = this.el.outerHeight() - this.getPlaceholderSize();
    	for (var i = 0, len = items.length; i < len; i++) {
    		item = items[i].el;
    		if($.isPercentage(item.attr("height"))){
				item.height($.getReal(item.attr("height"), panelHeight));
			}
		}
	},
	
	getPlaceholderSize : function() {
		var placeholderSize = 0,
			items = this.items,
			item;
		for(var i= 0,len=items.length;i<len;i++) {
			item = items[i].el;
			if(!$.isPercentage(item.attr("height"))){
				placeholderSize += item.height();
			}
		}
		return placeholderSize;
	}
});
YIUI.reg("flexflowlayoutpanel",YIUI.Panel.FlexFlowLayoutPanel);/**
 * 使用FluidColumnLayout的面板。
 * 使用方式：
 * var panel = new YIUI.Panel.FluidColumnLayoutPanel({
 * 	   fill : true,
 *     items : [{
 *			type: 'panel',
 *			row : 2,
 *			col : 0,
 *			span : 12,
 *			items : [grid]
 *		}, {
 *			type: 'panel',
 *			row : 3,
 *			col : 0,
 *			span : 4,
 *			items : [tree]
 *		}, {
 *			type: 'panel',
 *			row : 3,
 *			col : 0,
 *			span : 8,
 *			items : [list]
 *		}]
 * });
 */
YIUI.Panel.FluidColumnLayoutPanel = YIUI.extend(YIUI.Panel, {
	layout : 'FluidLayout',

	/**
	 * 是否充满整个浏览器
	 */
	fill : false,

	init : function(options) {
		this.base(options);

		this.layoutConfig = this.layoutConfig || {};
		this.layoutConfig.fill = this.fill;
	}
});
YIUI.reg("fluidcolumnlayoutpanel",YIUI.Panel.FluidColumnLayoutPanel);YIUI.Panel.FluidTableLayoutPanel = YIUI.extend(YIUI.Panel, {
    layout: "FluidTableLayout",
    widths: null,
    rowGap: 0,
    columnGap: 0,
    repeatCount: 1,
    repeatGap: 0,
    rowHeight: 30,
    
    init: function(options) {
    	this.base(options);
    },

//    onSetWidth: function(width) {
//    	width += this.widths.length * this.columnGap + this.repeatCount * this.repeatGap;
//		this.el.css("width", width);
//    },
    
//    onSetHeight: function(height) {
//    	var count = 0,
//    		items = this.items,
//    		repeatCount = this.repeatCount;
//    	for (var i = 0; i < items.length; i++) {
//			if(items[i].buddyKey) {
//				count++;
//			}
//		}
//    	var rows = (items.length + count) / 2;
//		if(rows % repeatCount == 0) {
//			rows = rows / repeatCount;
//		} else {
//			rows = parseInt(rows / repeatCount ) + 1;
//		}
//    	height += rows * this.rowGap;
//		this.el.css("height", height);
//    },
    
    setRowGap: function(rowGap) {
    	this.rowGap = rowGap;
    },
    
    setColumnGap: function(columnGap) {
    	this.columnGap = columnGap;
    },
    
    setRepeatCount: function(repeatCount) {
        if(repeatCount > 1) {
            this.repeatCount = repeatCount;
        }
    },

    setRepeatGap: function(repeatGap) {
        this.repeatGap = repeatGap;
    },
    
    setRowHeight: function(rowHeight) {
    	this.rowHeight = rowHeight;
    },
    
    onRender: function(ct) {
    	this.base(ct);
    	
    	var metaObj = this.getMetaObj();
    	metaObj.rowGap && this.setRowGap(metaObj.rowGap);
        metaObj.columnGap && this.setColumnGap(metaObj.columnGap);
        metaObj.repeatGap && this.setRepeatGap(metaObj.repeatGap);
        metaObj.repeatCount && this.setRepeatCount(metaObj.repeatCount);
        metaObj.rowHeight && this.setRowHeight(metaObj.rowHeight);
    	
    	this.el.addClass("ui-ftlp");
    },
    
    reLayout: function() {
    	this.layout.repaint();
    },
    
    initDefaultValue: function(options) {
    	this.base(options);
    	
    	var ct = this,
			repeatCount = ct.repeatCount = options.repeatCount,
			items = ct.items = options.items,
			rowHeight = ct.rowHeight = options.rowHeight,
			rowGap = ct.rowGap = options.rowGap,
			columnGap = ct.columnGap = options.columnGap,
			repeatGap = ct.repeatGap = options.repeatGap,
			widths = ct.widths = options.widths,
			panelWidth = this.el.outerWidth();
		if(!widths) {
			throw 'widths is undefined';
		}
		
		var table = $("table", this.el),
			firstRow = true,
			tr,
			td;
		var rows = $("tr", this.el).length;
		var cols = $("tr", this.el).eq(0).children().length;
		
    }
});
YIUI.reg("fluidtablelayoutpanel", YIUI.Panel.FluidTableLayoutPanel);/**
 * Created with JetBrains WebStorm.
 * User: chenzs
 * Date: 14-3-20
 * Time: 下午2:15
 */
YIUI.Panel.GridLayoutPanel = YIUI.extend(YIUI.Panel, {
    layout: "GridLayout",
    widths: null,
    minWidths: null,
    heights: null,
    rowGap: 0,
    columnGap: 0,
    oddColumnColor: null,
    forceLayout: true,
    
    setOddColumnColor: function(oddColumnColor) {
    	this.oddColumnColor = oddColumnColor;
		this.el.addClass("oddColumnColor");
    },
    
    setForceLayout: function(forceLayout) {
    	this.forceLayout = forceLayout;
    	this.layout.layout = $.noop;
    	this.layout.render = $.noop;
    },
    
    setRowGap: function(rowGap) {
    	this.rowGap = rowGap;
    },
    
    setColumnGap: function(columnGap) {
    	this.columnGap = columnGap;
    },
    
    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-glp");
    	
    	var metaObj = this.getMetaObj();
    	metaObj.oddColumnColor && this.setOddColumnColor(metaObj.oddColumnColor);
    	metaObj.rowGap && this.setRowGap(metaObj.rowGap);
    	metaObj.columnGap && this.setColumnGap(metaObj.columnGap);
    },
    
    afterRender: function() {
    	this.base();
    	if(this.forceLayout == false) {
    		this.setForceLayout(this.forceLayout);
    	}
    },
    
    initDefaultValue: function(options){
		this.base(options);
		var rowGap = this.rowGap = options.rowgap;
		var columnGap = this.columnGap = options.columngap;
		var heights = this.heights = options.heights;
		var widths = this.widths = options.widths;
		
		var ct = this,
			target = ct.getRenderTarget(),
			el = ct.el,
			panelHeight = el.innerHeight(),
			panelWidth = el.innerWidth();
		if(!widths || !heights) {
			throw 'widths or heights undefined';
		}
		var padding = parseInt(el.css("padding")),
			leftPadding = parseInt(el.css("padding-left")),
			rightPadding = parseInt(el.css("padding-right")),
			topPadding = parseInt(el.css("padding-top")),
			bottomPadding = parseInt(el.css("padding-bottom")),
			margin = parseInt(el.css("margin")),
			leftMargin = parseInt(el.css("margin-left")),
			rightMargin = parseInt(el.css("margin-right")),
			topMargin = parseInt(el.css("margin-top")),
			bottomMargin = parseInt(el.css("margin-bottom"));
		panelHeight -= (padding == 0 ? (topPadding + bottomPadding) : padding * 2) + (margin == 0 ? (topMargin + bottomMargin) : margin * 2);
		panelWidth -= (padding == 0 ? (leftPadding + rightPadding) : padding * 2) + (margin == 0 ? (leftMargin + rightMargin) : margin * 2);
		var realWidths = ct.layout.calcRealValues(panelWidth, widths),
 			realHeights = ct.layout.calcRealValues(panelHeight, heights),
			table = el.find("table"),
			firstRow = true,
			tr,
			td;
	
		for(var i=0;i<realHeights.length;i++) {
			tr = $(table[0].rows[i]).height(realHeights[i]);
			for(var j=0;j<realWidths.length;j++) {
				td = $(tr[0].cells[j]);
				if(firstRow) {
					td.width(realWidths[j]);
				}
				var node = td.children();
				var nodeName;
				if(node.length > 0) {
					nodeName = node[0].nodeName.toLowerCase();
				}

				var col = parseInt(td.attr("col")),
					row = parseInt(td.parent().attr("row")),
					colspan = parseInt(td.attr("colspan")),
					rowspan = parseInt(td.attr("rowspan"));
				var realWidth = realWidths[col],
					realHeight = realHeights[row];
				if(colspan > 1) {
					for (var j = 1; j < colspan; j++) {
						realWidth += realWidths[col + j];
					}
				}
				if(rowspan > 1) {
					for (var j = 1; j < rowspan; j++) {
						realHeight += realHeights[row + j];
					}
				}
				node.height(realHeight);
				if(nodeName == "label") {
					node.css("line-height", realHeight + "px");
				}
				if(columnGap > 0) {
					node.width(realWidth - columnGap);
				} else {
					node.width(realWidth);
				}
				node.css("margin-top", rowGap+"px");
				node.css("margin-left", columnGap+"px");
			}
			firstRow = false;
		}
	}
});
YIUI.reg("gridlayoutpanel", YIUI.Panel.GridLayoutPanel);/**
 * 拆分面板。
 * 参考splitlayout.js。
 */
YIUI.Panel.SplitPanel = YIUI.extend(YIUI.Panel, {
    /** 使用SplitLayout来实现 */
    layout: 'SplitLayout',
    
    /** 是否是上下拆分，默认为是(vertical)；左右拆分为：'horizontal' */
    orientation: "vertical",
    
    /** 
     * 分割的各个面板的宽度或高度 
     * TODO：是否需要？ 
     * TODO: 添加lock标记
     * 形式：[{size:100px,resizable:true,lock:false},...]
     */
    splitSizes: null,
    
    init : function(options) {
    	this.base(options);
    },
    
    afterAdd: function (comp) {
        var items = this.items,
        	index = items.length - 1;
        if(this.orientation == 'vertical') {
        	if(!comp.width) {
            	comp.width = '100%';
        	}
        } else {
        	if(!comp.height) {
        		comp.height = '100%';
        	}
        }
    },
    
    setOrientation: function(orientation) {
    	this.orientation = orientation;
    },
    
    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-spl");
    	this.getMetaObj().orientation && this.setOrientation(this.getMetaObj().orientation);
    },

    install : function() {
    	var target = this.getRenderTarget();
    	target.children(".spl-resizer").off('mousedown').on('mousedown', null, this, resizeStart);
	},

    initDefaultValue: function(options) {
    	this.el = options.el;
    	this.splitSizes = options.splitsizes;
    	this.orientation = options.orientation;
    	this.layout.container = this;
    	
    	var ct = this,
		items = ct.items,
		item,
		panelWidth = ct.el.outerWidth(),
		panelHeight = ct.el.outerHeight(),
		children = ct.el.children(".spl-item"),
		resizer = ct.el.children(".spl-resizer"),
		vertical = ct.orientation === 'vertical',
		splits = ct.splitSizes;
		for (var i = 0, len = resizer.length; i < len; i++) {
			if(vertical) {
				resizer.eq(i).width(panelWidth);
			} else {
				resizer.eq(i).height(panelHeight);
			}
		}
		for (var i = 0, len = children.length; i < len; i++) {
			var child = children.eq(i);
			if(vertical) {
			  child.height($.getReal(splits[i].size, (panelHeight - ct.layout.getPlaceholderSize())));
			} else {
				child.width($.getReal(splits[i].size, (panelWidth - ct.layout.getPlaceholderSize())));
			}
		}
		// 如果控件高度或宽度未设置，默认充满该Split区域
		for (var i = 0, len = items.length; i < len; i++) {
			item = items[i].el;
			if(vertical) {
				item.height($.getReal("100%", children.eq(i).height()));
				item.width(panelWidth);
			} else {
				item.height(panelHeight);
				item.width($.getReal("100%", children.eq(i).width()));
			}
		}
    }
	
});
YIUI.reg("splitpanel", YIUI.Panel.SplitPanel);


//鼠标按下，开始拖动
  function resizeStart(event) {
  	event.preventDefault();

  	var layout = event.data.layout,
  		ct = event.data,
  		splitter = $(this),
  		region = parseInt(splitter.attr('region')),
  		firstItem = ct.items[region],
  		secondItem = ct.items[region + 1],
  		resize = layout.resize,
  		vertical = ct.orientation !== 'horizontal'; // 是否是上下拆分
  	
  	layout.container = ct;
  	
  	// 判断此分隔条是否允许拖动
  	if(ct.splitSizes && (ct.splitSizes[region].resizable === false || ct.splitSizes[region+1].resizable === false)) {
  		return;
  	}

  	// 存储分隔条最初的位置、鼠标最初的位置
  	resize.splitter = splitter;
  	resize.startPos = splitter.cssNum(!vertical ? 'left' : 'top', 0);
  	resize.startMouse = !vertical ? event.screenX : event.screenY;

  	// 添加position，以动态移动分隔条
  	splitter.addClass('r-moving');

  	// 监听鼠标拖动、鼠标松开事件
  	$(document).off('mousemove').off('mouseup.splitter')
  		.on('mousemove', null, layout, resizeMove)
  		.on('mouseup.splitter', null, layout, resizeStop);
  }

  //鼠标拖拽过程
  function resizeMove(event) {
  	event.preventDefault();

  	var layout = event.data,
  		ct = layout.container,
  		resize = layout.resize,
  		splitter = resize.splitter,
  		region = parseInt(splitter.attr('region')),
  		els = ct.getRenderTarget().children('.spl-item'),
  		first = $(els[region]),
  		second = $(els[region + 1]),
  		vertical = ct.orientation !== 'horizontal',
  		current = !vertical ? event.screenX : event.screenY,
  		delta = current - resize.startMouse,
  		minSize = layout.regionMinSize;

  	// 计算，保证各面板不会被拖动地太小
  	if(vertical) {
  		if(first.height() + delta < minSize) {
  			delta = minSize - first.height();
  		} else if(second.height() - delta < minSize) {
  			delta = second.height() - minSize;
  		}
  	} else {
  		if(first.width() + delta < minSize) {
  			delta = minSize - first.width();
  		} else if(second.width() - delta < minSize) {
  			delta = second.width() - minSize;
  		}
  	}

  	// 记录实际应该拖动的大小，在resizeStop中使用
  	resize.delta = delta;

  	// 实时的移动分隔条
  	splitter.css(!vertical?'left':'top', resize.startPos + delta);
  }

  //鼠标松开，重新设置各分区大小
  function resizeStop(event) {
  	event.preventDefault();

  	var layout = event.data,
  		ct = layout.container,
  		resize = layout.resize,
  		splitter = resize.splitter,
  		region = parseInt(splitter.attr('region')),
  		el = ct.getRenderTarget(),
  		els = el.children('.spl-item'),
  		first = $(els[region]),
  		second = $(els[region + 1]),
  		firstItem = ct.items[region],
  		secondItem = ct.items[region + 1],
  		vertical = ct.orientation !== 'horizontal',
  		minSize = layout.regionMinSize,
  		delta = resize.delta || 0,
  		panelWidth = ct.getWidth(),
  		panelHeight = ct.getHeight();

  	// 解除监听鼠标事件
  	$(document).off('mousemove', resizeMove).off('mouseup.splitter', resizeStop);

  	if(delta !== 0) {
  		// 重设受影响的面板大小
  		if(vertical) {
  			first.height(first.height() + delta);
  			second.height(second.height() - delta);
  			if(firstItem.height == -1){
  				firstItem.setHeight($.getReal("100%", first.height()));
  			}else{
  				firstItem.setHeight($.getReal(firstItem.height, first.height()));
  			}
  			if(secondItem.height == -1){
  				secondItem.setHeight($.getReal("100%", second.height()));
  			}else{
  				secondItem.setHeight($.getReal(secondItem.height, second.height()));
  			}
  			panelHeight -= ct.layout.getPlaceholderHeight();
			ct.splitSizes[region].size = first.height();
			ct.splitSizes[region + 1].size = "100%";
  		} else {
  			first.width(first.width() + delta);
  			second.width(second.width() - delta);
  			if(firstItem.width == -1){
  				firstItem.setWidth($.getReal("100%", first.width()));
  			}else{
  				firstItem.setWidth($.getReal(firstItem.width, first.width()));
  			}
  			if(secondItem.width == -1){
  				secondItem.setWidth($.getReal("100%", second.width()));
  			}else{
  				secondItem.setWidth($.getReal(secondItem.width, second.width()));
  			}
  			panelWidth -= ct.layout.getPlaceholderWidth();
			ct.splitSizes[region].size = first.width();
			ct.splitSizes[region + 1].size = "100%";
  		}
  		if(firstItem.hasLayout){
  			firstItem.doLayout(firstItem.getWidth(), firstItem.getHeight());
  		}
  		if(secondItem.hasLayout){
  			secondItem.doLayout(secondItem.getWidth(), secondItem.getHeight());
  		}
  		
  	}
  	// 大小修改完毕后，删除分隔条的position样式
  	splitter.removeClass('r-moving');
  	splitter.css(!vertical?'left':'top', 0);

  	// 清空中间结果，以供下次拖动使用
  	$.destroy(resize);
  }/**
 * TAB页面板
 */
YIUI.Panel.TabPanel = YIUI.extend(YIUI.Panel, {

    /**
     * 使用tabs布局
     */
    layout: 'TabLayout',

    /**
     * TAB title模板
     */
    tabTemplate: '<li><a href="#{href}"><label style="float: left;">#{title}</label></a></li>',
    
    /**
     * 默认显示的TAB页的index
     */
    activeTab : -1,
    
    selectedTab: null,
    
	height: "100%",
	
	tabPosition: YIUI.DirectionType.TOP,
	
	setTabPosition: function(tabPosition) {
		this.tabPosition = tabPosition;
	},
    
    onRender: function(ct) {
    	this.base(ct);
    	this.el.addClass("ui-tabpnl");
    	this.getMetaObj().tabPosition && this.setTabPosition(this.getMetaObj().tabPosition);
    	if(this.height == "pref") {
    		this.height = "100%";
    	}
    },
    
    /**
     * 添加面板时，如果已渲染，添加header和body
     */
    afterAdd: function (comp) {
        if (!this.rendered) return;

        var title = comp.getMetaObj().title || item.caption,
            id = comp.id || YIUI.allotId(),
			tabID = "tab_" + id,
            li = $(this.tabTemplate.replace(/#\{href\}/g, "#" + tabID).replace(/#\{title\}/g, title)),
            tabs = this.getEl(),
	        head = tabs.children(".ui-tabs-nav"),
	        body = tabs.children(".tab-body");
        $("[href=#"+tabID+"]", li).addClass("ui-tans-anchor").attr("role", "presentation");
        $("[href=#"+tabID+"] label", li).addClass("ui-anchor-label");
        head.append(li);
        var _div = $('<div id='+ tabID +'></div>').appendTo(body);
        comp.el.appendTo(_div);
        _div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").toggleClass("aria-show")
			.attr("role", "tabpanel");
        
        li.addClass("ui-state-default ui-corner-top").attr("role", "tab").toggleClass("aria-selected")
        	.attr("aria-controls", tabID);
        
        if(this.selectedTab) {
        	this.selectedTab.toggleClass("aria-selected");
        	$("#"+this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
        }
        this.setActiveTab(comp);
        this.layout.layout(this.getWidth(), this.getHeight());
        this.selectedTab = li;
    },
    
    reduceVisible: function(visible, comp) {
    	var key = comp.key;
		var _li = $("[aria-controls='tab_"+ comp.id +"']", this.el);
		
		if(visible) {
			var lis = $("li:not(':hidden')", this.el);
			if(lis.length == 0) {
				this.setTabSel($("a", _li));
			} 
			_li.show();
		} else {
			_li.hide();
			
			if(_li.attr("aria-controls") != this.selectedTab.attr("aria-controls")) return;
			var $li_p = _li.prevAll().not(":hidden").last();
			var $li_n = _li.nextAll().not(":hidden").first();
			var $li_s = null;
			if($li_p.length > 0) {
				$li_s = $li_p;
			} else if($li_n.length > 0) {
				$li_s = $li_n;
			}
			if(!$li_s) return;
			this.setTabSel($("a", $li_s));
		}
    },
    
    setTabSel: function(target, event) {
    	var _this = this;
    	if(target.hasClass('ui-anchor-label') || target.hasClass('ui-tans-anchor')) {
    		var $sel_li = target.closest('li');
    		if(_this.selectedTab && _this.selectedTab.attr("aria-controls") != $sel_li.attr("aria-controls")) {
    			$sel_li.toggleClass("aria-selected");
    		}
    		var tabID = $sel_li.attr('aria-controls');
    		
    		if(_this.selectedTab.attr("aria-controls") == $sel_li.attr("aria-controls")) {
    			if(event) {
    				if(event.stopPropagation) {
    					event.stopPropagation();
    				} else {
    					event.cancelBubble = true;
    				}
    			}
    			return false;
    		} else {
    			var form = YIUI.FormStack.getForm(_this.ofFormID);
    			var cxt = {form: form};
				if(_this.itemChanged) {
					form.eval(_this.itemChanged, cxt);
				}
        		var tab = _this.get(tabID.substr(4));
        		var active = tab.active;
        		if(active) {
        			form.eval(active, cxt);
        		}
    			
    			_this.selectedTab.toggleClass("aria-selected");
				$("#" + _this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
    		}
    		
    		$("#"+tabID).toggleClass("aria-show");
    		_this.setActiveTab(tabID);
    		
    		$("#"+tabID).show();
    		_this.layout.layout(_this.getWidth(), _this.getHeight());
    		_this.selectedTab = $sel_li;
    	}
    },

    /**
     * 添加事件
     */
    install: function () {
        var _this = this;
        _this.el.children("ul").click(function(event) {
        	var target = $(event.target);
        	_this.setTabSel(target, event);
        	event.stopPropagation();
        	return false;
        });
    },

    
    /**
     * 设置当前需要显示的TAB页
     * @param tab: 可以是TAB页的index、id、或TAB页的panel对象
     */
    setActiveTab : function(tab) {
    	var index = -1;
    	if($.isNumeric(tab)) {
    		if(tab < 0 && tab > this.items.length - 1) return;
    		index = tab;
    	} else if($.isString(tab)) {
    		for(var i=0;i<this.items.length;i++) {
    			if(tab == "tab_" + this.items[i].getId()) {
    				index = i;
    				break;
    			}
    		}
    	} else if($.isObject(tab)) {
    		for(var i=0;i<this.items.length;i++) {
    			if(tab == this.items[i]) {
    				index = i;
    				break;
    			}
    		}
    	} 
    	if(index != -1) {
    		if(this.activeTab != index) {
    			this.activeTab = index;
    		} 
    	}
    },
    
    initDefaultValue: function(options) {
    	this.base(options);
    	this.lookupComponent(options);
    	this.selectedTab = $(".ui-tabs-nav", this.el).children().eq(0);
    	this.setActiveTab(0);
    	var _this = this,
    		ul = $("ul", this.el),
    		body = $(".tab-body", this.el);
		
        if(_this.items && _this.items.length != 0) {
			ul = $(_this.el.children()[0]);
			body = $(_this.el.children()[1]);
			// 设置body高度，使滚动条局限在body里，不影响TAB header
			body.height(_this.el.outerHeight() - ul.outerHeight(true));
			var items = this.items;
			for (var i = 0, len = items.length; i < len; i++) {
				items[i] = _this.lookupComponent(items[i]);
			}
		}
    }
});
YIUI.reg('tabpanel', YIUI.Panel.TabPanel);/**
 * TAB页面板
 */
YIUI.Panel.TabPanelEx = YIUI.extend(YIUI.Panel.TabPanel, {
	
	listeners : {
    	//点击关闭图标
    	closetab : function (e) {
	        var target = $(e.target);
	        var itemId = target.closest('li').attr('aria-controls');
	        var _index = target.closest('li').index() - 2;
        	if((this.activeTab == _index && this.activeTab != 0) || _index < this.activeTab) {
	        	this.activeTab -= 1;
        	}
	        this.remove(this.get(itemId));
	    }

    },
    
    afterRender: function(){
		this.base();
		var el = this.el;
		var head = $('.ui-tabs-nav', el);
		head.addClass('ui-tabs-ex');
		var li = "<li><img alt='图片' src='Resource/file.png'><label class='ui-tabs-nav-label' style='vertical-align: middle;'>物料订单</label></li>"
				 + "<li class='customView_li' style='float: right;'></li>";
		head.prepend(li);
	},
	
	remove: function (comp, autoDestroy) {
		this.base(comp, autoDestroy);
        var tab;
		if($(".tab-body", tabs).children().length <= 0) {
        	$(".ui-tabs-nav-label", tabs).html("物料订单");
        } else {
        	tab = this.items[this.activeTab];
			$(".ui-tabs-nav-label", tabs).html(tab.title);
        }
	},
	
	setActiveTab : function(tab) {
		this.base(tab);
		if(index != -1 && this.rendered) {
			$(".ui-tabs-nav-label", this.el).html(tab.title);
    	}
		
	}
    
});
YIUI.reg('tabpanelex', YIUI.Panel.TabPanelEx);/**
 *treepanel中显示CHECKBOX时，的选择模式
 *YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT ：当父节点选中时，子节点选中， 反之也是
 *YIUI.TREEPANEL_CKBOXTYPE_SINGLE_SELECT ：父节点和子节点独立， 互不影响
 */
YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT = {"Y":"ps","N":"ps"};

YIUI.TREEPANEL_CKBOXTYPE_SINGLE_SELECT = {"Y":"","N":""};

/**
 *树控件，封装zTree控件的接口， treeMenu为真实的树。
 */
YIUI.TreePanel = YIUI.extend(YIUI.Panel, {
	//是否显示节点图标
	showIcon: true,

	//是否显示节点连线
	showLine: true,
	
	//宽度
	width : null,
	
	//高度
	height : null,
	
	//显示复选框
    showCheckBox : false,
	
	//复选框的选择模式   勾选时父子关联， 勾选时 父子不关联
	checkBoxType : YIUI.TREEPANEL_CKBOXTYPE_NORMAL_SELECT,
	
	//双击展开节点
    dblClickExpand : true,
	
	//树的数据
	dataSource : null,

    tree : null,

    addDiyDom : null,

    async :{
        autoParam : [],
        dataFilter : null,
        enable : false,
        otherParam:[],
        type : "post",
        url : ""
    },
    callback : {
        beforeAsync:null,
        beforeClick:null,
        beforeDblClick:null,
        beforeRightClick:null,
        beforeMouseDown:null,
        beforeMouseUp:null,
        beforeExpand:null,
        beforeCollapse:null,
        beforeRemove:null,

        onAsyncError:null,
        onAsyncSuccess:null,
        onNodeCreated:null,
        onClick:null,
        onDblClick:null,
        onRightClick:null,
        onMouseDown:null,
        onMouseUp:null,
        onExpand:null,
        onCollapse:null,
        onRemove:null
    } ,
	initEvert: function(){
		
	},		
			
    init: function (options) {
    	this.base(options);
    },

    onRender: function (ct) {
 		this.base(ct);

        this.el.addClass("ztree");

 		var setting = {
            check: {
                enable: this.showCheckBox,
                chkboxType: this.checkBoxType
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view: {
				showLine: this.showLine,
                showIcon: this.showIcon,
				selectedMulti: false,
				dblClickExpand: this.dblClickExpand ,
                addDiyDom : this.addDiyDom
			},
            callback : this.callback,
            async : this.async
		};
		
 		$.fn.zTree.init(this.el, setting, this.dataSource);
        this.tree = $.fn.zTree.getZTreeObj(this.id);
    },

    /**
     * 展开/折叠指定节点
     * @param node 节点数据
     * @param expandFlag true 展开 false 折叠
     * @param sonSign true 影响和所有子孙节点， false 当前节点
     * @param focus true 设置焦点
     * @param callbackFlag 是否调用回调函数
     * @returns {*} true 展开 false 折叠
     */
    expandNode: function(node, expandFlag, sonSign, focus, callbackFlag) {
    	return this.tree.expandNode(node, expandFlag, sonSign, focus, callbackFlag);
    },

	/**
	 * 选中指定节点
	 * @param node 节点数据
	 * @param addFlag 当多选的时候 是否 同时被选中，即 如果有001节点被选择， 调用方法选中002 当为true 时 001 002 节点都被选中。
	 */
    selectNode : function(node, addFlag) {
    	this.tree.selectNode(node,addFlag);
    },

	/**
	 * 获取所有的节点数据
	 */
    getNodes : function() {
    	return this.tree.getNodes()
    },

    /**
     * 获取打勾或不打勾的节点
     * @param checked
     * @returns {*}
     */
    getCheckedNodes : function(checked){
    	return this.tree.getCheckedNodes(checked);
    }
});
YIUI.reg('treepanel', YIUI.TreePanel);/**
 * TabContainer
 * 以TAB页为显示形式的单据容器，单据为Form
 */
YIUI.Panel.TabContainer = YIUI.extend(YIUI.Panel, {

    /**
     * 使用tab布局
     */
    layout: 'tab',

    /**
     * TAB title模板
     */
    tabTemplate: '<li><a href="#{href}"><label style="float: left;">#{title}</label><span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></a></li>',
    
    /**
     * 默认显示的TAB页的index
     */
    activeTab : -1,
    
    selectedTab: null,

    _hasShow : false,
    
    listeners : {
    	//点击关闭图标
    	closetab : function(e) {

	        var target = $(e.target);
	        var itemId = target.closest('li').attr('aria-controls');
    		YIUI.EventHandler.doCloseForm(this.get(itemId));
	    }

    },
    
    /** 关闭tab页 */
    close: function(compID) {
    	var _index = $("[aria-controls="+compID+"]").index();
    	if((this.activeTab == _index && this.activeTab != 0) || _index < this.activeTab) {
        	this.activeTab -= 1;
    	}
        this.remove(this.get(compID));
    },
    
    /**
     * 添加面板时，如果已渲染，添加header和body
     */
    afterAdd: function(comp) {
        if (!this.rendered) return;
        var title = comp.abbrCaption || '',
            id = comp.id || YIUI.allotId(),
            li = $(this.tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{title\}/g, title)),
            tabs = this.getEl(),
	        head = $("ul.ui-tabs-nav", tabs.children(".ui-tabs-header")),
	        body = tabs.children(".ui-tabs-body");
        $("[href=#"+id+"]", li).addClass("ui-tans-anchor").attr("role", "presentation");
        $("[href=#"+id+"] label", li).addClass("ui-anchor-label");
        li.data("key", this.key);
        head.append(li);
        comp.el = $('<div id='+ id +'></div>').appendTo(body);
        comp.el.addClass("ui-tabs-tabcontainer ui-widget-content ui-corner-bottom").toggleClass("aria-show")
			.attr("role", "tabpanel");
        
        li.addClass("ui-state-default ui-tabcontainer").attr("role", "tab").toggleClass("aria-selected").attr("aria-controls", comp.id);
       
        if(this.selectedTab) {
        	this.selectedTab.toggleClass("aria-selected");
        	$("#"+this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
        }
        this.setActiveTab(comp);
        this.layout.layout(this.getWidth(), this.getHeight());
        this.selectedTab = li;
       
        var _li = $("<li/>").attr("aria-controls", li.attr("aria-controls")).html($("label", li).text());
    	$("ul", this._dropView).append(_li);
    	
    	this.setDropBtnView();
    	this.setTabListColor();
    },
    
    /** 设置下拉列表的向上向左的偏移 */
    setDropViewLeft: function() {
    	this._dropView.css({
    		"top": this._dropBtn.offset().top + this._dropBtn.height(),
    		"left": document.body.clientWidth - this._dropView.outerWidth() - 30
		});
    },

    /** 设置当前需要显示的tab页
     * @param li: 需要显示的tab页
     */
    setSelectedTab: function(li) {
		if(!this.selectedTab || this.selectedTab.attr("aria-controls") == li.attr("aria-controls")) {
			return;
		} else {
			li.toggleClass("aria-selected");
			this.selectedTab.toggleClass("aria-selected");
			$("#" + this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
		}
		
		var tab = this.get(li.attr('aria-controls'));
		$("#"+tab.id).toggleClass("aria-show");
		this.setActiveTab(tab);
		this.layout.layout(this.getWidth(), this.getHeight());
		this.selectedTab = li;
		
		var scrollLeft = li.position().left - $(".ui-tabs-header", this.el).width() + li.width();
		$(".ui-tabs-header", this.el).scrollLeft(scrollLeft < 0 ? 0 : scrollLeft);
    	this.setTabListColor();
    	
    },
    
    /** 设置点击下拉列表的按钮是否显示 */
    setDropBtnView: function() {
    	var li = $(".ui-tabs-header li", this.el).last();
        if(li.length == 0 || !this.selectedTab) return;
        if(li.position().left + li.width() <= $(".ui-tabs-header", this.el).width()) {
        	this._dropBtn.removeClass("show");
        }
        li = this.selectedTab;
        if(li.position().left + li.width() > $(".ui-tabs-header", this.el).width()) {
        	if(!this._dropBtn.hasClass("show")) {
        		this._dropBtn.addClass("show");
        	}
        	$(".ui-tabs-header", this.el).scrollLeft(li.position().left - $(".ui-tabs-header", this.el).width() + li.width());
        }
    },
    
    /** 设置列表中tab项显示与被隐藏项的样式区别 */
    setTabListColor: function() {
    	var _left = $(".ui-tabs-header", this.el).offset().left;
    	var _childs = $(".ui-tabs-header li", this.el), _child, selectedLi;
    	for (var i = 0, len = _childs.length; i < len; i++) {
    		_child = _childs.eq(i);
    		selectedLi = $("li[aria-controls = "+ _child.attr("aria-controls") +"]", this._dropView);
    		if(_child.offset().left >= _left && _child.offset().left <= _left + $(".ui-tabs-header", this.el).width() ) {
    			selectedLi.addClass("lightColor");
    		} else {
    			selectedLi.removeClass("lightColor");
    		}
		}
    },
    
    /**
     * 添加事件
     */
    install: function() {
        var _this = this;
        $(".ui-tabs-header", _this.el).delegate("li", "click", function(event) {
        	var target = $(event.target);
        	if(target.hasClass('ui-icon-close')) {
        		_this.fireEvent('closetab', event);
        	} else if(target.hasClass('ui-anchor-label') || target.hasClass('ui-tans-anchor')) {
            	_this.setSelectedTab(target.closest('li'));
        	}
        	event.stopPropagation();
        	return false;
        });
        
        _this._dropBtn.click(function(event) {
        	if(!$(this).hasClass("show")) return;
        	if(_this._hasShow){
	            _this.hideTabList();
		        _this._dropView.removeClass("showList");
	            return;
	        } else {
		        _this._dropView.addClass("showList");
	        }
	        _this.setDropViewLeft();
		    _this._dropView.slideDown("fast");
	        _this._dropView.css( "z-index", $.getZindex( _this._dropBtn ) + 1 );
	        
	        $(document).on("mousedown",function(e){
	            var target = $(e.target);
	            if((target.closest(_this._dropView).length == 0)
	                &&(target.closest(_this._dropBtn).length == 0)){
	                _this.hideTabList();
	                _this._dropView.removeClass("showList");
	            }
	        });
	
	        _this._hasShow = true;
	        event.stopPropagation();
        });
        $("ul", _this._dropView).delegate("li", "click", function(event) {
        	var aria_controls = $(this).attr("aria-controls");
        	var _li = $("li[aria-controls = " + aria_controls + "]", _this.el);
        	_this.setSelectedTab(_li);
        	_this.hideTabList();
        });
    },
    
    /** 隐藏下拉列表 */
    hideTabList: function() {
    	this._dropView.hide();
        this._hasShow = false;
    },

    /**
     * 删除面板
     */
    remove: function (comp, autoDestroy) {
        var id = comp.getId();
        var formId = comp.ofFormID;
        comp = this.base(comp, autoDestroy);
        if (!comp) return;

        var tabs = this.getEl();
        YIUI.FormStack.removeForm(formId);
        $('#' + id, tabs).remove();
        $('[aria-controls=' + id + ']', tabs).remove();
        
        $("li[aria-controls="+id+"]", this._dropView).remove();
        
//        var li = $(".ui-tabs-header li", this.el).last();
//        if(li.position().left + li.width() <= $(".ui-tabs-header", tabs).width()) {
//        	this._dropBtn.removeClass("show");
//        }
        
        this.setDropBtnView();
        
        var tab;
        if($(".ui-tabs-body", tabs).children().length <= 0) {
        	this.activeTab = -1;
        	return;
        } else {
        	tab = this.items[this.activeTab];
        }
        if(this.selectedTab && this.selectedTab.attr("aria-controls") == id) {
        	tab.el.toggleClass("aria-show");
            $("li[aria-controls = "+tab.id+"]").toggleClass("aria-selected");
        }
        this.selectedTab = $("li[aria-controls = "+tab.id+"]");
		this.layout.layout(this.getWidth(), this.getHeight());
        
    },
    
    /**
     * 设置当前需要显示的TAB页
     * @param tab: 可以是TAB页的index、id、或TAB页的panel对象
     */
    setActiveTab : function(tab) {
    	var index = -1;
    	if($.isNumeric(tab)) {
    		if(tab < 0 && tab > this.items.length - 1) return;
    		index = tab;
    	} else if($.isString(tab)) {
    		for(var i=0;i<this.items.length;i++) {
    			if(tab == this.items[i].getId()) {
    				index = i;
    				break;
    			}
    		}
    	} else if($.isObject(tab)) {
    		for(var i=0;i<this.items.length;i++) {
    			if(tab == this.items[i]) {
    				index = i;
    				break;
    			}
    		}
    	} 
    	if(index != -1) {
    		if(this.activeTab != index) {
    			this.activeTab = index;
    		} 
    	}
    }
});
YIUI.reg('tabcontainer', YIUI.Panel.TabContainer);/**
 * TabExContainer
 * 以TAB页为显示形式的单据容器，单据为Form
 */
YIUI.Panel.TabExContainer = YIUI.extend(YIUI.Panel.TabPanelEx, {
	
	afterRender: function(){
		this.base();
		var custom;
		switch(this.customTag) {
		case "UserInfoPane":
			custom = YIUI.CUSTOMVIEW.USERINFOPANE;
			break;
			
		default :
			custom = "";
		}
		$(custom).appendTo($(".customView_li"));
	}
});
YIUI.reg('tabexcontainer', YIUI.Panel.TabExContainer);/**
 * StackContainer
 * 以Stack为显示形式的单据容器，单据为Form
 */
YIUI.Panel.StackContainer = YIUI.extend(YIUI.Panel, {
	
	/** 容器中存在的Form，以栈为表现形式 */
	/** forms : [], */
	
	init : function(options) {
		this.base(options);
		this.formID = null;
	},
    
	
	onSetHeight: function(height) {
		this.base(height);
	},
	
	/** 删除原有form，并缓存之 */
	afterAdd : function(comp) {
		if(this.items.length >= 2) {
			this.items.shift();
		}
		if(this.el) {
			// 删除原有界面
			this.el.empty();
			if(!this.isReplace) {
				this.formID && YIUI.FormStack.removeForm(this.formID);
				this.isReplace = false;
			}
		}
		this.formID = comp.ofFormID;
	},
	
	/** 删除当前form，并取出之前缓存的form，并显示 */
	remove : function(comp, autoDestroy) {
		this.base(comp, autoDestroy);

		this.formID && YIUI.FormStack.removeForm(this.formID);
	},
	
	getActivePane: function() {
		return YIUI.FormStack.getForm(this.formID);
	},

	build: function(form) {
		var rootpanel = form.getRoot();
		this.add(rootpanel);
		this.doRenderChildren();
		this.doLayout(this.el[0].clientWidth, this.el[0].clientHeight);
    	form.setContainer(this);
        var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
        errDiv.prependTo(rootpanel.el);
        form.setErrDiv(errDiv);
	},
	
	removeForm: function(form) {
        this.remove(form.getRoot());
		this.formID && YIUI.FormStack.removeForm(this.formID);
	}
	
//	close: function(form) {
//		var compID = form.getRoot().id;
//        this.remove(this.get(compID));
//		this.formID && YIUI.FormStack.removeForm(this.formID);
//	}
});
YIUI.reg('stackcontainer', YIUI.Panel.StackContainer);YIUI.Panel.WizardPanel = YIUI.extend(YIUI.Panel, {
	   layout: 'WizardLayout',
	   
	   funcMap: {},

	   onRender: function(ct) {
	    	this.base(ct);
	    	this.el.addClass("ui-wizard");
	    	$("<div class = 'ui-wizard-warp'></div>").appendTo(this.el);
	    	this.body = $("<div class = 'body'></div>").appendTo(this.el);
	    },
	    afterRender : function(){
	    	this.base();
	    	var splwidth = this.el.children();
	    	var index = splwidth.length;
    		var itemlength = $(splwidth.get(0)).width();
    		var pad = this.el.css('padding');
    		var childpad = this.el.children().css('padding');
    		pad = parseInt(pad.substring(0,pad.length-2));
    		childpad = parseInt(childpad.substring(0,childpad.length-2));
    		itemlength = itemlength  + childpad*2;
	    	$('.ui-wizard-warp').width(itemlength);
	    	
	    	var divleft = $('<div class="wizard-btn left"><span class="btn-left"></span><span class="prev">上一步</span></div>');
	    	var divright = $('<div class="wizard-btn right"><span class="btn-right"></span><span class="next">下一步</span><span class="finish">完成</span></div>');
	    	var pageinfo = $('<div class="paginfo"></div>');
	    	divleft.appendTo($('.ui-wizard-warp'));
	    	divright.appendTo($('.ui-wizard-warp'));
	    	pageinfo.appendTo($('.ui-wizard-warp'));
	    	
	    },
	    
	    install: function () {
	    	var self = this;
			
	    	$('.ui-wizard-warp .btn-left', this.el).click(function(){
	    		$(".ui-wizard-warp .prev", self.el).click();
	    	});
		
	    	$('.ui-wizard-warp .btn-right', this.el).click(function(){
	    		if($(".ui-wizard-warp", self.el).hasClass("last")) {
	    			$(".ui-wizard-warp .finish", self.el).click();
	    		} else {
		    		$(".ui-wizard-warp .next", self.el).click();
	    		}
	    	});
	    	$(".ui-wizard-warp .next", this.el).click(function(){
	    		if(!self.enable) return false;
	    		var next_div = self.selectItem.next();
	    		if(next_div.length == 0) return;
	    		var key = self.selectItem.attr("key");
	    		var item = self.funcMap[key];
	    		var form = YIUI.FormStack.getForm(self.ofFormID);
    			if(item) {
    				var check = item.check;
    				var ret = true;
    				if(check) {
    					ret = form.eval(check, {form: form});
    				}
    				if(!ret){
    					return;
    				}
    			}
			   	var right = (parseInt(self.body.css("right")) || 0) + self.getWidth();
			   	self.body.animate({right: right+"px"},"slow");
			   	
			   	if(item) {
			   		var leave = item.leave;
			   		if(leave) {
			   			form.eval(leave, {form: form});
			   		}
			   	}
	    		var next_key = next_div.attr("key");
	    		var next_item = self.funcMap[next_key];
	    		if(next_item) {
	    			var next_active = next_item.active;
	    			if(next_active) {
	    				form.eval(next_active, {form: form});
	    			}
	    		}
	    		var warp = $(".ui-wizard-warp", self.el);
	    		if(warp.hasClass("first")) {
	    			warp.removeClass("first");
	    		}
	    		if(next_div.index() == self.items.length - 1) {
	    			warp.addClass("last");
	    		}
	    			
	    		self.selectItem = next_div;
	    	});
	    	$(".ui-wizard-warp .prev", this.el).click(function(){
	    		if(!self.enable) return false;
	    		var prev_div = self.selectItem.prev();
	    		if(prev_div.length == 0) return;
	    		var key = self.selectItem.attr("key");
	    		var item = self.funcMap[key];
	    		var form = YIUI.FormStack.getForm(self.ofFormID);
			   	if(item) {
			   		var leave = item.leave;
			   		if(leave) {
			   			form.eval(leave, {form: form});
			   		}
			   	}
    			
			   	var right = (parseInt(self.body.css("right")) || 0) - self.getWidth();
			   	self.body.animate({right: right+"px"},"slow");
	    		
	    		var prev_key = prev_div.attr("key");
	    		var prev_item = self.funcMap[prev_key];
	    		if(prev_item) {
	    			var prev_active = prev_item.active;
	    			if(prev_active) {
	    				form.eval(prev_active, {form: form});
	    			}
	    		}
	    		self.selectItem = prev_div;
	    		var warp = $(".ui-wizard-warp", self.el);
	    		if(warp.hasClass("last")) {
	    			warp.removeClass("last");
	    		}
    			if(prev_div.index() == 0) {
	    			warp.addClass("first");
	    		}
	    	});
	    	$(".ui-wizard-warp .finish", this.el).click(function(){
	    		var finish = self.finish;
	    		if(finish) {
	    			var form = YIUI.FormStack.getForm(self.ofFormID);
	    			form.eval(finish, {form: form});
	    		}
	    	});
	    }
});
YIUI.reg('wizardpanel', YIUI.Panel.WizardPanel);(function() {
YIUI.TabContainer = function(){
		var Return = {

			    /**
			     * TAB title模板
			     */
			    tabTemplate: '<li><a href="#{href}"><label style="float: left;">#{title}</label><span class="ui-icon ui-icon-close">Remove Tab</span></a></li>',
			    
			    /**
			     * 默认显示的TAB页的index
			     */
			    activeTab : -1,
			    
			    selectedTab: null,

			    _hasShow : false,
			    
			    /**
				 * String。
				 * render控件时，为控件自动创建的DOM标签。
				 */
				aueltoEl : '<div></div>',
				
				items: [],
			    
			    /** 关闭tab页 */
			    close: function(comp) {
			    	this.removeTimermsg(comp);
			    	var li = $("[aria-controls="+comp.id+"]", this.el);
			    	var _index = li.index();
			    	if(li.hasClass("aria-selected") && this.activeTab != _index) {
			    		this.activeTab = _index > 0 ? _index - 1 : 0;
			    	} else if((this.activeTab == _index && this.activeTab != 0) || _index < this.activeTab) {
			    			this.activeTab -= 1;
			    	}
			        this.remove(comp);
			        if(this.items.length > 0) {
				    	this.el.removeClass("empty");
			        } else {
				    	this.el.addClass("empty");
			        }  
			    },
			    //清理关闭timerArray,timerContent
			    removeTimermsg: function(comp){
			    	var D = comp.ofFormID.toString().length;
			    	for ( var t in timerArray) {
			        	if(comp.ofFormID == t.substring(0,D)) {
			        		window.clearInterval(timerArray[t]);
			        		delete timerArray[t];
			        	}
			        }
			    	
			    },
			    
			    closeAll: function() {
			    	var head = $("ul.ui-tabs-nav", this.el),
			        body = this.el.children(".ui-tabs-body");
			    	head.empty();
			    	body.empty();

			    	if(this.items) {
			    		for (var i = 0, len = this.items.length; i < len; i++) {
							var item = this.items[i];
							item.destroy();
						}
			    	}
					this.items = [];
			    	YIUI.FormStack.removeAll();
			    	this.el.addClass("empty");
			    	this._dropBtn.removeClass("show");
			    	this._dropView.removeClass("showList");
			    	$("ul", this._dropView).empty();
			    },
			    
			    removeForm: function(form) {
			    	this.close(form.getRoot());
			    },
			    
			    //初始化启动定时器
			    initTimer: function(form) {
			    	var timertaskcol = form.timerTask;
			    	
	                if (timertaskcol != undefined || timertaskcol != null) {
	                	var newcxt = {"form":form};
	                	var KeyArray = new Array();
	                	var i = 0;
	                	for (var t in timertaskcol) {
	                		if (timerContent[form.formID + t] == undefined) {
	                			timerContent[form.formID + t] = timertaskcol[t].enable
	                		}
	                		KeyArray[i] = t;
	                		i++;
	                    }
	                	var timerNum = KeyArray.length;
	                	var timerAr = new Array();
	                	for (var k = 0;k < timerNum; k++) {
	                		if (timertaskcol[KeyArray[k]].repeat) {
	                			var enable = timertaskcol[KeyArray[k]].enable == timerContent[form.formID + KeyArray[k]] ? timertaskcol[KeyArray[k]].enable : timerContent[form.formID + KeyArray[k]]
	                			timerAr[k] = new timerTask(timertaskcol[KeyArray[k]].key,enable,newcxt,timertaskcol[KeyArray[k]].delay,timertaskcol[KeyArray[k]].period,(timertaskcol[KeyArray[k]].content).trim(),form);
	                			timerAr[k].startTimer();
	                		}
	                	}
	                }
			    },
			    
			    /**
			     * 添加面板时，如果已渲染，添加header和body
			     */
			    afterAdd: function(comp) {
			        if (!this.rendered) return;
			        var form = YIUI.FormStack.getForm(comp.ofFormID);
			        var title = comp.abbrCaption || '',
		            	tabs = this.getEl(),
			        	head = $("ul.ui-tabs-nav", tabs.children(".ui-tabs-header")),
			        	body = tabs.children(".ui-tabs-body"),
			        	id = comp.id || YIUI.allotId(),
			        	li = $(this.tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{title\}/g, title));
			        if(form.isStack) {
			        	var $li = this.selectedTab;
			        	var tab = this.items[this.activeTab];
			        	var stack = tab.stack = tab.stack || [];
			        	stack.push(comp.id);
			        	tab.activeItem = comp;
			        	var div = $("#" + $li.attr("aria-controls"));
			        	div.toggleClass("aria-show");
			        	var ct = div.parent();
				        comp.el = $('<div id='+ id +'></div>').appendTo(body);
				        comp.el.addClass("tabcnt-cont ui-widget-content ui-corner-bottom").toggleClass("aria-show");
				        $("label", $li).html(title);
				        $li.attr("aria-controls", id);
			        	return;
			        }
			        
			        $("[href=#"+id+"]", li).addClass("ui-tans-anchor");
			        $("[href=#"+id+"] label", li).addClass("ui-anchor-label");
			        
			        if(form.entryPath) {
			        	li.attr("formKey", form.formKey);
			        	li.attr("paras", form.entryParas);
			        }
			        
			        li.data("key", this.key);
			        head.append(li);
			        comp.el = $('<div id='+ id +'></div>').appendTo(body);
			        var errDiv = $('<div class="errorinfo"><label/><span class="closeIcon"></span></div>');
			        errDiv.prependTo(comp.el);
			        form.setErrDiv(errDiv);
			        comp.el.addClass("tabcnt-cont ui-widget-content ui-corner-bottom").toggleClass("aria-show");
			        li.addClass("ui-state-default ui-tabcontainer").toggleClass("aria-selected").attr("aria-controls", comp.id);
			       
			        if(this.selectedTab && this.selectedTab.attr("aria-controls") != li.attr("aria-controls")) {
			        	this.selectedTab.toggleClass("aria-selected");
			        	$("#"+this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
			        }
			        this.setActiveTab(comp);
//			        this.layout(this.getWidth(), this.getHeight());
			        this.selectedTab = li;
			        
			        var _li = $("<li/>").attr("aria-controls", li.attr("aria-controls")).html($("label", li).text());
			    	$("ul", this._dropView).append(_li);
			    	
			    	this.setDropBtnView();
			    	this.setTabListColor();
			    	this.el.removeClass("empty");
			    	this.initTimer(form);
			    },
			    
			    /** 设置下拉列表的向上向左的偏移 */
			    setDropViewLeft: function() {
			    	this._dropView.css({
			    		"top": this._dropBtn.offset().top + this._dropBtn.height(),
			    		"left": document.body.clientWidth - this._dropView.outerWidth()
					});
			    },
			    
			    clearSelect: function() {
			    	if(this.selectedTab) {
						this.selectedTab.toggleClass("aria-selected");
						$("#" + this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
						this.selectedTab = null;
					}
			    },

			    /** 设置当前需要显示的tab页
			     * @param li: 需要显示的tab页
			     */
			    setSelectedTab: function(li) {
			    	if(!this.selectedTab) {
						li.toggleClass("aria-selected");
			    	} else if(this.selectedTab.attr("aria-controls") == li.attr("aria-controls")) {
						return;
					} else {
						li.toggleClass("aria-selected");
						this.selectedTab.toggleClass("aria-selected");
						$("#" + this.selectedTab.attr("aria-controls")).toggleClass("aria-show");
					}
					
					var tab = this.get(li.attr('aria-controls'));
					$("#"+tab.id).toggleClass("aria-show");
					this.setActiveTab(tab);
					this.layout(this.getWidth(), this.getHeight());
					this.selectedTab = li;
					
					var scrollLeft = li.position().left - $(".ui-tabs-header", this.el).width() + li.width();
					$(".ui-tabs-header", this.el).scrollLeft(scrollLeft < 0 ? 0 : scrollLeft);
			    	this.setTabListColor();
			    	
			    },
			    
			    /** 设置点击下拉列表的按钮是否显示 */
			    setDropBtnView: function() {
			    	this._dropView.removeClass("showList");
			    	var li = $(".ui-tabs-header li", this.el).last();
			        if(li.length == 0 || !this.selectedTab) return;
			        if(li.position().left + li.width() <= $(".ui-tabs-header", this.el).width()) {
			        	this._dropBtn.removeClass("show");
			        } else {
			        	this._dropBtn.addClass("show");
			        }
			    },
			    
			    /** 设置列表中tab项显示与被隐藏项的样式区别 */
			    setTabListColor: function() {
			    	var _left = $(".ui-tabs-header", this.el).offset().left;
			    	var _childs = $(".ui-tabs-header li", this.el), _child, selectedLi;
			    	for (var i = 0, len = _childs.length; i < len; i++) {
			    		_child = _childs.eq(i);
			    		selectedLi = $("li[aria-controls = "+ _child.attr("aria-controls") +"]", this._dropView);
			    		if(_child.offset().left >= _left && _child.offset().left <= _left + $(".ui-tabs-header", this.el).width() ) {
			    			selectedLi.addClass("lightColor");
			    		} else {
			    			selectedLi.removeClass("lightColor");
			    		}
					}
			    },
			    
			    /**
			     * 添加事件
			     */
			    install: function() {
			        var _this = this;
			        $(".ui-tabs-header", _this.el).delegate("li", "click", function(event) {
			        	var target = $(event.target);
			        	if(target.hasClass('ui-icon-close')) {
							var target = $(event.target);
							var itemId = target.closest('li').attr('aria-controls');
							YIUI.EventHandler.doCloseForm(_this.get(itemId));
			        	} else {
			            	_this.setSelectedTab(target.closest('li'));
			        	}
			        	event.stopPropagation();
			        	return false;
			        });
			        
			        _this._dropBtn.click(function(event) {
			        	if(!$(this).hasClass("show")) return;
			        	if(_this._hasShow){
				            _this.hideTabList();
					        _this._dropView.removeClass("showList");
				            return;
				        } else {
					        _this._dropView.addClass("showList");
				        }
				        _this.setDropViewLeft();
					    _this._dropView.slideDown("fast");
				        _this._dropView.css( "z-index", $.getZindex( _this._dropBtn ) + 1 );
				        
				        $(document).on("mousedown",function(e){
				            var target = $(e.target);
				            if((target.closest(_this._dropView).length == 0)
				                &&(target.closest(_this._dropBtn).length == 0)){
				                _this.hideTabList();
				                _this._dropView.removeClass("showList");
				            }
				        });
				
				        _this._hasShow = true;
				        event.stopPropagation();
			        });
			        $("ul", _this._dropView).delegate("li", "click", function(event) {
			        	var aria_controls = $(this).attr("aria-controls");
			        	var _li = $("li[aria-controls = " + aria_controls + "]", _this.el);
			        	_this.setSelectedTab(_li);
			        	_this.hideTabList();
			        });
			        
			        $(".ui-tabs-body", _this.el).delegate(".errorinfo .closeIcon", "click", function() {
			        	$(this).parent().hide();
			        	var panel = $(this).parents(".aria-show");
			        	_this.items[_this.activeTab].doLayout(panel.width(), panel.height());
			        })
			    },
			    
			    /** 隐藏下拉列表 */
			    hideTabList: function() {
			    	this._dropView.hide();
			        this._hasShow = false;
			    },
			    
			    /**
				 * 控件在items中的位置
				 * @param comp
				 */
				indexOf : function(comp) {
					var items = this.items;
					for(var i= 0,len=items.length;i<len;i++) {
						if(items[i] === comp) {
							return i;
						}
					}
					return -1;
				},
				
				closeTo: function(key) {
					var f,form;
			    	for(var i = this.items.length -1 ; i >=0; i--){
			    		f = this.items[i];
						form = YIUI.FormStack.getForm(f.ofFormID);
						if(form.formKey == key){
							break;
						}
						this.removeForm(form);
			    	}
			    	
				},
				
			    /**
			     * 删除面板
			     */
			    remove: function (comp, autoDestroy) {
			        if (!comp) return;
			        var id = comp.getId();
			        var formId = comp.ofFormID;
			        var index = this.indexOf(comp);
					if(index === -1) {
						// 控件不在面板中
						return;
					}
			        var tabs = this.getEl();
			        YIUI.FormStack.removeForm(formId);
			        $('#' + id, tabs).remove();
					// 如果不需要销毁，就只是删除DOM
					if(autoDestroy === false) {
						comp.getEl().remove();
					} else {
						comp.destroy();
					}
					var tab = this.items[this.activeTab];
					this.items.splice(index, 1);
					if(tab.stack && tab.stack.length > 0) {
			        	var stack = tab.stack;
			        	var c_index = stack.indexOf(id);
			        	var i = -1;
		        		if(c_index == 0 && stack.length > 1) {
		        			i = 1;
		        		} else if(c_index > 0) {
		        			i = c_index - 1;
		        		}
		        		var activeTab = null;
		        		if(i > -1) {
			        		var activeItem = this.get(stack[i]);
				        	tab.activeItem = activeItem;
				        	activeTab = activeItem;
		        		} else {
				        	tab.activeItem = null;
				        	activeTab = tab;
		        		}
			        	var title = activeTab.abbrCaption || '';
			        	activeTab.el.toggleClass("aria-show");
			        	var $li = this.selectedTab;
		        		$("label", $li).html(title);
				        $li.attr("aria-controls", activeTab.id);
			        	stack.splice(c_index, 1);
					} else {
				        $('[aria-controls=' + id + ']', tabs).remove();
				        $("li[aria-controls=" + id + "]", this._dropView).remove();
				        this.setDropBtnView();
				        if($(".ui-tabs-body", tabs).children(".tabcnt-cont").length <= 0) {
				        	this.activeTab = -1;
				        	return;
				        }
				        tab = this.items[this.activeTab];
				        if(this.selectedTab && this.selectedTab.attr("aria-controls") == id) {
				        	tab.el.toggleClass("aria-show");
				            $("li[aria-controls = "+tab.id+"]").toggleClass("aria-selected");
				        }
				        this.selectedTab = $("li[aria-controls = "+tab.id+"]");
					}
					this.layout(this.getWidth(), this.getHeight());
			    },
			    
			    /**
			     * 设置当前需要显示的TAB页
			     * @param tab: 可以是TAB页的index、id、或TAB页的panel对象
			     */
			    setActiveTab : function(tab) {
			    	var index = -1;
			    	if($.isNumeric(tab)) {
			    		if(tab < 0 && tab > this.items.length - 1) return;
			    		index = tab;
			    	} else if($.isString(tab)) {
			    		for(var i=0;i<this.items.length;i++) {
			    			if(tab == this.items[i].getId()) {
			    				index = i;
			    				break;
			    			}
			    		}
			    	} else if($.isObject(tab)) {
			    		for(var i=0;i<this.items.length;i++) {
			    			if(tab == this.items[i]) {
			    				index = i;
			    				break;
			    			}
			    		}
			    	} 
			    	if(index != -1) {
			    		if(this.activeTab != index) {
			    			this.activeTab = index;
			    		} 
			    	}
			    },
			

				/**
				 * 添加控件
				 * 如果面板渲染完成后，需要添加控件，调用方式：
				 *  panel.add(comp);
				 *  panel.doLayout();
				 * @param comp 可以是单个控件或控件数组
				 */
				add : function(comp) {
					if($.isArray(comp)) {
						var _this = this;
						$.each(comp, function(i) {
							_this.add(this);
						});
						return;
					}
					if(this.get(comp.id)) return;

					var c = this.lookupComponent(comp);
					this.items.push(c);
					this.afterAdd(c);
				},

				/**
				 * 获取某个item
				 * @param comp 可能是控件id， 也可能是控件在items中的index
				 */
				get : function(comp) {
					if($.isNumeric(comp)) {
						return this.items[comp];
					} else if($.isString(comp)) {
						var items = this.items,
							item;
						for(var i= 0,len=items.length;i<len;i++) {
							item = items[i];
							if(item && item.id === comp) {
								return item;
							}
						}
					}
					return null;
				},
				
				/**
				 * 设置组件宽度。
				 * @param width：Number类型。
				 */
				setWidth : function(width) {
					if(!width || !$.isNumeric(width) || width <= 0)
						return;

					if(!this.rendered) {
						this.width = width;
						return;
					}

					var lastSize = this.lastSize;
					if(lastSize.width !== width) {
						lastSize.width = width;
						this.onSetWidth(width);
					}
				},

				// private 默认的设置组件宽度方法，如果组件有自定义设置宽度方法，可在子组件重写此方法。
				onSetWidth : function(width) {
					this.el.css("width", width);
				},

				/**
				 * 获取组件宽度。
				 * @return Number。
				 */
				getWidth : function() {
					if(this.rendered) {
						return this.getEl().width();
					}
					return this.width;
				},

				/**
				 * 设置组件高度。
				 * @param height：Number。
				 */
				setHeight : function(height) {
					if(!height || !$.isNumeric(height) || height <= 0)
						return;

					if(!this.rendered) {
						this.height = height;
						return;
					}

					var lastSize = this.lastSize;
					if(lastSize.height !== height) {
						lastSize.height = height;
						this.onSetHeight(height);
					}
				},

				// private 默认的设置组件高度方法，如果组件有自定义设置高度方法，可在子组件重写此方法。
				onSetHeight : function(height) {
					this.el.css("height", height);
				},
				
				/**
				 * 获取组件高度。
				 * @return Number。
				 */
				getHeight : function() {
					if(this.rendered) {
						return this.getEl().height();
					}
					return this.height;
				},
				
				/**
				 * 根据传入参数，返回对应的控件
				 * @param comp 可能是控件id，或者json对象
				 * @returns YIUI.Component 如果参数是string，则将其作为控件id，返回已有的控件；
				 *                          如果参数是json，则根据此json创建控件。
				 */
				lookupComponent : function(comp) {
					if($.isString(comp)) {
						return YIUI.ComponentMgr.get(comp);
					} else if(!(comp instanceof YIUI.Component)) {
						return YIUI.create(comp, this.defaultType);
					}
					return comp;
				},

				/** 
				 * 重新布局子组件位置
				*/
				doLayout: function(panelWidth, panelHeight) {
					if ( this.layout ) {
						this.layout(panelWidth, panelHeight);
					}
				},
				
				/** 
				 * 渲染所有的子组件
				*/
				onRenderChildren: function() {
					this.el.addClass('ui-panel');
					this.doRenderChildren(false, true);
				},
				
				/**
				 * 容器渲染完成后，所有子控件的render和layout
				 * @param shallow 如果是true，不做子控件的doLayout，只做最外层的
				 * @param force 如果是true，当容器不显示在界面上的时候，也强制执行layout
				 */
				doRenderChildren: function(shallow, force){
					if(!this.html) {
						var rendered = this.rendered;
						var forceLayout = force;
						
						if(rendered){
							this.layoutRender();
						}
						this.hasLayout = true;
						this.doLayout(this.getWidth(), this.getHeight());
					}
				},
				
				/**
				 * 把控件渲染到container中
				 * @param container：jQuery，当前控件的父节点。
				 */
				render : function(container) {
					if(!this.rendered) {
						this.rendered = true;
						this.container = container ? $(container)
								: (this.container ? $(this.container) : $.getBody());
						this.onRender(this.container);
						this.onRenderChildren();
						
						this.install();
					}
				},
				
				/**
				 * 控件渲染到界面，不包含items的渲染。
				 */
				onRender : function(ct) {
					var el = this.el;
					this.el.addClass("ui-tabcnt empty");
					// 如果未定义ct，且组件el已定义，取ct为el的parentNode
					if(el && (!ct || ct.length == 0)) {
						this.container = ct = $(el).parent();
					}
					if(!el && this.autoEl) {
						if($.isString(this.autoEl)) {
							el = $(this.autoEl);
						}
					}
					if(el) {
						if(!el.attr('id')) {
							el.attr('id', this.getId());
						}
						this.el = $(el);
						// 如果发现el已经在DOM树中，不再进行插入
						if(this.el.parents('body')[0] != $.getBody()[0]) {
							ct.append(this.el);
						}
					}


				},
				
				layoutRender : function() {
			        var target = this.getRenderTarget();
					if(this.prepared || this.beforeLayoutRender() !== false) {
						this.prepared = true;
						this.onLayoutRender(this, target);
					}
			    },
			    
			    /** 返回jQuery对象 */
				getRenderTarget : function(){
					return this.getEl();
				},
				
				/**
				 * 返回使用的jQueryUI对象的dom。
				 * @return jQuery。
				 */
				getEl : function() {
					return this.el;
				},

			    // private
			    onLayoutRender : function(ct, target){
			        this.renderLayoutChildren(ct, target);
			    },
			    
			    /** 渲染container中的所有控件 */
			    renderLayoutChildren : function(ct, target){
			        var items = ct.items;
			        for(var i = 0, len = items.length; i < len; i++) {
			            var c = items[i],
							itemTarget = this.getItemTarget(c, i);
			            if(c && (!c.rendered/* || !this.isValidParent(c, itemTarget)*/)){
			                this.renderItem(c, itemTarget);
			            }
			        }
			    },
			    /**
				 * 返回控件comp即将被render到的dom
				 * @param comp
				 * @param index comp在items中的index
				 */
				getItemTarget : function(comp, index) {
					return comp.container || this.getRenderTarget();
				},

			    /** 把控件c渲染到target中 */
			    renderItem : function(c, target){
			        if(c && !c.rendered){
			            c.doRender(target);
			        } else if(c && !this.isValidParent(c, target)){
			            target.insertBefore(c.getEl());
			            c.container = target;
			        }
			    },

				layout : function(panelWidth, panelHeight) {
					var ct = this;
			        if(ct.items && ct.items.length != 0) {
						var ul = $("ul.ui-tabs-nav", ct.el),
							body = $(ct.el.children(".ui-tabs-body"));
						
				    	body.width(panelWidth);
						// 设置body高度，使滚动条局限在body里，不影响TAB header
						body.height(panelHeight - ul.outerHeight(true));
				    	$(".ui-tabs-header", this.el).width(panelWidth - 30);
						
						tab = ct.items[ct.activeTab];
						if(tab) {
							if(tab.activeItem) {
								tab = tab.activeItem;
							}
							tab.setWidth(body.width());
							tab.setHeight(body.height());
							if(tab.hasLayout) {
								tab.doLayout(tab.getWidth(), tab.getHeight());
							}
							
							if(ct.selectedTab) {
								$(".ui-tabs-header", ct.el).scrollLeft(ct.selectedTab.position().left - $(".ui-tabs-header", ct.el).width() + ct.selectedTab.width());
							}
						}
					}
			        
			        ct.setDropBtnView();
			        ct.setTabListColor();
				},
				beforeLayoutRender : function() {
					var ct = this,
						target = ct.getRenderTarget(),
						items = ct.items,
						item;

					var ul = $('<ul/>');
					var header = $("<div></div>").addClass("ui-tabs-header").appendTo(target).append(ul);
					
					var tabs_list = ct._dropBtn = $("<span></span>").addClass("ui-tabs dropdownBtn").appendTo(target);
					ct._dropView = $('<div><ul/></div>').addClass('ui-tabs tabs-list');
					$(document.body).append(ct._dropView);
					
					ul.addClass("ui-tabs-nav ui-corner-all");

					// 添加body使滚动条不影响header
					var body = $('<div>').addClass('ui-tabs-body').appendTo(target);

					for(var i=0,len=items.length; i<len; i++) {
						item = items[i];
						item.id = item.id || YIUI.allotId();
						if(!item.title) {
							item.title = item.caption;
						}
						var _li = $(YIUI.Panel.TabPanel.prototype.tabTemplate.replace(/#\{href\}/g, "#" + item.id).replace(/#\{title\}/g, item.title)).appendTo(ul);
						if(i == 0) {
							ct.selectedTab = _li;
							ct.activeTab = 0;
						} else {
						}
						_li.addClass("ui-state-default ui-corner-top").attr("aria-controls", item.id);
						$("[href=#"+item.id+"]", _li).addClass("ui-tans-anchor");
						$("[href=#"+item.id+"] label", _li).addClass("ui-anchor-label");
						var _div = $('<div>').attr('id', item.id).appendTo(body);
						item.container = _div;
						_div.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
						
						if(i == 0) {
							_li.toggleClass("aria-selected");
							_div.toggleClass("aria-show");
						}

					}
				},

				afterLayoutRender : function() {
					var container = this.container;
					var body = $(container.el.children()[1]),
						overflow = body.css('overflow');
				}

		}
		return Return;
	};

	var timerTask = function(key,enable,cxt,delay,period,content,form){
		this.enable = enable;
		this.cxt = cxt;
		this.delay = delay;
		this.period = period;
		this.content = content;
		this.form = form;
		this.key = key
	}
	timerContent = {};
	timerArray = {};
	timerTask.prototype = {
			startTimer : function(){
				var enable = this.enable;
				var cxt = this.cxt;
				var form = this.form;
				var period = this.period;
				var delay = this.delay;
				var content = this.content;
				var key = this.key;
				setTimeout(function(){
					timerArray[form.formID + key] = setInterval(function(){
						var timerkey = timerArray[form.formID + key];
						if (window.tab.ofFormID == form.formID && enable == true && $(".dialog-mask").length <= 0) {
							try {
								form.eval(content,cxt,null);
							} catch(err) {
								clearInterval(timerkey);		
							}
						} 	               
	        		},period);        
	            },delay);

			}
	}
})();(function() {
	YIUI.MainTree = function(rootEntry, dom, container){
		$("ul.tm", dom).remove();
    	var el = $("<ul></ul>").addClass("tm").appendTo(dom);
     	var options = {
			el: el,
			_open: false,
			menuType: rootEntry.style,
			_openedItem: null,
			_data: [],
			rootEntry: rootEntry,
			clickEvent: {
                expandNode: function($this, self) {
                   //展开
                    var nodeId = $this.attr("id");
                    var node = self.getTreeNode(nodeId);
                    self.callback.beforeExpand(node);
                    var expandNode = node.id + "-" + self.el.attr("id");
                    if(!node.isLoaded) {
                        node.isLoaded = true;
                    }        

                    $this.next().show();
                    $this.removeClass("close collapse").addClass("open expand cursel");
                    $this.parent().addClass("sel");
                    $this.parent().siblings().find('.open.expand').removeClass("open expand cursel").addClass("close collapse").next().hide();  
                },

			    collapse: function($this, self) {
                   //up
                    if($this.has("open expand")){
                        $this.parent().removeClass("sel");
                        $this.parent().find(".open.expand").removeClass("open expand cursel").addClass("close collapse").next().hide();
                    }   		    	
			    },


			    selectNode: function($this, self) {
			    	var id = $this.attr("id");
			    	var treeId = self.el.attr("id");
			    	if(self.selectedNodeId) {
			    		$("#" + self.selectedNodeId).removeClass("clicked");
			    		$("#" + self.selectedNodeId).parent().removeClass("clicked");
			    	}
			    	self.selectedNodeId = id;
			    	$("#" + id).addClass("clicked");
			    	$("#" + id).parent().addClass("clicked");
			    	self.callback.onSelect($this, $("#" + treeId), self.getTreeNode(id));
			    }
			},
			callback: $.extend({
				beforeExpand: $.noop,
				onSelect: function($this, $tree, node){
					if(node.children) {
						if(self.menuType == YIUI.TREEMENU_TYPE.GROUPTREE) {
							$("#" + node.id + " span.icon").click();
						} else if(self.menuType == YIUI.TREEMENU_TYPE.TREE) {
							if($("#" + node.id).attr("open")) {
								self.clickEvent.collapse($this, self, null);
								$("#" + node.id).attr("open", false);
								$(this).removeClass("cursel");
								$(this).parent().removeClass("sel");
							} else {
								self.clickEvent.expandNode($this, self, null);
								$("#" + node.id).attr("open", true);
								$(this).addClass("cursel");
								$(this).parent().addClass("sel");
							}
						}
					} else {
						YIUI.EventHandler.doTreeClick(node, container);
					}
				}
			}),
		    getTreeNode: function(nodeId) {
	    		for (var i = 0, len = this._data.length; i < len; i++) {
	   				if(this._data[i].id == nodeId) {
	   					return this._data[i];
	   				}
	   			}
                
    		},
    		initDataSource: function(dataSource) {
            	if(dataSource) {
            		if(!dataSource.length) {
            			dataSource = $(dataSource);
            		}
            		var data;
            		for (var i = 0, len = dataSource.length; i < len; i++) {
        				data = dataSource[i];
        				if(!data.id) {
        					data.id = data.key + i;
        				}
        				if(data.children) {
        					data.isParent = true;
        					this.initDataSource(data.children);
        				}
        			}
            	}
            },
            dataSourceCopy: function(dataSource, parentID){
            	if(dataSource) {
            		if(!dataSource.length) {
            			dataSource = $(dataSource);
            		}
            		for (var i = 0, len = dataSource.length; i < len; i++) {
            			var ds = dataSource[i];
            			var parent = ds.parent;
            			var d = new Object();
            			d.name = ds.name;
            			d.id = ds.id;
            			d.itemKey = ds.itemKey;
            			d.layerItemKey = ds.layerItemKey;
            			if(ds.isLoaded) {
            				d.isLoaded = ds.isLoaded;
            			} else {
            				d.isLoaded = false;
            			}
            			if(ds.children && ds.children.length > 0) {
            				d.open = ds.open;
            				var children = [];
            				for (var j = 0, length = ds.children.length; j < length; j++) {
            					var child = ds.children[j];
            					children.push(child.id);
            					this.dataSourceCopy($(child), ds.id);
            				}
            				d.children = children;
            			} else {
            				d.key = ds.key;
            				d.formKey = ds.formKey;
            				d.paras = ds.parameters;
            				d.single = ds.single;
            				d.target = ds.target;
            			}
            			d.path = ds.path;
            			if(ds.parent) {
            				d.parentId = ds.parent.id;
            			}
            			if(parentID) {
            				d.parentID = parentID;
            			}
            			this._data.push(d);
            		}
            	}
        	},
        	/** 构建树结构 */
    	    buildTreenode: function(el, nodes, parentId) {
    	    	if(!nodes) {
    	    		return;
    	    	}
    	    	if(!nodes.length) {
    	    		if(!parentId) {
    	    			nodes = nodes.children;
    	    		}
    	    	}

    	    	nodes && this.addChilds(nodes, parentId, 0, this);
    	    },

    	    calcBoolean: function(str) {
    	    	if(!this.parser) {
    	    		this.parser = new View.Parser();
    	    	}
				return this.parser.eval(str);
    	    },
            addChilds: function(nodes, parentId, level, options) {
                
                if(nodes.length <= 0) {
                    if(parentId) {
                        $("#" + parentId, options.el).next().remove();
                        $("#" + parentId, options.el).children().first().removeClass("tm-collapse");
                    }
                    return;
                }
                
                var node, nid,
                    isTree = options.menuType != YIUI.TREEMENU_TYPE.GROUPTREE ? true : false;
                if(parentId) {
                    var parentNode = options.getTreeNode(parentId);
                    parentNode.children = [];
                }
                if(isTree) options.el.addClass("tree");
                for (var i = 0, len = nodes.length; i < len; i++) {
                    node = nodes[i];
                    nid = node.id;
                    node.parentId = parentId;

    				var isVisible = node.visible == "" ? true : this.calcBoolean(node.visible);
    				if(!isVisible) continue;
    				
                    var _li = $("<li class='tm-node' level='"+level+"'></li>").attr("path", node.path);
                    if(node.single) {
                      _li.attr("single", "true").attr("formKey", node.formKey).attr("paras", node.parameters);
                    }
                    if(node.target) {
                    	_li.attr("target", node.target);
                    }
                    if(!node.parentId) {
                        _li.addClass("top-level");
                    }
                    if(parentId) {
                        parentNode.children.push(nid);
                        _li.appendTo($("#" + parentId, options.el).next());
                    } else {
                        _li.appendTo(options.el);
                    }
                    
                    var _a = $("<a id='"+ nid +"' class='tm-anchor'></a>").appendTo(_li),
                        _ul;
             
                    if(node.isParent){
                        if(level == 1){
                            _a.css({
                                "backgroundPosition": 30,
                                "padding-left" : 50
                            }); 
                        }
                        if(level >1){
                           var disX = level * 8 + 50;
                            _a.css({
                                "backgroundPosition": disX ,
                                "padding-left" : disX + 15 + 'px'
                            }).addClass('multi-level'); 
                        }
                    }else{
                        if(level == 1 ) _a.css("padding-left" , 50); 
                        if(level >1 ) _a.css("padding-left" , level * 8 + 50).addClass('multi-level'); 
                    }


                    
                    if(node.isParent) {
                        _li.addClass("isparent");
                        _ul = $("<ul class='tm-ul'></ul>");
                        if(node.open && !options._isOpen && !node.parentId) {
                            _li.addClass("sel");
                            _a.addClass("cursel open expand").attr("open", true);
                            options._isOpen = true;
                            options._openedItem = _a;
                        } else {
                            _a.attr("open", false).addClass("close collapse");
                            _ul.css("display", "none");      
                        }               
                         _ul.appendTo(_li);                       
                    }   
            
                    var _span = $("<span class='tm-name'>" + node.name + "</span>").appendTo(_a);
                   
                    if(node.icon){
                       var  _img = $("<img>");
                            _img
                                .one("error",function(){
                                    $(this).attr("src","yesui/ui/res/css/blue/images/not-exist.png");
                                })
                                .attr("src","Resource/"+node.icon)
                                .css({
                                    "vertical-align":"middle",
                                    "display":"inline-block",
                                    "margin-right":5
                                })
                                .prependTo(_span);
                    }
                    
                    if(node.children) {
                         this.addChilds(node.children, node.id, level+1, options);
                    } else {
                        _a.addClass("noExpand");
                    }
                }                             
            },



    	    install: function() {
    	    	var self = this;
    	    	self.el.delegate("a", "click", function(e) {
    	    		if($(this).hasClass("open")) {
    	    			self.clickEvent.collapse($(this), self);
    	    			return;
    	    		}
    	    		if($(this).hasClass("close")) {
    	    			self.clickEvent.expandNode($(this), self);
    	    			return;
    	    		}
    	    	});
    	    	self.el.delegate("a","dblclick", function(e) {
    	    		if($(this).hasClass("noExpand")) {
    	    			self.clickEvent.selectNode($(this), self);
    	    			return;
    	    		}
    	    	});
    	    },
    		init: function() {
    			this.initDataSource(this.rootEntry);
    			this.dataSourceCopy(this.rootEntry.children);
    			this.buildTreenode(this.el, this.rootEntry);
    			this.install();
    	    },
    	    reload: function(entry) {
    	    	this.el.empty();
            	this._data = [];
    			this.initDataSource(entry);
    			this.dataSourceCopy(entry.children);
    	    	this.buildTreenode(this.el, entry);
    	    }

    	}
	    options.init();
	    return options;
	};
})();