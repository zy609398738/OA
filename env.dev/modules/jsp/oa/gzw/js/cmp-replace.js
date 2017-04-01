void function ( Ext ) {
    /**
     * @param componentReplacements
     * 元素格式：
     * 'bill_metaKey': {
     *     'original_cmp_xtype': 'replaced_cmp_xtype',  // 简单定义
     *     'original_cmp_xtype': {                      // 含默认配置的定义
     *         replaceWith: 'replaced_cmp_xtype',  // optional
     *         defaults: {}  // 默认配置，将和原始配置合并为最终配置
     *     },
     *     'original_cmp_xtype': {                      // 含经过函数计算出配置的定义
     *         replaceWith: 'replaced_cmp_xtype',  // optional
     *         getConfig: function (originalConfig, req, resp) {
     *         // 该计算函数，传入原始配置，返回新配置(即为最终配置)  函数中this为 MAP_UIOptCenter
     *              // setup new options here, ...
     *              return  newOptions;
     *         }
     *     },
     *     // 根据原始配置及req,resp, 计算组件替换定义
     *     // 比如 单据中只是部分A类型组件需要替换，可根据__key，不需要替换的返回null即可。
     *     // 函数中this为 MAP_UIOptCenter
     *     'original_cmp_type': function(originalConfig, req, resp) {
     *          return null or 简单定义 or 含默认配置的定义 or 含经过函数计算出配置的定义;
     *     }
     * },
     * 'another_bill_metaKey': 'bill_metaKey',  // 表示 another_bill_metaKey 参照 bill_metaKey.
     * 'another_bill_metaKey_x': ['A', 'B'] // 表示 another_bill_metaKey_x 参照 A, B的组合。
     *
     * 特别的： 针对所有单据有效的组件替换定义。优先级低于单据的具体替换定义。 慎用！
     * _ALL_: ...
     */
    Ext.replaceCmpConfig = function (/*Object*/componentReplacements) {
        cmpReplacements = Ext.apply(componentReplacements || {}, cmpReplacements || null);
    };

    var cmpReplacements = null;
    function searchAndReplaceCmpConfig(/*Object*/billForm, /*Function*/condition, /*Function*/callback) {
        var objectsVisited = [], countVisited = 0, self = this;

        function visit(/*Object*/obj) {
            if (objectsVisited.indexOf(obj) >= 0) {
                return;
            }
            objectsVisited[countVisited++] = obj;

            if (Ext.isArray(obj)) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    visit(obj[i]);
                }
            } else if (Ext.isObject(obj)) {
                if (condition.call(self, obj)) {
                    callback.call(self, obj);
                    return;
                }
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        visit(obj[p]);
                    }
                }
            }
        }

        visit(billForm);

        objectsVisited = null;
    }

    function getRefReplacements(ref) {
        // 组件替换配置 在单据之间参照。
        if (Ext.isString(ref) && ref) {
            return cmpReplacements[ref];
        } else if (Ext.isArray(ref)) {
            var refReplacements = {};
            Ext.each(ref, function (refItem) {
                Ext.apply(refReplacements, cmpReplacements[refItem.substring(4)]);
            });
            return refReplacements;
        }

        return ref;
    }

    function isNullOrEmptyObject(/*Object*/obj) {
        if ( obj && Ext.isObject(obj) ) {
            for (var p in obj) {
                if ( obj.hasOwnProperty(p) ) {
                    return false;
                }
            }
        }

        return true;
    }

    MAP_UIOptCenter.on('beforedealcmd', function(req, resp){
        if (!cmpReplacements || !resp || !Ext.isObject(resp) || !resp.metaKey || !resp.billform) return;
        var replacements = Ext.applyIf(getRefReplacements(cmpReplacements[resp.metaKey]) || {},
            getRefReplacements(cmpReplacements['_ALL_']));
        if (isNullOrEmptyObject(replacements)) return;

        // 搜寻需要替换的组件，并替换之。
        searchAndReplaceCmpConfig( resp.billform,
            function ( cmpConfig ) {
                return cmpConfig.__key && cmpConfig.xtype && true;
            },
            function ( cmpConfig ) {
                var replc = replacements[cmpConfig.xtype];
                if ( !replc ) return;

                if ( Ext.isFunction(replc) ) {
                    replc = replc.call(this, cmpConfig, req, resp);
                }
                if ( !replc ) return;

                if ( Ext.isString(replc) ) {
                    cmpConfig.xtype = replc;
                } else if ( Ext.isObject(replc) ) {
                    if ( Ext.isObject(replc['defaults']) ) {
                        Ext.apply(cmpConfig, replc['defaults']);
                    }
                    else if ( Ext.isFunction(replc['getConfig']) ) {
                        var newConfig = replc['getConfig'].call(this, cmpConfig, req, resp);
                        for ( var p in cmpConfig ) {
                            if ( cmpConfig.hasOwnProperty(p) ) {
                                delete cmpConfig[p];
                            }
                        }
                        Ext.apply(cmpConfig, newConfig);
                    }

                    if ( Ext.isString(replc['replaceWith']) && replc['replaceWith'] ) {
                        Ext.apply(cmpConfig, {xtype: replc['replaceWith']});
                    }
                }
            }
        );
    });
} (window.Ext);