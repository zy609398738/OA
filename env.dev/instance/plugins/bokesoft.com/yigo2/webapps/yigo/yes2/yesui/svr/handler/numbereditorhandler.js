YIUI.NumberEditorHandler = (function () {
    var Return = {
			        decPrecision: 16,
			        
			        decScale: 2,

			        showZero: false,

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

			            if(meta.useGroupingSeparator == false){
			                //TODO 这个地方应该根据区域自动设置
			                 //组分割符
			                settings.sep = '';
			            }

			            settings.roundingMode = $.isDefined(meta.roundingMode) ? meta.roundingMode : this.roundingMode;

			            return settings;
			            // this.settings = {
			            //     aNum: '0123456789',

			            //     aSep: this.sep,
			            //     //最大值
			            //     vMax: maxNumber,
			            //     //最小值
			            //     vMin: '-' + maxNumber,
			            //     //小数位数
			            //     mDec: this.decScale,
			            //     //四舍五入方式
			            //     mRound: this.roundingMode
			            // };
       			 	}

    			 };	
    Return = $.extend({}, YIUI.Handler, Return);
    return Return;
})();