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

    init: function (options) {
        this.base(options);
        var meta = this.getMetaObj();
        this.sourceType = meta.sourceType || this.sourceType;
        this.image = meta.image || this.image;
        this.stretch = meta.stretch || this.stretch;
        this.maxSize = meta.maxSize || this.maxSize;
        this.imageCut = meta.imageCut || this.imageCut;
        this.clickContent = $.isUndefined(meta.onClick) ? "" : meta.onClick.trim();
    },
    
    setEnable: function(enable) {
    	this.base(enable);
    	if(this.el) {
    		this._image.enable = enable;
    	}
    },
    
    setValue: function (value, commit, fireEvent) {
    	var sourceType = this.sourceType;
    	if(!this.isNull() && sourceType == YIUI.IMAGE_SOURCETYPE.RESOURCE) return false;
    	var changed = this.base(value, commit, fireEvent);
    	if(!changed) return false;
        this._image.setValue(value);
        if(!value) {
        	this._image.getImage().attr("src", YIUI.Image.EmptyImg);
        } else if (sourceType == YIUI.IMAGE_SOURCETYPE.DATA) {
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

    onRender: function (ct) {
        this.base(ct);
        var _this = this;
        var array = new Array("gif", "jpg", "jpeg", "png", "bmp");
        this._image = new YIUI.Yes_Image({
            el: _this.el,
            sourceType: _this.sourceType,
            stretch: _this.stretch,
            maxSize: _this.maxSize,
            imageCut: _this.imageCut,
            uploadImg: function ($this, paras) {
                var self = _this;
                var form = YIUI.FormStack.getForm(self.ofFormID);
                var submit = function (btn) {
                    var isAllowd = $.checkFile(btn, _this.maxSize, array);
                    if (!isAllowd || form.getOID() == -1) return;

                    paras = $.extend({
                        service: "UploadImage",
                        controlKey: self.key,
                        formKey: form.formKey,
                        operatorID: $.cookie("userID"),
                        fileID: -1,
                        oid: form.getOID(),
                        mode: 1
                    }, paras);
                    $.ajaxFileUpload({
                        url: Svr.SvrMgr.AttachURL,
                        secureuri: false,
                        fileElement: btn,
                        data: paras,
                        type: "post",
                        success: function (data, status, newElement) {
                            newElement.attr("accept", "image/jpeg,image/jpg,image/png,image/bmp,image/gif");
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
            click: function() {
            	if (_this.enable) {
                    if (_this.isNull() && !self.image)
                        return;
                    _this.handler.doOnClick(_this.ofFormID, _this.clickContent);
                }
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