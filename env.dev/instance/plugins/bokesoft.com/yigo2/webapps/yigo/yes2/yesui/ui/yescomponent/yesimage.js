(function () {
    YIUI.Yes_Image = function (options) {
        var Return = {
            el: $("<div></div>"),
            sourceType: YIUI.IMAGE_SOURCETYPE.DATA,
            image: "",
            stretch: false,
            imageCut: false,
            enable: true,
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
            setValue: function (path) {
                this.value = path;
            },
            uploadImg: $.noop,
            change: $.noop,
            click: $.noop,
            commitValue: $.noop,
            
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
                    self.click();
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
                	var enable = self.enable;
                    if ($(".opt", self.el).length == 0) {
                        var disPlay = (self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA && enable) ? "block" : "none",
                            optBar = $("<div class='bar'></div>").appendTo(self.el),
                            upload = $("<span class='opt upload' title='" + $.ygrid.cell_imgOpt.open + "'/>").appendTo(self.el),
                            show = $("<span class='opt show' title='" + $.ygrid.cell_imgOpt.show + "'/>").appendTo(self.el),
                            clear = $("<span class='opt clear' title='" + $.ygrid.cell_imgOpt.clear + "'/>").appendTo(self.el),
                            uploadBtn = $("<input type='file' name='file' data-url='upload' class='opt upbtn' accept='image/jpeg,image/jpg,image/png,image/bmp,image/gif' title='" + $.ygrid.cell_imgOpt.open + "'/>").appendTo(self.el);
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
                    } else {
                    	if(self.sourceType == YIUI.IMAGE_SOURCETYPE.DATA && enable) {
                            $(".opt,.bar", self.el).show();
                            $(".opt.show", self.el).css({left: (self.el.width() - 46) + "px", top: (self.el.height() - 22) + "px"});
                    	} else {
                            $(".opt.show,.bar", self.el).show();
                    	}
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
})();