YIUI.PositionUtil = (function (options) {
    var Return = {
    		
    	settings: {
    		resetWidth: true
    	},
    	
		setViewPos: function($dom, $view, resetWidth) {
			this.setViewTop($dom, $view);
			this.setViewLeft($dom, $view, resetWidth);
		},

	    setViewTop: function ($dom, $view) {
	        var cityObj = $dom;
	        var cityOffset = $dom.offset();
	
	        var bottom = $(window).height() - cityOffset.top - $dom.height();
	        var top = cityOffset.top + cityObj.outerHeight();
	        if (bottom < $view.outerHeight()) {
	            $view.addClass("toplst");
	            top = "auto";
	            bottom = $(window).height() - $($dom).offset().top;
	        } else {
	            $view.removeClass("toplst");
	            bottom = "auto";
	        }
	        if (top != "auto") {
	            $view.css({
	            	"top": top + "px",
	            	"bottom": "auto"
	            });
	        }
	        if (bottom != "auto") {
	            $view.css({
	            	"bottom": bottom + "px",
	            	"top": "auto"
	            });
	        }
	    },
	
	    setViewLeft: function ($dom, $view, resetWidth) {
	        var cityObj = $dom;
	        var cityOffset = $dom.offset();
	
	        var right = $(window).width() - $($dom).offset().left;
	        var left = $(window).width() - $view.outerWidth();
	        if (right < $view.outerWidth()) {
	            left = "auto";
	            right = $(window).width() - cityOffset.left - cityObj.outerWidth();
	        } else {
	            left = cityOffset.left;
	            right = "auto";
	        }
	        if (left != "auto") {
	            $view.css({
	            	"left": left + "px",
	            	"right": "auto"
	            });
	        }
	        if (right != "auto") {
	            $view.css({
	            	"right": right + "px",
	            	"left": "auto"
	            });
	        }
	        if(resetWidth) {
	        	$view[0].style.width = cityObj.outerWidth() + "px";
	        }
	    }

    };
    return Return;
})();