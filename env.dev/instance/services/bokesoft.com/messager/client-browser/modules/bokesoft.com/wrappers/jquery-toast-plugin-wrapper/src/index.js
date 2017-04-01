"use strict";

/* The implementations */
window.jQuery=window.$=require("jquery");
require("ztree");
require("./style.css");
require("ztree/css/zTreeStyle/zTreeStyle.css");



/** Define the export point for module */
module.exports = {
    Test: $.zTree
}
