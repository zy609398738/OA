# About

This is a tool to create `src/index.js` which include "window._require" function to make html-inline scripts could get modules dynamicly.

For example, in html the code should like:
```html
<script>
var doTestBizUtils = function(){
    _require("biz-utils", function(util){
        alert("stdDate2String="+util.stdDate2String(new Date()));
    });
}
... ...
</script>
```

## Dependencies
No dependencies except Node.js build-in modules.

## END