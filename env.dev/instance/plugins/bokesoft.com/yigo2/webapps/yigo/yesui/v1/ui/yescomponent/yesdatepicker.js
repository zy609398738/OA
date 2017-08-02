(function () {
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
                		
                		var val = self.getInput().val();
                		if (val == "") {
                			var date = new Date().Format("yyyy-MM-dd")
                			var hour = $("input",self.detailTime)[0].value;
                			var minute = $("input",self.detailTime)[1].value;
                			var second = $("input",self.detailTime)[2].value;
                			hour = hour < 10 ? 0 + hour : hour;
                			minute = minute < 10 ? 0 + minute : minute;
                			second = second < 10 ? 0 + second : second;
                			
                			
                			self.setValue(date + " " + hour + ":" + minute + ":" + second );
                			
                		}
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
})();