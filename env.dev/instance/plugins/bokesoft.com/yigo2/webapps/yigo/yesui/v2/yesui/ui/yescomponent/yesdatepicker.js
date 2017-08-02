(function () {
    YIUI.Yes_DatePicker = function (options) {
        var Return = {
            el: $("<div></div>"),
            id:"",
            dropView: $("<div class='dp-vw'></div>"),
            formatStr: "yyyy-MM-dd HH:mm:ss",
            isOnlyDate: false,
            enable: true,
            editable: true,
            calendars: 1,
            _needShow : false,
            init: function () {
                this.id = this.id || this.el.attr("id");
                this._input = $("<input type='text' class='txt'>").appendTo(this.el);
                this._btn = $("<span class='arrow'></span>").appendTo(this.el);
                this.initDatePicker();
                this.temp = "";
            },
		    isEnable: function() {
		    	return true;
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
            setText: function (text) {
                this._input.val(text);
                this.temp = text;
            }, 

            setFormatStr: function () {
                if (this.isOnlyDate) {
                    this.formatStr = "yyyy-MM-dd";
                } else {
                    this.formatStr = "yyyy-MM-dd HH:mm:ss";
                }
            },
            setOnlyDate: function (isOnlyDate) {
                this.isOnlyDate = isOnlyDate;
            },
            setWidth: function (width) {
                this.el.css('width', width);
                this.getInput().css('width', width);
                this.getBtn().css({ left: this.el.outerWidth() - 26 + "px"});
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
            
            commitValue: $.noop,
            
            doFocusOut: $.noop,

            initDatePicker: function () {
                var self = this;
                this.getInput().attr("id", "dateInput_" + this.id);
                this.getInput().DateTimeMask({masktype: (this.isOnlyDate ? 3 : 1)});
                this.getBtn().attr("id", "dateImg_" + this.id);
                this.setFormatStr();
                this.install();
            },
            
            initDropView: function() {
            	if (!this.dropView.is(":hidden")) {
            		this.dropView.remove();
            	}
                this.dropView = $("<div class='dp-vw'></div>");
                this.dropView.attr("id", this.id + "_datepickerView");
                this.dropView.html("");
                var self = this;
                this.dropView.DatePicker({
                    flat: true,
                    format: self.formatStr,
                    date: [new Date()],
                    current: self.getInput().val(),
                    starts: 7,
                    onChange: function (formated) {
                    	var text = formated;
                        if (!self.isOnlyDate) {
                        	var time = formated.split(" ")[1];
                        	if(self.getInput().val().split(" ")[1]) {
                        		time = self.getInput().val().split(" ")[1];
                        	}
                        	text = formated.split(" ")[0] + " " + time;
                            self.getInput().val(text);
                        } else {
                            self.getInput().val(text);
                        	self.hideDateView();
                        }
                    }
                });
                this.detailTime = $("<div class='time'></div>");
                if (!this.isOnlyDate) {
                	$("<button class='btn'>"+YIUI.I18N.date.today+"</button>")
                	.click(function () {
                		self.getInput().val((new Date()).Format(self.formatStr));
                		self.hideDateView();
                	}).appendTo(this.detailTime);
                	$("<button class='btn'>"+YIUI.I18N.date.confirm+"</button>")
                	.click(function () {
                    	self.hideDateView();
                	}).appendTo(this.detailTime);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 23}).data("index", 0);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 59}).data("index", 1);
                	$("<input/>").appendTo(this.detailTime).spinit({max: 59}).data("index", 2);
                	this.detailTime.appendTo(this.dropView);
                }

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
//            setDropViewTop: function () {
//                var cityObj = this.getInput();
//                var cityOffset = this.getInput().offset();
//                var bottom = $(window).height() - cityOffset.top - this.el.height();
//                var top = cityOffset.top + cityObj.outerHeight();
//                if (bottom < this.dropView.outerHeight()) {
//                    this.dropView.addClass("toplst");
//                    this.el.addClass("toplst");
//                    top = cityOffset.top - this.dropView.outerHeight();
//                } else {
//                    this.dropView.removeClass("toplst");
//                    this.el.removeClass("toplst");
//                }
//                if (top != "auto") {
//                    this.dropView.css("top", top + "px");
//                }
//            },
//            setDropViewLeft: function () {
//                var cityObj = this.getInput();
//                var cityOffset = this.getInput().offset();
//                var right = $(window).width() - $(this.getInput()).offset().left;
//                var left = $(window).width() - this.dropView.outerWidth();
//                if (right < this.dropView.outerWidth()) {
//                    left = "auto";
//                    right = $(window).width() - cityOffset.left - cityObj.outerWidth();
//                } else {
//                    left = cityOffset.left;
//                    right = "auto";
//                }
//                if (left != "auto") {
//                    this.dropView.css("left", left + "px");
//                    this.dropView.css("right", "auto");
//                }
//                if (right != "auto") {
//                    this.dropView.css("right", right + "px");
//                    this.dropView.css("left", "auto");
//                }
//            },
            hideDateView: function() {
                this.dropView.remove();
                if (this.getInput().val()) {
                    var inputValue = this.getInput().val();
            		this.temp = inputValue;
                    var date = inputValue.substring(0, inputValue.split(" ")[0].length);
                    var time = inputValue.split(" ")[1];
                    if(!time) {
                    	date = date + " "
                    	time = "00:00:00";
                    }
                    var text = date + " " + time;
                    this.getInput().val(text);
                    text = text.replace(/-/g, "/");
                    var value = new Date(text);
                    this.commitValue(value);
                }else{
                    this.commitValue(null);
                }
                this.hasShow = false;
            },
            
            install: function () {
                var self = this;
//                $(window).resize(function () {
//                	self.hideDateView();
//                    $(document).off("mousedown.datePicker");
//			    });
                this.getBtn().mousedown(function(e){
                    self._needShow =  !self._hasShow ? true : false; 
                }).click(function (event) {
                    if (!self.isEnable()) {
                        return;
                    }
                    self.getInput().focus();

                    if (self.hasShow) {
                    	self.hideDateView();
                        return;
                    }
                    
                    self.initDropView();
                    $(document.body).append(self.dropView);
                    
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
                    self.dropView.css({
//                    	"min-width": "210px", 
//                    	"min-height": "205px",
                    	height: "205px",
                        width:  width
                    });
                    self.dropView.css("z-index", $.getZindex(self.getInput()) + 1);

                    $(".datepicker", self.dropView).css({
                        width: self.calendars * 210,
                        height: self.dropView.height()
                    });
//                    self.setDropViewTop();
//                    self.setDropViewLeft();
                    YIUI.PositionUtil.setViewPos(self.getInput(), self.dropView, false);
                	self.dropView.slideDown(300, function(){
	                    $(document).on("mousedown.datePicker", function (e) {
	                        var target = $(e.target);
	                        if ((target.closest(self.dropView).length == 0)
	                            && (target.closest(self.getInput()).length == 0)
	                            && (target.closest(self.getBtn()).length == 0) && !self.dropView.is(":hidden")) {
	                        	self.hideDateView();
	                            $(document).off("mousedown.datePicker");
	                        }
	                    });
	    	    	});
                    self.hasShow = true;
                    self._needShow = false;
                    event.stopPropagation();
                });
                $("input", self.el).bind("blur", function (e) {
                    if(self._needShow){
                        return;
                    }
           
                    if(self.hasShow){
                        return;
                    }

                	var text = self.getInput().val();
         
               	    if(text != self.temp) {
                    	var value = null;
                    	self.temp = text;
                    	if(!text.isEmpty()) {
                        	if(self.isOnlyDate) {
                        		text += " 00:00:00";
                        	}
                            text = text.replace(/-/g, "/");
                        	value = new Date(text);
                    	}
                    	self.commitValue(value);
                    }
                    self.doFocusOut();
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