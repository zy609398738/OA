/**
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
YIUI.reg('image', YIUI.Control.Image);