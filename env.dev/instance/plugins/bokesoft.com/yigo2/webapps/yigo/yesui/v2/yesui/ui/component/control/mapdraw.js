/**
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

    isDataBinding: function() {
        return false;
	},
    
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
        url += "&ctlKey=" + this.key;    

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
        this.url && this.setURL(this.url);

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
    
    /**
     * 给DOM添加事件监听。
     */
    install: function () {
        var self = this;
        
    }
});
YIUI.reg('map', YIUI.Control.MapDraw);