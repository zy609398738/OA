/**
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
});