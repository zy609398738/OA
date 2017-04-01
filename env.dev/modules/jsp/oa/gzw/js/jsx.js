String.prototype.format = /*String.prototype.format || */function() {
    var args = arguments, argLen = arguments.length;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }  // 可以使用 {{ 转义, 代表 { 字符
        if (m == "}}") { return "}"; }  // 可以使用 }} 转义, 代表 } 字符
        return n < argLen ? args[n] : ('{' + (n - argLen) + '}'); // 多余{n} 未匹配的元素将保留，并从{0}开始
      });
};

String.prototype.addUrlParam = function(/*String/Object*/urlParams){
    if (!urlParams) {
        return '' + this;
    }

    var params = jQuery.isPlainObject(urlParams) ? jQuery.param(urlParams) : urlParams,
        concatChar = this.indexOf('?') > 0 ? '&' : '?';
    return this + concatChar + params;
};

String.prototype.equalsIgnoreCase = function(/*String*/anotherString){
    return typeof anotherString === 'string' ? this.toUpperCase() === anotherString.toUpperCase() : false;
};

Array.prototype.remove = Array.prototype.remove || function (o) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] == o) {
            this.splice(i, 1);
            break;
        }
    }
    return this;
};