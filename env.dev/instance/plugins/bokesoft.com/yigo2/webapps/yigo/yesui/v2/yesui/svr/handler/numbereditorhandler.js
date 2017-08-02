YIUI.NumberEditorHandler = (function () {
    var Return = {
			        decPrecision: 16,
			        
			        decScale: 2,

			        showZero: false,

					useSeparator: true,

			        roundingMode: YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP,

    	        	getSettings: function (meta) {
			            var settings = {
			            	aNum: '0123456789'
			            };

			            var decPrecision = $.isDefined(meta.precision) ? meta.precision : this.decPrecision;
			            var decScale = $.isDefined(meta.scale) ? meta.scale : this.decScale;

			            var maxNumber = '';
			            for (var i = 0; i < decPrecision - decScale; i++) {
			                maxNumber += '9';
			            }
			            if (decScale > 0) {
			                maxNumber += '.';
			                for (var i = 0; i < decScale; i++) {
			                    maxNumber += '9';
			                }
			            }

						settings.vMax = maxNumber;
						settings.vMin = '-' + maxNumber;
						settings.mDec = decScale;

			            settings.roundingMode = $.isDefined(meta.roundingMode) ? meta.roundingMode : this.roundingMode;
                        settings.useSeparator = $.isDefined(meta.useSeparator) ? meta.useSeparator : this.useSeparator;

			            return settings;
       			 	}

    			 };	
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();