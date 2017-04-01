var MAP_C_SERVICE = MAP_C_SERVICE || (function() {
    var matches = /^\/(\w+)\/?/.exec(decodeURI(location.pathname));
    return (matches && matches[1]) ? matches[1] : null;
})();

Function.prototype.applyOnce = function () {
    this.called = false;
    var fn = this;
    return function (){
        if (fn.called) return null;
        fn.called = true;

        return fn.apply(this, arguments);
    }
}

var MAP_C_SERVER_URL = MAP_C_SERVER_URL || (location.protocol + '//' + location.host + '/' + MAP_C_SERVICE);

void function(_, Ext) {
    var DEFAULT_BOX_WIDTH   = 560,
        DEFAULT_BOX_HEIGHT  = 340;

    _(function(){
        // 未登录或登录超时， 弹出登录小窗
        _.ajaxSetup({
            statusCode: {
                401: function(/*XMLHttpRequest*/xhr){ // HTTP_UNAUTHORIZED
                    _.fancybox.open({
                        modal: true,
                        type: 'ajax',
                        href: 'includes/login_form.jsp'
                    });
                },
                500: function(){
                    alert('加载内容失败，请检查程序配置');
                }
            },
            cache: false
        });

        var $loadMask = _('#loading-mask').removeAttr('id');
        _('body').ajaxSend(function(/*jQuery.Event*/evt, /*XMLHttpRequest*/xhr, /*Object*/options){
            var opts = options || {};
            if (!('target' in opts) || !opts.target){
                return;
            }
            _(opts.target).html('').append($loadMask.show());
        }).ajaxComplete(function(/*jQuery.Event*/evt, /*XMLHttpRequest*/xhr, /*Object*/options){
            $loadMask.hide();
        });

		
		
		var $workspace = _('#workspace'),
            $window = _(window), $top = _('#top'), $left = _('#aside_left'), $bottom = _('#bottom'),$right = _('#sub_aside_right'),$center = _('#mid_center'),$new = _("#mid_center .news .span6"),
            wsWidth = 1004, wsHeight = 768,$h1 = $workspace.find('h1');

        $(window).resize(function(){
			wsWidth = Math.max(1004, $window.innerWidth(), $top.innerWidth()) - $left.outerWidth()-16;
				//wsWidth = $workspace.innerWidth();
				wsHeight = Math.max($window.innerHeight() - $workspace.offset().top - $bottom.outerHeight(true), $left.innerHeight());
				
				$workspace.height(wsHeight).width(wsWidth);
				$left.height(wsHeight-6);
				_('#workspace .doc-list').height(wsHeight-6-$h1.outerHeight(true));
				$center.width(wsWidth-$right.width()-10);
				$new.width(($center.width()-10)/2);
        }).trigger('resize');		

        var onWorkspaceContentLoad = function(){
            var $h1 = $workspace.find('h1'),
                extPanelId = $workspace.find('.x-panel:first').attr('id');
            if (extPanelId && $h1.onlyOne()) {
                //Ext.getCmp(extPanelId).setHeight(wsHeight - 6 - $h1.outerHeight(true));
            }
			wsHeight = Math.max($window.innerHeight() - $workspace.offset().top - $bottom.outerHeight(true), $left.innerHeight());
			_('#workspace .doc-list').height(wsHeight-6-$h1.outerHeight(true));
            _.triggerOfDefaultElementIn($workspace)();
        };
		
		// 单独打开某页面的入口。如：approval/documents_todo.jsp，通过jsp_utilities.jsp中
		// redirectOnNonAjaxRequest方法处理成approval/index.jsp?_preload=approval/documents_todo.jsp
        var preLoadPage = _.getUrlParam('_preload');
        preLoadPage && $workspace.load(preLoadPage.addUrlParam({
                            w : wsWidth - 6,
                            h : wsHeight - 6
                        }), onWorkspaceContentLoad);

        function logout() {
            _.post(
                MAP_C_SERVER_URL + '/rfc.do?__web=1&__out=1&&logout=1',
                {__webCall:'WebLogout', __webParaCount: 0, _method: 'post'},
                function(ret){
                    if ( true == ret) {
                        top.location.href = "login.jsp";
                    }
                },
                'json'
            );
        }

        _('#logout').click(function(/*jQuery.Event*/evt){
            window.confirm("确定退出?") && logout();

            return evt.preventDefault() && false;
        });

        _('.lib_tab').each(function(){
            var $tabCt = _(this),
                $tabHeader = $tabCt.find('.tab_head li[data-tab-panel]'),
                $tabContent = $tabCt.find('.tab_item');

            $tabHeader.mouseover(function(){
                var $tab = _(this), tabContentId = $tab.data('tab-panel');
                $tabHeader.removeClass('hover');
                $tab.addClass('hover');

                $tabContent.hide();
                $tabCt.find(tabContentId).show();
                
                _('.fl_right').find('form').each(function(){_(this).hide()})
                _('.fl_right .'+$tab.data('tab-panel').replace('#','')).show();
            });
        });
		
        var loadWorkspaceContentByLink = function(/*jQuery.Event*/evt){
            Ext.destroyLegacyComponents();

            _.fancybox.close(true);

            $workspace.load(_(this).attr('href').addUrlParam({
                w : $workspace.innerWidth() - 6,
                h : $workspace.innerHeight() - 6
            }), onWorkspaceContentLoad);

            _(this).activeMenuItem();

            return evt.preventDefault() && false;
        };

        // 向 workspace 容器 ajax加载内容的链接
        _('.ws-load[href]').live('click', loadWorkspaceContentByLink);

        // 向指定容器 ajax加载内容的链接
        _('.ajax-load[href]').live('click', function(/*jQuery.Event*/evt){
            var $this = _(this),
                href = $this.attr('href').addUrlParam($this.data('ajax-params')), // 参数同样要给form
                formRel = $this.data('form-rel'),
                target = $this.data('ajax-target');
            _.fancybox.close(true);
            $this.activeMenuItem($workspace);

            formRel ?
                _(formRel).attr('action', href).submit() :
                _(target).load(href, _.triggerOfDefaultElementIn(target));

            return evt.preventDefault() && false;
        });
        
        // 隐性的ajax表单提交
        _('.imply-submit').live('click', function(/*jQuery.Event*/evt){
            var $this = _(this),
                form = $this.data('form'),
                $form = form ? _(form) : _(this).closest('form');

            $form.submit();
            return !$this.is('a') || (evt.preventDefault() && false);
        });

        _('#form-todo-x-filter-index').ajaxForm({
            target: '#doc-todo-list'
        }).submit();
        
        _('#form-toread-x-filter-index').ajaxForm({
        	target: '#doc-toread_list'
        }).submit();

        _('.collapse-toggle').live('click', function(/*jQuery.Event*/evt){
            var $this = _(this),
                collapsibleElement = $this.data('el-rel'),
                $collapsibleElement = collapsibleElement ? _(collapsibleElement):
                    $this.next(':first');

            $this.hasClass('collapsed') ? $collapsibleElement.slideDown():$collapsibleElement.slideUp();
            $this.switchClass('collapsed', 'expanded');

            return evt.preventDefault() && false;
        });

        // invalidate empty link
        _('a[href=#], a[href=""]').off('click').die('click').live('click', function(/*jQuery.Event*/evt){
            return evt.preventDefault() && false;
        });

        _('.a_self_time').live('click', function(/*jQuery.Event*/evt){
            var $ct = _('.self_time'), $box = _('.self_time_box');
            $ct.hasClass('active') ? $box.slideDown() : $box.slideUp();
            $ct.toggleClass('active');

            return evt.preventDefault() && false;
        });
        _('.i_close').live('click',function(/*jQuery.Event*/evt){
            _('.self_time').removeClass('active');

            return evt.preventDefault() && false;
        });

        _('.toggle-fav').live('click', function(/*jQuery.Event*/evt){
            var $this = _(this);
            _.post('add2fav.jsp', {
                    bk: $this.data('metakey'),
                    id: $this.data('billid'),
                    dt: $this.data('appdate'),
                    dir: $this.hasClass('fav-on') ? '0' : '1'
                }, function(ret){
                    true === ret ? $this.addClass('fav-on') : $this.removeClass('fav-on');
                }, 'json');

            return evt.preventDefault() && false;
        });

        _('.disabled').die('click').click(function(/*jQuery.Event*/evt){
            return evt.preventDefault() && false;
        });
        // 待办中查看状态
        _('.wf-state').live('click',function(/*jQuery.Event*/evt){
        	 var $this = _(this);
        	 var href = $this.data('href');
        	_.fancybox.open({
                modal: true,
                type: 'ajax',
                href: href
           	 });
           (function(){_.fancybox.close()}).defer(100);
        });

        //查询中心 展开 收起
        _('.search_up').live('click', function(/*jQuery.Event*/evt){
            block_up_down(_('.search_high_block'),_('.search_normal_block'));
            return evt.preventDefault() && false;
        });
        _('.search_down').live('click', function(/*jQuery.Event*/evt){
            block_up_down(_('.search_normal_block'),_('.search_high_block'));
            return evt.preventDefault() && false;
        });
        function block_up_down(x1,x2){
            x1.slideDown();
            x2.slideUp();
        }
     
        //业务单据加载中。。。（何时触发此函数？？？Ext.namespace("MAP.ui");此命名空间如何引入？）
        function showMask(_flag, tip){
            var maskCount = 0;
            if(_flag){
                maskCount++;
            }
            else{
                maskCount--;
            }
            var bShow = (maskCount>0);
            if(bShow && Ext.get('loading-tip')) {
                tip = tip ? tip : '正在加载中...';
                Ext.get('loading-tip').dom.innerHTML = tip;
            }
            showElement('loading-mask2', bShow, 0); // 显示透明遮罩层
            showElement('loading', bShow, 100); // 显示loading图
        }
		
        function showElement(eleId, _flag, opacity) {
            var mask = Ext.get(eleId);
            if (mask) {
                var isVisible = mask.isVisible();
                if (_flag && !isVisible) {
                    mask.setOpacity(opacity); // IE8 的css不好用?
                    mask.setVisible(true);
                } else if(!_flag && isVisible) {
                    mask.setVisible(false);
                }
            }
        }

        _('[tabindex=0]').focus();
		// 简报删除 
		_('#del_my_brief').live('click',function(){
	    	if (window.confirm("确定删除?")) {
	    		var BIDS = [];
	    		_('input[name=myselect]:checked').each(function(){
	    			BIDS.push(parseInt(_(this).val()));
	    		});
	    		if (BIDS.length <=0) return;
	    		var BATCHOPTBILL = MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=batchdeletebill({briefReports},{'+BIDS+'})';
				_.post(BATCHOPTBILL, function (_resJson) {
	                if (true === _resJson) {
			            _('#brief-report-query-list').load("my_brief_report_query_list.jsp");
	                }
	            }, 'json');
	    	}
		});
		// 简报全选
		_('#sel_all_brief').live('click',function(){
    		var all_checked = _(this)[0].checked;
    		_('input[name=myselect]').each(function(){
    			_(this).attr('checked',all_checked);
    		});
    	});
    	
	    // 草稿箱删除
    	_('#del_my_draft').live('click',function(){
        	if (window.confirm("确定删除?")) {
	    		var BIDS = new Array();
	    		_('input[name=myselect]:checked').each(function(){
	    			BIDS.push(_(this).val());
	    		});
				alert(BIDS);
	    		//if (BIDS.length <=0) return;
	    		var BATCHOPTBILL = MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=web.AVIC.batchDeleteDraft({OA_WFList},{999})';
				_.post(BATCHOPTBILL, function (_resJson) {
	                    if (true === _resJson) {
				            _('#workspace').load("documents_draft_query_list.jsp?billKey=WF_Draft");
	                    }
	            }, 'json');
        	}
		});
		
		// 草稿箱全选
    	_('#sel_all_draft').live('click',function(){
    		var all_checked = _(this)[0].checked;
    		_('input[name=myselect]').each(function(){
    			_(this).attr('checked',all_checked);
    		});
	    });
		
		// 新建电子审批
		_('#createEle').on('click',function(){
			_.fancybox.open({
				modal: true,
				type: 'ajax',
				href: 'documents_create.jsp'
			});
		});
		
		// 新建电子审批得到的选项
		_('.lib-tab .tab-head li').live('click',function(){
			// 设置当前的样式hover,将其它选项去除hover样式（流程类型）
			_(this).addClass('hover').siblings().removeClass("hover");
			// 去除所有的hover样式（表单）
			_('.lib-tab .tab-content a').siblings().removeClass("hover");
			// 流程类型的ID
			var flowtypeID = _(this).children()[0].id;
			_('.lib-tab .tab-content').load('documents_create_bill.jsp?ID='+flowtypeID);
		});
		
		// 电子审批右侧表单
		_('.lib-tab .tab-content a').live('click',function(){
			_(this).addClass('hover').siblings().removeClass("hover");
		});
		
		// 新建确定按钮
		_('#create-ok').live('click',function(){
			if (_('.lib-tab .tab-content a').hasClass('hover')){
				_('.lib-tab .tab-content a').each(function(){
					if (_(this).hasClass('hover')) {
						var metaKey = _(this).attr('name');
						var scommand = metaKey;
						Ext.destroyLegacyComponents();
						_.fancybox.close(true);
						var width = $workspace.innerWidth()-6;
						var heigth = $workspace.innerHeight() - 6;
						$workspace.load('add_document.jsp?type='+scommand+'&w='+width+'&h='+heigth);
						_(this).activeMenuItem();
					};
				});
			} else {
				alert('请选择表单');
			}
		});
		
		// 新建取消按钮
		_('#create-cancel').live('click',function(){
			_.fancybox && _.fancybox.close(true);
		});
		
		// 首页创建流程跳转
		var create_default = _.getUrlParam('_create');
		if (create_default && create_default.indexOf(1) != -1) {
			_.fancybox.open({
				modal: true,
				type: 'ajax',
				href: 'documents_create.jsp'
			});
		}
		
		_('#issue_document').fancybox({
            width: 590,
            height: 310,
            autoSize: false,
            type: 'inline',
            content: _('#issue_document_types').html()
        });
		
	});
}(window.jQuery, window.Ext);
