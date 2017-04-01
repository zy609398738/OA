void function(_) {
    /**
     * 覆盖 jQuery 自身的 $.fn.load
     * 目前只是为了 在 ajaxOptions中增加 target 属性
     */
    var _legacy_load = _.fn.load;
    _.fn.load = function(){
        _.ajaxSetup({
            target: this
        });

        _legacy_load.apply(this, arguments);

        _.ajaxSetup({
            target: null
        });
    };

    _.fn.toggleClassOnHover = function(clazz){
        var cls = clazz || 'hover';
        return this.hover(
                function(){_(this).addClass(cls)},
                function(){_(this).removeClass(cls)}
            );
    };

    _.fn.switchClass = function(/*String*/classOptionA, /*String*/classOptionB){
        return this.hasClass(classOptionA) ?
                    this.removeClass(classOptionA).addClass(classOptionB) :
                    this.removeClass(classOptionB).addClass(classOptionA);
    };

    _.fn.classLike = function(/*RegExp/Function*/matcher){
        if (!matcher) return null;

        var classes = this.attr('class') || '',
            classFound = null;

        var iterator = typeof matcher === 'function' ?
            function(){
                if (matcher.apply(this) === true) {
                    classFound = this;
                    return false;
                }
            } :
            function() {
                if (matcher && typeof matcher.test === 'function' && matcher.test(this) === true) {
                    classFound = this;
                    return false;
                }
            };

        _.each(classes.split(' '), iterator);

        return classFound;
    };

    _.fn.pagination = function() {
        var container = this.data('container'),
            currentUrl = this.data('current-url'),
            paramPage = this.data('param-page'),
            currentPage = this.data('current-page') - 1,
            pageMax = this.data('page-count') - 1;

        return this.find('.pagination').click(function(/*jQuery.Event*/evt){
                var $this = _(this),
                    page = $this.hasClass('pg-first') ? 0 :
                            ($this.hasClass('pg-last') ? pageMax :
                                ($this.hasClass('pg-prev') ? Math.max(currentPage - 1, 0) : Math.min(currentPage + 1, pageMax))
                            );
                !$this.hasClass('disabled') && _(container).load(currentUrl.addUrlParam(paramPage + '=' + page));

                return evt.preventDefault() && false;
            })
            .unSelectable()
            .andSelf();
    };

    _.hello = function(){
    return;
//    	var hour = (new Date()).getHours();
//		  return (hour >= 6 && hour <= 11) ? '上午好！' :
//                    ( (hour > 11 && hour < 13) ? '中午好！' :
//                        ((hour >= 13 && hour < 18) ? '下午好！' :
//                            ((hour >= 18 && hour <= 23) ? '晚上好！' : '夜深了！' )
//                        )
//                    );
    };

    _.fn.activeMenuItem = function(/*jQuery/String*/menuSearchCeil){
        var $menu = menuSearchCeil ? this.parentsUntil(menuSearchCeil, '.menu:first') : this.closest('.menu');
        if ($menu.size() > 0) {
            $menu.find('.active').removeClass('active');
            return this.addClass('active');
        }
        return this;
    };

    _.triggerOfDefaultElementIn = function(/*jQuery/String*/container) {
        return function() {
            _(container).find('.trigger-default').trigger('click');
        }
    };

    _.fn.visibleOn = function(/*Boolean*/condition){
        return !!condition ? this.show() : this.hide();
    };

    _.fn.flyPagination = function(options){
        var opts = _.extend(true, {}, _.fn.flyPagination.defaults, options || {}),
            pageSize = this.data('page-size') || opts.pageSize,
            items = this.find(opts.itemSelector),
            itemSize = items.size(),
            pageCount = Math.ceil(itemSize / pageSize);

        if (pageCount <= 1) {
            return this;
        }

        var $pg = _(opts.paginator), $pgHolder = $(opts.paginatorHolder);
        if ($pgHolder.exists()) {
            $pg.appendTo($pgHolder);
        } else {
            $pg.insertAfter(this);
        }
        if (!$pgHolder.exists() && !!opts.visibleOnHover) {
            $pg.hide();
            this.parent().hover(
                function(){$pg.show();},
                function(){$pg.hide();}
            );
        }

        var $first = $pg.find(opts.paginatorSelectors.first).unSelectable(),
            $prev  = $pg.find(opts.paginatorSelectors.prev).unSelectable(),
            $next  = $pg.find(opts.paginatorSelectors.next).unSelectable(),
            $last  = $pg.find(opts.paginatorSelectors.last).unSelectable();

        var pgMarginTop = $pg.css('marginTop');

        var currentPage = 1;

        var paginatorHandler = function(/*Function*/getPageTobe){
            return function(/*jQuery.Event*/evt){
                currentPage = Math.min(Math.max(getPageTobe(), 1), pageCount);

                var visibleIdxFrom = pageSize * (currentPage - 1),
                    visibleIdxTo   = pageSize * currentPage - 1;
                items.each(function(idx){
                    _(this).visibleOn(idx >= visibleIdxFrom && idx <= visibleIdxTo);
                });

                if (!!opts.showAvailableOptionOnly) {
                    $first.visibleOn(currentPage > 1 && pageCount > 2);
                    $prev.visibleOn(currentPage > 1);
                    $next.visibleOn(currentPage < pageCount);
                    $last.visibleOn(currentPage < pageCount && pageCount > 2);
                }

                if (!!opts.preserveHeightForLastPage) {
                    var lastPageShorten = pageSize - (itemSize % pageSize);
                    if (currentPage === pageCount && lastPageShorten > 0) { // last page
                        $pg.css('marginTop', _(items.get(0)).outerHeight(true) * lastPageShorten + 'px');
                    } else {
                        $pg.css('marginTop', pgMarginTop);
                    }
                }

                return evt.preventDefault() && false;
            };
        };

        $first.click(paginatorHandler(function(){return 1;})).trigger('click');
        $prev .click(paginatorHandler(function(){return currentPage - 1;}));
        $next .click(paginatorHandler(function(){return currentPage + 1;}));
        $last .click(paginatorHandler(function(){return pageCount;}));

        return this;
    };

    _.fn.flyPagination.defaults = {
        itemSelector: '>li',
        pageSize: 10,
        // paginatorHolder: ,  // visibleOnHover为true, 不支持。
        paginator: ['<div class="pg-ct">',
                    '<a class="pg-first" title="首页">|&lt;&lt;</a>',
                    '<a class="pg-prev" title="上一页">&lt;</a>',
                    '<a class="pg-next" title="下一页">&gt;</a>',
                    '<a class="pg-last" title="末页">&gt;&gt;|</a>',
                    '</div>'
                   ].join('\n'),
        paginatorSelectors: {
            first: '.pg-first',
            prev: '.pg-prev',
            next: '.pg-next',
            last: '.pg-last'
        },

        visibleOnHover: false,    // paginatorHolder 存在时，不支持
        showAvailableOptionOnly: true,
        preserveHeightForLastPage: true
    };

    _.fn.unSelectable = function () {
        return this.attr('unselectable', 'on')
                    .css({
                          MozUserSelect: 'none',
                          KhtmlUserSelect: 'none',
                          WebkitUserSelect: 'none',
                          userSelect: 'none'
                    })
                    .each(function() {
                        this.onselectstart = function(/*Event*/evt){
                            return evt.preventDefault() && false;
                        };
                    });
    };

    /**
     * 全局_urlParams， 因此此函数对ajax load来的页面无效
     * @param paramName
     * @return {*}
     */
    _.getUrlParam = function(/*String*/paramName){
        if (_._urlParams) {
            return _._urlParams[paramName];
        }
        var queryString = location.search;
        if (!queryString) {
            return null;
        }

        var paramArray = queryString.substring(1).split('&');
        _._urlParams = {};
        _.each(paramArray, function(){
            var nameValue = this.split('='),
                name = nameValue[0], value = decodeURIComponent(nameValue[1]);
            if (nameValue[0] in _._urlParams) {
                _._urlParams[name] = [value].concat(_._urlParams[name]);
            } else {
                _._urlParams[name] = value;
            }
        });

        return _._urlParams[paramName];
    };

    _.fn.exists = function(){
        return this.size() > 0;
    };

    _.fn.onlyOne = function() {
        return 1 === this.size();
    };

    _.fn.autoReload = function(options){
        options = options || {};
        return this.each(function(){
            var $this = _(this),
                url = $this.data('content-url') || options.url,
                interval = +$this.data('reload-interval') || options.interval;
            if (!url) return;

            if (interval) {
                window.setInterval(function(){$this.load(url);}, interval);  // TODO: use taskManager
            } else {
                $this.load(url);
            }
        });
    };

}(window.jQuery);